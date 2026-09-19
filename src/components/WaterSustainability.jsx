import React, { useState } from 'react';
import { 
  Droplets, 
  Filter, 
  ShieldCheck, 
  Sun, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Maximize2, 
  ExternalLink, 
  Activity,
  X,
  Info,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function WaterSustainability({ onSelectModule }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedNodeModal, setSelectedNodeModal] = useState(null);

  const steps = projectInfo.waterSystem.steps;
  const currentStep = steps[activeStepIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-900">
      
      {/* 1. FULLSCREEN HYDRAULIC SCHEMATIC CANVAS */}
      <div className="absolute inset-0 w-full h-full bg-[#09182b] flex items-center justify-center p-6 select-none overflow-hidden">
        
        {/* Subtle Water Flow Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

        {/* Animated Water Waves Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-gradient-to-t from-blue-900/30 via-teal-900/10 to-transparent" />
        </div>

        {/* SVG Interactive Water Circuit Diagram */}
        <svg viewBox="0 0 1000 560" className="w-full max-w-5xl h-auto max-h-[500px] z-10 drop-shadow-2xl">
          
          {/* Connecting Animated Water Pipeline Paths */}
          <path 
            d="M 160,260 L 320,260 L 480,260 L 660,260 L 840,260" 
            stroke="#0284c7" 
            strokeWidth="6" 
            strokeDasharray="12 8" 
            className="animate-pulse"
            fill="none" 
          />

          <path 
            d="M 480,260 L 480,410 L 660,410 L 840,410" 
            stroke="#0d9488" 
            strokeWidth="4" 
            strokeDasharray="8 6" 
            fill="none" 
            opacity="0.7"
          />

          {/* Circuit Nodes (Clickable) */}
          
          {/* Node 1: Rain Catchment Roof */}
          <g 
            onClick={() => {
              setActiveStepIndex(0);
              setSelectedNodeModal(steps[0]);
            }}
            className="cursor-pointer group"
          >
            <circle 
              cx="160" 
              cy="260" 
              r={activeStepIndex === 0 ? "58" : "50"} 
              fill={activeStepIndex === 0 ? "#0284c7" : "#0f2744"} 
              stroke="#38bdf8" 
              strokeWidth={activeStepIndex === 0 ? "4" : "2"}
              className="transition-all duration-300 group-hover:scale-105" 
            />
            <g transform="translate(148, 230)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M16 14v6M8 14v6M12 16v6" />
            </g>
            <text x="160" y="278" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              1. CAPTACIÓN
            </text>
            <text x="160" y="292" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
              1.850 m²
            </text>
          </g>

          {/* Node 2: First-Flush Filter */}
          <g 
            onClick={() => {
              setActiveStepIndex(1);
              setSelectedNodeModal(steps[1]);
            }}
            className="cursor-pointer group"
          >
            <circle 
              cx="320" 
              cy="260" 
              r={activeStepIndex === 1 ? "58" : "50"} 
              fill={activeStepIndex === 1 ? "#0284c7" : "#0f2744"} 
              stroke="#38bdf8" 
              strokeWidth={activeStepIndex === 1 ? "4" : "2"}
              className="transition-all duration-300 group-hover:scale-105" 
            />
            <g transform="translate(308, 230)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </g>
            <text x="320" y="278" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              2. DESARENADOR
            </text>
            <text x="320" y="292" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
              99.5% Sedimentos
            </text>
          </g>

          {/* Node 3: Underground Cistern */}
          <g 
            onClick={() => {
              setActiveStepIndex(2);
              setSelectedNodeModal(steps[2]);
            }}
            className="cursor-pointer group"
          >
            <circle 
              cx="480" 
              cy="260" 
              r={activeStepIndex === 2 ? "68" : "60"} 
              fill={activeStepIndex === 2 ? "#0369a1" : "#0c4a6e"} 
              stroke="#0ea5e9" 
              strokeWidth={activeStepIndex === 2 ? "5" : "3"}
              className="transition-all duration-300 group-hover:scale-105" 
            />
            <g transform="translate(466, 226)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <line x1="3" y1="21" x2="21" y2="21" />
              <line x1="6" y1="21" x2="6" y2="10" />
              <line x1="18" y1="21" x2="18" y2="10" />
              <line x1="12" y1="21" x2="12" y2="10" />
              <polygon points="12 2 2 7 22 7" />
            </g>
            <text x="480" y="278" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">
              3. ALJIBE CENTRAL
            </text>
            <text x="480" y="294" textAnchor="middle" fill="#bae6fd" fontSize="10" fontFamily="monospace" fontWeight="bold">
              450.000 L
            </text>
          </g>

          {/* Node 4: Solar UV Purification */}
          <g 
            onClick={() => {
              setActiveStepIndex(3);
              setSelectedNodeModal(steps[3]);
            }}
            className="cursor-pointer group"
          >
            <circle 
              cx="660" 
              cy="260" 
              r={activeStepIndex === 3 ? "58" : "50"} 
              fill={activeStepIndex === 3 ? "#0f766e" : "#0f2744"} 
              stroke="#2dd4bf" 
              strokeWidth={activeStepIndex === 3 ? "4" : "2"}
              className="transition-all duration-300 group-hover:scale-105" 
            />
            <g transform="translate(648, 230)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </g>
            <text x="660" y="278" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              4. SOLAR UV
            </text>
            <text x="660" y="292" textAnchor="middle" fill="#99f6e4" fontSize="9" fontFamily="monospace">
              Res. 2115 Apta
            </text>
          </g>

          {/* Node 5: Community Dispensary & Bio-wetland */}
          <g 
            onClick={() => {
              setActiveStepIndex(4);
              setSelectedNodeModal(steps[4]);
            }}
            className="cursor-pointer group"
          >
            <circle 
              cx="840" 
              cy="260" 
              r={activeStepIndex === 4 ? "58" : "50"} 
              fill={activeStepIndex === 4 ? "#047857" : "#0f2744"} 
              stroke="#34d399" 
              strokeWidth={activeStepIndex === 4 ? "4" : "2"}
              className="transition-all duration-300 group-hover:scale-105" 
            />
            <g transform="translate(828, 230)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </g>
            <text x="840" y="278" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              5. HUMEDAL & HUERTO
            </text>
            <text x="840" y="292" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
              75% Recirculado
            </text>
          </g>

          {/* Bottom Loop to Agriculture */}
          <g 
            onClick={() => {
              setActiveStepIndex(4);
              setSelectedNodeModal(steps[4]);
            }}
            className="cursor-pointer"
          >
            <rect x="620" y="380" width="260" height="60" rx="16" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="750" y="408" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              RIEGO DE HUERTOS COMUNITARIOS
            </text>
            <text x="750" y="424" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
              Fitodepuración por Vetiver & Macrófitas
            </text>
          </g>

        </svg>

      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF CIRCUIT                                */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center space-x-3 max-w-lg text-white">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-slate-950 flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            07
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                INFRAESTRUCTURA HÍDRICA // AUTOSUFICIENCIA
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                450.000 L RESILIENTE
              </span>
            </div>
            <h2 className="font-bold text-sm text-white truncate">
              {projectInfo.waterSystem.title}
            </h2>
          </div>
        </div>

        {/* Telemetry Metrics Badges */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center space-x-4 text-white">
          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Capacidad Aljibe</span>
            <span className="font-bold text-sm text-blue-400 font-mono">450.000 L</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Autonomía Sequía</span>
            <span className="font-bold text-sm text-emerald-400 font-mono">90 Días</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Área Captación</span>
            <span className="font-bold text-sm text-amber-400 font-mono">8.330 m²</span>
          </div>
        </div>

        {/* Link to Lab 08 */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => onSelectModule && onSelectModule('simulations')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Simulador Sequía (Lab 08)</span>
          </button>
        </div>

      </div>

      {/* Floating Bottom Center: Interactive 5-Step Process Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
        <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((st, index) => {
            const isSelected = activeStepIndex === index;
            return (
              <button
                key={st.step}
                onClick={() => {
                  setActiveStepIndex(index);
                  setSelectedNodeModal(st);
                }}
                className={`flex-1 px-3 py-2 rounded-xl text-left transition-all text-xs font-mono ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold">0{st.step}</span>
                  <span className="truncate font-semibold">{st.name.split('(')[0]}</span>
                </div>
                <span className="text-[9px] opacity-75 truncate block mt-0.5">{st.capacity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE STAGE POPUP MODAL (Zero Text Walls on Screen)               */}
      {/* ========================================================================= */}
      {selectedNodeModal && (
        <div 
          onClick={() => setSelectedNodeModal(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  FASE 0{selectedNodeModal.step} // CICLO HÍDRICO CERRADO
                </span>
                <h3 className="font-bold text-xl text-slate-900 mt-2">
                  {selectedNodeModal.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNodeModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {selectedNodeModal.detail}
            </p>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-blue-800 block uppercase font-bold">Rendimiento Operativo</span>
                <span className="font-bold text-sm text-blue-950">{selectedNodeModal.capacity}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Continuar Explorando Circuito
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
