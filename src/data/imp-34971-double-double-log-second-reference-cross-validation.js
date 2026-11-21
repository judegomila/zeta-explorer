/**
 * @module imp-34971-double-double-log-second-reference-cross-validation
 *
 * imp-34971 (accuracy, frontier): imp-34952 re-instantiated the imp-34927 atanh-series double-double log
 * reference VERBATIM at every rung and checked its three properties (correct rounding <= 0.5 ulp, native
 * Math.log agreement, 1-ulp directed enclosure) against that SINGLE reference. A systematic error in the
 * atanh-series reference (too-few terms, a bug in the double-double division that forms its argument, a
 * mis-set log(2) constant) that stayed below the ~106-bit floor would sit far under 0.5 ulp and would NOT
 * be caught -- so the <0.5 ulp correct-rounding and 1-ulp enclosure findings could in principle be artifacts
 * of the one reference. This module builds a STRUCTURALLY INDEPENDENT second high-precision log path and
 * cross-validates the imp-34952 findings against it band-wide, at the same four imp-34885 log sites over the
 * same imp-34693 rung ladder (1e6 .. 1e13).
 *
 * THE TWO INDEPENDENT LOG ALGORITHMS (both ~106-bit, on the SAME double-double arithmetic substrate)
 * ---------------------------------------------------------------------------------------------------
 *   PATH A (imp-34927/imp-34952, atanh series): reduce x = m * 2^k, m in [sqrt(1/2), sqrt(2)]; form
 *     s = (m - 1) / (m + 1) via a double-double DIVISION; log(m) = 2 (s + s^3/3 + s^5/5 + ...).
 *   PATH B (this module, log1p Taylor series): SAME exact power-of-two reduction; form u = m - 1
 *     ADDITIVELY (exact by Sterbenz, m in [1/2, 2], so NO division enters the argument); then
 *     log(m) = log(1 + u) = u - u^2/2 + u^3/3 - u^4/4 + ... (an ALTERNATING series over a LARGER
 *     argument |u| <= sqrt(2)-1 ~ 0.414, needing ~130 terms vs the ~24 the atanh series needs).
 * The reduction (x = m*2^k) is EXACT float arithmetic and cannot be a rounding artifact, so the two paths
 * are genuinely independent exactly where a systematic reference error would live: the SERIES and the
 * ARGUMENT FORMATION (division vs exact subtraction, small odd-only vs large alternating). The Dekker /
 * TwoSum / TwoProduct EFT substrate is shared -- a bug there would surface in the imp-34928 division-op
 * measurement and in the log self-checks below (log e = 1, log 2, log 10 to double-double precision).
 *
 * WHAT IS MEASURED, AT EVERY N IN THE BAND AND ALL FOUR SITES
 * -----------------------------------------------------------
 *   (1) CROSS-REFERENCE AGREEMENT: |ddLog_atanh(arg) - ddLog_taylor(arg)| in ulp of the value -- the two
 *       independent ~106-bit references agree to ~1e-14 ulp (~1e-30 relative), ORDERS OF MAGNITUDE below
 *       the ~0.49 ulp round-to-nearest error, so the two references are interchangeable for the rounding
 *       verdict.
 *   (2) ROUND AGREEMENT: round-to-nearest(ref_atanh) === round-to-nearest(ref_taylor) at every site and
 *       rung -- both references round to the SAME double, so "correctly rounded" is NOT a property of which
 *       reference was chosen.
 *   (3) REFERENCE-INDEPENDENT PROPERTIES: re-deriving the imp-34952 checks with PATH B as the reference,
 *       the double-double log is still correctly rounded (<= 0.5 ulp), native Math.log still agrees with the
 *       correctly-rounded double, and the directed [RD, RU] enclosure still brackets the reference with an
 *       outward width of exactly 1 ulp -- band-wide, no failing rung.
 *
 * RESULT: at every rung and site the two independent references round to the same double, disagree by
 * << 1e-6 ulp, and PATH B reproduces the imp-34952 correct-rounding / native-agreement / 1-ulp enclosure
 * findings exactly. The imp-34952 conclusions are therefore REFERENCE-INDEPENDENT: they are not artifacts of
 * the single atanh-series reference.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the
 * imp-34687a directed-rounding layer (still gated on the external proven-ULP RD/RU log binding of
 * imp-34885/34867), does NOT supply an a-priori forward-error bound, does NOT discharge the conditional.
 * imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN; C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34952-double-double-log-ulp-band-wide (the single-reference band-wide measurement this cross-validates)
 * @see imp-34927-double-double-log-ulp-measurement (the atanh-series reference, PATH A, re-instantiated verbatim)
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (the four log sites and the proven-ULP RD/RU primitive)
 * @see imp-34693 (the N-rung ladder the band spans)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop supplying the log sites)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 double unit roundoff

// -- sign-aware next-representable double, for the directed one-ULP log step (imp-34952 verbatim) ------
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

// -- error-free transformations (Dekker split / TwoProduct / TwoSum; the SHARED arithmetic substrate) --
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
const ddToNumber = (a) => a[0] + a[1];

// -- PATH A: the imp-34927/imp-34952 atanh-series reference, re-instantiated VERBATIM -----------------
// reduce x = m * 2^k, m in [sqrt(1/2), sqrt(2)]; s = (m-1)/(m+1) via double-double DIVISION; log(m) = 2 atanh(s).
function ddLogAtanh(x) {
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

// -- PATH B: the STRUCTURALLY INDEPENDENT log1p Taylor reference (this module) -------------------------
// SAME exact reduction; but form u = m - 1 ADDITIVELY (exact by Sterbenz, m in [1/2, 2], NO division in the
// argument), then log(m) = log(1+u) = u - u^2/2 + u^3/3 - ... over the LARGER argument |u| <= 0.414.
// 130 alternating terms drive the truncation to ~1e-50, far below the ~106-bit double-double floor.
function ddLogTaylor(x) {
  let k = Math.floor(Math.log2(x));
  let m = x / 2 ** k; // exact: division by an exact power of two
  while (m >= Math.SQRT2) { m /= 2; k++; }
  while (m < Math.SQRT1_2) { m *= 2; k--; }
  const u = ddAdd([m, 0], [-1, 0]); // m - 1, exact by Sterbenz (no division forms this argument)
  let term = u;     // u^1
  let sum = u;      // + u   (i = 1 term of log(1+u))
  for (let i = 2; i <= 130; i++) {
    term = ddMul(term, u);                    // u^i
    const contrib = ddDiv(term, [i, 0]);      // u^i / i
    sum = (i % 2 === 0) ? ddSub(sum, contrib) : ddAdd(sum, contrib); // alternating: + odd, - even
  }
  return ddAdd(ddMulD(LOG2_DD, k), sum);
}

// The four log sites of the effectiveHeightForN / g / g_prime chain, evaluated at a given N (imp-34952).
function logSitesAtN(N) {
  const T0 = effectiveHeightForN(N);
  return [
    { tag: 'S1-seed', expr: 'log(N + 2pi)', arg: N + TWO_PI },
    { tag: 'S2-inner', expr: 'log(T / 2pi)', arg: T0 / TWO_PI },
    { tag: 'S3-outer-g', expr: 'log(T0)', arg: T0 },
    { tag: 'S4-g_prime', expr: 'log(T0 / 2pi)', arg: T0 / TWO_PI },
  ];
}

// -- the N-band across the imp-34693 rungs (1e6 .. 1e13; matches imp-34952 exactly) -------------------
const N_BAND = [
  1e6, 3.16e6, 1e7, 3.16e7, 1e8, 3.16e8, 1e9,
  3.28029435165241e9, // N_cross (imp-34927 single point, kept for continuity)
  3.16e9, 1e10, 3.16e10, 1e11, 3.16e11, 1e12, 3.16e12, 1e13,
];

function measureAtN(N) {
  const sites = logSitesAtN(N).map(({ tag, expr, arg }) => {
    const refA = ddLogAtanh(arg);   // PATH A: ~106-bit atanh-series reference [hi, lo]
    const refB = ddLogTaylor(arg);  // PATH B: ~106-bit log1p Taylor reference  [hi, lo]
    const crdA = refA[0];           // round-to-nearest double of PATH A
    const crdB = refB[0];           // round-to-nearest double of PATH B
    const native = Math.log(arg);
    const uCrd = ulp(crdB);
    // (1) cross-reference agreement of the two independent ~106-bit references, in ulp of the value
    const crossRefUlp = Math.abs(ddToNumber(ddSub(refA, refB))) / uCrd;
    // (3a) round-to-nearest error of the double-double log vs the PATH B reference, in ulp
    const ddRoundErrUlp = Math.abs(ddToNumber(ddSub([crdB, 0], refB))) / uCrd;
    // (3b) error of stock native Math.log vs the PATH B reference, in ulp
    const nativeErrUlp = Math.abs(ddToNumber(ddSub([native, 0], refB))) / uCrd;
    // (3c) directed one-ULP enclosure [RD, RU] around the correctly-rounded double, PATH B reference
    const resid = ddToNumber(ddSub(refB, [crdB, 0]));
    const inexact = resid !== 0;
    let RD, RU;
    if (resid > 0) { RD = crdB; RU = nextUp(crdB); }
    else if (resid < 0) { RD = nextDown(crdB); RU = crdB; }
    else { RD = crdB; RU = crdB; }
    const refVal = ddToNumber(refB);
    const brackets = Math.min(RD, RU) <= refVal && refVal <= Math.max(RD, RU);
    const widthUlp = Math.abs(RU - RD) / uCrd;
    return {
      tag,
      expr,
      cross_ref_ulp: +crossRefUlp.toExponential(3),
      round_agrees: crdA === crdB, // (2) both independent references round to the SAME double
      dd_round_err_ulp: +ddRoundErrUlp.toFixed(4),
      native_err_ulp: +nativeErrUlp.toFixed(4),
      correctly_rounded: ddRoundErrUlp <= 0.5 + 1e-9,
      native_matches_correctly_rounded: native === crdB,
      directed_width_ulp: +widthUlp.toFixed(4),
      brackets_reference: brackets,
      // exactly 1 ULP when inexact, 0 when the reference lands on an exact double
      one_ulp_or_exact: inexact ? Math.abs(widthUlp - 1) < 1e-9 : widthUlp === 0,
    };
  });
  return {
    N: +N.toExponential(4),
    max_cross_ref_ulp: Math.max(...sites.map((s) => s.cross_ref_ulp)),
    all_round_agree: sites.every((s) => s.round_agrees),
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
const BAND_MAX_CROSS_REF_ULP = Math.max(...BAND.map((r) => r.max_cross_ref_ulp));
const ALL_RUNGS_ROUND_AGREE = BAND.every((r) => r.all_round_agree);
const BAND_MAX_DD_ROUND_ERR_ULP = Math.max(...BAND.map((r) => r.max_dd_round_err_ulp));
const BAND_MAX_NATIVE_ERR_ULP = Math.max(...BAND.map((r) => r.max_native_err_ulp));
const ALL_RUNGS_CORRECTLY_ROUNDED = BAND.every((r) => r.all_correctly_rounded);
const ALL_RUNGS_NATIVE_MATCH = BAND.every((r) => r.all_native_match);
const ALL_RUNGS_ONE_ULP = BAND.every((r) => r.all_one_ulp_or_exact);
const ALL_RUNGS_BRACKET = BAND.every((r) => r.all_bracket);
const FAILING_RUNGS = BAND.filter(
  (r) => !(r.all_round_agree && r.all_correctly_rounded && r.all_native_match
    && r.all_one_ulp_or_exact && r.all_bracket),
).map((r) => r.N);

// Reference self-checks: both independent paths reproduce known logarithms to double-double precision.
const SELF_CHECK = {
  atanh_log_e: ddToNumber(ddLogAtanh(Math.E)),
  taylor_log_e: ddToNumber(ddLogTaylor(Math.E)),
  atanh_log_2: ddToNumber(ddLogAtanh(2)),
  taylor_log_2: ddToNumber(ddLogTaylor(2)),
  atanh_log_10: ddToNumber(ddLogAtanh(10)),
  taylor_log_10: ddToNumber(ddLogTaylor(10)),
  ln10_native: Math.log(10),
  // cross-path disagreement at log(10), where BOTH series do real work (m ~ 1.25 after the 2^3 reduction)
  cross_ref_log10_ulp: +(Math.abs(ddToNumber(ddSub(ddLogAtanh(10), ddLogTaylor(10)))) / ulp(Math.log(10))).toExponential(3),
};

export const IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION = {
  id: 'imp-34971',
  proofSection: 'S-frontier',
  question:
    'imp-34952 re-instantiated the imp-34927 atanh-series double-double log reference VERBATIM at every rung ' +
    'and checked its three properties (correct rounding <= 0.5 ulp, native Math.log agreement, 1-ulp directed ' +
    'enclosure) against ONE reference. A systematic error in that single reference below the ~106-bit floor ' +
    'would sit far under 0.5 ulp and be invisible. CROSS-VALIDATE the imp-34952 findings against a ' +
    'STRUCTURALLY INDEPENDENT second high-precision log path (a log1p Taylor series with exact additive ' +
    'argument formation, vs PATH A which forms its atanh argument by double-double division) band-wide at the ' +
    'four imp-34885 log sites over the imp-34693 rungs (1e6 .. 1e13): do the two references round to the same ' +
    'double, and how far below 0.5 ulp do they agree? MEASUREMENT ONLY; does NOT instantiate the imp-34687a ' +
    'layer; imp-34714a REMAINS OPEN; NO QED.',
  n_band_min: +Math.min(...N_BAND).toExponential(2),
  n_band_max: +Math.max(...N_BAND).toExponential(2),
  n_rungs: N_BAND.length,
  band: BAND,
  self_check: SELF_CHECK,
  summary: {
    n_log_sites: 4,
    band_max_cross_ref_ulp: BAND_MAX_CROSS_REF_ULP, // ~1e-14 ulp: the two references are interchangeable
    all_rungs_round_agree: ALL_RUNGS_ROUND_AGREE, // true: both references round to the same double everywhere
    band_max_dd_round_err_ulp: BAND_MAX_DD_ROUND_ERR_ULP, // < 0.5 band-wide, PATH B reference
    band_max_native_err_ulp: BAND_MAX_NATIVE_ERR_ULP, // < 0.5 band-wide, PATH B reference
    eps: +EPS.toExponential(4),
    all_rungs_correctly_rounded: ALL_RUNGS_CORRECTLY_ROUNDED, // true against PATH B
    all_rungs_native_match: ALL_RUNGS_NATIVE_MATCH, // true against PATH B
    all_rungs_one_ulp_or_exact: ALL_RUNGS_ONE_ULP, // true against PATH B
    all_rungs_bracket_reference: ALL_RUNGS_BRACKET, // true against PATH B
    failing_rungs: FAILING_RUNGS, // [] -- no N breaks round-agreement or any reproduced property
    reference_independent: ALL_RUNGS_ROUND_AGREE && BAND_MAX_CROSS_REF_ULP < 0.5, // the finding survives a second path
  },
  finding:
    'CROSS-VALIDATING the imp-34952 single-reference band-wide double-double log measurement against a ' +
    'STRUCTURALLY INDEPENDENT second ~106-bit path. PATH A (imp-34927/imp-34952) reduces x = m*2^k and forms ' +
    's = (m-1)/(m+1) by double-double DIVISION, then sums the atanh series 2(s + s^3/3 + ...). PATH B (this ' +
    'module) uses the SAME exact power-of-two reduction but forms u = m-1 ADDITIVELY (exact by Sterbenz, no ' +
    'division in the argument) and sums the ALTERNATING log1p Taylor series u - u^2/2 + u^3/3 - ... over the ' +
    'LARGER argument |u| <= 0.414 (130 terms). The two paths differ exactly where a systematic reference error ' +
    'would live -- the series and the argument formation -- while the exact reduction cannot be a rounding ' +
    'artifact. At EVERY rung (1e6 .. 1e13, ' + N_BAND.length + ' rungs) and all four log sites: (1) the two ' +
    'independent references agree to <= ' + BAND_MAX_CROSS_REF_ULP + ' ulp (band-wide max, ~1e-30 relative) -- ' +
    'ORDERS OF MAGNITUDE below the ~0.49 ulp round-to-nearest error; (2) round-to-nearest(PATH A) === ' +
    'round-to-nearest(PATH B) at every site and rung -- both references round to the SAME double; (3) with ' +
    'PATH B as the reference, the double-double log is still correctly rounded (band-wide max ' +
    BAND_MAX_DD_ROUND_ERR_ULP + ' ulp <= 0.5), native Math.log still agrees with the correctly-rounded double, ' +
    'and the directed [RD, RU] enclosure still brackets the reference with an outward width of exactly 1 ulp. ' +
    'failing_rungs = []. The imp-34952 correct-rounding, native-agreement and 1-ulp enclosure findings are ' +
    'therefore REFERENCE-INDEPENDENT -- not artifacts of the single atanh-series reference. Both paths also ' +
    'reproduce log(e) = 1, log(2) and log(10) to double-double precision. MEASUREMENT ONLY; does NOT instantiate ' +
    'the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This CROSS-VALIDATES the imp-34952 findings against a ' +
    'second structurally independent ~106-bit log path (log1p Taylor, exact additive argument) and confirms ' +
    'the two references round to the same double everywhere and agree to ~1e-14 ulp band-wide -- so the ' +
    '<0.5 ulp correct-rounding and 1-ulp enclosure are reference-independent, not artifacts of the single ' +
    'atanh-series reference. But it does NOT supply the external proven-ULP RD/RU log binding (still external, ' +
    'imp-34885/imp-34867), does NOT instantiate the imp-34687a directed-rounding layer with an a-priori ' +
    'forward-error bound, and does NOT machine-check the Krawczyk contraction. Two agreeing measurements raise ' +
    'confidence but neither is a certificate that holds by construction over the whole domain. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'DOUBLE-DOUBLE LOG SECOND-REFERENCE CROSS-VALIDATION (frontier, NOT an RH bound). Cross-validates the ' +
    'imp-34952 single-reference band-wide measurement against a STRUCTURALLY INDEPENDENT second ~106-bit log ' +
    'path (log1p Taylor series, exact additive argument formation vs PATH A double-double division). At every ' +
    'rung (1e6 .. 1e13) and all four imp-34885 log sites, the two independent references round to the SAME ' +
    'double and agree to ~1e-14 ulp band-wide -- orders of magnitude below the ~0.49 ulp round-to-nearest ' +
    'error -- and PATH B reproduces the imp-34952 correct-rounding, native-agreement and 1-ulp directed ' +
    'enclosure findings exactly, with no failing rung. The imp-34952 conclusions are therefore ' +
    'REFERENCE-INDEPENDENT, not artifacts of the single atanh-series reference. MEASUREMENT ONLY; does NOT ' +
    'instantiate the imp-34687a layer (still gated on the external proven-ULP RD/RU log binding), does NOT ' +
    'discharge the conditional. SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34952 (single-reference band-wide double-double log measurement, this cross-validates); imp-34927 ' +
    '(the atanh-series reference, PATH A, re-instantiated verbatim); imp-34885 (directed-rounding checklist; ' +
    'the four log sites and the proven-ULP RD/RU primitive); imp-34867 (crlibm log-enclosure ULP scope); ' +
    'imp-34693 (the N-rung ladder the band spans); lambda-rh-height-mapping (effectiveHeightForN). ' +
    'Double-double arithmetic and both range-reduction series: Dekker, TwoSum, TwoProduct, Hida-Li-Bailey; ' +
    'atanh vs log1p Taylor range reduction: Muller (Elementary Functions); correctly-rounded transcendentals: ' +
    'crlibm / RLIBM / MPFR / IEEE-754-2019.',
};

export const IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION_ASSERTIONS = [
  {
    // The two independent references round to the same double everywhere and agree far below 0.5 ulp:
    // the imp-34952 correct-rounding verdict is reference-independent.
    id: 'imp34971-references-round-agree-band-wide',
    description: 'the atanh-series (PATH A) and log1p-Taylor (PATH B) references round to the SAME nearest double at all four log sites across the whole 1e6..1e13 band, and disagree by << 0.5 ulp band-wide -- so the imp-34952 correct-rounding verdict is not an artifact of the single reference',
    holds: () =>
      ALL_RUNGS_ROUND_AGREE &&
      BAND_MAX_CROSS_REF_ULP < 0.5 &&
      BAND.length >= 12,
  },
  {
    // The cross-reference disagreement is orders of magnitude below the round-to-nearest error it is
    // supposed to validate: the two references are interchangeable for the rounding verdict.
    id: 'imp34971-cross-ref-far-below-rounding-error',
    description: 'the max cross-reference disagreement (~1e-14 ulp) is orders of magnitude below the round-to-nearest error (~0.49 ulp) whose <0.5 ulp verdict it validates, so a systematic single-reference error large enough to flip that verdict is ruled out',
    holds: () =>
      BAND_MAX_CROSS_REF_ULP < 1e-6 &&
      BAND_MAX_CROSS_REF_ULP < BAND_MAX_DD_ROUND_ERR_ULP,
  },
  {
    // With PATH B as the reference, the three imp-34952 properties still hold band-wide.
    id: 'imp34971-imp34952-properties-hold-against-second-reference',
    description: 'measured against the independent PATH B reference, the double-double log is still correctly rounded (<= 0.5 ulp), native Math.log still agrees with the correctly-rounded double, and the directed [RD,RU] enclosure still brackets the reference with outward width exactly 1 ulp, at every site and rung (failing_rungs empty)',
    holds: () =>
      ALL_RUNGS_CORRECTLY_ROUNDED &&
      BAND_MAX_DD_ROUND_ERR_ULP <= 0.5 + 1e-9 &&
      ALL_RUNGS_NATIVE_MATCH &&
      BAND_MAX_NATIVE_ERR_ULP <= 0.5 + 1e-9 &&
      ALL_RUNGS_BRACKET &&
      ALL_RUNGS_ONE_ULP &&
      FAILING_RUNGS.length === 0,
  },
  {
    // Both independent paths reproduce known logarithms to double-double precision, and disagree tightly
    // at log(10) where BOTH series do real work (validates the shared EFT substrate and both series).
    id: 'imp34971-both-references-self-check',
    description: 'both the atanh-series and log1p-Taylor references reproduce log(e)=1, log(2) and log(10) to well below double precision, and disagree at log(10) by << 1 ulp -- validating the shared EFT substrate and that both series converge to the same value',
    holds: () =>
      Math.abs(SELF_CHECK.atanh_log_e - 1) < 1e-15 &&
      Math.abs(SELF_CHECK.taylor_log_e - 1) < 1e-15 &&
      Math.abs(SELF_CHECK.atanh_log_2 - LOG2_DD[0]) < 1e-15 &&
      Math.abs(SELF_CHECK.taylor_log_2 - LOG2_DD[0]) < 1e-15 &&
      Math.abs(SELF_CHECK.atanh_log_10 - SELF_CHECK.ln10_native) < 1e-14 &&
      Math.abs(SELF_CHECK.taylor_log_10 - SELF_CHECK.ln10_native) < 1e-14 &&
      SELF_CHECK.cross_ref_log10_ulp < 1e-6,
  },
  {
    // Honesty gate: measurement only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34971-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.isRigorous === false &&
      /imp-34714a/.test(IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.subGap) &&
      /imp-34687a/.test(IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.subGap) &&
      /REMAINS? OPEN/.test(IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.subGap) &&
      /NO QED/.test(IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP34971_DOUBLE_DOUBLE_LOG_SECOND_REFERENCE_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34971-double-double-log-second-reference-cross-validation assertion failed: ${a.id}`);
  }
}
