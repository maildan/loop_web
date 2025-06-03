import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Navigation,
  Footer,
  HeroSection,
  AboutSection,
  ServicesSection,
  DownloadSection,
  CloudDashboard
} from './components';

// Main Landing Page Component
function LandingPage() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <DownloadSection />
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cloud" element={<CloudDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
