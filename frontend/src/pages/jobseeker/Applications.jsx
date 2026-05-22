import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Loader2,
} from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast"; // 🌟 Integrated custom toast notification engine

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const response = await API.get("/applications/me");
        // Robustly normalize data shape variations from the API slice
        const fetchedData = response.data?.data || response.data || [];
        setApplications(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        const fallbackError = err.response?.data?.message || "Failed to load your job applications list.";
        setError(fallbackError);
        toast.error(fallbackError);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  // Helper utility to style application status tags dynamically
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
        };
      case "reviewed":
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          icon: <Clock size={14} className="text-amber-500" />,
        };
      case "rejected":
        return {
          bg: "bg-destructive/10 text-destructive border-destructive/20",
          icon: <XCircle size={14} className="text-destructive" />,
        };
      default: // "applied" or legacy fallbacks
        return {
          bg: "bg-primary/10 text-primary border-primary/20",
          icon: <Clock size={14} className="text-primary" />,
        };
    }
  };

  // Calculate stats by parsing and normalizing text casing securely
  const totalApps = applications.length;
  const acceptedApps = applications.filter(
    (app) => app.status?.toLowerCase() === "accepted"
  ).length;
  const pendingApps = applications.filter(
    (app) => app.status?.toLowerCase() === "applied" || app.status?.toLowerCase() === "reviewed"
  ).length;

  // Client-side quick filter matching search strings against job title or company name
  const filteredApplications = applications.filter((app) => {
    const title = app.job?.title?.toLowerCase() || "";
    const company = app.job?.companyName?.toLowerCase() || "";
    const lowerSearch = searchTerm.toLowerCase();
    return title.includes(lowerSearch) || company.includes(lowerSearch);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Synchronizing applications tracking dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 border border-destructive/20 bg-destructive/5 rounded-2xl flex flex-col items-center text-center gap-3">
        <AlertTriangle className="text-destructive" size={32} />
        <h4 className="font-bold text-destructive text-base">Dashboard Error</h4>
        <p className="text-xs text-muted-foreground">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-xs font-bold underline text-destructive hover:no-underline cursor-pointer"
        >
          Try Refreshing Interface
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Application Tracker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your submission states and recruiter responses in real-time.
        </p>
      </div>

      {/* METRIC CARD WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Applications
            </p>
            <h3 className="text-2xl font-black mt-1 text-foreground">
              {totalApps}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pending Review
            </p>
            <h3 className="text-2xl font-black mt-1 text-amber-500">
              {pendingApps}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Offers Received
            </p>
            <h3 className="text-2xl font-black mt-1 text-emerald-500">
              {acceptedApps}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* SEARCH AND CONTROL ROW */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by role or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/20 text-foreground border border-border h-10 pl-9 pr-4 rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-card transition-all"
          />
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Showing {filteredApplications.length} entry results
        </p>
      </div>

      {/* MAIN APPLICATIONS DISPLAY LOGIC */}
      {filteredApplications.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertTriangle className="mx-auto text-muted-foreground/70 animate-bounce duration-1000" size={32} />
          <h4 className="font-bold text-foreground text-base">
            No Records Matching
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {searchTerm
              ? "No active tracking entries match your query parameters."
              : "You haven't submitted your parameters or resume fields to any available vacancies yet."}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">Position & Company</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredApplications.map((app) => {
                  const statusInfo = getStatusStyles(app.status);
                  const formattedDate = app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-secondary/10 transition-colors group"
                    >
                      {/* Job details col */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {app.job?.title || "Unknown Position"}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">
                          {app.job?.companyName || "Unknown Company"}
                        </div>
                      </td>

                      {/* Location col */}
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin size={14} className="shrink-0 text-muted-foreground/70" />
                          {app.job?.location || "Remote / NA"}
                        </div>
                      </td>

                      {/* Date col */}
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Calendar size={14} className="shrink-0 text-muted-foreground/70" />
                          {formattedDate}
                        </div>
                      </td>

                      {/* Status badge cell */}
                      <td className="p-4 pr-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border select-none ${statusInfo.bg}`}
                        >
                          {statusInfo.icon}
                          <span className="capitalize">{app.status || "applied"}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;