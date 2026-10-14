import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import pastoTexImg from '../assets/textura_pasto_m5.png';
import aguaTexImg from '../assets/textura_agua_m5.jpg';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import rvtPreviewImg from '../assets/rvt_tierrabomba_preview.png';

// Módulo 05: solo el modelo Revit (TIERRABOMBA-3DView, FBX nativo exportado).
// Acostado (plano XY) con curvas de nivel resaltadas. Sin nada más.
const DEFAULT_MODEL_URL = `${import.meta.env.BASE_URL}models/tierrabomba_3dview.fbx`;
// Vista compartida del RVT real en Autodesk Viewer (tu enlace)
const DEFAULT_VIEWER_LINK = 'https://viewer.autodesk.com/id/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YTM2MHZpZXdlci1wcm90ZWN0ZWQvdDE3OTE4MTU2ODhfMjEzYzdhNDgtM2Y0NC00YjU0LTgzZjItZmU4MzlkZWJhMTkyLnJ2dA';

// Terreno = hijo directo de mayor área XZ (en coordenadas de mundo, pre-transformación)
function findTerrain(root) {
  const kids = root.children || [];
  let best = null;
  let bestArea = -1;
  const box = new THREE.Box3();
  kids.forEach((k) => {
    box.setFromObject(k);
    const sx = box.max.x - box.min.x;
    const sz = box.max.z - box.min.z;
    const area = sx * sz;
    if (isFinite(area) && area > bestArea && sx > 0 && sz > 0) {
      bestArea = area;
      best = k;
    }
  });
  return best;
}

// Curvas de nivel reales: marching squares sobre la malla del terreno.
// Devuelve { lines: LineSegments|null, levels: number }
function buildContours(terrain) {
  let mesh = null;
  terrain.traverse ? terrain.traverse((c) => {
    if (!mesh && c.isMesh && c.geometry && c.geometry.attributes && c.geometry.attributes.position && c.geometry.attributes.position.count > 100) mesh = c;
  }) : null;
  if (!mesh) return { lines: null, levels: 0 };
  const pos = mesh.geometry.attributes.position;
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox;
  const sx = bb.max.x - bb.min.x;
  const sz = bb.max.z - bb.min.z;
  if (!(sx > 0) || !(sz > 0)) return { lines: null, levels: 0 };

  const NX = 200;
  const NZ = 200;
  const W = NX + 1;
  const sum = new Float64Array(W * (NZ + 1));
  const cnt = new Float64Array(W * (NZ + 1));
  const vx = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    vx.fromBufferAttribute(pos, i);
    const gx = Math.min(NX, Math.max(0, Math.round(((vx.x - bb.min.x) / sx) * NX)));
    const gz = Math.min(NZ, Math.max(0, Math.round(((vx.z - bb.min.z) / sz) * NZ)));
    const k = gz * W + gx;
    sum[k] += vx.y;
    cnt[k] += 1;
  }
  const h = new Float32Array(W * (NZ + 1));
  let hmin = Infinity;
  let hmax = -Infinity;
  for (let k = 0; k < h.length; k++) {
    if (cnt[k] > 0) {
      h[k] = sum[k] / cnt[k];
      if (h[k] < hmin) hmin = h[k];
      if (h[k] > hmax) hmax = h[k];
    } else {
      h[k] = NaN;
    }
  }
  if (!(hmax > hmin)) return { lines: null, levels: 0, segments: 0 };
  // Relleno por difusión (40 pasadas): tapa huecos sin vértices sin invadir el mar
  let pending = 0;
  for (let k = 0; k < h.length; k++) if (isNaN(h[k])) pending++;
  const tmp = new Float32Array(h.length);
  for (let pass = 0; pass < 40 && pending > 0; pass++) {
    tmp.set(h);
    let filled = 0;
    for (let iz = 0; iz <= NZ; iz++) {
      for (let ix = 0; ix <= NX; ix++) {
        const k = iz * W + ix;
        if (!isNaN(h[k])) continue;
        let s = 0;
        let n = 0;
        if (ix > 0 && !isNaN(h[k - 1])) { s += h[k - 1]; n++; }
        if (ix < NX && !isNaN(h[k + 1])) { s += h[k + 1]; n++; }
        if (iz > 0 && !isNaN(h[k - W])) { s += h[k - W]; n++; }
        if (iz < NZ && !isNaN(h[k + W])) { s += h[k + W]; n++; }
        if (n > 0) { tmp[k] = s / n; filled++; }
      }
    }
    h.set(tmp);
    pending -= filled;
    if (filled === 0) break;
  }
  const range = hmax - hmin;
  const LEVELS = 30;
  const step = range / LEVELS;
  const eps = range * 0.01 + Math.max(sx, sz) * 0.0004;
  const segs = [];
  const Xat = (ix, t) => bb.min.x + ((ix + t) / NX) * sx;
  const Zat = (iz, t) => bb.min.z + ((iz + t) / NZ) * sz;
  const cross = (v0, v1, level) => (level - v0) / (v1 - v0);
  for (let L = 1; L < LEVELS; L++) {
    const level = hmin + step * L;
    for (let iz = 0; iz < NZ; iz++) {
      for (let ix = 0; ix < NX; ix++) {
        const a = h[iz * W + ix];
        const b = h[iz * W + ix + 1];
        const c = h[(iz + 1) * W + ix + 1];
        const d = h[(iz + 1) * W + ix];
        if (!isFinite(a + b + c + d)) continue;
        const pts = [];
        if ((a < level) !== (b < level)) {
          const t = cross(a, b, level);
          pts.push([Xat(ix, t), Zat(iz, 0)]);
        }
        if ((b < level) !== (c < level)) {
          const t = cross(b, c, level);
          pts.push([Xat(ix, 1), Zat(iz, t)]);
        }
        if ((d < level) !== (c < level)) {
          const t = cross(d, c, level);
          pts.push([Xat(ix, t), Zat(iz, 1)]);
        }
        if ((a < level) !== (d < level)) {
          const t = cross(a, d, level);
          pts.push([Xat(ix, 0), Zat(iz, t)]);
        }
        if (pts.length === 2) {
          segs.push(pts[0][0], level + eps, pts[0][1], pts[1][0], level + eps, pts[1][1]);
        } else if (pts.length === 4) {
          segs.push(pts[0][0], level + eps, pts[0][1], pts[1][0], level + eps, pts[1][1]);
          segs.push(pts[2][0], level + eps, pts[2][1], pts[3][0], level + eps, pts[3][1]);
        }
      }
    }
  }
  if (segs.length < 6) return { lines: null, levels: 0, segments: 0 };
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs), 3));
  const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x2b5fc7 }));
  mesh.add(lines); // hereda la transformación del terreno: siempre pegadas al suelo
  return { lines, levels: LEVELS - 1, segments: segs.length / 6 };
}

function ModelViewer({ onStats, preset, presetNonce, axisFlip, fitNonce, viewClass, wireframe }) {
  const mountRef = useRef(null);
  const applyViewRef = useRef(null);
  const modelRef = useRef(null);
  const baseRef = useRef(null);
  const rootRef = useRef(null);
  const fitCtl = useRef(null);
  const axisFlipRef = useRef(axisFlip);
  axisFlipRef.current = axisFlip;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f4f0);
    scene.fog = new THREE.Fog(0xf5f4f0, 150, 420);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    // Luz de entorno (reflejos suaves tipo visor) + sol cálido lateral
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8e4da, 0.5));
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const sun = new THREE.DirectionalLight(0xfff2df, 1.6);
    sun.position.set(70, 95, 45);
    // Contraluz fría suave para volumen realista
    const rim = new THREE.DirectionalLight(0xdfeaf5, 0.5);
    rim.position.set(-60, 30, -70);
    scene.add(rim);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    scene.add(sun);

    const root = new THREE.Group();
    rootRef.current = root;
    scene.add(root);

    const sph = { radius: 72, theta: Math.PI / 4, phi: Math.PI / 3.1 };
    const target = { x: 0, y: 2, z: 0 };
    const place = () => {
      camera.position.set(
        target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
        target.y + sph.radius * Math.cos(sph.phi),
        target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
      );
      camera.lookAt(target.x, target.y, target.z);
    };
    place();

    let cancelled = false;
    let waterAdded = false;
    const countMeshes = (obj) => {
      let n = 0;
      let lines = 0;
      obj.traverse((c) => {
        if (c.isMesh) n += 1;
        if (c.isLine || c.isLineSegments) lines += 1;
      });
      return { n, lines };
    };

    // Encuadra el modelo real: mide, acuesta, escala y centra la cámara
    const frameModel = () => {
      const obj = modelRef.current;
      if (!obj) return;
      obj.rotation.set(0, 0, 0);
      if (axisFlipRef.current) obj.rotation.x = -Math.PI / 2;
      obj.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (!isFinite(maxDim) || maxDim <= 0) return;
      const s = 34 / maxDim;
      obj.scale.setScalar(s);
      obj.position.set(-center.x * s, -box.min.y * s, -center.z * s);
      obj.updateMatrixWorld(true);
      const c2 = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
      target.x = c2.x; target.y = c2.y; target.z = c2.z;
      sph.radius = 80;
      place();
    };

    const finish = (obj) => {
      if (cancelled) return;
      modelRef.current = obj;
      obj.updateMatrixWorld(true); // matrices al día antes de medir cada malla

      // Ejes del archivo (Z arriba): huella = sx*sy, altura = sz.
      // La lámina plana es la falda del propio terreno (z bajo): se parte por caras.
      let island = null;
      try { island = findTerrain(obj); } catch (e) {}
      const tMeshes = [];
      if (island) island.traverse((c) => { if (c.isMesh && c.geometry && c.geometry.attributes && c.geometry.attributes.position) tMeshes.push(c); });

      const texLoader = new THREE.TextureLoader();
      const pastoTex = texLoader.load(pastoTexImg);
      pastoTex.wrapS = THREE.RepeatWrapping;
      pastoTex.wrapT = THREE.RepeatWrapping;
      pastoTex.repeat.set(1, 1);
      pastoTex.anisotropy = 4;
      pastoTex.colorSpace = THREE.SRGBColorSpace;
      const aguaTex = texLoader.load(aguaTexImg);
      aguaTex.wrapS = THREE.RepeatWrapping;
      aguaTex.wrapT = THREE.RepeatWrapping;
      aguaTex.repeat.set(1, 1);
      aguaTex.anisotropy = 4;
      aguaTex.colorSpace = THREE.SRGBColorSpace;
      const grassMat = new THREE.MeshStandardMaterial({ map: pastoTex, color: 0xbfe3b0, roughness: 0.95 });
      const waterMat = new THREE.MeshStandardMaterial({ map: aguaTex, color: 0xcfeaf5, roughness: 0.35, metalness: 0.15 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
      const roadMat = new THREE.MeshStandardMaterial({ color: 0xd62f2f, roughness: 0.85, emissive: 0x7f1d1d, emissiveIntensity: 0.35, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const paleMat = new THREE.MeshStandardMaterial({ color: 0xc9c9c9, roughness: 0.95 });

      // UV plano cenital si la malla no trae (el FBX de Revit suele venir sin UVs útiles)
function ensureTopUVs(geo, tile) {
  if (!geo || !geo.attributes || !geo.attributes.position || geo.attributes.uv) return;
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const p = geo.attributes.position;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = (p.getX(i) - bb.min.x) / tile;
    uv[i * 2 + 1] = (p.getY(i) - bb.min.y) / tile;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

// Isla partida por altura real: mar (falda baja) vs tierra, por caras
      const splitMeshes = new Set();
      const tmpV = new THREE.Vector3();
      tMeshes.forEach((tm) => {
        const g = tm.geometry;
        g.computeBoundingBox();
        const bb = g.boundingBox;
        const seaZ = bb.min.z + (bb.max.z - bb.min.z) * 0.08;
        const posA = g.attributes.position;
        const idx = g.index ? g.index.array : null;
        const faces = idx ? idx.length / 3 : posA.count / 3;
        const groups = [];
        let runMat = -1;
        let runStart = 0;
        let runCount = 0;
        const hz = (fi, k) => {
          const vi = idx ? idx[fi * 3 + k] : fi * 3 + k;
          tmpV.fromBufferAttribute(posA, vi);
          return tmpV.z;
        };
        for (let f = 0; f < faces; f++) {
          const h = (hz(f, 0) + hz(f, 1) + hz(f, 2)) / 3;
          const mi = h < seaZ ? 0 : 1;
          if (mi !== runMat) {
            if (runCount > 0) groups.push([runStart, runCount, runMat]);
            runMat = mi;
            runStart = f * 3;
            runCount = 0;
          }
          runCount += 3;
        }
        if (runCount > 0) groups.push([runStart, runCount, runMat]);
        if (groups.length === 0) return;
        g.clearGroups();
        groups.forEach(([s, cc, mi]) => g.addGroup(s, cc, mi));
        ensureTopUVs(tm.geometry, 120);
        tm.material = [waterMat, grassMat];
        splitMeshes.add(tm);
      });

      const mBox = new THREE.Box3();
      obj.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (splitMeshes.has(c)) return; // ya lleva agua+pasto por caras
          mBox.setFromObject(c);
          const sx = mBox.max.x - mBox.min.x;
          const sy = mBox.max.y - mBox.min.y;
          const sz = mBox.max.z - mBox.min.z;
          const footprint = sx * sy;
          if (sz > 2 && footprint < 40000) {
            c.material = whiteMat; // casas y muros blancos (las vías llegan en archivo aparte)
          } else {
            c.material = paleMat;
          }
        }
      });
      obj.updateMatrixWorld(true);
      const box0 = new THREE.Box3().setFromObject(obj);
      root.add(obj);
      const nn = countMeshes(obj);
      baseRef.current = {
        size: box0.getSize(new THREE.Vector3()),
        center: box0.getCenter(new THREE.Vector3())
      };
      const bbr = baseRef.current;
      if (onStats) {
        onStats({
          meshes: nn.n !== undefined ? nn.n : nn,
          size: [bbr.size.x, bbr.size.y, bbr.size.z],
          center: [bbr.center.x, bbr.center.y, bbr.center.z]
        });
      }
      frameModel();
    };

    new FBXLoader().load(
      DEFAULT_MODEL_URL,
      (obj) => finish(obj),
      undefined,
      () => {}
    );

    applyViewRef.current = (name) => {
      if (name === 'top') sph.phi = 0.06;
      else if (name === 'front') { sph.phi = Math.PI / 2 - 0.06; sph.theta = 0; }
      else if (name === 'axon') { sph.phi = Math.PI / 3.1; sph.theta = Math.PI / 4; }
      place();
    };
    fitCtl.current = () => frameModel();

    let dragging = false;
    let px = 0;
    let py = 0;
    const down = (e) => { dragging = true; px = e.clientX; py = e.clientY; };
    const move = (e) => {
      if (!dragging) return;
      sph.theta -= (e.clientX - px) * 0.005;
      sph.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.02, sph.phi - (e.clientY - py) * 0.005));
      px = e.clientX; py = e.clientY;
      place();
    };
    const up = () => { dragging = false; };
    const wheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(16, Math.min(260, sph.radius * (e.deltaY > 0 ? 1.1 : 0.9)));
      place();
    };
    const el = renderer.domElement;
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      renderer.dispose();
      if (el.parentNode === container) container.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (preset && applyViewRef.current) applyViewRef.current(preset);
  }, [preset, presetNonce]);

  useEffect(() => {
    if (fitCtl.current) fitCtl.current();
  }, [fitNonce, axisFlip]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.traverse((c) => {
      if (c.isMesh) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach((m) => { if (m && 'wireframe' in m) m.wireframe = wireframe; });
      }
    });
  }, [wireframe]);

  return <div ref={mountRef} className={viewClass || 'w-full h-[76vh] min-h-[540px] cursor-grab active:cursor-grabbing'} />;
}

export default function RevitModule() {
  const [viewPreset, setViewPreset] = useState('axon');
  const [presetNonce, setPresetNonce] = useState(0);
  const [axisFlip, setAxisFlip] = useState(true); // el FBX de Revit llega parado: acostarlo por defecto
  const [fitNonce, setFitNonce] = useState(0);
  const [modelStats, setModelStats] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wireframe, setWireframe] = useState(true); // vista wireframe como en Revit
  const pickView = (name) => { setViewPreset(name); setPresetNonce((n) => n + 1); };

  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
    return () => clearTimeout(t);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  return (
    <div className="w-full h-full overflow-y-auto animate-fade-in bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm shadow-md">05</div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-700">Modelo BIM de tesis</span>
            <h2 className="font-bold text-lg sm:text-xl text-slate-900">Modelo Revit · Tierrabomba</h2>
          </div>
        </div>

        <div className={isFullscreen ? 'fixed inset-0 z-[900] bg-white p-2 sm:p-4 flex flex-col rounded-none overflow-hidden border-0 shadow-none' : 'rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm'}>
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-800">TIERRABOMBA-3DView · Revit FBX</span>
            <button
              onClick={() => setIsFullscreen((v) => !v)}
              className="ml-auto px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all"
              title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Ver en pantalla completa'}
            >
              {isFullscreen ? '✕ Salir' : '⛶ Pantalla completa'}
            </button>
          </div>
          <div className={isFullscreen ? 'flex-1 min-h-0' : ''}>
          <ModelViewer onStats={setModelStats} preset={viewPreset} presetNonce={presetNonce} axisFlip={axisFlip} fitNonce={fitNonce} wireframe={wireframe} viewClass={isFullscreen ? 'w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing' : undefined} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-t border-slate-200">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mr-1">Vista:</span>
            {[
              ['axon', 'Axonométrica'],
              ['top', 'Desde arriba'],
              ['front', 'Frente'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => pickView(id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all ${viewPreset === id ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setFitNonce((n) => n + 1)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all"
            >
              Encuadrar
            </button>
            <button
              onClick={() => setAxisFlip((v) => !v)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all ${axisFlip ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Plano / Parado
            </button>
            <button
              onClick={() => setWireframe((v) => !v)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all ${wireframe ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              title="Ver como wireframe o sombreado"
            >
              Wireframe
            </button>
            {modelStats ? (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">
                {`Mallas ${modelStats.meshes} · ${modelStats.size.map((v) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1))).join(' × ')} u`}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">Cargando modelo… arrastra para orbitar</span>
            )}
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-800">Modelo RVT original · Autodesk Viewer</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6">
            <img
              src={rvtPreviewImg}
              alt="Vista previa real del modelo TIERRABOMBA.rvt"
              draggable={false}
              className="w-40 rounded-2xl shadow-lg border border-slate-200"
            />
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm font-bold text-slate-900">Tu modelo RVT tal cual, en 3D interactivo</p>
              <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                Autodesk no permite incrustarlo dentro de otra página: se abre en su visor oficial con órbita, zoom, cortes y medidas.
              </p>
              <a
                href={DEFAULT_VIEWER_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all"
              >
                <span>Abrir modelo 3D</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
