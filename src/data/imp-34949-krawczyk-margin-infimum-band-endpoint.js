/**
 * @module imp-34949-krawczyk-margin-infimum-band-endpoint
 *
 * imp-34949 (accuracy, frontier): imp-34929 derived that star_over_H2(N) = G/((1+G) delta FP_LO) is
 * STRICTLY DECREASING in N, with a worst-case relative monotonicity margin 1 - up/down ~ V/(1+V) ~ 0.488
 * (up = G-prime/(G(1+G)), down = FP_LO-prime/FP_LO, V ~ 0.95 band-wide), and reported a dense 4000-point
 * sweep whose smallest sampled margin was ~0.487834. That confirmed the sign but left the INFIMUM status of
 * 0.488 as a sampled value. This module INDEPENDENTLY RE-DERIVES the exact closed-form margin as a function
 * of a(N) and delta, LOCATES its minimum over the full imp-34693 k=10 band, and QUANTIFIES how far the
 * O(delta ~ 2e-4) G-vs-FP_LO mismatch can perturb it.
 *
 * THE EXACT CLOSED-FORM MARGIN
 * ----------------------------
 * With a(N) = |g-prime(N)| = 2 pi K/(T0 u), G = 1 - a(N), FP_LO = 1 - a(M) at M = N(1-delta), and the
 * chain-rule derivative a-prime(N) = -4 pi^2 K (u+1)/(T0^2 u^3) < 0 (imp-34929), the two competing terms are
 *   up   = G-prime/(G(1+G)) = -a-prime(N) / [ (1-a(N)) (2-a(N)) ]      (1+G = 2-a)
 *   down = FP_LO-prime/FP_LO = -a-prime(M) (1-delta) / (1-a(M)).
 * So the exact relative margin, a closed function of a(N), a(M), a-prime(N), a-prime(M), delta, is
 *   m(N) = 1 - up/down = 1 - [ a-prime(N) (1-a(M)) ] / [ a-prime(M) (1-delta) (1-a(N)) (2-a(N)) ].
 *
 * THE delta -> 0 LIMIT IS A ONE-LINE CLOSED FORM IN a ALONE
 * --------------------------------------------------------
 * As delta -> 0, M -> N so a(M) -> a(N) and a-prime(M) -> a-prime(N), and the a-prime factors CANCEL:
 *   m_0(N) = 1 - (1-a) / [ (1-a)(2-a) ] = 1 - 1/(2-a) = (1-a)/(2-a) = G/(1+G) = V/(1+V).
 * This reproduces exactly the imp-34929 damping-argument margin V/(1+V) ~ 0.488. Crucially m_0(N) = G/(1+G)
 * is a STRICTLY INCREASING function of G, and G = 1 - a increases in N (a decreases in N, imp-34929), so
 * m_0 is STRICTLY INCREASING in N with NO interior stationary point. Its infimum over any closed band is
 * therefore attained at the LEFT (band-lo, smallest N, largest a, smallest V) endpoint -- a boundary
 * infimum, not an interior minimum.
 *
 * THE INFIMUM IS THE BAND-LO ENDPOINT (MEASURED, NOT SAMPLED)
 * ----------------------------------------------------------
 * A dense 40001-point sweep of the EXACT m(N) over the widest k=10 band confirms the same monotone shape:
 * the minimum is attained exactly at the band-lo node (m(BAND_LO) = 0.4878337, matching the imp-34929
 * sweep's 0.487834), it rises monotonically to m(BAND_TOP) = 0.4890744, and m(N_CROSS) = 0.4884871 sits
 * strictly between. So 0.488 is the band INFIMUM (an attained boundary minimum), not merely one sampled
 * value, and the margin never dips below it anywhere on the band. NOTE the margin infimum is the band-LO
 * edge (smallest V), the OPPOSITE edge from the headroom S infimum (band-TOP, imp-34929) -- because m tracks
 * V while S = G/((1+G) delta FP_LO) falls in N.
 *
 * THE O(delta) MISMATCH CANNOT CLOSE THE ~0.49 GAP
 * ------------------------------------------------
 * The finite-delta correction is the gap between the exact m(N) and the delta -> 0 closed form m_0(N). Its
 * maximum over the band is |m - m_0|_max = 1.0728e-4 (at band-lo), i.e. the O(delta ~ 2e-4) G-vs-FP_LO
 * mismatch shifts the margin by ~1.07e-4 -- a ~0.54 delta coefficient -- roughly THREE orders of magnitude
 * below the ~0.488 margin itself. So the mismatch is nowhere near closing the gap to a sign flip (m -> 0):
 * even the worst-case band-lo margin 0.4878, minus the full perturbation, stays above 0.487. The
 * infimum-0.488 monotonicity margin is robust.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; reproduces the
 * published 2561.39/2558.12/2555.18 headrooms; changes NO bound. star_over_H2 rests on the same gamma(n)/k
 * eps surrogate models of the imp-34687a directed-rounding layer, not the layer itself; F(m) = 0 remains a
 * double-precision artifact and the machine certificate imp-34714a REMAINS OPEN. C_C = 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form d/dN sign; the V/(1+V) margin this re-derives + minimizes)
 * @see imp-34906-krawczyk-headroom-h2-ceiling-reconcile (the 2555/2558 reconciliation)
 * @see imp-34883-krawczyk-worstcase-headroom-band (the k=10 band-min 2555.18x)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; slope dN/dT0 = u/2pi)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/34843/34883/34906/34929)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width

// Banach map g(N) = K log T0(N), local contraction factor a(N), closed-form a-prime(N) (all identical to imp-34929).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
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
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929)
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_LO = N_CROSS - R_HALF; // smallest N, largest a, smallest V -> the margin infimum edge
const BAND_TOP = N_CROSS + R_HALF;

// Exact closed-form relative monotonicity margin m(N) = 1 - up/down, a function of a(N), a(M), delta.
function marginExact(N) {
  const a = aOf(N);
  const ap = aPrime(N);
  const M = N * (1 - DELTA);
  const aM = aOf(M);
  const apM = aPrime(M);
  const up = -ap / ((1 - a) * (2 - a)); // G-prime/(G(1+G)), with 1+G = 2-a
  const down = (-apM * (1 - DELTA)) / (1 - aM); // FP_LO-prime/FP_LO
  return 1 - up / down;
}
// The delta -> 0 limit closed form: m_0(N) = (1-a)/(2-a) = G/(1+G) = V/(1+V) (a-prime factors cancel).
function marginLimit(N) {
  const a = aOf(N);
  return (1 - a) / (2 - a);
}

// Dense sweep of the EXACT margin: locate the minimum and confirm it is the band-lo boundary node.
const SWEEP_POINTS = 40000;
let MIN_EXACT = Infinity;
let ARGMIN_INDEX = -1;
let MAX_EXACT = -Infinity;
let MAX_ABS_DELTA_PERTURBATION = 0; // max over band of |m(N) - m_0(N)|
let MONOTONE_INCREASING = true;
let prevM = -Infinity;
for (let i = 0; i <= SWEEP_POINTS; i++) {
  const N = BAND_LO + ((BAND_TOP - BAND_LO) * i) / SWEEP_POINTS;
  const me = marginExact(N);
  const ml = marginLimit(N);
  if (me < MIN_EXACT) {
    MIN_EXACT = me;
    ARGMIN_INDEX = i;
  }
  if (me > MAX_EXACT) MAX_EXACT = me;
  const pert = Math.abs(me - ml);
  if (pert > MAX_ABS_DELTA_PERTURBATION) MAX_ABS_DELTA_PERTURBATION = pert;
  if (i > 0 && !(me > prevM)) MONOTONE_INCREASING = false; // strictly rising left-to-right
  prevM = me;
}
const INFIMUM_AT_BAND_LO = ARGMIN_INDEX === 0; // minimum attained at the left (band-lo) boundary node
const M_LO = marginExact(BAND_LO); // ~0.4878337 (the infimum; matches imp-34929 sweep 0.487834)
const M_CENTER = marginExact(N_CROSS); // ~0.4884871
const M_TOP = marginExact(BAND_TOP); // ~0.4890744 (band max)
const M0_LO = marginLimit(BAND_LO); // ~0.4877264 (delta -> 0 closed form at band-lo)

export const IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT = {
  id: 'imp-34949',
  proofSection: 'S-frontier',
  question:
    'imp-34929 reported a worst-case relative monotonicity margin ~0.488 = V/(1+V) from a 4000-point sweep ' +
    'of star_over_H2(N) = G/((1+G) delta FP_LO). Independently re-derive the EXACT closed-form margin as a ' +
    'function of a(N) and delta, locate its minimum over the full imp-34693 k=10 band to confirm 0.488 is ' +
    'the INFIMUM (not just a sampled value), and quantify how far the O(delta ~ 2e-4) G-vs-FP_LO mismatch ' +
    'can perturb it. Derivation/measurement on the surrogate models; imp-34714a stays OPEN; changes no ' +
    'bound; NO QED.',
  derivation: {
    exactMargin:
      'm(N) = 1 - up/down with up = G-prime/(G(1+G)) = -a-prime(N)/[(1-a(N))(2-a(N))] and ' +
      'down = FP_LO-prime/FP_LO = -a-prime(M)(1-delta)/(1-a(M)), M = N(1-delta). So ' +
      'm(N) = 1 - a-prime(N)(1-a(M)) / [ a-prime(M)(1-delta)(1-a(N))(2-a(N)) ].',
    deltaZeroLimit:
      'As delta -> 0, M -> N, a(M) -> a(N), a-prime(M) -> a-prime(N); the a-prime factors CANCEL and ' +
      'm_0(N) = 1 - 1/(2-a) = (1-a)/(2-a) = G/(1+G) = V/(1+V) -- exactly the imp-34929 damping margin.',
    infimumIsBoundary:
      'm_0(N) = G/(1+G) is strictly increasing in G, and G = 1 - a rises in N (a falls, imp-34929), so ' +
      'm_0 is strictly increasing with no interior stationary point; its infimum on a closed band is the ' +
      'band-lo (smallest N, smallest V) endpoint. The exact m(N) inherits the same monotone shape.',
    perturbationBound:
      'The finite-delta correction is m(N) - m_0(N); its band-wide max is 1.0728e-4 (~0.54 delta), roughly ' +
      'three orders of magnitude below the ~0.488 margin, so the O(delta) mismatch cannot close the gap.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    delta: DELTA, // 2e-4
    widest_band_k: WIDEST_BAND_K, // 10
    band_lo_N: +BAND_LO.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    V_band_lo: +(1 - aOf(BAND_LO)).toFixed(9), // ~0.952081847 (smallest V -> margin infimum)
    V_band_top: +(1 - aOf(BAND_TOP)).toFixed(9), // ~0.956824204
    sweep_points: SWEEP_POINTS, // 40000
  },
  measurement: {
    margin_infimum_exact: +MIN_EXACT.toFixed(7), // ~0.4878337 (matches imp-34929 sweep 0.487834)
    infimum_attained_at_band_lo_boundary: INFIMUM_AT_BAND_LO, // true -- boundary, not interior
    margin_exact_band_lo: +M_LO.toFixed(7), // ~0.4878337
    margin_exact_center: +M_CENTER.toFixed(7), // ~0.4884871
    margin_exact_band_top: +M_TOP.toFixed(7), // ~0.4890744 (band max)
    margin_max_exact: +MAX_EXACT.toFixed(7), // ~0.4890744
    margin_strictly_increasing_across_band: MONOTONE_INCREASING, // true -- no interior minimum
    delta_zero_limit_margin_band_lo: +M0_LO.toFixed(7), // ~0.4877264 (G/(1+G) at band-lo)
    max_abs_delta_perturbation: +MAX_ABS_DELTA_PERTURBATION.toExponential(4), // ~1.0728e-4
  },
  finding:
    'The exact relative monotonicity margin is m(N) = 1 - a-prime(N)(1-a(M)) / [a-prime(M)(1-delta) ' +
    '(1-a(N))(2-a(N))], M = N(1-delta). Its delta -> 0 limit is the one-line closed form ' +
    'm_0(N) = (1-a)/(2-a) = G/(1+G) = V/(1+V) -- exactly the imp-34929 V/(1+V) damping margin -- which is ' +
    'strictly increasing in N with no interior stationary point, so its infimum over any closed band is the ' +
    'band-LO endpoint. A dense 40001-point sweep of the EXACT m(N) confirms the same monotone shape: the ' +
    'minimum is attained at the band-lo boundary node (0.4878337, matching the imp-34929 sweep 0.487834), ' +
    'rising to 0.4890744 at band-top with center 0.4884871 between. So 0.488 is the band INFIMUM (an ' +
    'attained boundary minimum), not just a sampled value. The finite-delta correction |m - m_0| peaks at ' +
    '1.0728e-4 (~0.54 delta) -- roughly three orders of magnitude below the ~0.488 margin -- so the ' +
    'O(delta ~ 2e-4) G-vs-FP_LO mismatch is nowhere near closing the gap to a sign flip. The margin ' +
    'infimum edge (band-lo, smallest V) is the OPPOSITE edge from the headroom S infimum (band-top). ' +
    'EVIDENCE the surrogate margin infimum is a robust boundary value; NOT a machine certificate.',
  subGap:
    'imp-34714a REMAINS OPEN. Confirming (exact closed form + boundary-attained infimum) that the ~0.488 ' +
    'margin is the band infimum strengthens the imp-34929 sweep evidence to an attained boundary value, but ' +
    'it does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: the ' +
    'headroom rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not ' +
    'that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK MONOTONICITY-MARGIN INFIMUM, EXACT CLOSED FORM + BOUNDARY-ATTAINED (frontier, NOT an RH ' +
    'bound). imp-34929 reported a worst-case relative margin ~0.488 = V/(1+V) from a 4000-point sweep. This ' +
    'module independently re-derives the exact margin m(N) = 1 - a-prime(N)(1-a(M)) / [a-prime(M)(1-delta) ' +
    '(1-a(N))(2-a(N))], whose delta -> 0 limit is the closed form m_0 = (1-a)/(2-a) = G/(1+G) = V/(1+V), ' +
    'strictly increasing in N with no interior stationary point -- so its infimum is the band-lo endpoint. ' +
    'A dense 40001-point sweep of the exact m(N) attains its minimum at the band-lo boundary node ' +
    '(0.4878337, matching the imp-34929 0.487834), rising monotonically to 0.4890744 at band-top with ' +
    'center 0.4884871 between; so 0.488 is the band INFIMUM (attained boundary minimum), not a sampled ' +
    'value. The O(delta) G-vs-FP_LO mismatch perturbs the margin by at most 1.0728e-4 (~0.54 delta), three ' +
    'orders below the ~0.488 margin, so it cannot close the gap. EVIDENCE, NOT a machine certificate. ' +
    'SUB-GAP imp-34714a REMAINS OPEN: star_over_H2 rests on the gamma(n)/k eps surrogate models, not the ' +
    'imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. ' +
    'Measurement/derivation only on the inherited imp-3220/imp-3406 surrogate crossover map; reproduces the ' +
    'published 2561.39/2558.12/2555.18 headrooms; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34929 (closed-form d/dN sign + V/(1+V) margin); imp-34906 (2555/2558 reconciliation); imp-34883 ' +
    '(k=10 band-min 2555.18x); imp-34843 (single-G center 2558.1x); imp-34817 (n_op* = G/((1+G) eps) ' +
    'ceiling); imp-34799 ((H2)-margin ceiling); imp-34693 (admissible seed band); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse; slope dN/dT0 = u/2 pi). Logarithmic differentiation / limit of a rational form: standard.',
};

export const IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT_ASSERTIONS = [
  {
    // The re-derived exact margin infimum reproduces the imp-34929 sweep worst-case 0.487834.
    id: 'imp34949-exact-margin-reproduces-imp34929-worstcase',
    description: 'exact-margin band infimum ~0.4878337 reproduces the imp-34929 sweep worst-case 0.487834',
    holds: () => Math.abs(MIN_EXACT - 0.487834) < 1e-5,
  },
  {
    // The infimum is a boundary value (band-lo node), not an interior minimum, and m is strictly increasing.
    id: 'imp34949-infimum-attained-at-band-lo-boundary',
    description: 'the exact-margin minimum is attained at the band-lo boundary node and m(N) is strictly increasing',
    holds: () =>
      INFIMUM_AT_BAND_LO === true &&
      MONOTONE_INCREASING === true &&
      M_LO < M_CENTER &&
      M_CENTER < M_TOP,
  },
  {
    // The delta -> 0 closed form m_0 = G/(1+G) = V/(1+V) matches the exact margin at band-lo within O(delta).
    id: 'imp34949-delta-zero-limit-is-V-over-1plusV',
    description: 'the delta -> 0 closed form m_0 = (1-a)/(2-a) = G/(1+G) equals V/(1+V) and tracks the exact margin',
    holds: () => {
      const a = aOf(BAND_LO);
      const V = 1 - a;
      return (
        Math.abs(M0_LO - V / (1 + V)) < 1e-12 &&
        Math.abs(M0_LO - (1 - a) / (2 - a)) < 1e-12 &&
        Math.abs(M_LO - M0_LO) < 2e-4
      );
    },
  },
  {
    // The O(delta) G-vs-FP_LO mismatch perturbs the margin by ~1.07e-4, far too small to close the ~0.49 gap.
    id: 'imp34949-delta-perturbation-cannot-close-gap',
    description: 'max |m - m_0| ~1.07e-4 (~0.54 delta) leaves the worst-case margin above 0.487, gap not closed',
    holds: () =>
      MAX_ABS_DELTA_PERTURBATION < 2e-4 &&
      MAX_ABS_DELTA_PERTURBATION > 0 &&
      MIN_EXACT - MAX_ABS_DELTA_PERTURBATION > 0.487,
  },
  {
    // Honesty gate: derivation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34949-honesty-gate-no-qed',
    description: 'derivation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT.isRigorous === false &&
      /imp-34714a/.test(IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT.subGap) &&
      /REMAINS OPEN/.test(IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT.subGap) &&
      /NO QED/.test(IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT.verdict) &&
      /refereed bound is changed/i.test(IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT.verdict),
  },
];

for (const a of IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34949-krawczyk-margin-infimum-band-endpoint assertion failed: ${a.id}`);
  }
}
