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
  const [selected3DModel, setSelected3DModel] = useState('revit'); // 'revit' (Cartagena + Tierrabomba) | 'masterplan' (BIM Tierrabomba) | 'colegio' | 'vivienda' | 'custom'
  const [wireframe, setWireframe] = useState(false);
  const [explodedView, setExplodedView] = useState(false);

  // Simulación de Tránsito Marítimo y Urbano en Vivo (modulo-08-3d.html)
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(true);
  const isPlayingSimulationRef = useRef(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1.5);
  const simulationSpeedRef = useRef(1.5);
  const cartagenaTerritoryRef = useRef(null);

  // Paleta de Colores Arquitectónicos y Ambientales (Inspirado en modulo-08-3d.html)
  const [waterColor, setWaterColor] = useState('#88a2b5');
  const [roadsColor, setRoadsColor] = useState('#b7babd');
  const [greenColor, setGreenColor] = useState('#4a7856');
  const [showNoiseMap, setShowNoiseMap] = useState(false);
  const [climateMonth, setClimateMonth] = useState(0); // 0 = Ene, 11 = Dic
  const [isPlayingClimate, setIsPlayingClimate] = useState(false);
  
  // Parámetros Solares & Vista Axonométrica a 35°
  const [sunAzimuth, setSunAzimuth] = useState(130);
  const [sunElevation, setSunElevation] = useState(45);
  const [sunIntensity, setSunIntensity] = useState(1.2);
  const [cameraMode, setCameraMode] = useState('orthographic'); // 'orthographic' (Axonométrica a 35°) | 'perspective'

  // Caja de Sección (Corte Axonométrico 3D)
  const [sectionBoxActive, setSectionBoxActive] = useState(false);
  const [sectionLimits, setSectionLimits] = useState({
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: 100,
    zMin: 0,
    zMax: 100,
  });
  const [showRightControls, setShowRightControls] = useState(true);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadPhase, setLoadPhase] = useState('Descargando geometría BIM...');
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
    noise: false,
    grid: false,
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

  // 6 Planos de recorte para la Caja de Sección (Corte Axonométrico 3D)
  const secPlanesRef = useRef({
    xMin: new THREE.Plane(new THREE.Vector3(1, 0, 0), 1e6),
    xMax: new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e6),
    yMin: new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e6),
    yMax: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6),
    zMin: new THREE.Plane(new THREE.Vector3(0, 0, 1), 1e6),
    zMax: new THREE.Plane(new THREE.Vector3(0, 0, -1), 1e6),
  });

  const updateSectionPlanes = (limits, active) => {
    const planes = secPlanesRef.current;
    if (!active) {
      planes.xMin.constant = 1e6;
      planes.xMax.constant = 1e6;
      planes.yMin.constant = 1e6;
      planes.yMax.constant = 1e6;
      planes.zMin.constant = 1e6;
      planes.zMax.constant = 1e6;
      return;
    }
    const minX = -19, maxX = 19;
    const minY = -2, maxY = 8;
    const minZ = -19, maxZ = 19;

    const cutXMin = minX + (limits.xMin / 100) * (maxX - minX);
    const cutXMax = minX + (limits.xMax / 100) * (maxX - minX);
    const cutYMin = minY + (limits.yMin / 100) * (maxY - minY);
    const cutYMax = minY + (limits.yMax / 100) * (maxY - minY);
    const cutZMin = minZ + (limits.zMin / 100) * (maxZ - minZ);
    const cutZMax = minZ + (limits.zMax / 100) * (maxZ - minZ);

    planes.xMin.constant = -cutXMin;
    planes.xMax.constant = cutXMax;
    planes.yMin.constant = -cutYMin;
    planes.yMax.constant = cutYMax;
    planes.zMin.constant = -cutZMin;
    planes.zMax.constant = cutZMax;
  };

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

    if (modelType === 'revit') {
      setIsLoadingFile(true);
      setLoadProgress(15);
      setLoadPhase('Cargando Catastro Oficial AMB Cartagena (MAGNA-SIRGAS)...');

      const bgColor = 0x0b0c0f;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.Fog(bgColor, 180, 550);

      const clipPlanesArray = [
        secPlanesRef.current.xMin,
        secPlanesRef.current.xMax,
        secPlanesRef.current.yMin,
        secPlanesRef.current.yMax,
        secPlanesRef.current.zMin,
        secPlanesRef.current.zMax,
      ];

      const rootContainer = new THREE.Group();
      
      const territory = await buildCartagenaTerritoryScene({
        sceneRoot: rootContainer,
        activeLayers,
        colors: {
          water: waterColor,
          roads: roadsColor,
          terrain: greenColor,
          buildings: '#ffffff',
          roofs: '#b5714a',
          trees: '#5c8f52',
          manzanas: '#8a8f96',
          vehicles: '#e2635a',
          boats: '#24c8bd',
        },
        clippingPlanes: clipPlanesArray,
        onProgress: (p, msg) => {
          setLoadProgress(p);
          setLoadPhase(msg);
        }
      });

      cartagenaTerritoryRef.current = territory;
      if (territory.setNoiseMapVisible) territory.setNoiseMapVisible(showNoiseMap);
      if (territory.setClimateMonth) territory.setClimateMonth(climateMonth);

      // Centrar y encuadrar todo el sistema de la bahía (Cartagena - Tierrabomba)
      rootContainer.position.set(0, 0, 0);

      scene.add(rootContainer);
      currentModelGroupRef.current = rootContainer;
      setLoadProgress(100);
      setIsLoadingFile(false);
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
      setIsLoadingFile(true);
      setLoadProgress(15);
      setLoadPhase('Cargando Masterplan BIM Revit (Tierrabomba)...');

      const bgColor = 0x0b0c0f;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.Fog(bgColor, 160, 450);

      const gltfLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      gltfLoader.setDRACOLoader(dracoLoader);

      const basePath = import.meta.env.BASE_URL || '/';
      const modelUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}models/tierrabomba_revit.glb`;

      const clipPlanesArray = [
        secPlanesRef.current.xMin,
        secPlanesRef.current.xMax,
        secPlanesRef.current.yMin,
        secPlanesRef.current.yMax,
        secPlanesRef.current.zMin,
        secPlanesRef.current.zMax,
      ];

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

          objectsRef.current.revitTerrain = [];
          objectsRef.current.revitWalls = [];
          objectsRef.current.revitBuildings = [];

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
                  color: 0x477857,
                  roughness: 0.85,
                  metalness: 0.02,
                  side: THREE.DoubleSide,
                  clippingPlanes: clipPlanesArray,
                });
                child.renderOrder = 1;
                child.userData.layer = 'terrain';
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
                  clippingPlanes: clipPlanesArray,
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
                  clippingPlanes: clipPlanesArray,
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
    scene.background = new THREE.Color(0x0b0c0f);
    scene.fog = new THREE.Fog(0x0b0c0f, 160, 450);
    sceneRef.current = scene;

    // Cámara Ortográfica para Proyección Axonométrica Paralela a 35° (sin distorsión de perspectiva)
    const aspect = container.clientWidth / container.clientHeight;
    let viewSize = selected3DModel === 'revit' ? 130 : 22;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      2000
    );
    cameraRef.current = camera;

    // Renderer con soporte para Caja de Sección (Local Clipping) y sRGB
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.localClippingEnabled = true;

    const clipPlanesArray = [
      secPlanesRef.current.xMin,
      secPlanesRef.current.xMax,
      secPlanesRef.current.yMin,
      secPlanesRef.current.yMax,
      secPlanesRef.current.zMin,
      secPlanesRef.current.zMax,
    ];
    renderer.clippingPlanes = clipPlanesArray;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Iluminación Solar con Acimut y Altura
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.85);
    scene.add(hemiLight);

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
    // Ángulo axonométrico panorámico de Cartagena mirando hacia el noreste
    let spherical = selected3DModel === 'revit'
      ? { radius: 220, theta: -Math.PI * 0.40, phi: Math.PI * 45 / 180 }
      : { radius: 45, theta: Math.PI / 4, phi: Math.PI * 55 / 180 };
    let panTarget = selected3DModel === 'revit'
      ? { x: 5, y: 0, z: -10 }
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
        // Rotación alrededor de la escena (Orbit)
        spherical.theta -= deltaX * 0.007;
        spherical.phi = Math.max(0.1, Math.min(Math.PI / 2.02, spherical.phi - deltaY * 0.007));
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

    // Animation Loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (cartagenaTerritoryRef.current && isPlayingSimulationRef.current) {
        cartagenaTerritoryRef.current.update(simulationSpeedRef.current);
      }
      if (currentModelGroupRef.current && !isDragging && selected3DModel !== 'revit') {
        currentModelGroupRef.current.rotation.y += 0.0005; // subtle idle rotation for modules
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

  // Sync colors with 3D model
  useEffect(() => {
    if (cartagenaTerritoryRef.current?.setWaterColor) {
      cartagenaTerritoryRef.current.setWaterColor(waterColor);
    }
  }, [waterColor]);

  useEffect(() => {
    if (cartagenaTerritoryRef.current?.setRoadsColor) {
      cartagenaTerritoryRef.current.setRoadsColor(roadsColor);
    }
  }, [roadsColor]);

  useEffect(() => {
    if (cartagenaTerritoryRef.current?.setGreenColor) {
      cartagenaTerritoryRef.current.setGreenColor(greenColor);
    }
  }, [greenColor]);

  useEffect(() => {
    if (cartagenaTerritoryRef.current?.setNoiseMapVisible) {
      cartagenaTerritoryRef.current.setNoiseMapVisible(showNoiseMap);
    }
  }, [showNoiseMap]);

  useEffect(() => {
    if (cartagenaTerritoryRef.current?.setClimateMonth) {
      cartagenaTerritoryRef.current.setClimateMonth(climateMonth);
    }
  }, [climateMonth]);

  // Climate animation timer (cycles through 12 months)
  useEffect(() => {
    if (!isPlayingClimate) return;
    const interval = setInterval(() => {
      setClimateMonth((prev) => (prev + 1) % 12);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlayingClimate]);

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

  // Update Sun Lighting with Azimuth & Elevation
  useEffect(() => {
    const light = objectsRef.current.dirLight;
    if (!light) return;
    const radAz = (sunAzimuth * Math.PI) / 180;
    const radEl = (sunElevation * Math.PI) / 180;
    const dist = 90;
    light.position.x = dist * Math.cos(radAz) * Math.cos(radEl);
    light.position.y = dist * Math.sin(radEl);
    light.position.z = dist * Math.sin(radAz) * Math.cos(radEl);
    light.intensity = sunIntensity;
  }, [sunAzimuth, sunElevation, sunIntensity]);

  // Update Section Box Clipping Planes in real-time
  useEffect(() => {
    updateSectionPlanes(sectionLimits, sectionBoxActive);
  }, [sectionLimits, sectionBoxActive]);

  // Restablecer Vista Axonométrica a 35° (proyección paralela)
  const resetAxonometricView = () => {
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

    const spherical = { radius: 45, theta: Math.PI / 4, phi: Math.PI * 55 / 180 };
    const panTarget = { x: 0, y: 1.5, z: 0 };
    camera.position.x = panTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = panTarget.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = panTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(panTarget.x, panTarget.y, panTarget.z);
  };

  // Vista Panorámica Aérea de toda la Bahía y Cartagena (Encuadre Urbano Completo)
  const setBirdEyeView = () => {
    if (!cameraRef.current || !mountRef.current) return;
    const container = mountRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = 130;
    const camera = cameraRef.current;
    if (camera.isOrthographicCamera) {
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    }

    const spherical = { radius: 220, theta: -Math.PI * 0.40, phi: Math.PI * 45 / 180 };
    const panTarget = { x: 5, y: 0, z: -10 };
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
      modelGroup.position.x = -center.x * scale;
      modelGroup.position.y = -box.min.y * scale + 0.05;
      modelGroup.position.z = -center.z * scale;

      const clipPlanesArray = [
        secPlanesRef.current.xMin,
        secPlanesRef.current.xMax,
        secPlanesRef.current.yMin,
        secPlanesRef.current.yMax,
        secPlanesRef.current.zMin,
        secPlanesRef.current.zMax,
      ];

      scene.background = new THREE.Color(0x0b0c0f);
      scene.fog = new THREE.Fog(0x0b0c0f, 160, 450);

      const rootContainer = new THREE.Group();
      rootContainer.add(modelGroup);

      objectsRef.current.revitTerrain = [];
      objectsRef.current.revitWalls = [];
      objectsRef.current.revitBuildings = [];

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
              color: 0x477857,
              roughness: 0.85,
              metalness: 0.02,
              side: THREE.DoubleSide,
              clippingPlanes: clipPlanesArray,
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
              clippingPlanes: clipPlanesArray,
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
              clippingPlanes: clipPlanesArray,
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

      {/* Loading Model Overlay */}
      {isLoadingFile && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-lg z-[500] flex flex-col items-center justify-center p-6 text-white pointer-events-none animate-fade-in">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-teal-300 animate-pulse" />
          </div>

          <h3 className="font-bold text-xl text-white tracking-tight">
            {selected3DModel === 'revit' ? 'Cargando Territorio Cartagena & Tierrabomba' : 'Cargando Modelo 3D BIM'}
          </h3>
          <p className="text-xs text-teal-200/80 font-mono mt-1 text-center">
            {loadPhase || 'Optimizando geometría 3D a 60 FPS...'}
          </p>

          {/* Real-time Progress Bar */}
          <div className="w-72 mt-5 space-y-2">
            <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
              <div 
                className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${Math.max(8, loadProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>{loadProgress > 0 ? `${loadProgress}%` : 'Conectando...'}</span>
              <span className="text-teal-300 font-bold">60 FPS WebGL</span>
            </div>
          </div>
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

      {/* Floating Left: Interactive Layer Toggles */}
      <div className="absolute top-24 left-4 z-[400] glass-dark p-3.5 rounded-2xl space-y-2.5 pointer-events-auto text-white w-64 shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Capas 3D Visibles
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
            {selected3DModel === 'revit' ? 'Catastro AMB (EPSG:9377)' : selected3DModel === 'masterplan' ? 'Masterplan BIM' : selected3DModel === 'custom' ? 'Revit Custom' : 'Módulo BIM'}
          </span>
        </div>

        <div className="space-y-1.5">
          {selected3DModel === 'revit' && (
            <>
              {/* Capa Mar & Bahía */}
              <button
                onClick={() => toggleLayer('water')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.water 
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Bahía & Mar Caribe</span>
                    <span className="text-[9px] text-blue-400/80 font-normal">Plano Hidrográfico AMB</span>
                  </div>
                </div>
                {activeLayers.water ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Topografía */}
              <button
                onClick={() => toggleLayer('terrain')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.terrain 
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#477857] shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Topografía & Meseta</span>
                    <span className="text-[9px] text-emerald-400/80 font-normal">Isla Tierra Bomba (+22m)</span>
                  </div>
                </div>
                {activeLayers.terrain ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Vías */}
              <button
                onClick={() => toggleLayer('walls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.walls 
                    ? 'bg-slate-800/80 text-slate-200 border border-slate-400/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 shadow-sm border border-slate-400" />
                  <div>
                    <span className="block font-bold">Red Vial & Ejes</span>
                    <span className="text-[9px] text-slate-400 font-normal">Nomenclaturavial.shp</span>
                  </div>
                </div>
                {activeLayers.walls ? <Eye className="w-3.5 h-3.5 text-slate-200" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Edificaciones & Manzanas Catastrales */}
              <button
                onClick={() => toggleLayer('buildings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.buildings 
                    ? 'bg-slate-800/80 text-teal-300 border border-teal-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-slate-600 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Edificaciones & Masas</span>
                    <span className="text-[9px] text-slate-400 font-normal">Construccion.shp & Manzanas</span>
                  </div>
                </div>
                {activeLayers.buildings ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Lanchas en Vivo */}
              <button
                onClick={() => toggleLayer('boats')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.boats 
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-sm animate-pulse" />
                  <div>
                    <span className="block font-bold">Lanchas en Vivo</span>
                    <span className="text-[9px] text-cyan-400/80 font-normal">3 Rutas Marítimas</span>
                  </div>
                </div>
                {activeLayers.boats ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Tránsito Vehicular */}
              <button
                onClick={() => toggleLayer('vehicles')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.vehicles 
                    ? 'bg-amber-950/50 text-amber-300 border border-amber-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Tránsito Vehicular</span>
                    <span className="text-[9px] text-amber-400/80 font-normal">Flujo en Avenidas</span>
                  </div>
                </div>
                {activeLayers.vehicles ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa Vegetación */}
              <button
                onClick={() => toggleLayer('trees')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.trees 
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-600/40 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Árboles & Manglares</span>
                    <span className="text-[9px] text-emerald-400/80 font-normal">Capa Botánica</span>
                  </div>
                </div>
                {activeLayers.trees ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {selected3DModel === 'masterplan' && (
            <>
              {/* Capa 1: Topografía BIM */}
              <button
                onClick={() => toggleLayer('terrain')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.terrain 
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#477857] shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Topografía Insular</span>
                    <span className="text-[9px] text-emerald-400/80 font-normal">Relieve Verde Sólido</span>
                  </div>
                </div>
                {activeLayers.terrain ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa 2: Vías & Muros BIM */}
              <button
                onClick={() => toggleLayer('walls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.walls 
                    ? 'bg-slate-800/80 text-slate-200 border border-slate-400/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 shadow-sm border border-slate-400" />
                  <div>
                    <span className="block font-bold">Vías & Muros</span>
                    <span className="text-[9px] text-slate-400 font-normal">Trazado Blanco Nítido</span>
                  </div>
                </div>
                {activeLayers.walls ? <Eye className="w-3.5 h-3.5 text-slate-200" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Capa 3: Edificaciones y Masas BIM */}
              <button
                onClick={() => toggleLayer('buildings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.buildings 
                    ? 'bg-slate-800/80 text-teal-300 border border-teal-500/50 shadow-sm' 
                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-slate-600 shrink-0 shadow-sm" />
                  <div>
                    <span className="block font-bold">Edificaciones & Caserío</span>
                    <span className="text-[9px] text-slate-400 font-normal">Grafito Arquitectónico</span>
                  </div>
                </div>
                {activeLayers.buildings ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {selected3DModel === 'custom' && (
            <>
              <button
                onClick={() => toggleLayer('terrain')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.terrain ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/50' : 'bg-slate-900/50 text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#477857] shrink-0" />
                  <span>Topografía</span>
                </div>
                {activeLayers.terrain ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('walls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.walls ? 'bg-slate-800/80 text-slate-200 border border-slate-400/50' : 'bg-slate-900/50 text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 border border-slate-400" />
                  <span>Vías & Muros</span>
                </div>
                {activeLayers.walls ? <Eye className="w-3.5 h-3.5 text-slate-200" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => toggleLayer('buildings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  activeLayers.buildings ? 'bg-slate-800/80 text-teal-300 border border-teal-500/50' : 'bg-slate-900/50 text-slate-500 line-through'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-slate-600 shrink-0" />
                  <span>Edificaciones</span>
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
        </div>

        {/* Paleta de Colores del Territorio (modulo-08-3d.html) */}
        {selected3DModel === 'revit' && (
          <div className="pt-2.5 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-teal-400" />
                Color del Territorio
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Color del agua</span>
              <input
                type="color"
                value={waterColor}
                onChange={(e) => setWaterColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Color de las vías</span>
              <input
                type="color"
                value={roadsColor}
                onChange={(e) => setRoadsColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Color de lo verde</span>
              <input
                type="color"
                value={greenColor}
                onChange={(e) => setGreenColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
              />
            </div>

            {/* Botón Mapa de Ruido */}
            <div className="pt-1.5">
              <button
                onClick={() => setShowNoiseMap(!showNoiseMap)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  showNoiseMap
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{showNoiseMap ? '🔊 Ocultar mapa de ruido' : '🔊 Mostrar mapa de ruido'}</span>
              </button>
            </div>

            {/* Reloj Climático Anual (Marea de Leva / Bahía) */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Reloj climático</span>
                </span>
                <span className="text-[#24c8bd] font-bold">
                  {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][climateMonth]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="11"
                step="1"
                value={climateMonth}
                onChange={(e) => setClimateMonth(Number(e.target.value))}
                className="w-full accent-[#24c8bd] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <button
                onClick={() => setIsPlayingClimate(!isPlayingClimate)}
                className={`w-full py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isPlayingClimate
                    ? 'bg-[#24c8bd] text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isPlayingClimate ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlayingClimate ? '⏸ Pausar ciclo' : '▶ Reproducir año completo'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Caja de Sección / Corte Axonométrico 3D */}
        <div className="pt-2.5 border-t border-white/10 space-y-2.5">
          <button
            onClick={() => setSectionBoxActive(!sectionBoxActive)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              sectionBoxActive
                ? 'bg-[#24c8bd] text-slate-950 ring-2 ring-[#24c8bd]/50 font-black'
                : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-white/10'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{sectionBoxActive ? '✂️ Desactivar caja de sección' : '✂️ Activar caja de sección'}</span>
          </button>

          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
            {sectionBoxActive 
              ? 'El corte ya está activo — mueve cualquiera de los 6 límites y el modelo se corta al instante.'
              : 'Activa la caja para generar cortes transversales y longitudinales sobre el modelo.'}
          </p>

          {/* 6 Sliders de Corte */}
          <div className={`space-y-2 transition-opacity ${sectionBoxActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {[
              { key: 'xMin', label: 'X mínimo', val: sectionLimits.xMin },
              { key: 'xMax', label: 'X máximo', val: sectionLimits.xMax },
              { key: 'yMin', label: 'Y mínimo (piso)', val: sectionLimits.yMin },
              { key: 'yMax', label: 'Y máximo (altura)', val: sectionLimits.yMax },
              { key: 'zMin', label: 'Z mínimo', val: sectionLimits.zMin },
              { key: 'zMax', label: 'Z máximo', val: sectionLimits.zMax },
            ].map(({ key, label, val }) => (
              <div key={key} className="space-y-0.5">
                <div className="flex justify-between text-[10.5px] font-mono text-slate-300">
                  <span>{label}</span>
                  <span className="text-[#24c8bd] font-bold">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => setSectionLimits(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="w-full accent-[#24c8bd] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            ))}

            <button
              onClick={() => setSectionLimits({ xMin: 0, xMax: 100, yMin: 0, yMax: 100, zMin: 0, zMax: 100 })}
              className="w-full py-1 text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800/60 rounded-lg border border-white/5 transition-all mt-1"
            >
              Restablecer límites de corte
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Center: Live Transit Simulation Controls Bar (When in Territorial Revit mode) */}
      {selected3DModel === 'revit' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[400] glass-dark px-4 py-2.5 rounded-2xl flex items-center space-x-3 text-xs font-mono shadow-2xl border border-white/10 backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center space-x-2 border-r border-white/10 pr-3">
            <button
              onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isPlayingSimulation 
                  ? 'bg-[#24c8bd] text-slate-950 font-bold shadow-lg shadow-[#24c8bd]/30 hover:scale-105' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={isPlayingSimulation ? 'Pausar Simulación Marítima y Urbana' : 'Reanudar Simulación'}
            >
              {isPlayingSimulation ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <span className="text-slate-200 text-[11px] font-bold hidden sm:inline">
              {isPlayingSimulation ? 'Simulación en Vivo' : 'Pausada'}
            </span>
          </div>

          <div className="flex items-center space-x-1 border-r border-white/10 pr-3">
            {[
              { speed: 0.5, label: '0.5x' },
              { speed: 1.5, label: '1x' },
              { speed: 3.0, label: '2x' },
              { speed: 5.0, label: '4x' },
            ].map(({ speed, label }) => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  simulationSpeed === speed
                    ? 'bg-[#24c8bd] text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-[10.5px] text-[#24c8bd]">
            <Ship className="w-3.5 h-3.5 animate-pulse text-[#24c8bd] shrink-0" />
            <span className="hidden md:inline font-sans text-slate-300">
              3 Rutas Marítimas Activas (Bodeguita – Punta Arenas – Bocachica)
            </span>
          </div>
        </div>
      )}

      {/* Floating Bottom Left: Architectural Legend (matching reference) */}
      <div className="absolute bottom-6 left-4 z-[400] glass-dark p-3.5 rounded-2xl pointer-events-auto text-white shadow-xl border border-white/10 space-y-1.5 text-xs font-mono max-h-[38vh] overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          {selected3DModel === 'revit' ? 'Leyenda Territorial // AMB' : 'Leyenda Arquitectónica'}
        </div>
        {selected3DModel === 'revit' ? (
          <>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e2635a] shrink-0 shadow-sm" />
              <span className="text-slate-200">Vehículo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#24c8bd] shrink-0 shadow-sm animate-pulse" />
              <span className="text-slate-200">Lancha en ruta</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-400 shadow-sm" style={{ backgroundColor: roadsColor }} />
              <span className="text-slate-200">Vía (Nomenclaturavial.shp)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 border border-slate-600 shadow-sm" />
              <span className="text-slate-200">Edificio (Construccion.shp — 6.719)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5c8f52] shrink-0 shadow-sm" />
              <span className="text-slate-200">Árbol / Manglar</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: waterColor }} />
              <span className="text-slate-200">Cuerpo de agua (Bahía & Mar)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8a8f96] shrink-0 shadow-sm border border-slate-500" />
              <span className="text-slate-200">Manzana (Manzana.shp — 2.419)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: greenColor }} />
              <span className="text-slate-200">Parque / Zona verde (+22m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b5714a] shrink-0 shadow-sm" />
              <span className="text-slate-200">Techo a dos aguas / Colonial</span>
            </div>
            {showNoiseMap && (
              <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0 shadow-sm animate-pulse" />
                <span className="text-red-300 font-bold">Isófonas de Ruido (&gt; 65 dB)</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 border border-slate-400 shadow-sm" />
              <span className="text-slate-200">Vías & Muros</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] shrink-0 border border-slate-600 shadow-sm" />
              <span className="text-slate-200">Edificaciones & Caserío</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#477857] shrink-0 shadow-sm" />
              <span className="text-slate-200">Topografía / Relieve</span>
            </div>
          </>
        )}
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
