import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function DashboardSidebar({
  activeModule,
  setActiveModule,
  mobileOpen,
  setMobileOpen,
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
    const isActive = activeModule === module.id;
    return (
      <li key={module.id}>
        <button
          onClick={() => goTo(module.id)}
          className={`group relative w-full flex items-baseline gap-3 pl-5 pr-3 py-2.5 text-left transition-colors cursor-pointer ${
            isActive ? 'text-white' : 'text-white/55 hover:text-white'
          }`}
        >
          <span
            className={`absolute left-0 top-1/2 h-5 -translate-y-1/2 w-[3px] rounded-r transition-colors ${
              isActive ? 'bg-[#c86d51]' : 'bg-transparent group-hover:bg-white/25'
            }`}
          />
          <span className="w-5 text-[11px] font-mono text-white/35">{module.number}</span>
          <span className="min-w-0 text-[14px] leading-tight truncate transition-transform duration-300 group-hover:translate-x-1">{module.title}</span>
        </button>
      </li>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 lg:w-64 bg-[#0b1015] text-white border-r border-white/10 transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Marca */}
        <button
          onClick={() => { setViewMode('index'); setMobileOpen(false); }}
          className="px-5 pt-6 pb-5 text-left border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
          title="Volver a la portada"
        >
          <span className="block text-xl font-semibold tracking-tight leading-none">Tierra Bomba</span>
          <span className="block mt-1.5 text-xs text-white/50">Hábitat resiliente · Tesis 2026</span>
        </button>

        <nav className="flex-1 overflow-y-auto py-4">
          <p className="px-5 pb-2 text-[11px] text-white/35">Recorrido</p>
          <ul>{communityModules.map(renderItem)}</ul>

          <div className="mt-5 border-t border-white/10 pt-3">
            <button
              onClick={() => setShowTechnical((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-2 text-[11px] text-white/35 hover:text-white/70 transition-colors cursor-pointer"
            >
              <span>Versión técnica</span>
              {showTechnical ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {showTechnical && <ul className="mt-1">{technicalModules.map(renderItem)}</ul>}
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-xs text-white/40 leading-snug">
          {projectInfo.author}
        </div>
      </aside>
    </>
  );
}

