import * as THREE from 'three';
import { RGBELoader } from '../la-paila-dulce/vendor/RGBELoader.js';
import { RoundedBoxGeometry } from '../la-paila-dulce/vendor/RoundedBoxGeometry.js';

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
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
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

/* ───────────── texturas PBR compartidas ───────────── */
const manager = new THREE.LoadingManager();
const tl = new THREE.TextureLoader(manager);
function loadSet(name, rep = 1) {
  const mk = (suf, srgb) => {
    const t = tl.load(`../la-paila-dulce/assets/${name}_${suf}.jpg`);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = MAXANI;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const arm = mk('arm');
  return { map: mk('diff', true), normalMap: mk('nor'), roughnessMap: arm, aoMap: arm };
}
new RGBELoader(manager).load('../la-paila-dulce/assets/studio_1k.hdr', (hdr) => {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(hdr).texture;
  hdr.dispose(); pm.dispose();
});

const texWood = loadSet('wood_table_worn', 2.4);
const texLinen = loadSet('rough_linen', 1.5);
const softDot = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const aoShadowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 16, 64, 64, 64);
  g.addColorStop(0, 'rgba(18,8,2,0.52)'); g.addColorStop(0.6, 'rgba(18,8,2,0.22)'); g.addColorStop(1, 'rgba(18,8,2,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();

function makeLeafTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#326323'; x.fillRect(0, 0, 512, 512);
  x.fillStyle = '#4e7e36'; x.fillRect(0, 248, 512, 16);
  for (let i = 0; i < 64; i++) {
    const u = i * 8 + rnd(-2, 2);
    x.strokeStyle = `rgba(22,52,14,${rnd(0.18, 0.42)})`; x.lineWidth = rnd(1, 2.5);
    x.beginPath(); x.moveTo(u, 248); x.lineTo(u + 16, 0); x.moveTo(u, 264); x.lineTo(u + 16, 512); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

const M = {
  table: new THREE.MeshStandardMaterial({ ...texWood, roughness: 0.85, metalness: 0, envMapIntensity: 0.55 }),
  linen: new THREE.MeshStandardMaterial({ ...texLinen, roughness: 0.95, metalness: 0, envMapIntensity: 0.4 }),
  clay: new THREE.MeshStandardMaterial({ color: 0xefe3ce, roughness: 0.42, metalness: 0.04, envMapIntensity: 0.9 }),
  ironPan: new THREE.MeshStandardMaterial({ color: 0x262425, roughness: 0.44, metalness: 0.82, envMapIntensity: 1.2 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc29348, roughness: 0.34, metalness: 0.88, envMapIntensity: 1.2 }),
  iron: new THREE.MeshStandardMaterial({ color: 0x222020, roughness: 0.72, metalness: 0.75 }),
  oil: new THREE.MeshStandardMaterial({ color: 0xe6a128, roughness: 0.14, metalness: 0.05, transparent: true, opacity: 0.84 }),
  fishRaw: new THREE.MeshStandardMaterial({ color: 0x9aa9b2, roughness: 0.38, metalness: 0.25 }),
  fishFin: new THREE.MeshStandardMaterial({ color: 0xc77e45, roughness: 0.65, metalness: 0.05, side: THREE.DoubleSide }),
  fishCut: new THREE.MeshStandardMaterial({ color: 0x6b3a1a, roughness: 0.8 }),
  lime: new THREE.MeshStandardMaterial({ color: 0x4d9927, roughness: 0.55 }),
  limePulp: new THREE.MeshStandardMaterial({ color: 0xbef264, roughness: 0.35 }),
  salt: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 }),
  rice: new THREE.MeshStandardMaterial({ color: 0x6b4222, roughness: 0.78 }),
  patacon: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.68 }),
  tomato: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 }),
  onion: new THREE.MeshStandardMaterial({ color: 0xa21caf, roughness: 0.4 }),
  spoon: new THREE.MeshStandardMaterial({ color: 0x926238, roughness: 0.72 }),
  board: new THREE.MeshStandardMaterial({ ...texWood, color: 0xc89d6c, roughness: 0.68 }),
  leaf: new THREE.MeshStandardMaterial({ map: makeLeafTex(), roughness: 0.56, side: THREE.DoubleSide }),
  bubble: new THREE.MeshStandardMaterial({ color: 0xffe4a0, roughness: 0.16, transparent: true, opacity: 0.68 }),
};

function shadowed(o) { o.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; }
function contact(r, op = 0.75) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2),
    new THREE.MeshBasicMaterial({ map: aoShadowTex, transparent: true, opacity: op, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.004; return m;
}

/* ───────────── mesa ───────────── */
const table = new THREE.Mesh(new THREE.PlaneGeometry(36, 26), M.table);
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

/* ───────────── geometría de Mojarra 3D ───────────── */
function makeMojarra(cookFactor = 0) {
  const g = new THREE.Group();
  const matBody = M.fishRaw.clone();
  const rawC = new THREE.Color(0x9aa9b2);
  const goldC = new THREE.Color(0xd17a22);
  const burnC = new THREE.Color(0x2d180a);
  if (cookFactor <= 1) matBody.color.lerpColors(rawC, goldC, cookFactor);
  else matBody.color.lerpColors(goldC, burnC, clamp(cookFactor - 1, 0, 1));
  matBody.roughness = lerp(0.36, 0.68, clamp(cookFactor, 0, 1));

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.56, 28, 18), matBody);
  body.scale.set(1.55, 0.34, 0.74);
  g.add(body);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.44, 4), M.fishFin);
  tail.rotation.z = Math.PI / 2; tail.scale.set(0.25, 1, 1.35); tail.position.set(-0.98, 0, 0);
  g.add(tail);

  const dorsal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.24), M.fishFin);
  dorsal.position.set(-0.08, 0.04, -0.42); dorsal.rotation.y = -0.18;
  g.add(dorsal);

  for (const cx of [-0.28, 0.0, 0.28]) {
    const cut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.56), M.fishCut);
    cut.position.set(cx, 0.11, 0); cut.rotation.y = 0.28;
    g.add(cut);
  }
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), M.salt);
  eyeW.position.set(0.58, 0.12, 0.16);
  const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), M.iron);
  eyeB.position.set(0.61, 0.14, 0.17);
  g.add(eyeW, eyeB);
  g.userData.matBody = matBody;
  return g;
}

/* ───────────── cuencos de ingredientes ───────────── */
const ING = [
  { id: 'mojarra', name: 'Mojarra fresca', need: 1, unit: 'pieza' },
  { id: 'limon', name: 'Limón y sal', need: 2, unit: 'porc.' },
  { id: 'arroz', name: 'Arroz con coco', need: 2, unit: 'porc.' },
  { id: 'patacones', name: 'Patacones', need: 2, unit: 'porc.' },
  { id: 'ensalada', name: 'Ensalada criolla', need: 1, unit: 'porc.' },
];
ING.forEach((g) => (g.have = 0));
const bowlsG = new THREE.Group(); scene.add(bowlsG);
const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), M.linen);
cloth.rotation.x = -Math.PI / 2; cloth.position.y = 0.012; cloth.receiveShadow = true; bowlsG.add(cloth);

const bowlGeo = new THREE.LatheGeometry([[0, 0], [0.34, 0], [0.57, 0.25], [0.61, 0.33], [0.63, 0.345], [0.6, 0.35], [0.55, 0.3], [0.5, 0.22], [0.3, 0.07], [0, 0.055]].map((p) => new THREE.Vector2(p[0], p[1])), 56);

for (const ing of ING) {
  const g = new THREE.Group(); ing.group = g; ing.items = [];
  g.add(contact(1.0, 0.75), new THREE.Mesh(bowlGeo, M.clay));
  const inner = new THREE.Group(); g.add(inner); ing.inner = inner;
  if (ing.id === 'mojarra') {
    const f = makeMojarra(0); f.scale.setScalar(0.55); f.position.y = 0.24; f.rotation.y = 0.4;
    inner.add(f); ing.items.push(f);
  } else if (ing.id === 'limon') {
    [[-0.16, 0.22, 0.06], [0.16, 0.22, -0.08]].forEach((p, idx) => {
      const lm = new THREE.Group();
      lm.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.lime));
      const pulp = new THREE.Mesh(new THREE.CircleGeometry(0.17, 18), M.limePulp);
      pulp.rotation.x = Math.PI / 2; lm.add(pulp);
      lm.position.set(...p); lm.rotation.set(0.3, idx * 1.4, 0.2);
      inner.add(lm); ing.items.push(lm);
    });
  } else if (ing.id === 'arroz') {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.46, 26, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.rice);
    m.scale.set(1, 0.45, 1); m.position.y = 0.16; inner.add(m); ing.items.push(m);
  } else if (ing.id === 'patacones') {
    [[-0.14, 0.2, 0.06], [0.16, 0.22, -0.07], [0.02, 0.3, 0.02]].forEach((p, idx) => {
      const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 20), M.patacon);
      pt.position.set(...p); pt.rotation.set(rnd(-0.2, 0.2), idx, rnd(-0.2, 0.2));
      inner.add(pt); ing.items.push(pt);
    });
  } else if (ing.id === 'ensalada') {
    for (let i = 0; i < 6; i++) {
      const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 16), i % 2 ? M.tomato : M.onion);
      tm.position.set(rnd(-0.22, 0.22), 0.18 + (i % 3) * 0.04, rnd(-0.22, 0.22));
      tm.rotation.set(rnd(-0.3, 0.3), rnd(3), rnd(-0.3, 0.3));
      inner.add(tm); ing.items.push(tm);
    }
  }
  shadowed(g); bowlsG.add(g);
  const el = document.createElement('div'); el.className = 'lbl'; $('#labels').appendChild(el); ing.label = el;
  const li = document.createElement('li'); $('#inglist').appendChild(li); ing.li = li;
}

/* ───────────── caldero de hierro ───────────── */
const PR = 1.75, PY0 = 0.12, PH = 0.62;
const pailaG = new THREE.Group(); scene.add(pailaG);
const trivet = new THREE.Group(); scene.add(trivet);
{
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(PR * Math.sin(a), PY0 + PH * (1 - Math.cos(a)))); }
  pts.push(new THREE.Vector2(1.81, 0.755), new THREE.Vector2(1.85, 0.75), new THREE.Vector2(1.85, 0.72));
  for (let i = 16; i >= 0; i--) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(1.82 * Math.sin(a), 0.05 + 0.66 * (1 - Math.cos(a)))); }
  pailaG.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 72), M.ironPan));
  for (const s of [-1, 1]) {
    const hd = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 24, Math.PI), M.brass);
    hd.rotation.set(-Math.PI / 2, 0, 0); const piv = new THREE.Group(); piv.add(hd);
    piv.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; piv.position.set(s * 1.81, 0.71, 0);
    pailaG.add(piv);
  }
  shadowed(pailaG);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.07, 10, 48), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; trivet.add(ring);
  for (let i = 0; i < 3; i++) { const leg = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.12, 0.16, 2, 0.03), M.iron); const a = i * 2.094 + 0.5; leg.position.set(Math.cos(a) * 1.55, 0.07, Math.sin(a) * 1.55); leg.rotation.y = -a; trivet.add(leg); }
  shadowed(trivet); trivet.add(contact(2.7, 0.8));
}
pailaG.position.y = 0.1;

const mixG = new THREE.Group(); pailaG.add(mixG);
const oilDisc = new THREE.Mesh(new THREE.CircleGeometry(1.42, 64).rotateX(-Math.PI / 2), M.oil);
oilDisc.position.y = 0.34; oilDisc.receiveShadow = true; mixG.add(oilDisc);

const fishInPan = makeMojarra(0);
fishInPan.position.set(0, 0.38, 0);
fishInPan.scale.setScalar(1.08);
fishInPan.visible = false;
shadowed(fishInPan);
mixG.add(fishInPan);

const panSidePieces = [];
const bubbles = [];
for (let i = 0; i < 18; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8, 0, 6.283, 0, Math.PI / 2), M.bubble); b.visible = false; b.userData.t = rnd(); mixG.add(b); bubbles.push(b); }
const steamMat = new THREE.SpriteMaterial({ map: softDot, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const steams = [];
for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(steamMat.clone()); s.userData.t = i / 12; s.visible = false; scene.add(s); steams.push(s); }

const spoon = new THREE.Group();
{
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.04, 0.55, 2, 0.02), M.spoon);
  const hnd = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 2.4, 12), M.spoon); hnd.rotation.x = Math.PI / 2; hnd.position.z = 1.4;
  spoon.add(head, hnd); spoon.rotation.order = 'YXZ'; spoon.rotation.set(-0.42, -0.65, 0);
  shadowed(spoon); spoon.visible = false; pailaG.add(spoon);
}
const spoonTarget = V3(0.5, 0.45, 0.4);

/* ───────────── tabla + hoja de plátano ───────────── */
const boardG = new THREE.Group(); boardG.visible = false; scene.add(boardG);
const BW = 4.6, BD = 3.1, BTOP = 0.16;
{
  const b = new THREE.Mesh(new RoundedBoxGeometry(BW, 0.14, BD, 4, 0.06), M.board); b.position.y = 0.08;
  const lg = new THREE.PlaneGeometry(4.3, 2.7, 50, 24), p = lg.attributes.position;
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
const servedItems = [];

/* ───────────── estado y layout ───────────── */
const CAM_ING = { pos: V3(0, 11.4, 7.6), look: V3(0.6, 0.1, 0.35) };
const CAM_COOK = { pos: V3(0, 7.2, 5.2), look: V3(0.55, 0.35, 0.05) };
const CAM_SERVE = { pos: V3(0, 6.2, 5.4), look: V3(0.5, 0.15, 0.1) };
const camPos = CAM_ING.pos.clone(), camLook = CAM_ING.look.clone(), camTarget = { pos: CAM_ING.pos.clone(), look: CAM_ING.look.clone() };
const S = { phase: 'intro', started: false, cook: 0, scorch: 0, stir: 0, busy: false, muted: false, served: 0 };

const BASE_POS = [V3(-1.35, 0, -2.55), V3(0.35, 0, -2.65), V3(1.95, 0, -2.3), V3(-3.0, 0, -1.15), V3(-3.1, 0, 0.75)];
let aspect = 1;
function layout() {
  aspect = innerWidth / innerHeight;
  camera.aspect = aspect; camera.updateProjectionMatrix();
  const port = aspect < 0.9;
  CAM_ING.pos.set(0, port ? 13.8 : 11.4, port ? 8.6 : 7.6);
  CAM_ING.look.set(port ? 0 : 0.7, 0.1, port ? 1.15 : 0.35);
  CAM_COOK.pos.set(0, port ? 8.6 : 7.2, port ? 6.4 : 5.2);
  CAM_COOK.look.set(port ? 0 : 0.65, 0.35, port ? 0.95 : 0.05);
  CAM_SERVE.pos.set(0, port ? 7.8 : 6.2, port ? 6.6 : 5.4);
  CAM_SERVE.look.set(port ? 0 : 0.6, 0.15, port ? 0.9 : 0.1);
  if (S.phase === 'intro' || S.phase === 'ing') { camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look); }
  const xs = port ? 0.78 : 1, zs = port ? 0.85 : 1;
  ING.forEach((g, i) => g.group.position.set(BASE_POS[i].x * xs, 0, BASE_POS[i].z * zs));
  cloth.position.set(-0.55 * xs, 0.012, -0.95 * zs);
  cloth.scale.set(6.5 * xs, 5.2 * zs, 1);
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', layout);

/* ───────────── sonido WebAudio ───────────── */
let AC = null, sizzleGain = null, sizzleFilter = null;
function initAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  const buf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
  sizzleFilter = AC.createBiquadFilter(); sizzleFilter.type = 'bandpass'; sizzleFilter.frequency.value = 1800; sizzleFilter.Q.value = 0.85;
  sizzleGain = AC.createGain(); sizzleGain.gain.value = 0;
  src.connect(sizzleFilter).connect(sizzleGain).connect(AC.destination); src.start();
}
function playSound(type) {
  if (S.muted || !AC) return;
  const now = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
  o.connect(g).connect(AC.destination);
  if (type === 'drop') { o.type = 'triangle'; o.frequency.setValueAtTime(240, now); o.frequency.exponentialRampToValueAtTime(110, now + 0.14); g.gain.setValueAtTime(0.16, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.16); o.start(now); o.stop(now + 0.17); }
  else if (type === 'ding') { o.type = 'sine'; o.frequency.setValueAtTime(880, now); o.frequency.setValueAtTime(1174, now + 0.09); g.gain.setValueAtTime(0.14, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.45); o.start(now); o.stop(now + 0.46); }
}

/* ───────────── UI ───────────── */
function syncUI() {
  ING.forEach((g) => {
    g.label.innerHTML = `${g.name}<b>${g.have}/${g.need}</b>`;
    g.label.classList.toggle('full', g.have >= g.need);
    g.li.innerHTML = `<span>${g.name}</span><span>${g.have}/${g.need} ${g.unit}</span>`;
    g.li.classList.toggle('ok', g.have >= g.need);
  });
  const allIng = ING.every((g) => g.have >= g.need);
  const steps = document.querySelectorAll('#steps li');
  steps.forEach((li) => {
    const s = li.dataset.s;
    li.className = s === S.phase ? 'on' : ((s === 'ing' && S.phase !== 'ing') || (s === 'cook' && S.phase === 'serve') ? 'ok' : '');
  });
  const btn = $('#btn');
  if (S.phase === 'ing') {
    btn.textContent = 'Encender el fogón'; btn.disabled = !allIng || S.busy;
    $('#hint').textContent = allIng ? 'Todo listo en el caldero. ¡Enciende el fogón!' : 'Toca cada cuenco para echarlo al caldero.';
  } else if (S.phase === 'cook') {
    btn.textContent = 'Emplatar en hoja'; btn.disabled = S.cook < 0.35;
    $('#hint').textContent = 'Mueve la espátula dentro del caldero para dorar parejo sin quemar.';
  } else if (S.phase === 'serve') {
    btn.textContent = 'Servir plato'; btn.disabled = S.served < 1 || S.busy;
    $('#hint').textContent = S.served === 0 ? 'Toca la hoja de plátano para emplatar la mojarra.' : '¡Plato servido con sabor de Bocachica!';
  }
}

async function addIng(ing) {
  if (S.phase !== 'ing' || S.busy || ing.have >= ing.need) return;
  S.busy = true; ing.have++; syncUI(); initAudio(); playSound('drop');
  const start = ing.group.position.clone().add(V3(0, 0.35, 0));
  const end = pailaG.position.clone().add(V3(rnd(-0.4, 0.4), 0.45, rnd(-0.4, 0.4)));
  const flying = ing.id === 'mojarra' ? makeMojarra(0) : new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), ing.id === 'limon' ? M.lime : ing.id === 'arroz' ? M.rice : ing.id === 'patacones' ? M.patacon : M.tomato);
  if (ing.id === 'mojarra') flying.scale.setScalar(0.65);
  scene.add(shadowed(flying));
  await tween(0.45, (t) => {
    flying.position.lerpVectors(start, end, t);
    flying.position.y += Math.sin(t * Math.PI) * 1.65;
    flying.rotation.y = t * 4;
  });
  scene.remove(flying);
  if (ing.id === 'mojarra') {
    fishInPan.visible = true;
    ing.group.visible = false;
    ing.label.style.opacity = '0';
  } else {
    const p = flying.clone();
    p.position.set(rnd(-0.85, 0.85), 0.38, rnd(-0.7, 0.7));
    mixG.add(p); panSidePieces.push(p);
    if (ing.have >= ing.need) {
      ing.group.visible = false;
      ing.label.style.opacity = '0';
    }
  }
  S.busy = false; syncUI();
}

async function toCook() {
  if (S.phase !== 'ing' || S.busy) return;
  S.phase = 'cook'; S.cook = 0; S.scorch = 0; syncUI();
  $('#labels').style.opacity = '0';
  $('#gauge').classList.remove('hide');
  spoon.visible = true;
  camTarget.pos.copy(CAM_COOK.pos); camTarget.look.copy(CAM_COOK.look);
  await tween(0.6, (t) => { bowlsG.position.y = -t * 0.2; });
  bowlsG.visible = false;
}

async function toServe() {
  if (S.phase !== 'cook' || S.busy) return;
  S.busy = true; S.phase = 'serve'; syncUI();
  $('#gauge').classList.add('hide');
  $('#warn').classList.remove('on');
  spoon.visible = false;
  camTarget.pos.copy(CAM_SERVE.pos); camTarget.look.copy(CAM_SERVE.look);
  boardG.visible = true; boardG.position.set(0, -0.5, 0);
  await tween(0.75, (t) => {
    pailaG.position.x = -t * 5.2; trivet.position.x = -t * 5.2;
    boardG.position.y = lerp(-0.5, 0, easeOut(t));
  });
  pailaG.visible = trivet.visible = false;
  S.busy = false; syncUI();
}

function plateDish() {
  if (S.phase !== 'serve' || S.served >= 1 || S.busy) return;
  S.served = 1; playSound('ding');
  const f = makeMojarra(clamp(S.cook * 1.18, 0.4, 1.8));
  f.position.set(-0.25, BTOP + 0.22, 0.05); f.rotation.y = 0.14; f.scale.setScalar(1.25);
  boardG.add(shadowed(f)); servedItems.push(f);

  const rice = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.rice);
  rice.scale.set(1, 0.55, 1); rice.position.set(1.05, BTOP + 0.02, -0.42);
  boardG.add(shadowed(rice)); servedItems.push(rice);

  [[0.95, 0.45], [1.35, 0.25]].forEach(([px, pz]) => {
    const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.07, 20), M.patacon);
    pt.position.set(px, BTOP + 0.05, pz);
    boardG.add(shadowed(pt)); servedItems.push(pt);
  });

  const sal = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.12, 18), M.lime);
  sal.position.set(-1.35, BTOP + 0.06, -0.45);
  boardG.add(shadowed(sal)); servedItems.push(sal);
  syncUI();
}

function finishGame() {
  if (S.phase !== 'serve' || S.served < 1) return;
  const inZone = S.cook >= 0.615 && S.cook <= 0.77;
  const stars = inZone && S.scorch < 0.4 ? 3 : S.cook >= 0.45 && S.cook <= 0.88 ? 2 : 1;
  $('#stars').innerHTML = '★'.repeat(stars) + '<i>★</i>'.repeat(3 - stars);
  $('#rtitle').textContent = stars === 3 ? '¡Mojarra de Bocachica!' : stars === 2 ? '¡Buen sabor costeño!' : 'Casi al punto';
  $('#rtext').textContent = stars === 3 ? 'Crujiente por fuera, jugosa por dentro y con arroz con coco al punto.' : S.cook > 0.77 ? 'Se pasó un poquito de fuego; recuerda mover la espátula.' : 'Le faltó un minutico de dorado en el caldero.';
  $('#result').classList.remove('hide');
  playSound('ding');
}

function resetGame() {
  $('#result').classList.add('hide');
  ING.forEach((g) => { g.have = 0; g.group.visible = true; g.label.style.opacity = '1'; });
  panSidePieces.forEach((m) => mixG.remove(m)); panSidePieces.length = 0;
  servedItems.forEach((m) => boardG.remove(m)); servedItems.length = 0;
  fishInPan.visible = false;
  pailaG.visible = trivet.visible = true; pailaG.position.set(0, 0.1, 0); trivet.position.set(0, 0, 0);
  bowlsG.visible = true; bowlsG.position.y = 0;
  boardG.visible = false;
  $('#labels').style.opacity = '1';
  $('#gauge').classList.add('hide');
  S.phase = 'ing'; S.cook = 0; S.scorch = 0; S.stir = 0; S.served = 0; S.busy = false;
  camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look);
  syncUI();
}

/* ───────────── interacción raycast ───────────── */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), hitPlane = new THREE.Plane(V3(0, 1, 0), -0.4), hitPt = V3();
let dragging = false, lastPtr = V3();
canvas.addEventListener('pointerdown', (e) => {
  initAudio();
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  if (S.phase === 'ing') {
    for (const ing of ING) {
      if (ing.group.visible && ray.intersectObject(ing.group, true).length) { addIng(ing); return; }
    }
  } else if (S.phase === 'cook') {
    dragging = true;
    if (ray.ray.intersectPlane(hitPlane, hitPt)) lastPtr.copy(hitPt);
  } else if (S.phase === 'serve') {
    if (ray.intersectObject(boardG, true).length) plateDish();
  }
});
canvas.addEventListener('pointermove', (e) => {
  if (S.phase !== 'cook') return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  if (ray.ray.intersectPlane(hitPlane, hitPt)) {
    const r = Math.hypot(hitPt.x, hitPt.z);
    if (r < 1.35) {
      spoonTarget.set(hitPt.x, 0.45, hitPt.z);
      if (dragging || r < 1.15) {
        const d = hitPt.distanceTo(lastPtr);
        S.stir = clamp(S.stir + d * 0.42, 0, 1);
        lastPtr.copy(hitPt);
      }
    }
  }
});
addEventListener('pointerup', () => (dragging = false));

$('#start').onclick = () => { initAudio(); S.started = true; S.phase = 'ing'; $('#intro').classList.add('hide'); syncUI(); };
$('#btn').onclick = () => { if (S.phase === 'ing') toCook(); else if (S.phase === 'cook') toServe(); else finishGame(); };
$('#again').onclick = resetGame;
$('#snd').onclick = () => { S.muted = !S.muted; $('#snd').classList.toggle('off', S.muted); };

manager.onLoad = () => { $('#loading').textContent = 'Listo para cocinar'; };
layout(); syncUI();

/* ───────────── bucle principal ───────────── */
let lastT = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  for (let i = tweens.length - 1; i >= 0; i--) {
    const w = tweens[i]; w.t += dt / w.d;
    if (w.t >= 1) { w.fn(1); w.res(); tweens.splice(i, 1); } else w.fn(w.ease(w.t));
  }
  camPos.lerp(camTarget.pos, 1 - Math.exp(-dt * 4.2));
  camLook.lerp(camTarget.look, 1 - Math.exp(-dt * 4.2));
  camera.position.copy(camPos); camera.lookAt(camLook);

  if (S.phase === 'cook') {
    S.cook = clamp(S.cook + dt * 0.068, 0, 1);
    S.stir = Math.max(0, S.stir - dt * 0.52);
    if (S.stir < 0.25 && S.cook > 0.25) S.scorch = clamp(S.scorch + dt * 0.28, 0, 1);
    else S.scorch = Math.max(0, S.scorch - dt * 0.45);
    $('#warn').classList.toggle('on', S.scorch > 0.35);
    $('#marker').style.left = `${S.cook * 100}%`;
    fireLight.intensity = 2.6 + Math.sin(now * 0.015) * 0.5;
    fireLight.position.set(0, 0.15, 0);
    spoon.position.lerp(spoonTarget, 1 - Math.exp(-dt * 12));
    if (fishInPan.userData.matBody) {
      const f = clamp(S.cook * 1.3, 0, 1.9);
      const rawC = new THREE.Color(0x9aa9b2), goldC = new THREE.Color(0xd17a22), burnC = new THREE.Color(0x2d180a);
      if (f <= 1) fishInPan.userData.matBody.color.lerpColors(rawC, goldC, f);
      else fishInPan.userData.matBody.color.lerpColors(goldC, burnC, f - 1);
    }
    bubbles.forEach((b) => {
      b.visible = true; b.userData.t = (b.userData.t + dt * 1.4) % 1;
      const t = b.userData.t, ang = b.userData.t * 25 + bubbles.indexOf(b);
      const rad = 0.25 + (bubbles.indexOf(b) % 5) * 0.22;
      b.position.set(Math.cos(ang) * rad, 0.34 + Math.sin(t * Math.PI) * 0.05, Math.sin(ang) * rad);
      b.scale.setScalar(0.03 + Math.sin(t * Math.PI) * 0.035);
    });
    steams.forEach((s) => {
      s.visible = true; s.userData.t = (s.userData.t + dt * 0.38) % 1;
      const t = s.userData.t;
      s.position.set(Math.sin(t * 6 + steams.indexOf(s)) * 0.35, 0.5 + t * 2.2, Math.cos(t * 5) * 0.25);
      s.scale.setScalar(0.6 + t * 1.2);
      s.material.opacity = Math.sin(t * Math.PI) * 0.24;
    });
    if (sizzleGain) sizzleGain.gain.setTargetAtTime(S.muted ? 0 : 0.04 + S.stir * 0.05, AC.currentTime, 0.08);
    syncUI();
  } else {
    fireLight.intensity = 0;
    bubbles.forEach((b) => (b.visible = false));
    steams.forEach((s) => (s.visible = false));
    if (sizzleGain) sizzleGain.gain.setTargetAtTime(0, AC.currentTime, 0.08);
  }

  if (S.phase === 'ing') {
    const p = V3();
    ING.forEach((g) => {
      if (!g.group.visible) return;
      p.copy(g.group.position).add(V3(0, 0.62, 0)).project(camera);
      g.label.style.left = `${(p.x * 0.5 + 0.5) * innerWidth}px`;
      g.label.style.top = `${(-p.y * 0.5 + 0.5) * innerHeight}px`;
    });
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);
