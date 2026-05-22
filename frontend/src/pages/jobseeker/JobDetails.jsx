import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Building2, AlertCircle } from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast"; // 🌟 Integrated custom toast notification engine

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for tracking profile completion checks and submission states
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [profileAlert, setProfileAlert] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/jobs/${id}`);
        
        // Defensive mapping extraction helper logic
        const targetPayload = response.data?.data || response.data;
        if (targetPayload) {
          setJob(targetPayload);
        } else {
          setError("This vacancy position properties could not be parsed.");
        }
      } catch (err) {
        console.error(err)
        setError("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetails();
  }, [id]);

  // THE GUARD & SUBMISSION MECHANISM
  const handleApplyNow = async () => {
    try {
      setCheckingProfile(true);
      setProfileAlert(false);

      // 1. Fetch current profile details to run guard check rules
      const response = await API.get("/user/profile"); 
      const profile = response.data?.data || response.data;

      // 2. Validate absolute minimum criteria before talking to application funnel
      if (!profile || !profile.resume || !profile.skills || profile.skills.length === 0) {
        setProfileAlert(true); // Toggle internal warning panel banner inline state layout view
        toast.error("Application blocked: Please update your resume and technical skills parameters first.");
        
        // Retain deep link history trace redirect parameters seamlessly
        navigate("/dashboard", { 
          state: { 
            from: `/jobs/${id}`, 
            alertReason: "profile_incomplete" 
          } 
        });
        return;
      }

      // 3. SUCCESSFUL VALIDATION: Fire payload into backend database
      const applyResponse = await API.post(`/applications/${id}`); 

      if (applyResponse.data?.success || applyResponse.data) {
        // 🌟 Replaced primitive window alert banner mechanics
        toast.success("Application submitted successfully! Tracking setup initiated.");
        navigate("/home"); 
      }

    } catch (err) {
      // Explicit validation check: Isolate profile-specific 404s from missing endpoint errors
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
        // 🌟 Direct UI toast binding updates mapping fallback parameters cleanly
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
      
      {/* ALERT BOX FOR MISSING PROFILE INFO */}
      {profileAlert && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="shrink-0" />
            <div>
              <p className="font-bold text-sm">Incomplete Profile Information</p>
              <p className="text-xs text-muted-foreground">You must upload a resume and list your skills before applying to positions.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-xs font-bold bg-destructive text-destructive-foreground px-4 py-2 rounded-xl hover:opacity-90 transition cursor-pointer whitespace-nowrap"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* HERO SECTION BLOCK */}
      <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            {/* UPDATED HIGH VISIBILITY BACK BUTTON */}
            <button 
              onClick={() => navigate("/home")} 
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

        {/* CONNECTED SECURE APPLICATION SUBMIT BUTTON */}
        <button 
          onClick={handleApplyNow}
          disabled={checkingProfile}
          className="w-full md:w-auto cursor-pointer bg-primary text-primary-foreground px-8 h-12 rounded-xl text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {checkingProfile ? "Processing Account Data..." : "Submit Application"}
        </button>
      </div>

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