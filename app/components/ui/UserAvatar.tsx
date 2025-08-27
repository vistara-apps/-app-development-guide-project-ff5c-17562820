
"use client";

import { User } from "../../types";

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'group';
}

export function UserAvatar({ user, size = 'md', variant = 'default' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const initials = user.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary text-white flex items-center justify-center font-medium`}>
      {user.profilePictureUrl ? (
        <img 
          src={user.profilePictureUrl} 
          alt={user.displayName}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}
