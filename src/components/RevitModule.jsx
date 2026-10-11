import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Módulo 05: solo el modelo Revit (TIERRABOMBA-3DView, FBX nativo exportado).
// Acostado (plano XY) con curvas de nivel resaltadas. Sin nada más.
const DEFAULT_MODEL_URL = `${import.meta.env.BASE_URL}models/tierrabomba_3dview.fbx`;

function ModelViewer({ onStats, preset, presetNonce, axisFlip, fitNonce }) {
  const mountRef = useRef(null);
  const applyViewRef = useRef(null);
  const modelRef = useRef(null);
  const fitCtl = useRef(null);
  const axisFlipRef = useRef(axisFlip);
  axisFlipRef.current = axisFlip;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe8d4);
    scene.fog = new THREE.Fog(0xdbe8d4, 150, 420);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbe8d4, 1.05));
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfffaed, 1.6);
    sun.position.set(60, 80, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    scene.add(sun);

    const grid = new THREE.GridHelper(70, 70, 0x334155, 0x94a3b8);
    grid.position.y = -0.05;
    scene.add(grid);

    const root = new THREE.Group();
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
      obj.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (!c.material) {
            c.material = new THREE.MeshStandardMaterial({ color: 0xd9cfbf, roughness: 0.9 });
          } else if (Array.isArray(c.material)) {
            c.material.forEach((mm) => { mm.side = THREE.DoubleSide; });
          } else {
            c.material.side = THREE.DoubleSide;
          }
        }
        // Curvas de nivel: siempre visibles en terracota oscuro
        if (c.isLine || c.isLineSegments) {
          c.material = new THREE.LineBasicMaterial({ color: 0x93391f });
        }
      });
      obj.updateMatrixWorld(true);
      const box0 = new THREE.Box3().setFromObject(obj);
      const size0 = box0.getSize(new THREE.Vector3());
      root.add(obj);
      if (onStats) {
        const { n, lines } = countMeshes(obj);
        onStats({ meshes: n, lines, size: [size0.x, size0.y, size0.z] });
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

  return <div ref={mountRef} className="w-full h-[76vh] min-h-[540px] cursor-grab active:cursor-grabbing" />;
}

export default function RevitModule() {
  const [viewPreset, setViewPreset] = useState('axon');
  const [presetNonce, setPresetNonce] = useState(0);
  const [axisFlip, setAxisFlip] = useState(true); // el FBX de Revit llega parado: acostarlo por defecto
  const [fitNonce, setFitNonce] = useState(0);
  const [modelStats, setModelStats] = useState(null);
  const pickView = (name) => { setViewPreset(name); setPresetNonce((n) => n + 1); };

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

        <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-800">TIERRABOMBA-3DView · Revit FBX</span>
          </div>
          <ModelViewer onStats={setModelStats} preset={viewPreset} presetNonce={presetNonce} axisFlip={axisFlip} fitNonce={fitNonce} />
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
            {modelStats ? (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">
                {`Mallas ${modelStats.meshes} · curvas ${modelStats.lines} · ${modelStats.size.map((v) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1))).join(' × ')} u`}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 ml-auto">Cargando modelo… arrastra para orbitar</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
