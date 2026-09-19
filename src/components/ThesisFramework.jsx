import React from 'react';
import { 
  BookOpen, 
  Target, 
  Compass, 
  CheckCircle2, 
  FileCheck2, 
  Layers, 
  HelpCircle
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function ThesisFramework() {
  const { academicFramework } = projectInfo;

  return (
    <section id="marco-tesis" className="py-24 bg-sand-50 dark:bg-deepsea-950/70 border-b border-sand-300 dark:border-deepsea-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Chapter 01 Index */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand-300 dark:border-deepsea-800 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest block">
              Capítulo 01 // Fundamentación de Tesis
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sand-900 dark:text-sand-50 tracking-tight">
              Planteamiento, Justificación & Objetivos
            </h2>
          </div>
          <p className="text-sand-600 dark:text-deepsea-300 text-xs sm:text-sm font-mono max-w-md">
            Ordenamiento territorial y hábitat adaptativo en la meseta central de Tierrabomba.
          </p>
        </div>

        {/* 1. Problem Statement & Justification Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problem Statement Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 space-y-5 flex flex-col justify-between shadow-subtle hover-lift">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-terracotta-600">
                <div className="p-2.5 rounded-xl bg-terracotta-50 dark:bg-deepsea-950 border border-terracotta-200 dark:border-terracotta-900/40">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-sand-900 dark:text-sand-50">
                  Planteamiento del Problema
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-sand-700 dark:text-sand-300 leading-relaxed text-justify">
                {academicFramework.justification.problemStatement}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-terracotta-50 dark:bg-deepsea-950 border border-terracotta-200 dark:border-deepsea-800 text-terracotta-800 dark:text-terracotta-300 text-xs font-mono font-medium flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-terracotta-600 shrink-0 animate-pulse" />
              <span>Pérdida costera: 1.8 m/año &bull; 0% Acueducto público formal</span>
            </div>
          </div>

          {/* Academic Justification Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#111820] text-sand-50 border border-deepsea-800 space-y-5 flex flex-col justify-between shadow-architectural hover-lift">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-caribbean-300">
                <div className="p-2.5 rounded-xl bg-caribbean-900/50 border border-caribbean-700/50">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Justificación de la Propuesta
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-sand-300 leading-relaxed text-justify">
                {academicFramework.justification.academicJustification}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-caribbean-300 text-xs font-mono font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-caribbean-400" />
              <span>Solución Integral: 120 Viviendas + Colegio Bioclimático</span>
            </div>
          </div>

        </div>

        {/* 2. General Objective Monograph Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-terracotta-800 via-terracotta-900 to-deepsea-950 text-white border border-terracotta-700/50 shadow-architectural relative overflow-hidden">
          <div className="space-y-4 max-w-4xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-sand-200 text-xs font-mono font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-terracotta-300" />
              <span>Objetivo General de la Tesis</span>
            </div>
            
            <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl leading-tight text-sand-50">
              "{academicFramework.generalObjective}"
            </h3>
            
            <p className="text-xs sm:text-sm text-sand-300 font-mono">
              Intervención Proyectual: Reubicación de 120 Viviendas + Colegio para 350 estudiantes + Aljibe de 450.000 L.
            </p>
          </div>
        </div>

        {/* 3. Specific Objectives Grid with Warm Tectonic Cards */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-sand-900 dark:text-sand-100">
            <Compass className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-display font-bold text-2xl">
              Objetivos Específicos de la Investigación
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicFramework.specificObjectives.map((obj) => (
              <div 
                key={obj.code}
                className="p-6 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle hover-lift flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg bg-sand-100 dark:bg-deepsea-950 text-terracotta-700 dark:text-terracotta-300 border border-sand-200 dark:border-deepsea-800">
                      {obj.code}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-terracotta-500 opacity-40 group-hover:opacity-100 transition-spring" />
                  </div>
                  <h4 className="font-display font-bold text-base text-sand-900 dark:text-sand-50 leading-snug">
                    {obj.title}
                  </h4>
                  <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-sand-200 dark:border-deepsea-800">
                  <div className="h-1 w-full bg-sand-200 dark:bg-deepsea-800 rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta-500 rounded-full w-3/4 group-hover:w-full transition-spring" />
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
