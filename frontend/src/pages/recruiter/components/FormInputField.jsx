import React from "react";

const FormInputField = ({ 
  label, 
  icon: Icon, 
  name, 
  type = "text", 
  required = false, 
  value, 
  onChange, 
  placeholder, 
  min 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-primary" />} 
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full p-3 bg-secondary/10 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all duration-200"
      />
    </div>
  );
};

export default FormInputField;