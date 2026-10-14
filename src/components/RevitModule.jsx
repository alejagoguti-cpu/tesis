import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import pastoTexImg from '../assets/textura_pasto_m5.png';
import aguaTexImg from '../assets/textura_agua_m5.jpg';
import arenaTexImg from '../assets/textura_piso_m5.png';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Modelo exportado desde Autodesk Revit 2027 (TIERRABOMBAnico.rvt -> FBX nativo)
const DEFAULT_MODEL_URL = `${import.meta.env.BASE_URL}models/tierrabomba_3dview.fbx`;

// Genera coordenadas UV cenitales uniformes para mallas sin mapeo de Revit
function ensureTopUVs(geo, tile = 40) {
  if (!geo || !geo.attributes || !geo.attributes.position) return;
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const p = geo.attributes.position;
  const uv = new Float32Array(p.count * 2);
  const sx = Math.max(0.001, bb.max.x - bb.min.x);
  const sy = Math.max(0.001, bb.max.y - bb.min.y);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = (p.getX(i) - bb.min.x) / tile;
    uv[i * 2 + 1] = (p.getY(i) - bb.min.y) / tile;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.attributes.uv.needsUpdate = true;
}

// Shader personalizado para Agua de Mar Hiper-Realista Oscura con oleaje animado y reflejo solar
const WaterShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    uniform float uTime;
    uniform float uWaveIntensity;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Ondulaciones oceánicas compuestas (oleaje físico tridimensional)
      float w1 = sin(pos.x * 0.08 + uTime * 1.5) * cos(pos.y * 0.07 + uTime * 1.1) * 0.42 * uWaveIntensity;
      float w2 = sin(pos.x * 0.19 - uTime * 2.1 + pos.y * 0.14) * 0.20 * uWaveIntensity;
      float w3 = cos(pos.x * 0.42 + pos.y * 0.32 + uTime * 2.9) * 0.09 * uWaveIntensity;
      pos.z += w1 + w2 + w3;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;

      // Derivada analítica para normales dinámicas
      vec3 n = vec3(0.0, 0.0, 1.0);
      n.x -= (cos(pos.x * 0.08 + uTime * 1.5) * 0.08 * 0.42 + cos(pos.x * 0.19 - uTime * 2.1) * 0.19 * 0.20) * uWaveIntensity;
      n.y -= (sin(pos.y * 0.07 + uTime * 1.1) * 0.07 * 0.42 + cos(pos.y * 0.32 + uTime * 2.9) * 0.32 * 0.09) * uWaveIntensity;
      vWorldNormal = normalize((modelMatrix * vec4(normalize(n), 0.0)).xyz);

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    uniform float uTime;
    uniform vec3 uDeepColor;
    uniform vec3 uShallowColor;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform vec3 uCameraPos;
    uniform sampler2D uWaterTex;

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      vec3 baseNorm = normalize(vWorldNormal);

      // Micro-olas con desplazamiento dual de textura en dos direcciones
      vec2 flow1 = vUv * 28.0 + vec2(uTime * 0.035, uTime * 0.022);
      vec2 flow2 = vUv * 42.0 - vec2(uTime * 0.028, -uTime * 0.032);
      vec4 t1 = texture2D(uWaterTex, flow1);
      vec4 t2 = texture2D(uWaterTex, flow2);
      vec3 dNorm = (t1.rgb + t2.rgb - 1.0) * 0.38;

      vec3 N = normalize(baseNorm + vec3(dNorm.x, dNorm.y, dNorm.z * 0.45));

      // Efecto Fresnel para reflejo en ángulos rasantes
      float fresnel = clamp(1.0 - max(dot(viewDir, N), 0.0), 0.0, 1.0);
      float fPow = pow(fresnel, 3.8);

      // Degradado oceánico profundo y oscuro (caribe profundo)
      vec3 waterColor = mix(uDeepColor, uShallowColor, fPow * 0.65 + 0.12);

      // Reflejo especular del sol (destello brillante en crestas de olas)
      vec3 halfVec = normalize(viewDir + uSunDirection);
      float spec = pow(max(dot(N, halfVec), 0.0), 95.0);
      float broadSpec = pow(max(dot(N, halfVec), 0.0), 18.0) * 0.28;
      vec3 specular = (spec + broadSpec) * uSunColor * 1.8;

      // Sutil brillo de espuma en las crestas
      float crest = clamp(dNorm.z * 1.7 - 0.55, 0.0, 1.0);
      vec3 crestColor = vec3(0.55, 0.68, 0.78) * crest * 0.18;

      vec3 finalColor = waterColor + specular + crestColor;
      gl_FragColor = vec4(finalColor, 0.96);
    }
  `
};

// Generador de vegetación arquitectónica determinista (árboles costeros de render)
function plantRenderVegetation(islandMeshes, count = 280) {
  if (!islandMeshes || islandMeshes.length === 0) return null;
  let seed = 42;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const ib = new THREE.Box3();
  islandMeshes.forEach((m) => ib.expandByObject(m));
  const size = ib.getSize(new THREE.Vector3());
  if (!(size.x > 0) || !(size.z > 0)) return null;
  const groundThr = ib.min.y + (ib.max.y - ib.min.y) * 0.10;
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const origin = new THREE.Vector3();
  const pts = [];
  let guard = 0;
  while (pts.length < count && guard++ < count * 18) {
    origin.set(ib.min.x + rnd() * size.x, ib.max.y + size.y * 0.5 + 15, ib.min.z + rnd() * size.z);
    ray.set(origin, down);
    const hits = ray.intersectObjects(islandMeshes, false);
    if (hits.length > 0 && hits[0].point.y > groundThr) {
      pts.push(hits[0].point.clone());
    }
  }
  if (pts.length === 0) return null;

  const trunkG = new THREE.CylinderGeometry(0.04, 0.08, 0.9, 6);
  const canG = new THREE.IcosahedronGeometry(0.52, 1);
  const trunkM = new THREE.MeshStandardMaterial({ color: 0x422f1d, roughness: 0.95 });
  const canM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0.02 });
  const trunks = new THREE.InstancedMesh(trunkG, trunkM, pts.length);
  const cans = new THREE.InstancedMesh(canG, canM, pts.length);
  // Verdes oscuros naturales, nada fosforescentes
  const darkGreens = [
    new THREE.Color(0x244220),
    new THREE.Color(0x1c3818),
    new THREE.Color(0x2d4f26)
  ];
  const M = new THREE.Matrix4();
  const Q = new THREE.Quaternion();
  const E = new THREE.Euler();
  const P = new THREE.Vector3();
  const S = new THREE.Vector3();
  pts.forEach((p, i) => {
    const s = 0.65 + rnd() * 0.45;
    E.set(0, rnd() * Math.PI * 2, 0);
    Q.setFromEuler(E);
    P.set(p.x, p.y + 0.42 * s, p.z);
    S.set(s, s, s);
    M.compose(P, Q, S);
    trunks.setMatrixAt(i, M);

    P.set(p.x, p.y + 1.05 * s, p.z);
    S.set(s * 1.15, s * 0.75, s * 1.15);
    M.compose(P, Q, S);
    cans.setMatrixAt(i, M);
    cans.setColorAt(i, darkGreens[i % darkGreens.length]);
  });
  if (cans.instanceColor) cans.instanceColor.needsUpdate = true;
  trunks.castShadow = true;
  cans.castShadow = true;
  const grp = new THREE.Group();
  grp.add(trunks);
  grp.add(cans);
  return grp;
}

function RenderViewer({ onStats, preset, presetNonce, fitNonce, waveActive }) {
  const mountRef = useRef(null);
  const applyViewRef = useRef(null);
  const modelRef = useRef(null);
  const fitCtl = useRef(null);
  const waveActiveRef = useRef(waveActive);
  waveActiveRef.current = waveActive;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Escena 3D configurada para Render Arquitectónico
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a141e); // Atmósfera marina crepuscular
    scene.fog = new THREE.FogExp2(0x0a141e, 0.0035);

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Iluminación ambiental PBR basada en RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Iluminación solar cálida de Render (contraste fotográfico)
    const hemiLight = new THREE.HemisphereLight(0xddebf7, 0x1a2618, 0.65);
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfff1db, 2.2);
    sun.position.set(85, 115, 55);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    // Luz de relleno costera y contra-luz suave para volumen
    const rimLight = new THREE.DirectionalLight(0x75a6cc, 0.65);
    rimLight.position.set(-75, 45, -85);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    // Carga de texturas PBR realistas
    const texLoader = new THREE.TextureLoader();

    // 1. Textura de mar
    const aguaTex = texLoader.load(aguaTexImg);
    aguaTex.wrapS = THREE.RepeatWrapping;
    aguaTex.wrapT = THREE.RepeatWrapping;
    aguaTex.repeat.set(6, 6);
    aguaTex.anisotropy = 8;
    aguaTex.colorSpace = THREE.SRGBColorSpace;

    // 2. Textura de pasto (verde oscuro terroso natural)
    const pastoTex = texLoader.load(pastoTexImg);
    pastoTex.wrapS = THREE.RepeatWrapping;
    pastoTex.wrapT = THREE.RepeatWrapping;
    pastoTex.repeat.set(35, 35);
    pastoTex.anisotropy = 8;
    pastoTex.colorSpace = THREE.SRGBColorSpace;
    // Verde pasto oscurito arquitectónico (cero fosforescente)
    const grassMat = new THREE.MeshStandardMaterial({
      map: pastoTex,
      color: 0x223a1c,
      roughness: 0.94,
      metalness: 0.02
    });

    // 3. Textura de arena hiper-realista para las vías
    const arenaTex = texLoader.load(arenaTexImg);
    arenaTex.wrapS = THREE.RepeatWrapping;
    arenaTex.wrapT = THREE.RepeatWrapping;
    arenaTex.repeat.set(20, 20);
    arenaTex.anisotropy = 8;
    arenaTex.colorSpace = THREE.SRGBColorSpace;
    const sandMat = new THREE.MeshStandardMaterial({
      map: arenaTex,
      color: 0xc8b292,
      roughness: 0.95,
      metalness: 0.01,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });

    // 4. Edificaciones y masas arquitectónicas del Revit (piedra/blanco calizo mate)
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xedebe4,
      roughness: 0.72,
      metalness: 0.05
    });

    // 5. Plano de agua viva circundante con Shader de oleaje realista
    const waterUniforms = {
      uTime: { value: 0 },
      uWaveIntensity: { value: 1.0 },
      uDeepColor: { value: new THREE.Color(0x061726) }, // Mar caribe profundo oscuro
      uShallowColor: { value: new THREE.Color(0x0c2c3d) }, // Azul marino de oleaje
      uSunDirection: { value: sun.position.clone().normalize() },
      uSunColor: { value: new THREE.Color(0xfff2dc) },
      uCameraPos: { value: new THREE.Vector3() },
      uWaterTex: { value: aguaTex }
    };

    const waterMat = new THREE.ShaderMaterial({
      vertexShader: WaterShader.vertexShader,
      fragmentShader: WaterShader.fragmentShader,
      uniforms: waterUniforms,
      transparent: true,
      depthWrite: true
    });

    // Gran superficie oceánica alrededor de la isla
    const oceanGeo = new THREE.PlaneGeometry(380, 380, 160, 160);
    const oceanMesh = new THREE.Mesh(oceanGeo, waterMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = 0.05;
    oceanMesh.receiveShadow = true;
    root.add(oceanMesh);

    // Sistema de cámara orbital
    const sph = { radius: 76, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    const target = { x: 0, y: 1.5, z: 0 };
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

    // Encuadre y escala del modelo Revit acostado en el plano
    const frameModel = () => {
      const obj = modelRef.current;
      if (!obj) return;
      obj.rotation.set(0, 0, 0);
      obj.rotation.x = -Math.PI / 2; // Acostar terreno exportado de Revit (Z-up a Y-up)
      obj.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (!isFinite(maxDim) || maxDim <= 0) return;

      const s = 36 / maxDim;
      obj.scale.setScalar(s);
      obj.position.set(-center.x * s, -box.min.y * s, -center.z * s);
      obj.updateMatrixWorld(true);

      const c2 = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
      target.x = c2.x;
      target.y = c2.y * 0.7;
      target.z = c2.z;
      sph.radius = 82;
      placeCamera();

      // Ajustar altura de la lámina de agua al borde costero inferior de la isla
      oceanMesh.position.y = 0.28;
    };

    // Procesamiento y asignación de materiales PBR realistas al FBX de Revit
    const setupRevitModel = (obj) => {
      if (cancelled) return;
      modelRef.current = obj;
      obj.updateMatrixWorld(true);

      const islandMeshes = [];

      obj.traverse((c) => {
        if (!c.isMesh) return;
        c.castShadow = true;
        c.receiveShadow = true;

        const name = (c.name || '').toLowerCase();

        // 1. Detección de las Vías en el modelo Revit (Sólido topográfico subdividido o mallas de suelo)
        if (name.includes('sólido topográfico 1') || name.includes('solido topografico 1') || name.includes('164695') || name.includes('via') || name.includes('camino') || name.includes('road')) {
          c.material = sandMat;
          c.renderOrder = 3;
          ensureTopUVs(c.geometry, 20);
        }
        // 2. Detección del Terreno Principal de la Isla (Toposolid de Revit)
        else if (name.includes('toposolid') || name.includes('terrain') || name.includes('terreno') || name.includes('149111')) {
          islandMeshes.push(c);
          ensureTopUVs(c.geometry, 35);

          // Partición de caras por elevación: el zócalo sumergido usa material agua, la tierra usa pasto oscuro
          const g = c.geometry;
          g.computeBoundingBox();
          const bb = g.boundingBox;
          const seaHeight = bb.min.z + (bb.max.z - bb.min.z) * 0.085;
          const posA = g.attributes.position;
          const idx = g.index ? g.index.array : null;
          const faceCount = idx ? idx.length / 3 : posA.count / 3;
          const groups = [];
          let runMat = -1;
          let runStart = 0;
          let runCount = 0;
          const tmpV = new THREE.Vector3();

          for (let f = 0; f < faceCount; f++) {
            const getZ = (k) => {
              const vi = idx ? idx[f * 3 + k] : f * 3 + k;
              tmpV.fromBufferAttribute(posA, vi);
              return tmpV.z;
            };
            const avgZ = (getZ(0) + getZ(1) + getZ(2)) / 3;
            const matIdx = avgZ < seaHeight ? 0 : 1; // 0: agua costera, 1: pasto oscuro

            if (matIdx !== runMat) {
              if (runCount > 0) groups.push([runStart, runCount, runMat]);
              runMat = matIdx;
              runStart = f * 3;
              runCount = 0;
            }
            runCount += 3;
          }
          if (runCount > 0) groups.push([runStart, runCount, runMat]);

          if (groups.length > 0) {
            g.clearGroups();
            groups.forEach(([s, cc, mi]) => g.addGroup(s, cc, mi));
            // Material costero sumergido + Pasto oscurito arquitectónico
            const coastWaterMat = new THREE.MeshStandardMaterial({
              color: 0x071e2e,
              roughness: 0.25,
              metalness: 0.2
            });
            c.material = [coastWaterMat, grassMat];
          } else {
            c.material = grassMat;
          }
        }
        // 3. Edificaciones, casas y muros arquitectónicos
        else {
          c.material = buildingMat;
        }
      });

      root.add(obj);

      // Si por alguna razón la subdivisión de vías no era una malla separada,
      // buscamos mallas de huella baja plana sobre la isla para aplicar arena
      const bb = new THREE.Box3();
      obj.traverse((c) => {
        if (c.isMesh && c.material === buildingMat) {
          bb.setFromObject(c);
          const sz = bb.max.z - bb.min.z;
          const sx = bb.max.x - bb.min.x;
          const sy = bb.max.y - bb.min.y;
          const ratio = Math.max(sx, sy) / Math.max(0.1, Math.min(sx, sy));
          // Trazos alargados aplanados = caminos de arena
          if (sz < 1.8 && ratio > 3.0) {
            c.material = sandMat;
            ensureTopUVs(c.geometry, 15);
          }
        }
      });

      let meshCount = 0;
      obj.traverse((c) => { if (c.isMesh) meshCount++; });
      if (onStats) onStats({ meshes: meshCount });

      frameModel();

      // Agregar vegetación sutil de render sobre las colinas
      try {
        const trees = plantRenderVegetation(islandMeshes, 280);
        if (trees) root.add(trees);
      } catch (e) {
        console.warn('Vegetation scattering note:', e);
      }
    };

    // Carga asíncrona del modelo FBX exportado del Revit
    new FBXLoader().load(
      DEFAULT_MODEL_URL,
      (loadedObj) => setupRevitModel(loadedObj),
      undefined,
      (err) => console.error('Error cargando modelo Revit:', err)
    );

    // Ajustes de vistas de cámara predeterminadas
    applyViewRef.current = (mode) => {
      if (mode === 'axon') {
        sph.phi = Math.PI / 3.2;
        sph.theta = Math.PI / 4;
        sph.radius = 82;
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

    // Controles de interacción con mouse/touch
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
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Bucle de renderizado continuo con animación de olas
    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ondulación marina en tiempo real
      if (waveActiveRef.current) {
        waterUniforms.uTime.value = elapsed;
      }
      waterUniforms.uCameraPos.value.copy(camera.position);

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

  useEffect(() => {
    if (preset && applyViewRef.current) applyViewRef.current(preset);
  }, [preset, presetNonce]);

  useEffect(() => {
    if (fitCtl.current) fitCtl.current();
  }, [fitNonce]);

  return <div ref={mountRef} className="w-full h-full min-h-[580px] cursor-grab active:cursor-grabbing select-none" />;
}

export default function RevitModule() {
  const [viewPreset, setViewPreset] = useState('axon');
  const [presetNonce, setPresetNonce] = useState(0);
  const [fitNonce, setFitNonce] = useState(0);
  const [modelStats, setModelStats] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveActive, setWaveActive] = useState(true);

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

  return (
    <div className={`w-full h-full relative overflow-hidden bg-slate-950 font-sans ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}>
      {/* Visor 3D de Render a pantalla completa */}
      <div className="absolute inset-0 w-full h-full">
        <RenderViewer
          onStats={setModelStats}
          preset={viewPreset}
          presetNonce={presetNonce}
          fitNonce={fitNonce}
          waveActive={waveActive}
        />
      </div>

      {/* Header flotante: elegante, minimalista y transparente */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
            MÓDULO 05 · RENDER BIM REALISTA
          </span>
          {waveActive && (
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] backdrop-blur-md">
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
          onClick={() => setWaveActive((w) => !w)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all shadow-lg ${
            waveActive
              ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80'
              : 'bg-slate-900/70 border-slate-700/50 text-slate-400 hover:bg-slate-800/80'
          }`}
          title="Pausar o activar movimiento del mar"
        >
          {waveActive ? '🌊 Oleaje Activo' : '⏸ Oleaje Pausado'}
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
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center space-x-1 border-r border-slate-800/80 pr-2">
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
            <div className="pl-2 border-l border-slate-800/80 hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{modelStats.meshes.toLocaleString()} elementos BIM cargados</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
