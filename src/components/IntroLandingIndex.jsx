import React from 'react';
import { ArrowRight, BookOpen, Compass, Box, Map as MapIcon } from 'lucide-react';
import { projectInfo } from '../data/projectData';

const ACCESS = [
  { id: 'framework', icon: BookOpen, code: '01', label: 'Marco de tesis', hint: 'Problema y fundamentos' },
  { id: 'module11', icon: Compass, code: '02', label: 'Historia del territorio', hint: 'Planos y evidencias' },
  { id: 'gis', icon: MapIcon, code: '03', label: 'Diagnóstico y riesgo', hint: 'GIS y teledetección' },
  { id: '3dviewer', icon: Box, code: '04', label: 'Propuesta en 3D', hint: 'Modelo BIM' },
];

export default function IntroLandingIndex({ onNavigateModule }) {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-slate-950 text-white font-sans">
      {/* Imagen satelital de la isla */}
      <img
        src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`}
        alt="Vista satelital de la isla de Tierrabomba, Cartagena"
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        fetchPriority="high"
      />
      {/* Velos para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 sm:px-10 lg:px-16 py-6 sm:py-8">
        {/* Barra superior */}
        <header className="flex items-center justify-between gap-4 text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-white/80">
          <span>Tesis de Grado · Arquitectura y Urbanismo</span>
          <span className="hidden sm:inline">2026</span>
        </header>

        {/* Título */}
        <div className="max-w-3xl">
          <p className="mb-3 sm:mb-4 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-amber-200">
            Bahía de Cartagena · 10°19′N 75°35′O
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            Tierra Bomba
          </h1>
          <p className="mt-3 sm:mt-4 text-xl sm:text-3xl font-light text-white/90">
            Hábitat resiliente
          </p>
          <div className="mt-5 h-px w-24 bg-amber-200/80" />
          <p className="mt-4 text-sm sm:text-base text-white/75">{projectInfo.author}</p>

          <button
            onClick={() => onNavigateModule('framework')}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-100 cursor-pointer"
          >
            Entrar a la plataforma
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Accesos */}
        <nav className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-md border border-white/20 bg-white/20 backdrop-blur-md">
          {ACCESS.map(({ id, icon: Icon, code, label, hint }) => (
            <button
              key={id}
              onClick={() => onNavigateModule(id)}
              className="group flex items-start gap-3 bg-slate-950/55 p-3 sm:p-4 text-left transition hover:bg-slate-950/80 cursor-pointer"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
              <span className="min-w-0">
                <span className="block text-[10px] font-mono text-white/50">{code}</span>
                <span className="block text-sm font-semibold leading-tight">{label}</span>
                <span className="hidden sm:block text-xs text-white/60">{hint}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
