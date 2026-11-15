import React, { useEffect, useRef, useState } from 'react';
import { crearEscenaAula } from '../utils/escenaAulaBocachica';
import {
  ANTECEDENTES_CORPUS,
  DIMENSIONES_MEMORIA,
  CICLO_METODOLOGICO,
  LINEAS_INVESTIGACION,
  GEMELO_DIGITAL_NIVELES,
  FASES_24_MESES,
  PRODUCTOS_ESPERADOS,
  ACTORES_GOBERNANZA,
  PRINCIPIOS_ETICOS,
  SINTESIS_EJECUTIVA_10,
} from '../data/aulaAmbientalData';

// =============================================================================
// TIERRA BOMBA · AULA AMBIENTAL (BOCACHICA)
// Construido con la arquitectura exacta de https://alejagoguti-cpu.github.io/tesis_tercer_corte/
//  - Escena 3D fija a pantalla completa (Three.js) controlada por el scroll
//  - Paneles flotantes de vidrio esmerilado (.tc-vidrio), índice lateral y controles de mapa
//  - Red conceptual progresiva con curvas Bézier, partículas y máquina de escribir
//  - Diagramas visuales (barras apiladas, flujos SVG, esquema en planta, línea de tiempo)
//  - Cero tablas tipo Word
// =============================================================================

const ALTO_PASO = 95; // svh por paso de scrollytelling 3D (idéntico a tesis_tercer_corte)

const CAPITULOS = [
  { id: '00', nombre: 'Inicio', ancla: 'cap-00' },
  { id: '01', nombre: 'El problema', ancla: 'cap-01' },
  { id: '02', nombre: 'Memorias y base', ancla: 'cap-02' },
  { id: '03', nombre: 'Seis líneas 3D', ancla: 'cap-03' },
  { id: '04', nombre: 'Gemelo 3D', ancla: 'cap-04' },
  { id: '05', nombre: 'Piloto R9 y plan', ancla: 'cap-05' },
  { id: '06', nombre: 'Hoja de ruta y red', ancla: 'cap-06' },
  { id: '07', nombre: 'Cierre', ancla: 'cap-07' },
];

// Pasos 3D sobre la isla (Capítulos 03, 04 y 05)
const PASOS_3D = [
  // --- CAP 03: LAS 6 LÍNEAS EN EL TERRITORIO (índices 0..5) ---
  {
    id: 'l91',
    grupo: '03 · Línea 9.1 — Memorias y vernáculo',
    pasoGrupo: '01 / 06',
    titulo: 'Atlas de memorias y arquitectura vernácula',
    cam: 'linea_memoria',
    zonas: [0.95, 0.15, 0.15],
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 0.45 },
    nodosActivos: ['casco', 'sanFernando', 'sanRafael'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '6 dimensiones',
    subCifra: 'Cultural · territorial · material · oficios · hídrica · ecológica',
    resumen: 'Documenta la historia barrial de Bocachica, las tipologías de vivienda vernácula caribeña (ventilación cruzada, aleros, patios sombreados) y los lugares de memoria viva.',
    piloto: 'Atlas vivo de memorias territoriales y catálogo de patrones bioclimáticos vernáculos aplicables al hábitat insular.',
    producto: 'P3 · Atlas comunitario + P9 · Exposición itinerante y señalética.',
  },
  {
    id: 'l92',
    grupo: '03 · Línea 9.2 — Agua y memorias hídricas',
    pasoGrupo: '02 / 06',
    titulo: 'Cosecha de lluvia, aljibes y metabolismo hídrico',
    cam: 'linea_agua',
    zonas: [0.15, 0.2, 0.95],
    rutas: { agua: 1, verde: 0, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['agua', 'escuelaR9', 'casco'],
    lluvia: 0.85,
    cartografia: 0,
    gemelo: 0,
    cifra: '5 fases hídricas',
    subCifra: 'Captación · almacenamiento · tratamiento · uso · reúso',
    resumen: 'Integra la memoria histórica de los aljibes coloniales y pozos comunitarios con soluciones descentralizadas de captación pluvial, biofiltración y monitoreo microbiológico.',
    piloto: 'Sistema demostrativo de cosecha de aguas lluvias, tren de filtrado e infiltración con jardines de lluvia en el nodo escolar.',
    producto: 'P4 · Cartografía socio-hídrica y prototipo escolar de captación.',
  },
  {
    id: 'l93',
    grupo: '03 · Línea 9.3 — Vegetación y refugio climático',
    pasoGrupo: '03 / 06',
    titulo: 'Silvicultura comunitaria y sombra escolar',
    cam: 'linea_verde',
    zonas: [0.1, 0.98, 0.2],
    rutas: { agua: 0.3, verde: 1, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['vivero', 'escuelaR9', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '−4,5 °C',
    subCifra: 'Reducción térmica superficial en patios escolares sombreados',
    resumen: 'Conecta la restauración del manglar y el bosque seco tropical con un vivero-escuela comunitario para crear corredores de sombra y confort higrotérmico.',
    piloto: 'Vivero bioclimático escolar y arborización de patios y corredores peatonales entre el Gimnasio Cristiano (R9) y el borde costero.',
    producto: 'P5 · Diseño participativo del refugio climático + catálogo botánico.',
  },
  {
    id: 'l94',
    grupo: '03 · Línea 9.4 — Residuos y plástico circular',
    pasoGrupo: '04 / 06',
    titulo: 'De residuo costero a componente constructivo',
    cam: 'linea_residuos',
    zonas: [0.2, 0.25, 0.92],
    rutas: { agua: 0, verde: 0, residuos: 1, oficios: 0.4, patrimonio: 0 },
    nodosActivos: ['residuos', 'escuelaR9', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '100 % trazable',
    subCifra: 'Recolección · clasificación · trituración · extrusión · mobiliario',
    resumen: 'Transforma los puntos críticos de acumulación de plástico y recalada marina en una cadena circular de micro-manufactura local para mobiliario escolar y señalética.',
    piloto: 'Ruta de acopio diferenciada y taller de transformación de plástico reciclado en perfiles, bancas y elementos del Aula Ambiental.',
    producto: 'P6 · Hoja de ruta de residuos y prototipo en plástico transformado.',
  },
  {
    id: 'l95',
    grupo: '03 · Línea 9.5 — Carpintería de ribera y mar',
    pasoGrupo: '05 / 06',
    titulo: 'Astilleros tradicionales, pesca y saberes náuticos',
    cam: 'linea_oficios',
    zonas: [0.35, 0.15, 0.95],
    rutas: { agua: 0, verde: 0, residuos: 0.3, oficios: 1, patrimonio: 0 },
    nodosActivos: ['ribera', 'casco', 'sanFernando'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Oficio vivo',
    subCifra: 'Maestros carpinteros · careneros · navegación tradicional',
    resumen: 'Salvaguarda las técnicas constructivas de embarcaciones tradicionales, el conocimiento de maderas locales y las faenas de pesca artesanal frente a la presión turística.',
    piloto: 'Escuela-taller de carpintería de ribera e inventario técnico de embarcaciones, herramientas y espacios de varada en la bahía.',
    producto: 'P7 · Documentación de carpintería de ribera y guía de oficios.',
  },
  {
    id: 'l96',
    grupo: '03 · Línea 9.6 — Patrimonio y doble recorrido',
    pasoGrupo: '06 / 06',
    titulo: 'Paisaje fortificado: mirada del habitante vs. visitante',
    cam: 'linea_patrimonio',
    zonas: [0.98, 0.2, 0.25],
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 1 },
    nodosActivos: ['sanFernando', 'sanJose', 'sanRafael', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '3 fortificaciones',
    subCifra: 'San Fernando · San José · Batería del Ángel San Rafael',
    resumen: 'Supera la visión monumentalista aislada para integrar las fortificaciones coloniales con la vida cotidiana de Bocachica, sus ecosistemas y su memoria afrodescendiente.',
    piloto: 'Circuito pedagógico de doble lectura (recorrido formativo local + ruta interpretativa para visitantes) con estaciones bioclimáticas.',
    producto: 'P8 · Propuesta de recorrido patrimonial y guion museográfico.',
  },

  // --- CAP 04: GEMELO DIGITAL PROGRESIVO (índices 6..10) ---
  {
    id: 'g01',
    grupo: '04 · Gemelo Digital — Nivel 1',
    pasoGrupo: 'Nivel 01 / 05',
    titulo: 'Archivo vivo comunitario georreferenciado',
    cam: 'bocachica_general',
    zonas: [0.85, 0.35, 0.35],
    rutas: { agua: 0.2, verde: 0.2, residuos: 0.2, oficios: 0.2, patrimonio: 0.5 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '9 estudios R1–R9',
    subCifra: 'Relatos orales · fotografías · planos · diagnósticos previos',
    resumen: 'El primer estrato del gemelo digital reúne y devuelve a Bocachica la producción académica dispersa junto con los archivos familiares y relatos de sabedores locales.',
    piloto: 'Repositorio abierto consultable sin internet pesado en el nodo escolar R9 y en dispositivos móviles.',
    producto: 'P1 · Repositorio documental + catálogo indexado.',
  },
  {
    id: 'g02',
    grupo: '04 · Gemelo Digital — Nivel 2',
    pasoGrupo: 'Nivel 02 / 05',
    titulo: 'Cartografía temática multicapa',
    cam: 'bocachica_general',
    zonas: [0.65, 0.65, 0.65],
    rutas: { agua: 0.85, verde: 0.85, residuos: 0.6, oficios: 0.6, patrimonio: 0.85 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 1,
    gemelo: 0,
    cifra: '6 capas SIG',
    subCifra: 'Relieve hipso · agua · vegetación · residuos · oficios · patrimonio',
    resumen: 'Superpone sobre el relieve real de Tierra Bomba las curvas de nivel, cuencas de escorrentía, parches de manglar, rutas de residuos y bordes de erosión costera.',
    piloto: 'Visor cartográfico participativo para cruzar vulnerabilidad ambiental con infraestructura comunitaria.',
    producto: 'P2 · Base SIG + visores temáticos de planificación.',
  },
  {
    id: 'g03',
    grupo: '04 · Gemelo Digital — Nivel 3',
    pasoGrupo: 'Nivel 03 / 05',
    titulo: 'Modelo 2D/3D base de Bocachica y su escuela',
    cam: 'linea_memoria',
    zonas: [0.45, 0.85, 0.45],
    rutas: { agua: 0.6, verde: 0.8, residuos: 0, oficios: 0, patrimonio: 0.6 },
    nodosActivos: ['casco', 'escuelaR9', 'agua', 'vivero'],
    lluvia: 0,
    cartografia: 0.25,
    gemelo: 0,
    cifra: '2.600 huellas 3D',
    subCifra: 'Morfología urbana + levantamiento arquitectónico R9',
    resumen: 'Integra el levantamiento tridimensional del tejido edificado de la isla, el dosel arbóreo escaneado y el modelo BIM/3D detallado del Gimnasio Cristiano de Bocachica.',
    piloto: 'Maqueta digital interactiva para codiseñar intervenciones arquitectónicas y de espacio público con estudiantes y docentes.',
    producto: 'Modelo 3D base + levantamiento del nodo escolar R9.',
  },
  {
    id: 'g04',
    grupo: '04 · Gemelo Digital — Nivel 4',
    pasoGrupo: 'Nivel 04 / 05',
    titulo: 'Simulación de escenarios comparativos',
    cam: 'escuela_r9',
    zonas: [0.2, 0.95, 0.95],
    rutas: { agua: 1, verde: 1, residuos: 0.5, oficios: 0, patrimonio: 0 },
    nodosActivos: ['escuelaR9', 'agua', 'vivero'],
    lluvia: 1,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Antes / Después',
    subCifra: 'Escenario actual vs. refugio climático + cosecha pluvial',
    resumen: 'Permite evaluar visual y cuantitativamente el impacto de techar con cubiertas captadoras, sembrar corredores de sombra y recolectar agua lluvia antes de construir.',
    piloto: 'Simulador de balance hídrico escolar y asoleamiento para priorizar inversiones por fases.',
    producto: 'Escenarios comparativos de inversión y confort.',
  },
  {
    id: 'g05',
    grupo: '04 · Gemelo Digital — Nivel 5',
    pasoGrupo: 'Nivel 05 / 05',
    titulo: 'Nube de puntos y monitoreo comunitario continuo',
    cam: 'gemelo',
    zonas: [0.8, 0.8, 0.8],
    rutas: { agua: 0.9, verde: 0.9, residuos: 0.9, oficios: 0.9, patrimonio: 0.9 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0.3,
    gemelo: 1,
    cifra: 'Ciclo semestral',
    subCifra: 'Indicadores medidos por jóvenes y comité local en Bocachica',
    resumen: 'El gemelo no es una entrega estática: se actualiza cada semestre con datos de lluvia captada, temperatura en aulas, árboles sobrevivientes y plástico transformado.',
    piloto: 'Tablero de indicadores ambientales y bitácora de ciencia ciudadana operada desde el colegio.',
    producto: 'Sistema de monitoreo y actualización intersemestral.',
  },

  // --- CAP 05: PROYECTO PILOTO R9 (GIMNASIO CRISTIANO DE BOCACHICA) (índices 11..13) ---
  {
    id: 'r9_1',
    grupo: '05 · Piloto R9 — Gimnasio Cristiano de Bocachica',
    pasoGrupo: '01 / 03',
    titulo: 'El colegio como corazón del Aula Ambiental (R9)',
    cam: 'escuela_r9',
    zonas: [0.3, 0.98, 0.4],
    rutas: { agua: 0.5, verde: 1, residuos: 0.5, oficios: 0, patrimonio: 0.5 },
    nodosActivos: ['escuelaR9', 'casco', 'vivero'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Nodo R9',
    subCifra: 'Antecedente proyectual directo en el territorio (Serrano, 2026)',
    resumen: 'El Gimnasio Cristiano de Bocachica articula espacialmente el programa: funciona como sede pedagógica, laboratorio bioclimático, punto de cosecha de agua y archivo comunitario.',
    piloto: 'Pabellón educativo con envolvente permeable, pérgolas de sombra, vivero escolar y ágora abierta para asambleas barriales.',
    producto: 'P5 · Proyecto arquitectónico y bioclimático del nodo escolar.',
  },
  {
    id: 'r9_2',
    grupo: '05 · Piloto R9 — Cosecha pluvial y confort',
    pasoGrupo: '02 / 03',
    titulo: 'Cubierta captadora en V, aljibe y enfriamiento pasivo',
    cam: 'escuela_r9',
    zonas: [0.15, 0.85, 1.0],
    rutas: { agua: 1, verde: 0.8, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['escuelaR9', 'agua'],
    lluvia: 1,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Agua + Sombra',
    subCifra: 'Captación pluvial en cubierta + biofiltración y ventilación cruzada',
    resumen: 'Durante las lluvias caribeñas, la cubierta actúa como un embudo que conduce el agua hacia el aljibe escolar filtrado; en época seca, su doble piel ventilada abate la carga térmica.',
    piloto: 'Módulo demostrativo de captación pluvial, filtro biológico, lavado de manos y jardín de lluvia pedagógico.',
    producto: 'Prototipo funcional agua-clima en el Gimnasio Cristiano.',
  },
  {
    id: 'r9_3',
    grupo: '05 · Piloto R9 — Red de 6 pilotos articulados',
    pasoGrupo: '03 / 03',
    titulo: 'De la escuela al territorio: los 6 pilotos conectados',
    cam: 'bocachica_general',
    zonas: [0.9, 0.9, 0.9],
    rutas: { agua: 1, verde: 1, residuos: 1, oficios: 1, patrimonio: 1 },
    nodosActivos: null,
    lluvia: 0.35,
    cartografia: 0.2,
    gemelo: 0,
    cifra: '6 pilotos',
    subCifra: 'Memoria · Agua · Refugio R9 · Plástico · Ribera · Patrimonio',
    resumen: 'Desde el Gimnasio Cristiano (R9), el Aula Ambiental irradia hacia el casco urbano, los aljibes históricos, el manglar, los astilleros de ribera y los fuertes del canal.',
    piloto: 'Red territorial de micro-intervenciones señalizadas y conectadas mediante corredores sombreados y rutas pedagógicas.',
    producto: 'Programa marco articulado a 24 meses (F1–F6).',
  },
];

// =============================================================================
// UTILIDADES VISUALES (Idénticas a tesis_tercer_corte)
// =============================================================================

function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const words = text.split(' ');
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.85;
      const end = vh * 0.2;
      const t = (start - r.top) / (start - end + r.height * 0.55);
      setP(Math.max(0, Math.min(1, t)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const active = Math.round(p * words.length);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="transition-colors duration-200"
          style={{ color: i < active ? '#f4f1ec' : 'rgba(244,241,236,0.22)' }}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

function Escribir({ text = '', ms = 11 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!text) return undefined;
    const id = setInterval(() => {
      setN((k) => {
        if (k >= text.length) {
          clearInterval(id);
          return k;
        }
        return k + 2;
      });
    }, ms);
    return () => clearInterval(id);
  }, [text, ms]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="inline-block w-1.5 h-3.5 bg-[#e0917a] ml-0.5 align-middle animate-pulse" />}
    </>
  );
}

function Apilada({ partes, leyenda = true }) {
  return (
    <div>
      <div className="h-3.5 w-full flex overflow-hidden rounded-sm bg-white/10">
        {partes.map((p, i) => (
          <div
            key={i}
            style={{ width: `${p.pct}%`, background: p.color }}
            title={`${p.etiqueta}: ${p.pct} %`}
            className="h-full first:rounded-l-sm last:rounded-r-sm transition-all duration-500"
          />
        ))}
      </div>
      {leyenda && (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2.5 text-xs text-white/75">
          {partes.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span>{p.etiqueta}</span>
              <span className="tc-num text-white font-semibold">{p.pct} %</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function BarraSimple({ valor, max = 100, color = '#e0917a', etiqueta, sufijo = '%' }) {
  const w = Math.max(2, Math.min(100, (valor / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/80">{etiqueta}</span>
        <span className="tc-num text-white font-semibold">{valor}{sufijo}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-sm overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${w}%`, background: color }} />
      </div>
    </div>
  );
}

// =============================================================================
// EXPLICACIÓN ANIMADA EN 4 PASOS SIMPLES ("FÁCIL DE ENTENDER" + WCAG 2.2.2 PAUSE)
// =============================================================================
const PASOS_HISTORIA_SIMPLE = [
  {
    n: '01',
    titulo: '1. Devolver lo investigado a la comunidad',
    fraseSimple: 'Antes los estudios se quedaban en bibliotecas; ahora regresan a Bocachica como mapas, talleres y cuentos en la escuela.',
    datoClave: '9 estudios (R1–R9) integrados',
    color: '#e0917a',
    quePasa: 'Estudiantes, profesores y sabedores locales revisan juntos los mapas de la isla, corrigen errores y deciden qué es lo más urgente.',
  },
  {
    n: '02',
    titulo: '2. Agua de lluvia y sombra en el colegio (R9)',
    fraseSimple: 'El techo del Gimnasio Cristiano recoge el agua de lluvia en un aljibe filtrado y los nuevos árboles bajan el calor del patio.',
    datoClave: '−4,5 °C de calor · +85 % lluvia captada',
    color: '#6ec6e6',
    quePasa: 'En vez de perderse, la lluvia se guarda para el colegio y el vivero; las pérgolas y árboles crean un refugio fresco para estudiar.',
  },
  {
    n: '03',
    titulo: '3. Plástico reciclado y oficios del mar vivos',
    fraseSimple: 'El plástico que llega a la costa se transforma en bancas para la escuela, y los carpinteros de ribera enseñan su oficio a los jóvenes.',
    datoClave: 'Economía circular + Escuela de ribera',
    color: '#f5b45a',
    quePasa: 'Se limpia el borde costero convirtiendo residuos en mobiliario útil y se protege el saber tradicional de construir y reparar lanchas.',
  },
  {
    n: '04',
    titulo: '4. Cuidar y medir cada semestre en el mapa 3D',
    fraseSimple: 'Un Gemelo Digital 3D fácil de usar permite que el colegio y la comunidad vigilen el agua, los árboles y los proyectos durante 24 meses.',
    datoClave: '4 semestres · 15 actores en red',
    color: '#35d08a',
    quePasa: 'Ninguna obra se abandona: cada semestre el comité local mide qué funcionó y actualiza el modelo 3D de Bocachica.',
  },
];

function SimuladorAulaEn4Pasos({ animPausada }) {
  const [paso, setPaso] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || animPausada) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const id = setInterval(() => {
      setPaso((p) => (p + 1) % PASOS_HISTORIA_SIMPLE.length);
    }, 4800);
    return () => clearInterval(id);
  }, [autoPlay, animPausada]);

  const actual = PASOS_HISTORIA_SIMPLE[paso];

  return (
    <div className="tc-vidrio p-5 md:p-7 tc-scroll-card">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
        <div>
          <div className="tc-etiqueta !text-[#e0917a]">Guía visual animada · En palabras sencillas</div>
          <h3 className="text-xl md:text-2xl font-semibold text-white mt-0.5">
            ¿Cómo funciona el Aula Ambiental en 4 pasos?
          </h3>
        </div>
        {/* Control accesible de Pausa / Reproducción (WCAG 2.2.2 Pause, Stop, Hide) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            className="tc-ficha tc-ficha-activa !text-white !border-[#e0917a]"
          >
            {autoPlay && !animPausada ? '⏸ Pausar animación' : '▶ Reproducir animación'}
          </button>
        </div>
      </div>

      {/* Botones de los 4 pasos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {PASOS_HISTORIA_SIMPLE.map((item, idx) => {
          const act = paso === idx;
          return (
            <button
              key={item.n}
              type="button"
              onClick={() => { setPaso(idx); setAutoPlay(false); }}
              className={`p-3 rounded-xl text-left border transition-all ${
                act
                  ? 'bg-white/[0.09] border-white/45 shadow-lg'
                  : 'bg-white/[0.02] border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="tc-num font-mono font-semibold" style={{ color: item.color }}>
                  PASO {item.n}
                </span>
                {act && <span className="w-2 h-2 rounded-full animate-ping" style={{ background: item.color }} />}
              </div>
              <div className="text-xs font-semibold text-white mt-1 line-clamp-2">{item.titulo}</div>
            </button>
          );
        })}
      </div>

      {/* Escena SVG animada según el paso activo */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 bg-[#060a0f] rounded-xl border border-white/10 p-3 overflow-hidden">
          <svg viewBox="0 0 600 280" className="w-full h-auto block select-none">
            <defs>
              <linearGradient id="cielo-sim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#09131c" />
                <stop offset="100%" stopColor="#102534" />
              </linearGradient>
            </defs>
            <rect width="600" height="280" rx="10" fill="url(#cielo-sim)" />
            {/* Suelo de la isla y mar */}
            <path d="M 0 235 Q 160 220 340 230 T 600 238 L 600 280 L 0 280 Z" fill="#172822" />
            <path d="M 0 252 Q 150 246 300 252 T 600 250 L 600 280 L 0 280 Z" fill="#0d4a60" opacity="0.7" />

            {/* ESCENA PASO 1: Devolver saberes a la escuela y comunidad */}
            {paso === 0 && (
              <g>
                {/* Nodo Universidad / Archivo */}
                <rect x="55" y="95" width="120" height="90" rx="8" fill="#131c26" stroke="#e0917a" strokeWidth="2" />
                <text x="115" y="128" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Estudios R1–R8</text>
                <text x="115" y="146" textAnchor="middle" fill="#e0917a" fontSize="9.5" fontFamily="IBM Plex Mono">Mapas + Memorias</text>
                <text x="115" y="166" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8.5">Universidad + Archivos</text>

                {/* Puente animado de devolución */}
                <path id="arco-devolucion" d="M 180 135 Q 300 55 415 135" fill="none" stroke="#e0917a" strokeWidth="2.5" strokeDasharray="6 4" />
                <circle r="6" fill="#e0917a">
                  <animateMotion dur="2.2s" repeatCount="indefinite">
                    <mpath href="#arco-devolucion" />
                  </animateMotion>
                </circle>
                <circle r="4" fill="#6ec6e6">
                  <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite">
                    <mpath href="#arco-devolucion" />
                  </animateMotion>
                </circle>
                <text x="300" y="75" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                  Devolver · Validar · Transformar →
                </text>

                {/* Nodo Comunidad y Escuela en Bocachica */}
                <rect x="420" y="95" width="130" height="90" rx="8" fill="#13241c" stroke="#35d08a" strokeWidth="2" />
                <text x="485" y="128" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Bocachica + R9</text>
                <text x="485" y="146" textAnchor="middle" fill="#35d08a" fontSize="9.5" fontFamily="IBM Plex Mono">Escuela y Familias</text>
                <text x="485" y="166" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8.5">Deciden prioridades</text>
              </g>
            )}

            {/* ESCENA PASO 2: Lluvia en cubierta en V + sombra bioclimática en Colegio R9 */}
            {paso === 1 && (
              <g>
                {/* Gotas de lluvia animadas */}
                {[140, 185, 230, 275, 320, 365].map((lx, i) => (
                  <line key={lx} x1={lx} y1="20" x2={lx - 4} y2="36" stroke="#6ec6e6" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="y1" from="15" to="115" dur={`${0.9 + (i % 3) * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="y2" from="30" to="130" dur={`${0.9 + (i % 3) * 0.2}s`} repeatCount="indefinite" />
                  </line>
                ))}

                {/* Escuela R9 con cubierta en V (macro-embudo) */}
                <rect x="155" y="135" width="190" height="85" fill="#1e293b" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <polygon points="135,112 250,142 365,112 365,122 250,152 135,122" fill="#6ec6e6" />
                <text x="250" y="182" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
                  Gimnasio Cristiano (R9)
                </text>
                <text x="250" y="200" textAnchor="middle" fill="#a8f0c6" fontSize="9.5" fontFamily="IBM Plex Mono">
                  Patio fresco: −4,5 °C con sombra
                </text>

                {/* Tubería hacia el aljibe */}
                <path d="M 250 152 L 250 165 L 435 165 L 435 180" fill="none" stroke="#6ec6e6" strokeWidth="3" />

                {/* Aljibe llenándose */}
                <rect x="405" y="150" width="85" height="72" rx="6" fill="rgba(110,198,230,0.12)" stroke="#6ec6e6" strokeWidth="2" />
                <rect x="409" y="172" width="77" height="46" rx="4" fill="#2f9fd0" opacity="0.85">
                  <animate attributeName="y" values="205;162;205" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="height" values="13;56;13" dur="4s" repeatCount="indefinite" />
                </rect>
                <text x="447" y="140" textAnchor="middle" fill="#6ec6e6" fontSize="10" fontWeight="600">Aljibe Escolar</text>

                {/* Árboles de refugio climático creciendo */}
                <g transform="translate(95, 175)">
                  <rect x="-4" y="15" width="8" height="42" fill="#8a6a4a" />
                  <circle cx="0" cy="5" r="28" fill="#35d08a" opacity="0.85">
                    <animate attributeName="r" values="22;30;22" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>
              </g>
            )}

            {/* ESCENA PASO 3: Plástico reciclado y Carpintería de Ribera */}
            {paso === 2 && (
              <g>
                {/* Recolección de plástico -> Taller -> Banca escolar */}
                <rect x="45" y="110" width="135" height="82" rx="8" fill="#231c12" stroke="#f5b45a" strokeWidth="2" />
                <text x="112" y="142" textAnchor="middle" fill="#ffe1a8" fontSize="11.5" fontWeight="600">Plástico Costero</text>
                <text x="112" y="160" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="IBM Plex Mono">Acopio y limpieza</text>

                <path id="ruta-plastico" d="M 185 150 L 295 150" stroke="#f5b45a" strokeWidth="2.5" strokeDasharray="5 4" />
                <circle r="5" fill="#f5b45a">
                  <animateMotion dur="1.5s" repeatCount="indefinite">
                    <mpath href="#ruta-plastico" />
                  </animateMotion>
                </circle>

                <rect x="300" y="110" width="125" height="82" rx="8" fill="#17241e" stroke="#35d08a" strokeWidth="2" />
                <text x="362" y="142" textAnchor="middle" fill="#fff" fontSize="11.5" fontWeight="600">Bancas y Tablas</text>
                <text x="362" y="160" textAnchor="middle" fill="#35d08a" fontSize="9" fontFamily="IBM Plex Mono">Mobiliario escolar</text>

                {/* Embarcación tradicional (Carpintería de ribera 9.5) */}
                <g>
                  <animateTransform attributeName="transform" type="translate" values="0,0; 18,0; 0,0" dur="3.5s" repeatCount="indefinite" />
                  <polygon points="455,215 555,215 538,238 472,238" fill="#e0917a" stroke="#fff" strokeWidth="1.2" />
                  <polygon points="505,150 505,210 542,202" fill="#f4f1ec" opacity="0.9" />
                  <text x="505" y="136" textAnchor="middle" fill="#f7d49e" fontSize="10" fontWeight="600">Carpintería de Ribera</text>
                </g>
              </g>
            )}

            {/* ESCENA PASO 4: Gemelo Digital 3D y monitoreo comunitario */}
            {paso === 3 && (
              <g>
                {/* Silueta de la isla con pulsos de sensores */}
                <path
                  d="M 150 190 Q 230 95 350 110 T 480 185 Q 360 220 150 190 Z"
                  fill="rgba(53,208,138,0.15)"
                  stroke="#35d08a"
                  strokeWidth="2"
                />
                {[
                  { x: 235, y: 155, etq: 'Agua', col: '#6ec6e6' },
                  { x: 315, y: 138, etq: 'Escuela R9', col: '#35d08a' },
                  { x: 395, y: 165, etq: 'Oficios', col: '#f5b45a' },
                ].map((nd) => (
                  <g key={nd.etq} transform={`translate(${nd.x},${nd.y})`}>
                    <circle r="18" fill="none" stroke={nd.col} strokeWidth="1.5">
                      <animate attributeName="r" values="8;26;8" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle r="6" fill={nd.col} />
                    <text y="-12" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="600">{nd.etq}</text>
                  </g>
                ))}
                <text x="310" y="62" textAnchor="middle" fill="#fff" fontSize="12.5" fontWeight="600">
                  Gemelo Digital 3D · Monitoreo cada 6 meses
                </text>
                <text x="310" y="82" textAnchor="middle" fill="#6ec6e6" fontSize="10" fontFamily="IBM Plex Mono">
                  Archivo vivo → Cartografía → Modelo 3D → Escenarios → Cuidado
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Explicación clara y directa del paso actual */}
        <div key={actual.n} className="md:col-span-5 space-y-4 tc-paso-anim">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono" style={{ color: actual.color }}>
            <span>●</span>
            <span>{actual.datoClave}</span>
          </div>
          <h4 className="text-2xl font-semibold text-white leading-snug">{actual.titulo}</h4>
          <p className="text-base text-white/90 leading-relaxed font-medium">
            {actual.fraseSimple}
          </p>
          <p className="text-xs text-white/70 leading-relaxed pt-3 tc-regla">
            <strong className="text-white">¿Cómo ocurre en la práctica?</strong> {actual.quePasa}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setAutoPlay(false); setPaso((paso + PASOS_HISTORIA_SIMPLE.length - 1) % PASOS_HISTORIA_SIMPLE.length); }}
              className="tc-ficha"
            >
              ← Paso anterior
            </button>
            <button
              type="button"
              onClick={() => { setAutoPlay(false); setPaso((paso + 1) % PASOS_HISTORIA_SIMPLE.length); }}
              className="tc-ficha tc-ficha-activa !text-white !border-[#e0917a]"
            >
              Siguiente paso ({((paso + 1) % PASOS_HISTORIA_SIMPLE.length) + 1}/4) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SIMULADOR INTERACTIVO ANTES / DESPUÉS EN EL COLEGIO R9 (Fácil de entender)
// =============================================================================
function SimuladorAntesDespuesR9() {
  const [conProyecto, setConProyecto] = useState(true);

  return (
    <div className="mt-12 tc-vidrio p-5 md:p-7 tc-scroll-card">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
        <div>
          <div className="tc-etiqueta !text-[#35d08a]">Simulador interactivo · Gimnasio Cristiano de Bocachica (R9)</div>
          <h3 className="text-xl md:text-2xl font-semibold text-white mt-0.5">
            Compara el patio escolar: Hoy vs. Con el Aula Ambiental
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConProyecto(false)}
            className={`tc-ficha ${!conProyecto ? 'tc-ficha-activa !border-[#e0917a] !text-white' : ''}`}
          >
            ☀ Hoy (Sin intervención)
          </button>
          <button
            type="button"
            onClick={() => setConProyecto(true)}
            className={`tc-ficha ${conProyecto ? 'tc-ficha-activa !border-[#35d08a] !text-white' : ''}`}
          >
            🌳 Con Aula Ambiental (Piloto R9)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 space-y-4">
          <BarraSimple
            etiqueta={conProyecto ? 'Sombra útil en patio escolar (Con refugio bioclimático)' : 'Sombra útil en patio escolar (Hoy: radiación directa)'}
            valor={conProyecto ? 78 : 18}
            color={conProyecto ? '#35d08a' : '#e0917a'}
            sufijo=" % del patio sombreado"
          />
          <BarraSimple
            etiqueta={conProyecto ? 'Agua de lluvia cosechada en cubierta y filtrada' : 'Agua de lluvia aprovechada (Hoy: se pierde por escorrentía)'}
            valor={conProyecto ? 85 : 5}
            color={conProyecto ? '#6ec6e6' : '#e0917a'}
            sufijo=" % aprovechado"
          />
          <BarraSimple
            etiqueta={conProyecto ? 'Confort térmico para clases al aire libre (−4,5 °C)' : 'Confort térmico a mediodía (Estrés por calor)'}
            valor={conProyecto ? 88 : 28}
            color={conProyecto ? '#35d08a' : '#f5b45a'}
            sufijo=" / 100 índice de confort"
          />
        </div>

        <div key={conProyecto ? 'despues' : 'antes'} className="md:col-span-6 tc-vidrio p-5 tc-paso-anim">
          <div className="flex items-center justify-between">
            <span className="tc-etiqueta" style={{ color: conProyecto ? '#35d08a' : '#e0917a' }}>
              {conProyecto ? 'Escenario con el Piloto R9 activo' : 'Situación base diagnosticada (R1, R8, R9)'}
            </span>
            <span className="tc-num text-2xl font-semibold text-white">
              {conProyecto ? '31,5 °C' : '36,0 °C'}
            </span>
          </div>
          <p className="text-sm text-white/85 mt-3 leading-relaxed">
            {conProyecto
              ? 'La cubierta captadora en V recoge la lluvia hacia el aljibe escolar, el vivero de especies nativas sombrea el patio y la cancha de preescolar funciona como aula abierta para niños, docentes y comunidad.'
              : 'El sol caribeño incide directamente sobre el patio y las aulas sin suficiente sombra arbórea, limitando el juego y las actividades pedagógicas en las horas centrales del día y desperdiciando el agua de lluvia.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 01 · RED PROGRESIVA DEL PROBLEMA (Idéntica a Red.jsx en tesis_tercer_corte)
// =============================================================================
const NODOS_PROBLEMA = [
  {
    id: 'aula',
    titulo: 'Aula Ambiental Bocachica',
    sub: 'Núcleo articulador',
    x: 500,
    y: 265,
    central: true,
    color: '#e0917a',
    cifra: 'Programa marco v0.1 · 24 meses',
    detalle: 'Plataforma viva de investigación aplicada, docencia, creación y acción participativa en Tierra Bomba (PUJ + Comunidad + Gimnasio Cristiano R9).',
    relaciones: [
      'Integra 9 estudios previos (R1–R9) en un solo sistema territorial',
      'Articula 6 líneas de acción, 6 pilotos y un gemelo digital progresivo',
      'Opera bajo el principio rector: devolver, validar y transformar',
    ],
  },
  {
    id: 'fragmentacion',
    titulo: 'Estudios sin retorno',
    sub: 'Fragmentación R1–R8',
    x: 195,
    y: 110,
    color: '#f4f1ec',
    cifra: '8 diagnósticos previos dispersos',
    detalle: 'Sobre Bocachica existen tesis y estudios valiosos (R1–R8), pero permanecían desarticulados entre sí y sin devolución pedagógica ni apropiación local.',
    relaciones: [
      'Falta de un repositorio común accesible para la escuela y la comunidad',
      'Ausencia de continuidad entre semestres académicos',
    ],
  },
  {
    id: 'agua',
    titulo: 'Crisis hídrica y salinidad',
    sub: 'Línea 9.2 · Agua',
    x: 805,
    y: 110,
    color: '#6ec6e6',
    cifra: 'Aljibes históricos + déficit pluvial',
    detalle: 'Vulnerabilidad en el acceso a agua segura, deterioro de aljibes patrimoniales, escorrentía sin aprovechamiento y riesgos microbiológicos.',
    relaciones: [
      'Pérdida de saberes hídricos locales de captación y cuidado de pozos',
      'Urgencia de cosecha de lluvia y biofiltración en el nodo escolar R9',
    ],
  },
  {
    id: 'clima',
    titulo: 'Estrés térmico escolar',
    sub: 'Línea 9.3 · Nodo R9',
    x: 845,
    y: 265,
    color: '#35d08a',
    cifra: 'Alta radiación + déficit de sombra',
    detalle: 'En el Gimnasio Cristiano de Bocachica (R9) y su entorno inmediato, la radiación solar intensa y la falta de arbolado reducen el confort pedagógico.',
    relaciones: [
      'Pérdida de cobertura vegetal y presión sobre el manglar costero',
      'Potencial de vivero escolar y refugio climático bioclimático',
    ],
  },
  {
    id: 'residuos',
    titulo: 'Presión de residuos y plástico',
    sub: 'Línea 9.4 · Circularidad',
    x: 785,
    y: 425,
    color: '#f5b45a',
    cifra: 'Acumulación costera y recalada',
    detalle: 'Puntos críticos de residuos sólidos y plásticos de recalada marina afectan el paisaje, los caños y la salud ambiental de Bocachica.',
    relaciones: [
      'Oportunidad de transformar plástico recuperado en mobiliario escolar',
      'Alianza con iniciativas locales de reciclaje y manufactura',
    ],
  },
  {
    id: 'oficios',
    titulo: 'Fragilidad de oficios del mar',
    sub: 'Línea 9.5 · Ribera',
    x: 215,
    y: 425,
    color: '#e8a86b',
    cifra: 'Carpintería de ribera y pesca',
    detalle: 'Los astilleros artesanales, maestros carpinteros de ribera y pescadores enfrentan relevo generacional incierto y pérdida de espacios de varada.',
    relaciones: [
      'Transmisión intergeneracional en riesgo sin escuela-taller',
      'Vínculo directo con la madera, el bosque seco y la soberanía alimentaria',
    ],
  },
  {
    id: 'patrimonio',
    titulo: 'Patrimonio desconectado',
    sub: 'Línea 9.6 · Fuertes y memoria',
    x: 155,
    y: 265,
    color: '#c490ff',
    cifra: 'San Fernando · San José · San Rafael',
    detalle: 'El circuito turístico tradicional visita las fortificaciones coloniales sin reconocer la memoria viva, vernácula y ambiental de los habitantes de Bocachica.',
    relaciones: [
      'Brecha entre la mirada del visitante y la memoria del habitante',
      'Necesidad de un recorrido pedagógico biocultural e integrado',
    ],
  },
];

const ENLACES_PROBLEMA = [
  ['aula', 'fragmentacion', 'Devolver R1–R9'],
  ['aula', 'agua', 'Cosecha pluvial'],
  ['aula', 'clima', 'Refugio R9'],
  ['aula', 'residuos', 'Plástico circular'],
  ['aula', 'oficios', 'Escuela de ribera'],
  ['aula', 'patrimonio', 'Doble recorrido'],
  ['fragmentacion', 'patrimonio', 'Archivo vivo'],
  ['agua', 'clima', 'Jardines de lluvia'],
  ['clima', 'oficios', 'Maderas y vivero'],
  ['residuos', 'oficios', 'Taller productivo'],
];

const curvaRed = (a, b) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const k = a.central || b.central ? 0.08 : 0.16;
  return { d: `M ${a.x} ${a.y} Q ${mx - dy * k} ${my + dx * k} ${b.x} ${b.y}`, lx: mx - dy * k * 0.5, ly: my + dx * k * 0.5 };
};

function RedProblemaAula() {
  const [vistos, setVistos] = useState(1);
  const [sel, setSel] = useState('aula');
  const porId = Object.fromEntries(NODOS_PROBLEMA.map((n) => [n.id, n]));
  const idsVisibles = new Set(NODOS_PROBLEMA.slice(0, vistos).map((n) => n.id));
  const actual = porId[sel] || NODOS_PROBLEMA[0];
  const completo = vistos >= NODOS_PROBLEMA.length;

  const avanzar = () => {
    const sig = Math.min(NODOS_PROBLEMA.length, vistos + 1);
    setVistos(sig);
    setSel(NODOS_PROBLEMA[sig - 1].id);
  };
  const mostrarTodo = () => {
    setVistos(NODOS_PROBLEMA.length);
  };
  const reiniciar = () => {
    setVistos(1);
    setSel('aula');
  };

  return (
    <div className="grid md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-8 tc-vidrio p-3 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="tc-etiqueta mr-2">Paso {vistos} de {NODOS_PROBLEMA.length}</span>
            {NODOS_PROBLEMA.map((n, i) => (
              <button
                key={n.id}
                type="button"
                onClick={() => { if (i + 1 > vistos) setVistos(i + 1); setSel(n.id); }}
                title={n.titulo}
                className={`h-1.5 rounded-full transition-all ${
                  sel === n.id ? 'w-6 bg-[#e0917a]' : i < vistos ? 'w-3 bg-white/55 hover:bg-white/80' : 'w-2 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {!completo ? (
              <button
                type="button"
                onClick={avanzar}
                className="tc-ficha tc-ficha-activa !text-white !border-[#e0917a]"
              >
                {vistos === 1 ? 'Descubrir primera relación →' : `Revelar siguiente relación (${vistos}/${NODOS_PROBLEMA.length}) →`}
              </button>
            ) : (
              <button type="button" onClick={reiniciar} className="tc-ficha">
                Reiniciar recorrido ↺
              </button>
            )}
            {!completo && (
              <button type="button" onClick={mostrarTodo} className="tc-ficha">
                Ver red completa
              </button>
            )}
          </div>
        </div>

        <svg viewBox="0 0 1000 530" className="w-full h-auto select-none">
          <defs>
            <radialGradient id="halo-aula" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0917a" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#e0917a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="500" cy="265" r="220" fill="url(#halo-aula)" />
          <circle cx="500" cy="265" r="185" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />

          {ENLACES_PROBLEMA.map(([ia, ib, etq], idx) => {
            if (!idsVisibles.has(ia) || !idsVisibles.has(ib)) return null;
            const a = porId[ia];
            const b = porId[ib];
            const { d, lx, ly } = curvaRed(a, b);
            const activo = sel === ia || sel === ib;
            const pid = `ruta-aula-${idx}`;
            return (
              <g key={`${ia}-${ib}`} style={{ opacity: activo ? 1 : 0.28, transition: 'opacity .25s' }}>
                <path
                  id={pid}
                  d={d}
                  fill="none"
                  stroke={activo ? '#e0917a' : '#f4f1ec'}
                  strokeWidth={activo ? 1.9 : 1}
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="0"
                >
                  <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.65s" fill="freeze" />
                </path>
                {activo && (
                  <circle r="3" fill="#ffffff">
                    <animateMotion dur="2.8s" repeatCount="indefinite">
                      <mpath href={`#${pid}`} />
                    </animateMotion>
                  </circle>
                )}
                {activo && (
                  <text
                    x={lx}
                    y={ly - 6}
                    textAnchor="middle"
                    fill="rgba(244,241,236,0.82)"
                    fontSize="10.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {etq}
                  </text>
                )}
              </g>
            );
          })}

          {NODOS_PROBLEMA.slice(0, vistos).map((n) => {
            const activo = sel === n.id;
            const conectado = ENLACES_PROBLEMA.some(
              ([a, b]) => idsVisibles.has(a) && idsVisibles.has(b) && ((a === sel && b === n.id) || (b === sel && a === n.id))
            );
            const op = activo || conectado ? 1 : 0.48;
            const r = n.central ? 58 : 42;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onClick={() => setSel(n.id)}
                style={{ cursor: 'pointer', opacity: op, transition: 'opacity .25s' }}
              >
                {activo && (
                  <circle r={r + 8} fill="none" stroke={n.color} strokeWidth="1.2" opacity="0.55">
                    <animate attributeName="r" values={`${r + 4};${r + 14};${r + 4}`} dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.65;0.15;0.65" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={r}
                  fill={n.central ? '#1d1210' : '#0b1015'}
                  stroke={activo ? n.color : 'rgba(255,255,255,0.28)'}
                  strokeWidth={activo ? 2.2 : 1.2}
                />
                <text
                  y={-4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={n.central ? '12.5' : '11.5'}
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {n.titulo}
                </text>
                <text
                  y={13}
                  textAnchor="middle"
                  fill="rgba(244,241,236,0.65)"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="md:col-span-4 tc-vidrio p-6">
        <div className="tc-etiqueta" style={{ color: actual.color }}>{actual.sub}</div>
        <h3 className="text-2xl font-semibold mt-1 text-white">{actual.titulo}</h3>
        <div className="mt-3 pt-3 tc-regla">
          <div className="tc-etiqueta">Indicador / alcance</div>
          <div className="tc-num text-lg font-semibold mt-0.5" style={{ color: actual.color }}>{actual.cifra}</div>
        </div>
        <p className="text-sm text-white/80 mt-3 leading-relaxed min-h-[4.2rem]">
          <Escribir key={actual.id} text={actual.detalle} />
        </p>
        <div className="mt-4 pt-3 tc-regla">
          <div className="tc-etiqueta mb-2">Implicaciones directas</div>
          <ul className="space-y-1.5 text-xs text-white/80">
            {actual.relaciones.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: actual.color }}>→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        {!completo && (
          <button
            type="button"
            onClick={avanzar}
            className="mt-4 w-full py-2 rounded-lg text-xs font-medium bg-[#e0917a]/20 border border-[#e0917a] text-white hover:bg-[#e0917a]/30 transition"
          >
            Siguiente nodo ({vistos + 1}/{NODOS_PROBLEMA.length}): {NODOS_PROBLEMA[vistos].titulo} →
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// 02 · LO QUE DICEN LOS ANTECEDENTES Y LAS MEMORIAS (Estilo Social.jsx, cero tablas)
// =============================================================================
function BloqueVisual({ num, titulo, subtitulo, children }) {
  return (
    <div className="py-16 md:py-24 tc-regla">
      <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
        <div className="md:col-span-4">
          <div className="tc-etiqueta">{num}</div>
          <h3 className="text-2xl md:text-3xl font-semibold mt-2 leading-tight text-white">{titulo}</h3>
          {subtitulo && <p className="text-white/75 text-sm mt-3 leading-relaxed">{subtitulo}</p>}
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </div>
  );
}

function SeccionMemoriasYBase() {
  const [docSel, setDocSel] = useState(ANTECEDENTES_CORPUS[8]); // R9 por defecto
  const [dimSel, setDimSel] = useState(0);
  const [cicloSel, setCicloSel] = useState(0);

  const COLORES_DIM = ['#e0917a', '#6ec6e6', '#f5b45a', '#e8a86b', '#38bdf8', '#35d08a'];
  const PESOS_DIM = [92, 88, 85, 84, 96, 94];

  return (
    <section id="cap-02" className="relative z-10 bg-black px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="tc-etiqueta">02 · Antecedentes, memorias y ciclo metodológico</div>
          <h2 className="text-3xl md:text-5xl font-semibold mt-2 leading-[1.05] text-white">
            Nueve estudios previos, seis dimensiones de la memoria y un ciclo de retorno comunitario.
          </h2>
          <p className="text-white/75 mt-4 text-base leading-relaxed">
            El Aula Ambiental no parte de cero: articula el corpus documental existente sobre Bocachica (<span className="tc-num text-white font-medium">R1–R9</span>), activa las seis dimensiones de su memoria biocultural y reemplaza el extractivismo académico por un ciclo de seis momentos.
          </p>
        </div>

        {/* 01 · Corpus documental R1-R9 visual */}
        <BloqueVisual
          num="01 · Corpus de referencia R1–R9"
          titulo="De 8 estudios dispersos al antecedente proyectual en el Gimnasio Cristiano (R9)."
          subtitulo="Selecciona cada documento base para explorar su aporte técnico, su lectura crítica y el vacío territorial que el Aula Ambiental resuelve."
        >
          <div className="space-y-6">
            <div>
              <div className="text-xs text-white/65 mb-2">
                Composición temática del corpus base (<span className="tc-num text-white">R1–R9</span>)
              </div>
              <Apilada
                partes={[
                  { etiqueta: 'Arquitectura, hábitat y escuela R9', pct: 34, color: '#35d08a' },
                  { etiqueta: 'Agua, ecología y metabolismo insular', pct: 33, color: '#6ec6e6' },
                  { etiqueta: 'Memoria, patrimonio y oficios del mar', pct: 33, color: '#e0917a' },
                ]}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ANTECEDENTES_CORPUS.map((d) => {
                const activo = docSel.id === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDocSel(d)}
                    className={`tc-ficha ${activo ? 'tc-ficha-activa' : ''}`}
                  >
                    <span className="tc-num font-semibold mr-1">{d.id}</span>
                    <span>{d.id === 'R9' ? '★ Gimnasio Cristiano' : d.temas.split(',')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="tc-vidrio p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="tc-etiqueta !text-[#e0917a]">
                  Documento {docSel.id} · {docSel.anio}
                </span>
                <span className="text-xs font-mono text-white/60">{docSel.institucion}</span>
              </div>
              <h4 className="text-xl font-semibold text-white mt-1.5">{docSel.titulo}</h4>
              <p className="text-xs text-white/60 mt-0.5">{docSel.autores}</p>

              <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 tc-regla">
                <div>
                  <div className="tc-etiqueta mb-1">Aporte al Aula Ambiental</div>
                  <p className="text-sm text-white/85 leading-relaxed">{docSel.aporte}</p>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <div className="tc-etiqueta !text-[#6ec6e6] mb-1">Vacío que el programa resuelve</div>
                  <p className="text-sm text-white/80 leading-relaxed">{docSel.vacio}</p>
                </div>
              </div>
            </div>
          </div>
        </BloqueVisual>

        {/* 02 · Las 6 dimensiones de la memoria biocultural */}
        <BloqueVisual
          num="02 · Seis dimensiones de la memoria"
          titulo="La memoria como infraestructura para planificar el futuro de Bocachica."
          subtitulo="En el programa marco, la memoria no es nostalgia pasiva: es un sistema de conocimientos empíricos sobre clima, agua, materiales, pesca y territorio."
        >
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6">
              <svg viewBox="0 0 360 320" className="w-full h-auto select-none">
                <circle cx="180" cy="160" r="112" fill="none" stroke="rgba(255,255,255,0.09)" strokeDasharray="3 5" />
                <circle cx="180" cy="160" r="34" fill="#171210" stroke="#e0917a" strokeWidth="1.8" />
                <text x="180" y="157" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600">Memoria</text>
                <text x="180" y="170" textAnchor="middle" fill="rgba(244,241,236,0.65)" fontSize="8.5" fontFamily="IBM Plex Mono">Biocultural</text>

                {DIMENSIONES_MEMORIA.map((d, i) => {
                  const ang = (i / DIMENSIONES_MEMORIA.length) * Math.PI * 2 - Math.PI / 2;
                  const nx = 180 + Math.cos(ang) * 112;
                  const ny = 160 + Math.sin(ang) * 112;
                  const act = dimSel === i;
                  const col = COLORES_DIM[i];
                  return (
                    <g key={d.dimension} onClick={() => setDimSel(i)} style={{ cursor: 'pointer' }}>
                      <line
                        x1="180"
                        y1="160"
                        x2={nx}
                        y2={ny}
                        stroke={act ? col : 'rgba(255,255,255,0.18)'}
                        strokeWidth={act ? 2.2 : 1}
                      />
                      <circle
                        cx={nx}
                        cy={ny}
                        r={act ? 28 : 23}
                        fill="#0c1117"
                        stroke={col}
                        strokeWidth={act ? 2.4 : 1.2}
                      />
                      <text x={nx} y={ny - 2} textAnchor="middle" fill="#fff" fontSize="8.8" fontWeight="600">
                        {d.dimension.split(' ')[0]}
                      </text>
                      <text x={nx} y={ny + 9} textAnchor="middle" fill="rgba(244,241,236,0.7)" fontSize="7.5" fontFamily="IBM Plex Mono">
                        0{i + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div className="space-y-2.5">
                {DIMENSIONES_MEMORIA.map((d, i) => (
                  <div
                    key={d.dimension}
                    onClick={() => setDimSel(i)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition ${
                      dimSel === i ? 'border-white/35 bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <BarraSimple
                      etiqueta={`0${i + 1} · Memoria ${d.dimension.toLowerCase()}`}
                      valor={PESOS_DIM[i]}
                      color={COLORES_DIM[i]}
                      sufijo="% prioridad territorial"
                    />
                  </div>
                ))}
              </div>

              <div className="tc-vidrio p-4">
                <div className="tc-etiqueta" style={{ color: COLORES_DIM[dimSel] }}>
                  Dimensión 0{dimSel + 1} · {DIMENSIONES_MEMORIA[dimSel].dimension}
                </div>
                <p className="text-sm text-white/90 mt-1 leading-relaxed">
                  {DIMENSIONES_MEMORIA[dimSel].enfoque}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 tc-regla text-xs">
                  <div>
                    <span className="text-white/50 block">Instrumentos</span>
                    <span className="text-white/85">{DIMENSIONES_MEMORIA[dimSel].instrumentos}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Producto directo</span>
                    <span className="text-white/85">{DIMENSIONES_MEMORIA[dimSel].producto}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BloqueVisual>

        {/* 03 · El ciclo metodológico de 6 momentos */}
        <BloqueVisual
          num="03 · Ciclo metodológico (Devolver · validar · transformar)"
          titulo="Seis momentos iterativos que cierran la brecha entre investigar y habitar."
          subtitulo="Cada semestre universitario atraviesa este flujo con puntos de control ético obligatorios y entregables que quedan instalados en Bocachica."
        >
          <div className="space-y-5">
            <svg viewBox="0 0 760 135" className="w-full h-auto">
              {CICLO_METODOLOGICO.map((m, i) => {
                const x = 65 + i * 126;
                const y = 62;
                const act = cicloSel === i;
                return (
                  <g key={m.paso} onClick={() => setCicloSel(i)} style={{ cursor: 'pointer' }}>
                    {i < CICLO_METODOLOGICO.length - 1 && (
                      <g>
                        <line x1={x + 34} y1={y} x2={x + 92} y2={y} stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                        <circle r="3" fill="#e0917a">
                          <animate
                            attributeName="cx"
                            from={x + 34}
                            to={x + 92}
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                          <animate attributeName="cy" values={`${y};${y}`} dur="1.8s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={act ? 34 : 29}
                      fill={act ? '#241512' : '#0b1015'}
                      stroke={act ? '#e0917a' : 'rgba(255,255,255,0.28)'}
                      strokeWidth={act ? 2.4 : 1.2}
                    />
                    <text x={x} y={y - 5} textAnchor="middle" fill="#e0917a" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                      0{m.paso}
                    </text>
                    <text x={x} y={y + 10} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
                      {m.nombre.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
              {/* Arco de retorno del paso 6 al paso 1 */}
              <path
                d="M 695 96 Q 380 136 65 96"
                fill="none"
                stroke="rgba(110,198,230,0.45)"
                strokeWidth="1.3"
                strokeDasharray="4 4"
              />
              <text x="380" y="128" textAnchor="middle" fill="#6ec6e6" fontSize="9.5" fontFamily="IBM Plex Mono">
                ↺ Retroalimentación continua semestral (Devolver · validar · transformar)
              </text>
            </svg>

            <div className="tc-vidrio p-5 grid md:grid-cols-3 gap-4 items-center">
              <div>
                <div className="tc-etiqueta !text-[#e0917a]">Momento 0{CICLO_METODOLOGICO[cicloSel].paso}</div>
                <div className="text-xl font-semibold text-white mt-1">{CICLO_METODOLOGICO[cicloSel].nombre}</div>
              </div>
              <div>
                <div className="tc-etiqueta mb-1">Acción en campo</div>
                <p className="text-xs text-white/80 leading-relaxed">{CICLO_METODOLOGICO[cicloSel].descripcion}</p>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="tc-etiqueta !text-[#35d08a] mb-1">Evidencia verificable</div>
                <p className="text-xs text-white/85 leading-relaxed">{CICLO_METODOLOGICO[cicloSel].entregable}</p>
              </div>
            </div>
          </div>
        </BloqueVisual>
      </div>
    </section>
  );
}

// =============================================================================
// 05B · ESQUEMA EN PLANTA DE BOCACHICA Y LOS 6 PILOTOS (Idéntico a Plan.jsx)
// =============================================================================
function EsquemaAulaSVG({ filtro, setFiltro }) {
  const mostrar = (k) => filtro === 'todos' || filtro === k;

  return (
    <svg viewBox="0 0 820 520" className="w-full h-auto block select-none">
      <defs>
        <pattern id="agua-patron-aula" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 0 9 Q 4.5 6 9 9 T 18 9" fill="none" stroke="rgba(110,198,230,0.12)" strokeWidth="1" />
        </pattern>
        <pattern id="trama-verde-aula" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="#35d08a" strokeWidth="1.4" strokeOpacity="0.32" />
        </pattern>
      </defs>

      {/* Fondo de mar (Canal de Bocachica y Bahía de Cartagena) */}
      <rect x="0" y="0" width="820" height="520" fill="#071018" />
      <rect x="0" y="0" width="820" height="520" fill="url(#agua-patron-aula)" />

      {/* Silueta esquemática del extremo sur de Tierra Bomba (Bocachica) */}
      <path
        d="M 180 20 L 680 20 L 720 140 L 660 280 L 580 390 L 420 430 L 290 465 L 185 435 L 155 340 L 210 230 L 160 120 Z"
        fill="#0f1822"
        stroke="rgba(244,241,236,0.22)"
        strokeWidth="1.5"
      />
      {/* Curvas topográficas suaves (Cerro del Ángel San Rafael y meseta de Bocachica) */}
      <ellipse cx="470" cy="210" rx="165" ry="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
      <ellipse cx="485" cy="195" rx="95" ry="62" fill="none" stroke="rgba(255,255,255,0.09)" strokeDasharray="3 5" />

      {/* Manglar y corredor bioclimático (9.3) */}
      {mostrar('verde') && (
        <g>
          <ellipse cx="615" cy="215" rx="78" ry="110" fill="url(#trama-verde-aula)" stroke="#35d08a" strokeWidth="1.6" strokeDasharray="5 4" />
          <path d="M 615 215 Q 520 215 430 225" fill="none" stroke="#35d08a" strokeWidth="3" strokeDasharray="6 4" />
          <text x="615" y="195" textAnchor="middle" fill="#a8f0c6" fontSize="11" fontWeight="600">Manglar y Vivero (9.3)</text>
          <text x="615" y="212" textAnchor="middle" fill="rgba(244,241,236,0.75)" fontSize="9.5" fontFamily="IBM Plex Mono">Silvicultura comunitaria</text>
        </g>
      )}

      {/* Cuenca y red de aljibes / agua (9.2) */}
      {mostrar('agua') && (
        <g>
          <path d="M 485 185 Q 430 225 345 285 T 255 355" fill="none" stroke="#6ec6e6" strokeWidth="3" strokeDasharray="8 5" />
          <circle cx="315" cy="315" r="34" fill="rgba(110,198,230,0.16)" stroke="#6ec6e6" strokeWidth="1.8" />
          <text x="315" y="312" textAnchor="middle" fill="#bfe9ff" fontSize="10.5" fontWeight="600">Aljibes y Pozos (9.2)</text>
          <text x="315" y="326" textAnchor="middle" fill="rgba(244,241,236,0.75)" fontSize="9" fontFamily="IBM Plex Mono">Cosecha pluvial + biofiltro</text>
        </g>
      )}

      {/* Ruta circular de residuos (9.4) y Carpintería de ribera (9.5) */}
      {mostrar('oficios') && (
        <g>
          <path d="M 220 155 Q 310 175 415 215" fill="none" stroke="#f5b45a" strokeWidth="2.4" strokeDasharray="4 4" />
          <circle cx="220" cy="155" r="30" fill="rgba(232,168,107,0.16)" stroke="#e8a86b" strokeWidth="1.8" />
          <text x="220" y="152" textAnchor="middle" fill="#f7d49e" fontSize="10.5" fontWeight="600">Ribera y Mar (9.5)</text>
          <text x="220" y="166" textAnchor="middle" fill="rgba(244,241,236,0.75)" fontSize="8.8" fontFamily="IBM Plex Mono">Astilleros y pesca</text>

          <rect x="345" y="135" width="110" height="44" rx="6" fill="rgba(245,180,90,0.15)" stroke="#f5b45a" strokeWidth="1.6" />
          <text x="400" y="155" textAnchor="middle" fill="#ffe1a8" fontSize="10.5" fontWeight="600">Taller Plástico (9.4)</text>
          <text x="400" y="169" textAnchor="middle" fill="rgba(244,241,236,0.75)" fontSize="8.8" fontFamily="IBM Plex Mono">Acopio y extrusión</text>
        </g>
      )}

      {/* Doble recorrido patrimonial y fuertes (9.6) */}
      {mostrar('patrimonio') && (
        <g>
          <path d="M 145 455 L 235 430 L 365 265 L 485 185" fill="none" stroke="#e0917a" strokeWidth="2.5" />
          <circle cx="235" cy="430" r="24" fill="rgba(224,145,122,0.22)" stroke="#e0917a" strokeWidth="2" />
          <text x="235" y="400" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600">Fuerte San Fernando</text>

          <circle cx="145" cy="455" r="20" fill="rgba(196,144,255,0.2)" stroke="#c490ff" strokeWidth="1.8" />
          <text x="145" y="486" textAnchor="middle" fill="#e5d0ff" fontSize="10" fontWeight="600">Batería San José (Canal)</text>

          <circle cx="495" cy="185" r="22" fill="rgba(224,145,122,0.2)" stroke="#e0917a" strokeWidth="1.8" />
          <text x="495" y="156" textAnchor="middle" fill="#ffd2c4" fontSize="10" fontWeight="600">Batería Ángel San Rafael</text>
        </g>
      )}

      {/* Casco urbano y Nodo Central R9: Gimnasio Cristiano de Bocachica */}
      {mostrar('escuela') && (
        <g>
          <circle cx="365" cy="265" r="46" fill="rgba(224,145,122,0.12)" stroke="rgba(244,241,236,0.35)" strokeDasharray="3 3" />
          <text x="365" y="294" textAnchor="middle" fill="rgba(244,241,236,0.85)" fontSize="10" fontFamily="IBM Plex Mono">
            Casco Urbano Bocachica (9.1)
          </text>

          <g transform="translate(425,232)">
            <rect x="-58" y="-26" width="116" height="52" rx="6" fill="rgba(53,208,138,0.24)" stroke="#35d08a" strokeWidth="2.2" />
            <text x="0" y="-4" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="700">
              Gimnasio Cristiano (R9)
            </text>
            <text x="0" y="12" textAnchor="middle" fill="#a8f0c6" fontSize="9.2" fontFamily="IBM Plex Mono">
              Refugio climático + Aljibe + Aula
            </text>
          </g>
        </g>
      )}

      {/* Norte y escala gráfica (idéntico a Plan.jsx) */}
      <g transform="translate(765, 52)">
        <circle r="20" fill="rgba(5,8,12,0.75)" stroke="rgba(255,255,255,0.22)" />
        <polygon points="0,-13 -5,7 0,3 5,7" fill="#f4f1ec" />
        <text y="33" textAnchor="middle" fill="rgba(244,241,236,0.7)" fontSize="9.5" fontFamily="IBM Plex Mono">N</text>
      </g>
      <g transform="translate(36, 488)">
        <line x1="0" y1="0" x2="110" y2="0" stroke="#f4f1ec" strokeWidth="2" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#f4f1ec" strokeWidth="2" />
        <line x1="110" y1="-4" x2="110" y2="4" stroke="#f4f1ec" strokeWidth="2" />
        <text x="55" y="-7" textAnchor="middle" fill="rgba(244,241,236,0.8)" fontSize="10" fontFamily="IBM Plex Mono">≈ 250 m</text>
      </g>
    </svg>
  );
}

function SeccionEsquemaAula() {
  const [filtro, setFiltro] = useState('todos');
  const FILTROS = [
    { id: 'todos', nombre: 'Todos los sistemas' },
    { id: 'escuela', nombre: 'Nodo Escolar R9 + Casco (9.1)' },
    { id: 'agua', nombre: 'Agua y Aljibes (9.2)' },
    { id: 'verde', nombre: 'Silvicultura y Manglar (9.3)' },
    { id: 'oficios', nombre: 'Plástico y Ribera (9.4–9.5)' },
    { id: 'patrimonio', nombre: 'Circuito Patrimonial (9.6)' },
  ];

  return (
    <section className="relative z-10 bg-black px-6 md:px-16 py-24 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="tc-etiqueta">05 · Esquema en planta y proyectos piloto</div>
          <h2 className="text-3xl md:text-5xl font-semibold mt-2 leading-[1.05] text-white">
            Cómo se articulan las seis líneas alrededor del Gimnasio Cristiano de Bocachica (R9).
          </h2>
          <p className="text-white/75 mt-4 text-base leading-relaxed">
            En lugar de intervenciones aisladas, el programa conecta el nodo escolar (<span className="tc-num text-white">R9</span>) con el casco histórico, los aljibes comunitarios, el vivero de manglar, los talleres de plástico y carpintería de ribera y las tres fortificaciones del canal.
          </p>
        </div>

        <div className="mt-8 tc-vidrio p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="tc-etiqueta">Esquema territorial de Bocachica · Filtra por piloto</div>
            <div className="flex flex-wrap gap-1.5">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltro(f.id)}
                  className={`tc-ficha ${filtro === f.id ? 'tc-ficha-activa' : ''}`}
                >
                  {f.nombre}
                </button>
              ))}
            </div>
          </div>
          <EsquemaAulaSVG filtro={filtro} setFiltro={setFiltro} />
        </div>

        {/* Simulador Before/After del Colegio R9 */}
        <SimuladorAntesDespuesR9 />

        {/* 6 Tarjetas de los Pilotos con formato .tc-regla (idéntico a CRITERIOS en Plan.jsx) */}
        <div className="mt-16 pt-12 tc-regla">
          <div className="tc-etiqueta">Seis proyectos piloto articulados (Sección 9 del documento)</div>
          <div className="grid md:grid-cols-3 gap-6 mt-5">
            {LINEAS_INVESTIGACION.map((l) => (
              <div key={l.id} className="pt-4 tc-regla">
                <div className="flex items-center justify-between text-xs">
                  <span className="tc-num text-[#e0917a] font-semibold">Línea {l.id}</span>
                  <span className="text-white/45 font-mono">{l.piloto.titulo.split(' ')[0]}</span>
                </div>
                <div className="text-lg font-semibold mt-1 text-white">{l.titulo}</div>
                <p className="text-xs text-white/75 mt-1.5 leading-relaxed">{l.piloto.alcance}</p>
                <div className="mt-2.5 text-[11px] font-mono text-[#6ec6e6]">
                  → {l.productos[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 06 · HOJA DE RUTA 24 MESES Y RED DE 15 ACTORES (Estilo Social.jsx, cero tablas)
// =============================================================================
function SeccionHojaDeRutaYGobernanza() {
  const [mesActivo, setMesActivo] = useState(6);
  const [actorSel, setActorSel] = useState(0);

  const faseActual = FASES_24_MESES.find((f) => {
    if (f.id === 'F0') return mesActivo === 0;
    const mMatch = f.meses.match(/(\d+)\D+(\d+)/);
    if (!mMatch) return false;
    const m0 = Number(mMatch[1]);
    const m1 = Number(mMatch[2]);
    return mesActivo >= m0 && mesActivo <= m1;
  }) || FASES_24_MESES[1];

  return (
    <section id="cap-06" className="relative z-10 bg-black px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="tc-etiqueta">06 · Hoja de ruta a 24 meses, productos y gobernanza</div>
          <h2 className="text-3xl md:text-5xl font-semibold mt-2 leading-[1.05] text-white">
            Cuatro semestres académicos, nueve productos verificables y quince actores en red.
          </h2>
          <p className="text-white/75 mt-4 text-base leading-relaxed">
            Desliza el horizonte temporal de <span className="tc-num text-white">0 a 24 meses</span> para inspeccionar qué ocurre en cada fase (<span className="tc-num text-white">F0–F6</span>), cuáles productos (<span className="tc-num text-white">P1–P9</span>) se entregan y cómo se gobierna el programa.
          </p>
        </div>

        {/* 01 · Línea de tiempo interactiva de 24 meses (estilo Calendario de Social.jsx) */}
        <BloqueVisual
          num="01 · Cronograma de 24 meses (F0–F6)"
          titulo="Continuidad intersemestral sin empezar de cero cada semestre."
          subtitulo="Mueve el control de meses o haz clic en una fase para ver sus actividades, el producto que deja instalado y su punto de control ético."
        >
          <div className="space-y-6">
            <div className="tc-vidrio p-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="tc-etiqueta">Horizonte del programa (24 meses)</span>
                <span className="tc-num text-2xl font-semibold text-[#e0917a]">
                  {mesActivo === 0 ? 'Aprestamiento (Mes 0)' : `Mes ${mesActivo} de 24`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={mesActivo}
                onChange={(e) => setMesActivo(Number(e.target.value))}
                className="tc-slider"
                aria-label="Mes del programa"
              />
              <div className="grid grid-cols-7 gap-1.5 mt-4">
                {FASES_24_MESES.map((f) => {
                  const act = faseActual.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        if (f.id === 'F0') setMesActivo(0);
                        else {
                          const m = f.meses.match(/(\d+)/);
                          if (m) setMesActivo(Number(m[1]));
                        }
                      }}
                      className={`p-2 rounded text-left border transition ${
                        act
                          ? 'bg-[#e0917a]/20 border-[#e0917a] text-white'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="tc-num text-xs font-semibold">{f.id}</div>
                      <div className="text-[10px] font-mono opacity-75 truncate">{f.meses}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 tc-regla grid md:grid-cols-3 gap-4">
                <div>
                  <div className="tc-etiqueta !text-[#e0917a]">{faseActual.id} · {faseActual.meses}</div>
                  <div className="text-lg font-semibold text-white mt-1">{faseActual.nombre}</div>
                </div>
                <div>
                  <div className="tc-etiqueta mb-1">Actividades principales</div>
                  <p className="text-xs text-white/80 leading-relaxed">{faseActual.actividades}</p>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <div className="tc-etiqueta !text-[#35d08a] mb-1">Hito y control ético</div>
                  <p className="text-xs text-white/90 font-medium">{faseActual.hito}</p>
                  <p className="text-[11px] text-white/65 mt-1">{faseActual.controlEtico}</p>
                </div>
              </div>
            </div>

            {/* Productos P1-P9 como matriz visual de tarjetas compactas */}
            <div>
              <div className="tc-etiqueta mb-3">Nueve productos verificables del programa (P1–P9)</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {PRODUCTOS_ESPERADOS.map((p) => (
                  <div key={p.codigo} className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/25 transition">
                    <div className="flex items-center justify-between">
                      <span className="tc-num text-xs font-semibold text-[#6ec6e6]">{p.codigo}</span>
                      <span className="text-[10px] font-mono text-white/50">{p.linea}</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 leading-snug">{p.producto}</div>
                    <div className="text-[11px] text-white/65 mt-1">{p.formato}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BloqueVisual>

        {/* 02 · Constelación interactiva de los 15 Actores y Gobernanza */}
        <BloqueVisual
          num="02 · Red de 15 actores y gobernanza compartida"
          titulo="Comunidad, escuela, universidad, gremios y aliados científicos."
          subtitulo="Haz clic en cualquier actor de la constelación para inspeccionar su rol, su contribución y cómo participa en el Comité Coordinador y la Mesa Comunitaria."
        >
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 tc-vidrio p-4">
              <svg viewBox="0 0 560 360" className="w-full h-auto select-none">
                <circle cx="280" cy="180" r="138" fill="none" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 5" />
                <circle cx="280" cy="180" r="78" fill="none" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 4" />
                <circle cx="280" cy="180" r="28" fill="#1d1210" stroke="#e0917a" strokeWidth="2" />
                <text x="280" y="177" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700">Mesa Local</text>
                <text x="280" y="189" textAnchor="middle" fill="#e0917a" fontSize="8" fontFamily="IBM Plex Mono">Bocachica</text>

                {ACTORES_GOBERNANZA.map((a, i) => {
                  const anilloInterior = i < 6;
                  const r = anilloInterior ? 82 : 142;
                  const totalAnillo = anilloInterior ? 6 : ACTORES_GOBERNANZA.length - 6;
                  const idxAnillo = anilloInterior ? i : i - 6;
                  const ang = (idxAnillo / totalAnillo) * Math.PI * 2 - Math.PI / 2;
                  const nx = 280 + Math.cos(ang) * r;
                  const ny = 180 + Math.sin(ang) * r;
                  const act = actorSel === i;
                  const col = a.tipo.includes('Comunidad') || a.tipo.includes('Nodo')
                    ? '#35d08a'
                    : a.tipo.includes('PUJ')
                      ? '#6ec6e6'
                      : '#f5b45a';
                  return (
                    <g key={a.actor} onClick={() => setActorSel(i)} style={{ cursor: 'pointer' }}>
                      <line
                        x1="280"
                        y1="180"
                        x2={nx}
                        y2={ny}
                        stroke={act ? col : 'rgba(255,255,255,0.14)'}
                        strokeWidth={act ? 2 : 0.9}
                      />
                      <circle
                        cx={nx}
                        cy={ny}
                        r={act ? 16 : 12}
                        fill="#0b1015"
                        stroke={col}
                        strokeWidth={act ? 2.4 : 1.3}
                      />
                      <text x={nx} y={ny + 3} textAnchor="middle" fill="#fff" fontSize="8" fontFamily="IBM Plex Mono">
                        {i + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="tc-vidrio p-5">
                <div className="tc-etiqueta !text-[#35d08a]">
                  Actor {actorSel + 1} de {ACTORES_GOBERNANZA.length} · {ACTORES_GOBERNANZA[actorSel].tipo}
                </div>
                <h4 className="text-xl font-semibold text-white mt-1">{ACTORES_GOBERNANZA[actorSel].actor}</h4>
                <div className="mt-3 pt-3 tc-regla text-xs space-y-2">
                  <div>
                    <span className="text-white/50 block">Rol en el programa</span>
                    <span className="text-white/90">{ACTORES_GOBERNANZA[actorSel].rol}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Líneas vinculadas</span>
                    <span className="text-[#6ec6e6] font-mono">{ACTORES_GOBERNANZA[actorSel].lineas}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="tc-etiqueta">Principios éticos innegociables</div>
                {PRINCIPIOS_ETICOS.slice(0, 4).map((p) => (
                  <BarraSimple
                    key={p.principio}
                    etiqueta={`${p.principio} — ${p.mecanismo}`}
                    valor={100}
                    color="#e0917a"
                    sufijo="% exigible"
                  />
                ))}
              </div>
            </div>
          </div>
        </BloqueVisual>
      </div>
    </section>
  );
}

// =============================================================================
// CONTROLES DE VISTA 3D, ÍNDICE LATERAL Y CABECERA (Idénticos a Relato.jsx)
// =============================================================================
function ControlesVista({ libre, onToggleLibre, oculto, onToggleOculto, onZoom, onReset }) {
  return (
    <div className="fixed z-20 top-16 right-4 md:right-8 flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggleLibre}
        className={`tc-vidrio px-3 py-1.5 text-xs font-medium transition ${
          libre ? '!bg-[#e0917a]/25 !border-[#e0917a] text-white' : 'text-white/80 hover:text-white'
        }`}
      >
        {libre ? '✓ Explorando el mapa 3D (Salir)' : 'Explorar el mapa 3D'}
      </button>
      <button
        type="button"
        onClick={onToggleOculto}
        className="tc-vidrio px-2.5 py-1.5 text-xs text-white/75 hover:text-white"
        title={oculto ? 'Mostrar panel' : 'Ocultar panel para ver la isla'}
      >
        {oculto ? 'Mostrar panel' : 'Ocultar panel'}
      </button>
      <div className="hidden sm:flex items-center tc-vidrio px-1 py-0.5 text-xs">
        <button type="button" onClick={() => onZoom(0.78)} className="px-2 py-1 text-white/80 hover:text-white" title="Acercar">+</button>
        <button type="button" onClick={() => onZoom(1.28)} className="px-2 py-1 text-white/80 hover:text-white" title="Alejar">−</button>
        <button type="button" onClick={onReset} className="px-2 py-1 text-white/70 hover:text-white" title="Restablecer vista">⟲</button>
      </div>
    </div>
  );
}

function IndiceLateral({ total, activo, onIr }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onIr(i)}
          aria-label={`Paso 3D ${i + 1}`}
          className={`w-1.5 rounded-full transition-all ${
            i === activo ? 'h-7 bg-[#e0917a]' : 'h-2 bg-white/30 hover:bg-white/60'
          }`}
        />
      ))}
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL: AULA AMBIENTAL BOCACHICA
// =============================================================================
export default function AulaAmbientalBocachica({
  onBack,
  onBackToPortada,
  onSelectProject,
  onNavigateModule,
}) {
  const volverFn = onBack || onBackToPortada;
  const navegarFn = onSelectProject || onNavigateModule;
  const rootRef = useRef(null);
  const mount3DRef = useRef(null);
  const [escena, setEscena] = useState(null);
  const [progreso, setProgreso] = useState({ p: 0, texto: 'Iniciando escena 3D de Tierra Bomba' });
  const [capActual, setCapActual] = useState(CAPITULOS[0]);
  const [enVistaAula, setEnVistaAula] = useState(true);
  const [enPasos3D, setEnPasos3D] = useState(false);
  const [pasoIdx, setPasoIdx] = useState(0);
  const [pasoProg, setPasoProg] = useState(0);
  const [lentePaso, setLentePaso] = useState('resumen'); // 'resumen' | 'piloto' | 'producto'
  const [libre, setLibre] = useState(false);
  const [panelOculto, setPanelOculto] = useState(false);
  const [animPausada, setAnimPausada] = useState(false);
  const [tour3DActivo, setTour3DActivo] = useState(false);

  const secLineasRef = useRef(null);
  const secGemeloRef = useRef(null);
  const secPilotoR9Ref = useRef(null);

  // Inicializar escena 3D
  useEffect(() => {
    let viva = true;
    let inst = null;
    if (!mount3DRef.current) return undefined;
    crearEscenaAula(mount3DRef.current, {
      onProgreso: (p, texto) => { if (viva) setProgreso({ p, texto }); },
    }).then((s) => {
      if (!viva) { s?.dispose(); return; }
      inst = s;
      setEscena(s);
    }).catch((err) => {
      console.error(err);
      if (viva) setProgreso({ p: 1, texto: 'Modo interactivo listo' });
    });
    return () => {
      viva = false;
      inst?.dispose();
    };
  }, []);

  // Control de cámara y pasos por scroll
  useEffect(() => {
    let raf = 0;
    const evaluarScroll = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const mid = vh * 0.45;

      if (rootRef.current) {
        const rr = rootRef.current.getBoundingClientRect();
        setEnVistaAula(rr.top <= vh * 0.35);
      }

      // Detectar capítulo activo para la píldora superior
      let cap = CAPITULOS[0];
      for (const c of CAPITULOS) {
        const el = document.getElementById(c.ancla);
        if (el && el.getBoundingClientRect().top <= mid) cap = c;
      }
      setCapActual(cap);

      // Evaluar si estamos dentro de alguno de los 3 tramos de scrollytelling 3D:
      // Tramo A: secLineasRef (pasos 0..5, 6 pasos)
      // Tramo B: secGemeloRef (pasos 6..10, 5 pasos)
      // Tramo C: secPilotoR9Ref (pasos 11..13, 3 pasos)
      const tramos = [
        { ref: secLineasRef, offset: 0, count: 6 },
        { ref: secGemeloRef, offset: 6, count: 5 },
        { ref: secPilotoR9Ref, offset: 11, count: 3 },
      ];

      let hallado = null;
      for (const tr of tramos) {
        const el = tr.ref.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= vh * 0.45 && r.bottom >= vh * 0.55) {
          const pasoPx = (ALTO_PASO / 100) * vh;
          const raw = Math.max(0, -r.top / pasoPx);
          const localIdx = Math.min(tr.count - 1, Math.floor(raw));
          hallado = {
            idx: tr.offset + localIdx,
            prog: Math.max(0, Math.min(1, raw - localIdx)),
          };
          break;
        }
      }

      if (hallado) {
        setEnPasos3D(true);
        setPasoIdx(hallado.idx);
        setPasoProg(hallado.prog);
        const p = PASOS_3D[hallado.idx];
        escena?.set({
          cam: p.cam,
          dim: 0,
          zonas: p.zonas,
          rutas: p.rutas,
          nodosActivos: p.nodosActivos,
          lluvia: p.lluvia,
          cartografia: p.cartografia,
          gemelo: p.gemelo,
        });
      } else {
        setEnPasos3D(false);
        setLibre(false);
        if (cap.id === '00') {
          escena?.set({
            cam: 'hero',
            dim: 0,
            zonas: [0.45, 0.45, 0.45],
            rutas: { agua: 0.3, verde: 0.3, residuos: 0, oficios: 0, patrimonio: 0.4 },
            nodosActivos: ['casco', 'escuelaR9', 'sanFernando'],
            lluvia: 0,
            cartografia: 0,
            gemelo: 0,
          });
        } else {
          escena?.set({
            cam: 'problema',
            dim: 0.72,
            lluvia: 0,
            gemelo: 0,
          });
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(evaluarScroll); };
    evaluarScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [escena]);

  // Interacción directa con el mapa 3D cuando `libre` está activo
  useEffect(() => {
    const el = mount3DRef.current;
    if (!el || !escena || !libre) return undefined;
    let drag = null;
    const down = (e) => {
      drag = { x: e.clientX, y: e.clientY, mover: e.button === 2 || e.shiftKey };
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (drag.mover) escena.vista.mover(dx, dy);
      else escena.vista.rotar(dx, dy);
    };
    const up = () => { drag = null; };
    const wheel = (e) => {
      e.preventDefault();
      escena.vista.zoom(Math.exp(e.deltaY * 0.0012));
    };
    const ctx = (e) => e.preventDefault();
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('contextmenu', ctx);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('contextmenu', ctx);
    };
  }, [escena, libre]);

  const irACapitulo = (ancla) => {
    const el = document.getElementById(ancla);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const irAPaso3D = (idx) => {
    const vh = window.innerHeight || 1;
    const pasoPx = (ALTO_PASO / 100) * vh;
    let targetEl = secLineasRef.current;
    let localIdx = idx;
    if (idx >= 11) {
      targetEl = secPilotoR9Ref.current;
      localIdx = idx - 11;
    } else if (idx >= 6) {
      targetEl = secGemeloRef.current;
      localIdx = idx - 6;
    }
    if (!targetEl) return;
    const topDoc = targetEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: topDoc + localIdx * pasoPx + 12, behavior: 'smooth' });
  };

  // Tour 3D automático cuando el usuario activa "▶ Tour 3D"
  useEffect(() => {
    if (!tour3DActivo || animPausada || !enPasos3D) return undefined;
    const id = setInterval(() => {
      const sig = (pasoIdx + 1) % PASOS_3D.length;
      irAPaso3D(sig);
    }, 5200);
    return () => clearInterval(id);
  }, [tour3DActivo, animPausada, enPasos3D, pasoIdx]);

  const pasoActual = PASOS_3D[pasoIdx] || PASOS_3D[0];

  return (
    <div
      id="aula-ambiental-bocachica"
      ref={rootRef}
      className={`tc-aula relative min-h-screen text-[#f4f1ec] select-none ${animPausada ? 'tc-anim-pausada' : ''}`}
    >
      {/* BARRA SUPERIOR DE PROGRESO DE LECTURA (Scroll-Driven Animation en el compositor) */}
      {enVistaAula && (
        <div className="fixed top-0 inset-x-0 h-1 z-40 bg-white/5 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-[#e0917a] via-[#35d08a] to-[#6ec6e6] tc-barra-lectura" />
        </div>
      )}
      {/* ESCENA 3D FIJA A PANTALLA COMPLETA (Idéntica a App.jsx en tesis_tercer_corte) */}
      <div
        ref={mount3DRef}
        className={`fixed inset-0 z-0 transition-opacity duration-500 ${
          enVistaAula ? 'opacity-100' : 'opacity-0'
        } ${libre && enPasos3D ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      />

      {/* INDICADOR DE CARGA */}
      {enVistaAula && progreso.p < 1 && (
        <div className="fixed bottom-6 right-8 z-50 tc-vidrio px-4 py-3 w-64 pointer-events-none">
          <div className="flex justify-between text-xs text-white/80">
            <span>{progreso.texto}</span>
            <span className="tc-num">{Math.round(progreso.p * 100)} %</span>
          </div>
          <div className="h-1 bg-white/10 rounded mt-2 overflow-hidden">
            <div className="h-full bg-[#e0917a] transition-all duration-200" style={{ width: `${ Math.round(progreso.p * 100) }%` }} />
          </div>
        </div>
      )}

      {/* CABECERA FLOTANTE (Idéntica a Cabecera en Relato.jsx) */}
      {enVistaAula && (
      <header className="fixed top-4 inset-x-0 z-30 px-4 md:px-8 flex items-center justify-between gap-2 pointer-events-none">
        <div className="tc-vidrio px-3.5 py-2 flex items-center gap-2.5 pointer-events-auto">
          {volverFn && (
            <button
              type="button"
              onClick={volverFn}
              className="text-xs font-mono text-[#e0917a] hover:underline pr-2 border-r border-white/15"
            >
              ← Comunidad
            </button>
          )}
          <span className="w-2 h-2 rounded-full bg-[#e0917a]" />
          <span className="text-xs font-medium tracking-wide">Tierra Bomba · Bocachica</span>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5 tc-vidrio px-1.5 py-1 !rounded-full pointer-events-auto">
          {CAPITULOS.map((c) => {
            const act = capActual.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => irACapitulo(c.ancla)}
                className={`tc-nav-cap ${act ? 'tc-nav-cap-activo' : ''}`}
              >
                <span className="tc-num text-[10px] opacity-60 mr-1">{c.id}</span>
                <span>{c.nombre}</span>
              </button>
            );
          })}
        </nav>

        <div className="tc-vidrio px-3 py-1.5 text-xs text-white/75 hidden sm:flex items-center gap-2.5 pointer-events-auto">
          <div>
            <span className="tc-num text-white font-semibold">{capActual.id}</span>
            <span className="mx-1.5 text-white/30">·</span>
            <span>{capActual.nombre}</span>
          </div>
          <button
            type="button"
            onClick={() => setAnimPausada((v) => !v)}
            className="px-2 py-0.5 rounded border border-white/15 text-[11px] text-white/80 hover:text-white hover:border-white/35 transition"
            title="Pausar o reanudar animaciones (Accesibilidad WCAG 2.2.2)"
          >
            {animPausada ? '▶ Animar' : '⏸ Pausar'}
          </button>
        </div>
      </header>
      )}

      {/* CONTROLES DE MAPA 3D + ÍNDICE LATERAL + PANEL FLOTANTE .tc-vidrio EN CAPÍTULOS 3D */}
      {enPasos3D && (
        <>
          <ControlesVista
            libre={libre}
            onToggleLibre={() => setLibre((v) => !v)}
            oculto={panelOculto}
            onToggleOculto={() => setPanelOculto((v) => !v)}
            onZoom={(f) => escena?.vista.zoom(f)}
            onReset={() => escena?.vista.reset()}
          />
          <IndiceLateral total={PASOS_3D.length} activo={pasoIdx} onIr={irAPaso3D} />

          {!panelOculto && (
            <aside
              key={pasoActual.id}
              className="fixed z-20 bottom-4 inset-x-4 md:inset-x-auto md:bottom-6 md:left-8 md:w-[26.5rem] tc-vidrio p-5 pointer-events-auto tc-hud-enter tc-paso-anim"
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="tc-etiqueta !text-[#e0917a]">{pasoActual.grupo}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTour3DActivo((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                      tour3DActivo
                        ? 'bg-[#35d08a]/25 border-[#35d08a] text-white'
                        : 'border-white/20 text-white/75 hover:text-white'
                    }`}
                  >
                    {tour3DActivo ? '⏸ Pausar tour 3D' : '▶ Tour 3D auto'}
                  </button>
                  <span className="tc-num font-mono">{pasoActual.pasoGrupo}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-1.5 leading-snug">
                {pasoActual.titulo}
              </h3>

              <div className="mt-3 pt-3 tc-regla flex items-baseline justify-between gap-3">
                <div className="tc-num text-3xl md:text-4xl font-semibold text-white">
                  {pasoActual.cifra}
                </div>
                <div className="text-[11px] text-white/65 text-right leading-tight max-w-[11rem]">
                  {pasoActual.subCifra}
                </div>
              </div>

              {/* Pestañas interactivas dentro de la tarjeta flotante */}
              <div className="flex gap-1.5 mt-3 pt-3 tc-regla">
                {[
                  { id: 'resumen', label: 'Diagnóstico' },
                  { id: 'piloto', label: 'Piloto en Bocachica' },
                  { id: 'producto', label: 'Entregable' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLentePaso(tab.id)}
                    className={`tc-ficha ${lentePaso === tab.id ? 'tc-ficha-activa' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-white/85 mt-3 leading-relaxed min-h-[3.6rem]">
                {lentePaso === 'resumen' && pasoActual.resumen}
                {lentePaso === 'piloto' && pasoActual.piloto}
                {lentePaso === 'producto' && pasoActual.producto}
              </p>

              {/* Controles rápidos de navegación de pasos y progreso */}
              <div className="mt-3 pt-2.5 tc-regla flex items-center justify-between text-xs text-white/65">
                <button
                  type="button"
                  disabled={pasoIdx === 0}
                  onClick={() => irAPaso3D(Math.max(0, pasoIdx - 1))}
                  className="hover:text-white disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <span className="tc-num text-[11px]">Paso 3D {pasoIdx + 1} / {PASOS_3D.length}</span>
                <button
                  type="button"
                  disabled={pasoIdx === PASOS_3D.length - 1}
                  onClick={() => irAPaso3D(Math.min(PASOS_3D.length - 1, pasoIdx + 1))}
                  className="hover:text-white disabled:opacity-30"
                >
                  Siguiente →
                </button>
              </div>
              <div className="h-0.5 bg-white/10 rounded mt-2 overflow-hidden">
                <div className="h-full bg-[#e0917a]" style={{ width: `${Math.round(pasoProg * 100)}%` }} />
              </div>
            </aside>
          )}
        </>
      )}

      {/* =====================================================================
          00 · PORTADA A PANTALLA COMPLETA SOBRE LA ISLA 3D
      ===================================================================== */}
      <section id="cap-00" className="relative z-10 h-[100svh] flex items-end px-6 md:px-16 pb-12 md:pb-16 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="relative w-full grid md:grid-cols-12 gap-6 items-end pointer-events-auto">
          <div className="md:col-span-8">
            <div className="tc-etiqueta mb-3">
              Cartagena de Indias · Isla de Tierra Bomba · Bocachica · Programa marco v0.1
            </div>
            <h1 className="text-[clamp(3.2rem,12vw,9.8rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-white">
              Aula Ambiental
            </h1>
            <div className="tc-trazo mt-6" />
          </div>
          <div className="md:col-span-4 md:pb-2 text-white/85">
            <p className="text-base md:text-lg leading-snug">
              Memorias territoriales, planificación y diseño sostenible en Bocachica: seis líneas de investigación, seis pilotos y un gemelo digital progresivo.
            </p>
            <div className="mt-5 pt-4 tc-regla flex items-center justify-between text-xs text-white/65">
              <span>Arq. Alejandro Serrano Sierra · PUJ</span>
              <span className="animate-pulse text-[#e0917a]">Desplázate ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01 · EL PROBLEMA (ScrollWords + Red Conceptual Progresiva)
      ===================================================================== */}
      <section id="cap-01" className="relative z-10">
        <div className="min-h-[130svh] flex items-center px-6 md:px-16 py-28 bg-black/50">
          <div className="max-w-5xl mx-auto">
            <div className="tc-etiqueta mb-6">01 · El problema y la pregunta central</div>
            <ScrollWords
              text="En Bocachica convergen una riqueza histórica, cultural y ecológica extraordinaria con vulnerabilidades críticas en agua, confort térmico escolar, residuos, erosión costera y fragilidad de los oficios del mar — mientras los estudios académicos previos permanecían dispersos y sin retorno a la comunidad."
              className="text-3xl md:text-5xl font-semibold leading-[1.12] tracking-[-0.025em]"
            />
            <div className="mt-10 pt-6 tc-regla grid sm:grid-cols-2 gap-6 text-sm text-white/80 max-w-3xl">
              <div>
                <div className="tc-etiqueta !text-[#e0917a] mb-1">La pregunta orientadora</div>
                ¿Cómo articular las memorias territoriales, los saberes locales y las capacidades interdisciplinarias de la Javeriana y sus aliados para co-diseñar en Bocachica un Aula Ambiental viva que mejore el hábitat y fortalezca la gobernanza local?
              </div>
              <div>
                <div className="tc-etiqueta !text-[#35d08a] mb-1">El principio rector</div>
                <strong className="text-white">Devolver, validar y transformar:</strong> ningún dato se levanta en Bocachica sin regresar traducido en cartografía abierta, material pedagógico para la escuela (<span className="tc-num text-white">R9</span>) y pilotos demostrativos.
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-16 py-24 md:py-32 bg-black/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* NUEVO: Explicación animada en 4 pasos fáciles de entender */}
            <SimuladorAulaEn4Pasos animPausada={animPausada} />

            <div>
              <div className="max-w-2xl mb-10">
                <div className="tc-etiqueta">Red interactiva de problemas y soluciones en Bocachica</div>
                <h2 className="text-3xl md:text-4xl font-semibold mt-2 leading-tight text-white">
                  Un sistema socioecológico donde memoria, agua, escuela y oficios son inseparables.
                </h2>
                <p className="text-white/70 text-sm mt-3">
                  Recorre la red paso a paso con el botón <span className="text-white font-medium">Revelar siguiente relación</span> o haz clic en cada nodo para ver cómo el Aula Ambiental articula las brechas del territorio.
                </p>
              </div>
              <RedProblemaAula />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02 · LO QUE DICEN LOS ANTECEDENTES (R1-R9) Y LAS MEMORIAS
      ===================================================================== */}
      <SeccionMemoriasYBase />

      {/* =====================================================================
          03 · LAS 6 LÍNEAS EN EL TERRITORIO (Scrollytelling 3D: 6 pasos × 95svh)
      ===================================================================== */}
      <section
        id="cap-03"
        ref={secLineasRef}
        style={{ height: `${6 * ALTO_PASO}svh` }}
        className="relative z-10 pointer-events-none"
        aria-label="Recorrido 3D por las 6 líneas de investigación en Bocachica"
      />

      {/* =====================================================================
          04 · GEMELO DIGITAL PROGRESIVO EN 3D (Scrollytelling 3D: 5 pasos × 95svh)
      ===================================================================== */}
      <section
        id="cap-04"
        ref={secGemeloRef}
        style={{ height: `${5 * ALTO_PASO}svh` }}
        className="relative z-10 pointer-events-none"
        aria-label="Recorrido 3D por los 5 niveles del Gemelo Digital de Bocachica"
      />

      {/* =====================================================================
          05 · PROYECTO PILOTO R9 EN 3D (3 pasos × 95svh) + ESQUEMA EN PLANTA
      ===================================================================== */}
      <section
        id="cap-05"
        ref={secPilotoR9Ref}
        style={{ height: `${3 * ALTO_PASO}svh` }}
        className="relative z-10 pointer-events-none"
        aria-label="Recorrido 3D por el Gimnasio Cristiano de Bocachica R9"
      />
      <SeccionEsquemaAula />

      {/* =====================================================================
          06 · HOJA DE RUTA DE 24 MESES Y RED DE 15 ACTORES
      ===================================================================== */}
      <SeccionHojaDeRutaYGobernanza />

      {/* =====================================================================
          07 · CIERRE (Idéntico a Cierre en Relato.jsx)
      ===================================================================== */}
      <footer id="cap-07" className="relative z-10 bg-[#05080b] px-6 md:px-16 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="tc-etiqueta">07 · Síntesis ejecutiva</div>
          <h2 className="text-3xl md:text-5xl font-semibold mt-2 leading-tight max-w-3xl text-white">
            Diez decisiones que convierten la investigación en infraestructura viva para Bocachica.
          </h2>

          <ol className="mt-10 grid md:grid-cols-2 gap-6 text-sm">
            {SINTESIS_EJECUTIVA_10.map((s) => (
              <li key={s.n} className="pt-4 tc-regla">
                <div className="tc-num text-[#e0917a] text-xs font-semibold">0{s.n}</div>
                <div className="text-white font-medium mt-1">{s.titulo}</div>
                <p className="text-white/70 mt-1 leading-relaxed">{s.texto}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 pt-6 tc-regla text-xs text-white/70 leading-relaxed space-y-2 border-l border-white/25 pl-4">
            <div className="text-white/90 font-semibold uppercase tracking-wider text-[11px]">
              Alcance del programa marco (versión 0.1 · Octubre de 2026)
            </div>
            <p>
              Este programa articula docencia, investigación y proyección social entre la Pontificia Universidad Javeriana, el Gimnasio Cristiano de Bocachica (<span className="tc-num text-white">R9</span>), organizaciones comunitarias de Bocachica y aliados técnicos (<span className="tc-num text-white">ACOPI, Verde que te Quiero Verde, Jardín Botánico de Cartagena, Universidad de Lleida</span>). Todas las intervenciones físicas requieren validación previa de la Mesa Comunitaria Local.
            </p>
          </div>

          <details className="mt-8 pt-6 tc-regla text-xs text-white/65 leading-relaxed group">
            <summary className="cursor-pointer select-none text-white/85 font-semibold uppercase tracking-wider text-[11px] flex items-center justify-between py-1 hover:text-white">
              <span>Corpus documental de referencia (R1–R9)</span>
              <span className="text-white/50 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {ANTECEDENTES_CORPUS.map((r) => (
                <div key={r.id}>
                  <span className="tc-num text-[#e0917a] font-semibold mr-1.5">{r.id}</span>
                  <span className="text-white font-medium">{r.titulo}</span>
                  <span className="block text-white/50">{r.autores} ({r.anio}) · {r.institucion}</span>
                </div>
              ))}
            </div>
          </details>

          {/* Navegación de retorno a los otros módulos de #/comunidad sin borrar nada */}
          {(volverFn || navegarFn) && (
            <div className="mt-12 pt-8 tc-regla flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-white/60">
                Continúa explorando los demás capítulos de <span className="text-white font-medium">Tierra Bomba · Comunidad</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {volverFn && (
                  <button
                    type="button"
                    onClick={volverFn}
                    className="tc-ficha tc-ficha-activa !text-white !border-[#e0917a]"
                  >
                    ← Volver a la portada de Comunidad
                  </button>
                )}
                {navegarFn && (
                  <>
                    <button type="button" onClick={() => navegarFn('resumen')} className="tc-ficha">
                      00 · Isla de Tierra Bomba
                    </button>
                    <button type="button" onClick={() => navegarFn('territorio')} className="tc-ficha">
                      01 · Erosión costera 3D
                    </button>
                    <button type="button" onClick={() => navegarFn('3dviewer')} className="tc-ficha">
                      04 · Territorio en 3D
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 tc-regla flex flex-wrap justify-between gap-4 text-xs text-white/50">
            <span>Tierra Bomba · Aula Ambiental (Bocachica) · Promotor académico: Arq. Alejandro Serrano Sierra</span>
            <span>Pontificia Universidad Javeriana · Facultad de Arquitectura y Diseño</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
