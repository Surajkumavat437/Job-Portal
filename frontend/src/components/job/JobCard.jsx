import React from "react";
import { Clock, Bookmark, MapPin, Briefcase } from "lucide-react";

const JobCard = ({ job }) => {
  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
      
      {/* LEFT SECTION: Title & Company */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-foreground leading-tight">{job.title}</h2>
          {/* Bookmark for Mobile only */}
          <button className="md:hidden p-1 text-muted-foreground">
            <Bookmark size={20} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">{job.companyName}</span>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {job.location}
          </div>
          <div className="flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full text-xs">
            <Clock size={12} /> {getTimeAgo(job.createdAt)}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Job Type & Salary (Split on mobile, together on desktop) */}
      <div className="flex items-center justify-between md:justify-center md:gap-8 border-t border-b md:border-none py-3 md:py-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase size={16} />
          {job.jobType}
        </div>
        <span className="text-lg font-bold text-foreground md:hidden">
          ₹{job.salary}
        </span>
      </div>

      {/* RIGHT SECTION: Desktop Salary & Apply Button */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        <span className="hidden md:block text-lg font-bold text-foreground mr-2">
          ₹{job.salary}
        </span>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="hidden md:flex p-2 rounded-md hover:bg-accent transition text-muted-foreground">
            <Bookmark size={20} />
          </button>
          <button className="flex-1 md:flex-none bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;