import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Link } from 'react-router-dom';
import { useTheme } from '../ui/ThemeProvider';

interface NavigationProps {
  children?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { href: '/', label: '홈', id: 'nav-home' },
    { href: '/#about', label: 'Loop', id: 'nav-about' },
    { href: '/#services', label: '서비스', id: 'nav-services' },
    { href: '/#download', label: '다운로드', id: 'nav-download' },
    { href: '/cloud', label: '클라우드', id: 'nav-cloud' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center space-x-2">
              <span className="font-bold text-2xl">Loop</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="다크모드 토글"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="다크모드 토글"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button
              className="flex flex-col space-y-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};
