import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Layers, 
  Compass, 
  Sparkles, 
  SlidersHorizontal, 
  Scan, 
  Sliders, 
  Eye, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Table, 
  Maximize2, 
  ExternalLink,
  Leaf,
  Droplets,
  Activity,
  Flame,
  CheckCircle2,
  FileText,
  Sun,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
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
// OFICIAL: LAS 5 BANDAS ESPECTRALES DEL MÓDULO 03 (SHADERS CSS EN TIEMPO REAL)
// =========================================================================
export const SPECTRAL_LAYERS = [
  {
    id: 'ndvi',
    name: '🌿 NDVI • Biomasa & Vegetación',
    shortName: '🌿 NDVI Biomasa',
    badge: 'Vegetación & Biomasa',
    sensor: 'Sentinel-2 (NIR - Red) / (NIR + Red)',
    utility: 'Muestra la alta densidad de biomasa en la meseta (+22m) frente al suelo erosionado de la costa.',
    color: '#16a34a',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
    cssFilter: 'hue-rotate(55deg) saturate(3.8) contrast(1.4) brightness(0.96)',
    unit: 'Índice NDVI [-1.0 a +1.0]',
    legend: [
      { color: '#ffffff', label: 'Agua / Suelo Desnudo (< 0.1)' },
      { color: '#86efac', label: 'Vegetación Dispersa (0.2 - 0.4)' },
      { color: '#16a34a', label: 'Bosque en Meseta (+22m) (0.5 - 0.7)' },
      { color: '#14532d', label: 'Dosel Denso / Manglar (> 0.75)' }
    ],
    metrics: [
      { label: 'Biomasa en Meseta', value: '65 Hectáreas' },
      { label: 'Salud Vegetal', value: 'Media - Alta' },
      { label: 'Borde Costero', value: '0% Vegetación' },
      { label: 'Protección', value: 'Suelo Firme +22m' }
    ]
  },
  {
    id: 'ndwi',
    name: '💧 NDWI • Hidrografía & Humedad',
    shortName: '💧 NDWI Humedad',
    badge: 'Cuerpos de Agua',
    sensor: 'Sentinel-2 (Green - NIR) / (Green + NIR)',
    utility: 'Delinea la franja de marea activa y la socavación marina (cota < +1.5m).',
    color: '#0284c7',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-800',
    cssFilter: 'hue-rotate(185deg) saturate(4.2) contrast(1.65) brightness(1.1)',
    unit: 'Índice NDWI [-1.0 a +1.0]',
    legend: [
      { color: '#ffffff', label: 'Tierra Firme / Inmune (Meseta +22m)' },
      { color: '#7dd3fc', label: 'Zona Húmeda / Marea Activa' },
      { color: '#0284c7', label: 'Cuerpo de Agua / Bahía' },
      { color: '#0369a1', label: 'Canal de Acceso Profundo' }
    ],
    metrics: [
      { label: 'Espejo de Bahía', value: '82 km²' },
      { label: 'Línea de Costa', value: '18.4 km' },
      { label: 'Zona Inundable', value: 'Cota < +1.5m' },
      { label: 'Meseta +22m', value: '0% Inundable' }
    ]
  },
  {
    id: 'falsocolor',
    name: '🏝️ Falso Color • Suelo vs Bahía',
    shortName: '🏝️ Falso Color',
    badge: 'Contraste Espectral',
    sensor: 'Composición B8-B4-B3',
    utility: 'Contraste de geomorfología entre la roca calcárea de la meseta y las aguas someras.',
    color: '#ea580c',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-800',
    cssFilter: 'hue-rotate(305deg) saturate(3.4) contrast(1.5) brightness(1.0)',
    unit: 'Reflectancia Espectral',
    legend: [
      { color: '#1d4ed8', label: 'Cuenca Marítima' },
      { color: '#38bdf8', label: 'Aguas Someras Costeras' },
      { color: '#ea580c', label: 'Suelo Insular / Urbano' },
      { color: '#c2410c', label: 'Roca Firme / Meseta' }
    ],
    metrics: [
      { label: 'Suelo Expuesto', value: '57.2%' },
      { label: 'Frente Marino', value: 'Oeste Expuesto' },
      { label: 'Bahía Interna', value: 'Protegida' },
      { label: 'Roca', value: 'Caliza Coralina' }
    ]
  },
  {
    id: 'manglar',
    name: '🌳 Bosque Seco & Manglares',
    shortName: '🌳 Bosque & Manglar',
    badge: 'Barrera Ecológica',
    sensor: 'Clasificación RedEdge',
    utility: 'Mapeo de las 14.2 Ha de manglares que sirven de barrera biológica frente al oleaje de buques.',
    color: '#15803d',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
    cssFilter: 'hue-rotate(85deg) saturate(4.6) contrast(1.8) brightness(0.88)',
    unit: 'Densidad de Dosel Arbóreo',
    legend: [
      { color: '#ffffff', label: 'Zona Antrópica / Sin Cobertura' },
      { color: '#bbf7d0', label: 'Matorral Seco Ralo' },
      { color: '#22c55e', label: 'Bosque Seco Tropical' },
      { color: '#14532d', label: 'Manglar Ribereño de Protección' }
    ],
    metrics: [
      { label: 'Manglar Protegido', value: '14.2 Ha' },
      { label: 'Barrera Natural', value: 'Flanco Este' },
      { label: 'Bosque en Meseta', value: '38 Ha' },
      { label: 'Impacto Buques', value: 'Amortiguado' }
    ]
  },
  {
    id: 'termico',
    name: '🌡️ LST • Temperatura Superficial',
    shortName: '🌡️ LST Térmico',
    badge: 'Infrarrojo Térmico',
    sensor: 'Landsat-8 TIRS Banda 10',
    utility: 'Evidencia que la meseta registra hasta -3.8°C respecto al concreto continental gracias al viento alisio.',
    color: '#eab308',
    accentBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-900',
    cssFilter: 'hue-rotate(240deg) saturate(4.8) contrast(1.8) brightness(1.2) invert(0.06)',
    unit: 'Temperatura Superficial (°C)',
    legend: [
      { color: '#1e3a8a', label: 'Mar / Bahía (~27°C - 29°C)' },
      { color: '#3b82f6', label: 'Costa Húmeda (~30°C)' },
      { color: '#eab308', label: 'Meseta y Vegetación (~32°C)' },
      { color: '#ef4444', label: 'Suelo Expuesto / Urbano (~36°C+)' }
    ],
    metrics: [
      { label: 'Temp. Mar Bahía', value: '28.5 °C' },
      { label: 'Temp. Meseta +22m', value: '31.2 °C' },
      { label: 'Delta Térmico', value: '-3.8 °C vs Centro' },
      { label: 'Viento Alisio', value: '18 - 25 km/h' }
    ]
  }
];

export default function DiagnosisMap({ onNavigateModule }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Active state
  const [selectedBandId, setSelectedBandId] = useState('ndvi');
  const [spectralDisplayMode, setSpectralDisplayMode] = useState('swipe'); // 'swipe' | 'overlay' | 'scanner'
  const [swipePosition, setSwipePosition] = useState(50); // 0 to 100%
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false);
  const [filterIntensity, setFilterIntensity] = useState(100); // 10% to 100%
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showLegendCard, setShowLegendCard] = useState(true);
  const [scannerProgress, setScannerProgress] = useState(0);

  const activeBand = useMemo(() => {
    return SPECTRAL_LAYERS.find(b => b.id === selectedBandId) || SPECTRAL_LAYERS[0];
  }, [selectedBandId]);

  // =========================================================================
  // 1. INITIALIZE LEAFLET MAP
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map comfortably to encompass both Tierrabomba and Cartagena Bay
    const map = L.map(mapContainerRef.current, {
      center: [10.3580, -75.5580],
      zoom: 12.8,
      zoomControl: false,
      attributionControl: false
    });

    // Satellite Aerial Layer (Esri World Imagery - 100% Native 4K High-Res)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = satLayer;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Island Perimeter Contour Line
    const islandContour = L.polygon([
      [10.3804, -75.57697],
      [10.37854, -75.57804],
      [10.37583, -75.5786],
      [10.37381, -75.57821],
      [10.37127, -75.57894],
      [10.36857, -75.58044],
      [10.3665, -75.58302],
      [10.36599, -75.58559],
      [10.36401, -75.58632],
      [10.36223, -75.58667],
      [10.36071, -75.5889],
      [10.35907, -75.58959],
      [10.35819, -75.59147],
      [10.35598, -75.59177],
      [10.35404, -75.59053],
      [10.35167, -75.59053],
      [10.34918, -75.59199],
      [10.34694, -75.59298],
      [10.34373, -75.59246],
      [10.34204, -75.59229],
      [10.33968, -75.59109],
      [10.33735, -75.5916],
      [10.33368, -75.59302],
      [10.33161, -75.59302],
      [10.32929, -75.59242],
      [10.32717, -75.59173],
      [10.32561, -75.59074],
      [10.32396, -75.59104],
      [10.32236, -75.5895],
      [10.3213, -75.58658],
      [10.31906, -75.58298],
      [10.31801, -75.58135],
      [10.3194, -75.58019],
      [10.32139, -75.58057],
      [10.3227, -75.57899],
      [10.32519, -75.57641],
      [10.3281, -75.57452],
      [10.32852, -75.5762],
      [10.32941, -75.57787],
      [10.33127, -75.57718],
      [10.33304, -75.57899],
      [10.33579, -75.57843],
      [10.33545, -75.57671],
      [10.33837, -75.57439],
      [10.34107, -75.57045],
      [10.34179, -75.56869],
      [10.34407, -75.56658],
      [10.34373, -75.56452],
      [10.34175, -75.56384],
      [10.34001, -75.56414],
      [10.33866, -75.56396],
      [10.33913, -75.56285],
      [10.34035, -75.56229],
      [10.33896, -75.56152],
      [10.33811, -75.56066],
      [10.33745, -75.56009],
      [10.33766, -75.55927],
      [10.33878, -75.55946],
      [10.33992, -75.55944],
      [10.34062, -75.56021],
      [10.34345, -75.56094],
      [10.34518, -75.56049],
      [10.34569, -75.55963],
      [10.3449, -75.55924],
      [10.34556, -75.55824],
      [10.34476, -75.55753],
      [10.34349, -75.55789],
      [10.34258, -75.55755],
      [10.34129, -75.55669],
      [10.34218, -75.55615],
      [10.34155, -75.5553],
      [10.34034, -75.55452],
      [10.33918, -75.55439],
      [10.33857, -75.55515],
      [10.33838, -75.55577],
      [10.33766, -75.55474],
      [10.33886, -75.5533],
      [10.33846, -75.5524],
      [10.3373, -75.55146],
      [10.33671, -75.55113],
      [10.33641, -75.54997],
      [10.33597, -75.54871],
      [10.33766, -75.54759],
      [10.33967, -75.54706],
      [10.341, -75.54701],
      [10.34177, -75.54585],
      [10.34175, -75.5444],
      [10.34172, -75.54317],
      [10.34244, -75.54249],
      [10.34392, -75.54339],
      [10.34538, -75.54201],
      [10.34595, -75.54068],
      [10.34696, -75.53952],
      [10.34842, -75.53875],
      [10.34967, -75.53895],
      [10.3503, -75.54017],
      [10.34986, -75.54234]
    ], {
      color: '#ea580c',
      weight: 2,
      dashArray: '6, 6',
      fillColor: 'transparent',
      fillOpacity: 0,
      opacity: 0.6,
      interactive: false
    }).addTo(map);

    // Safe Plateau Contour (+22m) - NO FILL, clean crisp border
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
      weight: 3.5,
      dashArray: '6, 6',
      interactive: false
    }).addTo(map);

    mapInstanceRef.current = {
      map,
      islandContour,
      safePlateau
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Scanner animation interval
  useEffect(() => {
    if (spectralDisplayMode !== 'scanner') return;

    const interval = setInterval(() => {
      setScannerProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1.2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [spectralDisplayMode]);

  // Layer type switcher
  useEffect(() => {
    if (!mapInstanceRef.current?.map) return;
    const map = mapInstanceRef.current.map;

    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

    if (mapLayerType === 'satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri World Imagery'
      }).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
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

  return (
    <div 
      className="relative w-full h-screen overflow-hidden animate-fade-in select-none"
      onMouseMove={handleMapMouseMove}
      onTouchMove={handleMapMouseMove}
      onMouseUp={() => setIsDraggingSwipe(false)}
      onTouchEnd={() => setIsDraggingSwipe(false)}
    >
      
      {/* 1. FULLSCREEN SATELLITE MAP (CRISP 4K NATIVE TILES) */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 2. PURE CSS SHADER FILTER OVERLAY (ZERO BLURRY PNGS - NATIVE 60FPS)       */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full z-[100] pointer-events-none transition-none"
        style={{
          backdropFilter: activeBand.cssFilter,
          WebkitBackdropFilter: activeBand.cssFilter,
          opacity: filterIntensity / 100,
          clipPath: spectralDisplayMode === 'swipe'
            ? `polygon(${swipePosition}% 0%, 100% 0%, 100% 100%, ${swipePosition}% 100%)`
            : spectralDisplayMode === 'scanner'
              ? `polygon(0% 0%, ${scannerProgress}% 0%, ${scannerProgress}% 100%, 0% 100%)`
              : 'none'
        }}
      />

      {/* ========================================================================= */}
      {/* 3. REALTIME INTERACTIVE SWIPE CURTAIN DIVIDER                             */}
      {/* ========================================================================= */}
      {spectralDisplayMode === 'swipe' && (
        <div 
          className="absolute inset-y-0 z-[300] pointer-events-auto cursor-ew-resize flex items-center justify-center transition-none"
          style={{ left: `${swipePosition}%` }}
          onMouseDown={() => setIsDraggingSwipe(true)}
          onTouchStart={() => setIsDraggingSwipe(true)}
        >
          {/* Vertical Dividing Glass Line */}
          <div className="w-1.5 h-full bg-white shadow-[0_0_25px_rgba(255,255,255,1)] backdrop-blur-sm relative flex items-center justify-center">
            
            {/* Top Tag */}
            <div className="absolute top-20 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-white/30 text-[9px] font-mono text-white font-bold shadow-xl">
              COMPARADOR GIS
            </div>

            {/* Central Glowing Drag Grip Pill */}
            <div className="w-11 h-11 -translate-x-1/2 rounded-full bg-slate-900 border-2 border-white shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform group">
              <div className="flex items-center space-x-0.5 text-amber-400">
                <ChevronLeft className="w-4 h-4 -mr-1 animate-pulse" />
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Bottom Sub-tag */}
            <div className="absolute bottom-28 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-slate-900/90 border border-white/20 text-[10px] font-mono font-bold shadow-2xl flex items-center space-x-2">
              <span className="text-slate-300">Satélite Real</span>
              <span className="text-amber-400 font-black">|</span>
              <span style={{ color: activeBand.color }}>{activeBand.shortName} (Shader CSS)</span>
            </div>

          </div>
        </div>
      )}

      {/* Radar Scanner Vertical Laser Line */}
      {spectralDisplayMode === 'scanner' && (
        <div 
          className="absolute inset-y-0 z-[300] pointer-events-none transition-none"
          style={{ left: `${scannerProgress}%` }}
        >
          <div className="w-0.5 h-full bg-cyan-400 shadow-[0_0_25px_#06b6d4] relative">
            <div className="absolute top-24 -translate-x-1/2 px-2.5 py-1 rounded-full bg-cyan-950/95 border border-cyan-400/80 text-[10px] font-mono font-bold text-cyan-300 shadow-xl flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>BARRIDO LÁSER: {Math.round(scannerProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TOP FLOATING CONTROL BAR (HUD)                                         */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-hud px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-xl shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            03
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                TELEDETECCIÓN & ANÁLISIS ESPECTRAL
              </span>
              <span className="text-[9px] font-mono text-cyan-800 font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-300">
                5 BANDAS GIS (CSS SHADER)
              </span>
            </div>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
              {activeBand.name}
            </h2>
          </div>
        </div>

        {/* 5 Main Band Tabs in Header */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center shadow-xl">
          {SPECTRAL_LAYERS.map((band) => {
            const isSelected = selectedBandId === band.id;
            return (
              <button
                key={band.id}
                onClick={() => setSelectedBandId(band.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-cyan-400/50 scale-102'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                <span>{band.shortName}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Right Tools: Matrix Table Modal & Aerial Switcher */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex items-center gap-1 self-start md:self-auto shadow-xl">
          
          <button
            onClick={() => setShowMatrixModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm flex items-center space-x-1.5 transition-all"
            title="Ver Tabla Científica de las 5 Bandas"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Matriz Científica</span>
          </button>

          <button
            onClick={() => setMapLayerType(mapLayerType === 'satellite' ? 'carto' : 'satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              mapLayerType === 'satellite'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-900 text-white shadow-sm'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mapLayerType === 'satellite' ? 'Satélite' : 'Plano'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. FLOATING SCIENTIFIC TELEMETRY & LEGEND CARD (LEFT PANEL)               */}
      {/* ========================================================================= */}
      {showLegendCard && (
        <div className="absolute top-24 left-4 z-[400] pointer-events-none animate-scale-up max-w-sm w-full">
          <div className="glass-panel p-4 rounded-3xl shadow-2xl border border-white/60 pointer-events-auto space-y-3 text-slate-900 backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeBand.color }} />
                <h3 className="font-serif font-bold text-xs text-slate-900">
                  {activeBand.name}
                </h3>
              </div>
              <button
                onClick={() => setShowLegendCard(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sensor & Algorithm Badge */}
            <div className="p-2.5 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-[10px] space-y-1 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-slate-400">
                <span>Sensor & Algoritmo:</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {activeBand.badge}
                </span>
              </div>
              <p className="font-bold text-cyan-200 text-xs">
                {activeBand.sensor}
              </p>
            </div>

            {/* Territorial Utility */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                Utilidad Arquitectónica & Territorial:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                "{activeBand.utility}"
              </p>
            </div>

            {/* Color Classification Legend */}
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

            {/* Key Metrics Grid */}
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

      {/* Floating Toggle Pill when Legend Card is minimized */}
      {!showLegendCard && (
        <button
          onClick={() => setShowLegendCard(true)}
          className="absolute top-24 left-4 z-[400] glass-hud px-3.5 py-2 rounded-2xl text-xs font-mono font-bold text-slate-900 shadow-xl flex items-center space-x-2 pointer-events-auto hover:scale-105 transition-transform"
        >
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span>Ver Ficha: {activeBand.shortName}</span>
        </button>
      )}

      {/* ========================================================================= */}
      {/* 6. SPECTRAL STUDIO FLOATING BOTTOM DOCK & INTERACTIVE CONTROLS            */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none animate-slide-up">
        <div className="max-w-4xl mx-auto glass-panel p-3 sm:p-3.5 rounded-3xl shadow-2xl border border-white/60 pointer-events-auto space-y-2.5 text-slate-900 backdrop-blur-xl">
          
          {/* Controls: Mode Switcher & Opacity Slider */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                Interacción:
              </span>
              <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                <button
                  onClick={() => setSpectralDisplayMode('swipe')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                    spectralDisplayMode === 'swipe' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                  <span>Cortina Swipe</span>
                </button>

                <button
                  onClick={() => setSpectralDisplayMode('overlay')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                    spectralDisplayMode === 'overlay' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3 h-3 text-teal-400" />
                  <span>Superposición Total</span>
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

            {/* Filter Intensity Slider */}
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="text-[10px] text-slate-500 font-bold">Intensidad Shader:</span>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={filterIntensity}
                onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <span className="font-bold text-slate-800 text-[10px]">{filterIntensity}%</span>
            </div>

            {/* View Table Button */}
            <button
              onClick={() => setShowMatrixModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Table className="w-3 h-3 text-amber-400" />
              <span>Ver las 5 Bandas</span>
            </button>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. FULL MATRIX MODAL (TABLA CIENTÍFICA DE LAS 5 BANDAS DE TESIS)          */}
      {/* ========================================================================= */}
      {showMatrixModal && (
        <div 
          onClick={() => setShowMatrixModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 animate-scale-up text-slate-900 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-base shadow-sm">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider">
                    Teledetección & Procesamiento Satelital MIDAS
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Matriz de Análisis Espectral (Isla Tierrabomba)
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Table: Banda / Capa | Sensor & Algoritmo | Utilidad Arquitectónica & Territorial */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-tl-xl">Banda / Capa</th>
                    <th className="py-3 px-4">Sensor & Algoritmo</th>
                    <th className="py-3 px-4">Utilidad Arquitectónica & Territorial</th>
                    <th className="py-3 px-4 text-center rounded-tr-xl">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {SPECTRAL_LAYERS.map((band) => {
                    const isSelected = selectedBandId === band.id;
                    return (
                      <tr 
                        key={band.id}
                        className={`transition-colors hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/60 font-semibold' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                            <span>{band.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-cyan-900 whitespace-nowrap font-bold">
                          {band.sensor}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed font-normal">
                          {band.utility}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedBandId(band.id);
                              setShowMatrixModal(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800'
                            }`}
                          >
                            {isSelected ? 'Activa' : 'Proyectar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 text-xs font-mono text-slate-500">
              <span>Resolución Espacial: 10m / Píxel &bull; Shader CSS en Tiempo Real (GPU Native 60fps)</span>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
              >
                Cerrar Matriz
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
