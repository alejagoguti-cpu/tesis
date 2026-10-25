import React from 'react';
import { Menu, Home } from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function DashboardHeader({
  activeModule,
  setMobileSidebarOpen,
  setViewMode
}) {
  const currentModuleData =
    projectInfo.dashboardModules.find((m) => m.id === activeModule) ||
    projectInfo.dashboardModules[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Menú móvil + título del módulo */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 leading-tight">
              {currentModuleData.badge}
            </p>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
              {currentModuleData.title}
            </h2>
          </div>
        </div>

        {/* Volver al inicio */}
        <button
          onClick={() => setViewMode('index')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 hover:border-terracotta-400 hover:text-terracotta-700 text-xs font-bold transition-all shadow-xs shrink-0"
          title="Volver al inicio"
        >
          <Home className="w-4 h-4" />
          <span>Inicio</span>
        </button>
      </div>
    </header>
  );
}
