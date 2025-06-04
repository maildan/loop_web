import React from 'react';
import { Container } from '../ui/Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Loop Pro', href: '#download-pro' },
      { label: 'Loop Novel', href: '#download-novel' },
      { label: '기능', href: '#about' },
      { label: '플랫폼 지원', href: '#services' },
    ],
    support: [
      { label: '도움말', href: '#help' },
      { label: '문의하기', href: 'mailto:support@loop.app' },
      { label: '피드백', href: '#feedback' },
      { label: 'FAQ', href: '#faq' },
    ],
    company: [
      { label: '회사 소개', href: '#about' },
      { label: '개인정보처리방침', href: '#privacy' },
      { label: '이용약관', href: '#terms' },
      { label: '보안', href: '#security' },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-bold text-2xl">Loop</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                모든 채팅을 한곳에 모아 생산성을 극대화하는 새로운 방식의 통합 플랫폼입니다.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/loop_app"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://github.com/loop-app"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Loop. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a
                href="#privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="#terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                이용약관
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
