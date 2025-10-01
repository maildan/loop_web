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
      title: '이야기 구조 분석',
      description: '더 깊고 설득력 있는 스토리. 구조·흐름·감정선을 분석해 전개를 제안합니다.',
      icon: '🧩',
    },
    {
      title: 'AI 창작 파트너',
      description: '발상부터 교정까지 함께하는 지능형 도우미로 시간은 단축하고 퀄은 업.',
      icon: '🤖',
    },
    {
      title: '몰입형 글쓰기 환경',
      description: '방해 요소 최소화. 오직 이야기와 문장에만 집중할 수 있는 간결한 UI.',
      icon: '✍️',
    },
    {
      title: '강력한 데스크톱 성능',
      description: 'Electron 기반 크로스플랫폼. Windows·macOS·Linux에서 빠르고 안정적으로.',
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
            <div 
              className="aspect-square rounded-2xl flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: 'url(/banner.jpg)' }}
              aria-label="Loop banner"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};
