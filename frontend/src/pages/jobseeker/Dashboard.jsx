import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import API from "../../api/axios.js";
import { toast } from "react-hot-toast";

// Subcomponent ecosystem tracking layers
import DashboardLoading from "./components/DashboardLoading";
import CompleteProfileAlert from "./components/CompleteProfileAlert";
import ProfileForm from "./components/ProfileForm";
import ProfileView from "./components/ProfileView";

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

  // DATA PIPELINE: FETCH ENTRY RECORD
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
        console.error("Dashboard operational loop exception:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // CLOUDINARY MEDIA ASSET DISPATCH UPLOAD
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
        { method: "POST", body: data }
      );

      const fileData = await res.json();
      if (!res.ok) {
        throw new Error(fileData.error?.message || "Cloudinary upload failed");
      }

      setFormData((prev) => ({ ...prev, resume: fileData.secure_url }));
      toast.success("Resume asset synchronized successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process asset upload pipeline.");
    } finally {
      setUploadingFile(false);
    }
  };

  // FORM CONTROLLER UPDATE DISPATCH
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const response = await API.put("/user/profile", formattedData);
      const updatedProfile = response.data?.data || response.data;

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile parameters synchronized successfully!");

      if (returnToJobUrl) navigate(returnToJobUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update target user profile.");
    }
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <CompleteProfileAlert alertReason={alertReason} />

      {/* CONTROL CONTAINER HEADER */}
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

      {/* TOGGLED CONDITIONAL VIEW SYSTEM */}
      {isEditing ? (
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          handleResumeUpload={handleResumeUpload}
          uploadingFile={uploadingFile}
          returnToJobUrl={returnToJobUrl}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm">
          <ProfileView profile={profile} setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;