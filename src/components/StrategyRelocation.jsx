import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Sun, 
  Wind, 
  TreePine, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function StrategyRelocation() {
  return (
    <section id="estrategia" className="py-20 relative overflow-hidden bg-cad-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400 text-xs font-semibold border border-caribbean-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Respuesta Arquitectónica & Territorial</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-architectural-900 dark:text-white tracking-tight">
            {projectInfo.strategy.title}
          </h2>
          <p className="text-architectural-600 dark:text-architectural-300 text-base leading-relaxed">
            {projectInfo.strategy.description}
          </p>
        </div>

        {/* 4 Strategy Pillars Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectInfo.strategy.pillars.map((pillar) => (
            <div 
              key={pillar.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-2xl text-caribbean-500/60 dark:text-caribbean-400/40 group-hover:text-caribbean-500 transition-colors">
                    {pillar.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-architectural-100 dark:bg-architectural-800 flex items-center justify-center text-caribbean-600 dark:text-caribbean-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-architectural-900 dark:text-white leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-architectural-600 dark:text-architectural-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-architectural-100 dark:border-architectural-800/80">
                <div className="h-1 w-full bg-architectural-100 dark:bg-architectural-800 rounded-full overflow-hidden">
                  <div className="h-full bg-caribbean-500 rounded-full w-2/3 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bioclimatic & Environmental Criteria Banner */}
        <div className="rounded-3xl p-8 bg-gradient-to-br from-architectural-900 via-architectural-950 to-architectural-900 text-white border border-architectural-800 shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase font-mono font-bold text-caribbean-400 tracking-wider">
                Estrategia Bioclimática Caribeña
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Ventilación Cruzada, Protección Solar & Materialidad del Territorio
              </h3>
              <p className="text-sm text-architectural-300 leading-relaxed">
                El equipamiento aprovecha la brisa marina y los vientos alisios del norte para generar un efecto termo-sifón mediante cubiertas inclinadas con aperturas superiores. Los aleros profundos de 2.5 metros proyectan sombra sobre las celosías de arcilla local, reduciendo la temperatura interior hasta 4°C sin recurrir a climatización mecánica.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                <Wind className="w-5 h-5 text-caribbean-400" />
                <h4 className="text-xs font-bold font-mono text-white">Vientos Alisios</h4>
                <p className="text-[11px] text-architectural-400">Orientación N-NE para ventilación continua.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-bold font-mono text-white">Aleros de 2.5m</h4>
                <p className="text-[11px] text-architectural-400">Protección solar total en fachadas este y oeste.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 col-span-2 sm:col-span-1">
                <TreePine className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold font-mono text-white">BTC & Arcilla</h4>
                <p className="text-[11px] text-architectural-400">Inercia térmica y huella de carbono reducida.</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
