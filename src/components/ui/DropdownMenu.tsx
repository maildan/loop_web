import React from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  forceMount?: boolean;
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ className = '', children }) => {
  return (
    <div className={`absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-50 ${className}`}>
      {children}
    </div>
  );
};

export const DropdownMenuLabel: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => {
  return <div className={`px-3 py-2 text-sm font-medium ${className}`}>{children}</div>;
};

export const DropdownMenuSeparator: React.FC = () => {
  return <div className="h-px bg-border my-1" />;
};

export const DropdownMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <div 
      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
