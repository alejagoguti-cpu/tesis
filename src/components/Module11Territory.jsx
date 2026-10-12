import React from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Waves, 
  Home, 
  ShieldCheck, 
  Users, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function Module11Territory({ onNavigateModule }) {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-100 text-slate-800 p-4 sm:p-8 lg:p-12 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* Big Highlight Box: Central Question DIRECTAMENTE SIN TITULO ARRIBA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent border-2 border-amber-500/40 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-2 text-red-700 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Pregunta Central de Investigación</span>
          </div>
          <h2 className="font-serif italic font-black text-xl sm:text-3xl text-slate-900 leading-tight">
            "¿Qué ocurre cuando una comunidad comienza a perder las condiciones necesarias para permanecer en su propio territorio?"
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-1">
            Caso de estudio aplicado a la <strong>Isla de Tierrabomba, Bahía de Cartagena de Indias</strong> (Población: 4.300 habitantes expuestos a socavación costera y estrés hídrico crónico).
          </p>
        </div>

        {/* 3 Critical Diagnosis Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Pérdida Física */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-red-600 font-bold tracking-wider">
                01. Socavación Frecuente
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Pérdida Física del Suelo
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed text-justify">
              Con un retroceso costero de hasta <strong>1.8 metros por año</strong>, las mareas de leva desestabilizan los cimientos de más de <strong>120 viviendas</strong> y el colegio en cota +1.5m, empujando a las familias a un colapso estructural inminente.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Tasa de erosión:</span>
              <span className="font-bold text-red-600">1.8 m/año</span>
            </div>
          </div>

          {/* Card 2: Inseguridad Hídrica */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-700 font-bold tracking-wider">
                02. Aislamiento Básico
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Inseguridad Hídrica Absoluta
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed text-justify">
              Sin un solo kilómetro de red de acueducto pública (<strong>0% de cobertura formal</strong>), la supervivencia depende del suministro especulativo de barcazas marítimas y compra de pimpinas a costos desproporcionados para la economía insular.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Red formal:</span>
              <span className="font-bold text-amber-700">0% Acueducto</span>
            </div>
          </div>

          {/* Card 3: Ruptura Social */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-teal-700 font-bold tracking-wider">
                03. Desarraigo Forzado
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Fractura del Tejido Social
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed text-justify">
              Cuando el territorio deja de ser habitable, la comunidad enfrenta la dispersión involuntaria hacia las periferias de Cartagena, diluyendo su memoria conchera, saberes de pesca tradicional y la cohesión comunitaria ancestral.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Hogares en riesgo:</span>
              <span className="font-bold text-teal-700">120 Familias</span>
            </div>
          </div>

        </div>

        {/* Detailed Conceptual Analysis Block */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-terracotta-600 font-bold uppercase tracking-wider">
              Análisis Teórico // Hábitat Resiliente
            </span>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Las Fases del Desarraigo Territorial
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
            <p>
              La pérdida de condiciones para permanecer en el territorio no es un suceso instantáneo, sino un proceso acumulativo de desgaste. Inicialmente, las familias despliegan estrategias reactivas de adaptación precaria: levantan muros provisionales de escombros, racionan el agua recolectada en tanques plásticos y alteran sus ritmos de vida según la marea.
            </p>
            <p>
              Sin embargo, al alcanzarse el <strong>umbral crítico de no retorno</strong> —marcado por la socavación física irreversible y el encarecimiento desmedido de los insumos vitales—, la permanencia deja de ser viable. Si la respuesta estatal o proyectual es el abandono, el desenlace es el <em>desplazamiento forzado por causas climáticas y abandono institucional</em>.
            </p>
          </div>

          {/* Testimonio */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start space-x-3 shadow-md">
            <div className="p-2 rounded-xl bg-terracotta-600/30 text-terracotta-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-serif italic text-xs sm:text-sm text-slate-200">
                "{projectInfo.communityVoice.quote}"
              </p>
              <span className="text-[10px] font-mono text-terracotta-300 block">
                — {projectInfo.communityVoice.author} &bull; {projectInfo.communityVoice.context}
              </span>
            </div>
          </div>
        </div>

        {/* Thesis Proposed Answer (Masterplan) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
              La Respuesta Proyectual // Tesis 2026–2050
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              De la Resignación a la Relocalización con Identidad y Permanencia
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Meseta Segura (+22.00 m.s.n.m.)</span>
              </div>
              <p className="text-justify text-xs text-stone-300">
                Se traslada la zona habitacional hacia la meseta central libre de socavación y protegida ante el aumento del nivel del mar para los próximos 100 años, manteniendo a la comunidad dentro de su propia isla.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Célula Hídrica Autónoma (450kL)</span>
              </div>
              <p className="text-justify text-xs text-stone-300">
                Captación pluvial en la cubierta del colegio comunitario y en los techos de 120 módulos de vivienda progresiva, garantizando 90 días de autonomía de reserva continua.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
