import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Landmark,
  Hammer,
  Calendar,
  Gamepad2,
  Search,
  Trees,
  CloudRain,
  Home,
  Hand,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Award,
  Layers,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  Utensils,
  Sparkles,
  Clock,
  Recycle,
  Sprout,
  BookOpen,
  Shield,
  Anchor,
  ExternalLink,
  Flame,
  Fish,
  Navigation,
} from 'lucide-react';
import { MenuComunidad } from './ComunidadFacil';
import './comunidad-facil.css';
import { crearEscenaAula } from '../utils/escenaAulaBocachica';
import { crearReproductorComunidad, PISTAS_MEMORIA } from '../utils/musicaComunidad';
import { Escena3DBailarCartagenero } from './Juegos3DComunidad';

/** Card interactiva que se ilumina suavemente donde pasa el cursor */
function CardIluminada({ children, color = '#e8a86b', className = '', onClick }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        backgroundImage: pos.on
          ? `radial-gradient(240px circle at ${pos.x}% ${pos.y}%, ${color}33, transparent 70%)`
          : undefined,
        borderColor: pos.on ? color : undefined,
        boxShadow: pos.on ? `0 12px 34px -8px ${color}45` : undefined,
      }}
      className={`transition-all duration-200 hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

function JuegoCocinarMojarra({ onCerrar, onInicio }) {
  const contenido = (
    <div className="fixed inset-0 z-[120] bg-[#1a110b] flex flex-col">
      <iframe
        src={`${import.meta.env.BASE_URL}la-mojarra-dorada/index.html`}
        title="La Mojarra Dorada — Mojarra frita de Bocachica"
        className="w-full h-full border-0 flex-1"
        allow="autoplay"
      />
      {onInicio && <button type="button" onClick={onInicio} className="fixed bottom-4 right-4 z-[130] px-4 py-2 rounded-full bg-black/80 text-white border border-white/25 text-xs flex items-center gap-2"><Home size={14}/>Inicio</button>}
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="fixed bottom-4 left-4 z-[130] px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/25 shadow-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Comida</span>
        </button>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(contenido, document.body) : contenido;
}

function JuegoPailaDulce({ onCerrar, onInicio }) {
  const contenido = (
    <div className="fixed inset-0 z-[120] bg-[#1a110b] flex flex-col">
      <iframe
        src={`${import.meta.env.BASE_URL}la-paila-dulce/index.html`}
        title="La Paila Dulce — Haz tu cocada"
        className="w-full h-full border-0 flex-1"
        allow="autoplay"
      />
      {onInicio && <button type="button" onClick={onInicio} className="fixed bottom-4 right-4 z-[130] px-4 py-2 rounded-full bg-black/80 text-white border border-white/25 text-xs flex items-center gap-2"><Home size={14}/>Inicio</button>}
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="fixed bottom-4 left-4 z-[130] px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/25 shadow-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Comida</span>
        </button>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(contenido, document.body) : contenido;
}

function JuegoBailarCartagenero({ item, color = '#35d08a', sonando, onToggleMusica }) {
  const esMapale = item?.id === 'mapale_cumbia';
  const pasos = esMapale
    ? [
        { id: 0, titulo: '1. Paso deslizado', clave: 'Desliza el pie derecho al compás', frase: '¡Eche, suelta la cadera y desliza suave con el tambor!' },
        { id: 1, titulo: '2. Cortejo con sombrero', clave: 'Levanta el sombrero vueltiao y gira', frase: '¡Con elegancia, alza el sombrero y rodea la rueda!' },
        { id: 2, titulo: '3. Repique de hombros', clave: 'Sacude hombros y pecho rápido', frase: '¡Acelera el tambor alegre! ¡Hombros arriba y abajo!' },
        { id: 3, titulo: '4. Remate de Mapalé', clave: 'Salto corto y brazos en alto', frase: '¡Esooo! ¡Así se remata en Bocachica, pura sabrosura!' },
      ]
    : [
        { id: 0, titulo: '1. Entrar a la rueda', clave: 'Marca el pulso con palmas', frase: '¡Bienvenido a la rueda! Escucha el llamado de la cantadora.' },
        { id: 1, titulo: '2. Paso sereno', clave: 'Cadera firme al tambor llamador', frase: '¡Espalda derechita, paso corto y con mucha calma!' },
        { id: 2, titulo: '3. Diálogo con tambor', clave: 'Abre brazos y responde al repique', frase: '¡Respóndele al tambor alegre con el cuerpo, mi llave!' },
        { id: 3, titulo: '4. Venia y saludo', clave: 'Saludo al tamborero y cierre', frase: '¡Maestría total! Ya tienes el alma del Bullerengue sentao.' },
      ];

  const [pasoIdx, setPasoIdx] = useState(0);
  const [beatPos, setBeatPos] = useState(50);
  const [puntos, setPuntos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(pasos[0].frase);
  const [animPose, setAnimPose] = useState(0);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    setPasoIdx(0);
    setPuntos(0);
    setCombo(0);
    setAnimPose(0);
    setTerminado(false);
    setFeedback(pasos[0].frase);
  }, [item?.id]);

  useEffect(() => {
    if (terminado) return undefined;
    let t = 0;
    const speed = esMapale ? 0.095 : 0.068;
    const id = setInterval(() => {
      t += speed;
      setBeatPos(50 + 44 * Math.sin(t));
    }, 30);
    return () => clearInterval(id);
  }, [terminado, esMapale]);

  const ejecutarPaso = (idx) => {
    if (idx !== pasoIdx || terminado) return;
    const enZonaVerde = beatPos >= 32 && beatPos <= 68;
    const ganoPts = enZonaVerde ? 30 : 15;
    setPuntos((p) => p + ganoPts);
    setCombo((c) => (enZonaVerde ? c + 1 : 0));
    setAnimPose(idx);
    if (pasoIdx >= pasos.length - 1) {
      setTerminado(true);
      setFeedback(
        enZonaVerde
          ? '¡Qué nivel, compadre! Bailaste todo el set al ritmo exacto de Cartagena.'
          : '¡Completado! Sigue practicando en la franja verde para clavar el repique.'
      );
    } else {
      const sig = pasoIdx + 1;
      setPasoIdx(sig);
      setFeedback(
        enZonaVerde
          ? `¡En el punto! ${pasos[sig].frase}`
          : `¡Bien! ${pasos[sig].frase}`
      );
    }
  };

  const reiniciar = () => {
    setPasoIdx(0);
    setPuntos(0);
    setCombo(0);
    setAnimPose(0);
    setTerminado(false);
    setFeedback(pasos[0].frase);
  };

  const cuerpoShiftX = animPose === 0 ? -6 : animPose === 1 ? 6 : animPose === 2 ? -4 : 0;
  const cuerpoShiftY = animPose === 3 ? -12 : animPose === 2 ? -4 : 0;
  const brazoIzqRot = animPose === 1 ? -48 : animPose === 2 ? -25 : animPose === 3 ? -65 : -10;
  const brazoDerRot = animPose === 1 ? 45 : animPose === 2 ? 25 : animPose === 3 ? 65 : 12;

  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-4 md:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}25`, color }}>
            <Music className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color }}>
              Juego virtual · Maestro Cartagenero en vivo
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-white">
              Aprende a bailar {esMapale ? 'Mapalé y Cumbia' : 'Bullerengue'} paso a paso
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMusica}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              sonando ? 'bg-[#35d08a] text-[#07140d]' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {sonando ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{sonando ? 'Pausar tambor' : 'Poner música'}</span>
          </button>
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-extrabold text-white">
            {puntos} pts {combo > 1 ? `· x${combo}` : ''}
          </span>
          <button
            type="button"
            onClick={reiniciar}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
            title="Reiniciar baile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-7 space-y-2.5">
          <div className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white font-semibold text-center">
            &ldquo;{feedback}&rdquo;
          </div>

          <Escena3DBailarCartagenero
            esMapale={esMapale}
            animPose={animPose}
            combo={combo}
            terminado={terminado}
            sonando={sonando}
          />

          {!terminado && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-white/70">
                <span>Pulso del tambor</span>
                <span style={{ color }}>Toca el paso cuando entre al centro verde</span>
              </div>
              <div className="relative h-3.5 rounded-full bg-white/10 border border-white/15 overflow-hidden">
                <div className="absolute inset-y-0 bg-[#35d08a]/35 border-x border-[#35d08a]" style={{ left: '32%', width: '36%' }} />
                <div
                  className="absolute top-0.5 bottom-0.5 w-3 -ml-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]"
                  style={{ left: `${beatPos}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5 space-y-2.5">
          <div className="text-xs font-bold text-white">Sigue al maestro en orden (1 → 4)</div>
          {pasos.map((p) => {
            const completado = terminado || p.id < pasoIdx;
            const actual = !terminado && p.id === pasoIdx;
            return (
              <button
                key={p.id}
                type="button"
                disabled={!actual}
                onClick={() => ejecutarPaso(p.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                  completado
                    ? 'bg-[#35d08a]/15 border-[#35d08a]/60 text-[#9ff3c9]'
                    : actual
                      ? 'bg-white text-[#0b1016] border-white shadow-xl scale-[1.02] cursor-pointer'
                      : 'bg-white/5 border-white/10 text-white/45 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold">{p.titulo}</div>
                  <div className={`text-[11px] ${actual ? 'text-[#0b1016]/75 font-semibold' : 'text-white/60'}`}>
                    {p.clave}
                  </div>
                </div>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  completado ? 'bg-[#35d08a] text-[#0b1016]' : actual ? 'bg-[#0b1016] text-white' : 'bg-white/10 text-white/30'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}

          {terminado && (
            <button
              type="button"
              onClick={reiniciar}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-[#0b1016] cursor-pointer shadow-lg transition hover:scale-[1.01]"
              style={{ backgroundColor: color }}
            >
              Bailar otra ronda con el profe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
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
  { id: '01', nombre: '¿Qué pasa hoy?', ancla: 'cap-01' },
  { id: '02', nombre: 'Nuestras memorias', ancla: 'cap-02' },
  { id: '03', nombre: '6 Soluciones 3D', ancla: 'cap-03' },
  { id: '04', nombre: 'Mapa vivo 3D', ancla: 'cap-04' },
  { id: '05', nombre: 'El Colegio', ancla: 'cap-05' },
  { id: '06', nombre: 'Plan 2 años', ancla: 'cap-06' },
  { id: '07', nombre: 'Resumen', ancla: 'cap-07' },
];

// Pasos 3D continuos sobre la isla (Capítulos 01 al 06 — explicados en lenguaje claro para la comunidad)
const PASOS_3D = [
  // --- CAP 01: ¿QUÉ PASA HOY EN BOCACHICA? (índices 0..1) ---
  {
    id: 'p01',
    capId: '01',
    grupo: '01 · Los 4 Corregimientos de Tierra Bomba',
    pasoGrupo: '01 / 02',
    titulo: 'Toda la isla en planta: Bocachica, Tierra Bomba, Caño de Loro y Punta Arena',
    cam: 'isla_completa',
    zonas: [0.55, 0.2, 0.2],
    rutas: { agua: 0, verde: 0.2, residuos: 0, oficios: 0.2, patrimonio: 0.2 },
    nodosActivos: ['casco', 'tierraBomba', 'canoDeLoro', 'puntaArena'],
    lluvia: 0,
    cartografia: 0.32,
    gemelo: 0,
    cifra: '4 corregimientos',
    subCifra: 'Bocachica · Tierra Bomba · Caño de Loro · Punta Arena',
    resumen: 'Al desplazarte ves toda la isla de Tierra Bomba con sus cuatro corregimientos iluminados. Desde aquí puedes explorar el patrimonio, los talleres, el colegio y el manglar.',
    piloto: 'Conectar los cuatro corregimientos alrededor del Gimnasio Cristiano de Bocachica como aula abierta para toda la isla.',
    producto: 'Un mapa vivo donde la comunidad ubica sus corregimientos, caminos y proyectos.',
    interactivo: 'simulador4pasos',
  },
  {
    id: 'p02',
    capId: '01',
    grupo: '01 · Nuestro compromiso con la comunidad',
    pasoGrupo: '02 / 02',
    titulo: 'Todo lo que se investigue debe volver convertido en algo útil para el barrio',
    cam: 'bocachica_general',
    zonas: [0.75, 0.75, 0.75],
    rutas: { agua: 0.8, verde: 0.8, residuos: 0.8, oficios: 0.8, patrimonio: 0.8 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '100 % para el barrio',
    subCifra: 'Nada se hace sin el visto bueno y la participación de la gente de Bocachica',
    resumen: 'Antes venían universidades, tomaban fotos o datos y se iban. Aquí la regla es clara: cada estudio regresa como mapas fáciles de leer, materiales para el colegio y obras reales.',
    piloto: 'Una mesa comunitaria local que aprueba y vigila cada paso del proyecto desde el colegio.',
    producto: 'Acuerdo comunitario y red de trabajo entre barrio, escuela y universidad.',
    interactivo: 'redProblema',
  },

  // --- CAP 02: ESTUDIOS ANTERIORES Y MEMORIAS DEL PUEBLO (índices 2..3) ---
  {
    id: 'm01',
    capId: '02',
    grupo: '02 · Trabajos anteriores reunidos',
    pasoGrupo: '01 / 02',
    titulo: 'Reunimos 9 estudios ya hechos sobre Bocachica para no empezar de cero',
    cam: 'memorias_r9',
    zonas: [0.85, 0.55, 0.45],
    rutas: { agua: 0.4, verde: 0.6, residuos: 0, oficios: 0.5, patrimonio: 0.8 },
    nodosActivos: ['casco', 'escuelaR9', 'sanFernando', 'ribera'],
    lluvia: 0,
    cartografia: 0.2,
    gemelo: 0,
    cifra: '9 estudios (R1–R9)',
    subCifra: 'Toca los botones R1 a R9 abajo para ver qué aportó cada trabajo al barrio',
    resumen: 'Ya existían 9 investigaciones valiosas sobre Bocachica (sobre sus fuertes, el agua, las playas y el colegio), pero estaban regadas. Ahora todas quedan juntas y al servicio del pueblo.',
    piloto: 'Un archivo abierto en el colegio donde cualquier vecino o estudiante puede consultar esta información sin gastar datos de internet.',
    producto: 'Biblioteca digital y física de Bocachica en el Gimnasio Cristiano.',
    interactivo: 'corpusR9',
  },
  {
    id: 'm02',
    capId: '02',
    grupo: '02 · Los saberes de nuestros mayores',
    pasoGrupo: '02 / 02',
    titulo: 'La memoria del agua, las casas frescas, la pesca y los árboles',
    cam: 'linea_memoria',
    zonas: [0.95, 0.4, 0.6],
    rutas: { agua: 0.7, verde: 0.5, residuos: 0.3, oficios: 0.8, patrimonio: 0.9 },
    nodosActivos: ['casco', 'agua', 'vivero', 'ribera', 'sanRafael'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '6 saberes vivos',
    subCifra: 'Historia del barrio · casas · agua · oficios del mar · monte · comunidad',
    resumen: 'Nuestros abuelos sabían cómo mantener frescas las casas con techos altos y patios con árboles, y dónde recoger agua lluvia en aljibes. Ese conocimiento es la base de todo lo nuevo.',
    piloto: 'Caminatas y charlas con mayores, pescadores y jóvenes para dibujar juntos el mapa de recuerdos del pueblo.',
    producto: 'Libro y mapa ilustrado con las historias y lugares importantes de Bocachica.',
    interactivo: 'memorias6',
  },

  // --- CAP 03: LAS 6 SOLUCIONES EN EL MAPA DE BOCACHICA (índices 4..9) ---
  {
    id: 'l91',
    capId: '03',
    grupo: '03 · Solución 1 — Casas e historia del barrio',
    pasoGrupo: '01 / 06',
    titulo: 'Cuidar nuestras casas tradicionales y contar la historia del pueblo',
    cam: 'linea_memoria',
    zonas: [0.95, 0.15, 0.15],
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 0.45 },
    nodosActivos: ['casco', 'sanFernando', 'sanRafael'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '2.600 casas reales',
    subCifra: 'Cada casa del pueblo con sus techos frescos, ventanas y patios',
    resumen: 'Reconocemos cómo están construidas las casas reales de Bocachica (techos inclinados, ventanas para que entre la brisa, aleros para el sol) para no perder esa forma fresca y nuestra de vivir.',
    piloto: 'Guía sencilla para mejorar viviendas manteniendo la brisa y la sombra, más carteles con la historia de cada sector.',
    producto: 'Mapa de memorias del barrio y muestra cultural hecha con los estudiantes.',
  },
  {
    id: 'l92',
    capId: '03',
    grupo: '03 · Solución 2 — Agua limpia y lluvia',
    pasoGrupo: '02 / 06',
    titulo: 'Recoger el agua de lluvia y recuperar los aljibes y pozos',
    cam: 'linea_agua',
    zonas: [0.15, 0.2, 0.95],
    rutas: { agua: 1, verde: 0, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['agua', 'escuelaR9', 'casco'],
    lluvia: 0.85,
    cartografia: 0,
    gemelo: 0,
    cifra: '5 pasos del agua',
    subCifra: 'Recoger lluvia · guardar en aljibe · filtrar · usar · cuidar el agua',
    resumen: 'En lugar de perder el agua cuando llueve o pagar caro por pimpinas, aprendemos a recoger la lluvia en los techos, limpiarla con filtros naturales y cuidar los pozos del pueblo.',
    piloto: 'Instalación de un sistema real de recolección y filtrado de agua lluvia en el Gimnasio Cristiano.',
    producto: 'Agua más segura en el colegio y mapa comunitario de pozos y aljibes.',
  },
  {
    id: 'l93',
    capId: '03',
    grupo: '03 · Solución 3 — Árboles y sombra fresca',
    pasoGrupo: '03 / 06',
    titulo: 'Sembrar árboles nativos y manglar para bajar el calor del colegio',
    cam: 'linea_verde',
    zonas: [0.1, 0.98, 0.2],
    rutas: { agua: 0.3, verde: 1, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['vivero', 'escuelaR9', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '−4,5 °C menos',
    subCifra: 'Patios y caminos mucho más frescos gracias a la sombra de los árboles',
    resumen: 'Sembrar árboles del lugar y cuidar el manglar en la orilla protege el suelo de las olas y baja el calor en el patio del colegio para que los niños puedan jugar y estudiar cómodos.',
    piloto: 'Crear un vivero escolar donde niños y familias siembren árboles para el colegio y las calles del barrio.',
    producto: 'Vivero funcionando en el colegio y corredores con sombra hasta la orilla.',
  },
  {
    id: 'l94',
    capId: '03',
    grupo: '03 · Solución 4 — Plástico convertido en muebles',
    pasoGrupo: '04 / 06',
    titulo: 'Recoger el plástico de las playas y volverlo bancas para el barrio',
    cam: 'linea_residuos',
    zonas: [0.2, 0.25, 0.92],
    rutas: { agua: 0, verde: 0, residuos: 1, oficios: 0.4, patrimonio: 0 },
    nodosActivos: ['residuos', 'escuelaR9', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Basura → Muebles',
    subCifra: 'Recoger · separar · moler · moldear bancas y letreros útiles',
    resumen: 'El plástico que llega por el mar o se acumula en el pueblo deja de ser un problema de suciedad: se separa, se transforma y sirve para hacer bancas, mesas y letreros para el colegio.',
    piloto: 'Puntos limpios de recolección en el barrio y taller práctico de reciclaje de plástico.',
    producto: 'Bancas, mesas y señalización hechas con plástico reciclado de Bocachica.',
  },
  {
    id: 'l95',
    capId: '03',
    grupo: '03 · Solución 5 — Oficios del mar y botes',
    pasoGrupo: '05 / 06',
    titulo: 'Enseñar a los jóvenes la carpintería de botes y la pesca tradicional',
    cam: 'linea_oficios',
    zonas: [0.35, 0.15, 0.95],
    rutas: { agua: 0, verde: 0, residuos: 0.3, oficios: 1, patrimonio: 0 },
    nodosActivos: ['ribera', 'casco', 'sanFernando'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Oficio vivo',
    subCifra: 'Maestros carpinteros · reparación de lanchas · pesca artesanal',
    resumen: 'Si los mayores no enseñan cómo construir y reparar botes de madera, el oficio se pierde. Queremos apoyar a los maestros de ribera para que transmitan su arte a los jóvenes.',
    piloto: 'Escuela-taller en la bahía con los maestros carpinteros de ribera y pescadores del pueblo.',
    producto: 'Manual ilustrado de construcción de botes y fortalecimiento del taller local.',
  },
  {
    id: 'l96',
    capId: '03',
    grupo: '03 · Solución 6 — Fuertes y turismo justo',
    pasoGrupo: '06 / 06',
    titulo: 'Que el turismo conozca nuestra historia y beneficie al pueblo',
    cam: 'linea_patrimonio',
    zonas: [0.98, 0.2, 0.25],
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 1 },
    nodosActivos: ['sanFernando', 'sanJose', 'sanRafael', 'casco'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: '3 fuertes históricos',
    subCifra: 'San Fernando · San José · Ángel San Rafael unidos al pueblo',
    resumen: 'Hoy muchos turistas visitan los fuertes sin entrar al pueblo ni conocer su cultura afrodescendiente. Proponemos una ruta guiada por la gente local que conecte los fuertes con el barrio.',
    piloto: 'Dos recorridos: uno educativo para los niños del pueblo y otro turístico con guías locales y puntos con sombra.',
    producto: 'Ruta cultural señalizada y guion contado por habitantes de Bocachica.',
  },

  // --- CAP 04: MAPA VIVO 3D DEL PUEBLO (índices 10..14) ---
  {
    id: 'g01',
    capId: '04',
    grupo: '04 · Mapa vivo 3D — Paso 1',
    pasoGrupo: 'Paso 01 / 05',
    titulo: 'Guardar en un solo lugar las fotos, relatos y mapas del pueblo',
    cam: 'bocachica_general',
    zonas: [0.85, 0.35, 0.35],
    rutas: { agua: 0.2, verde: 0.2, residuos: 0.2, oficios: 0.2, patrimonio: 0.5 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Archivo del pueblo',
    subCifra: 'Historias de mayores · fotos antiguas · planos y estudios',
    resumen: 'Este mapa en 3D sirve como un baúl comunitario abierto donde cualquiera puede ver la historia de cada calle, cada pozo y cada lugar importante de Bocachica.',
    piloto: 'Consulta fácil desde celulares o en el computador del colegio sin necesidad de internet rápido.',
    producto: 'Archivo comunitario abierto y fácil de entender para todos.',
  },
  {
    id: 'g02',
    capId: '04',
    grupo: '04 · Mapa vivo 3D — Paso 2',
    pasoGrupo: 'Paso 02 / 05',
    titulo: 'Ver en el mapa dónde falta agua, dónde hay calor y dónde llega la basura',
    cam: 'bocachica_general',
    zonas: [0.65, 0.65, 0.65],
    rutas: { agua: 0.85, verde: 0.85, residuos: 0.6, oficios: 0.6, patrimonio: 0.85 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 1,
    gemelo: 0,
    cifra: '6 capas claras',
    subCifra: 'Relieve · agua · árboles · basuras · oficios · fuertes',
    resumen: 'Al prender estas capas de colores sobre la isla real, la comunidad puede señalar exactamente por dónde corre el agua cuando llueve, qué zonas necesitan más árboles y dónde limpiar.',
    piloto: 'Talleres con vecinos marcando sobre el mapa los puntos urgentes del barrio.',
    producto: 'Mapas sencillos para tomar decisiones y pedir apoyos ante la alcaldía.',
  },
  {
    id: 'g03',
    capId: '04',
    grupo: '04 · Mapa vivo 3D — Paso 3',
    pasoGrupo: 'Paso 03 / 05',
    titulo: 'Todas las casas y los árboles reales de Tierra Bomba en 3D',
    cam: 'linea_memoria',
    zonas: [0.45, 0.85, 0.45],
    rutas: { agua: 0.6, verde: 0.8, residuos: 0, oficios: 0, patrimonio: 0.6 },
    nodosActivos: ['casco', 'escuelaR9', 'agua', 'vivero'],
    lluvia: 0,
    cartografia: 0.25,
    gemelo: 0,
    cifra: 'Tamaño real',
    subCifra: '2.600 viviendas reales + vegetación real de toda la isla + el colegio',
    resumen: 'Aquí puedes reconocer tu cuadra, los árboles del manglar y el colegio a escala real. Así todos pueden opinar viendo el espacio tal como es antes de construir nada.',
    piloto: 'Usar esta maqueta 3D en las reuniones del colegio para que estudiantes y padres diseñen juntos.',
    producto: 'Maqueta 3D fiel de Bocachica y del Gimnasio Cristiano.',
  },
  {
    id: 'g04',
    capId: '04',
    grupo: '04 · Mapa vivo 3D — Paso 4',
    pasoGrupo: 'Paso 04 / 05',
    titulo: 'Probar las mejoras en el mapa antes de gastar recursos',
    cam: 'escuela_r9',
    zonas: [0.2, 0.95, 0.95],
    rutas: { agua: 1, verde: 1, residuos: 0.5, oficios: 0, patrimonio: 0 },
    nodosActivos: ['escuelaR9', 'agua', 'vivero'],
    lluvia: 1,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Antes y Después',
    subCifra: 'Compara el patio hoy bajo el sol vs. con techo de lluvia y árboles',
    resumen: 'Con el botón de abajo puedes comparar cómo está el colegio hoy y cómo mejora cuando se instala el techo recolector de lluvia, el tanque de agua y la sombra de los árboles.',
    piloto: 'Simulación para mostrar cuánta agua se ahorra y cuánto baja la temperatura en el patio.',
    producto: 'Comparador visual para decidir qué obra hacer primero.',
    interactivo: 'antesDespuesR9',
  },
  {
    id: 'g05',
    capId: '04',
    grupo: '04 · Mapa vivo 3D — Paso 5',
    pasoGrupo: 'Paso 05 / 05',
    titulo: 'Los jóvenes del colegio miden y actualizan el mapa cada 6 meses',
    cam: 'gemelo',
    zonas: [0.8, 0.8, 0.8],
    rutas: { agua: 0.9, verde: 0.9, residuos: 0.9, oficios: 0.9, patrimonio: 0.9 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0.3,
    gemelo: 1,
    cifra: 'Cada 6 meses',
    subCifra: 'Estudiantes y comité local miden lluvia, calor y árboles vivos',
    resumen: 'Este mapa no se queda quieto: cada semestre los estudiantes revisan cuánta agua lluvia se recogió, cuántos árboles crecieron y cuánto plástico se aprovechó.',
    piloto: 'Brigada ambiental escolar cuidando y midiendo los avances del barrio.',
    producto: 'Seguimiento continuo hecho por la misma comunidad.',
  },

  // --- CAP 05: EL COLEGIO COMO CORAZÓN DEL PROYECTO (índices 15..17) ---
  {
    id: 'r9_1',
    capId: '05',
    grupo: '05 · El Colegio — Gimnasio Cristiano de Bocachica',
    pasoGrupo: '01 / 03',
    titulo: 'El colegio se convierte en un lugar fresco, abierto y útil para todo el barrio',
    cam: 'escuela_cerca',
    zonas: [0.3, 0.98, 0.4],
    rutas: { agua: 0.5, verde: 1, residuos: 0.5, oficios: 0, patrimonio: 0.5 },
    nodosActivos: ['escuelaR9', 'casco', 'vivero'],
    lluvia: 0,
    cartografia: 0,
    gemelo: 0,
    cifra: 'Corazón del plan',
    subCifra: 'Salones ventilados · cancha con sombra · vivero y espacio de reunión',
    resumen: 'El Gimnasio Cristiano será el punto de encuentro del proyecto: tendrá salones más frescos, una cancha de preescolar protegida del sol, un vivero y un espacio redondo para reuniones del barrio.',
    piloto: 'Construcción por etapas junto con padres de familia, maestros y estudiantes de arquitectura.',
    producto: 'Un colegio mejorado que también sirve como centro ambiental de Bocachica.',
    interactivo: 'antesDespuesR9',
  },
  {
    id: 'r9_2',
    capId: '05',
    grupo: '05 · El Colegio — Agua de lluvia y frescura',
    pasoGrupo: '02 / 03',
    titulo: 'Techo en forma de V para recoger la lluvia y guardarla limpia en el aljibe',
    cam: 'escuela_r9',
    zonas: [0.15, 0.85, 1.0],
    rutas: { agua: 1, verde: 0.8, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: ['escuelaR9', 'agua'],
    lluvia: 1,
    cartografia: 0,
    gemelo: 0,
    cifra: '85 % lluvia útil',
    subCifra: 'El techo recoge el agua cuando llueve y la lleva al tanque filtrado',
    resumen: 'Cuando cae aguacero, el techo en V guía el agua directo al aljibe con filtros naturales para lavarse las manos y regar el vivero. En días secos, el doble techo deja pasar la brisa y quita el calor.',
    piloto: 'Sistema demostrativo de agua lluvia que también enseña a los niños cómo cuidar el agua.',
    producto: 'Agua almacenada en el colegio y patio más fresco todo el año.',
    interactivo: 'antesDespuesR9',
  },
  {
    id: 'r9_3',
    capId: '05',
    grupo: '05 · Del colegio hacia todo Bocachica',
    pasoGrupo: '03 / 03',
    titulo: 'Los 6 proyectos pequeños conectados por todo el pueblo',
    cam: 'bocachica_general',
    zonas: [0.9, 0.9, 0.9],
    rutas: { agua: 1, verde: 1, residuos: 1, oficios: 1, patrimonio: 1 },
    nodosActivos: null,
    lluvia: 0.35,
    cartografia: 0.2,
    gemelo: 0,
    cifra: '6 obras unidas',
    subCifra: 'Historias · Agua · Colegio · Plástico · Botes · Fuertes',
    resumen: 'Lo que empieza en el Gimnasio Cristiano se conecta por calles con sombra hasta los pozos, el manglar, el taller de plástico, los astilleros de botes y los fuertes.',
    piloto: 'Señalización clara y caminos sombreados para recorrer todo el circuito a pie.',
    producto: 'Una red completa de mejoras visibles en toda Bocachica.',
    interactivo: 'plano2D',
  },

  // --- CAP 06: PLAN A 2 AÑOS Y QUIÉNES PARTICIPAN (índices 18..19) ---
  {
    id: 'hr_1',
    capId: '06',
    grupo: '06 · Plan paso a paso en 2 años (24 meses)',
    pasoGrupo: '01 / 02',
    titulo: 'Cuatro semestres seguidos para que las obras no queden a medias',
    cam: 'hoja_ruta',
    zonas: [0.75, 0.85, 0.75],
    rutas: { agua: 0.9, verde: 0.9, residuos: 0.7, oficios: 0.7, patrimonio: 0.9 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0.15,
    gemelo: 0,
    cifra: '24 meses',
    subCifra: 'Mueve la barra de meses abajo para ver qué se hace en cada etapa',
    resumen: 'Para evitar que cada grupo que llega empiece desde cero, el trabajo se organiza en 2 años continuos: primero escuchar y acordar, luego hacer mapas, después construir prototipos y finalmente dejarlos en manos del pueblo.',
    piloto: 'Reuniones de revisión con la comunidad al cierre de cada semestre antes de pasar al siguiente paso.',
    producto: '9 resultados concretos entregados y funcionando en Bocachica.',
    interactivo: 'cronograma24m',
  },
  {
    id: 'hr_2',
    capId: '06',
    grupo: '06 · Quiénes deciden y trabajan juntos',
    pasoGrupo: '02 / 02',
    titulo: 'La comunidad manda, el colegio coordina y la universidad apoya',
    cam: 'isla',
    zonas: [0.85, 0.85, 0.85],
    rutas: { agua: 1, verde: 1, residuos: 1, oficios: 1, patrimonio: 1 },
    nodosActivos: null,
    lluvia: 0,
    cartografia: 0.35,
    gemelo: 0,
    cifra: '15 aliados unidos',
    subCifra: 'Líderes del barrio · Colegio · Pescadores · Javeriana · Jardín Botánico',
    resumen: 'Las decisiones se toman en una Mesa Comunitaria de Bocachica. El Gimnasio Cristiano es el punto de coordinación y varias facultades y fundaciones aportan su trabajo técnico y materiales.',
    piloto: 'Reglas claras de respeto: permiso previo de la comunidad, crédito a los sabedores locales y cuidado compartido.',
    producto: 'Un modelo de trabajo conjunto que puede servir de ejemplo para toda Tierra Bomba.',
    interactivo: 'actores15',
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
            {autoPlay && !animPausada ? 'â¸ Pausar animación' : 'â–¶ Reproducir animación'}
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
            <span>â—</span>
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
            â˜€ Hoy (Sin intervención)
          </button>
          <button
            type="button"
            onClick={() => setConProyecto(true)}
            className={`tc-ficha ${conProyecto ? 'tc-ficha-activa !border-[#35d08a] !text-white' : ''}`}
          >
            ðŸŒ³ Con Aula Ambiental (Piloto R9)
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
                Reiniciar recorrido â†º
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
    <div className="relative z-10 py-2">
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
                    <span>{d.id === 'R9' ? 'â˜… Gimnasio Cristiano' : d.temas.split(',')[0]}</span>
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
                â†º Retroalimentación continua semestral (Devolver · validar · transformar)
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
    </div>
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
        <text x="55" y="-7" textAnchor="middle" fill="rgba(244,241,236,0.8)" fontSize="10" fontFamily="IBM Plex Mono">â‰ˆ 250 m</text>
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
    <div className="relative z-10 py-2">
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
    </div>
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
    <div className="relative z-10 py-2">
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
    </div>
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
        {libre ? '✓ Dejar de mover el mapa' : 'Mover el mapa 3D'}
      </button>
      <button
        type="button"
        onClick={onToggleOculto}
        className="tc-vidrio px-2.5 py-1.5 text-xs text-white/75 hover:text-white"
        title={oculto ? 'Mostrar información' : 'Esconder texto para ver solo la isla'}
      >
        {oculto ? 'Ver texto' : 'Ver solo el mapa'}
      </button>
      <div className="hidden sm:flex items-center tc-vidrio px-1 py-0.5 text-xs">
        <button type="button" onClick={() => onZoom(0.78)} className="px-2 py-1 text-white/80 hover:text-white" title="Acercar">+</button>
        <button type="button" onClick={() => onZoom(1.28)} className="px-2 py-1 text-white/80 hover:text-white" title="Alejar">−</button>
        <button type="button" onClick={onReset} className="px-2 py-1 text-white/70 hover:text-white" title="Restablecer vista">âŸ²</button>
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
// ÍNDICE DE BÚSQUEDA Y MINI-JUEGO COMUNITARIO
// =============================================================================
const INDICE_BUSQUEDA = [
  { id: 'casco', tipo: 'lugar', nodo: 'casco', titulo: 'Bocachica (Corregimiento)', sub: '2.600 casas reales del corregimiento, calles e historias comunitarias', tags: 'casas corregimiento bocachica calles vecinos barrio' },
  { id: 'tierraBomba', tipo: 'lugar', nodo: 'tierraBomba', titulo: 'Tierra Bomba Centro (Corregimiento)', sub: 'Corregimiento en el norte de la isla conectado por mar y senderos', tags: 'tierra bomba centro norte corregimiento' },
  { id: 'canoDeLoro', tipo: 'lugar', nodo: 'canoDeLoro', titulo: 'Caño de Loro (Corregimiento)', sub: 'Corregimiento frente a la bahía con manglar y pesca artesanal', tags: 'cano de loro corregimiento bahia pesca manglar' },
  { id: 'puntaArena', tipo: 'lugar', nodo: 'puntaArena', titulo: 'Punta Arena (Corregimiento)', sub: 'Corregimiento en la punta noreste frente a Cartagena', tags: 'punta arena corregimiento playa cartagena' },
  { id: 'escuelaR9', tipo: 'lugar', nodo: 'escuelaR9', titulo: 'Colegio Gimnasio Cristiano (R9)', sub: 'Tanque de 45.000 L de agua lluvia, patio con sombra y aula viva', tags: 'colegio escuela r9 agua lluvia patio sombra estudiantes' },
  { id: 'vivero', tipo: 'lugar', nodo: 'vivero', titulo: 'Vivero y Manglar', sub: 'Siembra de manglar, almendros y bosque seco para bajar el calor (-4,5 °C)', tags: 'arboles vivero manglar sombra calor naturaleza bosque' },
  { id: 'agua', tipo: 'lugar', nodo: 'agua', titulo: 'Ruta del Agua Lluvia', sub: 'Cómo recoger, filtrar y guardar agua limpia en techos y tanques', tags: 'agua lluvia aljibe tanque beber filtro' },
  { id: 'ribera', tipo: 'lugar', nodo: 'ribera', titulo: 'Taller de Madera y Oficios', sub: 'Carpintería de ribera, construcción tradicional y empleo local', tags: 'madera carpinteria oficios trabajo taller construccion' },
  { id: 'residuos', tipo: 'lugar', nodo: 'residuos', titulo: 'Punto Limpio y Reciclaje', sub: 'Separación de plásticos, abono con residuos orgánicos y limpieza', tags: 'basura reciclaje plastico limpio abono compost' },
  { id: 'sanFernando', tipo: 'lugar', nodo: 'sanFernando', titulo: 'Fuerte de San Fernando', sub: 'Patrimonio de piedra coralina y memoria histórica frente al canal', tags: 'fuerte san fernando historia patrimonio turismo' },
  { id: 'sanRafael', tipo: 'lugar', nodo: 'sanRafael', titulo: 'Batería del Ángel San Rafael', sub: 'Mirador histórico en la loma y sendero ecológico', tags: 'fuerte san rafael loma mirador sendero' },
  { id: 'sanJose', tipo: 'lugar', nodo: 'sanJose', titulo: 'Batería de San José', sub: 'Fuerte sobre el arrecife en la entrada de la bahía', tags: 'fuerte san jose bahia mar arrecife' },
  { id: 'tool-4pasos', tipo: 'modal', modal: 'simulador4pasos', titulo: 'Ver dibujos explicativos en 4 pasos', sub: 'Cómo funciona el Aula Ambiental paso a paso', tags: 'dibujos explicacion pasos simulador entender' },
  { id: 'tool-r9', tipo: 'modal', modal: 'plano2D', titulo: 'Comparar el colegio: Hoy vs. Nuevo', sub: 'Mueve el control para ver el antes y después del Gimnasio Cristiano', tags: 'comparar antes despues plano colegio' },
  { id: 'tool-red', tipo: 'modal', modal: 'redProblema', titulo: 'Cómo se conectan los problemas y soluciones', sub: 'Mapa interactivo de temas de la isla', tags: 'problemas soluciones red mapa' },
  { id: 'tool-plan', tipo: 'modal', modal: 'hojaRuta', titulo: 'Plan a 2 años y quiénes participan', sub: 'Calendario de obra y actores de la comunidad', tags: 'plan calendario años actores comunidad' },
];

const PREGUNTAS_RETO = [
  {
    q: '¿Cuánta agua lluvia guardará el tanque nuevo del colegio Gimnasio Cristiano?',
    opciones: ['5.000 litros', '45.000 litros', '100 litros'],
    correcta: 1,
    nodo: 'escuelaR9',
    dato: '¡Exacto! 45.000 litros alcanzan para tener agua limpia en el colegio durante los meses secos.',
  },
  {
    q: '¿Cuánto puede bajar el calor en el patio escolar gracias a los árboles de sombra y el manglar?',
    opciones: ['Hasta -4,5 °C menos', 'Solo -0,2 °C', 'No cambia la temperatura'],
    correcta: 0,
    nodo: 'vivero',
    dato: '¡Muy bien! La sombra de los árboles y el viento fresco bajan hasta 4,5 °C el calor del suelo.',
  },
  {
    q: '¿Qué materiales locales usaremos para construir el Aula Ambiental?',
    opciones: ['Solo vidrio y acero importado', 'Madera, caña, palma y piedra coralina', 'Plástico reciclado únicamente'],
    correcta: 1,
    nodo: 'ribera',
    dato: '¡Correcto! Usamos los oficios de carpintería y materiales frescos de la región.',
  },
  {
    q: '¿Cuántos meses dura el plan completo junto a la comunidad?',
    opciones: ['3 meses', '24 meses (2 años)', '10 años'],
    correcta: 1,
    nodo: 'casco',
    dato: '¡Así es! Son 24 meses divididos en 4 etapas claras junto a vecinos, colegio y aliados.',
  },
];

const TEMAS_VIERNES_LISTA = [
  {
    id: 'plataforma',
    titulo: 'Cómo usar esta plataforma 3D de Tierra Bomba',
    sub: 'Aprende a moverte por los 4 corregimientos, fuertes y talleres',
    Icon: BookOpen,
    color: '#6ec6e6',
    lugar: 'Virtual en vivo · Todo el pueblo',
  },
  {
    id: 'bullerengue',
    titulo: 'Rueda de Bullerengue y bailes de patio',
    sub: 'Canto responsorial, tambor alegre y palmas con las mayores',
    Icon: Music,
    color: '#e0917a',
    lugar: 'Virtual y patio comunitario',
  },
  {
    id: 'isnelia',
    titulo: 'La cocina de Isnelia y dulces caseros',
    sub: 'Arroz con coco rallado en lata, caballito de papaya y corozo',
    Icon: Utensils,
    color: '#e8a86b',
    lugar: 'Junto al muelle flotante · Tierra Bomba',
  },
  {
    id: 'ribera',
    titulo: 'Carpintería de ribera y madera naval',
    sub: 'Oficio tradicional de embarcaciones y sombra de patio',
    Icon: Hammer,
    color: '#e8a86b',
    lugar: 'Taller de Ribera · Bocachica',
  },
  {
    id: 'vivero',
    titulo: 'Siembra de manglar y vivero comunitario',
    sub: 'Plástico reciclado, sombra y cuidado del agua lluvia',
    Icon: Sprout,
    color: '#35d08a',
    lugar: 'Vivero y Colegio R9',
  },
];

const TEMAS_VIERNES = TEMAS_VIERNES_LISTA.map((t) => t.titulo);

function obtenerProximoViernes() {
  const hoy = new Date();
  const diaSem = hoy.getDay(); // 5 = viernes
  const diff = (5 - diaSem + 7) % 7 || 7;
  const prox = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + diff);
  const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return {
    dia: String(prox.getDate()).padStart(2, '0'),
    mes: meses[prox.getMonth()],
    completo: `Viernes ${prox.getDate()} de ${meses[prox.getMonth()]} · 4:00 p.m.`,
  };
}

const ICONOS_CAT = {
  corregimientos: MapPin,
  patrimonio: Landmark,
  talleres: Hammer,
  memorias: Music,
};

const ICONOS_MEMORIA = {
  music: Music,
  utensils: Utensils,
  sparkles: Sparkles,
  disc: Disc3,
};

const EXPLORA_CATEGORIAS = [
  {
    id: 'corregimientos',
    ancla: 'sec-corregimientos',
    label: 'Pueblos',
    cta: 'Explorar los 4 corregimientos',
    color: '#e0917a',
    cam: 'isla_completa',
    nodos: [],
    rutas: { agua: 0, verde: 0.2, residuos: 0, oficios: 0.2, patrimonio: 0.2 },
    zonas: [0.55, 0.2, 0.2],
    resumen: 'Los 4 corregimientos de Tierra Bomba. Toca cualquiera para verlo de cerca.',
    lugares: [
      { nodo: 'casco', nombre: 'Bocachica', desc: 'Casco histórico, colegio y fuertes al sur.' },
      { nodo: 'tierraBomba', nombre: 'Tierra Bomba', desc: 'Corregimiento del norte y bosque seco.' },
      { nodo: 'canoDeLoro', nombre: 'Caño de Loro', desc: 'Corregimiento sobre la bahía y manglares.' },
      { nodo: 'puntaArena', nombre: 'Punta Arena', desc: 'Playas y turismo frente a Cartagena.' },
    ],
  },
  {
    id: 'patrimonio',
    ancla: 'sec-patrimonio',
    label: 'Historia y fuertes',
    cta: 'Descubrir fuertes',
    color: '#f4f1ec',
    cam: 'isla_completa',
    nodos: [],
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 1 },
    zonas: [0.95, 0.1, 0.1],
    resumen: 'Fuertes de piedra coralina e historia viva de nuestra isla.',
    lugares: [
      { nodo: 'sanFernando', nombre: 'Fuerte San Fernando', desc: 'Castillo histórico frente al canal.' },
      { nodo: 'sanRafael', nombre: 'Batería Ángel San Rafael', desc: 'Mirador en lo alto de la loma.' },
      { nodo: 'sanJose', nombre: 'Batería de San José', desc: 'Fuerte sobre el arrecife en la bahía.' },
      { nodo: 'casco', nombre: 'Casco Histórico', desc: 'Calles tradicionales de Bocachica.' },
    ],
  },
  {
    id: 'talleres',
    ancla: 'sec-talleres',
    label: 'Talleres',
    cta: 'Ver clases en la isla',
    color: '#e8a86b',
    cam: 'isla_completa',
    nodos: [],
    rutas: { agua: 0.3, verde: 0.4, residuos: 0.9, oficios: 1, patrimonio: 0 },
    zonas: [0.1, 0.4, 0.95],
    resumen: 'Toca un icono animado en la isla para descubrir la clase del viernes e inscribirte.',
    lugares: [
      { nodo: 'escuelaR9', nombre: 'Gimnasio Cristiano', desc: 'Cómo usar esta plataforma 3D.' },
      { nodo: 'ribera', nombre: 'Carpintería de Ribera', desc: 'Construcción de botes y madera.' },
      { nodo: 'vivero', nombre: 'Vivero Comunitario', desc: 'Siembra de manglar y frutales.' },
      { nodo: 'tierraBomba', nombre: 'Cocina de Doña Isnelia', desc: 'Dulces caseros y arroz con coco.' },
      { nodo: 'puntaArena', nombre: 'Rueda de Bullerengue', desc: 'Tambor alegre y bailes de patio.' },
    ],
  },
  {
    id: 'memorias',
    ancla: 'sec-memorias',
    label: 'Jugar',
    cta: 'Escuchar y bailar',
    color: '#35d08a',
    cam: 'escuela_r9',
    nodos: ['escuelaR9', 'vivero', 'casco'],
    rutas: { agua: 0.4, verde: 0.6, residuos: 0, oficios: 0.5, patrimonio: 0.8 },
    zonas: [0.35, 0.85, 0.75],
    resumen: 'Bailes tradicionales, música de tambor y memoria viva de Tierra Bomba.',
    lugares: [],
  },
];

// =============================================================================
// COMPONENTE PRINCIPAL: AULA AMBIENTAL BOCACHICA
// =============================================================================
export default function AulaAmbientalBocachica({
  onBack,
  onBackToPortada,
  accionInicial,
  onExplorarCanal,
  canalAbierto = false,
  enPortada = false,
  onSelectProject,
  onNavigateModule,
}) {
  const volverFn = onBack || onBackToPortada;
  const navegarFn = onSelectProject || onNavigateModule;
  const rootRef = useRef(null);
  const mount3DRef = useRef(null);
  const [escena, setEscena] = useState(null);
  const [sin3D, setSin3D] = useState(false);
  const [mostrarTalleres, setMostrarTalleres] = useState(false);
  const navegacionDirectaRef = useRef(false);
  const [progreso, setProgreso] = useState({ p: 0, texto: 'Iniciando escena 3D de Tierra Bomba' });
  const [capActual, setCapActual] = useState(CAPITULOS[0]);
  const [enVistaAula, setEnVistaAula] = useState(false);
  const [iniciarMapa, setIniciarMapa] = useState(false);
  useEffect(() => { if (accionInicial?.id === 'isla' || (enVistaAula && !accionInicial)) setIniciarMapa(true); }, [enVistaAula, accionInicial, enPortada]);
  const [enPasos3D, setEnPasos3D] = useState(false);
  const [pasoIdx, setPasoIdx] = useState(0);
  const [pasoProg, setPasoProg] = useState(0);
  const [lentePaso, setLentePaso] = useState('resumen'); // 'resumen' | 'piloto' | 'producto'
  const [libre, setLibre] = useState(false);
  const [panelOculto, setPanelOculto] = useState(false);
  const [animPausada, setAnimPausada] = useState(false);
  const [tour3DActivo, setTour3DActivo] = useState(false);
  const [modalDiagrama, setModalDiagrama] = useState(null); // null | 'simulador4pasos' | 'redProblema' | 'memorias' | 'plano2D' | 'hojaRuta'
  const [docHudSel, setDocHudSel] = useState(ANTECEDENTES_CORPUS[8]); // R9 por defecto en HUD
  const [conProyectoHud, setConProyectoHud] = useState(true);
  const [mesHud, setMesHud] = useState(6);

  // Estado interactivo: buscador + laboratorio para jugar con la isla + mini-reto
  const [busqueda, setBusqueda] = useState('');
  const [busqAbierta, setBusqAbierta] = useState(false);
  const [panelJuego, setPanelJuego] = useState(false);
  const [tabJuego, setTabJuego] = useState('isla'); // 'isla' | 'reto' | 'herramientas'
  const [sombraJuego, setSombraJuego] = useState(0); // 0..100
  const [lluviaJuego, setLluviaJuego] = useState(0); // 0..100
  const [capasJuego, setCapasJuego] = useState({ casas: true, arboles: true, pilotos: true, vias: false });
  const [mostrarViasCard, setMostrarViasCard] = useState(false);
  const [viasVisible, setViasVisible] = useState(false);
  const [retoIdx, setRetoIdx] = useState(0);
  const [retoResp, setRetoResp] = useState(null);
  const [retoPuntos, setRetoPuntos] = useState(0);
  const [lugarActivo, setLugarActivo] = useState(null);
  const [catActiva, setCatActiva] = useState(EXPLORA_CATEGORIAS[0]); // Inicia directo mostrando toda la isla y corregimientos
  const [pasoRecorridoIdx, setPasoRecorridoIdx] = useState(0);
  const [vistaRecorrido, setVistaRecorrido] = useState('planta');
  const [patPreviewIdx, setPatPreviewIdx] = useState(0);
  const [tallerPreviewIdx, setTallerPreviewIdx] = useState(0);
  const [autoTourActivo, setAutoTourActivo] = useState(false);
  const [recorridoCompletado, setRecorridoCompletado] = useState(false);
  const [saltoDirectoPatrimonio, setSaltoDirectoPatrimonio] = useState(false);
  const [avisoBloqueoRecorrido, setAvisoBloqueoRecorrido] = useState(false);
  const recorridoCompletadoRef = useRef(false);
  const saltoDirectoRef = useRef(false);
  const ultimoPasoRecorridoRef = useRef(-1);

  // Reproductor de música tradicional y bailes de la comunidad
  const repRef = useRef(null);
  const [pistaActiva, setPistaActiva] = useState(PISTAS_MEMORIA[0]);
  const [musicaSonando, setMusicaSonando] = useState(false);
  const [musicaMute, setMusicaMute] = useState(false);

  useEffect(() => {
    const rep = crearReproductorComunidad();
    repRef.current = rep;
    return () => rep.destroy();
  }, []);

  const alternarMusica = (pista) => {
    const target = pista || pistaActiva;
    if (pista && pista.id !== pistaActiva.id) {
      setPistaActiva(pista);
      repRef.current?.start(pista.id);
      setMusicaSonando(true);
      return;
    }
    if (musicaSonando) {
      repRef.current?.stop();
      setMusicaSonando(false);
    } else {
      repRef.current?.start(target.id);
      setMusicaSonando(true);
    }
  };

  const proximoViernes = useMemo(() => obtenerProximoViernes(), []);

  // Actividades animadas sobre toda la isla (con separación para que nunca se superpongan)
  const actividadesIsla = useMemo(
    () => [
      {
        nodo: 'escuelaR9',
        corto: 'Plataforma 3D',
        titulo: TEMAS_VIERNES_LISTA[0].titulo,
        sub: TEMAS_VIERNES_LISTA[0].sub,
        lugar: 'Bocachica · Colegio R9',
        dia: proximoViernes.dia,
        mes: proximoViernes.mes,
        color: '#6ec6e6',
        Icon: BookOpen,
        dx: 0,
        dy: 68,
      },
      {
        nodo: 'ribera',
        corto: 'Carpintería',
        titulo: TEMAS_VIERNES_LISTA[3].titulo,
        sub: TEMAS_VIERNES_LISTA[3].sub,
        lugar: 'Bocachica · Taller de Ribera',
        dia: '15',
        mes: 'ENE',
        color: '#e8a86b',
        Icon: Hammer,
        dx: -115,
        dy: -16,
      },
      {
        nodo: 'vivero',
        corto: 'Vivero y Manglar',
        titulo: TEMAS_VIERNES_LISTA[4].titulo,
        sub: TEMAS_VIERNES_LISTA[4].sub,
        lugar: 'Caño de Loro · Manglar',
        dia: '10',
        mes: 'FEB',
        color: '#35d08a',
        Icon: Sprout,
        dx: 118,
        dy: -14,
      },
      {
        nodo: 'tierraBomba',
        corto: 'Cocina Isnelia',
        titulo: TEMAS_VIERNES_LISTA[2].titulo,
        sub: TEMAS_VIERNES_LISTA[2].sub,
        lugar: 'Tierra Bomba · Muelle flotante',
        dia: '22',
        mes: 'NOV',
        color: '#e0917a',
        Icon: Utensils,
        dx: -42,
        dy: -24,
      },
      {
        nodo: 'puntaArena',
        corto: 'Bullerengue',
        titulo: TEMAS_VIERNES_LISTA[1].titulo,
        sub: TEMAS_VIERNES_LISTA[1].sub,
        lugar: 'Punta Arena · Rueda de patio',
        dia: '29',
        mes: 'NOV',
        color: '#f4f1ec',
        Icon: Music,
        dx: 48,
        dy: -18,
      },
    ],
    [proximoViernes]
  );

  const [actividadViernesSel, setActividadViernesSel] = useState(null);
  const [patrimonioSel, setPatrimonioSel] = useState(null);
  const [patrimonioSecIdx, setPatrimonioSecIdx] = useState(0);
  const [corregSel, setCorregSel] = useState(null);
  const [corregSecIdx, setCorregSecIdx] = useState(0);
  const [ver180, setVer180] = useState(false);
  const [ver180Cano, setVer180Cano] = useState(false);
  const [cano180Idx, setCano180Idx] = useState(0);
  const [cano360Popup, setCano360Popup] = useState(0);

  const corregimientosIsla = useMemo(
    () => [
      {
        nodo: 'casco',
        corto: 'Bocachica',
        nombre: 'Corregimiento de Bocachica',
        zona: 'Extremo sur · Canal de acceso',
        color: '#e0917a',
        Icon: Home,
        dx: -40,
        dy: 48,
        fichas: [
          { titulo: 'Historia', texto: 'Corregimiento ribereño nacido junto al canal de Bocachica y sus fortificaciones del siglo XVIII. Desde 1753 ha sido guardián del acceso marítimo a Cartagena y hogar de una comunidad afrocaribeña orgullosa de sus raíces.' },
          { titulo: 'Llegada en lancha', texto: 'Zarpando desde el Muelle de la Bodeguita o Bazurto en Cartagena, llegas en unos 25 a 35 minutos directo al muelle comunitario.' },
          { titulo: 'Qué hacer', texto: 'Recorrer sus fuertes coloniales, visitar sus calles históricas y disfrutar del pescado frito frente al mar.' },
          { titulo: 'Gente y oficios', texto: 'Hogar de carpinteros de ribera, pescadores artesanales, cocineras tradicionales y ruedas de bullerengue.' },
        ],
      },
      {
        nodo: 'tierraBomba',
        corto: 'Tierra Bomba',
        nombre: 'Corregimiento de Tierra Bomba',
        zona: 'Norte y centro · Bosque seco',
        color: '#e8a86b',
        Icon: Trees,
        dx: -55,
        dy: -28,
        fichas: [
          { titulo: 'Historia', texto: 'Asentamiento histórico en la zona norte de la isla, marcado por la vida frente a la bahía de Cartagena, los caminos de bosque seco y la memoria viva de sus mayores.' },
          { titulo: 'Llegada en lancha', texto: 'A solo 10 minutos en lancha desde Castillogrande o El Laguito hasta las playas y muelles del sector norte.' },
          { titulo: 'Qué hacer', texto: 'Caminar por senderos de bosque seco tropical, probar los dulces de Doña Isnelia y contemplar la bahía de Cartagena.' },
          { titulo: 'Gente y oficios', texto: 'Comunidad reconocida por su cocina tradicional, dulcería isleña y memoria afrocaribeña frente a la ciudad.' },
        ],
      },
      {
        nodo: 'canoDeLoro',
        corto: 'Caño de Loro',
        nombre: 'Corregimiento de Caño de Loro',
        zona: 'Costado oriental · Bahía y manglar',
        color: '#35d08a',
        Icon: Sprout,
        dx: 70,
        dy: 20,
        fichas: [
          { titulo: 'Historia', texto: 'Comunidad resiliente asentada entre esteros de manglar y aguas calmas de la bahía. Su historia está ligada al cuidado del mangle, la pesca tradicional y la reconstrucción comunitaria.' },
          { titulo: 'Llegada en lancha', texto: 'Acceso por la bahía interior en unos 15 minutos desde Cartagena, bordeando los esteros tranquilos de manglar.' },
          { titulo: 'Qué hacer', texto: 'Visitar el vivero comunitario, observar aves costeras y recorrer en canoa los canales de mangle rojo.' },
          { titulo: 'Gente y oficios', texto: 'Guardianes del manglar, viveristas comunitarios y pescadores de atarraya en aguas calmas.' },
        ],
      },
      {
        nodo: 'puntaArena',
        corto: 'Punta Arena',
        nombre: 'Corregimiento de Punta Arena',
        zona: 'Costa noreste · Mirador a Bocagrande',
        color: '#6ec6e6',
        Icon: MapPin,
        dx: 55,
        dy: -24,
        fichas: [
          { titulo: 'Historia', texto: 'Punta costera frente a Bocagrande que pasó de ranchería de pescadores a referente cultural y turístico de la isla, conservando sus cantos de patio y tradiciones del mar.' },
          { titulo: 'Llegada en lancha', texto: 'Trayecto rápido de 10 minutos desde las playas de Castillogrande o Bocagrande hacia su franja de arena blanca.' },
          { titulo: 'Qué hacer', texto: 'Disfrutar de playas tranquilas frente al perfil de Cartagena, música de patio y gastronomía costera.' },
          { titulo: 'Gente y oficios', texto: 'Anfitriones comunitarios, pescadores y bailadores de bullerengue y cumbia junto al mar.' },
        ],
      },
    ],
    []
  );
  const [memCategoria, setMemCategoria] = useState('comida');
  const [memItemSel, setMemItemSel] = useState(null);
  const [memPasoIdx, setMemPasoIdx] = useState(0);
  const [memIngMarcados, setMemIngMarcados] = useState({});

  const MEMORIAS_BASE = import.meta.env.BASE_URL || '/';
  const MEMORIAS_SABERES = useMemo(
    () => ({
      comida: {
        label: 'Comida',
        color: '#e0917a',
        Icon: Utensils,
        subtitulo: 'Sabores de la isla · Toca un plato para ver su foto y receta paso a paso',
        items: [
          {
            id: 'arroz_coco_pescado',
            titulo: 'Pescado frito con arroz con coco',
            resumen: 'Plato emblemático de Bocachica con mojarra fresca, titoté y patacones.',
            foto: `${MEMORIAS_BASE}images/memorias/arroz_coco_pescado.jpg`,
            etiquetaPaso: 'Jugar',
            ingredientes: ['1 mojarra o pargo fresco', '1 coco seco rallado', '2 tazas de arroz', 'Plátano verde', 'Limón y sal marina'],
            pasos: [
              { titulo: '1. Sacar el titoté', texto: 'Licúa el coco con agua tibia, cuela la primera leche y cocínala a fuego lento hasta que se reduzca y dore en aceite natural (titoté).' },
              { titulo: '2. Cocinar el arroz', texto: 'Agrega el arroz, la segunda leche de coco, una pizca de sal y panela rallada. Cocina tapado hasta que el grano abra suelto y fragante.' },
              { titulo: '3. Adobar y freír el pescado', texto: 'Haz cortes diagonales en la mojarra limpia, báñala en limón, ajo y sal, y fríela en aceite bien caliente hasta quedar dorada y crocante.' },
              { titulo: '4. Patacones y mesa', texto: 'Fríe ruedas de plátano verde, aplástalas y dales una segunda fritura. Sirve caliente junto al mar con rodajas de limón.' },
            ],
          },
          {
            id: 'dulces_isnelia',
            titulo: 'Cocadas y alegrías de Doña Isnelia',
            resumen: 'Dulces tradicionales de coco, panela y millo hechos en paila de patio.',
            foto: `${MEMORIAS_BASE}images/memorias/dulces_isnelia.jpg`,
            etiquetaPaso: 'Jugar',
            ingredientes: ['2 cocos frescos picados o rallados', '1 panela oscura', 'Millo tostado', 'Canela y clavo', 'Hojas de bijao o palma'],
            pasos: [
              { titulo: '1. Melao de panela', texto: 'Derrite la panela en poca agua con astillas de canela y clavo hasta lograr un melao espeso y brillante.' },
              { titulo: '2. Mezclar el coco', texto: 'Incorpora el coco rallado o en lascas al melao caliente y remueve con cuchara de palo sin parar hasta que despegue de la paila.' },
              { titulo: '3. Armar las cocadas', texto: 'Con cuchara húmeda, forma porciones sobre hojas de palma o bandeja engrasada y deja enfriar para que endurezcan.' },
              { titulo: '4. Alegrías de millo', texto: 'Para las alegrías, mezcla el millo reventado con melao tibio y coco, y moldea esferas suaves con las manos.' },
            ],
          },
        ],
      },
      bailes: {
        label: 'Bailes',
        color: '#35d08a',
        Icon: Music,
        subtitulo: 'Toca un baile para ver la foto, aprender los pasos y escuchar su ritmo',
        items: [
          {
            id: 'bullerengue',
            titulo: 'Bullerengue Sentao',
            resumen: 'Canto de patio, palmas y tambor alegre en rueda comunitaria.',
            foto: `${MEMORIAS_BASE}images/memorias/bullerengue.jpg`,
            pistaId: 'bullerengue',
            etiquetaPaso: 'Jugar: Baila con el profe cartagenero',
            ingredientes: ['Tambor alegre', 'Tambor llamador', 'Palmas y coro', 'Pollera amplia'],
            pasos: [
              { titulo: '1. Formar la rueda', texto: 'La comunidad se ubica en círculo alrededor de los tambores mientras la cantadora entona el llamado inicial.' },
              { titulo: '2. Paso sereno de cadera', texto: 'Con la espalda erguida, la bailadora marca un paso corto y firme de cadera al compás del tambor llamador.' },
              { titulo: '3. Diálogo con la pollera', texto: 'Las manos toman los bordes de la falda abriéndola al ritmo del tambor alegre, respondiendo a los repiques sin perder la calma.' },
              { titulo: '4. Saludo y relevo', texto: 'Al cerrar la estrofa, hace una venia suave al tamborero y da paso a la siguiente pareja de la rueda.' },
            ],
          },
          {
            id: 'mapale_cumbia',
            titulo: 'Mapalé y Cumbia de la Bahía',
            resumen: 'Fuerza rítmica afrocaribeña y cadencia de velas frente al mar.',
            foto: `${MEMORIAS_BASE}images/memorias/mapale_cumbia.jpg`,
            pistaId: 'mapale',
            etiquetaPaso: 'Jugar: Baila con el profe cartagenero',
            ingredientes: ['Tambora', 'Alegre y guache', 'Caña de millo', 'Velas en mano'],
            pasos: [
              { titulo: '1. Entrada con cadencia', texto: 'En cumbia, el paso deslizado arrastra suavemente el pie derecho mientras el izquierdo marca el pulso en el suelo.' },
              { titulo: '2. Cortejo y abanico', texto: 'El hombre rodea a la mujer con sombrero en mano; ella sostiene la pollera y gira protegiendo la llama.' },
              { titulo: '3. Cambio al Mapalé', texto: 'Cuando el tambor acelera, el cuerpo se inclina hacia adelante con movimientos rápidos de hombros, pecho y piernas.' },
              { titulo: '4. Remate en energía', texto: 'Saltos cortos y giros explosivos marcan el cierre colectivo al unísono del último golpe de tambora.' },
            ],
          },
        ],
      },
      tradiciones: {
        label: 'Tradiciones',
        color: '#e8a86b',
        Icon: Hammer,
        subtitulo: 'Oficios y saberes de Tierra Bomba · Elige una tradición para explorarla',
        items: [
          {
            id: 'carpinteria_ribera',
            titulo: 'Carpintería de Ribera',
            resumen: 'Construcción artesanal de botes de madera en las playas de Bocachica.',
            foto: `${MEMORIAS_BASE}images/memorias/carpinteria_ribera.jpg`,
            etiquetaPaso: 'Cómo se hace',
            ingredientes: ['Madera de mangle o roble', 'Azuela y garlopa', 'Estopa de coco', 'Brea natural'],
            pasos: [
              { titulo: '1. Trazar la quilla', texto: 'El maestro carpintero elige la madera curva natural y marca la quilla que dará estabilidad al bote sobre las olas.' },
              { titulo: '2. Armar las cuadernas', texto: 'Se fijan las costillas de madera en forma de U a lo largo de la quilla definiendo la manga y el calado.' },
              { titulo: '3. Forrar el casco', texto: 'Las tablas se curvan con calor y humedad para ajustarlas borde con borde sobre las cuadernas.' },
              { titulo: '4. Calafateo impermeable', texto: 'Se sella cada junta con estopa y brea para que la embarcación resista décadas de pesca en la bahía.' },
            ],
          },
          {
            id: 'pesca_chinchorro',
            titulo: 'Pesca Artesanal con Atarraya',
            resumen: 'Lectura de mareas y lance circular de red al amanecer en la bahía.',
            foto: `${MEMORIAS_BASE}images/memorias/pesca_chinchorro.jpg`,
            etiquetaPaso: 'Cómo se hace',
            ingredientes: ['Atarraya tejida a mano', 'Canoa de madera', 'Remo', 'Lectura de marea'],
            pasos: [
              { titulo: '1. Leer la marea y el cardumen', texto: 'Al rayar el alba, el pescador observa las ondas suaves del agua donde se mueven lisas, mojarras y sábalos.' },
              { titulo: '2. Recoger la atarraya', texto: 'La red se pliega en rollos ordenados sobre el brazo izquierdo y los plomos se sostienen con la mano derecha.' },
              { titulo: '3. Lance en abanico', texto: 'Con un giro de cintura, la atarraya se abre en círculo perfecto en el aire antes de caer sobre el agua.' },
              { titulo: '4. Recoger y compartir', texto: 'Al halar la cuerda central, los plomos cierran la bolsa bajo el agua y la faena se comparte en la orilla.' },
            ],
          },
        ],
      },
    }),
    [MEMORIAS_BASE]
  );
  const [pinesActividad, setPinesActividad] = useState({});

  const patrimoniosIsla = useMemo(
    () => [
      {
        nodo: 'sanRafael',
        corto: 'San Rafael',
        nombre: 'Batería del Ángel San Rafael',
        anio: '1762',
        ubicacion: 'Cerro del Horno · Bocachica',
        color: '#e8a86b',
        Icon: Shield,
        dx: 0,
        dy: -55,
        secciones: [
          {
            titulo: 'Construcción',
            texto:
              'Fue erigida en 1762 por el ingeniero militar Antonio de Arévalo, durante los conflictos con los ingleses, y luego reconstruida con materiales duraderos entre 1769 y 1778.',
          },
          {
            titulo: 'Diseño e ingeniería',
            texto:
              'Tiene forma de "media luna" irregular, está tallada prácticamente de forma directa sobre la roca coralina del cerro y se encuentra rodeada por un foso seco y un puente durmiente.',
          },
          {
            titulo: 'Componentes',
            texto:
              'Su estructura incluye una casa fuerte, una garita, un aljibe, una antigua cocina y una galería subterránea que originalmente conectaba con el sector y las fortificaciones cercanas como San Fernando y Santa Bárbara.',
          },
          {
            titulo: 'Historia',
            texto:
              'No participó en enfrentamientos contra enemigos externos durante su apogeo colonial, pero sí fue escenario de resistencia durante el sitio de Cartagena en 1815 por parte de las fuerzas realistas de Pablo Morillo.',
          },
          {
            titulo: 'Restauración y gestión',
            texto:
              'Fue intervenida en 1995 por INVIAS. Actualmente forma parte del patrimonio histórico administrado y divulgado a través de las entidades de fortificaciones de la ciudad.',
          },
        ],
        fuentes: [
          { label: 'Fortificaciones Cartagena de Indias', url: 'https://fortificacionescartagena.com.co/es/destination/bateria-del-angel-san-rafael/' },
          { label: 'Museo Naval del Caribe', url: 'https://museonavaldelcaribe.org/modulos/bateria-angel-san-rafael-cartagena/' },
          { label: 'Sociedad de Mejoras Públicas (SMPC)', url: 'https://www.smpcartagena.org/bateria-del-angel-san-rafael' },
        ],
      },
      {
        nodo: 'sanFernando',
        corto: 'San Fernando',
        nombre: 'Fuerte de San Fernando de Bocachica',
        anio: '1753',
        ubicacion: 'Canal de Bocachica · Tierra Bomba',
        color: '#6ec6e6',
        Icon: Landmark,
        dx: -118,
        dy: 10,
        secciones: [
          {
            titulo: 'Construcción',
            texto:
              'Las obras iniciaron el 12 de marzo de 1753 bajo la dirección del ingeniero Antonio de Arévalo sobre planos de Juan Bautista Mac Evan (con modificaciones de Lorenzo de Solís), concluyendo su primera fase hacia 1759.',
          },
          {
            titulo: 'Diseño e ingeniería',
            texto:
              'Presenta una planta semicircular en forma de herradura orientada al canal marítimo para fuego a flor de agua, combinada con un frente terrestre de dos grandes baluartes: el Baluarte del Rey y el Baluarte de la Reina.',
          },
          {
            titulo: 'Componentes',
            texto:
              'Cuenta con foso húmedo, glacis, hornabeque defensivo y nueve bóvedas robustas a prueba de bombas usadas como polvorines, aljibes y prisiones.',
          },
          {
            titulo: 'Historia',
            texto:
              'Se levantó tras la destrucción del antiguo Castillo de San Luis en 1741 durante el ataque del almirante británico Edward Vernon, consolidando la defensa de la entrada sur a la bahía.',
          },
          {
            titulo: 'Restauración y gestión',
            texto:
              'Forma parte del conjunto fortificado declarado Patrimonio Histórico de la Humanidad por la UNESCO y es divulgado por Fortificaciones Cartagena de Indias.',
          },
        ],
        fuentes: [
          { label: 'Fortificaciones Cartagena de Indias', url: 'https://fortificacionescartagena.com.co/' },
          { label: 'Museo Naval del Caribe', url: 'https://museonavaldelcaribe.org/' },
        ],
      },
      {
        nodo: 'sanJose',
        corto: 'San José',
        nombre: 'Batería de San José',
        anio: '1714',
        ubicacion: 'Islote frente al canal · Bahía',
        color: '#35d08a',
        Icon: Anchor,
        dx: 120,
        dy: 28,
        secciones: [
          {
            titulo: 'Construcción',
            texto:
              'Su primera fase fue construida entre 1714 y 1725 por Juan de Herrera y Sotomayor; tras ser arrasada en 1741, fue reedificada desde 1752 por Ignacio Sala y Antonio de Arévalo.',
          },
          {
            titulo: 'Diseño e ingeniería',
            texto:
              'Diseñada para generar fuego cruzado junto al Fuerte de San Fernando, con un cuerpo central abovedado y una batería baja en ángulo con capacidad para más de 20 cañones.',
          },
          {
            titulo: 'Componentes',
            texto:
              'Integra polvorín, aljibe y una escollera sumergida ideada por Arévalo alrededor de la batería para impedir el acercamiento sorpresa de lanchas y botes enemigos.',
          },
          {
            titulo: 'Historia',
            texto:
              'Fue clave para cerrar por completo el estrecho de Bocachica, única vía navegable hacia Cartagena después del cierre de Bocagrande.',
          },
          {
            titulo: 'Restauración y gestión',
            texto:
              'Integra el sistema defensivo colonial declarado Patrimonio de la Humanidad por la UNESCO en la bahía de Cartagena.',
          },
        ],
        fuentes: [
          { label: 'Museo Naval del Caribe', url: 'https://museonavaldelcaribe.org/' },
        ],
      },
      {
        nodo: 'casco',
        corto: 'Casco Histórico',
        nombre: 'Casco Histórico de Bocachica',
        anio: 'S. XVIII',
        ubicacion: 'Corregimiento de Bocachica · Tierra Bomba',
        color: '#e0917a',
        Icon: Home,
        dx: 14,
        dy: 78,
        secciones: [
          {
            titulo: 'Construcción',
            texto:
              'Asentamiento ribereño tradicional surgido alrededor del canal de Bocachica y de las fortificaciones coloniales construidas en piedra coralina.',
          },
          {
            titulo: 'Diseño e ingeniería',
            texto:
              'Tejido urbano costero de calles peatonales, patios abiertos y vivienda adaptada a la brisa marina y la vida de pesca artesanal.',
          },
          {
            titulo: 'Componentes',
            texto:
              'Muelle comunitario, plaza central, oficios de carpintería de ribera, cocina tradicional y espacios de encuentro afrocaribeño.',
          },
          {
            titulo: 'Historia',
            texto:
              'Comunidad guardiana de la entrada marítima de Cartagena que ha preservado su memoria, bailes y arquitectura isleña frente al mar.',
          },
          {
            titulo: 'Restauración y gestión',
            texto:
              'Patrimonio cultural vivo articulado con el Aula Ambiental de Bocachica para fortalecer la economía local y el cuidado territorial.',
          },
        ],
        fuentes: [],
      },
    ],
    []
  );

  const seleccionarActividad = (act) => {
    if (!act) return;
    setMostrarTalleres(false);
    setActividadViernesSel(act);
    setTemaViernes(act.titulo);
    setConfirmViernes(false);
    escena?.irANodo?.(act.nodo, 340);
  };

  const seleccionarPatrimonio = (pat) => {
    if (!pat) return;
    setPatrimonioSel(pat);
    setPatrimonioSecIdx(0);
    if (['sanFernando','sanJose','sanRafael','casco'].includes(pat.nodo)) { setAutoTourActivo(false); onExplorarCanal?.(pat.nodo); }
    escena?.irANodo?.(pat.nodo, 340);
  };

  const seleccionarCorregimiento = (cor) => {
    if (!cor) return;
    setCorregSel(cor);
    setCorregSecIdx(0);
    escena?.irANodo?.(cor.nodo, 340);
  };

  useEffect(() => {
    const listaMapa =
      catActiva?.id === 'talleres'
        ? actividadesIsla
        : catActiva?.id === 'patrimonio'
          ? patrimoniosIsla
          : catActiva?.id === 'corregimientos'
            ? corregimientosIsla
            : null;
    if (!escena?.proyectarNodos || !listaMapa || panelJuego || mostrarTalleres || actividadViernesSel || modalDiagrama) {
      setPinesActividad({});
      return undefined;
    }
    let rafId = 0;
    const claves = listaMapa.map((a) => a.nodo);
    let ultimoFrame = 0;
    const loop = (ahora = 0) => {
      if (document.hidden || ahora - ultimoFrame < 100) { rafId = requestAnimationFrame(loop); return; }
      ultimoFrame = ahora;
      const raw = escena.proyectarNodos(claves);
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      const items = listaMapa
        .filter((a) => raw[a.nodo])
        .map((a) => ({
          nodo: a.nodo,
          ax: raw[a.nodo].x,
          ay: raw[a.nodo].y,
          x: raw[a.nodo].x + (a.dx || 0),
          y: raw[a.nodo].y + (a.dy || 0),
        }));

      // Separación 2D para garantizar que ningún icono ni etiqueta se superponga
      const minW = 132;
      const minH = 92;
      for (let it = 0; it < 6; it += 1) {
        for (let i = 0; i < items.length; i += 1) {
          for (let j = i + 1; j < items.length; j += 1) {
            const dx = items[j].x - items[i].x;
            const dy = items[j].y - items[i].y;
            const ox = minW - Math.abs(dx);
            const oy = minH - Math.abs(dy);
            if (ox > 0 && oy > 0) {
              if (ox < oy) {
                const s = (dx >= 0 ? 1 : -1) * (ox * 0.52);
                items[i].x -= s;
                items[j].x += s;
              } else {
                const s = (dy >= 0 ? 1 : -1) * (oy * 0.52);
                items[i].y -= s;
                items[j].y += s;
              }
            }
          }
          items[i].x = Math.max(82, Math.min(w - 82, items[i].x));
          items[i].y = Math.max(104, Math.min(h - 92, items[i].y));
        }
      }

      const sep = {};
      for (const it of items) sep[it.nodo] = it;
      setPinesActividad(sep);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [escena, catActiva, panelJuego, mostrarTalleres, actividadViernesSel, modalDiagrama, actividadesIsla, patrimoniosIsla, corregimientosIsla]);

  useEffect(() => {
    const cerrar = (event) => {
      if (event.key !== 'Escape') return;
      setCorregSel(null); setPatrimonioSel(null); setActividadViernesSel(null);
      setLugarActivo(null); setBusqAbierta(false); setMostrarViasCard(false);
      setModalDiagrama(null); setVer180(false); setVer180Cano(false); setLibre(false);
    };
    window.addEventListener('keydown', cerrar);
    return () => window.removeEventListener('keydown', cerrar);
  }, []);

  // Programación de clases virtuales de los viernes
  const [clasesViernes, setClasesViernes] = useState(() => {
    try {
      const saved = localStorage.getItem('tb_clases_viernes_v1');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [
      { id: 1, tema: TEMAS_VIERNES[0], nombre: 'Mesa Comunitaria', corregimiento: 'Bocachica', fecha: 'Próximo viernes · 4:00 p.m.' },
      { id: 2, tema: TEMAS_VIERNES[1], nombre: 'Maestros de Ribera', corregimiento: 'Caño de Loro', fecha: 'Viernes · 4:00 p.m.' },
    ];
  });
  const [temaViernes, setTemaViernes] = useState(TEMAS_VIERNES[0]);
  const [nombreViernes, setNombreViernes] = useState('');
  const [corregViernes, setCorregViernes] = useState('Bocachica');
  const [beneficioViernes, setBeneficioViernes] = useState('alimentacion');
  const [confirmViernes, setConfirmViernes] = useState(false);

  const agendarClaseViernes = (e) => {
    e.preventDefault();
    const beneficioTexto =
      beneficioViernes === 'alimentacion'
        ? 'Bono de alimentación'
        : 'Cupo lancha ida y vuelta a Cartagena';
    const nueva = {
      id: Date.now(),
      tema: temaViernes,
      nombre: nombreViernes.trim() || 'Habitante de la isla',
      corregimiento: corregViernes,
      beneficio: beneficioTexto,
      fecha: 'Próximo viernes · 4:00 p.m.',
    };
    const next = [nueva, ...clasesViernes].slice(0, 6);
    setClasesViernes(next);
    setNombreViernes('');
    setConfirmViernes(true);
    try { localStorage.setItem('tb_clases_viernes_v1', JSON.stringify(next)); } catch { /* ignore */ }
    setTimeout(() => setConfirmViernes(false), 3500);
  };

  const activarCategoria = (cat, conScroll = true) => {
    if (!cat) return;
    if (cat.id !== 'memorias' && cat.id !== 'talleres') setIniciarMapa(true);
    if (conScroll) navegacionDirectaRef.current = true;
    setMostrarTalleres(cat.id === 'talleres');
    setAutoTourActivo(false);
    setLibre(false);
    setBusqAbierta(false);
    setLugarActivo(null);
    setActividadViernesSel(null);
    setPatrimonioSel(null);
    setCorregSel(null);
    if (conScroll && cat.id !== 'corregimientos') {
      saltoDirectoRef.current = true;
      setSaltoDirectoPatrimonio(true);
      setAvisoBloqueoRecorrido(false);
    }
    if (cat.id === 'memorias') {
      setPanelJuego(true);
      setCatActiva(null);
    } else {
      setPanelJuego(false);
      setCatActiva(cat);
    }
    escena?.set({
      cam: cat.cam,
      mostrarPilotos: true,
      dim: 0,
      cartografia: cat.id === 'corregimientos' ? 0.32 : 0,
      lluvia: 0,
      sombraExtra: cat.id === 'memorias' ? 0.35 : 0,
      zonas: cat.zonas,
      rutas: cat.rutas,
      nodosActivos: cat.nodos,
      gemelo: 0,
    });
    if (conScroll) rootRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    if (!accionInicial) return;
    if (accionInicial.id === 'isla') activarCategoria(EXPLORA_CATEGORIAS[0]);
    else if (accionInicial.id === 'oficios') activarCategoria(EXPLORA_CATEGORIAS[2]);
    else {
      const esBaile = accionInicial.id === 'mapale' || accionInicial.id === 'bullerengue';
      const categoria = esBaile ? 'bailes' : 'comida';
      const itemId = {pescado:'arroz_coco_pescado',cocada:'dulces_isnelia',mapale:'mapale_cumbia',bullerengue:'bullerengue'}[accionInicial.id];
      setMemCategoria(categoria);
      setMemItemSel(MEMORIAS_SABERES[categoria].items.find(item => item.id === itemId) || null);
      setMemPasoIdx(0);
      activarCategoria(EXPLORA_CATEGORIAS[3]);
    }
  }, [accionInicial]);

  const resultadosBusqueda = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return INDICE_BUSQUEDA.slice(0, 6);
    return INDICE_BUSQUEDA.filter(
      (item) =>
        item.titulo.toLowerCase().includes(q) ||
        item.sub.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q)
    );
  }, [busqueda]);

  const seleccionarBusqueda = (item) => {
    setBusqAbierta(false);
    if (item.tipo === 'modal') {
      setModalDiagrama(item.modal);
      return;
    }
    const patrimonio = patrimoniosIsla.find(p => p.nodo === item.nodo);
    if (patrimonio) { seleccionarPatrimonio(patrimonio); return; }
    setLugarActivo(item);
    escena?.irANodo?.(item.nodo, 300);
  };

  const aplicarJuegoEscena = (nextSombra, nextLluvia, nextCapas) => {
    escena?.set({
      sombraExtra: nextSombra / 100,
      lluvia: nextLluvia > 15 ? nextLluvia / 100 : 0,
      nivelMar: nextLluvia / 100,
      mostrarCasas: nextCapas.casas,
      mostrarArboles: nextCapas.arboles,
      mostrarPilotos: nextCapas.pilotos,
      mostrarVias: nextCapas.vias,
    });
  };

  const secCorregRef = useRef(null);
  const secPatrimonioRef = useRef(null);
  const secTalleresRef = useRef(null);
  const secJuegoRef = useRef(null);
  const ultimaSeccionRef = useRef('hero');

  // Inicializar escena 3D
  useEffect(() => {
    let viva = true;
    let inst = null;
    if (!iniciarMapa || !mount3DRef.current) return undefined;
    crearEscenaAula(mount3DRef.current, {
      onProgreso: (p, texto) => { if (viva) setProgreso({ p, texto }); },
    }).then((s) => {
      if (!viva) { s?.dispose(); return; }
      inst = s;
      setEscena(s);
    }).catch((err) => {
      console.error(err);
      if (viva) { setSin3D(true); setProgreso({ p: 1, texto: 'Listo' }); }
    });
    return () => {
      viva = false;
      inst?.dispose();
    };
  }, [iniciarMapa]);

  useEffect(() => {
    if (!accionInicial && !enPortada) activarCategoria(EXPLORA_CATEGORIAS[0], false);
  }, [escena]);

  useEffect(() => {
    if (enPortada) {
      setPanelJuego(false); setMostrarTalleres(false); setActividadViernesSel(null);
      escena?.set({ cam: 'portada_comunidad', dim: 0, casas: 1, contexto: 1, lluvia: 0, mostrarPilotos: false });
    }
  }, [escena, enPortada]);

  useEffect(() => {
    escena?.setPausado?.(Boolean(canalAbierto || (!enVistaAula && !enPortada) || panelJuego || mostrarTalleres || actividadViernesSel || modalDiagrama || ver180 || ver180Cano));
  }, [escena, enVistaAula, enPortada, canalAbierto, panelJuego, mostrarTalleres, actividadViernesSel, modalDiagrama, ver180, ver180Cano]);

  useEffect(() => {
    if (!autoTourActivo || !escena || panelJuego || modalDiagrama || patrimonioSel || actividadViernesSel) return undefined;
    if (catActiva?.id !== 'patrimonio' && catActiva?.id !== 'talleres') return undefined;
    const id = setInterval(() => {
      if (catActiva.id === 'patrimonio') {
        setPatPreviewIdx((prev) => {
          const next = (prev + 1) % patrimoniosIsla.length;
          const p = patrimoniosIsla[next];
          if (p) escena.irANodo?.(p.nodo, 280, next % 2 === 0 ? 'planta' : 'axo');
          return next;
        });
      } else if (catActiva.id === 'talleres') {
        setTallerPreviewIdx((prev) => {
          const next = (prev + 1) % actividadesIsla.length;
          const a = actividadesIsla[next];
          if (a) escena.irANodo?.(a.nodo, 300, next % 2 === 0 ? 'planta' : 'axo');
          return next;
        });
      }
    }, 3600);
    return () => clearInterval(id);
  }, [autoTourActivo, escena, catActiva, panelJuego, modalDiagrama, patrimonioSel, actividadViernesSel, patrimoniosIsla, actividadesIsla]);

  // Control de cámara y pasos por scroll (El mapa 3D es protagonista en todos los capítulos 00..06)
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

      if (navegacionDirectaRef.current) return;

      // Detectar capítulo activo para la píldora superior
      let cap = CAPITULOS[0];
      for (const c of CAPITULOS) {
        const el = document.getElementById(c.ancla);
        if (el && el.getBoundingClientRect().top <= mid) cap = c;
      }
      setCapActual(cap);

      const elCorreg = secCorregRef.current;
      if (elCorreg) {
        const topCorreg = elCorreg.getBoundingClientRect().top + window.scrollY;
        const spanCorreg = Math.max(1, elCorreg.offsetHeight - vh);
        const maxScrollCorreg = topCorreg + spanCorreg;

        if (window.scrollY <= maxScrollCorreg + 20) {
          const frac = Math.max(0, Math.min(1, (window.scrollY - topCorreg) / spanCorreg));
          const ordenNodos = ['tierraBomba', 'puntaArena', 'canoDeLoro', 'casco'];
          const idx = Math.min(ordenNodos.length - 1, Math.floor(frac * ordenNodos.length));
          const vista = frac < 0.5 ? 'planta' : 'axo';
          const beatKey = `${idx}-${vista}`;
          if (beatKey !== ultimoPasoRecorridoRef.current) {
            ultimoPasoRecorridoRef.current = beatKey;
            setPasoRecorridoIdx(idx);
            setVistaRecorrido(vista);
            if (!libre) {
              escena?.set?.({
                cam: vista === 'axo' ? 'isla_axo' : 'isla_completa',
                cartografia: 0.32,
                nodosActivos: [],
              });
            }
          }
          if (frac >= 0.72 && !recorridoCompletadoRef.current) {
            recorridoCompletadoRef.current = true;
            setRecorridoCompletado(true);
            setAvisoBloqueoRecorrido(false);
          }
        }
      }

      const tramos = [
        { ref: secCorregRef, cat: EXPLORA_CATEGORIAS[0] },
        { ref: secPatrimonioRef, cat: EXPLORA_CATEGORIAS[1] },
        { ref: secTalleresRef, cat: EXPLORA_CATEGORIAS[2] },
        { ref: secJuegoRef, cat: EXPLORA_CATEGORIAS[3] },
      ];

      let hallada = null;
      for (const tr of tramos) {
        const el = tr.ref.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= vh * 0.55 && r.bottom >= vh * 0.45) {
          hallada = tr.cat;
          break;
        }
      }

      setEnPasos3D(false);
      if (hallada) {
        if (ultimaSeccionRef.current !== hallada.id) {
          ultimaSeccionRef.current = hallada.id;
          activarCategoria(hallada, false);
        }
      } else if (window.scrollY <= 40) {
        if (ultimaSeccionRef.current !== 'corregimientos') {
          ultimaSeccionRef.current = 'corregimientos';
          activarCategoria(EXPLORA_CATEGORIAS[0], false);
        }
      } else if (cap.id === '00' && window.scrollY > 40) {
        if (ultimaSeccionRef.current !== 'corregimientos') {
          ultimaSeccionRef.current = 'corregimientos';
          activarCategoria(EXPLORA_CATEGORIAS[0], false);
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
    setModalDiagrama(null);
    const el = document.getElementById(ancla);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const irAPaso3D = (idx) => {
    const vh = window.innerHeight || 1;
    const pasoPx = (ALTO_PASO / 100) * vh;
    const tramos = [
      { ref: secProblemaRef, offset: 0, count: 2 },
      { ref: secMemoriasRef, offset: 2, count: 2 },
      { ref: secLineasRef, offset: 4, count: 6 },
      { ref: secGemeloRef, offset: 10, count: 5 },
      { ref: secPilotoR9Ref, offset: 15, count: 3 },
      { ref: secHojaRutaRef, offset: 18, count: 2 },
    ];
    const tr = tramos.find((t) => idx >= t.offset && idx < t.offset + t.count) || tramos[0];
    const targetEl = tr.ref.current;
    const localIdx = idx - tr.offset;
    if (!targetEl) return;
    const topDoc = targetEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: topDoc + localIdx * pasoPx + 12, behavior: 'smooth' });
  };

  // Tour 3D automático cuando el usuario activa "â–¶ Tour 3D"
  useEffect(() => {
    if (!tour3DActivo || animPausada || !enPasos3D) return undefined;
    const id = setInterval(() => {
      const sig = (pasoIdx + 1) % PASOS_3D.length;
      irAPaso3D(sig);
    }, 5200);
    return () => clearInterval(id);
  }, [tour3DActivo, animPausada, enPasos3D, pasoIdx]);

  const pasoActual = PASOS_3D[pasoIdx] || PASOS_3D[0];
  const faseHudActual = FASES_24_MESES.find((f) => {
    if (f.id === 'F0') return mesHud === 0;
    const mMatch = f.meses.match(/(\d+)\D+(\d+)/);
    if (!mMatch) return false;
    return mesHud >= Number(mMatch[1]) && mesHud <= Number(mMatch[2]);
  }) || FASES_24_MESES[1];

  return (
    <div
      id="aula-ambiental-bocachica"
      ref={rootRef}
      className={`tc-aula ${escena ? 'cf-scene-ready' : ''} relative min-h-screen text-[#f4f1ec] select-none ${animPausada ? 'tc-anim-pausada' : ''}`}
    >
      {/* BARRA SUPERIOR DE PROGRESO DE LECTURA (Scroll-Driven Animation en el compositor) */}
      {enVistaAula && (
        <div className="fixed top-0 inset-x-0 h-1 z-40 bg-white/5 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-[#e0917a] via-[#35d08a] to-[#6ec6e6] tc-barra-lectura" />
        </div>
      )}
      {/* ESCENA 3D FIJA A PANTALLA COMPLETA (Visible en todo el recorrido) */}
      <div
        ref={mount3DRef}
        className={`fixed inset-0 z-0 transition-opacity duration-500 ${
          (enVistaAula || enPortada) ? 'opacity-100' : 'opacity-0'
        } ${libre ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      />

      {sin3D && (enVistaAula || enPortada) && <div className="cf-map-fallback"><img src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`} alt="Isla de Tierra Bomba" /></div>}
      {/* INDICADOR DE CARGA */}
      {enVistaAula && iniciarMapa && progreso.p < 1 && (
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

      {/* CABECERA ÚNICA Y LIMPIA · HUD ESPACIAL */}
      {enVistaAula && (
      <header className="cf-header fixed top-3.5 inset-x-0 z-30 px-3 md:px-6 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        <div className="tc-vidrio h-10 px-3.5 !rounded-full flex items-center gap-2.5 pointer-events-auto">
          {volverFn && (
            <button
              type="button"
              onClick={volverFn}
              className="text-xs font-medium text-[#e0917a] hover:text-white transition-colors pr-2.5 border-r border-white/15 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
          )}
          <span className="w-2 h-2 rounded-full bg-[#e0917a] shadow-[0_0_8px_#e0917a]" />
          <span className="text-xs font-semibold tracking-wide text-white">Tierra Bomba</span>
        </div>

        {/* 4 pestañas guiadas en orden con iconos vectoriales */}
        <nav aria-label="Qué quieres explorar" className="tc-vidrio min-h-12 px-1.5 !rounded-full flex items-center gap-1 overflow-x-auto max-w-full pointer-events-auto order-3 lg:order-2">
          {EXPLORA_CATEGORIAS.map((cat) => {
            const on = (cat.id === 'memorias' ? panelJuego : catActiva?.id === cat.id && !panelJuego);
            const Icono = ICONOS_CAT[cat.id] || MapPin;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => activarCategoria(cat)}
                aria-current={on ? "page" : undefined}
                className={`whitespace-nowrap min-h-11 px-3.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  on
                    ? 'bg-white text-[#0b1016] shadow-[0_2px_12px_rgba(255,255,255,0.28)] font-semibold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icono className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="cf-search tc-vidrio h-10 px-1.5 !rounded-full text-xs text-white/85 flex items-center gap-1.5 pointer-events-auto relative order-2 lg:order-3">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onFocus={() => setBusqAbierta(true)}
              onChange={(e) => { setBusqueda(e.target.value); setBusqAbierta(true); }}
              placeholder="Buscar lugar..."
              aria-label="Buscar lugar o tema en Tierra Bomba"
              className="w-28 sm:w-40 h-7 bg-white/10 border border-white/15 rounded-full pl-8 pr-3 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-[#e0917a]/80 transition-all"
            />
            {busqAbierta && (
              <div className="absolute right-0 top-full mt-2.5 w-72 sm:w-80 tc-vidrio p-2 z-50 max-h-80 overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between px-2.5 pb-2 mb-1 border-b border-white/10 text-[11px] text-white/60 font-medium">
                  <span>Ir a un lugar en el mapa</span>
                  <button type="button" onClick={() => setBusqAbierta(false)} className="text-white/60 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {resultadosBusqueda.length === 0 ? (
                  <div className="px-2.5 py-3 text-xs text-white/60">Prueba con &ldquo;Bocachica&rdquo;, &ldquo;Caño de Loro&rdquo;, &ldquo;Fuerte&rdquo; o &ldquo;Taller&rdquo;.</div>
                ) : (
                  resultadosBusqueda.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => { setCatActiva(null); setPanelJuego(false); seleccionarBusqueda(it); }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/10 transition flex items-start gap-2.5 cursor-pointer"
                    >
                      {it.tipo === 'modal' ? (
                        <Layers className="w-4 h-4 text-[#e0917a] shrink-0 mt-0.5" />
                      ) : (
                        <MapPin className="w-4 h-4 text-[#35d08a] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-medium text-white">{it.titulo}</div>
                        <div className="text-[11px] text-white/60 leading-tight">{it.sub}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>


        </div>
        <div className="cf-control-audio pointer-events-auto">
          
        </div>
      </header>
      )}

      {enVistaAula && !ver180 && !ver180Cano && !modalDiagrama && !panelJuego && (
        <MenuComunidad activo={catActiva?.id} onElegir={(id) => activarCategoria(EXPLORA_CATEGORIAS.find(c => c.id === id))} />
      )}

      {enVistaAula && mostrarTalleres && (
        <section className="cf-talleres" role="dialog" aria-modal="true" aria-label="Elige un taller">
          <header><button type="button" onClick={() => { setMostrarTalleres(false); activarCategoria(EXPLORA_CATEGORIAS[0]); }}><ArrowLeft size={26}/> Volver</button></header>
          <div className="cf-talleres-body"><h2>¿Qué quieres aprender?</h2>
            <div className="cf-talleres-grid">{actividadesIsla.map((act) => {
              const fotos={ribera:'carpinteria_ribera.jpg',vivero:'pesca_chinchorro.jpg',tierraBomba:'dulces_isnelia.jpg',puntaArena:'bullerengue.jpg'};
              const esColegio=act.nodo==='escuelaR9';
              const src=esColegio ? `${import.meta.env.BASE_URL}assets/colegio_deterioro_1.jpg` : act.nodo==='vivero' ? `${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg` : `${import.meta.env.BASE_URL}images/memorias/${fotos[act.nodo] || 'carpinteria_ribera.jpg'}`;
              return <button type="button" key={act.nodo} onClick={() => { seleccionarActividad(act);  }}>
                <img src={src} alt="" loading="lazy"/><span><act.Icon size={28}/><strong>{act.corto}</strong><ArrowRight size={23}/></span>
              </button>;
            })}</div>
          </div>
        </section>
      )}

      {/* CONTROLES MINIMALISTAS DEL MAPA 3D */}
      {enVistaAula && !modalDiagrama && (
        <div className="cf-map-controls fixed bottom-4 inset-x-4 md:left-auto md:bottom-6 md:right-6 z-20 tc-vidrio min-h-12 px-1.5 rounded-2xl md:!rounded-full flex flex-wrap md:flex-nowrap justify-center items-center gap-0.5 pointer-events-auto">
          <button type="button" onClick={() => {
            setLibre(false); setAutoTourActivo(false); setCorregSel(null);
            setPatrimonioSel(null); setActividadViernesSel(null); setLugarActivo(null);
            setMostrarViasCard(false); setVistaRecorrido('planta');
            activarCategoria(EXPLORA_CATEGORIAS[0]);
            escena?.vista?.reset?.();
          }} className="min-h-11 px-3 rounded-full text-xs font-semibold text-white hover:bg-white/10 cursor-pointer">
            Ver toda la isla
          </button>
          <button
            type="button"
            onClick={() => setMostrarViasCard((v) => !v)}
            className={`cf-secondary h-7 px-3 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mostrarViasCard
                ? 'bg-[#ff7a50] text-[#0b1016] font-semibold shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
            title="Ver desglose de las vías cartografiadas (73 km)"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Capas</span>
          </button>
          <span className="w-px h-4 bg-white/12 mx-0.5" />
          <button
            type="button"
            onClick={() => setLibre((v) => !v)}
            className={`h-7 px-3 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              libre ? 'bg-[#e0917a] text-[#0b1016] font-semibold shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
            title="Arrastra y gira el mapa 3D libremente"
          >
            {libre ? <Check className="w-3.5 h-3.5" /> : <Hand className="w-3.5 h-3.5" />}
            <span>{libre ? 'Terminar' : 'Girar mapa'}</span>
          </button>
          <span className="w-px h-4 bg-white/12 mx-0.5" />
          <button type="button" onClick={() => escena?.vista.zoom(0.8)} className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer" title="Acercar" aria-label="Acercar mapa">+</button>
          <button type="button" onClick={() => escena?.vista.zoom(1.25)} className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer" title="Alejar" aria-label="Alejar mapa">−</button>
          <button type="button" onClick={() => escena?.vista.reset()} className="w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer" title="Recentrar mapa" aria-label="Recentrar mapa">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {enVistaAula && libre && !modalDiagrama && (
        <p role="status" className="cf-map-tip fixed bottom-32 md:bottom-20 right-4 z-20 max-w-[85vw] rounded-xl bg-[#0b1016]/95 border border-white/20 px-4 py-3 text-xs text-white pointer-events-none">
          Arrastra para girar. Usa + y − para acercarte o alejarte. Pulsa Terminar para seguir explorando.
        </p>
      )}

      {/* TARJETA CARTOGRÁFICA DE TODAS LAS VÍAS (Idéntica a tesis_tercer_corte) */}
      {enVistaAula && mostrarViasCard && !panelJuego && !modalDiagrama && (
        <aside className="fixed bottom-16 left-4 md:bottom-20 md:left-6 z-20 w-[min(92vw,22rem)] tc-vidrio p-4 md:p-5 rounded-2xl border border-white/20 shadow-2xl tc-paso-anim space-y-3 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff7a50] font-semibold">
                04 · TODAS LAS VÍAS
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">73,0</span>
                <span className="text-sm font-semibold text-white/70">km</span>
              </div>
              <p className="text-[11px] text-white/75 mt-0.5 leading-snug">
                de vías cartografiadas sobre la isla, en 1.642 tramos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMostrarViasCard(false)}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Cerrar panel de vías"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-1 rounded bg-[#f0f4f8]" />
                <span>Calles y caminos</span>
              </div>
              <span className="font-mono text-white/80 font-bold">53,5 km</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-1 rounded bg-[#8ee6f5]" />
                <span>Servicio y trochas</span>
              </div>
              <span className="font-mono text-white/80 font-bold">4,1 km</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-1 rounded bg-[#ff7a50]" />
                <span>Senderos y peatonales</span>
              </div>
              <span className="font-mono text-white/80 font-bold">15,4 km</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const next = !viasVisible;
                setViasVisible(next);
                escena?.set({ mostrarVias: next });
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>{viasVisible ? 'Ocultar líneas 3D' : 'Mostrar líneas 3D'}</span>
            </button>
            <span className="text-[10px] text-white/45 font-mono">1.642 tramos</span>
          </div>

          <div className="text-[10px] text-white/45 leading-snug">
            © OpenStreetMap contributors, ODbL 1.0, consultado el 2026-11-03.<br />
            Cobertura de vías y caminos de toda la isla de Tierra Bomba.
          </div>
        </aside>
      )}

      {enPasos3D && !catActiva && !panelJuego && !lugarActivo && (
        <>
          <IndiceLateral total={PASOS_3D.length} activo={pasoIdx} onIr={irAPaso3D} />

          {!panelOculto && (
            <aside
              key={pasoActual.id}
              className="fixed z-20 bottom-4 inset-x-4 md:inset-x-auto md:bottom-6 md:left-8 md:w-[26.5rem] tc-vidrio p-4 md:p-5 pointer-events-auto tc-hud-enter tc-paso-anim"
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
                    {tour3DActivo ? 'â¸ Pausar recorrido' : 'â–¶ Recorrido automático'}
                  </button>
                  <span className="tc-num font-mono">{pasoActual.pasoGrupo}</span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-white mt-1 leading-snug">
                {pasoActual.titulo}
              </h3>

              <div className="mt-2.5 pt-2.5 tc-regla flex items-baseline justify-between gap-3">
                <div className="tc-num text-2xl md:text-3xl font-semibold text-white">
                  {pasoActual.cifra}
                </div>
                <div className="text-[11px] text-white/65 text-right leading-tight max-w-[11.5rem]">
                  {pasoActual.subCifra}
                </div>
              </div>

              {/* MINI-CONTROLES INTERACTIVOS EN EL MAPA 3D SEGÚN EL CAPÍTULO */}
              {pasoActual.interactivo === 'corpusR9' && (
                <div className="mt-2.5 pt-2.5 tc-regla">
                  <div className="flex flex-wrap gap-1">
                    {ANTECEDENTES_CORPUS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDocHudSel(d)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                          docHudSel.id === d.id
                            ? 'bg-[#e0917a]/25 border-[#e0917a] text-white'
                            : 'border-white/15 text-white/65 hover:text-white'
                        }`}
                      >
                        {d.id}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 text-[11px] text-white/85 leading-snug">
                    <strong className="text-[#e0917a]">{docHudSel.id} ({docHudSel.anio}):</strong> {docHudSel.titulo}
                  </div>
                </div>
              )}

              {pasoActual.interactivo === 'antesDespuesR9' && (
                <div className="mt-2.5 pt-2.5 tc-regla flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConProyectoHud(false);
                      escena?.set({ lluvia: 0, zonas: [0.2, 0.1, 0.1], rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 0 } });
                    }}
                    className={`tc-ficha flex-1 text-center ${!conProyectoHud ? 'tc-ficha-activa !border-[#e0917a]' : ''}`}
                  >
                    â˜€ Hoy: 36,0 °C (18% sombra)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConProyectoHud(true);
                      escena?.set({ lluvia: 1, zonas: [0.2, 0.98, 0.98], rutas: { agua: 1, verde: 1, residuos: 0.4, oficios: 0, patrimonio: 0 } });
                    }}
                    className={`tc-ficha flex-1 text-center ${conProyectoHud ? 'tc-ficha-activa !border-[#35d08a]' : ''}`}
                  >
                    ðŸŒ³ Con Piloto R9: 31,5 °C
                  </button>
                </div>
              )}

              {pasoActual.interactivo === 'cronograma24m' && (
                <div className="mt-2.5 pt-2.5 tc-regla">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-[#e0917a]">{faseHudActual.id} · {faseHudActual.nombre}</span>
                    <span className="tc-num text-white font-semibold">Mes {mesHud}/24</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={mesHud}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setMesHud(m);
                      const k = m / 24;
                      escena?.set({
                        zonas: [0.35 + k * 0.6, 0.35 + k * 0.6, 0.35 + k * 0.6],
                        rutas: { agua: k, verde: k, residuos: k * 0.9, oficios: k * 0.9, patrimonio: k },
                        lluvia: m >= 9 ? 0.55 : 0,
                      });
                    }}
                    className="tc-slider"
                    aria-label="Mes del programa en el mapa 3D"
                  />
                </div>
              )}

              {/* Pestañas interactivas dentro de la tarjeta flotante en lenguaje sencillo */}
              <div className="flex gap-1.5 mt-2.5 pt-2.5 tc-regla">
                {[
                  { id: 'resumen', label: '¿Qué pasa hoy?' },
                  { id: 'piloto', label: '¿Qué haremos?' },
                  { id: 'producto', label: '¿Qué queda?' },
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

              <p className="text-xs text-white/85 mt-2.5 leading-relaxed">
                {lentePaso === 'resumen' && pasoActual.resumen}
                {lentePaso === 'piloto' && pasoActual.piloto}
                {lentePaso === 'producto' && pasoActual.producto}
              </p>

              {/* Botón opcional para abrir diagramas 2D interactivos sin tapar el mapa por defecto */}
              <div className="mt-2.5 pt-2 tc-regla flex flex-wrap items-center justify-between gap-2">
                {pasoActual.capId === '01' && (
                  <button
                    type="button"
                    onClick={() => setModalDiagrama(pasoActual.id === 'p01' ? 'simulador4pasos' : 'redProblema')}
                    className="tc-ficha !border-[#e0917a]/60 !text-[#f4f1ec]"
                  >
                    âœ¦ {pasoActual.id === 'p01' ? 'Ver dibujos explicativos en 4 pasos' : 'Ver cómo se conectan los problemas y soluciones'}
                  </button>
                )}
                {pasoActual.capId === '02' && (
                  <button
                    type="button"
                    onClick={() => setModalDiagrama('memorias')}
                    className="tc-ficha !border-[#6ec6e6]/60 !text-[#f4f1ec]"
                  >
                    âœ¦ Ver los 9 estudios anteriores y las 6 memorias
                  </button>
                )}
                {(pasoActual.capId === '05' || pasoActual.id === 'g04') && (
                  <button
                    type="button"
                    onClick={() => setModalDiagrama('plano2D')}
                    className="tc-ficha !border-[#35d08a]/60 !text-[#f4f1ec]"
                  >
                    âœ¦ Ver plano del colegio y comparar antes/después
                  </button>
                )}
                {pasoActual.capId === '06' && (
                  <button
                    type="button"
                    onClick={() => setModalDiagrama('hojaRuta')}
                    className="tc-ficha !border-[#f5b45a]/60 !text-[#f4f1ec]"
                  >
                    âœ¦ Ver plan a 2 años y quiénes participan
                  </button>
                )}
              </div>

              {/* Controles rápidos de navegación de pasos y progreso */}
              <div className="mt-2.5 pt-2 tc-regla flex items-center justify-between text-xs text-white/65">
                <button
                  type="button"
                  disabled={pasoIdx === 0}
                  onClick={() => irAPaso3D(Math.max(0, pasoIdx - 1))}
                  className="hover:text-white disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <span className="tc-num text-[11px]">Vista 3D {pasoIdx + 1} / {PASOS_3D.length}</span>
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

      {/* ICONOS ANIMADOS SOBRE EL MAPA (1. CORREGIMIENTOS, 2. PATRIMONIO Y 3. TALLERES Y VIERNES) */}
      {enVistaAula && (catActiva?.id === 'talleres' || catActiva?.id === 'patrimonio' || catActiva?.id === 'corregimientos') && !panelJuego && !mostrarTalleres && !modalDiagrama && (() => {
        const esPatrimonio = catActiva.id === 'patrimonio';
        const esCorreg = catActiva.id === 'corregimientos';
        const listaPines = esPatrimonio ? patrimoniosIsla : esCorreg ? corregimientosIsla : actividadesIsla;
        const nodoSel = esPatrimonio ? patrimonioSel?.nodo : esCorreg ? corregSel?.nodo : actividadViernesSel?.nodo;
        return (
          <div className="fixed inset-0 z-15 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {listaPines.map((item) => {
                const p = pinesActividad[item.nodo];
                if (!p) return null;
                const dist = Math.hypot(p.x - p.ax, p.y - p.ay);
                if (dist < 14) return null;
                return (
                  <g key={`line-${item.nodo}`}>
                    <line
                      x1={p.ax}
                      y1={p.ay}
                      x2={p.x}
                      y2={p.y}
                      stroke={item.color}
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      strokeOpacity="0.65"
                    />
                    <circle cx={p.ax} cy={p.ay} r="4" fill={item.color} fillOpacity="0.9" />
                  </g>
                );
              })}
            </svg>
            {listaPines.map((item, idx) => {
              const p = pinesActividad[item.nodo];
              if (!p) return null;
              const IconoPin = item.Icon || Landmark;
              const sel = nodoSel === item.nodo;
              return (
                <button
                  key={item.nodo}
                  type="button"
                  aria-label={`Abrir ${item.nombre || item.corto}`}
                  onClick={() => {
                    setAutoTourActivo(false);
                    if (esPatrimonio) seleccionarPatrimonio(item);
                    else if (esCorreg) seleccionarCorregimiento(item);
                    else seleccionarActividad(item);
                  }}
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer focus:outline-none"
                >
                  <span className="relative flex flex-col items-center">
                    <span
                      className="absolute -inset-1.5 rounded-2xl animate-pulse opacity-30 blur-[6px]"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`relative w-11 h-11 rounded-2xl border flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${
                        sel ? 'scale-115 ring-2 ring-white/50' : ''
                      }`}
                      style={{
                        backgroundColor: 'rgba(11, 16, 22, 0.88)',
                        borderColor: `${item.color}cc`,
                        color: item.color,
                        boxShadow: `0 10px 26px -6px ${item.color}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
                      }}
                    >
                      <IconoPin className="w-5 h-5" />
                    </span>
                    <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#0b1016]/90 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white whitespace-nowrap shadow-[0_6px_18px_rgba(0,0,0,0.65)] flex items-center gap-1.5 group-hover:bg-white group-hover:text-[#0b1016] transition-all duration-200">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.corto}</span>
                      {esCorreg && item.nodo === 'tierraBomba' && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-full bg-[#e8a86b]/20 text-[#f7c896] group-hover:bg-[#0b1016]/15 group-hover:text-[#0b1016]">
                          Vista 180°
                        </span>
                      )}
                      {!esCorreg && (
                        <span className="text-[10px] font-mono opacity-75">
                          {esPatrimonio ? item.anio : `${item.dia} ${item.mes}`}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* TARJETA ÚNICA IZQUIERDA (O CARD GRANDE AL TOCAR UN ICONO EN TALLERES) */}
      {enVistaAula && catActiva && !panelJuego && !mostrarTalleres && !modalDiagrama && (() => {
        const IconoCat = ICONOS_CAT[catActiva.id] || MapPin;
        const idxCat = EXPLORA_CATEGORIAS.findIndex((c) => c.id === catActiva.id);
        const catAnt = idxCat > 0 ? EXPLORA_CATEGORIAS[idxCat - 1] : null;
        const catSig = idxCat < EXPLORA_CATEGORIAS.length - 1 ? EXPLORA_CATEGORIAS[idxCat + 1] : null;

        if (catActiva.id === 'corregimientos' && !corregSel) {
          return <aside className="cf-map-guide cf-villages fixed bottom-32 left-4 md:bottom-6 md:left-6 z-20 w-[min(92vw,25rem)] tc-vidrio p-4">
            <div className="cf-villages-heading"><h2>¿Dónde quieres ir?</h2></div>
            <div className="cf-place-grid grid grid-cols-2 gap-2">{corregimientosIsla.map(cor=><button type="button" key={cor.nodo} onClick={()=>{seleccionarCorregimiento(cor);}} className="cf-village-button"><Home aria-hidden="true" size={28}/><span>{cor.corto}</span><ArrowRight size={19}/></button>)}</div>
          </aside>;
        }

        if (catActiva.id === 'corregimientos' && corregSel) {
          const cor = corregSel;
          const IconoCor = cor.Icon || MapPin;
          const idxCor = Math.max(0, corregimientosIsla.findIndex((c) => c.nodo === cor.nodo));
          const corAnt = corregimientosIsla[(idxCor - 1 + corregimientosIsla.length) % corregimientosIsla.length];
          const corSig = corregimientosIsla[(idxCor + 1) % corregimientosIsla.length];
          const fichaActual = cor.fichas[corregSecIdx] || cor.fichas[0];
          const sigFichaIdx = (corregSecIdx + 1) % cor.fichas.length;
          return (
            <div className="cf-place-dialog fixed inset-0 z-30 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-[min(94vw,32rem)] tc-paso-anim">
                <CardIluminada
                  color={cor.color}
                  className="tc-vidrio p-5 md:p-6 rounded-3xl border shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
                    <button
                      type="button"
                      onClick={() => {
                        setCorregSel(null);
                        setVistaRecorrido('planta');
                        escena?.vista?.reset?.();
                        escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
                      }}
                      className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ver toda la isla</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-wider">
                        {idxCor + 1} / {corregimientosIsla.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCorregSel(null);
                          setVistaRecorrido('planta');
                          escena?.vista?.reset?.();
                          escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
                        }}
                        aria-label="Cerrar pop-up"
                        className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <span
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-xl"
                      style={{
                        backgroundColor: `${cor.color}22`,
                        borderColor: cor.color,
                        color: cor.color,
                      }}
                    >
                      <IconoCor className="w-8 h-8" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: cor.color }}>
                        {cor.zona}
                      </div>
                      <h3 className="text-xl font-extrabold text-white leading-tight mt-0.5">{cor.nombre}</h3>
                    </div>
                  </div>

                  
                  <div className="space-y-2.5 pt-2 border-t border-white/15">
                    <div className="flex flex-wrap gap-1.5">
                      {cor.fichas.map((f, i) => {
                        const activa = i === corregSecIdx;
                        return (
                          <button
                            key={f.titulo}
                            type="button"
                            onClick={() => setCorregSecIdx(i)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                              activa
                                ? 'text-[#0b1016] shadow-md'
                                : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                            }`}
                            style={activa ? { backgroundColor: cor.color } : undefined}
                          >
                            {f.titulo}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCorregSecIdx(sigFichaIdx)}
                      className="w-full text-left rounded-2xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/15 p-4 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: cor.color }}>
                          {fichaActual.titulo}
                        </span>
                        <span className="text-[10px] font-bold text-white/60 group-hover:text-white flex items-center gap-1">
                          <span>Siguiente dato</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <p className="text-sm text-white/95 leading-relaxed">{fichaActual.texto}</p>
                    </button>
                  </div>

                  <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => seleccionarCorregimiento(corAnt)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => seleccionarCorregimiento(corSig)}
                      className="px-4 py-2 rounded-xl bg-white text-[#0b1016] hover:bg-white/90 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg transition"
                    >
                      <span>Siguiente corregimiento</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {cor.nodo === 'tierraBomba' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCorregSel(null);
                        setVer180(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#e8a86b] hover:brightness-110 text-xs font-black text-[#0b1016] flex items-center justify-center gap-2 cursor-pointer shadow-xl transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ver panorámica 180° de Tierra Bomba</span>
                    </button>
                  )}
                  {cor.nodo === 'canoDeLoro' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCorregSel(null);
                        setCano180Idx(0);
                        setVer180Cano(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#35d08a] hover:brightness-110 text-xs font-black text-[#0b1016] flex items-center justify-center gap-2 cursor-pointer shadow-xl transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ver carrusel 180° de Caño de Loro (4 vistas)</span>
                    </button>
                  )}
                </CardIluminada>
              </div>
            </div>
          );
        }

        if (catActiva.id === 'patrimonio' && !patrimonioSel) {
          const patAct = patrimoniosIsla[patPreviewIdx % patrimoniosIsla.length] || patrimoniosIsla[0];
          const IconoPatAct = patAct.Icon || Landmark;
          return (
            <div className="cf-map-guide fixed bottom-32 left-4 md:bottom-6 md:left-6 z-20 max-h-[calc(100svh-17rem)] overflow-y-auto w-[min(92vw,25rem)] tc-vidrio p-4 tc-paso-anim space-y-3 border-l-2 border-l-[#f4f1ec]">
              <div className="flex items-start justify-between gap-2">
                <div key={patAct.nodo} className="flex items-center gap-3 min-w-0 tc-paso-anim">
                  <span
                    className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${patAct.color}20`, borderColor: `${patAct.color}55`, color: patAct.color }}
                  >
                    <IconoPatAct className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/65">
                      Patrimonio · {patAct.anio}
                    </div>
                    <div className="text-sm font-bold text-white truncate">{patAct.nombre}</div>
                    <div className="text-[11px] text-white/65 truncate">{patAct.ubicacion}</div>
                  </div>
                </div>
                <button type="button" onClick={() => setCatActiva(null)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition shrink-0 cursor-pointer" aria-label="Ocultar guía">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {onExplorarCanal && <button type="button" onClick={() => onExplorarCanal(patAct.nodo)} className="w-full p-3 border border-[#ef9a79]/40 bg-[#ef9a79]/10 text-[#ef9a79] text-left text-sm flex items-center justify-between gap-3"><span>Ver este lugar en movimiento</span><ArrowRight size={18}/></button>}

              <p key={`${patAct.nodo}-txt`} className="cf-guide-description text-xs text-white/85 leading-relaxed line-clamp-2 tc-paso-anim">
                {patAct.secciones?.[0]?.texto}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {patrimoniosIsla.map((p, idx) => (
                  <button
                    key={p.nodo}
                    type="button"
                    onClick={() => {
                      setPatPreviewIdx(idx);
                      if (['sanFernando','sanJose','sanRafael','casco'].includes(p.nodo)) seleccionarPatrimonio(p);
                      else escena?.irANodo?.(p.nodo, 280);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                      idx === patPreviewIdx % patrimoniosIsla.length
                        ? 'bg-white text-[#0b1016] shadow-sm'
                        : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {p.corto}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoTourActivo(false);
                    seleccionarPatrimonio(patAct);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white text-[#0b1016] hover:bg-white/90 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <span>Abrir ficha de {patAct.corto}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoTourActivo((v) => !v)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                    autoTourActivo ? 'bg-[#e8a86b] text-[#0b1016]' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {autoTourActivo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoTourActivo ? 'Pausar' : 'Tour'}</span>
                </button>
              </div>
            </div>
          );
        }

        if (catActiva.id === 'patrimonio' && patrimonioSel) {
          const pat = patrimonioSel;
          const IconoPat = pat.Icon || Landmark;
          const idxPat = Math.max(0, patrimoniosIsla.findIndex((p) => p.nodo === pat.nodo));
          const patAnt = patrimoniosIsla[(idxPat - 1 + patrimoniosIsla.length) % patrimoniosIsla.length];
          const patSig = patrimoniosIsla[(idxPat + 1) % patrimoniosIsla.length];
          return (
            <aside className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-20 w-[min(94vw,32rem)] max-h-[82svh] overflow-y-auto tc-paso-anim">
              <CardIluminada
                color={pat.color}
                className="tc-vidrio p-5 rounded-2xl border shadow-2xl space-y-3.5"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      setPatrimonioSel(null);
                      escena?.vista?.reset?.();
                      escena?.set({ cam: 'isla_completa', nodosActivos: [] });
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ver todos los fuertes</span>
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-wider">
                    Patrimonio Histórico
                  </span>
                </div>

                {/* ICONO GRANDE + TÍTULO + AÑO */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-xl"
                    style={{
                      backgroundColor: `${pat.color}22`,
                      borderColor: pat.color,
                      color: pat.color,
                    }}
                  >
                    <IconoPat className="w-8 h-8" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: pat.color }}>
                      {pat.ubicacion}
                    </div>
                    <h3 className="text-base md:text-lg font-extrabold text-white leading-tight mt-0.5">
                      {pat.nombre}
                    </h3>
                  </div>
                  <div
                    className="px-3 py-2 rounded-2xl text-[#0b1016] flex flex-col items-center justify-center text-center shadow-lg shrink-0"
                    style={{ backgroundColor: pat.color }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">DESDE</span>
                    <span className="text-lg font-black leading-none mt-0.5">{pat.anio}</span>
                  </div>
                </div>

                {onExplorarCanal && ['sanFernando','sanJose','sanRafael','casco'].includes(pat.nodo) && <button type="button" onClick={() => onExplorarCanal(pat.nodo)} className="w-full p-3 border border-[#ef9a79]/40 bg-[#ef9a79]/10 text-[#ef9a79] text-left text-sm flex items-center justify-between gap-3"><span>Ver la animación del lugar</span><ArrowRight size={18}/></button>}

                {/* FICHAS INTERACTIVAS: UNO A LA VEZ AL HACER CLIC */}
                {(() => {
                  const secActual = pat.secciones[patrimonioSecIdx] || pat.secciones[0];
                  const sigSecIdx = (patrimonioSecIdx + 1) % pat.secciones.length;
                  return (
                    <div className="space-y-2.5 pt-2 border-t border-white/15">
                      <div className="flex flex-wrap gap-1.5">
                        {pat.secciones.map((sec, i) => {
                          const activa = i === patrimonioSecIdx;
                          return (
                            <button
                              key={sec.titulo}
                              type="button"
                              onClick={() => setPatrimonioSecIdx(i)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                                activa
                                  ? 'text-[#0b1016] shadow-md'
                                  : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                              }`}
                              style={activa ? { backgroundColor: pat.color } : undefined}
                            >
                              {sec.titulo}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPatrimonioSecIdx(sigSecIdx)}
                        className="w-full text-left rounded-xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/15 p-3.5 cursor-pointer transition group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: pat.color }}>
                            {secActual.titulo}
                          </span>
                          <span className="text-[10px] font-bold text-white/60 group-hover:text-white flex items-center gap-1">
                            <span>Siguiente dato</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-xs md:text-[13px] text-white/90 leading-relaxed">{secActual.texto}</p>
                      </button>
                    </div>
                  );
                })()}

                {pat.fuentes?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pat.fuentes.map((f) => (
                      <a
                        key={f.url}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white/90 inline-flex items-center gap-1 transition"
                      >
                        <span>{f.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-75" />
                      </a>
                    ))}
                  </div>
                )}

                {/* NAVEGACIÓN DIRECTA SIN RETROCEDER */}
                <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => seleccionarPatrimonio(patAnt)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                  <span className="text-[11px] font-bold text-white/70">
                    {idxPat + 1} / {patrimoniosIsla.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => seleccionarPatrimonio(patSig)}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-[#0b1016] hover:bg-white/90 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg transition"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardIluminada>
            </aside>
          );
        }

        if (catActiva.id === 'talleres' && !actividadViernesSel && !mostrarTalleres) {
          const actPreview = actividadesIsla[tallerPreviewIdx % actividadesIsla.length] || actividadesIsla[0];
          const IconoActPrev = actPreview.Icon || Calendar;
          return (
            <div className="cf-map-guide fixed bottom-32 left-4 md:bottom-6 md:left-6 z-20 max-h-[calc(100svh-17rem)] overflow-y-auto w-[min(92vw,25rem)] tc-vidrio p-4 tc-paso-anim space-y-3 border-l-2 border-l-[#e8a86b]">
              <div className="flex items-start justify-between gap-2">
                <div key={actPreview.nodo} className="flex items-center gap-3 min-w-0 tc-paso-anim">
                  <span
                    className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${actPreview.color}20`, borderColor: `${actPreview.color}55`, color: actPreview.color }}
                  >
                    <IconoActPrev className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: actPreview.color }}>
                      Viernes {actPreview.dia} {actPreview.mes} · {actPreview.lugar}
                    </div>
                    <div className="text-sm font-bold text-white truncate">{actPreview.titulo}</div>
                    <div className="text-[11px] text-white/65 truncate">{actPreview.sub}</div>
                  </div>
                </div>
                <button type="button" onClick={() => setCatActiva(null)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition shrink-0 cursor-pointer" aria-label="Ocultar guía">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {actividadesIsla.map((a, idx) => (
                  <button
                    key={a.nodo}
                    type="button"
                    onClick={() => {
                      setTallerPreviewIdx(idx);
                      escena?.irANodo?.(a.nodo, 300);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                      idx === tallerPreviewIdx % actividadesIsla.length
                        ? 'text-[#0b1016] shadow-sm'
                        : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                    }`}
                    style={idx === tallerPreviewIdx % actividadesIsla.length ? { backgroundColor: a.color } : undefined}
                  >
                    {a.corto}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoTourActivo(false);
                    setActividadViernesSel(actPreview);
                    escena?.irANodo?.(actPreview.nodo, 300);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-[#0b1016] flex items-center justify-center gap-1.5 cursor-pointer transition hover:brightness-110"
                  style={{ backgroundColor: actPreview.color }}
                >
                  <span>Inscribirme + Beneficio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoTourActivo((v) => !v)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                    autoTourActivo ? 'bg-white text-[#0b1016]' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {autoTourActivo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoTourActivo ? 'Pausar' : 'Tour'}</span>
                </button>
              </div>
            </div>
          );
        }

        if (catActiva.id === 'talleres' && actividadViernesSel) {
          const act = actividadViernesSel;
          const IconoAct = act.Icon || Hammer;
          const idxAct = Math.max(0, actividadesIsla.findIndex((a) => a.nodo === act.nodo));
          const actAnt = actividadesIsla[(idxAct - 1 + actividadesIsla.length) % actividadesIsla.length];
          const actSig = actividadesIsla[(idxAct + 1) % actividadesIsla.length];
          return (
            <aside className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-20 w-[min(94vw,29rem)] tc-paso-anim">
              <CardIluminada
                color={act.color}
                className="tc-vidrio p-5 rounded-2xl border shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      setActividadViernesSel(null);
                      escena?.vista?.reset?.();
                      escena?.set({ cam: 'isla_completa', nodosActivos: catActiva.nodos });
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ver toda la isla</span>
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#35d08a]/20 border border-[#35d08a]/50 text-[#9ff3c9] text-[10px] font-bold uppercase tracking-wider">
                    Cupos abiertos · Gratis
                  </span>
                </div>

                {/* ICONO GRANDE + FECHA GRANDE */}
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-xl animate-bounce"
                    style={{
                      backgroundColor: `${act.color}22`,
                      borderColor: act.color,
                      color: act.color,
                      animationDuration: '2.4s',
                    }}
                  >
                    <IconoAct className="w-10 h-10" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: act.color }}>
                      {act.lugar}
                    </div>
                    <h3 className="text-lg font-extrabold text-white leading-tight mt-0.5">{act.titulo}</h3>
                    <p className="text-xs text-white/75 mt-1 leading-snug">{act.sub}</p>
                  </div>
                  <div
                    className="w-20 shrink-0 rounded-2xl text-[#0b1016] flex flex-col items-center justify-center p-2 text-center shadow-lg"
                    style={{ backgroundColor: act.color }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">VIERNES</span>
                    <span className="text-3xl font-black leading-none mt-0.5">{act.dia}</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">{act.mes}</span>
                    <span className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded bg-[#0b1016]/15">4:00 PM</span>
                  </div>
                </div>

                {/* FORMULARIO ANIMADO DE INSCRIPCIÓN */}
                <form onSubmit={agendarClaseViernes} className="space-y-2.5 pt-2 border-t border-white/15">
                  <div className="cf-place-grid grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={nombreViernes}
                      onChange={(e) => setNombreViernes(e.target.value)}
                      placeholder="Escribe tu nombre"
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/55 focus:outline-none focus:border-white"
                    />
                    <select
                      value={corregViernes}
                      onChange={(e) => setCorregViernes(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-white"
                    >
                      {['Bocachica', 'Tierra Bomba', 'Caño de Loro', 'Punta Arena'].map((c) => (
                        <option key={c} value={c} className="bg-[#0b1016] text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Beneficio incluido en cada actividad */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/65">
                      Elige tu beneficio incluido en esta actividad
                    </div>
                    <div className="cf-place-grid grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBeneficioViernes('alimentacion')}
                        className={`px-2.5 py-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          beneficioViernes === 'alimentacion'
                            ? 'bg-white/15 border-white text-white shadow-sm'
                            : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Utensils className="w-3.5 h-3.5 shrink-0" style={{ color: act.color }} />
                        <span className="text-[11px] font-semibold leading-tight">Bono de alimentación</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBeneficioViernes('transporte')}
                        className={`px-2.5 py-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          beneficioViernes === 'transporte'
                            ? 'bg-white/15 border-white text-white shadow-sm'
                            : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Anchor className="w-3.5 h-3.5 shrink-0" style={{ color: act.color }} />
                        <span className="text-[11px] font-semibold leading-tight">Cupo ida y vuelta a Cartagena</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-sm font-black text-[#0b1016] flex items-center justify-center gap-2 cursor-pointer shadow-xl transition hover:scale-[1.02] active:scale-[0.99]"
                    style={{ backgroundColor: act.color }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>¡Quiero inscribirme este viernes!</span>
                  </button>
                </form>

                {confirmViernes && (
                  <div className="p-2.5 rounded-xl bg-[#35d08a]/20 border border-[#35d08a]/50 flex items-center gap-2 text-xs text-[#9ff3c9] font-bold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>
                      ¡Inscripción lista! Incluye tu{' '}
                      {beneficioViernes === 'alimentacion'
                        ? 'Bono de alimentación'
                        : 'Cupo ida y vuelta a Cartagena'}{' '}
                      para el viernes {act.dia} {act.mes} (4:00 PM).
                    </span>
                  </div>
                )}

                {/* NAVEGACIÓN DIRECTA ENTRE ACTIVIDADES SIN RETROCEDER */}
                <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => seleccionarActividad(actAnt)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                  <span className="text-[11px] font-bold text-white/70">
                    {idxAct + 1} / {actividadesIsla.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => seleccionarActividad(actSig)}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-[#0b1016] hover:bg-white/90 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg transition"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardIluminada>
            </aside>
          );
        }

        return (
          <aside className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-20 w-[min(92vw,26rem)] max-h-[82svh] overflow-y-auto tc-vidrio p-4 md:p-5 tc-paso-anim shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-[#e0917a]">
                  <IconoCat className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold text-white">{catActiva.label}</span>
              </div>
              <button type="button" onClick={() => setCatActiva(null)} className="text-white/60 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/85 mt-2.5 leading-snug">{catActiva.resumen}</p>

            {catActiva.id !== 'talleres' && (
              <div className="mt-3 grid grid-cols-1 gap-2">
                {catActiva.lugares.map((lug) => {
                  const act = lugarActivo?.nodo === lug.nodo;
                  return (
                    <CardIluminada
                      key={lug.nodo}
                      color={catActiva.color}
                      onClick={() => {
                        setLugarActivo({ titulo: lug.nombre, sub: lug.desc, nodo: lug.nodo });
                        escena?.irANodo?.(lug.nodo, lug.nodo === 'sanFernando' ? 235 : 320);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer ${
                        act
                          ? 'bg-white text-[#0b1016] border-white shadow-lg'
                          : 'border-white/15 bg-white/5 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act ? 'bg-[#e0917a]/20 text-[#b84c31]' : 'bg-white/10 text-[#e0917a]'}`}>
                          <MapPin className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{lug.nombre}</div>
                          <div className={`text-[11px] leading-tight truncate ${act ? 'text-[#0b1016]/75' : 'text-white/65'}`}>{lug.desc}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 flex items-center gap-1 ${
                        act ? 'bg-[#0b1016] text-white' : 'bg-[#e0917a] text-[#0b1016]'
                      }`}>
                        Ver
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardIluminada>
                  );
                })}
              </div>
            )}

            {/* 3 CARDS GRANDES INTERACTIVAS DE LOS VIERNES (SE ILUMINAN AL PASAR EL CURSOR) */}
            {catActiva.id === 'talleres' && (() => {
              const cardsViernes = [
                {
                  ...TEMAS_VIERNES_LISTA[0],
                  dia: proximoViernes.dia,
                  mes: proximoViernes.mes,
                  nodo: 'escuelaR9',
                },
                {
                  ...TEMAS_VIERNES_LISTA[3],
                  dia: '15',
                  mes: 'ENE',
                  nodo: 'ribera',
                },
                {
                  ...TEMAS_VIERNES_LISTA[2],
                  dia: '10',
                  mes: 'FEB',
                  nodo: 'vivero',
                },
              ];
              return (
                <div className="mt-3.5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cardsViernes.map((cv) => {
                      const IconoCard = cv.Icon || Hammer;
                      const activa = temaViernes === cv.titulo;
                      return (
                        <CardIluminada
                          key={cv.id}
                          color={cv.color}
                          onClick={() => {
                            setTemaViernes(cv.titulo);
                            escena?.irANodo?.(cv.nodo, 300);
                          }}
                          className={`rounded-2xl border p-4 cursor-pointer flex flex-col justify-between gap-3 ${
                            activa
                              ? 'bg-white/15 border-white/50 shadow-xl'
                              : 'bg-white/5 border-white/15'
                          }`}
                        >
                          {/* Fila superior: ICONO GRANDE + FECHA GRANDE */}
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/20"
                              style={{ backgroundColor: `${cv.color}22`, color: cv.color }}
                            >
                              <IconoCard className="w-9 h-9" />
                            </span>
                            <div className="text-right leading-none">
                              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cv.color }}>
                                VIERNES · 4:00 PM
                              </div>
                              <div className="text-4xl font-black text-white mt-0.5 tracking-tight">
                                {cv.dia}
                              </div>
                              <div className="text-sm font-extrabold uppercase tracking-widest text-white/85">
                                {cv.mes}
                              </div>
                            </div>
                          </div>

                          {/* Titulo y descripcion */}
                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug">{cv.titulo}</h4>
                            <p className="text-[11px] text-white/70 mt-1 leading-snug">{cv.sub}</p>
                          </div>

                          {/* CTA directo */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTemaViernes(cv.titulo);
                              const nueva = {
                                id: Date.now(),
                                tema: cv.titulo,
                                nombre: nombreViernes.trim() || 'Habitante de la isla',
                                corregimiento: corregViernes,
                                fecha: `Viernes ${cv.dia} ${cv.mes} · 4:00 p.m.`,
                              };
                              const next = [nueva, ...clasesViernes].slice(0, 6);
                              setClasesViernes(next);
                              setConfirmViernes(true);
                              try { localStorage.setItem('tb_clases_viernes_v1', JSON.stringify(next)); } catch { /* ignore */ }
                              setTimeout(() => setConfirmViernes(false), 3500);
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-extrabold text-[#0b1016] flex items-center justify-center gap-1.5 cursor-pointer transition hover:brightness-110"
                            style={{ backgroundColor: cv.color }}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Programar este viernes</span>
                          </button>
                        </CardIluminada>
                      );
                    })}
                  </div>

                  {/* Fila inferior compacta: nombre + corregimiento + confirmación + talleres del mapa */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {catActiva.lugares.map((lug) => (
                        <button
                          key={lug.nodo}
                          type="button"
                          onClick={() => {
                            setLugarActivo({ titulo: lug.nombre, sub: lug.desc, nodo: lug.nodo });
                            escena?.irANodo?.(lug.nodo, 300);
                          }}
                          className="px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-[11px] text-white flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3 h-3 text-[#e8a86b]" />
                          <span>{lug.nombre}</span>
                        </button>
                      ))}
                    </div>
                    {confirmViernes && (
                      <div className="flex items-center gap-1.5 text-xs text-[#35d08a] font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Clase guardada para el viernes.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* CALL TO ACTIONS DE NAVEGACIÓN DIRECTA */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
              {catAnt ? (
                <button
                  type="button"
                  onClick={() => activarCategoria(catAnt)}
                  className="px-3 py-1.5 rounded-xl border border-white/20 text-xs text-white/85 hover:bg-white/10 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : <span />}
              {catSig && (
                <button
                  type="button"
                  onClick={() => activarCategoria(catSig)}
                  className="px-4 py-1.5 rounded-xl bg-white text-[#0b1016] text-xs font-bold hover:bg-white/90 transition flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>{catSig.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </aside>
        );
      })()}

      {enVistaAula && lugarActivo && !catActiva && !panelJuego && !modalDiagrama && (
        <aside className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-20 w-[min(92vw,24rem)] tc-vidrio p-4 tc-paso-anim shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e0917a] shrink-0" />
              <h4 className="text-sm font-semibold text-white">{lugarActivo.titulo}</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setLugarActivo(null);
                escena?.vista?.reset?.();
                escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
              }}
              className="text-white/60 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-white/80 mt-2 leading-relaxed">{lugarActivo.sub}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => activarCategoria(EXPLORA_CATEGORIAS[3])}
              className="px-3.5 py-1.5 rounded-xl bg-[#35d08a] text-[#07140d] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Escuchar bailes y memorias</span>
            </button>
          </div>
        </aside>
      )}

      {/* INFOGRAFÍA INTERACTIVA GRANDE DE MEMORIAS Y SABERES: COMIDA, BAILES Y TRADICIONES */}
      {enVistaAula && panelJuego && !modalDiagrama && (() => {
        const catMem = MEMORIAS_SABERES[memCategoria] || MEMORIAS_SABERES.comida;
        const IconoCatMem = catMem.Icon;
        const pistaMem = memItemSel?.pistaId
          ? PISTAS_MEMORIA.find((p) => p.id === memItemSel.pistaId) || PISTAS_MEMORIA[0]
          : null;
        const sonandoMem = pistaMem && pistaActiva.id === pistaMem.id && musicaSonando;

        return (
          <div className="cf-games-panel fixed inset-0 z-30 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 md:p-8">
            <section className="cf-games-sheet w-full max-w-5xl max-h-[90svh] overflow-y-auto tc-vidrio p-5 md:p-7 rounded-3xl border border-white/20 tc-paso-anim shadow-2xl">
              {/* CABECERA AMPLIA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/20"
                    style={{ backgroundColor: `${catMem.color}25`, color: catMem.color }}
                  >
                    <IconoCatMem className="w-6 h-6" />
                  </span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: catMem.color }}>
                      Tierra Bomba
                    </div>
                    <h2 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                      Cocina, baila y aprende
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (volverFn) { volverFn(); return; }
                    setPanelJuego(false);
                    setMemItemSel(null);
                    escena?.vista?.reset?.();
                    escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
                  }}
                  className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                  <span>{volverFn ? 'Volver al inicio' : 'Volver al mapa'}</span>
                </button>
              </div>

              {/* 3 CATEGORÍAS GRANDES: COMIDA · BAILES · TRADICIONES */}
              <div className="cf-game-tabs grid grid-cols-3 gap-3 mb-6">
                {Object.entries(MEMORIAS_SABERES).map(([key, cat]) => {
                  const IconoTab = cat.Icon;
                  const activa = memCategoria === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setMemCategoria(key);
                        setMemItemSel(null);
                        setMemPasoIdx(0);
                      }}
                      className={`py-3 px-4 rounded-2xl border text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition ${
                        activa
                          ? 'text-[#0b1016] shadow-xl scale-[1.01]'
                          : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                      style={activa ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
                    >
                      <IconoTab className="w-5 h-5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {!memItemSel ? (
                <div className="space-y-4">
                  <div className="cf-ayuda"><p>Toca una foto.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {catMem.items.map((item) => (
                      <CardIluminada
                        key={item.id}
                        color={catMem.color}
                        onClick={() => {
                          setMemItemSel(item);
                          
                          setMemPasoIdx(0);
                          setMemIngMarcados({});
                        }}
                        className="rounded-3xl border border-white/15 bg-white/[0.04] overflow-hidden cursor-pointer flex flex-col"
                      >
                        <div className="relative h-56 md:h-64 overflow-hidden">
                          <img
                            src={item.foto}
                            alt={item.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1016] via-[#0b1016]/25 to-transparent" />
                          <span
                            className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-[#0b1016] shadow-lg"
                            style={{ backgroundColor: catMem.color }}
                          >
                            {catMem.label}
                          </span>
                          <span className="absolute bottom-3 left-4 right-4 text-lg md:text-xl font-extrabold text-white leading-tight">
                            {item.titulo}
                          </span>
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-4">
                          <p className="text-xs md:text-sm text-white/80 leading-relaxed">{item.resumen}</p>
                          <div
                            className="w-full py-3 px-4 rounded-2xl text-xs md:text-sm font-black text-[#0b1016] flex items-center justify-center gap-2 shadow-lg"
                            style={{ backgroundColor: catMem.color }}
                          >
                            <span>{item.etiquetaPaso}</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardIluminada>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMemItemSel(null);
                        setMemPasoIdx(0);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver a {catMem.label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const otro = catMem.items.find((it) => it.id !== memItemSel.id) || catMem.items[0];
                        setMemItemSel(otro);
                        setMemPasoIdx(0);
                        setMemIngMarcados({});
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Cambiar a otra opción</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {memItemSel.id === 'arroz_coco_pescado' && (
                    <JuegoCocinarMojarra
                      onInicio={volverFn}
                      color={catMem.color}
                      onCerrar={() => setMemItemSel(null)}
                    />
                  )}
                  {memItemSel.id === 'dulces_isnelia' && (
                    <JuegoPailaDulce onInicio={volverFn} onCerrar={() => setMemItemSel(null)} />
                  )}
                  {(memItemSel.id === 'bullerengue' || memItemSel.id === 'mapale_cumbia') && (
                    <JuegoBailarCartagenero
                      item={memItemSel}
                      color={catMem.color}
                      sonando={sonandoMem}
                      onToggleMusica={() => pistaMem && toggleMusicaPista(pistaMem)}
                    />
                  )}

                  {/* INFOGRAFÍA DE 2 COLUMNAS */}
                  <div className={`${memItemSel.id === 'arroz_coco_pescado' || memItemSel.id === 'dulces_isnelia' ? 'cf-cook-detail' : ''} grid grid-cols-1 lg:grid-cols-12 gap-5 items-start`}>
                    {/* COLUMNA IZQUIERDA: FOTO GRANDE + MÚSICA + INGREDIENTES/ELEMENTOS */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                        <img
                          src={memItemSel.foto}
                          alt={memItemSel.titulo}
                          className="w-full h-60 md:h-72 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1016] via-[#0b1016]/25 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <div className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: catMem.color }}>
                            {catMem.label} · Tierra Bomba
                          </div>
                          <h3 className="text-xl font-extrabold text-white leading-tight mt-0.5">{memItemSel.titulo}</h3>
                        </div>
                      </div>

                      {pistaMem && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => alternarMusica(pistaMem)}
                            className="flex-1 py-3 px-4 rounded-2xl font-extrabold text-xs md:text-sm text-[#0b1016] flex items-center justify-center gap-2 cursor-pointer transition hover:brightness-110 shadow-xl"
                            style={{ backgroundColor: catMem.color }}
                          >
                            {sonandoMem ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{sonandoMem ? 'Pausar música del baile' : `Reproducir música (${pistaMem.bpm} BPM)`}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = !musicaMute;
                              setMusicaMute(next);
                              repRef.current?.setMuted(next);
                            }}
                            aria-label={musicaMute ? 'Activar sonido' : 'Silenciar'}
                            className="p-3 rounded-2xl border border-white/20 text-white/85 hover:bg-white/10 cursor-pointer"
                          >
                            {musicaMute ? <VolumeX className="w-4 h-4 text-[#e0917a]" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>
                      )}

                      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-white/70 mb-2.5">
                          {memCategoria === 'comida' ? 'Ingredientes (toca para marcar)' : 'Elementos clave'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {memItemSel.ingredientes.map((ing) => {
                            const marcado = !!memIngMarcados[ing];
                            return (
                              <button
                                key={ing}
                                type="button"
                                onClick={() => setMemIngMarcados((prev) => ({ ...prev, [ing]: !prev[ing] }))}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border ${
                                  marcado
                                    ? 'bg-[#35d08a]/25 border-[#35d08a]/60 text-[#9ff3c9]'
                                    : 'bg-white/10 border-white/15 text-white/90 hover:bg-white/20'
                                }`}
                              >
                                {marcado && <Check className="w-3.5 h-3.5" />}
                                <span>{ing}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* COLUMNA DERECHA: INFOGRAFÍA PASO A PASO INTERACTIVA */}
                    {(() => {
                      const pasoActualMem = memItemSel.pasos[memPasoIdx] || memItemSel.pasos[0];
                      const antIdx = (memPasoIdx - 1 + memItemSel.pasos.length) % memItemSel.pasos.length;
                      const sigIdx = (memPasoIdx + 1) % memItemSel.pasos.length;
                      return (
                        <div className="lg:col-span-7 flex flex-col justify-between gap-4 rounded-3xl bg-white/[0.04] border border-white/15 p-5 md:p-6">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <span className="text-xs font-black uppercase tracking-widest" style={{ color: catMem.color }}>
                                {memItemSel.etiquetaPaso}
                              </span>
                              <span className="text-xs font-bold text-white/70">
                                Paso {memPasoIdx + 1} de {memItemSel.pasos.length}
                              </span>
                            </div>

                            {/* LÍNEA DE TIEMPO VISUAL CONECTADA */}
                            <div className="grid grid-cols-4 gap-2 mb-5">
                              {memItemSel.pasos.map((p, idx) => {
                                const activo = idx === memPasoIdx;
                                const pasado = idx < memPasoIdx;
                                return (
                                  <button
                                    key={p.titulo}
                                    type="button"
                                    onClick={() => setMemPasoIdx(idx)}
                                    className={`p-2.5 rounded-2xl border text-left cursor-pointer transition ${
                                      activo
                                        ? 'text-[#0b1016] shadow-xl scale-[1.03]'
                                        : pasado
                                          ? 'bg-white/15 border-white/25 text-white'
                                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/15'
                                    }`}
                                    style={activo ? { backgroundColor: catMem.color, borderColor: catMem.color } : undefined}
                                  >
                                    <div className="text-[10px] font-black uppercase tracking-wider opacity-80">
                                      Paso {idx + 1}
                                    </div>
                                    <div className="text-xs font-bold truncate mt-0.5">
                                      {p.titulo.replace(/^\d+\.\s*/, '')}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* TARJETA GRANDE DEL PASO ACTIVO */}
                            <CardIluminada
                              color={catMem.color}
                              onClick={() => setMemPasoIdx(sigIdx)}
                              className="rounded-2xl border border-white/20 bg-[#0b1016]/75 p-5 md:p-6 cursor-pointer"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <span
                                  className="w-14 h-14 rounded-2xl text-2xl font-black text-[#0b1016] flex items-center justify-center shrink-0 shadow-lg"
                                  style={{ backgroundColor: catMem.color }}
                                >
                                  {memPasoIdx + 1}
                                </span>
                                <div>
                                  <div className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: catMem.color }}>
                                    {catMem.label} · Infografía interactiva
                                  </div>
                                  <h4 className="text-lg md:text-xl font-extrabold text-white leading-snug">
                                    {pasoActualMem.titulo.replace(/^\d+\.\s*/, '')}
                                  </h4>
                                </div>
                              </div>
                              <p className="text-sm md:text-base text-white/90 leading-relaxed">
                                {pasoActualMem.texto}
                              </p>
                            </CardIluminada>
                          </div>

                          {/* CONTROLES DE NAVEGACIÓN DE LA INFOGRAFÍA */}
                          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setMemPasoIdx(antIdx)}
                              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs md:text-sm font-bold text-white flex items-center gap-2 cursor-pointer transition"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Anterior</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setMemPasoIdx(sigIdx)}
                              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-black text-[#0b1016] flex items-center gap-2 cursor-pointer shadow-xl transition hover:brightness-110"
                              style={{ backgroundColor: catMem.color }}
                            >
                              <span>Siguiente paso</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </section>
          </div>
        );
      })()}

      {/* VISOR PANORÁMICO 180° DE TIERRA BOMBA (AL PRESIONAR 2 VECES TIERRA BOMBA) */}
      {ver180 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
          <div className="relative w-full max-w-5xl h-[86svh] rounded-3xl overflow-hidden border border-white/25 bg-[#0b1016] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/15 bg-[#0b1016]/95">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8a86b] text-[#0b1016] text-[11px] font-black uppercase tracking-wider">
                  180°
                </span>
                <div>
                  <div className="text-sm font-extrabold text-white leading-tight">Tierra Bomba · Panorámica 180°</div>
                  <div className="text-[11px] text-white/65">Arrastra para girar 180° · Usa la rueda o pellizca para acercar</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVer180(false);
                  setVistaRecorrido('planta');
                  escena?.vista?.reset?.();
                  escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
                }}
                className="px-3.5 py-1.5 rounded-full bg-white text-[#0b1016] hover:bg-white/90 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
                <span>Cerrar 180°</span>
              </button>
            </div>
            <iframe
              src={`${MEMORIAS_BASE}panoramas/tierra-bomba-180.html`}
              title="Panorámica 180 grados de Tierra Bomba"
              className="w-full flex-1 border-0 bg-[#101b1d]"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* CARRUSEL PANORÁMICO 360° DE CAÑO DE LORO (AL PRESIONAR 2 VECES CAÑO DE LORO) */}
      {ver180Cano && (() => {
        const VISTAS_CANO = [
          {
            id: 'general',
            titulo: 'Vista general',
            sub: 'Panorámica principal de Caño de Loro',
            archivo: 'panoramas/cano-de-loro/general.html',
            popups: [
              { etiqueta: 'Historia', titulo: 'Origen y memoria de Caño de Loro', texto: 'Comunidad resiliente asentada entre esteros de manglar y aguas calmas de la bahía de Cartagena. Su historia está ligada al cuidado del mangle, la pesca artesanal y la reconstrucción colectiva.' },
              { etiqueta: 'Territorio', titulo: 'Entre el manglar y la bahía', texto: 'Su paisaje conecta canales de mangle rojo, senderos de arena coralina y frentes de agua donde atracan las lanchas comunitarias.' },
            ],
          },
          {
            id: 'costa',
            titulo: 'Costa y bahía',
            sub: 'Orilla sobre la bahía y manglares',
            archivo: 'panoramas/cano-de-loro/costa.html',
            popups: [
              { etiqueta: 'Ecosistema', titulo: 'Borde costero y manglares', texto: 'El manglar actúa como barrera natural contra la erosión marina y refugio de peces, cangrejos y aves del Caribe.' },
              { etiqueta: 'Llegada en lancha', titulo: 'Acceso desde Cartagena', texto: 'Desde el Muelle de la Bodeguita o Bazurto, las lanchas cruzan la bahía hacia el costado oriental de Tierra Bomba en unos 20 minutos.' },
            ],
          },
          {
            id: 'pueblo',
            titulo: 'El pueblo',
            sub: 'Calles y viviendas tradicionales',
            archivo: 'panoramas/cano-de-loro/pueblo.html',
            popups: [
              { etiqueta: 'Arquitectura', titulo: 'Vivienda caribeña y patios', texto: 'Casas de un piso con terrazas sombreadas, techos metálicos a dos aguas y patios compartidos donde se teje la vida diaria.' },
              { etiqueta: 'Comunidad', titulo: 'Oficios y saberes vivos', texto: 'Pescadores de chinchorro, cocineras tradicionales y jóvenes que lideran jornadas de siembra de manglar y aula abierta.' },
            ],
          },
          {
            id: 'iglesia',
            titulo: 'Iglesia',
            sub: 'Patrimonio e historia de la comunidad',
            archivo: 'panoramas/cano-de-loro/iglesia.html',
            popups: [
              { etiqueta: 'Patrimonio', titulo: 'Iglesia de Caño de Loro', texto: 'Punto de encuentro espiritual e histórico del corregimiento, testimonio de la permanencia y la identidad de sus familias.' },
              { etiqueta: 'Encuentro', titulo: 'Plaza y celebraciones', texto: 'Alrededor del templo se reúnen las fiestas patronales, los cantos tradicionales y las asambleas comunitarias.' },
            ],
          },
        ];
        const vistaAct = VISTAS_CANO[cano180Idx % VISTAS_CANO.length] || VISTAS_CANO[0];
        const popupsVista = vistaAct.popups || [];
        const popupAct = cano360Popup !== null ? popupsVista[cano360Popup % popupsVista.length] : null;
        const prevVista = () => {
          setCano180Idx((i) => (i - 1 + VISTAS_CANO.length) % VISTAS_CANO.length);
          setCano360Popup(0);
        };
        const nextVista = () => {
          setCano180Idx((i) => (i + 1) % VISTAS_CANO.length);
          setCano360Popup(0);
        };
        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
            <div className="relative w-full max-w-6xl h-[88svh] rounded-3xl overflow-hidden border border-white/25 bg-[#0b1016] shadow-2xl flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/15 bg-[#0b1016]/95">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#35d08a] text-[#07140d] text-[11px] font-black uppercase tracking-wider">
                    360° · {cano180Idx + 1}/4
                  </span>
                  <div>
                    <div className="text-sm font-extrabold text-white leading-tight">
                      Caño de Loro · {vistaAct.titulo}
                    </div>
                    <div className="text-[11px] text-white/65">{vistaAct.sub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {VISTAS_CANO.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setCano180Idx(i);
                        setCano360Popup(0);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        i === cano180Idx
                          ? 'bg-[#35d08a] text-[#07140d]'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {v.titulo}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevVista}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                    aria-label="Vista anterior"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextVista}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                    aria-label="Siguiente vista"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVer180Cano(false);
                      setVistaRecorrido('planta');
                      escena?.vista?.reset?.();
                      escena?.set({ cam: 'isla_completa', cartografia: 0.32, nodosActivos: [] });
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#0b1016] hover:bg-white/90 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Cerrar</span>
                  </button>
                </div>
              </div>

              <div className="relative flex-1 bg-[#101b1d]">
                <iframe
                  key={vistaAct.id}
                  src={`${MEMORIAS_BASE}${vistaAct.archivo}`}
                  title={`Caño de Loro 360° — ${vistaAct.titulo}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />

                {/* BOTONES DE POP-UPS INTERACTIVOS DENTRO DEL 360° */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                  {popupsVista.map((pp, pi) => {
                    const activo = cano360Popup === pi;
                    return (
                      <button
                        key={pp.etiqueta}
                        type="button"
                        onClick={() => setCano360Popup(activo ? null : pi)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg transition cursor-pointer flex items-center gap-1.5 ${
                          activo
                            ? 'bg-[#35d08a] text-[#07140d] border-[#35d08a]'
                            : 'bg-black/70 text-white border-white/25 hover:bg-black/90'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{pp.etiqueta}</span>
                      </button>
                    );
                  })}
                </div>

                {/* POP-UP FLOTANTE DE TEXTO DENTRO DEL 360° */}
                {popupAct && (
                  <div className="absolute bottom-4 left-4 z-10 w-[min(92vw,24rem)] tc-vidrio p-4 rounded-2xl border border-[#35d08a]/40 shadow-2xl tc-paso-anim space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#35d08a]">
                          {vistaAct.titulo} · {popupAct.etiqueta}
                        </div>
                        <h4 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                          {popupAct.titulo}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCano360Popup(null)}
                        className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                        aria-label="Cerrar pop-up 360"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">{popupAct.texto}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                      <span className="text-white/55 font-mono">
                        Nota {(cano360Popup % popupsVista.length) + 1}/{popupsVista.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCano360Popup((i) => ((i ?? 0) + 1) % popupsVista.length)}
                        className="text-[#35d08a] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Siguiente nota</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE VIDRIO TRANSLÚCIDO SOBRE EL MAPA 3D (Cuando el usuario quiere ver un diagrama 2D en detalle) */}
      {modalDiagrama && (
        <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[88svh] overflow-y-auto tc-vidrio p-5 md:p-8 tc-paso-anim">
            <div className="sticky top-0 z-10 flex items-center justify-between pb-3 mb-4 border-b border-white/15 bg-[#070a0e]/85 backdrop-blur-md px-2 py-1.5 rounded">
              <span className="tc-etiqueta !text-[#e0917a]">Explicación visual sobre el mapa de Bocachica</span>
              <button
                type="button"
                onClick={() => setModalDiagrama(null)}
                className="tc-ficha tc-ficha-activa !border-[#e0917a] !text-white"
              >
                âœ• Volver al mapa 3D
              </button>
            </div>
            {modalDiagrama === 'simulador4pasos' && <SimuladorAulaEn4Pasos animPausada={animPausada} />}
            {modalDiagrama === 'redProblema' && <RedProblemaAula />}
            {modalDiagrama === 'memorias' && <SeccionMemoriasYBase />}
            {modalDiagrama === 'plano2D' && <SeccionEsquemaAula />}
            {modalDiagrama === 'hojaRuta' && <SeccionHojaDeRutaYGobernanza />}
          </div>
        </div>
      )}

      {/* =====================================================================
          4 SECCIONES CLARAS AL HACER SCROLL:
          1. Corregimientos -> 2. Patrimonio -> 3. Talleres y Viernes -> 4. Memorias
      ===================================================================== */}
      <section
        id="sec-corregimientos"
        ref={secCorregRef}
        style={{ height: '260svh' }}
        className="relative z-10 pointer-events-none"
        aria-label="Los 4 corregimientos de Tierra Bomba"
      />
      <section
        id="sec-patrimonio"
        ref={secPatrimonioRef}
        style={{ height: '100svh' }}
        className="relative z-10 pointer-events-none"
        aria-label="Patrimonio de Tierra Bomba"
      />
      <section
        id="sec-talleres"
        ref={secTalleresRef}
        style={{ height: '115svh' }}
        className="relative z-10 pointer-events-none"
        aria-label="Talleres, oficios y clases virtuales de los viernes"
      />
      <section
        id="sec-memorias"
        ref={secJuegoRef}
        style={{ height: '115svh' }}
        className="relative z-10 pointer-events-none"
        aria-label="Memorias, bailes y música tradicional de Tierra Bomba"
      />

      {/* =====================================================================
          CIERRE COMPACTO PARA LA COMUNIDAD
      ===================================================================== */}
      <footer id="cap-07" className="relative z-10 bg-black/55 backdrop-blur-md px-6 md:px-16 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          {/* Navegación de retorno a los otros módulos de #/comunidad sin borrar nada */}
          {(volverFn || navegarFn) && (
            <div className="flex flex-wrap items-center justify-between gap-4">
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
            <span>Tierra Bomba · Comunidad y Territorio</span>
            <span>Pontificia Universidad Javeriana · Facultad de Arquitectura y Diseño</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
