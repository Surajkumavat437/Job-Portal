import React from "react";
import { AlertCircle } from "lucide-react";

const CompleteProfileAlert = ({ alertReason }) => {
  if (!alertReason) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-2xl text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2">
      <AlertCircle size={18} className="shrink-0" />
      <span>Please complete your background resume layout and skills metrics before submitting job applications.</span>
    </div>
  );
};

export default CompleteProfileAlert;