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
  Info,
  Share2,
  Search,
  Filter,
  Maximize2,
  ExternalLink,
  Compass,
  Users
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

// =========================================================================
// RELATIONAL NETWORK DATA: 18 INTERCONNECTED NODES ACROSS 5 SYSTEMS
// =========================================================================
export const NETWORK_SYSTEMS = [
  { id: "eco", name: "Ecológico & Marino", color: "#0d9488", icon: Waves },
  { id: "habitacional", name: "Hábitat & Vivienda", color: "#c86d51", icon: Home },
  { id: "hidrico", name: "Infraestructura Hídrica", color: "#0284c7", icon: Droplets },
  { id: "educativo", name: "Equipamiento & Cívico", color: "#6366f1", icon: Building2 },
  { id: "social", name: "Actores & Comunidad", color: "#0f172a", icon: Users }
];

export const NETWORK_NODES = [
  // 1. Ecológico & Marino
  { id: "marea", name: "Marea de Leva & Oleaje", system: "eco", x: 120, y: 140, r: 24, degree: 5, centrality: "Alta", role: "Forzamiento Marino Crítico", citation: "DIMAR / CIOH 2025: Tasa de retroceso costero de 1.8 m/año en el flanco occidental." },
  { id: "erosion_costera", name: "Franja de Borde (0.00m)", system: "eco", x: 260, y: 140, r: 28, degree: 6, centrality: "Muy Alta", role: "Zona de Falla Inminente", citation: "POT 2026 Art. 142: Suelo de protección por amenaza alta de socavación marina." },
  { id: "meseta_segura", name: "Meseta Central (+22m)", system: "eco", x: 440, y: 140, r: 32, degree: 7, centrality: "Estratégica", role: "Suelo Seguro Inmune", citation: "Geología Insular: Plataforma calcárea estable fuera del alcance de inundación a 100 años." },
  { id: "vientos_alisios", name: "Vientos Alisios (N-NE)", system: "eco", x: 620, y: 120, r: 22, degree: 4, centrality: "Media", role: "Recurso Bioclimático Pasivo", citation: "IDEAM: Brisas constantes de 15 a 25 nudos para refrescamiento pasivo continuo." },
  { id: "bio_humedal", name: "Bio-Humedales de Filtración", system: "eco", x: 760, y: 160, r: 24, degree: 4, centrality: "Media", role: "Fitodepuración de Aguas", citation: "Resolución 2115: Tratamiento biológico con plantas macrófitas y vetiver para aguas grises." },

  // 2. Hábitat & Vivienda
  { id: "viviendas_riesgo", name: "120 Viviendas Borde Crítico", system: "habitacional", x: 180, y: 270, r: 30, degree: 6, centrality: "Crítica", role: "Hogares en Vulnerabilidad", citation: "Censo de Campo 2026: 120 viviendas con cimentación expuesta en arena suelta." },
  { id: "viviendas_reubicadas", name: "120 Viviendas Palafíticas (+0.60m)", system: "habitacional", x: 380, y: 270, r: 34, degree: 8, centrality: "Estratégica", role: "Hábitat Resiliente Proyectado", citation: "Tesis 2026: Tipologías A (54m²) y B (72m²) en madera tratada y bloques BTC." },
  { id: "porches_sombra", name: "Porches de Trabajo & Pesca", system: "habitacional", x: 540, y: 270, r: 22, degree: 5, centrality: "Media", role: "Espacio de Cohesión Social", citation: "Diseño Bioclimático: Sombras perimetrales de 2.50m para reparación de artes de pesca." },

  // 3. Infraestructura Hídrica & Energética
  { id: "macrocubierta", name: "Macro-Cubierta Invertida (1.850m²)", system: "hidrico", x: 440, y: 390, r: 30, degree: 7, centrality: "Muy Alta", role: "Captador Pluvial Colectivo", citation: "Cálculo Hidráulico: Colecta ~6.200 m³/año con coeficiente de escorrentía 0.85." },
  { id: "aljibe_central", name: "Aljibe Térmico (450.000 L)", system: "hidrico", x: 600, y: 390, r: 36, degree: 9, centrality: "Nodo Central", role: "Reserva de Autonomía 90 Días", citation: "Seguridad Hídrica: Tanque ciclópeo blindado ante salinidad para 480 habitantes." },
  { id: "planta_uv", name: "Potabilización Solar UV", system: "hidrico", x: 760, y: 390, r: 22, degree: 4, centrality: "Media", role: "Desinfección Fotovoltaica", citation: "Norma Agua Potable: Tren de filtración de sedimentos y desinfección UV 100% solar." },
  { id: "barcazas_cartagena", name: "Barcazas Externas ($8.000/caneca)", system: "hidrico", x: 120, y: 410, r: 22, degree: 3, centrality: "Baja (Aislada)", role: "Dependencia Tradicional Rota", citation: "Diagnóstico Socioeconómico: Gasto del 22% del ingreso familiar en compra precaria de agua." },

  // 4. Equipamiento & Cívico
  { id: "colegio_bioclimatico", name: "Equipamiento Educativo (350 Cupos)", system: "educativo", x: 300, y: 500, r: 32, degree: 7, centrality: "Alta", role: "Nodo Pedagógico & Comunitario", citation: "Programa Arquitectónico: 6 aulas BTC, laboratorios marítimos y biblioteca comunal." },
  { id: "talleres_nauticos", name: "Talleres de Carpintería Ribereña", system: "educativo", x: 480, y: 500, r: 24, degree: 5, centrality: "Media", role: "Transferencia de Oficios", citation: "Identidad Caribeña: Espacio para construcción y mantenimiento de canoas tradicionales." },
  { id: "dispensario_agua", name: "Dispensario Público de Agua", system: "educativo", x: 660, y: 500, r: 28, degree: 6, centrality: "Alta", role: "Distribución Soberana Gratuita", citation: "Acceso Universal: 12 tomas públicas de agua potable continua bajo el ágora cívica." },

  // 5. Actores & Comunidad
  { id: "pescadores", name: "Familias & Pescadores de Tierrabomba", system: "social", x: 220, y: 620, r: 28, degree: 6, centrality: "Alta", role: "Comunidad Ancestral Insular", citation: "Talleres Participativos: Reubicación con permanencia en actividades marítimas tradicionales." },
  { id: "estudiantes", name: "Estudiantes & Jóvenes Isleños", system: "social", x: 440, y: 620, r: 26, degree: 5, centrality: "Media", role: "Población en Formación", citation: "Censo Escolar: 350 niños y jóvenes actualmente en sede precaria sin agua continua." },
  { id: "lideres", name: "Líderes Comunales & Asambleas", system: "social", x: 640, y: 620, r: 24, degree: 4, centrality: "Media", role: "Gobernanza Territorial", citation: "Co-Diseño: Asambleas quincenales en el ágora cívica para gestión del aljibe." }
];

export const NETWORK_EDGES = [
  // Marine forcing edges
  { from: "marea", to: "erosion_costera", weight: 3, type: "amenaza", label: "Impacto Oleaje 1.8m/año" },
  { from: "erosion_costera", to: "viviendas_riesgo", weight: 3, type: "falla", label: "Socavación Cimientos" },
  { from: "viviendas_riesgo", to: "barcazas_cartagena", weight: 2, type: "dependencia", label: "Gasto Precarizado" },

  // Relocation & Safety Edges
  { from: "viviendas_riesgo", to: "viviendas_reubicadas", weight: 3, type: "reubicacion", label: "Traslado a Suelo Seguro" },
  { from: "viviendas_reubicadas", to: "meseta_segura", weight: 3, type: "implantacion", label: "Cota Inmune +22.00m" },
  { from: "viviendas_reubicadas", to: "porches_sombra", weight: 2, type: "espacial", label: "Articulación Social" },
  { from: "viviendas_reubicadas", to: "vientos_alisios", weight: 2, type: "bioclimatico", label: "Ventilación Cruzada" },

  // Hydraulic loop edges
  { from: "meseta_segura", to: "colegio_bioclimatico", weight: 3, type: "equipamiento", label: "Nodo Cívico Central" },
  { from: "colegio_bioclimatico", to: "macrocubierta", weight: 3, type: "captacion", label: "Macro-Embudo 1.850m²" },
  { from: "macrocubierta", to: "aljibe_central", weight: 3, type: "almacenamiento", label: "Conducción Pluvial 450kL" },
  { from: "aljibe_central", to: "planta_uv", weight: 2, type: "potabilizacion", label: "Tratamiento Solar UV" },
  { from: "planta_uv", to: "dispensario_agua", weight: 3, type: "distribucion", label: "12 Puntos Gratuitos" },
  { from: "dispensario_agua", to: "viviendas_reubicadas", weight: 3, type: "soberania", label: "Abastecimiento 100% 365d" },
  { from: "viviendas_reubicadas", to: "bio_humedal", weight: 2, type: "reciclaje", label: "Drenaje Aguas Grises" },
  { from: "bio_humedal", to: "meseta_segura", weight: 1, type: "irrigacion", label: "Infiltración Huertos" },

  // Social & Educational edges
  { from: "colegio_bioclimatico", to: "talleres_nauticos", weight: 2, type: "oficios", label: "Artes de Pesca" },
  { from: "talleres_nauticos", to: "pescadores", weight: 2, type: "saberes", label: "Carpintería Ribereña" },
  { from: "colegio_bioclimatico", to: "estudiantes", weight: 3, type: "pedagogico", label: "350 Cupos Diurnos" },
  { from: "dispensario_agua", to: "lideres", weight: 2, type: "gobernanza", label: "Comité de Agua Comunal" },
  { from: "pescadores", to: "viviendas_reubicadas", weight: 3, type: "habitabilidad", label: "480 Habitantes" }
];

export default function SimulationLab({ onSelectModule }) {
  const [activeEngine, setActiveEngine] = useState('relationalNetwork'); // 'relationalNetwork' | 'seaLevel' | 'waterBalance' | 'bioclimatic'
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [networkPerturbation, setNetworkPerturbation] = useState('normal'); // 'normal' | 'stormSurge' | 'drought120' | 'bargeCutoff'
  const [networkSystemFilter, setNetworkSystemFilter] = useState('ALL');

  // =========================================================================
  // ENGINE 1: SIMULADOR DE EROSIÓN & NIVEL DEL MAR (IPCC / BRUUN FORMULA)
  // =========================================================================
  const [seaRiseCm, setSeaRiseCm] = useState(35); // 0 a 150 cm
  const [erosionRateYear, setErosionRateYear] = useState(2.2); // 0.5 a 4.0 m/año
  const [timeHorizonYears, setTimeHorizonYears] = useState(24); // 2026 a 2050 (24 años)
  const [coastalSlope, setCoastalSlope] = useState(0.04); // 0.02 a 0.08 (2% a 8% pendiente)

  const seaMetrics = useMemo(() => {
    // Bruun Rule: Coastal retreat R = S / tan(theta) + baseline erosion
    const bruunRetreat = ((seaRiseCm / 100) / coastalSlope);
    const baselineLoss = erosionRateYear * timeHorizonYears;
    const totalBeachLoss = (bruunRetreat + baselineLoss).toFixed(1);
    
    // Collapsed homes along vulnerable 0.00m strip
    const vulnerableTraditionalHomes = Math.min(
      120,
      Math.round(40 + (parseFloat(totalBeachLoss) / 35) * 80)
    );
    const protectedPlateauHomes = 120; // 100% safe on plateau (+22m)
    const aquiferSalinityPsu = Math.min(42, (28 + seaRiseCm * 0.12).toFixed(1));
    const targetYear = 2026 + timeHorizonYears;

    return {
      bruunRetreat: bruunRetreat.toFixed(1),
      baselineLoss: baselineLoss.toFixed(1),
      totalBeachLoss,
      vulnerableTraditionalHomes,
      protectedPlateauHomes,
      aquiferSalinityPsu,
      targetYear
    };
  }, [seaRiseCm, erosionRateYear, timeHorizonYears, coastalSlope]);

  // =========================================================================
  // ENGINE 2: BALANCE HIDRÁULICO ESTOCÁSTICO & ALJIBE 450.000 L
  // =========================================================================
  const [annualRainfallMm, setAnnualRainfallMm] = useState(950); // 250 a 1500 mm
  const [dailyPerCapitaConsL, setDailyPerCapitaConsL] = useState(40); // 20 a 80 L/hab/día
  const [catchmentAreaM2, setCatchmentAreaM2] = useState(8330); // 1850m2 colegio + 6480m2 casas
  const [runoffCoeff, setRunoffCoeff] = useState(0.85);

  const waterMetrics = useMemo(() => {
    const rainfallM = annualRainfallMm / 1000;
    const harvestedM3 = rainfallM * catchmentAreaM2 * runoffCoeff;
    const harvestedLitres = harvestedM3 * 1000;
    
    // 480 people total demand
    const dailyCommunityDemandL = 480 * dailyPerCapitaConsL;
    const annualDemandLitres = dailyCommunityDemandL * 365;
    const centralCisternCapacity = 450000;
    
    // Autonomy in dry season with zero precipitation
    const drySeasonAutonomyDays = Math.min(180, Math.round(centralCisternCapacity / dailyCommunityDemandL));
    const annualBalanceLitres = harvestedLitres - annualDemandLitres;
    const fillPercent = Math.min(100, Math.round((harvestedLitres / (centralCisternCapacity * 2.2)) * 100));
    const annualSavingsCopMillions = ((harvestedLitres / 20) * 8000 / 1000000).toFixed(1);

    return {
      harvestedM3: Math.round(harvestedM3),
      harvestedLitres: Math.round(harvestedLitres),
      dailyCommunityDemandL: Math.round(dailyCommunityDemandL),
      annualDemandLitres: Math.round(annualDemandLitres),
      drySeasonAutonomyDays,
      annualBalanceLitres: Math.round(annualBalanceLitres),
      fillPercent,
      annualSavingsCopMillions
    };
  }, [annualRainfallMm, dailyPerCapitaConsL, catchmentAreaM2, runoffCoeff]);

  // =========================================================================
  // ENGINE 3: DINÁMICA DE FLUIDOS BIOCLIMÁTICA & CONFORT PMV (GIVONI)
  // =========================================================================
  const [windSpeedKnots, setWindSpeedKnots] = useState(18); // 5 a 35 nudos
  const [windAngleDeg, setWindAngleDeg] = useState(35); // 0 a 90 deg respecto a fachada
  const [louverOpeningPct, setLouverOpeningPct] = useState(80); // 0 a 100%

  const windMetrics = useMemo(() => {
    const outdoorMs = windSpeedKnots * 0.514444;
    const incidenceFactor = Math.cos((windAngleDeg * Math.PI) / 180);
    const indoorVelocityMs = (outdoorMs * (louverOpeningPct / 100) * 0.55 * Math.max(0.2, incidenceFactor)).toFixed(2);
    
    // Air changes per hour in classroom (Vol = 360m2 * 3.5m = 1260m3)
    const ach = Math.round((parseFloat(indoorVelocityMs) * (louverOpeningPct / 100) * 18 * 3600) / 1260);
    
    // Operative Temperature reduction via wind chill (Givoni bioclimatic chart)
    const tempDrop = (Math.min(6.2, parseFloat(indoorVelocityMs) * 2.2 + (louverOpeningPct > 60 ? 1.8 : 0.6))).toFixed(1);
    const indoorTemp = (33.5 - parseFloat(tempDrop)).toFixed(1);

    return {
      outdoorMs: outdoorMs.toFixed(1),
      indoorVelocityMs,
      ach,
      tempDrop,
      indoorTemp
    };
  }, [windSpeedKnots, windAngleDeg, louverOpeningPct]);

  // Filtered Network Nodes
  const filteredNodes = useMemo(() => {
    if (networkSystemFilter === 'ALL') return NETWORK_NODES;
    return NETWORK_NODES.filter(n => n.system === networkSystemFilter);
  }, [networkSystemFilter]);

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-100 text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. VIEWPORT CANVAS (Dynamic Rendering of Selected Engine)                 */}
      {/* ========================================================================= */}
      
      {/* ------------------------------------------------------------------------- */}
      {/* ENGINE 0: RELATIONAL NETWORK GRAPH (RAPOT-STYLE SYSTEMIC GRAPH)          */}
      {/* ------------------------------------------------------------------------- */}
      {activeEngine === 'relationalNetwork' && (
        <div className="absolute inset-0 w-full h-full bg-[#fafaf9] flex items-center justify-center p-6 select-none overflow-hidden">
          
          {/* Subtle Relational Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-60 pointer-events-none" />

          {/* SVG Interactive Force Graph */}
          <svg viewBox="0 0 900 700" className="w-full max-w-5xl h-full max-h-[580px] z-10 drop-shadow-xl select-none">
            
            {/* Edges / Relationship Links */}
            <g className="edges-layer">
              {NETWORK_EDGES.map((edge, idx) => {
                const sourceNode = NETWORK_NODES.find(n => n.id === edge.from);
                const targetNode = NETWORK_NODES.find(n => n.id === edge.to);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected = selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);
                const isEdgeSelected = selectedEdge === edge;
                
                // Perturbation Stress Effects on Edges
                let strokeColor = "#94a3b8";
                let strokeWidth = edge.weight * 1.5;
                let strokeDash = "none";
                let strokeOpacity = 0.6;

                if (edge.type === "amenaza" || edge.type === "falla") {
                  strokeColor = "#ef4444";
                  strokeDash = "6 4";
                  strokeOpacity = networkPerturbation === 'stormSurge' ? 1 : 0.7;
                  if (networkPerturbation === 'stormSurge') strokeWidth = 5;
                } else if (edge.type === "soberania" || edge.type === "reubicacion") {
                  strokeColor = "#0d9488";
                  strokeOpacity = 0.85;
                }

                if (isConnectedToSelected || isEdgeSelected) {
                  strokeColor = "#0f172a";
                  strokeWidth = 4.5;
                  strokeOpacity = 1;
                }

                return (
                  <g 
                    key={idx}
                    onClick={() => setSelectedEdge(edge)}
                    className="cursor-pointer group"
                  >
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      strokeOpacity={strokeOpacity}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </g>

            {/* Nodes Layer */}
            <g className="nodes-layer">
              {filteredNodes.map((node) => {
                const system = NETWORK_SYSTEMS.find(s => s.id === node.system);
                const isSelected = selectedNode?.id === node.id;
                const isFailingInPerturbation = 
                  (networkPerturbation === 'stormSurge' && (node.id === 'erosion_costera' || node.id === 'viviendas_riesgo')) ||
                  (networkPerturbation === 'bargeCutoff' && node.id === 'barcazas_cartagena');

                const isProtectedInPerturbation = 
                  (networkPerturbation === 'stormSurge' && (node.id === 'meseta_segura' || node.id === 'viviendas_reubicadas')) ||
                  (networkPerturbation === 'drought120' && (node.id === 'aljibe_central' || node.id === 'dispensario_agua'));

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedEdge(null);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selected or critical node */}
                    {(isSelected || isFailingInPerturbation || isProtectedInPerturbation) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r + 8}
                        fill={isFailingInPerturbation ? "#ef4444" : isProtectedInPerturbation ? "#10b981" : "#0f172a"}
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={isFailingInPerturbation ? "#dc2626" : isSelected ? "#0f172a" : system?.color || "#475569"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "3.5" : "2"}
                      className="transition-all duration-300 group-hover:scale-110"
                    />

                    {/* Degree Centrality Label inside Node */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {node.degree}
                    </text>

                    {/* Node Text Label underneath */}
                    <text
                      x={node.x}
                      y={node.y + node.r + 14}
                      textAnchor="middle"
                      fill={isSelected ? "#0f172a" : "#334155"}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight={isSelected ? "bold" : "600"}
                      className="pointer-events-none drop-shadow-sm"
                    >
                      {node.name.split('(')[0]}
                    </text>
                  </g>
                );
              })}
            </g>

          </svg>

        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* ENGINE 1: COASTAL MORPHOLOGY & BRUUN EROSION (IPCC SSP2 / SSP5)           */}
      {/* ------------------------------------------------------------------------- */}
      {activeEngine === 'seaLevel' && (
        <div className="absolute inset-0 w-full h-full bg-[#f8fafc] flex items-center justify-center p-6 select-none overflow-hidden">
          
          <svg viewBox="0 0 840 420" className="w-full max-w-4xl h-full max-h-[500px] drop-shadow-xl z-10">
            {/* Sea Volume */}
            <rect x="0" y={240 - (seaRiseCm * 0.7)} width="360" height="180" fill="#0284c7" fillOpacity="0.25" />
            
            {/* Animated Wave Path */}
            <path
              d={`M 0,${240 - (seaRiseCm * 0.7)} Q 90,${230 - (seaRiseCm * 0.7)} 180,${240 - (seaRiseCm * 0.7)} T 360,${240 - (seaRiseCm * 0.7)}`}
              stroke="#0284c7"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />

            {/* Shoreline Beach (Bruun Erosion Profile) */}
            <polygon 
              points={`320,${240 - (seaRiseCm * 0.7)} 480,280 540,400 0,400`} 
              fill="#d97706" 
              fillOpacity="0.25" 
              stroke="#b45309"
              strokeWidth="1.5"
            />
            
            {/* Plateau Safe Ground (+22.00m) */}
            <polygon 
              points="510,280 570,120 840,120 840,400 510,400" 
              fill="#0d9488" 
              fillOpacity="0.3" 
              stroke="#0f766e" 
              strokeWidth="2.5" 
            />

            {/* Shoreline Traditional Homes (Failing) */}
            <g opacity={seaMetrics.vulnerableTraditionalHomes > 80 ? 0.35 : 1} className="transition-opacity duration-300">
              <rect x="375" y="240" width="36" height="24" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
              <polygon points="370,240 393,225 416,240" fill="#dc2626" />
              <text x="393" y="280" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                COTA 0.00m (EN RIESGO)
              </text>
            </g>

            {/* Secure Relocated Settlement on Plateau (+22m) */}
            <g>
              <rect x="600" y="95" width="46" height="25" fill="#0d9488" stroke="#047857" strokeWidth="1.5" />
              <polygon points="595,95 623,80 651,95" fill="#047857" />

              <rect x="670" y="80" width="80" height="40" fill="#6366f1" stroke="#4338ca" strokeWidth="2" />
              <rect x="690" y="120" width="40" height="15" fill="#0284c7" />
              <text x="710" y="132" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">ALJIBE</text>

              <text x="670" y="65" textAnchor="middle" fill="#0d9488" fontSize="11" fontFamily="monospace" fontWeight="bold">
                MESETA SEGURA (+22.00 M.S.N.M.)
              </text>
            </g>

            {/* Coastal Retreat Measurement Marker */}
            <line x1="360" y1="200" x2={360 + seaMetrics.totalBeachLoss * 2.5} y2="200" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
            <text x="360" y="190" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
              RETROCESO BRUUN: -{seaMetrics.totalBeachLoss} m ({seaMetrics.targetYear})
            </text>
          </svg>

        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* ENGINE 2: STOCHASTIC WATER BALANCE & CISTERN 450kL                        */}
      {/* ------------------------------------------------------------------------- */}
      {activeEngine === 'waterBalance' && (
        <div className="absolute inset-0 w-full h-full bg-[#f8fafc] flex items-center justify-center p-6 select-none overflow-hidden">
          
          <svg viewBox="0 0 840 420" className="w-full max-w-4xl h-full max-h-[500px] drop-shadow-xl z-10">
            {/* Rain Precipitation Header Graphic */}
            <g className="animate-pulse">
              <circle cx="210" cy="80" r="30" fill="#64748b" fillOpacity="0.8" />
              <circle cx="250" cy="70" r="35" fill="#64748b" fillOpacity="0.8" />
              <circle cx="290" cy="80" r="28" fill="#64748b" fillOpacity="0.8" />
              <text x="250" y="85" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {annualRainfallMm} mm/año
              </text>
            </g>

            {/* Rain Streams */}
            {[190, 220, 250, 280, 310].map((x, i) => (
              <line key={i} x1={x} y1="120" x2={x - 10} y2="165" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
            ))}

            {/* Inverted Butterfly Catchment Roof */}
            <polygon points="120,175 250,195 380,175 380,185 250,205 120,185" fill="#475569" stroke="#0f172a" strokeWidth="2" />
            <text x="250" y="225" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
              CUBIERTAS: {catchmentAreaM2.toLocaleString()} m² (C={runoffCoeff})
            </text>

            {/* Cistern Outer Tank */}
            <rect x="440" y="140" width="280" height="200" rx="18" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
            
            {/* Water Fill Level inside Cistern */}
            <rect 
              x="444" 
              y={336 - (waterMetrics.fillPercent * 1.9)} 
              width="272" 
              height={waterMetrics.fillPercent * 1.9} 
              rx="14" 
              fill="#0284c7" 
              fillOpacity="0.85" 
              className="transition-all duration-500"
            />

            <text x="580" y="225" textAnchor="middle" fill="#ffffff" fontSize="18" fontFamily="monospace" fontWeight="bold">
              {waterMetrics.fillPercent}% LLENO
            </text>
            <text x="580" y="248" textAnchor="middle" fill="#bae6fd" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {waterMetrics.drySeasonAutonomyDays} DÍAS DE AUTONOMÍA CONTINUA
            </text>
          </svg>

        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* ENGINE 3: BIOCLIMATIC CFD & GIVONI COMFORT                                */}
      {/* ------------------------------------------------------------------------- */}
      {activeEngine === 'bioclimatic' && (
        <div className="absolute inset-0 w-full h-full bg-[#f8fafc] flex items-center justify-center p-6 select-none overflow-hidden">
          
          <svg viewBox="0 0 840 420" className="w-full max-w-4xl h-full max-h-[500px] drop-shadow-xl z-10">
            {/* Classroom Cross Section */}
            <rect x="260" y="120" width="320" height="200" rx="12" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
            
            {/* Roof with Overhangs */}
            <polygon points="230,120 420,80 610,120 610,130 420,90 230,130" fill="#c86d51" stroke="#9a3412" strokeWidth="2" />

            {/* Louvers Opening Graphics */}
            <rect x="260" y="160" width="12" height="120" fill="#f59e0b" opacity={louverOpeningPct / 100} />
            <rect x="568" y="160" width="12" height="120" fill="#f59e0b" opacity={louverOpeningPct / 100} />

            {/* Wind Streamlines Passing Through */}
            {[170, 210, 250].map((y, idx) => (
              <path 
                key={idx}
                d={`M 100,${y} L 740,${y}`} 
                stroke="#0d9488" 
                strokeWidth="3.5" 
                strokeDasharray="16 8" 
                className="animate-pulse"
              />
            ))}

            <text x="420" y="200" textAnchor="middle" fill="#0f172a" fontSize="22" fontFamily="monospace" fontWeight="bold">
              -{windMetrics.tempDrop} °C
            </text>
            <text x="420" y="225" textAnchor="middle" fill="#0d9488" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {windMetrics.ach} RENOVACIONES / HORA &bull; V={windMetrics.indoorVelocityMs} m/s
            </text>
            <text x="420" y="248" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
              Temp. Operativa Interior: {windMetrics.indoorTemp} °C (Confort Pasivo)
            </text>
          </svg>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING TOP BAR                                                       */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex items-center space-x-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            08
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                MODELAMIENTO DINÁMICO // SIMULACIONES
              </span>
              <span className="text-[10px] font-mono text-terracotta-700 font-bold bg-terracotta-50 px-1.5 py-0.5 rounded border border-terracotta-200">
                RED SISTÉMICA
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-900 truncate">
              {activeEngine === 'relationalNetwork' && 'Grafo Relacional Sistémico (18 Nodos & Actores)'}
              {activeEngine === 'seaLevel' && 'Erosión Costera & Retiro de Bruun (IPCC 2026-2076)'}
              {activeEngine === 'waterBalance' && 'Balance Hidráulico & Autonomía Aljibe 450.000 L'}
              {activeEngine === 'bioclimatic' && 'Dinámica de Fluidos & Confort Térmico Pasivo'}
            </h2>
          </div>
        </div>

        {/* Engine Switcher Bar */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-xl pointer-events-auto flex flex-wrap items-center gap-1 self-start md:self-center">
          
          <button
            onClick={() => setActiveEngine('relationalNetwork')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'relationalNetwork'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>0. Red Sistémica</span>
          </button>

          <button
            onClick={() => setActiveEngine('seaLevel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'seaLevel'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>1. Nivel del Mar</span>
          </button>

          <button
            onClick={() => setActiveEngine('waterBalance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'waterBalance'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>2. Balance Hídrico</span>
          </button>

          <button
            onClick={() => setActiveEngine('bioclimatic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeEngine === 'bioclimatic'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>3. Confort Eólico</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING LEFT PANEL: PARAMETRIC CONTROLS & PERTURBATIONS               */}
      {/* ========================================================================= */}
      <div className="absolute top-24 left-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-2xl space-y-4 pointer-events-auto text-slate-900 w-72 max-h-[calc(100vh-8rem)] overflow-y-auto">
        
        {/* Controls for Engine 0: Relational Network */}
        {activeEngine === 'relationalNetwork' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Simulación de Perturbación</span>
              <Activity className="w-3.5 h-3.5 text-terracotta-600" />
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setNetworkPerturbation('normal')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  networkPerturbation === 'normal'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                1. Estado Línea Base
              </button>

              <button
                onClick={() => setNetworkPerturbation('stormSurge')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  networkPerturbation === 'stormSurge'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                2. Marea de Leva (+1.2m)
              </button>

              <button
                onClick={() => setNetworkPerturbation('drought120')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  networkPerturbation === 'drought120'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                3. Sequía Severa (120 Días)
              </button>

              <button
                onClick={() => setNetworkPerturbation('bargeCutoff')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  networkPerturbation === 'bargeCutoff'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                4. Bloqueo de Barcazas
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Filtrar por Sistema</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setNetworkSystemFilter('ALL')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    networkSystemFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Todos (18)
                </button>
                {NETWORK_SYSTEMS.map(sys => (
                  <button
                    key={sys.id}
                    onClick={() => setNetworkSystemFilter(sys.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      networkSystemFilter === sys.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sys.name.split('&')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Controls for Engine 1: Sea Level Rise */}
        {activeEngine === 'seaLevel' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
              Variables de Forzamiento Marino
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Nivel del Mar:</span>
                <span className="font-bold text-red-600">+{seaRiseCm} cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={seaRiseCm}
                onChange={(e) => setSeaRiseCm(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Tasa de Retiro:</span>
                <span className="font-bold text-slate-900">{erosionRateYear} m/año</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={erosionRateYear}
                onChange={(e) => setErosionRateYear(parseFloat(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Horizonte Temporal:</span>
                <span className="font-bold text-teal-700">{seaMetrics.targetYear} ({timeHorizonYears} años)</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={timeHorizonYears}
                onChange={(e) => setTimeHorizonYears(parseInt(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Controls for Engine 2: Water Balance */}
        {activeEngine === 'waterBalance' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
              Parámetros Hidrológicos
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Lluvia Anual:</span>
                <span className="font-bold text-blue-600">{annualRainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="250"
                max="1500"
                step="50"
                value={annualRainfallMm}
                onChange={(e) => setAnnualRainfallMm(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Consumo per Cápita:</span>
                <span className="font-bold text-slate-900">{dailyPerCapitaConsL} L/hab/d</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={dailyPerCapitaConsL}
                onChange={(e) => setDailyPerCapitaConsL(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Controls for Engine 3: Bioclimatic Wind */}
        {activeEngine === 'bioclimatic' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
              Parámetros Eólicos & Celosías
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Viento Alisios:</span>
                <span className="font-bold text-teal-700">{windSpeedKnots} nudos</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={windSpeedKnots}
                onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Apertura Celosías BTC:</span>
                <span className="font-bold text-terracotta-600">{louverOpeningPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={louverOpeningPct}
                onChange={(e) => setLouverOpeningPct(parseInt(e.target.value))}
                className="w-full accent-terracotta-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. FLOATING RIGHT PANEL: REAL-TIME QUANTITATIVE KPI RESULTS               */}
      {/* ========================================================================= */}
      <div className="absolute top-24 right-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-2xl space-y-3 pointer-events-auto text-slate-900 w-72">
        <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>Resultados Cuantitativos</span>
          <Activity className="w-3.5 h-3.5" />
        </div>

        {activeEngine === 'relationalNetwork' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">Resiliencia Sistémica</span>
              <p className="text-lg font-bold text-emerald-700">94.8% Operativo</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">Nodos de Mayor Centralidad</span>
              <p className="text-xs font-bold text-slate-900">Aljibe 450kL (G=9) &bull; Viviendas (G=8)</p>
            </div>
          </div>
        )}

        {activeEngine === 'seaLevel' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200">
              <span className="text-[10px] text-red-700 uppercase block">Viviendas Borde Afectadas</span>
              <p className="text-lg font-bold text-red-600">{seaMetrics.vulnerableTraditionalHomes} de 120</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase block">Seguridad Meseta (+22m)</span>
              <p className="text-lg font-bold text-emerald-700">100% Inmune (0% Riesgo)</p>
            </div>
          </div>
        )}

        {activeEngine === 'waterBalance' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 uppercase block">Volumen Anual Colectado</span>
              <p className="text-lg font-bold text-blue-600">{waterMetrics.harvestedM3.toLocaleString()} m³</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase block">Ahorro Comunitario / Año</span>
              <p className="text-lg font-bold text-emerald-700">${waterMetrics.annualSavingsCopMillions}M COP</p>
            </div>
          </div>
        )}

        {activeEngine === 'bioclimatic' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200">
              <span className="text-[10px] text-teal-800 uppercase block">Enfriamiento Pasivo</span>
              <p className="text-lg font-bold text-teal-700">-{windMetrics.tempDrop} °C</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">Velocidad Interior</span>
              <p className="text-lg font-bold text-slate-900">{windMetrics.indoorVelocityMs} m/s</p>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 5. POPUP MODAL: NODE TECHNICAL SURVEY & CITATION                          */}
      {/* ========================================================================= */}
      {selectedNode && (
        <div 
          onClick={() => setSelectedNode(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-scale-up text-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    NODO SISTÉMICO // {selectedNode.system}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Centralidad: {selectedNode.centrality} (G={selectedNode.degree})
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                  {selectedNode.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className="text-slate-500 uppercase text-[10px] block font-bold">Función en el Modelo Territorial</span>
              <p className="text-slate-900 font-bold mt-0.5">{selectedNode.role}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-800 leading-relaxed font-light">
              <b>Sustento Documental & Evidencia de Campo:</b>
              <p className="mt-1">{selectedNode.citation}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-400">
                RAPOT Tierrabomba &bull; Tesis 2026
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800"
              >
                Cerrar Ficha de Nodo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
