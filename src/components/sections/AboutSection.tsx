import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const AboutSection: React.FC = () => {
  const features = [
    {
      title: '깔끔한 디자인',
      description: '직관적이고 현대적인 인터페이스로 사용자 경험을 극대화합니다.',
      icon: '🎨',
    },
    {
      title: '호환성',
      description: '다양한 메신저와 협업 도구를 하나의 플랫폼에서 사용할 수 있습니다.',
      icon: '🔗',
    },
    {
      title: '클라우드와 호환',
      description: 'Google Drive, Dropbox 등 클라우드 저장소와 완벽하게 연동됩니다.',
      icon: '☁️',
    },
    {
      title: '다양한 앱',
      description: 'Slack, Discord, Notion, Teams 등 주요 생산성 앱을 모두 지원합니다.',
      icon: '📱',
    },
  ];

  return (
    <Section id="about" background="muted" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loop는 무엇인가요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            흩어져 있는 메신저와 협업 도구들을 하나로 모아 생산성을 극대화하는 
            새로운 방식의 통합 플랫폼입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Loop의 차별점</h3>
            <p className="text-muted-foreground mb-4">
              더 이상 여러 앱을 오가며 시간을 낭비하지 마세요. 
              Loop는 모든 커뮤니케이션과 협업 도구를 한 곳에 모아줍니다.
            </p>
            <p className="text-muted-foreground mb-6">
              실시간 동기화, 스마트한 알림 관리, 그리고 직관적인 인터페이스로 
              업무 효율성을 새로운 차원으로 끌어올리세요.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">지원 플랫폼</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">제품 라인업</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">가능성</div>
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
