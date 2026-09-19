import React from 'react';
import { 
  Building2, 
  Printer, 
  ExternalLink, 
  ArrowUp,
  Heart,
  MapPin
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

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
              <GithubIcon className="w-4 h-4" />
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
