import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ 
  src, 
  alt = "", 
  fallback = "?", 
  size = 'md', 
  className = "" 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-muted-foreground select-none">
          {fallback}
        </span>
      )}
    </div>
  );
}

export function AvatarFallback({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
      {children}
    </div>
  );
}
