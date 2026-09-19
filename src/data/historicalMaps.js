// =========================================================================
// HISTORICAL CARTOGRAPHY OF CARTAGENA DE INDIAS & TIERRABOMBA
// Base cartográfica primaria para el análisis de evolución morfológica e insular
// =========================================================================

import map1690 from '../assets/maps/historical/map_1690_bahia_galeones.jpg';
import map1730 from '../assets/maps/historical/map_1730_colonial_alegoria.jpg';
import map1770 from '../assets/maps/historical/map_1770_planta_cuarteles.jpg';
import map1780 from '../assets/maps/historical/map_1780_defensivo_manga.jpg';
import map1915 from '../assets/maps/historical/map_1915_pearson_puerto.jpg';

export const HISTORICAL_MAPS_DATA = [
  {
    id: "map_1690",
    year: 1690,
    title: "1690: Sistema Defensivo y Entrada a la Bahía de Cartagena",
    shortTitle: "1690: Flota Naval & Baterías",
    subtitle: "Cartografía Colonial Temprana — Archivo General de Indias",
    image: map1690,
    scale: "Escala en leguas y varas castellanas",
    author: "Ingenieros Militares de la Corona Española",
    period: "Siglo XVII Tardío",
    orientation: "Norte indicado con Rosa de los Vientos y Flor de Lis",
    description: "Plano estratégico que documenta la plaza fuerte amurallada, el fondeadero interior y el despliegue defensivo de la Flota de Galeones. Demuestra el rol histórico primordial de la Isla de Tierrabomba y el paso de Bocachica como escudo protector natural y llave de entrada a la bahía.",
    urbanAnalysis: "Traza inicial del recinto intramuros (Calahorra y Santa Catalina). Getsemaní incipiente como arrabal extramuros. La franja costera y los canales interiores evidencian el flujo hidrodinámico original antes de los dragados modernos.",
    keyFeatures: [
      "Flota de galeones españoles anclados en formación defensiva en la bahía",
      "Rosa de los vientos policromada con flor de lis en el cuadrante superior",
      "Delineación de las primeras baterías costeras y fosos de marea",
      "Isla de Tierrabomba como barrera natural frente a incursiones corsarias"
    ],
    cartoucheText: "Plano del Sitio y Defensas de la Plaza de Cartagena de Indias con la disposición de la Escuadra Real."
  },
  {
    id: "map_1730",
    year: 1730,
    title: "1730: Plano de la Plaza Fuerte de Cartagena de Indias",
    shortTitle: "1730: Cartografía Ilustrada",
    subtitle: "Cartografía Ilustrada Barroca con Orla Alegórica Marina",
    image: map1730,
    scale: "Escala de varas castellanas",
    author: "Real Cuerpo de Ingenieros de Ultramar",
    period: "Siglo XVIII (Época Virreinal)",
    orientation: "Orientación hacia el frente marino occidental",
    description: "Extraordinaria pieza cartográfica virreinal enriquecida con un frontispicio alegórico superior que representa a Neptuno y divinidades marinas sobre cuadriga. Detalla la consolidación del sistema de murallas, baluartes y cortinas del Centro Histórico y San Diego.",
    urbanAnalysis: "Damasco ortogonal consolidado en el Centro; plazas mayores y menores delimitadas. Getsemaní amurallado con su propio frente defensivo. Se observa el cordón de ciénagas de San Lázaro y Chambacú como aislamiento hídrico defensivo.",
    keyFeatures: [
      "Orla artística superior con Neptuno, tritones y escudo de armas de la ciudad",
      "Baluartes de San Francisco Javier, San Ignacio, Santo Domingo y Santa Clara",
      "Relación directa entre las murallas y la línea de rompiente de olas",
      "Toponimia detallada de baluartes, puertas de tierra y puertas de mar"
    ],
    cartoucheText: "Plano de la Ciudad de Cartagena de Indias con su explicacion de Baluartes, Puertas y Edificios Notables."
  },
  {
    id: "map_1770",
    year: 1770,
    title: "1770: Planta de la Plaza y División por Cuarteles Militares",
    shortTitle: "1770: Catastro & Cuarteles",
    subtitle: "Levantamiento Topográfico y Catastral Intramuros",
    image: map1770,
    scale: "Escala de 100 toesas / varas",
    author: "Ingeniero Militar Juan de Herrera y Sotomayor / Antonio de Arévalo",
    period: "Reformas Borbónicas (Siglo XVIII)",
    orientation: "Norte vertical con meridiana de precisión",
    description: "Planta catastral de máxima precisión geométrica que incluye una extensa tabla explicativa en el margen izquierdo. Enumera rigurosamente las divisiones por cuarteles de policía, manzanas, conventos, iglesias, dependencias de la Real Hacienda y calles principales.",
    urbanAnalysis: "Punto culminante de la ingeniería militar española. Muestra la densidad de ocupación del suelo, los aljibes comunales bajo plazas y conventos, y el sistema de evacuación de aguas pluviales hacia las ciénagas interiores.",
    keyFeatures: [
      "Índice exhaustivo de más de 60 hitos cívicos, eclesiásticos y militares",
      "Sectorización en Quartel de la Catedral, Quartel de San Diego y Quartel de Getsemaní",
      "Identificación de conventos: San Pedro Claver, Santo Domingo, Santa Teresa, La Merced",
      "Trazo de las cortinas de muralla y baterías colaterales con ángulos de tiro"
    ],
    cartoucheText: "PLANTA de la Plaza en que se manifiestan los Quarteles que dividen su Poblacion, Calles, Yglesias y Conventos..."
  },
  {
    id: "map_1780",
    year: 1780,
    title: "1780: Plano Estratégico de Fortificaciones y Entorno Insular",
    shortTitle: "1780: Red Defensiva & Manga",
    subtitle: "Plano Militar (Fig. 2ª) — Centro, San Lázaro, Manga y Bahía Interior",
    image: map1780,
    scale: "Escala de 300 varas castellanas",
    author: "Antonio de Arévalo (Mariscal de Campo e Ingeniero General)",
    period: "Siglo XVIII Tardío",
    orientation: "Rosa de los Vientos con Flor de Lis en la bahía de las Ánimas",
    description: "Plano estratégico policromado con tintas al agua y carmín que articula la relación territorial entre el Centro amurallado, Getsemaní, el cerro de San Lázaro coronado por el Castillo de San Felipe de Barajas, la Isla de Manga y la bahía interior.",
    urbanAnalysis: "Ilustra el concepto de defensa en profundidad: la ciudad no es un punto aislado sino un ecosistema territorial interconectado por cuerpos de agua, bajos marinos y fortificaciones exteriores que alcanzaban Tierrabomba y Bocachica.",
    keyFeatures: [
      "Manzanas urbanas iluminadas en carmín para distinguir el tejido edificado",
      "Castillo San Felipe de Barajas con su sistema de hornabeques y galerías subterráneas",
      "Delimitación de la Isla de Manga y esteros con batimetría somera",
      "Sector de El Cabrero y escollera submarina para disipar la fuerza del oleaje"
    ],
    cartoucheText: "Plano Fig. 2a — Demostración de las Fortificaciones de Cartagena de Indias y sus avenidas terrestres y marítimas."
  },
  {
    id: "map_1915",
    year: 1915,
    title: "1915: Estudios del Puerto de Cartagena (S. Pearson & Son Ltd)",
    shortTitle: "1915: Estudios Puerto Moderno",
    subtitle: "Levantamiento Hidrográfico y Urbano — Hoja Núm. 1 (Escala 1:2500)",
    image: map1915,
    scale: "Escala 1 : 2500 (Junio de 1915)",
    author: "S. Pearson & Son Ltd (10 Victoria St, London) / Ministerio de Obras Públicas",
    period: "Inicios del Siglo XX (República)",
    orientation: "Norte magnético y geográfico con declinación de 1915",
    description: "Documento fundacional del urbanismo moderno cartagenero. Levantado por la célebre firma de ingeniería británica S. Pearson & Son Ltd para la modernización del puerto comercial, la estación del Ferrocarril a Calamar y las nuevas líneas de tranvía.",
    urbanAnalysis: "Registra la transición entre la ciudad amurallada y la expansión republicana: apertura del Camellón de los Mártires, estación del Ferrocarril de Calamar, relleno de playones y demolición parcial de murallas para dar paso a la infraestructura portuaria moderna.",
    keyFeatures: [
      "Levantamiento predial milimétrico a escala 1:2500 con curvas de nivel e hidrografía",
      "Trazado del Ferrocarril Cartagena-Calamar y muelles de La Machina",
      "Leyenda con 45 edificios públicos: Fábricas, Teatro Municipal, Hospital, Plantas Eléctricas",
      "Línea de costa y caños antes de las grandes transformaciones industriales de Mamonal"
    ],
    cartoucheText: "ESTUDIOS DEL PUERTO DE CARTAGENA — Junio de 1915. PLANO DE LA CIUDAD HOJA NUM. 1. Escala 1 : 2500. S. PEARSON & SON LTD, LONDON."
  }
];
