import React, { useState, useEffect, useCallback } from 'react';
import { Home, Network, Lightbulb, Wrench, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const BRANCHES = [
  { id: 'b1', label: ['Participación activa de', 'los habitantes'], icon: Home, y: 172, leaves: [['Intervención en decisiones', 99], ['Incidencia en el diseño', 180]] },
  { id: 'b2', label: ['Toma de decisiones', 'colectivas'], icon: Network, y: 297, leaves: [['Acuerdos comunitarios', 241], ['Organización social', 319]] },
  { id: 'b3', label: ['Co-producción del', 'espacio habitado'], icon: Lightbulb, y: 430, leaves: [['Diseño conjunto', 387], ['Construcción compartida', 466]] },
  { id: 'b4', label: ['Apropiación y', 'construcción de', 'comunidad'], icon: Wrench, y: 553, leaves: [['Sentido de pertenencia', 531], ['Fortalecimiento social', 612]] }
];

// Orden de aparición: centro, rama, sus dos hojas, siguiente rama...
const SEQUENCE = ['center', ...BRANCHES.flatMap((b) => [b.id, `${b.id}-0`, `${b.id}-1`])];

const CENTER = { x: 115, y: 373, r: 85 };
const TRUNK_X = 262;
const BOX_X = 358, BOX_W = 250, BOX_H = 80;
const LEAF_X = 757, LEAF_W = 218, LEAF_H = 48;
const DOT = '#5f8aa0';

const appear = (visible) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateX(0)' : 'translateX(-14px)',
  transition: 'opacity .5s ease, transform .5s ease',
  pointerEvents: visible ? 'auto' : 'none'
});

export default function RedColaborativa() {
  const [step, setStep] = useState(0); // cantidad de items visibles
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

  // clic en una rama: muestra sus hojas si aun no estan
  const revealBranch = (id) => {
    const idx = SEQUENCE.indexOf(`${id}-1`);
    setStep((s) => Math.max(s, idx + 1));
  };

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center p-4 select-none" style={{ height: "calc(100vh - 65px)" }}>
      <div className="w-full max-w-6xl flex items-center justify-between mb-2">
        <div className="text-xs font-mono font-bold text-slate-500">
          RED CONCEPTUAL · <span className="text-slate-900">{step}/{SEQUENCE.length}</span> ítems
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prev} disabled={step === 0} className="p-2 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-100"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={next} disabled={step >= SEQUENCE.length} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold disabled:opacity-30 hover:bg-teal-700 flex items-center space-x-1"><span>Siguiente</span><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setStep(0)} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100" title="Reiniciar"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <svg viewBox="0 0 1040 660" className="w-full max-w-6xl flex-1 min-h-0" onClick={next} style={{ cursor: step < SEQUENCE.length ? 'pointer' : 'default' }}>
        {BRANCHES.map((b) => {
          const dir = b.y > CENTER.y ? 1 : -1;
          return (
            <path key={`c-${b.id}`} d={`M ${CENTER.x + CENTER.r} ${CENTER.y} H ${TRUNK_X - 30} Q ${TRUNK_X} ${CENTER.y} ${TRUNK_X} ${CENTER.y + dir * 30} V ${b.y - dir * 30} Q ${TRUNK_X} ${b.y} ${TRUNK_X + 30} ${b.y} H ${BOX_X}`}
              fill="none" stroke="#b9d3e3" strokeWidth="4" strokeDasharray="14 9" strokeLinecap="round"
              style={{ opacity: shown(b.id) ? 1 : 0, transition: 'opacity .5s ease' }} />
          );
        })}
        {BRANCHES.map((b) => b.leaves.map(([, ly], i) => {
          const dir = ly > b.y ? 1 : -1;
          return (
            <path key={`l-${b.id}-${i}`} d={`M ${BOX_X + BOX_W} ${b.y} H 690 Q 715 ${b.y} 715 ${b.y + dir * 25} V ${ly - dir * 25} Q 715 ${ly} 740 ${ly} H ${LEAF_X}`}
              fill="none" stroke={DOT} strokeWidth="4" strokeDasharray="14 9" strokeLinecap="round"
              style={{ opacity: shown(`${b.id}-${i}`) ? 1 : 0, transition: 'opacity .5s ease' }} />
          );
        }))}

        <g style={appear(shown('center'))}>
          <circle cx={CENTER.x} cy={CENTER.y} r={CENTER.r} fill="#d9e5ee" stroke="#4a6f8a" strokeWidth="8" />
          <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#1f2937">VIVIENDA</text>
          <text x={CENTER.x} y={CENTER.y + 18} textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#1f2937">COLABORATIVA</text>
        </g>

        {BRANCHES.map((b) => {
          const Icon = b.icon;
          const top = b.y - BOX_H / 2;
          const lh = 24;
          const startY = b.y - ((b.label.length - 1) * lh) / 2 + 6;
          return (
            <g key={b.id} style={appear(shown(b.id))} onClick={(e) => { e.stopPropagation(); revealBranch(b.id); }} cursor="pointer">
              <rect x={BOX_X} y={top} width={BOX_W} height={BOX_H} fill="#fff" stroke={DOT} strokeWidth="5" strokeDasharray="2 7" strokeLinecap="round" />
              {b.label.map((t, i) => (
                <text key={i} x={BOX_X + 14} y={startY + i * lh} fontFamily="Georgia, serif" fontSize="16" fill="#111827">{t}</text>
              ))}
              <Icon x={BOX_X + BOX_W - 58} y={b.y - 22} width={46} height={46} stroke="#111827" strokeWidth={1.4} />
            </g>
          );
        })}

        {BRANCHES.map((b) => b.leaves.map(([text, ly], i) => (
          <g key={`${b.id}-${i}`} style={appear(shown(`${b.id}-${i}`))}>
            <rect x={LEAF_X} y={ly - LEAF_H / 2} width={LEAF_W} height={LEAF_H} fill="#fff" stroke={DOT} strokeWidth="5" strokeDasharray="2 7" strokeLinecap="round" />
            <text x={LEAF_X + 28} y={ly + 5} fontFamily="Georgia, serif" fontSize="15" fill="#111827">{text}</text>
          </g>
        )))}
      </svg>
      <p className="text-[11px] font-mono text-slate-400 mt-1">Clic en el lienzo, "Siguiente" o la flecha → para mostrar cada ítem · clic en una rama despliega sus ítems</p>
    </div>
  );
}
