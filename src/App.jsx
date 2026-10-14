import React, { useState, useEffect, Component } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';
import ExecutiveControlCenter from './components/ExecutiveControlCenter';
import ThesisFramework from './components/ThesisFramework';
import DiagnosisMap from './components/DiagnosisMap';
import ModelViewer3D from './components/ModelViewer3D';
import RevitModule from './components/RevitModule';
import Module11Territory from './components/Module11Territory';
import IntroLandingIndex from './components/IntroLandingIndex';
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
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('intro');
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
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans transition-colors duration-300 flex flex-col">
      
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

      {/* Main Content Area (100% Full-Screen Dashboard) */}
      <div 
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          presentationMode ? 'pl-0' : 'lg:pl-16'
        }`}
      >
        {/* Dynamic Viewport Container (Show header on inner modules) */}
        {activeModule !== 'intro' && (
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
        )}

        <main className="flex-1 w-full h-full p-0 overflow-hidden relative">
          
          {/* 1. DASHBOARD MODULAR VIEW (Active module focused view) */}
          {viewMode === 'dashboard' && (
            <div className={`w-full h-full relative transition-all duration-300 ${
              activeModule === 'intro' ? 'overflow-y-auto' : 'overflow-hidden'
            }`}>
              
              {/* Module 00: Portada Introductoria Animada (Estilo Modelamiento2) */}
              {activeModule === 'intro' && (
                <SafeSection name="Portada Introductoria">
                  <IntroLandingIndex 
                    onNavigateModule={(modId) => setActiveModule(modId)} 
                  />
                </SafeSection>
              )}

              {/* Module 01: Centro de Control & KPIs */}
              {activeModule === 'overview' && (
                <SafeSection name="Centro de Control & KPIs">
                  <ExecutiveControlCenter 
                    onSelectModule={(modId) => setActiveModule(modId)} 
                  />
                </SafeSection>
              )}

              {/* Module 1.1: Pregunta Central */}
              {activeModule === 'module11' && (
                <SafeSection name="Módulo 1.1">
                  <Module11Territory onNavigateModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Module 02: Marco Académico */}
              {activeModule === 'framework' && (
                <SafeSection name="Marco Académico">
                  <ThesisFramework onSelectModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Module 03: GIS & Diagnóstico */}
              {activeModule === 'gis' && (
                <SafeSection name="Diagnóstico Territorial">
                  <DiagnosisMap onNavigateModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 04: Visor 3D WebGL / BIM */}
              {activeModule === '3dviewer' && (
                <SafeSection name="Visor 3D BIM">
                  <ModelViewer3D onSelectModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 05: Modelo Revit Tierrabomba */}
              {activeModule === 'revit' && (
                <SafeSection name="Modelo Revit">
                  <RevitModule />
                </SafeSection>
              )}
            </div>
          )}

          {/* 2. MONOGRAPH / EXPEDIENTE CONTINUO VIEW (Scrollable reading view) */}
          {viewMode === 'monograph' && (
            <div className="space-y-12">
              <SafeSection name="Hero">
                <Hero 
                  onExplore3D={() => { setViewMode('dashboard'); setActiveModule('3dviewer'); }}
                  onExploreGIS={() => { setViewMode('dashboard'); setActiveModule('gis'); }}
                  onExploreDiagnosis={() => scrollToSection('marco-tesis')}
                />
              </SafeSection>

              <SafeSection name="Marco Académico">
                <ThesisFramework />
              </SafeSection>

              <SafeSection name="Diagnóstico Territorial">
                <DiagnosisMap />
              </SafeSection>

              <SafeSection name="Visor 3D BIM">
                <ModelViewer3D />
              </SafeSection>

              <SafeSection name="Modelo Revit">
                <RevitModule />
              </SafeSection>
            </div>
          )}

        </main>

        {/* Global Footer (Only in Monograph / Expediente scrollable mode) */}
        {viewMode === 'monograph' && <Footer />}

      </div>

    </div>
  );
}
