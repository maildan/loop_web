import React from 'react';
import { Smartphone, Touchpad, Cloud, Globe } from 'lucide-react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle } from '../ui/Card';

const features = [
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: '모바일 최적화',
    description: '어떤 기기에서든 완벽하게 반응하는 인터페이스를 경험하세요. 작고 강력합니다.'
  },
  {
    icon: <Touchpad className="h-8 w-8 text-primary" />,
    title: '터치 인터페이스',
    description: '손끝으로 모든 것을 제어하세요. 직관적인 제스처로 작업 효율을 높입니다.'
  },
  {
    icon: <Cloud className="h-8 w-8 text-primary" />,
    title: '클라우드 동기화',
    description: '모든 디바이스에서 데이터가 실시간으로 동기화됩니다. 언제나 최신 상태를 유지하세요.'
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: '웹 접근성',
    description: '별도의 설치 없이 브라우저만 있다면 어디서든 Loop에 접근할 수 있습니다.'
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <Section id="services" className="bg-slate-50 dark:bg-slate-900">
      <Container className="py-24 sm:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">하나의 Loop, 모든 순간을 위해</h2>
          <p className="text-lg text-muted-foreground">
            Loop는 당신의 작업 흐름을 혁신하고, 여러 플랫폼에 분산된 커뮤니케이션을 하나로 통합하여 최고의 생산성을 제공합니다.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center p-6 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
            >
              <CardHeader className="flex flex-col items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};