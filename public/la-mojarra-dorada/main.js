import * as THREE from 'three';
import { RGBELoader } from '../la-paila-dulce/vendor/RGBELoader.js';
import { RoundedBoxGeometry } from '../la-paila-dulce/vendor/RoundedBoxGeometry.js';

const $ = (s) => document.querySelector(s);
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
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
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const MAXANI = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a110b);
const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 80);

const sun = new THREE.DirectionalLight(0xfff1dc, 2.5);
sun.position.set(-5, 11, -4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025; sun.shadow.radius = 5;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a2414, 0.4));
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
  x.fillStyle = '#2e5d20'; x.fillRect(0, 0, 512, 512);
  x.fillStyle = '#4a7a34'; x.fillRect(0, 248, 512, 16);
  for (let i = 0; i < 72; i++) {
    const u = i * 7 + rnd(-2, 2);
    x.strokeStyle = `rgba(18,44,12,${rnd(0.2, 0.45)})`; x.lineWidth = rnd(1, 2.2);
    x.beginPath(); x.moveTo(u, 248); x.lineTo(u + 16, 0); x.moveTo(u, 264); x.lineTo(u + 16, 512); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

function makeFishTex(fried = false) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 512);
  if (!fried) {
    g.addColorStop(0, '#3e5463'); g.addColorStop(0.32, '#8fa6b3'); g.addColorStop(0.68, '#d4dde2'); g.addColorStop(1, '#f2f5f7');
  } else {
    g.addColorStop(0, '#78360b'); g.addColorStop(0.35, '#bd6214'); g.addColorStop(0.75, '#df8a27'); g.addColorStop(1, '#eba944');
  }
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let row = 0; row < 26; row++) {
    for (let col = 0; col < 48; col++) {
      const cx = col * 22 + (row % 2) * 11, cy = row * 20 + 10;
      x.strokeStyle = fried ? 'rgba(62,20,4,0.45)' : 'rgba(50,68,82,0.32)';
      x.lineWidth = 2;
      x.beginPath(); x.arc(cx, cy, 12, -Math.PI * 0.42, Math.PI * 0.42); x.stroke();
    }
  }
  x.strokeStyle = fried ? 'rgba(65,24,6,0.55)' : 'rgba(40,55,65,0.45)';
  x.lineWidth = 5;
  x.beginPath(); x.arc(690, 256, 130, Math.PI * 0.72, Math.PI * 1.28); x.stroke();
  for (const cx of [360, 465, 570]) {
    x.strokeStyle = fried ? '#3d1503' : '#9c4b4b';
    x.lineWidth = 18; x.lineCap = 'round';
    x.beginPath(); x.moveTo(cx - 24, 105); x.lineTo(cx + 28, 395); x.stroke();
    x.strokeStyle = fried ? '#f3cfa0' : '#f2d9d9';
    x.lineWidth = 7;
    x.beginPath(); x.moveTo(cx - 20, 112); x.lineTo(cx + 24, 388); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

function makePataconTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 22, 128, 128, 126);
  g.addColorStop(0, '#f4c644'); g.addColorStop(0.75, '#d68f16'); g.addColorStop(1, '#8c4e08');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 240; i++) {
    x.fillStyle = `rgba(102,52,6,${rnd(0.12, 0.3)})`;
    x.fillRect(rnd(256), rnd(256), rnd(4, 14), rnd(1, 3));
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

function makeLimeTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#ecf7d2'; x.fillRect(0, 0, 256, 256);
  x.fillStyle = '#9fe22b';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    x.beginPath(); x.moveTo(128, 128); x.arc(128, 128, 110, a + 0.06, a + Math.PI / 4 - 0.06); x.closePath(); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

function makeGrainTex(baseHex, fleckHex, darkHex, count = 450) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = baseHex; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < count; i++) {
    x.fillStyle = i % 3 === 0 ? darkHex : fleckHex;
    x.globalAlpha = rnd(0.18, 0.52);
    x.beginPath(); x.ellipse(rnd(256), rnd(256), rnd(1.5, 5), rnd(1, 3), rnd(3.14), 0, Math.PI * 2); x.fill();
  }
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

function makeCitrusPeelTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#367c18'; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 650; i++) {
    x.fillStyle = i % 2 ? '#275e10' : '#58a82b';
    x.beginPath(); x.arc(rnd(256), rnd(256), rnd(1, 2.6), 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAXANI; return t;
}

const texFishRaw = makeFishTex(false);
const texFishFried = makeFishTex(true);
const texPatacon = makePataconTex();
const texLime = makeLimeTex();
const texLimePeel = makeCitrusPeelTex();
const texPanela = makeGrainTex('#7c3d13', '#b86c32', '#471e05', 520);
const texGarlic = makeGrainTex('#efe4cc', '#ffffff', '#cbb894', 280);
const texFlour = makeGrainTex('#f7f2e4', '#ffffff', '#e2d8be', 360);
const texRaisin = makeGrainTex('#2d1620', '#4f2838', '#14080d', 400);

const M = {
  table: new THREE.MeshStandardMaterial({ ...texWood, roughness: 0.85, metalness: 0, envMapIntensity: 0.55 }),
  linen: new THREE.MeshStandardMaterial({ ...texLinen, roughness: 0.95, metalness: 0, envMapIntensity: 0.4 }),
  clay: new THREE.MeshStandardMaterial({ color: 0xefe3ce, roughness: 0.42, metalness: 0.04, envMapIntensity: 0.9 }),
  porcelain: new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.16, metalness: 0.02, envMapIntensity: 1.0 }),
  ironPan: new THREE.MeshStandardMaterial({ color: 0x262425, roughness: 0.44, metalness: 0.82, envMapIntensity: 1.2 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc29348, roughness: 0.34, metalness: 0.88, envMapIntensity: 1.2 }),
  iron: new THREE.MeshStandardMaterial({ color: 0x222020, roughness: 0.72, metalness: 0.75 }),
  cocoMilk: new THREE.MeshStandardMaterial({ color: 0xfaf7ef, roughness: 0.18, metalness: 0.04 }),
  panela: new THREE.MeshStandardMaterial({ map: texPanela, bumpMap: texPanela, bumpScale: 0.05, roughness: 0.78 }),
  salt: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 }),
  raisin: new THREE.MeshStandardMaterial({ map: texRaisin, bumpMap: texRaisin, bumpScale: 0.045, roughness: 0.55 }),
  riceWhite: new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.65 }),
  riceTitote: new THREE.MeshStandardMaterial({ color: 0x6e421e, roughness: 0.68 }),
  fishRaw: new THREE.MeshStandardMaterial({ map: texFishRaw, bumpMap: texFishRaw, bumpScale: 0.03, roughness: 0.3, metalness: 0.18 }),
  fishFried: new THREE.MeshStandardMaterial({ map: texFishFried, bumpMap: texFishFried, bumpScale: 0.06, roughness: 0.55, metalness: 0.02 }),
  fishFinRaw: new THREE.MeshStandardMaterial({ color: 0x7b8d96, roughness: 0.55, side: THREE.DoubleSide }),
  fishFinFried: new THREE.MeshStandardMaterial({ color: 0xb85f14, roughness: 0.65, side: THREE.DoubleSide }),
  lime: new THREE.MeshStandardMaterial({ map: texLimePeel, bumpMap: texLimePeel, bumpScale: 0.03, roughness: 0.48 }),
  limePulp: new THREE.MeshStandardMaterial({ map: texLime, bumpMap: texLime, bumpScale: 0.02, roughness: 0.22 }),
  garlic: new THREE.MeshStandardMaterial({ map: texGarlic, bumpMap: texGarlic, bumpScale: 0.025, roughness: 0.68 }),
  flour: new THREE.MeshStandardMaterial({ map: texFlour, bumpMap: texFlour, bumpScale: 0.02, roughness: 0.96 }),
  patacon: new THREE.MeshStandardMaterial({ map: texPatacon, bumpMap: texPatacon, bumpScale: 0.04, roughness: 0.65 }),
  spoonWood: new THREE.MeshStandardMaterial({ color: 0x926238, roughness: 0.72 }),
  board: new THREE.MeshStandardMaterial({ ...texWood, color: 0xc89d6c, roughness: 0.68 }),
  leaf: new THREE.MeshStandardMaterial({ map: makeLeafTex(), roughness: 0.52, side: THREE.DoubleSide }),
  bubble: new THREE.MeshStandardMaterial({ color: 0xffe8ad, roughness: 0.14, transparent: true, opacity: 0.75 }),
};

function shadowed(o) { o.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; }
function contact(r, op = 0.75) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2),
    new THREE.MeshBasicMaterial({ map: aoShadowTex, transparent: true, opacity: op, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.004; return m;
}

const table = new THREE.Mesh(new THREE.PlaneGeometry(36, 26), M.table);
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

/* ───────────── Mojarra anatómica 3D con volumen real (nunca hundida) ───────────── */
function makeMojarra(cookFactor = 0) {
  const g = new THREE.Group();
  const matBody = (cookFactor > 0.35 ? M.fishFried : M.fishRaw).clone();
  const matFin = (cookFactor > 0.35 ? M.fishFinFried : M.fishFinRaw).clone();
  const bodyGeo = new THREE.SphereGeometry(0.64, 36, 24);
  const pos = bodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = x / 0.64;
    const envZ = Math.pow(Math.max(0.08, 1 - Math.pow(nx, 2.1)), 0.72) * (nx < -0.55 ? 0.45 : 1.0);
    z *= envZ * 0.94;
    y *= 0.42 * (nx < -0.5 ? 0.55 : 1.0); // grosor real para verse completa sobre tabla y aceite
    x *= 1.55;
    pos.setXYZ(i, x, y, z);
  }
  bodyGeo.computeVertexNormals();
  g.add(new THREE.Mesh(bodyGeo, matBody));

  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0.06); tailShape.quadraticCurveTo(-0.34, 0.34, -0.52, 0.42);
  tailShape.quadraticCurveTo(-0.35, 0.08, -0.30, 0); tailShape.quadraticCurveTo(-0.35, -0.08, -0.52, -0.42);
  tailShape.quadraticCurveTo(-0.34, -0.34, 0, -0.06); tailShape.closePath();
  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008 });
  tailGeo.rotateX(Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, matFin); tail.position.set(-0.9, 0.02, 0); g.add(tail);

  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(-0.46, 0); dorsalShape.lineTo(-0.36, 0.28); dorsalShape.quadraticCurveTo(0.05, 0.32, 0.32, 0.14); dorsalShape.lineTo(0.36, 0); dorsalShape.closePath();
  const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, { depth: 0.02, bevelEnabled: false });
  dorsalGeo.rotateX(-Math.PI / 2);
  const dorsal = new THREE.Mesh(dorsalGeo, matFin); dorsal.position.set(-0.04, 0.04, -0.42); g.add(dorsal);

  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12 }));
  eyeW.scale.set(1, 0.65, 1); eyeW.position.set(0.64, 0.16, -0.14);
  const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.05 }));
  eyeB.scale.set(1, 0.65, 1); eyeB.position.set(0.65, 0.18, -0.14);
  g.add(eyeW, eyeB);
  g.userData.matBody = matBody;
  g.userData.matFin = matFin;
  return g;
}

/* ───────────── Patacón realista aplastado con bordes irregulares ───────────── */
function makePatacon(radius = 0.28) {
  const g = new THREE.IcosahedronGeometry(radius, 3);
  const p = g.attributes.position, v = V3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const ang = Math.atan2(v.z, v.x);
    const wave = 1 + 0.14 * Math.sin(ang * 7) + 0.08 * Math.cos(ang * 11);
    v.x *= wave; v.z *= wave; v.y *= 0.22;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g, M.patacon);
}

/* ───────────── Domo de arroz con granos instanciados ───────────── */
function makeRiceDome(radius = 0.44, height = 0.26, count = 420, white = false) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.92, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), white ? M.riceWhite : M.riceTitote);
  core.scale.set(1, height / radius, 1); g.add(core);
  const grainGeo = new THREE.SphereGeometry(0.024, 6, 5); grainGeo.scale(1.9, 0.75, 0.85);
  const im = new THREE.InstancedMesh(grainGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt(rnd()), th = rnd(Math.PI * 2);
    const y = Math.max(0.02, height * Math.sqrt(Math.max(0, 1 - (r / radius) ** 2)) + rnd(-0.01, 0.02));
    p.set(Math.cos(th) * r, y, Math.sin(th) * r);
    e.set(rnd(-0.5, 0.5), rnd(6.28), rnd(-0.5, 0.5)); q.setFromEuler(e); s.setScalar(rnd(0.85, 1.25));
    m4.compose(p, q, s); im.setMatrixAt(i, m4);
    const cVal = rnd();
    if (white) col.setRGB(lerp(0.88, 0.98, cVal), lerp(0.86, 0.96, cVal), lerp(0.8, 0.92, cVal));
    else col.setRGB(lerp(0.34, 0.64, cVal), lerp(0.19, 0.45, cVal), lerp(0.08, 0.26, cVal));
    im.setColorAt(i, col);
  }
  im.instanceMatrix.needsUpdate = true;
  if (im.instanceColor) im.instanceColor.needsUpdate = true;
  g.add(im);
  return g;
}

/* ───────────── Fábrica de modelos reales para volar e ir DENTRO de la olla ───────────── */
function makeIngPiece(id) {
  if (id === 'panela') {
    return new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.16, 0.24, 2, 0.03), M.panela);
  }
  if (id === 'sal') {
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), M.salt);
      c.position.set(rnd(-0.1, 0.1), rnd(0.04), rnd(-0.1, 0.1)); g.add(c);
    }
    return g;
  }
  if (id === 'leche1') {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.04, 18), M.cocoMilk);
    return d;
  }
  if (id === 'arroz_crudo') {
    return makeRiceDome(0.34, 0.18, 160, true);
  }
  if (id === 'pasas') {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const r = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), M.raisin);
      r.scale.set(1.4, 0.9, 1); r.position.set(rnd(-0.15, 0.15), rnd(0.04), rnd(-0.15, 0.15)); g.add(r);
    }
    return g;
  }
  if (id === 'limon') {
    const lm = new THREE.Group();
    lm.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.lime));
    const pulp = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), M.limePulp); pulp.rotation.x = Math.PI / 2; lm.add(pulp);
    return lm;
  }
  if (id === 'ajo') {
    const cl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), M.garlic);
    cl.scale.set(1.5, 0.85, 0.9); return cl;
  }
  if (id === 'harina') {
    const d = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.1, 14), M.flour); return d;
  }
  if (id === 'patacones') {
    return makePatacon(0.25);
  }
  return makeRiceDome(0.4, 0.22, 220, false);
}

/* ───────────── Definición de las 2 Recetas Reales ───────────── */
const RECIPES = {
  arroz: {
    num: 'Receta 1 de 2',
    title: 'Arroz con coco',
    steps: ['1. Primera leche al caldero', '2. Reduce a titoté', '3. Echa arroz y seca'],
    scale: ['Leche blanca', 'Reduciendo', 'Titoté dorado', 'Quemado'],
    btn: ['Reducir a titoté', 'Echar arroz y segunda leche', 'Servir arroz con coco'],
    hintIng: 'Paso 1: Echa la 1.ª leche de coco, panela y sal al caldero limpio.',
    hintCook: 'Mueve la cuchara de palo sin parar: la leche blanca se reduce hasta dorarse en titoté.',
    hintServe: 'Toca Arroz lavado y Uvas pasas para echarlos directo DENTRO del caldero con el titoté.',
    ings: [
      { id: 'leche1', name: '1.ª leche de coco', need: 2, unit: 'tazas', role: 'base' },
      { id: 'panela', name: 'Panela en bloque', need: 1, unit: 'trozo', role: 'base' },
      { id: 'sal', name: 'Sal marina', need: 1, unit: 'cdita.', role: 'base' },
      { id: 'arroz_crudo', name: 'Arroz + 2.ª leche', need: 2, unit: 'tazas', role: 'finish' },
      { id: 'pasas', name: 'Uvas pasas', need: 1, unit: 'puñado', role: 'finish' },
    ],
  },
  mojarra: {
    num: 'Receta 2 de 2',
    title: 'Mojarra frita',
    steps: ['1. Adoba en tabla', '2. Fríe y voltea', '3. Emplata completo'],
    scale: ['Cruda', 'Dorando', 'Punto crocante', 'Quemada'],
    btn: ['Freír en caldero', 'Sacar al plato', 'Servir almuerzo'],
    hintIng: 'Paso 1: Toca Limón, Ajo/sal y Harina para adobar la mojarra entera en la tabla.',
    hintCook: 'Baña con aceite y presiona "Voltear mojarra" para dorar ambos lados sin quemarla.',
    hintServe: 'Toca el plato y los cuencos de Arroz con coco y Patacones (recién fritos al lado) para emplatar.',
    ings: [
      { id: 'limon', name: 'Limón criollo', need: 2, unit: 'mitades', role: 'base' },
      { id: 'ajo', name: 'Ajo y sal marina', need: 2, unit: 'pizcas', role: 'base' },
      { id: 'harina', name: 'Harina ligera', need: 1, unit: 'toque', role: 'base' },
      { id: 'arroz_hecho', name: 'Arroz con coco', need: 1, unit: 'porc.', role: 'finish' },
      { id: 'patacones', name: 'Patacones', need: 1, unit: 'porc.', role: 'finish' },
    ],
  },
};

const bowlsG = new THREE.Group(); scene.add(bowlsG);
const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), M.linen);
cloth.rotation.x = -Math.PI / 2; cloth.position.y = 0.012; cloth.receiveShadow = true; bowlsG.add(cloth);
const bowlGeo = new THREE.LatheGeometry([[0, 0], [0.34, 0], [0.57, 0.25], [0.61, 0.33], [0.63, 0.345], [0.6, 0.35], [0.55, 0.3], [0.5, 0.22], [0.3, 0.07], [0, 0.055]].map((p) => new THREE.Vector2(p[0], p[1])), 56);

let activeIngs = [];
function buildBowls(recKey) {
  while (bowlsG.children.length > 1) bowlsG.remove(bowlsG.children[bowlsG.children.length - 1]);
  $('#labels').innerHTML = ''; $('#inglist').innerHTML = '';
  activeIngs = RECIPES[recKey].ings.map((d) => ({ ...d, have: 0 }));

  const posSet = [V3(-2.6, 0, -2.0), V3(-0.9, 0, -2.45), V3(0.9, 0, -2.4), V3(2.5, 0, -1.5), V3(-2.85, 0, -0.2)];
  const xs = aspect < 0.9 ? 0.78 : 1, zs = aspect < 0.9 ? 0.85 : 1;

  activeIngs.forEach((ing, i) => {
    const g = new THREE.Group(); ing.group = g;
    g.add(contact(0.95, 0.72), new THREE.Mesh(bowlGeo, M.clay));
    const inner = new THREE.Group(); g.add(inner);
    if (ing.id === 'leche1') {
      const d = new THREE.Mesh(new THREE.CircleGeometry(0.52, 32).rotateX(-Math.PI / 2), M.cocoMilk); d.position.y = 0.27; inner.add(d);
    } else if (ing.id === 'panela') {
      for (let k = 0; k < 3; k++) { const b = makeIngPiece('panela'); b.position.set(rnd(-0.12, 0.12), 0.22 + k * 0.04, rnd(-0.12, 0.12)); b.rotation.y = rnd(3); inner.add(b); }
    } else if (ing.id === 'sal') {
      const crystalGeo = new THREE.OctahedronGeometry(0.032, 0);
      const im = new THREE.InstancedMesh(crystalGeo, M.salt, 90);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
      for (let k = 0; k < 90; k++) {
        const r = 0.36 * Math.sqrt(rnd()), th = rnd(6.28);
        p.set(Math.cos(th) * r, 0.17 + (0.36 - r) * 0.22 + rnd(0.02), Math.sin(th) * r);
        e.set(rnd(6), rnd(6), rnd(6)); q.setFromEuler(e); s.setScalar(rnd(0.7, 1.35));
        m4.compose(p, q, s); im.setMatrixAt(k, m4);
      }
      im.instanceMatrix.needsUpdate = true; inner.add(im);
    } else if (ing.id === 'arroz_crudo') {
      const rd = makeRiceDome(0.42, 0.22, 220, true); rd.position.y = 0.12; inner.add(rd);
    } else if (ing.id === 'pasas') {
      for (let k = 0; k < 14; k++) { const r = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), M.raisin); r.scale.set(1.4, 0.9, 1); r.position.set(rnd(-0.24, 0.24), 0.16 + rnd(0.06), rnd(-0.24, 0.24)); inner.add(r); }
    } else if (ing.id === 'limon') {
      [[-0.16, 0.22, 0.06], [0.16, 0.22, -0.08]].forEach((p, idx) => { const lm = makeIngPiece('limon'); lm.position.set(...p); lm.rotation.set(0.3, idx * 1.4, 0.2); inner.add(lm); });
    } else if (ing.id === 'ajo') {
      for (let k = 0; k < 6; k++) { const cl = makeIngPiece('ajo'); cl.position.set(rnd(-0.2, 0.2), 0.18 + (k % 2) * 0.04, rnd(-0.2, 0.2)); inner.add(cl); }
    } else if (ing.id === 'harina') {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.flour); m.scale.set(1, 0.42, 1); m.position.y = 0.14; inner.add(m);
    } else if (ing.id === 'arroz_hecho') {
      const rd = makeRiceDome(0.44, 0.25, 280, false); rd.position.y = 0.12; inner.add(rd);
    } else if (ing.id === 'patacones') {
      [[-0.14, 0.2, 0.06], [0.16, 0.22, -0.07], [0.02, 0.28, 0.02]].forEach((p, idx) => { const pt = makePatacon(0.24); pt.position.set(...p); pt.rotation.y = idx; inner.add(pt); });
    }
    shadowed(g); g.position.set(posSet[i].x * xs, 0, posSet[i].z * zs); bowlsG.add(g);
    const el = document.createElement('div'); el.className = 'lbl'; $('#labels').appendChild(el); ing.label = el;
    const li = document.createElement('li'); $('#inglist').appendChild(li); ing.li = li;
  });
}

/* ───────────── tabla de adobo + caldero principal + sartén lateral de patacones + plato ───────────── */
const prepFish = makeMojarra(0); prepFish.position.set(0, 0.42, 0.55); prepFish.scale.setScalar(1.08); prepFish.rotation.y = 0.08; shadowed(prepFish);
const prepBoard = new THREE.Group();
{
  const b = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.12, 2.1, 4, 0.05), M.board); b.position.set(0, 0.06, 0.55);
  prepBoard.add(contact(2.2, 0.72), shadowed(b), prepFish);
}
scene.add(prepBoard);

const PR = 1.72, PY0 = 0.12, PH = 0.62;
const pailaG = new THREE.Group(); scene.add(pailaG);
const trivet = new THREE.Group(); scene.add(trivet);
{
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(PR * Math.sin(a), PY0 + PH * (1 - Math.cos(a)))); }
  pts.push(new THREE.Vector2(1.78, 0.755), new THREE.Vector2(1.82, 0.75), new THREE.Vector2(1.82, 0.72));
  for (let i = 16; i >= 0; i--) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(1.79 * Math.sin(a), 0.05 + 0.66 * (1 - Math.cos(a)))); }
  pailaG.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 72), M.ironPan));
  for (const s of [-1, 1]) {
    const hd = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 24, Math.PI), M.brass);
    hd.rotation.set(-Math.PI / 2, 0, 0); const piv = new THREE.Group(); piv.add(hd);
    piv.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; piv.position.set(s * 1.78, 0.71, 0); pailaG.add(piv);
  }
  shadowed(pailaG);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.07, 10, 48), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; trivet.add(ring);
  for (let i = 0; i < 3; i++) { const leg = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.12, 0.16, 2, 0.03), M.iron); const a = i * 2.094 + 0.5; leg.position.set(Math.cos(a) * 1.55, 0.07, Math.sin(a) * 1.55); leg.rotation.y = -a; trivet.add(leg); }
  shadowed(trivet); trivet.add(contact(2.7, 0.8));
}
pailaG.position.y = 0.1;

const mixG = new THREE.Group(); pailaG.add(mixG);
const liquidMat = M.cocoMilk.clone();
const liquidDisc = new THREE.Mesh(new THREE.CircleGeometry(1.34, 64).rotateX(-Math.PI / 2), liquidMat);
liquidDisc.position.y = 0.30; liquidDisc.receiveShadow = true; mixG.add(liquidDisc);

const fishInPan = makeMojarra(0); fishInPan.position.set(0, 0.48, 0); fishInPan.scale.setScalar(1.05); shadowed(fishInPan); mixG.add(fishInPan);
const inPotPieces = [];

// Sartén lateral de patacones AL LADO de la olla de la mojarra
const patPan = new THREE.Group(); patPan.visible = false;
{
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.82, 0.24, 36, 1, false), M.ironPan);
  rim.position.y = 0.12;
  const oil2 = new THREE.Mesh(new THREE.CircleGeometry(0.84, 32).rotateX(-Math.PI / 2), M.cocoMilk.clone());
  oil2.material.color.setHex(0xebb134); oil2.position.y = 0.25;
  patPan.add(contact(1.2, 0.7), shadowed(rim), oil2);
  [[-0.3, 0.26, -0.2], [0.28, 0.27, -0.15], [-0.05, 0.26, 0.3]].forEach(([px, py, pz]) => {
    const pt = makePatacon(0.26); pt.position.set(px, py, pz); patPan.add(shadowed(pt));
  });
}
patPan.position.set(-2.95, 0.05, 0.3);
scene.add(patPan);

const bubbles = [];
for (let i = 0; i < 20; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8, 0, 6.283, 0, Math.PI / 2), M.bubble); b.visible = false; b.userData.t = rnd(); mixG.add(b); bubbles.push(b); }
const steamMat = new THREE.SpriteMaterial({ map: softDot, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const steams = [];
for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(steamMat.clone()); s.userData.t = i / 12; s.visible = false; scene.add(s); steams.push(s); }

const spoon = new THREE.Group();
{
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.04, 0.48, 2, 0.02), M.spoonWood);
  const hnd = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 2.3, 12), M.spoonWood); hnd.rotation.x = Math.PI / 2; hnd.position.z = 1.3;
  spoon.add(head, hnd); spoon.rotation.order = 'YXZ'; spoon.rotation.set(-0.35, -0.55, 0);
  shadowed(spoon); spoon.visible = false; pailaG.add(spoon);
}
const spoonTarget = V3(0.5, 0.55, 0.4);

const boardG = new THREE.Group(); boardG.visible = false; scene.add(boardG);
const PTOP = 0.16;
{
  const plateGeo = new THREE.LatheGeometry([[0, 0], [1.45, 0], [1.95, 0.14], [2.15, 0.22], [2.12, 0.24], [1.85, 0.16], [1.4, 0.08], [0, 0.07]].map((p) => new THREE.Vector2(p[0], p[1])), 64);
  const plate = new THREE.Mesh(plateGeo, M.porcelain);
  const lg = new THREE.PlaneGeometry(3.1, 2.1, 40, 20), p = lg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), u = x / 1.55, v = y / 1.05;
    p.setY(i, v * 1.05 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 2.5)), 0.52));
    p.setZ(i, 0.01 + 0.02 * Math.abs(v));
  }
  lg.computeVertexNormals();
  const leaf = new THREE.Mesh(lg, M.leaf); leaf.rotation.x = -Math.PI / 2; leaf.rotation.z = 0.06; leaf.position.y = PTOP - 0.04;
  boardG.add(contact(2.6, 0.78), shadowed(plate), shadowed(leaf));
}
const servedItems = [];

/* ───────────── estado y layout ───────────── */
const CAM_ING = { pos: V3(0, 11.4, 7.6), look: V3(0.6, 0.1, 0.35) };
const CAM_COOK = { pos: V3(-0.35, 7.6, 5.8), look: V3(-0.15, 0.35, 0.05) };
const CAM_SERVE = { pos: V3(0, 6.2, 5.4), look: V3(0.5, 0.15, 0.1) };
const camPos = CAM_ING.pos.clone(), camLook = CAM_ING.look.clone(), camTarget = { pos: CAM_ING.pos.clone(), look: CAM_ING.look.clone() };

const S = { recipe: 'arroz', phase: 'intro', cook: 0, scorch: 0, stir: 0, flipped: false, busy: false, muted: false, plated: {} };
let aspect = 1;
function layout() {
  aspect = innerWidth / innerHeight;
  camera.aspect = aspect; camera.updateProjectionMatrix();
  const port = aspect < 0.9;
  CAM_ING.pos.set(0, port ? 14.0 : 11.4, port ? 8.8 : 7.6);
  CAM_ING.look.set(port ? 0 : 0.7, 0.1, port ? 1.15 : 0.35);
  CAM_COOK.pos.set(port ? 0 : -0.35, port ? 9.0 : 7.6, port ? 6.8 : 5.8);
  CAM_COOK.look.set(port ? 0 : -0.15, 0.35, port ? 0.95 : 0.05);
  CAM_SERVE.pos.set(0, port ? 7.8 : 6.2, port ? 6.6 : 5.4);
  CAM_SERVE.look.set(port ? 0 : 0.6, 0.15, port ? 0.9 : 0.1);
  if (S.phase === 'intro' || S.phase === 'ing') { camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look); }
  const xs = port ? 0.78 : 1, zs = port ? 0.85 : 1;
  cloth.position.set(-0.2 * xs, 0.012, -0.8 * zs);
  cloth.scale.set(7.4 * xs, 5.4 * zs, 1);
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', layout);

/* ───────────── WebAudio + Música de Cartagena (Cumbia / Bullerengue) ───────────── */
let AC = null, sizzleGain = null, musicGain = null, musicTimer = null, beatStep = 0;
function startCartagenaMusic() {
  if (!AC || musicTimer) return;
  const gaitaNotes = [293.66, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23];
  musicTimer = setInterval(() => {
    if (!AC || S.muted || AC.state !== 'running') return;
    const now = AC.currentTime;
    const step = beatStep % 16;
    // Tambor llamador / alegre en tiempos fuertes y síncopa costeña
    if (step % 4 === 0 || step % 8 === 6) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine';
      const baseF = step % 4 === 0 ? 128 : 175;
      o.frequency.setValueAtTime(baseF, now);
      o.frequency.exponentialRampToValueAtTime(54, now + 0.14);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.connect(g).connect(musicGain);
      o.start(now); o.stop(now + 0.17);
    }
    // Guache / maraca en contratiempos
    if (step % 2 === 1) {
      const len = Math.floor(AC.sampleRate * 0.045);
      const b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = AC.createBufferSource(); src.buffer = b;
      const hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3800;
      const g = AC.createGain(); g.gain.setValueAtTime(0.055, now);
      src.connect(hp).connect(g).connect(musicGain);
      src.start(now);
    }
    // Gaita caribeña suave
    if (step % 2 === 0) {
      const f = gaitaNotes[(beatStep >> 1) % gaitaNotes.length];
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.048, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      o.connect(g).connect(musicGain);
      o.start(now); o.stop(now + 0.29);
    }
    beatStep++;
  }, 190);
}
function initAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); startCartagenaMusic(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  const buf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
  const flt = AC.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 1850; flt.Q.value = 0.85;
  sizzleGain = AC.createGain(); sizzleGain.gain.value = 0;
  src.connect(flt).connect(sizzleGain).connect(AC.destination); src.start();
  musicGain = AC.createGain(); musicGain.gain.value = S.muted ? 0 : 0.75;
  musicGain.connect(AC.destination);
  startCartagenaMusic();
}
function playSound(type) {
  if (S.muted || !AC) return;
  const now = AC.currentTime;
  if (type === 'drop') {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(280, now); o.frequency.exponentialRampToValueAtTime(110, now + 0.15);
    g.gain.setValueAtTime(0.22, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    o.connect(g).connect(AC.destination); o.start(now); o.stop(now + 0.18);
  } else if (type === 'ignite') {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(90, now); o.frequency.exponentialRampToValueAtTime(220, now + 0.28);
    g.gain.setValueAtTime(0.18, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    o.connect(g).connect(AC.destination); o.start(now); o.stop(now + 0.35);
  } else if (type === 'pop') {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(rnd(520, 980), now); o.frequency.exponentialRampToValueAtTime(220, now + 0.045);
    g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    o.connect(g).connect(AC.destination); o.start(now); o.stop(now + 0.055);
  } else if (type === 'ding') {
    [880, 1174, 1396].forEach((freq, idx) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freq, now + idx * 0.08);
      g.gain.setValueAtTime(0.18, now + idx * 0.08); g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.42);
      o.connect(g).connect(AC.destination); o.start(now + idx * 0.08); o.stop(now + idx * 0.08 + 0.44);
    });
  }
}

/* ───────────── UI y flujo educativo ───────────── */
function syncUI() {
  const rec = RECIPES[S.recipe];
  $('#rec-num').textContent = rec.num;
  $('#rec-title').textContent = rec.title;
  $('#tab-arroz').classList.toggle('on', S.recipe === 'arroz');
  $('#tab-mojarra').classList.toggle('on', S.recipe === 'mojarra');

  const stepEls = document.querySelectorAll('#steps li');
  rec.steps.forEach((txt, i) => { if (stepEls[i]) stepEls[i].textContent = txt; });
  stepEls.forEach((li) => {
    const s = li.dataset.s;
    li.className = s === S.phase ? 'on' : ((s === 'ing' && S.phase !== 'ing') || (s === 'cook' && S.phase === 'serve') ? 'ok' : '');
  });

  const scaleSpans = $('#scale-lbl').querySelectorAll('span');
  rec.scale.forEach((txt, i) => { if (scaleSpans[i]) scaleSpans[i].textContent = txt; });

  activeIngs.forEach((g) => {
    const show = S.phase === 'ing' ? g.role === 'base' : S.phase === 'serve' ? g.role === 'finish' : false;
    g.label.innerHTML = `${g.name}<b>${g.have}/${g.need}</b>`;
    g.label.classList.toggle('full', g.have >= g.need);
    g.label.style.display = show && g.group.visible ? '' : 'none';
    g.li.innerHTML = `<span>${g.name}</span><span>${g.have}/${g.need} ${g.unit}</span>`;
    g.li.classList.toggle('ok', g.have >= g.need);
  });

  const baseDone = activeIngs.filter((g) => g.role === 'base').every((g) => g.have >= g.need);
  const finishDone = activeIngs.filter((g) => g.role === 'finish').every((g) => g.have >= g.need);
  const btn = $('#btn');
  const flipBtn = $('#flip-btn');

  if (S.recipe === 'mojarra' && S.phase === 'cook') {
    flipBtn.classList.remove('hide');
    flipBtn.disabled = S.flipped || S.busy;
    flipBtn.textContent = S.flipped ? 'Lado 2 dorando ✓' : 'Voltear mojarra (Lado 2)';
  } else {
    flipBtn.classList.add('hide');
  }

  if (S.phase === 'ing') {
    btn.textContent = rec.btn[0]; btn.disabled = !baseDone || S.busy;
    $('#hint').textContent = baseDone ? '¡Listo! Presiona para encender el fogón.' : rec.hintIng;
  } else if (S.phase === 'cook') {
    const canFinishCook = S.recipe === 'arroz' ? S.cook >= 0.42 : (S.cook >= 0.42 && S.flipped);
    btn.textContent = rec.btn[1]; btn.disabled = !canFinishCook || S.busy;
    $('#hint').textContent = S.recipe === 'mojarra' && !S.flipped && S.cook > 0.3
      ? '¡Ya doró el primer lado! Pulsa "Voltear mojarra" para dorar el otro lado.'
      : rec.hintCook;
  } else if (S.phase === 'serve') {
    const okServe = S.recipe === 'arroz' ? finishDone : finishDone && S.plated.fish;
    btn.textContent = rec.btn[2]; btn.disabled = !okServe || S.busy;
    $('#hint').textContent = okServe ? '¡Listo para servir y calificar!' : rec.hintServe;
  }
}

function startRecipe(recKey) {
  S.recipe = recKey; S.phase = 'ing'; S.cook = 0; S.scorch = 0; S.stir = 0; S.flipped = false; S.busy = false;
  S.plated = { fish: false };
  $('#result').classList.add('hide'); $('#gauge').classList.add('hide'); $('#labels').style.opacity = '1';
  inPotPieces.forEach((m) => mixG.remove(m)); inPotPieces.length = 0;
  servedItems.forEach((m) => boardG.remove(m)); servedItems.length = 0;
  boardG.visible = false; patPan.visible = false;
  bowlsG.visible = true; bowlsG.position.y = 0;
  fishInPan.rotation.x = 0;
  buildBowls(recKey);

  if (recKey === 'arroz') {
    prepBoard.visible = false;
    pailaG.visible = trivet.visible = true;
    pailaG.position.set(0, 0.1, 0); trivet.position.set(0, 0, 0);
    fishInPan.visible = false;
    liquidMat.color.setHex(0xfaf7ef); liquidMat.opacity = 0.2;
  } else {
    prepBoard.visible = true; prepBoard.position.y = 0;
    pailaG.visible = trivet.visible = false;
    fishInPan.visible = true;
    liquidMat.color.setHex(0xebb134); liquidMat.opacity = 0.78;
  }
  camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look);
  syncUI();
}

async function addBaseIng(ing) {
  if (S.phase !== 'ing' || ing.role !== 'base' || S.busy || ing.have >= ing.need) return;
  S.busy = true; ing.have++; syncUI(); initAudio(); playSound('drop');
  const start = ing.group.position.clone().add(V3(0, 0.35, 0));
  const end = S.recipe === 'arroz' ? V3(rnd(-0.35, 0.35), 0.38, rnd(-0.35, 0.35)) : V3(rnd(-0.4, 0.4), 0.42, 0.55);
  const piece = makeIngPiece(ing.id);
  scene.add(shadowed(piece));
  await tween(0.42, (t) => { piece.position.lerpVectors(start, end, t); piece.position.y += Math.sin(t * Math.PI) * 1.25; piece.rotation.y = t * 2.5; });
  scene.remove(piece);

  // En arroz: los ingredientes reales SE QUEDAN VISIBLES dentro del caldero
  if (S.recipe === 'arroz') {
    if (ing.id === 'leche1') {
      liquidMat.opacity = Math.min(0.95, liquidMat.opacity + 0.38);
    } else {
      piece.position.set(rnd(-0.55, 0.55), 0.33, rnd(-0.5, 0.5));
      mixG.add(piece); inPotPieces.push(piece);
    }
  }
  if (ing.have >= ing.need) { ing.group.visible = false; ing.label.style.opacity = '0'; }
  S.busy = false; syncUI();
}

async function toCook() {
  if (S.phase !== 'ing' || S.busy) return;
  S.busy = true; S.phase = 'cook'; S.cook = 0; S.scorch = 0; syncUI();
  initAudio(); playSound('ignite');
  $('#labels').style.opacity = '0';
  $('#gauge').classList.remove('hide');
  pailaG.visible = trivet.visible = true;
  pailaG.position.set(0, 0.1, 0); trivet.position.set(0, 0, 0);
  if (S.recipe === 'mojarra') patPan.visible = true;
  spoon.visible = true;
  camTarget.pos.copy(CAM_COOK.pos); camTarget.look.copy(CAM_COOK.look);
  await tween(0.55, (t) => { prepBoard.position.y = -t * 0.4; bowlsG.position.y = -t * 0.2; });
  prepBoard.visible = bowlsG.visible = false;
  S.busy = false; syncUI();
}

async function flipMojarra() {
  if (S.recipe !== 'mojarra' || S.phase !== 'cook' || S.flipped || S.busy) return;
  S.busy = true; S.flipped = true; playSound('drop');
  await tween(0.55, (t) => {
    fishInPan.position.y = 0.48 + Math.sin(t * Math.PI) * 0.72;
    fishInPan.rotation.x = t * Math.PI;
  });
  S.stir = clamp(S.stir + 0.5, 0, 1);
  S.busy = false; syncUI();
}

async function toServe() {
  if (S.phase !== 'cook' || S.busy) return;
  S.busy = true; S.phase = 'serve'; syncUI();
  $('#gauge').classList.add('hide'); $('#warn').classList.remove('on');
  spoon.visible = false;

  if (S.recipe === 'arroz') {
    // El arroz se termina DENTRO del mismo caldero con el titoté (no en hoja de plátano!)
    camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look);
    bowlsG.visible = true; bowlsG.position.y = 0;
    activeIngs.forEach((g) => {
      const keep = g.role === 'finish';
      g.group.visible = keep;
      g.label.style.opacity = keep ? '1' : '0';
    });
    $('#labels').style.opacity = '1';
  } else {
    patPan.visible = false;
    camTarget.pos.copy(CAM_SERVE.pos); camTarget.look.copy(CAM_SERVE.look);
    boardG.visible = true; boardG.position.set(0, -0.5, 0.35);
    bowlsG.visible = true; bowlsG.position.y = 0;
    activeIngs.forEach((g) => {
      const keep = g.role === 'finish';
      g.group.visible = keep;
      g.label.style.opacity = keep ? '1' : '0';
    });
    $('#labels').style.opacity = '1';
    await tween(0.7, (t) => {
      pailaG.position.x = -t * 5.2; trivet.position.x = -t * 5.2;
      boardG.position.y = lerp(-0.5, 0, easeOut(t));
    });
    pailaG.visible = trivet.visible = false;
  }
  S.busy = false; syncUI();
}

async function addFinishIng(ing) {
  if (S.phase !== 'serve' || ing.role !== 'finish' || S.busy || ing.have >= ing.need) return;
  S.busy = true; ing.have++; playSound('drop');
  const start = ing.group.position.clone().add(V3(0, 0.35, 0));
  const piece = makeIngPiece(ing.id);
  const end = S.recipe === 'arroz' ? V3(0, 0.45, 0) : V3(0.9, 0.3, -0.2);
  scene.add(shadowed(piece));
  await tween(0.45, (t) => { piece.position.lerpVectors(start, end, t); piece.position.y += Math.sin(t * Math.PI) * 1.1; });
  scene.remove(piece);

  if (S.recipe === 'arroz') {
    if (ing.id === 'arroz_crudo') {
      const rd = makeRiceDome(1.12, 0.38, 520, ing.have < ing.need);
      rd.position.y = 0.22;
      inPotPieces.forEach((m) => mixG.remove(m)); inPotPieces.length = 0;
      mixG.add(shadowed(rd)); inPotPieces.push(rd);
    } else if (ing.id === 'pasas') {
      for (let i = 0; i < 12; i++) {
        const r = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), M.raisin);
        r.position.set(rnd(-0.7, 0.7), 0.52, rnd(-0.7, 0.7)); mixG.add(r); inPotPieces.push(r);
      }
    }
  } else {
    if (ing.id === 'arroz_hecho') {
      const rd = makeRiceDome(0.54, 0.34, 380, false);
      rd.position.set(1.02, PTOP + 0.01, -0.42); boardG.add(shadowed(rd)); servedItems.push(rd);
    } else if (ing.id === 'patacones') {
      [[0.85, 0.48], [1.28, 0.25], [1.05, 0.65]].forEach(([px, pz], idx) => {
        const pt = makePatacon(0.27); pt.position.set(px, PTOP + 0.05 + idx * 0.02, pz);
        boardG.add(shadowed(pt)); servedItems.push(pt);
      });
    }
  }
  if (ing.have >= ing.need) { ing.group.visible = false; ing.label.style.opacity = '0'; }
  S.busy = false; syncUI();
}

function plateMojarra() {
  if (S.recipe !== 'mojarra' || S.phase !== 'serve' || S.plated.fish || S.busy) return;
  S.plated.fish = true; playSound('drop');
  const f = makeMojarra(clamp(S.cook * 1.18, 0.45, 1.8));
  f.position.set(-0.32, PTOP + 0.22, 0.12); f.rotation.y = 0.16; f.scale.setScalar(1.08);
  boardG.add(shadowed(f)); servedItems.push(f);
  syncUI();
}

function finishGame() {
  const inZone = S.cook >= 0.615 && S.cook <= 0.77;
  const stars = inZone && S.scorch < 0.4 ? 3 : S.cook >= 0.45 && S.cook <= 0.88 ? 2 : 1;
  $('#stars').innerHTML = '★'.repeat(stars) + '<i>★</i>'.repeat(3 - stars);
  if (S.recipe === 'arroz') {
    $('#rtitle').textContent = stars === 3 ? '¡Arroz con coco al punto!' : 'Buen arroz con coco';
    $('#rtext').textContent = stars === 3
      ? 'Reduciste la primera leche a titoté dorado y cocinaste el arroz con la segunda leche directo en el caldero.'
      : 'Recuerda mover constante al final de la reducción para que el titoté quede dorado y no amargo.';
    $('#next-rec').style.display = '';
  } else {
    $('#rtitle').textContent = stars === 3 ? '¡Mojarra de Bocachica!' : 'Buena fritura costeña';
    $('#rtext').textContent = stars === 3
      ? 'Adobo limpio en tabla, fritura crocante por ambos lados en caldero y emplatado con arroz con coco y patacones.'
      : 'Cuida voltearla a tiempo para lograr piel crocante por ambos lados y carne jugosa.';
    $('#next-rec').style.display = 'none';
  }
  $('#result').classList.remove('hide');
  playSound('ding');
}

/* ───────────── interacción ───────────── */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), hitPlane = new THREE.Plane(V3(0, 1, 0), -0.45), hitPt = V3();
let dragging = false, lastPtr = V3();
canvas.addEventListener('pointerdown', (e) => {
  initAudio();
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  if (S.phase === 'ing') {
    for (const ing of activeIngs) {
      if (ing.group.visible && ing.role === 'base' && ray.intersectObject(ing.group, true).length) { addBaseIng(ing); return; }
    }
  } else if (S.phase === 'cook') {
    dragging = true;
    if (ray.ray.intersectPlane(hitPlane, hitPt)) lastPtr.copy(hitPt);
  } else if (S.phase === 'serve') {
    for (const ing of activeIngs) {
      if (ing.group.visible && ing.role === 'finish' && ray.intersectObject(ing.group, true).length) { addFinishIng(ing); return; }
    }
    if (S.recipe === 'mojarra' && ray.intersectObject(boardG, true).length) plateMojarra();
  }
});
canvas.addEventListener('pointermove', (e) => {
  if (S.phase !== 'cook') return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  if (ray.ray.intersectPlane(hitPlane, hitPt)) {
    const r = Math.hypot(hitPt.x, hitPt.z);
    if (r < 1.35) {
      spoonTarget.set(hitPt.x, 0.55, hitPt.z);
      if (dragging || r < 1.15) {
        S.stir = clamp(S.stir + hitPt.distanceTo(lastPtr) * 0.42, 0, 1);
        lastPtr.copy(hitPt);
      }
    }
  }
});
addEventListener('pointerup', () => (dragging = false));

$('#start-arroz').onclick = () => { initAudio(); $('#intro').classList.add('hide'); startRecipe('arroz'); };
$('#start-mojarra').onclick = () => { initAudio(); $('#intro').classList.add('hide'); startRecipe('mojarra'); };
$('#tab-arroz').onclick = () => startRecipe('arroz');
$('#tab-mojarra').onclick = () => startRecipe('mojarra');
$('#next-rec').onclick = () => startRecipe('mojarra');
$('#again').onclick = () => startRecipe(S.recipe);
$('#flip-btn').onclick = flipMojarra;
$('#btn').onclick = () => { if (S.phase === 'ing') toCook(); else if (S.phase === 'cook') toServe(); else finishGame(); };
$('#snd').onclick = () => {
  S.muted = !S.muted;
  $('#snd').classList.toggle('off', S.muted);
  if (musicGain && AC) musicGain.gain.setTargetAtTime(S.muted ? 0 : 0.75, AC.currentTime, 0.05);
};

manager.onLoad = () => { $('#loading').textContent = 'Listo para cocinar'; };
layout(); buildBowls('arroz'); syncUI();

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

    if (S.recipe === 'arroz') {
      const whiteC = new THREE.Color(0xfaf7ef), titoteC = new THREE.Color(0x6b3a16), burnC = new THREE.Color(0x211106);
      if (S.cook < 0.72) liquidMat.color.lerpColors(whiteC, titoteC, S.cook / 0.72);
      else liquidMat.color.lerpColors(titoteC, burnC, (S.cook - 0.72) / 0.28);
      inPotPieces.forEach((m) => { if (m.scale.x > 0.2) m.scale.multiplyScalar(1 - dt * 0.18); });
    } else if (fishInPan.userData.matBody) {
      const f = clamp(S.cook * 1.3, 0, 1.9);
      if (f > 0.35 && fishInPan.userData.matBody.map !== texFishFried) {
        fishInPan.userData.matBody.map = texFishFried; fishInPan.userData.matBody.bumpMap = texFishFried; fishInPan.userData.matBody.needsUpdate = true;
      }
      const rawC = new THREE.Color(0xd9e4eb), goldC = new THREE.Color(0xf2b56b), burnC = new THREE.Color(0x4a240c);
      if (f <= 1) fishInPan.userData.matBody.color.lerpColors(rawC, goldC, f);
      else fishInPan.userData.matBody.color.lerpColors(goldC, burnC, f - 1);
    }

    bubbles.forEach((b) => {
      b.visible = true; b.userData.t = (b.userData.t + dt * 1.4) % 1;
      const t = b.userData.t, ang = t * 25 + bubbles.indexOf(b), rad = 0.25 + (bubbles.indexOf(b) % 5) * 0.22;
      b.position.set(Math.cos(ang) * rad, 0.34 + Math.sin(t * Math.PI) * 0.05, Math.sin(ang) * rad);
      b.scale.setScalar(0.03 + Math.sin(t * Math.PI) * 0.035);
    });
    steams.forEach((s) => {
      s.visible = true; s.userData.t = (s.userData.t + dt * 0.38) % 1;
      const t = s.userData.t;
      s.position.set(Math.sin(t * 6 + steams.indexOf(s)) * 0.35, 0.5 + t * 2.2, Math.cos(t * 5) * 0.25);
      s.scale.setScalar(0.6 + t * 1.2); s.material.opacity = Math.sin(t * Math.PI) * 0.24;
    });
    if (Math.random() < dt * 7.5) playSound('pop');
    if (sizzleGain) sizzleGain.gain.setTargetAtTime(S.muted ? 0 : 0.14 + S.stir * 0.12, AC.currentTime, 0.08);
    syncUI();
  } else {
    fireLight.intensity = 0;
    bubbles.forEach((b) => (b.visible = false));
    steams.forEach((s) => (s.visible = false));
    if (sizzleGain) sizzleGain.gain.setTargetAtTime(0, AC.currentTime, 0.08);
  }

  if (S.phase === 'ing' || S.phase === 'serve') {
    const p = V3();
    activeIngs.forEach((g) => {
      if (!g.group.visible) return;
      p.copy(g.group.position).add(V3(0, 0.62, 0)).project(camera);
      g.label.style.left = `${(p.x * 0.5 + 0.5) * innerWidth}px`;
      g.label.style.top = `${(-p.y * 0.5 + 0.5) * innerHeight}px`;
    });
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);
