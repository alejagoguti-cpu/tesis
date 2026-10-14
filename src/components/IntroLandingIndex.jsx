import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldAlert,
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
  Maximize2,
  X,
  RotateCcw
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function IntroLandingIndex({ onNavigateModule }) {
  const [selectedNode, setSelectedNode] = useState(null);
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
  // 1. CASINO SCRAMBLE TEXT REVEAL ANIMATION (MODELAMIENTO2 STYLE)
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
      const totalTicks = 8 + i * 2; // Cascade stop timing
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

  // -------------------------------------------------------------
  // 2. 3D PERSPECTIVE MOUSE TILT ON CARD (MODELAMIENTO2 STYLE)
  // -------------------------------------------------------------
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const MAX_TILT = 5.5; // degrees
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
  const triggerShatterAndNavigate = (targetModuleId = '3dviewer') => {
    if (isShattering) return;
    setIsShattering(true);

    const svg = svgRef.current;
    if (svg) {
      svg.classList.add("is-shattering");

      // Generate satellite shard elements dynamically
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
          shard.setAttribute("stroke-width", "1.2");
          shard.setAttribute("class", "shard-grow");
          shard.style.setProperty("--dx", dx.toFixed(1) + "px");
          shard.style.setProperty("--dy", dy.toFixed(1) + "px");
          shard.style.setProperty("--r-final", rFinal.toString());
          shard.style.animationDelay = (idx * 120) + "ms";
          svg.appendChild(shard);

          // Connection line to center
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

    // Activate transition veil after shards expand
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
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0c10] text-[#f3efe9] selection:bg-[#2fd4c8] selection:text-[#0a0c10] overflow-x-hidden font-sans">
      
      {/* Page Transition Veil */}
      <div className={`page-transition-veil ${veilActive ? 'is-active' : ''}`} />

      {/* SVG Gradient Defs for Network Nodes & Relations */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="grad-water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#45d6c5" />
            <stop offset="100%" stopColor="#1f8f82" />
          </linearGradient>
          <linearGradient id="grad-territory" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff8f8f" />
            <stop offset="100%" stopColor="#d94f5c" />
          </linearGradient>
          <linearGradient id="grad-civic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5c26b" />
            <stop offset="100%" stopColor="#d9902e" />
          </linearGradient>
          <linearGradient id="grad-eco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb37a" />
            <stop offset="100%" stopColor="#e8763c" />
          </linearGradient>
          <linearGradient id="grad-aurora" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2fd4c8" />
            <stop offset="50%" stopColor="#edfffe" />
            <stop offset="100%" stopColor="#ef6f6f" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient background auras drifting gracefully */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] intro-hero-aura-a rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] intro-hero-aura-b rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] intro-hero-aura-c rounded-full pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (RAPOT / MODELAMIENTO2 STYLE)               */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#0e1218]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand with Pulsing Nodes */}
          <div className="flex items-center space-x-3.5">
            <div className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center p-1 shadow-sm">
              <svg className="w-7 h-7" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="17" r="15" stroke="rgba(47,212,200,0.55)" strokeWidth="1.4" />
                <circle cx="17" cy="8" r="3" fill="#2fd4c8" className="animate-pulse" />
                <circle cx="9" cy="22" r="3" fill="#ef6f6f" />
                <circle cx="25" cy="22" r="3" fill="#f5c26b" />
                <circle cx="17" cy="17" r="2" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-wide text-white font-display">
                  TIERRABOMBA
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2fd4c8]/15 text-[#2fd4c8] border border-[#2fd4c8]/30">
                  TESIS 2026
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Hábitat Resiliente &bull; Arquitectura & Urbanismo
              </p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden lg:flex items-center p-1 rounded-full bg-[#161b22] border border-white/10 text-xs font-medium">
            <button 
              onClick={() => onNavigateModule('intro')}
              className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-bold shadow-sm transition-all"
            >
              INICIO
            </button>
            <button 
              onClick={() => onNavigateModule('module11')}
              className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
            >
              PREGUNTA CENTRAL
            </button>
            <button 
              onClick={() => onNavigateModule('framework')}
              className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
            >
              MARCO ACADÉMICO
            </button>
            <button 
              onClick={() => onNavigateModule('gis')}
              className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
            >
              DIAGNÓSTICO GIS
            </button>
            <button 
              onClick={() => onNavigateModule('3dviewer')}
              className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
            >
              VISOR 3D BIM
            </button>
            <button 
              onClick={() => onNavigateModule('revit')}
              className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors"
            >
              MODELO REVIT
            </button>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => triggerShatterAndNavigate('3dviewer')}
              className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#2fd4c8] via-[#edfffe] to-[#ef6f6f] text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-200 active:scale-95"
            >
              <span>EXPLORAR MODELO 3D</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SPLIT SECTION (COPY + INTERACTIVE NETWORK CARD)   */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-14">
        
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* LEFT: COPY COLUMN */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Academic Tag & Re-animate trigger */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#2fd4c8]">
                <span className="w-2 h-2 rounded-full bg-[#2fd4c8] animate-ping" />
                <span>Plan Maestro Insular &bull; Cota +22.00 m.s.n.m.</span>
              </div>
              <button
                onClick={() => setScrambleKey(prev => prev + 1)}
                title="Re-ejecutar animación de caracteres"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Re-animar</span>
              </button>
            </div>

            {/* Casino Animated Main Title */}
            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12] text-white">
                <span ref={titlePlainRef} className="inline-block">Hábitat Resiliente & </span>
                <br className="hidden sm:inline" />
                <span 
                  ref={titleGradRef}
                  className="bg-gradient-to-r from-[#2fd4c8] via-[#f5c26b] to-[#ef6f6f] bg-clip-text text-transparent inline-block"
                >
                  Reubicación Insular.
                </span>
              </h1>
            </div>

            {/* Central Entry Question */}
            <h2 className="text-lg sm:text-xl font-medium text-[#edfffe] leading-snug border-l-2 border-[#2fd4c8] pl-3.5">
              ¿Qué ocurre cuando una comunidad comienza a perder las condiciones necesarias para permanecer en su propio territorio?
            </h2>

            {/* Lead Narrative Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Investigación y propuesta proyectual frente a la erosión costera de hasta <b>1.8 m/año</b> en la <b>Isla de Tierrabomba</b> (Bahía de Cartagena): reubicación comunitaria de <b>120 familias</b> hacia la meseta segura, equipamiento educativo bioclimático y macro-aljibe de <b>450.000 L</b> para soberanía hídrica continua.
            </p>

            {/* 3 Dimensional Action Blocks (Counterpart of DESCOMPONE, ORGANIZA, PRIORIZA) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              
              <div 
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'territory'))}
                className="p-4 rounded-2xl bg-[#161b22]/90 border border-white/10 hover:border-[#ef6f6f]/60 hover:bg-[#1a212b] transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#ef6f6f]/15 text-[#ef6f6f] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  RELOCALIZA
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  120 viviendas palafíticas retiradas de la socavación a cota segura (+22m).
                </p>
              </div>

              <div 
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'water'))}
                className="p-4 rounded-2xl bg-[#161b22]/90 border border-white/10 hover:border-[#2fd4c8]/60 hover:bg-[#1a212b] transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#2fd4c8]/15 text-[#2fd4c8] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  CAPTURA & ALMACENA
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Macro-cubierta de 1.850 m², cisterna de 450.000 L y potabilización solar UV.
                </p>
              </div>

              <div 
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'civic'))}
                className="p-4 rounded-2xl bg-[#161b22]/90 border border-white/10 hover:border-[#f5c26b]/60 hover:bg-[#1a212b] transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#f5c26b]/15 text-[#f5c26b] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Wind className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  BIOCLIMÁTICA
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Confort pasivo (-5°C) con celosías de arcilla BTC, madera y talleres náuticos.
                </p>
              </div>

            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => triggerShatterAndNavigate('3dviewer')}
                disabled={isShattering}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#2fd4c8] hover:bg-[#28bebe] text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Box className="w-4 h-4" />
                <span>{isShattering ? 'Descomponiendo red...' : 'EXPLORAR EL MODELO 3D'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigateModule('module11')}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
              >
                <span>PREGUNTA CENTRAL</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateModule('overview')}
                className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white font-mono text-xs transition-colors"
              >
                <span>CENTRO DE CONTROL &bull; KPIs &rarr;</span>
              </button>
            </div>

            {/* Testimonio Comunitario de Campo */}
            <div className="p-4 rounded-2xl bg-[#141920]/80 border-l-4 border-[#2fd4c8] border-y border-r border-white/10 text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center space-x-2 text-[#2fd4c8] font-mono font-bold tracking-wider uppercase text-[11px]">
                <Quote className="w-3.5 h-3.5" />
                <span>Memoria Social del Territorio</span>
              </div>
              <p className="italic text-slate-300 font-serif leading-relaxed">
                "{projectInfo.communityVoice.quote}"
              </p>
              <p className="text-[10px] font-mono text-slate-500">
                &mdash; {projectInfo.communityVoice.author} &bull; {projectInfo.communityVoice.context}
              </p>
            </div>

            {/* Author and Academic Credentials */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-200 font-bold">Tesistas:</span> {projectInfo.author}
              </div>
              <div>
                <span className="text-slate-200 font-bold">Año:</span> {projectInfo.year}
              </div>
              <div>
                <span className="text-[#2fd4c8] font-bold">Coordenadas:</span> {projectInfo.coordinates}
              </div>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE NETWORK DIAGRAM CARD WITH 3D TILT */}
          <div className="lg:col-span-6">
            
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-3xl p-5 sm:p-7 bg-[#12161f]/95 border border-white/15 shadow-2xl backdrop-blur-xl transition-all duration-300 group"
            >
              
              {/* Question Banner */}
              <p className="text-sm font-medium text-[#edfffe] mb-3 leading-snug">
                ¿Cómo interactúan los cuatro sistemas de resiliencia territorial e hídrica?
              </p>

              {/* Conventions Legend Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 mb-4">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Convenciones:</span>
                
                <span className="flex items-center space-x-1.5">
                  <svg className="w-8 h-3" viewBox="0 0 38 12">
                    <line x1="2" y1="6" x2="28" y2="6" stroke="#2fd4c8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M28,6 L22,2 L22,10 Z" fill="#2fd4c8" />
                  </svg>
                  <span>Flujo Hídrico</span>
                </span>

                <span className="flex items-center space-x-1.5">
                  <svg className="w-10 h-3" viewBox="0 0 46 12">
                    <line x1="6" y1="6" x2="40" y2="6" stroke="#ef6f6f" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M6,6 L12,2 L12,10 Z" fill="#ef6f6f" />
                    <path d="M40,6 L34,2 L34,10 Z" fill="#ef6f6f" />
                  </svg>
                  <span>Sinergia Comunal</span>
                </span>

                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5c26b]" />
                  <span>Cota +22m</span>
                </span>
              </div>

              {/* Main SVG Diagram Container */}
              <div className="relative w-full aspect-[620/560] max-h-[560px] rounded-2xl bg-[#090c10] border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                
                <svg
                  ref={svgRef}
                  viewBox="0 0 620 560"
                  className="network-svg w-full h-full select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  
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

                  {/* 4 MAIN FLOATING STRUCTURAL NODES */}
                  {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const fillGradient = `url(#grad-${node.colorKey})`;

                    return (
                      <g
                        key={node.id}
                        className="node cursor-pointer"
                        data-node={node.colorKey}
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
                            strokeWidth={isHovered || isSelected ? "2.5" : "0"}
                            opacity={isHovered || isSelected ? "0.7" : "0"}
                            className="transition-all duration-300"
                          />

                          {/* Central node circle */}
                          <circle
                            r={node.r}
                            fill={fillGradient}
                            stroke="rgba(255,255,255,0.45)"
                            strokeWidth="1.5"
                            className="shadow-lg transition-transform duration-300 hover:scale-105"
                          />

                          {/* Node Text Label (Multi-line) */}
                          <text
                            textAnchor="middle"
                            y={-node.shortLines.length * 7 + 4}
                            fill="#ffffff"
                            fontSize="11.5"
                            fontWeight="700"
                            fontFamily="Space Grotesk, sans-serif"
                            className="pointer-events-none select-none drop-shadow"
                          >
                            {node.shortLines.map((line, idx) => (
                              <tspan key={idx} x="0" dy={idx === 0 ? 0 : 14}>
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
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#161b22]/95 border border-[#2fd4c8]/50 text-xs text-[#edfffe] backdrop-blur-md shadow-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2fd4c8] font-mono text-[11px]">
                        {relations.find(r => r.id === hoveredRelation)?.name}
                      </p>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {relations.find(r => r.id === hoveredRelation)?.desc}
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Card Footer Actions */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Haz clic en un nodo para inspeccionar capas</span>
                </span>
                <button
                  onClick={() => triggerShatterAndNavigate('3dviewer')}
                  className="text-[#2fd4c8] hover:text-white font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>Ver Despiece 3D &rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. NODE DETAIL MODAL (REDES-MODAL-OVERLAY IN MODELAMIENTO2) */}
      {/* ========================================================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#12161f] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span 
                  className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border inline-block"
                  style={{
                    backgroundColor: `${selectedNode.color}20`,
                    borderColor: `${selectedNode.color}50`,
                    color: selectedNode.color
                  }}
                >
                  {selectedNode.badge} &bull; {selectedNode.metric}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedNode.desc}
            </p>

            {/* Sub-components / Satellites List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Capas Técnicas & Componentes Proyectuales:
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedNode.satellites?.map((sat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                    <div 
                      className="p-2 rounded-lg shrink-0 mt-0.5"
                      style={{ backgroundColor: `${selectedNode.color}25`, color: selectedNode.color }}
                    >
                      {getIconComponent(sat.icon)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{sat.name}</p>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{sat.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <span className="text-xs font-mono text-slate-400">
                Área / Capacidad: <b className="text-white">{selectedNode.area}</b>
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onNavigateModule('framework');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200"
                >
                  Ver en Marco Académico
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    triggerShatterAndNavigate('3dviewer');
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2fd4c8] hover:bg-[#28bebe] text-slate-950 flex items-center space-x-1.5"
                >
                  <span>Explorar en Visor 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FOOTER NOTE                                            */}
      {/* ========================================================= */}
      <footer className="relative z-10 border-t border-white/10 bg-[#090c10] py-6 px-4 text-center text-xs font-mono text-slate-500">
        <p>
          TIERRABOMBA: HÁBITAT RESILIENTE &bull; Alejandra Gómez & Ana Casas &bull; Tesis de Grado en Arquitectura y Urbanismo (2026)
        </p>
      </footer>

    </div>
  );
}
