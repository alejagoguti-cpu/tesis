import React from 'react';
import { projectInfo } from '../data/projectData';

const INDICE = [
  { id: 'resumen', n: '00', label: 'Resumen del proyecto' },
  { id: 'territorio', n: '01', label: 'Nuestro territorio' },
  { id: 'module11', n: '02', label: 'La historia de la isla' },
  { id: 'framework', n: '03', label: 'El mapa de los riesgos' },
  { id: '3dviewer', n: '04', label: 'Así será el nuevo barrio' },
];

export default function IntroLandingIndex({ onNavigateModule, onBackToThesis }) {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-slate-900 font-sans text-white">
      <img
        src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`}
        alt="Vista satelital de la isla de Tierrabomba, Cartagena"
        className="absolute inset-0 h-full w-full object-cover object-[55%_25%] anim-ken-burns"
        fetchPriority="high"
      />

      {onBackToThesis && (
        <button
          onClick={onBackToThesis}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 text-sm text-white/90 px-3 h-9 rounded-md border border-white/35 bg-white/10 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
        >
          Ver la tesis
        </button>
      )}
      <div className="relative z-10 flex h-full items-end lg:items-center p-4 sm:p-8 lg:p-14">
        {/* Panel de vidrio */}
        <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/15 p-6 sm:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl backdrop-saturate-150 glass-sheen anim-fade-up">
          <p className="text-sm text-white/80 anim-fade-up" style={{ animationDelay: '250ms' }}>
            Tesis de grado · Arquitectura y Urbanismo · 2026
          </p>

          <h1 style={{ animationDelay: '400ms' }} className="anim-fade-up mt-8 text-5xl sm:text-6xl font-semibold leading-[0.98] tracking-tight">
            Tierra Bomba
          </h1>
          <p style={{ animationDelay: '550ms' }} className="anim-fade-up mt-3 text-xl sm:text-2xl text-white/90">Hábitat resiliente</p>
          <p className="mt-1 text-sm text-white/70">Cartagena de Indias, Colombia</p>

          <ul className="mt-8 border-t border-white/30">
            {INDICE.map(({ id, n, label }, i) => (
              <li key={id} className="border-b border-white/30 anim-fade-up" style={{ animationDelay: `${700 + i * 90}ms` }}>
                <button
                  onClick={() => onNavigateModule(id)}
                  className="group flex w-full items-baseline gap-4 py-3 text-left cursor-pointer"
                >
                  <span className="w-6 text-sm text-white/60">{n}</span>
                  <span className="flex-1 text-lg">{label}</span>
                  <span className="text-white/60 transition-transform group-hover:translate-x-1 group-hover:text-white">→</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm text-white/70">{projectInfo.author}</p>
        </div>
      </div>
    </section>
  );
}


