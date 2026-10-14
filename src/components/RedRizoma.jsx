import React, { useState } from 'react';
import { Target, Expand, Sun, RotateCcw } from 'lucide-react';

// Red rizomática de la vivienda progresiva. Mismo lenguaje visual que la red de Diseño colaborativo:
// lienzo lógico 1000 x 640, todo en % y texto en cqw para que nada se desborde.
const W = 1000;
const H = 640;
const R = 80;

const NODES = [
  {
    id: 'n1', icon: Target, title: ['Núcleo', 'inicial'], color: '#0f766e', tint: '#ccfbf1', y: 110,
    left: 'Estructura preparada para crecer', right: 'Puntos de expansión definidos'
  },
  {
    id: 'n2', icon: Expand, title: ['Ampliación', 'básica'], color: '#1d4ed8', tint: '#dbeafe', y: 320,
    left: 'Flexibilidad controlada', right: 'Crecimiento por adición'
  },
  {
    id: 'n3', icon: Sun, title: ['Condiciones de', 'habitabilidad'], color: '#c2410c', tint: '#ffedd5', y: 530,
    left: 'Espacios con más confort', right: 'Continuidad espacial'
  }
];

const CX = 500;
const CARD = { w: 270, h: 66, gapL: 70 }; // tarjetas a cada lado del nodo
const LX = 60; // x izquierda de las tarjetas izquierdas
const RX = 670; // x izquierda de las tarjetas derechas

const pct = (v, t) => `${(v / t) * 100}%`;

export default function RedRizoma() {
  const [open, setOpen] = useState([]);
  const isOpen = (id) => open.includes(id);
  const nodeShown = (i) => i === 0 || isOpen(NODES[i - 1].id);
  const toggle = (i) => setOpen((o) => {
    const id = NODES[i].id;
    if (!o.includes(id)) return [...o, id];
    // cerrar un nodo colapsa lo que crece a partir de él
    const downstream = NODES.slice(i).map((n) => n.id);
    return o.filter((x) => !downstream.includes(x));
  });

  const fade = (visible, dx = 0, dy = 14) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0) scale(1)' : `translate(${dx}px,${dy}px) scale(.95)`,
    transition: 'opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1)',
    pointerEvents: visible ? 'auto' : 'none'
  });
  const line = (visible) => ({ strokeDasharray: 1, strokeDashoffset: visible ? 0 : 1, transition: 'stroke-dashoffset .8s ease' });

  const leftY = (n) => n.y;
  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 py-5 select-none"
      style={{ height: 'calc(100vh - 65px)', background: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0) 0 0/26px 26px, #ffffff' }}>
      <div className="w-full max-w-6xl flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] text-teal-700 uppercase">Marco conceptual · Módulo 1.4</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Vivienda progresiva · rizoma</h2>
        </div>
        <button onClick={() => setOpen([])} className="h-9 px-4 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-semibold hover:border-slate-400 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /><span>Reiniciar</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, maxHeight: '100%', maxWidth: `calc((100vh - 190px) * ${W / H})`, containerType: 'inline-size' }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none" style={{ overflow: 'visible' }}>
            {/* cadena principal entre nodos */}
            {NODES.slice(0, -1).map((n, i) => (
              <path key={`c${i}`} pathLength="1" d={`M ${CX} ${n.y + R} L ${CX} ${NODES[i + 1].y - R}`}
                stroke={NODES[i + 1].color} strokeOpacity=".7" strokeWidth="3.5" strokeLinecap="round" style={line(isOpen(n.id))} />
            ))}
            {NODES.map((n, i) => (
              <g key={`s${n.id}`}>
                <path pathLength="1" d={`M ${CX - R} ${n.y} C ${CX - R - 60} ${n.y}, ${LX + CARD.w + 50} ${n.y}, ${LX + CARD.w} ${n.y}`}
                  stroke={n.color} strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" style={line(isOpen(n.id))} />
                <path pathLength="1" d={`M ${CX + R} ${n.y} C ${CX + R + 60} ${n.y}, ${RX - 50} ${n.y}, ${RX} ${n.y}`}
                  stroke={n.color} strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" style={line(isOpen(n.id))} />
              </g>
            ))}
            {/* enlaces rizomáticos: conexiones transversales entre los descriptores (no jerárquicas) */}
            {NODES.slice(0, -1).map((n, i) => {
              const m = NODES[i + 1];
              const vis = isOpen(n.id) && isOpen(m.id);
              return (
                <g key={`z${i}`} strokeLinecap="round" strokeDasharray="2 8" strokeWidth="2.2" style={{ opacity: vis ? 0.55 : 0, transition: 'opacity .8s ease' }}>
                  <path d={`M ${LX + 40} ${n.y + CARD.h / 2} C ${LX - 40} ${(n.y + m.y) / 2}, ${LX - 10} ${m.y - 70}, ${LX + 60} ${m.y - CARD.h / 2}`} stroke={n.color} />
                  <path d={`M ${RX + CARD.w - 40} ${n.y + CARD.h / 2} C ${RX + CARD.w + 40} ${(n.y + m.y) / 2}, ${RX + CARD.w + 10} ${m.y - 70}, ${RX + CARD.w - 60} ${m.y - CARD.h / 2}`} stroke={n.color} />
                  <path d={`M ${LX + CARD.w - 30} ${n.y + CARD.h / 2} C ${CX - 60} ${n.y + 70}, ${CX + 60} ${m.y - 70}, ${RX + 30} ${m.y - CARD.h / 2}`} stroke={m.color} />
                  <path d={`M ${RX + 30} ${n.y + CARD.h / 2} C ${CX + 60} ${n.y + 70}, ${CX - 60} ${m.y - 70}, ${LX + CARD.w - 30} ${m.y - CARD.h / 2}`} stroke={n.color} />
                </g>
              );
            })}
          </svg>

          {NODES.map((n, i) => {
            const Icon = n.icon;
            const shown = nodeShown(i);
            return (
              <div key={n.id}>
                {/* nodo */}
                <div
                  onClick={() => toggle(i)}
                  className="absolute grid place-items-center rounded-full text-center cursor-pointer hover:scale-[1.03]"
                  style={{
                    left: pct(CX - R, W), top: pct(n.y - R, H), width: pct(R * 2, W), height: pct(R * 2, H),
                    background: 'radial-gradient(circle at 30% 25%, #1e3a52, #0f2433 72%)',
                    boxShadow: `0 0 0 0.7cqw ${n.color}33, 0 0 0 1.5cqw ${n.color}14, 0 18px 40px -12px rgba(15,36,51,.55)`,
                    ...fade(shown, 0, -10)
                  }}
                >
                  <div>
                    <Icon style={{ width: '3cqw', height: '3cqw', color: '#fff', margin: '0 auto 0.5cqw' }} strokeWidth={1.5} />
                    {n.title.map((t) => (
                      <p key={t} className="font-serif font-bold text-white leading-tight" style={{ fontSize: '1.45cqw' }}>{t}</p>
                    ))}
                    <div className="mx-auto mt-[0.5cqw] h-[2px] w-[2.4cqw] rounded" style={{ background: n.color === '#0f766e' ? '#5eead4' : n.color === '#1d4ed8' ? '#93c5fd' : '#fdba74' }} />
                  </div>
                </div>

                {/* descriptores izquierdo y derecho */}
                {[['left', LX, n.left, -24], ['right', RX, n.right, 24]].map(([side, x, text, dx]) => (
                  <div
                    key={side}
                    className="absolute flex items-center bg-white rounded-xl border"
                    style={{
                      left: pct(x, W), top: pct(n.y - CARD.h / 2, H), width: pct(CARD.w, W), height: pct(CARD.h, H),
                      padding: side === 'left' ? '0 1.6cqw 0 1.2cqw' : '0 1.2cqw 0 1.6cqw', gap: '1cqw',
                      flexDirection: side === 'left' ? 'row' : 'row-reverse', textAlign: side === 'left' ? 'right' : 'left',
                      borderColor: `${n.color}40`,
                      background: `linear-gradient(${side === 'left' ? 270 : 90}deg, ${n.tint}90, #fff 55%)`,
                      boxShadow: '0 10px 22px -12px rgba(15,23,42,.3)',
                      ...fade(isOpen(n.id), dx, 0)
                    }}
                  >
                    <span className="shrink-0 rounded-full" style={{ width: '0.9cqw', height: '0.9cqw', background: n.color }} />
                    <span className="flex-1 font-sans font-semibold text-slate-800 leading-tight uppercase tracking-wide" style={{ fontSize: '1.2cqw', overflowWrap: 'anywhere' }}>{text}</span>
                  </div>
                ))}
              </div>
            );
          })}

          {open.length === 0 && (
            <div className="absolute pointer-events-none" style={{ left: pct(CX + R + 24, W), top: pct(NODES[0].y - 18, H) }}>
              <p className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-lg animate-pulse">← Haz clic en el núcleo</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Cada clic hace crecer la red: el núcleo despliega sus ítems y da paso al siguiente nivel</p>
    </div>
  );
}
