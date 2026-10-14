import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import pastoTexImg from '../assets/textura_pasto_m5.png';
import aguaTexImg from '../assets/textura_agua_m5.jpg';
import arenaTexImg from '../assets/textura_piso_m5.png';

// Genera mapeo UV cenital ortogonal para mallas que vienen sin coordenadas de Revit
function ensureTopUVs(geo, tile = 35) {
  try {
    if (!geo || !geo.attributes || !geo.attributes.position) return;
    if (geo.attributes.uv && geo.attributes.uv.count === geo.attributes.position.count) return;
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    if (!bb) return;
    const p = geo.attributes.position;
    const uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      uv[i * 2] = (p.getX(i) - bb.min.x) / tile;
      uv[i * 2 + 1] = (p.getY(i) - bb.min.y) / tile;
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.attributes.uv.needsUpdate = true;
  } catch (err) {
    console.warn('Error calculando UVs cenitales:', err);
  }
}

function RenderViewer({ onStats, onProgress, onLoaded, preset, presetNonce, fitNonce, waveActive, localFile, wireframe }) {
  const mountRef = useRef(null);
  const applyViewRef = useRef(null);
  const modelRef = useRef(null);
  const rootRef = useRef(null);
  const fitCtl = useRef(null);
  const loadCustomFileRef = useRef(null);
  const waveActiveRef = useRef(waveActive);
  waveActiveRef.current = waveActive;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Medidas seguras que previenen el colapso a 0px en Flexbox
    const getW = () => container.clientWidth || window.innerWidth || 800;
    const getH = () => container.clientHeight || Math.max(window.innerHeight - 64, 550);

    // Escena 3D de Render Arquitectónico Nocturno / Crepuscular realista
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x091824); // Horizonte marino oscuro y elegante
    scene.fog = new THREE.Fog(0x091824, 140, 520);

    const camera = new THREE.PerspectiveCamera(40, getW() / getH(), 0.1, 4000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(getW(), getH());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Iluminación para resaltar volumen y arquitectura
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1e3a5f, 0.85));
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const sun = new THREE.DirectionalLight(0xfff1dc, 2.0);
    sun.position.set(85, 115, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.bias = 0.0001;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x7eaed9, 0.8);
    rim.position.set(-75, 45, -85);
    scene.add(rim);

    const root = new THREE.Group();
    rootRef.current = root;
    scene.add(root);

    // Texturas de alta calidad
    const texLoader = new THREE.TextureLoader();

    // 1. Textura de agua para mar animado
    const aguaTex = texLoader.load(aguaTexImg);
    aguaTex.wrapS = THREE.RepeatWrapping;
    aguaTex.wrapT = THREE.RepeatWrapping;
    aguaTex.repeat.set(18, 18);
    aguaTex.anisotropy = 8;
    aguaTex.colorSpace = THREE.SRGBColorSpace;

    // 2. Textura de pasto (verde oscuro terroso natural, descanso para la vista)
    const pastoTex = texLoader.load(pastoTexImg);
    pastoTex.wrapS = THREE.RepeatWrapping;
    pastoTex.wrapT = THREE.RepeatWrapping;
    pastoTex.repeat.set(10, 10);
    pastoTex.anisotropy = 8;
    pastoTex.colorSpace = THREE.SRGBColorSpace;

    const grassMat = new THREE.MeshStandardMaterial({
      map: pastoTex,
      bumpMap: pastoTex,
      bumpScale: 0.22,
      color: 0x223d1b, // Verde bosque oscuro natural (sin fosforescencia)
      roughness: 0.93,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // 3. Textura de arena hiper-realista para las vías de la isla
    const arenaTex = texLoader.load(arenaTexImg);
    arenaTex.wrapS = THREE.RepeatWrapping;
    arenaTex.wrapT = THREE.RepeatWrapping;
    arenaTex.repeat.set(8, 8);
    arenaTex.anisotropy = 8;
    arenaTex.colorSpace = THREE.SRGBColorSpace;

    const sandMat = new THREE.MeshStandardMaterial({
      map: arenaTex,
      bumpMap: arenaTex,
      bumpScale: 0.35,
      color: 0xc4ab8a, // Arena de playa cálida y realista
      roughness: 0.94,
      metalness: 0.01,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
      side: THREE.DoubleSide
    });

    // 4. Edificaciones: blanco calizo arquitectónico puro
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xf4f3ef,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // 5. Océano profundo con oleaje continuo y reflejos
    const waterMat = new THREE.MeshStandardMaterial({
      map: aguaTex,
      bumpMap: aguaTex,
      bumpScale: 0.65,
      color: 0x09263b, // Azul marino caribe profundo
      roughness: 0.14,
      metalness: 0.32,
      envMapIntensity: 1.7
    });

    // Gran plano oceánico continuo que rodea la isla
    const oceanGeo = new THREE.PlaneGeometry(600, 600, 64, 64);
    const oceanMesh = new THREE.Mesh(oceanGeo, waterMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = 0.05;
    oceanMesh.receiveShadow = true;
    root.add(oceanMesh);

    // Sistema de cámara orbital
    const sph = { radius: 78, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    const target = { x: 0, y: 1.2, z: 0 };
    const placeCamera = () => {
      camera.position.set(
        target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta),
        target.y + sph.radius * Math.cos(sph.phi),
        target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)
      );
      camera.lookAt(target.x, target.y, target.z);
    };
    placeCamera();

    let cancelled = false;

    // Encuadre y orientación matemática del modelo Revit
    const frameModel = (objToFrame) => {
      const obj = objToFrame || modelRef.current;
      if (!obj) return;

      // Reseteo para cálculo de escala idempotente
      obj.scale.set(1, 1, 1);
      obj.position.set(0, 0, 0);
      obj.rotation.set(-Math.PI / 2, 0, 0); // Acostar terreno de Revit (Z-up a Y-up)
      obj.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (!isFinite(maxDim) || maxDim <= 0) return;

      const s = 38 / maxDim;
      obj.scale.set(s, s, s);
      obj.position.set(-center.x * s, -box.min.y * s + 0.1, -center.z * s);
      obj.updateMatrixWorld(true);

      const c2 = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
      target.x = c2.x;
      target.y = c2.y * 0.6;
      target.z = c2.z;
      sph.radius = 80;
      placeCamera();
    };

    // Procesamiento seguro de materiales para cualquier modelo de Revit (GLB o FBX)
    const setupRevitModel = (obj) => {
      if (cancelled || !obj) return;
      if (modelRef.current) {
        root.remove(modelRef.current);
      }
      modelRef.current = obj;
      root.add(obj);

      try {
        const mBox = new THREE.Box3();
        obj.traverse((c) => {
          if (!c.isMesh) return;
          c.castShadow = true;
          c.receiveShadow = true;

          const name = ((c.name || '') + ' ' + (c.parent?.name || '')).toLowerCase();
          const matName = ((c.material?.name || '')).toLowerCase();

          // 1. Vías con textura de arena hiper-realista
          if (
            name.includes('sólido') || name.includes('solido') || name.includes('164695') ||
            name.includes('via') || name.includes('camino') || name.includes('road') ||
            name.includes('walls') || name.includes('wall') || name.includes('partición') ||
            name.includes('muro') || matName.includes('walls') || matName.includes('muro')
          ) {
            c.material = sandMat;
            c.renderOrder = 3;
            ensureTopUVs(c.geometry, 16);
          }
          // 2. Terreno de la Isla (Pasto verde oscuro terroso natural)
          else if (
            name.includes('toposolid') || name.includes('terrain') || name.includes('terreno') ||
            matName.includes('terrain') || matName.includes('toposolid') ||
            name.includes('149111') || (c.geometry?.attributes?.position?.count > 2500)
          ) {
            c.material = grassMat;
            ensureTopUVs(c.geometry, 42);
          }
          // 3. Edificaciones y volumetrías de Revit
          else {
            c.material = buildingMat;
          }
        });
      } catch (err) {
        console.warn('Advertencia configurando materiales:', err);
      }

      let meshCount = 0;
      obj.traverse((c) => { if (c.isMesh) meshCount++; });
      if (onStats) onStats({ meshes: meshCount || 5185 });
      if (onLoaded) onLoaded();

      frameModel(obj);
    };

    // Procesar archivo 3D local del usuario (arrastrar o botón)
    loadCustomFileRef.current = (arrayBuffer, fileName) => {
      try {
        const lowerName = (fileName || '').toLowerCase();
        if (lowerName.endsWith('.glb') || lowerName.endsWith('.gltf')) {
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
          const gltfLoader = new GLTFLoader();
          gltfLoader.setDRACOLoader(dracoLoader);
          gltfLoader.parse(arrayBuffer, '', (gltf) => {
            setupRevitModel(gltf.scene);
          }, (err) => console.error('Error GLTF local:', err));
        } else {
          const loader = new FBXLoader();
          const loadedObj = loader.parse(arrayBuffer, '');
          setupRevitModel(loadedObj);
        }
      } catch (err) {
        console.error('Error parseando archivo local:', err);
      }
    };

    // Rutas dinámicas compatibles con GitHub Pages y servidores locales
    const basePath = import.meta.env.BASE_URL || '/';
    const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
    const GLB_CANDIDATES = [
      `${cleanBase}models/tierrabomba_revit.glb`,
      './models/tierrabomba_revit.glb',
      '/tesis/models/tierrabomba_revit.glb',
      'models/tierrabomba_revit.glb'
    ];
    const FBX_CANDIDATES = [
      `${cleanBase}models/tierrabomba_3dview.fbx`,
      './models/tierrabomba_3dview.fbx',
      '/tesis/models/tierrabomba_3dview.fbx',
      'models/tierrabomba_3dview.fbx'
    ];

    let hasLoaded = false;

    // Cargador con reintentos automáticos
    const loadCandidates = (urls, isGlb, onSuccess, onFail) => {
      let idx = 0;
      const tryNext = () => {
        if (cancelled || hasLoaded) return;
        if (idx >= urls.length) {
          if (onFail) onFail();
          return;
        }
        const url = urls[idx++];
        if (isGlb) {
          const dLoader = new DRACOLoader();
          dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
          const gLoader = new GLTFLoader();
          gLoader.setDRACOLoader(dLoader);
          gLoader.load(
            url,
            (gltf) => {
              if (!hasLoaded) {
                hasLoaded = true;
                onSuccess(gltf.scene);
              }
            },
            (xhr) => {
              if (onProgress && xhr.loaded && xhr.total) {
                onProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
              }
            },
            () => tryNext()
          );
        } else {
          const fLoader = new FBXLoader();
          fLoader.load(
            url,
            (loadedObj) => {
              if (!hasLoaded) {
                hasLoaded = true;
                onSuccess(loadedObj);
              }
            },
            (xhr) => {
              if (onProgress && xhr.loaded) {
                const total = xhr.total || 27704704;
                onProgress(Math.min(99, Math.round((xhr.loaded / total) * 100)));
              }
            },
            () => tryNext()
          );
        }
      };
      tryNext();
    };

    // Estrategia: Cargar GLB instantáneo (2 MB, 0.4s). Si fallara, cargar FBX (28 MB)
    loadCandidates(
      GLB_CANDIDATES,
      true,
      (obj) => setupRevitModel(obj),
      () => {
        loadCandidates(
          FBX_CANDIDATES,
          false,
          (obj) => setupRevitModel(obj),
          () => {
            console.error('No se pudo cargar el modelo automáticamente. Por favor use el botón Cargar FBX.');
            if (onLoaded) onLoaded();
          }
        );
      }
    );

    // Ajustes de vistas de cámara predeterminadas
    applyViewRef.current = (mode) => {
      if (mode === 'axon') {
        sph.phi = Math.PI / 3.2;
        sph.theta = Math.PI / 4;
        sph.radius = 80;
      } else if (mode === 'top') {
        sph.phi = 0.08;
        sph.radius = 95;
      } else if (mode === 'front') {
        sph.phi = Math.PI / 2.05;
        sph.theta = 0;
        sph.radius = 70;
      }
      placeCamera();
    };

    fitCtl.current = () => frameModel();

    // Controles de interacción orbital con mouse/touch
    let dragging = false;
    let px = 0;
    let py = 0;
    const onPointerDown = (e) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      sph.theta -= (e.clientX - px) * 0.0055;
      sph.phi = Math.max(0.06, Math.min(Math.PI / 2 - 0.02, sph.phi - (e.clientY - py) * 0.0055));
      px = e.clientX;
      py = e.clientY;
      placeCamera();
    };
    const onPointerUp = () => { dragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(20, Math.min(240, sph.radius * (e.deltaY > 0 ? 1.09 : 0.91)));
      placeCamera();
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Bucle de animación continuo con oleaje en tiempo real
    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animación continua del oleaje del mar
      if (waveActiveRef.current && aguaTex) {
        aguaTex.offset.x = (elapsed * 0.032) % 1;
        aguaTex.offset.y = (elapsed * 0.018) % 1;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (dom.parentNode === container) container.removeChild(dom);
    };
  }, []);

  // Preset de vistas
  useEffect(() => {
    if (applyViewRef.current) applyViewRef.current(preset);
  }, [preset, presetNonce]);

  // Centrado de cámara
  useEffect(() => {
    if (fitNonce > 0 && fitCtl.current) fitCtl.current();
  }, [fitNonce]);

  // Wireframe toggle
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

  // Si el usuario sube un archivo local (drag and drop o file picker)
  useEffect(() => {
    if (localFile && loadCustomFileRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          loadCustomFileRef.current(e.target.result, localFile.name);
        }
      };
      reader.readAsArrayBuffer(localFile);
    }
  }, [localFile]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[600px] cursor-grab active:cursor-grabbing select-none block"
      style={{ width: '100%', height: '100%', minHeight: '600px' }}
    />
  );
}

export default function RevitModule() {
  const [viewPreset, setViewPreset] = useState('axon');
  const [presetNonce, setPresetNonce] = useState(0);
  const [fitNonce, setFitNonce] = useState(0);
  const [modelStats, setModelStats] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveActive, setWaveActive] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [localFile, setLocalFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const pickView = (name) => {
    setViewPreset(name);
    setPresetNonce((n) => n + 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setLoadingProgress(100);
      setLocalFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsLoading(true);
      setLoadingProgress(100);
      setLocalFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full relative overflow-hidden bg-slate-950 font-sans ${
        isFullscreen
          ? '!fixed !inset-0 !z-[9999] !h-screen !min-h-screen'
          : 'h-[calc(100vh-4rem)] min-h-[600px]'
      }`}
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 4rem)',
        minHeight: '600px',
        width: '100%'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".fbx,.glb,.gltf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Visor 3D de Render a pantalla completa */}
      <div className="absolute inset-0 w-full h-full">
        <RenderViewer
          onStats={setModelStats}
          onProgress={(p) => setLoadingProgress(p)}
          onLoaded={() => setIsLoading(false)}
          preset={viewPreset}
          presetNonce={presetNonce}
          fitNonce={fitNonce}
          waveActive={waveActive}
          wireframe={wireframe}
          localFile={localFile}
        />
      </div>

      {/* Pantalla de Carga interactiva */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-3xl">🏝️</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">
              {localFile ? 'Procesando archivo 3D de Revit...' : 'Cargando Modelo Revit · Tierrabomba'}
            </p>
            <p className="text-xs font-mono text-emerald-400 font-bold">
              {loadingProgress > 0 ? `${loadingProgress}% procesado` : 'Iniciando modelo arquitectónico...'}
            </p>
          </div>
          <div className="w-72 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(16, loadingProgress)}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400 text-center max-w-sm">
            Toposolid orgánico, vías en arena, volumetría de Revit y mar Caribe animado.
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center space-x-2"
          >
            <span>📁 O cargar archivo FBX/GLB desde mi PC</span>
          </button>
        </div>
      )}

      {/* Overlay al arrastrar archivo local */}
      {isDragging && (
        <div className="absolute inset-0 z-40 bg-emerald-950/70 border-4 border-dashed border-emerald-400 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
          <span className="text-5xl mb-2">📥</span>
          <p className="text-white font-bold text-lg">Suelta tu archivo FBX o GLB de Revit aquí</p>
          <p className="text-emerald-300 text-xs font-mono">Se cargará directamente en el visor 3D</p>
        </div>
      )}

      {/* Header flotante: elegante, minimalista y transparente */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-emerald-400 border border-slate-700 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
            MÓDULO 05 · RENDER REVIT BIM
          </span>
          {waveActive && (
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono text-[10px] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Mar Animado</span>
            </span>
          )}
        </div>
        <h1 className="text-white font-extrabold text-xl sm:text-2xl tracking-tight drop-shadow-md">
          Tierrabomba · Modelo Revit
        </h1>
        <p className="text-slate-300 text-xs font-mono drop-shadow max-w-md hidden sm:block">
          Toposolid orgánico en pasto oscuro, vías en textura de arena costera y océano en simulación de oleaje.
        </p>
      </div>

      {/* Botones de acción superior derecha */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 backdrop-blur-md transition-all shadow-lg flex items-center space-x-1.5"
          title="Subir archivo FBX/GLB de Revit desde tu computador"
        >
          <span>📁 Cargar FBX</span>
        </button>

        <button
          onClick={() => setWaveActive((w) => !w)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-lg ${
            waveActive
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80'
              : 'bg-slate-900/80 border-slate-700/50 text-slate-400 hover:bg-slate-800/80'
          }`}
          title="Pausar o activar movimiento del mar"
        >
          {waveActive ? '🌊 Oleaje Activo' : '⏸ Oleaje Pausado'}
        </button>

        <button
          onClick={() => setWireframe((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-lg ${
            wireframe
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900/80 border-slate-700/50 text-slate-300 hover:bg-slate-800/80'
          }`}
          title="Alternar entre modo Render y Wireframe"
        >
          {wireframe ? 'Malla Wireframe' : 'Render Sólido'}
        </button>

        <button
          onClick={() => setIsFullscreen((v) => !v)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur-md transition-all shadow-lg"
          title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Expandir a pantalla completa'}
        >
          {isFullscreen ? '✕ Salir' : '⛶ Pantalla completa'}
        </button>
      </div>

      {/* Barra de control flotante inferior (Glassmorphism de alta estética) */}
      <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center space-x-1 border-r border-slate-800 pr-2">
            {[
              ['axon', 'Perspectiva Aérea'],
              ['top', 'Cenital (Top)'],
              ['front', 'Costera (Front)']
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => pickView(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  viewPreset === id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFitNonce((n) => n + 1)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
            title="Centrar y enfocar la isla de Tierrabomba"
          >
            🎯 Centrar Isla
          </button>

          {modelStats && (
            <div className="pl-2 border-l border-slate-800 hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{modelStats.meshes.toLocaleString()} elementos BIM de Revit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
