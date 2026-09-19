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
  const [selectedPoint, setSelectedPoint] = useState(null);

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

    // High quality OpenStreetMap / CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Layer 1: Critical Erosion Zones (Punta Arena shoreline & western edge)
    const erosionLine = L.polyline([
      [10.3700, -75.5600],
      [10.3650, -75.5720],
      [10.3500, -75.5850],
      [10.3350, -75.5900],
      [10.3200, -75.5880],
    ], {
      color: '#f43f5e',
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.85,
    }).bindPopup('<b>Línea de Erosión Crítica</b><br>Retroceso anual estimado: 1.5 a 2.0 m/año.');

    // Layer 2: Saline Intrusion / Water crisis zone
    const waterCrisisArea = L.circle([10.3550, -75.5780], {
      radius: 1200,
      color: '#f59e0b',
      fillColor: '#f59e0b',
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
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.35,
      weight: 3,
    }).bindPopup('<b>Meseta Segura de Reubicación (+22 m.s.n.m.)</b><br>Zona no inundable y protegida de oleaje.');

    // Landmark markers
    const puntaArenaMarker = L.marker([10.3660, -75.5650]).bindPopup('<b>Punta Arena</b><br>Poblado con mayor riesgo de erosión costera.');
    const bocachicaMarker = L.marker([10.3220, -75.5840]).bindPopup('<b>Bocachica & Fuertes Históricos</b><br>Borde sur de la isla.');
    const proposalMarker = L.marker([10.3505, -75.5635], {
      icon: L.divIcon({
        className: 'custom-pin',
        html: '<div style="background-color:#1e9fa8; width:26px; height:26px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px;">🏛️</div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      })
    }).bindPopup('<b>Propuesta: Equipamiento Comunitario e Hídrico</b><br>Nueva implantación arquitectónica.');

    // Add elements to map
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

    if (type === 'erosion') {
      layers.map.flyTo([10.3550, -75.5780], 13.5);
    } else if (type === 'water') {
      layers.map.flyTo([10.3550, -75.5780], 13.5);
    } else if (type === 'relocation') {
      layers.map.flyTo([10.3505, -75.5635], 14.5);
    } else {
      layers.map.flyTo([10.3510, -75.5720], 13);
    }
  };

  return (
    <section id="diagnostico" className="py-20 bg-architectural-100/60 dark:bg-architectural-900/40 border-y border-architectural-200 dark:border-architectural-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-warningCoral/10 text-warningCoral text-xs font-semibold border border-warningCoral/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Diagnóstico Situacional</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-architectural-900 dark:text-white tracking-tight">
            {projectInfo.diagnosis.title}
          </h2>
          <p className="text-architectural-600 dark:text-architectural-300 text-base leading-relaxed">
            {projectInfo.diagnosis.summary}
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
                className="p-6 rounded-2xl bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${
                      isWater ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      isHousing ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                      'bg-caribbean-500/10 text-caribbean-600 dark:text-caribbean-400'
                    }`}>
                      {isWater && <Droplets className="w-6 h-6" />}
                      {isHousing && <Home className="w-6 h-6" />}
                      {isEducation && <GraduationCap className="w-6 h-6" />}
                      {!isWater && !isHousing && !isEducation && <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-architectural-100 dark:bg-architectural-800 text-architectural-600 dark:text-architectural-300 font-semibold">
                      {point.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-architectural-900 dark:text-white">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-architectural-600 dark:text-architectural-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <button
                  onClick={() => handleFilterLayer(point.id === 'equipamiento' ? 'relocation' : point.id)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-caribbean-600 dark:text-caribbean-400 hover:text-caribbean-700 dark:hover:text-caribbean-300 pt-2"
                >
                  <span>Ubicar en el mapa</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Map of Tierrabomba */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-architectural-900 border border-architectural-200 dark:border-architectural-800 shadow-xl">
          
          {/* Map Controls Toolbar */}
          <div className="p-4 sm:p-5 border-b border-architectural-200 dark:border-architectural-800 flex flex-wrap items-center justify-between gap-4 bg-architectural-50/70 dark:bg-architectural-950/60">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-caribbean-500" />
              <span className="font-display font-bold text-sm text-architectural-900 dark:text-white">
                Cartografía de Vulnerabilidad & Nueva Implantación
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleFilterLayer('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'all' 
                    ? 'bg-architectural-900 text-white dark:bg-white dark:text-architectural-900 shadow-sm' 
                    : 'bg-white dark:bg-architectural-800 text-architectural-600 dark:text-architectural-300 border border-architectural-200 dark:border-architectural-700'
                }`}
              >
                Todas las capas
              </button>
              <button
                onClick={() => handleFilterLayer('erosion')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'erosion'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-architectural-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span>Erosión Costera</span>
              </button>
              <button
                onClick={() => handleFilterLayer('water')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'water'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-architectural-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Acuífero Salinizado</span>
              </button>
              <button
                onClick={() => handleFilterLayer('relocation')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'relocation'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-architectural-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Meseta de Reubicación (+22m)</span>
              </button>
            </div>
          </div>

          {/* Map canvas container */}
          <div className="relative h-[480px] w-full">
            <div ref={mapContainerRef} className="h-full w-full z-0" />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-architectural-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-architectural-200 dark:border-architectural-800 shadow-lg text-xs space-y-2 max-w-[240px]">
              <p className="font-bold text-architectural-900 dark:text-white font-mono text-[11px] uppercase">Convenciones</p>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" />
                <span className="text-architectural-600 dark:text-architectural-300">Línea de erosión (1.8m/a)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500" />
                <span className="text-architectural-600 dark:text-architectural-300">Intrusión salina</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500" />
                <span className="text-architectural-600 dark:text-architectural-300">Polígono seguro (+22m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🏛️</span>
                <span className="text-architectural-600 dark:text-architectural-300">Nuevo Equipamiento</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
