import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { downloadLatestRelease } from '../../utils/downloadHelper';

export const HeroSection: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadLatestRelease();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Section id="home" padding="xl" className="min-h-screen flex items-center">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            쓰고 , 다듬고 ,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              다시
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            작가의 가장 자연스러운 과정을 Loop가 가장 매끄럽게 이어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" onClick={handleDownload} disabled={downloading}>
              Loop 다운로드
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              자세히 보기
            </Button>
          </div>

          {/* Platform logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-medium text-muted-foreground">지원 플랫폼:</div>
            <div className="flex flex-wrap justify-center gap-6">
              <span className="text-sm bg-muted px-3 py-1 rounded-full">Windows</span>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">MacOS</span>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">추후 준비 중..</span>
              
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </Container>
    </Section>
  );
};
