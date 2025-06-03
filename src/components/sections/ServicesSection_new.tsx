import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const ServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pro' | 'novel'>('pro');

  const osSupport = {
    pro: [
      { name: 'Windows', icon: '🪟', supported: true },
      { name: 'macOS', icon: '🍎', supported: true },
      { name: 'Linux', icon: '🐧', supported: true },
      { name: 'Android', icon: '🤖', supported: false },
      { name: 'iOS', icon: '📱', supported: false },
      { name: 'Web', icon: '🌐', supported: false },
    ],
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
    pro: [
      '데스크톱 최적화된 강력한 기능',
      '멀티 워크스페이스 지원',
      '고급 알림 관리',
      '키보드 단축키',
      '플러그인 시스템',
      '오프라인 모드',
    ],
    novel: [
      '모바일 퍼스트 디자인',
      '터치 최적화 인터페이스',
      '간편한 설정',
      '크로스 플랫폼 동기화',
      '웹 기반 접근성',
      '가벼운 리소스 사용',
    ],
  };

  return (
    <Section id="services" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loop 제품 라인업
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            사용자의 니즈에 맞춰 선택할 수 있는 두 가지 버전을 제공합니다.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'pro' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('pro')}
              className="px-8 py-2"
            >
              Loop Pro
            </Button>
            <Button
              variant={activeTab === 'novel' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('novel')}
              className="px-8 py-2"
            >
              Loop Novel
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {activeTab === 'pro' ? 'Loop Pro' : 'Loop Novel'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'pro' 
                ? '데스크톱 환경에서 최고의 생산성을 제공하는 전문가용 솔루션입니다. 강력한 기능과 확장성으로 업무 효율을 극대화하세요.'
                : '모바일과 웹에서 언제 어디서나 접근할 수 있는 간편한 솔루션입니다. 직관적인 인터페이스로 빠르게 시작하세요.'
              }
            </p>
            
            <h4 className="text-lg font-semibold mb-3">주요 기능</h4>
            <ul className="space-y-2 mb-8">
              {features[activeTab].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* OS Support Grid */}
          <div>
            <h4 className="text-lg font-semibold mb-4">플랫폼 지원</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {osSupport[activeTab].map((os, index) => (
                <Card 
                  key={index} 
                  className={`text-center transition-all ${
                    os.supported 
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' 
                      : 'border-muted bg-muted/30 opacity-60'
                  }`}
                >
                  <CardContent className="py-4">
                    <div className="text-3xl mb-2">{os.icon}</div>
                    <div className="font-medium text-sm">{os.name}</div>
                    <div className="text-xs mt-1">
                      {os.supported ? (
                        <span className="text-green-600 dark:text-green-400">지원</span>
                      ) : (
                        <span className="text-muted-foreground">미지원</span>
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
