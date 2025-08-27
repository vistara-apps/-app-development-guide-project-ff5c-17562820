"use client";

import { cn } from "../lib/utils";

interface GroupCardProps {
  groupName: string;
  memberCount: number;
  balance: number;
  variant?: "default" | "compact";
  onClick?: () => void;
  className?: string;
}

export function GroupCard({ 
  groupName, 
  memberCount, 
  balance, 
  variant = "default",
  onClick,
  className 
}: GroupCardProps) {
  return (
    <div 
      className={cn(
        "bg-surface border border-border rounded-lg p-4 shadow-card cursor-pointer hover:shadow-lg transition-shadow",
        {
          "p-3": variant === "compact"
        },
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold text-text-primary mb-1">{groupName}</h3>
          <p className="text-sm text-text-secondary">{memberCount} members</p>
        </div>
        <div className="text-right">
          <p className="text-base leading-7 font-medium text-text-primary">
            ${Math.abs(balance).toFixed(2)}
          </p>
          <p className={cn(
            "text-sm",
            balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : "text-text-secondary"
          )}>
            {balance > 0 ? "You're owed" : balance < 0 ? "You owe" : "Settled"}
          </p>
        </div>
      </div>
    </div>
  );
}
