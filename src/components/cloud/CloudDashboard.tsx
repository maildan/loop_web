import React, { useState, useMemo, useEffect } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { DocumentSelector, Document } from './DocumentSelector';
import { DocumentViewer } from './DocumentViewer';
import { MobileNav } from './MobileNav';
import { useTheme } from '../ui/ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  Target,
  Eye,
  Edit
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: '프로젝트 기획서 - Q4 목표',
    type: 'google-docs',
    lastModified: new Date('2024-01-15'),
    wordCount: 2340,
    readingTime: 8
  },
  {
    id: '2',
    name: '개발팀 미팅 노트',
    type: 'notion',
    lastModified: new Date('2024-01-14'),
    wordCount: 1820,
    readingTime: 6
  },
  {
    id: '3',
    name: '마케팅 전략 토론',
    type: 'slack',
    lastModified: new Date('2024-01-13'),
    wordCount: 950,
    readingTime: 3
  },
  {
    id: '4',
    name: '사용자 피드백 분석',
    type: 'notion',
    lastModified: new Date('2024-01-12'),
    wordCount: 3200,
    readingTime: 12
  }
];

const weeklyData = [
  { name: '월', documents: 12, words: 4500 },
  { name: '화', documents: 19, words: 6200 },
  { name: '수', documents: 8, words: 3800 },
  { name: '목', documents: 15, words: 5900 },
  { name: '금', documents: 22, words: 7100 },
  { name: '토', documents: 6, words: 2400 },
  { name: '일', documents: 4, words: 1800 }
];

const typeDistribution = [
  { name: 'Google Docs', value: 45, color: '#4285F4' },
  { name: 'Notion', value: 30, color: '#000000' },
  { name: 'Slack', value: 20, color: '#4A154B' },
  { name: '기타', value: 5, color: '#6B7280' }
];

export function CloudDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [tabHistory, setTabHistory] = useState<string[]>(['overview']); // Track tab navigation history
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log tab history (can be removed in production)
  useEffect(() => {
    console.log('Tab history:', tabHistory);
  }, [tabHistory]);



  // URL에서 탭 상태 초기화 및 히스토리 관리
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    
    if (tabFromUrl && ['overview', 'documents', 'analytics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // 탭 변경 시 URL 업데이트 및 히스토리에 추가
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // 탭 히스토리 업데이트
    setTabHistory(prev => {
      const newHistory = [...prev];
      // 현재 탭이 히스토리에 있으면 제거하고 맨 끝에 추가
      const existingIndex = newHistory.indexOf(newTab);
      if (existingIndex > -1) {
        newHistory.splice(existingIndex, 1);
      }
      newHistory.push(newTab);
      
      // 히스토리 길이 제한 (최대 10개)
      if (newHistory.length > 10) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    
    const newUrl = `/cloud?tab=${newTab}`;
    navigate(newUrl, { replace: false }); // 히스토리에 새 항목 추가
  };

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabFromUrl = urlParams.get('tab') || 'overview';
      
      if (['overview', 'documents', 'analytics'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const stats = useMemo(() => {
    const totalDocuments = mockDocuments.length;
    const totalWords = mockDocuments.reduce((sum, doc) => sum + doc.wordCount, 0);
    const totalReadingTime = mockDocuments.reduce((sum, doc) => sum + doc.readingTime, 0);
    const avgWordsPerDoc = Math.round(totalWords / totalDocuments);

    return {
      totalDocuments,
      totalWords,
      totalReadingTime,
      avgWordsPerDoc
    };
  }, []);

  // 테마별 차트 색상 설정
  const chartColors = useMemo(() => {
    if (isDarkMode) {
      return {
        // 다크 모드용 색상
        areaStroke: '#8884d8',
        areaFill: '#8884d8',
        gridStroke: 'hsl(var(--muted-foreground))',
        axisColor: 'hsl(var(--foreground))',
        tooltipBg: 'hsl(var(--background))',
        tooltipBorder: 'hsl(var(--border))',
        tooltipText: 'hsl(var(--foreground))',
        pieColors: {
          'Google Docs': '#4285F4', // 밝은 구글 블루
          'Notion': '#E8E8E8',      // 매우 밝은 회색
          'Slack': '#ECB3FF',       // 밝은 퍼플
          '기타': '#D0D0D0'         // 밝은 회색
        }
      };
    } else {
      return {
        // 라이트 모드용 색상
        areaStroke: '#4A90E2',
        areaFill: '#4A90E2',
        gridStroke: 'hsl(var(--muted-foreground))',
        axisColor: 'hsl(var(--foreground))',
        tooltipBg: 'rgba(0, 0, 0, 0.8)',
        tooltipBorder: 'rgba(0, 0, 0, 0.2)',
        tooltipText: '#fff',
        pieColors: {
          'Google Docs': '#1a73e8', // 더 진한 파란색
          'Notion': '#2c2c2c',      // 더 진한 회색
          'Slack': '#4A154B',       // 진한 자주색
          '기타': '#666666'         // 진한 회색
        }
      };
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">대시보드</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <div className="flex md:hidden items-center">
            <MobileNav activeSection={activeTab} onSectionChange={handleTabChange} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="hidden md:flex grid-cols-3">
            <TabsTrigger value="overview">대시보드</TabsTrigger>
            <TabsTrigger value="documents">문서 관리</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 문서 수</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% 지난 주 대비
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 단어 수</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% 지난 주 대비
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 읽기 시간</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReadingTime}분</div>
                  <p className="text-xs text-muted-foreground">
                    평균 {Math.round(stats.totalReadingTime / stats.totalDocuments)}분/문서
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">문서당 평균 단어</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgWordsPerDoc}</div>
                  <p className="text-xs text-muted-foreground">
                    표준 A4 약 3-4장
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>주간 활동</CardTitle>
                </CardHeader>
                <CardContent className="weekly-activity-chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.areaFill} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartColors.areaFill} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: chartColors.axisColor, fontSize: 12 }}
                        axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
                      />
                      <YAxis 
                        tick={{ fill: chartColors.axisColor, fontSize: 12 }}
                        axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
                      />
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={chartColors.gridStroke} 
                        strokeOpacity={0.3} 
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          color: chartColors.tooltipText
                        }}
                        labelStyle={{ 
                          color: chartColors.tooltipText, 
                          fontWeight: 'bold' 
                        }}
                        itemStyle={{ color: chartColors.tooltipText }}
                        formatter={(value: any, name: any) => [`${value}건`, name]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="documents" 
                        stroke={chartColors.areaStroke} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorDocs)" 
                        name="문서 수"
                        dot={{ 
                          strokeWidth: isDarkMode ? 2 : 3, 
                          r: isDarkMode ? 4 : 5, 
                          fill: chartColors.tooltipBg,
                          stroke: isDarkMode ? chartColors.areaStroke : '#1e293b'
                        }}
                        activeDot={{ 
                          r: isDarkMode ? 6 : 8, 
                          strokeWidth: isDarkMode ? 2 : 4, 
                          fill: chartColors.areaStroke,
                          stroke: isDarkMode ? '#ffffff' : '#1e293b'
                        }}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="card-header-inline">
                  <CardTitle className="chart-title">문서 유형 분포</CardTitle>
                </CardHeader>
                <CardContent className="card-content-expanded document-type-distribution-chart">
                  <div style={{ width: '100%', height: '430px' }}>
                    <ResponsiveContainer width="100%" height="100%" key={`pie-chart-${isDarkMode ? 'dark' : 'light'}`}>
                      <PieChart>
                        <Pie
                          data={typeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={
                            120}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          startAngle={90}
                          endAngle={450}
                          isAnimationActive={false}
                        >
                          {typeDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={(chartColors.pieColors as Record<string, string>)[entry.name] || entry.color}
                              stroke={isDarkMode ? '#333' : '#1e293b'}
                              strokeWidth={isDarkMode ? 2 : 3}
                            />
                          ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
                          borderRadius: '8px',
                          boxShadow: isDarkMode ? '0 4px 16px rgba(0, 0, 0, 0.6)' : '0 4px 16px rgba(0, 0, 0, 0.12)',
                          color: isDarkMode ? '#ffffff' : '#1e293b'
                        }}
                        labelStyle={{ 
                          color: isDarkMode ? '#ffffff' : '#1e293b', 
                          fontWeight: '600' 
                        }}
                        itemStyle={{ 
                          color: isDarkMode ? '#e2e8f0' : '#334155' 
                        }}
                        formatter={(value: any, name: any) => [`${value}건 (${((value / typeDistribution.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle>최근 문서</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>문서명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수정일</TableHead>
                      <TableHead>단어 수</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDocuments.slice(0, 3).map((doc) => (
                      <TableRow key={doc.id} onClick={() => {
                        setSelectedDocument(doc);
                        setActiveTab('documents');
                      }} className="cursor-pointer">
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {doc.type === 'google-docs' ? 'Google Docs' : 
                             doc.type === 'notion' ? 'Notion' : 
                             doc.type === 'slack' ? 'Slack' : '기타'}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.lastModified.toLocaleDateString('ko-KR')}</TableCell>
                        <TableCell>{doc.wordCount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDocument(doc);
                                setActiveTab('documents');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // 수정 기능 구현 자리
                                setSelectedDocument(doc);
                                setActiveTab('documents');
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="documents" className="space-y-6">
            {/* 통계 개요 (Overview에서 가져온 부분) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 문서 수</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">
                +12% 지난 주 대비
                </p>
              </CardContent>
              </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 단어 수</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                +8% 지난 주 대비
                </p>
              </CardContent>
              </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 읽기 시간</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReadingTime}분</div>
                <p className="text-xs text-muted-foreground">
                평균 {stats.totalDocuments > 0 ? Math.round(stats.totalReadingTime / stats.totalDocuments) : 0}분/문서
                </p>
              </CardContent>
              </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">문서당 평균 단어</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgWordsPerDoc}</div>
                <p className="text-xs text-muted-foreground">
                표준 A4 약 3-4장
                </p>
              </CardContent>
              </Card>
            </div>

            {/* 문서 유형 분포 그래프 */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
              <CardHeader className="card-header-inline">
                <CardTitle className="chart-title">문서 유형 분포</CardTitle>
              </CardHeader>
              <CardContent className="card-content-expanded document-type-distribution-chart">`
                <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(chartColors.pieColors as Record<string, string>)[entry.name] || entry.color} />
                  ))}
                  </Pie>
                  <Tooltip 
                  contentStyle={{
                    backgroundColor: chartColors.tooltipBg,
                    border: `1px solid ${chartColors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: chartColors.tooltipText
                  }}
                  />
                </PieChart>
                </ResponsiveContainer>
              </CardContent>
              </Card>

              <Card>
              <CardHeader>
                <CardTitle>주간 활동</CardTitle>
              </CardHeader>
              <CardContent className="weekly-activity-chart">
                <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyData}>
                  <defs>
                  <linearGradient id="colorWordsDocTab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.areaFill} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColors.areaFill} stopOpacity={0.1}/>
                  </linearGradient>
                  </defs>
                  <XAxis 
                  dataKey="name"
                  tick={{ fill: chartColors.axisColor, fontSize: 12 }}
                  axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
                  />
                  <YAxis 
                  tick={{ fill: chartColors.axisColor, fontSize: 12 }}
                  axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
                  />
                  <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={chartColors.gridStroke} 
                  strokeOpacity={0.3} 
                  />
                  <Tooltip 
                  contentStyle={{
                    backgroundColor: chartColors.tooltipBg,
                    border: `1px solid ${chartColors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: chartColors.tooltipText
                  }}
                  formatter={(value: any, name: any) => [`${value}건`, name === 'words' ? '단어 수' : '문서 수']}
                  />
                  <Area 
                  type="monotone" 
                  dataKey="documents" // Changed from "words" to "documents" to match overview, or use "words" if intended
                  stroke={chartColors.areaStroke} 
                  fillOpacity={1} 
                  fill="url(#colorWordsDocTab)" 
                  name="문서 수" // Or "단어 수" if dataKey is "words"
                  isAnimationActive={false}
                  />
                </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                <CardTitle>문서 목록</CardTitle>
                </CardHeader>
                <CardContent>
                <DocumentSelector
                  documents={mockDocuments}
                  selectedDocument={selectedDocument}
                  onDocumentSelect={setSelectedDocument}
                />
                </CardContent>
              </Card>
              </div>

              <div className="lg:col-span-2">
              {selectedDocument ? (
                <DocumentViewer document={selectedDocument} />
              ) : (
                <Card>
                <CardContent className="flex flex-col items-center justify-center h-96 text-center p-6">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2 text-lg">문서를 선택하세요</h3>
                  <p className="text-muted-foreground">
                  왼쪽에서 문서를 선택하면 상세 정보가 표시됩니다.
                  </p>
                </CardContent>
                </Card>
              )}
              </div>
            </div>
            </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>주간 단어 수 추이</CardTitle>
                </CardHeader>
                <CardContent className="weekly-words-trend-chart">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={weeklyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="words" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="단어 수"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>생산성 지표</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>일일 평균 문서 작성</span>
                      <span className="font-medium">2.3개</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>일일 평균 단어 수</span>
                      <span className="font-medium">1,247자</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>가장 활발한 요일</span>
                      <span className="font-medium">금요일</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>선호하는 플랫폼</span>
                      <span className="font-medium">Google Docs</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>목표 달성</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>주간 문서 목표</span>
                        <span>14/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>월간 단어 목표</span>
                        <span>32,100/50,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
