/**
 * @module imp-35376-krawczyk-surplus-leading-order-band
 *
 * imp-35266 decomposed the imp-35241 band-top Krawczyk contraction-validity headroom surplus
 * S - S_inf (above the closed-form floor S_inf = 1/(2 delta) = 2500) into a +110.34 FP_LO finite-N
 * push (dFP) against a -55.16 asymptotic-floor G-factor pull (dG), and reported (D3) that the NET
 * surplus tracks the leading-order estimate S_inf . a/2 = 2500 . 0.043176/2 ~ 53.97 at the BAND-TOP,
 * within ~2% of the exact 55.18 (the a(N(1-delta)) > a(N) shift lifting the last ~1.2). But imp-35266
 * checked that leading-order approximation at ONE landmark only (the band-top). This module supplies
 * the missing check: it MEASURES S_inf . a/2 against the exact surplus at ALL THREE imp-34693 band
 * landmarks (band-bottom, N_cross AND band-top) and tabulates the ~2% leading-order gap and its
 * N-dependence across the band.
 *
 * WHAT THE MEASUREMENT FINDS (leading-order S_inf . a/2 vs exact surplus at the three landmarks)
 * --------------------------------------------------------------------------------------------
 *   (L1) THE LEADING-ORDER ESTIMATE UNDERSHOOTS THE EXACT SURPLUS AT EVERY LANDMARK, by a nearly
 *        constant ~2% relative gap. band-bottom: lead 59.898 vs exact 61.394 (rel err 2.44%);
 *        N_cross: lead 56.779 vs exact 58.123 (rel err 2.31%); band-top: lead 53.970 vs exact 55.184
 *        (rel err 2.20%). So the imp-35266 band-top ~2% figure is REPRESENTATIVE of the whole band,
 *        NOT a band-top coincidence: S_inf . a/2 is a good ~2%-accurate proxy for the surplus throughout.
 *   (L2) THE ~2% GAP SHRINKS MONOTONICALLY AS N RISES ACROSS THE BAND. The relative gap runs
 *        2.44% (band-bottom) -> 2.31% (N_cross) -> 2.20% (band-top), decreasing with N; the ABSOLUTE
 *        gap (exact - lead) likewise falls 1.496 -> 1.344 -> 1.214. Both track the local contraction
 *        factor a, which itself decreases across the band (a: 0.04792 -> 0.04542 -> 0.04318). The
 *        higher-order remainder the leading term drops is therefore an increasing function of a,
 *        vanishing in the a -> 0 (large-N) limit -- consistent with S_inf . a/2 being the a -> 0
 *        leading term.
 *   (L3) THE UNDERSHOOT IS THE a(N(1-delta)) > a(N) SHIFT imp-35266 NAMED, GENERALISED. The exact
 *        surplus uses FP_LO = 1 - a(N(1-delta)) with aLo > a, which inflates the FP_LO finite-N push
 *        above the S_inf . a leading value; halved against the G-factor deficit it leaves the surplus
 *        ABOVE S_inf . a/2 by the measured ~1.2-1.5 at each landmark (the ~1.2 imp-35266 saw at the
 *        band-top is the SMALLEST of the three, since a is smallest there).
 *
 * CONSEQUENCE: imp-35266 D3 (net surplus ~ S_inf . a/2 within ~2%) holds at ALL THREE band landmarks,
 * not just the band-top -- the leading-order approximation is a uniformly ~2%-accurate, always-slightly-low
 * proxy across the admissible seed band, with the gap governed by (and monotone in) the local contraction
 * factor a. This changes NO decomposition value from imp-35266; it only extends the D3 leading-order check
 * from one landmark to three.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35241/imp-34996
 * machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine certificate REMAINS
 * OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading-order S_inf.a/2, checked only at band-top)
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see imp-35374-krawczyk-headroom-ratio-correction (the O(a) correction lifting -dFP/dG off exactly 2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35266).
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
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const HALF_WIDTH = rho(1, WIDEST_BAND_K); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_BOTTOM = N_CROSS - HALF_WIDTH; // smallest admissible N (imp-34693 seed band-bottom)
const BAND_TOP = N_CROSS + HALF_WIDTH; // largest admissible N (imp-34693 seed band-top)

// Exact surplus S - S_inf and its leading-order estimate S_inf . a(N)/2 at a landmark N.
function leadingOrderAt(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const FP_LO = 1 - aLo;
  const S = G / ((1 + G) * DELTA * FP_LO);
  const surplus = S - S_INF; // exact additive surplus above the 2500 floor (imp-35266 dG + dFP)
  const lead = (S_INF * a) / 2; // imp-35266 D3 leading-order estimate
  const absGap = surplus - lead; // exact minus leading order (positive => leading order undershoots)
  const relErr = Math.abs(absGap) / surplus; // ~2% leading-order relative gap
  return { N, a, surplus, lead, absGap, relErr };
}

const BOTTOM = leadingOrderAt(BAND_BOTTOM);
const CROSS = leadingOrderAt(N_CROSS);
const TOP = leadingOrderAt(BAND_TOP);

// (L1) the leading-order estimate undershoots (is below) the exact surplus at every landmark.
const UNDERSHOOTS_ALL = BOTTOM.absGap > 0 && CROSS.absGap > 0 && TOP.absGap > 0;
// (L1) the relative gap is ~2% at all three landmarks (imp-35266 band-top figure is representative).
const TWO_PCT_ALL = BOTTOM.relErr < 0.03 && CROSS.relErr < 0.03 && TOP.relErr < 0.03;
// (L2) the relative gap shrinks monotonically as N rises across the band.
const REL_GAP_MONO_DECREASING = BOTTOM.relErr > CROSS.relErr && CROSS.relErr > TOP.relErr;
// (L2) the absolute gap likewise shrinks monotonically as N rises.
const ABS_GAP_MONO_DECREASING = BOTTOM.absGap > CROSS.absGap && CROSS.absGap > TOP.absGap;
// The band-top gap imp-35266 quoted (~1.2) is the smallest of the three.
const TOP_GAP_SMALLEST = TOP.absGap < CROSS.absGap && TOP.absGap < BOTTOM.absGap;

export const IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND = {
  id: 'imp-35376',
  proofSection: 'S-frontier',
  question:
    'imp-35266 reported (D3) that the band-top Krawczyk headroom surplus S - S_inf tracks the leading-order ' +
    'estimate S_inf . a/2 = 2500 . 0.043176/2 ~ 53.97, within ~2% of the exact 55.18, but checked that ' +
    'approximation at the band-top landmark only. Verify the leading-order S_inf . a/2 approximation against ' +
    'the EXACT surplus at the band-bottom and N_cross landmarks too, and tabulate the ~2% leading-order gap ' +
    'and its N-dependence across all three imp-34693 band landmarks. Measurement only; surrogate; imp-34714a ' +
    'stays OPEN; changes no bound; NO QED.',
  finding:
    'Measuring S_inf . a/2 against the exact surplus S - S_inf at all three imp-34693 band landmarks: the ' +
    'leading-order estimate UNDERSHOOTS the exact surplus at every landmark by a nearly constant ~2% relative ' +
    'gap -- band-bottom lead 59.898 vs exact 61.394 (2.44%), N_cross lead 56.779 vs exact 58.123 (2.31%), ' +
    'band-top lead 53.970 vs exact 55.184 (2.20%). So the imp-35266 band-top ~2% figure is REPRESENTATIVE of ' +
    'the whole band, not a band-top coincidence. The gap SHRINKS MONOTONICALLY as N rises: the relative gap ' +
    'runs 2.44% -> 2.31% -> 2.20% and the absolute gap 1.496 -> 1.344 -> 1.214, both tracking the local ' +
    'contraction factor a (0.04792 -> 0.04542 -> 0.04318), so the higher-order remainder the leading term ' +
    'drops is an increasing function of a vanishing in the large-N (a -> 0) limit. The undershoot is the ' +
    'a(N(1-delta)) > a(N) shift imp-35266 named at the band-top, generalised: the ~1.2 it quoted there is the ' +
    'SMALLEST of the three landmark gaps. imp-35266 D3 holds at ALL THREE landmarks, not just the band-top. ' +
    'EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    a_band_bottom: +BOTTOM.a.toPrecision(10),
    a_N_cross: +CROSS.a.toPrecision(10),
    a_band_top: +TOP.a.toPrecision(10),
  },
  measurement: {
    // Exact surplus, leading-order estimate S_inf.a/2, absolute gap and ~2% relative gap at each landmark.
    surplus_band_bottom: +BOTTOM.surplus.toFixed(4), // ~61.3937
    lead_band_bottom: +BOTTOM.lead.toFixed(4), // ~59.8977
    abs_gap_band_bottom: +BOTTOM.absGap.toFixed(4), // ~+1.4960
    rel_err_band_bottom: +BOTTOM.relErr.toPrecision(4), // ~0.02437
    surplus_N_cross: +CROSS.surplus.toFixed(4), // ~58.1230
    lead_N_cross: +CROSS.lead.toFixed(4), // ~56.7792
    abs_gap_N_cross: +CROSS.absGap.toFixed(4), // ~+1.3438
    rel_err_N_cross: +CROSS.relErr.toPrecision(4), // ~0.02312
    surplus_band_top: +TOP.surplus.toFixed(4), // ~55.1835
    lead_band_top: +TOP.lead.toFixed(4), // ~53.9697
    abs_gap_band_top: +TOP.absGap.toFixed(4), // ~+1.2138
    rel_err_band_top: +TOP.relErr.toPrecision(4), // ~0.02200
    leading_order_undershoots_all_landmarks: UNDERSHOOTS_ALL, // true (exact > lead everywhere)
    rel_gap_two_pct_all_landmarks: TWO_PCT_ALL, // true (all < 3%)
    rel_gap_monotone_decreasing_with_N: REL_GAP_MONO_DECREASING, // true (2.44 -> 2.31 -> 2.20 %)
    abs_gap_monotone_decreasing_with_N: ABS_GAP_MONO_DECREASING, // true (1.496 -> 1.344 -> 1.214)
    band_top_gap_is_smallest: TOP_GAP_SMALLEST, // true (the imp-35266 ~1.2 is the smallest landmark gap)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Extending the imp-35266 D3 leading-order S_inf . a/2 check from the band-top to ' +
    'all three landmarks does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: ' +
    'it rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, ' +
    'and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM SURPLUS LEADING-ORDER APPROXIMATION, VERIFIED ACROSS ALL THREE BAND LANDMARKS (frontier, ' +
    'NOT an RH bound). The ticket asked to check the imp-35266 D3 leading-order estimate S_inf . a/2 against the ' +
    'exact surplus S - S_inf at the band-bottom and N_cross landmarks, not just the band-top. RESULT: the ' +
    'leading-order estimate UNDERSHOOTS the exact surplus at every landmark by a nearly constant ~2% relative ' +
    'gap (band-bottom 59.898 vs 61.394 = 2.44%; N_cross 56.779 vs 58.123 = 2.31%; band-top 53.970 vs 55.184 = ' +
    '2.20%), so the imp-35266 band-top ~2% figure is representative of the whole band. The gap SHRINKS ' +
    'MONOTONICALLY with N (relative 2.44 -> 2.31 -> 2.20 %, absolute 1.496 -> 1.344 -> 1.214), tracking the ' +
    'local contraction factor a which itself falls across the band, so the dropped higher-order remainder ' +
    'vanishes in the large-N limit; the ~1.2 band-top undershoot imp-35266 quoted is the SMALLEST landmark gap. ' +
    'imp-35266 D3 therefore holds at ALL THREE landmarks. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; reproduces the imp-35266/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the ' +
    'C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (D3 leading-order S_inf . a/2 checked only at the band-top); imp-35241 (band-top S ~ 2555.18, ' +
    'surplus ~55.18 above the 2500 floor); imp-34996 (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1 large-N); ' +
    'imp-34693 (admissible seed band + band-bottom/band-top); imp-35374 (the O(a) correction lifting -dFP/dG off ' +
    'exactly 2); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail ' +
    'exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Evaluating a leading term at ' +
    'three grid points and differencing against the exact rational form: standard.',
};

export const IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND_ASSERTIONS = [
  {
    // (L1) the leading-order estimate undershoots the exact surplus at all three landmarks by a ~2% gap.
    id: 'imp35376-undershoots-all-landmarks-two-pct',
    description: 'S_inf . a/2 is below the exact surplus at band-bottom, N_cross and band-top, each within ~2%',
    holds: () =>
      UNDERSHOOTS_ALL === true &&
      TWO_PCT_ALL === true &&
      Math.abs(BOTTOM.relErr - 0.02437) < 0.0005 &&
      Math.abs(CROSS.relErr - 0.02312) < 0.0005 &&
      Math.abs(TOP.relErr - 0.022) < 0.0005,
  },
  {
    // (L1) the leading-order and exact surplus values reproduce the imp-35266 band-top numbers.
    id: 'imp35376-reproduces-imp35266-band-top',
    description: 'band-top lead ~53.97 and exact surplus ~55.18 reproduce the imp-35266 D3 figures',
    holds: () =>
      Math.abs(TOP.lead - 53.97) < 0.05 &&
      Math.abs(TOP.surplus - 55.18) < 0.05 &&
      Math.abs(TOP.absGap - 1.2138) < 0.02,
  },
  {
    // (L2) both the relative and absolute leading-order gaps shrink monotonically as N rises.
    id: 'imp35376-gap-monotone-decreasing-with-N',
    description: 'relative gap 2.44 -> 2.31 -> 2.20 % and absolute gap 1.496 -> 1.344 -> 1.214 decrease with N',
    holds: () =>
      REL_GAP_MONO_DECREASING === true &&
      ABS_GAP_MONO_DECREASING === true &&
      TOP_GAP_SMALLEST === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35376-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND.isRigorous === false &&
      /imp-34714a/.test(IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND.subGap) &&
      /REMAINS OPEN/.test(IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND.subGap) &&
      /NO QED/.test(IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND.verdict),
  },
];

for (const a of IMP35376_KRAWCZYK_SURPLUS_LEADING_ORDER_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35376-krawczyk-surplus-leading-order-band assertion failed: ${a.id}`);
  }
}
