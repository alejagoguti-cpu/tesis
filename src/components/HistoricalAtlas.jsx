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
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
  Save,
  Sliders,
  FileText,
  Info,
  BookOpen,
  Clock,
  ShieldAlert,
  Fish,
  Flame,
  Flag,
  Hospital,
  Landmark,
  Mountain,
  Plane,
  Ship,
  Users
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import { HISTORICAL_MAPS_DATA } from '../data/historicalMaps';
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

export const TIMELINE_EPOCHS = [
  {
    year: 1589,
    type: "historical",
    mapId: "map_1589",
    title: "1589: Ocupación militar y ausencia de planificación urbana",
    tagline: "Años 1500 a 1700 // Ocupación Defensiva",
    description: "Durante este periodo, España ocupó la isla únicamente con fines defensivos militares, construyendo fortalezas como los Fuertes de San Fernando y San Luis.\n\nAl ser una plataforma de piedra coralina que no tiene ríos ni manantiales, las tropas militares dependían exclusivamente de juntar agua de lluvia en aljibes de piedra o de traerla en barcos desde el continente.\n\nComo el territorio solo albergaba soldados de forma temporal, nunca se planificó un pueblo ni una infraestructura para la vida civil.",
    color: "#7c4a12",
    metrics: [
      { label: "Período", value: "Años 1500–1700" },
      { label: "Ocupación", value: "Solo militar" },
      { label: "Fuentes Agua", value: "0 ríos / aljibes" },
      { label: "Planificación", value: "Sin pueblo civil" }
    ]
  },
  {
    year: 1740,
    type: "historical",
    mapId: "map_1740",
    title: "1740: Ocupación militar y ausencia de planificación urbana",
    tagline: "Años 1500 a 1700 // Fortificaciones Defensivas",
    description: "Durante este periodo, España ocupó la isla únicamente con fines defensivos militares, construyendo fortalezas como los Fuertes de San Fernando y San Luis.\n\nAl ser una plataforma de piedra coralina que no tiene ríos ni manantiales, las tropas militares dependían exclusivamente de juntar agua de lluvia en aljibes de piedra o de traerla en barcos desde el continente.\n\nComo el territorio solo albergaba soldados de forma temporal, nunca se planificó un pueblo ni una infraestructura para la vida civil.",
    color: "#b45309",
    metrics: [
      { label: "Período", value: "Años 1500–1700" },
      { label: "Defensa", value: "Fuertes S. Luis / S. Fernando" },
      { label: "Abastecimiento", value: "Aljibes y barcos" },
      { label: "Vida Civil", value: "Inexistente" }
    ]
  },
  {
    year: 1780,
    type: "historical",
    mapId: "map_1780",
    title: "1780: El origen de la erosión costera",
    tagline: "Años 1755 a 1758 // Escollera Submarina de Bocagrande",
    description: "Entre los años 1755 y 1758, el ingeniero Antonio de Arévalo construyó la Escollera Submarina de Bocagrande, un muro sumergido de piedra que cerró el paso del agua para impedir la entrada de barcos enemigos a la bahía.\n\nEsta obra cambió las corrientes del mar y desvió la fuerza del oleaje del Caribe directamente contra la orilla de Tierrabomba, dando inicio al fenómeno de erosión costera que comenzó a carcomer sus playas.",
    color: "#c2410c",
    metrics: [
      { label: "Período", value: "Años 1755–1758" },
      { label: "Obra", value: "Escollera Bocagrande" },
      { label: "Ingeniero", value: "Antonio de Arévalo" },
      { label: "Fenómeno", value: "Erosión costera" }
    ]
  },
  {
    year: 1820,
    type: "historical",
    mapId: "map_1820",
    title: "1820: El asentamiento de la comunidad raizal",
    tagline: "Años 1800 // Poblamiento Orgánico Post-Independencia",
    description: "Tras la independencia, familias afrodescendientes y pescadores nativos poblaron la isla de forma orgánica, estableciéndose alrededor de las ruinas de las antiguas fortalezas por su cercanía al mar y su vocación pesquera.\n\nLos caseríos crecieron adaptándose al territorio de manera espontánea.",
    color: "#9a3412",
    metrics: [
      { label: "Período", value: "Años 1800" },
      { label: "Pobladores", value: "Familias raizales" },
      { label: "Asentamiento", value: "Alrededor de ruinas" },
      { label: "Vocación", value: "Pesca artesanal" }
    ]
  },
  {
    year: 1831,
    type: "historical",
    mapId: "map_1831",
    title: "1831: El asentamiento de la comunidad raizal",
    tagline: "Años 1800 // Crecimiento Espontáneo de Caseríos",
    description: "Tras la independencia, familias afrodescendientes y pescadores nativos poblaron la isla de forma orgánica, estableciéndose alrededor de las ruinas de las antiguas fortalezas por su cercanía al mar y su vocación pesquera.\n\nLos caseríos crecieron adaptándose al territorio de manera espontánea.",
    color: "#0369a1",
    metrics: [
      { label: "Período", value: "Años 1800" },
      { label: "Comunidad", value: "Pescadores nativos" },
      { label: "Crecimiento", value: "Espontáneo" },
      { label: "Borde Costero", value: "Cercanía al mar" }
    ]
  },
  {
    year: 1900,
    type: "historical",
    mapId: "map_1900",
    title: "1900: La brecha del agua potable",
    tagline: "Años 1900 // Desconexión de Redes & Pimpinas",
    description: "A lo largo de los años 1900, la falta de agua se convirtió en una brecha de infraestructura: mientras la Cartagena continental construía su red de acueducto trayendo agua desde el Canal del Dique, el Estado no instaló la tubería submarina hacia la isla.\n\nEsto obligó a los pobladores a abastecerse comprando agua traída en pimpinas y lanchas desde el continente.",
    color: "#0d9488",
    metrics: [
      { label: "Período", value: "Años 1900" },
      { label: "Acueducto", value: "0% red a la isla" },
      { label: "Cartagena", value: "Red Canal del Dique" },
      { label: "Abastecimiento", value: "Pimpinas en lancha" }
    ]
  },
  {
    year: 1980,
    type: "modern",
    title: "1980: La brecha del agua potable",
    tagline: "Años 1900 // Subsistencia sin Red Submarina",
    description: "A lo largo de los años 1900, la falta de agua se convirtió en una brecha de infraestructura: mientras la Cartagena continental construía su red de acueducto trayendo agua desde el Canal del Dique, el Estado no instaló la tubería submarina hacia la isla.\n\nEsto obligó a los pobladores a abastecerse comprando agua traída en pimpinas y lanchas desde el continente.",
    color: "#0284c7",
    metrics: [
      { label: "Período", value: "Años 1900" },
      { label: "Red Submarina", value: "0% Instalada" },
      { label: "Dependencia", value: "Compra en lanchas" },
      { label: "Vulnerabilidad", value: "Aislamiento hídrico" }
    ]
  },
  {
    year: 2026,
    type: "modern",
    title: "2026: La aceleración del colapso costero",
    tagline: "Años 2000 a la actualidad // Dragado, Oleaje & Crisis Hídrica",
    description: "En los años 2000 y hasta el presente, las obras de profundización y dragado en el mar para el paso de grandes buques comerciales, sumadas al ascenso del nivel del mar por el cambio climático, aumentaron la fuerza de las olas sobre la orilla.\n\nEsto aceleró la pérdida de playa y la destrucción de las primeras manzanas de viviendas, llevando a la crisis actual donde más de 10.000 habitantes sufren el avance del mar sobre sus casas y la falta de agua potable y red sanitaria.",
    color: "#dc2626",
    metrics: [
      { label: "Período", value: "Años 2000–Actual" },
      { label: "Causas", value: "Dragados + Cambio Climático" },
      { label: "Población Afectada", value: "+10.000 habitantes" },
      { label: "Crisis", value: "Mar sobre viviendas" }
    ]
  },
  {
    year: 2050,
    type: "modern",
    title: "2050: Masterplan Resiliente (Tesis)",
    tagline: "Respuesta Proyectual // Soberanía Hídrica + Reubicación +22m",
    description: "Frente al colapso acumulado de erosión costera y desabastecimiento hídrico, la tesis propone el reasentamiento seguro en la meseta (+22m).\n\nSe proyecta un colegio bioclimático de 350 plazas y un macro-aljibe ciclópeo de 450.000 L para garantizar la soberanía y dignidad de la comunidad en su territorio.",
    color: "#0d9488",
    metrics: [
      { label: "Cota Seguridad", value: "+22.00 m.s.n.m." },
      { label: "Reserva Hídrica", value: "450.000 Litros" },
      { label: "Viviendas", value: "120 Familias" },
      { label: "Respuesta", value: "Masterplan Resiliente" }
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
    coords: [10.3730, -75.5759],
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

// Corregimiento urban settlement & vulnerable housing polygons
export const CORREGIMIENTO_HOUSES_OUTLINE = [
  [10.3672, -75.5840],
  [10.3662, -75.5822],
  [10.3648, -75.5815],
  [10.3630, -75.5812],
  [10.3615, -75.5818],
  [10.3590, -75.5832],
  [10.3565, -75.5848],
  [10.3540, -75.5872],
  [10.3525, -75.5885],
  [10.3528, -75.5902],
  [10.3552, -75.5912],
  [10.3580, -75.5910],
  [10.3605, -75.5885],
  [10.3625, -75.5865],
  [10.3645, -75.5860],
  [10.3668, -75.5845]
];

export const VULNERABLE_HOUSING_STRIP = [
  [10.3655, -75.5860],
  [10.3635, -75.5866],
  [10.3610, -75.5885],
  [10.3585, -75.5910],
  [10.3555, -75.5914],
  [10.3535, -75.5898],
  [10.3542, -75.5885],
  [10.3565, -75.5895],
  [10.3590, -75.5888],
  [10.3615, -75.5868],
  [10.3640, -75.5848]
];

export const URBAN_HOUSE_BLOCKS = [
  // Sector Norte - Muelle
  [
    [10.3668, -75.5840],
    [10.3658, -75.5825],
    [10.3642, -75.5832],
    [10.3652, -75.5848]
  ],
  // Sector Central - Plaza & Equipamiento
  [
    [10.3640, -75.5852],
    [10.3632, -75.5822],
    [10.3605, -75.5830],
    [10.3612, -75.5862]
  ],
  // Sector Sur - Borde de Riesgo 120 Casas
  [
    [10.3600, -75.5872],
    [10.3585, -75.5838],
    [10.3550, -75.5855],
    [10.3558, -75.5898]
  ]
];

// Iconos para los bullets de historia insular por época
const STORY_ICONS = {
  Fish, Flame, Flag, Hospital, Landmark, Mountain, Plane, Ship, Users,
  Home, Droplets, ShieldCheck, ShieldAlert, Waves, Anchor: Compass
};

export default function HistoricalAtlas({ onSelectModule, extraControls }) {
  const [selectedYear, setSelectedYear] = useState(1589); // Primer plano del atlas: Drake 1589
  const [canvasBgTheme, setCanvasBgTheme] = useState('parchment'); // fondo claro por defecto
  const [activeHotspotModal, setActiveHotspotModal] = useState(null);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [showHistoricalGalleryModal, setShowHistoricalGalleryModal] = useState(false);
  const [selectedGalleryMap, setSelectedGalleryMap] = useState(HISTORICAL_MAPS_DATA[5]); // default 1900
  const [highlightRelocationHouses, setHighlightRelocationHouses] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Historical Map Canvas Interaction State
  const [zoomLevel, setZoomLevel] = useState(1);
  // Rotación manual de planos históricos (persistente por mapa en el editor)
  const [mapRotation, setMapRotation] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('thesis_hist_rotation') || '{}');
    } catch (e) {
      return {};
    }
  });
  const getMapRotation = (mapId) => (mapId && mapRotation[mapId]) || 0;

  // Espejo horizontal/vertical por plano (persistente en el editor)
  const [mapMirror, setMapMirror] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('thesis_hist_mirror') || '{}');
    } catch (e) {
      return {};
    }
  });
  const getMapMirror = (mapId) => (mapId && mapMirror[mapId]) || { h: false, v: false };

  // Confirmación visual de guardado permanente
  const [saveViewToast, setSaveViewToast] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState('natural'); // 'natural' | 'sepia' | 'contrast' | 'invert'

  const bayMapRef = useRef(null);
  const bayMapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const markersRef = useRef([]);
  const relocationGroupRef = useRef(null);

  const currentTimelineData = TIMELINE_EPOCHS.find(y => y.year === selectedYear) || TIMELINE_EPOCHS[7];
  const isHistoricalMode = currentTimelineData.type === 'historical';
  const currentHistoricalMap = isHistoricalMode 
    ? HISTORICAL_MAPS_DATA.find(m => m.id === currentTimelineData.mapId) || HISTORICAL_MAPS_DATA[0]
    : null;

  // Gira el plano actual ±90° y lo guarda en el editor (localStorage por mapa)
  const rotateCurrentMap = (dir) => {
    if (!currentHistoricalMap) return;
    const id = currentHistoricalMap.id;
    setMapRotation((prev) => {
      const next = ((getMapRotation(id) + dir * 90) % 360 + 360) % 360;
      const upd = { ...prev, [id]: next };
      try {
        localStorage.setItem('thesis_hist_rotation', JSON.stringify(upd));
      } catch (e) {}
      return upd;
    });
  };
  const currentRot = currentHistoricalMap ? getMapRotation(currentHistoricalMap.id) : 0;
  const currentMirror = currentHistoricalMap ? getMapMirror(currentHistoricalMap.id) : { h: false, v: false };

  // Espejo del plano actual en un eje (se guarda en el editor)
  const flipCurrentMap = (axis) => {
    if (!currentHistoricalMap) return;
    const id = currentHistoricalMap.id;
    setMapMirror((prev) => {
      const cur = getMapMirror(id);
      const upd = { ...prev, [id]: { ...cur, [axis]: !cur[axis] } };
      try {
        localStorage.setItem('thesis_hist_mirror', JSON.stringify(upd));
      } catch (e) {}
      return upd;
    });
  };

  // Guardado permanente explícito de la vista actual (rotación + espejo + zoom)
  const saveCurrentView = () => {
    if (!currentHistoricalMap) return;
    try {
      const rot = JSON.parse(localStorage.getItem('thesis_hist_rotation') || '{}');
      rot[currentHistoricalMap.id] = getMapRotation(currentHistoricalMap.id);
      localStorage.setItem('thesis_hist_rotation', JSON.stringify(rot));
      const mir = JSON.parse(localStorage.getItem('thesis_hist_mirror') || '{}');
      mir[currentHistoricalMap.id] = getMapMirror(currentHistoricalMap.id);
      localStorage.setItem('thesis_hist_mirror', JSON.stringify(mir));
      localStorage.setItem('thesis_hist_view_' + currentHistoricalMap.id, JSON.stringify({ zoom: zoomLevel, pan: panOffset }));
    } catch (e) {}
    setSaveViewToast(true);
    setTimeout(() => setSaveViewToast(false), 2500);
  };

  // Year Selection Handler with Camera FlyTo
  const handleSelectYear = (targetYear) => {
    if (targetYear === selectedYear) return;
    setSelectedYear(targetYear);

    // If target is modern and map instance exists, trigger cinematic camera sweeps
    const targetEpoch = TIMELINE_EPOCHS.find(e => e.year === targetYear);
    if (targetEpoch && targetEpoch.type === 'modern' && bayMapInstanceRef.current) {
      const map = bayMapInstanceRef.current;
      map.invalidateSize();
      if (targetYear === 1980) {
        map.flyTo([10.365, -75.550], 12.8, {
          animate: true,
          duration: 1.8,
          easeLinearity: 0.25
        });
      } else if (targetYear === 2026) {
        map.flyTo([10.3600, -75.5860], 15.2, {
          animate: true,
          duration: 2.0,
          easeLinearity: 0.25
        });
      } else if (targetYear === 2050) {
        map.flyTo([10.3730, -75.5759], 15.6, {
          animate: true,
          duration: 2.2,
          easeLinearity: 0.25
        });
      }
    }
  };

  const handlePrevEpoch = () => {
    const currentIndex = TIMELINE_EPOCHS.findIndex(e => e.year === selectedYear);
    if (currentIndex > 0) {
      handleSelectYear(TIMELINE_EPOCHS[currentIndex - 1].year);
    }
  };

  const handleNextEpoch = () => {
    const currentIndex = TIMELINE_EPOCHS.findIndex(e => e.year === selectedYear);
    if (currentIndex < TIMELINE_EPOCHS.length - 1) {
      handleSelectYear(TIMELINE_EPOCHS[currentIndex + 1].year);
    }
  };

  // Keyboard navigation for epochs (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is interacting with an input or modal
      if (activeHotspotModal || showHistoricalGalleryModal) return;
      if (e.key === 'ArrowLeft') {
        handlePrevEpoch();
      } else if (e.key === 'ArrowRight') {
        handleNextEpoch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedYear, activeHotspotModal, showHistoricalGalleryModal]);

  // Reset zoom & pan when switching years, and invalidate map size for modern years
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });

    if (!isHistoricalMode && bayMapInstanceRef.current) {
      const map = bayMapInstanceRef.current;
      map.invalidateSize();
      const timer1 = setTimeout(() => {
        map.invalidateSize();
      }, 50);
      const timer2 = setTimeout(() => {
        map.invalidateSize();
      }, 200);
      const timer3 = setTimeout(() => {
        map.invalidateSize();
      }, 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [selectedYear, isHistoricalMode]);

  // Restaurar vista guardada del plano (zoom + posición) al cambiar de año
  useEffect(() => {
    if (!isHistoricalMode || !currentHistoricalMap) return;
    try {
      const saved = JSON.parse(localStorage.getItem('thesis_hist_view_' + currentHistoricalMap.id) || 'null');
      if (saved) {
        if (typeof saved.zoom === 'number') setZoomLevel(saved.zoom);
        if (saved.pan && typeof saved.pan.x === 'number') setPanOffset(saved.pan);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  // Synchronize Relocation Houses Contour on Satellite Map
  useEffect(() => {
    const map = bayMapInstanceRef.current;
    const group = relocationGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (highlightRelocationHouses && selectedYear >= 2026) {
      // 1. Zoom into the corregimiento houses
      map.flyTo([10.3600, -75.5860], 16.5, {
        animate: true,
        duration: 1.8
      });

      // 2. Corregimiento Houses Perimeter (Amber contour)
      L.polygon(CORREGIMIENTO_HOUSES_OUTLINE, {
        color: '#f59e0b',
        weight: 3.5,
        dashArray: '8, 6',
        fillColor: '#f59e0b',
        fillOpacity: 0.05
      }).addTo(group);

      // 3. Vulnerable Houses in Coastal Erosion Zone (120 Houses - Red dashed outline)
      L.polygon(VULNERABLE_HOUSING_STRIP, {
        color: '#ef4444',
        weight: 4.5,
        dashArray: '6, 4',
        fillColor: '#ef4444',
        fillOpacity: 0.18
      }).addTo(group);

      // 4. Urban House Sub-Blocks
      URBAN_HOUSE_BLOCKS.forEach(block => {
        L.polygon(block, {
          color: '#fb923c',
          weight: 2,
          fillColor: '#fb923c',
          fillOpacity: 0.12
        }).addTo(group);
      });

      // 5. Floating Pin Marker over the vulnerable houses
      const housePinIcon = L.divIcon({
        className: 'custom-relocation-pin',
        html: `
          <div class="relative flex flex-col items-center pointer-events-none animate-bounce">
            <div class="px-3 py-1 rounded-2xl bg-slate-950/95 text-white border-2 border-red-500 shadow-2xl flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span class="font-mono font-bold text-xs text-red-300">120 Casas en Borde de Socavación</span>
            </div>
            <div class="w-0.5 h-4 bg-red-500"></div>
          </div>
        `,
        iconSize: [230, 45],
        iconAnchor: [115, 45]
      });

      L.marker([10.3585, -75.5895], { icon: housePinIcon, zIndexOffset: 2500 }).addTo(group);
    } else if (!highlightRelocationHouses && selectedYear >= 2026 && bayMapInstanceRef.current) {
      map.flyTo([10.365, -75.550], 13, { animate: true, duration: 1.2 });
    }
  }, [highlightRelocationHouses, selectedYear]);

  // Initialize Fullscreen Leaflet Map with High-Res Satellite Aerial Imagery for modern years
  useEffect(() => {
    if (!bayMapRef.current || bayMapInstanceRef.current) return;

    const map = L.map(bayMapRef.current, {
      center: [10.365, -75.550],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Satellite Imagery (Esri World Imagery - 100% Free, Zero API Key)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = null;

    // Relocation Layer Group
    relocationGroupRef.current = L.layerGroup().addTo(map);

    // Add Interactive Hotspot Pins on the Map
    BAY_HOTSPOTS.forEach(spot => {
      const isThesisPlateau = spot.id === 'tierrabomba_plateau';
      const isErosion = spot.id === 'tierrabomba_erosion';

      const customIcon = L.divIcon({
        className: 'bay-spot-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 rounded-full ${isThesisPlateau ? 'bg-teal-400/40 animate-ping' : isErosion ? 'bg-red-500/40 animate-ping' : 'bg-sky-400/30'}"></div>
            <div class="w-8 h-8 rounded-xl ${isThesisPlateau ? 'bg-teal-600' : isErosion ? 'bg-red-600' : 'bg-slate-900'} border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
              ${isThesisPlateau 
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>' 
                : isErosion 
                  ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' 
                  : '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
              }
            </div>
            <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 text-[10px] text-white font-mono font-bold shadow-xl border border-white/20 pointer-events-none">
              ${spot.name.split(':')[0]}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(spot.coords, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setActiveHotspotModal(spot);
      });
      markersRef.current.push(marker);
    });

    bayMapInstanceRef.current = map;

    // Initial resize triggers
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      bayMapInstanceRef.current = null;
    };
  }, []);

  // Switch between Aerial Satellite and Cartographic tile layers
  useEffect(() => {
    const map = bayMapInstanceRef.current;
    if (!map) return;

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

  // Pan & Drag Handlers for Historical Canvas
  const handleMouseDown = (e) => {
    if (!isHistoricalMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isHistoricalMode) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Filter Styles
  const getFilterStyle = () => {
    switch(filterMode) {
      case 'sepia':
        return 'sepia(0.6) contrast(1.1) brightness(0.95)';
      case 'contrast':
        return 'contrast(1.45) brightness(1.05) saturate(1.1)';
      case 'invert':
        return 'invert(0.9) hue-rotate(180deg) contrast(1.2)';
      default:
        return 'none';
    }
  };

  const currentEpochIndex = TIMELINE_EPOCHS.findIndex(e => e.year === selectedYear);
  const progressPercent = Math.max(0, Math.min(100, (currentEpochIndex / (TIMELINE_EPOCHS.length - 1)) * 100));

  return (
    <div 
      className="relative w-full h-full overflow-hidden animate-fade-in select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      
      {/* ========================================================================= */}
      {/* 1. MAIN BACKGROUND: LEAFLET SATELLITE MAP OR HISTORICAL CARTOGRAPHY CANVAS */}
      {/* ========================================================================= */}
      
      {/* A. Live Aerial Satellite Map (Always initialized in background, ready for modern years) */}
      <div 
        ref={bayMapRef} 
        className="absolute inset-0 w-full h-full z-0" 
      />

      {/* B. High-Resolution Historical Map Viewer Canvas (atlas 1589 → 1900) */}
      {isHistoricalMode && currentHistoricalMap && (
        <div 
          className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing z-10 animate-fade-in transition-colors duration-300 ${
            canvasBgTheme === 'parchment' 
              ? 'bg-[#faf5eb]' 
              : canvasBgTheme === 'neutral'
                ? 'bg-[#18181b]'
                : 'bg-[#13110f]'
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Subtle grid pattern background */}
          <div className={`absolute inset-0 [background-size:24px_24px] opacity-25 pointer-events-none ${
            canvasBgTheme === 'parchment'
              ? 'bg-[radial-gradient(#c2b59b_1px,transparent_1px)]'
              : canvasBgTheme === 'neutral'
                ? 'bg-[radial-gradient(#3f3f46_1px,transparent_1px)]'
                : 'bg-[radial-gradient(#38332c_1px,transparent_1px)]'
          }`} />

          {/* Map Image with Zoom, Pan and Archival Filters */}
          <div 
            key={currentHistoricalMap.id}
            className="transition-transform duration-100 ease-out select-none animate-fade-in"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) rotate(${currentRot}deg) scaleX(${currentMirror.h ? -1 : 1}) scaleY(${currentMirror.v ? -1 : 1})`,
              filter: getFilterStyle()
            }}
          >
            <img 
              src={currentHistoricalMap.image} 
              alt={currentHistoricalMap.title}
              loading="eager"
              style={currentHistoricalMap.flipHorizontal ? { transform: 'scaleX(-1)' } : undefined}
              className={`max-w-none max-h-[88vh] rounded-lg shadow-2xl border-4 pointer-events-none transition-all duration-300 ${
                canvasBgTheme === 'parchment'
                  ? 'border-amber-900/30 shadow-amber-950/20'
                  : 'border-amber-950/50 shadow-black/80'
              }`}
              draggable={false}
            />
          </div>

          {/* Historical Controls HUD (Zoom, Filters, Theme, Reset) */}
          <div className="absolute right-4 top-24 z-[400] flex flex-col gap-2 pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-2xl">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3.5))}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.6))}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Restablecer Vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => rotateCurrentMap(-1)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Girar plano 90° a la izquierda (se guarda)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => rotateCurrentMap(1)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Girar plano 90° a la derecha (se guarda)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => flipCurrentMap('h')}
              className={`p-2.5 rounded-xl transition-colors ${currentMirror.h ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
              title="Espejo horizontal (se guarda)"
            >
              <FlipHorizontal2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => flipCurrentMap('v')}
              className={`p-2.5 rounded-xl transition-colors ${currentMirror.v ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
              title="Espejo vertical (se guarda)"
            >
              <FlipVertical2 className="w-4 h-4" />
            </button>
            <button
              onClick={saveCurrentView}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors"
              title="Guardar vista para siempre (rotación + espejo + zoom)"
            >
              <Save className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200 my-1" />
            <button
              onClick={() => {
                const modes = ['natural', 'contrast', 'sepia', 'invert'];
                const nextIdx = (modes.indexOf(filterMode) + 1) % modes.length;
                setFilterMode(modes[nextIdx]);
              }}
              className={`p-2.5 rounded-xl text-slate-800 transition-colors ${
                filterMode !== 'natural' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200'
              }`}
              title={`Filtro de Imagen: ${filterMode.toUpperCase()}`}
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const themes = ['warm-dark', 'parchment', 'neutral'];
                const nextIdx = (themes.indexOf(canvasBgTheme) + 1) % themes.length;
                setCanvasBgTheme(themes[nextIdx]);
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-700 transition-colors"
              title={`Tono de Fondo: ${canvasBgTheme === 'warm-dark' ? 'Grafito Cálido' : canvasBgTheme === 'parchment' ? 'Pergamino Claro' : 'Gris Neutro'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>

          {/* Confirmación de guardado permanente */}
          {saveViewToast && (
            <div className="absolute right-4 top-[26rem] z-[400] pointer-events-none animate-fade-in">
              <div className="bg-teal-700 text-white px-4 py-2 rounded-2xl text-xs font-mono font-bold shadow-2xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vista guardada para siempre</span>
              </div>
            </div>
          )}

          {/* Historical Cartouche Annotation Box */}
          <div className="absolute bottom-24 right-4 z-[400] max-w-sm hidden md:block pointer-events-auto bg-[#faf5eb]/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40 text-slate-800 shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                Fuente Primaria // Archivo Histórico
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 border border-amber-500/40 font-bold">
                {currentHistoricalMap.period}
              </span>
            </div>
            <p className="text-xs font-serif italic text-slate-600 leading-snug">
              "{currentHistoricalMap.cartoucheText}"
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-amber-500/25 flex justify-between">
              <span>{currentHistoricalMap.author}</span>
              <span className="text-amber-700 font-bold">{currentHistoricalMap.scale}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING TOP BAR: CHRONOLOGICAL TIMELINE & CONTROLS                    */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-hud px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 shrink-0 shadow-xl transition-all duration-300 hover:scale-[1.01]">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            01
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                isHistoricalMode 
                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300/80' 
                  : 'bg-sand-100/90 text-sand-900 border border-sand-300/80'
              }`}>
                {isHistoricalMode ? 'CARTOGRAFÍA HISTÓRICA' : 'VISTA AÉREA GIS'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Año {selectedYear}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
              {currentTimelineData.title}
            </h2>
          </div>
        </div>

        {/* 8-Epoch Timeline Selector with Previous/Next Arrows & Progress Track */}
        <div className="glass-hud p-1.5 rounded-2xl pointer-events-auto flex flex-col shadow-xl max-w-full">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {/* Step Back Arrow */}
            <button
              onClick={handlePrevEpoch}
              disabled={currentEpochIndex === 0}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Época anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Epoch Buttons */}
            {TIMELINE_EPOCHS.map((t) => {
              const isSelected = selectedYear === t.year;
              const isHist = t.type === 'historical';
              return (
                <button
                  key={t.year}
                  onClick={() => handleSelectYear(t.year)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 whitespace-nowrap flex items-center space-x-1.5 ${
                    isSelected
                      ? isHist 
                        ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-400/80 scale-105' 
                        : 'bg-stone-900 text-white shadow-md ring-2 ring-amber-500/80 scale-105'
                      : isHist 
                        ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-100/60' 
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  {isHist && <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span>{t.year}</span>
                </button>
              );
            })}

            {/* Step Forward Arrow */}
            <button
              onClick={handleNextEpoch}
              disabled={currentEpochIndex === TIMELINE_EPOCHS.length - 1}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Siguiente época (Flecha Derecha)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Timeline Progress Track */}
          <div className="w-full h-1 bg-slate-200/70 rounded-full overflow-hidden mt-1 px-1 relative">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 via-terracotta-500 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-xs" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Action Buttons: Gallery + Mode Toggle */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex items-center gap-1 self-start md:self-auto shrink-0 shadow-xl">
          <button
            onClick={() => setShowHistoricalGalleryModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/60 transition-colors shadow-xs hover:scale-[1.02]"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Atlas Histórico</span>
          </button>
          
          {!isHistoricalMode && (
            <button
              onClick={() => setMapLayerType(mapLayerType === 'satellite' ? 'carto' : 'satellite')}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-slate-100/80 hover:bg-slate-200 text-slate-800 transition-colors hover:scale-[1.02]"
            >
              <Compass className="w-3.5 h-3.5 text-slate-700" />
              <span>{mapLayerType === 'satellite' ? 'Vista Satélite' : 'Plano'}</span>
            </button>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. FLOATING LEFT DETAIL CARD (Context & Urban Evolution)                 */}
      {/* ========================================================================= */}
      <div className="absolute top-24 left-4 z-[400] hidden lg:block max-w-[340px] pointer-events-none">
        {isLeftPanelCollapsed ? (
          <button
            onClick={() => setIsLeftPanelCollapsed(false)}
            className="bg-white/95 px-3.5 py-2 rounded-2xl pointer-events-auto flex items-center space-x-2.5 text-slate-900 border border-slate-200 shadow-2xl hover:bg-white transition-all hover:scale-105 group"
            title="Expandir panel de análisis"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${isHistoricalMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-xs font-mono font-bold tracking-tight truncate max-w-[210px]">
              {selectedYear} &bull; {currentTimelineData.title.split(':')[1]?.trim() || currentTimelineData.title}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>
        ) : (
          <div 
            key={selectedYear}
            className="bg-white/95 p-4 rounded-3xl pointer-events-auto space-y-3 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl animate-slide-in-left-smooth text-slate-900"
          >
            {/* Header Row with Era Tag, Badge & Collapse Button */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center space-x-1.5 min-w-0">
                <div className={`w-2 h-2 rounded-full ${isHistoricalMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase truncate ${
                  isHistoricalMode ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {isHistoricalMode ? 'Cartografía Histórica' : 'Telemetría SIG'}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  {isHistoricalMode ? currentHistoricalMap?.period : `Año ${selectedYear}`}
                </span>
                <button
                  onClick={() => setIsLeftPanelCollapsed(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Minimizar panel"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subtitle / Tagline & Title */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                {currentTimelineData.tagline}
              </p>
              <h3 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                {currentTimelineData.title}
              </h3>
            </div>

            {/* Texto explicativo continuo con enter por frase */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2.5 shadow-xs">
              {currentTimelineData.description.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="text-xs text-slate-800 font-sans leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 4 CAD Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200">
              {currentTimelineData.metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-[10px] font-mono transition-colors"
                >
                  <span className="text-slate-500 block truncate text-[9px] uppercase tracking-wider">{m.label}</span>
                  <span className="font-bold text-slate-900 block truncate text-xs mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>

            {/* CTA Button for HD Gallery & Cartouche */}
            {isHistoricalMode && (
              <button
                onClick={() => {
                  setSelectedGalleryMap(currentHistoricalMap);
                  setShowHistoricalGalleryModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-amber-500/30 to-amber-700/30 hover:from-amber-600/50 hover:via-amber-500/50 hover:to-amber-700/50 border border-amber-500/50 text-amber-900 hover:text-amber-950 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01]"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Explorar Ficha y Cartela en HD</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Center Notification when Housing Contour is Active */}
      {highlightRelocationHouses && selectedYear >= 2026 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[450] animate-fade-in pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full border border-terracotta-500/80 shadow-2xl flex items-center space-x-3 backdrop-blur-md">
            <div className="p-1 rounded-full bg-red-100 text-red-600 animate-pulse">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">
              🏘️ 120 Casas del Corregimiento Contorneadas &bull; Borde de Socavación Sujeto a Reubicación (+22m)
            </span>
            <button
              onClick={() => setHighlightRelocationHouses(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              title="Quitar contorno"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {extraControls}

      {/* ========================================================================= */}
      {/* 5. HOTSPOT DETAIL MODAL (Modern Bay Pins)                                 */}
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

      {/* ========================================================================= */}
      {/* 6. HISTORICAL CARTOGRAPHY ATLAS MODAL (Full Gallery with All 5 Maps)       */}
      {/* ========================================================================= */}
      {showHistoricalGalleryModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      CORPUS CARTOGRÁFICO HISTÓRICO
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      6 Planos Primarios (1589 - 1900)
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                    Evolución Morfológica, Militar e Hidrográfica de Cartagena y Tierrabomba
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowHistoricalGalleryModal(false)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Left Selector Tabs + Right High-Res Viewer */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              
              {/* Left Column: Map Selector Cards (4 cols) */}
              <div className="lg:col-span-4 border-r border-slate-200 p-4 space-y-2.5 overflow-y-auto bg-slate-50/50">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-1">
                  Seleccionar Plano Histórico:
                </span>

                {HISTORICAL_MAPS_DATA.map((mapItem) => {
                  const isCur = selectedGalleryMap.id === mapItem.id;
                  return (
                    <div
                      key={mapItem.id}
                      onClick={() => setSelectedGalleryMap(mapItem)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                        isCur
                          ? 'bg-amber-50 border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCur ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Año {mapItem.year}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold truncate max-w-[150px]">
                          {mapItem.period}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                        {mapItem.title}
                      </h4>
                      <div className="h-20 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 relative">
                        <img 
                          src={mapItem.image} 
                          alt={mapItem.title} 
                          style={mapItem.flipHorizontal ? { transform: 'scaleX(-1)' } : undefined}
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Deep Analysis & High-Res Inspection (8 cols) */}
              <div className="lg:col-span-8 p-6 flex flex-col justify-between overflow-y-auto bg-white space-y-6">
                
                {/* Header Information */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                      Año {selectedGalleryMap.year}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {selectedGalleryMap.scale}
                    </span>
                    <span className="text-xs font-mono text-slate-500 ml-auto">
                      {selectedGalleryMap.author}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    {selectedGalleryMap.title}
                  </h2>
                  <div className="space-y-2.5">
                    {selectedGalleryMap.description.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm font-sans text-slate-700 leading-relaxed text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Main Large Image Container */}
                <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 flex items-center justify-center relative shadow-inner group">
                  <img 
                    src={selectedGalleryMap.image} 
                    alt={selectedGalleryMap.title} 
                    style={{ transform: `${selectedGalleryMap.flipHorizontal ? 'scaleX(-1) ' : ''}rotate(${getMapRotation(selectedGalleryMap.id)}deg) scaleX(${getMapMirror(selectedGalleryMap.id).h ? -1 : 1}) scaleY(${getMapMirror(selectedGalleryMap.id).v ? -1 : 1})` }}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[10px] font-mono border border-white/20">
                    {selectedGalleryMap.orientation}
                  </div>
                </div>

                {/* Key Features & Urban Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-700" />
                      <span>Análisis Morfológico Territorial</span>
                    </span>
                    <p className="text-xs text-slate-700 font-sans leading-relaxed">
                      {selectedGalleryMap.urbanAnalysis}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Hitos y Elementos Clave</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-amber-950 font-sans">
                      {selectedGalleryMap.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedYear(selectedGalleryMap.year);
                      setShowHistoricalGalleryModal(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center space-x-2 transition-colors shadow-md"
                  >
                    <span>Cargar este Mapa en el Tablero Principal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowHistoricalGalleryModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
