/**
 * @module viz-unwrapped-rays
 * @fileoverview Static reference record for the /viz-unwrapped-rays
 * visualization page (imp-2914).
 *
 * The page renders the prime phase rays theta = t * log(p) in a flat
 * 2D strip with log(p) on x and t on y. In "unwrapped" mode the raw
 * phase value grows linearly (no mod 2pi). In "folded" mode the phase
 * is taken mod 2pi, showing the same cyclic structure as the cylinder
 * unrolled view (VizPhaseCylinderPage). Caustic crossings — heights t
 * where two prime rays are in phase mod 2pi — are marked as short
 * horizontal segments connecting the resonant prime pair.
 *
 * Resonance condition: t * log(p_i/p_j) = 2 * pi * k => t = 2*pi*k / log(p_i/p_j)
 *
 * @see imp-2914
 * @see src/pages/VizUnwrappedRaysPage.jsx (renderer)
 * @see src/pages/VizPhaseCylinderPage.jsx (cylinder complement)
 */

export const VIZ_UNWRAPPED_RAYS = Object.freeze({
  ticketId: 'imp-2914',
  routePath: '/viz-unwrapped-rays',
  title: 'Unwrapped Prime Phase Rays',
  description:
    'Flat (log p on x, t on y) strip showing the prime phase rays ' +
    'theta = t * log(p). In unwrapped mode the raw phase grows ' +
    'linearly; in folded mode the phase is taken mod 2*pi, revealing ' +
    'the same modular structure that wraps onto the phase cylinder. ' +
    'Caustic crossings are heights t where two prime rays are in phase ' +
    'mod 2*pi, satisfying t = 2*pi*k / log(p_i / p_j).',

  mathFormula: Object.freeze({
    ray:      '\\theta_p(t) = t \\cdot \\log p',
    folded:   '\\theta_p(t) \\bmod 2\\pi',
    resonance:'t = \\dfrac{2\\pi k}{\\log(p_i / p_j)}, \\quad k \\in \\mathbb{Z}',
  }),

  parameterRanges: Object.freeze({
    tMin: 5,
    tMax: 60,
    nPrimesDefault: 30,
    nPrimesMin: 5,
    nPrimesMax: 80,
  }),

  honestCeiling:
    'Exploratory geometric visualization. Re-derives only the ' +
    'resonance condition t*log(p_i/p_j)=2*pi*k. Does NOT prove RH, ' +
    'does NOT produce a new Lambda bound, does NOT beat ' +
    'Platt-Trudgian Lambda <= 0.2.',

  relatedPages: Object.freeze([
    Object.freeze({ route: '/viz-phase-cylinder', label: 'Phase Cylinder: Unwrapped Rays' }),
    Object.freeze({ route: '/viz-caustic-resonance', label: 'Caustic Resonance Overlay' }),
    Object.freeze({ route: '/viz-prime-caustic', label: 'Prime Caustic' }),
    Object.freeze({ route: '/viz-prime-phase-crystal', label: 'Prime Phase Crystal' }),
  ]),
});

export const VIZ_UNWRAPPED_RAYS_ASSERTIONS = [
  {
    id: 'imp2914-record-frozen-and-route-pinned',
    holds: () =>
      Object.isFrozen(VIZ_UNWRAPPED_RAYS) &&
      VIZ_UNWRAPPED_RAYS.ticketId === 'imp-2914' &&
      VIZ_UNWRAPPED_RAYS.routePath === '/viz-unwrapped-rays' &&
      typeof VIZ_UNWRAPPED_RAYS.title === 'string' &&
      VIZ_UNWRAPPED_RAYS.title.toLowerCase().includes('unwrapped'),
    why:
      'VIZ_UNWRAPPED_RAYS must be a frozen record with the correct ' +
      'ticket id, the routePath /viz-unwrapped-rays, and a title ' +
      'mentioning "unwrapped". Drift here breaks the nav-link wired ' +
      'into App.jsx.',
  },
  {
    id: 'imp2914-math-formula-has-resonance',
    holds: () => {
      const f = VIZ_UNWRAPPED_RAYS.mathFormula;
      return (
        f &&
        typeof f.ray === 'string' && f.ray.includes('\\log') &&
        typeof f.folded === 'string' && f.folded.includes('2\\pi') &&
        typeof f.resonance === 'string' && f.resonance.includes('\\log')
      );
    },
    why:
      'mathFormula must carry KaTeX strings for the ray equation ' +
      '(log p), the folded form (mod 2*pi), and the resonance ' +
      'condition (log ratio). Missing any breaks the formula card ' +
      'the page renders.',
  },
  {
    id: 'imp2914-parameter-ranges-sane',
    holds: () => {
      const p = VIZ_UNWRAPPED_RAYS.parameterRanges;
      return (
        p &&
        p.tMin >= 0 && p.tMax > p.tMin &&
        p.nPrimesDefault >= 5 &&
        p.nPrimesMin <= p.nPrimesDefault &&
        p.nPrimesDefault <= p.nPrimesMax
      );
    },
    why:
      'parameterRanges must have tMin < tMax, and nPrimesDefault ' +
      'within [nPrimesMin, nPrimesMax]. Used by the page to set ' +
      'initial slider values.',
  },
  {
    id: 'imp2914-related-pages-includes-phase-cylinder',
    holds: () => {
      const rel = VIZ_UNWRAPPED_RAYS.relatedPages;
      if (!Array.isArray(rel) || rel.length < 2) return false;
      const routes = rel.map(r => r.route);
      return routes.includes('/viz-phase-cylinder');
    },
    why:
      'relatedPages must cross-link the phase cylinder (the cylinder ' +
      'complement of this flat view). Removing it breaks the ' +
      'phase-cylinder <-> unwrapped-rays pairing.',
  },
  {
    id: 'imp2914-honest-ceiling-present',
    holds: () =>
      typeof VIZ_UNWRAPPED_RAYS.honestCeiling === 'string' &&
      VIZ_UNWRAPPED_RAYS.honestCeiling.includes('Lambda'),
    why:
      'honestCeiling must explicitly mention Lambda so any reader ' +
      'of the data module sees the anti-overclaim guardrail.',
  },
];
