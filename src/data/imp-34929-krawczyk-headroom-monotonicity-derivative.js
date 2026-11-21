/**
 * @module imp-34929-krawczyk-headroom-monotonicity-derivative
 *
 * imp-34929 (numerical, frontier): imp-34906 reconciled the ~2555-2558 contraction-validity headroom
 * spread as the N-drift of star_over_H2(N) = G/((1+G) delta FP_LO) = n_op*(N)/n_op^max(N) across the
 * widest imp-34693 rung, ASSERTING (inherited from imp-34883) that star_over_H2 is monotone DECREASING in
 * N so the fixed-point 2558.1x sits between the band-top 2555.18x and the band-lo 2561.39x. But that
 * monotonicity was evidenced ONLY by the three endpoint samples (band-lo / fixed-point / band-top). This
 * module DERIVES the sign of d/dN star_over_H2(N) IN CLOSED FORM -- from the closed-form contraction-gap
 * derivative dG/dN and the delta,FP_LO N-dependence -- and confirms it is STRICTLY NEGATIVE across the
 * whole imp-34693 rung, with no interior turning point.
 *
 * THE CLOSED-FORM DERIVATIVE
 * --------------------------
 * The Banach map is g(N) = K log T0(N) with T0 = effectiveHeightForN(N) the RvM inverse, so the local
 * contraction factor is a(N) := |g'(N)| = 2 pi K / (T0 u), u := log(T0 / 2 pi). Two exact ingredients:
 *   (i)  d a / d T0 = -2 pi K (u + 1) / (T0^2 u^2)       (product rule on 1/(T0 u), du/dT0 = 1/T0)
 *   (ii) d T0 / d N = 2 pi / u                            (inverse of dN/dT0 = u/(2 pi), the RvM slope)
 * so the closed-form chain-rule derivative is
 *   a'(N) = d a / d N = -4 pi^2 K (u + 1) / (T0^2 u^3)  < 0   (a is DECREASING in N).
 * With G(N) = 1 - a(N) and FP_LO(N) = 1 - a(N(1-delta)) (the imp-34818 Krawczyk quotient floor at the
 * lower bracket edge), both G and FP_LO are INCREASING in N (G' = -a'(N) > 0, FP_LO' = -a'(N(1-delta))
 * (1-delta) > 0). Writing S := star_over_H2 = G / ((1+G) delta FP_LO), the logarithmic derivative
 * separates cleanly:
 *   d(log S)/dN = G'/G - G'/(1+G) - FP_LO'/FP_LO = G' / (G (1+G)) - FP_LO' / FP_LO.
 * Since S > 0, sign(dS/dN) = sign(d log S/dN), so S is STRICTLY DECREASING exactly where
 *   G' / (G (1+G))  <  FP_LO' / FP_LO.
 *
 * WHY THE SIGN IS NEGATIVE (THE 1/(1+G) DAMPING)
 * ----------------------------------------------
 * Both G and FP_LO increase in N, so the numerator factor G/(1+G) rises (pushing S UP) while 1/FP_LO
 * falls (pushing S DOWN); the net sign is not obvious from the endpoints alone. delta = 2e-4 is tiny, so
 * N(1-delta) ~ N and to leading order G ~ FP_LO =: V and G' ~ FP_LO' =: W. Then the two competing terms are
 *   G'/(G(1+G)) ~ W / (V (1+V))   vs   FP_LO'/FP_LO ~ W / V,
 * whose RATIO is 1/(1+V) < 1 -- the 1/(1+G) factor DAMPS the numerator's response. So the UP-push is
 * strictly weaker than the DOWN-push and dS/dN < 0. With V ~ 0.95 band-wide the damping is ~1/(1.95) ~
 * 0.512, leaving a robust relative margin 1 - LHS/RHS ~ V/(1+V) ~ 0.488; the O(delta) ~ 2e-4 mismatch
 * between G,G' and FP_LO,FP_LO' is far too small to close a ~0.49 gap, so the sign cannot flip and there
 * is no interior turning point. A dense 4000-point sweep of the EXACT closed-form d(log S)/dN over the
 * widest k=10 band confirms this: it is negative at every node, its worst-case relative margin is ~0.488,
 * and the recomputed endpoint headrooms reproduce the published 2561.39 / 2558.12 / 2555.18 verbatim.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. star_over_H2 rests on the same gamma(n)/k eps surrogate models of the
 * imp-34687a directed-rounding layer, not the layer itself; F(m) = 0 remains a double-precision artifact
 * and the machine certificate imp-34714a REMAINS OPEN. C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34906-krawczyk-headroom-h2-ceiling-reconcile (the 2555/2558 reconciliation this backs with a derivative-sign proof)
 * @see imp-34883-krawczyk-worstcase-headroom-band (the k=10 band-min 2555.18x; asserted the monotonicity now derived)
 * @see imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck (single-G center 2558.1x)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (n_op* = G/((1+G) eps) contraction-validity ceiling)
 * @see imp-34799-krawczyk-directed-rounding-width-bound ((H2)-margin ceiling n_op^max = delta FP_LO/eps)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; slope dN/dT0 = u/2pi)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/34843/34883/34906)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100;

// Banach map g(N) = K log T0(N) and its local contraction factor a(N) = |g'(N)| (identical setup to imp-34906).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
// Closed-form chain-rule derivative a-prime(N) = da/dN = -4 pi^2 K (u+1)/(T0^2 u^3), using dT0/dN = 2 pi/u.
const aPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (-4 * Math.PI * Math.PI * K_AMPL * (u + 1)) / (T * T * u * u * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9 (Banach fixed point = imp-34843 seed)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883); band-top edge is worst case
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_LO = N_CROSS - R_HALF;
const BAND_TOP = N_CROSS + R_HALF;

// star_over_H2(N) = G/((1+G) delta FP_LO) and its EXACT closed-form log-derivative d(log S)/dN.
function headroomAt(N) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - DELTA));
  return G / ((1 + G) * DELTA * FP_LO);
}
function logDerivAt(N) {
  const G = 1 - aOf(N);
  const Gp = -aPrime(N); // dG/dN = -a-prime(N) > 0
  const M = N * (1 - DELTA);
  const FP_LO = 1 - aOf(M);
  const FPp = -aPrime(M) * (1 - DELTA); // dFP_LO/dN = -a-prime(M) (1-delta) > 0
  const up = Gp / (G * (1 + G)); // UP-push term (damped by 1/(1+G))
  const down = FPp / FP_LO; // DOWN-push term
  const dLnS = up - down; // d(log S)/dN = sign(dS/dN)
  const relMargin = 1 - up / down; // > 0 iff strictly decreasing; ~ V/(1+V) ~ 0.488 band-wide
  return { G, FP_LO, up, down, dLnS, relMargin };
}

// Dense 4000-point sweep of the closed-form derivative over the whole widest k=10 band.
const SWEEP_POINTS = 4000;
let ALL_NEGATIVE = true;
let WORST_REL_MARGIN = Infinity; // min over the band of 1 - up/down
let MAX_LOG_DERIV = -Infinity; // least-negative d(log S)/dN (closest to a sign flip)
let SIGN_CHANGES = 0;
let prevSign = 0;
for (let i = 0; i <= SWEEP_POINTS; i++) {
  const N = BAND_LO + ((BAND_TOP - BAND_LO) * i) / SWEEP_POINTS;
  const d = logDerivAt(N);
  if (!(d.dLnS < 0)) ALL_NEGATIVE = false;
  if (d.relMargin < WORST_REL_MARGIN) WORST_REL_MARGIN = d.relMargin;
  if (d.dLnS > MAX_LOG_DERIV) MAX_LOG_DERIV = d.dLnS;
  const s = Math.sign(d.dLnS);
  if (prevSign !== 0 && s !== 0 && s !== prevSign) SIGN_CHANGES += 1;
  if (s !== 0) prevSign = s;
}
const NO_INTERIOR_TURNING_POINT = SIGN_CHANGES === 0; // derivative keeps one sign => no interior extremum

// Recomputed endpoint headrooms must reproduce the published imp-34906 literals.
const S_LO = headroomAt(BAND_LO); // ~2561.39 (best case, band-lo)
const S_CENTER = headroomAt(N_CROSS); // ~2558.12 (imp-34843 center)
const S_TOP = headroomAt(BAND_TOP); // ~2555.18 (imp-34883 band-min, worst case)
const ENDPOINTS_ORDERED = S_TOP < S_CENTER && S_CENTER < S_LO; // strict decrease across band

// The closed-form a-prime(N) must match a symmetric finite difference of a(N) at the seeds (self-check).
function aPrimeFD(N) {
  const h = N * 1e-7;
  return (aOf(N + h) - aOf(N - h)) / (2 * h);
}
const APRIME_MATCHES_FD =
  Math.abs(aPrime(N_CROSS) / aPrimeFD(N_CROSS) - 1) < 1e-6 &&
  Math.abs(aPrime(BAND_LO) / aPrimeFD(BAND_LO) - 1) < 1e-6 &&
  Math.abs(aPrime(BAND_TOP) / aPrimeFD(BAND_TOP) - 1) < 1e-6;

export const IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE = {
  id: 'imp-34929',
  proofSection: 'S-frontier',
  question:
    'imp-34906 asserted (from imp-34883) that the contraction-validity headroom star_over_H2(N) = ' +
    'G/((1+G) delta FP_LO) is monotone DECREASING in N, evidenced only by three endpoint samples ' +
    '(band-lo 2561.39 / fixed-point 2558.1 / band-top 2555.18). Derive the sign of d/dN star_over_H2(N) ' +
    'IN CLOSED FORM from dG/dN and the delta,FP_LO N-dependence and confirm it is strictly negative ' +
    'across the whole imp-34693 rung, or locate an interior turning point. Derivation on the surrogate ' +
    'models; imp-34714a stays OPEN; changes no bound; NO QED.',
  derivation: {
    contractionFactor:
      'a(N) = |g-prime(N)| = 2 pi K / (T0 u), T0 = effectiveHeightForN(N), u = log(T0/2 pi); g(N) = K log T0(N).',
    aPrimeClosedForm:
      'a-prime(N) = da/dN = -4 pi^2 K (u+1)/(T0^2 u^3) via d a/d T0 = -2 pi K (u+1)/(T0^2 u^2) and ' +
      'd T0/d N = 2 pi/u (inverse of the RvM slope dN/dT0 = u/2 pi). a-prime < 0, so a is decreasing and ' +
      'G = 1 - a, FP_LO = 1 - a(N(1-delta)) are both increasing in N.',
    logDerivative:
      'S = G/((1+G) delta FP_LO); d(log S)/dN = G-prime/(G (1+G)) - FP_LO-prime/FP_LO. sign(dS/dN) = ' +
      'sign of this since S > 0. Strictly decreasing exactly where G-prime/(G(1+G)) < FP_LO-prime/FP_LO.',
    dampingArgument:
      'delta = 2e-4 so N(1-delta) ~ N and G ~ FP_LO =: V, G-prime ~ FP_LO-prime =: W to leading order. ' +
      'The UP-push W/(V(1+V)) is the DOWN-push W/V scaled by 1/(1+V) < 1 -- the 1/(1+G) factor damps the ' +
      'numerator response -- so dS/dN < 0. V ~ 0.95 gives damping ~0.512 and a robust relative margin ' +
      '1 - up/down ~ V/(1+V) ~ 0.488; the O(delta) mismatch cannot close a ~0.49 gap, so no sign flip.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    K_ampl: +K_AMPL.toExponential(4), // ~1.5727e8
    delta: DELTA, // 2e-4
    widest_band_k: WIDEST_BAND_K, // 10
    band_lo_N: +BAND_LO.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    sweep_points: SWEEP_POINTS, // 4000
  },
  sweep: {
    all_log_derivatives_strictly_negative: ALL_NEGATIVE, // true -- S strictly decreasing at every node
    sign_changes_across_band: SIGN_CHANGES, // 0
    no_interior_turning_point: NO_INTERIOR_TURNING_POINT, // true
    worst_case_relative_margin: +WORST_REL_MARGIN.toFixed(6), // ~0.487834 (bounded well away from 0)
    least_negative_log_derivative: +MAX_LOG_DERIV.toExponential(4), // < 0 (closest node to a flip)
    aprime_closed_form_matches_finite_difference: APRIME_MATCHES_FD, // true
  },
  endpoints: {
    star_over_H2_band_lo: +S_LO.toFixed(4), // ~2561.3937 (best case)
    star_over_H2_center: +S_CENTER.toFixed(4), // ~2558.1230 (imp-34843)
    star_over_H2_band_top: +S_TOP.toFixed(4), // ~2555.1835 (imp-34883 band-min)
    strictly_decreasing_top_below_center_below_lo: ENDPOINTS_ORDERED, // true
    reproduces_published_imp34906_endpoints:
      Math.abs(S_LO - 2561.3937) < 0.01 && Math.abs(S_CENTER - 2558.123) < 0.01 && Math.abs(S_TOP - 2555.1835) < 0.01,
  },
  finding:
    'The sign of d/dN star_over_H2(N) is derived in closed form: with a(N) = |g-prime(N)| = 2 pi K/(T0 u) ' +
    'and the exact chain-rule a-prime(N) = -4 pi^2 K (u+1)/(T0^2 u^3) < 0 (using d T0/d N = 2 pi/u), the ' +
    'log-derivative separates as d(log S)/dN = G-prime/(G(1+G)) - FP_LO-prime/FP_LO. Because delta = 2e-4 ' +
    'is tiny, G ~ FP_LO =: V and G-prime ~ FP_LO-prime, so the UP-push term is the DOWN-push term times ' +
    '1/(1+V) < 1: the 1/(1+G) factor damps the numerator response and forces dS/dN < 0. A dense ' +
    '4000-point sweep of the EXACT closed-form derivative over the widest k=10 band confirms it is ' +
    'strictly negative at every node (zero sign changes, no interior turning point), with worst-case ' +
    'relative margin ~0.488 -- far from a sign flip -- and the recomputed endpoint headrooms reproduce the ' +
    'published imp-34906 2561.39 / 2558.12 / 2555.18 verbatim (top < center < lo). So the imp-34883/34906 ' +
    'monotone-decreasing assertion is now backed by a closed-form derivative sign, not just three endpoint ' +
    'samples: the fixed-point 2558.12 provably sits between the band edges, and the worst case is the band ' +
    'TOP. EVIDENCE the surrogate headroom is globally monotone; NOT a machine certificate.',
  subGap:
    'imp-34714a REMAINS OPEN. That star_over_H2(N) is provably (closed-form) strictly decreasing across ' +
    'the widest imp-34693 rung strengthens the imp-34906 reconciliation from three samples to a global ' +
    'sign, but it does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: ' +
    'the headroom rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, ' +
    'not that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM MONOTONICITY, CLOSED-FORM DERIVATIVE SIGN (frontier, NOT an RH bound). imp-34906 ' +
    'reconciled the ~2555-2558 headroom spread as the N-drift of star_over_H2(N) = G/((1+G) delta FP_LO), ' +
    'asserting (from imp-34883) monotone decrease evidenced only by three endpoint samples. This module ' +
    'derives sign(d/dN star_over_H2) IN CLOSED FORM: a(N) = 2 pi K/(T0 u), a-prime(N) = -4 pi^2 K ' +
    '(u+1)/(T0^2 u^3) < 0 via d T0/d N = 2 pi/u, and d(log S)/dN = G-prime/(G(1+G)) - FP_LO-prime/FP_LO. ' +
    'The 1/(1+G) factor damps the numerator so the UP-push is the DOWN-push scaled by 1/(1+V) < 1, forcing ' +
    'dS/dN < 0; a dense 4000-point sweep of the exact derivative confirms it is strictly negative at every ' +
    'node (zero sign changes, no interior turning point, worst-case relative margin ~0.488) and the ' +
    'recomputed endpoints reproduce 2561.39 / 2558.12 / 2555.18 verbatim (top < center < lo). So the worst ' +
    'case is provably the band TOP and the fixed-point 2558.12 sits strictly between the edges. EVIDENCE, ' +
    'NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: star_over_H2 rests on the gamma(n)/k eps ' +
    'surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Measurement/derivation only on the inherited imp-3220/imp-3406 surrogate crossover map; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34906 (2555/2558 reconciliation asserting monotonicity); imp-34883 (k=10 band-min 2555.18x); ' +
    'imp-34843 (single-G center 2558.1x); imp-34817 (n_op* = G/((1+G) eps) contraction-validity ceiling); ' +
    'imp-34799 ((H2)-margin ceiling n_op^max = delta FP_LO/eps); imp-34693 (admissible seed band ' +
    'rho(1,k) = (1-L)/[(1-L_c) L^k]); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse; slope dN/dT0 = u/2 pi). ' +
    'Chain rule / logarithmic differentiation: standard.',
};

export const IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE_ASSERTIONS = [
  {
    // The closed-form a-prime(N) matches a symmetric finite difference of a(N) at every seed.
    id: 'imp34929-aprime-closed-form-matches-fd',
    description: 'closed-form a-prime(N) = -4 pi^2 K (u+1)/(T0^2 u^3) matches a symmetric FD of a(N) at all seeds',
    holds: () => APRIME_MATCHES_FD === true,
  },
  {
    // d(log S)/dN is strictly negative at every node of the dense k=10 band sweep.
    id: 'imp34929-log-derivative-strictly-negative-bandwide',
    description: 'the closed-form d(log S)/dN is strictly negative at all 4000 nodes across the widest k=10 band',
    holds: () => ALL_NEGATIVE === true && MAX_LOG_DERIV < 0,
  },
  {
    // No interior turning point: the derivative keeps one sign, worst-case relative margin bounded from 0.
    id: 'imp34929-no-interior-turning-point',
    description: 'zero sign changes across the band and worst-case relative margin ~0.488 (bounded away from 0)',
    holds: () => NO_INTERIOR_TURNING_POINT === true && SIGN_CHANGES === 0 && WORST_REL_MARGIN > 0.4 && WORST_REL_MARGIN < 0.6,
  },
  {
    // The recomputed endpoints strictly decrease and reproduce the published imp-34906 headroom literals.
    id: 'imp34929-endpoints-reproduce-published',
    description: 'top < center < lo and endpoints reproduce imp-34906 2561.39 / 2558.12 / 2555.18',
    holds: () =>
      ENDPOINTS_ORDERED === true &&
      Math.abs(S_LO - 2561.3937) < 0.01 &&
      Math.abs(S_CENTER - 2558.123) < 0.01 &&
      Math.abs(S_TOP - 2555.1835) < 0.01,
  },
  {
    // Honesty gate: derivation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34929-honesty-gate-no-qed',
    description: 'derivation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE.isRigorous === false &&
      /imp-34714a/.test(IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE.subGap) &&
      /REMAINS OPEN/.test(IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE.subGap) &&
      /NO QED/.test(IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE.verdict) &&
      /refereed bound is changed/i.test(IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE.verdict),
  },
];

for (const a of IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34929-krawczyk-headroom-monotonicity-derivative assertion failed: ${a.id}`);
  }
}
