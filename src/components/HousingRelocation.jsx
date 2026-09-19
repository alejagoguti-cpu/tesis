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
  Droplet,
  Box,
  Printer,
  X
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function HousingRelocation({ onSelectModule }) {
  const [selectedModule, setSelectedModule] = useState('vivienda'); // 'vivienda' | 'colegio'
  const [activeSpaceModal, setActiveSpaceModal] = useState(null);
  const { housingProgram, educationalProgram } = projectInfo;

  return (
    <div className="space-y-8 py-2 animate-fade-in">
      
      {/* Chapter 03 Header with Module Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-terracotta-600 uppercase tracking-widest">
              Capítulo 03 // Arquitectura & Dotacional
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Vivienda Resiliente & Equipamiento Educativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl">
            Prototipos modulares progresivos de vivienda sobre pilotes (+0.60m) y centro educativo con capacidad para 350 estudiantes en la meseta (+22m).
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm self-start md:self-center">
          <button
            onClick={() => setSelectedModule('vivienda')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedModule === 'vivienda'
                ? 'bg-terracotta-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>1. Vivienda (120 Familias)</span>
          </button>
          <button
            onClick={() => setSelectedModule('colegio')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedModule === 'colegio'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. Colegio (350 Alumnos)</span>
          </button>
        </div>
      </div>

      {/* 1. HOUSING RELOCATION MODULE */}
      {selectedModule === 'vivienda' && (
        <div className="space-y-6">
          
          {/* Housing Concept Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-3 text-terracotta-600">
              <Home className="w-6 h-6" />
              <h3 className="font-serif font-bold text-2xl text-slate-900">
                {housingProgram.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
              {housingProgram.concept}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Unidades Totales</span>
                <p className="font-serif font-bold text-xl text-slate-900 mt-0.5">120 Hogares</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Modulación</span>
                <p className="font-serif font-bold text-xl text-terracotta-600 mt-0.5">3.60 x 3.60 m</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Cota Palafítica</span>
                <p className="font-serif font-bold text-xl text-slate-900 mt-0.5">+0.60 m sobre suelo</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Aljibe Individual</span>
                <p className="font-serif font-bold text-xl text-blue-600 mt-0.5">2.500 L / Casa</p>
              </div>
            </div>
          </div>

          {/* Housing Typologies Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {housingProgram.typologies.map((typology, index) => (
              <div 
                key={index}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-terracotta-500 transition-all space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                      Área: {typology.area}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-semibold">
                      {typology.occupancy}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xl text-slate-900">
                    {typology.name}
                  </h4>

                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-mono font-bold uppercase text-slate-500">Criterios de Diseño:</p>
                    <ul className="space-y-2">
                      {typology.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-terracotta-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900">Esquema Progresivo: </span>
                    <span className="text-slate-600">{typology.expansion}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectModule && onSelectModule('3dviewer')}
                      className="flex-1 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-bold shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Ver Modelo 3D</span>
                    </button>
                    <button
                      onClick={() => onSelectModule && onSelectModule('cad')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. EDUCATIONAL EQUIPMENT MODULE */}
      {selectedModule === 'colegio' && (
        <div className="space-y-6">
          
          {/* Educational Concept Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-3 text-teal-600">
              <GraduationCap className="w-7 h-7" />
              <h3 className="font-serif font-bold text-2xl text-slate-900">
                {educationalProgram.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              Infraestructura dotacional que articula 6 aulas bioclimáticas, laboratorios de ciencias del mar, talleres de oficios pesqueros y el <b>Dispensario Hídrico Central (12 tomas)</b> que garantiza el acceso soberano al agua potable para las 120 familias de la meseta.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Capacidad Pedagógica</span>
                <p className="font-serif font-bold text-xl text-slate-900 mt-0.5">350 Estudiantes</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Área Cubierta Captadora</span>
                <p className="font-serif font-bold text-xl text-teal-600 mt-0.5">1.850 m²</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Dispensario Comunal</span>
                <p className="font-serif font-bold text-xl text-blue-600 mt-0.5">12 Tomas / 450.000 L</p>
              </div>
            </div>
          </div>

          {/* Program Spaces Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {educationalProgram.spaces.map((space, index) => (
              <div 
                key={index}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-teal-500 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-teal-600">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-serif font-bold text-lg text-slate-900">
                      {space.zone}
                    </h4>
                  </div>

                  <ul className="space-y-2.5 pt-1">
                    {space.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setActiveSpaceModal(space)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-xs font-mono font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Ver Ficha de Zona</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Detail Modal for Educational Spaces */}
      {activeSpaceModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {activeSpaceModal.zone}
                </h3>
              </div>
              <button
                onClick={() => setActiveSpaceModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-slate-500 uppercase">Espacios & Áreas del Programa:</p>
              <ul className="space-y-2">
                {activeSpaceModal.items.map((item, i) => (
                  <li key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveSpaceModal(null);
                  if (onSelectModule) onSelectModule('3dviewer');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold transition-colors"
              >
                Ver en 3D
              </button>
              <button
                onClick={() => setActiveSpaceModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
