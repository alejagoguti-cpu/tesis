import React, { useState, useEffect, Component } from 'react';
import { flushSync } from 'react-dom';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';
import ThesisFramework from './components/ThesisFramework';
import DiagnosisMap from './components/DiagnosisMap';
import ModelViewer3D from './components/ModelViewer3D';
import RevitModule from './components/RevitModule';
import Module11Territory from './components/Module11Territory';
import RedColaborativa from './components/RedColaborativa';
import RedRizoma from './components/RedRizoma';
import RedTerritorio from './components/RedTerritorio';
import IntroLandingIndex from './components/IntroLandingIndex';
import ProjectOverview from './components/ProjectOverview';
import ThesisHome from './components/ThesisHome';
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
        <div className="p-8 my-6 max-w-4xl mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 font-sans">
          <p className="font-bold text-amber-700 dark:text-amber-400 text-sm">
            Módulo en optimización: {this.props.name || 'Sección'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-amber-200 font-mono">
            {this.state.error?.message || 'Cargando datos del módulo...'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            ↻ Reintentar Cargar Módulo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModuleRaw] = useState('resumen');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [viewMode, setViewModeRaw] = useState(() => (window.location.hash === '#/comunidad' ? 'index' : 'tesis')); // 'tesis' | 'index' (comunidad) | 'dashboard' | 'monograph'

  // Sincroniza la URL: #/comunidad para la versión del territorio; sin hash = tesis
  useEffect(() => {
    const want = viewMode === 'tesis' ? '' : '#/comunidad';
    if (window.location.hash !== want) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + want);
    }
    window.scrollTo(0, 0);
  }, [viewMode]);

  useEffect(() => {
    const onHash = () => setViewMode((v) => (window.location.hash === '#/comunidad' ? (v === 'tesis' ? 'index' : v) : 'tesis'));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);


  // Cambios de vista con View Transitions (mejora progresiva; sin soporte o con movimiento reducido, cambia directo)
  const withTransition = (update) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
      update();
      return;
    }
    const t = document.startViewTransition(() => flushSync(update));
    // Accesibilidad: llevar el foco al encabezado de la vista nueva
    t.finished.finally(() => {
      const h = document.querySelector('h1, h2');
      if (h) {
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    });
  };
  const setViewMode = (v) => (typeof v === 'function' ? setViewModeRaw(v) : withTransition(() => setViewModeRaw(v)));
  const setActiveModule = (v) => withTransition(() => setActiveModuleRaw(v));
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

  // PÁGINA PRINCIPAL: PRESENTACIÓN DE LA TESIS
  if (viewMode === 'tesis') {
    return <ThesisHome onGoCommunity={() => setViewMode('index')} />;
  }

  // TRUE INDEX LANDING PAGE VIEW (FULL-SCREEN, NO SIDEBAR, CLEAN WHITE EDITORIAL)
  if (viewMode === 'index') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <IntroLandingIndex
          onBackToThesis={() => setViewMode('tesis')}
          onNavigateModule={(modId) => {
            setActiveModule(modId);
            setViewMode('dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans transition-colors duration-300 flex flex-col">
      
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
        className={`flex-1 flex flex-col h-screen max-h-screen min-h-0 overflow-hidden transition-all duration-300 ${
          presentationMode ? 'pl-0' : 'lg:pl-64'
        }`}
      >
        {/* Dynamic Viewport Container */}
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

        <main className="flex-1 min-h-0 w-full p-0 overflow-hidden relative">
          
          {/* 1. DASHBOARD MODULAR VIEW (Active module focused view) */}
          {viewMode === 'dashboard' && (
            <div key={activeModule} className="absolute inset-0 overflow-hidden">
              
              {activeModule === 'resumen' && (
                <SafeSection name="Resumen del proyecto">
                  <ProjectOverview onNavigateModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 01: Marco Académico */}
              {activeModule === 'framework' && (
                <SafeSection name="Módulo 01: Marco de Tesis">
                  <ThesisFramework onSelectModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 1.1: Diagnóstico Territorial & Planos Históricos */}
              {activeModule === 'module11' && (
                <SafeSection name="Módulo 1.1: Planos Históricos & Evidencias">
                  <Module11Territory onNavigateModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {activeModule === 'red' && (
                <SafeSection name="Módulo 1.3: Red Diseño Colaborativo">
                  <RedColaborativa />
                </SafeSection>
              )}

              {activeModule === 'territorio' && (
                <SafeSection name="Módulo 1.5: Tierra Bomba, territorio habitado">
                  <RedTerritorio />
                </SafeSection>
              )}

              {activeModule === 'rizoma' && (
                <SafeSection name="Módulo 1.4: Master Plan Rizoma">
                  <RedRizoma />
                </SafeSection>
              )}

              {/* Módulo 1.2: Teledetección & GIS Espectral */}
              {activeModule === 'gis' && (
                <SafeSection name="Módulo 1.2: GIS & Teledetección">
                  <DiagnosisMap onNavigateModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 02: Visor 3D WebGL / BIM */}
              {activeModule === '3dviewer' && (
                <SafeSection name="Módulo 02: Visor 3D BIM">
                  <ModelViewer3D onSelectModule={(modId) => setActiveModule(modId)} />
                </SafeSection>
              )}

              {/* Módulo 03: Modelo Revit Tierrabomba */}
              {activeModule === 'revit' && (
                <SafeSection name="Módulo 03: Modelo Revit">
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






