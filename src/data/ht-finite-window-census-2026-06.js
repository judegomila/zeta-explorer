/**
 * @module ht-finite-window-census-2026-06
 * @fileoverview
 * Data backing the "H_t Finite-Window Census" page (route /ht-window-census).
 *
 * The capstone of the de Bruijn–Newman corridor track in the sister
 * twin_ladder_rh_repo engine: the 8 per-cell corridor certificates
 * (/ht-corridor-certificates) prove ONE zero each; this census proves there
 * are NO OTHER zeros anywhere in the window, upgrading the result to an EXACT
 * count — H_{0.18} has exactly 8 zeros in [0, 86.792] × [−η, η], all real.
 *
 * It also records the two NEGATIVE results that bound the method: a sharper
 * (van der Corput) error bound is not the lever, and normalized-cell geometry
 * does not bound the true Rouché ratio. Together they close the corridor route
 * to a new Λ record — proved, not assumed.
 *
 * Exports:
 *   - censusMeta        — config (t, η, window, mesh, E, box count, runtime).
 *   - censusGaps        — the 8 inter-corridor gaps certified zero-free.
 *   - exactCount        — the argument-principle exact counter + validation.
 *   - crossChecks       — three independent confirmations of "exactly 8".
 *   - negativeResults   — vdC E-bound + normalized-geometry verdicts.
 *   - vTrueScaling      — measured V_true (fixed vs normalized) vs γ.
 *   - scopeAssessment   — honest does / does-not assessment.
 *   - crossLinks        — in-app navigation links.
 *
 * Source repo: ~/Downloads/twin_ladder_rh_repo, branch exp/corridor-audit-v0.
 * Key docs: docs/ht_finite_window_method.md (consolidated writeup),
 *           docs/ht_window_census_results.md, docs/vdc_E_bound_study.md,
 *           docs/normalized_geometry_result.md.
 */

export const censusMeta = Object.freeze({
  title: 'H_t Finite-Window Census — exactly 8 zeros, all real',
  date: '2026-06',
  t: 0.18,
  eta: 0.14142,
  windowReLo: 0.0,
  windowReHi: 86.792,
  meshStep: 0.0015625,
  E: 1.816e-16,
  nGaps: 8,
  totalBoxes: 10815,
  runtimeSeconds: 45,
  engineModulus:
    'Unconditional modulo python-flint ball arithmetic, the closed-form ' +
    'Φ-derivatives in the bounds, and the Peano-verified quintic-Hermite ' +
    'value-error constant 1/46080. No GRH, no Riemann-hypothesis input, ' +
    'no floating-point sampling enters the conclusion.',
});

// The 8 inter-corridor gaps, each certified |H_t| > 0 throughout the full
// strip [−η, η]. boxes = adaptive box count; worstMargin = smallest certified
// |H_t| lower bound on that gap (shrinks with x as |G| ~ e^{−πx/8}).
export const censusGaps = Object.freeze([
  { reLo: 0.0,    reHi: 27.945, boxes: 558,  worstMargin: 7.236e-6  },
  { reLo: 28.385, reHi: 41.688, boxes: 266,  worstMargin: 8.338e-8  },
  { reLo: 42.128, reHi: 49.696, boxes: 151,  worstMargin: 4.454e-9  },
  { reLo: 50.136, reHi: 60.459, boxes: 220,  worstMargin: 9.258e-11 },
  { reLo: 60.899, reHi: 65.566, boxes: 183,  worstMargin: 8.498e-12 },
  { reLo: 66.006, reHi: 74.802, boxes: 737,  worstMargin: 5.592e-14 },
  { reLo: 75.242, reHi: 81.464, boxes: 2204, worstMargin: 2.564e-16 },
  { reLo: 81.904, reHi: 86.352, boxes: 6496, worstMargin: 1.526e-16 },
]);

export const exactCount = Object.freeze({
  title: 'Independent exact count by the argument principle',
  body:
    'rigorous_zero_count_Ht counts the zeros in any rectangle directly as the ' +
    'winding number of H_t around its boundary (H_t is entire, so the winding ' +
    'equals the enclosed zero count). The winding is certified by a LOCAL ' +
    'discrete-argument bound — each segment uses its own field magnitude |c_i| ' +
    'rather than a single global minimum, essential when |G| spans orders of ' +
    'magnitude around the contour. A hybrid enclosure is used: direct interval ' +
    'quadrature of H_t below x = 10 (where the bridge 1/zᵏ form is singular), ' +
    'and the Lipschitz-and-net bridge bound above.',
  windingRule:
    String.raw`\bigl|\mathrm{Arg}(c_{i+1}/c_i)\bigr| + \arcsin\!\frac{r_i}{|c_i|} + \arcsin\!\frac{r_{i+1}}{|c_{i+1}|} < \pi`,
  validation:
    'Validated on the hardest regime — the window [73, 89] enclosing cells ' +
    '6, 7, 8 (boundary |G| down to ~2e-14) returns count = 3, certified, at ' +
    'the census mesh.',
});

export const crossChecks = Object.freeze([
  {
    title: 'Two independent implementations',
    detail:
      'The original per-cell acb evaluator and the ~25× faster collapsed ' +
      'polynomial evaluator agree on all 8 cells (windings, m, V); the fast ' +
      'derivative-bound m is equal-or-tighter everywhere.',
  },
  {
    title: 'Real-axis sign count',
    detail:
      'H_{0.18} restricted to the real axis has exactly 8 sign changes, at ' +
      'the 8 cell centers (28.17, 41.91, 49.92, 60.68, 65.79, 75.03, 81.69, 86.58).',
  },
  {
    title: 'Argument-principle count',
    detail:
      'rigorous_zero_count_Ht independently returns the same counts via the ' +
      'winding number (e.g. [73, 89] → 3), with no reference to the per-cell ' +
      'decomposition.',
  },
]);

export const negativeResults = Object.freeze({
  title: 'Why the corridor route does not reach a Λ record (proved, not assumed)',
  intro:
    'The method certifies any finite window, but per-cell cost grows ' +
    'exponentially in height and the Rouché ratio cannot be held below 1 ' +
    'uniformly. Two experiments pin down exactly why — neither knob works.',
  items: [
    {
      id: 'vdc',
      title: 'The error bound is not the lever (van der Corput study)',
      detail:
        'The true error |H_t − G_t| decays only ~e^{−0.24γ} while m = inf|G| ' +
        'decays ~e^{−0.34γ}, so the TRUE Rouché ratio V_true = |H−G|/m itself ' +
        'grows ~e^{+0.10γ}. No oscillation-aware (van der Corput) majorant ' +
        'escapes this: at fixed geometry the obstruction is intrinsic, not ' +
        'slack in the bound. A sharper bound is "only" a ~10⁸× compute win.',
    },
    {
      id: 'normalized',
      title: 'Normalized-cell geometry does not bound V_true either',
      detail:
        'Shrinking the corridor with the analytic conductor (h, η ~ 1/L(γ), ' +
        'L = log(1+γ)) gives the SAME growth rate as fixed geometry ' +
        '(e^{+0.185γ} vs e^{+0.186γ}); at high γ the thinner cell is marginally ' +
        'worse. V_true crosses 1 near γ ≈ 118 under both. Log-conductor ' +
        'shrinkage (~30% over the range) is far too weak to offset the growth.',
    },
  ],
});

// Measured V_true on the cell boundary, fixed vs analytic-conductor-normalized
// geometry, anchored to coincide at cell 1. Both grow; normalization does not help.
export const vTrueScaling = Object.freeze([
  { cell: 1,  gamma: 28.17,  vFixed: 3.53e-8, vNormalized: 3.53e-8 },
  { cell: 4,  gamma: 60.68,  vFixed: 3.73e-6, vNormalized: 3.67e-6 },
  { cell: 8,  gamma: 86.57,  vFixed: 3.78e-5, vNormalized: 4.12e-5 },
  { cell: 10, gamma: 99.47,  vFixed: 9.63e-4, vNormalized: 1.27e-3 },
  { cell: 12, gamma: 112.73, vFixed: 4.57e-2, vNormalized: 5.89e-2 },
  { cell: 13, gamma: 118.50, vFixed: 3.22e0,  vNormalized: 1.90e0  },
]);

export const scopeAssessment = Object.freeze({
  title: 'Honest scope',
  does: [
    'Establishes, unconditionally (modulo the engine trust statement), that ' +
      'H_{0.18} has EXACTLY 8 zeros in [0, 86.792] × [−η, η], all real.',
    'Demonstrates a complete, locally-checkable, exactly-counted finite-window ' +
      'certification toolkit in the correct (Polymath15/Tao) normalization.',
    'Provides an independent argument-principle exact counter for any window.',
  ],
  doesNot: [
    'Does NOT establish Λ ≤ 0.19. The Newman-flow conclusion needs the strip ' +
      'certified for ALL x up to Polymath15’s analytic-tail handoff at ' +
      'x ≈ 2×10¹³ — eleven orders of magnitude beyond this window.',
    'Does NOT scale to a Λ record by corridors on this surrogate: V_true ' +
      'diverges in γ and neither the error bound nor the cell geometry bounds it.',
  ],
  openDirection:
    'The divergence of V_true is a property of THIS surrogate (the quintic ' +
    'kernel bridge), not a theorem about all surrogates. Whether a different, ' +
    'tractable holomorphic surrogate admits a uniformly bounded V_true is open — ' +
    'the only identified path beyond a finite window.',
});

export const crossLinks = Object.freeze([
  { label: 'H_t Corridor Certificates (the per-cell certificates)', to: '/ht-corridor-certificates' },
  { label: 'Λ Bounds & RH Roadmap', to: '/lambda-bounds' },
  { label: 'Twin-ladder paper §14.18–14.20', to: '/paper' },
  { label: 'Rigorous Numerics stages (§20)', to: '/rigorous-numerics-stages' },
]);
