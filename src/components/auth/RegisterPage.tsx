import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 실제 구현에서는 API 호출을 통해 회원가입 처리
      // 여기서는 간단히 로컬 스토리지에 더미 토큰을 저장하는 방식으로 구현
      localStorage.setItem('authToken', 'dummy-auth-token');
      localStorage.setItem('user', JSON.stringify({ name, email }));
      
      // 회원가입 후 클라우드 대시보드로 리다이렉트
      navigate('/cloud');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError('회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Loop</h1>
          <p className="text-muted-foreground mt-2">새 계정 만들기</p>
        </div>
        
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">회원가입</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="이름 입력"
                />
              </div>
              
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
                    placeholder="비밀번호 입력 (8자 이상)"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  8자 이상, 대문자, 소문자, 숫자를 포함해야 합니다
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md bg-background pr-10 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="비밀번호 확인"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                  <span>서비스 이용약관 및 개인정보 처리방침에 동의합니다</span>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '회원가입'}
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
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
