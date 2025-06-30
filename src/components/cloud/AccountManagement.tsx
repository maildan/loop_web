import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { ShieldAlert, CreditCard, Key, Download, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function AccountManagement() {
  return (
    <div className="bg-background pt-6 pb-16 overflow-x-hidden">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">계정 관리</h1>
        </div>

        <Tabs defaultValue="security">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="subscription">구독 관리</TabsTrigger>
            <TabsTrigger value="devices">연결된 기기</TabsTrigger>
            <TabsTrigger value="advanced">고급 설정</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>보안 설정</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">비밀번호 변경</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">새 비밀번호</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md bg-background"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>비밀번호 변경</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">2단계 인증</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    2단계 인증을 활성화하여 계정 보안을 강화하세요.
                  </p>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    2단계 인증 설정
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                  <CardTitle>위험 구역</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  계정 삭제
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>현재 구독</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">프리미엄 플랜</h3>
                    <p className="text-sm text-muted-foreground">연간 구독</p>
                  </div>
                  <Badge>활성</Badge>
                </div>
                <div className="bg-muted p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">다음 결제일</span>
                    <span className="text-sm font-medium">2026년 1월 15일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">결제 금액</span>
                    <span className="text-sm font-medium">₩120,000 / 년</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">구독 변경</Button>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                    구독 취소
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>결제 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">프리미엄 플랜 연간 구독</p>
                      <p className="text-sm text-muted-foreground">2025년 1월 15일</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩120,000</p>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        영수증
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">프리미엄 플랜 월간 구독</p>
                      <p className="text-sm text-muted-foreground">2024년 12월 15일</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩12,000</p>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        영수증
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>연결된 기기</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">데스크톱 (macOS)</p>
                        <p className="text-xs text-muted-foreground">최근 활동: 지금</p>
                      </div>
                    </div>
                    <Badge>현재 기기</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">iPhone 15</p>
                        <p className="text-xs text-muted-foreground">최근 활동: 3시간 전</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      연결 해제
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">태블릿 (iPadOS)</p>
                        <p className="text-xs text-muted-foreground">최근 활동: 2일 전</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      연결 해제
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>고급 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">데이터 내보내기</h3>
                    <p className="text-sm text-muted-foreground">모든 데이터를 JSON 형식으로 내보냅니다.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    내보내기
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">계정 연결</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    다른 서비스와 Loop 계정을 연결하세요.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🟦</span>
                        <span>Google</span>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🟥</span>
                        <span>Microsoft</span>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">⬛</span>
                        <span>Apple</span>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
