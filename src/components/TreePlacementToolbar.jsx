import React from 'react';
import { 
  TreePine, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  X, 
  Sliders, 
  Sparkles, 
  Save,
  RotateCcw,
  Maximize2
} from 'lucide-react';

export default function TreePlacementToolbar({
  isPlanting,
  setIsPlanting,
  plantScale,
  setPlantScale,
  selectedTree,
  onScaleChange,
  onDeleteTree,
  onClearAll,
  treesCount,
  onDeselect,
  onClose
}) {
  return (
    <div className="glass-dark border border-white/20 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-white font-mono w-80 max-w-[90vw] animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
            <TreePine className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">Vegetación 3D</h4>
            <p className="text-[10px] text-emerald-400 font-sans">Sin bordes negros • Follaje verde vivo</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            {treesCount} {treesCount === 1 ? 'árbol' : 'árboles'}
          </span>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Botón Principal: Modo Plantar */}
      <button
        onClick={() => setIsPlanting(!isPlanting)}
        className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg mb-3 ${
          isPlanting
            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900 shadow-emerald-500/30'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
        }`}
      >
        <TreePine className={`w-4 h-4 ${isPlanting ? 'text-slate-950 animate-bounce' : 'text-emerald-400'}`} />
        <span>{isPlanting ? '🌿 Modo Plantar ACTIVO' : '🌱 Activar Modo Plantar Árboles'}</span>
      </button>

      {isPlanting && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-2.5 mb-3 text-center animate-fade-in">
          <p className="text-[11px] text-emerald-300 font-sans leading-tight font-medium">
            🎯 <strong className="text-white">Haz clic en el terreno</strong> de la isla para colocar un árbol donde quieras.
          </p>
        </div>
      )}

      {/* Control de Escala para Nuevos Árboles */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 text-[11px] flex items-center gap-1">
            <Sliders className="w-3 h-3 text-slate-400" />
            Tamaño al plantar:
          </span>
          <span className="font-bold text-emerald-400 text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            {plantScale.toFixed(2)}x
          </span>
        </div>
        <input 
          type="range"
          min="0.25"
          max="3.0"
          step="0.05"
          value={plantScale}
          onChange={(e) => setPlantScale(parseFloat(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg mb-2"
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
              className={`flex-1 py-1 text-[10px] rounded-lg border transition-all ${
                Math.abs(plantScale - p.val) < 0.08
                  ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Árbol Seleccionado (Edición Individual: Agrandar, Disminuir, Eliminar) */}
      {selectedTree ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 mb-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Árbol Seleccionado
            </span>
            <button
              onClick={onDeselect}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Deseleccionar
            </button>
          </div>

          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 text-[11px]">Ajustar Tamaño:</span>
            <span className="font-bold text-amber-300 text-[11px]">
              {(selectedTree.scale || 1.0).toFixed(2)}x
            </span>
          </div>

          <input 
            type="range"
            min="0.2"
            max="3.5"
            step="0.05"
            value={selectedTree.scale || 1.0}
            onChange={(e) => onScaleChange(selectedTree.id, parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg mb-2"
          />

          <div className="flex gap-2 mb-2">
            <button
              onClick={() => onScaleChange(selectedTree.id, Math.max(0.2, (selectedTree.scale || 1.0) - 0.2))}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              title="Disminuir tamaño"
            >
              <Minus className="w-3 h-3 text-amber-400" />
              <span>Reducir</span>
            </button>
            <button
              onClick={() => onScaleChange(selectedTree.id, Math.min(3.5, (selectedTree.scale || 1.0) + 0.2))}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              title="Agrandar tamaño"
            >
              <Plus className="w-3 h-3 text-amber-400" />
              <span>Agrandar</span>
            </button>
          </div>

          <button
            onClick={() => onDeleteTree(selectedTree.id)}
            className="w-full py-1.5 px-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span>Eliminar este árbol</span>
          </button>
        </div>
      ) : (
        <div className="text-[10px] text-slate-400 italic text-center py-1 font-sans">
          Tip: Haz clic sobre cualquier árbol en el 3D para seleccionarlo y cambiar su tamaño.
        </div>
      )}

      {/* Pie del Panel: Guardado Permanente & Borrar Todo */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <span className="flex items-center gap-1 text-emerald-400">
          <Save className="w-3 h-3" />
          Guardado permanente
        </span>
        {treesCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
            title="Borrar todos los árboles colocados"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Borrar todos
          </button>
        )}
      </div>

    </div>
  );
}
