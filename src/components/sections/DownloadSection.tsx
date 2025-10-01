import React, { useEffect, useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Windows11Icon, MacOSIcon, UbuntuIcon } from '../../assets/icons';
import { fetchLatestRelease, selectAssetForPlatform, detectPlatform, type ReleaseData } from '../../utils/downloadHelper';

export const DownloadSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [release, setRelease] = useState<ReleaseData | null>(null);

  useEffect(() => {
    fetchLatestRelease().then(setRelease);
  }, []);

  const getAssetUrl = (osType: 'windows' | 'macos' | 'linux', archType: 'arm64' | 'x64', fallback: string) => {
    if (!release) return fallback;
    return selectAssetForPlatform(release.assets, { os: osType, arch: archType }) || fallback;
  };

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
          icon: Windows11Icon,
          iconColor: 'text-slate-900 dark:text-white',
          version: release?.version || 'v1.1.2',
          size: '400 MB',
          downloadUrl: getAssetUrl('windows', 'x64', '#'),
          requirements: 'Windows 11 이상',
          bgGradient: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          released: true
        },
        {
          id: 'novel-macos',
          os: 'macOS',
          icon: MacOSIcon,
          iconColor: 'text-slate-900 dark:text-white',
          version: release?.version || 'v1.1.2',
          size: '685 MB',
          downloadUrl: getAssetUrl('macos', (detectPlatform().arch === 'arm64' ? 'arm64' : 'x64'), '#'),
          
          requirements: 'macOS 11.0 이상',
          bgGradient: 'from-slate-50/80 to-gray-50/80 dark:from-gray-950/20 dark:to-slate-950/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          released: true
        },
        {
          id: 'novel-ubuntu',
          os: 'Linux',
          icon: UbuntuIcon,
          iconColor: 'text-orange-600',
          version: release?.version || '출시 예정',
          size: '- MB',
          downloadUrl: getAssetUrl('linux', 'x64', '#'),
          requirements: 'Ubuntu 20.04 이상',
          bgGradient: 'from-gray-100/90 to-slate-100/90 dark:from-gray-800/20 dark:to-gray-900/20',
          borderColor: 'border-gray-300 dark:border-gray-700',
          released: false
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
            <span className="text-sm font-medium text-gray-700 dark:text-slate-400">지금 다운로드 가능</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white text-balance korean-wrap">
            Loop 다운로드
          </h2>
          <p className="text-xl text-gray-700 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed text-pretty korean-wrap">
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
                    <div className={`inline-flex p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg group-hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200/60 dark:ring-slate-700 ${download.iconColor}`}>
                      {React.createElement(download.icon as any, { className: 'w-12 h-12', 'aria-hidden': true })}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {download.os}
                  </CardTitle>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    {download.requirements}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Version Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">버전</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{download.version}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">크기</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{download.size}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  {download.released ? (
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
                  ) : (
                    <Button 
                      className={`w-full py-3 text-base font-semibold bg-gray-400 dark:bg-gray-600 text-white rounded-lg cursor-not-allowed`}
                      disabled
                    >
                      출시 예정
                    </Button>
                  )}

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
      
      </Container>
    </Section>
  );
};