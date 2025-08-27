"use client";

import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  isLoading = false,
  placeholder,
  type = "text",
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {label && (
        <label 
          className={clsx(
            "block text-sm font-medium text-text-primary",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${label}-error` : hint ? `${label}-hint` : undefined}
          className={clsx(
            "input-field w-full",
            error && "input-field-error",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            (disabled || isLoading) && "opacity-60 cursor-not-allowed",
            inputClassName
          )}
          {...props}
        />
        
        {(rightIcon || isLoading) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
            {isLoading ? (
              <svg 
                className="animate-spin h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${label}-error`} 
          className="text-sm text-error mt-1 animate-fade-in"
        >
          {error}
        </p>
      )}
      
      {!error && hint && (
        <p 
          id={`${label}-hint`} 
          className="text-xs text-text-secondary mt-1"
        >
          {hint}
        </p>
      )}
    </div>
  );
});
