import React, { useState, useRef } from 'react';
import { 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Grid, 
  FileText, 
  Layers, 
  SlidersHorizontal,
  Compass,
  Check,
  Info,
  X
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function BlueprintPlotter({ onSelectModule }) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(projectInfo.blueprints[0]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isBlueprintTheme, setIsBlueprintTheme] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  // Pan Handlers
  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanPosition({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3.5, prev + 0.3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.6, prev - 0.3));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-100">
      
      {/* 1. FULLSCREEN CAD CANVAS (Pan & Zoom Viewport) */}
      <div 
        className={`absolute inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors ${
          isBlueprintTheme 
            ? 'bg-[#061930] text-cyan-200' 
            : showGrid 
              ? 'bg-[#f8fafc] text-slate-900 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]' 
              : 'bg-[#ffffff] text-slate-900'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Movable & Scalable Drawing Sheet Container */}
        <div
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          
          {/* Sheet Frame (Pliego DIN Vectorial) */}
          <div className={`w-[840px] h-[560px] rounded-xl border-2 relative p-7 flex flex-col justify-between shadow-2xl transition-all ${
            isBlueprintTheme 
              ? 'border-cyan-400/60 bg-[#061930]/95 shadow-cyan-950/60 text-cyan-300' 
              : 'border-slate-800/40 bg-white text-slate-900 shadow-slate-300/60'
          }`}>

            {/* Sheet Top Header: Title, North & Scale */}
            <div className="flex items-center justify-between border-b pb-3 border-current/25">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                  TIERRABOMBA RESILIENTE &bull; CARTAGENA DE INDIAS &bull; TESIS 2026
                </span>
                <h2 className="font-bold text-base tracking-tight">
                  {selectedBlueprint.title}
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono opacity-80">
                <div className="flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  <span>NORTE</span>
                </div>
                <span className="px-2 py-0.5 rounded border border-current font-bold text-[10px]">
                  {selectedBlueprint.scale}
                </span>
              </div>
            </div>

            {/* Center Vector CAD Drawing Rendering */}
            <div className="my-auto py-2 flex items-center justify-center">
              
              {/* Drawing Type 1: Masterplan */}
              {selectedBlueprint.svgType === 'masterplan' && (
                <svg viewBox="0 0 600 280" className="w-full h-64 stroke-current fill-none">
                  <path d="M 30,140 Q 150,60 300,100 T 570,120" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <path d="M 30,170 Q 160,90 300,130 T 570,150" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <path d="M 30,200 Q 170,120 300,160 T 570,180" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                  {/* Coastal erosion threshold */}
                  <path d="M 40,250 Q 200,220 400,260 T 560,240" strokeWidth="2" strokeDasharray="6 4" stroke="#ef4444" />
                  <text x="50" y="245" fontSize="8" fill="#ef4444" stroke="none" fontFamily="monospace">LÍNEA DE RIESGO DE EROSIÓN COSTERA (COTA 0.00)</text>

                  {/* Safe Plateau Polygon (+22m) */}
                  <polygon points="120,40 480,30 520,210 90,200" strokeWidth="1.5" stroke="#10b981" strokeDasharray="4 2" fill="#10b981" fillOpacity="0.04" />
                  <text x="130" y="55" fontSize="8" fill="#10b981" stroke="none" fontFamily="monospace">MESETA SEGURA DE REUBICACIÓN (+22.00 M.S.N.M.)</text>

                  {/* 120 Housing Clusters */}
                  {[0, 1, 2, 3].map((row) => (
                    <g key={row}>
                      {[0, 1, 2, 3, 4].map((col) => (
                        <rect 
                          key={col} 
                          x={130 + col * 32} 
                          y={70 + row * 28} 
                          width="24" 
                          height="18" 
                          strokeWidth="1.2" 
                          fill="currentColor" 
                          fillOpacity="0.06"
                        />
                      ))}
                    </g>
                  ))}
                  <text x="140" y="195" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                    120 VIVIENDAS RESILIENTES
                  </text>

                  {/* Central Educational Complex */}
                  <rect x="340" y="70" width="140" height="100" strokeWidth="2.5" fill="currentColor" fillOpacity="0.12" />
                  <rect x="355" y="85" width="40" height="40" strokeWidth="1.5" />
                  <rect x="415" y="85" width="40" height="40" strokeWidth="1.5" />
                  
                  {/* Cistern */}
                  <rect x="360" y="135" width="95" height="25" strokeWidth="2" strokeDasharray="4 2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.2" />
                  <text x="365" y="152" fontSize="8" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">ALJIBE 450.000 L</text>
                  
                  <text x="345" y="60" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                    EQUIPAMIENTO EDUCATIVO
                  </text>
                </svg>
              )}

              {/* Drawing Type 2: Educational Complex */}
              {selectedBlueprint.svgType === 'educational' && (
                <svg viewBox="0 0 600 280" className="w-full h-64 stroke-current fill-none">
                  <rect x="60" y="30" width="480" height="210" strokeWidth="3" />
                  <rect x="80" y="50" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <text x="90" y="80" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">AULAS TEÓRICAS (1-3)</text>
                  <text x="90" y="95" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Ventilación Cruzada</text>

                  <rect x="80" y="145" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <text x="90" y="175" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">AULAS TEÓRICAS (4-6)</text>
                  <text x="90" y="190" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Capacidad: 180 alumnos</text>

                  <rect x="230" y="50" width="140" height="175" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="245" y="110" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">PATIO CÍVICO & AGORA</text>
                  <text x="245" y="125" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Cubierta Captadora 1.850 m²</text>
                  
                  <rect x="250" y="160" width="100" height="50" strokeWidth="2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.15" />
                  <text x="255" y="182" fontSize="8.5" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">DISPENSARIO HÍDRICO</text>
                  <text x="255" y="197" fontSize="7" fill="#0284c7" stroke="none" fontFamily="monospace">12 Puntos de Abastecimiento</text>

                  <rect x="390" y="50" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <text x="400" y="80" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">TALLERES NÁUTICOS</text>
                  <text x="400" y="95" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Pesca & Carpintería</text>

                  <rect x="390" y="145" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <text x="400" y="175" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">COMEDOR & COCINA</text>
                  <text x="400" y="190" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Capacidad: 200 raciones</text>
                </svg>
              )}

              {/* Drawing Type 3: Housing Prototype */}
              {selectedBlueprint.svgType === 'housing' && (
                <svg viewBox="0 0 600 280" className="w-full h-64 stroke-current fill-none">
                  <rect x="100" y="40" width="220" height="190" strokeWidth="3" />
                  <text x="110" y="60" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                    MÓDULO BASE FAMILIAR (54.00 m²)
                  </text>

                  <rect x="115" y="75" width="90" height="70" strokeWidth="1.5" />
                  <text x="125" y="110" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">HAB. PRINCIPAL</text>
                  
                  <rect x="115" y="150" width="90" height="65" strokeWidth="1.5" />
                  <text x="125" y="185" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">HABITACIÓN 2</text>

                  <rect x="215" y="75" width="90" height="90" strokeWidth="1.5" />
                  <text x="225" y="120" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">ESTAR / COMEDOR</text>

                  <rect x="215" y="170" width="45" height="45" strokeWidth="1.5" />
                  <text x="220" y="195" fontSize="7" fill="currentColor" stroke="none" fontFamily="monospace">COCINA</text>

                  <rect x="265" y="170" width="40" height="45" strokeWidth="1.5" />
                  <text x="270" y="195" fontSize="7" fill="currentColor" stroke="none" fontFamily="monospace">BAÑO</text>

                  {/* Expansion Wing */}
                  <rect x="330" y="40" width="170" height="190" strokeWidth="2" strokeDasharray="5 3" />
                  <text x="345" y="60" fontSize="8.5" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                    FASE 2: CRECIMIENTO (+32 m²)
                  </text>
                  <text x="345" y="120" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">TALLER NÁUTICO O HAB. 3</text>

                  {/* Porch */}
                  <rect x="100" y="235" width="400" height="25" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
                  <text x="200" y="250" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">PÓRTICO DE SOMBRA Y TRABAJO (+0.60 m)</text>
                </svg>
              )}

              {/* Drawing Type 4: Bioclimatic Section */}
              {selectedBlueprint.svgType === 'section' && (
                <svg viewBox="0 0 600 280" className="w-full h-64 stroke-current fill-none">
                  <path d="M 40,240 Q 200,240 300,210 T 560,210" strokeWidth="2" />
                  <text x="50" y="255" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">TERRENO MESETA (+22.00m)</text>

                  {/* Educational Building Section */}
                  <polygon points="120,130 300,100 480,130 480,210 120,210" strokeWidth="2.5" />
                  <line x1="300" y1="100" x2="300" y2="210" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Butterfly Roof / Inverted Catchment */}
                  <polygon points="100,110 300,140 500,110 500,105 300,135 100,105" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                  <text x="230" y="90" fontSize="8.5" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                    MACRO-CUBIERTA CAPTADORA
                  </text>

                  {/* Wind flow arrows */}
                  <path d="M 40,110 Q 150,120 220,150" strokeWidth="1.8" stroke="#0d9488" markerEnd="url(#arrow)" />
                  <text x="50" y="100" fontSize="8" fill="#0d9488" stroke="none" fontFamily="monospace">VIENTOS ALISIOS N-NE</text>

                  {/* Underground Cistern */}
                  <rect x="220" y="220" width="160" height="45" strokeWidth="2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.2" />
                  <text x="240" y="245" fontSize="8.5" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">
                    ALJIBE TÉRMICO 450.000 L
                  </text>
                </svg>
              )}

            </div>

            {/* Bottom Sheet Stamp & Metadata */}
            <div className="flex items-center justify-between border-t pt-3 border-current/25 text-[10px] font-mono">
              <div className="flex items-center space-x-4">
                <span>FORMATO: <b>{selectedBlueprint.format}</b></span>
                <span>TIPO: <b>{selectedBlueprint.type}</b></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="opacity-75">AUTORAS: Alejandra Gómez & Ana Casas</span>
                <span className="font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  LAMINA 0{projectInfo.blueprints.indexOf(selectedBlueprint) + 1}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF CAD CANVAS                             */}
      {/* ========================================================================= */}

      {/* Top Floating Header & Blueprint Selector */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            06
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                PLANIMETRÍA CAD // PLOTTER VECTORIAL
              </span>
              <span className="text-[10px] font-mono text-terracotta-700 font-bold bg-terracotta-50 px-1.5 py-0.5 rounded border border-terracotta-200">
                Escala {selectedBlueprint.scale}
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-900 truncate">
              {selectedBlueprint.title}
            </h2>
          </div>
        </div>

        {/* Blueprint Selector Pills */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center">
          {projectInfo.blueprints.map((bp) => {
            const isSelected = selectedBlueprint.id === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => {
                  setSelectedBlueprint(bp);
                  handleResetZoom();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>{bp.scale}</span>
                <span className="hidden sm:inline ml-1">&bull; {bp.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Print / Plot Quick Action */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-mono font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Plotear / PDF</span>
          </button>
        </div>

      </div>

      {/* Floating Bottom Center: CAD Toolbar Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-2 text-xs font-mono text-slate-800">
          
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-2 min-w-[50px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Centrar Plano"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl transition-colors ${
              showGrid ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Cuadrícula CAD"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBlueprintTheme(!isBlueprintTheme)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              isBlueprintTheme ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isBlueprintTheme ? 'Cianotipo' : 'Papel'}
          </button>

          <button
            onClick={() => setShowSpecsModal(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Detalles de Lámina"
          >
            <Info className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE POPUP MODAL (Zero Text Walls on Screen)                     */}
      {/* ========================================================================= */}
      {showSpecsModal && (
        <div 
          onClick={() => setShowSpecsModal(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-slate-900 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  MEMORIA DE PLANO // ESCALA {selectedBlueprint.scale}
                </span>
                <h3 className="font-bold text-xl text-slate-900 mt-2">
                  {selectedBlueprint.title}
                </h3>
              </div>

              <button
                onClick={() => setShowSpecsModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {selectedBlueprint.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedBlueprint.tags.map((t, idx) => (
                <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-mono">
                {selectedBlueprint.format} &bull; Vectorial
              </span>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Enviar a Impresión</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
