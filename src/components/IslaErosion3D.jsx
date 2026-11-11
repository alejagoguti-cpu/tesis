import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import { BASE, DATA_URL, prepareTreeSpecies, instanceTrees } from '../utils/realTerritory.js';

// =============================================================================
// Simulación de erosión en Tierra Bomba (isla completa, 3D).
//  - Foto satelital z15 + relieve Terrarium + silueta oficial de la isla (isla_mascara)
//  - 2.600 huellas de construcciones del archivo de tesis (alturas de referencia, no medidas)
//  - Escenario: retroceso uniforme de la costa a la tasa máxima registrada (1,8 m/año).
//    Distancia al mar calculada con transformada de distancia sobre la silueta (~4,7 m/píxel).
//    No es un modelo hidrodinámico: la erosión real varía por tramo de costa.
// =============================================================================

const TASA = 1.8; // m/año
const HORIZONTES = [10, 20, 30];
const MOSAIC = { x0: 9502, y0: 15426, nx: 10, ny: 17 };
const WIN = { left: 231, top: 1734, w: 1445, h: 2578 }; // ventana de la isla dentro del mosaico (px)
const EXAG = 2.6; // exageración vertical del relieve
const CASA_ESCALA = 2.6; // las casas se dibujan ampliadas para que se vean a escala de isla
const DEM = { z: 12, x0: 1187, y0: 1929 };
const BANDAS = [
  [153, 27, 27], // 0–10 años
  [220, 38, 38], // 10–20 años
  [248, 113, 113], // 20–30 años
];

const loadImg = (src) =>
  new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Transformada de distancia euclidiana (Felzenszwalb): distancia² al píxel de mar más cercano
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

export default function IslaErosion3D({ className = '' }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const [status, setStatus] = useState('cargando');
  const [year, setYear] = useState(0);
  const [mode, setMode] = useState('perdida'); // 'perdida' | 'despues'
  const [playing, setPlaying] = useState(false);
  const [stats, setStats] = useState(null);
  const [totals, setTotals] = useState(null);

  // ---------- escena ----------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let disposed = false;
    let raf = 0;
    let visible = true;
    const cleanups = [];

    (async () => {
      try {
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        const el = renderer.domElement;
        el.style.cssText = 'display:block;width:100%;height:100%;opacity:0;transition:opacity 1.2s ease';
        mount.appendChild(el);
        cleanups.push(() => {
          renderer.dispose();
          if (el.parentNode === mount) mount.removeChild(el);
        });
        const [satImg, maskImg, geoRef, veg, patchSatImg, buildingsRaw, ...demImgs] = await Promise.all([
          loadImg(`${BASE}textures/sat_base.jpg`),
          loadImg(`${BASE}textures/isla_mascara.png`),
          fetch(`${DATA_URL}georef.json`).then((r) => r.json()),
          fetch(`${DATA_URL}vegetacion.json`).then((r) => r.json()),
          loadImg(`${BASE}textures/tierrabomba_satelite.jpg`),
          (async () => {
            const res = await fetch(`${BASE}data/construcciones_tierra_bomba.json.gz`);
            const buf = await res.arrayBuffer();
            const u8 = new Uint8Array(buf);
            // algunos servidores ya entregan el JSON descomprimido (Content-Encoding: gzip)
            if (u8[0] === 0x1f && u8[1] === 0x8b) {
              const stream = new Response(buf).body.pipeThrough(new DecompressionStream('gzip'));
              return JSON.parse(await new Response(stream).text());
            }
            return JSON.parse(new TextDecoder().decode(u8));
          })(),
          loadImg(`${BASE}data/elevation/1187_1929.png`),
          loadImg(`${BASE}data/elevation/1188_1929.png`),
          loadImg(`${BASE}data/elevation/1187_1930.png`),
          loadImg(`${BASE}data/elevation/1188_1930.png`),
        ]);
        if (disposed) return;

        // ---------- geometría del mosaico ----------
        const tx0 = MOSAIC.x0 + WIN.left / 256;
        const tx1 = MOSAIC.x0 + (WIN.left + WIN.w) / 256;
        const ty0 = MOSAIC.y0 + WIN.top / 256;
        const ty1 = MOSAIC.y0 + (WIN.top + WIN.h) / 256;
        const n15 = 2 ** 15;
        const latOf = (ty) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n15))) * 180) / Math.PI;
        const latC = latOf((ty0 + ty1) / 2);
        const mpt = (40075016.686 * Math.cos((latC * Math.PI) / 180)) / n15; // metros por tesela z15
        const mpp = mpt / 256; // metros por píxel del mosaico
        const txc = (tx0 + tx1) / 2;
        const tyc = (ty0 + ty1) / 2;
        const toXZ = (tx, ty) => [(tx - txc) * mpt, (ty - tyc) * mpt];
        const lonLatToTile = (lon, lat) => [
          ((lon + 180) / 360) * n15,
          ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n15,
        ];

        // ---------- máscara de la isla y distancia al mar ----------
        const W = WIN.w;
        const H = WIN.h;

        // Detalle del casco urbano: mosaico z18 (~0,6 m/px) con su propia silueta y distancia al mar
        const PM = geoRef.mosaico; // { z: 18, x0, y0, px: 3328 }
        const PW = 1664; // resolución de la silueta del detalle (mitad del mosaico)
        const tile18 = PM.px / 256; // teselas z18 por lado
        const inPatch = new Uint8Array(W * H);
        for (let wy = 0; wy < H; wy++) {
          const ty18 = (ty0 + ((wy + 0.5) / H) * (ty1 - ty0)) * 8 - PM.y0;
          if (ty18 < 0 || ty18 >= tile18) continue;
          for (let wx = 0; wx < W; wx++) {
            const tx18 = (tx0 + ((wx + 0.5) / W) * (tx1 - tx0)) * 8 - PM.x0;
            if (tx18 >= 0 && tx18 < tile18) inPatch[wy * W + wx] = 1;
          }
        }
        const maskC = document.createElement('canvas');
        maskC.width = W;
        maskC.height = H;
        const mctx = maskC.getContext('2d', { willReadFrequently: true });
        mctx.drawImage(maskImg, 0, 0);
        const mdata = mctx.getImageData(0, 0, W, H).data;
        const land = new Uint8Array(W * H);
        const maskAlpha = new Uint8Array(W * H);
        let landPx = 0;
        for (let i = 0; i < W * H; i++) {
          const val = mdata[i * 4 + 3] < 255 ? mdata[i * 4 + 3] : mdata[i * 4];
          maskAlpha[i] = val;
          if (val > 127) {
            land[i] = 1;
            landPx++;
          }
        }
        await new Promise((r) => setTimeout(r, 0));
        const sq = edt(W, H, land);
        const distM = new Float32Array(W * H);
        for (let i = 0; i < distM.length; i++) distM[i] = land[i] ? Math.sqrt(sq[i]) * mpp : 0;
        if (disposed) return;

        // histograma de píxeles de tierra por año de pérdida (para hectáreas)
        const lostByYear = new Float64Array(31); // píxeles cuyo retroceso cae en el año k
        for (let i = 0; i < distM.length; i++) {
          if (!land[i]) continue;
          const yv = distM[i] / TASA;
          if (yv < 30) lostByYear[Math.floor(yv) + 1] += 1;
        }
        const cumLostPx = new Float64Array(31);
        for (let k = 1; k <= 30; k++) cumLostPx[k] = cumLostPx[k - 1] + lostByYear[k];
        const ha = (px) => (px * mpp * mpp) / 10000;

        // máscara suave (para relieve)
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

        // ---------- relieve (Terrarium z12) ----------
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
          return (
            demPx(x0, y0) * (1 - ax) * (1 - ay) + demPx(x0 + 1, y0) * ax * (1 - ay) +
            demPx(x0, y0 + 1) * (1 - ax) * ay + demPx(x0 + 1, y0 + 1) * ax * ay
          );
        };

        // ---------- terreno ----------
        const NX = 180;
        const NY = Math.round((NX * H) / W);
        const pos = new Float32Array((NX + 1) * (NY + 1) * 3);
        const uvSat = new Float32Array((NX + 1) * (NY + 1) * 2);
        const uvWin = new Float32Array((NX + 1) * (NY + 1) * 2);
        const heights = new Float32Array((NX + 1) * (NY + 1));
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
            pos[p++] = X;
            pos[p++] = h;
            pos[p++] = Z;
            uvSat[q] = (tx - MOSAIC.x0) / MOSAIC.nx;
            uvSat[q + 1] = 1 - (ty - MOSAIC.y0) / MOSAIC.ny;
            uvWin[q] = u;
            uvWin[q + 1] = 1 - v;
            q += 2;
          }
        }
        const idx = [];
        for (let j = 0; j < NY; j++) {
          for (let i = 0; i < NX; i++) {
            const a = j * (NX + 1) + i;
            const b = a + 1;
            const d = a + NX + 1;
            const e = d + 1;
            idx.push(a, d, b, b, d, e);
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uvSat, 2));
        geo.setAttribute('uv1', new THREE.BufferAttribute(uvWin, 2));
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

        // textura satelital (reducida si la GPU tiene límite bajo)
        const maxTex = renderer.capabilities.maxTextureSize;
        const sc = Math.min(1, maxTex / satImg.height);
        const satC = document.createElement('canvas');
        satC.width = Math.round(satImg.width * sc);
        satC.height = Math.round(satImg.height * sc);
        satC.getContext('2d').drawImage(satImg, 0, 0, satC.width, satC.height);
        const satTex = new THREE.CanvasTexture(satC);
        satTex.colorSpace = THREE.SRGBColorSpace;
        satTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        // máscara original (alfa) y máscara erosionada (se recalcula al cambiar el año)
        const alphaC = document.createElement('canvas');
        alphaC.width = W;
        alphaC.height = H;
        const actx = alphaC.getContext('2d');
        const aimg = actx.createImageData(W, H);
        const writeAlpha = (retroM) => {
          const d = aimg.data;
          for (let i = 0; i < W * H; i++) {
            const a = !inPatch[i] && land[i] && distM[i] >= retroM ? maskAlpha[i] : 0;
            d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255;
            d[i * 4 + 3] = a;
          }
          actx.putImageData(aimg, 0, 0);
        };
        writeAlpha(0);
        const alphaTex = new THREE.CanvasTexture(alphaC);
        alphaTex.channel = 1;

        const terrain = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            map: satTex, alphaMap: alphaTex, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xffffff,
          })
        );

        // capa roja: lo que se pierde según el año
        const redC = document.createElement('canvas');
        redC.width = W;
        redC.height = H;
        const rctx = redC.getContext('2d');
        const rimg = rctx.createImageData(W, H);
        const writeRed = (retroM) => {
          const d = rimg.data;
          const b1 = TASA * HORIZONTES[0];
          const b2 = TASA * HORIZONTES[1];
          for (let i = 0; i < W * H; i++) {
            const dm = distM[i];
            if (!inPatch[i] && land[i] && dm < retroM) {
              const c = dm < b1 ? BANDAS[0] : dm < b2 ? BANDAS[1] : BANDAS[2];
              d[i * 4] = c[0];
              d[i * 4 + 1] = c[1];
              d[i * 4 + 2] = c[2];
              d[i * 4 + 3] = 215;
            } else {
              d[i * 4 + 3] = 0;
            }
          }
          rctx.putImageData(rimg, 0, 0);
        };
        writeRed(0);
        const redTex = new THREE.CanvasTexture(redC);
        redTex.channel = 1;
        const overlay = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            map: redTex, transparent: true, depthWrite: false, toneMapped: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
          })
        );
        overlay.position.y = 0.6;

        // ---------- detalle del casco urbano (z18) ----------
        // Silueta y distancia al mar del detalle: se interpolan (bilinear) desde el campo de distancia de la isla.
        // (La máscara propia del mosaico z18 incluye copas y no sirve como silueta de costa.)
        const pLand = new Uint8Array(PW * PW);
        const pAlpha = new Uint8Array(PW * PW);
        const pDist = new Float32Array(PW * PW);
        for (let py = 0; py < PW; py++) {
          const ty15 = (PM.y0 + ((py + 0.5) / PW) * tile18) / 8;
          const fy = ((ty15 - ty0) / (ty1 - ty0)) * H - 0.5;
          const y0 = Math.max(0, Math.min(H - 2, Math.floor(fy)));
          const ay = Math.max(0, Math.min(1, fy - y0));
          for (let px = 0; px < PW; px++) {
            const tx15 = (PM.x0 + ((px + 0.5) / PW) * tile18) / 8;
            const fx = ((tx15 - tx0) / (tx1 - tx0)) * W - 0.5;
            const x0 = Math.max(0, Math.min(W - 2, Math.floor(fx)));
            const ax = Math.max(0, Math.min(1, fx - x0));
            const i00 = y0 * W + x0;
            const i10 = i00 + 1;
            const i01 = i00 + W;
            const i11 = i01 + 1;
            const m = maskAlpha[i00] * (1 - ax) * (1 - ay) + maskAlpha[i10] * ax * (1 - ay) + maskAlpha[i01] * (1 - ax) * ay + maskAlpha[i11] * ax * ay;
            const o = py * PW + px;
            if (m > 127.5) {
              pLand[o] = 1;
              pAlpha[o] = 255;
              pDist[o] = distM[i00] * (1 - ax) * (1 - ay) + distM[i10] * ax * (1 - ay) + distM[i01] * (1 - ax) * ay + distM[i11] * ax * ay;
            }
          }
        }
        if (disposed) return;
        const NP = 150;
        const ppos = new Float32Array((NP + 1) * (NP + 1) * 3);
        const puv = new Float32Array((NP + 1) * (NP + 1) * 2);
        let pp = 0;
        let pq = 0;
        for (let j = 0; j <= NP; j++) {
          for (let i = 0; i <= NP; i++) {
            const tx = (PM.x0 + (i / NP) * tile18) / 8;
            const ty = (PM.y0 + (j / NP) * tile18) / 8;
            const [X, Z] = toXZ(tx, ty);
            const u = Math.max(0, Math.min(1, (tx - tx0) / (tx1 - tx0)));
            const v = Math.max(0, Math.min(1, (ty - ty0) / (ty1 - ty0)));
            ppos[pp++] = X;
            ppos[pp++] = heightAtUV(u, v) + 0.4;
            ppos[pp++] = Z;
            puv[pq++] = i / NP;
            puv[pq++] = 1 - j / NP;
          }
        }
        const pidx = [];
        for (let j = 0; j < NP; j++) {
          for (let i = 0; i < NP; i++) {
            const a = j * (NP + 1) + i;
            const b = a + 1;
            const d = a + NP + 1;
            const e = d + 1;
            pidx.push(a, d, b, b, d, e);
          }
        }
        const pgeo = new THREE.BufferGeometry();
        pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
        pgeo.setAttribute('uv', new THREE.BufferAttribute(puv, 2));
        pgeo.setIndex(pidx);
        pgeo.computeVertexNormals();

        const psc = Math.min(1, maxTex / patchSatImg.width);
        const pSatC = document.createElement('canvas');
        pSatC.width = Math.round(patchSatImg.width * psc);
        pSatC.height = Math.round(patchSatImg.height * psc);
        pSatC.getContext('2d').drawImage(patchSatImg, 0, 0, pSatC.width, pSatC.height);
        const pSatTex = new THREE.CanvasTexture(pSatC);
        pSatTex.colorSpace = THREE.SRGBColorSpace;
        pSatTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        const pAlphaC = document.createElement('canvas');
        pAlphaC.width = pAlphaC.height = PW;
        const pActx = pAlphaC.getContext('2d');
        const pAimg = pActx.createImageData(PW, PW);
        const writePatchAlpha = (retroM) => {
          const d = pAimg.data;
          for (let i = 0; i < PW * PW; i++) {
            d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255;
            d[i * 4 + 3] = pLand[i] && pDist[i] >= retroM ? pAlpha[i] : 0;
          }
          pActx.putImageData(pAimg, 0, 0);
        };
        writePatchAlpha(0);
        const pAlphaTex = new THREE.CanvasTexture(pAlphaC);
        const patch = new THREE.Mesh(
          pgeo,
          new THREE.MeshStandardMaterial({
            map: pSatTex, alphaMap: pAlphaTex, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xffffff,
          })
        );

        const pRedC = document.createElement('canvas');
        pRedC.width = pRedC.height = PW;
        const pRctx = pRedC.getContext('2d');
        const pRimg = pRctx.createImageData(PW, PW);
        const writePatchRed = (retroM) => {
          const d = pRimg.data;
          const b1 = TASA * HORIZONTES[0];
          const b2 = TASA * HORIZONTES[1];
          for (let i = 0; i < PW * PW; i++) {
            const dm = pDist[i];
            if (pLand[i] && dm < retroM) {
              const c = dm < b1 ? BANDAS[0] : dm < b2 ? BANDAS[1] : BANDAS[2];
              d[i * 4] = c[0];
              d[i * 4 + 1] = c[1];
              d[i * 4 + 2] = c[2];
              d[i * 4 + 3] = 215;
            } else {
              d[i * 4 + 3] = 0;
            }
          }
          pRctx.putImageData(pRimg, 0, 0);
        };
        writePatchRed(0);
        const pRedTex = new THREE.CanvasTexture(pRedC);
        const pOverlay = new THREE.Mesh(
          pgeo,
          new THREE.MeshBasicMaterial({
            map: pRedTex, transparent: true, depthWrite: false, toneMapped: false, fog: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3,
          })
        );
        pOverlay.position.y = 0.3;

        // ---------- árboles reales (solo copas detectadas en la foto, con modelos escaneados) ----------
        const crG = Math.cos(geoRef.rot);
        const srG = Math.sin(geoRef.rot);
        const modelToLL = (x, y) => {
          const px = (x - geoRef.tx) / geoRef.sc;
          const py = (y - geoRef.ty) / geoRef.sc;
          return [geoRef.lon0 + (px * crG + py * srG) / geoRef.kx, geoRef.lat0 + (-px * srG + py * crG) / geoRef.ky];
        };
        const [vlon, vlat] = modelToLL(40, 390);
        const [vtx0, vty0] = lonLatToTile(vlon, vlat);
        const [vx, vz] = toXZ(vtx0, vty0);
        const species = await prepareTreeSpecies();
        if (disposed) return;
        species.forEach((parts) => parts.forEach((part) => {
          if (part.kind === 'leaf') { part.material.color.multiplyScalar(1.9); part.material.envMapIntensity = 1.4; }
        }));
        const smallScreen = window.innerWidth < 768;
        const treeList = veg.arboles
          .map(([x, y, size, dense], i) => {
            const [lo, la] = modelToLL(x, y);
            const [ttx, tty] = lonLatToTile(lo, la);
            const [X, Z] = toXZ(ttx, tty);
            const u = (ttx - tx0) / (tx1 - tx0);
            const v = (tty - ty0) / (ty1 - ty0);
            const mx = Math.floor(((ttx * 8 - PM.x0) / tile18) * PW);
            const my = Math.floor(((tty * 8 - PM.y0) / tile18) * PW);
            const onLand = mx >= 0 && my >= 0 && mx < PW && my < PW && pLand[my * PW + mx] === 1;
            return {
              onLand, X, Z, i, size, dense, d: Math.hypot(X - vx, Z - vz), dist: onLand ? pDist[my * PW + mx] : 0,
              y: onLand ? heightAtUV(Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))) + 0.4 : 0,
            };
          })
          .filter((t) => t.onLand)
          .sort((a, b) => a.d - b.d)
          .slice(0, smallScreen ? 700 : 1800)
          .map((t) => ({
            x: t.X,
            y: t.y,
            z: t.Z,
            rot: ((Math.imul(t.i + 7, 40503) >>> 0) % 628) / 100,
            height: 8.5 * t.size * 1.35 * (t.dense ? 0.92 : 1.05),
            tone: ((Math.imul(t.i + 3, 69069) >>> 0) % 100) / 100,
            dist: t.dist,
          }));
        let treesGroup = instanceTrees(species, treeList, 60, false);

        // ---------- construcciones ----------
        const recs = buildingsRaw.buildings;
        const houses = [];
        for (const [, refH, ring] of recs) {
          let cx = 0;
          let cy = 0;
          const pts = ring.map(([lon, lat]) => {
            const [tx, ty] = lonLatToTile(lon, lat);
            const [X, Z] = toXZ(tx, ty);
            cx += X;
            cy += Z;
            return [X, Z];
          });
          cx /= pts.length;
          cy /= pts.length;
          // rectángulo orientado por PCA
          let sxx = 0;
          let szz = 0;
          let sxz = 0;
          for (const [X, Z] of pts) {
            sxx += (X - cx) ** 2;
            szz += (Z - cy) ** 2;
            sxz += (X - cx) * (Z - cy);
          }
          const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          let minA = 1e9;
          let maxA = -1e9;
          let minB = 1e9;
          let maxB = -1e9;
          for (const [X, Z] of pts) {
            const a = (X - cx) * ca + (Z - cy) * sa;
            const b = -(X - cx) * sa + (Z - cy) * ca;
            minA = Math.min(minA, a); maxA = Math.max(maxA, a);
            minB = Math.min(minB, b); maxB = Math.max(maxB, b);
          }
          const u = (cx / mpt + txc - tx0) / (tx1 - tx0);
          const v = (cy / mpt + tyc - ty0) / (ty1 - ty0);
          if (u < 0 || u > 1 || v < 0 || v > 1) continue;
          const px = Math.max(0, Math.min(W - 1, Math.floor(u * W)));
          const py = Math.max(0, Math.min(H - 1, Math.floor(v * H)));
          let dm = distM[py * W + px];
          // dentro del detalle del casco urbano se usa la distancia al mar de alta resolución (~1,2 m)
          if (inPatch[py * W + px]) {
            const tx15 = cx / mpt + txc;
            const ty15 = cy / mpt + tyc;
            const hx = Math.floor(((tx15 * 8 - PM.x0) / tile18) * PW);
            const hy = Math.floor(((ty15 * 8 - PM.y0) / tile18) * PW);
            if (hx >= 0 && hy >= 0 && hx < PW && hy < PW) dm = pDist[hy * PW + hx];
          }
          houses.push({
            x: cx, z: cy, ang, w: Math.max(3, maxA - minA), d: Math.max(3, maxB - minB), h: refH || 4,
            y: heightAtUV(u, v), lostAt: dm / TASA,
          });
        }
        const lostCount = (yr) => houses.reduce((n, hh) => n + (hh.lostAt <= yr ? 1 : 0), 0);
        const geoBox = new THREE.BoxGeometry(1, 1, 1);
        geoBox.translate(0, 0.5, 0);
        const houseMesh = new THREE.InstancedMesh(
          geoBox,
          new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
          houses.length
        );
        houseMesh.frustumCulled = false;
        const m4 = new THREE.Matrix4();
        const qn = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        const sv = new THREE.Vector3();
        const pv = new THREE.Vector3();
        const roof = new THREE.Color();
        const RED = new THREE.Color(0xff1f1f);
        let curYear = 0;
        let curMode = 'perdida';
        let curScale = CASA_ESCALA;
        const updateHouses = (yr, modo) => {
          curYear = yr;
          curMode = modo;
          houses.forEach((hh, k) => {
            const lost = hh.lostAt <= yr;
            const hide = lost && modo === 'despues';
            qn.setFromAxisAngle(up, -hh.ang);
            pv.set(hh.x, hh.y, hh.z);
            const s = hide ? 0.0001 : curScale;
            sv.set(hh.w * s, hh.h * s, hh.d * s);
            m4.compose(pv, qn, sv);
            houseMesh.setMatrixAt(k, m4);
            if (lost) roof.copy(RED);
            else roof.setHSL(0.09, 0.08 + ((k * 37) % 10) / 100, 0.78 + ((k * 53) % 10) / 100);
            houseMesh.setColorAt(k, roof);
          });
          houseMesh.instanceMatrix.needsUpdate = true;
          if (houseMesh.instanceColor) houseMesh.instanceColor.needsUpdate = true;
        };
        updateHouses(0, 'perdida');

        // ---------- escena ----------
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x9fc6d4, 0.000011);
        scene.add(terrain, overlay, patch, pOverlay, houseMesh, treesGroup);
        const rebuildTrees = (minDist) => {
          scene.remove(treesGroup);
          treesGroup.traverse((o) => { if (o.isInstancedMesh) o.dispose(); });
          treesGroup = instanceTrees(species, minDist > 0 ? treeList.filter((t) => t.dist >= minDist) : treeList, 60, false);
          scene.add(treesGroup);
        };

        const sky = new Sky();
        sky.scale.setScalar(450000);
        const su = sky.material.uniforms;
        su.turbidity.value = 2;
        su.rayleigh.value = 2.4;
        su.mieCoefficient.value = 0.004;
        su.mieDirectionalG.value = 0.82;
        const sunDir = new THREE.Vector3();
        sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 38), THREE.MathUtils.degToRad(215));
        su.sunPosition.value.copy(sunDir);
        scene.add(sky);

        const normals = new THREE.TextureLoader().load(`${BASE}textures/water_normals_fine.jpg`);
        normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
        normals.repeat.set(900, 900);
        const water = new THREE.Mesh(
          new THREE.PlaneGeometry(200000, 200000),
          new THREE.MeshStandardMaterial({
            color: 0x0a4f80, roughness: 0.62, metalness: 0, normalMap: normals, normalScale: new THREE.Vector2(0.35, 0.35),
          })
        );
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0;
        scene.add(water);
        const sun = new THREE.DirectionalLight(0xfff0d8, 2.6);
        sun.position.copy(sunDir).multiplyScalar(8000);
        scene.add(sun);
        scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x6b5d3a, 0.7));

        const camera = new THREE.PerspectiveCamera(42, 1, 20, 400000);
        const controls = new OrbitControls(camera, el);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.enableZoom = false; // evita atrapar el scroll de la página; se usa +/− o Ctrl+rueda
        controls.maxPolarAngle = 1.42;
        controls.minDistance = 250;
        controls.maxDistance = 30000;
        el.style.touchAction = 'pan-y';

        // puntos de interés: casco urbano de la vista Revit (modelo → lon/lat → teselas)

        const presets = {
          isla: { pos: new THREE.Vector3(500, 7800, 8400), target: new THREE.Vector3(0, 0, 300) },
          casco: { pos: new THREE.Vector3(vx + 380, 520, vz + 700), target: new THREE.Vector3(vx, 10, vz) },
        };
        let tween = null;
        const goTo = (name, instant) => {
          const pr = presets[name];
          if (!pr) return;
          if (instant) {
            camera.position.copy(pr.pos);
            controls.target.copy(pr.target);
            return;
          }
          tween = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), pr };
        };
        goTo('isla', true);

        const resize = () => {
          const w = mount.clientWidth || 1;
          const h = mount.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);
        cleanups.push(() => ro.disconnect());

        const dolly = (f) => {
          const dir = camera.position.clone().sub(controls.target);
          const len = THREE.MathUtils.clamp(dir.length() * f, controls.minDistance, controls.maxDistance);
          camera.position.copy(controls.target).add(dir.setLength(len));
        };
        const onWheel = (e) => {
          if (!e.ctrlKey) return;
          e.preventDefault();
          dolly(e.deltaY > 0 ? 1.12 : 0.89);
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        cleanups.push(() => el.removeEventListener('wheel', onWheel));

        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 });
        io.observe(mount);
        cleanups.push(() => io.disconnect());

        // ---------- API para la interfaz ----------
        let lastYear = -1;
        let lastMode = '';
        apiRef.current = {
          apply: (yr, modo) => {
            const yi = Math.round(yr);
            if (yi === lastYear && modo === lastMode) return;
            if (modo !== lastMode || yi !== lastYear) {
              const R = TASA * yi;
              writeRed(R);
              redTex.needsUpdate = true;
              overlay.visible = modo === 'perdida' && yi > 0;
              writeAlpha(modo === 'despues' ? R : 0);
              alphaTex.needsUpdate = true;
              writePatchRed(R);
              pRedTex.needsUpdate = true;
              pOverlay.visible = modo === 'perdida' && yi > 0;
              writePatchAlpha(modo === 'despues' ? R : 0);
              pAlphaTex.needsUpdate = true;
              rebuildTrees(modo === 'despues' ? R : 0);
              updateHouses(yi, modo);
              lastYear = yi;
              lastMode = modo;
              setStats({
                casas: lostCount(yi),
                ha: ha(cumLostPx[Math.min(30, yi)]),
                pct: (cumLostPx[Math.min(30, yi)] / landPx) * 100,
                m: R,
              });
            }
          },
          goTo,
          zoomIn: () => dolly(0.7),
          zoomOut: () => dolly(1.4),
        };
        setTotals({ casas: houses.length, ha: ha(landPx), mpp });
        apiRef.current.apply(0, 'perdida');
        const t0 = performance.now();
        const tick = () => {
          raf = requestAnimationFrame(tick);
          if (!visible) return;
          const t = (performance.now() - t0) / 1000;
          if (tween) {
            tween.t = Math.min(1, tween.t + 0.025);
            const k = 1 - (1 - tween.t) ** 3;
            camera.position.lerpVectors(tween.p0, tween.pr.pos, k);
            controls.target.lerpVectors(tween.t0, tween.pr.target, k);
            if (tween.t >= 1) tween = null;
          }
          controls.update();
          treesGroup.visible = camera.position.distanceTo(controls.target) < 3500; // árboles solo al acercarse
          const want = THREE.MathUtils.clamp(camera.position.distanceTo(controls.target) / 3800, 1, CASA_ESCALA);
          if (Math.abs(want - curScale) / curScale > 0.06) {
            curScale = want;
            updateHouses(curYear, curMode);
          }
          normals.offset.set(t * 0.0006, t * 0.0004);
          renderer.render(scene, camera);
          if (el.style.opacity === '0') {
            el.style.opacity = '1';
            setStatus('listo');
          }
        };
        tick();
      } catch (err) {
        console.warn('Simulación 3D no disponible:', err);
        setStatus('error');
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      apiRef.current = null;
    };
  }, []);

  // aplica año/modo a la escena
  useEffect(() => {
    if (apiRef.current) apiRef.current.apply(year, mode);
  }, [year, mode, status]);

  // reproducción 0 → 30
  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setYear((y) => {
        if (y >= 30) {
          setPlaying(false);
          return 30;
        }
        return y + 1;
      });
    }, 420);
    return () => clearInterval(id);
  }, [playing]);

  const horizonBtn = (y) => (
    <button
      key={y}
      onClick={() => { setPlaying(false); setYear(y); }}
      className={`h-10 px-4 rounded-md text-sm border transition-colors cursor-pointer ${
        year === y ? 'bg-white text-[#0b1015] border-white' : 'border-white/30 text-white/85 hover:border-white'
      }`}
    >
      {y === 0 ? 'Hoy' : `${y} años`}
    </button>
  );

  return (
    <div className={className}>
      <div className="relative h-[68svh] min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1015]">
        <div ref={mountRef} className="absolute inset-0" aria-label="Tierra Bomba en 3D con simulación de erosión" />
        {status === 'cargando' && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
            Calculando la isla en 3D…
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/70">
            Este dispositivo no pudo mostrar la vista 3D de la isla.
          </div>
        )}

        {status === 'listo' && (
          <>
            {/* Panel de resultados */}
            <div className="absolute left-3 top-3 sm:left-5 sm:top-5 w-[min(21rem,calc(100%-1.5rem))] rounded-xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/30">
              <p className="text-xs text-white/70">
                {year === 0 ? 'Hoy' : `Si no se frena la erosión: +${year} años`}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-3xl font-semibold leading-none text-[#ff8a80]">
                    {stats ? stats.casas.toLocaleString('es-CO') : '—'}
                  </p>
                  <p className="mt-1 text-[11px] text-white/70 leading-tight">
                    viviendas perdidas{totals ? ` de ${totals.casas.toLocaleString('es-CO')}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold leading-none">
                    {stats ? stats.ha.toFixed(stats.ha < 10 ? 1 : 0).replace('.', ',') : '—'}
                  </p>
                  <p className="mt-1 text-[11px] text-white/70 leading-tight">
                    hectáreas de costa{stats ? ` (${stats.pct.toFixed(1).replace('.', ',')} % de la isla)` : ''}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-white/60">
                Retroceso: {stats ? stats.m.toFixed(0) : 0} m de la línea de costa
              </p>
            </div>

            {/* Leyenda */}
            <div className="absolute right-3 top-3 sm:right-5 sm:top-5 hidden sm:flex flex-col gap-1.5 rounded-xl border border-white/25 bg-black/30 p-3 text-[11px] text-white/85 backdrop-blur-md">
              {[
                ['#991b1b', 'Se pierde en 10 años'],
                ['#dc2626', 'Entre 10 y 20 años'],
                ['#f87171', 'Entre 20 y 30 años'],
              ].map(([c, t]) => (
                <span key={t} className="flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: c }} />{t}</span>
              ))}
              <span className="flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm bg-[#ff1f1f]" />Vivienda perdida</span>
            </div>

            {/* Zoom y vistas */}
            <div className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button onClick={() => apiRef.current?.goTo('isla')} className="h-9 px-3 rounded-md border border-white/35 bg-black/30 text-xs text-white backdrop-blur-md hover:bg-white hover:text-[#16181d] cursor-pointer">Isla completa</button>
                <button onClick={() => apiRef.current?.goTo('casco')} className="h-9 px-3 rounded-md border border-white/35 bg-black/30 text-xs text-white backdrop-blur-md hover:bg-white hover:text-[#16181d] cursor-pointer">Casco urbano</button>
              </div>
              <div className="flex gap-2">
                <button aria-label="Acercar" onClick={() => apiRef.current?.zoomIn()} className="h-9 w-9 grid place-items-center rounded-md border border-white/35 bg-black/30 text-white backdrop-blur-md hover:bg-white hover:text-[#16181d] cursor-pointer"><Plus className="h-4 w-4" /></button>
                <button aria-label="Alejar" onClick={() => apiRef.current?.zoomOut()} className="h-9 w-9 grid place-items-center rounded-md border border-white/35 bg-black/30 text-white backdrop-blur-md hover:bg-white hover:text-[#16181d] cursor-pointer"><Minus className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controles */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => { if (year >= 30) setYear(0); setPlaying((p) => !p); }}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-md bg-[#c86d51] text-white text-sm font-medium hover:bg-[#b85d3d] transition-colors cursor-pointer"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Pausar' : 'Simular'}
        </button>
        <div className="flex gap-2">{[0, 10, 20, 30].map(horizonBtn)}</div>
        <div className="ml-auto flex rounded-md border border-white/30 overflow-hidden text-sm">
          {[['perdida', 'Ver lo que se pierde'], ['despues', 'Ver cómo quedaría']].map(([k, t]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`h-10 px-3 cursor-pointer transition-colors ${mode === k ? 'bg-white text-[#0b1015]' : 'text-white/80 hover:bg-white/10'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <input
        type="range" min="0" max="30" step="1" value={year}
        onChange={(e) => { setPlaying(false); setYear(+e.target.value); }}
        className="mt-4 w-full accent-[#c86d51]"
        aria-label="Años de simulación"
      />
      <p className="mt-3 text-xs text-white/45 leading-relaxed">
        Escenario ilustrativo: retroceso uniforme de toda la costa a {String(TASA).replace('.', ',')} m/año, la tasa máxima registrada en el proyecto.
        La erosión real varía por tramo. Distancia al mar calculada sobre la silueta oficial de la isla{totals ? ` (≈ ${totals.mpp.toFixed(1).replace('.', ',')} m por píxel)` : ''}.
        Las {totals ? totals.casas.toLocaleString('es-CO') : '2.600'} construcciones vienen del archivo de la tesis; sus alturas son de referencia, no medidas, y se amplían al alejar la cámara para verse a escala de isla.
        Arrastra para girar; usa +/− o Ctrl + rueda para acercar.
      </p>
    </div>
  );
}







