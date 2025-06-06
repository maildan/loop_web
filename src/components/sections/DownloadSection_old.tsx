import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const DownloadSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pro' | 'novel'>('pro');

  const downloads = {
    pro: [
      {
        os: 'Windows',
        icon: '🪟',
        version: 'v2.1.0',
        size: '245 MB',
        downloadUrl: '#',
        requirements: 'Windows 10 이상',
      },
    ],
    novel: [
      {
        os: 'Windows',
        icon: '🪟',
        version: 'v2.1.0',
        size: '198 MB',
        downloadUrl: '#',
        requirements: 'Windows 10 이상',
      },
      {
        os: 'macOS',
        icon: '🍎',
        version: 'v2.1.0',
        size: '185 MB',
        downloadUrl: '#',
        requirements: 'macOS 11.0 이상',
      },
      {
        os: 'Linux',
        icon: '🐧',
        version: 'v2.1.0',
        size: '210 MB',
        downloadUrl: '#',
        requirements: 'Ubuntu 20.04 이상',
      },
    ],
  };

  return (
    <Section id="download" background="muted" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loop 다운로드
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            사용하시는 플랫폼에 맞는 Loop을 다운로드하세요. 
            모든 버전에서 동일한 계정으로 동기화됩니다.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background p-1 rounded-lg border">
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

        {/* Downloads Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              {activeTab === 'pro' ? 'Loop Pro' : 'Loop Novel'}
            </h3>
            <p className="text-muted-foreground">
              {activeTab === 'pro' 
                ? '데스크톱 환경에서 최고의 생산성을 제공하는 전문가용 솔루션'
                : '다양한 플랫폼에서 언제 어디서나 사용할 수 있는 크로스 플랫폼 솔루션'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {downloads[activeTab].map((download, index) => (
              <Card key={`${activeTab}-${download.os}-${index}`} className="w-full max-w-sm text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-2">{download.icon}</div>
                  <CardTitle className="text-xl">{download.os}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">버전:</span>
                      <span className="font-medium">{download.version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">크기:</span>
                      <span className="font-medium">{download.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">요구사항:</span>
                      <span className="font-medium text-right">{download.requirements}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => window.open(download.downloadUrl, '_blank')}
                  >
                    다운로드
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-background/50 rounded-lg p-6 border">
              <h4 className="font-semibold mb-2">
                {activeTab === 'pro' ? '시스템 요구사항' : '플랫폼별 특징'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'pro' 
                  ? 'Loop Pro는 Windows 전용으로 최적화되어 있으며, 강력한 데스크톱 기능을 제공합니다.'
                  : 'Loop Novel은 Windows, macOS, Linux를 모두 지원하여 어떤 환경에서도 사용할 수 있습니다.'
                }
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
