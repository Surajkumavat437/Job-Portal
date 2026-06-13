import React, { useEffect, useState } from "react";
import { getRecruiterPipelines, updateApplicationStatusApi, deleteJobApi, updateJobApi } from "../../api/jobApi.js";
import { toast } from "react-hot-toast";
import { Briefcase, ShieldAlert } from "lucide-react";
import Spinner from "../../components/ui/Spinner.jsx";

// Submodule layout layers
import PipelineJobCard from "./components/PipelineJobCard";
import ApplicantDetailDrawer from "./components/ApplicantDetailDrawer";

const AdminDashboard = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({ salary: "", location: "" });

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await getRecruiterPipelines();
        if (response.success) {
          setPipelines(response.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPipelines();
  }, []);

  const openApplicantDrawer = (applicant) => {
    setSelectedApplicant(applicant);
    setIsDrawerOpen(true);
  };

  const closeApplicantDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedApplicant(null), 300);
  };

  // 🗑️ DELETE LISTING ENG
  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmation = window.confirm(`Are you absolutely sure you want to delete "${jobTitle}"? This will permanently remove all associated applications.`);
    if (!confirmation) return;

    try {
      const response = await deleteJobApi(jobId);
      if (response.success || response) {
        toast.success("Vacancy listing removed successfully.");
        setPipelines((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete this vacancy position.");
    }
  };

  // 📝 FORMS INITIATION
  const startEditing = (job) => {
    setEditingJobId(job._id);
    setEditFormData({
      salary: job.salary || "",
      location: job.location || ""
    });
  };

  // 💾 CORE SAVING PIPELINE
  const handleSaveJobUpdate = async (jobId) => {
    try {
      const scrubbedPayload = {
        ...editFormData,
        salary: Number(editFormData.salary)
      };

      const response = await updateJobApi(jobId, scrubbedPayload);
      if (response.success || response) {
        toast.success("Role properties updated successfully!");
        setPipelines((prev) =>
          prev.map((job) =>
            job._id === jobId 
              ? { ...job, salary: scrubbedPayload.salary, location: scrubbedPayload.location }
              : job
          )
        );
        setEditingJobId(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to modify role properties.");
    }
  };

  // ⚙️ INTERACTIVE PIPELINE STATE MUTATION BRIDGE
  const handleStatusChange = async (applicant, newStatus) => {
    const targetId = applicant.applicationId || applicant._id;
    try {
      await updateApplicationStatusApi(targetId, newStatus);
      
      setPipelines((prevPipelines) =>
        prevPipelines.map((job) => ({
          ...job,
          applications: job.applications.map((app) =>
            (app.applicationId === targetId || app._id === targetId)
              ? { ...app, status: newStatus }
              : app
          ),
        }))
      );

      setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Pipeline status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update pipeline status.");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[70vh] w-full"><Spinner /></div>;

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-foreground relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recruiter Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your active vacancies, modify parameters, and manage incoming evaluation pipelines.
        </p>
      </div>

      {pipelines.length === 0 ? (
        <div className="border border-dashed border-border rounded-[2rem] p-12 text-center bg-card/30">
          <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No jobs listed yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create a position to start tracking applications.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pipelines.map((job) => (
            <PipelineJobCard
              key={job._id}
              job={job}
              editingJobId={editingJobId}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              onStartEdit={startEditing}
              onCancelEdit={() => setEditingJobId(null)}
              onSaveUpdate={handleSaveJobUpdate}
              onDeleteJob={handleDeleteJob}
              onOpenApplicant={openApplicantDrawer}
            />
          ))}
        </div>
      )}

      <ApplicantDetailDrawer
        isOpen={isDrawerOpen}
        applicant={selectedApplicant}
        onClose={closeApplicantDrawer}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminDashboard;