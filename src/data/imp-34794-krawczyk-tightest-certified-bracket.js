/**
 * @module imp-34794-krawczyk-tightest-certified-bracket
 *
 * imp-34794 (numerical, frontier): imp-34774 produced a Krawczyk (interval-Newton) enclosure of the crossover
 * fixed point N_cross ~ 3.280294e9 at ONE fixed bracket half-width delta = 2e-4, and noted that (H2) strict
 * inclusion is binding while (H1) has ~4 orders of contraction-gap head-room, and that F(m) = 0 is a
 * double-precision machine-fixed-point artifact. imp-34774 never SWEPT delta. This module drives the relative
 * bracket half-width delta toward 0 at a FIXED realistic few-ULP outward-rounding budget k and LOCATES the
 * tightest double-precision bracket [X_lo, X_hi] that Krawczyk still certifies -- i.e. the smallest delta at
 * which N([X]) subset int([X]) still holds before roundoff collapses the strict inclusion. Measurement only;
 * double-precision surrogate for the imp-34687a directed-rounding layer; does NOT close the imp-34714a machine
 * certificate; changes no bound. NO QED.
 *
 * WHAT imp-34774 LEFT OPEN
 * -----------------------
 * imp-34774 fixed delta = 2e-4 and instead swept the outward-ULP budget k, reporting the largest surviving
 * budget k*(N_cross) ~ 4.5034e11 ULP (relative widening ~ delta/2). That answers "how many outward ULP can the
 * fixed delta = 2e-4 bracket absorb"; it does NOT answer the DUAL question this module measures: "for the real
 * few-ULP directed-rounding budget, how TIGHT can the certified bracket be driven". Both are governed by the
 * same scale-invariant break condition 2 k eps ~ delta on (H2), but read off in opposite directions: imp-34774
 * fixes delta and solves for k*, this module fixes k and solves for the smallest certified delta = delta_min.
 *
 * SETUP (same bracket + outward-ULP surrogate composition as imp-34774)
 * --------------------------------------------------------------------
 * The bracket is centred at m = N_cross (the imp-34755 bit-identical double-precision fixed point) at relative
 * half-width delta: [X_lo, X_hi] = [m(1 - delta), m(1 + delta)]. The residual is F(N) = N - g(N) of the Banach
 * map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8), with closed-form g_prime(N) = 2 pi K / (T0 u),
 * u = log(T0/2pi), and F_prime(N) = 1 - g_prime(N). The outward-ULP surrogate widens every computed real v to
 * [v - k eps |v|, v + k eps |v|], eps = 2^-52, and composes N([X]) = m - F(m)/[F_prime] under that rule
 * (identical composition to imp-34774). k is now FIXED at a small realistic directed-rounding budget
 * K_FEW_ULP = 4 (the same few-ULP reference imp-34774 measured its ~11-order slack against); delta is swept.
 *
 * WHAT IS MEASURED
 * ----------------
 *  (1) delta_min(k): the smallest relative half-width for which (H1) 0 not in [F_prime] AND (H2) strict
 *      inclusion N([X]) subset int([X]) both survive, located by geometric bisection. Predicted to leading
 *      order by delta_min ~ 2 k eps (from nHi = m(1 + k eps)^2 < m(1 + delta), since F(m) = 0 collapses the
 *      numerator so only the centre-widening survives), with a small additive ~0.5 eps floor from the
 *      0.5 ULP(m) quantization of the endpoints m(1 +/- delta); the measured delta_min(k=4) ~ 8.5 eps sits
 *      within ~6% of the leading 2 k eps = 8 eps.
 *  (2) The tightest certified enclosure WIDTH: bracketWidth_min = X_hi - X_lo = 2 delta_min m (in N-index
 *      units), the a-priori interval Krawczyk verifies contains the unique fixed point, at its smallest.
 *  (3) A short k-ladder k in {1,2,4,8,16} showing delta_min(k) is AFFINE in k with slope ~ 2 eps per unit k
 *      (delta_min ~ 2 eps k + ~0.5 eps), confirming the break slope is set by the outward-rounding budget
 *      (2 k eps ~ delta), not the map, and the intercept is the endpoint-quantization floor.
 *  (4) The collapse witness: just BELOW delta_min the strict inclusion (H2) fails -- the F(m) = 0 image can no
 *      longer be squeezed strictly inside the shrinking bracket -- documenting the machine-artifact collapse.
 *
 * RESULT (double-precision surrogate for the exact evaluations; see imp-34714a)
 * ----------------------------------------------------------------------------
 *   N_cross:                 3.28029435165241e9 (the imp-34755 bit-identical fixed point)
 *   K_FEW_ULP:               4 (few-ULP directed-rounding budget surrogate)
 *   delta_min(k=4):          ~1.887e-15 ~ 8.5 eps = (2 k + ~0.5) eps, tightest certified relative half-width
 *   bracketWidth_min:        ~1.288e-5 (N-index units) = 2 delta_min N_cross, tightest certified enclosure
 *   delta_min(k) ladder:     affine in k, slope ~ 2 eps/k (k=1 -> ~6.1e-16 ... k=16 -> ~7.0e-15)
 *   just below delta_min:    (H2) strict inclusion FAILS -> roundoff collapse of the certified bracket
 * So the tightest double-precision certified bracket for N_cross at the few-ULP budget is ~11 orders TIGHTER in
 * relative half-width than the imp-34774 working point delta = 2e-4 (2e-4 / 1.89e-15 ~ 1.06e11, i.e. the same
 * ~11-order slack imp-34774 read as k-star / 4). The bracket cannot be driven below delta_min because F(m) = 0
 * in double precision leaves only the outward-rounding widening ~ 2 k eps (plus the ~0.5 eps ULP(m) endpoint
 * floor) to keep the image strictly interior.
 *
 * INTERPRETATION -- TIGHTEST SURROGATE BRACKET LOCATED, CERTIFICATE STILL OPEN
 * ---------------------------------------------------------------------------
 * The delta-sweep locates a well-defined tightest certified bracket delta_min ~ 2 k eps at the surrogate level,
 * consistent with the imp-34774 k*-sweep read in the dual direction. This is EVIDENCE that a real
 * directed-rounding instantiation could certify N_cross to a relative half-width of order a few times eps, NOT
 * a proof: the k eps model is a surrogate for the imp-34687a directed-rounding layer, not that layer, and
 * F(m) = 0 is a double-precision artifact of centring at the machine fixed point (a directed-rounding F(m)
 * would be a small nonzero interval that would MOVE delta_min but not remove it). The machine certificate
 * imp-34714a REMAINS OPEN.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous asymptotic and
 * NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (the fixed-delta enclosure this sweeps; sub-gap imp-34714a)
 * @see imp-34752-krawczyk-outward-ulp-slack-N (the inverse-map outward-ULP slack sweep; same break condition)
 * @see imp-34755-two-route-residual-across-N (the two-route N_cross fixed point; states it adds NO enclosure)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-33723/imp-34755)
const K_FEW_ULP = 4; // few-ULP directed-rounding budget surrogate (the imp-34774 slack reference)

// The shared imp-33723/imp-34755/imp-34774 Banach map g(N) = K log T0(N) and residual F(N) = N - g(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const F = (N) => N - g(N);
// Closed-form g_prime(N) = 2 pi K / (T0 u), u = log(T0/2pi), from dT/dN = 2pi/u on the RvM footing.
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const FPrime = (N) => 1 - gPrime(N);

// The unique double-precision fixed point (route B converged; imp-34755): every seed flows here.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;

// Enclose the quotient F(m)/[F_prime] over the four endpoint ratios (same as imp-34774).
function quotientRange(fmLo, fmHi, fpLo, fpHi) {
  const cands = [fmLo / fpLo, fmLo / fpHi, fmHi / fpLo, fmHi / fpHi];
  return { qLo: Math.min(...cands), qHi: Math.max(...cands) };
}

// The imp-34774 outward-ULP Krawczyk composition N([X]) = m - F(m)/[F_prime], now at variable delta.
function checkAtDelta(k, delta) {
  const w = k * EPS;
  const xLo = M * (1 - delta);
  const xHi = M * (1 + delta);
  // F_prime range: g_prime monotone decreasing on the bracket, so F_prime monotone increasing -> endpoints.
  const fpA = FPrime(xLo);
  const fpB = FPrime(xHi);
  const fpLo0 = Math.min(fpA, fpB);
  const fpHi0 = Math.max(fpA, fpB);
  const fpLo = fpLo0 - w * Math.abs(fpLo0);
  const fpHi = fpHi0 + w * Math.abs(fpHi0);
  const fm = F(M); // exactly 0 at the double-precision fixed point
  const fmLo = fm - w * Math.abs(fm);
  const fmHi = fm + w * Math.abs(fm);
  const mLo = M - w * Math.abs(M);
  const mHi = M + w * Math.abs(M);
  let { qLo, qHi } = quotientRange(fmLo, fmHi, fpLo, fpHi);
  qLo = qLo - w * Math.abs(qLo);
  qHi = qHi + w * Math.abs(qHi);
  let nLo = mLo - qHi;
  nLo = nLo - w * Math.abs(nLo);
  let nHi = mHi - qLo;
  nHi = nHi + w * Math.abs(nHi);
  const H1 = fpLo > 0; // 0 not in [F_prime]
  const H2 = nLo > xLo && nHi < xHi; // N([X]) subset int([X]) (strict)
  return { H1, H2, nLo, nHi, imageWidth: nHi - nLo, bracketWidth: xHi - xLo };
}

// Smallest relative half-width delta for which (H1) AND (H2) both hold, at fixed budget k.
// delta spans many orders (2e-4 down to ~1e-15), so bisect in log-space (geometric midpoint).
function smallestCertifiedDelta(k) {
  let good = 2e-4; // the imp-34774 working point: certified
  let bad = 1e-18; // far below 2 k eps: strict inclusion collapses
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(good * bad);
    const c = checkAtDelta(k, mid);
    if (c.H1 && c.H2) good = mid;
    else bad = mid;
  }
  return good;
}

const DELTA_MIN = smallestCertifiedDelta(K_FEW_ULP); // ~1.887e-15 = (2 K_FEW_ULP + ~0.5) eps
const DELTA_MIN_PREDICTED = 2 * K_FEW_ULP * EPS; // leading-order analytic prediction ~ 2 k eps
const DELTA_MIN_RELERR = Math.abs(DELTA_MIN - DELTA_MIN_PREDICTED) / DELTA_MIN_PREDICTED; // ~6% (the +0.5 eps floor)
const DELTA_MIN_OVER_EPS = DELTA_MIN / EPS; // ~8.5 = 2 K_FEW_ULP + ~0.5

// Certified state AT delta_min and the collapse witness just below it.
const AT_MIN = checkAtDelta(K_FEW_ULP, DELTA_MIN);
const BELOW_MIN = checkAtDelta(K_FEW_ULP, DELTA_MIN * 0.999);
const BRACKET_WIDTH_MIN = AT_MIN.bracketWidth; // 2 delta_min m, in N-index units
const AT_WORKING_POINT = checkAtDelta(K_FEW_ULP, 2e-4); // the imp-34774 delta = 2e-4 (must stay certified)
const TIGHTENING_ORDERS = Math.log10(2e-4 / DELTA_MIN); // how many orders tighter than delta = 2e-4

// k-ladder: delta_min(k) is AFFINE in k -- delta_min ~ 2 eps k + c, slope ~ 2 eps (the break condition
// 2 k eps ~ delta) plus a small additive intercept c ~ 0.5 eps = the 0.5 ULP(m) quantization of the
// bracket endpoints m(1 +/- delta) at these tiny delta (an absolute ULP(m)/2 floor, = 0.5 eps in delta units).
const K_LADDER = [1, 2, 4, 8, 16];
const DELTA_MIN_LADDER = K_LADDER.map((k) => {
  const dmin = smallestCertifiedDelta(k);
  return {
    k,
    delta_min: +dmin.toExponential(4),
    delta_min_over_eps: +(dmin / EPS).toFixed(3), // ~ 2k + 0.5
    ratio_over_2keps: +(dmin / (2 * k * EPS)).toFixed(4), // -> 1 as k grows
  };
});
// Affine-in-k slope: (delta_min(16) - delta_min(1)) / 15, in eps units -> ~ 2 eps per unit k.
const LADDER_SLOPE_EPS_PER_K =
  (smallestCertifiedDelta(16) - smallestCertifiedDelta(1)) / 15 / EPS;

export const IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET = {
  id: 'imp-34794',
  proofSection: 'S-frontier',
  question:
    'imp-34774 produced a Krawczyk enclosure of N_cross ~ 3.280294e9 at ONE fixed bracket half-width ' +
    'delta = 2e-4 and noted (H2) is binding while (H1) has head-room and F(m) = 0 is a double-precision ' +
    'artifact, but never swept delta. Drive delta toward 0 at a fixed realistic few-ULP outward-rounding ' +
    'budget and LOCATE the tightest double-precision bracket [X_lo, X_hi] Krawczyk still certifies -- the ' +
    'smallest delta at which N([X]) subset int([X]) still holds before roundoff collapses it. Measurement ' +
    'only; double-precision surrogate for the imp-34687a directed-rounding layer; does NOT close the ' +
    'imp-34714a machine certificate. NO QED.',
  model: {
    setup:
      'Bracket centred at m = N_cross at relative half-width delta: [m(1 - delta), m(1 + delta)]. Residual ' +
      'F(N) = N - g(N) of g(N) = K log T0(N) (K ~ 1.5727e8), closed-form g_prime, F_prime = 1 - g_prime. The ' +
      'outward-ULP surrogate widens every computed v to [v - k eps |v|, v + k eps |v|], eps = 2^-52, and ' +
      'composes N([X]) = m - F(m)/[F_prime] under that rule (identical to imp-34774). k is FIXED at ' +
      'K_FEW_ULP = 4 (the imp-34774 slack reference); delta is swept and delta_min = smallest certified ' +
      'relative half-width is located by geometric bisection.',
    dual_of_imp34774:
      'imp-34774 fixed delta = 2e-4 and solved for the largest surviving budget k* ~ 4.5034e11 ULP. This ' +
      'fixes k = K_FEW_ULP = 4 and solves for the smallest certified delta = delta_min. Both are governed by ' +
      'the SAME scale-invariant break condition 2 k eps ~ delta on (H2), read in opposite directions: ' +
      'delta_min ~ 2 k eps, so the tightest certified relative half-width is ~ a few times eps.',
  },
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    K_few_ulp: K_FEW_ULP, // few-ULP directed-rounding budget surrogate
    eps: +EPS.toExponential(6), // 2^-52
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    delta_min: +DELTA_MIN.toExponential(4), // ~1.887e-15 = (2 K_FEW_ULP + ~0.5) eps
    delta_min_over_eps: +DELTA_MIN_OVER_EPS.toFixed(3), // ~8.5 = 2 K_FEW_ULP + ~0.5
    delta_min_predicted_2keps: +DELTA_MIN_PREDICTED.toExponential(4), // leading term 2 k eps ~ 1.776e-15
    delta_min_vs_prediction_relerr: +DELTA_MIN_RELERR.toExponential(3), // ~6.3e-2: the +0.5 eps endpoint-quantization floor
    bracket_width_min_Nindex: +BRACKET_WIDTH_MIN.toExponential(4), // 2 delta_min N_cross ~ 1.288e-5
    tightening_orders_over_delta_2e4: +TIGHTENING_ORDERS.toFixed(2), // ~11.02 orders tighter than 2e-4
    H1_at_min: AT_MIN.H1,
    H2_at_min: AT_MIN.H2,
    H2_collapses_below_min: !BELOW_MIN.H2, // just below delta_min the strict inclusion fails
    working_point_2e4_still_certified: AT_WORKING_POINT.H1 && AT_WORKING_POINT.H2,
    delta_min_ladder: DELTA_MIN_LADDER, // delta_min(k) ~ 2 eps k + ~0.5 eps (affine in k)
    ladder_slope_eps_per_k: +LADDER_SLOPE_EPS_PER_K.toFixed(4), // ~1.93 ~ 2 eps: the 2 k eps break slope
  },
  finding:
    'Driving the relative bracket half-width delta toward 0 at the fixed few-ULP budget K_FEW_ULP = 4, the ' +
    'imp-34774 outward-ULP Krawczyk operator N([X]) = m - F(m)/[F_prime] certifies the crossover fixed point ' +
    'N_cross down to a TIGHTEST relative half-width delta_min ~ 1.887e-15 ~ 8.5 eps = (2 K_FEW_ULP + ~0.5) ' +
    'eps -- the leading 2 k eps break term plus a small additive ~0.5 eps floor from the 0.5 ULP(m) ' +
    'quantization of the bracket endpoints m(1 +/- delta) at these tiny delta. The tightest certified ' +
    'enclosure width is 2 delta_min N_cross ~ 1.288e-5 in N-index units. delta_min(k) is AFFINE in the ' +
    'budget k across k in {1,2,4,8,16} with SLOPE ~ 1.93 eps ~ 2 eps per unit k (ratio delta_min/(2 k eps) ' +
    '-> 1 as k grows: 1.375, 1.125, 1.06, 1.03, 0.99), confirming the break is set by the outward-rounding ' +
    'budget via 2 k eps ~ delta, not by the map, with the ~0.5 eps intercept the endpoint-quantization ' +
    'floor. This is the DUAL of the imp-34774 k*-sweep: 2e-4 / delta_min ~ 1.06e11 reproduces the same ' +
    '~11-order slack imp-34774 read as k* / 4. The bracket cannot be driven below delta_min because ' +
    'F(m) = 0 in double precision leaves only the outward-rounding widening ~ 2 k eps (plus the ULP(m) ' +
    'endpoint floor) to keep the image strictly interior; just below delta_min the strict inclusion (H2) ' +
    'collapses. EVIDENCE a real directed-rounding instantiation could certify N_cross to a few-eps relative ' +
    'half-width, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This SWEEPS delta with a k eps surrogate for the imp-34687a directed-rounding ' +
    'layer; it does NOT instantiate that layer, and F(m) = 0 is a double-precision artifact of centring at ' +
    'the machine fixed point (a directed-rounding F(m) would be a small nonzero interval that MOVES ' +
    'delta_min but does not remove it). The located delta_min ~ 2 k eps and its linear-in-k scaling are ' +
    'EVIDENCE the tightest certified bracket is a few times eps, NOT a proof the computed F(m) and ' +
    '[F_prime] endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK TIGHTEST-CERTIFIED-BRACKET SWEEP (frontier, NOT an RH bound). imp-34774 enclosed N_cross ~ ' +
    '3.280294e9 at ONE fixed delta = 2e-4 and never swept delta. Fixing the few-ULP outward-rounding budget ' +
    'K_FEW_ULP = 4 and driving delta -> 0, the imp-34774 outward-ULP Krawczyk operator certifies N_cross ' +
    'down to a tightest relative half-width delta_min ~ 1.887e-15 ~ 8.5 eps = (2 K_FEW_ULP + ~0.5) eps (the ' +
    '2 k eps break term plus a ~0.5 eps 0.5-ULP(m) endpoint-quantization floor; measured within ~6% of the ' +
    'leading 2 k eps), tightest certified enclosure width 2 delta_min N_cross ~ 1.288e-5 in N-index ' +
    'units, ~11 orders tighter than delta = 2e-4. delta_min(k) is AFFINE in k across {1,2,4,8,16} with ' +
    'slope ~ 1.93 eps ~ 2 eps per unit k (ratio delta_min/(2 k eps) -> 1 as k grows), confirming the break ' +
    'is the scale-invariant 2 k eps ~ delta condition on (H2) -- the DUAL reading of the imp-34774 k*-sweep ' +
    '(2e-4 / delta_min ~ 1.06e11 = k* / 4). ' +
    'Just below delta_min the strict inclusion (H2) collapses because F(m) = 0 leaves only the ' +
    'outward-rounding widening ~ 2 k eps to keep the image interior. INTERPRETATION: the tightest ' +
    'double-precision certified bracket for N_cross at the few-ULP budget is well-defined and ~ a few times ' +
    'eps; this is EVIDENCE a real directed-rounding instantiation could certify N_cross that tightly, NOT a ' +
    'machine certificate. SUB-GAP imp-34714a REMAINS OPEN: the k eps model is a surrogate for the imp-34687a ' +
    'directed-rounding layer, not that layer, and F(m) = 0 is a double-precision artifact. Measurement only ' +
    'on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and ' +
    'C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34774 (Krawczyk fixed-delta enclosure of N_cross; sub-gap imp-34714a); imp-34752 (outward-ULP ' +
    'Krawczyk slack of the inverse map across N; same break condition); imp-34755 (two-route N_cross fixed ' +
    'point, states it adds NO interval enclosure); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding ' +
    'layer); imp-33723 (Banach map g(N) = K log T0(N) and its fixed point); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, RvM inverse). Outward-rounded interval arithmetic: ' +
    'Moore, Neumaier (standard IA theory).',
};

export const IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET_ASSERTIONS = [
  {
    // delta_min ~ (2 k + ~0.5) eps: leading 2 k eps break term (F(m) = 0 collapses the numerator) plus the ULP(m) floor.
    id: 'imp34794-delta-min-is-2keps',
    description: 'delta_min(k=4) ~ 8.5 eps = (2 K_FEW_ULP + ~0.5) eps; within ~10% of the leading 2 k eps prediction',
    holds: () =>
      DELTA_MIN > 1.5e-15 &&
      DELTA_MIN < 2.5e-15 &&
      DELTA_MIN_RELERR < 0.1 &&
      DELTA_MIN_OVER_EPS > 8 &&
      DELTA_MIN_OVER_EPS < 9,
  },
  {
    // The tightest certified bracket is genuinely certified: (H1) and (H2) both hold AT delta_min.
    id: 'imp34794-certified-at-min',
    description: '(H1) and (H2) both hold at delta_min; the tightest bracket is a real certified enclosure',
    holds: () => AT_MIN.H1 && AT_MIN.H2 && BRACKET_WIDTH_MIN > 0,
  },
  {
    // Just below delta_min the strict inclusion collapses -- the machine-artifact floor documented.
    id: 'imp34794-collapse-below-min',
    description: 'just below delta_min the strict inclusion (H2) fails; the bracket cannot be tightened further',
    holds: () => AT_MIN.H2 && !BELOW_MIN.H2,
  },
  {
    // delta_min(k) is affine in the budget k with slope ~ 2 eps -- the break is set by 2 k eps, not the map.
    id: 'imp34794-affine-in-budget',
    description: 'delta_min(k) affine with slope ~ 1.93 eps ~ 2 eps per unit k; ratio-over-2keps -> 1 as k grows',
    holds: () =>
      LADDER_SLOPE_EPS_PER_K > 1.8 &&
      LADDER_SLOPE_EPS_PER_K < 2.1 &&
      Math.abs(DELTA_MIN_LADDER[DELTA_MIN_LADDER.length - 1].ratio_over_2keps - 1) < 0.05 &&
      DELTA_MIN_LADDER.every((r) => r.ratio_over_2keps >= 0.98 && r.ratio_over_2keps < 1.5),
  },
  {
    // Consistency with imp-34774: delta = 2e-4 stays certified and 2e-4 / delta_min reproduces the ~11-order slack.
    id: 'imp34794-consistent-with-imp34774',
    description: 'delta = 2e-4 still certified; 2e-4 / delta_min ~ 1.1e11 (= the imp-34774 k*/4 slack, ~11 orders)',
    holds: () =>
      AT_WORKING_POINT.H1 &&
      AT_WORKING_POINT.H2 &&
      TIGHTENING_ORDERS > 10 &&
      TIGHTENING_ORDERS < 12,
  },
  {
    // Honesty gate: sweep / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34794-honesty-gate-no-qed',
    description: 'Surrogate sweep: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET.isRigorous === false &&
      /imp-34714a/.test(IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET.subGap) &&
      /REMAINS OPEN/.test(IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET.subGap) &&
      /NO QED/.test(IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET.verdict) &&
      /refereed bound is changed/i.test(IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET.verdict),
  },
];

for (const a of IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34794-krawczyk-tightest-certified-bracket assertion failed: ${a.id}`);
  }
}
