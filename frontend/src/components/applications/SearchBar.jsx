import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, filteredLength }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-sm">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
          size={16}
        />
        <input
          type="text"
          placeholder="Search by role or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-secondary/20 text-foreground border border-border h-10 pl-9 pr-4 rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-card transition-all"
        />
      </div>
      <p className="text-xs text-muted-foreground font-medium">
        Showing {filteredLength} entry results
      </p>
    </div>
  );
};

export default SearchBar;