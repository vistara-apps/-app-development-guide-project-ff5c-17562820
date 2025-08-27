
"use client";

import { User } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

interface UserAvatarProps {
  user: User;
  variant?: "default" | "group";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ user, variant = "default", size = "md", className }: UserAvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (user.profilePictureUrl) {
    return (
      <img
        src={user.profilePictureUrl}
        alt={user.displayName}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          variant === "group" && "border-2 border-surface",
          className
        )}
      />
    );
  }

  const initials = user.displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "rounded-full bg-primary text-white flex items-center justify-center font-medium",
        sizes[size],
        variant === "group" && "border-2 border-surface",
        className
      )}
    >
      {initials}
    </div>
  );
}
