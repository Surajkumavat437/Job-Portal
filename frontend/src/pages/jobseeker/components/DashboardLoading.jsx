import React from "react";

const DashboardLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full text-sm font-medium text-muted-foreground animate-pulse">
      Assembling candidate dashboard records...
    </div>
  );
};

export default DashboardLoading;