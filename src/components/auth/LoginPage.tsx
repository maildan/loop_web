import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export function LoginPage() {
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
            <div className="mt-6">
                            <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:3500'}/api/auth/google`} className="block w-full no-underline">
                <Button variant="outline" className="w-full">
                  <span className="text-lg mr-2">🟦</span>
                  Google 계정으로 로그인
                </Button>
              </a>
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

