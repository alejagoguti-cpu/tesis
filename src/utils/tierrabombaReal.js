import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BASE, DATA_URL, prepareTreeSpecies, instanceTrees } from './realTerritory.js';

// =============================================================================
// Tierrabomba real dentro de la escena territorial (módulo 02):
//  - imagen satelital georreferenciada recortada por la costa
//  - árboles reales detectados en esa imagen (mismos datos del módulo 05)
//  - edificios del modelo Revit como volumetría blanca
// lonLatToVector3 / SCALE_3D vienen de cartagena3D.js (proyección EPSG:9377).
// =============================================================================

const loadGLB = (url) => new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, rej));

async function buildRealTierrabombaImpl({ lonLatToVector3, SCALE_3D, layers = {}, onProgress = () => {} }) {
  const group = new THREE.Group();
  group.name = 'TierrabombaReal';

  const geo = await (await fetch(`${DATA_URL}georef.json`)).json();
  const c = Math.cos(geo.rot), s = Math.sin(geo.rot);
  // modelo (x este, y norte) -> lon/lat
  const toLL = (x, y) => {
    const px = (x - geo.tx) / geo.sc, py = (y - geo.ty) / geo.sc;
    const ox = px * c + py * s, oy = -px * s + py * c;
    return [geo.lon0 + ox / geo.kx, geo.lat0 + oy / geo.ky];
  };
  // pixel del mosaico -> lon/lat
  const px2ll = (px, py) => {
    const n = 2 ** geo.mosaico.z;
    const x = geo.mosaico.x0 + px / 256, y = geo.mosaico.y0 + py / 256;
    return [x / n * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI];
  };

  // ---------------- 1) imagen satelital recortada por la costa ----------------
  onProgress(88, 'Cargando imagen satelital real de Tierrabomba...');
  const N = 36;
  const positions = [], uvs = [], index = [];
  for (let j = 0; j <= N; j++) {
    for (let i = 0; i <= N; i++) {
      const [lon, lat] = px2ll((i / N) * geo.mosaico.px, (j / N) * geo.mosaico.px);
      const v = lonLatToVector3(lon, lat, 0.022);
      positions.push(v.x, v.y, v.z);
      uvs.push(i / N, 1 - j / N);
    }
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, d = a + N + 1, e = d + 1;
      index.push(a, d, b, b, d, e);
    }
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  sg.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  sg.setIndex(index);
  sg.computeVertexNormals();
  const loader = new THREE.TextureLoader();
  const map = loader.load(`${BASE}textures/tierrabomba_satelite.jpg`);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const alpha = loader.load(`${BASE}textures/tierrabomba_tierra_mascara.png`);
  const sat = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({
    map, alphaMap: alpha, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xe2e2e2, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4
  }));
  sat.name = 'TB_Satelite';
  sat.receiveShadow = true;
  sat.renderOrder = 3;
  sat.visible = layers.terrain !== false;
  group.add(sat);

  // ---------------- 2) árboles reales ----------------
  onProgress(90, 'Colocando árboles reales detectados en la imagen satelital...');
  try {
    const [veg, species] = await Promise.all([
      fetch(`${DATA_URL}vegetacion.json`).then((r) => r.json()),
      prepareTreeSpecies()
    ]);
    const list = veg.arboles.map(([x, y, size, dense], i) => {
      const [lon, lat] = toLL(x, y);
      const p = lonLatToVector3(lon, lat, 0.024);
      return {
        x: p.x, y: p.y, z: p.z,
        rot: ((Math.imul(i + 7, 40503) >>> 0) % 628) / 100,
        height: 8.5 * size * (dense ? 0.92 : 1.05) * SCALE_3D,
        tone: ((Math.imul(i + 3, 69069) >>> 0) % 100) / 100
      };
    });
    const trees = instanceTrees(species, list, 4, false);
    trees.name = 'TB_Arboles';
    trees.visible = layers.trees !== false;
    group.add(trees);
  } catch (err) {
    console.warn('Árboles reales no disponibles:', err);
  }

  // ---------------- 3) edificios del modelo Revit ----------------
  onProgress(94, 'Levantando edificios del modelo Revit...');
  try {
    const gltf = await loadGLB(`${BASE}models/tierrabomba_revit.glb`);
    let bm = null;
    gltf.scene.traverse((o) => { if (o.isMesh && /building/i.test(o.name)) bm = o; });
    if (bm) {
      const g = bm.geometry.clone();
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const [lon, lat] = toLL(pos.getX(i), pos.getY(i));
        const v = lonLatToVector3(lon, lat, 0);
        pos.setXYZ(i, v.x, 0.024 + pos.getZ(i) * SCALE_3D, v.z);
      }
      pos.needsUpdate = true;
      g.deleteAttribute('color');
      g.computeVertexNormals();
      g.computeBoundingBox();
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.7, metalness: 0, side: THREE.DoubleSide }));
      mesh.name = 'TB_Edificios';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.visible = layers.buildings !== false;
      group.add(mesh);
    }
  } catch (err) {
    console.warn('Edificios del modelo no disponibles:', err);
  }

  return group;
}

// El visor puede reconstruir la escena varias veces (incluso en paralelo): se construye una sola vez
// y se devuelven clones que comparten geometrías y materiales.
let cachedBuild = null;
export async function buildRealTierrabombaOnce(opts) {
  if (!cachedBuild) {
    cachedBuild = buildRealTierrabombaImpl(opts).catch((err) => {
      cachedBuild = null;
      throw err;
    });
  }
  const base = await cachedBuild;
  const g = base.clone(true);
  const { layers = {} } = opts;
  const sat = g.getObjectByName('TB_Satelite');
  const trees = g.getObjectByName('TB_Arboles');
  const bld = g.getObjectByName('TB_Edificios');
  if (sat) sat.visible = layers.terrain !== false;
  if (trees) trees.visible = layers.trees !== false;
  if (bld) bld.visible = layers.buildings !== false;
  return g;
}
export { buildRealTierrabombaOnce as buildRealTierrabomba };
