import React from "react";
import { ChevronDown } from "lucide-react";

const FormSelectField = ({ label, icon: Icon, name, value, onChange, options = [] }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-primary" />} 
        {label} <span className="text-destructive">*</span>
      </label>
      <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background cursor-pointer appearance-none transition-all duration-200 shadow-inner"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Replaced standard hardware arrow with premium custom matching element */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200">
          <ChevronDown size={15} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default FormSelectField;