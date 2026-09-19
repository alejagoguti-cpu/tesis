import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  ShieldCheck,
  Droplets,
  Home,
  GraduationCap,
  Wind,
  Sun,
  Waves,
  Box,
  Printer,
  Map as MapIcon,
  ArrowRight,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText,
  Activity,
  Calendar,
  Layers,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import L from 'leaflet';

// Fix Leaflet marker icons safely in Vite/React
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (e) {
    // safe fallback
  }
}

export const CARTAGENA_TIMELINE_YEARS = [
  {
    year: 1980,
    title: "1980: Línea Base Histórica",
    tagline: "Pesca Tradicional & Aislamiento Natural",
    description: "Cartagena colonial y Bocagrande incipiente. Tierrabomba mantiene su bosque seco y costa arenosa con mínima erosión por tráfico mercante.",
    color: "#0284c7",
    metrics: [
      { label: "Población Tierrabomba", value: "~1.800 hab." },
      { label: "Tráfico de Buques", value: "Bajo (Calado 8m)" },
      { label: "Tasa de Erosión", value: "0.3 m/año" },
      { label: "Cobertura de Agua", value: "Aljibes y lluvia" }
    ]
  },
  {
    year: 2000,
    title: "2000: Auge Portuario Mamonal",
    tagline: "Industrialización de la Bahía & Aumento de Oleaje",
    description: "Expansión del corredor Mamonal y dragado del canal de Bocachica para buques Panamax. La energía del oleaje acelera la pérdida costera insular.",
    color: "#d97706",
    metrics: [
      { label: "Población Tierrabomba", value: "~3.100 hab." },
      { label: "Tráfico de Buques", value: "Medio-Alto (Mamonal)" },
      { label: "Tasa de Erosión", value: "1.1 m/año" },
      { label: "Crisis de Agua", value: "Compra por canecas" }
    ]
  },
  {
    year: 2026,
    title: "2026: Diagnóstico Crítico Actual",
    tagline: "Contraste Territorial & Vulnerabilidad Inminente",
    description: "Cartagena moderna con rascacielos frente a una isla sin acueducto formal (0%), 1.8 m/año de retroceso costero y 120 viviendas con cimientos socavados.",
    color: "#dc2626",
    metrics: [
      { label: "Población Tierrabomba", value: "4.300 hab." },
      { label: "Acueducto Formal", value: "0% Red Pública" },
      { label: "Erosión Borde Costero", value: "1.8 m/año (Crítico)" },
      { label: "Viviendas en Riesgo", value: "120 Hogares" }
    ]
  },
  {
    year: 2050,
    title: "2050: Proyección & Masterplan Resiliente",
    tagline: "Soberanía Hídrica + Reubicación en Meseta (+22m)",
    description: "Resiliencia activa: Reasentamiento de las familias a suelo seguro (+22m), colegio bioclimático de 350 plazas y macro-aljibe de 450.000L.",
    color: "#0d9488",
    metrics: [
      { label: "Cota de Seguridad", value: "+22.00 m.s.n.m." },
      { label: "Capacidad de Reserva", value: "450.000 Litros" },
      { label: "Vulnerabilidad Marina", value: "0% Inmune" },
      { label: "Energía Solar", value: "100% Renovable" }
    ]
  }
];

export const BAY_HOTSPOTS = [
  {
    id: "cartagena_mainland",
    name: "Cartagena Continental (Bocagrande / Centro)",
    coords: [10.4000, -75.5500],
    category: "Contraste Urbano",
    badge: "Centro Financiero & Turístico",
    summary: "Zona de alta inversión hotelera y turística a solo 800 metros de Tierrabomba, reflejando la asimetría en inversión de servicios esenciales.",
    quote: "Desde la orilla de Tierrabomba vemos las luces de los rascacielos, pero aquí cocinamos con agua de pimpina.",
    metrics: [
      { label: "Cobertura de Agua", value: "99.2%" },
      { label: "Infraestructura", value: "Alta Densidad" },
      { label: "Distancia a Isla", value: "850 m" }
    ]
  },
  {
    id: "mamonal_port",
    name: "Corredor Industrial & Portuario Mamonal",
    coords: [10.3300, -75.5100],
    category: "Impacto Marítimo",
    badge: "Tráfico de Carga Pesada",
    summary: "Principal polo petroquímico e industrial. El oleaje secundario de los buques de gran calado impacta directamente el flanco oriental de la bahía.",
    quote: "Cada barco de gran porte que entra a la bahía empuja trenes de olas que erosionan la orilla de la isla.",
    metrics: [
      { label: "Tráfico Anual", value: "+3.500 Buques" },
      { label: "Impacto de Oleaje", value: "Alto Continuo" },
      { label: "Actividad", value: "Industrial" }
    ]
  },
  {
    id: "tierrabomba_erosion",
    name: "Tierrabomba: Franja de Erosión Crítica",
    coords: [10.3580, -75.5800],
    category: "Riesgo Físico",
    badge: "1.8 m/año Retroceso",
    summary: "120 viviendas en cota 0.00m con riesgo de colapso estructural por mareas de leva y retroceso costero.",
    quote: "La marea ya nos tumbó la enramada y el agua llega a los cuartos en época de mar de leva.",
    metrics: [
      { label: "Viviendas en Riesgo", value: "120 Familias" },
      { label: "Tasa de Retiro", value: "1.8 m/año" },
      { label: "Cota Actual", value: "+0.20m a +1.20m" }
    ]
  },
  {
    id: "tierrabomba_plateau",
    name: "Tierrabomba: Meseta Segura +22m (Tesis)",
    coords: [10.3520, -75.5640],
    category: "Propuesta de Tesis",
    badge: "Masterplan Resiliente",
    summary: "Ubicación estratégica del plan maestro: 120 viviendas de madera y BTC, colegio bioclimático y aljibe de 450.000 L.",
    quote: "La meseta nos da tierra firme, aire fresco y la tranquilidad de no despertar con el agua en la cama.",
    metrics: [
      { label: "Cota de Suelo", value: "+22.00 m.s.n.m." },
      { label: "Reserva Hídrica", value: "450.000 Litros" },
      { label: "Estudiantes", value: "350 Plazas" }
    ]
  },
  {
    id: "bocachica_fort",
    name: "Bocachica & Patrimonio Fuerte de San Fernando",
    coords: [10.3200, -75.5850],
    category: "Patrimonio Histórico",
    badge: "Siglo XVIII",
    summary: "Entrada marítima histórica a Cartagena con riqueza arquitectónica colonial y memoria de defensa naval insular.",
    quote: "Tierrabomba ha defendido a Cartagena durante siglos; hoy la isla necesita que cuidemos de su gente.",
    metrics: [
      { label: "Monumento", value: "Patrimonio Nacional" },
      { label: "Potencial", value: "Turismo Cultural" },
      { label: "Comunidad", value: "Pesca Artesanal" }
    ]
  }
];

export default function ExecutiveControlCenter({ onSelectModule }) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeHotspotModal, setActiveHotspotModal] = useState(null);

  const bayMapRef = useRef(null);
  const bayMapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const currentTimelineData = CARTAGENA_TIMELINE_YEARS.find(y => y.year === selectedYear) || CARTAGENA_TIMELINE_YEARS[2];

  // Initialize Cartagena Bay Map
  useEffect(() => {
    if (!bayMapRef.current || bayMapInstanceRef.current) return;

    const map = L.map(bayMapRef.current, {
      center: [10.365, -75.550],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Add Markers for Bay Hotspots
    BAY_HOTSPOTS.forEach(spot => {
      const isThesisPlateau = spot.id === 'tierrabomba_plateau';
      const isErosion = spot.id === 'tierrabomba_erosion';

      const customIcon = L.divIcon({
        className: 'bay-spot-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-1.5 rounded-full ${isThesisPlateau ? 'bg-teal-500/40 animate-pulse' : isErosion ? 'bg-red-500/40 animate-ping' : 'bg-sky-500/30'}"></div>
            <div class="w-8 h-8 rounded-xl ${isThesisPlateau ? 'bg-teal-600' : isErosion ? 'bg-red-600' : 'bg-slate-800'} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              ${isThesisPlateau ? '✨' : isErosion ? '⚠️' : '📍'}
            </div>
            <div class="absolute -bottom-6 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900/90 text-[10px] text-white font-mono shadow-md pointer-events-none">
              ${spot.name.split(':')[0]}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(spot.coords, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setActiveHotspotModal(spot);
      });
      markersRef.current.push(marker);
    });

    bayMapInstanceRef.current = map;

    return () => {
      map.remove();
      bayMapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      
      {/* Executive Header / Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-white border border-slate-200 shadow-sm text-slate-900">
        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-700 text-xs font-mono font-bold border border-terracotta-200">
              <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
              <span>TESIS DE GRADO EN ARQUITECTURA &bull; 2026</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
              {projectInfo.coordinates} &bull; Cota +22.00m
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-mono font-semibold border border-teal-200">
              Alejandra Gómez & Ana Casas
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
              Tierrabomba Resiliente
            </h1>
            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed max-w-3xl">
              Plan maestro de relocalización territorial para 120 familias de la franja de erosión crítica marina hacia la meseta segura (+22 m.s.n.m.), con equipamiento educativo bioclimático y soberanía hídrica autónoma de 450.000 L.
            </p>
          </div>

          {/* Community Field Bitácora Quote */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
            <Quote className="w-6 h-6 text-terracotta-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-serif italic text-slate-800 text-sm sm:text-base leading-relaxed">
                "{projectInfo.communityVoice.quote}"
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                — {projectInfo.communityVoice.author} &bull; <span className="opacity-75">{projectInfo.communityVoice.context}</span>
              </p>
            </div>
          </div>

          {/* Quick Module Jump CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectModule('framework')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-bold shadow-md shadow-terracotta-600/20 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Marco de Tesis (Lab 01)</span>
            </button>

            <button
              onClick={() => onSelectModule('gis')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              <MapIcon className="w-4 h-4" />
              <span>SIG Diagnóstico (Lab 02)</span>
            </button>

            <button
              onClick={() => onSelectModule('3dviewer')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              <Box className="w-4 h-4" />
              <span>Visor 3D Interactivo</span>
            </button>

            <button
              onClick={() => onSelectModule('simulations')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              <Activity className="w-4 h-4" />
              <span>Simulaciones Dinámicas (Lab 08)</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARTAGENA BAY EVOLUTION INTERACTIVE MAP & TIMELINE                        */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                Dinámica Territorial Bahía de Cartagena
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-slate-900">
              Evolución Histórica & Contraste Insular (1980 - 2050)
            </h3>
            <p className="text-xs text-slate-600 font-sans max-w-2xl">
              Selecciona una época en la línea de tiempo o presiona los puntos de interés en el mapa para examinar la transformación de la bahía y la vulnerabilidad de Tierrabomba.
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold self-start md:self-center">
            {selectedYear} en Visualización
          </span>
        </div>

        {/* Timeline Buttons Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CARTAGENA_TIMELINE_YEARS.map((t) => {
            const isSelected = selectedYear === t.year;
            return (
              <button
                key={t.year}
                onClick={() => setSelectedYear(t.year)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-lg font-serif font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {t.year}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-teal-400 animate-pulse' : 'bg-slate-300'}`} />
                </div>
                <p className={`text-[11px] font-mono font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {t.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Year Detail Banner */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-serif font-bold text-base text-slate-900">
              {currentTimelineData.title}
            </h4>
            <span className="text-xs font-mono text-slate-500">
              Línea de Base // Estudio Histórico y Proyectivo
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
            {currentTimelineData.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {currentTimelineData.metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{m.label}</span>
                <p className="font-serif font-bold text-sm text-slate-900 mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Leaflet Map of Cartagena Bay */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="absolute top-3 right-3 z-[400] px-3 py-1 rounded-lg bg-white/95 text-slate-800 text-[10px] font-mono font-bold shadow-md border border-slate-200 pointer-events-none">
            📍 Haz clic en los puntos del mapa para abrir detalles
          </div>
          <div ref={bayMapRef} className="w-full h-[460px] z-0" />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6 EXECUTIVE MASTERPLAN KPI CARDS GRID                                     */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Indicadores Clave del Plan Maestro (KPIs)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Parámetros de Diseño Tesis 2026
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* KPI 1: Housing */}
          <div 
            onClick={() => onSelectModule('programs')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-terracotta-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-terracotta-50 text-terracotta-600 group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700">
                MÓDULO 03
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Reubicación Habitacional</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              120 Viviendas
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              Tipologías progresivas de 54 a 86 m² con elevación palafítica (+0.60m) en madera y celosías BTC.
            </p>
          </div>

          {/* KPI 2: School */}
          <div 
            onClick={() => onSelectModule('programs')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                DOTACIONAL
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Equipamiento Educativo</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              350 Estudiantes
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              1.850 m² de aulas pasivas, talleres de pesca y carpintería náutica con ágora cívica central.
            </p>
          </div>

          {/* KPI 3: Water */}
          <div 
            onClick={() => onSelectModule('water')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                MÓDULO 07
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Reserva Hídrica Autónoma</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              450.000 Litros
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              Aljibe central inmune a salinización con filtrado solar UV y 90 días de autonomía de sequía.
            </p>
          </div>

          {/* KPI 4: Erosion Rate */}
          <div 
            onClick={() => onSelectModule('gis')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                TERRITORIO
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Cota Segura de Relocalización</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              +22.00 m.s.n.m.
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              Retiro de la franja costera con pérdida de 1.8 m/año. Cero riesgo de socavación marina.
            </p>
          </div>

          {/* KPI 5: Solar */}
          <div 
            onClick={() => onSelectModule('bioclimatic')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                ENERGÍA
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Matriz Energética Renovable</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              100% Fotovoltaica
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              Radiación de 5.85 kWh/m²/día con acumulación LiFePO4 para bombeo e iluminación comunal.
            </p>
          </div>

          {/* KPI 6: Bioclimatic Comfort */}
          <div 
            onClick={() => onSelectModule('bioclimatic')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                BIOCLIMÁTICA
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">Confort Pasivo Caribeño</p>
            <h4 className="font-serif font-bold text-3xl text-slate-900 mt-1">
              -5 °C Sensación
            </h4>
            <p className="text-xs text-slate-600 mt-2 font-light leading-relaxed">
              Aleros de 2.5m, ventilación cruzada con alisios N-NE y celosías cerámicas transpirables.
            </p>
          </div>

        </div>
      </div>

      {/* Impact Matrix: Current Situation vs Thesis Proposal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-2xl text-slate-900">
              Matriz de Impacto Territorial & Comunitario
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Diagnóstico de Línea Base vs. Propuesta de Arquitectura & Hábitat Resiliente
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-700 text-xs font-mono font-bold self-start">
            5 Factores de Transformación
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-bold uppercase">Factor Analizado</th>
                <th className="pb-3 pr-4 font-bold uppercase text-red-600">Línea Base (Actual)</th>
                <th className="pb-3 pr-4 font-bold uppercase text-emerald-600">Propuesta de Tesis</th>
                <th className="pb-3 font-bold uppercase text-terracotta-600">Ganancia de Resiliencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectInfo.impactMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 pr-4 font-bold text-slate-900">
                    {row.factor}
                  </td>
                  <td className="py-4 pr-4 text-slate-600 font-sans leading-relaxed">
                    {row.current}
                  </td>
                  <td className="py-4 pr-4 text-slate-800 font-sans font-medium leading-relaxed">
                    {row.proposed}
                  </td>
                  <td className="py-4 font-bold text-terracotta-600">
                    {row.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Credits Footnote */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-700">
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-terracotta-600 shrink-0" />
          <span><b>Proyecto de Grado:</b> {projectInfo.title} &bull; {projectInfo.year}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span><b>Tesistas:</b></span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-900">
            Alejandra Gómez & Ana Casas
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAY HOTSPOT MODAL POP-UP                                                  */}
      {/* ========================================================================= */}
      {activeHotspotModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {activeHotspotModal.category}
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {activeHotspotModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveHotspotModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
              {activeHotspotModal.summary}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <Quote className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
              <p className="font-serif italic text-xs text-slate-800 leading-relaxed">
                "{activeHotspotModal.quote}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {activeHotspotModal.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block">{m.label}</span>
                  <span className="font-serif font-bold text-xs text-slate-900 block mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Bahía de Cartagena // Tesis 2026
              </span>
              <button
                onClick={() => setActiveHotspotModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
