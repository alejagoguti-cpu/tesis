export const projectInfo = {
  title: "REUBICACIÓN & RESILIENCIA HÍDRICA",
  subtitle: "Equipamiento Comunitario e Infraestructura de Adaptación ante la Erosión Costera",
  location: "Isla de Tierrabomba, Cartagena de Indias, Colombia",
  university: "Universidad / Facultad de Arquitectura y Urbanismo",
  year: "2026",
  author: "Alejandro Gutiérrez",
  tutors: "Directores y Asesores de Tesis",
  githubRepo: "https://github.com/alejagoguti-cpu/tesis",
  
  metrics: [
    { value: "+4.200", label: "Habitantes afectados", description: "Población insular sin red de acueducto convencional" },
    { value: "1.8 m/año", label: "Retroceso costero", description: "Tasa crítica de pérdida de borde por oleaje y marea" },
    { value: "100%", label: "Autosuficiencia hídrica", description: "Captación pluvial y desalinización solar integrada" },
    { value: "+22 m.s.n.m.", label: "Cota de seguridad", description: "Meseta de reubicación libre de inundación y erosión" },
  ],

  diagnosis: {
    title: "Diagnóstico Territorial & Problemática",
    summary: "Tierrabomba enfrenta una crisis socio-ambiental crítica: el aislamiento insular frente a Cartagena, la dependencia extrema del agua transportada en barcazas a costos elevados, y la pérdida acelerada de suelo por la erosión marina que amenaza los asentamientos costeros tradicionales.",
    points: [
      {
        id: "agua",
        title: "Crisis Hídrica Estructural",
        description: "0% de cobertura de red de agua potable formal. Los pozos subterráneos están salinizados por intrusión marina. Las familias pagan hasta 5 veces más por litro de agua en comparación con la zona continental de Cartagena.",
        icon: "Droplets",
        badge: "Emergencia Sanitaria"
      },
      {
        id: "erosion",
        title: "Erosión Costera y Vulnerabilidad",
        description: "El cambio climático y el oleaje han consumido playas y cimientos en Punta Arena y Bocachica, forzando la reubicación de equipamientos y viviendas en riesgo inminente de colapso.",
        icon: "Waves",
        badge: "Riesgo Geológico"
      },
      {
        id: "equipamiento",
        title: "Déficit de Infraestructura Colectiva",
        description: "Carencia de espacios cívicos, centros de salud con autonomía operativa y puntos de acopio comunitario que respondan a emergencias climáticas y eventos de mar de leva.",
        icon: "Building2",
        badge: "Déficit Dotacional"
      }
    ]
  },

  strategy: {
    title: "Estrategia de Reubicación & Masterplan",
    description: "La propuesta plantea retirar los equipamientos críticos de la línea de vulnerabilidad marina y reubicarlos en la meseta central segura de la isla, consolidando un nodo cívico articulado mediante senderos bioclimáticos y terrazas de absorción hídrica.",
    pillars: [
      {
        step: "01",
        title: "Cota de Impregnación Cero",
        desc: "Implantación en la meseta central a cota +22.00 m.s.n.m., fuera del alcance de la erosión y aumento del nivel del mar para los próximos 100 años."
      },
      {
        step: "02",
        title: "Célula Hídrica Colectiva",
        desc: "El techo del equipamiento funciona como un macro-embudo captador de agua de lluvia conectado a un sistema modular de aljibes de 450 m³."
      },
      {
        step: "03",
        title: "Materialidad Caribeña Resiliente",
        desc: "Estructura portante en madera laminada tratada, bloques de tierra comprimida (BTC) con áridos locales y celosías cerámicas para ventilación cruzada continua."
      },
      {
        step: "04",
        title: "Paisajismo Fitodepurador",
        desc: "Borduras de manglar y vegetación xerófila costera que fijan el suelo y tratan las aguas grises antes de su infiltración."
      }
    ]
  },

  waterSystem: {
    title: "Sistema Hídrico Integral y Autosuficiente",
    subtitle: "Ciclo cerrado de captación pluvial, tratamiento biológico y recirculación",
    capacity: "450,000 Litros de Reserva Estratégica",
    harvestingArea: "1,850 m² de Cubiertas Captadoras",
    steps: [
      {
        step: "1",
        name: "Captación por Cubiertas Invertidas",
        detail: "1.850 m² de cubiertas con pendientes calculadas hacia canales centrales de acero inoxidable con trampas de hojas y sedimentos gruesos.",
        capacity: "~1.480 m³ anuales proyectados"
      },
      {
        step: "2",
        name: "Desarenador & Separación de Primeras Aguas (First Flush)",
        detail: "Dispositivo automático que desvía los primeros 2 mm de lluvia (polvo y salitre acumulado) para garantizar agua limpia a las cisternas.",
        capacity: "99.2% retención de sólidos"
      },
      {
        step: "3",
        name: "Almacenamiento en Bóvedas Térmicas Subterráneas",
        detail: "Cisternas modulares de concreto ciclópeo impermeabilizado bajo la cota de suelo para mantener el agua fresca y protegida de la luz solar.",
        capacity: "450.000 L de almacenamiento"
      },
      {
        step: "4",
        name: "Filtración Multietapa y Desinfección Solar UV",
        detail: "Microfiltración por lecho de arena y carbón activado, complementada con lámparas UV alimentadas por paneles solares fotovoltaicos.",
        capacity: "Agua 100% potable según norma"
      },
      {
        step: "5",
        name: "Bio-humedal de Aguas Grises y Riego",
        detail: "Tratamiento de aguas de lavamanos y duchas mediante humedales artificiales de flujo subsuperficial con plantas fitorremediadoras locales.",
        capacity: "Reutilización del 70% para huerto y bosque"
      }
    ]
  },

  blueprints: [
    {
      id: "planta-general",
      title: "Planta General de Implantación & Paisaje",
      scale: "1:200",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Arquitectónico / Urbano",
      description: "Distribución de pabellones cívicos, plazas de acceso, senderos peatonales y conexión con el sistema de bio-lagunas y reservorios.",
      tags: ["Masterplan", "Topografía", "Paisajismo"],
      svgType: "masterplan"
    },
    {
      id: "planta-arquitectonica",
      title: "Planta Arquitectónica Nivel +0.00 / Nivel +3.80",
      scale: "1:100",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Arquitectónico",
      description: "Distribución interior: Centro de Salud de Primer Nivel, Aulas Comunitarias, Talleres de Capacitación Náutica y Dispensario Hídrico.",
      tags: ["Equipamiento", "Distribución", "Cotas"],
      svgType: "floorplan"
    },
    {
      id: "corte-longitudinal",
      title: "Corte Transversal Bioclimático A-A' & B-B'",
      scale: "1:75",
      format: "Pliego DIN A1 (841 x 594 mm)",
      type: "Técnico / Bioclimático",
      description: "Comportamiento de vientos alisios del norte, flujo de convección térmica en cubiertas inclinadas y sección de cisterna subterránea.",
      tags: ["Sección", "Bioclimática", "Cisterna"],
      svgType: "section"
    },
    {
      id: "detalle-hidrico",
      title: "Detalle Constructivo: Cisterna, Filtros & Bajantes Pluviales",
      scale: "1:20",
      format: "Pliego DIN A2 (594 x 420 mm)",
      type: "Ingeniería / Detalle",
      description: "Detalle de anclaje de canaletes, cámara de sedimentación, electrobomba solar sumergible y losa de cimentación aligerada.",
      tags: ["Hidrosanitario", "Detalle Constructivo", "Corte por Fachada"],
      svgType: "detail"
    }
  ]
};
