import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = "",
  size = 'default' 
}: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border-border'
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div className={`inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
