import * as THREE from 'three';
import { RGBELoader } from './vendor/RGBELoader.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

/* ───────────── utilidades ───────────── */
const $ = (s) => document.querySelector(s);
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

const tweens = [];
function tween(d, fn, ease = easeIO) {
  return new Promise((res) => tweens.push({ t: 0, d, fn, ease, res }));
}

/* ───────────── renderer / escena ───────────── */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const MAXANI = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a110b);
const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 80);

const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
sun.position.set(-5, 11, -4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025; sun.shadow.radius = 5;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a2414, 0.35));
const fireLight = new THREE.PointLight(0xff7a22, 0, 6, 2);
scene.add(fireLight);

/* ───────────── texturas PBR ───────────── */
const manager = new THREE.LoadingManager();
const tl = new THREE.TextureLoader(manager);
function loadSet(name, rep = 1) {
  const mk = (suf, srgb) => {
    const t = tl.load(`assets/${name}_${suf}.jpg`);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = MAXANI;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const arm = mk('arm');
  return { map: mk('diff', true), normalMap: mk('nor'), roughnessMap: arm, aoMap: arm };
}
new RGBELoader(manager).load('assets/studio_1k.hdr', (hdr) => {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(hdr).texture;
  scene.environmentIntensity = 0.85;
  hdr.dispose(); pm.dispose();
});

// Genera albedo + normal + rugosidad a partir de un dibujo de color y otro de altura
function pbr(size, draw, { strength = 2, rough = [0.4, 0.9], repeat = 1 } = {}) {
  const mkc = () => { const c = document.createElement('canvas'); c.width = c.height = size; return c; };
  const c = mkc(), h = mkc(), n = mkc(), r = mkc();
  const cc = c.getContext('2d'), hc = h.getContext('2d', { willReadFrequently: true });
  hc.fillStyle = '#808080'; hc.fillRect(0, 0, size, size);
  draw(cc, hc, size);
  const hd = hc.getImageData(0, 0, size, size).data;
  const nctx = n.getContext('2d'), rctx = r.getContext('2d');
  const nd = nctx.createImageData(size, size), rd = rctx.createImageData(size, size);
  const H = (x, y) => hd[(((y + size) % size) * size + ((x + size) % size)) * 4] / 255;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    let nx = -(H(x + 1, y) - H(x - 1, y)) * strength, ny = (H(x, y + 1) - H(x, y - 1)) * strength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    nd.data[i] = (nx * 0.5 + 0.5) * 255; nd.data[i + 1] = (ny * 0.5 + 0.5) * 255; nd.data[i + 2] = (nz * 0.5 + 0.5) * 255; nd.data[i + 3] = 255;
    const rv = lerp(rough[0], rough[1], hd[i] / 255) * 255;
    rd.data[i] = rd.data[i + 1] = rd.data[i + 2] = rv; rd.data[i + 3] = 255;
  }
  nctx.putImageData(nd, 0, 0); rctx.putImageData(rd, 0, 0);
  const tex = (cv, srgb) => {
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); t.anisotropy = MAXANI;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { map: tex(c, true), normalMap: tex(n), roughnessMap: tex(r), bumpSrc: tex(h) };
}
function blob(ctx, x, y, rad, col) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, col); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
  ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}
function stroke(ctx, x, y, ang, len, w, col, bend = 0) {
  const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - dx, y - dy);
  ctx.quadraticCurveTo(x - dy * bend, y + dx * bend, x + dx, y + dy); ctx.stroke();
}
const wrapDraw = (s, x, y, fn) => { for (const ox of [-s, 0, s]) for (const oy of [-s, 0, s]) fn(x + ox, y + oy); };

// mezcla de coco en almíbar
const mixTex = pbr(1024, (c, h, s) => {
  c.fillStyle = '#cdb98f'; c.fillRect(0, 0, s, s);
  h.fillStyle = '#3c3c3c'; h.fillRect(0, 0, s, s);
  for (let i = 0; i < 500; i++) { const x = rnd(s), y = rnd(s), r = rnd(20, 70); wrapDraw(s, x, y, (X, Y) => { blob(h, X, Y, r, 'rgba(150,150,150,0.35)'); blob(c, X, Y, r, 'rgba(240,228,200,0.25)'); }); }
  for (let i = 0; i < 16000; i++) {
    const x = rnd(s), y = rnd(s), a = rnd(Math.PI * 2), len = rnd(9, 30), w = rnd(1.6, 3.6), b = rnd(-0.5, 0.5);
    const l = rnd(84, 98), g = Math.floor(rnd(130, 255));
    wrapDraw(s, x, y, (X, Y) => {
      stroke(c, X + 1, Y + 1.5, a, len, w + 1, 'rgba(120,90,40,0.25)', b);
      stroke(c, X, Y, a, len, w, `hsl(${rnd(38, 48)},${rnd(25, 50)}%,${l}%)`, b);
      stroke(h, X, Y, a, len, w, `rgb(${g},${g},${g})`, b);
    });
  }
}, { strength: 3.2, rough: [0.16, 0.8], repeat: 2 });

// cobre martillado
const copperTex = pbr(1024, (c, h, s) => {
  c.fillStyle = '#fff'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 260; i++) { const x = rnd(s), y = rnd(s), r = rnd(30, 120); wrapDraw(s, x, y, (X, Y) => blob(c, X, Y, r, i % 3 ? 'rgba(120,60,30,0.10)' : 'rgba(255,220,190,0.10)')); }
  for (let i = 0; i < 1500; i++) { const x = rnd(s), y = rnd(s), r = rnd(16, 34); wrapDraw(s, x, y, (X, Y) => blob(h, X, Y, r, 'rgba(20,20,20,0.55)')); }
  for (let i = 0; i < 2500; i++) stroke(h, rnd(s), rnd(s), rnd(-0.1, 0.1), rnd(20, 90), 1, 'rgba(255,255,255,0.08)');
}, { strength: 2.2, rough: [0.34, 0.2], repeat: 3 });

const clayTex = pbr(512, (c, h, s) => {
  c.fillStyle = '#b4623b'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 300; i++) blob(c, rnd(s), rnd(s), rnd(20, 80), i % 2 ? 'rgba(90,40,20,0.12)' : 'rgba(230,150,100,0.12)');
  for (let i = 0; i < 9000; i++) { const x = rnd(s), y = rnd(s), g = Math.floor(rnd(60, 200)); c.fillStyle = `rgba(${rnd() < 0.5 ? '70,30,15' : '235,170,120'},${rnd(0.1, 0.4)})`; c.fillRect(x, y, rnd(1, 2.5), rnd(1, 2.5)); h.fillStyle = `rgb(${g},${g},${g})`; h.fillRect(x, y, 2, 2); }
  for (let i = 0; i < 400; i++) stroke(h, rnd(s), rnd(s), rnd(-0.05, 0.05), rnd(60, 300), rnd(1, 3), 'rgba(255,255,255,0.12)');
}, { strength: 1.6, rough: [0.55, 0.85], repeat: 2 });

const panelaTex = pbr(512, (c, h, s) => {
  c.fillStyle = '#7b4a20'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 400; i++) blob(c, rnd(s), rnd(s), rnd(10, 60), i % 2 ? 'rgba(50,25,8,0.22)' : 'rgba(190,120,50,0.2)');
  for (let i = 0; i < 14000; i++) { const x = rnd(s), y = rnd(s), g = Math.floor(rnd(30, 230)), z = rnd(1, 4); c.fillStyle = `rgba(${rnd() < 0.5 ? '45,22,6' : '215,150,70'},${rnd(0.15, 0.5)})`; c.fillRect(x, y, z, z); h.fillStyle = `rgb(${g},${g},${g})`; h.fillRect(x, y, z, z); }
}, { strength: 3, rough: [0.5, 0.95] });

const barkTex = pbr(512, (c, h, s) => {
  c.fillStyle = '#8d5630'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) { const x = rnd(s), y = rnd(s), len = rnd(40, 260), w = rnd(1, 4), g = Math.floor(rnd(40, 220)); stroke(c, x, y, rnd(-0.04, 0.04), len, w, `rgba(${rnd() < 0.5 ? '60,30,12' : '190,125,75'},0.35)`); stroke(h, x, y, 0, len, w, `rgb(${g},${g},${g})`); }
}, { strength: 2.5, rough: [0.6, 0.9] });

const huskTex = pbr(512, (c, h, s) => {
  c.fillStyle = '#4b3120'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 7000; i++) { const x = rnd(s), y = rnd(s), len = rnd(20, 140), w = rnd(0.8, 2.5), g = Math.floor(rnd(20, 255)); const a = Math.PI / 2 + rnd(-0.25, 0.25); stroke(c, x, y, a, len, w, `rgba(${rnd() < 0.55 ? '30,18,10' : '150,105,65'},0.5)`, rnd(-0.2, 0.2)); stroke(h, x, y, a, len, w, `rgb(${g},${g},${g})`); }
}, { strength: 4, rough: [0.75, 1] });

const leafTex = pbr(1024, (c, h, s) => {
  const g = c.createLinearGradient(0, 0, 0, s);
  g.addColorStop(0, '#2c5f1d'); g.addColorStop(0.5, '#4a8a2c'); g.addColorStop(1, '#2f661f');
  c.fillStyle = g; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 160; i++) blob(c, rnd(s), rnd(s), rnd(30, 140), i % 2 ? 'rgba(20,50,10,0.16)' : 'rgba(150,190,70,0.13)');
  for (let x = 0; x < s; x += rnd(3, 7)) {            // nervaduras laterales
    const sl = 26, a = rnd(0.12, 0.4), w = rnd(0.6, 1.6), gg = Math.floor(rnd(150, 230));
    for (const dir of [-1, 1]) {
      c.strokeStyle = `rgba(190,220,120,${a})`; c.lineWidth = w; c.beginPath(); c.moveTo(x, s / 2); c.lineTo(x + sl, s / 2 + dir * s / 2); c.stroke();
      h.strokeStyle = `rgb(${gg},${gg},${gg})`; h.lineWidth = w + 0.6; h.beginPath(); h.moveTo(x, s / 2); h.lineTo(x + sl, s / 2 + dir * s / 2); h.stroke();
    }
  }
  c.fillStyle = '#b5cf7a'; c.fillRect(0, s / 2 - 7, s, 14);
  c.fillStyle = 'rgba(40,80,20,0.5)'; c.fillRect(0, s / 2 + 7, s, 5);
  h.fillStyle = '#fff'; h.fillRect(0, s / 2 - 8, s, 16);
  for (let i = 0; i < 26; i++) { const x = rnd(s), y = rnd(s); blob(c, x, y, rnd(4, 16), 'rgba(120,90,30,0.55)'); }
}, { strength: 2.4, rough: [0.38, 0.6] });

const woodTex = pbr(1024, (c, h, s) => {
  c.fillStyle = '#d9b27c'; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 120; i++) blob(c, rnd(s), rnd(s), rnd(60, 220), i % 2 ? 'rgba(150,100,50,0.10)' : 'rgba(255,225,170,0.12)');
  for (let i = 0; i < 5200; i++) { const x = rnd(s), y = rnd(s), len = rnd(80, 520), w = rnd(0.6, 2.6), g = Math.floor(rnd(70, 190)), a = Math.sin(y * 0.02) * 0.03; wrapDraw(s, x, y, (X, Y) => { stroke(c, X, Y, a, len, w, `rgba(${rnd() < 0.6 ? '120,75,35' : '245,215,165'},${rnd(0.08, 0.3)})`, 0.03); stroke(h, X, Y, a, len, w, `rgba(${g},${g},${g},0.5)`, 0.03); }); }
  for (let i = 0; i < 9; i++) { const y = rnd(s); c.fillStyle = 'rgba(110,65,30,0.10)'; c.fillRect(0, y, s, rnd(8, 40)); }
}, { strength: 1.6, rough: [0.5, 0.72] });

const softDot = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();

/* ───────────── materiales ───────────── */
const M = {};
M.table = new THREE.MeshStandardMaterial({ ...loadSet('wood_table_worn', 5), color: 0xb9a48c, roughness: 1, aoMapIntensity: 1, normalScale: new THREE.Vector2(1.3, 1.3) });
M.board = new THREE.MeshPhysicalMaterial({ map: woodTex.map, normalMap: woodTex.normalMap, roughnessMap: woodTex.roughnessMap, roughness: 1, clearcoat: 0.2, clearcoatRoughness: 0.5 });
M.spoon = new THREE.MeshStandardMaterial({ map: woodTex.map, normalMap: woodTex.normalMap, roughnessMap: woodTex.roughnessMap, roughness: 1, color: 0xf3d9b0 });
M.linen = new THREE.MeshPhysicalMaterial({ ...loadSet('rough_linen', 3), color: 0xffe6c4, roughness: 1, sheen: 0.6, sheenRoughness: 0.7, sheenColor: 0xffffff, normalScale: new THREE.Vector2(1.5, 1.5) });
M.copper = new THREE.MeshPhysicalMaterial({ map: copperTex.map, normalMap: copperTex.normalMap, roughnessMap: copperTex.roughnessMap, color: 0xf0a070, metalness: 1, roughness: 1, normalScale: new THREE.Vector2(0.7, 0.7), side: THREE.DoubleSide, emissive: 0xff4a10, emissiveIntensity: 0, clearcoat: 0.15, clearcoatRoughness: 0.3 });
M.brass = new THREE.MeshStandardMaterial({ color: 0xd9b25a, metalness: 1, roughness: 0.32 });
M.iron = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, metalness: 0.85, roughness: 0.62, normalMap: panelaTex.normalMap, normalScale: new THREE.Vector2(0.5, 0.5) });
M.clay = new THREE.MeshPhysicalMaterial({ map: clayTex.map, normalMap: clayTex.normalMap, roughnessMap: clayTex.roughnessMap, roughness: 1, clearcoat: 0.35, clearcoatRoughness: 0.35, side: THREE.DoubleSide });
M.shred = new THREE.MeshPhysicalMaterial({ color: 0xfffaf0, roughness: 0.62, sheen: 0.5, sheenColor: 0xffffff, sheenRoughness: 0.5 });
M.cocoMound = new THREE.MeshStandardMaterial({ map: mixTex.map, normalMap: mixTex.normalMap, color: 0xffffff, roughness: 0.85, normalScale: new THREE.Vector2(1.5, 1.5) });
M.panela = new THREE.MeshPhysicalMaterial({ map: panelaTex.map, normalMap: panelaTex.normalMap, roughnessMap: panelaTex.roughnessMap, roughness: 1, normalScale: new THREE.Vector2(1.4, 1.4), clearcoat: 0.12, clearcoatRoughness: 0.6 });
M.milk = new THREE.MeshPhysicalMaterial({ color: 0xfbf7ee, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true });
M.bark = new THREE.MeshStandardMaterial({ map: barkTex.map, normalMap: barkTex.normalMap, roughnessMap: barkTex.roughnessMap, roughness: 1, side: THREE.DoubleSide });
M.clove = new THREE.MeshStandardMaterial({ color: 0x3a2114, roughness: 0.85, normalMap: panelaTex.normalMap });
M.butter = new THREE.MeshPhysicalMaterial({ color: 0xf6dc7c, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.25, sheen: 0.4, sheenColor: 0xfff0b0 });
M.husk = new THREE.MeshStandardMaterial({ map: huskTex.map, normalMap: huskTex.normalMap, roughnessMap: huskTex.roughnessMap, roughness: 1, normalScale: new THREE.Vector2(2, 2) });
M.cocoMeat = new THREE.MeshPhysicalMaterial({ color: 0xfdfaf2, roughness: 0.45, clearcoat: 0.3, side: THREE.DoubleSide, normalMap: clayTex.normalMap, normalScale: new THREE.Vector2(0.4, 0.4) });
M.leaf = new THREE.MeshPhysicalMaterial({ map: leafTex.map, normalMap: leafTex.normalMap, roughnessMap: leafTex.roughnessMap, roughness: 1, clearcoat: 0.55, clearcoatRoughness: 0.35, side: THREE.DoubleSide, normalScale: new THREE.Vector2(1.2, 1.2) });
M.mix = new THREE.MeshPhysicalMaterial({ map: mixTex.map, normalMap: mixTex.normalMap, roughnessMap: mixTex.roughnessMap, displacementMap: mixTex.bumpSrc, displacementScale: 0, roughness: 1, clearcoat: 0.7, clearcoatRoughness: 0.18, normalScale: new THREE.Vector2(1.4, 1.4) });
M.bubble = new THREE.MeshPhysicalMaterial({ color: 0xfff3d6, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.55 });
M.shadow = new THREE.MeshBasicMaterial({ map: softDot, color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false });

function contact(r, op = 0.6) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), M.shadow.clone());
  m.material.opacity = op; m.rotation.x = -Math.PI / 2; m.position.y = 0.006; m.renderOrder = 1; return m;
}
const shadowed = (o, cast = true, recv = true) => { o.traverse((m) => { if (m.isMesh && m.material.map !== softDot) { m.castShadow = cast; m.receiveShadow = recv; } }); return o; };

/* ───────────── mesa y utilería ───────────── */
const table = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), M.table);
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

// tira de coco: geometría compartida
const shredGeo = (() => {
  const g = new THREE.BoxGeometry(0.2, 0.012, 0.03, 5, 1, 1), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setY(i, p.getY(i) + x * x * 1.6); p.setZ(i, p.getZ(i) + Math.sin(x * 14) * 0.006); }
  g.computeVertexNormals(); return g;
})();
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = V3(), _s = V3(1, 1, 1), _c = new THREE.Color();
function setInst(mesh, i, x, y, z, rx, ry, rz, sc = 1) {
  _e.set(rx, ry, rz); _q.setFromEuler(_e); _p.set(x, y, z); _s.setScalar(sc);
  mesh.setMatrixAt(i, _m4.compose(_p, _q, _s));
}
const shredTint = (mesh, i, base = 1) => mesh.setColorAt(i, _c.setHSL(0.11, 0.35, rnd(0.86, 0.97) * base));

// ralladura suelta sobre la mesa
const loose = new THREE.InstancedMesh(shredGeo, M.shred, 46);
loose.receiveShadow = true; scene.add(loose);

// medio coco
const coconut = new THREE.Group();
{
  const outer = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.husk);
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.53, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.cocoMeat);
  const rim = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 48, 1), M.cocoMeat); rim.rotation.x = -Math.PI / 2;
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(0.615, 0.02, 8, 48), M.husk); rim2.rotation.x = Math.PI / 2;
  const sh = new THREE.Group(); sh.add(outer, inner, rim, rim2); sh.position.y = 0.6; sh.rotation.set(0.22, 0, -0.16);
  coconut.add(contact(1.0, 0.7), shadowed(sh));
}
scene.add(coconut);

/* ───────────── cuencos de ingredientes ───────────── */
const ING = [
  { id: 'coco', name: 'Coco rallado', need: 3, unit: 'tazas' },
  { id: 'panela', name: 'Panela', need: 2, unit: 'bloques' },
  { id: 'leche', name: 'Leche de coco', need: 2, unit: 'tazas' },
  { id: 'canela', name: 'Canela', need: 1, unit: 'astillas' },
  { id: 'clavos', name: 'Clavos de olor', need: 1, unit: 'pizca' },
  { id: 'mantequilla', name: 'Mantequilla', need: 1, unit: 'cda.' },
];
ING.forEach((g) => (g.have = 0));
const bowlsG = new THREE.Group(); scene.add(bowlsG);
const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), M.linen);
cloth.rotation.x = -Math.PI / 2; cloth.position.y = 0.012; cloth.receiveShadow = true; bowlsG.add(cloth);

const bowlGeo = new THREE.LatheGeometry([[0, 0], [0.34, 0], [0.57, 0.25], [0.61, 0.33], [0.63, 0.345], [0.6, 0.35], [0.55, 0.3], [0.5, 0.22], [0.3, 0.07], [0, 0.055]].map((p) => new THREE.Vector2(p[0], p[1])), 56);
const cloveGeo = (() => { const g = new THREE.ConeGeometry(0.022, 0.15, 6); g.rotateZ(Math.PI / 2); return g; })();
const cloveHead = new THREE.SphereGeometry(0.032, 8, 6);
function makeClove() { const g = new THREE.Group(); const a = new THREE.Mesh(cloveGeo, M.clove), b = new THREE.Mesh(cloveHead, M.clove); b.position.x = -0.075; g.add(a, b); return g; }
function makeCinnamon() {
  const g = new THREE.Group(), len = rnd(0.62, 0.8);
  for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 14, 1, true, 0, Math.PI * 1.7), M.bark); t.rotation.z = Math.PI / 2; t.rotation.x = s > 0 ? 0.6 : 3.6; t.position.z = s * 0.04; g.add(t); }
  return g;
}
function makePanela() {
  const m = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.22, 0.3, 3, 0.045), M.panela);
  m.scale.set(rnd(0.85, 1.15), rnd(0.85, 1.1), rnd(0.85, 1.15)); return m;
}
function makeButter() { return new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.2, 0.26, 3, 0.04), M.butter); }

for (const ing of ING) {
  const g = new THREE.Group(); ing.group = g; ing.items = [];
  g.add(contact(1.0, 0.75), new THREE.Mesh(bowlGeo, M.clay));
  const inner = new THREE.Group(); g.add(inner); ing.inner = inner;
  if (ing.id === 'coco') {
    const mound = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.cocoMound);
    mound.scale.set(1, 0.42, 1); mound.position.y = 0.14; inner.add(mound);
    const n = 520, im = new THREE.InstancedMesh(shredGeo, M.shred, n);
    for (let i = 0; i < n; i++) { const r = 0.47 * Math.sqrt(rnd()), th = rnd(6.283); setInst(im, i, Math.cos(th) * r, 0.16 + 0.2 * (1 - (r / 0.5) ** 2) + rnd(0.03), Math.sin(th) * r, rnd(-0.6, 0.6), rnd(6.283), rnd(-0.6, 0.6), rnd(0.8, 1.25)); shredTint(im, i); }
    inner.add(im);
  } else if (ing.id === 'panela') {
    [[-0.15, 0.2, -0.1], [0.18, 0.2, -0.12], [-0.1, 0.22, 0.2], [0.2, 0.26, 0.16]].forEach((p, i) => { const m = makePanela(); m.position.set(...p); m.rotation.set(rnd(-0.3, 0.3), rnd(6), rnd(-0.3, 0.3)); inner.add(m); ing.items.push(m); });
  } else if (ing.id === 'leche') {
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.535, 48), M.milk.clone()); d.rotation.x = -Math.PI / 2; d.position.y = 0.275; inner.add(d); ing.disc = d;
  } else if (ing.id === 'canela') {
    for (let i = 0; i < 5; i++) { const m = makeCinnamon(); m.position.set(rnd(-0.06, 0.06), 0.16 + i * 0.045, (i - 2) * 0.12 + rnd(-0.03, 0.03)); m.rotation.y = rnd(-0.5, 0.5) + (i % 2) * 0.5; inner.add(m); ing.items.push(m); }
  } else if (ing.id === 'clavos') {
    for (let i = 0; i < 34; i++) { const m = makeClove(), r = 0.36 * Math.sqrt(rnd()), th = rnd(6.283); m.position.set(Math.cos(th) * r, 0.11 + rnd(0.08) + (0.36 - r) * 0.15, Math.sin(th) * r); m.rotation.set(rnd(-0.5, 0.5), rnd(6.283), rnd(-0.5, 0.5)); inner.add(m); ing.items.push(m); }
  } else if (ing.id === 'mantequilla') {
    [[-0.14, 0.2, 0.05, 0.3], [0.17, 0.2, -0.08, -0.5], [0.02, 0.36, 0.0, 1.0]].forEach((p) => { const m = makeButter(); m.position.set(p[0], p[1], p[2]); m.rotation.y = p[3]; inner.add(m); ing.items.push(m); });
  }
  shadowed(g); bowlsG.add(g);
  const el = document.createElement('div'); el.className = 'lbl'; $('#labels').appendChild(el); ing.label = el;
  const li = document.createElement('li'); $('#inglist').appendChild(li); ing.li = li;
}

/* ───────────── paila de cobre ───────────── */
const PR = 1.7, PY0 = 0.12, PH = 0.63;
const innerR = (y) => PR * Math.sin(Math.acos(clamp(1 - (y - PY0) / PH, -1, 1)));
const bowlY = (r) => PY0 + PH * (1 - Math.cos(Math.asin(clamp(r / PR, 0, 1))));
const pailaG = new THREE.Group(); scene.add(pailaG);
const trivet = new THREE.Group(); scene.add(trivet);
{
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(PR * Math.sin(a), PY0 + PH * (1 - Math.cos(a)))); }
  pts.push(new THREE.Vector2(1.76, 0.765), new THREE.Vector2(1.8, 0.76), new THREE.Vector2(1.8, 0.73));
  for (let i = 16; i >= 0; i--) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(1.77 * Math.sin(a), 0.05 + 0.67 * (1 - Math.cos(a)))); }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), M.copper);
  pailaG.add(body);
  for (const s of [-1, 1]) {
    const hd = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 28, Math.PI), M.brass);
    hd.rotation.set(-Math.PI / 2, 0, 0); const piv = new THREE.Group(); piv.add(hd); piv.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; piv.position.set(s * 1.76, 0.72, 0);
    pailaG.add(piv);
    for (const z of [-0.3, 0.3]) { const riv = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), M.brass); riv.position.set(s * 1.77, 0.74, z); pailaG.add(riv); }
  }
  shadowed(pailaG);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.07, 10, 48), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; trivet.add(ring);
  for (let i = 0; i < 3; i++) { const leg = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.12, 0.16, 2, 0.03), M.iron); const a = i * 2.094 + 0.5; leg.position.set(Math.cos(a) * 1.55, 0.07, Math.sin(a) * 1.55); leg.rotation.y = -a; trivet.add(leg); }
  shadowed(trivet); trivet.add(contact(2.7, 0.8));
}
pailaG.position.y = 0.1;

// contenido de la paila
const mixG = new THREE.Group(); pailaG.add(mixG);
const discGeo = new THREE.RingGeometry(0.0001, 1, 128, 40); discGeo.rotateX(-Math.PI / 2);
const mixDisc = new THREE.Mesh(discGeo, M.mix); mixDisc.receiveShadow = true; mixDisc.visible = false; mixG.add(mixDisc);
const milkDisc = new THREE.Mesh(new THREE.CircleGeometry(1, 96).rotateX(-Math.PI / 2), M.milk); milkDisc.receiveShadow = true; milkDisc.visible = false; mixG.add(milkDisc);

const SH_PER = 210, SH_MAX = SH_PER * 3;
const pShreds = new THREE.InstancedMesh(shredGeo, M.shred.clone(), SH_MAX);
pShreds.count = 0; pShreds.castShadow = true; pShreds.receiveShadow = true; pShreds.frustumCulled = false; mixG.add(pShreds);
const shredData = [];
const pieces = [];   // panela, canela, clavos, mantequilla dentro de la paila

const bubbles = [];
for (let i = 0; i < 16; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8, 0, 6.283, 0, Math.PI / 2), M.bubble); b.visible = false; b.userData.t = rnd(); mixG.add(b); bubbles.push(b); }
const steamMat = new THREE.SpriteMaterial({ map: softDot, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const steams = [];
for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(steamMat.clone()); s.userData.t = i / 12; s.visible = false; scene.add(s); steams.push(s); }

// cuchara de palo
const spoon = new THREE.Group();
{
  const head = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), M.spoon); head.scale.set(0.2, 0.055, 0.3);
  const hnd = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 2.5, 14), M.spoon); hnd.rotation.x = Math.PI / 2; hnd.position.z = 1.45;
  spoon.add(head, hnd); spoon.rotation.order = 'YXZ'; spoon.rotation.set(-0.42, -0.65, 0);
  shadowed(spoon); spoon.visible = false; pailaG.add(spoon);
}
const spoonTarget = V3(0.5, 0.4, 0.4);

/* ───────────── tabla + hoja de plátano ───────────── */
const boardG = new THREE.Group(); boardG.visible = false; scene.add(boardG);
const BW = 4.6, BD = 3.1, BTOP = 0.16;
{
  const b = new THREE.Mesh(new RoundedBoxGeometry(BW, 0.14, BD, 4, 0.06), M.board); b.position.y = 0.08;
  const lg = new THREE.PlaneGeometry(4.3, 2.7, 60, 30), p = lg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), u = x / 2.15, v = y / 1.35;
    const half = 1.35 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 2.6)), 0.5) * (1 + 0.035 * Math.sin(x * 9));
    p.setY(i, v * half);
    p.setZ(i, 0.012 + 0.03 * Math.abs(v) * (0.5 + 0.5 * Math.sin(x * 5 + v * 3)) + 0.012 * Math.sin(x * 13));
  }
  lg.computeVertexNormals();
  const leaf = new THREE.Mesh(lg, M.leaf); leaf.rotation.x = -Math.PI / 2; leaf.rotation.z = 0.05; leaf.position.y = BTOP;
  boardG.add(contact(3.6, 0.8), shadowed(b), shadowed(leaf));
}
const cocadas = [];
const cocadaGeos = [0, 1, 2].map((k) => {
  const g = new THREE.IcosahedronGeometry(0.4, 12), p = g.attributes.position, v = V3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 9 + k * 3) * Math.cos(v.z * 8 - k) * 0.035 + Math.sin(v.x * 21 + v.y * 17 + k) * Math.sin(v.z * 19 - v.y * 5) * 0.022 + Math.sin(v.x * 43 + k) * Math.sin(v.z * 41) * Math.sin(v.y * 37) * 0.012;
    v.multiplyScalar(1 + n * 2.2); v.y = Math.max(v.y * 0.62, -0.1);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
});

/* ───────────── estado ───────────── */
const S = {
  phase: 'intro', level: 0.15, milkK: 0, fire: false, D: 0, mixed: 0, stick: 0, burn: 0,
  stirVel: 0, lastStir: -9, lastAng: null, down: false, busy: false, served: 0, portrait: false, t: 0,
};
const L = { paila: V3(), bowls: [], leaf: V3(), pailaServe: V3(), target: V3(), H: 14, coconut: V3() };
const cam = { target: V3(), H: 14, par: new THREE.Vector2() };
const levelTarget = () => 0.15 + 0.02 * ING[0].have + 0.085 * ING[2].have - 0.05 * Math.min(S.D, 1) * (ING[2].have ? 1 : 0) - S.served * 0.022;

function layout(snap = false) {
  const w = innerWidth, h = innerHeight, asp = w / h, tanF = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  S.portrait = asp < 0.9;
  renderer.setSize(w, h, false); camera.aspect = asp; camera.updateProjectionMatrix();
  let H;
  if (!S.portrait) {
    const f = Math.max(0.45, (w - 330) / w), Wc = 8.2, Hc = 6.6, cx = -1.2;
    H = Math.max(Hc / (2 * tanF), Wc / f / (2 * tanF * asp));
    const visW = 2 * H * tanF * asp;
    L.target.set(cx + visW * (1 - f) / 2, 0, 0.15);
    L.paila.set(0.75, 0.1, 0);
    L.bowls = ING.map((_, i) => V3(i % 2 ? -0.7 : 0.7, 0, (Math.floor(i / 2) - 1) * 1.55));
    L.bowlsG = V3(-3.6, 0, 0); L.bowlsOut = V3(-12, 0, 0);
    cloth.scale.set(3.3, 5.1, 1); cloth.rotation.z = 0.03;
    L.leaf.set(0.6, 0, 0); L.boardOut = V3(13, 0, 0); L.pailaServe.set(-3.6, 0.1, 0);
    L.coconut.set(-1.55, 0, -2.5);
  } else {
    const top = 62, bot = Math.min(h * 0.33, 250), f = (h - top - bot) / h, Wc = 4.9, Hc = 7.5, cz = -0.5;
    H = Math.max(Hc / f / (2 * tanF), Wc / (2 * tanF * asp));
    const visH = 2 * H * tanF;
    L.target.set(0, 0, cz + ((bot - top) / 2 / h) * visH);
    L.paila.set(0, 0.1, -2.0);
    L.bowls = ING.map((_, i) => V3((i % 3 - 1) * 1.5, 0, i < 3 ? -0.7 : 0.7));
    L.bowlsG = V3(0, 0, 1.7); L.bowlsOut = V3(0, 0, 14);
    cloth.scale.set(4.9, 3.3, 1); cloth.rotation.z = 0.02;
    L.leaf.set(0, 0, -1.9); L.boardOut = V3(0, 0, -14); L.pailaServe.set(0, 0.1, 1.9);
    L.coconut.set(-2.6, 0, -4.6);
  }
  L.H = H;
  ING.forEach((g, i) => g.group.position.copy(L.bowls[i]));
  boardG.rotation.y = S.portrait ? Math.PI / 2 : 0;
  coconut.position.copy(L.coconut);
  const serving = S.phase === 'serve' || S.phase === 'done';
  if (snap || !S.busy) {
    bowlsG.position.copy(serving ? L.bowlsOut : L.bowlsG);
    pailaG.position.copy(serving ? L.pailaServe : L.paila); trivet.position.set(pailaG.position.x, 0, pailaG.position.z);
    boardG.position.copy(serving ? L.leaf : L.boardOut);
    if (S.phase !== 'done') { cam.target.copy(L.target); cam.H = H; }
  }
  for (let i = 0; i < loose.count; i++) {
    const a = rnd(6.283), r = rnd(0.75, 1.9), c = L.coconut;
    setInst(loose, i, c.x + Math.cos(a) * r, 0.012, c.z + Math.sin(a) * r, 0, rnd(6.283), 0, rnd(0.5, 0.8)); shredTint(loose, i, 0.97);
  }
  loose.instanceMatrix.needsUpdate = true; if (loose.instanceColor) loose.instanceColor.needsUpdate = true;
}
function placeLabels() {
  const v = V3();
  for (const g of ING) {
    g.group.getWorldPosition(v); v.z += 0.78; v.y = 0.3; v.project(camera);
    g.label.style.left = ((v.x * 0.5 + 0.5) * innerWidth) + 'px';
    g.label.style.top = ((-v.y * 0.5 + 0.5) * innerHeight) + 'px';
  }
}

/* ───────────── sonido ───────────── */
let ac = null, sizzleGain = null, muted = false;
function audioInit() {
  if (ac) return; try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.random());
  const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 5200; f.Q.value = 0.6;
  sizzleGain = ac.createGain(); sizzleGain.gain.value = 0; src.connect(f).connect(sizzleGain).connect(ac.destination); src.start();
  ac._noise = buf;
}
function plop(freq = 320, vol = 0.18) {
  if (!ac || muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq / 3, t + 0.16);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.22);
}
function shh(dur = 0.35, fr = 2500, vol = 0.12) {
  if (!ac || muted) return; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
  s.buffer = ac._noise; f.type = 'bandpass'; f.frequency.value = fr; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(f).connect(g).connect(ac.destination); s.start(t, rnd(1)); s.stop(t + dur);
}
$('#snd').onclick = () => { muted = !muted; $('#snd').classList.toggle('off', muted); };

/* ───────────── UI ───────────── */
const btn = $('#btn'), hint = $('#hint');
function refreshUI() {
  for (const g of ING) {
    const full = g.have >= g.need;
    g.label.innerHTML = `${g.name}<b>${g.have}/${g.need}</b>`; g.label.classList.toggle('full', full);
    g.li.innerHTML = `<span>${g.name}</span><span>${g.have}/${g.need} ${g.unit}</span>`; g.li.classList.toggle('ok', full);
  }
  const order = ['ing', 'cook', 'serve', 'done'], pi = order.indexOf(S.phase);
  document.querySelectorAll('#steps li').forEach((li, i) => { li.classList.toggle('on', i === pi); li.classList.toggle('ok', i < pi); });
  $('#labels').style.opacity = S.phase === 'ing' ? 1 : 0;
  $('#gauge').classList.toggle('hide', S.phase !== 'cook');
  if (S.phase === 'ing') {
    const ready = ING.every((g) => g.have >= g.need);
    btn.textContent = 'Encender el fogón'; btn.disabled = !ready;
    hint.textContent = ready ? '¡Todo en la paila! Enciende el fogón.' : 'Toca cada cuenco para echarlo a la paila.';
  } else if (S.phase === 'cook') {
    btn.textContent = 'Apagar el fogón'; btn.disabled = false;
    hint.textContent = 'Mantén presionado y gira dentro de la paila para revolver. Apaga cuando llegue al punto.';
  } else if (S.phase === 'serve') {
    btn.textContent = `Servir (${S.served}/8)`; btn.disabled = S.served < 3;
    hint.textContent = 'Toca la hoja de plátano para poner cada cocada.';
  }
}

/* ───────────── ingredientes → paila ───────────── */
const bowlWorld = (g, y = 0.5) => g.group.getWorldPosition(V3()).setY(y);
function flyPiece(mesh, ing, opt = {}) {
  const r = (opt.rmax ?? 1.05) * Math.sqrt(rnd(0.05, 1)), th = rnd(6.283);
  scene.attach(mesh); mixG.attach(mesh);
  const from = mesh.position.clone(), to = V3(Math.cos(th) * r, 0, Math.sin(th) * r);
  const q0 = mesh.quaternion.clone(), q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(opt.flat ? 0 : rnd(-0.3, 0.3), rnd(6.283), opt.flat ? 0 : rnd(-0.3, 0.3)));
  const ud = mesh.userData; Object.assign(ud, { r, th, hh: opt.hh ?? 0.08, kind: ing.id, s0: mesh.scale.clone(), landed: false });
  shadowed(mesh);
  return tween(0.55 + rnd(0.15), (k) => {
    const y1 = Math.max(S.level, bowlY(r)) + ud.hh;
    mesh.position.lerpVectors(from, to, k); mesh.position.y = lerp(from.y, y1, k) + Math.sin(k * Math.PI) * 1.1;
    mesh.quaternion.slerpQuaternions(q0, q1, k);
  }, (t) => t).then(() => { ud.landed = true; pieces.push(mesh); plop(rnd(180, 260), 0.12); });
}
function addIngredient(ing) {
  if (S.phase !== 'ing' || ing.have >= ing.need) return false;
  ing.have++;
  const left = 1 - ing.have / ing.need;
  tween(0.25, (k) => ing.group.scale.setScalar(1 + Math.sin(k * Math.PI) * 0.1));
  if (ing.id === 'coco') {
    const from = mixG.worldToLocal(bowlWorld(ing, 0.55));
    for (let i = 0; i < SH_PER; i++) {
      const r = 1.28 * Math.sqrt(rnd()), th = rnd(6.283);
      shredData.push({ r, th, yo: rnd(0.005, 0.07), rx: rnd(-0.5, 0.5), ry: rnd(6.283), rz: rnd(-0.5, 0.5), sc: rnd(0.85, 1.3), born: S.t + rnd(0.3), from: from.clone().add(V3(rnd(-0.3, 0.3), rnd(0.2), rnd(-0.3, 0.3))) });
      shredTint(pShreds, shredData.length - 1);
    }
    pShreds.count = shredData.length; pShreds.instanceColor.needsUpdate = true;
    tween(0.5, (k) => { ing.inner.scale.setScalar(lerp(ing.inner.scale.x, 0.35 + 0.65 * left, k)); if (left <= 0) ing.inner.scale.y = lerp(ing.inner.scale.y, 0.12, k); });
    shh(0.5, 3200, 0.1);
  } else if (ing.id === 'panela') {
    ing.items.splice(0, 2).forEach((m) => flyPiece(m, ing, { hh: 0.1, rmax: 0.9 }));
  } else if (ing.id === 'leche') {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14), M.milk); drop.position.copy(bowlWorld(ing, 0.5)); scene.add(drop);
    const from = drop.position.clone(), to = pailaG.getWorldPosition(V3()).setY(0.5);
    tween(0.5, (k) => { drop.position.lerpVectors(from, to, k); drop.position.y += Math.sin(k * Math.PI) * 1.2; drop.scale.set(1 - k * 0.3, 1 + k * 0.6, 1 - k * 0.3); }, (t) => t)
      .then(() => { scene.remove(drop); milkDisc.visible = mixDisc.visible = true; plop(140, 0.22); shh(0.6, 900, 0.14); tween(0.8, (k) => (S.milkK = Math.max(S.milkK, k))); });
    tween(0.5, (k) => { ing.disc.position.y = lerp(ing.disc.position.y, 0.09 + 0.185 * left, k); ing.disc.scale.setScalar(lerp(ing.disc.scale.x, 0.55 + 0.45 * left, k)); if (left <= 0) ing.disc.material.opacity = 1 - k * 0.6; });
  } else if (ing.id === 'canela') {
    ing.items.splice(0, 3).forEach((m) => flyPiece(m, ing, { hh: 0.05, flat: true, rmax: 0.95 }));
  } else if (ing.id === 'clavos') {
    ing.items.splice(0, 12).forEach((m) => flyPiece(m, ing, { hh: 0.03, rmax: 1.15 }));
  } else if (ing.id === 'mantequilla') {
    ing.items.splice(0, 2).forEach((m) => flyPiece(m, ing, { hh: 0.1, rmax: 0.7 }));
  }
  refreshUI(); return true;
}

/* ───────────── fases ───────────── */
function startCooking() {
  S.phase = 'cook'; S.fire = true; S.lastStir = S.t; spoon.visible = true;
  spoon.position.set(0.5, 2.5, 0.4); tween(0.6, (k) => (spoon.position.y = lerp(2.5, S.level + 0.03, k)), easeOut);
  shh(0.8, 700, 0.2); refreshUI();
}
async function startServing() {
  S.phase = 'serve'; S.fire = false; S.busy = true; refreshUI();
  boardG.visible = true; boardG.position.copy(L.boardOut);
  const p0 = pailaG.position.clone(), b0 = bowlsG.position.clone();
  await tween(1.3, (k) => {
    bowlsG.position.lerpVectors(b0, L.bowlsOut, k);
    pailaG.position.lerpVectors(p0, L.pailaServe, k); trivet.position.set(pailaG.position.x, 0, pailaG.position.z);
    boardG.position.lerpVectors(L.boardOut, L.leaf, k);
  });
  S.busy = false;
}
function cocadaColor(out = new THREE.Color()) {
  const D = S.D, a = new THREE.Color(0xfff6e2), b = new THREE.Color(0xf0cf95), c = new THREE.Color(0xc98a3e), d = new THREE.Color(0x4a2710);
  if (D < 0.5) out.lerpColors(a, b, D / 0.5); else if (D < 1) out.lerpColors(b, c, (D - 0.5) / 0.5); else out.lerpColors(c, d, clamp((D - 1) / 0.3));
  return out.multiplyScalar(1 - 0.55 * clamp(S.burn * 2.5));
}
function placeCocada(world) {
  if (S.phase !== 'serve' || S.served >= 8) return false;
  const loc = boardG.worldToLocal(world.clone());
  if (Math.abs(loc.x) > BW / 2 - 0.5 || Math.abs(loc.z) > BD / 2 - 0.5) return false;
  if (cocadas.some((c) => Math.hypot(c.position.x - loc.x, c.position.z - loc.z) < 0.82)) return false;
  S.served++;
  const g = new THREE.Group(), col = cocadaColor();
  const mat = new THREE.MeshPhysicalMaterial({ map: mixTex.map, normalMap: mixTex.normalMap, roughnessMap: mixTex.roughnessMap, roughness: 1, color: col, clearcoat: 0.45, clearcoatRoughness: 0.3, normalScale: new THREE.Vector2(2, 2) });
  const geo = cocadaGeos[S.served % 3], body = new THREE.Mesh(geo, mat); g.add(body);
  const n = 110, im = new THREE.InstancedMesh(shredGeo, M.shred, n), pa = geo.attributes.position, na = geo.attributes.normal, v = V3(), nn = V3(), sc = new THREE.Color().copy(col).lerp(new THREE.Color(0xfff8ea), 0.55);
  for (let i = 0; i < n; i++) {
    const k = Math.floor(rnd(pa.count)); v.fromBufferAttribute(pa, k); nn.fromBufferAttribute(na, k);
    if (v.y < -0.05) { v.y = rnd(0, 0.2); }
    _q.setFromUnitVectors(V3(0, 1, 0), nn).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(-0.5, 0.5), rnd(6.283), rnd(-0.5, 0.5))));
    _p.copy(v).addScaledVector(nn, 0.004); _s.setScalar(rnd(0.7, 1.15)); im.setMatrixAt(i, _m4.compose(_p, _q, _s));
    im.setColorAt(i, _c.copy(sc).multiplyScalar(rnd(0.88, 1.05)));
  }
  g.add(im); shadowed(g);
  const sh = contact(0.62, 0.55); sh.position.y = -0.085; g.add(sh);
  const s1 = rnd(0.92, 1.12); g.rotation.y = rnd(6.283);
  boardG.add(g); cocadas.push(g);
  const from = boardG.worldToLocal(pailaG.getWorldPosition(V3()).setY(0.7)), to = V3(loc.x, BTOP + 0.115, loc.z);
  tween(0.5, (k) => { g.position.lerpVectors(from, to, k); g.position.y += Math.sin(k * Math.PI) * 1.3; g.scale.setScalar(s1 * (0.5 + 0.5 * k)); }, (t) => t)
    .then(() => { plop(120, 0.2); return tween(0.3, (k) => g.scale.set(s1 * (1 + 0.12 * Math.sin(k * Math.PI)), s1 * (1 - 0.18 * Math.sin(k * Math.PI)), s1 * (1 + 0.12 * Math.sin(k * Math.PI)))); });
  refreshUI();
  if (S.served >= 8) setTimeout(finish, 1100);
  return true;
}
function finish() {
  if (S.phase === 'done') return; S.phase = 'done'; refreshUI();
  const D = S.D; let pts = D >= 0.8 && D <= 1.0 ? 3 : (D >= 0.62 && D <= 1.13 ? 2 : 1);
  if (S.burn > 0.12) pts--; if (S.served < 6 && pts === 3) pts = 2; pts = clamp(pts, 1, 3);
  const title = D < 0.62 ? 'Le faltó fuego' : D < 0.8 ? 'Casi, quedó melcochuda' : D <= 1.0 ? '¡En su punto!' : D <= 1.13 ? 'Un pelito pasada' : 'Se pasó de candela';
  const text = (D < 0.62 ? 'La mezcla quedó clara y blandita; no cuaja bien.' : D < 0.8 ? 'Dulce y suave, pero un poco pegajosa.' : D <= 1.0 ? 'Doradas, brillantes y con el coco bien acaramelado.' : D <= 1.13 ? 'Sabrosas, aunque algo duras y oscuras.' : 'Caramelo oscuro y amargo… para la próxima apaga antes.')
    + (S.burn > 0.12 ? ' Además se pegó al fondo por no revolver.' : '') + ` Armaste ${S.served} cocadas.`;
  $('#stars').innerHTML = '★'.repeat(pts) + '<i>' + '★'.repeat(3 - pts) + '</i>'; $('#rtitle').textContent = title; $('#rtext').textContent = text;
  const t0 = cam.target.clone(), h0 = cam.H, t1 = boardG.position.clone().setY(0); t1.z += S.portrait ? 1.2 : 0.7;
  tween(1.6, (k) => { cam.target.lerpVectors(t0, t1, k); cam.H = lerp(h0, h0 * (S.portrait ? 0.8 : 0.6), k); });
  $('#ticket').style.transition = 'opacity .6s'; $('#ticket').style.opacity = 0; $('#ticket').style.pointerEvents = 'none';
  setTimeout(() => $('#result').classList.remove('hide'), 2000);
}
btn.onclick = () => {
  audioInit();
  if (S.phase === 'ing') startCooking(); else if (S.phase === 'cook') startServing(); else if (S.phase === 'serve') finish();
};
$('#start').onclick = () => { audioInit(); $('#intro').classList.add('hide'); S.phase = 'ing'; refreshUI(); };
$('#again').onclick = () => location.reload();

/* ───────────── entrada ───────────── */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(V3(0, 1, 0), 0), hit = V3();
function groundAt(e, y) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera); plane.constant = -y;
  return ray.ray.intersectPlane(plane, hit) ? hit.clone() : null;
}
function bowlAt(e) {
  const p = groundAt(e, 0.33); if (!p) return null;
  return ING.find((g) => { const w = g.group.getWorldPosition(V3()); return Math.hypot(w.x - p.x, w.z - p.z) < 0.68; }) || null;
}
function stirAt(e) {
  const p = groundAt(e, pailaG.position.y + S.level); if (!p) return;
  const x = p.x - pailaG.position.x, z = p.z - pailaG.position.z, r = Math.hypot(x, z);
  if (r > 2.1) { S.lastAng = null; return; }
  const rm = innerR(S.level) - 0.28, k = r > rm ? rm / r : 1;
  spoonTarget.set(x * k, S.level + 0.03, z * k);
  const ang = Math.atan2(z, x);
  if (S.lastAng !== null && r > 0.15) {
    let d = ang - S.lastAng; if (d > Math.PI) d -= 6.283; if (d < -Math.PI) d += 6.283;
    if (Math.abs(d) > 0.004) { S.stirVel = lerp(S.stirVel, clamp(d * 26, -5, 5), 0.3); S.mixed = Math.min(1, S.mixed + Math.abs(d) / (6.283 * 3.5)); S.lastStir = S.t; }
  }
  S.lastAng = ang;
}
canvas.addEventListener('pointerdown', (e) => {
  audioInit(); S.down = true; canvas.setPointerCapture(e.pointerId);
  if (S.phase === 'ing') { const g = bowlAt(e); if (g) addIngredient(g); }
  else if (S.phase === 'cook') { S.lastAng = null; stirAt(e); }
  else if (S.phase === 'serve') { const p = groundAt(e, BTOP); if (p) placeCocada(p); }
});
canvas.addEventListener('pointermove', (e) => {
  cam.par.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  if (S.phase === 'ing') { const g = bowlAt(e); canvas.style.cursor = g && g.have < g.need ? 'pointer' : 'default'; ING.forEach((o) => (o.hover = o === g && o.have < o.need)); }
  else if (S.phase === 'cook') { canvas.style.cursor = 'grab'; if (S.down) stirAt(e); }
  else if (S.phase === 'serve') canvas.style.cursor = 'copy'; else canvas.style.cursor = 'default';
});
const up = () => { S.down = false; S.lastAng = null; };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
addEventListener('resize', () => layout());

/* ───────────── bucle ───────────── */
const clock = new THREE.Clock(), tmpC = new THREE.Color(), camPos = V3();
function update(dt) {
  S.t += dt;
  for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t += dt; const k = Math.min(1, w.t / w.d); w.fn(w.ease(k)); if (k >= 1) { tweens.splice(i, 1); w.res(); } }

  // cocción
  if (S.fire) {
    S.D = Math.min(1.3, S.D + dt * 0.04);
    if (S.t - S.lastStir < 0.7) S.stick = Math.max(0, S.stick - dt * 0.6);
    else { S.stick += dt * 0.15; if (S.stick >= 1) { S.stick = 1; S.burn += dt * 0.07; } }
    $('#marker').style.left = (S.D / 1.3) * 100 + '%';
    $('#warn').classList.toggle('on', S.stick > 0.5);
  } else $('#warn').classList.remove('on');
  const heat = S.fire ? 1 : 0;
  fireLight.intensity = lerp(fireLight.intensity, heat * (7 + Math.sin(S.t * 17) * 1.5), 0.1);
  fireLight.position.set(pailaG.position.x + 1.9, 0.5, pailaG.position.z + 1.2);
  M.copper.emissiveIntensity = lerp(M.copper.emissiveIntensity, heat * 0.05, 0.05);
  if (sizzleGain) sizzleGain.gain.value = lerp(sizzleGain.gain.value, muted ? 0 : heat * (0.025 + 0.05 * S.D + 0.05 * S.stick), 0.05);

  // mezcla
  S.level = lerp(S.level, levelTarget(), 1 - Math.exp(-dt * 4));
  S.stirVel *= Math.exp(-dt * 2.2);
  mixG.rotation.y -= S.stirVel * dt;
  const R = innerR(S.level) - 0.012;
  mixDisc.position.y = S.level; mixDisc.scale.set(R * S.milkK, 1, R * S.milkK);
  milkDisc.position.y = S.level + 0.004 + S.mixed * 0.02; milkDisc.scale.copy(mixDisc.scale);
  M.milk.opacity = 1 - smooth(0.05, 0.85, S.mixed); milkDisc.visible = S.milkK > 0 && M.milk.opacity > 0.01;
  M.mix.displacementScale = 0.11 * S.mixed; M.mix.displacementBias = -0.045 * S.mixed;
  cocadaColor(M.mix.color);
  M.mix.clearcoatRoughness = lerp(0.12, 0.3, clamp(S.D));
  pShreds.material.color.copy(tmpC.copy(M.mix.color).lerp(_c.set(0xffffff), 0.3));

  for (let i = 0; i < shredData.length; i++) {
    const d = shredData[i], age = (S.t - d.born) / 0.6;
    const x = Math.cos(d.th) * d.r, z = Math.sin(d.th) * d.r;
    const y = Math.max(S.level + d.yo * (1 - 0.75 * S.mixed), bowlY(d.r) + 0.012);
    const hide = i >= shredData.length - S.served * 70 ? 0.001 : 1;
    if (age < 0) setInst(pShreds, i, d.from.x, d.from.y, d.from.z, d.rx, d.ry, d.rz, 0.001);
    else if (age < 1) setInst(pShreds, i, lerp(d.from.x, x, age), lerp(d.from.y, y, age) + Math.sin(age * Math.PI) * 1.0, lerp(d.from.z, z, age), d.rx + (1 - age) * 4, d.ry, d.rz + (1 - age) * 3, d.sc);
    else setInst(pShreds, i, x, y, z, d.rx * (1 - 0.6 * S.mixed), d.ry, d.rz * (1 - 0.6 * S.mixed), d.sc * hide);
  }
  pShreds.instanceMatrix.needsUpdate = true;

  for (const m of pieces) {
    const u = m.userData; let k = 1;
    if (u.kind === 'panela') k = 1 - smooth(0.02, 0.5, S.D);
    if (u.kind === 'mantequilla') k = 1 - smooth(0.0, 0.16, S.D);
    m.visible = k > 0.03;
    if (u.kind === 'panela') m.scale.copy(u.s0).multiplyScalar(k);
    if (u.kind === 'mantequilla') m.scale.set(u.s0.x * (1 + (1 - k) * 0.8), u.s0.y * k, u.s0.z * (1 + (1 - k) * 0.8));
    m.position.y = Math.max(S.level - (1 - k) * 0.05, bowlY(u.r)) + u.hh * k * (u.kind === 'mantequilla' ? 1 : 1) - S.mixed * (u.kind === 'clavos' ? 0.0 : 0.02);
  }

  // burbujas y vapor
  const boil = S.fire && ING[2].have ? smooth(0.03, 0.25, S.D) : 0;
  for (const b of bubbles) {
    b.userData.t += dt * (0.7 + boil * 1.4) * (0.6 + (b.id % 5) * 0.2);
    if (b.userData.t > 1) { b.userData.t = 0; const r = (R - 0.2) * Math.sqrt(rnd()), th = rnd(6.283); b.position.set(Math.cos(th) * r, 0, Math.sin(th) * r); b.userData.s = rnd(0.018, 0.05) * (0.6 + boil); }
    const k = b.userData.t; b.visible = boil > 0.02 && k < 0.92; b.position.y = S.level + 0.01 + 0.03 * S.mixed;
    b.scale.setScalar((b.userData.s || 0.05) * Math.sin(k * Math.PI * 0.55) * (boil > 0 ? 1 : 0) + 0.0001);
  }
  M.bubble.color.copy(tmpC.copy(M.mix.color).lerp(_c.set(0xffffff), 0.5));
  for (const s of steams) {
    s.userData.t += dt * 0.28; if (s.userData.t > 1) { s.userData.t = 0; s.userData.x = rnd(-1, 1); s.userData.z = rnd(-1, 1); }
    const k = s.userData.t; s.visible = boil > 0.02;
    s.position.set(pailaG.position.x + (s.userData.x || 0) + Math.sin(S.t + s.id) * 0.2 * k, 0.8 + k * 3.2, pailaG.position.z + (s.userData.z || 0) - k * 0.8);
    s.scale.setScalar(0.7 + k * 2.2); s.material.opacity = Math.sin(k * Math.PI) * 0.13 * boil;
  }

  // cuchara
  if (spoon.visible) {
    spoonTarget.y = S.level + 0.03;
    if (S.phase === 'cook' || S.phase === 'serve') spoon.position.lerp(spoonTarget, 1 - Math.exp(-dt * 16));
    spoon.rotation.z = Math.sin(S.t * 9) * 0.03 * Math.min(1, Math.abs(S.stirVel));
  }

  // cuencos
  for (const g of ING) { const t = g.hover && S.phase === 'ing' ? 0.12 : 0; g.group.position.y = lerp(g.group.position.y, t, 0.2); }

  // cámara
  camPos.set(cam.target.x + cam.par.x * 0.22, cam.H, cam.target.z + cam.H * 0.1 + cam.par.y * 0.18);
  camera.position.lerp(camPos, 1 - Math.exp(-dt * 5));
  camera.lookAt(cam.target.x, 0, cam.target.z);
  sun.target.position.copy(cam.target); sun.position.set(cam.target.x - 5, 11, cam.target.z - 4);
  if (S.phase === 'ing') placeLabels();
}
function frame() { update(Math.min(0.05, clock.getDelta())); renderer.render(scene, camera); requestAnimationFrame(frame); }

layout(true); camera.position.set(cam.target.x, cam.H * 1.25, cam.target.z + cam.H * 0.1);
refreshUI(); $('#labels').style.opacity = 0;
$('#start').disabled = true;
manager.onLoad = () => { $('#start').disabled = false; $('#loading').textContent = 'Texturas PBR: Poly Haven (CC0)'; };
manager.onError = (u) => { $('#start').disabled = false; $('#loading').textContent = 'No se pudo cargar ' + u; };
frame();

// ganchos para pruebas
window.__game = { S, ING, addIngredient, startCooking, startServing, placeCocada, finish, boardG, tweens, update, V3 };
