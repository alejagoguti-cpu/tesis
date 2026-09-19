import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Compass, 
  Droplets, 
  Printer, 
  Github, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { projectInfo } from '../data/projectData';

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
    { id: 'hero', label: 'Inicio', icon: Building2 },
    { id: 'diagnostico', label: 'Diagnóstico & Mapa', icon: MapPin },
    { id: 'estrategia', label: 'Estrategia', icon: Compass },
    { id: 'visor3d', label: 'Visor 3D (Revit)', icon: Layers },
    { id: 'planos', label: 'Planimetría / Plotter', icon: Printer },
    { id: 'sostenibilidad', label: 'Ciclo Hídrico', icon: Droplets },
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-architectural-950/90 backdrop-blur-md shadow-md border-b border-architectural-200 dark:border-architectural-800' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-caribbean-500 to-caribbean-700 flex items-center justify-center text-white shadow-lg shadow-caribbean-500/20 ring-2 ring-caribbean-400/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-architectural-900 dark:text-white">
                  TIERRABOMBA
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-caribbean-100 dark:bg-caribbean-900/50 text-caribbean-700 dark:text-caribbean-300 font-semibold border border-caribbean-200 dark:border-caribbean-800">
                  Tesis 2026
                </span>
              </div>
              <p className="text-xs text-architectural-500 dark:text-architectural-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                Resiliencia & Reubicación Hídrica
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 bg-architectural-100/70 dark:bg-architectural-900/70 p-1.5 rounded-full border border-architectural-200 dark:border-architectural-800 backdrop-blur-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-white dark:bg-architectural-800 text-caribbean-600 dark:text-caribbean-300 shadow-sm' 
                      : 'text-architectural-600 dark:text-architectural-300 hover:text-architectural-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-architectural-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-architectural-600 dark:text-architectural-300 hover:bg-architectural-100 dark:hover:bg-architectural-800 transition-colors border border-transparent hover:border-architectural-200 dark:hover:border-architectural-700"
              title="Alternar modo claro/oscuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-architectural-700" />}
            </button>

            {/* GitHub Repo Button */}
            <a
              href={projectInfo.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-architectural-900 text-white dark:bg-white dark:text-architectural-900 hover:opacity-90 transition-opacity shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-architectural-700 dark:text-architectural-300 hover:bg-architectural-100 dark:hover:bg-architectural-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-architectural-950 border-b border-architectural-200 dark:border-architectural-800 px-4 pt-2 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-caribbean-50 dark:bg-caribbean-950/50 text-caribbean-600 dark:text-caribbean-400 border border-caribbean-200 dark:border-caribbean-800 font-semibold'
                    : 'text-architectural-600 dark:text-architectural-300 hover:bg-architectural-100 dark:hover:bg-architectural-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-architectural-200 dark:border-architectural-800 flex justify-between items-center">
            <a
              href={projectInfo.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-architectural-900 text-white dark:bg-white dark:text-architectural-900"
            >
              <Github className="w-4 h-4" />
              <span>Ver Repositorio en GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
