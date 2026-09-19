import React, { useState } from 'react';
import { 
  Home, 
  GraduationCap, 
  Layers, 
  Users, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TreePine,
  Sparkles,
  Droplet
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function HousingRelocation() {
  const [selectedModule, setSelectedModule] = useState('vivienda'); // 'vivienda' | 'colegio'
  const { housingProgram, educationalProgram } = projectInfo;

  return (
    <section id="reubicacion-proyectos" className="py-20 bg-architectural-50 dark:bg-architectural-900/60 border-b border-architectural-200 dark:border-architectural-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header with Module Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400 text-xs font-semibold border border-caribbean-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Propuesta Arquitectónica & Dotacional</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-architectural-900 dark:text-white tracking-tight">
              Reubicación de Viviendas & Equipamiento Educativo
            </h2>
            <p className="text-architectural-600 dark:text-architectural-400 text-sm max-w-2xl">
              Dos componentes complementarios que configuran el nuevo asentamiento integral en la meseta segura de Tierrabomba.
            </p>
          </div>

          {/* Module Selector Pill */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm self-start">
            <button
              onClick={() => setSelectedModule('vivienda')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedModule === 'vivienda'
                  ? 'bg-caribbean-600 text-white shadow-md'
                  : 'text-architectural-600 dark:text-architectural-400 hover:text-architectural-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>1. Vivienda Resiliente (120 Familias)</span>
            </button>
            <button
              onClick={() => setSelectedModule('colegio')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedModule === 'colegio'
                  ? 'bg-caribbean-600 text-white shadow-md'
                  : 'text-architectural-600 dark:text-architectural-400 hover:text-architectural-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>2. Equipamiento Educativo (350 Alumnos)</span>
            </button>
          </div>
        </div>

        {/* 1. HOUSING RELOCATION MODULE */}
        {selectedModule === 'vivienda' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Housing Strategy Banner */}
            <div className="p-8 rounded-3xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 text-caribbean-600 dark:text-caribbean-400">
                <Home className="w-6 h-6" />
                <h3 className="font-display font-bold text-2xl text-architectural-900 dark:text-white">
                  {housingProgram.title}
                </h3>
              </div>
              <p className="text-sm text-architectural-600 dark:text-architectural-300 leading-relaxed max-w-4xl">
                {housingProgram.concept}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-architectural-100 dark:border-architectural-800">
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Total Hogares</span>
                  <p className="font-display font-bold text-xl text-architectural-900 dark:text-white">120 Unidades</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Modulación Base</span>
                  <p className="font-display font-bold text-xl text-caribbean-600 dark:text-caribbean-400">3.60 x 3.60 m</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Elevación Palafítica</span>
                  <p className="font-display font-bold text-xl text-architectural-900 dark:text-white">+0.60 m de suelo</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Captación por Casa</span>
                  <p className="font-display font-bold text-xl text-emerald-600 dark:text-emerald-400">2.500 L / Aljibe</p>
                </div>
              </div>
            </div>

            {/* Housing Typologies Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {housingProgram.typologies.map((typology, index) => (
                <div 
                  key={index}
                  className="p-7 rounded-3xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-caribbean-50 dark:bg-caribbean-950 text-caribbean-600 dark:text-caribbean-400 border border-caribbean-200 dark:border-caribbean-800">
                        Área: {typology.area}
                      </span>
                      <span className="text-xs text-architectural-500 font-mono">
                        {typology.occupancy}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-xl text-architectural-900 dark:text-white">
                      {typology.name}
                    </h4>

                    {/* Features list */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-mono font-bold uppercase text-architectural-400">Características de Diseño:</p>
                      <ul className="space-y-1.5">
                        {typology.features.map((feat, i) => (
                          <li key={i} className="flex items-center space-x-2 text-xs text-architectural-600 dark:text-architectural-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-caribbean-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-architectural-50 dark:bg-architectural-950 border border-architectural-200 dark:border-architectural-800 text-xs">
                    <span className="font-bold text-architectural-700 dark:text-architectural-300">Esquema de Crecimiento: </span>
                    <span className="text-architectural-500 dark:text-architectural-400">{typology.expansion}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 2. EDUCATIONAL EQUIPMENT MODULE */}
        {selectedModule === 'colegio' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Educational Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-architectural-900 to-architectural-950 text-white border border-architectural-800 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 text-caribbean-400">
                <GraduationCap className="w-7 h-7" />
                <h3 className="font-display font-bold text-2xl text-white">
                  {educationalProgram.title}
                </h3>
              </div>
              <p className="text-sm text-architectural-300 leading-relaxed max-w-3xl">
                Infraestructura dotacional que integra aulas de formación básica, laboratorios marinos, talleres de oficios pesqueros/artesanales y el <b>Dispensario Hídrico Central</b> que abastece de agua potable a toda la comunidad de la meseta.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-architectural-800">
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Capacidad Educativa</span>
                  <p className="font-display font-bold text-xl text-white">350 Estudiantes</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Área de Cubierta Captadora</span>
                  <p className="font-display font-bold text-xl text-caribbean-400">1.850 m²</p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-architectural-400 uppercase">Dispensario Comunal</span>
                  <p className="font-display font-bold text-xl text-emerald-400">12 Tomas / 450.000 L</p>
                </div>
              </div>
            </div>

            {/* Program Spaces Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {educationalProgram.spaces.map((space, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-3xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center space-x-2 text-caribbean-600 dark:text-caribbean-400">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-display font-bold text-lg text-architectural-900 dark:text-white">
                      {space.zone}
                    </h4>
                  </div>

                  <ul className="space-y-2 pt-2">
                    {space.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-architectural-600 dark:text-architectural-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-caribbean-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
