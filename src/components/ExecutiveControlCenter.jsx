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
  Activity,
  Calendar,
  Layers,
  X,
  ExternalLink,
  ChevronRight,
  Maximize2
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
    tagline: "Pesca Tradicional & Costa Natural",
    description: "Cartagena histórica y Bocagrande incipiente. Tierrabomba mantiene su bosque seco y costa arenosa con mínima erosión por tráfico mercante.",
    color: "#0284c7",
    metrics: [
      { label: "Población", value: "~1.800 hab." },
      { label: "Tráfico Buques", value: "Bajo (Calado 8m)" },
      { label: "Tasa Erosión", value: "0.3 m/año" },
      { label: "Cobertura Agua", value: "Aljibes y lluvia" }
    ]
  },
  {
    year: 2000,
    title: "2000: Auge Portuario Mamonal",
    tagline: "Industrialización & Oleaje Pesado",
    description: "Expansión del corredor Mamonal y dragado de Bocachica para buques Panamax. La energía de olas secundarias acelera la pérdida costera insular.",
    color: "#d97706",
    metrics: [
      { label: "Población", value: "~3.100 hab." },
      { label: "Tráfico Buques", value: "Alto (Mamonal)" },
      { label: "Tasa Erosión", value: "1.1 m/año" },
      { label: "Crisis de Agua", value: "Compra por canecas" }
    ]
  },
  {
    year: 2026,
    title: "2026: Diagnóstico Crítico Actual",
    tagline: "Contraste Territorial & Vulnerabilidad",
    description: "Cartagena moderna con rascacielos frente a una isla sin acueducto formal (0%), 1.8 m/año de retroceso costero y 120 viviendas con cimientos socavados.",
    color: "#dc2626",
    metrics: [
      { label: "Población", value: "4.300 hab." },
      { label: "Acueducto Formal", value: "0% Red Pública" },
      { label: "Erosión Borde", value: "1.8 m/año (Crítico)" },
      { label: "Viviendas en Riesgo", value: "120 Hogares" }
    ]
  },
  {
    year: 2050,
    title: "2050: Proyección & Masterplan Resiliente",
    tagline: "Soberanía Hídrica + Reubicación +22m",
    description: "Resiliencia activa: Reasentamiento de las 120 familias a suelo seguro (+22m), colegio bioclimático de 350 plazas y macro-aljibe de 450.000L.",
    color: "#0d9488",
    metrics: [
      { label: "Cota Seguridad", value: "+22.00 m.s.n.m." },
      { label: "Reserva Hídrica", value: "450.000 Litros" },
      { label: "Riesgo Marino", value: "0% Inmune" },
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
    <div className="space-y-6 py-2 animate-fade-in">
      
      {/* 1. TOP CENTERPIECE: CARTAGENA BAY EVOLUTION INTERACTIVE MAP */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Top Floating Header & Timeline Bar */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                00 // Dinámica Territorial Bahía de Cartagena
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {selectedYear}
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              {currentTimelineData.title} &bull; <span className="font-sans font-normal text-slate-600 text-xs">{currentTimelineData.tagline}</span>
            </h3>
          </div>

          {/* Timeline Pills Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 self-start md:self-center">
            {CARTAGENA_TIMELINE_YEARS.map((t) => {
              const isSelected = selectedYear === t.year;
              return (
                <button
                  key={t.year}
                  onClick={() => setSelectedYear(t.year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {t.year}
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Hint Badge */}
        <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-mono backdrop-blur-md shadow-md border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Haz clic sobre los puntos en el mapa para abrir la ficha diagnóstica</span>
        </div>

        {/* Leaflet Map */}
        <div ref={bayMapRef} className="w-full h-[540px] z-0" />
      </div>

      {/* 2. 6 EXECUTIVE MASTERPLAN KPI CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-600" />
            <h3 className="font-serif font-bold text-base text-slate-900">
              Indicadores Clave del Plan Maestro (KPIs)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Haz clic en un indicador para abrir su módulo
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* KPI 1: Housing */}
          <div 
            onClick={() => onSelectModule && onSelectModule('programs')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-terracotta-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-terracotta-50 text-terracotta-600 group-hover:scale-105 transition-transform">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-terracotta-50 text-terracotta-700">
                MOD 03
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Reubicación</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              120 Viviendas
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              54 - 86 m² sobre pilotes (+0.60m)
            </p>
          </div>

          {/* KPI 2: School */}
          <div 
            onClick={() => onSelectModule && onSelectModule('programs')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                DOTACIONAL
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Educativo</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              350 Alumnos
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              1.850 m² con talleres náuticos
            </p>
          </div>

          {/* KPI 3: Water */}
          <div 
            onClick={() => onSelectModule && onSelectModule('water')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                MOD 07
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Reserva Hídrica</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              450.000 L
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              90 días autonomía de sequía
            </p>
          </div>

          {/* KPI 4: Safe Plateau */}
          <div 
            onClick={() => onSelectModule && onSelectModule('gis')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                TERRITORIO
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Cota Segura</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              +22.00m
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              0% riesgo de socavación marina
            </p>
          </div>

          {/* KPI 5: Solar */}
          <div 
            onClick={() => onSelectModule && onSelectModule('bioclimatic')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                ENERGÍA
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Matriz Solar</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              100% FV
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              5.85 kWh/m²/día con acumulación
            </p>
          </div>

          {/* KPI 6: Bioclimatic Comfort */}
          <div 
            onClick={() => onSelectModule && onSelectModule('bioclimatic')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform">
                <Wind className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                CONFORT
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">Pasivo</p>
            <h4 className="font-serif font-bold text-xl text-slate-900 mt-0.5">
              -5.2 °C
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Vientos alisios y celosías BTC
            </p>
          </div>

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
