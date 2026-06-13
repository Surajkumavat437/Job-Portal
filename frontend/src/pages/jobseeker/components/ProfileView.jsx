import React from "react";
import { Code, GraduationCap, Briefcase, FileText } from "lucide-react";

const ProfileView = ({ profile, setIsEditing }) => {
  if (!profile) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* BIO OVERVIEW */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">About Me</span>
        <p className="text-foreground text-sm leading-relaxed bg-secondary/10 p-4 rounded-xl border border-border">
          {profile.bio || "No summary overview provided yet."}
        </p>
      </div>

      {/* PARAMETER METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
        {/* SKILLS CHIPS */}
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

        {/* PROFILE META INFO */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <GraduationCap size={16} className="text-primary" />
              Education
            </div>
            <p className="text-sm text-muted-foreground pl-6 font-medium">
              {profile.education || "No educational background tracked."}
            </p>
          </div>

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

      {/* CLOUDINARY RESUME LINK FILE MAP */}
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
  );
};

export default ProfileView;