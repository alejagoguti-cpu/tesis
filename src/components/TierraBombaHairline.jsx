import React, { useEffect, useRef } from 'react';
import HL from '../utils/hairlineKernel.js';

const {
  Cam, facing, fillet, fit, hull, open, poly, prism, proj, rad,
  ringAt, rings, rrect, run, seg, spring, stepS, tset, tval, tween, unproj,
  disposer, flatDot, inject, mk, place, pointer, put, reflect, register, solid, tour, circ,
} = HL;

const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** Convierte un polígono 2D [{x,y}] filleteado en un ring compatible con prism/ringAt. */
function polyToRing(pts) {
  const n = pts.length;
  return pts.map((p, i) => {
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    // normal saliente en sentido horario/antihorario
    return { u: p[0], v: p[1], nu: dy / len, nv: -dx / len };
  });
}

function insetPoly(pts, inset) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map((p) => {
    const dx = p[0] - cx, dy = p[1] - cy;
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.max(0.2, (len - inset) / len);
    return [cx + dx * k, cy + dy * k];
  });
}

function shiftRing(ring, du, dv) {
  return ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));
}

/* ============================================================================
   1. CORREGIMIENTOS: Silueta real de la Isla de Tierra Bomba + 4 hitos
   ============================================================================ */
function mountCorregimientos({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.52);

  // Silueta reconocible de Tierra Bomba (Norte arriba-izq, Punta Arena NE, Bocachica Sur)
  const islandRaw = [
    [22, 16], [48, 8], [76, 18], [94, 42], [118, 52],
    [110, 74], [86, 82], [96, 108], [78, 128], [46, 124],
    [26, 102], [18, 68], [14, 38],
  ];
  const islandOuterPts = fillet(islandRaw, islandRaw.map(() => 6), 3);
  const islandInnerPts = insetPoly(islandOuterPts, 2.2);
  const islandRing = polyToRing(islandOuterPts);
  const islandInner = polyToRing(islandInnerPts);

  const pueblos = [
    { id: 'tierraBomba', label: 'tierra bomba', cx: 38, cy: 30, r: 10 },
    { id: 'puntaArena', label: 'punta arena', cx: 92, cy: 52, r: 9.5 },
    { id: 'canoDeLoro', label: 'caño de loro', cx: 76, cy: 84, r: 10 },
    { id: 'casco', label: 'bocachica', cx: 58, cy: 114, r: 11 },
  ];

  fit(C, [[10, 6, -4], [122, 132, -4], [122, 6, 0], [10, 132, 0], [58, 114, 38]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  reflect(svg, g, P, front, islandRing, 0, 12);
  put(solid(g), prism(P, front, islandRing, islandInner, -4, 4));

  // Ruta marítima/terrestre que une los 4 corregimientos sobre la isla
  const rutaD = pueblos
    .slice(0, -1)
    .map((a, i) => seg(P(a.cx, a.cy, 4.4), P(pueblos[i + 1].cx, pueblos[i + 1].cy, 4.4)))
    .join('');
  mk('path', { d: rutaD, class: 'nf lo dash' }, g);

  const beacons = pueblos.map((p, idx) => {
    const ring = shiftRing(circ(p.r, 18), p.cx, p.cy);
    const inner = shiftRing(circ(p.r - 1.5, 18), p.cx, p.cy);
    const el = solid(g);
    const dot = flatDot(g, C, 1.5, idx === 3 ? 'dot' : 'dot m');
    return { ...p, idx, ring, inner, el, dot, tw: tween(11), drawn: NaN };
  });

  let active = -1;
  function pick(sx, sy) {
    let best = -1, bestD = 1e9;
    for (let i = 0; i < beacons.length; i++) {
      const b = beacons[i];
      const w = unproj(C, sx, sy, 11);
      const d = Math.hypot(w[0] - b.cx, w[1] - b.cy);
      if (d < 22 && d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function apply(next, now) {
    if (next === active) return;
    active = next;
    const anchor = active >= 0 ? active : 3;
    for (let i = 0; i < beacons.length; i++) {
      const target = active === i ? 26 : active >= 0 ? 9.5 : 11 + i * 1.2;
      tset(beacons[i].tw, target, now, Math.abs(i - anchor) * 45);
    }
    read.textContent = active >= 0 ? beacons[active].label : 'tierra bomba';
    B.wake();
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (let i = 0; i < beacons.length; i++) {
      const b = beacons[i];
      const z = tval(b.tw, now);
      if (Math.abs(z - b.tw.to) > 0.05) moving = true;
      if (z !== b.drawn) {
        b.drawn = z;
        put(b.el, prism(P, front, b.ring, b.inner, 4, z));
        place(b.dot, P(b.cx, b.cy, z));
      }
      const hi = active >= 0 ? active === i : i === 3;
      b.el.sil.classList.toggle('hi', hi);
      b.dot.setAttribute('class', hi ? 'dot' : 'dot m');
    }
    return moving;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => apply(pick(pt[0], pt[1]), performance.now()),
    down: (pt) => {
      const idx = pick(pt[0], pt[1]);
      if (idx >= 0 && onSelect) onSelect(beacons[idx].id);
    },
    leave: () => apply(-1, performance.now()),
  }));
  const tp = tour(stage, [[170, 105], [225, 130], [210, 175], [185, 225], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'tierra bomba';

  return { destroy: bag.dispose };
}

/* ============================================================================
   2. PATRIMONIO: Fuerte de San Fernando (herradura + baluarte + desembarco + muelle)
   ============================================================================ */
function mountPatrimonio({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.48);

  // Baluarte oriental en punta (geometría militar abaluartada real)
  const baluartePts = fillet([[60, 32], [108, 38], [118, 56], [102, 74], [60, 72]], [3, 2.5, 2, 2.5, 3], 3);
  const baluarteRing = polyToRing(baluartePts);
  const baluarteInner = polyToRing(insetPoly(baluartePts, 1.8));

  // Muelle largo de madera hacia la bahía
  const [muelleR, muelleI] = rings(104, 68, 146, 76, 2, 1.1);
  // Batería semicircular en herradura (extremo oeste hacia el canal)
  const batR = shiftRing(circ(28, 28), 38, 54);
  const batI = shiftRing(circ(25.2, 28), 38, 54);
  // Plaza interior hundida de la herradura (visualizada con crease/ring)
  const patioR = shiftRing(circ(15, 22), 38, 54);
  // Desembarcadero semicircular frente a la puerta
  const desR = shiftRing(circ(10, 16), 34, 88);
  const desI = shiftRing(circ(8.4, 16), 34, 88);

  fit(C, [[4, 18, -4], [148, 104, -4], [148, 18, 0], [4, 104, 0], [38, 54, 42]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  const [baseR, baseI] = rings(2, 20, 122, 92, 10, 1.8);
  reflect(svg, g, P, front, baseR, 0, 10);
  put(solid(g), prism(P, front, baseR, baseI, -4, 0));

  const parts = [
    { id: 'sanFernando', label: 'herradura', cx: 38, cy: 54, z0: 0, zRest: 22, ring: batR, inner: batI, rHit: 30 },
    { id: 'sanRafael', label: 'baluarte', cx: 88, cy: 54, z0: 0, zRest: 19, ring: baluarteRing, inner: baluarteInner, rHit: 28 },
    { id: 'casco', label: 'desembarco', cx: 34, cy: 88, z0: 0, zRest: 9, ring: desR, inner: desI, rHit: 16 },
    { id: 'sanJose', label: 'muelle', cx: 125, cy: 72, z0: 0, zRest: 8, ring: muelleR, inner: muelleI, rHit: 24 },
  ].map((p, idx) => ({
    ...p,
    idx,
    el: solid(g),
    dot: flatDot(g, C, 1.4, idx === 0 ? 'dot' : 'dot m'),
    sp: spring(p.zRest, { eps: 0.04 }),
    drawn: NaN,
  }));

  // Patio interior marcado sobre la herradura
  const patioPath = mk('path', { class: 'nf lo' }, parts[0].el.g);

  let active = -1;
  function pick(sx, sy) {
    let best = -1, bestD = 1e9;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const w = unproj(C, sx, sy, p.zRest);
      const d = Math.hypot(w[0] - p.cx, w[1] - p.cy);
      if (d < p.rHit && d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function retarget(next) {
    if (next === active) return;
    active = next;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.sp.t = active === i ? p.zRest + 13 : active >= 0 ? p.zRest - 1.5 : p.zRest;
    }
    read.textContent = active >= 0 ? parts[active].label : 'san fernando';
    B.wake();
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (stepS(p.sp, dt)) m = true;
      const z = Math.max(2, p.sp.x);
      if (z !== p.drawn) {
        p.drawn = z;
        put(p.el, prism(P, front, p.ring, p.inner, p.z0, z));
        place(p.dot, P(p.cx, p.cy, z));
        if (i === 0) patioPath.setAttribute('d', poly(ringAt(P, patioR, z)));
      }
      const hi = active >= 0 ? active === i : i === 0;
      p.el.sil.classList.toggle('hi', hi);
      p.dot.setAttribute('class', hi ? 'dot' : 'dot m');
    }
    return m;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => retarget(pick(pt[0], pt[1])),
    down: (pt) => {
      const idx = pick(pt[0], pt[1]);
      if (idx >= 0 && onSelect) onSelect(parts[idx].id);
    },
    leave: () => retarget(-1),
  }));
  const tp = tour(stage, [[165, 138], [220, 145], [248, 200], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'san fernando';

  return { destroy: bag.dispose };
}

/* ============================================================================
   3. TALLERES Y VIERNES: Canoa de Carpintería de Ribera + hojas de agenda
   ============================================================================ */
function mountTalleres({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.54);

  // Casco de lancha / canoa de carpintería de ribera (proa afilada y popa curva)
  const canoaPts = fillet([[8, 36], [34, 22], [86, 24], [104, 36], [86, 48], [34, 50]], [2, 5, 4, 3, 4, 5], 3);
  const canoaRing = polyToRing(canoaPts);
  const canoaInner = polyToRing(insetPoly(canoaPts, 2.2));

  // 3 tarjetas de agenda de los viernes junto al taller
  const CARDS = [
    { id: 'ribera', label: 'carpintería' },
    { id: 'vivero', label: 'vivero' },
    { id: 'escuelaR9', label: 'viernes 4pm' },
  ];
  const W = 54, H = 40, G = 14, REST = -12, BACK = -22, FWD = 18, LIFT = 12;

  fit(C, [[4, 16, -4], [120, 118, -4], [120, 16, 0], [4, 118, 0], [55, 90, 56]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  const [mesaR, mesaI] = rings(4, 14, 114, 62, 6, 1.8);
  reflect(svg, g, P, front, mesaR, 0, 10);
  put(solid(g), prism(P, front, mesaR, mesaI, -4, 0));

  // Canoa de ribera sobre caballete
  const canoaEl = solid(g);
  const canoaSp = spring(14, { eps: 0.04 });
  let canoaDrawn = NaN;
  const bancadas = mk('path', { class: 'nf lo' }, canoaEl.g);

  // 3 hojas de clase virtual del viernes (abren al pasar el puntero)
  const cardShape = fillet([[0, 0], [W, 0], [W, H], [0, H]], [2, 2, 2, 2]);
  const hojas = CARDS.map((meta, i) => {
    const grp = mk('g', {}, g);
    const back = mk('path', { class: 'lo' }, grp);
    const face = mk('path', { class: 'sil' }, grp);
    const lines = mk('path', { class: 'nf lo' }, grp);
    const dot = mk('circle', { r: 1.3, class: i === 2 ? 'dot' : 'dot m' }, grp);
    return { ...meta, i, back, face, lines, dot, a: tween(REST), z: tween(0) };
  });

  let active = -1;
  function pick(sx, sy) {
    const w = unproj(C, sx, sy, 14);
    if (w[0] >= 8 && w[0] <= 106 && w[1] >= 20 && w[1] <= 54) return 99; // canoa
    if (w[0] >= 36 && w[0] <= 110 && w[1] >= 64 && w[1] <= 116) {
      return Math.min(2, Math.max(0, Math.floor((w[1] - 66) / 16)));
    }
    return -1;
  }

  function apply(next, now) {
    if (next === active) return;
    active = next;
    canoaSp.t = active === 99 ? 25 : 14;
    for (let i = 0; i < hojas.length; i++) {
      const th = active >= 0 && active < 3 ? (i === active ? 0 : i < active ? BACK : FWD) : REST;
      const lf = active === i ? LIFT : 0;
      tset(hojas[i].a, th, now, Math.abs(i - (active < 3 && active >= 0 ? active : 1)) * 45);
      tset(hojas[i].z, lf, now, Math.abs(i - (active < 3 && active >= 0 ? active : 1)) * 45);
    }
    read.textContent = active === 99 ? 'canoa ribera' : active >= 0 ? hojas[active].label : 'talleres';
    B.wake();
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    if (stepS(canoaSp, dt)) m = true;
    const cz = canoaSp.x;
    if (cz !== canoaDrawn) {
      canoaDrawn = cz;
      put(canoaEl, prism(P, front, canoaRing, canoaInner, 2, cz));
      bancadas.setAttribute(
        'd',
        seg(P(38, 28, cz), P(38, 44, cz)) + seg(P(62, 27, cz), P(62, 45, cz)) + seg(P(84, 30, cz), P(84, 42, cz)),
      );
    }
    canoaEl.sil.classList.toggle('hi', active === 99);

    for (let i = 0; i < hojas.length; i++) {
      const h = hojas[i];
      const th = tval(h.a, now), lf = tval(h.z, now);
      if (Math.abs(th - h.a.to) > 0.05 || Math.abs(lf - h.z.to) > 0.05) m = true;
      const yb = 70 + i * G, s = Math.sin(rad(th)), co = Math.cos(rad(th));
      const w = (u, v) => P(44 + u, yb + v * s, v * co + lf);
      const wb = (u, v) => P(44 + u, yb + v * s - 1.2 * co, v * co + 1.2 * s + lf);
      h.back.setAttribute('d', poly(cardShape.map((p) => wb(p[0], p[1]))));
      h.face.setAttribute('d', poly(cardShape.map((p) => w(p[0], p[1]))));
      h.lines.setAttribute('d', [H - 12, H - 20, H - 28].map((v) => seg(w(6, v), w(W - 6, v))).join(''));
      place(h.dot, w(W - 10, H - 6));
      const hi = active >= 0 ? active === i : i === 2 && active !== 99;
      h.face.classList.toggle('hi', hi);
      h.dot.setAttribute('class', hi ? 'dot' : 'dot m');
    }
    return m;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => apply(pick(pt[0], pt[1]), performance.now()),
    down: (pt) => {
      const idx = pick(pt[0], pt[1]);
      if (idx === 99 && onSelect) onSelect('ribera');
      else if (idx >= 0 && idx < 3 && onSelect) onSelect(hojas[idx].id);
    },
    leave: () => apply(-1, performance.now()),
  }));
  const tp = tour(stage, [[170, 128], [215, 195], [225, 218], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'talleres';

  return { destroy: bag.dispose };
}

/* ============================================================================
   4. MEMORIAS Y BAILES: 3 Tambores de Bullerengue (alegre, tambora, llamador) + rueda
   ============================================================================ */
function mountMemorias({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.54);
  fit(C, [[-10, -10, -4], [126, 126, -4], [126, -10, 0], [-10, 126, 0], [58, 58, 58]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  // Tarima circular de rueda de bullerengue
  const tarimaR = shiftRing(circ(58, 32), 58, 58);
  const tarimaI = shiftRing(circ(54, 32), 58, 58);
  reflect(svg, g, P, front, tarimaR, 0, 12);
  put(solid(g), prism(P, front, tarimaR, tarimaI, -4, 0));

  // Rueda de baile (8 puntos alrededor de los tambores)
  const ruedaPts = Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * Math.PI * 2;
    return [58 + Math.cos(a) * 44, 58 + Math.sin(a) * 44];
  });
  const ruedaDots = ruedaPts.map(([x, y], k) => {
    const d = flatDot(g, C, 1.5, k % 2 === 0 ? 'dot m' : 'dot off');
    place(d, P(x, y, 0.5));
    return d;
  });

  // 3 tambores tradicionales con cuerpo cónico (foot < top)
  const tambores = [
    { label: 'llamador', cx: 36, cy: 48, rBot: 9, rTop: 12, hRest: 24 },
    { label: 'tambor alegre', cx: 64, cy: 42, rBot: 11, rTop: 15.5, hRest: 34 },
    { label: 'tambora', cx: 56, cy: 76, rBot: 13.5, rTop: 15, hRest: 21 },
  ].map((t, idx) => ({
    ...t,
    idx,
    foot: shiftRing(circ(t.rBot, 22), t.cx, t.cy),
    top: shiftRing(circ(t.rTop, 22), t.cx, t.cy),
    inner: shiftRing(circ(t.rTop - 1.6, 22), t.cx, t.cy),
    el: solid(g),
    dot: flatDot(g, C, 1.4, idx === 1 ? 'dot' : 'dot m'),
    sp: spring(t.hRest, { eps: 0.04 }),
    drawn: NaN,
  }));

  let active = -1;
  function pick(sx, sy) {
    let best = -1, bestD = 1e9;
    for (let i = 0; i < tambores.length; i++) {
      const t = tambores[i];
      const w = unproj(C, sx, sy, t.hRest);
      const d = Math.hypot(w[0] - t.cx, w[1] - t.cy);
      if (d < 22 && d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function retarget(next) {
    if (next === active) return;
    active = next;
    for (let i = 0; i < tambores.length; i++) {
      const t = tambores[i];
      t.sp.t = active === i ? t.hRest + 12 : t.hRest;
    }
    read.textContent = active >= 0 ? tambores[active].label : 'bullerengue';
    B.wake();
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (let i = 0; i < tambores.length; i++) {
      const t = tambores[i];
      if (stepS(t.sp, dt)) m = true;
      const z = Math.max(4, t.sp.x);
      if (z !== t.drawn) {
        t.drawn = z;
        const silD = poly(hull(ringAt(P, t.foot, 0).concat(ringAt(P, t.top, z))));
        const crD = open(ringAt(P, run(t.inner, front), z));
        put(t.el, { sil: silD, crease: crD });
        place(t.dot, P(t.cx, t.cy, z));
      }
      const hi = active >= 0 ? active === i : i === 1;
      t.el.sil.classList.toggle('hi', hi);
      t.dot.setAttribute('class', hi ? 'dot' : 'dot m');
    }
    ruedaDots.forEach((d, k) => {
      d.setAttribute('class', active >= 0 ? (k % 2 === 0 ? 'dot' : 'dot m') : k % 2 === 0 ? 'dot m' : 'dot off');
    });
    return m;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => retarget(pick(pt[0], pt[1])),
    leave: () => retarget(-1),
  }));
  const tp = tour(stage, [[175, 138], [210, 128], [198, 178], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'bullerengue';

  return { destroy: bag.dispose };
}

const MOUNTERS = {
  corregimientos: mountCorregimientos,
  patrimonio: mountPatrimonio,
  talleres: mountTalleres,
  memorias: mountMemorias,
  juego: mountMemorias,
};

export default function TierraBombaHairline({ variant = 'corregimientos', onSelect, className = '' }) {
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const readRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const read = readRef.current;
    if (!stage || !svg || !read) return undefined;

    inject(document);
    const fn = MOUNTERS[variant] || mountCorregimientos;
    const inst = fn({ stage, svg, read }, onSelect);
    return () => inst?.destroy?.();
  }, [variant, onSelect]);

  return (
    <div
      className={`relative rounded-xl border border-white/10 bg-[#0b1016]/85 overflow-hidden ${className}`}
    >
      <div
        ref={stageRef}
        data-hairline=""
        data-hairline-theme="dark"
        className="w-full max-h-[11rem] mx-auto"
        style={{ '--hl-plate': '#0b1016' }}
      >
        <svg ref={svgRef} viewBox="0 0 400 320" aria-hidden="true" />
        <span
          ref={readRef}
          className="absolute bottom-1.5 right-2.5 text-[10px] font-mono tracking-wider uppercase text-white/55 pointer-events-none"
        >
          rest
        </span>
      </div>
    </div>
  );
}
