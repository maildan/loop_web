import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent } from '../ui/Card';
import { Windows11Icon, MacOSIcon, UbuntuIcon } from '../../assets/icons';

export const ServicesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const osSupport = {
    novel: [
      { name: 'Windows', icon: Windows11Icon, supported: true, status: '지원' },
      { name: 'macOS', icon: MacOSIcon, supported: true, status: '지원' },
      { name: 'Linux', icon: UbuntuIcon, supported: false, status: '출시 예정' }
    ],
  };

  const features = {
    novel: [
      '지능형 글쓰기 분석',
      'AI 글쓰기 파트너',
      '깔끔하고 집중되는 UI',
      'Electron 기반의 빠른 반응성',
      '강력한 문서 관리',
      '다양한 내보내기 옵션',
    ],
  };

  return (
    <Section id="services" padding="xl">
      <Container>
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loop 제품 라인업</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            모바일과 웹에서 최고의 경험을 제공하는 Loop Novel을 만나보세요.
          </p>
        </div>

        <div className={`flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:items-start space-y-8 lg:space-y-0 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold transition-all duration-500">Loop Novel</h3>
            <p className="text-muted-foreground leading-relaxed transition-all duration-500">
              Loop Novel은 작가들을 위한 최고의 워드프로세서입니다. Electron으로 개발되어 데스크톱 환경에 최적화된 성능을 제공하며, 글쓰기에만 집중할 수 있는 환경을 만들어줍니다.
            </p>
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4 mt-6">주요 기능</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-start">
                {features.novel.map((feature, index) => (
                  <li key={index} className={`flex items-center justify-center animate-fadeInUp ${
                    index === 0 ? 'delay-0' :
                    index === 1 ? 'delay-100' :
                    index === 2 ? 'delay-200' :
                    index === 3 ? 'delay-300' :
                    index === 4 ? 'delay-400' : 'delay-500'
                  }`}>
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-lg font-semibold mb-6 mt-6">플랫폼 지원</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {osSupport.novel.map((os, index) => (
                <Card key={index} className={`text-center transition-all duration-900 hover:scale-105 hover:shadow-lg animate-fadeInUp ${
                  index === 0 ? 'delay-600' :
                  index === 1 ? 'delay-700' :
                  index === 2 ? 'delay-800' :
                  index === 3 ? 'delay-900' :
                  index === 4 ? 'delay-1000' : 'delay-1100'
                } ${
                  os.supported 
                    ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' 
                    : 'border-muted bg-muted/30 opacity-60'
                }`}>
                  <CardContent className="flex flex-col items-center justify-center p-4 h-36">
                    <os.icon className="w-10 h-10 mb-3" />
                    <div className="font-semibold text-sm mb-1">{os.name}</div>
                    <div className="text-xs">
                      {os.supported ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">{os.status}</span>
                      ) : (
                        <span className="text-muted-foreground font-semibold">{os.status}</span>
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


