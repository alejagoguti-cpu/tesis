import React from 'react';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';

// Propuesta territorial 2026 / Plan Maestro Tierra Bomba (antes en el módulo 02, ahora en el módulo 03)
export default function MasterplanCard({ step, setStep, onClose, className = 'top-36' }) {
  return (
    <div className={`absolute right-4 z-[450] w-[430px] max-w-[calc(100vw-2rem)] pointer-events-auto animate-fade-in font-sans ${className}`}>
          <div className="bg-white/95 rounded-3xl p-5 text-slate-800 shadow-2xl border border-slate-200/90 backdrop-blur-xl transition-all duration-300 max-h-[88vh] overflow-y-auto">
            
            {/* Header con Badge y Botón de Minimizar */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
                  <Compass className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block">
                    Propuesta Territorial 2026 // Tesis
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    Plan Maestro Tierra Bomba
                  </h3>
                </div>
              </div>
              <button
                onClick={() => onClose()}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                title="Minimizar panel del Plan Maestro"
              >
                ✕
              </button>
            </div>

            {/* Párrafo Introductorio Oficial */}
            <div className="text-[11.5px] leading-relaxed text-slate-700 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <p className="font-semibold text-slate-900 mb-1">
                El plan maestro representa la articulación territorial de nuestra propuesta.
              </p>
              <p className="text-slate-600 text-[11px]">
                Su primera función es identificar cómo podrían organizarse las áreas residenciales, el equipamiento educativo y los espacios colectivos en relación con los asentamientos existentes.
              </p>
            </div>

            {/* Tabs / Pasos del Tour con Botones Estilizados */}
            <div className="grid grid-cols-5 gap-1 mb-3 p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
              {[
                { label: 'Vías', idx: 0, title: 'Articulación y Vías' },
                { label: 'Colegio', idx: 1, title: 'Colegio en Meseta' },
                { label: 'Vivienda', idx: 2, title: 'Reubicación y Suelo' },
                { label: 'Senderos', idx: 3, title: 'Recorridos Peatonales' },
                { label: 'Parque', idx: 4, title: 'Parque Ecológico' },
              ].map(tab => {
                const isActive = step === tab.idx;
                return (
                  <button
                    key={tab.idx}
                    onClick={() => setStep(tab.idx)}
                    className={`py-1.5 px-1 rounded-xl text-[10.5px] transition-all cursor-pointer font-medium text-center ${
                      isActive 
                        ? 'bg-amber-500 text-white font-bold shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                    title={tab.title}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Contenido Dinámico según el Paso Seleccionado */}
            <div className="space-y-3 min-h-[160px] text-xs">
              {step === 0 && (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>1. Articulación Territorial & Red Vial</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    Para determinar su localización, proponemos evaluar la seguridad del suelo, la topografía, la accesibilidad, las condiciones ambientales, la disponibilidad de servicios y la cercanía a las actividades cotidianas de la comunidad.
                  </p>
                  <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/60 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">➔</span>
                      <span><b>Vías estructurantes (amarillo en 3D):</b> Trazado del Paso 5 que articula el asentamiento costero de Punta Arenas con el altiplano de la meseta (+22m).</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">➔</span>
                      <span><b>Conectividad integral:</b> Vincula las actividades productivas y pesqueras cotidianas con la nueva infraestructura resiliente.</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                    <span>2. Equipamiento Educativo Adentro de la Meseta</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    De esta forma, el colegio se convierte en un punto de articulación entre la comunidad y el parque: un lugar desde donde se aprende a cuidar el territorio que se habita.
                  </p>
                  <div className="bg-purple-50/70 rounded-xl p-2.5 border border-purple-200/60 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">➔</span>
                      <span><b>Cota segura (+22m):</b> Implantado adentro de la meseta, protegido de inundaciones por pleamar y socavación marina.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">➔</span>
                      <span><b>Diferenciación espacial:</b> Separa con claridad las áreas educativas de acceso controlado de los espacios de encuentro comunitario libre.</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-center space-x-2 text-sky-800 font-bold text-xs bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                    <span>3. Reubicación Habitacional & Suelo Seguro</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    Uno de los componentes del proyecto es la posible reubicación de familias cuyas viviendas no puedan mantenerse de forma segura en su localización original.
                  </p>
                  <div className="bg-sky-50/70 rounded-xl p-2.5 border border-sky-200/60 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <span className="text-sky-600 font-bold">➔</span>
                      <span><b>Estudios de respaldo:</b> Decisión respaldada por la identificación de hogares afectados y estudios para comparar alternativas de mejoramiento, adaptación o traslado.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-sky-600 font-bold">➔</span>
                      <span><b>Suelos liberados:</b> Las áreas liberadas por una eventual reubicación se integran al parque y <b>no volverán a ocuparse</b>.</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-center space-x-2 text-teal-800 font-bold text-xs bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    <span>4. Recorridos Peatonales & Espacios Colectivos</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    La organización del plan maestro busca conectar las viviendas con el colegio y los espacios públicos mediante recorridos peatonales claros. También buscamos diferenciar los espacios privados, las áreas educativas de acceso controlado y los lugares de encuentro comunitario.
                  </p>
                  <div className="bg-teal-50/70 rounded-xl p-2.5 border border-teal-200/60 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">➔</span>
                      <span><b>Recorridos paisajísticos:</b> Senderos que conectan los asentamientos, el colegio y los espacios comunitarios con el paisaje insular.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">➔</span>
                      <span><b>Patrimonio histórico:</b> Senderos que permiten reconocer el patrimonio cultural y vestigios militares de la isla.</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-fade-in space-y-2.5">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>5. Visión de Futuro: Parque Ecológico Insular</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    Estas decisiones se enmarcan en una visión de largo plazo: proyectamos el futuro de Tierra Bomba como un parque ecológico porque enfrenta presiones como la erosión costera, la pérdida de ecosistemas y la ocupación de zonas de riesgo. El parque ecológico no busca desplazar a la comunidad, sino ordenar la relación entre las personas y el territorio.
                  </p>
                  <div className="bg-emerald-50/70 rounded-xl p-2.5 border border-emerald-200/60 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">➔</span>
                      <span><b>Barreras naturales:</b> Protección y restauración de ecosistemas costeros (manglares, playas y vegetación nativa).</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">➔</span>
                      <span><b>Economía sostenible:</b> Educación ambiental, ecoturismo comunitario y pesca responsable que generen oportunidades reales.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">➔</span>
                      <span><b>Estructura integrada:</b> Vivienda, educación, espacio público y naturaleza como parte de un mismo sistema y no edificios independientes.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación Siguiente / Anterior */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(s => (s > 0 ? s - 1 : 4))}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map(idx => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      step === idx ? 'bg-amber-500 w-4' : 'bg-slate-300 w-2'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setStep(s => (s < 4 ? s + 1 : 0))}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
  );
}
