import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Menu, Home, BarChart3, Settings, User, HelpCircle } from 'lucide-react';

interface MobileNavProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function MobileNav({ activeSection = 'overview', onSectionChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: '대시보드', icon: BarChart3 },
    { id: 'documents', label: '문서 관리', icon: Home },
    { id: 'settings', label: '설정', icon: Settings },
    { id: 'profile', label: '프로필', icon: User },
    { id: 'help', label: '도움말', icon: HelpCircle },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange?.(section);
    setIsOpen(false);
  };

  return (
    <div className="block md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-accent focus:ring-2 focus:ring-primary transition-all duration-200"
          >
            <Menu className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 md:hidden">
          <SheetHeader>
            <SheetTitle>Loop Cloud</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-medium text-sm">Loop Pro</h4>
              <p className="text-xs text-muted-foreground mt-1">
                더 많은 기능을 원하시나요?
              </p>
              <Button size="sm" className="w-full mt-3">
                업그레이드
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
