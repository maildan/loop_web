import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { Document } from './DocumentSelector';
import { MobileNav } from './MobileNav';
import { useTheme } from '../ui/ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { StatCard } from './StatCard';
import { RecentDocuments } from './RecentDocuments';
import { fetchDocuments, fetchDashboardStats, createDocument } from '@/services/documents';
import { fetchUserProfile, updateUserGoals } from '@/services/user';
import { Toaster, toast } from 'sonner';
import {
  FileText,
  Clock,
  TrendingUp,
  Target,
  PlusCircle,
  X as XIcon,
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

// Lazy loaded components for better performance
const DocumentSelector = React.lazy(() => import('./DocumentSelector').then(module => ({ default: module.DocumentSelector })));
const DocumentViewer = React.lazy(() => import('./DocumentViewer').then(module => ({ default: module.DocumentViewer })));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Mock data

interface User {
  name: string;
  email: string;
  profilePictureUrl: string;
}

interface DashboardStats {
  totalDocuments: number;
  totalWords: number;
  totalReadingTime: number;
  avgWordsPerDoc: number;
  weeklyData: { name: string; documents: number; words: number; }[];
  typeDistribution: { name: string; value: number; color: string; }[];
}

export function CloudDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileViewerOpen, setIsMobileViewerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [goals, setGoals] = useState({ weeklyDocs: 0, monthlyWords: 0 });
  const [isEditGoalsModalOpen, setEditGoalsModalOpen] = useState(false);
  const [editedGoals, setEditedGoals] = useState(goals);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const productivityMetrics = useMemo(() => {
    if (!stats) {
      return {
        avgDocsPerDay: 0,
        avgWordsPerDay: '0',
        mostActiveDay: 'N/A',
        preferredPlatform: 'N/A',
      };
    }

    const totalWeeklyDocs = stats.weeklyData.reduce((sum, day) => sum + day.documents, 0);
    const totalWeeklyWords = stats.weeklyData.reduce((sum, day) => sum + day.words, 0);

    const mostActive = [...stats.weeklyData].sort((a, b) => b.documents - a.documents)[0];
    const mostUsedPlatform = [...stats.typeDistribution].sort((a, b) => b.value - a.value)[0];

    return {
      avgDocsPerDay: (totalWeeklyDocs / 7).toFixed(1),
      avgWordsPerDay: Math.round(totalWeeklyWords / 7).toLocaleString(),
      mostActiveDay: mostActive ? mostActive.name : 'N/A',
      preferredPlatform: mostUsedPlatform ? mostUsedPlatform.name : 'N/A',
    };
  }, [stats]);

  const goalProgress = useMemo(() => {
    if (!stats) {
      return {
        weeklyDocsProgress: 0,
        monthlyWordsProgress: 0,
        currentWeeklyDocs: 0,
        currentMonthlyWords: 0,
      };
    }
    const currentWeeklyDocs = stats.weeklyData.reduce((sum, day) => sum + day.documents, 0);
    // Assuming totalWords in stats is for the month for simplicity.
    // A more accurate implementation would need monthly data.
    const currentMonthlyWords = stats.totalWords;

    return {
      weeklyDocsProgress: Math.min((currentWeeklyDocs / goals.weeklyDocs) * 100, 100),
      monthlyWordsProgress: Math.min((currentMonthlyWords / goals.monthlyWords) * 100, 100),
      currentWeeklyDocs,
      currentMonthlyWords,
    };
  }, [stats, goals]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [userData, docsData, statsData] = await Promise.all([
          fetchUserProfile(token),
          fetchDocuments(),
          fetchDashboardStats()
        ]);

        setUser(userData);
        const weeklyDocs = userData.goal_weekly_docs || 0;
        const monthlyWords = userData.goal_monthly_words || 0;
        setGoals({ weeklyDocs, monthlyWords });
        setEditedGoals({ weeklyDocs, monthlyWords });
        setDocuments(docsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl && ['overview', 'documents', 'analytics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    if (isMobile) {
      setIsMobileViewerOpen(true);
    }
  };

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) return;
    try {
      const newDoc = await createDocument(newDocTitle);
      setIsCreateDocModalOpen(false);
      setNewDocTitle('');
      setDocuments(prevDocs => [newDoc, ...prevDocs]);
      const updatedStats = await fetchDashboardStats();
      setStats(updatedStats);
      toast.success('새 문서가 생성되었습니다.');
    } catch (error) {
      toast.error('문서 생성에 실패했습니다.');
      console.error('Failed to create document:', error);
    }
  };

  const handleUpdateGoals = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('인증 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }
    try {
      await updateUserGoals(token, editedGoals);
      setGoals(editedGoals);
      setEditGoalsModalOpen(false);
      toast.success('목표가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      toast.error('목표 업데이트에 실패했습니다.');
      console.error(error);
    }
  };

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster richColors position="top-center" />
      <Container className="py-8 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex md:hidden items-center -mt-2">
              <MobileNav activeSection={activeTab} onSectionChange={handleTabChange} />
            </div>
            <h1 className="text-2xl font-bold">{user ? `${user.name}의 대시보드` : '대시보드'}</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <Button onClick={() => setIsCreateDocModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 문서 만들기
          </Button>
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
              <StatCard title="총 문서 수" value={stats?.totalDocuments ?? 0} description="+12% 지난 주 대비" icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
              <StatCard title="총 단어 수" value={stats?.totalWords.toLocaleString() ?? '0'} description="+8% 지난 주 대비" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
              <StatCard title="총 읽기 시간" value={`${stats?.totalReadingTime ?? 0}분`} description={`평균 ${stats?.totalDocuments ? Math.round(stats.totalReadingTime / stats.totalDocuments) : 0}분/문서`} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
              <StatCard title="문서당 평균 단어" value={stats?.avgWordsPerDoc ?? 0} description="표준 A4 약 3-4장" icon={<Target className="h-4 w-4 text-muted-foreground" />} />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>주간 활동</CardTitle>
                </CardHeader>
                <CardContent className="weekly-activity-chart">
                  <ResponsiveContainer width="99%" height={300}>
                    <AreaChart data={stats?.weeklyData ?? []}>
                      <defs>
                        <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.areaFill} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartColors.areaFill} stopOpacity={0.1} />
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
                  <div style={{ width: '100%', height: '430px', position: 'relative' }}>
                    <ResponsiveContainer width="99%" height="100%" key={`pie-chart-${isDarkMode ? 'dark' : 'light'}`}>
                      <PieChart>
                        <Pie
                          data={stats?.typeDistribution ?? []}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          labelLine={false}
                          startAngle={90}
                          endAngle={450}
                          isAnimationActive={false}
                        >
                          {(stats?.typeDistribution ?? []).map((entry, index) => (
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
                          formatter={(value: any, name: any) => [`${value}건 (${((value / (stats?.typeDistribution ?? []).reduce((sum, item) => sum + item.value, 1)) * 100).toFixed(1)}%)`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Documents */}
            <RecentDocuments documents={documents} onDocumentSelect={handleDocumentSelect} />
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
                  <div className="text-2xl font-bold">{stats?.totalDocuments ?? 0}</div>
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
                  <div className="text-2xl font-bold">{stats?.totalWords.toLocaleString() ?? '0'}</div>
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
                  <div className="text-2xl font-bold">{stats?.totalReadingTime ?? 0}분</div>
                  <p className="text-xs text-muted-foreground">
                    평균 {stats?.totalDocuments ? Math.round(stats.totalReadingTime / stats.totalDocuments) : 0}분/문서
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">문서당 평균 단어</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgWordsPerDoc ?? 0}</div>
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
                  <ResponsiveContainer width="99%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats?.typeDistribution ?? []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {(stats?.typeDistribution ?? []).map((entry, index) => (
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
                  <ResponsiveContainer width="99%" height={250}>
                    <AreaChart data={stats?.weeklyData ?? []}>
                      <defs>
                        <linearGradient id="colorWordsDocTab" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.areaFill} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartColors.areaFill} stopOpacity={0.1} />
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
              <div className="lg:col-span-1 min-w-0">
                <Card>
                  <CardHeader>
                    <CardTitle>문서 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                      <DocumentSelector
                        documents={documents}
                        selectedDocument={selectedDocument}
                        onDocumentSelect={handleDocumentSelect}
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 min-w-0 hidden lg:block">{selectedDocument ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <DocumentViewer document={selectedDocument} />
                </Suspense>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-96 text-center p-6">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2 text-lg hidden lg:block">문서를 선택하세요</h3>
                    <p className="text-muted-foreground">
                      왼쪽에서 문서를 선택하면 상세 정보가 표시됩니다.
                    </p>
                  </CardContent>
                </Card>
              )}
              </div>

              {isMobile && (
                <Sheet open={isMobileViewerOpen} onOpenChange={setIsMobileViewerOpen}>
                  <SheetContent side="right" className="w-full sm:max-w-full h-full flex flex-col">
                    <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between">
                      <SheetTitle className="truncate flex-grow pr-4">{selectedDocument?.name}</SheetTitle>
                      <button
                        onClick={() => setIsMobileViewerOpen(false)}
                        className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <XIcon className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </button>
                    </SheetHeader>
                    <div className="flex-grow overflow-y-auto p-6">
                      {selectedDocument ? (
                        <Suspense fallback={<LoadingSpinner />}>
                          <DocumentViewer document={selectedDocument} />
                        </Suspense>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          문서가 선택되지 않았습니다.
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>주간 단어 수 추이</CardTitle>
                </CardHeader>
                <CardContent className="weekly-words-trend-chart">
                  <ResponsiveContainer width="99%" height={400}>
                    <LineChart data={stats?.weeklyData ?? []}>
                      <XAxis dataKey="name" tick={{ fill: chartColors.axisColor, fontSize: 12 }} axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }} />
                      <YAxis tick={{ fill: chartColors.axisColor, fontSize: 12 }} axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }} />
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} strokeOpacity={0.3} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: '8px',
                          color: chartColors.tooltipText
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="words"
                        stroke={chartColors.areaStroke}
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
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">일일 평균 문서 작성</span>
                      <span className="font-medium">{productivityMetrics.avgDocsPerDay}개</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">일일 평균 단어 수</span>
                      <span className="font-medium">{productivityMetrics.avgWordsPerDay}자</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">가장 활발한 요일</span>
                      <span className="font-medium">{productivityMetrics.mostActiveDay}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">선호하는 플랫폼</span>
                      <span className="font-medium">{productivityMetrics.preferredPlatform}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>목표 달성</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditedGoals(goals);
                        setEditGoalsModalOpen(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>주간 문서 목표</span>
                        <span className="text-muted-foreground">{goalProgress.currentWeeklyDocs}/{goals.weeklyDocs}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goalProgress.weeklyDocsProgress}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>월간 단어 목표</span>
                        <span className="text-muted-foreground">{goalProgress.currentMonthlyWords.toLocaleString()}/{goals.monthlyWords.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goalProgress.monthlyWordsProgress}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>

      {isEditGoalsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">목표 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">주간 문서 목표</label>
                <input
                  type="number"
                  value={editedGoals.weeklyDocs}
                  onChange={(e) => setEditedGoals({ ...editedGoals, weeklyDocs: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">월간 단어 목표</label>
                <input
                  type="number"
                  value={editedGoals.monthlyWords}
                  onChange={(e) => setEditedGoals({ ...editedGoals, monthlyWords: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditGoalsModalOpen(false)}>취소</Button>
              <Button onClick={handleUpdateGoals}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {isCreateDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">새 문서 만들기</h2>
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="문서 제목을 입력하세요..."
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDocModalOpen(false)}>취소</Button>
              <Button onClick={handleCreateDocument}>생성</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
