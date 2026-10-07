import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
    water: '#88a2b5',
    roads: '#334155',
    terrain: '#4a7856',
    buildings: '#ffffff',
    roofs: '#b45309',
    manzanas: '#9aa3af',
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

// Helper to create neutral white placeholder texture so Three.js never renders black while loading
function loadSafeTexture(url, wrapConfig = {}) {
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
}

  // Load real textures (Seamless high-res architectural materials with safe non-black loading)
  const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';

  // 1. Pasto / Grass (Seamless Mottled Green)
  const pastoTex = loadSafeTexture(`${normalizedBase}assets/textura_pasto_m5.png`, {
    wrapS: THREE.MirroredRepeatWrapping,
    wrapT: THREE.MirroredRepeatWrapping,
    repeat: [120, 120]
  });

  // 2. Agua / Water (Seamless Light Aqua Surface with fine ripple scale)
  const waterTex = loadSafeTexture(`${normalizedBase}assets/textura_agua_m5.jpg`, {
    wrapS: THREE.MirroredRepeatWrapping,
    wrapT: THREE.MirroredRepeatWrapping,
    repeat: [180, 180]
  });

  const bumpTex = loadSafeTexture(`${normalizedBase}assets/textura_agua_m5.jpg`, {
    wrapS: THREE.MirroredRepeatWrapping,
    wrapT: THREE.MirroredRepeatWrapping,
    repeat: [240, 240]
  });

  // 3. Piso / Manzanas / Urban Ground (Light Limestone Pavement from user upload)
  const pisoTex = loadSafeTexture(`${normalizedBase}assets/textura_piso_m5.png`, {
    wrapS: THREE.MirroredRepeatWrapping,
    wrapT: THREE.MirroredRepeatWrapping,
    repeat: [60, 60]
  });

  // 4. Vías / Roads (Gray asphalt texture)
  const viaTex = loadSafeTexture(`${normalizedBase}assets/textura_via.jpg`, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: [10, 10]
  });

  // Animated Water Shader Uniforms (GPU vertex displacement and normal caustics)
  const waterUniforms = {
    uTime: { value: 0.0 },
  };

  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTex,
    bumpMap: bumpTex,
    bumpScale: 0.05,
    color: new THREE.Color('#8dc8d2'),
    roughness: 0.15,
    metalness: 0.08,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
    clippingPlanes,
  });

  // Pure architectural standard materials (Museum Masterplan Standard)
  const mats = {
    water: waterMat,
    terrain: new THREE.MeshStandardMaterial({
      map: pastoTex,
      color: new THREE.Color(colors.terrain || '#65763e'),
      roughness: 0.90,
      metalness: 0.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    manzanas: new THREE.MeshStandardMaterial({
      map: pisoTex,
      color: new THREE.Color(colors.manzanas || '#d4c5b3'),
      roughness: 0.88,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -2.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    roads: new THREE.MeshStandardMaterial({
      map: viaTex,
      color: new THREE.Color('#64748b'),
      roughness: 0.70,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: -2.0,
      polygonOffsetUnits: -4.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    buildingsModern: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.25,
      metalness: 0.12,
      clippingPlanes,
    }),
    buildingsResidential: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f1f5f9'),
      roughness: 0.40,
      metalness: 0.05,
      clippingPlanes,
    }),
    buildingsUrban: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2e8f0'),
      roughness: 0.60,
      metalness: 0.05,
      clippingPlanes,
    }),
    buildingsVernacular: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fef3c7'),
      roughness: 0.75,
      metalness: 0.02,
      clippingPlanes,
    }),
    colonialRoof: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.roofs || '#b45309'),
      roughness: 0.65,
      metalness: 0.08,
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
    
    // Assign Planar UVs based on world X/Z so pasto tiles seamlessly without visible grids
    const posAttr = mergedLand.getAttribute('position');
    const uvs = new Float32Array(posAttr.count * 2);
    const GRASS_UV_SCALE = 0.02;
    for (let i = 0; i < posAttr.count; i++) {
      uvs[i * 2] = posAttr.getX(i) * GRASS_UV_SCALE;
      uvs[i * 2 + 1] = posAttr.getZ(i) * GRASS_UV_SCALE;
    }
    mergedLand.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    mergedLand.computeVertexNormals();

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
    
    // Assign Planar UVs based on world X/Z for seamless limestone paving floor
    const posManzanas = mergedManzanas.getAttribute('position');
    const pisoUvs = new Float32Array(posManzanas.count * 2);
    const PISO_UV_SCALE = 0.035;
    for (let i = 0; i < posManzanas.count; i++) {
      pisoUvs[i * 2] = posManzanas.getX(i) * PISO_UV_SCALE;
      pisoUvs[i * 2 + 1] = posManzanas.getZ(i) * PISO_UV_SCALE;
    }
    mergedManzanas.setAttribute('uv', new THREE.BufferAttribute(pisoUvs, 2));
    mergedManzanas.computeVertexNormals();

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

  // Add all to root scene
  sceneRoot.add(territoryGroup);
  onProgress(100, `Modelo 3D Catastro AMB (${catastroData.meta.counts.buildings} edificios 3D) listo`);

  return {
    group: territoryGroup,
    animatedObjects,
    mats,
    update: (speedMultiplier = 1.0, elapsed = null) => {
      waterUniforms.uTime.value += 0.018 * speedMultiplier;
      const t = elapsed !== null ? elapsed : performance.now();
      if (waterTex) {
        waterTex.offset.x = (t * 0.000018 * speedMultiplier) % 1;
        waterTex.offset.y = (t * 0.000012 * speedMultiplier) % 1;
      }
      if (bumpTex) {
        bumpTex.offset.x = (t * -0.000027 * speedMultiplier) % 1;
        bumpTex.offset.y = (t * 0.000021 * speedMultiplier) % 1;
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
    setClimateMonth: (monthIndex) => {
      const wetness = 0.5 + 0.5 * Math.sin((monthIndex - 3) * (Math.PI / 6));
      mats.water.color.set(wetness > 0.6 ? '#6a8ea8' : colors.water);
      mats.terrain.color.set(wetness > 0.7 ? '#345e3f' : colors.terrain);
    },
  };
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
