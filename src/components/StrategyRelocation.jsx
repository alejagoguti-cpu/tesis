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
  const [selectedStrategy, setSelectedStrategy] = useState(BIOCLIMATIC_STRATEGIES[2]);
  const [activeModal, setActiveModal] = useState(null);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'

  const bioMapRef = useRef(null);
  const bioMapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize Bioclimatic Leaflet Map with High-Resolution Satellite Aerial View
  useEffect(() => {
    if (!bioMapRef.current || bioMapInstanceRef.current) return;

    const map = L.map(bioMapRef.current, {
      center: [10.354, -75.572],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Aerial Satellite Layer (Esri World Imagery without API key)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    const labelsLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.85
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = labelsLayer;

    // Add strategy zone pins
    BIOCLIMATIC_STRATEGIES.forEach((strat) => {
      const pinIcon = L.divIcon({
        className: 'strat-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 rounded-full opacity-50 animate-ping" style="background-color: ${strat.color};"></div>
            <div class="w-10 h-10 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110" style="background-color: ${strat.color};">
              ${strat.id === 'rompeolas' ? '🌊' : strat.id === 'humedales' ? '💧' : strat.id === 'ventilacion' ? '🍃' : strat.id === 'sombras' ? '☀️' : '🌳'}
            </div>
            <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 text-[10px] text-white font-mono font-bold shadow-xl border border-white/20 pointer-events-none">
              ${strat.title.split('.')[1]}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
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

  // Layer type switcher
  useEffect(() => {
    const map = bioMapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);

    if (mapLayerType === 'satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      labelsLayerRef.current = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.85
      }).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
      labelsLayerRef.current = null;
    }
  }, [mapLayerType]);

  return (
    <div className="relative w-full h-[calc(100vh-4.2rem)] overflow-hidden animate-fade-in select-none">
      
      {/* 1. FULLSCREEN AERIAL SATELLITE MAP */}
      <div ref={bioMapRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Animated Wind Streams Overlay */}
      {showWindVectors && (
        <div className="absolute inset-0 pointer-events-none z-[350] overflow-hidden opacity-25">
          <div className="w-full h-full bg-[radial-gradient(#0d9488_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-pulse" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF SATELLITE MAP                          */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            04
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                BIOCLIMÁTICA & ENTORNO
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Alisios N-NE 18-28 km/h
              </span>
            </div>
            <h2 className="font-serif font-bold text-sm text-slate-900 truncate">
              {selectedStrategy.title}
            </h2>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowWindVectors(!showWindVectors)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              showWindVectors
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{showWindVectors ? 'Vientos: Activo' : 'Vientos: Off'}</span>
          </button>

          <button
            onClick={() => {
              if (onSelectModule) onSelectModule('simulations');
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Túnel CFD (Lab 08)</span>
          </button>

          <button
            onClick={() => setActiveModal(selectedStrategy)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Ficha Bioclimática</span>
          </button>
        </div>

        {/* Aerial Satellite / Carto Layer Toggle Button */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 self-start md:self-auto">
          <button
            onClick={() => setMapLayerType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              mapLayerType === 'satellite'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>🛰️ Vista Aérea</span>
          </button>
          <button
            onClick={() => setMapLayerType('carto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              mapLayerType === 'carto'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>🗺️ Plano</span>
          </button>
        </div>

      </div>

      {/* Floating Bottom: 5 Bioclimatic Strategy Pills directly ON TOP of the Satellite Map */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-6xl mx-auto pointer-events-auto">
          {BIOCLIMATIC_STRATEGIES.map((strat) => {
            const isSelected = selectedStrategy.id === strat.id;
            return (
              <button
                key={strat.id}
                onClick={() => {
                  setSelectedStrategy(strat);
                  if (bioMapInstanceRef.current) {
                    bioMapInstanceRef.current.flyTo(strat.coords, 15, { animate: true, duration: 1 });
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between backdrop-blur-md shadow-xl ${
                  isSelected
                    ? 'bg-white/95 border-teal-500 ring-2 ring-teal-400/30 scale-105 shadow-2xl'
                    : 'bg-white/90 hover:bg-white border-slate-200/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {strat.cota}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strat.color }} />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                    {strat.title}
                  </h4>
                </div>
                <span className="mt-2 text-[10px] font-mono font-bold text-teal-700 flex items-center justify-between">
                  <span>{strat.badge}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL POP-UP                                                    */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
                {activeModal.detail}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activeModal.specs.map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">{spec.label}</span>
                    <span className="font-serif font-bold text-sm text-slate-900 block mt-1">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold font-mono text-teal-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Rendimiento Pasivo Verificado</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Este criterio garantiza la reducción de la temperatura operativa interior sin necesidad de equipos de aire acondicionado mecánicos.
              </p>
            </div>

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
