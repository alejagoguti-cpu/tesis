import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import pastoTextureImg from '../assets/textura_pasto_m5.png';
import waterTextureImg from '../assets/textura_agua_m5.jpg';
import pisoTextureImg from '../assets/textura_piso_m5.png';
import viaTextureImg from '../assets/textura_via.jpg';
import { loadCleanTreeTemplate, buildTreeObject, BASE_TREE_SCALE } from './treeTool.js';
import { buildRealTierrabomba } from './tierrabombaReal.js';
import { buildSatelliteGround } from './satelliteGround.js';
import { BASE as TB_BASE } from './realTerritory.js';
import { createCaribeWater } from './caribeWater.js';

/**
 * Generador 3D Territorial: Bahía de Cartagena & Isla de Tierra Bomba
 * Modelo Arquitectónico 100% Real y Proporcional (Escala Catastral 1:50m)
 * 63.924 edificaciones reales, 3.464 manzanas, 2.513 vías y 102 masas de tierra oficiales.
 */

export async function buildCartagenaTerritoryScene({
  sceneRoot,
  activeLayers = {
    terrain: true,
    walls: true,
    buildings: true,
    water: true,
    boats: false,
    vehicles: false,
    noise: false,
    grid: false,
  },
  colors = {
    water: '#b5ebf5',
    roads: '#334155',
    terrain: '#ffffff',
    buildings: '#ffffff',
    roofs: '#ffffff',
    manzanas: '#f8fafc',
    vehicles: '#e2635a',
    boats: '#24c8bd',
  },
  clippingPlanes = [],
  onProgress = () => {},
}) {
  const territoryGroup = new THREE.Group();
  territoryGroup.name = "CartagenaTerritoryGroup";

  const animatedObjects = {
    boats: [],
    vehicles: [],
    waterMeshes: [],
    noiseMesh: null,
  };

  onProgress(10, 'Descargando base vectorial Catastro AMB Cartagena (63.000+ edificios 3D)...');

  // Load real Catastro dataset
  const basePath = import.meta.env.BASE_URL || '/';
  const dataUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}data/cartagena_catastro_real.json`;

  let catastroData;
  try {
    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    catastroData = await res.json();
    onProgress(35, `Base vectorial cargada: ${catastroData.meta.counts.buildings} edificios 3D, ${catastroData.meta.counts.manzanas} manzanas`);
  } catch (err) {
    console.warn("Could not fetch remote Catastro JSON, falling back to procedural geometry:", err);
    catastroData = generateSyntheticFallback();
  }

  // Load real textures with direct Three.js TextureLoader for maximum fidelity and crispness
  const texLoader = new THREE.TextureLoader();

  // 1. Pasto / Grass (Seamless Mottled Green de Tierra Bomba)
  const pastoTex = texLoader.load(pastoTextureImg);
  pastoTex.wrapS = THREE.RepeatWrapping;
  pastoTex.wrapT = THREE.RepeatWrapping;
  pastoTex.repeat.set(1, 1);
  pastoTex.colorSpace = THREE.SRGBColorSpace;
  pastoTex.anisotropy = 16;

  // 2. Agua / Water (Seamless Fine Caribbean Aqua Texture)
  const waterTex = texLoader.load(waterTextureImg);
  waterTex.wrapS = THREE.RepeatWrapping;
  waterTex.wrapT = THREE.RepeatWrapping;
  waterTex.repeat.set(80, 80);
  waterTex.colorSpace = THREE.SRGBColorSpace;
  waterTex.anisotropy = 16;

  const bumpTex = texLoader.load(waterTextureImg);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(80, 80);
  bumpTex.anisotropy = 16;

  // 3. Piso / Manzanas / Urban Ground (Light Limestone Pavement)
  const pisoTex = texLoader.load(pisoTextureImg);
  pisoTex.wrapS = THREE.RepeatWrapping;
  pisoTex.wrapT = THREE.RepeatWrapping;
  pisoTex.repeat.set(1, 1);
  pisoTex.colorSpace = THREE.SRGBColorSpace;
  pisoTex.anisotropy = 16;

  // 4. Vías / Roads (Crisp dark asphalt texture)
  const viaTex = texLoader.load(viaTextureImg);
  viaTex.wrapS = THREE.RepeatWrapping;
  viaTex.wrapT = THREE.RepeatWrapping;
  viaTex.repeat.set(4, 4);
  viaTex.colorSpace = THREE.SRGBColorSpace;
  viaTex.anisotropy = 16;

  // Animated Water Shader Uniforms
  const waterUniforms = {
    uTime: { value: 0.0 },
  };

  // Mar del módulo 05: turquesa caribeño, ondas finas animadas y brillo especular del cielo
  const waterNormalTex = texLoader.load(`${TB_BASE}textures/water_normals_fine.jpg`);
  waterNormalTex.wrapS = THREE.RepeatWrapping;
  waterNormalTex.wrapT = THREE.RepeatWrapping;
  waterNormalTex.repeat.set(260, 260);
  waterNormalTex.anisotropy = 8;
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.water || '#14a0c4'),
    normalMap: waterNormalTex,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.22,
    metalness: 0.0,
    envMapIntensity: 0.38,
    side: THREE.DoubleSide,
    clippingPlanes,
  });

  const mats = {
    water: waterMat,
    terrain: new THREE.MeshStandardMaterial({
      map: pastoTex,
      color: new THREE.Color(colors.terrain || '#ffffff'),
      roughness: 0.82,
      metalness: 0.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    manzanas: new THREE.MeshStandardMaterial({
      map: pisoTex,
      color: new THREE.Color(colors.manzanas || '#f8fafc'),
      roughness: 0.85,
      metalness: 0.0,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -2.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    roads: new THREE.MeshStandardMaterial({
      map: viaTex,
      color: new THREE.Color(colors.roads || '#334155'),
      roughness: 0.70,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -2.0,
      polygonOffsetUnits: -4.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    buildingsModern: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.buildings || '#ffffff'),
      roughness: 0.35,
      metalness: 0.05,
      clippingPlanes,
    }),
    buildingsResidential: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.buildings || '#ffffff'),
      roughness: 0.40,
      metalness: 0.05,
      clippingPlanes,
    }),
    buildingsUrban: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.buildings || '#ffffff'),
      roughness: 0.45,
      metalness: 0.05,
      clippingPlanes,
    }),
    buildingsVernacular: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.buildings || '#ffffff'),
      roughness: 0.50,
      metalness: 0.05,
      clippingPlanes,
    }),
    colonialRoof: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.roofs || '#ffffff'),
      roughness: 0.35,
      metalness: 0.05,
      clippingPlanes,
    }),
    noiseHeatmap: new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ef4444'),
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  };

  // -------------------------------------------------------------
  // 1. CUERPO DE AGUA ESTATICO INFINITO (Bahía de Cartagena & Mar Caribe)
  // -------------------------------------------------------------
  const waterMesh = createCaribeWater({ color: colors.water || '#1ea4c8', y: -0.06 });
  // el material antiguo pasa a ser un proxy del color del shader (setWaterColor y el clima lo usan)
  mats.water = { color: waterMesh.material.uniforms.waterColor.value, set needsUpdate(v) {} };
  waterMesh.visible = activeLayers.water !== false;
  territoryGroup.add(waterMesh);
  animatedObjects.waterMeshes.push(waterMesh);

  // -------------------------------------------------------------
  // 2. MASAS DE TIERRA REALES (Isla de Tierra Bomba y Costa Continental)
  // -------------------------------------------------------------
  onProgress(45, 'Generando masas de tierra reales de Tierra Bomba y Cartagena...');
  const landGeometries = [];

  if (catastroData.landmasses && Array.isArray(catastroData.landmasses)) {
    catastroData.landmasses.forEach((ring) => {
      if (!ring || ring.length < 3) return;
      const shape = new THREE.Shape();
      shape.moveTo(ring[0][0], ring[0][1]);
      for (let i = 1; i < ring.length; i++) {
        shape.lineTo(ring[i][0], ring[i][1]);
      }

      const geom = new THREE.ShapeGeometry(shape);
      geom.rotateX(-Math.PI / 2);
      geom.translate(0, 0.01, 0);
      landGeometries.push(geom);
    });
  }

  if (landGeometries.length > 0) {
    const mergedLand = BufferGeometryUtils.mergeGeometries(landGeometries, false);
    
    // Assign Planar UVs based on world X/Z so pasto tiles seamlessly with crisp texture definition
    const posAttr = mergedLand.getAttribute('position');
    const uvs = new Float32Array(posAttr.count * 2);
    const GRASS_UV_SCALE = 0.20;
    for (let i = 0; i < posAttr.count; i++) {
      uvs[i * 2] = posAttr.getX(i) * GRASS_UV_SCALE;
      uvs[i * 2 + 1] = posAttr.getZ(i) * GRASS_UV_SCALE;
    }
    mergedLand.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    mergedLand.computeVertexNormals();
    const normAttr = mergedLand.getAttribute('normal');
    if (normAttr) {
      for (let i = 0; i < normAttr.count; i++) {
        normAttr.setXYZ(i, 0, 1, 0);
      }
      normAttr.needsUpdate = true;
    }

    const landMesh = new THREE.Mesh(mergedLand, mats.terrain);
    landMesh.name = "Landmasses";
    landMesh.receiveShadow = true;
    landMesh.visible = activeLayers.terrain !== false;
    territoryGroup.add(landMesh);
  }

  // -------------------------------------------------------------
  // 3. MANZANAS CATASTRALES REALES (Manzana.shp - 3.464 Manzanas)
  // -------------------------------------------------------------
  onProgress(55, 'Construyendo 3.464 manzanas catastrales reales...');
  const manzanaGeometries = [];

  if (catastroData.manzanas && Array.isArray(catastroData.manzanas)) {
    catastroData.manzanas.forEach((ring) => {
      if (!ring || ring.length < 3) return;
      const shape = new THREE.Shape();
      shape.moveTo(ring[0][0], ring[0][1]);
      for (let i = 1; i < ring.length; i++) {
        shape.lineTo(ring[i][0], ring[i][1]);
      }

      const geom = new THREE.ShapeGeometry(shape);
      geom.rotateX(-Math.PI / 2);
      geom.translate(0, 0.02, 0);
      manzanaGeometries.push(geom);
    });
  }

  if (manzanaGeometries.length > 0) {
    const mergedManzanas = BufferGeometryUtils.mergeGeometries(manzanaGeometries, false);
    
    // Assign Planar UVs based on world X/Z for seamless limestone paving floor with crisp seams
    const posManzanas = mergedManzanas.getAttribute('position');
    const pisoUvs = new Float32Array(posManzanas.count * 2);
    const PISO_UV_SCALE = 0.20;
    for (let i = 0; i < posManzanas.count; i++) {
      pisoUvs[i * 2] = posManzanas.getX(i) * PISO_UV_SCALE;
      pisoUvs[i * 2 + 1] = posManzanas.getZ(i) * PISO_UV_SCALE;
    }
    mergedManzanas.setAttribute('uv', new THREE.BufferAttribute(pisoUvs, 2));
    mergedManzanas.computeVertexNormals();
    const posNormM = mergedManzanas.getAttribute('normal');
    if (posNormM) {
      for (let i = 0; i < posNormM.count; i++) {
        posNormM.setXYZ(i, 0, 1, 0);
      }
      posNormM.needsUpdate = true;
    }

    const manzanasMesh = new THREE.Mesh(mergedManzanas, mats.manzanas);
    manzanasMesh.name = "Manzanas";
    manzanasMesh.receiveShadow = true;
    manzanasMesh.visible = activeLayers.terrain !== false;
    territoryGroup.add(manzanasMesh);
  }

  // -------------------------------------------------------------
  // 4. RED VIAL REAL (Nomenclaturavial.shp - 2.513 Vías)
  // -------------------------------------------------------------
  onProgress(70, 'Trazando 2.513 ejes viales oficiales...');
  const roadGeometries = [];
  const roadHalfWidth = 0.08; // Real scaled 8-meter street width

  if (catastroData.roads && Array.isArray(catastroData.roads)) {
    catastroData.roads.forEach((line) => {
      if (!line || line.length < 2) return;
      for (let i = 0; i < line.length - 1; i++) {
        const p1 = new THREE.Vector2(line[i][0], line[i][1]);
        const p2 = new THREE.Vector2(line[i + 1][0], line[i + 1][1]);
        const dir = new THREE.Vector2().subVectors(p2, p1).normalize();
        const normal = new THREE.Vector2(-dir.y, dir.x).multiplyScalar(roadHalfWidth);

        const shape = new THREE.Shape();
        shape.moveTo(p1.x + normal.x, p1.y + normal.y);
        shape.lineTo(p2.x + normal.x, p2.y + normal.y);
        shape.lineTo(p2.x - normal.x, p2.y - normal.y);
        shape.lineTo(p1.x - normal.x, p1.y - normal.y);
        shape.closePath();

        const geom = new THREE.ShapeGeometry(shape);
        geom.rotateX(-Math.PI / 2);
        geom.translate(0, 0.03, 0);
        roadGeometries.push(geom);
      }
    });
  }

  if (roadGeometries.length > 0) {
    const mergedRoads = BufferGeometryUtils.mergeGeometries(roadGeometries, false);
    
    // Assign Planar UVs for road asphalt texture
    const posRoads = mergedRoads.getAttribute('position');
    const roadUvs = new Float32Array(posRoads.count * 2);
    const ROAD_UV_SCALE = 0.15;
    for (let i = 0; i < posRoads.count; i++) {
      roadUvs[i * 2] = posRoads.getX(i) * ROAD_UV_SCALE;
      roadUvs[i * 2 + 1] = posRoads.getZ(i) * ROAD_UV_SCALE;
    }
    mergedRoads.setAttribute('uv', new THREE.BufferAttribute(roadUvs, 2));
    mergedRoads.computeVertexNormals();
    const posNormR = mergedRoads.getAttribute('normal');
    if (posNormR) {
      for (let i = 0; i < posNormR.count; i++) {
        posNormR.setXYZ(i, 0, 1, 0);
      }
      posNormR.needsUpdate = true;
    }

    const roadsMesh = new THREE.Mesh(mergedRoads, mats.roads);
    roadsMesh.name = "RoadNetwork";
    roadsMesh.receiveShadow = true;
    roadsMesh.visible = activeLayers.walls !== false;
    territoryGroup.add(roadsMesh);
  }

  // -------------------------------------------------------------
  // 5. EDIFICACIONES REALES EXTRUIDAS EN 3D (63.924 Edificios Volumétricos)
  // -------------------------------------------------------------
  onProgress(82, 'Extruyendo 63.924 edificaciones 3D reales con alturas...');
  const skyscraperGeoms = [];
  const residentialGeoms = [];
  const urbanGeoms = [];
  const centroBuildingGeoms = [];
  const vernacularGeoms = [];

  if (catastroData.buildings && Array.isArray(catastroData.buildings)) {
    catastroData.buildings.forEach((b) => {
      const ring = b.r;
      if (!ring || ring.length < 3) return;

      const shape = new THREE.Shape();
      shape.moveTo(ring[0][0], ring[0][1]);
      for (let i = 1; i < ring.length; i++) {
        shape.lineTo(ring[i][0], ring[i][1]);
      }

      const height = b.h || 0.08;

      const extrudeSettings = {
        depth: height,
        bevelEnabled: false,
      };

      // In Three.js, ExtrudeGeometry extrudes along +Z.
      // rotateX(-Math.PI / 2) rotates +Z into +Y (pointing UP into the sky!)
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.rotateX(-Math.PI / 2);
      geom.translate(0, 0.035, 0);

      if (b.t === 'skyscraper') {
        skyscraperGeoms.push(geom);
      } else if (b.t === 'centro') {
        centroBuildingGeoms.push(geom);
      } else if (b.t === 'modern_residential') {
        residentialGeoms.push(geom);
      } else if (b.t === 'vernacular') {
        vernacularGeoms.push(geom);
      } else {
        urbanGeoms.push(geom);
      }
    });
  }

  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = "Buildings3D";

  if (skyscraperGeoms.length > 0) {
    const mergedSky = BufferGeometryUtils.mergeGeometries(skyscraperGeoms, false);
    const skyMesh = new THREE.Mesh(mergedSky, mats.buildingsModern);
    skyMesh.castShadow = true;
    skyMesh.receiveShadow = true;
    buildingsGroup.add(skyMesh);
  }

  if (residentialGeoms.length > 0) {
    const mergedRes = BufferGeometryUtils.mergeGeometries(residentialGeoms, false);
    const resMesh = new THREE.Mesh(mergedRes, mats.buildingsResidential);
    resMesh.castShadow = true;
    resMesh.receiveShadow = true;
    buildingsGroup.add(resMesh);
  }

  if (urbanGeoms.length > 0) {
    const mergedUrb = BufferGeometryUtils.mergeGeometries(urbanGeoms, false);
    const urbMesh = new THREE.Mesh(mergedUrb, mats.buildingsUrban);
    urbMesh.castShadow = true;
    urbMesh.receiveShadow = true;
    buildingsGroup.add(urbMesh);
  }

  if (centroBuildingGeoms.length > 0) {
    const mergedCentro = BufferGeometryUtils.mergeGeometries(centroBuildingGeoms, false);
    const centroMesh = new THREE.Mesh(mergedCentro, mats.colonialRoof);
    centroMesh.castShadow = true;
    centroMesh.receiveShadow = true;
    buildingsGroup.add(centroMesh);
  }

  if (vernacularGeoms.length > 0) {
    const mergedVernacular = BufferGeometryUtils.mergeGeometries(vernacularGeoms, false);
    const vernMesh = new THREE.Mesh(mergedVernacular, mats.buildingsVernacular);
    vernMesh.castShadow = true;
    vernMesh.receiveShadow = true;
    buildingsGroup.add(vernMesh);
  }

  buildingsGroup.visible = activeLayers.buildings !== false;
  territoryGroup.add(buildingsGroup);

  // -------------------------------------------------------------
  // 6. MAPA DE RUIDO & ISÓFONAS ACÚSTICAS (Overlay Opcional)
  // -------------------------------------------------------------
  const noiseGroup = new THREE.Group();
  noiseGroup.name = "NoiseMapGroup";

  const noiseGeo1 = new THREE.RingGeometry(10, 80, 32);
  const noiseMesh1 = new THREE.Mesh(noiseGeo1, mats.noiseHeatmap);
  noiseMesh1.rotation.x = -Math.PI / 2;
  noiseMesh1.position.set(10, 0.05, -50);
  noiseGroup.add(noiseMesh1);

  noiseGroup.visible = !!activeLayers.noise;
  territoryGroup.add(noiseGroup);
  animatedObjects.noiseMesh = noiseGroup;

  // -------------------------------------------------------------
  // 7. MASTERPLAN TERRITORIAL TIERRA BOMBA (+22m MESETA SEGURA)
  // -------------------------------------------------------------
  const masterplanGroup = new THREE.Group();
  masterplanGroup.name = "MasterplanTerritorialGroup";

  // A. Polígono de Meseta Segura (+22m Cota Resiliente Oficial)
  const mesetaCoords = [
    [-75.57396, 10.37487],
    [-75.57534, 10.37523],
    [-75.57662, 10.37447],
    [-75.57731, 10.37320],
    [-75.57758, 10.37194],
    [-75.57727, 10.37113],
    [-75.57691, 10.37054],
    [-75.57638, 10.37134],
    [-75.57595, 10.37221],
    [-75.57516, 10.37264],
    [-75.57450, 10.37348],
    [-75.57408, 10.37419]
  ];

  const meseta3DPoints = mesetaCoords.map(([lon, lat]) => lonLatToVector3(lon, lat, 0.45));
  
  // Fill shape for safe plateau (+22m)
  const mesetaShape = new THREE.Shape();
  const [m0x, m0y] = to9377(mesetaCoords[0][0], mesetaCoords[0][1]);
  mesetaShape.moveTo((m0x - ORIGIN_X) * SCALE_3D, (m0y - ORIGIN_Y) * SCALE_3D);
  for (let i = 1; i < mesetaCoords.length; i++) {
    const [mx, my] = to9377(mesetaCoords[i][0], mesetaCoords[i][1]);
    mesetaShape.lineTo((mx - ORIGIN_X) * SCALE_3D, (my - ORIGIN_Y) * SCALE_3D);
  }

  const mesetaFillGeo = new THREE.ShapeGeometry(mesetaShape);
  mesetaFillGeo.rotateX(-Math.PI / 2);
  mesetaFillGeo.translate(0, 0.35, 0);

  const mesetaFillMat = new THREE.MeshBasicMaterial({
    color: 0x0d9488,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesetaFillMesh = new THREE.Mesh(mesetaFillGeo, mesetaFillMat);
  mesetaFillMesh.name = "MesetaSeguraFill";
  masterplanGroup.add(mesetaFillMesh);

  // Border ribbon for safe plateau
  const curvePoints = [...meseta3DPoints, meseta3DPoints[0]];
  for (let i = 0; i < curvePoints.length - 1; i++) {
    const pA = curvePoints[i];
    const pB = curvePoints[i + 1];
    const dist = pA.distanceTo(pB);
    const cylGeo = new THREE.CylinderGeometry(0.18, 0.18, dist, 8);
    cylGeo.translate(0, dist / 2, 0);
    cylGeo.rotateX(Math.PI / 2);

    const cylMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x0d9488,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
    });
    const cylMesh = new THREE.Mesh(cylGeo, cylMat);
    cylMesh.position.copy(pA);
    cylMesh.lookAt(pB);
    masterplanGroup.add(cylMesh);
  }

  // B. Línea Divisoria Horizontal del Horizonte Norte de Tierrabomba (Lat 10.3725)
  const lineStart = lonLatToVector3(-75.5860, 10.3725, 0.45);
  const lineEnd = lonLatToVector3(-75.5620, 10.3725, 0.45);
  const lineDist = lineStart.distanceTo(lineEnd);
  
  const divLineGeo = new THREE.CylinderGeometry(0.16, 0.16, lineDist, 8);
  divLineGeo.translate(0, lineDist / 2, 0);
  divLineGeo.rotateX(Math.PI / 2);

  const divLineMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.95,
    roughness: 0.3,
  });
  const divLineMesh = new THREE.Mesh(divLineGeo, divLineMat);
  divLineMesh.position.copy(lineStart);
  divLineMesh.lookAt(lineEnd);
  masterplanGroup.add(divLineMesh);

  // C. VÍAS AMARILLAS DEL PLAN MAESTRO (PASO 5: RED VIAL ESTRUCTURANTE Y ARTICULACIÓN)
  // Vías planas (NO tubos) con textura rugosa de arena en tono amarillo cálido
  const sandViaTex = texLoader.load(viaTextureImg);
  sandViaTex.wrapS = THREE.RepeatWrapping;
  sandViaTex.wrapT = THREE.RepeatWrapping;
  sandViaTex.repeat.set(1, 4);

  const yellowRoadMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Amarillo arena cálido
    map: sandViaTex,
    bumpMap: sandViaTex,
    bumpScale: 0.05,
    roughness: 0.94, // Mate arenoso realista
    metalness: 0.02,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  const ROAD_WIDTH = 0.52; // Ancho plano de la vía (cinta horizontal)
  const halfW = ROAD_WIDTH / 2;

  // 1. Vías por defecto que articulan Punta Arenas, la Meseta (+22m) y el Corredor Oriental
  const defaultMasterplanRoads = [
    // Vía Arterial 1: Conexión Asentamiento Punta Arenas hacia Meseta Segura y Colegio
    [
      [-75.5765, 10.3808],
      [-75.5762, 10.3795],
      [-75.5758, 10.3778],
      [-75.5755, 10.3760],
      [-75.5754, 10.3745],
      [-75.5755, 10.3732] // Centro meseta
    ],
    // Vía Anular 2: Circunvalar interna de la Meseta (+22m) conectando colegio y viviendas
    [
      [-75.5742, 10.3748],
      [-75.5753, 10.3752],
      [-75.5766, 10.3745],
      [-75.5772, 10.3732],
      [-75.5774, 10.3720],
      [-75.5768, 10.3712],
      [-75.5758, 10.3722],
      [-75.5746, 10.3734],
      [-75.5742, 10.3748]
    ],
    // Vía Colectora 3: Meseta hacia el flanco oriental / Caño de Oro
    [
      [-75.5755, 10.3732],
      [-75.5725, 10.3728],
      [-75.5690, 10.3720],
      [-75.5640, 10.3695]
    ]
  ];

  // Recuperar vías personalizadas dibujadas por el usuario en el Paso 5 si existen
  let customStep5Roads = [];
  try {
    const rawDelims = localStorage.getItem('thesis_custom_delimitations');
    if (rawDelims) {
      const parsed = JSON.parse(rawDelims);
      if (parsed.roads && Array.isArray(parsed.roads) && parsed.roads.length > 0) {
        parsed.roads.forEach(line => {
          if (Array.isArray(line) && line.length >= 2) {
            const converted = line.map(pt => {
              if (Array.isArray(pt) && pt.length >= 2) {
                const lat = pt[0] > 0 ? pt[0] : pt[1];
                const lng = pt[1] < 0 ? pt[1] : pt[0];
                return [lng, lat];
              }
              return null;
            }).filter(Boolean);
            if (converted.length >= 2) customStep5Roads.push(converted);
          }
        });
      }
    }
  } catch (e) {}

  const allMasterRoads = customStep5Roads.length > 0 ? customStep5Roads : defaultMasterplanRoads;

  allMasterRoads.forEach(roadLine => {
    for (let i = 0; i < roadLine.length - 1; i++) {
      const p1 = lonLatToVector3(roadLine[i][0], roadLine[i][1], 0.38);
      const p2 = lonLatToVector3(roadLine[i + 1][0], roadLine[i + 1][1], 0.38);
      const segDist = p1.distanceTo(p2);
      if (segDist < 0.05) continue;

      // Dirección y normal horizontal perpendicular en X-Z
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const norm = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(halfW);

      // Quad plano horizontal rasante al terreno
      const v0 = new THREE.Vector3().addVectors(p1, norm);
      const v1 = new THREE.Vector3().subVectors(p1, norm);
      const v2 = new THREE.Vector3().subVectors(p2, norm);
      const v3 = new THREE.Vector3().addVectors(p2, norm);

      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array([
        v0.x, v0.y, v0.z,
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,

        v0.x, v0.y, v0.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z
      ]);

      const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, segDist * 0.4,

        0, 0,
        1, segDist * 0.4,
        0, segDist * 0.4
      ]);

      const normals = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
      ]);

      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

      const ribbonMesh = new THREE.Mesh(geom, yellowRoadMat);
      ribbonMesh.name = "MasterplanYellowRoadFlat";
      ribbonMesh.receiveShadow = true;
      masterplanGroup.add(ribbonMesh);

      // Disco plano circular de empalme en los nodos (no esfera)
      const jointGeo = new THREE.CircleGeometry(halfW, 14);
      jointGeo.rotateX(-Math.PI / 2);
      jointGeo.translate(p1.x, p1.y + 0.001, p1.z);
      const jointMesh = new THREE.Mesh(jointGeo, yellowRoadMat);
      masterplanGroup.add(jointMesh);
    }
  });

  // D. Corredores Ecológicos y Senderos Peatonales (Flechas 3D Animadas con Brillo)
  function create3DArrow(fromLonLat, toLonLat, colorHex = 0x10b981) {
    const p1 = lonLatToVector3(fromLonLat[0], fromLonLat[1], 0.6);
    const p2 = lonLatToVector3(toLonLat[0], toLonLat[1], 0.6);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    
    const shaftLen = len * 0.76;
    const headLen = len * 0.24;

    const shaftGeo = new THREE.CylinderGeometry(0.20, 0.20, shaftLen, 10);
    shaftGeo.translate(0, shaftLen / 2, 0);
    shaftGeo.rotateX(Math.PI / 2);

    const headGeo = new THREE.ConeGeometry(0.60, headLen, 14);
    headGeo.translate(0, headLen / 2, 0);
    headGeo.rotateX(Math.PI / 2);

    const arrowMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.2
    });

    const arrowGroup = new THREE.Group();
    const shaft = new THREE.Mesh(shaftGeo, arrowMat);
    const head = new THREE.Mesh(headGeo, arrowMat);
    head.position.set(0, 0, shaftLen);

    arrowGroup.add(shaft);
    arrowGroup.add(head);
    arrowGroup.position.copy(p1);
    arrowGroup.lookAt(p2);

    return arrowGroup;
  }

  // 1. Flecha Principal Amarilla de Articulación Territorial: Punta Arenas -> Centro Meseta / Colegio
  masterplanGroup.add(create3DArrow([-75.5765, 10.3805], [-75.5755, 10.3735], 0xf59e0b));
  // 2. Sendero Conexión: Equipamiento Educativo -> Viviendas Reubicadas en Suelo Seguro
  masterplanGroup.add(create3DArrow([-75.5755, 10.3732], [-75.5768, 10.3742], 0x0284c7));
  // 3. Corredor Ecológico: Meseta Segura -> Parque Ecológico Central & Reserva
  masterplanGroup.add(create3DArrow([-75.5755, 10.3732], [-75.5760, 10.3715], 0x10b981));
  // 4. Conexión Paisajística y Productiva: Meseta -> Caño de Oro / Ecoturismo & Pesca
  masterplanGroup.add(create3DArrow([-75.5745, 10.3730], [-75.5685, 10.3720], 0x14b8a6));

  // E. Beacons / Hotspots 3D Estratégicos del Plan Maestro
  const hotspotsData = [
    {
      id: "organizacion",
      title: "Articulación Territorial & Red Vial",
      coords: [-75.5755, 10.3755],
      color: 0xf59e0b,
      height: 4.5,
      category: "Eje Estructurante"
    },
    {
      id: "colegio_articulador",
      title: "Equipamiento Educativo (Adentro de la Meseta)",
      coords: [-75.5755, 10.3732], // UBICADO ESTRICTAMENTE DENTRO DE LA MESETA
      color: 0x8b5cf6,
      height: 5.0,
      category: "Educación y Comunidad"
    },
    {
      id: "reubicacion",
      title: "Viviendas en Suelo Firme (+22m)",
      coords: [-75.5768, 10.3742], // Dentro de la meseta segura
      color: 0x0284c7,
      height: 4.0,
      category: "Seguridad y Adaptación"
    },
    {
      id: "conectividad",
      title: "Senderos Peatonales & Espacio Colectivo",
      coords: [-75.5742, 10.3735],
      color: 0x14b8a6,
      height: 3.8,
      category: "Recorridos y Conexión"
    },
    {
      id: "parque",
      title: "Parque Ecológico & Barreras Costeras",
      coords: [-75.5760, 10.3715],
      color: 0x10b981,
      height: 4.2,
      category: "Conservación y Manglares"
    }
  ];

  const hotspotRings = [];

  hotspotsData.forEach((spot) => {
    const spotPos = lonLatToVector3(spot.coords[0], spot.coords[1], 0.3);
    const spotGroup = new THREE.Group();
    spotGroup.name = `Hotspot_${spot.id}`;
    spotGroup.position.copy(spotPos);
    spotGroup.userData = spot;

    // Vertical Glowing Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, spot.height, 10);
    pillarGeo.translate(0, spot.height / 2, 0);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      transparent: true,
      opacity: 0.90,
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    spotGroup.add(pillar);

    // Glowing Beacon Orb
    const orbGeo = new THREE.SphereGeometry(0.48, 16, 16);
    orbGeo.translate(0, spot.height, 0);
    const orbMat = new THREE.MeshStandardMaterial({
      color: spot.color,
      emissive: spot.color,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    spotGroup.add(orb);

    // Pulsating Ground Ring
    const ringGeo = new THREE.RingGeometry(0.5, 0.95, 32);
    ringGeo.rotateX(-Math.PI / 2);
    ringGeo.translate(0, 0.12, 0);
    const ringMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    spotGroup.add(ring);
    hotspotRings.push(ring);

    masterplanGroup.add(spotGroup);
  });

  masterplanGroup.visible = false; // sin flechas ni pines: la zonificación la dibuja el usuario con el panel
  territoryGroup.add(masterplanGroup);
  animatedObjects.masterplanGroup = masterplanGroup;
  animatedObjects.hotspotRings = hotspotRings;

  // -------------------------------------------------------------
  // 8. VEGETACIÓN & ARBOLADO NATIVO 3D (CENTRO VERDE DE LA ISLA)
  // Árboles verdes vivos sin bordes negros, de diferentes tamaños,
  // distribuidos en el centro de la isla y la meseta protegida.
  // -------------------------------------------------------------
  const treesGroup = new THREE.Group();
  treesGroup.name = "Vegetation";
  treesGroup.visible = activeLayers.trees !== false;

  let treeTemplate = null;
  try {
    treeTemplate = await loadCleanTreeTemplate(basePath);
  } catch (err) {
    console.warn("No se pudo cargar la plantilla de tree.glb:", err);
  }

  // 52 coordenadas estrictamente dentro del centro verde de la isla (meseta y parque ecológico, lejos del mar)
  const defaultCenterTreesCoords = []; // la vegetación real se detecta en la imagen satelital (ver tierrabombaReal.js)

  if (treeTemplate) {
    defaultCenterTreesCoords.forEach(([lon, lat, scale], idx) => {
      const pos = lonLatToVector3(lon, lat, 0.36);
      const treeObj = buildTreeObject(treeTemplate, {
        id: `init_tree_${idx + 1}`,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        scale,
        rotY: (idx * 1.37) % (Math.PI * 2)
      });
      treeObj.name = `Tree_Center_${idx + 1}`;
      treesGroup.add(treeObj);
    });
  }

  territoryGroup.add(treesGroup);

  // Suelo satelital de toda la escena (reemplaza pasto, manzanas y vías dibujadas)
  try {
    const satGround = await buildSatelliteGround({ lonLatToVector3, layers: activeLayers });
    territoryGroup.add(satGround);
    ['Landmasses', 'Manzanas'].forEach((n) => {
      const m = territoryGroup.getObjectByName(n);
      if (m) m.visible = false;
    });
  } catch (err) {
    console.warn('Suelo satelital no disponible:', err);
  }

  // Tierrabomba real: satélite georreferenciado, árboles detectados en la imagen y edificios del modelo
  try {
    const realTB = await buildRealTierrabomba({ lonLatToVector3, SCALE_3D, layers: activeLayers, onProgress });
    territoryGroup.add(realTB);
  } catch (err) {
    console.warn('Tierrabomba real no disponible:', err);
  }

  // Add all to root scene
  sceneRoot.add(territoryGroup);
  onProgress(100, `Modelo 3D Catastro AMB (${catastroData.meta.counts.buildings} edificios 3D) listo`);

  return {
    group: territoryGroup,
    vegetationGroup: treesGroup,
    animatedObjects,
    mats,
    update: (speedMultiplier = 1.0, elapsed = null) => {
      waterUniforms.uTime.value += 0.003 * speedMultiplier;
      const t = elapsed !== null ? elapsed : performance.now();
      if (waterTex) {
        waterTex.offset.x = (t * 0.0000035 * speedMultiplier) % 1;
        waterTex.offset.y = (t * 0.0000022 * speedMultiplier) % 1;
      }
      if (bumpTex) {
        bumpTex.offset.x = (t * -0.0000045 * speedMultiplier) % 1;
        bumpTex.offset.y = (t * 0.0000032 * speedMultiplier) % 1;
      }
      if (waterMesh.userData.update) waterMesh.userData.update(t * 0.001 * speedMultiplier);
      // Pulsate hotspot rings
      if (hotspotRings && hotspotRings.length > 0) {
        const pulse = 1.0 + 0.35 * Math.sin(t * 0.004);
        hotspotRings.forEach((r) => {
          r.scale.set(pulse, 1, pulse);
        });
      }
    },
    setWaterColor: (hex) => {
      if (mats.water) {
        mats.water.color.set(hex);
        mats.water.needsUpdate = true;
      }
    },
    setRoadsColor: (hex) => {
      if (mats.roads) {
        mats.roads.color.set(hex);
        mats.roads.needsUpdate = true;
      }
    },
    setGreenColor: (hex) => {
      if (mats.terrain) {
        mats.terrain.color.set(hex);
        mats.terrain.needsUpdate = true;
      }
    },
    setPavementColor: (hex) => {
      if (mats.manzanas) {
        mats.manzanas.color.set(hex);
        mats.manzanas.needsUpdate = true;
      }
    },
    setBuildingsColor: (hex) => {
      const col = new THREE.Color(hex);
      if (mats.buildingsModern) { mats.buildingsModern.color.set(col); mats.buildingsModern.needsUpdate = true; }
      if (mats.buildingsResidential) { mats.buildingsResidential.color.set(col); mats.buildingsResidential.needsUpdate = true; }
      if (mats.buildingsUrban) { mats.buildingsUrban.color.set(col); mats.buildingsUrban.needsUpdate = true; }
      if (mats.buildingsVernacular) { mats.buildingsVernacular.color.set(col); mats.buildingsVernacular.needsUpdate = true; }
    },
    setRoofsColor: (hex) => {
      if (mats.colonialRoof) {
        mats.colonialRoof.color.set(hex);
        mats.colonialRoof.needsUpdate = true;
      }
    },
    setNoiseMapVisible: (visible) => {
      if (animatedObjects.noiseMesh) {
        animatedObjects.noiseMesh.visible = visible;
      }
    },
    setMasterplanVisible: (visible) => {
      if (animatedObjects.masterplanGroup) {
        animatedObjects.masterplanGroup.visible = visible;
      }
    },
    setClimateMonth: (monthIndex) => {
      const wetness = 0.5 + 0.5 * Math.sin((monthIndex - 3) * (Math.PI / 6));
      mats.water.color.set(wetness > 0.6 ? '#6a8ea8' : colors.water);
      mats.terrain.color.set(wetness > 0.7 ? '#345e3f' : colors.terrain);
    },
  };
}

// Coordinate Conversion helpers (MAGNA-SIRGAS EPSG:9377 to Three.js)
const ORIGIN_X = 4720500;
const ORIGIN_Y = 2705500;
const SCALE_3D = 0.02;

export function to9377(lon, lat) {
  const a = 6378137.0;
  const f = 1 / 298.257222101;
  const b = a * (1 - f);
  const e2 = (a*a - b*b) / (a*a);
  const ep2 = (a*a - b*b) / (b*b);
  const k0 = 0.9992;
  const lon0 = -73.0 * Math.PI / 180;
  const lat0 = 4.0 * Math.PI / 180;
  const FE = 5000000.0;
  const FN = 2000000.0;

  const phi = lat * Math.PI / 180;
  const lambda = lon * Math.PI / 180;

  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) * Math.sin(phi));
  const T = Math.tan(phi) * Math.tan(phi);
  const C = ep2 * Math.cos(phi) * Math.cos(phi);
  const A = (lambda - lon0) * Math.cos(phi);

  function M(p) {
    return a * (
      (1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * p
      - (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*p)
      + (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*p)
      - (3*e2*e2*e2/3072) * Math.sin(6*p)
    );
  }

  const M_phi = M(phi);
  const M_phi0 = M(lat0);

  const x = FE + k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * Math.pow(A, 5) / 120);
  const y = FN + k0 * (M_phi - M_phi0 + N * Math.tan(phi) * (A*A/2 + (5 - T + 9*C + 4*C*C) * Math.pow(A, 4) / 24 + (61 - 58*T + T*T + 600*C - 330*ep2) * Math.pow(A, 6) / 720));

  return [x, y];
}

export function lonLatToVector3(lon, lat, height = 0.3) {
  const [x, y] = to9377(lon, lat);
  const x3d = (x - ORIGIN_X) * SCALE_3D;
  const y3d = (y - ORIGIN_Y) * SCALE_3D;
  return new THREE.Vector3(x3d, height, -y3d);
}

// Synthetic fallback for offline environments
function generateSyntheticFallback() {
  return {
    meta: { counts: { buildings: 0, manzanas: 0, roads: 0 } },
    landmasses: [],
    manzanas: [],
    roads: [],
    buildings: [],
  };
}
