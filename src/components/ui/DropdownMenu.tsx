import React, { useState, useRef, useEffect } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: () => setIsOpen(!isOpen),
            });
          }
          if (child.type === DropdownMenuContent) {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, asChild, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, { ...props });
  }
  return <div {...props}>{children}</div>;
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
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
};
