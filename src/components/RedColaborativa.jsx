import React, { useState, useEffect, useCallback } from 'react';
import { Home, Network, Lightbulb, Wrench, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// Lienzo lógico 1000 x 600. Todo se posiciona en % y el texto escala con el contenedor (cqw),
// así nada se desborda en ningún tamaño de pantalla.
const W = 1000;
const H = 600;

const BRANCHES = [
  { id: 'b1', n: '01', title: 'Participación activa de los habitantes', icon: Home, color: '#0f766e', tint: '#ccfbf1', y: 75, leaves: ['Intervención en decisiones', 'Incidencia en el diseño'] },
  { id: 'b2', n: '02', title: 'Toma de decisiones colectivas', icon: Network, color: '#1d4ed8', tint: '#dbeafe', y: 225, leaves: ['Acuerdos comunitarios', 'Organización social'] },
  { id: 'b3', n: '03', title: 'Co-producción del espacio habitado', icon: Lightbulb, color: '#c2410c', tint: '#ffedd5', y: 375, leaves: ['Diseño conjunto', 'Construcción compartida'] },
  { id: 'b4', n: '04', title: 'Apropiación y construcción de comunidad', icon: Wrench, color: '#4d7c0f', tint: '#ecfccb', y: 525, leaves: ['Sentido de pertenencia', 'Fortalecimiento social'] }
];

const SEQUENCE = ['center', ...BRANCHES.flatMap((b) => [b.id, `${b.id}-0`, `${b.id}-1`])];

const C = { x: 105, y: 300, r: 85 };
const CARD = { x: 290, w: 330, h: 104 };
const LEAF = { x: 715, w: 275, h: 58, dy: 40 };

const pct = (v, total) => `${(v / total) * 100}%`;

export default function RedColaborativa() {
  const [step, setStep] = useState(0);
  const shown = (id) => SEQUENCE.indexOf(id) < step;
  const next = useCallback(() => setStep((s) => Math.min(SEQUENCE.length, s + 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const revealBranch = (id) => {
    const idx = SEQUENCE.indexOf(`${id}-1`);
    setStep((s) => Math.max(s, idx + 1));
  };

  const fade = (visible, dx = -18) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0) scale(1)' : `translateX(${dx}px) scale(.96)`,
    transition: 'opacity .55s cubic-bezier(.2,.8,.2,1), transform .55s cubic-bezier(.2,.8,.2,1)',
    pointerEvents: visible ? 'auto' : 'none'
  });

  const line = (visible) => ({
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
    transition: 'stroke-dashoffset .7s ease'
  });

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 py-5 select-none"
      style={{ height: 'calc(100vh - 65px)', background: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0) 0 0/26px 26px, #ffffff' }}>
      <div className="w-full max-w-6xl flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] text-teal-700 uppercase">Marco conceptual · Módulo 1.3</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Vivienda colaborativa</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-[11px] font-mono text-slate-500 mr-2">{step}/{SEQUENCE.length}</span>
          <button onClick={prev} disabled={step === 0} aria-label="Anterior" className="w-9 h-9 grid place-items-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 disabled:opacity-30 hover:border-slate-400"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={next} disabled={step >= SEQUENCE.length} className="h-9 px-5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-md disabled:opacity-30 hover:bg-teal-700 flex items-center gap-1.5 transition-colors"><span>Siguiente</span><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setStep(0)} aria-label="Reiniciar" className="w-9 h-9 grid place-items-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:border-slate-400"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center">
        <div
          className="relative w-full"
          onClick={next}
          style={{ aspectRatio: `${W} / ${H}`, maxHeight: '100%', maxWidth: `calc((100vh - 190px) * ${W / H})`, containerType: 'inline-size', cursor: step < SEQUENCE.length ? 'pointer' : 'default' }}
        >
          {/* Conectores */}
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none" style={{ overflow: 'visible' }}>
            {BRANCHES.map((b) => (
              <path key={`c-${b.id}`} pathLength="1" d={`M ${C.x + C.r} ${C.y} C 240 ${C.y}, 240 ${b.y}, ${CARD.x} ${b.y}`}
                stroke={b.color} strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" style={line(shown(b.id))} />
            ))}
            {BRANCHES.map((b) => b.leaves.map((_, i) => {
              const ly = b.y + (i === 0 ? -LEAF.dy : LEAF.dy);
              return (
                <path key={`l-${b.id}-${i}`} pathLength="1" d={`M ${CARD.x + CARD.w} ${b.y} C 670 ${b.y}, 670 ${ly}, ${LEAF.x} ${ly}`}
                  stroke={b.color} strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" style={line(shown(`${b.id}-${i}`))} />
              );
            }))}
          </svg>

          {/* Nodo central */}
          <div className="absolute grid place-items-center rounded-full text-center"
            style={{
              left: pct(C.x - C.r, W), top: pct(C.y - C.r, H), width: pct(C.r * 2, W), height: pct(C.r * 2, H),
              background: 'radial-gradient(circle at 30% 25%, #1e3a52, #0f2433 70%)',
              boxShadow: '0 0 0 1.1cqw rgba(15,36,51,.08), 0 0 0 2.4cqw rgba(15,36,51,.04), 0 18px 40px -12px rgba(15,36,51,.55)',
              ...fade(shown('center'), 0)
            }}>
            <div>
              <p className="font-serif font-bold text-white leading-tight" style={{ fontSize: '2.1cqw' }}>Vivienda</p>
              <p className="font-serif font-bold text-white leading-tight" style={{ fontSize: '2.1cqw' }}>colaborativa</p>
              <div className="mx-auto mt-[0.6cqw] h-[2px] w-[3cqw] rounded bg-teal-300/80" />
            </div>
          </div>

          {/* Ramas */}
          {BRANCHES.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id}
                onClick={(e) => { e.stopPropagation(); revealBranch(b.id); }}
                className="absolute flex items-center bg-white rounded-2xl border overflow-hidden hover:-translate-y-0.5"
                style={{
                  left: pct(CARD.x, W), top: pct(b.y - CARD.h / 2, H), width: pct(CARD.w, W), height: pct(CARD.h, H),
                  borderColor: `${b.color}33`, boxShadow: '0 14px 30px -14px rgba(15,23,42,.28), 0 2px 6px rgba(15,23,42,.05)',
                  ...fade(shown(b.id))
                }}>
                <div className="self-stretch" style={{ width: '0.7cqw', background: b.color }} />
                <div className="flex-1 min-w-0" style={{ padding: '0 1.4cqw' }}>
                  <p className="font-mono font-bold tracking-widest" style={{ fontSize: '0.95cqw', color: b.color }}>{b.n}</p>
                  <p className="font-serif font-semibold text-slate-900 leading-snug" style={{ fontSize: '1.7cqw', overflowWrap: 'anywhere' }}>{b.title}</p>
                </div>
                <div className="shrink-0 grid place-items-center rounded-full" style={{ width: '5.4cqw', height: '5.4cqw', marginRight: '1.4cqw', background: b.tint }}>
                  <Icon style={{ width: '2.8cqw', height: '2.8cqw', color: b.color }} strokeWidth={1.6} />
                </div>
              </div>
            );
          })}

          {/* Hojas */}
          {BRANCHES.map((b) => b.leaves.map((text, i) => {
            const ly = b.y + (i === 0 ? -LEAF.dy : LEAF.dy);
            return (
              <div key={`${b.id}-${i}`}
                className="absolute flex items-center bg-white rounded-xl border"
                style={{
                  left: pct(LEAF.x, W), top: pct(ly - LEAF.h / 2, H), width: pct(LEAF.w, W), height: pct(LEAF.h, H),
                  padding: '0 1.4cqw', gap: '1cqw', borderColor: `${b.color}40`, background: `linear-gradient(90deg, ${b.tint}80, #fff 45%)`,
                  boxShadow: '0 8px 18px -10px rgba(15,23,42,.25)', ...fade(shown(`${b.id}-${i}`))
                }}>
                <span className="shrink-0 rounded-full" style={{ width: '0.9cqw', height: '0.9cqw', background: b.color }} />
                <span className="font-sans font-medium text-slate-800 leading-tight" style={{ fontSize: '1.45cqw', overflowWrap: 'anywhere' }}>{text}</span>
              </div>
            );
          }))}

          {step === 0 && (
            <div className="absolute inset-0 grid place-items-center">
              <p className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-lg animate-pulse">Haz clic para comenzar</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Clic en el lienzo, “Siguiente” o la tecla → para revelar cada ítem · clic en una rama despliega sus ítems</p>
    </div>
  );
}
