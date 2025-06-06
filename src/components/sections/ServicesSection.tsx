import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { WindowsIcon, MacOSIcon, UbuntuIcon } from '../../assets/icons';

export const ServicesSection: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<'pro' | 'novel'>('pro');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const products = {
    pro: {
      title: 'Loop Pro',
      subtitle: '전문가를 위한 데스크톱 솔루션',
      description: '고성능 데스크톱 환경에서 최고의 생산성을 경험하세요. 전문가 수준의 기능과 높은 확장성을 제공합니다.',
      gradient: 'from-blue-600 to-purple-600',
      platforms: [
        { name: 'Windows', icon: WindowsIcon, supported: true, color: 'text-blue-500' }
      ],
      features: [
        { 
          title: '고급 워크스페이스 관리',
          description: '멀티 워크스페이스와 프로젝트 관리',
          icon: '🏢'
        },
        {
          title: '플러그인 생태계', 
          description: '확장 가능한 플러그인 시스템',
          icon: '🔧'
        },
        {
          title: '오프라인 모드',
          description: '인터넷 없이도 완전한 기능 사용',
          icon: '🔒'
        },
        {
          title: '고급 알림 시스템',
          description: '스마트 알림과 우선순위 관리',
          icon: '🔔'
        },
        {
          title: '키보드 단축키',
          description: '전문가를 위한 키보드 중심 워크플로우',
          icon: '⌨️'
        },
        {
          title: '데이터 분석',
          description: '상세한 사용 패턴 분석과 리포트',
          icon: '📊'
        }
      ]
    },
    novel: {
      title: 'Loop Novel',
      subtitle: '크로스 플랫폼 유니버설 솔루션',
      description: '어디서나 접근 가능한 유연한 솔루션으로, 모든 플랫폼에서 일관된 경험을 제공합니다.',
      gradient: 'from-green-500 to-teal-500',
      platforms: [
        { name: 'Windows', icon: WindowsIcon, supported: true, color: 'text-blue-500' },
        { name: 'macOS', icon: MacOSIcon, supported: true, color: 'text-gray-600' },
        { name: 'Ubuntu', icon: UbuntuIcon, supported: true, color: 'text-orange-600' }
      ],
      features: [
        {
          title: '크로스 플랫폼 동기화',
          description: '모든 기기에서 완벽한 동기화',
          icon: '🔄'
        },
        {
          title: '터치 최적화',
          description: '모바일과 태블릿 친화적 인터페이스',
          icon: '👆'
        },
        {
          title: '웹 기반 접근',
          description: '브라우저에서 바로 사용 가능',
          icon: '🌐'
        },
        {
          title: '클라우드 저장소',
          description: '자동 백업과 클라우드 저장',
          icon: '☁️'
        },
        {
          title: '간편한 설정',
          description: '몇 번의 클릭으로 완료되는 설정',
          icon: '⚡'
        },
        {
          title: '경량 설계',
          description: '최소한의 시스템 리소스 사용',
          icon: '🪶'
        }
      ]
    }
  };

  const currentProduct = products[activeProduct];

  return (
    <Section id="services" className="relative overflow-hidden">
      <Container className="relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">제품 라인업</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            당신에게 맞는 Loop을 선택하세요
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            사용 환경과 필요에 따라 최적화된 두 가지 버전을 제공합니다
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex justify-center mb-16">
          <div className="relative bg-muted p-1 rounded-lg overflow-hidden">
            <div className="relative flex">
              <Button
                variant={activeProduct === 'pro' ? 'primary' : 'ghost'}
                onClick={() => setActiveProduct('pro')}
                className="flex-1 px-6 py-3 rounded-md text-sm font-medium min-w-[90px] flex items-center justify-center"
              >
                Loop Pro
              </Button>
              <Button
                variant={activeProduct === 'novel' ? 'primary' : 'ghost'}
                onClick={() => setActiveProduct('novel')}
                className="flex-1 px-6 py-3 rounded-md text-sm font-medium min-w-[90px] flex items-center justify-center"
              >
                Loop Novel
              </Button>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${currentProduct.gradient} text-white`}>
                <h3 className="text-3xl font-bold">{currentProduct.title}</h3>
                <p className="text-lg opacity-90 mt-1">{currentProduct.subtitle}</p>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Platform Support */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white">지원 플랫폼</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                {currentProduct.platforms.map((platform, index) => (
                  <div 
                    key={platform.name}
                    className="group flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 -ml-3 mt-15"
                  >
                    <platform.icon size={24} className={platform.color} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{platform.name}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="space-y-8">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white">주요 기능</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProduct.features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 dark:border-slate-700 ${
                    hoveredFeature === index ? 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-750' : 'bg-white/80 dark:bg-slate-800/80'
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardContent className="pt-2 pb-6 px-6">
                    <div className="flex items-start gap-3 mt-15">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${currentProduct.gradient} text-white text-xl shrink-0 group-hover:scale-110 transition-transform duration-300 -ml-3`}>
                        {feature.icon}
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          {feature.title}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="px-8 py-3 rounded-md text-sm font-medium flex items-center justify-center mx-auto"
          >
            {currentProduct.title} 자세히 보기
          </Button>
        </div>
      </Container>
    </Section>
  );
};