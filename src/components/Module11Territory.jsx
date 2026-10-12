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
    title: "Antecedente 01: Vivienda y Gestión del Riesgo",
    subtitle: "Expediente Judicial de Gestión del Riesgo (2022)",
    sourceName: "Expediente Judicial (2022) & Registro Fotográfico en Sitio",
    summary: "Propuestas judiciales de recuperación para 50 viviendas en riesgo inminente y necesidad de actualización en terreno.",
    antecedenteParagraphs: [
      "Un expediente judicial de 2022 recoge propuestas de recuperación de 50 viviendas en riesgo y medidas de reubicación para familias en peligro inminente.",
      "Este antecedente demuestra que las afectaciones habitacionales han requerido atención institucional y judicial. Sin embargo, no significa que actualmente esas 50 viviendas continúen en las mismas condiciones. Por eso, necesitamos actualizar esta información y localizar los sectores afectados."
    ],
    metric: { label: "Expediente judicial", value: "50 Casas en riesgo (2022)" },
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
      }
    ]
  },
  educacion: {
    id: "educacion",
    title: "Antecedente 02: Infraestructura Educativa",
    subtitle: "Informe de Calidad de Vida Cartagena (2025)",
    sourceName: "Investigación en Sitio & Reporte Publimetro Colombia (2023–2025)",
    sourceUrl: "https://www.publimetro.co/noticias/2023/04/29/tierrabomba-sin-agua-muere-de-sed-tan-cerca-y-tan-lejos-de-lograr-su-verdadero-desarrollo-social/",
    summary: "Índice de infraestructura de 37,3 pts (deficiente). El reto radica en las condiciones físicas y capacidad de los colegios existentes.",
    antecedenteParagraphs: [
      "El Informe de Calidad de Vida de Cartagena de 2025 reporta un índice de infraestructura educativa de 37,3 puntos para Tierra Bomba–Punta Arena, clasificado como deficiente.",
      "Es importante aclarar que Tierra Bomba sí cuenta con establecimientos educativos. Por tanto, el problema no es la inexistencia absoluta de colegios, sino las condiciones físicas, la capacidad y las necesidades específicas de la infraestructura disponible."
    ],
    metric: { label: "Índice Calidad de Vida", value: "37,3 pts (Deficiente)" },
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_columnas.jpg`,
        caption: "Severa corrosión del acero estructural en columnas y voladizos, pérdida total del recubrimiento de concreto y cintas de acordonamiento por riesgo inminente de colapso.",
        tag: "Riesgo Estructural & Acordonamiento"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_1.jpg`,
        caption: "Desprendimiento de mampostería, corrosión de armaduras y cerramiento provisional con madera aglomerada.",
        tag: "Deterioro Físico Crítico"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_2.png`,
        caption: "Viga de concreto con acero de refuerzo totalmente expuesto a la salinidad marina y fisuras en elementos portantes.",
        tag: "Falla Estructural Portante"
      }
    ]
  },
  servicios: {
    id: "servicios",
    title: "Antecedente 03: Servicios Esenciales y Saneamiento",
    subtitle: "Decisiones de la Corte Constitucional & Publimetro",
    sourceName: "Reportaje Especial Publimetro & Sentencias Corte Constitucional",
    sourceUrl: "https://www.publimetro.co/noticias/2023/04/29/tierrabomba-sin-agua-muere-de-sed-tan-cerca-y-tan-lejos-de-lograr-su-verdadero-desarrollo-social/",
    summary: "Afectaciones críticas al acceso a agua potable y saneamiento: la habitabilidad depende de las redes que permiten el funcionamiento.",
    antecedenteParagraphs: [
      "Existen decisiones de la Corte Constitucional que han abordado afectaciones al acceso al agua potable y al saneamiento de comunidades de Tierra Bomba.",
      "Esto es especialmente importante porque la habitabilidad no depende únicamente de la construcción de edificios, sino también de las infraestructuras que permiten su funcionamiento."
    ],
    metric: { label: "Marco Legal", value: "Decisiones Corte Const." },
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/tierrabomba_acarreo_pimpina.png`,
        caption: "Acarreo cotidiano de pimpinas de agua dulce al hombro por las calles de Tierrabomba ante la falta absoluta de red de acueducto.",
        tag: "Acarreo Manual de Agua"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/tierrabomba_publimetro_agua.jpg`,
        caption: "El diario vivir de las familias de Tierra Bomba: compra y traslado precario de agua dulce traída en barcazas desde Cartagena.",
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

        {/* 3 Critical Diagnosis Pillars - Cards limpias sin contaminación visual (texto completo al entrar a la foto) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {Object.values(EVIDENCE_GALLERIES).map((item) => {
            const Icon = item.id === 'vivienda' ? Home : item.id === 'educacion' ? GraduationCap : Droplets;
            const themeColor = item.id === 'vivienda' ? 'amber' : item.id === 'educacion' ? 'red' : 'teal';

            return (
              <div 
                key={item.id}
                onClick={() => handleOpenGallery(item.id)}
                className={`p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:border-${themeColor}-400 space-y-4`}
              >
                <div className="space-y-3">
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${
                      item.id === 'vivienda' ? 'bg-amber-100 text-amber-800' :
                      item.id === 'educacion' ? 'bg-red-100 text-red-600' :
                      'bg-teal-100 text-teal-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono font-bold flex items-center space-x-1.5 transition-colors ${
                      item.id === 'vivienda' ? 'bg-amber-50 text-amber-900 border-amber-200 group-hover:bg-amber-500 group-hover:text-white' :
                      item.id === 'educacion' ? 'bg-red-50 text-red-700 border-red-200 group-hover:bg-red-600 group-hover:text-white' :
                      'bg-teal-50 text-teal-800 border-teal-200 group-hover:bg-teal-600 group-hover:text-white'
                    }`}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver Fotos ({item.images.length})</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-0.5">
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                      item.id === 'vivienda' ? 'text-amber-700' :
                      item.id === 'educacion' ? 'text-red-600' :
                      'text-teal-700'
                    }`}>
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-slate-950 transition-colors">
                      {item.title.split(':')[1]?.trim() || item.title}
                    </h3>
                  </div>

                  {/* Compact Preview Image */}
                  <div className="h-36 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-950 relative shadow-inner">
                    <img 
                      src={item.images[0].url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-white/90 truncate flex items-center space-x-1">
                        <ZoomIn className="w-3 h-3 text-white" />
                        <span>Clic para ver fotografía y análisis completo</span>
                      </span>
                    </div>
                  </div>

                  {/* Short 1-sentence synopsis to keep the card clean */}
                  <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Metric */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{item.metric.label}:</span>
                  <span className={`font-bold ${
                    item.id === 'vivienda' ? 'text-amber-800' :
                    item.id === 'educacion' ? 'text-red-600' :
                    'text-teal-700'
                  }`}>
                    {item.metric.value}
                  </span>
                </div>
              </div>
            );
          })}

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

            {/* Carousel Caption & Complete Antecedent Text Inside Modal */}
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-4 max-h-[35vh] overflow-y-auto">
              
              {/* Photo Caption */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-sans text-slate-800 leading-relaxed font-medium">
                {activeGallery.images[currentSlideIndex].caption}
              </div>

              {/* Complete In-depth Text of the Antecedent */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                  Fundamentación del Antecedente & Diagnóstico:
                </span>
                {activeGallery.antecedenteParagraphs && activeGallery.antecedenteParagraphs.map((parr, pidx) => (
                  <p key={pidx} className="text-xs sm:text-sm font-sans text-slate-700 leading-relaxed text-justify">
                    {parr}
                  </p>
                ))}
              </div>
              
              {/* Source & Link */}
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
