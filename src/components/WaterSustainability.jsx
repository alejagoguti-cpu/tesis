import React, { useState, useMemo } from 'react';
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
  Gauge,
  Sliders,
  RotateCcw,
  Zap,
  Building2,
  Home,
  Waves,
  Eye,
  FileText,
  Compass
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

// Historical monthly rainfall in Cartagena (IDEAM mm/month)
const MONTHLY_RAINFALL_CARTAGENA = [
  { month: "Ene", rainMm: 2, days: 1 },
  { month: "Feb", rainMm: 3, days: 1 },
  { month: "Mar", rainMm: 8, days: 2 },
  { month: "Abr", rainMm: 28, days: 4 },
  { month: "May", rainMm: 110, days: 10 },
  { month: "Jun", rainMm: 118, days: 11 },
  { month: "Jul", rainMm: 105, days: 10 },
  { month: "Ago", rainMm: 132, days: 12 },
  { month: "Sep", rainMm: 145, days: 14 },
  { month: "Oct", rainMm: 215, days: 17 },
  { month: "Nov", rainMm: 135, days: 12 },
  { month: "Dic", rainMm: 24, days: 3 }
];

export const WATER_CIRCUIT_STEPS = [
  {
    step: "01",
    id: "catchment",
    title: "1. Macro-Captación Invertida",
    category: "Captación Pluvial",
    badge: "1.850 m² Equipamiento + 6.480 m² Viviendas",
    color: "#0284c7",
    tagline: "Cubiertas en V Invertida & Embudo Pluvial",
    summary: "Aprovechamiento de la geometría de cubierta del colegio y las 120 viviendas con pendientes del 15% hacia canaletas centrales de alto caudal en aluminio zincado.",
    specs: [
      { label: "Área Colectora Colegio", value: "1.850 m²" },
      { label: "Área 120 Viviendas", value: "6.480 m² (54 m²/casa)" },
      { label: "Coeficiente de Escorrentía (C)", value: "0.85 (Metal & BTC)" },
      { label: "Volumen Anual Colectado", value: "~6.200 m³ / año" }
    ],
    technicalDetail: "Las cubiertas del equipamiento educativo se diseñaron con pendiente invertida convergente (tipo mariposa) de 12°, canalizando el 100% de la precipitación directa a una viga-canal central de concreto impermeable de 0.80m de ancho con rejillas atrapa-hojas en acero inoxidable.",
    standards: "Norma Técnica Colombiana NTC 1500 (Código Colombiano de Fontanería) y RAS-2000 Título B.",
    icon: CloudRainIcon
  },
  {
    step: "02",
    id: "first_flush",
    title: "2. Desarenador & Separador First-Flush",
    category: "Pre-Tratamiento Físico",
    badge: "99.5% Retención de Sedimentos",
    color: "#0369a1",
    tagline: "Descarte Hidrodinámico de Primeros 2 mm de Lluvia",
    summary: "Cámara centrífuga que desvía automáticamente las primeras aguas de lluvia contaminadas con polvo sahariano y salinidad marina antes del ingreso al aljibe.",
    specs: [
      { label: "Volumen Descarte First-Flush", value: "2.0 mm iniciales (~3.7 m³)" },
      { label: "Malla de Filtración", value: "Tamiz 150 micras (Inox)" },
      { label: "Eficiencia Sólidos", value: "99.5% Sedimentos" },
      { label: "Mantenimiento", value: "Purga por Gravedad 1x/mes" }
    ],
    technicalDetail: "El separador de primeras lluvias opera por principio de boya flotante calibrada. Al acumularse los primeros 3.700 litros con sedimentos y sal marina arrastrados del tejado, la boya sella la cámara de descarte y deriva el flujo limpio hacia el aljibe.",
    standards: "Criterios OMS para sistemas de captación de agua de lluvia en zonas costeras insulares.",
    icon: Filter
  },
  {
    step: "03",
    id: "cistern",
    title: "3. Aljibe Ciclópeo Subterráneo",
    category: "Almacenamiento Central",
    badge: "450.000 Litros // Cota +20.00m",
    color: "#0d9488",
    tagline: "Tanque Subterráneo Compartimentado (450 m³)",
    summary: "Tanque ciclópeo enterrado en la meseta calcárea de Tierrabomba. Aislado térmicamente para mantener el agua fresca a 24°C y blindado ante infiltración salina.",
    specs: [
      { label: "Capacidad Total", value: "450.000 Litros (450 m³)" },
      { label: "Dimensiones Interiores", value: "15.0m × 10.0m × 3.0m prof." },
      { label: "Estructura", value: "Concreto Ciclópeo 3.000 PSI" },
      { label: "Impermeabilización", value: "Membrana EPDM Grado Alimenticio" }
    ],
    technicalDetail: "Diseñado en 3 cámaras independientes interconectadas por vertederos sumergidos para permitir limpieza y mantenimiento sin interrumpir el suministro comunitario. Cuenta con respiraderos bioclimáticos con filtro de carbón para evitar estancamiento y malos olores.",
    standards: "ACI 350 (Environmental Engineering Concrete Structures) y NSR-10 Título C.",
    icon: Building2
  },
  {
    step: "04",
    id: "solar_uv",
    title: "4. Potabilización Solar UV & Cloración",
    category: "Tratamiento de Calidad",
    badge: "100% Agua Potable (Res. 2115)",
    color: "#f59e0b",
    tagline: "Tren de Filtración en 3 Etapas con Energía 100% Fotovoltaica",
    summary: "Tren de tratamiento con filtros de lecho profundo (arena/antracita), microfiltración de 5 micras, carbón activado y lámpara germicida ultravioleta (UV-C).",
    specs: [
      { label: "Caudal de Tratamiento", value: "4.500 Litros / hora" },
      { label: "Consumo Energético", value: "850 W (4 Paneles 450W)" },
      { label: "Dosis UV Germicida", value: "40 mJ/cm² (99.99% patógenos)" },
      { label: "Calidad de Salida", value: "IRCA = 0.0% (Sin Riesgo)" }
    ],
    technicalDetail: "El sistema opera de forma automatizada mediante bomba solar sumergible DC de velocidad variable alimentada por la microrred del colegio, garantizando agua apta para consumo humano directo sin depender de la red eléctrica continental.",
    standards: "Resolución 2115 de 2007 (Ministerio de Protección Social y de Ambiente, Colombia).",
    icon: Sun
  },
  {
    step: "05",
    id: "bio_wetland",
    title: "5. Distribución & Bio-Humedal Fitodepurador",
    category: "Reuso & Fitodepuración",
    badge: "75% Recirculación Aguas Grises",
    color: "#10b981",
    tagline: "Dispensario Público de 12 Tomas + Humedal de Vetiver",
    summary: "Distribución pública gratuita en el ágora cívica del colegio y tratamiento biológico de aguas grises para riego de huertos agroforestales comunitarios.",
    specs: [
      { label: "Tomas Públicas Ágora", value: "12 Grifos Temporizados" },
      { label: "Dotación Base", value: "35 Litros / hab / día" },
      { label: "Especies Fitodepuradoras", value: "Vetiver, Typha Dominguensis" },
      { label: "Destino Aguas Tratadas", value: "Huerto Comunal & Riego de Árboles" }
    ],
    technicalDetail: "Las aguas grises procedentes de lavamanos escolares y viviendas son conducidas a un bio-humedal de flujo subsuperficial horizontal de 120 m² con lecho de grava clasificada y plantas macrófitas nativas, reduciendo la DBO5 en un 88% antes de irrigar los huertos.",
    standards: "Resolución 0631 de 2015 (Parámetros y valores límites máximos permisibles en vertimientos).",
    icon: Droplets
  }
];

function CloudRainIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 14v6M8 14v6M12 16v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WaterSustainability({ onSelectModule }) {
  const [activeTab, setActiveTab] = useState('circuito'); // 'circuito' | 'corte_cad' | 'balance'
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedNodeModal, setSelectedNodeModal] = useState(null);

  // Balance Simulator Sliders
  const [rainfallMultiplier, setRainfallMultiplier] = useState(1.0); // 0.6 a 1.4
  const [populationCount, setPopulationCount] = useState(480); // 300 a 700 hab (120 familias * 4)
  const [litersPerPersonDay, setLitersPerPersonDay] = useState(35); // 25 a 50 L/hab/d
  const [catchmentEfficiency, setCatchmentEfficiency] = useState(0.85); // 0.70 a 0.95

  const currentStep = WATER_CIRCUIT_STEPS[activeStepIndex];

  // Dynamic calculations for Water Balance
  const annualCalculations = useMemo(() => {
    const totalHarvestingArea = 1850 + (120 * 54); // 1850 + 6480 = 8330 m²
    const baseRainMm = MONTHLY_RAINFALL_CARTAGENA.reduce((acc, m) => acc + m.rainMm, 0); // ~927 mm
    const simulatedRainMm = baseRainMm * rainfallMultiplier;
    
    // Total harvested liters per year = Area (m²) * Rain (mm) * Efficiency * Multiplier
    const totalHarvestedLiters = totalHarvestingArea * simulatedRainMm * catchmentEfficiency;
    
    // Total consumption liters per year = Population * Liters/Day * 365
    const dailyDemandLiters = populationCount * litersPerPersonDay;
    const annualDemandLiters = dailyDemandLiters * 365;

    // Net balance
    const netBalanceLiters = totalHarvestedLiters - annualDemandLiters;
    const cisternCapacity = 450000;
    const droughtDaysAutonomy = Math.round(cisternCapacity / dailyDemandLiters);

    // Monthly breakdown
    let currentStorage = cisternCapacity * 0.75; // initial start
    const monthlySeries = MONTHLY_RAINFALL_CARTAGENA.map(m => {
      const monthRain = m.rainMm * rainfallMultiplier;
      const monthHarvest = totalHarvestingArea * monthRain * catchmentEfficiency;
      const monthDemand = dailyDemandLiters * 30.4;
      currentStorage = Math.min(cisternCapacity, Math.max(0, currentStorage + monthHarvest - monthDemand));
      return {
        month: m.month,
        rainMm: Math.round(monthRain),
        harvestLiters: Math.round(monthHarvest),
        demandLiters: Math.round(monthDemand),
        storageLevel: Math.round(currentStorage),
        storagePct: Math.round((currentStorage / cisternCapacity) * 100)
      };
    });

    return {
      simulatedRainMm: Math.round(simulatedRainMm),
      totalHarvestedLiters: Math.round(totalHarvestedLiters),
      annualDemandLiters: Math.round(annualDemandLiters),
      dailyDemandLiters: Math.round(dailyDemandLiters),
      netBalanceLiters: Math.round(netBalanceLiters),
      droughtDaysAutonomy,
      monthlySeries
    };
  }, [rainfallMultiplier, populationCount, litersPerPersonDay, catchmentEfficiency]);

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-100 flex flex-col justify-between">
      
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none" />

      {/* Subtle radial light glow in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.06)_0,transparent_70%)] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP FLOATING CONTROL BAR                                               */}
      {/* ========================================================================= */}
      <div className="relative z-[400] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Header Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-md">
            07
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                INFRAESTRUCTURA HÍDRICA
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                450.000 L Resiliente
              </span>
            </div>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
              Memoria Técnica: Ciclo Hídrico Integral & Autosuficiencia
            </h2>
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('circuito')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'circuito'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Circuito Hidráulico</span>
          </button>

          <button
            onClick={() => setActiveTab('corte_cad')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'corte_cad'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Corte Técnico Aljibe</span>
          </button>

          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'balance'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador de Balance</span>
          </button>
        </div>

        {/* Quick Link to Simulation Lab */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center gap-1 self-start md:self-auto shrink-0">
          <button
            onClick={() => onSelectModule && onSelectModule('simulations')}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulador Sequía (Lab 06)</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN INTERACTIVE CONTENT AREA (Clean Architectural Canvas)             */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-2 relative flex items-center justify-center overflow-hidden">
        
        {/* ===================================================================== */}
        {/* VIEW 1: HYDRAULIC CIRCUIT DIAGRAM                                    */}
        {/* ===================================================================== */}
        {activeTab === 'circuito' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-2 animate-fade-in">
            
            {/* Upper Schematic Pipeline Flow SVG */}
            <div className="w-full bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center">
              
              {/* Circuit Header info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Flujo Continuo en Ciclo Cerrado // 5 Estaciones de Tratamiento
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Haz clic en cualquier estación para abrir su ficha técnica
                </span>
              </div>

              {/* Main SVG Hydraulic Pipeline */}
              <div className="w-full overflow-x-auto py-4">
                <div className="min-w-[760px] grid grid-cols-5 gap-3 relative">
                  
                  {/* Connecting Line between cards */}
                  <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 -translate-y-1/2 z-0 rounded-full opacity-60" />

                  {WATER_CIRCUIT_STEPS.map((step, idx) => {
                    const isSelected = activeStepIndex === idx;
                    const IconComp = step.icon;
                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          setActiveStepIndex(idx);
                          setSelectedNodeModal(step);
                        }}
                        className={`relative z-10 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                          isSelected
                            ? 'bg-white border-blue-500 shadow-xl ring-2 ring-blue-500/20 scale-105'
                            : 'bg-slate-50/90 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Step Number Tag */}
                        <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold shadow-md">
                          FASE {step.step}
                        </div>

                        {/* Icon Avatar */}
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-2 shadow-md transition-transform group-hover:scale-110"
                          style={{ backgroundColor: step.color }}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>

                        {/* Titles */}
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase truncate max-w-full">
                          {step.category}
                        </span>
                        <h4 className="font-serif font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">
                          {step.title.split('. ')[1]}
                        </h4>

                        {/* Badge */}
                        <span className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold truncate max-w-full">
                          {step.badge.split(' // ')[0]}
                        </span>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Secondary Graywater Loop Callout */}
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase">
                      Subcircuito Ecológico: Fitodepuración de Aguas Grises (Vetiver & Macrófitas)
                    </span>
                    <p className="text-xs text-emerald-800/90">
                      75% del agua utilizada se recircula para riego de huertos comunitarios y estabilización del suelo en la meseta.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveStepIndex(4);
                    setSelectedNodeModal(WATER_CIRCUIT_STEPS[4]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-mono font-bold shrink-0 transition-colors shadow-sm"
                >
                  Ver Fitodepuración
                </button>
              </div>

            </div>

            {/* Bottom 5-Step Process Selector Strip */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-5 gap-2 pt-3">
              {WATER_CIRCUIT_STEPS.map((s, idx) => {
                const isCur = activeStepIndex === idx;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isCur
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={isCur ? 'text-blue-100 font-bold' : 'text-slate-500 font-bold'}>
                        {s.step} {s.title.split('. ')[1]}
                      </span>
                    </div>
                    <p className={`text-[10px] font-sans truncate mt-0.5 ${isCur ? 'text-blue-100' : 'text-slate-500'}`}>
                      {s.specs[3]?.value || s.badge}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: CAD TECHNICAL CROSS-SECTION & CISTERN DETAIL                 */}
        {/* ===================================================================== */}
        {activeTab === 'corte_cad' && (
          <div className="w-full h-full bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-2xl overflow-y-auto flex flex-col justify-between animate-fade-in space-y-4">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  PLANO TÉCNICO CAD // CORTE HIDRÁULICO A-A'
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1">
                  Corte Constructivo: Cubierta Invertida, Aljibe Ciclópeo (450 kL) & Dispensario
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 block">Escala Gráfica 1:75</span>
                <span className="text-xs font-mono font-bold text-teal-700 block">Cota Suelo: +20.00m a +22.00m</span>
              </div>
            </div>

            {/* CAD Isometric / Section Technical Illustration */}
            <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 relative overflow-hidden flex items-center justify-center">
              
              <svg viewBox="0 0 900 380" className="w-full max-w-4xl h-auto">
                
                {/* Ground Level Line */}
                <line x1="20" y1="210" x2="880" y2="210" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
                <text x="30" y="200" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  NIVEL DE TERRENO MESETA (+22.00 m.s.n.m.)
                </text>

                {/* Ground Fill Hatch Pattern */}
                <rect x="20" y="210" width="860" height="150" fill="#f1f5f9" opacity="0.6" />

                {/* 1. Inverted Catchment Roof on the Left */}
                <polygon points="60,60 220,130 380,60 380,80 220,150 60,80" fill="#0284c7" opacity="0.85" />
                <text x="220" y="45" textAnchor="middle" fill="#0369a1" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  MACRO-CUBIERTA INVERTIDA 1.850 m² (Pend. 12°)
                </text>

                {/* Downspout Pipe */}
                <rect x="215" y="150" width="10" height="110" fill="#0284c7" />
                <text x="235" y="180" fill="#0284c7" fontSize="9" fontFamily="monospace">
                  Bajante PVC Ø6"
                </text>

                {/* 2. First-Flush Vortex Chamber */}
                <rect x="200" y="240" width="40" height="60" rx="4" fill="#0369a1" stroke="#0284c7" strokeWidth="2" />
                <text x="220" y="275" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  FIRST-FLUSH
                </text>

                {/* Pipeline to Cistern */}
                <rect x="240" y="255" width="80" height="8" fill="#0284c7" />

                {/* 3. Underground Cistern (450,000 L) */}
                {/* Cistern Concrete Outer Walls */}
                <rect x="320" y="230" width="340" height="120" rx="6" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
                {/* Water Body inside */}
                <rect x="330" y="248" width="320" height="92" rx="4" fill="#38bdf8" opacity="0.75" />
                
                {/* Water Waves in Cistern */}
                <path d="M 330,248 Q 370,244 410,248 T 490,248 T 570,248 T 650,248" stroke="#0284c7" strokeWidth="2" fill="none" />
                
                {/* Baffle Walls (Chambers) */}
                <rect x="435" y="255" width="6" height="95" fill="#475569" />
                <rect x="545" y="230" width="6" height="80" fill="#475569" />

                <text x="490" y="295" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="serif" fontWeight="bold">
                  ALJIBE CICLÓPEO DE 450.000 LITROS
                </text>
                <text x="490" y="315" textAnchor="middle" fill="#0369a1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  3 Cámaras en Concreto Impermeabilizado (15.0m × 10.0m × 3.0m)
                </text>

                {/* Submersible Pump */}
                <rect x="610" y="310" width="20" height="25" rx="3" fill="#0f172a" />
                <text x="620" y="300" textAnchor="middle" fill="#0f172a" fontSize="8" fontFamily="monospace">
                  Bomba Solar 1.5HP
                </text>

                {/* Riser Pipe to Purification and Dispensary */}
                <rect x="618" y="150" width="6" height="160" fill="#0d9488" />

                {/* 4. Solar UV Treatment Train */}
                <rect x="600" y="110" width="80" height="40" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <text x="640" y="128" textAnchor="middle" fill="#92400e" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  FILTRO UV-C
                </text>
                <text x="640" y="142" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="monospace">
                  Res. 2115 Apta
                </text>

                {/* Solar Panel Powering it */}
                <line x1="590" y1="90" x2="690" y2="70" stroke="#f59e0b" strokeWidth="4" />
                <text x="640" y="62" textAnchor="middle" fill="#b45309" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  PANELES SOLARES FV
                </text>

                {/* 5. Civic Dispensary (12 Faucets) */}
                <rect x="740" y="160" width="100" height="50" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <text x="790" y="182" textAnchor="middle" fill="#0f172a" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  DISPENSARIO
                </text>
                <text x="790" y="198" textAnchor="middle" fill="#0284c7" fontSize="9" fontFamily="monospace">
                  12 Tomas Públicas
                </text>

                {/* Gravity flow to Wetland on the right */}
                <path d="M 790,210 L 790,280 L 840,280" stroke="#10b981" strokeWidth="3" strokeDasharray="4 4" fill="none" />
                <rect x="800" y="280" width="80" height="40" rx="4" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
                <text x="840" y="300" textAnchor="middle" fill="#065f46" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  BIO-HUMEDAL
                </text>
                <text x="840" y="312" textAnchor="middle" fill="#047857" fontSize="7" fontFamily="monospace">
                  Plantas Vetiver
                </text>

              </svg>

            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Capacidad de Almacenamiento</span>
                <h4 className="font-serif font-bold text-sm text-slate-900 mt-0.5">450.000 Litros</h4>
                <p className="text-[10px] text-slate-500">90 días de autonomía plena</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Área Colectora Total</span>
                <h4 className="font-serif font-bold text-sm text-slate-900 mt-0.5">8.330 m²</h4>
                <p className="text-[10px] text-slate-500">Colegio + 120 Viviendas</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Norma de Potabilización</span>
                <h4 className="font-serif font-bold text-sm text-slate-900 mt-0.5">Res. 2115 / 2007</h4>
                <p className="text-[10px] text-slate-500">Desinfección UV 100% Solar</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Dotación Comunitaria</span>
                <h4 className="font-serif font-bold text-sm text-slate-900 mt-0.5">35 L / hab / día</h4>
                <p className="text-[10px] text-slate-500">12 Tomas en Ágora Cívica</p>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: WATER BALANCE SIMULATOR & DROUGHT RESILIENCE                 */}
        {/* ===================================================================== */}
        {activeTab === 'balance' && (
          <div className="w-full h-full bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-2xl overflow-y-auto flex flex-col justify-between animate-fade-in space-y-4">
            
            {/* Header & Simulator Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    MODELO ESTOCÁSTICO HIDROLÓGICO
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Cartagena (IDEAM 927 mm/año)
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1">
                  Balance Pluvial Mensual vs. Demanda de 120 Hogares (480 hab)
                </h3>
              </div>

              {/* Sliders in a Clean Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Slider 1: Rain Multiplier */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lluvia Anual:</span>
                    <span className="font-bold text-blue-700">{annualCalculations.simulatedRainMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.4"
                    step="0.05"
                    value={rainfallMultiplier}
                    onChange={(e) => setRainfallMultiplier(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Sequía (-40%)</span>
                    <span>Húmedo (+40%)</span>
                  </div>
                </div>

                {/* Slider 2: Population */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Población:</span>
                    <span className="font-bold text-teal-700">{populationCount} hab.</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="700"
                    step="20"
                    value={populationCount}
                    onChange={(e) => setPopulationCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>300 hab</span>
                    <span>700 hab</span>
                  </div>
                </div>

                {/* Slider 3: Liters per Person */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dotación:</span>
                    <span className="font-bold text-slate-900">{litersPerPersonDay} L/hab/d</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    step="5"
                    value={litersPerPersonDay}
                    onChange={(e) => setLitersPerPersonDay(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>25 L (Austeridad)</span>
                    <span>50 L (Pleno)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Monthly Chart Bar Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span className="font-bold">Comportamiento Mensual del Aljibe (Capacidad Máxima: 450.000 L)</span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                    <span>Lluvia Colectada</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    <span>Demanda Comunal</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-teal-600" />
                    <span>Nivel Aljibe</span>
                  </span>
                </div>
              </div>

              {/* 12-Month Bar Visualizer */}
              <div className="grid grid-cols-12 gap-1.5 h-44 bg-slate-50 rounded-2xl border border-slate-200 p-3 items-end">
                {annualCalculations.monthlySeries.map((m, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono p-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                      {m.month}: Lluvia {m.rainMm}mm | Aljibe: {m.storagePct}% ({m.storageLevel.toLocaleString()} L)
                    </div>

                    {/* Bars stacked/grouped */}
                    <div className="w-full flex items-end justify-center space-x-1 h-32">
                      {/* Harvest Bar */}
                      <div 
                        className="w-2 rounded-t bg-blue-400 transition-all"
                        style={{ height: `${Math.min(100, (m.harvestLiters / 1200000) * 100)}%` }}
                        title={`Captación: ${m.harvestLiters.toLocaleString()} L`}
                      />
                      {/* Storage level Bar */}
                      <div 
                        className="w-3 rounded-t bg-teal-600 transition-all"
                        style={{ height: `${m.storagePct}%` }}
                        title={`Almacenamiento: ${m.storageLevel.toLocaleString()} L`}
                      />
                    </div>

                    {/* Month Label */}
                    <span className="text-[10px] font-mono font-bold text-slate-600 mt-2">
                      {m.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Summary Calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200">
                <span className="text-[10px] font-mono text-blue-700 block">Total Colectado Anual</span>
                <h4 className="font-serif font-bold text-base text-blue-950 mt-0.5">
                  {(annualCalculations.totalHarvestedLiters / 1000).toLocaleString()} m³ / año
                </h4>
                <p className="text-[10px] text-blue-700">100% captación pluvial limpia</p>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200">
                <span className="text-[10px] font-mono text-teal-700 block">Autonomía en Sequía</span>
                <h4 className="font-serif font-bold text-base text-teal-950 mt-0.5">
                  {annualCalculations.droughtDaysAutonomy} Días Continuos
                </h4>
                <p className="text-[10px] text-teal-700">Supera la temporada seca (90d)</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Demanda Anual Total</span>
                <h4 className="font-serif font-bold text-base text-slate-900 mt-0.5">
                  {(annualCalculations.annualDemandLiters / 1000).toLocaleString()} m³ / año
                </h4>
                <p className="text-[10px] text-slate-500">{annualCalculations.dailyDemandLiters.toLocaleString()} L / día comunal</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 block">Soberanía Hídrica</span>
                <h4 className="font-serif font-bold text-base text-emerald-950 mt-0.5">
                  100% Autosuficiente
                </h4>
                <p className="text-[10px] text-emerald-700">$0 COP en barcazas externas</p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FLOATING KPI STRIP                                              */}
      {/* ========================================================================= */}
      <div className="relative z-[400] p-4 pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-7xl mx-auto pointer-events-auto">
          
          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Droplets className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                RESERVA
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Capacidad Aljibe</p>
            <h4 className="font-serif font-bold text-base text-slate-900">450.000 L</h4>
            <p className="text-[9px] text-slate-500 truncate">Meseta central +20m</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700">
                AUTONOMÍA
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Resistencia Sequía</p>
            <h4 className="font-serif font-bold text-base text-slate-900">90 Días</h4>
            <p className="text-[9px] text-slate-500 truncate">Sin lluvias externas</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CloudRainIcon className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                CAPTACIÓN
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Área Colectora</p>
            <h4 className="font-serif font-bold text-base text-slate-900">8.330 m²</h4>
            <p className="text-[9px] text-slate-500 truncate">Colegio + 120 Casas</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Sun className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700">
                ENERGÍA
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Planta Solar UV</p>
            <h4 className="font-serif font-bold text-base text-slate-900">100% FV</h4>
            <p className="text-[9px] text-slate-500 truncate">Bomba DC & UV-C</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <RefreshCw className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700">
                RECICLAJE
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Aguas Grises</p>
            <h4 className="font-serif font-bold text-base text-slate-900">75% Reuso</h4>
            <p className="text-[9px] text-slate-500 truncate">Bio-Humedal Vetiver</p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DETAIL MODAL POP-UP (Technical Specification Sheet)                   */}
      {/* ========================================================================= */}
      {selectedNodeModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    FASE {selectedNodeModal.step} // {selectedNodeModal.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {selectedNodeModal.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {selectedNodeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tagline & Summary */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase">
                {selectedNodeModal.tagline}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                {selectedNodeModal.summary}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-2">
              {selectedNodeModal.specs.map((sp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block">{sp.label}</span>
                  <span className="font-serif font-bold text-xs text-slate-900 block mt-0.5">{sp.value}</span>
                </div>
              ))}
            </div>

            {/* Technical Detail & Standards */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="text-[10px] font-mono font-bold text-blue-900 uppercase tracking-wider block">
                Memoria de Cálculo & Criterio Constructivo
              </span>
              <p className="text-xs text-blue-950 font-sans leading-relaxed">
                {selectedNodeModal.technicalDetail}
              </p>
              <div className="pt-2 border-t border-blue-200/60 text-[10px] font-mono text-blue-800">
                <span className="font-bold">Normativa Aplicable: </span>
                <span>{selectedNodeModal.standards}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Tesis Tierrabomba 2026 // Alejandra Gómez & Ana Casas
              </span>
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors shadow-md"
              >
                Cerrar Ficha Técnica
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
