import React from "react";
import { X, Settings2, ChevronDown, FileText, ExternalLink, User, Code2, Briefcase, GraduationCap } from "lucide-react";

const ApplicantDetailDrawer = ({ isOpen, applicant, onClose, onStatusChange }) => {
  return (
    <>
      {/* BACKDROP BLUR LAYER */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* DRAWER LAYER CANVAS */}
      <div className={`fixed top-0 bottom-0 right-0 h-screen w-full sm:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {applicant && (
          <>
            {/* PANEL HEADER */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-base font-bold">
                  {applicant.jobSeeker?.name?.[0] || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{applicant.jobSeeker?.name}</h3>
                  <p className="text-xs text-muted-foreground">{applicant.jobSeeker?.email}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary border border-border text-muted-foreground transition-all active:scale-95 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* PANEL INNER SCROLLING SPACE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* PIPELINE DROP CONTROLLER */}
              <div className="space-y-2.5 p-4 bg-secondary/10 border border-border rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Settings2 size={14} className="text-primary" /> Application Pipeline State
                </h4>
                <div className="relative mt-2 group">
                  <select 
                    value={applicant.status || "applied"}
                    onChange={(e) => onStatusChange(applicant, e.target.value)}
                    className="w-full p-3 pr-10 bg-card border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-secondary/20 transition-all duration-200 appearance-none shadow-inner"
                  >
                    <option value="applied">⏳ Applied / In Review</option>
                    <option value="reviewed">👀 Profile Reviewed</option>
                    <option value="selected">🎉 Shortlisted & Selected</option>
                    <option value="rejected">❌ Application Rejected</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* ATTACHED RESUME */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" /> Attached Resume
                </h4>
                {applicant.jobSeeker?.profile?.resume ? (
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                        <FileText size={22} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate max-w-[220px]">
                          {applicant.jobSeeker.name.toLowerCase().replace(/\s+/g, "_")}_cv.pdf
                        </p>
                        <p className="text-[11px] text-muted-foreground">Cloudinary Document Provider</p>
                      </div>
                    </div>
                    <a 
                      href={applicant.jobSeeker.profile.resume} 
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

              {/* BIO SECTION */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User size={14} className="text-primary" /> Professional Bio
                </h4>
                <p className="text-sm text-foreground/90 bg-secondary/10 p-4 rounded-2xl border border-border leading-relaxed">
                  {applicant.jobSeeker?.profile?.bio || "No custom introductory overview provided by applicant."}
                </p>
              </div>

              {/* SKILLS CHIPS */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Code2 size={14} className="text-primary" /> Core Competency & Skills
                </h4>
                {applicant.jobSeeker?.profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.jobSeeker.profile.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No listed core skills tags on file.</p>
                )}
              </div>

              {/* EXPERIENCES */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase size={14} className="text-primary" /> Professional Experience
                </h4>
                <p className="text-sm text-foreground/90 bg-secondary/10 p-4 rounded-2xl border border-border leading-relaxed">
                  {applicant.jobSeeker?.profile?.experience || "No previous experience listed."}
                </p>
              </div>

              {/* EDUCATION DETAILS */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-primary" /> Educational Background
                </h4>
                <div className="p-4 bg-secondary/10 rounded-2xl border border-border">
                  <p className="text-sm font-semibold leading-relaxed">
                    {applicant.jobSeeker?.profile?.education || "Educational details unlisted"}
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ApplicantDetailDrawer;