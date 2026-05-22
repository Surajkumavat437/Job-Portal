import React, { useEffect, useState } from "react";
import JobList from "../../components/job/JobList";
import { getJobs } from "../../api/jobApi";
import { Loader2, AlertCircle, SearchX, Search } from "lucide-react"; 
import { toast } from "react-hot-toast"; // 🌟 Integrated custom toast notification engine

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  // SEARCH STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // Holds the query only when they press search/submit

  // Helper reset logic to clear view states cleanly without forcing a hard browser refresh
  const handleRetryFetch = () => {
    setError("");
    setCurrentPage(1);
    setActiveSearch("");
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      // If it's page 1, clear existing layout view to show clean state loader
      if (currentPage === 1) setLoading(true);
      else setFetchingMore(true);

      try {
        // Pass the active search term down to your backend API route controller
        const data = await getJobs({ page: currentPage, limit: 10, search: activeSearch });
        
        // If it's page 1, replace data entirely. If it's a pagination fetch, append data.
        setJobs((prevJobs) => (currentPage === 1 ? data.data : [...prevJobs, ...data.data]));
        
        if (data.totalPages) setTotalPages(data.totalPages);
        setError(""); // Clear layout errors on success
      } catch (err) {
        const fallbackMsg = err.response?.data?.message || "Failed to fetch jobs. Please try again later.";
        setError(fallbackMsg);
        toast.error(fallbackMsg);
      } finally {
        setLoading(false);
        setFetchingMore(false);
      }
    };

    fetchJobs();
  }, [currentPage, activeSearch]); // Re-run whenever page numbers or confirmed search terms change

  // HANDLE SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page context safely
    setActiveSearch(searchQuery); // Set search keyword to trigger the useEffect hook
  };

  return (
    <div className="flex flex-col gap-6 min-h-[80vh] p-4 md:p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Find Your Job
          </h1>
          <p className="text-muted-foreground text-sm">
            Browse the latest opportunities and take the next step in your career.
          </p>
        </div>

        {/* SEARCH BAR SUB-COMPONENT */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center gap-2">
          <div className="flex flex-1 items-center bg-card border border-border rounded-xl h-11 px-3 gap-2 focus-within:border-primary transition-all shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input 
              type="text" 
              placeholder="Search by title, skills, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <button 
            type="submit"
            className="h-11 px-5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <hr className="border-border" />

      {/* CONTENT SECTION */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground font-medium animate-pulse">
              Finding best jobs for you...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-destructive/20 rounded-xl bg-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive mb-3" />
            <h3 className="text-lg font-semibold text-destructive">{error}</h3>
            <button
              onClick={handleRetryFetch}
              className="mt-4 text-sm font-medium underline text-destructive hover:no-underline cursor-pointer"
            >
              Try Resetting Filters
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-accent p-4 rounded-full mb-4">
              <SearchX className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No jobs found</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
              We couldn't find matches for "{activeSearch}". Try adjusting your query keywords.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
            {/* JOBLIST DISPLAYER */}
            <JobList jobs={jobs} />

            {/* SHOW BUTTON UNTIL LAST PAGE REACHED */}
            {currentPage < totalPages && (
              <div className="flex justify-center pb-10">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={fetchingMore}
                  className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {fetchingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Explore More Jobs"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;