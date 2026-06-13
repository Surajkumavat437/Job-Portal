import React from "react";
import { ArrowLeft, MapPin, Briefcase, Building2 } from "lucide-react";

const JobDetailsHeader = ({ job, checkingProfile, onApply, onBack }) => {
  return (
    <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-3 w-full md:w-auto">
        <div className="flex items-center gap-3">
          {/* HIGH-CONTRAST INTERACTIVE ACTION BACK TOGGLE */}
          <button 
            onClick={onBack} 
            className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Back to Home"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">{job.title}</h1>
            <p className="text-primary font-bold text-sm">{job.companyName}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1 pl-14">
          <div className="flex items-center gap-1"><MapPin size={16} /> {job.location || "Remote"}</div>
          <div className="flex items-center gap-1"><Briefcase size={16} /> {job.jobType || "Full-Time"}</div>
          <div className="flex items-center gap-1">
            <span className="text-foreground font-bold">₹{job.salary?.toLocaleString('en-IN') || "N/A"}</span> / year
          </div>
        </div>
      </div>

      {/* FIREWALL PIPELINE SUBMIT SWITCHER */}
      <button 
        onClick={onApply}
        disabled={checkingProfile}
        className="w-full md:w-auto cursor-pointer bg-primary text-primary-foreground px-8 h-12 rounded-xl text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
      >
        {checkingProfile ? "Processing Account Data..." : "Submit Application"}
      </button>
    </div>
  );
};

export default JobDetailsHeader;