import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Sun, Moon, Home, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../ui/ThemeProvider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';

export function CloudNavigation() {
  const { isDarkMode, toggleTheme } = useTheme();

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
              onClick={toggleTheme}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm text-muted-foreground">사용자님</span>
                  <Avatar 
                    src="https://randomuser.me/api/portraits/men/21.jpg" 
                    alt="사용자 프로필"
                    size="sm"
                    fallback="사용자"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                  <User className="h-4 w-4 mr-2" />
                  프로필 설정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "/account"}>
                  <Settings className="h-4 w-4 mr-2" />
                  계정 관리
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('로그아웃')}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </nav>
  );
}
