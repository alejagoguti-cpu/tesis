import React, { useState } from 'react';
import { BookOpen, Users, Building2, Waves, Home, Ship, House, Leaf, RotateCcw } from 'lucide-react';

// Red "Tierra Bomba: territorio habitado". Misma estética y lógica que las redes 1.3 y 1.4:
// nodo central azul marino, tarjetas blancas con acento de color, conectores curvos de color que se dibujan
// y despliegue por clic (cada nodo abre las dimensiones con las que se conecta).
const W = 1000;
const H = 680;
const CARD = { w: 238, h: 86 };

const CENTER = { id: 'centro', x: 430, y: 355, r: 92 };

const NODES = {
  historia: { n: 'Historia y memoria', icon: BookOpen, color: '#0f766e', tint: '#ccfbf1', x: 150, y: 95 },
  espacios: { n: 'Espacios comunitarios', icon: Users, color: '#c2410c', tint: '#ffedd5', x: 440, y: 78 },
  relacion: { n: 'Relación con Cartagena', icon: Building2, color: '#6d28d9', tint: '#ede9fe', x: 800, y: 95 },
  sistema: { n: 'Sistema insular y costero', icon: Waves, color: '#1d4ed8', tint: '#dbeafe', x: 810, y: 280 },
  paisaje: { n: 'Paisaje y condiciones ambientales', icon: Leaf, color: '#4d7c0f', tint: '#ecfccb', x: 830, y: 470 },
  asentamientos: { n: 'Asentamientos', icon: Home, color: '#be185d', tint: '#fce7f3', x: 112, y: 405 },
  movilidad: { n: 'Movilidad marítima y terrestre', icon: Ship, color: '#0e7490', tint: '#cffafe', x: 262, y: 598 },
  vivienda: { n: 'Vivienda y modos de habitar', icon: House, color: '#b45309', tint: '#fef3c7', x: 640, y: 598 }
};

// vínculos del esquema original
const EDGES = [
  ['centro', 'historia'], ['centro', 'espacios'], ['centro', 'relacion'], ['centro', 'sistema'],
  ['centro', 'paisaje'], ['centro', 'asentamientos'], ['centro', 'movilidad'], ['centro', 'vivienda'],
  ['historia', 'espacios'], ['historia', 'relacion'], ['espacios', 'relacion'],
  ['relacion', 'sistema'], ['relacion', 'paisaje']
];

// al hacer clic en un nodo se despliegan estos
const REVEALS = {
  centro: ['historia', 'asentamientos', 'movilidad', 'vivienda', 'sistema'],
  historia: ['espacios'],
  espacios: ['relacion'],
  sistema: ['paisaje'],
  relacion: ['paisaje', 'sistema']
};

const shapeOf = (id) => (id === 'centro'
  ? { kind: 'circle', x: CENTER.x, y: CENTER.y, r: CENTER.r }
  : { kind: 'rect', x: NODES[id].x, y: NODES[id].y, w: CARD.w, h: CARD.h });

// punto del borde de la forma en dirección a (tx, ty)
function anchor(shape, tx, ty) {
  const dx = tx - shape.x, dy = ty - shape.y;
  const len = Math.hypot(dx, dy) || 1;
  if (shape.kind === 'circle') return [shape.x + (dx / len) * shape.r, shape.y + (dy / len) * shape.r];
  const hw = shape.w / 2, hh = shape.h / 2;
  const t = Math.min(hw / (Math.abs(dx) || 1e-6), hh / (Math.abs(dy) || 1e-6));
  return [shape.x + dx * t, shape.y + dy * t];
}

function curve(aId, bId) {
  const A = shapeOf(aId), B = shapeOf(bId);
  const [ax, ay] = anchor(A, B.x, B.y);
  const [bx, by] = anchor(B, A.x, A.y);
  const dx = bx - ax, dy = by - ay;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const k = Math.abs(dx) * 0.5;
    return `M ${ax} ${ay} C ${ax + Math.sign(dx) * k} ${ay}, ${bx - Math.sign(dx) * k} ${by}, ${bx} ${by}`;
  }
  const k = Math.abs(dy) * 0.5;
  return `M ${ax} ${ay} C ${ax} ${ay + Math.sign(dy) * k}, ${bx} ${by - Math.sign(dy) * k}, ${bx} ${by}`;
}

const pct = (v, t) => `${(v / t) * 100}%`;

export default function RedTerritorio() {
  const [visible, setVisible] = useState(['centro']);
  const [opened, setOpened] = useState([]);
  const show = (id) => visible.includes(id);

  const click = (id) => {
    if (opened.includes(id)) {
      if (id === 'centro') { setVisible(['centro']); setOpened([]); }
      return;
    }
    setOpened((o) => [...o, id]);
    setVisible((v) => Array.from(new Set([...v, ...(REVEALS[id] || [])])));
  };

  const fade = (on, dx = 0) => ({
    opacity: on ? 1 : 0,
    transform: on ? 'translateX(0) scale(1)' : `translateX(${dx}px) scale(.95)`,
    transition: 'opacity .55s cubic-bezier(.2,.8,.2,1), transform .55s cubic-bezier(.2,.8,.2,1)',
    pointerEvents: on ? 'auto' : 'none'
  });
  const line = (on) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: 'stroke-dashoffset .8s ease' });
  const edgeColor = (a, b) => (NODES[b] ? NODES[b].color : NODES[a].color);

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 py-5 select-none"
      style={{ height: 'calc(100vh - 65px)', background: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0) 0 0/26px 26px, #ffffff' }}>
      <div className="w-full max-w-6xl flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] text-teal-700 uppercase">Marco conceptual · Módulo 1.5</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Tierra Bomba: territorio habitado</h2>
        </div>
        <button onClick={() => { setVisible(['centro']); setOpened([]); }} className="h-9 px-4 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-semibold hover:border-slate-400 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /><span>Reiniciar</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, maxHeight: '100%', maxWidth: `calc((100vh - 190px) * ${W / H})`, containerType: 'inline-size' }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none" style={{ overflow: 'visible' }}>
            {EDGES.map(([a, b]) => (
              <path key={a + b} pathLength="1" d={curve(a, b)} stroke={edgeColor(a, b)} strokeOpacity=".6" strokeWidth="2.6" strokeLinecap="round"
                style={line(show(a) && show(b))} />
            ))}
          </svg>

          {/* nodo central */}
          <div
            onClick={() => click('centro')}
            className={'absolute grid place-items-center rounded-full text-center ' + (opened.includes('centro') ? '' : 'cursor-pointer hover:scale-[1.03]')}
            style={{
              left: pct(CENTER.x - CENTER.r, W), top: pct(CENTER.y - CENTER.r, H), width: pct(CENTER.r * 2, W), height: pct(CENTER.r * 2, H),
              background: 'radial-gradient(circle at 30% 25%, #1e3a52, #0f2433 70%)',
              boxShadow: '0 0 0 1.1cqw rgba(15,36,51,.08), 0 0 0 2.4cqw rgba(15,36,51,.04), 0 18px 40px -12px rgba(15,36,51,.55)'
            }}
          >
            <div style={{ padding: '0 8%' }}>
              <p className="font-serif font-bold text-white leading-tight" style={{ fontSize: '1.75cqw' }}>Tierra Bomba</p>
              <p className="font-serif text-white/90 leading-tight" style={{ fontSize: '1.3cqw' }}>territorio habitado</p>
              <div className="mx-auto mt-[0.6cqw] h-[2px] w-[3cqw] rounded bg-teal-300/80" />
            </div>
          </div>

          {/* tarjetas */}
          {Object.entries(NODES).map(([id, n]) => {
            const Icon = n.icon;
            const canOpen = !!REVEALS[id] && !opened.includes(id);
            return (
              <div
                key={id}
                onClick={() => click(id)}
                className={'absolute flex items-center bg-white rounded-2xl border overflow-hidden ' + (canOpen ? 'cursor-pointer hover:-translate-y-0.5' : '')}
                style={{
                  left: pct(n.x - CARD.w / 2, W), top: pct(n.y - CARD.h / 2, H), width: pct(CARD.w, W), height: pct(CARD.h, H),
                  borderColor: `${n.color}33`,
                  boxShadow: canOpen
                    ? `0 0 0 0.35cqw ${n.color}22, 0 14px 30px -14px rgba(15,23,42,.28), 0 2px 6px rgba(15,23,42,.05)`
                    : '0 14px 30px -14px rgba(15,23,42,.28), 0 2px 6px rgba(15,23,42,.05)',
                  ...fade(show(id), n.x < CENTER.x ? -18 : 18)
                }}
              >
                <div className="self-stretch" style={{ width: '0.7cqw', background: n.color }} />
                <div className="shrink-0 grid place-items-center rounded-full" style={{ width: '4.6cqw', height: '4.6cqw', margin: '0 1cqw 0 1.1cqw', background: n.tint }}>
                  <Icon style={{ width: '2.3cqw', height: '2.3cqw', color: n.color }} strokeWidth={1.7} />
                </div>
                <p className="flex-1 min-w-0 font-serif font-semibold text-slate-900 leading-snug" style={{ fontSize: '1.5cqw', paddingRight: '1.2cqw', overflowWrap: 'anywhere' }}>{n.n}</p>
              </div>
            );
          })}

          {opened.length === 0 && (
            <div className="absolute pointer-events-none" style={{ left: pct(CENTER.x + CENTER.r + 22, W), top: pct(CENTER.y - 18, H) }}>
              <p className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-lg animate-pulse">← Haz clic en el centro</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Haz clic en cada nodo para desplegar las dimensiones con las que se conecta</p>
    </div>
  );
}
