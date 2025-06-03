import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { useTheme } from '../ui/ThemeProvider';

export function ProfileSettings() {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">프로필 설정</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>내 프로필</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar 
                  src="https://randomuser.me/api/portraits/men/21.jpg" 
                  alt="사용자 프로필"
                  size="lg"
                  fallback="사용자"
                />
                <div className="text-center">
                  <h2 className="text-xl font-medium">사용자님</h2>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  프로필 사진 변경
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>개인 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">이름</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue="사용자" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue="user@example.com" 
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">직책</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue="개발자" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">소속</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue="Loop Inc." 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">자기소개</label>
                  <textarea 
                    className="w-full p-2 border rounded-md bg-background h-24"
                    defaultValue="Loop를 사용하는 개발자입니다." 
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">이메일 알림</h3>
                    <p className="text-sm text-muted-foreground">중요 업데이트 및 알림을 이메일로 받습니다.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      className="opacity-0 w-0 h-0" 
                      id="email-toggle" 
                      defaultChecked 
                    />
                    <label 
                      htmlFor="email-toggle" 
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${isDarkMode ? 'bg-secondary' : 'bg-muted'}`}
                    >
                      <span className={`absolute h-5 w-5 left-0.5 bottom-0.5 rounded-full transition-transform bg-white transform translate-x-0 ${isDarkMode ? 'bg-background' : 'bg-white'}`} />
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">푸시 알림</h3>
                    <p className="text-sm text-muted-foreground">앱 내 실시간 알림을 받습니다.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input 
                      type="checkbox" 
                      className="opacity-0 w-0 h-0" 
                      id="push-toggle" 
                      defaultChecked 
                    />
                    <label 
                      htmlFor="push-toggle" 
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${isDarkMode ? 'bg-secondary' : 'bg-muted'}`}
                    >
                      <span className={`absolute h-5 w-5 left-0.5 bottom-0.5 rounded-full transition-transform bg-white transform translate-x-0 ${isDarkMode ? 'bg-background' : 'bg-white'}`} />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
