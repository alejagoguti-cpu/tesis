import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Compass, 
  Droplets, 
  Printer, 
  BookOpen,
  Home,
  Moon, 
  Sun, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Navbar({ darkMode, setDarkMode, activeSection, setActiveSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Inicio' },
    { id: 'marco-tesis', label: '01. Justificación' },
    { id: 'diagnostico', label: '02. Diagnóstico' },
    { id: 'reubicacion-proyectos', label: '03. Vivienda & Colegio' },
    { id: 'visor3d', label: '04. Visor 3D' },
    { id: 'planos', label: '05. Planos' },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-spring ${
      isScrolled 
        ? 'bg-[#faf8f5]/90 dark:bg-[#0b1015]/90 backdrop-blur-md shadow-subtle border-b border-sand-300 dark:border-deepsea-800 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollTo('hero')}>
            <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-spring">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-base tracking-tight text-sand-900 dark:text-sand-50">
                  TIERRABOMBA
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sand-200 dark:bg-deepsea-900 text-terracotta-700 dark:text-terracotta-300 font-bold border border-sand-300 dark:border-deepsea-800">
                  Tesis 2026
                </span>
              </div>
              <p className="text-[11px] text-sand-500 dark:text-deepsea-300 font-mono">
                {projectInfo.author}
              </p>
            </div>
          </div>

          {/* Desktop Monograph Nav Chapters */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/80 dark:bg-deepsea-900/80 p-1.5 rounded-full border border-sand-300 dark:border-deepsea-800 shadow-subtle backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition-spring ${
                    isActive 
                      ? 'bg-terracotta-600 text-white shadow-sm' 
                      : 'text-sand-700 dark:text-deepsea-200 hover:text-terracotta-600 dark:hover:text-sand-50 hover:bg-sand-100 dark:hover:bg-deepsea-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-deepsea-800 transition-spring border border-sand-200 dark:border-deepsea-800"
              title="Alternar tema claro/oscuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-terracotta-700" />}
            </button>

            {/* GitHub Repo Button */}
            <a
              href={projectInfo.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-sand-900 text-sand-50 dark:bg-sand-100 dark:text-sand-950 hover:opacity-90 transition-spring shadow-subtle"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-deepsea-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-sand-100 dark:bg-deepsea-950 border-b border-sand-300 dark:border-deepsea-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-spring ${
                  isActive
                    ? 'bg-terracotta-600 text-white'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-deepsea-900'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-sand-300 dark:border-deepsea-800">
            <a
              href={projectInfo.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-sand-900 text-white dark:bg-sand-100 dark:text-sand-950"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver Repositorio en GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
