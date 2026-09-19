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
    categoryColor: "bg-red-500/10 text-red-700 border-red-500/20",
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
    categoryColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
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
    categoryColor: "bg-caribbean-500/10 text-caribbean-700 border-caribbean-500/20",
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
    categoryColor: "bg-blue-500/10 text-blue-700 border-blue-500/20",
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
    categoryColor: "bg-terracotta-500/10 text-terracotta-700 border-terracotta-500/20",
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
    categoryColor: "bg-teal-500/10 text-teal-700 border-teal-500/20",
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
    categoryColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
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
    categoryColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
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
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const [activeLayerFilter, setActiveLayerFilter] = useState('all'); // 'all', 'risk', 'relocation', 'water'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'

  // Initialize Map with High-Resolution Satellite Aerial View
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    if (mapInstanceRef.current?.map) {
      mapInstanceRef.current.map.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [10.3540, -75.5680],
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

    // Layer 1: Critical Erosion Line (Red dashed)
    const erosionLine = L.polyline([
      [10.3700, -75.5600],
      [10.3650, -75.5720],
      [10.3500, -75.5850],
      [10.3350, -75.5900],
      [10.3250, -75.5800]
    ], {
      color: '#ef4444',
      weight: 5,
      dashArray: '8, 6',
      opacity: 0.95
    }).addTo(map);

    // Layer 2: Safe Plateau Polygon (+22m)
    const safePlateau = L.polygon([
      [10.3580, -75.5700],
      [10.3600, -75.5580],
      [10.3520, -75.5520],
      [10.3440, -75.5580],
      [10.3460, -75.5720]
    ], {
      color: '#0d9488',
      fillColor: '#0d9488',
      fillOpacity: 0.28,
      weight: 3.5
    }).addTo(map);

    // Markers Group
    const markersGroup = L.layerGroup().addTo(map);

    HOTSPOTS_DATA.forEach((spot) => {
      const isPlateau = spot.id === 'meseta';
      const isErosion = spot.id === 'erosion';
      const isWater = spot.id === 'aljibe';

      const customIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 rounded-full ${isPlateau ? 'bg-emerald-400/40 animate-pulse' : isErosion ? 'bg-red-500/40 animate-ping' : isWater ? 'bg-blue-400/40 animate-pulse' : 'bg-slate-400/30'}"></div>
            <div class="w-8 h-8 rounded-xl ${isPlateau ? 'bg-emerald-600' : isErosion ? 'bg-red-600' : isWater ? 'bg-blue-600' : 'bg-slate-900'} border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
              ${isPlateau 
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>' 
                : isErosion 
                  ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' 
                  : isWater 
                    ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>' 
                    : '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
              }
            </div>
            <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 text-[10px] text-white font-mono font-bold shadow-xl border border-white/20 pointer-events-none">
              ${spot.name.split('(')[0]}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(spot.coords, { icon: customIcon });
      marker.on('click', () => {
        setSelectedHotspot(spot);
      });
      marker.addTo(markersGroup);
    });

    mapInstanceRef.current = {
      map,
      erosionLine,
      safePlateau,
      markersGroup
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Layer filter effects
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { erosionLine, safePlateau } = mapInstanceRef.current;

    if (activeLayerFilter === 'risk') {
      erosionLine.setStyle({ opacity: 1, weight: 8 });
      safePlateau.setStyle({ fillOpacity: 0.05, weight: 1 });
    } else if (activeLayerFilter === 'relocation') {
      erosionLine.setStyle({ opacity: 0.3, weight: 2 });
      safePlateau.setStyle({ fillOpacity: 0.45, weight: 5 });
    } else {
      erosionLine.setStyle({ opacity: 0.95, weight: 5 });
      safePlateau.setStyle({ fillOpacity: 0.28, weight: 3.5 });
    }
  }, [activeLayerFilter]);

  // Layer type switcher
  useEffect(() => {
    if (!mapInstanceRef.current?.map) return;
    const map = mapInstanceRef.current.map;

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

  const filteredSpots = HOTSPOTS_DATA.filter((spot) => {
    if (activeLayerFilter === 'risk') return spot.id === 'erosion' || spot.id === 'salinidad';
    if (activeLayerFilter === 'relocation') return spot.id === 'meseta' || spot.id === 'viviendas' || spot.id === 'colegio';
    if (activeLayerFilter === 'water') return spot.id === 'aljibe' || spot.id === 'humedal' || spot.id === 'salinidad';
    return true;
  });

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none">
      
      {/* 1. FULLSCREEN AERIAL SATELLITE MAP */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF SATELLITE MAP                          */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            02
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                SIG DIAGNÓSTICO // MIDAS CARTAGENA
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                IDE / POT 2026
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-900 truncate">
              Vulnerabilidad, Erosión Borde & Suelo Seguro (+22m)
            </h2>
          </div>
        </div>

        {/* GIS Layer Filters Bar */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 self-start md:self-center">
          <button
            onClick={() => setActiveLayerFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeLayerFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Todas ({HOTSPOTS_DATA.length})
          </button>
          <button
            onClick={() => setActiveLayerFilter('risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeLayerFilter === 'risk'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Riesgo Borde</span>
          </button>
          <button
            onClick={() => setActiveLayerFilter('relocation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeLayerFilter === 'relocation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Meseta +22m</span>
          </button>
          <button
            onClick={() => setActiveLayerFilter('water')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeLayerFilter === 'water'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Agua & Aljibe</span>
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
            <Layers className="w-3.5 h-3.5" />
            <span>Vista Aérea</span>
          </button>
          <button
            onClick={() => setMapLayerType('carto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              mapLayerType === 'carto'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Plano</span>
          </button>
        </div>

      </div>

      {/* Floating Bottom: Hotspot Selection Strip directly ON TOP of the Satellite Map */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="flex flex-wrap gap-2 max-w-6xl mx-auto pointer-events-auto justify-center">
          {filteredSpots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => {
                  setSelectedHotspot(spot);
                  if (mapInstanceRef.current?.map) {
                    mapInstanceRef.current.map.flyTo(spot.coords, 15, { animate: true, duration: 1 });
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-mono backdrop-blur-md transition-all border shadow-lg ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold scale-105 border-slate-900'
                    : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200/80'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span>{spot.name.split('(')[0]}</span>
                <span className="text-[10px] opacity-70">({spot.elevation})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom-Left Legend HUD */}
      <div className="absolute top-24 left-4 z-[400] hidden lg:block pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto space-y-1.5 text-xs font-mono">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Capas Territoriales</span>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" />
            <span className="text-slate-800">Erosión Costera (1.8m/año)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-teal-500/30 border border-teal-500" />
            <span className="text-slate-800">Meseta Segura (+22m)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL POP-UP                                                    */}
      {/* ========================================================================= */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${selectedHotspot.categoryColor}`}>
                    {selectedHotspot.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Cota: {selectedHotspot.elevation}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {selectedHotspot.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
              {selectedHotspot.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {selectedHotspot.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">{m.label}</span>
                  <span className="font-serif font-bold text-sm text-slate-900 block mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>

            {selectedHotspot.fieldQuote && (
              <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-start space-x-3">
                <Quote className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
                <p className="font-serif italic text-xs text-slate-800 leading-relaxed">
                  "{selectedHotspot.fieldQuote}"
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-400">
                Diagnóstico 2026 // A. Gómez & A. Casas
              </span>

              <div className="flex items-center space-x-2">
                {selectedHotspot.actions?.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (onNavigateModule) onNavigateModule(act.target);
                      setSelectedHotspot(null);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-medium transition-all shadow-sm"
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
