import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast";

// Module layer distribution scripts
import MissingProfileBanner from "./components/MissingProfileBanner";
import JobDetailsHeader from "./components/JobDetailsHeader";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [checkingProfile, setCheckingProfile] = useState(false);
    const [profileAlert, setProfileAlert] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await API.get(`/jobs/${id}`);
                const targetPayload = response.data?.data || response.data;

                if (targetPayload) {
                    setJob(targetPayload);
                } else {
                    setError("This vacancy position properties could not be parsed.");
                }
            } catch (err) {
                // Security: do not log the raw error object to the console, only surface generic message
                console.error("Job detail gathering error.");
                setError("Could not load job details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchJobDetails();
    }, [id]);

    // APPLICATION ROUTER FIREWALL
    const handleApplyNow = async () => {
        try {
            setCheckingProfile(true);
            setProfileAlert(false);

            const response = await API.get("/user/profile");
            const profile = response.data?.data || response.data;

            if (!profile || !profile.resume || !profile.skills || profile.skills.length === 0) {
                setProfileAlert(true);
                toast.error("Application blocked: Please update your resume and technical skills parameters first.");

                navigate("/dashboard", {
                    state: {
                        from: `/jobs/${id}`,
                        alertReason: "profile_incomplete"
                    }
                });
                return;
            }

            const applyResponse = await API.post(`/applications/${id}`);

            if (applyResponse.data?.success || applyResponse.data) {
                toast.success("Application submitted successfully! Tracking setup initiated.");
                navigate("/home");
            }

        } catch (err) {
            const isProfileEndpointError = err.config?.url?.includes("/user/profile");

            if (err.response?.status === 404 && isProfileEndpointError) {
                toast.error("No active job seeker application profile discovered on your account.");
                navigate("/dashboard", {
                    state: {
                        from: `/jobs/${id}`,
                        alertReason: "no_profile"
                    }
                });
            } else {
                // Security: ensure only backend-provided safe messages or generics are shown
                toast.error(err.response?.data?.message || "Something went wrong while submitting your application.");
            }
        } finally {
            setCheckingProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] w-full text-sm font-medium text-muted-foreground animate-pulse">
                Fetching profile requirements and vacancy meta data...
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-xl mx-auto mt-12 p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold">{error || "Requested vacancy context was dropped or not found."}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

            <MissingProfileBanner
                profileAlert={profileAlert}
                onCompleteProfile={() => navigate("/dashboard")}
            />

            <JobDetailsHeader
                job={job}
                checkingProfile={checkingProfile}
                onApply={handleApplyNow}
                onBack={() => navigate("/home")}
            />

            {/* RUNTIME MARKUP METRICS BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Job Description</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default JobDetails;