import { useEffect, useRef, useState } from 'react';

// Vite needs each dynamic import() call site to be statically analyzable to
// code-split it into its own chunk, so each supported effect gets its own
// literal import() rather than a templated path built from a variable.
const LOADERS = {
  waves: () => import('vanta/dist/vanta.waves.min'),
  fog: () => import('vanta/dist/vanta.fog.min'),
};

// Mounts a Vanta.js effect on the given ref, dynamically importing vanta +
// three so the ~600kb three.js chunk only ever loads on pages that actually
// use it. Skips initialization entirely when the visitor prefers reduced
// motion, or on failure — callers should render a plain static background as
// a fallback while `ready` is false.
export function useVantaEffect({ enabled = true, effect = 'waves', options } = {}) {
  const ref = useRef(null);
  const effectRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const loadEffect = LOADERS[effect] || LOADERS.waves;
        const [{ default: createEffect }, THREE] = await Promise.all([loadEffect(), import('three')]);
        if (cancelled || !ref.current) return;
        effectRef.current = createEffect({ el: ref.current, THREE, ...options });
        setReady(true);
      } catch {
        // Vanta/three failed to load — fall back to the static background.
      }
    })();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, effect]);

  return { ref, ready };
}
