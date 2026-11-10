import React from 'react';
import { projectInfo } from '../data/projectData';

const INDICE = [
  { id: 'framework', n: '01', label: 'Marco de tesis' },
  { id: 'module11', n: '02', label: 'Historia del territorio' },
  { id: 'gis', n: '03', label: 'Diagnóstico y riesgo' },
  { id: '3dviewer', n: '04', label: 'Propuesta 3D' },
];

export default function IntroLandingIndex({ onNavigateModule }) {
  return (
    <section className="min-h-[100svh] w-full bg-[#f4f1ec] text-[#16181d] font-sans flex flex-col lg:flex-row">
      {/* Imagen */}
      <div className="order-1 lg:order-2 h-[42svh] lg:h-auto lg:w-[58%] relative">
        <img
          src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`}
          alt="Vista satelital de la isla de Tierrabomba, Cartagena"
          className="absolute inset-0 h-full w-full object-cover object-[55%_25%]"
          fetchPriority="high"
        />
      </div>

      {/* Texto */}
      <div className="order-2 lg:order-1 lg:w-[42%] flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-8 lg:py-12 gap-10">
        <p className="text-sm text-[#16181d]/70">
          Tesis de grado · Arquitectura y Urbanismo · 2026
        </p>

        <div>
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-semibold leading-[0.98] tracking-tight">
            Tierra Bomba
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-[#16181d]/80">
            Hábitat resiliente
          </p>
          <p className="mt-1 text-base text-[#16181d]/60">Cartagena de Indias, Colombia</p>
        </div>

        <div>
          <ul className="border-t border-[#16181d]/25">
            {INDICE.map(({ id, n, label }) => (
              <li key={id} className="border-b border-[#16181d]/25">
                <button
                  onClick={() => onNavigateModule(id)}
                  className="group flex w-full items-baseline gap-4 py-3 text-left cursor-pointer"
                >
                  <span className="w-6 text-sm text-[#16181d]/50">{n}</span>
                  <span className="flex-1 text-lg group-hover:text-[#c86d51] transition-colors">{label}</span>
                  <span className="text-[#16181d]/40 group-hover:text-[#c86d51] group-hover:translate-x-1 transition-all">→</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-[#16181d]/60">{projectInfo.author}</p>
        </div>
      </div>
    </section>
  );
}
