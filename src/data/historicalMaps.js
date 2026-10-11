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
    title: "1589: Cartagena tras Drake — Primera Planta de la Ciudad",
    shortTitle: "1589: Planta Drake",
    subtitle: "Cartografía Isabelina — Grabado de Baptista Boazio",
    image: map1589,
    scale: "Planta pictórica sin escala uniforme",
    author: "Baptista Boazio (tras el saqueo de Francis Drake, 1586)",
    period: "Siglo XVI",
    orientation: "Vista caballera del frente marino occidental",
    description: "Primera imagen urbana de Cartagena: la ciudad amurallada en damero fundacional, la flota inglesa fondeada y la fauna del trópico. Documenta el momento en que la Corona entiende que Cartagena debe convertirse en plaza fuerte: de aquí nace el sistema defensivo que usará a Tierrabomba como escudo.",
    urbanAnalysis: "Traza fundacional en cuadrícula, puerto abierto sin muralla marítima consolidada y bahía como fondeadero natural. Tierrabomba aparece como masa insular despoblada que cierra la bahía por el sur.",
    keyFeatures: [
      "Flota de Francis Drake fondeada frente a la ciudad (1586)",
      "Damero fundacional y plaza mayor con catedral incipiente",
      "Rosa de los vientos y cartela iluminada con fauna tropical",
      "Isla de Tierrabomba como cierre natural de la bahía"
    ],
    cartoucheText: "Planta de Cartagena de Indias tras la expedición de Francis Drake, grabada por Baptista Boazio."
  },
  {
    id: "map_1740",
    year: 1740,
    flipHorizontal: true,
    title: "1740: El Sitio Inglés — Bahía Artillada de Cartagena",
    shortTitle: "1740: Sitio de Vernon",
    subtitle: "Plano Alemán del Sitio — Campaña de Edward Vernon (1741)",
    image: map1740,
    scale: "Escala en millas alemanas",
    author: "Grabadores alemanes contemporáneos al sitio de 1741",
    period: "Siglo XVIII (Guerra del Asiento)",
    orientation: "Norte con rosa de los vientos central",
    description: "Plano del mayor ataque naval del siglo XVIII: la escuadra de Vernon frente a una bahía convertida en fortaleza. Muestra por qué Bocachica y Tierrabomba eran la llave de Indias: quien controlaba el canal controlaba el tesoro del virreinato.",
    urbanAnalysis: "Ciudad completamente amurallada, castillos de San Luis y San José en Bocachica, baterías en Tierrabomba y líneas de navíos bloqueando la bahía. La isla ya es infraestructura militar.",
    keyFeatures: [
      "Escuadra inglesa de Vernon desplegada en la bahía",
      "Castillos de Bocachica y baterías de Tierrabomba artilladas",
      "Rosa de los vientos de 32 rumbos sobre la bahía",
      "Cartela histórica con la relación del sitio"
    ],
    cartoucheText: "Neu Cartagena — Plano del sitio inglés de Cartagena de Indias y su bahía."
  },
  {
    id: "map_1780",
    year: 1780,
    title: "1780: Derrotero Científico de la Bahía (Chastenet)",
    shortTitle: "1780: Bahía Chastenet",
    subtitle: "Levantamiento Francés — Campaña del Conde de Chastenet (1783)",
    image: map1780,
    scale: "Escala en toesas francesas",
    author: "M. le Comte de Chastenet (Marina francesa)",
    period: "Siglo XVIII Tardío",
    orientation: "Norte con flor de lis y meridiana",
    description: "Primer levantamiento hidrográfico moderno de la bahía: sondas, bajos, canales de Bocagrande y Bocachica y derrota de entrada. La bahía deja de ser secreto español y entra a la cartografía científica europea.",
    urbanAnalysis: "Derrota de navegación marcada con sondas en brazas, bajos de Salmedina y la isla de Tierrabomba relevada con su relieve. Base técnica de toda la defensa posterior del XIX.",
    keyFeatures: [
      "Sondas batimétricas sistemáticas de la bahía interior",
      "Derrota de entrada por Bocachica con marcas de enfilación",
      "Tierrabomba relevada con toponimia de puntas y playas",
      "Bajos y arrecifes de Salmedina y Bocagrande"
    ],
    cartoucheText: "Baye de Cartagène dans le Royaume de Santa Fé — Levé par M. le Comte de Chastenet."
  },
  {
    id: "map_1820",
    year: 1820,
    title: "1820: Bahía y Puerto de Cartagena (Manuel M. Paz)",
    shortTitle: "1820: Plano Paz",
    subtitle: "Topografía Republicana — Comisión Corográfica",
    image: map1820,
    scale: "Escala de 1 legua de 20 al grado",
    author: "Manuel M. Paz (Comisión Corográfica)",
    period: "República Temprana (Siglo XIX)",
    orientation: "Norte vertical con meridiana",
    description: "Plano republicano con tabla de 16 referencias (A–P): del Pastelillo a Santa Rita, pasando por la isla de Tierra Bomba (M) y el pueblo de Bocachica (N). Radiografía del momento en que la bahía pasa de plaza fuerte a puerto comercial.",
    urbanAnalysis: "Pueblos de pescadores ya asentados (Bocagrande, Tierra Bomba, Bocachica), fuertes en ruinas tras la independencia y la isla de Barú cerrando la bahía por el sur. Base del catastro republicano.",
    keyFeatures: [
      "Tabla de 16 referencias: fuertes, pueblos e islas (A–P)",
      "Isla de Tierra Bomba (M) y pueblo de Bocachica (N)",
      "Huerta de Gracia y desembarco inglés de 1741 (O)",
      "Litografía de Ayala y edición de Manuel M. Paz"
    ],
    cartoucheText: "Plano de la Bahía y Puerto de Cartagena tomado conforme a la topografía actual por Manuel M. Paz."
  },
  {
    id: "map_1831",
    year: 1831,
    title: "1831: Puerto de Cartagena — Costa de Tierra Firme",
    shortTitle: "1831: Puerto & Sondas",
    subtitle: "Carta Náutica Francesa — Côte de Terre Ferme",
    image: map1831,
    scale: "Escala de tres millas marinas",
    author: "Depósito Hidrográfico Francés",
    period: "Siglo XIX",
    orientation: "Latitud norte 10°26' y longitud de París",
    description: "Carta de navegación con sondas en toda la bahía: cada número es una braza medida a plomo. Muestra la isla de Tierra Bomba (Île de Tierra Bomba) con su relieve sombreado y los pasos de Bocachica balizados para el comercio del XIX.",
    urbanAnalysis: "Batimetría completa del XIX: canal navegable, bajos interiores y costa firme de Tesca. La isla se lee como cuerpo volcánico-sedimentario con alturas que anticipan la meseta segura de la tesis (+22 m).",
    keyFeatures: [
      "Sondas en brazas sobre toda la bahía interior",
      "Île de Tierra Bomba con sombreado de relieve",
      "Paso de Bocachica (Petite Passe) balizado",
      "Ciénaga de Tesca y marismas orientales"
    ],
    cartoucheText: "Port de Cartagena — Côte de l'Amérique Méridionale, carta de sondas y derrotas."
  },
  {
    id: "map_1900",
    year: 1900,
    title: "1900: Carta de la Bahía — Tierrabomba Artillada",
    shortTitle: "1900: Carta de la Bahía",
    subtitle: "Carta Hidrográfica — Fuertes de San Luis y San José",
    image: map1900,
    scale: "Escala en leguas marinas",
    author: "Levantamiento hidrográfico de entresiglos",
    period: "Entre Siglos XIX–XX",
    orientation: "Norte con rosa y canales de acceso",
    description: "Carta de entresiglos con la bahía ya cerrada por la escollera de Bocagrande (línea punteada): la isla queda unida al sistema defensivo y nace la configuración actual. Se leen los fuertes de San Luis, San José y la batería Baradera sobre Tierrabomba.",
    urbanAnalysis: "Escollera submarina anti-oleaje en Bocagrande, canal de Bocachica como única entrada y Tierrabomba con sus fuertes costeros. La foto fija del punto de partida del siglo XX que hereda la tesis.",
    keyFeatures: [
      "Escollera de Bocagrande (trazado punteado)",
      "Fuertes de San Luis, San José y batería Baradera",
      "Boca-Chica y Boca-Grande rotuladas con sus canales",
      "Sondas del canal interior hasta Castillo Grande"
    ],
    cartoucheText: "Carta de la Bahía de Cartagena con sus fuertes, canales y la isla de Tierra Bomba."
  }
];
