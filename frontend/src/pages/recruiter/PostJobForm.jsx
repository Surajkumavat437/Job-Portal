import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { createJobApi } from "../../api/jobApi.js";
import { toast } from "react-hot-toast";
import { 
  Briefcase, MapPin, IndianRupee, Building2, 
  FileText, Clock, Sparkles 
} from "lucide-react";

import FormInputField from "./components/FormInputField";
import FormSelectField from "./components/FormSelectField";

const PostJobForm = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: "full-time", 
    description: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionPayload = {
      ...formData,
      salary: Number(formData.salary)
    };

    try {
      const response = await createJobApi(submissionPayload);
      
      if (response.success || response) {
        toast.success("Position successfully registered! Redirecting...");
        
        setFormData({
          title: "",
          companyName: "",
          location: "",
          salary: "",
          jobType: "full-time",
          description: ""
        });

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Job posting error branch caught:", err);
      toast.error(err.response?.data?.message || "Failed to register this opportunity.");
    } finally {
      setLoading(false);
    }
  };

  const jobTypeOptions = [
    { value: "full-time", label: "💼 Full-Time Employment" },
    { value: "part-time", label: "⏱️ Part-Time Position" },
    { value: "internship", label: "🎓 Internship Program" }
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto text-foreground animate-fade-in">
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

      {/* CORE ENTRY FORM CONFIG */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInputField
            label="Job Title"
            icon={Briefcase}
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Full Stack Web Engineer"
          />

          <FormInputField
            label="Company Name"
            icon={Building2}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Cozy Bistro Tech Labs"
          />

          <FormInputField
            label="Geographic Location"
            icon={MapPin}
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Bangalore, IN (or Remote)"
          />

          <FormInputField
            label="Yearly Salary (₹ / LPA)"
            icon={IndianRupee}
            name="salary"
            type="number"
            required
            min="0"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., 800000"
          />
        </div>

        <FormSelectField
          label="Engagement Model"
          icon={Clock}
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          options={jobTypeOptions}
        />

        {/* DESCRIPTION AREA */}
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

        {/* SUBMISSION EXECUTION LAYER */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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