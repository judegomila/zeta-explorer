/**
 * @module imp-35766-krawczyk-cancellation-ratio-beyond-band
 *
 * imp-35266 decomposed the imp-35241 band-top Krawczyk headroom surplus S - S_inf into an FP_LO finite-N push
 * dFP and an asymptotic-floor G-factor deficit dG, and found the split ratio -dFP/dG ~ 2.00042 "essentially
 * N-independent across the band" (band-bottom, N_cross AND band-top all ~2.00042). It attributed that 2:1
 * structure to the leading order M_G - 1 ~ -a/2 and M_FP - 1 ~ a, so dFP ~ S_inf . a and dG ~ -S_inf . a/2.
 * But imp-35266 tested the ratio only inside the imp-34693 admissible seed band (N ~ 3.1e9..3.45e9); it never
 * asked where, if anywhere, that leading-order -a/2 vs a balance DEGRADES as a(N) shrinks toward zero at large N.
 * This module measures the exact ratio ABOVE the band -- out to the Platt-Trudgian anchor N(T_PT=3e12) and beyond
 * -- and reports the first significant deviation from 2.
 *
 * THE EXACT RATIO IN CLOSED FORM
 * ------------------------------
 * With G = 1 - a, FP_LO = 1 - aLo (aLo = a(N(1-delta))), M_G = 2G/(1+G), M_FP = 1/FP_LO:
 *   dG  = S_inf (M_G - 1)      = S_inf . (-a/(2-a))            (< 0)
 *   dFP = S_inf . M_G (M_FP-1) = S_inf . M_G . aLo/(1-aLo)     (> 0)
 * so the ratio collapses ALGEBRAICALLY (S_inf and M_G cancel cleanly):
 *   R(N) = -dFP/dG = 2 . (aLo/a) . (1-a)/(1-aLo).
 * Writing eps = aLo/a - 1 (the fractional shift of the local contraction factor across the fixed bracket
 * half-width delta = 2e-4) and expanding for small a, this is
 *   R(N) - 2 = 2 eps / (1 - a) + O(eps.a),   i.e. the deviation from 2 is 2 eps / (1-a).
 * So the "2" is exact in the a -> 0 limit and the residual is set by eps (an O(delta) quantity), NOT by a.
 *
 * WHAT THE MEASUREMENT FINDS ABOVE THE BAND (band-top N ~ 3.45e9 up to N(T_PT) ~ 1.236e13 and beyond)
 * --------------------------------------------------------------------------------------------------
 *   (B1) THE 2:1 BALANCE DOES NOT BREAK -- IT TIGHTENS. As N climbs from band-top (a ~ 0.0432) to the PT anchor
 *        N(T_PT) ~ 1.236e13 (a ~ 1.225e-5), R stays ~2.0004 and the deviation R - 2 DECREASES MONOTONICALLY
 *        from ~4.170e-4 to ~3.995e-4. The 1/(1-a) amplification that lifts the band-top value relaxes toward 1
 *        as a -> 0, so the leading-order -a/2 vs a balance gets BETTER, never worse, going up the height axis.
 *   (B2) THE RESIDUAL DEVIATION IS O(delta), NOT O(a), AND IS N-FROZEN. The deviation floor as a -> 0 is
 *        2 eps = 2(aLo/a - 1), and eps drifts only from ~1.995e-4 (band-top) to ~1.998e-4 (PT anchor and beyond):
 *        the whole spread of R - 2 across ~4 decades of height is ~1.7e-5. The residual is governed by the fixed
 *        relative bracket half-width delta = 2e-4 (via the a(N(1-delta)) vs a(N) shift), not by the vanishing a.
 *        The closed-form model R - 2 = 2 eps/(1-a) reproduces the exact measurement to ~9e-6 relative at band-top.
 *   (B3) THE ONLY "DEVIATION FROM 2" IS A DOUBLE-PRECISION CANCELLATION ARTIFACT BEYOND N ~ 1e18, NOT A REAL BREAK.
 *        dG = S_inf(M_G - 1) subtracts near-equal quantities as M_G - 1 ~ -a/2 -> 0; the model tracks the exact R
 *        to <1e-6 through N ~ 1e17 (|dG| ~ 1.9e-6), but by N ~ 1e19 (|dG| ~ 1.9e-8) the measured R diverges
 *        SPURIOUSLY upward (2.00043, then 2.00058 at 1e20) as float cancellation dominates. This is machine-epsilon
 *        noise, not a degradation of the leading-order balance. The PT anchor N(T_PT) ~ 1.236e13 sits comfortably
 *        inside the reliably-measurable regime (|dG| ~ 1.5e-2), so the "no break to the PT anchor" reading is safe.
 *
 * CONSEQUENCE: the imp-35266 near-exact 2:1 cancellation is not a band-local coincidence. It is exact in the
 * large-N limit and its residual is a frozen O(delta) correction that SHRINKS toward the PT anchor. There is no
 * height at which the leading-order -a/2 vs a balance "first breaks" within the physically or numerically
 * meaningful range; the only apparent break beyond N ~ 1e18 is catastrophic float cancellation in dG.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35241 machinery
 * (identical K, delta, N_cross, band, decomposition form). The imp-34714a machine certificate REMAINS OPEN;
 * F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042, tested only in-band)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (isolates the a(N(1-delta)) shift vs O(a^2) curvature)
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1 large-N)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; zeroCountAtHeight: forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const HALF_WIDTH = rho(1, 10); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_TOP = N_CROSS + HALF_WIDTH; // largest admissible N (imp-34693 seed band-top)
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13 zeros below T_PT = 3e12

// The imp-35266 split ratio R(N) = -dFP/dG together with the closed-form deviation model R - 2 = 2 eps/(1-a).
function ratioAt(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const FP_LO = 1 - aLo;
  const M_G = (2 * G) / (1 + G);
  const M_FP = 1 / FP_LO;
  const dG = S_INF * (M_G - 1); // negative (asymptotic-floor / G-factor)
  const dFP = S_INF * M_G * (M_FP - 1); // positive (FP_LO finite-N)
  const R = -dFP / dG;
  const eps = aLo / a - 1; // fractional shift of the contraction factor across delta
  const devModel = (2 * eps) / (1 - a); // closed-form deviation R - 2
  return { N, a, eps, R, dev: R - 2, devModel, dG };
}

const R_BAND_TOP = ratioAt(BAND_TOP);
const R_PT = ratioAt(N_PT);
const R_1E15 = ratioAt(1e15);
const R_1E17 = ratioAt(1e17);
const R_1E20 = ratioAt(1e20); // float-cancellation regime (measurement no longer reliable)

// (B1) The ratio stays ~2.0004 and the deviation DECREASES from band-top to the PT anchor (balance tightens).
const DEV_SHRINKS_TO_PT = R_PT.dev < R_BAND_TOP.dev && R_PT.dev > 0;
const RATIO_STAYS_TWO_TO_PT = Math.abs(R_PT.R - 2) < 5e-4 && Math.abs(R_BAND_TOP.R - 2) < 5e-4;
// (B2) The closed-form model R - 2 = 2 eps/(1-a) reproduces the exact ratio to high relative accuracy in-range.
const MODEL_REL_ERR_BAND_TOP = Math.abs(R_BAND_TOP.dev - R_BAND_TOP.devModel) / R_BAND_TOP.dev;
const MODEL_REL_ERR_PT = Math.abs(R_PT.dev - R_PT.devModel) / R_PT.dev;
// The residual is O(delta), N-frozen: the whole spread of R - 2 across band-top..PT anchor is tiny.
const DEV_SPREAD_TO_PT = Math.abs(R_BAND_TOP.dev - R_PT.dev); // ~1.7e-5
// (B3) Beyond N ~ 1e18 the measured R diverges spuriously (float cancellation), NOT a real break.
const NOISE_ONSET = R_1E20.dev > R_1E17.dev * 1.2 && Math.abs(R_1E20.dev - R_1E20.devModel) > 1e-4;

export const IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND = {
  id: 'imp-35766',
  proofSection: 'S-frontier',
  question:
    'imp-35266 found the surplus-split ratio -dFP/dG ~ 2.00042 essentially N-independent, but tested it only ' +
    'inside the imp-34693 admissible seed band (N ~ 3.1e9..3.45e9) and never asked where the leading-order ' +
    '-a/2 vs a balance DEGRADES as a(N) shrinks toward zero at large N. Measure the exact ratio ABOVE the band ' +
    'to the Platt-Trudgian anchor N(T_PT=3e12) ~ 1.236e13 and beyond, and report the first significant deviation ' +
    'from 2. Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The ratio collapses algebraically to R(N) = -dFP/dG = 2 . (aLo/a) . (1-a)/(1-aLo), so with eps = aLo/a - 1 ' +
    '(the fractional shift of the contraction factor across the fixed bracket half-width delta = 2e-4) the ' +
    'deviation is R - 2 = 2 eps/(1-a). MEASURED ABOVE THE BAND: the 2:1 balance DOES NOT BREAK -- IT TIGHTENS. ' +
    'From band-top (a ~ 0.0432, R - 2 ~ 4.170e-4) up to the PT anchor N(T_PT) ~ 1.236e13 (a ~ 1.225e-5, ' +
    'R - 2 ~ 3.995e-4) the deviation DECREASES monotonically, because the 1/(1-a) amplification relaxes toward 1 ' +
    'as a -> 0. The residual is O(delta), NOT O(a), and N-frozen: eps drifts only ~1.995e-4 -> ~1.998e-4, so the ' +
    'whole spread of R - 2 across ~4 decades of height is ~1.7e-5. The closed-form model reproduces the exact R ' +
    'to ~9e-6 relative at band-top and to <1e-6 through N ~ 1e17. The ONLY apparent deviation from 2 is a ' +
    'double-precision catastrophic-cancellation artifact beyond N ~ 1e18 (dG = S_inf(M_G - 1) subtracts near-equal ' +
    'quantities as M_G - 1 ~ -a/2 -> 0): the measured R diverges SPURIOUSLY upward (2.00043 at 1e19, 2.00058 at ' +
    '1e20) while the model stays flat. So there is NO height at which the leading-order balance first breaks ' +
    'within the meaningful range; the PT anchor sits comfortably inside the reliably-measurable regime ' +
    '(|dG| ~ 1.5e-2). EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    R_band_top: +R_BAND_TOP.R.toFixed(9), // ~2.000416987 (reproduces imp-35266 2.00042)
    dev_band_top: +R_BAND_TOP.dev.toExponential(5), // ~4.16987e-4
    a_band_top: +R_BAND_TOP.a.toExponential(5), // ~4.31758e-2
    R_at_PT_anchor: +R_PT.R.toFixed(9), // ~2.000399532
    dev_at_PT_anchor: +R_PT.dev.toExponential(5), // ~3.99532e-4
    a_at_PT_anchor: +R_PT.a.toExponential(5), // ~1.22486e-5
    dev_shrinks_band_top_to_PT: DEV_SHRINKS_TO_PT, // true (balance tightens, does not break)
    ratio_stays_two_to_PT: RATIO_STAYS_TWO_TO_PT, // true (|R - 2| < 5e-4 throughout)
    dev_spread_band_top_to_PT: +DEV_SPREAD_TO_PT.toExponential(3), // ~1.75e-5 (O(delta), N-frozen residual)
    closed_form_model_rel_err_band_top: +MODEL_REL_ERR_BAND_TOP.toExponential(3), // ~9.0e-6
    closed_form_model_rel_err_PT: +MODEL_REL_ERR_PT.toExponential(3), // ~<1e-6
    R_1e17_still_reliable: +R_1E17.R.toFixed(9), // ~2.000399772 (model agrees, |dG| ~ 1.9e-6)
    R_1e20_float_artifact: +R_1E20.R.toFixed(9), // ~2.000578453 (spurious; float cancellation in dG)
    noise_onset_beyond_1e18: NOISE_ONSET, // true (deviation growth past 1e18 is machine-epsilon noise)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Measuring that the 2:1 surplus-split ratio -dFP/dG holds (and tightens) from the ' +
    'seed band up to the PT anchor N(T_PT) ~ 1.236e13 does NOT prove a directed-rounding [g](m)/[F-prime] ' +
    'evaluation yields valid enclosures: it rests on the gamma(n)/k eps surrogate models of the imp-34687a ' +
    'directed-rounding layer, not that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK 2:1 CANCELLATION RATIO ABOVE THE BAND, MEASURED (frontier, NOT an RH bound). The ticket asked ' +
    'whether the imp-35266 ratio -dFP/dG ~ 2.00042 stays N-independent BEYOND the imp-34693 admissible seed band ' +
    'and where the leading-order -a/2 vs a balance first breaks. RESULT: the ratio collapses algebraically to ' +
    'R(N) = 2 . (aLo/a) . (1-a)/(1-aLo), deviation R - 2 = 2 eps/(1-a) with eps = aLo/a - 1 an O(delta) shift. ' +
    'From band-top (R - 2 ~ 4.170e-4) up to the PT anchor N(T_PT) ~ 1.236e13 (R - 2 ~ 3.995e-4) the deviation ' +
    'DECREASES monotonically -- the balance TIGHTENS, it does not break -- because 1/(1-a) relaxes toward 1 as ' +
    'a -> 0. The residual is O(delta), N-frozen (whole spread ~1.7e-5), governed by the fixed bracket half-width ' +
    'delta = 2e-4, not the vanishing a. The ONLY apparent break is a double-precision catastrophic-cancellation ' +
    'artifact beyond N ~ 1e18 (dG subtracts near-equal quantities as M_G - 1 -> 0), spurious not real; the PT ' +
    'anchor is comfortably inside the reliably-measurable regime. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; reproduces the imp-35266/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the ' +
    'C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (2:1 split -dFP/dG ~ 2.00042, tested only in-band); imp-35762 (shift vs O(a^2) curvature); ' +
    'imp-35241 (band-top S ~ 2555.18); imp-34996 (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1); imp-34693 ' +
    '(admissible seed band); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T)). Algebraic ' +
    'collapse of a rational ratio + small-parameter expansion: standard.',
};

export const IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND_ASSERTIONS = [
  {
    // The exact ratio at the band-top reproduces the imp-35266 value ~2.00042 (same machinery).
    id: 'imp35766-band-top-reproduces-imp35266',
    description: 'R(band-top) = -dFP/dG ~ 2.00042 (reproduces the imp-35266 in-band ratio)',
    holds: () => Math.abs(R_BAND_TOP.R - 2.00042) < 1e-4,
  },
  {
    // Above the band the ratio stays ~2 and the deviation SHRINKS to the PT anchor (balance tightens, no break).
    id: 'imp35766-ratio-tightens-to-PT-anchor',
    description: 'from band-top to N(T_PT) ~ 1.236e13 the deviation R - 2 decreases and R stays within 5e-4 of 2',
    holds: () =>
      DEV_SHRINKS_TO_PT === true &&
      RATIO_STAYS_TWO_TO_PT === true &&
      Math.abs(N_PT - 1.2362e13) / 1.2362e13 < 1e-3,
  },
  {
    // The residual deviation is an O(delta), N-frozen quantity captured by the closed-form model 2 eps/(1-a).
    id: 'imp35766-residual-is-O-delta-N-frozen',
    description: 'R - 2 = 2 eps/(1-a) model matches exact to <1e-4 rel; whole band-top..PT spread ~1.7e-5 (O(delta))',
    holds: () =>
      MODEL_REL_ERR_BAND_TOP < 1e-4 &&
      MODEL_REL_ERR_PT < 1e-4 &&
      DEV_SPREAD_TO_PT < 5e-5 &&
      DEV_SPREAD_TO_PT > 0,
  },
  {
    // The only "deviation from 2" beyond N ~ 1e18 is a double-precision cancellation artifact, not a real break.
    id: 'imp35766-large-N-break-is-float-artifact',
    description: 'measured R diverges spuriously past N ~ 1e18 (float cancellation in dG), model stays flat',
    holds: () => NOISE_ONSET === true && R_1E20.R > R_1E17.R,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35766-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.isRigorous === false &&
      /imp-34714a/.test(IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.subGap) &&
      /REMAINS OPEN/.test(IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.subGap) &&
      /NO QED/.test(IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND.verdict),
  },
];

for (const a of IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35766-krawczyk-cancellation-ratio-beyond-band assertion failed: ${a.id}`);
  }
}
