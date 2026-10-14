import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, GraduationCap } from 'lucide-react';

const BASE = (() => {
  const b = import.meta.env.BASE_URL || '/';
  return b.endsWith('/') ? b : b + '/';
})();

// Registro fotográfico en sitio. Los textos describen lo que se observa en cada fotografía.
const FOTOS = [
  {
    img: 'diag_colegio_edificio.jpg', tag: 'Edificio escolar',
    titulo: 'Edificio existente de dos niveles',
    texto: 'Bloque de concreto y mampostería con cubiertas azules y escalera exterior metálica. Sirve a la comunidad escolar sobre suelo arenoso, frente al mar.'
  },
  {
    img: 'diag_colegio_clase_exterior.jpg', tag: 'Uso del espacio',
    titulo: 'Clase dictada al aire libre',
    texto: 'Un grupo recibe clase en el exterior, bajo la sombra de la fachada, con sillas y pupitres dispuestos sobre el suelo sin pavimentar.'
  },
  {
    img: 'diag_colegio_aula.jpg', tag: 'Condición de aulas',
    titulo: 'Aula con mobiliario y cajas apilados',
    texto: 'Ventiladores, cajas y mobiliario ocupan el aula; la ventilación depende de ventiladores y de ventanas con vidrio traslúcido.'
  },
  {
    img: 'diag_colegio_muro.jpg', tag: 'Cerramiento',
    titulo: 'Muro perimetral deteriorado',
    texto: 'Pintura desprendida, humedad y manchas en el muro de bloques calados; el zócalo azul muestra pérdida de acabado y desgaste por el ambiente salino.'
  },
  {
    img: 'diag_colegio_viga.jpg', tag: 'Estructura',
    titulo: 'Viga con acero de refuerzo expuesto',
    texto: 'El recubrimiento de concreto se ha desprendido y deja a la vista el acero de refuerzo y los estribos, con fisuras en el elemento y en el muro contiguo.'
  }
];

export default function DiagnosticoColegio({ onClose }) {
  const [i, setI] = useState(0);
  const f = FOTOS[i];
  return (
    <div className="absolute left-4 top-20 z-[470] w-[430px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white/96 border border-slate-200 shadow-2xl backdrop-blur-xl overflow-hidden font-sans">
      <div className="flex items-start justify-between p-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 grid place-items-center">
            <GraduationCap className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Diagnóstico // Tesis 2026</p>
            <h3 className="font-bold text-sm text-slate-900">Diagnóstico del colegio</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer" aria-label="Cerrar"><X className="w-4 h-4" /></button>
      </div>

      <div className="relative bg-slate-900" style={{ aspectRatio: '16 / 10' }}>
        <img src={`${BASE}assets/${f.img}`} alt={f.titulo} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute left-3 top-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[10px] font-mono font-bold backdrop-blur-md">{f.tag}</span>
        <button onClick={() => setI((i + FOTOS.length - 1) % FOTOS.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow grid place-items-center cursor-pointer" aria-label="Anterior"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => setI((i + 1) % FOTOS.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow grid place-items-center cursor-pointer" aria-label="Siguiente"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="p-4 space-y-2.5">
        <h4 className="font-semibold text-slate-900 text-[13px]">{f.titulo}</h4>
        <p className="text-[12px] leading-relaxed text-slate-600">{f.texto}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1.5">
            {FOTOS.map((_, k) => (
              <button key={k} onClick={() => setI(k)} className={'h-2 rounded-full transition-all cursor-pointer ' + (k === i ? 'w-5 bg-amber-500' : 'w-2 bg-slate-300')} aria-label={'Foto ' + (k + 1)} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-slate-400">{i + 1}/{FOTOS.length}</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {FOTOS.map((p, k) => (
            <button key={p.img} onClick={() => setI(k)} className={'rounded-lg overflow-hidden border-2 cursor-pointer ' + (k === i ? 'border-amber-500' : 'border-transparent opacity-70 hover:opacity-100')} style={{ aspectRatio: '1 / 1' }}>
              <img src={`${BASE}assets/${p.img}`} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
