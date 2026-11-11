import React, { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

// Aparece (sube y se desvanece) al entrar en pantalla.
// Con scroll-driven animations (CSS puro) cuando el navegador las soporta; si no, IntersectionObserver.
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const native = useRef(supportsScrollTimeline() && !prefersReduced()).current;
  const [shown, setShown] = useState(prefersReduced());

  useEffect(() => {
    const el = ref.current;
    if (!el || shown || native) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${native ? 'reveal-sd' : shown ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// Cuenta desde 0 hasta el valor cuando es visible.
export function CountUp({ to, decimals = 0, duration = 1400, format }) {
  const ref = useRef(null);
  const [val, setVal] = useState(prefersReduced() ? to : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(to * eased);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const shown = format
    ? format(val)
    : val.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref}>{shown}</span>;
}

