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
  RefreshCw,
  Maximize2,
  ExternalLink,
  Activity
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function WaterSustainability({ onSelectModule }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-8 py-2 animate-fade-in">
      
      {/* Chapter 07 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-blue-700 uppercase tracking-widest">
              Capítulo 07 // Infraestructura Hídrica
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {projectInfo.waterSystem.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl">
            {projectInfo.waterSystem.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            if (onSelectModule) onSelectModule('simulations');
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold shadow-sm transition-all self-start md:self-center"
        >
          <Activity className="w-4 h-4" />
          <span>Simulador de Sequía (Lab 08)</span>
        </button>
      </div>

      {/* 3 Capacity Highlights Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Capacidad de Reserva</p>
            <h4 className="font-serif font-bold text-2xl text-slate-900 mt-0.5">450.000 Litros</h4>
            <p className="text-[11px] text-blue-600 font-mono">90 días de autonomía</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-terracotta-50 text-terracotta-600">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Área de Captación</p>
            <h4 className="font-serif font-bold text-2xl text-slate-900 mt-0.5">1.850 m²</h4>
            <p className="text-[11px] text-terracotta-600 font-mono">Cubierta invertida</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Energía del Sistema</p>
            <h4 className="font-serif font-bold text-2xl text-slate-900 mt-0.5">100% Fotovoltaica</h4>
            <p className="text-[11px] text-amber-600 font-mono">Bombeo & Desinfección UV</p>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Water Flow Schematic */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Steps navigation list */}
        <div className="lg:col-span-6 space-y-3">
          {projectInfo.waterSystem.steps.map((item, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-400/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {item.detail}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-mono font-bold text-blue-600">
                      {item.capacity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Step Schematic Viewer Card */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                  Fase {activeStep + 1} de 5 en Operación
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Esquema Hidráulico
              </span>
            </div>

            {/* Step Visualizer */}
            <div className="h-64 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
              
              {activeStep === 0 && (
                <div className="space-y-3 relative z-10 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                    <Droplets className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Captación por Macro-Embudo</h3>
                  <p className="text-xs text-slate-300 max-w-sm font-light">
                    La cubierta invertida de 1.850 m² canaliza el 100% de la precipitación pluvial hacia bajantes de acero inoxidable.
                  </p>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-3 relative z-10 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <Filter className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Separación de Salitre y Polvo</h3>
                  <p className="text-xs text-slate-300 max-w-sm font-light">
                    La cámara de primer lavado desvía los primeros 2 mm de lluvia reteniendo sedimentos antes del almacenamiento.
                  </p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3 relative z-10 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                    <Layers className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Bóveda Subterránea Inmune (+22m)</h3>
                  <p className="text-xs text-slate-300 max-w-sm font-light">
                    Almacenamiento subterráneo de 450.000L blindado ante la intrusión marina que saliniza los pozos costeros.
                  </p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-3 relative z-10 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Sun className="w-8 h-8 animate-pulse" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Potabilización Solar Fotovoltaica</h3>
                  <p className="text-xs text-slate-300 max-w-sm font-light">
                    Lámparas ultravioleta y carbón activado alimentados por paneles solares para potabilidad certificada.
                  </p>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-3 relative z-10 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Fitodepuración y Dispensario</h3>
                  <p className="text-xs text-slate-300 max-w-sm font-light">
                    12 tomas comunitarias de agua potable + tratamiento de aguas grises con totoras para riego de huertos.
                  </p>
                </div>
              )}

            </div>

            {/* Step Navigation Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-200"
              >
                &larr; Anterior
              </button>
              <span className="text-xs font-mono text-slate-400">
                Paso {activeStep + 1} de {projectInfo.waterSystem.steps.length}
              </span>
              <button
                disabled={activeStep === projectInfo.waterSystem.steps.length - 1}
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Siguiente &rarr;
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
