import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThesisFramework from './components/ThesisFramework';
import DiagnosisMap from './components/DiagnosisMap';
import HousingRelocation from './components/HousingRelocation';
import StrategyRelocation from './components/StrategyRelocation';
import ModelViewer3D from './components/ModelViewer3D';
import BlueprintPlotter from './components/BlueprintPlotter';
import WaterSustainability from './components/WaterSustainability';
import Footer from './components/Footer';

// Robust Error Boundary to prevent any blank screen in production
class SafeSection extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Section Error Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 max-w-4xl mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
          <p className="font-bold text-amber-600 dark:text-amber-400 font-mono text-sm">
            Módulo en optimización: {this.props.name || 'Sección'}
          </p>
          <p className="text-xs text-architectural-500 dark:text-architectural-400">
            {this.state.error?.message || 'Cargando datos del módulo...'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <SafeSection name="Hero">
          <Hero 
            onExplore3D={() => scrollToSection('visor3d')}
            onExploreBlueprints={() => scrollToSection('planos')}
            onExploreDiagnosis={() => scrollToSection('marco-tesis')}
          />
        </SafeSection>

        {/* Capítulo 1: Planteamiento, Justificación & Objetivos */}
        <SafeSection name="Marco Académico">
          <ThesisFramework />
        </SafeSection>

        {/* Capítulo 2: Diagnóstico & Cartografía de Riesgo */}
        <SafeSection name="Diagnóstico y Mapa">
          <DiagnosisMap />
        </SafeSection>

        {/* Capítulo 3: Reubicación de Viviendas & Equipamiento Educativo */}
        <SafeSection name="Reubicación y Proyectos">
          <HousingRelocation />
        </SafeSection>

        {/* Capítulo 4: Criterios Bioclimáticos & Masterplan */}
        <SafeSection name="Estrategia Bioclimática">
          <StrategyRelocation />
        </SafeSection>

        {/* Capítulo 5: Visor 3D Interactivo (Revit / BIM) */}
        <SafeSection name="Visor 3D">
          <ModelViewer3D />
        </SafeSection>

        {/* Capítulo 6: Módulo de Planimetría & Plotter Técnico */}
        <SafeSection name="Planimetría y Plotter">
          <BlueprintPlotter />
        </SafeSection>

        {/* Capítulo 7: Memoria Técnica del Sistema Hídrico */}
        <SafeSection name="Sistema Hídrico">
          <WaterSustainability />
        </SafeSection>
      </main>

      <Footer />
    </div>
  );
}
