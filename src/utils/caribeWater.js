import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { BASE } from './realTerritory.js';

// Mar del módulo 05 (shader Water de three.js con reflejo real del cielo y de la isla, ondas finas y brillo
// del sol) adaptado a la cámara ortográfica (axonométrica) del módulo 02: se replica el pase de reflejo de
// Water.js sin el recorte oblicuo, que solo vale para cámaras en perspectiva.
export function createCaribeWater({ size = 4000, color = '#1ea4c8', unitsPerTile = 1.28, y = -0.06 } = {}) {
  const normals = new THREE.TextureLoader().load(`${BASE}textures/water_normals_fine.jpg`);
  normals.wrapS = normals.wrapT = THREE.RepeatWrapping;

  const water = new Water(new THREE.PlaneGeometry(size, size), {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: normals,
    sunDirection: new THREE.Vector3(75, 100, 65).normalize(),
    sunColor: 0xfff6e0,
    waterColor: new THREE.Color(color).getHex(),
    distortionScale: 2.4,
    alpha: 0.96,
    fog: false
  });
  water.material.uniforms.size.value = 1 / unitsPerTile;

  const u = water.material.uniforms;
  // pase de reflejo propio (soporta cámara ortográfica)
  let heavy = null;
  const rt = new THREE.WebGLRenderTarget(512, 512);
  u.mirrorSampler.value = rt.texture;
  const mirrorCamera = new THREE.PerspectiveCamera();
  const mirrorPlane = new THREE.Plane();
  const normal = new THREE.Vector3(), mirrorPos = new THREE.Vector3(), camPos = new THREE.Vector3();
  const rotation = new THREE.Matrix4(), lookAt = new THREE.Vector3(), view = new THREE.Vector3(), target = new THREE.Vector3();
  const clip = new THREE.Vector4(), q = new THREE.Vector4();
  const textureMatrix = u.textureMatrix.value;
  const eye = u.eye.value;

  water.onBeforeRender = function (renderer, scene, camera) {
    mirrorPos.setFromMatrixPosition(water.matrixWorld);
    camPos.setFromMatrixPosition(camera.matrixWorld);
    rotation.extractRotation(water.matrixWorld);
    normal.set(0, 0, 1).applyMatrix4(rotation);
    view.subVectors(mirrorPos, camPos);
    if (view.dot(normal) > 0) return;
    view.reflect(normal).negate().add(mirrorPos);

    rotation.extractRotation(camera.matrixWorld);
    lookAt.set(0, 0, -1).applyMatrix4(rotation).add(camPos);
    target.subVectors(mirrorPos, lookAt).reflect(normal).negate().add(mirrorPos);

    mirrorCamera.position.copy(view);
    mirrorCamera.up.set(0, 1, 0).applyMatrix4(rotation).reflect(normal);
    mirrorCamera.lookAt(target);
    mirrorCamera.far = camera.far;
    mirrorCamera.updateMatrixWorld();
    mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

    textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    textureMatrix.multiply(mirrorCamera.projectionMatrix);
    textureMatrix.multiply(mirrorCamera.matrixWorldInverse);

    if (!camera.isOrthographicCamera) {
      mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorPos);
      mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);
      clip.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);
      const pm = mirrorCamera.projectionMatrix;
      q.x = (Math.sign(clip.x) + pm.elements[8]) / pm.elements[0];
      q.y = (Math.sign(clip.y) + pm.elements[9]) / pm.elements[5];
      q.z = -1.0;
      q.w = (1.0 + pm.elements[10]) / pm.elements[14];
      clip.multiplyScalar(2.0 / clip.dot(q));
      pm.elements[2] = clip.x;
      pm.elements[6] = clip.y;
      pm.elements[10] = clip.z + 1.0;
      pm.elements[14] = clip.w;
    }

    eye.setFromMatrixPosition(camera.matrixWorld);

    const prevRT = renderer.getRenderTarget();
    const prevXr = renderer.xr.enabled;
    const prevShadow = renderer.shadowMap.autoUpdate;
    // el reflejo solo lleva cielo y suelo: se ocultan los objetos pesados para no duplicar el costo de dibujo
    if (!heavy) heavy = ["Buildings3D", "TB_Arboles", "Vegetation", "NoiseMapGroup"].map((n) => scene.getObjectByName(n)).filter(Boolean);
    const heavyVis = heavy.map((o) => o.visible);
    heavy.forEach((o) => { o.visible = false; });
    water.visible = false;
    renderer.xr.enabled = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(rt);
    renderer.state.buffers.depth.setMask(true);
    if (renderer.autoClear === false) renderer.clear();
    renderer.render(scene, mirrorCamera);
    water.visible = true;
    heavy.forEach((o, i) => { o.visible = heavyVis[i]; });
    renderer.xr.enabled = prevXr;
    renderer.shadowMap.autoUpdate = prevShadow;
    renderer.setRenderTarget(prevRT);
    if (camera.viewport !== undefined) renderer.state.viewport(camera.viewport);
  };

  water.rotation.x = -Math.PI / 2;
  water.position.y = y;
  water.name = 'Water';
  water.userData.update = (seconds) => { u.time.value = seconds * 0.55; };
  return water;
}

// Cielo físico (el mismo del módulo 05); sirve de fondo del reflejo del mar
export function createSkyDome(radius = 1500) {
  const sky = new Sky();
  sky.scale.setScalar(radius);
  const su = sky.material.uniforms;
  su.turbidity.value = 3.4;
  su.rayleigh.value = 1.15;
  su.mieCoefficient.value = 0.0045;
  su.mieDirectionalG.value = 0.82;
  su.sunPosition.value.copy(new THREE.Vector3(75, 100, 65).normalize());
  sky.name = 'SkyDome';
  return sky;
}
