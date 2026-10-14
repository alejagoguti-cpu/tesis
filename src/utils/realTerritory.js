import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

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

// ---- Reutilizables (módulo 02): especies normalizadas a 1 unidad de alto + instanciado por bloques ----
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
      p.material.envMapIntensity = 0.7;
      if (p.kind === 'leaf') p.material.alphaTest = Math.max(p.material.alphaTest || 0, 0.4);
    });
    species.push(parts);
  }
  return species;
}

/** list: [{x, y, z, rot, height, tone}] en coordenadas de mundo; cell = tamaño del bloque para el recorte por cámara */
export function instanceTrees(species, list, cell = 6, castShadow = true) {
  const chunks = new Map();
  list.forEach((t, i) => {
    const sp = (Math.imul(i + 1, 2654435761) >>> 0) % species.length;
    const key = sp + ':' + Math.floor(t.x / cell) + ':' + Math.floor(t.z / cell);
    if (!chunks.has(key)) chunks.set(key, []);
    chunks.get(key).push(t);
  });
  const group = new THREE.Group();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const sc = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const col = new THREE.Color();
  for (const [key, items] of chunks) {
    const sp = parseInt(key.split(':')[0], 10);
    species[sp].forEach((part) => {
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, items.length);
      items.forEach((t, k) => {
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
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
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
