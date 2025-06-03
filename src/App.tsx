import React from 'react';
import {
  Navigation,
  Footer,
  HeroSection,
  AboutSection,
  ServicesSection,
  PortfolioSection,
  ContactSection
} from './components';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
