import React from "react";
import { MapPin, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";

const ApplicationRow = ({ app }) => {
  // Pure mapping utility for application status tags
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
        };
      case "reviewed":
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          icon: <Clock size={14} className="text-amber-500" />,
        };
      case "rejected":
        return {
          bg: "bg-destructive/10 text-destructive border-destructive/20",
          icon: <XCircle size={14} className="text-destructive" />,
        };
      default:
        return {
          bg: "bg-primary/10 text-primary border-primary/20",
          icon: <Clock size={14} className="text-primary" />,
        };
    }
  };

  const statusInfo = getStatusStyles(app.status);
  const formattedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recent";

  return (
    <tr className="hover:bg-secondary/10 transition-colors group">
      {/* Job details col */}
      <td className="p-4 pl-6">
        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
          {app.job?.title || "Unknown Position"}
        </div>
        <div className="text-xs text-muted-foreground font-medium mt-0.5">
          {app.job?.companyName || "Unknown Company"}
        </div>
      </td>

      {/* Location col */}
      <td className="p-4 text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <MapPin size={14} className="shrink-0 text-muted-foreground/70" />
          {app.job?.location || "Remote / NA"}
        </div>
      </td>

      {/* Date col */}
      <td className="p-4 text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Calendar size={14} className="shrink-0 text-muted-foreground/70" />
          {formattedDate}
        </div>
      </td>

      {/* Status badge cell */}
      <td className="p-4 pr-6 text-right">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border select-none ${statusInfo.bg}`}
        >
          {statusInfo.icon}
          <span className="capitalize">{app.status || "applied"}</span>
        </span>
      </td>
    </tr>
  );
};

export default ApplicationRow;