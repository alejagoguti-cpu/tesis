import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const STORAGE_KEY_CATASTRO = 'thesis_custom_trees_catastro_v2';
export const STORAGE_KEY_REVIT = 'thesis_custom_trees_revit_v2';

// Cargar y limpiar el modelo de árbol de SketchUp (tree.glb)
// Eliminando bordes negros, eliminando trazos de líneas, aumentando la cota de alfa
// y potenciando los tonos verdes vivos y frondosos.
let cachedTemplate = null;
let loadingPromise = null;

export function loadCleanTreeTemplate(basePath = '/') {
  if (cachedTemplate) {
    return Promise.resolve(cachedTemplate.clone());
  }
  if (loadingPromise) {
    return loadingPromise.then((t) => t.clone());
  }

  const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
  const treeUrl = `${cleanBase}models/tree.glb`;

  loadingPromise = new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      treeUrl,
      (gltf) => {
        const treeScene = gltf.scene;

        // Limpieza y refinamiento estético de materiales:
        // Cero bordes negros + tonos verdes vibrantes y luminosos
        treeScene.traverse((c) => {
          // 1. Ocultar líneas o aristas de wireframe/outlines de SketchUp
          if (c.isLine || c.type?.includes('Line')) {
            c.visible = false;
            return;
          }

          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;

            const name = (c.name || '').toLowerCase();
            const isFoliage = name.includes('deeppink') || name.includes('leaf') || name.includes('hoja') || name.includes('foliage') || !name.includes('bark');

            if (c.material) {
              // Clonar material para evitar contaminaciones
              const origMat = c.material;
              const newMat = origMat.clone();

              if (isFoliage) {
                // FOLLAJE: Sin borde negro, verdoso vivo y luminoso
                newMat.side = THREE.DoubleSide;
                // Subir el alphaTest a 0.65 para cortar el halo negro del borde semi-transparente de SketchUp
                newMat.alphaTest = 0.65;
                newMat.depthWrite = true;
                newMat.shadowSide = THREE.DoubleSide;

                // Color verde vibrante y exuberante
                newMat.color = new THREE.Color('#4ade80'); // Verde esmeralda fresco
                // Emisivo sutil para que las hojas en sombra mantengan luminosidad natural
                newMat.emissive = new THREE.Color('#14532d');
                newMat.emissiveIntensity = 0.22;
                newMat.roughness = 0.55;
                newMat.metalness = 0.0;
              } else {
                // TRONCO / RAMAS: Madera natural cálida
                newMat.color = new THREE.Color('#784f33');
                newMat.roughness = 0.85;
                newMat.metalness = 0.0;
                newMat.emissive = new THREE.Color('#271810');
                newMat.emissiveIntensity = 0.08;
              }

              c.material = newMat;
            }
          }
        });

        cachedTemplate = treeScene;
        resolve(treeScene.clone());
      },
      undefined,
      (err) => {
        console.warn('Usando árbol procedural estilizado sin bordes negros:', err);
        const proceduralTree = createProceduralTreeTemplate();
        cachedTemplate = proceduralTree;
        resolve(proceduralTree.clone());
      }
    );
  });

  return loadingPromise;
}

// Generador de árbol procedural elegante, 100% libre de bordes negros y con follaje verde vivo
export function createProceduralTreeTemplate() {
  const group = new THREE.Group();
  group.name = 'ProceduralTree';

  // Tronco orgánico café cálido
  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.20, 1.2, 10);
  trunkGeo.translate(0, 0.6, 0);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x6d4c41,
    roughness: 0.85,
    metalness: 0.05
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Capa 1 de Follaje: Verde vivo brillante
  const folMat1 = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x14532d,
    emissiveIntensity: 0.22,
    roughness: 0.55,
    metalness: 0.0
  });
  const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), folMat1);
  fol1.position.set(0, 1.45, 0);
  fol1.scale.set(1.1, 0.95, 1.1);
  fol1.castShadow = true;
  fol1.receiveShadow = true;
  group.add(fol1);

  // Capa 2 de Follaje: Verde bosque medio para dar volumen natural
  const folMat2 = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x0f3f22,
    emissiveIntensity: 0.18,
    roughness: 0.55,
    metalness: 0.0
  });
  const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), folMat2);
  fol2.position.set(0.15, 1.95, 0.1);
  fol2.scale.set(0.9, 0.85, 0.9);
  fol2.castShadow = true;
  fol2.receiveShadow = true;
  group.add(fol2);

  return group;
}

// Almacenamiento local persistente
export function getSavedTrees(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error leyendo árboles guardados:', e);
  }
  return [];
}

export function saveTrees(storageKey, treesList) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(treesList));
    return true;
  } catch (e) {
    console.error('Error guardando árboles en localStorage:', e);
    return false;
  }
}

// Crear instancia individual del árbol para colocar en la escena 3D
export function buildTreeObject(template, data) {
  const treeInstance = template.clone(true);
  treeInstance.name = `CustomTree_${data.id}`;
  treeInstance.userData = {
    isCustomTree: true,
    treeId: data.id,
    scale: data.scale || 1.0,
    origScale: data.scale || 1.0
  };

  const s = data.scale || 1.0;
  treeInstance.scale.set(s, s, s);
  treeInstance.position.set(data.x, data.y, data.z);
  if (data.rotY !== undefined) {
    treeInstance.rotation.y = data.rotY;
  }

  // Marcar todos los descendientes con userData para permitir detección por raycast
  treeInstance.traverse((child) => {
    if (child.isMesh) {
      child.userData.isCustomTree = true;
      child.userData.treeId = data.id;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return treeInstance;
}
