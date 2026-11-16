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
renderer.toneMappingExposure = 1.04;
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
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a2414, 0.36));
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
    g.addColorStop(0, '#445866'); g.addColorStop(0.32, '#8fa4b0'); g.addColorStop(0.68, '#cfd9de'); g.addColorStop(1, '#eef2f4');
  } else {
    g.addColorStop(0, '#78360b'); g.addColorStop(0.35, '#b85f14'); g.addColorStop(0.75, '#d98426'); g.addColorStop(1, '#e8a645');
  }
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);

  // Escamas detalladas en malla romboidal
  for (let row = 0; row < 26; row++) {
    for (let col = 0; col < 48; col++) {
      const cx = col * 22 + (row % 2) * 11;
      const cy = row * 20 + 10;
      x.strokeStyle = fried ? 'rgba(62,20,4,0.45)' : 'rgba(60,78,92,0.28)';
      x.lineWidth = 2;
      x.beginPath(); x.arc(cx, cy, 12, -Math.PI * 0.42, Math.PI * 0.42); x.stroke();
      if (fried && Math.random() > 0.35) {
        x.fillStyle = `rgba(90,30,5,${rnd(0.15, 0.38)})`;
        x.beginPath(); x.arc(cx + rnd(-4, 4), cy + rnd(-4, 4), rnd(2, 6), 0, Math.PI * 2); x.fill();
      }
    }
  }
  // Línea lateral y opérculo branquial
  x.strokeStyle = fried ? 'rgba(65,24,6,0.55)' : 'rgba(50,65,75,0.45)';
  x.lineWidth = 4;
  x.beginPath(); x.arc(690, 256, 130, Math.PI * 0.72, Math.PI * 1.28); x.stroke();

  // Cortes diagonales limpios con carne interior
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

function makeTomatoTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#dc2626'; x.fillRect(0, 0, 256, 256);
  x.fillStyle = '#ef4444'; x.beginPath(); x.arc(128, 128, 112, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#b91c1c';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.3;
    x.beginPath(); x.arc(128 + Math.cos(a) * 52, 128 + Math.sin(a) * 52, 34, 0, Math.PI * 2); x.fill();
  }
  x.fillStyle = '#fef08a';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    x.beginPath(); x.ellipse(128 + Math.cos(a) * rnd(36, 72), 128 + Math.sin(a) * rnd(36, 72), 4, 2, a, 0, Math.PI * 2); x.fill();
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

const texFishRaw = makeFishTex(false);
const texFishFried = makeFishTex(true);
const texPatacon = makePataconTex();
const texTomato = makeTomatoTex();
const texLime = makeLimeTex();

const M = {
  table: new THREE.MeshStandardMaterial({ ...texWood, roughness: 0.85, metalness: 0, envMapIntensity: 0.55 }),
  linen: new THREE.MeshStandardMaterial({ ...texLinen, roughness: 0.95, metalness: 0, envMapIntensity: 0.4 }),
  clay: new THREE.MeshStandardMaterial({ color: 0xefe3ce, roughness: 0.42, metalness: 0.04, envMapIntensity: 0.9 }),
  porcelain: new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.16, metalness: 0.02, envMapIntensity: 1.0 }),
  ironPan: new THREE.MeshStandardMaterial({ color: 0x262425, roughness: 0.44, metalness: 0.82, envMapIntensity: 1.2 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xc29348, roughness: 0.34, metalness: 0.88, envMapIntensity: 1.2 }),
  iron: new THREE.MeshStandardMaterial({ color: 0x222020, roughness: 0.72, metalness: 0.75 }),
  oil: new THREE.MeshStandardMaterial({ color: 0xebb134, roughness: 0.12, metalness: 0.04, transparent: true, opacity: 0.82 }),
  fishRaw: new THREE.MeshStandardMaterial({ map: texFishRaw, bumpMap: texFishRaw, bumpScale: 0.03, roughness: 0.3, metalness: 0.18 }),
  fishFried: new THREE.MeshStandardMaterial({ map: texFishFried, bumpMap: texFishFried, bumpScale: 0.06, roughness: 0.55, metalness: 0.02 }),
  fishFinRaw: new THREE.MeshStandardMaterial({ color: 0x8e9da6, roughness: 0.55, transparent: true, opacity: 0.92, side: THREE.DoubleSide }),
  fishFinFried: new THREE.MeshStandardMaterial({ color: 0xb85f14, roughness: 0.65, side: THREE.DoubleSide }),
  lime: new THREE.MeshStandardMaterial({ color: 0x3b841b, roughness: 0.52 }),
  limePulp: new THREE.MeshStandardMaterial({ map: texLime, roughness: 0.25 }),
  garlic: new THREE.MeshStandardMaterial({ color: 0xf4ead2, roughness: 0.65 }),
  flour: new THREE.MeshStandardMaterial({ color: 0xfaf6ec, roughness: 0.95 }),
  riceGrain: new THREE.MeshStandardMaterial({ color: 0x7c4e29, roughness: 0.68 }),
  patacon: new THREE.MeshStandardMaterial({ map: texPatacon, bumpMap: texPatacon, bumpScale: 0.04, roughness: 0.65 }),
  tomato: new THREE.MeshStandardMaterial({ map: texTomato, roughness: 0.28 }),
  onion: new THREE.MeshStandardMaterial({ color: 0x9b1c6d, roughness: 0.4 }),
  cilantro: new THREE.MeshStandardMaterial({ color: 0x2c7a26, roughness: 0.7, side: THREE.DoubleSide }),
  spoon: new THREE.MeshStandardMaterial({ color: 0x3a3b3e, roughness: 0.35, metalness: 0.85 }),
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

/* ───────────── mesa ───────────── */
const table = new THREE.Mesh(new THREE.PlaneGeometry(36, 26), M.table);
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

/* ───────────── escultura anatómica de Mojarra 3D ───────────── */
function makeMojarra(cookFactor = 0) {
  const g = new THREE.Group();
  const matBody = (cookFactor > 0.35 ? M.fishFried : M.fishRaw).clone();
  const matFin = (cookFactor > 0.35 ? M.fishFinFried : M.fishFinRaw).clone();

  // Cuerpo orgánico fusiforme con perfil alto de mojarra (Lathe/Sphere deformada)
  const bodyGeo = new THREE.SphereGeometry(0.64, 36, 24);
  const pos = bodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = x / 0.64; // -1 (cola) .. +1 (hocico)
    // Perfil dorsal más alto en el centro, afilado hacia la cola y hocico
    const envZ = Math.pow(Math.max(0.08, 1 - Math.pow(nx, 2.1)), 0.72) * (nx < -0.55 ? 0.45 : 1.0);
    // Vientre algo más plano que el lomo
    z *= envZ * 0.92;
    // Compresión lateral realista de mojarra (plana de lado a lado)
    y *= 0.28 * (nx < -0.5 ? 0.5 : 1.0);
    x *= 1.55;
    pos.setXYZ(i, x, y, z);
  }
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, matBody);
  g.add(body);

  // Aleta caudal (cola ahorquillada real en V)
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0.06);
  tailShape.quadraticCurveTo(-0.34, 0.34, -0.52, 0.42);
  tailShape.quadraticCurveTo(-0.35, 0.08, -0.30, 0);
  tailShape.quadraticCurveTo(-0.35, -0.08, -0.52, -0.42);
  tailShape.quadraticCurveTo(-0.34, -0.34, 0, -0.06);
  tailShape.closePath();
  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008 });
  tailGeo.rotateX(Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, matFin);
  tail.position.set(-0.9, 0.01, 0);
  g.add(tail);

  // Aleta dorsal espinosa característica de la mojarra
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(-0.46, 0);
  dorsalShape.lineTo(-0.36, 0.28);
  dorsalShape.quadraticCurveTo(0.05, 0.32, 0.32, 0.14);
  dorsalShape.lineTo(0.36, 0);
  dorsalShape.closePath();
  const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, { depth: 0.018, bevelEnabled: false });
  dorsalGeo.rotateX(-Math.PI / 2);
  const dorsal = new THREE.Mesh(dorsalGeo, matFin);
  dorsal.position.set(-0.04, 0.03, -0.42);
  g.add(dorsal);

  // Aleta pectoral sobre el costado
  const pecShape = new THREE.Shape();
  pecShape.moveTo(0, 0); pecShape.quadraticCurveTo(-0.22, 0.18, -0.36, 0.04); pecShape.quadraticCurveTo(-0.2, -0.08, 0, 0);
  const pec = new THREE.Mesh(new THREE.ShapeGeometry(pecShape), matFin);
  pec.rotation.x = -Math.PI / 2; pec.rotation.z = -0.35; pec.position.set(0.32, 0.15, 0.14);
  g.add(pec);

  // Ojo brillante realista
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12 }));
  eyeW.scale.set(1, 0.65, 1); eyeW.position.set(0.64, 0.09, -0.14);
  const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.05 }));
  eyeB.scale.set(1, 0.65, 1); eyeB.position.set(0.65, 0.11, -0.14);
  g.add(eyeW, eyeB);

  g.userData.matBody = matBody;
  g.userData.matFin = matFin;
  return g;
}

/* ───────────── arroz con coco realista (granos instanciados) ───────────── */
function makeRiceDome(radius = 0.44, height = 0.26, count = 420) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.92, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.riceGrain);
  core.scale.set(1, height / radius, 1);
  g.add(core);

  const grainGeo = new THREE.SphereGeometry(0.024, 6, 5);
  grainGeo.scale(1.9, 0.75, 0.85);
  const im = new THREE.InstancedMesh(grainGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt(rnd());
    const th = rnd(Math.PI * 2);
    const y = Math.max(0.02, height * Math.sqrt(Math.max(0, 1 - (r / radius) ** 2)) + rnd(-0.01, 0.02));
    p.set(Math.cos(th) * r, y, Math.sin(th) * r);
    e.set(rnd(-0.5, 0.5), rnd(6.28), rnd(-0.5, 0.5));
    q.setFromEuler(e);
    s.setScalar(rnd(0.85, 1.25));
    m4.compose(p, q, s);
    im.setMatrixAt(i, m4);
    const cVal = rnd();
    col.setRGB(lerp(0.32, 0.62, cVal), lerp(0.18, 0.44, cVal), lerp(0.08, 0.25, cVal));
    im.setColorAt(i, col);
  }
  im.instanceMatrix.needsUpdate = true;
  if (im.instanceColor) im.instanceColor.needsUpdate = true;
  g.add(im);
  return g;
}

/* ───────────── cuencos: SÓLO adobo va a la mojarra; acompañantes esperan para emplatar ───────────── */
const ING = [
  { id: 'limon', name: 'Limón criollo', need: 2, unit: 'mitades', role: 'adobo' },
  { id: 'ajo', name: 'Ajo y sal marina', need: 2, unit: 'pizcas', role: 'adobo' },
  { id: 'harina', name: 'Harina ligera', need: 1, unit: 'toque', role: 'adobo' },
  { id: 'arroz', name: 'Arroz con coco', need: 1, unit: 'porc.', role: 'emplatar' },
  { id: 'patacones', name: 'Patacones', need: 1, unit: 'porc.', role: 'emplatar' },
  { id: 'ensalada', name: 'Ensalada criolla', need: 1, unit: 'porc.', role: 'emplatar' },
];
ING.forEach((g) => (g.have = 0));
const bowlsG = new THREE.Group(); scene.add(bowlsG);
const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), M.linen);
cloth.rotation.x = -Math.PI / 2; cloth.position.y = 0.012; cloth.receiveShadow = true; bowlsG.add(cloth);

const bowlGeo = new THREE.LatheGeometry([[0, 0], [0.34, 0], [0.57, 0.25], [0.61, 0.33], [0.63, 0.345], [0.6, 0.35], [0.55, 0.3], [0.5, 0.22], [0.3, 0.07], [0, 0.055]].map((p) => new THREE.Vector2(p[0], p[1])), 56);

for (const ing of ING) {
  const g = new THREE.Group(); ing.group = g;
  g.add(contact(0.95, 0.72), new THREE.Mesh(bowlGeo, M.clay));
  const inner = new THREE.Group(); g.add(inner); ing.inner = inner;
  if (ing.id === 'limon') {
    [[-0.16, 0.22, 0.06], [0.16, 0.22, -0.08]].forEach((p, idx) => {
      const lm = new THREE.Group();
      lm.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.lime));
      const pulp = new THREE.Mesh(new THREE.CircleGeometry(0.17, 18), M.limePulp);
      pulp.rotation.x = Math.PI / 2; lm.add(pulp);
      lm.position.set(...p); lm.rotation.set(0.3, idx * 1.4, 0.2); inner.add(lm);
    });
  } else if (ing.id === 'ajo') {
    for (let i = 0; i < 6; i++) {
      const cl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), M.garlic);
      cl.scale.set(1.4, 0.85, 0.9);
      cl.position.set(rnd(-0.2, 0.2), 0.18 + (i % 2) * 0.04, rnd(-0.2, 0.2));
      cl.rotation.y = rnd(6); inner.add(cl);
    }
  } else if (ing.id === 'harina') {
    const mound = new THREE.Mesh(new THREE.SphereGeometry(0.45, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.flour);
    mound.scale.set(1, 0.42, 1); mound.position.y = 0.14; inner.add(mound);
  } else if (ing.id === 'arroz') {
    const rd = makeRiceDome(0.44, 0.25, 280);
    rd.position.y = 0.12; inner.add(rd);
  } else if (ing.id === 'patacones') {
    [[-0.14, 0.2, 0.06], [0.16, 0.22, -0.07], [0.02, 0.3, 0.02]].forEach((p, idx) => {
      const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.22, 0.06, 20), M.patacon);
      pt.position.set(...p); pt.rotation.set(rnd(-0.2, 0.2), idx, rnd(-0.2, 0.2)); inner.add(pt);
    });
  } else if (ing.id === 'ensalada') {
    for (let i = 0; i < 4; i++) {
      const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.045, 18), M.tomato);
      tm.position.set(rnd(-0.18, 0.18), 0.18 + i * 0.03, rnd(-0.18, 0.18));
      tm.rotation.set(rnd(-0.25, 0.25), rnd(3), rnd(-0.25, 0.25)); inner.add(tm);
    }
    for (let i = 0; i < 3; i++) {
      const on = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 18), M.onion);
      on.rotation.x = Math.PI / 2 + rnd(-0.2, 0.2); on.position.set(rnd(-0.15, 0.15), 0.28, rnd(-0.15, 0.15)); inner.add(on);
    }
  }
  shadowed(g); bowlsG.add(g);
  const el = document.createElement('div'); el.className = 'lbl'; $('#labels').appendChild(el); ing.label = el;
  const li = document.createElement('li'); $('#inglist').appendChild(li); ing.li = li;
}

/* ───────────── tabla de preparación (Paso 1) + caldero limpio (Paso 2) + plato de loza (Paso 3) ───────────── */
const prepFish = makeMojarra(0);
prepFish.position.set(0, 0.26, 0.55);
prepFish.scale.setScalar(1.05);
prepFish.rotation.y = 0.08;
shadowed(prepFish);

const prepBoard = new THREE.Group();
{
  const b = new THREE.Mesh(new RoundedBoxGeometry(3.1, 0.12, 2.0, 4, 0.05), M.board);
  b.position.set(0, 0.06, 0.55);
  prepBoard.add(contact(2.2, 0.72), shadowed(b), prepFish);
}
scene.add(prepBoard);

// Caldero de hierro con aceite limpio
const PR = 1.72, PY0 = 0.12, PH = 0.62;
const pailaG = new THREE.Group(); pailaG.visible = false; scene.add(pailaG);
const trivet = new THREE.Group(); trivet.visible = false; scene.add(trivet);
{
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(PR * Math.sin(a), PY0 + PH * (1 - Math.cos(a)))); }
  pts.push(new THREE.Vector2(1.78, 0.755), new THREE.Vector2(1.82, 0.75), new THREE.Vector2(1.82, 0.72));
  for (let i = 16; i >= 0; i--) { const a = (i / 16) * Math.PI / 2; pts.push(new THREE.Vector2(1.79 * Math.sin(a), 0.05 + 0.66 * (1 - Math.cos(a)))); }
  pailaG.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 72), M.ironPan));
  for (const s of [-1, 1]) {
    const hd = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 24, Math.PI), M.brass);
    hd.rotation.set(-Math.PI / 2, 0, 0); const piv = new THREE.Group(); piv.add(hd);
    piv.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; piv.position.set(s * 1.78, 0.71, 0);
    pailaG.add(piv);
  }
  shadowed(pailaG);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.07, 10, 48), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; trivet.add(ring);
  for (let i = 0; i < 3; i++) { const leg = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.12, 0.16, 2, 0.03), M.iron); const a = i * 2.094 + 0.5; leg.position.set(Math.cos(a) * 1.55, 0.07, Math.sin(a) * 1.55); leg.rotation.y = -a; trivet.add(leg); }
  shadowed(trivet); trivet.add(contact(2.7, 0.8));
}
pailaG.position.y = 0.1;

const mixG = new THREE.Group(); pailaG.add(mixG);
const oilDisc = new THREE.Mesh(new THREE.CircleGeometry(1.38, 64).rotateX(-Math.PI / 2), M.oil);
oilDisc.position.y = 0.34; oilDisc.receiveShadow = true; mixG.add(oilDisc);

const fishInPan = makeMojarra(0);
fishInPan.position.set(0, 0.36, 0);
fishInPan.scale.setScalar(1.05);
shadowed(fishInPan);
mixG.add(fishInPan);

const bubbles = [];
for (let i = 0; i < 20; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8, 0, 6.283, 0, Math.PI / 2), M.bubble); b.visible = false; b.userData.t = rnd(); mixG.add(b); bubbles.push(b); }
const steamMat = new THREE.SpriteMaterial({ map: softDot, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const steams = [];
for (let i = 0; i < 12; i++) { const s = new THREE.Sprite(steamMat.clone()); s.userData.t = i / 12; s.visible = false; scene.add(s); steams.push(s); }

const spoon = new THREE.Group();
{
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 20), M.spoon);
  const hnd = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 2.3, 12), M.spoon); hnd.rotation.x = Math.PI / 2; hnd.position.z = 1.3;
  spoon.add(head, hnd); spoon.rotation.order = 'YXZ'; spoon.rotation.set(-0.35, -0.55, 0);
  shadowed(spoon); spoon.visible = false; pailaG.add(spoon);
}
const spoonTarget = V3(0.5, 0.45, 0.4);

/* ───────────── plato de loza + hoja de plátano (Paso 3) ───────────── */
const boardG = new THREE.Group(); boardG.visible = false; scene.add(boardG);
const PTOP = 0.16;
{
  const plateGeo = new THREE.LatheGeometry([[0, 0], [1.45, 0], [1.95, 0.14], [2.15, 0.22], [2.12, 0.24], [1.85, 0.16], [1.4, 0.08], [0, 0.07]].map((p) => new THREE.Vector2(p[0], p[1])), 64);
  const plate = new THREE.Mesh(plateGeo, M.porcelain);
  const lg = new THREE.PlaneGeometry(3.1, 2.1, 40, 20), p = lg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), u = x / 1.55, v = y / 1.05;
    const half = 1.05 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 2.5)), 0.52);
    p.setY(i, v * half);
    p.setZ(i, 0.01 + 0.02 * Math.abs(v));
  }
  lg.computeVertexNormals();
  const leaf = new THREE.Mesh(lg, M.leaf); leaf.rotation.x = -Math.PI / 2; leaf.rotation.z = 0.06; leaf.position.y = PTOP - 0.04;
  boardG.add(contact(2.6, 0.78), shadowed(plate), shadowed(leaf));
}
const servedItems = [];

/* ───────────── estado y layout ───────────── */
const CAM_ING = { pos: V3(0, 11.4, 7.6), look: V3(0.6, 0.1, 0.35) };
const CAM_COOK = { pos: V3(0, 7.2, 5.2), look: V3(0.55, 0.35, 0.05) };
const CAM_SERVE = { pos: V3(0, 6.2, 5.4), look: V3(0.5, 0.15, 0.1) };
const camPos = CAM_ING.pos.clone(), camLook = CAM_ING.look.clone(), camTarget = { pos: CAM_ING.pos.clone(), look: CAM_ING.look.clone() };
const S = { phase: 'intro', started: false, cook: 0, scorch: 0, stir: 0, busy: false, muted: false, plated: { fish: false, arroz: false, patacones: false, ensalada: false } };

const BASE_POS = [
  V3(-2.6, 0, -2.1), // limon
  V3(-0.9, 0, -2.5), // ajo
  V3(0.85, 0, -2.4), // harina
  V3(2.45, 0, -1.5), // arroz (espera)
  V3(-2.9, 0, -0.35), // patacones (espera)
  V3(2.55, 0, 0.55), // ensalada (espera)
];
let aspect = 1;
function layout() {
  aspect = innerWidth / innerHeight;
  camera.aspect = aspect; camera.updateProjectionMatrix();
  const port = aspect < 0.9;
  CAM_ING.pos.set(0, port ? 14.0 : 11.4, port ? 8.8 : 7.6);
  CAM_ING.look.set(port ? 0 : 0.7, 0.1, port ? 1.15 : 0.35);
  CAM_COOK.pos.set(0, port ? 8.6 : 7.2, port ? 6.4 : 5.2);
  CAM_COOK.look.set(port ? 0 : 0.65, 0.35, port ? 0.95 : 0.05);
  CAM_SERVE.pos.set(0, port ? 7.8 : 6.2, port ? 6.6 : 5.4);
  CAM_SERVE.look.set(port ? 0 : 0.6, 0.15, port ? 0.9 : 0.1);
  if (S.phase === 'intro' || S.phase === 'ing') { camTarget.pos.copy(CAM_ING.pos); camTarget.look.copy(CAM_ING.look); }
  const xs = port ? 0.78 : 1, zs = port ? 0.85 : 1;
  ING.forEach((g, i) => g.group.position.set(BASE_POS[i].x * xs, 0, BASE_POS[i].z * zs));
  cloth.position.set(-0.2 * xs, 0.012, -0.8 * zs);
  cloth.scale.set(7.4 * xs, 5.4 * zs, 1);
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
  sizzleFilter = AC.createBiquadFilter(); sizzleFilter.type = 'bandpass'; sizzleFilter.frequency.value = 1850; sizzleFilter.Q.value = 0.85;
  sizzleGain = AC.createGain(); sizzleGain.gain.value = 0;
  src.connect(sizzleFilter).connect(sizzleGain).connect(AC.destination); src.start();
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

/* ───────────── UI ───────────── */
function syncUI() {
  ING.forEach((g) => {
    const showInPhase = S.phase === 'ing' ? g.role === 'adobo' : true;
    g.label.innerHTML = `${g.name}<b>${g.have}/${g.need}</b>`;
    g.label.classList.toggle('full', g.have >= g.need);
    g.label.style.display = showInPhase && g.group.visible ? '' : 'none';
    g.li.innerHTML = `<span>${g.name}</span><span>${g.have}/${g.need} ${g.unit}</span>`;
    g.li.classList.toggle('ok', g.have >= g.need);
  });
  const adoboListo = ING.filter((g) => g.role === 'adobo').every((g) => g.have >= g.need);
  const platoListo = S.plated.fish && S.plated.arroz && S.plated.patacones && S.plated.ensalada;
  const steps = document.querySelectorAll('#steps li');
  steps.forEach((li) => {
    const s = li.dataset.s;
    li.className = s === S.phase ? 'on' : ((s === 'ing' && S.phase !== 'ing') || (s === 'cook' && S.phase === 'serve') ? 'ok' : '');
  });
  const btn = $('#btn');
  if (S.phase === 'ing') {
    btn.textContent = 'Llevar al caldero'; btn.disabled = !adoboListo || S.busy;
    $('#hint').textContent = adoboListo ? 'Mojarra adobada. ¡Llévala al aceite caliente!' : 'Toca Limón, Ajo/sal y Harina para adobar la mojarra en la tabla.';
  } else if (S.phase === 'cook') {
    btn.textContent = 'Sacar al plato'; btn.disabled = S.cook < 0.35;
    $('#hint').textContent = 'Mueve la espumadera sobre la mojarra para dorarla parejo sin quemarla.';
  } else if (S.phase === 'serve') {
    btn.textContent = 'Servir plato'; btn.disabled = !platoListo || S.busy;
    $('#hint').textContent = !S.plated.fish ? 'Toca el plato para colocar la mojarra dorada.' : !platoListo ? 'Toca los cuencos de Arroz con coco, Patacones y Ensalada para emplatar.' : '¡Almuerzo costeño listo para servir!';
  }
}

async function addAdobo(ing) {
  if (S.phase !== 'ing' || ing.role !== 'adobo' || S.busy || ing.have >= ing.need) return;
  S.busy = true; ing.have++; syncUI(); initAudio(); playSound('drop');
  const start = ing.group.position.clone().add(V3(0, 0.35, 0));
  const end = V3(rnd(-0.4, 0.4), 0.35, 0.55 + rnd(-0.15, 0.15));
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), ing.id === 'limon' ? M.limePulp : ing.id === 'ajo' ? M.garlic : M.flour);
  scene.add(shadowed(drop));
  await tween(0.38, (t) => {
    drop.position.lerpVectors(start, end, t);
    drop.position.y += Math.sin(t * Math.PI) * 1.1;
  });
  scene.remove(drop);
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
  spoon.visible = true;
  camTarget.pos.copy(CAM_COOK.pos); camTarget.look.copy(CAM_COOK.look);
  await tween(0.55, (t) => { prepBoard.position.y = -t * 0.4; bowlsG.position.y = -t * 0.2; });
  prepBoard.visible = bowlsG.visible = false;
  S.busy = false; syncUI();
}

async function toServe() {
  if (S.phase !== 'cook' || S.busy) return;
  S.busy = true; S.phase = 'serve'; syncUI();
  $('#gauge').classList.add('hide');
  $('#warn').classList.remove('on');
  spoon.visible = false;
  camTarget.pos.copy(CAM_SERVE.pos); camTarget.look.copy(CAM_SERVE.look);
  boardG.visible = true; boardG.position.set(0, -0.5, 0.35);
  // Mostrar solo cuencos de acompañamiento (arroz, patacones, ensalada) para emplatar
  bowlsG.visible = true; bowlsG.position.y = 0;
  ING.forEach((g) => {
    const keep = g.role === 'emplatar';
    g.group.visible = keep;
    g.label.style.opacity = keep ? '1' : '0';
  });
  $('#labels').style.opacity = '1';
  await tween(0.7, (t) => {
    pailaG.position.x = -t * 5.2; trivet.position.x = -t * 5.2;
    boardG.position.y = lerp(-0.5, 0, easeOut(t));
  });
  pailaG.visible = trivet.visible = false;
  S.busy = false; syncUI();
}

function plateMojarra() {
  if (S.phase !== 'serve' || S.plated.fish || S.busy) return;
  S.plated.fish = true; playSound('drop');
  const f = makeMojarra(clamp(S.cook * 1.18, 0.45, 1.8));
  f.position.set(-0.32, PTOP + 0.14, 0.12); f.rotation.y = 0.16; f.scale.setScalar(1.06);
  boardG.add(shadowed(f)); servedItems.push(f);
  // Rodaja de limón decorativa junto al pescado
  const lm = new THREE.Group();
  lm.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.lime));
  const pulp = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), M.limePulp); pulp.rotation.x = Math.PI / 2; lm.add(pulp);
  lm.position.set(-1.35, PTOP + 0.04, 0.45); lm.rotation.set(0.35, 0.5, 0.15);
  boardG.add(shadowed(lm)); servedItems.push(lm);
  syncUI();
}

async function plateSide(ing) {
  if (S.phase !== 'serve' || ing.role !== 'emplatar' || S.busy || ing.have >= ing.need) return;
  S.busy = true; ing.have++; playSound('drop');
  if (ing.id === 'arroz') {
    S.plated.arroz = true;
    const rd = makeRiceDome(0.52, 0.34, 380);
    rd.position.set(1.02, PTOP + 0.01, -0.42);
    boardG.add(shadowed(rd)); servedItems.push(rd);
  } else if (ing.id === 'patacones') {
    S.plated.patacones = true;
    [[0.85, 0.48], [1.28, 0.25], [1.05, 0.65]].forEach(([px, pz], idx) => {
      const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.065, 22), M.patacon);
      pt.position.set(px, PTOP + 0.04 + idx * 0.02, pz);
      pt.rotation.set(rnd(-0.1, 0.1), idx, rnd(-0.1, 0.1));
      boardG.add(shadowed(pt)); servedItems.push(pt);
    });
  } else if (ing.id === 'ensalada') {
    S.plated.ensalada = true;
    [[-1.08, -0.45], [-0.82, -0.58]].forEach(([tx, tz]) => {
      const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20), M.tomato);
      tm.position.set(tx, PTOP + 0.04, tz); tm.rotation.z = 0.12;
      boardG.add(shadowed(tm)); servedItems.push(tm);
    });
    for (let i = 0; i < 3; i++) {
      const on = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 20), M.onion);
      on.rotation.x = Math.PI / 2 + rnd(-0.15, 0.15);
      on.position.set(-0.96 + rnd(-0.12, 0.12), PTOP + 0.09 + i * 0.015, -0.48 + rnd(-0.1, 0.1));
      boardG.add(shadowed(on)); servedItems.push(on);
    }
  }
  ing.group.visible = false; ing.label.style.opacity = '0';
  S.busy = false; syncUI();
}

function finishGame() {
  if (S.phase !== 'serve') return;
  const inZone = S.cook >= 0.615 && S.cook <= 0.77;
  const stars = inZone && S.scorch < 0.4 ? 3 : S.cook >= 0.45 && S.cook <= 0.88 ? 2 : 1;
  $('#stars').innerHTML = '★'.repeat(stars) + '<i>★</i>'.repeat(3 - stars);
  $('#rtitle').textContent = stars === 3 ? '¡Mojarra de Bocachica!' : stars === 2 ? '¡Buen sabor costeño!' : 'Casi al punto';
  $('#rtext').textContent = stars === 3 ? 'Piel dorada y crocante, carne jugosa y emplatada con arroz con coco y patacones.' : S.cook > 0.77 ? 'Se pasó un poquito de aceite caliente; mueve más la espumadera.' : 'Le faltó un minutico más de dorado en el caldero.';
  $('#result').classList.remove('hide');
  playSound('ding');
}

function resetGame() {
  $('#result').classList.add('hide');
  ING.forEach((g) => { g.have = 0; g.group.visible = true; g.label.style.opacity = '1'; });
  servedItems.forEach((m) => boardG.remove(m)); servedItems.length = 0;
  pailaG.visible = trivet.visible = false;
  prepBoard.visible = true; prepBoard.position.y = 0;
  bowlsG.visible = true; bowlsG.position.y = 0;
  boardG.visible = false;
  $('#labels').style.opacity = '1';
  $('#gauge').classList.add('hide');
  S.phase = 'ing'; S.cook = 0; S.scorch = 0; S.stir = 0; S.busy = false;
  S.plated = { fish: false, arroz: false, patacones: false, ensalada: false };
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
      if (ing.group.visible && ing.role === 'adobo' && ray.intersectObject(ing.group, true).length) { addAdobo(ing); return; }
    }
  } else if (S.phase === 'cook') {
    dragging = true;
    if (ray.ray.intersectPlane(hitPlane, hitPt)) lastPtr.copy(hitPt);
  } else if (S.phase === 'serve') {
    for (const ing of ING) {
      if (ing.group.visible && ing.role === 'emplatar' && ray.intersectObject(ing.group, true).length) { plateSide(ing); return; }
    }
    if (ray.intersectObject(boardG, true).length) plateMojarra();
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
      if (f > 0.35 && fishInPan.userData.matBody.map !== texFishFried) {
        fishInPan.userData.matBody.map = texFishFried;
        fishInPan.userData.matBody.bumpMap = texFishFried;
        fishInPan.userData.matBody.needsUpdate = true;
      }
      const rawC = new THREE.Color(0xd9e4eb), goldC = new THREE.Color(0xf2b56b), burnC = new THREE.Color(0x4a240c);
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
