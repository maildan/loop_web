import React, { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
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
  AuthCallbackPage,
  ProjectWorkspace,
  NotFound
} from './components';

// Page Components
const LandingPage = () => (
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

const CloudPage = () => (
  <>
    <CloudNavigation />
    <CloudDashboard />
    <Footer />
  </>
);

const ProfilePage = () => (
  <>
    <CloudNavigation />
    <ProfileSettings />
    <Footer />
  </>
);

const AccountPage = () => (
  <>
    <CloudNavigation />
    <AccountManagement />
    <Footer />
  </>
);

const PrivacyPolicyPage = () => (
  <>
    <Navigation />
    <PrivacyPolicy />
    <Footer />
  </>
);

const TermsOfServicePage = () => (
  <>
    <Navigation />
    <TermsOfService />
    <Footer />
  </>
);

function AppWithLoadingBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const ProjectWorkspaceWrapper = () => {
    const { projectId } = useParams<{ projectId: string }>();
    if (!projectId) {
      return <NotFound />;
    }
    return <ProjectWorkspace projectId={projectId} />;
  };

  const isBackendDisabled = process.env.REACT_APP_BE_DISABLED === 'true';

  return (
    <div className="flex flex-col min-h-screen">
      <RouteLoadingBar isLoading={loading} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {isBackendDisabled ? (
            <>
              {/* 다운로드 전용 모드: 클라우드/프로젝트/계정 관련 라우트 비활성화 */}
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="*" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/cloud" element={<CloudPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/project/:projectId" element={<ProjectWorkspaceWrapper />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    new CloudFlareOptimizer({
      cdnEnabled: process.env.REACT_APP_CDN_ENABLED === 'true',
      staticUrl: process.env.REACT_APP_STATIC_URL,
      apiUrl: process.env.REACT_APP_API_URL,
      debug: process.env.NODE_ENV === 'development'
    });

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppWithLoadingBar />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
