"use client";

import { clsx } from "clsx";

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  className?: string;
}

export function LoadingState({
  text = "Loading...",
  size = "md",
  fullPage = false,
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const containerClasses = fullPage
    ? "fixed inset-0 flex items-center justify-center bg-bg/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={clsx(containerClasses, className)}>
      <div className="flex flex-col items-center">
        <svg
          className={clsx("animate-spin text-primary", sizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
        {text && <p className="mt-3 text-text-secondary">{text}</p>}
      </div>
    </div>
  );
}

