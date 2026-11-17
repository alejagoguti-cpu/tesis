import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Pause, Play, RotateCcw, X } from 'lucide-react';
import './patrimonio-canal.css';

const FOTO = `${import.meta.env.BASE_URL}images/patrimonio/san-fernando-aerea.jpg`;
const ETAPAS = [
  { titulo: 'Una entrada entre dos orillas', texto: 'Bocachica conecta el mar Caribe con la bahía de Cartagena. La posición del fuerte se entiende al mirar ese paso de agua.', accion: 'Lleva la embarcación hacia el canal.', etiqueta: '01 · Aproximarse' },
  { titulo: 'La arquitectura mira al agua', texto: 'San Fernando se sitúa en Tierra Bomba, frente al canal. Su frente curvo permite comprender cómo la forma construida se relaciona con el paso de las embarcaciones.', accion: 'Avanza y descubre la otra fortificación.', etiqueta: '02 · Reconocer' },
  { titulo: 'Dos fuertes, un mismo paso', texto: 'San Fernando y San José, situado en la orilla opuesta, formaban parte de un sistema defensivo. Su relación con el canal explica por qué este patrimonio está aquí.', accion: 'Completa el recorrido hacia la bahía.', etiqueta: '03 · Relacionar' },
];
const etapaDe = p => p < 32 ? 0 : p < 66 ? 1 : 2;
const suave = x => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };

function FotoEnPuntos({ progreso, reducida }) {
  const ref = useRef(null);
  const actual = useRef(progreso);
  actual.current = progreso;
  const [estado, setEstado] = useState('cargando');
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    if (!ctx) { setEstado('error'); return undefined; }
    let vivo = true, raf = 0, anterior = 0, visible = true, inicio = performance.now();
    const img = new Image();
    let puntos = [], w = 1, h = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      w = r.width; h = r.height; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducida && puntos.length) dibujar(performance.now());
    };
    function dibujar(t) {
      if (!vivo) return;
      ctx.clearRect(0, 0, w, h);
      const fw = Math.min(w, h * img.width / img.height), fh = fw * img.height / img.width;
      const ox = (w - fw) / 2, oy = (h - fh) / 2;
      const armado = reducida ? 1 : suave((t - inicio) / 1800);
      const pulso = reducida ? 0 : Math.sin(t * .00065) * .4;
      const paso = actual.current / 100;
      for (const q of puntos) {
        const k = reducida ? 1 : suave((armado - q.f * .25) / .75);
        const x = ox + q.x * fw + (1 - k) * (q.sx - .5) * fw * .5;
        const y = oy + q.y * fh + (1 - k) * (q.sy - .5) * fh * .5;
        ctx.fillStyle = q.c;
        ctx.globalAlpha = (.65 + .35 * k) * (q.y > .58 ? .75 + paso * .25 : 1);
        ctx.beginPath(); ctx.arc(x, y + pulso * q.f, Math.max(.48, fw / 440 * (.32 + q.l * .32)), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function bucle(t) {
      if (!vivo) return;
      raf = requestAnimationFrame(bucle);
      if (!visible || document.hidden || t - anterior < 42) return;
      anterior = t; dibujar(t);
    }
    img.onload = () => {
      if (!vivo) return;
      try {
        const c = document.createElement('canvas'); c.width = 300; c.height = Math.round(300 * img.height / img.width);
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, c.width, c.height);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width; i++) {
          const o = (j * c.width + i) * 4, r = d[o], g = d[o + 1], b = d[o + 2];
          // Retain the photograph's colour and perspective; no invented 3D depth.
          const seed = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
          const f = seed - Math.floor(seed);
          puntos.push({ x: (i + .5) / c.width, y: (j + .5) / c.height, c: `rgb(${r},${g},${b})`, l: (r + g + b) / 765, f, sx: f, sy: (f * 17) % 1 });
        }
        inicio = performance.now(); setEstado('listo'); resize();
        if (reducida) dibujar(inicio); else raf = requestAnimationFrame(bucle);
      } catch { setEstado('error'); }
    };
    img.onerror = () => { if (vivo) setEstado('error'); };
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    img.src = FOTO;
    return () => { vivo = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); img.onload = null; img.onerror = null; };
  }, [reducida]);
  return <div className="pc-foto">
    <canvas ref={ref} role="img" aria-label="Vista aérea del fuerte de San Fernando de Bocachica reconstruida con puntos de color desde una fotografía" />
    {estado === 'cargando' && <span className="pc-cargando" role="status">Formando el fuerte en puntos…</span>}
    {estado === 'error' && <img src={FOTO} alt="Vista aérea del fuerte de San Fernando de Bocachica" />}
    <span className="pc-foto-tag">01 / San Fernando · Fotografía en puntos</span>
  </div>;
}

// Coordinates in a deliberately schematic diagram, separate from the photograph.
const ruta = p => ({ x: 65 + p * 6.7, y: 158 - Math.sin(p / 100 * Math.PI) * 22 });
function Canal({ progreso, onCambiar, relacion, reducida }) {
  const svg = useRef(null), arrastrando = useRef(false);
  const b = ruta(progreso), activa = progreso >= 32;
  const mover = e => {
    const nodo = svg.current;
    const matriz = nodo.getScreenCTM();
    if (!matriz) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(matriz.inverse());
    onCambiar(Math.round(Math.max(0, Math.min(100, (pt.x - 65) / 6.7))));
  };
  return <div className={`pc-mapa ${reducida ? 'pc-sin-movimiento' : ''}`}>
    <div className="pc-mapa-cab"><span>02 / El paso de Bocachica</span><span>Esquema sin escala</span></div>
    <svg ref={svg} viewBox="0 0 800 282" role="img" aria-labelledby="pc-mapa-titulo pc-mapa-desc">
      <title id="pc-mapa-titulo">Embarcación entre San Fernando y San José</title>
      <desc id="pc-mapa-desc">San Fernando en la orilla de Tierra Bomba y San José al otro lado del canal. Usa el control Recorrer el canal para mover la embarcación y revelar su relación defensiva.</desc>
      <defs>
        <pattern id="pc-agua" width="17" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".65" fill="#559b9b" opacity=".25" /></pattern>
        <pattern id="pc-barco-puntos" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".85" fill="#f1e6d0" /></pattern>
        <pattern id="pc-piedra" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#c7b692" /></pattern>
      </defs>
      <rect width="800" height="282" fill="url(#pc-agua)" />
      <path d="M0 0H800V47L680 60 580 48 510 62 460 57 402 73 325 62 225 77 110 58 0 72Z" fill="#14201f" stroke="#51635a" strokeWidth="1" />
      <path d="M210 282L235 246 295 238 345 250 394 232 455 235 503 256 580 264 613 282Z" fill="#14201f" stroke="#51635a" strokeWidth="1" />
      <text x="28" y="31" className="pc-territorio">TIERRA BOMBA</text>
      <text x="580" y="265" className="pc-territorio">ISLA ABANICO</text>
      <path d="M65 158 Q400 114 735 158" fill="none" stroke="#70c6c0" strokeWidth="1" strokeDasharray="3 7" opacity=".5" />
      {relacion && <g opacity={activa ? 1 : .16} className="pc-relacion">
        <path d={`M378 88L${b.x} ${b.y}L415 226`} fill="none" stroke="#ef9a79" strokeWidth="1.5" strokeDasharray="5 5" />
        <circle cx={b.x} cy={b.y} r="28" fill="none" stroke="#ef9a79" opacity=".25" />
      </g>}
      <g fill="url(#pc-piedra)" stroke="#d9c8a8" strokeWidth="1.2">
        <path d="M344 53L354 42 371 49 389 44 407 56 408 76Q377 116 344 76Z" />
        <path d="M389 220L417 213 440 228 439 244 389 244Z" />
      </g>
      <text x="443" y="82" className="pc-monumento">San Fernando</text><path d="M408 76L433 76" stroke="#d9c8a8" opacity=".5" />
      <text x="454" y="231" className="pc-monumento">San José</text>
      <text x="25" y="202" className="pc-destino">MAR CARIBE</text><text x="620" y="202" className="pc-destino">HACIA LA BAHÍA →</text>
      <g transform={`translate(${b.x} ${b.y})`} className="pc-barco" onPointerDown={e => { e.preventDefault(); arrastrando.current = true; e.currentTarget.setPointerCapture(e.pointerId); mover(e); }} onPointerMove={e => { if (arrastrando.current) mover(e); }} onPointerUp={() => { arrastrando.current = false; }} onPointerCancel={() => { arrastrando.current = false; }}>
        <circle r="27" fill="transparent" />
        <path d="M-20 10Q0 25 25 7L-20 7Z" fill="url(#pc-barco-puntos)" />
        <path d="M0 6V-27M3-25L18 3H3ZM-3-20L-16 3H-3" fill="url(#pc-barco-puntos)" stroke="#e6ece3" strokeWidth="1" />
        {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={-18 + i * 2} cy={10 + Math.sin(i / 19 * Math.PI) * 6} r="1.3" fill="#ffbd94" />)}
        <path d="M-33 16L-48 16M-28 21L-39 21" stroke="#70c6c0" strokeWidth="1" opacity=".65" />
      </g>
    </svg>
    <p className="pc-leyenda"><i />Relación defensiva ilustrada <span>·</span> Arrastra el barco o usa el control inferior.</p>
  </div>;
}

export default function PatrimonioCanal({ onClose }) {
  const [progreso, setProgreso] = useState(0), [reproduciendo, setReproduciendo] = useState(false);
  const [relacion, setRelacion] = useState(true), [fuentes, setFuentes] = useState(false);
  const [reducida, setReducida] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogo = useRef(null), cerrar = useRef(null);
  const etapa = etapaDe(progreso), dato = ETAPAS[etapa], completa = progreso >= 98;
  useEffect(() => {
    const antes = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; cerrar.current?.focus();
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cambiar = e => setReducida(e.matches); m.addEventListener('change', cambiar);
    const tecla = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key !== 'Tab') return;
      const nodos = [...dialogo.current.querySelectorAll('button, input, a[href]')].filter(n => !n.disabled && n.getClientRects().length);
      const primero = nodos[0], ultimo = nodos[nodos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', tecla);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', tecla); m.removeEventListener('change', cambiar); antes?.focus?.(); };
  }, [onClose]);
  useEffect(() => {
    if (!reproduciendo) return undefined;
    let raf = 0, anterior = 0;
    const avanzar = t => {
      if (!anterior) anterior = t;
      const dt = Math.min(t - anterior, 80); anterior = t;
      if (!document.hidden) setProgreso(p => Math.min(100, p + dt / 180));
      raf = requestAnimationFrame(avanzar);
    };
    raf = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(raf);
  }, [reproduciendo]);
  useEffect(() => { if (progreso >= 100) setReproduciendo(false); }, [progreso]);
  const cambiar = p => { setReproduciendo(false); setProgreso(p); };
  return createPortal(<div className="pc-overlay" ref={dialogo} role="dialog" aria-modal="true" aria-labelledby="pc-titulo">
    <header className="pc-header"><span>Tierra Bomba <b>/ Patrimonio construido</b></span><button ref={cerrar} type="button" onClick={onClose} aria-label="Cerrar experiencia del canal"><X size={20} /><span>Volver</span></button></header>
    <div className="pc-contenido">
      <aside className="pc-relato">
        <p className="pc-kicker">Bocachica · Arquitectura y territorio</p>
        <h1 id="pc-titulo">La forma de<br />defender<br /><em>un paso.</em></h1>
        <p className="pc-intro">Un fuerte no se entiende solo por sus muros. Se entiende por el lugar que ocupa.</p>
        <div className="pc-pasos" aria-label="Etapas del recorrido">{ETAPAS.map((d, i) => <button type="button" key={d.etiqueta} aria-current={etapa === i ? 'step' : undefined} onClick={() => cambiar([0, 40, 75][i])}><span>0{i + 1}</span><i /></button>)}</div>
        <div className="pc-paso-texto" aria-live="polite" aria-atomic="true"><p className="pc-kicker">{dato.etiqueta}</p><h2>{dato.titulo}</h2><p>{dato.texto}</p></div>
        <p className="pc-indicacion"><ArrowRight size={17} />{completa ? 'Recorrido completo. La arquitectura forma un sistema.' : dato.accion}</p>
        <div className="pc-fuentes"><button type="button" aria-expanded={fuentes} aria-controls="pc-creditos" onClick={() => setFuentes(v => !v)}>{fuentes ? '−' : '+'} Fuentes y fotografía</button>{fuentes && <div id="pc-creditos">
          <p>Foto: <a href="https://commons.wikimedia.org/wiki/File:San_Fernando.jpg" target="_blank" rel="noreferrer">LorentzRTC, 2011 · Wikimedia Commons</a>. Convertida en puntos; adaptación visual bajo <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p>
          <p>Historia: <a href="https://fortificacionescartagena.com.co/es/servicios/reservas/fortificaciones-de-bocachica/" target="_blank" rel="noreferrer">Fortificaciones de Bocachica</a> y <a href="https://fortificacionescartagena.com.co/es/destination/fuerte-de-san-jose/" target="_blank" rel="noreferrer">Fuerte de San José</a>.</p>
          <p>Interpretación educativa. Foto en puntos 2D, no levantamiento 3D. El esquema, el trayecto y las líneas no representan una ruta real ni alcances medidos de artillería o visibilidad.</p>
        </div>}</div>
      </aside>
      <main className="pc-escena"><FotoEnPuntos progreso={progreso} reducida={reducida} /><Canal progreso={progreso} onCambiar={cambiar} relacion={relacion} reducida={reducida} />
        <div className="pc-controles">
          <div className="pc-control-titulo"><label htmlFor="pc-recorrido">Recorrer el canal</label><span>{Math.round(progreso)} / 100</span></div>
          <input id="pc-recorrido" type="range" min="0" max="100" step="1" value={progreso} aria-valuetext={`${Math.round(progreso)} por ciento. ${dato.titulo}`} onChange={e => cambiar(Number(e.target.value))} />
          <div className="pc-control-botones"><button type="button" className="pc-play" onClick={() => { if (progreso >= 100) setProgreso(0); setReproduciendo(v => !v); }}>{reproduciendo ? <Pause size={16} /> : <Play size={16} />}{reproduciendo ? 'Pausar' : 'Ver recorrido'}</button><button type="button" onClick={() => cambiar(0)} aria-label="Reiniciar recorrido"><RotateCcw size={16} /><span>Reiniciar</span></button><button type="button" aria-pressed={relacion} onClick={() => setRelacion(v => !v)}>{relacion ? 'Ocultar relación' : 'Mostrar relación'}</button></div>
        </div>
      </main>
    </div>
    <footer className="pc-footer"><span>San Fernando ↔ Canal de Bocachica ↔ San José</span><span>Patrimonio como relación territorial</span></footer>
  </div>, document.body);
}
