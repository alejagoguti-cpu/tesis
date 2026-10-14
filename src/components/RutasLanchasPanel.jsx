import React from 'react';
import { ROUTE_TYPES, POINT_TYPES } from '../utils/rutasLanchas';

const Btn = ({ active, className = '', ...p }) => (
  <button
    {...p}
    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
      active ? 'bg-slate-900 text-white shadow-md ring-2 ring-amber-400' : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-white'
    } ${className}`}
  />
);

export default function RutasLanchasPanel({
  mode, setMode, routeType, setRouteType, pointType, setPointType, name, setName,
  draftCount, onFinish, onUndo, onCancel, routes, points, onDeleteRoute, onDeletePoint, onClear
}) {
  const drawing = mode === 'ruta' || mode === 'punto';
  const minPts = mode === 'ruta' ? 2 : 1;
  const types = mode === 'punto' ? POINT_TYPES : ROUTE_TYPES;
  const current = mode === 'punto' ? pointType : routeType;
  const setCurrent = mode === 'punto' ? setPointType : setRouteType;

  return (
    <div className="absolute left-4 bottom-4 z-[460] w-80 max-h-[calc(100%-6rem)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-md p-3 space-y-3 font-sans">
      <div>
        <p className="text-[10px] font-mono font-bold tracking-widest text-rose-600 uppercase">Mercurio en el agua</p>
        <h3 className="text-sm font-bold text-slate-900">Recorridos de las lanchas</h3>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
          Dibuja los recorridos Tierra Bomba ⇄ Cartagena y marca dónde llegan los desechos al agua.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Btn active={mode === 'ruta'} onClick={() => setMode(mode === 'ruta' ? 'none' : 'ruta')}>🚤 Dibujar recorrido</Btn>
        <Btn active={mode === 'punto'} onClick={() => setMode(mode === 'punto' ? 'none' : 'punto')}>☣ Marcar punto</Btn>
      </div>

      {drawing && (
        <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="grid grid-cols-1 gap-1">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setCurrent(t.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left cursor-pointer transition-all ${current === t.id ? 'bg-white shadow ring-2' : 'hover:bg-white'}`}
                style={current === t.id ? { '--tw-ring-color': t.color } : undefined}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.color }} />
                <span className="font-medium text-slate-800">{t.name}</span>
              </button>
            ))}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={mode === 'ruta' ? 'Nombre (ej. Tierra Bomba → Muelle de la Bodeguita)' : 'Nombre o nota del punto'}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 bg-white"
          />
          <p className="text-[11px] text-slate-600 leading-snug">
            {mode === 'ruta'
              ? `Clic en el mapa para marcar el trayecto (${draftCount} puntos, mínimo 2). Doble clic o «Terminar» para cerrar.`
              : 'Haz clic en el mapa donde ocurre el vertimiento o el impacto.'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Btn onClick={onUndo} disabled={draftCount === 0}>↶ Atrás</Btn>
            <Btn onClick={onCancel} disabled={draftCount === 0}>Descartar</Btn>
            <button
              onClick={onFinish}
              disabled={draftCount < minPts}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >Terminar</button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{routes.length} recorridos · {points.length} puntos</span>
          {(routes.length > 0 || points.length > 0) && (
            <button onClick={onClear} className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer">Borrar todo</button>
          )}
        </div>
        {routes.map((r, i) => {
          const t = ROUTE_TYPES.find((x) => x.id === r.type) || ROUTE_TYPES[0];
          return (
            <div key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-3 h-1.5 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="flex-1 text-xs font-medium text-slate-800 truncate">{r.name || `${t.name} ${i + 1}`}</span>
              <button onClick={() => onDeleteRoute(r.id)} className="text-rose-600 hover:text-rose-800 text-xs cursor-pointer" title="Eliminar">🗑</button>
            </div>
          );
        })}
        {points.map((p) => {
          const t = POINT_TYPES.find((x) => x.id === p.type) || POINT_TYPES[0];
          return (
            <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="flex-1 text-xs font-medium text-slate-800 truncate">{p.name || t.name}</span>
              <button onClick={() => onDeletePoint(p.id)} className="text-rose-600 hover:text-rose-800 text-xs cursor-pointer" title="Eliminar">🗑</button>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] leading-snug text-slate-400">Los recorridos y puntos los marca el equipo de tesis; no incluyen mediciones. Se guardan en este navegador.</p>
    </div>
  );
}
