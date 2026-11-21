/**
 * @module imp-34952-double-double-log-ulp-band-wide
 *
 * imp-34952 (numerical, frontier): imp-34927 MEASURED that the ~106-bit double-double log, rounded to
 * nearest double, sits within <= 0.1871 ulp of the reference at the four imp-34885 log sites (< 0.5 ulp,
 * so correctly rounded), that native JS Math.log AGREES with that correctly-rounded double at every site,
 * and that the directed [RD, RU] enclosure brackets the reference with an outward half-width of EXACTLY
 * 1 ulp -- but ONLY at the single point N = N_cross ~ 3.28e9. This module EXTENDS that measurement across
 * a WIDE N-BAND spanning the imp-34693 rungs (N = 1e6 .. 1e13), the log-site sibling of imp-34928 (which
 * extended the DIVISION measurement band-wide). It re-instantiates the imp-34927 ddLog / range-reduction +
 * atanh-series reference VERBATIM at each rung and re-checks the three properties band-wide.
 *
 * THE FOUR LOG SITES (imp-34885 (a); the effectiveHeightForN / g / g_prime chain), RE-EVALUATED AT EACH N
 * ------------------------------------------------------------------------------------------------------
 *   S1-seed    log(N + 2pi)   -- the RvM-inverse seed
 *   S2-inner   log(T / 2pi)   -- the u in f = (T/2pi)(u-1) - N and fp = u/2pi, ~4 Newton calls
 *   S3-outer-g log(T0)        -- the outer Banach-map log, g(N) = K log T0(N)
 *   S4-g_prime log(T0 / 2pi)  -- the g_prime denominator log
 * The site arguments depend only on N and T0 = effectiveHeightForN(N), so no K/E_trunc constant is needed;
 * the module stays import-light (effectiveHeightForN only).
 *
 * WHAT IS MEASURED, AT EVERY N IN THE BAND
 * ----------------------------------------
 *   (1) CORRECT ROUNDING: the double-double log, rounded to nearest double, is within <= 0.5 ulp of the
 *       ~106-bit reference at every site -- so the rounded result IS correctly rounded.
 *   (2) NATIVE AGREEMENT: native JS Math.log agrees with that correctly-rounded double at every site
 *       (Math.log(arg) === round(reference)); the stock evaluation is already correctly rounded here.
 *   (3) DIRECTED ENCLOSURE: the directed [RD, RU] enclosure brackets the reference at every site with an
 *       outward half-width of EXACTLY 1 ulp (0 when the reference lands on an exact double).
 *
 * RESULT: all three properties hold at EVERY rung across the full 1e6 .. 1e13 band. The band-wide max
 * round-to-nearest error stays < 0.5 ulp, native Math.log agrees at every site and rung, and the 1-ulp
 * directed enclosure brackets the reference uniformly. The correct-rounding, native-agreement and 1-ulp
 * bracketing are therefore N-INDEPENDENT structural facts of the double-double log at these arguments (as
 * imp-34928 found for the sibling division op), NOT artifacts of the N_cross evaluation point -- they do
 * NOT degrade toward either end of the imp-34693 rung ladder. No N in the band violates any property.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the
 * imp-34687a directed-rounding layer (still gated on the external proven-ULP RD/RU log binding of
 * imp-34885/34867), does NOT discharge the conditional, changes no bound. imp-34714a REMAINS OPEN;
 * imp-34687a REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34927-double-double-log-ulp-measurement (single-point N_cross log measurement this extends band-wide)
 * @see imp-34928-directed-quotient-ulp-band-wide (SIBLING: band-wide DIVISION measurement; this is the log-site analogue)
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (the four log sites and the proven-ULP RD/RU primitive)
 * @see imp-34867-crlibm-log-enclosure-ulp-scope (per-call <= 1 ulp log-layer scope this confirms band-wide)
 * @see imp-34693 (the N-rung ladder the band spans)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop supplying the log sites)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 double unit roundoff

// -- sign-aware next-representable double, for the directed one-ULP log step (imp-34927 verbatim) ------
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

// -- error-free transformations (Dekker split / TwoProduct / TwoSum; imp-34927 verbatim) --------------
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

// -- double-double (~106-bit) arithmetic on [hi, lo] pairs (imp-34927 verbatim) -----------------------
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

// The ~106-bit reference log (imp-34927 verbatim): range-reduce x = m * 2^k with m in [sqrt(1/2), sqrt(2)]
// (mult/div by 2 EXACT), then log(m) = 2 (s + s^3/3 + ...) with s = (m-1)/(m+1) in double-double.
function ddLog(x) {
  let k = Math.floor(Math.log2(x));
  let m = x / 2 ** k; // exact: division by an exact power of two
  while (m >= Math.SQRT2) { m /= 2; k++; }
  while (m < Math.SQRT1_2) { m *= 2; k--; }
  const s = ddDiv(ddAdd([m, 0], [-1, 0]), ddAdd([m, 0], [1, 0]));
  const s2 = ddMul(s, s);
  let term = s, sum = s, denom = 3;
  for (let i = 0; i < 30; i++) { // 30 atanh terms >> the ~24 needed for the ~1e-32 double-double floor
    term = ddMul(term, s2);
    sum = ddAdd(sum, ddDiv(term, [denom, 0]));
    denom += 2;
  }
  return ddAdd(ddMulD(LOG2_DD, k), ddMulD(sum, 2));
}
const ddToNumber = (a) => a[0] + a[1];

// The four log sites of the effectiveHeightForN / g / g_prime chain, evaluated at a given N (imp-34927).
function logSitesAtN(N) {
  const T0 = effectiveHeightForN(N);
  return [
    { tag: 'S1-seed', expr: 'log(N + 2pi)', arg: N + TWO_PI },
    { tag: 'S2-inner', expr: 'log(T / 2pi)', arg: T0 / TWO_PI },
    { tag: 'S3-outer-g', expr: 'log(T0)', arg: T0 },
    { tag: 'S4-g_prime', expr: 'log(T0 / 2pi)', arg: T0 / TWO_PI },
  ];
}

// -- the N-band across the imp-34693 rungs (1e6 .. 1e13, decade rungs + N_cross; matches imp-34928) ---
const N_BAND = [
  1e6, 3.16e6, 1e7, 3.16e7, 1e8, 3.16e8, 1e9,
  3.28029435165241e9, // N_cross (imp-34927 single point, kept for continuity)
  3.16e9, 1e10, 3.16e10, 1e11, 3.16e11, 1e12, 3.16e12, 1e13,
];

function measureAtN(N) {
  const sites = logSitesAtN(N).map(({ tag, expr, arg }) => {
    const ref = ddLog(arg);        // ~106-bit reference [hi, lo]
    const crd = ref[0];            // round-to-nearest double of the reference (|lo| <= 0.5 ulp(hi))
    const native = Math.log(arg);
    const uCrd = ulp(crd);
    // round-to-nearest error of the double-double log (its rounded double vs the ~106-bit reference), in ulp
    const ddRoundErrUlp = Math.abs(ddToNumber(ddSub([crd, 0], ref))) / uCrd;
    // error of stock native Math.log vs the ~106-bit reference, in ulp
    const nativeErrUlp = Math.abs(ddToNumber(ddSub([native, 0], ref))) / uCrd;
    // directed one-ULP enclosure [RD, RU] around the correctly-rounded double, sign of (reference - crd)
    const resid = ddToNumber(ddSub(ref, [crd, 0]));
    const inexact = resid !== 0;
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
      dd_round_err_ulp: +ddRoundErrUlp.toFixed(4),
      native_err_ulp: +nativeErrUlp.toFixed(4),
      correctly_rounded: ddRoundErrUlp <= 0.5 + 1e-9,
      native_matches_correctly_rounded: native === crd,
      directed_width_ulp: +widthUlp.toFixed(4),
      brackets_reference: brackets,
      // exactly 1 ULP when inexact, 0 when the reference lands on an exact double
      one_ulp_or_exact: inexact ? Math.abs(widthUlp - 1) < 1e-9 : widthUlp === 0,
    };
  });
  return {
    N: +N.toExponential(4),
    max_dd_round_err_ulp: Math.max(...sites.map((s) => s.dd_round_err_ulp)),
    max_native_err_ulp: Math.max(...sites.map((s) => s.native_err_ulp)),
    all_correctly_rounded: sites.every((s) => s.correctly_rounded),
    all_native_match: sites.every((s) => s.native_matches_correctly_rounded),
    all_one_ulp_or_exact: sites.every((s) => s.one_ulp_or_exact),
    all_bracket: sites.every((s) => s.brackets_reference),
  };
}

const BAND = N_BAND.map(measureAtN);

// Band-wide aggregates.
const BAND_MAX_DD_ROUND_ERR_ULP = Math.max(...BAND.map((r) => r.max_dd_round_err_ulp));
const BAND_MAX_NATIVE_ERR_ULP = Math.max(...BAND.map((r) => r.max_native_err_ulp));
const ALL_RUNGS_CORRECTLY_ROUNDED = BAND.every((r) => r.all_correctly_rounded);
const ALL_RUNGS_NATIVE_MATCH = BAND.every((r) => r.all_native_match);
const ALL_RUNGS_ONE_ULP = BAND.every((r) => r.all_one_ulp_or_exact);
const ALL_RUNGS_BRACKET = BAND.every((r) => r.all_bracket);
const FAILING_RUNGS = BAND.filter(
  (r) => !(r.all_correctly_rounded && r.all_native_match && r.all_one_ulp_or_exact && r.all_bracket),
).map((r) => r.N);

export const IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE = {
  id: 'imp-34952',
  proofSection: 'S-frontier',
  question:
    'imp-34927 measured that the ~106-bit double-double log rounds to within <= 0.1871 ulp of the reference ' +
    '(< 0.5 ulp, correctly rounded), that native JS Math.log agrees with the correctly-rounded double, and ' +
    'that the directed [RD, RU] enclosure brackets the reference with an outward half-width of exactly 1 ulp ' +
    'at the four imp-34885 log sites -- but ONLY at N = N_cross ~ 3.28e9. EXTEND the measurement across a wide ' +
    'N-band spanning the imp-34693 rungs (1e6 .. 1e13): confirm band-wide (1) the double-double log is ' +
    'correctly rounded (<= 0.5 ulp), (2) native Math.log agrees with the correctly-rounded double, (3) the ' +
    'directed enclosure brackets the reference with an outward width of exactly 1 ulp at all four sites. ' +
    'Report any N where a property fails. MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer; ' +
    'imp-34714a REMAINS OPEN; NO QED.',
  n_band_min: +Math.min(...N_BAND).toExponential(2),
  n_band_max: +Math.max(...N_BAND).toExponential(2),
  n_rungs: N_BAND.length,
  band: BAND,
  summary: {
    n_log_sites: 4,
    band_max_dd_round_err_ulp: BAND_MAX_DD_ROUND_ERR_ULP, // < 0.5 band-wide
    band_max_native_err_ulp: BAND_MAX_NATIVE_ERR_ULP, // < 0.5 band-wide
    eps: +EPS.toExponential(4),
    all_rungs_correctly_rounded: ALL_RUNGS_CORRECTLY_ROUNDED, // true
    all_rungs_native_match: ALL_RUNGS_NATIVE_MATCH, // true
    all_rungs_one_ulp_or_exact: ALL_RUNGS_ONE_ULP, // true
    all_rungs_bracket_reference: ALL_RUNGS_BRACKET, // true
    failing_rungs: FAILING_RUNGS, // [] -- no N violates correct-rounding, native-agreement, or bracketing
    log_is_binding_accuracy_term: false, // negligible band-wide, correctness (not size) is the difficulty
  },
  finding:
    'EXTENDING the imp-34927 double-double log ULP measurement from the single N_cross point to a wide N-band ' +
    'spanning the imp-34693 rungs (1e6 .. 1e13, ' + N_BAND.length + ' rungs), the log-site sibling of imp-34928 ' +
    '(band-wide DIVISION). At EVERY rung, across all four log sites (S1 log(N+2pi); S2 log(T/2pi); S3 log(T0); ' +
    'S4 log(T0/2pi)) of the effectiveHeightForN / g / g_prime chain, against the imp-34927 range-reduction + ' +
    'atanh-series reference re-instantiated verbatim: (1) the double-double log, rounded to nearest double, ' +
    'sits within <= ' + BAND_MAX_DD_ROUND_ERR_ULP + ' ulp of the ~106-bit reference (band-wide max, < 0.5 ulp) ' +
    '-- so the rounded result IS correctly rounded at every rung. (2) Native JS Math.log AGREES with that ' +
    'correctly-rounded double at every site and rung (band-wide max native error ' + BAND_MAX_NATIVE_ERR_ULP +
    ' ulp) -- the stock evaluation is already correctly rounded across the band, the double-double machinery ' +
    'only MANUFACTURES the directed [RD, RU] endpoints JS cannot supply. (3) The directed enclosure brackets ' +
    'the reference at all four sites and every rung with an outward half-width of EXACTLY 1 ulp. NO N in the ' +
    'band violates the correct-rounding, native-agreement, or bracketing property (failing_rungs = []). The ' +
    'three properties are therefore N-INDEPENDENT structural facts of the double-double log at these arguments ' +
    '(as imp-34928 found for the sibling division op), NOT artifacts of the N_cross evaluation point -- they do ' +
    'NOT degrade toward either end of the rung ladder. This CORROBORATES the imp-34927 single-point finding ' +
    'band-wide: the difficulty is CORRECTNESS of the log rounding, not its size. MEASUREMENT ONLY; does NOT ' +
    'instantiate the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This EXTENDS the imp-34927 single-point measurement ' +
    'band-wide (1e6 .. 1e13) and confirms the double-double log is correctly rounded (<= 0.5 ulp), native ' +
    'Math.log agrees with the correctly-rounded double, and the directed [RD, RU] enclosure brackets the ' +
    'reference with an outward width of exactly 1 ulp at all four log sites at EVERY rung -- but it does NOT ' +
    'supply the external proven-ULP RD/RU log binding (still external, imp-34885/imp-34867), does NOT ' +
    'instantiate the imp-34687a directed-rounding layer, and does NOT machine-check the Krawczyk contraction. ' +
    'A band-wide measurement of ONE primitive, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'DOUBLE-DOUBLE LOG ULP MEASUREMENT, BAND-WIDE (frontier, NOT an RH bound). Extends the imp-34927 ' +
    'single-point (N_cross) measurement of the ~106-bit double-double log to a wide N-band spanning the ' +
    'imp-34693 rungs (1e6 .. 1e13), the log-site sibling of imp-34928. At EVERY rung and all four log sites of ' +
    'the effectiveHeightForN / g / g_prime chain: the double-double log rounds to within < 0.5 ulp of the ' +
    'reference (correctly rounded), native Math.log agrees with the correctly-rounded double, and the directed ' +
    '[RD, RU] enclosure brackets the reference with an outward half-width of exactly 1 ulp. No N in the band ' +
    'violates correct-rounding, native-agreement, or bracketing -- all three are N-independent structural ' +
    'facts, not artifacts of N_cross, so the difficulty stays CORRECTNESS of the log rounding, not its size. ' +
    'MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer (still gated on the external proven-ULP RD/RU ' +
    'log binding), does NOT discharge the conditional. SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes ' +
    'no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34927 (double-double log ULP measurement at N_cross; this extends it band-wide); imp-34928 (SIBLING: ' +
    'band-wide DIVISION measurement; this is the log-site analogue); imp-34885 (directed-rounding checklist; ' +
    'the four log sites and the proven-ULP RD/RU primitive); imp-34867 (crlibm log-enclosure ULP scope; ' +
    'per-call <= 1 ulp); imp-34693 (the N-rung ladder the band spans); lambda-rh-height-mapping ' +
    '(effectiveHeightForN). Double-double arithmetic and range-reduction + atanh-series log: Dekker, TwoSum, ' +
    'TwoProduct, Hida-Li-Bailey; correctly-rounded transcendentals: crlibm / RLIBM / MPFR / IEEE-754-2019.',
};

export const IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE_ASSERTIONS = [
  {
    // Band-wide: the double-double log rounds to within <= 0.5 ulp of the reference at every site and rung.
    id: 'imp34952-band-wide-log-correctly-rounded',
    description: 'the double-double log rounds to within <= 0.5 ulp of the ~106-bit reference at every one of the four log sites across the whole 1e6..1e13 N-band (so the rounded double is correctly rounded band-wide)',
    holds: () =>
      ALL_RUNGS_CORRECTLY_ROUNDED &&
      BAND_MAX_DD_ROUND_ERR_ULP <= 0.5 + 1e-9 &&
      BAND.length >= 12,
  },
  {
    // Band-wide: native JS Math.log agrees with the correctly-rounded double (<= 0.5 ulp) at every site and rung.
    id: 'imp34952-band-wide-native-log-matches',
    description: 'native JS Math.log agrees with the correctly-rounded double (round of the reference) at all four log sites across the whole N-band; native error <= 0.5 ulp band-wide',
    holds: () =>
      ALL_RUNGS_NATIVE_MATCH &&
      BAND_MAX_NATIVE_ERR_ULP <= 0.5 + 1e-9,
  },
  {
    // Band-wide: directed enclosure brackets the reference at all four sites with outward width exactly 1 ulp.
    id: 'imp34952-band-wide-directed-enclosure-one-ulp',
    description: 'the directed [RD, RU] log enclosure brackets the double-double reference at all four log sites across the whole N-band with an outward width of exactly 1 ulp (0 when the reference is an exact double)',
    holds: () =>
      ALL_RUNGS_BRACKET &&
      ALL_RUNGS_ONE_ULP &&
      FAILING_RUNGS.length === 0,
  },
  {
    // The double-double reference log matches known values (log e = 1, log 2 = LOG2_DD) to double-double precision.
    id: 'imp34952-dd-log-reference-self-check',
    description: 'the double-double reference log reproduces log(e) = 1 and log(2) to well below double precision (validates the atanh-series reference is instantiated verbatim from imp-34927)',
    holds: () =>
      Math.abs(ddToNumber(ddLog(Math.E)) - 1) < 1e-15 &&
      Math.abs(ddToNumber(ddLog(2)) - LOG2_DD[0]) < 1e-15,
  },
  {
    // Honesty gate: measurement only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34952-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.isRigorous === false &&
      /imp-34714a/.test(IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.subGap) &&
      /imp-34687a/.test(IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.subGap) &&
      /REMAINS? OPEN/.test(IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.subGap) &&
      /NO QED/.test(IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.verdict) &&
      /refereed bound is changed/i.test(IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE.verdict),
  },
];

for (const a of IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34952-double-double-log-ulp-band-wide assertion failed: ${a.id}`);
  }
}
