import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastToggleTime = useRef(0);
  const cooldownPeriod = 1000; // 1 second cooldown

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
      // 시스템 설정 기반으로 초기 테마 저장
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    
    setIsDarkMode(isDark);
    
    // DOM에 다크모드 클래스 적용
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 시스템 다크모드 변경 감지
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 사용자가 명시적으로 테마를 선택한 경우 시스템 변경에 따라 변경하지 않음
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const currentTime = Date.now();
    
    // 쿨다운 체크
    if (currentTime - lastToggleTime.current < cooldownPeriod) {
      return; // 쿨다운 중이면 토글 무시
    }
    
    lastToggleTime.current = currentTime;
    
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
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
