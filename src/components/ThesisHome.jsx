import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal, CountUp, supportsScrollTimeline } from './Motion';
import { projectInfo } from '../data/projectData';
import IslaReal3D from './IslaReal3D';
import IslaErosion3D from './IslaErosion3D';

const AULA_URL = 'https://alejagoguti-cpu.github.io/bocachica/';
const A = (f) => `${import.meta.env.BASE_URL}assets/${f}`;
const T = (f) => `${import.meta.env.BASE_URL}textures/${f}`;

const PROBLEMA =
  'La pérdida paulatina de suelo costero por el aumento del mar amenaza con desplazar progresivamente a la población de Tierra Bomba y fragmentar sus modos de vida.';

const OBJETIVOS = [
  {
    n: '01',
    v: 'Diagnosticar',
    t: 'El riesgo temporal',
    d: 'Evaluar las dinámicas de erosión e inundación costera proyectadas a 10, 20 y 30 años para determinar las áreas de afectación prioritaria y la vulnerabilidad del hábitat.',
    c: '#113542',
  },
  {
    n: '02',
    v: 'Sistematizar',
    t: 'Memoria y saberes locales',
    d: 'Mapear el patrimonio vernáculo, las memorias hídricas y las prácticas comunitarias del Buen Vivir que sostienen la identidad y la cohesión de la población insular.',
    c: '#0f766e',
  },
  {
    n: '03',
    v: 'Estructurar',
    t: 'La plataforma de transición espacial',
    d: 'Formular la metodología del Aula Ambiental como marco de gestión territorial que guíe la reubicación progresiva y evite el desplazamiento desordenado o la precarización.',
    c: '#7e573a',
  },
  {
    n: '04',
    v: 'Proponer',
    t: 'Intervenciones y pilotos de adaptación',
    d: 'Diseñar estrategias socioecológicas demostrativas (refugios climáticos, captación de agua y restauración de bordes) que fortalezcan la resiliencia comunitaria.',
    c: '#b85d3d',
  },
];

const FOTOS = [
  { src: A('vivienda_erosion_ruinas.png'), t: 'Lo que el mar ya se llevó', d: 'Ruinas frente a la bahía de Cartagena' },
  { src: A('vivienda_borde_socavacion.jpg'), t: 'Casas en el borde', d: 'Viviendas sobre el agua, sin margen' },
  { src: A('vivienda_costa_tierrabomba.png'), t: 'Un hábitat en la orilla', d: 'La vida comunitaria frente al mar' },
];

const PALABRAS = ['Erosión', 'Memoria', 'Buen Vivir', 'Aula Ambiental', 'Transición paulatina', 'Resiliencia', 'Saberes locales', 'Hábitat'];

/* ---------- barra de progreso de lectura ---------- */
function ProgressBar() {
  const native = useRef(supportsScrollTimeline() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;
  const [p, setP] = useState(0);
  useEffect(() => {
    if (native) return undefined;
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (native) return <div className="scroll-progress fixed top-0 left-0 z-50 h-[3px] w-full bg-[#c86d51]" />;
  return <div className="fixed top-0 left-0 z-50 h-[3px] bg-[#c86d51]" style={{ width: `${p * 100}%` }} />;
}

/* ---------- texto que se ilumina palabra por palabra con el scroll ---------- */
function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setP(Math.max(0, Math.min(1, prog)));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const on = p * words.length > i;
        return (
          <span key={i} className="transition-opacity duration-300" style={{ opacity: on ? 1 : 0.18 }}>
            {w}{' '}
          </span>
        );
      })}
    </p>
  );
}


/* monta el contenido pesado solo cuando está cerca de la pantalla */
function LazyMount({ children, minHeight = '60svh' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '500px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ minHeight: on ? undefined : minHeight }}>{on ? children : null}</div>;
}
export default function ThesisHome({ onGoCommunity }) {
  return (
    <div className="bg-[#0b1015] text-white font-sans overflow-x-hidden">
      <ProgressBar />

      {/* Barra */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 h-14 bg-[#0b1015]/70 backdrop-blur-md border-b border-white/10">
        <span className="text-sm font-semibold tracking-tight drop-shadow">Tierra Bomba · Tesis</span>
        <button
          onClick={onGoCommunity}
          className="flex items-center gap-2 text-sm px-3 h-9 rounded-md border border-white/40 bg-black/20 backdrop-blur-md hover:bg-white hover:text-[#16181d] transition-colors cursor-pointer"
        >
          Versión para la comunidad <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      {/* 1. PORTADA */}
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden">
        <img
          src={A('vivienda_erosion_ruinas.png')}
          alt="Ruinas de una vivienda frente al mar, con la ciudad de Cartagena al fondo"
          className="absolute inset-0 h-full w-full object-cover anim-ken-burns"
          fetchPriority="high"
        />
        {!import.meta.env.VITE_NO_HERO && <IslaReal3D className="absolute inset-0" />}`n        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b1015] via-[#0b1015]/10 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-10 lg:px-16 pb-8 sm:pb-12">
          <p className="anim-fade-up text-sm sm:text-base text-white/80">Tesis de grado · Arquitectura y Urbanismo · 2026</p>
          <h1
            className="anim-fade-up mt-3 font-semibold tracking-tighter leading-[0.88] text-[clamp(3.5rem,14vw,12rem)]"
            style={{ animationDelay: '150ms' }}
          >
            Tierra<br className="sm:hidden" /> Bomba
          </h1>
          <p className="anim-fade-up mt-4 max-w-2xl text-lg sm:text-2xl font-light text-white/90" style={{ animationDelay: '350ms' }}>
            Planificación y adaptación territorial frente a la pérdida de suelo costero
          </p>

          <div className="anim-fade-up mt-8 grid grid-cols-3 gap-px max-w-2xl overflow-hidden rounded-lg border border-white/25 bg-white/20 backdrop-blur-xl" style={{ animationDelay: '550ms' }}>
            {[
              ['1,8 m', 'de costa por año'],
              ['10·20·30', 'años proyectados'],
              ['+22 m', 'cota segura'],
            ].map(([a, b]) => (
              <div key={a} className="bg-black/35 px-3 sm:px-5 py-3">
                <p className="text-lg sm:text-2xl font-semibold leading-none">{a}</p>
                <p className="mt-1 text-[11px] sm:text-xs text-white/65">{b}</p>
              </div>
            ))}
          </div>
          <a href="#problema" className="mt-6 text-sm text-white/80 w-fit">
            Formulación del problema <span className="anim-float-y inline-block ml-1">↓</span>
          </a>
        </div>
      </section>

      {/* 2. PROBLEMA (texto que se ilumina) */}
      <section id="problema" className="px-4 sm:px-10 lg:px-16 py-24 sm:py-36 bg-[#0b1015]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-[#e0917a] font-mono">Formulación del problema</p>
          <ScrollWords text={PROBLEMA} className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight" />
        </div>
      </section>

      {/* 3. EL ESQUEMA INTERACTIVO */}
      <section className="px-4 sm:px-10 lg:px-16 pb-24 sm:pb-32 bg-[#0b1015]">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Tierra Bomba si no se frena la erosión</h2>
            <p className="mt-3 max-w-2xl text-white/60">
              Pulsa Simular o elige 10, 20 o 30 años. En rojo, la costa que desaparece y las viviendas que se
              pierden si no se frena la erosión.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <LazyMount minHeight="70svh"><IslaErosion3D /></LazyMount>
          </Reveal>
        </div>
      </section>

      {/* 4. FOTOS */}
      <section className="bg-[#f4f1ec] text-[#16181d] px-4 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm text-[#c86d51] font-mono">Lo que está en juego</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
              No es solo suelo: son modos de vida
            </h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {FOTOS.map((f, i) => (
              <Reveal key={f.t} delay={i * 120} className={i === 1 ? 'md:mt-12' : i === 2 ? 'md:mt-24' : ''}>
                <figure className="group overflow-hidden rounded-xl bg-white">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={f.src} alt={f.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                  </div>
                  <figcaption className="p-4">
                    <p className="font-semibold">{f.t}</p>
                    <p className="text-sm text-[#16181d]/60">{f.d}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CINTA DE PALABRAS */}
      <div className="bg-[#c86d51] text-white py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee flex w-max gap-10 text-xl sm:text-2xl font-medium whitespace-nowrap">
          {[...PALABRAS, ...PALABRAS].map((p, i) => (
            <span key={i} className="flex items-center gap-10">
              {p} <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 6. OBJETIVO GENERAL */}
      <section className="relative overflow-hidden">
        <img src={T('tierrabomba_satelite.jpg')} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#113542] via-[#113542]/85 to-[#0b1015]" />
        <div className="relative px-4 sm:px-10 lg:px-16 py-24 sm:py-36">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-sm text-[#e0917a] font-mono">Objetivo general</p>
              <p className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-light leading-[1.2] tracking-tight">
                Desarrollar una estrategia de planificación y adaptación territorial a largo plazo que organice la
                transición paulatina del hábitat y proteja los modos de vida comunitarios frente a la pérdida
                progresiva de suelo costero en Tierra Bomba.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. OBJETIVOS ESPECÍFICOS */}
      <section className="bg-[#0b1015] px-4 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Cuatro pasos</h2>
            <p className="mt-3 text-white/55">Los objetivos específicos, del diagnóstico a la acción.</p>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OBJETIVOS.map((o, i) => (
              <Reveal key={o.n} delay={i * 110}>
                <article
                  className="group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ backgroundColor: o.c }}
                >
                  <span className="absolute -right-3 -top-6 text-[9rem] font-semibold leading-none text-white/10 select-none transition-transform duration-700 group-hover:scale-110">
                    {o.n}
                  </span>
                  <div className="relative">
                    <p className="text-sm text-white/70">{o.n}</p>
                    <h3 className="mt-14 text-3xl font-semibold tracking-tight">{o.v}</h3>
                    <p className="text-lg text-white/90">{o.t}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/75">{o.d}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COMUNIDAD */}
      <section className="relative overflow-hidden">
        <img src={T('tierrabomba_satelite.jpg')} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-[#0b1015]/80" />
        <div className="relative px-4 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Para la comunidad de Tierra Bomba</h2>
              <p className="mt-4 max-w-2xl text-white/70 text-lg leading-relaxed">
                Esta tesis también se devuelve al territorio: una versión para que quienes habitan la isla conozcan
                su historia, sus riesgos y lo que se propone para cuidar su hábitat.
              </p>
            </Reveal>
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <Reveal delay={80}>
                <button
                  onClick={onGoCommunity}
                  className="group w-full h-full text-left rounded-2xl bg-white text-[#16181d] p-7 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <p className="text-sm text-[#16181d]/55">Versión para la comunidad</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">Conoce tu territorio</p>
                  <p className="mt-2 text-sm text-[#16181d]/65">Territorio, historia, mapa de riesgos y el nuevo barrio.</p>
                  <ArrowRight className="mt-8 h-6 w-6 text-[#c86d51] transition-transform group-hover:translate-x-2" />
                </button>
              </Reveal>
              <Reveal delay={180}>
                <a
                  href={AULA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl p-7 hover:-translate-y-1 hover:bg-white/20 transition-all duration-500"
                >
                  <p className="text-sm text-white/60">Aula Ambiental</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">La isla en 3D</p>
                  <p className="mt-2 text-sm text-white/70">Modelo interactivo para imaginar, cuidar y construir el territorio.</p>
                  <ArrowUpRight className="mt-8 h-6 w-6 text-[#e0917a] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Reveal>
            </div>
            <p className="mt-16 text-sm text-white/40">
              {projectInfo.author} · Tesis de grado en Arquitectura y Urbanismo · 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}








