import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function crearMojarra3D() {
  const fish = new THREE.Group();

  // Cuerpo de mojarra esculpido (esfera elongada y comprimida)
  const bodyGeo = new THREE.SphereGeometry(0.65, 28, 20);
  bodyGeo.scale(1.85, 0.42, 0.92);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x9eb3c2,
    roughness: 0.42,
    metalness: 0.18,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  fish.add(body);

  // Cola en V
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.lineTo(0.62, 0.42);
  tailShape.lineTo(0.45, 0);
  tailShape.lineTo(0.62, -0.42);
  tailShape.closePath();
  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015 });
  tailGeo.rotateX(Math.PI / 2);
  tailGeo.translate(1.05, 0.025, 0);
  const tail = new THREE.Mesh(tailGeo, bodyMat);
  tail.castShadow = true;
  fish.add(tail);

  // Aleta dorsal
  const dorsalGeo = new THREE.ConeGeometry(0.18, 0.65, 4);
  dorsalGeo.scale(1.6, 1, 0.18);
  dorsalGeo.rotateZ(-Math.PI / 2.4);
  const dorsal = new THREE.Mesh(dorsalGeo, bodyMat);
  dorsal.position.set(0.05, 0.24, -0.42);
  dorsal.rotation.x = -0.5;
  fish.add(dorsal);

  // Ojo
  const eyeGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(-0.78, 0.20, -0.14);
  fish.add(eye);

  // Cortes diagonales tradicionales de la mojarra
  const cutGeo = new THREE.BoxGeometry(0.05, 0.08, 0.62);
  const cutMat = new THREE.MeshStandardMaterial({ color: 0x4b2615, roughness: 0.8 });
  [-0.22, 0.06, 0.34].forEach((cx) => {
    const cut = new THREE.Mesh(cutGeo, cutMat);
    cut.position.set(cx, 0.23, 0);
    cut.rotation.y = 0.35;
    fish.add(cut);
  });

  fish.userData.bodyMat = bodyMat;
  return fish;
}

export function Escena3DMojarra({ etapa, adobos, friendo, coccion, plato }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ etapa, adobos, friendo, coccion, plato });
  stateRef.current = { etapa, adobos, friendo, coccion, plato };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1721);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / Math.max(1, mount.clientHeight), 0.1, 50);
    camera.position.set(0, 4.2, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2.15;

    // Iluminación cálida caribeña
    scene.add(new THREE.HemisphereLight(0xcbe8ff, 0x3b2a1e, 1.1));
    const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
    sun.position.set(4, 7, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const rim = new THREE.PointLight(0xff9b54, 1.6, 12);
    rim.position.set(-3, 2.5, -2.5);
    scene.add(rim);

    // Mesón de madera caribeña
    const mesa = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 4.5, 0.3, 48),
      new THREE.MeshStandardMaterial({ color: 0x3b281c, roughness: 0.85 })
    );
    mesa.position.y = -0.35;
    mesa.receiveShadow = true;
    scene.add(mesa);

    // GRUPO 1: TABLA DE ADOBAR
    const gAdobar = new THREE.Group();
    scene.add(gAdobar);

    const tabla = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.22, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x7a5030, roughness: 0.72 })
    );
    tabla.position.y = -0.09;
    tabla.castShadow = true;
    tabla.receiveShadow = true;
    gAdobar.add(tabla);

    const mojarraAdobar = crearMojarra3D();
    mojarraAdobar.position.set(0, 0.24, 0);
    gAdobar.add(mojarraAdobar);

    // Ingredientes 3D de adobo
    const gLimon = new THREE.Group();
    const limonSlice = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x9de055, roughness: 0.4 })
    );
    limonSlice.position.set(-1.35, 0.06, 0.65);
    limonSlice.rotation.z = 0.12;
    gLimon.add(limonSlice);
    gAdobar.add(gLimon);

    const gAjo = new THREE.Group();
    const ajoMat = new THREE.MeshStandardMaterial({ color: 0xf5e9c6, roughness: 0.6 });
    [[-0.25, 0.08], [0.05, -0.06], [0.28, 0.05]].forEach(([ax, az]) => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08), ajoMat);
      m.position.set(ax, 0.47, az);
      gAjo.add(m);
    });
    gAdobar.add(gAjo);

    const gSal = new THREE.Group();
    const salMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), salMat);
      s.position.set(-0.55 + (i % 7) * 0.18, 0.48, (i % 2 === 0 ? 0.12 : -0.12));
      gSal.add(s);
    }
    gAdobar.add(gSal);

    // GRUPO 2: CALDERO Y FOGÓN
    const gFreir = new THREE.Group();
    scene.add(gFreir);

    const caldero = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 1.45, 0.9, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x22262b, roughness: 0.45, metalness: 0.78, side: THREE.DoubleSide })
    );
    caldero.position.y = 0.55;
    caldero.castShadow = true;
    gFreir.add(caldero);

    const calderoFondo = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 32),
      new THREE.MeshStandardMaterial({ color: 0x1a1d21, roughness: 0.6, metalness: 0.6 })
    );
    calderoFondo.rotation.x = -Math.PI / 2;
    calderoFondo.position.y = 0.12;
    gFreir.add(calderoFondo);

    const aceite = new THREE.Mesh(
      new THREE.CircleGeometry(1.62, 32),
      new THREE.MeshStandardMaterial({ color: 0xe6a119, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.88 })
    );
    aceite.rotation.x = -Math.PI / 2;
    aceite.position.y = 0.56;
    gFreir.add(aceite);

    const mojarraFreir = crearMojarra3D();
    mojarraFreir.scale.setScalar(0.92);
    mojarraFreir.position.set(0, 0.54, 0);
    gFreir.add(mojarraFreir);

    // Llamas 3D debajo del caldero
    const llamas = [];
    const llamaMat = new THREE.MeshStandardMaterial({ color: 0xff6b1a, emissive: 0xff4500, emissiveIntensity: 1.8 });
    for (let i = 0; i < 8; i++) {
      const l = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 8), llamaMat);
      const a = (i / 8) * Math.PI * 2;
      l.position.set(Math.cos(a) * 0.9, 0.05, Math.sin(a) * 0.9);
      gFreir.add(l);
      llamas.push(l);
    }

    // Burbujas de aceite
    const burbujas = [];
    const burbMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.6 });
    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.05 + (i % 3) * 0.02, 8, 8), burbMat);
      const a = i * 2.1;
      const r = 0.55 + (i % 4) * 0.24;
      b.position.set(Math.cos(a) * r, 0.58, Math.sin(a) * r);
      gFreir.add(b);
      burbujas.push(b);
    }

    // GRUPO 3: EMPLATAR EN PLATO COSTERO 3D
    const gEmplatar = new THREE.Group();
    scene.add(gEmplatar);

    const individual = new THREE.Mesh(
      new THREE.CylinderGeometry(2.3, 2.35, 0.06, 48),
      new THREE.MeshStandardMaterial({ color: 0x9c7344, roughness: 0.88 })
    );
    individual.position.y = -0.15;
    individual.receiveShadow = true;
    gEmplatar.add(individual);

    const platePoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.25, 0.02),
      new THREE.Vector2(1.65, 0.16),
      new THREE.Vector2(1.75, 0.20),
      new THREE.Vector2(1.72, 0.24),
      new THREE.Vector2(1.22, 0.08),
      new THREE.Vector2(0, 0.06),
    ];
    const platoMesh = new THREE.Mesh(
      new THREE.LatheGeometry(platePoints, 48),
      new THREE.MeshStandardMaterial({ color: 0xf7f3eb, roughness: 0.22, metalness: 0.05 })
    );
    platoMesh.position.y = -0.1;
    platoMesh.castShadow = true;
    platoMesh.receiveShadow = true;
    gEmplatar.add(platoMesh);

    const mojarraPlato = crearMojarra3D();
    mojarraPlato.scale.setScalar(0.82);
    mojarraPlato.position.set(0.05, 0.18, 0.28);
    mojarraPlato.rotation.y = -0.15;
    mojarraPlato.userData.bodyMat.color.set(0xd6822b);
    mojarraPlato.userData.bodyMat.roughness = 0.52;
    gEmplatar.add(mojarraPlato);

    // Arroz con coco y titoté 3D
    const gArroz = new THREE.Group();
    const arrozDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xb98a5b, roughness: 0.82 })
    );
    arrozDome.scale.set(1, 0.72, 1);
    arrozDome.position.set(-0.62, 0.02, -0.58);
    arrozDome.castShadow = true;
    gArroz.add(arrozDome);
    const titoteMat = new THREE.MeshStandardMaterial({ color: 0x3f2310, roughness: 0.9 });
    for (let i = 0; i < 10; i++) {
      const t = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), titoteMat);
      const a = i * 1.3;
      t.position.set(-0.62 + Math.cos(a) * 0.28, 0.31 - (i % 3) * 0.04, -0.58 + Math.sin(a) * 0.28);
      gArroz.add(t);
    }
    gEmplatar.add(gArroz);

    // Patacones 3D
    const gPatacones = new THREE.Group();
    const patMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.65 });
    [
      [0.65, 0.06, -0.55, 0.1],
      [0.95, 0.12, -0.35, -0.15],
      [0.58, 0.10, -0.22, 0.08],
    ].forEach(([px, py, pz, rx]) => {
      const pat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.09, 18), patMat);
      pat.position.set(px, py, pz);
      pat.rotation.x = rx;
      pat.castShadow = true;
      gPatacones.add(pat);
    });
    gEmplatar.add(gPatacones);

    // Ensalada fresca + rodaja de limón 3D
    const gEnsalada = new THREE.Group();
    const lechugaMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.7 });
    const tomateMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    for (let i = 0; i < 6; i++) {
      const l = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14), lechugaMat);
      l.position.set(-0.85 + Math.cos(i) * 0.2, 0.09, 0.58 + Math.sin(i) * 0.18);
      gEnsalada.add(l);
    }
    const tom1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 14), tomateMat);
    tom1.position.set(-0.82, 0.18, 0.56);
    tom1.rotation.z = 0.3;
    const limPlato = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.07, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xa3e635, roughness: 0.35 })
    );
    limPlato.position.set(0.95, 0.1, 0.68);
    limPlato.rotation.z = 0.4;
    gEnsalada.add(tom1, limPlato);
    gEmplatar.add(gEnsalada);

    const timer = new THREE.Timer();
    let dropProg = { mojarra: 0, arroz: 0, patacones: 0, ensalada: 0 };

    renderer.setAnimationLoop(() => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      const s = stateRef.current;

      gAdobar.visible = s.etapa === 'adobar';
      gFreir.visible = s.etapa === 'freir';
      gEmplatar.visible = s.etapa === 'emplatar' || s.etapa === 'listo';

      if (gAdobar.visible) {
        gLimon.visible = !!s.adobos.limon;
        gAjo.visible = !!s.adobos.ajo;
        gSal.visible = !!s.adobos.sal;
        const todo = s.adobos.limon && s.adobos.ajo && s.adobos.sal;
        mojarraAdobar.userData.bodyMat.color.lerp(
          new THREE.Color(todo ? 0xd9a45b : 0x9eb3c2),
          dt * 6
        );
        mojarraAdobar.position.y = 0.24 + Math.sin(t * 2.2) * 0.015;
      }

      if (gFreir.visible) {
        const cNorm = Math.min(1, s.coccion / 100);
        const colTarget = cNorm < 0.4 ? 0xc7ab7c : cNorm <= 0.88 ? 0xd6822b : 0x6b3618;
        mojarraFreir.userData.bodyMat.color.lerp(new THREE.Color(colTarget), dt * 6);
        mojarraFreir.position.y = s.friendo ? 0.56 + Math.sin(t * 14) * 0.025 : 0.54;
        mojarraFreir.rotation.z = s.friendo ? Math.sin(t * 9) * 0.04 : 0;
        llamas.forEach((l, i) => {
          l.scale.y = s.friendo ? 0.8 + Math.sin(t * 18 + i) * 0.45 : 0.45;
        });
        burbujas.forEach((b, i) => {
          b.visible = !!s.friendo;
          if (s.friendo) {
            b.position.y = 0.56 + ((t * 1.4 + i * 0.25) % 0.28);
            const sc = 1 - ((b.position.y - 0.56) / 0.28);
            b.scale.setScalar(Math.max(0.1, sc));
          }
        });
      }

      if (gEmplatar.visible) {
        const animarDrop = (grp, active, key, targetY = 0) => {
          grp.visible = !!active;
          if (active) {
            dropProg[key] = Math.min(1, dropProg[key] + dt * 4.5);
            const k = dropProg[key];
            const bounce = k < 1 ? (1 - k) * 0.9 : 0;
            grp.position.y = targetY + bounce;
          } else {
            dropProg[key] = 0;
          }
        };
        animarDrop(mojarraPlato, s.plato.mojarra, 'mojarra', 0.18);
        animarDrop(gArroz, s.plato.arroz, 'arroz', 0);
        animarDrop(gPatacones, s.plato.patacones, 'patacones', 0);
        animarDrop(gEnsalada, s.plato.ensalada, 'ensalada', 0);
      }

      controls.update();
      renderer.render(scene, camera);
    });

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-white/15 bg-[#0d1721]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <span className="pointer-events-none absolute bottom-2 right-2.5 px-2 py-0.5 rounded-full bg-black/55 border border-white/15 text-[10px] text-white/75">
        Arrastra para girar en 3D
      </span>
    </div>
  );
}

export function Escena3DBailarCartagenero({ esMapale, animPose, combo, terminado, sonando }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ esMapale, animPose, combo, terminado, sonando });
  stateRef.current = { esMapale, animPose, combo, terminado, sonando };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1c2c);
    scene.fog = new THREE.FogExp2(0x0b1c2c, 0.045);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / Math.max(1, mount.clientHeight), 0.1, 60);
    camera.position.set(0, 2.5, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.15, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3.5;
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI / 2.05;

    // Luces cálidas de atardecer frente al mar
    scene.add(new THREE.HemisphereLight(0x8ecae6, 0x3b2618, 1.2));
    const sun = new THREE.DirectionalLight(0xffd18c, 2.3);
    sun.position.set(3.5, 6, 4.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const fiestaLight = new THREE.PointLight(0x35d08a, 2.0, 10);
    fiestaLight.position.set(-2.5, 2.6, 2.0);
    scene.add(fiestaLight);

    // Mar caribeño 3D al fondo
    const mar = new THREE.Mesh(
      new THREE.PlaneGeometry(45, 45),
      new THREE.MeshStandardMaterial({ color: 0x0f4c6c, roughness: 0.25, metalness: 0.35 })
    );
    mar.rotation.x = -Math.PI / 2;
    mar.position.y = -0.35;
    scene.add(mar);

    // Tarima de madera isleña 3D
    const tarima = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.55, 0.35, 36),
      new THREE.MeshStandardMaterial({ color: 0x5c3d24, roughness: 0.8 })
    );
    tarima.position.y = -0.175;
    tarima.receiveShadow = true;
    tarima.castShadow = true;
    scene.add(tarima);

    // Tambor alegre 3D a la derecha
    const tamborGroup = new THREE.Group();
    tamborGroup.position.set(1.35, 0, -0.3);
    const tamborCuerpo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.24, 0.85, 20),
      new THREE.MeshStandardMaterial({ color: 0x7c4823, roughness: 0.75 })
    );
    tamborCuerpo.position.y = 0.425;
    tamborCuerpo.castShadow = true;
    const tamborParche = new THREE.Mesh(
      new THREE.CylinderGeometry(0.33, 0.33, 0.04, 20),
      new THREE.MeshStandardMaterial({ color: 0xf3e5ab, roughness: 0.6 })
    );
    tamborParche.position.y = 0.86;
    tamborGroup.add(tamborCuerpo, tamborParche);
    scene.add(tamborGroup);

    // MAESTRO CARTAGENERO ARTICULADO 3D
    const dancer = new THREE.Group();
    scene.add(dancer);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x7a482c, roughness: 0.55 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
    const pantMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.72 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });

    // Cadera / Torso
    const hips = new THREE.Group();
    hips.position.y = 0.95;
    dancer.add(hips);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.72, 18), shirtMat);
    torso.position.y = 0.36;
    torso.castShadow = true;
    hips.add(torso);

    // Pañuelo rojo costeño
    const panuelo = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 4), redMat);
    panuelo.rotation.x = Math.PI;
    panuelo.position.set(0, 0.58, 0.22);
    hips.add(panuelo);

    // Piernas articuladas
    const legGeo = new THREE.CylinderGeometry(0.10, 0.08, 0.82, 12);
    legGeo.translate(0, -0.41, 0);
    const legL = new THREE.Mesh(legGeo, pantMat);
    legL.position.set(-0.14, 0.95, 0);
    legL.castShadow = true;
    const legR = new THREE.Mesh(legGeo, pantMat);
    legR.position.set(0.14, 0.95, 0);
    legR.castShadow = true;
    dancer.add(legL, legR);

    // Brazos articulados
    const armGeo = new THREE.CylinderGeometry(0.075, 0.06, 0.68, 12);
    armGeo.translate(0, -0.34, 0);
    const armL = new THREE.Mesh(armGeo, skinMat);
    armL.position.set(-0.34, 0.66, 0);
    armL.castShadow = true;
    const armR = new THREE.Mesh(armGeo, skinMat);
    armR.position.set(0.34, 0.66, 0);
    armR.castShadow = true;
    hips.add(armL, armR);

    // Cabeza + Sombrero Vueltiao 3D
    const headGrp = new THREE.Group();
    headGrp.position.y = 0.92;
    hips.add(headGrp);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), skinMat);
    head.castShadow = true;
    headGrp.add(head);

    const sombreroGrp = new THREE.Group();
    sombreroGrp.position.y = 0.16;
    const ala = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.58, 0.03, 28),
      new THREE.MeshStandardMaterial({ color: 0xf3ebd3, roughness: 0.75 })
    );
    const copa = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.26, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0xf3ebd3, roughness: 0.75 })
    );
    copa.position.y = 0.11;
    const cinta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.25, 0.05, 24),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 })
    );
    cinta.position.y = 0.05;
    sombreroGrp.add(ala, copa, cinta);
    headGrp.add(sombreroGrp);

    const timer = new THREE.Timer();
    renderer.setAnimationLoop(() => {
      timer.update();
      const t = timer.getElapsed();
      const s = stateRef.current;
      const tempo = s.esMapale ? 7.5 : 4.8;
      const groove = Math.sin(t * tempo);

      // Coreografía 3D viva según la pose actual (0..3)
      const pose = s.animPose;
      hips.position.y = 0.95 + Math.abs(groove) * (pose === 3 ? 0.22 : 0.08);
      hips.rotation.y = pose === 1 ? Math.sin(t * 3.2) * 0.55 : groove * 0.18;
      hips.rotation.z = pose === 0 ? groove * 0.12 : pose === 2 ? groove * 0.22 : 0;

      armL.rotation.z = pose === 1 ? -1.4 : pose === 2 ? -0.9 + groove * 0.5 : pose === 3 ? -2.3 : -0.35 + groove * 0.25;
      armR.rotation.z = pose === 1 ? 1.3 : pose === 2 ? 0.9 - groove * 0.5 : pose === 3 ? 2.3 : 0.35 - groove * 0.25;
      armL.rotation.x = pose === 2 ? Math.cos(t * tempo) * 0.45 : groove * 0.2;
      armR.rotation.x = pose === 2 ? -Math.cos(t * tempo) * 0.45 : -groove * 0.2;

      legL.rotation.x = groove * (pose === 3 ? 0.5 : 0.28);
      legR.rotation.x = -groove * (pose === 3 ? 0.5 : 0.28);

      sombreroGrp.rotation.z = pose === 1 ? -0.22 : groove * 0.06;
      tamborGroup.scale.setScalar(1 + Math.max(0, groove) * (s.sonando ? 0.08 : 0.03));

      controls.update();
      renderer.render(scene, camera);
    });

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-white/15 bg-[#0b1c2c]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <span className="pointer-events-none absolute bottom-2 right-2.5 px-2 py-0.5 rounded-full bg-black/55 border border-white/15 text-[10px] text-white/75">
        Arrastra para girar en 3D
      </span>
    </div>
  );
}
