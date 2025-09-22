import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Sun, Moon, Home, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../ui/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '../../services/auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';

export function CloudNavigation() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  
  console.log('🔍 CloudNavigation user:', user);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // 클라우드에서 홈으로 이동하는 것을 표시
    sessionStorage.setItem('previousPath', '/cloud');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top row: Logo, hamburger menu and essential controls */}
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/cloud" className="flex items-center">
                <span className="font-bold text-xl">Loop</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={handleHomeClick}
              >
                <Home className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2"
                onClick={toggleTheme}
                aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {user && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar 
                    src={user.profile_picture_url || "https://randomuser.me/api/portraits/men/21.jpg"} 
                    alt={user.name || "사용자 프로필"}
                    size="sm"
                    fallback={user.name || "사용자"}
                    className="cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                    <User className="h-4 w-4 mr-2" />
                    프로필 설정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                    <Settings className="h-4 w-4 mr-2" />
                    계정 관리
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/cloud" className="flex items-center">
              <span className="font-bold text-2xl">Loop Cloud</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleHomeClick}
            >
              <Home className="h-5 w-5 mr-2" />
              홈으로
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm text-muted-foreground">{user.name || '사용자'}님</span>
                  <Avatar 
                    src={user.profile_picture_url || "https://randomuser.me/api/portraits/men/21.jpg"} 
                    alt={user.name || "사용자 프로필"}
                    size="sm"
                    fallback={user.name || "사용자"}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                  <User className="h-4 w-4 mr-2" />
                  프로필 설정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                  <Settings className="h-4 w-4 mr-2" />
                  계정 관리
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
