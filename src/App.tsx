import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  AccountManagement
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
function AccountPage() {
  return (
    <>
      <CloudNavigation />
      <AccountManagement />
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cloud" element={<CloudPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
