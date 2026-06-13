import React from "react";
import { AlertCircle } from "lucide-react";

const MissingProfileBanner = ({ profileAlert, onCompleteProfile }) => {
  if (!profileAlert) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4">
      <div className="flex items-center gap-3 text-destructive">
        <AlertCircle className="shrink-0" />
        <div>
          <p className="font-bold text-sm">Incomplete Profile Information</p>
          <p className="text-xs text-muted-foreground">You must upload a resume and list your skills before applying to positions.</p>
        </div>
      </div>
      <button 
        onClick={onCompleteProfile}
        className="text-xs font-bold bg-destructive text-destructive-foreground px-4 py-2 rounded-xl hover:opacity-90 transition cursor-pointer whitespace-nowrap"
      >
        Complete Profile
      </button>
    </div>
  );
};

export default MissingProfileBanner;