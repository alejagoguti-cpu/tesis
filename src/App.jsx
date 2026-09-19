import React, { useState, useEffect, Component } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';
import ExecutiveControlCenter from './components/ExecutiveControlCenter';
import ThesisFramework from './components/ThesisFramework';
import DiagnosisMap from './components/DiagnosisMap';
import HousingRelocation from './components/HousingRelocation';
import StrategyRelocation from './components/StrategyRelocation';
import ModelViewer3D from './components/ModelViewer3D';
import BlueprintPlotter from './components/BlueprintPlotter';
import WaterSustainability from './components/WaterSustainability';
import Hero from './components/Hero';
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
        <div className="p-8 my-6 max-w-4xl mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 font-mono">
          <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">
            Módulo en optimización: {this.props.name || 'Sección'}
          </p>
          <p className="text-xs text-sand-500">
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
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'monograph'

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-deepsea-950 text-deepsea-950 dark:text-sand-100 font-sans transition-colors duration-300 flex flex-col">
      
      {/* Sidebar Navigation */}
      {!presentationMode && (
        <DashboardSidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          presentationMode ? 'pl-0' : sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        
        {/* Dashboard Top Navigation Header */}
        <DashboardHeader
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          sidebarCollapsed={sidebarCollapsed}
          setMobileSidebarOpen={setMobileSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          presentationMode={presentationMode}
          setPresentationMode={setPresentationMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* 1. DASHBOARD MODULAR VIEW (Active module focused view) */}
          {viewMode === 'dashboard' && (
            <div className="transition-all duration-300">
              
              {/* Module 00: Centro de Control & KPIs */}
              {activeModule === 'overview' && (
                <SafeSection name="Centro de Control & KPIs">
                  <ExecutiveControlCenter 
                    onSelectModule={(modId) => setActiveModule(modId)} 
                  />
                </SafeSection>
              )}

              {/* Module 01: Marco Académico */}
              {activeModule === 'framework' && (
                <SafeSection name="Marco Académico">
                  <ThesisFramework />
                </SafeSection>
              )}

              {/* Module 02: GIS & Diagnóstico */}
              {activeModule === 'gis' && (
                <SafeSection name="Diagnóstico Territorial">
                  <DiagnosisMap />
                </SafeSection>
              )}

              {/* Module 03: Viviendas & Equipamiento */}
              {activeModule === 'programs' && (
                <SafeSection name="Programa Arquitectónico">
                  <HousingRelocation />
                </SafeSection>
              )}

              {/* Module 04: Estrategia Bioclimática */}
              {activeModule === 'bioclimatic' && (
                <SafeSection name="Estrategia Bioclimática">
                  <StrategyRelocation />
                </SafeSection>
              )}

              {/* Module 05: Visor 3D WebGL / BIM */}
              {activeModule === '3dviewer' && (
                <SafeSection name="Visor 3D BIM">
                  <ModelViewer3D />
                </SafeSection>
              )}

              {/* Module 06: Planimetría CAD & Plotter */}
              {activeModule === 'cad' && (
                <SafeSection name="Planimetría Técnica CAD">
                  <BlueprintPlotter />
                </SafeSection>
              )}

              {/* Module 07: Soberanía Hídrica */}
              {activeModule === 'water' && (
                <SafeSection name="Soberanía Hídrica">
                  <WaterSustainability />
                </SafeSection>
              )}

            </div>
          )}

          {/* 2. MONOGRAPH / EXPEDIENTE CONTINUO VIEW (Scrollable reading view) */}
          {viewMode === 'monograph' && (
            <div className="space-y-12">
              <SafeSection name="Hero">
                <Hero 
                  onExplore3D={() => scrollToSection('visor3d')}
                  onExploreBlueprints={() => scrollToSection('planos')}
                  onExploreDiagnosis={() => scrollToSection('marco-tesis')}
                />
              </SafeSection>

              <SafeSection name="Marco Académico">
                <ThesisFramework />
              </SafeSection>

              <SafeSection name="Diagnóstico Territorial">
                <DiagnosisMap />
              </SafeSection>

              <SafeSection name="Programa Arquitectónico">
                <HousingRelocation />
              </SafeSection>

              <SafeSection name="Estrategia Bioclimática">
                <StrategyRelocation />
              </SafeSection>

              <SafeSection name="Visor 3D BIM">
                <ModelViewer3D />
              </SafeSection>

              <SafeSection name="Planimetría Técnica CAD">
                <BlueprintPlotter />
              </SafeSection>

              <SafeSection name="Soberanía Hídrica">
                <WaterSustainability />
              </SafeSection>
            </div>
          )}

        </main>

        {/* Global Footer */}
        <Footer />

      </div>

    </div>
  );
}
