import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import IslaHero3D from './IslaHero3D';
import { Reveal, CountUp } from './Motion';
import { projectInfo } from '../data/projectData';

const A = (f) => `${import.meta.env.BASE_URL}assets/${f}`;

const CIFRAS = [
  { to: 1.8, dec: 1, pre: '', suf: ' m', u: 'por año', t: 'Retroceso de la costa por erosión' },
  { to: 0, dec: 0, pre: '', suf: ' %', u: 'cobertura', t: 'Acueducto y alcantarillado en la isla' },
  { to: 22, dec: 0, pre: '+', suf: ' m', u: 's.n.m.', t: 'Cota segura para reubicar el equipamiento' },
  { to: 450000, dec: 0, pre: '', suf: ' L', u: 'aljibe', t: 'Agua lluvia captada en 1.850 m² de cubierta' },
];

const PROBLEMAS = [
  {
    n: '01',
    t: 'La costa se pierde',
    d: 'El oleaje socava la orilla y deja en riesgo a las viviendas construidas junto al agua.',
    img: A('vivienda_erosion_ruinas.png'),
  },
  {
    n: '02',
    t: 'No hay agua potable',
    d: 'Los pozos están salinizados y las familias compran agua traída en lancha desde Cartagena.',
    img: A('tierrabomba_acarreo_pimpina.png'),
  },
  {
    n: '03',
    t: 'El colegio se deteriora',
    d: 'La corrosión salina compromete columnas y losas de la sede escolar actual.',
    img: A('colegio_deterioro_columnas.jpg'),
  },
];

const RECORRIDO = [
  { id: 'territorio', n: '01', t: 'Nuestro territorio', d: 'La isla, su gente, sus casas y caminos.' },
  { id: 'module11', n: '02', t: 'La historia de la isla', d: 'Mapas antiguos y fotos de cómo ha cambiado.' },
  { id: 'framework', n: '03', t: 'El mapa de los riesgos', d: 'Dónde se pierde la costa y dónde es seguro.' },
  { id: '3dviewer', n: '04', t: 'Así será el nuevo barrio', d: 'Recorrido 3D de casas, colegio y aljibe.' },
];

export default function ProjectOverview({ onNavigateModule }) {
  return (
    <div className="h-full overflow-y-auto bg-[#f4f1ec] text-[#16181d] font-sans">
      {/* Portada 3D */}
      <section className="relative h-[58svh] min-h-[380px] bg-[#0b1015] overflow-hidden">
        <IslaHero3D className="absolute inset-0" />
        <div className="absolute inset-0 bg-[#0b1015]/25 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 lg:p-12">
          <div className="max-w-xl rounded-2xl border border-white/30 bg-white/15 p-5 sm:p-7 text-white backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/30 glass-sheen anim-fade-up">
            <p className="text-sm text-white/75">Resumen del proyecto</p>
            <h1 className="anim-fade-up mt-3 text-4xl sm:text-5xl font-semibold leading-none tracking-tight">Tierra Bomba</h1>
            <p className="mt-3 text-base sm:text-lg text-white/90">
              Reubicación del equipamiento comunal con infraestructura hídrica autosuficiente frente a la erosión costera.
            </p>
          </div>
        </div>
      </section>

      {/* Cifras */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-10 sm:pt-14">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#16181d]/25">
          {CIFRAS.map((c, i) => (
            <Reveal delay={i * 120}
              key={c.t}
              className={`py-5 pr-4 border-b border-[#16181d]/15 lg:border-b-0 ${i > 0 ? 'lg:pl-6 lg:border-l lg:border-[#16181d]/15' : ''}`}
            >
              <dt className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {c.pre}<CountUp to={c.to} decimals={c.dec} />{c.suf} <span className="text-sm font-normal text-[#16181d]/55">{c.u}</span>
              </dt>
              <dd className="mt-2 text-sm text-[#16181d]/70 leading-snug">{c.t}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Problema */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-14 sm:pt-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Tres problemas, una isla</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMAS.map((p, i) => (
            <Reveal key={p.n} delay={i * 140}>
            <article className="group h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden rounded-xl bg-white border border-[#16181d]/10">
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src={p.img}
                  alt={p.t}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-[#c86d51] font-mono">{p.n}</p>
                <h3 className="mt-1 text-lg font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-[#16181d]/70 leading-relaxed">{p.d}</p>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Propuesta */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-14 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <Reveal className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">La propuesta</h2>
            <p className="mt-4 text-[#16181d]/75 leading-relaxed">
              Llevar viviendas y escuela a la meseta segura, con diseño bioclimático caribeño. La cubierta recoge
              la lluvia, el aljibe subterráneo la almacena y las aguas grises se tratan con fitodepuración.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {['Estructura de madera y celosías de arcilla', 'Captación pluvial con desinfección solar', 'Escuela abierta como espacio público'].map((t) => (
                <li key={t} className="flex gap-3 border-t border-[#16181d]/15 pt-2">
                  <span className="text-[#c86d51]">—</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200} className="lg:col-span-3 overflow-hidden rounded-xl border border-[#16181d]/10 bg-white">
            <img src={A('vivienda_01_completa.png')} alt="Vivienda propuesta" loading="lazy" className="w-full h-full object-contain hover:scale-105 transition-transform duration-1000" />
          </Reveal>
        </div>
      </section>

      {/* Recorrido */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Recorre el proyecto</h2>
        <ul className="mt-6 border-t border-[#16181d]/25">
          {RECORRIDO.map((r, i) => (
            <Reveal as="li" delay={i * 90} key={r.id} className="border-b border-[#16181d]/15">
              <button
                onClick={() => onNavigateModule(r.id)}
                className="group flex w-full items-center gap-4 sm:gap-8 py-5 text-left cursor-pointer"
              >
                <span className="w-8 text-sm font-mono text-[#16181d]/45">{r.n}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-lg sm:text-xl font-medium group-hover:text-[#c86d51] transition-colors">{r.t}</span>
                  <span className="block text-sm text-[#16181d]/60">{r.d}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#16181d]/40 transition group-hover:text-[#c86d51] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 text-sm text-[#16181d]/55">
          {projectInfo.author} · Tesis de grado en Arquitectura y Urbanismo · 2026
        </p>
      </section>
    </div>
  );
}


