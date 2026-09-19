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
  Gauge
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function SimulationLab() {
  const [activeEngine, setActiveEngine] = useState('seaLevel'); // 'seaLevel' | 'waterBalance' | 'perturbation' | 'bioclimatic'

  // =========================================================================
  // ENGINE 1: SIMULADOR DE EROSIÓN & NIVEL DEL MAR (IPCC / COSTAS)
  // =========================================================================
  const [seaRiseCm, setSeaRiseCm] = useState(25); // 0 a 150 cm
  const [erosionRateYear, setErosionRateYear] = useState(1.8); // 0.5 a 4.0 m/año
  const [timeHorizonYears, setTimeHorizonYears] = useState(24); // 2026 a 2050 (24 años)

  // Sea level calculations
  const seaMetrics = useMemo(() => {
    const totalBeachLoss = (erosionRateYear * timeHorizonYears).toFixed(1);
    // At baseline: 120 homes vulnerable.
    // As erosion exceeds 15m, more homes in traditional shoreline fail
    const vulnerableTraditionalHomes = Math.min(
      120,
      Math.round(40 + (parseFloat(totalBeachLoss) / 40) * 80 + seaRiseCm * 0.3)
    );
    const aquiferSalinityPsu = Math.min(42, (28 + seaRiseCm * 0.12).toFixed(1));
    const plateauSafetyPercent = 100; // Plateau at +22m is immune

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
      setTimeHorizonYears(24); // 2050
    } else if (preset === 'ssp5') {
      setSeaRiseCm(85);
      setErosionRateYear(3.2);
      setTimeHorizonYears(50); // 2076
    } else if (preset === 'stormSurge') {
      setSeaRiseCm(120);
      setErosionRateYear(4.0);
      setTimeHorizonYears(10);
    }
  };

  // =========================================================================
  // ENGINE 2: SIMULADOR DE BALANCE HÍDRICO & SEQUÍA (ALJIBE 450.000 L)
  // =========================================================================
  const [annualRainfallMm, setAnnualRainfallMm] = useState(950); // 250 a 1500 mm
  const [dailyPerCapitaConsL, setDailyPerCapitaConsL] = useState(40); // 20 a 80 L/hab/día
  const [catchmentAreaM2, setCatchmentAreaM2] = useState(8330); // 1850m2 colegio + 6480m2 casas
  const [runoffCoeff, setRunoffCoeff] = useState(0.85);

  const waterMetrics = useMemo(() => {
    // Volume collected in m3 = (Rainfall in m) * Area * Coeff
    const rainfallM = annualRainfallMm / 1000;
    const harvestedM3 = rainfallM * catchmentAreaM2 * runoffCoeff;
    const harvestedLitres = harvestedM3 * 1000;

    // Total community population ~ 480 people in the 120 relocated units
    const annualDemandLitres = 480 * dailyPerCapitaConsL * 365;
    const centralCisternCapacity = 450000; // 450kL
    
    // Fill ratio and autonomy in days during zero-rain dry season
    const dailyDemandLitres = 480 * dailyPerCapitaConsL;
    const drySeasonAutonomyDays = Math.min(180, Math.round(centralCisternCapacity / dailyDemandLitres));
    const annualBalanceLitres = harvestedLitres - annualDemandLitres;
    const fillPercent = Math.min(100, Math.round((harvestedLitres / (centralCisternCapacity * 2.5)) * 100));

    // Economic savings vs boat water in Cartagena ($8.000 COP per 20L pimpina = $400 COP/L)
    const annualSavingsCopMillions = ((harvestedLitres * 350) / 1000000).toFixed(1);

    return {
      harvestedM3: Math.round(harvestedM3),
      harvestedLitres: Math.round(harvestedLitres),
      drySeasonAutonomyDays,
      annualBalanceLitres: Math.round(annualBalanceLitres),
      fillPercent,
      annualSavingsCopMillions
    };
  }, [annualRainfallMm, dailyPerCapitaConsL, catchmentAreaM2, runoffCoeff]);

  const applyWaterPreset = (preset) => {
    if (preset === 'average') {
      setAnnualRainfallMm(950);
      setDailyPerCapitaConsL(40);
    } else if (preset === 'elNinoDry') {
      setAnnualRainfallMm(380);
      setDailyPerCapitaConsL(30);
    } else if (preset === 'laNinaWet') {
      setAnnualRainfallMm(1400);
      setDailyPerCapitaConsL(50);
    } else if (preset === 'emergency') {
      setAnnualRainfallMm(300);
      setDailyPerCapitaConsL(20);
    }
  };

  // =========================================================================
  // ENGINE 3: PERTURBACIÓN & CAPACIDAD DOTACIONAL (STRESS TEST)
  // =========================================================================
  const [selectedScenario, setSelectedScenario] = useState('schoolDay'); // 'schoolDay' | 'assembly' | 'dryEmergency' | 'surgeRefuge'

  const perturbationScenarios = {
    schoolDay: {
      name: "Día Escolar Estándar",
      users: 350,
      flowLmin: 45,
      powerKw: 6.2,
      batteryHours: 18,
      occupancy: 65,
      status: "Operación Normal",
      statusColor: "text-emerald-600 dark:text-emerald-400"
    },
    assembly: {
      name: "Asamblea Comunal / Fin de Semana",
      users: 850,
      flowLmin: 110,
      powerKw: 11.5,
      batteryHours: 12,
      occupancy: 88,
      status: "Alta Demanda Cívica",
      statusColor: "text-amber-600 dark:text-amber-400"
    },
    dryEmergency: {
      name: "Emergencia por Sequía (Dispensario 100%)",
      users: 1200,
      flowLmin: 160,
      powerKw: 15.0,
      batteryHours: 9,
      occupancy: 95,
      status: "Capacidad Máxima Hidráulica",
      statusColor: "text-blue-600 dark:text-blue-400"
    },
    surgeRefuge: {
      name: "Refugio Temporal por Alerta Marina",
      users: 600,
      flowLmin: 90,
      powerKw: 14.2,
      batteryHours: 14,
      occupancy: 92,
      status: "Nodo de Resguardo y Asistencia",
      statusColor: "text-terracotta-600 dark:text-terracotta-400"
    }
  };

  const currentPerturbation = perturbationScenarios[selectedScenario];

  // =========================================================================
  // ENGINE 4: CONFORT BIOCLIMÁTICO & TÚNEL DE VIENTO PASIVO
  // =========================================================================
  const [windSpeedKnots, setWindSpeedKnots] = useState(18); // 5 a 30 nudos
  const [windAngleDeg, setWindAngleDeg] = useState(15); // 0 a 90 deg
  const [louverOpeningPct, setLouverOpeningPct] = useState(75); // 25 to 100%

  const bioclimaticMetrics = useMemo(() => {
    // Air velocity inside through cross ventilation
    const angleEfficiency = Math.cos((Math.abs(windAngleDeg - 15) * Math.PI) / 180);
    const rawIndoorVelocity = (windSpeedKnots * 0.514 * (louverOpeningPct / 100) * 0.35 * Math.max(0.2, angleEfficiency)).toFixed(2);
    
    // Air Changes per Hour (ACH)
    const ach = Math.round(parseFloat(rawIndoorVelocity) * 22);
    
    // Radiant temperature delta reduction (-1.5C to -6.5C)
    const tempDrop = (1.5 + parseFloat(rawIndoorVelocity) * 2.8 + (louverOpeningPct / 100) * 1.5).toFixed(1);

    // Thermal comfort category
    let comfortState = "Confort Óptimo (ASHRAE 55)";
    if (parseFloat(tempDrop) < 2.5) comfortState = "Sensación Cálida Moderada";
    if (parseFloat(tempDrop) > 5.0) comfortState = "Excelente Confort Pasivo";

    return {
      indoorVelocity: rawIndoorVelocity,
      ach,
      tempDrop,
      comfortState
    };
  }, [windSpeedKnots, windAngleDeg, louverOpeningPct]);

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand-300/60 dark:border-deepsea-800 pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-mono font-medium border border-terracotta-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>MÓDULO 08 &bull; MODELAMIENTO DINÁMICO & SIMULACIONES</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-deepsea-950 dark:text-sand-100 tracking-tight leading-tight">
            Laboratorio de Simulaciones & Modelamiento
          </h2>
          <p className="text-deepsea-900/70 dark:text-sand-300/70 text-base font-light max-w-3xl leading-relaxed">
            Explora de manera interactiva cómo responden el territorio, la infraestructura hídrica, el equipamiento y las viviendas de Tierrabomba ante variaciones en la demanda, eventos climáticos extremos y perturbaciones de red.
          </p>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-sand-200/80 dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 text-xs font-mono self-start">
          <button
            onClick={() => setActiveEngine('seaLevel')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeEngine === 'seaLevel'
                ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                : 'text-deepsea-700 dark:text-sand-400 hover:text-deepsea-950 dark:hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>01. Nivel del Mar</span>
          </button>

          <button
            onClick={() => setActiveEngine('waterBalance')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeEngine === 'waterBalance'
                ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                : 'text-deepsea-700 dark:text-sand-400 hover:text-deepsea-950 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>02. Balance Hídrico</span>
          </button>

          <button
            onClick={() => setActiveEngine('perturbation')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeEngine === 'perturbation'
                ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                : 'text-deepsea-700 dark:text-sand-400 hover:text-deepsea-950 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>03. Perturbación & Red</span>
          </button>

          <button
            onClick={() => setActiveEngine('bioclimatic')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeEngine === 'bioclimatic'
                ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                : 'text-deepsea-700 dark:text-sand-400 hover:text-deepsea-950 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>04. Confort Eólico</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SIMULATOR 01: SEA LEVEL & COASTAL EROSION                             */}
      {/* ===================================================================== */}
      {activeEngine === 'seaLevel' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Presets Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-deepsea-700 dark:text-sand-300">
              <Sliders className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
              <span className="font-bold">Escenarios Preconfigurados (IPCC):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applySeaPreset('base2026')}
                className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-deepsea-800 hover:bg-sand-300 dark:hover:bg-deepsea-700 text-xs font-mono font-medium transition-colors"
              >
                Base 2026
              </button>
              <button
                onClick={() => applySeaPreset('ssp2')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 text-xs font-mono font-medium transition-colors"
              >
                SSP2-4.5 (2050 Moderado)
              </button>
              <button
                onClick={() => applySeaPreset('ssp5')}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 hover:bg-red-500/20 text-xs font-mono font-medium transition-colors"
              >
                SSP5-8.5 (2076 Extremo)
              </button>
              <button
                onClick={() => applySeaPreset('stormSurge')}
                className="px-3 py-1.5 rounded-lg bg-terracotta-600 text-white hover:bg-terracotta-500 text-xs font-mono font-medium transition-colors shadow-sm"
              >
                Marea de Leva + Tormenta
              </button>
            </div>
          </div>

          {/* Interactive Controls & Real-Time Metrics Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Sliders Panel */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-xl space-y-6">
              <h3 className="font-serif font-bold text-xl text-deepsea-950 dark:text-sand-100 border-b border-sand-300/60 dark:border-deepsea-800 pb-3">
                Parámetros de Forzamiento Marino
              </h3>

              {/* Slider 1: Sea level rise */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Aumento del Nivel del Mar:</span>
                  <span className="font-bold text-terracotta-600 dark:text-terracotta-400 bg-terracotta-500/10 px-2 py-0.5 rounded">
                    +{seaRiseCm} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={seaRiseCm}
                  onChange={(e) => setSeaRiseCm(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>0 cm (Actual)</span>
                  <span>+75 cm</span>
                  <span>+150 cm (Catastrófico)</span>
                </div>
              </div>

              {/* Slider 2: Coastal erosion rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Tasa de Retiro de Playa:</span>
                  <span className="font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                    {erosionRateYear} m/año
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={erosionRateYear}
                  onChange={(e) => setErosionRateYear(parseFloat(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>0.5 m/año</span>
                  <span>1.8 m/año (Base)</span>
                  <span>4.0 m/año</span>
                </div>
              </div>

              {/* Slider 3: Time Horizon */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Horizonte Temporal de Proyección:</span>
                  <span className="font-bold text-deepsea-950 dark:text-sand-100 bg-sand-200 dark:bg-deepsea-800 px-2 py-0.5 rounded">
                    Año {seaMetrics.targetYear} ({timeHorizonYears} años)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="74"
                  step="1"
                  value={timeHorizonYears}
                  onChange={(e) => setTimeHorizonYears(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-deepsea-600 dark:accent-sand-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>2026</span>
                  <span>2050 (+24a)</span>
                  <span>2100 (+74a)</span>
                </div>
              </div>

            </div>

            {/* Right Simulation Results & Dynamic Impact Gauges */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Metric 1: Total Shoreline Loss */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Retiro Acumulado Borde</span>
                    <Waves className="w-4 h-4 text-red-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-red-600 dark:text-red-400">
                    -{seaMetrics.totalBeachLoss} metros
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Franja de arena y patio perdida frente a las viviendas no reubicadas.
                  </p>
                </div>

                {/* Metric 2: Vulnerable Traditional Homes */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Viviendas en Riesgo Inminente</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-amber-600 dark:text-amber-400">
                    {seaMetrics.vulnerableTraditionalHomes} de 120
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Hogares con socavación estructural si permanecieran en cota 0.00.
                  </p>
                </div>

                {/* Metric 3: Salinity Intrusion */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Salinidad Acuíferos Borde</span>
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-blue-600 dark:text-blue-400">
                    {seaMetrics.aquiferSalinityPsu} PSU
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Agua no apta para consumo humano en pozos tradicionales (Límite: 0.5 PSU).
                  </p>
                </div>

                {/* Metric 4: Plateau Safety Level */}
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    <span>Seguridad en Meseta (+22m)</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-emerald-700 dark:text-emerald-300">
                    100% Inmune
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-200 font-light">
                    El Plan Maestro garantiza 0 viviendas afectadas por oleaje y mareas.
                  </p>
                </div>

              </div>

              {/* Comparative Diagnostic Insight Box */}
              <div className="p-5 rounded-2xl bg-deepsea-950 text-white border border-deepsea-800 space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-2 text-terracotta-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Conclusión del Modelo al Año {seaMetrics.targetYear}:</span>
                </div>
                <p className="text-sand-300 font-sans font-light leading-relaxed">
                  Bajo un forzamiento de <b>+{seaRiseCm} cm</b> de marea y <b>{erosionRateYear} m/año</b> de socavación, permanecer en el borde costero tradicional implicaría el colapso de <b>{seaMetrics.vulnerableTraditionalHomes} viviendas</b>. La relocalización propuesta en la cota <b>+22.00 m.s.n.m.</b> elimina el 100% de la vulnerabilidad física.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* SIMULATOR 02: WATER BALANCE & DROUGHT STRESS (ALJIBE 450.000 L)       */}
      {/* ===================================================================== */}
      {activeEngine === 'waterBalance' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Presets Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-deepsea-700 dark:text-sand-300">
              <Sliders className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
              <span className="font-bold">Escenarios Pluviométricos:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyWaterPreset('average')}
                className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-deepsea-800 hover:bg-sand-300 text-xs font-mono font-medium transition-colors"
              >
                Año Promedio (950 mm)
              </button>
              <button
                onClick={() => applyWaterPreset('elNinoDry')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-mono font-medium transition-colors"
              >
                Sequía Fenómeno El Niño (380 mm)
              </button>
              <button
                onClick={() => applyWaterPreset('laNinaWet')}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-mono font-medium transition-colors"
              >
                Lluvias Intensas La Niña (1.400 mm)
              </button>
              <button
                onClick={() => applyWaterPreset('emergency')}
                className="px-3 py-1.5 rounded-lg bg-terracotta-600 text-white hover:bg-terracotta-500 text-xs font-mono font-medium transition-colors"
              >
                Régimen de Racionamiento (20 L/hab)
              </button>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sliders Panel */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-xl space-y-6">
              <h3 className="font-serif font-bold text-xl text-deepsea-950 dark:text-sand-100 border-b border-sand-300/60 dark:border-deepsea-800 pb-3">
                Variables de Demanda & Captación
              </h3>

              {/* Slider 1: Annual Rainfall */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Precipitación Anual Insular:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {annualRainfallMm} mm/año
                  </span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1500"
                  step="25"
                  value={annualRainfallMm}
                  onChange={(e) => setAnnualRainfallMm(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>250 mm (Sequía)</span>
                  <span>950 mm (Media)</span>
                  <span>1.500 mm (Máx)</span>
                </div>
              </div>

              {/* Slider 2: Daily consumption */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Consumo Diario per Cápita:</span>
                  <span className="font-bold text-terracotta-600 dark:text-terracotta-400 bg-terracotta-500/10 px-2 py-0.5 rounded">
                    {dailyPerCapitaConsL} L / habitante / día
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={dailyPerCapitaConsL}
                  onChange={(e) => setDailyPerCapitaConsL(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>20 L (Emergencia)</span>
                  <span>40 L (Bioclimático)</span>
                  <span>80 L (Dotación OMS)</span>
                </div>
              </div>

              {/* Slider 3: Runoff Coeff */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Eficiencia de Cubierta (Escorrentía):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {Math.round(runoffCoeff * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.70"
                  max="0.95"
                  step="0.05"
                  value={runoffCoeff}
                  onChange={(e) => setRunoffCoeff(parseFloat(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

            </div>

            {/* Results Grid */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Metric 1: Harvested volume */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Volumen Anual Captado</span>
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-blue-600 dark:text-blue-400">
                    {waterMetrics.harvestedM3.toLocaleString()} m³
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    {waterMetrics.harvestedLitres.toLocaleString()} Litros colectados en 8.330 m² de cubiertas.
                  </p>
                </div>

                {/* Metric 2: Dry season autonomy */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Autonomía en Sequía Cero Lluvia</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                    {waterMetrics.drySeasonAutonomyDays} días
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Suministro continuo garantizado desde el aljibe de 450.000 L.
                  </p>
                </div>

                {/* Metric 3: Economic savings */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Ahorro Comunitario Anual</span>
                    <TrendingUp className="w-4 h-4 text-terracotta-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-terracotta-600 dark:text-terracotta-400">
                    ${waterMetrics.annualSavingsCopMillions}M COP
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Gasto no incurrido en compra de pimpinas a barcazas de Cartagena.
                  </p>
                </div>

                {/* Metric 4: Net Water Balance */}
                <div className="p-5 rounded-2xl bg-sand-100/80 dark:bg-deepsea-950 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Balance Hidráulico Neto</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className={`font-serif font-bold text-3xl ${
                    waterMetrics.annualBalanceLitres >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {waterMetrics.annualBalanceLitres >= 0 ? `+${(waterMetrics.annualBalanceLitres / 1000).toFixed(0)} m³` : `${(waterMetrics.annualBalanceLitres / 1000).toFixed(0)} m³`}
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    {waterMetrics.annualBalanceLitres >= 0 
                      ? 'Superávit aprovechable para bio-humedales y huertos comunales.' 
                      : 'Requiere activación de protocolos de contingencia de bajo caudal.'}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* SIMULATOR 03: PERTURBATION & CAPACITY (EQUIPAMIENTO & DISPENSARIO)    */}
      {/* ===================================================================== */}
      {activeEngine === 'perturbation' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Scenario Selector Tabs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {Object.entries(perturbationScenarios).map(([key, sc]) => {
              const isSelected = selectedScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 border ${
                    isSelected
                      ? 'bg-white dark:bg-deepsea-900 border-terracotta-500 shadow-md ring-1 ring-terracotta-400/30'
                      : 'bg-white/60 dark:bg-deepsea-900/40 border-sand-300/60 dark:border-deepsea-800 hover:border-sand-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sand-200 dark:bg-deepsea-800 text-deepsea-700 dark:text-sand-300">
                      {sc.users} Usuarios
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />}
                  </div>
                  <h4 className="font-display font-bold text-sm text-deepsea-950 dark:text-sand-100">
                    {sc.name}
                  </h4>
                  <p className={`text-xs font-mono mt-1 ${sc.statusColor}`}>
                    {sc.status}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detailed Dashboard */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-300/60 dark:border-deepsea-800 pb-4">
              <div>
                <span className="text-xs font-mono text-terracotta-600 dark:text-terracotta-400 font-bold uppercase">
                  Respuesta del Complejo Educativo & Cívico
                </span>
                <h3 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100 mt-0.5">
                  {currentPerturbation.name}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold bg-sand-100 dark:bg-deepsea-950 border border-current ${currentPerturbation.statusColor}`}>
                {currentPerturbation.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Ocupación */}
              <div className="p-4 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-300/60 dark:border-deepsea-800/80">
                <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400">Ocupación Espacial</span>
                <h4 className="font-serif font-bold text-2xl text-deepsea-950 dark:text-sand-100 mt-1">
                  {currentPerturbation.occupancy}%
                </h4>
                <div className="w-full h-1.5 bg-sand-200 dark:bg-deepsea-800 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-terracotta-600 rounded-full transition-all duration-500" 
                    style={{ width: `${currentPerturbation.occupancy}%` }} 
                  />
                </div>
              </div>

              {/* Metric 2: Caudal Dispensado */}
              <div className="p-4 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-300/60 dark:border-deepsea-800/80">
                <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400">Caudal de Dispensación</span>
                <h4 className="font-serif font-bold text-2xl text-blue-600 dark:text-blue-400 mt-1">
                  {currentPerturbation.flowLmin} L/min
                </h4>
                <p className="text-[11px] font-mono text-sand-500 mt-1">
                  {currentPerturbation.users} personas servidas
                </p>
              </div>

              {/* Metric 3: Demanda Solar */}
              <div className="p-4 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-300/60 dark:border-deepsea-800/80">
                <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400">Carga Eléctrica Fotovoltaica</span>
                <h4 className="font-serif font-bold text-2xl text-amber-600 dark:text-amber-400 mt-1">
                  {currentPerturbation.powerKw} kW
                </h4>
                <p className="text-[11px] font-mono text-sand-500 mt-1">
                  Bombeo solar + Iluminación
                </p>
              </div>

              {/* Metric 4: Battery Reserve */}
              <div className="p-4 rounded-xl bg-sand-50 dark:bg-deepsea-950 border border-sand-300/60 dark:border-deepsea-800/80">
                <span className="text-xs font-mono text-deepsea-700/60 dark:text-sand-400">Respaldo Baterías LiFePO4</span>
                <h4 className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
                  {currentPerturbation.batteryHours} horas
                </h4>
                <p className="text-[11px] font-mono text-sand-500 mt-1">
                  Autonomía nocturna continua
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* SIMULATOR 04: BIOCLIMATIC COMFORT & WIND TUNNEL                       */}
      {/* ===================================================================== */}
      {activeEngine === 'bioclimatic' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Controls */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-xl space-y-6">
              <h3 className="font-serif font-bold text-xl text-deepsea-950 dark:text-sand-100 border-b border-sand-300/60 dark:border-deepsea-800 pb-3">
                Variables de Microclima & Viento
              </h3>

              {/* Slider 1: Wind speed */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Velocidad del Alisio:</span>
                  <span className="font-bold text-caribbean-600 dark:text-caribbean-400 bg-caribbean-500/10 px-2 py-0.5 rounded">
                    {windSpeedKnots} nudos ({(windSpeedKnots * 1.852).toFixed(1)} km/h)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="32"
                  step="1"
                  value={windSpeedKnots}
                  onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-caribbean-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>5 kts (Calma)</span>
                  <span>18 kts (Media Caribe)</span>
                  <span>32 kts (Fuerte)</span>
                </div>
              </div>

              {/* Slider 2: Louver opening */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Apertura de Celosías BTC:</span>
                  <span className="font-bold text-terracotta-600 dark:text-terracotta-400 bg-terracotta-500/10 px-2 py-0.5 rounded">
                    {louverOpeningPct}% Apertura
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="100"
                  step="25"
                  value={louverOpeningPct}
                  onChange={(e) => setLouverOpeningPct(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-sand-500">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Slider 3: Wind Angle */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-deepsea-800/80 dark:text-sand-300">Ángulo de Incidencia Alisio:</span>
                  <span className="font-bold text-deepsea-950 dark:text-sand-100 bg-sand-200 dark:bg-deepsea-800 px-2 py-0.5 rounded">
                    {windAngleDeg}° ({windAngleDeg <= 30 ? 'N-NE Óptimo' : 'E-NE Lateral'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={windAngleDeg}
                  onChange={(e) => setWindAngleDeg(parseInt(e.target.value))}
                  className="w-full h-2 bg-sand-300 dark:bg-deepsea-800 rounded-lg appearance-none cursor-pointer accent-deepsea-600 dark:accent-sand-400"
                />
              </div>

            </div>

            {/* Results */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Metric 1: Indoor Velocity */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Velocidad Interior del Aire</span>
                    <Wind className="w-4 h-4 text-caribbean-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-caribbean-600 dark:text-caribbean-400">
                    {bioclimaticMetrics.indoorVelocity} m/s
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Rango óptimo para evaporación y confort térmico en el trópico.
                  </p>
                </div>

                {/* Metric 2: Air Changes per Hour */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Renovaciones de Aire (ACH)</span>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                    {bioclimaticMetrics.ach} / hora
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Ventilación cruzada continua que expulsa el calor acumulado en techos.
                  </p>
                </div>

                {/* Metric 3: Temp Drop */}
                <div className="p-5 rounded-2xl bg-white dark:bg-deepsea-900 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Reducción de Sensación Térmica</span>
                    <Thermometer className="w-4 h-4 text-terracotta-500" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-terracotta-600 dark:text-terracotta-400">
                    -{bioclimaticMetrics.tempDrop} °C
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Efecto convectivo pasivo sin necesidad de aire acondicionado mecánico.
                  </p>
                </div>

                {/* Metric 4: Comfort Standard */}
                <div className="p-5 rounded-2xl bg-sand-100/80 dark:bg-deepsea-950 border border-sand-300/80 dark:border-deepsea-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-deepsea-700/60 dark:text-sand-400">
                    <span>Norma de Confort Térmico</span>
                    <Gauge className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400">
                    {bioclimaticMetrics.comfortState}
                  </h4>
                  <p className="text-xs text-deepsea-700/70 dark:text-sand-400 font-light">
                    Cumplimiento de estándares de confort adaptativo tropical.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
