import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { createJobApi } from "../../api/jobApi.js";
import { toast } from "react-hot-toast"; // 🌟 Imported Toast notification engine
import { 
  Briefcase, MapPin, IndianRupee, Building2, 
  FileText, Clock, Sparkles 
} from "lucide-react";

const PostJobForm = () => {
  const navigate = useNavigate(); 

  // 1. Initial State synchronized exactly to Mongoose Schema Fields
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: "full-time", 
    description: ""
  });

  const [loading, setLoading] = useState(false);

  // 2. Dynamic multi-input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload scrubbing: Ensure number formats match model constraints
    const submissionPayload = {
      ...formData,
      salary: Number(formData.salary)
    };

    try {
      const response = await createJobApi(submissionPayload);
      
      if (response.success || response) {
        // 🌟 Replaced status bar state with a clean global toast notification
        toast.success("Position successfully registered! Redirecting...");
        
        // Reset local data values on success
        setFormData({
          title: "",
          companyName: "",
          location: "",
          salary: "",
          jobType: "full-time",
          description: ""
        });

        // Redirect to Recruiter Workspace after a smooth 1.5s delay
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Job posting error:", err);
      // 🌟 Replaced status bar error with error toast notifications
      toast.error(err.response?.data?.message || "Failed to register this opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto text-foreground">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-3">
          <Sparkles size={12} /> Live Workspace
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create a Job Opening</h1>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          Fill out the metadata constraints below to broadcast a new opening across your candidate platform pools.
        </p>
      </div>

      {/* CORE ENTRY FORM GRID */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. JOB TITLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase size={14} className="text-primary" /> Job Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Full Stack Web Engineer"
              className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
          </div>

          {/* 2. COMPANY NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 size={14} className="text-primary" /> Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., Cozy Bistro Tech Labs"
              className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
          </div>

          {/* 3. LOCATION */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" /> Geographic Location <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, IN (or Remote)"
              className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
          </div>

          {/* 4. SALARY RANGE (RUPEES STANDARD) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <IndianRupee size={14} className="text-primary" /> Yearly Salary (₹ / LPA) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              name="salary"
              required
              min="0"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., 800000"
              className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* 5. JOB TYPE SELECTION DROPDOWN */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock size={14} className="text-primary" /> Engagement Model <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background cursor-pointer appearance-none transition-all"
            >
              <option value="full-time" className="bg-card text-foreground">💼 Full-Time Employment</option>
              <option value="part-time" className="bg-card text-foreground">⏱️ Part-Time Position</option>
              <option value="internship" className="bg-card text-foreground">🎓 Internship Program</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground/70">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* 6. EXTENDED JOB DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText size={14} className="text-primary" /> Role Overview & Requirements <span className="text-destructive">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline structural competencies, expectations, requirements, and tech stack proficiencies..."
            className="w-full p-4 bg-secondary/10 border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all leading-relaxed resize-none scrollbar-thin"
          />
        </div>

        {/* SUBMIT BUTTON TRIGGER CONTAINER */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "Broadcast Vacancy"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default PostJobForm;