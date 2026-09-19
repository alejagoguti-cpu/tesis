import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Layers, 
  RotateCcw, 
  Sun, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Box, 
  Sliders, 
  Info, 
  Link, 
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ModelViewer3D() {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [sunIntensity, setSunIntensity] = useState(1.2);
  const [sunAngle, setSunAngle] = useState(45);
  const [activeLayers, setActiveLayers] = useState({
    roof: true,
    structure: true,
    cistern: true,
    louvers: true,
  });
  
  // Custom Revit / Speckle Stream link integration
  const [speckleUrl, setSpeckleUrl] = useState('');
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive' | 'speckle' | 'guide'

  // Three.js instances refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const objectsRef = useRef({
    roof: null,
    structure: null,
    cistern: null,
    louvers: null,
    dirLight: null,
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1317);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 16, 26);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, sunIntensity);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    objectsRef.current.dirLight = dirLight;

    // 5. Grid Helper & Ground Plane
    const gridHelper = new THREE.GridHelper(40, 40, 0x1e9fa8, 0x273543);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141a21,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.06;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. BUILD PARAMETRIC MODEL (Tierrabomba Community Hub)
    const buildingGroup = new THREE.Group();

    // A. Foundation & Underground Cistern (Tanque Aljibe 450m³)
    const cisternGeo = new THREE.BoxGeometry(10, 3, 7);
    const cisternMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.3,
    });
    const cisternMesh = new THREE.Mesh(cisternGeo, cisternMat);
    cisternMesh.position.set(0, -1.5, 0);
    cisternMesh.castShadow = true;
    cisternMesh.receiveShadow = true;
    buildingGroup.add(cisternMesh);
    objectsRef.current.cistern = cisternMesh;

    // B. Floor Slab & Platform (Cota +0.00)
    const slabGeo = new THREE.BoxGeometry(16, 0.4, 12);
    const slabMat = new THREE.MeshStandardMaterial({ color: 0xdce1e7, roughness: 0.8 });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.set(0, 0.2, 0);
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    buildingGroup.add(slabMesh);

    // C. Structural Timber Columns / Portals
    const columnsGroup = new THREE.Group();
    const colGeo = new THREE.BoxGeometry(0.35, 4.5, 0.35);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });

    const colPositions = [
      [-6, 2.45, -4.5], [-2, 2.45, -4.5], [2, 2.45, -4.5], [6, 2.45, -4.5],
      [-6, 2.45, 0],    [-2, 2.45, 0],    [2, 2.45, 0],    [6, 2.45, 0],
      [-6, 2.45, 4.5],  [-2, 2.45, 4.5],  [2, 2.45, 4.5],  [6, 2.45, 4.5],
    ];
    colPositions.forEach(pos => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(pos[0], pos[1], pos[2]);
      col.castShadow = true;
      columnsGroup.add(col);
    });
    buildingGroup.add(columnsGroup);
    objectsRef.current.structure = columnsGroup;

    // D. Architectural Louvers / Celosías de Arcilla
    const louversGroup = new THREE.Group();
    const louverMat = new THREE.MeshStandardMaterial({ color: 0xd97736, roughness: 0.7 });
    for (let i = 0; i < 8; i++) {
      const wallBlock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 0.8), louverMat);
      wallBlock.position.set(-6, 1.8, -3.5 + i * 1.0);
      wallBlock.castShadow = true;
      louversGroup.add(wallBlock);
    }
    buildingGroup.add(louversGroup);
    objectsRef.current.louvers = louversGroup;

    // E. Rain-Harvesting Butterfly / Inverted Roof (Cubierta Captadora Pluvial)
    const roofGroup = new THREE.Group();
    const roofWingGeo = new THREE.BoxGeometry(18, 0.25, 7);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e9fa8,
      metalness: 0.4,
      roughness: 0.3,
    });

    // North wing
    const northWing = new THREE.Mesh(roofWingGeo, roofMat);
    northWing.position.set(0, 5.2, -3.2);
    northWing.rotation.x = 0.15; // Slope towards center
    northWing.castShadow = true;
    roofGroup.add(northWing);

    // South wing
    const southWing = new THREE.Mesh(roofWingGeo, roofMat);
    southWing.position.set(0, 5.2, 3.2);
    southWing.rotation.x = -0.15; // Slope towards center
    southWing.castShadow = true;
    roofGroup.add(southWing);

    // Central gutter / canal central
    const gutterGeo = new THREE.BoxGeometry(18, 0.3, 0.6);
    const gutterMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const gutter = new THREE.Mesh(gutterGeo, gutterMat);
    gutter.position.set(0, 4.75, 0);
    roofGroup.add(gutter);

    buildingGroup.add(roofGroup);
    objectsRef.current.roof = roofGroup;

    scene.add(buildingGroup);

    // 7. Mouse Orbit Controls (Native smooth implementation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { radius: 36, theta: 0.8, phi: 1.1 };

    const updateCameraPosition = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 2, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));

      updateCameraPosition();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(12, Math.min(60, spherical.radius + e.deltaY * 0.03));
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Render loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Window resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, []);

  // Update Wireframe mode
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Update Exploded View
  useEffect(() => {
    const roof = objectsRef.current.roof;
    const cistern = objectsRef.current.cistern;
    if (!roof || !cistern) return;

    if (explodedView) {
      roof.position.y = 3.5;
      cistern.position.y = -3.5;
    } else {
      roof.position.y = 0;
      cistern.position.y = 0;
    }
  }, [explodedView]);

  // Update Layers Visibility
  useEffect(() => {
    if (objectsRef.current.roof) objectsRef.current.roof.visible = activeLayers.roof;
    if (objectsRef.current.structure) objectsRef.current.structure.visible = activeLayers.structure;
    if (objectsRef.current.cistern) objectsRef.current.cistern.visible = activeLayers.cistern;
    if (objectsRef.current.louvers) objectsRef.current.louvers.visible = activeLayers.louvers;
  }, [activeLayers]);

  // Update Sun angle & lighting
  useEffect(() => {
    const light = objectsRef.current.dirLight;
    if (!light) return;
    const rad = (sunAngle * Math.PI) / 180;
    light.position.x = 25 * Math.cos(rad);
    light.position.z = 25 * Math.sin(rad);
    light.intensity = sunIntensity;
  }, [sunAngle, sunIntensity]);

  const resetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(22, 16, 26);
    cameraRef.current.lookAt(0, 2, 0);
  };

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <section id="visor3d" className="py-20 bg-architectural-950 text-white relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-caribbean-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caribbean-500/20 text-caribbean-300 text-xs font-semibold border border-caribbean-400/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Entorno 3D & Modelo BIM</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Visor Interactivo del Proyecto
            </h2>
            <p className="text-architectural-400 text-sm max-w-2xl">
              Navega la maqueta digital del equipamiento comunitario: realiza órbita (click y arrastra), zoom (rueda del ratón) y controla el despiece estructural y la simulación solar.
            </p>
          </div>

          {/* Tab navigation between Native 3D, Speckle / Revit Stream and Guide */}
          <div className="flex items-center p-1 rounded-2xl bg-architectural-900 border border-architectural-800 self-start">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'interactive' 
                  ? 'bg-caribbean-600 text-white shadow-md' 
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              Visor 3D WebGL
            </button>
            <button
              onClick={() => setActiveTab('speckle')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'speckle' 
                  ? 'bg-caribbean-600 text-white shadow-md' 
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              Conectar Revit / Speckle
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'guide' 
                  ? 'bg-caribbean-600 text-white shadow-md' 
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              Guía de Integración
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive WebGL 3D Model with Controls */}
        {activeTab === 'interactive' && (
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* 3D Canvas viewport */}
            <div className="lg:col-span-9 relative rounded-3xl overflow-hidden bg-architectural-900 border border-architectural-800 shadow-2xl h-[540px]">
              
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* Viewport Floating Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center space-x-2 bg-architectural-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-architectural-800 pointer-events-auto text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-architectural-300">Equipamiento Central + Aljibe</span>
                </div>

                <div className="flex items-center space-x-2 pointer-events-auto">
                  <button
                    onClick={resetCamera}
                    className="p-2 rounded-xl bg-architectural-950/80 backdrop-blur-md hover:bg-architectural-800 text-architectural-300 hover:text-white border border-architectural-800 transition-colors"
                    title="Restablecer vista de cámara"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWireframe(!wireframe)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium backdrop-blur-md border transition-all ${
                      wireframe 
                        ? 'bg-caribbean-500 text-white border-caribbean-400' 
                        : 'bg-architectural-950/80 text-architectural-300 hover:text-white border-architectural-800'
                    }`}
                  >
                    Wireframe: {wireframe ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Viewport Floating Bottom Navigation Hint */}
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="bg-architectural-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-architectural-800 text-[11px] text-architectural-400 flex items-center space-x-3">
                  <span>🖱️ <b>Click izquierdo:</b> Rotar</span>
                  <span>🔍 <b>Scroll:</b> Zoom</span>
                </div>
              </div>

            </div>

            {/* Side Control Panel */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Despiece / Exploded View card */}
              <div className="p-5 rounded-2xl bg-architectural-900/90 border border-architectural-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-architectural-300 uppercase">Vista de Despiece</span>
                  <Box className="w-4 h-4 text-caribbean-400" />
                </div>
                <button
                  onClick={() => setExplodedView(!explodedView)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    explodedView 
                      ? 'bg-gradient-to-r from-clay-500 to-clay-600 text-white shadow-lg shadow-clay-600/20' 
                      : 'bg-architectural-800 hover:bg-architectural-700 text-white border border-architectural-700'
                  }`}
                >
                  {explodedView ? 'Colapsar Modelo' : 'Despiezar Cubierta & Aljibe'}
                </button>
                <p className="text-[11px] text-architectural-400 leading-tight">
                  Separa verticalmente la cubierta captadora y la cisterna subterránea para inspeccionar el interior.
                </p>
              </div>

              {/* Layer Visibility Filters */}
              <div className="p-5 rounded-2xl bg-architectural-900/90 border border-architectural-800 space-y-3">
                <span className="text-xs font-bold font-mono text-architectural-300 uppercase block">Capas del Proyecto</span>
                <div className="space-y-2">
                  
                  <button
                    onClick={() => toggleLayer('roof')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeLayers.roof 
                        ? 'bg-caribbean-950/60 text-caribbean-300 border border-caribbean-800/80' 
                        : 'bg-architectural-950 text-architectural-500 border border-architectural-800 line-through'
                    }`}
                  >
                    <span>Cubierta Captadora</span>
                    {activeLayers.roof ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleLayer('structure')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeLayers.structure 
                        ? 'bg-caribbean-950/60 text-caribbean-300 border border-caribbean-800/80' 
                        : 'bg-architectural-950 text-architectural-500 border border-architectural-800 line-through'
                    }`}
                  >
                    <span>Estructura de Madera</span>
                    {activeLayers.structure ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleLayer('louvers')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeLayers.louvers 
                        ? 'bg-caribbean-950/60 text-caribbean-300 border border-caribbean-800/80' 
                        : 'bg-architectural-950 text-architectural-500 border border-architectural-800 line-through'
                    }`}
                  >
                    <span>Celosías & Fachadas</span>
                    {activeLayers.louvers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleLayer('cistern')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeLayers.cistern 
                        ? 'bg-caribbean-950/60 text-caribbean-300 border border-caribbean-800/80' 
                        : 'bg-architectural-950 text-architectural-500 border border-architectural-800 line-through'
                    }`}
                  >
                    <span>Aljibe Subterráneo 450m³</span>
                    {activeLayers.cistern ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                </div>
              </div>

              {/* Sun & Shadows simulation */}
              <div className="p-5 rounded-2xl bg-architectural-900/90 border border-architectural-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-architectural-300 uppercase">Simulación Solar</span>
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-architectural-400">
                    <span>Azimut solar:</span>
                    <span className="font-mono text-caribbean-400">{sunAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={sunAngle}
                    onChange={(e) => setSunAngle(Number(e.target.value))}
                    className="w-full accent-caribbean-500 cursor-pointer h-1.5 bg-architectural-800 rounded-lg"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Speckle / Revit Live Stream Embed */}
        {activeTab === 'speckle' && (
          <div className="p-8 rounded-3xl bg-architectural-900 border border-architectural-800 space-y-6">
            <div className="max-w-2xl space-y-2">
              <h3 className="font-display font-bold text-2xl text-white">
                Incrustar tu Modelo Directo desde Revit
              </h3>
              <p className="text-sm text-architectural-400">
                Puedes enlazar tu modelo exportado desde Revit con **Speckle** o **Autodesk Platform Services**. Pega el enlace público de tu modelo a continuación para verlo aquí mismo:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ejemplo: https://app.speckle.systems/projects/YOUR_PROJECT_ID/models/YOUR_MODEL_ID#embed=%7B%22isEnabled%22%3Atrue%7D"
                value={speckleUrl}
                onChange={(e) => setSpeckleUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-architectural-950 border border-architectural-700 text-white text-xs font-mono focus:outline-none focus:border-caribbean-500"
              />
              <button
                onClick={() => {
                  if (!speckleUrl) {
                    setSpeckleUrl('https://app.speckle.systems/projects/92b620fb17/models/76327a3b4d#embed=%7B%22isEnabled%22%3Atrue%7D');
                  }
                }}
                className="px-5 py-3 rounded-xl bg-caribbean-600 hover:bg-caribbean-500 text-white font-semibold text-xs whitespace-nowrap transition-colors"
              >
                Cargar Modelo Demo
              </button>
            </div>

            {/* Embedded Iframe */}
            <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-architectural-800 bg-architectural-950 flex items-center justify-center">
              {speckleUrl ? (
                <iframe
                  title="Speckle Revit Viewer"
                  src={speckleUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="text-center space-y-3 p-6 max-w-md">
                  <div className="w-12 h-12 rounded-2xl bg-architectural-800 flex items-center justify-center mx-auto text-caribbean-400">
                    <Box className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">Esperando enlace de Revit / Speckle</h4>
                  <p className="text-xs text-architectural-400">
                    Pega el enlace de tu stream o presiona el botón "Cargar Modelo Demo" para ver cómo se renderiza tu proyecto.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Step by Step Guide for Revit Export */}
        {activeTab === 'guide' && (
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-architectural-900 border border-architectural-800 space-y-4">
              <div className="w-8 h-8 rounded-xl bg-caribbean-500/20 text-caribbean-300 flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h4 className="font-display font-bold text-lg text-white">Instalar Conector Speckle en Revit</h4>
              <p className="text-xs text-architectural-400 leading-relaxed">
                Descarga el instalador gratuito de <b>Speckle Manager</b> e instala el plugin para tu versión de Autodesk Revit (2022, 2023, 2024 o 2025).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-architectural-900 border border-architectural-800 space-y-4">
              <div className="w-8 h-8 rounded-xl bg-caribbean-500/20 text-caribbean-300 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h4 className="font-display font-bold text-lg text-white">Enviar Modelo (Send to Stream)</h4>
              <p className="text-xs text-architectural-400 leading-relaxed">
                Abre tu archivo <code className="text-caribbean-300 font-mono">.rvt</code>, selecciona la vista 3D que deseas exportar y haz clic en <b>Send</b> en la pestaña de Speckle.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-architectural-900 border border-architectural-800 space-y-4">
              <div className="w-8 h-8 rounded-xl bg-caribbean-500/20 text-caribbean-300 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h4 className="font-display font-bold text-lg text-white">Copiar Enlace Embebido</h4>
              <p className="text-xs text-architectural-400 leading-relaxed">
                En el visor de Speckle web, ve a <b>Compartir &gt; Embeber (Embed)</b>, copia el URL y pégalo en el archivo de datos de esta web. ¡El jurado podrá explorarlo con un clic!
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
