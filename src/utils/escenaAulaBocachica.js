import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { BASE, DATA_URL, prepareTreeSpecies, instanceTrees, createSkyEnvironment } from './realTerritory.js';

// =============================================================================
// Escena 3D interactiva para "Tierra Bomba · Aula Ambiental (Bocachica)"
// Inspirada 1:1 en la arquitectura escénica de tesis_tercer_corte (escena.js):
//  - Foto satelital z15 + detalle z18 + relieve Terrarium + silueta oficial
//  - 2.600 construcciones reales de la isla + árboles escaneados
//  - Nodos, rutas animadas, zonas de intervención y prototipo 3D del
//    Gimnasio Cristiano de Bocachica (R9: refugio climático + agua + vivero)
//  - Modo Gemelo Digital Progresivo (nube de puntos + capas temáticas)
// =============================================================================

const MOSAIC = { x0: 9502, y0: 15426, nx: 10, ny: 17 };
const WIN = { left: 231, top: 1734, w: 1445, h: 2578 };
const EXAG = 2.6;
const DEM = { z: 12, x0: 1187, y0: 1929 };
const CASA_ESCALA = 2.4;

// Coordenadas geográficas de los nodos de Bocachica (extremo sur de Tierra Bomba)
export const NODOS_BOCACHICA = {
  casco: { lon: -75.5852, lat: 10.3328, nombre: 'Casco de Bocachica · Atlas 9.1', color: '#e0917a' },
  escuelaR9: { lon: -75.5841, lat: 10.3340, nombre: 'Gimnasio Cristiano R9 · Refugio 9.3', color: '#35d08a' },
  agua: { lon: -75.5866, lat: 10.3315, nombre: 'Aljibes y Pozos Históricos · Línea 9.2', color: '#6ec6e6' },
  vivero: { lon: -75.5798, lat: 10.3348, nombre: 'Vivero y Manglar · Silvicultura 9.3', color: '#45d994' },
  residuos: { lon: -75.5850, lat: 10.3355, nombre: 'Acopio y Taller de Plástico · Línea 9.4', color: '#f5b45a' },
  ribera: { lon: -75.5877, lat: 10.3349, nombre: 'Carpintería de Ribera · Línea 9.5', color: '#e8a86b' },
  sanFernando: { lon: -75.5890, lat: 10.3252, nombre: 'Fuerte de San Fernando · Línea 9.6', color: '#f4f1ec' },
  sanJose: { lon: -75.5912, lat: 10.3218, nombre: 'Batería de San José · Canal', color: '#c490ff' },
  sanRafael: { lon: -75.5824, lat: 10.3292, nombre: 'Batería del Ángel San Rafael', color: '#e0917a' },
};

// Rutas 3D sobre el relieve de Bocachica
export const RUTAS_BOCACHICA = {
  agua: [
    [-75.5824, 10.3292],
    [-75.5841, 10.3340],
    [-75.5852, 10.3328],
    [-75.5866, 10.3315],
    [-75.5880, 10.3302],
  ],
  verde: [
    [-75.5782, 10.3360],
    [-75.5798, 10.3348],
    [-75.5820, 10.3344],
    [-75.5841, 10.3340],
    [-75.5852, 10.3328],
  ],
  residuos: [
    [-75.5868, 10.3320],
    [-75.5852, 10.3328],
    [-75.5841, 10.3340],
    [-75.5850, 10.3355],
    [-75.5877, 10.3349],
  ],
  oficios: [
    [-75.5905, 10.3365],
    [-75.5877, 10.3349],
    [-75.5858, 10.3358],
    [-75.5830, 10.3372],
  ],
  patrimonio: [
    [-75.5912, 10.3218],
    [-75.5890, 10.3252],
    [-75.5866, 10.3315],
    [-75.5852, 10.3328],
    [-75.5824, 10.3292],
    [-75.5841, 10.3340],
  ],
};

const loadImg = (src) =>
  new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error(`No se pudo cargar ${src}`));
    im.src = src;
  });

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Transformada de distancia euclidiana
function edt(width, height, land) {
  const INF = 1e12;
  const f = new Float32Array(width * height);
  for (let i = 0; i < f.length; i++) f[i] = land[i] ? INF : 0;
  const n = Math.max(width, height);
  const d = new Float32Array(n);
  const v = new Int32Array(n);
  const z = new Float32Array(n + 1);
  const line = new Float32Array(n);
  const pass = (len, get, set) => {
    for (let i = 0; i < len; i++) line[i] = get(i);
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s = (line[q] + q * q - (line[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k--;
        s = (line[q] + q * q - (line[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) * (q - v[k]) + line[v[k]];
    }
    for (let i = 0; i < len; i++) set(i, d[i]);
  };
  for (let x = 0; x < width; x++) pass(height, (y) => f[y * width + x], (y, val) => { f[y * width + x] = val; });
  for (let y = 0; y < height; y++) pass(width, (x) => f[y * width + x], (x, val) => { f[y * width + x] = val; });
  return f;
}

// Shader sobre el terreno para iluminar las zonas de Bocachica y oscurecer en capítulos de lectura
function parchearTerrenoAula(mat, U) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uMask = U.uMask;
    sh.uniforms.uZonas = U.uZonas;
    sh.uniforms.uZonasAmt = U.uZonasAmt;
    sh.uniforms.uDim = U.uDim;
    sh.uniforms.uTime = U.uTime;
    sh.uniforms.uCartografia = U.uCartografia;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 aWin;\nvarying vec2 vWin;\nvarying float vElev;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWin = aWin;\nvElev = position.y;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D uMask;
        uniform sampler2D uZonas;
        uniform vec3 uZonasAmt;
        uniform float uDim;
        uniform float uTime;
        uniform float uCartografia;
        varying vec2 vWin;
        varying float vElev;`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        vec4 mk = texture2D(uMask, vWin);
        if (mk.g < 0.45) discard;
        diffuseColor.rgb *= mix(1.0, 0.28, uDim);
        // Modo cartografía temática (curvas hipso y borde costero)
        if (uCartografia > 0.01) {
          float cota = fract(vElev * 0.08);
          float iso = smoothstep(0.92, 0.98, cota);
          vec3 hypso = mix(vec3(0.08, 0.28, 0.36), vec3(0.88, 0.57, 0.48), clamp(vElev / 85.0, 0.0, 1.0));
          diffuseColor.rgb = mix(diffuseColor.rgb, hypso, 0.58 * uCartografia);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96, 0.95, 0.92), iso * 0.45 * uCartografia);
        }
        // Zonas activas de Bocachica (R = memoria/patrimonio, G = refugio/verde, B = agua/oficios)
        vec3 zn = texture2D(uZonas, vWin).rgb;
        float pulso = 0.5 + 0.5 * sin(uTime * 2.4);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.88, 0.57, 0.48), 0.52 * zn.r * uZonasAmt.x);
        diffuseColor.rgb += vec3(0.95, 0.65, 0.52) * (1.0 - smoothstep(0.0, 0.18, abs(zn.r - 0.5))) * uZonasAmt.x * (0.32 + 0.28 * pulso);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.18, 0.72, 0.46), 0.56 * zn.g * uZonasAmt.y);
        diffuseColor.rgb += vec3(0.28, 0.95, 0.58) * (1.0 - smoothstep(0.0, 0.18, abs(zn.g - 0.5))) * uZonasAmt.y * (0.32 + 0.28 * pulso);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.32, 0.74, 0.92), 0.58 * zn.b * uZonasAmt.z);
        diffuseColor.rgb += vec3(0.45, 0.86, 1.0) * (1.0 - smoothstep(0.0, 0.18, abs(zn.b - 0.5))) * uZonasAmt.z * (0.32 + 0.28 * pulso);`
      );
  };
  mat.customProgramCacheKey = () => 'aula-bocachica-v1';
}

export async function crearEscenaAula(mount, { onProgreso = () => {} } = {}) {
  const small = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  const el = renderer.domElement;
  el.style.cssText = 'display:block;width:100%;height:100%;opacity:0;transition:opacity 1.1s ease';
  mount.appendChild(el);

  const cleanups = [() => { renderer.dispose(); if (el.parentNode === mount) mount.removeChild(el); }];
  let disposed = false;

  const TOTAL = 10;
  let hechas = 0;
  const track = (p) => p.then((r) => { hechas++; onProgreso(0.65 * (hechas / TOTAL), 'Cargando modelo territorial 3D'); return r; });
  const jsonOf = (u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.json(); });
  const gunzipJSON = async (u) => {
    const buf = await (await fetch(u)).arrayBuffer();
    const u8 = new Uint8Array(buf);
    if (u8[0] === 0x1f && u8[1] === 0x8b) {
      const stream = new Response(buf).body.pipeThrough(new DecompressionStream('gzip'));
      return JSON.parse(await new Response(stream).text());
    }
    return JSON.parse(new TextDecoder().decode(u8));
  };

  const [satImg, maskImg, patchImg, geoRef, veg, construcciones, normalsImg, ...demImgs] = await Promise.all([
    track(loadImg(`${BASE}textures/sat_base.jpg`)),
    track(loadImg(`${BASE}textures/isla_mascara.png`)),
    track(loadImg(`${BASE}textures/tierrabomba_satelite.jpg`)),
    track(jsonOf(`${DATA_URL}georef.json`)),
    track(jsonOf(`${DATA_URL}vegetacion.json`)),
    track(gunzipJSON(`${BASE}data/construcciones_tierra_bomba.json.gz`)),
    track(loadImg(`${BASE}textures/water_normals_fine.jpg`)),
    track(loadImg(`${BASE}data/elevation/1187_1929.png`)),
    track(loadImg(`${BASE}data/elevation/1188_1929.png`)),
    track(loadImg(`${BASE}data/elevation/1187_1930.png`)),
    loadImg(`${BASE}data/elevation/1188_1930.png`),
  ]);
  if (disposed) return null;

  // ---------- geometría del mosaico ----------
  const tx0 = MOSAIC.x0 + WIN.left / 256;
  const tx1 = MOSAIC.x0 + (WIN.left + WIN.w) / 256;
  const ty0 = MOSAIC.y0 + WIN.top / 256;
  const ty1 = MOSAIC.y0 + (WIN.top + WIN.h) / 256;
  const n15 = 2 ** 15;
  const latOf = (ty) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n15))) * 180) / Math.PI;
  const mpt = (40075016.686 * Math.cos((latOf((ty0 + ty1) / 2) * Math.PI) / 180)) / n15;
  const mpp = mpt / 256;
  const txc = (tx0 + tx1) / 2;
  const tyc = (ty0 + ty1) / 2;
  const toXZ = (tx, ty) => [(tx - txc) * mpt, (ty - tyc) * mpt];
  const lonLatToTile = (lon, lat) => [
    ((lon + 180) / 360) * n15,
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n15,
  ];
  const llToXZ = (lon, lat) => { const [tx, ty] = lonLatToTile(lon, lat); return toXZ(tx, ty); };

  // ---------- silueta de la isla ----------
  onProgreso(0.72, 'Procesando relieve de Tierra Bomba y Bocachica');
  const W = WIN.w;
  const H = WIN.h;
  const maskC = document.createElement('canvas');
  maskC.width = W;
  maskC.height = H;
  const mctx = maskC.getContext('2d', { willReadFrequently: true });
  mctx.drawImage(maskImg, 0, 0);
  const mdata = mctx.getImageData(0, 0, W, H).data;
  const land = new Uint8Array(W * H);
  const maskRGBA = new Uint8Array(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const val = mdata[i * 4 + 3] < 255 ? mdata[i * 4 + 3] : mdata[i * 4];
    maskRGBA[i * 4 + 1] = val;
    maskRGBA[i * 4 + 3] = 255;
    if (val > 127) land[i] = 1;
  }
  const maskTex = new THREE.DataTexture(maskRGBA, W, H, THREE.RGBAFormat);
  maskTex.minFilter = maskTex.magFilter = THREE.LinearFilter;
  maskTex.generateMipmaps = false;
  maskTex.needsUpdate = true;

  const distAt = (X, Z) => {
    const fx = ((X / mpt + txc - tx0) / (tx1 - tx0)) * W - 0.5;
    const fy = ((Z / mpt + tyc - ty0) / (ty1 - ty0)) * H - 0.5;
    if (fx < 0 || fy < 0 || fx > W - 1.001 || fy > H - 1.001) return -1;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    return land[y0 * W + x0] ? 10 : -1;
  };

  // ---------- relieve Terrarium ----------
  const SM = 4;
  const smallC = document.createElement('canvas');
  smallC.width = Math.round(W / SM);
  smallC.height = Math.round(H / SM);
  const sctx = smallC.getContext('2d', { willReadFrequently: true });
  sctx.filter = 'blur(2px)';
  sctx.drawImage(maskC, 0, 0, smallC.width, smallC.height);
  const sdata = sctx.getImageData(0, 0, smallC.width, smallC.height).data;
  const smallMask = (u, v) => {
    const x = Math.max(0, Math.min(smallC.width - 1, Math.floor(u * smallC.width)));
    const y = Math.max(0, Math.min(smallC.height - 1, Math.floor(v * smallC.height)));
    const i = (y * smallC.width + x) * 4;
    return (sdata[i + 3] < 255 ? sdata[i + 3] : sdata[i]) / 255;
  };
  const demC = document.createElement('canvas');
  demC.width = demC.height = 512;
  const dctx = demC.getContext('2d', { willReadFrequently: true });
  dctx.drawImage(demImgs[0], 0, 0);
  dctx.drawImage(demImgs[1], 256, 0);
  dctx.drawImage(demImgs[2], 0, 256);
  dctx.drawImage(demImgs[3], 256, 256);
  const ddata = dctx.getImageData(0, 0, 512, 512).data;
  const demPx = (x, y) => {
    x = Math.max(0, Math.min(511, x));
    y = Math.max(0, Math.min(511, y));
    const i = (y * 512 + x) * 4;
    return ddata[i] * 256 + ddata[i + 1] + ddata[i + 2] / 256 - 32768;
  };
  const demAtTile = (tx, ty) => {
    const fx = (tx / 8 - DEM.x0) * 256 - 0.5;
    const fy = (ty / 8 - DEM.y0) * 256 - 0.5;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const ax = fx - x0;
    const ay = fy - y0;
    return demPx(x0, y0) * (1 - ax) * (1 - ay) + demPx(x0 + 1, y0) * ax * (1 - ay) + demPx(x0, y0 + 1) * (1 - ax) * ay + demPx(x0 + 1, y0 + 1) * ax * ay;
  };

  const NX = small ? 130 : 180;
  const NY = Math.round((NX * H) / W);
  const pos = new Float32Array((NX + 1) * (NY + 1) * 3);
  const uvSat = new Float32Array((NX + 1) * (NY + 1) * 2);
  const winUV = new Float32Array((NX + 1) * (NY + 1) * 2);
  const heights = new Float32Array((NX + 1) * (NY + 1));
  {
    let p = 0;
    let q = 0;
    for (let j = 0; j <= NY; j++) {
      for (let i = 0; i <= NX; i++) {
        const u = i / NX;
        const v = j / NY;
        const tx = tx0 + u * (tx1 - tx0);
        const ty = ty0 + v * (ty1 - ty0);
        const [X, Z] = toXZ(tx, ty);
        const landW = smooth(0.3, 0.85, smallMask(u, v));
        const h = Math.max(0, demAtTile(tx, ty)) * EXAG * landW + 0.3 * landW;
        heights[j * (NX + 1) + i] = h;
        pos[p++] = X; pos[p++] = h; pos[p++] = Z;
        uvSat[q] = (tx - MOSAIC.x0) / MOSAIC.nx;
        uvSat[q + 1] = 1 - (ty - MOSAIC.y0) / MOSAIC.ny;
        winUV[q] = u;
        winUV[q + 1] = v;
        q += 2;
      }
    }
  }
  const idx = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i;
      idx.push(a, a + NX + 1, a + 1, a + 1, a + NX + 1, a + NX + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvSat, 2));
  geo.setAttribute('aWin', new THREE.BufferAttribute(winUV, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const heightAtUV = (u, v) => {
    const fi = Math.max(0, Math.min(NX - 1e-3, u * NX));
    const fj = Math.max(0, Math.min(NY - 1e-3, v * NY));
    const i = Math.floor(fi);
    const j = Math.floor(fj);
    const ax = fi - i;
    const ay = fj - j;
    const Hh = (a, b) => heights[b * (NX + 1) + a];
    return Hh(i, j) * (1 - ax) * (1 - ay) + Hh(i + 1, j) * ax * (1 - ay) + Hh(i, j + 1) * (1 - ax) * ay + Hh(i + 1, j + 1) * ax * ay;
  };
  const heightAtXZ = (X, Z) => heightAtUV(clamp01((X / mpt + txc - tx0) / (tx1 - tx0)), clamp01((Z / mpt + tyc - ty0) / (ty1 - ty0)));

  const maxTex = renderer.capabilities.maxTextureSize;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const textureFrom = (img, maxSide) => {
    const sc = Math.min(1, maxSide / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * sc);
    c.height = Math.round(img.height * sc);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    return t;
  };

  // Textura de zonas de Bocachica pintadas sobre el terreno (R = memoria/patrimonio, G = refugio R9/silvicultura, B = agua/oficios)
  const PW = Math.round(W / 2);
  const PH = Math.round(H / 2);
  const zonasCanvas = document.createElement('canvas');
  zonasCanvas.width = PW;
  zonasCanvas.height = PH;
  {
    const zc = zonasCanvas.getContext('2d');
    zc.fillStyle = '#000';
    zc.fillRect(0, 0, PW, PH);
    zc.globalCompositeOperation = 'lighter';
    zc.filter = 'blur(3px)';
    const aPx = (lon, lat) => {
      const [X, Z] = llToXZ(lon, lat);
      return [((X / mpt + txc - tx0) / (tx1 - tx0)) * PW, ((Z / mpt + tyc - ty0) / (ty1 - ty0)) * PH];
    };
    const circulo = (color, lon, lat, rMetros) => {
      const [x, y] = aPx(lon, lat);
      const rPx = (rMetros / (mpp * 2));
      zc.fillStyle = color;
      zc.beginPath();
      zc.arc(x, y, rPx, 0, Math.PI * 2);
      zc.fill();
    };
    // R: Casco de Bocachica + Fuertes patrimoniales
    circulo('rgb(255,0,0)', NODOS_BOCACHICA.casco.lon, NODOS_BOCACHICA.casco.lat, 240);
    circulo('rgb(255,0,0)', NODOS_BOCACHICA.sanFernando.lon, NODOS_BOCACHICA.sanFernando.lat, 190);
    circulo('rgb(255,0,0)', NODOS_BOCACHICA.sanJose.lon, NODOS_BOCACHICA.sanJose.lat, 150);
    circulo('rgb(255,0,0)', NODOS_BOCACHICA.sanRafael.lon, NODOS_BOCACHICA.sanRafael.lat, 170);
    // G: Gimnasio Cristiano R9 + Vivero y Manglar
    circulo('rgb(0,255,0)', NODOS_BOCACHICA.escuelaR9.lon, NODOS_BOCACHICA.escuelaR9.lat, 220);
    circulo('rgb(0,255,0)', NODOS_BOCACHICA.vivero.lon, NODOS_BOCACHICA.vivero.lat, 280);
    // B: Sistema hídrico + Carpintería de ribera + Acopio residuos
    circulo('rgb(0,0,255)', NODOS_BOCACHICA.agua.lon, NODOS_BOCACHICA.agua.lat, 210);
    circulo('rgb(0,0,255)', NODOS_BOCACHICA.ribera.lon, NODOS_BOCACHICA.ribera.lat, 190);
    circulo('rgb(0,0,255)', NODOS_BOCACHICA.residuos.lon, NODOS_BOCACHICA.residuos.lat, 175);
  }
  const zonasTex = new THREE.CanvasTexture(zonasCanvas);
  zonasTex.flipY = false;
  zonasTex.minFilter = zonasTex.magFilter = THREE.LinearFilter;
  zonasTex.generateMipmaps = false;

  const U = {
    uMask: { value: maskTex },
    uZonas: { value: zonasTex },
    uZonasAmt: { value: new THREE.Vector3(0, 0, 0) },
    uDim: { value: 0 },
    uTime: { value: 0 },
    uCartografia: { value: 0 },
  };
  const terrainMat = new THREE.MeshStandardMaterial({ map: textureFrom(satImg, maxTex), roughness: 1, metalness: 0 });
  parchearTerrenoAula(terrainMat, U);
  const terrain = new THREE.Mesh(geo, terrainMat);

  // ---------- detalle z18 ----------
  const PM = geoRef.mosaico;
  const tile18 = PM.px / 256;
  const NP = small ? 90 : 130;
  const ppos = new Float32Array((NP + 1) * (NP + 1) * 3);
  const puv = new Float32Array((NP + 1) * (NP + 1) * 2);
  const pwin = new Float32Array((NP + 1) * (NP + 1) * 2);
  {
    let a = 0;
    let b = 0;
    for (let j = 0; j <= NP; j++) {
      for (let i = 0; i <= NP; i++) {
        const tx = (PM.x0 + (i / NP) * tile18) / 8;
        const ty = (PM.y0 + (j / NP) * tile18) / 8;
        const [X, Z] = toXZ(tx, ty);
        const u = (tx - tx0) / (tx1 - tx0);
        const v = (ty - ty0) / (ty1 - ty0);
        ppos[a++] = X;
        ppos[a++] = heightAtUV(clamp01(u), clamp01(v)) + 0.4;
        ppos[a++] = Z;
        puv[b] = i / NP; puv[b + 1] = 1 - j / NP;
        pwin[b] = u; pwin[b + 1] = v;
        b += 2;
      }
    }
  }
  const pidx = [];
  for (let j = 0; j < NP; j++) {
    for (let i = 0; i < NP; i++) {
      const a = j * (NP + 1) + i;
      pidx.push(a, a + NP + 1, a + 1, a + 1, a + NP + 1, a + NP + 2);
    }
  }
  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
  pgeo.setAttribute('uv', new THREE.BufferAttribute(puv, 2));
  pgeo.setAttribute('aWin', new THREE.BufferAttribute(pwin, 2));
  pgeo.setIndex(pidx);
  pgeo.computeVertexNormals();
  const patchMat = new THREE.MeshStandardMaterial({ map: textureFrom(patchImg, maxTex), roughness: 1, metalness: 0 });
  parchearTerrenoAula(patchMat, U);
  const patch = new THREE.Mesh(pgeo, patchMat);

  // Coordenadas XZ de los nodos de Bocachica
  const nodosXZ = {};
  for (const [k, v] of Object.entries(NODOS_BOCACHICA)) {
    const [X, Z] = llToXZ(v.lon, v.lat);
    nodosXZ[k] = { ...v, x: X, z: Z, y: heightAtXZ(X, Z) };
  }
  const bx = nodosXZ.casco.x;
  const bz = nodosXZ.casco.z;

  // ---------- construcciones reales (2.600 viviendas vernáculas caribeñas con muros + cubiertas a 4 aguas) ----------
  onProgreso(0.82, 'Levantando las 2.600 viviendas caribeñas y calculando huellas catastrales');

  // Textura procedural de fachada arquitectónica (mampostería/madera, zócalo, ventanas con marco y puerta)
  const crearTexturaFachada = () => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const g = c.getContext('2d');
    // Fondo de muro encalado con ligera variación de revoque
    g.fillStyle = '#f6f2eb';
    g.fillRect(0, 0, 256, 128);
    for (let y = 0; y < 128; y += 4) {
      g.fillStyle = y % 8 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.03)';
      g.fillRect(0, y, 256, 2);
    }
    // Sombra bajo el alero superior
    const gradTop = g.createLinearGradient(0, 0, 0, 22);
    gradTop.addColorStop(0, 'rgba(20,15,10,0.38)');
    gradTop.addColorStop(1, 'rgba(20,15,10,0.0)');
    g.fillStyle = gradTop;
    g.fillRect(0, 0, 256, 22);
    // Zócalo inferior de concreto/piedra coralina
    g.fillStyle = 'rgba(75,62,52,0.28)';
    g.fillRect(0, 102, 256, 26);
    g.fillStyle = 'rgba(40,32,26,0.35)';
    g.fillRect(0, 100, 256, 3);

    // Función para dibujar ventana con calado/postigos caribeños
    const ventana = (x, y, w, h) => {
      g.fillStyle = 'rgba(255,255,255,0.88)';
      g.fillRect(x - 3, y - 3, w + 6, h + 6);
      g.fillStyle = '#24323d';
      g.fillRect(x, y, w, h);
      // Postigos / persianas de madera
      g.fillStyle = 'rgba(255,255,255,0.65)';
      g.fillRect(x + w * 0.48, y, 2, h);
      g.fillRect(x, y + h * 0.46, w, 2);
      // Alféizar con sombra
      g.fillStyle = 'rgba(30,24,20,0.35)';
      g.fillRect(x - 4, y + h + 3, w + 8, 3);
    };

    ventana(26, 36, 36, 42);
    ventana(194, 36, 36, 42);
    ventana(82, 38, 28, 36);

    // Puerta de madera vernácula con calado superior (ventilación cruzada)
    const px = 128;
    const py = 34;
    const pw = 34;
    const ph = 92;
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.fillRect(px - 3, py - 3, pw + 6, ph + 3);
    g.fillStyle = '#5c3c28';
    g.fillRect(px, py + 16, pw, ph - 16);
    // Calado superior de ventilación sobre la puerta
    g.fillStyle = '#1e2933';
    g.fillRect(px + 2, py + 2, pw - 4, 11);
    g.fillStyle = 'rgba(255,255,255,0.55)';
    for (let lx = px + 6; lx < px + pw - 4; lx += 6) {
      g.fillRect(lx, py + 2, 2, 11);
    }
    // Tableros de la puerta
    g.strokeStyle = 'rgba(30,18,10,0.45)';
    g.lineWidth = 2;
    g.strokeRect(px + 5, py + 22, pw - 10, 30);
    g.strokeRect(px + 5, py + 58, pw - 10, 28);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  };

  // Textura procedural de cubierta (nervaduras de teja/zinc acanalado y cumbrera)
  const crearTexturaTecho = () => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#d8d2cb';
    g.fillRect(0, 0, 128, 128);
    for (let x = 0; x < 128; x += 6) {
      g.fillStyle = x % 12 === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)';
      g.fillRect(x, 0, 3, 128);
    }
    for (let y = 0; y < 128; y += 16) {
      g.fillStyle = 'rgba(0,0,0,0.09)';
      g.fillRect(0, y, 128, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  };

  const fachadaTex = crearTexturaFachada();
  const techoTex = crearTexturaTecho();

  const houses = [];
  // Índice espacial 2D de huellas de casas para que los árboles crezcan en patios, calles, colinas y manglares sin atravesar techos
  const HCELL = 16;
  const houseGrid = new Map();
  const addHouseToGrid = (hh) => {
    const r = Math.max(hh.w, hh.d) * 0.58 + 1.8;
    const gx0 = Math.floor((hh.x - r) / HCELL);
    const gx1 = Math.floor((hh.x + r) / HCELL);
    const gz0 = Math.floor((hh.z - r) / HCELL);
    const gz1 = Math.floor((hh.z + r) / HCELL);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gz = gz0; gz <= gz1; gz++) {
        const k = `${gx}:${gz}`;
        let arr = houseGrid.get(k);
        if (!arr) { arr = []; houseGrid.set(k, arr); }
        arr.push(hh);
      }
    }
  };
  const enHuellaCasa = (X, Z) => {
    const k = `${Math.floor(X / HCELL)}:${Math.floor(Z / HCELL)}`;
    const arr = houseGrid.get(k);
    if (!arr) return false;
    for (let i = 0; i < arr.length; i++) {
      const h = arr[i];
      const dx = X - h.x;
      const dz = Z - h.z;
      const ca = Math.cos(h.ang);
      const sa = Math.sin(h.ang);
      const lx = Math.abs(dx * ca + dz * sa);
      const lz = Math.abs(-dx * sa + dz * ca);
      if (lx < h.w * 0.54 + 1.2 && lz < h.d * 0.54 + 1.2) return true;
    }
    return false;
  };

  for (const [, refH, ring] of construcciones.buildings) {
    let cx = 0;
    let cy = 0;
    const pts = ring.map(([lon, lat]) => { const [X, Z] = llToXZ(lon, lat); cx += X; cy += Z; return [X, Z]; });
    cx /= pts.length;
    cy /= pts.length;
    let sxx = 0; let szz = 0; let sxz = 0;
    for (const [X, Z] of pts) { sxx += (X - cx) ** 2; szz += (Z - cy) ** 2; sxz += (X - cx) * (Z - cy); }
    const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    let minA = 1e9; let maxA = -1e9; let minB = 1e9; let maxB = -1e9;
    for (const [X, Z] of pts) {
      const a = (X - cx) * ca + (Z - cy) * sa;
      const b = -(X - cx) * sa + (Z - cy) * ca;
      minA = Math.min(minA, a); maxA = Math.max(maxA, a); minB = Math.min(minB, b); maxB = Math.max(maxB, b);
    }
    if (distAt(cx, cy) < 0) continue;
    // Dejamos libre el predio del Gimnasio Cristiano R9 para que su modelo 3D detallado luzca limpio
    if (Math.hypot(cx - nodosXZ.escuelaR9.x, cy - nodosXZ.escuelaR9.z) < 42) continue;
    const distBoca = Math.hypot(cx - bx, cy - bz);
    const wReal = THREE.MathUtils.clamp(maxA - minA, 4.2, 22);
    const dReal = THREE.MathUtils.clamp(maxB - minB, 4.2, 22);
    const hReal = THREE.MathUtils.clamp(refH || 3.8, 3.2, 7.2);
    const hh = {
      x: cx,
      z: cy,
      ang,
      w: wReal,
      d: dReal,
      h: hReal,
      y: heightAtXZ(cx, cy),
      enBocachica: distBoca < 1350,
    };
    houses.push(hh);
    addHouseToGrid(hh);
  }

  // ---------- VEGETACIÓN REAL DE TODA TIERRA BOMBA Y BOCACHICA ----------
  // 1) Todos los árboles escaneados de vegetacion.json (mosaico z18 norte/centro)
  // 2) Detección real de dosel arbóreo (índice de verdor + máximos locales de copa)
  //    sobre la ortofoto satelital Esri (sat_base.jpg) en el 100 % de la isla:
  //    - Manglar costero (Ciénaga de los Vásquez, Bahía de Bocachica, Caño de Loro, esteros)
  //    - Bosque Seco Tropical en colinas y laderas (Cerro del Ángel San Rafael, Loma de las Ánimas, meseta central)
  //    - Arbolado de patios y sombra urbana en Bocachica, Caño de Loro, Tierra Bomba y Punta Arena
  onProgreso(0.88, 'Detectando e instanciando la vegetación real de toda Tierra Bomba');
  const cr = Math.cos(geoRef.rot);
  const sr = Math.sin(geoRef.rot);
  const modelToLL = (x, y) => {
    const px = (x - geoRef.tx) / geoRef.sc;
    const py = (y - geoRef.ty) / geoRef.sc;
    return [geoRef.lon0 + (px * cr + py * sr) / geoRef.kx, geoRef.lat0 + (-px * sr + py * cr) / geoRef.ky];
  };
  const especies = await prepareTreeSpecies();
  if (disposed) return null;

  // Grid de ocupación de árboles (celda de 7m) para evitar que dos árboles queden superpuestos
  const TCELL = 7;
  const treeOcc = new Set();
  const marcarArbol = (X, Z) => {
    const k = `${Math.floor(X / TCELL)}:${Math.floor(Z / TCELL)}`;
    if (treeOcc.has(k)) return false;
    treeOcc.add(k);
    return true;
  };

  const treeBase = [];
  // Fuente 1: 100% de los árboles de vegetacion.json (sin truncar a 1200)
  veg.arboles.forEach(([x, y, size, dense], i) => {
    if (small && i % 2 === 1) return;
    const [lo, la] = modelToLL(x, y);
    const [X, Z] = llToXZ(lo, la);
    if (distAt(X, Z) <= 0) return;
    if (enHuellaCasa(X, Z)) return;
    if (!marcarArbol(X, Z)) return;
    const elev = heightAtXZ(X, Z);
    treeBase.push({
      x: X,
      y: elev + 0.35,
      z: Z,
      rot: ((Math.imul(i + 7, 40503) >>> 0) % 628) / 100,
      height: 8.5 * size * 1.25 * (dense ? 0.94 : 1.06),
      tone: ((Math.imul(i + 3, 69069) >>> 0) % 100) / 100,
      ecotipo: elev < 3.6 ? 'manglar' : 'bosque_seco',
    });
  });

  // Fuente 2: Detección de copas reales sobre la imagen satelital completa de Tierra Bomba (satImg)
  {
    const satC = document.createElement('canvas');
    satC.width = W;
    satC.height = H;
    const sctx2 = satC.getContext('2d', { willReadFrequently: true });
    const sx0 = (WIN.left / (MOSAIC.nx * 256)) * satImg.width;
    const sy0 = (WIN.top / (MOSAIC.ny * 256)) * satImg.height;
    const sw0 = (WIN.w / (MOSAIC.nx * 256)) * satImg.width;
    const sh0 = (WIN.h / (MOSAIC.ny * 256)) * satImg.height;
    sctx2.drawImage(satImg, sx0, sy0, sw0, sh0, 0, 0, W, H);
    const srgb = sctx2.getImageData(0, 0, W, H).data;

    const pasoBase = small ? 3 : 2; // ~9.4m por celda en escritorio
    let seed = 17;
    for (let py = 3; py < H - 3; py += pasoBase) {
      for (let px = 3; px < W - 3; px += pasoBase) {
        // Buscamos el máximo local de verdor dentro de la celda pasoBase × pasoBase
        let bestScore = -999;
        let bxPx = px;
        let byPx = py;
        let bR = 0; let bG = 0; let bB = 0;

        for (let dy = 0; dy < pasoBase; dy++) {
          const yy = py + dy;
          if (yy >= H) continue;
          for (let dx = 0; dx < pasoBase; dx++) {
            const xx = px + dx;
            if (xx >= W) continue;
            const idxPx = yy * W + xx;
            if (!land[idxPx]) continue;
            const o = idxPx * 4;
            const R = srgb[o];
            const G = srgb[o + 1];
            const B = srgb[o + 2];
            // Índice de verdor satelital (ExG + diferencia G-R, descartando arena brillante, mar y cubiertas claras)
            const score = (2 * G - R - B) + (G - R) * 1.4;
            if (score > bestScore) {
              bestScore = score;
              bxPx = xx;
              byPx = yy;
              bR = R; bG = G; bB = B;
            }
          }
        }

        // Umbral de copa vegetal real en la ortofoto Esri de Tierra Bomba
        // Cubre manglar denso (verde oscuro), bosque seco tropical en lomas (verde oliva) y árboles en patios urbanos
        const esCopaSatelital =
          bG >= 20 &&
          bG <= 156 &&
          bR <= 146 &&
          bG >= bR * 0.91 &&
          bG >= bB * 1.01 &&
          bestScore >= 3;

        if (!esCopaSatelital) continue;

        const u = (bxPx + 0.5) / W;
        const v = (byPx + 0.5) / H;
        const tx = tx0 + u * (tx1 - tx0);
        const ty = ty0 + v * (ty1 - ty0);
        const [X, Z] = toXZ(tx, ty);

        // En el tercio norte (lejos de Bocachica) muestreamos 1 de cada 2 celdas para mantener 60fps con cobertura total
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const distBoca = Math.hypot(X - bx, Z - bz);
        if (distBoca > 2400 && (seed & 1) === 1 && bestScore < 16) continue;

        if (enHuellaCasa(X, Z)) continue;
        // Evitamos tapar el patio interior de la cancha del colegio R9
        if (Math.hypot(X - nodosXZ.escuelaR9.x, Z - nodosXZ.escuelaR9.z) < 24) continue;
        if (!marcarArbol(X, Z)) continue;

        const elev = heightAtUV(u, v);
        const esManglar = elev < 4.2 && bG > bR * 1.03 && bR < 92;
        const esUrbano = distBoca < 950 && elev < 14;
        const ecotipo = esManglar ? 'manglar' : esUrbano ? 'sombra' : 'bosque_seco';

        // Altura proporcional al vigor del dosel en la ortofoto satelital
        const vigor = clamp01((bestScore - 3) / 38);
        const hArbol = esManglar
          ? 8.5 + vigor * 5.2 + ((seed % 7) * 0.35)
          : esUrbano
            ? 7.2 + vigor * 4.2 + ((seed % 5) * 0.3)
            : 7.8 + vigor * 5.8 + ((seed % 9) * 0.35);

        treeBase.push({
          x: X,
          y: elev + 0.35,
          z: Z,
          rot: ((seed >>> 8) % 628) / 100,
          height: hArbol,
          tone: ((seed >>> 16) % 100) / 100,
          ecotipo,
        });
      }
    }
  }

  // Fuente 3: Corredor de silvicultura comunitaria, vivero de manglar y arbolado perimetral del colegio R9 (Línea 9.3)
  for (let i = 0; i < 160; i++) {
    const ang = i * 2.39996;
    const rad = 28 + (i % 18) * 12;
    const centro = i % 2 === 0 ? nodosXZ.vivero : nodosXZ.escuelaR9;
    const X = centro.x + Math.cos(ang) * rad;
    const Z = centro.z + Math.sin(ang) * rad;
    if (distAt(X, Z) > 0 && !enHuellaCasa(X, Z) && marcarArbol(X, Z)) {
      const elev = heightAtXZ(X, Z);
      treeBase.push({
        x: X,
        y: elev + 0.35,
        z: Z,
        rot: (i * 1.7) % 6.28,
        height: 9.2 + (i % 5) * 1.6,
        tone: (i % 10) / 10,
        ecotipo: i % 2 === 0 ? 'manglar' : 'sombra',
      });
    }
  }
  const treesGroup = instanceTrees(especies, treeBase, 95, false);

  // Geometría 1: Muros con textura de fachada
  const wallGeo = new THREE.BoxGeometry(1, 1, 1);
  wallGeo.translate(0, 0.5, 0);
  const wallMat = new THREE.MeshStandardMaterial({
    map: fachadaTex,
    roughness: 0.86,
    metalness: 0.04,
  });
  const houseWallsMesh = new THREE.InstancedMesh(wallGeo, wallMat, houses.length);
  houseWallsMesh.frustumCulled = false;

  // Geometría 2: Cubiertas piramidales / a 4 aguas con alero caribeño
  const roofGeo = new THREE.ConeGeometry(0.78, 1, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.translate(0, 0.5, 0);
  const roofMat = new THREE.MeshStandardMaterial({
    map: techoTex,
    roughness: 0.74,
    metalness: 0.14,
  });
  const houseRoofsMesh = new THREE.InstancedMesh(roofGeo, roofMat, houses.length);
  houseRoofsMesh.frustumCulled = false;

  const m4 = new THREE.Matrix4();
  const qn = new THREE.Quaternion();
  const upV = new THREE.Vector3(0, 1, 0);
  const sv = new THREE.Vector3();
  const pv = new THREE.Vector3();
  const wallCol = new THREE.Color();
  const roofCol = new THREE.Color();

  // Paletas arquitectónicas reales del Caribe insular (muros claros + cubiertas de barro/zinc)
  const PALETA_MUROS = [
    new THREE.Color(0xf5efe4), // Blanco cal cálido
    new THREE.Color(0xede3d2), // Piedra coralina clara
    new THREE.Color(0xe6d6be), // Arena de Bocachica
    new THREE.Color(0xf2dfd5), // Rosa coral suave
    new THREE.Color(0xdcece7), // Verde mar caribeño pálido
    new THREE.Color(0xf0e2c4), // Ocre colonial suave
    new THREE.Color(0xdfeaf2), // Azul brisa claro
  ];
  const PALETA_TECHOS_BOCA = [
    new THREE.Color(0xb85d44), // Teja de barro cocido
    new THREE.Color(0xc96e4b), // Terracota caribeña
    new THREE.Color(0x919ca6), // Zinc galvanizado
    new THREE.Color(0x826658), // Lámina oxidada cálida
    new THREE.Color(0xb87b4f), // Ocre arcilla
  ];
  const PALETA_TECHOS_ISLA = [
    new THREE.Color(0xa66a56),
    new THREE.Color(0x8e969d),
    new THREE.Color(0x997b66),
    new THREE.Color(0xb3785c),
  ];

  let ultimaEscalaCasas = -1;
  const updateHouses = (resaltarBocachica, escala = 1.0) => {
    ultimaEscalaCasas = escala;
    houses.forEach((hh, k) => {
      qn.setFromAxisAngle(upV, -hh.ang);
      const wScaled = hh.w * escala;
      const dScaled = hh.d * escala;
      const hWall = hh.h * 0.74 * Math.min(1.25, escala);
      const hRoof = Math.max(1.35, hh.h * 0.42) * Math.min(1.25, escala);

      // Matriz de muros (hundimos 0.35m la base para asentar en pendientes)
      pv.set(hh.x, hh.y - 0.35, hh.z);
      sv.set(wScaled, hWall + 0.35, dScaled);
      m4.compose(pv, qn, sv);
      houseWallsMesh.setMatrixAt(k, m4);

      // Matriz de cubierta con alero de 1.12x sobre el muro
      pv.set(hh.x, hh.y + hWall - 0.05, hh.z);
      sv.set(wScaled * 1.12, hRoof, dScaled * 1.12);
      m4.compose(pv, qn, sv);
      houseRoofsMesh.setMatrixAt(k, m4);

      // Color de muros y cubiertas
      wallCol.copy(PALETA_MUROS[k % PALETA_MUROS.length]).offsetHSL(0, 0, ((k * 13) % 7 - 3) * 0.01);
      houseWallsMesh.setColorAt(k, wallCol);

      if (resaltarBocachica && hh.enBocachica) {
        roofCol.copy(PALETA_TECHOS_BOCA[k % PALETA_TECHOS_BOCA.length]).offsetHSL(0, 0, ((k * 19) % 7 - 3) * 0.012);
      } else {
        roofCol.copy(PALETA_TECHOS_ISLA[k % PALETA_TECHOS_ISLA.length]).offsetHSL(0, 0, ((k * 23) % 7 - 3) * 0.012);
      }
      houseRoofsMesh.setColorAt(k, roofCol);
    });
    houseWallsMesh.instanceMatrix.needsUpdate = true;
    houseRoofsMesh.instanceMatrix.needsUpdate = true;
    if (houseWallsMesh.instanceColor) houseWallsMesh.instanceColor.needsUpdate = true;
    if (houseRoofsMesh.instanceColor) houseRoofsMesh.instanceColor.needsUpdate = true;
  };
  updateHouses(true, 1.0);

  // ---------- escena, cielo, mar, luces ----------
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x9fc6d4, 0.000012);
  try {
    const envTex = createSkyEnvironment(renderer);
    scene.environment = envTex;
    cleanups.push(() => envTex.dispose());
  } catch { /* fallback sin PMREM */ }
  scene.add(terrain, patch, houseWallsMesh, houseRoofsMesh, treesGroup);

  const sky = new Sky();
  sky.scale.setScalar(450000);
  const su = sky.material.uniforms;
  su.turbidity.value = 2.1;
  su.rayleigh.value = 2.3;
  su.mieCoefficient.value = 0.004;
  su.mieDirectionalG.value = 0.82;
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 36), THREE.MathUtils.degToRad(218));
  su.sunPosition.value.copy(sunDir);
  scene.add(sky);

  const normals = new THREE.Texture(normalsImg);
  normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
  normals.repeat.set(900, 900);
  normals.needsUpdate = true;

  // Orilla y shader de mar idéntico a tesis_tercer_corte
  const SH = 4;
  const sw = Math.ceil(W / SH);
  const sh2 = Math.ceil(H / SH);
  const marArr = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) marArr[i] = land[i] ? 0 : 1;
  const sqMar = edt(W, H, marArr);
  const shoreData = new Uint8Array(sw * sh2 * 4);
  for (let y = 0; y < sh2; y++) {
    for (let x = 0; x < sw; x++) {
      const dm = Math.sqrt(sqMar[Math.min(H - 1, y * SH) * W + Math.min(W - 1, x * SH)]) * mpp;
      const o = (y * sw + x) * 4;
      shoreData[o] = Math.round(255 * Math.min(1, dm / 900));
      shoreData[o + 3] = 255;
    }
  }
  const shoreTex = new THREE.DataTexture(shoreData, sw, sh2, THREE.RGBAFormat);
  shoreTex.minFilter = shoreTex.magFilter = THREE.LinearFilter;
  shoreTex.wrapS = shoreTex.wrapT = THREE.ClampToEdgeWrapping;
  shoreTex.generateMipmaps = false;
  shoreTex.needsUpdate = true;

  const waterUniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uTime: { value: 0 }, uNormals: { value: normals }, uShore: { value: shoreTex }, uSun: { value: sunDir.clone() },
      uWin: { value: new THREE.Vector4(txc - tx0, tyc - ty0, tx1 - tx0, ty1 - ty0) }, uMpt: { value: mpt },
      uDeep: { value: new THREE.Color(0x02151f) }, uMid: { value: new THREE.Color(0x07323f) }, uShallow: { value: new THREE.Color(0x2a5f60) },
      uHorizon: { value: new THREE.Color(0xa9cfdc) }, uZenith: { value: new THREE.Color(0x2c6fb0) },
    },
  ]);
  const waterMat = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    fog: true,
    vertexShader: `
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      uniform float uTime; uniform sampler2D uNormals; uniform sampler2D uShore; uniform vec3 uSun; uniform vec4 uWin; uniform float uMpt;
      uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uShallow; uniform vec3 uHorizon; uniform vec3 uZenith;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      vec2 nm(vec2 p) { return texture2D(uNormals, p).rg * 2.0 - 1.0; }
      void main() {
        float dc = length(cameraPosition - vWorld);
        vec2 p = vWorld.xz;
        float lod = 1.0 - smoothstep(250.0, 2600.0, dc);
        vec2 n2 = nm(p / 180.0 + vec2(uTime * 0.012, uTime * 0.008)) * 0.9
                + nm(p / 61.0 + vec2(-uTime * 0.02, uTime * 0.013)) * 0.7
                + nm(p / 17.0 + vec2(uTime * 0.035, -uTime * 0.03)) * 0.55 * lod
                + nm(p / 5.3 + vec2(-uTime * 0.05, uTime * 0.045)) * 0.3 * lod;
        float k = mix(0.16, 0.32, lod);
        vec3 n = normalize(vec3(n2.x * k, 1.0, n2.y * k));
        vec3 V = normalize(cameraPosition - vWorld);
        float cosT = max(dot(n, V), 0.0);
        float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
        vec3 R = reflect(-V, n);
        R.y = abs(R.y);
        vec3 skyCol = mix(uHorizon, uZenith, pow(clamp(R.y, 0.0, 1.0), 0.45));
        vec2 uv = (p / uMpt + uWin.xy) / uWin.zw;
        float enVentana = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
        float dNorm = mix(1.0, texture2D(uShore, clamp(uv, 0.0, 1.0)).r, enVentana);
        vec3 body = mix(uShallow, uMid, smoothstep(0.0, 0.22, dNorm));
        body = mix(body, uDeep, smoothstep(0.18, 0.85, dNorm));
        vec3 col = mix(body, skyCol, F * 0.65);
        vec3 H = normalize(uSun + V);
        float spec = pow(max(dot(n, H), 0.0), 180.0) * 1.9;
        col += vec3(1.0, 0.92, 0.78) * spec;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(240000, 240000), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.05;
  scene.add(water);

  const sun = new THREE.DirectionalLight(0xfff1dc, 2.7);
  sun.position.copy(sunDir).multiplyScalar(3000);
  scene.add(sun, new THREE.HemisphereLight(0xd9ecff, 0x5c5346, 0.85));

  // ===========================================================================
  // CAPAS 3D DEL AULA AMBIENTAL EN BOCACHICA:
  //  - Prototipo 3D Gimnasio Cristiano de Bocachica (R9): cubierta bioclimática,
  //    aljibe de captación pluvial, lluvia animada, ágora sombreada y taller
  //  - Haces de luz (beams) + anillos pulsantes en los 9 nodos de Bocachica
  //  - 5 Rutas 3D con flujo animado (Agua, Verde, Residuos, Oficios, Patrimonio)
  //  - Etiquetas 3D flotantes (Sprites)
  // ===========================================================================
  const aulaGroup = new THREE.Group();
  scene.add(aulaGroup);

  // Prototipo 3D en el Gimnasio Cristiano de Bocachica (R9):
  // Pabellones de aulas con celosías, cancha de preescolar sombreada, cubierta en V captadora, aljibe y ágora
  const sNode = nodosXZ.escuelaR9;
  const escuelaG = new THREE.Group();
  escuelaG.position.set(sNode.x, sNode.y, sNode.z);
  aulaGroup.add(escuelaG);
  {
    const matMuroEsc = new THREE.MeshStandardMaterial({ map: fachadaTex, color: 0xf4efe4, roughness: 0.85 });
    const matMadera = new THREE.MeshStandardMaterial({ color: 0xa66e46, roughness: 0.78 });
    const matPlaca = new THREE.MeshStandardMaterial({ color: 0xd8cec0, roughness: 0.92 });

    // Basamento / patio escolar permeable
    const patio = new THREE.Mesh(new THREE.BoxGeometry(86, 0.6, 56), matPlaca);
    patio.position.set(6, 0.3, 4);
    escuelaG.add(patio);

    // Pabellón 1 (Aulas principales) + Pabellón 2 (Talleres en L)
    const pab1 = new THREE.Mesh(new THREE.BoxGeometry(52, 6.4, 15), matMuroEsc);
    pab1.position.set(-8, 3.5, -6);
    const pab2 = new THREE.Mesh(new THREE.BoxGeometry(16, 6.0, 28), matMuroEsc);
    pab2.position.set(-26, 3.3, 14);
    escuelaG.add(pab1, pab2);

    // Celosías bioclimáticas de madera en fachadas escolares
    for (let x = -30; x <= 14; x += 5.5) {
      const cel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 5.8, 16.2), matMadera);
      cel.position.set(x, 3.5, -6);
      escuelaG.add(cel);
    }

    // Cubierta captadora bioclimática en V (macro-embudo escolar de cosecha pluvial)
    const pos4 = new Float32Array([
      -36, 9.8, -17, 22, 9.8, -17, 22, 6.6, -6, -36, 6.6, -6,
      -36, 6.6, -6, 22, 6.6, -6, 22, 9.8, 5, -36, 9.8, 5,
    ]);
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.BufferAttribute(pos4, 3));
    rg.setIndex([0, 3, 1, 1, 3, 2, 4, 7, 5, 5, 7, 6]);
    rg.computeVertexNormals();
    const techo = new THREE.Mesh(
      rg,
      new THREE.MeshStandardMaterial({
        color: 0xa9dcea, roughness: 0.32, metalness: 0.25,
        side: THREE.DoubleSide, emissive: 0x0c5a78, emissiveIntensity: 0.15,
      })
    );
    escuelaG.add(techo);
    escuelaG.userData.techoMat = techo.material;

    // Cancha múltiple de preescolar (con cubierta ligera de sombra)
    const cancha = new THREE.Mesh(
      new THREE.BoxGeometry(28, 0.35, 18),
      new THREE.MeshStandardMaterial({ color: 0x2e7d67, roughness: 0.75 })
    );
    cancha.position.set(16, 0.72, 16);
    const techoCancha = new THREE.Mesh(
      new THREE.BoxGeometry(30, 0.45, 20),
      new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.65, transparent: true, opacity: 0.88 })
    );
    techoCancha.position.set(16, 7.6, 16);
    escuelaG.add(cancha, techoCancha);

    // Aljibe escolar en corte (vidrio + nivel de agua animado)
    const tanque = new THREE.Mesh(
      new THREE.BoxGeometry(20, 5.2, 14),
      new THREE.MeshStandardMaterial({ color: 0x9fd8e6, transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false })
    );
    tanque.position.set(-6, 2.9, 18);
    escuelaG.add(tanque);

    const agua = new THREE.Mesh(
      new THREE.BoxGeometry(18.6, 1, 12.6),
      new THREE.MeshStandardMaterial({ color: 0x2f9fd0, transparent: true, opacity: 0.9, roughness: 0.2 })
    );
    agua.geometry.translate(0, 0.5, 0);
    agua.position.set(-6, 0.5, 18);
    escuelaG.add(agua);
    escuelaG.userData.agua = agua;

    // Ágora pedagógica sombreada (Aula Ambiental abierta)
    const agora = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 11, 0.6, 36),
      new THREE.MeshStandardMaterial({ color: 0xd9c7a3 })
    );
    agora.position.set(36, 0.6, -8);
    const agoraTecho = new THREE.Mesh(
      new THREE.ConeGeometry(13, 4.2, 8),
      new THREE.MeshStandardMaterial({ map: techoTex, color: 0xc86e4b, roughness: 0.74 })
    );
    agoraTecho.position.set(36, 6.8, -8);
    escuelaG.add(agora, agoraTecho);
  }

  // Fortificaciones históricas 3D de Bocachica (Piedra coralina: San Fernando, San José y Ángel San Rafael)
  const fuertesGroup = new THREE.Group();
  aulaGroup.add(fuertesGroup);
  {
    const matPiedraCoral = new THREE.MeshStandardMaterial({ color: 0xd2c2a8, roughness: 0.92, metalness: 0.04 });
    const matTerraplen = new THREE.MeshStandardMaterial({ color: 0x7b8856, roughness: 0.95 });

    // 1. Fuerte de San Fernando de Bocachica (baluartes en herradura frente al canal)
    const sf = new THREE.Group();
    sf.position.set(nodosXZ.sanFernando.x, nodosXZ.sanFernando.y, nodosXZ.sanFernando.z);
    const sfBase = new THREE.Mesh(new THREE.CylinderGeometry(42, 48, 8.5, 6), matPiedraCoral);
    sfBase.position.y = 4.2;
    const sfPatio = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 9.0, 6), matTerraplen);
    sfPatio.position.y = 4.4;
    const sfBaluarteN = new THREE.Mesh(new THREE.ConeGeometry(22, 8.5, 4), matPiedraCoral);
    sfBaluarteN.position.set(-32, 4.2, -18);
    const sfBaluarteS = new THREE.Mesh(new THREE.ConeGeometry(22, 8.5, 4), matPiedraCoral);
    sfBaluarteS.position.set(32, 4.2, -18);
    sf.add(sfBase, sfPatio, sfBaluarteN, sfBaluarteS);
    fuertesGroup.add(sf);

    // 2. Batería del Ángel San Rafael (en la colina con galería y mirador)
    const sr = new THREE.Group();
    sr.position.set(nodosXZ.sanRafael.x, nodosXZ.sanRafael.y, nodosXZ.sanRafael.z);
    const srMuro = new THREE.Mesh(new THREE.CylinderGeometry(28, 34, 6.5, 5), matPiedraCoral);
    srMuro.position.y = 3.2;
    const srGlacis = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 7.0, 5), matTerraplen);
    srGlacis.position.y = 3.4;
    sr.add(srMuro, srGlacis);
    fuertesGroup.add(sr);

    // 3. Batería de San José (plataforma artillera sobre el arrecife del canal)
    const sj = new THREE.Group();
    sj.position.set(nodosXZ.sanJose.x, Math.max(0.2, nodosXZ.sanJose.y), nodosXZ.sanJose.z);
    const sjMuro = new THREE.Mesh(new THREE.BoxGeometry(46, 5.2, 28), matPiedraCoral);
    sjMuro.position.y = 2.6;
    sj.add(sjMuro);
    fuertesGroup.add(sj);
  }

  // Lluvia sobre el Gimnasio Cristiano R9 (600 trazos)
  const NL = 600;
  const lluviaPos = new Float32Array(NL * 6);
  const lluviaVel = new Float32Array(NL);
  const reponerLluvia = (i, alto = Math.random() * 120) => {
    const x = sNode.x + (Math.random() - 0.5) * 130;
    const z = sNode.z + (Math.random() - 0.5) * 90;
    const y = sNode.y + 8 + alto;
    lluviaPos.set([x, y, z, x - 0.4, y + 4.5, z], i * 6);
    lluviaVel[i] = 55 + Math.random() * 25;
  };
  for (let i = 0; i < NL; i++) reponerLluvia(i);
  const lluviaGeo = new THREE.BufferGeometry();
  lluviaGeo.setAttribute('position', new THREE.BufferAttribute(lluviaPos, 3));
  const lluviaMat = new THREE.LineBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0, depthWrite: false });
  const lluviaLineas = new THREE.LineSegments(lluviaGeo, lluviaMat);
  lluviaLineas.frustumCulled = false;
  lluviaLineas.renderOrder = 9;
  aulaGroup.add(lluviaLineas);

  // Haces verticales y anillos pulsantes en los nodos de Bocachica
  const beamGeo = new THREE.CylinderGeometry(1, 1, 1, 14, 1, true);
  beamGeo.translate(0, 0.5, 0);
  const ringGeo = new THREE.RingGeometry(0.78, 1.0, 36);
  ringGeo.rotateX(-Math.PI / 2);
  const marcadores = {};
  for (const [k, n] of Object.entries(nodosXZ)) {
    const col = new THREE.Color(n.color);
    const bMat = new THREE.MeshBasicMaterial({
      color: col, transparent: true, opacity: 0.75,
      depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const rMat = new THREE.MeshBasicMaterial({
      color: col, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(beamGeo, bMat);
    beam.position.set(n.x, n.y, n.z);
    beam.frustumCulled = false;
    beam.renderOrder = 14;
    const ring = new THREE.Mesh(ringGeo, rMat);
    ring.position.set(n.x, n.y + 1.8, n.z);
    ring.frustumCulled = false;
    ring.renderOrder = 15;
    aulaGroup.add(beam, ring);
    marcadores[k] = { beam, ring, bMat, rMat, x: n.x, y: n.y, z: n.z };
  }

  // Rutas 3D con LineSegments2
  const lineMats = [];
  const rutas3D = {};
  const crearRuta3D = (clave, ptsLL, hexColor, ancho = 4.2) => {
    const pts = ptsLL.map(([lo, la]) => llToXZ(lo, la));
    const posArr = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, z0] = pts[i];
      const [x1, z1] = pts[i + 1];
      const L = Math.hypot(x1 - x0, z1 - z0);
      const steps = Math.max(1, Math.ceil(L / 12));
      for (let j = 0; j < steps; j++) {
        const ax = x0 + ((x1 - x0) * j) / steps;
        const az = z0 + ((z1 - z0) * j) / steps;
        const bx2 = x0 + ((x1 - x0) * (j + 1)) / steps;
        const bz2 = z0 + ((z1 - z0) * (j + 1)) / steps;
        posArr.push(ax, heightAtXZ(ax, az) + 3.2, az, bx2, heightAtXZ(bx2, bz2) + 3.2, bz2);
      }
    }
    const g = new LineSegmentsGeometry();
    g.setPositions(posArr);
    const haloMat = new LineMaterial({ color: 0x05080c, linewidth: ancho + 2.8, transparent: true, opacity: 0, depthWrite: false });
    const mainMat = new LineMaterial({
      color: new THREE.Color(hexColor).getHex(),
      linewidth: ancho,
      transparent: true,
      opacity: 0,
      dashed: true,
      dashSize: 18,
      gapSize: 10,
      depthWrite: false,
    });
    const halo = new LineSegments2(g, haloMat);
    const main = new LineSegments2(g, mainMat);
    main.computeLineDistances();
    halo.renderOrder = 16;
    main.renderOrder = 17;
    halo.frustumCulled = main.frustumCulled = false;
    aulaGroup.add(halo, main);
    lineMats.push(haloMat, mainMat);
    rutas3D[clave] = { g, halo, main, haloMat, mainMat, op: 0 };
  };
  crearRuta3D('agua', RUTAS_BOCACHICA.agua, '#6ec6e6', 4.4);
  crearRuta3D('verde', RUTAS_BOCACHICA.verde, '#35d08a', 4.4);
  crearRuta3D('residuos', RUTAS_BOCACHICA.residuos, '#f5b45a', 4.0);
  crearRuta3D('oficios', RUTAS_BOCACHICA.oficios, '#e8a86b', 4.0);
  crearRuta3D('patrimonio', RUTAS_BOCACHICA.patrimonio, '#e0917a', 4.6);

  // Etiquetas 3D flotantes (Sprites con tipografía Inter)
  try { await document.fonts.load('600 40px "Inter"'); } catch { /* fallback */ }
  const crearEtiqueta = (texto, sub, X, Z, alto = 38, hexBar = '#e0917a') => {
    const c = document.createElement('canvas');
    c.width = 720;
    c.height = 132;
    const g = c.getContext('2d');
    g.fillStyle = 'rgba(7, 10, 14, 0.78)';
    g.beginPath();
    g.roundRect(8, 8, 704, 116, 18);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.16)';
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = hexBar;
    g.fillRect(26, 28, 6, 76);
    g.font = '600 34px "Inter", system-ui, sans-serif';
    g.fillStyle = '#f4f1ec';
    g.fillText(texto, 48, 60);
    g.font = '500 22px "IBM Plex Mono", monospace';
    g.fillStyle = 'rgba(244,241,236,0.68)';
    g.fillText(sub, 48, 98);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, sizeAttenuation: false, opacity: 0 })
    );
    sp.scale.set(0.046 * (720 / 132), 0.046, 1);
    sp.center.set(0.5, 0);
    sp.position.set(X, heightAtXZ(X, Z) + alto, Z);
    sp.renderOrder = 85;
    return sp;
  };

  const etiquetasGroup = new THREE.Group();
  aulaGroup.add(etiquetasGroup);
  const etqMap = {
    casco: crearEtiqueta('Pueblo de Bocachica', 'Nuestras casas, calles y memorias', nodosXZ.casco.x, nodosXZ.casco.z, 42, '#e0917a'),
    escuelaR9: crearEtiqueta('Colegio Gimnasio Cristiano', 'Techo para lluvia, sombra y aula viva', nodosXZ.escuelaR9.x, nodosXZ.escuelaR9.z, 46, '#35d08a'),
    agua: crearEtiqueta('Aljibes y Pozos', 'Cuidado del agua y lluvia limpia', nodosXZ.agua.x, nodosXZ.agua.z, 38, '#6ec6e6'),
    vivero: crearEtiqueta('Vivero y Manglar', 'Árboles para dar sombra y cuidar la orilla', nodosXZ.vivero.x, nodosXZ.vivero.z, 38, '#35d08a'),
    residuos: crearEtiqueta('Taller de Plástico', 'Plástico recogido convertido en bancas', nodosXZ.residuos.x, nodosXZ.residuos.z, 38, '#f5b45a'),
    ribera: crearEtiqueta('Carpintería de Ribera', 'Maestros de botes y pesca artesanal', nodosXZ.ribera.x, nodosXZ.ribera.z, 38, '#e8a86b'),
    sanFernando: crearEtiqueta('Fuerte San Fernando', 'Historia viva contada por nuestra gente', nodosXZ.sanFernando.x, nodosXZ.sanFernando.z, 42, '#f4f1ec'),
    sanRafael: crearEtiqueta('Batería Ángel San Rafael', 'Mirador y sendero educativo del cerro', nodosXZ.sanRafael.x, nodosXZ.sanRafael.z, 52, '#e0917a'),
  };
  Object.values(etqMap).forEach((s) => etiquetasGroup.add(s));

  // ===========================================================================
  // MODO GEMELO DIGITAL PROGRESIVO (Nube de puntos 3D del relieve + nodos de datos)
  // Inspirado 1:1 en la vista de nube de puntos (espGroup) de tesis_tercer_corte
  // ===========================================================================
  const gemeloGroup = new THREE.Group();
  gemeloGroup.visible = false;
  scene.add(gemeloGroup);
  {
    const reliefPos = [];
    const reliefCol = [];
    const PS = small ? 6 : 4;
    for (let py = 2; py < H; py += PS) {
      for (let px = 2; px < W; px += PS) {
        if (!land[py * W + px]) continue;
        const u = (px + 0.5) / W;
        const v = (py + 0.5) / H;
        const tx = tx0 + u * (tx1 - tx0);
        const ty = ty0 + v * (ty1 - ty0);
        const [X, Z] = toXZ(tx, ty);
        const y = heightAtUV(u, v);
        reliefPos.push(X, y + 1.2, Z);
        // En Bocachica (sur de la isla) los puntos brillan en tonos cálidos/cian del gemelo
        const dBoca = Math.hypot(X - bx, Z - bz);
        if (dBoca < 1300) {
          const k = clamp01(1 - dBoca / 1300);
          reliefCol.push(0.25 + 0.65 * k, 0.58 + 0.25 * k, 0.78);
        } else {
          const hNorm = clamp01(y / 90);
          reliefCol.push(0.12 + 0.35 * hNorm, 0.26 + 0.45 * hNorm, 0.38 + 0.48 * hNorm);
        }
      }
    }
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(reliefPos, 3));
    gGeo.setAttribute('color', new THREE.Float32BufferAttribute(reliefCol, 3));
    const gMat = new THREE.PointsMaterial({
      size: small ? 2.6 : 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ptsMesh = new THREE.Points(gGeo, gMat);
    gemeloGroup.add(ptsMesh);
    gemeloGroup.userData.ptsMat = gMat;
  }

  // ---------- poses de cámara sobre Tierra Bomba y Bocachica ----------
  const dx = () => (window.innerWidth >= 1024 ? -220 : 0);
  const dxIsla = () => (window.innerWidth >= 1024 ? -1350 : 0);
  const POSES = {
    hero: (t) => {
      const a = THREE.MathUtils.degToRad(202) + Math.sin(t * 0.06) * 0.38;
      return {
        pos: new THREE.Vector3(bx + Math.sin(a) * 520, 175, bz + Math.cos(a) * 520),
        look: new THREE.Vector3(bx, 8, bz),
      };
    },
    isla: () => ({
      pos: new THREE.Vector3(480 + dxIsla(), 6900, 7800),
      look: new THREE.Vector3(dxIsla(), 0, 420),
    }),
    problema: () => ({
      pos: new THREE.Vector3(bx + 360 + dx(), 1180, bz + 1420),
      look: new THREE.Vector3(bx + dx() * 0.5, 10, bz),
    }),
    bocachica_general: () => ({
      pos: new THREE.Vector3(bx + 260 + dx(), 680, bz + 920),
      look: new THREE.Vector3(bx + dx() * 0.4, 12, bz - 30),
    }),
    memorias_r9: (t) => ({
      pos: new THREE.Vector3(nodosXZ.casco.x + Math.sin(t * 0.07) * 140 + dx() * 0.35, 290, nodosXZ.casco.z + 420),
      look: new THREE.Vector3(nodosXZ.casco.x + dx() * 0.2, 8, nodosXZ.casco.z - 20),
    }),
    linea_memoria: () => ({
      pos: new THREE.Vector3(nodosXZ.casco.x + 145 + dx() * 0.3, 250, nodosXZ.casco.z + 360),
      look: new THREE.Vector3(nodosXZ.casco.x + dx() * 0.18, 9, nodosXZ.casco.z),
    }),
    linea_agua: () => ({
      pos: new THREE.Vector3(nodosXZ.agua.x + 140 + dx() * 0.3, 240, nodosXZ.agua.z + 350),
      look: new THREE.Vector3(nodosXZ.agua.x + dx() * 0.18, 8, nodosXZ.agua.z),
    }),
    linea_verde: () => ({
      pos: new THREE.Vector3(nodosXZ.vivero.x + 165 + dx() * 0.3, 270, nodosXZ.vivero.z + 390),
      look: new THREE.Vector3(nodosXZ.vivero.x + dx() * 0.18, 9, nodosXZ.vivero.z),
    }),
    linea_residuos: () => ({
      pos: new THREE.Vector3(nodosXZ.residuos.x + 135 + dx() * 0.25, 230, nodosXZ.residuos.z + 330),
      look: new THREE.Vector3(nodosXZ.residuos.x + dx() * 0.15, 8, nodosXZ.residuos.z),
    }),
    linea_oficios: () => ({
      pos: new THREE.Vector3(nodosXZ.ribera.x - 145 + dx() * 0.25, 215, nodosXZ.ribera.z + 320),
      look: new THREE.Vector3(nodosXZ.ribera.x + dx() * 0.15, 6, nodosXZ.ribera.z),
    }),
    linea_patrimonio: () => ({
      pos: new THREE.Vector3(nodosXZ.sanFernando.x + 210 + dx() * 0.3, 310, nodosXZ.sanFernando.z + 460),
      look: new THREE.Vector3(nodosXZ.sanFernando.x + dx() * 0.15, 10, nodosXZ.sanFernando.z - 50),
    }),
    escuela_r9: () => ({
      pos: new THREE.Vector3(sNode.x + 78, sNode.y + 88, sNode.z + 155),
      look: new THREE.Vector3(sNode.x - 8, sNode.y + 5, sNode.z + 4),
    }),
    escuela_cerca: (t) => ({
      pos: new THREE.Vector3(sNode.x + Math.sin(t * 0.09) * 35 + 58, sNode.y + 62, sNode.z + 118),
      look: new THREE.Vector3(sNode.x - 4, sNode.y + 4, sNode.z + 6),
    }),
    gemelo: (t) => ({
      pos: new THREE.Vector3(bx + Math.sin(t * 0.08) * 320 + dx(), 980, bz + 1220),
      look: new THREE.Vector3(bx + dx() * 0.35, 14, bz),
    }),
    hoja_ruta: (t) => ({
      pos: new THREE.Vector3(bx + Math.cos(t * 0.06) * 280 + dx(), 580, bz + 860),
      look: new THREE.Vector3(bx + dx() * 0.3, 10, bz - 20),
    }),
  };

  // ---------- estado objetivo y bucle de animación ----------
  const T = {
    cam: 'hero',
    dim: 0,
    cartografia: 0,
    gemelo: 0,
    lluvia: 0,
    escuela: 1,
    zonas: [0.35, 0.35, 0.35], // [memoria/patrimonio, verde/escuela, agua/oficios]
    rutas: { agua: 0, verde: 0, residuos: 0, oficios: 0, patrimonio: 0 },
    nodosActivos: null, // null = todos, o array de claves
  };

  const vt = { zoom: 1, az: 0, el: 0, px: 0, pz: 0 };
  const vi = { zoom: 1, az: 0, el: 0, px: 0, pz: 0 };
  let lastBase = 1200;
  const sph = new THREE.Spherical();
  const offV = new THREE.Vector3();
  const dirV2 = new THREE.Vector3();
  const resetVista = () => { vt.zoom = 1; vt.az = 0; vt.el = 0; vt.px = 0; vt.pz = 0; };

  const cur = {
    dim: 0,
    cartografia: 0,
    gemelo: 0,
    lluvia: 0,
    escuela: 1,
    z0: 0.35,
    z1: 0.35,
    z2: 0.35,
  };

  const camera = new THREE.PerspectiveCamera(42, 1, 5, 160000);
  const camPos = POSES.hero(0).pos.clone();
  const camLook = POSES.hero(0).look.clone();
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const onMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  cleanups.push(() => window.removeEventListener('pointermove', onMove));

  const resize = () => {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    lineMats.forEach((m) => m.resolution.set(w, h));
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  cleanups.push(() => ro.disconnect());

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now();
  const t0 = last;
  let raf = 0;
  let shown = false;
  const expo = (dt, k) => 1 - Math.exp(-dt * k);

  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (disposed || document.hidden) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;

    cur.dim += (T.dim - cur.dim) * expo(dt, 3.2);
    cur.cartografia += (T.cartografia - cur.cartografia) * expo(dt, 3.0);
    cur.gemelo += (T.gemelo - cur.gemelo) * expo(dt, 3.2);
    cur.lluvia += (T.lluvia - cur.lluvia) * expo(dt, 3.2);
    cur.escuela += (T.escuela - cur.escuela) * expo(dt, 3.5);
    cur.z0 += ((T.zonas?.[0] ?? 0) - cur.z0) * expo(dt, 3.0);
    cur.z1 += ((T.zonas?.[1] ?? 0) - cur.z1) * expo(dt, 3.0);
    cur.z2 += ((T.zonas?.[2] ?? 0) - cur.z2) * expo(dt, 3.0);

    U.uDim.value = cur.dim;
    U.uCartografia.value = cur.cartografia;
    U.uZonasAmt.value.set(cur.z0, cur.z1, cur.z2);
    U.uTime.value = t;
    waterUniforms.uTime.value = t;

    // Modo Gemelo Digital (nube de puntos)
    gemeloGroup.visible = cur.gemelo > 0.02;
    if (gemeloGroup.visible) {
      gemeloGroup.userData.ptsMat.opacity = cur.gemelo * 0.9;
    }
    const enNubePura = cur.gemelo > 0.75;
    terrain.visible = patch.visible = !enNubePura;

    // Pose de cámara
    const poseFn = POSES[T.cam] || POSES.bocachica_general;
    const pose = poseFn(t * (reduce ? 0 : 1));
    const kc = expo(dt, reduce ? 30 : 2.1);
    camPos.lerp(pose.pos, kc);
    camLook.lerp(pose.look, kc);
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;

    const kv = expo(dt, 9);
    vi.zoom += (vt.zoom - vi.zoom) * kv;
    vi.az += (vt.az - vi.az) * kv;
    vi.el += (vt.el - vi.el) * kv;
    vi.px += (vt.px - vi.px) * kv;
    vi.pz += (vt.pz - vi.pz) * kv;

    offV.copy(camPos).sub(camLook);
    lastBase = Math.max(150, offV.length());
    sph.setFromVector3(offV);
    sph.radius = lastBase * Math.max(vi.zoom, 90 / lastBase);
    sph.theta += vi.az;
    sph.phi = THREE.MathUtils.clamp(sph.phi + vi.el, 0.14, 1.48);
    offV.setFromSpherical(sph);
    const dist = offV.length();
    const libre = Math.abs(vt.zoom - 1) + Math.abs(vt.az) + Math.abs(vt.el) + Math.abs(vt.px) + Math.abs(vt.pz) > 0.001;
    const par = libre ? 0 : 1;

    camera.position.set(
      camLook.x + vi.px + offV.x + par * mouse.sx * dist * 0.012,
      camLook.y + offV.y - par * mouse.sy * dist * 0.008,
      camLook.z + vi.pz + offV.z
    );
    camera.lookAt(camLook.x + vi.px, camLook.y, camLook.z + vi.pz);

    const nearW = THREE.MathUtils.clamp(dist * 0.02, 4, 220);
    if (Math.abs(nearW - camera.near) / camera.near > 0.1) {
      camera.near = nearW;
      camera.updateProjectionMatrix();
    }

    // Árboles reales en toda la isla, viviendas 1:1 y escuela R9
    const escalaCasasObjetivo = dist > 3800 ? 1.22 : 1.0;
    if (Math.abs(escalaCasasObjetivo - ultimaEscalaCasas) > 0.05) {
      updateHouses(true, escalaCasasObjetivo);
    }
    treesGroup.visible = !enNubePura;
    escuelaG.visible = cur.escuela > 0.02;
    escuelaG.scale.set(1, Math.max(0.001, cur.escuela), 1);

    // Lluvia y llenado del aljibe en Gimnasio Cristiano R9
    lluviaLineas.visible = cur.lluvia > 0.02;
    lluviaMat.opacity = cur.lluvia * 0.78;
    if (lluviaLineas.visible) {
      for (let i = 0; i < NL; i++) {
        const o = i * 6;
        const dy = lluviaVel[i] * dt;
        lluviaPos[o + 1] -= dy;
        lluviaPos[o + 4] -= dy;
        if (lluviaPos[o + 1] < sNode.y + 7) reponerLluvia(i, 100 + Math.random() * 30);
      }
      lluviaGeo.attributes.position.needsUpdate = true;
    }
    if (escuelaG.userData.agua) {
      escuelaG.userData.agua.scale.y = Math.max(0.25, 4.3 * Math.max(0.2, cur.lluvia));
    }

    // Nodos, haces de luz y etiquetas
    const hBeam = THREE.MathUtils.clamp(dist * 0.055, 38, 320);
    const pulsoRing = 1 + 0.25 * Math.sin(t * 2.8);
    for (const [k, m] of Object.entries(marcadores)) {
      const activo = !T.nodosActivos || T.nodosActivos.includes(k);
      const op = activo ? (1 - cur.dim * 0.65) : 0.12;
      m.bMat.opacity += (op * 0.72 - m.bMat.opacity) * expo(dt, 5);
      m.rMat.opacity += (op * 0.9 - m.rMat.opacity) * expo(dt, 5);
      m.beam.scale.set(hBeam * 0.015, hBeam, hBeam * 0.015);
      m.ring.scale.setScalar((activo ? 26 : 14) * pulsoRing);
      if (etqMap[k]) {
        const wantEtq = activo && dist < 3200 && cur.dim < 0.5 ? 0.96 : 0;
        etqMap[k].material.opacity += (wantEtq - etqMap[k].material.opacity) * expo(dt, 5);
      }
    }

    // Rutas 3D con flujo animado
    for (const [k, r] of Object.entries(rutas3D)) {
      const want = (T.rutas && T.rutas[k]) || 0;
      r.op += (want - r.op) * expo(dt, 4.2);
      const vis = r.op > 0.01;
      r.halo.visible = r.main.visible = vis;
      if (vis) {
        r.mainMat.opacity = r.op * 0.95;
        r.haloMat.opacity = r.op * 0.6;
        r.mainMat.dashOffset -= dt * 14;
      }
    }

    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      el.style.opacity = '1';
    }
  };
  raf = requestAnimationFrame(tick);
  cleanups.push(() => cancelAnimationFrame(raf));
  onProgreso(1, 'Listo');

  return {
    nodos: NODOS_BOCACHICA,
    set(parcial) {
      if (parcial.cam && parcial.cam !== T.cam) resetVista();
      Object.assign(T, parcial);
    },
    vista: {
      zoom(f) { vt.zoom = THREE.MathUtils.clamp(vt.zoom * f, Math.max(0.05, 90 / lastBase), 2.1); },
      rotar(dx2, dy2) { vt.az -= dx2 * 0.006; vt.el -= dy2 * 0.005; },
      mover(dx2, dy2) {
        camera.getWorldDirection(dirV2);
        const fl = Math.hypot(dirV2.x, dirV2.z) || 1;
        const fx = dirV2.x / fl;
        const fz = dirV2.z / fl;
        const rx = -fz;
        const rz = fx;
        const s = camera.position.distanceTo(camLook) * 0.0016;
        vt.px += (-rx * dx2 + fx * dy2) * s;
        vt.pz += (-rz * dx2 + fz * dy2) * s;
      },
      reset: resetVista,
      activa: () => Math.abs(vt.zoom - 1) + Math.abs(vt.az) + Math.abs(vt.el) + Math.abs(vt.px) + Math.abs(vt.pz) > 0.001,
    },
    estado: T,
    dispose() {
      disposed = true;
      cleanups.forEach((fn) => fn());
    },
  };
}
