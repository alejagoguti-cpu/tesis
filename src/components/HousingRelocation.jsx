import React, { useState, useMemo } from 'react';
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
  Eye,
  Search,
  Filter,
  Building2,
  Table,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import { HOUSING_CENSUS_120, HOUSING_CENSUS_SUMMARY } from '../data/housingCensus';

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
      { label: "Estructura", value: "Tirantes Pernados" }
    ],
    details: "El sistema estructural modular de 3.60m entre ejes permite ampliaciones autoconstruidas asistidas por manuales comunitarios de obra."
  }
];

export const SCHOOL_PLAN_SPACES = [
  {
    id: "aulas",
    name: "Módulo de Aulas Bioclimáticas (6 Salas)",
    area: "360 m²",
    coords: { x: 10, y: 15, w: 35, h: 40 },
    color: "#0d9488",
    tag: "Pedagógico",
    summary: "Aulas orientadas norte-sur con celosías de BTC y aleros de 2.20m que aseguran iluminación natural sin deslumbramiento.",
    metrics: [
      { label: "Capacidad", value: "350 Alumnos" },
      { label: "Ventilación", value: "100% Cruzada" },
      { label: "Confort Térmico", value: "27 °C Constante" },
      { label: "BTC Local", value: "8.500 Bloques" }
    ],
    details: "Muros térmicos de tierra comprimida con áridos locales que amortiguan la oscilación térmica diurna del Caribe."
  },
  {
    id: "talleres",
    name: "Talleres de Oficios Náuticos & Carpintería",
    area: "180 m²",
    coords: { x: 55, y: 15, w: 35, h: 40 },
    color: "#c86d51",
    tag: "Formación Técnica",
    summary: "Espacio de doble altura para mantenimiento de embarcaciones, tejido de redes y carpintería de madera ribereña.",
    metrics: [
      { label: "Altura Libre", value: "4.80 m" },
      { label: "Acceso", value: "Portón Corredizo 5m" },
      { label: "Piso", value: "Concreto Pulido" },
      { label: "Herramientas", value: "100% Solar" }
    ],
    details: "Formación técnica de jóvenes en construcción de embarcaciones sostenibles y preservación de artes de pesca artesanal."
  },
  {
    id: "agora",
    name: "Ágora Cívica Central & Plaza de Lluvia",
    area: "420 m²",
    coords: { x: 10, y: 60, w: 80, h: 30 },
    color: "#0284c7",
    tag: "Comunitario & Hídrico",
    summary: "Plaza cubierta bajo macro-cubierta invertida de 1.850 m² que canaliza agua hacia el aljibe y sirve para asambleas.",
    metrics: [
      { label: "Área Sombra", value: "420 m²" },
      { label: "Aforo Asambleas", value: "1.200 Personas" },
      { label: "Captación Pluvial", value: "6.200 m³/año" },
      { label: "Dispensarios", value: "12 Grifos Libres" }
    ],
    details: "Garantiza el abastecimiento soberano y gratuito de agua para las 120 familias reubicadas, eliminando la compra a barcazas."
  }
];

export default function HousingRelocation({ onSelectModule }) {
  const [selectedPlanType, setSelectedPlanType] = useState('vivienda'); // 'vivienda' | 'colegio'
  const [activeMainView, setActiveMainView] = useState('plan'); // 'plan' | 'census120'
  const [activeSpace, setActiveSpace] = useState(null);
  const [hoveredSpace, setHoveredSpace] = useState(null);
  const [selectedHouseModal, setSelectedHouseModal] = useState(null);

  // Census filtering
  const [censusSearch, setCensusSearch] = useState('');
  const [typologyFilter, setTypologyFilter] = useState('ALL');

  const spaces = selectedPlanType === 'vivienda' ? HOUSING_PLAN_SPACES : SCHOOL_PLAN_SPACES;

  const filteredCensus = useMemo(() => {
    return HOUSING_CENSUS_120.filter((h) => {
      const matchSearch = h.id.toLowerCase().includes(censusSearch.toLowerCase()) ||
        h.familyName.toLowerCase().includes(censusSearch.toLowerCase()) ||
        h.sector.toLowerCase().includes(censusSearch.toLowerCase()) ||
        String(h.number).includes(censusSearch);

      const matchTypo = typologyFilter === 'ALL' || h.typologyCode === typologyFilter;
      return matchSearch && matchTypo;
    });
  }, [censusSearch, typologyFilter]);

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-[#f8fafc]">
      
      {/* ========================================================================= */}
      {/* 1. VIEW 1: ARCHITECTURAL FLOOR PLAN CANVAS                                */}
      {/* ========================================================================= */}
      {activeMainView === 'plan' && (
        <div className="absolute inset-0 w-full h-full bg-[#fdfdfd] flex items-center justify-center pt-20 pb-28 px-4 select-none">
          
          {/* Subtle Drafting Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

          {/* Structural Axes / Dimension Guides */}
          <div className="absolute top-24 left-6 text-[10px] font-mono text-slate-500 flex flex-col space-y-12 pointer-events-none">
            <span>EJE A</span>
            <span>EJE B</span>
            <span>EJE C</span>
          </div>

          <div className="absolute bottom-28 left-24 text-[10px] font-mono text-slate-500 flex space-x-24 pointer-events-none">
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
                    fill={isSelected ? '#f1f5f9' : '#64748b'}
                    fontSize="2.0"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {sp.area} &bull; Ficha Técnica
                  </text>

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

          {/* Floating Bottom Quick Space Chips */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-6xl mx-auto pointer-events-auto">
              {spaces.map((sp) => {
                const isSelected = activeSpace?.id === sp.id;
                return (
                  <button
                    key={sp.id}
                    onClick={() => setActiveSpace(sp)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between backdrop-blur-md shadow-xl ${
                      isSelected
                        ? 'bg-white/95 border-terracotta-500 shadow-2xl ring-2 ring-terracotta-400/30 scale-105'
                        : 'bg-white/90 hover:bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {sp.area}
                        </span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.color }} />
                      </div>
                      <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                        {sp.name.split('(')[0]}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW 2: 1:1 HOUSING CENSUS MATRIX (120 DWELLINGS REGISTRATION)         */}
      {/* ========================================================================= */}
      {activeMainView === 'census120' && (
        <div className="absolute inset-0 w-full h-full pt-20 pb-6 px-4 sm:px-8 overflow-y-auto z-10 space-y-4">
          
          {/* Summary KPIs Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-6xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Total Viviendas</span>
              <span className="font-bold text-2xl text-slate-900 font-mono mt-0.5">120 Hogares</span>
              <span className="text-[10px] text-terracotta-600 font-mono block mt-0.5">100% Censo 1:1</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Población Total</span>
              <span className="font-bold text-2xl text-slate-900 font-mono mt-0.5">{HOUSING_CENSUS_SUMMARY.totalResidents} Habitantes</span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">~4.0 hab/hogar</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Tipología A (54 m²)</span>
              <span className="font-bold text-2xl text-teal-700 font-mono mt-0.5">{HOUSING_CENSUS_SUMMARY.typologyACount} Unidades</span>
              <span className="text-[10px] text-teal-600 font-mono block mt-0.5">60% Prototipo Base</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Tipología B (72 m²)</span>
              <span className="font-bold text-2xl text-terracotta-700 font-mono mt-0.5">{HOUSING_CENSUS_SUMMARY.typologyBCount} Unidades</span>
              <span className="text-[10px] text-terracotta-600 font-mono block mt-0.5">40% Productiva / Pesca</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-6xl mx-auto bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código (ej: VIV-042), familia o sector..."
                value={censusSearch}
                onChange={(e) => setCensusSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 sm:w-80"
              />
            </div>

            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setTypologyFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  typologyFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Todas (120)
              </button>
              <button
                onClick={() => setTypologyFilter('TIPO-A')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  typologyFilter === 'TIPO-A' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Tipo A ({HOUSING_CENSUS_SUMMARY.typologyACount})
              </button>
              <button
                onClick={() => setTypologyFilter('TIPO-B')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  typologyFilter === 'TIPO-B' ? 'bg-terracotta-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Tipo B ({HOUSING_CENSUS_SUMMARY.typologyBCount})
              </button>
            </div>
          </div>

          {/* Grid of 120 Dwelling Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto pb-12">
            {filteredCensus.map((house) => (
              <div
                key={house.id}
                onClick={() => setSelectedHouseModal(house)}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-terracotta-400 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                      {house.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                      Cota {house.currentElevation}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">
                    {house.familyName}
                  </h4>

                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                    {house.sector}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-600 font-semibold">{house.residents} Hab. &bull; {house.areaM2}m²</span>
                  <span className="text-terracotta-600 font-bold hover:underline">Ver Ficha &rarr;</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FLOATING TOP BAR                                                       */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-hud px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-lg shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-terracotta-600 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            04
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-terracotta-50/90 text-terracotta-700 border border-terracotta-200/80">
                PROGRAMA ARQUITECTÓNICO // REUBICACIÓN
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50/90 px-1.5 py-0.5 rounded border border-emerald-200/80">
                120 VIVIENDAS 1:1
              </span>
            </div>
            <h2 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {activeMainView === 'census120' ? 'Censo & Cuantificación 1:1 (120 Familias)' : selectedPlanType === 'vivienda' ? 'Prototipo de Vivienda Resiliente (+0.60m)' : 'Equipamiento Educativo & Ágora Hídrica'}
            </h2>
          </div>
        </div>

        {/* View & Plan Switcher */}
        <div className="glass-hud p-1 rounded-2xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center shadow-xl">
          
          {/* Main View: Plan vs Census */}
          <button
            onClick={() => setActiveMainView('plan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeMainView === 'plan'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Plano Arquitectónico</span>
          </button>

          <button
            onClick={() => setActiveMainView('census120')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeMainView === 'census120'
                ? 'bg-terracotta-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Censo 1:1 (120 Viviendas)</span>
          </button>

          {/* Sub-plan toggle when in plan mode */}
          {activeMainView === 'plan' && (
            <div className="flex items-center pl-1 border-l border-slate-200 ml-1">
              <button
                onClick={() => {
                  setSelectedPlanType('vivienda');
                  setActiveSpace(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                  selectedPlanType === 'vivienda'
                    ? 'bg-terracotta-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>Vivienda 54m²</span>
              </button>

              <button
                onClick={() => {
                  setSelectedPlanType('colegio');
                  setActiveSpace(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                  selectedPlanType === 'colegio'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>Colegio 1.850m²</span>
              </button>
            </div>
          )}

        </div>

        {/* 3D Model Quick Jump Button */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => onSelectModule && onSelectModule('3dviewer')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Box className="w-3.5 h-3.5 text-teal-400" />
            <span>Visor 3D</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: INDIVIDUAL HOUSEHOLD SURVEY (1:1 CENSUS)                         */}
      {/* ========================================================================= */}
      {selectedHouseModal && (
        <div 
          onClick={() => setSelectedHouseModal(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto text-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                    CENSO 1:1 // {selectedHouseModal.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    Riesgo: {selectedHouseModal.riskLevel}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedHouseModal.phase}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                  {selectedHouseModal.familyName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedHouseModal.sector} &bull; {selectedHouseModal.residents} Habitantes &bull; Actividad: {selectedHouseModal.livelihood}
                </p>
              </div>

              <button
                onClick={() => setSelectedHouseModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid: Actual vs Reubicada en Meseta */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-red-800 font-bold border-b border-red-200 pb-1">
                  <span>Situación Actual (Borde 0.00m)</span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p><b>Cota Altitudinal:</b> <span className="font-mono text-red-700 font-bold">{selectedHouseModal.currentElevation}</span></p>
                  <p><b>Socavación Costera:</b> {selectedHouseModal.erosionRate}</p>
                  <p><b>Estructura:</b> {selectedHouseModal.currentStructure}</p>
                  <p><b>Agua Potable:</b> {selectedHouseModal.waterCurrent}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-800 font-bold border-b border-emerald-200 pb-1">
                  <span>Reubicación Meseta (+22m)</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p><b>Cota de Seguridad:</b> <span className="font-mono text-emerald-700 font-bold">{selectedHouseModal.targetElevation}</span></p>
                  <p><b>Manzana & Lote:</b> {selectedHouseModal.manzana} - {selectedHouseModal.lote}</p>
                  <p><b>Tipología:</b> {selectedHouseModal.typology}</p>
                  <p><b>Soberanía Hídrica:</b> {selectedHouseModal.waterProposed}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedHouseModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: SPACE DETAIL (FLOOR PLAN)                                       */}
      {/* ========================================================================= */}
      {activeSpace && (
        <div 
          onClick={() => setActiveSpace(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto text-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {activeSpace.tag}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                    Área: {activeSpace.area}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                  {activeSpace.name}
                </h3>
              </div>

              <button
                onClick={() => setActiveSpace(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {activeSpace.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeSpace.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">{m.label}</span>
                  <span className="font-bold text-sm text-slate-900 block mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSpace(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800"
              >
                Cerrar y Continuar Inspeccionando
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
