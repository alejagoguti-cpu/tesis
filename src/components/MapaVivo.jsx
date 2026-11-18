import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Ship, Waves, Users, Lightbulb, Home, Gamepad2, Play, Volume2, VolumeX, ArrowLeft, ArrowRight,
  School, PartyPopper, Shield, Droplets, Route, Fish, Trees, Box, Building2, Anchor, BookOpen,
  User, Dices, History, Hand, Calendar, Mountain, Utensils, Music, Hammer, Landmark, Map as MapaIcono, X,
} from 'lucide-react';
import { PATRIMONIO_ESCENAS } from '../data/patrimonioEscenas';
import './mapa-vivo.css';

const IslaReal3D = lazy(() => import('./IslaReal3D'));

// =============================================================================
// Mapa vivo de Tierra Bomba para la comunidad.
// Pensado para quien no lee: todo se toca y se escucha (voz del navegador);
// el texto es solo un subtítulo. Misma estética y curva de movimiento del tercer corte.
// Cifras: tesis y presentación del tercer corte. Rutas y muelles: OpenStreetMap y
// estudio de transporte acuático 2014. Inundación y erosión: MIDAS (Alcaldía de Cartagena, INVEMAR).
// =============================================================================

const BASE = import.meta.env.BASE_URL;
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ll = ([lon, lat]) => [lat, lon];

const svg = (Icon, size = 22, extra = {}) => renderToStaticMarkup(<Icon size={size} strokeWidth={1.8} aria-hidden="true" {...extra} />);

// Vistas: [[sur, oeste], [norte, este]]
const VISTAS = {
  inicio: [[10.395, -75.575], [10.44, -75.515]],
  todo: [[10.312, -75.598], [10.428, -75.522]],
  isla: [[10.31, -75.598], [10.392, -75.535]],
  barrio: [[10.3695, -75.5795], [10.3765, -75.5718]],
};

const PUEBLOS = {
  tierraBomba: {
    nombre: 'Tierra Bomba', pos: [10.38022, -75.57532], color: '#ff6b4a', casas: 770, estudiantes: 934,
    voz: 'Tierra Bomba. Tiene unas setecientas setenta casas y construcciones. Aquí está el colegio principal de la isla, con novecientos treinta y cuatro estudiantes. De aquí salen lanchas a Bocagrande, a La Bodeguita y al mercado de Bazurto.',
  },
  puntaArena: {
    nombre: 'Punta Arena', pos: [10.36518, -75.5496], color: '#f5b97a', casas: 385, estudiantes: 106, lanchaEscolar: true,
    voz: 'Punta Arena. Tiene unas trescientas ochenta y cinco casas y construcciones. Su colegio solo llega a quinto de primaria. Por eso, más de sesenta jóvenes viajan cada día en lancha para seguir estudiando.',
  },
  canoDelOro: {
    nombre: 'Caño del Oro', pos: [10.343889, -75.543611], color: '#2fd1b0', casas: 441, estudiantes: 497,
    voz: 'Caño del Oro. Tiene unas cuatrocientas cuarenta y una casas y construcciones, y el colegio San José, con cuatrocientos noventa y siete estudiantes.',
  },
  bocachica: {
    nombre: 'Bocachica', pos: [10.32364, -75.58107], color: '#49c6e5', casas: 1004, estudiantes: 1192,
    voz: 'Bocachica. Es el pueblo más grande de la isla, con unas mil cuatro casas y construcciones, junto a los fuertes. Su colegio tiene mil ciento noventa y dos estudiantes.',
  },
};

const CARTAGENA = {
  pos: [10.4236, -75.5478],
  voz: 'Esto es Cartagena. Allí están el hospital, el mercado de Bazurto y las universidades. Mucha gente de la isla cruza en lancha todos los días. Y muchas decisiones sobre la isla se toman aquí, lejos de la isla.',
};

const LUGAR = {
  hospital: 'el Hospital de Bocagrande', bodeguita: 'La Bodeguita', bazurto: 'el mercado de Bazurto', laguito: 'El Laguito',
  tbPueblo: 'Tierra Bomba', bocachica: 'Bocachica', puntaArena: 'Punta Arena', playaDorada: 'Playa Dorada',
};

const CAPITULOS = [
  { id: 'isla', Icon: Ship, label: 'La isla', color: '#ff6b4a', vista: 'todo',
    voz: 'Esta es Tierra Bomba, frente a Cartagena. En la isla hay cuatro pueblos: Tierra Bomba, Punta Arena, Caño del Oro y Bocachica. Las lanchas los unen con la ciudad. Toca un pueblo o una lancha para escuchar.' },
  { id: 'mar', Icon: Waves, label: 'El mar', color: '#49c6e5', vista: 'isla',
    voz: 'El mar se está llevando la orilla. En algunos tramos, la costa retrocede entre medio metro y tres metros cada año. Las líneas rojas muestran dónde la erosión es más fuerte. Toca las olas para ver hasta dónde puede llegar el agua.' },
  { id: 'gente', Icon: Users, label: 'Nosotros', color: '#f5b97a', vista: 'isla',
    voz: 'La isla es su gente: sus fiestas, sus colegios y su forma de organizarse. Toca los dibujos del mapa para escuchar.' },
  { id: 'eventos', Icon: Calendar, label: 'Eventos', color: '#ff7a50', vista: 'isla',
    voz: 'Los eventos de la isla: las fiestas de siempre y la clase de los viernes. Toca una fecha para saber cuándo es y dónde.' },
  { id: 'ideas', Icon: Lightbulb, label: 'Ideas', color: '#a9cf5c', vista: 'isla',
    voz: 'Proponemos seis ideas para que la gente pueda quedarse en la isla, en suelo seguro. Toca cada número para escucharla.' },
  { id: 'barrio', Icon: Home, label: 'Barrio', color: '#2fd1b0', vista: 'barrio',
    voz: 'Este es el lugar del nuevo barrio: la meseta, la parte más alta, a veintidós metros sobre el mar. Aquí el mar no llega. Tendría ciento veinte casas, un colegio, un tanque grande de agua de lluvia y una plaza para reunirse.' },
  { id: 'jugar', Icon: Gamepad2, label: 'Jugar', color: '#ff7a50', vista: 'todo',
    voz: 'Toca una foto para jugar: cocinar, bailar, conocer los oficios o ver cómo eran los fuertes.' },
];

const NIVELES = [
  { voz: 'La orilla. Las líneas muestran la erosión de la costa: rojo es muy alta, naranja alta, amarillo moderada.' },
  { voz: 'Con una inundación moderada, como la del escenario de dos mil diecinueve, el agua cubre estas zonas bajas de la orilla.' },
  { voz: 'Con una inundación fuerte, como la esperada hacia el año dos mil cuarenta, el agua entra todavía más.' },
];

const GENTE = [
  { id: 'organizacion', Icon: Users, pos: [10.3720, -75.5880], color: '#f5b97a', titulo: 'Organización',
    voz: 'La comunidad se organiza en el Consejo Comunitario de Comunidades Negras de Tierra Bomba, en las Juntas de Acción Comunal y en el Comité Barrial de Emergencias. Una participante de los talleres de memoria dijo: mientras sigamos unidos y sin egoísmos, actuando como comunidad, resistiremos.' },
  { id: 'encuentro', Icon: Dices, pos: [10.3915, -75.5835], color: '#a9cf5c', titulo: 'Encuentro',
    voz: 'Los lugares de encuentro: el dominó en las esquinas, la música champeta y el mar, donde juegan los niños.' },
  { id: 'lancha', Icon: Ship, pos: [10.3745, -75.5590], color: '#49c6e5', titulo: 'Lancha al colegio',
    voz: 'Más de sesenta jóvenes de Punta Arena viajan cada día en lancha a Tierra Bomba o a Caño del Oro para estudiar, porque su colegio solo llega a quinto de primaria.' },
  ...Object.entries(PUEBLOS).map(([id, p]) => ({
    id: `colegio-${id}`, Icon: School, pos: [p.pos[0] - 0.0015, p.pos[1] + 0.0095], color: '#e8eef0', titulo: `Colegio · ${p.nombre}`, estudiantes: p.estudiantes,
    voz: id === 'puntaArena'
      ? 'La sede del colegio en Punta Arena tenía ciento seis estudiantes en el año dos mil veintiuno, y solo llega a quinto de primaria.'
      : `El colegio de ${p.nombre} tiene ${p.estudiantes.toLocaleString('es-CO')} estudiantes.`,
  })),
];

// Eventos: fiestas que recuerdan los mayores (talleres de memoria, UTB) y la clase de los viernes del Aula Ambiental (propuesta de la tesis)
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const proximaFecha = (mes, dia) => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  let d = new Date(hoy.getFullYear(), mes, dia);
  if (d < hoy) d = new Date(hoy.getFullYear() + 1, mes, dia);
  return d;
};
const proximoViernes = () => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const diff = (5 - hoy.getDay() + 7) % 7 || 7;
  return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + diff);
};
const diasHasta = (d) => Math.round((d - new Date().setHours(0, 0, 0, 0)) / 86400000);
const EVENTOS = [
  { id: 'sanAntonio', Icon: PartyPopper, color: '#ff6b4a', titulo: 'San Antonio', fecha: () => proximaFecha(5, 13), pos: [10.3868, -75.5690],
    voz: 'Fiesta de San Antonio, el trece de junio.' },
  { id: 'sanJuan', Icon: Ship, color: '#49c6e5', titulo: 'San Juan', fecha: () => proximaFecha(5, 24), pos: [10.3905, -75.5772],
    voz: 'Fiesta de San Juan, el veinticuatro de junio, con regatas de botes de vela en el mar.' },
  { id: 'virgenCarmen', Icon: PartyPopper, color: '#f5b97a', titulo: 'Virgen del Carmen', fecha: () => proximaFecha(6, 16), pos: [10.3745, -75.5860],
    voz: 'Fiesta de la Virgen del Carmen, el dieciséis de julio.' },
  { id: 'viernes', Icon: BookOpen, color: '#a9cf5c', titulo: 'Clase del viernes', fecha: proximoViernes, pos: [10.3300, -75.5740], clase: true,
    voz: 'Clase del viernes, a las cuatro de la tarde, en el Aula Ambiental de Bocachica. Hay bailes, oficios, cocina y cuidado del manglar. Toca el botón verde para inscribirte.' },
];
const vozEvento = (e) => {
  const n = diasHasta(e.fecha());
  const cuando = n === 0 ? 'Es hoy.' : n === 1 ? 'Es mañana.' : 'Faltan ' + n + ' días.';
  return e.voz + ' ' + cuando;
};

const IDEAS = [
  { n: 1, Icon: Users, color: '#ff6b4a', titulo: 'Decidir desde la isla', pos: [10.3858, -75.5725],
    voz: 'Idea uno: decidir desde la isla. Una mesa permanente con el Consejo Comunitario, las Juntas de Acción Comunal y el Distrito. Ninguna obra en la costa y ninguna reubicación se hace sin pasar por ella. Es lo primero que hay que hacer.' },
  { n: 2, Icon: Home, color: '#f5b97a', titulo: 'Casas en suelo seguro', pos: [10.3732, -75.5757],
    voz: 'Idea dos: casas en suelo seguro. Las familias de la orilla se mudan poco a poco a la meseta alta, sin salir de la isla y con título colectivo. La orilla que se libera se vuelve parque.' },
  { n: 3, Icon: Shield, color: '#2fd1b0', titulo: 'Cuidar la orilla', pos: [10.3555, -75.5905],
    voz: 'Idea tres: cuidar la orilla. Donde hay casas, un malecón de guadua frena la ola. En la bahía se siembra manglar y en las playas se recuperan las dunas. Todo se puede mover si el mar sigue avanzando.' },
  { n: 4, Icon: Droplets, color: '#49c6e5', titulo: 'Agua y salud', pos: [10.3475, -75.5470],
    voz: 'Idea cuatro: agua y salud en la isla. Recoger el agua de lluvia en colegios y edificios públicos, limpiar las aguas usadas con humedales antes de que lleguen al mar, y tener un puesto de salud en suelo seguro.' },
  { n: 5, Icon: Route, color: '#ff7a50', titulo: 'Unir los pueblos', pos: [10.3600, -75.5530],
    voz: 'Idea cinco: unir los cuatro pueblos. Un sendero entre Tierra Bomba, Punta Arena, Caño del Oro y Bocachica, un muelle comunitario en cada pueblo y una lancha escolar. Ir a Cartagena debe ser una opción, no una obligación.' },
  { n: 6, Icon: Fish, color: '#a9cf5c', titulo: 'Cultura y trabajo', pos: [10.3195, -75.5868],
    voz: 'Idea seis: cuidar la cultura y el trabajo. El parque de la orilla también da trabajo: turismo manejado por la comunidad en fuertes, playas y manglar, un vivero, acuerdos de pesca y lugares para las fiestas y los saberes de los mayores.' },
];

// Plan maestro (tesis): meseta +22 m, vías y equipamientos
const MESETA = [[-75.57396, 10.37487], [-75.57534, 10.37523], [-75.57662, 10.37447], [-75.57731, 10.3732], [-75.57758, 10.37194], [-75.57727, 10.37113], [-75.57691, 10.37054], [-75.57638, 10.37134], [-75.57595, 10.37221], [-75.57516, 10.37264], [-75.5745, 10.37348], [-75.57408, 10.37419]];
const VIAS = [
  [[-75.5765, 10.3808], [-75.5762, 10.3795], [-75.5758, 10.3778], [-75.5755, 10.376], [-75.5754, 10.3745], [-75.5755, 10.3732]],
  [[-75.5742, 10.3748], [-75.5753, 10.3752], [-75.5766, 10.3745], [-75.5772, 10.3732], [-75.5774, 10.372], [-75.5768, 10.3712], [-75.5758, 10.3722], [-75.5746, 10.3734], [-75.5742, 10.3748]],
  [[-75.5755, 10.3732], [-75.5725, 10.3728], [-75.569, 10.372], [-75.564, 10.3695]],
];
const BARRIO = [
  { id: 'casas', Icon: Home, pos: ll([-75.5768, 10.3742]), color: '#f5b97a', cifra: '120', titulo: 'Casas',
    voz: 'Ciento veinte casas que pueden crecer con la familia, hechas con madera tratada, bloques de tierra y celosías que dejan pasar el aire.' },
  { id: 'colegio', Icon: School, pos: ll([-75.5755, 10.3732]), color: '#e8eef0', cifra: '350', titulo: 'Colegio',
    voz: 'Un colegio para trescientos cincuenta estudiantes. Su techo recoge el agua de la lluvia.' },
  { id: 'agua', Icon: Droplets, pos: ll([-75.5757, 10.3724]), color: '#49c6e5', cifra: '450.000 L', titulo: 'Agua',
    voz: 'Un tanque comunitario de cuatrocientos cincuenta mil litros de agua de lluvia, con doce llaves para todos.' },
  { id: 'plaza', Icon: Users, pos: ll([-75.5742, 10.3735]), color: '#ff6b4a', cifra: '400 m²', titulo: 'Plaza',
    voz: 'Una plaza cubierta de cuatrocientos metros cuadrados para reunirse, celebrar y decidir.' },
  { id: 'parque', Icon: Trees, pos: ll([-75.576, 10.3715]), color: '#a9cf5c', cifra: '+22 m', titulo: 'Parque',
    voz: 'El parque ecológico protege la orilla con manglar, dunas y bosque seco. La meseta está a veintidós metros sobre el mar, fuera de su alcance.' },
];

const ACTIVIDADES = [
  { id: 'pescado', Icon: Utensils, foto: 'arroz_coco_pescado.jpg', titulo: 'Cocinar' },
  { id: 'cocada', Icon: Utensils, foto: 'dulces_isnelia.jpg', titulo: 'Cocadas' },
  { id: 'bullerengue', Icon: Music, foto: 'bullerengue.jpg', titulo: 'Bullerengue' },
  { id: 'mapale', Icon: Music, foto: 'mapale_cumbia.jpg', titulo: 'Mapalé' },
  { id: 'oficios', Icon: Hammer, foto: 'carpinteria_ribera.jpg', titulo: 'Oficios' },
];

const COLOR_EROSION = { 'Muy Alta': '#ff3b2f', Alta: '#ff7a50', Moderada: '#f5c451', Baja: '#a7b3b8' };

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Voz: Web Speech API en español; si no hay, queda el subtítulo.
function useVoz() {
  const [sonido, setSonido] = useState(true);
  const [subtitulo, setSubtitulo] = useState('');
  const [hablando, setHablando] = useState(false);
  const voz = useRef(null);
  const sonidoRef = useRef(true);
  const timer = useRef(0);
  const disponible = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!disponible) return undefined;
    const elegir = () => {
      const vs = window.speechSynthesis.getVoices();
      const norm = (l) => (l || '').replace('_', '-');
      voz.current = ['es-CO', 'es-419', 'es-MX', 'es-US', 'es-ES'].map((l) => vs.find((v) => norm(v.lang) === l)).find(Boolean)
        || vs.find((v) => norm(v.lang).startsWith('es')) || null;
    };
    elegir();
    window.speechSynthesis.addEventListener?.('voiceschanged', elegir);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', elegir);
      window.speechSynthesis.cancel();
      clearTimeout(timer.current);
    };
  }, [disponible]);

  const callar = useCallback(() => {
    clearTimeout(timer.current);
    if (disponible) window.speechSynthesis.cancel();
    setHablando(false);
  }, [disponible]);

  const hablar = useCallback((texto) => {
    setSubtitulo(texto);
    if (!disponible || !sonidoRef.current) return;
    const ss = window.speechSynthesis;
    const ocupado = ss.speaking || ss.pending;
    ss.cancel();
    clearTimeout(timer.current);
    const decir = () => {
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = voz.current?.lang || 'es-CO';
      if (voz.current) u.voice = voz.current;
      u.rate = 0.94;
      u.onstart = () => setHablando(true);
      u.onend = () => setHablando(false);
      u.onerror = () => setHablando(false);
      ss.speak(u);
    };
    // En iPhone hay que hablar dentro del mismo toque; Chrome pierde la frase si se habla justo después de cancelar.
    if (ocupado) timer.current = setTimeout(decir, 80);
    else decir();
  }, [disponible]);

  const alternar = useCallback(() => {
    sonidoRef.current = !sonidoRef.current;
    if (!sonidoRef.current) callar();
    setSonido(sonidoRef.current);
  }, [callar]);

  return { hablar, callar, sonido, alternar, subtitulo, hablando, disponible };
}

// Íconos de personas o casas: se entiende la proporción sin leer.
function Pictos({ Icon, total = 10, activos, color }) {
  return (
    <div className="mv-pictos" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{ color: i < activos ? color : undefined, animationDelay: `${i * 45}ms` }} className={i < activos ? 'on' : ''}>
          <Icon size={22} strokeWidth={2} />
        </span>
      ))}
    </div>
  );
}

let introVista = false;

export default function MapaVivo({ onActividad, onPatrimonio, onVer3D, onIsla3D, onPrecargar, onLeer, onBackToThesis }) {
  const contenedor = useRef(null);
  const mapaRef = useRef(null);
  const capas = useRef({});
  const [intro, setIntro] = useState(!introVista);
  const [saliendo, setSaliendo] = useState(false);
  const [cap, setCap] = useState(0);
  const [nivel, setNivel] = useState(0);
  const [sel, setSel] = useState(null); // { tipo, id }
  const [listo, setListo] = useState(false);
  const [ver3D, setVer3D] = useState(false);
  const [montar3D, setMontar3D] = useState(false);
  const [fallo3D, setFallo3D] = useState(false);
  const voz = useVoz();
  const capitulo = CAPITULOS[cap];

  // -------- vuelo de cámara fluido (zoom continuo, curva larga) --------
  const volar = useCallback((destino, zoom) => {
    const map = mapaRef.current;
    if (!map) return;
    const anim = !reduceMotion();
    const movil = window.innerWidth < 760;
    // el panel va a la izquierda en escritorio y abajo en celular; subtítulo y dock abajo
    const pad = movil ? [20, 120] : [430, 80];
    const padBR = movil ? [20, Math.round(window.innerHeight * 0.34) + 96] : [60, 210];
    if (Array.isArray(destino[0])) {
      if (anim) map.flyToBounds(destino, { duration: 2.2, easeLinearity: 0.12, paddingTopLeft: pad, paddingBottomRight: padBR });
      else map.fitBounds(destino, { paddingTopLeft: pad, paddingBottomRight: padBR, animate: false });
    } else {
      // desplaza el destino para que no quede debajo del panel
      const z = zoom ?? Math.max(map.getZoom(), 14.6);
      const off = window.innerWidth < 760 ? L.point(0, Math.round(window.innerHeight * 0.17)) : L.point(-190, 40);
      const p = map.project(destino, z).add(off);
      const centro = map.unproject(p, z);
      if (anim) map.flyTo(centro, z, { duration: 1.9, easeLinearity: 0.12 });
      else map.setView(centro, z, { animate: false });
    }
  }, []);

  const elegir = useRef(() => {});
  elegir.current = (tipo, id) => {
    let pos; let texto;
    if (tipo === 'pueblo') { pos = PUEBLOS[id].pos; texto = PUEBLOS[id].voz; }
    else if (tipo === 'cartagena') { pos = CARTAGENA.pos; texto = CARTAGENA.voz; }
    else if (tipo === 'gente') { const g = GENTE.find((x) => x.id === id); pos = g.pos; texto = g.voz; }
    else if (tipo === 'evento') { const e = EVENTOS.find((x) => x.id === id); pos = e.pos; texto = vozEvento(e); }
    else if (tipo === 'idea') { const i = IDEAS.find((x) => x.n === id); pos = i.pos; texto = i.voz; }
    else if (tipo === 'barrio') { const b = BARRIO.find((x) => x.id === id); pos = b.pos; texto = b.voz; }
    else if (tipo === 'ruta') {
      const r = capas.current.rutasData?.find((x) => x.id === id);
      if (!r) return;
      texto = `Lancha de ${LUGAR[r.de] || r.de} a ${LUGAR[r.a] || r.a}. Son ${String(r.km).replace('.', ',')} kilómetros por el agua.`
        + (r.id === 'hosp-tb' ? ' En un solo día de 2014 se contaron seiscientos catorce viajes hacia Bocagrande en este embarcadero.' : '');
      const pts = r.puntos;
      const map = mapaRef.current;
      if (map) { const b = L.latLngBounds(pts.map(ll)).pad(0.15); volar([[b.getSouth(), b.getWest()], [b.getNorth(), b.getEast()]]); }
      setSel({ tipo, id });
      voz.hablar(texto);
      return;
    }
    setSel({ tipo, id });
    voz.hablar(texto);
    if (pos) volar(pos, tipo === 'barrio' ? 17 : tipo === 'cartagena' ? 13.6 : 15);
  };

  // -------- montaje del mapa (una sola vez) --------
  useEffect(() => {
    const el = contenedor.current;
    const map = L.map(el, {
      zoomControl: false,
      zoomSnap: 0,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 140,
      minZoom: 11.5,
      maxZoom: 18.5,
      maxBounds: [[10.22, -75.72], [10.5, -75.42]],
      maxBoundsViscosity: 0.7,
      inertiaDeceleration: 2400,
      attributionControl: true,
    });
    mapaRef.current = map;
    map.attributionControl.setPrefix(false);
    map.fitBounds(introVista ? VISTAS.todo : VISTAS.inicio, { animate: false });
    L.tileLayer(ESRI, {
      maxNativeZoom: 18, maxZoom: 19, keepBuffer: 8, updateWhenZooming: false, crossOrigin: true,
      attribution: 'Imagen © Esri, Maxar, Earthstar Geographics · © OpenStreetMap · MIDAS (Alcaldía de Cartagena, INVEMAR)',
    }).addTo(map);

    const icono = (html, clase, tam = [44, 44]) => L.divIcon({ html, className: `mv-ico ${clase}`, iconSize: tam, iconAnchor: [tam[0] / 2, tam[1] / 2] });
    const click = (tipo, id) => () => elegir.current(tipo, id);

    // Cartagena
    L.marker(CARTAGENA.pos, { icon: icono(`<span class="mv-pin mv-pin-ciudad">${svg(Building2, 22)}</span><b>Cartagena</b>`, 'mv-l mv-g-ciudad', [150, 48]), keyboard: true, title: 'Cartagena' })
      .on('click', click('cartagena')).addTo(map);

    // Pueblos
    Object.entries(PUEBLOS).forEach(([id, p], i) => {
      L.marker(p.pos, { icon: icono(`<span class="mv-pin" style="--c:${p.color};animation-delay:${200 + i * 120}ms">${svg(Home, 20)}</span><b>${p.nombre}</b>`, 'mv-l mv-g-pueblo', [150, 48]), title: p.nombre })
        .on('click', click('pueblo', id)).addTo(map);
    });

    // Gente
    GENTE.forEach((g, i) => {
      L.marker(g.pos, { icon: icono(`<span class="mv-burbuja" style="--c:${g.color};animation-delay:${i * 70}ms">${svg(g.Icon, 20)}</span>`, 'mv-l mv-g-gente', [52, 52]), title: g.titulo })
        .on('click', click('gente', g.id)).addTo(map);
    });

    // Eventos
    EVENTOS.forEach((e, i) => {
      L.marker(e.pos, { icon: icono(`<span class="mv-evento" style="--c:${e.color};animation-delay:${i * 90}ms">${svg(e.Icon, 20)}<em>${e.fecha().getDate()}</em></span>`, 'mv-l mv-g-eventos', [56, 56]), title: e.titulo })
        .on('click', click('evento', e.id)).addTo(map);
    });

    // Ideas: sendero entre los pueblos (idea 5, trazado indicativo) + números
    L.polyline([PUEBLOS.tierraBomba.pos, PUEBLOS.puntaArena.pos, PUEBLOS.canoDelOro.pos, PUEBLOS.bocachica.pos], { className: 'mv-l mv-g-ideas mv-sendero', color: '#ff7a50', weight: 3, dashArray: '2 9', lineCap: 'round', interactive: false }).addTo(map);
    IDEAS.forEach((idea, i) => {
      L.marker(idea.pos, { icon: icono(`<span class="mv-idea" style="--c:${idea.color};animation-delay:${i * 90}ms"><i>${idea.n}</i>${svg(idea.Icon, 18)}</span>`, 'mv-l mv-g-ideas', [60, 60]), title: idea.titulo })
        .on('click', click('idea', idea.n)).addTo(map);
    });

    // Barrio: meseta, vías y equipamientos
    L.polygon(MESETA.map(ll), { className: 'mv-l mv-g-barrio mv-meseta', color: '#2fd1b0', weight: 2, fillColor: '#2fd1b0', fillOpacity: 0.22, interactive: false }).addTo(map);
    VIAS.forEach((v) => L.polyline(v.map(ll), { className: 'mv-l mv-g-barrio mv-via', color: '#f2cf94', weight: 3, opacity: 0.9, interactive: false }).addTo(map));
    BARRIO.forEach((b, i) => {
      L.marker(b.pos, { icon: icono(`<span class="mv-burbuja" style="--c:${b.color};animation-delay:${i * 90}ms">${svg(b.Icon, 20)}</span>`, 'mv-l mv-g-barrio', [52, 52]), title: b.titulo })
        .on('click', click('barrio', b.id)).addTo(map);
    });

    // Datos que llegan por red: lanchas y MIDAS
    let vivo = true; let raf = 0;
    const lanchas = [];
    fetch(`${BASE}data/lanchas_rutas.json`).then((r) => r.json()).then((d) => {
      if (!vivo) return;
      capas.current.rutasData = d.rutas;
      Object.values(d.muelles).forEach((m) => {
        L.marker([m.lat, m.lon], { icon: icono(`<span class="mv-muelle">${svg(Anchor, 12)}</span>`, 'mv-l mv-g-rutas', [22, 22]), interactive: false }).addTo(map);
      });
      d.rutas.forEach((r, ri) => {
        const pts = r.puntos.map(ll);
        const col = r.tipo === 'colectiva' ? '#e8eef0' : '#f2cf94';
        L.polyline(pts, { className: 'mv-l mv-g-rutas mv-ruta', color: col, weight: 2, opacity: 0.75, dashArray: '6 8', interactive: false }).addTo(map);
        // zona de toque más ancha e invisible
        L.polyline(pts, { className: 'mv-l mv-g-rutas mv-ruta-toque', color: '#fff', weight: 22, opacity: 0.001 }).on('click', click('ruta', r.id)).addTo(map);
        // distancias acumuladas para mover las lanchas
        const acum = [0];
        for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 0.985));
        const n = r.tipo === 'colectiva' ? 2 : 1;
        for (let q = 0; q < n; q++) {
          const m = L.marker(pts[0], { icon: icono(`<span class="mv-lancha"><i style="background:${col}"></i></span>`, 'mv-l mv-g-rutas', [18, 18]), interactive: false, keyboard: false }).addTo(map);
          lanchas.push({ m, pts, acum, largo: acum[acum.length - 1], dur: 16000 + r.km * 3800, fase: q / n + ri * 0.17, ida: q % 2 === 0 });
        }
      });
      const mover = (t) => {
        raf = requestAnimationFrame(mover);
        if (document.hidden) return;
        for (const L0 of lanchas) {
          let f = ((t / L0.dur) + L0.fase) % 1;
          if (!L0.ida) f = 1 - f;
          const objetivo = f * L0.largo;
          let i = 1;
          while (i < L0.acum.length - 1 && L0.acum[i] < objetivo) i++;
          const a = L0.pts[i - 1]; const b = L0.pts[i];
          const seg = (L0.acum[i] - L0.acum[i - 1]) || 1;
          const k = (objetivo - L0.acum[i - 1]) / seg;
          L0.m.setLatLng([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
          const e = L0.m.getElement()?.firstChild;
          if (e) {
            const ang = Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180 / Math.PI + (L0.ida ? 0 : 180);
            e.style.transform = `rotate(${ang}deg)`;
          }
        }
      };
      if (!reduceMotion()) raf = requestAnimationFrame(mover);
      else lanchas.forEach((L0) => L0.m.setLatLng(L0.pts[Math.floor(L0.pts.length / 2)]));
    }).catch(() => {});

    fetch(`${BASE}data/midas_tierrabomba.json`).then((r) => r.json()).then((d) => {
      if (!vivo) return;
      d.fuerte2040.forEach((p) => L.polygon(p.map(ll), { className: 'mv-l mv-g-agua2 mv-agua', color: '#49c6e5', weight: 1, fillColor: '#1f8fd6', fillOpacity: 0.5, interactive: false }).addTo(map));
      d.moderada2019.forEach((p) => L.polygon(p.map(ll), { className: 'mv-l mv-g-agua1 mv-agua', color: '#7fdcff', weight: 1, fillColor: '#3fb7f0', fillOpacity: 0.55, interactive: false }).addTo(map));
      const orden = { Baja: 0, Moderada: 1, Alta: 2, 'Muy Alta': 3 };
      [...d.erosion].sort((a, b) => orden[a.clase] - orden[b.clase]).forEach((e) => {
        L.polyline(e.pts.map(ll), { className: `mv-l mv-g-erosion mv-erosion mv-e${orden[e.clase]}`, color: COLOR_EROSION[e.clase], weight: 3 + orden[e.clase] * 1.6, opacity: 0.95, lineCap: 'round', interactive: false }).addTo(map);
      });
    }).catch(() => {});

    map.whenReady(() => setListo(true));
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      map.remove();
      mapaRef.current = null;
    };
  }, []);

  // -------- capítulo activo: la clase del contenedor decide qué capas se ven (fundido CSS) --------
  const irCapitulo = useCallback((i, conVoz = true) => {
    const c = CAPITULOS[(i + CAPITULOS.length) % CAPITULOS.length];
    setCap(CAPITULOS.indexOf(c));
    setSel(null);
    setVer3D(false);
    if (c.id !== 'mar') setNivel(0);
    volar(VISTAS[c.vista]);
    if (conVoz) voz.hablar(c.voz);
  }, [volar, voz]);

  const empezar = () => {
    introVista = true;
    setSaliendo(true);
    irCapitulo(0, true);
    setTimeout(() => setIntro(false), reduceMotion() ? 0 : 950);
  };

  const abrir3D = () => {
    setMontar3D(true);
    setVer3D(true);
    voz.hablar('Así se ve Tierra Bomba en tres dimensiones, con su relieve, sus árboles y el mar. Mueve el dedo o el ratón para mirar alrededor.');
  };
  const cerrar3D = () => { setVer3D(false); voz.callar(); };

  const elegirNivel = (n) => {
    setNivel(n);
    voz.hablar(NIVELES[n].voz);
  };

  // -------- contenido del panel --------
  const renderSeleccion = () => {
    if (!sel) return null;
    const volverBtn = (
      <button type="button" className="mv-volver" onClick={() => { setSel(null); volar(VISTAS[capitulo.vista]); voz.callar(); }} aria-label="Volver">
        <ArrowLeft size={22} />
      </button>
    );
    let Icon = Home; let color = capitulo.color; let titulo = ''; let cuerpo = null;
    if (sel.tipo === 'pueblo') {
      const p = PUEBLOS[sel.id];
      Icon = Home; color = p.color; titulo = p.nombre;
      cuerpo = (
        <div className="mv-cifras">
          <div><Home size={26} /><b>{p.casas.toLocaleString('es-CO')}</b></div>
          <div><School size={26} /><b>{p.estudiantes.toLocaleString('es-CO')}</b></div>
          {p.lanchaEscolar && <div><Ship size={26} /><b>60+</b></div>}
        </div>
      );
    } else if (sel.tipo === 'cartagena') {
      Icon = Building2; color = '#e8eef0'; titulo = 'Cartagena';
      cuerpo = <div className="mv-cifras"><div><Ship size={26} /><ArrowRight size={18} /><Building2 size={26} /></div></div>;
    } else if (sel.tipo === 'ruta') {
      const r = capas.current.rutasData?.find((x) => x.id === sel.id);
      Icon = Ship; color = '#e8eef0'; titulo = r ? `${LUGAR[r.de]?.replace(/^(el|la) /i, '') || r.de} → ${LUGAR[r.a] || r.a}` : 'Lancha';
      cuerpo = r && <div className="mv-cifras"><div><Ship size={26} /><b>{String(r.km).replace('.', ',')} km</b></div>{r.id === 'hosp-tb' && <div><User size={26} /><b>614</b></div>}</div>;
    } else if (sel.tipo === 'gente') {
      const g = GENTE.find((x) => x.id === sel.id);
      Icon = g.Icon; color = g.color; titulo = g.titulo;
      cuerpo = g.fechas
        ? <div className="mv-fechas">{g.fechas.map(([d, m]) => <div key={d + m}><b>{d}</b><span>{m}</span></div>)}</div>
        : g.estudiantes ? <div className="mv-cifras"><div><School size={26} /><b>{(g.id === 'colegio-puntaArena' ? 106 : g.estudiantes).toLocaleString('es-CO')}</b></div></div>
          : g.id === 'lancha' ? <Pictos Icon={User} total={10} activos={10} color={g.color} /> : null;
    } else if (sel.tipo === 'evento') {
      const e = EVENTOS.find((x) => x.id === sel.id);
      const d = e.fecha(); const n = diasHasta(d);
      Icon = e.Icon; color = e.color; titulo = e.titulo;
      cuerpo = (
        <>
          <div className="mv-fechas">
            <div><b>{d.getDate()}</b><span>{MESES[d.getMonth()].slice(0, 3)}</span></div>
            <div><b>{n}</b><span>días</span></div>
            {e.clase && <div><b>4</b><span>p. m.</span></div>}
          </div>
          {e.clase && <button type="button" className="mv-oir" onPointerEnter={onPrecargar} onClick={() => onActividad('oficios')}><BookOpen size={22} /><span>Inscribirme</span></button>}
        </>
      );
    } else if (sel.tipo === 'idea') {
      const i = IDEAS.find((x) => x.n === sel.id);
      Icon = i.Icon; color = i.color; titulo = i.titulo;
      cuerpo = (
        <div className="mv-idea-nav">
          <button type="button" onClick={() => elegir.current('idea', ((sel.id + 4) % 6) + 1)} aria-label="Idea anterior"><ArrowLeft size={20} /></button>
          <span>{sel.id} / 6</span>
          <button type="button" onClick={() => elegir.current('idea', (sel.id % 6) + 1)} aria-label="Idea siguiente"><ArrowRight size={20} /></button>
        </div>
      );
    } else if (sel.tipo === 'barrio') {
      const b = BARRIO.find((x) => x.id === sel.id);
      Icon = b.Icon; color = b.color; titulo = b.titulo;
      cuerpo = <div className="mv-cifras"><div><b className="mv-xl">{b.cifra}</b></div></div>;
    }
    return (
      <div className="mv-panel-in" key={`${sel.tipo}-${sel.id}`} style={{ '--c': color }}>
        <div className="mv-panel-top">
          {volverBtn}
          <span className="mv-panel-icono"><Icon size={30} /></span>
          <h2>{titulo}</h2>
        </div>
        {cuerpo}
        <button type="button" className="mv-oir" onClick={() => elegir.current(sel.tipo, sel.id)}>
          <Volume2 size={24} /> <span>Escuchar otra vez</span>
        </button>
      </div>
    );
  };

  const renderCapitulo = () => {
    const c = capitulo;
    let cuerpo = null;
    if (c.id === 'isla') {
      cuerpo = (
        <>
        <div className="mv-botones">
          {Object.entries(PUEBLOS).map(([id, p]) => (
            <button key={id} type="button" className="mv-boton" style={{ '--c': p.color }} onClick={() => elegir.current('pueblo', id)}>
              <span><Home size={24} /></span>{p.nombre}
            </button>
          ))}
          <button type="button" className="mv-boton" style={{ '--c': '#e8eef0' }} onClick={() => elegir.current('cartagena')}>
            <span><Building2 size={24} /></span>Cartagena
          </button>
          <button type="button" className="mv-boton" style={{ '--c': '#e8eef0' }} onClick={() => elegir.current('ruta', 'hosp-tb')}>
            <span><Ship size={24} /></span>Lanchas
          </button>
        </div>
        <button type="button" className="mv-oir mv-oir-3d" onClick={abrir3D}><Mountain size={22} /><span>Ver la isla en 3D</span></button>
        </>
      );
    } else if (c.id === 'mar') {
      cuerpo = (
        <>
          <div className="mv-niveles" role="group" aria-label="Nivel del agua">
            {[18, 26, 34].map((s, i) => (
              <button key={s} type="button" aria-pressed={nivel === i} onClick={() => elegirNivel(i)}>
                <Waves size={s} /><span>{['Orilla', '2019', '2040'][i]}</span>
              </button>
            ))}
          </div>
          <div className="mv-dato-picto">
            <button type="button" className="mv-mini-oir" onClick={() => voz.hablar('Nueve de cada diez personas encuestadas vieron daños en sus casas, sus calles, el agua, el turismo y la pesca.')} aria-label="Escuchar"><Volume2 size={18} /></button>
            <Pictos Icon={User} total={10} activos={9} color="#ff6b4a" />
          </div>
          <div className="mv-dato-picto">
            <button type="button" className="mv-mini-oir" onClick={() => voz.hablar('De unas dos mil seiscientas casas y construcciones de la isla, ochocientas noventa y una están en la franja que el mar podría alcanzar en treinta años.')} aria-label="Escuchar"><Volume2 size={18} /></button>
            <Pictos Icon={Home} total={10} activos={3} color="#ff6b4a" />
          </div>
          <button type="button" className="mv-oir mv-oir-sec" onClick={() => voz.hablar('Ya pasó. Familias del Barrio Abajo, junto a la orilla, se mudaron al Barrio Arriba después de perder sus casas por la erosión. La calle Primera desapareció.')}>
            <History size={22} /><span>Ya pasó</span>
          </button>
        </>
      );
    } else if (c.id === 'gente') {
      cuerpo = (
        <div className="mv-botones">
          {GENTE.filter((g) => !g.id.startsWith('colegio')).map((g) => (
            <button key={g.id} type="button" className="mv-boton" style={{ '--c': g.color }} onClick={() => elegir.current('gente', g.id)}>
              <span><g.Icon size={24} /></span>{g.titulo}
            </button>
          ))}
          <button type="button" className="mv-boton" style={{ '--c': '#e8eef0' }} onClick={() => elegir.current('gente', 'colegio-bocachica')}>
            <span><School size={24} /></span>Colegios
          </button>
        </div>
      );
    } else if (c.id === 'eventos') {
      const lista = [...EVENTOS].sort((a, b) => a.fecha() - b.fecha());
      cuerpo = (
        <div className="mv-agenda">
          {lista.map((e) => {
            const d = e.fecha();
            return (
              <button key={e.id} type="button" style={{ '--c': e.color }} onClick={() => elegir.current('evento', e.id)}>
                <span className="mv-agenda-dia"><b>{d.getDate()}</b><small>{MESES[d.getMonth()].slice(0, 3)}</small></span>
                <span className="mv-agenda-ico"><e.Icon size={22} /></span>
                <span className="mv-agenda-txt">{e.titulo}</span>
                <span className="mv-agenda-faltan">{diasHasta(d)}<Calendar size={12} /></span>
              </button>
            );
          })}
        </div>
      );
    } else if (c.id === 'ideas') {
      cuerpo = (
        <div className="mv-ideas">
          {IDEAS.map((i) => (
            <button key={i.n} type="button" style={{ '--c': i.color }} onClick={() => elegir.current('idea', i.n)} aria-label={i.titulo}>
              <i>{i.n}</i><i.Icon size={26} />
            </button>
          ))}
        </div>
      );
    } else if (c.id === 'barrio') {
      cuerpo = (
        <>
          <div className="mv-botones">
            {BARRIO.map((b) => (
              <button key={b.id} type="button" className="mv-boton" style={{ '--c': b.color }} onClick={() => elegir.current('barrio', b.id)}>
                <span><b.Icon size={24} /></span>{b.cifra}
              </button>
            ))}
          </div>
          {onVer3D && <button type="button" className="mv-oir" onClick={onVer3D}><Box size={22} /><span>Ver en 3D</span></button>}
        </>
      );
    } else if (c.id === 'jugar') {
      cuerpo = (
        <div className="mv-fotos">
          {ACTIVIDADES.map((a) => (
            <button key={a.id} type="button" onPointerEnter={onPrecargar} onFocus={onPrecargar} onClick={() => onActividad(a.id)}>
              <img src={`${BASE}images/memorias/${a.foto}`} alt="" loading="lazy" decoding="async" />
              <span><a.Icon size={16} />{a.titulo}</span>
            </button>
          ))}
          {Object.entries(PATRIMONIO_ESCENAS).map(([id, d]) => (
            <button key={id} type="button" className="mv-foto-fuerte" onClick={() => onPatrimonio(id)}>
              <Landmark size={34} />
              <span><Landmark size={16} />{d.nombre}</span>
            </button>
          ))}
          {onIsla3D && (
            <button type="button" className="mv-foto-fuerte" onPointerEnter={onPrecargar} onFocus={onPrecargar} onClick={onIsla3D}>
              <MapaIcono size={34} />
              <span><Box size={16} />Isla 3D</span>
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="mv-panel-in" key={c.id} style={{ '--c': c.color }}>
        <div className="mv-panel-top">
          <span className="mv-panel-icono"><c.Icon size={30} /></span>
          <h2>{c.label}</h2>
          <button type="button" className="mv-mini-oir" onClick={() => voz.hablar(c.voz)} aria-label="Escuchar"><Volume2 size={20} /></button>
        </div>
        {cuerpo}
      </div>
    );
  };

  return (
    <div className={`mv mv-cap-${capitulo.id} mv-nivel-${nivel} ${intro && !saliendo ? 'mv-en-intro' : ''} ${listo ? 'mv-listo' : ''} ${ver3D ? 'mv-en-3d' : ''}`}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" />
      <div ref={contenedor} className="mv-mapa" aria-label="Mapa de Tierra Bomba y Cartagena" />
      <div className="mv-velo" aria-hidden="true" />
      <div className={`mv-3d ${ver3D ? 'on' : ''}`} aria-hidden={!ver3D}>
        {montar3D && !fallo3D && (
          <Suspense fallback={null}>
            <IslaReal3D className="mv-3d-lienzo" onError={() => setFallo3D(true)} />
          </Suspense>
        )}
        {fallo3D && <p className="mv-3d-fallo"><Mountain size={28} /></p>}
        <button type="button" className="mv-3d-volver" onClick={cerrar3D} aria-label="Volver al mapa"><ArrowLeft size={22} /><MapaIcono size={22} /></button>
      </div>

      {/* Barra superior */}
      <header className="mv-top">
        <div className="mv-marca"><b>Tierra Bomba</b><span>{String(cap + 1).padStart(2, '0')} / {String(CAPITULOS.length).padStart(2, '0')}</span></div>
        <div className="mv-top-acciones">
          {voz.disponible && (
            <button type="button" onClick={voz.alternar} aria-label={voz.sonido ? 'Quitar sonido' : 'Poner sonido'} aria-pressed={!voz.sonido}>
              {voz.sonido ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}
          <button type="button" className={`mv-btn-3d ${ver3D ? 'on' : ''}`} onClick={ver3D ? cerrar3D : abrir3D} aria-pressed={ver3D} aria-label={ver3D ? 'Volver al mapa' : 'Ver la isla en 3D'}>{ver3D ? <MapaIcono size={20} /> : <><Mountain size={18} /><span>3D</span></>}</button>
          {onLeer && <button type="button" onClick={onLeer} aria-label="Leer en texto"><BookOpen size={20} /></button>}
          {onBackToThesis && <button type="button" className="mv-tesis" onClick={onBackToThesis}>Tesis</button>}
        </div>
      </header>

      {/* Panel */}
      {!intro && (
        <aside className="mv-panel" aria-live="polite">
          {sel ? renderSeleccion() : renderCapitulo()}
        </aside>
      )}

      {/* Subtítulo de la voz */}
      {!intro && voz.subtitulo && (
        <div className={`mv-subtitulo ${voz.hablando ? 'hablando' : ''}`} key={voz.subtitulo}>
          <span className="mv-ondas" aria-hidden="true"><i /><i /><i /></span>
          <p>{voz.subtitulo}</p>
          <button type="button" onClick={() => voz.hablar(voz.subtitulo)} aria-label="Repetir"><Play size={16} /></button>
        </div>
      )}

      {/* Dock de capítulos: solo dibujos */}
      {!intro && (
        <nav className="mv-dock" aria-label="Partes del recorrido">
          <button type="button" className="mv-flecha" onClick={() => irCapitulo(cap - 1)} aria-label="Anterior"><ArrowLeft size={22} /></button>
          {CAPITULOS.map((c, i) => (
            <button key={c.id} type="button" className="mv-cap" aria-current={i === cap ? 'step' : undefined} style={{ '--c': c.color }} onClick={() => irCapitulo(i)}>
              <span><c.Icon size={24} /></span><small>{c.label}</small>
            </button>
          ))}
          <button type="button" className="mv-flecha mv-flecha-sig" onClick={() => irCapitulo(cap + 1)} aria-label="Siguiente"><ArrowRight size={22} /></button>
        </nav>
      )}

      {/* Portada: un solo botón grande */}
      {intro && (
        <div className={`mv-intro ${saliendo ? 'saliendo' : ''}`}>
          <p className="mv-eyebrow">Cartagena · Tierra Bomba</p>
          <h1>Tierra Bomba</h1>
          <p className="mv-intro-sub">Nuestra isla, hoy y mañana</p>
          <button type="button" className="mv-empezar" onClick={empezar} aria-label="Empezar con sonido">
            <span className="mv-empezar-anillo" aria-hidden="true" />
            <Play size={40} fill="currentColor" />
          </button>
          <p className="mv-intro-pista"><Volume2 size={18} /> <Hand size={18} /></p>
          <button type="button" className="mv-intro-cerrar" onClick={() => { voz.alternar(); empezar(); }} aria-label="Empezar sin sonido"><VolumeX size={18} /></button>
        </div>
      )}
    </div>
  );
}
