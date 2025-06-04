import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 실제 구현에서는 API 호출을 통해 로그인 처리
      // 여기서는 간단히 로컬 스토리지에 토큰을 저장하는 방식으로 구현
      localStorage.setItem('authToken', 'dummy-auth-token');
      localStorage.setItem('user', JSON.stringify({ name: '사용자', email }));
      
      // 로그인 후 클라우드 대시보드로 리다이렉트
      navigate('/cloud');
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Loop</h1>
          <p className="text-muted-foreground mt-2">계정에 로그인하세요</p>
        </div>
        
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">로그인</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="이메일 주소 입력"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md bg-background pr-10 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="비밀번호 입력"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    로그인 상태 유지
                  </label>
                </div>
                
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  비밀번호 찾기
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">또는</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <span className="text-lg mr-2">🟦</span>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <span className="text-lg mr-2">⬛</span>
                  Apple
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
