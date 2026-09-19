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
    <section id="planos" className="py-24 bg-sand-50 dark:bg-deepsea-950 border-t border-sand-300/40 dark:border-deepsea-800/60 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-caribbean-500/10 text-caribbean-700 dark:text-caribbean-300 text-xs font-mono font-medium border border-caribbean-500/20">
              <Printer className="w-3.5 h-3.5" />
              <span>PLANIMETRÍA TÉCNICA &bull; EXPEDIENTE CAD</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-deepsea-950 dark:text-sand-100 tracking-tight leading-tight">
              Visor de Planimetría & Plotter Vectorial
            </h2>
            <p className="text-deepsea-900/70 dark:text-sand-300/70 text-base font-light max-w-2xl leading-relaxed">
              Exploración de planimetría técnica a escala con inspección de cotas, secciones constructivas e impresión directa a formato DIN vectorial.
            </p>
          </div>

          {/* Print / Plot Master Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-500 text-white font-mono text-xs font-semibold shadow-lg shadow-terracotta-600/20 self-start transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Plotear / Imprimir ({selectedBlueprint.scale})</span>
          </button>
        </div>

        {/* Blueprint Selector Tabs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {projectInfo.blueprints.map((bp) => {
            const isSelected = selectedBlueprint.id === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => {
                  setSelectedBlueprint(bp);
                  handleResetZoom();
                }}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white dark:bg-deepsea-900 border-terracotta-500 shadow-md ring-1 ring-terracotta-400/30'
                    : 'bg-white/60 dark:bg-deepsea-900/40 border-sand-300/60 dark:border-deepsea-800 hover:border-sand-400 dark:hover:border-deepsea-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-sand-200 dark:bg-deepsea-800 text-deepsea-700 dark:text-sand-300">
                    Escala {bp.scale}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />}
                </div>
                <h4 className="font-display font-bold text-sm text-deepsea-950 dark:text-sand-100 line-clamp-1">
                  {bp.title}
                </h4>
                <p className="text-xs text-deepsea-800/60 dark:text-sand-400 mt-1 line-clamp-2 font-light">
                  {bp.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive CAD Drawing Viewport Container */}
        <div className="rounded-3xl overflow-hidden border border-sand-300/80 dark:border-deepsea-800 shadow-2xl bg-white dark:bg-deepsea-950 transition-all duration-300">
          
          {/* Top Plotter Controls Bar */}
          <div className="p-4 bg-sand-100/80 dark:bg-deepsea-900/90 border-b border-sand-300/60 dark:border-deepsea-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Sheet Info */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white dark:bg-deepsea-800 text-terracotta-600 dark:text-terracotta-400 border border-sand-300/80 dark:border-deepsea-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-deepsea-950 dark:text-sand-100">
                  {selectedBlueprint.title}
                </h3>
                <p className="text-[10px] font-mono text-deepsea-700/60 dark:text-sand-400">
                  {selectedBlueprint.format} &bull; Escala {selectedBlueprint.scale} &bull; {selectedBlueprint.type}
                </p>
              </div>
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center space-x-1.5 bg-white dark:bg-deepsea-800 p-1.5 rounded-xl border border-sand-300/80 dark:border-deepsea-700 shadow-sm">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-deepsea-700 text-deepsea-800 dark:text-sand-200 transition-colors"
                title="Acercar (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono px-2 text-deepsea-700 dark:text-sand-300 min-w-[50px] text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-deepsea-700 text-deepsea-800 dark:text-sand-200 transition-colors"
                title="Alejar (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-sand-300 dark:bg-deepsea-700 mx-1" />

              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-deepsea-700 text-deepsea-800 dark:text-sand-200 transition-colors"
                title="Centrar / Restablecer vista"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showGrid ? 'bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400' : 'text-deepsea-400 dark:text-sand-500'
                }`}
                title="Mostrar/Ocultar cuadrícula CAD"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBlueprintTheme(!isBlueprintTheme)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  isBlueprintTheme ? 'bg-caribbean-600 text-white' : 'bg-sand-200 dark:bg-deepsea-700 text-deepsea-800 dark:text-sand-200'
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
                ? 'bg-[#061930] text-cyan-200' 
                : showGrid ? 'bg-sand-100/50 dark:bg-deepsea-950 bg-drafting-grid text-deepsea-950 dark:text-sand-100' : 'bg-sand-50 dark:bg-deepsea-950 text-deepsea-950 dark:text-sand-100'
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
                  : 'border-deepsea-950/30 dark:border-sand-100/30 bg-sand-50 dark:bg-deepsea-900 text-deepsea-950 dark:text-sand-100 shadow-black/10'
              }`}>

                {/* Top Title & North Arrow on Sheet */}
                <div className="flex items-center justify-between border-b pb-3 border-current/20">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                      TIERRABOMBA RESILIENTE &bull; CARTAGENA DE INDIAS
                    </span>
                    <h2 className="font-serif font-bold text-base tracking-tight">
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
                      <path d="M 40,250 Q 200,220 400,260 T 560,240" strokeWidth="2" strokeDasharray="6 4" stroke="#f43f5e" />
                      <text x="50" y="245" fontSize="8" fill="#f43f5e" stroke="none" fontFamily="monospace">LÍNEA DE RIESGO DE EROSIÓN COSTERA (COTA 0.00)</text>

                      {/* Safe Plateau Polygon (+22m) */}
                      <polygon points="120,40 480,30 520,210 90,200" strokeWidth="1.5" stroke="#10b981" strokeDasharray="4 2" fill="#10b981" fillOpacity="0.04" />
                      <text x="130" y="55" fontSize="8" fill="#10b981" stroke="none" fontFamily="monospace">MESETA SEGURA DE REUBICACIÓN (+22.00 M.S.N.M.)</text>

                      {/* 120 Housing Clusters / Manzanas de Vivienda */}
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
                      
                      {/* Cistern reservoir under school plaza */}
                      <rect x="360" y="135" width="95" height="25" strokeWidth="2" strokeDasharray="4 2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.2" />
                      <text x="365" y="152" fontSize="8" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">ALJIBE 450.000 L</text>
                      
                      <text x="345" y="60" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                        EQUIPAMIENTO EDUCATIVO
                      </text>
                    </svg>
                  )}

                  {/* Drawing Type 2: Educational Complex */}
                  {selectedBlueprint.svgType === 'educational' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* School perimeter */}
                      <rect x="60" y="30" width="480" height="210" strokeWidth="3" />
                      
                      {/* Classroom Wings */}
                      <rect x="80" y="50" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                      <text x="90" y="80" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">AULAS TEÓRICAS (1-3)</text>
                      <text x="90" y="95" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Ventilación Cruzada</text>

                      <rect x="80" y="145" width="130" height="80" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                      <text x="90" y="175" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">AULAS TEÓRICAS (4-6)</text>
                      <text x="90" y="190" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Capacidad: 180 alumnos</text>

                      {/* Central Civic Courtyard & Rain Harvesting Plaza */}
                      <rect x="230" y="50" width="140" height="175" strokeWidth="1.5" strokeDasharray="4 2" />
                      <text x="245" y="110" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">PATIO CÍVICO & AGORA</text>
                      <text x="245" y="125" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.8">Cubierta Captadora 1.850 m²</text>
                      
                      {/* Water Dispensary */}
                      <rect x="250" y="160" width="100" height="50" strokeWidth="2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.15" />
                      <text x="255" y="182" fontSize="8.5" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">DISPENSARIO HÍDRICO</text>
                      <text x="255" y="197" fontSize="7" fill="#0284c7" stroke="none" fontFamily="monospace">12 Puntos de Abastecimiento</text>

                      {/* Right Wing: Workshops & Canteen */}
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
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Base Module 54m² */}
                      <rect x="100" y="40" width="220" height="190" strokeWidth="3" />
                      <text x="110" y="60" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" fontWeight="bold">
                        MÓDULO BASE FAMILIAR (54.00 m²)
                      </text>

                      {/* Bedroom 1 */}
                      <rect x="115" y="75" width="90" height="70" strokeWidth="1.5" />
                      <text x="125" y="110" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">HAB. PRINCIPAL</text>
                      
                      {/* Bedroom 2 */}
                      <rect x="115" y="150" width="90" height="65" strokeWidth="1.5" />
                      <text x="125" y="185" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">HABITACIÓN 2</text>

                      {/* Living & Kitchen */}
                      <rect x="215" y="75" width="90" height="90" strokeWidth="1.5" />
                      <text x="225" y="115" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">ESTAR / COCINA</text>

                      {/* Dry / Low Flow Bathroom */}
                      <rect x="215" y="170" width="90" height="45" strokeWidth="1.5" />
                      <text x="225" y="195" fontSize="7.5" fill="currentColor" stroke="none" fontFamily="monospace">BAÑO SECO ECOL.</text>

                      {/* Progressive Expansion Module (to 86m²) */}
                      <rect x="335" y="40" width="160" height="190" strokeWidth="2" strokeDasharray="6 3" stroke="#d97736" fill="#d97736" fillOpacity="0.05" />
                      <text x="345" y="60" fontSize="9" fill="#d97736" stroke="none" fontFamily="monospace" fontWeight="bold">
                        ETAPA DE EXPANSIÓN (+32.00 m²)
                      </text>
                      <text x="345" y="110" fontSize="8" fill="#d97736" stroke="none" fontFamily="monospace">TALLER PRODUCTIVO / HAB. 3</text>
                      <text x="345" y="130" fontSize="7.5" fill="#d97736" stroke="none" fontFamily="monospace">Autoconstrucción Asistida</text>

                      {/* Household Water Tank 2.500L */}
                      <circle cx="415" cy="185" r="22" strokeWidth="2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.15" />
                      <text x="390" y="188" fontSize="7" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">ALJIBE 2.500L</text>
                    </svg>
                  )}

                  {/* Drawing Type 4: Section */}
                  {selectedBlueprint.svgType === 'section' && (
                    <svg viewBox="0 0 600 280" className="w-full h-56 stroke-current fill-none">
                      {/* Ground line */}
                      <line x1="40" y1="200" x2="560" y2="200" strokeWidth="2.5" />
                      <path d="M 40,200 L 40,220 L 560,220 L 560,200" fill="currentColor" fillOpacity="0.05" />

                      {/* Underground Cistern */}
                      <rect x="180" y="200" width="240" height="50" strokeWidth="2" stroke="#0284c7" fill="#0284c7" fillOpacity="0.25" />
                      <text x="210" y="230" fontSize="9.5" fill="#0284c7" stroke="none" fontFamily="monospace" fontWeight="bold">
                        ALJIBE COMUNITARIO 450.000 L (+20.00 M)
                      </text>

                      {/* School Columns */}
                      <line x1="100" y1="200" x2="100" y2="85" strokeWidth="4" />
                      <line x1="240" y1="200" x2="240" y2="105" strokeWidth="4" />
                      <line x1="360" y1="200" x2="360" y2="105" strokeWidth="4" />
                      <line x1="500" y1="200" x2="500" y2="85" strokeWidth="4" />

                      {/* Butterfly Roof */}
                      <polyline points="70,65 300,115 530,65" strokeWidth="4" />
                      
                      {/* Downspout */}
                      <line x1="300" y1="115" x2="300" y2="200" strokeWidth="3" strokeDasharray="4 2" stroke="#1e9fa8" />
                      <text x="310" y="155" fontSize="8.5" fill="#1e9fa8" stroke="none" fontFamily="monospace">
                        Bajante Ø 6" & Filtro First Flush
                      </text>

                      {/* Louver Screens */}
                      <line x1="100" y1="120" x2="100" y2="190" strokeWidth="2" strokeDasharray="2 2" stroke="#d97736" />
                      <line x1="500" y1="120" x2="500" y2="190" strokeWidth="2" strokeDasharray="2 2" stroke="#d97736" />
                      <text x="110" y="160" fontSize="7.5" fill="#d97736" stroke="none" fontFamily="monospace">Celosías BTC</text>

                      {/* Wind arrows */}
                      <path d="M 50,110 Q 150,130 250,95" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                      <text x="50" y="100" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">
                        Vientos Alisios NNE
                      </text>
                    </svg>
                  )}

                </div>

                {/* Sheet Titleblock (Rótulo de Plano Profesional) */}
                <div className="border-t pt-2 border-current/20 grid grid-cols-5 gap-2 text-[9px] font-mono opacity-90">
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">PROYECTO:</p>
                    <p className="truncate font-semibold">Tesis Tierrabomba</p>
                  </div>
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">CONTENIDO:</p>
                    <p className="truncate font-semibold">{selectedBlueprint.title}</p>
                  </div>
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">TESISTAS:</p>
                    <p className="truncate font-semibold">{projectInfo.author}</p>
                  </div>
                  <div className="border-r border-current/20 pr-2">
                    <p className="font-bold opacity-60">ESCALA / AÑO:</p>
                    <p className="font-semibold">{selectedBlueprint.scale} &bull; 2026</p>
                  </div>
                  <div>
                    <p className="font-bold opacity-60">PLANO Nº:</p>
                    <p className="font-semibold text-terracotta-500 dark:text-terracotta-400">ARQ-0{projectInfo.blueprints.indexOf(selectedBlueprint) + 1}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom floating helper */}
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="bg-deepsea-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-deepsea-800 text-[11px] text-sand-300 font-mono flex items-center space-x-2 shadow-lg">
                <span>🖱️ Arrastra con el ratón para desplazar el plano</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
