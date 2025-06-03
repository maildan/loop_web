import React from 'react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps {
  side: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  return (
    <div className={open ? 'relative' : 'relative'}>
      {children}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
    </div>
  );
};

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

export const SheetContent: React.FC<SheetContentProps> = ({ side, className = '', children }) => {
  return (
    <div className={`fixed ${side === 'left' ? 'left-0' : 'right-0'} top-0 h-full bg-background border-r z-50 ${className}`}>
      {children}
    </div>
  );
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children }) => {
  return <div className="p-6 border-b">{children}</div>;
};

export const SheetTitle: React.FC<SheetTitleProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};
