import React, { useState, useEffect } from 'react';

interface RouteLoadingBarProps {
  isLoading: boolean;
  duration?: number;
}

export function RouteLoadingBar({ isLoading, duration = 800 }: RouteLoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      
      // 진짜 웹사이트같은 자연스러운 로딩 패턴
      const phases = [
        { target: 20, duration: 100 },
        { target: 45, duration: 200 },
        { target: 70, duration: 300 },
        { target: 85, duration: 200 },
        { target: 100, duration: 100 }
      ];

      let currentProgress = 0;
      let phaseIndex = 0;

      const updateProgress = () => {
        if (phaseIndex >= phases.length) return;

        const phase = phases[phaseIndex];
        const increment = (phase.target - currentProgress) / (phase.duration / 16);

        const timer = setInterval(() => {
          currentProgress += increment;
          
          if (currentProgress >= phase.target) {
            currentProgress = phase.target;
            setProgress(currentProgress);
            clearInterval(timer);
            phaseIndex++;
            if (phaseIndex < phases.length) {
              setTimeout(updateProgress, 50); // 자연스러운 딜레이
            }
          } else {
            setProgress(Math.min(currentProgress, phase.target));
          }
        }, 16);
      };

      updateProgress();
    } else {
      // 로딩 완료 시 100%로 빠르게 채우고 사라지기
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
        }}
      />
      {/* 끝부분에 빛나는 효과 */}
      {progress > 5 && progress < 100 && (
        <div 
          className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"
          style={{
            left: `${Math.max(0, progress - 8)}%`
          }}
        />
      )}
    </div>
  );
}
