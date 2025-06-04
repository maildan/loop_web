import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { useTheme } from '../ui/ThemeProvider';
import { Badge } from '../ui/Badge';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Key,
  Camera,
  Save,
  Check,
  Settings
} from 'lucide-react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

function ToggleSwitch({ checked, onChange, id }: ToggleSwitchProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="relative inline-block w-12 h-6">
      <input 
        type="checkbox" 
        className="opacity-0 w-0 h-0" 
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label 
        htmlFor={id} 
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-200 ${
          checked 
            ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-500') 
            : (isDarkMode ? 'bg-gray-600 border-2 border-gray-500' : 'bg-gray-300 border border-gray-400')
        }`}
      >
        <span 
          className={`absolute h-5 w-5 left-0.5 bottom-0.5 rounded-full transition-transform duration-200 shadow-lg ${
            isDarkMode 
              ? (checked ? 'bg-white shadow-white/20' : 'bg-gray-100 border border-gray-400') 
              : 'bg-white'
          } ${checked ? 'transform translate-x-6' : 'transform translate-x-0'}`} 
        />
      </label>
    </div>
  );
}

export function ProfileSettings() {
  const { isDarkMode } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '사용자',
    email: 'user@example.com',
    position: '개발자',
    company: 'Loop Inc.',
    bio: 'Loop를 사용하는 개발자입니다. 타이핑 최적화와 생산성 향상에 관심이 많습니다.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
  };

  return (
    <div className="bg-background pt-6 pb-16 overflow-x-hidden">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              프로필 설정
            </h1>
            <p className="text-muted-foreground mt-2">계정정보 및 환경설정</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2" size="lg">
            <User className="h-3 w-3" />
            Pro 계정
          </Badge>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              프로필
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              알림
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              보안
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              환경설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Card className="text-center">
                  <CardContent className="pt-6 pb-6">
                    <div className="relative inline-block">
                      <Avatar 
                        src="https://randomuser.me/api/portraits/men/21.jpg" 
                        alt="사용자 프로필"
                        size="lg"
                        fallback="사용자"
                      />
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h2 className="text-xl font-semibold">{formData.name}</h2>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      <Badge variant="secondary" className="mt-2" size="lg">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {formData.position}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          저장하기
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          편집하기
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      개인 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium gap-2">
                          <User className="h-4 w-4" />
                          이름
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-lg bg-background transition-colors ${
                            isEditing ? 'border-primary' : 'border-border'
                          } ${!isEditing && 'opacity-70'}`}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium gap-2">
                          <Mail className="h-4 w-4" />
                          이메일
                        </label>
                        <input 
                          type="email" 
                          className="w-full p-3 border rounded-lg bg-background border-border opacity-70"
                          value={formData.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium gap-2">
                          <Briefcase className="h-4 w-4" />
                          직책
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-lg bg-background transition-colors ${
                            isEditing ? 'border-primary' : 'border-border'
                          } ${!isEditing && 'opacity-70'}`}
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium gap-2">
                          <Building className="h-4 w-4" />
                          소속
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-lg bg-background transition-colors ${
                            isEditing ? 'border-primary' : 'border-border'
                          } ${!isEditing && 'opacity-70'}`}
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">자기소개</label>
                      <textarea 
                        className={`w-full p-3 border rounded-lg bg-background h-24 transition-colors ${
                          isEditing ? 'border-primary' : 'border-border'
                        } ${!isEditing && 'opacity-70'}`}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        placeholder="자신에 대해 간단히 소개해주세요..."
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          취소
                        </Button>
                        <Button onClick={handleSave}>
                          <Check className="h-4 w-4 mr-2" />
                          저장하기
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  알림 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        이메일 알림
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        중요 업데이트 및 보안 알림을 이메일로 받습니다
                      </p>
                    </div>
                    <ToggleSwitch 
                      checked={emailNotifications}
                      onChange={setEmailNotifications}
                      id="email-toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        푸시 알림
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        앱 내 실시간 알림을 받습니다
                      </p>
                    </div>
                    <ToggleSwitch 
                      checked={pushNotifications}
                      onChange={setPushNotifications}
                      id="push-toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1 flex-1 pr-4">
                      <h3 className="font-medium">마케팅 이메일</h3>
                      <p className="text-sm text-muted-foreground">
                        제품 업데이트, 팁 및 특별 혜택에 대한 이메일을 받습니다
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <ToggleSwitch 
                        checked={marketingEmails}
                        onChange={setMarketingEmails}
                        id="marketing-toggle"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        비밀번호 변경
                      </h3>
                      <p className="text-sm text-muted-foreground">계정 보안을 위해 정기적으로 비밀번호를 변경하세요</p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      변경하기
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">2단계 인증</h3>
                      <p className="text-sm text-muted-foreground">계정 보안을 강화하기 위해 2단계 인증을 활성화하세요</p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      설정하기
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">로그인 기록</h3>
                      <p className="text-sm text-muted-foreground">최근 로그인 기록을 확인하세요</p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      확인하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  환경 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">다크 모드</h3>
                      <p className="text-sm text-muted-foreground">
                        현재: {isDarkMode ? '다크 모드' : '라이트 모드'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      변경하기
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">언어 설정</h3>
                      <p className="text-sm text-muted-foreground">현재: 한국어</p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      변경하기
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">시간대</h3>
                      <p className="text-sm text-muted-foreground">현재: Seoul (GMT+9)</p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                      변경하기
                    </Button>
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
