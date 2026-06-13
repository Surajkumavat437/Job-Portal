import React from "react";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";

const ApplicationMetrics = ({ totalApps, pendingApps, acceptedApps }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* TOTAL APPLICATIONS CARD */}
      <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Applications
          </p>
          <h3 className="text-2xl font-black mt-1 text-foreground">
            {totalApps}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Briefcase size={20} />
        </div>
      </div>

      {/* PENDING REVIEW CARD */}
      <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Pending Review
          </p>
          <h3 className="text-2xl font-black mt-1 text-amber-500">
            {pendingApps}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Clock size={20} />
        </div>
      </div>

      {/* OFFERS RECEIVED CARD */}
      <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Offers Received
          </p>
          <h3 className="text-2xl font-black mt-1 text-emerald-500">
            {acceptedApps}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={20} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationMetrics;