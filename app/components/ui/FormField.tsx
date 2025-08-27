"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { Input } from "./Input";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  labelClassName,
  inputClassName,
  ...props
}: FormFieldProps) {
  return (
    <div className={clsx("mb-4", className)}>
      <Input
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        error={error}
        hint={hint}
        required={required}
        disabled={disabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        name={name}
        id={name}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        {...props}
      />
    </div>
  );
}

interface FormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className={className}
    >
      {children}
    </form>
  );
}

