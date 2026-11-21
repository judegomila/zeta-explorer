/**
 * @module imp-35258-krawczyk-residual-double-double-measurement
 *
 * imp-35258 (numerical, frontier-direction) -- RE-MEASURES the imp-35241 / imp-34714a Krawczyk certificate
 * residual F(m) = 0 in cancellation-free double-double (dd) arithmetic, to test whether F(m) is GENUINELY zero
 * or merely sits below the IEEE-754 double-precision floor.
 *
 * THE OPEN QUESTION
 * -----------------
 * The imp-34714 Krawczyk existence-uniqueness lemma for the Riemann-von Mangoldt height inverse encloses T0 as
 * the root of the certificate residual F(m; N) = (m/2pi)(log(m/2pi) - 1) - N, where m = mid([T]) is the double-
 * precision Newton root effectiveHeightForN(N). Every module in the imp-34774 -> imp-34794 -> imp-34799 ->
 * imp-34843/34861/34883/34906/34929 -> imp-35176/35241 chain records the SAME caveat: at the double-precision
 * root the computed F(m) = 0, which collapses the nominal Krawczyk image to the centre m, and this "F(m) = 0" is
 * flagged as a DOUBLE-PRECISION ARTIFACT (a genuine directed-rounding F(m) would be a small NONZERO interval),
 * leaving the imp-34714a machine certificate OPEN. imp-34799 BOUNDED a-priori how wide a directed-rounding F(m)
 * interval would be (~gamma(n_op) N_cross) but never MEASURED the actual residual at higher precision. imp-35109
 * / imp-35174 showed the way for the reentry BAND -- recompute the suspect double quantity in a cancellation-free
 * dd path -- but never applied it to the certificate residual itself. This module does exactly the imp-35258
 * ticket: it re-computes F(m) at the imp-34693 / imp-35241 admissible-band seed points in dd and MEASURES whether
 * F(m) is genuinely zero or below the double floor.
 *
 * WHY F(m) = 0 IN DOUBLE IS SUSPECT
 * ---------------------------------
 * F(m) = (m/2pi)(log(m/2pi) - 1) - N differences two quantities each of order N ~ 3e9 to land a residual of
 * order ~1e-7 -- a ~16-digit CANCELLATION. In double precision the leading term (m/2pi)(log(m/2pi) - 1) is
 * evaluated with ~m eps ~ 1e9 * 2.2e-16 ~ 2e-7 rounding noise, of the SAME order as the residual it is being
 * differenced against, so the subtraction lands on 0 (or the nearest double). That is a floor phenomenon, not a
 * mathematical zero. The cancellation-free dd path forms the product (m/2pi)(log(m/2pi) - 1) to ~32 digits and
 * subtracts N exactly, exposing the genuine residual.
 *
 * THE RESULT: F(m) IS GENUINELY NONZERO -- "F(m) = 0" IS A DOUBLE-PRECISION ARTIFACT
 * ---------------------------------------------------------------------------------
 * Across the imp-35241 admissible seed band [N_bot, N_top] ~ [3.1090e9, 3.4515e9] (centred on N_cross ~ 3.2803e9,
 * half-width rho ~ 1.7124e8) the DOUBLE residual F_double(m) = 0 at EVERY sampled seed (the artifact reproduced),
 * yet the cancellation-free dd residual F_dd(m) is GENUINELY NONZERO at every seed -- magnitude of order
 * ~1e-7 (roughly one ulp of m ~ 1.1e9). Concretely: F_dd ~ -3.11e-7 at the band-bottom (N ~ 3.109e9),
 * ~ -4.56e-8 at N_cross, ~ -1.03e-7 at the band-top -- values that never round to zero in dd. So F(m) = 0 is a
 * DOUBLE-PRECISION ARTIFACT: F(m) is NOT genuinely zero.
 *
 * STRONGER THAN "BELOW THE FLOOR": AT THE BAND BOTTOM F(m) EXCEEDS THE FLOOR
 * -------------------------------------------------------------------------
 * The relevant floor is 0.5 ulp(m) ~ 1.19e-7 (the resolution at which a double residual near m is quantized).
 * At most band seeds |F_dd| sits just BELOW that floor (~0.38 half-ulp at N_cross), consistent with "F(m) = 0
 * because the true value is below the representable floor." But at the BAND BOTTOM |F_dd| ~ 3.11e-7 is ~2.6x
 * the half-ulp floor -- ABOVE it. There the double F(m) = 0 is NOT a below-floor value at all but a
 * CATASTROPHIC-CANCELLATION artifact: the genuine residual exceeds the representable resolution, yet the double
 * subtraction of two ~1e9 quantities still cancels to 0. Either way the conclusion is the same and sharper than
 * the prior chain assumed: F(m) = 0 is an artifact of double-precision evaluation, not a mathematical zero, and
 * a genuine directed-rounding F(m) would indeed be a small nonzero interval as imp-34799 modelled.
 *
 * WHAT THIS DOES AND DOES NOT DISCHARGE
 * ------------------------------------
 * This MEASURES the residual and confirms F(m) = 0 is a double artifact; it does NOT construct the imp-34714a
 * machine certificate. A certificate needs a directed-rounding [RD, RU] enclosure of F(m) with correctly-rounded
 * primitives (imp-34908 scoped: a proven-ULP log and a residual-corrected quotient JS cannot supply), not a
 * higher-precision point estimate. A dd point value of F(m), however accurate, is still a surrogate for the
 * directed-rounding interval, so it cannot CLOSE imp-34714a. The measurement does, however, retire the residual
 * doubt "maybe F(m) really is zero and the whole Krawczyk step is degenerate": it is not zero, the imp-34799
 * nonzero-interval model is the correct one, and the certificate remains a directed-rounding-primitives task,
 * not a mathematical obstruction.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35258a)
 * -----------------------------------
 * imp-35258a = instantiate the imp-34908-scoped directed-rounding [RD, RU] enclosure of F(m) with correctly-
 * rounded log/quotient primitives, turning this dd point measurement into the imp-34714a machine certificate. It
 * inherits, and does not discharge, imp-34714a / imp-34687a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A double-vs-double-double MEASUREMENT of the imp-34714 certificate residual F(m) at the imp-35241 admissible
 * seed band. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; the dd path is the
 * compact hand-rolled double-double reproduced VERBATIM from imp-35109/imp-35174, self-checked below. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; imp-34714a REMAINS OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the certificate whose F(m); sub-gap imp-34714a)
 * @see imp-35241-krawczyk-headroom-band-profile (the admissible seed band [N_bot, N_top]; F(m) = 0 artifact)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori nonzero-interval width bound; never measured)
 * @see imp-34908-krawczyk-certificate-precision-scope (primitives a genuine certificate needs)
 * @see imp-35174-reentry-band-precision-certification (the dd toolkit reproduced verbatim here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to the imp-34774/35176/35241 chain)

// ---------------------------------------------------------------------------------------------------------
// The imp-35109/imp-35174 compact double-double (dd) toolkit, reproduced VERBATIM. dd value = [hi, lo],
// |lo| <= 0.5 ulp(hi). Standard Dekker/Knuth/Shewchuk algorithms; ~32 digits, enough to expose any artifact.
// ---------------------------------------------------------------------------------------------------------
function quickTwoSum(a, b) {
  const s = a + b;
  const e = b - (s - a);
  return [s, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function split(a) {
  const c = 134217729 * a; // (2^27 + 1)
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
function ddAdd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  return quickTwoSum(s, e);
}
function ddSub(a, b) {
  return ddAdd(a, [-b[0], -b[1]]);
}
function ddMul(a, b) {
  let [p, e] = twoProd(a[0], b[0]);
  e += a[0] * b[1] + a[1] * b[0];
  return quickTwoSum(p, e);
}
function ddMulD(a, b) {
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  return quickTwoSum(p, e);
}
function ddDivD(a, b) {
  const q1 = a[0] / b;
  const [p, pe] = twoProd(q1, b);
  const r = ddSub(a, [p, pe]);
  const q2 = r[0] / b;
  return quickTwoSum(q1, q2);
}
// dd natural log of a dd argument x > 0: one Newton step on exp corrects the double log to dd precision.
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const ey = Math.exp(y0);
  const q = ddDivD(x, ey);
  const corr = ddSub(q, [1, 0]);
  return ddAdd([y0, 0], corr);
}

// ---------------------------------------------------------------------------------------------------------
// The imp-34714 certificate residual F(m; N) = (m/2pi)(log(m/2pi) - 1) - N, in DOUBLE and in dd.
// m = mid([T]) is the double-precision Newton root effectiveHeightForN(N).
// ---------------------------------------------------------------------------------------------------------
function fDouble(m, N) {
  const u = Math.log(m / TWO_PI);
  return (m / TWO_PI) * (u - 1) - N; // the difference that cancels to 0 at the double root
}
function fDD(m, N) {
  const Th = ddDivD([m, 0], TWO_PI); // m/2pi
  const u = ddLog(Th); // log(m/2pi)
  const um1 = ddSub(u, [1, 0]); // log(m/2pi) - 1
  const prod = ddMul(Th, um1); // (m/2pi)(log(m/2pi) - 1)
  return ddSub(prod, [N, 0]); // residual, cancellation-free in dd
}
// Half-ulp of a positive double: the resolution at which a residual near m is quantized.
function halfUlp(x) {
  const e = Math.floor(Math.log2(Math.abs(x)));
  return Math.pow(2, e - 52 - 1);
}

// ---------------------------------------------------------------------------------------------------------
// The imp-34693 / imp-35241 admissible seed band, reproduced from published literals.
// N_cross ~ 3.2803e9 (Banach fixed point of g = K log T0), widest (k=10) rung half-width rho ~ 1.7124e8.
// ---------------------------------------------------------------------------------------------------------
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS = iterateD(1e9, 200); // ~3.28029435e9 (bit-identical to the imp-34774/35241 chain)
const RHO = 1.7124e8; // imp-35241 widest-rung (k=10) half-width
const N_BOT = N_CROSS - RHO; // ~3.1090e9
const N_TOP = N_CROSS + RHO; // ~3.4515e9

// Sample the band on a small symmetric grid; also include the imp-34714 verification seed N = 1e9.
const BAND_SEEDS = [N_BOT, N_CROSS - RHO / 2, N_CROSS, N_CROSS + RHO / 2, N_TOP];

// ---------------------------------------------------------------------------------------------------------
// MEASUREMENT: F_double(m) vs F_dd(m) at each band seed.
// ---------------------------------------------------------------------------------------------------------
const MEASUREMENTS = BAND_SEEDS.map((N) => {
  const m = effectiveHeightForN(N); // double Newton root = mid([T])
  const fd = fDouble(m, N);
  const fddPair = fDD(m, N);
  const fdd = fddPair[0] + fddPair[1];
  const hu = halfUlp(m);
  return {
    seed_N: +N.toExponential(6),
    root_m_T0: +m.toExponential(10),
    f_double: fd, // 0 at every band seed (the artifact)
    f_dd: +fdd.toExponential(6), // genuine residual, nonzero
    half_ulp_m: +hu.toExponential(6),
    abs_fdd_over_half_ulp: +(Math.abs(fdd) / hu).toExponential(4),
    genuinely_zero: fdd === 0,
    below_double_floor: Math.abs(fdd) < hu,
  };
});

// The imp-34714 verification seed N = 1e9 (a-priori bracket [3.7180e8, 3.7195e8]).
const SEED_1E9 = (() => {
  const N = 1e9;
  const m = effectiveHeightForN(N);
  const fd = fDouble(m, N);
  const fddPair = fDD(m, N);
  const fdd = fddPair[0] + fddPair[1];
  const hu = halfUlp(m);
  return {
    seed_N: 1e9,
    root_m_T0: +m.toExponential(10), // ~3.7187020453e8
    f_double: +fd.toExponential(6),
    f_dd: +fdd.toExponential(6),
    half_ulp_m: +hu.toExponential(6),
    abs_fdd_over_half_ulp: +(Math.abs(fdd) / hu).toExponential(4),
    genuinely_zero: fdd === 0,
  };
})();

// Aggregate findings across the band.
const ALL_F_DOUBLE_ZERO = MEASUREMENTS.every((r) => r.f_double === 0);
const ALL_F_DD_NONZERO = MEASUREMENTS.every((r) => r.f_dd !== 0);
const ABS_FDD = MEASUREMENTS.map((r) => Math.abs(r.f_dd));
const MAX_ABS_FDD = Math.max(...ABS_FDD); // ~3.11e-7 (band-bottom)
const MIN_ABS_FDD = Math.min(...ABS_FDD); // ~4.56e-8 (near N_cross)
// At least one band seed has |F_dd| ABOVE the half-ulp floor => catastrophic-cancellation artifact,
// not merely a below-floor value.
const ANY_ABOVE_FLOOR = MEASUREMENTS.some((r) => !r.below_double_floor);
// The genuine residual sits at the ~1 ulp(m) scale (order 1e-7), i.e. the machine-precision floor scale.
const RESIDUAL_AT_ULP_SCALE = MAX_ABS_FDD < 1e-6 && MIN_ABS_FDD > 1e-9;

// Cross-check the dd toolkit is genuinely beyond double (identical self-test to imp-35109/35174).
const DD_SUBULP = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1; // true: double cannot hold this bit
  const le = ddLog([Math.E, 0]); // log(e): hi~1, lo the sub-ulp correction
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  return { lo: s[1], doubleLost, logOk };
})();
const DD_BEYOND_DOUBLE =
  Math.abs(DD_SUBULP.lo - 1e-20) < 1e-35 && DD_SUBULP.doubleLost && DD_SUBULP.logOk;

const F_M_IS_ARTIFACT = ALL_F_DOUBLE_ZERO && ALL_F_DD_NONZERO && DD_BEYOND_DOUBLE;

export const IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT = {
  id: 'imp-35258',
  proofSection: 'S-frontier',
  question:
    'imp-35241 records that the imp-34714a machine certificate REMAINS OPEN and that the Krawczyk certificate ' +
    'residual F(m) = (m/2pi)(log(m/2pi) - 1) - N = 0 stays a double-precision artifact at the admissible-band ' +
    'seed points. Re-compute F(m) in cancellation-free double-double arithmetic (as imp-35109/imp-35174 did for ' +
    'the reentry band) and MEASURE whether F(m) is genuinely zero or merely below the IEEE-754 double floor.',
  constants: {
    K_amplification: +K_AMPL.toExponential(6), // ~1.5727e8
    N_cross_fixed_point: +N_CROSS.toExponential(10), // ~3.28029435e9
    band_half_width_rho: +RHO.toExponential(4), // ~1.7124e8 (imp-35241 widest rung)
    band_bottom_N: +N_BOT.toExponential(6), // ~3.1090e9
    band_top_N: +N_TOP.toExponential(6), // ~3.4515e9
    dd_carries_subulp_bit_double_drops: DD_BEYOND_DOUBLE, // true: dd holds ~1e-20 sub-ulp that double loses
  },
  band_measurements: MEASUREMENTS,
  imp34714_verification_seed_N_1e9: SEED_1E9,
  findings: {
    f_double_zero_at_every_band_seed: ALL_F_DOUBLE_ZERO, // true: the artifact reproduced
    f_dd_nonzero_at_every_band_seed: ALL_F_DD_NONZERO, // true: F(m) is NOT genuinely zero
    max_abs_f_dd_across_band: +MAX_ABS_FDD.toExponential(6), // ~3.11e-7 (band-bottom)
    min_abs_f_dd_across_band: +MIN_ABS_FDD.toExponential(6), // ~4.56e-8 (near N_cross)
    residual_at_one_ulp_scale: RESIDUAL_AT_ULP_SCALE, // true: order ~1e-7 ~ one ulp(m ~ 1.1e9)
    at_least_one_band_seed_above_half_ulp_floor: ANY_ABOVE_FLOOR, // true (band-bottom ~2.6x half-ulp)
    f_m_zero_is_double_precision_artifact: F_M_IS_ARTIFACT, // true
  },
  finding:
    'Re-computing the imp-34714 certificate residual F(m) = (m/2pi)(log(m/2pi) - 1) - N in the imp-35109/' +
    'imp-35174 cancellation-free double-double path settles the imp-35241 open question: the DOUBLE residual ' +
    'F_double(m) = 0 at EVERY admissible-band seed (the artifact reproduced), but the dd residual F_dd(m) is ' +
    'GENUINELY NONZERO everywhere -- magnitude ~' + (+MIN_ABS_FDD.toExponential(1)) + ' to ~' +
    (+MAX_ABS_FDD.toExponential(1)) + ' across the band, of order one ulp of m ~ 1.1e9. So F(m) = 0 is a ' +
    'DOUBLE-PRECISION ARTIFACT, NOT a mathematical zero: F(m) is not genuinely zero. The result is sharper than ' +
    '"below the floor": at most seeds |F_dd| sits just below the 0.5 ulp(m) ~ 1.19e-7 floor (consistent with a ' +
    'below-floor value), but at the BAND BOTTOM |F_dd| ~ 3.11e-7 is ~2.6x the half-ulp floor -- ABOVE it -- so ' +
    'there the double F(m) = 0 is a CATASTROPHIC-CANCELLATION artifact (two ~1e9 quantities differenced to a ' +
    '~1e-7 residual that the double subtraction loses), not a below-floor value. Either way F(m) = 0 is an ' +
    'artifact of double evaluation, and the imp-34799 nonzero-interval model is confirmed correct. This ' +
    'MEASURES the residual; it does NOT construct the imp-34714a machine certificate (a directed-rounding ' +
    '[RD, RU] enclosure with the imp-34908-scoped correctly-rounded log/quotient primitives), so imp-34714a ' +
    'REMAINS OPEN as re-pointed sub-gap imp-35258a.',
  residual_sub_gap_imp_35258a:
    'This is a dd POINT measurement of F(m), not a directed-rounding interval enclosure. It confirms F(m) is ' +
    'genuinely nonzero (order ~1e-7 ~ one ulp of m), retiring the doubt that the Krawczyk step is degenerate at ' +
    'a true zero, but a dd point value -- however accurate -- is still a surrogate for the [RD, RU] interval a ' +
    'machine certificate needs. imp-35258a = instantiate the imp-34908-scoped directed-rounding enclosure of ' +
    'F(m) with correctly-rounded log/quotient primitives, turning this measurement into the imp-34714a machine ' +
    'certificate; it inherits, and does not discharge, imp-34714a / imp-34687a.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-34714 Krawczyk certificate residual ' +
    'F(m) = (m/2pi)(log(m/2pi) - 1) - N -- flagged "= 0, a double-precision artifact" throughout the ' +
    'imp-34774 -> imp-35241 chain -- is re-computed at the imp-34693/imp-35241 admissible seed band ' +
    '[3.1090e9, 3.4515e9] in cancellation-free double-double arithmetic (imp-35109/imp-35174 toolkit reproduced ' +
    'verbatim, self-checked beyond double). FINDING: the double residual is 0 at every band seed, but the dd ' +
    'residual is GENUINELY NONZERO everywhere (~4.56e-8 near N_cross to ~3.11e-7 at the band-bottom, of order ' +
    'one ulp of m ~ 1.1e9). So F(m) = 0 is a DOUBLE-PRECISION ARTIFACT, not a mathematical zero. Sharper still: ' +
    'at the band-bottom |F_dd| ~ 2.6x the 0.5 ulp(m) floor -- ABOVE it -- so the double zero there is a ' +
    'catastrophic-cancellation artifact, not a below-floor value; elsewhere |F_dd| sits just below the floor. ' +
    'The imp-34799 nonzero-interval model is confirmed. This MEASURES the residual and retires the ' +
    '"maybe F(m) really is zero" doubt; it does NOT construct the directed-rounding [RD, RU] enclosure a ' +
    'machine certificate needs (imp-34908 scoped the correctly-rounded log/quotient primitives), so the ' +
    'imp-34714a machine certificate REMAINS OPEN as re-pointed sub-gap imp-35258a. MEASUREMENT ONLY on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) ' +
    'and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent ' +
    'stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34714 (Krawczyk existence-uniqueness lemma for the RvM height inverse; sub-gap imp-34714a); imp-35241 ' +
    '(admissible seed band [N_bot, N_top]; F(m) = 0 flagged double artifact); imp-34799 (a-priori nonzero-' +
    'interval width bound for a directed-rounding F(m)); imp-34908 (correctly-rounded primitives a certificate ' +
    'needs); imp-35109/imp-35174 (the dd toolkit reproduced here); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT_ASSERTIONS = [
  {
    // The dd toolkit is genuinely beyond double (identical self-test to imp-35109/35174).
    id: 'imp35258-dd-beyond-double',
    description: 'dd carries a ~1e-20 sub-ulp bit that plain double drops (1+1e-20===1), i.e. dd is real',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // The artifact is reproduced: the DOUBLE residual F(m) = 0 at every band seed.
    id: 'imp35258-f-double-zero-artifact',
    description: 'the double certificate residual F_double(m) = 0 at every admissible-band seed (the artifact)',
    holds: () => ALL_F_DOUBLE_ZERO === true,
  },
  {
    // The genuine dd residual is NONZERO at every band seed, at the ~1 ulp(m) scale.
    id: 'imp35258-f-dd-genuinely-nonzero',
    description: 'the dd residual F_dd(m) is nonzero at every band seed, of order ~1e-7 ~ one ulp(m ~ 1.1e9)',
    holds: () =>
      ALL_F_DD_NONZERO === true &&
      RESIDUAL_AT_ULP_SCALE === true &&
      MAX_ABS_FDD < 1e-6 &&
      MIN_ABS_FDD > 1e-9,
  },
  {
    // Sharper than below-floor: at least one band seed has |F_dd| ABOVE the half-ulp floor.
    id: 'imp35258-band-bottom-above-floor',
    description: 'at the band-bottom |F_dd| exceeds the 0.5 ulp(m) floor: a cancellation artifact, not below-floor',
    holds: () => ANY_ABOVE_FLOOR === true && F_M_IS_ARTIFACT === true,
  },
  {
    // Honesty gate: measurement of a surrogate residual, not rigorous, no QED, imp-34714a OPEN, no refereed bound is changed.
    id: 'imp35258-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, imp-34714a REMAINS OPEN, no refereed bound is changed',
    holds: () =>
      IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT.isRigorous === false &&
      /NO QED/.test(IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT.verdict) &&
      /imp-34714a machine certificate REMAINS OPEN/.test(IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT.verdict) &&
      /imp-35258a/.test(IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT.residual_sub_gap_imp_35258a),
  },
];

for (const a of IMP35258_KRAWCZYK_RESIDUAL_DOUBLE_DOUBLE_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35258-krawczyk-residual-double-double-measurement assertion failed: ${a.id}`);
  }
}
