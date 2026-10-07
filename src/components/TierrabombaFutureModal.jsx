import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  ShieldAlert, 
  Droplets, 
  Compass, 
  TreePine, 
  Home, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Layers, 
  Wind, 
  Sun, 
  Users, 
  FileText, 
  Activity, 
  Download,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  Anchor
} from 'lucide-react';

export const FUTURE_TIERRABOMBA_SLIDES = [
  // LÁMINA 1
  {
    id: 1,
    number: "LÁMINA 01",
    tag: "VISIÓN ESTRATÉGICA TERRITORIAL",
    title: "Horizonte de Desarrollo para la Isla de Tierrabomba: Parque Ecológico y Cultural",
    subtitle: "Rechazo fundamentado al modelo portuario del POT y declaratoria de Reserva Natural, Balneario & Patrimonio",
    themeColor: "#059669",
    posture: {
      rejection: "Rechazo fundamentado a la propuesta del POT de convertir la isla en un 'centro de intercambio logístico'. Tierrabomba no cuenta con la infraestructura ni con las condiciones hidrográficas o marítimas para albergar actividades de puerto industrial.",
      definition: "Definición de Tierrabomba como una reserva natural, balneario y parque ecológico-cultural enfocado en el ecoturismo sostenible, la soberanía ambiental y la protección patrimonial."
    },
    vocations: [
      {
        icon: TreePine,
        title: "Ecoturismo y Senderismo",
        desc: "Aprovechamiento de senderos ecológicos en la meseta central y recorridos ambientales para visitantes de bajo impacto."
      },
      {
        icon: Landmark,
        title: "Patrimonio Histórico",
        desc: "Puesta en valor y restauración del sistema defensivo colonial de la bahía (Fuerte de San Fernando y Batería de San Luis)."
      },
      {
        icon: Anchor,
        title: "Restauración Ambiental",
        desc: "Protección y reforestación del bosque de manglar como barrera biológica contra la erosión costera y el oleaje de buques."
      }
    ],
    diagramType: "mapVision"
  },

  // LÁMINA 2
  {
    id: 2,
    number: "LÁMINA 02",
    tag: "DIAGNÓSTICO TERRITORIAL & COMUNIDAD",
    title: "Condicionantes Territoriales y Comunidad Raizal",
    subtitle: "Matriz DOFA y defensa de la permanencia de los pobladores nativos frente al riesgo de gentrificación",
    themeColor: "#0284c7",
    swot: {
      debilidad: "Inexistencia de red de alcantarillado, alta precariedad del espacio público y Necesidades Básicas Insatisfechas (NBI) críticas en los 4 poblados.",
      oportunidad: "Extensas porciones de suelo seguro en la meseta central (+22m), captación pluvial masiva y desarrollo de energías renovables.",
      fortaleza: "Riqueza paisajística, biodiversidad insular y frente costero con rol estratégico de protección a la bahía interna de Cartagena.",
      amenaza: "Erosión marina acelerada (hasta 1.8 m/año), presión inmobiliaria especulativa y riesgo de desplazamiento forzado por turismo masivo."
    },
    anthropologicalDimension: {
      title: "Dimensión Antropológica y Cultural",
      desc: "Reconocimiento de los títulos colectivos preexistentes y derechos de las comunidades raizales. La propuesta prioriza la cualificación y permanencia de los pobladores nativos en su territorio ancestral frente a cualquier modelo de expulsión."
    },
    diagramType: "swotMatrix"
  },

  // LÁMINA 3
  {
    id: 3,
    number: "LÁMINA 03",
    tag: "SERVICIOS PÚBLICOS & CAPACIDAD DE CARGA",
    title: "Capacidad de Carga y Factibilidad de Servicios Básicos",
    subtitle: "Sustento técnico del acueducto insular y límite de crecimiento demográfico",
    themeColor: "#0d9488",
    waterSystemTechnical: {
      title: "Sustento Técnico del Acueducto",
      desc: "El proyecto de acueducto contempla la compra de lotes para tanques de almacenamiento en la meseta que abastecerán a Tierrabomba, Boca Chica y Caño del Oro con una dotación mínima de 50 litros por persona al día.",
      targetPop: "Población Objetivo: Diseñado estrictamente para atender a los 10.000 habitantes actuales de la isla (Cartagena Cómo Vamos).",
      formula: "50 L/hab/día × 10.000 habitantes = 500.000 L/día (0.50 Megalitros/día)"
    },
    strategicConclusion: {
      title: "Conclusión Estratégica",
      desc: "La capacidad de agua demuestra que la isla no admite sobrepoblación ni crecimiento urbano desmedido, justificando la decisión de consolidar y blindar únicamente a la población existente."
    },
    diagramType: "waterBalance"
  },

  // LÁMINA 4
  {
    id: 4,
    number: "LÁMINA 04",
    tag: "MODELO URBANO POLICÉNTRICO",
    title: "Estructura Urbana Policéntrica y Equipamientos Colectivos",
    subtitle: "Red interconectada de asentamientos y nodo intermedio central de equipamientos en la meseta",
    themeColor: "#d97706",
    settlements: [
      { name: "Tierrabomba", role: "Nodo Cívico & Administrativo", time: "0 - 10 min", icon: "🏛️" },
      { name: "Boca Chica", role: "Nodo Histórico & Marítimo", time: "10 min moto / 25 min bici", icon: "🏰" },
      { name: "Caño del Oro", role: "Nodo Memoria & Agro-pesca", time: "10 min moto / 20 min bici", icon: "🌾" },
      { name: "Punta Arena", role: "Nodo Balneario & Playa", time: "8 min moto / 18 min bici", icon: "🏖️" }
    ],
    connectivity: {
      title: "Tiempos de Conectividad & Nodo Intermedio",
      desc: "La distancia entre asentamientos permite desplazamientos rápidos: 10 minutos en moto y 25 minutos en bicicleta. En lugar de saturar cada sector con proyectos aislados, se propone una red interconectada con un nodo intermedio de equipamientos colectivos en el centro de la isla para dar cobertura eficiente a todos los poblados."
    },
    diagramType: "isochrones"
  },

  // LÁMINA 5
  {
    id: 5,
    number: "LÁMINA 05",
    tag: "TRAZADO URBANO & TOPOGRAFÍA",
    title: "Implantación Urbana e Integración Paisajística",
    subtitle: "Adaptación estricta a curvas de nivel, corredores ecológicos meseta-mar y articulación urbana",
    themeColor: "#16a34a",
    urbanCriteria: [
      {
        num: "01",
        title: "Adaptación a la Topografía",
        desc: "Continuación de la trama vial existente adaptándose estrictamente a las curvas de nivel de la meseta (+22m a +30m) para evitar cortes agresivos en el terreno."
      },
      {
        num: "02",
        title: "Corredores Ecológicos",
        desc: "Trazado de ejes ambientales perpendiculares a las vías que conectan el bosque denso de la meseta central con el mar Caribe y la bahía."
      },
      {
        num: "03",
        title: "Articulación Urbana",
        desc: "Conexión de la zona de expansión con el casco consolidado, tomando como hito ordenador la plaza principal, la iglesia y el colegio preexistente."
      }
    ],
    diagramType: "topographyCorridors"
  },

  // LÁMINA 6
  {
    id: 6,
    number: "LÁMINA 06",
    tag: "CENSO & DIAGNÓSTICO MIDAS",
    title: "Censo y Criterios para la Reubicación de Vivienda en Riesgo",
    subtitle: "Cruce técnico de cota de socavación marina con ortofotografía aérea y predios catastrales MIDAS",
    themeColor: "#dc2626",
    censusData: {
      tb: "Asentamiento Tierrabomba: 800 familias (~3.400 personas)",
      bc: "Boca Chica: ~6.000 personas",
      totalInsular: "Total Población Isla: ~10.000 habitantes"
    },
    methodology: {
      title: "Metodología de Identificación de Riesgo",
      desc: "Se descarta la reubicación total de la isla; el proyecto se enfoca únicamente en las viviendas expuestas a la erosión e inundación.",
      cross: "Cruce Técnico: Selección de predios mediante el cruce de la cota de inundación con fotografía aérea y la consulta de los códigos de identificación catastral en el sistema MIDAS de Cartagena.",
      localization: "Criterio de Localización: La nueva vivienda se implanta contigua al núcleo urbano consolidado para preservar las redes de parentesco y evitar el desarraigo de la comunidad."
    },
    diagramType: "midasCensus"
  },

  // LÁMINA 7
  {
    id: 7,
    number: "LÁMINA 07",
    tag: "PROTOTIPO DE VIVIENDA // HÁBITAT EVOLUTIVO",
    title: "Tipología de Vivienda Progresiva y Crecimiento Progresivo",
    subtitle: "Hábitat evolutivo modular, autoconstruible y adaptable en 3 etapas de consolidación",
    themeColor: "#ea580c",
    phases: [
      {
        stage: "Fase 1: Módulo Base",
        area: "54 m²",
        occupants: "4 - 5 personas",
        elements: "Estructura palafítica (+0.60m), 2 habitaciones, porche de sombra frontal, cocina, baño de bajo consumo y tanque pluvial 2.500 L."
      },
      {
        stage: "Fase 2: Crecimiento Productivo",
        area: "72 m²",
        occupants: "5 - 7 personas",
        elements: "Ampliación lateral para taller de redes de pesca, huerto o 3ª habitación y patio interior de convección térmica."
      },
      {
        stage: "Fase 3: Consolidación & Altillo",
        area: "86 m²",
        occupants: "6 - 8 personas",
        elements: "Consolidación de altillo habitable bajo cubierta a dos aguas y paneles solares fotovoltaicos para 100% de autonomía."
      }
    ],
    technicalFocus: "Diseño que prevé la consolidación progresiva tanto de las unidades habitacionales como de las redes de infraestructura técnica por autoconstrucción comunitaria guiada.",
    diagramType: "progressiveHousing"
  },

  // LÁMINA 8
  {
    id: 8,
    number: "LÁMINA 08",
    tag: "MODELO DE OCUPACIÓN // PATIOS COMUNALES",
    title: "Modelo de Ocupación Urbano-Arquitectónico: Patios Comunales",
    subtitle: "Manzana residencial con patio central para integración raizal, animales de corral y bioclimática pasiva",
    themeColor: "#8b5cf6",
    spatialStructure: {
      title: "Estructura Espacial del Conjunto",
      desc: "Rechazo explícito a la agrupación en hileras de casas sueltas o desarrollos sin espacio público estructurado. Se dispone la manzana de viviendas rodeando un patio o plaza comunal centro-manzana."
    },
    localCustoms: {
      title: "Respuesta a las Costumbres Locales",
      desc: "El patio comunal actúa como espacio de integración social y convivencia de la comunidad raizal, apto para la permanencia de animales de corral (chivos, cerdos, caballos) característicos de la vida en la isla."
    },
    bioclimaticComfort: {
      title: "Confort Bioclimático Pasivo",
      desc: "Espacio central que favorece la captura de brisas marinas N-NE y garantiza la ventilación cruzada continua en todas las unidades, con una reducción térmica de hasta 5°C."
    },
    diagramType: "communalCourtyard"
  }
];

export default function TierrabombaFutureModal({ isOpen, onClose }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex(prev => (prev + 1) % FUTURE_TIERRABOMBA_SLIDES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => (prev - 1 + FUTURE_TIERRABOMBA_SLIDES.length) % FUTURE_TIERRABOMBA_SLIDES.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = FUTURE_TIERRABOMBA_SLIDES[currentSlideIndex];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in select-none">
      
      {/* Slide Container Card */}
      <div 
        className={`bg-slate-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[94vh] h-[850px]'
        }`}
      >
        
        {/* Top Slide Navigation Bar */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          
          {/* Left Title & Index */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-xs font-mono flex items-center justify-center shadow-md shrink-0">
              {currentSlide.id.toString().padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  {currentSlide.tag}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Lámina {currentSlideIndex + 1} de {FUTURE_TIERRABOMBA_SLIDES.length}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide truncate">
                El Futuro de Tierrabomba // Plan Maestro 2026-2036
              </h2>
            </div>
          </div>

          {/* Center: Slide Indicators */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {FUTURE_TIERRABOMBA_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx 
                    ? 'w-8 bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`${slide.number}: ${slide.title}`}
              />
            ))}
          </div>

          {/* Right Controls (Prev, Next, Fullscreen, Close) */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setCurrentSlideIndex(prev => (prev - 1 + FUTURE_TIERRABOMBA_SLIDES.length) % FUTURE_TIERRABOMBA_SLIDES.length)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1 text-xs font-mono"
              title="Lámina anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % FUTURE_TIERRABOMBA_SLIDES.length)}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center space-x-1 text-xs font-mono font-bold shadow-md"
              title="Siguiente lámina (Flecha Derecha)"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/20 mx-1" />

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
              title="Cerrar presentación (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Slide Content Area (Scrollable if needed, beautifully formatted) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-100 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* Slide Header */}
          <div className="border-b border-white/10 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span 
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm inline-flex items-center gap-1.5"
                style={{ backgroundColor: `${currentSlide.themeColor}cc` }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.number} &bull; {currentSlide.tag}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Postulado Académico &bull; Tesis de Arquitectura y Urbanismo 2026
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-black text-white mt-3 leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-sans mt-1.5 font-light">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Slide Specific Interactive Diagram & Content Layout */}
          
          {/* ========================================================================= */}
          {/* SLIDE 1: VISIÓN ESTRATÉGICA PARQUE ECOLÓGICO                             */}
          {/* ========================================================================= */}
          {currentSlide.id === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Posture and 3 Vocations */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Postura de Rechazo al POT y Afirmación */}
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-400 uppercase">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Postura Crítica frente al POT: Rechazo al Puerto Industrial</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.posture.rejection}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Definición Oficial: Parque Ecológico, Cultural & Balneario</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                    {currentSlide.posture.definition}
                  </p>
                </div>

                {/* 3 Vocaciones */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    3 Vocaciones Territoriales Principales:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {currentSlide.vocations.map((voc, i) => {
                      const Icon = voc.icon;
                      return (
                        <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 hover:bg-white/10 transition-colors">
                          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-xs text-white">{voc.title}</h4>
                          <p className="text-[11px] text-slate-300 leading-tight font-sans">{voc.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Vector Diagram of the Island */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-emerald-400" />
                    Esquema Territorial: Reserva Natural & Circuitos
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Meseta +22.00m
                  </span>
                </div>

                {/* Vector Island Map Graphic */}
                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  
                  {/* Sea Ripple Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* SVG Simplified Island Shape with Zoning */}
                  <svg viewBox="0 0 400 300" className="w-full h-full max-h-full">
                    {/* Water Frame */}
                    <rect width="400" height="300" fill="#0f172a" />
                    
                    {/* Island Outline */}
                    <path 
                      d="M 120 40 C 180 30, 240 50, 280 90 C 310 130, 320 200, 280 250 C 240 280, 160 270, 110 230 C 70 190, 80 100, 120 40 Z" 
                      fill="#1e293b" 
                      stroke="#334155" 
                      strokeWidth="2" 
                    />

                    {/* Central Forest Nature Reserve (Green Hatching) */}
                    <path 
                      d="M 150 90 C 200 80, 240 100, 250 150 C 260 200, 200 220, 160 190 C 130 160, 130 110, 150 90 Z" 
                      fill="#059669" 
                      fillOpacity="0.4"
                      stroke="#10b981" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* Mangrove Buffer Strip (Coastal Protection) */}
                    <path 
                      d="M 105 130 Q 95 180 120 230" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />

                    {/* Historic Defensive Forts Markers */}
                    {/* Fort San Fernando (Boca Chica) */}
                    <g transform="translate(265, 235)">
                      <circle r="9" fill="#e11d48" className="animate-ping opacity-75" />
                      <circle r="7" fill="#be123c" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="12" y="4" fill="#fecdd3" fontSize="9" fontFamily="monospace" fontWeight="bold">Fuerte San Fernando</text>
                    </g>

                    {/* Battery San Luis */}
                    <g transform="translate(290, 140)">
                      <circle r="6" fill="#be123c" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="10" y="3" fill="#fecdd3" fontSize="8" fontFamily="monospace">Batería San Luis</text>
                    </g>

                    {/* Settlements */}
                    <g transform="translate(130, 60)">
                      <circle r="5" fill="#f59e0b" />
                      <text x="8" y="3" fill="#fde68a" fontSize="8" fontFamily="monospace">Punta Arena</text>
                    </g>
                    <g transform="translate(160, 130)">
                      <rect x="-4" y="-4" width="8" height="8" fill="#24c8bd" transform="rotate(45)" />
                      <text x="10" y="3" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">Nodo Meseta Segura (+22m)</text>
                    </g>
                    <g transform="translate(100, 180)">
                      <circle r="5" fill="#f59e0b" />
                      <text x="-65" y="3" fill="#fde68a" fontSize="8" fontFamily="monospace">Caño del Oro</text>
                    </g>
                    <g transform="translate(140, 245)">
                      <circle r="5" fill="#f59e0b" />
                      <text x="8" y="4" fill="#fde68a" fontSize="8" fontFamily="monospace">Poblado Tierrabomba</text>
                    </g>

                    {/* Ecological Trail Arrows */}
                    <path 
                      d="M 160 130 L 220 160 L 265 235" 
                      fill="none" 
                      stroke="#a7f3d0" 
                      strokeWidth="2" 
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    🌿 Reserva Natural (Meseta)
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    🏰 Fortificaciones Coloniales
                  </div>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                    🌊 Manglar Barrera Oleaje
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 2: CONDICIONANTES TERRITORIALES & MATRIZ DOFA                       */}
          {/* ========================================================================= */}
          {currentSlide.id === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 4-Quadrant SWOT Matrix */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Matriz DOFA Territorial & Comunitaria:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Debilidad */}
                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      DEBILIDAD / RESTRICCIÓN
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {currentSlide.swot.debilidad}
                    </p>
                  </div>

                  {/* Oportunidad */}
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      OPORTUNIDAD
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {currentSlide.swot.oportunidad}
                    </p>
                  </div>

                  {/* Fortaleza */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      FORTALEZA
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {currentSlide.swot.fortaleza}
                    </p>
                  </div>

                  {/* Amenaza */}
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      AMENAZA
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {currentSlide.swot.amenaza}
                    </p>
                  </div>

                </div>
              </div>

              {/* Right Column: Antropological Dimension & Raizal Community */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950 border border-blue-500/30 space-y-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Comunidad Ancestral</span>
                    <h3 className="font-bold text-sm text-white">{currentSlide.anthropologicalDimension.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentSlide.anthropologicalDimension.desc}
                </p>

                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-400/20 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-blue-300">
                    🛡️ Principio de Arraigo Insular:
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 font-sans">
                    <li>&bull; Respeto irrestricto al Consejo Comunitario de Tierrabomba.</li>
                    <li>&bull; Prohibición de desarraigo o traslados al continente.</li>
                    <li>&bull; Espacio público adaptado a las dinámicas pesqueras y de cría tradicional.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 3: CAPACIDAD DE CARGA & ACUEDUCTO (50 L/hab/día x 10.000 hab)       */}
          {/* ========================================================================= */}
          {currentSlide.id === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Water Demand Balance & Technical Formula */}
              <div className="lg:col-span-6 space-y-4">
                
                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" />
                    {currentSlide.waterSystemTechnical.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.waterSystemTechnical.desc}
                  </p>
                  <div className="p-2.5 rounded-xl bg-teal-900/40 border border-teal-400/30 text-teal-200 font-mono text-xs font-bold">
                    {currentSlide.waterSystemTechnical.targetPop}
                  </div>
                </div>

                {/* Mathematical Balance Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                    Cálculo de Demanda Hídrica Insular Diaria:
                  </span>
                  <div className="text-lg md:text-xl font-mono font-black text-white bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                    50 L/hab/día &times; 10.000 hab = <span className="text-cyan-400">500.000 L/día</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono text-center">
                    (0.50 Megalitros diarios de capacidad de diseño para los 3 tanques en meseta)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {currentSlide.strategicConclusion.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.strategicConclusion.desc}
                  </p>
                </div>

              </div>

              {/* Right Column: Hydraulic Flow Diagram */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block">
                  Esquema Hidráulico & Capacidad de Carga:
                </span>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center shrink-0">1</div>
                    <div className="text-xs">
                      <div className="font-bold text-white">Captación Pluvial Dual (Macro y Micro)</div>
                      <div className="text-slate-400 text-[11px]">Cubiertas de equipamientos + 120 viviendas</div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">2</div>
                    <div className="text-xs">
                      <div className="font-bold text-white">Tanques de Almacenamiento en Meseta (+22m)</div>
                      <div className="text-slate-400 text-[11px]">Tierrabomba, Boca Chica y Caño del Oro</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">3</div>
                    <div className="text-xs">
                      <div className="font-bold text-white">Distribución Gravitacional sin Bombeo Térmico</div>
                      <div className="text-slate-400 text-[11px]">Suministro constante a cota de seguridad</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 4: MODELO POLICÉNTRICO & ISÓCRONAS                                 */}
          {/* ========================================================================= */}
          {currentSlide.id === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 4 Settlements and Roles */}
              <div className="lg:col-span-6 space-y-4">
                
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Asignación de Roles por Poblado:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentSlide.settlements.map((set, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{set.icon}</span>
                          <span>{set.name}</span>
                        </span>
                      </div>
                      <div className="text-xs text-amber-300 font-mono font-medium">{set.role}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{set.time}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {currentSlide.connectivity.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.connectivity.desc}
                  </p>
                </div>

              </div>

              {/* Right Column: Isochrones Radial Scheme */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Mapa de Isócronas desde el Nodo Central:
                </span>

                {/* Vector Isochrone Radar */}
                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <svg viewBox="0 0 360 260" className="w-full h-full">
                    {/* Concentric Rings */}
                    <circle cx="180" cy="130" r="110" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                    <circle cx="180" cy="130" r="75" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                    <circle cx="180" cy="130" r="40" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 5" opacity="0.8" />

                    {/* Ring Labels */}
                    <text x="180" y="45" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">25 MIN BICI (Radio Máximo)</text>
                    <text x="180" y="80" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">10 MIN MOTO</text>

                    {/* Center Hub */}
                    <g transform="translate(180, 130)">
                      <circle r="14" fill="#d97706" className="animate-pulse" />
                      <circle r="8" fill="#ffffff" />
                      <text x="0" y="24" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODO CENTRAL</text>
                    </g>

                    {/* Connected Nodes */}
                    {/* Punta Arena (North) */}
                    <line x1="180" y1="130" x2="180" y2="40" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="180" cy="40" r="6" fill="#f59e0b" />
                    <text x="190" y="43" fill="#fde68a" fontSize="8" fontFamily="monospace">Punta Arena</text>

                    {/* Boca Chica (South-East) */}
                    <line x1="180" y1="130" x2="270" y2="200" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="270" cy="200" r="6" fill="#f59e0b" />
                    <text x="278" y="203" fill="#fde68a" fontSize="8" fontFamily="monospace">Boca Chica</text>

                    {/* Caño del Oro (West) */}
                    <line x1="180" y1="130" x2="80" y2="150" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="80" cy="150" r="6" fill="#f59e0b" />
                    <text x="25" y="153" fill="#fde68a" fontSize="8" fontFamily="monospace">Caño del Oro</text>

                    {/* Tierrabomba (South) */}
                    <line x1="180" y1="130" x2="160" y2="225" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="160" cy="225" r="6" fill="#f59e0b" />
                    <text x="110" y="240" fill="#fde68a" fontSize="8" fontFamily="monospace">Tierrabomba</text>
                  </svg>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 text-center">
                  ⏱️ Cobertura universal de salud, educación y acopio a menos de 25 min en bicicleta.
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 5: TRAZADO URBANO, TOPOGRAFÍA & CORREDORES ECOLÓGICOS               */}
          {/* ========================================================================= */}
          {currentSlide.id === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 3 Urban Criteria */}
              <div className="lg:col-span-6 space-y-3.5">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  3 Criterios Rectores de Diseño Urbano:
                </span>

                {currentSlide.urbanCriteria.map((crit) => (
                  <div key={crit.num} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                        {crit.num}
                      </span>
                      <h3 className="font-bold text-sm text-white">{crit.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans pl-8">
                      {crit.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column: Topographic Corridors Graphic */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  Sección & Plano: Curvas de Nivel y Corredores Meseta-Mar:
                </span>

                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <svg viewBox="0 0 360 240" className="w-full h-full">
                    {/* Contour Lines */}
                    <path d="M 20 60 Q 180 30 340 70" fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.4" />
                    <text x="30" y="55" fill="#10b981" fontSize="7" fontFamily="monospace">+28.00m</text>

                    <path d="M 20 100 Q 180 70 340 110" fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.6" />
                    <text x="30" y="95" fill="#10b981" fontSize="7" fontFamily="monospace">+25.00m</text>

                    <path d="M 20 140 Q 180 110 340 150" fill="none" stroke="#059669" strokeWidth="2" opacity="0.9" />
                    <text x="30" y="135" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">+22.00m (COTA SEGURA MESETA)</text>

                    <path d="M 20 180 Q 180 150 340 190" fill="none" stroke="#059669" strokeWidth="1" opacity="0.3" />
                    <text x="30" y="175" fill="#10b981" fontSize="7" fontFamily="monospace">+10.00m</text>

                    {/* Urban Parcels adapted to contours */}
                    <rect x="100" y="115" width="40" height="20" rx="3" fill="#334155" stroke="#64748b" />
                    <rect x="150" y="110" width="40" height="20" rx="3" fill="#334155" stroke="#64748b" />
                    <rect x="200" y="118" width="40" height="20" rx="3" fill="#334155" stroke="#64748b" />

                    {/* Ecological Corridors (Green Downward Arrows from Plateau to Sea) */}
                    <path d="M 70 40 L 70 210" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="6 4" />
                    <polygon points="70,220 65,208 75,208" fill="#10b981" />
                    <text x="80" y="170" fill="#a7f3d0" fontSize="7" fontFamily="monospace" transform="rotate(90, 80, 170)">Corredor Ambiental A</text>

                    <path d="M 270 40 L 270 210" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="6 4" />
                    <polygon points="270,220 265,208 275,208" fill="#10b981" />
                    <text x="280" y="170" fill="#a7f3d0" fontSize="7" fontFamily="monospace" transform="rotate(90, 280, 170)">Corredor Ambiental B</text>

                    {/* Sea */}
                    <rect x="0" y="215" width="360" height="25" fill="#0284c7" opacity="0.6" />
                    <text x="180" y="232" fill="#e0f2fe" fontSize="8" fontFamily="monospace" textAnchor="middle">MAR CARIBE & BAHÍA DE CARTAGENA</text>
                  </svg>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 text-center">
                  🌱 Cero cortes agresivos de terreno // Drenaje natural por gravedad y sombra continua.
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 6: CENSO MIDAS & REUBICACIÓN EN RIESGO                              */}
          {/* ========================================================================= */}
          {currentSlide.id === 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Figures and Methodology */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Census Metrics */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Tierrabomba Casco</span>
                    <span className="text-base font-bold text-white block">800 Familias</span>
                    <span className="text-[11px] text-slate-300 font-mono block">~3.400 personas</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Boca Chica</span>
                    <span className="text-base font-bold text-white block">~6.000 Personas</span>
                    <span className="text-[11px] text-slate-300 font-mono block">Total isla: ~10.000 hab</span>
                  </div>
                </div>

                {/* Methodology */}
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    {currentSlide.methodology.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.methodology.desc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    Cruce Técnico Catastral MIDAS:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.methodology.cross}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium pt-1">
                    {currentSlide.methodology.localization}
                  </p>
                </div>

              </div>

              {/* Right Column: Coastal Erosion & MIDAS Map Graphic */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
                  Cruce de Cota de Socavación & Códigos MIDAS:
                </span>

                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <svg viewBox="0 0 360 240" className="w-full h-full">
                    {/* Aerial Texture Background Mock */}
                    <rect width="360" height="240" fill="#1e293b" />
                    
                    {/* Coastline with Erosion Zone (Red Strip) */}
                    <path d="M 0 160 Q 180 130 360 170 L 360 240 L 0 240 Z" fill="#0284c7" opacity="0.4" />
                    
                    {/* Active Marine Erosion Buffer */}
                    <path d="M 0 140 Q 180 110 360 150 L 360 170 Q 180 130 0 160 Z" fill="#dc2626" opacity="0.6" />
                    <text x="180" y="150" fill="#fecaca" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      FRANJA DE SOCAVACIÓN CRÍTICA (1.8 m/año)
                    </text>

                    {/* Houses in Danger (Red Squares with MIDAS codes) */}
                    <g transform="translate(60, 130)">
                      <rect width="14" height="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="7" y="10" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">#01</text>
                    </g>
                    <g transform="translate(90, 125)">
                      <rect width="14" height="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="7" y="10" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">#02</text>
                    </g>
                    <g transform="translate(140, 115)">
                      <rect width="14" height="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="7" y="10" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">#03</text>
                    </g>
                    <g transform="translate(180, 110)">
                      <rect width="14" height="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="7" y="10" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">#04</text>
                    </g>
                    <g transform="translate(240, 120)">
                      <rect width="14" height="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="7" y="10" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">#05</text>
                    </g>

                    {/* Safe Relocation on Plateau (+22m Green Zone) */}
                    <rect x="40" y="30" width="280" height="50" rx="6" fill="#059669" opacity="0.3" stroke="#10b981" strokeDasharray="3 3" />
                    <text x="180" y="48" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      NUEVO ASENTAMIENTO MESETA SEGURA (+22.00m)
                    </text>
                    <text x="180" y="65" fill="#a7f3d0" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      120 Viviendas Reubicadas &bull; Contiguo al casco urbano
                    </text>

                    {/* Transfer Arrows */}
                    <path d="M 70 120 L 70 85" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                    <path d="M 185 105 L 185 85" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                    <path d="M 250 115 L 250 85" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                  </svg>
                </div>

                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-300 text-center">
                  🎯 Reubicación precisa 1:1 de 120 hogares críticos sin desarraigo cultural.
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 7: PROTOTIPO DE VIVIENDA // HÁBITAT EVOLUTIVO                      */}
          {/* ========================================================================= */}
          {currentSlide.id === 7 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 3 Progressive Phases */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                  3 Fases de Crecimiento Progresivo:
                </span>

                {currentSlide.phases.map((ph, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-orange-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{ph.stage}</span>
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                          {ph.area}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ph.occupants}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {ph.elements}
                    </p>
                  </div>
                ))}

                <p className="text-xs text-slate-400 italic pt-1">
                  {currentSlide.technicalFocus}
                </p>
              </div>

              {/* Right Column: Axonometric / Section Diagram of Progressive Stages */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                  Axonometría Evolutiva de la Vivienda:
                </span>

                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <svg viewBox="0 0 320 220" className="w-full h-full">
                    {/* Ground and Stilts (+0.60m) */}
                    <line x1="20" y1="180" x2="300" y2="180" stroke="#78350f" strokeWidth="3" />
                    <text x="20" y="195" fill="#a16207" fontSize="7" fontFamily="monospace">Terreno Natural</text>

                    {/* Stilts */}
                    <line x1="60" y1="180" x2="60" y2="150" stroke="#b45309" strokeWidth="4" />
                    <line x1="120" y1="180" x2="120" y2="150" stroke="#b45309" strokeWidth="4" />
                    <line x1="180" y1="180" x2="180" y2="150" stroke="#b45309" strokeWidth="4" />
                    <line x1="240" y1="180" x2="240" y2="150" stroke="#b45309" strokeWidth="4" />

                    {/* Platform Level +0.60m */}
                    <rect x="40" y="145" width="220" height="6" fill="#d97706" />
                    <text x="270" y="150" fill="#fcd34d" fontSize="7" fontFamily="monospace">+0.60m</text>

                    {/* Module 1: Base Familiar (Solid) */}
                    <rect x="50" y="85" width="80" height="60" fill="#0284c7" opacity="0.7" stroke="#ffffff" />
                    <text x="90" y="115" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Fase 1 (54m²)</text>

                    {/* Module 2: Lateral Extension (Dotted) */}
                    <rect x="130" y="85" width="60" height="60" fill="#10b981" opacity="0.5" stroke="#34d399" strokeDasharray="3 3" />
                    <text x="160" y="115" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">+Fase 2 (72m²)</text>

                    {/* Module 3: Attic Top Floor (Orange Dotted) */}
                    <polygon points="50,85 120,40 190,85" fill="#ea580c" opacity="0.6" stroke="#fb923c" strokeDasharray="3 3" />
                    <text x="120" y="70" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">+Altillo Fase 3 (86m²)</text>

                    {/* Porch Shading Overhang */}
                    <line x1="30" y1="85" x2="210" y2="85" stroke="#f59e0b" strokeWidth="3" />
                    <text x="35" y="78" fill="#fde68a" fontSize="7" fontFamily="monospace">Alero 2.5m Sombra</text>
                  </svg>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-300 text-center">
                  🔨 Madera tratada, BTC y modulación 1.20m para autoconstrucción progresiva.
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE 8: MODELO DE OCUPACIÓN // PATIOS COMUNALES                          */}
          {/* ========================================================================= */}
          {currentSlide.id === 8 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Spatial Structure & Raizal Animal Rearing */}
              <div className="lg:col-span-6 space-y-3.5">
                
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                    {currentSlide.spatialStructure.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.spatialStructure.desc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {currentSlide.localCustoms.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.localCustoms.desc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Wind className="w-4 h-4" />
                    {currentSlide.bioclimaticComfort.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentSlide.bioclimaticComfort.desc}
                  </p>
                </div>

              </div>

              {/* Right Column: Courtyard Block Plan & Cross-Ventilation */}
              <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  Planta de Manzana con Patio Comunal Central:
                </span>

                <div className="relative h-64 md:h-72 w-full bg-slate-900/90 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <svg viewBox="0 0 320 240" className="w-full h-full">
                    {/* Outer Block Frame */}
                    <rect x="30" y="20" width="260" height="200" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                    {/* Central Communal Courtyard / Plaza */}
                    <rect x="90" y="60" width="140" height="120" rx="12" fill="#065f46" opacity="0.4" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                    
                    {/* Trees in Courtyard */}
                    <circle cx="120" cy="90" r="10" fill="#059669" />
                    <circle cx="200" cy="90" r="12" fill="#059669" />
                    <circle cx="160" cy="140" r="14" fill="#059669" />
                    
                    <text x="160" y="115" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      PATIO COMUNAL
                    </text>
                    <text x="160" y="127" fill="#6ee7b7" fontSize="7" fontFamily="monospace" textAnchor="middle">
                      Animales de corral / Convivencia raizal
                    </text>

                    {/* Surrounding Residential Units */}
                    {/* Top Row Houses */}
                    <rect x="40" y="25" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="90" y="25" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="140" y="25" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="190" y="25" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="240" y="25" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />

                    {/* Bottom Row Houses */}
                    <rect x="40" y="185" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="90" y="185" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="140" y="185" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="190" y="185" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="240" y="185" width="45" height="30" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />

                    {/* Left & Right Houses */}
                    <rect x="35" y="60" width="45" height="40" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="35" y="105" width="45" height="40" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="35" y="145" width="45" height="35" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />

                    <rect x="240" y="60" width="45" height="40" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="240" y="105" width="45" height="40" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                    <rect x="240" y="145" width="45" height="35" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />

                    {/* Wind Alisios Arrows (N-NE Crossing) */}
                    <path d="M 290 15 L 20 220" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.8" />
                    <text x="240" y="12" fill="#7dd3fc" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      BRISAS ALISIOS N-NE
                    </text>
                  </svg>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 text-center">
                  💨 Ventilación cruzada continua // Patios de sombra comunales para animales y vida vecinal.
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Bottom Slide Footer Navigation Bar */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span>Usa las teclas <b>&larr;</b> y <b>&rarr;</b> para navegar</span>
            <span className="text-slate-600">|</span>
            <span><b>Esc</b> para cerrar</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">
              {currentSlide.number} / {FUTURE_TIERRABOMBA_SLIDES.length}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
