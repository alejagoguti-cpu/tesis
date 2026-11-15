import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// =============================================================================
// Territorio real de Tierrabomba: imagen satelital georreferenciada y vegetación
// detectada sobre esa misma imagen (ver public/data/tierrabomba/CREDITOS.txt).
// =============================================================================

export const BASE = (() => {
  const b = import.meta.env.BASE_URL || '/';
  return b.endsWith('/') ? b : b + '/';
})();

export const DATA_URL = `${BASE}data/tierrabomba/`;

export async function loadSatelliteMap() {
  const res = await fetch(`${DATA_URL}satellite_map.json`);
  if (!res.ok) throw new Error('satellite_map.json no disponible');
  return res.json();
}

export function loadSatelliteTexture(renderer) {
  const tex = new THREE.TextureLoader().load(`${BASE}textures/tierrabomba_satelite.jpg`);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer ? Math.min(16, renderer.capabilities.getMaxAnisotropy()) : 8;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// UV de la imagen satelital a partir de las coordenadas locales del modelo (x, y en metros)
export function applySatelliteUV(geometry, map) {
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const [a0, a1] = map.origin;
  const [[i00, i01], [i10, i11]] = map.inv;
  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i) - a0;
    const dy = pos.getY(i) - a1;
    uv[i * 2] = i00 * dx + i01 * dy;
    uv[i * 2 + 1] = 1 - (i10 * dx + i11 * dy);
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

const loadGLB = (url) =>
  new Promise((resolve, reject) => new GLTFLoader().load(url, resolve, undefined, reject));

// Hornea las mallas de un GLB (aplica transformaciones de nodo) y devuelve geometría + material
function bakeParts(scene) {
  scene.updateMatrixWorld(true);
  const parts = [];
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    parts.push({ geometry: g, material: mat });
  });
  return parts;
}

/**
 * Dibuja los árboles reales (instanciados) sobre el terreno.
 * @param parentObj  objeto del modelo Revit (con su escala/rotación ya aplicadas)
 * @param heightAt   altura del terreno en coordenadas de mundo
 */
export async function loadRealTrees({ parentObj, heightAt, onProgress }) {
  const res = await fetch(`${DATA_URL}vegetacion.json`);
  if (!res.ok) throw new Error('vegetacion.json no disponible');
  const data = await res.json();

  const species = [];
  for (const id of ['island_tree_01', 'island_tree_02']) {
    const [leaves, wood] = await Promise.all([
      loadGLB(`${BASE}models/arboles/${id}_L1_hojas.glb`),
      loadGLB(`${BASE}models/arboles/${id}_L1_madera.glb`)
    ]);
    const parts = [...bakeParts(leaves.scene).map((p) => ({ ...p, kind: 'leaf' })), ...bakeParts(wood.scene).map((p) => ({ ...p, kind: 'wood' }))];
    const box = new THREE.Box3();
    parts.forEach((p) => {
      p.geometry.computeBoundingBox();
      box.union(p.geometry.boundingBox);
    });
    const h = box.max.y - box.min.y || 1;
    const norm = new THREE.Matrix4()
      .makeScale(1 / h, 1 / h, 1 / h)
      .multiply(new THREE.Matrix4().makeTranslation(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2));
    parts.forEach((p) => {
      p.geometry.applyMatrix4(norm);
      p.material = p.material.clone();
      p.material.side = THREE.DoubleSide;
      p.material.envMapIntensity = 0.7;
      if (p.kind === 'leaf') p.material.alphaTest = Math.max(p.material.alphaTest || 0, 0.4);
    });
    species.push(parts);
  }

  const worldScale = parentObj.scale.x || 1;
  const CELL = 6;
  const chunks = new Map();
  const tmp = new THREE.Vector3();
  let placed = 0;
  data.arboles.forEach(([x, y, size, dense], i) => {
    tmp.set(x, y, 0);
    parentObj.localToWorld(tmp);
    const h = heightAt(tmp.x, tmp.z);
    if (h === null || h < 0.1) return;
    const sp = (Math.imul(i + 1, 2654435761) >>> 0) % 2;
    const key = `${sp}:${Math.floor(tmp.x / CELL)}:${Math.floor(tmp.z / CELL)}`;
    if (!chunks.has(key)) chunks.set(key, []);
    const rot = ((Math.imul(i + 7, 40503) >>> 0) % 628) / 100;
    const height = 8.5 * size * (dense ? 0.92 : 1.05) * worldScale;
    chunks.get(key).push({ x: tmp.x, y: h - 0.004, z: tmp.z, rot, height, tone: ((Math.imul(i + 3, 69069) >>> 0) % 100) / 100 });
    placed++;
  });

  const group = new THREE.Group();
  group.name = 'VegetacionReal';
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const sc = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const col = new THREE.Color();
  for (const [key, list] of chunks) {
    const sp = parseInt(key.split(':')[0], 10);
    species[sp].forEach((part) => {
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, list.length);
      list.forEach((t, k) => {
        q.setFromAxisAngle(up, t.rot);
        sc.set(t.height, t.height, t.height);
        pos.set(t.x, t.y, t.z);
        m4.compose(pos, q, sc);
        mesh.setMatrixAt(k, m4);
        if (part.kind === 'leaf') {
          const v = 0.82 + t.tone * 0.3;
          col.setRGB(v, v * (0.96 + t.tone * 0.08), v * 0.9);
          mesh.setColorAt(k, col);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      group.add(mesh);
    });
  }
  if (onProgress) onProgress(placed);
  return { group, count: placed, source: data.fuente };
}

// Plantillas de árbol reales (1 unidad de alto) para plantar a mano con la herramienta de vegetación
export async function loadTreeTemplates() {
  const out = [];
  for (const id of ['island_tree_01', 'island_tree_02']) {
    const [leaves, wood] = await Promise.all([
      loadGLB(`${BASE}models/arboles/${id}_L1_hojas.glb`),
      loadGLB(`${BASE}models/arboles/${id}_L1_madera.glb`)
    ]);
    const group = new THREE.Group();
    [leaves.scene, wood.scene].forEach((sc) => {
      sc.updateMatrixWorld(true);
      group.add(sc);
    });
    const box = new THREE.Box3().setFromObject(group);
    const h = box.max.y - box.min.y || 1;
    const wrap = new THREE.Group();
    group.scale.setScalar(1 / h);
    group.position.set(-((box.min.x + box.max.x) / 2) / h, -box.min.y / h, -((box.min.z + box.max.z) / 2) / h);
    wrap.add(group);
    wrap.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m) {
          m.side = THREE.DoubleSide;
          if (m.alphaMap || m.map) m.alphaTest = Math.max(m.alphaTest || 0, 0.4);
        }
      }
    });
    out.push(wrap);
  }
  return out;
}

function mergePartsByKind(parts) {
  const byMat = new Map();
  for (const p of parts) {
    const k = `${p.kind}:${p.material.uuid}`;
    if (!byMat.has(k)) byMat.set(k, { kind: p.kind, material: p.material, geos: [] });
    byMat.get(k).geos.push(p.geometry);
  }
  const out = [];
  for (const entry of byMat.values()) {
    if (entry.geos.length === 1) {
      out.push({ geometry: entry.geos[0], material: entry.material, kind: entry.kind });
    } else {
      const merged = mergeGeometries(entry.geos, false);
      if (merged) {
        entry.geos.forEach((g) => g.dispose());
        out.push({ geometry: merged, material: entry.material, kind: entry.kind });
      } else {
        entry.geos.forEach((g) => out.push({ geometry: g, material: entry.material, kind: entry.kind }));
      }
    }
  }
  return out;
}

function clonarCopaConTransform(parts, { dx = 0, dy = 0, dz = 0, rotY = 0, sx = 1, sy = 1, sz = 1, soloHojas = false }) {
  const mat4 = new THREE.Matrix4()
    .makeTranslation(dx, dy, dz)
    .multiply(new THREE.Matrix4().makeRotationY(rotY))
    .multiply(new THREE.Matrix4().makeScale(sx, sy, sz));
  return parts
    .filter((p) => !soloHojas || p.kind === 'leaf')
    .map((p) => {
      const geo = p.geometry.clone();
      geo.applyMatrix4(mat4);
      return { geometry: geo, material: p.material, kind: p.kind };
    });
}

// ---- Reutilizables (módulo 02 y Aula Ambiental): especies GLB reales normalizadas a 1 unidad de alto + instanciado por bloques ----
export async function prepareTreeSpecies() {
  const species = [];
  for (const id of ['island_tree_01', 'island_tree_02']) {
    const [leaves, wood] = await Promise.all([
      loadGLB(`${BASE}models/arboles/${id}_L1_hojas.glb`),
      loadGLB(`${BASE}models/arboles/${id}_L1_madera.glb`)
    ]);
    const parts = [...bakeParts(leaves.scene).map((p) => ({ ...p, kind: 'leaf' })), ...bakeParts(wood.scene).map((p) => ({ ...p, kind: 'wood' }))];
    const box = new THREE.Box3();
    parts.forEach((p) => {
      p.geometry.computeBoundingBox();
      box.union(p.geometry.boundingBox);
    });
    const h = box.max.y - box.min.y || 1;
    const norm = new THREE.Matrix4()
      .makeScale(1 / h, 1 / h, 1 / h)
      .multiply(new THREE.Matrix4().makeTranslation(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2));
    parts.forEach((p) => {
      p.geometry.applyMatrix4(norm);
      p.material = p.material.clone();
      p.material.side = THREE.DoubleSide;
      p.material.envMapIntensity = 0.85;
      if (p.kind === 'leaf') {
        p.material.alphaTest = Math.max(p.material.alphaTest || 0, 0.42);
        p.material.roughness = 0.65;
        p.material.metalness = 0.0;
        p.material.emissive = new THREE.Color(0x183d1e);
        p.material.emissiveIntensity = 0.28;
      } else {
        p.material.roughness = 0.85;
        p.material.metalness = 0.04;
        p.material.emissive = new THREE.Color(0x22160e);
        p.material.emissiveIntensity = 0.12;
      }
    });
    species.push(parts);
  }

  // Variantes reales (100% GLB texturizado, cero low-poly) con contrastes claros de tamaño, silueta y densidad:
  const base0 = species[0];
  const base1 = species[1];

  // Especie 2: Árbol Gigante de Copa Ancha (3 copas amplias desplazadas para formar gran copa frondosa)
  species.push(mergePartsByKind([
    ...clonarCopaConTransform(base0, { sx: 1.38, sy: 1.08, sz: 1.38 }),
    ...clonarCopaConTransform(base0, { dx: 0.34, dy: 0.08, dz: -0.22, rotY: 2.1, sx: 1.22, sy: 0.92, sz: 1.22, soloHojas: true }),
    ...clonarCopaConTransform(base0, { dx: -0.32, dy: 0.04, dz: 0.24, rotY: 4.1, sx: 1.18, sy: 0.88, sz: 1.18, soloHojas: true }),
  ]));

  // Especie 3: Matorral / Manglar Súper Denso (4 copas bajas agrupadas en mancha densa)
  species.push(mergePartsByKind([
    ...clonarCopaConTransform(base1, { dx: -0.34, dy: 0, dz: 0.22, rotY: 0.7, sx: 1.35, sy: 0.72, sz: 1.35 }),
    ...clonarCopaConTransform(base1, { dx: 0.36, dy: 0.02, dz: -0.20, rotY: 2.8, sx: 1.30, sy: 0.68, sz: 1.30, soloHojas: true }),
    ...clonarCopaConTransform(base1, { dx: 0.04, dy: 0.14, dz: 0.32, rotY: 4.9, sx: 1.15, sy: 0.78, sz: 1.15, soloHojas: true }),
    ...clonarCopaConTransform(base1, { dx: -0.10, dy: -0.02, dz: -0.32, rotY: 1.4, sx: 1.20, sy: 0.66, sz: 1.20, soloHojas: true }),
  ]));

  // Especie 4: Árbol Alto y Esbelto
  species.push(clonarCopaConTransform(base1, { sx: 0.64, sy: 1.62, sz: 0.64 }));

  return species;
}

function pickSpeciesIndex(t, i, total) {
  if (total <= 2) return (Math.imul(i + 1, 2654435761) >>> 0) % total;
  const r = (Math.imul(i + 11, 2654435761) >>> 0) % 100;
  if (t.ecotipo === 'manglar') {
    if (r < 48) return 3; // Manglar súper denso
    if (r < 76) return 2; // Árbol grande frondoso
    return r % 2;
  }
  if (t.ecotipo === 'sombra') {
    if (r < 34) return 2; // Árbol grande frondoso
    if (r < 58) return 4; // Alto esbelto
    if (r < 80) return 0;
    return 1;
  }
  // bosque_seco
  if (r < 28) return 2; // Árboles grandes de bosque
  if (r < 50) return 3; // Grupos densos
  if (r < 70) return 4; // Altos esbeltos
  return r % 2;
}

/** list: [{x, y, z, rot, height, tone, ecotipo?}] en coordenadas de mundo; cell = tamaño del bloque para el recorte por cámara */
export function instanceTrees(species, list, cell = 6, castShadow = true) {
  const chunks = new Map();
  list.forEach((t, i) => {
    const sp = pickSpeciesIndex(t, i, species.length);
    const key = sp + ':' + Math.floor(t.x / cell) + ':' + Math.floor(t.z / cell);
    if (!chunks.has(key)) chunks.set(key, []);
    chunks.get(key).push({ ...t, _seed: (Math.imul(i + 17, 1664525) + 1013904223) >>> 0 });
  });
  const group = new THREE.Group();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const sc = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const col = new THREE.Color();
  for (const [key, items] of chunks) {
    const sp = parseInt(key.split(':')[0], 10);
    species[sp].forEach((part) => {
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, items.length);
      items.forEach((t, k) => {
        const s0 = (t._seed & 255) / 255;
        const s1 = ((t._seed >>> 8) & 255) / 255;
        const s2 = ((t._seed >>> 16) & 255) / 255;
        const tiltX = (s0 - 0.5) * 0.16;
        const tiltZ = (s1 - 0.5) * 0.16;
        euler.set(tiltX, t.rot, tiltZ, 'YXZ');
        q.setFromEuler(euler);
        const multTam =
          sp === 2 ? (1.65 + s1 * 1.15)
          : sp === 3 ? (1.05 + s0 * 0.75)
          : sp === 4 ? (1.25 + s1 * 0.85)
          : sp === 0 ? (0.42 + s1 * 0.34)
          : (0.76 + s1 * 0.48);
        const wx = t.height * multTam * (0.78 + s0 * 0.44);
        const wy = t.height * multTam * (0.82 + s1 * 0.42);
        const wz = t.height * multTam * (0.78 + s2 * 0.44);
        sc.set(wx, wy, wz);
        // Desplazamiento orgánico para romper la retícula uniforme y crear claros/bosquetes naturales
        pos.set(t.x + (s0 - 0.5) * 6.5, t.y, t.z + (s2 - 0.5) * 6.5);
        m4.compose(pos, q, sc);
        mesh.setMatrixAt(k, m4);
        if (part.kind === 'leaf') {
          const tn = t.tone ?? 0.5;
          if (t.ecotipo === 'manglar') {
            col.setRGB(0.18 + tn * 0.24, 0.44 + s0 * 0.38, 0.28 + s1 * 0.22);
          } else if (t.ecotipo === 'bosque_seco') {
            col.setRGB(0.28 + tn * 0.42, 0.48 + s0 * 0.36, 0.16 + s1 * 0.20);
          } else {
            col.setRGB(0.24 + tn * 0.34, 0.54 + s0 * 0.34, 0.22 + s1 * 0.22);
          }
          mesh.setColorAt(k, col);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      mesh.computeBoundingSphere();
      group.add(mesh);
    });
  }
  return group;
}

// Iluminación de entorno a partir de un cielo físico (la misma del módulo 05)
export function createSkyEnvironment(renderer) {
  const sunDir = new THREE.Vector3(75, 100, 65).normalize();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const sky = new Sky();
  sky.scale.setScalar(90);
  const u = sky.material.uniforms;
  u.turbidity.value = 3.4;
  u.rayleigh.value = 1.15;
  u.mieCoefficient.value = 0.0045;
  u.mieDirectionalG.value = 0.82;
  u.sunPosition.value.copy(sunDir);
  envScene.add(sky);
  const rt = pmrem.fromScene(envScene, 0, 0.1, 200);
  pmrem.dispose();
  return rt.texture;
}
