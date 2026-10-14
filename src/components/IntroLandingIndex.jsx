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
  Waves
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
            
            {/* Academic Tag & Re-animate trigger */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50/80 border border-teal-200 text-xs font-mono text-teal-800">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>Plan Maestro Insular &bull; Cota +22.00 m.s.n.m.</span>
              </div>
              <button
                onClick={() => setScrambleKey(prev => prev + 1)}
                title="Re-ejecutar animación de caracteres"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors text-xs flex items-center space-x-1 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Re-animar</span>
              </button>
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
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'oe01'))}
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
                <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                  El golpe del mar destruye la orilla y pone en peligro las casas construidas cerca del agua.
                </p>
              </div>

              <div 
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'oe03'))}
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
                <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                  La isla no tiene red de agua ni desagües, lo que obliga a la población a comprar agua traída en lanchas.
                </p>
              </div>

              <div 
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'oe04'))}
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
                <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                  Existe un abandono en la infraestructura de la isla, afectando la educación, la salud y los espacios comunitarios.
                </p>
              </div>

            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => triggerShatterAndNavigate('framework')}
                disabled={isShattering}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>{isShattering ? 'Accediendo al marco...' : 'MÓDULO 01: MARCO DE TESIS'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigateModule('module11')}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-xs"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>MÓDULO 1.1: PLANOS HISTÓRICOS</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateModule('3dviewer')}
                className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-2xl text-slate-600 hover:text-slate-950 font-mono text-xs transition-colors hover:underline"
              >
                <Box className="w-4 h-4 text-slate-700" />
                <span>MÓDULO 02: VISOR 3D &rarr;</span>
              </button>
            </div>

            {/* Author and Academic Credentials */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-500">
              <div>
                <span className="text-slate-900 font-bold">Tesistas:</span> {projectInfo.author}
              </div>
              <div>
                <span className="text-slate-900 font-bold">Año:</span> {projectInfo.year}
              </div>
              <div>
                <span className="text-teal-700 font-bold">Coordenadas:</span> {projectInfo.coordinates}
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
                  Articulación de los Objetivos Específicos (OE-01 a OE-04)
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
                            y={-node.shortLines.length * 6.5 + 4}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="700"
                            fontFamily="Space Grotesk, sans-serif"
                            className="pointer-events-none select-none drop-shadow-md"
                          >
                            {node.shortLines.map((line, idx) => (
                              <tspan 
                                key={idx} 
                                x="0" 
                                dy={idx === 0 ? 0 : 13.5}
                                fontWeight={idx === 0 ? "800" : "600"}
                                fontSize={idx === 0 ? "12" : "10"}
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
                  <span>Ver Marco de Objetivos &rarr;</span>
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
      {/* 4. FOOTER NOTE                                            */}
      {/* ========================================================= */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-6 px-4 text-center text-xs font-mono text-slate-500">
        <p>
          TIERRABOMBA: HÁBITAT RESILIENTE &bull; Alejandra Gómez & Ana Casas &bull; Tesis de Grado en Arquitectura y Urbanismo (2026)
        </p>
      </footer>

    </div>
  );
}
