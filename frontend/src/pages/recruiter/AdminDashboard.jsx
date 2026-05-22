import React, { useEffect, useState } from "react";
import { getRecruiterPipelines, updateApplicationStatusApi, deleteJobApi, updateJobApi } from "../../api/jobApi.js";
import { toast } from "react-hot-toast"; // 🌟 Imported Toast notification engine
import { 
  Briefcase, Users, Calendar, Mail, ShieldAlert, 
  X, FileText, ExternalLink, GraduationCap, Code2, User, Settings2,
  ChevronDown, Trash2, Edit3, IndianRupee, Save, MapPin
} from "lucide-react";
import Spinner from "../../components/ui/Spinner.jsx";

const AdminDashboard = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Editing state trackers
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

  // 🗑️ HANDLE JOB DELETION
  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmation = window.confirm(`Are you absolutely sure you want to delete "${jobTitle}"? This will permanently remove all associated applications.`);
    if (!confirmation) return;

    try {
      const response = await deleteJobApi(jobId);
      if (response.success || response) {
        // 🌟 Success Toast Notification
        toast.success("Vacancy listing removed successfully.");
        // Smoothly filter out deleted listing block state locally
        setPipelines((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (err) {
      // 🌟 Replaced fallback alert with an error toast
      toast.error(err.response?.data?.message || "Failed to delete this vacancy position.");
    }
  };

  // 📝 INITIATE EDIT SUB-FORM
  const startEditing = (job) => {
    setEditingJobId(job._id);
    setEditFormData({
      salary: job.salary || "",
      location: job.location || ""
    });
  };

  // 💾 SAVE UPDATED PARAMETERS
  const handleSaveJobUpdate = async (jobId) => {
    try {
      const scrubbedPayload = {
        ...editFormData,
        salary: Number(editFormData.salary)
      };

      const response = await updateJobApi(jobId, scrubbedPayload);
      if (response.success || response) {
        // 🌟 Success Toast Notification
        toast.success("Role properties updated successfully!");
        setPipelines((prev) =>
          prev.map((job) =>
            job._id === jobId 
              ? { ...job, salary: scrubbedPayload.salary, location: scrubbedPayload.location }
              : job
          )
        );
        setEditingJobId(null); // Clear editing view toggles
      }
    } catch (err) {
      // 🌟 Replaced fallback alert with an error toast
      toast.error(err.response?.data?.message || "Failed to modify role properties.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <Spinner />
      </div>
    );
  }

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
      {/* HEADER ROW */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recruiter Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your active vacancies, modify parameters, and manage incoming evaluation pipelines.
        </p>
      </div>

      {/* VACANCY BLOCKS LOOP */}
      {pipelines.length === 0 ? (
        <div className="border border-dashed border-border rounded-[2rem] p-12 text-center bg-card/30">
          <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No jobs listed yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create a position to start tracking applications.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pipelines.map((job) => (
            <div 
              key={job._id} 
              className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden"
            >
              {/* JOB METADATA BANNER */}
              <div className="p-6 bg-secondary/20 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                    {job.jobType || "Full-Time"}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.companyName || "Your Company"}</p>
                  
                  {/* INLINE EDIT MODE OR STATIC FIELD META VIEW */}
                  {editingJobId === job._id ? (
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1 rounded-xl">
                        <IndianRupee size={13} className="text-muted-foreground" />
                        <input 
                          type="number"
                          value={editFormData.salary}
                          onChange={(e) => setEditFormData({...editFormData, salary: e.target.value})}
                          className="w-24 bg-transparent border-none text-xs focus:outline-none p-0"
                          placeholder="Salary"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1 rounded-xl">
                        <MapPin size={13} className="text-muted-foreground" />
                        <input 
                          type="text"
                          value={editFormData.location}
                          onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                          className="w-28 bg-transparent border-none text-xs focus:outline-none p-0"
                          placeholder="Location"
                        />
                      </div>
                      <button 
                        onClick={() => handleSaveJobUpdate(job._id)}
                        className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button 
                        onClick={() => setEditingJobId(null)}
                        className="p-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-muted-foreground text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4 pt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground bg-secondary/40 px-2 py-0.5 rounded-md">
                        <IndianRupee size={12} className="text-primary" /> {job.salary?.toLocaleString('en-IN') || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.location || "Remote"}
                      </span>
                    </div>
                  )}
                </div>

                {/* MANAGEMENT COMMAND TRIGGERS */}
                <div className="flex items-center gap-4 shrink-0 justify-between border-t border-border/40 md:border-none pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{job.applications?.length || 0}</span> Applicants
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingJobId !== job._id && (
                      <button 
                        onClick={() => startEditing(job)}
                        className="p-2 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground rounded-xl transition-all"
                        title="Modify Position Metadata"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteJob(job._id, job.title)}
                      className="p-2 bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 text-destructive/80 hover:text-destructive rounded-xl transition-all"
                      title="Delete Vacancy Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* APPLICANTS TABLE SUB-SECTION */}
              <div className="p-6">
                {(!job.applications || job.applications.length === 0) ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No candidates have applied to this role yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border text-xs font-bold uppercase text-muted-foreground tracking-wider">
                          <th className="p-4">Candidate Name</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Applied Date</th>
                          <th className="p-4 text-right">Pipeline Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {job.applications.map((app) => (
                          <tr 
                            key={app.applicationId || app._id} 
                            onClick={() => openApplicantDrawer(app)}
                            className="hover:bg-primary/5 cursor-pointer transition-colors group"
                          >
                            <td className="p-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                              {app.jobSeeker?.name || "Anonymous Applicant"}
                            </td>
                            <td className="p-4 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
                                {app.jobSeeker?.email || "N/A"}
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent"}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                                app.status === "selected"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : app.status === "rejected"
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : app.status === "reviewed"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              }`}>
                                {app.status || "applied"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BACKDROP BLUR FOR OPEN DRAWER LAYER */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={closeApplicantDrawer}
        />
      )}

      {/* APPLICANT PROFILE EXTENDED DRAWER PANEL */}
      <div className={`fixed top-0 bottom-0 right-0 h-screen w-full sm:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out transform ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {selectedApplicant && (
          <>
            {/* DRAWER PANEL HEADER */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-base font-bold">
                  {selectedApplicant.jobSeeker?.name?.[0] || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{selectedApplicant.jobSeeker?.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedApplicant.jobSeeker?.email}</p>
                </div>
              </div>
              <button 
                onClick={closeApplicantDrawer}
                className="p-2 rounded-xl hover:bg-secondary border border-border text-muted-foreground transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* DRAWER PANEL CONTENT BODY (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* CUSTOM THEMED APPLICATION PIPELINE STATE DROPDOWN */}
              <div className="space-y-2.5 p-4 bg-secondary/10 border border-border rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Settings2 size={14} className="text-primary" /> Application Pipeline State
                </h4>
                
                <div className="relative mt-2 group">
                  <select 
                    value={selectedApplicant.status || "applied"}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const targetId = selectedApplicant.applicationId || selectedApplicant._id;
                      
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
                        // 🌟 Added custom status tracker toast
                        toast.success(`Pipeline status updated to ${newStatus.replace('_', ' ')}`);
                        
                      } catch (err) {
                        // 🌟 Replaced fallback alert with an error toast
                        toast.error(err.response?.data?.message || "Failed to update pipeline status.");
                      }
                    }}
                    className="w-full p-3 pr-10 bg-card border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-secondary/20 transition-all duration-200 appearance-none shadow-inner"
                  >
                    <option value="applied" className="bg-card text-foreground p-3">⏳ Applied / In Review</option>
                    <option value="reviewed" className="bg-card text-foreground p-3">👀 Profile Reviewed</option>
                    <option value="selected" className="bg-card text-foreground p-3">🎉 Shortlisted & Selected</option>
                    <option value="rejected" className="bg-card text-foreground p-3">❌ Application Rejected</option>
                  </select>

                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* ATTACHED RESUME BLOCK */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" /> Attached Resume
                </h4>
                {selectedApplicant.jobSeeker?.profile?.resume ? (
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                        <FileText size={22} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate max-w-[220px]">
                          {selectedApplicant.jobSeeker.name.toLowerCase().replace(/\s+/g, "_")}_cv.pdf
                        </p>
                        <p className="text-[11px] text-muted-foreground">Cloudinary Document Provider</p>
                      </div>
                    </div>
                    <a 
                      href={selectedApplicant.jobSeeker.profile.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic bg-secondary/10 p-3 rounded-xl border border-border border-dashed">
                    No active resume file path attached to this user profile.
                  </p>
                )}
              </div>

              {/* CANDIDATE PROFESSIONAL BIO */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User size={14} className="text-primary" /> Professional Bio
                </h4>
                <p className="text-sm text-foreground/90 bg-secondary/10 p-4 rounded-2xl border border-border leading-relaxed">
                  {selectedApplicant.jobSeeker?.profile?.bio || "No custom introductory overview provided by applicant."}
                </p>
              </div>

              {/* TECHNICAL SKILLS BLOCK */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Code2 size={14} className="text-primary" /> core competency & Skills
                </h4>
                {selectedApplicant.jobSeeker?.profile?.skills && selectedApplicant.jobSeeker.profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.jobSeeker.profile.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No listed core skills tags on file.</p>
                )}
              </div>

              {/* EXPERIENCE BLOCK */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase size={14} className="text-primary" /> Professional Experience
                </h4>
                <p className="text-sm text-foreground/90 bg-secondary/10 p-4 rounded-2xl border border-border leading-relaxed">
                  {selectedApplicant.jobSeeker?.profile?.experience || "No previous experience listed."}
                </p>
              </div>

              {/* GRADUATION AND EDUCATION META */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-primary" /> Educational background
                </h4>
                <div className="p-4 bg-secondary/10 rounded-2xl border border-border">
                  <p className="text-sm font-semibold leading-relaxed">
                    {selectedApplicant.jobSeeker?.profile?.education || "Educational details unlisted"}
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;