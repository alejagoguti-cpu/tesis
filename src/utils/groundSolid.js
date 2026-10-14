import * as THREE from 'three';

// =============================================================================
// Volumen sólido del terreno (para el Section Box). Es un sólido cerrado dibujado solo por dentro
// (BackSide): de afuera no se ve, pero al recortar con la caja aparece como relleno de suelo con capas,
// en vez de una lámina hueca.
// =============================================================================

const STRATA = [
  [0.0, '#5d5a55'], // roca de base
  [0.38, '#7b7468'],
  [0.62, '#a08c6a'], // arena / suelo arenoso
  [0.84, '#8a6a46'], // suelo
  [0.95, '#5a4a30'],
  [1.0, '#46603a'] // capa vegetal
];

function strataColor(t) {
  const c = new THREE.Color();
  for (let i = 0; i < STRATA.length - 1; i++) {
    const [a, ca] = STRATA[i];
    const [b, cb] = STRATA[i + 1];
    if (t >= a && t <= b) {
      return c.set(ca).lerp(new THREE.Color(cb), (t - a) / (b - a || 1));
    }
  }
  return c.set(STRATA[STRATA.length - 1][1]);
}

/**
 * @param grid  malla de alturas { data, nx, nz, minX, minZ, cx, cz } (ver buildHeightField)
 * @param base  cota inferior del sólido (mundo)
 * @param stride  salto de celdas (resolución del sólido)
 */
export function buildGroundSolid(grid, { base = -0.5, stride = 3, minLand = 0.09 } = {}) {
  const { data, nx, nz, minX, minZ, cx, cz } = grid;
  const gx = Math.floor((nx - 1) / stride);
  const gz = Math.floor((nz - 1) / stride);
  const H = (i, j) => data[Math.min(nz - 1, j * stride) * nx + Math.min(nx - 1, i * stride)];
  const valid = (i, j) => i >= 0 && j >= 0 && i <= gx && j <= gz && H(i, j) > minLand;
  const cell = (i, j) => valid(i, j) && valid(i + 1, j) && valid(i, j + 1) && valid(i + 1, j + 1);

  let top = -1e9;
  for (let j = 0; j <= gz; j++) for (let i = 0; i <= gx; i++) { const h = H(i, j); if (h > top) top = h; }
  const span = top - base;

  const pos = [];
  const col = [];
  const wx = (i) => minX + Math.min(nx - 1, i * stride) * cx;
  const wz = (j) => minZ + Math.min(nz - 1, j * stride) * cz;
  const push = (x, y, z) => {
    pos.push(x, y, z);
    const c = strataColor(Math.max(0, Math.min(1, (y - base) / span)));
    col.push(c.r, c.g, c.b);
  };
  const quad = (a, b, c, d) => { // a,b,c,d en sentido antihorario visto desde el exterior
    push(...a); push(...b); push(...c);
    push(...a); push(...c); push(...d);
  };
  const lift = 0.004;

  for (let j = 0; j < gz; j++) {
    for (let i = 0; i < gx; i++) {
      if (!cell(i, j)) continue;
      const x0 = wx(i), x1 = wx(i + 1), z0 = wz(j), z1 = wz(j + 1);
      const h00 = H(i, j) - lift, h10 = H(i + 1, j) - lift, h01 = H(i, j + 1) - lift, h11 = H(i + 1, j + 1) - lift;
      // tapa superior (normal hacia arriba)
      quad([x0, h00, z0], [x0, h01, z1], [x1, h11, z1], [x1, h10, z0]);
      // fondo (normal hacia abajo)
      quad([x0, base, z0], [x1, base, z0], [x1, base, z1], [x0, base, z1]);
      // paredes donde el vecino no es tierra
      if (!cell(i, j - 1)) quad([x0, base, z0], [x0, h00, z0], [x1, h10, z0], [x1, base, z0]); // norte (-z)
      if (!cell(i, j + 1)) quad([x1, base, z1], [x1, h11, z1], [x0, h01, z1], [x0, base, z1]); // sur (+z)
      if (!cell(i - 1, j)) quad([x0, base, z1], [x0, h01, z1], [x0, h00, z0], [x0, base, z0]); // oeste (-x)
      if (!cell(i + 1, j)) quad([x1, base, z0], [x1, h10, z0], [x1, h11, z1], [x1, base, z1]); // este (+x)
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    vertexColors: true, side: THREE.BackSide, roughness: 0.95, metalness: 0, envMapIntensity: 0.4
  }));
  mesh.name = 'GroundSolid';
  mesh.visible = false;
  mesh.receiveShadow = true;
  return mesh;
}
