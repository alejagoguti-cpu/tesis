import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

// =============================================================================
// Recorridos de lanchas Tierra Bomba <-> Cartagena y puntos de vertimiento (mercurio).
// Todo lo dibuja el equipo sobre el mapa: no hay rutas ni datos precargados.
// =============================================================================

export const STORAGE_RUTAS = 'tesis_m2_rutas_lanchas_v1';
export const STORAGE_PUNTOS = 'tesis_m2_puntos_mercurio_v1';

export const ROUTE_TYPES = [
  { id: 'residuos', name: 'Lancha de residuos / desechos', color: '#e11d48', icon: '🚤' },
  { id: 'pasajeros', name: 'Lancha de pasajeros', color: '#2563eb', icon: '⛴️' },
  { id: 'pesca', name: 'Pesca artesanal', color: '#16a34a', icon: '🎣' }
];

export const POINT_TYPES = [
  { id: 'mercurio', name: 'Vertimiento con mercurio (Hg)', color: '#f97316', label: 'Hg' },
  { id: 'desechos', name: 'Punto de disposición de desechos', color: '#a21caf', label: '♻' },
  { id: 'impacto', name: 'Zona de impacto en el agua', color: '#0891b2', label: '≈' }
];

export const loadList = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
};
export const saveList = (key, list) => {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
};

const Y = 0.075;

function badge(text, color, size = 128, font = 54) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2 - 2, size * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 9;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `700 ${font}px "Segoe UI Emoji","Apple Color Emoji","Space Grotesk",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.renderOrder = 60;
  return sp;
}

function labelSprite(text, color) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 96;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  const r = 24;
  ctx.beginPath();
  ctx.moveTo(r, 6); ctx.lineTo(512 - r, 6); ctx.quadraticCurveTo(506, 6, 506, r + 6);
  ctx.lineTo(506, 90 - r); ctx.quadraticCurveTo(506, 90, 512 - r, 90);
  ctx.lineTo(r, 90); ctx.quadraticCurveTo(6, 90, 6, 90 - r);
  ctx.lineTo(6, r + 6); ctx.quadraticCurveTo(6, 6, r, 6);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(40, 48, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = '600 34px "Space Grotesk", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  let t = text;
  while (ctx.measureText(t).width > 410 && t.length > 4) t = t.slice(0, -2);
  if (t !== text) t += '…';
  ctx.fillText(t, 68, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.renderOrder = 62;
  sp.userData.aspect = 512 / 96;
  return sp;
}

export function createRoutesLayer(parent, getResolution) {
  const group = new THREE.Group();
  group.name = 'RutasLanchas';
  parent.add(group);
  const lineMats = [];
  const boats = [];
  const markers = [];
  const labels = [];
  let draft = null;

  const clear = () => {
    while (group.children.length) {
      const o = group.children[0];
      group.remove(o);
      o.traverse((n) => {
        if (n.geometry) n.geometry.dispose();
        if (n.material) { if (n.material.map) n.material.map.dispose(); n.material.dispose(); }
      });
    }
    lineMats.length = 0; boats.length = 0; markers.length = 0; labels.length = 0;
  };

  const makeLine = (pts, color, width, dashed, opacity = 1) => {
    const flat = [];
    pts.forEach((p) => flat.push(p.x, Y, p.z));
    const g = new LineGeometry();
    g.setPositions(flat);
    const [w, h] = getResolution();
    const m = new LineMaterial({
      color, linewidth: width, worldUnits: false, dashed, dashSize: 1.4, gapSize: 0.9, transparent: true, opacity, depthTest: false
    });
    m.resolution.set(w, h);
    const l = new Line2(g, m);
    l.computeLineDistances();
    l.renderOrder = 55;
    lineMats.push(m);
    return l;
  };

  const pathLength = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - pts[i].x, p.z - pts[i].z), 0);
  const pointAt = (pts, d) => {
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
      if (acc + seg >= d) {
        const t = (d - acc) / (seg || 1);
        return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, z: pts[i - 1].z + (pts[i].z - pts[i - 1].z) * t };
      }
      acc += seg;
    }
    return pts[pts.length - 1];
  };

  const setData = (routes, points) => {
    clear();
    (routes || []).forEach((r) => {
      if (!r.pts || r.pts.length < 2) return;
      const t = ROUTE_TYPES.find((x) => x.id === r.type) || ROUTE_TYPES[0];
      // halo + línea animada tipo flujo
      group.add(makeLine(r.pts, '#ffffff', 7, false, 0.9));
      group.add(makeLine(r.pts, t.color, 4.2, false, 1));
      const flow = makeLine(r.pts, '#ffffff', 2, true, 0.95);
      flow.userData.flow = true;
      group.add(flow);
      // lanchas que recorren la ruta
      const len = pathLength(r.pts);
      for (let k = 0; k < 2; k++) {
        const sp = badge(t.icon, t.color);
        sp.userData = { route: r, len, offset: k / 2, speed: 0.012 + 0.004 * k, dir: 1 };
        group.add(sp);
        boats.push(sp);
      }
      // etiqueta en el punto medio
      const mid = pointAt(r.pts, len / 2);
      const lb = labelSprite(r.name || t.name, t.color);
      lb.position.set(mid.x, Y + 0.05, mid.z);
      group.add(lb);
      labels.push(lb);
    });
    (points || []).forEach((p) => {
      const t = POINT_TYPES.find((x) => x.id === p.type) || POINT_TYPES[0];
      const sp = badge(t.label, t.color, 128, 50);
      sp.position.set(p.x, Y + 0.05, p.z);
      group.add(sp);
      markers.push({ sprite: sp, kind: 'pin' });
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 1, 48),
        new THREE.MeshBasicMaterial({ color: t.color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthTest: false })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(p.x, Y, p.z);
      ring.renderOrder = 52;
      group.add(ring);
      markers.push({ ring, kind: 'ring', phase: Math.random() * 6 });
      if (p.name) {
        const lb = labelSprite(p.name, t.color);
        lb.position.set(p.x, Y + 0.05, p.z);
        lb.userData.dy = 1;
        group.add(lb);
        labels.push(lb);
      }
    });
  };

  const setDraft = (mode, pts, color) => {
    if (draft) {
      group.remove(draft);
      draft.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) n.material.dispose(); });
      draft = null;
    }
    if (!pts || pts.length === 0) return;
    draft = new THREE.Group();
    if (pts.length >= 2) draft.add(makeLine(pts, color, 4, true, 0.95));
    pts.forEach((p, i) => {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(1, 20),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffffff : color, depthTest: false })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(p.x, Y + 0.02, p.z);
      m.renderOrder = 66;
      m.userData.draftDot = true;
      draft.add(m);
    });
    group.add(draft);
  };

  const update = (timeMs, viewSize) => {
    const unit = Math.max(0.25, viewSize * 0.012);
    boats.forEach((b) => {
      const u = b.userData;
      const prog = (((timeMs * 0.001 * u.speed * 12 + u.offset) % 2) + 2) % 2; // ida y vuelta
      const f = prog <= 1 ? prog : 2 - prog;
      const p = pointAt(u.route.pts, u.len * f);
      b.position.set(p.x, Y + 0.08, p.z);
      b.scale.set(unit * 2.2, unit * 2.2, 1);
    });
    markers.forEach((m) => {
      if (m.kind === 'pin') m.sprite.scale.set(unit * 2.4, unit * 2.4, 1);
      else {
        const pulse = 1 + 0.35 * Math.sin(timeMs * 0.003 + m.phase);
        m.ring.scale.set(unit * 2.6 * pulse, unit * 2.6 * pulse, 1);
        m.ring.material.opacity = 0.65 - 0.3 * (pulse - 0.65);
      }
    });
    labels.forEach((l) => {
      const h = unit * 1.6;
      l.scale.set(h * l.userData.aspect, h, 1);
      if (l.userData.dy) l.position.y = Y + 0.05 + unit * 2.6;
    });
    // flujo de la línea punteada
    group.children.forEach((c) => {
      if (c.userData && c.userData.flow) c.material.dashOffset = -(timeMs * 0.0006) % 100;
    });
    if (draft) draft.children.forEach((c) => { if (c.userData.draftDot) c.scale.set(unit * 0.55, unit * 0.55, 1); });
  };

  const setResolution = (w, h) => lineMats.forEach((m) => m.resolution.set(w, h));
  const draftMats = () => (draft ? draft.children.filter((c) => c.material && c.material.resolution).map((c) => c.material) : []);

  return {
    group,
    setData,
    setDraft,
    update,
    setResolution: (w, h) => { setResolution(w, h); draftMats().forEach((m) => m.resolution.set(w, h)); },
    dispose: () => { clear(); parent.remove(group); }
  };
}
