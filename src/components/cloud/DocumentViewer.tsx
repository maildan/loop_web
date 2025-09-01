import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTheme } from '../ui/ThemeProvider';
import { Share, Download, Edit, Copy } from 'lucide-react';
import { Document } from './DocumentSelector';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Tooltip
} from 'recharts';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const chartColors = {
    tooltipBg: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
    tooltipBorder: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
    tooltipText: isDarkMode ? '#ffffff' : '#1e293b',
    pie: {
      segment: [
        isDarkMode ? '#4285F4' : '#1a73e8', // 서론
        isDarkMode ? '#34A853' : '#0f7b0f', // 본론
        isDarkMode ? '#FBBC05' : '#e37400', // 결론
      ],
      density: [
        isDarkMode ? '#FF6B6B' : '#e74c3c', // 높음
        isDarkMode ? '#4ECDC4' : '#16a085', // 보통
        isDarkMode ? '#45B7D1' : '#3498db', // 낮음
      ],
      readability: [
        isDarkMode ? '#2ECC71' : '#27ae60', // 우수
        isDarkMode ? '#F39C12' : '#f39c12', // 보통
        isDarkMode ? '#E74C3C' : '#c0392b', // 개선필요
      ],
      stroke: isDarkMode ? '#333' : '#1e293b',
    },
    copyStatus: isDarkMode ? 'text-green-400' : 'text-green-600',
  };
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  // 문서 세그먼트 분석 - 고정 데이터 (서론 20%, 본론 60%, 결론 20%)
  const documentSegments = useMemo(() => [
    { name: '서론', value: 20 },
    { name: '본론', value: 60 },
    { name: '결론', value: 20 },
  ], []);

  // 복사 기능 구현 (Clipboard API와 fallback 방식 지원)
  const handleCopy = async (text: string) => {
    try {
      // 현대적인 Clipboard API 시도
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('복사되었습니다!');
        setTimeout(() => setCopyStatus(null), 2000);
        return;
      }
      
      // Fallback: execCommand 방식
      const textArea = window.document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      window.document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = window.document.execCommand('copy');
      window.document.body.removeChild(textArea);
      
      if (successful) {
        setCopyStatus('복사되었습니다!');
      } else {
        setCopyStatus('복사 실패');
      }
      setTimeout(() => setCopyStatus(null), 2000);
      
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('복사 실패');
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  // 앱 유형에 따른 스타일 및 레이블 
  const getAppTypeInfo = (type: string) => {
    switch (type) {
      case 'google-docs':
        return { 
          label: 'Google Docs', 
          icon: '📄', 
          variant: 'default',
          color: '#4285F4' 
        };
      case 'notion':
        return { 
          label: 'Notion', 
          icon: '📝', 
          variant: 'outline',
          color: '#000000' 
        };
      case 'slack':
        return { 
          label: 'Slack', 
          icon: '💬', 
          variant: 'secondary',
          color: '#4A154B' 
        };
      default:
        return { 
          label: '기타', 
          icon: '📋', 
          variant: 'destructive',
          color: '#6B7280' 
        };
    }
  };

  // 문서 유형에 따른 가상 내용 생성
  const generateDocumentContent = (doc: Document) => {
    switch(doc.type) {
      case 'google-docs':
        return `# ${doc.name}

## 개요

Loop는 혁신적인 협업 도구로, 다양한 메신저와 협업 도구를 통합하여 효율적인 업무 환경을 제공합니다.

## 주요 기능

1. 메신저 통합
2. 클라우드 저장소 연동
3. 작업 관리 도구
4. 일정 관리

## 목표 및 전략

* 사용자 경험 개선
* 기능 확장
* 시장 점유율 증가
* 글로벌 시장 진출`;
      case 'notion':
        return `# ${doc.name}

**팀원들과 공유할 내용:**

- [ ] 개발 로드맵 검토
- [ ] 사용자 피드백 분석
- [ ] 다음 버전 기능 계획

> 중요: 다음 미팅 전까지 완료해주세요!

## 개발 일정

| 항목 | 담당자 | 마감일 |
| --- | --- | --- |
| UI 개선 | 디자인팀 | 6월 10일 |
| 백엔드 API | 서버팀 | 6월 15일 |
| 테스트 | QA팀 | 6월 20일 |`;
      case 'slack':
        return `# ${doc.name}

**@개발팀** 오늘 진행된 회의 내용 공유드립니다.

@사용자1: 지난번 피드백 반영 상황은 어떤가요?
@사용자2: UI 부분은 80% 완료되었고, 백엔드 연동 작업 진행 중입니다.
@사용자3: 테스트 계획은 언제쯤 공유되나요?
@사용자1: 이번 주 금요일까지 공유하겠습니다.

**결정사항:**
1. 다음 릴리스는 6월 말로 연기
2. 베타 테스트 2주간 진행
3. 우선순위 기능: 알림 개선, 동기화 속도 향상`;
      default:
        return `# ${doc.name}

이 문서는 Loop 플랫폼에서 생성된 ${doc.type} 유형의 문서입니다.

총 ${doc.wordCount}자로 구성되어 있으며, 읽는데 약 ${doc.readingTime}분이 소요됩니다.

최종 수정일: ${doc.lastModified.toLocaleDateString('ko-KR')}`;
    }
  };

  const appType = getAppTypeInfo(document.type);

  return (
    <Card className="overflow-hidden overflow-x-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle>{document.name}</CardTitle>
            <Badge 
              variant={appType.variant as 'default' | 'secondary' | 'destructive' | 'outline'} 
              className="ml-2"
              size="lg"
            >
              {appType.icon} {appType.label}
            </Badge>
          </div>
          <div className="flex space-x-2 overflow-hidden">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              편집
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-hidden overflow-x-hidden">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">{document.wordCount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">단어 수</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">{document.readingTime}분</div>
            <div className="text-sm text-muted-foreground">읽기 시간</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">
              {document.lastModified.toLocaleDateString('ko-KR')}
            </div>
            <div className="text-sm text-muted-foreground">최종 수정</div>
          </div>
        </div>

        {/* 문서 세그먼트 분석 차트들 */}
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-6">
          {/* 1. 문서 구성 분석 차트 */}
          <div className="border rounded-lg p-8 pt-0 bg-card min-h-[300px] overflow-hidden overflow-x-hidden document-composition-chart">
            <h3 className="chart-title font-medium mb-4 text-center text-sm">문서 구성 분석</h3>
            
            {/* 모바일에서는 텍스트 기반 구성 표시 */}
            <div className="block md:hidden">
              <div className="space-y-3">
                {documentSegments.map((segment, index) => (
                  <div key={segment.name} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <span className="font-medium">{segment.name}</span>
                    <span className="text-lg font-bold">{segment.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 데스크톱에서는 원형 그래프 표시 */}
            <div className="hidden md:flex justify-center" style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    startAngle={90}
                    endAngle={450}
                    isAnimationActive={false}
                  >
                    {documentSegments.map((entry, index) => {
                      const colors = [
                        chartColors.pie.segment[0],
                        chartColors.pie.segment[1],
                        chartColors.pie.segment[2],
                      ];
                      return (
                        <Cell 
                          key={`segment-cell-${index}`} 
                          fill={colors[index]} 
                          stroke={chartColors.pie.stroke}
                          strokeWidth={isDarkMode ? 2 : 3}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: '8px',
                      color: chartColors.tooltipText
                    }}
                    formatter={(value: number, name:string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. 텍스트 밀도 분석 차트 */}
          <div className="border rounded-lg p-8 pt-0 bg-card min-h-[300px] overflow-hidden overflow-x-hidden text-density-chart">
            <h3 className="chart-title font-medium mb-4 text-center text-sm">텍스트 밀도</h3>
            
            {/* 모바일에서는 텍스트 기반 구성 표시 */}
            <div className="block md:hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">높음</span>
                  <span className="text-lg font-bold">40%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">보통</span>
                  <span className="text-lg font-bold">45%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">낮음</span>
                  <span className="text-lg font-bold">15%</span>
                </div>
              </div>
            </div>
            
            {/* 데스크톱에서는 원형 그래프 표시 */}
            <div className="hidden md:flex justify-center" style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '높음', value: 40 },
                      { name: '보통', value: 45 },
                      { name: '낮음', value: 15 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    startAngle={90}
                    endAngle={450}
                    isAnimationActive={false}
                  >
                    {[
                      { name: '높음', value: 40 },
                      { name: '보통', value: 45 },
                      { name: '낮음', value: 15 },
                    ].map((entry, index) => {
                      const colors = [
                        chartColors.pie.density[0],
                        chartColors.pie.density[1],
                        chartColors.pie.density[2],
                      ];
                      return (
                        <Cell 
                          key={`density-cell-${index}`} 
                          fill={colors[index]} 
                          stroke={chartColors.pie.stroke}
                          strokeWidth={isDarkMode ? 2 : 3}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: '8px',
                      color: chartColors.tooltipText
                    }}
                    formatter={(value: number, name:string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. 가독성 점수 차트 */}
          <div className="border rounded-lg p-8 pt-0 bg-card min-h-[300px] overflow-hidden overflow-x-hidden readability-score-chart">
            <h3 className="chart-title font-medium mb-4 text-center text-sm">가독성 점수</h3>
            
            {/* 모바일에서는 텍스트 기반 구성 표시 */}
            <div className="block md:hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">우수</span>
                  <span className="text-lg font-bold">35%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">양호</span>
                  <span className="text-lg font-bold">40%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">보통</span>
                  <span className="text-lg font-bold">25%</span>
                </div>
              </div>
            </div>
            
            {/* 데스크톱에서는 원형 그래프 표시 */}
            <div className="hidden md:flex justify-center" style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '우수', value: 65 },
                      { name: '보통', value: 25 },
                      { name: '개선필요', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    startAngle={90}
                    endAngle={450}
                    isAnimationActive={false}
                  >
                    {[
                      { name: '우수', value: 65 },
                      { name: '보통', value: 25 },
                      { name: '개선필요', value: 10 },
                    ].map((entry, index) => {
                      const colors = [
                        chartColors.pie.readability[0],
                        chartColors.pie.readability[1],
                        chartColors.pie.readability[2],
                      ];
                      return (
                        <Cell 
                          key={`readability-cell-${index}`} 
                          fill={colors[index]} 
                          stroke={chartColors.pie.stroke}
                          strokeWidth={isDarkMode ? 2 : 3}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: '8px',
                      color: chartColors.tooltipText
                    }}
                    formatter={(value: number, name:string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">문서 내용</h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCopy(generateDocumentContent(document))}
              >
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
              {copyStatus && (
                <span className={`text-sm ${chartColors.copyStatus} font-medium`}>
                  {copyStatus}
                </span>
              )}
            </div>
          </div>
          <div className="prose max-w-none">
            {generateDocumentContent(document).split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-semibold mb-3 mt-6">{line.substring(3)}</h2>;
              } else if (line.startsWith('* ')) {
                return <li key={index} className="ml-6">{line.substring(2)}</li>;
              } else if (line.startsWith('- [ ] ')) {
                return (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input type="checkbox" className="rounded" />
                    <span>{line.substring(6)}</span>
                  </div>
                );
              } else if (line.startsWith('> ')) {
                return <blockquote key={index} className="pl-4 border-l-4 border-primary/20 italic my-4">{line.substring(2)}</blockquote>;
              } else if (line.startsWith('|')) {
                // 간단한 테이블 처리
                return <div key={index} className="font-mono text-sm my-1">{line}</div>;
              } else if (line.startsWith('@')) {
                return <p key={index} className="mb-2"><strong>{line.split(':')[0]}</strong>: {line.split(':')[1]}</p>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                return <li key={index} className="ml-6 list-decimal">{line.substring(3)}</li>;
              } else {
                return <p key={index} className="mb-2">{line}</p>;
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
