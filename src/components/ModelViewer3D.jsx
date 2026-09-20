import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
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
  Wind,
  UploadCloud,
  FileCode,
  FileUp,
  FolderUp,
  AlertCircle
} from 'lucide-react';

export default function ModelViewer3D({ onSelectModule }) {
  const mountRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selected3DModel, setSelected3DModel] = useState('revit'); // 'revit' | 'colegio' | 'vivienda' | 'masterplan' | 'custom'
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [sunIntensity, setSunIntensity] = useState(1.2);
  const [sunAngle, setSunAngle] = useState(45);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [customModel, setCustomModel] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    terrain: true,
    walls: true,
    buildings: true,
    grid: true,
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
    terrain: null,
    grid: null,
    dirLight: null,
    revitTerrain: [],
    revitWalls: [],
    revitBuildings: [],
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
    objectsRef.current.terrain = null;
    objectsRef.current.revitTerrain = [];
    objectsRef.current.revitWalls = [];
    objectsRef.current.revitBuildings = [];

    if (modelType === 'revit') {
      setIsLoadingFile(true);
      const gltfLoader = new GLTFLoader();
      const basePath = import.meta.env.BASE_URL || '/';
      const modelUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}models/tierrabomba_revit.glb`;

      gltfLoader.load(
        modelUrl,
        (gltf) => {
          if (currentModelGroupRef.current) {
            scene.remove(currentModelGroupRef.current);
            currentModelGroupRef.current = null;
          }
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetSize = 28;
          const scale = targetSize / (maxDim || 1);

          model.scale.set(scale, scale, scale);
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale + (size.y * scale) / 2;
          model.position.z = -center.z * scale;

          objectsRef.current.revitTerrain = [];
          objectsRef.current.revitWalls = [];
          objectsRef.current.revitBuildings = [];

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              const name = child.name || '';
              const matName = child.material ? child.material.name : '';

              if (name.includes('Toposolid') || name.toLowerCase().includes('terrain') || matName.includes('Toposolid')) {
                // Topografía / Terreno natural de Tierrabomba
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x2e4a3d,
                  roughness: 0.85,
                  metalness: 0.1,
                  side: THREE.DoubleSide
                });
                child.userData.layer = 'terrain';
                objectsRef.current.revitTerrain.push(child);
                child.visible = activeLayers.terrain;
              } else if (name.includes('Partición') || name.includes('Interior') || name.toLowerCase().includes('muro') || matName.includes('muro') || matName.includes('yeso')) {
                // Muros y Particiones Interiores (BTC / Terracota)
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xc2785c,
                  roughness: 0.75,
                  metalness: 0.1,
                  side: THREE.DoubleSide
                });
                child.userData.layer = 'walls';
                objectsRef.current.revitWalls.push(child);
                child.visible = activeLayers.walls;
              } else {
                // Edificaciones, Volúmenes y Masas Urbanas
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x0f766e,
                  roughness: 0.6,
                  metalness: 0.2,
                  side: THREE.DoubleSide
                });
                child.userData.layer = 'buildings';
                objectsRef.current.revitBuildings.push(child);
                child.visible = activeLayers.buildings;
              }
            }
          });

          scene.add(model);
          currentModelGroupRef.current = model;
          setIsLoadingFile(false);
        },
        undefined,
        (err) => {
          console.error("Error loading tierrabomba_revit.glb:", err);
          setIsLoadingFile(false);
        }
      );
      return;
    }

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
      objectsRef.current.terrain = terrainMesh;

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
    grid.visible = activeLayers.grid;
    scene.add(grid);
    objectsRef.current.grid = grid;

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
    // Procedural models
    if (objectsRef.current.roof) objectsRef.current.roof.visible = !!activeLayers.roof;
    if (objectsRef.current.structure) objectsRef.current.structure.visible = !!activeLayers.structure;
    if (objectsRef.current.cistern) objectsRef.current.cistern.visible = !!activeLayers.cistern;
    if (objectsRef.current.louvers) objectsRef.current.louvers.visible = !!activeLayers.louvers;
    if (objectsRef.current.terrain) objectsRef.current.terrain.visible = !!activeLayers.terrain;
    if (objectsRef.current.grid) objectsRef.current.grid.visible = !!activeLayers.grid;

    // Revit Model layers
    if (objectsRef.current.revitTerrain && objectsRef.current.revitTerrain.length > 0) {
      objectsRef.current.revitTerrain.forEach(mesh => {
        if (mesh) mesh.visible = !!activeLayers.terrain;
      });
    }
    if (objectsRef.current.revitWalls && objectsRef.current.revitWalls.length > 0) {
      objectsRef.current.revitWalls.forEach(mesh => {
        if (mesh) mesh.visible = !!activeLayers.walls;
      });
    }
    if (objectsRef.current.revitBuildings && objectsRef.current.revitBuildings.length > 0) {
      objectsRef.current.revitBuildings.forEach(mesh => {
        if (mesh) mesh.visible = !!activeLayers.buildings;
      });
    }
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

  // Load custom 3D file (GLTF / GLB / OBJ from Revit)
  const loadCustom3DFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['glb', 'gltf', 'obj'].includes(ext)) {
      setLoadError('Por favor sube un archivo 3D compatible exportado de Revit (.glb, .gltf o .obj)');
      setShowUploadModal(true);
      return;
    }

    setIsLoadingFile(true);
    setLoadError('');

    const scene = sceneRef.current;
    if (!scene) {
      setIsLoadingFile(false);
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    const onModelLoaded = (modelGroup) => {
      if (currentModelGroupRef.current) {
        scene.remove(currentModelGroupRef.current);
        currentModelGroupRef.current = null;
      }

      // Compute bounding box and normalize scale & center
      const box = new THREE.Box3().setFromObject(modelGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 24;
      const scale = targetSize / (maxDim || 1);

      modelGroup.scale.set(scale, scale, scale);
      modelGroup.position.x = -center.x * scale;
      modelGroup.position.y = -center.y * scale + (size.y * scale) / 2;
      modelGroup.position.z = -center.z * scale;

      objectsRef.current.revitTerrain = [];
      objectsRef.current.revitWalls = [];
      objectsRef.current.revitBuildings = [];

      modelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          const name = child.name || '';
          const matName = child.material ? child.material.name : '';

          if (name.includes('Toposolid') || name.toLowerCase().includes('terrain') || matName.includes('Toposolid')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x2e4a3d,
              roughness: 0.85,
              metalness: 0.1,
              side: THREE.DoubleSide
            });
            child.userData.layer = 'terrain';
            objectsRef.current.revitTerrain.push(child);
            child.visible = activeLayers.terrain;
          } else if (name.includes('Partición') || name.includes('Interior') || name.toLowerCase().includes('muro') || matName.includes('muro') || matName.includes('yeso')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xc2785c,
              roughness: 0.75,
              metalness: 0.1,
              side: THREE.DoubleSide
            });
            child.userData.layer = 'walls';
            objectsRef.current.revitWalls.push(child);
            child.visible = activeLayers.walls;
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x0f766e,
              roughness: 0.6,
              metalness: 0.2,
              side: THREE.DoubleSide
            });
            child.userData.layer = 'buildings';
            objectsRef.current.revitBuildings.push(child);
            child.visible = activeLayers.buildings;
          }
        }
      });

      scene.add(modelGroup);
      currentModelGroupRef.current = modelGroup;

      objectsRef.current.roof = modelGroup;
      objectsRef.current.structure = modelGroup;
      objectsRef.current.cistern = null;
      objectsRef.current.louvers = null;

      setCustomModel({
        name: file.name,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        group: modelGroup
      });
      setSelected3DModel('custom');
      setIsLoadingFile(false);
      setShowUploadModal(false);
      URL.revokeObjectURL(fileUrl);
    };

    if (ext === 'glb' || ext === 'gltf') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        fileUrl,
        (gltf) => {
          onModelLoaded(gltf.scene);
        },
        undefined,
        (err) => {
          console.error("GLTF Load Error:", err);
          setLoadError('Error al leer el archivo GLTF/GLB: ' + (err.message || 'Verifica el formato del archivo'));
          setIsLoadingFile(false);
          setShowUploadModal(true);
          URL.revokeObjectURL(fileUrl);
        }
      );
    } else if (ext === 'obj') {
      const objLoader = new OBJLoader();
      objLoader.load(
        fileUrl,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              if (!child.material || child.material.name === '' || !child.material.color) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xc2785c,
                  roughness: 0.7,
                  metalness: 0.1,
                  side: THREE.DoubleSide
                });
              } else {
                child.material.side = THREE.DoubleSide;
              }
            }
          });
          onModelLoaded(obj);
        },
        undefined,
        (err) => {
          console.error("OBJ Load Error:", err);
          setLoadError('Error al leer el archivo OBJ: ' + (err.message || 'Verifica el formato'));
          setIsLoadingFile(false);
          setShowUploadModal(true);
          URL.revokeObjectURL(fileUrl);
        }
      );
    }
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadCustom3DFile(e.dataTransfer.files[0]);
    }
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
    },
    revit: {
      title: "Modelo BIM Oficial de Revit (Tierrabomba)",
      capacity: "4.472 Elementos BIM Clasificados",
      area: "Toposolid + Equipamiento + Viviendas",
      specs: [
        { label: "Topografía", value: "Toposolid Insular Activo" },
        { label: "Muros y Particiones", value: "3.452 Elementos (138mm)" },
        { label: "Edificaciones", value: "1.019 Masas Arquitectónicas" },
        { label: "Control de Capas", value: "100% Interactivo" }
      ],
      desc: "Modelo tridimensional BIM original exportado directamente desde Autodesk Revit. Permite encender o apagar independientemente la topografía insular, los muros/particiones interiores y los volúmenes de las edificaciones con iluminación solar en tiempo real."
    },
    custom: {
      title: customModel ? `Modelo Revit / BIM: ${customModel.name}` : "Modelo Personalizado Revit",
      capacity: "Modelo 3D Importado",
      area: customModel ? `${customModel.sizeMB} MB` : "Geometría WebGL",
      specs: [
        { label: "Origen", value: "Autodesk Revit" },
        { label: "Formato", value: customModel ? customModel.name.split('.').pop().toUpperCase() : "GLB / OBJ" },
        { label: "Renderizado", value: "Three.js WebGL" },
        { label: "Sombras & Luces", value: "Tiempo Real" }
      ],
      desc: "Modelo arquitectónico de Revit importado directamente en el visor WebGL de la plataforma de tesis."
    }
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden animate-fade-in select-none bg-slate-950 ${
        isDragOver ? 'ring-4 ring-teal-400 ring-inset' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDropFile}
    >
      
      {/* Hidden File Input for 3D model upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            loadCustom3DFile(e.target.files[0]);
          }
        }}
        accept=".glb,.gltf,.obj"
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-teal-950/80 backdrop-blur-md z-[500] flex flex-col items-center justify-center p-6 text-white pointer-events-none animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mb-4 animate-bounce">
            <UploadCloud className="w-10 h-10 text-teal-300" />
          </div>
          <h3 className="font-bold text-2xl text-white">Suelta tu archivo de Revit (.glb / .gltf / .obj) aquí</h3>
          <p className="text-sm text-teal-200 mt-2 font-mono">Se cargará e iluminará en 3D en tiempo real</p>
        </div>
      )}

      {/* Loading Model Overlay */}
      {isLoadingFile && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[500] flex flex-col items-center justify-center p-6 text-white pointer-events-none animate-fade-in">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin mb-4" />
          <h3 className="font-bold text-lg text-white">Cargando Modelo 3D de Revit...</h3>
          <p className="text-xs text-slate-400 font-mono mt-1">Renderizando geometría BIM, sombras e iluminación en tiempo real</p>
        </div>
      )}

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
            05
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
              {modelDetails[selected3DModel]?.title || "Modelo 3D"}
            </h2>
          </div>
        </div>

        {/* 3D Model Switcher Bar */}
        <div className="glass-dark p-1 rounded-2xl pointer-events-auto flex items-center gap-1 self-start md:self-center text-white flex-wrap">
          <button
            onClick={() => {
              setSelected3DModel('revit');
              buildModel('revit');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              selected3DModel === 'revit'
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                : 'text-amber-300 hover:text-white bg-amber-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modelo Revit (Oficial)</span>
          </button>
          <button
            onClick={() => {
              setSelected3DModel('colegio');
              buildModel('colegio');
            }}
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
            onClick={() => {
              setSelected3DModel('vivienda');
              buildModel('vivienda');
            }}
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
            onClick={() => {
              setSelected3DModel('masterplan');
              buildModel('masterplan');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              selected3DModel === 'masterplan'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Masterplan (+22m)</span>
          </button>

          {customModel && (
            <button
              onClick={() => {
                setSelected3DModel('custom');
                if (sceneRef.current && customModel.group) {
                  if (currentModelGroupRef.current) sceneRef.current.remove(currentModelGroupRef.current);
                  sceneRef.current.add(customModel.group);
                  currentModelGroupRef.current = customModel.group;
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                selected3DModel === 'custom'
                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/10'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{customModel.name}</span>
            </button>
          )}

          <div className="w-px h-4 bg-white/20 mx-0.5" />

          {/* Button to Upload Revit / 3D File */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 text-amber-200 border border-amber-400/40 transition-all shadow-sm hover:scale-[1.02]"
            title="Importar archivo exportado desde Revit (.glb, .gltf, .obj)"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
            <span>Cargar Revit</span>
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
      <div className="absolute top-24 left-4 z-[400] glass-dark p-3.5 rounded-2xl space-y-2.5 pointer-events-auto text-white w-64 shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Capas 3D Visibles
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
            {selected3DModel === 'revit' ? 'BIM Revit' : selected3DModel === 'custom' ? 'Revit Custom' : 'Módulo 3D'}
          </span>
        </div>

        <div className="space-y-1.5">
          {(selected3DModel === 'revit' || selected3DModel === 'custom') && (
            <>
              {/* Capa 1: Topografía */}
              <button
                onClick={() => toggleLayer('terrain')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.terrain 
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Topografía Insular</span>
                    <span className="text-[9px] text-slate-400 font-normal">Toposolid / Terreno</span>
                  </div>
                </div>
                {activeLayers.terrain ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa 2: Muros y Particiones */}
              <button
                onClick={() => toggleLayer('walls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.walls 
                    ? 'bg-orange-950/50 text-orange-300 border border-orange-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Muros y Particiones</span>
                    <span className="text-[9px] text-slate-400 font-normal">Partición 138mm (3.452)</span>
                  </div>
                </div>
                {activeLayers.walls ? <Eye className="w-3.5 h-3.5 text-orange-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa 3: Edificaciones y Masas */}
              <button
                onClick={() => toggleLayer('buildings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.buildings 
                    ? 'bg-teal-950/50 text-teal-300 border border-teal-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Edificaciones & Masas</span>
                    <span className="text-[9px] text-slate-400 font-normal">Categoría Building (1.019)</span>
                  </div>
                </div>
                {activeLayers.buildings ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {selected3DModel === 'colegio' && (
            <>
              <button
                onClick={() => toggleLayer('roof')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.roof ? 'bg-slate-800 text-slate-200 border border-slate-600' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                  <span>Cubierta Invertida</span>
                </div>
                {activeLayers.roof ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('structure')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.structure ? 'bg-terracotta-950/40 text-terracotta-300 border border-terracotta-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
                  <span>Aulas & Estructura</span>
                </div>
                {activeLayers.structure ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('cistern')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.cistern ? 'bg-blue-950/40 text-blue-300 border border-blue-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>Aljibe 450.000 L</span>
                </div>
                {activeLayers.cistern ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('louvers')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.louvers ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Celosías Pasivas</span>
                </div>
                {activeLayers.louvers ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {selected3DModel === 'vivienda' && (
            <>
              <button
                onClick={() => toggleLayer('roof')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.roof ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Cubierta a Dos Aguas</span>
                </div>
                {activeLayers.roof ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('structure')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.structure ? 'bg-terracotta-950/40 text-terracotta-300 border border-terracotta-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
                  <span>Módulos Habitacionales</span>
                </div>
                {activeLayers.structure ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('cistern')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.cistern ? 'bg-blue-950/40 text-blue-300 border border-blue-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>Tanque 2.500 L</span>
                </div>
                {activeLayers.cistern ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('louvers')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.louvers ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Celosías & Pórtico</span>
                </div>
                {activeLayers.louvers ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {selected3DModel === 'masterplan' && (
            <>
              <button
                onClick={() => toggleLayer('terrain')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.terrain ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Terreno Meseta (+22m)</span>
                </div>
                {activeLayers.terrain ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('structure')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.structure ? 'bg-terracotta-950/40 text-terracotta-300 border border-terracotta-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
                  <span>Manzanas Residenciales</span>
                </div>
                {activeLayers.structure ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('roof')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.roof ? 'bg-teal-950/40 text-teal-300 border border-teal-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span>Escuela Central</span>
                </div>
                {activeLayers.roof ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('cistern')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.cistern ? 'bg-blue-950/40 text-blue-300 border border-blue-500/40' : 'text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>Aljibe Territorial</span>
                </div>
                {activeLayers.cistern ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {/* Retícula de Suelo (General) */}
          <div className="pt-1.5 border-t border-white/10">
            <button
              onClick={() => toggleLayer('grid')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeLayers.grid 
                  ? 'bg-slate-800/80 text-slate-300 border border-slate-700' 
                  : 'bg-slate-900/40 text-slate-500 line-through border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded bg-slate-500 shrink-0" />
                <span>Retícula de Suelo (Grid)</span>
              </div>
              {activeLayers.grid ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        </div>
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

      {/* ========================================================================= */}
      {/* 4. REVIT / 3D MODEL UPLOAD & INTEGRATION MODAL                            */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div 
          onClick={() => setShowUploadModal(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-slate-900 space-y-6 animate-scale-up"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    INTEGRACIÓN AUTODESK REVIT / BIM
                  </span>
                  <h3 className="font-bold text-xl text-slate-900 mt-0.5">
                    Cargar Modelo 3D de la Tesis
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loadError}</span>
              </div>
            )}

            {/* Dropzone Container */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-3xl p-8 bg-amber-50/40 hover:bg-amber-50/80 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <FolderUp className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Haz clic aquí para seleccionar tu archivo 3D
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  o arrastra y suelta directamente tu archivo en esta ventana
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  .GLB (Recomendado)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                  .GLTF
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  .OBJ
                </span>
              </div>
            </div>

            {/* Step by Step Guide from Revit */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                💡 ¿Cómo exportarlo desde Revit?
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5 font-sans">
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><b>Exportar a .GLB/.GLTF:</b> Usa el plugin gratuito <i>Revit to glTF</i> o exporta vía Datasmith / Blender / Enscape.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><b>Exportar a FBX/OBJ:</b> En Revit: <i>Archivo &gt; Exportar &gt; FBX</i> (o convertirlo a GLB).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><b>Ubicación local directa:</b> También puedes guardar el archivo en la carpeta <code>public/models/</code> de este proyecto.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Soporte WebGL Three.js // Sombras & Órbita en tiempo real
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
