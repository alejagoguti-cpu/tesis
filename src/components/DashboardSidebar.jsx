import React from 'react';
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
  Layers
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
        <div className="pt-4 pb-2 flex flex-col items-center">
          <button
            onClick={() => setActiveModule('overview')}
            className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-terracotta-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 group relative"
            title="Tierrabomba Resiliente 2026"
          >
            <Building2 className="w-5 h-5" />
            
            {/* Flyout Hover Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-[100] text-left">
              <p className="font-serif font-bold text-xs">Tierrabomba Resiliente</p>
              <p className="text-[10px] font-mono text-terracotta-400">Tesis de Arquitectura &bull; 2026</p>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5">Alejandra Gómez & Ana Casas</p>
            </div>
          </button>
        </div>

        {/* Navigation Modules Icons Strip */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-2.5 py-4 w-full px-2 overflow-y-auto scrollbar-none">
          {projectInfo.dashboardModules.map((module) => {
            const Icon = iconMap[module.icon] || LayoutDashboard;
            const isActive = activeModule === module.id;

            return (
              <div key={module.id} className="relative group flex items-center justify-center w-full">
                
                {/* Active Indicator Bar on left edge */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-terracotta-600 rounded-r-full" />
                )}

                {/* Module Button */}
                <button
                  onClick={() => {
                    setActiveModule(module.id);
                    setMobileOpen(false);
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                    isActive
                      ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/30 scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200/80 hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  {/* Tiny module number on bottom corner */}
                  <span className={`absolute -bottom-1 -right-1 text-[9px] font-mono font-black px-1 rounded-md shadow-xs ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {module.number}
                  </span>
                </button>

                {/* Rich Hover Flyout Tooltip to the Right */}
                <div className="absolute left-full ml-3 px-3.5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[100] text-left transform translate-x-1 group-hover:translate-x-0">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-terracotta-500 text-white text-[9px] font-mono font-bold">
                      MOD {module.number}
                    </span>
                    <p className="font-serif font-bold text-xs text-white">
                      {module.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans mt-1">
                    {module.desc}
                  </p>
                  {module.badge && (
                    <span className="inline-block mt-1 text-[9px] font-mono text-teal-400 font-semibold">
                      &bull; {module.badge}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Telemetry Mini Indicator */}
        <div className="pb-4 pt-2 flex flex-col items-center group relative">
          <div className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Telemetry Hover Tooltip */}
          <div className="absolute bottom-2 left-full ml-3 px-3 py-2 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-[100] text-left">
            <p className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SISTEMA TELEMÉTRICO ONLINE</span>
            </p>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">Cota +22.00m &bull; Alisios N-NE 22km/h &bull; 450.000L</p>
          </div>
        </div>

      </aside>
    </>
  );
}
