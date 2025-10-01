import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, Home, BarChart3, Settings, User, HelpCircle, TrendingUp, X } from 'lucide-react';

interface MobileNavProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const MobileNav = React.memo(function MobileNav({ activeSection = 'overview', onSectionChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: '대시보드', icon: BarChart3 },
    { id: 'documents', label: '문서 관리', icon: Home },
    { id: 'analytics', label: '분석', icon: TrendingUp },
    { id: 'settings', label: '설정', icon: Settings },
    { id: 'profile', label: '프로필', icon: User },
    { id: 'help', label: '도움말', icon: HelpCircle },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange?.(section);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // 메뉴가 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="block md:hidden">
      {/* 햄버거 메뉴 버튼 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-2 hover:bg-accent focus:ring-2 focus:ring-primary transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        <span className="sr-only">메뉴 열기</span>
      </Button>

      {/* 오버레이 배경 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* 사이드 메뉴 */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* 메뉴 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Loop Cloud</h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-accent"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">메뉴 닫기</span>
          </Button>
        </div>

        {/* 메뉴 내용 */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* 하단 프로모션 영역 */}
        <div className="mt-auto p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full"></div>
            <div>
              <h4 className="font-medium text-sm">Loop</h4>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
