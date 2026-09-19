import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Home,
  Wind,
  Box,
  Printer,
  Droplets,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  Thermometer,
  Waves,
  Sun,
  Building2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const iconMap = {
  LayoutDashboard,
  BookOpen,
  Map,
  Home,
  Wind,
  Box,
  Printer,
  Droplets,
  Activity
};

export default function DashboardSidebar({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  viewMode,
  setViewMode
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-deepsea-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-deepsea-950 text-sand-100 border-r border-deepsea-800/90 transition-all duration-300 ease-out ${
          collapsed ? 'w-20' : 'w-72'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-deepsea-800/80 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 flex items-center justify-center text-white shadow-lg shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-terracotta-500/20 text-terracotta-400 border border-terracotta-500/30">
                    2026
                  </span>
                  <span className="text-[10px] font-mono text-sand-400 truncate">
                    TESIS ARQ
                  </span>
                </div>
                <h1 className="font-serif font-bold text-sm text-white truncate leading-tight mt-0.5">
                  Tierrabomba Resiliente
                </h1>
                <p className="text-[11px] text-sand-400 truncate font-mono">
                  {projectInfo.author}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-deepsea-800 text-sand-400 hover:text-white transition-colors"
            title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* View Mode Pill Switcher inside Sidebar */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1">
            <div className="p-1 rounded-xl bg-deepsea-900 border border-deepsea-800 flex items-center text-xs font-mono">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  viewMode === 'dashboard'
                    ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                    : 'text-sand-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('monograph')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  viewMode === 'monograph'
                    ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                    : 'text-sand-400 hover:text-white'
                }`}
              >
                Expediente
              </button>
            </div>
          </div>
        )}

        {/* Navigation Modules List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          <div className={`px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-sand-500 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'MOD' : 'MÓDULOS DE TESIS'}
          </div>

          {projectInfo.dashboardModules.map((module) => {
            const Icon = iconMap[module.icon] || LayoutDashboard;
            const isActive = activeModule === module.id;

            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setMobileOpen(false);
                  if (viewMode === 'monograph') {
                    // Scroll to section in monograph view
                    const targetId = module.id === 'overview' ? 'hero' : 
                                     module.id === 'framework' ? 'marco-tesis' :
                                     module.id === 'gis' ? 'diagnostico' :
                                     module.id === 'programs' ? 'proyectos' :
                                     module.id === 'bioclimatic' ? 'estrategia' :
                                     module.id === '3dviewer' ? 'visor3d' :
                                     module.id === 'cad' ? 'planos' :
                                     module.id === 'water' ? 'sostenibilidad' : 'hero';
                    const elem = document.getElementById(targetId);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                title={collapsed ? `${module.number}. ${module.title}` : undefined}
                className={`w-full flex items-center rounded-xl transition-all duration-200 group relative ${
                  collapsed ? 'justify-center p-3' : 'px-3 py-2.5 space-x-3'
                } ${
                  isActive
                    ? 'bg-terracotta-600/90 text-white shadow-md shadow-terracotta-950/40 ring-1 ring-terracotta-400/40'
                    : 'text-sand-300 hover:bg-deepsea-900/80 hover:text-white'
                }`}
              >
                {/* Module Number badge */}
                <span
                  className={`text-[10px] font-mono font-bold shrink-0 px-1.5 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-deepsea-800 text-sand-400 group-hover:text-sand-200'
                  }`}
                >
                  {module.number}
                </span>

                {/* Module Icon */}
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-sand-400 group-hover:text-terracotta-400'
                }`} />

                {/* Module Title & Badge (when expanded) */}
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-medium text-xs truncate">
                        {module.title}
                      </span>
                      {module.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-deepsea-900 text-sand-400'
                        }`}>
                          {module.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-deepsea-900 text-white text-xs font-mono rounded-lg shadow-xl border border-deepsea-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    <p className="font-bold">{module.number}. {module.title}</p>
                    <p className="text-[10px] text-sand-400">{module.desc}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Territorial Telemetry Widget at Bottom */}
        {!collapsed ? (
          <div className="p-3.5 border-t border-deepsea-800/80 bg-deepsea-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sand-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telemetría Insular</span>
              </span>
              <span className="text-[9px] font-mono text-sand-500">
                +22.00m Cota
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-deepsea-950 border border-deepsea-800/80">
                <div className="flex items-center space-x-1 text-sand-400 text-[10px]">
                  <Wind className="w-3 h-3 text-caribbean-400" />
                  <span>Alisios</span>
                </div>
                <p className="font-bold text-white mt-0.5">{projectInfo.telemetry.wind.value}</p>
              </div>

              <div className="p-2 rounded-lg bg-deepsea-950 border border-deepsea-800/80">
                <div className="flex items-center space-x-1 text-sand-400 text-[10px]">
                  <Droplets className="w-3 h-3 text-terracotta-400" />
                  <span>Reserva</span>
                </div>
                <p className="font-bold text-white mt-0.5">450.000 L</p>
              </div>
            </div>

            {/* Quick Author Signature */}
            <div className="pt-2 border-t border-deepsea-800/60 flex items-center justify-between text-[10px] font-mono text-sand-400">
              <span>Tesistas 2026</span>
              <span className="text-sand-200 font-semibold truncate ml-2">A. Gómez & A. Casas</span>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-deepsea-800/80 flex flex-col items-center space-y-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" title="Sistema en Línea" />
            <span className="text-[9px] font-mono text-sand-400">+22m</span>
          </div>
        )}
      </aside>
    </>
  );
}
