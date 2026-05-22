import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bookmark, MapPin, Briefcase } from "lucide-react";
import API from "../../api/axios.js"; // 🌟 FIX: Use your central Axios instance matching port 3000
import { toast } from "react-hot-toast";

const JobCard = ({ job, initialIsSaved = false }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialIsSaved); 
  const [loading, setLoading] = useState(false);

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleApplyClick = () => {
    if (job?._id) navigate(`/jobs/${job._id}`);
    else if (job?.id) navigate(`/jobs/${job.id}`);
  };

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stops any parent component redirection handlers
    if (loading) return;

    setLoading(true);
    try {
      // 🌟 FIX: Hits http://localhost:3000/api/user/saved-jobs/:id seamlessly via your utility
      const response = await API.post(`/user/saved-jobs/${job._id || job.id}`);

      if (response.data.success) {
        setIsSaved(response.data.isSaved);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      toast.error(error.response?.data?.message || "Failed to update bookmark status.");
    } finally {
      setLoading(true); // Keeps it true for a fraction of a second to prevent double-clicks
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
      
      {/* LEFT SECTION: Title & Company */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-foreground leading-tight">{job.title}</h2>
          {/* Bookmark for Mobile only */}
          <button 
            type="button"
            onClick={handleBookmarkToggle}
            disabled={loading}
            className={`md:hidden p-1 transition-colors cursor-pointer ${
              isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
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

      {/* MIDDLE SECTION: Job Type & Salary */}
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
          {/* Bookmark for Desktop */}
          <button 
            type="button" // 🌟 FIX: Explicit button type prevents default bubble behavior
            onClick={handleBookmarkToggle}
            disabled={loading}
            className={`hidden md:flex p-2 rounded-md transition duration-200 cursor-pointer ${
              isSaved 
                ? "text-primary bg-primary/10 hover:bg-primary/20" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {/* 🌟 Dynamic fill: When true, fills with your primary theme color */}
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          
          <button 
            type="button"
            onClick={handleApplyClick}
            className="flex-1 md:flex-none cursor-pointer bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 active:scale-95 transition"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;