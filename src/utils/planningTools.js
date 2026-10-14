import * as THREE from 'three';

// =============================================================================
// Herramientas de planeación sobre el terreno: vías dibujadas y zonificación.
// Todo se "drapea" sobre una malla de alturas calculada del terreno real (Revit).
// =============================================================================

export const STORAGE_ROADS = 'tesis_m5_roads_v1';
export const STORAGE_ZONES = 'tesis_m5_zones_v1';

export const ZONE_TYPES = [
  { id: 'vivienda', name: 'Vivienda progresiva', color: '#f59e0b' },
  { id: 'educativo', name: 'Equipamiento educativo', color: '#3b82f6' },
  { id: 'publico', name: 'Espacio público y verde', color: '#22c55e' },
  { id: 'comercio', name: 'Comercio y servicios', color: '#a855f7' },
  { id: 'ambiental', name: 'Conservación ambiental', color: '#0d9488' },
  { id: 'hidrico', name: 'Infraestructura hídrica', color: '#06b6d4' },
  { id: 'riesgo', name: 'Riesgo / no ocupar', color: '#ef4444' }
];

export function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

// -----------------------------------------------------------------------------
// Malla de alturas: rasteriza los triángulos del terreno en una cuadrícula
// -----------------------------------------------------------------------------
export function buildHeightField(meshes, res = 640) {
  const box = new THREE.Box3();
  meshes.forEach((m) => {
    m.updateWorldMatrix(true, false);
    box.expandByObject(m);
  });
  if (box.isEmpty()) return null;

  const pad = 2;
  const minX = box.min.x - pad, minZ = box.min.z - pad;
  const sizeX = box.max.x - box.min.x + pad * 2;
  const sizeZ = box.max.z - box.min.z + pad * 2;
  const nx = res, nz = Math.max(8, Math.round(res * (sizeZ / sizeX)));
  const data = new Float32Array(nx * nz).fill(-1e9);
  const cx = sizeX / (nx - 1), cz = sizeZ / (nz - 1);

  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  meshes.forEach((m) => {
    const pos = m.geometry?.attributes?.position;
    if (!pos) return;
    const idx = m.geometry.index;
    const triCount = idx ? idx.count / 3 : pos.count / 3;
    const mw = m.matrixWorld;
    for (let t = 0; t < triCount; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3;
      const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(mw);
      b.fromBufferAttribute(pos, i1).applyMatrix4(mw);
      c.fromBufferAttribute(pos, i2).applyMatrix4(mw);
      const gx0 = Math.max(0, Math.floor((Math.min(a.x, b.x, c.x) - minX) / cx));
      const gx1 = Math.min(nx - 1, Math.ceil((Math.max(a.x, b.x, c.x) - minX) / cx));
      const gz0 = Math.max(0, Math.floor((Math.min(a.z, b.z, c.z) - minZ) / cz));
      const gz1 = Math.min(nz - 1, Math.ceil((Math.max(a.z, b.z, c.z) - minZ) / cz));
      const det = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
      if (Math.abs(det) < 1e-12) continue;
      for (let gz = gz0; gz <= gz1; gz++) {
        const pz = minZ + gz * cz;
        for (let gx = gx0; gx <= gx1; gx++) {
          const px = minX + gx * cx;
          const l1 = ((b.z - c.z) * (px - c.x) + (c.x - b.x) * (pz - c.z)) / det;
          const l2 = ((c.z - a.z) * (px - c.x) + (a.x - c.x) * (pz - c.z)) / det;
          const l3 = 1 - l1 - l2;
          if (l1 < -0.02 || l2 < -0.02 || l3 < -0.02) continue;
          const y = l1 * a.y + l2 * b.y + l3 * c.y;
          const k = gz * nx + gx;
          if (y > data[k]) data[k] = y;
        }
      }
    }
  });

  // Rellena huecos con el vecino válido más cercano (bordes de triángulos)
  for (let pass = 0; pass < 2; pass++) {
    for (let gz = 1; gz < nz - 1; gz++) {
      for (let gx = 1; gx < nx - 1; gx++) {
        const k = gz * nx + gx;
        if (data[k] > -1e8) continue;
        const n = [data[k - 1], data[k + 1], data[k - nx], data[k + nx]].filter((v) => v > -1e8);
        if (n.length >= 3) data[k] = n.reduce((s, v) => s + v, 0) / n.length;
      }
    }
  }

  const heightAt = (x, z) => {
    const fx = (x - minX) / cx, fz = (z - minZ) / cz;
    if (fx < 0 || fz < 0 || fx > nx - 1 || fz > nz - 1) return null;
    const x0 = Math.floor(fx), z0 = Math.floor(fz);
    const x1 = Math.min(nx - 1, x0 + 1), z1 = Math.min(nz - 1, z0 + 1);
    const tx = fx - x0, tz = fz - z0;
    const h00 = data[z0 * nx + x0], h10 = data[z0 * nx + x1];
    const h01 = data[z1 * nx + x0], h11 = data[z1 * nx + x1];
    const vals = [h00, h10, h01, h11];
    if (vals.some((v) => v < -1e8)) {
      const ok = vals.filter((v) => v > -1e8);
      return ok.length ? Math.max(...ok) : null;
    }
    return (h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
  };

  // Marcha de rayo contra la malla de alturas -> punto sobre el terreno
  const pickRay = (ray, minLand = 0.09) => {
    const step = 0.25;
    const p = new THREE.Vector3();
    let prevT = 0;
    for (let t = 0; t < 600; t += step) {
      ray.at(t, p);
      const h = heightAt(p.x, p.z);
      if (h !== null && p.y <= h) {
        let lo = prevT, hi = t;
        for (let i = 0; i < 12; i++) {
          const mid = (lo + hi) / 2;
          ray.at(mid, p);
          const hh = heightAt(p.x, p.z);
          if (hh !== null && p.y <= hh) hi = mid; else lo = mid;
        }
        ray.at(hi, p);
        const hf = heightAt(p.x, p.z);
        if (hf === null || hf < minLand) return null;
        return new THREE.Vector3(p.x, hf, p.z);
      }
      prevT = t;
    }
    return null;
  };

  return { heightAt, pickRay };
}

// -----------------------------------------------------------------------------
// Vías: cinta que sigue el terreno
// -----------------------------------------------------------------------------
function ribbon(points, width, heightAt, lift, closed = false) {
  const pts3 = points.map((p) => new THREE.Vector3(p.x, 0, p.z));
  if (pts3.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(pts3, closed, 'centripetal', 0.5);
  const len = curve.getLength();
  const n = Math.max(6, Math.ceil(len / 0.18));
  const samples = curve.getSpacedPoints(n);
  const pos = [], uv = [], idx = [];
  let dist = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const prev = samples[Math.max(0, i - 1)];
    const nxt = samples[Math.min(samples.length - 1, i + 1)];
    let tx = nxt.x - prev.x, tz = nxt.z - prev.z;
    const tl = Math.hypot(tx, tz) || 1;
    tx /= tl; tz /= tl;
    const nxv = -tz, nzv = tx;
    if (i > 0) dist += Math.hypot(s.x - samples[i - 1].x, s.z - samples[i - 1].z);
    [-1, 1].forEach((side) => {
      const x = s.x + nxv * width * 0.5 * side;
      const z = s.z + nzv * width * 0.5 * side;
      const h = heightAt(x, z);
      pos.push(x, (h === null ? 0.1 : h) + lift, z);
      uv.push(side < 0 ? 0 : 1, dist / (width * 2.5));
    });
    if (i < samples.length - 1) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function createRoadMaterials(texLoader, sandUrl, bumpUrl) {
  const map = texLoader.load(sandUrl);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = texLoader.load(bumpUrl);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  const road = new THREE.MeshStandardMaterial({
    map, bumpMap: bump, bumpScale: 0.08, color: 0xf0dcb0, roughness: 0.9, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6
  });
  const shoulder = new THREE.MeshStandardMaterial({
    color: 0xb59a68, roughness: 1, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4
  });
  road.userData.shared = true;
  shoulder.userData.shared = true;
  return { road, shoulder };
}

export function buildRoadObject(item, heightAt, mats) {
  const group = new THREE.Group();
  group.userData = { planId: item.id, kind: 'road' };
  const w = item.width || 0.2;
  const g1 = ribbon(item.points, w * 1.35, heightAt, 0.02);
  const g2 = ribbon(item.points, w, heightAt, 0.032);
  if (g1) {
    const m = new THREE.Mesh(g1, mats.shoulder);
    m.renderOrder = 12; m.receiveShadow = true;
    group.add(m);
  }
  if (g2) {
    const m = new THREE.Mesh(g2, mats.road);
    m.renderOrder = 13; m.receiveShadow = true;
    group.add(m);
  }
  return group;
}

// -----------------------------------------------------------------------------
// Zonas: polígono triangulado, subdividido y drapeado + borde + etiqueta
// -----------------------------------------------------------------------------
function triangulateDraped(points, maxEdge, heightAt, lift) {
  const contour = points.map((p) => new THREE.Vector2(p.x, p.z));
  let tris;
  try {
    const faces = THREE.ShapeUtils.triangulateShape(contour, []);
    tris = faces.map((f) => [contour[f[0]].clone(), contour[f[1]].clone(), contour[f[2]].clone()]);
  } catch (e) {
    return null;
  }
  const out = [];
  const stack = tris.slice();
  let guard = 0;
  while (stack.length && guard++ < 60000) {
    const t = stack.pop();
    const e = [t[0].distanceTo(t[1]), t[1].distanceTo(t[2]), t[2].distanceTo(t[0])];
    const max = Math.max(...e);
    if (max <= maxEdge) { out.push(t); continue; }
    const k = e.indexOf(max);
    const a = t[k], b = t[(k + 1) % 3], c = t[(k + 2) % 3];
    const m = a.clone().add(b).multiplyScalar(0.5);
    stack.push([a, m, c], [m, b, c]);
  }
  const pos = [];
  out.forEach((t) => t.forEach((v) => {
    const h = heightAt(v.x, v.y);
    pos.push(v.x, (h === null ? 0.1 : h) + lift, v.y);
  }));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

function labelSprite(text, color) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  const r = 28;
  ctx.beginPath();
  ctx.moveTo(r, 8); ctx.lineTo(512 - r, 8); ctx.quadraticCurveTo(504, 8, 504, r + 8);
  ctx.lineTo(504, 120 - r); ctx.quadraticCurveTo(504, 120, 512 - r, 120);
  ctx.lineTo(r, 120); ctx.quadraticCurveTo(8, 120, 8, 120 - r);
  ctx.lineTo(8, r + 8); ctx.quadraticCurveTo(8, 8, r, 8);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(52, 64, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = '600 38px "Space Grotesk", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  let label = text;
  while (ctx.measureText(label).width > 400 && label.length > 4) label = label.slice(0, -2);
  if (label !== text) label += '…';
  ctx.fillText(label, 84, 66);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(3.2, 0.8, 1);
  sp.renderOrder = 40;
  return sp;
}

export function buildZoneObject(item, heightAt) {
  const group = new THREE.Group();
  group.userData = { planId: item.id, kind: 'zone' };
  const type = ZONE_TYPES.find((z) => z.id === item.type) || ZONE_TYPES[0];
  const color = new THREE.Color(type.color);
  const geo = triangulateDraped(item.points, 0.45, heightAt, 0.05);
  if (!geo) return group;
  const fill = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color, roughness: 0.8, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false,
    emissive: color, emissiveIntensity: 0.18, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8
  }));
  fill.renderOrder = 20;
  group.add(fill);

  const edge = ribbon(item.points.concat(item.points[0]), 0.06, heightAt, 0.07, false);
  if (edge) {
    const em = new THREE.Mesh(edge, new THREE.MeshBasicMaterial({
      color: color.clone().multiplyScalar(0.7), polygonOffset: true, polygonOffsetFactor: -10, polygonOffsetUnits: -10
    }));
    em.renderOrder = 22;
    group.add(em);
  }

  const cx = item.points.reduce((s, p) => s + p.x, 0) / item.points.length;
  const cz = item.points.reduce((s, p) => s + p.z, 0) / item.points.length;
  const ch = heightAt(cx, cz);
  const sp = labelSprite(item.name || type.name, type.color);
  sp.position.set(cx, (ch === null ? 0.1 : ch) + 1.1, cz);
  group.add(sp);
  return group;
}

// -----------------------------------------------------------------------------
// Borrador (mientras el usuario dibuja)
// -----------------------------------------------------------------------------
export function buildDraftObject(mode, points, opts, heightAt) {
  const group = new THREE.Group();
  const color = new THREE.Color(mode === 'zone' ? opts.color : '#f59e0b');
  points.forEach((p, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(i === 0 ? 0.11 : 0.08, 16, 12),
      new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffffff : color, depthTest: false })
    );
    m.position.set(p.x, p.y + 0.12, p.z);
    m.renderOrder = 50;
    group.add(m);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.14, 24),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthTest: false, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, p.y + 0.06, p.z);
    ring.renderOrder = 49;
    group.add(ring);
  });
  if (points.length >= 2) {
    const pts = mode === 'zone' && points.length >= 3 ? points.concat(points[0]) : points;
    const g = ribbon(pts, mode === 'road' ? Math.max(0.08, opts.width || 0.2) : 0.06, heightAt, 0.09, false);
    if (g) {
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.75, depthTest: false, side: THREE.DoubleSide
      }));
      m.renderOrder = 48;
      group.add(m);
    }
  }
  return group;
}

export function disposeObject(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (m.map && m.map.isCanvasTexture) m.map.dispose();
        if (!m.userData?.shared) m.dispose?.();
      });
    }
  });
}
