import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Sun, 
  Wind, 
  TreePine, 
  CheckCircle2,
  Waves,
  Droplets,
  Layers,
  Sparkles,
  Maximize2,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap
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

export const BIOCLIMATIC_STRATEGIES = [
  {
    id: "rompeolas",
    title: "1. Bio-Arrecife & Estabilización de Borde",
    cota: "Cota 0.00 m.s.n.m.",
    coords: [10.3620, -75.5920],
    category: "Mitigación Costera",
    icon: "Waves",
    badge: "Disipación 85% Oleaje",
    color: "#dc2626",
    summary: "Estructuras sumergidas permeables y regeneración de manglar de borde que amortiguan la energía de la marea de leva sin represar sedimentos.",
    specs: [
      { label: "Reducción Energía de Ola", value: "-85%" },
      { label: "Materialidad", value: "Geotubos & Roca Caliza" },
      { label: "Recuperación de Playa", value: "3.5 m en 5 años" },
      { label: "Biodiversidad", value: "Arrecife Coralino" }
    ],
    detail: "La estrategia de borde evita obras duras reflectivas que trasladan la erosión. Se implementan disipadores bio-calcáreos que promueven la fijación de larvas coralinas y estabilizan la batimetría costera."
  },
  {
    id: "humedales",
    title: "2. Bio-Humedales & Drenaje Pluvial",
    cota: "Cota +14.00 m a +18.00 m",
    coords: [10.3550, -75.5780],
    category: "Gestión de Escorrentía",
    icon: "Droplets",
    badge: "Fitodepuración Natural",
    color: "#0284c7",
    summary: "Cinturón de zanjas de bio-retención y humedales con vetiver y totoras que desaceleran las corrientes de lluvia hacia el mar.",
    specs: [
      { label: "Capacidad de Infiltración", value: "1.200 m³/tormenta" },
      { label: "Especies Vegetales", value: "Vetiver, Typha domingensis" },
      { label: "Control de Cárcavas", value: "100% Retención de lodo" },
      { label: "Uso de Agua Tratada", value: "Riego de Huertos" }
    ],
    detail: "El agua de escorrentía es guiada a través de terrazas escalonadas de bio-retención, impidiendo la formación de zanjas erosivas y recargando el manto freático superior."
  },
  {
    id: "ventilacion",
    title: "3. Ventilación Cruzada con Alisios (N-NE)",
    cota: "Cota +22.00 m (Meseta)",
    coords: [10.3520, -75.5650],
    category: "Confort Térmico Pasivo",
    icon: "Wind",
    badge: "-5.2 °C Sensación",
    color: "#0d9488",
    summary: "Orientación axial de pabellones escolares y viviendas a 15° NE para capturar los vientos dominantes y generar efecto Venturi en cubiertas.",
    specs: [
      { label: "Velocidad Promedio Viento", value: "18 - 28 km/h" },
      { label: "Renovaciones de Aire", value: "45 vol/hora" },
      { label: "Efecto Chimenea", value: "Ventilación Cenital" },
      { label: "Consumo HVAC", value: "0 kWh (100% Pasivo)" }
    ],
    detail: "Los bloques arquitectónicos se desfasaron para evitar sombras de viento. La diferencia de presión entre fachadas de barlovento y sotavento asegura un flujo laminar continuo."
  },
  {
    id: "sombras",
    title: "4. Aleros de 2.5m & Protección Solar",
    cota: "Cota +22.50 m (Cubiertas)",
    coords: [10.3505, -75.5630],
    category: "Control Solar Pasivo",
    icon: "Sun",
    badge: "Sombra 100% en Solsticios",
    color: "#d97706",
    summary: "Voladizos perimetrales de madera laminada que bloquean el 100% de la radiación directa entre las 10:00 y las 16:00 horas.",
    specs: [
      { label: "Proyección de Alero", value: "2.50 metros" },
      { label: "Factor Solar Vidrio/Celosía", value: "g = 0.18" },
      { label: "Temperatura Superficial", value: "29 °C vs 44 °C ext." },
      { label: "Iluminación Natural", value: "550 lux Difusos" }
    ],
    detail: "El ángulo de inclinación de cubiertas responde a la trayectoria cenital del Caribe (Latitud 10°N), evitando puntos calientes en las envolventes y reduciendo la carga térmica interior."
  },
  {
    id: "forestal",
    title: "5. Corredor Verde & Especies Nativas",
    cota: "Cota +20.00 m a +23.00 m",
    coords: [10.3480, -75.5680],
    category: "Microclima & Suelo",
    icon: "TreePine",
    badge: "4.5 Hectáreas Bosque Seco",
    color: "#16a34a",
    summary: "Reforestación con Guayacán, Ceiba Bonga y Matarratón que genera microclimas sombreados y cohesión radicular del suelo calcáreo.",
    specs: [
      { label: "Árboles Sembrados", value: "850 Individuos" },
      { label: "Especies Clave", value: "Guayacán, Ceiba, Campano" },
      { label: "Reducción Térmica Urbana", value: "-3.8 °C en Suelo" },
      { label: "Huella Hídrica de Riego", value: "0 (Resistentes a sequía)" }
    ],
    detail: "El bosque seco tropical actúa como cortina amortiguadora frente a vientos huracanados y estabiliza las pendientes de la meseta mediante redes radiculares profundas."
  }
];

export default function StrategyRelocation({ onSelectModule }) {
  const [selectedStrategy, setSelectedStrategy] = useState(BIOCLIMATIC_STRATEGIES[2]); // Ventilación as default
  const [activeModal, setActiveModal] = useState(null);
  const [solarHour, setSolarHour] = useState(12); // 8, 12, 15, 17
  const [showWindVectors, setShowWindVectors] = useState(true);

  const bioMapRef = useRef(null);
  const bioMapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize Bioclimatic Leaflet Map
  useEffect(() => {
    if (!bioMapRef.current || bioMapInstanceRef.current) return;

    const map = L.map(bioMapRef.current, {
      center: [10.354, -75.572],
      zoom: 14,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Add strategy zone pins
    BIOCLIMATIC_STRATEGIES.forEach((strat) => {
      const pinIcon = L.divIcon({
        className: 'strat-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 rounded-full opacity-40 animate-ping" style="background-color: ${strat.color};"></div>
            <div class="w-9 h-9 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs" style="background-color: ${strat.color};">
              ${strat.id === 'rompeolas' ? '🌊' : strat.id === 'humedales' ? '💧' : strat.id === 'ventilacion' ? '🍃' : strat.id === 'sombras' ? '☀️' : '🌳'}
            </div>
            <div class="absolute -bottom-6 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 text-[10px] text-white font-mono shadow-md pointer-events-none">
              ${strat.title.split('.')[1]}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(strat.coords, { icon: pinIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedStrategy(strat);
        setActiveModal(strat);
      });
      markersRef.current.push(marker);
    });

    bioMapInstanceRef.current = map;

    return () => {
      map.remove();
      bioMapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-8 py-2 animate-fade-in">
      
      {/* Chapter 04 Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-widest">
              Capítulo 04 // Criterios Ambientales
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Estrategias Territoriales & Criterios Bioclimáticos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl">
            Arquitectura pasiva caribeña: orientación eólica (N-NE), protección solar perimetral, masa térmica en BTC y bio-humedales de retención pluvial.
          </p>
        </div>

        {/* Dynamic Controls */}
        <div className="flex items-center flex-wrap gap-3 self-start md:self-center">
          <button
            onClick={() => setShowWindVectors(!showWindVectors)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              showWindVectors
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{showWindVectors ? 'Vientos Alisios: Activo' : 'Vientos: Pausado'}</span>
          </button>

          <button
            onClick={() => {
              if (onSelectModule) onSelectModule('simulations');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Túnel de Viento (Lab 08)</span>
          </button>
        </div>
      </div>

      {/* 5 Bioclimatic Strategy Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {BIOCLIMATIC_STRATEGIES.map((strat) => {
          const isSelected = selectedStrategy.id === strat.id;
          return (
            <div
              key={strat.id}
              onClick={() => {
                setSelectedStrategy(strat);
                if (bioMapInstanceRef.current) {
                  bioMapInstanceRef.current.flyTo(strat.coords, 15, { animate: true, duration: 1 });
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-400/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {strat.cota}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strat.color }} />
                </div>

                <h4 className="font-serif font-bold text-xs text-slate-900 leading-snug">
                  {strat.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-2">
                  {strat.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-teal-700">
                  {strat.badge}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStrategy(strat);
                    setActiveModal(strat);
                  }}
                  className="p-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors"
                  title="Ver Ficha Técnica"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Full Bioclimatic Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Top Floating Info Strip */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {selectedStrategy.category}
              </span>
              <h3 className="font-serif font-bold text-sm text-slate-900">
                {selectedStrategy.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              {selectedStrategy.summary}
            </p>
          </div>

          <button
            onClick={() => setActiveModal(selectedStrategy)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold shadow-md shadow-teal-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ficha Bioclimática Completa</span>
          </button>
        </div>

        {/* Animated Streamline Wind Vector Overlay */}
        {showWindVectors && (
          <div className="absolute inset-0 pointer-events-none z-[350] overflow-hidden opacity-30">
            <div className="w-full h-full bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
          </div>
        )}

        {/* Leaflet Map */}
        <div ref={bioMapRef} className="w-full h-[520px] z-0" />
      </div>

      {/* ========================================================================= */}
      {/* DETAILED STRATEGY MODAL POP-UP                                            */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-700 tracking-wider">
                    {activeModal.category} &bull; {activeModal.cota}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    {activeModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Technical Rationale */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
                {activeModal.detail}
              </p>

              {/* 4 Key Engineering Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activeModal.specs.map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">{spec.label}</span>
                    <span className="font-serif font-bold text-sm text-slate-900 block mt-1">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bioclimatic Materiality & Passive Strategies Info */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-2">
              <div className="flex items-center space-x-2 font-bold font-mono text-teal-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Rendimiento Pasivo Verificado</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Este criterio garantiza la reducción de la temperatura operativa interior sin necesidad de equipos de aire acondicionado mecánicos, disminuyendo a cero la dependencia de combustibles fósiles.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-400">
                Tesis 2026 // Alejandra Gómez & Ana Casas
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (onSelectModule) onSelectModule('simulations');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <span>Simular en Lab 08</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
