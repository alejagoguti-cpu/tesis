import React from 'react';
import {
  Menu,
  Maximize2,
  Minimize2,
  Printer,
  Moon,
  Sun,
  Layers,
  Sparkles,
  Compass,
  MapPin,
  FileSpreadsheet,
  Share2
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function DashboardHeader({
  activeModule,
  setActiveModule,
  sidebarCollapsed,
  setMobileSidebarOpen,
  darkMode,
  setDarkMode,
  presentationMode,
  setPresentationMode,
  viewMode,
  setViewMode
}) {
  const currentModuleData = projectInfo.dashboardModules.find(m => m.id === activeModule) || projectInfo.dashboardModules[0];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setPresentationMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setPresentationMode(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-deepsea-950/90 backdrop-blur-md border-b border-slate-200 dark:border-deepsea-800 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-deepsea-800 text-slate-900 dark:text-sand-100 hover:bg-slate-200 dark:hover:bg-deepsea-700 transition-colors"
            aria-label="Abrir Menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-mono overflow-hidden">
            <span className="text-terracotta-600 dark:text-terracotta-400 font-bold hidden sm:inline">
              TESIS 2026
            </span>
            <span className="text-slate-400 dark:text-sand-400 hidden sm:inline">/</span>
            <div className="flex items-center space-x-1.5 overflow-hidden">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-deepsea-800 text-slate-800 dark:text-sand-300 font-bold text-[10px]">
                MOD {currentModuleData.number}
              </span>
              <h2 className="font-display font-bold text-sm text-slate-900 dark:text-sand-100 truncate">
                {currentModuleData.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Center/Right: Action Buttons & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick View Mode Toggle (Dashboard vs Monograph) */}
          <div className="hidden md:flex p-1 rounded-xl bg-slate-100 dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-white dark:bg-terracotta-600 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-sand-400 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('monograph')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'monograph'
                  ? 'bg-white dark:bg-terracotta-600 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-sand-400 hover:text-slate-900'
              }`}
            >
              Expediente
            </button>
          </div>

          {/* Presentation / Sustentación Mode Button */}
          <button
            onClick={handleToggleFullscreen}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              presentationMode
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40'
                : 'bg-white dark:bg-deepsea-900 text-slate-700 dark:text-sand-300 border-slate-200 dark:border-deepsea-800 hover:border-terracotta-500 shadow-xs'
            }`}
            title="Modo Sustentación / Pantalla Completa para jurados"
          >
            {presentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">
              {presentationMode ? 'Salir Sustentación' : 'Sustentación'}
            </span>
          </button>

          {/* Print Dossier Quick Action */}
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 text-slate-700 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 text-xs font-mono transition-colors shadow-xs"
            title="Imprimir o guardar dossier en PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dossier PDF</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 text-slate-700 dark:text-sand-300 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors shadow-xs"
            title={darkMode ? 'Cambiar a Modo Blanco / Claro' : 'Cambiar a Modo Deep Sea / Oscuro'}
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Tesistas Author Chip */}
          <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-deepsea-800 text-xs font-mono text-slate-700 dark:text-sand-300">
            <div className="w-7 h-7 rounded-lg bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 font-bold text-[10px]">
              TG
            </div>
            <div className="text-left leading-none">
              <p className="font-bold text-slate-900 dark:text-sand-100 text-[11px]">{projectInfo.author}</p>
              <p className="text-[10px] text-slate-500 dark:text-sand-400 mt-0.5">Tesistas Arquitectura</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
