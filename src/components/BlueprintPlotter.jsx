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
  Check
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function BlueprintPlotter() {
  const [selectedBlueprint, setSelectedBlueprint] = useState(projectInfo.blueprints[0]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isBlueprintTheme, setIsBlueprintTheme] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

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
    <section id="planos" className="py-20 bg-white dark:bg-architectural-900 border-t border-architectural-200 dark:border-architectural-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400 text-xs font-semibold border border-caribbean-500/20">
              <Printer className="w-3.5 h-3.5" />
              <span>Módulo de Planimetría & Ploteo Técnico</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-architectural-900 dark:text-white tracking-tight">
              Visor de Planos & Exportación
            </h2>
            <p className="text-architectural-600 dark:text-architectural-400 text-sm max-w-2xl">
              Inspecciona los planos del proyecto en alta resolución. Haz zoom para examinar cotas y detalles constructivos, o pulsa en <b>Plotear Plano</b> para imprimirlo a escala vectorial.
            </p>
          </div>

          {/* Print / Plot Master Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-caribbean-600 to-caribbean-500 hover:from-caribbean-500 hover:to-caribbean-600 text-white font-semibold text-xs shadow-lg shadow-caribbean-500/20 self-start transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Plotear / Imprimir Plano ({selectedBlueprint.scale})</span>
          </button>
        </div>

        {/* Blueprint Selector Tabs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {projectInfo.blueprints.map((bp) => {
            const isSelected = selectedBlueprint.id === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => {
                  setSelectedBlueprint(bp);
                  handleResetZoom();
                }}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-caribbean-50/80 dark:bg-caribbean-950/40 border-caribbean-500 dark:border-caribbean-500 shadow-md ring-2 ring-caribbean-400/20'
                    : 'bg-architectural-50 dark:bg-architectural-950 border-architectural-200 dark:border-architectural-800 hover:border-architectural-300 dark:hover:border-architectural-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-architectural-200 dark:bg-architectural-800 text-architectural-700 dark:text-architectural-300">
                    Escala {bp.scale}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-caribbean-600 dark:text-caribbean-400" />}
                </div>
                <h4 className="font-display font-bold text-sm text-architectural-900 dark:text-white line-clamp-1">
                  {bp.title}
                </h4>
                <p className="text-[11px] text-architectural-500 dark:text-architectural-400 mt-1 line-clamp-2">
                  {bp.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive CAD Drawing Viewport Container */}
        <div className="rounded-3xl overflow-hidden border border-architectural-300 dark:border-architectural-800 shadow-2xl bg-white dark:bg-architectural-950">
          
          {/* Top Plotter Controls Bar */}
          <div className="p-4 bg-architectural-100 dark:bg-architectural-900/90 border-b border-architectural-200 dark:border-architectural-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Sheet Info */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white dark:bg-architectural-800 text-caribbean-600 dark:text-caribbean-400 border border-architectural-200 dark:border-architectural-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-architectural-900 dark:text-white">
                  {selectedBlueprint.title}
                </h3>
                <p className="text-[10px] font-mono text-architectural-500 dark:text-architectural-400">
                  {selectedBlueprint.format} &bull; Escala {selectedBlueprint.scale} &bull; {selectedBlueprint.type}
                </p>
              </div>
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center space-x-1.5 bg-white dark:bg-architectural-800 p-1 rounded-xl border border-architectural-200 dark:border-architectural-700 shadow-sm">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-architectural-100 dark:hover:bg-architectural-700 text-architectural-700 dark:text-architectural-200 transition-colors"
                title="Acercar (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono px-2 text-architectural-600 dark:text-architectural-300 min-w-[50px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-architectural-100 dark:hover:bg-architectural-700 text-architectural-700 dark:text-architectural-200 transition-colors"
                title="Alejar (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-architectural-200 dark:bg-architectural-700 mx-1" />

              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-architectural-100 dark:hover:bg-architectural-700 text-architectural-700 dark:text-architectural-200 transition-colors"
                title="Centrar / Restablecer vista"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showGrid ? 'bg-caribbean-50 dark:bg-caribbean-900/50 text-caribbean-600 dark:text-caribbean-400' : 'text-architectural-400'
                }`}
                title="Mostrar/Ocultar cuadrícula CAD"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBlueprintTheme(!isBlueprintTheme)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  isBlueprintTheme ? 'bg-blue-600 text-white' : 'bg-architectural-100 dark:bg-architectural-700 text-architectural-700 dark:text-architectural-200'
                }`}
                title="Alternar estilo Plano Cianotipo / Papel Blanco"
              >
                {isBlueprintTheme ? 'Cianotipo' : 'Papel'}
              </button>
            </div>

          </div>

          {/* Interactive Plot Viewport / SVG Canvas */}
          <div 
            className={`relative h-[560px] w-full overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors ${
              isBlueprintTheme 
                ? 'blueprint-mode text-cyan-200' 
                : showGrid ? 'bg-architectural-50 dark:bg-architectural-950 bg-cad-grid text-architectural-900 dark:text-architectural-100' : 'bg-white dark:bg-architectural-950 text-architectural-900 dark:text-architectural-100'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Movable & Scalable Drawing Container */}
            <div
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-full h-full flex items-center justify-center p-8"
            >
              
              {/* Sheet Frame (Pliego DIN A1) */}
              <div className={`w-[780px] h-[520px] rounded-lg border-2 relative p-6 flex flex-col justify-between shadow-2xl transition-all ${
                isBlueprintTheme 
                  ? 'border-cyan-400/50 bg-[#061930]/90 shadow-cyan-950/50 text-cyan-300' 
                  : 'border-architectural-900/30 dark:border-white/30 bg-white dark:bg-architectural-900 text-architectural-900 dark:text-white shadow-black/10'
              }`}>

                {/* Top Title & North Arrow on Sheet */}
                <div className="flex items-center justify-between border-b pb-3 border-current/20">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                      TIERRABOMBA RESILIENTE &bull; CARTAGENA DE INDIAS
                    </span>
                    <h2 className="font-display font-extrabold text-base tracking-tight">
                      {selectedBlueprint.title}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono opacity-80">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    <span>NORTE</span>
                  </div>
                </div>

                {/* Center Vector CAD Drawing Rendering */}
                <div className="my-auto py-2 flex items-center justify-center">
                  
                  {/* Drawing Type 1: Masterplan */}
                  {selectedBlueprint.svgType === 'masterplan' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Topographic contour lines */}
                      <path d="M 30,140 Q 150,60 300,100 T 570,120" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <path d="M 30,170 Q 160,90 300,130 T 570,150" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <path d="M 30,200 Q 170,120 300,160 T 570,180" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                      {/* Coastal erosion threshold */}
                      <path d="M 40,240 Q 200,210 400,250 T 560,230" strokeWidth="2" strokeDasharray="6 4" stroke="#f43f5e" />
                      <text x="50" y="235" fontSize="9" fill="#f43f5e" stroke="none" fontFamily="monospace">LÍNEA DE RIESGO DE EROSIÓN (COTA 0.00)</text>

                      {/* Safe Plateau Polygon (+22m) */}
                      <polygon points="180,60 420,50 460,190 150,180" strokeWidth="1.5" opacity="0.6" />
                      
                      {/* Relocated Building Pavilion */}
                      <rect x="220" y="80" width="160" height="80" strokeWidth="2.5" fill="currentColor" fillOpacity="0.08" />
                      <rect x="240" y="95" width="50" height="50" strokeWidth="1.5" />
                      <rect x="310" y="95" width="50" height="50" strokeWidth="1.5" />
                      
                      {/* Cistern reservoir under plaza */}
                      <rect x="250" y="180" width="100" height="30" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="260" y="198" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace">ALJIBE 450 m³</text>
                      
                      {/* Dimension lines */}
                      <line x1="220" y1="65" x2="380" y2="65" strokeWidth="1" />
                      <line x1="220" y1="60" x2="220" y2="70" strokeWidth="1" />
                      <line x1="380" y1="60" x2="380" y2="70" strokeWidth="1" />
                      <text x="280" y="60" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">48.00 m</text>
                    </svg>
                  )}

                  {/* Drawing Type 2: Floorplan */}
                  {selectedBlueprint.svgType === 'floorplan' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Exterior walls */}
                      <rect x="80" y="40" width="440" height="190" strokeWidth="3" />
                      
                      {/* Interior room divisions */}
                      <line x1="200" y1="40" x2="200" y2="230" strokeWidth="2" />
                      <line x1="360" y1="40" x2="360" y2="230" strokeWidth="2" />
                      <line x1="200" y1="135" x2="360" y2="135" strokeWidth="2" />

                      {/* Structural timber grid */}
                      {[80, 140, 200, 280, 360, 440, 520].map((x, i) => (
                        <g key={i}>
                          <rect x={x - 4} y="36" width="8" height="8" fill="currentColor" />
                          <rect x={x - 4} y="131" width="8" height="8" fill="currentColor" />
                          <rect x={x - 4} y="226" width="8" height="8" fill="currentColor" />
                        </g>
                      ))}

                      {/* Room labels */}
                      <text x="95" y="130" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">01. DISPENSARIO HÍDRICO</text>
                      <text x="95" y="145" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Capacidad: 12 grifos</text>

                      <text x="215" y="85" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">02. CENTRO DE SALUD</text>
                      <text x="215" y="180" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">03. AULA COMUNITARIA</text>

                      <text x="380" y="130" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">04. TALLER NÁUTICO</text>

                      {/* Louver wall markings */}
                      <line x1="80" y1="80" x2="80" y2="190" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="520" y1="80" x2="520" y2="190" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  )}

                  {/* Drawing Type 3: Section */}
                  {selectedBlueprint.svgType === 'section' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Ground line */}
                      <line x1="40" y1="200" x2="560" y2="200" strokeWidth="2.5" />
                      <path d="M 40,200 L 40,220 L 560,220 L 560,200" fill="currentColor" fillOpacity="0.05" />

                      {/* Underground Cistern */}
                      <rect x="180" y="200" width="240" height="50" strokeWidth="2" fill="#0284c7" fillOpacity="0.2" />
                      <text x="230" y="230" fontSize="10" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">
                        ALJIBE COLECTIVO 450 m³
                      </text>

                      {/* Columns */}
                      <line x1="120" y1="200" x2="120" y2="90" strokeWidth="4" />
                      <line x1="260" y1="200" x2="260" y2="110" strokeWidth="4" />
                      <line x1="340" y1="200" x2="340" y2="110" strokeWidth="4" />
                      <line x1="480" y1="200" x2="480" y2="90" strokeWidth="4" />

                      {/* Sloped Butterfly Rain Harvesting Roof */}
                      <polyline points="90,70 300,120 510,70" strokeWidth="4" />
                      
                      {/* Downspout (Bajante pluvial) */}
                      <line x1="300" y1="120" x2="300" y2="200" strokeWidth="3" strokeDasharray="4 2" stroke="#1e9fa8" />
                      <text x="310" y="160" fontSize="9" fill="#1e9fa8" stroke="none" fontFamily="monospace">
                        Bajante Ø 6"
                      </text>

                      {/* Wind arrows */}
                      <path d="M 60,110 Q 150,130 240,100" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <text x="60" y="100" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace">
                        Vientos Alisios NNE
                      </text>
                    </svg>
                  )}

                  {/* Drawing Type 4: Detail */}
                  {selectedBlueprint.svgType === 'detail' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Gutter profile */}
                      <path d="M 150,60 L 200,120 L 400,120 L 450,60" strokeWidth="3" />
                      
                      {/* Stainless filter mesh */}
                      <line x1="220" y1="100" x2="380" y2="100" strokeWidth="1.5" strokeDasharray="2 2" stroke="#10b981" />
                      <text x="240" y="90" fontSize="9" fill="#10b981" stroke="none" fontFamily="monospace">
                        MALLA EN ACERO INOXIDABLE 316
                      </text>

                      {/* Drainage pipe to first-flush */}
                      <rect x="280" y="120" width="40" height="90" strokeWidth="2" />
                      
                      {/* Water inflow arrows */}
                      <path d="M 170,80 L 210,110" strokeWidth="1.5" stroke="#0284c7" />
                      <path d="M 430,80 L 390,110" strokeWidth="1.5" stroke="#0284c7" />

                      {/* Labels and callouts */}
                      <text x="335" y="160" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace">
                        DESVIADOR DE PRIMERAS AGUAS (FIRST FLUSH)
                      </text>
                      <text x="260" y="240" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                        DETALLE ESCALA 1:20
                      </text>
                    </svg>
                  )}

                </div>

                {/* Sheet Titleblock (Rótulo de Plano Profesional) */}
                <div className="border-t pt-2 border-current/20 grid grid-cols-4 gap-2 text-[9px] font-mono opacity-85">
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">PROYECTO:</p>
                    <p className="truncate font-semibold">Tesis Tierrabomba</p>
                  </div>
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">CONTENIDO:</p>
                    <p className="truncate font-semibold">{selectedBlueprint.title}</p>
                  </div>
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">ESCALA & FECHA:</p>
                    <p className="font-semibold">{selectedBlueprint.scale} &bull; 2026</p>
                  </div>
                  <div>
                    <p className="font-bold opacity-60">PLANO Nº:</p>
                    <p className="font-semibold text-caribbean-500 dark:text-caribbean-400">ARQ-0{projectInfo.blueprints.indexOf(selectedBlueprint) + 1}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom floating helper */}
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="bg-architectural-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-architectural-800 text-[11px] text-architectural-300 font-mono flex items-center space-x-2">
                <span>🖱️ Arrastra para desplazar el plano</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
