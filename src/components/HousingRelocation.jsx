import React, { useState } from 'react';
import { 
  Home, 
  GraduationCap, 
  Layers, 
  Users, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TreePine, 
  Sparkles, 
  Droplet, 
  Box, 
  Printer, 
  X,
  Compass,
  Wind,
  Sun,
  Eye
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export const HOUSING_PLAN_SPACES = [
  {
    id: "porche",
    name: "Porche Bioclimático & Acceso Palafítico (+0.60m)",
    area: "9.6 m²",
    coords: { x: 12, y: 65, w: 76, h: 22 },
    color: "#c86d51",
    tag: "Zona Social Exterior",
    summary: "Espacio de transición comunitaria con sombra permanente de alero de 2.50m. Permite la vida hacia la calle y actúa como colchón térmico.",
    metrics: [
      { label: "Cota de Piso", value: "+0.60 m" },
      { label: "Sombra Solar", value: "100% Pasiva" },
      { label: "Material", value: "Madera Teca / Abarco" },
      { label: "Ventilación", value: "Brisa Franca N-NE" }
    ],
    details: "El porche elevado replica la tradición arquitectónica caribeña, promoviendo la cohesión vecinal y protegiendo el interior de las lluvias torrenciales y escorrentías."
  },
  {
    id: "estancia",
    name: "Estancia Central & Comedor Transpirable",
    area: "18.4 m²",
    coords: { x: 12, y: 35, w: 46, h: 28 },
    color: "#0d9488",
    tag: "Núcleo de Convivencia",
    summary: "Espacio diáfano con altura libre de 3.20m y celosías de arcilla BTC en ambas fachadas para generar convección térmica continua.",
    metrics: [
      { label: "Altura Libre", value: "3.20 m" },
      { label: "Ventilación Cruzada", value: "0.85 m/s" },
      { label: "Envolvente", value: "Celosía Cerámica BTC" },
      { label: "Temperatura Int.", value: "28 °C (-4.5°C)" }
    ],
    details: "El aire fresco ingresa a baja cota desde el barlovento marítimo y expulsa el aire caliente a través de la claraboya cenital superior por efecto chimenea."
  },
  {
    id: "cocina",
    name: "Cocina & Conexión Hidráulica",
    area: "7.8 m²",
    coords: { x: 60, y: 35, w: 28, h: 28 },
    color: "#0284c7",
    tag: "Servicio Eficiente",
    summary: "Área húmeda conectada directamente al aljibe individual de 2.500L mediante bombeo solar y trampa de grasas con bio-filtro de grava.",
    metrics: [
      { label: "Reserva Dedicada", value: "2.500 Litros" },
      { label: "Grifería", value: "Bajo Consumo 4L/m" },
      { label: "Tratamiento Gris", value: "Bio-jardinera" },
      { label: "Energía", value: "Solar 12V" }
    ],
    details: "Dispone de mesones de ferrocemento impermeabilizado y captación directa de agua de lluvia desde la bajante de la cubierta inclinada."
  },
  {
    id: "habitacion1",
    name: "Dormitorio Principal Modular",
    area: "11.5 m²",
    coords: { x: 12, y: 10, w: 36, h: 23 },
    color: "#6366f1",
    tag: "Privado // Reposo",
    summary: "Habitación protegida de radiación solar directa con postigos de persiana de madera para control de privacidad y flujo de aire nocturno.",
    metrics: [
      { label: "Capacidad", value: "2 - 3 Personas" },
      { label: "Iluminación", value: "Luz Difusa 400 lux" },
      { label: "Aislamiento", value: "Panel Machihembrado" },
      { label: "Renovaciones", value: "30 vol/h" }
    ],
    details: "Orientada hacia la fachada más fresca con deflectores acústicos de madera que amortiguan el sonido de la lluvia sobre la cubierta."
  },
  {
    id: "habitacion2",
    name: "Módulo de Crecimiento Progresivo",
    area: "9.2 m²",
    coords: { x: 50, y: 10, w: 38, h: 23 },
    color: "#d97706",
    tag: "Expansión Modular",
    summary: "Bahía estructural lista para habilitar un segundo o tercer dormitorio sin alterar la cimentación ni las vigas maestras de madera.",
    metrics: [
      { label: "Modulación", value: "3.60 x 3.60 m" },
      { label: "Crecimiento", value: "+1 a +2 Dormitorios" },
      { label: "Montaje", value: "En Seco / 7 días" },
      { label: "Costo Incremental", value: "Mínimo" }
    ],
    details: "Permite que la familia amplíe su vivienda de 54 m² hasta 86 m² a medida que crecen sus necesidades o su capacidad económica."
  }
];

export const SCHOOL_PLAN_SPACES = [
  {
    id: "aulas",
    name: "Pabellón de 6 Aulas Bioclimáticas (350 Alumnos)",
    area: "480 m²",
    coords: { x: 10, y: 15, w: 42, h: 45 },
    color: "#0d9488",
    tag: "Pedagogía Pasiva",
    summary: "Aulas modulares con doble orientación, celosías transpirables de arcilla y confort acústico para clases diurnas.",
    metrics: [
      { label: "Capacidad", value: "350 Estudiantes" },
      { label: "Aulas", value: "6 Módulos (35 est/aula)" },
      { label: "Ventilación", value: "100% Natural" },
      { label: "Iluminación", value: "Cenital Indirecta" }
    ],
    details: "Eliminan la necesidad de ventiladores mecánicos mediante techos altos de 4.0m y aperturas perimetrales continuas."
  },
  {
    id: "agora",
    name: "Ágora Cívica & Plaza Central Cubierta",
    area: "360 m²",
    coords: { x: 54, y: 25, w: 38, h: 35 },
    color: "#c86d51",
    tag: "Encuentro Comunitario",
    summary: "Espacio cívico sombreado donde convergen estudiantes y comunidad para asambleas, eventos culturales y actividades cívicas.",
    metrics: [
      { label: "Capacidad Fin de Semana", value: "1.200 Personas" },
      { label: "Sombra", value: "100% Cobertura" },
      { label: "Piso", value: "Piedra Calcárea Local" },
      { label: "Polivalencia", value: "Teatro / Asambleas" }
    ],
    details: "Articula el colegio con el dispensario hídrico, convirtiendo el equipamiento en el corazón cívico de la meseta +22m."
  },
  {
    id: "talleres",
    name: "Talleres de Oficios Pesqueros & Carpintería Náutica",
    area: "240 m²",
    coords: { x: 10, y: 64, w: 42, h: 26 },
    color: "#d97706",
    tag: "Formación Técnica",
    summary: "Talleres prácticos de reparación de redes, mantenimiento de motores fuera de borda y carpintería de ribera tradicional.",
    metrics: [
      { label: "Oficios", value: "Pesca & Náutica" },
      { label: "Capacidad", value: "60 Alumnos/Turno" },
      { label: "Seguridad", value: "Extracción Natural" },
      { label: "Equipamiento", value: "Bancos de Trabajo" }
    ],
    details: "Preserva los saberes ancestrales de la comunidad afrodescendiente de Tierrabomba con certificación técnica."
  },
  {
    id: "dispensario",
    name: "Dispensario Hídrico Comunal (12 Tomas / 450.000 L)",
    area: "180 m²",
    coords: { x: 54, y: 64, w: 38, h: 26 },
    color: "#0284c7",
    tag: "Soberanía Hídrica",
    summary: "Punto de distribución de agua potable tratada con 12 puestos de llenado rápido conectados al aljibe subterráneo.",
    metrics: [
      { label: "Capacidad Cisterna", value: "450.000 Litros" },
      { label: "Puntos de Toma", value: "12 Grifos Rápidos" },
      { label: "Caudal", value: "120 L/minuto" },
      { label: "Desinfección", value: "Radiación Solar UV" }
    ],
    details: "Garantiza el abastecimiento soberano y gratuito de agua para las 120 familias reubicadas, eliminando la compra a barcazas."
  }
];

export default function HousingRelocation({ onSelectModule }) {
  const [selectedPlanType, setSelectedPlanType] = useState('vivienda'); // 'vivienda' | 'colegio'
  const [activeSpace, setActiveSpace] = useState(null);
  const [hoveredSpace, setHoveredSpace] = useState(null);

  const spaces = selectedPlanType === 'vivienda' ? HOUSING_PLAN_SPACES : SCHOOL_PLAN_SPACES;

  return (
    <div className="space-y-6 py-2 animate-fade-in">
      
      {/* 1. PLAN VIEWPORT CONTAINER */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Floating Top Header Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-700">
                03 // Planimetría Arquitectónica & Distribución Espacial
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {selectedPlanType === 'vivienda' ? 'Escala 1:50' : 'Escala 1:100'}
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              {selectedPlanType === 'vivienda' 
                ? 'Planta Prototipo Vivienda Resiliente Palafítica (54m² - 86m²)' 
                : 'Planta Conjunto Educativo, Cívico & Dispensario Hídrico (1.850 m²)'}
            </h3>
          </div>

          {/* Module Switcher Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 self-start md:self-center">
            <button
              onClick={() => {
                setSelectedPlanType('vivienda');
                setActiveSpace(null);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedPlanType === 'vivienda'
                  ? 'bg-terracotta-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>1. Vivienda (120 Familias)</span>
            </button>

            <button
              onClick={() => {
                setSelectedPlanType('colegio');
                setActiveSpace(null);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedPlanType === 'colegio'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>2. Colegio (350 Alumnos)</span>
            </button>
          </div>
        </div>

        {/* Interactive SVG Floor Plan Drawing Canvas */}
        <div className="w-full h-[520px] bg-[#fdfdfd] relative flex items-center justify-center pt-16 pb-4 px-4 select-none">
          
          {/* Subtle Drafting Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

          {/* Structural Axes / Dimension Guides */}
          <div className="absolute top-24 left-6 text-[10px] font-mono text-slate-600 flex flex-col space-y-12 pointer-events-none">
            <span>EJE A</span>
            <span>EJE B</span>
            <span>EJE C</span>
          </div>

          <div className="absolute bottom-6 left-24 text-[10px] font-mono text-slate-600 flex space-x-24 pointer-events-none">
            <span>EJE 1</span>
            <span>EJE 2</span>
            <span>EJE 3</span>
            <span>EJE 4</span>
          </div>

          {/* SVG Floor Plan */}
          <svg
            viewBox="0 0 100 100"
            className="w-full max-w-2xl h-full max-h-[420px] drop-shadow-md z-10"
          >
            {/* Outer Building Footprint Slab */}
            <rect
              x="8"
              y="6"
              width="84"
              height="85"
              rx="2"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeDasharray="none"
            />

            {/* Inner Room Compartments */}
            {spaces.map((sp) => {
              const isHovered = hoveredSpace?.id === sp.id;
              const isSelected = activeSpace?.id === sp.id;

              return (
                <g 
                  key={sp.id}
                  onClick={() => setActiveSpace(sp)}
                  onMouseEnter={() => setHoveredSpace(sp)}
                  onMouseLeave={() => setHoveredSpace(null)}
                  className="cursor-pointer group"
                >
                  {/* Room Area Rectangle */}
                  <rect
                    x={sp.coords.x}
                    y={sp.coords.y}
                    width={sp.coords.w}
                    height={sp.coords.h}
                    rx="1.5"
                    fill={isSelected ? sp.color : isHovered ? `${sp.color}25` : '#f8fafc'}
                    stroke={isSelected ? sp.color : '#64748b'}
                    strokeWidth={isSelected ? '1.5' : '0.8'}
                    className="transition-all duration-200"
                  />

                  {/* Room Label & Area */}
                  <text
                    x={sp.coords.x + sp.coords.w / 2}
                    y={sp.coords.y + sp.coords.h / 2 - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                    fontSize="2.8"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    {sp.name.split('(')[0].split('&')[0]}
                  </text>

                  <text
                    x={sp.coords.x + sp.coords.w / 2}
                    y={sp.coords.y + sp.coords.h / 2 + 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#ffffff' : '#64748b'}
                    fontSize="2.2"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {sp.area} &bull; Clic para ver
                  </text>

                  {/* Interactive Hotspot Pin icon */}
                  <circle
                    cx={sp.coords.x + sp.coords.w - 3.5}
                    cy={sp.coords.y + 3.5}
                    r="1.8"
                    fill={sp.color}
                    className="animate-pulse"
                  />
                </g>
              );
            })}

            {/* Wind Flow Streamlines (N-NE) */}
            <path
              d="M 5 95 Q 30 70, 55 45 T 95 10"
              fill="none"
              stroke="#0d9488"
              strokeWidth="0.8"
              strokeDasharray="2, 2"
              opacity="0.4"
            />
          </svg>

          {/* Floating Bottom Navigation Hint */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-mono backdrop-blur-md shadow-md border border-white/10 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Haz clic sobre cualquier espacio del plano para abrir su ficha técnica</span>
          </div>

          {/* 3D Model Quick Jump Button */}
          <button
            onClick={() => onSelectModule && onSelectModule('3dviewer')}
            className="absolute bottom-4 right-4 z-20 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-md transition-all hover:scale-105"
          >
            <Box className="w-3.5 h-3.5 text-teal-400" />
            <span>Ver en Visor 3D</span>
          </button>
        </div>

      </div>

      {/* 2. SPACES QUICK STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {spaces.map((sp) => {
          const isSelected = activeSpace?.id === sp.id;
          return (
            <button
              key={sp.id}
              onClick={() => setActiveSpace(sp)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-terracotta-500 shadow-md ring-2 ring-terracotta-400/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {sp.area}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.color }} />
                </div>
                <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                  {sp.name.split('(')[0]}
                </h4>
              </div>
              <span className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>{sp.tag}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SPACE DETAIL MODAL POP-UP                                                 */}
      {/* ========================================================================= */}
      {activeSpace && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-terracotta-50 text-terracotta-600 border border-terracotta-200">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-terracotta-700 tracking-wider">
                    {activeSpace.tag} &bull; {activeSpace.area}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    {activeSpace.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveSpace(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                {activeSpace.summary}
              </p>

              {/* 4 Architectural Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeSpace.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">{m.label}</span>
                    <span className="font-serif font-bold text-xs text-slate-900 block mt-1">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Constructive Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Criterio Constructivo:</span>
                <p className="text-xs text-slate-800 font-sans leading-relaxed">
                  {activeSpace.details}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-400">
                Planimetría 2026 // Alejandra Gómez & Ana Casas
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setActiveSpace(null);
                    if (onSelectModule) onSelectModule('3dviewer');
                  }}
                  className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-mono font-bold shadow-sm transition-colors"
                >
                  Inspeccionar en 3D
                </button>

                <button
                  onClick={() => setActiveSpace(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
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
