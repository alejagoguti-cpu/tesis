import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiagnosisMap from './components/DiagnosisMap';
import StrategyRelocation from './components/StrategyRelocation';
import ModelViewer3D from './components/ModelViewer3D';
import BlueprintPlotter from './components/BlueprintPlotter';
import WaterSustainability from './components/WaterSustainability';
import Footer from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-architectural-950 text-architectural-900 dark:text-architectural-100 font-sans transition-colors duration-200">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <main>
        <Hero 
          onExplore3D={() => scrollToSection('visor3d')}
          onExploreBlueprints={() => scrollToSection('planos')}
          onExploreDiagnosis={() => scrollToSection('diagnostico')}
        />

        <DiagnosisMap />

        <StrategyRelocation />

        <ModelViewer3D />

        <BlueprintPlotter />

        <WaterSustainability />
      </main>

      <Footer />
    </div>
  );
}
