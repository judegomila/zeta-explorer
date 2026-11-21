/**
 * @module imp-3578-nmax-exponent-wide-floor-grid
 *
 * imp-3578 (numerical, frontier-direction): imp-3462 derived the interior-max location exponent
 *   p = -dlnN_max/dlnE_trunc = -(l/(l-1)) dx/dlnE_trunc
 * as an explicit rational function of the peak log-derivatives of the imp-3220 sub-terms,
 * evaluated it on the imp-3443 HALF-to-DOUBLE floor grid (0.5x .. 2x the imp-2631 floor), and
 * reported the gentle drift 1.36 -> 1.39 there. THIS module re-evaluates the SAME closed (**)
 * exponent (re-solving the imp-3446 implicit stationarity root T0star at each floor) across a
 * WIDER E_trunc grid spanning 0.1x .. 10x the imp-2631 baseline floor E_trunc = 3.06e-5, LOCATES
 * where the local elasticity leaves the narrow imp-3462 [1.36, 1.39] band, and ASSESSES whether
 * p asymptotes to a limiting value as l = log(T0/2pi) grows or keeps drifting.
 *
 * WHAT IS RE-USED, UNCHANGED (imp-3446 / imp-3462)
 * ------------------------------------------------
 *   E_flow(x) = (l+1) L G / (2pi) e^(-x),  x = ln T0,  G = imp-3220 Gronwall prefactor,
 *   F(x, E_trunc) = E_flow A / (E_trunc + E_flow) - B,   A = 1/(l+1)+1/L-1, B = 1/(2L)-l/(2(l-1)),
 *   T0star = root of F = 0,  N_max = (T0/2pi)(l-1),
 *   p = -(l/(l-1)) dx/dlnE_trunc,  dx/dlnE_trunc = -(dF/dlnE_trunc)/(dF/dx),
 *   dF/dlnE_trunc = -E_trunc E_flow A / S^2,  S = E_trunc + E_flow,
 *   dF/dx = [E_flow(A^2+A-prime)S - E_flow^2 A^2]/S^2 - B-prime,
 *   A-prime = -1/(l+1)^2 - 1/L^2,  B-prime = -1/(2L^2) + 1/(2(l-1)^2).
 * The ONLY difference from imp-3462 is a WIDER root bracket (N in [1e2, 1e18], because the peak
 * N_max ranges from ~3.1e4 at the 10x floor to ~2.5e15 at the 1e-8x floor) and the wider grid.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (W1) DECADE-WIDE AGREEMENT. The closed (**) exponent agrees with a direct finite-difference
 *        elasticity from RE-SOLVING the implicit root at E_trunc(1 +- 1e-4) to < 1e-4 at EVERY
 *        node of the 0.1x .. 10x grid (max relative disagreement ~1e-5), so the imp-3462
 *        implicit differentiation is correct far outside the half-to-double window it was
 *        validated on -- not a baseline coincidence.
 *   (W2) BAND EXIT. The imp-3462 [1.36, 1.39] band is a NARROW floor window: p crosses 1.36 at
 *        E_trunc ~ 0.800x the baseline (l ~ 11.67) and 1.39 at ~1.294x (l ~ 11.07). Outside the
 *        window p leaves the band monotonically -- DOWN to ~1.27 at 0.1x (l ~ 14.19) and UP to
 *        ~1.64 at 10x (l ~ 8.34). The imp-3462 [1.36, 1.39] is a local, not a structural, band.
 *   (W3) NO ASYMPTOTE IN REACH -- p KEEPS DRIFTING. As the floor shrinks and l grows, p decreases
 *        monotonically WITHOUT plateauing: p ~ 1.273 (l ~ 14.2), 1.182 (l ~ 19.5), 1.139 (l ~
 *        24.6), 1.103 (l ~ 32.0). The excess (p-1) l stays O(3.3..3.9) and slowly shrinks, so p
 *        appears to head to the structural limit p -> 1 (where dlnN/dx = l/(l-1) -> 1 and the
 *        floor perturbation maps one-to-one onto the height) but only as l -> infinity; on any
 *        physically reachable floor decade it keeps drifting rather than settling into a band.
 *
 * The punchline: the imp-3462 [1.36, 1.39] drift band is not an asymptote -- it is the value of
 * the slowly-varying local elasticity in a narrow floor window (~0.80x .. 1.29x the baseline).
 * Widen the floor a full decade each way and the closed (**) exponent tracks the finite-difference
 * elasticity to <1e-4 while drifting monotonically from ~1.64 (10x) down toward the structural
 * limit p = 1 (floor -> 0), which it approaches only logarithmically slowly in l.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3462-nmax-turnover-exponent-derivation (the closed exponent (**) re-evaluated here)
 * @see imp-3446-nmax-closed-form (the implicit stationarity equation F = 0 root-solved here)
 * @see imp-3443-nmax-etrunc-sensitivity (measured p ~ 1.376, half-to-double grid)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) sub-terms, exact prefactors)
 * @see imp-2631-honest-truncation-route-assessment (baseline floor E_trunc = 3.06e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631/imp-3220/imp-3406/imp-3446 truncation floor
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3446/imp-3462 exactly

// N(T0) from Riemann-von Mangoldt (identical to imp-3446/imp-3462 countAtHeight).
function countAtHeight(T0) {
  const l = Math.log(T0 / TWO_PI);
  return (T0 / TWO_PI) * (l - 1);
}

// The imp-3446 stationarity residual F(x, E_trunc), parametrized by the floor (unchanged).
function stationarityResidual(T0, eTrunc) {
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const E_flow = ((l + 1) / TWO_PI) * (L / T0) * GRONWALL;
  const A = 1 / (l + 1) + 1 / L - 1;
  const B = 1 / (2 * L) - l / (2 * (l - 1));
  return (E_flow * A) / (eTrunc + E_flow) - B;
}

// Solve F = 0 for T0star by monotone bisection. WIDER N-bracket than imp-3462 so the interior
// root is captured across the whole 0.1x .. 10x decade grid AND the floor -> 0 asymptotic probe
// (N_max spans ~3.1e4 at 10x up to ~2.5e15 at 1e-8x).
function solveT0star(eTrunc) {
  let a = effectiveHeightForN(1e2); // residual < 0
  let b = effectiveHeightForN(1e18); // residual > 0
  for (let i = 0; i < 600; i++) {
    const m = Math.sqrt(a * b);
    if (stationarityResidual(m, eTrunc) < 0) a = m;
    else b = m;
  }
  return Math.sqrt(a * b);
}
const solveNmax = (eTrunc) => countAtHeight(solveT0star(eTrunc));

// The CLOSED exponent (**), identical algebra to imp-3462, re-evaluated at each floor.
function analyticExponent(eTrunc) {
  const T0 = solveT0star(eTrunc);
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const E_flow = ((l + 1) / TWO_PI) * (L / T0) * GRONWALL;
  const S = eTrunc + E_flow;
  const A = 1 / (l + 1) + 1 / L - 1;
  const Aprime = -1 / ((l + 1) * (l + 1)) - 1 / (L * L);
  const Bprime = -1 / (2 * L * L) + 1 / (2 * (l - 1) * (l - 1));
  const dRatio_dx =
    (E_flow * (A * A + Aprime) * S - E_flow * E_flow * A * A) / (S * S);
  const dF_dx = dRatio_dx - Bprime;
  const dF_dlnEtrunc = (-eTrunc * E_flow * A) / (S * S);
  const dx_dlnEtrunc = -dF_dlnEtrunc / dF_dx;
  const dlnN_dx = l / (l - 1);
  return { T0, l, L, p: -(dlnN_dx * dx_dlnEtrunc), Nmax: countAtHeight(T0) };
}

// Direct finite-difference elasticity by RE-SOLVING the implicit root at E_trunc(1 +- eps).
const EPS = 1e-4;
function fdExponent(eTrunc) {
  const nP = solveNmax(eTrunc * (1 + EPS));
  const nM = solveNmax(eTrunc * (1 - EPS));
  return -(Math.log(nP) - Math.log(nM)) / (Math.log(1 + EPS) - Math.log(1 - EPS));
}

// (W1) Wider decade grid 0.1x .. 10x with per-node finite-difference cross-check.
const FACTORS = [0.1, 0.15, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0, 7.5, 10.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const ex = analyticExponent(eTrunc);
  const pFd = fdExponent(eTrunc);
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    l: +ex.l.toFixed(4),
    N_max: +ex.Nmax.toExponential(4),
    p_analytic: +ex.p.toFixed(6),
    p_finite_diff: +pFd.toFixed(6),
    rel_err: +(Math.abs(ex.p - pFd) / pFd).toExponential(3),
    in_band: ex.p >= 1.36 && ex.p <= 1.39,
  };
});
const MAX_REL_ERR = Math.max(...GRID.map((r) => r.rel_err));
const P_AT_LOW = GRID[0].p_analytic; // 0.1x floor
const P_AT_HIGH = GRID[GRID.length - 1].p_analytic; // 10x floor

// (W2) Band exit: bisect the floor factor where p crosses 1.36 (low) and 1.39 (high).
// p is monotone increasing in the floor factor, so the crossings are unique.
const pOfFactor = (f) => analyticExponent(f * E_TRUNC_BASE).p;
function bisectFactor(target, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const m = Math.sqrt(lo * hi);
    if (pOfFactor(m) < target) lo = m;
    else hi = m;
  }
  return Math.sqrt(lo * hi);
}
const F_EXIT_LOW = bisectFactor(1.36, 0.5, 1.0); // ~0.800
const F_EXIT_HIGH = bisectFactor(1.39, 1.0, 1.5); // ~1.294
const L_EXIT_LOW = +analyticExponent(F_EXIT_LOW * E_TRUNC_BASE).l.toFixed(4);
const L_EXIT_HIGH = +analyticExponent(F_EXIT_HIGH * E_TRUNC_BASE).l.toFixed(4);

// (W3) Asymptotic probe: shrink the floor hard (l grows), track p and the excess (p-1) l.
// Reliable while the root stays inside the bracket (N_max < ~1e17, i.e. l < ~35); beyond that
// the bisection pegs at the bracket edge, so the probe is capped at the 1e-8x floor.
const ASYMP_LOG_FACTORS = [-1, -2, -3, -4, -6, -8];
const ASYMPTOTIC = ASYMP_LOG_FACTORS.map((k) => {
  const ex = analyticExponent(E_TRUNC_BASE * Math.pow(10, k));
  return {
    floor_factor: +Math.pow(10, k).toExponential(0),
    l: +ex.l.toFixed(4),
    p: +ex.p.toFixed(6),
    excess_times_l: +((ex.p - 1) * ex.l).toFixed(4),
  };
});
const P_MONOTONE_DOWN = ASYMPTOTIC.every(
  (r, i) => i === 0 || ASYMPTOTIC[i - 1].p > r.p,
);
const P_SMALLEST = ASYMPTOTIC[ASYMPTOTIC.length - 1].p; // ~1.10 at the 1e-8x floor
const N_MAX_BASE = GRID.find((r) => r.factor === 1.0).N_max; // ~9.22e5 reuse gate

export const IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID = {
  id: 'imp-3578',
  proofSection: 'S-frontier',
  question:
    'Re-evaluate the imp-3462 closed implicit-differentiation exponent (**) = -dlnN_max/dlnE_trunc ' +
    'across a WIDER E_trunc floor grid (0.1x .. 10x the imp-2631 baseline 3.06e-5), locate where ' +
    'the local elasticity leaves the imp-3462 [1.36, 1.39] band, cross-check each analytic value ' +
    'against a re-solved-root finite difference, and assess whether p asymptotes as l = log(T0/2pi) ' +
    'grows or keeps drifting. Measurement only; RH-equivalent; no RH verdict.',
  closedForm:
    'p = -(l/(l-1)) dx/dlnE_trunc, dx/dlnE_trunc = -(dF/dlnE_trunc)/(dF/dx) with F = E_flow A/' +
    '(E_trunc+E_flow) - B (imp-3446), evaluated at the re-solved root T0star for each floor. ' +
    'Identical algebra to imp-3462; only the root bracket (N in [1e2, 1e18]) and the floor grid widen.',
  result: {
    grid: GRID,
    max_rel_err_analytic_vs_fd: +MAX_REL_ERR.toExponential(3), // ~1e-5
    p_at_0p1x: +P_AT_LOW.toFixed(5), // ~1.273
    p_at_baseline: GRID.find((r) => r.factor === 1.0).p_analytic, // ~1.373
    p_at_10x: +P_AT_HIGH.toFixed(5), // ~1.639
    N_max_at_baseline: N_MAX_BASE, // ~9.22e5, reproduces imp-3406/imp-3446/imp-3462
    note:
      'The closed (**) exponent tracks a re-solved-root finite-difference elasticity to < 1e-4 at ' +
      'EVERY node of the 0.1x .. 10x decade grid (max rel err ~1e-5), confirming the imp-3462 ' +
      'implicit differentiation far outside its half-to-double validation window. Across the decade ' +
      'p drifts monotonically from ~1.273 (0.1x floor) up to ~1.639 (10x floor).',
  },
  bandExit: {
    band: [1.36, 1.39],
    factor_exit_low: +F_EXIT_LOW.toFixed(5), // ~0.800
    factor_exit_high: +F_EXIT_HIGH.toFixed(5), // ~1.294
    l_exit_low: L_EXIT_LOW, // ~11.67
    l_exit_high: L_EXIT_HIGH, // ~11.07
    note:
      'The imp-3462 [1.36, 1.39] band is a NARROW floor window, roughly 0.80x .. 1.29x the baseline ' +
      'floor (l ~ 11.67 .. 11.07); the baseline sits inside it. p exits the band monotonically -- ' +
      'below 1.36 for floors under ~0.80x and above 1.39 for floors over ~1.29x. It is a local ' +
      'elasticity window, not a structural band.',
  },
  asymptotics: {
    probe: ASYMPTOTIC,
    monotone_decreasing_as_l_grows: P_MONOTONE_DOWN,
    p_smallest_reachable: +P_SMALLEST.toFixed(5), // ~1.10 at 1e-8x floor (l ~ 32)
    structural_limit: 1.0,
    note:
      'As the floor shrinks and l grows, p decreases monotonically WITHOUT plateauing: ~1.273 ' +
      '(l ~ 14.2), 1.182 (l ~ 19.5), 1.139 (l ~ 24.6), 1.103 (l ~ 32.0). The excess (p-1) l stays ' +
      'O(3.3..3.9) and slowly shrinks, so p appears to head to the STRUCTURAL limit p -> 1 (where ' +
      'dlnN/dx = l/(l-1) -> 1 and the floor perturbation maps one-to-one onto the height) only as ' +
      'l -> infinity. On any physically reachable floor decade it KEEPS DRIFTING, never settling ' +
      'into a fixed band. (Beyond ~1e-8x the root exceeds the N in [1e2,1e18] bracket, so the probe ' +
      'is capped there.)',
  },
  mechanism:
    'sigma peaks where R = (E_trunc+E_flow)/E_coll is stationary (imp-3446). The imp-3462 closed ' +
    '(**) exponent converts a floor perturbation into a height response dx/dlnE_trunc via the ' +
    'implicit-function theorem, amplified by the Riemann-von Mangoldt map dlnN/dx = l/(l-1). ' +
    'Widening the floor a decade each way just walks the same explicit function of the peak ' +
    'log-derivatives A, A-prime, B-prime along a longer T0 track -- so p drifts smoothly and ' +
    'monotonically, tracking the finite-difference elasticity throughout.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-evaluating the imp-3462 closed exponent ' +
    'p = -(l/(l-1)) dx/dlnE_trunc across the 0.1x .. 10x floor decade: (W1) it matches a ' +
    're-solved-root finite-difference elasticity to < 1e-4 at every node (max rel err ~1e-5); ' +
    '(W2) the imp-3462 [1.36, 1.39] band is a narrow floor window ~0.80x .. 1.29x the baseline ' +
    '(l ~ 11.67 .. 11.07), which p exits monotonically -- down to ~1.27 at 0.1x and up to ~1.64 ' +
    'at 10x; (W3) as l grows p keeps drifting down monotonically toward the structural limit ' +
    'p -> 1 (still ~1.10 at l ~ 32), never plateauing in reach. Measurement only; no positivity, ' +
    'no bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3462 (closed exponent (**) re-evaluated here); imp-3446 (implicit stationarity root); ' +
    'imp-3443 (measured p ~ 1.376, half-to-double grid); imp-3406 (interior MAX N_max ~ 9.22e5); ' +
    'imp-3220 (U-shaped sigma(N) sub-terms); imp-2631 (E_trunc floor 3.06e-5); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt).',
};

export const IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID_ASSERTIONS = [
  {
    // Reuse gate: the baseline node reproduces the imp-3406/imp-3446/imp-3462 peak N_max ~ 9.22e5,
    // proving the identical sub-terms and stationarity equation are in use.
    id: 'imp3578-reproduces-baseline-Nmax',
    description: 'Baseline (1.0x) node reproduces the imp-3406/imp-3446 interior maximum ~ 9.22e5',
    holds: () => N_MAX_BASE > 8.5e5 && N_MAX_BASE < 1.0e6,
  },
  {
    // Reuse gate: the baseline analytic exponent reproduces the imp-3462 headline p ~ 1.373.
    id: 'imp3578-reproduces-imp3462-baseline-exponent',
    description: 'Baseline analytic p reproduces the imp-3462 closed exponent ~ 1.373',
    holds: () => Math.abs(GRID.find((r) => r.factor === 1.0).p_analytic - 1.373) < 0.01,
  },
  {
    // (W1) Headline: the closed (**) exponent matches the re-solved-root finite difference across
    // the whole decade grid -- the implicit differentiation holds far outside its validation window.
    id: 'imp3578-analytic-matches-fd-across-decade',
    description: 'Closed-form p matches the re-solved-root finite difference to < 1e-4 at every 0.1x..10x node',
    holds: () => MAX_REL_ERR < 1e-4,
  },
  {
    // (W2) The [1.36, 1.39] band is a narrow floor window strictly inside the decade, and p leaves
    // it monotonically -- below 1.36 at the low floor end, above 1.39 at the high floor end.
    id: 'imp3578-band-is-narrow-floor-window',
    description: 'The imp-3462 [1.36,1.39] band is a narrow floor window ~0.8x..1.3x; p exits it on both ends',
    holds: () =>
      F_EXIT_LOW > 0.6 &&
      F_EXIT_LOW < 0.95 &&
      F_EXIT_HIGH > 1.1 &&
      F_EXIT_HIGH < 1.45 &&
      P_AT_LOW < 1.36 &&
      P_AT_HIGH > 1.39,
  },
  {
    // (W3) As l grows the local exponent drifts monotonically DOWN toward the structural p -> 1
    // limit and does NOT plateau inside the band (still well above 1 but below 1.36 at l ~ 32).
    id: 'imp3578-keeps-drifting-toward-unity',
    description: 'p drifts monotonically down as l grows, heading to the p->1 limit, no in-band plateau',
    holds: () =>
      P_MONOTONE_DOWN &&
      P_SMALLEST > 1.0 &&
      P_SMALLEST < 1.36 &&
      ASYMPTOTIC[0].p > P_SMALLEST,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, not rigorous.
    id: 'imp3578-honesty-gate-no-qed',
    description: 'Measurement only: no QED, no refereed bound is changed, not rigorous',
    holds: () =>
      IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID.isRigorous === false &&
      /NO QED/.test(IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID.verdict),
  },
];

for (const a of IMP3578_NMAX_EXPONENT_WIDE_FLOOR_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3578-nmax-exponent-wide-floor-grid assertion failed: ${a.id}`);
  }
}
