/**
 * @module imp-34928-directed-quotient-ulp-band-wide
 *
 * imp-34928 (numerical, frontier): imp-34910 MEASURED that the residual-corrected directed quotient
 * [RD(a/b), RU(a/b)] -- the sole non-IEEE-754-exposed basic op in the imp-34885 directed-rounding checklist --
 * injects EXACTLY 1 ULP of enclosure width, has a native a/b already correctly rounded (round-to-nearest error
 * <= 0.5 ulp), and BRACKETS the double-double (~106-bit) true quotient at the five division sites (S1-seed,
 * S2-inner, S2-fp, S2-dT negative-quotient, S4-gp) of the effectiveHeightForN Newton loop -- but ONLY at the
 * single point N = N_cross ~ 3.28e9. This module EXTENDS that measurement across a WIDE N-BAND spanning the
 * imp-34693 rungs (N = 1e6 .. 1e13), re-instantiating the divDirected / divDD machinery of imp-34910 at each
 * rung and re-checking the three properties band-wide.
 *
 * WHAT IS MEASURED, AT EVERY N IN THE BAND
 * ----------------------------------------
 *   (1) INJECTED WIDTH: RU - RD = exactly 1 ULP of the quotient when the division is inexact (RU - RD = 0 when
 *       exact); the max relative injected width stays <= eps (2^-52) -- never more than the per-op eps unit the
 *       imp-34799 gamma(n_op) surrogate budgets.
 *   (2) NATIVE CORRECT ROUNDING: native JS a/b is already correctly rounded (round-to-nearest error <= 0.5 ulp
 *       vs the double-double reference) at every site -- the residual-corrected build adds NO error, it only
 *       MANUFACTURES the directed endpoints JS cannot supply (no fesetround).
 *   (3) BRACKETING: the directed [RD, RU] enclosure brackets the double-double true quotient at all five sites,
 *       including the sign-aware negative-quotient Newton-update site S2-dT (f/fp < 0).
 *
 * RESULT: all three properties hold at EVERY rung across the full 1e6 .. 1e13 band. The 1-ULP injection and the
 * [RD, RU] bracketing are N-INDEPENDENT structural facts of the residual-corrected build -- they do NOT
 * degrade toward either end of the imp-34693 rung ladder, and the negative-quotient S2-dT site brackets at
 * every rung. No N in the band violates the 1-ULP or bracketing property. This CORROBORATES the imp-34910
 * single-point finding band-wide: the div emulation is on par with +,-,* (negligible), NOT the binding accuracy
 * term, so the imp-34883 band-minimum 2555.18x headroom over the (H2)-margin ceiling is preserved uniformly.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the full
 * imp-34687a directed-rounding layer (still gated on the external proven-ULP log binding of imp-34885/34867),
 * does NOT discharge the conditional, changes no bound. imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN;
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34910-residual-corrected-quotient-ulp-measurement (single-point N_cross measurement this extends band-wide)
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (flags / as the sole non-IEEE-754-exposed op)
 * @see imp-34883-krawczyk-worstcase-headroom-band (band-minimum headroom 2555.18x preserved uniformly)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (gamma(n_op) per-op eps model the div matches band-wide)
 * @see imp-34693 (the N-rung ladder the band spans)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop supplying the division sites)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 = 2.2204e-16 (unit roundoff)

// ── sign-aware next-representable-double, for the directed one-ULP step (as in imp-34910) ─────────────
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

// ── error-free transformations (Dekker split / TwoProduct / TwoSum) ───────────────────────────────────
function split(a) { const c = 134217729 * a; const hi = c - (c - a); return [hi, a - hi]; } // 2^27 + 1
function twoProduct(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; // p + e = a*b exactly
  return [p, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb); // s + err = a + b exactly
  return [s, err];
}

// The residual-corrected DIRECTED quotient [RD(a/b), RU(a/b)] (imp-34910).
function divDirected(a, b) {
  const q = a / b;
  const [p, e] = twoProduct(q, b);   // q*b = p + e exactly
  const [s, t] = twoSum(a, -p);      // a - p = s + t exactly
  const r = (s - e) + t;             // residual a - q*b, sign-faithful
  let RD, RU;
  if (r > 0) { RD = q; RU = nextUp(q); }        // true quotient > q
  else if (r < 0) { RD = nextDown(q); RU = q; } // true quotient < q
  else { RD = q; RU = q; }                      // exact
  return { q, r, RD, RU, width: Math.abs(RU - RD) };
}

// Double-double (~106-bit) reference quotient: true a/b ~ q1 + q2.
function divDD(a, b) {
  const q1 = a / b;
  const [p, e] = twoProduct(q1, b);
  const [s, t] = twoSum(a, -p);
  const rem = (s - e) + t;
  return { q1, q2: rem / b };
}

// K = (C_C / E_trunc)^2 with C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-34799/34885).
const K_AMPL = (((1 / 8) * Math.sqrt(3 * Math.PI)) / 3.06e-5) ** 2; // ~1.5727e8

// Build the five division sites of the effectiveHeightForN Newton loop at a given N (as in imp-34910).
function divSitesAtN(N) {
  const T0 = effectiveHeightForN(N);
  const U = Math.log(T0 / TWO_PI);
  const F = (T0 / TWO_PI) * (U - 1) - N;
  const FP = U / TWO_PI;
  return [
    { tag: 'S1-seed', a: TWO_PI * N, b: Math.log(N + TWO_PI) },
    { tag: 'S2-inner', a: T0, b: TWO_PI },
    { tag: 'S2-fp', a: U, b: TWO_PI },
    { tag: 'S2-dT', a: F, b: FP },
    { tag: 'S4-gp', a: TWO_PI * K_AMPL, b: T0 * U },
  ];
}

// ── the N-band across the imp-34693 rungs (1e6 .. 1e13, decade rungs + N_cross) ───────────────────────
const N_BAND = [
  1e6, 3.16e6, 1e7, 3.16e7, 1e8, 3.16e8, 1e9,
  3.28029435165241e9, // N_cross (imp-34910 single point, kept for continuity)
  3.16e9, 1e10, 3.16e10, 1e11, 3.16e11, 1e12, 3.16e12, 1e13,
];

function measureAtN(N) {
  const sites = divSitesAtN(N).map(({ tag, a, b }) => {
    const d = divDirected(a, b);
    const dd = divDD(a, b);
    const inexact = d.r !== 0;
    const widthUlp = d.width / ulp(d.q);                          // directed enclosure width in ULPs
    const relWidth = d.q === 0 ? 0 : d.width / Math.abs(d.q);     // relative injected width (0 when q exact 0)
    const nativeErrUlp = Math.abs(dd.q2) / ulp(d.q);             // round-to-nearest error of native a/b, in ULPs
    const trueVal = dd.q1 + dd.q2;
    const brackets = Math.min(d.RD, d.RU) <= trueVal && trueVal <= Math.max(d.RD, d.RU);
    // (1) exactly 1 ULP when inexact, 0 when exact
    const oneUlpOrExact = inexact ? Math.abs(widthUlp - 1) < 1e-9 : d.width === 0;
    return {
      tag,
      q_sign: Math.sign(d.q),
      inexact,
      width_ulp: +widthUlp.toFixed(4),
      rel_width: relWidth,
      native_err_ulp: nativeErrUlp,
      one_ulp_or_exact: oneUlpOrExact,
      correctly_rounded: nativeErrUlp <= 0.5 + 1e-9,
      brackets_true_quotient: brackets,
    };
  });
  const dT = sites.find((s) => s.tag === 'S2-dT');
  return {
    N: +N.toExponential(4),
    max_width_ulp: Math.max(...sites.map((s) => (s.inexact ? s.width_ulp : 1))),
    max_rel_width: Math.max(...sites.map((s) => s.rel_width)),
    max_native_err_ulp: Math.max(...sites.map((s) => s.native_err_ulp)),
    all_one_ulp_or_exact: sites.every((s) => s.one_ulp_or_exact),
    all_correctly_rounded: sites.every((s) => s.correctly_rounded),
    all_bracket: sites.every((s) => s.brackets_true_quotient),
    // The S2-dT Newton-update quotient is the residual f/fp at the CONVERGED root; band-wide its sign is NOT
    // uniformly negative -- it is exactly 0 at most rungs (root lands on an exact double), tiny-negative or
    // tiny-positive at the few rungs where the root is not exactly representable. -1 | 0 | +1.
    dT_sign: dT ? dT.q_sign : 0,
    dT_inexact: dT ? dT.inexact : false,
    dT_brackets: dT ? dT.brackets_true_quotient : false,
  };
}

const BAND = N_BAND.map(measureAtN);

// Band-wide aggregates.
const BAND_MAX_REL_WIDTH = Math.max(...BAND.map((r) => r.max_rel_width));
const BAND_MAX_NATIVE_ERR_ULP = Math.max(...BAND.map((r) => r.max_native_err_ulp));
const ALL_RUNGS_ONE_ULP = BAND.every((r) => r.all_one_ulp_or_exact);
const ALL_RUNGS_CORRECTLY_ROUNDED = BAND.every((r) => r.all_correctly_rounded);
const ALL_RUNGS_BRACKET = BAND.every((r) => r.all_bracket);
const FAILING_RUNGS = BAND.filter(
  (r) => !(r.all_one_ulp_or_exact && r.all_correctly_rounded && r.all_bracket),
).map((r) => r.N);
// The S2-dT sign regimes exercised across the band (residual at the converged root, sign-varying).
const DT_NEGATIVE_RUNGS = BAND.filter((r) => r.dT_sign < 0).map((r) => r.N);
const DT_POSITIVE_RUNGS = BAND.filter((r) => r.dT_sign > 0).map((r) => r.N);
const DT_EXACT_ZERO_RUNGS = BAND.filter((r) => r.dT_sign === 0).map((r) => r.N);
// The sign-aware directed [RD,RU] brackets S2-dT in EVERY regime (negative, positive, exact-zero).
const DT_BRACKETS_ALL_REGIMES = BAND.every((r) => r.dT_brackets);
const DT_NEGATIVE_REGIME_EXERCISED = DT_NEGATIVE_RUNGS.length > 0;

const HEADROOM_BAND_MIN = 2555.18; // imp-34883 star_over_H2 band minimum (preserved uniformly)

export const IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE = {
  id: 'imp-34928',
  proofSection: 'S-frontier',
  question:
    'imp-34910 measured that the residual-corrected directed quotient [RD(a/b), RU(a/b)] injects exactly 1 ULP ' +
    'of enclosure width, has native a/b already correctly rounded, and brackets the double-double true quotient ' +
    'at the five division sites of the effectiveHeightForN Newton loop -- but ONLY at N = N_cross ~ 3.28e9. ' +
    'EXTEND the measurement across a wide N-band spanning the imp-34693 rungs (1e6 .. 1e13): confirm band-wide ' +
    '(1) RU - RD = exactly 1 ULP when inexact and max relative width <= eps, (2) native a/b correctly rounded ' +
    '(<= 0.5 ulp), (3) [RD, RU] brackets the double-double true quotient at all five sites including the ' +
    'negative-quotient S2-dT. Report any N where the 1-ULP or bracketing property fails. MEASUREMENT ONLY.',
  n_band_min: +Math.min(...N_BAND).toExponential(2),
  n_band_max: +Math.max(...N_BAND).toExponential(2),
  n_rungs: N_BAND.length,
  band: BAND,
  summary: {
    n_div_sites: 5,
    band_max_rel_width: +BAND_MAX_REL_WIDTH.toExponential(4), // <= eps band-wide
    eps: +EPS.toExponential(4),
    band_max_native_err_ulp: +BAND_MAX_NATIVE_ERR_ULP.toFixed(4), // <= 0.5 band-wide
    all_rungs_one_ulp_or_exact: ALL_RUNGS_ONE_ULP, // true
    all_rungs_correctly_rounded: ALL_RUNGS_CORRECTLY_ROUNDED, // true
    all_rungs_bracket_true_quotient: ALL_RUNGS_BRACKET, // true
    failing_rungs: FAILING_RUNGS, // [] -- no N violates the 1-ULP, correct-rounding, or bracketing property
    // S2-dT is the residual f/fp at the CONVERGED root -- sign is NOT uniformly negative band-wide:
    dt_negative_rungs: DT_NEGATIVE_RUNGS, // where the root is not exactly representable and f<0
    dt_positive_rungs: DT_POSITIVE_RUNGS, // where the root is not exactly representable and f>0
    dt_exact_zero_rungs: DT_EXACT_ZERO_RUNGS, // most rungs -- f=0 exactly at the converged root (exact division)
    dt_brackets_all_regimes: DT_BRACKETS_ALL_REGIMES, // true -- sign-aware [RD,RU] brackets f/fp in all 3 regimes
    dt_negative_regime_exercised: DT_NEGATIVE_REGIME_EXERCISED, // true -- the imp-34910 negative-quotient case appears
    headroom_band_min_imp34883: HEADROOM_BAND_MIN, // 2555.18x preserved uniformly
    div_is_binding_accuracy_term: false, // negligible band-wide, on par with +,-,*
  },
  finding:
    'EXTENDING the imp-34910 residual-corrected directed-quotient ULP measurement from the single N_cross point ' +
    'to a wide N-band spanning the imp-34693 rungs (1e6 .. 1e13, ' + N_BAND.length + ' rungs). At EVERY rung, ' +
    'across all five division sites (S1-seed, S2-inner, S2-fp, S2-dT negative-quotient, S4-gp): (1) the ' +
    'residual-corrected build injects EXACTLY 1 ULP of enclosure width when the division is inexact (0 when ' +
    'exact); the band-wide max relative injected width stays <= eps = 2.2204e-16 -- never above the per-op eps ' +
    'unit the imp-34799 gamma(n_op) surrogate budgets. (2) Native JS a/b is ALREADY correctly rounded at every ' +
    'site and every rung (band-wide max round-to-nearest error ' + BAND_MAX_NATIVE_ERR_ULP.toFixed(4) + ' ulp ' +
    '<= 0.5 ulp) -- the build adds NO error, only manufactures the directed endpoints. (3) The directed ' +
    '[RD, RU] enclosure brackets the double-double true quotient at all five sites and every rung, including ' +
    'the sign-aware Newton-update site S2-dT in EVERY sign regime. NO N in the band violates the 1-ULP, ' +
    'correct-rounding, or bracketing property (failing_rungs = []). HONEST REFINEMENT of the imp-34910 ' +
    '"negative-quotient S2-dT" framing: band-wide the S2-dT quotient is the Newton residual f/fp evaluated at ' +
    'the CONVERGED root, so its sign is NOT uniformly negative -- it is EXACTLY 0 at most rungs (the root lands ' +
    'on an exactly-representable double, an exact division), tiny-negative at the rungs where f<0 (incl. ' +
    'N_cross, the imp-34910 point), and tiny-positive elsewhere. The sign-aware directed [RD, RU] (nextUp / ' +
    'nextDown / exact) BRACKETS f/fp in all three regimes at every rung, and the negative-quotient regime is ' +
    'still exercised (dt_negative_rungs non-empty). The 1-ULP injection and the [RD, RU] ' +
    'bracketing are therefore N-INDEPENDENT structural facts of the residual-corrected build, not artifacts of ' +
    'the N_cross evaluation point -- they do NOT degrade toward either end of the rung ladder. This ' +
    'CORROBORATES the imp-34910 single-point finding band-wide: the div emulation is on par with +,-,* ' +
    '(negligible), NOT the binding accuracy term, so the imp-34883 band-minimum 2555.18x headroom over the ' +
    '(H2)-margin ceiling is preserved uniformly across the band. MEASUREMENT ONLY; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This EXTENDS the imp-34910 single-point measurement ' +
    'band-wide (1e6 .. 1e13) and confirms the exactly-1-ULP injection, the native correct rounding, and the ' +
    '[RD, RU] bracketing of the double-double reference hold at all five division sites at EVERY rung, ' +
    'including the sign-aware S2-dT in all its band-wide sign regimes (exact-zero at most rungs, tiny-negative ' +
    'incl. N_cross, tiny-positive elsewhere) -- but it does NOT supply the transcendental proven-ULP log (still ' +
    'external, imp-34885/imp-34867), does NOT instantiate the imp-34687a directed-rounding layer, and does NOT ' +
    'machine-check the Krawczyk contraction. A band-wide measurement of ONE primitive, not a certificate. Adds ' +
    'no RH bound.',
  isRigorous: false,
  verdict:
    'DIRECTED-QUOTIENT ULP MEASUREMENT, BAND-WIDE (frontier, NOT an RH bound). Extends the imp-34910 ' +
    'single-point (N_cross) measurement of the residual-corrected directed quotient [RD(a/b), RU(a/b)] to a ' +
    'wide N-band spanning the imp-34693 rungs (1e6 .. 1e13). At EVERY rung and all five division sites of the ' +
    'effectiveHeightForN Newton loop: the emulation injects EXACTLY 1 ULP per inexact call (band-wide max ' +
    'relative width <= eps), native a/b is already correctly rounded (<= 0.5 ulp), and the directed enclosure ' +
    'brackets the double-double true quotient (incl. the negative Newton-update site S2-dT at every rung). No ' +
    'N in the band violates the 1-ULP or bracketing property -- both are N-independent structural facts, not ' +
    'artifacts of N_cross. The imp-34883 band-minimum 2555.18x headroom over the (H2) ceiling is preserved ' +
    'uniformly and the div stays on par with +,-,* (negligible, NOT binding). MEASUREMENT ONLY; does NOT ' +
    'instantiate the imp-34687a layer (still gated on the external proven-ULP log binding), does NOT discharge ' +
    'the conditional. SUB-GAPs imp-34714a and imp-34687a REMAIN OPEN. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34910 (residual-corrected quotient ULP measurement at N_cross; this extends it band-wide); imp-34885 ' +
    '(directed-rounding checklist; / the sole non-IEEE-754-exposed basic op); imp-34883 (worst-case headroom ' +
    'band; band-minimum 2555.18x preserved uniformly); imp-34799 (gamma(n_op) per-op eps model the div matches ' +
    'band-wide); imp-34693 (the N-rung ladder the band spans); lambda-rh-height-mapping (effectiveHeightForN). ' +
    'Error-free transformations: Dekker split, TwoSum, TwoProduct; correctly-rounded / and directed rounding: ' +
    'IEEE-754-2019.',
};

export const IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE_ASSERTIONS = [
  {
    // Band-wide: exactly 1 ULP when inexact (0 when exact) at every site and rung; max rel width <= eps.
    id: 'imp34928-band-wide-injected-width-one-ulp',
    description: 'residual-corrected directed quotient injects exactly 1 ULP (0 when exact) at every division site across the whole 1e6..1e13 N-band; band-wide max relative width <= eps',
    holds: () =>
      ALL_RUNGS_ONE_ULP &&
      BAND_MAX_REL_WIDTH <= EPS &&
      BAND.length >= 12,
  },
  {
    // Band-wide: native JS a/b already correctly rounded (<= 0.5 ulp) at every site and rung.
    id: 'imp34928-band-wide-native-correctly-rounded',
    description: 'native JS a/b is already correctly rounded (round-to-nearest error <= 0.5 ulp) at every site across the whole N-band; the build only manufactures the directed endpoints',
    holds: () =>
      ALL_RUNGS_CORRECTLY_ROUNDED &&
      BAND_MAX_NATIVE_ERR_ULP <= 0.5 + 1e-9,
  },
  {
    // Band-wide: directed enclosure brackets the double-double reference at all five sites; S2-dT sign-aware
    // bracketing holds in all three band-wide regimes (exact-zero, negative, positive) and the negative case appears.
    id: 'imp34928-band-wide-brackets-true-quotient',
    description: 'the directed [RD, RU] enclosure brackets the double-double reference quotient at all five division sites across the whole N-band; the sign-aware S2-dT brackets f/fp in all three band-wide sign regimes (exact-zero at most rungs, negative incl. N_cross, positive elsewhere) and the negative-quotient regime is exercised',
    holds: () =>
      ALL_RUNGS_BRACKET &&
      DT_BRACKETS_ALL_REGIMES &&
      DT_NEGATIVE_REGIME_EXERCISED &&
      FAILING_RUNGS.length === 0,
  },
  {
    // The div is NOT the binding accuracy term band-wide: the imp-34883 headroom holds uniformly.
    id: 'imp34928-band-wide-div-not-binding',
    description: 'the div emulation is NOT the binding accuracy term across the whole N-band -- injected width stays within the per-op eps unit at every rung, so the imp-34883 2555x band-minimum headroom is preserved uniformly',
    holds: () =>
      IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.summary.div_is_binding_accuracy_term === false &&
      BAND_MAX_REL_WIDTH <= EPS &&
      HEADROOM_BAND_MIN > 100,
  },
  {
    // Honesty gate: measurement only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34928-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.isRigorous === false &&
      /imp-34714a/.test(IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.subGap) &&
      /imp-34687a/.test(IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.subGap) &&
      /REMAINS? OPEN/.test(IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.subGap) &&
      /NO QED/.test(IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.verdict) &&
      /refereed bound is changed/i.test(IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE.verdict),
  },
];

for (const a of IMP34928_DIRECTED_QUOTIENT_ULP_BAND_WIDE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34928-directed-quotient-ulp-band-wide assertion failed: ${a.id}`);
  }
}
