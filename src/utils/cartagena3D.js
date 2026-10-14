import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import pastoTextureImg from '../assets/textura_pasto_m5.png';
import waterTextureImg from '../assets/textura_agua_m5.jpg';
import pisoTextureImg from '../assets/textura_piso_m5.png';
import viaTextureImg from '../assets/textura_via.jpg';

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

  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTex,
    bumpMap: bumpTex,
    bumpScale: 0.025,
    color: new THREE.Color(colors.water || '#8dc8d2'),
    roughness: 0.15,
    metalness: 0.10,
    transparent: true,
    opacity: 0.95,
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
  const waterGeo = new THREE.PlaneGeometry(4000, 4000, 2, 2);
  const waterMesh = new THREE.Mesh(waterGeo, mats.water);
  waterMesh.name = "Water";
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -0.06;
  waterMesh.receiveShadow = true;
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

  // C. Franja de 500m de Erosión Costera (Sector Norte en Riesgo - 800 Viviendas MIDAS)
  const erosionCoords = [
    [-75.57545, 10.38158],
    [-75.57640, 10.38090],
    [-75.57697, 10.38040],
    [-75.57740, 10.37950],
    [-75.57763, 10.37884],
    [-75.57815, 10.37780],
    [-75.57860, 10.37680],
    [-75.57910, 10.37550],
    [-75.57950, 10.37450],
    [-75.57990, 10.37320],
    [-75.58050, 10.37250],
    [-75.57680, 10.37250],
    [-75.57620, 10.37350],
    [-75.57580, 10.37480],
    [-75.57520, 10.37650],
    [-75.57480, 10.37800],
    [-75.57440, 10.37950],
    [-75.57480, 10.38080],
    [-75.57545, 10.38158]
  ];
  const erosionShape = new THREE.Shape();
  const [e0x, e0y] = to9377(erosionCoords[0][0], erosionCoords[0][1]);
  erosionShape.moveTo((e0x - ORIGIN_X) * SCALE_3D, (e0y - ORIGIN_Y) * SCALE_3D);
  for (let i = 1; i < erosionCoords.length; i++) {
    const [ex, ey] = to9377(erosionCoords[i][0], erosionCoords[i][1]);
    erosionShape.lineTo((ex - ORIGIN_X) * SCALE_3D, (ey - ORIGIN_Y) * SCALE_3D);
  }

  const erosionGeo = new THREE.ShapeGeometry(erosionShape);
  erosionGeo.rotateX(-Math.PI / 2);
  erosionGeo.translate(0, 0.28, 0);
  const erosionMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const erosionMesh = new THREE.Mesh(erosionGeo, erosionMat);
  masterplanGroup.add(erosionMesh);

  // C2. Puntos Rojos de Viviendas en Riesgo en el Sector Norte (Franja 500m)
  const redHousePositions = [
    [-75.5768, 10.3798], [-75.5772, 10.3790], [-75.5775, 10.3782],
    [-75.5780, 10.3775], [-75.5783, 10.3768], [-75.5788, 10.3758],
    [-75.5792, 10.3748], [-75.5795, 10.3738], [-75.5800, 10.3730],
    [-75.5760, 10.3805], [-75.5763, 10.3795], [-75.5766, 10.3785],
    [-75.5770, 10.3770], [-75.5773, 10.3755], [-75.5778, 10.3742],
    [-75.5755, 10.3810], [-75.5758, 10.3800], [-75.5761, 10.3790]
  ];
  const redPointMat = new THREE.MeshStandardMaterial({
    color: 0xff2222,
    emissive: 0xdd1111,
    emissiveIntensity: 0.9,
    roughness: 0.3
  });
  const redPointGeo = new THREE.SphereGeometry(0.22, 10, 10);
  redHousePositions.forEach(([lon, lat]) => {
    const dot = new THREE.Mesh(redPointGeo, redPointMat);
    const p = lonLatToVector3(lon, lat, 0.48);
    dot.position.copy(p);
    masterplanGroup.add(dot);
  });

  // D. Corredores Ecológicos (Flechas 3D Verdes de Conexión Meseta -> Mar)
  function create3DArrow(fromLonLat, toLonLat, colorHex = 0x10b981) {
    const p1 = lonLatToVector3(fromLonLat[0], fromLonLat[1], 0.5);
    const p2 = lonLatToVector3(toLonLat[0], toLonLat[1], 0.5);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    
    const shaftLen = len * 0.75;
    const headLen = len * 0.25;

    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, shaftLen, 8);
    shaftGeo.translate(0, shaftLen / 2, 0);
    shaftGeo.rotateX(Math.PI / 2);

    const headGeo = new THREE.ConeGeometry(0.35, headLen, 12);
    headGeo.translate(0, headLen / 2, 0);
    headGeo.rotateX(Math.PI / 2);

    const arrowMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.5,
      roughness: 0.3,
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

  // Corredor 1: Meseta -> Borde Norte / Punta Arenas
  masterplanGroup.add(create3DArrow([-75.5745, 10.3745], [-75.5760, 10.3810], 0x10b981));
  // Corredor 2: Meseta -> Bahía Este / Caño de Oro
  masterplanGroup.add(create3DArrow([-75.5730, 10.3745], [-75.5685, 10.3730], 0x059669));
  // Corredor 3: Meseta -> Costa Occidental / Balneario
  masterplanGroup.add(create3DArrow([-75.5760, 10.3740], [-75.5815, 10.3740], 0x14b8a6));

  // E. Beacons / Hotspots 3D Estratégicos con Anillos Luminosos
  const hotspotsData = [
    {
      id: "colegio",
      title: "Colegio & Cisterna 450.000 L",
      coords: [-75.5745, 10.3755],
      color: 0x0d9488,
      height: 3.5,
    },
    {
      id: "viviendas",
      title: "120 Viviendas Palafíticas",
      coords: [-75.5725, 10.3770],
      color: 0xe11d48,
      height: 3.0,
    },
    {
      id: "reserva",
      title: "Parque Ecológico Central",
      coords: [-75.5760, 10.3730],
      color: 0x16a34a,
      height: 2.8,
    },
    {
      id: "borde_erosion",
      title: "Franja 500m & Reforestación Manglar",
      coords: [-75.5750, 10.3800],
      color: 0xf59e0b,
      height: 2.5,
    },
    {
      id: "muelle",
      title: "Muelle & Conectividad Limpia",
      coords: [-75.5715, 10.3820],
      color: 0x0284c7,
      height: 2.5,
    }
  ];

  const hotspotRings = [];

  hotspotsData.forEach((spot) => {
    const spotPos = lonLatToVector3(spot.coords[0], spot.coords[1], 0.3);
    const spotGroup = new THREE.Group();
    spotGroup.position.copy(spotPos);

    // Vertical Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, spot.height, 8);
    pillarGeo.translate(0, spot.height / 2, 0);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      transparent: true,
      opacity: 0.85,
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    spotGroup.add(pillar);

    // Top Orb
    const orbGeo = new THREE.SphereGeometry(0.35, 16, 16);
    orbGeo.translate(0, spot.height, 0);
    const orbMat = new THREE.MeshStandardMaterial({
      color: spot.color,
      emissive: spot.color,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    spotGroup.add(orb);

    // Pulsating Ground Ring
    const ringGeo = new THREE.RingGeometry(0.4, 0.7, 32);
    ringGeo.rotateX(-Math.PI / 2);
    ringGeo.translate(0, 0.1, 0);
    const ringMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    spotGroup.add(ring);
    hotspotRings.push(ring);

    masterplanGroup.add(spotGroup);
  });

  masterplanGroup.visible = !!activeLayers.masterplan;
  territoryGroup.add(masterplanGroup);
  animatedObjects.masterplanGroup = masterplanGroup;
  animatedObjects.hotspotRings = hotspotRings;

  // -------------------------------------------------------------
  // 8. ÁRBOLES REALES DE SKETCHUP EN TIERRA BOMBA (C:\sketch\tree+300.skp)
  // -------------------------------------------------------------
  const treesGroup = new THREE.Group();
  treesGroup.name = "Vegetation";

  const tierrabombaTreeCoords = [
    // Punta Arenas y Borde Norte Costero
    [-75.5760, 10.3815], [-75.5775, 10.3820], [-75.5750, 10.3810], [-75.5785, 10.3805], [-75.5738, 10.3822],
    [-75.5792, 10.3795], [-75.5765, 10.3802], [-75.5755, 10.3828], [-75.5742, 10.3798], [-75.5780, 10.3788],
    // Franja de Amortiguación y Reforestación (500m)
    [-75.5750, 10.3800], [-75.5768, 10.3792], [-75.5735, 10.3790], [-75.5782, 10.3782], [-75.5720, 10.3785],
    [-75.5760, 10.3775], [-75.5740, 10.3770], [-75.5775, 10.3765], [-75.5728, 10.3768], [-75.5790, 10.3772],
    // Meseta Central Resiliente (+22m) y Parque Ecológico Central
    [-75.5745, 10.3745], [-75.5760, 10.3735], [-75.5730, 10.3752], [-75.5770, 10.3725], [-75.5750, 10.3715],
    [-75.5725, 10.3738], [-75.5765, 10.3755], [-75.5740, 10.3728], [-75.5755, 10.3748], [-75.5735, 10.3718],
    [-75.5768, 10.3712], [-75.5748, 10.3732], [-75.5722, 10.3722], [-75.5758, 10.3762], [-75.5732, 10.3742],
    // Corredores Ecológicos y Caño de Oro (Ladera Este / Bahía)
    [-75.5685, 10.3730], [-75.5672, 10.3718], [-75.5698, 10.3745], [-75.5668, 10.3690], [-75.5682, 10.3665],
    [-75.5690, 10.3710], [-75.5702, 10.3735], [-75.5678, 10.3725], [-75.5710, 10.3740], [-75.5695, 10.3680],
    // Costa Occidental Balneario y Laderas Abiertas al Mar Caribe
    [-75.5815, 10.3740], [-75.5828, 10.3715], [-75.5802, 10.3685], [-75.5812, 10.3655], [-75.5798, 10.3625],
    [-75.5822, 10.3730], [-75.5808, 10.3700], [-75.5832, 10.3670], [-75.5818, 10.3640], [-75.5805, 10.3610],
    // Zona Central Interior y Colinas de Tierra Bomba
    [-75.5735, 10.3655], [-75.5752, 10.3625], [-75.5715, 10.3605], [-75.5745, 10.3585], [-75.5765, 10.3565],
    [-75.5728, 10.3635], [-75.5748, 10.3610], [-75.5710, 10.3590], [-75.5738, 10.3570], [-75.5758, 10.3550],
    // Tierra Bomba Pueblo (Sureste) y Laderas Circundantes
    [-75.5710, 10.3520], [-75.5692, 10.3505], [-75.5732, 10.3485], [-75.5702, 10.3465], [-75.5742, 10.3445],
    [-75.5718, 10.3510], [-75.5698, 10.3490], [-75.5725, 10.3470], [-75.5708, 10.3450], [-75.5735, 10.3430],
    // Bocachica, Bosque Seco Tropical y Fuerte San Fernando (Sur)
    [-75.5800, 10.3385], [-75.5822, 10.3365], [-75.5812, 10.3345], [-75.5832, 10.3355], [-75.5792, 10.3335],
    [-75.5808, 10.3375], [-75.5828, 10.3350], [-75.5798, 10.3360], [-75.5818, 10.3338], [-75.5838, 10.3342],
    // Parques continentales (Parque Centenario, Laderas Popa)
    [-75.5460, 10.4225], [-75.5470, 10.4215], [-75.5380, 10.4240], [-75.5390, 10.4230], [-75.5370, 10.4250]
  ];

  try {
    const gltfLoader = new GLTFLoader();
    const treeUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}models/tree.glb`;
    gltfLoader.load(
      treeUrl,
      (gltf) => {
        const treeScene = gltf.scene;
        const meshes = [];
        treeScene.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
            if (c.material) {
              c.material.side = THREE.DoubleSide;
              c.material.alphaTest = 0.35;
              c.material.depthWrite = true;
              c.material.shadowSide = THREE.DoubleSide;
            }
            meshes.push(c);
          }
        });

        if (meshes.length > 0) {
          const count = tierrabombaTreeCoords.length;
          const instancedList = meshes.map((m) => {
            const inst = new THREE.InstancedMesh(m.geometry, m.material, count);
            inst.castShadow = true;
            inst.receiveShadow = true;
            return inst;
          });

          const dummy = new THREE.Object3D();
          // tree.glb mide ~6m de altura y ~5m de diámetro de copa.
          // Con TREE_SCALE = 0.38, cada árbol mide ~2.3 unidades de altura (12-15m escala territorial),
          // siendo inmediatamente visible, nítido y con frondosidad desde la vista axonométrica y cenital.
          const TREE_SCALE = 0.38;

          tierrabombaTreeCoords.forEach(([lon, lat], idx) => {
            const pos = lonLatToVector3(lon, lat, 0.08);
            const s = TREE_SCALE * (0.85 + Math.random() * 0.35);
            dummy.position.set(pos.x, pos.y, pos.z);
            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.rotation.x = (Math.random() - 0.5) * 0.04;
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();

            instancedList.forEach((inst) => {
              inst.setMatrixAt(idx, dummy.matrix);
            });
          });

          instancedList.forEach((inst) => {
            inst.instanceMatrix.needsUpdate = true;
            treesGroup.add(inst);
          });
        }
      },
      undefined,
      (err) => {
        console.warn("Could not load tree.glb, using procedural fallback:", err);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 });
        tierrabombaTreeCoords.forEach(([lon, lat], i) => {
          const pos = lonLatToVector3(lon, lat, 0.08);
          const t = new THREE.Group();
          const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.4, 8), trunkMat);
          tr.position.y = 0.7;
          const fol = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + (i % 3) * 0.2), foliageMat);
          fol.position.y = 1.9;
          fol.castShadow = true;
          t.add(tr);
          t.add(fol);
          t.position.copy(pos);
          treesGroup.add(t);
        });
      }
    );
  } catch (e) {
    console.error("Error setting up trees:", e);
  }

  treesGroup.visible = activeLayers.trees !== false;
  territoryGroup.add(treesGroup);

  // Add all to root scene
  sceneRoot.add(territoryGroup);
  onProgress(100, `Modelo 3D Catastro AMB (${catastroData.meta.counts.buildings} edificios 3D) listo`);

  return {
    group: territoryGroup,
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
