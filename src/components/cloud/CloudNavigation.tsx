import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Sun, Moon, Home, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export function CloudNavigation() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 초기 다크모드 상태 확인 및 적용
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark = false;
    if (savedTheme === 'dark') {
      isDark = true;
    } else if (savedTheme === 'light') {
      isDark = false;
    } else {
      isDark = prefersDark;
    }
    
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/cloud" className="flex items-center">
              <span className="font-bold text-2xl">Loop Cloud</span>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-5 w-5 mr-2" />
                홈으로
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">사용자님</span>
              <Avatar 
                src="https://randomuser.me/api/portraits/men/21.jpg" 
                alt="사용자 프로필"
                size="sm"
                fallback="사용자"
              />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
