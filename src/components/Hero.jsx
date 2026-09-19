import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Printer, 
  MapPin, 
  ShieldCheck, 
  Droplet, 
  Compass,
  Quote,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function Hero({ onExplore3D, onExploreBlueprints, onExploreDiagnosis }) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-editorial-grid">
      
      {/* Warm atmospheric glows */}
      <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-terracotta-500/10 dark:bg-terracotta-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-caribbean-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-12">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Thesis Editorial Narrative */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Monograph Metadata Header */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-sand-200 dark:bg-deepsea-900 text-terracotta-700 dark:text-terracotta-300 font-bold border border-sand-300 dark:border-deepsea-800 flex items-center space-x-1.5 shadow-subtle">
                <MapPin className="w-3.5 h-3.5 text-terracotta-600 animate-pulse" />
                <span>{projectInfo.coordinates}</span>
              </span>
              <span className="text-sand-600 dark:text-deepsea-300">
                {projectInfo.location}
              </span>
            </div>

            {/* Main Editorial Title */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-[0.2em] text-terracotta-600 dark:text-terracotta-400 font-semibold block">
                Proyecto de Grado &bull; Arquitectura & Urbanismo
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-sand-900 dark:text-sand-50 leading-[1.08]">
                Hábitat Resiliente & <br />
                <span className="text-terracotta-600 dark:text-terracotta-400 italic font-serif">
                  Reubicación Comunitaria
                </span>
              </h1>
            </div>

            {/* Humanized Subtitle */}
            <p className="text-base sm:text-lg text-sand-700 dark:text-sand-300 leading-relaxed max-w-2xl font-normal">
              Estrategia proyectual frente a la erosión costera en <b>Tierrabomba</b>: reubicación de <b>120 viviendas palafíticas</b> y diseño de un <b>equipamiento educativo bioclimático</b> con aljibe central de 450.000 L para soberanía hídrica.
            </p>

            {/* Community Quote / Testimonio de Campo */}
            <div className="p-5 rounded-2xl bg-sand-100/90 dark:bg-deepsea-900/90 border-l-4 border-terracotta-500 border-y border-r border-sand-300 dark:border-deepsea-800 shadow-subtle space-y-2 transition-spring hover:scale-[1.01]">
              <div className="flex items-center space-x-2 text-terracotta-600 dark:text-terracotta-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                <span>Memoria Social del Territorio</span>
              </div>
              <p className="font-serif-quote italic text-sm sm:text-base text-sand-800 dark:text-sand-200 leading-snug">
                "{projectInfo.communityVoice.quote}"
              </p>
              <p className="text-[11px] font-mono text-sand-500 dark:text-deepsea-300">
                &mdash; {projectInfo.communityVoice.author} &bull; {projectInfo.communityVoice.context}
              </p>
            </div>

            {/* Action Buttons with Spring Transitions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExplore3D}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-500 text-white font-semibold text-sm shadow-architectural transition-spring hover:-translate-y-0.5 active:translate-y-0"
              >
                <Layers className="w-4 h-4" />
                <span>Explorar Modelos 3D</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExploreBlueprints}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 hover:border-terracotta-400 text-sand-800 dark:text-sand-200 font-semibold text-sm shadow-subtle transition-spring hover:-translate-y-0.5"
              >
                <Printer className="w-4 h-4 text-terracotta-600" />
                <span>Planimetría / Plotter</span>
              </button>

              <button
                onClick={onExploreDiagnosis}
                className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-2xl text-sand-600 dark:text-deepsea-300 hover:text-terracotta-600 text-sm font-semibold transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Marco de Tesis</span>
              </button>
            </div>

            {/* Academic Author Badge */}
            <div className="pt-4 border-t border-sand-300 dark:border-deepsea-800 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-sand-600 dark:text-deepsea-300 font-mono">
              <div>
                <span className="font-bold text-sand-900 dark:text-sand-100">Tesistas:</span> {projectInfo.author}
              </div>
              <div className="h-3 w-px bg-sand-300 dark:bg-deepsea-800 hidden sm:block" />
              <div>
                <span className="font-bold text-sand-900 dark:text-sand-100">Año:</span> {projectInfo.year}
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Plate Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-terracotta-400/40 via-sand-300/40 to-transparent dark:from-terracotta-600/30 dark:via-deepsea-800/40 shadow-2xl">
              <div className="bg-white/95 dark:bg-deepsea-900/95 backdrop-blur-xl rounded-[22px] p-6 space-y-6 border border-white/60 dark:border-deepsea-800">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-terracotta-500 inline-block" />
                    <span className="text-xs font-mono text-sand-500 dark:text-deepsea-300 font-medium">LÁMINA PROYECTUAL 01</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-sand-100 dark:bg-deepsea-950 text-terracotta-700 dark:text-terracotta-300 border border-sand-200 dark:border-deepsea-800">
                    Meseta +22.00 m.s.n.m.
                  </span>
                </div>

                {/* Conceptual Architectural Diagram Frame */}
                <div className="relative h-60 rounded-2xl bg-[#0c141c] p-5 overflow-hidden flex flex-col justify-between text-white border border-deepsea-800 shadow-inner">
                  <div className="absolute inset-0 opacity-20 blueprint-mode pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-widest text-terracotta-300 font-mono">Implantación Bioclimática</p>
                      <h4 className="font-display font-bold text-base text-white">Nodo Educativo & 120 Viviendas</h4>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-terracotta-500/20 text-terracotta-300 border border-terracotta-400/30 font-mono">
                      Cota Segura
                    </span>
                  </div>

                  {/* Wireframe Diagram Graphic */}
                  <div className="relative z-10 my-auto py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-[280px] h-20 border border-terracotta-400/40 rounded-xl relative flex items-center justify-center bg-deepsea-950/60 backdrop-blur-sm">
                        <div className="absolute -top-3 w-full h-3 border-t-2 border-r-2 border-caribbean-400/70 transform -skew-x-12" />
                        <div className="text-center space-y-0.5 px-3">
                          <p className="text-xs font-mono font-bold text-terracotta-200">1.850 m² CUBIERTA CAPTADORA</p>
                          <p className="text-[10px] text-sand-400">Canales pluviales & Aljibe 450.000 L</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-sand-400 font-mono">
                    <span>Vientos: Alisios N-NE</span>
                    <span className="text-emerald-400">Protección Erosión: 100%</span>
                  </div>
                </div>

                {/* Key Pillars Highlights */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-200 dark:border-deepsea-800 transition-spring hover:border-terracotta-400">
                    <div className="flex items-center space-x-2 text-terracotta-600 dark:text-terracotta-400 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-bold text-sand-900 dark:text-sand-100">120 Viviendas</span>
                    </div>
                    <p className="text-[11px] text-sand-600 dark:text-deepsea-300 leading-tight">
                      Palafíticas (+0.60m) en madera y BTC local.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-200 dark:border-deepsea-800 transition-spring hover:border-terracotta-400">
                    <div className="flex items-center space-x-2 text-caribbean-600 dark:text-caribbean-400 mb-1">
                      <Droplet className="w-4 h-4" />
                      <span className="text-xs font-bold text-sand-900 dark:text-sand-100">Dispensario Hídrico</span>
                    </div>
                    <p className="text-[11px] text-sand-600 dark:text-deepsea-300 leading-tight">
                      12 tomas comunitarias y potabilización solar.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Impact Metrics Bar with Warm Tectonic Styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {projectInfo.metrics.map((metric, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-white/90 dark:bg-deepsea-900/90 backdrop-blur-md border border-sand-200 dark:border-deepsea-800 shadow-subtle hover-lift group"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-terracotta-600 dark:text-terracotta-400 group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </div>
              <div className="font-bold text-xs sm:text-sm text-sand-900 dark:text-sand-100 mt-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-sand-600 dark:text-deepsea-300 mt-1 leading-tight">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
