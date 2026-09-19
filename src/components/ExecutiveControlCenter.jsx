import React from 'react';
import {
  Building2,
  ShieldCheck,
  Droplets,
  Home,
  GraduationCap,
  Wind,
  Sun,
  Waves,
  Box,
  Printer,
  Map,
  ArrowRight,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText,
  Activity
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function ExecutiveControlCenter({ onSelectModule }) {
  return (
    <div className="space-y-10 py-6 animate-fade-in">
      
      {/* Executive Header / Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-deepsea-950 via-deepsea-900 to-deepsea-950 text-white border border-deepsea-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-caribbean-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-drafting-grid opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-500/20 text-terracotta-300 text-xs font-mono font-bold border border-terracotta-500/30">
              <span className="w-2 h-2 rounded-full bg-terracotta-400 animate-pulse" />
              <span>TESIS DE GRADO EN ARQUITECTURA &bull; 2026</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-sand-200 text-xs font-mono border border-white/10">
              {projectInfo.coordinates} &bull; Cota +22.00m
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Tierrabomba Resiliente
            </h1>
            <p className="text-sand-300 text-base sm:text-xl font-light leading-relaxed max-w-3xl">
              Plan maestro de relocalización territorial para 120 familias de la franja de erosión crítica marina hacia la meseta segura (+22 m.s.n.m.), con equipamiento educativo bioclimático y soberanía hídrica autónoma de 450.000 L.
            </p>
          </div>

          {/* Community Field Bitácora Quote */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-4">
            <Quote className="w-6 h-6 text-terracotta-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-serif italic text-sand-200 text-sm sm:text-base leading-relaxed">
                "{projectInfo.communityVoice.quote}"
              </p>
              <p className="text-[11px] font-mono text-sand-400">
                — {projectInfo.communityVoice.author} &bull; <span className="opacity-75">{projectInfo.communityVoice.context}</span>
              </p>
            </div>
          </div>

          {/* Quick Module Jump CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectModule('3dviewer')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-semibold shadow-lg shadow-terracotta-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Box className="w-4 h-4" />
              <span>Explorar Visor 3D Interactivo</span>
            </button>

            <button
              onClick={() => onSelectModule('cad')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold border border-white/15 transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>Planimetría Técnica CAD</span>
            </button>

            <button
              onClick={() => onSelectModule('gis')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-caribbean-500/20 hover:bg-caribbean-500/30 text-caribbean-300 text-xs font-mono font-semibold border border-caribbean-500/30 transition-all"
            >
              <Map className="w-4 h-4" />
              <span>Cartografía & Riesgo</span>
            </button>

            <button
              onClick={() => onSelectModule('simulations')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-semibold border border-amber-500/30 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Simuladores Dinámicos (Lab 08)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 6 Executive KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
            <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-sand-100">
              Indicadores Clave del Plan Maestro (KPIs)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-sand-400">
            Parámetros de Diseño Tesis 2026
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* KPI 1: Housing */}
          <div 
            onClick={() => onSelectModule('programs')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-terracotta-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400">
                MÓDULO 03
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Reubicación Habitacional</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              120 Viviendas
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              Tipologías progresivas de 54 a 86 m² con elevación palafítica (+0.60m) en madera y celosías BTC.
            </p>
          </div>

          {/* KPI 2: School */}
          <div 
            onClick={() => onSelectModule('programs')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-caribbean-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400">
                DOTACIONAL
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Equipamiento Educativo</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              350 Estudiantes
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              1.850 m² de aulas pasivas, talleres de pesca y carpintería náutica con ágora cívica central.
            </p>
          </div>

          {/* KPI 3: Water */}
          <div 
            onClick={() => onSelectModule('water')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                MÓDULO 07
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Reserva Hídrica Autónoma</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              450.000 Litros
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              Aljibe central inmune a salinización con filtrado solar UV y 90 días de autonomía de sequía.
            </p>
          </div>

          {/* KPI 4: Erosion Rate */}
          <div 
            onClick={() => onSelectModule('gis')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                TERRITORIO
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Cota Segura de Relocalización</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              +22.00 m.s.n.m.
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              Retiro de la franja costera con pérdida de 1.8 m/año. Cero riesgo de socavación marina.
            </p>
          </div>

          {/* KPI 5: Solar */}
          <div 
            onClick={() => onSelectModule('bioclimatic')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                ENERGÍA
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Matriz Energética Renovable</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              100% Fotovoltaica
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              Radiación de 5.85 kWh/m²/día con acumulación LiFePO4 para bombeo e iluminación comunal.
            </p>
          </div>

          {/* KPI 6: Bioclimatic Comfort */}
          <div 
            onClick={() => onSelectModule('bioclimatic')}
            className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                BIOCLIMÁTICA
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-sand-400">Confort Pasivo Caribeño</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 dark:text-sand-100 mt-1">
              -5 °C Sensación
            </h4>
            <p className="text-xs text-slate-600 dark:text-sand-300 mt-2 font-light leading-relaxed">
              Aleros de 2.5m, ventilación cruzada con alisios N-NE y celosías cerámicas transpirables.
            </p>
          </div>

        </div>
      </div>

      {/* Impact Matrix: Current Situation vs Thesis Proposal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-300/60 dark:border-deepsea-800 pb-4">
          <div>
            <h3 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100">
              Matriz de Impacto Territorial & Comunitario
            </h3>
            <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-mono mt-0.5">
              Diagnóstico de Línea Base vs. Propuesta de Arquitectura & Hábitat Resiliente
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 text-xs font-mono font-bold self-start">
            5 Factores de Transformación
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-sand-300/80 dark:border-deepsea-800 text-deepsea-900/50 dark:text-sand-400">
                <th className="pb-3 pr-4 font-bold uppercase">Factor Analizado</th>
                <th className="pb-3 pr-4 font-bold uppercase text-red-600 dark:text-red-400">Línea Base (Actual)</th>
                <th className="pb-3 pr-4 font-bold uppercase text-emerald-600 dark:text-emerald-400">Propuesta de Tesis</th>
                <th className="pb-3 font-bold uppercase text-terracotta-600 dark:text-terracotta-400">Ganancia de Resiliencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 dark:divide-deepsea-800/60">
              {projectInfo.impactMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-sand-50 dark:hover:bg-deepsea-800/40 transition-colors">
                  <td className="py-4 pr-4 font-bold text-deepsea-950 dark:text-sand-100">
                    {row.factor}
                  </td>
                  <td className="py-4 pr-4 text-deepsea-800/80 dark:text-sand-300 font-sans leading-relaxed">
                    {row.current}
                  </td>
                  <td className="py-4 pr-4 text-deepsea-900 dark:text-sand-100 font-sans font-medium leading-relaxed">
                    {row.proposed}
                  </td>
                  <td className="py-4 font-bold text-terracotta-600 dark:text-terracotta-400">
                    {row.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Territorial Telemetry Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        
        {/* Card 1: Wind Telemetry */}
        <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400 flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-caribbean-500" />
              <span>Vector Eólico</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400 font-bold">
              {projectInfo.telemetry.wind.direction}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100">
              {projectInfo.telemetry.wind.value}
            </h4>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              {projectInfo.telemetry.wind.status}
            </span>
          </div>
          <p className="text-[11px] text-deepsea-700/70 dark:text-sand-400 font-light">
            Orientación del equipamiento a 15° NE para captación de brisa y enfriamiento convectivo.
          </p>
        </div>

        {/* Card 2: Tide & Coastal Erosion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400 flex items-center space-x-1.5">
              <Waves className="w-4 h-4 text-red-500" />
              <span>Erosión Borde</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
              {projectInfo.telemetry.erosionRate.annual}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100">
              {projectInfo.telemetry.tide.value}
            </h4>
            <span className="text-xs text-red-600 dark:text-red-400 font-mono font-semibold">
              {projectInfo.telemetry.tide.erosionRisk}
            </span>
          </div>
          <p className="text-[11px] text-deepsea-700/70 dark:text-sand-400 font-light">
            Relocalización de viviendas fuera de la cota 0.00 hacia la meseta libre de socavación marina.
          </p>
        </div>

        {/* Card 3: Solar Radiation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400 flex items-center space-x-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Radiación Solar</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
              UV {projectInfo.telemetry.solarRadiation.uvIndex}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100">
              {projectInfo.telemetry.solarRadiation.value}
            </h4>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
              {projectInfo.telemetry.solarRadiation.pvYield}
            </span>
          </div>
          <p className="text-[11px] text-deepsea-700/70 dark:text-sand-400 font-light">
            Generación fotovoltaica suficiente para bombeo, desinfección UV e iluminación comunal.
          </p>
        </div>

      </div>

      {/* Academic Credits Footnote inside Control Center */}
      <div className="p-6 rounded-2xl bg-sand-100/60 dark:bg-deepsea-950 border border-sand-300/60 dark:border-deepsea-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-deepsea-800 dark:text-sand-400">
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
          <span><b>Proyecto de Grado:</b> {projectInfo.title} &bull; {projectInfo.year}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span><b>Tesistas:</b></span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 font-bold text-deepsea-950 dark:text-sand-100">
            {projectInfo.author}
          </span>
        </div>
      </div>

    </div>
  );
}
