import React, { useEffect, useState } from "react";
import JobList from "../../components/job/JobList";
import getJobs from "../../api/jobApi";
import { Loader2, AlertCircle, SearchX } from "lucide-react";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs({ page: 1, limit: 10 });
        setJobs(data.data); 
      } catch (err) {
        console.log(err)
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col gap-6 min-h-[80vh] p-4 md:p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Find Your Job
        </h1>
        <p className="text-muted-foreground">
          Browse the latest opportunities and take the next step in your career.
        </p>
      </div>

      <hr className="border-border" />

      {/* CONTENT SECTION */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          /* 1. PROPER LOADING STATE */
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground font-medium animate-pulse">
              Curating best jobs for you...
            </p>
          </div>
        ) : error ? (
          /* 2. ERROR STATE */
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-destructive/20 rounded-xl bg-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive mb-3" />
            <h3 className="text-lg font-semibold text-destructive">{error}</h3>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-medium underline text-destructive hover:no-underline"
            >
              Try Refreshing
            </button>
          </div>
        ) : jobs.length === 0 ? (
          /* 3. EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-accent p-4 rounded-full mb-4">
              <SearchX className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No jobs found</h3>
            <p className="text-muted-foreground max-w-xs">
              We couldn't find any jobs matching your criteria right now.
            </p>
          </div>
        ) : (
          /* 4. ACTUAL CONTENT */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <JobList jobs={jobs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;