import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Sun, 
  Wind, 
  TreePine, 
  CheckCircle2
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function StrategyRelocation() {
  return (
    <section id="estrategia" className="py-24 relative overflow-hidden bg-editorial-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Chapter 04 Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand-300 dark:border-deepsea-800 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest block">
              Capítulo 04 // Estrategia Bioclimática
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sand-900 dark:text-sand-50 tracking-tight">
              {projectInfo.strategy.title}
            </h2>
          </div>
          <p className="text-sand-600 dark:text-deepsea-300 text-xs sm:text-sm font-mono max-w-md">
            {projectInfo.strategy.description}
          </p>
        </div>

        {/* 4 Strategy Pillars Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectInfo.strategy.pillars.map((pillar) => (
            <div 
              key={pillar.step}
              className="p-7 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle hover-lift flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-2xl text-terracotta-500/60 dark:text-terracotta-400/50 group-hover:text-terracotta-600 transition-colors">
                    {pillar.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sand-100 dark:bg-deepsea-950 flex items-center justify-center text-terracotta-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-sand-900 dark:text-sand-50 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-sand-200 dark:border-deepsea-800">
                <div className="h-1 w-full bg-sand-200 dark:bg-deepsea-800 rounded-full overflow-hidden">
                  <div className="h-full bg-terracotta-500 rounded-full w-2/3 group-hover:w-full transition-spring" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bioclimatic & Environmental Criteria Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-[#111820] text-white border border-deepsea-800 shadow-architectural">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase font-mono font-bold text-terracotta-400 tracking-wider">
                Estrategia Pasiva Caribeña
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Ventilación Cruzada, Protección Solar & Materialidad del Territorio
              </h3>
              <p className="text-xs sm:text-sm text-sand-300 leading-relaxed text-justify">
                El diseño arquitectónico orienta las edificaciones en eje Este-Oeste para mitigar la radiación directa, abriendo los módulos hacia los vientos alisios del Norte-Noreste. Los aleros de 2.5 metros generan sombra perimetral continua y las celosías de arcilla BTC permiten la salida del aire caliente por convección térmica natural.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 hover-lift">
                <Wind className="w-5 h-5 text-caribbean-400" />
                <h4 className="text-xs font-bold font-mono text-white">Vientos Alisios</h4>
                <p className="text-[11px] text-sand-400">Orientación N-NE para enfriamiento pasivo continuo.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 hover-lift">
                <Sun className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-bold font-mono text-white">Aleros de 2.5m</h4>
                <p className="text-[11px] text-sand-400">Protección solar integral sobre celosías de fachada.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 col-span-2 sm:col-span-1 hover-lift">
                <TreePine className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold font-mono text-white">Madera & BTC</h4>
                <p className="text-[11px] text-sand-400">Inercia térmica y huella de carbono reducida.</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
