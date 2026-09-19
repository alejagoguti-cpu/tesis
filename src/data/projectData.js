export const projectInfo = {
  thesisCode: "TESIS-ARQ-2026-TB",
  title: "TIERRABOMBA: HÁBITAT RESILIENTE",
  subtitle: "Plan Maestro de Relocalización Comunitaria, Equipamiento Educativo & Soberanía Hídrica",
  location: "Isla de Tierrabomba, Bahía de Cartagena de Indias, Colombia",
  coordinates: "10°21'04\"N 75°34'18\"W",
  university: "Universidad / Facultad de Arquitectura y Urbanismo",
  program: "Proyecto de Grado para optar al título de Arquitecta",
  year: "2026",
  author: "Alejandra Gómez & Ana Casas",
  tutors: "Directores y Asesores de Tesis",
  githubRepo: "https://github.com/alejagoguti-cpu/tesis",

  // Testimonio Comunitario / Memoria del Territorio
  communityVoice: {
    quote: "El mar no pide permiso: se nos está llevando el patio, la cocina y los cimientos de la casa. Y cuando no hay lluvia, pagamos el agua a precio de oro porque las barcazas tardan semanas en llegar desde Cartagena.",
    author: "Líder Comunitaria del Corregimiento de Punta Arena",
    context: "Bitácora de Campo & Talleres de Co-Diseño Insular (2025–2026)"
  },

  // 1. MARCO ACADÉMICO / JUSTIFICACIÓN & OBJETIVOS
  academicFramework: {
    justification: {
      problemStatement: "La Isla de Tierrabomba vive en una paradoja territorial: estando a solo 15 minutos en lancha de la bahía de Cartagena, sufre un aislamiento estructural absoluto. La falta del 100% de red formal de acueducto, la salinización de acuíferos subterráneos y una tasa de erosión costera de hasta 1.8 metros anuales ponen en riesgo directo de colapso a más de 4.200 habitantes asentados en la franja marina vulnerable.",
      academicJustification: "Esta tesis aborda la reubicación no como un desalojo pasivo, sino como un proyecto de hábitat progresivo e identidad caribeña. Se proyecta un asentamiento seguro en la meseta (+22.00 m.s.n.m.) que articula 120 viviendas con diseño bioclimático y un equipamiento educativo integral que actúa simultáneamente como centro comunal de oficios marítimos y dispensario público de agua potable.",
    },
    generalObjective: "Formular un Plan Maestro de Reubicación Territorial en la meseta segura de Tierrabomba (+22.00 m.s.n.m.), desarrollando el diseño arquitectónico de prototipos de vivienda progresiva resiliente y un equipamiento educativo bioclimático dotado de infraestructura de autosuficiencia hídrica.",
    specificObjectives: [
      {
        code: "OE-01",
        title: "Diagnóstico Territorial & Riesgo Costero",
        desc: "Mapear la cota de socavación marina y marea de leva, delimitando la meseta central no inundable para la nueva implantación comunitaria."
      },
      {
        code: "OE-02",
        title: "Vivienda Progresiva Resiliente",
        desc: "Diseñar tipologías de vivienda modular (54 m² a 86 m²) con elevación palafítica (+0.60 m), patios de sombra y autoconstrucción comunitaria en madera y BTC."
      },
      {
        code: "OE-03",
        title: "Equipamiento Educativo & Cívico",
        desc: "Proyectar un complejo escolar para 350 estudiantes con aulas de ventilación pasiva, talleres náuticos, biblioteca y plaza central de acopio comunitario."
      },
      {
        code: "OE-04",
        title: "Soberanía Hídrica Circular",
        desc: "Implementar un sistema de captación pluvial en macro-cubierta, aljibe central inmune de 450.000 L y bio-humedales para fitodepuración de aguas grises."
      }
    ]
  },

  // 2. MÉTRICAS CLAVE
  metrics: [
    { value: "120", label: "Familias Reubicadas", description: "Hogares trasladados de la zona de erosión crítica" },
    { value: "1.850 m²", label: "Equipamiento Educativo", description: "Área pedagógica, talleres náuticos y plaza cívica" },
    { value: "450.000 L", label: "Aljibe Comunitario", description: "Reserva hídrica potable protegida en la meseta" },
    { value: "+22.00 m", label: "Cota de Seguridad", description: "Implantación libre de marea y socavación marina" },
  ],

  // 3. PROGRAMA DE VIVIENDA REUBICADA
  housingProgram: {
    title: "Prototipo de Vivienda Resiliente & Progresiva",
    concept: "La vivienda se concibe a partir del módulo habitacional isleño tradicional: estructura elevada 0.60m sobre pilotes de madera tratada para permitir el flujo del aire y evitar la humedad del suelo, articulada con porches de sombra para la convivencia comunal y el secado de pesca.",
    typologies: [
      {
        name: "Tipología A - Módulo Base Familiar",
        area: "54 m²",
        occupancy: "4 a 5 habitantes",
        features: ["2 Habitaciones con ventilación cruzada", "Estar-comedor conectado al patio exterior", "Cocina integrada con ventilación directa", "Baño ecológico seco / bajo caudal", "Tanque doméstico de captación 2.500 L"],
        expansion: "Crecimiento lateral hacia huerto productivo o taller"
      },
      {
        name: "Tipología B - Vivienda Productiva / Taller Náutico",
        area: "72 m²",
        occupancy: "5 a 7 habitantes",
        features: ["3 Habitaciones", "Pórtico frontal techado para reparación de redes y pesca", "Patio central bioclimático de convección", "Cubierta a dos aguas para captación pluvial"],
        expansion: "Crecimiento vertical en altillo de madera ligera"
      }
    ]
  },

  // 4. PROGRAMA DEL EQUIPAMIENTO EDUCATIVO
  educationalProgram: {
    title: "Complejo Educativo, Comunitario & Dispensario Hídrico",
    capacity: "350 estudiantes en jornada diurna + 1.200 usuarios comunitarios en fines de semana",
    spaces: [
      { zone: "Área Pedagógica & Aulas", items: ["6 Aulas bioclimáticas con celosías de arcilla BTC", "Laboratorio de Ciencias Ambientales y Marinas", "Aula múltiple de informática y conectividad"] },
      { zone: "Área de Oficios & Cultura", items: ["Taller de Carpintería Ribereña y Artes Pesqueras", "Biblioteca y mediateca pública abierta a la isla", "Comedor escolar y cocina comunal comunitaria"] },
      { zone: "Infraestructura Hídrica & Ágora", items: ["Dispensario Central de Agua Potable (12 tomas)", "Ágora cívica cubierta de 400 m² para asambleas", "Humedal artificial demostrativo y huerto escolar"] }
    ]
  },

  // 5. DIAGNÓSTICO
  diagnosis: {
    title: "Diagnóstico Territorial & Vulnerabilidad",
    summary: "El diagnóstico de campo evidencia que el 70% del borde habitado en Punta Arena y Caño del Oro se encuentra en cota de riesgo inminente por marea de leva, mientras que la falta de agua potable condiciona la salud, la economía y la permanencia de la comunidad en su territorio ancestral.",
    points: [
      {
        id: "vivienda",
        title: "Viviendas en Borde de Socavación",
        description: "Construcciones tradicionales sobre arena suelta con cimientos expuestos por el oleaje y pérdida de hasta 1.8 metros de playa al año.",
        icon: "Home",
        badge: "Riesgo Físico Crítico"
      },
      {
        id: "agua",
        title: "Emergencia Sanitaria & Salinidad",
        description: "Inexistencia de red pública de agua. Los pozos locales sufren intrusión salina marina y las familias gastan más de un 20% de su sustento comprando pimpinas a barcazas.",
        icon: "Droplets",
        badge: "Déficit Estructural"
      },
      {
        id: "educacion",
        title: "Infraestructura Dotacional Precaria",
        description: "La sede escolar actual no cuenta con baterías sanitarias con agua continua ni espacios acondicionados climáticamente para la formación de jóvenes.",
        icon: "GraduationCap",
        badge: "Vulnerabilidad Social"
      }
    ]
  },

  // 6. ESTRATEGIA BIOCLIMÁTICA
  strategy: {
    title: "Estrategia Territorial & Criterios Bioclimáticos",
    description: "La propuesta plantea retirar los asentamientos críticos de la línea de vulnerabilidad marina y reubicarlos en la meseta central segura de la isla (+22 m.s.n.m.), consolidando un nodo cívico y educativo articulado mediante senderos bioclimáticos y terrazas de absorción pluvial.",
    pillars: [
      {
        step: "01",
        title: "Cota de Impregnación Cero",
        desc: "Implantación en la meseta central a cota +22.00 m.s.n.m., fuera del alcance de la erosión y aumento del nivel del mar para los próximos 100 años."
      },
      {
        step: "02",
        title: "Célula Hídrica Colectiva",
        desc: "La cubierta del colegio funciona como un macro-embudo captador de agua de lluvia conectado a un aljibe modular de 450.000 L."
      },
      {
        step: "03",
        title: "Materialidad Caribeña Resiliente",
        desc: "Estructura en madera tratada, bloques de tierra comprimida (BTC) con áridos locales y celosías cerámicas para ventilación cruzada continua."
      },
      {
        step: "04",
        title: "Paisajismo Fitodepurador",
        desc: "Borduras de vegetación xerófila costera y vetiver que fijan el suelo y tratan las aguas grises antes de su infiltración."
      }
    ]
  },

  // 7. PLANIMETRÍA TÉCNICA
  blueprints: [
    {
      id: "masterplan-reubicacion",
      title: "Masterplan General: Reubicación de Viviendas & Equipamiento",
      scale: "1:500",
      format: "Pliego DIN A0 (1189 x 841 mm)",
      type: "Urbanístico / Territorial",
      description: "Trazado del nuevo asentamiento seguro en la meseta (+22m): manzana de 120 viviendas, equipamiento educativo central, ejes peatonales y franjas de bio-retención pluvial.",
      tags: ["Masterplan", "Vivienda", "Equipamiento", "Topografía"],
      svgType: "masterplan"
    },
    {
      id: "planta-colegio",
      title: "Planta Arquitectónica: Equipamiento Educativo & Comunitario",
      scale: "1:100",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Arquitectónico",
      description: "Distribución de bloques de aulas, biblioteca, talleres de oficios náuticos, comedor y plaza cívica con dispensario de agua.",
      tags: ["Colegio", "Aulas", "Plaza Central"],
      svgType: "educational"
    },
    {
      id: "prototipo-vivienda",
      title: "Prototipo de Vivienda Progresiva Resiliente (Plantas & Cortes)",
      scale: "1:50",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Arquitectónico / Detalle",
      description: "Planta modular de 54 m² a 86 m², modulación de estructura de madera tratada, patio bioclimático y sistema de recolección pluvial autónomo.",
      tags: ["Vivienda VIS", "Progresividad", "Módulos"],
      svgType: "housing"
    },
    {
      id: "corte-bioclimatico",
      title: "Corte General Bioclimático & Sistema Hidráulico A-A'",
      scale: "1:75",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Técnico / Bioclimático",
      description: "Relación entre cubierta captadora de 1.850 m², flujo de ventilación por vientos alisios, cisterna subterránea de 450.000 L y bio-humedal.",
      tags: ["Corte", "Bioclimática", "Aljibe"],
      svgType: "section"
    }
  ],

  // 8. MEMORIA HÍDRICA
  waterSystem: {
    title: "Memoria Técnica: Sistema Hídrico Integral & Autosuficiente",
    subtitle: "Ciclo cerrado de captación pluvial, desinfección solar y fitodepuración biológica",
    capacity: "450.000 Litros de Reserva Estratégica Central",
    harvestingArea: "1.850 m² (Colegio) + 6.480 m² (Viviendas)",
    steps: [
      {
        step: "1",
        name: "Captación Pluvial Dual (Macro y Micro)",
        detail: "Captación combinada: 1.850 m² en cubierta del equipamiento educativo para reserva comunitaria y 54 m² por cada módulo de vivienda para consumo doméstico primario.",
        capacity: "~6.200 m³ anuales colectados"
      },
      {
        step: "2",
        name: "Desarenador & Filtro de Primeras Lluvias",
        detail: "Mecanismo centrífugo que descarta los primeros 2 mm de lluvia eliminando polvillo atmosférico y sales marinas antes de entrar al aljibe.",
        capacity: "99.5% remoción de sedimentos"
      },
      {
        step: "3",
        name: "Almacenamiento en Aljibe Térmico Subterráneo",
        detail: "Tanque compartimentado de 450 m³ en concreto ciclópeo a +20m de cota, blindado ante la salinidad y temperatura ambiente.",
        capacity: "450.000 L de almacenamiento continuo"
      },
      {
        step: "4",
        name: "Potabilización Solar Fotovoltaica (UV + Carbón)",
        detail: "Sistema de bombeo solar sumergible y tren de desinfección mediante luz ultravioleta cumpliendo la Resolución 2115 de agua potable.",
        capacity: "100% apta para consumo humano"
      },
      {
        step: "5",
        name: "Bio-humedal Fitodepurador & Huertos Comunitarios",
        detail: "Fitodepuración de aguas grises con plantas macrófitas y vetiver para irrigación del huerto escolar y estabilización del suelo mesetario.",
        capacity: "75% recirculación de aguas grises"
      }
    ]
  }
};
