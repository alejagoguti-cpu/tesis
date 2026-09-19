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
    btnLabel: "Ver Planteamiento del Problema",
    description: "Inspección perimetral de la isla, contexto insular caribeño y diagnóstico de aislamiento.",
    hint: "Haz clic sobre la isla delimitada para abrir el Planteamiento del Problema."
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
    btnLabel: "Ver Justificación de la Tesis",
    description: "Simulación de avance del nivel del mar y socavación marina de viviendas costeras.",
    hint: "Haz clic sobre la franja roja de erosión para abrir la Justificación de la Propuesta."
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
    btnLabel: "Ver Objetivos de la Investigación",
    description: "Equipamiento educativo precario en zona inundable sin saneamiento ni reserva de agua.",
    hint: "Haz clic sobre el marcador del colegio actual para abrir los Objetivos (OE-01 a OE-04)."
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
    btnLabel: "Ver Criterios del Masterplan",
    description: "Reubicación integral: 120 viviendas, colegio bioclimático y soberanía hídrica 450kL.",
    hint: "Haz clic sobre el polígono dorado de la meseta para abrir los Criterios del Masterplan."
  }
];

export default function ThesisFramework({ onSelectModule }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'problem' | 'justification' | 'objectives' | 'solution' | null
  const [activeObjectiveTab, setActiveObjectiveTab] = useState('general');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    islandLayer: null,
    erosionLayer: null,
    schoolMarker: null,
    masterplanLayer: null,
    plateauMarker: null
  });

  const { academicFramework } = projectInfo;
  const currentStep = FRAMEWORK_STEPS[currentStepIndex];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: currentStep.center,
      zoom: currentStep.zoom,
      zoomControl: true,
      attributionControl: false
    });

    // High quality light tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // 1. Island Perimeter Polygon (Animated dashed border)
    const islandLayer = L.polygon(TIERRABOMBA_ISLAND_POLYGON, {
      color: '#c86d51',
      weight: 3,
      dashArray: '8, 8',
      fillColor: '#c86d51',
      fillOpacity: 0.12
    }).addTo(map);

    islandLayer.on('click', () => {
      setActiveModal('problem');
    });

    // 2. Coastal Erosion Line & Buffer
    const erosionLayer = L.polyline(EROSION_STRIP_POLYLINE, {
      color: '#dc2626',
      weight: 6,
      opacity: 0.85,
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
          <div class="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>
          <div class="w-9 h-9 rounded-2xl bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs">
            🏫
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 text-[10px] text-white font-mono shadow-md">
            Colegio Actual (+1.5m)
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const schoolMarker = L.marker([10.362, -75.581], { icon: schoolIcon }).addTo(map);
    schoolMarker.on('click', () => {
      setActiveModal('objectives');
    });

    // 4. Safe Plateau Polygon (+22m)
    const masterplanLayer = L.polygon(SAFE_PLATEAU_POLYGON, {
      color: '#0d9488',
      weight: 3,
      fillColor: '#0d9488',
      fillOpacity: 0.25
    }).addTo(map);

    masterplanLayer.on('click', () => {
      setActiveModal('solution');
    });

    const plateauIcon = L.divIcon({
      className: 'custom-plateau-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full bg-teal-500/30 animate-pulse"></div>
          <div class="w-10 h-10 rounded-2xl bg-teal-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm">
            ✨
          </div>
          <div class="absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-teal-950 text-[10px] text-teal-300 font-mono font-bold shadow-md">
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

  // Update map view and style emphasis on step change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo(currentStep.center, currentStep.zoom, {
      animate: true,
      duration: 1.2
    });

    // Adjust layer styling depending on active step
    const { islandLayer, erosionLayer, masterplanLayer } = layersRef.current;

    if (islandLayer) {
      islandLayer.setStyle({
        fillOpacity: currentStep.step === 1 ? 0.25 : 0.08,
        weight: currentStep.step === 1 ? 4 : 2
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
        fillOpacity: currentStep.step === 4 ? 0.35 : 0.15,
        weight: currentStep.step === 4 ? 4 : 2
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
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Chapter 01 Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-terracotta-600 uppercase tracking-widest">
              Capítulo 01 // Fundamentación & Metodología
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Marco de Tesis: Narrativa Territorial Interactiva
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl">
            Exploración cartográfica paso a paso del diagnóstico insular, justificación de reubicación y formulación de objetivos proyectuales (OE-01 a OE-04).
          </p>
        </div>

        {/* Playback Controls & Direct Modal Triggers */}
        <div className="flex items-center flex-wrap gap-2.5 self-start md:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-terracotta-600 hover:bg-terracotta-500 text-white shadow-sm'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pausar Recorrido' : 'Reproducir Secuencia'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            title="Reiniciar al Paso 1"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Steps Interactive Selector Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FRAMEWORK_STEPS.map((step, idx) => {
          const isActive = currentStepIndex === idx;
          return (
            <div
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-terracotta-500 shadow-md ring-2 ring-terracotta-400/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  PASO 0{step.step}
                </span>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-terracotta-500 animate-ping' : 'bg-slate-300'}`} />
              </div>

              <div className="space-y-1">
                <h4 className={`text-xs font-bold font-serif leading-snug ${isActive ? 'text-terracotta-900' : 'text-slate-800'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">
                  {step.targetName}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentStepIndex(idx);
                  setActiveModal(step.modalType);
                }}
                className="mt-3 w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-terracotta-50 hover:text-terracotta-700 text-slate-700 text-[10px] font-mono font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>Abrir Pop-up</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Top Overlay Banner with Interactive Trigger */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
                {currentStep.badge}
              </span>
              <h3 className="font-serif font-bold text-sm text-slate-900">
                {currentStep.targetName}
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              {currentStep.description}
            </p>
          </div>

          <button
            onClick={() => setActiveModal(currentStep.modalType)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-bold shadow-md shadow-terracotta-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{currentStep.btnLabel}</span>
          </button>
        </div>

        {/* Floating Bottom Hint Badge */}
        <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-mono backdrop-blur-md shadow-md border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentStep.hint}</span>
        </div>

        {/* Leaflet Container */}
        <div ref={mapRef} className="w-full h-[540px] z-0" />
      </div>

      {/* ========================================================================= */}
      {/* RICH DETAIL MODAL POP-UPS                                                */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-scale-up"
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
                    {activeModal === 'objectives' && 'Objetivos de la Investigación (General & OE-01 a 04)'}
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

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">

              {/* 1. PROBLEM STATEMENT CONTENT */}
              {activeModal === 'problem' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200 text-red-900 text-xs sm:text-sm leading-relaxed space-y-2">
                    <div className="flex items-center space-x-2 font-bold font-mono text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Diagnóstico de Vulnerabilidad Extrema</span>
                    </div>
                    <p className="text-slate-800 font-sans leading-relaxed text-justify">
                      {academicFramework.justification.problemStatement}
                    </p>
                  </div>

                  {/* 4 Critical Indicators Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Población Total</span>
                      <h4 className="font-serif font-bold text-xl text-slate-900 mt-1">4.300 hab.</h4>
                      <p className="text-[11px] text-slate-600">Comunidad afrodescendiente</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Acueducto Formal</span>
                      <h4 className="font-serif font-bold text-xl text-red-600 mt-1">0% Red</h4>
                      <p className="text-[11px] text-slate-600">Dependencia de carrotanques</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Erosión Costera</span>
                      <h4 className="font-serif font-bold text-xl text-red-600 mt-1">1.8 m/año</h4>
                      <p className="text-[11px] text-slate-600">Retroceso de playa activa</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Viviendas en Riesgo</span>
                      <h4 className="font-serif font-bold text-xl text-terracotta-600 mt-1">120 Casas</h4>
                      <p className="text-[11px] text-slate-600">Socavación de cimientos</p>
                    </div>
                  </div>

                  {/* Community Quote */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-start space-x-3.5 shadow-lg">
                    <Quote className="w-5 h-5 text-terracotta-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <p className="font-serif italic text-sand-200">
                        "{projectInfo.communityVoice.quote}"
                      </p>
                      <p className="font-mono text-[10px] text-sand-400">
                        — {projectInfo.communityVoice.author} ({projectInfo.communityVoice.context})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. JUSTIFICATION CONTENT */}
              {activeModal === 'justification' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-terracotta-50/80 border border-terracotta-200 text-slate-800 space-y-3">
                    <h4 className="font-serif font-bold text-base text-terracotta-900">
                      Fundamentación Científica & Arquitectónica
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
                      {academicFramework.justification.academicJustification}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-terracotta-600 uppercase">Marco Normativo</span>
                      <h5 className="font-bold text-xs text-slate-900">Ley 1523 de 2012</h5>
                      <p className="text-[11px] text-slate-600">Gestión del riesgo de desastres y reasentamiento preventivo obligado.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Viabilidad Geológica</span>
                      <h5 className="font-bold text-xs text-slate-900">Meseta +22m</h5>
                      <p className="text-[11px] text-slate-600">Formación calcárea sin susceptibilidad a licuefacción ni inundación marina.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Soberanía Hídrica</span>
                      <h5 className="font-bold text-xs text-slate-900">Aljibe de 450kL</h5>
                      <p className="text-[11px] text-slate-600">90 días de autonomía hídrica en sequía mediante macro-captación pluvial.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. OBJECTIVES CONTENT */}
              {activeModal === 'objectives' && (
                <div className="space-y-6">
                  
                  {/* General Objective Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-terracotta-800 to-slate-900 text-white shadow-md space-y-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-sand-200">
                      <Target className="w-3.5 h-3.5 text-terracotta-300" />
                      <span>Objetivo General de la Tesis</span>
                    </span>
                    <h4 className="font-serif italic text-base sm:text-lg text-white leading-snug">
                      "{academicFramework.generalObjective}"
                    </h4>
                  </div>

                  {/* 4 Specific Objectives Tabs/Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-slate-900">
                        Objetivos Específicos de la Investigación
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">OE-01 a OE-04</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {academicFramework.specificObjectives.map((obj) => (
                        <div
                          key={obj.code}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-terracotta-400 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-lg bg-terracotta-100 text-terracotta-800 text-[10px] font-mono font-bold">
                              {obj.code}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <h5 className="font-serif font-bold text-xs text-slate-900 leading-tight">
                            {obj.title}
                          </h5>
                          <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                            {obj.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SOLUTION & MASTERPLAN CONTENT */}
              {activeModal === 'solution' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-2">
                    <div className="flex items-center space-x-2 font-bold font-mono text-teal-800 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Modelo de Hábitat Resiliente en Suelo Firme</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                      El plan maestro organiza la vida comunitaria en torno a tres ejes fundamentales: reubicación de las 120 familias en riesgo, consolidación del equipamiento educativo-náutico y sistema de macro-aljibe pluvial para cortar la dependencia de Cartagena.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                      <Home className="w-5 h-5 text-terracotta-600" />
                      <h5 className="font-bold text-xs text-slate-900">120 Viviendas VIS</h5>
                      <p className="text-[11px] text-slate-600">Tipologías modulares de 54 a 86 m² sobre pilotes de madera (+0.60m).</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                      <GraduationCap className="w-5 h-5 text-teal-600" />
                      <h5 className="font-bold text-xs text-slate-900">Colegio Bioclimático</h5>
                      <p className="text-[11px] text-slate-600">Capacidad para 350 alumnos con talleres de carpintería y pesca ribereña.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      <h5 className="font-bold text-xs text-slate-900">450.000 L de Aljibe</h5>
                      <p className="text-[11px] text-slate-600">Cubierta invertida de 1.850 m² con filtrado UV y 90 días de reserva.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                Alejandra Gómez & Ana Casas &bull; Tesis de Arquitectura 2026
              </span>

              <div className="flex items-center space-x-2">
                {activeModal === 'problem' && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      if (onSelectModule) onSelectModule('gis');
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-bold shadow-sm transition-colors"
                  >
                    <span>Explorar SIG Diagnóstico</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeModal === 'justification' && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      if (onSelectModule) onSelectModule('simulations');
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-sm transition-colors"
                  >
                    <span>Ver Simulador de Erosión</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeModal === 'objectives' && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      if (onSelectModule) onSelectModule('programs');
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold shadow-sm transition-colors"
                  >
                    <span>Ver Programa Arquitectónico</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeModal === 'solution' && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      if (onSelectModule) onSelectModule('3dviewer');
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-sm transition-colors"
                  >
                    <span>Explorar Visor 3D</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
