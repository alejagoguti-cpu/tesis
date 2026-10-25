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
    generalObjective: "Desarrollar una propuesta progresiva de vivienda y colegio en Tierrabomba que responda a las dinámicas comunitarias locales y permita la expansión de ambos proyectos en el tiempo.",
    specificObjectives: [
      {
        code: "OE-01",
        title: "Dinámicas Comunitarias y Espaciales",
        desc: "Analizar las dinámicas comunitarias y espaciales de la vivienda y el colegio en Tierrabomba."
      },
      {
        code: "OE-02",
        title: "Patrones de Crecimiento y Autoconstrucción",
        desc: "Identificar los patrones de crecimiento progresivo y autoconstrucción locales."
      },
      {
        code: "OE-03",
        title: "Criterios de Diseño e Identidad Local",
        desc: "Definir criterios de diseño e identidad local para orientar ambos proyectos."
      },
      {
        code: "OE-04",
        title: "Propuesta Arquitectónica Modular",
        desc: "Diseñar una propuesta arquitectónica modular que permita la expansión progresiva de ambos proyectos."
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
        id: "erosion",
        title: "Erosión de las costas y riesgo en las viviendas",
        description: "El golpe del mar destruye la orilla y pone en peligro las casas construidas cerca del agua.",
        icon: "Waves",
        badge: "Riesgo Costero"
      },
      {
        id: "agua",
        title: "Falta de agua potable y alcantarillado",
        description: "La isla no tiene red de agua ni desagües, lo que obliga a la población a comprar agua traída en lanchas.",
        icon: "Droplets",
        badge: "Déficit Hídrico"
      },
      {
        id: "servicios",
        title: "Falta de servicios públicos y colegios",
        description: "Existe un abandono en la infraestructura de la isla, afectando la educación, la salud y los espacios comunitarios.",
        icon: "Building2",
        badge: "Infraestructura & Educación"
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
  },

  // 9. TELEMETRÍA & SENSORES TERRITORIALES (DASHBOARD)
  telemetry: {
    wind: { value: "18.4 nudos", direction: "N-NE", status: "Alisios Activos", icon: "Wind" },
    temperature: { value: "29.5 °C", apparent: "34.0 °C", humidity: "78%", icon: "Thermometer" },
    tide: { value: "+0.42 m", level: "Pleamar Media", erosionRisk: "Alto en Cota 0.00", icon: "Waves" },
    solarRadiation: { value: "5.85 kWh/m²/día", uvIndex: "11 (Extremo)", pvYield: "100% Cobertura", icon: "Sun" },
    waterReserve: { current: "450.000 L", autonomy: "90 días de sequía", quality: "Óptima (Solar UV)", icon: "Droplets" },
    erosionRate: { annual: "1.8 m/año", retreatTotal: "18 m en 10 años", relocationGain: "+22.00 m cota", icon: "ShieldAlert" }
  },

  // 10. MATRIZ COMPARATIVA DE IMPACTO (SITUACIÓN ACTUAL VS PROPUESTA TESIS)
  impactMatrix: [
    {
      factor: "Seguridad Territorial",
      current: "500 viviendas en franja de socavación activa e inundación (pérdida de 1.8m/año)",
      proposed: "Reubicación a meseta +22.00 m.s.n.m. inmune a marea y cambio climático",
      delta: "+100% Seguridad Estructural"
    },
    {
      factor: "Abastecimiento Hídrico",
      current: "0% red pública. Compra precaria a barcazas de Cartagena ($8.000 / pimpina)",
      proposed: "Cisterna de 450.000 L con captación dual de 8.330 m² y solar UV",
      delta: "Autosuficiencia 365 días"
    },
    {
      factor: "Equipamiento Dotacional",
      current: "Sede escolar precaria sin agua continua ni espacios de formación marítima",
      proposed: "Complejo bioclimático de 1.850 m² para 350 alumnos + talleres de pesca",
      delta: "+350 Cupos Escolares & Cívicos"
    },
    {
      factor: "Confort Térmico & Clima",
      current: "Viviendas de zinc con temperaturas interiores de hasta 38 °C",
      proposed: "Pórticos de madera, aleros de 2.5m y celosías BTC con ventilación cruzada",
      delta: "-5 °C Sensación Térmica Pasiva"
    },
    {
      factor: "Energía & Sostenibilidad",
      current: "Microcortes eléctricos diarios y dependencia de diésel contaminante",
      proposed: "Sistema 100% solar fotovoltaico con acumulación en baterías LiFePO4",
      delta: "100% Energía Renovable"
    }
  ],

  // 11. NAVEGACIÓN DEL DASHBOARD
  // Módulos comunitarios = menú principal (lenguaje claro, sin tecnicismos).
  // Módulos técnicos = se conservan, pero quedan bajo "Versión técnica".
  dashboardModules: [
    {
      id: "territorio",
      number: "1",
      title: "Nuestro territorio",
      icon: "Home",
      badge: "La isla",
      desc: "Cómo es Tierra Bomba: su gente, sus casas, sus caminos y su paisaje",
      community: true
    },
    {
      id: "module11",
      number: "2",
      title: "La historia de la isla",
      icon: "BookOpen",
      badge: "Memoria",
      desc: "Mapas antiguos y fotos reales de cómo ha cambiado la isla",
      community: true
    },
    {
      id: "framework",
      number: "3",
      title: "El mapa de los riesgos",
      icon: "Map",
      badge: "Territorio",
      desc: "Dónde se inunda, dónde se pierde la costa y dónde está la parte segura",
      community: true
    },
    {
      id: "3dviewer",
      number: "4",
      title: "Así será el nuevo barrio",
      icon: "Box",
      badge: "Propuesta",
      desc: "Recorre en 3D las casas, el colegio y el aljibe de agua",
      community: true
    },
    {
      id: "gis",
      number: "T1",
      title: "Teledetección & GIS Espectral",
      icon: "Layers",
      badge: "Técnico",
      desc: "Bandas satelitales (NDVI, NDWI, Manglar) y análisis espectral",
      community: false
    },
    {
      id: "red",
      number: "T2",
      title: "Red de Diseño Colaborativo",
      icon: "Network",
      badge: "Técnico",
      desc: "Red conceptual de objetivos que se despliega con cada clic",
      community: false
    },
    {
      id: "rizoma",
      number: "T3",
      title: "Master Plan Rizoma",
      icon: "Network",
      badge: "Técnico",
      desc: "Núcleo inicial, ampliación básica y condiciones de habitabilidad",
      community: false
    },
    {
      id: "revit",
      number: "T4",
      title: "Modelo Revit Tierrabomba",
      icon: "Building2",
      badge: "Técnico",
      desc: "Modelo BIM original y visor de la exportación",
      community: false
    },
  ],

  // 12. SISTEMA DE RED CONCEPTUAL DE OBJETIVOS (TESIS 2026)
  thesisNetwork: {
    generalObjective: "Desarrollar una propuesta progresiva de vivienda y colegio en Tierrabomba que responda a las dinámicas comunitarias locales y permita la expansión de ambos proyectos en el tiempo.",
    nodes: [
      {
        id: "oe01",
        code: "OE-01",
        colorKey: "community",
        color: "#0d9488",
        gradientStart: "#14b8a6",
        gradientEnd: "#0f766e",
        title: "OE-01: Dinámicas Comunitarias y Espaciales",
        shortLines: [
          "OE-01",
          "Analizar las dinámicas",
          "comunitarias y espaciales",
          "de la vivienda y el colegio",
          "en Tierrabomba."
        ],
        cx: 310,
        cy: 98,
        r: 80,
        badge: "Diagnóstico Comunitario",
        metric: "Vivienda & Colegio",
        area: "Dinámicas Locales",
        desc: "Analizar las dinámicas comunitarias y espaciales de la vivienda y el colegio en Tierrabomba.",
        satellites: [
          { name: "Dinámicas de la Vivienda", icon: "Home", detail: "Relaciones espaciales, cotidianidad y modos de habitar isleños." },
          { name: "Espacio Educativo & Vida Comunal", icon: "BookOpen", detail: "El colegio como centro articulador de encuentro y cultura insular." },
          { name: "Usos Colectivos y Vecindad", icon: "Compass", detail: "Conexión entre callejones tradicionales, porches de sombra y borde costero." },
          { name: "Diagnóstico Participativo", icon: "Activity", detail: "Lectura directa en territorio con las familias y líderes de Tierrabomba." }
        ]
      },
      {
        id: "oe02",
        code: "OE-02",
        colorKey: "growth",
        color: "#d97706",
        gradientStart: "#f59e0b",
        gradientEnd: "#b45309",
        title: "OE-02: Patrones de Crecimiento y Autoconstrucción",
        shortLines: [
          "OE-02",
          "Identificar los patrones",
          "de crecimiento progresivo",
          "y autoconstrucción",
          "locales."
        ],
        cx: 505,
        cy: 295,
        r: 80,
        badge: "Patrones Locales",
        metric: "Crecimiento Progresivo",
        area: "Autoconstrucción",
        desc: "Identificar los patrones de crecimiento progresivo y autoconstrucción locales.",
        satellites: [
          { name: "Patrones de Autoconstrucción", icon: "Box", detail: "Técnicas vernáculas y saberes constructivos adaptados al clima caribeño." },
          { name: "Fases de Crecimiento del Hogar", icon: "Home", detail: "Ampliación gradual de la vivienda según las etapas y economía familiar." },
          { name: "Flexibilidad del Colegio", icon: "Layers", detail: "Capacidad de adaptación y adición de espacios pedagógicos por fases." },
          { name: "Materiales y Saberes Locales", icon: "Sparkles", detail: "Aprovechamiento de mano de obra y materiales autóctonos de la isla." }
        ]
      },
      {
        id: "oe03",
        code: "OE-03",
        colorKey: "design",
        color: "#2563eb",
        gradientStart: "#3b82f6",
        gradientEnd: "#1d4ed8",
        title: "OE-03: Criterios de Diseño e Identidad Local",
        shortLines: [
          "OE-03",
          "Definir criterios",
          "de diseño e identidad",
          "local para orientar",
          "ambos proyectos."
        ],
        cx: 310,
        cy: 470,
        r: 80,
        badge: "Criterios Proyectuales",
        metric: "Identidad Insular",
        area: "Ambos Proyectos",
        desc: "Definir criterios de diseño e identidad local para orientar ambos proyectos.",
        satellites: [
          { name: "Identidad y Memoria Insular", icon: "Compass", detail: "Arquitectura arraigada en la cultura afrocaribeña y tradiciones locales." },
          { name: "Criterios para Ambos Proyectos", icon: "Layers", detail: "Pautas formales y funcionales comunes que integran vivienda y colegio." },
          { name: "Bioclimática y Sombra Pasiva", icon: "Wind", detail: "Ventilación cruzada, aleros protectores y confort térmico natural." },
          { name: "Espacio Público y Convivencia", icon: "Building2", detail: "Articulación de plazas, senderos y zonas comunes de intercambio." }
        ]
      },
      {
        id: "oe04",
        code: "OE-04",
        colorKey: "modular",
        color: "#c86d51",
        gradientStart: "#e06248",
        gradientEnd: "#b85438",
        title: "OE-04: Propuesta Arquitectónica Modular",
        shortLines: [
          "OE-04",
          "Diseñar una propuesta",
          "arquitectónica modular",
          "que permita la expansión",
          "progresiva de",
          "ambos proyectos."
        ],
        cx: 115,
        cy: 295,
        r: 80,
        badge: "Propuesta Proyectual",
        metric: "Expansión Progresiva",
        area: "Ambos Proyectos",
        desc: "Diseñar una propuesta arquitectónica modular que permita la expansión progresiva de ambos proyectos.",
        satellites: [
          { name: "Módulos Progresivos de Vivienda", icon: "Home", detail: "Células habitacionales escalables que crecen con el tiempo según la necesidad." },
          { name: "Módulos Escolares Ampliables", icon: "Building2", detail: "Aulas y talleres modulares para la expansión progresiva del colegio." },
          { name: "Expansión Temporal Coordinada", icon: "Activity", detail: "Evolución armónica y secuencial en el tiempo de ambos proyectos." },
          { name: "Articulación en el Territorio", icon: "Sparkles", detail: "Cohesión urbana y paisajística entre el hábitat residencial y el equipamiento." }
        ]
      }
    ],
    relations: [
      {
        id: "rel-oe01-oe02",
        from: "oe01",
        to: "oe02",
        name: "Articulación OE-01 → OE-02: Dinámicas a Crecimiento",
        type: "directed",
        pathD: "M375,138 Q475,175 488,225",
        arrowTransform: "translate(488,225) rotate(75)",
        desc: "El análisis de dinámicas comunitarias fundamenta la comprensión de los patrones de autoconstrucción y crecimiento progresivo."
      },
      {
        id: "rel-oe02-oe03",
        from: "oe02",
        to: "oe03",
        name: "Articulación OE-02 → OE-03: Patrones a Criterios",
        type: "directed",
        pathD: "M490,365 Q450,440 375,448",
        arrowTransform: "translate(375,448) rotate(174)",
        desc: "Los patrones de crecimiento progresivo y autoconstrucción informan los criterios de diseño e identidad para ambos proyectos."
      },
      {
        id: "rel-oe03-oe04",
        from: "oe03",
        to: "oe04",
        name: "Articulación OE-03 → OE-04: Criterios a Propuesta Modular",
        type: "directed",
        pathD: "M245,448 Q170,440 130,365",
        arrowTransform: "translate(130,365) rotate(-118)",
        desc: "Los criterios de diseño e identidad local orientan la concepción modular y la expansión progresiva de ambos proyectos."
      },
      {
        id: "rel-oe04-oe01",
        from: "oe04",
        to: "oe01",
        name: "Articulación OE-04 ↔ OE-01: Respuesta a Dinámicas Locales",
        type: "bidirectional",
        pathD: "M130,225 Q165,150 245,138",
        arrowTransform: "translate(245,138) rotate(-10)",
        desc: "La propuesta modular responde directamente a las dinámicas comunitarias y espaciales analizadas en el territorio."
      },
      {
        id: "rel-oe01-oe03",
        from: "oe01",
        to: "oe03",
        name: "Articulación OE-01 → OE-03: Diagnóstico a Identidad",
        type: "directed",
        pathD: "M310,180 Q275,295 310,388",
        arrowTransform: "translate(310,388) rotate(90)",
        desc: "Las dinámicas espaciales de la vivienda y el colegio nutren los criterios de identidad local para orientar ambos proyectos."
      },
      {
        id: "rel-oe04-oe02",
        from: "oe04",
        to: "oe02",
        name: "Articulación OE-04 ↔ OE-02: Modulación y Autoconstrucción",
        type: "bidirectional",
        pathD: "M197,295 Q310,255 423,295",
        arrowTransform: "translate(423,295) rotate(20)",
        desc: "La propuesta arquitectónica modular integra y potencia los patrones de crecimiento progresivo y autoconstrucción comunitarios."
      }
    ]
  }
};


