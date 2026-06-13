import React from "react";
import { Users, Edit3, Trash2, IndianRupee, MapPin, Save } from "lucide-react";
import ApplicantRow from "./ApplicantRow";

const PipelineJobCard = ({ 
  job, 
  editingJobId, 
  editFormData, 
  setEditFormData, 
  onStartEdit, 
  onCancelEdit, 
  onSaveUpdate, 
  onDeleteJob, 
  onOpenApplicant 
}) => {
  const isEditing = editingJobId === job._id;

  return (
    <div className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden">
      {/* CARD HEADER */}
      <div className="p-6 bg-secondary/20 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            {job.jobType || "Full-Time"}
          </span>
          <h2 className="text-xl font-bold tracking-tight">{job.title}</h2>
          <p className="text-sm text-muted-foreground">{job.companyName || "Your Company"}</p>
          
          {isEditing ? (
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
                onClick={() => onSaveUpdate(job._id)}
                className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <Save size={14} /> Save
              </button>
              <button 
                onClick={onCancelEdit}
                className="p-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-muted-foreground text-xs font-medium cursor-pointer"
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

        {/* CONTROLS */}
        <div className="flex items-center gap-4 shrink-0 justify-between border-t border-border/40 md:border-none pt-4 md:pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{job.applications?.length || 0}</span> Applicants
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button 
                onClick={() => onStartEdit(job)}
                className="p-2 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer"
                title="Modify Position Metadata"
              >
                <Edit3 size={16} />
              </button>
            )}
            <button 
              onClick={() => onDeleteJob(job._id, job.title)}
              className="p-2 bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 text-destructive/80 hover:text-destructive rounded-xl transition-all cursor-pointer"
              title="Delete Vacancy Listing"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* APPLICANTS DATA CONTAINER */}
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
                  <ApplicantRow 
                    key={app.applicationId || app._id} 
                    app={app} 
                    onOpenDetails={onOpenApplicant} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineJobCard;