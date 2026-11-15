import React, { useEffect, useRef } from 'react';
import HL from '../utils/hairlineKernel.js';

const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad,
  ringAt, rings, rrect, run, seg, spring, stepS, tset, tval, tween, unproj,
  disposer, flatDot, inject, mk, place, pointer, put, reflect, register, solid, tour,
} = HL;

const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/* 1. CORREGIMIENTOS: 4 placas isométricas escalonadas sobre zócalo insular */
function mountCorregimientos({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.56);
  const items = [
    { id: 'puntaArena', label: 'punta arena', x0: 4, y0: 4, x1: 62, y1: 52, z0: 4, z1: 12 },
    { id: 'canoDeLoro', label: 'caño de loro', x0: 70, y0: 10, x1: 128, y1: 58, z0: 4, z1: 15 },
    { id: 'tierraBomba', label: 'tierra bomba', x0: 8, y0: 62, x1: 72, y1: 118, z0: 4, z1: 18 },
    { id: 'bocachica', label: 'bocachica', x0: 78, y0: 66, x1: 136, y1: 124, z0: 4, z1: 22 },
  ];
  fit(C, [[0, 0, -4], [142, 130, -4], [142, 0, 0], [0, 130, 0], [78, 66, 40]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  const [pr, pi] = rings(-4, -4, 142, 130, 8, 2.0);
  reflect(svg, g, P, front, pr, 0, 12);
  put(solid(g), prism(P, front, pr, pi, -5, 0));

  const plates = items.map((it, idx) => {
    const [ring, inner] = rings(it.x0, it.y0, it.x1, it.y1, 5, 1.4);
    const el = solid(g);
    const dot = flatDot(g, C, 1.4, idx === 3 ? 'dot' : 'dot m');
    return { ...it, idx, ring, inner, el, dot, tw: tween(it.z1), drawn: NaN };
  });

  let active = -1;
  function pick(sx, sy) {
    let best = -1, bestD = 1e9;
    for (let i = 0; i < plates.length; i++) {
      const p = plates[i];
      const w = unproj(C, sx, sy, p.z1);
      const cx = (p.x0 + p.x1) / 2, cy = (p.y0 + p.y1) / 2;
      if (w[0] >= p.x0 - 4 && w[0] <= p.x1 + 4 && w[1] >= p.y0 - 4 && w[1] <= p.y1 + 4) {
        const d = Math.hypot(w[0] - cx, w[1] - cy);
        if (d < bestD) { bestD = d; best = i; }
      }
    }
    return best;
  }

  function applyTarget(next, now) {
    if (next === active) return;
    active = next;
    const anchor = active >= 0 ? active : 3;
    for (let i = 0; i < plates.length; i++) {
      const p = plates[i];
      const lift = active === i ? p.z1 + 14 : active >= 0 ? p.z1 - 1.5 : p.z1;
      tset(p.tw, lift, now, Math.abs(i - anchor) * 42);
    }
    read.textContent = active >= 0 ? plates[active].label : 'rest';
    B.wake();
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (let i = 0; i < plates.length; i++) {
      const p = plates[i];
      const z = tval(p.tw, now);
      if (Math.abs(z - p.tw.to) > 0.05) moving = true;
      if (z !== p.drawn) {
        p.drawn = z;
        put(p.el, prism(P, front, p.ring, p.inner, p.z0, z));
        place(p.dot, P((p.x0 + p.x1) / 2, (p.y0 + p.y1) / 2, z));
      }
      const hi = active >= 0 ? active === i : i === 3;
      p.el.sil.classList.toggle('hi', hi);
      p.dot.setAttribute('class', hi ? 'dot' : 'dot m');
    }
    return moving;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => applyTarget(pick(pt[0], pt[1]), performance.now()),
    down: (pt) => {
      const idx = pick(pt[0], pt[1]);
      if (idx >= 0 && onSelect) onSelect(plates[idx].id);
    },
    leave: () => applyTarget(-1, performance.now()),
  }));
  const tp = tour(stage, [[145, 130], [210, 120], [175, 195], [248, 205], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';

  return { destroy: bag.dispose };
}

/* 2. PATRIMONIO: Fuerte de San Fernando (batería en herradura + baluarte + muelle) */
function mountPatrimonio({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.54);
  fit(C, [[-12, -10, -4], [140, 118, -4], [140, -10, 0], [-12, 118, 0], [50, 50, 48]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk('g', {}, svg);
  const [baseR, baseI] = rings(-8, -8, 136, 112, 10, 2.0);
  reflect(svg, g, P, front, baseR, 0, 12);
  put(solid(g), prism(P, front, baseR, baseI, -5, 0));

  const parts = [
    { id: 'sanJose', label: 'batería', cx: 34, cy: 52, z0: 0, zRest: 22, ring: circ(26, 28).map((q) => ({ ...q, u: q.u + 34, v: q.v + 52 })), inner: circ(23.6, 28).map((q) => ({ ...q, u: q.u + 34, v: q.v + 52 })) },
    { id: 'cascoHistorico', label: 'baluarte', cx: 88, cy: 48, z0: 0, zRest: 18, ...(() => { const [r, i] = rings(64, 24, 112, 74, 4, 1.6); return { ring: r, inner: i }; })() },
    { id: 'sanFernando', label: 'muelle', cx: 108, cy: 92, z0: 0, zRest: 10, ...(() => { const [r, i] = rings(82, 82, 130, 102, 3, 1.3); return { ring: r, inner: i }; })() },
  ].map((p, idx) => ({ ...p, idx, el: solid(g), dot: flatDot(g, C, 1.4, idx === 0 ? 'dot' : 'dot m'), sp: spring(p.zRest, { eps: 0.04 }), drawn: NaN }));

  let active = -1;
  function pick(sx, sy) {
    let best = -1, bestD = 1e9;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const w = unproj(C, sx, sy, p.zRest);
      const d = Math.hypot(w[0] - p.cx, w[1] - p.cy);
      if (d < 34 && d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function retarget(next) {
    if (next === active) return;
    active = next;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.sp.t = active === i ? p.zRest + 15 : active >= 0 ? p.zRest - 1.5 : p.zRest;
    }
    read.textContent = active >= 0 ? parts[active].label : 'rest';
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
  const tp = tour(stage, [[165, 145], [225, 138], [248, 210], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';

  return { destroy: bag.dispose };
}

/* 3. TALLERES Y VIERNES: Bandeja con 5 tarjetas de oficios y clases de los viernes (Riffle) */
function mountTalleres({ stage, svg, read }, onSelect) {
  const bag = disposer();
  const LABELS = [
    { id: 'carpinteria', label: 'carpintería' },
    { id: 'tallerPlastico', label: 'plástico' },
    { id: 'viveroManglar', label: 'vivero' },
    { id: 'colegioR9', label: 'colegio r9' },
    { id: 'viernes', label: 'viernes' },
  ];
  const N = LABELS.length, W = 84, H = 52, G = 16, TW = 22, TH = 7, TABS = [6, 31, 56], TK = 1.4;
  const REST = -12, BACK = -24, FWD = 20, LIFT = 16;
  const X0 = -5, X1 = W + 5, Y0 = -9, Y1 = (N - 1) * G + 9, WH = 19, WR = 6, WT = 2.4;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[X0, Y0, 0], [X1, Y1, -8], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, H + TH], [X1, Y0, H + TH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);

  const g = mk('g', {}, svg);
  reflect(svg, g, P, front, outer, 0, 12);
  const far = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), 'sil'],
    [poly(ringAt(P, inner, WH)), 'nf'],
    [open(ringAt(P, run(inner, (q) => !front(q)), 2.5)), 'nf lo'],
  ];
  for (const [d, cls] of far) mk('path', { d, class: cls }, g);

  const cards = LABELS.map((meta, i) => {
    const t0 = TABS[(N - 1 - i) % 3];
    const shape = fillet(
      [[0, 0], [W, 0], [W, H], [t0 + TW, H], [t0 + TW, H + TH], [t0, H + TH], [t0, H], [0, H]],
      [1, 1, 3.2, 1.8, 2.4, 2.4, 1.8, 3.2],
    );
    const grp = mk('g', {}, g);
    const back = mk('path', { class: 'lo' }, grp), face = mk('path', { class: 'sil' }, grp);
    const head = mk('path', { class: 'nf' }, grp), rules = mk('path', { class: 'nf lo' }, grp);
    const punch = [];
    for (let k = 0; k < 5; k++) punch.push(mk('circle', { r: 1.1, class: 'dot ' + (k === i ? 'm' : 'off') }, grp));
    return { ...meta, i, t0, shape, back, face, head, rules, punch, a: tween(REST), z: tween(0) };
  });

  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  const near = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), 'fo'],
    [open(oT), 'nf lo'],
    [open(iF), 'nf'],
    [open([oT[0], ...oB, oT[oT.length - 1]]), 'nf sil'],
  ];
  for (const [d, cls] of near) mk('path', { d, class: cls }, g);

  let active = -1;
  const bandY = cards.map((c) => P(W / 2, c.i * G + H * Math.sin(rad(REST)), H * Math.cos(rad(REST)))[1]);

  function pick(sx, sy) {
    if (sx < 110 || sx > 295) return -1;
    let best = -1, bestD = 24;
    for (let i = 0; i < cards.length; i++) {
      const d = Math.abs(sy - bandY[i]);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function apply(next, now) {
    if (next === active) return;
    active = next;
    const anchor = active >= 0 ? active : 2;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const delay = Math.abs(i - anchor) * 44;
      const th = active < 0 ? REST : i === active ? 0 : i < active ? BACK : FWD;
      const lift = active === i ? LIFT : 0;
      tset(c.a, th, now, delay);
      tset(c.z, lift, now, delay);
    }
    read.textContent = active >= 0 ? cards[active].label : 'rest';
    B.wake();
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const th = tval(c.a, now), lift = tval(c.z, now);
      if (Math.abs(th - c.a.to) > 0.05 || Math.abs(lift - c.z.to) > 0.05) moving = true;
      const yb = i * G, s = Math.sin(rad(th)), co = Math.cos(rad(th));
      const w = (u, v) => P(u, yb + v * s, v * co + lift);
      const wb = (u, v) => P(u, yb + v * s - TK * co, v * co + TK * s + lift);
      c.back.setAttribute('d', poly(c.shape.map((p) => wb(p[0], p[1]))));
      c.face.setAttribute('d', poly(c.shape.map((p) => w(p[0], p[1]))));
      c.head.setAttribute('d', seg(w(6, H - 10), w(W - 6, H - 10)));
      c.rules.setAttribute('d', [H - 18, H - 25, H - 32].map((v) => seg(w(6, v), w(W - 6, v))).join(''));
      for (let k = 0; k < 5; k++) {
        place(c.punch[k], w(c.t0 + 4 + k * 3.5, H + TH / 2));
        c.punch[k].setAttribute('class', k === i ? (active === i ? 'dot' : 'dot m') : 'dot off');
      }
      c.face.classList.toggle('hi', active >= 0 ? active === i : i === N - 1);
    }
    return moving;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (pt) => apply(pick(pt[0], pt[1]), performance.now()),
    down: (pt) => {
      const idx = pick(pt[0], pt[1]);
      if (idx >= 0 && cards[idx].id !== 'viernes' && onSelect) onSelect(cards[idx].id);
    },
    leave: () => apply(-1, performance.now()),
  }));
  const tp = tour(stage, [[185, 130], [195, 162], [205, 195], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';

  return { destroy: bag.dispose };
}

/* 4. JUEGO: Campo isométrico 6x6 del ecosistema insular (Terrain) */
function mountJuego({ stage, svg, read }) {
  const bag = disposer();
  const N = 6, CELL = 18, FOOT = 14, HMAX = 54, EXT = N * CELL, PB = 5;
  const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.68 : u <= 1 ? 0.32 - ((u - 0.42) / 0.58) * 0.22 : 0.1);

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-6, -6, -PB], [EXT + 6, EXT + 6, -PB], [EXT + 6, -6, -PB], [-6, EXT + 6, -PB], [0, 0, HMAX * 0.78]], 200, 166);
  const P = proj(C), front = facing(C);
  const R = 2.6 * CELL;
  let over = null;

  const g = mk('g', {}, svg), cols = [];
  const [pr, pi] = rings(-6, -6, EXT + 6, EXT + 6, 8, 2.0);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  for (let s = 0; s <= 2 * (N - 1); s++) {
    for (let i = 0; i < N; i++) {
      const j = s - i;
      if (j < 0 || j >= N) continue;
      const u = i / (N - 1), v = j / (N - 1);
      const h0 = 5 + 24 * Math.exp(-((u - 0.28) ** 2 + (v - 0.72) ** 2) / 0.09) + 12 * Math.exp(-((u - 0.78) ** 2 + (v - 0.24) ** 2) / 0.05);
      const x0 = i * CELL + (CELL - FOOT) / 2, y0 = j * CELL + (CELL - FOOT) / 2;
      const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.8, 0.9);
      cols.push({ i, j, h0, ring, inner, sp: spring(h0, { eps: 0.04 }), el: solid(g), drawn: NaN });
    }
  }

  const mark = mk('g', {}, g), md = [];
  for (let k = 0; k < 9; k++) md.push(flatDot(mark, C, 0.6, k === 4 ? 'dot' : 'dot m'));
  const peak = cols.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  const byCell = new Map();
  cols.forEach((c) => byCell.set(c.i + ',' + c.j, c));
  let mc = null, want = peak;

  function drawMark() {
    if (want !== mc) { mc = want; mc.el.g.after(mark); }
    const cx = (mc.i + 0.5) * CELL, cy = (mc.j + 0.5) * CELL, h = Math.max(0.6, mc.sp.x);
    md.forEach((el, k) => place(el, P(cx + ((k % 3) - 1) * 3.1, cy + (Math.floor(k / 3) - 1) * 3.1, h)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cols) {
      if (stepS(c.sp, dt)) m = true;
      const h = Math.max(0.6, c.sp.x);
      if (h !== c.drawn) {
        c.drawn = h;
        put(c.el, prism(P, front, c.ring, c.inner, 0, h));
        c.el.sil.classList.toggle('hi', h > HMAX * 0.5);
      }
    }
    drawMark();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const c of cols) {
      if (!over) { c.sp.t = c.h0; continue; }
      const dx = (c.i + 0.5) * CELL - over[0], dy = (c.j + 0.5) * CELL - over[1];
      c.sp.t = HMAX * falloff(Math.hypot(dx, dy) / R);
    }
    if (over) {
      const i = clamp(Math.floor(over[0] / CELL), 0, N - 1), j = clamp(Math.floor(over[1] / CELL), 0, N - 1);
      want = byCell.get(i + ',' + j);
      read.textContent = `zona ${i + 1}·${j + 1}`;
    } else {
      want = peak;
      read.textContent = 'rest';
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  const tp = tour(stage, [[160, 140], [235, 165], [190, 200], null]);
  bag.add(tp.stop);
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';

  return { destroy: bag.dispose };
}

const MOUNTERS = {
  corregimientos: mountCorregimientos,
  patrimonio: mountPatrimonio,
  talleres: mountTalleres,
  memorias: mountJuego,
  juego: mountJuego,
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
        className="w-full max-h-[10.5rem] mx-auto"
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
