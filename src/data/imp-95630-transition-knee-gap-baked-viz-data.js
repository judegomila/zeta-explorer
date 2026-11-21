/**
 * @module imp-95630-transition-knee-gap-baked-viz-data
 *
 * imp-95630 (content, low): imp-95598 computed the transition-vs-knee gap (log10 N_knee -
 * log10 N_cross) under +/-50% single-parameter sweeps of the two literals it rests on, E_trunc
 * (3.06e-5, imp-2631) and C_C_PINNED ((1/8) sqrt(3 pi), imp-2714), but only as a live root-find at
 * import (bisection over p double-prime(ln N) = 0 plus a fixed-point crossover iteration). This
 * module BAKES those same seven-rung sweeps as import-light reference literals -- no
 * effectiveHeightForN / C_C_PINNED live import chain, no quadrature at import -- for a future
 * robustness chart (bar or line plot of gap vs multiplier for each of the two literals, against
 * the base gap ~0.01315).
 *
 * PROVENANCE: every literal below is the exact eTruncSweep / cCSweep output of
 * IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS, reproduced here as plain numbers (imp-95598 is the
 * live source of truth; this module does not re-derive or alter the model).
 *
 * IMPORT-LIGHT / MEASUREMENT ONLY. Baked literals, no live quadrature, does NOT import the ~16.7MB
 * zeros bundle. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95598-transition-knee-ordering-robustness (live source: F1 band-robustness sweep baked here)
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (F3 transition-precedes-knee ordering)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee)
 * Ticket: imp-95630 (content, low). Import-light bake for a future robustness chart.
 */

// Base landmark pair (imp-95598 base block, at mult = 1x for both literals).
export const IMP95630_BASE = {
  A_base: 12540.768,
  log10N_cross: 9.51591,
  log10N_knee: 9.52906,
  gap: 0.01315,
};

// +/-50% band, seven rungs, E_trunc swept alone (C_C held at C_C_PINNED).
export const IMP95630_E_TRUNC_SWEEP = [
  { mult: 0.5, cross: 10.14573, gap: 0.013731, precedes: true },
  { mult: 0.7, cross: 9.84022, gap: 0.013542, precedes: true },
  { mult: 0.85, cross: 9.66374, gap: 0.013362, precedes: true },
  { mult: 1.0, cross: 9.51591, gap: 0.01315, precedes: true },
  { mult: 1.15, cross: 9.3887, gap: 0.012916, precedes: true },
  { mult: 1.3, cross: 9.27705, gap: 0.012662, precedes: true },
  { mult: 1.5, cross: 9.14665, gap: 0.012344, precedes: true },
];

// +/-50% band, seven rungs, C_C swept alone (E_trunc held at E_TRUNC_PT).
export const IMP95630_C_C_SWEEP = [
  { mult: 0.5, cross: 8.88423, gap: 0.000071, precedes: true },
  { mult: 0.7, cross: 9.19112, gap: 0.008512, precedes: true },
  { mult: 0.85, cross: 9.36798, gap: 0.011436, precedes: true },
  { mult: 1.0, cross: 9.51591, gap: 0.01315, precedes: true },
  { mult: 1.15, cross: 9.64305, gap: 0.014197, precedes: true },
  { mult: 1.3, cross: 9.75451, gap: 0.014876, precedes: true },
  { mult: 1.5, cross: 9.88454, gap: 0.015421, precedes: true },
];

export const IMP95630_BAND_ALL_PRECEDE = true;

// Inversion edge (imp-95598 F3): the C_C route inverts (gap crosses zero) at ~0.499x pinned, a ~2x
// safety margin from the base rung; the E_trunc route never inverts within [1x, 8x].
export const IMP95630_INVERSION_EDGE = {
  cC_invert_multiplier: 0.49893,
  cC_safety_margin: 2.004,
  log10N_cross_at_inversion: 8.88227,
  eTrunc_8x_still_precedes: true,
};

const gapRange = (rows) => {
  const gaps = rows.map((r) => r.gap);
  return { min: Math.min(...gaps), max: Math.max(...gaps) };
};
const E_TRUNC_GAP_RANGE = gapRange(IMP95630_E_TRUNC_SWEEP);
const C_C_GAP_RANGE = gapRange(IMP95630_C_C_SWEEP);

export const IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA = {
  id: 'imp-95630',
  proofSection: 'S-frontier',
  question:
    'Bake the imp-95598 transition-vs-knee gap sweeps (E_trunc and C_C_PINNED, both +/-50%) as ' +
    'import-light reference literals for a future robustness chart, without re-running the ' +
    'knee/crossover quadrature at import. Content bake only; NOT an RH bound; no QED.',
  base: IMP95630_BASE,
  eTruncSweep: IMP95630_E_TRUNC_SWEEP,
  cCSweep: IMP95630_C_C_SWEEP,
  bandAllPrecede: IMP95630_BAND_ALL_PRECEDE,
  inversionEdge: IMP95630_INVERSION_EDGE,
  gapRanges: {
    eTrunc: { min: E_TRUNC_GAP_RANGE.min, max: E_TRUNC_GAP_RANGE.max },
    cC: { min: C_C_GAP_RANGE.min, max: C_C_GAP_RANGE.max },
  },
  isRigorous: false,
  verdict:
    'CONTENT BAKE (measurement, NOT rigorous). Reproduces the imp-95598 F1 finding as import-light ' +
    'literals: the transition-before-knee ordering (gap > 0) holds across every +/-50% single-' +
    'parameter rung of both E_trunc and C_C_PINNED, with gap staying in [' +
    E_TRUNC_GAP_RANGE.min +
    ', ' +
    E_TRUNC_GAP_RANGE.max +
    '] over the E_trunc band and [' +
    C_C_GAP_RANGE.min +
    ', ' +
    C_C_GAP_RANGE.max +
    '] over the C_C band, versus the base 0.01315. No bound moved, no operator positivity ' +
    'established, no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95598 (live source of every literal baked here); imp-95582 (F3 ordering); imp-34694 ' +
    '(ramp-acceleration knee); imp-2631 (E_trunc floor); imp-2714 (C_C_PINNED).',
};

export const IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA_ASSERTIONS = [
  {
    // Baked sweeps reproduce the imp-95598 F1 band-robustness finding: gap > 0 everywhere, 7 rungs each.
    id: 'imp95630-baked-sweeps-match-imp95598-band-robustness',
    description: 'both baked sweeps have 7 rungs, all precedes true, base gap matches imp-95598 ~0.01315',
    holds: () =>
      IMP95630_E_TRUNC_SWEEP.length === 7 &&
      IMP95630_C_C_SWEEP.length === 7 &&
      IMP95630_E_TRUNC_SWEEP.every((r) => r.precedes && r.gap > 0) &&
      IMP95630_C_C_SWEEP.every((r) => r.precedes && r.gap > 0) &&
      Math.abs(IMP95630_BASE.gap - 0.01315) < 1e-6,
  },
  {
    // Base rung (mult 1.0) of each sweep matches the base block exactly (internal consistency of the bake).
    id: 'imp95630-mult1-rungs-match-base',
    description: 'the mult=1.0 rung of each sweep equals IMP95630_BASE cross/gap exactly',
    holds: () => {
      const et1 = IMP95630_E_TRUNC_SWEEP.find((r) => r.mult === 1.0);
      const cc1 = IMP95630_C_C_SWEEP.find((r) => r.mult === 1.0);
      return (
        et1.cross === IMP95630_BASE.log10N_cross &&
        et1.gap === IMP95630_BASE.gap &&
        cc1.cross === IMP95630_BASE.log10N_cross &&
        cc1.gap === IMP95630_BASE.gap
      );
    },
  },
  {
    // Inversion edge (F3): C_C route inverts near 0.499x (~2x safety margin); E_trunc route never
    // inverts within [1x, 8x] -- matches imp-95598's asymmetric-literal finding.
    id: 'imp95630-inversion-edge-matches-imp95598',
    description: 'cC_invert_multiplier in (0.45, 0.55), safety margin ~2x, eTrunc 8x still precedes',
    holds: () =>
      IMP95630_INVERSION_EDGE.cC_invert_multiplier > 0.45 &&
      IMP95630_INVERSION_EDGE.cC_invert_multiplier < 0.55 &&
      IMP95630_INVERSION_EDGE.cC_safety_margin > 1.8 &&
      IMP95630_INVERSION_EDGE.cC_safety_margin < 2.2 &&
      IMP95630_INVERSION_EDGE.eTrunc_8x_still_precedes === true,
  },
  {
    // Honesty gate: content bake only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95630-honesty-gate-no-qed',
    description: 'Content bake only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA.isRigorous === false &&
      /NO QED/.test(IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA.verdict),
  },
];

for (const a of IMP95630_TRANSITION_KNEE_GAP_BAKED_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95630-transition-knee-gap-baked-viz-data assertion failed: ${a.id}`);
  }
}
