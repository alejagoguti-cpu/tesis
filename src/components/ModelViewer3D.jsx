import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { buildCartagenaTerritoryScene } from '../utils/cartagena3D.js';
import TierrabombaFutureModal from './TierrabombaFutureModal.jsx';
import pastoTextureImg from '../assets/textura_pasto_m5.png';
import waterTextureImg from '../assets/textura_agua_m5.jpg';
import pisoTextureImg from '../assets/textura_piso_m5.png';
import viaTextureImg from '../assets/textura_via.jpg';
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
  Play,
  Pause,
  FastForward,
  Ship,
  Activity,
  Save,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Map
} from 'lucide-react';

export const DEFAULT_M5_PALETTE = {
  grass: '#ffffff',
  water: '#b5ebf5', // Celeste cristalino más clarito y luminoso
  pavement: '#f8fafc',
  building: '#ffffff',
  roof: '#ffffff', // 100% blanco
  road: '#334155'
};

export const getSavedM5Palette = () => {
  try {
    const saved = localStorage.getItem('thesis_m5_custom_colors');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Forzar tono celeste clarito solicitado por el usuario y edificios blancos
      parsed.water = '#b5ebf5';
      parsed.roof = '#ffffff';
      parsed.building = '#ffffff';
      return { ...DEFAULT_M5_PALETTE, ...parsed };
    }
  } catch (e) {}
  return DEFAULT_M5_PALETTE;
};

export default function ModelViewer3D({ onSelectModule }) {
  const mountRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selected3DModel, setSelected3DModel] = useState('revit'); // 'revit' (Cartagena + Tierra Bomba por defecto) | 'masterplan' | 'colegio' | 'vivienda' | 'custom'
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);

  // Tonos de Materialidad Personalizables (Mar, Pasto, Piso, Edificios, Techos, Vías)
  const [initialPalette] = useState(getSavedM5Palette);
  const [waterColor, setWaterColor] = useState('#b5ebf5');
  const [grassColor, setGrassColor] = useState(initialPalette.grass);
  const [pavementColor, setPavementColor] = useState(initialPalette.pavement);
  const [buildingColor, setBuildingColor] = useState('#ffffff');
  const [roofColor, setRoofColor] = useState('#ffffff');
  const [roadColor, setRoadColor] = useState(initialPalette.road);

  const [saveColorsToast, setSaveColorsToast] = useState(false);
  const [copyColorsToast, setCopyColorsToast] = useState(false);

  // Especies Nativas (Red Biótica) & Paneles Flotantes Limpios
  const [selectedTreeSpecies, setSelectedTreeSpecies] = useState(null);
  const [showRightControls, setShowRightControls] = useState(false);

  // Simulación de Tránsito Marítimo y Urbano en Vivo
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(true);
  const isPlayingSimulationRef = useRef(true);
  const [simulationSpeed, setSimulationSpeed] = useState(0.4);
  const simulationSpeedRef = useRef(0.4);
  const cartagenaTerritoryRef = useRef(null);

  // Módulo Interactivo: Plan Maestro Territorial (Articulación, Parque Ecológico, Colegio y Senderos)
  const [showMasterplanPanel, setShowMasterplanPanel] = useState(true);
  const [activeMasterplanStep, setActiveMasterplanStep] = useState(0);

  // Parámetros Solares Fijados (Acimut 48°, Altura 23°, Intensidad 1.7x)
  const [sunAzimuth, setSunAzimuth] = useState(48);
  const [sunElevation, setSunElevation] = useState(23);
  const [sunIntensity, setSunIntensity] = useState(1.7);
  const [cameraMode, setCameraMode] = useState('orthographic');

  const [showFutureModal, setShowFutureModal] = useState(false);
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

    const texLoader = new THREE.TextureLoader();

    if (modelType === 'revit' || modelType === 'masterplan') {
      setIsLoadingFile(true);
      setLoadProgress(15);
      setLoadPhase(modelType === 'masterplan' ? 'Cargando Masterplan Territorial Tierrabomba (+22m)...' : 'Cargando Catastro Oficial AMB Cartagena (MAGNA-SIRGAS)...');

      const bgColor = 0xeaf2f8;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.Fog(bgColor, 500, 2400);

      const rootContainer = new THREE.Group();
      
      try {
        const territory = await buildCartagenaTerritoryScene({
          sceneRoot: rootContainer,
          activeLayers: {
            ...activeLayers,
            masterplan: modelType === 'masterplan',
          },
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
      // Pasto, Agua y Piso Textures (100% Auténticas y nítidas)
      const pastoTex = texLoader.load(pastoTextureImg);
      pastoTex.wrapS = THREE.RepeatWrapping;
      pastoTex.wrapT = THREE.RepeatWrapping;
      pastoTex.repeat.set(12, 12);
      pastoTex.anisotropy = 16;

      const waterTex = texLoader.load(waterTextureImg);
      waterTex.wrapS = THREE.RepeatWrapping;
      waterTex.wrapT = THREE.RepeatWrapping;
      waterTex.repeat.set(60, 60);
      waterTex.anisotropy = 16;

      const pisoTex = texLoader.load(pisoTextureImg);
      pisoTex.wrapS = THREE.RepeatWrapping;
      pisoTex.wrapT = THREE.RepeatWrapping;
      pisoTex.repeat.set(8, 8);
      pisoTex.anisotropy = 16;

      // Base de Pasto (Tono auténtico con textura de pasto)
      const grassGeo = new THREE.PlaneGeometry(90, 90);
      const grassMat = new THREE.MeshStandardMaterial({
        map: pastoTex,
        color: new THREE.Color(grassColor || '#ffffff'),
        roughness: 0.88,
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

      // Espejo de Agua Marino (Ondas suaves y textura clara de agua)
      const waterGeo = new THREE.PlaneGeometry(180, 180);
      const waterMat = new THREE.MeshStandardMaterial({
        map: waterTex,
        bumpMap: waterTex,
        bumpScale: 0.04,
        color: new THREE.Color(waterColor || '#ffffff'),
        roughness: 0.16,
        metalness: 0.08,
        transparent: true,
        opacity: 0.94,
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

      // E. Cubierta Invertida Captadora (1.850 m² - 100% Blanca)
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.05,
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
      // Pasto y Agua para Vivienda (100% Auténticas y nítidas)
      const pastoTex = texLoader.load(pastoTextureImg);
      pastoTex.wrapS = THREE.RepeatWrapping;
      pastoTex.wrapT = THREE.RepeatWrapping;
      pastoTex.repeat.set(10, 10);
      pastoTex.anisotropy = 16;

      const waterTex = texLoader.load(waterTextureImg);
      waterTex.wrapS = THREE.RepeatWrapping;
      waterTex.wrapT = THREE.RepeatWrapping;
      waterTex.repeat.set(60, 60);
      waterTex.anisotropy = 16;

      // Base de Pasto (Tono auténtico con textura de pasto)
      const grassMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({
          map: pastoTex,
          color: new THREE.Color(grassColor || '#ffffff'),
          roughness: 0.88,
          metalness: 0.0,
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
          bumpMap: waterTex,
          bumpScale: 0.04,
          color: new THREE.Color(waterColor || '#ffffff'),
          roughness: 0.16,
          metalness: 0.08,
          transparent: true,
          opacity: 0.94,
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

      // Estructura Habitacional (100% Blanca)
      const houseGroup = new THREE.Group();
      const btcMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });

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
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, roughness: 0.3 })
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
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      for (let z = 0.5; z <= 3.0; z += 0.4) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.2), louverMat);
        louver.position.set(4.3, 2.8, z);
        louversGroup.add(louver);
      }
      modelGroup.add(louversGroup);
      objectsRef.current.louvers = louversGroup;

      // Cubierta a dos aguas con aleros de 2.5m (100% Blanca)
      const roofGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, side: THREE.DoubleSide });

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

    scene.add(modelGroup);
    currentModelGroupRef.current = modelGroup;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const bgColor = 0xeaf2f8;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 500, 2400);
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
    renderer.setClearColor(bgColor, 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Iluminación Solar & Ambiental Equilibrada (Alto Contraste y Definición 3D)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcce0f0, 0.85);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaec, sunIntensity * 1.35);
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
        try {
          cartagenaTerritoryRef.current.update(isPlayingSimulationRef.current ? simulationSpeedRef.current : 0.8, performance.now());
        } catch (e) {
          console.warn("Territory animation error:", e);
        }
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
    dirLight.intensity = sunIntensity * 1.35;
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

  // Update Materials Color in Real-time & Auto-save to LocalStorage
  useEffect(() => {
    if (!sceneRef.current) return;
    const gCol = new THREE.Color(grassColor);
    const pCol = new THREE.Color(pavementColor);
    const wCol = new THREE.Color(waterColor);
    const bCol = new THREE.Color(buildingColor);
    const rCol = new THREE.Color(roofColor);
    const rdCol = new THREE.Color(roadColor);

    // Auto-save to localStorage so changes persist across sessions
    try {
      localStorage.setItem('thesis_m5_custom_colors', JSON.stringify({
        grass: grassColor,
        water: waterColor,
        pavement: pavementColor,
        building: buildingColor,
        roof: roofColor,
        road: roadColor
      }));
    } catch (e) {}

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

  // Guardar permanente con feedback visual explícito
  const handleSavePermanentColors = () => {
    try {
      localStorage.setItem('thesis_m5_custom_colors', JSON.stringify({
        grass: grassColor,
        water: waterColor,
        pavement: pavementColor,
        building: buildingColor,
        roof: roofColor,
        road: roadColor
      }));
      setSaveColorsToast(true);
      setTimeout(() => setSaveColorsToast(false), 3200);
    } catch (e) {
      console.error("Error saving palette:", e);
    }
  };

  // Restablecer paleta predeterminada
  const handleResetDefaultColors = () => {
    setGrassColor(DEFAULT_M5_PALETTE.grass);
    setWaterColor(DEFAULT_M5_PALETTE.water);
    setPavementColor(DEFAULT_M5_PALETTE.pavement);
    setBuildingColor(DEFAULT_M5_PALETTE.building);
    setRoofColor(DEFAULT_M5_PALETTE.roof);
    setRoadColor(DEFAULT_M5_PALETTE.road);
    try {
      localStorage.removeItem('thesis_m5_custom_colors');
    } catch (e) {}
    setSaveColorsToast(true);
    setTimeout(() => setSaveColorsToast(false), 3200);
  };

  // Copiar código HEX
  const handleCopyPaletteCode = () => {
    const palette = {
      pasto: grassColor,
      mar: waterColor,
      pavimento: pavementColor,
      edificios: buildingColor,
      cubiertas: roofColor,
      vias: roadColor
    };
    navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
    setCopyColorsToast(true);
    setTimeout(() => setCopyColorsToast(false), 3000);
  };

  // Restablecer Vista Axonométrica a 45° (proyección paralela)
  const resetAxonometricView = () => {
    if (!cameraRef.current || !mountRef.current) return;
    const container = mountRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = selected3DModel === 'masterplan' ? 34 : selected3DModel === 'revit' ? 110 : 22;
    const camera = cameraRef.current;
    if (camera.isOrthographicCamera) {
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    }

    const spherical = selected3DModel === 'masterplan'
      ? { radius: 75, theta: -Math.PI * 0.22, phi: Math.PI * 45 / 180 }
      : selected3DModel === 'revit'
      ? { radius: 180, theta: -Math.PI * 0.25, phi: Math.PI * 45 / 180 }
      : { radius: 45, theta: Math.PI / 4, phi: Math.PI * 45 / 180 };

    const panTarget = selected3DModel === 'masterplan'
      ? { x: -35, y: 0.5, z: -34 }
      : selected3DModel === 'revit'
      ? { x: 0, y: 0, z: 0 }
      : { x: 0, y: 1.5, z: 0 };

    camera.position.x = panTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = panTarget.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = panTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(panTarget.x, panTarget.y, panTarget.z);
  };

  // Encuadre rápido a nodos estratégicos del Masterplan
  const focusMasterplanNode = (nodeKey) => {
    if (!cameraRef.current || !mountRef.current) return;
    const container = mountRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = 22;
    const camera = cameraRef.current;
    if (camera.isOrthographicCamera) {
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    }

    const nodeTargets = {
      colegio: { x: -34.8, y: 0.5, z: -35.2 },
      viviendas: { x: -32.2, y: 0.5, z: -37.5 },
      reserva: { x: -36.5, y: 0.5, z: -32.0 },
      erosion: { x: -35.0, y: 0.5, z: -40.5 },
      division: { x: -34.0, y: 0.5, z: -31.5 },
    };

    const target = nodeTargets[nodeKey] || { x: -35, y: 0.5, z: -34 };
    const spherical = { radius: 55, theta: -Math.PI * 0.22, phi: Math.PI * 45 / 180 };

    camera.position.x = target.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = target.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = target.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(target.x, target.y, target.z);
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
      {/* 2. CONTROLES MINIMALISTAS: ESTUDIO SOLAR & AXONOMETRÍA                    */}
      {/* ========================================================================= */}

      {/* Loading Indicator */}
      {isLoadingFile && (
        <div className="absolute top-4 left-4 z-[400] glass-dark px-4 py-2.5 rounded-2xl text-xs font-mono text-white flex items-center space-x-2.5 border border-white/10 shadow-2xl pointer-events-none animate-fade-in backdrop-blur-xl">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span>{loadPhase || 'Cargando axonometría territorial...'}</span>
        </div>
      )}

      {/* Floating Top-Left Controls: Color Editor & Layer Toggles */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-2 pointer-events-auto animate-fade-in">
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Paleta de Materiales & Mar */}
          <button
            onClick={() => setShowRightControls(v => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all shadow-xl flex items-center space-x-1.5 cursor-pointer ${
              showRightControls
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'glass-dark text-white hover:bg-white/20 border-white/20'
            }`}
            title="Abrir Editor de Colores de Materiales (Pasto, Mar Caribe, Pavimento, Edificios, Vías)"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showRightControls ? 'Ocultar Paleta' : '🎨 Cambiar Colores'}</span>
          </button>

          {/* Quick Mar Caribe Presets */}
          <div className="flex items-center space-x-1 glass-dark px-2 py-1 rounded-xl border border-white/10 shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-mono text-slate-300 font-bold pr-1">Mar:</span>
            {[
              { label: 'Celeste Clarito Caribe', color: '#b5ebf5' },
              { label: 'Turquesa Suave', color: '#8dc8d2' },
              { label: 'Celeste Luminoso', color: '#58c4dc' },
              { label: 'Bahía Esmeralda', color: '#4fa8b2' }
            ].map(p => (
              <button
                key={p.color}
                onClick={() => setWaterColor(p.color)}
                style={{ backgroundColor: p.color }}
                className={`w-5 h-5 rounded-lg border-2 transition-transform hover:scale-110 cursor-pointer ${
                  waterColor === p.color ? 'border-white ring-2 ring-emerald-400 scale-105' : 'border-white/40'
                }`}
                title={`Cambiar mar a ${p.label}`}
              />
            ))}
          </div>

          {/* Toggle Árboles SketchUp */}
          <button
            onClick={() => setActiveLayers(prev => ({ ...prev, trees: !prev.trees }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all shadow-xl flex items-center space-x-1.5 cursor-pointer ${
              activeLayers.trees
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                : 'glass-dark text-slate-400 hover:text-white border-white/10'
            }`}
            title="Mostrar u ocultar los árboles de SketchUp en toda la isla"
          >
            <span>{activeLayers.trees ? '🌲 Árboles ON' : '🌱 Árboles OFF'}</span>
          </button>

          {/* Toggle Rutas Marítimas */}
          <button
            onClick={() => setActiveLayers(prev => ({ ...prev, boats: !prev.boats }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all shadow-xl flex items-center space-x-1.5 cursor-pointer ${
              activeLayers.boats
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400'
                : 'glass-dark text-slate-400 hover:text-white border-white/10'
            }`}
            title="Mostrar u ocultar lanchas y rutas náuticas"
          >
            <Ship className="w-3.5 h-3.5" />
            <span>{activeLayers.boats ? 'Lanchas ON' : 'Lanchas OFF'}</span>
          </button>
        </div>

        {/* Panel Editor de Colores Flotante */}
        {showRightControls && (
          <div className="glass-dark p-3.5 rounded-2xl space-y-3 text-white w-72 shadow-2xl border border-white/15 backdrop-blur-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold flex items-center gap-1.5 text-emerald-400">
                <Palette className="w-3.5 h-3.5" />
                <span>Paleta de Materialidad 3D</span>
              </span>
              <button
                onClick={() => setShowRightControls(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mar Caribe */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Mar Caribe / Agua:</span>
                <input
                  type="color"
                  value={waterColor}
                  onChange={(e) => setWaterColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Pasto / Vegetación */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Pasto / Terreno Isla:</span>
                <input
                  type="color"
                  value={grassColor}
                  onChange={(e) => setGrassColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Manzanas / Pavimento */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Piso / Manzanas:</span>
                <input
                  type="color"
                  value={pavementColor}
                  onChange={(e) => setPavementColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Vías / Caminos */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Vías / Asfalto:</span>
                <input
                  type="color"
                  value={roadColor}
                  onChange={(e) => setRoadColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Edificios */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Casas / Edificios:</span>
                <input
                  type="color"
                  value={buildingColor}
                  onChange={(e) => setBuildingColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Cubiertas */}
            <div className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Tejas / Cubiertas:</span>
                <input
                  type="color"
                  value={roofColor}
                  onChange={(e) => setRoofColor(e.target.value)}
                  className="w-7 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
              <button
                onClick={handleSavePermanentColors}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveColorsToast ? '✓ Guardado' : 'Guardar'}</span>
              </button>
              <button
                onClick={handleResetDefaultColors}
                className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-mono text-[11px] flex items-center justify-center space-x-1 cursor-pointer transition-all"
                title="Restablecer colores predeterminados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TOOLTIP & TARJETA INTERACTIVA ANIMADA: PLAN MAESTRO & PARQUE ECOLÓGICO */}
      {/* ========================================================================= */}
      {showMasterplanPanel && (
        <div className="absolute top-4 right-4 z-[450] w-96 max-w-[calc(100vw-2rem)] pointer-events-auto animate-fade-in font-sans">
          <div className="glass-dark rounded-3xl p-5 text-white shadow-2xl border border-white/15 backdrop-blur-2xl transition-all duration-300">
            
            {/* Header con Badge y Botón de Minimizar */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300 shadow-sm animate-pulse">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                    Propuesta Territorial 2026
                  </span>
                  <h3 className="font-bold text-sm text-white">
                    Plan Maestro Tierra Bomba
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowMasterplanPanel(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs font-mono"
                title="Minimizar panel del Plan Maestro"
              >
                ✕
              </button>
            </div>

            {/* Párrafo Introductorio Oficial */}
            <p className="text-[11px] leading-relaxed text-slate-200 mb-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
              El <b>plan maestro</b> representa la articulación territorial de nuestra propuesta: organiza áreas residenciales, equipamiento educativo y espacios colectivos en relación con los asentamientos existentes evaluando la seguridad del suelo, topografía, accesibilidad y condiciones ambientales.
            </p>

            {/* Tabs / Pasos del Tour con Iconos */}
            <div className="grid grid-cols-5 gap-1 mb-3 p-1 rounded-xl bg-black/30 border border-white/5">
              {[
                { label: 'Eje', icon: Home, idx: 0, title: 'Organización' },
                { label: 'Riesgo', icon: ShieldCheck, idx: 1, title: 'Reubicación' },
                { label: 'Rutas', icon: Map, idx: 2, title: 'Senderos' },
                { label: 'Parque', icon: TreePine, idx: 3, title: 'Parque Ecológico' },
                { label: 'Colegio', icon: GraduationCap, idx: 4, title: 'Articulación' },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeMasterplanStep === tab.idx;
                return (
                  <button
                    key={tab.idx}
                    onClick={() => setActiveMasterplanStep(tab.idx)}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-md scale-102' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title={tab.title}
                  >
                    <Icon className="w-3.5 h-3.5 mb-0.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido Dinámico según el Paso Seleccionado */}
            <div className="space-y-2.5 min-h-[140px]">
              {activeMasterplanStep === 0 && (
                <div className="animate-fade-in space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-teal-300 font-bold font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    <span>1. Organización Territorial & Suelo Seguro</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px] leading-snug">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-teal-400 font-bold">➔</span>
                      <span><b>Localización estratégica:</b> Evaluación de seguridad del suelo, topografía (+22m cota resiliente) y accesibilidad.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-teal-400 font-bold">➔</span>
                      <span><b>Disponibilidad de servicios:</b> Proximidad a las actividades cotidianas, pesca responsable y dinámica comunitaria.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeMasterplanStep === 1 && (
                <div className="animate-fade-in space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-rose-300 font-bold font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>2. Reubicación y Mitigación de Riesgo</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px] leading-snug">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-400 font-bold">➔</span>
                      <span><b>Hogares en riesgo:</b> Reubicación respaldada de familias cuyas viviendas no puedan mantenerse seguras por erosión costera (franja 500m).</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-400 font-bold">➔</span>
                      <span><b>Criterio de suelo liberado:</b> Las áreas desalojadas se integran al parque ecológico de conservación y <b>no volverán a ser ocupadas</b>.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeMasterplanStep === 2 && (
                <div className="animate-fade-in space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>3. Senderos Peatonales & Espacio Colectivo</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px] leading-snug">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-cyan-400 font-bold">➔</span>
                      <span><b>Recorridos peatonales claros:</b> Conectan las viviendas con el colegio, plazas colectivas y el muelle de conectividad limpia.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-cyan-400 font-bold">➔</span>
                      <span><b>Gradiente de privacidad:</b> Clara diferenciación entre espacios privados, áreas educativas de acceso controlado y lugares de encuentro común.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeMasterplanStep === 3 && (
                <div className="animate-fade-in space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>4. Visión de Futuro: Parque Ecológico Insular</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px] leading-snug">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">➔</span>
                      <span><b>Barreras naturales:</b> Protección y restauración de ecosistemas costeros (manglares, playas y vegetación nativa frente al mar).</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">➔</span>
                      <span><b>Ecoturismo y pesca:</b> Oportunidades sostenibles para los habitantes sin desplazar a la comunidad.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeMasterplanStep === 4 && (
                <div className="animate-fade-in space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>5. El Colegio como Nodo de Articulación</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px] leading-snug">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-purple-400 font-bold">➔</span>
                      <span><b>Punto de encuentro:</b> Articula la comunidad con el parque ecológico: un lugar desde donde se aprende a cuidar el territorio.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-purple-400 font-bold">➔</span>
                      <span><b>Estructura integrada:</b> Vivienda, educación, espacio público y naturaleza como un <b>mismo sistema simbiótico</b>.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Navegación Siguiente / Anterior */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
              <button
                onClick={() => setActiveMasterplanStep(s => (s > 0 ? s - 1 : 4))}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-mono flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4].map(idx => (
                  <button
                    key={idx}
                    onClick={() => setActiveMasterplanStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeMasterplanStep === idx ? 'bg-teal-400 w-4' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveMasterplanStep(s => (s < 4 ? s + 1 : 0))}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] font-mono flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Botón flotante para reabrir panel si fue cerrado */}
      {!showMasterplanPanel && (
        <button
          onClick={() => setShowMasterplanPanel(true)}
          className="absolute top-4 right-4 z-[400] glass-dark px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-teal-300 border border-teal-400/40 shadow-2xl flex items-center space-x-1.5 hover:bg-white/20 transition-all cursor-pointer animate-fade-in"
        >
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          <span>📍 Ver Plan Maestro & Puntos Clave</span>
        </button>
      )}

      {/* Floating Bottom Center: Orbit & Zoom Instruction Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none hidden md:block">
        <div className="glass-dark px-4 py-2 rounded-2xl text-xs font-mono text-slate-300 flex items-center space-x-4 shadow-xl border border-white/10 backdrop-blur-xl">
          <span className="flex items-center space-x-1.5"><RotateCcw className="w-3.5 h-3.5 text-amber-300" /><span><b>Arrastrar:</b> Girar</span></span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1.5"><Maximize2 className="w-3.5 h-3.5 text-amber-300" /><span><b>Scroll:</b> Zoom</span></span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1.5"><Sliders className="w-3.5 h-3.5 text-amber-300" /><span><b>Clic Derecho:</b> Mover</span></span>
        </div>
      </div>

    </div>
  );
}
