import React from 'react';
import { 
  BookOpen, 
  Target, 
  Compass, 
  CheckCircle2, 
  FileCheck2, 
  Layers, 
  Home, 
  GraduationCap, 
  Droplets,
  HelpCircle,
  Quote
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function ThesisFramework() {
  const { academicFramework } = projectInfo;

  return (
    <section id="marco-tesis" className="py-20 bg-white dark:bg-architectural-950 border-b border-architectural-200 dark:border-architectural-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Academic Section Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-caribbean-50 dark:bg-caribbean-950/80 text-caribbean-700 dark:text-caribbean-300 text-xs font-semibold border border-caribbean-200 dark:border-caribbean-800">
            <BookOpen className="w-3.5 h-3.5 text-caribbean-500" />
            <span>Marco Metodológico & Académico de Tesis</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-architectural-900 dark:text-white tracking-tight">
            Planteamiento, Justificación & Objetivos
          </h2>
          <p className="text-architectural-600 dark:text-architectural-400 text-sm sm:text-base leading-relaxed">
            Estructuración formal de la investigación proyectual para el ordenamiento territorial y diseño arquitectónico en la Isla de Tierrabomba.
          </p>
        </div>

        {/* 1. Problem Statement & Justification Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problem Statement Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-architectural-50 dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-warningCoral">
                <div className="p-2.5 rounded-xl bg-warningCoral/10 border border-warningCoral/20">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-architectural-900 dark:text-white">
                  Planteamiento del Problema
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-architectural-600 dark:text-architectural-300 leading-relaxed text-justify">
                {academicFramework.justification.problemStatement}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-warningCoral/5 border border-warningCoral/10 text-warningCoral text-xs font-mono font-medium flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-warningCoral shrink-0 animate-ping" />
              <span>Pérdida de borde costero: hasta 1.8 m/año &bull; 0% Acueducto</span>
            </div>
          </div>

          {/* Academic Justification Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-gradient-to-br from-architectural-900 to-architectural-950 text-white border border-architectural-800 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-caribbean-400">
                <div className="p-2.5 rounded-xl bg-caribbean-500/20 border border-caribbean-400/30">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Justificación de la Propuesta
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-architectural-300 leading-relaxed text-justify">
                {academicFramework.justification.academicJustification}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-caribbean-300 text-xs font-mono font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-caribbean-400" />
              <span>Solución Dual: Reubicación Habitacional + Colegio Bioclimático</span>
            </div>
          </div>

        </div>

        {/* 2. General Objective Callout Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-caribbean-900 via-caribbean-800 to-architectural-900 text-white border border-caribbean-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-caribbean-200 text-xs font-mono font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-caribbean-300" />
              <span>Objetivo General de la Tesis</span>
            </div>
            
            <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl leading-snug text-white">
              "{academicFramework.generalObjective}"
            </h3>
            
            <p className="text-xs sm:text-sm text-caribbean-100/90 font-mono">
              Proyecto Integral: Reubicación de 120 Viviendas + Equipamiento Educativo para 350 estudiantes + Aljibe de 450.000 L.
            </p>
          </div>
        </div>

        {/* 3. Specific Objectives Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Compass className="w-5 h-5 text-caribbean-500" />
            <h3 className="font-display font-bold text-2xl text-architectural-900 dark:text-white">
              Objetivos Específicos
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicFramework.specificObjectives.map((obj) => (
              <div 
                key={obj.code}
                className="p-6 rounded-2xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-caribbean-50 dark:bg-caribbean-950 text-caribbean-600 dark:text-caribbean-400 border border-caribbean-200 dark:border-caribbean-800">
                      {obj.code}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-caribbean-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-display font-bold text-base text-architectural-900 dark:text-white leading-snug">
                    {obj.title}
                  </h4>
                  <p className="text-xs text-architectural-600 dark:text-architectural-400 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-architectural-100 dark:border-architectural-800">
                  <div className="h-1 w-full bg-architectural-100 dark:bg-architectural-800 rounded-full overflow-hidden">
                    <div className="h-full bg-caribbean-500 rounded-full w-3/4 group-hover:w-full transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
