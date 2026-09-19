import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Info, 
  Layers,
  Compass,
  ArrowUpRight,
  Home,
  GraduationCap
} from 'lucide-react';
import { projectInfo } from '../data/projectData';
import L from 'leaflet';

// Fix Leaflet marker icons safely in Vite/React
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (e) {
    // safe fallback
  }
}

export default function DiagnosisMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'erosion', 'water', 'relocation'

  // Coordinate center for Tierrabomba Island: [10.3510, -75.5720]
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Clean up if already initialized
    if (mapInstanceRef.current?.map) {
      mapInstanceRef.current.map.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [10.3510, -75.5720],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // High quality Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Layer 1: Critical Erosion Zones (Punta Arena shoreline)
    const erosionLine = L.polyline([
      [10.3700, -75.5600],
      [10.3650, -75.5720],
      [10.3500, -75.5850],
      [10.3350, -75.5900],
      [10.3200, -75.5880],
    ], {
      color: '#c86d51',
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.9,
    }).bindPopup('<b>Línea de Erosión Crítica</b><br>Retroceso anual de 1.5 a 1.8 m/año.');

    // Layer 2: Saline Intrusion / Water crisis zone
    const waterCrisisArea = L.circle([10.3550, -75.5780], {
      radius: 1200,
      color: '#d97706',
      fillColor: '#d97706',
      fillOpacity: 0.18,
      weight: 2,
    }).bindPopup('<b>Acuífero Salinizado</b><br>Intrusión marina imposibilita pozos de agua dulce.');

    // Layer 3: Relocation Safe Plateau Zone
    const safeZonePolygon = L.polygon([
      [10.3520, -75.5680],
      [10.3560, -75.5640],
      [10.3490, -75.5590],
      [10.3450, -75.5630],
    ], {
      color: '#0f766e',
      fillColor: '#0f766e',
      fillOpacity: 0.35,
      weight: 3,
    }).bindPopup('<b>Meseta Segura de Reubicación (+22 m.s.n.m.)</b><br>Zona no inundable y protegida de oleaje.');

    // Landmark markers
    const puntaArenaMarker = L.marker([10.3660, -75.5650]).bindPopup('<b>Punta Arena</b><br>Asentamiento con mayor socavación de playa.');
    const bocachicaMarker = L.marker([10.3220, -75.5840]).bindPopup('<b>Bocachica & Fuertes Históricos</b><br>Borde sur insular.');
    const proposalMarker = L.marker([10.3505, -75.5635], {
      icon: L.divIcon({
        className: 'custom-pin',
        html: '<div style="background-color:#c86d51; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 2px 10px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:13px;">🏛️</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      })
    }).bindPopup('<b>Propuesta: 120 Viviendas & Equipamiento Educativo</b><br>Meseta Central +22m.');

    erosionLine.addTo(map);
    waterCrisisArea.addTo(map);
    safeZonePolygon.addTo(map);
    puntaArenaMarker.addTo(map);
    bocachicaMarker.addTo(map);
    proposalMarker.addTo(map);

    mapInstanceRef.current = {
      map,
      erosionLine,
      waterCrisisArea,
      safeZonePolygon,
      proposalMarker
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleFilterLayer = (type) => {
    setActiveLayer(type);
    const layers = mapInstanceRef.current;
    if (!layers) return;

    if (type === 'erosion' || type === 'vivienda') {
      layers.map.flyTo([10.3550, -75.5780], 13.5);
    } else if (type === 'agua') {
      layers.map.flyTo([10.3550, -75.5780], 13.5);
    } else if (type === 'relocation' || type === 'educacion') {
      layers.map.flyTo([10.3505, -75.5635], 14.5);
    } else {
      layers.map.flyTo([10.3510, -75.5720], 13);
    }
  };

  return (
    <section id="diagnostico" className="py-24 bg-white dark:bg-deepsea-950 border-b border-sand-300 dark:border-deepsea-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Chapter 02 Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand-300 dark:border-deepsea-800 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest block">
              Capítulo 02 // Diagnóstico Territorial
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sand-900 dark:text-sand-50 tracking-tight">
              Cartografía de Vulnerabilidad & Cota Segura
            </h2>
          </div>
          <p className="text-sand-600 dark:text-deepsea-300 text-xs sm:text-sm font-mono max-w-md">
            Identificación de la franja crítica de erosión marina y delimitación de la meseta de reubicación (+22.00 m.s.n.m.).
          </p>
        </div>

        {/* 3 Pillars of Problem */}
        <div className="grid md:grid-cols-3 gap-6">
          {projectInfo.diagnosis.points.map((point) => {
            const isWater = point.id === 'agua';
            const isHousing = point.id === 'vivienda';
            const isEducation = point.id === 'educacion';
            return (
              <div
                key={point.id}
                className="p-7 rounded-2xl bg-sand-50 dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-subtle hover-lift flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${
                      isWater ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' :
                      isHousing ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-400' :
                      'bg-caribbean-500/15 text-caribbean-700 dark:text-caribbean-400'
                    }`}>
                      {isWater && <Droplets className="w-5 h-5" />}
                      {isHousing && <Home className="w-5 h-5" />}
                      {isEducation && <GraduationCap className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white dark:bg-deepsea-950 text-sand-700 dark:text-deepsea-200 font-bold border border-sand-200 dark:border-deepsea-800">
                      {point.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-sand-900 dark:text-sand-50">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <button
                  onClick={() => handleFilterLayer(point.id)}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 pt-2 transition-colors"
                >
                  <span>Ver polígono en mapa</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Cartography Frame */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-deepsea-900 border border-sand-300 dark:border-deepsea-800 shadow-architectural">
          
          {/* Map Controls Toolbar */}
          <div className="p-4 sm:p-5 border-b border-sand-300 dark:border-deepsea-800 flex flex-wrap items-center justify-between gap-4 bg-sand-100/80 dark:bg-deepsea-950/80">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sand-800 dark:text-sand-200">
              <Compass className="w-4 h-4 text-terracotta-600" />
              <span>SISTEMA DE INFORMACIÓN GEOGRÁFICA (SIG) // TIERRABOMBA</span>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleFilterLayer('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-spring ${
                  activeLayer === 'all' 
                    ? 'bg-sand-900 text-white dark:bg-sand-100 dark:text-sand-950 shadow-sm' 
                    : 'bg-white dark:bg-deepsea-900 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-deepsea-800'
                }`}
              >
                Todas las capas
              </button>
              <button
                onClick={() => handleFilterLayer('erosion')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-spring ${
                  activeLayer === 'erosion'
                    ? 'bg-terracotta-600 text-white shadow-sm'
                    : 'bg-white dark:bg-deepsea-900 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-300 dark:border-terracotta-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-terracotta-500 inline-block" />
                <span>Erosión Costera</span>
              </button>
              <button
                onClick={() => handleFilterLayer('water')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-spring ${
                  activeLayer === 'water'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-deepsea-900 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Acuífero Salinizado</span>
              </button>
              <button
                onClick={() => handleFilterLayer('relocation')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-spring ${
                  activeLayer === 'relocation'
                    ? 'bg-caribbean-700 text-white shadow-sm'
                    : 'bg-white dark:bg-deepsea-900 text-caribbean-700 dark:text-caribbean-300 border border-caribbean-300 dark:border-caribbean-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-caribbean-500 inline-block" />
                <span>Meseta Segura (+22m)</span>
              </button>
            </div>
          </div>

          {/* Map canvas container */}
          <div className="relative h-[480px] w-full">
            <div ref={mapContainerRef} className="h-full w-full z-0" />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-deepsea-950/95 backdrop-blur-md p-4 rounded-2xl border border-sand-300 dark:border-deepsea-800 shadow-architectural text-xs space-y-2 max-w-[240px]">
              <p className="font-bold text-sand-900 dark:text-white font-mono text-[10px] uppercase tracking-wider">Convenciones</p>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-0.5 border-t-2 border-dashed border-terracotta-500" />
                <span className="text-sand-600 dark:text-deepsea-300 text-[11px]">Borde erosionable (1.8m/a)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500" />
                <span className="text-sand-600 dark:text-deepsea-300 text-[11px]">Acuífero salinizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-caribbean-500/30 border border-caribbean-500" />
                <span className="text-sand-600 dark:text-deepsea-300 text-[11px]">Meseta segura (+22m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🏛️</span>
                <span className="text-sand-600 dark:text-deepsea-300 text-[11px]">120 Casas + Colegio</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
