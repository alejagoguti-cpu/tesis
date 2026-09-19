import React from 'react';
import { 
  Building2, 
  Github, 
  Printer, 
  ExternalLink, 
  ArrowUp,
  Heart,
  MapPin
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-architectural-950 text-white border-t border-architectural-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Thesis Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-caribbean-500 to-caribbean-700 flex items-center justify-center text-white shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  TIERRABOMBA RESILIENTE
                </h3>
                <p className="text-xs text-caribbean-400 font-mono">
                  Tesis de Grado en Arquitectura &bull; 2026
                </p>
              </div>
            </div>

            <p className="text-xs text-architectural-400 leading-relaxed max-w-md">
              Propuesta de reubicación estratégica de equipamiento dotacional frente a la pérdida de borde costero y diseño de infraestructura comunitaria de autosuficiencia hídrica en la Bahía de Cartagena.
            </p>

            <div className="flex items-center space-x-2 text-xs text-architectural-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-caribbean-400" />
              <span>{projectInfo.location}</span>
            </div>
          </div>

          {/* Col 2: Academic Metadata */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-architectural-300">
              Datos Académicos
            </h4>
            <div className="space-y-1 text-xs text-architectural-400">
              <p><b className="text-white">Tesista:</b> {projectInfo.author}</p>
              <p><b className="text-white">Asesoría:</b> {projectInfo.tutors}</p>
              <p><b className="text-white">Programa:</b> Arquitectura</p>
            </div>
          </div>

          {/* Col 3: Repositories & Quick Actions */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-architectural-300">
              Código & Documentación
            </h4>
            
            <a
              href={projectInfo.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-architectural-900 hover:bg-architectural-800 border border-architectural-800 text-xs font-semibold text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Ver en GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
            </a>

            <button
              onClick={() => window.print()}
              className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-caribbean-950/60 hover:bg-caribbean-900 border border-caribbean-800 text-xs font-semibold text-caribbean-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar Dossier (PDF)</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-architectural-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-architectural-500 font-mono">
          <p>
            &copy; {new Date().getFullYear()} Tesis Tierrabomba &bull; Modelo y Planimetría en Código Abierto.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-architectural-400 hover:text-caribbean-400 transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
