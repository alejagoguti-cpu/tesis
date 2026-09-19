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
  Maximize2,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  FileText,
  Info,
  BookOpen
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
    year: 1690,
    type: "historical",
    mapId: "map_1690",
    title: "1690: Flota Naval y Baterías de Bahía",
    tagline: "Cartografía Colonial Temprana // Siglo XVII",
    description: "Plaza fuerte amurallada, despliegue defensivo de la Flota de Indias y rol estratégico de Tierrabomba y Bocachica como escudo protector natural.",
    color: "#854d0e",
    metrics: [
      { label: "Período", value: "Siglo XVII Tardío" },
      { label: "Escuadra", value: "Galeones de Indias" },
      { label: "Defensa", value: "Baterías Someras" },
      { label: "Rol Insular", value: "Escudo de Bahía" }
    ]
  },
  {
    year: 1730,
    type: "historical",
    mapId: "map_1730",
    title: "1730: Plano de la Plaza Fuerte de Cartagena",
    tagline: "Cartografía Barroca Ilustrada // Siglo XVIII",
    description: "Orla artística de Neptuno y divinidades marinas. Consolidación de baluartes, cortinas de murallas y relación con las rompientes oceánicas.",
    color: "#b45309",
    metrics: [
      { label: "Baluartes", value: "San Ignacio & Sto Domingo" },
      { label: "Trazado", value: "Damasco Ortogonal" },
      { label: "Artesanía", value: "Orla Barroca Marina" },
      { label: "Aislamiento", value: "Ciénagas Defensivas" }
    ]
  },
  {
    year: 1770,
    type: "historical",
    mapId: "map_1770",
    title: "1770: Catastro y División por Cuarteles",
    tagline: "Reformas Borbónicas // Juan de Herrera",
    description: "Planta de máxima precisión geométrica con índice exhaustivo de más de 60 hitos cívicos, conventos, aljibes comunales y cuarteles de policía.",
    color: "#c2410c",
    metrics: [
      { label: "Cuarteles", value: "Catedral, San Diego, Getsemaní" },
      { label: "Catastro", value: ">60 Edificios Notables" },
      { label: "Aljibes", value: "Ciclópeos Conventuales" },
      { label: "Ingeniería", value: "Antonio de Arévalo" }
    ]
  },
  {
    year: 1780,
    type: "historical",
    mapId: "map_1780",
    title: "1780: Red Defensiva San Lázaro y Manga",
    tagline: "Defensa en Profundidad // Antonio de Arévalo",
    description: "Plano estratégico policromado en carmín. Articulación entre el Centro, Castillo San Felipe de Barajas, Isla de Manga y la bahía interior.",
    color: "#9a3412",
    metrics: [
      { label: "Fortaleza", value: "San Felipe de Barajas" },
      { label: "Territorio", value: "Centro, Manga, Bocachica" },
      { label: "Escollera", value: "Submarina Anti-Oleaje" },
      { label: "Técnica", value: "Acuarela & Tinta Carmín" }
    ]
  },
  {
    year: 1915,
    type: "historical",
    mapId: "map_1915",
    title: "1915: Estudios del Puerto Moderno (Pearson & Son)",
    tagline: "Ingeniería Británica // República Temprana",
    description: "Levantamiento hidrográfico y predial a escala 1:2500 para modernización portuaria, muelle de La Machina y Ferrocarril Cartagena-Calamar.",
    color: "#0369a1",
    metrics: [
      { label: "Escala", value: "1 : 2.500 Milimétrica" },
      { label: "Firma", value: "S. Pearson & Son (Londres)" },
      { label: "Transporte", value: "Ferrocarril & Tranvía" },
      { label: "Edificios", value: "45 Hitos Republicano" }
    ]
  },
  {
    year: 1980,
    type: "modern",
    title: "1980: Línea Base Tradicional",
    tagline: "Pesca Artesanal & Costa Natural",
    description: "Tierrabomba mantiene su bosque seco y costa arenosa con mínima erosión antes de la intensificación del canal industrial de Mamonal.",
    color: "#0284c7",
    metrics: [
      { label: "Población", value: "~1.800 hab." },
      { label: "Tráfico Buques", value: "Bajo (Calado 8m)" },
      { label: "Tasa Erosión", value: "0.3 m/año" },
      { label: "Cobertura Agua", value: "Aljibes y lluvia" }
    ]
  },
  {
    year: 2026,
    type: "modern",
    title: "2026: Diagnóstico Crítico Actual",
    tagline: "Contraste Territorial & Vulnerabilidad",
    description: "Cartagena moderna frente a una isla sin red de acueducto (0%), 1.8 m/año de retroceso costero y 120 viviendas con cimientos socavados.",
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
    type: "modern",
    title: "2050: Masterplan Resiliente (Tesis)",
    tagline: "Soberanía Hídrica + Reubicación +22m",
    description: "Reasentamiento de 120 familias a cota segura (+22m), colegio bioclimático de 350 plazas y macro-aljibe ciclópeo de 450.000 L.",
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
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [showHistoricalGalleryModal, setShowHistoricalGalleryModal] = useState(false);
  const [selectedGalleryMap, setSelectedGalleryMap] = useState(HISTORICAL_MAPS_DATA[4]); // default 1915

  // Historical Map Canvas Interaction State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState('natural'); // 'natural' | 'sepia' | 'contrast' | 'invert'

  const bayMapRef = useRef(null);
  const bayMapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const markersRef = useRef([]);

  const currentTimelineData = TIMELINE_EPOCHS.find(y => y.year === selectedYear) || TIMELINE_EPOCHS[6];
  const isHistoricalMode = currentTimelineData.type === 'historical';
  const currentHistoricalMap = isHistoricalMode 
    ? HISTORICAL_MAPS_DATA.find(m => m.id === currentTimelineData.mapId) || HISTORICAL_MAPS_DATA[0]
    : null;

  // Reset zoom & pan when switching years
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [selectedYear]);

  // Initialize Fullscreen Leaflet Map with High-Res Satellite Aerial Imagery for modern years
  useEffect(() => {
    if (!bayMapRef.current || bayMapInstanceRef.current) return;

    const map = L.map(bayMapRef.current, {
      center: [10.365, -75.550],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Aerial Satellite Imagery without API key (Esri World Imagery)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri, Maxar, Earthstar Geographics'
    }).addTo(map);

    const labelsLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.85
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = labelsLayer;

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

  return (
    <div 
      className="relative w-full h-screen overflow-hidden animate-fade-in select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      
      {/* ========================================================================= */}
      {/* 1. MAIN BACKGROUND: LEAFLET SATELLITE MAP OR HISTORICAL CARTOGRAPHY CANVAS */}
      {/* ========================================================================= */}
      
      {/* A. Live Aerial Satellite Map (for modern & masterplan years) */}
      <div 
        ref={bayMapRef} 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 z-0 ${
          isHistoricalMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`} 
      />

      {/* B. High-Resolution Historical Map Viewer Canvas (for 1690, 1730, 1770, 1780, 1915) */}
      {isHistoricalMode && currentHistoricalMap && (
        <div 
          className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing z-0 animate-fade-in"
          onMouseDown={handleMouseDown}
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Map Image with Zoom, Pan and Archival Filters */}
          <div 
            className="transition-transform duration-75 ease-out select-none"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              filter: getFilterStyle()
            }}
          >
            <img 
              src={currentHistoricalMap.image} 
              alt={currentHistoricalMap.title}
              className="max-w-none max-h-[88vh] rounded-lg shadow-2xl border-4 border-amber-950/40 pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Historical Controls HUD (Zoom, Filters, Reset) */}
          <div className="absolute right-4 top-24 z-[400] flex flex-col gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3.5))}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.6))}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Restablecer Vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              onClick={() => {
                const modes = ['natural', 'contrast', 'sepia', 'invert'];
                const nextIdx = (modes.indexOf(filterMode) + 1) % modes.length;
                setFilterMode(modes[nextIdx]);
              }}
              className={`p-2.5 rounded-xl text-white transition-colors ${
                filterMode !== 'natural' ? 'bg-amber-600' : 'bg-white/10 hover:bg-white/20'
              }`}
              title={`Filtro de Imagen: ${filterMode.toUpperCase()}`}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Historical Cartouche Annotation Box */}
          <div className="absolute bottom-24 right-4 z-[400] max-w-sm hidden md:block pointer-events-auto bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 text-white shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                Fuente Primaria // Archivo Histórico
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {currentHistoricalMap.period}
              </span>
            </div>
            <p className="text-xs font-serif italic text-slate-300 leading-snug">
              "{currentHistoricalMap.cartoucheText}"
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/10 flex justify-between">
              <span>{currentHistoricalMap.author}</span>
              <span className="text-amber-300 font-bold">{currentHistoricalMap.scale}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING TOP BAR: CHRONOLOGICAL TIMELINE & CONTROLS                    */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            00
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isHistoricalMode 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
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

        {/* 8-Epoch Timeline Selector (1690 to 2050) */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar">
          {TIMELINE_EPOCHS.map((t) => {
            const isSelected = selectedYear === t.year;
            const isHist = t.type === 'historical';
            return (
              <button
                key={t.year}
                onClick={() => setSelectedYear(t.year)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isSelected
                    ? isHist 
                      ? 'bg-amber-700 text-white shadow-md' 
                      : 'bg-slate-900 text-white shadow-md'
                    : isHist 
                      ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-50' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isHist && <BookOpen className="w-3 h-3 text-amber-500 shrink-0" />}
                <span>{t.year}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Gallery + Mode Toggle */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowHistoricalGalleryModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Atlas Histórico</span>
          </button>
          
          {!isHistoricalMode && (
            <button
              onClick={() => setMapLayerType(mapLayerType === 'satellite' ? 'carto' : 'satellite')}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-slate-700" />
              <span>{mapLayerType === 'satellite' ? 'Vista Satélite' : 'Plano'}</span>
            </button>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING LEFT DETAIL CARD (Context & Urban Evolution)                 */}
      {/* ========================================================================= */}
      <div className="absolute top-24 left-4 z-[400] hidden lg:block max-w-sm pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
              isHistoricalMode ? 'text-amber-800' : 'text-slate-500'
            }`}>
              {currentTimelineData.tagline}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
              {isHistoricalMode ? 'Plano ' + currentHistoricalMap.period : 'Monitoreo GIS'}
            </span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            {currentTimelineData.description}
          </p>

          {isHistoricalMode && currentHistoricalMap && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950 space-y-1.5">
              <span className="font-mono font-bold text-amber-900 flex items-center space-x-1">
                <Compass className="w-3 h-3 text-amber-700" />
                <span>Análisis Morfológico Insular:</span>
              </span>
              <p className="text-xs font-sans leading-snug text-amber-900/90">
                {currentHistoricalMap.urbanAnalysis}
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {currentTimelineData.metrics.map((m, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[10px] font-mono">
                <span className="text-slate-500 block truncate">{m.label}</span>
                <span className="font-bold text-slate-900 block truncate">{m.value}</span>
              </div>
            ))}
          </div>

          {isHistoricalMode && (
            <button
              onClick={() => {
                setSelectedGalleryMap(currentHistoricalMap);
                setShowHistoricalGalleryModal(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-colors shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Ver Ficha y Cartela en HD</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FLOATING BOTTOM: 6 THESIS KPI STRIP                                   */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-7xl mx-auto pointer-events-auto">
          
          {/* KPI 1: Housing */}
          <div 
            onClick={() => onSelectModule && onSelectModule('programs')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-terracotta-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-terracotta-50 text-terracotta-600">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-terracotta-50 text-terracotta-700">
                MOD 03
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Reubicación</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">120 Casas</h4>
            <p className="text-[9px] text-slate-500 truncate">Meseta segura +22m</p>
          </div>

          {/* KPI 2: School */}
          <div 
            onClick={() => onSelectModule && onSelectModule('programs')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-teal-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700">
                DOTACIONAL
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Educativo</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">350 Plazas</h4>
            <p className="text-[9px] text-slate-500 truncate">Aulas & Talleres</p>
          </div>

          {/* KPI 3: Water */}
          <div 
            onClick={() => onSelectModule && onSelectModule('water')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-blue-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                MOD 07
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Reserva Hídrica</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">450.000 L</h4>
            <p className="text-[9px] text-slate-500 truncate">90 días de sequía</p>
          </div>

          {/* KPI 4: Safe Plateau */}
          <div 
            onClick={() => onSelectModule && onSelectModule('gis')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-emerald-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                TERRITORIO
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Cota Segura</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">+22.00m</h4>
            <p className="text-[9px] text-slate-500 truncate">0% riesgo marino</p>
          </div>

          {/* KPI 5: Solar */}
          <div 
            onClick={() => onSelectModule && onSelectModule('bioclimatic')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-amber-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700">
                ENERGÍA
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Matriz Solar</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">100% FV</h4>
            <p className="text-[9px] text-slate-500 truncate">Autonomía total</p>
          </div>

          {/* KPI 6: Bioclimatic Comfort */}
          <div 
            onClick={() => onSelectModule && onSelectModule('bioclimatic')}
            className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl hover:border-teal-500 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700">
                CONFORT
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Pasivo</p>
            <h4 className="font-serif font-bold text-lg text-slate-900">-5.2 °C</h4>
            <p className="text-[9px] text-slate-500 truncate">Alisios N-NE</p>
          </div>

        </div>
      </div>

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
                      5 Planos Primarios (1690 - 1915)
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
                  <p className="text-xs sm:text-sm font-sans text-slate-700 leading-relaxed">
                    {selectedGalleryMap.description}
                  </p>
                </div>

                {/* Main Large Image Container */}
                <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 flex items-center justify-center relative shadow-inner group">
                  <img 
                    src={selectedGalleryMap.image} 
                    alt={selectedGalleryMap.title} 
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
