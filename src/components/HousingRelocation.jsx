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
    <section id="reubicacion-proyectos" className="py-24 bg-sand-100/60 dark:bg-deepsea-900/40 border-b border-sand-300 dark:border-deepsea-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Chapter 03 Header with Module Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand-300 dark:border-deepsea-800 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest block">
              Capítulo 03 // Propuesta Arquitectónica
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sand-900 dark:text-sand-50 tracking-tight">
              Vivienda Resiliente & Equipamiento Educativo
            </h2>
          </div>

          {/* Module Selector Pill */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle self-start">
            <button
              onClick={() => setSelectedModule('vivienda')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-spring ${
                selectedModule === 'vivienda'
                  ? 'bg-terracotta-600 text-white shadow-sm'
                  : 'text-sand-700 dark:text-deepsea-300 hover:text-terracotta-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>1. Vivienda Resiliente (120 Familias)</span>
            </button>
            <button
              onClick={() => setSelectedModule('colegio')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-spring ${
                selectedModule === 'colegio'
                  ? 'bg-terracotta-600 text-white shadow-sm'
                  : 'text-sand-700 dark:text-deepsea-300 hover:text-terracotta-600'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>2. Equipamiento Educativo (350 Alumnos)</span>
            </button>
          </div>
        </div>

        {/* 1. HOUSING RELOCATION MODULE */}
        {selectedModule === 'vivienda' && (
          <div className="space-y-10">
            
            {/* Housing Strategy Banner */}
            <div className="p-8 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle space-y-5">
              <div className="flex items-center space-x-3 text-terracotta-600 dark:text-terracotta-400">
                <Home className="w-6 h-6" />
                <h3 className="font-display font-bold text-2xl text-sand-900 dark:text-sand-50">
                  {housingProgram.title}
                </h3>
              </div>
              <p className="text-sm text-sand-700 dark:text-sand-300 leading-relaxed max-w-4xl">
                {housingProgram.concept}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sand-200 dark:border-deepsea-800">
                <div>
                  <span className="text-[10px] font-mono text-sand-500 dark:text-deepsea-400 uppercase tracking-wider">Unidades Reubicadas</span>
                  <p className="font-display font-bold text-xl text-sand-900 dark:text-sand-50">120 Hogares</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sand-500 dark:text-deepsea-400 uppercase tracking-wider">Modulación Estructural</span>
                  <p className="font-display font-bold text-xl text-terracotta-600 dark:text-terracotta-400">3.60 x 3.60 m</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sand-500 dark:text-deepsea-400 uppercase tracking-wider">Cota Palafítica</span>
                  <p className="font-display font-bold text-xl text-sand-900 dark:text-sand-50">+0.60 m sobre suelo</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sand-500 dark:text-deepsea-400 uppercase tracking-wider">Aljibe Individual</span>
                  <p className="font-display font-bold text-xl text-caribbean-600 dark:text-caribbean-400">2.500 L / Casa</p>
                </div>
              </div>
            </div>

            {/* Housing Typologies Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {housingProgram.typologies.map((typology, index) => (
                <div 
                  key={index}
                  className="p-8 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle hover-lift space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-sand-100 dark:bg-deepsea-950 text-terracotta-700 dark:text-terracotta-300 border border-sand-200 dark:border-deepsea-800">
                        Área: {typology.area}
                      </span>
                      <span className="text-xs text-sand-500 dark:text-deepsea-400 font-mono">
                        {typology.occupancy}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-xl text-sand-900 dark:text-sand-50">
                      {typology.name}
                    </h4>

                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-mono font-bold uppercase text-sand-500 dark:text-deepsea-400">Criterios de Diseño:</p>
                      <ul className="space-y-1.5">
                        {typology.features.map((feat, i) => (
                          <li key={i} className="flex items-center space-x-2 text-xs text-sand-700 dark:text-sand-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50 dark:bg-deepsea-950 border border-sand-200 dark:border-deepsea-800 text-xs">
                    <span className="font-bold text-sand-800 dark:text-sand-200">Esquema Progresivo: </span>
                    <span className="text-sand-600 dark:text-deepsea-300">{typology.expansion}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 2. EDUCATIONAL EQUIPMENT MODULE */}
        {selectedModule === 'colegio' && (
          <div className="space-y-10">
            
            {/* Educational Banner */}
            <div className="p-8 rounded-3xl bg-[#111820] text-white border border-deepsea-800 shadow-architectural space-y-5">
              <div className="flex items-center space-x-3 text-terracotta-400">
                <GraduationCap className="w-7 h-7" />
                <h3 className="font-display font-bold text-2xl text-white">
                  {educationalProgram.title}
                </h3>
              </div>
              <p className="text-sm text-sand-300 leading-relaxed max-w-3xl">
                Infraestructura dotacional que articula 6 aulas bioclimáticas, laboratorios de ciencias del mar, talleres de oficios pesqueros y el <b>Dispensario Hídrico Central (12 tomas)</b> que garantiza el acceso soberano al agua potable para las 120 familias de la meseta.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-deepsea-800">
                <div>
                  <span className="text-[10px] font-mono text-sand-400 uppercase tracking-wider">Capacidad Pedagógica</span>
                  <p className="font-display font-bold text-xl text-white">350 Estudiantes</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sand-400 uppercase tracking-wider">Área Cubierta Captadora</span>
                  <p className="font-display font-bold text-xl text-caribbean-400">1.850 m²</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sand-400 uppercase tracking-wider">Dispensario Comunal</span>
                  <p className="font-display font-bold text-xl text-terracotta-400">12 Tomas / 450.000 L</p>
                </div>
              </div>
            </div>

            {/* Program Spaces Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {educationalProgram.spaces.map((space, index) => (
                <div 
                  key={index}
                  className="p-7 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle hover-lift space-y-4"
                >
                  <div className="flex items-center space-x-2 text-terracotta-600 dark:text-terracotta-400">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-display font-bold text-lg text-sand-900 dark:text-sand-50">
                      {space.zone}
                    </h4>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {space.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-sand-700 dark:text-sand-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-caribbean-600 shrink-0 mt-0.5" />
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
