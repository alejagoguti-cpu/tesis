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
  FileCode,
  Link2,
  Maximize2
} from 'lucide-react';
import rvtPreviewImg from '../assets/rvt_tierrabomba_preview.png';

// Módulo 05: Modelo Revit Tierrabomba (contenido 100% real).
// - Vista previa REAL extraída del propio archivo TIERRABOMBA.rvt.
// - Espacio para incrustar el modelo 3D real vía Autodesk Viewer (enlace compartido).
// - Carga del RVT para ficha + visor WebGL para el modelo exportado (.glb/.obj).
// El .rvt no se renderiza directo en web (formato propietario): por eso no hay
// geometría inventada en este módulo.

const RVT_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];
const VIEWER_LINK_KEY = 'thesis_revit_viewer_link';

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

// Visor WebGL solo para modelos EXPORTADOS (.glb/.obj). Sin maquetas inventadas.
function ExportViewer({ fileUrl, fileExt, onError }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !fileUrl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe8d4);
    scene.fog = new THREE.Fog(0xdbe8d4, 200, 600);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbe8d4, 1.0));
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xfffaed, 1.4);
    sun.position.set(40, 60, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);

    const grid = new THREE.GridHelper(60, 60, 0x334155, 0x94a3b8);
    grid.position.y = -0.01;
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    let cancelled = false;
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

    const sph = { radius: 55, theta: Math.PI / 4, phi: Math.PI / 3 };
    const target = { x: 0, y: 4, z: 0 };
    const place = () => {
      camera.position.set(
        target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
        target.y + sph.radius * Math.cos(sph.phi),
        target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
      );
      camera.lookAt(target.x, target.y, target.z);
    };
    place();

    let dragging = false;
    let px = 0;
    let py = 0;
    const down = (e) => { dragging = true; px = e.clientX; py = e.clientY; };
    const move = (e) => {
      if (!dragging) return;
      sph.theta -= (e.clientX - px) * 0.005;
      sph.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, sph.phi - (e.clientY - py) * 0.005));
      px = e.clientX; py = e.clientY;
      place();
    };
    const up = () => { dragging = false; };
    const wheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(10, Math.min(200, sph.radius * (e.deltaY > 0 ? 1.1 : 0.9)));
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
  }, [fileUrl, fileExt, onError]);

  return <div ref={mountRef} className="w-full h-[52vh] min-h-[380px] cursor-grab active:cursor-grabbing" />;
}

export default function RevitModule() {
  const fileInputRef = useRef(null);
  const [rvtFile, setRvtFile] = useState(null);
  const [viewFile, setViewFile] = useState(null); // { url, ext, name, sizeMB }
  const [notice, setNotice] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewerLink, setViewerLink] = useState(() => {
    try {
      return localStorage.getItem(VIEWER_LINK_KEY) || '';
    } catch (e) {
      return '';
    }
  });
  const [linkDraft, setLinkDraft] = useState('');

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
      setNotice('RVT detectado: formato nativo Revit. Para verlo en 3D usa el visor Autodesk de abajo o expórtalo a GLB.');
      return;
    }
    if (['glb', 'gltf', 'obj'].includes(ext)) {
      if (viewFile?.url) URL.revokeObjectURL(viewFile.url);
      setViewFile({ url: URL.createObjectURL(file), ext, name: file.name, sizeMB: (file.size / (1024 * 1024)).toFixed(1) });
      return;
    }
    if (ext === 'ifc') {
      setNotice('IFC recibido: ábrelo en Autodesk Viewer o expórtalo a GLB y súelo aquí para visualizarlo.');
      return;
    }
    setNotice('Formato no compatible. Usa .rvt (ficha), .ifc (guía) o .glb/.obj (visor).');
  };

  const saveViewerLink = () => {
    const clean = linkDraft.trim();
    if (!clean) return;
    setViewerLink(clean);
    try {
      localStorage.setItem(VIEWER_LINK_KEY, clean);
    } catch (e) {}
    setLinkDraft('');
    setNotice('Enlace del visor guardado: el modelo 3D real queda incrustado abajo.');
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

        {/* Vista previa REAL del RVT + modelo 3D real */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm">
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-slate-200 dark:border-deepsea-800">
            <Box className="w-4 h-4 text-terracotta-600 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
              TIERRABOMBA.rvt · 74.3 MB · vista previa extraída del archivo real
            </span>
          </div>
          <div className="bg-[#0b1a2a] p-6 flex items-center justify-center min-h-[300px]">
            <img
              src={rvtPreviewImg}
              alt="Vista previa real del modelo TIERRABOMBA.rvt"
              draggable={false}
              className="max-h-[46vh] rounded-xl shadow-2xl border border-white/20"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          <p className="px-4 py-2.5 text-[11px] font-mono text-slate-500 border-t border-slate-200 dark:border-deepsea-800">
            Miniatura incrustada por Revit en el propio .rvt — sin geometría inventada
          </p>
        </div>

        {/* Modelo 3D real vía Autodesk Viewer */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-deepsea-800">
            <div className="flex items-center space-x-2">
              <Maximize2 className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">Modelo 3D real interactivo</span>
            </div>
            {viewerLink && (
              <button
                onClick={() => { setViewerLink(''); try { localStorage.removeItem(VIEWER_LINK_KEY); } catch (e) {} }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Quitar enlace"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {viewerLink ? (
            <iframe
              title="Modelo Revit Tierrabomba en Autodesk Viewer"
              src={viewerLink}
              className="w-full h-[60vh] min-h-[440px] bg-white"
              allowFullScreen
            />
          ) : (
            <div className="p-5 space-y-3">
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                Para ver tu modelo real en 3D (2 minutos, una sola vez): sube el TIERRABOMBA.rvt en{' '}
                <a href="https://viewer.autodesk.com" target="_blank" rel="noreferrer" className="text-terracotta-700 font-bold underline">
                  viewer.autodesk.com
                </a>{' '}
                → botón Compartir → copiar enlace → pégalo aquí:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={linkDraft}
                  onChange={(e) => setLinkDraft(e.target.value)}
                  placeholder="https://viewer.autodesk.com/..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-deepsea-700 bg-white dark:bg-deepsea-950 text-xs font-mono text-slate-900 dark:text-white"
                />
                <button
                  onClick={saveViewerLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Incrustar modelo</span>
                </button>
              </div>
            </div>
          )}
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

        {/* Visor del modelo exportado (solo cuando hay archivo) */}
        {viewFile && (
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-deepsea-900 border border-slate-200 dark:border-deepsea-800 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-deepsea-800">
              <div className="flex items-center space-x-2 min-w-0">
                <Box className="w-4 h-4 text-terracotta-600 shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 truncate">
                  {`${viewFile.name} · ${viewFile.sizeMB} MB`}
                </span>
              </div>
              <button
                onClick={() => { URL.revokeObjectURL(viewFile.url); setViewFile(null); }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Quitar modelo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ExportViewer fileUrl={viewFile.url} fileExt={viewFile.ext} onError={setNotice} />
            <p className="px-4 py-2.5 text-[11px] font-mono text-slate-500 border-t border-slate-200 dark:border-deepsea-800">
              Arrastra para orbitar · rueda para zoom
            </p>
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
          <span>El .rvt no se renderiza en web: por eso este módulo muestra su vista previa real + tu modelo compartido</span>
        </div>
      </div>
    </div>
  );
}
