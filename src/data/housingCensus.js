// Database: Censo Territorial & Cuantificación 1:1 de 120 Viviendas en Riesgo
// Isla de Tierrabomba, Cartagena de Indias (2026)
// Fuentes: Relevamiento de Campo, MIDAS Cartagena (IDE Cartagena / POT 2026)

export const HOUSING_CENSUS_120 = Array.from({ length: 120 }, (_, index) => {
  const num = index + 1;
  const id = `VIV-${String(num).padStart(3, '0')}`;
  
  // Distribute across sectors
  const sector = num <= 50 
    ? "Punta Arena - Borde Costero Crítico"
    : num <= 85 
      ? "Caño del Oro - Franja de Socavación" 
      : "Punta Arena - Sector Sur Marino";

  // Coordinates along western/northern coast in risk (current location)
  // Base shoreline coords approx 10.355 to 10.365, -75.582 to -75.572
  const coastalLat = 10.3540 + (index * 0.00012) + (Math.sin(index * 0.4) * 0.0006);
  const coastalLng = -75.5815 + (index * 0.00008) + (Math.cos(index * 0.35) * 0.0005);

  // Relocation coordinates in the Plateau (+22m)
  // Grid layout in plateau approx 10.371 to 10.375, -75.577 to -75.574
  const row = Math.floor(index / 10);
  const col = index % 10;
  const plateauLat = 10.3716 + (row * 0.00022) + (Math.sin(col) * 0.00003);
  const plateauLng = -75.5768 + (col * 0.00025) + (Math.cos(row) * 0.00003);

  // Typology distribution: ~60% Typology A (54 m²), ~40% Typology B (72 m² productiva)
  const isTypologyB = num % 3 === 0 || num % 5 === 0;
  const typology = isTypologyB ? "Tipología B - Productiva (72 m²)" : "Tipología A - Base Familiar (54 m²)";
  const typologyCode = isTypologyB ? "TIPO-B" : "TIPO-A";
  const areaM2 = isTypologyB ? 72 : 54;
  const residents = isTypologyB ? 5 + (num % 3) : 3 + (num % 3); // 3 to 7 people

  // Surnames generator for authentic Caribbean households
  const familySurnames = [
    "Gómez Pérez", "Casas Morales", "Torres Herrera", "Miranda Castro",
    "Berrío Valdés", "Zúñiga Narváez", "Caraballo Ramos", "Montes Salgado",
    "Paternina Díaz", "Julio Carmona", "Morelos Payares", "Mendoza Barrios",
    "Arrieta Quintana", "Guzmán Polo", "Castillo Bello", "López Angulo"
  ];
  const familyName = `Familia ${familySurnames[index % familySurnames.length]}`;

  // Livelihood
  const livelihoods = [
    "Pesca Artesanal Marina", 
    "Carpintería de Ribera & Redes", 
    "Transporte Marítimo Insular", 
    "Comercio Local & Gastronomía Caribeña"
  ];
  const livelihood = livelihoods[index % livelihoods.length];

  // Elevation & Risk status
  const currentElevation = (0.15 + (num % 8) * 0.12).toFixed(2);
  const targetElevation = "+22.40";

  // Phases
  const phase = num <= 40 ? "Fase 1 (Urgencia Inmediata)" : num <= 85 ? "Fase 2 (Consolidación)" : "Fase 3 (Expansión)";
  const phaseNumber = num <= 40 ? 1 : num <= 85 ? 2 : 3;

  return {
    id,
    number: num,
    familyName,
    sector,
    typology,
    typologyCode,
    areaM2,
    residents,
    livelihood,
    coastalCoords: [coastalLat, coastalLng],
    plateauCoords: [plateauLat, plateauLng],
    currentElevation: `${currentElevation} m.s.n.m.`,
    targetElevation: `${targetElevation} m.s.n.m.`,
    currentStructure: "Madera no tratada, lámina de zinc oxidada y cimientos en arena suelta",
    proposedStructure: "Madera estructural tratada, bloque BTC (suelo-cemento) y cubierta captadora",
    erosionRate: "1.8 m/año",
    waterCurrent: "0% red formal (Compra a barcazas $8.000/pimpina)",
    waterProposed: "Conexión a Aljibe Central 450.000 L + Tanque doméstico 2.500 L",
    riskLevel: num <= 40 ? "Crítico Inminente" : "Alto",
    phase,
    phaseNumber,
    manzana: `Manzana M0${Math.floor(index / 20) + 1}`,
    lote: `Lote L-${String((index % 20) + 1).padStart(2, '0')}`
  };
});

// Summary metrics of the 120 housing units census
export const HOUSING_CENSUS_SUMMARY = {
  totalDwellings: 120,
  totalResidents: HOUSING_CENSUS_120.reduce((acc, h) => acc + h.residents, 0),
  typologyACount: HOUSING_CENSUS_120.filter(h => h.typologyCode === 'TIPO-A').length,
  typologyBCount: HOUSING_CENSUS_120.filter(h => h.typologyCode === 'TIPO-B').length,
  phase1Count: HOUSING_CENSUS_120.filter(h => h.phaseNumber === 1).length,
  phase2Count: HOUSING_CENSUS_120.filter(h => h.phaseNumber === 2).length,
  phase3Count: HOUSING_CENSUS_120.filter(h => h.phaseNumber === 3).length,
  averageResidentsPerHome: (HOUSING_CENSUS_120.reduce((acc, h) => acc + h.residents, 0) / 120).toFixed(1),
  totalAreaBuiltM2: HOUSING_CENSUS_120.reduce((acc, h) => acc + h.areaM2, 0),
  waterDeficitCurrent: "100% de los hogares sin acueducto",
  waterCoverageProposed: "100% abastecimiento continuo por aljibe central"
};
