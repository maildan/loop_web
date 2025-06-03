import React, { useState, useMemo } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { DocumentSelector, Document } from './DocumentSelector';
import { DocumentViewer } from './DocumentViewer';
import { MobileNav } from './MobileNav';
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

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">대시보드</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <div className="flex md:hidden items-center">
            <MobileNav activeSection={activeTab} onSectionChange={setActiveTab} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="documents" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorDocs)" 
                        name="문서 수"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>문서 유형 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>문서 선택</CardTitle>
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
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-medium mb-2">문서를 선택하세요</h3>
                        <p className="text-muted-foreground">
                          왼쪽에서 문서를 선택하면 상세 정보가 표시됩니다.
                        </p>
                      </div>
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
                <CardContent>
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
