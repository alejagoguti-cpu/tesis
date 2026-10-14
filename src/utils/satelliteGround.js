import * as THREE from 'three';
import { BASE, DATA_URL } from './realTerritory.js';

// =============================================================================
// Suelo satelital de toda la escena territorial (Cartagena, la bahía y Tierrabomba).
// Dos niveles de detalle: base (z15, toda el área) e isla (z16, Tierrabomba completa),
// recortados por la costa oficial de las masas de tierra del catastro.
// Imagen: Esri World Imagery (ver public/data/tierrabomba/CREDITOS.txt).
// =============================================================================

function tierMesh(tier, name, y, lonLatToVector3, loader, renderOrder, anisotropy) {
  const cx = Math.max(24, tier.nx * 3);
  const cy = Math.max(24, tier.ny * 3);
  const n = 2 ** tier.z;
  const positions = [], uvs = [], index = [];
  for (let j = 0; j <= cy; j++) {
    for (let i = 0; i <= cx; i++) {
      const tx = tier.x0 + (i / cx) * tier.nx;
      const ty = tier.y0 + (j / cy) * tier.ny;
      const lon = (tx / n) * 360 - 180;
      const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI;
      const v = lonLatToVector3(lon, lat, y);
      positions.push(v.x, v.y, v.z);
      uvs.push(i / cx, 1 - j / cy);
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
  g.setIndex(index);
  g.computeVertexNormals();

  const map = loader.load(`${BASE}textures/sat_${name}.jpg`);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = anisotropy;
  const alpha = loader.load(`${BASE}textures/sat_${name}_mascara.png`);
  const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    map, alphaMap: alpha, alphaTest: 0.5, roughness: 1, metalness: 0, color: 0xe6e6e6, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -renderOrder, polygonOffsetUnits: -renderOrder
  }));
  mesh.name = `Sat_${name}`;
  mesh.receiveShadow = true;
  mesh.renderOrder = renderOrder;
  return mesh;
}

export async function buildSatelliteGround({ lonLatToVector3, layers = {}, renderer = null }) {
  const group = new THREE.Group();
  group.name = 'SatelliteGround';
  const meta = await (await fetch(`${DATA_URL}mosaicos.json`)).json();
  const loader = new THREE.TextureLoader();
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  group.add(tierMesh(meta.base, 'base', 0.012, lonLatToVector3, loader, 1, aniso));
  group.add(tierMesh(meta.isla, 'isla', 0.016, lonLatToVector3, loader, 2, aniso));
  group.visible = layers.terrain !== false;
  return group;
}
