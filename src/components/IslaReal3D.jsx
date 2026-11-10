import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { BASE, DATA_URL } from '../utils/realTerritory.js';

// Tierra Bomba en 3D con datos reales del proyecto:
//  - foto satelital georreferenciada (Esri World Imagery) sobre un terreno con relieve (Terrain Tiles / Terrarium)
//  - árboles reales detectados sobre esa foto (vegetacion.json), coloreados con el pixel de su copa
//  - mar con normales animadas y cielo físico
// El resultado es una vista aérea oblicua que gira despacio alrededor del casco urbano.

const FOCUS = { x: 40, y: 390 }; // metros del modelo (x este, y norte): casco urbano
const EXAG = 2.4; // exageración vertical del relieve
const DEM_Z = 12;
const DEM_X0 = 1187;
const DEM_Y0 = 1929;

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

export default function IslaReal3D({ className = '', onReady, onError }) {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let disposed = false;
    let raf = 0;
    const cleanups = [];

    (async () => {
      try {
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const el = renderer.domElement;
        el.style.cssText = 'display:block;width:100%;height:100%;opacity:0;transition:opacity 1.4s ease';
        mount.appendChild(el);
        cleanups.push(() => {
          renderer.dispose();
          if (el.parentNode === mount) mount.removeChild(el);
        });

        const [geo, smap, satImg, maskImg, ...demImgs] = await Promise.all([
          fetch(`${DATA_URL}georef.json`).then((r) => r.json()),
          fetch(`${DATA_URL}satellite_map.json`).then((r) => r.json()),
          loadImg(`${BASE}textures/tierrabomba_satelite.jpg`),
          loadImg(`${BASE}textures/tierrabomba_tierra_mascara.png`),
          loadImg(`${BASE}data/elevation/1187_1929.png`),
          loadImg(`${BASE}data/elevation/1188_1929.png`),
          loadImg(`${BASE}data/elevation/1187_1930.png`),
          loadImg(`${BASE}data/elevation/1188_1930.png`),
        ]);
        if (disposed) return;
        const veg = await fetch(`${DATA_URL}vegetacion.json`).then((r) => r.json());
        if (disposed) return;

        // ---- muestreo: color de la foto, máscara de tierra y relieve ----
        const SC = 1024;
        const satC = document.createElement('canvas');
        satC.width = satC.height = SC;
        const sctx = satC.getContext('2d', { willReadFrequently: true });
        sctx.drawImage(satImg, 0, 0, SC, SC);
        const satData = sctx.getImageData(0, 0, SC, SC).data;

        const MC = 512;
        const maskC = document.createElement('canvas');
        maskC.width = maskC.height = MC;
        const mctx = maskC.getContext('2d', { willReadFrequently: true });
        mctx.filter = 'blur(5px)';
        mctx.drawImage(maskImg, 0, 0, MC, MC);
        const maskData = mctx.getImageData(0, 0, MC, MC).data;
        // la máscara usa el rojo (o el alfa si es PNG con transparencia)
        const maskAt = (u, v) => {
          const x = Math.max(0, Math.min(MC - 1, Math.floor(u * MC)));
          const y = Math.max(0, Math.min(MC - 1, Math.floor((1 - v) * MC)));
          const i = (y * MC + x) * 4;
          return Math.max(maskData[i], maskData[i + 3] < 255 ? maskData[i + 3] : 0) / 255;
        };

        const demC = document.createElement('canvas');
        demC.width = demC.height = 512;
        const dctx = demC.getContext('2d', { willReadFrequently: true });
        dctx.drawImage(demImgs[0], 0, 0);
        dctx.drawImage(demImgs[1], 256, 0);
        dctx.drawImage(demImgs[2], 0, 256);
        dctx.drawImage(demImgs[3], 256, 256);
        const demData = dctx.getImageData(0, 0, 512, 512).data;
        const demPx = (x, y) => {
          x = Math.max(0, Math.min(511, x));
          y = Math.max(0, Math.min(511, y));
          const i = (y * 512 + x) * 4;
          return demData[i] * 256 + demData[i + 1] + demData[i + 2] / 256 - 32768;
        };

        // modelo (x este, y norte) -> lon/lat (mismo registro que el visor Revit)
        const cr = Math.cos(geo.rot);
        const sr = Math.sin(geo.rot);
        const toLL = (x, y) => {
          const px = (x - geo.tx) / geo.sc;
          const py = (y - geo.ty) / geo.sc;
          const ox = px * cr + py * sr;
          const oy = -px * sr + py * cr;
          return [geo.lon0 + ox / geo.kx, geo.lat0 + oy / geo.ky];
        };
        const demAt = (x, y) => {
          const [lon, lat] = toLL(x, y);
          const n = 2 ** DEM_Z;
          const tx = ((lon + 180) / 360) * n;
          const ty = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n;
          const fx = (tx - DEM_X0) * 256 - 0.5;
          const fy = (ty - DEM_Y0) * 256 - 0.5;
          const x0 = Math.floor(fx);
          const y0 = Math.floor(fy);
          const ax = fx - x0;
          const ay = fy - y0;
          const h =
            demPx(x0, y0) * (1 - ax) * (1 - ay) + demPx(x0 + 1, y0) * ax * (1 - ay) +
            demPx(x0, y0 + 1) * (1 - ax) * ay + demPx(x0 + 1, y0 + 1) * ax * ay;
          return h;
        };

        // ---- terreno ----
        const [[i00, i01], [i10, i11]] = smap.inv;
        const det = i00 * i11 - i01 * i10;
        const inv = [[i11 / det, -i01 / det], [-i10 / det, i00 / det]]; // (u, v') -> (dx, dy)
        const [ox0, oy0] = smap.origin;
        const N = 240;
        const pos = new Float32Array((N + 1) * (N + 1) * 3);
        const uvs = new Float32Array((N + 1) * (N + 1) * 2);
        const heights = new Float32Array((N + 1) * (N + 1));
        let p = 0;
        let q = 0;
        for (let j = 0; j <= N; j++) {
          for (let i = 0; i <= N; i++) {
            const u = i / N;
            const vp = j / N;
            const dx = inv[0][0] * u + inv[0][1] * vp;
            const dy = inv[1][0] * u + inv[1][1] * vp;
            const mx = ox0 + dx;
            const my = oy0 + dy;
            const m = maskAt(u, 1 - vp);
            const land = smooth(0.3, 0.85, m);
            const h = Math.max(0, demAt(mx, my)) * EXAG * land + 0.15 * land;
            heights[j * (N + 1) + i] = h;
            pos[p++] = mx;
            pos[p++] = h;
            pos[p++] = -my;
            uvs[q++] = u;
            uvs[q++] = 1 - vp;
          }
        }
        const idx = [];
        for (let j = 0; j < N; j++) {
          for (let i = 0; i < N; i++) {
            const a = j * (N + 1) + i;
            const b = a + 1;
            const d = a + N + 1;
            const e = d + 1;
            idx.push(a, d, b, b, d, e);
          }
        }
        const tg = new THREE.BufferGeometry();
        tg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        tg.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        tg.setIndex(idx);
        tg.computeVertexNormals();

        const satTex = new THREE.Texture(satImg);
        satTex.colorSpace = THREE.SRGBColorSpace;
        satTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        satTex.needsUpdate = true;
        const maskTex = new THREE.Texture(maskImg);
        maskTex.needsUpdate = true;
        const terrain = new THREE.Mesh(
          tg,
          new THREE.MeshStandardMaterial({
            map: satTex, alphaMap: maskTex, alphaTest: 0.5, roughness: 1, metalness: 0,
            color: 0xf0ead8,
          })
        );
        terrain.receiveShadow = true;

        // altura del terreno en (x, y) del modelo
        const heightAt = (mx, my) => {
          const dx = mx - ox0;
          const dy = my - oy0;
          const u = i00 * dx + i01 * dy;
          const vp = i10 * dx + i11 * dy;
          const fi = Math.max(0, Math.min(N - 1e-3, u * N));
          const fj = Math.max(0, Math.min(N - 1e-3, vp * N));
          const i = Math.floor(fi);
          const j = Math.floor(fj);
          const ax = fi - i;
          const ay = fj - j;
          const H = (a, b) => heights[b * (N + 1) + a];
          return {
            h: H(i, j) * (1 - ax) * (1 - ay) + H(i + 1, j) * ax * (1 - ay) + H(i, j + 1) * (1 - ax) * ay + H(i + 1, j + 1) * ax * ay,
            u,
            v: 1 - vp,
          };
        };

        // ---- árboles ----
        const canopy = new THREE.IcosahedronGeometry(0.5, 2);
        {
          const pa = canopy.attributes.position;
          const col = new Float32Array(pa.count * 3);
          const v = new THREE.Vector3();
          for (let k = 0; k < pa.count; k++) {
            v.fromBufferAttribute(pa, k);
            const n = Math.sin(v.x * 9.1 + v.z * 7.3) * Math.cos(v.y * 8.2 + v.x * 5.1) * 0.08 + 1;
            v.multiplyScalar(n);
            v.y *= 0.82;
            pa.setXYZ(k, v.x, v.y, v.z);
            const shade = 0.55 + 0.6 * ((v.y + 0.45) / 0.9); // base más oscura, copa iluminada
            col[k * 3] = col[k * 3 + 1] = col[k * 3 + 2] = shade;
          }
          canopy.setAttribute('color', new THREE.BufferAttribute(col, 3));
          canopy.computeVertexNormals();
        }
        const trees = veg.arboles
          .map(([x, y, size, dense], i) => {
            const g = heightAt(x, y);
            return { x, y, size, dense, i, ...g };
          })
          .filter((t) => maskAt(t.u, t.v) > 0.55);
        const treeMesh = new THREE.InstancedMesh(
          canopy,
          new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }),
          trees.length
        );
        const m4 = new THREE.Matrix4();
        const qn = new THREE.Quaternion();
        const sv = new THREE.Vector3();
        const pv = new THREE.Vector3();
        const cc = new THREE.Color();
        const eul = new THREE.Euler();
        trees.forEach((t, k) => {
          const rnd = ((Math.imul(t.i + 5, 2654435761) >>> 0) % 1000) / 1000;
          const height = 8.5 * t.size * (t.dense ? 0.95 : 1.1) * (0.85 + rnd * 0.4);
          const diam = height * (0.72 + rnd * 0.3);
          pv.set(t.x, t.h + height * 0.5, -t.y);
          eul.set(0, rnd * 6.28, 0);
          qn.setFromEuler(eul);
          sv.set(diam, height, diam);
          m4.compose(pv, qn, sv);
          treeMesh.setMatrixAt(k, m4);
          // color de la copa tomado de la propia foto satelital
          const sx = Math.max(0, Math.min(SC - 1, Math.floor(t.u * SC)));
          const sy = Math.max(0, Math.min(SC - 1, Math.floor(t.v * SC)));
          const si = (sy * SC + sx) * 4;
          let r = satData[si] / 255;
          let g = satData[si + 1] / 255;
          let b = satData[si + 2] / 255;
          cc.setRGB(r, g, b, THREE.SRGBColorSpace);
          const hsl = {};
          cc.getHSL(hsl);
          const hue = Math.max(0.07, Math.min(0.28, hsl.h < 0.07 || hsl.h > 0.6 ? 0.2 : hsl.h));
          cc.setHSL(hue, Math.min(0.75, hsl.s * 1.2 + 0.18), Math.max(0.2, Math.min(0.42, hsl.l * 1.3)));
          treeMesh.setColorAt(k, cc);
        });
        treeMesh.instanceMatrix.needsUpdate = true;
        if (treeMesh.instanceColor) treeMesh.instanceColor.needsUpdate = true;
        treeMesh.castShadow = true;
        treeMesh.receiveShadow = true;
        treeMesh.frustumCulled = false;

        // ---- escena ----
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xa9d3dc, 0.00026);
        scene.add(terrain, treeMesh);

        const sky = new Sky();
        sky.scale.setScalar(20000);
        const su = sky.material.uniforms;
        su.turbidity.value = 3.2;
        su.rayleigh.value = 1.1;
        su.mieCoefficient.value = 0.004;
        su.mieDirectionalG.value = 0.82;
        const sunDir = new THREE.Vector3();
        sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 34), THREE.MathUtils.degToRad(235));
        su.sunPosition.value.copy(sunDir);
        scene.add(sky);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.add(sky.clone());
        scene.environment = pmrem.fromScene(envScene, 0, 0.1, 30000).texture;
        pmrem.dispose();

        const normals = new THREE.TextureLoader().load(`${BASE}textures/water_normals_fine.jpg`);
        normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
        const water = new Water(new THREE.PlaneGeometry(14000, 14000), {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: normals,
          sunDirection: sunDir.clone(),
          sunColor: 0xfff3dd,
          waterColor: 0x0c8fa8,
          distortionScale: 3.4,
          fog: true,
        });
        water.rotation.x = -Math.PI / 2;
        water.position.set(FOCUS.x, 0.05, -FOCUS.y);
        water.material.uniforms.size.value = 3.2;
        scene.add(water);

        const sun = new THREE.DirectionalLight(0xfff0d8, 3.2);
        sun.position.copy(sunDir).multiplyScalar(600).add(new THREE.Vector3(FOCUS.x, 0, -FOCUS.y));
        sun.target.position.set(FOCUS.x, 0, -FOCUS.y);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        const sc = sun.shadow.camera;
        sc.left = -420; sc.right = 420; sc.top = 420; sc.bottom = -420; sc.near = 50; sc.far = 1600;
        sun.shadow.bias = -0.0004;
        sun.shadow.normalBias = 0.6;
        scene.add(sun, sun.target);
        scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x6b5d3a, 0.55));

        const camera = new THREE.PerspectiveCamera(42, 1, 1, 30000);
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

        const target = { x: 0, y: 0 };
        const onMove = (e) => {
          const r = mount.getBoundingClientRect();
          target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
          target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        };
        window.addEventListener('pointermove', onMove);
        cleanups.push(() => window.removeEventListener('pointermove', onMove));

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const look = new THREE.Vector3(FOCUS.x, 14, -FOCUS.y);
        const cur = { x: 0, y: 0 };
        const t0 = performance.now();
        let shown = false;
        const tick = () => {
          const t = reduce ? 0 : (performance.now() - t0) / 1000;
          cur.x += (target.x - cur.x) * 0.04;
          cur.y += (target.y - cur.y) * 0.04;
          const ang = THREE.MathUtils.degToRad(205) + Math.sin(t * 0.05) * 0.55 + cur.x * 0.18;
          const radius = 470;
          const height = 170 - cur.y * 25;
          camera.position.set(FOCUS.x + Math.sin(ang) * radius, height, -FOCUS.y + Math.cos(ang) * radius);
          camera.lookAt(look);
          water.material.uniforms.time.value = t * 0.5;
          renderer.render(scene, camera);
          if (!shown) {
            shown = true;
            el.style.opacity = '1';
            setReady(true);
            if (onReady) onReady();
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        console.warn('Vista 3D de la isla no disponible:', err);
        if (onError) onError(err);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={className} data-ready={ready ? '1' : '0'} aria-hidden="true" />;
}



