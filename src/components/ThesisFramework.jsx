import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink
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

// Approximate polygon for Tierrabomba island
const TIERRABOMBA_ISLAND_POLYGON = [
  [10.3780, -75.5680],
  [10.3740, -75.5560],
  [10.3620, -75.5480],
  [10.3450, -75.5440],
  [10.3320, -75.5510],
  [10.3220, -75.5720],
  [10.3340, -75.5920],
  [10.3540, -75.6020],
  [10.3700, -75.5910],
  [10.3780, -75.5680]
];

// Critical western/northern coastal erosion strip
const EROSION_STRIP_POLYLINE = [
  [10.3750, -75.5880],
  [10.3680, -75.5960],
  [10.3580, -75.6010],
  [10.3450, -75.5960],
  [10.3350, -75.5880],
  [10.3280, -75.5780]
];

// Safe plateau polygon (+22m)
const SAFE_PLATEAU_POLYGON = [
  [10.3560, -75.5720],
  [10.3590, -75.5600],
  [10.3510, -75.5560],
  [10.3440, -75.5630],
  [10.3480, -75.5740]
];

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

export default function ThesisFramework({ onSelectModule }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'carto'

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const layersRef = useRef({
    islandLayer: null,
    erosionLayer: null,
    schoolMarker: null,
    masterplanLayer: null,
    plateauMarker: null
  });

  const { academicFramework } = projectInfo;
  const currentStep = FRAMEWORK_STEPS[currentStepIndex];

  // Initialize Leaflet Map with High-Resolution Satellite Aerial View
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: currentStep.center,
      zoom: currentStep.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Aerial Satellite Imagery without API key (Esri World Imagery)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri, Maxar'
    }).addTo(map);

    const labelsLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.85
    }).addTo(map);

    tileLayerRef.current = satLayer;
    labelsLayerRef.current = labelsLayer;

    // 1. Island Perimeter Polygon
    const islandLayer = L.polygon(TIERRABOMBA_ISLAND_POLYGON, {
      color: '#f97316',
      weight: 3.5,
      dashArray: '8, 8',
      fillColor: '#f97316',
      fillOpacity: 0.15
    }).addTo(map);

    islandLayer.on('click', () => {
      setActiveModal('problem');
    });

    // 2. Coastal Erosion Line
    const erosionLayer = L.polyline(EROSION_STRIP_POLYLINE, {
      color: '#ef4444',
      weight: 6,
      opacity: 0.9,
      dashArray: '10, 6'
    }).addTo(map);

    erosionLayer.on('click', () => {
      setActiveModal('justification');
    });

    // 3. Current School Vulnerable Marker
    const schoolIcon = L.divIcon({
      className: 'custom-school-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full bg-red-500/50 animate-ping"></div>
          <div class="w-10 h-10 rounded-2xl bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm">
            🏫
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 text-[10px] text-white font-mono font-bold shadow-xl border border-white/20">
            Colegio Actual (+1.5m)
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const schoolMarker = L.marker([10.362, -75.581], { icon: schoolIcon }).addTo(map);
    schoolMarker.on('click', () => {
      setActiveModal('objectives');
    });

    // 4. Safe Plateau Polygon (+22m)
    const masterplanLayer = L.polygon(SAFE_PLATEAU_POLYGON, {
      color: '#0d9488',
      weight: 3.5,
      fillColor: '#0d9488',
      fillOpacity: 0.3
    }).addTo(map);

    masterplanLayer.on('click', () => {
      setActiveModal('solution');
    });

    const plateauIcon = L.divIcon({
      className: 'custom-plateau-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full bg-teal-400/50 animate-pulse"></div>
          <div class="w-10 h-10 rounded-2xl bg-teal-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm">
            ✨
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-teal-950/95 text-[10px] text-teal-300 font-mono font-bold shadow-xl border border-white/20">
            Meseta Segura +22m
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const plateauMarker = L.marker([10.352, -75.565], { icon: plateauIcon }).addTo(map);
    plateauMarker.on('click', () => {
      setActiveModal('solution');
    });

    layersRef.current = {
      islandLayer,
      erosionLayer,
      schoolMarker,
      masterplanLayer,
      plateauMarker
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view on step change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo(currentStep.center, currentStep.zoom, {
      animate: true,
      duration: 1.2
    });

    const { islandLayer, erosionLayer, masterplanLayer } = layersRef.current;

    if (islandLayer) {
      islandLayer.setStyle({
        fillOpacity: currentStep.step === 1 ? 0.35 : 0.1,
        weight: currentStep.step === 1 ? 5 : 2
      });
    }

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
  }, [currentStepIndex]);

  // Autoplay sequence timer
  useEffect(() => {
    if (!isPlaying) return;

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
  }, [isPlaying]);

  // Layer type switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
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
      
      {/* 1. FULLSCREEN SATELLITE MAP */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF SATELLITE MAP                          */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-terracotta-600 text-white flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            01
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                MARCO DE TESIS
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Paso 0{currentStep.step} de 04
              </span>
            </div>
            <h2 className="font-serif font-bold text-sm text-slate-900 truncate">
              {currentStep.targetName}
            </h2>
          </div>
        </div>

        {/* Playback Controls & Direct Modal Open CTA */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-terracotta-600 hover:bg-terracotta-500 text-white shadow-sm'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Secuencia'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Reiniciar al Paso 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveModal(currentStep.modalType)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Abrir Ficha Pop-up</span>
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

      {/* Floating Bottom: 4 Step Selector Cards directly ON TOP of the Satellite Map */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-5xl mx-auto pointer-events-auto">
          {FRAMEWORK_STEPS.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between backdrop-blur-md ${
                  isActive
                    ? 'bg-white/95 border-terracotta-500 shadow-2xl ring-2 ring-terracotta-400/30 scale-105'
                    : 'bg-white/90 hover:bg-white border-slate-200/90 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-terracotta-100 text-terracotta-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    PASO 0{step.step}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-terracotta-500 animate-ping' : 'bg-slate-300'}`} />
                </div>
                <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                  {step.title}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {step.btnLabel}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom-Left Hint Pill */}
      <div className="absolute bottom-20 left-4 z-[400] hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-mono backdrop-blur-md shadow-lg border border-white/20 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{currentStep.hint}</span>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL POP-UPS                                                   */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-scale-up"
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
