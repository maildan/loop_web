import React from 'react';
import { cn } from '../../utils/cn';

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
  className?: string;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a Sheet');
  }
  return context;
};

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <div className="relative">
        {children}
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden mobile-nav-overlay"
              onClick={() => onOpenChange(false)}
            />
          </>
        )}
      </div>
    </SheetContext.Provider>
  );
};

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

export const SheetContent: React.FC<SheetContentProps> = ({ side, className = '', children }) => {
  const { open } = useSheet();

  if (!open) return null;

  return (
    <div className={`fixed ${side === 'left' ? 'left-0' : 'right-0'} top-0 h-full bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
      } ${className}`}>
      {children}
    </div>
  );
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children, className }) => {
  return <div className={cn("p-6 border-b", className)}>{children}</div>;
};

export const SheetTitle: React.FC<SheetTitleProps> = ({ children, className }) => {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
};
