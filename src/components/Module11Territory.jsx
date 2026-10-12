import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Home, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2,
  Activity,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

const EVIDENCE_GALLERIES = {
  vivienda: {
    id: "vivienda",
    title: "Evidencia Fotográfica: Viviendas en Riesgo de Socavación & Colapso",
    sourceName: "Registro Fotográfico en Sitio & Expediente Judicial de Gestión del Riesgo (2022)",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_erosion_ruinas.png`,
        caption: "Ruinas de viviendas socavadas por el oleaje frente a la bahía de Cartagena. Estructuras fracturadas y desmanteladas por el avance marino.",
        tag: "Colapso Estructural por Socavación"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_borde_socavacion.jpg`,
        caption: "Asentamientos en el borde costero crítico de Tierrabomba. Viviendas autoconstruidas sobre cimientos socavados y muros precarios de contención.",
        tag: "Viviendas en Peligro Inminente"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_costa_tierrabomba.png`,
        caption: "Franja habitacional de borde en Tierrabomba frente al agua: exposición directa a pleamar, mareas de leva e impacto de trenes de olas.",
        tag: "Exposición Territorial Costera"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/calque_tierrabomba.png`,
        caption: "Delimitación del borde de socavación marina y franja de 50 viviendas en peligro inminente registradas en expediente.",
        tag: "Planimetría Territorial"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/boceto_vivienda_corte.png`,
        caption: "Corte conceptual del prototipo de vivienda modular progresiva resiliente proyectado para reubicación a cota segura (+22m).",
        tag: "Propuesta de Tesis (+22m)"
      }
    ]
  },
  educacion: {
    id: "educacion",
    title: "Evidencia Fotográfica: Deterioro Estructural del Colegio en Tierra Bomba",
    sourceName: "Investigación en Sitio & Reporte Publimetro Colombia (2023–2025)",
    sourceUrl: "https://www.publimetro.co/noticias/2023/04/29/tierrabomba-sin-agua-muere-de-sed-tan-cerca-y-tan-lejos-de-lograr-su-verdadero-desarrollo-social/",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_1.jpg`,
        caption: "Desprendimiento de mampostería, corrosión de armaduras y cerramiento provisional con madera aglomerada.",
        tag: "Deterioro Físico Crítico"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_2.png`,
        caption: "Viga de concreto con acero de refuerzo totalmente expuesto a la salinidad marina y fisuras en elementos portantes.",
        tag: "Falla Estructural Portante"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/boceto_colegio_corte.png`,
        caption: "Propuesta arquitectónica de sustitución: equipamiento educativo bioclimático con macro-cubierta captadora.",
        tag: "Respuesta de Tesis (+22m)"
      }
    ]
  },
  servicios: {
    id: "servicios",
    title: "Evidencia Fotográfica: Crisis Hídrica y Abastecimiento Informal",
    sourceName: "Reportaje Especial Publimetro & Sentencias Corte Constitucional",
    sourceUrl: "https://www.publimetro.co/noticias/2023/04/29/tierrabomba-sin-agua-muere-de-sed-tan-cerca-y-tan-lejos-de-lograr-su-verdadero-desarrollo-social/",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/tierrabomba_publimetro_agua.jpg`,
        caption: "El diario vivir de las familias de Tierra Bomba: acarreo manual y compra de pimpinas de agua dulce frente a la bahía.",
        tag: "0% Red Formal de Acueducto"
      }
    ]
  }
};

export default function Module11Territory({ onNavigateModule }) {
  const [activeGalleryKey, setActiveGalleryKey] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeGallery = activeGalleryKey ? EVIDENCE_GALLERIES[activeGalleryKey] : null;

  const handleOpenGallery = (key) => {
    setActiveGalleryKey(key);
    setCurrentSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (!activeGallery) return;
    setCurrentSlideIndex((prev) => (prev + 1) % activeGallery.images.length);
  };

  const handlePrevSlide = () => {
    if (!activeGallery) return;
    setCurrentSlideIndex((prev) => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-800 p-4 sm:p-8 lg:p-12 animate-fade-in relative">
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
            Caso de estudio aplicado a la <strong>Isla de Tierrabomba, Bahía de Cartagena de Indias</strong>. Haz clic en las tarjetas inferiores para explorar las evidencias fotográficas en cada dimensión.
          </p>
        </div>

        {/* 3 Critical Diagnosis Pillars - Cards con botón interactivo de Carrusel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Vivienda */}
          <div 
            onClick={() => handleOpenGallery('vivienda')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold flex items-center space-x-1 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <ImageIcon className="w-3 h-3" />
                  <span>Ver Fotos ({EVIDENCE_GALLERIES.vivienda.images.length})</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-700 font-bold tracking-wider">
                  Antecedente 01 // Habitabilidad
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-amber-800 transition-colors">
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
          <div 
            onClick={() => handleOpenGallery('educacion')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-red-400 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold flex items-center space-x-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <ImageIcon className="w-3 h-3" />
                  <span>Ver Fotos ({EVIDENCE_GALLERIES.educacion.images.length})</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-red-600 font-bold tracking-wider">
                  Antecedente 02 // Dotacional
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-red-700 transition-colors">
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
          <div 
            onClick={() => handleOpenGallery('servicios')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-mono font-bold flex items-center space-x-1 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <ImageIcon className="w-3 h-3" />
                  <span>Ver Fotos</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-teal-700 font-bold tracking-wider">
                  Antecedente 03 // Servicios
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-teal-800 transition-colors">
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

      {/* MODAL CARRUSEL DE FOTOGRAFÍAS */}
      {activeGallery && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-scale-up">
            
            {/* Carousel Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="space-y-1 min-w-0 pr-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold uppercase">
                    Evidencia en Sitio
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Foto {currentSlideIndex + 1} de {activeGallery.images.length}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate">
                  {activeGallery.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveGalleryKey(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Image Container */}
            <div className="relative bg-slate-950 flex-1 min-h-[320px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
              <img
                src={activeGallery.images[currentSlideIndex].url}
                alt={activeGallery.images[currentSlideIndex].caption}
                className="max-h-[60vh] max-w-full object-contain select-none transition-all duration-300"
              />

              {/* Tag pill on top of image */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-mono font-bold">
                {activeGallery.images[currentSlideIndex].tag}
              </div>

              {/* Navigation Arrows */}
              {activeGallery.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/60 hover:bg-black/85 text-white transition-all hover:scale-110 backdrop-blur-sm"
                    title="Foto anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/60 hover:bg-black/85 text-white transition-all hover:scale-110 backdrop-blur-sm"
                    title="Foto siguiente"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Thumbnails dots */}
              {activeGallery.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  {activeGallery.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Carousel Caption Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-2">
              <p className="text-xs sm:text-sm font-sans text-slate-800 leading-relaxed font-medium">
                {activeGallery.images[currentSlideIndex].caption}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                <span>Fuente: {activeGallery.sourceName}</span>
                {activeGallery.sourceUrl && (
                  <a
                    href={activeGallery.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 hover:text-red-700 font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>Ver reportaje en Publimetro</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
