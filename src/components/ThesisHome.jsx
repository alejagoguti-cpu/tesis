import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Motion';
import { projectInfo } from '../data/projectData';

const AULA_URL = 'https://alejagoguti-cpu.github.io/bocachica/';

const OBJETIVOS = [
  {
    n: '01',
    t: 'Diagnosticar el riesgo temporal',
    d: 'Evaluar las dinámicas de erosión e inundación costera proyectadas a 10, 20 y 30 años para determinar las áreas de afectación prioritaria y la vulnerabilidad del hábitat.',
  },
  {
    n: '02',
    t: 'Sistematizar la memoria y los saberes locales',
    d: 'Mapear el patrimonio vernáculo, las memorias hídricas y las prácticas comunitarias del Buen Vivir que sostienen la identidad y la cohesión de la población insular.',
  },
  {
    n: '03',
    t: 'Estructurar la plataforma de transición espacial',
    d: 'Formular la metodología del Aula Ambiental como marco de gestión territorial que guíe la reubicación progresiva y evite el desplazamiento desordenado o la precarización.',
  },
  {
    n: '04',
    t: 'Proponer intervenciones y pilotos de adaptación',
    d: 'Diseñar estrategias socioecológicas demostrativas (refugios climáticos, captación de agua y restauración de bordes) que fortalezcan la resiliencia comunitaria.',
  },
];

const HORIZONTES = [
  { y: '10', t: 'años', d: 'Horizonte corto' },
  { y: '20', t: 'años', d: 'Horizonte medio' },
  { y: '30', t: 'años', d: 'Horizonte largo' },
];

export default function ThesisHome({ onGoCommunity }) {
  return (
    <div className="min-h-screen bg-[#f4f1ec] text-[#16181d] font-sans">
      {/* Barra */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 h-14 bg-[#0b1015]/55 backdrop-blur-md text-white border-b border-white/10">
        <span className="text-sm font-semibold tracking-tight">Tierra Bomba · Tesis</span>
        <button
          onClick={onGoCommunity}
          className="flex items-center gap-2 text-sm px-3 h-9 rounded-md border border-white/35 hover:bg-white hover:text-[#16181d] transition-colors cursor-pointer"
        >
          Versión para la comunidad <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      {/* Portada */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#0b1015] text-white">
        <img
          src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`}
          alt="Vista satelital de la isla de Tierra Bomba"
          className="absolute inset-0 h-full w-full object-cover object-[55%_25%] anim-ken-burns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[#0b1015]/30" />
        <div className="relative z-10 h-full flex items-end p-4 sm:p-10 lg:p-16 pb-10">
          <div className="w-full max-w-3xl rounded-2xl border border-white/30 bg-white/15 p-6 sm:p-10 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/30 glass-sheen anim-fade-up">
            <p className="text-sm text-white/80">Tesis de grado · Arquitectura y Urbanismo · 2026</p>
            <h1 className="mt-5 text-5xl sm:text-7xl font-semibold leading-[0.95] tracking-tight">Tierra Bomba</h1>
            <p className="mt-4 text-xl sm:text-3xl font-light text-white/95 leading-snug">
              Planificación y adaptación territorial frente a la pérdida de suelo costero
            </p>
            <p className="mt-6 text-sm text-white/75">{projectInfo.author}</p>
            <a
              href="#problema"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/60 pb-0.5 hover:border-white"
            >
              Formulación del problema <span className="anim-float-y inline-block">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section id="problema" className="mx-auto max-w-5xl px-4 sm:px-8 pt-20 sm:pt-28">
        <Reveal>
          <p className="text-sm text-[#c86d51] font-mono">Formulación del problema</p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold leading-[1.1] tracking-tight">
            La pérdida paulatina de suelo costero por el aumento del mar amenaza con desplazar progresivamente a la
            población de Tierra Bomba y fragmentar sus modos de vida.
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-14 grid sm:grid-cols-3 gap-6 border-t border-[#16181d]/25 pt-8">
          {HORIZONTES.map((h) => (
            <div key={h.y}>
              <p className="text-5xl font-semibold tracking-tight">
                {h.y} <span className="text-base font-normal text-[#16181d]/55">{h.t}</span>
              </p>
              <p className="mt-2 text-sm text-[#16181d]/70 leading-snug">{h.d}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-3 text-xs text-[#16181d]/45">Horizontes de proyección de la erosión y la inundación costera (objetivo 01).</p>
      </section>

      {/* Objetivo general */}
      <section className="mt-20 sm:mt-28 bg-[#0b1015] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <p className="text-sm text-[#e0917a] font-mono">Objetivo general</p>
            <p className="mt-4 text-2xl sm:text-4xl font-light leading-snug tracking-tight">
              Desarrollar una estrategia de planificación y adaptación territorial a largo plazo que organice la
              transición paulatina del hábitat y proteja los modos de vida comunitarios frente a la pérdida
              progresiva de suelo costero en Tierra Bomba.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Objetivos específicos */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Objetivos específicos</h2>
        </Reveal>
        <ol className="mt-8 border-t border-[#16181d]/25">
          {OBJETIVOS.map((o, i) => (
            <Reveal as="li" key={o.n} delay={i * 80} className="border-b border-[#16181d]/15 py-7 grid sm:grid-cols-[5rem_1fr] gap-2 sm:gap-6">
              <span className="text-3xl font-light text-[#c86d51]">{o.n}</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{o.t}</h3>
                <p className="mt-2 text-[#16181d]/70 leading-relaxed max-w-3xl">{o.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Puerta a la comunidad */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 pb-20 sm:pb-28">
        <Reveal>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Para la comunidad de Tierra Bomba</h2>
          <p className="mt-3 max-w-2xl text-[#16181d]/70 leading-relaxed">
            Esta tesis también se devuelve al territorio: una versión pensada para que quienes habitan la isla
            conozcan su historia, sus riesgos y lo que se propone para cuidar su hábitat.
          </p>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          <Reveal delay={80}>
            <button
              onClick={onGoCommunity}
              className="group w-full h-full text-left rounded-xl bg-[#0b1015] text-white p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <p className="text-sm text-white/55">Versión para la comunidad</p>
              <p className="mt-2 text-2xl font-semibold">Conoce tu territorio</p>
              <p className="mt-2 text-sm text-white/65">Territorio, historia, mapa de riesgos y el nuevo barrio.</p>
              <ArrowRight className="mt-6 h-5 w-5 text-[#e0917a] transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
          <Reveal delay={160}>
            <a
              href={AULA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-xl border border-[#16181d]/20 bg-white p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500"
            >
              <p className="text-sm text-[#16181d]/55">Aula Ambiental</p>
              <p className="mt-2 text-2xl font-semibold">La isla en 3D</p>
              <p className="mt-2 text-sm text-[#16181d]/65">Modelo interactivo para imaginar, cuidar y construir el territorio.</p>
              <ArrowUpRight className="mt-6 h-5 w-5 text-[#c86d51] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Reveal>
        </div>
        <p className="mt-14 text-sm text-[#16181d]/50">
          {projectInfo.author} · Tesis de grado en Arquitectura y Urbanismo · 2026
        </p>
      </section>
    </div>
  );
}

