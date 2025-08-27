"use client";

import { Group, Balance } from "../types";
import { UserAvatar } from "./ui/UserAvatar";
import { Users, DollarSign, ArrowRight } from "lucide-react";
import { formatCurrency } from "../utils/formatting";
import { clsx } from "clsx";

interface GroupCardProps {
  group: Group;
  balance?: number;
  variant?: 'default' | 'compact';
  onClick?: () => void;
  className?: string;
}

export function GroupCard({ 
  group, 
  balance = 0, 
  variant = 'default', 
  onClick,
  className
}: GroupCardProps) {
  const isCompact = variant === 'compact';
  
  const getBalanceColor = () => {
    if (balance > 0) return "text-accent";
    if (balance < 0) return "text-error";
    return "text-text-secondary";
  };
  
  return (
    <div 
      className={clsx(
        "card hover:shadow-lg transition-all duration-base cursor-pointer",
        "relative overflow-hidden group",
        isCompact ? "p-3" : "p-4",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Group: ${group.groupName} with ${group.members.length} members`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Hover indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-base">
        <ArrowRight className="text-primary" size={20} />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2 relative">
            {group.members.slice(0, 3).map((member, index) => (
              <div 
                key={member.userId}
                className="relative transition-transform duration-base group-hover:translate-x-0"
                style={{ transform: `translateX(${index * -4}px)` }}
              >
                <UserAvatar 
                  user={member} 
                  size={isCompact ? "sm" : "md"}
                  variant="group"
                />
              </div>
            ))}
            {group.members.length > 3 && (
              <div 
                className={clsx(
                  "rounded-full bg-border text-text-secondary flex items-center justify-center font-medium",
                  "transition-transform duration-base group-hover:translate-x-0",
                  isCompact ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
                )}
                style={{ transform: `translateX(${2 * -4}px)` }}
              >
                +{group.members.length - 3}
              </div>
            )}
          </div>
          <div>
            <h3 className={clsx(
              "group-hover:text-primary transition-colors duration-base",
              isCompact ? "text-base font-medium" : "text-heading"
            )}>
              {group.groupName}
            </h3>
            <div className="flex items-center text-caption space-x-2">
              <Users size={14} />
              <span>{group.members.length} members</span>
            </div>
          </div>
        </div>
        <div className="text-right pr-6">
          <div className={clsx(
            "flex items-center font-medium",
            getBalanceColor()
          )}>
            <DollarSign size={16} className="mr-1" />
            <span>{formatCurrency(Math.abs(balance))}</span>
          </div>
          <div className={clsx(
            "text-caption px-2 py-0.5 rounded-full mt-1",
            balance > 0 ? "bg-accent/10 text-accent" : 
            balance < 0 ? "bg-error/10 text-error" : 
            "bg-gray-100 text-text-secondary"
          )}>
            {balance > 0 ? 'You are owed' : balance < 0 ? 'You owe' : 'Settled up'}
          </div>
        </div>
      </div>
    </div>
  );
}
