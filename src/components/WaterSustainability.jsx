import React, { useState } from 'react';
import { 
  Droplets, 
  Filter, 
  ShieldCheck, 
  Sun, 
  Sparkles, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function WaterSustainability() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="sostenibilidad" className="py-24 bg-sand-100/60 dark:bg-deepsea-950/60 relative overflow-hidden border-t border-sand-300/40 dark:border-deepsea-800/60 transition-colors duration-500">
      
      {/* Editorial Watermark */}
      <div className="absolute top-10 right-10 text-[120px] font-serif font-black text-sand-300/20 dark:text-deepsea-800/20 select-none pointer-events-none leading-none">
        06
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-caribbean-500/10 text-caribbean-700 dark:text-caribbean-300 text-xs font-mono font-medium border border-caribbean-500/20">
            <span className="font-bold">CAPÍTULO 06</span>
            <span className="opacity-40">/</span>
            <Droplets className="w-3.5 h-3.5" />
            <span>Infraestructura Hídrica Autosuficiente</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-deepsea-950 dark:text-sand-100 tracking-tight leading-tight">
            {projectInfo.waterSystem.title}
          </h2>
          <p className="text-deepsea-900/70 dark:text-sand-300/70 text-base sm:text-lg font-light leading-relaxed">
            {projectInfo.waterSystem.subtitle}
          </p>
        </div>

        {/* Capacity Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-deepsea-900/90 border border-sand-300/60 dark:border-deepsea-800 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-deepsea-900/50 dark:text-sand-400 font-mono">Capacidad de Reserva</p>
              <h4 className="font-display font-bold text-xl text-deepsea-950 dark:text-sand-100 mt-0.5">450.000 Litros</h4>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 dark:bg-deepsea-900/90 border border-sand-300/60 dark:border-deepsea-800 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-deepsea-900/50 dark:text-sand-400 font-mono">Área de Captación</p>
              <h4 className="font-display font-bold text-xl text-deepsea-950 dark:text-sand-100 mt-0.5">1.850 m² de Cubierta</h4>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/90 dark:bg-deepsea-900/90 border border-sand-300/60 dark:border-deepsea-800 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-deepsea-900/50 dark:text-sand-400 font-mono">Energía del Sistema</p>
              <h4 className="font-display font-bold text-xl text-deepsea-950 dark:text-sand-100 mt-0.5">100% Solar Fotovoltaica</h4>
            </div>
          </div>
        </div>

        {/* Interactive Step-by-Step Water Flow Diagram */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Steps list navigation */}
          <div className="lg:col-span-6 space-y-3">
            {projectInfo.waterSystem.steps.map((item, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(index)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-white dark:bg-deepsea-900 border-terracotta-500 shadow-md ring-1 ring-terracotta-400/30'
                      : 'bg-white/60 dark:bg-deepsea-900/40 border-sand-300/60 dark:border-deepsea-800 hover:border-sand-400 dark:hover:border-deepsea-700'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-terracotta-600 text-white shadow-md' 
                        : 'bg-sand-200 dark:bg-deepsea-800 text-deepsea-700 dark:text-sand-300'
                    }`}>
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-deepsea-950 dark:text-sand-100">
                        {item.name}
                      </h4>
                      <p className="text-xs text-deepsea-800/70 dark:text-sand-300/70 leading-relaxed font-light">
                        {item.detail}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-terracotta-600 dark:text-terracotta-400">
                        {item.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Schematic Visualizer Card */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="rounded-3xl p-6 sm:p-8 bg-deepsea-900 text-white border border-deepsea-800 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-deepsea-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-caribbean-400 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-caribbean-300">
                    Fase {activeStep + 1} de 5 en Operación
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-deepsea-800 text-sand-300 border border-deepsea-700">
                  Esquema Hidráulico
                </span>
              </div>

              {/* Dynamic Step Visualization */}
              <div className="h-64 rounded-2xl bg-deepsea-950/80 border border-deepsea-800/80 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-drafting-grid opacity-10 pointer-events-none" />

                {activeStep === 0 && (
                  <div className="space-y-3 relative z-10 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-caribbean-500/20 text-caribbean-400 flex items-center justify-center mx-auto">
                      <Droplets className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">Captación por Macro-Embudo</h3>
                    <p className="text-xs text-sand-300 max-w-sm font-light">
                      La cubierta invertida canaliza el 100% de la precipitación pluvial hacia bajantes de acero inoxidable.
                    </p>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-3 relative z-10 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                      <Filter className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">Separación de Salitre y Polvo</h3>
                    <p className="text-xs text-sand-300 max-w-sm font-light">
                      La cámara de desvío automático retiene los primeros milímetros de lavado superficial protegiendo las reservas.
                    </p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-3 relative z-10 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-caribbean-500/20 text-caribbean-400 flex items-center justify-center mx-auto">
                      <Layers className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">Bóveda Subterránea Inmune</h3>
                    <p className="text-xs text-sand-300 max-w-sm font-light">
                      Almacenamiento protegido a +22m de cota, blindado ante la intrusión salina que inutiliza los pozos actuales de Tierrabomba.
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3 relative z-10 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Sun className="w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">Potabilización Solar Fotovoltaica</h3>
                    <p className="text-xs text-sand-300 max-w-sm font-light">
                      Lámparas de luz ultravioleta y carbón activado eliminan bacterias sin necesidad de químicos agresivos.
                    </p>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-3 relative z-10 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                      <RefreshCw className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">Fitodepuración y Huertos</h3>
                    <p className="text-xs text-sand-300 max-w-sm font-light">
                      Las aguas grises se tratan con totoras y vetiver en humedales artificiales para regar huertos comunitarios y estabilizar laderas.
                    </p>
                  </div>
                )}

              </div>

              {/* Navigation buttons between steps */}
              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-deepsea-800 hover:bg-deepsea-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sand-200"
                >
                  &larr; Anterior
                </button>
                <span className="text-xs font-mono text-sand-400">
                  Paso {activeStep + 1} de {projectInfo.waterSystem.steps.length}
                </span>
                <button
                  disabled={activeStep === projectInfo.waterSystem.steps.length - 1}
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-terracotta-600 hover:bg-terracotta-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
