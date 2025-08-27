"use client";

import { cn } from "../lib/utils";

interface FrameHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function FrameHeader({ title, subtitle, className }: FrameHeaderProps) {
  return (
    <div className={cn("text-center py-6", className)}>
      <h1 className="text-4xl font-bold text-text-primary mb-2">{title}</h1>
      {subtitle && (
        <p className="text-sm text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
