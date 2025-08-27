"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  rounded?: boolean;
}

export function Skeleton({
  className,
  height,
  width,
  circle = false,
  rounded = true,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "skeleton",
        circle && "rounded-full",
        rounded && !circle && "rounded-md",
        className
      )}
      style={{
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
      }}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: SkeletonTextProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full",
            lineClassName
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx("card animate-pulse", className)}>
      <div className="flex space-x-4">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={clsx("h-10 w-24", className)}
      rounded
    />
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      circle
      width={size}
      height={size}
      className={className}
    />
  );
}

