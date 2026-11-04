import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Home,
  GraduationCap,
  BookOpen,
  Box,
  Map as MapIcon,
  Ship,
  Waves,
  Droplets,
  Building2,
  Leaf,
  Trash2,
  Users,
  MapPin,
  Anchor,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Activity,
  Compass,
  Wind,
  AlertCircle,
  Sparkles,
  Star,
  Eye,
  Play,
  Heart,
  Fish,
  Tent,
  Navigation,
  Layers,
  Camera,
  MessageCircle,
  Download,
  ExternalLink,
  Shield,
  TreePine,
  Route,
  Sun,
  Moon
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

// Datos de rutas marítimas (lanchas) entre Cartagena y puntos de la isla
const BOAT_ROUTES = [
  { name: "Cartagena → Punta Arena", color: "#0d9488", frequency: "Cada 30 min", stops: ["Cartagena", "Punta Arena"] },
  { name: "Cartagena → Tierrabomba", color: "#2563eb", frequency: "Cada 15 min", stops: ["Cartagena", "Tierrabomba"] },
  { name: "Cartagena → Bocachica", color: "#dc2626", frequency: "Cada 1 hora", stops: ["Cartagena", "Bocachica"] },
  { name: "Cartagena → Caño del Oro", color: "#d97706", frequency: "Cada 45 min", stops: ["Cartagena", "Caño del Oro"] },
];

// Puntos de concentración de basura
const WASTE_POINTS = [
  { name: "Punta Arena - Borde costero", severity: "high", waste: "Plásticos, envases, escombros" },
  { name: "Caño del Oro - Muelle", severity: "high", waste: "Orgánicos, plásticos, residuos pesqueros" },
  { name: "Tierrabomba - Borde sur", severity: "medium", waste: "Plásticos, vidrio" },
  { name: "Bocachica - Frente a fuerte", severity: "medium", waste: "Residuos pesqueros" },
];

// Datos ambientales
const ENV_DATA = [
  { name: "Biomasa Meseta (+22m)", value: "65 ha", status: "Saludable", color: "#16a34a", icon: "Leaf" },
  { name: "Biomasa Borde Costero", value: "0%", status: "Crítico", color: "#dc2626", icon: "Leaf" },
  { name: "NDVI Meseta", value: "0.5-0.7", status: "Buena", color: "#16a34a", icon: "Activity" },
  { name: "Manglar Protegido", value: "14.2 ha", status: "Activo", color: "#16a34a", icon: "Leaf" },
  { name: "Bosque Seco", value: "38 ha", status: "Activo", color: "#16a34a", icon: "Leaf" },
  { name: "Temperatura Meseta", value: "31.2°C", status: "Moderada", color: "#eab308", icon: "Wind" },
];

const PROBLEM_GALLERIES = {
  erosion: {
    id: "erosion",
    code: "PROBLEMA 01",
    color: "#e11d48",
    badgeLabel: "Riesgo Físico Crítico",
    title: "Erosión de las costas y riesgo en las viviendas",
    description: "El golpe del mar destruye la orilla y pone en peligro las casas construidas cerca del agua.",
    context: "El avance marino, el oleaje directo y las mareas de leva socavan aceleradamente la línea costera de Tierrabomba con tasas de retroceso de hasta 1.8 m/año. Viviendas tradicionales construidas sobre cimientos precarios presentan descalces, fracturas estructurales y peligro inminente de colapso.",
    source: "Expediente Judicial de Gestión del Riesgo & Registro en Sitio (2022–2026)",
    images: [
      { url: `${import.meta.env.BASE_URL}assets/vivienda_erosion_ruinas.png`, caption: "Ruinas de viviendas socavadas por el oleaje frente a la bahía de Cartagena.", tag: "Colapso Estructural por Socavación" },
      { url: `${import.meta.env.BASE_URL}assets/vivienda_borde_socavacion.jpg`, caption: "Asentamientos en el borde costero crítico de Tierrabomba.", tag: "Viviendas en Peligro Inminente" },
      { url: `${import.meta.env.BASE_URL}assets/vivienda_costa_tierrabomba.png`, caption: "Franja habitacional de borde en Tierrabomba frente al agua.", tag: "Exposición Territorial Costera" }
    ]
  },
  agua: {
    id: "agua",
    code: "PROBLEMA 02",
    color: "#d97706",
    badgeLabel: "Déficit Estructural Hídrico",
    title: "Falta de agua potable y alcantarillado",
    description: "La isla no tiene red de agua ni desagües, lo que obliga a la población a comprar agua traída en lanchas.",
    context: "Tierrabomba sufre un 0% de cobertura en red formal de acueducto y alcantarillado. Los acuíferos locales padecen salinización por intrusión marina, obligando a las familias a comprar pimpinas traídas en lanchas desde Cartagena a costos desproporcionados.",
    source: "Reportaje Especial Publimetro & Sentencias Corte Constitucional",
    images: [
      { url: `${import.meta.env.BASE_URL}assets/tierrabomba_acarreo_pimpina.png`, caption: "Acarreo cotidiano de pimpinas de agua dulce al hombro por las calles de Tierrabomba.", tag: "Acarreo Manual de Agua" },
      { url: `${import.meta.env.BASE_URL}assets/tierrabomba_publimetro_agua.jpg`, caption: "El diario vivir de las familias de Tierra Bomba: compra y traslado precario de agua dulce traída en barcazas.", tag: "0% Red Formal de Acueducto" }
    ]
  },
  servicios: {
    id: "servicios",
    code: "PROBLEMA 03",
    color: "#2563eb",
    badgeLabel: "Vulnerabilidad Institucional",
    title: "Falta de servicios públicos y colegios",
    description: "Existe un abandono en la infraestructura de la isla, afectando la educación, la salud y los espacios comunitarios.",
    context: "El Informe de Calidad de Vida clasifica la infraestructura educativa y comunitaria de Tierra Bomba como deficiente (37,3 puntos). La sede escolar actual sufre severa corrosión de acero estructural en columnas y losas por el ambiente salino.",
    source: "Informe de Calidad de Vida Cartagena (2025) & Diagnóstico en Sitio",
    images: [
      { url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_columnas.jpg`, caption: "Severa corrosión del acero estructural en columnas y voladizos.", tag: "Riesgo Estructural & Acordonamiento" },
      { url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_1.jpg`, caption: "Desprendimiento de mampostería, corrosión de armaduras.", tag: "Deterioro Físico Crítico" },
      { url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_2.png`, caption: "Viga de concreto con acero de refuerzo totalmente expuesto.", tag: "Falla Estructural Portante" }
    ]
  }
};

export default function IntroLandingIndex({ onNavigateModule }) {
  const [activeProblemKey, setActiveProblemKey] = useState(null);
  const [problemSlideIndex, setProblemSlideIndex] = useState(0);
  const [activeEnvTab, setActiveEnvTab] = useState('biomasa');

  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      
      {/* ========================================================= */}
      {/* HERO SECTION - PRESENTACIÓN Y ACCESOS RÁPIDOS              */}
      {/* ========================================================= */}
      <section className="relative min-h-[90vh] lg:min-h-screen py-12 lg:py-16 overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-blue-900 text-white flex flex-col justify-between">
        {/* Animated wave background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.08)" />
            <path d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.12)" />
            <path d="M0,100 C360,60 720,120 1080,80 C1260,60 1380,100 1440,100 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-300/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Hero Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-bold text-white mb-4 backdrop-blur-sm">
              <Anchor className="w-4 h-4 animate-bounce" />
              <span>Tierra Bomba &bull; Bahía de Cartagena</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none mb-4 text-white drop-shadow-2xl">
              Tierra Bomba:<br />
              <span className="text-amber-200">un lugar para quedarse</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto">
              Conoce tu territorio, sus problemas y la propuesta para que la comunidad pueda quedarse en la isla de forma segura.
            </p>
          </div>

          {/* Quick Navigation Cards - 4 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto w-full">
            <button
              onClick={() => {
                document.getElementById('formulacion-problema')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden text-left cursor-pointer"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Home className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">Conoce la isla</p>
                <p className="text-[11px] text-teal-100">Tu territorio y su gente</p>
              </div>
            </button>
            <button
              onClick={() => onNavigateModule('module11')}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden text-left cursor-pointer"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Compass className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">Mira su historia</p>
                <p className="text-[11px] text-teal-100">Mapas y fotos antiguas</p>
              </div>
            </button>
            <button
              onClick={() => {
                document.getElementById('criterios-vivienda')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden text-left cursor-pointer"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Box className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">Recorre la propuesta</p>
                <p className="text-[11px] text-teal-100">Criterios & diseño en 3D</p>
              </div>
            </button>
            <button
              onClick={() => {
                document.getElementById('estudio-variables')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden text-left cursor-pointer"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <MapIcon className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">El mapa de riesgos</p>
                <p className="text-[11px] text-teal-100">Dónde se inunda</p>
              </div>
            </button>
          </div>

          {/* Quick Scroll Indicator to Academic Foundation */}
          <div className="mt-8 pt-4">
            <button
              onClick={() => {
                document.getElementById('fundamentacion-proyecto')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-mono font-bold text-teal-100 hover:text-white transition-all backdrop-blur-sm animate-bounce cursor-pointer shadow-sm"
            >
              <span>Ver Estructuración del Proyecto & Líneas de Acción</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ESTRUCTURACIÓN DEL PROYECTO (TIERRA BOMBA)                 */}
      {/* ========================================================= */}
      <section id="fundamentacion-proyecto" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Intro Header Card */}
        <div className="mb-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Estructuración del Proyecto &bull; Propuesta Aplicada</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Estructura de la Propuesta en Tierra Bomba
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
            La estructuración de un proyecto o propuesta aplicada a la isla de <strong className="text-teal-900 font-bold">Tierra Bomba</strong> (Cartagena de Indias) requiere articular la vulnerabilidad territorial, la fundamentación teórica, las variables de diagnóstico y las líneas de acción.
          </p>
        </div>

        {/* 1. FORMULACIÓN DEL PROBLEMA */}
        <div id="formulacion-problema" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-rose-50 via-amber-50/50 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Capítulo 1 // Diagnóstico Situacional
              </span>
              <span className="text-xs text-slate-500 font-mono">Bahía de Cartagena &bull; Caso Insular</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              1. Formulación del Problema
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              Tierra Bomba presenta una condición de <strong className="text-rose-900 font-bold">desarticulación socioespacial e insularidad periférica</strong>, caracterizada por una desconexión crítica respecto a las dinámicas de desarrollo de Cartagena, a pesar de su proximidad geográfica.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Causas principales identificadas en el territorio:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5 hover:border-rose-300 hover:bg-rose-50/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Déficit Crítico de Servicios Básicos</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Carencia o intermitencia severa en servicios básicos (agua potable por red, saneamiento y manejo de residuos).
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5 hover:border-rose-300 hover:bg-rose-50/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Erosión Costera & Riesgo Patrimonial</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Erosión costera acelerada por corrientes marítimas y cambio climático, amenazando la infraestructura habitacional y el patrimonio histórico (fuertes virreinales como San Fernando y el Ángel San Rafael).
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5 hover:border-amber-300 hover:bg-amber-50/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Dependencia de Turismo Precarizado</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Dependencia de un turismo informal y estacional sin cadenas de valor locales consolidadas.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5 hover:border-amber-300 hover:bg-amber-50/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Presión Territorial & Vacíos de Titulación</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Presión territorial, vacíos en la titulación de tierras y debilidad institucional en la gobernanza comunitaria.
                  </p>
                </div>
              </div>

            </div>

            {/* Pregunta Problema Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-2">
              <div className="flex items-center space-x-2 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Pregunta Problema Central</span>
              </div>
              <p className="text-base sm:text-lg font-serif italic text-amber-100 leading-snug">
                “¿De qué manera una intervención integral de base comunitaria y adaptación climática puede mitigar la vulnerabilidad socioambiental y dinamizar la soberanía económica en la isla de Tierra Bomba?”
              </p>
            </div>
          </div>
        </div>

        {/* 2. ABORDAJE DESDE EL MARCO TEÓRICO */}
        <div id="marco-teorico" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Capítulo 2 // Epistemología & Fundamentación
              </span>
              <span className="text-xs text-slate-500 font-mono">3 Enfoques Complementarios</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              2. Abordaje desde el Marco Teórico
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              Para no limitar el análisis a un enfoque meramente asistencial, el problema se aborda combinando tres enfoques teóricos:
            </p>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Teórico 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-mono font-bold">
                  David Harvey &bull; Edward Soja
                </div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  1. Justicia Espacial y Derecho a la Ciudad
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Explica cómo la proximidad física a enclaves de alta renta turística (Bocagrande, Castillogrande) contrasta con la marginación en el acceso a bienes públicos, planteando la necesidad de redistribución de recursos e integración territorial equitativa.
                </p>
              </div>
              <div className="pt-3 border-t border-blue-100 text-[11px] font-mono text-blue-700 font-semibold">
                &rarr; Redistribución socioespacial equitativa
              </div>
            </div>

            {/* Teórico 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-50/60 to-white border border-teal-200/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-[11px] font-mono font-bold">
                  Carl Folke &bull; Fikret Berkes
                </div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  2. Ecología Política y Resiliencia Socioecológica
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Permite entender que el deterioro costero no es solo un fenómeno biofísico, sino el resultado de intervenciones antrópicas históricas (obras marítimas, canalizaciones y abandono de defensas costeras). La comunidad y el ecosistema costero deben coevolucionar mediante estrategias de adaptación basadas en la naturaleza (SbN).
                </p>
              </div>
              <div className="pt-3 border-t border-teal-100 text-[11px] font-mono text-teal-700 font-semibold">
                &rarr; Soluciones Basadas en la Naturaleza (SbN)
              </div>
            </div>

            {/* Teórico 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-mono font-bold">
                  Amartya Sen &bull; Arturo Escobar
                </div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  3. Desarrollo Endógeno y Agenciamiento Comunitario
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Sostiene que las soluciones sostenibles provienen del fortalecimiento de las capacidades locales, los saberes ancestrales de las comunidades afrodescendientes y la gobernanza colectiva del territorio, evitando modelos extractivos foráneos.
                </p>
              </div>
              <div className="pt-3 border-t border-amber-100 text-[11px] font-mono text-amber-800 font-semibold">
                &rarr; Soberanía comunitaria y saberes locales
              </div>
            </div>

          </div>
        </div>

        {/* 3. RECURSOS METODOLÓGICOS Y ESTUDIO DE VARIABLES */}
        <div id="estudio-variables" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-50 via-emerald-50/50 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Capítulo 3 // Metodología Mixta
              </span>
              <span className="text-xs text-slate-500 font-mono">IAP (Investigación Acción Participativa)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              3. Recursos Metodológicos y Estudio de Variables
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              El diagnóstico integral se sustenta en un <strong className="text-teal-900 font-bold">diseño metodológico mixto (cuali-cuantitativo)</strong> con enfoque participativo (IAP - Investigación Acción Participativa).
            </p>
          </div>

          {/* Table Layout for Desktop / Mobile Scroll */}
          <div className="p-4 sm:p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                  <th className="py-3 px-4 rounded-tl-xl w-1/5">Dimensión / Variable</th>
                  <th className="py-3 px-4 w-1/4">Indicadores Evaluados</th>
                  <th className="py-3 px-4 w-1/4">Recursos e Instrumentos Metodológicos</th>
                  <th className="py-3 px-4 rounded-tr-xl w-3/10">Hallazgo / Conclusión Metodológica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 align-top">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Físico-Ambiental</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Tasa de retroceso de línea de costa, salinidad de acuíferos, cobertura vegetal.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Mapeo GIS multitemporal, sensores remotos, batimetría y aforos de calidad de agua.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed bg-teal-50/30 font-medium text-slate-900 rounded-r-lg">
                    La erosión no es homogénea; se concentra en frentes con pérdida de barreras arrecifales/manglar, requiriendo zonificación urgente.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 align-top">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>Socioeconómica</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Ingreso medio por hogar, tasa de informalidad, acceso a salud y educación técnica.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Encuestas estructuradas por muestreo estratificado en los cuatro corregimientos (Tierra Bomba, Punta Arena, Caño del Oro, Bocachica).
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed bg-amber-50/30 font-medium text-slate-900 rounded-r-lg">
                    Alta vulnerabilidad por monocultivo de servicios turísticos precarizados y bajo relevo generacional en pesca tradicional.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 align-top">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Sociocultural y Gobernanza</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Cohesión comunitaria, legitimidad de Consejos Comunitarios, preservación del patrimonio.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Cartografía social participativa, grupos focales, entrevistas semiestructuradas y talleres de memoria oral.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed bg-indigo-50/30 font-medium text-slate-900 rounded-r-lg">
                    El Consejo Comunitario y las organizaciones de base son el canal de legitimidad necesario; los proyectos impuestos desde afuera fracasan por desconfianza histórica.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 align-top">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-bold">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Infraestructura y Servicios</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Cobertura de red hídrica, disposición de excretas, autonomía energética.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed">
                    Auditorías técnicas in situ, balances de masa de residuos y caracterización energética.
                  </td>
                  <td className="py-4 px-4 align-top leading-relaxed bg-blue-50/30 font-medium text-slate-900 rounded-r-lg">
                    Los sistemas centralizados continentales son inviables a corto plazo; la solución técnica exige descentralización y circularidad.
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* 4. APLICACIÓN A LA PROPUESTA CONCRETA */}
        <div id="propuesta-concreta" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Capítulo 4 // Líneas de Acción Estratégicas
              </span>
              <span className="text-xs text-slate-500 font-mono">Propuesta Materializada &bull; 3 Ejes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              4. Aplicación a la Propuesta Concreta
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              A partir de las conclusiones del diagnóstico de variables y el marco teórico, la propuesta se materializa en tres ejes estratégicos integrados:
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Eje 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-teal-50/30 border border-teal-200 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold font-mono shrink-0 shadow-sm">
                  01
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider">Línea Técnica y Ambiental</span>
                  <h4 className="text-lg font-bold text-slate-900">
                    Eje 1: Infraestructura Descentralizada y Soluciones Basadas en la Naturaleza (SbN)
                  </h4>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-teal-800 uppercase flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    <span>Acción Proyectual</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Restauración de franjas de manglar y arrecifes artificiales con tecnología de bio-bloques para frenar la energía del oleaje, complementada con microrredes de captación y potabilización solar de agua de lluvia y plantas modulares de desalinización fotovoltaica gestionadas localmente.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-slate-700 uppercase flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sustento Teórico / Metodológico</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Responde a la variable físico-ambiental y al marco de resiliencia socioecológica, eliminando la dependencia crítica de tuberías submarinas vulnerables.
                  </p>
                </div>
              </div>
            </div>

            {/* Eje 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-200 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold font-mono shrink-0 shadow-sm">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">Línea Productiva y Cultural</span>
                  <h4 className="text-lg font-bold text-slate-900">
                    Eje 2: Circuito Ecoturístico y Cultural Autogestionado
                  </h4>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-amber-900 uppercase flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Acción Proyectual</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Creación de una red de turismo patrimonial articulada por los Consejos Comunitarios que conecte el patrimonio militar virreinal (Bocachica) con la memoria viva, la gastronomía tradicional y el turismo de naturaleza, operada bajo estándares comunitarios certificados.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-slate-700 uppercase flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sustento Teórico / Metodológico</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Aplica el enfoque de desarrollo endógeno y combate la precariedad evidenciada en las variables socioeconómicas.
                  </p>
                </div>
              </div>
            </div>

            {/* Eje 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 border border-indigo-200 hover:shadow-md transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold font-mono shrink-0 shadow-sm">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">Línea Política e Institucional</span>
                  <h4 className="text-lg font-bold text-slate-900">
                    Eje 3: Modelo de Cogobernanza Territorial
                  </h4>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-indigo-900 uppercase flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Acción Proyectual</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Constitución de una mesa técnica permanente entre la institucionalidad distrital (Distrito de Cartagena, DIMAR, MinCultura) y las autoridades étnico-territoriales para el ordenamiento del borde costero y el control de la especulación inmobiliaria.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1 shadow-2xs">
                  <span className="text-[11px] font-mono font-bold text-slate-700 uppercase flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sustento Teórico / Metodológico</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Hace operativo el derecho al territorio y la justicia espacial, garantizando la sostenibilidad política y social de cualquier obra física.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons to interactive thesis modules */}
            <div className="pt-4 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <button
                onClick={() => onNavigateModule('3dviewer')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>Ver Propuesta en Visor 3D</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateModule('module11')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Ver Planos Históricos (1589-1900)</span>
              </button>

              <button
                onClick={() => onNavigateModule('framework')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Marco Metodológico Completo</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* CRITERIOS INTEGRADOS DE DISEÑO DE VIVIENDA PARA TIERRA BOMBA */}
        {/* ========================================================= */}
        <div id="criterios-vivienda" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-teal-50/40 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Factores de Diseño Habitacional // Hábitat Caribe
              </span>
              <span className="text-xs text-slate-500 font-mono">Arquitectura Resiliente & Identidad</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Criterios Integrados de Diseño de Vivienda para Tierra Bomba
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              Pautas proyectuales técnicas, bioclimáticas, hidrosanitarias y de habitabilidad comunitaria formuladas para el nuevo asentamiento seguro en la meseta (+22.00 m.s.n.m.).
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* 1. Criterio Bioclimático */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">Criterio 1</span>
                  <h4 className="text-xl font-bold text-slate-900">1. Criterio Bioclimático</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-emerald-900 flex items-center space-x-1.5">
                    <Sun className="w-4 h-4 text-emerald-600" />
                    <span>Orientación y control de radiación</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Eje longitudinal orientado Este-Oeste; fachadas cortas expuestas al sol naciente y poniente con muros ciegos o cámaras ventiladas. Aleros perimetrales profundos y quiebrasoles móviles que protegen vanos y galerías de la radiación directa durante todo el año.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-emerald-900 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-emerald-600" />
                    <span>Ventilación cruzada pasiva</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Disposición de vanos enfrentados en barlovento (vientos alisios del Noreste/Norte) y sotavento, maximizando la permeabilidad con celosías, calados y carpinterías basculantes con una relación de apertura mínima del 25–30% del área de piso habitable.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-emerald-900 flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Efecto chimenea y desfogue térmico</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Cubiertas inclinadas (20–30%) a dos o cuatro aguas equipadas con cumbreras ventiladas, linternas o lucernarios altos que facilitan la evacuación continua del aire caliente acumulado por estratificación térmica.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-emerald-900 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Amortiguamiento del calor por cubierta</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Sistema de techo multicapa (cubierta exterior reflectante + cámara de aire ventilada + falso techo aislante o permeable) para reducir la transmitancia térmica hacia los recintos de descanso.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Criterio Constructivo */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider">Criterio 2</span>
                  <h4 className="text-xl font-bold text-slate-900">2. Criterio Constructivo</h4>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                    Despegue del suelo (Zócalo / Palafito ventilado)
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Elevación del plano de piso entre <strong>0.40 m y 0.80 m</strong> sobre zapatas aisladas o dados de concreto/mampostería para evitar la humedad por capilaridad salina, escorrentías pluviales y permitir la refrigeración inferior de la losa.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-2 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                    Durabilidad ante ambiente marino
                  </h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>Concretos de alta compacidad:</strong> Con aditivos puzolánicos/hidrófugos y recubrimientos de armadura no menores a <strong>50 mm</strong> para contener la penetración de cloruros.
                    </li>
                    <li>
                      <strong>Maderas de origen legal:</strong> Debidamente secadas e inmunizadas contra xilófagos y salitre (clase de uso 4 / marino).
                    </li>
                    <li>
                      <strong>Fijaciones y perfiles:</strong> En acero inoxidable (AISI 316) o acero galvanizado en caliente con recubrimientos epóxicos de alta adherencia.
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                      Modulación y logística insular
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Modulación estructural en múltiplos de <strong>60 cm o 1.20 m</strong> (crujías tipo 3.00 m &times; 3.00 m o 3.60 m &times; 3.60 m) que admita componentes prefabricados livianos, fáciles de transportar en barcaza y ensamblar en seco sin maquinaria pesada.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                      Progresividad estructural
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Estructura portante primaria sobredimensionada para soportar futuras adiciones horizontales o un segundo piso liviano mediante procesos de autoconstrucción dirigida.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Criterio Hidrosanitario */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider">Criterio 3</span>
                  <h4 className="text-xl font-bold text-slate-900">3. Criterio Hidrosanitario</h4>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-2 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                    Sistema de Captación de Agua Pluvial (SCAP)
                  </h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>Superficies de cubierta aptas para uso hidrosanitario (tejas de arcilla o paneles de polialuminio/fibrocemento sin recubrimientos tóxicos).</li>
                    <li>Canaletas perimetrales sobredimensionadas con rejillas retenedoras de hojas y desviador de primeras aguas (<em>first flush</em> de 1–2 mm).</li>
                    <li>Aljibe o cisterna subterránea/semienterrada de concreto protegido del sol, dimensionado para cubrir la reserva del período de sequía estival (diciembre–abril).</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                      Tratamiento descentralizado y seguro de excretas
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Empleo de tanques sépticos biodigestores anaerobios estancos con cámara de cloración y biofiltros, o sistemas de saneamiento ecológico seco en áreas críticas donde el nivel freático alto impida la infiltración convencional.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                      Segregación y reciclaje de aguas grises
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Redes separadas para lavaderos y duchas dirigidas a desarenadores, trampa de grasas y biofiltros de lecho vegetal (fitorremediación con juncos y papiros) para reutilización exclusiva en riego de patios y huertos de pancoger.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Criterio Sociocultural */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">Criterio 4</span>
                  <h4 className="text-xl font-bold text-slate-900">4. Criterio Sociocultural</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Umbral de transición (El porche o pretil comunitario)
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Espacio intermedio semicubierto frontal abierto hacia la calle. Es el lugar de contacto social cotidiano caribeño, descanso al atardecer, vigilancia comunitaria y encuentro sin perder el control de la intimidad doméstica.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Flexibilidad para familia extendida
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Distribución espacial flexible con tabiquería modular o paneles deslizables de celosía que permiten transformar salones comunes en dormitorios adicionales ante la llegada temporal o permanente de parientes (núcleos matrifocales y multigeneracionales).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    La cocina y el patio de labores
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Ubicación de la cocina en franca ventilación con un patio posterior abierto. Permite la cocción tradicional con fuego o leña, la limpieza de pescado y el lavado de ropa a cielo abierto sin calentar los dormitorios.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Área técnica náutica y de oficios
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Zona techada y ventilada de fácil lavado para el resguardo de atarrayas, anzuelos, aperos de pesca, motores fuera de borda o para el secado de productos y labores artesanales.
                  </p>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Identidad tectónica y cromática
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Uso de calados geométricos superiores para ventilación cenital, barandillas en carpintería de madera y muros con soporte para pintura de colores vivos tradicionales del Caribe insular.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      
        {/* ========================================================= */}
        {/* CRITERIOS INTEGRADOS DE DISEÑO PARA EL EQUIPAMIENTO EDUCATIVO */}
        {/* ========================================================= */}
        <div id="criterios-colegio" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-50 via-blue-50/50 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                <span>Equipamiento Educativo &bull; Centro Cívico</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">Infraestructura Bioclimática & Vocación Comunitaria</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Criterios Integrados de Diseño para el Equipamiento Educativo en Tierra Bomba
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              Lineamientos técnicos, ambientales e institucionales para el complejo escolar bioclimático, macro-cuenca de captación pluvial y núcleo de cogobernanza comunitaria en la meseta (+22.00 m.s.n.m.).
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* 1. Criterio Bioclimático */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-teal-50/60 to-white border border-teal-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-wider">Criterio 1</span>
                  <h4 className="text-xl font-bold text-slate-900">1. Criterio Bioclimático</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-teal-900 flex items-center space-x-1.5">
                    <Sun className="w-4 h-4 text-teal-600" />
                    <span>Implantación y orientación de pabellones</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Disposición lineal de los bloques pedagógicos en sentido <strong>Este-Oeste</strong>, exponiendo las fachadas cortas al sol y garantizando que las caras largas (Norte y Sur) reciban iluminación cenital y difusa sin ganancia térmica directa.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-teal-900 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-teal-600" />
                    <span>Ventilación cruzada masiva en aulas</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Altura libre generosa (<strong>3.40 m a 4.00 m</strong>) con vanos inferiores a barlovento (vientos alisios) y aberturas altas a sotavento. Se prescinde de ventanas de vidrio herméticas en favor de cerramientos con celosías cerámicas, persianas de madera orientables o mampostería calada que garanticen renovación de aire continua sin necesidad de climatización mecánica.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-teal-900 flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Termosifón en grandes cubiertas</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Techos a dos aguas de gran pendiente (<strong>25–35%</strong>) con <strong>caballetes o cumbreras ventiladas continuas</strong> y linternas longitudinales para evacuar el aire caliente por flotabilidad térmica. Aislamiento superior mediante cámara de aire ventilada bajo la chapa o teja reflectiva.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-teal-900 flex items-center space-x-1.5">
                    <Leaf className="w-4 h-4 text-teal-600" />
                    <span>Patios bioclimáticos y microclima</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Articulación de las aulas alrededor de patios intermedios arborizados con especies nativas de bosque seco tropical y litoral (campano, guayacán, totumo, uvita de playa), que humedecen y enfrían el aire previo a su ingreso a los espacios de clase, además de atenuar la radiación sobre el suelo mediante sombra vegetal densa.
                  </p>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-teal-900 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Aleros protectores y galerías de circulación exterior</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Voladizos perimetrales profundos (<strong>2.00 m a 3.00 m</strong>) que cumplen triple función: pasillo de circulación exterior techado, amortiguador solar de las fachadas y protección contra lluvias torrenciales acompañadas de ráfagas de viento marino.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Criterio Constructivo */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider">Criterio 2</span>
                  <h4 className="text-xl font-bold text-slate-900">2. Criterio Constructivo</h4>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                    Zócalo elevado y protección contra la salinidad
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Estructuración sobre dados o losas elevadas entre <strong>0.50 m y 1.00 m</strong> sobre el terreno para prevenir el embate del nivel freático salino, permitir el drenaje de escorrentías pluviales en terrenos con poca absorción y generar una cámara de aire inferior que refrigere el piso de las aulas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-2 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                    Resistencia a corrosión extrema (Ambiente C5-M)
                  </h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>Concreto armado de alta durabilidad:</strong> Relación agua/cemento baja (&le; 0.40), aditivos puzolánicos o escoria para sellar la microporosidad y recubrimientos mínimos de acero de <strong>60 mm</strong> para contener la carbonatación por cloruros marinos.
                    </li>
                    <li>
                      <strong>Perfiles y madera estructural:</strong> Perfiles de acero galvanizado por inmersión en caliente con recubrimientos epóxico-poliuretano de alto espesor, o maderas estructurales duras inmunizadas bajo autoclave (guayacán, teca o abarco con certificación forestal).
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                      Modulación tectónica y logística insular
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Luces estructurales de <strong>6.00 m &times; 6.00 m o 7.20 m &times; 7.20 m</strong> moduladas para componentes livianos y transportables en barcazas desde Cartagena. Favorece el ensamble en seco y la reducción de fundiciones masivas en sitio, optimizando el consumo de agua dulce de mezclado.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                      Muros transpirables y de bajo mantenimiento
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Cerramientos con bloques de tierra comprimida (BTC) estabilizados con cal/cemento o mampostería de arcilla cocida a la vista, reduciendo costos recurrentes de pintura y estuco degradables por el salitre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Criterio Hidrosanitario */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider">Criterio 3</span>
                  <h4 className="text-xl font-bold text-slate-900">3. Criterio Hidrosanitario</h4>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-2 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                    Macro-sistema de Captación de Agua Pluvial (SCAP)
                  </h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>Las cubiertas de gran escala (aulas, comedor y polideportivo cubierto) operan como cuencas de captación pluvial de alto rendimiento.</li>
                    <li>Baterías de canalizaciones sobredimensionadas con sistemas de sedimentación, desarenadores ciclónicos y cámaras automáticas de separación de primeras aguas (<em>first flush</em> escolar a razón de <strong>2 mm</strong> de lluvia inicial).</li>
                    <li>Construcción de aljibes y depósitos semienterrados de almacenamiento masivo con capacidad estacional calculada para abastecer el consumo de la comunidad escolar y comunitaria durante el período de estiaje (diciembre a abril).</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                      Baterías sanitarias de alta eficiencia y saneamiento ecológico
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Aparatos sanitarios de bajo consumo (griferías hidromecánicas temporizadas y sanitarios de descarga dual &le; 4.8 L). Plantas de tratamiento biológico descentralizadas mediante biodigestores anaerobios estancos y humedales artificiales de flujo subsuperficial (fitorremediación con juncos y eneas).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1.5 shadow-2xs">
                    <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">
                      Circuito de aguas grises para huertos
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Segregación estricta de las aguas de lavamanos y cocinas escolares mediante trampas de grasa y biofiltros de grava/arena, redirigiendo el agua tratada hacia el riego por goteo de huertos pedagógicos de pancoger y reforestación del predio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Criterio Sociocultural */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">Criterio 4</span>
                  <h4 className="text-xl font-bold text-slate-900">4. Criterio Sociocultural</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    La escuela como equipamiento abierto (Doble uso cívico)
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Disolución del cerramiento ciego o muro perimetral carcelario. La infraestructura colectiva (biblioteca, aulas de cómputo/talleres, comedor comunitario y polideportivo) se zonifica en el perímetro frontal del lote para funcionar de forma autónoma durante las tardes, noches y fines de semana para asambleas del Consejo Comunitario, eventos culturales y capacitación técnica de adultos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Talleres de saberes locales y vocación del territorio
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Espacios formativos flexibles dedicados no solo a la educación académica formal, sino al aprendizaje de artes y oficios costeros: carpintería naval, reparación de motores marinos, tejeduría de artes de pesca, gastronomía afrocaribeña y laboratorios de monitoreo ambiental y restauración de manglares.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Ágoras, atrios y sombras de encuentro
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Incorporación de una plaza cívica o atrio techado al ingreso del colegio que sirve de umbral entre el sendero público y la institución. Es el lugar de estancia para padres de familia, punto de encuentro barrial, resguardo del sol y escenario para manifestaciones folclóricas, asambleas ciudadanas o festivales locales.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-1.5 shadow-2xs">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                    Identidad tectónica y sentido de pertenencia
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Integración de celosías decorativas inspiradas en patrones tradicionales de tejido insular, rotulación comunitaria y frentes que permitan muralismo y apropiación visual por parte de los estudiantes y líderes de los corregimientos de la isla.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      
        {/* ========================================================= */}
        {/* MATRIZ DE TRANSCODIFICACIÓN: PROFESORES Y ESTUDIANTES     */}
        {/* ========================================================= */}
        <div id="transcodificacion-colegio" className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-50 via-indigo-50/40 to-white border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>Actores Clave &bull; Antropología del Espacio</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">Docentes &bull; Estudiantes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Matriz de Transcodificación: Profesores y Estudiantes
            </h3>
            <p className="mt-3 text-base text-slate-700 leading-relaxed font-sans">
              Para los dos actores principales del día a día escolar —<strong>docentes</strong> y <strong>estudiantes</strong>—, el proceso de codificación traduce sus rutinas pedagógicas, corporales y emocionales en dimensiones, umbrales y respuestas bioclimáticas directas:
            </p>
          </div>

          <div className="p-4 sm:p-8 space-y-8">
            
            {/* Table Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                    <th className="py-3 px-4 rounded-tl-xl w-1/5">Actor</th>
                    <th className="py-3 px-4 w-3/10">Forma de Habitar Expresada ("Lo que dicen / viven")</th>
                    <th className="py-3 px-4 w-1/4">Variable Espacial Oculta</th>
                    <th className="py-3 px-4 rounded-tr-xl w-3/10">Decisión de Zonificación y Criterio de Diseño</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                  
                  {/* Docente 1 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>Docente</span>
                      </span>
                      <p className="text-[11px] text-teal-700 font-mono mt-1">Carga vocal y fatiga térmica</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "A las 11:00 AM ya no doy más de la garganta compitiendo contra el eco del salón, el viento y el grito de la cancha, además de que el calor aletarga a los muchachos."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Tiempo de reverberación acústica.</p>
                      <p>&bull; Velocidad y turbulencia del viento en el vano.</p>
                      <p>&bull; Temperatura operativa y fatiga física.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-teal-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Zonificación acústica protegida:</strong> Bloques de aulas aislados del polideportivo por patios arbolados. Cielorrasos inclinados de madera o caña con absorción acústica y muros laterales con celosía desfasada (el aire entra laminar, sin silbidos ni arrastre de ruido exterior).
                    </td>
                  </tr>

                  {/* Docente 2 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>Docente</span>
                      </span>
                      <p className="text-[11px] text-teal-700 font-mono mt-1">Logística y preparación sin red fija</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "No tenemos internet estable ni fotocopiadora cerca; necesitamos un lugar fresco donde guardar material didáctico que no se enmohezca por la salitre y donde planear clases en paz."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Protección higrométrica de insumos.</p>
                      <p>&bull; Confort lumínico de trabajo.</p>
                      <p>&bull; Concentración y privacidad.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-teal-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Sala de profesores como núcleo intermedio ventilado:</strong> Ubicada entre los pabellones de aulas (no en la entrada cívica), con orientación sur/norte para luz difusa sin reflejos en pantallas, mobiliario de guardado estanco con deshumidificación pasiva y visual directa a los patios de recreo.
                    </td>
                  </tr>

                  {/* Docente 3 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>Docente</span>
                      </span>
                      <p className="text-[11px] text-teal-700 font-mono mt-1">Vigilancia pasiva no invasiva</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "En el recreo uno no puede estar corriendo detrás de cada niño; el espacio tiene que permitir verlos sin sentirse como un celador de cárcel."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Líneas de visión despejadas.</p>
                      <p>&bull; Geometría de panóptico suave.</p>
                      <p>&bull; Puntos ciegos eliminados.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-teal-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Patios centrales con galerías perimetrales:</strong> Las circulaciones y pasillos de los docentes funcionan como miradores elevados (<strong>+0.60 m</strong>) sobre los patios de juego, permitiendo control visual 360° desde la sombra sin invadir la dinámica lúdica.
                    </td>
                  </tr>

                  {/* Estudiante 1 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Estudiante</span>
                      </span>
                      <p className="text-[11px] text-indigo-700 font-mono mt-1">Aulas: sofoco y dispersión</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "Estar sentados en filas mirando un tablero aburre y da sueño con el calor; preferimos ponernos en mesas redondas, en el piso o salir al fresco."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Flexibilidad de configuración de planta.</p>
                      <p>&bull; Confort térmico adaptativo.</p>
                      <p>&bull; Desjerarquización del espacio.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-indigo-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Aula porosa y no direccional:</strong> Planta cuadrada o hexagonal sin testero rígido. Muros abatibles o puertas correderas tipo persiana que permiten duplicar el área del aula abriéndola directamente hacia terrazas exteriores techadas bajo la copa de los árboles.
                    </td>
                  </tr>

                  {/* Estudiante 2 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Estudiante</span>
                      </span>
                      <p className="text-[11px] text-indigo-700 font-mono mt-1">Recreo: refugio del suelo ardiente</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "El patio de cemento quema los zapatos al mediodía; nos apiñamos todos en la sombrita del árbol viejo o nos sentamos en las escaleras."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Inercia térmica del pavimento.</p>
                      <p>&bull; Escala corporal de descanso.</p>
                      <p>&bull; Texturas táctiles del piso.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-indigo-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Microtopografía lúdica y suelo permeable:</strong> Se eliminan las explanadas masivas de concreto. Patios de recreo con suelo vivo (arena compactada, grava marina, césped costero) articulados con graderías de madera, muros bajos para sentarse y enramadas vegetales densas.
                    </td>
                  </tr>

                  {/* Estudiante 3 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Estudiante</span>
                      </span>
                      <p className="text-[11px] text-indigo-700 font-mono mt-1">Pertenencia y transición de escala</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed italic text-slate-800 font-serif">
                      "Cuando pasamos de la casa al colegio se siente todo muy frío y grande; queremos un rincón donde guardar nuestras cosas y sentirnos seguros."
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed text-xs space-y-1">
                      <p>&bull; Escala del individuo frente a la institución.</p>
                      <p>&bull; Territorialidad y nicho personal.</p>
                      <p>&bull; Gradiente de calma.</p>
                    </td>
                    <td className="py-4 px-4 align-top leading-relaxed bg-indigo-50/30 font-medium text-slate-900 rounded-r-lg">
                      <strong>Umbrales intermedios y nichos de descanso:</strong> Pasillos anchos (<strong>2.40 m a 3.00 m</strong>) equipados con nichos profundos de asiento en el espesor del muro (<em>bancas integradas</em>), casilleros ventilados de listones y zonas de lectura protegidas del flujo masivo de paso.
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Zonificación Operativa Resultante */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase">
                  Diagrama Funcional
                </span>
                <h4 className="text-xl font-bold text-slate-900">
                  Zonificación Operativa Resultante para el Día a Día Escolar
                </h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Al cruzar únicamente las dinámicas de docentes y alumnos, el módulo pedagógico se organiza internamente en un <strong>sistema celular de micro-comunidades</strong>:
              </p>

              {/* Graphic Flow Cards */}
              <div className="space-y-3 max-w-4xl mx-auto pt-2">
                
                {/* Wind Entry */}
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center font-mono text-xs font-bold text-teal-800 flex items-center justify-center space-x-2">
                  <Wind className="w-4 h-4 text-teal-600 animate-pulse" />
                  <span>[ BRISA FRESCA DEL NORTE / NORESTE (VIENTOS ALISIOS) ]</span>
                </div>

                <div className="flex justify-center text-teal-600 font-bold text-lg">&darr;</div>

                {/* Block 1 */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-white to-teal-500/10 border-2 border-teal-500/40 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-teal-600 text-white uppercase">Nivel 01</span>
                    <span className="text-xs font-mono text-teal-800 font-semibold">Microclima & Confort Interior</span>
                  </div>
                  <h5 className="font-bold text-base text-slate-900">PABELLÓN DE AULAS TEÓRICAS Y TALLERES</h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc pl-5">
                    <li>Fachadas largas orientadas Este-Oeste (sin sol directo).</li>
                    <li>Muros-celosía que tamizan la brisa marina.</li>
                    <li>Aulas integrables a terrazas cubiertas exteriores.</li>
                  </ul>
                </div>

                <div className="flex justify-center text-emerald-600 font-bold text-lg">&darr;</div>

                {/* Block 2 */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-white to-emerald-500/10 border-2 border-emerald-500/40 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-600 text-white uppercase">Nivel 02</span>
                    <span className="text-xs font-mono text-emerald-800 font-semibold">Evapotranspiración Activa</span>
                  </div>
                  <h5 className="font-bold text-base text-slate-900">PATIO BIOCLIMÁTICO DE RECREO Y APRENDIZAJE AL AIRE LIBRE</h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc pl-5">
                    <li>Sombra vegetal densa (árboles nativos de copa ancha: campano, guayacán, totumo).</li>
                    <li>Graderías bajas, suelo vegetal y microtopografías lúdicas.</li>
                    <li>Viento enfriado por evapotranspiración antes de entrar a las aulas.</li>
                  </ul>
                </div>

                <div className="flex justify-center text-indigo-600 font-bold text-xs font-mono text-indigo-700">
                  (Control visual pasivo continuo 360° desde galerías elevadas +0.60m)
                </div>
                <div className="flex justify-center text-indigo-600 font-bold text-lg">&darr;</div>

                {/* Block 3 */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-white to-indigo-500/10 border-2 border-indigo-500/40 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-600 text-white uppercase">Nivel 03</span>
                    <span className="text-xs font-mono text-indigo-800 font-semibold">Soporte & Gestión Pedagógica</span>
                  </div>
                  <h5 className="font-bold text-base text-slate-900">NÚCLEO DE APOYO DOCENTE Y RECURSOS DIDÁCTICOS</h5>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc pl-5">
                    <li>Sala de profesores elevada con vista panorámica al patio.</li>
                    <li>Archivo pedagógico y almacén técnico protegido del salitre.</li>
                    <li>Baterías de baños y puntos de hidratación pluvial certificados.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Decisiones de Diseño Clave */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-xl font-bold text-slate-900">
                Decisiones de Diseño Clave para la Propuesta
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-300 transition-colors">
                  <span className="text-xs font-mono font-bold text-teal-800 uppercase flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Decisión 01</span>
                  </span>
                  <h5 className="font-bold text-sm text-slate-900">El aula como pabellón expandible</h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    No concibas el aula como una caja cerrada de cuatro paredes de bloque. Diseña un núcleo con una crujía techada abierta al exterior, donde la clase teórica puede transformarse en taller grupal al aire libre en menos de un minuto simplemente desplazando los paneles de celosía.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-300 transition-colors">
                  <span className="text-xs font-mono font-bold text-teal-800 uppercase flex items-center space-x-1">
                    <Route className="w-3.5 h-3.5 text-teal-600" />
                    <span>Decisión 02</span>
                  </span>
                  <h5 className="font-bold text-sm text-slate-900">El pasillo deja de ser solo circulación</h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Con <strong>2.50 m a 3.00 m</strong> de ancho, el corredor exterior cubierto funciona como aula de extensión, espacio de socialización docente-alumno en los descansos y filtro térmico que absorbe la radiación antes de que llegue al interior del salón.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-300 transition-colors">
                  <span className="text-xs font-mono font-bold text-teal-800 uppercase flex items-center space-x-1">
                    <Leaf className="w-3.5 h-3.5 text-teal-600" />
                    <span>Decisión 03</span>
                  </span>
                  <h5 className="font-bold text-sm text-slate-900">Ergonomía climática comunitaria</h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Las superficies donde se sientan los estudiantes (bancas corridas, bordillos, gradas) se proyectan en maderas locales o tierra estabilizada, materiales de baja absorción térmica que no acumulan calor abrasivo bajo el sol del mediodía caribeño.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* TERRITORY MAP SECTION                                      */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Tu territorio en el mapa</h2>
                <p className="text-sm text-slate-600">Conoce la isla de Tierrabomba y cómo está tu comunidad</p>
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            <div className="text-center p-6">
              <div className="relative inline-block">
                <MapIcon className="w-24 h-24 mx-auto text-teal-600 mb-4" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
              </div>
              <p className="text-lg font-bold text-slate-900 mb-2">Mapa interactivo de Tierrabomba</p>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Explora tu territorio, los barrios, las rutas de lanchas y las zonas de riesgo.
              </p>
              <button
                onClick={() => onNavigateModule('territorio')}
                className="mt-4 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                Abrir mapa completo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ENVIRONMENTAL DATA SECTION                                 */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-teal-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Cómo está tu territorio</h2>
                <p className="text-sm text-slate-600">Datos ambientales de Tierrabomba</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
            {[
              { id: 'biomasa', label: 'Biomasa y Vegetación' },
              { id: 'erosion', label: 'Erosión Costera' },
              { id: 'agua', label: 'Agua y Humedad' },
              { id: 'basura', label: 'Basura y Residuos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveEnvTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeEnvTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 sm:p-6">
            {activeEnvTab === 'biomasa' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ENV_DATA.filter(d => d.icon === 'Leaf').map((d, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-green-50 border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-700" />
                        <span className="text-xs font-bold text-green-800">{d.name}</span>
                      </div>
                      <p className="text-2xl font-extrabold text-green-700">{d.value}</p>
                      <p className="text-xs text-green-600 mt-1">{d.status}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <b className="text-slate-900">¿Qué significa?</b> La meseta de Tierrabomba (+22m) tiene buena vegetación que ayuda a mantener el suelo estable y reduce la temperatura. El borde costero no tiene vegetación, lo que acelera la erosión.
                </p>
              </div>
            )}
            {activeEnvTab === 'erosion' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ENV_DATA.filter(d => d.icon === 'Activity').map((d, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-red-50 border border-red-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-red-700" />
                        <span className="text-xs font-bold text-red-800">{d.name}</span>
                      </div>
                      <p className="text-2xl font-extrabold text-red-700">{d.value}</p>
                      <p className="text-xs text-red-600 mt-1">{d.status}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl">
                  <p className="text-sm text-red-800 font-bold mb-2">⚠️ Zona de erosión activa</p>
                  <p className="text-sm text-red-700">
                    La costa oeste de Tierrabomba se erosiona hasta 1.8 metros por año. Las viviendas cercanas al mar están en peligro de colapso. La meseta (+22m) está fuera de peligro.
                  </p>
                </div>
              </div>
            )}
            {activeEnvTab === 'agua' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ENV_DATA.filter(d => d.icon === 'Wind').map((d, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wind className="w-5 h-5 text-blue-700" />
                        <span className="text-xs font-bold text-blue-800">{d.name}</span>
                      </div>
                      <p className="text-2xl font-extrabold text-blue-700">{d.value}</p>
                      <p className="text-xs text-blue-600 mt-1">{d.status}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <b className="text-slate-900">¿Qué significa?</b> La meseta de Tierrabomba tiene una temperatura moderada gracias a los vientos alisios. Esto ayuda a que las viviendas y el colegio tengan mejor confort térmico sin necesidad de aire acondicionado.
                </p>
              </div>
            )}
            {activeEnvTab === 'basura' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <p className="text-sm text-amber-800 font-bold mb-2">🗑️ Puntos de concentración de basura</p>
                  <div className="space-y-2">
                    {WASTE_POINTS.map((wp, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-amber-100">
                        <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${wp.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="font-bold text-sm text-slate-900">{wp.name}</p>
                          <p className="text-xs text-slate-600">{wp.waste}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <b className="text-slate-900">¿Qué se puede hacer?</b> La propuesta incluye un sistema de gestión de residuos con reciclaje, compostaje y bio-humedales que tratan las aguas grises. La comunidad puede participar en la separación de residuos y el compostaje para los huertos comunitarios.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOAT ROUTES SECTION                                        */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Rutas de lanchas</h2>
                <p className="text-sm text-slate-600">Cómo se mueve la comunidad entre Cartagena y la isla</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {BOAT_ROUTES.map((route, i) => (
                <div key={i} className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: route.color }} />
                  <div>
                    <p className="font-bold text-sm text-slate-900">{route.name}</p>
                    <p className="text-xs text-slate-500">{route.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <b className="text-slate-900">¿Por qué es importante?</b> Las lanchas son la única forma de llegar a la isla. La propuesta incluye mejorar los muelles y crear rutas más eficientes para que la comunidad pueda moverse mejor y a menor costo.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PROBLEMS SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-amber-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Los problemas que enfrenta la isla</h2>
                <p className="text-sm text-slate-600">Toca cada tarjeta para ver fotos reales</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'erosion', title: 'Erosión de las costas', color: '#e11d48', desc: 'El mar destruye las casas cerca del agua', icon: Waves },
                { key: 'agua', title: 'Falta de agua potable', color: '#d97706', desc: 'No hay red de agua ni desagües', icon: Droplets },
                { key: 'servicios', title: 'Falta de servicios y colegios', color: '#2563eb', desc: 'El colegio está en mal estado', icon: Building2 },
              ].map((prob) => (
                <button
                  key={prob.key}
                  onClick={() => {
                    setActiveProblemKey(prob.key);
                    setProblemSlideIndex(0);
                  }}
                  className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:shadow-lg transition-all text-left group"
                  style={{ borderColor: prob.color + '40' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: prob.color + '15', color: prob.color }}
                  >
                    <prob.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{prob.title}</h3>
                  <p className="text-sm text-slate-600">{prob.desc}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold" style={{ color: prob.color }}>
                    <span className="flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver fotos ({PROBLEM_GALLERIES[prob.key].images.length})</span>
                    </span>
                    <span>&rarr;</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-6 px-4 text-center text-sm text-slate-500">
        <p>
          Tierra Bomba: Hábitat Resiliente &bull; {projectInfo.author} &bull; Tesis de Grado en Arquitectura y Urbanismo (2026)
        </p>
      </footer>

      {/* ========================================================= */}
      {/* MODAL DE EVIDENCIA FOTOGRÁFICA DE PROBLEMÁTICA            */}
      {/* ========================================================= */}
      {activeProblemKey && PROBLEM_GALLERIES[activeProblemKey] && (() => {
        const activeProb = PROBLEM_GALLERIES[activeProblemKey];
        const activeImg = activeProb.images[problemSlideIndex] || activeProb.images[0];

        return (
          <div
            onClick={() => setActiveProblemKey(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-up"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="space-y-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: activeProb.color }}
                    >
                      {activeProb.code}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Evidencia en Sitio &bull; Foto {problemSlideIndex + 1} de {activeProb.images.length}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white truncate">
                    {activeProb.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveProblemKey(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Problem Quick Switch Tabs */}
              <div className="flex items-center gap-1.5 p-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto">
                {Object.values(PROBLEM_GALLERIES).map((prob) => {
                  const isCur = prob.id === activeProblemKey;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => {
                        setActiveProblemKey(prob.id);
                        setProblemSlideIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                        isCur
                          ? 'bg-white text-slate-950 shadow-sm border border-slate-300 ring-2 ring-slate-900/10'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: prob.color }}
                      />
                      <span>{prob.code}: {prob.id === 'erosion' ? 'Erosión Costera' : prob.id === 'agua' ? 'Agua Potable' : 'Servicios & Escuela'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Problem Description Banner */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 leading-snug">
                <p>
                  <b className="text-slate-900">{activeProb.badgeLabel}:</b> {activeProb.context}
                </p>
              </div>

              {/* Main Photo Viewer Area */}
              <div className="relative bg-slate-950 flex-1 min-h-[300px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
                <img
                  src={activeImg.url}
                  alt={activeImg.caption}
                  className="max-h-[50vh] max-w-full object-contain select-none transition-all duration-300 p-2"
                />

                {/* Floating Image Tag Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-mono font-bold shadow-lg">
                  {activeImg.tag}
                </div>

                {/* Slide Arrows */}
                {activeProb.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setProblemSlideIndex((prev) => (prev > 0 ? prev - 1 : activeProb.images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 backdrop-blur-sm cursor-pointer shadow-lg"
                      title="Foto anterior (Flecha Izquierda)"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => setProblemSlideIndex((prev) => (prev < activeProb.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 backdrop-blur-sm cursor-pointer shadow-lg"
                      title="Foto siguiente (Flecha Derecha)"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {activeProb.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {activeProb.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProblemSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === problemSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Caption and Source Footer */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                  {activeImg.caption}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-500 border-t border-slate-100">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="font-bold text-slate-900">Fuente:</span>
                    <span>{activeProb.source}</span>
                  </span>
                  <span className="text-teal-700 font-bold">
                    Tierrabomba &bull; Bahía de Cartagena
                  </span>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
