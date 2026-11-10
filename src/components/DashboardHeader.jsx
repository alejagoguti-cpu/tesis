import React from 'react';
import { Menu, ArrowLeft, ArrowRight } from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function DashboardHeader({
  activeModule,
  setActiveModule,
  setMobileSidebarOpen,
  setViewMode
}) {
  const community = projectInfo.dashboardModules.filter((m) => m.community);
  const idx = community.findIndex((m) => m.id === activeModule);
  const current =
    projectInfo.dashboardModules.find((m) => m.id === activeModule) ||
    projectInfo.dashboardModules[0];
  const prev = idx > 0 ? community[idx - 1] : null;
  const next = idx >= 0 && idx < community.length - 1 ? community[idx + 1] : null;

  const navBtn =
    'flex items-center gap-2 px-3 h-9 rounded-md border border-slate-300 bg-white text-sm text-slate-800 hover:border-[#c86d51] hover:text-[#c86d51] transition-colors cursor-pointer';

  return (
    <header className="sticky top-0 z-30 bg-[#f4f1ec]/90 backdrop-blur-md border-b border-[#16181d]/15">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-900 cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex items-baseline gap-3">
            <span className="hidden sm:inline text-xs font-mono text-[#16181d]/45">{current.number}</span>
            <h2 className="font-semibold text-[15px] sm:text-base text-[#16181d] truncate">{current.title}</h2>
            <span className="hidden md:inline text-sm text-[#16181d]/50 truncate">{current.desc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {prev && (
            <button onClick={() => setActiveModule(prev.id)} className={navBtn} title={prev.title}>
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
          )}
          {next && (
            <button onClick={() => setActiveModule(next.id)} className={navBtn} title={next.title}>
              <span className="hidden sm:inline">Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setViewMode('index')} className={navBtn} title="Volver a la portada">
            Portada
          </button>
        </div>
      </div>
    </header>
  );
}
