import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Map,
  Home,
  Wind,
  Box,
  Printer,
  Droplets,
  Activity,
  Building2,
  Sparkles,
  Network,
  Layers,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const iconMap = {
  LayoutDashboard,
  AlertTriangle,
  Compass,
  BookOpen: Compass,
  Map,
  Home,
  Wind,
  Box,
  Printer,
  Droplets,
  Activity,
  Building2,
  Sparkles,
  Network,
  Layers
};

export default function DashboardSidebar({
  activeModule,
  setActiveModule,
  mobileOpen,
  setMobileOpen,
  viewMode,
  setViewMode
}) {
  const [showTechnical, setShowTechnical] = useState(false);

  const communityModules = projectInfo.dashboardModules.filter((m) => m.community);
  const technicalModules = projectInfo.dashboardModules.filter((m) => !m.community);

  const goTo = (id) => {
    setActiveModule(id);
    setMobileOpen(false);
  };

  const renderItem = (module) => {
    const Icon = iconMap[module.icon] || LayoutDashboard;
    const isActive = activeModule === module.id;
    return (
      <button
        key={module.id}
        onClick={() => goTo(module.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all ${
          isActive
            ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/25'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
        }`}
      >
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-bold leading-tight truncate">{module.title}</span>
          <span className={`block text-[10px] font-mono leading-tight truncate ${isActive ? 'text-white/75' : 'text-slate-500'}`}>
            {module.badge}
          </span>
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 lg:w-60 bg-white text-slate-800 border-r border-slate-200 shadow-sm transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Marca */}
        <button
          onClick={() => { setViewMode('index'); setMobileOpen(false); }}
          className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 text-left hover:bg-slate-50 transition-colors"
          title="Volver al inicio"
        >
          <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-extrabold text-slate-900 leading-tight">Tierra Bomba</span>
            <span className="block text-[10px] font-mono text-slate-500 leading-tight">Hábitat resiliente</span>
          </span>
        </button>

        {/* Módulos comunitarios */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5">
          <p className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Recorre el proyecto
          </p>
          {communityModules.map(renderItem)}

          {/* Sección técnica plegable */}
          <div className="pt-3">
            <button
              onClick={() => setShowTechnical((v) => !v)}
              className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Versión técnica
              </span>
              {showTechnical ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {showTechnical && (
              <div className="mt-1 space-y-1.5">
                {technicalModules.map(renderItem)}
              </div>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="px-4 py-3 border-t border-slate-200">
          <p className="text-[10px] font-mono text-slate-400 leading-snug">
            Tesis de Arquitectura 2026<br />
            {projectInfo.author}
          </p>
        </div>
      </aside>
    </>
  );
}
