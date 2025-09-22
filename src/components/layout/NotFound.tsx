import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">페이지를 찾을 수 없습니다.</h2>
      <p className="text-muted-foreground mb-6">요청하신 페이지가 존재하지 않거나, 현재 사용할 수 없습니다.</p>
      <Link to="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
