
"use client";

import { Group, Balance } from "../types";
import { UserAvatar } from "./ui/UserAvatar";
import { Users, DollarSign } from "lucide-react";
import { formatCurrency } from "../utils/formatting";

interface GroupCardProps {
  group: Group;
  balance?: number;
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

export function GroupCard({ group, balance = 0, variant = 'default', onClick }: GroupCardProps) {
  const isCompact = variant === 'compact';
  
  return (
    <div 
      className={`card hover:shadow-lg transition-all duration-base cursor-pointer ${isCompact ? 'p-3' : 'p-4'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {group.members.slice(0, 3).map((member, index) => (
              <UserAvatar 
                key={member.userId} 
                user={member} 
                size={isCompact ? "sm" : "md"}
                variant="group"
              />
            ))}
            {group.members.length > 3 && (
              <div className={`${isCompact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-full bg-border text-text-secondary flex items-center justify-center font-medium`}>
                +{group.members.length - 3}
              </div>
            )}
          </div>
          <div>
            <h3 className={isCompact ? "text-base font-medium" : "text-heading"}>{group.groupName}</h3>
            <div className="flex items-center text-caption space-x-2">
              <Users size={14} />
              <span>{group.members.length} members</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center ${balance > 0 ? 'text-accent' : balance < 0 ? 'text-red-500' : 'text-text-secondary'}`}>
            <DollarSign size={16} />
            <span className="font-medium">{formatCurrency(Math.abs(balance))}</span>
          </div>
          <div className="text-caption">
            {balance > 0 ? 'You are owed' : balance < 0 ? 'You owe' : 'Settled up'}
          </div>
        </div>
      </div>
    </div>
  );
}
