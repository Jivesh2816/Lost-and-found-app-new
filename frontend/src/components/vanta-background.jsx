import { useVantaEffect } from '@/hooks/use-vanta-effect';
import { cn } from '@/lib/utils';

const WAVES_OPTIONS = {
  color: 0x15120a,
  shininess: 6,
  waveHeight: 14,
  waveSpeed: 0.7,
  zoom: 1.8,
  backgroundColor: 0x0a0a0b,
};

const FOG_OPTIONS = {
  highlightColor: 0x3a2e0d,
  midtoneColor: 0x1a1408,
  lowlightColor: 0x0a0a0b,
  baseColor: 0x0a0a0b,
  blurFactor: 0.7,
  speed: 1.1,
  zoom: 0.7,
};

const PRESETS = { waves: WAVES_OPTIONS, fog: FOG_OPTIONS };

// Renders a static gold/black gradient underneath at all times, and layers a
// live Vanta effect on top once it's loaded — so there's never a blank
// flash, and prefers-reduced-motion / a failed dynamic import both degrade
// to just the gradient with zero layout shift. Kept off content-dense pages
// by default (card grids, forms) and used sparingly on hero-style sections.
export function VantaBackground({ effect = 'waves', options, className, children }) {
  const { ref, ready } = useVantaEffect({
    effect,
    options: { ...PRESETS[effect], ...options },
  });

  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.22_0.02_90),_oklch(0.06_0.005_90)_60%)] transition-opacity duration-700',
          ready && 'opacity-0',
        )}
      />
      <div ref={ref} aria-hidden className="absolute inset-0 -z-10" />
      {children}
    </div>
  );
}
