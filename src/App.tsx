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
  CloudNavigation
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cloud" element={<CloudPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
