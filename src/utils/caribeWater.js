import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { BASE } from './realTerritory.js';

// Mar del módulo 05 (shader Water de three.js: turquesa, ondas finas y brillo del sol) para escenas con cámara
// ortográfica, donde el reflejo plano no aplica: el reflejo se sustituye por el color del cielo.
export function createCaribeWater({ size = 4000, color = '#1ea4c8', unitsPerTile = 1.28, y = -0.06 } = {}) {
  const normals = new THREE.TextureLoader().load(`${BASE}textures/water_normals_fine.jpg`);
  normals.wrapS = normals.wrapT = THREE.RepeatWrapping;

  const water = new Water(new THREE.PlaneGeometry(size, size), {
    textureWidth: 16,
    textureHeight: 16,
    waterNormals: normals,
    sunDirection: new THREE.Vector3(75, 100, 65).normalize(),
    sunColor: 0x6f6a5c,
    waterColor: new THREE.Color(color).getHex(),
    distortionScale: 3.2,
    alpha: 0.97,
    fog: false
  });
  water.material.uniforms.size.value = 1 / unitsPerTile;

  // reflejo = color de cielo (textura 1x1)
  const sky = new THREE.DataTexture(new Uint8Array([70, 150, 190, 255]), 1, 1, THREE.RGBAFormat);
  sky.needsUpdate = true;
  sky.colorSpace = THREE.SRGBColorSpace;
  water.material.uniforms.mirrorSampler.value = sky;

  const eye = water.material.uniforms.eye.value;
  water.onBeforeRender = function (renderer, scene, camera) {
    eye.setFromMatrixPosition(camera.matrixWorld);
  };

  water.rotation.x = -Math.PI / 2;
  water.position.y = y;
  water.name = 'Water';
  return water;
}
