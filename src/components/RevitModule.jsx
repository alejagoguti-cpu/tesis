import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import PlanningToolbar from './PlanningToolbar';
import MasterplanCard from './MasterplanCard';
import { createMobility } from '../utils/movilidad';
import { buildGroundSolid } from '../utils/groundSolid';
import { USOS, loadUserTags, saveUserTags, useColor, iconSprite } from '../utils/usosTerritorio';
import { DATA_URL, loadSatelliteMap, loadSatelliteTexture, applySatelliteUV, loadRealTrees, loadTreeTemplates } from '../utils/realTerritory';
import {
  STORAGE_ROADS, STORAGE_ZONES, ZONE_TYPES, loadList, saveList, buildHeightField,
  createRoadMaterials, buildRoadObject, buildZoneObject, buildDraftObject, disposeObject
} from '../utils/planningTools';


// Texturas y modelos optimizados
const basePath = import.meta.env.BASE_URL || '/';
const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';

const SAND_DIFFUSE = `${cleanBase}textures/sand_diffuse.jpg`;
const SAND_BUMP = `${cleanBase}textures/sand_bump.jpg`;
const GRASS_DIFFUSE = `${cleanBase}textures/textura_pasto_m5.png`;
const GRASS_BUMP = `${cleanBase}textures/grass_bump.jpg`;
const WATER_DIFFUSE = `${cleanBase}textures/textura_agua_m5.jpg`;
const WATER_NORMALS = `${cleanBase}textures/water_normals_fine.jpg`;
const TREE_BARK = `${cleanBase}textures/tree_bark.jpg`;
const TREE_LEAF = `${cleanBase}textures/tree_leaf.png`;

const STORAGE_KEY_REVIT = 'tesis_revit_custom_trees';

function getSavedTrees(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveTrees(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {}
}

// Datos de diagnóstico arquitectónico para las 3 viviendas analizadas
const HOUSES_DATA = [
  {
    id: 1,
    meshName: 'Mesh_House_1',
    title: 'Vivienda 01 · Borde Costero',
    sector: 'Punta Arenas',
    coordsLocal: [-586.76, -582.5, 3.95],
    area: '68 m²',
    altura: '1 nivel (3.2 m)',
    patologiaPrincipal: 'Socavación salina severa y pérdida de soporte por marea viva',
    sistemaConstructivo: 'Mampostería simple sin confinar, postes de mangle y cubierta de zinc',
    vulnerabilidad: 'Crítica ante mareas de tormenta e intemperie salina costera',
    tabs: {
      foto: {
        title: 'Lámina Completa — Levantamiento Integral',
        desc: 'Lámina técnica completa a escala 1:50 con levantamiento planimétrico en planta, axonometría isométrica y corte estructural.',
        img: `${cleanBase}assets/vivienda_01_completa.png`,
        tag: 'Lámina Integral 1:50'
      },
      planta: {
        title: 'Planta Arquitectónica — Distribución y Cotas 1:50',
        desc: 'Planta arquitectónica acotada a escala 1:50: distribución de 3 recintos, áreas húmedas, mobiliario y ventilación.',
        img: `${cleanBase}assets/vivienda_01_planta.png`,
        tag: 'Planta Escala 1:50'
      },
      axono: {
        title: 'Axonometría — Diagnóstico Tridimensional',
        desc: 'Despiece axonométrico tridimensional: volumetría exterior, muros autoportantes y cubierta inclinada de asbesto/zinc.',
        img: `${cleanBase}assets/vivienda_01_axono.png`,
        tag: 'Axonometría Isométrica'
      },
      corte: {
        title: 'Corte Longitudinal — Interior y Cimentación',
        desc: 'Sección constructiva que muestra altura interior libre, vigas de cubierta, mobiliario y condiciones de habitabilidad.',
        img: `${cleanBase}assets/vivienda_01_corte.png`,
        tag: 'Corte Constructivo'
      }
    }
  },
  {
    id: 2,
    meshName: 'Mesh_House_2',
    title: 'Vivienda 02 · Núcleo Urbano Tradicional',
    sector: 'Centro Comunitario',
    coordsLocal: [-144.64, 177.22, 26.14],
    area: '82 m²',
    altura: '1 nivel + mezanina (3.8 m)',
    patologiaPrincipal: 'Sobrecarga de cubierta, fisuración térmica en juntas y humedad ascendente',
    sistemaConstructivo: 'Bloque de concreto artesanal, solera de madera reciclada y viguetas de pino',
    vulnerabilidad: 'Media-Alta por hacinamiento y falta de red hidrosanitaria pluvial',
    tabs: {
      foto: {
        title: 'Lámina Completa — Levantamiento Integral',
        desc: 'Lámina técnica completa a escala 1:50 con levantamiento planimétrico en planta, axonometría isométrica y corte estructural.',
        img: `${cleanBase}assets/vivienda_02_completa.png`,
        tag: 'Lámina Integral 1:50'
      },
      planta: {
        title: 'Planta Arquitectónica — Trama de Habitabilidad',
        desc: 'Levantamiento planimétrico acotado a escala 1:50: zaguán de acceso, sala multifuncional, alcobas y área de cocina.',
        img: `${cleanBase}assets/vivienda_02_planta.png`,
        tag: 'Planta Escala 1:50'
      },
      axono: {
        title: 'Axonometría — Estado de Consolidación',
        desc: 'Vista axonométrica del tejido volumétrico: cubierta a dos aguas, porche frontal con postes y vanos de fachada.',
        img: `${cleanBase}assets/vivienda_02_axono.png`,
        tag: 'Axonometría Isométrica'
      },
      corte: {
        title: 'Corte Longitudinal — Sistema de Cubierta y Pendiente',
        desc: 'Corte transversal y longitudinal: cerchas artesanales, muros con fisuración térmica e iluminación natural.',
        img: `${cleanBase}assets/vivienda_02_corte.png`,
        tag: 'Corte Constructivo'
      }
    }
  },
  {
    id: 3,
    meshName: 'Mesh_House_3',
    title: 'Vivienda 03 · Sector Norte',
    sector: 'Sector Norte',
    coordsLocal: [38.92, 654.19, 7.15],
    area: '74 m²',
    altura: '1 nivel con pilotes de borde (3.5 m)',
    patologiaPrincipal: 'Asentamiento diferencial en suelo blando marino y corrosión galvánica de anclajes',
    sistemaConstructivo: 'Estructura mixta madera náutica / bloques sobre plataforma de palafito seco',
    vulnerabilidad: 'Alta por escorrentía pluvial descendente y salpicadura marina directa',
    tabs: {
      foto: {
        title: 'Lámina Completa — Levantamiento Integral',
        desc: 'Lámina técnica completa a escala 1:50 con levantamiento planimétrico en planta, axonometría isométrica y corte estructural.',
        img: `${cleanBase}assets/vivienda_03_completa.png`,
        tag: 'Lámina Integral 1:50'
      },
      planta: {
        title: 'Planta Arquitectónica — Zonificación y Accesos',
        desc: 'Esquema en planta acotado a escala 1:50: pasarela de acceso, estancia comunitaria y dormitorios modulares.',
        img: `${cleanBase}assets/vivienda_03_planta.png`,
        tag: 'Planta Escala 1:50'
      },
      axono: {
        title: 'Axonometría — Volumetría y Entorno Costero',
        desc: 'Despiece axonométrico: volumetría sobre el terreno natural, aleros protectores y pórtico posterior.',
        img: `${cleanBase}assets/vivienda_03_axono.png`,
        tag: 'Axonometría Isométrica'
      },
      corte: {
        title: 'Corte Longitudinal — Sección Habitacional',
        desc: 'Corte arquitectónico longitudinal: tabiquería interior, estructura de cubierta y gradiente de ventilación.',
        img: `${cleanBase}assets/vivienda_03_corte.png`,
        tag: 'Corte Constructivo'
      }
    }
  }
];

// Genera un cielo diurno arquitectónico caribeño con degradado realista y luminoso
function createSkyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#1c77c9');
  grad.addColorStop(0.40, '#5ea8ea');
  grad.addColorStop(0.72, '#bce0fd');
  grad.addColorStop(1.0, '#f2f8fe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const SECTION_BASE = -1.3; // cota inferior del bloque de terreno para el corte

function RenderViewer({
  onStats,
  onProgress,
  onLoaded,
  preset,
  presetNonce,
  fitNonce,
  waveActive,
  wireframe,
  roadColorMode,
  localFile,
  selectedHouseId,
  onSelectHouse,
  onSaveCurrentViewTrigger,
  onResetViewTrigger,
  treesVisible,
  waterColor,
  treesList,
  isPlantingTree,
  plantScale,
  selectedTreeId,
  onSelectTree,
  onAddTree,
  planMode,
  zoneType,
  roadWidth,
  draftPoints,
  roads,
  zones,
  onPlanPoint,
  onPlanFinish,
  layers,
  onMobility,
  onRealTrees,
  usos,
  onTagBuilding,
  onUsosStats,
  section,
  onSectionChange
}) {
  const sectionRef = useRef(section);
  sectionRef.current = section;
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;
  const applySectionRef = useRef(null);
  const secStateRef = useRef(null);
  const groundSolidRef = useRef(null);
  const mobilityRef = useRef(null);
  const buildingMeshesRef = useRef([]);
  const buildingMatRef = useRef(null);
  const buildingUseMatRef = useRef(null);
  const edificiosRef = useRef(null);
  const useIconsRef = useRef(null);
  const [usosNonce, setUsosNonce] = useState(0);
  const usosRef = useRef(usos);
  usosRef.current = usos;
  const onTagBuildingRef = useRef(onTagBuilding);
  onTagBuildingRef.current = onTagBuilding;
  const onUsosStatsRef = useRef(onUsosStats);
  onUsosStatsRef.current = onUsosStats;
  const terrainMeshesRef = useRef([]);
  const satMatRef = useRef(null);
  const realTreesRef = useRef(null);
  const treeTemplatesRef = useRef(null);
  const [templatesNonce, setTemplatesNonce] = useState(0);
  const layersRef = useRef(layers);
  layersRef.current = layers;
  const onMobilityRef = useRef(onMobility);
  onMobilityRef.current = onMobility;
  const onRealTreesRef = useRef(onRealTrees);
  onRealTreesRef.current = onRealTrees;
  const mountRef = useRef(null);
  const heightFieldRef = useRef(null);
  const planGroupRef = useRef(null);
  const draftGroupRef = useRef(null);
  const roadPlanMatsRef = useRef(null);
  const hoverRingRef = useRef(null);
  const [hfNonce, setHfNonce] = useState(0);
  const planModeRef = useRef(planMode);
  planModeRef.current = planMode;
  const onPlanPointRef = useRef(onPlanPoint);
  onPlanPointRef.current = onPlanPoint;
  const onPlanFinishRef = useRef(onPlanFinish);
  onPlanFinishRef.current = onPlanFinish;
  const applyViewRef = useRef(null);
  const modelRef = useRef(null);
  const rootRef = useRef(null);
  const fitCtl = useRef(null);
  const roadsMeshRef = useRef([]);
  const housesMeshesRef = useRef({});
  const treesGroupRef = useRef(null);
  const dynamicTreesGroupRef = useRef(null);
  const treeModelSceneRef = useRef(null);
  const waterMatRef = useRef(null);
  const waveActiveRef = useRef(waveActive);
  waveActiveRef.current = waveActive;

  const isPlantingTreeRef = useRef(isPlantingTree);
  isPlantingTreeRef.current = isPlantingTree;
  const plantScaleRef = useRef(plantScale);
  plantScaleRef.current = plantScale;
  const onAddTreeRef = useRef(onAddTree);
  onAddTreeRef.current = onAddTree;
  const onSelectTreeRef = useRef(onSelectTree);
  onSelectTreeRef.current = onSelectTree;

  // Materiales de vías y casas
  const roadMatSandRef = useRef(null);
  const roadMatBlueRef = useRef(null);
  const houseMatNormalRef = useRef(null);
  const houseMatSelectedRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const getW = () => container.clientWidth || window.innerWidth || 800;
    const getH = () => container.clientHeight || Math.max(window.innerHeight - 64, 550);

    // Escena 3D
    const scene = new THREE.Scene();
    const skyTex = null;
    scene.background = new THREE.Color(0xbfdcf0);
    scene.fog = new THREE.Fog(0xcfe4f3, 170, 1500);

    const camera = new THREE.PerspectiveCamera(40, getW() / getH(), 0.1, 4000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(getW(), getH());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    container.appendChild(renderer.domElement);
    camera.far = 6000;
    camera.updateProjectionMatrix();

    // Cielo atmosférico físico + iluminación de entorno derivada del mismo cielo
    const sunDir = new THREE.Vector3(75, 100, 65).normalize();
    const sky = new Sky();
    sky.scale.setScalar(4500);
    const skyU = sky.material.uniforms;
    skyU.turbidity.value = 3.4;
    skyU.rayleigh.value = 1.15;
    skyU.mieCoefficient.value = 0.0045;
    skyU.mieDirectionalG.value = 0.82;
    skyU.sunPosition.value.copy(sunDir);
    scene.add(sky);
    scene.background = null;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    const envSky = new Sky();
    envSky.scale.setScalar(90);
    ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG'].forEach((k) => {
      envSky.material.uniforms[k].value = skyU[k].value;
    });
    envSky.material.uniforms.sunPosition.value.copy(sunDir);
    envScene.add(envSky);
    const envRT = pmrem.fromScene(envScene, 0, 0.1, 200);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.85;

    // Luz de cielo suave (el resto de la luz ambiente viene del entorno)
    scene.add(new THREE.HemisphereLight(0xdcecff, 0xb8c9a0, 0.45));

    // Sol tropical
    const sun = new THREE.DirectionalLight(0xfff3dc, 3.1);
    sun.position.copy(sunDir.clone().multiplyScalar(160));
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.left = -34;
    sun.shadow.camera.right = 34;
    sun.shadow.camera.top = 34;
    sun.shadow.camera.bottom = -34;
    sun.shadow.camera.near = 20;
    sun.shadow.camera.far = 400;
    sun.shadow.bias = -0.00025;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);

    // Luz de relleno lateral
    const marineLight = new THREE.DirectionalLight(0xd4eeff, 1.15);
    marineLight.position.set(-80, 80, -60);
    scene.add(marineLight);

    const root = new THREE.Group();
    rootRef.current = root;
    scene.add(root);

    const texLoader = new THREE.TextureLoader();

    // 1. Texturas de Arena Realista (para Vías y Borde Costero de la Isla)
    const sandDiffuseTex = texLoader.load(SAND_DIFFUSE);
    sandDiffuseTex.wrapS = THREE.RepeatWrapping;
    sandDiffuseTex.wrapT = THREE.RepeatWrapping;
    sandDiffuseTex.repeat.set(24, 24);
    sandDiffuseTex.colorSpace = THREE.SRGBColorSpace;

    const sandBumpTex = texLoader.load(SAND_BUMP);
    sandBumpTex.wrapS = THREE.RepeatWrapping;
    sandBumpTex.wrapT = THREE.RepeatWrapping;
    sandBumpTex.repeat.set(24, 24);

    const sandMat = new THREE.MeshStandardMaterial({
      map: sandDiffuseTex,
      bumpMap: sandBumpTex,
      bumpScale: 0.10,
      color: 0xedd6a6,
      roughness: 0.82,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
      side: THREE.DoubleSide
    });
    roadMatSandRef.current = sandMat;

    // Versión Azul Selección Revit
    const roadMatBlue = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      side: THREE.DoubleSide
    });
    roadMatBlueRef.current = roadMatBlue;

    // 2. Textura de Pasto (más claro, fresco, natural y agradable a la vista)
    const grassDiffuseTex = texLoader.load(GRASS_DIFFUSE);
    grassDiffuseTex.wrapS = THREE.RepeatWrapping;
    grassDiffuseTex.wrapT = THREE.RepeatWrapping;
    grassDiffuseTex.repeat.set(26, 26);
    grassDiffuseTex.colorSpace = THREE.SRGBColorSpace;

    const grassBumpTex = texLoader.load(GRASS_BUMP);
    grassBumpTex.wrapS = THREE.RepeatWrapping;
    grassBumpTex.wrapT = THREE.RepeatWrapping;
    grassBumpTex.repeat.set(26, 26);

    const grassMat = new THREE.MeshStandardMaterial({
      map: grassDiffuseTex,
      bumpMap: grassBumpTex,
      bumpScale: 0.10,
      color: 0x76b856,
      roughness: 0.78,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide
    });

    // 3. CASAS Y CUBOS DE REVIT: ¡BLANCO PURO RADIANTE!
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.1,
      roughness: 0.62,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    // 4. TRES VIVIENDAS SELECCIONADAS EN COLOR ROJO SUAVE ARQUITECTÓNICO
    const houseRedSoftMat = new THREE.MeshStandardMaterial({
      color: 0xe05656,
      emissive: 0xef4444,
      emissiveIntensity: 0.28,
      roughness: 0.25,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    houseMatNormalRef.current = houseRedSoftMat;

    const houseSelectedGlowMat = new THREE.MeshStandardMaterial({
      color: 0xf87171,
      emissive: 0xf87171,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    houseMatSelectedRef.current = houseSelectedGlowMat;

    // 5. OCÉANO REALISTA (Azul caribe tropical vivo con textura acuática, cáusticas y oleaje activo)
    const waterDiffuseTex = texLoader.load(WATER_DIFFUSE);
    waterDiffuseTex.wrapS = THREE.RepeatWrapping;
    waterDiffuseTex.wrapT = THREE.RepeatWrapping;
    waterDiffuseTex.repeat.set(20, 20);
    waterDiffuseTex.colorSpace = THREE.SRGBColorSpace;

    const waterNormalTex = texLoader.load(WATER_NORMALS);
    waterNormalTex.wrapS = THREE.RepeatWrapping;
    waterNormalTex.wrapT = THREE.RepeatWrapping;
    waterNormalTex.repeat.set(40, 40);

    const initialWaterColor = waterColor || '#1ea4c8';
    const waterMat = new THREE.MeshStandardMaterial({
      map: waterDiffuseTex,
      normalMap: waterNormalTex,
      normalScale: new THREE.Vector2(0.20, 0.20),
      color: new THREE.Color(initialWaterColor),
      roughness: 0.16,
      metalness: 0.12,
      transparent: true,
      opacity: 0.94,
      envMapIntensity: 1.5
    });

    // Mar físico: reflejo del cielo y de la isla, olas con normales animadas y brillo solar
    waterNormalTex.wrapS = waterNormalTex.wrapT = THREE.RepeatWrapping;
    const oceanMesh = new Water(new THREE.PlaneGeometry(4000, 4000), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormalTex,
      sunDirection: sunDir.clone(),
      sunColor: 0xfff6e0,
      waterColor: new THREE.Color(initialWaterColor).getHex(),
      distortionScale: 2.4,
      alpha: 0.96,
      fog: true
    });
    oceanMesh.material.uniforms.size.value = 0.55;
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = 0.055;
    root.add(oceanMesh);
    waterMatRef.current = { color: oceanMesh.material.uniforms.waterColor.value };

    // Grupo para árboles plantados dinámicamente
    const dynamicTreesGroup = new THREE.Group();
    dynamicTreesGroup.name = 'DynamicTreesGroup';
    root.add(dynamicTreesGroup);
    dynamicTreesGroupRef.current = dynamicTreesGroup;

    // Capas de planeación (vías y zonas dibujadas) y borrador
    const planGroup = new THREE.Group();
    planGroup.name = 'PlanningGroup';
    root.add(planGroup);
    planGroupRef.current = planGroup;
    const draftGroup = new THREE.Group();
    draftGroup.name = 'PlanningDraft';
    root.add(draftGroup);
    draftGroupRef.current = draftGroup;
    roadPlanMatsRef.current = createRoadMaterials(texLoader, SAND_DIFFUSE, SAND_BUMP);

    const hoverRing = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.17, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, depthTest: false, transparent: true, opacity: 0.95 })
    );
    hoverRing.rotation.x = -Math.PI / 2;
    hoverRing.renderOrder = 60;
    hoverRing.visible = false;
    root.add(hoverRing);
    hoverRingRef.current = hoverRing;

    // ---------------- SECTION BOX (tipo Revit) ----------------
    renderer.localClippingEnabled = true;
    const secGroup = new THREE.Group();
    secGroup.name = 'SectionBox';
    secGroup.visible = false;
    secGroup.userData.noClip = true;
    root.add(secGroup);
    const unitBox = new THREE.BoxGeometry(1, 1, 1);
    const secLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(unitBox),
      new THREE.LineBasicMaterial({ color: 0xf59e0b, depthTest: false, transparent: true, opacity: 0.95 })
    );
    secLines.renderOrder = 70;
    secLines.userData.noClip = true;
    secGroup.add(secLines);
    const secFill = new THREE.Mesh(
      unitBox,
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.045, side: THREE.BackSide, depthWrite: false })
    );
    secFill.userData.noClip = true;
    secGroup.add(secFill);
    const handles = [];
    ['x', 'y', 'z'].forEach((axis) => ['min', 'max'].forEach((side) => {
      const h = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 14),
        new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.98 })
      );
      h.userData = { noClip: true, axis, side };
      h.renderOrder = 75;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.25, 1.75, 28),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false, side: THREE.DoubleSide })
      );
      ring.userData.noClip = true;
      ring.renderOrder = 74;
      h.add(ring);
      secGroup.add(h);
      handles.push(h);
    }));
    const secState = { bounds: null, dragging: null, planes: [], lastClip: 0 };
    // volumen de agua (de la base al nivel del mar) para que el corte muestre mar y tierra como un bloque
    const seaBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x1ea4c8, transparent: true, opacity: 0.5, roughness: 0.25, metalness: 0, side: THREE.DoubleSide, depthWrite: false
      })
    );
    seaBlock.name = 'SeaBlock';
    seaBlock.visible = false;
    seaBlock.renderOrder = 30;
    root.add(seaBlock);
    const planeX0 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    const planeX1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    const planeY0 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeY1 = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeZ1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    const clipPlanes = [planeX0, planeX1, planeY0, planeY1, planeZ0, planeZ1];

    const boxFromSection = () => {
      const b = secState.bounds;
      const sc = sectionRef.current;
      if (!b || !sc) return null;
      const lerp = (a, c, t) => a + (c - a) * t;
      return {
        min: new THREE.Vector3(lerp(b.min.x, b.max.x, sc.x[0]), lerp(b.min.y, b.max.y, sc.y[0]), lerp(b.min.z, b.max.z, sc.z[0])),
        max: new THREE.Vector3(lerp(b.min.x, b.max.x, sc.x[1]), lerp(b.min.y, b.max.y, sc.y[1]), lerp(b.min.z, b.max.z, sc.z[1]))
      };
    };

    const applyClipToScene = (enable) => {
      root.traverse((o) => {
        if (!o.isMesh && !o.isLine && !o.isPoints && !o.isSprite) return;
        let n = o;
        while (n) { if (n.userData && n.userData.noClip) return; n = n.parent; }
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m || m.isShaderMaterial) return;
          const want = enable ? clipPlanes : null;
          if (m.clippingPlanes !== want) {
            const changed = (m.clippingPlanes === null) !== (want === null);
            m.clippingPlanes = want;
            m.clipShadows = true;
            if (changed) m.needsUpdate = true;
          }
        });
      });
    };

    const applySection = () => {
      const sc = sectionRef.current;
      const box = boxFromSection();
      if (!sc || !sc.on || !box) {
        secGroup.visible = false;
        seaBlock.visible = false;
        oceanMesh.visible = true;
        if (groundSolidRef.current) groundSolidRef.current.visible = false;
        applyClipToScene(false);
        return;
      }
      if (groundSolidRef.current) groundSolidRef.current.visible = true;
      oceanMesh.visible = false;
      {
        const b = secState.bounds;
        const seaTop = 0.055;
        seaBlock.position.set((b.min.x + b.max.x) / 2, (SECTION_BASE + seaTop) / 2, (b.min.z + b.max.z) / 2);
        seaBlock.scale.set(b.max.x - b.min.x, seaTop - SECTION_BASE, b.max.z - b.min.z);
        seaBlock.visible = true;
      }
      planeX0.constant = -box.min.x; planeX1.constant = box.max.x;
      planeY0.constant = -box.min.y; planeY1.constant = box.max.y;
      planeZ0.constant = -box.min.z; planeZ1.constant = box.max.z;
      const size = box.max.clone().sub(box.min);
      const center = box.min.clone().add(box.max).multiplyScalar(0.5);
      secLines.position.copy(center); secLines.scale.copy(size);
      secFill.position.copy(center); secFill.scale.copy(size);
      const r = Math.max(0.12, Math.max(secState.bounds.max.x - secState.bounds.min.x, secState.bounds.max.z - secState.bounds.min.z) * 0.0036);
      handles.forEach((h) => {
        const { axis, side } = h.userData;
        const pos = center.clone();
        pos[axis] = side === 'min' ? box.min[axis] : box.max[axis];
        h.position.copy(pos);
        h.scale.setScalar(r);
        h.children[0].quaternion.copy(camera.quaternion);
      });
      secGroup.visible = true;
      applyClipToScene(true);
    };
    applySectionRef.current = applySection;
    secState.refresh = () => {
      const m = modelRef.current;
      if (!m) return;
      const b = new THREE.Box3().setFromObject(m);
      secState.bounds = new THREE.Box3(
        new THREE.Vector3(b.min.x, SECTION_BASE, b.min.z),
        new THREE.Vector3(b.max.x, Math.max(b.max.y * 1.6, 1.4), b.max.z)
      );
      applySection();
    };
    secState.handles = handles;
    secStateRef.current = secState;


    // Sistema de cámara orbital y pan
    let initialSph = { radius: 76, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    let initialTarget = { x: 0, y: 1.2, z: 0 };
    try {
      const saved = localStorage.getItem('tesis_m5_saved_view');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sph && parsed.target) {
          initialSph = parsed.sph;
          initialTarget = parsed.target;
        }
      }
    } catch (e) {}

    const sph = { ...initialSph };
    const target = new THREE.Vector3(initialTarget.x, initialTarget.y, initialTarget.z);

    const placeCamera = () => {
      camera.position.set(
        target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
        target.y + sph.radius * Math.cos(sph.phi),
        target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
      );
      camera.lookAt(target.x, target.y, target.z);
    };
    placeCamera();

    // Guardar / Restablecer vista permanentemente
    onSaveCurrentViewTrigger.current = () => {
      try {
        const toSave = {
          sph: { radius: sph.radius, theta: sph.theta, phi: sph.phi },
          target: { x: target.x, y: target.y, z: target.z }
        };
        localStorage.setItem('tesis_m5_saved_view', JSON.stringify(toSave));
        return true;
      } catch (err) {
        return false;
      }
    };

    onResetViewTrigger.current = () => {
      try {
        localStorage.removeItem('tesis_m5_saved_view');
        sph.radius = 76;
        sph.theta = Math.PI / 4;
        sph.phi = Math.PI / 3.2;
        target.set(0, 1.2, 0);
        placeCamera();
        return true;
      } catch (e) {
        return false;
      }
    };

    let cancelled = false;

    // Encuadre inicial del modelo
    const frameModel = (objToFrame) => {
      const obj = objToFrame || modelRef.current;
      if (!obj) return;

      obj.scale.set(1, 1, 1);
      obj.position.set(0, 0, 0);
      obj.rotation.set(-Math.PI / 2, 0, 0);
      obj.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (!isFinite(maxDim) || maxDim <= 0) return;

      const s = 40 / maxDim;
      obj.scale.set(s, s, s);
      obj.position.set(-center.x * s, -box.min.y * s + 0.02, -center.z * s);
      obj.updateMatrixWorld(true);

      if (!localStorage.getItem('tesis_m5_saved_view')) {
        const c2 = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
        target.set(c2.x, c2.y * 0.5, c2.z);
        sph.radius = 78;
        placeCamera();
      }
    };

    // Cargar y plantar árboles de render de C:\sketch
    const loadTrees = (parentObj) => {
      const gltfLoader = new GLTFLoader();
      const treeUrl = `${cleanBase}models/tree.glb`;

      fetch(`${cleanBase}models/trees_data.json`)
        .then((res) => (res.ok ? res.json() : []))
        .then(() => {
          const treePositions = []; // sin árboles inventados: la vegetación real viene de la imagen satelital

          gltfLoader.load(treeUrl, (gltf) => {
            if (cancelled) return;
            const treeScene = gltf.scene;
            treeModelSceneRef.current = treeScene;

            const barkTex = texLoader.load(TREE_BARK);
            barkTex.colorSpace = THREE.SRGBColorSpace;
            const leafTex = texLoader.load(TREE_LEAF);
            leafTex.colorSpace = THREE.SRGBColorSpace;

            const barkMat = new THREE.MeshStandardMaterial({
              map: barkTex,
              roughness: 0.9,
              metalness: 0.05
            });

            const leafMat = new THREE.MeshStandardMaterial({
              map: leafTex,
              color: new THREE.Color('#38a169'), // Verde vibrante, fresco y exuberante
              emissive: new THREE.Color('#14532d'),
              emissiveIntensity: 0.18,
              alphaTest: 0.45,
              transparent: true,
              roughness: 0.65,
              metalness: 0.0,
              side: THREE.DoubleSide
            });

            treeScene.traverse((c) => {
              if (c.isMesh) {
                c.castShadow = true;
                c.receiveShadow = true;
                const name = (c.name || '').toLowerCase();
                if (name.includes('bark')) {
                  c.material = barkMat;
                } else {
                  c.material = leafMat;
                }
              }
            });

            const treesGroup = new THREE.Group();
            treesGroup.name = 'VegetationRevit';
            treesGroupRef.current = treesGroup;

            treePositions.forEach((pos) => {
              const treeClone = treeScene.clone(true);
              const sc = pos.scale * 1.1;
              treeClone.scale.set(sc, sc, sc);
              treeClone.position.set(pos.x, pos.y, pos.z);
              treeClone.rotation.y = pos.rot;
              treesGroup.add(treeClone);
            });

            parentObj.add(treesGroup);
            treesGroup.visible = treesVisible !== false;
          }, undefined, () => {});
        })
        .catch(() => {});
    };

    // Procesamiento y asignación de materiales
    const setupRevitModel = (obj) => {
      if (cancelled || !obj) return;
      if (modelRef.current) root.remove(modelRef.current);
      modelRef.current = obj;
      root.add(obj);

      roadsMeshRef.current = [];
      housesMeshesRef.current = {};
      buildingMeshesRef.current = [];
      buildingMatRef.current = buildingMat;
      const terrainMeshes = [];

      try {
        obj.traverse((c) => {
          if (!c.isMesh) return;
          c.castShadow = true;
          c.receiveShadow = true;

          // 1. ELIMINAR CUALQUIER COLOR DE VÉRTICES PARA EVITAR QUE LA ISLA SE PONGA NEGRA
          if (c.geometry && c.geometry.attributes && c.geometry.attributes.color) {
            c.geometry.deleteAttribute('color');
          }

          // 2. CALCULAR NORMALES DE VÉRTICES PARA QUE LA ILUMINACIÓN DIURNA SEA PERFECTA
          if (c.geometry) {
            c.geometry.computeVertexNormals();
          }

          // 3. GENERAR COORDENADAS UV PLANARIAS SI NO EXISTEN
          if (c.geometry && (!c.geometry.attributes.uv || c.geometry.attributes.uv.count === 0)) {
            const pos = c.geometry.attributes.position;
            if (pos && pos.count > 0) {
              const uvs = new Float32Array(pos.count * 2);
              for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                uvs[i * 2] = (x + 1000) * 0.035;
                uvs[i * 2 + 1] = (y + 1000) * 0.035;
              }
              c.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
              c.geometry.attributes.uv.needsUpdate = true;
            }
          }

          const name = ((c.name || '') + ' ' + (c.parent?.name || '')).toLowerCase();

          // A. VÍAS Y CAMINOS: Textura de arena realista
          if (
            name.includes('mesh_roads') ||
            name.includes('164695') ||
            name.includes('camino') ||
            name.includes('road') ||
            name.includes('via')
          ) {
            c.material = roadColorMode === 'blue' ? roadMatBlue : sandMat;
            c.renderOrder = 10;
            roadsMeshRef.current.push(c);
          }
          // B. BORDE COSTERO DE LA ISLA: Textura de arena realista
          else if (name.includes('mesh_coastsand') || name.includes('coast') || name.includes('sand')) {
            c.material = sandMat;
            c.renderOrder = 2;
            terrainMeshes.push(c);
          }
          // C. TERRENO DE LA ISLA: Pasto fresco natural y agradable
          else if (
            name.includes('mesh_terrain') ||
            name.includes('149111') ||
            name.includes('terrain') ||
            name.includes('toposolid')
          ) {
            c.material = grassMat;
            c.renderOrder = 1;
            terrainMeshes.push(c);
          }
          // D. TODOS LOS DEMÁS CUBOS Y CASAS: ¡BLANCO PURO RADIANTE!
          else {
            c.material = buildingMat;
            buildingMeshesRef.current.push(c);
          }
        });

        // 4. CREAR LAS 3 VIVIENDAS DIAGNÓSTICO EN COLOR ROJO SUAVE CON VOLUMETRÍA Y MARCADORES BEACON
        HOUSES_DATA.forEach((house) => {
          const [hx, hy, hz] = house.coordsLocal;
          const group = new THREE.Group();
          group.name = `Group_${house.meshName}`;
          group.position.set(hx, hy, hz);

          // Cubo de volumen habitacional en rojo suave
          const boxMat = selectedHouseId === house.id ? houseSelectedGlowMat : houseRedSoftMat;
          const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 7), boxMat);
          boxMesh.position.set(0, 0, 3.5);
          boxMesh.castShadow = true;
          boxMesh.receiveShadow = true;
          boxMesh.renderOrder = 25;
          group.add(boxMesh);

          // Marcador de flecha/cono apuntando hacia abajo
          const pinMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xf87171,
            emissiveIntensity: 0.6,
            roughness: 0.2
          });
          const pinMesh = new THREE.Mesh(new THREE.ConeGeometry(3.5, 9, 12), pinMat);
          pinMesh.position.set(0, 0, 13);
          pinMesh.rotation.x = Math.PI;
          group.add(pinMesh);

          obj.add(group);
          housesMeshesRef.current[house.id] = boxMesh;
        });
      } catch (err) {
        console.warn('Advertencia configurando materiales:', err);
      }

      let meshCount = 0;
      obj.traverse((c) => { if (c.isMesh) meshCount++; });
      if (onStats) onStats({ meshes: meshCount || 5185 });
      if (onLoaded) onLoaded();

      frameModel(obj);
      obj.updateMatrixWorld(true);
      try {
        heightFieldRef.current = buildHeightField([...terrainMeshes, ...roadsMeshRef.current]);
      } catch (err) {
        console.warn('No se pudo construir el mapa de alturas:', err);
      }
      setHfNonce((n) => n + 1);
      try {
        if (heightFieldRef.current && heightFieldRef.current.grid) {
          if (groundSolidRef.current) root.remove(groundSolidRef.current);
          groundSolidRef.current = buildGroundSolid(heightFieldRef.current.grid, { base: SECTION_BASE });
          root.add(groundSolidRef.current);
        }
      } catch (err) {
        console.warn('No se pudo construir el sólido del terreno:', err);
      }
      if (secStateRef.current && secStateRef.current.refresh) secStateRef.current.refresh();
      terrainMeshesRef.current = terrainMeshes;
      fetch(`${DATA_URL}edificios.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d || cancelled) return;
          edificiosRef.current = d;
          setUsosNonce((n) => n + 1);
        })
        .catch(() => {});
      (async () => {
        try {
          const map = await loadSatelliteMap();
          if (cancelled) return;
          const tex = loadSatelliteTexture(renderer);
          const maskTex = new THREE.TextureLoader().load(`${cleanBase}textures/tierrabomba_tierra_mascara.png`);
          const satMat = new THREE.MeshStandardMaterial({
            map: tex, alphaMap: maskTex, alphaTest: 0.5, roughness: 0.96, metalness: 0, color: 0xdedede, envMapIntensity: 0.5, side: THREE.DoubleSide
          });
          satMatRef.current = satMat;
          terrainMeshes.forEach((m) => {
            applySatelliteUV(m.geometry, map);
            m.userData.origMat = m.material;
            if (layersRef.current?.satellite) m.material = satMat;
          });
          roadsMeshRef.current.forEach((m) => {
            applySatelliteUV(m.geometry, map);
            m.userData.origMat = m.material;
            if (layersRef.current?.satellite && !layersRef.current?.modelRoads) m.material = satMat;
          });
        } catch (err) {
          console.warn('Imagen satelital no disponible:', err);
        }
        try {
          const hf = heightFieldRef.current;
          if (!hf) return;
          const rt = await loadRealTrees({ parentObj: obj, heightAt: hf.heightAt });
          if (cancelled) return;
          root.add(rt.group);
          realTreesRef.current = rt.group;
          rt.group.visible = layersRef.current?.realTrees !== false;
          if (onRealTreesRef.current) onRealTreesRef.current(rt.count);
        } catch (err) {
          console.warn('Vegetación real no disponible:', err);
        }
        try {
          const hf2 = heightFieldRef.current;
          if (hf2) {
            const osm = await (await fetch(`${DATA_URL}capas_osm.json`)).json();
            const mob = await createMobility({ roads: osm.roads, parentObj: obj, heightAt: hf2.heightAt });
            if (!cancelled) {
              root.add(mob.group);
              mob.group.visible = layersRef.current?.mobility !== false;
              mobilityRef.current = mob;
              if (onMobilityRef.current) onMobilityRef.current({ motos: mob.motos, bikes: mob.bikes });
            }
          }
        } catch (err) {
          console.warn('Movilidad no disponible:', err);
        }
        try {
          treeTemplatesRef.current = await loadTreeTemplates();
          setTemplatesNonce((n) => n + 1);
        } catch (err) {
          console.warn('Plantillas de árbol no disponibles:', err);
        }
      })();
      loadTrees(obj);
    };

    // Carga del modelo oficial
    const GLB_CANDIDATES = [
      `${cleanBase}models/tierrabomba_revit.glb`,
      './models/tierrabomba_revit.glb',
      '/tesis/models/tierrabomba_revit.glb',
      'models/tierrabomba_revit.glb'
    ];
    const FBX_CANDIDATES = [
      `${cleanBase}models/tierrabomba_3dview.fbx`,
      './models/tierrabomba_3dview.fbx',
      '/tesis/models/tierrabomba_3dview.fbx',
      'models/tierrabomba_3dview.fbx'
    ];

    let hasLoaded = false;
    const loadCandidates = (urls, isGlb, onSuccess, onFail) => {
      let idx = 0;
      const tryNext = () => {
        if (cancelled || hasLoaded) return;
        if (idx >= urls.length) {
          if (onFail) onFail();
          return;
        }
        const url = urls[idx++];
        if (isGlb) {
          const gLoader = new GLTFLoader();
          gLoader.load(
            url,
            (gltf) => {
              if (!hasLoaded) {
                hasLoaded = true;
                onSuccess(gltf.scene);
              }
            },
            (xhr) => {
              if (onProgress && xhr.loaded && xhr.total) {
                onProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
              }
            },
            () => tryNext()
          );
        } else {
          const fLoader = new FBXLoader();
          fLoader.load(
            url,
            (loadedObj) => {
              if (!hasLoaded) {
                hasLoaded = true;
                onSuccess(loadedObj);
              }
            },
            () => tryNext()
          );
        }
      };
      tryNext();
    };

    loadCandidates(
      GLB_CANDIDATES,
      true,
      (obj) => setupRevitModel(obj),
      () => {
        loadCandidates(FBX_CANDIDATES, false, (obj) => setupRevitModel(obj), () => {
          if (onLoaded) onLoaded();
        });
      }
    );

    // Ajustes de vistas de cámara predeterminadas
    applyViewRef.current = (mode) => {
      if (mode === 'axon') {
        sph.phi = Math.PI / 3.2;
        sph.theta = Math.PI / 4;
        sph.radius = 78;
      } else if (mode === 'top') {
        sph.phi = 0.08;
        sph.radius = 95;
      } else if (mode === 'front') {
        sph.phi = Math.PI / 2.05;
        sph.theta = 0;
        sph.radius = 70;
      }
      placeCamera();
    };

    fitCtl.current = () => frameModel();

    // INTERACCIÓN CON EL MOUSE: ROTACIÓN (CLICK IZQUIERDO) Y PANEO (CLICK DERECHO)
    let isRotating = false;
    let isPanning = false;
    let px = 0;
    let py = 0;
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e) => {
      px = e.clientX;
      py = e.clientY;
      startX = e.clientX;
      startY = e.clientY;

      // Section box: agarrar una cara/asa para moverla
      const ss = secStateRef.current;
      if (ss && sectionRef.current?.on && ss.bounds && e.button === 0) {
        const rect0 = dom.getBoundingClientRect();
        const mv = new THREE.Vector2(((e.clientX - rect0.left) / rect0.width) * 2 - 1, -((e.clientY - rect0.top) / rect0.height) * 2 + 1);
        raycaster.setFromCamera(mv, camera);
        const hit = raycaster.intersectObjects(ss.handles, false)[0];
        if (hit) {
          ss.dragging = { axis: hit.object.userData.axis, side: hit.object.userData.side, grab: hit.object.position.clone() };
          dom.style.cursor = 'grabbing';
          return;
        }
      }
      if (e.button === 2 || e.button === 1) {
        // Click derecho o central -> MOVER LA ISLA (PAN)
        isPanning = true;
      } else if (e.button === 0) {
        // Click izquierdo -> ROTAR ÓRBITA
        isRotating = true;
      }
    };

    const onPointerMove = (e) => {
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;

      const ssd = secStateRef.current;
      if (ssd && ssd.dragging) {
        const rect1 = dom.getBoundingClientRect();
        const mv = new THREE.Vector2(((e.clientX - rect1.left) / rect1.width) * 2 - 1, -((e.clientY - rect1.top) / rect1.height) * 2 + 1);
        raycaster.setFromCamera(mv, camera);
        const ray = raycaster.ray;
        const axisDir = new THREE.Vector3();
        axisDir[ssd.dragging.axis] = 1;
        const P = ssd.dragging.grab;
        const w0 = P.clone().sub(ray.origin);
        const b = axisDir.dot(ray.direction);
        const d0 = axisDir.dot(w0);
        const e0 = ray.direction.dot(w0);
        const den = 1 - b * b;
        if (Math.abs(den) > 1e-4) {
          const t = (b * e0 - d0) / den;
          const val = P[ssd.dragging.axis] + t;
          const bd = ssd.bounds;
          const ax = ssd.dragging.axis;
          const norm = Math.max(0, Math.min(1, (val - bd.min[ax]) / (bd.max[ax] - bd.min[ax])));
          const cur = sectionRef.current[ax];
          const next = ssd.dragging.side === 'min' ? [Math.min(norm, cur[1] - 0.02), cur[1]] : [cur[0], Math.max(norm, cur[0] + 0.02)];
          if (onSectionChangeRef.current) onSectionChangeRef.current({ ...sectionRef.current, [ax]: next });
        }
        return;
      }

      // Anillo guía sobre el terreno mientras se dibuja
      if (!isRotating && !isPanning && hoverRingRef.current) {
        const ring = hoverRingRef.current;
        const hf = heightFieldRef.current;
        if (planModeRef.current !== 'none' && hf && e.target === dom) {
          const rect = dom.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
          const hit = hf.pickRay(raycaster.ray);
          if (hit) {
            ring.position.set(hit.x, hit.y + 0.07, hit.z);
            ring.visible = true;
          } else {
            ring.visible = false;
          }
        } else {
          ring.visible = false;
        }
      }

      if (isPanning) {
        // Paneo suave en el plano de la cámara
        const fwd = new THREE.Vector3().subVectors(target, camera.position).normalize();
        const rgt = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
        const upv = new THREE.Vector3().crossVectors(rgt, fwd).normalize();

        const panFactor = sph.radius * 0.0018;
        target.addScaledVector(rgt, -dx * panFactor);
        target.addScaledVector(upv, dy * panFactor);
        placeCamera();
      } else if (isRotating) {
        sph.theta -= dx * 0.0055;
        sph.phi = Math.max(0.06, Math.min(Math.PI / 2 - 0.02, sph.phi - dy * 0.0055));
        placeCamera();
      }
    };

    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onPointerUp = (e) => {
      isRotating = false;
      isPanning = false;
      if (secStateRef.current && secStateRef.current.dragging) {
        secStateRef.current.dragging = null;
        dom.style.cursor = '';
        return;
      }

      const distMoved = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (distMoved < 6) {
        const rect = dom.getBoundingClientRect();
        mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseCoord, camera);

        // 1. Detección de clics en las 3 viviendas analizadas
        const houseMeshes = Object.values(housesMeshesRef.current).filter(Boolean);
        const hitsHouses = raycaster.intersectObjects(houseMeshes, true);
        if (hitsHouses.length > 0) {
          const hitMesh = hitsHouses[0].object;
          for (const [id, m] of Object.entries(housesMeshesRef.current)) {
            if (m === hitMesh) {
              onSelectHouse(Number(id));
              return;
            }
          }
        }

        // 1a. Modo marcar uso del suelo: clic sobre un edificio
        if (usosRef.current?.paint && edificiosRef.current && buildingMeshesRef.current.length && e.target === dom) {
          const hits = raycaster.intersectObjects(buildingMeshesRef.current, false);
          if (hits.length > 0 && hits[0].face) {
            const id = edificiosRef.current.vert[hits[0].face.a];
            if (id !== undefined && onTagBuildingRef.current) onTagBuildingRef.current(id);
          }
          return;
        }

        // 1b. Modo dibujo de vías / zonas: marcar punto sobre el terreno
        if (planModeRef.current !== 'none' && heightFieldRef.current && e.target === dom) {
          const hit = heightFieldRef.current.pickRay(raycaster.ray);
          if (hit && onPlanPointRef.current) onPlanPointRef.current({ x: hit.x, y: hit.y, z: hit.z });
          return;
        }

        // 2. Si el modo plantar árbol está activo, colocarlo en la superficie
        if (isPlantingTreeRef.current && modelRef.current) {
          const hits = raycaster.intersectObjects(modelRef.current.children, true);
          const validHit = hits.find((h) => {
            const name = (h.object.name || '').toLowerCase();
            return !name.includes('water') && !name.includes('skirt') && h.point.y > 0.08;
          });

          if (validHit) {
            const pt = validHit.point;
            const newTree = {
              id: 'tree_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              x: pt.x,
              y: pt.y - 0.01,
              z: pt.z,
              scale: plantScaleRef.current || 1.0,
              rotY: Math.random() * Math.PI * 2
            };
            if (onAddTreeRef.current) onAddTreeRef.current(newTree);
          } else {
            if (onSelectTreeRef.current) onSelectTreeRef.current(null);
          }
        } else {
          if (onSelectTreeRef.current) onSelectTreeRef.current(null);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(2.5, Math.min(260, sph.radius * (e.deltaY > 0 ? 1.09 : 0.91)));
      placeCamera();
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const dom = renderer.domElement;
    const onDblClick = () => {
      if (planModeRef.current !== 'none' && onPlanFinishRef.current) onPlanFinishRef.current();
    };
    dom.addEventListener('dblclick', onDblClick);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    const onResize = () => {
      if (!container) return;
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animación continua con oleaje suave y pulsación sutil de casas rojas
    const clock = new THREE.Clock();
    let rafId = 0;
    let lastMobT = performance.now();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const nowM = performance.now();
      if (mobilityRef.current && layersRef.current?.mobility !== false) {
        try {
          mobilityRef.current.update((nowM - lastMobT) / 1000);
        } catch (err) {
          console.warn("Movilidad detenida por un error:", err);
          mobilityRef.current = null;
        }
      }
      lastMobT = nowM;
      const elapsed = clock.getElapsedTime();

      if (waveActiveRef.current) {
        if (waterDiffuseTex) {
          waterDiffuseTex.offset.x = (elapsed * 0.010) % 1;
          waterDiffuseTex.offset.y = (elapsed * 0.007) % 1;
        }
        if (waterNormalTex) {
          waterNormalTex.offset.x = (elapsed * 0.016) % 1;
          waterNormalTex.offset.y = (elapsed * 0.012) % 1;
        }
      }

      if (oceanMesh.material.uniforms.time) {
        const dt = clock.getDelta ? 0 : 0;
        void dt;
        if (waveActiveRef.current) oceanMesh.material.uniforms.time.value = elapsed * 0.55;
      }

      const ssn = secStateRef.current;
      if (ssn && sectionRef.current?.on && ++ssn.lastClip % 45 === 0) applySectionRef.current && applySectionRef.current();
      if (ssn && sectionRef.current?.on) ssn.handles.forEach((h) => h.children[0].quaternion.copy(camera.quaternion));

      const pulse = 0.25 + 0.12 * Math.sin(elapsed * 3.5);
      if (houseRedSoftMat) {
        houseRedSoftMat.emissiveIntensity = pulse;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('dblclick', onDblClick);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
      if (skyTex) skyTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (dom.parentNode === container) container.removeChild(dom);
    };
  }, []);

  // Preset de vistas
  useEffect(() => {
    if (applyViewRef.current) applyViewRef.current(preset);
  }, [preset, presetNonce]);

  // Centrado de cámara
  useEffect(() => {
    if (fitNonce > 0 && fitCtl.current) fitCtl.current();
  }, [fitNonce]);

  // Cambio de color de la malla de caminos en vivo (Arena / Azul Revit)
  useEffect(() => {
    if (roadsMeshRef.current && roadsMeshRef.current.length > 0) {
      const mat = roadColorMode === 'blue' ? roadMatBlueRef.current : roadMatSandRef.current;
      roadsMeshRef.current.forEach((m) => {
        if (m) m.material = mat;
      });
    }
  }, [roadColorMode]);

  // Resaltado de la vivienda seleccionada
  useEffect(() => {
    if (!housesMeshesRef.current) return;
    Object.entries(housesMeshesRef.current).forEach(([idStr, m]) => {
      if (!m) return;
      const isCurrent = Number(idStr) === selectedHouseId;
      m.material = isCurrent ? houseMatSelectedRef.current : houseMatNormalRef.current;
    });
  }, [selectedHouseId]);

  // Capas: imagen satelital, vegetación real, vías del modelo
  useEffect(() => {
    if (!layers) return;
    terrainMeshesRef.current.forEach((m) => {
      const target = layers.satellite && satMatRef.current ? satMatRef.current : m.userData.origMat;
      if (target) m.material = target;
    });
    if (realTreesRef.current) realTreesRef.current.visible = layers.realTrees !== false;
    if (mobilityRef.current) mobilityRef.current.group.visible = layers.mobility !== false;
    roadsMeshRef.current.forEach((m) => {
      if (!m) return;
      m.visible = true;
      const sat = layers.satellite && !layers.modelRoads && satMatRef.current;
      const target = sat ? satMatRef.current : (m.userData.origMat || m.material);
      if (target) m.material = target;
    });
  }, [layers, hfNonce, templatesNonce]);

  // Usos del suelo: color por edificio + iconos de equipamientos
  useEffect(() => {
    const data = edificiosRef.current;
    const meshes = buildingMeshesRef.current;
    const root = rootRef.current;
    if (!data || !meshes.length || !root) return;
    const tags = {};
    Object.entries(data.usosOSM || {}).forEach(([id, v]) => { tags[id] = v.u; });
    Object.entries(usos?.tags || {}).forEach(([id, u]) => { if (u === 'none') delete tags[id]; else tags[id] = u; });

    meshes.forEach((m) => {
      const n = m.geometry.attributes.position.count;
      if (n !== data.vert.length) return;
      let colAttr = m.geometry.attributes.color;
      if (!colAttr) {
        colAttr = new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3);
        m.geometry.setAttribute('color', colAttr);
      }
      const arr = colAttr.array;
      const cache = {};
      for (let v = 0; v < n; v++) {
        const id = data.vert[v];
        const u = tags[id];
        let c;
        if (u) { c = cache[u] || (cache[u] = useColor(u)); arr[v * 3] = c.r; arr[v * 3 + 1] = c.g; arr[v * 3 + 2] = c.b; }
        else { arr[v * 3] = arr[v * 3 + 1] = arr[v * 3 + 2] = 1; }
      }
      colAttr.needsUpdate = true;
      if (!buildingUseMatRef.current) {
        buildingUseMatRef.current = buildingMatRef.current.clone();
        buildingUseMatRef.current.vertexColors = true;
        buildingUseMatRef.current.emissiveIntensity = 0.04;
        buildingUseMatRef.current.needsUpdate = true;
      }
      m.material = usos?.enabled ? buildingUseMatRef.current : buildingMatRef.current;
    });

    // iconos de equipamientos (todo lo marcado distinto de vivienda)
    if (useIconsRef.current) {
      root.remove(useIconsRef.current);
      useIconsRef.current.traverse((o) => { if (o.material?.map) o.material.map.dispose(); if (o.material) o.material.dispose(); });
    }
    const grp = new THREE.Group();
    grp.name = 'IconosUsos';
    const counts = {};
    const parent = modelRef.current;
    const tmp = new THREE.Vector3();
    Object.entries(tags).forEach(([id, u]) => {
      counts[u] = (counts[u] || 0) + 1;
      if (u === 'vivienda' || !parent) return;
      const info = USOS.find((x) => x.id === u);
      const c = data.centroides[id];
      if (!info || !c || !info.icon) return;
      tmp.set(c[0], c[1], c[2] + 6);
      parent.localToWorld(tmp);
      const sp = iconSprite(info.icon, info.color);
      sp.position.copy(tmp);
      grp.add(sp);
    });
    grp.visible = !!usos?.enabled;
    root.add(grp);
    useIconsRef.current = grp;
    if (onUsosStatsRef.current) onUsosStatsRef.current(counts);
  }, [usos?.tags, usos?.enabled, usosNonce]);

  // Section box
  useEffect(() => {
    if (applySectionRef.current) applySectionRef.current();
  }, [section]);

  // Visibilidad de árboles
  useEffect(() => {
    if (treesGroupRef.current) {
      treesGroupRef.current.visible = treesVisible !== false;
    }
    if (dynamicTreesGroupRef.current) {
      dynamicTreesGroupRef.current.visible = treesVisible !== false;
    }
  }, [treesVisible]);

  // Color del mar
  useEffect(() => {
    if (waterMatRef.current && waterColor) {
      waterMatRef.current.color.set(waterColor);
    }
  }, [waterColor]);

  // Árboles plantados a mano por el usuario: modelos reales de árbol (Poly Haven)
  useEffect(() => {
    const grp = dynamicTreesGroupRef.current;
    const tpl = treeTemplatesRef.current;
    if (!grp || !tpl) return;

    while (grp.children.length > 0) {
      grp.remove(grp.children[0]);
    }

    if (!treesList || treesList.length === 0) return;

    treesList.forEach((t, i) => {
      const clone = tpl[i % tpl.length].clone(true);
      const isSel = t.id === selectedTreeId;
      const height = 0.19 * (t.scale || 1.0) * (isSel ? 1.25 : 1.0);
      clone.scale.set(height, height, height);
      clone.position.set(t.x, t.y, t.z);
      clone.rotation.y = t.rotY || 0;
      clone.userData = { treeId: t.id };
      grp.add(clone);
    });
  }, [treesList, selectedTreeId, templatesNonce]);

  // Vías y zonas dibujadas: se reconstruyen sobre el terreno
  useEffect(() => {
    const grp = planGroupRef.current;
    const hf = heightFieldRef.current;
    if (!grp || !hf) return;
    while (grp.children.length > 0) {
      const o = grp.children[0];
      grp.remove(o);
      disposeObject(o);
    }
    (zones || []).forEach((z) => grp.add(buildZoneObject(z, hf.heightAt)));
    (roads || []).forEach((r) => grp.add(buildRoadObject(r, hf.heightAt, roadPlanMatsRef.current)));
  }, [roads, zones, hfNonce]);

  // Borrador mientras se dibuja
  useEffect(() => {
    const grp = draftGroupRef.current;
    const hf = heightFieldRef.current;
    if (!grp || !hf) return;
    while (grp.children.length > 0) {
      const o = grp.children[0];
      grp.remove(o);
      disposeObject(o);
    }
    if (planMode === 'none' || !draftPoints || draftPoints.length === 0) return;
    const zt = ZONE_TYPES.find((z) => z.id === zoneType) || ZONE_TYPES[0];
    grp.add(buildDraftObject(planMode, draftPoints, { color: zt.color, width: roadWidth }, hf.heightAt));
  }, [draftPoints, planMode, zoneType, roadWidth, hfNonce]);

  // Wireframe toggle
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.traverse((c) => {
      if (c.isMesh) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach((m) => { if (m && 'wireframe' in m) m.wireframe = wireframe; });
      }
    });
  }, [wireframe]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[600px] cursor-grab active:cursor-grabbing select-none block"
      style={{ width: '100%', height: '100%', minHeight: '600px' }}
    />
  );
}

export default function RevitModule() {
  const [viewPreset, setViewPreset] = useState('axon');
  const [presetNonce, setPresetNonce] = useState(0);
  const [fitNonce, setFitNonce] = useState(0);
  const [modelStats, setModelStats] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveActive, setWaveActive] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [roadColorMode, setRoadColorMode] = useState('sand'); // 'sand' | 'blue'
  const [treesVisible, setTreesVisible] = useState(true);
  const [waterColor, setWaterColor] = useState('#1ea4c8');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [localFile, setLocalFile] = useState(null);
  const fileInputRef = useRef(null);

  // Herramienta de Vegetación Interactiva y Persistente
  const [treesList, setTreesList] = useState(() => getSavedTrees(STORAGE_KEY_REVIT));
  const [isPlantingTree, setIsPlantingTree] = useState(false);
  const [plantScale, setPlantScale] = useState(1.0);
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [showTreeToolbar, setShowTreeToolbar] = useState(false);

  // Propuesta territorial / Plan Maestro (tarjeta que antes vivía en el módulo 02)
  const [showMasterplan, setShowMasterplan] = useState(true);
  const [masterplanStep, setMasterplanStep] = useState(0);

  // Section box (corte tipo Revit)
  const SECTION_FULL = { on: false, x: [0, 1], y: [0, 1], z: [0, 1] };
  const [section, setSection] = useState(SECTION_FULL);
  const [showSectionPanel, setShowSectionPanel] = useState(false);
  const setAxis = (axis, i, v) => setSection((s) => {
    const a = [...s[axis]];
    a[i] = v;
    if (i === 0 && a[0] > a[1] - 0.02) a[0] = a[1] - 0.02;
    if (i === 1 && a[1] < a[0] + 0.02) a[1] = a[0] + 0.02;
    return { ...s, [axis]: a };
  });
  const quickSection = (kind) => {
    if (kind === 'ew') setSection({ on: true, x: [0, 1], y: [0, 1], z: [0.44, 0.5] });
    if (kind === 'ns') setSection({ on: true, x: [0.44, 0.5], y: [0, 1], z: [0, 1] });
    if (kind === 'plan') setSection({ on: true, x: [0, 1], y: [0, 0.16], z: [0, 1] });
    if (kind === 'reset') setSection({ ...SECTION_FULL, on: true });
  };

  // Usos del suelo marcados por el equipo (se guardan en el navegador)
  const [userTags, setUserTags] = useState(() => loadUserTags());
  const [usosOn, setUsosOn] = useState(false);
  const [paintUse, setPaintUse] = useState(null);
  const [usoCounts, setUsoCounts] = useState({});
  const tagBuilding = (id) => {
    const target = paintUseRef.current;
    if (!target) return;
    setUserTags((prev) => {
      const next = { ...prev };
      if (target === 'none') next[id] = 'none'; else next[id] = target;
      saveUserTags(next);
      return next;
    });
  };
  const paintUseRef = useRef(null);
  paintUseRef.current = paintUse;
  const exportUsos = () => {
    const blob = new Blob([JSON.stringify({ fuente: 'Levantamiento de usos Tierrabomba (tesis 2026)', usos: userTags }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'usos_tierrabomba.json';
    a.click();
  };

  // Capas territoriales (datos reales)
  const [layers, setLayers] = useState({ satellite: true, realTrees: true, modelRoads: false, mobility: true });
  const [realTreeCount, setRealTreeCount] = useState(0);
  const [mobilityCount, setMobilityCount] = useState({ motos: 0, bikes: 0 });
  const toggleLayer = (k) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  // Vías y zonificación
  const [showPlanToolbar, setShowPlanToolbar] = useState(false);
  const [planMode, setPlanMode] = useState('none'); // 'none' | 'road' | 'zone'
  const [zoneType, setZoneType] = useState('vivienda');
  const [zoneName, setZoneName] = useState('');
  const [roadWidth, setRoadWidth] = useState(0.18);
  const [draftPoints, setDraftPoints] = useState([]);
  const [roads, setRoads] = useState(() => loadList(STORAGE_ROADS));
  const [zones, setZones] = useState(() => loadList(STORAGE_ZONES));
  const planRef = useRef({});
  planRef.current = { planMode, draftPoints, zoneType, zoneName, roadWidth, roads, zones };

  const handlePlanPoint = (pt) => {
    setDraftPoints((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(last.x - pt.x, last.z - pt.z) < 0.06) return prev;
      return [...prev, pt];
    });
  };

  const handlePlanFinish = () => {
    const { planMode: mode, draftPoints: pts, zoneType: zt, zoneName: zn, roadWidth: rw, roads: rs, zones: zs } = planRef.current;
    if (mode === 'road' && pts.length >= 2) {
      const next = [...rs, { id: 'road_' + Date.now(), width: rw, points: pts.map(({ x, z }) => ({ x, z })) }];
      setRoads(next);
      saveList(STORAGE_ROADS, next);
    } else if (mode === 'zone' && pts.length >= 3) {
      const t = ZONE_TYPES.find((z) => z.id === zt) || ZONE_TYPES[0];
      const next = [...zs, { id: 'zone_' + Date.now(), type: zt, name: (zn || '').trim() || t.name, points: pts.map(({ x, z }) => ({ x, z })) }];
      setZones(next);
      saveList(STORAGE_ZONES, next);
      setZoneName('');
    } else {
      return;
    }
    setDraftPoints([]);
  };

  const changePlanMode = (m) => {
    setPlanMode(m);
    setDraftPoints([]);
    if (m !== 'none') setIsPlantingTree(false);
  };

  const deleteRoad = (id) => {
    const next = roads.filter((r) => r.id !== id);
    setRoads(next);
    saveList(STORAGE_ROADS, next);
  };
  const deleteZone = (id) => {
    const next = zones.filter((z) => z.id !== id);
    setZones(next);
    saveList(STORAGE_ZONES, next);
  };
  const clearPlan = () => {
    if (!window.confirm('¿Eliminar todas las vías y zonas dibujadas?')) return;
    setRoads([]); setZones([]);
    saveList(STORAGE_ROADS, []); saveList(STORAGE_ZONES, []);
  };

  const handleAddTree = (newTree) => {
    const updated = [...treesList, newTree];
    setTreesList(updated);
    saveTrees(STORAGE_KEY_REVIT, updated);
    setSelectedTreeId(newTree.id);
  };

  const handleScaleChange = (treeId, newScale) => {
    const updated = treesList.map((t) => (t.id === treeId ? { ...t, scale: newScale } : t));
    setTreesList(updated);
    saveTrees(STORAGE_KEY_REVIT, updated);
  };

  const handleDeleteTree = (treeId) => {
    const updated = treesList.filter((t) => t.id !== treeId);
    setTreesList(updated);
    saveTrees(STORAGE_KEY_REVIT, updated);
    setSelectedTreeId(null);
  };

  const handleClearAllTrees = () => {
    if (window.confirm('¿Deseas eliminar todos los árboles colocados en la isla?')) {
      setTreesList([]);
      saveTrees(STORAGE_KEY_REVIT, []);
      setSelectedTreeId(null);
    }
  };

  // Estados para la interacción con las 3 viviendas y popup animado
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('foto');
  const [saveToast, setSaveToast] = useState(false);
  const pdfInputRef = useRef(null);

  const saveViewTriggerRef = useRef(() => false);
  const resetViewTriggerRef = useRef(() => false);

  const pickView = (name) => {
    setViewPreset(name);
    setPresetNonce((n) => n + 1);
  };

  const handleSaveView = () => {
    if (saveViewTriggerRef.current) {
      const ok = saveViewTriggerRef.current();
      if (ok) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3500);
      }
    }
  };

  const handleResetView = () => {
    if (resetViewTriggerRef.current) {
      resetViewTriggerRef.current();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && planRef.current.planMode !== 'none') {
        handlePlanFinish();
        return;
      }
      if (e.key === 'Escape' && planRef.current.planMode !== 'none') {
        setDraftPoints([]);
        return;
      }
      if (e.key === 'Escape') {
        if (selectedHouseId) setSelectedHouseId(null);
        else if (isFullscreen) setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen, selectedHouseId]);

  const activeHouse = HOUSES_DATA.find((h) => h.id === selectedHouseId);

  const handleCustomPdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`¡Archivo "${file.name}" cargado! Se han actualizado las fichas de las viviendas.`);
    }
  };

  return (
    <div
      className={`w-full relative overflow-hidden bg-slate-900 font-sans ${
        isFullscreen
          ? '!fixed !inset-0 !z-[9999] !h-screen !min-h-screen'
          : 'h-[calc(100vh-4rem)] min-h-[600px]'
      }`}
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 4rem)',
        minHeight: '600px',
        width: '100%'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".fbx,.glb,.gltf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setIsLoading(true);
            setLocalFile(file);
          }
        }}
        className="hidden"
      />

      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleCustomPdfUpload}
        className="hidden"
      />

      {/* Visor 3D de Render a pantalla completa */}
      <div className="absolute inset-0 w-full h-full">
        <RenderViewer
          onStats={setModelStats}
          onProgress={(p) => setLoadingProgress(p)}
          onLoaded={() => setIsLoading(false)}
          preset={viewPreset}
          presetNonce={presetNonce}
          fitNonce={fitNonce}
          waveActive={waveActive}
          wireframe={wireframe}
          roadColorMode={roadColorMode}
          localFile={localFile}
          selectedHouseId={selectedHouseId}
          onSelectHouse={(id) => {
            setSelectedHouseId(id);
            setActiveModalTab('foto');
          }}
          onSaveCurrentViewTrigger={saveViewTriggerRef}
          onResetViewTrigger={resetViewTriggerRef}
          treesVisible={treesVisible}
          waterColor={waterColor}
          treesList={treesList}
          isPlantingTree={isPlantingTree}
          plantScale={plantScale}
          selectedTreeId={selectedTreeId}
          onSelectTree={setSelectedTreeId}
          onAddTree={handleAddTree}
          planMode={planMode}
          zoneType={zoneType}
          roadWidth={roadWidth}
          draftPoints={draftPoints}
          roads={roads}
          zones={zones}
          onPlanPoint={handlePlanPoint}
          onPlanFinish={handlePlanFinish}
          layers={layers}
          onMobility={setMobilityCount}
          onRealTrees={setRealTreeCount}
          usos={{ enabled: usosOn, tags: userTags, paint: paintUse }}
          onTagBuilding={tagBuilding}
          onUsosStats={setUsoCounts}
          section={section}
          onSectionChange={setSection}
        />
      </div>

      {/* Pantalla de Carga interactiva */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-3xl">🏝️</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">
              {localFile ? 'Procesando archivo 3D de Revit...' : 'Cargando Modelo Revit · Tierrabomba'}
            </p>
            <p className="text-xs font-mono text-emerald-400 font-bold">
              {loadingProgress > 0 ? `${loadingProgress}% procesado` : 'Iniciando modelo arquitectónico...'}
            </p>
          </div>
          <div className="w-72 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(16, loadingProgress)}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-300 text-center max-w-sm">
            Isla orgánica en pasto natural claro, cubos en blanco puro, vías de arena, árboles de render y 3 viviendas diagnósticas.
          </p>
        </div>
      )}

      {/* Header flotante */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
            MÓDULO 05 · RENDER REVIT BIM (DIURNO)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-900/80 text-rose-200 border border-rose-700 font-mono text-[10px] backdrop-blur-md shadow-sm flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>3 Viviendas Analizadas</span>
          </span>
        </div>
        <h1 className="text-slate-900 font-extrabold text-xl sm:text-2xl tracking-tight drop-shadow-sm">
          Tierrabomba · Modelo Revit
        </h1>
        <p className="text-slate-700 text-xs font-mono drop-shadow-sm max-w-md hidden sm:block">
          Click derecho para mover (pan) · Click izquierdo para rotar · Click en vivienda roja para diagnóstico.
        </p>
      </div>

      {/* Botones de acción superior derecha */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center justify-end gap-2 max-w-[66%]">
        {/* Selector de color del mar caribe */}
        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 px-1">Mar:</span>
          {[
            { label: 'Océano Caribe Profundo', color: '#0c3d5f' },
            { label: 'Bahía Turquesa', color: '#1a6b85' },
            { label: 'Celeste Costero', color: '#4aa0bc' },
            { label: 'Azul Marino Natural', color: '#08253a' }
          ].map((p) => (
            <button
              key={p.color}
              onClick={() => setWaterColor(p.color)}
              style={{ backgroundColor: p.color }}
              className={`w-5 h-5 rounded-lg border-2 transition-transform hover:scale-110 cursor-pointer ${
                waterColor === p.color ? 'border-slate-900 dark:border-white ring-2 ring-emerald-400 scale-105' : 'border-white/50'
              }`}
              title={`Mar Caribe: ${p.label}`}
            />
          ))}
        </div>

        {/* Toggle Árboles de Render */}
        <button
          onClick={() => setTreesVisible((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ${
            treesVisible
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-white'
          }`}
          title="Mostrar u ocultar los árboles de render distribuidos por la isla"
        >
          <span>{treesVisible ? '🌲 Árboles Render ON' : '🌱 Árboles OFF'}</span>
        </button>

        {/* Propuesta territorial */}
        <button
          onClick={() => setShowMasterplan((v) => !v)}
          className={'px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ' + (showMasterplan ? 'bg-amber-500 text-white border-amber-300' : 'bg-white/90 hover:bg-white text-slate-800 border-slate-300')}
          title="Propuesta territorial 2026 · Plan Maestro Tierra Bomba"
        >
          <span>{showMasterplan ? 'Cerrar Propuesta' : '📍 Propuesta territorial'}</span>
        </button>

        {/* Section Box tipo Revit */}
        <button
          onClick={() => {
            const v = !showSectionPanel;
            setShowSectionPanel(v);
            setSection((s) => ({ ...s, on: v }));
          }}
          className={'px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ' + (showSectionPanel ? 'bg-orange-600 text-white border-orange-400' : 'bg-white/90 hover:bg-white text-slate-800 border-slate-300')}
          title="Caja de sección para hacer cortes del modelo, como en Revit"
        >
          <span>{showSectionPanel ? 'Cerrar Section Box' : '✂️ Section Box'}</span>
        </button>

        {/* Herramienta de vías y zonificación */}
        <button
          onClick={() => {
            const v = !showPlanToolbar;
            setShowPlanToolbar(v);
            if (!v) changePlanMode('none');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ${
            showPlanToolbar
              ? 'bg-amber-600 text-white border-amber-400'
              : 'bg-white/90 hover:bg-white text-slate-800 border-slate-300'
          }`}
          title="Dibujar vías nuevas y zonificar el territorio"
        >
          <span>{showPlanToolbar ? 'Cerrar Planeación' : '🗺️ Vías y Zonas'}</span>
        </button>

        {/* Herramienta de Vegetación */}
        <button
          onClick={() => setShowTreeToolbar((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ${
            showTreeToolbar
              ? 'bg-emerald-700 text-white border-emerald-500 shadow-emerald-500/20'
              : 'bg-white/90 hover:bg-white text-slate-800 border-slate-300'
          }`}
          title="Herramienta interactiva para plantar y escalar árboles"
        >
          <span>{showTreeToolbar ? 'Cerrar Vegetación' : '🌱 Plantar Árboles'}</span>
        </button>

        {/* BOTÓN: DEJAR ASÍ PARA SIEMPRE (GUARDAR VISTA) */}
        <button
          onClick={handleSaveView}
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 backdrop-blur-md transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
          title="Fijar y guardar esta perspectiva como la vista predeterminada para siempre"
        >
          <span>📌 Dejar así para siempre</span>
        </button>

        {/* Botón para alternar color de las vías: Arena Realista / Azul Revit */}
        <button
          onClick={() => setRoadColorMode((m) => (m === 'sand' ? 'blue' : 'sand'))}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md flex items-center space-x-1.5 cursor-pointer ${
            roadColorMode === 'blue'
              ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
          }`}
          title="Alternar textura de las vías entre Arena Realista y Azul de selección de Revit"
        >
          <span>🛣️ Vías: {roadColorMode === 'blue' ? 'Azul Revit' : 'Arena Realista'}</span>
        </button>

        <button
          onClick={() => setWaveActive((w) => !w)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md cursor-pointer ${
            waveActive
              ? 'bg-cyan-700/90 border-cyan-400 text-white hover:bg-cyan-600'
              : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-white'
          }`}
          title="Pausar o activar movimiento del mar"
        >
          {waveActive ? '🌊 Oleaje Activo' : '⏸ Mar Pausado'}
        </button>

        {/* Tono del Mar Caribe */}
        <button
          onClick={() => {
            const tones = ['#1ea4c8', '#26c6da', '#0ea5e9', '#0284c7'];
            const curIdx = tones.indexOf(waterColor);
            const nextIdx = curIdx >= 0 ? (curIdx + 1) % tones.length : 0;
            setWaterColor(tones[nextIdx]);
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border border-cyan-300 bg-cyan-500/80 hover:bg-cyan-500 text-white transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          title="Alternar tono caribeño del agua"
        >
          <span>💧 Tono Mar Caribe</span>
        </button>

        <button
          onClick={() => setWireframe((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-md cursor-pointer ${
            wireframe
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-white'
          }`}
          title="Alternar entre modo Render y Wireframe"
        >
          {wireframe ? 'Wireframe' : 'Render Sólido'}
        </button>

        <button
          onClick={() => setIsFullscreen((v) => !v)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md transition-all shadow-md cursor-pointer"
          title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir a pantalla completa'}
        >
          {isFullscreen ? '✕ Salir' : '⛶ Pantalla completa'}
        </button>
      </div>

      {/* TOAST NOTIFICACIÓN AL GUARDAR VISTA */}
      {saveToast && (
        <div className="absolute top-16 right-4 z-40 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs font-bold flex items-center space-x-2 animate-bounce border border-emerald-400">
          <span>✨</span>
          <span>¡Vista guardada para siempre! Esta será la perspectiva al abrir el visor.</span>
        </div>
      )}

      {showMasterplan && (
        <MasterplanCard step={masterplanStep} setStep={setMasterplanStep} onClose={() => setShowMasterplan(false)} className="top-36" />
      )}

      {showSectionPanel && (
        <div className="absolute right-4 bottom-24 z-30 w-72 rounded-2xl bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-md p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold tracking-widest text-orange-600 uppercase">Section Box</p>
              <p className="text-[11px] text-slate-500 leading-snug">Arrastra las asas blancas de la caja o usa los controles</p>
            </div>
            <button
              onClick={() => setSection((s) => ({ ...s, on: !s.on }))}
              className={'px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ' + (section.on ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700')}
            >{section.on ? 'Activo' : 'Apagado'}</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={() => quickSection('ew')} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-white border border-slate-200 text-slate-800 cursor-pointer">Corte E–O</button>
            <button onClick={() => quickSection('ns')} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-white border border-slate-200 text-slate-800 cursor-pointer">Corte N–S</button>
            <button onClick={() => quickSection('plan')} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-white border border-slate-200 text-slate-800 cursor-pointer">Planta (nivel bajo)</button>
            <button onClick={() => quickSection('reset')} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-white border border-slate-200 text-slate-800 cursor-pointer">Mostrar todo</button>
          </div>
          {[
            ['x', 'Oeste', 'Este'],
            ['z', 'Norte', 'Sur'],
            ['y', 'Base', 'Tope']
          ].map(([axis, a, b]) => (
            <div key={axis} className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500"><span>{a}</span><span>{b}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <input type="range" min="0" max="1" step="0.005" value={section[axis][0]} onChange={(e) => setAxis(axis, 0, parseFloat(e.target.value))} className="w-full accent-orange-500" />
                <input type="range" min="0" max="1" step="0.005" value={section[axis][1]} onChange={(e) => setAxis(axis, 1, parseFloat(e.target.value))} className="w-full accent-orange-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showPlanToolbar && (
        <PlanningToolbar
          mode={planMode}
          setMode={changePlanMode}
          zoneType={zoneType}
          setZoneType={setZoneType}
          zoneName={zoneName}
          setZoneName={setZoneName}
          roadWidth={roadWidth}
          setRoadWidth={setRoadWidth}
          draftCount={draftPoints.length}
          onFinish={handlePlanFinish}
          onUndo={() => setDraftPoints((p) => p.slice(0, -1))}
          onCancel={() => setDraftPoints([])}
          roads={roads}
          zones={zones}
          onDeleteRoad={deleteRoad}
          onDeleteZone={deleteZone}
          onClearPlan={clearPlan}
          onClose={() => { setShowPlanToolbar(false); changePlanMode('none'); }}
        />
      )}

      {/* BARRA DE HERRAMIENTAS DE VEGETACIÓN INTERACTIVA */}
      {showTreeToolbar && (
        <div className="absolute top-32 right-4 z-30 flex flex-col space-y-2 bg-white/95 dark:bg-slate-900/95 p-3 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-md w-72">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-emerald-400 flex items-center space-x-1.5">
              <span>🌱</span>
              <span>Herramienta Vegetación</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">{treesList.length} plantados</span>
          </div>

          <button
            onClick={() => setIsPlantingTree((v) => !v)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isPlantingTree
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span>{isPlantingTree ? '✓ Modo Plantar Activo' : '➕ Click para Plantar'}</span>
          </button>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <span>Tamaño al plantar:</span>
              <span className="font-bold text-emerald-600">{plantScale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={plantScale}
              onChange={(e) => setPlantScale(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {selectedTreeId && (
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-500 block">ÁRBOL SELECCIONADO</span>
              <button
                onClick={() => handleDeleteTree(selectedTreeId)}
                className="w-full py-1 text-center rounded-lg text-[11px] font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                🗑 Eliminar seleccionado
              </button>
            </div>
          )}

          {treesList.length > 0 && (
            <button
              onClick={handleClearAllTrees}
              className="w-full py-1 text-center rounded-lg text-[10px] font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            >
              Borrar todos los árboles plantados
            </button>
          )}
        </div>
      )}

      {/* SELECTOR DIRECTO DE LAS 3 VIVIENDAS EN LA ISLA */}
      <div className="absolute top-32 left-4 z-10 flex flex-col space-y-2 pointer-events-none">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 bg-white/80 backdrop-blur px-2 py-0.5 rounded-md border border-slate-300 w-fit">
          Diagnóstico de Viviendas
        </span>
        <div className="flex flex-col space-y-1.5 pointer-events-auto">
          {HOUSES_DATA.map((h) => (
            <button
              key={h.id}
              onClick={() => {
                setSelectedHouseId(h.id);
                setActiveModalTab('foto');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shadow-md cursor-pointer ${
                selectedHouseId === h.id
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400 scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200 hover:border-rose-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>{h.title.split('·')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CAPAS TERRITORIALES (DATOS REALES) */}
      <div className="absolute left-4 bottom-24 z-10 w-72 max-h-[calc(100%-23rem)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md p-3 space-y-2">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-teal-700 uppercase">Capas territoriales</p>
          <p className="text-[11px] text-slate-500 leading-snug">Datos reales de Tierrabomba</p>
        </div>
        {[
          ['satellite', 'Imagen satelital real', 'Esri World Imagery · z18'],
          ['realTrees', 'Vegetación real (' + realTreeCount.toLocaleString('es-CO') + ' árboles)', 'Copas detectadas en la imagen'],
          ['mobility', 'Motos y bicicletas (' + (mobilityCount.motos + mobilityCount.bikes) + ')', 'Circulan por las vías reales · acércate para verlas'],
          ['modelRoads', 'Vías del modelo Revit', 'Malla vial original']
        ].map(([key, label, sub]) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className={'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer border ' + (layers[key] ? 'bg-teal-50 border-teal-300' : 'bg-slate-50 border-slate-200 hover:bg-white')}
          >
            <span className={'w-4 h-4 rounded-md border-2 shrink-0 grid place-items-center text-[10px] font-black ' + (layers[key] ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 text-transparent')}>✓</span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900 truncate">{label}</span>
              <span className="block text-[10px] text-slate-500 truncate">{sub}</span>
            </span>
          </button>
        ))}
        <button
          onClick={() => { setUsosOn((v) => !v); if (usosOn) setPaintUse(null); }}
          className={'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer border ' + (usosOn ? 'bg-teal-50 border-teal-300' : 'bg-slate-50 border-slate-200 hover:bg-white')}
        >
          <span className={'w-4 h-4 rounded-md border-2 shrink-0 grid place-items-center text-[10px] font-black ' + (usosOn ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 text-transparent')}>✓</span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-slate-900">Usos del suelo</span>
            <span className="block text-[10px] text-slate-500">Edificios por uso y equipamientos</span>
          </span>
        </button>
        {usosOn && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] text-slate-500 leading-snug">Elige un uso y haz clic en los edificios del modelo para marcarlos. Solo escuela y hoteles vienen de OpenStreetMap; el resto lo marca el equipo.</p>
            <div className="grid grid-cols-1 gap-1 max-h-52 overflow-y-auto pr-1">
              {USOS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setPaintUse(paintUse === u.id ? null : u.id); setPlanMode('none'); setDraftPoints([]); setIsPlantingTree(false); }}
                  className={'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left cursor-pointer transition-all ' + (paintUse === u.id ? 'bg-white shadow ring-2' : 'hover:bg-white bg-slate-50')}
                  style={paintUse === u.id ? { '--tw-ring-color': u.color } : undefined}
                >
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: u.color }} />
                  <span className="flex-1 font-medium text-slate-800 truncate">{u.icon} {u.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{usoCounts[u.id] || 0}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setPaintUse(paintUse === 'none' ? null : 'none')}
                className={'px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ' + (paintUse === 'none' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-white border border-slate-200')}
              >Quitar uso</button>
              <button onClick={exportUsos} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-white border border-slate-200 cursor-pointer">Exportar JSON</button>
            </div>
            {paintUse && <p className="text-[10px] font-semibold text-amber-700">Modo marcar activo: clic en un edificio · clic de nuevo en el uso para salir</p>}
          </div>
        )}
        <p className="text-[9px] leading-snug text-slate-400">Fuentes: Esri World Imagery · © OpenStreetMap contributors · modelos de árbol Poly Haven (CC0)</p>
      </div>

      {/* POPUP DE ANIMACIÓN DINÁMICO: ESTADO ACTUAL DE LA VIVIENDA */}
      {activeHouse && (
        <div className="absolute inset-0 z-50 flex items-center justify-end p-4 sm:p-8 pointer-events-none bg-slate-950/40 backdrop-blur-sm">
          <div className="pointer-events-auto w-full max-w-2xl max-h-[94vh] flex flex-col rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-rose-500/40 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
            {/* Cabecera */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border-b border-rose-500/30 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-lg shadow-inner">
                  🏠
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono text-[10px] font-black uppercase tracking-wider">
                      ESTADO ACTUAL DE LA VIVIENDA
                    </span>
                    <span className="text-slate-400 font-mono text-xs">
                      #{activeHouse.id}
                    </span>
                  </div>
                  <h3 className="text-white font-extrabold text-base sm:text-lg tracking-tight mt-0.5">
                    {activeHouse.title.split('·')[0].trim()}
                  </h3>
                  <p className="text-rose-200 text-xs font-mono">
                    📍 {activeHouse.sector.split('—')[0].trim()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHouseId(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                title="Cerrar diagnóstico (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Selector de pestañas */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/50 p-1.5 gap-1 overflow-x-auto">
              {[
                { id: 'foto', label: '🖼️ Lámina Completa', desc: '1 Foto Integral' },
                { id: 'planta', label: '📑 Planta', desc: 'Cotas 1:50' },
                { id: 'axono', label: '📐 Axonometría', desc: 'Isométrica 3D' },
                { id: 'corte', label: '✂️ Corte', desc: 'Sección' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id)}
                  className={`flex-1 min-w-[95px] py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center cursor-pointer ${
                    activeModalTab === tab.id
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">{tab.desc}</span>
                </button>
              ))}
            </div>

            {/* Contenido técnico */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white flex items-center justify-center min-h-[260px] max-h-[460px] shadow-inner group p-2">
                <img
                  src={activeHouse.tabs[activeModalTab]?.img || activeHouse.tabs['foto']?.img}
                  alt={activeHouse.tabs[activeModalTab]?.title || activeHouse.title}
                  className="max-h-[440px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white font-mono text-[10px] font-bold backdrop-blur-md">
                  {activeHouse.tabs[activeModalTab]?.tag || 'Levantamiento'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm">
                    {activeHouse.tabs[activeModalTab].title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                    {activeHouse.tabs[activeModalTab].desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-500 block text-[10px]">ÁREA CONSTRUIDA</span>
                    <span className="font-bold text-slate-800 dark:text-emerald-400">{activeHouse.area} · {activeHouse.altura}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-500 block text-[10px]">SISTEMA CONSTRUCTIVO</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeHouse.sistemaConstructivo}</span>
                  </div>
                  <div className="p-2 col-span-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                    <span className="text-rose-600 dark:text-rose-400 font-bold block text-[10px]">PATOLOGÍA & VULNERABILIDAD</span>
                    <span className="text-rose-900 dark:text-rose-200 leading-tight block">{activeHouse.patologiaPrincipal}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
                    title="Subir PDF de 3 páginas para actualizar las fotos de las casas"
                  >
                    <span>📁 Subir PDF con tus láminas</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-500">
                    1 PDF · 3 hojas (Axono, Planta, Corte)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de control flotante inferior */}
      <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center space-x-1 border-r border-slate-300 dark:border-slate-700 pr-2">
            {[
              ['axon', 'Perspectiva Aérea'],
              ['top', 'Cenital (Top)'],
              ['front', 'Costera (Front)']
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => pickView(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewPreset === id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFitNonce((n) => n + 1)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            title="Centrar y enfocar la isla de Tierrabomba"
          >
            🎯 Centrar Isla
          </button>

          <button
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
            title="Restablecer la vista inicial por defecto si habías fijado una personalizada"
          >
            ↺ Restablecer
          </button>

          {modelStats && (
            <div className="pl-2 border-l border-slate-300 dark:border-slate-700 hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>{modelStats.meshes.toLocaleString()} elementos BIM de Revit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
