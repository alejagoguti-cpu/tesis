import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { buildCartagenaTerritoryScene } from '../utils/cartagena3D.js';
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
  AlertCircle,
  Scissors,
  Palette,
  Minimize2,
  Play,
  Pause,
  FastForward,
  Ship,
  Activity
} from 'lucide-react';

export default function ModelViewer3D({ onSelectModule }) {
  const mountRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selected3DModel, setSelected3DModel] = useState('revit'); // 'revit' (Cartagena + Tierra Bomba por defecto) | 'masterplan' | 'colegio' | 'vivienda' | 'custom'
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);

  // Tonos de Materialidad Personalizables (Mar, Pasto, Piso, Edificios, Techos, Vías)
  const [waterColor, setWaterColor] = useState('#8dc8d2'); // Mar / Agua turquesa suave
  const [grassColor, setGrassColor] = useState('#65763e'); // Verde amarillento café atenuado
  const [pavementColor, setPavementColor] = useState('#d4c5b3'); // Travertino / arena cálido
  const [buildingColor, setBuildingColor] = useState('#ffffff'); // Edificaciones / Muros
  const [roofColor, setRoofColor] = useState('#b5714a'); // Cubiertas / Arcilla
  const [roadColor, setRoadColor] = useState('#64748b'); // Asfalto / Vías

  // Simulación de Tránsito Marítimo y Urbano en Vivo
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(true);
  const isPlayingSimulationRef = useRef(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1.5);
  const simulationSpeedRef = useRef(1.5);
  const cartagenaTerritoryRef = useRef(null);

  // Parámetros Solares (Estudio de Sombras & Heliodón)
  const [sunAzimuth, setSunAzimuth] = useState(130);
  const [sunElevation, setSunElevation] = useState(45);
  const [sunIntensity, setSunIntensity] = useState(1.2);
  const [cameraMode, setCameraMode] = useState('orthographic');

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadPhase, setLoadPhase] = useState('Cargando geometría BIM...');
  const [loadError, setLoadError] = useState('');
  const [customModel, setCustomModel] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    terrain: true,
    walls: true,
    buildings: true,
    water: true,
    boats: true,
    vehicles: true,
    trees: true,
    grid: false,
    roof: true,
    structure: true,
    cistern: true,
    louvers: true,
  });

  // Custom Revit / Speckle Stream link integration
  const [speckleUrl, setSpeckleUrl] = useState('');
  const [activeTab, setActiveTab] = useState('interactive');

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
  const buildModel = async (modelType) => {
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

    const basePath = import.meta.env.BASE_URL || '/';
    const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';

    const loadSafeTexture = (url, wrapConfig = {}) => {
      const canvas = document.createElement('canvas');
      canvas.width = 4;
      canvas.height = 4;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 4, 4);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = wrapConfig.wrapS || THREE.MirroredRepeatWrapping;
      texture.wrapT = wrapConfig.wrapT || THREE.MirroredRepeatWrapping;
      if (wrapConfig.repeat) {
        texture.repeat.set(wrapConfig.repeat[0], wrapConfig.repeat[1]);
      }
      texture.anisotropy = 16;
      texture.generateMipmaps = true;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texture.image = img;
        texture.needsUpdate = true;
      };
      img.src = url;

      return texture;
    };

    if (modelType === 'revit') {
      setIsLoadingFile(true);
      setLoadProgress(15);
      setLoadPhase('Cargando Catastro Oficial AMB Cartagena (MAGNA-SIRGAS)...');

      const bgColor = 0xdbe8d4;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.Fog(bgColor, 300, 1200);

      const rootContainer = new THREE.Group();
      
      try {
        const territory = await buildCartagenaTerritoryScene({
          sceneRoot: rootContainer,
          activeLayers,
          colors: {
            terrain: grassColor,
            manzanas: pavementColor,
            water: waterColor,
            roads: roadColor,
            buildings: buildingColor,
            roofs: roofColor,
            trees: '#5c8f52',
            vehicles: '#e2635a',
            boats: '#24c8bd',
          },
          onProgress: (p, msg) => {
            setLoadProgress(p);
            setLoadPhase(msg);
          }
        });

        cartagenaTerritoryRef.current = territory;

        const box = new THREE.Box3().setFromObject(rootContainer);
        const center = box.getCenter(new THREE.Vector3());
        rootContainer.position.set(-center.x, -box.min.y, -center.z);

        scene.add(rootContainer);
        currentModelGroupRef.current = rootContainer;
      } catch (err) {
        console.error("Error building cartagena territory:", err);
      } finally {
        setLoadProgress(100);
        setIsLoadingFile(false);
      }
      return;
    }

    if (modelType === 'colegio') {
      // Pasto, Agua y Piso Textures (Endless / Seamless & Scaled with zero black flash)
      const pastoTex = loadSafeTexture(`${normalizedBase}assets/textura_pasto_m5.png`, {
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
        repeat: [12, 12]
      });

      const waterTex = loadSafeTexture(`${normalizedBase}assets/textura_agua_m5.jpg`, {
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
        repeat: [120, 120]
      });

      const pisoTex = loadSafeTexture(`${normalizedBase}assets/textura_piso_m5.png`, {
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
        repeat: [8, 8]
      });

      // Base de Pasto (Tono verde amarillento café)
      const grassGeo = new THREE.PlaneGeometry(90, 90);
      const grassMat = new THREE.MeshStandardMaterial({
        map: pastoTex,
        color: new THREE.Color(grassColor),
        roughness: 0.90,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      const grassMesh = new THREE.Mesh(grassGeo, grassMat);
      grassMesh.rotation.x = -Math.PI / 2;
      grassMesh.position.y = -0.02;
      grassMesh.receiveShadow = true;
      grassMesh.userData.layer = 'terrain_grass';
      modelGroup.add(grassMesh);
      objectsRef.current.terrain = grassMesh;

      // Espejo de Agua Marino (Ondas pequeñas y suaves)
      const waterGeo = new THREE.PlaneGeometry(180, 180);
      const waterMat = new THREE.MeshStandardMaterial({
        map: waterTex,
        color: new THREE.Color('#8dc8d2'),
        roughness: 0.18,
        metalness: 0.10,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
      });
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.y = -0.15;
      waterMesh.receiveShadow = true;
      modelGroup.add(waterMesh);

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

      // B. Plataforma / Losa Cívica Nivel +0.00 (Textura de Piso Travertino)
      const slabGeo = new THREE.BoxGeometry(22, 0.4, 15);
      const slabMat = new THREE.MeshStandardMaterial({
        map: pisoTex,
        color: new THREE.Color(pavementColor),
        roughness: 0.85,
        metalness: 0.02
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(0, 0.2, 0);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      slabMesh.userData.layer = 'terrain_pavement';
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
      // Pasto y Agua para Vivienda (Seamless & Scaled with safe non-black loading)
      const pastoTex = loadSafeTexture(`${normalizedBase}assets/textura_pasto_m5.png`, {
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
        repeat: [10, 10]
      });

      const waterTex = loadSafeTexture(`${normalizedBase}assets/textura_agua_m5.jpg`, {
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
        repeat: [120, 120]
      });

      // Base de Pasto (Tono verde amarillento café)
      const grassMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({
          map: pastoTex,
          color: new THREE.Color(grassColor),
          roughness: 0.9,
          side: THREE.DoubleSide
        })
      );
      grassMesh.rotation.x = -Math.PI / 2;
      grassMesh.position.y = -0.02;
      grassMesh.receiveShadow = true;
      grassMesh.userData.layer = 'terrain_grass';
      modelGroup.add(grassMesh);
      objectsRef.current.terrain = grassMesh;

      // Espejo de Agua Costero
      const waterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(140, 140),
        new THREE.MeshStandardMaterial({
          map: waterTex,
          color: new THREE.Color('#8dc8d2'),
          roughness: 0.18,
          metalness: 0.10,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide
        })
      );
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.y = -0.15;
      waterMesh.receiveShadow = true;
      modelGroup.add(waterMesh);

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
      setIsLoadingFile(true);
      setLoadProgress(15);
      setLoadPhase('Cargando Masterplan BIM Revit (Tierrabomba)...');

      const bgColor = 0xdbe8d4;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.Fog(bgColor, 250, 800);

      const gltfLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      gltfLoader.setDRACOLoader(dracoLoader);

      const basePath = import.meta.env.BASE_URL || '/';
      const modelUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}models/tierrabomba_revit.glb`;

      gltfLoader.load(
        modelUrl,
        (gltf) => {
          setLoadProgress(100);
          setLoadPhase('¡Masterplan BIM cargado!');

          if (currentModelGroupRef.current) {
            scene.remove(currentModelGroupRef.current);
            currentModelGroupRef.current = null;
          }
          const model = gltf.scene;

          model.rotation.x = -Math.PI / 2;
          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.z);
          const targetSize = 36;
          const scale = targetSize / (maxDim || 1);

          model.scale.set(scale, scale, scale);
          model.position.x = -center.x * scale;
          model.position.y = -box.min.y * scale + 0.05;
          model.position.z = -center.z * scale;

          const rootContainer = new THREE.Group();
          rootContainer.add(model);

          // Espejo de Agua Marino Insular alrededor de Tierrabomba
          const waterTex = new THREE.TextureLoader().load(`${basePath.endsWith('/') ? basePath : basePath + '/'}assets/textura_agua_m5.jpg`);
          waterTex.wrapS = THREE.MirroredRepeatWrapping;
          waterTex.wrapT = THREE.MirroredRepeatWrapping;
          waterTex.anisotropy = 16;
          waterTex.repeat.set(180, 180); // Textura de agua fina a gran escala

          const waterMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(350, 350),
            new THREE.MeshStandardMaterial({
              map: waterTex,
              color: new THREE.Color('#8dc8d2'),
              roughness: 0.18,
              metalness: 0.10,
              transparent: true,
              opacity: 0.92,
              side: THREE.DoubleSide
            })
          );
          waterMesh.rotation.x = -Math.PI / 2;
          waterMesh.position.y = -0.15;
          waterMesh.receiveShadow = true;
          rootContainer.add(waterMesh);

          objectsRef.current.revitTerrain = [];
          objectsRef.current.revitWalls = [];
          objectsRef.current.revitBuildings = [];

          const pastoTex = new THREE.TextureLoader().load(`${basePath.endsWith('/') ? basePath : basePath + '/'}assets/textura_pasto_m5.png`);
          pastoTex.wrapS = THREE.MirroredRepeatWrapping;
          pastoTex.wrapT = THREE.MirroredRepeatWrapping;
          pastoTex.anisotropy = 16;
          pastoTex.repeat.set(16, 16);

          const pisoTex = new THREE.TextureLoader().load(`${basePath.endsWith('/') ? basePath : basePath + '/'}assets/textura_piso_m5.png`);
          pisoTex.wrapS = THREE.MirroredRepeatWrapping;
          pisoTex.wrapT = THREE.MirroredRepeatWrapping;
          pisoTex.anisotropy = 16;
          pisoTex.repeat.set(24, 24);

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (child.geometry) {
                child.geometry.computeVertexNormals();
              }

              const name = (child.name || '') + (child.parent?.name || '');
              const matName = child.material ? child.material.name : '';

              if (name.includes('Terrain') || matName.includes('Terrain') || name.includes('Toposolid')) {
                child.material = new THREE.MeshStandardMaterial({
                  map: pastoTex,
                  color: new THREE.Color(grassColor),
                  roughness: 0.90,
                  metalness: 0.0,
                  side: THREE.DoubleSide,
                });
                child.renderOrder = 1;
                child.userData.layer = 'terrain_grass';
                objectsRef.current.revitTerrain.push(child);
                child.visible = activeLayers.terrain;
              } else if (name.includes('Floor') || matName.includes('Floor') || name.includes('Slab') || name.includes('Suelo') || name.includes('Plaza') || name.includes('Pavimento')) {
                child.material = new THREE.MeshStandardMaterial({
                  map: pisoTex,
                  color: new THREE.Color(pavementColor),
                  roughness: 0.88,
                  metalness: 0.02,
                  side: THREE.DoubleSide,
                });
                child.renderOrder = 2;
                child.userData.layer = 'terrain_pavement';
                objectsRef.current.revitTerrain.push(child);
                child.visible = activeLayers.terrain;
              } else if (name.includes('Walls') || name.includes('Partición') || name.includes('Interior') || name.includes('muro') || matName.includes('Walls')) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  roughness: 0.35,
                  metalness: 0.05,
                  side: THREE.DoubleSide,
                  polygonOffset: true,
                  polygonOffsetFactor: -2.0,
                  polygonOffsetUnits: -4.0,
                });
                child.renderOrder = 3;
                child.userData.layer = 'walls';
                objectsRef.current.revitWalls.push(child);
                child.visible = activeLayers.walls;
              } else {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x334155,
                  roughness: 0.50,
                  metalness: 0.10,
                  side: THREE.DoubleSide,
                  polygonOffset: true,
                  polygonOffsetFactor: -3.0,
                  polygonOffsetUnits: -6.0,
                });
                child.renderOrder = 4;
                child.userData.layer = 'buildings';
                objectsRef.current.revitBuildings.push(child);
                child.visible = activeLayers.buildings;
              }
            }
          });

          scene.add(rootContainer);
          currentModelGroupRef.current = rootContainer;
          setIsLoadingFile(false);
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            setLoadProgress(percent);
            const loadedMB = (xhr.loaded / (1024 * 1024)).toFixed(1);
            const totalMB = (xhr.total / (1024 * 1024)).toFixed(1);
            setLoadPhase(`Descargando Masterplan BIM (${loadedMB} MB / ${totalMB} MB)`);
          }
        },
        (err) => {
          console.error("Error loading masterplan BIM model:", err);
          setIsLoadingFile(false);
        }
      );
      return;
    }

    scene.add(modelGroup);
    currentModelGroupRef.current = modelGroup;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe8d4);
    scene.fog = new THREE.Fog(0xdbe8d4, 300, 1200);
    sceneRef.current = scene;

    // Cámara Ortográfica para Proyección Axonométrica Paralela a 35° (sin distorsión de perspectiva)
    const aspect = container.clientWidth / container.clientHeight;
    let viewSize = selected3DModel === 'masterplan' ? 26 : selected3DModel === 'revit' ? 130 : 22;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      2000
    );
    cameraRef.current = camera;

    // Renderer con soporte para sombras suaves y sRGB
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setClearColor(0xdbe8d4, 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Iluminación Solar & Ambiental Equilibrada (Sin sombras negras en pasto)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdbe8d4, 1.1);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, sunIntensity);
    const radAz = (sunAzimuth * Math.PI) / 180;
    const radEl = (sunElevation * Math.PI) / 180;
    const dist = selected3DModel === 'revit' ? 220 : 90;
    dirLight.position.set(
      dist * Math.cos(radAz) * Math.cos(radEl),
      dist * Math.sin(radEl),
      dist * Math.sin(radAz) * Math.cos(radEl)
    );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.left = -160;
    dirLight.shadow.camera.right = 160;
    dirLight.shadow.camera.top = 160;
    dirLight.shadow.camera.bottom = -160;
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

    // Orbit & Pan Controls para Vista Axonométrica
    let isDragging = false;
    let dragButton = 0;
    let prevMousePos = { x: 0, y: 0 };
    // Ángulo axonométrico panorámico a 45°
    let spherical = selected3DModel === 'masterplan'
      ? { radius: 55, theta: Math.PI / 4, phi: Math.PI * 45 / 180 }
      : selected3DModel === 'revit'
      ? { radius: 180, theta: -Math.PI * 0.25, phi: Math.PI * 45 / 180 }
      : { radius: 45, theta: Math.PI / 4, phi: Math.PI * 45 / 180 };
    let panTarget = selected3DModel === 'masterplan'
      ? { x: 0, y: 0.5, z: 0 }
      : selected3DModel === 'revit'
      ? { x: 0, y: 0, z: 0 }
      : { x: 0, y: 1.5, z: 0 };

    const updateCameraPosition = () => {
      camera.position.x = panTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = panTarget.y + spherical.radius * Math.cos(spherical.phi);
      camera.position.z = panTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(panTarget.x, panTarget.y, panTarget.z);
    };
    updateCameraPosition();

    const onMouseDown = (e) => {
      isDragging = true;
      dragButton = e.button;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      if (dragButton === 0) {
        // Pivotaje suave en eje Y conservando estricta vista axonométrica a ~45°
        spherical.theta -= deltaX * 0.003;
        // Bloqueo estricto del ángulo de elevación (phi) entre 42° y 48° para evitar volcamientos
        spherical.phi = Math.max(Math.PI * 0.233, Math.min(Math.PI * 0.267, spherical.phi - deltaY * 0.0005));
      } else if (dragButton === 2 || dragButton === 1 || e.shiftKey) {
        // Desplazamiento de plano (Pan con clic derecho)
        const panFactor = (viewSize * 2) / container.clientHeight;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        panTarget.x -= (right.x * deltaX) * panFactor;
        panTarget.z -= (right.z * deltaX) * panFactor;
        panTarget.y += (deltaY * 0.8) * panFactor;
      }

      updateCameraPosition();
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      viewSize = Math.max(5, Math.min(280, viewSize * zoomFactor));
      const currentAspect = container.clientWidth / container.clientHeight;
      camera.left = -viewSize * currentAspect;
      camera.right = viewSize * currentAspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('contextmenu', onContextMenu);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop (100% Estático — sin rotación ni movimiento automático)
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (cartagenaTerritoryRef.current?.update) {
        cartagenaTerritoryRef.current.update(isPlayingSimulationRef.current ? simulationSpeedRef.current : 0.8, performance.now());
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

  // Sync simulation refs with state
  useEffect(() => {
    isPlayingSimulationRef.current = isPlayingSimulation;
  }, [isPlayingSimulation]);

  useEffect(() => {
    simulationSpeedRef.current = simulationSpeed;
  }, [simulationSpeed]);

  // Update Model on switch
  useEffect(() => {
    buildModel(selected3DModel);
    if (selected3DModel === 'revit') {
      setBirdEyeView();
    } else {
      resetAxonometricView();
    }
  }, [selected3DModel]);

  // Update Sun Direction & Intensity in Real-time
  useEffect(() => {
    const dirLight = objectsRef.current.dirLight;
    if (!dirLight) return;
    const radAz = (sunAzimuth * Math.PI) / 180;
    const radEl = (sunElevation * Math.PI) / 180;
    const dist = selected3DModel === 'revit' ? 220 : 90;
    dirLight.position.set(
      dist * Math.cos(radAz) * Math.cos(radEl),
      dist * Math.sin(radEl),
      dist * Math.sin(radAz) * Math.cos(radEl)
    );
    dirLight.intensity = sunIntensity;
  }, [sunAzimuth, sunElevation, sunIntensity, selected3DModel]);

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

    // Revit Model layers (Tierrabomba BIM)
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

    // Cartagena Territorial simulation layers
    if (cartagenaTerritoryRef.current && cartagenaTerritoryRef.current.group) {
      const grp = cartagenaTerritoryRef.current.group;
      const waterM = cartagenaTerritoryRef.current.animatedObjects.waterMeshes;
      waterM.forEach(w => { if (w) w.visible = !!activeLayers.water; });

      const land = grp.getObjectByName("Landmasses");
      if (land) land.visible = !!activeLayers.terrain;

      const forts = grp.getObjectByName("Fortresses");
      if (forts) forts.visible = !!activeLayers.buildings;

      const roads = grp.getObjectByName("RoadNetwork");
      if (roads) roads.visible = !!activeLayers.walls;

      const bldgs = grp.getObjectByName("Buildings3D");
      if (bldgs) bldgs.visible = !!activeLayers.buildings;

      const veg = grp.getObjectByName("Vegetation");
      if (veg) veg.visible = !!activeLayers.trees;

      const rts = grp.getObjectByName("MaritimeRoutes");
      if (rts) rts.visible = !!activeLayers.boats;

      cartagenaTerritoryRef.current.animatedObjects.boats.forEach(b => {
        if (b.mesh) b.mesh.visible = !!activeLayers.boats;
      });
      cartagenaTerritoryRef.current.animatedObjects.vehicles.forEach(v => {
        if (v.mesh) v.mesh.visible = !!activeLayers.vehicles;
      });
    }
  }, [activeLayers]);

  // Update Materials Color in Real-time
  useEffect(() => {
    if (!sceneRef.current) return;
    const gCol = new THREE.Color(grassColor);
    const pCol = new THREE.Color(pavementColor);
    const wCol = new THREE.Color(waterColor);
    const bCol = new THREE.Color(buildingColor);
    const rCol = new THREE.Color(roofColor);
    const rdCol = new THREE.Color(roadColor);

    sceneRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.name || '') + (child.parent?.name || '');
        const matName = child.material.name || '';
        if (child.userData.layer === 'terrain_grass' || name.includes('Terrain') || matName.includes('Terrain') || name.includes('Toposolid') || name.includes('Grass') || name.includes('Pasto')) {
          child.material.color = gCol;
          child.material.needsUpdate = true;
        } else if (child.userData.layer === 'terrain_pavement' || name.includes('Floor') || matName.includes('Floor') || name.includes('Slab') || name.includes('Suelo') || name.includes('Pavimento') || name.includes('Plaza') || name.includes('Manzana')) {
          child.material.color = pCol;
          child.material.needsUpdate = true;
        } else if (child.userData.layer === 'water' || name.includes('Water') || matName.includes('Water') || name.includes('Agua')) {
          child.material.color = wCol;
          child.material.needsUpdate = true;
        } else if (child.userData.layer === 'buildings' || name.includes('Building') || name.includes('Wall') || matName.includes('Building') || matName.includes('Wall')) {
          child.material.color = bCol;
          child.material.needsUpdate = true;
        } else if (child.userData.layer === 'roof' || name.includes('Roof') || matName.includes('Roof') || name.includes('Techo') || name.includes('Cubierta')) {
          child.material.color = rCol;
          child.material.needsUpdate = true;
        } else if (child.userData.layer === 'roads' || name.includes('Road') || matName.includes('Road') || name.includes('Via') || name.includes('Vía')) {
          child.material.color = rdCol;
          child.material.needsUpdate = true;
        }
      }
    });

    if (cartagenaTerritoryRef.current?.setGreenColor) {
      cartagenaTerritoryRef.current.setGreenColor(grassColor);
    }
    if (cartagenaTerritoryRef.current?.setPavementColor) {
      cartagenaTerritoryRef.current.setPavementColor(pavementColor);
    }
    if (cartagenaTerritoryRef.current?.setWaterColor) {
      cartagenaTerritoryRef.current.setWaterColor(waterColor);
    }
    if (cartagenaTerritoryRef.current?.setRoadsColor) {
      cartagenaTerritoryRef.current.setRoadsColor(roadColor);
    }
    if (cartagenaTerritoryRef.current?.setBuildingsColor) {
      cartagenaTerritoryRef.current.setBuildingsColor(buildingColor);
    }
    if (cartagenaTerritoryRef.current?.setRoofsColor) {
      cartagenaTerritoryRef.current.setRoofsColor(roofColor);
    }
  }, [grassColor, pavementColor, waterColor, buildingColor, roofColor, roadColor]);

  // Restablecer Vista Axonométrica a 45° (proyección paralela)
  const resetAxonometricView = () => {
    if (!cameraRef.current || !mountRef.current) return;
    const container = mountRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = selected3DModel === 'masterplan' ? 26 : selected3DModel === 'revit' ? 110 : 22;
    const camera = cameraRef.current;
    if (camera.isOrthographicCamera) {
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    }

    const spherical = selected3DModel === 'masterplan'
      ? { radius: 55, theta: Math.PI / 4, phi: Math.PI * 45 / 180 }
      : selected3DModel === 'revit'
      ? { radius: 180, theta: -Math.PI * 0.25, phi: Math.PI * 45 / 180 }
      : { radius: 45, theta: Math.PI / 4, phi: Math.PI * 45 / 180 };

    const panTarget = selected3DModel === 'masterplan'
      ? { x: 0, y: 0.5, z: 0 }
      : selected3DModel === 'revit'
      ? { x: 0, y: 0, z: 0 }
      : { x: 0, y: 1.5, z: 0 };

    camera.position.x = panTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = panTarget.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = panTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(panTarget.x, panTarget.y, panTarget.z);
  };

  // Vista Panorámica Aérea Axonométrica a 45° de Cartagena y Tierra Bomba
  const setBirdEyeView = () => {
    if (!cameraRef.current || !mountRef.current) return;
    const container = mountRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = 110;
    const camera = cameraRef.current;
    if (camera.isOrthographicCamera) {
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    }

    const spherical = { radius: 180, theta: -Math.PI * 0.25, phi: Math.PI * 45 / 180 };
    const panTarget = { x: 0, y: 0, z: 0 };
    camera.position.x = panTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = panTarget.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = panTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(panTarget.x, panTarget.y, panTarget.z);
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

      // Rotar -90° en X para que la cota Z de Revit quede en el eje vertical Y de Three.js (terreno horizontal)
      modelGroup.rotation.x = -Math.PI / 2;
      modelGroup.updateMatrixWorld(true);

      // Compute bounding box and normalize scale & center
      const box = new THREE.Box3().setFromObject(modelGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z);
      const targetSize = 36;
      const scale = targetSize / (maxDim || 1);

      modelGroup.scale.set(scale, scale, scale);
      const basePath = import.meta.env.BASE_URL || '/';

      scene.background = new THREE.Color(0xdbe8d4);
      scene.fog = new THREE.Fog(0xdbe8d4, 250, 800);

      const rootContainer = new THREE.Group();
      rootContainer.add(modelGroup);

      objectsRef.current.revitTerrain = [];
      objectsRef.current.revitWalls = [];
      objectsRef.current.revitBuildings = [];

      const pastoTex = new THREE.TextureLoader().load(`${basePath.endsWith('/') ? basePath : basePath + '/'}assets/textura_pasto_m5.png`);
      pastoTex.wrapS = THREE.MirroredRepeatWrapping;
      pastoTex.wrapT = THREE.MirroredRepeatWrapping;
      pastoTex.repeat.set(12, 12);

      modelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }

          const name = (child.name || '') + (child.parent?.name || '');
          const matName = child.material ? child.material.name : '';

          if (name.includes('Toposolid') || name.toLowerCase().includes('terrain') || matName.includes('Toposolid') || matName.toLowerCase().includes('terrain')) {
            child.material = new THREE.MeshStandardMaterial({
              map: pastoTex,
              color: 0xffffff,
              roughness: 0.90,
              metalness: 0.0,
              side: THREE.DoubleSide,
            });
            child.renderOrder = 1;
            child.userData.layer = 'terrain';
            objectsRef.current.revitTerrain.push(child);
            child.visible = activeLayers.terrain;
          } else if (name.includes('Partición') || name.includes('Interior') || name.toLowerCase().includes('muro') || name.toLowerCase().includes('wall') || matName.includes('muro') || matName.includes('Walls')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.35,
              metalness: 0.05,
              side: THREE.DoubleSide,
              polygonOffset: true,
              polygonOffsetFactor: -2.0,
              polygonOffsetUnits: -4.0,
            });
            child.renderOrder = 3;
            child.userData.layer = 'walls';
            objectsRef.current.revitWalls.push(child);
            child.visible = activeLayers.walls;
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x1e293b,
              roughness: 0.45,
              metalness: 0.15,
              side: THREE.DoubleSide,
              polygonOffset: true,
              polygonOffsetFactor: -3.0,
              polygonOffsetUnits: -6.0,
            });
            child.renderOrder = 4;
            child.userData.layer = 'buildings';
            objectsRef.current.revitBuildings.push(child);
            child.visible = activeLayers.buildings;
          }
        }
      });

      scene.add(rootContainer);
      currentModelGroupRef.current = rootContainer;

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
    revit: {
      title: "Cartografía 3D Territorial — Cartagena + Tierra Bomba (Catastro AMB)",
      capacity: "Catastro Multipropósito AMB Cartagena 2026 (GDB & SHP)",
      area: "Isla de Tierra Bomba (Bocachica, Caño de Oro, Punta Arenas, Tierrabomba) + Bahía de Cartagena",
      specs: [
        { label: "Base Cartográfica", value: "Catastro AMB Cartagena" },
        { label: "Proyección", value: "MAGNA-SIRGAS (EPSG:9377)" },
        { label: "Capas Vectoriales", value: "Construcción, Manzanas, Vías" },
        { label: "Tránsito Marítimo", value: "3 Rutas Lanchas en Vivo" }
      ],
      desc: "Modelo tridimensional territorial integrado con la base cartográfica oficial del Catastro Multipropósito del Área Metropolitana / Alcaldía de Cartagena (AMB). Articula la delimitación de los corregimientos insulares (Tierra Bomba, Bocachica, Caño de Oro y Punta Arenas), el trazado parcelario y de manzanas (Manzana.shp), los ejes viales y nomenclatura (Nomenclaturavial.shp), las huellas de construcciones (Construccion.shp), la topografía continental e insular y el sistema hidrográfico de la Bahía con simulación de transporte marítimo y vehicular en tiempo real."
    },
    masterplan: {
      title: "Masterplan Arquitectónico BIM (Tierra Bomba)",
      capacity: "4.472 Elementos BIM Clasificados",
      area: "Toposolid + Equipamiento + Viviendas + Muros",
      specs: [
        { label: "Topografía", value: "Toposolid Insular Activo" },
        { label: "Vías y Muros", value: "3.452 Elementos (138mm)" },
        { label: "Edificaciones", value: "1.019 Masas Arquitectónicas" },
        { label: "Caja de Sección", value: "6 Planos de Corte en Vivo" }
      ],
      desc: "Modelo tridimensional BIM original exportado directamente desde Autodesk Revit. Permite encender o apagar independientemente la topografía insular, los muros/particiones interiores y los volúmenes de las edificaciones con caja de sección y corte axonométrico en tiempo real."
    },
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



      {/* 1. FULLSCREEN 3D WEBGL CANVAS */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* ========================================================================= */}
      {/* 2. FLOATING HUD OVERLAYS ON TOP OF 3D VIEWPORT                            */}
      {/* ========================================================================= */}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Module Title & Axonometric Description Card */}
        <div className="glass-dark px-4 py-2.5 rounded-2xl pointer-events-auto flex items-center space-x-3 max-w-xl text-white shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-[#24c8bd] text-slate-950 flex items-center justify-center font-serif font-black text-sm shrink-0 shadow-md">
            {selected3DModel === 'revit' ? '08' : '05'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm text-white tracking-wide truncate">
                {selected3DModel === 'revit'
                  ? 'Cartagena + Tierra Bomba (Catastro AMB)'
                  : selected3DModel === 'masterplan'
                  ? 'Corte axonométrico — Masterplan Tierrabomba'
                  : selected3DModel === 'colegio'
                  ? 'Equipamiento Educativo & Dispensario Hídrico'
                  : 'Prototipo Vivienda Palafítica'}
              </h1>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#24c8bd]/20 text-[#24c8bd] border border-[#24c8bd]/30 shrink-0">
                {selected3DModel === 'revit' ? 'CATASTRO AMB 3D' : 'AXONO 35°'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
              {selected3DModel === 'revit'
                ? 'Catastro Oficial AMB Cartagena (MAGNA-SIRGAS EPSG:9377) • Manzanas, Vías & Edificaciones • Lanchas en vivo'
                : 'Proyección axonométrica a 35° • Arrastra para girar • Rueda para zoom • Clic derecho para mover'}
            </p>
          </div>
        </div>

        {/* 3D Model Switcher Bar & Axonometric Reset */}
        <div className="flex items-center gap-2 self-start md:self-center pointer-events-auto flex-wrap">
          <div className="glass-dark p-1 rounded-2xl flex items-center gap-1 text-white flex-wrap shadow-xl">
            <button
              onClick={() => {
                setSelected3DModel('revit');
                buildModel('revit');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                selected3DModel === 'revit'
                  ? 'bg-[#24c8bd] text-slate-950 shadow-sm ring-2 ring-[#24c8bd]/50'
                  : 'text-teal-300 hover:text-white bg-teal-500/10'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Cartagena + Tierra Bomba</span>
            </button>
            <button
              onClick={() => {
                setSelected3DModel('masterplan');
                buildModel('masterplan');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                selected3DModel === 'masterplan'
                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                  : 'text-amber-300 hover:text-white bg-amber-500/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Masterplan Tierrabomba</span>
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
              <span>Colegio</span>
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
              <span>Vivienda</span>
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

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 text-amber-200 border border-amber-400/40 transition-all shadow-sm hover:scale-[1.02]"
              title="Importar archivo exportado desde Revit (.glb, .gltf, .obj)"
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
              <span>Cargar</span>
            </button>
          </div>

          {/* Botón Ficha Técnica Catastral */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-2 rounded-2xl text-xs font-mono font-bold bg-[#24c8bd]/20 hover:bg-[#24c8bd]/30 text-[#24c8bd] border border-[#24c8bd]/40 transition-all flex items-center space-x-1.5 shadow-xl hover:scale-[1.02] active:scale-95"
            title="Ver Ficha Técnica y Metadatos Catastrales AMB"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Ficha Técnica</span>
          </button>

          {/* Botón Vista Panorámica Aérea (Cartagena) */}
          {selected3DModel === 'revit' && (
            <button
              onClick={setBirdEyeView}
              className="px-3.5 py-2 rounded-2xl text-xs font-mono font-bold bg-gradient-to-r from-blue-600/30 to-teal-500/30 hover:from-blue-600/50 hover:to-teal-500/50 text-blue-200 border border-blue-400/40 transition-all flex items-center space-x-1.5 shadow-xl hover:scale-[1.02] active:scale-95"
              title="Encuadre aéreo panorámico de toda Cartagena y la Bahía"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Vista Panorámica Ciudad</span>
            </button>
          )}

          {/* Botón Principal: Restablecer Vista Axonométrica (a 35°) */}
          <button
            onClick={resetAxonometricView}
            className="px-3.5 py-2 rounded-2xl text-xs font-mono font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/20 transition-all flex items-center space-x-1.5 shadow-xl hover:scale-[1.02] active:scale-95 text-white"
            title="Restablecer orientación isométrica a 35°"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#24c8bd]" />
            <span>Restablecer vista axonométrica</span>
          </button>
        </div>

      </div>






      {/* Floating Right: Axonometric Controls Panel (Sun, Colors, Noise, Climate & Section Box) */}
      <div className="absolute top-20 right-4 z-[400] glass-dark p-4 rounded-2xl space-y-3.5 pointer-events-auto text-white w-72 max-h-[calc(100vh-100px)] overflow-y-auto shadow-2xl border border-white/10 backdrop-blur-xl">
        
        {/* Sol — Acimut & Altura */}
        <div className="space-y-2.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Sol — acimut</span>
              </span>
              <span className="text-amber-400 font-bold">{sunAzimuth}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={sunAzimuth}
              onChange={(e) => setSunAzimuth(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Sol — altura</span>
              </span>
              <span className="text-amber-400 font-bold">{sunElevation}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              value={sunElevation}
              onChange={(e) => setSunElevation(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Intensidad solar</span>
              </span>
              <span className="text-amber-400 font-bold">{sunIntensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={sunIntensity}
              onChange={(e) => setSunIntensity(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Tonos de Color Personalizables (Mar, Pasto, Pavimento, Edificios, Cubiertas, Vías) */}
        <div className="pt-2.5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#24c8bd] uppercase tracking-wider block">
              Editor de Materiales
            </span>
            <span className="text-[9px] font-mono text-slate-400">Tiempo Real</span>
          </div>

          {/* 1. Color del Pasto (Verde amarillento café atenuado) */}
          <div className="space-y-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pasto / Vegetación:</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={grassColor}
                  onChange={(e) => setGrassColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Seleccionar color personalizado"
                />
                <span className="text-emerald-400 font-bold text-[10px]">{grassColor}</span>
              </div>
            </div>
            {/* Presets verde amarillento café equilibrados */}
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: 'Oliva Suave', hex: '#65763e' },
                { name: 'Verde Mate', hex: '#5b6c37' },
                { name: 'Verde Amarillento', hex: '#778847' },
                { name: 'Sabana Insular', hex: '#838e55' }
              ].map(preset => (
                <button
                  key={preset.hex}
                  onClick={() => setGrassColor(preset.hex)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-mono border transition-all ${
                    grassColor.toLowerCase() === preset.hex.toLowerCase()
                      ? 'border-white ring-1 ring-emerald-400 font-bold text-white bg-white/20'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  style={{ backgroundColor: `${preset.hex}33` }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color del Mar / Agua */}
          <div className="space-y-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mar / Agua Marina:</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={waterColor}
                  onChange={(e) => setWaterColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Seleccionar color del agua"
                />
                <span className="text-cyan-400 font-bold text-[10px]">{waterColor}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: 'Turquesa Caribe', hex: '#8dc8d2' },
                { name: 'Azul Bahía', hex: '#7ba9c2' },
                { name: 'Azul Claro', hex: '#9ed4dc' },
                { name: 'Marino Profundo', hex: '#58839d' }
              ].map(preset => (
                <button
                  key={preset.hex}
                  onClick={() => setWaterColor(preset.hex)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-mono border transition-all ${
                    waterColor.toLowerCase() === preset.hex.toLowerCase()
                      ? 'border-white ring-1 ring-cyan-400 font-bold text-white bg-white/20'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  style={{ backgroundColor: `${preset.hex}33` }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color del Pavimento / Piso */}
          <div className="space-y-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                <span>Piso / Pavimento:</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={pavementColor}
                  onChange={(e) => setPavementColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Seleccionar color del pavimento"
                />
                <span className="text-amber-300 font-bold text-[10px]">{pavementColor}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: 'Travertino', hex: '#d4c5b3' },
                { name: 'Arena Cálida', hex: '#c8b9a6' },
                { name: 'Piedra Coral', hex: '#e2d5c3' },
                { name: 'Gris Cemento', hex: '#a8a29e' }
              ].map(preset => (
                <button
                  key={preset.hex}
                  onClick={() => setPavementColor(preset.hex)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-mono border transition-all ${
                    pavementColor.toLowerCase() === preset.hex.toLowerCase()
                      ? 'border-white ring-1 ring-amber-400 font-bold text-white bg-white/20'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  style={{ backgroundColor: `${preset.hex}33` }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Color de Edificaciones & Cubiertas */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-300 block">Edificaciones</span>
              <div className="flex items-center justify-between">
                <input
                  type="color"
                  value={buildingColor}
                  onChange={(e) => setBuildingColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[10px] font-mono text-white font-bold">{buildingColor}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-300 block">Cubiertas</span>
              <div className="flex items-center justify-between">
                <input
                  type="color"
                  value={roofColor}
                  onChange={(e) => setRoofColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[10px] font-mono text-terracotta-300 font-bold">{roofColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>






      {/* Floating Bottom Center: Orbit & Zoom Instruction Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none hidden md:block">
        <div className="glass-dark px-4 py-2 rounded-2xl text-xs font-mono text-slate-300 flex items-center space-x-4 shadow-xl">
          <span className="flex items-center space-x-1.5"><RotateCcw className="w-3.5 h-3.5 text-[#24c8bd]" /><span><b>Arrastrar:</b> Girar</span></span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1.5"><Maximize2 className="w-3.5 h-3.5 text-[#24c8bd]" /><span><b>Scroll:</b> Zoom</span></span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1.5"><Sliders className="w-3.5 h-3.5 text-[#24c8bd]" /><span><b>Clic Derecho:</b> Mover</span></span>
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
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {selected3DModel === 'revit' ? 'CARTOGRAFÍA OFICIAL // CATASTRO AMB CARTAGENA' : 'FICHA TÉCNICA 3D BIM // ARQUITECTURA'}
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

            {/* Ficha Catastral AMB Detallada */}
            {selected3DModel === 'revit' && (
              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    Capas del Catastro Multipropósito AMB Cartagena
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-teal-200/60 text-teal-900">
                    MAGNA-SIRGAS EPSG:9377
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">Construccion.shp</span>
                    <span className="text-[10px] text-slate-500 font-sans">Huellas 1:1 de edificios</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">Manzana.shp</span>
                    <span className="text-[10px] text-slate-500 font-sans">Trazado y parcelario</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">Nomenclaturavial.shp</span>
                    <span className="text-[10px] text-slate-500 font-sans">Ejes y vías oficiales</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">Corregimiento.shp</span>
                    <span className="text-[10px] text-slate-500 font-sans">Límites Tierra Bomba</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">GDB_Catastro.gdb</span>
                    <span className="text-[10px] text-slate-500 font-sans">Geodatabase Esri</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 shadow-sm">
                    <span className="font-bold block text-teal-900 text-[11px]">Terreno.shp</span>
                    <span className="text-[10px] text-slate-500 font-sans">Predios y lotes</span>
                  </div>
                </div>
              </div>
            )}

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
