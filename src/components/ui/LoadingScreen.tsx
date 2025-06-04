import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "클라우드 연결 중...",
    "문서 정보 로딩 중...",
    "차트 데이터 준비 중...",
    "대시보드 초기화 중..."
  ];

  useEffect(() => {
    const duration = 2000; // 2초
    const stepDuration = duration / steps.length;
    const progressInterval = 50; // 50ms마다 업데이트
    const progressIncrement = 100 / (duration / progressInterval);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + progressIncrement, 100);
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length) {
          clearInterval(stepTimer);
          return prev;
        }
        return nextStep;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
          {/* 로고 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Loop Cloud</h1>
            <p className="text-muted-foreground">클라우드 대시보드 로딩 중</p>
          </div>

          {/* 프로그레스 바 */}
          <div className="mb-6">
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% 완료
            </p>
          </div>

          {/* 현재 단계 */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">{steps[currentStep]}</span>
            </div>
          </div>

          {/* 단계 인디케이터 */}
          <div className="flex justify-center space-x-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
