// =========================================================================
// HISTORICAL CARTOGRAPHY OF CARTAGENA DE INDIAS & TIERRABOMBA
// Atlas actualizado: 1589 → 1740 → 1780 → 1820 → 1831 → 1900 → actual
// =========================================================================

import map1589 from '../assets/maps/historical/map_1589_drake_cartagena.jpg';
import map1740 from '../assets/maps/historical/map_1740_sitio_vernon.jpg';
import map1780 from '../assets/maps/historical/map_1780_bahia_chastenet.png';
import map1820 from '../assets/maps/historical/map_1820_paz_bahia.png';
import map1831 from '../assets/maps/historical/map_1831_puerto_costa_firme.png';
import map1900 from '../assets/maps/historical/map_1900_carta_rusa.png';

export const HISTORICAL_MAPS_DATA = [
  {
    id: "map_1589",
    year: 1589,
    flipHorizontal: true,
    title: "1589: Ocupación militar y ausencia de planificación urbana",
    shortTitle: "1589: Ocupación Militar",
    subtitle: "Años 1500 a 1700 — Cartografía Isabelina (Baptista Boazio)",
    image: map1589,
    scale: "Planta pictórica sin escala uniforme",
    author: "Baptista Boazio (tras el saqueo de Francis Drake, 1586)",
    period: "Años 1500 a 1700",
    orientation: "Vista caballera del frente marino occidental",
    description: "Durante este periodo, España ocupó la isla únicamente con fines defensivos militares, construyendo fortalezas como los Fuertes de San Fernando y San Luis. Al ser una plataforma de piedra coralina que no tiene ríos ni manantiales, las tropas militares dependían exclusivamente de juntar agua de lluvia en aljibes de piedra o de traerla en barcos desde el continente. Como el territorio solo albergaba soldados de forma temporal, nunca se planificó un pueblo ni una infraestructura para la vida civil.",
    urbanAnalysis: "Enclave puramente militar sin asentamiento civil. La carencia de fuentes naturales de agua dulce y la dependencia de aljibes pluviales y barcazas desde Cartagena sentaron las bases del aislamiento estructural.",
    keyFeatures: [
      "Flota de Francis Drake fondeada frente a la ciudad (1586)",
      "Tierrabomba concebida exclusivamente como baluarte defensivo",
      "Ausencia total de trazado civil y de infraestructura comunitaria",
      "Dependencia absoluta de aljibes de lluvia y transporte de agua"
    ],
    cartoucheText: "Planta de Cartagena de Indias tras la expedición de Francis Drake, grabada por Baptista Boazio."
  },
  {
    id: "map_1740",
    year: 1740,
    flipHorizontal: true,
    title: "1740: Ocupación militar y ausencia de planificación urbana",
    shortTitle: "1740: Ocupación Militar",
    subtitle: "Años 1500 a 1700 — Bahía Artillada & Guerra del Asiento",
    image: map1740,
    scale: "Escala en millas alemanas",
    author: "Grabadores alemanes contemporáneos al sitio de 1741",
    period: "Años 1500 a 1700",
    orientation: "Norte con rosa de los vientos central",
    description: "Durante este periodo, España ocupó la isla únicamente con fines defensivos militares, construyendo fortalezas como los Fuertes de San Fernando y San Luis. Al ser una plataforma de piedra coralina que no tiene ríos ni manantiales, las tropas militares dependían exclusivamente de juntar agua de lluvia en aljibes de piedra o de traerla en barcos desde el continente. Como el territorio solo albergaba soldados de forma temporal, nunca se planificó un pueblo ni una infraestructura para la vida civil.",
    urbanAnalysis: "La isla se consolida como fortaleza marítima frente al sitio de Vernon (1741). Los fuertes de Bocachica y las baterías sobre Tierrabomba operan como cuartel militar sin proyectar jamás un pueblo ni redes de servicios para vida civil.",
    keyFeatures: [
      "Escuadra inglesa de Vernon desplegada frente a Bocachica",
      "Fortalezas de San Luis y baterías de Tierrabomba artilladas",
      "Plataforma coralina sin ríos: almacenamiento en aljibes de piedra",
      "Territorio de ocupación temporal castrense sin planificación urbana"
    ],
    cartoucheText: "Neu Cartagena — Plano del sitio inglés de Cartagena de Indias y su bahía."
  },
  {
    id: "map_1780",
    year: 1780,
    title: "1780: El origen de la erosión costera",
    shortTitle: "1780: Origen de la Erosión",
    subtitle: "Años 1755 a 1758 — Escollera Submarina de Bocagrande",
    image: map1780,
    scale: "Escala en toesas francesas",
    author: "M. le Comte de Chastenet (Marina francesa)",
    period: "Años 1755 a 1758",
    orientation: "Norte con flor de lis y meridiana",
    description: "Entre los años 1755 y 1758, el ingeniero Antonio de Arévalo construyó la Escollera Submarina de Bocagrande, un muro sumergido de piedra que cerró el paso del agua para impedir la entrada de barcos enemigos a la bahía. Esta obra cambió las corrientes del mar y desvió la fuerza del oleaje del Caribe directamente contra la orilla de Tierrabomba, dando inicio al fenómeno de erosión costera que comenzó a carcomer sus playas.",
    urbanAnalysis: "El muro submarino construido entre 1755 y 1758 desvió la hidrodinámica del Caribe hacia la orilla oriental y norte de Tierrabomba. Este hito ingenieril constituye la causa originaria del retroceso costero y socavación marina que perdura hasta el presente.",
    keyFeatures: [
      "Escollera Submarina de Bocagrande construida por Antonio de Arévalo",
      "Cierre del canal y alteración del régimen de corrientes del Caribe",
      "Desvío de la fuerza del oleaje frontalmente contra la costa de Tierrabomba",
      "Inicio del proceso histórico de erosión marina y pérdida de playas"
    ],
    cartoucheText: "Baye de Cartagène dans le Royaume de Santa Fé — Levé par M. le Comte de Chastenet."
  },
  {
    id: "map_1820",
    year: 1820,
    title: "1820: El asentamiento de la comunidad raizal",
    shortTitle: "1820: Asentamiento Raizal",
    subtitle: "Años 1800 — Topografía Republicana (Manuel M. Paz)",
    image: map1820,
    scale: "Escala de 1 legua de 20 al grado",
    author: "Manuel M. Paz (Comisión Corográfica)",
    period: "Años 1800",
    orientation: "Norte vertical con meridiana",
    description: "Tras la independencia, familias afrodescendientes y pescadores nativos poblaron la isla de forma orgánica, estableciéndose alrededor de las ruinas de las antiguas fortalezas por su cercanía al mar y su vocación pesquera. Los caseríos crecieron adaptándose al territorio de manera espontánea.",
    urbanAnalysis: "Poblamiento espontáneo y orgánico: comunidades afrodescendientes y pescadores se asientan junto a los fuertes abandonados para faenar en la bahía. La falta de ordenamiento estatal deja a las viviendas expuestas al oleaje en la franja baja.",
    keyFeatures: [
      "Familias afrodescendientes y pescadores nativos tras la independencia",
      "Asentamiento orgánico alrededor de las ruinas de las fortalezas",
      "Crecimiento espontáneo sin trazado urbano ni infraestructura pública",
      "Vocación pesquera que ancla a las comunidades al borde vulnerable del agua"
    ],
    cartoucheText: "Plano de la Bahía y Puerto de Cartagena tomado conforme a la topografía actual por Manuel M. Paz."
  },
  {
    id: "map_1831",
    year: 1831,
    title: "1831: El asentamiento de la comunidad raizal",
    shortTitle: "1831: Comunidad Raizal",
    subtitle: "Años 1800 — Carta Náutica & Costa de Tierra Firme",
    image: map1831,
    scale: "Escala de tres millas marinas",
    author: "Depósito Hidrográfico Francés",
    period: "Años 1800",
    orientation: "Latitud norte 10°26' y longitud de París",
    description: "Tras la independencia, familias afrodescendientes y pescadores nativos poblaron la isla de forma orgánica, estableciéndose alrededor de las ruinas de las antiguas fortalezas por su cercanía al mar y su vocación pesquera. Los caseríos crecieron adaptándose al territorio de manera espontánea.",
    urbanAnalysis: "El relieve de la isla muestra la meseta segura elevada desocupada (+22m), mientras los caseríos de Bocachica y Tierrabomba se concentran en las orillas bajas para el zarpe de canoas, aumentando su exposición.",
    keyFeatures: [
      "Poblados de pescadores consolidándose en la línea de pleamar",
      "Adaptación espontánea al territorio sin apoyo institucional",
      "Ruinas militares coloniales reutilizadas como cobijo y cantera comunal",
      "Meseta interior libre de socavación como oportunidad territorial futura"
    ],
    cartoucheText: "Port de Cartagena — Côte de l'Amérique Méridionale, carta de sondas y derrotas."
  },
  {
    id: "map_1900",
    year: 1900,
    title: "1900: La brecha del agua potable",
    shortTitle: "1900: Brecha del Agua",
    subtitle: "Años 1900 — Carta de la Bahía & Desconexión de Redes",
    image: map1900,
    scale: "Escala en leguas marinas",
    author: "Levantamiento hidrográfico de entresiglos",
    period: "Años 1900",
    orientation: "Norte con rosa y canales de acceso",
    description: "A lo largo de los años 1900, la falta de agua se convirtió en una brecha de infraestructura: mientras la Cartagena continental construía su red de acueducto trayendo agua desde el Canal del Dique, el Estado no instaló la tubería submarina hacia la isla. Esto obligó a los pobladores a abastecerse comprando agua traída en pimpinas y lanchas desde el continente.",
    urbanAnalysis: "Se consuma la brecha histórica de servicios esenciales: Cartagena continental se moderniza e interconecta con el Canal del Dique, mientras Tierrabomba es marginada del acueducto público submarino, forzando un costoso mercado informal de acarreo en pimpinas.",
    keyFeatures: [
      "Cartagena continental construye acueducto desde el Canal del Dique",
      "Omisión estatal: no se instala tubería submarina de agua potable a la isla",
      "Pobladores forzados a comprar agua en pimpinas y lanchas desde el continente",
      "Consolidación de una brecha de infraestructura básica que perdura hoy"
    ],
    cartoucheText: "Carta de la Bahía de Cartagena con sus fuertes, canales y la isla de Tierra Bomba."
  }
];
