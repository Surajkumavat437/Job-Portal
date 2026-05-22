import React, { useEffect, useState } from "react";
import API from "../../api/axios.js"; 
import JobCard from "../../components/job/JobCard.jsx"; 
import { BookmarkIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await API.get("/user/saved-jobs");
        if (response.data?.success) {
          setSavedJobs(response.data.data || []);
        }
      } catch (error) {
        // Replaced production code vulnerabilities (console leaks) with safe UI feedback
        toast.error(error.response?.data?.message || "Failed to parse bookmarked properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
        <div className="h-32 bg-muted rounded-xl"></div>
        <div className="h-32 bg-muted rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <BookmarkIcon className="text-primary w-6 h-6" />
        <h1 className="text-2xl font-bold text-foreground">My Bookmarked Openings</h1>
        <span className="bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold">
          {savedJobs.length} Positions
        </span>
      </div>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-12 text-center bg-card">
          <BookmarkIcon className="text-muted-foreground w-12 h-12 mb-3 stroke-[1.5]" />
          <p className="text-base font-medium text-foreground">Your bookmark pool is empty</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Save job openings you are interested in so you can easily review and apply to them later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((item) => {
            // Defensively optimized extraction setup:
            // Safely handles populated collections whether your backend returns flat job documents or nested properties.
            const jobData = item?.job || item?.jobId || item;
            const uniqueId = item?._id || jobData?._id || item?.id;

            if (!jobData || typeof jobData !== "object") return null;

            return (
              <JobCard 
                key={uniqueId} 
                job={jobData} 
                initialIsSaved={true} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;