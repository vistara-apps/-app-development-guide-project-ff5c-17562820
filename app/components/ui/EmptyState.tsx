"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "link";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center p-6 py-12",
        className
      )}
    >
      {icon && <div className="text-text-secondary mb-4">{icon}</div>}
      
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      
      {description && (
        <p className="text-text-secondary max-w-md mb-6">{description}</p>
      )}
      
      {action && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={action.variant || "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
          
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "secondary"}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

