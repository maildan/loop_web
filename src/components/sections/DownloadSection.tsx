import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { WindowsIcon, MacOSIcon, UbuntuIcon } from '../../assets/icons';

export const DownloadSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const downloadData = {
    novel: {
      title: 'Loop Novel',
      description: '크로스 플랫폼 유니버설 솔루션',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      accentColor: 'text-emerald-500',
      downloads: [
        {
          id: 'novel-windows',
          os: 'Windows',
          icon: WindowsIcon,
          iconColor: 'text-blue-500',
          version: 'v2.1.0',
          size: '198 MB',
          downloadUrl: '#',
          requirements: 'Windows 10 이상',
          bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
          id: 'novel-macos',
          os: 'macOS',
          icon: MacOSIcon,
          iconColor: 'text-gray-600',
          version: 'v2.1.0',
          size: '185 MB',
          downloadUrl: '#',
          requirements: 'macOS 11.0 이상',
          bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20',
          borderColor: 'border-gray-200 dark:border-gray-800'
        },
        {
          id: 'novel-ubuntu',
          os: 'Ubuntu',
          icon: UbuntuIcon,
          iconColor: 'text-orange-600',
          version: 'v2.1.0',
          size: '210 MB',
          downloadUrl: '#',
          requirements: 'Ubuntu 20.04 이상',
          bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        }
      ]
    }
  };

  const currentData = downloadData.novel;

  return (
    <Section id="download">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">지금 다운로드 가능</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              Loop 다운로드
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            사용하시는 플랫폼에 맞는 Loop을 선택하여 바로 시작하세요
          </p>
        </div>

        {/* Product Info */}
        <div className="text-center mb-16">
          <div className={`inline-block p-6 rounded-3xl bg-gradient-to-r ${currentData.gradient} text-white mb-6 shadow-2xl`}>
            <h3 className="text-3xl font-bold">{currentData.title}</h3>
            <p className="text-lg opacity-90 mt-2">{currentData.description}</p>
          </div>
        </div>

        {/* Download Cards */}
        <div className="max-w-5xl mx-auto">
          <div className={`flex flex-col sm:grid gap-6 ${currentData.downloads.length === 1 ? 'sm:grid-cols-1 max-w-md mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {currentData.downloads.map((download) => (
              <Card 
                key={download.id}
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${download.bgGradient} border-2 ${download.borderColor} ${
                  hoveredCard === download.id ? 'shadow-2xl transform scale-105' : 'shadow-xl'
                }`}
                onMouseEnter={() => setHoveredCard(download.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentData.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mb-6 mt-15 -ml-3">
                    <div className={`inline-flex p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg group-hover:shadow-xl transition-all duration-300 ${download.iconColor}`}>
                      <download.icon size={48} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {download.os}
                  </CardTitle>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {download.requirements}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Version Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">버전</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{download.version}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">크기</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{download.size}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button 
                    className={`w-full py-3 text-base font-semibold bg-gradient-to-r ${currentData.gradient} hover:opacity-90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                    onClick={() => window.open(download.downloadUrl, '_blank')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>다운로드</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                      </svg>
                    </div>
                  </Button>

                  {/* Additional Links */}
                  <div className="flex justify-between text-sm">
                    <button className={`${currentData.accentColor} hover:underline font-medium transition-colors`}>
                      릴리스 노트
                    </button>
                    <button className={`${currentData.accentColor} hover:underline font-medium transition-colors`}>
                      시스템 요구사항
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
              <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                모든 플랫폼에서 동일한 경험
              </h4>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Loop Novel은 Windows, macOS, Linux 모든 플랫폼에서 일관된 사용 경험을 제공합니다. 어떤 환경에서도 동일한 기능을 사용할 수 있습니다.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>무료 평가판</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>정기 업데이트</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>기술 지원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};