import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { buildCartagenaTerritoryScene } from '../utils/cartagena3D.js';
import { createSkyEnvironment, BASE as TB_BASE } from '../utils/realTerritory.js';
import PlanningToolbar from './PlanningToolbar.jsx';
import DiagnosticoColegio from './DiagnosticoColegio.jsx';
import {
  ZONE_TYPES, loadList as loadPlanList, saveList as savePlanList, createRoadMaterials,
  buildRoadObject, buildZoneObject, buildDraftObject, disposeObject
} from '../utils/planningTools.js';
import { createSkyDome } from '../utils/caribeWater.js';
import TierrabombaFutureModal from './TierrabombaFutureModal.jsx';
import pastoTextureImg from '../assets/textura_pasto_m5.png';
import waterTextureImg from '../assets/textura_agua_m5.jpg';
import pisoTextureImg from '../assets/textura_piso_m5.png';
import viaTextureImg from '../assets/textura_via.jpg';
import { 
  loadCleanTreeTemplate, 
  buildTreeObject, 
  getSavedTrees, 
  saveTrees, 
  STORAGE_KEY_CATASTRO 
} from '../utils/treeTool.js';
import TreePlacementToolbar from './TreePlacementToolbar.jsx';
import RutasLanchasPanel from './RutasLanchasPanel.jsx';
import {
  STORAGE_RUTAS, STORAGE_PUNTOS, ROUTE_TYPES, POINT_TYPES, loadList as loadRutasList, saveList as saveRutasList, createRoutesLayer
} from '../utils/rutasLanchas.js';
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
  ShieldCheck
} from 'lucide-react';

const TreeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2a1 1 0 0 1-.8-1.7L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17z" />
    <path d="M12 22v-3" />
  </svg>
);

class LocalSafeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("Local widget error caught:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white/95 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 shadow-xl font-sans w-72">
          <p className="font-semibold text-emerald-800 flex items-center gap-1">🌱 Modo Vegetación Activo</p>
          <p className="text-[11px] text-slate-600 mt-1">Haz clic en el terreno verde de la isla para colocar árboles.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const DEFAULT_M5_PALETTE = {
  grass: '#ffffff',
  water: '#1ea4c8', // Turquesa caribeño (igual al mar del módulo 05)
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
      parsed.water = '#1ea4c8';
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
  const [waterColor, setWaterColor] = useState('#1ea4c8');
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

  // Herramienta de Vegetación Interactiva y Persistente (Tierra Bomba & Catastro)
  const [catastroTreesList, setCatastroTreesList] = useState(() => {
    try {
      const saved = getSavedTrees(STORAGE_KEY_CATASTRO);
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  });
  const [isPlantingTree, setIsPlantingTree] = useState(false);

  // Recorridos de lanchas Tierra Bomba <-> Cartagena y puntos de vertimiento (mercurio)
  const [showRutas, setShowRutas] = useState(false);
  const [rutasMode, setRutasMode] = useState('none'); // 'none' | 'ruta' | 'punto'
  const [routeType, setRouteType] = useState('residuos');
  const [pointType, setPointType] = useState('mercurio');
  const [rutaName, setRutaName] = useState('');
  const [rutaDraft, setRutaDraft] = useState([]);
  const [rutas, setRutas] = useState(() => loadRutasList(STORAGE_RUTAS));
  const [puntosHg, setPuntosHg] = useState(() => loadRutasList(STORAGE_PUNTOS));
  const [routesNonce, setRoutesNonce] = useState(0);

  // Zonificación y vías dibujadas (mismo panel que el módulo 03)
  const M2_ROADS = 'tesis_m2_roads_v1', M2_ZONES = 'tesis_m2_zones_v1';
  const [showPlan, setShowPlan] = useState(false);
  const [showDiagColegio, setShowDiagColegio] = useState(false);
  const [planMode, setPlanMode] = useState('none'); // 'none' | 'road' | 'zone'
  const [zoneType, setZoneType] = useState('vivienda');
  const [zoneName, setZoneName] = useState('');
  const [roadWidth, setRoadWidth] = useState(0.6);
  const [planDraft, setPlanDraft] = useState([]);
  const [planRoads, setPlanRoads] = useState(() => loadPlanList(M2_ROADS));
  const [planZones, setPlanZones] = useState(() => loadPlanList(M2_ZONES));
  const planGroupRef = useRef(null);
  const planDraftGroupRef = useRef(null);
  const planMatsRef = useRef(null);
  const planRef = useRef({});
  planRef.current = { mode: planMode, draft: planDraft, zoneType, zoneName, roadWidth, roads: planRoads, zones: planZones };
  const planHandlerRef = useRef(null);
  const planFinishRef = useRef(null);
  const routesLayerRef = useRef(null);
  const rutasRef = useRef({});
  rutasRef.current = { mode: rutasMode, draft: rutaDraft, routeType, pointType, name: rutaName, rutas, puntosHg };
  const [treePlantScale, setTreePlantScale] = useState(1.0);
  const [selectedCatastroTreeId, setSelectedCatastroTreeId] = useState(null);
  const [showTreePlacementToolbar, setShowTreePlacementToolbar] = useState(false);

  const isPlantingTreeRef = useRef(isPlantingTree);
  isPlantingTreeRef.current = isPlantingTree;
  const treePlantScaleRef = useRef(treePlantScale);
  treePlantScaleRef.current = treePlantScale;
  const onAddCatastroTreeRef = useRef(null);
  const onSelectCatastroTreeRef = useRef(null);
  const treeTemplateRef = useRef(null);

  const safeCatastroList = Array.isArray(catastroTreesList) ? catastroTreesList : [];
  const selectedCatastroTree = safeCatastroList.find((t) => t && t.id === selectedCatastroTreeId) || null;

  const handleAddCatastroTree = (newTree) => {
    const updated = [...safeCatastroList, newTree];
    setCatastroTreesList(updated);
    saveTrees(STORAGE_KEY_CATASTRO, updated);
    setSelectedCatastroTreeId(newTree.id);

    const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
    if (vegGroup) {
      if (treeTemplateRef.current) {
        const newObj = buildTreeObject(treeTemplateRef.current, newTree);
        newObj.userData.isCustomPlacedTree = true;
        vegGroup.add(newObj);
      } else {
        const basePath = import.meta.env.BASE_URL || '/';
        loadCleanTreeTemplate(basePath).then((tpl) => {
          treeTemplateRef.current = tpl;
          const newObj = buildTreeObject(tpl, newTree);
          newObj.userData.isCustomPlacedTree = true;
          vegGroup.add(newObj);
        });
      }
    }
  };
  onAddCatastroTreeRef.current = handleAddCatastroTree;

  const handleCatastroTreeScaleChange = (treeId, newScale) => {
    const updated = safeCatastroList.map((t) => (t.id === treeId ? { ...t, scale: newScale } : t));
    setCatastroTreesList(updated);
    saveTrees(STORAGE_KEY_CATASTRO, updated);

    const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
    if (vegGroup) {
      const obj = vegGroup.children.find(c => c.userData?.treeId === treeId);
      if (obj) {
        const s = newScale * 0.055;
        obj.scale.set(s, s, s);
        if (obj.userData) obj.userData.scale = newScale;
      }
    }
  };

  const handleCatastroTreeDelete = (treeId) => {
    const updated = safeCatastroList.filter((t) => t.id !== treeId);
    setCatastroTreesList(updated);
    saveTrees(STORAGE_KEY_CATASTRO, updated);
    setSelectedCatastroTreeId(null);

    const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
    if (vegGroup) {
      const obj = vegGroup.children.find(c => c.userData?.treeId === treeId);
      if (obj) vegGroup.remove(obj);
    }
  };

  const handleCatastroTreeClearAll = () => {
    if (window.confirm('¿Deseas eliminar todos los árboles personalizados colocados en la isla?')) {
      setCatastroTreesList([]);
      saveTrees(STORAGE_KEY_CATASTRO, []);
      setSelectedCatastroTreeId(null);

      const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
      if (vegGroup) {
        const toRemove = vegGroup.children.filter(c => c.userData?.isCustomPlacedTree);
        toRemove.forEach(c => vegGroup.remove(c));
      }
    }
  };

  onSelectCatastroTreeRef.current = (id) => {
    setSelectedCatastroTreeId(id);
  };

  const syncCatastroTrees = (list, tpl, grp) => {
    if (!grp || !tpl) return;
    const existing = new Map();
    grp.children.forEach((c) => {
      // Sincronizar únicamente árboles plantados por el usuario, protegiendo los nativos de la isla
      if (c.userData?.isCustomPlacedTree) existing.set(c.userData.treeId, c);
    });
    const curIds = new Set(list.map((t) => t.id));
    existing.forEach((obj, id) => {
      if (!curIds.has(id)) grp.remove(obj);
    });
    list.forEach((tData) => {
      const obj = existing.get(tData.id);
      if (obj) {
        const s = (tData.scale || 1.0) * 0.055;
        obj.scale.set(s, s, s);
      } else {
        const newObj = buildTreeObject(tpl, tData);
        newObj.userData.isCustomPlacedTree = true;
        grp.add(newObj);
      }
    });
  };

  // Pre-carga inmediata de la plantilla 3D de árbol en el montaje inicial
  useEffect(() => {
    const basePath = import.meta.env.BASE_URL || '/';
    loadCleanTreeTemplate(basePath).then((tpl) => {
      treeTemplateRef.current = tpl;
      const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
      if (vegGroup) {
        syncCatastroTrees(safeCatastroList, tpl, vegGroup);
      }
    }).catch(err => {
      console.warn("Could not load tree template:", err);
    });
  }, []);

  // Sincronización continua de la lista de árboles con el grupo 3D
  useEffect(() => {
    const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
    if (!vegGroup) return;

    if (treeTemplateRef.current) {
      syncCatastroTrees(safeCatastroList, treeTemplateRef.current, vegGroup);
    } else {
      const basePath = import.meta.env.BASE_URL || '/';
      loadCleanTreeTemplate(basePath).then((tpl) => {
        treeTemplateRef.current = tpl;
        syncCatastroTrees(safeCatastroList, tpl, vegGroup);
      }).catch(err => {
        console.warn("Could not load tree template:", err);
      });
    }
  }, [catastroTreesList]);

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
    walls: false,
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
    // el cielo físico (reflejo del mar) solo existe en las escenas territoriales
    if (scene.userData.skyDome && scene.userData.skyDome.parent) scene.remove(scene.userData.skyDome);

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

        if (treeTemplateRef.current && territory.vegetationGroup) {
          syncCatastroTrees(safeCatastroList, treeTemplateRef.current, territory.vegetationGroup);
        }

        const box = new THREE.Box3().setFromObject(rootContainer);
        const center = box.getCenter(new THREE.Vector3());
        rootContainer.position.set(-center.x, -box.min.y, -center.z);

        scene.add(rootContainer);
        try {
          if (!scene.userData.skyEnv) scene.userData.skyEnv = createSkyEnvironment(rendererRef.current);
          scene.environment = scene.userData.skyEnv;
          scene.environmentIntensity = 0.9;
          if (!scene.userData.skyDome) scene.userData.skyDome = createSkyDome(1400);
          if (!scene.userData.skyDome.parent) scene.add(scene.userData.skyDome);
        } catch (e) {
          console.warn('Entorno de cielo no disponible:', e);
        }
        currentModelGroupRef.current = rootContainer;
        if (routesLayerRef.current) routesLayerRef.current.dispose();
        routesLayerRef.current = createRoutesLayer(rootContainer, () => {
          const c = mountRef.current;
          return [c ? c.clientWidth : 800, c ? c.clientHeight : 600];
        });
        setRoutesNonce((n) => n + 1);
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

    let startMouseDownPos = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      dragButton = e.button;
      prevMousePos = { x: e.clientX, y: e.clientY };
      startMouseDownPos = { x: e.clientX, y: e.clientY };
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

    const onMouseUp = (e) => {
      isDragging = false;
      const deltaDist = Math.hypot(e.clientX - startMouseDownPos.x, e.clientY - startMouseDownPos.y);
      if (deltaDist < 12) {
        // Clic en la escena 3D
        const rect = domElem.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // 0a. Modo vías y zonas: marcar un punto sobre el plano del mapa
        if (planRef.current.mode !== 'none' && currentModelGroupRef.current && planHandlerRef.current) {
          const root = currentModelGroupRef.current;
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(root.position.y + 0.05));
          const hit = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(plane, hit)) {
            root.worldToLocal(hit);
            planHandlerRef.current(hit.x, hit.z);
          }
          return;
        }

        // 0. Modo recorridos de lanchas: marcar un punto sobre el plano del mapa
        if (rutasRef.current.mode !== 'none' && currentModelGroupRef.current && rutasHandlerRef.current) {
          const root = currentModelGroupRef.current;
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(root.position.y + 0.05));
          const hit = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(plane, hit)) {
            root.worldToLocal(hit);
            rutasHandlerRef.current(hit.x, hit.z);
          }
          return;
        }

        // 1. Detectar clic en un árbol existente
        const vegGroup = cartagenaTerritoryRef.current?.vegetationGroup;
        if (vegGroup && vegGroup.children.length > 0) {
          const treeHits = raycaster.intersectObjects(vegGroup.children, true);
          if (treeHits.length > 0) {
            let cur = treeHits[0].object;
            while (cur && !cur.userData?.treeId && cur.parent && cur.parent !== vegGroup) {
              cur = cur.parent;
            }
            if (cur?.userData?.treeId) {
              if (onSelectCatastroTreeRef.current) onSelectCatastroTreeRef.current(cur.userData.treeId);
              return;
            }
          }
        }

        // 2. Si el modo plantar está activo, raycast contra el territorio
        if (isPlantingTreeRef.current && currentModelGroupRef.current) {
          const hits = raycaster.intersectObjects(currentModelGroupRef.current.children, true);
          const validHit = hits.find((h) => {
            const name = (h.object.name || '').toLowerCase();
            return !name.includes('water') && !name.includes('noise') && !name.includes('beacon') && !h.object.userData?.isCustomTree;
          });

          if (validHit && vegGroup) {
            // Convertir punto de colisión al espacio local de vegGroup
            const localPt = validHit.point.clone();
            vegGroup.worldToLocal(localPt);

            const newTree = {
              id: 'tree_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              x: localPt.x,
              y: Math.max(localPt.y, 0.36),
              z: localPt.z,
              scale: treePlantScaleRef.current || 1.0,
              rotY: Math.random() * Math.PI * 2
            };
            if (onAddCatastroTreeRef.current) onAddCatastroTreeRef.current(newTree);
          } else {
            if (onSelectCatastroTreeRef.current) onSelectCatastroTreeRef.current(null);
          }
        } else {
          if (onSelectCatastroTreeRef.current) onSelectCatastroTreeRef.current(null);
        }
      }
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
    const onDblClick = () => {
      if (rutasRef.current.mode === 'ruta' && rutasFinishRef.current) rutasFinishRef.current();
      if (planRef.current.mode !== 'none' && planFinishRef.current) planFinishRef.current();
    };
    domElem.addEventListener('dblclick', onDblClick);
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
      if (routesLayerRef.current) routesLayerRef.current.setResolution(container.clientWidth, container.clientHeight);
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
      if (routesLayerRef.current) routesLayerRef.current.update(performance.now(), camera.top || 100);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('dblclick', onDblClick);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      if (renderer) renderer.dispose();
    };
  }, []);

  // ---- Recorridos de lanchas: manejadores ----
  const rutasHandlerRef = useRef(null);
  const rutasFinishRef = useRef(null);
  const typeColor = (list, id) => (list.find((t) => t.id === id) || list[0]).color;

  const finishRuta = () => {
    const { mode, draft, routeType: rt, name } = rutasRef.current;
    if (mode !== 'ruta' || draft.length < 2) return;
    const next = [...rutasRef.current.rutas, { id: 'ruta_' + Date.now(), type: rt, name: (name || '').trim(), pts: draft }];
    setRutas(next);
    saveRutasList(STORAGE_RUTAS, next);
    setRutaDraft([]);
    setRutaName('');
  };
  rutasFinishRef.current = finishRuta;

  rutasHandlerRef.current = (x, z) => {
    const { mode, pointType: pt, name } = rutasRef.current;
    if (mode === 'ruta') {
      setRutaDraft((prev) => {
        const last = prev[prev.length - 1];
        if (last && Math.hypot(last.x - x, last.z - z) < 0.4) return prev;
        return [...prev, { x, z }];
      });
    } else if (mode === 'punto') {
      const next = [...rutasRef.current.puntosHg, { id: 'pt_' + Date.now(), type: pt, name: (name || '').trim(), x, z }];
      setPuntosHg(next);
      saveRutasList(STORAGE_PUNTOS, next);
      setRutaName('');
    }
  };

  useEffect(() => {
    if (routesLayerRef.current) routesLayerRef.current.setData(rutas, puntosHg);
  }, [rutas, puntosHg, routesNonce]);

  useEffect(() => {
    if (!routesLayerRef.current) return;
    routesLayerRef.current.setDraft(
      rutasMode === 'ruta' ? 'ruta' : 'none',
      rutasMode === 'ruta' ? rutaDraft : [],
      typeColor(ROUTE_TYPES, routeType)
    );
  }, [rutaDraft, rutasMode, routeType, routesNonce]);

  useEffect(() => {
    const onKey = (e) => {
      if (rutasRef.current.mode === 'none') return;
      if (e.key === 'Enter') finishRuta();
      if (e.key === 'Escape') setRutaDraft([]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---- Zonificación y vías: manejadores ----
  const finishPlan = () => {
    const { mode, draft, zoneType: zt, zoneName: zn, roadWidth: rw, roads, zones } = planRef.current;
    if (mode === 'road' && draft.length >= 2) {
      const next = [...roads, { id: 'road_' + Date.now(), width: rw, points: draft.map(({ x, z }) => ({ x, z })) }];
      setPlanRoads(next);
      savePlanList(M2_ROADS, next);
    } else if (mode === 'zone' && draft.length >= 3) {
      const t = ZONE_TYPES.find((z) => z.id === zt) || ZONE_TYPES[0];
      const next = [...zones, { id: 'zone_' + Date.now(), type: zt, name: (zn || '').trim() || t.name, points: draft.map(({ x, z }) => ({ x, z })) }];
      setPlanZones(next);
      savePlanList(M2_ZONES, next);
      setZoneName('');
    } else {
      return;
    }
    setPlanDraft([]);
  };
  planFinishRef.current = finishPlan;
  planHandlerRef.current = (x, z) => {
    setPlanDraft((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(last.x - x, last.z - z) < 0.5) return prev;
      return [...prev, { x, y: 0.05, z }];
    });
  };

  // reconstruir zonas y vías sobre el mapa
  useEffect(() => {
    const root = currentModelGroupRef.current;
    if (!root) return;
    if (!planGroupRef.current || planGroupRef.current.parent !== root) {
      const g = new THREE.Group();
      g.name = 'PlanM2';
      root.add(g);
      planGroupRef.current = g;
      const d = new THREE.Group();
      d.name = 'PlanM2Draft';
      root.add(d);
      planDraftGroupRef.current = d;
      if (!planMatsRef.current) planMatsRef.current = createRoadMaterials(new THREE.TextureLoader(), `${TB_BASE}textures/sand_diffuse.jpg`, `${TB_BASE}textures/sand_bump.jpg`);
    }
    const g = planGroupRef.current;
    while (g.children.length) { const o = g.children[0]; g.remove(o); disposeObject(o); }
    const flat = () => 0.05;
    planZones.forEach((z) => g.add(buildZoneObject(z, flat, 4)));
    planRoads.forEach((r) => g.add(buildRoadObject(r, flat, planMatsRef.current)));
  }, [planRoads, planZones, routesNonce]);

  useEffect(() => {
    const d = planDraftGroupRef.current;
    if (!d) return;
    while (d.children.length) { const o = d.children[0]; d.remove(o); disposeObject(o); }
    if (planMode === 'none' || planDraft.length === 0) return;
    const zt = ZONE_TYPES.find((z) => z.id === zoneType) || ZONE_TYPES[0];
    d.add(buildDraftObject(planMode, planDraft, { color: zt.color, width: roadWidth }, () => 0.05, 4));
  }, [planDraft, planMode, zoneType, roadWidth, routesNonce]);

  useEffect(() => {
    const onKey = (e) => {
      if (planRef.current.mode === 'none') return;
      if (e.key === 'Enter') finishPlan();
      if (e.key === 'Escape') setPlanDraft([]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

      const satGround = grp.getObjectByName("SatelliteGround");
      const land = grp.getObjectByName("Landmasses");
      if (satGround) {
        satGround.visible = !!activeLayers.terrain;
        if (land) land.visible = false;
      } else if (land) {
        land.visible = !!activeLayers.terrain;
      }

      const forts = grp.getObjectByName("Fortresses");
      if (forts) forts.visible = !!activeLayers.buildings;

      const roads = grp.getObjectByName("RoadNetwork");
      if (roads) roads.visible = !!activeLayers.walls;

      const bldgs = grp.getObjectByName("Buildings3D");
      if (bldgs) bldgs.visible = !!activeLayers.buildings;

      const veg = grp.getObjectByName("Vegetation");
      if (veg) veg.visible = !!activeLayers.trees;

      const tbReal = grp.getObjectByName("TierrabombaReal");
      if (tbReal) {
        const sat = tbReal.getObjectByName("TB_Satelite");
        const tbTrees = tbReal.getObjectByName("TB_Arboles");
        const tbBld = tbReal.getObjectByName("TB_Edificios");
        if (sat) sat.visible = !!activeLayers.terrain;
        if (tbTrees) tbTrees.visible = !!activeLayers.trees;
        if (tbBld) tbBld.visible = !!activeLayers.buildings;
      }

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
      className={`relative w-full h-screen overflow-hidden animate-fade-in select-none bg-[#f8fafc] ${
        isDragOver ? 'ring-4 ring-amber-400 ring-inset' : ''
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
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[500] flex flex-col items-center justify-center p-6 text-slate-800 pointer-events-none animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center mb-4 animate-bounce">
            <UploadCloud className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="font-bold text-2xl text-slate-900">Suelta tu archivo de Revit (.glb / .gltf / .obj) aquí</h3>
          <p className="text-sm text-slate-600 mt-2 font-sans">Se cargará e iluminará en 3D en tiempo real</p>
        </div>
      )}

      {/* 1. FULLSCREEN 3D WEBGL CANVAS */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* ========================================================================= */}
      {/* 2. CONTROLES MINIMALISTAS: VEGETACIÓN 3D & CARGA                           */}
      {/* ========================================================================= */}

      {/* Loading Indicator */}
      {isLoadingFile && (
        <div className="absolute top-4 left-4 z-[400] bg-white/95 px-4 py-2.5 rounded-2xl text-xs font-sans text-slate-700 flex items-center space-x-2.5 border border-slate-200/90 shadow-lg pointer-events-none animate-fade-in backdrop-blur-xl">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="font-medium">{loadPhase || 'Cargando axonometría territorial...'}</span>
        </div>
      )}

      {/* Floating Top-Left Controls: Vegetación Nativa 3D */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-2 pointer-events-auto animate-fade-in">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowTreePlacementToolbar(v => !v);
              if (!showTreePlacementToolbar) setIsPlantingTree(true);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold backdrop-blur-xl border transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
              showTreePlacementToolbar
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300 shadow-emerald-600/20'
                : 'bg-white/95 hover:bg-slate-50 text-slate-800 border-slate-200/90'
            }`}
            title="Herramienta para plantar, escalar y editar árboles libremente en la isla"
          >
            <TreeIcon className={`w-4 h-4 ${showTreePlacementToolbar ? 'text-white' : 'text-emerald-600'}`} />
            <span>{showTreePlacementToolbar ? 'Cerrar Vegetación' : '🌱 Plantar Árboles'}</span>
            {safeCatastroList.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                showTreePlacementToolbar ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {safeCatastroList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              const v = !showRutas;
              setShowRutas(v);
              if (!v) { setRutasMode('none'); setRutaDraft([]); }
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold backdrop-blur-xl border transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
              showRutas
                ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-300 shadow-rose-600/20'
                : 'bg-white/95 hover:bg-slate-50 text-slate-800 border-slate-200/90'
            }`}
            title="Dibujar los recorridos de las lanchas Tierra Bomba - Cartagena y los puntos de mercurio en el agua"
          >
            <span>{showRutas ? 'Cerrar Recorridos' : '🚤 Recorridos de lanchas'}</span>
            {(rutas.length + puntosHg.length) > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${showRutas ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
                {rutas.length + puntosHg.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowDiagColegio((v) => !v)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold backdrop-blur-xl border transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
              showDiagColegio
                ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-amber-300'
                : 'bg-white/95 hover:bg-slate-50 text-slate-800 border-slate-200/90'
            }`}
            title="Registro fotográfico y diagnóstico del colegio"
          >
            <span>{showDiagColegio ? 'Cerrar Diagnóstico' : '🏫 Diagnóstico del colegio'}</span>
          </button>
          <button
            onClick={() => {
              const v = !showPlan;
              setShowPlan(v);
              if (!v) { setPlanMode('none'); setPlanDraft([]); }
              else { setRutasMode('none'); setRutaDraft([]); }
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold backdrop-blur-xl border transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
              showPlan
                ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300'
                : 'bg-white/95 hover:bg-slate-50 text-slate-800 border-slate-200/90'
            }`}
            title="Dibujar la zonificación y las vías propuestas sobre el mapa"
          >
            <span>{showPlan ? 'Cerrar Zonificación' : '🗺️ Vías y Zonas'}</span>
            {(planRoads.length + planZones.length) > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${showPlan ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {planRoads.length + planZones.length}
              </span>
            )}
          </button>
        </div>

        {/* Panel Flotante de Vegetación Interactiva */}
        {showTreePlacementToolbar && (
          <div className="pt-1">
            <LocalSafeComponent>
              <TreePlacementToolbar
                isPlanting={isPlantingTree}
                setIsPlanting={setIsPlantingTree}
                plantScale={treePlantScale}
                setPlantScale={setTreePlantScale}
                selectedTree={selectedCatastroTree}
                onScaleChange={handleCatastroTreeScaleChange}
                onDeleteTree={handleCatastroTreeDelete}
                onClearAll={handleCatastroTreeClearAll}
                treesCount={safeCatastroList.length}
                onDeselect={() => setSelectedCatastroTreeId(null)}
                onClose={() => setShowTreePlacementToolbar(false)}
              />
            </LocalSafeComponent>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TARJETA EDITORIAL BLANCA: PROPUESTA TERRITORIAL & PLAN MAESTRO 2026      */}
      {/* ========================================================================= */}
      {showDiagColegio && <DiagnosticoColegio onClose={() => setShowDiagColegio(false)} />}

      {showPlan && (
        <PlanningToolbar
          mode={planMode}
          setMode={(m) => { setPlanMode(m); setPlanDraft([]); if (m !== 'none') { setRutasMode('none'); setRutaDraft([]); setIsPlantingTree(false); } }}
          zoneType={zoneType}
          setZoneType={setZoneType}
          zoneName={zoneName}
          setZoneName={setZoneName}
          roadWidth={roadWidth}
          setRoadWidth={setRoadWidth}
          draftCount={planDraft.length}
          onFinish={finishPlan}
          onUndo={() => setPlanDraft((d) => d.slice(0, -1))}
          onCancel={() => setPlanDraft([])}
          roads={planRoads}
          zones={planZones}
          onDeleteRoad={(id) => { const n = planRoads.filter((r) => r.id !== id); setPlanRoads(n); savePlanList(M2_ROADS, n); }}
          onDeleteZone={(id) => { const n = planZones.filter((r) => r.id !== id); setPlanZones(n); savePlanList(M2_ZONES, n); }}
          onClearPlan={() => {
            if (!window.confirm('¿Eliminar todas las vías y zonas dibujadas?')) return;
            setPlanRoads([]); setPlanZones([]); savePlanList(M2_ROADS, []); savePlanList(M2_ZONES, []);
          }}
          onClose={() => { setShowPlan(false); setPlanMode('none'); setPlanDraft([]); }}
          metersPerUnit={50}
          widthMin={0.2}
          widthMax={1.6}
          posClass="top-20 right-4 z-[460]"
        />
      )}

      {showRutas && (
        <RutasLanchasPanel
          mode={rutasMode}
          setMode={(m) => { setRutasMode(m); setRutaDraft([]); if (m !== 'none') { setIsPlantingTree(false); setPlanMode('none'); setPlanDraft([]); } }}
          routeType={routeType}
          setRouteType={setRouteType}
          pointType={pointType}
          setPointType={setPointType}
          name={rutaName}
          setName={setRutaName}
          draftCount={rutaDraft.length}
          onFinish={finishRuta}
          onUndo={() => setRutaDraft((d) => d.slice(0, -1))}
          onCancel={() => setRutaDraft([])}
          routes={rutas}
          points={puntosHg}
          onDeleteRoute={(id) => { const n = rutas.filter((r) => r.id !== id); setRutas(n); saveRutasList(STORAGE_RUTAS, n); }}
          onDeletePoint={(id) => { const n = puntosHg.filter((r) => r.id !== id); setPuntosHg(n); saveRutasList(STORAGE_PUNTOS, n); }}
          onClear={() => {
            if (!window.confirm('¿Borrar todos los recorridos y puntos dibujados?')) return;
            setRutas([]); setPuntosHg([]); saveRutasList(STORAGE_RUTAS, []); saveRutasList(STORAGE_PUNTOS, []);
          }}
        />
      )}

      {/* Floating Bottom Center: Orbit & Zoom Instruction Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none hidden md:block">
        <div className="bg-white/90 px-4 py-2 rounded-2xl text-xs font-sans text-slate-600 flex items-center space-x-4 shadow-lg border border-slate-200/80 backdrop-blur-md">
          <span className="flex items-center space-x-1.5"><RotateCcw className="w-3.5 h-3.5 text-slate-500" /><span><b>Arrastrar:</b> Girar</span></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center space-x-1.5"><Maximize2 className="w-3.5 h-3.5 text-slate-500" /><span><b>Scroll:</b> Zoom</span></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center space-x-1.5"><Sliders className="w-3.5 h-3.5 text-slate-500" /><span><b>Clic Derecho:</b> Mover</span></span>
        </div>
      </div>

    </div>
  );
}
