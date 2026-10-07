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
  Anchor,
  Bike,
  Building2,
  Check,
  Calendar,
  Layers2,
  ExternalLink,
  Info,
  FileImage,
  Layers as LayersIcon
} from 'lucide-react';

// Import real project architectural drawings, maps, and spectral satellite analyses
import bocetoViviendaImg from '../assets/boceto_vivienda_corte.png';
import bocetoColegioImg from '../assets/boceto_colegio_corte.png';
import calcoCotasImg from '../assets/calco_cotas.png';
import calqueTbImg from '../assets/calque_tierrabomba.png';
import spectralManglarImg from '../assets/spectral_manglar.png';
import spectralNdviImg from '../assets/spectral_ndvi.png';
import mapDefensivoImg from '../assets/maps/historical/map_1780_defensivo_manga.jpg';
import mapPearsonImg from '../assets/maps/historical/map_1915_pearson_puerto.jpg';

export const FUTURE_TIERRABOMBA_SLIDES = [
  // LÁMINA 1
  {
    id: 1,
    number: "LÁMINA 01",
    tag: "VISIÓN ESTRATÉGICA TERRITORIAL",
    title: "Horizonte de Desarrollo para la Isla de Tierrabomba: Parque Ecológico y Cultural",
    subtitle: "Rechazo fundamentado al modelo portuario del POT y declaratoria de Reserva Natural, Balneario & Patrimonio",
    category: "Visión & Vocaciones",
    themeColor: "#15803d",
    posture: {
      rejectionTitle: "Postura Crítica: Rechazo al Puerto Industrial del POT",
      rejection: "Rechazo fundamentado a la propuesta del POT de convertir la isla en un 'centro de intercambio logístico'. Tierrabomba no cuenta con la infraestructura ni con las condiciones hidrográficas o marítimas para albergar actividades de puerto industrial.",
      definitionTitle: "Propuesta de Tesis: Reserva Natural, Balneario & Cultura",
      definition: "Definición de Tierrabomba como una reserva natural, balneario y parque ecológico-cultural enfocado en el ecoturismo sostenible, la soberanía ambiental y la protección patrimonial de sus comunidades ancestrales."
    },
    vocations: [
      {
        icon: TreePine,
        title: "Ecoturismo y Senderismo",
        desc: "Aprovechamiento de senderos ecológicos en la meseta central y recorridos ambientales para visitantes de bajo impacto.",
        refName: "Análisis Satelital del Bosque & Manglar de Tierrabomba",
        refImg: spectralManglarImg,
        isAsset: true
      },
      {
        icon: Landmark,
        title: "Patrimonio Histórico",
        desc: "Puesta en valor y restauración del sistema defensivo colonial de la bahía (Fuerte de San Fernando y Batería de San Luis de Bocachica).",
        refName: "Cartografía Histórica Militar de Tierrabomba (1780)",
        refImg: mapDefensivoImg,
        isAsset: true
      },
      {
        icon: Anchor,
        title: "Restauración Ambiental",
        desc: "Protección y reforestación del bosque de manglar como barrera biológica contra la erosión costera y el oleaje de buques.",
        refName: "Fuerte de San Fernando en Bocachica (Tierra Bomba)",
        refImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fuerte_de_San_Fernando_de_Bocachica.jpg/800px-Fuerte_de_San_Fernando_de_Bocachica.jpg",
        isAsset: false
      }
    ]
  },

  // LÁMINA 2
  {
    id: 2,
    number: "LÁMINA 02",
    tag: "DIAGNÓSTICO TERRITORIAL & COMUNIDAD",
    title: "Condicionantes Territoriales y Comunidad Raizal",
    subtitle: "Matriz DOFA territorial y defensa de la permanencia de los pobladores nativos frente al riesgo de gentrificación",
    category: "Diagnóstico DOFA",
    themeColor: "#0369a1",
    swot: {
      debilidad: "Inexistencia de red de alcantarillado, alta precariedad del espacio público y Necesidades Básicas Insatisfechas (NBI) críticas en los 4 poblados.",
      oportunidad: "Extensas porciones de suelo seguro en la meseta central (+22m), captación pluvial masiva y desarrollo de energías renovables.",
      fortaleza: "Riqueza paisajística, biodiversidad insular y frente costero con rol estratégico de protección a la bahía interna de Cartagena.",
      amenaza: "Erosión marina acelerada (hasta 1.8 m/año), presión inmobiliaria especulativa y riesgo de desplazamiento forzado por turismo masivo."
    },
    anthropologicalDimension: {
      title: "Dimensión Antropológica y Cultural",
      desc: "Reconocimiento de los títulos colectivos preexistentes y derechos de las comunidades raizales. La propuesta prioriza la cualificación y permanencia de los pobladores nativos en su territorio ancestral frente a cualquier modelo de expulsión.",
      refImg: calqueTbImg,
      refLabel: "Plano de Delimitación Territorial de Asentamientos Nativos",
      isAsset: true
    }
  },

  // LÁMINA 3
  {
    id: 3,
    number: "LÁMINA 03",
    tag: "SERVICIOS PÚBLICOS & CAPACIDAD DE CARGA",
    title: "Capacidad de Carga y Factibilidad de Servicios Básicos",
    subtitle: "Sustento técnico del acueducto insular y límite de crecimiento demográfico",
    category: "Capacidad de Carga",
    themeColor: "#0f766e",
    waterSystemTechnical: {
      title: "Sustento Técnico del Acueducto",
      desc: "El proyecto de acueducto contempla la compra de lotes para tanques de almacenamiento en la meseta que abastecerán a Tierrabomba, Boca Chica y Caño del Oro con una dotación mínima de 50 litros por persona al día.",
      targetPop: "Población Objetivo: Diseñado estrictamente para atender a los 10.000 habitantes actuales de la isla (Cartagena Cómo Vamos).",
      formula: "50 L/hab/día × 10.000 habitantes = 500.000 L/día (0.50 Megalitros/día)",
      refImg: bocetoColegioImg,
      refLabel: "Corte Arquitectónico: Macrocubierta Captadora & Aljibe Central 450.000 L",
      isAsset: true
    },
    strategicConclusion: {
      title: "Conclusión Estratégica",
      desc: "La capacidad de agua demuestra que la isla no admite sobrepoblación ni crecimiento urbano desmedido, justificando la decisión de consolidar y blindar únicamente a la población existente."
    }
  },

  // LÁMINA 4
  {
    id: 4,
    number: "LÁMINA 04",
    tag: "MODELO URBANO POLICÉNTRICO",
    title: "Estructura Urbana Policéntrica y Equipamientos Colectivos",
    subtitle: "Red interconectada de asentamientos y nodo intermedio central de equipamientos en la meseta",
    category: "Red & Movilidad",
    themeColor: "#b45309",
    settlements: [
      { name: "Tierrabomba", role: "Nodo Cívico & Administrativo", time: "0 - 10 min", icon: "🏛️" },
      { name: "Boca Chica", role: "Nodo Histórico & Marítimo", time: "10 min moto / 25 min bici", icon: "🏰" },
      { name: "Caño del Oro", role: "Nodo Memoria & Agro-pesca", time: "10 min moto / 20 min bici", icon: "🌾" },
      { name: "Punta Arena", role: "Nodo Balneario & Playa", time: "8 min moto / 18 min bici", icon: "🏖️" }
    ],
    connectivity: {
      title: "Tiempos de Conectividad & Nodo Intermedio",
      desc: "La distancia entre asentamientos permite desplazamientos rápidos: 10 minutos en moto y 25 minutos en bicicleta. En lugar de saturar cada sector con proyectos aislados, se propone una red interconectada con un nodo intermedio de equipamientos colectivos en el centro de la isla para dar cobertura eficiente a todos los poblados.",
      refImg: calqueTbImg,
      refLabel: "Red de Conectividad Insular & Polígono de Meseta Central",
      isAsset: true
    }
  },

  // LÁMINA 5
  {
    id: 5,
    number: "LÁMINA 05",
    tag: "TRAZADO URBANO & TOPOGRAFÍA",
    title: "Implantación Urbana e Integración Paisajística",
    subtitle: "Adaptación estricta a curvas de nivel, corredores ecológicos meseta-mar y articulación urbana",
    category: "Topografía & Corredores",
    themeColor: "#166534",
    urbanCriteria: [
      {
        num: "01",
        title: "Adaptación a la Topografía",
        desc: "Continuación de la trama vial existente adaptándose estrictamente a las curvas de nivel de la meseta (+22m a +30m) para evitar cortes agresivos en el terreno.",
        refImg: calcoCotasImg,
        refLabel: "Plano Oficial de Cotas de Nivel & Topografía de Tierrabomba",
        isAsset: true
      },
      {
        num: "02",
        title: "Corredores Ecológicos",
        desc: "Trazado de ejes ambientales perpendiculares a las vías que conectan el bosque denso de la meseta central con el mar Caribe y la bahía.",
        refImg: spectralNdviImg,
        refLabel: "Análisis Satelital NDVI: Corredores Verdes Meseta-Mar",
        isAsset: true
      },
      {
        num: "03",
        title: "Articulación Urbana",
        desc: "Conexión de la zona de expansión con el casco consolidado, tomando como hito ordenador la plaza principal, la iglesia y el colegio preexistente.",
        refImg: bocetoColegioImg,
        refLabel: "Plaza Cívica, Ágora Comunitaria & Equipamiento Educativo",
        isAsset: true
      }
    ]
  },

  // LÁMINA 6
  {
    id: 6,
    number: "LÁMINA 06",
    tag: "CENSO & DIAGNÓSTICO MIDAS",
    title: "Censo y Criterios para la Reubicación de Vivienda en Riesgo",
    subtitle: "Cruce técnico de cota de socavación marina con ortofotografía aérea y predios catastrales MIDAS",
    category: "Censo & Reubicación",
    themeColor: "#b91c1c",
    censusData: {
      tb: "Asentamiento Tierrabomba: 800 familias (~3.400 personas)",
      bc: "Boca Chica: ~6.000 personas",
      totalInsular: "Total Población Isla: ~10.000 habitantes"
    },
    methodology: {
      title: "Metodología de Identificación de Riesgo",
      desc: "Se descarta la reubicación total de la isla; el proyecto se enfoca únicamente en las 800 viviendas expuestas a la erosión costera de la franja norte de 500 metros delimitada por la línea horizontal Lat 10.3725.",
      cross: "Cruce Técnico: Selección de predios mediante el cruce de la cota de inundación con fotografía aérea y la consulta de los códigos de identificación catastral en el sistema MIDAS de Cartagena.",
      localization: "Criterio de Localización: La nueva vivienda se implanta contigua al núcleo urbano consolidado en la meseta (+22m) para preservar las redes de parentesco y evitar el desarraigo de la comunidad.",
      refImg: calcoCotasImg,
      refLabel: "Cruce Catastral MIDAS: Huellas de 800 Viviendas en Franja Norte de 500m",
      isAsset: true
    }
  },

  // LÁMINA 7
  {
    id: 7,
    number: "LÁMINA 07",
    tag: "PROTOTIPO DE VIVIENDA // HÁBITAT EVOLUTIVO",
    title: "Tipología de Vivienda Progresiva y Crecimiento Progresivo",
    subtitle: "Hábitat evolutivo modular, autoconstruible y adaptable en 3 etapas de consolidación",
    category: "Tipología de Vivienda",
    themeColor: "#c2410c",
    phases: [
      {
        stage: "Fase 1: Módulo Base",
        area: "54 m²",
        occupants: "4 - 5 personas",
        elements: "Estructura palafítica (+0.60m), 2 habitaciones, porche de sombra frontal, cocina, baño de bajo consumo y tanque pluvial 2.500 L.",
        refImg: bocetoViviendaImg,
        refLabel: "Corte Bioclimático del Prototipo Palafítico (+0.60m)",
        isAsset: true
      },
      {
        stage: "Fase 2: Crecimiento Productivo",
        area: "72 m²",
        occupants: "5 - 7 personas",
        elements: "Ampliación lateral para taller de redes de pesca, huerto o 3ª habitación y patio interior de convección térmica.",
        refImg: bocetoViviendaImg,
        refLabel: "Módulo Productivo: Taller de Redes & Huerto Isleño",
        isAsset: true
      },
      {
        stage: "Fase 3: Consolidación & Altillo",
        area: "86 m²",
        occupants: "6 - 8 personas",
        elements: "Consolidación de altillo habitable bajo cubierta a dos aguas y paneles solares fotovoltaicos para 100% de autonomía.",
        refImg: bocetoViviendaImg,
        refLabel: "Altillo Habitable & Cubierta Captadora Invertida",
        isAsset: true
      }
    ],
    technicalFocus: "Diseño que prevé la consolidación progresiva tanto de las unidades habitacionales como de las redes de infraestructura técnica por autoconstrucción comunitaria guiada en madera tratada y Bloques de Tierra Comprimida (BTC)."
  },

  // LÁMINA 8
  {
    id: 8,
    number: "LÁMINA 08",
    tag: "MODELO DE OCUPACIÓN // PATIOS COMUNALES",
    title: "Modelo de Ocupación Urbano-Arquitectónico: Patios Comunales",
    subtitle: "Manzana residencial con patio central para integración raizal, animales de corral y bioclimática pasiva",
    category: "Patios Comunales",
    themeColor: "#6d28d9",
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
    refImg: bocetoViviendaImg,
    refLabel: "Detalle Arquitectónico: Patios Centrales de Convección y Ventilación Cruzada",
    isAsset: true
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
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none transition-opacity duration-200">
      
      {/* Slide Container Card (Clean White Editorial Museum Look) */}
      <div 
        className={`bg-white border border-stone-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[95vh] h-[860px]'
        }`}
      >
        
        {/* Top Slide Navigation Bar (Crisp Light Header) */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          
          {/* Left Title & Index */}
          <div className="flex items-center space-x-3 min-w-0">
            <div 
              className="w-9 h-9 rounded-xl text-white font-serif font-black text-sm flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: currentSlide.themeColor }}
            >
              {currentSlide.id.toString().padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span 
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider text-white"
                  style={{ backgroundColor: currentSlide.themeColor }}
                >
                  {currentSlide.tag}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Lámina {currentSlideIndex + 1} de {FUTURE_TIERRABOMBA_SLIDES.length}
                </span>
              </div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight truncate mt-0.5">
                El Futuro de Tierrabomba // Plan Maestro Territorial 2026-2036
              </h2>
            </div>
          </div>

          {/* Center: Slide Indicators */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {FUTURE_TIERRABOMBA_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx 
                    ? 'w-9 shadow-sm' 
                    : 'w-2.5 bg-stone-200 hover:bg-stone-300'
                }`}
                style={{ backgroundColor: currentSlideIndex === idx ? currentSlide.themeColor : undefined }}
                title={`${slide.number}: ${slide.title}`}
              />
            ))}
          </div>

          {/* Right Controls (Prev, Next, Fullscreen, Close) */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setCurrentSlideIndex(prev => (prev - 1 + FUTURE_TIERRABOMBA_SLIDES.length) % FUTURE_TIERRABOMBA_SLIDES.length)}
              className="p-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors flex items-center space-x-1 text-xs font-mono font-bold shadow-sm cursor-pointer"
              title="Lámina anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % FUTURE_TIERRABOMBA_SLIDES.length)}
              className="p-2 px-3 rounded-xl text-white transition-colors flex items-center space-x-1 text-xs font-mono font-bold shadow-sm cursor-pointer"
              style={{ backgroundColor: currentSlide.themeColor }}
              title="Siguiente lámina (Flecha Derecha)"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-stone-200 mx-1" />

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors cursor-pointer"
              title={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 transition-colors cursor-pointer"
              title="Cerrar presentación (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Slide Content Area (Crisp White Gallery / Lámina Editorial) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-stone-800 bg-[#fdfdfc]">
          
          {/* Slide Header Banner */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span 
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md text-white shadow-sm inline-flex items-center gap-1.5"
                style={{ backgroundColor: currentSlide.themeColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.number} &bull; {currentSlide.tag}
              </span>
              <span className="text-xs font-mono text-stone-500 font-medium">
                Tesis de Arquitectura & Urbanismo 2026 &bull; Isla de Tierrabomba, Cartagena
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-3 leading-tight tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-sm md:text-base text-stone-600 font-sans mt-1.5 font-normal leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* LÁMINA 1: VISIÓN ESTRATÉGICA PARQUE ECOLÓGICO & CULTURAL                  */}
          {/* ========================================================================= */}
          {currentSlide.id === 1 && (
            <div className="space-y-6">
              {/* Top Row: Postura de Rechazo vs Propuesta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-700 uppercase">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{currentSlide.posture.rejectionTitle}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {currentSlide.posture.rejection}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{currentSlide.posture.definitionTitle}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {currentSlide.posture.definition}
                  </p>
                </div>
              </div>

              {/* 3 Vocaciones con Planos e Imágenes Reales de Tierrabomba */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-emerald-600" />
                  3 Vocaciones Principales: Planos y Evidencias Reales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentSlide.vocations.map((voc, i) => {
                    const Icon = voc.icon;
                    return (
                      <div key={i} className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-40 relative overflow-hidden bg-stone-100 flex items-center justify-center">
                          <img 
                            src={voc.refImg} 
                            alt={voc.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                          />
                          <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-mono truncate">
                            {voc.refName}
                          </div>
                        </div>
                        <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs font-bold text-stone-900">
                              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span>{voc.title}</span>
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed font-sans">{voc.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 2: DIAGNÓSTICO DOFA & DIMENSIÓN COMUNITARIA RAIZAL                 */}
          {/* ========================================================================= */}
          {currentSlide.id === 2 && (
            <div className="space-y-6">
              {/* Matriz DOFA 4 Cuadrantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-800 uppercase">
                    <span className="w-5 h-5 rounded-md bg-amber-200 text-amber-900 flex items-center justify-center text-[10px]">D</span>
                    <span>Debilidad / Restricción Territorial</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.swot.debilidad}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                    <span className="w-5 h-5 rounded-md bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px]">F</span>
                    <span>Fortaleza & Valor Paisajístico</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.swot.fortaleza}</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-800 uppercase">
                    <span className="w-5 h-5 rounded-md bg-sky-200 text-sky-900 flex items-center justify-center text-[10px]">O</span>
                    <span>Oportunidad de Suelo Seguro (+22m)</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.swot.oportunidad}</p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-800 uppercase">
                    <span className="w-5 h-5 rounded-md bg-red-200 text-red-900 flex items-center justify-center text-[10px]">A</span>
                    <span>Amenaza de Erosión Marina & Gentrificación</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.swot.amenaza}</p>
                </div>
              </div>

              {/* Dimensión Antropológica con Plano Territorial de Tierrabomba */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 items-center">
                <div className="md:col-span-5 h-48 rounded-xl overflow-hidden bg-stone-200 shadow-sm relative border border-stone-300">
                  <img 
                    src={currentSlide.anthropologicalDimension.refImg} 
                    alt="Delimitación Tierrabomba" 
                    className="w-full h-full object-contain bg-white"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-1 rounded text-[10px] font-mono">
                    {currentSlide.anthropologicalDimension.refLabel}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-2">
                  <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-700" />
                    {currentSlide.anthropologicalDimension.title}
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {currentSlide.anthropologicalDimension.desc}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-stone-600">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-stone-200">🛡️ Títulos Colectivos</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-stone-200">🌿 Permanencia Raizal</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-stone-200">🚫 Anti-Desplazamiento</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 3: SERVICIOS PÚBLICOS & CAPACIDAD DE CARGA HÍDRICA                 */}
          {/* ========================================================================= */}
          {currentSlide.id === 3 && (
            <div className="space-y-6">
              {/* Balance Hídrico & Datos Clave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-teal-800 uppercase font-bold">Dotación Mínima</span>
                  <div className="text-3xl font-serif font-black text-teal-950">50 L</div>
                  <span className="text-xs text-teal-700 font-medium">por habitante al día</span>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-sky-800 uppercase font-bold">Población Objetivo</span>
                  <div className="text-3xl font-serif font-black text-sky-950">10.000</div>
                  <span className="text-xs text-sky-700 font-medium">habitantes censados</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Caudal Total Diario</span>
                  <div className="text-3xl font-serif font-black text-emerald-950">500.000 L</div>
                  <span className="text-xs text-emerald-700 font-medium">0.50 Megalitros/día</span>
                </div>
              </div>

              {/* Sustento Técnico con Corte Arquitectónico Real de la Tesis */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 items-center">
                <div className="md:col-span-5 h-52 rounded-xl overflow-hidden bg-white shadow-sm relative border border-stone-300">
                  <img 
                    src={currentSlide.waterSystemTechnical.refImg} 
                    alt="Corte Colegio y Aljibe" 
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-1 rounded text-[10px] font-mono">
                    {currentSlide.waterSystemTechnical.refLabel}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-teal-600" />
                      {currentSlide.waterSystemTechnical.title}
                    </h3>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {currentSlide.waterSystemTechnical.desc}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-100/60 border border-teal-200 text-xs font-mono text-teal-950 font-bold">
                    📐 Fórmula Técnica: {currentSlide.waterSystemTechnical.formula}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong>{currentSlide.strategicConclusion.title}:</strong> {currentSlide.strategicConclusion.desc}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 4: MODELO URBANO POLICÉNTRICO & RED DE ASENTAMIENTOS               */}
          {/* ========================================================================= */}
          {currentSlide.id === 4 && (
            <div className="space-y-6">
              {/* 4 Nodos con Roles & Tiempos de Conectividad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {currentSlide.settlements.map((node, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                    <div className="text-2xl">{node.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{node.name}</h4>
                      <span className="text-[11px] font-mono text-amber-800 font-medium block">{node.role}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-600">
                      <span>⏱️ Tiempo:</span>
                      <span className="font-bold text-stone-900">{node.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conectividad con Plano Territorial Real */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 items-center">
                <div className="md:col-span-5 h-52 rounded-xl overflow-hidden bg-white shadow-sm relative border border-stone-300">
                  <img 
                    src={currentSlide.connectivity.refImg} 
                    alt="Plano Policéntrico" 
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-1 rounded text-[10px] font-mono">
                    {currentSlide.connectivity.refLabel}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Bike className="w-4 h-4 text-amber-600" />
                    {currentSlide.connectivity.title}
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {currentSlide.connectivity.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      🛵 <strong>10 min en Moto</strong> entre asentamientos
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      🚲 <strong>25 min en Bici</strong> a través de la meseta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 5: TRAZADO URBANO, TOPOGRAFÍA & CORREDORES ECOLÓGICOS              */}
          {/* ========================================================================= */}
          {currentSlide.id === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSlide.urbanCriteria.map((crit, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="h-44 relative bg-stone-50 p-2 border-b border-stone-100 flex items-center justify-center">
                      <img 
                        src={crit.refImg} 
                        alt={crit.title} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-0.5 rounded text-[10px] font-mono truncate">
                        {crit.refLabel}
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {crit.num}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900">{crit.title}</h4>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">{crit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 6: CENSO MIDAS & 800 VIVIENDAS EN RIESGO DE EROSIÓN                */}
          {/* ========================================================================= */}
          {currentSlide.id === 6 && (
            <div className="space-y-6">
              {/* Métricas Cifradas MIDAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-red-800 uppercase font-bold">Poblado Tierrabomba</span>
                  <div className="text-3xl font-serif font-black text-red-950">800</div>
                  <span className="text-xs text-red-700 font-medium">familias en riesgo (~3.400 hab)</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-stone-700 uppercase font-bold">Boca Chica</span>
                  <div className="text-3xl font-serif font-black text-stone-900">~6.000</div>
                  <span className="text-xs text-stone-600 font-medium">habitantes consolidados</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-amber-800 uppercase font-bold">Franja de Socavación</span>
                  <div className="text-3xl font-serif font-black text-amber-950">500 m</div>
                  <span className="text-xs text-amber-700 font-medium">borde costero norte en riesgo</span>
                </div>
              </div>

              {/* Metodología & Plano de Huellas MIDAS de la Tesis */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 items-center">
                <div className="md:col-span-5 h-52 rounded-xl overflow-hidden bg-white shadow-sm relative border border-stone-300">
                  <img 
                    src={currentSlide.methodology.refImg} 
                    alt="Plano Huellas Catastrales MIDAS" 
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-1 rounded text-[10px] font-mono">
                    {currentSlide.methodology.refLabel}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-2.5">
                  <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    {currentSlide.methodology.title}
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium">
                    {currentSlide.methodology.desc}
                  </p>
                  <div className="space-y-1.5 text-xs text-stone-600 font-sans">
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      🔍 <strong>{currentSlide.methodology.cross}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      📍 <strong>{currentSlide.methodology.localization}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 7: TIPOLOGÍA DE VIVIENDA PROGRESIVA EN 3 ETAPAS                     */}
          {/* ========================================================================= */}
          {currentSlide.id === 7 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSlide.phases.map((phase, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="h-44 relative bg-stone-50 p-2 border-b border-stone-100 flex items-center justify-center">
                      <img 
                        src={phase.refImg} 
                        alt={phase.stage} 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {phase.area}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-2 py-0.5 rounded text-[10px] font-mono truncate">
                        {phase.refLabel}
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-orange-700 uppercase">
                          Capacidad: {phase.occupants}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 font-serif">{phase.stage}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed font-sans">{phase.elements}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 font-sans">
                <strong>Enfoque Constructivo:</strong> {currentSlide.technicalFocus}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LÁMINA 8: MODELO DE MANZANA CON PATIOS COMUNALES                          */}
          {/* ========================================================================= */}
          {currentSlide.id === 8 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
                  <h4 className="text-xs font-bold text-purple-900 font-serif flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    {currentSlide.spatialStructure.title}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.spatialStructure.desc}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-900 font-serif flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-700" />
                    {currentSlide.localCustoms.title}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.localCustoms.desc}</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5">
                  <h4 className="text-xs font-bold text-teal-900 font-serif flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-700" />
                    {currentSlide.bioclimaticComfort.title}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{currentSlide.bioclimaticComfort.desc}</p>
                </div>
              </div>

              {/* Corte Técnico y Esquema de Patio Comunal de la Tesis */}
              <div className="h-52 rounded-2xl overflow-hidden bg-white relative border border-stone-300 shadow-sm p-2 flex items-center justify-center">
                <img 
                  src={currentSlide.refImg} 
                  alt="Patio Comunal y Corte Bioclimático" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-stone-900/85 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                  {currentSlide.refLabel} &bull; Captación de Brisas N-NE y Reducción Térmica de hasta 5°C
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Slide Footer (Slide selector strip) */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1 overflow-x-auto py-1 max-w-full">
            {FUTURE_TIERRABOMBA_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  currentSlideIndex === idx 
                    ? 'bg-stone-900 text-white font-bold shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{slide.number}:</span>
                <span className="truncate max-w-[120px]">{slide.category}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-stone-500 shrink-0 hidden sm:block">
            Usa las flechas &larr; &rarr; del teclado para navegar
          </div>
        </div>

      </div>

    </div>
  );
}
