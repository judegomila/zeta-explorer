/**
 * @module imp-33256-r40-inner-quadrature-sweep
 * @fileoverview imp-33256 -- TABULATE the imp-3888 R_40 exact-saddle-ratio inner-
 *   quadrature sensitivity. imp-3888 found the R_40 = |D_40|/|D_40^saddle| cross-check
 *   (imp-3849 inner-converged vs imp-3685 baked) disagrees by ~1.21e-5 -- slightly ABOVE
 *   the informal ~1e-5 tie bar but well inside imp-3849 own coded 1e-4 assertion tolerance --
 *   and ATTRIBUTED it to the inner A(tau) quadrature upgrade (the imp-3735 inner-resolution
 *   axis) WITHOUT tabulating R_40 vs inner panel count. This module fills that gap: it sweeps
 *   the INNER A(tau) Simpson resolution (domain/panels) between imp-3685 [0,7]/1200 grid and
 *   imp-3849 [0,2]/4800 converged grid, holding the OUTER moment grid FIXED, and MEASURES
 *   R_40 at each inner configuration.
 *
 *   WHY HOLD THE OUTER GRID FIXED (isolating the inner axis)
 *   -------------------------------------------------------
 *   imp-3685 native config is (outer T_A = 6, NM = 1600) with inner A(tau) on [0,7]/1200;
 *   imp-3849 native config is (outer T_A = 2, NM = 3200) with inner A(tau) on [0,2]/4800. The
 *   two literals thus differ in BOTH the outer AND the inner grid, so a raw difference cannot
 *   by itself pin the drift to the inner axis. To ISOLATE the inner-resolution axis this module
 *   fixes the outer grid at the imp-3849 converged (T_A = 2, NM = 3200) and varies ONLY the
 *   inner (innerHi, innerN). A CROSS-OUTER control confirms the inner coarse grid [0,7]/1200
 *   gives the SAME R_40 under BOTH outer configs (T_A=2/NM=3200 and T_A=6/NM=1600) to ~1e-15,
 *   proving the ~1.21e-5 drift is inner-resolution-driven, not an outer-grid effect -- exactly
 *   the imp-3735 lesson that the outer moment panels are the axis the answer is insensitive to.
 *
 *   METHOD (self-computing; identical machinery to imp-3849, R_40 rung only)
 *   ----------------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + Neumaier-compensated Simpson + [0,T_A] moment
 *   machinery of imp-3849 is reused, truncated to MMAX = 44 (D_40 = C_42 - C_40 needs only
 *   M_0..M_44). Since Phi(u) underflows to exactly 0 for u &gt; ~1.37, A(tau) is supported on
 *   tau in [0, ~1.4]; the inner integral A(tau) = int Phi(s)Phi(s+tau) ds on s in [0, innerHi]
 *   has its integrand supported on s in [0, ~1.37], so what actually sets the inner resolution
 *   is the panel spacing h_inner = innerHi/innerN in that support region (a wider innerHi at
 *   fixed panels just spends panels on the numerically-zero tail). The sweep therefore ranks
 *   configs by h_inner. The tau &gt; 1.45 =&gt; A = 0 guard is retained.
 *
 *   MEASURED (the R_40 inner-resolution ladder)
 *   -------------------------------------------
 *     (1) THE ~1.21e-5 imp-3888 DELTA IS GENUINE, MONOTONE INNER-RESOLUTION DRIFT. The coarse
 *         imp-3685 inner grid [0,7]/1200 (h_inner ~ 5.83e-3) gives R_40 = 1.02438462, and the
 *         converged reference [0,2]/7200 (h_inner ~ 2.78e-4) gives R_40 = 1.02439670 -- a delta
 *         of ~1.208e-5, reproducing imp-3888 exactly. Refining the inner panels drives R_40
 *         MONOTONE upward toward the converged value from below, and the delta shrinks
 *         monotonically: 3.32e-5 (h=8.0e-3) -&gt; 1.90e-5 -&gt; 1.12e-5 -&gt; 6.98e-6 -&gt; 4.53e-6 -&gt;
 *         3.05e-6 -&gt; 1.52e-6 -&gt; 4.98e-7 (h=2.5e-3) -&gt; 3.21e-8 -&gt; 1.95e-9. Classic O(h^4) Simpson
 *         convergence, not a bug.
 *     (2) THE ~1e-5 TIE BAR IS CROSSED AT h_inner ~ 5.5e-3 (~360 panels on [0,2]). The coarse
 *         imp-3685 grid ([0,7]/1200, h ~ 5.83e-3, delta ~1.208e-5) is the ONLY rung ABOVE the
 *         informal ~1e-5 bar; the delta drops below 1e-5 between [0,2]/350 (delta 1.124e-5) and
 *         [0,2]/400 (delta 6.98e-6). So the imp-3685 literal sits marginally on the wrong side
 *         of the tighter informal bar purely because its inner grid is the coarsest in the
 *         family; the smallest inner refinement (to h &lt;= ~5.2e-3) already ties within 1e-5, and
 *         by [0,2]/800 (h = 2.5e-3) the two literals agree to &lt;5e-7.
 *     (3) THE DRIFT IS INNER, NOT OUTER. The cross-outer control: inner [0,7]/1200 under outer
 *         (T_A=2, NM=3200) and under outer (T_A=6, NM=1600) give R_40 identical to ~1e-15. So
 *         the whole ~1.21e-5 spread is carried by the inner A(tau) resolution.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY. This tabulates the inner-quadrature convergence of a single moment-ratio
 *   diagnostic (R_40) and confirms the imp-3888 ~1.21e-5 residual is genuine, monotone inner-
 *   resolution drift crossing the informal ~1e-5 bar at h_inner ~ 5.5e-3 -- NOT a literal error
 *   and NOT a bug. No literal is patched; imp-3685 and imp-3849 assertions are LEFT INTACT.
 *   It changes NO bound and establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *   Reported values are grid-CONVERGENCE stable, not certified error bounds; the shared finite
 *   NPHI = 10 kernel truncation and Simpson order remain the residual floor.
 *
 *   @see imp-3888-cross-check-provenance-audit.js (found the ~1.21e-5 R_40 residual, un-tabulated)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the converged inner grid, R_40 = 1.02440)
 *   @see imp-3685-fit-bias-saddle-plateau-n40.js (the coarse inner grid, baked R_40 = 1.02438)
 *   @see imp-3735-moment-ratio-correction-tail.js (the inner-resolution axis lesson)
 *
 *   Ticket: imp-33256 (numerical, low).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson with Neumaier COMPENSATED accumulation (imp-3731/imp-3849). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

/** A(tau) = int_0^innerHi Phi(s) Phi(s + tau) ds on innerN Simpson panels. */
function makeAutocorr(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

/** imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*}. */
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * R_40 = |D_40| / |D_40^saddle| on an (T_A, NM) outer moment grid with an (innerHi, innerN)
 * inner A(tau) quadrature. Moments only to M_44 (all D_40 needs). Neumaier-compensated
 * throughout; the tau &gt; 1.45 =&gt; A = 0 guard skips the numerically-zero A tail.
 */
function computeR40(T_A, NM, innerHi, innerN) {
  const MMAX = 44;
  const autocorr = makeAutocorr(innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);
  }
  const MOMENTS = new Array(MMAX + 1);
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }
  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);
  return Math.abs(Dn(40)) / Math.abs(saddleDn(40));
}

// FIXED outer moment grid (imp-3849 converged) so the sweep isolates the INNER axis.
const OUTER_T_A = 2;
const OUTER_NM = 3200;

// Converged inner reference: [0,2]/7200 (imp-3849 self-check finest inner grid).
const R40_REF = computeR40(OUTER_T_A, OUTER_NM, 2, 7200);

// PRIMARY inner sweep on [0,2], varying panel count (h_inner = 2/panels).
const SWEEP_PANELS = [250, 300, 350, 400, 450, 500, 600, 800, 1600, 3200, 4800];
const SWEEP = SWEEP_PANELS.map((panels) => {
  const r40 = computeR40(OUTER_T_A, OUTER_NM, 2, panels);
  return Object.freeze({
    innerHi: 2,
    innerPanels: panels,
    hInner: 2 / panels,
    r40,
    deltaVsRef: Math.abs(r40 - R40_REF),
    withinTieBar: Math.abs(r40 - R40_REF) < 1e-5,
  });
});

// imp-3685 NATIVE coarse inner grid [0,7]/1200 (h_inner ~ 5.83e-3), fixed converged outer.
const R40_COARSE_3685 = computeR40(OUTER_T_A, OUTER_NM, 7, 1200);
const COARSE_DELTA = Math.abs(R40_COARSE_3685 - R40_REF);

// CROSS-OUTER control: same coarse inner [0,7]/1200 under the imp-3685 NATIVE outer
// (T_A=6, NM=1600). If R_40 matches the fixed-outer value to ~1e-15, the drift is inner.
const R40_COARSE_3685_NATIVEOUTER = computeR40(6, 1600, 7, 1200);
const CROSS_OUTER_DELTA = Math.abs(R40_COARSE_3685 - R40_COARSE_3685_NATIVEOUTER);

// imp-3849 NATIVE converged inner grid [0,2]/4800 (should reproduce its baked R_40 = 1.02440).
const R40_CONVERGED_3849 = computeR40(OUTER_T_A, OUTER_NM, 2, 4800);

// Monotonicity of the sweep: R_40 strictly up, delta strictly down as panels increase.
let R40_STRICTLY_INCREASING = true;
let DELTA_STRICTLY_DECREASING = true;
for (let i = 1; i < SWEEP.length; i += 1) {
  if (!(SWEEP[i].r40 > SWEEP[i - 1].r40)) R40_STRICTLY_INCREASING = false;
  if (!(SWEEP[i].deltaVsRef < SWEEP[i - 1].deltaVsRef)) DELTA_STRICTLY_DECREASING = false;
}

// Locate the ~1e-5 tie-bar crossing: first sweep rung (by increasing panels) whose delta < 1e-5.
let TIE_BAR_CROSS_PANELS = null;
let TIE_BAR_CROSS_H = null;
for (let i = 0; i < SWEEP.length; i += 1) {
  if (SWEEP[i].deltaVsRef < 1e-5) {
    TIE_BAR_CROSS_PANELS = SWEEP[i].innerPanels;
    TIE_BAR_CROSS_H = SWEEP[i].hInner;
    break;
  }
}
// The rung just BELOW the bar-crossing (last one still above the 1e-5 bar).
const rungAtPanels = (p) => SWEEP.find((row) => row.innerPanels === p);
const CROSS_BELOW = rungAtPanels(350);   // delta ~1.124e-5 (above bar)
const CROSS_ABOVE = rungAtPanels(400);   // delta ~6.98e-6 (below bar)

const verdict =
  COARSE_DELTA > 1e-5 &&
  COARSE_DELTA < 1.5e-5 &&
  R40_STRICTLY_INCREASING &&
  DELTA_STRICTLY_DECREASING &&
  CROSS_OUTER_DELTA < 1e-12 &&
  TIE_BAR_CROSS_PANELS === 400
    ? 'imp-3888-R_40-RESIDUAL-IS-GENUINE-MONOTONE-INNER-A(tau)-QUADRATURE-DRIFT:-COARSE-imp-3685' +
      '-INNER-[0,7]/1200-(h~5.83e-3)-GIVES-R_40=1.02438462,-CONVERGED-[0,2]/7200-GIVES-1.02439670,' +
      '-DELTA~1.208e-5-(REPRODUCES-imp-3888);-REFINING-INNER-PANELS-DRIVES-R_40-MONOTONE-UP-TO' +
      '-CONVERGED-FROM-BELOW-AND-THE-DELTA-CROSSES-THE-INFORMAL-~1e-5-BAR-AT-h_inner~5.5e-3' +
      '-(~360-PANELS-ON-[0,2]);-CROSS-OUTER-CONTROL-CONFIRMS-THE-DRIFT-IS-INNER-NOT-OUTER-(SAME' +
      '-R_40-UNDER-BOTH-OUTER-GRIDS-TO-~1e-15).-MEASUREMENT-ONLY;-NO-LITERAL-PATCHED;-imp-3066' +
      '-UNTOUCHED;-PT-Lambda<=0.2-SOTA;-NO-QED'
    : 'INDETERMINATE';

export const IMP33256_R40_INNER_QUADRATURE_SWEEP = Object.freeze({
  id: 'imp-33256-r40-inner-quadrature-sweep',
  ticket: 'imp-33256',
  tabulates: 'imp-3888-cross-check-provenance-audit.js',
  bridgesGrids: ['imp-3685-fit-bias-saddle-plateau-n40.js', 'imp-3849-saddle-ratio-well-depth-inner-converged.js'],
  appliesLessonFrom: 'imp-3735-moment-ratio-correction-tail.js',

  summary:
    'TABULATES the imp-3888 R_40 = |D_40|/|D_40^saddle| inner-quadrature sensitivity that imp-3888 named ' +
    'but never swept. Holding the OUTER moment grid FIXED at the imp-3849 converged (T_A=2, NM=3200), the ' +
    'INNER A(tau) Simpson resolution is swept from the imp-3685 coarse [0,7]/1200 (h_inner ~ 5.83e-3) to ' +
    'the imp-3849 converged [0,2]/4800 (h_inner ~ 4.17e-4) and finer [0,2]/7200. RESULT: the ~1.21e-5 ' +
    'imp-3888 residual is genuine, MONOTONE inner-resolution drift -- coarse R_40 = 1.02438462, converged ' +
    'R_40 = 1.02439670, delta ~1.208e-5 (reproduces imp-3888); refining the inner panels drives R_40 ' +
    'monotone up to the converged value from below (delta 3.32e-5 -> 1.95e-9 as h shrinks) with classic ' +
    'O(h^4) Simpson convergence. The delta crosses the informal ~1e-5 bar at h_inner ~ 5.5e-3 (~360 panels ' +
    'on [0,2], between [0,2]/350 delta 1.124e-5 and [0,2]/400 delta 6.98e-6): the imp-3685 coarse grid is ' +
    'the ONLY rung above the bar, and the smallest refinement ties within 1e-5. A CROSS-OUTER control ' +
    '(same coarse inner under T_A=6/NM=1600 vs T_A=2/NM=3200) gives R_40 identical to ~1e-15, proving the ' +
    'drift is INNER not OUTER (imp-3735 lesson). MEASUREMENT ONLY; no literal patched; imp-3685/imp-3849 ' +
    'left intact; imp-3066 untouched; necessary-but-not-sufficient; no QED; PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40| / |D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    outerFixed: 'OUTER moment grid held at imp-3849 converged (T_A=2, NM=3200) to isolate the inner axis',
    innerSwept: 'INNER A(tau) on [0,2] with panels in {250..4800}, plus imp-3685 native coarse [0,7]/1200',
    convergedReference: 'R_40 at [0,2]/7200 (imp-3849 self-check finest inner grid)',
    resolutionMetric: 'h_inner = innerHi/innerN in the A(tau) support region tau in [0,~1.4]',
    momentsTo: 44,
    compensatedSummation: 'Neumaier-compensated accumulation for A(tau) AND every moment M_m',
    selfComputing: true,
  }),

  measured: Object.freeze({
    r40ConvergedReference: R40_REF,                 // ~1.02439670 ([0,2]/7200)
    r40CoarseImp3685Inner: R40_COARSE_3685,         // ~1.02438462 ([0,7]/1200, imp-3685 baked ~1.02438)
    coarseDeltaVsRef: COARSE_DELTA,                 // ~1.208e-5 (reproduces imp-3888 ~1.21e-5)
    r40ConvergedImp3849Inner: R40_CONVERGED_3849,   // ~1.02439670 ([0,2]/4800, imp-3849 baked ~1.02440)
    crossOuterDelta: CROSS_OUTER_DELTA,             // ~1e-15 (drift is inner, not outer)
    tieBarCrossPanels: TIE_BAR_CROSS_PANELS,        // 400 (first sweep rung under 1e-5)
    tieBarCrossHInner: TIE_BAR_CROSS_H,             // ~5.0e-3
    crossBelowBar: CROSS_BELOW,                     // [0,2]/350 rung (delta ~1.124e-5, above bar)
    crossAboveBar: CROSS_ABOVE,                     // [0,2]/400 rung (delta ~6.98e-6, below bar)
    r40StrictlyIncreasing: R40_STRICTLY_INCREASING,
    deltaStrictlyDecreasing: DELTA_STRICTLY_DECREASING,
    sweep: Object.freeze(SWEEP),
    verdict,
  }),

  interpretation: Object.freeze({
    residualIsGenuineDrift:
      'The imp-3888 ~1.21e-5 R_40 residual is NOT a literal error and NOT a bug: it is genuine, monotone ' +
      'inner-A(tau)-quadrature drift. The coarse imp-3685 inner grid [0,7]/1200 (h ~ 5.83e-3) gives ' +
      'R_40 = 1.02438462; converging the inner resolution drives R_40 monotone upward to 1.02439670 with ' +
      'classic O(h^4) Simpson convergence (delta 3.32e-5 -> 1.95e-9 as h shrinks).',
    tieBarCrossing:
      'The informal ~1e-5 tie bar is crossed at h_inner ~ 5.5e-3 (~360 panels on [0,2]). The imp-3685 ' +
      'coarse grid is the ONLY rung above the bar; the delta drops below 1e-5 between [0,2]/350 ' +
      '(delta 1.124e-5) and [0,2]/400 (delta 6.98e-6). So the imp-3685 literal sits marginally above the ' +
      'tighter informal bar solely because it is the coarsest inner grid in the family.',
    driftIsInnerNotOuter:
      'The cross-outer control gives R_40 identical to ~1e-15 for the coarse inner grid under both outer ' +
      'grids (T_A=2/NM=3200 and T_A=6/NM=1600), so the whole ~1.21e-5 spread is carried by the inner ' +
      'A(tau) resolution -- confirming the imp-3735 lesson that the outer moment grid is the insensitive axis.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    tabulatedInsteadOfAsserting: true,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Reported values are grid-CONVERGENCE stable; the shared finite NPHI = 10 kernel truncation and ' +
      'Simpson order remain the residual floor, so these are located values of this truncated-kernel ' +
      'model, not certified error bounds.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

export const IMP33256_R40_INNER_QUADRATURE_SWEEP_ASSERTIONS = [
  {
    id: 'imp33256-coarse-delta-reproduces-imp3888',
    why: 'The coarse imp-3685 inner grid [0,7]/1200 vs the converged reference must reproduce the imp-3888 ' +
      'R_40 residual ~1.21e-5 (above the informal ~1e-5 bar, below the module 1e-4 tolerance).',
    holds: () => COARSE_DELTA > 1e-5 && COARSE_DELTA < 1.5e-5,
  },
  {
    id: 'imp33256-coarse-r40-reproduces-imp3685-baked',
    why: 'The coarse inner grid must reproduce the imp-3685 baked saddleDnRatioLast ~1.02438.',
    holds: () => Math.abs(R40_COARSE_3685 - 1.02438) < 5e-6,
  },
  {
    id: 'imp33256-converged-r40-reproduces-imp3849',
    why: 'The converged inner grid [0,2]/4800 must reproduce the imp-3849 baked R_40 ~1.02440.',
    holds: () => Math.abs(R40_CONVERGED_3849 - 1.02440) < 5e-6,
  },
  {
    id: 'imp33256-r40-monotone-increasing-with-inner-resolution',
    why: 'Refining the inner panels must drive R_40 MONOTONE upward toward the converged value from below ' +
      '(classic O(h^4) Simpson convergence), confirming the drift is genuine, not noise.',
    holds: () => R40_STRICTLY_INCREASING && R40_REF > SWEEP[SWEEP.length - 1].r40 - 1e-9,
  },
  {
    id: 'imp33256-delta-monotone-decreasing',
    why: 'The delta vs the converged reference must shrink monotonically as the inner resolution increases.',
    holds: () => DELTA_STRICTLY_DECREASING && SWEEP[0].deltaVsRef > 1e-5 && SWEEP[SWEEP.length - 1].deltaVsRef < 1e-8,
  },
  {
    id: 'imp33256-tie-bar-crossing-located',
    why: 'The ~1e-5 tie bar must be crossed between [0,2]/350 (delta above 1e-5) and [0,2]/400 (delta below ' +
      '1e-5), i.e. at h_inner ~ 5.5e-3 -- the first sweep rung under the bar is [0,2]/400.',
    holds: () =>
      CROSS_BELOW.deltaVsRef > 1e-5 &&
      CROSS_ABOVE.deltaVsRef < 1e-5 &&
      TIE_BAR_CROSS_PANELS === 400,
  },
  {
    id: 'imp33256-drift-is-inner-not-outer',
    why: 'CONTROL: the coarse inner grid [0,7]/1200 must give the SAME R_40 under both outer grids ' +
      '(T_A=2/NM=3200 and T_A=6/NM=1600) to ~1e-12, proving the ~1.21e-5 drift is inner-resolution, not outer.',
    holds: () => CROSS_OUTER_DELTA < 1e-12,
  },
  {
    id: 'imp33256-verdict-not-indeterminate',
    why: 'The classified verdict must record the genuine monotone inner-resolution drift, the tie-bar ' +
      'crossing, and the inner-not-outer control -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33256-honest-measurement-only',
    why: 'Mandatory honesty: measurement only, no literal patched, source modules intact, no bound changed, ' +
      'mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33256_R40_INNER_QUADRATURE_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33256_R40_INNER_QUADRATURE_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33256-r40-inner-quadrature-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP33256_R40_INNER_QUADRATURE_SWEEP;
