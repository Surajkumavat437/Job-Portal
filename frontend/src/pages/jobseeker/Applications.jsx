import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast";

// Sub-Division Component Imports
import ApplicationMetrics from "../../components/applications/ApplicationMetrics.jsx";
import SearchBar from "../../components/applications/SearchBar.jsx";
import ApplicationRow from "../../components/applications/ApplicationRow.jsx";

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
                const fetchedData = response.data?.data || response.data || [];
                setApplications(Array.isArray(fetchedData) ? fetchedData : []);
            } catch (err) {
                // Security: surface safe backend error strings, do not expose raw error properties
                const fallbackError = err.response?.data?.message || "Failed to load your job applications list.";
                setError(fallbackError);
                toast.error(fallbackError);
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, []);

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
        // Security: validate property types before running String prototype methods to prevent TypeError crashes
        const title = typeof app.job?.title === 'string' ? app.job.title.toLowerCase() : "";
        const company = typeof app.job?.companyName === 'string' ? app.job.companyName.toLowerCase() : "";
        const lowerSearch = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : "";
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
            <ApplicationMetrics
                totalApps={totalApps}
                pendingApps={pendingApps}
                acceptedApps={acceptedApps}
            />

            {/* SEARCH AND CONTROL ROW */}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredLength={filteredApplications.length}
            />

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
                                {filteredApplications.map((app) => (
                                    <ApplicationRow key={app._id} app={app} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;