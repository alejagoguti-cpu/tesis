import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AULA_META,
  CONTENIDO_INDICE,
  CAP_01,
  CAP_02,
  CAP_03,
  CAP_04,
  CAP_05,
  CAP_06,
  CAP_07,
  CAP_08,
  CAP_09,
  CAP_10,
  CAP_11,
  CAP_12,
  CAP_13,
  CAP_14,
  CAP_15,
  CAP_16,
  CAP_17,
} from '../data/aulaAmbientalData';

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONOS_RED = {
  escuela: 'M3 21V9l9-6 9 6v12M9 21v-7h6v7',
  isla: 'M2 14c3-4 6-4 9 0s6 4 11 0M2 19c3-4 6-4 9 0s6 4 11 0M12 3v7m-3-3 3 3 3-3',
  lugar: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  memoria: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  oficios: 'M8 8l3 3m2 2 3 3M16 8l-3 3m-2 2-3 3M11 9l2 6M6 4a2 2 0 100 4 2 2 0 000-4zM18 4a2 2 0 100 4 2 2 0 000-4zM6 16a2 2 0 100 4 2 2 0 000-4zM18 16a2 2 0 100 4 2 2 0 000-4z',
  pilotos: 'M3 15c3-3 6-3 9 0s6 3 9 0M3 19c3-3 6-3 9 0s6 3 9 0M5 5l5 4-2 4 5 2 5-5 2 3',
  plan: 'M5 21V4M5 4h11l-2 4 2 4H5',
};

function IconoSvg({ d, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

function Escribir({ texto }) {
  const [n, setN] = useState(reduceMotion() ? texto.length : 0);
  useEffect(() => {
    if (reduceMotion()) {
      setN(texto.length);
      return undefined;
    }
    setN(0);
    const id = setInterval(() => {
      setN((x) => {
        if (x >= texto.length) {
          clearInterval(id);
          return x;
        }
        return x + 3;
      });
    }, 14);
    return () => clearInterval(id);
  }, [texto]);
  return (
    <>
      {texto.slice(0, n)}
      <span
        className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-[#4fb6b0]"
        style={{ opacity: n < texto.length ? 0.9 : 0 }}
      />
    </>
  );
}

function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const scroller = el.closest('[data-aula-scroller]') || window;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(clamp01((vh * 0.88 - r.top) / (r.height + vh * 0.42)));
    };
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="transition-opacity duration-300"
          style={{ opacity: p * words.length * 1.2 > i ? 1 : 0.22 }}
        >
          {w}{' '}
        </span>
      ))}
    </p>
  );
}

/** Tabla de datos accesible y adaptable con encabezados fijos y vista apilada en contenedores estrechos */
function TablaAula({ tabla }) {
  const styleVars = {};
  tabla.columnas.forEach((col, idx) => {
    styleVars[`--label-${idx + 1}`] = `"${col}"`;
  });

  return (
    <div
      tabIndex={0}
      role="region"
      aria-labelledby={`${tabla.id}-caption`}
      className="tc-table-wrapper mt-6"
    >
      <table className="tc-table" style={styleVars}>
        <caption
          id={`${tabla.id}-caption`}
          className="px-4 py-3 text-left text-xs font-medium tracking-wide text-white/75 border-b border-white/12 bg-[#0b1015]"
        >
          <span className="tc-etiqueta text-[#4fb6b0] mr-2">{tabla.titulo.split('·')[0]}</span>
          <span>{tabla.titulo.split('·')[1] || ''}</span>
        </caption>
        <thead>
          <tr>
            {tabla.columnas.map((col) => (
              <th key={col} scope="col">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((fila, rIdx) => (
            <tr key={`${tabla.id}-r-${rIdx}`}>
              <th scope="row">{fila[0]}</th>
              {fila.slice(1).map((celda, cIdx) => (
                <td key={`${tabla.id}-r-${rIdx}-c-${cIdx}`}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bloque editorial de dos columnas idéntico a Social.jsx de tesis_tercer_corte */
function BloqueCapitulo({ id, num, titulo, bajada, fuente, pag, children }) {
  return (
    <section id={id} className="border-t border-white/18 py-16 sm:py-24 scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:gap-16">
        <header className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center gap-2.5">
            <p className="tc-etiqueta text-[#4fb6b0]">{num} · Capítulo</p>
            {pag && (
              <span className="tc-etiqueta rounded border border-white/15 bg-white/5 px-2 py-0.5 text-white/55">
                Pág. {pag}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
            {titulo}
          </h2>
          {bajada && <p className="mt-3 text-sm leading-relaxed text-white/60">{bajada}</p>}
          {fuente && (
            <p className="mt-5 border-t border-white/12 pt-3 text-[11px] leading-snug text-white/45">
              Referencias: {fuente}
            </p>
          )}
        </header>
        <div className="min-w-0 space-y-8">{children}</div>
      </div>
    </section>
  );
}

/** Red conceptual interactiva inspirada en Red.jsx de tesis_tercer_corte */
function RedConceptualAula({ figura }) {
  const { centro, nodos } = figura;
  const [vistos, setVistos] = useState(nodos.length + 1);
  const [foco, setFoco] = useState(0);
  const total = nodos.length + 1;
  const completo = vistos >= total;

  const revelar = () => {
    if (completo) {
      setVistos(1);
      setFoco(0);
      return;
    }
    setVistos((v) => v + 1);
    setFoco(vistos);
  };

  const detalle = foco === 0 ? centro.detalle : nodos[foco - 1]?.detalle || '';

  const rutas = useMemo(
    () =>
      nodos.map((n) => {
        const [x, y] = n.pos;
        const sx = 500;
        const sy = 300;
        const ex = x * 10;
        const ey = y * 6;
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2;
        const k = 0.2;
        return `M${sx} ${sy} Q${mx + (sy - ey) * k} ${my + (ex - sx) * k * 0.6} ${ex} ${ey}`;
      }),
    [nodos]
  );

  return (
    <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="tc-etiqueta text-[#4fb6b0]">{figura.titulo}</p>
          <p className="mt-1 text-xs text-white/55">
            Toca cada nodo para explorar su función en la secuencia conceptual del programa.
          </p>
        </div>
        <button type="button" onClick={revelar} className="tc-ficha">
          {completo ? 'Reiniciar recorrido paso a paso ⟲' : 'Revelar siguiente nodo →'}
        </button>
      </div>

      {/* Esquema direccional fiel a la Figura 1 de la página 7 */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ['01 · Tierra Bomba', 'Relaciones insulares', '→ Bocachica'],
          ['02 · Bocachica', 'Núcleo de trabajo', '→ Memorias vivas'],
          ['03 · Memorias vivas', 'Relatos y prácticas', '↓ Vernacularidad'],
          ['06 · Planificación', 'Decisiones compartidas', '↓ Campos territoriales'],
          ['05 · Aula Ambiental', 'Investigar y aprender', '← Vernacularidad / → Planificación'],
          ['04 · Vernacularidad', 'Saberes y materialidad', '← Memorias vivas / → Aula Ambiental'],
        ].map(([t, sub, dir]) => (
          <div
            key={t}
            className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-white">{t}</p>
              <p className="text-xs text-white/60">{sub}</p>
            </div>
            <p className="tc-etiqueta mt-2 text-[#4fb6b0]">{dir}</p>
          </div>
        ))}
        <div className="sm:col-span-3 rounded-xl border border-[#c86d51]/40 bg-[#c86d51]/10 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-white">
            Agua · residuos · vegetación · oficios · patrimonio
          </p>
          <p className="text-xs text-white/75">
            Campos de experimentación y cuidado territorial (alimentan el Aula Ambiental ↑ y reciben decisiones de Planificación ↓)
          </p>
        </div>
      </div>

      {/* Red interactiva con partículas de tesis_tercer_corte */}
      <div className="relative mt-6 h-[29rem] w-full sm:h-[32rem]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g-aula-red" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
              <stop offset="0" stopColor="#4fb6b0" />
              <stop offset="1" stopColor="#c86d51" />
            </linearGradient>
          </defs>
          {rutas.map((d, i) => {
            const on = i + 1 < vistos;
            return (
              <g key={i}>
                <path d={d} className="tc-red-enlace-base" />
                <path
                  d={d}
                  pathLength="1"
                  className="tc-red-enlace"
                  style={{ strokeDashoffset: on ? 0 : 1 }}
                  stroke="url(#g-aula-red)"
                />
                {on &&
                  !reduceMotion() &&
                  [0, 1.7].map((b) => (
                    <circle key={b} r="3.2" fill="#fff" opacity="0.9">
                      <animateMotion dur="3.6s" begin={`${b}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>

        <button
          type="button"
          onClick={() => setFoco(0)}
          aria-pressed={foco === 0}
          className="tc-red-nodo tc-red-centro absolute left-1/2 top-1/2 z-10"
          style={{ '--mw': '6.5rem' }}
        >
          <span className="tc-red-anillo" aria-hidden="true" />
          <span className="tc-red-anillo tc-red-anillo-2" aria-hidden="true" />
          <IconoSvg d={ICONOS_RED[centro.icono]} className="text-[#4fb6b0]" />
          <strong>{centro.titulo}</strong>
          <small>{centro.sub}</small>
        </button>

        {nodos.map((n, i) => {
          const on = i + 1 < vistos;
          const [x, y] = n.pos;
          return (
            <button
              key={n.titulo}
              type="button"
              tabIndex={on ? 0 : -1}
              aria-hidden={!on}
              onClick={() => on && setFoco(i + 1)}
              aria-pressed={foco === i + 1}
              className={`tc-red-nodo absolute z-10 ${on ? 'tc-red-visto' : 'tc-red-oculto'}`}
              style={{
                left: `clamp(var(--mw), ${x}%, calc(100% - var(--mw)))`,
                top: `${y}%`,
                animationDelay: `${(i % 3) * 0.5}s`,
                '--mw': 'var(--mwnodo)',
              }}
            >
              <IconoSvg d={ICONOS_RED[n.icono]} className="text-[#4fb6b0]" />
              <strong>{n.titulo}</strong>
              <small>{n.sub}</small>
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[4.5rem] border-t border-white/15 pt-4">
        <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base" aria-live="polite">
          <Escribir key={foco} texto={detalle} />
        </p>
      </div>
    </div>
  );
}

/** Pestañas accesibles para las matrices de actores (Tabla 10 y Tabla 11) siguiendo modern-web-guidance `tabs` */
function MatricesActoresTabs() {
  const [tabActiva, setTabActiva] = useState('tabla10');
  const panel10Ref = useRef(null);
  const panel11Ref = useRef(null);
  const panelAmbasRef = useRef(null);

  useEffect(() => {
    const entries = [
      ['tabla10', panel10Ref.current],
      ['tabla11', panel11Ref.current],
      ['ambas', panelAmbasRef.current],
    ];
    const cleanups = entries.map(([id, el]) => {
      if (!el) return () => {};
      const onBeforeMatch = () => setTabActiva(id);
      el.addEventListener('beforematch', onBeforeMatch);
      return () => el.removeEventListener('beforematch', onBeforeMatch);
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const tabs = [
    { id: 'tabla10', label: 'Tabla 10 · Actores principales (9)' },
    { id: 'tabla11', label: 'Tabla 11 · Actores por convocar (6)' },
    { id: 'ambas', label: 'Ver ambas matrices completas' },
  ];

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Matrices de actores y gobernanza"
        className="tc-tablist"
      >
        {tabs.map((t) => {
          const isSelected = tabActiva === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={isSelected ? 'true' : 'false'}
              onClick={(e) => {
                setTabActiva(t.id);
                e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              }}
              className="tc-tab"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        ref={panel10Ref}
        role="tabpanel"
        aria-labelledby="tab-tabla10"
        hidden={tabActiva === 'tabla10' ? undefined : 'until-found'}
      >
        <div className="pt-2">
          <TablaAula tabla={CAP_13.tabla10} />
        </div>
      </div>

      <div
        ref={panel11Ref}
        role="tabpanel"
        aria-labelledby="tab-tabla11"
        hidden={tabActiva === 'tabla11' ? undefined : 'until-found'}
      >
        <div className="pt-2">
          <TablaAula tabla={CAP_13.tabla11} />
        </div>
      </div>

      <div
        ref={panelAmbasRef}
        role="tabpanel"
        aria-labelledby="tab-ambas"
        hidden={tabActiva === 'ambas' ? undefined : 'until-found'}
      >
        <div className="space-y-6 pt-2">
          <TablaAula tabla={CAP_13.tabla10} />
          <TablaAula tabla={CAP_13.tabla11} />
        </div>
      </div>
    </div>
  );
}

/** Cronograma interactivo de 24 meses (Figura 4 de la página 17) */
function Cronograma24Meses() {
  const [semFiltro, setSemFiltro] = useState('todos');
  const [filaActiva, setFilaActiva] = useState(CAP_12.cronogramaFilas[0]);

  const rangoMeses = useMemo(() => {
    if (semFiltro === 's1') return [1, 6];
    if (semFiltro === 's2') return [7, 12];
    if (semFiltro === 's3') return [13, 18];
    if (semFiltro === 's4') return [19, 24];
    return [1, 24];
  }, [semFiltro]);

  const meses = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="tc-etiqueta text-[#4fb6b0]">Figura 4 · Cronograma propuesto de 24 meses</p>
          <p className="mt-1 text-xs text-white/60">
            Los 24 meses son relativos al inicio acordado. La validación, el archivo y la gobernanza acompañan todo el proceso.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por semestre">
          {[
            ['todos', '24 meses'],
            ['s1', 'Sem 1 (M1–6)'],
            ['s2', 'Sem 2 (M7–12)'],
            ['s3', 'Sem 3 (M13–18)'],
            ['s4', 'Sem 4 (M19–24)'],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              className="tc-ficha"
              aria-pressed={semFiltro === k}
              onClick={() => setSemFiltro(k)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula mes a mes 1..24 */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[13.5rem_repeat(24,minmax(0,1fr))] items-center gap-[2px] border-b border-white/15 pb-2">
            <span className="tc-etiqueta text-white/50">Actividad</span>
            {meses.map((m) => {
              const enRango = m >= rangoMeses[0] && m <= rangoMeses[1];
              const esHito = [3, 6, 9, 12, 18, 24].includes(m);
              return (
                <span
                  key={m}
                  className={`tc-num text-center text-[11px] ${
                    esHito ? 'text-[#4fb6b0] font-bold' : enRango ? 'text-white/75' : 'text-white/25'
                  }`}
                >
                  {m}
                </span>
              );
            })}
          </div>

          <div className="mt-2 space-y-1.5">
            {CAP_12.cronogramaFilas.map((f) => {
              const seleccionada = filaActiva?.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilaActiva(f)}
                  className={`grid w-full grid-cols-[13.5rem_repeat(24,minmax(0,1fr))] items-center gap-[2px] rounded-md px-1.5 py-1.5 text-left transition-colors cursor-pointer ${
                    seleccionada ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="pr-2 text-xs font-medium text-white/90 truncate">{f.actividad}</span>
                  {meses.map((m) => {
                    const activa = m >= f.inicio && m <= f.fin;
                    const enSemestre = m >= rangoMeses[0] && m <= rangoMeses[1];
                    return (
                      <span
                        key={m}
                        className="h-6 rounded-[2px] transition-all duration-300"
                        style={{
                          background: activa
                            ? f.color
                            : 'rgba(255, 255, 255, 0.05)',
                          opacity: activa ? (enSemestre ? 0.92 : 0.25) : 1,
                        }}
                      />
                    );
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detalle de la actividad seleccionada */}
      {filaActiva && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-3 text-xs text-white/75">
          <div>
            <span className="tc-etiqueta text-[#4fb6b0] mr-2">
              {filaActiva.tipo === 'transversal' ? 'Eje continuo (24 meses)' : 'Fase escalonada'}
            </span>
            <strong className="text-white">{filaActiva.actividad}</strong>
          </div>
          <span className="tc-num text-white/60">
            Ventana propuesta: Mes {filaActiva.inicio} al Mes {filaActiva.fin}
          </span>
        </div>
      )}

      {/* Hitos propuestos */}
      <div className="mt-6 border-t border-white/14 pt-5">
        <p className="tc-etiqueta text-white/50">Hitos propuestos del programa</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAP_12.hitos.map((h) => (
            <div
              key={h.mes}
              className="rounded-xl border border-white/12 bg-white/[0.03] p-3.5 transition-colors hover:border-[#4fb6b0]"
            >
              <p className="tc-num text-lg font-bold text-[#4fb6b0]">{h.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/80">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MACRO_NAV = [
  { id: 'aula-portada', corto: 'Portada' },
  { id: 'cap-01', corto: '01 Resumen' },
  { id: 'cap-03', corto: '03 Territorio' },
  { id: 'cap-05', corto: '05 Memorias' },
  { id: 'cap-08', corto: '08 Arquitectura' },
  { id: 'cap-09', corto: '09 Líneas y pilotos' },
  { id: 'cap-10', corto: '10 Gemelo digital' },
  { id: 'cap-11', corto: '11 Metodología' },
  { id: 'cap-12', corto: '12 Cronograma 24m' },
  { id: 'cap-13', corto: '13 Gobernanza' },
  { id: 'cap-17', corto: '17 Ruta y R1–R9' },
];

export default function AulaAmbientalBocachica({
  onBackToPortada,
  onNavigateModule,
  embedded = false,
}) {
  const [capActivo, setCapActivo] = useState('aula-portada');
  const [indiceAbierto, setIndiceAbierto] = useState(false);
  const [lineaSel, setLineaSel] = useState(0);
  const [nivelDigitalSel, setNivelDigitalSel] = useState(0);
  const [cicloSel, setCicloSel] = useState(0);
  const containerRef = useRef(null);

  const irASeccion = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      setCapActivo(id);
      setIndiceAbierto(false);
    }
  };

  useEffect(() => {
    const rootEl = containerRef.current;
    if (!rootEl) return undefined;
    const scroller = rootEl.closest('[data-aula-scroller]') || window;
    const ids = ['aula-portada', ...CONTENIDO_INDICE.map((c) => c.id)];
    const onScroll = () => {
      const vh = window.innerHeight;
      let current = 'aula-portada';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.42) {
          current = id;
        }
      }
      setCapActivo((prev) => (prev === current ? prev : current));
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const capInfo =
    CONTENIDO_INDICE.find((c) => c.id === capActivo) || {
      num: '00',
      titulo: 'Programa marco v0.1',
    };

  const lineaActiva = CAP_09.lineas[lineaSel] || CAP_09.lineas[0];

  return (
    <div
      ref={containerRef}
      id="aula-ambiental-bocachica"
      className="tc-aula relative min-h-screen w-full bg-black text-[#f1f5f9] selection:bg-[#4fb6b0] selection:text-[#00110f]"
    >
      {/* Barra superior flotante de vidrio estilo tesis_tercer_corte */}
      <div className="sticky top-0 z-30 pointer-events-none px-3 pt-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="tc-vidrio pointer-events-auto flex h-10 shrink-0 items-center gap-2.5 !rounded-[12px] px-3.5 text-[0.8rem] font-bold tracking-tight text-white">
            <span className="inline-block h-2 w-2 rounded-full bg-[#4fb6b0]" aria-hidden="true" />
            <span>
              Tierra <span className="text-[#4fb6b0]">Bomba</span> · Aula Ambiental
            </span>
          </div>

          <nav
            aria-label="Capítulos del Programa Marco"
            className="tc-vidrio pointer-events-auto hidden h-10 items-center gap-0.5 !rounded-full px-1.5 xl:flex overflow-x-auto"
          >
            {MACRO_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => irASeccion(item.id)}
                className="tc-nav-cap cursor-pointer"
                aria-current={capActivo === item.id ? 'true' : undefined}
              >
                {item.corto}
              </button>
            ))}
          </nav>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndiceAbierto((v) => !v)}
              aria-expanded={indiceAbierto}
              className="tc-vidrio flex h-10 items-center gap-2 !rounded-[12px] px-3.5 text-xs font-medium text-white/85 hover:text-white cursor-pointer"
            >
              <span className="tc-etiqueta text-[#4fb6b0]">{capInfo.num}</span>
              <span className="hidden sm:inline truncate max-w-[11rem]">{capInfo.titulo}</span>
              <span className="text-white/50">{indiceAbierto ? '▴' : 'Índice 01–17 ▾'}</span>
            </button>

            {onBackToPortada && (
              <button
                type="button"
                onClick={onBackToPortada}
                className="tc-vidrio flex h-10 items-center gap-1.5 !rounded-[12px] px-3 text-xs font-medium text-white/80 hover:text-[#4fb6b0] cursor-pointer"
                title="Subir a la portada de comunidad"
              >
                <span>↑ Portada</span>
              </button>
            )}
          </div>
        </div>

        {/* Cajón desplegable con los 17 capítulos y las 15 tablas */}
        {indiceAbierto && (
          <div className="tc-vidrio pointer-events-auto mx-auto mt-2 max-w-5xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/12 pb-3">
              <p className="tc-etiqueta text-[#4fb6b0]">
                Índice general · 17 Capítulos · 15 Tablas · 4 Figuras (24 páginas)
              </p>
              <button
                type="button"
                onClick={() => setIndiceAbierto(false)}
                className="tc-ficha !min-h-7 !px-2.5"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[60vh] overflow-y-auto pr-1">
              {CONTENIDO_INDICE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => irASeccion(c.id)}
                  className={`flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    capActivo === c.id
                      ? 'bg-[#4fb6b0]/20 text-[#4fb6b0] font-semibold'
                      : 'text-white/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="tc-etiqueta w-6 shrink-0 text-[#4fb6b0]">{c.num}</span>
                  <span className="flex-1 leading-snug">{c.titulo}</span>
                  <span className="tc-etiqueta text-white/35">p.{c.pag}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 00 · PORTADA DEL PROGRAMA MARCO (PÁGINAS 1 Y 2 DEL PDF)               */}
      {/* ===================================================================== */}
      <section
        id="aula-portada"
        className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden border-b border-white/15 px-5 pb-16 pt-28 sm:px-10 lg:px-16"
      >
        <img
          src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`}
          alt="Vista satelital de Tierra Bomba y Bocachica"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_75%] opacity-25"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(79, 182, 176, 0.14), transparent 55%), linear-gradient(to top, #000000 18%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="tc-etiqueta text-[#4fb6b0]">{AULA_META.encabezado}</p>
          <p className="tc-etiqueta mt-1.5 text-white/55">{AULA_META.version}</p>

          <h1 className="mt-5 text-[clamp(2.8rem,8.5vw,6.8rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-white">
            Tierra Bomba,
            <br />
            <span className="text-[#4fb6b0]">Aula Ambiental</span>
          </h1>

          <div className="mt-6 h-px w-28 bg-[#4fb6b0]" />

          <p className="mt-5 max-w-2xl text-xl font-normal leading-snug text-white/90 sm:text-3xl">
            {AULA_META.subtitulo}
          </p>

          {/* Ficha institucional de portada (Página 1) */}
          <div className="mt-10 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
            <div>
              <p className="tc-etiqueta text-white/45">{AULA_META.promotorRol}</p>
              <p className="mt-1.5 text-base font-semibold text-white">{AULA_META.promotorNombre}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/65">{AULA_META.institucion}</p>
            </div>
            <div>
              <p className="tc-etiqueta text-white/45">Fecha y horizonte</p>
              <p className="tc-num mt-1.5 text-base font-semibold text-white">{AULA_META.fecha}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/65">{AULA_META.horizonte}</p>
            </div>
            <div className="rounded-xl border border-[#4fb6b0]/35 bg-[#4fb6b0]/[0.07] p-4">
              <p className="tc-etiqueta text-[#4fb6b0]">Alcance de esta versión</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/85">{AULA_META.notaPortada}</p>
            </div>
          </div>

          {/* Índice interactivo y Lectura del documento (Página 2) */}
          <div className="mt-12 rounded-2xl border border-white/14 bg-[#070a0d]/90 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/12 pb-4">
              <div>
                <p className="tc-etiqueta text-[#4fb6b0]">Página 2 · Contenido del programa marco</p>
                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  Estructura de los 17 capítulos y lectura del documento
                </h2>
              </div>
              <span className="tc-etiqueta text-white/45">Haz clic en cualquier sección para ir a ella</span>
            </div>

            <ol className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {CONTENIDO_INDICE.map((item) => (
                <li key={item.id} className="border-b border-white/10 py-2">
                  <button
                    type="button"
                    onClick={() => irASeccion(item.id)}
                    className="group flex w-full items-baseline gap-3 text-left cursor-pointer"
                  >
                    <span className="tc-etiqueta text-[#4fb6b0] w-6 shrink-0">{item.num}</span>
                    <span className="flex-1 text-xs sm:text-[13px] text-white/85 group-hover:text-[#4fb6b0] transition-colors">
                      {item.titulo}
                    </span>
                    <span className="tc-num text-[11px] text-white/35 group-hover:text-white/70">
                      p.{item.pag}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid gap-4 border-t border-white/12 pt-5 sm:grid-cols-2">
              {AULA_META.lecturaDocumento.map((par, i) => (
                <p key={i} className="text-xs leading-relaxed text-white/65">
                  <strong className="tc-etiqueta text-white/85 mr-2">
                    {i === 0 ? 'Lectura y validación:' : 'Figuras y mes de inicio:'}
                  </strong>
                  {par}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CUERPO PRINCIPAL DE LOS 17 CAPÍTULOS (ESTÉTICA TESIS TERCER CORTE)    */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        {/* ------------------------------------------------------------------- */}
        {/* 01 · RESUMEN EJECUTIVO Y PROPÓSITO DEL PROGRAMA (Pág. 3)            */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-01"
          num="01"
          pag={3}
          titulo="Resumen ejecutivo y propósito del programa"
          bajada="Articulación de investigación, formación y experimentación situada en Tierra Bomba con primer núcleo en Bocachica."
          fuente="Documentos base [R1–R8]"
        >
          <div className="space-y-4 text-[15px] leading-relaxed text-white/82">
            {CAP_01.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="rounded-xl border-l-4 border-[#4fb6b0] bg-[#4fb6b0]/10 p-5">
            <p className="tc-etiqueta text-[#4fb6b0]">Énfasis operativo del arranque</p>
            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-white">
              “{CAP_01.destacado}”
            </p>
          </div>

          <div className="rounded-2xl border border-white/14 bg-white/[0.03] p-5 sm:p-6">
            <p className="tc-etiqueta text-[#c86d51]">Decisión que se propone a los interlocutores</p>
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/90">
              {CAP_01.decisionInterlocutores}
            </p>
          </div>

          <TablaAula tabla={CAP_01.tabla1} />
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 02 · ANTECEDENTES Y BASE DOCUMENTAL (Pág. 4)                        */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-02"
          num="02"
          pag={4}
          titulo="Antecedentes y base documental"
          bajada="Proceso realizado por ACOPI y el proyecto arquitectónico de pregrado dirigido por el Arq. Alejandro Serrano en Bocachica."
          fuente="[R1] a [R8] y R9 (en proceso)"
        >
          <div className="space-y-4 text-[15px] leading-relaxed text-white/82">
            {CAP_02.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <TablaAula tabla={CAP_02.tabla2} />

          {/* R9 en proceso */}
          <div className="rounded-2xl border border-[#4fb6b0]/45 bg-[#091315] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="tc-etiqueta text-[#4fb6b0]">{CAP_02.r9.codigo}</span>
              <span className="tc-etiqueta rounded-full bg-[#4fb6b0]/20 px-3 py-1 text-[#8fe0da]">
                Recursos asegurados para sombra y cancha preescolar
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">{CAP_02.r9.titulo}</h3>
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/85">
              {CAP_02.r9.texto}
            </p>
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 03 · TERRITORIO Y PROBLEMA DE INVESTIGACIÓN (Pág. 5)                */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-03"
          num="03"
          pag={5}
          titulo="Territorio y problema de investigación"
          bajada="Superposición entre función histórica del canal y sus fortificaciones, vida insular cotidiana, oficios del mar y presiones turísticas."
          fuente="[R2–R7], Diagnóstico comunitario [R8]"
        >
          <div className="space-y-4 text-[15px] leading-relaxed text-white/82">
            {CAP_03.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="rounded-xl border-l-4 border-[#c86d51] bg-[#c86d51]/12 p-5">
            <p className="tc-etiqueta text-[#e0917a]">Tensión central del problema</p>
            <p className="mt-2 text-base font-semibold leading-relaxed text-white">
              “{CAP_03.destacado}”
            </p>
          </div>

          <TablaAula tabla={CAP_03.tabla3} />

          <p className="border-t border-white/12 pt-4 text-xs leading-relaxed text-white/60">
            {CAP_03.cierre}
          </p>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 04 · JUSTIFICACIÓN Y PERTINENCIA (Pág. 6)                           */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-04"
          num="04"
          pag={6}
          titulo="Justificación y pertinencia"
          bajada="Cuatro dimensiones de pertinencia: comunitaria y educativa, científica y arquitectónica, territorial y productiva, y acercamiento digital previo."
          fuente="[R1, R4, R5, R6, R7, R8]"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {CAP_04.bloques.map((b, idx) => (
              <article
                key={b.subtitulo}
                className="flex flex-col justify-between rounded-2xl border border-white/14 bg-white/[0.03] p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="tc-etiqueta text-[#4fb6b0]">04.{idx + 1}</span>
                    <span className="tc-etiqueta text-white/40">{b.refs}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">{b.subtitulo}</h3>
                  {b.destacado && (
                    <p className="mt-3 rounded-lg border border-[#4fb6b0]/30 bg-[#4fb6b0]/10 p-3 text-xs leading-relaxed text-[#d6f5f2]">
                      {b.destacado}
                    </p>
                  )}
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/80">
                    {b.parrafos.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 05 · MARCO CONCEPTUAL Y MEMORIAS TERRITORIALES (Pág. 7)             */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-05"
          num="05"
          pag={7}
          titulo="Marco conceptual y memorias territoriales"
          bajada="Tierra Bomba → Bocachica → Memorias vivas y vernacularidad → Aula Ambiental y planificación compartida."
          fuente="[R4, R6]"
        >
          <div className="space-y-4 text-[15px] leading-relaxed text-white/82">
            {CAP_05.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="rounded-xl border-l-4 border-[#4fb6b0] bg-[#4fb6b0]/10 p-4">
            <p className="tc-etiqueta text-[#4fb6b0]">Concepto eje</p>
            <p className="mt-1 text-base font-semibold text-white">“{CAP_05.destacado}”</p>
          </div>

          <RedConceptualAula figura={CAP_05.figura1} />

          <TablaAula tabla={CAP_05.tabla4} />
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 06 · PREGUNTAS DE INVESTIGACIÓN E HIPÓTESIS DE TRABAJO (Pág. 8)     */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-06"
          num="06"
          pag={8}
          titulo="Preguntas de investigación e hipótesis de trabajo"
          bajada="Pregunta articuladora, cinco preguntas específicas y tres hipótesis orientadoras para contrastar en el proceso."
          fuente="Formulación del Programa Marco v0.1"
        >
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-6 sm:p-8">
            <p className="tc-etiqueta text-[#4fb6b0]">Pregunta articuladora</p>
            <ScrollWords
              text={CAP_06.preguntaArticuladora}
              className="mt-4 text-2xl font-bold leading-[1.14] tracking-tight text-white sm:text-3xl lg:text-4xl"
            />
          </div>

          <div>
            <h3 className="tc-etiqueta text-white/55">Preguntas específicas</h3>
            <ol className="tc-regla mt-3">
              {CAP_06.preguntasEspecificas.map((q, i) => (
                <li
                  key={i}
                  className="tc-regla grid grid-cols-[2.5rem_1fr] gap-3 py-4 first:border-t-0 text-sm sm:text-[15px] leading-relaxed text-white/85"
                >
                  <span className="tc-etiqueta text-[#4fb6b0]">{String(i + 1).padStart(2, '0')}</span>
                  <p>{q}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="tc-etiqueta text-white/55">Hipótesis orientadoras</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {CAP_06.hipotesis.map((h) => (
                <div
                  key={h.codigo}
                  className="rounded-2xl border border-white/14 bg-white/[0.03] p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className="tc-num text-2xl font-extrabold text-[#4fb6b0]">{h.codigo}</span>
                    <h4 className="mt-2 text-base font-bold text-white">{h.titulo}</h4>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/75">{h.texto}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/55">{CAP_06.notaHipotesis}</p>
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 07 · OBJETIVOS (Pág. 9)                                             */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-07"
          num="07"
          pag={9}
          titulo="Objetivos"
          bajada="Objetivo general y seis objetivos específicos (OE1 a OE6) con sus evidencias y criterios de revisión."
          fuente="Tabla 5 · Matriz de objetivos"
        >
          <div className="rounded-2xl border border-[#4fb6b0]/35 bg-[#4fb6b0]/[0.06] p-6">
            <p className="tc-etiqueta text-[#4fb6b0]">Objetivo general</p>
            <p className="mt-2 text-base sm:text-lg font-medium leading-relaxed text-white">
              {CAP_07.objetivoGeneral}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAP_07.objetivosEspecificos.map((oe) => (
              <div
                key={oe.codigo}
                className="rounded-xl border border-white/12 bg-white/[0.025] p-5 transition-colors hover:border-[#4fb6b0]/60"
              >
                <div className="flex items-center justify-between">
                  <span className="tc-etiqueta text-[#4fb6b0]">{oe.codigo}</span>
                  <span className="tc-etiqueta text-white/40">{oe.evidencia}</span>
                </div>
                <h3 className="mt-1.5 text-base font-bold text-white">{oe.titulo}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80">{oe.texto}</p>
              </div>
            ))}
          </div>

          <TablaAula tabla={CAP_07.tabla5} />
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 08 · ARQUITECTURA DEL AULA AMBIENTAL (Pág. 10)                      */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-08"
          num="08"
          pag={10}
          titulo="Arquitectura del Aula Ambiental"
          bajada="Cinco componentes conectados que crecen mediante nodos y actividades antes de requerir infraestructura física consolidada."
          fuente="Figura 2 · Arquitectura funcional"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_08.introduccion}</p>

          {/* Figura 2 · Diagrama arquitectónico funcional fiel a la página 10 */}
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-8">
            <p className="tc-etiqueta text-[#4fb6b0]">{CAP_08.figura2.titulo}</p>

            {/* Nivel 1: Gobernanza */}
            <div className="mt-5 rounded-xl border border-[#4fb6b0]/50 bg-[#0d191b] p-4 text-center">
              <p className="text-base font-bold text-white">
                Gobernanza comunitaria e interinstitucional
              </p>
              <p className="mt-1 text-xs text-[#8fe0da]">
                Prioridades · decisiones · recursos · cuidado
              </p>
            </div>

            <div className="my-2 flex justify-center text-[#4fb6b0]" aria-hidden="true">
              ↓
            </div>

            {/* Nivel 2: Tres componentes articulados horizontalmente */}
            <div className="grid gap-3 md:grid-cols-3">
              {[
                CAP_08.figura2.componentes[1],
                CAP_08.figura2.componentes[2],
                CAP_08.figura2.componentes[3],
              ].map((comp, i) => (
                <div
                  key={comp.id}
                  className="rounded-xl border border-white/15 bg-white/[0.04] p-4 text-center"
                >
                  <p className="tc-etiqueta text-[#4fb6b0]">0{i + 1}</p>
                  <h4 className="mt-1 text-base font-bold text-white">{comp.titulo}</h4>
                  <ul className="mt-2.5 space-y-1 text-xs text-white/75">
                    {comp.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="my-2 flex justify-center text-[#4fb6b0]" aria-hidden="true">
              ↘ &nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp; ↙
            </div>

            {/* Nivel 3: Laboratorios y pilotos */}
            <div className="rounded-xl border border-[#c86d51]/50 bg-[#c86d51]/10 p-4 text-center">
              <p className="text-base font-bold text-white">
                Laboratorios y pilotos de investigación
              </p>
              <p className="mt-1 text-xs text-white/80">
                Agua · sombra y vegetación · residuos y plástico · Oficios · materiales · patrimonio turístico
              </p>
            </div>

            <div className="my-2 flex justify-center text-[#4fb6b0]" aria-hidden="true">
              ↓
            </div>

            {/* Nivel 4: Resultados */}
            <div className="rounded-xl border border-white/20 bg-white/[0.05] p-4 text-center">
              <p className="text-base font-bold text-white">
                Resultados para la planificación y la formación
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed text-white/80">
            <h3 className="tc-etiqueta text-white/55">Funciones y relación entre componentes</h3>
            {CAP_08.funcionesRelacion.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 09 · LÍNEAS DE INVESTIGACIÓN Y PILOTOS (Págs. 11–12)                */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-09"
          num="09"
          pag="11–12"
          titulo="Líneas de investigación y pilotos"
          bajada="Seis campos de trabajo conectados (9.1 a 9.6), cada uno con su piloto candidato sujeto a priorización y evaluación técnica."
          fuente="[R1–R8] y Tabla 6"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_09.introduccion}</p>

          {/* Selector interactivo estilo fichas de tesis_tercer_corte */}
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-7">
            <p className="tc-etiqueta text-white/50">Explorar línea de investigación y piloto candidato</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Líneas de investigación">
              {CAP_09.lineas.map((l, i) => (
                <button
                  key={l.codigo}
                  type="button"
                  className="tc-ficha"
                  aria-pressed={lineaSel === i}
                  onClick={() => setLineaSel(i)}
                >
                  {l.codigo} · {l.corto}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-white/14 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="tc-etiqueta" style={{ color: lineaActiva.color }}>
                  Línea {lineaActiva.codigo} · {lineaActiva.refs}
                </span>
                <span className="tc-etiqueta text-white/45">
                  Producto inicial: {lineaActiva.productoInicial}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">{lineaActiva.titulo}</h3>
              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-white/85">
                {lineaActiva.descripcion}
              </p>
              <div className="mt-4 rounded-xl border border-white/14 bg-white/[0.04] p-4">
                <p className="tc-etiqueta text-[#4fb6b0]">Piloto candidato ({lineaActiva.codigo})</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90">{lineaActiva.piloto}</p>
                <p className="mt-2 text-xs text-white/55">
                  <strong className="text-white/75">Cruce interdisciplinario:</strong> {lineaActiva.cruce}
                </p>
              </div>
            </div>
          </div>

          {/* Vista completa de las 6 líneas para lectura continua */}
          <div className="grid gap-4 sm:grid-cols-2">
            {CAP_09.lineas.map((l, i) => (
              <article
                key={l.codigo}
                onClick={() => setLineaSel(i)}
                className={`rounded-xl border p-5 transition-colors cursor-pointer ${
                  lineaSel === i
                    ? 'border-[#4fb6b0] bg-[#0c1518]'
                    : 'border-white/12 bg-white/[0.02] hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="tc-etiqueta" style={{ color: l.color }}>
                    {l.codigo}
                  </span>
                  <span className="tc-etiqueta text-white/40">{l.refs}</span>
                </div>
                <h4 className="mt-1.5 text-lg font-bold text-white">{l.titulo}</h4>
                <p className="mt-2 text-xs leading-relaxed text-white/75">{l.descripcion}</p>
                <p className="mt-3 border-t border-white/10 pt-2.5 text-xs leading-relaxed text-[#8fe0da]">
                  <strong className="text-white">Piloto candidato:</strong> {l.piloto}
                </p>
              </article>
            ))}
          </div>

          <TablaAula tabla={CAP_09.tabla6} />
          <p className="text-xs text-white/55">{CAP_09.notaEquipos}</p>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 10 · COMPONENTE DIGITAL Y MODELO TERRITORIAL (Pág. 13)              */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-10"
          num="10"
          pag={13}
          titulo="Componente digital y modelo territorial"
          bajada="Construcción progresiva en 5 niveles hacia un gemelo digital documentado, con capas, metadatos y fechas de actualización."
          fuente="Tabla 7 · Niveles del componente digital"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_10.introduccion}</p>

          {/* Escalera interactiva de 5 niveles */}
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-6">
            <p className="tc-etiqueta text-[#4fb6b0]">Construcción progresiva (Niveles 1 a 5)</p>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-5">
              {CAP_10.tabla7.filas.map((f, idx) => {
                const activo = nivelDigitalSel === idx;
                return (
                  <button
                    key={f[0]}
                    type="button"
                    onClick={() => setNivelDigitalSel(idx)}
                    className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      activo
                        ? 'border-[#4fb6b0] bg-[#4fb6b0]/15'
                        : 'border-white/12 bg-white/[0.03] hover:border-white/30'
                    }`}
                  >
                    <span className="tc-etiqueta text-[#4fb6b0]">Nivel 0{idx + 1}</span>
                    <p className="mt-1 text-sm font-bold text-white">{f[0].replace(/^\d+\s*/, '')}</p>
                    <p className="mt-1.5 text-[11px] leading-snug text-white/65">{f[1]}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4 text-xs sm:text-sm text-white/85">
              <span className="tc-etiqueta text-[#4fb6b0] mr-2">
                Condición para avanzar ({CAP_10.tabla7.filas[nivelDigitalSel][0]}):
              </span>
              {CAP_10.tabla7.filas[nivelDigitalSel][2]}
            </div>
          </div>

          <TablaAula tabla={CAP_10.tabla7} />

          {/* Capas prioritarias y Metadatos */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/12 bg-white/[0.025] p-5">
              <p className="tc-etiqueta text-[#4fb6b0]">8 Capas prioritarias del modelo</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {CAP_10.capasPrioritarias.map((c) => (
                  <li
                    key={c}
                    className="rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs text-white/85"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.025] p-5">
              <p className="tc-etiqueta text-[#c86d51]">10 Atributos de trazabilidad por registro</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {CAP_10.metadatosRegistro.map((m) => (
                  <li
                    key={m}
                    className="rounded border border-white/12 bg-black/40 px-2 py-1 text-[11px] text-white/75"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {CAP_10.bloques.map((b) => (
              <div key={b.subtitulo} className="border-t border-white/12 pt-4">
                <h3 className="text-base font-bold text-white">{b.subtitulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/78">{b.texto}</p>
              </div>
            ))}
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 11 · METODOLOGÍA DE INVESTIGACIÓN Y PARTICIPACIÓN (Págs. 14–15)     */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-11"
          num="11"
          pag="14–15"
          titulo="Metodología de investigación y participación"
          bajada="Ciclo de seis momentos basado en el principio operativo: Devolver · validar · transformar."
          fuente="[R1, R8], Figura 3 y Tabla 8"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_11.introduccion}</p>

          {/* Figura 3 · Ciclo metodológico de 6 momentos */}
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="tc-etiqueta text-[#4fb6b0]">
                Figura 3 · Ciclo metodológico de investigación y aprendizaje
              </p>
              <span className="tc-etiqueta text-white/45">Clic en cada etapa para ver el detalle</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {CAP_11.cicloPasos.map((paso, idx) => {
                const activo = cicloSel === idx;
                return (
                  <button
                    key={paso.n}
                    type="button"
                    onClick={() => setCicloSel(idx)}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      activo
                        ? 'border-[#4fb6b0] bg-[#0e1b1d]'
                        : 'border-white/12 bg-white/[0.03] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="tc-etiqueta text-[#4fb6b0]">Momento 0{paso.n}</span>
                      <span className="text-xs text-white/40">{idx < 5 ? '→' : '↺ al 01'}</span>
                    </div>
                    <h4 className="mt-1 text-base font-bold text-white">{paso.titulo}</h4>
                    <ul className="mt-2 space-y-0.5 text-xs text-white/70">
                      {paso.items.map((it) => (
                        <li key={it}>• {it}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-white/12 bg-black/50 p-4 text-sm text-white/85">
              <strong className="text-[#4fb6b0] mr-2">{CAP_11.cicloPasos[cicloSel].titulo}:</strong>
              {CAP_11.cicloPasos[cicloSel].detalle}
            </div>

            <div className="mt-4 rounded-xl border border-[#4fb6b0]/40 bg-[#4fb6b0]/10 p-4 text-center">
              <p className="text-base font-bold tracking-tight text-white">
                {CAP_11.principio.lema}
              </p>
              <p className="mt-0.5 text-xs text-[#8fe0da]">{CAP_11.principio.subtitulo}</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/60">{CAP_11.principio.nota}</p>
          </div>

          <div className="space-y-6">
            {CAP_11.secciones.map((s) => (
              <div key={s.subtitulo} className="border-t border-white/12 pt-5">
                <h3 className="text-lg font-bold text-white">{s.subtitulo}</h3>
                <div className="mt-2 space-y-3 text-sm sm:text-[15px] leading-relaxed text-white/80">
                  {s.parrafos.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <TablaAula tabla={CAP_11.tabla8} />
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 12 · FASES Y CRONOGRAMA DE 24 MESES (Págs. 16–17)                   */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-12"
          num="12"
          pag="16–17"
          titulo="Fases y cronograma de 24 meses"
          bajada="Seis fases escalonadas (F1 a F6) y tres ejes continuos (formación, gobernanza y archivo) relativos al mes 1 acordado."
          fuente="[R1], Tabla 9 y Figura 4"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_12.introduccion}</p>

          <Cronograma24Meses />

          <TablaAula tabla={CAP_12.tabla9} />

          {/* Lectura por semestres y dependencias */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5">
              <p className="tc-etiqueta text-[#4fb6b0]">Lectura por semestres</p>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-white/80">
                {CAP_12.semestres.map((s) => (
                  <li key={s.sem}>
                    <strong className="text-white">{s.meses}:</strong> {s.desc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5 flex flex-col justify-between">
              <div>
                <p className="tc-etiqueta text-[#c86d51]">Dependencias principales</p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80">
                  {CAP_12.dependencias}
                </p>
              </div>
              <p className="mt-3 border-t border-white/10 pt-2.5 text-[11px] text-white/55">
                {CAP_12.notaVisitas}
              </p>
            </div>
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 13 · ACTORES Y GOBERNANZA (Págs. 18–19)                             */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-13"
          num="13"
          pag="18–19"
          titulo="Actores y gobernanza"
          bajada="Articulación entre representación comunitaria, coordinación académica y capacidades técnicas y productivas."
          fuente="[R1, R6, R7, R8], Tablas 10 y 11"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_13.introduccion}</p>

          <div className="rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-4 text-xs sm:text-sm text-white/75">
            {CAP_13.estadoAcuerdos}
          </div>

          <MatricesActoresTabs />

          <div className="grid gap-6 border-t border-white/12 pt-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-white">Estructura propuesta</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/80">
                {CAP_13.estructuraPropuesta.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Instrumentos de formalización</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {CAP_13.instrumentosFormalizacion}
              </p>
            </div>
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 14 · PRODUCTOS E INDICADORES (Pág. 20)                              */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-14"
          num="14"
          pag={20}
          titulo="Productos e indicadores"
          bajada="Matriz inicial de nueve productos (P1 a P9), indicadores de calidad participativa e indicadores específicos de pilotos."
          fuente="Tabla 12 · Matriz de verificación"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_14.introduccion}</p>

          <TablaAula tabla={CAP_14.tabla12} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5">
              <p className="tc-etiqueta text-[#4fb6b0]">Indicadores de calidad y participación</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {CAP_14.indicadoresCalidad}
              </p>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5">
              <p className="tc-etiqueta text-[#c86d51]">Indicadores específicos de los pilotos</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {CAP_14.indicadoresPilotos}
              </p>
            </div>
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 15 · FINANCIACIÓN Y SOSTENIBILIDAD (Pág. 21)                        */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-15"
          num="15"
          pag={21}
          titulo="Financiación y sostenibilidad"
          bajada="Programa marco común combinado con proyectos de alcance delimitado y estructura de ocho rubros verificables."
          fuente="Tabla 13 · Estructura presupuestal"
        >
          <p className="text-[15px] leading-relaxed text-white/82">{CAP_15.introduccion}</p>

          <TablaAula tabla={CAP_15.tabla13} />

          <p className="rounded-xl border border-white/12 bg-white/[0.03] p-4 text-xs sm:text-sm leading-relaxed text-white/75">
            {CAP_15.notaPresupuesto}
          </p>

          <div className="space-y-3 border-t border-white/12 pt-4">
            <h3 className="text-lg font-bold text-white">Continuidad y criterios de financiación</h3>
            {CAP_15.continuidadCriterios.map((p, i) => (
              <p key={i} className="text-sm sm:text-[15px] leading-relaxed text-white/80">
                {p}
              </p>
            ))}
          </div>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 16 · CRITERIOS ÉTICOS Y GESTIÓN DE RIESGOS (Pág. 22)                */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-16"
          num="16"
          pag={22}
          titulo="Criterios éticos y gestión de riesgos"
          bajada="Reconocimiento de la comunidad como productora de conocimiento, protección de la infancia y aplicación científica responsable."
          fuente="[R1, R8] y Tabla 14"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5 space-y-3">
              <p className="tc-etiqueta text-[#4fb6b0]">Participación y reconocimiento</p>
              {CAP_16.participacionReconocimiento.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-white/80">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.03] p-5">
              <p className="tc-etiqueta text-[#c86d51]">Investigación y aplicación responsable</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                {CAP_16.investigacionResponsable}
              </p>
            </div>
          </div>

          <TablaAula tabla={CAP_16.tabla14} />

          <p className="text-xs leading-relaxed text-white/60">{CAP_16.notaNormativa}</p>
        </BloqueCapitulo>

        {/* ------------------------------------------------------------------- */}
        {/* 17 · RUTA DE FORMULACIÓN Y REFERENCIAS (Págs. 23–24)                */}
        {/* ------------------------------------------------------------------- */}
        <BloqueCapitulo
          id="cap-17"
          num="17"
          pag="23–24"
          titulo="Ruta de formulación y referencias documentales"
          bajada="Siete pasos para convertir el programa marco en proyecto, asuntos por resolver al inicio y corpus documental R1–R9."
          fuente="Tabla 15 y Referencias R1 a R9"
        >
          <div className="rounded-2xl border border-[#4fb6b0]/35 bg-[#4fb6b0]/[0.07] p-5 sm:p-6">
            <p className="tc-etiqueta text-[#4fb6b0]">Agenda inicial de trabajo</p>
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/90">
              {CAP_17.agendaInicial}
            </p>
          </div>

          <TablaAula tabla={CAP_17.tabla15} />

          <div className="space-y-3 border-t border-white/12 pt-5">
            <h3 className="text-lg font-bold text-white">Asuntos que deben resolverse</h3>
            {CAP_17.asuntosPorResolver.map((p, i) => (
              <p key={i} className="text-sm sm:text-[15px] leading-relaxed text-white/80">
                {p}
              </p>
            ))}
          </div>

          {/* Referencias documentales R1 a R9 */}
          <div className="rounded-2xl border border-white/14 bg-[#070a0d] p-6 sm:p-8">
            <p className="tc-etiqueta text-[#4fb6b0]">
              Página 24 · Referencias documentales del programa (R1–R9)
            </p>
            <ol className="tc-regla mt-4">
              {CAP_17.referencias.map((r) => (
                <li
                  key={r.ref}
                  className="tc-regla grid grid-cols-[3rem_1fr] gap-3 py-3.5 first:border-t-0 text-xs sm:text-sm leading-relaxed text-white/85"
                >
                  <span className="tc-etiqueta text-[#4fb6b0] font-bold">{r.ref}</span>
                  <p>{r.cita}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-white/12 pt-4 space-y-2 text-xs text-white/60">
              <p className="tc-etiqueta text-white/75">Uso de las referencias</p>
              {CAP_17.usoReferencias.map((u, i) => (
                <p key={i}>{u}</p>
              ))}
            </div>
          </div>

          {/* Enlaces de cierre estilo tesis_tercer_corte */}
          {onNavigateModule && (
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onNavigateModule('resumen')}
                className="group block rounded-2xl border border-white/14 bg-white/[0.03] p-6 text-left transition-colors hover:border-[#4fb6b0] hover:bg-white/[0.06] cursor-pointer"
              >
                <p className="tc-etiqueta text-white/55">Recorrido de la comunidad</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-white">
                  Explorar módulos interactivos (00–04){' '}
                  <span className="inline-block transition-transform group-hover:translate-x-1 text-[#4fb6b0]">
                    →
                  </span>
                </p>
                <p className="mt-1.5 text-xs text-white/65">
                  Resumen del proyecto, territorio, historia de la isla, mapa de riesgos y visor 3D.
                </p>
              </button>
              <a
                href="https://alejagoguti-cpu.github.io/tesis_tercer_corte/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-white/14 bg-white/[0.03] p-6 text-left transition-colors hover:border-[#4fb6b0] hover:bg-white/[0.06]"
              >
                <p className="tc-etiqueta text-white/55">Referencia visual</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-white">
                  Tesis · Tercer corte{' '}
                  <span className="inline-block transition-transform group-hover:translate-x-1 text-[#4fb6b0]">
                    ↗
                  </span>
                </p>
                <p className="mt-1.5 text-xs text-white/65">
                  Simulación 3D de erosión, sintaxis espacial, plan maestro y red de especies.
                </p>
              </a>
            </div>
          )}

          <footer className="border-t border-white/12 pt-6 text-xs leading-relaxed text-white/50">
            <p>
              PROYECTO AULA AMBIENTAL | TIERRA BOMBA / BOCACHICA COMO AULA AMBIENTAL · Programa marco v0.1 · Promotor académico: Arq. Alejandro Serrano Sierra · Pontificia Universidad Javeriana · 26 de octubre de 2026.
            </p>
          </footer>
        </BloqueCapitulo>
      </div>
    </div>
  );
}
