import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Printer, 
  MapPin, 
  ShieldCheck, 
  Droplet, 
  Compass,
  FileText
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function Hero({ onExplore3D, onExploreBlueprints, onExploreDiagnosis }) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-cad-grid">
      {/* Ambient gradient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-caribbean-400/15 to-clay-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-caribbean-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Thesis Narrative & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Context Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-caribbean-50 dark:bg-caribbean-950/70 border border-caribbean-200 dark:border-caribbean-800 text-caribbean-700 dark:text-caribbean-300 text-xs font-semibold shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-caribbean-500 animate-pulse" />
              <span>{projectInfo.location}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-architectural-950 dark:text-white leading-[1.1]">
              Reubicación & <br />
              <span className="bg-gradient-to-r from-caribbean-600 via-caribbean-500 to-clay-500 bg-clip-text text-transparent">
                Resiliencia Hídrica
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-architectural-600 dark:text-architectural-300 leading-relaxed max-w-2xl font-normal">
              Propuesta arquitectónica y territorial para la <strong className="text-architectural-900 dark:text-white font-semibold">reubicación de equipamiento comunitario</strong> autosuficiente en <span className="underline decoration-caribbean-400 underline-offset-4">Tierrabomba</span>, mitigando la erosión costera y garantizando el acceso colectivo al agua potable.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore3D}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-caribbean-600 to-caribbean-500 hover:from-caribbean-500 hover:to-caribbean-600 text-white font-semibold text-sm shadow-xl shadow-caribbean-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layers className="w-4 h-4" />
                <span>Explorar Modelo 3D (Revit)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExploreBlueprints}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-architectural-900 border border-architectural-300 dark:border-architectural-700 hover:border-caribbean-400 dark:hover:border-caribbean-500 text-architectural-800 dark:text-architectural-200 font-semibold text-sm shadow-sm transition-all hover:scale-[1.02]"
              >
                <Printer className="w-4 h-4 text-caribbean-500" />
                <span>Ver Planos / Plotter</span>
              </button>

              <button
                onClick={onExploreDiagnosis}
                className="inline-flex items-center space-x-1.5 px-4 py-3.5 rounded-2xl text-architectural-600 dark:text-architectural-400 hover:text-caribbean-600 dark:hover:text-caribbean-400 text-sm font-medium transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Diagnóstico</span>
              </button>
            </div>

            {/* Authors metadata snippet */}
            <div className="pt-4 border-t border-architectural-200 dark:border-architectural-800 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-architectural-500 dark:text-architectural-400">
              <div>
                <span className="font-semibold text-architectural-700 dark:text-architectural-300">Tesista:</span> {projectInfo.author}
              </div>
              <div className="h-3 w-px bg-architectural-300 dark:bg-architectural-700 hidden sm:block" />
              <div>
                <span className="font-semibold text-architectural-700 dark:text-architectural-300">Entrega de Grado:</span> {projectInfo.year}
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Hero Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-caribbean-400/40 via-architectural-200/50 to-transparent dark:from-caribbean-500/30 dark:via-architectural-800/40 shadow-2xl">
              <div className="bg-white/95 dark:bg-architectural-900/95 backdrop-blur-xl rounded-[22px] p-6 space-y-6 border border-white/50 dark:border-architectural-800">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-xs font-mono text-architectural-400 ml-2">tierrabomba-masterplan.rvt</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-caribbean-50 dark:bg-caribbean-950 text-caribbean-600 dark:text-caribbean-400 border border-caribbean-200 dark:border-caribbean-800">
                    BIM Level 200/300
                  </span>
                </div>

                {/* Isometric / Graphic Architectural Teaser */}
                <div className="relative h-56 rounded-2xl bg-gradient-to-br from-architectural-900 to-architectural-950 p-4 overflow-hidden flex flex-col justify-between text-white border border-architectural-800">
                  <div className="absolute inset-0 opacity-20 blueprint-mode pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-caribbean-300 font-mono">Implantación Segura</p>
                      <h4 className="font-display font-bold text-lg text-white">Nodo Cívico & Aljibe Central</h4>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-caribbean-500/20 text-caribbean-300 border border-caribbean-400/30 font-mono">
                      +22.00m
                    </span>
                  </div>

                  {/* Architectural Graphic Wireframe */}
                  <div className="relative z-10 my-auto py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-[260px] h-20 border-2 border-caribbean-400/40 rounded-xl relative flex items-center justify-center bg-caribbean-950/40 backdrop-blur-sm shadow-inner">
                        {/* Bioclimatic roof slope representation */}
                        <div className="absolute -top-3 w-full h-3 border-t-2 border-r-2 border-caribbean-300 transform -skew-x-12" />
                        <div className="text-center space-y-0.5">
                          <p className="text-xs font-mono font-semibold text-caribbean-200">1.850 m² CUBIERTA CAPTADORA</p>
                          <p className="text-[10px] text-architectural-400">Canales pluviales & Aljibe 450 m³</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-architectural-400 font-mono">
                    <span>Vientos: Alisios NNE</span>
                    <span className="text-caribbean-400">Protección Erosión: 100%</span>
                  </div>
                </div>

                {/* Micro Key Features */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-architectural-50 dark:bg-architectural-950/60 border border-architectural-200 dark:border-architectural-800">
                    <div className="flex items-center space-x-2 text-caribbean-600 dark:text-caribbean-400 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-bold text-architectural-900 dark:text-white">Cota Segura</span>
                    </div>
                    <p className="text-[11px] text-architectural-500 dark:text-architectural-400">
                      Reubicado fuera del borde costero vulnerable.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-architectural-50 dark:bg-architectural-950/60 border border-architectural-200 dark:border-architectural-800">
                    <div className="flex items-center space-x-2 text-caribbean-600 dark:text-caribbean-400 mb-1">
                      <Droplet className="w-4 h-4" />
                      <span className="text-xs font-bold text-architectural-900 dark:text-white">Agua Colectiva</span>
                    </div>
                    <p className="text-[11px] text-architectural-500 dark:text-architectural-400">
                      Dispensario público y purificación solar.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Impact Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {projectInfo.metrics.map((metric, index) => (
            <div 
              key={index}
              className="p-5 rounded-2xl bg-white/80 dark:bg-architectural-900/80 backdrop-blur-md border border-architectural-200 dark:border-architectural-800 shadow-sm hover:border-caribbean-300 dark:hover:border-caribbean-700 transition-all hover:shadow-md"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-caribbean-600 dark:text-caribbean-400">
                {metric.value}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-architectural-900 dark:text-white mt-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-architectural-500 dark:text-architectural-400 mt-1 leading-tight">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
