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
  Compass,
  X,
  Droplets,
  Wind
} from 'lucide-react';

export default function ModelViewer3D({ onSelectModule }) {
  const mountRef = useRef(null);
  const [selected3DModel, setSelected3DModel] = useState('colegio'); // 'colegio' | 'vivienda' | 'masterplan'
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [sunIntensity, setSunIntensity] = useState(1.2);
  const [sunAngle, setSunAngle] = useState(45);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    roof: true,
    structure: true,
    cistern: true,
    louvers: true,
  });

  // Custom Revit / Speckle Stream link integration
  const [speckleUrl, setSpeckleUrl] = useState('');
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive' | 'speckle'

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

    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current = null;
    }

    const modelGroup = new THREE.Group();
    objectsRef.current.roof = null;
    objectsRef.current.structure = null;
    objectsRef.current.cistern = null;
    objectsRef.current.louvers = null;

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
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xc2785c, roughness: 0.85 });

      const classroom1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 5), wallMat);
      classroom1.position.set(-6, 2, -3.5);
      classroom1.castShadow = true;
      classroom1.receiveShadow = true;
      classroomsGroup.add(classroom1);

      const classroom2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 5), wallMat);
      classroom2.position.set(0, 2, -3.5);
      classroom2.castShadow = true;
      classroom2.receiveShadow = true;
      classroomsGroup.add(classroom2);

      const classroom3 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 5), wallMat);
      classroom3.position.set(6, 2, -3.5);
      classroom3.castShadow = true;
      classroom3.receiveShadow = true;
      classroomsGroup.add(classroom3);

      const workshopBlock = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 4.5), new THREE.MeshStandardMaterial({ color: 0xa86047, roughness: 0.8 }));
      workshopBlock.position.set(-3.5, 2, 3.8);
      workshopBlock.castShadow = true;
      workshopBlock.receiveShadow = true;
      classroomsGroup.add(workshopBlock);

      const dispensaryBlock = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 4.5), new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5 }));
      dispensaryBlock.position.set(5.5, 2, 3.8);
      dispensaryBlock.castShadow = true;
      dispensaryBlock.receiveShadow = true;
      classroomsGroup.add(dispensaryBlock);

      modelGroup.add(classroomsGroup);
      objectsRef.current.structure = classroomsGroup;

      // D. Celosías de Ventilación
      const louversGroup = new THREE.Group();
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, wireframe: false, roughness: 0.4 });
      for (let i = -7.5; i <= 7.5; i += 1.2) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.4), louverMat);
        louver.position.set(i, 2, -6.1);
        louversGroup.add(louver);
      }
      modelGroup.add(louversGroup);
      objectsRef.current.louvers = louversGroup;

      // E. Cubierta Invertida Captadora (1.850 m²)
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.3,
        metalness: 0.6,
        side: THREE.DoubleSide
      });

      const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(12, 0.25, 18), roofMat);
      wingLeft.position.set(-6, 4.3, 0);
      wingLeft.rotation.z = -0.12;
      wingLeft.castShadow = true;
      roofGroup.add(wingLeft);

      const wingRight = new THREE.Mesh(new THREE.BoxGeometry(12, 0.25, 18), roofMat);
      wingRight.position.set(6, 4.3, 0);
      wingRight.rotation.z = 0.12;
      wingRight.castShadow = true;
      roofGroup.add(wingRight);

      // Canalón colector central
      const gutter = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 18),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 })
      );
      gutter.position.set(0, 3.4, 0);
      roofGroup.add(gutter);

      modelGroup.add(roofGroup);
      objectsRef.current.roof = roofGroup;
    } 
    else if (modelType === 'vivienda') {
      // MODEL 2: PROTOTIPO VIVIENDA PALAFÍTICA (54 m² - 86 m²)
      // Pilotes de elevación +0.60m
      const stiltMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const stiltsGroup = new THREE.Group();
      for (let x = -4; x <= 4; x += 2) {
        for (let z = -3; z <= 3; z += 2) {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), stiltMat);
          stilt.position.set(x, 0.6, z);
          stilt.castShadow = true;
          stiltsGroup.add(stilt);
        }
      }
      modelGroup.add(stiltsGroup);

      // Plataforma de Piso de Madera
      const deckGeo = new THREE.BoxGeometry(9.5, 0.25, 7.5);
      const deckMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const deckMesh = new THREE.Mesh(deckGeo, deckMat);
      deckMesh.position.set(0, 1.3, 0);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      modelGroup.add(deckMesh);

      // Estructura Habitacional
      const houseGroup = new THREE.Group();
      const btcMat = new THREE.MeshStandardMaterial({ color: 0xc2785c, roughness: 0.85 });

      const room1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 3.2), btcMat);
      room1.position.set(-2.2, 2.8, -1.6);
      room1.castShadow = true;
      houseGroup.add(room1);

      const room2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 3.2), btcMat);
      room2.position.set(2.2, 2.8, -1.6);
      room2.castShadow = true;
      houseGroup.add(room2);

      const porch = new THREE.Mesh(
        new THREE.BoxGeometry(8.6, 2.8, 2.8),
        new THREE.MeshStandardMaterial({ color: 0xfef3c7, transparent: true, opacity: 0.4, roughness: 0.9 })
      );
      porch.position.set(0, 2.8, 1.8);
      houseGroup.add(porch);

      modelGroup.add(houseGroup);
      objectsRef.current.structure = houseGroup;

      // Tanque Doméstico 2.500 L
      const cisternMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
      );
      cisternMesh.position.set(-3.8, 2.2, 2.2);
      cisternMesh.castShadow = true;
      modelGroup.add(cisternMesh);
      objectsRef.current.cistern = cisternMesh;

      // Celosías de Fachada
      const louversGroup = new THREE.Group();
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      for (let z = 0.5; z <= 3.0; z += 0.4) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.2), louverMat);
        louver.position.set(4.3, 2.8, z);
        louversGroup.add(louver);
      }
      modelGroup.add(louversGroup);
      objectsRef.current.louvers = louversGroup;

      // Cubierta a dos aguas con aleros de 2.5m
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.4, side: THREE.DoubleSide });

      const roofSide1 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.15, 4.8), roofMat);
      roofSide1.position.set(0, 4.6, -1.8);
      roofSide1.rotation.x = 0.25;
      roofSide1.castShadow = true;
      roofGroup.add(roofSide1);

      const roofSide2 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.15, 4.8), roofMat);
      roofSide2.position.set(0, 4.6, 1.8);
      roofSide2.rotation.x = -0.25;
      roofSide2.castShadow = true;
      roofGroup.add(roofSide2);

      modelGroup.add(roofGroup);
      objectsRef.current.roof = roofGroup;
    }
    else if (modelType === 'masterplan') {
      // MODEL 3: MASTERPLAN URBANO MESETA (+22m)
      const terrainGeo = new THREE.CylinderGeometry(18, 20, 2, 32);
      const terrainMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.9 });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.position.set(0, -1, 0);
      terrainMesh.receiveShadow = true;
      modelGroup.add(terrainMesh);

      // Manzanas de Viviendas
      const housesGroup = new THREE.Group();
      const houseBlockMat = new THREE.MeshStandardMaterial({ color: 0xc2785c, roughness: 0.8 });
      for (let r = 5; r <= 14; r += 3.2) {
        const count = Math.floor(r * 2);
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          if (Math.sin(angle) > 0.6 && Math.cos(angle) > 0.2) continue; // Leave central educational plaza empty
          const hMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.6), houseBlockMat);
          hMesh.position.set(Math.cos(angle) * r, 0.4, Math.sin(angle) * r);
          hMesh.rotation.y = -angle;
          hMesh.castShadow = true;
          housesGroup.add(hMesh);
        }
      }
      modelGroup.add(housesGroup);
      objectsRef.current.structure = housesGroup;

      // Central School Block
      const schoolMain = new THREE.Mesh(
        new THREE.BoxGeometry(5.5, 1.4, 4),
        new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5 })
      );
      schoolMain.position.set(4, 0.7, 4);
      schoolMain.castShadow = true;
      modelGroup.add(schoolMain);
      objectsRef.current.roof = schoolMain;

      // Central Reservoir Icon
      const reservoir = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 1.8, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 })
      );
      reservoir.position.set(4, 0.3, 0);
      modelGroup.add(reservoir);
      objectsRef.current.cistern = reservoir;
    }

    scene.add(modelGroup);
    currentModelGroupRef.current = modelGroup;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep slate
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(22, 16, 26);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, sunIntensity);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    scene.add(dirLight);
    objectsRef.current.dirLight = dirLight;

    // Subtle Ground Grid
    const grid = new THREE.GridHelper(50, 50, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Build initial model
    buildModel(selected3DModel);

    // Manual Orbit Controls Simulation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let spherical = { radius: 36, theta: Math.PI / 4, phi: Math.PI / 3.5 };

    const updateCameraPosition = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 2, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));

      updateCameraPosition();
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(8, Math.min(65, spherical.radius + e.deltaY * 0.04));
      updateCameraPosition();
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (currentModelGroupRef.current && !isDragging) {
        currentModelGroupRef.current.rotation.y += 0.001; // subtle idle rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      if (renderer) renderer.dispose();
    };
  }, []);

  // Update Model on switch
  useEffect(() => {
    buildModel(selected3DModel);
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
      roof.position.y = explodedView ? (selected3DModel === 'colegio' ? 8.5 : 7.2) : 0;
    }
    if (cistern) {
      cistern.position.y = explodedView ? (selected3DModel === 'colegio' ? -4.5 : 0.5) : (selected3DModel === 'colegio' ? -1.5 : 2.2);
    }
  }, [explodedView, selected3DModel]);

  // Update Layers Visibility
  useEffect(() => {
    if (objectsRef.current.roof) objectsRef.current.roof.visible = activeLayers.roof;
    if (objectsRef.current.structure) objectsRef.current.structure.visible = activeLayers.structure;
    if (objectsRef.current.cistern) objectsRef.current.cistern.visible = activeLayers.cistern;
    if (objectsRef.current.louvers) objectsRef.current.louvers.visible = activeLayers.louvers;
  }, [activeLayers]);

  // Update Sun angle
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

  const modelDetails = {
    colegio: {
      title: "Equipamiento Educativo, Comunitario & Dispensario Hídrico",
      capacity: "350 Estudiantes + 1.200 Usuarios de Fin de Semana",
      area: "1.850 m² construidos",
      specs: [
        { label: "Cubierta Captadora", value: "1.850 m² invertida en V" },
        { label: "Aljibe Subterráneo", value: "450.000 L de reserva" },
        { label: "Ventilación", value: "100% Pasiva / Celosías BTC" },
        { label: "Energía", value: "100% Solar Fotovoltaica" }
      ],
      desc: "El complejo integra aulas bioclimáticas, laboratorios marinos, talleres de carpintería ribereña y el dispensario hídrico comunitario de Tierrabomba."
    },
    vivienda: {
      title: "Prototipo de Vivienda Palafítica Resiliente",
      capacity: "4 a 7 Habitantes (54 m² a 86 m²)",
      area: "54 m² módulo base + ampliación",
      specs: [
        { label: "Elevación Palafítica", value: "+0.60 m sobre suelo" },
        { label: "Tanque Doméstico", value: "2.500 L integrado" },
        { label: "Confort Térmico", value: "-5.0 °C reducción pasiva" },
        { label: "Materialidad", value: "Madera tratada + Bloque BTC" }
      ],
      desc: "Vivienda progresiva que respeta las costumbres pesqueras isleñas, con pórticos de sombra para reparación de redes y captación pluvial directa."
    },
    masterplan: {
      title: "Masterplan Asentamiento Seguro Meseta (+22.00m)",
      capacity: "120 Familias Reubicadas (480 Hab)",
      area: "65 Hectáreas de Suelo Seguro",
      specs: [
        { label: "Cota de Seguridad", value: "+22.00 m.s.n.m." },
        { label: "Riesgo Marino", value: "0% Inmune a oleaje" },
        { label: "Ejes Peatonales", value: "Senderos bioclimáticos" },
        { label: "Bio-Humedales", value: "Fitodepuración de aguas" }
      ],
      desc: "Implantación territorial central que articula vivienda digna, equipamiento escolar y soberanía alimentaria lejos del borde de erosión marina."
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-950">
      
      {/* 1. FULLSCREEN 3D WEBGL CANVAS */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF 3D VIEWPORT                            */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title Card */}
        <div className="glass-dark px-4 py-3 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-lg text-white">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            06
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                VISOR 3D WEBGL // BIM
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                360° ORBIT
              </span>
            </div>
            <h2 className="font-bold text-sm text-white truncate">
              {modelDetails[selected3DModel].title}
            </h2>
          </div>
        </div>

        {/* 3D Model Switcher Bar */}
        <div className="glass-dark p-1 rounded-2xl pointer-events-auto flex items-center gap-1 self-start md:self-center text-white">
          <button
            onClick={() => setSelected3DModel('colegio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              selected3DModel === 'colegio'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Colegio & Aljibe</span>
          </button>
          <button
            onClick={() => setSelected3DModel('vivienda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              selected3DModel === 'vivienda'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Vivienda +0.60m</span>
          </button>
          <button
            onClick={() => setSelected3DModel('masterplan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              selected3DModel === 'masterplan'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Masterplan (+22m)</span>
          </button>
        </div>

        {/* Quick Actions HUD */}
        <div className="glass-dark p-1 rounded-2xl pointer-events-auto flex items-center gap-1 text-white">
          <button
            onClick={resetCamera}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Centrar Cámara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              wireframe ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setExplodedView(!explodedView)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              explodedView ? 'bg-terracotta-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 inline mr-1" />
            Despiece
          </button>
          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-mono font-bold border border-teal-500/40 transition-all flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Ficha Técnica</span>
          </button>
        </div>

      </div>

      {/* Floating Left: Interactive Layer Toggles */}
      <div className="absolute top-24 left-4 z-[400] glass-dark p-3 rounded-2xl space-y-2 pointer-events-auto text-white max-w-[200px]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
          Capas 3D Visibles
        </div>
        <button
          onClick={() => toggleLayer('roof')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            activeLayers.roof ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-500 line-through'
          }`}
        >
          <span>Cubierta</span>
          {activeLayers.roof ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleLayer('structure')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            activeLayers.structure ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-500 line-through'
          }`}
        >
          <span>Estructura / Módulos</span>
          {activeLayers.structure ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleLayer('cistern')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            activeLayers.cistern ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500 line-through'
          }`}
        >
          <span>Aljibe Hídrico</span>
          {activeLayers.cistern ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
        <button
          onClick={() => toggleLayer('louvers')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            activeLayers.louvers ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500 line-through'
          }`}
        >
          <span>Celosías & Ventilación</span>
        {activeLayers.louvers ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
      </div>

      {/* Floating Right: Sun & Solar Angle Slider */}
      <div className="absolute top-24 right-4 z-[400] glass-dark p-3.5 rounded-2xl space-y-2 pointer-events-auto text-white w-56">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Azimut Solar</span>
          </span>
          <span className="text-amber-400 font-bold">{sunAngle}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={sunAngle}
          onChange={(e) => setSunAngle(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[9px] font-mono text-slate-400">
          <span>Mañana (0°)</span>
          <span>Mediodía (90°)</span>
          <span>Tarde (180°)</span>
        </div>
      </div>

      {/* Floating Bottom Center: Orbit & Zoom Instruction Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <div className="glass-dark px-4 py-2 rounded-2xl text-xs font-mono text-slate-300 flex items-center space-x-4">
          <span className="flex items-center space-x-1.5"><RotateCcw className="w-3.5 h-3.5 text-teal-400" /><span><b>Arrastrar:</b> Rotar 360°</span></span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1.5"><Maximize2 className="w-3.5 h-3.5 text-teal-400" /><span><b>Scroll:</b> Zoom</span></span>
          <span className="text-slate-600">|</span>
          <button 
            onClick={() => setShowInfoModal(true)}
            className="pointer-events-auto text-teal-400 font-bold underline hover:text-teal-300"
          >
            Ver Especificaciones
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE TECHNICAL POPUP MODAL (Zero Text Walls on Screen)          */}
      {/* ========================================================================= */}
      {showInfoModal && (
        <div 
          onClick={() => setShowInfoModal(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-slate-900 space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  FICHA TÉCNICA 3D BIM // ARQUITECTURA
                </span>
                <h3 className="font-bold text-xl text-slate-900 mt-2">
                  {modelDetails[selected3DModel].title}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {modelDetails[selected3DModel].capacity} &bull; {modelDetails[selected3DModel].area}
                </p>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-light">
              {modelDetails[selected3DModel].desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {modelDetails[selected3DModel].specs.map((spec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    {spec.label}
                  </span>
                  <span className="font-bold text-sm text-slate-900 mt-1 block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar y Continuar Orbitando
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
