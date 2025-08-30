import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CloudFlareOptimizer from './utils/cloudflareOptimizer';
import { RouteLoadingBar } from './components/ui/RouteLoadingBar';
import {
  Navigation,
  Footer,
  HeroSection,
  AboutSection,
  ServicesSection,
  DownloadSection,
  CloudDashboard,
  CloudNavigation,
  ThemeProvider,
  ProfileSettings,
  AccountManagement,
  ScrollToTop,
  LoginPage,
  RegisterPage,
  PrivacyPolicy,
  TermsOfService,
  AuthCallbackPage
} from './components';

// Main Landing Page Component
function LandingPage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}

// Cloud Dashboard Page Component
function CloudPage() {
  return (
    <>
      <CloudNavigation />
      <CloudDashboard />
      <Footer />
    </>
  );
}

// Profile Settings Page Component
function ProfilePage() {
  return (
    <>
      <CloudNavigation />
      <ProfileSettings />
      <Footer />
    </>
  );
}

// Account Management Page Component
// Privacy Policy Page Component
function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}

// Terms of Service Page Component
function TermsOfServicePage() {
  return (
    <>
      <Navigation />
      <main>
        <TermsOfService />
      </main>
      <Footer />
    </>
  );
}

function AccountPage() {
  return (
    <>
      <CloudNavigation />
      <AccountManagement />
      <Footer />
    </>
  );
}

// 라우팅 감지 및 로딩바 관리 컴포넌트
function AppWithLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 클라우드 경로에서 홈으로 이동할 때만 로딩바 표시
    const shouldShowLoading = location.pathname === '/' && 
      sessionStorage.getItem('previousPath')?.startsWith('/cloud');

    if (shouldShowLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.removeItem('previousPath');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    // 현재 경로를 세션 스토리지에 저장
    sessionStorage.setItem('previousPath', location.pathname);
  }, [location]);

  return (
    <>
      <RouteLoadingBar isLoading={isLoading} />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cloud" element={<CloudPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  // CloudFlare 최적화 및 Service Worker 설정
  useEffect(() => {
    // CloudFlare Optimizer 초기화
    const cfOptimizer = new CloudFlareOptimizer({
      cdnEnabled: process.env.REACT_APP_CDN_ENABLED === 'true',
      staticUrl: process.env.REACT_APP_STATIC_URL,
      apiUrl: process.env.REACT_APP_API_URL,
      debug: process.env.NODE_ENV === 'development'
    });

    // Service Worker 등록
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
        })
        .catch((registrationError) => {
        });
    }


    // 컴포넌트 언마운트 시 정리
    return () => {
      cfOptimizer.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AppWithLoadingBar />
      </Router>
    </ThemeProvider>
  );
}

export default App;
