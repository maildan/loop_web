import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// 간단한 Intersection Observer 커스텀 훅
const useAnimatedVisibility = <T extends HTMLElement>() => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const animationClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10';

  return { ref, animationClasses };
};

export const AboutSection: React.FC = () => {
  const titleRef = useAnimatedVisibility<HTMLDivElement>();
  const featuresRef = useAnimatedVisibility<HTMLDivElement>();
  const detailsRef = useAnimatedVisibility<HTMLDivElement>();

  const features = [
    {
      title: 'AI 기반 분석',
      description: '글의 구조, 가독성, 감정선까지 분석하여 더 나은 이야기를 만들도록 돕습니다.',
      icon: '📊',
    },
    {
      title: '똑똑한 AI 에이전트',
      description: '자료 조사, 아이디어 구체화, 교정 및 교열까지 AI가 함께합니다.',
      icon: '🤖',
    },
    {
      title: '집중을 위한 디자인',
      description: '불필요한 모든 것을 덜어내고 오직 글쓰기에만 몰입할 수 있는 환경을 제공합니다.',
      icon: '✍️',
    },
    {
      title: '강력한 데스크톱 성능',
      description: 'Electron 기반으로 제작되어 어떤 운영체제에서도 빠르고 안정적인 성능을 보장합니다.',
      icon: '💻',
    },
  ];

  return (
    <Section id="about" background="muted" padding="xl">
      <Container>
        <div 
          ref={titleRef.ref} 
          className={`text-center mb-16 transition-all duration-700 ease-out ${titleRef.animationClasses}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            오직 작가를 위한 단 하나의 도구, Loop
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Loop는 복잡한 기능 대신 글쓰기 본질에 집중할 수 있도록 설계된 워드프로세서입니다. 당신의 창작 과정을 분석하고, AI 에이전트가 도우며, 깔끔한 디자인으로 몰입감을 더합니다.
          </p>
        </div>

        <div 
          ref={featuresRef.ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ease-out ${featuresRef.animationClasses}`}
        >
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4 mt-15 -ml-3">{feature.icon}</div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div 
          ref={detailsRef.ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ease-out ${detailsRef.animationClasses}`}
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">창작의 모든 과정을 함께</h3>
            <p className="text-muted-foreground mb-4">
              단순한 텍스트 편집기를 넘어, Loop는 아이디어 구상부터 탈고까지 작가의 모든 여정을 지원하는 창작 파트너입니다.
            </p>
            <p className="text-muted-foreground mb-6">
              데이터 기반의 분석과 AI의 지원을 통해 당신의 이야기에 생명을 불어넣고, 오직 창작에만 집중할 수 있는 환경을 경험해보세요.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3+</div>
                <div className="text-sm text-muted-foreground">핵심 기능</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Alpha</div>
                <div className="text-sm text-muted-foreground">현재 버전</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">창의성</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">🔄</div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
