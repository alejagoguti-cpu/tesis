import * as THREE from 'three';

/**
 * Generador 3D Territorial: Bahía de Cartagena & Isla de Tierra Bomba
 * Inspirado en la arquitectura axonométrica de modulo-08-3d.html
 */

export function buildCartagenaTerritoryScene({
  sceneRoot,
  activeLayers = {
    terrain: true,
    walls: true,
    buildings: true,
    water: true,
    boats: true,
    vehicles: true,
    trees: true,
    grid: false,
  },
  colors = {
    water: '#88a2b5',
    roads: '#b7babd',
    terrain: '#4a7856',
    buildings: '#ffffff',
    roofs: '#b5714a',
    trees: '#5c8f52',
    manzanas: '#8a8f96',
    vehicles: '#e2635a',
    boats: '#24c8bd',
  },
  clippingPlanes = [],
}) {
  const territoryGroup = new THREE.Group();
  territoryGroup.name = "CartagenaTerritoryGroup";

  // References to dynamic objects (boats, vehicles, animated water)
  const animatedObjects = {
    boats: [],
    vehicles: [],
    waterMeshes: [],
  };

  // Materials with clipping planes support
  const mats = {
    water: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.water),
      roughness: 0.15,
      metalness: 0.25,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    terrain: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.terrain),
      roughness: 0.88,
      metalness: 0.05,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    terrainSand: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d9cbb2'),
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
      clippingPlanes,
    }),
    manglar: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#386641'),
      roughness: 0.9,
      clippingPlanes,
    }),
    roads: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.roads),
      roughness: 0.4,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: -2.0,
      polygonOffsetUnits: -4.0,
      clippingPlanes,
    }),
    buildingsModern: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.buildings),
      roughness: 0.25,
      metalness: 0.15,
      clippingPlanes,
    }),
    buildingsColonial: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f4ede2'),
      roughness: 0.7,
      metalness: 0.05,
      clippingPlanes,
    }),
    colonialRoof: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.roofs),
      roughness: 0.6,
      metalness: 0.1,
      clippingPlanes,
    }),
    buildingsVernacular: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e0cfb8'),
      roughness: 0.8,
      clippingPlanes,
    }),
    fortress: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#bda485'), // Piedra coralina de murallas
      roughness: 0.9,
      metalness: 0.05,
      clippingPlanes,
    }),
    treeFoliage: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.trees),
      roughness: 0.8,
      clippingPlanes,
    }),
    treeTrunk: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5c4033'),
      roughness: 0.9,
      clippingPlanes,
    }),
    boatHull: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.boats),
      roughness: 0.3,
      metalness: 0.2,
      clippingPlanes,
    }),
    boatCabin: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.2,
      clippingPlanes,
    }),
    vehicle: new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.vehicles),
      roughness: 0.3,
      metalness: 0.4,
      clippingPlanes,
    }),
  };

  // -------------------------------------------------------------
  // 1. CUERPO DE AGUA (Bahía de Cartagena & Mar Caribe)
  // -------------------------------------------------------------
  const waterGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
  const waterMesh = new THREE.Mesh(waterGeo, mats.water);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -0.05;
  waterMesh.receiveShadow = true;
  waterMesh.visible = activeLayers.water !== false;
  territoryGroup.add(waterMesh);
  animatedObjects.waterMeshes.push(waterMesh);

  // -------------------------------------------------------------
  // 2. MASAS CONTINENTALES & TOPOGRAFÍA INSULAR
  // -------------------------------------------------------------
  const landGroup = new THREE.Group();
  landGroup.name = "Landmasses";

  // Helper para extruir polígonos 2D a mallas 3D
  function createExtrudedPolygon(points, height = 0.4, material = mats.terrain, yOffset = 0) {
    const shape = new THREE.Shape();
    if (!points || points.length < 3) return null;
    shape.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0], points[i][1]);
    }
    shape.closePath();

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = yOffset;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // A. ISLA DE TIERRA BOMBA (Costas, Meseta y Bahía de Bocachica)
  const tierrabombaCoords = [
    [-22, 10], // Punta Arenas (norte, frente a Castillogrande)
    [-17, 7],
    [-14, 2],  // Caño de Oro (este, hacia la bahía)
    [-13, -6],
    [-15, -12], // Tierrabomba pueblo
    [-18, -17], // Bocachica (sur, paso del canal)
    [-21, -18],
    [-25, -14], // Costa occidental Mar Caribe
    [-26, -5],
    [-25, 4],
    [-24, 8],
  ];
  const tierrabombaMesh = createExtrudedPolygon(tierrabombaCoords, 0.7, mats.terrain, 0);
  if (tierrabombaMesh) landGroup.add(tierrabombaMesh);

  // Meseta elevada central de Tierra Bomba (+22m a +40m)
  const mesetaCoords = [
    [-21, 6],
    [-17, 3],
    [-16, -4],
    [-18, -11],
    [-21, -12],
    [-23, -4],
    [-23, 3],
  ];
  const mesetaMesh = createExtrudedPolygon(mesetaCoords, 0.9, mats.terrain, 0.6);
  if (mesetaMesh) landGroup.add(mesetaMesh);

  // Playas de arena en Punta Arenas
  const arenaCoords = [
    [-23, 11],
    [-20, 11],
    [-18, 8],
    [-21, 8],
  ];
  const arenaMesh = createExtrudedPolygon(arenaCoords, 0.25, mats.terrainSand, 0.02);
  if (arenaMesh) landGroup.add(arenaMesh);

  // B. PENÍNSULA DE BOCAGRANDE & CASTILLOGRANDE
  const bocagrandeCoords = [
    [-6, 17], // Entrada desde Centro Histórico
    [-6, 10],
    [-7, 5],
    [-9, 2],  // Castillogrande (punta sur, frente a Tierrabomba)
    [-11, 2],
    [-10, 8],
    [-9, 14],
    [-8, 17], // Mar Caribe costado occidental
  ];
  const bocagrandeMesh = createExtrudedPolygon(bocagrandeCoords, 0.45, mats.terrainSand, 0);
  if (bocagrandeMesh) landGroup.add(bocagrandeMesh);

  // C. CENTRO HISTÓRICO, GETSEMANÍ & CABRERO
  const centroCoords = [
    [-7, 24], // Marbella / Cabrero
    [-4, 23],
    [-3, 20],
    [-4, 16], // Muelle de la Bodeguita / Bahía de las Ánimas
    [-7, 16], // Parque de la Marina
    [-8, 20], // Muralla sobre el Mar Caribe
  ];
  const centroMesh = createExtrudedPolygon(centroCoords, 0.5, mats.terrain, 0);
  if (centroMesh) landGroup.add(centroMesh);

  // D. ISLA DE MANGA
  const mangaCoords = [
    [-3, 15], // Puente Román
    [0, 14],
    [1, 10],
    [-1, 8],  // Fuerte Pastelillo
    [-4, 11],
    [-4, 14],
  ];
  const mangaMesh = createExtrudedPolygon(mangaCoords, 0.45, mats.terrain, 0);
  if (mangaMesh) landGroup.add(mangaMesh);

  // E. PIE DE LA POPA & CERRO DE LA POPA
  const popaBaseCoords = [
    [0, 20],
    [5, 21],
    [6, 17],
    [2, 16],
    [-1, 18],
  ];
  const popaBaseMesh = createExtrudedPolygon(popaBaseCoords, 0.6, mats.terrain, 0);
  if (popaBaseMesh) landGroup.add(popaBaseMesh);

  // Cerro de la Popa (Cima elevada)
  const cerroPopaCoords = [
    [2, 19.5],
    [4, 19.5],
    [4, 17.5],
    [2, 17.5],
  ];
  const cerroPopaMesh = createExtrudedPolygon(cerroPopaCoords, 1.8, mats.terrain, 0.5);
  if (cerroPopaMesh) landGroup.add(cerroPopaMesh);

  // Convento de la Popa (volumen en la cima)
  const conventoGeo = new THREE.BoxGeometry(1.2, 0.5, 1.0);
  const conventoMesh = new THREE.Mesh(conventoGeo, mats.buildingsColonial);
  conventoMesh.position.set(3, 2.55, -18.5);
  landGroup.add(conventoMesh);

  // F. COSTA CONTINENTAL ORIENTAL & MAMONAL (Zona Industrial & Bahía Sur)
  const mamonalCoords = [
    [2, 12],
    [8, 11],
    [10, 4],
    [8, -6],
    [5, -14], // Pasacaballos / Canal del Dique
    [1, -16],
    [2, -10],
    [3, -2],
    [1, 6],
  ];
  const mamonalMesh = createExtrudedPolygon(mamonalCoords, 0.5, mats.terrain, 0);
  if (mamonalMesh) landGroup.add(mamonalMesh);

  // G. ISLA DE BARÚ (Sector Norte / Pasacaballos)
  const baruCoords = [
    [-4, -20],
    [2, -18],
    [3, -24],
    [-6, -26],
    [-9, -22],
  ];
  const baruMesh = createExtrudedPolygon(baruCoords, 0.5, mats.terrain, 0);
  if (baruMesh) landGroup.add(baruMesh);

  territoryGroup.add(landGroup);

  // -------------------------------------------------------------
  // 3. MURALLAS COLONIALES & FUERTES HISTÓRICOS (Piedra Coralina)
  // -------------------------------------------------------------
  const fortressGroup = new THREE.Group();
  fortressGroup.name = "Fortresses";

  // Muralla perimetral del Centro Histórico
  const wallPoints = [
    [-8, 17], [-8.2, 19], [-8, 22], [-6.5, 23.8], [-4.5, 23.5], [-3.2, 20.5], [-4, 16.5], [-7, 16.2], [-8, 17]
  ];
  for (let i = 0; i < wallPoints.length - 1; i++) {
    const p1 = wallPoints[i];
    const p2 = wallPoints[i + 1];
    const dx = p2[0] - p1[0];
    const dz = -(p2[1] - p1[1]);
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);
    const boxG = new THREE.BoxGeometry(len, 0.35, 0.35);
    const bMesh = new THREE.Mesh(boxG, mats.fortress);
    bMesh.position.set((p1[0] + p2[0]) / 2, 0.65, -(p1[1] + p2[1]) / 2);
    bMesh.rotation.y = -angle;
    bMesh.castShadow = true;
    fortressGroup.add(bMesh);
  }

  // Castillo San Felipe de Barajas
  const sanFelipe1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.4), mats.fortress);
  sanFelipe1.position.set(-1.5, 0.7, -17.5);
  sanFelipe1.rotation.y = 0.3;
  const sanFelipe2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.9), mats.fortress);
  sanFelipe2.position.set(-1.5, 1.1, -17.5);
  sanFelipe2.rotation.y = 0.3;
  fortressGroup.add(sanFelipe1);
  fortressGroup.add(sanFelipe2);

  // Fuerte de San Fernando (Bocachica)
  const bocachicaFort = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.18, 6, 12, Math.PI), mats.fortress);
  bocachicaFort.rotation.x = Math.PI / 2;
  bocachicaFort.position.set(-17.5, 0.75, 17.5);
  fortressGroup.add(bocachicaFort);

  // Fuerte de San José (Costado opuesto Bocachica)
  const sanJoseFort = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.7), mats.fortress);
  sanJoseFort.position.set(-15.2, 0.75, 18.2);
  fortressGroup.add(sanJoseFort);

  territoryGroup.add(fortressGroup);

  // -------------------------------------------------------------
  // 4. RED VIAL 3D & TRAZADOS URBANOS (Cintas Continuas)
  // -------------------------------------------------------------
  const roadsGroup = new THREE.Group();
  roadsGroup.name = "RoadNetwork";

  const roadPaths = [
    // Av. Santander (Borde marítimo Centro - Marbella)
    [[-8, 17], [-8.2, 20], [-7.5, 23.5], [-5, 24], [-2, 24]],
    // Av. San Martín & Carrera 3 (Bocagrande - Castillogrande)
    [[-7, 16.5], [-7, 12], [-8, 7], [-9.5, 3.5], [-10.5, 2.5]],
    [[-6.2, 16.5], [-6.2, 12], [-7.2, 7], [-8.8, 3.5]],
    // Conexión Centro - Manga - Pedro de Heredia
    [[-4, 16.5], [-3, 15], [-1, 14.5], [2, 16], [5, 17.5]],
    // Eje Manga (Calle Real)
    [[-3, 14.5], [-2, 11], [-1.5, 8.5]],
    // Vía Mamonal
    [[2, 12], [4, 9], [6, 3], [5, -4], [3, -11], [1.5, -15]],
    // Senderos y Vías de Tierra Bomba
    [[-21.5, 9.5], [-18, 6.5], [-15, 1.5], [-14, -5], [-16, -11], [-18, -16.5]],
    [[-21.5, 9.5], [-24, 5], [-24, -3], [-21, -11]],
  ];

  roadPaths.forEach(path => {
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const dx = p2[0] - p1[0];
      const dz = -(p2[1] - p1[1]);
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);
      const rGeo = new THREE.PlaneGeometry(len, 0.3);
      const rMesh = new THREE.Mesh(rGeo, mats.roads);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.rotation.z = angle;
      rMesh.position.set((p1[0] + p2[0]) / 2, 0.52, -(p1[1] + p2[1]) / 2);
      rMesh.receiveShadow = true;
      roadsGroup.add(rMesh);
    }
  });

  territoryGroup.add(roadsGroup);

  // -------------------------------------------------------------
  // 5. EDIFICACIONES 3D // MASAS ARQUITECTÓNICAS POR SECTOR
  // -------------------------------------------------------------
  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = "Buildings3D";

  // A. Rascacielos de Bocagrande & Castillogrande (Torres estilizadas de 25m a 140m)
  const towersCoords = [
    [-6.8, 14, 2.8, 0.7, 0.7],
    [-7.4, 13.5, 3.6, 0.8, 0.8],
    [-6.5, 12.2, 4.2, 0.7, 0.9],
    [-7.2, 11.5, 3.2, 0.8, 0.7],
    [-7.8, 10.2, 4.8, 0.8, 0.8], // Gran torre icónica
    [-6.9, 9.5, 3.5, 0.7, 0.7],
    [-7.5, 8.2, 4.0, 0.9, 0.8],
    [-8.2, 7.5, 3.1, 0.7, 0.7],
    [-7.8, 6.2, 2.9, 0.8, 0.8],
    [-8.6, 5.0, 3.7, 0.8, 0.9],
    [-9.2, 4.0, 3.4, 0.8, 0.8],
    [-9.8, 3.0, 2.6, 0.7, 0.7],
    [-10.2, 2.5, 2.2, 0.7, 0.7],
    [-8.8, 3.2, 2.8, 0.7, 0.7],
  ];

  towersCoords.forEach(([x, z, h, w, d]) => {
    const towerGeo = new THREE.BoxGeometry(w, h, d);
    const towerMesh = new THREE.Mesh(towerGeo, mats.buildingsModern);
    towerMesh.position.set(x, 0.5 + h / 2, -z);
    towerMesh.castShadow = true;
    towerMesh.receiveShadow = true;
    buildingsGroup.add(towerMesh);

    // Remate superior / helipuerto
    const capGeo = new THREE.BoxGeometry(w * 0.7, 0.15, d * 0.7);
    const capMesh = new THREE.Mesh(capGeo, mats.fortress);
    capMesh.position.set(x, 0.5 + h + 0.08, -z);
    buildingsGroup.add(capMesh);
  });

  // B. Manzanas Coloniales del Centro Histórico (Volúmenes bajos con techos a dos aguas)
  const centroBlocks = [
    [-6.8, 21.5, 1.1, 0.9],
    [-5.6, 21.8, 1.0, 1.2],
    [-6.5, 20.2, 1.2, 1.0],
    [-5.2, 20.5, 1.1, 0.8],
    [-6.2, 18.8, 1.3, 0.9],
    [-4.8, 19.0, 1.0, 1.1],
    [-5.8, 17.5, 1.2, 0.8],
    [-4.5, 17.6, 1.1, 1.0],
  ];

  centroBlocks.forEach(([x, z, w, d]) => {
    const h = 0.65;
    const blockGeo = new THREE.BoxGeometry(w, h, d);
    const blockMesh = new THREE.Mesh(blockGeo, mats.buildingsColonial);
    blockMesh.position.set(x, 0.5 + h / 2, -z);
    blockMesh.castShadow = true;
    buildingsGroup.add(blockMesh);

    // Techo a cuatro aguas / teja de barro
    const roofGeo = new THREE.ConeGeometry(Math.max(w, d) * 0.75, 0.35, 4);
    const roofMesh = new THREE.Mesh(roofGeo, mats.colonialRoof);
    roofMesh.position.set(x, 0.5 + h + 0.18, -z);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    buildingsGroup.add(roofMesh);
  });

  // Torre del Reloj (Centro)
  const relojBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.6), mats.buildingsColonial);
  relojBase.position.set(-5.5, 1.2, -17.8);
  const relojSpire = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 4), mats.colonialRoof);
  relojSpire.position.set(-5.5, 2.3, -17.8);
  relojSpire.rotation.y = Math.PI / 4;
  buildingsGroup.add(relojBase);
  buildingsGroup.add(relojSpire);

  // C. Edificaciones de Manga & Pie de la Popa
  const mangaBlocks = [
    [-2.8, 13.5, 0.9, 0.8, 0.9],
    [-1.8, 13.0, 1.2, 0.8, 0.7],
    [-2.2, 11.5, 1.4, 0.9, 0.8],
    [-1.5, 10.5, 1.1, 0.8, 0.8],
    [-2.6, 9.8, 0.9, 0.8, 0.7],
    [1.5, 16.5, 0.8, 1.2, 0.8],
    [3.2, 17.2, 0.9, 1.0, 0.8],
  ];

  mangaBlocks.forEach(([x, z, h, w, d]) => {
    const mGeo = new THREE.BoxGeometry(w, h, d);
    const mMesh = new THREE.Mesh(mGeo, mats.buildingsModern);
    mMesh.position.set(x, 0.5 + h / 2, -z);
    mMesh.castShadow = true;
    buildingsGroup.add(mMesh);
  });

  // D. Caseríos y Viviendas Insulares de Tierra Bomba (4 Asentamientos)
  const tierrabombaSettlements = [
    // 1. Punta Arenas (Norte)
    [-21.5, 9.5], [-20.8, 9.0], [-21.8, 8.5], [-22.5, 9.2], [-20.2, 8.4],
    // 2. Caño de Oro (Este)
    [-15.2, 1.8], [-14.6, 1.2], [-15.8, 0.8], [-14.8, 0.2], [-15.5, -0.6],
    // 3. Tierra Bomba Pueblo (Sureste)
    [-15.8, -10.5], [-16.5, -11.2], [-15.2, -11.8], [-17.2, -10.8], [-16.0, -12.5], [-15.4, -9.8],
    // 4. Bocachica (Sur, Fuerte San Fernando)
    [-18.2, -16.0], [-17.5, -16.5], [-18.8, -16.8], [-17.2, -15.5], [-19.2, -16.2],
  ];

  tierrabombaSettlements.forEach(([x, z], idx) => {
    const w = 0.55 + ((idx % 3) * 0.1);
    const d = 0.45 + ((idx % 2) * 0.1);
    const h = 0.35 + ((idx % 4) * 0.08);
    const vGeo = new THREE.BoxGeometry(w, h, d);
    const vMesh = new THREE.Mesh(vGeo, mats.buildingsVernacular);
    vMesh.position.set(x, 0.75 + h / 2, -z);
    vMesh.castShadow = true;
    buildingsGroup.add(vMesh);

    // Techo a dos aguas en madera/zinc
    const roofV = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.7, 0.22, 4), mats.colonialRoof);
    roofV.position.set(x, 0.75 + h + 0.11, -z);
    roofV.rotation.y = Math.PI / 4;
    buildingsGroup.add(roofV);
  });

  territoryGroup.add(buildingsGroup);

  // -------------------------------------------------------------
  // 6. ÁRBOLES & COBERTURA VEGETAL (Manglares y Bosque Seco Tropical)
  // -------------------------------------------------------------
  const treesGroup = new THREE.Group();
  treesGroup.name = "Vegetation";

  const treeLocations = [
    // Parque Centenario / Getsemaní
    [-4.5, 18.2], [-4.8, 17.8], [-4.2, 17.5],
    // Manga paseos
    [-2.2, 14.2], [-1.2, 12.5], [-3.2, 12.0],
    // Laderas de La Popa
    [2.2, 18.5], [3.5, 18.0], [4.2, 19.0], [1.8, 17.2],
    // Vegetación y Manglar Tierra Bomba
    [-20.5, 5.5], [-19.2, 2.0], [-18.5, -2.5], [-20.2, -6.5], [-22.5, 1.5], [-22.0, -8.0],
  ];

  treeLocations.forEach(([x, z], i) => {
    const tGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.4, 6), mats.treeTrunk);
    trunk.position.y = 0.2;
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + (i % 3) * 0.08), mats.treeFoliage);
    foliage.position.y = 0.5;
    foliage.castShadow = true;
    tGroup.add(trunk);
    tGroup.add(foliage);
    tGroup.position.set(x, 0.6, -z);
    treesGroup.add(tGroup);
  });

  territoryGroup.add(treesGroup);

  // -------------------------------------------------------------
  // 7. SIMULACIÓN DE TRÁNSITO MARÍTIMO (LANCHAS Y RUTAS EN VIVO)
  // -------------------------------------------------------------
  const boatRoutes = [
    // Ruta 1: Muelle Bodeguita <---> Punta Arenas (Tierrabomba)
    {
      name: "Bodeguita - Punta Arenas",
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, 0.08, -16.5),
        new THREE.Vector3(-8.0, 0.08, -14.0),
        new THREE.Vector3(-14.0, 0.08, -12.0),
        new THREE.Vector3(-18.5, 0.08, -10.5),
        new THREE.Vector3(-21.0, 0.08, -9.5),
      ]),
      speed: 0.0035,
      t: 0.1,
    },
    // Ruta 2: Muelle Bodeguita <---> Caño de Oro <---> Bocachica
    {
      name: "Bodeguita - Bocachica",
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, 0.08, -16.5),
        new THREE.Vector3(-7.0, 0.08, -10.0),
        new THREE.Vector3(-10.0, 0.08, -3.0),
        new THREE.Vector3(-13.5, 0.08, 2.0),
        new THREE.Vector3(-16.5, 0.08, 10.0),
        new THREE.Vector3(-17.5, 0.08, 16.5),
      ]),
      speed: 0.0028,
      t: 0.55,
    },
    // Ruta 3: Castillogrande (Hospital) <---> Tierrabomba Pueblo
    {
      name: "Castillogrande - Tierrabomba Pueblo",
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-9.5, 0.08, -2.5),
        new THREE.Vector3(-12.0, 0.08, 4.0),
        new THREE.Vector3(-14.5, 0.08, 9.5),
      ]),
      speed: 0.0042,
      t: 0.85,
    },
  ];

  // Visualizar las estelas náuticas punteadas de las rutas
  const routesGroup = new THREE.Group();
  routesGroup.name = "MaritimeRoutes";
  boatRoutes.forEach(route => {
    const pts = route.curve.getPoints(50);
    const rGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const rLine = new THREE.Line(rGeo, new THREE.LineDashedMaterial({
      color: 0x24c8bd,
      dashSize: 0.4,
      gapSize: 0.3,
      transparent: true,
      opacity: 0.6,
    }));
    rLine.computeLineDistances();
    routesGroup.add(rLine);

    // Crear la embarcación / lancha rápida 3D
    const boatGroup = new THREE.Group();
    const hullGeo = new THREE.ConeGeometry(0.25, 0.7, 4);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, mats.boatHull);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.3), mats.boatCabin);
    cabin.position.set(0, 0.12, -0.05);
    boatGroup.add(hull);
    boatGroup.add(cabin);
    boatGroup.scale.set(1.4, 1.4, 1.4);

    territoryGroup.add(boatGroup);
    animatedObjects.boats.push({
      mesh: boatGroup,
      route,
    });
  });
  territoryGroup.add(routesGroup);

  // -------------------------------------------------------------
  // 8. SIMULACIÓN DE VEHÍCULOS URBANOS (Santander & Bocagrande)
  // -------------------------------------------------------------
  const vehicleRoutes = [
    {
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.0, 0.58, -17.0),
        new THREE.Vector3(-8.2, 0.58, -20.0),
        new THREE.Vector3(-7.5, 0.58, -23.5),
        new THREE.Vector3(-5.0, 0.58, -24.0),
        new THREE.Vector3(-2.0, 0.58, -24.0),
      ]),
      speed: 0.005,
      t: 0.2,
    },
    {
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7.0, 0.58, -16.5),
        new THREE.Vector3(-7.0, 0.58, -12.0),
        new THREE.Vector3(-8.0, 0.58, -7.0),
        new THREE.Vector3(-9.5, 0.58, -3.5),
        new THREE.Vector3(-10.5, 0.58, -2.5),
      ]),
      speed: 0.006,
      t: 0.65,
    },
    {
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.0, 0.58, -16.5),
        new THREE.Vector3(-3.0, 0.58, -15.0),
        new THREE.Vector3(-1.0, 0.58, -14.5),
        new THREE.Vector3(2.0, 0.58, -16.0),
        new THREE.Vector3(5.0, 0.58, -17.5),
      ]),
      speed: 0.0045,
      t: 0.4,
    },
  ];

  vehicleRoutes.forEach(r => {
    const vMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.35), mats.vehicle);
    vMesh.castShadow = true;
    territoryGroup.add(vMesh);
    animatedObjects.vehicles.push({
      mesh: vMesh,
      route: r,
    });
  });

  // Centrar y posicionar en la escena
  sceneRoot.add(territoryGroup);

  return {
    group: territoryGroup,
    animatedObjects,
    mats,
    update: (deltaTime = 1) => {
      // Actualizar posición de lanchas en las rutas marítimas
      animatedObjects.boats.forEach(b => {
        b.route.t = (b.route.t + b.route.speed * deltaTime) % 1;
        const pos = b.route.curve.getPointAt(b.route.t);
        const tangent = b.route.curve.getTangentAt(b.route.t);
        b.mesh.position.copy(pos);
        b.mesh.position.y = 0.08 + Math.sin(Date.now() * 0.004 + b.route.t * 10) * 0.02; // vaivén de olas
        const angle = Math.atan2(tangent.x, tangent.z);
        b.mesh.rotation.y = angle + Math.PI;
      });

      // Actualizar posición de vehículos urbanos
      animatedObjects.vehicles.forEach(v => {
        v.route.t = (v.route.t + v.route.speed * deltaTime) % 1;
        const pos = v.route.curve.getPointAt(v.route.t);
        const tangent = v.route.curve.getTangentAt(v.route.t);
        v.mesh.position.copy(pos);
        const angle = Math.atan2(tangent.x, tangent.z);
        v.mesh.rotation.y = angle + Math.PI;
      });
    },
  };
}
