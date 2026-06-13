import React from "react";

const ProfileForm = ({
  formData,
  setFormData,
  handleFormSubmit,
  handleResumeUpload,
  uploadingFile,
  returnToJobUrl,
  setIsEditing,
}) => {
  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-card border border-border rounded-[2rem] p-6 md:p-8 space-y-5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-foreground">Update Your Profile</h2>

      {/* BIO */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/70">Professional Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell recruiters about your engineering goals..."
          className="w-full min-h-24 bg-secondary/20 border border-border rounded-xl p-3 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
        />
      </div>

      {/* SKILLS + RESUME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKILLS */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/70">Skills (Comma Separated)</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="Java, React, Node.js, MongoDB"
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        {/* RESUME UPLOAD */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/70">Upload Resume (PDF)</label>
          <div className="flex items-center gap-3 bg-secondary/10 border border-border rounded-xl p-2 h-12 overflow-hidden">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              disabled={uploadingFile}
              className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary file:cursor-pointer hover:file:bg-primary/20"
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/70">Education background</label>
          <input
            type="text"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            placeholder="Degree program details..."
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/70">Professional Experience</label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="Internships, projects or tracking records..."
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* FORM FOOTER ACTIONS */}
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
  );
};

export default ProfileForm;