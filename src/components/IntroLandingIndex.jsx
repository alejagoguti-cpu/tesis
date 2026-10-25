import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Droplets,
  Wind,
  Layers,
  Map as MapIcon,
  Box,
  Building2,
  BookOpen,
  Home,
  Activity,
  Compass,
  Quote,
  X,
  RotateCcw,
  CheckCircle2,
  Waves,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const PROBLEM_GALLERIES = {
  erosion: {
    id: "erosion",
    code: "PROBLEMA 01",
    color: "#e11d48",
    badgeLabel: "Riesgo Físico Crítico",
    title: "Erosión de las costas y riesgo en las viviendas",
    description: "El golpe del mar destruye la orilla y pone en peligro las casas construidas cerca del agua.",
    context: "El avance marino, el oleaje directo y las mareas de leva socavan aceleradamente la línea costera de Tierrabomba con tasas de retroceso de hasta 1.8 m/año. Viviendas tradicionales construidas sobre cimientos precarios presentan descalces, fracturas estructurales y peligro inminente de colapso.",
    source: "Expediente Judicial de Gestión del Riesgo & Registro en Sitio (2022–2026)",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_erosion_ruinas.png`,
        caption: "Ruinas de viviendas socavadas por el oleaje frente a la bahía de Cartagena. Estructuras fracturadas y desmanteladas por el avance marino.",
        tag: "Colapso Estructural por Socavación"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_borde_socavacion.jpg`,
        caption: "Asentamientos en el borde costero crítico de Tierrabomba. Viviendas autoconstruidas sobre cimientos socavados y muros precarios de contención.",
        tag: "Viviendas en Peligro Inminente"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/vivienda_costa_tierrabomba.png`,
        caption: "Franja habitacional de borde en Tierrabomba frente al agua: exposición directa a pleamar, mareas de leva e impacto de trenes de olas.",
        tag: "Exposición Territorial Costera"
      }
    ]
  },
  agua: {
    id: "agua",
    code: "PROBLEMA 02",
    color: "#d97706",
    badgeLabel: "Déficit Estructural Hídrico",
    title: "Falta de agua potable y alcantarillado",
    description: "La isla no tiene red de agua ni desagües, lo que obliga a la población a comprar agua traída en lanchas.",
    context: "Tierrabomba sufre un 0% de cobertura en red formal de acueducto y alcantarillado. Los acuíferos locales padecen salinización por intrusión marina, obligando a las familias a comprar pimpinas traídas en lanchas desde Cartagena a costos desproporcionados, acarreándolas a pie por calles sin pavimentar.",
    source: "Reportaje Especial Publimetro & Sentencias Corte Constitucional",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/tierrabomba_acarreo_pimpina.png`,
        caption: "Acarreo cotidiano de pimpinas de agua dulce al hombro por las calles de Tierrabomba ante la falta absoluta de red de acueducto.",
        tag: "Acarreo Manual de Agua"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/tierrabomba_publimetro_agua.jpg`,
        caption: "El diario vivir de las familias de Tierra Bomba: compra y traslado precario de agua dulce traída en barcazas desde Cartagena.",
        tag: "0% Red Formal de Acueducto"
      }
    ]
  },
  servicios: {
    id: "servicios",
    code: "PROBLEMA 03",
    color: "#2563eb",
    badgeLabel: "Vulnerabilidad Institucional",
    title: "Falta de servicios públicos y colegios",
    description: "Existe un abandono en la infraestructura de la isla, afectando la educación, la salud y los espacios comunitarios.",
    context: "El Informe de Calidad de Vida clasifica la infraestructura educativa y comunitaria de Tierra Bomba como deficiente (37,3 puntos). La sede escolar actual sufre severa corrosión de acero estructural en columnas y losas por el ambiente salino, con áreas acordonadas por peligro de desplome y falta de condiciones higiénicas continuas.",
    source: "Informe de Calidad de Vida Cartagena (2025) & Diagnóstico en Sitio",
    images: [
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_columnas.jpg`,
        caption: "Severa corrosión del acero estructural en columnas y voladizos, pérdida total del recubrimiento de concreto y cintas de acordonamiento por riesgo inminente de colapso.",
        tag: "Riesgo Estructural & Acordonamiento"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_1.jpg`,
        caption: "Desprendimiento de mampostería, corrosión de armaduras y cerramiento provisional con madera aglomerada.",
        tag: "Deterioro Físico Crítico"
      },
      {
        url: `${import.meta.env.BASE_URL}assets/colegio_deterioro_2.png`,
        caption: "Viga de concreto con acero de refuerzo totalmente expuesto a la salinidad marina y fisuras en elementos portantes.",
        tag: "Falla Estructural Portante"
      }
    ]
  }
};

export default function IntroLandingIndex({ onNavigateModule }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeProblemKey, setActiveProblemKey] = useState(null); // 'erosion' | 'agua' | 'servicios'
  const [problemSlideIndex, setProblemSlideIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredRelation, setHoveredRelation] = useState(null);
  const [isShattering, setIsShattering] = useState(false);
  const [veilActive, setVeilActive] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);

  const cardRef = useRef(null);
  const titlePlainRef = useRef(null);
  const titleGradRef = useRef(null);
  const svgRef = useRef(null);

  const { thesisNetwork } = projectInfo;
  const nodes = thesisNetwork?.nodes || [];
  const relations = thesisNetwork?.relations || [];

  // -------------------------------------------------------------
  // 1. CASINO SCRAMBLE TEXT REVEAL ANIMATION (LIGHT MODE ADAPTED)
  // -------------------------------------------------------------
  useEffect(() => {
    const CHARS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789";
    const plainEl = titlePlainRef.current;
    const gradEl = titleGradRef.current;
    if (!plainEl || !gradEl) return;

    const originalPlain = "Hábitat Resiliente & ";
    const originalGrad = "Reubicación Insular.";

    plainEl.textContent = "";
    gradEl.textContent = "";

    const plainItems = [...originalPlain].map((ch) => {
      const span = document.createElement("span");
      span.className = "scramble-char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      plainEl.appendChild(span);
      return { span, ch };
    });

    const gradItems = [...originalGrad].map((ch) => {
      const span = document.createElement("span");
      span.className = "scramble-char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      gradEl.appendChild(span);
      return { span, ch };
    });

    const allItems = [...plainItems, ...gradItems];
    const timers = [];

    allItems.forEach((item, i) => {
      if (item.ch === " ") return;
      item.span.classList.add("spinning");
      let ticks = 0;
      const totalTicks = 8 + i * 2;
      const timer = setInterval(() => {
        if (ticks < totalTicks) {
          item.span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          ticks++;
        } else {
          item.span.textContent = item.ch;
          item.span.classList.remove("spinning");
          clearInterval(timer);
        }
      }, 35);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearInterval);
    };
  }, [scrambleKey]);

  // Keyboard navigation for problem photo gallery modal
  useEffect(() => {
    if (!activeProblemKey) return;
    const activeProb = PROBLEM_GALLERIES[activeProblemKey];
    if (!activeProb) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveProblemKey(null);
      } else if (e.key === 'ArrowLeft') {
        setProblemSlideIndex((prev) => (prev > 0 ? prev - 1 : activeProb.images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setProblemSlideIndex((prev) => (prev < activeProb.images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProblemKey]);

  // -------------------------------------------------------------
  // 2. 3D PERSPECTIVE MOUSE TILT ON CARD
  // -------------------------------------------------------------
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const MAX_TILT = 5; // degrees
    card.style.transform = `perspective(900px) rotateY(${(px * MAX_TILT).toFixed(2)}deg) rotateX(${(-py * MAX_TILT).toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  // -------------------------------------------------------------
  // 3. SHATTER EXPLOSION TRANSITION ("ROMPER LA BOLA")
  // -------------------------------------------------------------
  const triggerShatterAndNavigate = (targetModuleId = 'framework') => {
    if (isShattering) return;
    setIsShattering(true);

    const svg = svgRef.current;
    if (svg) {
      svg.classList.add("is-shattering");

      const SVG_NS = "http://www.w3.org/2000/svg";
      nodes.forEach((node) => {
        const cx = node.cx;
        const cy = node.cy;
        const color = node.color;
        const satellites = node.satellites || [];
        const count = satellites.length || 4;

        satellites.forEach((sat, idx) => {
          const angle = (Math.PI * 2 * idx) / count + (Math.PI / count);
          const dist = node.r * 1.55;
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          const rFinal = 18;

          const shard = document.createElementNS(SVG_NS, "circle");
          shard.setAttribute("cx", cx);
          shard.setAttribute("cy", cy);
          shard.setAttribute("r", "3");
          shard.setAttribute("fill", color);
          shard.setAttribute("fill-opacity", "0.95");
          shard.setAttribute("stroke", "#ffffff");
          shard.setAttribute("stroke-width", "1.5");
          shard.setAttribute("class", "shard-grow");
          shard.style.setProperty("--dx", dx.toFixed(1) + "px");
          shard.style.setProperty("--dy", dy.toFixed(1) + "px");
          shard.style.setProperty("--r-final", rFinal.toString());
          shard.style.animationDelay = (idx * 120) + "ms";
          svg.appendChild(shard);

          const line = document.createElementNS(SVG_NS, "line");
          line.setAttribute("x1", cx);
          line.setAttribute("y1", cy);
          line.setAttribute("x2", cx + dx);
          line.setAttribute("y2", cy + dy);
          line.setAttribute("class", "shard-link-line");
          svg.insertBefore(line, shard);
        });
      });
    }

    // Activate clean white transition veil
    setTimeout(() => {
      setVeilActive(true);
    }, 1800);

    // Smooth navigation into destination module
    setTimeout(() => {
      onNavigateModule(targetModuleId);
    }, 2800);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Wind': return <Wind className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Waves': return <Waves className="w-4 h-4" />;
      case 'Map': return <MapIcon className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#0d9488] selection:text-white overflow-x-hidden font-sans bg-editorial-grid">
      
      {/* Page Transition Veil (Clean White) */}
      <div className={`page-transition-veil ${veilActive ? 'is-active' : ''}`} />

      {/* SVG Gradient Defs for Objective Nodes */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="grad-oe01" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="grad-oe02" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="grad-oe03" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="grad-oe04" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e06248" />
            <stop offset="100%" stopColor="#c86d51" />
          </linearGradient>
        </defs>
      </svg>

      {/* Atmospheric Soft Light Auras */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] intro-hero-aura-a rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] intro-hero-aura-b rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] intro-hero-aura-c rounded-full pointer-events-none" />

      {/* ========================================================= */}
      {/* HERO SPLIT SECTION (WHITE EDITORIAL COPY + NETWORK)       */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 lg:py-16">
        
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* LEFT: COPY COLUMN */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Etiqueta de contexto */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50/80 border border-teal-200 text-xs font-mono text-teal-800">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>Plan para la isla &bull; zona segura a +22 metros</span>
              </div>
            </div>

            {/* Casino Animated Main Title */}
            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12] text-slate-950">
                <span ref={titlePlainRef} className="inline-block">Hábitat Resiliente & </span>
                <br className="hidden sm:inline" />
                <span 
                  ref={titleGradRef}
                  className="bg-gradient-to-r from-teal-700 via-amber-600 to-rose-600 bg-clip-text text-transparent inline-block"
                >
                  Reubicación Insular.
                </span>
              </h1>
            </div>

            {/* Central Entry Question */}
            <h2 className="text-lg sm:text-xl font-medium text-slate-800 leading-snug border-l-4 border-teal-600 pl-3.5">
              ¿Qué ocurre cuando una comunidad comienza a perder las condiciones necesarias para permanecer en su propio territorio?
            </h2>

            {/* General Research Goal Phrase */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-slate-800 leading-relaxed shadow-xs space-y-1">
              <span className="font-mono text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                Objetivo General de la Investigación
              </span>
              <p className="font-medium text-slate-800 text-[13px] leading-snug">
                &ldquo;Desarrollar una propuesta progresiva de vivienda y colegio en Tierrabomba que responda a las dinámicas comunitarias locales y permita la expansión de ambos proyectos en el tiempo.&rdquo;
              </p>
            </div>

            {/* 3 Dimensional Action Blocks: Problemática Diagnosticada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              
              <div 
                onClick={() => {
                  setActiveProblemKey('erosion');
                  setProblemSlideIndex(0);
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-400 hover:bg-rose-50/20 transition-all cursor-pointer group shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform border border-rose-100">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">PROBLEMA 01</span>
                  </div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mt-1.5 leading-snug">
                    Erosión de las costas y riesgo en las viviendas
                  </h3>
                </div>
                <div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    El golpe del mar destruye la orilla y pone en peligro las casas construidas cerca del agua.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-bold text-rose-700 group-hover:text-rose-900 transition-colors">
                    <span className="flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver fotos en sitio ({PROBLEM_GALLERIES.erosion.images.length})</span>
                    </span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => {
                  setActiveProblemKey('agua');
                  setProblemSlideIndex(0);
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer group shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform border border-amber-100">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">PROBLEMA 02</span>
                  </div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mt-1.5 leading-snug">
                    Falta de agua potable y alcantarillado
                  </h3>
                </div>
                <div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    La isla no tiene red de agua ni desagües, lo que obliga a la población a comprar agua traída en lanchas.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-bold text-amber-700 group-hover:text-amber-900 transition-colors">
                    <span className="flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver fotos en sitio ({PROBLEM_GALLERIES.agua.images.length})</span>
                    </span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => {
                  setActiveProblemKey('servicios');
                  setProblemSlideIndex(0);
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform border border-blue-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">PROBLEMA 03</span>
                  </div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mt-1.5 leading-snug">
                    Falta de servicios públicos y colegios
                  </h3>
                </div>
                <div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    Existe un abandono en la infraestructura de la isla, afectando la educación, la salud y los espacios comunitarios.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-bold text-blue-700 group-hover:text-blue-900 transition-colors">
                    <span className="flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver fotos en sitio ({PROBLEM_GALLERIES.servicios.images.length})</span>
                    </span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Buttons Row — lenguaje comunitario */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateModule('territorio')}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Home className="w-4 h-4 text-teal-400" />
                <span>Conoce la isla</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigateModule('module11')}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-xs"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Mira su historia</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateModule('3dviewer')}
                className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-2xl text-slate-700 hover:text-slate-950 font-semibold text-sm transition-colors hover:underline"
              >
                <Box className="w-4 h-4 text-slate-700" />
                <span>Recorre la propuesta &rarr;</span>
              </button>
            </div>

            {/* Autoría */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <div>
                <span className="text-slate-900 font-bold">Hecho por:</span> {projectInfo.author}
              </div>
              <div>
                <span className="text-slate-900 font-bold">Año:</span> {projectInfo.year}
              </div>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE OBJECTIVES NETWORK CARD WITH 3D TILT */}
          <div className="lg:col-span-6">
            
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-3xl p-5 sm:p-7 bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl transition-all duration-300 group"
            >
              
              {/* Question Banner */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  Los cuatro objetivos del proyecto
                </p>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  RED INTERACTIVA
                </span>
              </div>

              {/* Conventions Legend Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 mb-4">
                <span className="text-slate-800 font-bold uppercase tracking-wider text-[10px]">Leyenda:</span>
                
                <span className="flex items-center space-x-1.5">
                  <svg className="w-8 h-3" viewBox="0 0 38 12">
                    <line x1="2" y1="6" x2="28" y2="6" stroke="#0d9488" strokeWidth="1.8" strokeDasharray="3 3" />
                    <path d="M28,6 L22,2 L22,10 Z" fill="#0d9488" />
                  </svg>
                  <span>Flujo Hídrico / Físico</span>
                </span>

                <span className="flex items-center space-x-1.5">
                  <svg className="w-10 h-3" viewBox="0 0 46 12">
                    <line x1="6" y1="6" x2="40" y2="6" stroke="#c86d51" strokeWidth="1.8" strokeDasharray="3 3" />
                    <path d="M6,6 L12,2 L12,10 Z" fill="#c86d51" />
                    <path d="M40,6 L34,2 L34,10 Z" fill="#c86d51" />
                  </svg>
                  <span>Sinergia Proyectual</span>
                </span>

                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>OE-01..04</span>
                </span>
              </div>

              {/* Main SVG Diagram Container (Clean Light Blueprint) */}
              <div className="relative w-full aspect-[620/560] max-h-[560px] rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
                
                <svg
                  ref={svgRef}
                  viewBox="0 0 620 560"
                  className="network-svg w-full h-full select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  
                  {/* Subtle Grid Background Pattern */}
                  <defs>
                    <pattern id="light-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#light-grid)" />

                  {/* Central General Objective Watermark Badge */}
                  <g transform="translate(310, 295)" className="select-none pointer-events-none">
                    <circle r="46" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.95" />
                    <text textAnchor="middle" y="-12" fill="#0f172a" fontSize="8" fontWeight="800" fontFamily="Space Grotesk, sans-serif" letterSpacing="0.8">
                      OBJETIVO GENERAL
                    </text>
                    <text textAnchor="middle" y="2" fill="#64748b" fontSize="7" fontWeight="600" fontFamily="JetBrains Mono, monospace">
                      PROPUESTA PROGRESIVA
                    </text>
                    <text textAnchor="middle" y="13" fill="#0d9488" fontSize="7.5" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                      VIVIENDA Y COLEGIO
                    </text>
                    <text textAnchor="middle" y="24" fill="#64748b" fontSize="6.5" fontFamily="JetBrains Mono, monospace">
                      TIERRABOMBA
                    </text>
                  </g>

                  {/* RELATIONAL DIRECTED & BIDIRECTIONAL LINKS */}
                  <g className="links">
                    {relations.map((rel) => {
                      const isHovered = hoveredRelation === rel.id;
                      return (
                        <g 
                          key={rel.id} 
                          className={`link ${isHovered ? 'is-active' : ''}`}
                          onMouseEnter={() => setHoveredRelation(rel.id)}
                          onMouseLeave={() => setHoveredRelation(null)}
                        >
                          <path className="link-hit" d={rel.pathD} />
                          <path className="link-line" d={rel.pathD} />
                          <path className="link-arrow" d="M-13,-4 L0,0 L-13,4 Z" transform={rel.arrowTransform} />
                        </g>
                      );
                    })}
                  </g>

                  {/* 4 MAIN OBJECTIVE NODES (OE-01 to OE-04) */}
                  {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const fillGradient = `url(#grad-${node.id})`;

                    return (
                      <g
                        key={node.id}
                        className="node cursor-pointer"
                        data-node={node.id}
                        transform={`translate(${node.cx}, ${node.cy})`}
                        onClick={() => setSelectedNode(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <g className="node-float">
                          
                          {/* Halo ring on hover/selected */}
                          <circle
                            r={node.r + 8}
                            fill="none"
                            stroke={node.color}
                            strokeWidth={isHovered || isSelected ? "3" : "0"}
                            opacity={isHovered || isSelected ? "0.6" : "0"}
                            className="transition-all duration-300"
                          />

                          {/* Central node circle */}
                          <circle
                            r={node.r}
                            fill={fillGradient}
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            className="shadow-md transition-transform duration-300 hover:scale-105"
                          />

                          {/* Node Text Label (Multi-line) with drop shadow */}
                          <text
                            textAnchor="middle"
                            y={-(node.shortLines.length - 1) * 5.5 - 2}
                            fill="#ffffff"
                            fontFamily="Space Grotesk, sans-serif"
                            className="pointer-events-none select-none drop-shadow-md"
                          >
                            {node.shortLines.map((line, idx) => (
                              <tspan 
                                key={idx} 
                                x="0" 
                                dy={idx === 0 ? 0 : (idx === 1 ? 13.5 : 10.5)}
                                fontWeight={idx === 0 ? "800" : "600"}
                                fontSize={idx === 0 ? "12" : "8"}
                                letterSpacing={idx === 0 ? "0.8" : "0"}
                              >
                                {line}
                              </tspan>
                            ))}
                          </text>

                        </g>
                      </g>
                    );
                  })}

                </svg>

                {/* Hover Relation Tooltip Overlay */}
                {hoveredRelation && (
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/95 border border-teal-500/50 text-xs text-slate-800 backdrop-blur-md shadow-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-teal-800 font-mono text-[11px]">
                        {relations.find(r => r.id === hoveredRelation)?.name}
                      </p>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {relations.find(r => r.id === hoveredRelation)?.desc}
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Card Footer Actions */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>Haz clic en OE-01..04 para ver el desglose</span>
                </span>
                <button
                  onClick={() => triggerShatterAndNavigate('framework')}
                  className="text-teal-700 hover:text-teal-900 font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>Ver los objetivos &rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. OBJECTIVE DETAIL MODAL (CLEAN LIGHT THEME)            */}
      {/* ========================================================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border inline-block"
                    style={{
                      backgroundColor: `${selectedNode.color}15`,
                      borderColor: `${selectedNode.color}40`,
                      color: selectedNode.color
                    }}
                  >
                    {selectedNode.code} &bull; {selectedNode.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Meta: {selectedNode.metric}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedNode.desc}
            </p>

            {/* Sub-components / Satellites List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                Entregables Proyectuales & Componentes del Objetivo:
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedNode.satellites?.map((sat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start space-x-3">
                    <div 
                      className="p-2 rounded-lg shrink-0 mt-0.5"
                      style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
                    >
                      {getIconComponent(sat.icon)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{sat.name}</p>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{sat.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-xs font-mono text-slate-500">
                Área / Capacidad: <b className="text-slate-900">{selectedNode.area}</b>
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onNavigateModule('module11');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700"
                >
                  Ver en Módulo 01
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    triggerShatterAndNavigate('framework');
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-950 hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-md"
                >
                  <span>Ver en Módulo 02 (Marco)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL DE EVIDENCIA FOTOGRÁFICA DE PROBLEMÁTICA         */}
      {/* ========================================================= */}
      {activeProblemKey && PROBLEM_GALLERIES[activeProblemKey] && (() => {
        const activeProb = PROBLEM_GALLERIES[activeProblemKey];
        const activeImg = activeProb.images[problemSlideIndex] || activeProb.images[0];
        
        return (
          <div 
            onClick={() => setActiveProblemKey(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-up"
            >
              
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="space-y-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: activeProb.color }}
                    >
                      {activeProb.code}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Evidencia en Sitio &bull; Foto {problemSlideIndex + 1} de {activeProb.images.length}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white truncate">
                    {activeProb.title}
                  </h3>
                </div>
                
                <button
                  onClick={() => setActiveProblemKey(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Problem Quick Switch Tabs */}
              <div className="flex items-center gap-1.5 p-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto">
                {Object.values(PROBLEM_GALLERIES).map((prob) => {
                  const isCur = prob.id === activeProblemKey;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => {
                        setActiveProblemKey(prob.id);
                        setProblemSlideIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                        isCur
                          ? 'bg-white text-slate-950 shadow-sm border border-slate-300 ring-2 ring-slate-900/10'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: prob.color }}
                      />
                      <span>{prob.code}: {prob.id === 'erosion' ? 'Erosión Costera' : prob.id === 'agua' ? 'Agua Potable' : 'Servicios & Escuela'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Problem Description Banner */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 leading-snug">
                <p>
                  <b className="text-slate-900">{activeProb.badgeLabel}:</b> {activeProb.context}
                </p>
              </div>

              {/* Main Photo Viewer Area */}
              <div className="relative bg-slate-950 flex-1 min-h-[300px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
                <img
                  src={activeImg.url}
                  alt={activeImg.caption}
                  className="max-h-[50vh] max-w-full object-contain select-none transition-all duration-300 p-2"
                />

                {/* Floating Image Tag Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-mono font-bold shadow-lg">
                  {activeImg.tag}
                </div>

                {/* Slide Arrows */}
                {activeProb.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setProblemSlideIndex((prev) => (prev > 0 ? prev - 1 : activeProb.images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 backdrop-blur-sm cursor-pointer shadow-lg"
                      title="Foto anterior (Flecha Izquierda)"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => setProblemSlideIndex((prev) => (prev < activeProb.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 backdrop-blur-sm cursor-pointer shadow-lg"
                      title="Foto siguiente (Flecha Derecha)"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {activeProb.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {activeProb.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProblemSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === problemSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Caption and Source Footer */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                  {activeImg.caption}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-500 border-t border-slate-100">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="font-bold text-slate-900">Fuente:</span>
                    <span>{activeProb.source}</span>
                  </span>
                  <span className="text-teal-700 font-bold">
                    Tierrabomba &bull; Bahía de Cartagena
                  </span>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* 5. FOOTER NOTE                                            */}
      {/* ========================================================= */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-6 px-4 text-center text-xs font-mono text-slate-500">
        <p>
          TIERRABOMBA: HÁBITAT RESILIENTE &bull; Alejandra Gómez & Ana Casas &bull; Tesis de Grado en Arquitectura y Urbanismo (2026)
        </p>
      </footer>

    </div>
  );
}
