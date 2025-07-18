import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const ServicesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const osSupport = {
    novel: [
      { name: 'Windows', icon: '🪟', supported: false },
      { name: 'macOS', icon: '🍎', supported: false },
      { name: 'Linux', icon: '🐧', supported: false },
      { name: 'Android', icon: '🤖', supported: true },
      { name: 'iOS', icon: '📱', supported: true },
      { name: 'Web', icon: '🌐', supported: true },
    ],
  };

  const features = {
    novel: [
      '모바일 최적화',
      '터치 인터페이스',
      '간편한 설정',
      '클라우드 동기화',
      '웹 접근성',
      '가벼운 용량',
    ],
  };

  return (
    <Section id="services" padding="xl">
      <Container>
        {/* Header with Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loop 제품 라인업
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            모바일과 웹에서 최고의 경험을 제공하는 Loop Novel을 만나보세요.
          </p>
        </div>

        {/* Tab Content with Animation */}
        <div className={`flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:items-start space-y-8 lg:space-y-0 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Product Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold transition-all duration-500">
              Loop Novel
            </h3>
            <p className="text-muted-foreground leading-relaxed transition-all duration-500">
              모바일과 웹에서 언제 어디서나 접근할 수 있는 간편한 솔루션입니다. 직관적인 인터페이스로 빠르게 시작하세요.
            </p>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4 mt-6">주요 기능</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-items-center">
                {features.novel.map((feature, index) => (
                  <li 
                    key={index} 
                    className={`flex items-center justify-center animate-fadeInUp ${
                      index === 0 ? 'delay-0' :
                      index === 1 ? 'delay-100' :
                      index === 2 ? 'delay-200' :
                      index === 3 ? 'delay-300' :
                      index === 4 ? 'delay-400' : 'delay-500'
                    }`}
                  >
                    <span className="text-green-500 mr-3 text-lg mt-24 ml-12">✓</span>
                    <span className="font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors mt-24 text-center">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* OS Support Grid */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-6 mt-6">플랫폼 지원</h4>
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 justify-items-center">
              {osSupport.novel.map((os, index) => (
                <Card 
                  key={index} 
                  className={`text-center transition-all duration-900 hover:scale-105 hover:shadow-lg animate-fadeInUp ${
                    index === 0 ? 'delay-600' :
                    index === 1 ? 'delay-700' :
                    index === 2 ? 'delay-800' :
                    index === 3 ? 'delay-900' :
                    index === 4 ? 'delay-1000' : 'delay-1100'
                  } ${
                    os.supported 
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' 
                      : 'border-muted bg-muted/30 opacity-60'
                  }`}
                >
                  <CardContent className="py-3 px-2">
                    <div className="text-2xl mb-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-24 ml-12">{os.icon}</div>
                    <div className="font-semibold text-sm mb-1 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors mt-24 text-center">{os.name}</div>
                    <div className="text-xs mt-24 text-center">
                      {os.supported ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">지원</span>
                      ) : (
                        <span className="text-muted-foreground font-semibold">미지원</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
