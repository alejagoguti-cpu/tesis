import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Maximize2,
  Search,
  Filter,
  Users,
  Building2,
  CheckCircle2,
  List
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import { HOUSING_CENSUS_120, HOUSING_CENSUS_SUMMARY } from '../data/housingCensus';
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
      { label: "Ver Simulador de Sequía", target: "simulations" }
    ]
  }
];

export default function DiagnosisMap({ onNavigateModule }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const housesLayerGroupRef = useRef(null);

  const [activeLayerFilter, setActiveLayerFilter] = useState('all'); // 'all' | 'risk' | 'relocation' | 'water' | 'census'
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showCensusDrawer, setShowCensusDrawer] = useState(false);
  const [censusSearch, setCensusSearch] = useState('');
  const [censusTypologyFilter, setCensusTypologyFilter] = useState('ALL'); // 'ALL' | 'TIPO-A' | 'TIPO-B'
  const [censusLocationMode, setCensusLocationMode] = useState('coastal'); // 'coastal' | 'plateau'

  // Filtered 1:1 houses list
  const filteredHouses = useMemo(() => {
    return HOUSING_CENSUS_120.filter((h) => {
      const matchSearch = h.id.toLowerCase().includes(censusSearch.toLowerCase()) ||
        h.familyName.toLowerCase().includes(censusSearch.toLowerCase()) ||
        h.sector.toLowerCase().includes(censusSearch.toLowerCase()) ||
        String(h.number).includes(censusSearch);

      const matchTypology = censusTypologyFilter === 'ALL' || h.typologyCode === censusTypologyFilter;

      return matchSearch && matchTypology;
    });
  }, [censusSearch, censusTypologyFilter]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [10.3540, -75.5720],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Satellite Aerial Layer (Esri World Imagery - 100% Free, Zero API Key)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = null;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Critical coastal erosion strip
    const erosionLine = L.polyline([
      [10.3700, -75.5890],
      [10.3640, -75.5830],
      [10.3580, -75.5780],
      [10.3520, -75.5740],
      [10.3440, -75.5710]
    ], {
      color: '#ef4444',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 6'
    }).addTo(map);

    // Safe Plateau Polygon (+22m)
    const safePlateau = L.polygon([
      [10.3560, -75.5680],
      [10.3570, -75.5580],
      [10.3480, -75.5520],
      [10.3440, -75.5580],
      [10.3460, -75.5720]
    ], {
      color: '#0d9488',
      fillColor: '#0d9488',
      fillOpacity: 0.28,
      weight: 3.5
    }).addTo(map);

    // Hotspot Markers Group
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

    // 120 Houses Layer Group
    const housesLayerGroup = L.layerGroup().addTo(map);
    housesLayerGroupRef.current = housesLayerGroup;

    mapInstanceRef.current = {
      map,
      erosionLine,
      safePlateau,
      markersGroup,
      housesLayerGroup
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update 120 Houses on the map when census layer or location mode changes
  useEffect(() => {
    if (!mapInstanceRef.current?.map || !housesLayerGroupRef.current) return;
    const housesGroup = housesLayerGroupRef.current;
    const map = mapInstanceRef.current.map;

    housesGroup.clearLayers();

    if (activeLayerFilter === 'census' || showCensusDrawer) {
      HOUSING_CENSUS_120.forEach((house) => {
        const coords = censusLocationMode === 'coastal' ? house.coastalCoords : house.plateauCoords;
        const isSelected = selectedHouse?.id === house.id;
        const isTypeB = house.typologyCode === 'TIPO-B';

        const houseIcon = L.divIcon({
          className: 'custom-house-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-6 h-6 rounded-lg ${
                isSelected 
                  ? 'bg-amber-500 ring-4 ring-amber-400/50 scale-125' 
                  : isTypeB 
                    ? 'bg-terracotta-600' 
                    : 'bg-slate-800'
              } border border-white shadow-md flex items-center justify-center text-white text-[9px] font-mono font-bold transition-all group-hover:scale-110">
                ${house.number}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const houseMarker = L.marker(coords, { icon: houseIcon });
        houseMarker.on('click', () => {
          setSelectedHouse(house);
          map.flyTo(coords, 16, { animate: true, duration: 0.8 });
        });

        houseMarker.addTo(housesGroup);
      });
    }
  }, [activeLayerFilter, showCensusDrawer, censusLocationMode, selectedHouse]);

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
        maxZoom: 19,
        attribution: 'Esri World Imagery'
      }).addTo(map);
      labelsLayerRef.current = null;
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
                120 VIVIENDAS 1:1
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-900 truncate">
              Vulnerabilidad, Censo 1:1 & Suelo Seguro (+22m)
            </h2>
          </div>
        </div>

        {/* GIS Layer Filters Bar */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center">
          
          <button
            onClick={() => {
              setActiveLayerFilter('all');
              setShowCensusDrawer(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeLayerFilter === 'all' && !showCensusDrawer
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Todas ({HOTSPOTS_DATA.length})
          </button>

          {/* Special Censo 1:1 Viviendas Button */}
          <button
            onClick={() => {
              setActiveLayerFilter('census');
              setShowCensusDrawer(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeLayerFilter === 'census' || showCensusDrawer
                ? 'bg-terracotta-600 text-white shadow-md'
                : 'bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100 border border-terracotta-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Censo 1:1 (120 Viviendas)</span>
          </button>

          <button
            onClick={() => {
              setActiveLayerFilter('risk');
              setShowCensusDrawer(false);
            }}
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
            onClick={() => {
              setActiveLayerFilter('relocation');
              setShowCensusDrawer(false);
            }}
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
            onClick={() => {
              setActiveLayerFilter('water');
              setShowCensusDrawer(false);
            }}
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

      {/* Floating Bottom: Hotspot Selection Strip (Hidden when Census Drawer is Open) */}
      {!showCensusDrawer && (
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
      )}

      {/* Floating Bottom-Left Legend HUD */}
      <div className="absolute top-24 left-4 z-[400] hidden lg:block pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Capas Territoriales</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">MIDAS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" />
            <span className="text-slate-800">Erosión Costera (1.8m/año)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-teal-500/30 border border-teal-500" />
            <span className="text-slate-800">Meseta Segura (+22m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-slate-900 border border-white flex items-center justify-center text-[8px] text-white font-bold">120</span>
            <span className="text-slate-800">Viviendas Censadas 1:1</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 1:1 HOUSING CENSUS DRAWER (120 DWELLINGS QUANTIFICATION)   */}
      {/* ========================================================================= */}
      {showCensusDrawer && (
        <div className="absolute bottom-4 left-4 right-4 z-[450] pointer-events-none animate-slide-up">
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 pointer-events-auto space-y-3.5 text-slate-900">
            
            {/* Drawer Header with Metrics & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-terracotta-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
                  120
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Censo Catastral & Cuantificación 1:1 (Tierrabomba)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {HOUSING_CENSUS_SUMMARY.totalResidents} Habitantes &bull; 72 Tipo A (54m²) &bull; 48 Tipo B (72m²) &bull; 100% Cota Cero Borde
                  </p>
                </div>
              </div>

              {/* Controls: Search, Typology filter & View mode */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Search box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar VIV-001 o familia..."
                    value={censusSearch}
                    onChange={(e) => setCensusSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-44 sm:w-56"
                  />
                </div>

                {/* Typology Toggle */}
                <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                  <button
                    onClick={() => setCensusTypologyFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      censusTypologyFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Todas ({HOUSING_CENSUS_120.length})
                  </button>
                  <button
                    onClick={() => setCensusTypologyFilter('TIPO-A')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      censusTypologyFilter === 'TIPO-A' ? 'bg-terracotta-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tipo A (54m²)
                  </button>
                  <button
                    onClick={() => setCensusTypologyFilter('TIPO-B')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      censusTypologyFilter === 'TIPO-B' ? 'bg-terracotta-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tipo B (72m²)
                  </button>
                </div>

                {/* Location View Switcher */}
                <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                  <button
                    onClick={() => setCensusLocationMode('coastal')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      censusLocationMode === 'coastal' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Borde 0.00m
                  </button>
                  <button
                    onClick={() => setCensusLocationMode('plateau')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      censusLocationMode === 'plateau' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Meseta +22m
                  </button>
                </div>

                {/* Close Drawer Button */}
                <button
                  onClick={() => setShowCensusDrawer(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  title="Cerrar Panel de Censo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Horizontal Chip Cards / Micro Matrix */}
            <div className="flex gap-2 overflow-x-auto pb-1 max-h-36 items-center">
              {filteredHouses.map((house) => {
                const isSelected = selectedHouse?.id === house.id;
                return (
                  <div
                    key={house.id}
                    onClick={() => {
                      setSelectedHouse(house);
                      if (mapInstanceRef.current?.map) {
                        const coords = censusLocationMode === 'coastal' ? house.coastalCoords : house.plateauCoords;
                        mapInstanceRef.current.map.flyTo(coords, 17, { animate: true, duration: 0.8 });
                      }
                    }}
                    className={`shrink-0 w-48 p-2.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102 ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        isSelected ? 'bg-terracotta-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {house.id}
                      </span>
                      <span className={isSelected ? 'text-amber-300' : 'text-red-600 font-bold'}>
                        {house.currentElevation}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs truncate">
                      {house.familyName}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>{house.residents} hab. &bull; {house.areaM2}m²</span>
                      <span className={house.typologyCode === 'TIPO-B' ? 'text-terracotta-400 font-bold' : ''}>
                        {house.typologyCode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FICHA CATASTRAL 1:1 POPUP MODAL (INDIVIDUAL HOUSEHOLD SURVEY)          */}
      {/* ========================================================================= */}
      {selectedHouse && (
        <div 
          onClick={() => setSelectedHouse(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto text-slate-900"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                    CENSO 1:1 // {selectedHouse.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    Riesgo: {selectedHouse.riskLevel}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedHouse.phase}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                  {selectedHouse.familyName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedHouse.sector} &bull; {selectedHouse.residents} Habitantes &bull; Actividad: {selectedHouse.livelihood}
                </p>
              </div>

              <button
                onClick={() => setSelectedHouse(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid: Actual vs Reubicada en Meseta */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Situation 1: Current Risk Shoreline */}
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-red-800 font-bold border-b border-red-200 pb-1.5">
                  <span>Situación Actual (Borde 0.00m)</span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p><b>Cota Altitudinal:</b> <span className="font-mono text-red-700 font-bold">{selectedHouse.currentElevation}</span></p>
                  <p><b>Retroceso por Oleaje:</b> {selectedHouse.erosionRate}</p>
                  <p><b>Estructura:</b> {selectedHouse.currentStructure}</p>
                  <p><b>Acceso a Agua:</b> {selectedHouse.waterCurrent}</p>
                </div>
              </div>

              {/* Situation 2: Proposed Resilient Relocation */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-800 font-bold border-b border-emerald-200 pb-1.5">
                  <span>Propuesta Tesis (Meseta +22m)</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p><b>Cota de Seguridad:</b> <span className="font-mono text-emerald-700 font-bold">{selectedHouse.targetElevation}</span></p>
                  <p><b>Ubicación:</b> {selectedHouse.manzana} - {selectedHouse.lote}</p>
                  <p><b>Tipología Asignada:</b> {selectedHouse.typology}</p>
                  <p><b>Soberanía Hídrica:</b> {selectedHouse.waterProposed}</p>
                </div>
              </div>

            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Área Construida</span>
                <span className="font-bold text-base text-slate-900 block mt-0.5">{selectedHouse.areaM2} m²</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Núcleo Familiar</span>
                <span className="font-bold text-base text-slate-900 block mt-0.5">{selectedHouse.residents} Personas</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Elevación Palafítica</span>
                <span className="font-bold text-base text-slate-900 block mt-0.5">+0.60 m</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Tanque Doméstico</span>
                <span className="font-bold text-base text-slate-900 block mt-0.5">2.500 L</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-400">
                Censo 1:1 Tierrabomba &bull; Tesis 2026
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (onNavigateModule) onNavigateModule('programs');
                    setSelectedHouse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-mono font-bold transition-colors flex items-center space-x-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Ver Prototipo de Vivienda</span>
                </button>
                <button
                  onClick={() => setSelectedHouse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOTSPOT DETAIL MODAL POP-UP                                            */}
      {/* ========================================================================= */}
      {selectedHotspot && (
        <div 
          onClick={() => setSelectedHotspot(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto text-slate-900"
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
