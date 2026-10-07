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
  RefreshCw,
  Route,
  PenTool,
  Image as ImageIcon
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import calqueImage from '../assets/calque_tierrabomba.png';
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
    [10.36857, -75.58044],
    [10.36650, -75.58302],
    [10.36599, -75.58559],
    [10.36401, -75.58632],
    [10.36223, -75.58667],
    [10.36071, -75.58890],
    [10.35907, -75.58959],
    [10.35819, -75.59147],
    [10.35598, -75.59177],
    [10.35404, -75.59053],
    [10.35167, -75.59053],
    [10.34918, -75.59199],
    [10.34694, -75.59298],
    [10.34373, -75.59246],
    [10.34204, -75.59229]
  ],
  school: [
    [10.38053, -75.57612],
    [10.38061, -75.57617],
    [10.38051, -75.57630],
    [10.38042, -75.57622],
    [10.38045, -75.57614],
    [10.38040, -75.57608],
    [10.38049, -75.57590],
    [10.38059, -75.57592]
  ],
  vulnerableHouses: [
    [10.36857, -75.58044],
    [10.36650, -75.58302],
    [10.36599, -75.58559],
    [10.36401, -75.58632],
    [10.36223, -75.58667],
    [10.36071, -75.58890],
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
    [10.33735, -75.59160],
    [10.33368, -75.59302],
    [10.33161, -75.59302],
    [10.32929, -75.59242],
    [10.32717, -75.59173],
    [10.32561, -75.59074],
    [10.32717, -75.59173],
    [10.33368, -75.59302],
    [10.34373, -75.59246],
    [10.35598, -75.59177],
    [10.36401, -75.58632],
    [10.36857, -75.58044]
  ],
  plateau: [
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
  ],
  roads: [],
  custom: [
    [10.37884, -75.57763],
    [10.37879, -75.57730],
    [10.37917, -75.57694],
    [10.37955, -75.57612],
    [10.37876, -75.57627],
    [10.37853, -75.57678],
    [10.37723, -75.57624],
    [10.37582, -75.57741],
    [10.37512, -75.57787],
    [10.37445, -75.57767],
    [10.37433, -75.57801],
    [10.37309, -75.57782],
    [10.37275, -75.57735],
    [10.37376, -75.57680],
    [10.37368, -75.57659],
    [10.37450, -75.57608],
    [10.37454, -75.57564],
    [10.37437, -75.57512],
    [10.37388, -75.57458],
    [10.37443, -75.57411],
    [10.37421, -75.57399],
    [10.37444, -75.57382],
    [10.37399, -75.57382],
    [10.37400, -75.57362],
    [10.37445, -75.57359],
    [10.37436, -75.57343],
    [10.37460, -75.57331],
    [10.37475, -75.57375],
    [10.37497, -75.57377],
    [10.37505, -75.57398],
    [10.37560, -75.57443],
    [10.37582, -75.57417],
    [10.37557, -75.57386],
    [10.37578, -75.57356],
    [10.37561, -75.57337],
    [10.37537, -75.57365],
    [10.37515, -75.57344],
    [10.37530, -75.57329],
    [10.37500, -75.57307],
    [10.37485, -75.57316],
    [10.37463, -75.57299],
    [10.37443, -75.57320],
    [10.37398, -75.57286],
    [10.37243, -75.57276],
    [10.37166, -75.57263],
    [10.37123, -75.57243],
    [10.36991, -75.57311],
    [10.36978, -75.57223],
    [10.36958, -75.57171],
    [10.37013, -75.57160],
    [10.37315, -75.57108],
    [10.37199, -75.56864],
    [10.37123, -75.56835],
    [10.37079, -75.56892],
    [10.37047, -75.56888],
    [10.36931, -75.56982],
    [10.36874, -75.57004],
    [10.36820, -75.57110],
    [10.36792, -75.57135],
    [10.36691, -75.57137],
    [10.36705, -75.57207],
    [10.36416, -75.57270],
    [10.36191, -75.57161],
    [10.35938, -75.56862],
    [10.36135, -75.56714],
    [10.36171, -75.56671],
    [10.36343, -75.56601],
    [10.36319, -75.56577],
    [10.36706, -75.56324],
    [10.36645, -75.56224],
    [10.36617, -75.56150],
    [10.36441, -75.56057],
    [10.35452, -75.56793],
    [10.35324, -75.56830],
    [10.35421, -75.57287],
    [10.35573, -75.57783],
    [10.35683, -75.58201],
    [10.35784, -75.58396],
    [10.35799, -75.58493],
    [10.35854, -75.58536],
    [10.35987, -75.58566],
    [10.36181, -75.58510],
    [10.36221, -75.58560],
    [10.36267, -75.58539],
    [10.36358, -75.58553],
    [10.36510, -75.58378],
    [10.36471, -75.58314],
    [10.36641, -75.58091],
    [10.36847, -75.57963],
    [10.36889, -75.57964],
    [10.37034, -75.57889],
    [10.37151, -75.57882],
    [10.37343, -75.57809],
    [10.37462, -75.57838],
    [10.37517, -75.57862],
    [10.37638, -75.57829],
    [10.37743, -75.57814],
    [10.37802, -75.57835],
    [10.37873, -75.57796],
    [10.37923, -75.57805],
    [10.37919, -75.57771]
  ]
};

export const DEFAULT_CALQUE_BOUNDS = {
  south: 10.3325,
  west: -75.5865,
  north: 10.3838,
  east: -75.5340
};

export const ZONE_CONFIG = {
  island: {
    id: "island",
    name: "1. Delimitación Territorial",
    type: "polygon",
    color: "#ea580c",
    fillColor: "transparent",
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
  school: {
    id: "school",
    name: "3. Colegio Actual en Riesgo",
    type: "polygon",
    color: "#ef4444",
    fillColor: "#ef4444",
    badge: "Cota +1.5m Vulnerable",
    desc: "Polígono de implantación del colegio actual en riesgo de inundación."
  },
  plateau: {
    id: "plateau",
    name: "4. Meseta Segura (+22.00m)",
    type: "polygon",
    color: "#0d9488",
    fillColor: "transparent",
    badge: "Cota Segura Masterplan",
    desc: "Área de implantación protegida para vivienda y colegio."
  },
  roads: {
    id: "roads",
    name: "5. Master Plan: Vías",
    type: "polyline",
    color: "#f59e0b",
    fillColor: "#f59e0b",
    badge: "Red Vial Masterplan",
    desc: "Trazado y diseño de vías estructurantes de la meseta y conexión insular."
  },
  custom: {
    id: "custom",
    name: "6. Polígono Calcado del Plano",
    type: "polygon",
    color: "#06b6d4",
    fillColor: "#06b6d4",
    badge: "Plano Calcado",
    desc: "Polígono de delimitación y zonificación territorial calcado del plano de tesis."
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
    zoom: 13.2,
    highlight: "island",
    modalType: "problem",
    btnLabel: "Planteamiento del Problema",
    description: "Inspección perimetral de la isla, contexto insular caribeño y diagnóstico de aislamiento.",
    hint: "Haz clic en Animar Trazo para proyectar el contorno insular"
  },
  {
    step: 2,
    id: "erosion",
    title: "2. Franja de Erosión Costera",
    badge: "Paso 02 // Riesgo Físico",
    targetName: "Borde Crítico (Pérdida 1.8 m/año)",
    center: [10.352, -75.568],
    zoom: 13.2,
    highlight: "erosion",
    modalType: "justification",
    btnLabel: "Justificación de la Propuesta",
    description: "Simulación de avance del nivel del mar y socavación marina de viviendas costeras.",
    hint: "Haz clic sobre la franja roja de erosión para abrir la Justificación"
  },
  {
    step: 3,
    id: "vulnerabilidad",
    title: "3. Colegio & Viviendas en Riesgo",
    badge: "Paso 03 // Vulnerabilidad",
    targetName: "Colegio Actual & 120 Viviendas en Borde de Socavación",
    center: [10.3805, -75.5761],
    zoom: 17.5,
    highlight: "currentSchool",
    modalType: "objectives",
    btnLabel: "Objetivos de la Investigación",
    description: "Equipamiento educativo precario en cota +1.5m y 120 viviendas atrapadas en la franja crítica de socavación marina.",
    hint: "Alterna entre Colegio en Riesgo o 120 Viviendas en Riesgo"
  },
  {
    step: 4,
    id: "meseta",
    title: "4. Meseta Segura (+22.00m)",
    badge: "Paso 04 // Masterplan",
    targetName: "Suelo Firme Libre de Socavación",
    center: [10.3730, -75.5759],
    zoom: 16.2,
    highlight: "masterplan",
    modalType: "solution",
    btnLabel: "Criterios del Masterplan",
    description: "Reubicación integral: 120 viviendas, colegio bioclimático y soberanía hídrica 450kL.",
    hint: "Haz clic sobre el contorno verdeazulado de la meseta para abrir los Criterios"
  },
  {
    step: 5,
    id: "vias",
    title: "5. Master Plan: Vías",
    badge: "Paso 05 // Movilidad",
    targetName: "Red Vial y Conectividad",
    center: [10.3715, -75.5755],
    zoom: 16.5,
    highlight: "roads",
    modalType: "solution",
    btnLabel: "Trazado de Vías",
    description: "Diseño de la red vial estructurante, senderos peatonales y vías de servicio para la meseta.",
    hint: "Haz clic en el Pincel para dibujar o editar el trazado de las vías"
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

// Helper: Normalize road lines to array of lines [ [ [lat, lng], ... ], ... ]
export function normalizeRoadLines(roadsData) {
  if (!roadsData || !Array.isArray(roadsData) || roadsData.length === 0) {
    return [[]];
  }
  if (typeof roadsData[0][0] === 'number') {
    return [roadsData];
  }
  return roadsData.map(line => (Array.isArray(line) ? line : []));
}

export function countRoadPoints(roadsData) {
  const lines = normalizeRoadLines(roadsData);
  return lines.reduce((sum, line) => sum + (Array.isArray(line) ? line.length : 0), 0);
}

// Helper: Synchronize Multi-line roads on Leaflet LayerGroup
export function syncRoadsLayer(roadsGroup, roadsData, style = { opacity: 1, weight: 2.8, color: '#f59e0b', dashArray: '6, 5', lineCap: 'round', lineJoin: 'round' }) {
  if (!roadsGroup) return;
  roadsGroup.clearLayers();
  const lines = normalizeRoadLines(roadsData);
  lines.forEach(line => {
    if (line && line.length >= 2) {
      const pl = L.polyline(line, {
        ...style,
        interactive: false
      });
      roadsGroup.addLayer(pl);
    }
  });
}

// Function to resample any polygon or polyline into N equidistant points along its length/perimeter
function resampleCoordinates(coords, isPolygon, numSamples = 120) {
  if (!coords || coords.length < 2) return coords || [];

  const points = isPolygon ? [...coords, coords[0]] : [...coords];
  
  // 1. Calculate cumulative segment distances
  const distances = [0];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const lat1 = points[i][0];
    const lng1 = points[i][1];
    const lat2 = points[i + 1][0];
    const lng2 = points[i + 1][1];
    const dist = Math.hypot(lat2 - lat1, lng2 - lng1);
    totalLength += dist;
    distances.push(totalLength);
  }

  if (totalLength === 0) return points;

  // 2. Sample evenly at step intervals
  const resampled = [];
  const stepDist = totalLength / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const targetDist = i * stepDist;

    let segIdx = 0;
    while (segIdx < distances.length - 1 && distances[segIdx + 1] < targetDist) {
      segIdx++;
    }

    if (segIdx >= points.length - 1) {
      resampled.push(points[points.length - 1]);
      continue;
    }

    const segStartDist = distances[segIdx];
    const segEndDist = distances[segIdx + 1];
    const segLen = segEndDist - segStartDist;
    const t = segLen > 0 ? (targetDist - segStartDist) / segLen : 0;

    const lat = points[segIdx][0] + (points[segIdx + 1][0] - points[segIdx][0]) * t;
    const lng = points[segIdx][1] + (points[segIdx + 1][1] - points[segIdx][1]) * t;
    resampled.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
  }

  return resampled;
}

export default function ThesisFramework({ onSelectModule }) {
  // Navigation & Step States: starts at null for clean panoramic zoom approach
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'
  const [vulnerabilitySubTab, setVulnerabilitySubTab] = useState('school'); // 'school' | 'houses'

  // =========================================================================
  // NODE-BASED DELIMITATION & POLYGON EDITOR STATE
  // =========================================================================
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeZoneKey, setActiveZoneKey] = useState('island'); // 'island' | 'erosion' | 'school' | 'plateau' | 'roads' | 'custom'
  const [activeRoadLineIndex, setActiveRoadLineIndex] = useState(0); // For multi-line roads support
  const [toolMode, setToolMode] = useState('add'); // 'add' | 'delete' | 'drag'
  
  const [delimitations, setDelimitations] = useState(() => {
    try {
      const saved = localStorage.getItem('thesis_custom_delimitations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.school && (parsed.school.length < 8 || (parsed.school[0] && parsed.school[0][0] < 10.37))) {
          parsed.school = DEFAULT_DELIMITATIONS.school;
        }
        if (parsed.plateau && parsed.plateau.length < 12) {
          parsed.plateau = DEFAULT_DELIMITATIONS.plateau;
        }
        if (parsed.roads) {
          const norm = normalizeRoadLines(parsed.roads);
          // If it only contains the old single dummy line [10.3752, -75.5768], clear it
          if (norm.length === 1 && norm[0].length === 5 && norm[0][0] && Math.abs(norm[0][0][0] - 10.37520) < 0.0001) {
            parsed.roads = [];
          } else {
            parsed.roads = norm;
          }
        }
        return { ...DEFAULT_DELIMITATIONS, ...parsed };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_DELIMITATIONS;
  });

  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pastedCoordsText, setPastedCoordsText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);

  // Reference Calque Image Overlay State (Plano para calcar - oculto por defecto para no estorbar)
  const [showCalque, setShowCalque] = useState(false);
  const [calqueOpacity, setCalqueOpacity] = useState(0.70);
  const [calqueBounds, setCalqueBounds] = useState(DEFAULT_CALQUE_BOUNDS);
  const [showCalqueControls, setShowCalqueControls] = useState(false);
  const calqueOverlayRef = useRef(null);

  const moveCalqueLat = (delta) => {
    setCalqueBounds(prev => ({
      ...prev,
      south: Number((prev.south + delta).toFixed(5)),
      north: Number((prev.north + delta).toFixed(5))
    }));
  };

  const moveCalqueLng = (delta) => {
    setCalqueBounds(prev => ({
      ...prev,
      west: Number((prev.west + delta).toFixed(5)),
      east: Number((prev.east + delta).toFixed(5))
    }));
  };

  const scaleCalque = (factor) => {
    setCalqueBounds(prev => {
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
    schoolLayer: null,
    masterplanLayer: null,
    customLayer: null,
    marker1: null,
    marker2: null,
    marker3: null,
    marker4: null
  });

  const nodeMarkersGroupRef = useRef(null);

  const { academicFramework } = projectInfo;
  const currentStep = currentStepIndex !== null ? FRAMEWORK_STEPS[currentStepIndex] : {
    step: 0,
    id: "overview",
    title: "Inspección Panorámica",
    badge: "MOD 02 // Territorio",
    targetName: "Isla Tierrabomba (Cartagena)",
    center: [10.352, -75.568],
    zoom: 13.2,
    highlight: "overview",
    modalType: "problem",
    btnLabel: "Planteamiento del Problema",
    description: "Inspección aérea y aproximación espacial al territorio insular de Tierrabomba.",
    hint: "Haz clic en la Card 01 para proyectar la delimitación de la isla"
  };

  // Active Zone Metadata
  const activeZoneConfig = ZONE_CONFIG[activeZoneKey];
  const activeNodes = useMemo(() => {
    if (activeZoneKey === 'roads') {
      const lines = normalizeRoadLines(delimitations.roads);
      return lines[activeRoadLineIndex] || [];
    }
    return delimitations[activeZoneKey] || [];
  }, [delimitations, activeZoneKey, activeRoadLineIndex]);
  
  const zoneStats = useMemo(() => {
    if (activeZoneKey === 'roads') {
      const lines = normalizeRoadLines(delimitations.roads);
      const count = countRoadPoints(delimitations.roads);
      const lengthKm = lines.reduce((acc, line) => acc + calculatePolylineLengthKm(line), 0);
      return { count, areaHa: 0, lengthKm: Number(lengthKm.toFixed(2)), lineCount: lines.length };
    }
    const count = (delimitations[activeZoneKey] || []).length;
    const isPoly = activeZoneConfig.type === 'polygon';
    const areaHa = isPoly ? calculatePolygonAreaHa(delimitations[activeZoneKey] || []) : 0;
    const lengthKm = calculatePolylineLengthKm(delimitations[activeZoneKey] || []);
    return { count, areaHa, lengthKm, lineCount: 1 };
  }, [delimitations, activeZoneKey, activeZoneConfig]);

  // =========================================================================
  // ANIMATED BOUNDARY TRACING (RUNS ON ANY CARD / STEP SELECTION)
  // Clean progressive trace directly over real geographic coordinates
  // =========================================================================
  const startZoneTraceAnimation = (stepIdx, targetMap) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map) return;

    let isPolygon = true;
    let mainColor = '#ea580c';
    let glowColor = '#f59e0b';
    let cameraCenter = [10.352, -75.568];
    let cameraZoom = 13.2;

    if (stepIdx === 0) {
      isPolygon = true;
      mainColor = '#ea580c';
      glowColor = '#f59e0b';
      cameraCenter = [10.352, -75.568];
      cameraZoom = 13.2;
    } else if (stepIdx === 1) {
      isPolygon = false;
      mainColor = '#dc2626';
      glowColor = '#f87171';
      cameraCenter = [10.352, -75.568];
      cameraZoom = 13.2;
    } else if (stepIdx === 2) {
      isPolygon = true;
      mainColor = '#f43f5e';
      glowColor = '#fda4af';
      cameraCenter = [10.3805, -75.5761];
      cameraZoom = 18.2;
    } else if (stepIdx === 3) {
      isPolygon = true;
      mainColor = '#0d9488';
      glowColor = '#2dd4bf';
      cameraCenter = [10.3730, -75.5759];
      cameraZoom = 16.2;
    } else if (stepIdx === 4) {
      isPolygon = false;
      mainColor = '#f59e0b';
      glowColor = '#fde68a';
      cameraCenter = [10.3715, -75.5755];
      cameraZoom = 16.5;
    }

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

    // Hide static layers during active tracing
    const { islandLayer, erosionLayer, schoolLayer, masterplanLayer, roadsLayer } = layersRef.current;
    if (islandLayer) islandLayer.setStyle({ opacity: stepIdx === 0 ? 0 : 0.15, fillOpacity: 0, weight: 2 });
    if (erosionLayer) erosionLayer.setStyle({ opacity: 0 });
    if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
    if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0, fillOpacity: 0 });
    if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 5, color: '#f59e0b' });

    // Instantly stabilize camera on the exact coordinates so the animation never jumps or warps
    if (stepIdx === 0 || stepIdx === 1) {
      const islandCoords = delimitations.island || DEFAULT_DELIMITATIONS.island || [];
      if (islandCoords.length > 0) {
        const islandBounds = L.latLngBounds(islandCoords);
        map.fitBounds(islandBounds, {
          paddingTopLeft: [70, 70],
          paddingBottomRight: [70, 130],
          animate: false
        });
      }
    } else {
      map.setView(cameraCenter, cameraZoom, { animate: false });
    }

    // Stabilize for 180ms before drawing starts to ensure the map viewport is completely stationary
    setTimeout(() => {
      if (!mapInstanceRef.current) return;

      // Handle Multi-line roads tracing
      if (stepIdx === 4) {
        const rawRoadLines = normalizeRoadLines(delimitations.roads || DEFAULT_DELIMITATIONS.roads);
        const validLines = rawRoadLines.filter(l => Array.isArray(l) && l.length >= 2);
        if (validLines.length === 0) {
          if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 1, weight: 5, color: '#f59e0b', dashArray: '8, 6', lineCap: 'round', lineJoin: 'round' });
          return;
        }

        setIsIntroAnimating(true);
        setAnimProgress(0);

        const resampledLines = validLines.map(line => resampleCoordinates(line, false, Math.max(25, Math.floor(120 / validLines.length))));

        const glowLine = L.polyline([], {
          color: glowColor,
          weight: 6,
          opacity: 0.45,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        const mainLine = L.polyline([], {
          color: mainColor,
          weight: 3.5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        const leadIcon = L.divIcon({
          className: 'custom-anim-lead-node',
          html: `
            <div class="relative flex items-center justify-center pointer-events-none">
              <div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${glowColor}"></div>
              <div class="w-4 h-4 rounded-full border-2 border-white shadow-xl flex items-center justify-center" style="background-color: ${mainColor}">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const leadMarker = L.marker(resampledLines[0][0], {
          icon: leadIcon,
          zIndexOffset: 3000
        }).addTo(map);

        animatingGlowRef.current = glowLine;
        animatingLayerRef.current = mainLine;
        tracerMarkerRef.current = leadMarker;

        let currentLineIdx = 0;
        let currentStepInLine = 1;
        const completedLines = [];

        animationTimerRef.current = setInterval(() => {
          const curLineCoords = resampledLines[currentLineIdx];
          currentStepInLine++;
          const currentSlice = curLineCoords.slice(0, currentStepInLine);

          const allDrawn = [...completedLines, currentSlice];
          glowLine.setLatLngs(allDrawn);
          mainLine.setLatLngs(allDrawn);

          const head = curLineCoords[Math.min(currentStepInLine - 1, curLineCoords.length - 1)];
          leadMarker.setLatLng(head);

          const totalPointsAcrossAll = resampledLines.reduce((sum, l) => sum + l.length, 0);
          const drawnSoFar = completedLines.reduce((sum, l) => sum + l.length, 0) + currentStepInLine;
          setAnimProgress(Math.min(100, Math.round((drawnSoFar / totalPointsAcrossAll) * 100)));

          if (currentStepInLine >= curLineCoords.length) {
            completedLines.push(curLineCoords);
            currentLineIdx++;
            currentStepInLine = 1;

            if (currentLineIdx >= resampledLines.length) {
              clearInterval(animationTimerRef.current);
              animationTimerRef.current = null;
              setTimeout(() => {
                if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 1, weight: 5, color: '#f59e0b', dashArray: '8, 6', lineCap: 'round', lineJoin: 'round' });
                if (animatingGlowRef.current) map.removeLayer(animatingGlowRef.current);
                if (animatingLayerRef.current) map.removeLayer(animatingLayerRef.current);
                if (tracerMarkerRef.current) map.removeLayer(tracerMarkerRef.current);
                setIsIntroAnimating(false);
              }, 150);
            } else {
              leadMarker.setLatLng(resampledLines[currentLineIdx][0]);
            }
          }
        }, 20);

        return;
      }

      // For single polygon/polyline (island, erosion, school, plateau)
      let rawCoords = [];
      if (stepIdx === 0) rawCoords = delimitations.island || DEFAULT_DELIMITATIONS.island || [];
      else if (stepIdx === 1) rawCoords = delimitations.erosion || DEFAULT_DELIMITATIONS.erosion || [];
      else if (stepIdx === 2) rawCoords = delimitations.school || DEFAULT_DELIMITATIONS.school || [];
      else if (stepIdx === 3) rawCoords = delimitations.plateau || DEFAULT_DELIMITATIONS.plateau || [];

      if (rawCoords.length < 2) return;

      setIsIntroAnimating(true);
      setAnimProgress(0);

      const sampledCoords = resampleCoordinates(rawCoords, isPolygon, 120);

      const glowLine = L.polyline([], {
        color: glowColor,
        weight: 6,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      const mainLine = L.polyline([], {
        color: mainColor,
        weight: 3.5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      const leadIcon = L.divIcon({
        className: 'custom-anim-lead-node',
        html: `
          <div class="relative flex items-center justify-center pointer-events-none">
            <div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${glowColor}"></div>
            <div class="w-4 h-4 rounded-full border-2 border-white shadow-xl flex items-center justify-center" style="background-color: ${mainColor}">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const leadMarker = L.marker(sampledCoords[0], {
        icon: leadIcon,
        zIndexOffset: 3000
      }).addTo(map);

      animatingGlowRef.current = glowLine;
      animatingLayerRef.current = mainLine;
      tracerMarkerRef.current = leadMarker;

      const totalSteps = sampledCoords.length;
      let stepCount = 1;
      const stepIntervalMs = 20;

      animationTimerRef.current = setInterval(() => {
        stepCount++;
        const currentPts = sampledCoords.slice(0, stepCount);

        glowLine.setLatLngs(currentPts);
        mainLine.setLatLngs(currentPts);

        const currentHead = sampledCoords[Math.min(stepCount - 1, totalSteps - 1)];
        leadMarker.setLatLng(currentHead);

        const pct = Math.min(100, Math.round((stepCount / totalSteps) * 100));
        setAnimProgress(pct);

        if (stepCount >= totalSteps) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;

          setTimeout(() => {
            if (stepIdx === 0 && islandLayer) {
              islandLayer.setStyle({ opacity: 1, fillOpacity: 0, weight: 4.5, color: '#ea580c', dashArray: '6, 6' });
            } else if (stepIdx === 1 && erosionLayer) {
              erosionLayer.setStyle({ opacity: 1, weight: 6, color: '#dc2626', dashArray: '8, 8', lineCap: 'round', lineJoin: 'round' });
            } else if (stepIdx === 2 && schoolLayer) {
              schoolLayer.setStyle({ opacity: 1, fillOpacity: 0.25, weight: 4.5, color: '#f43f5e', dashArray: '6, 6' });
            } else if (stepIdx === 3 && masterplanLayer) {
              masterplanLayer.setStyle({ opacity: 1, fillOpacity: 0, weight: 4.5, color: '#0d9488', dashArray: '6, 6' });
            }

            if (animatingGlowRef.current) map.removeLayer(animatingGlowRef.current);
            if (animatingLayerRef.current) map.removeLayer(animatingLayerRef.current);
            if (tracerMarkerRef.current) map.removeLayer(tracerMarkerRef.current);
            setIsIntroAnimating(false);
          }, 150);
        }
      }, stepIntervalMs);
    }, 180);
  };

  // =========================================================================
  // 1. INITIALIZE LEAFLET MAP
  // =========================================================================
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const islandCoords = delimitations.island || DEFAULT_DELIMITATIONS.island || [];
    const islandBounds = L.latLngBounds(islandCoords);

    // Initialize map firmly centered & framed on Tierrabomba
    const map = L.map(mapRef.current, {
      center: [10.352, -75.568],
      zoom: 13.2,
      zoomControl: false,
      attributionControl: false
    });

    // Fit bounds immediately to frame Card 01 island delimitation perfectly!
    map.fitBounds(islandBounds, {
      paddingTopLeft: [70, 70],
      paddingBottomRight: [70, 130],
      animate: false
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

    // Initial Smooth Resize & Frame Zoom
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(islandBounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: [70, 130],
        animate: true,
        duration: 0.8
      });
      setIsIntroZooming(false);
    }, 150);

    // =========================================================================
    // CONTOURS / POLYGONS: ALL INITIALLY OFF (OPACITY: 0) UNTIL A CARD IS PRESSED!
    // =========================================================================

    // 1. Island Perimeter Polygon (Initially hidden, revealed on Card 01 click!)
    const islandLayer = L.polygon(delimitations.island || [], {
      color: '#ea580c',
      weight: 4.5,
      dashArray: '8, 8',
      fillColor: 'transparent',
      fillOpacity: 0,
      opacity: 0,
      interactive: false
    }).addTo(map);

    // 2. Coastal Erosion Line (Initially hidden, revealed on Card 02 click!)
    const erosionLayer = L.polyline(delimitations.erosion || [], {
      color: '#dc2626',
      weight: 7,
      opacity: 0,
      dashArray: '10, 6',
      interactive: false
    }).addTo(map);

    // 3. Current School Vulnerable Polygon (Initially hidden, revealed on Card 03 click!)
    const schoolLayer = L.polygon(delimitations.school || [], {
      color: '#ef4444',
      weight: 4,
      dashArray: '6, 6',
      fillColor: '#ef4444',
      fillOpacity: 0,
      opacity: 0,
      interactive: false
    }).addTo(map);

    // 3B. Vulnerable Coastal Houses Strip (Between Erosion Line & Island Coast)
    const vulnerableHousesLayer = L.polygon(delimitations.vulnerableHouses || DEFAULT_DELIMITATIONS.vulnerableHouses || [], {
      color: '#dc2626',
      weight: 3.5,
      dashArray: '6, 6',
      fillColor: '#dc2626',
      fillOpacity: 0,
      opacity: 0,
      interactive: false
    }).addTo(map);

    const vulnerableHousesMarkersGroup = L.layerGroup().addTo(map);

    // 4. Safe Plateau Polygon (+22m) (Initially hidden, revealed on Card 04 click! - NO FILL, BORDER ONLY)
    const masterplanLayer = L.polygon(delimitations.plateau || [], {
      color: '#0d9488',
      weight: 4.5,
      dashArray: '8, 8',
      fillColor: 'transparent',
      fillOpacity: 0,
      opacity: 0,
      interactive: false
    }).addTo(map);

    // 5. Roads Layer (Master Plan: Vías - Independent branches)
    const roadsLayer = L.layerGroup().addTo(map);
    syncRoadsLayer(roadsLayer, delimitations.roads, {
      color: '#f59e0b',
      weight: 5,
      opacity: 0,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    });

    // 6. Custom Polygon Layer (Initially hidden)
    const customLayer = L.polygon(delimitations.custom || [], {
      color: '#06b6d4',
      weight: 3.5,
      dashArray: '6, 6',
      fillColor: '#06b6d4',
      fillOpacity: 0,
      opacity: 0,
      interactive: false
    }).addTo(map);

    // =========================================================================
    // 5 DISTINCT INTERACTIVE MARKER ICONS (ALWAYS VISIBLE & CLICKABLE ON MAP)
    // =========================================================================

    // Marker 1: Delimitación Territorial (Isla Tierrabomba)
    const marker1Icon = L.divIcon({
      className: 'custom-framework-pin-1 cursor-pointer',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" title="Paso 01: Delimitación Territorial">
          <div class="absolute -inset-2 rounded-full bg-amber-500/30 animate-ping"></div>
          <div class="w-7 h-7 rounded-xl bg-amber-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker1 = L.marker([10.3540, -75.5700], { icon: marker1Icon, interactive: true }).addTo(map);
    marker1.on('click', () => {
      setCurrentStepIndex(0);
      startZoneTraceAnimation(0);
    });

    // Marker 2: Franja de Erosión Costera
    const marker2Icon = L.divIcon({
      className: 'custom-framework-pin-2 cursor-pointer',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" title="Paso 02: Franja de Erosión Costera">
          <div class="absolute -inset-2 rounded-full bg-red-600/30 animate-pulse"></div>
          <div class="w-7 h-7 rounded-xl bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker2 = L.marker([10.3585, -75.5905], { icon: marker2Icon, interactive: true }).addTo(map);
    marker2.on('click', () => {
      setCurrentStepIndex(1);
      startZoneTraceAnimation(1);
    });

    // Marker 3: Colegio Actual en Riesgo
    const marker3Icon = L.divIcon({
      className: 'custom-framework-pin-3 cursor-pointer',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" title="Paso 03: Colegio Actual en Riesgo">
          <div class="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></div>
          <div class="w-7 h-7 rounded-xl bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const schoolCenter = (delimitations.school && delimitations.school.length > 0) 
      ? delimitations.school[0] 
      : [10.3805, -75.5761];
    const marker3 = L.marker(schoolCenter, { icon: marker3Icon, interactive: true }).addTo(map);
    marker3.on('click', () => {
      setCurrentStepIndex(2);
      startZoneTraceAnimation(2);
    });

    // Marker 4: Meseta Segura (+22m)
    const marker4Icon = L.divIcon({
      className: 'custom-framework-pin-4 cursor-pointer',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" title="Paso 04: Meseta Segura (+22.00m)">
          <div class="absolute -inset-2 rounded-full bg-teal-400/30 animate-pulse"></div>
          <div class="w-7 h-7 rounded-xl bg-teal-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker4 = L.marker([10.3730, -75.5759], { icon: marker4Icon, interactive: true }).addTo(map);
    marker4.on('click', () => {
      setCurrentStepIndex(3);
      startZoneTraceAnimation(3);
    });

    // Marker 5: Master Plan Vías
    const marker5Icon = L.divIcon({
      className: 'custom-framework-pin-5 cursor-pointer',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer" title="Paso 05: Master Plan Vías">
          <div class="absolute -inset-2 rounded-full bg-amber-500/30 animate-pulse"></div>
          <div class="w-7 h-7 rounded-xl bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 19L19 4M4 4l15 15"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker5 = L.marker([10.3715, -75.5755], { icon: marker5Icon, interactive: true }).addTo(map);
    marker5.on('click', () => {
      setCurrentStepIndex(4);
      startZoneTraceAnimation(4);
    });

    layersRef.current = {
      islandLayer,
      erosionLayer,
      schoolLayer,
      vulnerableHousesLayer,
      vulnerableHousesMarkersGroup,
      masterplanLayer,
      roadsLayer,
      customLayer,
      marker1,
      marker2,
      marker3,
      marker4,
      marker5
    };

    mapInstanceRef.current = map;

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
        if (activeZoneKey === 'roads') {
          const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
          const lineIdx = Math.max(0, activeRoadLineIndex);
          while (currentLines.length <= lineIdx) {
            currentLines.push([]);
          }
          currentLines[lineIdx].push(newCoord);
          return {
            ...prev,
            roads: currentLines
          };
        } else {
          const currentZone = prev[activeZoneKey] || [];
          return {
            ...prev,
            [activeZoneKey]: [...currentZone, newCoord]
          };
        }
      });
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [isEditMode, activeZoneKey, toolMode, activeRoadLineIndex]);

  // =========================================================================
  // 2. SYNCHRONIZE LEAFLET GEOMETRY WITH DELIMITATION STATE
  // =========================================================================
  useEffect(() => {
    const { islandLayer, erosionLayer, schoolLayer, masterplanLayer, roadsLayer, customLayer, marker3 } = layersRef.current;
    if (islandLayer && delimitations.island) {
      islandLayer.setLatLngs(delimitations.island);
    }
    if (erosionLayer && delimitations.erosion) {
      erosionLayer.setLatLngs(delimitations.erosion);
    }
    if (schoolLayer && delimitations.school) {
      schoolLayer.setLatLngs(delimitations.school);
    }
    if (marker3 && delimitations.school && delimitations.school.length > 0) {
      marker3.setLatLng(delimitations.school[0]);
    }
    if (masterplanLayer && delimitations.plateau) {
      masterplanLayer.setLatLngs(delimitations.plateau);
    }
    if (roadsLayer && delimitations.roads) {
      syncRoadsLayer(roadsLayer, delimitations.roads, {
        opacity: (isEditMode && activeZoneKey === 'roads') || (!isEditMode && currentStepIndex === 4) ? 1 : (isEditMode ? 0.2 : 0),
        weight: 5,
        color: '#f59e0b',
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      });
    }
    if (customLayer && delimitations.custom) {
      customLayer.setLatLngs(delimitations.custom);
    }
  }, [delimitations, isEditMode, activeZoneKey, currentStepIndex]);

  // Synchronize Reference Calque Image Overlay on the map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = L.latLngBounds(
      [calqueBounds.south, calqueBounds.west],
      [calqueBounds.north, calqueBounds.east]
    );

    if (!calqueOverlayRef.current) {
      calqueOverlayRef.current = L.imageOverlay(calqueImage, bounds, {
        opacity: showCalque ? calqueOpacity : 0,
        interactive: false,
        zIndex: 200
      }).addTo(map);
    } else {
      calqueOverlayRef.current.setBounds(bounds);
      calqueOverlayRef.current.setOpacity(showCalque ? calqueOpacity : 0);
    }
  }, [showCalque, calqueOpacity, calqueBounds]);

  // =========================================================================
  // 3. RENDER INTERACTIVE DRAGGABLE & DELETABLE NODE HANDLERS IN EDIT MODE
  // =========================================================================
  useEffect(() => {
    const group = nodeMarkersGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (!isEditMode) return;

    const zoneCfg = ZONE_CONFIG[activeZoneKey];

    // Multi-line rendering for roads
    if (activeZoneKey === 'roads') {
      const roadLines = normalizeRoadLines(delimitations.roads);
      roadLines.forEach((line, lineIdx) => {
        const isCurrentLine = lineIdx === activeRoadLineIndex;

        line.forEach((coord, idx) => {
          const isSelected = isCurrentLine && selectedNodeIndex === idx;

          const nodeIcon = L.divIcon({
            className: 'delimitation-node-handle',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer group">
                <div class="absolute -inset-2.5 rounded-full ${isSelected ? 'bg-amber-400/60 animate-ping' : toolMode === 'delete' ? 'bg-red-500/40 animate-pulse' : isCurrentLine ? 'bg-white/40 group-hover:bg-white/70' : 'bg-slate-400/20'} transition-all"></div>
                <div class="w-7 h-7 rounded-full border-2 ${isCurrentLine ? 'border-white ring-2 ring-amber-400/80 shadow-2xl' : 'border-slate-300 opacity-80'} flex items-center justify-center text-white text-[10px] font-mono font-black transition-transform group-hover:scale-125" style="background-color: ${toolMode === 'delete' ? '#dc2626' : isSelected ? '#f59e0b' : isCurrentLine ? zoneCfg.color : '#64748b'}">
                  ${toolMode === 'delete' ? '✕' : `T${lineIdx + 1}.${idx + 1}`}
                </div>
                <div class="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-white font-mono pointer-events-none z-50 shadow-xl border border-white/20">
                  Tramo ${lineIdx + 1} - Punto ${idx + 1}
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = L.marker(coord, {
            icon: nodeIcon,
            draggable: toolMode !== 'delete',
            zIndexOffset: 2000 + (lineIdx * 100) + idx
          });

          marker.on('drag', (e) => {
            const { lat, lng } = e.target.getLatLng();
            const updated = [Number(lat.toFixed(5)), Number(lng.toFixed(5))];
            setDelimitations(prev => {
              const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
              if (currentLines[lineIdx]) {
                currentLines[lineIdx][idx] = updated;
              }
              return { ...prev, roads: currentLines };
            });
          });

          marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (e.originalEvent) e.originalEvent.stopPropagation();

            if (toolMode === 'delete') {
              handleRemoveSpecificNode(idx, lineIdx);
            } else {
              setActiveRoadLineIndex(lineIdx);
              setSelectedNodeIndex(isSelected ? null : idx);
            }
          });

          marker.on('contextmenu', (e) => {
            L.DomEvent.stopPropagation(e);
            if (e.originalEvent) e.originalEvent.preventDefault();
            handleRemoveSpecificNode(idx, lineIdx);
          });

          group.addLayer(marker);
        });
      });
      return;
    }

    // Single list rendering for other zones (island, erosion, school, plateau, custom)
    const currentNodes = delimitations[activeZoneKey] || [];

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

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (e.originalEvent) e.originalEvent.stopPropagation();

        if (toolMode === 'delete') {
          handleRemoveSpecificNode(idx);
        } else {
          setSelectedNodeIndex(isSelected ? null : idx);
        }
      });

      marker.on('contextmenu', (e) => {
        L.DomEvent.stopPropagation(e);
        if (e.originalEvent) e.originalEvent.preventDefault();
        handleRemoveSpecificNode(idx);
      });

      group.addLayer(marker);
    });
  }, [isEditMode, activeZoneKey, delimitations, selectedNodeIndex, toolMode, activeRoadLineIndex]);

  // =========================================================================
  // 4. STEP NAVIGATION & AUTOPLAY (NON-EDIT MODE)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { islandLayer, erosionLayer, schoolLayer, vulnerableHousesLayer, vulnerableHousesMarkersGroup, masterplanLayer, roadsLayer, customLayer } = layersRef.current;

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
      setIsIntroAnimating(false);

      if (islandLayer) islandLayer.setStyle({ opacity: activeZoneKey === 'island' ? 1 : 0.2, fillOpacity: 0, weight: 4 });
      if (erosionLayer) erosionLayer.setStyle({ opacity: activeZoneKey === 'erosion' ? 1 : 0.2, weight: 6, color: '#dc2626' });
      if (schoolLayer) schoolLayer.setStyle({ opacity: activeZoneKey === 'school' ? 1 : 0.2, fillOpacity: activeZoneKey === 'school' ? 0.3 : 0, weight: 4.5 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: activeZoneKey === 'plateau' ? 1 : 0.2, fillOpacity: 0, weight: 4.5 });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: activeZoneKey === 'roads' ? 1 : 0.2, weight: activeZoneKey === 'roads' ? 3.5 : 2, color: '#f59e0b', dashArray: '6, 5', lineCap: 'round', lineJoin: 'round' });
      if (customLayer) customLayer.setStyle({ opacity: activeZoneKey === 'custom' ? 1 : 0.2, fillOpacity: activeZoneKey === 'custom' ? 0.2 : 0, weight: 3.5 });
      return;
    }

    // If active intro animation is tracing, do NOT overwrite styles
    if (isIntroAnimating) {
      return;
    }

    // If no card is pressed yet (currentStepIndex === null), all contours off
    if (currentStepIndex === null) {
      if (islandLayer) islandLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 2.8, color: '#f59e0b' });
      if (customLayer) customLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      return;
    }

    // Static display when animation is not running
    if (currentStepIndex === 0) {
      if (islandLayer) islandLayer.setStyle({ opacity: 1, fillOpacity: 0, weight: 4.5, color: '#ea580c', dashArray: '6, 6' });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 0 });
      if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 2.8, color: '#f59e0b' });
    } else if (currentStepIndex === 1) {
      if (islandLayer) islandLayer.setStyle({ opacity: 0.15, fillOpacity: 0, weight: 2, color: '#ea580c', dashArray: '6, 6' });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 1, weight: 6, color: '#dc2626', dashArray: '8, 8', lineCap: 'round', lineJoin: 'round' });
      if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 2.8, color: '#f59e0b' });
    } else if (currentStepIndex === 2) {
      if (islandLayer) islandLayer.setStyle({ opacity: 0.15, fillOpacity: 0, weight: 2, color: '#ea580c', dashArray: '6, 6' });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 0.65, weight: 4, color: '#dc2626', dashArray: '8, 8' });
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 2.8, color: '#f59e0b' });

      if (vulnerabilitySubTab === 'school') {
        if (schoolLayer) schoolLayer.setStyle({ opacity: 1, fillOpacity: 0.35, weight: 4.5, color: '#f43f5e', dashArray: '6, 6' });
        if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
        if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      } else {
        if (schoolLayer) schoolLayer.setStyle({ opacity: 0.15, fillOpacity: 0 });
        if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 1, fillOpacity: 0.40, weight: 3.5, color: '#dc2626', dashArray: '6, 6' });
        
        if (vulnerableHousesMarkersGroup) {
          vulnerableHousesMarkersGroup.clearLayers();
          const houseIcon = L.divIcon({
            className: 'custom-vuln-house-pin',
            html: `
              <div class="relative flex items-center justify-center group" title="Vivienda en Riesgo Crítico de Socavación">
                <div class="absolute -inset-1.5 rounded-full bg-red-600/40 animate-ping"></div>
                <div class="w-4 h-4 rounded-md bg-red-600 border border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                  ⌂
                </div>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const VULNERABLE_HOUSES_COORDS = [
            [10.3682, -75.5807], [10.3675, -75.5818], [10.3668, -75.5828], [10.3662, -75.5842],
            [10.3655, -75.5852], [10.3648, -75.5858], [10.3641, -75.5862], [10.3632, -75.5864],
            [10.3624, -75.5866], [10.3615, -75.5878], [10.3608, -75.5888], [10.3598, -75.5893],
            [10.3590, -75.5898], [10.3582, -75.5912], [10.3571, -75.5915], [10.3560, -75.5916],
            [10.3551, -75.5912], [10.3541, -75.5906], [10.3530, -75.5904], [10.3518, -75.5905],
            [10.3505, -75.5911], [10.3493, -75.5918], [10.3481, -75.5925], [10.3470, -75.5928],
            [10.3455, -75.5927], [10.3440, -75.5925], [10.3425, -75.5922], [10.3408, -75.5915],
            [10.3385, -75.5913], [10.3360, -75.5918], [10.3342, -75.5927], [10.3325, -75.5929],
            [10.3305, -75.5922], [10.3285, -75.5918], [10.3265, -75.5910]
          ];

          VULNERABLE_HOUSES_COORDS.forEach(pt => {
            vulnerableHousesMarkersGroup.addLayer(L.marker(pt, { icon: houseIcon, interactive: false }));
          });
        }
      }
    } else if (currentStepIndex === 3) {
      if (islandLayer) islandLayer.setStyle({ opacity: 0.15, fillOpacity: 0, weight: 2, color: '#ea580c', dashArray: '6, 6' });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 0 });
      if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 1, fillOpacity: 0, weight: 4.5, color: '#0d9488', dashArray: '6, 6' });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 0, weight: 2.8, color: '#f59e0b' });
    } else if (currentStepIndex === 4) {
      if (islandLayer) islandLayer.setStyle({ opacity: 0.15, fillOpacity: 0, weight: 2, color: '#ea580c', dashArray: '6, 6' });
      if (erosionLayer) erosionLayer.setStyle({ opacity: 0 });
      if (schoolLayer) schoolLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesLayer) vulnerableHousesLayer.setStyle({ opacity: 0, fillOpacity: 0 });
      if (vulnerableHousesMarkersGroup) vulnerableHousesMarkersGroup.clearLayers();
      if (masterplanLayer) masterplanLayer.setStyle({ opacity: 0.35, fillOpacity: 0, weight: 2, color: '#0d9488', dashArray: '6, 6' });
      if (roadsLayer) syncRoadsLayer(roadsLayer, delimitations.roads, { opacity: 1, weight: 2.8, color: '#f59e0b', dashArray: '6, 5', lineCap: 'round', lineJoin: 'round' });
    }
  }, [currentStepIndex, isEditMode, isIntroAnimating, activeZoneKey, delimitations.roads, vulnerabilitySubTab]);

  // Autoplay sequence timer
  useEffect(() => {
    if (!isPlaying || isEditMode) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev === null || prev >= FRAMEWORK_STEPS.length - 1 ? 0 : prev + 1;
        startZoneTraceAnimation(next);
        if (prev !== null && prev >= FRAMEWORK_STEPS.length - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 4500);

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
  const handleAddNewRoadLine = () => {
    setDelimitations(prev => {
      const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
      if (currentLines.length > 0 && currentLines[currentLines.length - 1].length === 0) {
        setActiveRoadLineIndex(currentLines.length - 1);
        return prev;
      }
      currentLines.push([]);
      setActiveRoadLineIndex(currentLines.length - 1);
      return { ...prev, roads: currentLines };
    });
    setToolMode('add');
  };

  const handleDeleteRoadLine = (lineIdxToDelete) => {
    setDelimitations(prev => {
      const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
      if (currentLines.length <= 1) {
        return { ...prev, roads: [[]] };
      }
      const newLines = currentLines.filter((_, idx) => idx !== lineIdxToDelete);
      return { ...prev, roads: newLines };
    });
    setActiveRoadLineIndex(prev => Math.max(0, prev - 1));
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleUndoLastNode = () => {
    setDelimitations(prev => {
      if (activeZoneKey === 'roads') {
        const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
        const lineIdx = Math.min(activeRoadLineIndex, currentLines.length - 1);
        if (currentLines[lineIdx] && currentLines[lineIdx].length > 0) {
          currentLines[lineIdx].pop();
        }
        return { ...prev, roads: currentLines };
      } else {
        const zoneCoords = [...(prev[activeZoneKey] || [])];
        zoneCoords.pop();
        return { ...prev, [activeZoneKey]: zoneCoords };
      }
    });
    setSelectedNodeIndex(null);
  };

  const handleRemoveSpecificNode = (nodeIdx, lineIdx = null) => {
    setDelimitations(prev => {
      if (activeZoneKey === 'roads') {
        const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
        const targetLineIdx = lineIdx !== null ? lineIdx : activeRoadLineIndex;
        if (currentLines[targetLineIdx]) {
          currentLines[targetLineIdx].splice(nodeIdx, 1);
        }
        return { ...prev, roads: currentLines };
      } else {
        const zoneCoords = [...(prev[activeZoneKey] || [])];
        zoneCoords.splice(nodeIdx, 1);
        return { ...prev, [activeZoneKey]: zoneCoords };
      }
    });
    if (selectedNodeIndex === nodeIdx) setSelectedNodeIndex(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleClearZoneInstant = () => {
    // Immediate clear with 1 click - no blocking confirms!
    setDelimitations(prev => {
      if (activeZoneKey === 'roads') {
        return { ...prev, roads: [[]] };
      }
      return {
        ...prev,
        [activeZoneKey]: []
      };
    });
    setActiveRoadLineIndex(0);
    setSelectedNodeIndex(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleClearCurrentRoadLine = () => {
    setDelimitations(prev => {
      const currentLines = normalizeRoadLines(prev.roads).map(l => [...l]);
      if (currentLines[activeRoadLineIndex]) {
        currentLines[activeRoadLineIndex] = [];
      }
      return { ...prev, roads: currentLines };
    });
    setSelectedNodeIndex(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 2000);
  };

  const handleResetToDefault = () => {
    setDelimitations(prev => ({
      ...prev,
      [activeZoneKey]: DEFAULT_DELIMITATIONS[activeZoneKey] || []
    }));
    setActiveRoadLineIndex(0);
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
    const rawData = delimitations[activeZoneKey] || [];
    const formatted = activeZoneKey === 'roads' ? normalizeRoadLines(rawData) : rawData;
    const jsonFormatted = JSON.stringify(formatted, null, 2);
    navigator.clipboard.writeText(jsonFormatted);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  const handleApplyPastedCoords = () => {
    try {
      let text = (pastedCoordsText || '').trim();
      if (!text) {
        alert("Por favor escribe o pega un array de coordenadas.");
        return;
      }
      if (!text.startsWith('[')) {
        text = '[' + text + ']';
      }
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (activeZoneKey === 'roads') {
          // Check if parsed is [ [ [lat, lng], ... ], ... ] or [ [lat, lng], ... ]
          let cleanRoads = [];
          if (typeof parsed[0][0] === 'number') {
            // single line pasted
            cleanRoads = [parsed.map(p => [Number(Number(p[0]).toFixed(5)), Number(Number(p[1]).toFixed(5))])];
          } else {
            cleanRoads = parsed.map(line => 
              Array.isArray(line) 
                ? line.map(p => [Number(Number(p[0]).toFixed(5)), Number(Number(p[1]).toFixed(5))])
                : []
            );
          }
          setDelimitations(prev => ({
            ...prev,
            roads: cleanRoads
          }));
          setActiveRoadLineIndex(0);
        } else {
          const valid = parsed.every(p => Array.isArray(p) && p.length >= 2 && !isNaN(Number(p[0])) && !isNaN(Number(p[1])));
          if (!valid) throw new Error("Las coordenadas deben ser pares numéricos [lat, lng]");
          
          const cleanCoords = parsed.map(p => [Number(Number(p[0]).toFixed(5)), Number(Number(p[1]).toFixed(5))]);
          setDelimitations(prev => ({
            ...prev,
            [activeZoneKey]: cleanCoords
          }));
        }
        setPastedCoordsText('');
        setShowPasteBox(false);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      } else {
        throw new Error("El formato debe ser un array de coordenadas.");
      }
    } catch (e) {
      alert("Error al importar coordenadas: " + e.message + "\nFormato esperado: [[10.368, -75.580], [10.366, -75.583]] o multi-líneas [[ [...], [...] ]]");
    }
  };

  const handleDownloadGeoJSON = () => {
    const coords = delimitations[activeZoneKey] || [];
    const isPoly = activeZoneConfig.type === 'polygon';
    
    let geometry = {};
    if (activeZoneKey === 'roads') {
      const roadLines = normalizeRoadLines(coords);
      const multiLineCoords = roadLines.map(line => line.map(c => [c[1], c[0]]));
      geometry = {
        type: "MultiLineString",
        coordinates: multiLineCoords
      };
    } else {
      const geoJsonCoords = coords.map(c => [c[1], c[0]]);
      if (isPoly && geoJsonCoords.length > 0) {
        geoJsonCoords.push([coords[0][1], coords[0][0]]);
      }
      geometry = {
        type: isPoly ? "Polygon" : "LineString",
        coordinates: isPoly ? [geoJsonCoords] : geoJsonCoords
      };
    }

    const geoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            zoneKey: activeZoneKey,
            zoneName: activeZoneConfig.name,
            nodeCount: zoneStats.count,
            areaHa: isPoly ? zoneStats.areaHa : null,
            lengthKm: zoneStats.lengthKm,
            updatedAt: new Date().toISOString()
          },
          geometry
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
                {isEditMode ? `${zoneStats.count} Puntos` : `Paso 0${currentStep.step} de 05`}
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
              if (!isEditMode) {
                if (currentStepIndex === 0) setActiveZoneKey('island');
                else if (currentStepIndex === 1) setActiveZoneKey('erosion');
                else if (currentStepIndex === 2) setActiveZoneKey('school');
                else if (currentStepIndex === 3) setActiveZoneKey('plateau');
                else if (currentStepIndex === 4) setActiveZoneKey('roads');
              }
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
                  const targetIdx = currentStepIndex !== null ? currentStepIndex : 0;
                  setCurrentStepIndex(targetIdx);
                  setIsPlaying(false);
                  startZoneTraceAnimation(targetIdx);
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                  isIntroAnimating
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-102'
                }`}
                title="Trazar perímetro animado de la zona seleccionada"
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
            <>
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                  showRightPanel
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title="Mostrar / Ocultar panel de coordenadas a la derecha"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{showRightPanel ? 'Panel Coords ON' : 'Ver Coordenadas'}</span>
              </button>

              <button
                onClick={handleSaveDelimitation}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-105"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar (Save)</span>
              </button>
            </>
          )}
        </div>

        {/* Aerial Satellite / Carto Layer Toggle & Calque Button */}
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
          <div className="w-px h-4 bg-slate-300/80 mx-0.5" />
          <button
            onClick={() => setShowCalque(!showCalque)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              showCalque
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/40'
                : 'text-slate-600 hover:text-slate-950'
            }`}
            title="Mostrar u ocultar la imagen de referencia para calcar"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showCalque ? 'Calco ON' : 'Calco'}</span>
          </button>
        </div>

      </div>

      {/* Floating Center Cinematic Animation Status Pill */}
      {isIntroAnimating && !isEditMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[450] pointer-events-none animate-fade-in">
          <div className="glass-hud px-4 py-2 rounded-full border border-amber-400/60 shadow-2xl flex items-center space-x-3 backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-900 tracking-wide">
              Trazando {currentStep.title}: <span className="text-amber-600 font-black">{animProgress}%</span>
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

      {/* Interactive Sub-Selector for Step 3: Colegio Actual vs Viviendas en Riesgo */}
      {currentStepIndex === 2 && !isEditMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[450] flex flex-wrap items-center justify-center gap-2 p-1.5 glass-hud rounded-2xl shadow-2xl border border-rose-500/50 animate-scale-up text-slate-900 pointer-events-auto">
          <button
            onClick={() => {
              setVulnerabilitySubTab('school');
              const map = mapInstanceRef.current;
              if (map) map.setView([10.3805, -75.5761], 18.2);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              vulnerabilitySubTab === 'school'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>1. Colegio Actual en Riesgo (Cota +1.5m)</span>
          </button>
          <button
            onClick={() => {
              setVulnerabilitySubTab('houses');
              const map = mapInstanceRef.current;
              if (map) map.setView([10.3540, -75.5880], 14.8);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              vulnerabilitySubTab === 'houses'
                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 animate-pulse'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>2. Viviendas Actuales en Riesgo (120 familias en franja roja)</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NODE DELIMITATION EDITOR TOOLBAR (FLOATING LEFT PANEL IN EDIT MODE)    */}
      {/* ========================================================================= */}
      {isEditMode && (
        <div className="absolute top-24 left-4 z-[400] glass-panel p-4 rounded-3xl space-y-4 pointer-events-auto text-slate-900 w-72 shadow-2xl animate-scale-up max-h-[calc(100vh-8rem)] overflow-y-auto">
          
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

          {/* Reference Calque Image Overlay Control (Calcar Plano) */}
          <div className="p-3 bg-slate-100/90 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-serif font-bold text-slate-900">
                  Imagen para Calcar
                </span>
              </div>
              <button
                onClick={() => setShowCalque(!showCalque)}
                className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold transition-all ${
                  showCalque
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {showCalque ? '👁️ Visible' : 'Oculto'}
              </button>
            </div>

            {showCalque && (
              <div className="space-y-2.5 pt-1 border-t border-slate-200">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <span>Opacidad: {Math.round(calqueOpacity * 100)}%</span>
                  <button
                    onClick={() => setCalqueBounds(DEFAULT_CALQUE_BOUNDS)}
                    className="text-amber-800 hover:text-amber-950 underline font-bold"
                  >
                    Centrar Original
                  </button>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={calqueOpacity}
                  onChange={(e) => setCalqueOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />

                {/* DIRECT VISIBLE DIRECTIONAL PAD */}
                <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="text-[10px] font-mono font-black text-slate-700 uppercase flex items-center justify-between">
                    <span>Mover Posición:</span>
                    <span className="text-amber-700 font-bold">Usa ▶ Derecha</span>
                  </div>

                  {/* 4-Way Directional Grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono font-bold text-xs">
                    <div />
                    <button
                      onClick={() => moveCalqueLat(0.0006)}
                      className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex flex-col items-center justify-center transition-all active:scale-90 border border-slate-200 shadow-xs"
                      title="Subir hacia el Norte"
                    >
                      <span className="text-sm">▲</span>
                      <span className="text-[9px] font-semibold">Arriba</span>
                    </button>
                    <div />

                    <button
                      onClick={() => moveCalqueLng(-0.0006)}
                      className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex flex-col items-center justify-center transition-all active:scale-90 border border-slate-200 shadow-xs"
                      title="Correr a la Izquierda"
                    >
                      <span className="text-sm">◀</span>
                      <span className="text-[9px] font-semibold">Izquierda</span>
                    </button>

                    <button
                      onClick={() => moveCalqueLat(-0.0006)}
                      className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex flex-col items-center justify-center transition-all active:scale-90 border border-slate-200 shadow-xs"
                      title="Bajar hacia el Sur"
                    >
                      <span className="text-sm">▼</span>
                      <span className="text-[9px] font-semibold">Abajo</span>
                    </button>

                    <button
                      onClick={() => moveCalqueLng(0.0006)}
                      className="py-2 px-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex flex-col items-center justify-center transition-all active:scale-90 border border-amber-600 shadow-md ring-2 ring-amber-300"
                      title="Correr a la Derecha"
                    >
                      <span className="text-sm">▶</span>
                      <span className="text-[9px] font-black">Derecha</span>
                    </button>
                  </div>

                  {/* Scale Controls */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => scaleCalque(1.02)}
                      className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono font-bold flex items-center justify-center space-x-1 border border-slate-200"
                    >
                      <span>🔍 + Agrandar</span>
                    </button>
                    <button
                      onClick={() => scaleCalque(0.98)}
                      className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono font-bold flex items-center justify-center space-x-1 border border-slate-200"
                    >
                      <span>🔍 - Reducir</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zone Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block px-1">
              Seleccionar Zona a Trazar:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(ZONE_CONFIG).map((zone) => {
                const isCur = activeZoneKey === zone.id;
                const nodeCount = zone.id === 'roads' 
                  ? countRoadPoints(delimitations.roads) 
                  : (delimitations[zone.id] || []).length;
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
                disabled={activeZoneKey === 'roads' ? countRoadPoints(delimitations.roads) === 0 : activeNodes.length === 0}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-102"
                title={activeZoneKey === 'roads' ? "Borra todas las vías para empezar de cero" : "Borra todos los puntos de esta zona"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{activeZoneKey === 'roads' ? 'Vaciar Vías' : 'Vaciar Todo'}</span>
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
              <span>
                {activeZoneKey === 'roads' 
                  ? `Vértices Tramo ${activeRoadLineIndex + 1} (${activeNodes.length}):` 
                  : `Lista de Vértices (${activeNodes.length}):`}
              </span>
              <span className="text-amber-700">Clic en ✕ para quitar</span>
            </div>

            {activeNodes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-dashed border-amber-300 text-center text-xs text-amber-900 font-mono">
                {activeZoneKey === 'roads'
                  ? `Tramo ${activeRoadLineIndex + 1} vacío. Haz clic en el mapa para trazar este tramo.`
                  : 'Zona vacía. Haz clic en el mapa satelital para trazar tu delimitación.'}
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
                        {activeZoneKey === 'roads' ? `T${activeRoadLineIndex + 1}.${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-slate-700">
                        [{coord[0]}, {coord[1]}]
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSpecificNode(idx, activeZoneKey === 'roads' ? activeRoadLineIndex : null)}
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
      {/* 3B. RIGHT SIDEBAR: LIVE COORDINATES & BRUSH PANEL                         */}
      {/* ========================================================================= */}
      {isEditMode && showRightPanel && (
        <div className="absolute top-24 right-4 z-[400] glass-panel p-4 rounded-3xl space-y-3.5 pointer-events-auto text-slate-900 w-88 sm:w-96 shadow-2xl animate-scale-up max-h-[calc(100vh-8rem)] overflow-y-auto border border-amber-400/40">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeZoneConfig.color }} />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Coordenadas en Vivo
                </span>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                  {activeZoneConfig.name}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setShowRightPanel(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Cerrar panel de coordenadas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dedicated Road Line Creation in Right Panel */}
          {activeZoneKey === 'roads' && (
            <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-black text-amber-950 uppercase flex items-center space-x-1.5">
                  <Route className="w-3.5 h-3.5 text-amber-700" />
                  <span>Control de Tramos de Vía</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {normalizeRoadLines(delimitations.roads).length} Tramos Totales
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleAddNewRoadLine}
                  className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all hover:scale-102"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>➕ Iniciar Nueva Línea</span>
                </button>
                <button
                  onClick={handleClearCurrentRoadLine}
                  disabled={activeNodes.length === 0}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-mono font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar Tramo {activeRoadLineIndex + 1}</span>
                </button>
              </div>

              {/* Selector pills in right panel */}
              <div className="flex flex-wrap gap-1 pt-1">
                {normalizeRoadLines(delimitations.roads).map((line, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => {
                      setActiveRoadLineIndex(lIdx);
                      setSelectedNodeIndex(null);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      lIdx === activeRoadLineIndex
                        ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Tramo {lIdx + 1} ({line.length} pts)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Brush / Drawing Tool Activation */}
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-slate-900 uppercase flex items-center space-x-1.5">
                <PenTool className="w-3.5 h-3.5 text-amber-700" />
                <span>Herramienta Pincel</span>
              </span>
              <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                toolMode === 'add' ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
              }`}>
                {toolMode === 'add' ? 'PINCEL ACTIVO' : 'INACTIVO'}
              </span>
            </div>

            <button
              onClick={() => setToolMode('add')}
              className={`w-full py-2 px-3 rounded-xl font-mono font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                toolMode === 'add'
                  ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-102'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>
                {activeZoneKey === 'roads' ? `🖌️ Pincel: Dibujar en Tramo ${activeRoadLineIndex + 1}` : `🖌️ Pincel: Dibujar ${activeZoneConfig.name}`}
              </span>
            </button>
            <p className="text-[10px] text-slate-600 font-mono leading-tight">
              {toolMode === 'add' 
                ? '🟢 Haz clic en el mapa satelital para ir trazando los puntos de este tramo.' 
                : 'Pulsa el botón superior para activar el pincel y añadir puntos con clics.'}
            </p>
          </div>

          {/* Big Copy Button (Pégamelas) */}
          <button
            onClick={handleCopyCodeToClipboard}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:scale-102 border border-slate-700"
          >
            <Copy className="w-4 h-4 text-amber-400" />
            <span>📋 Copiar Coordenadas (Pégamelas)</span>
          </button>

          {/* Toggle Paste Box */}
          <div className="pt-1">
            <button
              onClick={() => setShowPasteBox(!showPasteBox)}
              className="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 underline flex items-center space-x-1"
            >
              <span>{showPasteBox ? '▾ Ocultar importador' : '▸ 📥 Pegar Coordenadas Nuevas'}</span>
            </button>

            {showPasteBox && (
              <div className="mt-2 space-y-2 p-2.5 bg-slate-100 rounded-2xl border border-slate-200">
                <textarea
                  value={pastedCoordsText}
                  onChange={(e) => setPastedCoordsText(e.target.value)}
                  placeholder={activeZoneKey === 'roads' ? "Pega aquí el arreglo de vías: [[ [lat, lng], ... ], [ [lat, lng], ... ]]" : "Pega aquí el arreglo [[lat, lng], [lat, lng], ...]"}
                  className="w-full h-24 p-2 text-[10px] font-mono bg-white border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleApplyPastedCoords}
                  disabled={!pastedCoordsText.trim()}
                  className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aplicar al Mapa</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Coordinates Code Block */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600">
              <span>
                {activeZoneKey === 'roads' 
                  ? `Red Vial (${zoneStats.count} pts en ${normalizeRoadLines(delimitations.roads).length} tramos):` 
                  : `Arreglo de Puntos (${activeNodes.length}):`}
              </span>
              <span>{zoneStats.lengthKm} km</span>
            </div>

            <pre className="p-2.5 bg-slate-950 text-amber-300 rounded-2xl text-[10px] font-mono max-h-48 overflow-y-auto leading-relaxed border border-slate-800 shadow-inner select-all">
              {activeZoneKey === 'roads'
                ? JSON.stringify(normalizeRoadLines(delimitations.roads), null, 2)
                : (activeNodes.length === 0 
                  ? '// Sin puntos aún. Activa el pincel y haz clic en el mapa.' 
                  : JSON.stringify(activeNodes, null, 2))}
            </pre>
          </div>

        </div>
      )}

      {/* Floating On-Screen Quick Nudge Pad (top right below HUD) */}
      {showCalque && !showRightPanel && (
        <div className="absolute top-20 right-4 z-[400] glass-panel p-3 rounded-2xl shadow-2xl space-y-2 pointer-events-auto border border-amber-400/60 animate-fade-in text-slate-900 w-52">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800">
                Calibrar Plano
              </span>
            </div>
            <button
              onClick={() => setCalqueBounds(DEFAULT_CALQUE_BOUNDS)}
              className="text-[10px] font-mono font-bold text-amber-700 hover:underline"
            >
              Centrar
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span>Opacidad:</span>
              <span className="font-bold text-slate-900">{Math.round(calqueOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={calqueOpacity}
              onChange={(e) => setCalqueOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-center text-xs font-mono font-bold">
            <div />
            <button
              onClick={() => moveCalqueLat(0.0006)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Subir hacia el Norte"
            >
              ▲
            </button>
            <div />

            <button
              onClick={() => moveCalqueLng(-0.0006)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Correr a la Izquierda"
            >
              ◀
            </button>

            <button
              onClick={() => moveCalqueLat(-0.0006)}
              className="py-1.5 rounded-lg bg-white hover:bg-slate-200 shadow-xs active:scale-95 text-slate-800 font-bold"
              title="Bajar hacia el Sur"
            >
              ▼
            </button>

            <button
              onClick={() => moveCalqueLng(0.0006)}
              className="py-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-sm font-black ring-2 ring-amber-400 active:scale-95"
              title="Correr a la Derecha"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono font-bold">
            <button
              onClick={() => scaleCalque(1.02)}
              className="py-1 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-xs text-center text-slate-800"
            >
              + Agrandar
            </button>
            <button
              onClick={() => scaleCalque(0.98)}
              className="py-1 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-xs text-center text-slate-800"
            >
              - Reducir
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FLOATING BOTTOM: 5 STEP CARDS (VIEW MODE)                              */}
      {/* ========================================================================= */}
      {!isEditMode && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-w-6xl mx-auto pointer-events-auto">
            {FRAMEWORK_STEPS.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              const isFirstStepPrompt = currentStepIndex === null && idx === 0;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                    startZoneTraceAnimation(idx);
                  }}
                  className={`glass-card p-3 rounded-2xl text-left transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-terracotta-500 shadow-2xl ring-2 ring-terracotta-400/30 scale-105'
                      : isFirstStepPrompt
                        ? 'border-amber-400 shadow-xl ring-2 ring-amber-400/80 animate-pulse scale-102 bg-amber-50/20'
                        : 'border-white/80 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <div className={`p-1 rounded-lg transition-colors ${
                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                        idx === 1 ? 'bg-red-100 text-red-700' :
                        idx === 2 ? 'bg-rose-100 text-rose-700' :
                        idx === 3 ? 'bg-teal-100 text-teal-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {idx === 0 && <Compass className="w-3.5 h-3.5" />}
                        {idx === 1 && <ShieldAlert className="w-3.5 h-3.5" />}
                        {idx === 2 && <GraduationCap className="w-3.5 h-3.5" />}
                        {idx === 3 && <ShieldCheck className="w-3.5 h-3.5" />}
                        {idx === 4 && <Route className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isActive 
                          ? 'bg-terracotta-100 text-terracotta-800' 
                          : isFirstStepPrompt
                            ? 'bg-amber-100 text-amber-900 font-black'
                            : 'bg-slate-100/90 text-slate-600'
                      }`}>
                        PASO 0{step.step}
                      </span>
                    </div>
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
                <pre>{JSON.stringify(activeZoneKey === 'roads' ? normalizeRoadLines(delimitations.roads) : (delimitations[activeZoneKey] || []), null, 2)}</pre>
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
