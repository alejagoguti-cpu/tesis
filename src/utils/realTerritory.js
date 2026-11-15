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

function jitterGeo(geo, amp, seed0 = 13) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const h = Math.sin(x * 19.7 + y * 31.3 + z * 23.1 + seed0) * 0.5 + 0.5;
    const s = 1 + (h - 0.5) * amp;
    pos.setXYZ(i, x * s, y * (1 + (h - 0.5) * amp * 0.6), z * s);
  }
  g.computeVertexNormals();
  return g;
}

function makeMat(hex, kind) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    side: THREE.DoubleSide,
    roughness: kind === 'leaf' ? 0.72 : 0.88,
    metalness: 0.02,
    emissive: new THREE.Color(kind === 'leaf' ? 0x16381b : 0x22160e),
    emissiveIntensity: kind === 'leaf' ? 0.2 : 0.1,
  });
}

function buildProceduralSpecies() {
  const leafMat = makeMat(0xffffff, 'leaf');
  const woodMat = makeMat(0x6e4e37, 'wood');
  const extras = [];

  // Especie 2: Palma de Coco (tronco curvo + 7 pencas arqueadas)
  {
    const woodGeos = [];
    const segs = 5;
    for (let i = 0; i < segs; i += 1) {
      const t0 = i / segs;
      const t1 = (i + 1) / segs;
      const g = new THREE.CylinderGeometry(0.026 * (1 - t1 * 0.42), 0.032 * (1 - t0 * 0.38), 0.88 / segs, 6);
      g.translate(Math.sin(t0 * 1.4) * 0.075, (i + 0.5) * (0.88 / segs), 0);
      woodGeos.push(g);
    }
    const leafGeos = [];
    const topX = Math.sin(1.12) * 0.075;
    for (let f = 0; f < 7; f += 1) {
      const ang = (f / 7) * Math.PI * 2;
      const frond = new THREE.ConeGeometry(0.11, 0.44, 4);
      frond.scale(0.55, 1, 0.16);
      frond.rotateZ(Math.PI * 0.62);
      frond.translate(0.22, -0.03, 0);
      frond.rotateY(ang);
      frond.translate(topX, 0.87, 0);
      leafGeos.push(frond);
    }
    extras.push([
      { geometry: mergeGeometries(woodGeos, false), material: woodMat.clone(), kind: 'wood' },
      { geometry: mergeGeometries(leafGeos, false), material: leafMat.clone(), kind: 'leaf' },
    ]);
  }

  // Especie 3: Manglar Costero (raíces zancudas + copa ancha multi-lóbulo)
  {
    const woodGeos = [];
    const trunk = new THREE.CylinderGeometry(0.045, 0.06, 0.45, 6);
    trunk.translate(0, 0.36, 0);
    woodGeos.push(trunk);
    for (let r = 0; r < 5; r += 1) {
      const ang = (r / 5) * Math.PI * 2 + 0.2;
      const root = new THREE.CylinderGeometry(0.015, 0.022, 0.34, 5);
      root.rotateZ(0.45);
      root.rotateY(ang);
      root.translate(Math.cos(ang) * 0.07, 0.15, Math.sin(ang) * 0.07);
      woodGeos.push(root);
    }
    const leafGeos = [];
    const lobes = [
      [0, 0.72, 0, 0.36, 0.26],
      [-0.22, 0.62, 0.12, 0.25, 0.2],
      [0.24, 0.64, -0.1, 0.26, 0.21],
      [0.05, 0.63, -0.22, 0.24, 0.19],
    ];
    lobes.forEach(([lx, ly, lz, rx, ry], idx) => {
      const c = jitterGeo(new THREE.IcosahedronGeometry(1, 1), 0.32, idx * 7 + 3);
      c.scale(rx, ry, rx * 0.92);
      c.translate(lx, ly, lz);
      leafGeos.push(c);
    });
    extras.push([
      { geometry: mergeGeometries(woodGeos, false), material: woodMat.clone(), kind: 'wood' },
      { geometry: mergeGeometries(leafGeos, false), material: leafMat.clone(), kind: 'leaf' },
    ]);
  }

  // Especie 4: Almendro / Ceiba Caribeña (copa ancha en sombrilla)
  {
    const woodGeos = [];
    const trunk = new THREE.CylinderGeometry(0.045, 0.075, 0.62, 6);
    trunk.translate(0, 0.31, 0);
    woodGeos.push(trunk);
    for (let b = 0; b < 3; b += 1) {
      const ang = (b / 3) * Math.PI * 2;
      const br = new THREE.CylinderGeometry(0.02, 0.034, 0.32, 5);
      br.rotateZ(-0.55);
      br.rotateY(ang);
      br.translate(Math.cos(ang) * 0.09, 0.6, Math.sin(ang) * 0.09);
      woodGeos.push(br);
    }
    const leafGeos = [];
    const capas = [
      [0, 0.78, 0, 0.46, 0.14],
      [-0.18, 0.7, 0.16, 0.28, 0.12],
      [0.2, 0.72, -0.15, 0.27, 0.12],
      [0, 0.89, 0, 0.3, 0.11],
    ];
    capas.forEach(([lx, ly, lz, rx, ry], idx) => {
      const c = jitterGeo(new THREE.DodecahedronGeometry(1, 0), 0.26, idx * 11 + 5);
      c.scale(rx, ry, rx);
      c.translate(lx, ly, lz);
      leafGeos.push(c);
    });
    extras.push([
      { geometry: mergeGeometries(woodGeos, false), material: woodMat.clone(), kind: 'wood' },
      { geometry: mergeGeometries(leafGeos, false), material: leafMat.clone(), kind: 'leaf' },
    ]);
  }

  // Especie 5: Arbusto / Matorral de Bosque Seco
  {
    const trunk = new THREE.CylinderGeometry(0.03, 0.048, 0.3, 5);
    trunk.translate(0, 0.15, 0);
    const leafGeos = [];
    [
      [0, 0.48, 0, 0.32, 0.28],
      [-0.16, 0.38, 0.14, 0.22, 0.22],
      [0.17, 0.4, -0.11, 0.23, 0.21],
    ].forEach(([lx, ly, lz, rx, ry], idx) => {
      const c = jitterGeo(new THREE.IcosahedronGeometry(1, 1), 0.38, idx * 9 + 19);
      c.scale(rx, ry, rx);
      c.translate(lx, ly, lz);
      leafGeos.push(c);
    });
    extras.push([
      { geometry: trunk, material: woodMat.clone(), kind: 'wood' },
      { geometry: mergeGeometries(leafGeos, false), material: leafMat.clone(), kind: 'leaf' },
    ]);
  }

  return extras;
}

// ---- Reutilizables (módulo 02 y Aula Ambiental): especies normalizadas a 1 unidad de alto + instanciado por bloques ----
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
  species.push(...buildProceduralSpecies());
  return species;
}

function pickSpeciesIndex(t, i, total) {
  if (total <= 2) return (Math.imul(i + 1, 2654435761) >>> 0) % total;
  const r = (Math.imul(i + 11, 2654435761) >>> 0) % 100;
  if (t.ecotipo === 'manglar') {
    if (r < 42) return 3; // Manglar costero
    if (r < 68) return 2; // Palma de coco
    if (r < 85) return 1;
    return 5; // Arbusto costero
  }
  if (t.ecotipo === 'sombra') {
    if (r < 32) return 2; // Palma de coco
    if (r < 60) return 4; // Almendro de sombra
    if (r < 80) return 0;
    return 1;
  }
  // bosque_seco
  if (r < 28) return 0;
  if (r < 54) return 1;
  if (r < 74) return 4; // Almendro / Ceiba
  if (r < 90) return 5; // Arbusto tropical
  return 2; // Palma aislada
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
        const wx = t.height * (0.76 + s0 * 0.54);
        const wy = t.height * (0.8 + s1 * 0.48);
        const wz = t.height * (0.76 + s2 * 0.54);
        sc.set(wx, wy, wz);
        pos.set(t.x, t.y, t.z);
        m4.compose(pos, q, sc);
        mesh.setMatrixAt(k, m4);
        if (part.kind === 'leaf') {
          const tn = t.tone ?? 0.5;
          if (t.ecotipo === 'manglar') {
            col.setRGB(0.24 + tn * 0.22, 0.52 + s0 * 0.28, 0.34 + s1 * 0.18);
          } else if (t.ecotipo === 'bosque_seco') {
            col.setRGB(0.36 + tn * 0.34, 0.56 + s0 * 0.28, 0.22 + s1 * 0.18);
          } else {
            col.setRGB(0.3 + tn * 0.28, 0.6 + s0 * 0.28, 0.26 + s1 * 0.2);
          }
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
