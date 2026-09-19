import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, 
  Target, 
  Compass, 
  CheckCircle2, 
  FileCheck2, 
  Layers, 
  HelpCircle,
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  X, 
  AlertTriangle, 
  Waves, 
  GraduationCap, 
  Home, 
  Droplets, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight, 
  Quote, 
  Sparkles, 
  ExternalLink,
  Edit3,
  Save,
  Trash2,
  Undo2,
  Plus,
  Move,
  Copy,
  Download,
  Check,
  MapPin,
  Sliders,
  Eye,
  Eraser,
  RefreshCw
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

// Default base coordinates
export const DEFAULT_DELIMITATIONS = {
  island: [
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
    [10.34986, -75.54234],
    [10.35083, -75.54294],
    [10.35095, -75.54442],
    [10.35163, -75.54568],
    [10.35279, -75.54568],
    [10.3534, -75.54682],
    [10.35497, -75.54603],
    [10.35503, -75.54504],
    [10.35725, -75.54551],
    [10.35754, -75.54433],
    [10.35775, -75.54287],
    [10.35716, -75.54229],
    [10.3569, -75.54158],
    [10.35619, -75.54151],
    [10.35568, -75.54096],
    [10.35568, -75.54052],
    [10.35657, -75.54037],
    [10.35756, -75.54038],
    [10.35826, -75.54008],
    [10.3593, -75.53946],
    [10.35973, -75.53918],
    [10.35936, -75.53897],
    [10.35888, -75.53906],
    [10.35849, -75.53874],
    [10.35816, -75.53846],
    [10.3576, -75.53836],
    [10.35701, -75.53823],
    [10.35652, -75.53817],
    [10.35614, -75.53815],
    [10.35642, -75.5377],
    [10.35683, -75.53734],
    [10.35777, -75.53787],
    [10.35878, -75.53828],
    [10.35954, -75.53862],
    [10.36059, -75.53939],
    [10.36199, -75.54039],
    [10.36341, -75.54288],
    [10.36454, -75.54563],
    [10.36486, -75.54787],
    [10.36548, -75.54905],
    [10.36543, -75.55047],
    [10.36583, -75.55119],
    [10.36558, -75.55266],
    [10.3661, -75.55401],
    [10.36566, -75.55676],
    [10.36658, -75.55884],
    [10.36769, -75.5593],
    [10.36802, -75.56081],
    [10.36951, -75.56355],
    [10.37207, -75.56711],
    [10.37369, -75.57036],
    [10.37643, -75.57263],
    [10.37804, -75.57406],
    [10.37968, -75.5743],
    [10.38038, -75.57408],
    [10.38087, -75.57485],
    [10.38124, -75.57514],
    [10.38103, -75.57447],
    [10.38029, -75.57348],
    [10.38015, -75.57307],
    [10.38065, -75.5734],
    [10.3812, -75.57404],
    [10.38148, -75.57487],
    [10.38154, -75.57543],
    [10.3809, -75.5764]
  ],
  erosion: [
    [10.3750, -75.5880],
    [10.3680, -75.5960],
    [10.3580, -75.6010],
    [10.3450, -75.5960],
    [10.3350, -75.5880],
    [10.3280, -75.5780]
  ],
  plateau: [
    [10.3560, -75.5720],
    [10.3590, -75.5600],
    [10.3510, -75.5560],
    [10.3440, -75.5630],
    [10.3480, -75.5740]
  ],
  custom: []
};

export const ZONE_CONFIG = {
  island: {
    id: "island",
    name: "1. Contorno Isla Tierrabomba",
    type: "polygon",
    color: "#ea580c",
    fillColor: "#ea580c",
    badge: "Perímetro Insular",
    desc: "Delimitación del borde costero e insular de Tierrabomba."
  },
  erosion: {
    id: "erosion",
    name: "2. Franja de Erosión Costera",
    type: "polyline",
    color: "#dc2626",
    fillColor: "#dc2626",
    badge: "Riesgo 1.8 m/año",
    desc: "Línea de socavación marina activa en el flanco occidental."
  },
  plateau: {
    id: "plateau",
    name: "3. Meseta Segura (+22.00m)",
    type: "polygon",
    color: "#0d9488",
    fillColor: "#0d9488",
    badge: "Cota Segura Masterplan",
    desc: "Área de implantación protegida para vivienda y colegio."
  },
  custom: {
    id: "custom",
    name: "4. Polígono Libre / Personalizado",
    type: "polygon",
    color: "#6366f1",
    fillColor: "#6366f1",
    badge: "Trazado Libre",
    desc: "Zona adicional para delimitaciones específicas de diseño."
  }
};

export const FRAMEWORK_STEPS = [
  {
    step: 1,
    id: "delimitacion",
    title: "1. Delimitación Territorial",
    badge: "Paso 01 // Territorio",
    targetName: "Isla Tierrabomba (4.300 hab)",
    center: [10.352, -75.572],
    zoom: 13,
    highlight: "island",
    modalType: "problem",
    btnLabel: "Planteamiento del Problema",
    description: "Inspección perimetral de la isla, contexto insular caribeño y diagnóstico de aislamiento.",
    hint: "Haz clic sobre la isla delimitada para abrir el Planteamiento del Problema"
  },
  {
    step: 2,
    id: "erosion",
    title: "2. Franja de Erosión Costera",
    badge: "Paso 02 // Riesgo Físico",
    targetName: "Borde Crítico (Pérdida 1.8 m/año)",
    center: [10.358, -75.588],
    zoom: 14,
    highlight: "erosion",
    modalType: "justification",
    btnLabel: "Justificación de la Propuesta",
    description: "Simulación de avance del nivel del mar y socavación marina de viviendas costeras.",
    hint: "Haz clic sobre la franja roja de erosión para abrir la Justificación"
  },
  {
    step: 3,
    id: "colegio",
    title: "3. Colegio Actual en Riesgo",
    badge: "Paso 03 // Vulnerabilidad",
    targetName: "I.E. Tierrabomba en Cota +1.5m",
    center: [10.362, -75.581],
    zoom: 15,
    highlight: "currentSchool",
    modalType: "objectives",
    btnLabel: "Objetivos de la Investigación",
    description: "Equipamiento educativo precario en zona inundable sin saneamiento ni reserva de agua.",
    hint: "Haz clic sobre el marcador del colegio actual para abrir los Objetivos (OE-01 a OE-04)"
  },
  {
    step: 4,
    id: "meseta",
    title: "4. Meseta Segura (+22m)",
    badge: "Paso 04 // Masterplan",
    targetName: "Suelo Firme Libre de Socavación",
    center: [10.352, -75.565],
    zoom: 14,
    highlight: "masterplan",
    modalType: "solution",
    btnLabel: "Criterios del Masterplan",
    description: "Reubicación integral: 120 viviendas, colegio bioclimático y soberanía hídrica 450kL.",
    hint: "Haz clic sobre el polígono verdeazulado de la meseta para abrir los Criterios"
  }
];

// Helper: Calculate polygon area in Hectáreas (Ha)
function calculatePolygonAreaHa(coords) {
  if (!coords || coords.length < 3) return 0;
  let area = 0;
  const radius = 6378137;
  const degToRad = Math.PI / 180;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    area += (p2[1] * degToRad - p1[1] * degToRad) * 
            (2 + Math.sin(p1[0] * degToRad) + Math.sin(p2[0] * degToRad));
  }
  area = Math.abs((area * radius * radius) / 2.0);
  return Number((area / 10000).toFixed(2));
}

// Helper: Calculate perimeter or polyline length in km
function calculatePolylineLengthKm(coords) {
  if (!coords || coords.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const latlng1 = L.latLng(coords[i][0], coords[i][1]);
    const latlng2 = L.latLng(coords[i + 1][0], coords[i + 1][1]);
    totalMeters += latlng1.distanceTo(latlng2);
  }
  return Number((totalMeters / 1000).toFixed(2));
}

export default function ThesisFramework({ onSelectModule }) {
  // Navigation & Step States: starts at null for clean panoramic zoom approach
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'

  // =========================================================================
  // NODE-BASED DELIMITATION & POLYGON EDITOR STATE
  // =========================================================================
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeZoneKey, setActiveZoneKey] = useState('island'); // 'island' | 'erosion' | 'plateau' | 'custom'
  const [toolMode, setToolMode] = useState('add'); // 'add' | 'delete' | 'drag'
  
  const [delimitations, setDelimitations] = useState(() => {
    try {
      const saved = localStorage.getItem('thesis_custom_delimitations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_DELIMITATIONS, ...parsed };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_DELIMITATIONS;
  });

  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);

  // Cinematic Intro Animation States
  const [isIntroZooming, setIsIntroZooming] = useState(true);
  const [isIntroAnimating, setIsIntroAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);

  // Map Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  
  // Animation Refs
  const animationTimerRef = useRef(null);
  const animatingLayerRef = useRef(null);
  const animatingGlowRef = useRef(null);
  const tracerMarkerRef = useRef(null);

  // Dynamic Map Layers Refs
  const layersRef = useRef({
    islandLayer: null,
    erosionLayer: null,
    schoolMarker: null,
    masterplanLayer: null,
    plateauMarker: null,
    customLayer: null
  });

  const nodeMarkersGroupRef = useRef(null);

  const { academicFramework } = projectInfo;
  const currentStep = currentStepIndex !== null ? FRAMEWORK_STEPS[currentStepIndex] : {
    step: 0,
    id: "overview",
    title: "Inspección Panorámica",
    badge: "MOD 02 // Territorio",
    targetName: "Isla Tierrabomba (Cartagena)",
    center: [10.352, -75.572],
    zoom: 13.2,
    highlight: "overview",
    modalType: "problem",
    btnLabel: "Planteamiento del Problema",
    description: "Inspección aérea y aproximación espacial al territorio insular de Tierrabomba.",
    hint: "Haz clic en la Card 01 para proyectar la delimitación de la isla"
  };

  // Active Zone Metadata
  const activeZoneConfig = ZONE_CONFIG[activeZoneKey];
  const activeNodes = delimitations[activeZoneKey] || [];
  
  const zoneStats = useMemo(() => {
    const count = activeNodes.length;
    const isPoly = activeZoneConfig.type === 'polygon';
    const areaHa = isPoly ? calculatePolygonAreaHa(activeNodes) : 0;
    const lengthKm = calculatePolylineLengthKm(activeNodes);
    return { count, areaHa, lengthKm };
  }, [activeNodes, activeZoneConfig]);

  // =========================================================================
  // ANIMATED BOUNDARY TRACING (RUNS WHEN CARD 01 IS PRESSED)
  // =========================================================================
  const startIslandTraceAnimation = (targetMap) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map) return;

    const islandCoords = delimitations.island || [];
    if (islandCoords.length < 3) return;

    // Clear any previous running animation
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    if (animatingGlowRef.current) {
      map.removeLayer(animatingGlowRef.current);
      animatingGlowRef.current = null;
    }
    if (animatingLayerRef.current) {
      map.removeLayer(animatingLayerRef.current);
      animatingLayerRef.current = null;
    }
    if (tracerMarkerRef.current) {
      map.removeLayer(tracerMarkerRef.current);
      tracerMarkerRef.current = null;
    }

    setIsIntroAnimating(true);
    setAnimProgress(0);

    // Hide static island polygon initially
    if (layersRef.current.islandLayer) {
      layersRef.current.islandLayer.setStyle({
        opacity: 0,
        fillOpacity: 0
      });
    }

    // Ensure camera is perfectly framed on Tierrabomba
    map.flyTo([10.352, -75.572], 13.2, {
      animate: true,
      duration: 1.2
    });

    // Create animated polyline & glow polyline
    const glowLine = L.polyline([], {
      color: '#f59e0b',
      weight: 8,
      opacity: 0.55,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const mainLine = L.polyline([], {
      color: '#ea580c',
      weight: 4.5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const leadIcon = L.divIcon({
      className: 'custom-anim-lead-node',
      html: `
        <div class="relative flex items-center justify-center pointer-events-none">
          <div class="absolute -inset-2.5 rounded-full bg-amber-400 animate-ping opacity-85"></div>
          <div class="w-4.5 h-4.5 rounded-full bg-amber-400 border-2 border-white shadow-2xl flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const leadMarker = L.marker(islandCoords[0], {
      icon: leadIcon,
      zIndexOffset: 3000
    }).addTo(map);

    animatingGlowRef.current = glowLine;
    animatingLayerRef.current = mainLine;
    tracerMarkerRef.current = leadMarker;

    // Total animation time ~2800ms divided across coords length
    const totalPoints = islandCoords.length;
    const intervalMs = Math.max(16, Math.floor(2800 / totalPoints));
    let stepIndex = 1;

    animationTimerRef.current = setInterval(() => {
      stepIndex++;
      const currentPts = islandCoords.slice(0, stepIndex);
      
      // If reached last point, close the loop to coordinate 0
      if (stepIndex >= totalPoints) {
        currentPts.push(islandCoords[0]);
      }

      glowLine.setLatLngs(currentPts);
      mainLine.setLatLngs(currentPts);
      
      const currentHead = islandCoords[Math.min(stepIndex - 1, totalPoints - 1)];
      leadMarker.setLatLng(currentHead);

      const pct = Math.min(100, Math.round((stepIndex / totalPoints) * 100));
      setAnimProgress(pct);

      if (stepIndex >= totalPoints + 1) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;

        // Smoothly reveal full polygon with soft pulse
        setTimeout(() => {
          if (layersRef.current.islandLayer) {
            layersRef.current.islandLayer.setStyle({
              opacity: 1,
              fillOpacity: 0.35,
              weight: 5
            });
          }
          if (animatingGlowRef.current) map.removeLayer(animatingGlowRef.current);
          if (animatingLayerRef.current) map.removeLayer(animatingLayerRef.current);
          if (tracerMarkerRef.current) map.removeLayer(tracerMarkerRef.current);
          setIsIntroAnimating(false);
        }, 300);
      }
    }, intervalMs);
  };

  // =========================================================================
  // 1. INITIALIZE LEAFLET MAP
  // =========================================================================
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Start wide from Cartagena Bay
    const map = L.map(mapRef.current, {
      center: [10.370, -75.542],
      zoom: 11.8,
      zoomControl: false,
      attributionControl: false
    });

    // High-Res Satellite Aerial Imagery (Esri World Imagery)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = null;

    // Node Markers Layer Group (for editor)
    nodeMarkersGroupRef.current = L.layerGroup().addTo(map);

    // Initial Resize
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // 1. Island Perimeter Polygon (Initially hidden, revealed on Card 01 click!)
    const islandLayer = L.polygon(delimitations.island || [], {
      color: '#ea580c',
      weight: 3.5,
      dashArray: '8, 8',
      fillColor: '#ea580c',
      fillOpacity: 0,
      opacity: 0
    }).addTo(map);

    islandLayer.on('click', () => {
      if (!isEditMode) setActiveModal('problem');
    });

    // 2. Coastal Erosion Line
    const erosionLayer = L.polyline(delimitations.erosion || [], {
      color: '#dc2626',
      weight: 6,
      opacity: 0,
      dashArray: '10, 6'
    }).addTo(map);

    erosionLayer.on('click', () => {
      if (!isEditMode) setActiveModal('justification');
    });

    // 3. Current School Vulnerable Marker
    const schoolIcon = L.divIcon({
      className: 'custom-school-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full bg-red-500/40 animate-ping"></div>
          <div class="w-8 h-8 rounded-xl bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 text-[10px] text-white font-mono font-bold shadow-xl border border-white/20 pointer-events-none">
            Colegio Actual (+1.5m)
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const schoolMarker = L.marker([10.362, -75.581], { icon: schoolIcon }).addTo(map);
    schoolMarker.on('click', () => {
      if (!isEditMode) setActiveModal('objectives');
    });

    // 4. Safe Plateau Polygon (+22m)
    const masterplanLayer = L.polygon(delimitations.plateau || [], {
      color: '#0d9488',
      weight: 3.5,
      fillColor: '#0d9488',
      fillOpacity: 0,
      opacity: 0
    }).addTo(map);

    masterplanLayer.on('click', () => {
      if (!isEditMode) setActiveModal('solution');
    });

    const plateauIcon = L.divIcon({
      className: 'custom-plateau-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full bg-teal-400/40 animate-pulse"></div>
          <div class="w-8 h-8 rounded-xl bg-teal-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-teal-950/95 text-[10px] text-teal-300 font-mono font-bold shadow-xl border border-white/20 pointer-events-none">
            Meseta Segura +22m
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const plateauMarker = L.marker([10.352, -75.565], { icon: plateauIcon }).addTo(map);
    plateauMarker.on('click', () => {
      if (!isEditMode) setActiveModal('solution');
    });

    // 5. Custom Polygon Layer
    const customLayer = L.polygon(delimitations.custom || [], {
      color: '#6366f1',
      weight: 3.5,
      fillColor: '#6366f1',
      fillOpacity: 0.25
    }).addTo(map);

    layersRef.current = {
      islandLayer,
      erosionLayer,
      schoolMarker,
      masterplanLayer,
      plateauMarker,
      customLayer
    };

    mapInstanceRef.current = map;

    // Smooth, slow cinematic camera zoom into Tierrabomba over 4.2 seconds!
    // No delimitations are shown during this initial approach.
    setTimeout(() => {
      map.flyTo([10.352, -75.572], 13.2, {
        animate: true,
        duration: 4.2,
        easeLinearity: 0.25
      });
      setTimeout(() => {
        setIsIntroZooming(false);
      }, 4300);
    }, 200);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Map Click Listener for adding nodes when in Edit Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e) => {
      if (!isEditMode) return;
      if (toolMode !== 'add') return;
      
      const { lat, lng } = e.latlng;
      const newCoord = [Number(lat.toFixed(5)), Number(lng.toFixed(5))];
      
      setDelimitations(prev => {
        const currentZone = prev[activeZoneKey] || [];
        return {
          ...prev,
          [activeZoneKey]: [...currentZone, newCoord]
        };
      });
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [isEditMode, activeZoneKey, toolMode]);

  // =========================================================================
  // 2. SYNCHRONIZE LEAFLET GEOMETRY WITH DELIMITATION STATE
  // =========================================================================
  useEffect(() => {
    const { islandLayer, erosionLayer, masterplanLayer, customLayer } = layersRef.current;
    if (islandLayer && delimitations.island) {
      islandLayer.setLatLngs(delimitations.island);
    }
    if (erosionLayer && delimitations.erosion) {
      erosionLayer.setLatLngs(delimitations.erosion);
    }
    if (masterplanLayer && delimitations.plateau) {
      masterplanLayer.setLatLngs(delimitations.plateau);
    }
    if (customLayer && delimitations.custom) {
      customLayer.setLatLngs(delimitations.custom);
    }
  }, [delimitations]);

  // =========================================================================
  // 3. RENDER INTERACTIVE DRAGGABLE & DELETABLE NODE HANDLERS IN EDIT MODE
  // =========================================================================
  useEffect(() => {
    const group = nodeMarkersGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (!isEditMode) return;

    const currentNodes = delimitations[activeZoneKey] || [];
    const zoneCfg = ZONE_CONFIG[activeZoneKey];

    currentNodes.forEach((coord, idx) => {
      const isSelected = selectedNodeIndex === idx;

      const nodeIcon = L.divIcon({
        className: 'delimitation-node-handle',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2.5 rounded-full ${isSelected ? 'bg-amber-400/60 animate-ping' : toolMode === 'delete' ? 'bg-red-500/40 animate-pulse' : 'bg-white/40 group-hover:bg-white/70'} transition-all"></div>
            <div class="w-7 h-7 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-white text-[10px] font-mono font-black transition-transform group-hover:scale-125" style="background-color: ${toolMode === 'delete' ? '#dc2626' : isSelected ? '#f59e0b' : zoneCfg.color}">
              ${toolMode === 'delete' ? '✕' : (idx + 1)}
            </div>
            <div class="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-white font-mono pointer-events-none z-50 shadow-xl border border-white/20">
              ${toolMode === 'delete' ? 'Clic para Borrar Nodo' : 'Arrastra o Clic para Borrar'}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(coord, {
        icon: nodeIcon,
        draggable: toolMode !== 'delete',
        zIndexOffset: 2000 + idx
      });

      // Drag event updates coordinate in real-time
      marker.on('drag', (e) => {
        const { lat, lng } = e.target.getLatLng();
        const updated = [Number(lat.toFixed(5)), Number(lng.toFixed(5))];
        setDelimitations(prev => {
          const zoneCoords = [...(prev[activeZoneKey] || [])];
          zoneCoords[idx] = updated;
          return {
            ...prev,
            [activeZoneKey]: zoneCoords
          };
        });
      });

      // Click node handler: delete or select
      marker.on('click', (e) => {
        // Prevent map click from adding another node!
        L.DomEvent.stopPropagation(e);
        if (e.originalEvent) e.originalEvent.stopPropagation();

        if (toolMode === 'delete') {
          // Direct delete
          setDelimitations(prev => {
            const zoneCoords = [...(prev[activeZoneKey] || [])];
            zoneCoords.splice(idx, 1);
            return { ...prev, [activeZoneKey]: zoneCoords };
          });
          setSelectedNodeIndex(null);
          setDeleteToast(true);
          setTimeout(() => setDeleteToast(false), 2000);
        } else {
          // Select or toggle
          setSelectedNodeIndex(isSelected ? null : idx);
        }
      });

      // Right click immediately deletes node
      marker.on('contextmenu', (e) => {
        L.DomEvent.stopPropagation(e);
        if (e.originalEvent) e.originalEvent.preventDefault();
        setDelimitations(prev => {
          const zoneCoords = [...(prev[activeZoneKey] || [])];
          zoneCoords.splice(idx, 1);
          return { ...prev, [activeZoneKey]: zoneCoords };
        });
        setSelectedNodeIndex(null);
        setDeleteToast(true);
        setTimeout(() => setDeleteToast(false), 2000);
      });

      group.addLayer(marker);
    });
  }, [isEditMode, activeZoneKey, delimitations, selectedNodeIndex, toolMode]);

  // =========================================================================
  // 4. STEP NAVIGATION & AUTOPLAY (NON-EDIT MODE)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isEditMode) {
      // Cancel animation if running
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      if (animatingGlowRef.current) {
        map.removeLayer(animatingGlowRef.current);
        animatingGlowRef.current = null;
      }
      if (animatingLayerRef.current) {
        map.removeLayer(animatingLayerRef.current);
        animatingLayerRef.current = null;
      }
      if (tracerMarkerRef.current) {
        map.removeLayer(tracerMarkerRef.current);
        tracerMarkerRef.current = null;
      }
      if (layersRef.current.islandLayer) {
        layersRef.current.islandLayer.setStyle({
          opacity: 1,
          fillOpacity: 0.15,
          weight: 3.5
        });
      }
      setIsIntroAnimating(false);
      return;
    }

    // If still in initial overview approach (no card clicked yet)
    if (currentStepIndex === null) {
      return;
    }

    if (currentStepIndex === 0) {
      // Step 1: Delimitación Territorial
      if (!isIntroAnimating && layersRef.current.islandLayer) {
        map.flyTo(currentStep.center, currentStep.zoom, {
          animate: true,
          duration: 1.2
        });
        layersRef.current.islandLayer.setStyle({
          opacity: 1,
          fillOpacity: 0.35,
          weight: 5
        });
      }
    } else {
      // Steps 2, 3, 4: Cancel animation if running
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      if (animatingGlowRef.current) {
        map.removeLayer(animatingGlowRef.current);
        animatingGlowRef.current = null;
      }
      if (animatingLayerRef.current) {
        map.removeLayer(animatingLayerRef.current);
        animatingLayerRef.current = null;
      }
      if (tracerMarkerRef.current) {
        map.removeLayer(tracerMarkerRef.current);
        tracerMarkerRef.current = null;
      }
      setIsIntroAnimating(false);

      map.flyTo(currentStep.center, currentStep.zoom, {
        animate: true,
        duration: 1.2
      });

      if (layersRef.current.islandLayer) {
        layersRef.current.islandLayer.setStyle({
          opacity: 1,
          fillOpacity: 0.1,
          weight: 2
        });
      }
    }

    const { erosionLayer, masterplanLayer } = layersRef.current;

    if (erosionLayer) {
      erosionLayer.setStyle({
        weight: currentStep.step === 2 ? 8 : 4,
        opacity: currentStep.step === 2 ? 1 : 0.4
      });
    }

    if (masterplanLayer) {
      masterplanLayer.setStyle({
        fillOpacity: currentStep.step === 4 ? 0.45 : 0.15,
        weight: currentStep.step === 4 ? 5 : 2
      });
    }
  }, [currentStepIndex, isEditMode, isIntroAnimating]);

  // Autoplay sequence timer
  useEffect(() => {
    if (!isPlaying || isEditMode) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= FRAMEWORK_STEPS.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isEditMode]);

  // Layer type switcher (Satellite vs Carto)
  useEffect(() => {
    const map = mapInstanceRef.current;
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

  // =========================================================================
  // 5. EDITOR ACTIONS: ADD, DELETE, CLEAR, RESET, SAVE
  // =========================================================================
  const handleUndoLastNode = () => {
    setDelimitations(prev => {
      const zoneCoords = [...(prev[activeZoneKey] || [])];
      zoneCoords.pop();
      return { ...prev, [activeZoneKey]: zoneCoords };
    });
    setSelectedNodeIndex(null);
  };

  const handleRemoveSpecificNode = (nodeIdx) => {
    setDelimitations(prev => {
      const zoneCoords = [...(prev[activeZoneKey] || [])];
      zoneCoords.splice(nodeIdx, 1);
      return { ...prev, [activeZoneKey]: zoneCoords };
    });
    if (selectedNodeIndex === nodeIdx) setSelectedNodeIndex(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleClearZoneInstant = () => {
    // Immediate clear with 1 click - no blocking confirms!
    setDelimitations(prev => ({
      ...prev,
      [activeZoneKey]: []
    }));
    setSelectedNodeIndex(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleResetToDefault = () => {
    setDelimitations(prev => ({
      ...prev,
      [activeZoneKey]: DEFAULT_DELIMITATIONS[activeZoneKey] || []
    }));
    setSelectedNodeIndex(null);
  };

  const handleSaveDelimitation = () => {
    try {
      localStorage.setItem('thesis_custom_delimitations', JSON.stringify(delimitations));
      setSaveToast(true);
      setShowExportModal(true);
      setTimeout(() => setSaveToast(false), 4000);
    } catch (e) {
      alert("Error al guardar en almacenamiento local.");
    }
  };

  const handleCopyCodeToClipboard = () => {
    const jsonFormatted = JSON.stringify(delimitations[activeZoneKey] || [], null, 2);
    navigator.clipboard.writeText(jsonFormatted);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  const handleDownloadGeoJSON = () => {
    const coords = delimitations[activeZoneKey] || [];
    const isPoly = activeZoneConfig.type === 'polygon';
    
    const geoJsonCoords = coords.map(c => [c[1], c[0]]);
    if (isPoly && geoJsonCoords.length > 0) {
      geoJsonCoords.push([coords[0][1], coords[0][0]]);
    }

    const geoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            zoneKey: activeZoneKey,
            zoneName: activeZoneConfig.name,
            nodeCount: coords.length,
            areaHa: isPoly ? calculatePolygonAreaHa(coords) : null,
            lengthKm: calculatePolylineLengthKm(coords),
            updatedAt: new Date().toISOString()
          },
          geometry: {
            type: isPoly ? "Polygon" : "LineString",
            coordinates: isPoly ? [geoJsonCoords] : geoJsonCoords
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delimitacion_${activeZoneKey}_tierrabomba.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden animate-fade-in select-none ${
      isEditMode ? (toolMode === 'delete' ? 'cursor-not-allowed' : 'cursor-crosshair') : ''
    }`}>
      
      {/* 1. FULLSCREEN SATELLITE MAP */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 2. TOP FLOATING CONTROL BAR (HUD)                                         */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-hud px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-lg shadow-xl">
          <div className={`w-9 h-9 rounded-xl ${isEditMode ? 'bg-amber-600 animate-pulse' : 'bg-terracotta-600'} text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md`}>
            02
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isEditMode ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-terracotta-50/90 text-terracotta-700 border border-terracotta-200/80'
              }`}>
                {isEditMode ? 'EDITOR DE DELIMITACIÓN' : 'MARCO DE TESIS'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                {isEditMode ? `${zoneStats.count} Puntos` : `Paso 0${currentStep.step} de 04`}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
              {isEditMode ? activeZoneConfig.name : currentStep.targetName}
            </h2>
          </div>
        </div>

        {/* Middle Mode Switcher: View Mode vs Edit Mode */}
        <div className="glass-hud p-1.5 rounded-2xl pointer-events-auto flex items-center gap-1.5 self-start md:self-center shadow-xl">
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setSelectedNodeIndex(null);
            }}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isEditMode
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEditMode ? 'Cerrar Editor' : 'Delimitar con Nodos'}</span>
          </button>

          {!isEditMode && (
            <>
              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                  startIslandTraceAnimation();
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                  isIntroAnimating
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-102'
                }`}
                title="Trazar delimitación perimetral de la isla"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isIntroAnimating ? 'Animando...' : 'Animar Trazo'}</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-terracotta-600 hover:bg-terracotta-500 text-white shadow-sm'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Auto'}</span>
              </button>

              <button
                onClick={() => setActiveModal(currentStep.modalType)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Ficha Académica</span>
              </button>
            </>
          )}

          {isEditMode && (
            <button
              onClick={handleSaveDelimitation}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-105"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar (Save)</span>
            </button>
          )}
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

      {/* Floating Center Cinematic Animation Status Pill */}
      {isIntroAnimating && !isEditMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[450] pointer-events-none animate-fade-in">
          <div className="glass-hud px-4 py-2 rounded-full border border-amber-400/60 shadow-2xl flex items-center space-x-3 backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-900 tracking-wide">
              Delimitando Isla Tierrabomba: <span className="text-amber-600 font-black">{animProgress}%</span>
            </span>
            <div className="w-20 bg-slate-200/80 h-2 rounded-full overflow-hidden border border-slate-300">
              <div 
                className="bg-amber-500 h-full transition-all duration-100 ease-out rounded-full" 
                style={{ width: `${animProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NODE DELIMITATION EDITOR TOOLBAR (FLOATING LEFT PANEL IN EDIT MODE)    */}
      {/* ========================================================================= */}
      {isEditMode && (
        <div className="absolute top-24 left-4 z-[400] glass-panel p-4 rounded-3xl space-y-4 pointer-events-auto text-slate-900 w-84 shadow-2xl animate-scale-up max-h-[calc(100vh-8rem)] overflow-y-auto">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                Herramientas de Edición 1:1
              </span>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              title="Cerrar Editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tool Modes: Add vs Move vs Delete */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block px-1">
              Modo de Herramienta:
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-mono">
              <button
                onClick={() => setToolMode('add')}
                className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center space-x-1 transition-all ${
                  toolMode === 'add' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Clic en el mapa añade puntos"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Añadir</span>
              </button>

              <button
                onClick={() => setToolMode('drag')}
                className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center space-x-1 transition-all ${
                  toolMode === 'drag' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Arrastrar puntos existentes"
              >
                <Move className="w-3.5 h-3.5 text-blue-400" />
                <span>Mover</span>
              </button>

              <button
                onClick={() => setToolMode('delete')}
                className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center space-x-1 transition-all ${
                  toolMode === 'delete' ? 'bg-red-600 text-white shadow-sm' : 'text-red-700 hover:bg-red-50'
                }`}
                title="Clic en cualquier nodo lo borra"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Borrador</span>
              </button>
            </div>
          </div>

          {/* Zone Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block px-1">
              Seleccionar Zona a Trazar:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(ZONE_CONFIG).map((zone) => {
                const isCur = activeZoneKey === zone.id;
                const nodeCount = (delimitations[zone.id] || []).length;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setActiveZoneKey(zone.id);
                      setSelectedNodeIndex(null);
                    }}
                    className={`px-3 py-2 rounded-2xl text-left transition-all flex items-center justify-between ${
                      isCur
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                      <span className="font-serif font-bold text-xs truncate max-w-[170px]">{zone.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isCur ? 'bg-white/20 text-amber-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {nodeCount} pts
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Clear Actions (NO BLOCKS) */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleClearZoneInstant}
                disabled={activeNodes.length === 0}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-102"
                title="Borra todos los puntos de esta zona para empezar de cero"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar / Borrar Todo</span>
              </button>

              <button
                onClick={handleUndoLastNode}
                disabled={activeNodes.length === 0}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors"
                title="Deshacer el último nodo añadido"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Deshacer Último</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleResetToDefault}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-mono font-bold transition-colors flex items-center justify-center space-x-1"
                title="Cargar polígono predeterminado"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>

              <button
                onClick={handleSaveDelimitation}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
              >
                <Save className="w-3 h-3" />
                <span>Guardar (Save)</span>
              </button>
            </div>
          </div>

          {/* Interactive Vertex List (Click trash on any vertex) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase px-1">
              <span>Lista de Vértices ({activeNodes.length}):</span>
              <span className="text-amber-700">Clic en ✕ para quitar</span>
            </div>

            {activeNodes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-dashed border-amber-300 text-center text-xs text-amber-900 font-mono">
                Zona vacía. Haz clic en el mapa satelital para trazar tu delimitación.
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {activeNodes.map((coord, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-mono hover:border-amber-400 group transition-colors"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700">
                        [{coord[0]}, {coord[1]}]
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSpecificNode(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title={`Eliminar vértice #${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FLOATING BOTTOM: 4 STEP CARDS (VIEW MODE)                              */}
      {/* ========================================================================= */}
      {!isEditMode && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-5xl mx-auto pointer-events-auto">
            {FRAMEWORK_STEPS.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              const isFirstStepPrompt = currentStepIndex === null && idx === 0;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setIsPlaying(false);
                    if (idx === 0) {
                      setCurrentStepIndex(0);
                      startIslandTraceAnimation();
                    } else {
                      setCurrentStepIndex(idx);
                    }
                  }}
                  className={`glass-card p-3 rounded-2xl text-left transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-terracotta-500 shadow-2xl ring-2 ring-terracotta-400/30 scale-105'
                      : isFirstStepPrompt
                        ? 'border-amber-400 shadow-xl ring-2 ring-amber-400/80 animate-pulse scale-102 bg-amber-50/20'
                        : 'border-white/80 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive 
                        ? 'bg-terracotta-100 text-terracotta-800' 
                        : isFirstStepPrompt
                          ? 'bg-amber-100 text-amber-900 font-black'
                          : 'bg-slate-100/90 text-slate-600'
                    }`}>
                      PASO 0{step.step}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      isActive 
                        ? 'bg-terracotta-500 animate-ping' 
                        : isFirstStepPrompt
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-slate-300'
                    }`} />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {isFirstStepPrompt ? '✨ Clic para trazar' : step.btnLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom-Left Hint Pill (View Mode) */}
      {!isEditMode && (
        <div className="absolute bottom-20 left-4 z-[400] hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-mono backdrop-blur-md shadow-lg border border-white/20 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {currentStepIndex === null 
              ? '👉 Haz clic en el Paso 01 (Delimitación Territorial) para proyectar el contorno de la isla' 
              : `${currentStep.hint} • Pulsa Delimitar con Nodos para editar`}
          </span>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed top-20 right-4 z-[1000] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center space-x-2 animate-scale-up border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>¡Delimitación guardada exitosamente en tu navegador!</span>
        </div>
      )}

      {/* Delete / Clear Success Toast */}
      {deleteToast && (
        <div className="fixed top-20 right-4 z-[1000] bg-red-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl font-mono text-xs flex items-center space-x-2 animate-scale-up border border-red-400">
          <Trash2 className="w-4 h-4" />
          <span>Vértice eliminado / Zona vaciada. Listo para nuevo trazado.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EXPORT & SAVE COORDINATES MODAL (JSON / GEOJSON / COPY TO CLIPBOARD)   */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div 
            className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scale-up text-slate-900 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider">
                    Delimitación Guardada en LocalStorage
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    Coordenadas de {activeZoneConfig.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics and Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Nodos</span>
                <span className="font-serif font-bold text-base text-slate-900 block mt-0.5">{zoneStats.count}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Superficie</span>
                <span className="font-serif font-bold text-base text-emerald-700 block mt-0.5">
                  {activeZoneConfig.type === 'polygon' ? `${zoneStats.areaHa} Ha` : 'Línea costera'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Longitud</span>
                <span className="font-serif font-bold text-base text-slate-900 block mt-0.5">{zoneStats.lengthKm} km</span>
              </div>
            </div>

            {/* JSON Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Array de Coordenadas [Latitud, Longitud]:</span>
                <span className="text-emerald-700 font-bold">Formato JS / JSON</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs max-h-52 overflow-y-auto border border-slate-800 shadow-inner">
                <pre>{JSON.stringify(delimitations[activeZoneKey] || [], null, 2)}</pre>
              </div>
            </div>

            {/* Assistant Note */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>¿Cómo guardar esto de forma permanente en el código?</span>
              </div>
              <p className="leading-relaxed">
                Tus cambios ya se han guardado en tu navegador. Si deseas que yo (el asistente) actualice el código fuente del proyecto de forma definitiva, simplemente haz clic en <b>"Copiar para el Asistente"</b> y pégalo en el chat.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={handleDownloadGeoJSON}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descargar GeoJSON</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCodeToClipboard}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md hover:scale-105"
                >
                  {copyToast ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copyToast ? '¡Copiado al Portapapeles!' : 'Copiar para el Asistente'}</span>
                </button>

                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DETAIL ACADEMIC MODAL POP-UPS                                          */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-terracotta-50 text-terracotta-600 border border-terracotta-200">
                  {activeModal === 'problem' && <HelpCircle className="w-6 h-6" />}
                  {activeModal === 'justification' && <FileCheck2 className="w-6 h-6" />}
                  {activeModal === 'objectives' && <Target className="w-6 h-6" />}
                  {activeModal === 'solution' && <ShieldCheck className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-terracotta-600 tracking-wider">
                    Fundamentación Académica // Tesis 2026
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    {activeModal === 'problem' && 'Planteamiento del Problema Insular'}
                    {activeModal === 'justification' && 'Justificación de la Propuesta & Urgencia'}
                    {activeModal === 'objectives' && 'Objetivos de la Investigación (OE-01 a OE-04)'}
                    {activeModal === 'solution' && 'Criterios del Masterplan en Meseta Segura'}
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

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Problem Content */}
              {activeModal === 'problem' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm leading-relaxed space-y-2">
                    <div className="flex items-center space-x-2 font-bold font-mono text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Diagnóstico de Vulnerabilidad Extrema</span>
                    </div>
                    <p className="text-slate-800 font-sans leading-relaxed text-justify">
                      {academicFramework.justification.problemStatement}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Población</span>
                      <h4 className="font-serif font-bold text-lg text-slate-900 mt-1">4.300 hab.</h4>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Acueducto</span>
                      <h4 className="font-serif font-bold text-lg text-red-600 mt-1">0% Red</h4>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Erosión Costera</span>
                      <h4 className="font-serif font-bold text-lg text-red-600 mt-1">1.8 m/año</h4>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Riesgo Inminente</span>
                      <h4 className="font-serif font-bold text-lg text-terracotta-600 mt-1">120 Casas</h4>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start space-x-3 shadow-lg">
                    <Quote className="w-5 h-5 text-terracotta-400 shrink-0 mt-0.5" />
                    <p className="font-serif italic text-xs text-slate-200">
                      "{projectInfo.communityVoice.quote}" — {projectInfo.communityVoice.author}
                    </p>
                  </div>
                </div>
              )}

              {/* Justification Content */}
              {activeModal === 'justification' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-terracotta-50 border border-terracotta-200 text-slate-800 space-y-2">
                    <h4 className="font-serif font-bold text-base text-terracotta-900">
                      Fundamentación Científica & Arquitectónica
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
                      {academicFramework.justification.academicJustification}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-terracotta-600 uppercase">Ley 1523 / 2012</span>
                      <p className="text-xs text-slate-700">Gestión obligatoria del riesgo de desastres y reasentamiento.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Meseta +22m</span>
                      <p className="text-xs text-slate-700">Suelo calcáreo inmune a inundación por 100 años.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Aljibe 450kL</span>
                      <p className="text-xs text-slate-700">90 días de autonomía pluvial certificada.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Objectives Content */}
              {activeModal === 'objectives' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-md">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-300">
                      Objetivo General
                    </span>
                    <h4 className="font-serif italic text-sm sm:text-base text-white leading-snug">
                      "{academicFramework.generalObjective}"
                    </h4>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {academicFramework.specificObjectives.map((obj) => (
                      <div key={obj.code} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="px-1.5 py-0.5 rounded bg-terracotta-100 text-terracotta-800 text-[10px] font-mono font-bold">
                          {obj.code}
                        </span>
                        <h5 className="font-serif font-bold text-xs text-slate-900">{obj.title}</h5>
                        <p className="text-[11px] text-slate-600">{obj.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution Content */}
              {activeModal === 'solution' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-2">
                    <h4 className="font-serif font-bold text-base text-teal-900">
                      Modelo de Hábitat Resiliente & Dotacional
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                      El plan maestro organiza la vida comunitaria en torno a tres ejes fundamentales: reubicación de las 120 familias en riesgo, consolidación del equipamiento educativo-náutico y sistema de macro-aljibe pluvial para cortar la dependencia de Cartagena.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                      <Home className="w-4 h-4 text-terracotta-600" />
                      <h5 className="font-bold text-xs text-slate-900">120 Viviendas</h5>
                      <p className="text-[11px] text-slate-600">Módulos de madera y BTC sobre pilotes (+0.60m).</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                      <GraduationCap className="w-4 h-4 text-teal-600" />
                      <h5 className="font-bold text-xs text-slate-900">Colegio Bioclimático</h5>
                      <p className="text-[11px] text-slate-600">350 alumnos con talleres náuticos y pesca.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <h5 className="font-bold text-xs text-slate-900">Aljibe 450.000 L</h5>
                      <p className="text-[11px] text-slate-600">Captación pluvial con filtrado solar UV.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Alejandra Gómez & Ana Casas &bull; 2026
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
