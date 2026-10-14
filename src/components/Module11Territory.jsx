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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Compass,
  Maximize2,
  SlidersHorizontal,
  Layers,
  Sparkles,
  BookOpen,
  Map as MapIcon,
  Clock,
  FlipHorizontal,
  ArrowRight
} from 'lucide-react';
import { HISTORICAL_MAPS_DATA } from '../data/historicalMaps';
import HistoricalAtlas from './HistoricalAtlas';

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
  // Tab selector: 'planos_historicos' (recuperados) | 'evidencias' (pregunta central)
  const [activeTab, setActiveTab] = useState('planos_historicos');

  // Evidence Gallery modal state
  const [activeGalleryKey, setActiveGalleryKey] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Historical Maps interactive viewer state
  const [selectedMapId, setSelectedMapId] = useState(HISTORICAL_MAPS_DATA[0]?.id || "map_1589");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filterMode, setFilterMode] = useState('natural'); // 'natural' | 'sepia' | 'contrast' | 'invert'
  const [isMirrored, setIsMirrored] = useState(false);
  const [showFullMapModal, setShowFullMapModal] = useState(false);

  const selectedHistoricalMap = HISTORICAL_MAPS_DATA.find(m => m.id === selectedMapId) || HISTORICAL_MAPS_DATA[0];
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

  const handleSelectMap = (id) => {
    setSelectedMapId(id);
    setZoomLevel(1);
    setRotation(0);
    setIsMirrored(false);
  };

  const rotateMap = (deg) => {
    setRotation(prev => ((prev + deg) % 360 + 360) % 360);
  };

  const filterStyle = () => {
    switch (filterMode) {
      case 'sepia': return 'sepia(0.65) contrast(1.15) brightness(0.96)';
      case 'contrast': return 'contrast(1.4) brightness(1.02)';
      case 'invert': return 'invert(0.92) hue-rotate(180deg) contrast(1.25)';
      default: return 'none';
    }
  };

  const mapTransform = {
    transform: `${selectedHistoricalMap?.flipHorizontal ? 'scaleX(-1) ' : ''}${isMirrored ? 'scaleX(-1) ' : ''}rotate(${rotation}deg) scale(${zoomLevel})`,
    filter: filterStyle(),
    transition: 'transform 0.22s ease-out, filter 0.2s ease'
  };

  if (activeTab === 'planos_historicos') {
    return (
      <div className="w-full relative" style={{ height: "calc(100vh - 65px)" }}>
        <HistoricalAtlas
          onSelectModule={onNavigateModule}
          extraControls={(
            <button
              onClick={() => setActiveTab('evidencias')}
              className="absolute bottom-4 right-4 z-[500] px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-mono font-bold shadow-lg hover:bg-teal-700 flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>PREGUNTA CENTRAL & EVIDENCIAS</span>
            </button>
          )}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-800 p-4 sm:p-8 lg:p-10 animate-fade-in relative">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* ========================================================================= */}
        {/* TOP SEGMENTED VIEW SWITCHER (MÓDULO 1.1)                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('planos_historicos')}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'planos_historicos'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>1.1 PLANOS HISTÓRICOS (1589–1900)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                6 Planos
              </span>
            </button>

            <button
              onClick={() => setActiveTab('evidencias')}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'evidencias'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>PREGUNTA CENTRAL & EVIDENCIAS</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 pr-3">
            <span className="font-bold text-slate-900">MÓDULO 1.1</span>
            <span>&bull;</span>
            <span className="text-teal-700 font-bold">DIAGNÓSTICO TERRITORIAL</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PLANOS HISTÓRICOS DE TIERRABOMBA Y CARTAGENA (RECUPERADOS EN 1.1) */}
        {/* ========================================================================= */}
        {activeTab === 'planos_historicos' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Description Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  CORPUS CARTOGRÁFICO HISTÓRICO
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Archivo General de Indias, Mapoteca Nacional & Depósito Francés
                </span>
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-950">
                Evolución Morfológica, Militar e Hidrográfica de Cartagena y Tierrabomba
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
                Secuencia de 6 planos históricos que documentan el rol estratégico de la <strong>Isla de Tierrabomba</strong> como cierre defensivo de la bahía interior, la apertura y cierre de canales navegables (Bocagrande vs. Bocachica) y la génesis geomorfológica que sustenta la implantación de la tesis en la <strong>meseta segura (+22.00 m.s.n.m.)</strong>.
              </p>
            </div>

            {/* Horizontal Timeline Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {HISTORICAL_MAPS_DATA.map((mapItem) => {
                const isSelected = selectedMapId === mapItem.id;
                return (
                  <button
                    key={mapItem.id}
                    onClick={() => handleSelectMap(mapItem.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                        isSelected ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mapItem.year}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold truncate">
                        {mapItem.period.split(' ')[0]}
                      </span>
                    </div>

                    <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 relative">
                      <img 
                        src={mapItem.image} 
                        alt={mapItem.shortTitle}
                        style={mapItem.flipHorizontal ? { transform: 'scaleX(-1)' } : undefined}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <p className={`font-serif text-xs font-bold truncate ${
                      isSelected ? 'text-amber-950' : 'text-slate-800'
                    }`}>
                      {mapItem.shortTitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive High-Res Canvas & Dossier Section */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* Left/Center: High-Definition Image Viewport (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col">
                
                {/* Viewport Top HUD Controls Bar */}
                <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-black text-xs">
                      {selectedHistoricalMap.year}
                    </span>
                    <span className="text-xs font-mono text-slate-300 truncate max-w-[200px] sm:max-w-[280px]">
                      {selectedHistoricalMap.shortTitle}
                    </span>
                  </div>

                  {/* Interactive Toolbar */}
                  <div className="flex items-center space-x-1 text-slate-300">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0.6, +(prev - 0.25).toFixed(2)))}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
                      title="Alejar Zoom (-)"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono px-1.5 text-slate-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(3, +(prev + 0.25).toFixed(2)))}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
                      title="Acercar Zoom (+)"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-white/20 mx-1" />

                    <button
                      onClick={() => rotateMap(-90)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
                      title="Girar -90° a la izquierda"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rotateMap(90)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 hover:text-white transition-colors"
                      title="Girar +90° a la derecha"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsMirrored(prev => !prev)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMirrored ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title="Invertir horizontalmente (Espejo)"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-white/20 mx-1" />

                    <button
                      onClick={() => setShowFullMapModal(true)}
                      className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                      title="Ver en pantalla completa con máxima resolución"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Selector Strip */}
                <div className="px-4 py-2 bg-slate-800 text-slate-300 flex items-center justify-between text-xs font-mono border-b border-slate-700">
                  <span className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filtro de Visualización:</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    {['natural', 'sepia', 'contrast', 'invert'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterMode(f)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                          filterMode === f 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-white/10 hover:bg-white/20 text-slate-300'
                        }`}
                      >
                        {f === 'natural' ? 'Color Real' : f === 'sepia' ? 'Papiro' : f === 'contrast' ? 'Alto Contraste' : 'Invertido'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Viewport Display Area */}
                <div className="relative w-full h-[460px] sm:h-[540px] bg-stone-900 flex items-center justify-center overflow-hidden p-3 select-none">
                  <img 
                    src={selectedHistoricalMap.image} 
                    alt={selectedHistoricalMap.title} 
                    style={mapTransform}
                    className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                  />

                  {/* Orientation & Scale Pill */}
                  <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[11px] font-mono flex items-center space-x-2">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedHistoricalMap.orientation}</span>
                  </div>

                  {/* Cartouche Note */}
                  {selectedHistoricalMap.cartoucheText && (
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 text-slate-200 text-xs font-serif italic text-center">
                      "{selectedHistoricalMap.cartoucheText}"
                    </div>
                  )}
                </div>

              </div>

              {/* Right: Technical Dossier & Analysis (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Technical Meta Card */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                      Año {selectedHistoricalMap.year}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {selectedHistoricalMap.period}
                    </span>
                    <span className="text-xs font-mono text-slate-500 ml-auto">
                      {selectedHistoricalMap.scale}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 leading-snug">
                    {selectedHistoricalMap.title}
                  </h3>
                  
                  <p className="text-xs font-mono text-amber-800 font-bold">
                    Autor: {selectedHistoricalMap.author}
                  </p>

                  <div className="space-y-2.5">
                    {selectedHistoricalMap.description.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Urban & Morphological Analysis Card */}
                <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-sm space-y-2.5">
                  <div className="flex items-center space-x-2 text-amber-900 font-mono text-xs font-bold uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span>Análisis Morfológico Territorial</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed text-justify">
                    {selectedHistoricalMap.urbanAnalysis}
                  </p>
                </div>

                {/* Key Features Checklist */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Hitos & Elementos Clave del Plano</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedHistoricalMap.keyFeatures.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start space-x-2 text-xs text-slate-700 font-sans leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Link to GIS Satellite Bands */}
                <button
                  onClick={() => onNavigateModule && onNavigateModule('gis')}
                  className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-teal-700 text-white font-mono text-xs font-bold flex items-center justify-between shadow-md transition-all group"
                >
                  <span className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-400 group-hover:rotate-12 transition-transform" />
                    <span>Comparar con Teledetección GIS (5 Bandas)</span>
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PREGUNTA CENTRAL & ANTECEDENTES FOTOGRÁFICOS EN SITIO             */}
        {/* ========================================================================= */}
        {activeTab === 'evidencias' && (
          <div className="space-y-8 animate-fade-in">
            
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

            {/* 3 Critical Diagnosis Pillars */}
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

                      <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

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

            {/* Banner to switch to Historical Maps */}
            <div 
              onClick={() => setActiveTab('planos_historicos')}
              className="p-5 rounded-3xl bg-amber-50 border-2 border-dashed border-amber-300 hover:border-amber-500 transition-all cursor-pointer flex items-center justify-between shadow-xs group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    ¿Quieres ver la evolución territorial en la cartografía histórica?
                  </h4>
                  <p className="text-xs font-sans text-slate-600">
                    Explora los 6 planos históricos de archivo (1589–1900) con alta resolución y análisis urbano.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-900 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Ir al Atlas Histórico</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
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
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FULLSCREEN HIGH-RES HISTORICAL MAP INSPECTION                    */}
      {/* ========================================================================= */}
      {showFullMapModal && selectedHistoricalMap && (
        <div className="fixed inset-0 z-[800] flex flex-col bg-slate-950 animate-fade-in">
          {/* Modal Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-sm">
                Año {selectedHistoricalMap.year}
              </span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedHistoricalMap.title}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedHistoricalMap.author} &bull; {selectedHistoricalMap.scale}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, +(prev - 0.25).toFixed(2)))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono px-2 text-white">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(3.5, +(prev + 0.25).toFixed(2)))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => rotateMap(90)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                title="Rotar +90°"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold ml-2"
                title="Cerrar pantalla completa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Map Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-stone-950 select-none">
            <img 
              src={selectedHistoricalMap.image} 
              alt={selectedHistoricalMap.title} 
              style={mapTransform}
              className="max-w-none transition-transform duration-200"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CARRUSEL DE FOTOGRAFÍAS DE EVIDENCIA EN SITIO                   */}
      {/* ========================================================================= */}
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

            {/* Carousel Caption & Antecedent text */}
            <div className="p-4 sm:p-6 bg-white space-y-3 max-h-[38vh] overflow-y-auto">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {activeGallery.images[currentSlideIndex].caption}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider block">
                  Antecedente Institucional & Contexto de Campo:
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
