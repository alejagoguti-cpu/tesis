import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  Building2,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  X,
  Box,
  ExternalLink,
  FileCode
} from 'lucide-react';

// Módulo 05: Modelo Revit Tierrabomba.
// Los navegadores no leen .rvt nativo (formato propietario Autodesk):
// se carga el RVT para ficha + guía de exportación, el modelo
// exportado (.glb / .obj) se visualiza, y mientras tanto se muestra
// una maqueta procedural animada de la isla para que el 3D siempre se vea.

const RVT_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];

async function sniffFile(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  let magic = '';
  try {
    const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    magic = Array.from(head).map((b) => b.toString(16).padStart(2, '0')).join(' ');
  } catch (e) {}
  const isRvt = ext === 'rvt' || RVT_MAGIC.every((b, i) => {
    const hb = parseInt(magic.split(' ')[i] || 'ff', 16);
    return hb === b;
  });
  return { ext, magic, isRvt };
}

// Maqueta procedural de Tierrabomba: mar, meseta +22m, 120 viviendas,
// colegio bioclimático y aljibe. Se ve siempre, con o sin archivo.
function buildDiorama() {
  const g = new THREE.Group();
  const mat = (color, extra) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05, ...(extra || {}) });

  const sea = new THREE.Mesh(new THREE.CircleGeometry(34, 48), mat(0x7dd3fc, { roughness: 0.35, metalness: 0.15 }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -0.4;
  g.add(sea);

  const island = new THREE.Mesh(new THREE.CylinderGeometry(11, 14.5, 3.2, 24), mat(0xe8e2d5));
  island.position.y = 0.6;
  g.add(island);

  const plateau = new THREE.Mesh(new THREE.CylinderGeometry(10.6, 11, 0.5, 24), mat(0x9ab65a, { roughness: 0.95 }));
  plateau.position.y = 2.4;
  g.add(plateau);

  // 120 viviendas palafíticas con cubierta a dos aguas
  const wallM = mat(0xc2785c);
  const roofM = mat(0x93391f, { roughness: 0.6 });
  const stiltM = mat(0x64432c);
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2 + (i % 7) * 0.06;
    const r = 3.4 + ((i * 37) % 60) / 10;
    const hx = Math.cos(a) * r;
    const hz = Math.sin(a) * r * 0.82;
    if (Math.abs(hx) < 3.4 && Math.abs(hz) < 2.4) continue; // reserva del colegio
    const h = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 0.9), stiltM);
    deck.position.y = 0.5;
    h.add(deck);
    const room = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.75), wallM);
    room.position.y = 0.85;
    h.add(room);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 1.05), roofM);
    roof.position.y = 1.18;
    roof.rotation.z = 0.1;
    h.add(roof);
    h.position.set(hx, 2.65, hz);
    h.rotation.y = a;
    g.add(h);
  }

  // Colegio bioclimático + cubierta captadora
  const school = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.25, 3.6), mat(0xead9b6));
  school.add(slab);
  [[-1.7, 0], [0, 0], [1.7, 0]].forEach(([x]) => {
    const aula = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.4), mat(0xc2785c));
    aula.position.set(x, 0.62, -0.7);
    school.add(aula);
  });
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.12, 4.0), mat(0x475569, { metalness: 0.5, roughness: 0.35 }));
  wingL.position.set(-1.4, 1.5, 0);
  wingL.rotation.z = -0.12;
  school.add(wingL);
  const wingR = wingL.clone();
  wingR.position.x = 1.4;
  wingR.rotation.z = 0.12;
  school.add(wingR);
  const gutter = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 4.0), mat(0x0284c7, { metalness: 0.6, roughness: 0.3 }));
  gutter.position.set(0, 1.2, 0);
  school.add(gutter);
  school.position.set(0, 2.65, 0.4);
  g.add(school);

  // Aljibe comunitario semitransparente bajo el colegio
  const cistern = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 1.1, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.55, roughness: 0.2 })
  );
  cistern.position.set(0, 1.9, 0.4);
  g.add(cistern);

  // Vegetación de borde (manglar y bosque seco)
  const leafM = mat(0x5c8f52, { roughness: 0.95 });
  const trunkM = mat(0x64432c);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const r = 10.8 + (i % 3) * 0.7;
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.9, 6), trunkM);
    trunk.position.y = 0.45;
    t.add(trunk);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.5, 7), leafM);
    crown.position.y = 1.5;
    t.add(crown);
    t.position.set(Math.cos(a) * r, 2.4, Math.sin(a) * r * 0.9);
    g.add(t);
  }

  // Balizas de la franja de erosión (costa oeste)
  const buoyM = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x991b1b, emissiveIntensity: 0.7 });
  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), buoyM);
    const t = -0.5 + i * 0.28;
    b.position.set(-13.5 - Math.sin(t) * 1.5, 0.1 + Math.sin(Date.now() / 900 + i) * 0.08, t * 9);
    g.add(b);
  }
  return g;
}

function CompactViewer({ fileUrl, fileExt, onError }) {
  const mountRef = useRef(null);
  const dragRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe8d4);
    scene.fog = new THREE.Fog(0xdbe8d4, 120, 320);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbe8d4, 1.0));
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfffaed, 1.5);
    sun.position.set(40, 60, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    scene.add(sun);

    const root = new THREE.Group();
    scene.add(root);

    let cancelled = false;
    if (fileUrl) {
      const finish = (obj) => {
        if (cancelled) return;
        obj.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 30 / (Math.max(size.x, size.y, size.z) || 1);
        obj.scale.setScalar(scale);
        obj.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        obj.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        root.add(obj);
      };
      if (fileExt === 'glb' || fileExt === 'gltf') {
        new GLTFLoader().load(fileUrl, (gltf) => finish(gltf.scene), undefined, (err) => onError('No se pudo leer el GLB/GLTF: ' + (err?.message || 'formato inválido')));
      } else if (fileExt === 'obj') {
        new OBJLoader().load(fileUrl, (obj) => finish(obj), undefined, (err) => onError('No se pudo leer el OBJ: ' + (err?.message || 'formato inválido')));
      }
    } else {
      root.add(buildDiorama());
    }

    // Órbita manual + rotación automática suave de la maqueta
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sph = { radius: 46, theta: Math.PI / 4, phi: Math.PI / 3.1 };
    const target = { x: 0, y: 3, z: 0 };
    const place = () => {
      camera.position.set(
        target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
        target.y + sph.radius * Math.cos(sph.phi),
        target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
      );
      camera.lookAt(target.x, target.y, target.z);
    };
    place();

    let px = 0;
    let py = 0;
    const down = (e) => { dragRef.current = true; px = e.clientX; py = e.clientY; };
    const move = (e) => {
      if (!dragRef.current) return;
      sph.theta -= (e.clientX - px) * 0.005;
      sph.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, sph.phi - (e.clientY - py) * 0.005));
      px = e.clientX; py = e.clientY;
      place();
    };
    const up = () => { dragRef.current = false; };
    const wheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(14, Math.min(160, sph.radius * (e.deltaY > 0 ? 1.1 : 0.9)));
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
      if (!reduceMotion && !dragRef.current && !fileUrl) {
        sph.theta += 0.0022; // giro vitrina de la maqueta
        place();
      }
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
  }, [fileUrl, fileExt, onError]);

  return <div ref={mountRef} className="w-full h-[52vh] min-h-[380px] cursor-grab active:cursor-grabbing" />;
}

export default function RevitModule() {
  const fileInputRef = useRef(null);
  const [rvtFile, setRvtFile] = useState(null);
  const [viewFile, setViewFile] = useState(null); // { url, ext, name, sizeMB }
  const [notice, setNotice] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => () => {
    if (viewFile?.url) URL.revokeObjectURL(viewFile.url);
  }, [viewFile]);

  const handleFiles = async (files) => {
    setNotice('');
    const file = files && files[0];
    if (!file) return;
    const { ext, isRvt } = await sniffFile(file);
    if (isRvt) {
      setRvtFile({ name: file.name, sizeMB: (file.size / (1024 * 1024)).toFixed(1) });
      setNotice('RVT detectado: formato nativo Revit. Expórtalo a IFC o GLB para verlo en el visor de abajo.');
      return;
    }
    if (['glb', 'gltf', 'obj'].includes(ext)) {
      if (viewFile?.url) URL.revokeObjectURL(viewFile.url);
      setViewFile({ url: URL.createObjectURL(file), ext, name: file.name, sizeMB: (file.size / (1024 * 1024)).toFixed(1) });
      return;
    }
    if (ext === 'ifc') {
      setNotice('IFC recibido: expórtalo a GLB desde Revit (o ábrelo en Autodesk Viewer) y súelo aquí para visualizarlo.');
      return;
    }
    setNotice('Formato no compatible. Usa .rvt (ficha), .ifc (guía) o .glb/.obj (visor).');
  };

  return (
    <div className="w-full h-full overflow-y-auto animate-fade-in bg-slate-50 dark:bg-deepsea-950">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Encabezado */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm shadow-md">05</div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-700">Modelo BIM de tesis</span>
            <h2 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white">Modelo Revit · Tierrabomba</h2>
          </div>
        </div>

        {/* Visor 3D siempre visible */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-deepsea-800">
            <div className="flex items-center space-x-2 min-w-0">
              <Box className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 truncate">
                {viewFile ? `${viewFile.name} · ${viewFile.sizeMB} MB` : 'Maqueta Tierrabomba: meseta +22 m · 120 viviendas · colegio + aljibe'}
              </span>
            </div>
            {viewFile && (
              <button
                onClick={() => { URL.revokeObjectURL(viewFile.url); setViewFile(null); }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Volver a la maqueta"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <CompactViewer fileUrl={viewFile?.url} fileExt={viewFile?.ext} onError={setNotice} />
          <p className="px-4 py-2.5 text-[11px] font-mono text-slate-500 border-t border-slate-200 dark:border-deepsea-800">
            Arrastra para orbitar · rueda para zoom · la maqueta gira sola hasta que la tocas
          </p>
        </div>

        {/* Zona de carga */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`rounded-3xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragOver ? 'border-terracotta-500 bg-terracotta-50' : 'border-slate-300 bg-white dark:bg-deepsea-900 dark:border-deepsea-800'}`}
        >
          <UploadCloud className="w-8 h-8 mx-auto text-terracotta-600" />
          <p className="font-bold text-sm text-slate-900 dark:text-white mt-2">Suelta aquí el TIERRABOMBA.rvt o tu modelo exportado</p>
          <p className="text-xs font-mono text-slate-500 mt-1">.rvt · .ifc · .glb · .gltf · .obj</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".rvt,.ifc,.glb,.gltf,.obj"
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
          />
        </div>

        {notice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        {/* Ficha RVT */}
        {rvtFile && (
          <div className="p-4 rounded-3xl bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0"><Building2 className="w-4 h-4" /></div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{rvtFile.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">Revit nativo · {rvtFile.sizeMB} MB · sin visor web directo</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 flex items-center space-x-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /><span>RVT OK</span>
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-deepsea-950 border border-slate-200 dark:border-deepsea-800">
                <p className="font-bold text-slate-900 dark:text-white">1 · Exporta IFC</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">Revit: Archivo → Exportar → IFC (categorías + terrenos).</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-deepsea-950 border border-slate-200 dark:border-deepsea-800">
                <p className="font-bold text-slate-900 dark:text-white">2 · Exporta GLB</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">Con el exporter glTF de Autodesk, o IFC → Blender → GLB.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-deepsea-950 border border-slate-200 dark:border-deepsea-800">
                <p className="font-bold text-slate-900 dark:text-white">3 · Súelo aquí</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">Arrastra el .glb/.obj arriba para verlo en WebGL.</p>
              </div>
            </div>
          </div>
        )}

        {/* Nota formato */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
          <span className="flex items-center space-x-1.5">
            <FileCode className="w-3.5 h-3.5" />
            <span>RVT = propietario Autodesk · IFC/GLB = intercambio abierto</span>
          </span>
          <a
            href="https://viewer.autodesk.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-terracotta-700 hover:text-terracotta-600 font-bold"
          >
            <span>Abrir RVT nativo en Autodesk Viewer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Controles del visor */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 px-1">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Arrastra para orbitar · rueda para acercar · recarga el archivo para recentrar</span>
        </div>
      </div>
    </div>
  );
}
