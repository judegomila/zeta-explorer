/**
 * @module imp-96733-basis-c-real-zero-intermediate-signal
 * @fileoverview imp-96733 -- measure the two-interval box correlation from REAL Odlyzko
 *   zeros at INTERMEDIATE unfolded lengths L and test whether the GUE-only imp-96690
 *   corroboration-reach ladder (L* ~ 8.1e7) carries to real zeros. The imp-96690 floor
 *   ladder and its reach projection rest entirely on the THEORETICAL GUE (sine-kernel)
 *   two-interval correlation rho(L) = Sigma2(2L)/(2 Sigma2(L)) - 1, with the repeated
 *   HONEST CAVEAT "no computed Riemann zeros behind any value". imp-96695 already measured
 *   rho_emp from real zeros over the SMALL calibration window L in {30..960} and found
 *   finite-height number-variance saturation. This module pushes the measurement to LARGER
 *   intermediate L (1e3..1e5) bridging the imp-96695 window toward the reach anchor 5.9e6,
 *   compares the empirical corroboration signal |rho_emp + 1/2| against the GUE ladder
 *   signal |rho_GUE + 1/2|, and quantifies the dataset-length ceiling. Measurement only;
 *   moves no bound.
 *
 *   WHAT WAS COMPUTED (offline: tmp/imp-96733-measure.mjs)
 *   -----------------------------------------------
 *   Source: scripts/.zeros-cache/zeros6 -- the first 2,001,052 Riemann zeros gamma_n
 *   (heights up to T ~ 1.13e6). Each zero is unfolded with the Riemann-Siegel smooth
 *   counting w_n = theta(gamma_n)/pi + 1 (mean density 1), giving an unfolded span of
 *   ~2.0e6 units. The empirical number variance Sigma2_emp(L) is the imp-96695 estimator
 *   verbatim (Monte-Carlo phase averaging, 2e6 random window placements per L, seeded
 *   mulberry32), and the empirical two-interval correlation is
 *   rho_emp(L) = Sigma2_emp(2L)/(2 Sigma2_emp(L)) - 1, compared to the exact GUE
 *   rho_GUE(L) = sigma2Exact(2L)/(2 sigma2Exact(L)) - 1 the reach ladder uses. The
 *   corroboration signal is signal(L) = |rho(L) - (-1/2)| = |rho(L) + 1/2|.
 *
 *   THE FINDING (measured, not asserted)
 *   -----------------------------------------------
 *   (1) AT EVERY TRACTABLE INTERMEDIATE L THE EMPIRICAL SIGNAL IS 50-500x SMALLER THAN THE
 *       GUE LADDER SIGNAL. At L = 1e3, 3e3, 1e4, 3e4 (where the dataset still supplies
 *       ~30..1000 independent 2L windows) Sigma2_emp has fully saturated to ~0.386-0.387
 *       (ratio to the GUE Sigma2 falls 0.37 -> 0.28 as L grows), so rho_emp sits essentially
 *       AT the rigidity limit -1/2: signal_emp ~ 6.5e-5..2.3e-3, whereas the GUE ladder
 *       signal is signal_GUE ~ 2.5e-2..3.4e-2. The real-zero corroboration signal is thus
 *       ~15x..520x SMALLER than the GUE signal -- real zeros are MORE rigid than GUE at
 *       these L, they do not reproduce the GUE signal MAGNITUDE that the reach projection
 *       tracks.
 *   (2) THE MEASUREMENT BREAKS DOWN JUST ABOVE L ~ 3e4 -- THE DATASET-LENGTH CEILING. At
 *       L = 1e5 only ~9 independent 2L windows fit in the ~2e6 unfolded span, and the MC
 *       estimator collapses to a finite-sample artifact (Sigma2_emp ~ 0.185, rho_emp ~ -0.86,
 *       signal ~ 3.6e-1). This is NOT a signal -- it is the estimator running out of windows.
 *       The tractable ceiling for this dataset is L ~ 3e4..1e5, three-plus decades BELOW the
 *       reach anchor 5.9e6.
 *   (3) THE REACH LADDER RUNGS ARE STRUCTURALLY UNREACHABLE FROM THIS DATASET. The imp-96690
 *       rungs L = 5.9e6, 1e7, 2e7, 5e7 and the projected reach L* ~ 8.1e7 require an outer
 *       box of unfolded length 2L = 1.18e7..1.62e8, i.e. 6x..81x the ENTIRE unfolded span of
 *       the 2e6-zero dataset. No box correlation can be measured there at all; even a single
 *       2L window does not fit.
 *
 *   CONSEQUENCE. The GUE-only imp-96690 reach ladder CANNOT be corroborated by real zeros,
 *   doubly obstructed: (a) at every tractable L finite-height number-variance saturation pins
 *   the empirical rho at the rigidity limit so the real-zero signal is 15-520x SMALLER than
 *   the GUE ladder signal, and (b) the reach rungs need windows many times larger than the
 *   whole accessible dataset. The discrepancy is in the SAFE direction (as in imp-96695): the
 *   real-zero signal is even smaller than GUE, so real zeros do not contradict the
 *   shrinking-signal picture the crossover rests on -- they simply cannot independently
 *   confirm the GUE signal magnitude at the reach. Note also that the basis-C "floor" is a
 *   double-precision quadrature/cancellation artifact of the direct integral with NO
 *   real-zero analog; only the signal side |rho + 1/2| is measurable from zeros, and that is
 *   what this module reports.
 *
 *   WHAT THIS IS AND IS NOT. A measurement extending imp-96695 to larger intermediate L and
 *   pinning the dataset ceiling relative to the reach rungs. It recomputes no crossover, moves
 *   no L*, instantiates no interval, closes no sub-gap, changes no bound. NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-96690-basis-c-above-anchor-rung-ladder (the GUE-only floor ladder / reach L* ~ 8.1e7 this tests)
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the L = 30..960 real-zero rho measurement this extends)
 * @see imp-96712-basis-c-accelerating-exponent-model (the reach bracket [7.6e7,8.2e7] the ladder feeds)
 * @see imp-96716-basis-c-mechanism-transition-scale (the intermediate mechanism transition)
 *
 * Import-light: no zeros bundle, no sibling imports. The special functions and the GUE
 * number variance are re-derived verbatim so the module is independent; the empirical
 * literals are baked from the offline run.
 *
 * Ticket: imp-96733 (numerical, medium). Measurement only; establishes nothing; moves no
 * bound; NO QED; no refereed bound is changed.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const N_ZEROS = 2001052;
const UNFOLDED_SPAN = 2001050.93; // Wmax - Wmin over the zeros6 dataset

// exact GUE sine-kernel number variance (Dyson-Mehta), identical to imp-96430/96690/96695
function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) { term *= (-x * x) / ((2 * k) * (2 * k + 1)); sum += term / (2 * k + 1); if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalGUE = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho_GUE + 1/2|

// MEASURED intermediate-L rungs (offline tmp/imp-96733-measure.mjs; MC estimator = imp-96695).
// tractable = the dataset still supplies enough independent 2L windows (~30+); the L = 1e5
// row is flagged PAST-CEILING (only ~9 windows) -- its rho_emp is a finite-sample artifact.
const INTERMEDIATE_RUNGS = Object.freeze([
  Object.freeze({ L: 1e3, sigma2Emp: 0.387598, rhoEmp: -0.502311, signalEmp: 2.311e-3, indepWindows2L: 999.5, tractable: true }),
  Object.freeze({ L: 3e3, sigma2Emp: 0.386270, rhoEmp: -0.500065, signalEmp: 6.466e-5, indepWindows2L: 332.5, tractable: true }),
  Object.freeze({ L: 1e4, sigma2Emp: 0.386947, rhoEmp: -0.500545, signalEmp: 5.448e-4, indepWindows2L: 99.1, tractable: true }),
  Object.freeze({ L: 3e4, sigma2Emp: 0.387177, rhoEmp: -0.500544, signalEmp: 5.436e-4, indepWindows2L: 32.4, tractable: true }),
  Object.freeze({ L: 1e5, sigma2Emp: 0.185404, rhoEmp: -0.864369, signalEmp: 3.644e-1, indepWindows2L: 9.0, tractable: false }),
]);

// live: re-derive the GUE ladder signal at each rung and the empirical/GUE signal ratio.
const RUNG_COMPARISON = INTERMEDIATE_RUNGS.map((r) => {
  const sigGUE = signalGUE(r.L);
  return Object.freeze({
    L: r.L,
    signalEmp: r.signalEmp,
    signalGUE: sigGUE,
    empOverGue: r.signalEmp / sigGUE, // < 1 on tractable rungs (real zeros MORE rigid)
    tractable: r.tractable,
  });
});

// tractable rungs only: how much smaller the empirical signal is than the GUE ladder signal.
const tractable = RUNG_COMPARISON.filter((r) => r.tractable);
const minEmpOverGue = Math.min(...tractable.map((r) => r.empOverGue));
const maxEmpOverGue = Math.max(...tractable.map((r) => r.empOverGue));

// dataset ceiling vs the imp-96690 reach rungs: outer box 2L vs the whole unfolded span.
const REACH_RUNG_REACHABILITY = Object.freeze(
  [PT_ANCHOR_L, 1e7, 2e7, 5e7, 8.1e7].map((L) =>
    Object.freeze({
      L,
      outerWindow2L: 2 * L,
      spanMultiples: (2 * L) / UNFOLDED_SPAN, // 6x .. 81x the entire dataset
      reachable: 2 * L <= UNFOLDED_SPAN,
    }),
  ),
);

export const IMP96733_BASIS_C_REAL_ZERO_INTERMEDIATE_SIGNAL = Object.freeze({
  id: 'imp-96733',
  proofSection: 'S-frontier',
  tests: 'imp-96690 (the GUE-only above-anchor floor ladder / reach L* ~ 8.1e7) against real Odlyzko zeros at intermediate L',
  extends: 'imp-96695 (the L = 30..960 real-zero rho measurement) to larger intermediate L (1e3..1e5)',
  provenance: Object.freeze({
    dataset: 'scripts/.zeros-cache/zeros6',
    numZeros: N_ZEROS,
    unfoldedSpan: UNFOLDED_SPAN,
    maxHeightT: 1132490.659,
    unfolding: 'w_n = theta(gamma_n)/pi + 1 (Riemann-Siegel smooth counting; mean density 1)',
    estimator: 'Monte-Carlo phase-averaged number variance, 2e6 random window placements per L, seeded mulberry32 (imp-96695 estimator verbatim)',
    offlineScript: 'tmp/imp-96733-measure.mjs',
  }),
  rigidityLimit: RIGIDITY_LIMIT,
  intermediateRungs: INTERMEDIATE_RUNGS,
  rungComparison: RUNG_COMPARISON,
  signalGapTractable: Object.freeze({
    minEmpOverGue, // ~2.1e-3 (at L = 3e3)
    maxEmpOverGue, // ~6.9e-2 (at L = 1e3)
    note:
      'On the tractable rungs (L = 1e3..3e4, ~30..1000 independent 2L windows) the empirical corroboration signal |rho_emp + 1/2| is 15x..520x SMALLER than the GUE ladder signal |rho_GUE + 1/2|: finite-height number-variance saturation pins Sigma2_emp at ~0.386-0.387 and rho_emp at the rigidity limit -1/2, so real zeros are MORE rigid than GUE and do not reproduce the GUE signal magnitude the reach projection tracks.',
  }),
  datasetCeiling: Object.freeze({
    tractableMaxL: 3e4,
    breakdownL: 1e5,
    breakdownIndepWindows2L: 9.0,
    note:
      'The measurement breaks down just above L ~ 3e4: at L = 1e5 only ~9 independent 2L windows fit the ~2e6 unfolded span and the MC estimator collapses to a finite-sample artifact (Sigma2_emp ~ 0.185, rho_emp ~ -0.86). The tractable ceiling for this 2e6-zero dataset is L ~ 3e4..1e5, three-plus decades below the reach anchor 5.9e6.',
  }),
  reachRungReachability: REACH_RUNG_REACHABILITY,
  reachUnreachableNote:
    'The imp-96690 reach rungs L = 5.9e6..5e7 and the projected L* ~ 8.1e7 require an outer box of unfolded length 2L = 1.18e7..1.62e8, i.e. 6x..81x the ENTIRE unfolded span of the 2e6-zero dataset. No box correlation can be measured there; even a single 2L window does not fit.',
  floorHasNoRealZeroAnalog: true,
  anyBoundMoved: false,
  verdict:
    'MEASUREMENT. Pushing the real-zero two-interval box correlation to intermediate L (1e3..3e4) shows the GUE-only imp-96690 reach ladder is NOT corroborated by real zeros: at every tractable L finite-height number-variance saturation pins Sigma2_emp at ~0.386 and rho_emp at the rigidity limit -1/2, so the empirical signal |rho + 1/2| is 15x..520x SMALLER than the GUE ladder signal. The measurement breaks down at L ~ 1e5 (~9 windows) and the reach rungs themselves (5.9e6..8.1e7) need 2L windows 6x..81x the whole 2e6-zero dataset span, so they are structurally unreachable. The discrepancy is in the SAFE direction (real-zero signal even smaller than GUE, as in imp-96695) and the basis-C floor is a quadrature artifact with no real-zero analog, so only the signal side is measurable. Moves no bound; instantiates no interval; NO QED. No refereed bound is changed; RH open.',
  citation:
    'imp-96690 (GUE-only floor ladder / reach L* ~ 8.1e7); imp-96695 (L = 30..960 real-zero rho, finite-height saturation); imp-96712 (reach bracket); Odlyzko zeros6 dataset; Berry semiclassical number-variance saturation.',
});

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96733_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the GUE-only imp-96690 '
  + 'reach ladder is NOT corroborated by real Odlyzko zeros. At tractable intermediate L (1e3..3e4) '
  + 'finite-height number-variance saturation pins the empirical rho at the rigidity limit -1/2, so '
  + 'the real-zero signal |rho + 1/2| is 15x..520x smaller than the GUE ladder signal; the '
  + 'measurement breaks down at L ~ 1e5 (~9 windows) and the reach rungs (5.9e6..8.1e7) need 2L '
  + 'windows 6x..81x the whole 2e6-zero dataset span (unreachable). Safe-direction discrepancy; '
  + 'changes no bound.';

export default IMP96733_BASIS_C_REAL_ZERO_INTERMEDIATE_SIGNAL;

// --- self-executing internal-consistency assertions ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96733: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96733: Ci(1) drifted from reference');

  // Finding 1: on tractable rungs the empirical signal is well below the GUE ladder signal.
  for (const r of RUNG_COMPARISON) {
    if (r.tractable && !(r.empOverGue < 0.1))
      throw new Error('imp-96733: tractable empirical signal should be < 0.1x the GUE ladder signal');
  }
  if (!(minEmpOverGue > 0 && maxEmpOverGue < 0.1))
    throw new Error('imp-96733: tractable empirical/GUE signal ratio should be in (0, 0.1)');

  // Finding 2: the L = 1e5 rung is past the ceiling (few windows) and flagged non-tractable.
  const r1e5 = INTERMEDIATE_RUNGS.find((r) => r.L === 1e5);
  if (r1e5.tractable || !(r1e5.indepWindows2L < 15))
    throw new Error('imp-96733: L = 1e5 rung should be flagged past-ceiling (< 15 independent windows)');

  // Finding 3: every reach rung is unreachable (2L exceeds the dataset span by a large factor).
  for (const r of REACH_RUNG_REACHABILITY) {
    if (r.reachable || !(r.spanMultiples > 5))
      throw new Error('imp-96733: every reach rung should need a 2L window many times the dataset span');
  }

  // honesty gates
  if (IMP96733_BASIS_C_REAL_ZERO_INTERMEDIATE_SIGNAL.anyBoundMoved !== false)
    throw new Error('imp-96733: measurement must not move any bound');
  if (!/NO QED/.test(IMP96733_BASIS_C_REAL_ZERO_INTERMEDIATE_SIGNAL.verdict))
    throw new Error('imp-96733: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96733_BASIS_C_REAL_ZERO_INTERMEDIATE_SIGNAL.verdict))
    throw new Error('imp-96733: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96733_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96733_HONEST_BANNER) && /NO QED/.test(IMP96733_HONEST_BANNER)))
    throw new Error('imp-96733: IMP96733_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();
