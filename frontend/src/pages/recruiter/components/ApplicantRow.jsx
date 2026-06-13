import React from "react";
import { Mail, Calendar } from "lucide-react";

const ApplicantRow = ({ app, onOpenDetails }) => {
  return (
    <tr 
      onClick={() => onOpenDetails(app)}
      className="hover:bg-primary/5 cursor-pointer transition-colors group"
    >
      <td className="p-4 font-semibold text-foreground group-hover:text-primary transition-colors">
        {app.jobSeeker?.name || "Anonymous Applicant"}
      </td>
      <td className="p-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
          {app.jobSeeker?.email || "N/A"}
        </div>
      </td>
      <td className="p-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent"}
        </div>
      </td>
      <td className="p-4 text-right">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border capitalize ${
          app.status === "selected"
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : app.status === "rejected"
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : app.status === "reviewed"
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {app.status || "applied"}
        </span>
      </td>
    </tr>
  );
};

export default ApplicantRow;