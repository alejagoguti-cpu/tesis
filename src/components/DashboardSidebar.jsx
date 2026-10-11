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
  Layers,
  ChevronRight
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const iconMap = {
  LayoutDashboard,
  Compass,
  BookOpen: Compass,
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
  mobileOpen,
  setMobileOpen
}) {
  const [hoveredModule, setHoveredModule] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0 });

  const handleMouseEnter = (module, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ top: rect.top + rect.height / 2 });
    setHoveredModule(module);
  };

  const handleMouseLeave = () => {
    setHoveredModule(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Ultra-Clean Icon-Only Sidebar Rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col items-center justify-between w-16 bg-white text-slate-800 border-r border-slate-200 shadow-sm transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo / Brand Icon */}
        <div className="pt-3.5 pb-2 flex flex-col items-center">
          <button
            onClick={() => setActiveModule('overview')}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ top: rect.top + rect.height / 2 });
              setHoveredModule({
                number: "01",
                title: "Tierrabomba Resiliente",
                desc: "Tesis de Grado en Arquitectura 2026 // Alejandra Gómez & Ana Casas",
                badge: "Masterplan +22m"
              });
            }}
            onMouseLeave={handleMouseLeave}
            className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-terracotta-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
            title="Tierrabomba Resiliente 2026"
          >
            <Building2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Modules Icons Strip */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-2 w-full px-2">
          {projectInfo.dashboardModules.map((module) => {
            const Icon = iconMap[module.icon] || LayoutDashboard;
            const isActive = activeModule === module.id;

            return (
              <div key={module.id} className="relative flex items-center justify-center w-full">
                
                {/* Module Button */}
                <button
                  onClick={() => {
                    setActiveModule(module.id);
                    setMobileOpen(false);
                  }}
                  onMouseEnter={(e) => handleMouseEnter(module, e)}
                  onMouseLeave={handleMouseLeave}
                  title={`MOD ${module.number}: ${module.title}`}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                    isActive
                      ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/30 scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200/90 hover:scale-105 hover:border-terracotta-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  {/* Tiny module number on bottom corner */}
                  <span className={`absolute -bottom-1 -right-1 text-[9px] font-mono font-black px-1 rounded-md shadow-xs ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {module.number}
                  </span>
                </button>

              </div>
            );
          })}
        </div>

        {/* Bottom Telemetry Mini Indicator */}
        <div className="pb-3.5 pt-2 flex flex-col items-center">
          <div 
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ top: rect.top + rect.height / 2 });
              setHoveredModule({
                number: "SIG",
                title: "MIDAS Cartagena // Telemetría",
                desc: "Datos oficiales IDE Cartagena, DIMAR y POT 2026 en tiempo real",
                badge: "Geoportal MIDAS"
              });
            }}
            onMouseLeave={handleMouseLeave}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-slate-200"
            title="MIDAS Cartagena // Telemetría"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 100% UNCLIPPED FIXED FLOATING HOVER FLYOUT TOOLTIP                        */}
      {/* ========================================================================= */}
      {hoveredModule && (
        <div
          style={{ top: `${tooltipPos.top}px` }}
          className="fixed left-20 -translate-y-1/2 z-[99999] pointer-events-none transition-all duration-150 animate-fade-in"
        >
          <div className="glass-dark text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 max-w-xs whitespace-normal flex flex-col space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-terracotta-500 text-white text-[10px] font-mono font-bold shadow-xs">
                MOD {hoveredModule.number}
              </span>
              <h4 className="font-bold text-xs text-white">
                {hoveredModule.title}
              </h4>
            </div>

            <p className="text-[11px] text-slate-200 leading-snug font-sans">
              {hoveredModule.desc}
            </p>

            {hoveredModule.badge && (
              <span className="text-[10px] font-mono text-teal-300 font-semibold pt-0.5">
                &bull; {hoveredModule.badge}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
