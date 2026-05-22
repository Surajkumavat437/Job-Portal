import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Code,
  GraduationCap,
  Briefcase,
  Edit2,
  AlertCircle
} from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast"; // 🌟 Integrated custom toast notification engine

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const returnToJobUrl = location.state?.from || null;
  const alertReason = location.state?.alertReason;

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(!!returnToJobUrl);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experience: "",
    education: "",
    resume: "",
  });

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await API.get("/user/profile");
        const fetchedProfile = response.data?.data || response.data;

        if (fetchedProfile) {
          setProfile(fetchedProfile);

          setFormData({
            bio: fetchedProfile.bio || "",
            skills: fetchedProfile.skills?.join(", ") || "",
            experience: fetchedProfile.experience || "",
            education: fetchedProfile.education || "",
            resume: fetchedProfile.resume || "",
          });
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // RESUME UPLOAD
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF document file.");
      return;
    }

    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloudName) {
      toast.error("Cloudinary deployment environment configurations are missing.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);

    try {
      setUploadingFile(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const fileData = await res.json();

      if (!res.ok) {
        throw new Error(
          fileData.error?.message || "Cloudinary upload failed"
        );
      }

      setFormData((prev) => ({
        ...prev,
        resume: fileData.secure_url,
      }));

      toast.success("Resume asset synchronized successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process asset upload pipeline.");
    } finally {
      setUploadingFile(false);
    }
  };

  // SAVE PROFILE
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData,
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      };

      const response = await API.put("/user/profile", formattedData);
      const updatedProfile = response.data?.data || response.data;

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile parameters synchronized successfully!");

      if (returnToJobUrl) {
        navigate(returnToJobUrl);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update target user profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full text-sm font-medium text-muted-foreground animate-pulse">
        Assembling candidate dashboard records...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {alertReason && (
        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>Please complete your background resume layout and skills metrics before submitting job applications.</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile options and resume attachments
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all cursor-pointer border border-border"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* EDIT MODE */}
      {isEditing ? (
        <form
          onSubmit={handleFormSubmit}
          className="bg-card border border-border rounded-[2rem] p-6 md:p-8 space-y-5 shadow-sm"
        >
          <h2 className="text-xl font-bold text-foreground">
            Update Your Profile
          </h2>

          {/* BIO */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/70">
              Professional Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              placeholder="Tell recruiters about your engineering goals..."
              className="w-full min-h-24 bg-secondary/20 border border-border rounded-xl p-3 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* SKILLS + RESUME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKILLS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value,
                  })
                }
                placeholder="Java, React, Node.js, MongoDB"
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* RESUME */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70">
                Upload Resume (PDF)
              </label>
              <div className="flex items-center gap-3 bg-secondary/10 border border-border rounded-xl p-2 h-12 overflow-hidden">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingFile}
                  className="block w-full text-xs text-muted-foreground
                  file:mr-3
                  file:py-1.5
                  file:px-3
                  file:rounded-lg
                  file:border-0
                  file:text-xs
                  file:font-bold
                  file:bg-primary/10
                  file:text-primary
                  file:cursor-pointer
                  hover:file:bg-primary/20"
                />

                {uploadingFile && (
                  <span className="text-xs text-primary font-bold animate-pulse shrink-0 pr-2">
                    Syncing...
                  </span>
                )}
              </div>

              {formData.resume && !uploadingFile && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Active PDF path mapped to account profile
                </p>
              )}
            </div>
          </div>

          {/* EDUCATION + EXPERIENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EDUCATION */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70">
                Education background
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: e.target.value,
                  })
                }
                placeholder="Degree program details..."
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* EXPERIENCE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/70">
                Professional Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value,
                  })
                }
                placeholder="Internships, projects or tracking records..."
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 h-11 rounded-xl text-sm font-bold shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center justify-center"
            >
              Save Profile
            </button>

            {!returnToJobUrl && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-secondary text-secondary-foreground border border-border px-6 h-11 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        // VIEW MODE
        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm">
          {profile ? (
            <div className="space-y-6">
              {/* BIO */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  About Me
                </span>
                <p className="text-foreground text-sm leading-relaxed bg-secondary/10 p-4 rounded-xl border border-border">
                  {profile.bio || "No summary overview provided yet."}
                </p>
              </div>

              {/* SKILLS + INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                {/* SKILLS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Code size={16} className="text-primary" />
                    Tech Skills
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-secondary text-secondary-foreground border border-border text-xs font-semibold px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No technical skill tags added to file.
                      </p>
                    )}
                  </div>
                </div>

                {/* EDUCATION + EXPERIENCE */}
                <div className="space-y-4">
                  {/* EDUCATION */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <GraduationCap size={16} className="text-primary" />
                      Education
                    </div>
                    <p className="text-sm text-muted-foreground pl-6 font-medium">
                      {profile.education || "No educational background tracked."}
                    </p>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <Briefcase size={16} className="text-primary" />
                      Experience
                    </div>
                    <p className="text-sm text-muted-foreground pl-6 font-medium">
                      {profile.experience || "No previous track history on file."}
                    </p>
                  </div>
                </div>
              </div>

              {/* RESUME SECTION */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-3">
                  <FileText size={16} className="text-primary" />
                  Resume Document
                </div>

                {profile.resume ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span>📄</span> View Uploaded Document
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic bg-secondary/10 p-3 rounded-xl border border-dashed border-border block">
                    No active resume file path attached to this user account profile.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                You haven't initialized your student profile on this cluster workspace yet.
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-primary-foreground px-5 h-10 rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;