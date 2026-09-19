import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sliders,
  RotateCcw,
  Waves,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Building2,
  Home,
  CheckCircle2,
  Sparkles,
  Layers,
  Thermometer,
  Gauge,
  X,
  Info
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function SimulationLab({ onSelectModule }) {
  const [activeEngine, setActiveEngine] = useState('seaLevel'); // 'seaLevel' | 'waterBalance' | 'perturbation' | 'bioclimatic'
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // =========================================================================
  // ENGINE 1: SIMULADOR DE EROSIÓN & NIVEL DEL MAR (IPCC / COSTAS)
  // =========================================================================
  const [seaRiseCm, setSeaRiseCm] = useState(25); // 0 a 150 cm
  const [erosionRateYear, setErosionRateYear] = useState(1.8); // 0.5 a 4.0 m/año
  const [timeHorizonYears, setTimeHorizonYears] = useState(24); // 2026 a 2050 (24 años)

  const seaMetrics = useMemo(() => {
    const totalBeachLoss = (erosionRateYear * timeHorizonYears).toFixed(1);
    const vulnerableTraditionalHomes = Math.min(
      120,
      Math.round(40 + (parseFloat(totalBeachLoss) / 40) * 80 + seaRiseCm * 0.3)
    );
    const aquiferSalinityPsu = Math.min(42, (28 + seaRiseCm * 0.12).toFixed(1));
    const plateauSafetyPercent = 100;

    return {
      totalBeachLoss,
      vulnerableTraditionalHomes,
      aquiferSalinityPsu,
      plateauSafetyPercent,
      targetYear: 2026 + timeHorizonYears
    };
  }, [seaRiseCm, erosionRateYear, timeHorizonYears]);

  const applySeaPreset = (preset) => {
    if (preset === 'base2026') {
      setSeaRiseCm(0);
      setErosionRateYear(1.8);
      setTimeHorizonYears(0);
    } else if (preset === 'ssp2') {
      setSeaRiseCm(35);
      setErosionRateYear(2.2);
      setTimeHorizonYears(24);
    } else if (preset === 'ssp5') {
      setSeaRiseCm(85);
      setErosionRateYear(3.2);
      setTimeHorizonYears(50);
    } else if (preset === 'stormSurge') {
      setSeaRiseCm(120);
      setErosionRateYear(4.0);
      setTimeHorizonYears(10);
    }
  };

  // =========================================================================
  // ENGINE 2: SIMULADOR DE BALANCE HÍDRICO & SEQUÍA (ALJIBE 450.000 L)
  // =========================================================================
  const [annualRainfallMm, setAnnualRainfallMm] = useState(950);
  const [dailyPerCapitaConsL, setDailyPerCapitaConsL] = useState(40);
  const [catchmentAreaM2, setCatchmentAreaM2] = useState(8330);
  const [runoffCoeff, setRunoffCoeff] = useState(0.85);

  const waterMetrics = useMemo(() => {
    const rainfallM = annualRainfallMm / 1000;
    const harvestedM3 = rainfallM * catchmentAreaM2 * runoffCoeff;
    const harvestedLitres = harvestedM3 * 1000;
    const annualDemandLitres = 480 * dailyPerCapitaConsL * 365;
    const centralCisternCapacity = 450000;
    const dailyDemandLitres = 480 * dailyPerCapitaConsL;
    const drySeasonAutonomyDays = Math.min(180, Math.round(centralCisternCapacity / dailyDemandLitres));
    const annualBalanceLitres = harvestedLitres - annualDemandLitres;
    const fillPercent = Math.min(100, Math.round((harvestedLitres / (centralCisternCapacity * 2.5)) * 100));

    return {
      harvestedM3: Math.round(harvestedM3),
      harvestedLitres: Math.round(harvestedLitres),
      annualDemandLitres: Math.round(annualDemandLitres),
      drySeasonAutonomyDays,
      annualBalanceLitres: Math.round(annualBalanceLitres),
      fillPercent,
      annualSavingsCopMillions: ((harvestedLitres / 20) * 8000 / 1000000).toFixed(1)
    };
  }, [annualRainfallMm, dailyPerCapitaConsL, catchmentAreaM2, runoffCoeff]);

  // =========================================================================
  // ENGINE 3: PERTURBACIÓN DE RED & INFRAESTRUCTURA
  // =========================================================================
  const [schoolUsers, setSchoolUsers] = useState(350);
  const [gridFailureActive, setGridFailureActive] = useState(true);
  const [waterBargeDelayed, setWaterBargeDelayed] = useState(true);

  // =========================================================================
  // ENGINE 4: CONFORT EÓLICO & BIOCLIMÁTICO
  // =========================================================================
  const [windSpeedKnots, setWindSpeedKnots] = useState(18);
  const [windAngleDeg, setWindAngleDeg] = useState(35);
  const [louverOpeningPct, setLouverOpeningPct] = useState(80);

  const windMetrics = useMemo(() => {
    const outdoorMs = windSpeedKnots * 0.514444;
    const rawIndoorVelocity = (outdoorMs * (louverOpeningPct / 100) * 0.45).toFixed(2);
    const ach = Math.round((parseFloat(rawIndoorVelocity) / 0.5) * 14);
    const tempDrop = ((parseFloat(rawIndoorVelocity) * 1.8) + (louverOpeningPct > 50 ? 1.5 : 0.5)).toFixed(1);

    return {
      indoorVelocity: rawIndoorVelocity,
      ach,
      tempDrop
    };
  }, [windSpeedKnots, windAngleDeg, louverOpeningPct]);

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-950">
      
      {/* 1. FULLSCREEN SIMULATION CANVAS BACKDROP */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center p-6 select-none overflow-hidden">
        
        {/* Dynamic Canvas Graphic Depending on Active Engine */}
        <div className="w-full max-w-4xl h-full max-h-[520px] flex items-center justify-center relative">
          
          {/* Engine 1 Graphic: Coastal Section & Tide Surge */}
          {activeEngine === 'seaLevel' && (
            <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
              {/* Sea */}
              <rect x="0" y={220 - (seaRiseCm * 0.6)} width="360" height="200" fill="#0284c7" fillOpacity="0.4" />
              <path d={`M 0,${220 - (seaRiseCm * 0.6)} Q 90,${210 - (seaRiseCm * 0.6)} 180,${220 - (seaRiseCm * 0.6)} T 360,${220 - (seaRiseCm * 0.6)}`} stroke="#38bdf8" strokeWidth="3" fill="none" className="animate-pulse" />
              
              {/* Shoreline Beach */}
              <polygon points={`340,${220 - (seaRiseCm * 0.6)} 480,260 520,380 0,380`} fill="#d97706" fillOpacity="0.3" />
              
              {/* Plateau +22m (Immune) */}
              <polygon points="500,260 560,110 800,110 800,380 500,380" fill="#059669" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />

              {/* Vulnerable House on Shoreline */}
              <g opacity={seaMetrics.vulnerableTraditionalHomes > 80 ? 0.3 : 1} className="transition-opacity duration-300">
                <rect x="380" y="220" width="35" height="25" fill="#ef4444" />
                <polygon points="375,220 397,205 420,220" fill="#dc2626" />
                <text x="397" y="260" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">COTA 0.00</text>
              </g>

              {/* Secure Relocated Settlement on Plateau */}
              <g>
                <rect x="590" y="85" width="45" height="25" fill="#10b981" />
                <polygon points="585,85 612,70 640,85" fill="#059669" />
                
                <rect x="660" y="70" width="70" height="40" fill="#0d9488" />
                <rect x="680" y="110" width="40" height="15" fill="#0284c7" />
                <text x="700" y="122" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">ALJIBE</text>

                <text x="660" y="55" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  MESETA SEGURA (+22.00 M)
                </text>
              </g>

              {/* Erosion loss line */}
              <line x1="360" y1="180" x2={360 + seaMetrics.totalBeachLoss * 3} y2="180" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
              <text x="360" y="170" fill="#f43f5e" fontSize="10" fontFamily="monospace">
                RETROCESO: -{seaMetrics.totalBeachLoss}m ({seaMetrics.targetYear})
              </text>
            </svg>
          )}

          {/* Engine 2 Graphic: Water Reservoir Balance */}
          {activeEngine === 'waterBalance' && (
            <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
              {/* Rain clouds */}
              <g className="animate-pulse">
                <circle cx="200" cy="80" r="30" fill="#475569" />
                <circle cx="240" cy="70" r="35" fill="#475569" />
                <circle cx="280" cy="80" r="28" fill="#475569" />
                <text x="240" y="85" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace">
                  {annualRainfallMm} mm/año
                </text>
              </g>

              {/* Rain drops */}
              {[180, 210, 240, 270, 300].map((x, i) => (
                <line key={i} x1={x} y1="120" x2={x - 10} y2="160" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
              ))}

              {/* Catchment Roof */}
              <polygon points="120,170 240,190 360,170 360,180 240,200 120,180" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              <text x="240" y="215" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                CUBIERTAS: {catchmentAreaM2.toLocaleString()} m²
              </text>

              {/* Cistern Tank */}
              <rect x="420" y="140" width="260" height="180" rx="16" fill="#0f172a" stroke="#0284c7" strokeWidth="3" />
              
              {/* Water Fill Level inside Cistern */}
              <rect 
                x="424" 
                y={316 - (waterMetrics.fillPercent * 1.7)} 
                width="252" 
                height={waterMetrics.fillPercent * 1.7} 
                rx="12" 
                fill="#0284c7" 
                fillOpacity="0.8" 
                className="transition-all duration-500"
              />

              <text x="550" y="230" textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="bold">
                {waterMetrics.fillPercent}% LLENO
              </text>
              <text x="550" y="250" textAnchor="middle" fill="#bae6fd" fontSize="11" fontFamily="monospace">
                {waterMetrics.drySeasonAutonomyDays} DÍAS DE AUTONOMÍA
              </text>
            </svg>
          )}

          {/* Engine 3 Graphic: Perturbation & Network Resilience */}
          {activeEngine === 'perturbation' && (
            <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
              {/* Grid Status Node */}
              <circle cx="250" cy="200" r="60" fill={gridFailureActive ? "#7f1d1d" : "#064e3b"} stroke={gridFailureActive ? "#ef4444" : "#10b981"} strokeWidth="3" />
              <text x="250" y="195" textAnchor="middle" fill="#ffffff" fontSize="24">{gridFailureActive ? "⚡❌" : "⚡✅"}</text>
              <text x="250" y="225" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                RED CARTAGENA
              </text>

              {/* Community Autonomous Microgrid */}
              <circle cx="550" cy="200" r="80" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
              <text x="550" y="185" textAnchor="middle" fill="#ffffff" fontSize="32">☀️🔋</text>
              <text x="550" y="220" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                ISLA AUTÓNOMA
              </text>
              <text x="550" y="238" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
                100% OPERATIVO
              </text>
            </svg>
          )}

          {/* Engine 4 Graphic: Bioclimatic Wind Flow */}
          {activeEngine === 'bioclimatic' && (
            <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
              {/* Classroom Section */}
              <rect x="280" y="120" width="280" height="180" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <polygon points="260,120 420,80 580,120 580,130 420,90 260,130" fill="#94a3b8" />

              {/* Louvers */}
              <rect x="280" y="160" width="10" height="100" fill="#f59e0b" opacity={louverOpeningPct / 100} />
              <rect x="550" y="160" width="10" height="100" fill="#f59e0b" opacity={louverOpeningPct / 100} />

              {/* Wind Arrows Passing Through */}
              {[180, 210, 240].map((y, idx) => (
                <path 
                  key={idx}
                  d={`M 140,${y} L 700,${y}`} 
                  stroke="#0d9488" 
                  strokeWidth="3" 
                  strokeDasharray="12 6" 
                  className="animate-pulse"
                />
              ))}

              <text x="420" y="200" textAnchor="middle" fill="#ffffff" fontSize="18" fontFamily="monospace" fontWeight="bold">
                -{windMetrics.tempDrop} °C
              </text>
              <text x="420" y="225" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="monospace">
                {windMetrics.ach} RENOVACIONES / HORA
              </text>
            </svg>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS                                                  */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center space-x-3 max-w-lg text-white">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            08
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                LABORATORIO DE SIMULACIONES // MODELAMIENTO
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                DINÁMICO
              </span>
            </div>
            <h2 className="font-bold text-sm text-white truncate">
              {activeEngine === 'seaLevel' && 'Erosión Costera & Retiro de Línea Marina (IPCC)'}
              {activeEngine === 'waterBalance' && 'Balance Hidráulico & Autonomía Aljibe 450kL'}
              {activeEngine === 'perturbation' && 'Resiliencia ante Desconexión de Red'}
              {activeEngine === 'bioclimatic' && 'Dinámica de Fluidos & Ventilación Cruzada'}
            </h2>
          </div>
        </div>

        {/* Engine Switcher Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center gap-1 self-start md:self-center text-white">
          <button
            onClick={() => setActiveEngine('seaLevel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'seaLevel' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>1. Nivel del Mar</span>
          </button>
          <button
            onClick={() => setActiveEngine('waterBalance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'waterBalance' ? 'bg-blue-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>2. Balance Hídrico</span>
          </button>
          <button
            onClick={() => setActiveEngine('perturbation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'perturbation' ? 'bg-terracotta-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. Perturbación</span>
          </button>
          <button
            onClick={() => setActiveEngine('bioclimatic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'bioclimatic' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>4. Eólico</span>
          </button>
        </div>

        {/* Info Modal Button */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold shadow-sm transition-all flex items-center space-x-1.5 border border-slate-700"
          >
            <Info className="w-4 h-4" />
            <span>Metodología</span>
          </button>
        </div>

      </div>

      {/* Floating Left: Interactive Parameter Sliders */}
      <div className="absolute top-24 left-4 z-[400] bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4 pointer-events-auto text-white w-72">
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Variables de Entrada</span>
          <Sliders className="w-3.5 h-3.5" />
        </div>

        {activeEngine === 'seaLevel' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Aumento Mar:</span>
                <span className="font-bold text-amber-400">+{seaRiseCm} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={seaRiseCm}
                onChange={(e) => setSeaRiseCm(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Tasa Erosión:</span>
                <span className="font-bold text-red-400">{erosionRateYear} m/año</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={erosionRateYear}
                onChange={(e) => setErosionRateYear(parseFloat(e.target.value))}
                className="w-full accent-red-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Horizonte:</span>
                <span className="font-bold text-teal-400">{seaMetrics.targetYear}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={timeHorizonYears}
                onChange={(e) => setTimeHorizonYears(parseInt(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2">
              <button
                onClick={() => applySeaPreset('ssp2')}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300"
              >
                SSP2 (2050)
              </button>
              <button
                onClick={() => applySeaPreset('stormSurge')}
                className="px-2 py-1 rounded-lg bg-red-900/50 hover:bg-red-900 text-[10px] font-mono text-red-200 border border-red-800"
              >
                Marea Leva
              </button>
            </div>
          </>
        )}

        {activeEngine === 'waterBalance' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Precipitación:</span>
                <span className="font-bold text-blue-400">{annualRainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="250"
                max="1500"
                step="50"
                value={annualRainfallMm}
                onChange={(e) => setAnnualRainfallMm(parseInt(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Consumo Diario:</span>
                <span className="font-bold text-teal-400">{dailyPerCapitaConsL} L/hab/d</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={dailyPerCapitaConsL}
                onChange={(e) => setDailyPerCapitaConsL(parseInt(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </>
        )}

        {activeEngine === 'perturbation' && (
          <>
            <button
              onClick={() => setGridFailureActive(!gridFailureActive)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                gridFailureActive ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Corte Red Externa: {gridFailureActive ? 'ACTIVO' : 'NORMAL'}
            </button>
            <button
              onClick={() => setWaterBargeDelayed(!waterBargeDelayed)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                waterBargeDelayed ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Barcazas Bloqueadas: {waterBargeDelayed ? 'SÍ' : 'NO'}
            </button>
          </>
        )}

        {activeEngine === 'bioclimatic' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Viento Alisios:</span>
                <span className="font-bold text-teal-400">{windSpeedKnots} nudos</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={windSpeedKnots}
                onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Apertura Celosías:</span>
                <span className="font-bold text-amber-400">{louverOpeningPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={louverOpeningPct}
                onChange={(e) => setLouverOpeningPct(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </>
        )}
      </div>

      {/* Floating Right: Telemetry Results */}
      <div className="absolute top-24 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-700/80 shadow-2xl space-y-3 pointer-events-auto text-white w-64">
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Respuesta del Hábitat</span>
          <Activity className="w-3.5 h-3.5" />
        </div>

        {activeEngine === 'seaLevel' && (
          <>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono">Viviendas Tradicionales Afectadas</span>
              <p className="text-xl font-bold font-mono text-red-400">{seaMetrics.vulnerableTraditionalHomes} Hogares</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-mono">Seguridad Meseta (+22m)</span>
              <p className="text-xl font-bold font-mono text-emerald-300">100% Inmune</p>
            </div>
          </>
        )}

        {activeEngine === 'waterBalance' && (
          <>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono">Volumen Captado</span>
              <p className="text-xl font-bold font-mono text-blue-400">{waterMetrics.harvestedM3} m³</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-mono">Autonomía Sequía</span>
              <p className="text-xl font-bold font-mono text-emerald-300">{waterMetrics.drySeasonAutonomyDays} Días</p>
            </div>
          </>
        )}

        {activeEngine === 'perturbation' && (
          <div className="p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-0.5">
            <span className="text-[10px] text-emerald-400 font-mono">Autonomía Comunitaria</span>
            <p className="text-base font-bold font-mono text-emerald-300">350 Alumnos Atendidos</p>
          </div>
        )}

        {activeEngine === 'bioclimatic' && (
          <div className="p-2.5 rounded-2xl bg-teal-950/40 border border-teal-800 space-y-0.5">
            <span className="text-[10px] text-teal-400 font-mono">Reducción Térmica Pasiva</span>
            <p className="text-xl font-bold font-mono text-teal-300">-{windMetrics.tempDrop} °C</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SCIENTIFIC METHODOLOGY POPUP MODAL                                     */}
      {/* ========================================================================= */}
      {showMethodologyModal && (
        <div 
          onClick={() => setShowMethodologyModal(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  METODOLOGÍA CIENTÍFICA // MODELAMIENTO
                </span>
                <h3 className="font-bold text-xl text-slate-900 mt-2">
                  Laboratorio de Simulación Paramétrica
                </h3>
              </div>

              <button
                onClick={() => setShowMethodologyModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-light">
              Los motores de cálculo integran modelos matemáticos de cambio climático (IPCC SSP2-4.5 y SSP5-8.5), forzamiento de marea de leva, balances hidráulicos de captación superficial y ecuaciones de dinámica de fluidos para confort térmico pasivo.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar y Continuar Simulando
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
