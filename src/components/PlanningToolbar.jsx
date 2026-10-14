import React from 'react';
import { ZONE_TYPES } from '../utils/planningTools';

const Btn = ({ active, tone = 'slate', className = '', ...p }) => (
  <button
    {...p}
    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-slate-900 text-white shadow-md ring-2 ring-amber-400'
        : tone === 'danger'
          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-white'
    } ${className}`}
  />
);

export default function PlanningToolbar({
  mode, setMode,
  zoneType, setZoneType, zoneName, setZoneName,
  roadWidth, setRoadWidth,
  draftCount, onFinish, onUndo, onCancel,
  roads, zones, onDeleteRoad, onDeleteZone, onClearPlan, onClose
}) {
  const drawing = mode === 'road' || mode === 'zone';
  const minPts = mode === 'zone' ? 3 : 2;

  return (
    <div className="absolute top-32 right-4 z-30 w-80 max-h-[calc(100%-11rem)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-md p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase">Planeación</p>
          <h3 className="text-sm font-bold text-slate-900">Vías y zonificación</h3>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs cursor-pointer" aria-label="Cerrar">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Btn active={mode === 'road'} onClick={() => setMode(mode === 'road' ? 'none' : 'road')}>🛣️ Dibujar vía</Btn>
        <Btn active={mode === 'zone'} onClick={() => setMode(mode === 'zone' ? 'none' : 'zone')}>🗺️ Dibujar zona</Btn>
      </div>

      {mode === 'road' && (
        <div className="space-y-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex justify-between text-[11px] font-mono text-slate-700">
            <span>Ancho de la vía</span>
            <span className="font-bold">{(roadWidth * 35).toFixed(0)} m</span>
          </div>
          <input type="range" min="0.08" max="0.45" step="0.01" value={roadWidth}
            onChange={(e) => setRoadWidth(parseFloat(e.target.value))} className="w-full accent-amber-500" />
        </div>
      )}

      {mode === 'zone' && (
        <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="grid grid-cols-1 gap-1">
            {ZONE_TYPES.map((z) => (
              <button
                key={z.id}
                onClick={() => setZoneType(z.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-all cursor-pointer ${
                  zoneType === z.id ? 'bg-white shadow ring-2' : 'hover:bg-white'
                }`}
                style={zoneType === z.id ? { '--tw-ring-color': z.color } : undefined}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: z.color }} />
                <span className="font-medium text-slate-800">{z.name}</span>
              </button>
            ))}
          </div>
          <input
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Nombre opcional (ej. Barrio Norte)"
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 bg-white"
          />
        </div>
      )}

      {drawing && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-600 leading-snug">
            Haz clic sobre el terreno para ir marcando puntos ({draftCount} marcados, mínimo {minPts}). Doble clic o «Terminar» para cerrar.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Btn onClick={onUndo} disabled={draftCount === 0}>↶ Atrás</Btn>
            <Btn onClick={onCancel} disabled={draftCount === 0}>Descartar</Btn>
            <button
              onClick={onFinish}
              disabled={draftCount < minPts}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Terminar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            {roads.length} vías · {zones.length} zonas
          </span>
          {(roads.length > 0 || zones.length > 0) && (
            <button onClick={onClearPlan} className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer">Borrar todo</button>
          )}
        </div>
        {zones.map((z) => {
          const t = ZONE_TYPES.find((x) => x.id === z.type) || ZONE_TYPES[0];
          return (
            <div key={z.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="flex-1 text-xs font-medium text-slate-800 truncate">{z.name || t.name}</span>
              <button onClick={() => onDeleteZone(z.id)} className="text-rose-600 hover:text-rose-800 text-xs cursor-pointer" title="Eliminar zona">🗑</button>
            </div>
          );
        })}
        {roads.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-3 h-1.5 rounded-full shrink-0 bg-amber-500" />
            <span className="flex-1 text-xs font-medium text-slate-800 truncate">Vía {i + 1} · {(r.width * 35).toFixed(0)} m</span>
            <button onClick={() => onDeleteRoad(r.id)} className="text-rose-600 hover:text-rose-800 text-xs cursor-pointer" title="Eliminar vía">🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}
