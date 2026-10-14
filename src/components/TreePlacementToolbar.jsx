import React from 'react';

// Pure inline SVGs to guarantee 100% crash-proof rendering in React 19
const TreeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2a1 1 0 0 1-.8-1.7L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17z" />
    <path d="M12 22v-3" />
  </svg>
);

const PlusIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparkleIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
  </svg>
);

const SaveIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const ResetIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default function TreePlacementToolbar({
  isPlanting = false,
  setIsPlanting = () => {},
  plantScale = 1.0,
  setPlantScale = () => {},
  selectedTree = null,
  onScaleChange = () => {},
  onDeleteTree = () => {},
  onClearAll = () => {},
  treesCount = 0,
  onDeselect = () => {},
  onClose = () => {}
}) {
  const numPlantScale = typeof plantScale === 'number' && !isNaN(plantScale) ? plantScale : 1.0;
  const numSelectedScale = selectedTree && typeof selectedTree.scale === 'number' && !isNaN(selectedTree.scale) ? selectedTree.scale : 1.0;
  const count = typeof treesCount === 'number' && !isNaN(treesCount) ? treesCount : 0;

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-4 shadow-2xl backdrop-blur-xl text-slate-800 font-sans w-80 max-w-[92vw] animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <TreeIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">Vegetación Nativa 3D</h4>
            <p className="text-[10px] text-emerald-600 font-medium">Follaje verdoso vivo • Sin borde negro</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            {count} {count === 1 ? 'árbol' : 'árboles'}
          </span>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Cerrar panel"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Botón Principal: Modo Plantar */}
      <button
        onClick={() => setIsPlanting(!isPlanting)}
        className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md mb-3 ${
          isPlanting
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-600/20'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
        }`}
      >
        <TreeIcon className={`w-4 h-4 ${isPlanting ? 'text-white animate-pulse' : 'text-emerald-600'}`} />
        <span>{isPlanting ? '🌿 Modo Plantar ACTIVO' : '🌱 Activar Modo Plantar Árboles'}</span>
      </button>

      {isPlanting && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 mb-3 text-center animate-fade-in">
          <p className="text-[11px] text-emerald-800 leading-snug font-medium">
            🎯 <strong>Haz clic en el terreno</strong> de la isla para colocar árboles en donde tú quieras.
          </p>
        </div>
      )}

      {/* Control de Escala para Nuevos Árboles */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 text-[11px] font-medium">
            Tamaño al plantar:
          </span>
          <span className="font-bold text-emerald-700 text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
            {numPlantScale.toFixed(2)}x
          </span>
        </div>
        <input 
          type="range"
          min="0.25"
          max="3.0"
          step="0.05"
          value={numPlantScale}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) setPlantScale(v);
          }}
          className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mb-2.5"
        />
        <div className="flex gap-1.5">
          {[
            { label: 'Chico (0.6x)', val: 0.6 },
            { label: 'Medio (1.0x)', val: 1.0 },
            { label: 'Grande (1.8x)', val: 1.8 }
          ].map(p => (
            <button
              key={p.val}
              onClick={() => setPlantScale(p.val)}
              className={`flex-1 py-1 text-[10px] rounded-lg border transition-all cursor-pointer font-medium ${
                Math.abs(numPlantScale - p.val) < 0.08
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Árbol Seleccionado (Edición Individual: Agrandar, Disminuir, Eliminar) */}
      {selectedTree ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <SparkleIcon className="w-3.5 h-3.5 text-amber-600" />
              Árbol Seleccionado
            </span>
            <button
              onClick={onDeselect}
              className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Deseleccionar
            </button>
          </div>

          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 text-[11px]">Ajustar Tamaño:</span>
            <span className="font-bold text-amber-800 text-[11px]">
              {numSelectedScale.toFixed(2)}x
            </span>
          </div>

          <input 
            type="range"
            min="0.2"
            max="3.5"
            step="0.05"
            value={numSelectedScale}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onScaleChange(selectedTree.id, v);
            }}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-amber-200 rounded-lg mb-2"
          />

          <div className="flex gap-2 mb-2">
            <button
              onClick={() => onScaleChange(selectedTree.id, Math.max(0.2, numSelectedScale - 0.2))}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              title="Disminuir tamaño"
            >
              <MinusIcon className="w-3 h-3 text-amber-700" />
              <span>Reducir</span>
            </button>
            <button
              onClick={() => onScaleChange(selectedTree.id, Math.min(3.5, numSelectedScale + 0.2))}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              title="Agrandar tamaño"
            >
              <PlusIcon className="w-3 h-3 text-amber-700" />
              <span>Agrandar</span>
            </button>
          </div>

          <button
            onClick={() => onDeleteTree(selectedTree.id)}
            className="w-full py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <TrashIcon className="w-3 h-3 text-rose-600" />
            <span>Eliminar este árbol</span>
          </button>
        </div>
      ) : (
        <div className="text-[10px] text-slate-500 italic text-center py-1">
          💡 Haz clic sobre cualquier árbol en el 3D para seleccionarlo, agrandarlo o reducirlo.
        </div>
      )}

      {/* Pie del Panel: Guardado Permanente & Borrar Todo */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <SaveIcon className="w-3 h-3" />
          Guardado permanente
        </span>
        {count > 0 && (
          <button
            onClick={onClearAll}
            className="text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1 font-medium"
            title="Borrar todos los árboles colocados"
          >
            <ResetIcon className="w-2.5 h-2.5" />
            Borrar todos
          </button>
        )}
      </div>

    </div>
  );
}
