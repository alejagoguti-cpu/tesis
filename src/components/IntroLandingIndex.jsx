import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Home,
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
  Shield,
  TreePine,
  Route,
  AlertCircle,
  Info,
  Play,
  Heart,
  Sun,
  Moon,
  Fish,
  Tent,
  Star,
  Eye,
  Sparkles,
  Navigation,
  Layers,
  Camera,
  MessageCircle,
  Download,
  ExternalLink
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
      {/* HERO SECTION - COMMUNITY FOCUSED & VISUALLY APPEALING     */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 text-white py-16 sm:py-24 lg:py-32">
        {/* Animated wave background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.1)" />
            <path d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.15)" />
            <path d="M0,100 C360,60 720,120 1080,80 C1260,60 1380,100 1440,100 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-300/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-20 right-1/4 w-24 h-24 bg-red-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Title */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-bold text-white mb-6 backdrop-blur-sm">
              <Anchor className="w-4 h-4 animate-bounce" />
              <span>Tierra Bomba &bull; Bahía de Cartagena</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none mb-6 text-white drop-shadow-2xl">
              Tierra Bomba:<br />
              <span className="text-amber-200">un lugar para quedarse</span>
            </h1>
            <p className="text-xl sm:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
              Conoce tu territorio, sus problemas y la propuesta para que la comunidad pueda quedarse en la isla de forma segura.
            </p>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <button
              onClick={() => onNavigateModule('territorio')}
              className="group relative p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden"
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
              className="group relative p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden"
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
              onClick={() => onNavigateModule('3dviewer')}
              className="group relative p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Box className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">Recorre la propuesta</p>
                <p className="text-[11px] text-teal-100">El nuevo barrio en 3D</p>
              </div>
            </button>
            <button
              onClick={() => onNavigateModule('framework')}
              className="group relative p-5 rounded-3xl bg-white/15 border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all backdrop-blur-sm overflow-hidden"
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
