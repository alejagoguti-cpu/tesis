import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// =============================================================================
// Movilidad de la isla: motos y bicicletas que recorren las vías reales (OpenStreetMap)
// a escala real (moto ~2 m, bicicleta ~1,8 m). Cada vehículo circula por su carril (derecha de su
// sentido de marcha), guarda distancia con el de adelante y cede el paso en los cruces,
// de modo que no se atraviesan ni se chocan.
// =============================================================================

// ---------- modelos procedurales (unidades en metros; adelante = +x, arriba = +y) ----------
function part(geo, color) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const c = new THREE.Color(color);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.deleteAttribute('uv');
  return g;
}
const box = (w, h, d, x, y, z, color, rz = 0) => {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rz) g.rotateZ(rz);
  g.translate(x, y, z);
  return part(g, color);
};
const wheel = (r, w, x, y, z, color) => {
  const g = new THREE.CylinderGeometry(r, r, w, 14);
  g.rotateX(Math.PI / 2);
  g.translate(x, y, z);
  return part(g, color);
};
const ball = (r, x, y, z, color) => {
  const g = new THREE.SphereGeometry(r, 10, 8);
  g.translate(x, y, z);
  return part(g, color);
};
const rod = (x1, y1, x2, y2, t, color) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const g = new THREE.BoxGeometry(len, t, t);
  g.rotateZ(Math.atan2(y2 - y1, x2 - x1));
  g.translate((x1 + x2) / 2, (y1 + y2) / 2, 0);
  return part(g, color);
};

const SKIN = '#c58c6a';
const TIRE = '#1d1d1f';

function motoGeometry(body, shirt, helmet) {
  return mergeGeometries([
    wheel(0.3, 0.1, 0.62, 0.3, 0, TIRE), wheel(0.3, 0.1, -0.62, 0.3, 0, TIRE),
    box(1.0, 0.32, 0.22, 0.0, 0.58, 0, body), // chasis / tanque
    box(0.45, 0.1, 0.26, -0.28, 0.76, 0, '#2a2a2c'), // asiento
    box(0.1, 0.5, 0.1, 0.5, 0.55, 0, '#555', -0.35), // horquilla
    box(0.08, 0.08, 0.55, 0.58, 0.95, 0, '#222'), // manubrio
    box(0.3, 0.55, 0.3, -0.22, 1.14, 0, shirt, 0.18), // torso
    ball(0.13, -0.04, 1.58, 0, helmet), // casco
    box(0.5, 0.14, 0.14, 0.12, 0.74, 0.17, '#334155', -0.2), // pierna
    box(0.5, 0.14, 0.14, 0.12, 0.74, -0.17, '#334155', -0.2),
    box(0.1, 0.1, 0.5, -0.12, 0.98, 0, shirt) // brazos hacia el manubrio
  ].map((g) => g));
}

function bikeGeometry(frame, shirt, helmet) {
  return mergeGeometries([
    wheel(0.34, 0.04, 0.55, 0.34, 0, TIRE), wheel(0.34, 0.04, -0.55, 0.34, 0, TIRE),
    rod(-0.55, 0.34, -0.1, 0.62, 0.035, frame), rod(-0.1, 0.62, 0.38, 0.6, 0.035, frame),
    rod(-0.55, 0.34, -0.12, 0.34, 0.03, frame), rod(-0.12, 0.34, -0.1, 0.62, 0.03, frame),
    rod(-0.12, 0.34, 0.38, 0.6, 0.03, frame), rod(0.38, 0.6, 0.55, 0.34, 0.03, frame),
    rod(0.38, 0.6, 0.4, 0.92, 0.03, '#333'), box(0.04, 0.04, 0.5, 0.4, 0.94, 0, '#222'),
    box(0.26, 0.05, 0.12, -0.12, 0.7, 0, '#222'),
    box(0.26, 0.55, 0.26, -0.02, 1.08, 0, shirt, -0.45), // torso inclinado
    ball(0.12, 0.22, 1.42, 0, helmet),
    box(0.48, 0.11, 0.11, 0.05, 0.62, 0.13, '#334155', 0.5),
    box(0.48, 0.11, 0.11, 0.05, 0.62, -0.13, '#334155', -0.5),
    box(0.48, 0.09, 0.09, 0.2, 1.05, 0.17, shirt, -0.5), box(0.48, 0.09, 0.09, 0.2, 1.05, -0.17, shirt, -0.5)
  ]);
}

const MOTO_VARIANTS = [
  ['#c8242b', '#f2c14e', '#f5f5f5'], ['#1f4fa8', '#e8e8e8', '#222222'], ['#3a3a3d', '#2c7a4b', '#d9d9d9'], ['#e4872b', '#1f3a5f', '#c8242b']
];
const BIKE_VARIANTS = [
  ['#0f766e', '#e8e8e8', '#f2c14e'], ['#b4232a', '#1f4fa8', '#ffffff'], ['#2d2d30', '#e4872b', '#222222']
];

// ---------- utilidades de recorridos ----------
function buildPath(points, heightAt, parentObj) {
  // puntos del modelo -> mundo, remuestreados cada ~2 m
  const tmp = new THREE.Vector3();
  const sc = parentObj.scale.x || 1;
  const pts = points.map(([x, y]) => {
    tmp.set(x, y, 0);
    parentObj.localToWorld(tmp);
    return new THREE.Vector2(tmp.x, tmp.z);
  });
  const res = [pts[0]];
  const step = 2 * sc;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const d = a.distanceTo(b);
    const n = Math.max(1, Math.round(d / step));
    for (let k = 1; k <= n; k++) res.push(new THREE.Vector2(a.x + ((b.x - a.x) * k) / n, a.y + ((b.y - a.y) * k) / n));
  }
  const cum = [0];
  for (let i = 1; i < res.length; i++) cum.push(cum[i - 1] + res[i].distanceTo(res[i - 1]));
  return { pts: res, cum, length: cum[cum.length - 1] };
}

function sampleAt(path, s) {
  const { pts, cum } = path;
  s = Math.max(0, Math.min(path.length, s));
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= s) lo = mid; else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const t = (s - cum[lo]) / seg;
  const a = pts[lo], b = pts[hi];
  return { x: a.x + (b.x - a.x) * t, z: a.y + (b.y - a.y) * t, tx: (b.x - a.x) / seg, tz: (b.y - a.y) / seg };
}

export async function createMobility({ roads, parentObj, heightAt, seed = 7 }) {
  const sc = parentObj.scale.x || 1; // metros -> unidades de mundo
  let rnd = seed;
  const rand = () => { rnd = (Math.imul(rnd, 1664525) + 1013904223) >>> 0; return rnd / 4294967296; };

  // geometrías por variante
  const motoGeos = MOTO_VARIANTS.map((v) => motoGeometry(...v));
  const bikeGeos = BIKE_VARIANTS.map((v) => bikeGeometry(...v));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.1 });

  // ---------- vías transitables (sin duplicadas) ----------
  const usable = roads.filter((r) => ['residential', 'unclassified', 'service', 'tertiary', 'path', 'track'].includes(r.h) && r.p.length >= 2);
  const cand = usable
    .map((r, ri) => ({ r, ri, path: buildPath(r.p, heightAt, parentObj) }))
    .filter((c) => c.path.length / sc >= 25)
    .sort((x, y) => y.path.length - x.path.length);

  const CELL = 3.5 * sc;
  const hash = new Map();
  const hkey = (x, z) => Math.floor(x / CELL) + ':' + Math.floor(z / CELL);
  const addPts = (road, path) => path.pts.forEach((q, i) => {
    const k = hkey(q.x, q.y);
    if (!hash.has(k)) hash.set(k, []);
    hash.get(k).push({ road, s: path.cum[i], x: q.x, z: q.y });
  });
  const nearOther = (x, z, road, rad) => {
    const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      const l = hash.get((cx + dx) + ':' + (cz + dz));
      if (!l) continue;
      for (const o of l) if (o.road !== road && Math.hypot(o.x - x, o.z - z) < rad) return o;
    }
    return null;
  };

  const accepted = [];
  cand.forEach((c) => {
    // una vía casi totalmente pegada a otra ya aceptada es un duplicado: no lleva vehículos
    const pts = c.path.pts;
    let near = 0;
    const mid = pts.slice(Math.floor(pts.length * 0.15), Math.ceil(pts.length * 0.85));
    mid.forEach((q) => { if (nearOther(q.x, q.y, c.ri, 3.5 * sc)) near++; });
    if (mid.length && near / mid.length > 0.5) return;
    accepted.push(c);
    addPts(c.ri, c.path);
  });

  // ---------- cruces (puntos donde dos vías aceptadas se tocan) ----------
  const MARGIN = 9 * sc; // los giros se hacen antes de llegar al extremo de la vía
  const junctions = [];
  accepted.forEach((c) => {
    c.path.pts.forEach((q, i) => {
      const o = nearOther(q.x, q.y, c.ri, 2.6 * sc);
      if (!o) return;
      const s1 = c.path.cum[i];
      let j = junctions.find((jn) => Math.hypot(jn.x - q.x, jn.z - q.y) < 9 * sc);
      if (!j) { j = { x: q.x, z: q.y, members: new Map() }; junctions.push(j); }
      if (!j.members.has(c.ri)) j.members.set(c.ri, s1);
      if (!j.members.has(o.road)) j.members.set(o.road, o.s);
    });
  });
  const byRoadJ = new Map(); // road -> [{j, s}]
  junctions.forEach((j) => j.members.forEach((s1, road) => {
    if (!byRoadJ.has(road)) byRoadJ.set(road, []);
    byRoadJ.get(road).push({ j, s: s1 });
  }));

  const vehicles = [];
  accepted.forEach((c) => {
    const lengthM = c.path.length / sc;
    const isPath = c.r.h === 'path' || c.r.h === 'track';
    const usableLen = c.path.length - 2 * MARGIN;
    if (usableLen <= 0) return;
    const count = Math.max(1, Math.min(8, Math.floor(lengthM / (isPath ? 150 : 110))));
    for (let k = 0; k < count; k++) {
      const bike = isPath ? true : rand() < 0.32;
      vehicles.push({
        id: vehicles.length, road: c.ri, path: c.path, bike,
        dir: rand() < 0.5 ? 1 : -1,
        s: MARGIN + (usableLen * (k + 0.15 + rand() * 0.5)) / count,
        v: bike ? 2.8 + rand() * 1.0 : 5.2 + rand() * 2.4, // m/s (≈ 10-14 km/h y 19-34 km/h)
        variant: Math.floor(rand() * (bike ? BIKE_VARIANTS.length : MOTO_VARIANTS.length)),
        len: bike ? 1.8 : 2.1,
        cur: 0, wait: 0, x: 0, z: 0, yaw: 0, pitch: 0, y: 0
      });
    }
  });

  // InstancedMesh por tipo y variante
  const group = new THREE.Group();
  group.name = 'Movilidad';
  const buckets = new Map();
  vehicles.forEach((veh) => {
    const key = (veh.bike ? 'b' : 'm') + veh.variant;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(veh);
  });
  buckets.forEach((list, key) => {
    const geo = key[0] === 'b' ? bikeGeos[+key.slice(1)] : motoGeos[+key.slice(1)];
    const mesh = new THREE.InstancedMesh(geo, mat, list.length);
    mesh.castShadow = true;
    mesh.frustumCulled = false;
    list.forEach((veh, i) => { veh.mesh = mesh; veh.idx = i; });
    group.add(mesh);
  });

  const LANE = 0.9; // m desde el eje de la vía
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion(), qy = new THREE.Quaternion(), qz = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0), fwd = new THREE.Vector3(0, 0, 1);
  const pos = new THREE.Vector3(), scl = new THREE.Vector3(sc, sc, sc);

  const place = (veh) => {
    const sm = sampleAt(veh.path, veh.s);
    const tx = sm.tx * veh.dir, tz = sm.tz * veh.dir; // tangente en el sentido de marcha
    const rx = -tz, rz = tx; // derecha del sentido de marcha
    veh.x = sm.x + rx * LANE * sc;
    veh.z = sm.z + rz * LANE * sc;
    veh.yaw = Math.atan2(-tz, tx);
    const h = heightAt(veh.x, veh.z);
    const ha = heightAt(veh.x + tx * sc, veh.z + tz * sc);
    veh.y = (h === null ? 0.07 : Math.max(0.07, h)) + 0.002;
    veh.pitch = h !== null && ha !== null ? Math.atan2(ha - h, sc) * 0.9 : 0;
  };
  const writeMatrix = (veh) => {
    qy.setFromAxisAngle(up, veh.yaw);
    qz.setFromAxisAngle(fwd.set(0, 0, 1), veh.pitch);
    q.copy(qy).multiply(qz);
    pos.set(veh.x, veh.y, veh.z);
    m4.compose(pos, q, scl);
    veh.mesh.setMatrixAt(veh.idx, m4);
  };
  vehicles.forEach((v) => { place(v); writeMatrix(v); });
  buckets.forEach((list) => { list[0].mesh.instanceMatrix.needsUpdate = true; });

  // ---------- simulación: sin choques ----------
  const lanes = new Map();
  vehicles.forEach((v) => { lanes.set(v.road + ':1', []); lanes.set(v.road + ':-1', []); });
  const ZONE = 7 * sc, APPROACH = 12 * sc;

  function update(dt) {
    dt = Math.min(dt, 0.05);
    lanes.forEach((_, key) => lanes.set(key, []));
    vehicles.forEach((v) => { lanes.get(v.road + ':' + v.dir).push(v); v.cur = v.v; });

    // 1) distancia de seguridad con el vehículo de adelante en el mismo carril
    lanes.forEach((list) => {
      list.sort((a, b) => (a.dir > 0 ? a.s - b.s : b.s - a.s)); // de atrás hacia adelante
      for (let i = 0; i < list.length - 1; i++) {
        const me = list[i], lead = list[i + 1];
        const gapM = (Math.abs(lead.s - me.s)) / sc;
        const safe = me.len + 2.4 + me.v * 0.6;
        if (gapM < safe) me.cur = Math.min(me.cur, lead.cur * Math.max(0, (gapM - me.len - 0.8) / (safe - me.len - 0.8)));
      }
    });

    // 2) un solo vehículo a la vez dentro de cada cruce (semáforo por cruce)
    junctions.forEach((j) => {
      const inside = [], req = [];
      vehicles.forEach((v) => {
        const sj = j.members.get(v.road);
        if (sj === undefined) return;
        const da = (sj - v.s) * v.dir;
        if (Math.abs(sj - v.s) < ZONE) inside.push(v);
        else if (da > 0 && da < APPROACH) req.push(v);
      });
      const owner = inside.length ? inside[0].road : -1;
      req.sort((a, b) => b.wait - a.wait || a.id - b.id);
      const winner = owner === -1 ? req[0] : null;
      req.forEach((v) => {
        const allowed = v === winner || (owner !== -1 && v.road === owner);
        if (!allowed) { v.cur = 0; v.wait += dt; }
      });
    });

    // 3) avanzar (nunca más cerca de la distancia mínima del de adelante), dar la vuelta y colocar
    vehicles.forEach((v) => {
      if (v.cur > 0) v.wait = Math.max(0, v.wait - dt * 0.5);
      v.sNew = v.s + v.dir * v.cur * sc * dt;
    });
    lanes.forEach((list) => {
      for (let i = list.length - 2; i >= 0; i--) {
        const me = list[i], lead = list[i + 1];
        const minGap = (me.len + 1.0) * sc;
        if (Math.abs(lead.sNew - me.sNew) < minGap) {
          const target = lead.sNew - me.dir * minGap;
          me.sNew = (target - me.s) * me.dir < 0 ? me.s : target; // sin retroceder
        }
      }
    });
    vehicles.forEach((v) => {
      const hiS = v.path.length - MARGIN;
      let next = v.sNew, newDir = v.dir;
      if (next >= hiS) { next = hiS; newDir = -1; }
      else if (next <= MARGIN) { next = MARGIN; newDir = 1; }
      if (newDir !== v.dir) {
        // solo da la vuelta si el carril contrario está libre cerca del extremo
        const limitS = newDir === -1 ? hiS : MARGIN;
        const blocked = vehicles.some((u) => u !== v && u.road === v.road && (u.dir === newDir || u.turnReserved) && Math.abs(u.s - limitS) < (v.len + 1.6) * sc);
        if (blocked) { next = v.s; newDir = v.dir; v.cur = 0; }
      }
      v.s = next;
      v.dir = newDir;
    });
    vehicles.forEach((v) => {
      place(v);
      writeMatrix(v);
    });
    buckets.forEach((list) => { list[0].mesh.instanceMatrix.needsUpdate = true; });
  }

  return { group, update, vehicles, junctions: junctions.length, count: vehicles.length, motos: vehicles.filter((v) => !v.bike).length, bikes: vehicles.filter((v) => v.bike).length };
}
