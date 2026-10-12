import React from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Home, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2,
  FileText,
  Activity
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function Module11Territory({ onNavigateModule }) {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-800 p-4 sm:p-8 lg:p-12 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* Big Highlight Box: Central Question */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent border-2 border-amber-500/40 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-2 text-red-700 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Pregunta Central de Investigación</span>
          </div>
          <h2 className="font-serif italic font-black text-xl sm:text-3xl text-slate-900 leading-tight">
            "¿Qué ocurre cuando una comunidad comienza a perder las condiciones necesarias para permanecer en su propio territorio?"
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-1">
            Caso de estudio aplicado a la <strong>Isla de Tierrabomba, Bahía de Cartagena de Indias</strong>.
          </p>
        </div>

        {/* 3 Critical Diagnosis Pillars - Actualizados con los antecedentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Vivienda */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-700 font-bold tracking-wider">
                  Antecedente 01 // Habitabilidad
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Vivienda y Gestión del Riesgo
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed text-justify">
                Un expediente judicial de 2022 recoge propuestas de recuperación de 50 viviendas en riesgo y medidas de reubicación para familias en peligro inminente.
              </p>
              <p className="text-xs text-slate-500 font-sans leading-relaxed text-justify">
                Este antecedente demuestra que las afectaciones habitacionales han requerido atención institucional y judicial. Sin embargo, no significa que actualmente esas 50 viviendas continúen en las mismas condiciones. Por eso, necesitamos actualizar esta información y localizar los sectores afectados.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Expediente judicial:</span>
              <span className="font-bold text-amber-800">50 Casas en riesgo (2022)</span>
            </div>
          </div>

          {/* Card 2: Infraestructura Educativa */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-red-600 font-bold tracking-wider">
                  Antecedente 02 // Dotacional
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Infraestructura Educativa
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed text-justify">
                El Informe de Calidad de Vida de Cartagena de 2025 reporta un índice de infraestructura educativa de <strong>37,3 puntos</strong> para Tierra Bomba–Punta Arena, clasificado como deficiente.
              </p>
              <p className="text-xs text-slate-500 font-sans leading-relaxed text-justify">
                Es importante aclarar que Tierra Bomba sí cuenta con establecimientos educativos. Por tanto, el problema no es la inexistencia absoluta de colegios, sino las condiciones físicas, la capacidad y las necesidades específicas de la infraestructura disponible.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Índice Calidad de Vida:</span>
              <span className="font-bold text-red-600">37,3 pts (Deficiente)</span>
            </div>
          </div>

          {/* Card 3: Servicios Esenciales */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-teal-700 font-bold tracking-wider">
                  Antecedente 03 // Servicios
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Servicios Esenciales y Saneamiento
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed text-justify">
                Existen decisiones de la Corte Constitucional que han abordado afectaciones al acceso al agua potable y al saneamiento de comunidades de Tierra Bomba.
              </p>
              <p className="text-xs text-slate-500 font-sans leading-relaxed text-justify">
                Esto es especialmente importante porque la habitabilidad no depende únicamente de la construcción de edificios, sino también de las infraestructuras que permiten su funcionamiento.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Marco Legal:</span>
              <span className="font-bold text-teal-700">Decisiones Corte Const.</span>
            </div>
          </div>

        </div>

        {/* Conclusión y Justificación Metodológica */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-terracotta-600 font-mono text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Fundamentación del Objeto de Estudio</span>
          </div>
          <p className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug">
            Estas tres evidencias no significan que toda la isla presente los mismos problemas. Sin embargo, justifican investigar cómo las condiciones residenciales, educativas y de servicios afectan la posibilidad de permanecer en el territorio.
          </p>
        </div>

        {/* Thesis Proposed Answer (Masterplan) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
              La Respuesta Proyectual // Tesis 2026–2050
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              De la Resignación a la Relocalización con Identidad y Permanencia
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Meseta Segura (+22.00 m.s.n.m.)</span>
              </div>
              <p className="text-justify text-xs text-stone-300">
                Se traslada la zona habitacional hacia la meseta central libre de socavación y protegida ante el aumento del nivel del mar para los próximos 100 años, manteniendo a la comunidad dentro de su propia isla.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Célula Hídrica Autónoma (450kL)</span>
              </div>
              <p className="text-justify text-xs text-stone-300">
                Captación pluvial en la cubierta del colegio comunitario y en los techos de los módulos de vivienda progresiva, garantizando 90 días de autonomía de reserva continua.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
