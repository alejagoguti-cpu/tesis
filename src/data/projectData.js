export const projectInfo = {
  thesisCode: "TESIS-ARQ-2026-TB",
  title: "HÁBITAT RESILIENTE & REUBICACIÓN EN TIERRABOMBA",
  subtitle: "Plan Maestro de Relocalización Habitacional, Equipamiento Educativo e Infraestructura Hídrica ante la Erosión Costera",
  location: "Isla de Tierrabomba, Cartagena de Indias, Bolívar, Colombia",
  university: "Universidad / Facultad de Arquitectura, Arte y Diseño",
  program: "Proyecto de Grado para optar al título de Arquitecta",
  year: "2026",
  author: "Alejandra Gómez & Ana Casas",
  tutors: "Directores y Asesores de Tesis",
  githubRepo: "https://github.com/alejagoguti-cpu/tesis",

  // 1. MARCO ACADÉMICO / JUSTIFICACIÓN & OBJETIVOS
  academicFramework: {
    justification: {
      problemStatement: "La Isla de Tierrabomba presenta una condición de extrema vulnerabilidad multidimensional: un aislamiento geográfico-institucional frente a Cartagena, una pérdida acelerada de la franja costera de hasta 1.8 metros lineales por año debido a la dinámica del oleaje y el cambio climático, y una carencia absoluta (0%) de red pública de agua potable y saneamiento básico. Esta situación ha dejado a más de 4.200 habitantes en riesgo de colapso habitacional por erosión marina y bajo una dependencia onerosa de barcazas de agua.",
      academicJustification: "La reubicación no puede limitarse a un mero traslado físico de estructuras, sino que debe concebirse como un proyecto integral de ordenamiento territorial y hábitat sostenible. Esta investigación proyectual articula el diseño de vivienda de interés social adaptativa con un equipamiento educativo bioclimático que funciona a la vez como catalizador social, centro de acopio comunal y nodo de captación y purificación de agua pluvial.",
    },
    generalObjective: "Formular un Plan Maestro de Reubicación Territorial en la meseta segura de Tierrabomba (+22.00 m.s.n.m.), desarrollando el diseño arquitectónico integral de prototipos de vivienda progresiva resiliente y un equipamiento educativo bioclimático dotado de infraestructura de autosuficiencia hídrica.",
    specificObjectives: [
      {
        code: "OE-01",
        title: "Diagnóstico & Zonificación de Riesgo",
        desc: "Determinar las áreas de vulnerabilidad crítica por erosión e inundación marina, delimitando el polígono seguro de relocalización en la meseta central de la isla."
      },
      {
        code: "OE-02",
        title: "Prototipos de Vivienda Progresiva Resiliente",
        desc: "Diseñar tipologías de vivienda modular, bioclimática y ampliable que respondan a los modos de vida insular, las dinámicas familiares y la autoconstrucción comunitaria con materiales locales."
      },
      {
        code: "OE-03",
        title: "Equipamiento Educativo & Centro Comunal",
        desc: "Proyectar un complejo pedagógico y comunitario con aulas ventiladas naturalmente, talleres de formación técnica/marítima, biblioteca y comedor colectivo que opere como refugio ante emergencias."
      },
      {
        code: "OE-04",
        title: "Soberanía Hídrica & Ciclo Circular",
        desc: "Integrar un sistema de captación pluvial en cubiertas, almacenamiento subterráneo inmune a la salinidad (450.000 L) y tratamiento de aguas grises mediante humedales fitodepuradores."
      }
    ]
  },

  // 2. MÉTRICAS CLAVE DEL PROYECTO
  metrics: [
    { value: "120", label: "Viviendas Reubicadas", description: "Familias trasladadas de la cota de riesgo marino" },
    { value: "1.850 m²", label: "Equipamiento Educativo", description: "Área construida para 350 estudiantes y comunidad" },
    { value: "450.000 L", label: "Aljibe Comunitario", description: "Reserva estratégica de agua 100% potable" },
    { value: "+22.00 m", label: "Cota de Implantación", description: "Meseta protegida de inundación y erosión marina" },
  ],

  // 3. PROGRAMA DE VIVIENDA REUBICADA
  housingProgram: {
    title: "Prototipo de Vivienda Resiliente & Progresiva",
    concept: "Viviendas diseñadas bajo el principio de crecimiento incremental (módulos básicos de 54 m² ampliables a 86 m²), orientadas según los vientos alisios y elevadas 0.60 m sobre el terreno natural para favorecer el drenaje y la ventilación inferior.",
    typologies: [
      {
        name: "Tipología A - Módulo Base Familiar",
        area: "54 m²",
        occupancy: "4 a 5 personas",
        features: ["2 Habitaciones", "Área social integrada a patio de sombra", "Cocina con ventilación directa", "Baño seco / bajo consumo", "Tanque individual de 2.500 L"],
        expansion: "Crecimiento lateral hacia huerto productivo"
      },
      {
        name: "Tipología B - Vivienda Productiva / Taller",
        area: "72 m²",
        occupancy: "5 a 7 personas",
        features: ["3 Habitaciones", "Pórtico frontal para taller artesanal o secado de pesca", "Patio de ventilación cruzada", "Cubierta captadora individual"],
        expansion: "Segundo nivel en madera ligera"
      }
    ]
  },

  // 4. PROGRAMA DEL EQUIPAMIENTO EDUCATIVO
  educationalProgram: {
    title: "Complejo Educativo, Cívico & Dispensario Hídrico",
    capacity: "350 estudiantes + 1.200 usuarios comunitarios en fines de semana",
    spaces: [
      { zone: "Área Pedagógica", items: ["6 Aulas bioclimáticas con celosías", "Laboratorio de Ciencias Marinas & Ambientales", "Aula múltiple de innovación y cómputo"] },
      { zone: "Área Comunal & Formación", items: ["Taller de Carpintería y Artes Pesqueras", "Biblioteca comunitaria pública", "Comedor escolar y cocina comunitaria"] },
      { zone: "Infraestructura Hídrica & Cívica", items: ["Dispensario de Agua Potable (12 tomas)", "Plaza de acopio y recreación techada", "Bio-humedal demostrativo y huerto escolar"] }
    ]
  },

  // 5. DIAGNÓSTICO
  diagnosis: {
    title: "Diagnóstico Territorial & Problemática",
    summary: "El estudio de sitio identifica la urgencia de abandonar la franja de los primeros 50 metros de borde costero en Punta Arena y Caño del Oro debido a la socavación de cimientos por oleaje y mareas de leva extraordinarias.",
    points: [
      {
        id: "vivienda",
        title: "Vivienda en Riesgo de Colapso",
        description: "Asentamientos autoconstruidos sobre la línea de playa sin cimentación adecuada ante la pérdida continua de arena y el embate del mar.",
        icon: "Home",
        badge: "Riesgo Físico Alto"
      },
      {
        id: "agua",
        title: "Crisis Sanitaria e Intrusión Salina",
        description: "0% de acueducto. La salinización de pozos freáticos obliga a la población a gastar hasta un 25% de sus ingresos en comprar agua a barcazas privadas.",
        icon: "Droplets",
        badge: "Déficit Básico"
      },
      {
        id: "educacion",
        title: "Infraestructura Escolar Deficitaria",
        description: "La escuela existente carece de servicios sanitarios continuos, aulas con confort térmico y espacios para formación técnica orientada al territorio.",
        icon: "GraduationCap",
        badge: "Déficit Dotacional"
      }
    ]
  },

  // 6. ESTRATEGIA DE REUBICACIÓN & BIOCLIMÁTICA
  strategy: {
    title: "Estrategia de Reubicación & Criterios Bioclimáticos",
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

  // 7. SISTEMA HÍDRICO
  waterSystem: {
    title: "Memoria Técnica: Sistema Hídrico Integral & Autosuficiente",
    subtitle: "Ciclo cerrado de captación pluvial, desinfección solar y recirculación",
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
