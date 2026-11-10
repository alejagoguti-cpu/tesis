import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Vista oblicua de la isla (foto satelital sobre un plano) con deriva lenta
// de cámara y paralaje con el puntero. Three.js, sin modelos pesados.
export default function IslaHero3D({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1015');
    scene.fog = new THREE.Fog('#0b1015', 9, 20);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const loader = new THREE.TextureLoader();
    const tex = loader.load(`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Retícula fina sobre el terreno (lenguaje de plano técnico)
    const grid = new THREE.GridHelper(14, 28, '#ffffff', '#ffffff');
    grid.material.transparent = true;
    grid.material.opacity = 0.10;
    grid.position.y = 0.01;
    scene.add(grid);

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

    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const look = new THREE.Vector3(0, 0, -0.4);
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const t0 = performance.now();

    const tick = () => {
      const t = reduce ? 0 : (performance.now() - t0) / 1000;
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      const ang = Math.sin(t * 0.08) * 0.35 + cur.x * 0.25;
      const radius = 8.6;
      camera.position.set(Math.sin(ang) * radius, 5.6 - cur.y * 0.5, Math.cos(ang) * radius * 0.85);
      camera.lookAt(look);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      tex.dispose();
      plane.geometry.dispose();
      plane.material.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
