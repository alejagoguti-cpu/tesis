import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Info, 
  Layers,
  Compass,
  ArrowUpRight,
  Home,
  GraduationCap,
  X,
  ExternalLink,
  Sparkles,
  Quote,
  Activity,
  Box,
  Printer,
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

export const HOTSPOTS_DATA = [
  {
    id: "erosion",
    name: "Franja de Erosión Crítica (Borde 0.00m)",
    category: "Riesgo Físico",
    categoryColor: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    badge: "1.8 m/año Retroceso",
    coords: [10.3580, -75.5780],
    elevation: "0.00 m.s.n.m. (Nivel del Mar)",
    summary: "Zona de socavación activa por oleaje y marea de leva donde 120 viviendas tradicionales tienen cimientos expuestos sobre arena suelta.",
    metrics: [
      { label: "Tasa de Retiro", value: "1.8 m/año" },
      { label: "Viviendas en Riesgo", value: "120 Hogares" },
      { label: "Pérdida en 10 años", value: "-18 metros" },
      { label: "Vulnerabilidad", value: "Crítica Inminente" }
    ],
    fieldQuote: "El mar no pide permiso: se nos está llevando el patio, la cocina y los cimientos de la casa.",
    actions: [
      { label: "Ver Simulación de Marea", target: "simulations" },
      { label: "Ver Marco de Tesis", target: "framework" }
    ]
  },
  {
    id: "meseta",
    name: "Meseta Central de Reubicación (+22.00m)",
    category: "Suelo Seguro",
    categoryColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    badge: "Inmune a Inundación",
    coords: [10.3520, -75.5640],
    elevation: "+22.00 m.s.n.m.",
    summary: "Plataforma geológica estable de 65 Hectáreas fuera del alcance del aumento del nivel del mar para los próximos 100 años.",
    metrics: [
      { label: "Cota de Seguridad", value: "+22.00 m" },
      { label: "Área de Intervención", value: "65 Hectáreas" },
      { label: "Tipo de Suelo", value: "Roca Caliza & Arcillas" },
      { label: "Riesgo Marino", value: "0% Inmune" }
    ],
    fieldQuote: "La meseta nos da tierra firme, aire fresco y la tranquilidad de no despertar con el agua en la cama.",
    actions: [
      { label: "Ver Masterplan 3D", target: "3dviewer" },
      { label: "Ver Planimetría 1:500", target: "cad" }
    ]
  },
  {
    id: "colegio",
    name: "Equipamiento Educativo, Comunitario & Náutico",
    category: "Dotacional",
    categoryColor: "bg-caribbean-500/10 text-caribbean-700 dark:text-caribbean-400 border-caribbean-500/20",
    badge: "350 Estudiantes",
    coords: [10.3510, -75.5620],
    elevation: "+22.50 m.s.n.m.",
    summary: "Complejo de 1.850 m² con 6 aulas bioclimáticas, talleres de pesca y carpintería ribereña, biblioteca y ágora central comunitaria.",
    metrics: [
      { label: "Capacidad Diurna", value: "350 Alumnos" },
      { label: "Área Construida", value: "1.850 m²" },
      { label: "Usuarios Fin de Semana", value: "1.200 Personas" },
      { label: "Ventilación", value: "100% Pasiva Cruzada" }
    ],
    fieldQuote: "Un colegio que además enseña a cuidar el mar, arreglar redes y almacena agua para todo el pueblo.",
    actions: [
      { label: "Explorar Modelo 3D del Colegio", target: "3dviewer" },
      { label: "Ver Planta Arquitectónica 1:100", target: "cad" }
    ]
  },
  {
    id: "aljibe",
    name: "Aljibe Central de 450.000 Litros",
    category: "Infraestructura Hídrica",
    categoryColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    badge: "450.000 L Reserva",
    coords: [10.3505, -75.5630],
    elevation: "+20.00 m (Subterráneo)",
    summary: "Cisterna comunitaria compartimentada alimentada por macro-cubierta invertida de 1.850 m² con tren de filtración y desinfección solar UV.",
    metrics: [
      { label: "Capacidad Total", value: "450.000 Litros" },
      { label: "Área de Captación", value: "8.330 m² Totales" },
      { label: "Autonomía en Sequía", value: "90 Días Continuos" },
      { label: "Calidad de Agua", value: "100% Potable UV" }
    ],
    fieldQuote: "No depender más de las barcazas de Cartagena: agua limpia y gratuita para toda la comunidad.",
    actions: [
      { label: "Ver Esquema Hidráulico", target: "water" },
      { label: "Simular Balance Hídrico", target: "simulations" }
    ]
  },
  {
    id: "viviendas",
    name: "120 Viviendas Palafíticas Resilientes",
    category: "Vivienda VIS",
    categoryColor: "bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-400 border-terracotta-500/20",
    badge: "120 Hogares",
    coords: [10.3535, -75.5660],
    elevation: "+22.00 m.s.n.m. (+0.60m elevación)",
    summary: "Módulos de 54 a 86 m² elevados sobre pilotes de madera tratada, celosías de arcilla BTC y porches sombreados de convivencia.",
    metrics: [
      { label: "Unidades Totales", value: "120 Viviendas" },
      { label: "Áreas Modulares", value: "54 m² a 86 m²" },
      { label: "Elevación Palafítica", value: "+0.60 m" },
      { label: "Materialidad", value: "Madera Teca & BTC" }
    ],
    fieldQuote: "Casas frescas que respetan nuestra arquitectura isleña y crecen según la necesidad de cada familia.",
    actions: [
      { label: "Ver Prototipo 3D de Vivienda", target: "3dviewer" },
      { label: "Ver Plano de Detalle 1:50", target: "cad" }
    ]
  },
  {
    id: "vientos",
    name: "Corredor de Vientos Alisios (N-NE)",
    category: "Bioclimática",
    categoryColor: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
    badge: "18.4 nudos N-NE",
    coords: [10.3620, -75.5580],
    elevation: "Nivel Atmosférico",
    summary: "Flujo constante de brisas marinas aprovechadas mediante orientación a 15° NE y celosías permeables para reducir hasta 5°C la temperatura interior.",
    metrics: [
      { label: "Velocidad Media", value: "18.4 nudos" },
      { label: "Dirección", value: "N-NE (15° Azimut)" },
      { label: "Caída Térmica", value: "-5 °C Pasivo" },
      { label: "Aleros de Sombra", value: "2.5 m Vuelo" }
    ],
    fieldQuote: "Aprovechar la brisa natural para no necesitar aire acondicionado mecánico.",
    actions: [
      { label: "Simular Túnel de Viento", target: "simulations" },
      { label: "Ver Estrategia Bioclimática", target: "bioclimatic" }
    ]
  },
  {
    id: "humedal",
    name: "Bio-Humedal de Fitodepuración & Huertos",
    category: "Sostenibilidad",
    categoryColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    badge: "Tratamiento 75%",
    coords: [10.3490, -75.5610],
    elevation: "+21.50 m.s.n.m.",
    summary: "Tratamiento biológico de aguas grises con plantas macrófitas y vetiver para la irrigación de huertos comunales y fijación de laderas.",
    metrics: [
      { label: "Aguas Recirculadas", value: "75% Grises" },
      { label: "Plantas Utilizadas", value: "Vetiver & Totoras" },
      { label: "Destino de Riego", value: "Huerto Comunitario" },
      { label: "Químicos Usados", value: "0% Biológico" }
    ],
    fieldQuote: "Cada gota de agua se usa dos veces: primero en las casas y luego para cultivar alimentos.",
    actions: [
      { label: "Ver Flujo de Aguas", target: "water" }
    ]
  },
  {
    id: "salinidad",
    name: "Acuífero Salinizado en Punta Arena",
    category: "Déficit Hídrico",
    categoryColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    badge: "34.2 PSU Salitre",
    coords: [10.3600, -75.5720],
    elevation: "Subsuelo 0.00m",
    summary: "Intrusión de agua de mar en los pozos artesanales costeros debido a la sobreexplotación y cercanía al oleaje, haciendo el agua no apta para beber.",
    metrics: [
      { label: "Salinidad Medida", value: "34.2 PSU" },
      { label: "Límite OMS Potable", value: "0.5 PSU" },
      { label: "Costo por Pimpina", value: "$8.000 COP / 20L" },
      { label: "Gasto Familiar", value: ">20% del Ingreso" }
    ],
    fieldQuote: "El agua de los pozos sabe a mar. Toca esperar a que la barcaza traiga pimpinas caras desde Cartagena.",
    actions: [
      { label: "Ver Diagnóstico Completo", target: "framework" },
      { label: "Ver Solución de Aljibe", target: "water" }
    ]
  }
];

export default function DiagnosisMap({ onNavigateModule }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [activeLayerFilter, setActiveLayerFilter] = useState('all'); // 'all', 'risk', 'relocation', 'water'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'impact'

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Clean up if already initialized
    if (mapInstanceRef.current?.map) {
      mapInstanceRef.current.map.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    // Initialize Leaflet Map centered on Tierrabomba
    const map = L.map(mapContainerRef.current, {
      center: [10.3540, -75.5680],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // High clarity Voyager white tiles (clean light look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Layer 1: Critical Erosion Line (Red dashed)
    const erosionLine = L.polyline([
      [10.3700, -75.5600],
      [10.3650, -75.5720],
      [10.3500, -75.5850],
      [10.3350, -75.5900],
      [10.3200, -75.5880],
    ], {
      color: '#dc2626',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.85,
    }).addTo(map);
    erosionLine.on('click', () => setSelectedHotspot(HOTSPOTS_DATA.find(h => h.id === 'erosion')));

    // Layer 2: Relocation Safe Plateau Polygon (+22m)
    const safeZonePolygon = L.polygon([
      [10.3560, -75.5700],
      [10.3580, -75.5600],
      [10.3460, -75.5560],
      [10.3440, -75.5660],
    ], {
      color: '#059669',
      fillColor: '#059669',
      fillOpacity: 0.25,
      weight: 2.5,
    }).addTo(map);
    safeZonePolygon.on('click', () => setSelectedHotspot(HOTSPOTS_DATA.find(h => h.id === 'meseta')));

    // Markers Group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Render interactive circular pin markers with click events
    HOTSPOTS_DATA.forEach((spot) => {
      const isRisk = spot.id === 'erosion' || spot.id === 'salinidad';
      const markerColor = isRisk ? '#dc2626' : spot.id === 'aljibe' ? '#2563eb' : '#c86d51';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="
          background-color: ${markerColor};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <span style="width: 8px; height: 8px; background: white; border-radius: 50%;"></span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(spot.coords, { icon: customIcon }).addTo(markersGroup);
      marker.on('click', () => {
        setSelectedHotspot(spot);
        map.panTo(spot.coords, { animate: true });
      });
    });

    mapInstanceRef.current = { map, erosionLine, safeZonePolygon };

    return () => {
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectSpotFromList = (spot) => {
    setSelectedHotspot(spot);
    if (mapInstanceRef.current?.map) {
      mapInstanceRef.current.map.panTo(spot.coords, { animate: true });
    }
  };

  const filteredSpots = HOTSPOTS_DATA.filter((spot) => {
    if (activeLayerFilter === 'all') return true;
    if (activeLayerFilter === 'risk') return spot.id === 'erosion' || spot.id === 'salinidad';
    if (activeLayerFilter === 'relocation') return spot.id === 'meseta' || spot.id === 'viviendas' || spot.id === 'colegio';
    if (activeLayerFilter === 'water') return spot.id === 'aljibe' || spot.id === 'humedal';
    return true;
  });

  return (
    <div className="space-y-6 py-4 animate-fade-in relative">
      
      {/* Top Header & Layer Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-deepsea-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-400 text-xs font-mono font-medium border border-terracotta-500/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS &bull; DIAGNÓSTICO & REUBICACIÓN EN TIERRABOMBA</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-sand-100">
            Cartografía Interactiva de Diagnóstico & Hábitat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-sand-300 font-light max-w-2xl">
            Haz clic en cualquier punto del mapa o selecciona los nodos inferiores para inspeccionar los datos técnicos y memorias de cada componente del proyecto.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-deepsea-900 rounded-xl border border-slate-200 dark:border-deepsea-800 text-xs font-mono self-start">
          <button
            onClick={() => setActiveLayerFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayerFilter === 'all'
                ? 'bg-white dark:bg-terracotta-600 text-slate-900 dark:text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-sand-400 hover:text-slate-900'
            }`}
          >
            Todos ({HOTSPOTS_DATA.length})
          </button>
          <button
            onClick={() => setActiveLayerFilter('risk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayerFilter === 'risk'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'text-red-700 dark:text-red-400 hover:bg-red-50'
            }`}
          >
            Riesgo Borde
          </button>
          <button
            onClick={() => setActiveLayerFilter('relocation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayerFilter === 'relocation'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
            }`}
          >
            Meseta (+22m)
          </button>
          <button
            onClick={() => setActiveLayerFilter('water')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayerFilter === 'water'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-blue-700 dark:text-blue-400 hover:bg-blue-50'
            }`}
          >
            Agua & Aljibe
          </button>
        </div>
      </div>

      {/* Main Map Viewport Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-deepsea-800 shadow-xl bg-white dark:bg-deepsea-950">
        
        {/* Leaflet Canvas */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[540px] sm:h-[600px] z-10"
        />

        {/* Floating Map Legend Overlay (HUD) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block">
          <div className="bg-white/95 dark:bg-deepsea-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-deepsea-800 shadow-lg text-xs font-mono space-y-2 pointer-events-auto max-w-[240px]">
            <span className="font-bold text-[10px] uppercase text-slate-500 dark:text-sand-400 tracking-wider">
              Capas del Territorio
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-red-600" />
                <span className="text-slate-800 dark:text-sand-200">Erosión Costera (1.8m/a)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-emerald-600/30 border border-emerald-600" />
                <span className="text-slate-800 dark:text-sand-200">Meseta Segura (+22m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-800 dark:text-sand-200">Aljibe Central 450kL</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600" />
                <span className="text-slate-800 dark:text-sand-200">Viviendas & Colegio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Instruction Chip */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center space-x-2 shadow-lg">
            <span>🖱️ Toca los puntos en el mapa para ver la ficha técnica</span>
          </div>
        </div>

      </div>

      {/* Quick Hotspots Selection Pills Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-sand-400 font-bold">
          Puntos de Inspección Rápida:
        </span>
        <div className="flex flex-wrap gap-2">
          {filteredSpots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => handleSelectSpotFromList(spot)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-sand-100 dark:text-deepsea-950 font-bold shadow-md'
                    : 'bg-white dark:bg-deepsea-900 text-slate-700 dark:text-sand-300 border-slate-200 dark:border-deepsea-800 hover:border-terracotta-500'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span>{spot.name}</span>
                <span className="text-[10px] opacity-70">({spot.elevation})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INTERACTIVE INSPECTION POPUP / MODAL (RAPOT / MODELAMIENTO2 LOOK)     */}
      {/* ===================================================================== */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          
          <div className="w-full max-w-2xl bg-white dark:bg-deepsea-900 rounded-3xl border border-slate-200 dark:border-deepsea-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-deepsea-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-deepsea-950/50">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${selectedHotspot.categoryColor}`}>
                    {selectedHotspot.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-sand-400">
                    Cota: {selectedHotspot.elevation}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 dark:text-sand-100">
                  {selectedHotspot.name}
                </h3>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-deepsea-800 dark:hover:bg-deepsea-700 text-slate-700 dark:text-sand-300 transition-colors"
                aria-label="Cerrar Ficha"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Summary Description */}
              <p className="text-sm text-slate-700 dark:text-sand-300 leading-relaxed font-light">
                {selectedHotspot.summary}
              </p>

              {/* 4 KPI Metrics Grid */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-sand-400 font-bold block mb-2.5">
                  Parámetros del Componente:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedHotspot.metrics.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-deepsea-950 border border-slate-200/80 dark:border-deepsea-800">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-sand-400 block truncate">
                        {m.label}
                      </span>
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-sand-100 mt-0.5">
                        {m.value}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Voice Bitácora Quote */}
              {selectedHotspot.fieldQuote && (
                <div className="p-4 rounded-2xl bg-terracotta-500/5 dark:bg-terracotta-500/10 border border-terracotta-500/20 flex items-start space-x-3">
                  <Quote className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 shrink-0 mt-0.5" />
                  <p className="font-serif italic text-xs sm:text-sm text-slate-800 dark:text-sand-200 leading-relaxed">
                    "{selectedHotspot.fieldQuote}"
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer / Direct Jump Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-deepsea-800 bg-slate-50/80 dark:bg-deepsea-950/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-500 dark:text-sand-400">
                Alejandra Gómez & Ana Casas &bull; Tesis 2026
              </span>

              <div className="flex items-center space-x-2">
                {selectedHotspot.actions?.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (onNavigateModule) onNavigateModule(act.target);
                      setSelectedHotspot(null);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-terracotta-600 dark:hover:bg-terracotta-500 text-white text-xs font-mono font-medium transition-all shadow-sm"
                  >
                    <span>{act.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
