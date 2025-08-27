
"use client";

import { User } from "../types";
import { UserAvatar } from "./ui/UserAvatar";
import { Button } from "./ui/Button";
import { ArrowLeft, Plus } from "lucide-react";

interface FrameHeaderProps {
  title: string;
  subtitle?: string;
  user?: User;
  showBack?: boolean;
  onBack?: () => void;
  showAdd?: boolean;
  onAdd?: () => void;
}

export function FrameHeader({ 
  title, 
  subtitle, 
  user, 
  showBack, 
  onBack, 
  showAdd, 
  onAdd 
}: FrameHeaderProps) {
  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
          )}
          <div>
            <h1 className="text-heading">{title}</h1>
            {subtitle && <p className="text-caption">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {showAdd && (
            <Button variant="primary" size="sm" onClick={onAdd}>
              <Plus size={16} />
            </Button>
          )}
          {user && <UserAvatar user={user} />}
        </div>
      </div>
    </div>
  );
}
