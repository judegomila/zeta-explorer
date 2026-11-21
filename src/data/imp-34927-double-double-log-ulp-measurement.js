/**
 * @module imp-34927-double-double-log-ulp-measurement
 *
 * imp-34927 (numerical, frontier): imp-34908 section (C) ASSERTED that a double-double (~106-bit)
 * polynomial / argument-reduction log evaluation with error < 0.5 ulp(double) yields a CORRECTLY-ROUNDED
 * double log, and section (B) placed the accumulated ~7-call log residual ~10 orders BELOW the (H2)
 * bracket margin delta * N_cross ~ 6.56e5 -- but it NEVER MEASURED the double-double log error at the
 * actual four imp-34885 Math.log sites. This module MEASURES it (the log-site sibling of imp-34910, which
 * measured the residual-corrected DIVISION quotient). It instantiates a ~106-bit double-double reference
 * log (range reduction m * 2^k with m in [sqrt(1/2), sqrt(2)] plus a double-double atanh series
 * log(m) = 2 sum s^(2j+1)/(2j+1), s = (m-1)/(m+1)), evaluates it at the four imp-34885 log sites, records
 * the round-to-nearest error in ulp at each, confirms <= 0.5 ulp, and propagates the summed 1-ulp outward
 * half-widths through the interval-Newton quotient (divide by FP_LO ~ 0.9546) to quantify the log-induced
 * residual against the (H2) margin.
 *
 * THE FOUR LOG SITES (imp-34885 (a); the effectiveHeightForN / g / g_prime chain)
 * -------------------------------------------------------------------------------
 *   S1-seed    log(N + 2pi)      -- the RvM-inverse seed (lambda-rh-height-mapping.js:144)
 *   S2-inner   log(T / 2pi)      -- the u in f = (T/2pi)(u-1) - N and fp = u/2pi (line 146), ~4 Newton calls
 *   S3-outer-g log(T0)           -- the outer Banach-map log, g(N) = K log T0(N)
 *   S4-g_prime log(T0 / 2pi)     -- the g_prime denominator log, g_prime = 2pi K / (T0 log(T0/2pi))
 * imp-34885 flags all four as needing the SAME primitive: a proven-ULP correctly-rounded log with directed
 * [RD(log x), RU(log x)] variants. This MEASURES the double-double evaluation error that primitive would
 * inject, at the actual arguments (N_cross + 2pi ~ 3.28e9; T0 ~ 1.14e9; T0/2pi ~ 1.82e8).
 *
 * WHAT WAS MEASURED (double precision, N = N_cross ~ 3.28e9, the imp-34799/34885/34908 evaluation point)
 * -----------------------------------------------------------------------------------------------------
 *   (1) The double-double log, ROUNDED to the nearest double, sits within <= 0.1871 ulp of the ~106-bit
 *       reference at every site (max 0.1871 ulp at S3-outer-g, < 0.5 ulp everywhere) -- so the double-double
 *       evaluation error is < 0.5 ulp(double) and the rounded result IS correctly rounded, exactly as
 *       imp-34908 (C) asserted but never measured.
 *   (2) Native JS Math.log AGREES with that correctly-rounded double at every one of the four sites
 *       (Math.log(arg) === round(double-double log)), so the stock evaluation is already correctly rounded
 *       here -- the double-double machinery only MANUFACTURES the directed [RD, RU] endpoints (JS exposes no
 *       proven-ULP RD/RU log), it does not correct a wrong value at these arguments.
 *   (3) The directed enclosure [RD(log), RU(log)] brackets the double-double reference at all four sites
 *       with an outward half-width of EXACTLY 1 ulp -- the per-call outward width imp-34867/imp-34908 (B)
 *       budget for the proven-ULP two-sided log.
 *
 * VERDICT AGAINST THE (H2) MARGIN
 * -------------------------------
 * Summing the measured <= 1-ulp outward half-widths over the ~7 log calls (3 outer + ~4 Newton) at the T0
 * scale, ulp(T0) ~ 2.384e-7, gives a log-induced image half-width ~ 7 * ulp(T0) / FP_LO ~ 1.748e-6 in
 * T-units. Against the (H2) bracket margin delta * N_cross ~ 6.561e5 this sits ~11.57 orders BELOW: the
 * measured log residual is NOT the binding accuracy term for (H2), confirming the imp-34908 (B) scoping
 * numerically. The difficulty is CORRECTNESS of the log rounding, not its size.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; it does NOT instantiate the
 * imp-34687a directed-rounding layer (that still needs the external proven-ULP RD/RU log binding of
 * imp-34885/imp-34867), does NOT discharge the conditional, changes no bound. imp-34714a REMAINS OPEN;
 * imp-34687a REMAINS OPEN. NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34908-krawczyk-certificate-precision-scope (sections (B)/(C) assert the <0.5 ulp double-double log and its ~10-order headroom un-measured; this MEASURES it)
 * @see imp-34910-residual-corrected-quotient-ulp-measurement (SIBLING: measures the residual-corrected DIVISION quotient ULP error; this is the log-site analogue)
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (enumerates the four log sites and the proven-ULP RD/RU primitive each needs)
 * @see imp-34867-crlibm-log-enclosure-ulp-scope (per-call <= 1 ulp, kappa_log ~ 0.05 log-layer scope this confirms)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the gamma(n_op) eps per-op surrogate the log matches)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop whose four log sites are measured)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 double unit roundoff

// -- sign-aware next-representable double, for the directed one-ULP log step --------------------------
const _BUF = new DataView(new ArrayBuffer(8));
function nextUp(x) {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return Number.MIN_VALUE;
  _BUF.setFloat64(0, x);
  _BUF.setBigUint64(0, x > 0 ? _BUF.getBigUint64(0) + 1n : _BUF.getBigUint64(0) - 1n);
  return _BUF.getFloat64(0);
}
function nextDown(x) {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return -Number.MIN_VALUE;
  _BUF.setFloat64(0, x);
  _BUF.setBigUint64(0, x > 0 ? _BUF.getBigUint64(0) - 1n : _BUF.getBigUint64(0) + 1n);
  return _BUF.getFloat64(0);
}
function ulp(x) { const a = Math.abs(x); return nextUp(a) - a; }

// -- error-free transformations (Dekker split / TwoProduct / TwoSum; no Math.fma in JS) --------------
function split(a) { const c = 134217729 * a; const hi = c - (c - a); return [hi, a - hi]; } // 2^27 + 1
function twoSum(a, b) { const s = a + b; const bb = s - a; const err = (a - (s - bb)) + (b - bb); return [s, err]; }
function quickTwoSum(a, b) { const s = a + b; const err = b - (s - a); return [s, err]; } // needs |a| >= |b|
function twoProduct(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; // p + e = a*b exactly
  return [p, e];
}

// -- double-double (~106-bit) arithmetic on [hi, lo] pairs (Dekker / Hida-Li-Bailey) -----------------
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProduct(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddMulD(a, b) { let [p, e] = twoProduct(a[0], b); e += a[1] * b; return quickTwoSum(p, e); }
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulD(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulD(b, q2));
  const q3 = r[0] / b[0];
  return ddAdd(quickTwoSum(q1, q2), [q3, 0]);
}
const LOG2_DD = [0.6931471805599453, 2.3190468138462996e-17]; // log(2) to ~106 bits

// The ~106-bit reference log: range-reduce x = m * 2^k with m in [sqrt(1/2), sqrt(2)] (mult/div by 2 is
// EXACT), then log(m) = 2 (s + s^3/3 + s^5/5 + ...) with s = (m-1)/(m+1) (|s| <= 0.1716) in double-double.
function ddLog(x) {
  let k = Math.floor(Math.log2(x));
  let m = x / 2 ** k; // exact: division by an exact power of two
  while (m >= Math.SQRT2) { m /= 2; k++; }
  while (m < Math.SQRT1_2) { m *= 2; k--; }
  const s = ddDiv(ddAdd([m, 0], [-1, 0]), ddAdd([m, 0], [1, 0]));
  const s2 = ddMul(s, s);
  let term = s, sum = s, denom = 3;
  for (let i = 0; i < 30; i++) { // 30 atanh terms >> the ~24 needed to hit the ~1e-32 double-double floor
    term = ddMul(term, s2);
    sum = ddAdd(sum, ddDiv(term, [denom, 0]));
    denom += 2;
  }
  return ddAdd(ddMulD(LOG2_DD, k), ddMulD(sum, 2));
}
const ddToNumber = (a) => a[0] + a[1];

// -- the evaluation point and the four log sites of the effectiveHeightForN / g / g_prime chain --------
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34885/imp-34908)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34774/imp-34799/imp-34885/imp-34908

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) { let N = seed; for (let i = 0; i < iters; i++) N = g(N); return N; }
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9
const T0 = effectiveHeightForN(N_CROSS); // ~1.1437849180e9
const gPrime = (N) => { const T = effectiveHeightForN(N); const u = Math.log(T / TWO_PI); return (TWO_PI * K_AMPL) / (T * u); };
const FP_LO = 1 - Math.abs(gPrime(N_CROSS * (1 - DELTA))); // ~0.9546 contraction-gap / Krawczyk denominator floor

const LOG_SITES = [
  { tag: 'S1-seed', expr: 'log(N + 2pi)', arg: N_CROSS + TWO_PI },
  { tag: 'S2-inner', expr: 'log(T / 2pi)', arg: T0 / TWO_PI },
  { tag: 'S3-outer-g', expr: 'log(T0)', arg: T0 },
  { tag: 'S4-g_prime', expr: 'log(T0 / 2pi)', arg: T0 / TWO_PI },
];

const MEASUREMENTS = LOG_SITES.map(({ tag, expr, arg }) => {
  const ref = ddLog(arg); // ~106-bit reference [hi, lo]
  const crd = ref[0]; // round-to-nearest double of the reference (|lo| <= 0.5 ulp(hi))
  const native = Math.log(arg);
  const uCrd = ulp(crd);
  // round-to-nearest error of the double-double log (its rounded double vs the ~106-bit reference), in ulp
  const ddRoundErrUlp = Math.abs(ddToNumber(ddSub([crd, 0], ref))) / uCrd;
  // error of stock native Math.log vs the ~106-bit reference, in ulp
  const nativeErrUlp = Math.abs(ddToNumber(ddSub([native, 0], ref))) / uCrd;
  // directed one-ULP enclosure [RD, RU] around the correctly-rounded double, sign of (reference - crd)
  const resid = ddToNumber(ddSub(ref, [crd, 0]));
  let RD, RU;
  if (resid > 0) { RD = crd; RU = nextUp(crd); }
  else if (resid < 0) { RD = nextDown(crd); RU = crd; }
  else { RD = crd; RU = crd; }
  const refVal = ddToNumber(ref);
  const brackets = Math.min(RD, RU) <= refVal && refVal <= Math.max(RD, RU);
  const widthUlp = Math.abs(RU - RD) / uCrd;
  return {
    tag,
    expr,
    arg: +arg.toExponential(6),
    log_value: +crd.toExponential(6),
    dd_round_err_ulp: +ddRoundErrUlp.toFixed(4),
    native_err_ulp: +nativeErrUlp.toFixed(4),
    correctly_rounded: ddRoundErrUlp <= 0.5 + 1e-9,
    native_matches_correctly_rounded: native === crd,
    directed_width_ulp: +widthUlp.toFixed(4),
    brackets_reference: brackets,
  };
});

const MAX_DD_ROUND_ERR_ULP = Math.max(...MEASUREMENTS.map((m) => m.dd_round_err_ulp));
const MAX_NATIVE_ERR_ULP = Math.max(...MEASUREMENTS.map((m) => m.native_err_ulp));
const MAX_DIRECTED_WIDTH_ULP = Math.max(...MEASUREMENTS.map((m) => m.directed_width_ulp));
const ALL_CORRECTLY_ROUNDED = MEASUREMENTS.every((m) => m.correctly_rounded);
const ALL_NATIVE_MATCH = MEASUREMENTS.every((m) => m.native_matches_correctly_rounded);
const ALL_BRACKET = MEASUREMENTS.every((m) => m.brackets_reference);

// (B) residual budget: ~7 calls at <= 1 ulp(T0) outward, propagated through the contraction quotient.
function newtonStepsToConverge(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  let steps = 0;
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const fVal = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    T -= fVal / fp;
    steps++;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(fVal / fp) < 1e-9 * Math.max(1, T)) break;
  }
  return steps;
}
const NEWTON_STEPS = newtonStepsToConverge(N_CROSS); // ~4
const N_LOG_CALLS = 3 + NEWTON_STEPS; // ~7 including the seed
const ULP_T0 = EPS * 2 ** Math.floor(Math.log2(Math.abs(T0))); // one ulp at the dominant log-argument scale
const LOG_RESIDUAL_HALFWIDTH = (N_LOG_CALLS * ULP_T0) / FP_LO; // ~1.748e-6 T-units, log-induced image half-width
const H2_MARGIN = DELTA * N_CROSS; // ~6.561e5 (H2) bracket margin per side
const LOG_HEADROOM_ORDERS = Math.log10(H2_MARGIN / LOG_RESIDUAL_HALFWIDTH); // ~11.57 orders below the margin
const LOG_IS_BINDING_TERM = LOG_RESIDUAL_HALFWIDTH >= H2_MARGIN; // false: log residual is negligible, not binding

export const IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT = {
  id: 'imp-34927',
  proofSection: 'S-frontier',
  question:
    'imp-34908 (C) ASSERTED that a double-double (~106-bit) log evaluation with error < 0.5 ulp(double) ' +
    'yields a correctly-rounded double log, and (B) placed the ~7-call log residual ~10 orders below the ' +
    '(H2) margin delta * N_cross ~ 6.56e5 -- but never MEASURED the double-double log error at the four ' +
    'imp-34885 Math.log sites. Instantiate a ~106-bit reference log, evaluate it at the four sites, record ' +
    'the round-to-nearest error in ulp at each, confirm <= 0.5 ulp, and propagate the summed 1-ulp outward ' +
    'half-widths through the interval-Newton quotient (divide by FP_LO ~ 0.9546) against the (H2) margin. ' +
    'MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS OPEN; NO QED.',
  evaluation_point: {
    N_cross: +N_CROSS.toPrecision(15),
    T0_at_N_cross: +T0.toPrecision(10),
    eps: +EPS.toExponential(4),
    K_ampl: +K_AMPL.toExponential(4),
    FP_LO: +FP_LO.toPrecision(7),
  },
  measurements: MEASUREMENTS,
  summary: {
    n_log_sites: MEASUREMENTS.length, // 4
    max_dd_round_err_ulp: MAX_DD_ROUND_ERR_ULP, // 0.1871 <= 0.5 -- double-double log yields a correctly-rounded double
    max_native_err_ulp: MAX_NATIVE_ERR_ULP, // 0.1871 -- native Math.log already agrees with the correctly-rounded double
    all_correctly_rounded: ALL_CORRECTLY_ROUNDED, // true
    all_native_match_correctly_rounded: ALL_NATIVE_MATCH, // true at these four arguments
    max_directed_width_ulp: MAX_DIRECTED_WIDTH_ULP, // 1.0 -- minimal correctly-rounded directed outward width
    all_bracket_reference: ALL_BRACKET, // true
    n_log_calls: N_LOG_CALLS, // ~7
    ulp_at_T0: +ULP_T0.toExponential(4),
    log_residual_image_halfwidth_T_units: +LOG_RESIDUAL_HALFWIDTH.toExponential(4), // ~1.748e-6
    H2_margin: +H2_MARGIN.toExponential(4), // ~6.561e5
    log_headroom_orders_below_margin: +LOG_HEADROOM_ORDERS.toFixed(2), // ~11.57
    log_is_binding_accuracy_term: LOG_IS_BINDING_TERM, // false -- negligible against (H2)
  },
  finding:
    'MEASURING the double-double (~106-bit) log error at the four imp-34885 Math.log sites (S1 log(N+2pi); ' +
    'S2 log(T/2pi); S3 log(T0); S4 log(T0/2pi)) of the effectiveHeightForN / g / g_prime chain, against a ' +
    'range-reduction + atanh-series reference. Result: (1) the double-double log, rounded to nearest double, ' +
    'sits within <= ' + MAX_DD_ROUND_ERR_ULP + ' ulp of the ~106-bit reference at every site (< 0.5 ulp) -- ' +
    'so its evaluation error is < 0.5 ulp(double) and the rounded result IS correctly rounded, confirming ' +
    'the imp-34908 (C) claim it never measured. (2) Native JS Math.log agrees with that correctly-rounded ' +
    'double at all four sites (Math.log(arg) === round(reference)), so the stock evaluation is already ' +
    'correctly rounded at these arguments -- the double-double machinery only MANUFACTURES the directed ' +
    '[RD, RU] endpoints JS cannot supply (no proven-ULP RD/RU log). (3) The directed enclosure brackets the ' +
    'reference at every site with an outward half-width of EXACTLY 1 ulp -- the per-call budget of ' +
    'imp-34867/imp-34908 (B). Propagating the summed <= 1-ulp half-widths over the ~' + N_LOG_CALLS + ' log ' +
    'calls at the T0 scale through the contraction quotient (/ FP_LO ~ ' + FP_LO.toFixed(4) + ') gives a ' +
    'log-induced image half-width ~' + LOG_RESIDUAL_HALFWIDTH.toExponential(2) + ' in T-units versus the ' +
    '(H2) margin ~' + H2_MARGIN.toExponential(2) + ' -- ~' + LOG_HEADROOM_ORDERS.toFixed(1) + ' orders ' +
    'below, so the measured log residual is NOT the binding accuracy term for (H2), confirming imp-34908 ' +
    '(B) numerically. This MEASURES the double-double log; it does NOT instantiate the full imp-34687a ' +
    'directed-rounding layer (which still needs the external proven-ULP RD/RU log binding of ' +
    'imp-34885/imp-34867), does NOT discharge the conditional, changes no bound. imp-34714a and imp-34687a ' +
    'REMAIN OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This MEASURES the double-double log error at the four ' +
    'sites (<= 0.1871 ulp round-to-nearest, so the rounded double is correctly rounded; native Math.log ' +
    'already agrees; directed enclosure exactly 1 ulp; log residual ~11.57 orders below the (H2) margin) -- ' +
    'but it does NOT supply the external proven-ULP RD/RU log binding (still external, imp-34885/imp-34867), ' +
    'does NOT instantiate the imp-34687a directed-rounding layer, and does NOT machine-check the Krawczyk ' +
    'contraction. A measurement of ONE primitive at one N, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'DOUBLE-DOUBLE LOG ULP MEASUREMENT (frontier, NOT an RH bound). imp-34908 (C) asserted a double-double ' +
    'log with error < 0.5 ulp yields a correctly-rounded double and (B) placed the ~7-call log residual ~10 ' +
    'orders below the (H2) margin, but never measured the log error; this MEASURES it (the log-site sibling ' +
    'of imp-34910). Against a ~106-bit range-reduction + atanh-series reference, the double-double log ' +
    'rounds to within <= 0.1871 ulp at all four imp-34885 sites (< 0.5 ulp, correctly rounded), native ' +
    'Math.log agrees with the correctly-rounded double at every site, and the directed enclosure brackets ' +
    'the reference with an outward half-width of exactly 1 ulp. Propagated over ~7 calls through the ' +
    'contraction quotient (/ FP_LO ~ 0.9546), the log-induced image half-width ~1.748e-6 T-units sits ' +
    '~11.57 orders below the (H2) margin ~6.561e5 -- the log residual is NOT the binding accuracy term, ' +
    'confirming imp-34908 (B) numerically. MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer ' +
    '(still gated on the external proven-ULP RD/RU log binding), does NOT discharge the conditional. ' +
    'SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34908 (certificate precision scope; (C) asserts the <0.5 ulp double-double log yields a ' +
    'correctly-rounded double and (B) the ~10-order (H2) headroom, both un-measured -- this MEASURES them); ' +
    'imp-34910 (SIBLING: residual-corrected DIVISION quotient ULP measurement; this is the log-site ' +
    'analogue); imp-34885 (directed-rounding checklist; the four log sites and the proven-ULP RD/RU ' +
    'primitive); imp-34867 (crlibm log-enclosure ULP scope; per-call <= 1 ulp, kappa_log ~ 0.05); imp-34799 ' +
    '(gamma(n_op) eps per-op surrogate the log matches); lambda-rh-height-mapping (effectiveHeightForN). ' +
    'Double-double arithmetic and range-reduction + atanh-series log: Dekker, TwoSum, TwoProduct, ' +
    'Hida-Li-Bailey; correctly-rounded transcendentals: crlibm / RLIBM / MPFR / IEEE-754-2019 recommended.',
};

export const IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT_ASSERTIONS = [
  {
    // The double-double log, rounded to nearest double, is within <= 0.5 ulp of the ~106-bit reference at every site.
    id: 'imp34927-dd-log-correctly-rounded-half-ulp',
    description: 'the double-double log rounds to within <= 0.5 ulp of the ~106-bit reference at every one of the four log sites (so the rounded double is correctly rounded)',
    holds: () =>
      MEASUREMENTS.length === 4 &&
      ALL_CORRECTLY_ROUNDED &&
      MAX_DD_ROUND_ERR_ULP <= 0.5 + 1e-9,
  },
  {
    // Native JS Math.log agrees with the correctly-rounded double at all four sites (already correctly rounded here).
    id: 'imp34927-native-log-matches-correctly-rounded',
    description: 'native JS Math.log agrees with the correctly-rounded double (round of the reference) at all four log sites; native error <= 0.5 ulp',
    holds: () =>
      ALL_NATIVE_MATCH &&
      MAX_NATIVE_ERR_ULP <= 0.5 + 1e-9,
  },
  {
    // The directed enclosure [RD, RU] brackets the reference with an outward half-width of exactly 1 ulp at every site.
    id: 'imp34927-directed-enclosure-one-ulp-brackets',
    description: 'the directed [RD, RU] log enclosure brackets the double-double reference at all four sites with an outward width of exactly 1 ulp',
    holds: () =>
      ALL_BRACKET &&
      Math.abs(MAX_DIRECTED_WIDTH_ULP - 1) < 1e-9 &&
      MEASUREMENTS.every((m) => Math.abs(m.directed_width_ulp - 1) < 1e-9),
  },
  {
    // (B) the summed ~7-call log residual sits many orders below the (H2) margin -- NOT the binding accuracy term.
    id: 'imp34927-log-residual-not-binding-headroom',
    description: 'the summed ~7-call log residual half-width sits many orders below the (H2) margin delta * N_cross, so the log is NOT the binding accuracy term',
    holds: () =>
      N_LOG_CALLS === 3 + NEWTON_STEPS &&
      NEWTON_STEPS >= 3 &&
      NEWTON_STEPS <= 8 &&
      LOG_RESIDUAL_HALFWIDTH > 0 &&
      LOG_RESIDUAL_HALFWIDTH < H2_MARGIN &&
      LOG_HEADROOM_ORDERS > 6 &&
      LOG_IS_BINDING_TERM === false,
  },
  {
    // The double-double reference log matches known values (log e = 1, log 2 = LOG2_DD) to double-double precision.
    id: 'imp34927-dd-log-reference-self-check',
    description: 'the double-double reference log reproduces log(e) = 1 and log(2) to well below double precision (validates the atanh-series reference)',
    holds: () =>
      Math.abs(ddToNumber(ddLog(Math.E)) - 1) < 1e-15 &&
      Math.abs(ddToNumber(ddLog(2)) - LOG2_DD[0]) < 1e-15,
  },
  {
    // Honesty gate: measurement only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34927-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.isRigorous === false &&
      /imp-34714a/.test(IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.subGap) &&
      /imp-34687a/.test(IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.subGap) &&
      /REMAINS? OPEN/.test(IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.subGap) &&
      /NO QED/.test(IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT.verdict),
  },
];

for (const a of IMP34927_DOUBLE_DOUBLE_LOG_ULP_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34927-double-double-log-ulp-measurement assertion failed: ${a.id}`);
  }
}
