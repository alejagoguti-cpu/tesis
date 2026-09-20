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
  List,
  Sliders,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Move,
  Scan,
  RefreshCw,
  Flame,
  Leaf,
  Sun
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import { HOUSING_CENSUS_120, HOUSING_CENSUS_SUMMARY } from '../data/housingCensus';
import ndviImg from '../assets/spectral_ndvi.png';
import ndwiImg from '../assets/spectral_ndwi.png';
import falsoColorImg from '../assets/spectral_falsocolor.png';
import manglarImg from '../assets/spectral_manglar.png';
import termicoImg from '../assets/spectral_termico.png';
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

// =========================================================================
// SPECTRAL ANALYSIS SATELLITE BANDS DATASET (5 BANDAS ESPECTRALES)
// =========================================================================
export const SPECTRAL_LAYERS = [
  {
    id: 'ndvi',
    name: 'NDVI • Biomasa & Vegetación',
    shortName: 'NDVI Vegetación',
    badge: 'Índice de Vegetación',
    sensor: 'Sentinel-2 Multispectral (10m)',
    formula: '(NIR - Red) / (NIR + Red)',
    icon: Leaf,
    color: '#16a34a',
    accentClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    image: ndviImg,
    unit: 'Índice NDVI [-1.0 a +1.0]',
    legend: [
      { color: '#ffffff', label: 'Agua / Suelo Desnudo (< 0.1)' },
      { color: '#86efac', label: 'Vegetación Dispersa (0.2 - 0.4)' },
      { color: '#16a34a', label: 'Bosque Tropical / Meseta (0.5 - 0.7)' },
      { color: '#14532d', label: 'Dosel Denso / Manglar (> 0.75)' }
    ],
    summary: 'Detección de cobertura vegetal nativa y estrés hídrico. La meseta segura (+22.00m) concentra la mayor densidad de biomasa y suelo firme frente al borde costero socavado.',
    metrics: [
      { label: 'Cobertura Insular', value: '42.8%' },
      { label: 'Biomasa en Meseta', value: '65 Ha' },
      { label: 'Salud Vegetal', value: 'Media-Alta' },
      { label: 'Absorción CO2', value: '180 t/año' }
    ]
  },
  {
    id: 'ndwi',
    name: 'NDWI • Hidrografía & Humedad',
    shortName: 'NDWI Humedad',
    badge: 'Índice de Agua',
    sensor: 'Sentinel-2 Bandas B3/B8',
    formula: '(Green - NIR) / (Green + NIR)',
    icon: Droplets,
    color: '#0284c7',
    accentClass: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
    image: ndwiImg,
    unit: 'Índice NDWI [-1.0 a +1.0]',
    legend: [
      { color: '#ffffff', label: 'Tierra Firme Inmune (Meseta +22m)' },
      { color: '#7dd3fc', label: 'Franja Húmeda / Marea Activa' },
      { color: '#0284c7', label: 'Cuerpo de Agua Costero' },
      { color: '#0369a1', label: 'Canal de Acceso y Bahía Profunda' }
    ],
    summary: 'Delineación de la cuenca marina y límites de inundación costera. Constata el alto riesgo del borde 0.00m y la inmunidad hidrológica de la meseta central.',
    metrics: [
      { label: 'Espejo de Bahía', value: '82 km²' },
      { label: 'Línea de Costa', value: '18.4 km' },
      { label: 'Zona Inundable', value: 'Cota < +1.5m' },
      { label: 'Infiltración', value: 'Alta en Meseta' }
    ]
  },
  {
    id: 'falsocolor',
    name: 'Falso Color • Suelo vs Bahía',
    badge: 'Contraste Espectral',
    sensor: 'Composición B8-B4-B3',
    formula: 'NIR / Red / Green Composit',
    icon: Activity,
    color: '#ea580c',
    accentClass: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
    image: falsoColorImg,
    unit: 'Reflectancia Espectral',
    legend: [
      { color: '#1d4ed8', label: 'Cuenca Marítima Profunda' },
      { color: '#38bdf8', label: 'Aguas Someras Costeras' },
      { color: '#ea580c', label: 'Suelo Insular / Corregimiento' },
      { color: '#c2410c', label: 'Roca Firme Calcárea (Meseta)' }
    ],
    summary: 'Contraste de geomorfología entre la bahía de Cartagena y la plataforma insular. Evidencia la transición de suelo calcáreo firme a sedimentos marinos.',
    metrics: [
      { label: 'Suelo Expuesto', value: '57.2%' },
      { label: 'Frente Marino', value: 'Oeste Expuesto' },
      { label: 'Bahía Interna', value: 'Protegida' },
      { label: 'Tipo Roca', value: 'Caliza Coralina' }
    ]
  },
  {
    id: 'manglar',
    name: 'Bosque Seco & Manglares',
    badge: 'Ecosistemas Clave',
    sensor: 'Clasificación Supervisada GIS',
    formula: 'Banda B5 / B6 / B8A RedEdge',
    icon: Sparkles,
    color: '#15803d',
    accentClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-400/40',
    image: manglarImg,
    unit: 'Densidad de Dosel Arbóreo',
    legend: [
      { color: '#ffffff', label: 'Zona Antrópica / Sin Cobertura' },
      { color: '#bbf7d0', label: 'Matorral Seco Ralo' },
      { color: '#22c55e', label: 'Bosque Seco Tropical Relicto' },
      { color: '#14532d', label: 'Manglar Ribereño de Protección' }
    ],
    summary: 'Mapeo de barreras biológicas. Los manglares del flanco oriental amortiguan el oleaje secundario de buques mientras la meseta preserva bosque seco nativo.',
    metrics: [
      { label: 'Manglar Protegido', value: '14.2 Ha' },
      { label: 'Barrera Natural', value: 'Flanco Oriental' },
      { label: 'Reserva Arbórea', value: '38 Ha' },
      { label: 'Protección', value: 'Prioritaria' }
    ]
  },
  {
    id: 'termico',
    name: 'LST • Temperatura Superficial',
    badge: 'Infrarrojo Térmico',
    sensor: 'Landsat-8 TIRS (Band 10)',
    formula: 'Calibración Radiométrica LST (°C)',
    icon: Flame,
    color: '#eab308',
    accentClass: 'text-yellow-300 bg-yellow-950/80 border-yellow-500/40',
    image: termicoImg,
    unit: 'Temperatura Superficial (°C)',
    legend: [
      { color: '#1e3a8a', label: 'Mar / Bahía (~27°C - 29°C)' },
      { color: '#3b82f6', label: 'Costa Húmeda (~30°C)' },
      { color: '#eab308', label: 'Meseta y Vegetación (~32°C)' },
      { color: '#ef4444', label: 'Suelo Expuesto / Urbano (~36°C+)' }
    ],
    summary: 'Análisis de microclima y confort. La meseta +22m se beneficia de la ventilación cruzada del alisio, ofreciendo hasta 3.8°C menos que el concreto continental.',
    metrics: [
      { label: 'Temp. Mar Bahía', value: '28.5 °C' },
      { label: 'Temp. Meseta +22m', value: '31.2 °C' },
      { label: 'Delta vs Bocagrande', value: '-3.8 °C' },
      { label: 'Viento Alisio', value: '18 - 25 km/h' }
    ]
  }
];

export const DEFAULT_SPECTRAL_BOUNDS = {
  south: 10.2780,
  west: -75.6150,
  north: 10.4520,
  east: -75.4780
};

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
    coords: [10.3730, -75.5759],
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
    coords: [10.3738, -75.5750],
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
    coords: [10.3725, -75.5760],
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
  const spectralOverlayRef = useRef(null);

  // General Filter & Map State
  const [activeLayerFilter, setActiveLayerFilter] = useState('all'); // 'all' | 'risk' | 'relocation' | 'water' | 'census' | 'spectral'
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showCensusDrawer, setShowCensusDrawer] = useState(false);
  const [censusSearch, setCensusSearch] = useState('');
  const [censusTypologyFilter, setCensusTypologyFilter] = useState('ALL'); // 'ALL' | 'TIPO-A' | 'TIPO-B'
  const [censusLocationMode, setCensusLocationMode] = useState('coastal'); // 'coastal' | 'plateau'

  // =========================================================================
  // SPECTRAL ANALYSIS STUDIO STATE (ANÁLISIS ESPECTRAL MULTICAPA)
  // =========================================================================
  const [showSpectralStudio, setShowSpectralStudio] = useState(false);
  const [selectedBandId, setSelectedBandId] = useState('ndvi');
  const [spectralDisplayMode, setSpectralDisplayMode] = useState('swipe'); // 'swipe' | 'overlay' | 'scanner'
  const [swipePosition, setSwipePosition] = useState(50); // 0 to 100%
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false);
  const [spectralOpacity, setSpectralOpacity] = useState(0.85);
  const [spectralBlendMode, setSpectralBlendMode] = useState('normal'); // 'normal' | 'multiply' | 'screen' | 'overlay' | 'difference'
  const [spectralBounds, setSpectralBounds] = useState(DEFAULT_SPECTRAL_BOUNDS);
  const [showSpectralLegend, setShowSpectralLegend] = useState(true);
  const [showSpectralCalibration, setShowSpectralCalibration] = useState(false);
  const [scannerProgress, setScannerProgress] = useState(0);

  const activeBand = useMemo(() => {
    return SPECTRAL_LAYERS.find(b => b.id === selectedBandId) || SPECTRAL_LAYERS[0];
  }, [selectedBandId]);

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

  // =========================================================================
  // 1. LEAFLET MAP INITIALIZATION
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [10.3540, -75.5720],
      zoom: 13.8,
      zoomControl: false,
      attributionControl: false
    });

    // Satellite Aerial Layer (Esri World Imagery)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = null;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

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

    // Safe Plateau Polygon (+22m) - Clean border contour without fill
    const safePlateau = L.polygon([
      [10.37487, -75.57396],
      [10.37523, -75.57534],
      [10.37447, -75.57662],
      [10.37320, -75.57731],
      [10.37194, -75.57758],
      [10.37113, -75.57727],
      [10.37054, -75.57691],
      [10.37134, -75.57638],
      [10.37221, -75.57595],
      [10.37264, -75.57516],
      [10.37348, -75.57450],
      [10.37419, -75.57408]
    ], {
      color: '#0d9488',
      fillColor: 'transparent',
      fillOpacity: 0,
      weight: 4,
      dashArray: '8, 8'
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
            <div class="absolute -inset-2 rounded-full ${isPlateau ? 'bg-teal-400/40 animate-pulse' : isErosion ? 'bg-red-500/40 animate-ping' : isWater ? 'bg-blue-400/40 animate-pulse' : 'bg-slate-400/30'}"></div>
            <div class="w-8 h-8 rounded-xl ${isPlateau ? 'bg-teal-600' : isErosion ? 'bg-red-600' : isWater ? 'bg-blue-600' : 'bg-slate-900'} border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
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

  // =========================================================================
  // 2. SYNCHRONIZE SPECTRAL RASTER OVERLAY WITH LEAFLET & CLIP MODES
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current?.map) return;
    const map = mapInstanceRef.current.map;

    if (!showSpectralStudio) {
      if (spectralOverlayRef.current) {
        map.removeLayer(spectralOverlayRef.current);
        spectralOverlayRef.current = null;
      }
      return;
    }

    const bounds = L.latLngBounds(
      [spectralBounds.south, spectralBounds.west],
      [spectralBounds.north, spectralBounds.east]
    );

    if (spectralOverlayRef.current) {
      map.removeLayer(spectralOverlayRef.current);
    }

    const overlay = L.imageOverlay(activeBand.image, bounds, {
      opacity: spectralDisplayMode === 'overlay' ? spectralOpacity : 0.95,
      interactive: false,
      zIndex: 250
    }).addTo(map);

    spectralOverlayRef.current = overlay;

    // Apply Realtime Clip Path & Blend Mode to the underlying image element
    const updateElementStyle = () => {
      const img = overlay.getElement();
      if (img) {
        if (spectralDisplayMode === 'swipe') {
          img.style.clipPath = `polygon(${swipePosition}% 0%, 100% 0%, 100% 100%, ${swipePosition}% 100%)`;
        } else if (spectralDisplayMode === 'scanner') {
          img.style.clipPath = `polygon(0% 0%, ${scannerProgress}% 0%, ${scannerProgress}% 100%, 0% 100%)`;
        } else {
          img.style.clipPath = 'none';
        }
        img.style.mixBlendMode = spectralBlendMode;
        img.style.transition = spectralDisplayMode === 'swipe' ? 'none' : 'clip-path 0.1s ease-out';
      }
    };

    updateElementStyle();
    map.on('move', updateElementStyle);
    map.on('zoom', updateElementStyle);

    return () => {
      map.off('move', updateElementStyle);
      map.off('zoom', updateElementStyle);
      if (spectralOverlayRef.current) {
        map.removeLayer(spectralOverlayRef.current);
        spectralOverlayRef.current = null;
      }
    };
  }, [
    showSpectralStudio,
    activeBand,
    spectralBounds,
    spectralDisplayMode,
    spectralOpacity,
    spectralBlendMode,
    swipePosition,
    scannerProgress
  ]);

  // Scanner animation interval
  useEffect(() => {
    if (!showSpectralStudio || spectralDisplayMode !== 'scanner') return;

    const interval = setInterval(() => {
      setScannerProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1.2;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [showSpectralStudio, spectralDisplayMode]);

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
      safePlateau.setStyle({ opacity: 0.4, weight: 2 });
    } else if (activeLayerFilter === 'relocation') {
      erosionLine.setStyle({ opacity: 0.3, weight: 2 });
      safePlateau.setStyle({ opacity: 1, weight: 5 });
    } else {
      erosionLine.setStyle({ opacity: 0.95, weight: 5 });
      safePlateau.setStyle({ opacity: 0.85, weight: 4 });
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

  // Mouse move handler for interactive Swipe Divider
  const handleMapMouseMove = (e) => {
    if (!isDraggingSwipe && e.type !== 'touchmove') return;
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSwipePosition(Number(pct.toFixed(1)));
  };

  const moveSpectralLat = (delta) => {
    setSpectralBounds(prev => ({
      ...prev,
      south: Number((prev.south + delta).toFixed(5)),
      north: Number((prev.north + delta).toFixed(5))
    }));
  };

  const moveSpectralLng = (delta) => {
    setSpectralBounds(prev => ({
      ...prev,
      west: Number((prev.west + delta).toFixed(5)),
      east: Number((prev.east + delta).toFixed(5))
    }));
  };

  const scaleSpectral = (factor) => {
    setSpectralBounds(prev => {
      const centerLat = (prev.north + prev.south) / 2;
      const centerLng = (prev.east + prev.west) / 2;
      const halfLat = ((prev.north - prev.south) * factor) / 2;
      const halfLng = ((prev.east - prev.west) * factor) / 2;
      return {
        south: Number((centerLat - halfLat).toFixed(5)),
        north: Number((centerLat + halfLat).toFixed(5)),
        west: Number((centerLng - halfLng).toFixed(5)),
        east: Number((centerLng + halfLng).toFixed(5))
      };
    });
  };

  const filteredSpots = HOTSPOTS_DATA.filter((spot) => {
    if (activeLayerFilter === 'risk') return spot.id === 'erosion';
    if (activeLayerFilter === 'relocation') return spot.id === 'meseta' || spot.id === 'colegio';
    if (activeLayerFilter === 'water') return spot.id === 'aljibe';
    return true;
  });

  return (
    <div 
      className="relative w-full h-screen overflow-hidden animate-fade-in select-none"
      onMouseMove={handleMapMouseMove}
      onTouchMove={handleMapMouseMove}
      onMouseUp={() => setIsDraggingSwipe(false)}
      onTouchEnd={() => setIsDraggingSwipe(false)}
    >
      
      {/* 1. FULLSCREEN SATELLITE MAP */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 2. REALTIME INTERACTIVE SWIPE CURTAIN DIVIDER                             */}
      {/* ========================================================================= */}
      {showSpectralStudio && spectralDisplayMode === 'swipe' && (
        <div 
          className="absolute inset-y-0 z-[300] pointer-events-auto cursor-ew-resize flex items-center justify-center transition-none"
          style={{ left: `${swipePosition}%` }}
          onMouseDown={() => setIsDraggingSwipe(true)}
          onTouchStart={() => setIsDraggingSwipe(true)}
        >
          {/* Vertical Glass Line */}
          <div className="w-1 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] backdrop-blur-sm relative flex items-center justify-center">
            
            {/* Top Label Tag */}
            <div className="absolute top-20 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-950/90 border border-white/30 text-[9px] font-mono text-white font-bold shadow-xl">
              COMPARADOR GIS
            </div>

            {/* Central Glowing Grip Pill */}
            <div className="w-10 h-10 -translate-x-1/2 rounded-full bg-slate-900 border-2 border-white shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform group">
              <div className="flex items-center space-x-0.5 text-amber-400">
                <ChevronLeft className="w-3.5 h-3.5 -mr-1 animate-pulse" />
                <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            {/* Bottom Sub-tag */}
            <div className="absolute bottom-28 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-slate-900/90 border border-white/20 text-[10px] font-mono font-bold shadow-2xl flex items-center space-x-2">
              <span className="text-slate-300">Satélite</span>
              <span className="text-amber-400 font-black">|</span>
              <span style={{ color: activeBand.color }}>{activeBand.shortName}</span>
            </div>

          </div>
        </div>
      )}

      {/* Radar Scanner Vertical Laser Line */}
      {showSpectralStudio && spectralDisplayMode === 'scanner' && (
        <div 
          className="absolute inset-y-0 z-[300] pointer-events-none transition-none"
          style={{ left: `${scannerProgress}%` }}
        >
          <div className="w-0.5 h-full bg-cyan-400 shadow-[0_0_20px_#06b6d4] relative">
            <div className="absolute top-24 -translate-x-1/2 px-2.5 py-1 rounded-full bg-cyan-950/95 border border-cyan-400/80 text-[10px] font-mono font-bold text-cyan-300 shadow-xl flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>BARRIDO LÁSER: {Math.round(scannerProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TOP FLOATING CONTROL BAR (HUD)                                         */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-hud px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-lg shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            03
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-50/90 text-red-700 border border-red-200/80">
                SIG DIAGNÓSTICO // MIDAS CARTAGENA
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50/90 px-1.5 py-0.5 rounded border border-emerald-200/80">
                120 VIVIENDAS 1:1
              </span>
            </div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {showSpectralStudio ? `Estudio Espectral: ${activeBand.name}` : 'Vulnerabilidad, Censo 1:1 & Suelo Seguro (+22m)'}
            </h2>
          </div>
        </div>

        {/* GIS Layer Filters Bar */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center shadow-xl">
          
          {/* Spectral Studio Toggle Button (Hero Feature) */}
          <button
            onClick={() => {
              setShowSpectralStudio(!showSpectralStudio);
              if (!showSpectralStudio) {
                setShowCensusDrawer(false);
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
              showSpectralStudio
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg ring-2 ring-cyan-400/50 scale-105'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Teledetección Espectral (5 Bandas)</span>
            <span className={`w-2 h-2 rounded-full ${showSpectralStudio ? 'bg-amber-300 animate-ping' : 'bg-emerald-500'}`} />
          </button>

          {/* Censo 1:1 Viviendas Button */}
          <button
            onClick={() => {
              setShowCensusDrawer(!showCensusDrawer);
              if (!showCensusDrawer) {
                setShowSpectralStudio(false);
                setActiveLayerFilter('census');
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              showCensusDrawer
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
              activeLayerFilter === 'risk' && !showCensusDrawer && !showSpectralStudio
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
              activeLayerFilter === 'relocation' && !showCensusDrawer && !showSpectralStudio
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
              activeLayerFilter === 'water' && !showCensusDrawer && !showSpectralStudio
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Agua & Aljibe</span>
          </button>
        </div>

        {/* Aerial Satellite / Carto Layer Toggle Button */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex items-center gap-1 self-start md:self-auto shadow-xl">
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

      {/* ========================================================================= */}
      {/* 4. SPECTRAL STUDIO FLOATING BOTTOM DOCK & BAND SELECTOR                   */}
      {/* ========================================================================= */}
      {showSpectralStudio && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none animate-slide-up">
          <div className="max-w-5xl mx-auto glass-panel p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-white/60 pointer-events-auto space-y-3 text-slate-900 backdrop-blur-xl">
            
            {/* Top Toolbar: Mode Switcher, Opacity & Calibration Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
              
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                  Modo de Visualización:
                </span>
                <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                  <button
                    onClick={() => setSpectralDisplayMode('swipe')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                      spectralDisplayMode === 'swipe' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                    <span>Cortina Dividida (Swipe)</span>
                  </button>

                  <button
                    onClick={() => setSpectralDisplayMode('overlay')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                      spectralDisplayMode === 'overlay' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-teal-400" />
                    <span>Superposición</span>
                  </button>

                  <button
                    onClick={() => setSpectralDisplayMode('scanner')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                      spectralDisplayMode === 'scanner' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Scan className="w-3 h-3 text-cyan-400" />
                    <span>Escáner Láser</span>
                  </button>
                </div>
              </div>

              {/* Opacity & Blend Mode Controls (When in Overlay Mode) */}
              <div className="flex items-center space-x-3">
                {spectralDisplayMode === 'overlay' && (
                  <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 text-xs font-mono">
                    <span className="text-[10px] text-slate-500 font-bold">Opacidad:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={spectralOpacity}
                      onChange={(e) => setSpectralOpacity(parseFloat(e.target.value))}
                      className="w-20 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <span className="font-bold text-slate-800 text-[10px]">{Math.round(spectralOpacity * 100)}%</span>
                  </div>
                )}

                {/* Toggle Legend */}
                <button
                  onClick={() => setShowSpectralLegend(!showSpectralLegend)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors flex items-center space-x-1 ${
                    showSpectralLegend ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Info className="w-3 h-3" />
                  <span>Ficha Científica</span>
                </button>

                {/* Calibration fine-tune toggle */}
                <button
                  onClick={() => setShowSpectralCalibration(!showSpectralCalibration)}
                  className={`p-1.5 rounded-xl border text-slate-600 hover:text-slate-900 ${
                    showSpectralCalibration ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-100 border-slate-200'
                  }`}
                  title="Calibrar Posición de Imagen"
                >
                  <Move className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowSpectralStudio(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  title="Cerrar Estudio Espectral"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* 5 Band Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SPECTRAL_LAYERS.map((band) => {
                const isSelected = selectedBandId === band.id;
                const IconComponent = band.icon;
                return (
                  <button
                    key={band.id}
                    onClick={() => setSelectedBandId(band.id)}
                    className={`p-2.5 rounded-2xl text-left transition-all relative overflow-hidden border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800 shadow-xl scale-102 ring-2 ring-cyan-400/50'
                        : 'bg-white/90 hover:bg-slate-50 border-slate-200/90 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {band.badge}
                      </span>
                      <IconComponent className="w-3.5 h-3.5" style={{ color: band.color }} />
                    </div>

                    <h4 className="font-bold text-xs line-clamp-1">
                      {band.shortName}
                    </h4>

                    <div className="text-[10px] opacity-70 font-mono mt-0.5 truncate">
                      {band.sensor.split('(')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FLOATING SCIENTIFIC TELEMETRY & LEGEND CARD                            */}
      {/* ========================================================================= */}
      {showSpectralStudio && showSpectralLegend && (
        <div className="absolute top-24 left-4 z-[400] pointer-events-none animate-scale-up max-w-sm w-full">
          <div className="glass-panel p-4 rounded-3xl shadow-2xl border border-white/60 pointer-events-auto space-y-3 text-slate-900 backdrop-blur-xl">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeBand.color }} />
                <span className="font-serif font-bold text-xs text-slate-900">
                  {activeBand.name}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                {activeBand.sensor}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {activeBand.summary}
            </p>

            {/* Formula Chip */}
            <div className="px-2.5 py-1 rounded-xl bg-slate-950 text-cyan-300 font-mono text-[10px] flex items-center justify-between border border-slate-800">
              <span className="text-slate-400">Algoritmo:</span>
              <span className="font-bold">{activeBand.formula}</span>
            </div>

            {/* Color Ramp Legend */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                Escala de Clasificación:
              </span>
              <div className="space-y-1">
                {activeBand.legend.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-[11px] font-mono">
                    <span 
                      className="w-3.5 h-3.5 rounded-md border border-slate-300 shrink-0 shadow-xs" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-slate-700 truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics Chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200">
              {activeBand.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">{m.label}</span>
                  <span className="font-serif font-bold text-xs text-slate-900 block mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SPECTRAL IMAGE CALIBRATION POPOVER (FINE TUNE NUDGE)                   */}
      {/* ========================================================================= */}
      {showSpectralStudio && showSpectralCalibration && (
        <div className="absolute top-24 right-4 z-[400] glass-panel p-3 rounded-2xl shadow-2xl space-y-2 pointer-events-auto border border-amber-400/60 animate-fade-in text-slate-900 w-52">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800">
              Alineación de Capa
            </span>
            <button
              onClick={() => setSpectralBounds(DEFAULT_SPECTRAL_BOUNDS)}
              className="text-[10px] font-mono font-bold text-amber-700 hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-center text-xs font-mono font-bold">
            <div />
            <button
              onClick={() => moveSpectralLat(0.001)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Mover Norte"
            >
              ▲
            </button>
            <div />

            <button
              onClick={() => moveSpectralLng(-0.001)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Mover Oeste"
            >
              ◀
            </button>

            <button
              onClick={() => moveSpectralLat(-0.001)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Mover Sur"
            >
              ▼
            </button>

            <button
              onClick={() => moveSpectralLng(0.001)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Mover Este"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono font-bold">
            <button
              onClick={() => scaleSpectral(1.015)}
              className="py-1 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-xs text-center text-slate-800"
            >
              + Escala
            </button>
            <button
              onClick={() => scaleSpectral(0.985)}
              className="py-1 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-xs text-center text-slate-800"
            >
              - Escala
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom: Hotspot Selection Strip (Hidden when Census Drawer or Spectral Studio is Open) */}
      {!showCensusDrawer && !showSpectralStudio && (
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
                  className={`glass-card flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-mono transition-all border shadow-lg ${
                    isSelected
                      ? '!bg-slate-900 !text-white font-bold scale-105 border-slate-900'
                      : 'text-slate-800'
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

      {/* Floating Bottom-Left Legend HUD (Standard GIS view) */}
      {!showSpectralStudio && (
        <div className="absolute top-24 left-4 z-[400] hidden lg:block pointer-events-none">
          <div className="glass-panel p-3.5 rounded-2xl pointer-events-auto space-y-2 text-xs font-mono shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Capas Territoriales</span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">MIDAS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" />
              <span className="text-slate-800">Erosión Costera (1.8m/año)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-teal-500/10 border-2 border-dashed border-teal-500" />
              <span className="text-slate-800">Meseta Segura (+22m Borde)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-slate-900 border border-white flex items-center justify-center text-[8px] text-white font-bold">120</span>
              <span className="text-slate-800">Viviendas Censadas 1:1</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE 1:1 HOUSING CENSUS DRAWER (120 DWELLINGS QUANTIFICATION)   */}
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
      {/* 8. FICHA CATASTRAL 1:1 POPUP MODAL (INDIVIDUAL HOUSEHOLD SURVEY)          */}
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
      {/* 9. HOTSPOT DETAIL MODAL POP-UP                                            */}
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
