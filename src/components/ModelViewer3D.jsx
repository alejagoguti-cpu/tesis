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
  Sparkles,
  Home,
  GraduationCap,
  Compass
} from 'lucide-react';

export default function ModelViewer3D() {
  const mountRef = useRef(null);
  const [selected3DModel, setSelected3DModel] = useState('colegio'); // 'colegio' | 'vivienda' | 'masterplan'
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
  const currentModelGroupRef = useRef(null);
  const objectsRef = useRef({
    roof: null,
    structure: null,
    cistern: null,
    louvers: null,
    dirLight: null,
  });

  // Re-build 3D Model whenever selected3DModel changes
  const buildModel = (modelType) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing model group if any
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current = null;
    }

    const modelGroup = new THREE.Group();
    objectsRef.current.roof = null;
    objectsRef.current.structure = null;
    objectsRef.current.cistern = null;
    objectsRef.current.louvers = null;

    // =========================================================================
    // MODEL 1: EQUIPAMIENTO EDUCATIVO & DISPENSARIO HÍDRICO (350 Estudiantes)
    // =========================================================================
    if (modelType === 'colegio') {
      // A. Cisterna Subterránea (450.000 L)
      const cisternGeo = new THREE.BoxGeometry(14, 3, 9);
      const cisternMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.4,
      });
      const cisternMesh = new THREE.Mesh(cisternGeo, cisternMat);
      cisternMesh.position.set(0, -1.5, 0);
      cisternMesh.castShadow = true;
      cisternMesh.receiveShadow = true;
      modelGroup.add(cisternMesh);
      objectsRef.current.cistern = cisternMesh;

      // B. Plataforma / Losa Cívica Nivel +0.00
      const slabGeo = new THREE.BoxGeometry(22, 0.4, 15);
      const slabMat = new THREE.MeshStandardMaterial({ color: 0xdce1e7, roughness: 0.8 });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(0, 0.2, 0);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      modelGroup.add(slabMesh);

      // C. Aulas & Volúmenes de Concreto / BTC
      const classroomsGroup = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.9 });
      
      // Bloque Aulas Izquierda (1-3)
      const leftWing = new THREE.Mesh(new THREE.BoxGeometry(6, 3.6, 12), wallMat);
      leftWing.position.set(-7, 2.0, 0);
      leftWing.castShadow = true;
      classroomsGroup.add(leftWing);

      // Bloque Talleres / Comedor Derecha
      const rightWing = new THREE.Mesh(new THREE.BoxGeometry(6, 3.6, 12), wallMat);
      rightWing.position.set(7, 2.0, 0);
      rightWing.castShadow = true;
      classroomsGroup.add(rightWing);

      modelGroup.add(classroomsGroup);

      // D. Estructura de Madera / Pórticos Centrales
      const structureGroup = new THREE.Group();
      const timberMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
      const colGeo = new THREE.BoxGeometry(0.35, 5.2, 0.35);

      const colPositions = [
        [-3, 2.8, -6], [0, 2.8, -6], [3, 2.8, -6],
        [-3, 2.8, 0],  [0, 2.8, 0],  [3, 2.8, 0],
        [-3, 2.8, 6],  [0, 2.8, 6],  [3, 2.8, 6],
      ];
      colPositions.forEach(pos => {
        const col = new THREE.Mesh(colGeo, timberMat);
        col.position.set(pos[0], pos[1], pos[2]);
        col.castShadow = true;
        structureGroup.add(col);
      });
      modelGroup.add(structureGroup);
      objectsRef.current.structure = structureGroup;

      // E. Celosías de Arcilla / Louvers
      const louversGroup = new THREE.Group();
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xd97736, roughness: 0.7 });
      for (let i = 0; i < 10; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.8), louverMat);
        louver.position.set(-3.9, 2.2, -4.5 + i * 1.0);
        louver.castShadow = true;
        louversGroup.add(louver);
      }
      modelGroup.add(louversGroup);
      objectsRef.current.louvers = louversGroup;

      // F. Cubierta en Mariposa (Captación Pluvial 1.850 m²)
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e9fa8, metalness: 0.4, roughness: 0.3 });
      
      const wingNorth = new THREE.Mesh(new THREE.BoxGeometry(24, 0.3, 8), roofMat);
      wingNorth.position.set(0, 5.8, -4);
      wingNorth.rotation.x = 0.18;
      wingNorth.castShadow = true;
      roofGroup.add(wingNorth);

      const wingSouth = new THREE.Mesh(new THREE.BoxGeometry(24, 0.3, 8), roofMat);
      wingSouth.position.set(0, 5.8, 4);
      wingSouth.rotation.x = -0.18;
      wingSouth.castShadow = true;
      roofGroup.add(wingSouth);

      // Canal central de drenaje
      const canal = new THREE.Mesh(new THREE.BoxGeometry(24, 0.35, 0.8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
      canal.position.set(0, 5.15, 0);
      roofGroup.add(canal);

      modelGroup.add(roofGroup);
      objectsRef.current.roof = roofGroup;
    }

    // =========================================================================
    // MODEL 2: PROTOTIPO DE VIVIENDA RESILIENTE (54 m² - 86 m²)
    // =========================================================================
    else if (modelType === 'vivienda') {
      // A. Pilotes Palafíticos (+0.60m sobre terreno)
      const stiltsGroup = new THREE.Group();
      const stiltMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
      const stiltGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16);

      const stiltCoords = [
        [-5, 0.6, -3.5], [-1.5, 0.6, -3.5], [2, 0.6, -3.5], [5.5, 0.6, -3.5],
        [-5, 0.6, 0],    [-1.5, 0.6, 0],    [2, 0.6, 0],    [5.5, 0.6, 0],
        [-5, 0.6, 3.5],  [-1.5, 0.6, 3.5],  [2, 0.6, 3.5],  [5.5, 0.6, 3.5],
      ];
      stiltCoords.forEach(pos => {
        const stilt = new THREE.Mesh(stiltGeo, stiltMat);
        stilt.position.set(pos[0], pos[1], pos[2]);
        stilt.castShadow = true;
        stiltsGroup.add(stilt);
      });
      modelGroup.add(stiltsGroup);

      // B. Deck / Plataforma de Madera Elevada (54m² base + terraza)
      const deckMesh = new THREE.Mesh(
        new THREE.BoxGeometry(11.5, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x9a6b43, roughness: 0.7 })
      );
      deckMesh.position.set(0, 1.35, 0);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      modelGroup.add(deckMesh);

      // C. Paredes Modulares en Madera & BTC
      const housingWalls = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });

      // Módulo Habitaciones y Estar (54 m²)
      const mainVolume = new THREE.Mesh(new THREE.BoxGeometry(7, 2.8, 6.5), wallMat);
      mainVolume.position.set(-1.5, 2.9, 0);
      mainVolume.castShadow = true;
      housingWalls.add(mainVolume);

      // Módulo de Expansión Progresiva (Taller / 2da Etapa +32m²)
      const expVolume = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 2.6, 5),
        new THREE.MeshStandardMaterial({ color: 0xd97736, transparent: true, opacity: 0.75, roughness: 0.6 })
      );
      expVolume.position.set(3.8, 2.8, 0);
      expVolume.castShadow = true;
      housingWalls.add(expVolume);

      modelGroup.add(housingWalls);
      objectsRef.current.structure = housingWalls;

      // D. Pórtico de Sombra & Celosías
      const louversGroup = new THREE.Group();
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
      for (let i = 0; i < 6; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.4), louverMat);
        bar.position.set(-1.5, 2.7, 3.4 + i * 0.1);
        bar.rotation.y = 0.4;
        louversGroup.add(bar);
      }
      modelGroup.add(louversGroup);
      objectsRef.current.louvers = louversGroup;

      // E. Tanque Aljibe Doméstico (2.500 L)
      const tankGroup = new THREE.Group();
      const tankGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 24);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set(4.5, 2.5, -2.8);
      tank.castShadow = true;
      tankGroup.add(tank);
      modelGroup.add(tankGroup);
      objectsRef.current.cistern = tankGroup;

      // F. Cubierta Inclinada Captadora de Vivienda
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.4, roughness: 0.3 });
      const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 9), roofMat);
      roofSlab.position.set(0, 4.7, 0);
      roofSlab.rotation.z = -0.12; // Pendiente hacia canaleta del tanque
      roofSlab.castShadow = true;
      roofGroup.add(roofSlab);
      modelGroup.add(roofGroup);
      objectsRef.current.roof = roofGroup;
    }

    // =========================================================================
    // MODEL 3: MASTERPLAN URBANO / ASENTAMIENTO MESETA (+22m)
    // =========================================================================
    else if (modelType === 'masterplan') {
      // Topografía de Meseta Central (+22m)
      const plateauGeo = new THREE.CylinderGeometry(26, 28, 2, 32);
      const plateauMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const plateau = new THREE.Mesh(plateauGeo, plateauMat);
      plateau.position.set(0, -1, 0);
      plateau.receiveShadow = true;
      modelGroup.add(plateau);

      // Central School Hub (Colegio)
      const schoolHub = new THREE.Mesh(
        new THREE.BoxGeometry(10, 2.5, 7),
        new THREE.MeshStandardMaterial({ color: 0x1e9fa8, roughness: 0.4, metalness: 0.3 })
      );
      schoolHub.position.set(0, 1.25, 0);
      schoolHub.castShadow = true;
      modelGroup.add(schoolHub);
      objectsRef.current.structure = schoolHub;

      // 120 Houses Clusters Simulation
      const housesGroup = new THREE.Group();
      const houseGeo = new THREE.BoxGeometry(2.2, 1.2, 1.8);
      const houseMat = new THREE.MeshStandardMaterial({ color: 0xd97736, roughness: 0.7 });

      const ringCount = 20;
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2;
        const radius = 13 + (i % 2) * 5;
        const house = new THREE.Mesh(houseGeo, houseMat);
        house.position.set(Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius);
        house.rotation.y = -angle;
        house.castShadow = true;
        housesGroup.add(house);
      }
      modelGroup.add(housesGroup);
      objectsRef.current.louvers = housesGroup;

      // Aljibe central bajo plaza
      const tankGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.8, 32);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });
      const mainCistern = new THREE.Mesh(tankGeo, tankMat);
      mainCistern.position.set(0, 0, -6.5);
      modelGroup.add(mainCistern);
      objectsRef.current.cistern = mainCistern;
    }

    scene.add(modelGroup);
    currentModelGroupRef.current = modelGroup;
  };

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 540;

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
    const gridHelper = new THREE.GridHelper(50, 50, 0x1e9fa8, 0x273543);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x141a21, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.06;
    ground.receiveShadow = true;
    scene.add(ground);

    // Build initial model
    buildModel(selected3DModel);

    // 6. Smooth Mouse Orbit Controls
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
      spherical.radius = Math.max(10, Math.min(70, spherical.radius + e.deltaY * 0.03));
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

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 540;
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

  // Update model when selected3DModel changes
  useEffect(() => {
    buildModel(selected3DModel);
    setExplodedView(false);
  }, [selected3DModel]);

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
    if (roof) {
      roof.position.y = explodedView ? (selected3DModel === 'colegio' ? 8.5 : 7.2) : (selected3DModel === 'colegio' ? 0 : 0);
    }
    if (cistern) {
      cistern.position.y = explodedView ? (selected3DModel === 'colegio' ? -4.5 : 0.5) : (selected3DModel === 'colegio' ? 0 : 0);
    }
  }, [explodedView, selected3DModel]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-caribbean-500/20 text-caribbean-300 text-xs font-semibold border border-caribbean-400/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Visor 3D de Arquitectura & BIM</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Modelos 3D del Proyecto: Equipamiento & Viviendas
            </h2>
            <p className="text-architectural-400 text-sm max-w-2xl">
              Inspecciona en 360° la volumetría del <b>Equipamiento Educativo</b>, el <b>Prototipo de Vivienda Resiliente</b> o el <b>Masterplan</b>. Puedes realizar despiece estructural, simular soleamiento o conectar tu archivo Revit.
            </p>
          </div>

          {/* Model Switcher Buttons: Colegio / Vivienda / Masterplan */}
          <div className="flex flex-wrap items-center p-1.5 rounded-2xl bg-architectural-900 border border-architectural-800 self-start gap-1">
            <button
              onClick={() => setSelected3DModel('colegio')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selected3DModel === 'colegio'
                  ? 'bg-caribbean-600 text-white shadow-md'
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>1. Equipamiento Educativo</span>
            </button>
            <button
              onClick={() => setSelected3DModel('vivienda')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selected3DModel === 'vivienda'
                  ? 'bg-caribbean-600 text-white shadow-md'
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>2. Vivienda Resiliente</span>
            </button>
            <button
              onClick={() => setSelected3DModel('masterplan')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selected3DModel === 'masterplan'
                  ? 'bg-caribbean-600 text-white shadow-md'
                  : 'text-architectural-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3. Masterplan (+22m)</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs: 3D WebGL vs Conectar Revit/Speckle vs Guía */}
        <div className="flex items-center justify-between border-b border-architectural-800 pb-3">
          <div className="flex items-center space-x-3 text-xs font-mono text-caribbean-400">
            <span className="w-2 h-2 rounded-full bg-caribbean-400 animate-pulse" />
            <span>
              {selected3DModel === 'colegio' && 'Visualizando: Complejo Pedagógico & Aljibe 450.000 L'}
              {selected3DModel === 'vivienda' && 'Visualizando: Prototipo Vivienda Palafítica 54m² - 86m²'}
              {selected3DModel === 'masterplan' && 'Visualizando: Conjunto Urbano 120 Viviendas + Colegio'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'interactive' ? 'bg-architectural-800 text-white' : 'text-architectural-500 hover:text-architectural-300'
              }`}
            >
              Visor 3D
            </button>
            <button
              onClick={() => setActiveTab('speckle')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'speckle' ? 'bg-architectural-800 text-white' : 'text-architectural-500 hover:text-architectural-300'
              }`}
            >
              Conectar Revit
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive WebGL 3D Model with Controls */}
        <div className={activeTab === 'interactive' ? 'grid lg:grid-cols-12 gap-6' : 'hidden'}>
          
          {/* 3D Canvas viewport */}
          <div className="lg:col-span-9 relative rounded-3xl overflow-hidden bg-architectural-900 border border-architectural-800 shadow-2xl h-[540px]">
            
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Viewport Floating Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center space-x-2 bg-architectural-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-architectural-800 pointer-events-auto text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-architectural-200">
                  {selected3DModel === 'colegio' && 'Equipamiento Educativo Bioclimático'}
                  {selected3DModel === 'vivienda' && 'Prototipo Vivienda Resiliente (+0.60m)'}
                  {selected3DModel === 'masterplan' && 'Masterplan Asentamiento Seguro'}
                </span>
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
                <span>🖱️ <b>Click izquierdo:</b> Rotar 360°</span>
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
                {explodedView ? 'Colapsar Modelo' : 'Despiezar Estructura'}
              </button>
              <p className="text-[11px] text-architectural-400 leading-tight">
                Separa los elementos constructivos (cubierta, cerramientos, aljibe) para observar la espacialidad interna.
              </p>
            </div>

            {/* Layer Visibility Filters */}
            <div className="p-5 rounded-2xl bg-architectural-900/90 border border-architectural-800 space-y-3">
              <span className="text-xs font-bold font-mono text-architectural-300 uppercase block">Capas del Modelo</span>
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
                  <span>Estructura / Módulos</span>
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
                  <span>Sistema Hídrico (Aljibes)</span>
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

        {/* Tab 2: Speckle / Revit Live Stream Embed */}
        <div className={activeTab === 'speckle' ? 'p-8 rounded-3xl bg-architectural-900 border border-architectural-800 space-y-6' : 'hidden'}>
          <div className="max-w-2xl space-y-2">
            <h3 className="font-display font-bold text-2xl text-white">
              Incrustar tu Archivo Revit (.rvt)
            </h3>
            <p className="text-sm text-architectural-400">
              Pega el enlace público de tu modelo exportado desde Revit con **Speckle** o **Autodesk Platform Services** para renderizarlo directamente:
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
                  Pega el enlace de tu stream o presiona el botón "Cargar Modelo Demo" para visualizar tu proyecto.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
