import * as THREE from 'three';
import { BASE, DATA_URL } from './realTerritory.js';

// =============================================================================
// Suelo satelital del módulo 02:
//  - Base (z15): toda la escena (Cartagena y la bahía), recortada por la costa oficial.
//  - Tierra Bomba: la misma imagen SIN recorte, tal cual está en Maps (costa y mar reales),
//    con los bordes difuminados, para que la isla no dependa de ninguna máscara.
// El mosaico z15 está verificado contra la costa de OpenStreetMap y el catastro.
// Imagen: Esri World Imagery (ver public/data/tierrabomba/CREDITOS.txt).
// =============================================================================

// Alfa: opaco al centro y degradado hacia los bordes para fundir el fondo con la escena
export function edgeFadeTexture(fade = 0.05) {
  const N = 128;
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const d = Math.min(x, y, N - 1 - x, N - 1 - y) / N;
      const a = Math.max(0, Math.min(1, d / fade));
      const v = Math.round((a * a * (3 - 2 * a)) * 255);
      const i = (y * N + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.needsUpdate = true;
  t.magFilter = t.minFilter = THREE.LinearFilter;
  return t;
}

const lonToTile = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const latToTile = (lat, z) => ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** z;

// Ventana de Tierra Bomba dentro del mosaico base (px del mosaico) y su máscara de contorno (isla_mascara.png)
const ISLA_PX = { left: 231, top: 1734, w: 1445, h: 2578 };

// Malla del mosaico entre las coordenadas de tesela (tx0..tx1, ty0..ty1)
function gridMesh(tier, win, y, lonLatToVector3, cells) {
  const n = 2 ** tier.z;
  const [cx, cy] = cells;
  const positions = [], uvs = [], uvs1 = [], index = [];
  for (let j = 0; j <= cy; j++) {
    for (let i = 0; i <= cx; i++) {
      const tx = win.tx0 + (i / cx) * (win.tx1 - win.tx0);
      const ty = win.ty0 + (j / cy) * (win.ty1 - win.ty0);
      const lon = (tx / n) * 360 - 180;
      const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI;
      const v = lonLatToVector3(lon, lat, y);
      positions.push(v.x, v.y, v.z);
      uvs.push((tx - tier.x0) / tier.nx, 1 - (ty - tier.y0) / tier.ny);
      uvs1.push(i / cx, 1 - j / cy);
    }
  }
  for (let j = 0; j < cy; j++) {
    for (let i = 0; i < cx; i++) {
      const a = j * (cx + 1) + i, b = a + 1, d = a + cx + 1, e = d + 1;
      index.push(a, d, b, b, d, e);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute('uv1', new THREE.Float32BufferAttribute(uvs1, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

// Texturas compartidas entre reconstrucciones de la escena (evita duplicar memoria de GPU)
let shared = null;
function sharedTextures(loader, aniso) {
  if (!shared) {
    const map = loader.load(`${BASE}textures/sat_base.jpg`);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = aniso;
    const islaMask = loader.load(`${BASE}textures/isla_mascara.png`);
    islaMask.channel = 1;
    shared = { map, mask: loader.load(`${BASE}textures/sat_base_mascara.png`), islaMask };
  }
  return shared;
}

export async function buildSatelliteGround({ lonLatToVector3, layers = {}, renderer = null }) {
  const group = new THREE.Group();
  group.name = 'SatelliteGround';
  const meta = await (await fetch(`${DATA_URL}mosaicos.json`)).json();
  const tier = meta.base;
  const loader = new THREE.TextureLoader();
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;

  const { map, mask } = sharedTextures(loader, aniso);

  // 1) toda la escena, recortada por la costa oficial
  const full = new THREE.Mesh(
    gridMesh(tier, { tx0: tier.x0, tx1: tier.x0 + tier.nx, ty0: tier.y0, ty1: tier.y0 + tier.ny }, 0.012, lonLatToVector3, [tier.nx * 3, tier.ny * 3]),
    new THREE.MeshStandardMaterial({
      map, alphaMap: mask, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xe6e6e6, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
    })
  );
  full.name = 'Sat_base';
  full.receiveShadow = true;
  full.renderOrder = 1;
  group.add(full);

  // 2) Tierra Bomba tal cual está en Maps: sin recorte, con bordes difuminados
  const win = {
    tx0: tier.x0 + ISLA_PX.left / 256, tx1: tier.x0 + (ISLA_PX.left + ISLA_PX.w) / 256,
    ty0: tier.y0 + ISLA_PX.top / 256, ty1: tier.y0 + (ISLA_PX.top + ISLA_PX.h) / 256
  };
  const islaMask = shared.islaMask;
  const isla = new THREE.Mesh(
    gridMesh(tier, win, 0.016, lonLatToVector3, [48, 84]),
    new THREE.MeshStandardMaterial({
      map, alphaMap: islaMask, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xe6e6e6, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
    })
  );
  isla.name = 'Sat_isla';
  isla.receiveShadow = true;
  isla.renderOrder = 2;
  group.add(isla);

  group.visible = layers.terrain !== false;
  return group;
}
