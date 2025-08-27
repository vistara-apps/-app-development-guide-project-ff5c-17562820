
"use client";

import { clsx } from "clsx";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  label?: string;
}

export function Input({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  className,
  label 
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx("input-field w-full", className)}
      />
    </div>
  );
}
