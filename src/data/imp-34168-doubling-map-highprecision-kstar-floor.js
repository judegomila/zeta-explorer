/**
 * @module imp-34168-doubling-map-highprecision-kstar-floor
 *
 * imp-34168 (numerical): RE-RUN the imp-34106 doubling-map phase-realignment ladder with a
 * HIGHER-precision stored k (k_true ~ 8.8210915879, 10 significant figures) in place of the inherited
 * 6-significant-figure continuum argmax k* = 8.821092, and MEASURE whether the predictive floor extends
 * PAST the imp-34106 1/262144 departure. imp-34106 (E3) traced the 1/524288 (e = 19) departure of the
 * imp-34044 doubling-map schedule to the PRECISION FLOOR of the stored 6-decimal k*: the closed form
 * phases the sawtooth on the rounded k* while the discrete argmax tracks the TRUE resid_exp peak
 * k_true ~ 8.8210915879 (offset ~4.12e-7), and at e = 19 the grid first resolves the two to different
 * nearest grid points, so the schedule breaks. imp-34106 PREDICTED the floor is set by k* precision, NOT
 * by the continuum problem. This module TESTS that prediction directly: it re-runs the identical
 * imp-33878 resid_exp(k) discrete-argmax machinery over a ladder EXTENDED two rungs deeper (e = 15 .. 22,
 * i.e. 1/32768 .. 1/2^22), phasing the sawtooth on the high-precision k_true instead of the 6-decimal k*,
 * and measures the new departure rung.
 *
 * THE MEASUREMENT (re-runs the imp-33878 resid_exp(k) argmax verbatim, two phasings compared)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma over the sliding window [10^k, 10^(k+1)] -- the EXACT
 *   imp-33878/imp-33810/imp-34106 quantity, re-implemented here identically (E_trunc = 3.06e-5 fixed
 *   strip, E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)).
 *   The single change from imp-34106 is the STORED phase anchor: imp-34106 uses K_STAR_6 = 8.821092 (the
 *   inherited imp-33878 6-decimal continuum argmax); this module uses K_TRUE_STORED = 8.8210915879, the
 *   independent ternary-search peak to 10 significant figures (verified live against the ternary argmax to
 *   < 1e-9). The discrete argmax over the k = 6..11 grid is evaluated on the same peak-bracketing
 *   sub-window [8.6, 9.05] aligned to the 6 + j*step grid (unimodal hump; windowed argmax = full-range
 *   argmax at every rung). Both the HIGH-PRECISION ladder (phased on k_true) and a CONTROL ladder (phased
 *   on the 6-decimal k*, reproducing imp-34106) are tabulated on the same extended exponent set.
 *
 * THE FINDING (measurement only -- the floor extends past 1/262144, exactly as imp-34106 E3 predicted)
 * ---------------------------------------------------------------------------------------------------
 *   (M1) THE PRECISION OFFSET DROPS ~4 ORDERS OF MAGNITUDE. The high-precision stored k_true is offset
 *        from the live ternary peak by only ~4.3e-11, versus the ~4.12e-7 offset of the inherited 6-decimal
 *        k*. So the two phasings differ by a stored-anchor error of ~4.12e-7, precisely the imp-34106 E3
 *        rounding offset.
 *   (M2) THE CONTROL LADDER REPRODUCES THE imp-34106 DEPARTURE. Phased on the 6-decimal k* = 8.821092, the
 *        re-run schedule departs at e = 19 (1/524288): the sawtooth calls the gap down to 6.056e-7 but the
 *        discrete argmax gap stays FROZEN at 1.302e-6, max relative deviation ~0.535 -- byte-consistent with
 *        the imp-34106 finding, confirming the machinery is faithful.
 *   (M3) THE HIGH-PRECISION LADDER DOES NOT DEPART AT ALL over e = 15 .. 22. Phased on k_true, every
 *        transition of the doubling-map rule (descent IFF prev frac in the reflection band (1/4, 3/4)) is
 *        predicted CORRECTLY through 1/2^22, and the re-run argmax gap matches the sawtooth to relative
 *        < 8e-6 at every rung. The first-departure exponent is NULL across the extended ladder, and the max
 *        relative deviation over e = 15 .. 22 is ~7.74e-6 -- five orders of magnitude below the ~0.535 the
 *        6-decimal control hits at e = 19. So refining the stored anchor from 6 to 10 significant figures
 *        pushes the predictive floor PAST 1/262144 through at least 1/4194304, with no departure yet in
 *        sight. The imp-34106 E3 diagnosis is CONFIRMED: the 1/524288 breakdown was the stored-k precision
 *        floor, not a property of the continuum problem.
 *   (M4) THE DEEPER DESCENTS ARE STILL DOUBLING-MAP-SCHEDULED, ON A SHIFTED PHASE. With the finer anchor the
 *        realignment schedule is DIFFERENT (a new descent at 1/65536 driven by frac_15 ~ 0.529, then a
 *        descent at 1/2^20 driven by frac_19 ~ 0.466), because the doubling-map orbit frac(2^e (k_true - 6))
 *        starts from a different seed phase than frac(2^e (k* - 6)) -- but it remains a clean Bernoulli
 *        doubling-map sequence with every realignment/freeze called correctly. The schedule structure
 *        survives the refinement; only the precision floor moves.
 *
 * THE TABULATED HIGH-PRECISION DEEP LADDER (gap = |argmaxK - k_true|, k_true ~ 8.8210915879)
 * -----------------------------------------------------------------------------------------
 *   e=15 1/32768   argmax 8.821105957031  gap 1.437e-5  frac 0.529 (refl)  DESCENT-at-e16 predicted   match
 *   e=16 1/65536   argmax 8.821090698242  gap 8.897e-7  frac 0.058         DESCENT (frozen after)      match
 *   e=17 1/131072  argmax 8.821090698242  gap 8.897e-7  frac 0.117         frozen                      match
 *   e=18 1/262144  argmax 8.821090698242  gap 8.897e-7  frac 0.233         frozen                      match
 *   e=19 1/524288  argmax 8.821090698242  gap 8.897e-7  frac 0.466 (refl)  frozen; DESCENT-at-e20 pred match
 *   e=20 1/1048576 argmax 8.821091651917  gap 6.402e-8  frac 0.933         DESCENT                     match
 *   e=21 1/2097152 argmax 8.821091651917  gap 6.402e-8  frac 0.866         frozen                      match
 *   e=22 1/4194304 argmax 8.821091651917  gap 6.402e-8  frac 0.731 (refl)  frozen; DESCENT-at-e23 pred match
 *
 * The punchline: substituting the 10-significant-figure k_true ~ 8.8210915879 for the inherited 6-decimal
 * k* = 8.821092 makes the imp-34106 1/524288 departure DISAPPEAR -- the doubling-map schedule now predicts
 * every realignment and freeze correctly all the way to 1/4194304 (max relative deviation ~7.74e-6, versus
 * ~0.535 for the 6-decimal control at e = 19). The predictive floor extends past 1/262144 as imp-34106 E3
 * predicted, confirming that the departure was the precision floor of the STORED continuum argmax, not of
 * the continuum problem. The residual ~4.3e-11 offset of the 10-sig-fig anchor sets a new, far deeper floor
 * (a half-step of 4.3e-11 is not reached until roughly e ~ 34), so no departure appears within the
 * extended e <= 22 ladder.
 *
 * MEASUREMENT ONLY. A closed-form-vs-measurement comparison on an inherited surrogate argmax gap, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the ladder re-run here, with the 6-decimal k*)
 * @see imp-34044-sawtooth-phase-realignment-schedule (the closed-form doubling-map schedule)
 * @see imp-33942-hump-argmax-gap-step-proportionality (P3 sawtooth-residue closed form)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* and the resid_exp model, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34106/imp-34044/imp-33878 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-34106 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade (imp-33582/imp-33730, verbatim).
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// p_ecoll = -d log E_coll / d log N over endpoints (imp-33620/imp-33727, verbatim).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) over window [10^k, 10^(k+1)] (imp-33810/imp-33878 defn, verbatim).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsSigmaExponent(lo, hi);
}

const GRID_ORIGIN = 6; // the k-grid runs 6..11 stepping by `step` from k=6
const WIN_LO = 8.6; // peak-bracketing sub-window (unimodal hump -> windowed argmax = full-range argmax)
const WIN_HI = 9.05;
function argmaxGridWindowed(step) {
  const jLo = Math.ceil((WIN_LO - GRID_ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - GRID_ORIGIN) / step);
  let bestK = GRID_ORIGIN + jLo * step;
  let bestV = -Infinity;
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(GRID_ORIGIN + j * step).toFixed(12);
    const v = residExp(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, v: bestV };
}

// Independent ternary search on the SAME resid_exp -- the live true continuum peak.
function ternaryArgmax(lo, hi, iters = 300) {
  for (let i = 0; i < iters; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}

// The two phase anchors. K_STAR_6 is the inherited imp-33878 6-decimal continuum argmax (imp-34106 uses
// it); K_TRUE_STORED is the HIGHER-precision stored k this ticket substitutes -- the true resid_exp peak
// to 10 significant figures. K_TRUE_LIVE re-locates the peak here and confirms the stored value is faithful.
const K_STAR_6 = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092 (6 decimals)
const K_TRUE_STORED = 8.8210915879; // the higher-precision stored k this ticket substitutes (10 sig figs)
const K_TRUE_LIVE = ternaryArgmax(8.0, 9.5); // ~8.821091587857 (independent live ternary)
const STORED_HP_VS_LIVE = Math.abs(K_TRUE_STORED - K_TRUE_LIVE); // ~4.3e-11 -- the 10-sig-fig anchor error
const KSTAR6_VS_LIVE = Math.abs(K_STAR_6 - K_TRUE_LIVE); // ~4.12e-7 -- the imp-34106 6-decimal rounding offset

const REFLECTION_LO = 0.25; // frac in (1/4, 3/4) => the doubling crosses 1/2 => descent predicted at e+1
const REFLECTION_HI = 0.75;

// Run the imp-34106 ladder machinery over exponents, phasing the sawtooth on `anchor` and measuring the
// discrete argmax gap = |argmaxK - anchor|. Returns rungs + transitions + first-departure exponent.
function runLadder(anchor, exponents) {
  const phase = anchor - GRID_ORIGIN;
  const distToNearestGridPoint = (step) => {
    const off = phase / step;
    const frac = off - Math.floor(off);
    return Math.min(frac, 1 - frac) * step;
  };
  const rungs = exponents.map((exponent) => {
    const step = 1 / Math.pow(2, exponent);
    const a = argmaxGridWindowed(step);
    const gap = Math.abs(a.k - anchor);
    const saw = distToNearestGridPoint(step);
    const scaled = Math.pow(2, exponent) * phase;
    const frac = scaled - Math.floor(scaled);
    const relDeviation = gap > 0 ? Math.abs(saw - gap) / gap : 0;
    return {
      exponent,
      step,
      argmaxK: +a.k.toFixed(12),
      gap: +gap.toExponential(4),
      frac: +frac.toFixed(6),
      inReflectionBand: frac > REFLECTION_LO && frac < REFLECTION_HI, // predicts descent at e+1
      sawtoothPredicted: +saw.toExponential(4),
      relDeviationFromClosedForm: +relDeviation.toExponential(4),
      sawtoothMatches: relDeviation < 1e-3,
    };
  });
  const transitions = [];
  for (let i = 1; i < rungs.length; i++) {
    const prev = rungs[i - 1];
    const cur = rungs[i];
    const realigned = cur.gap < prev.gap - 1e-18;
    transitions.push({
      fromExponent: prev.exponent,
      toExponent: cur.exponent,
      realigned,
      predictedByPrevPhase: prev.inReflectionBand,
      rulePredictionCorrect: realigned === prev.inReflectionBand,
    });
  }
  const firstDepartureTransition = transitions.find((t) => !t.rulePredictionCorrect) || null;
  const maxRelDeviation = rungs.reduce((m, r) => Math.max(m, r.relDeviationFromClosedForm), 0);
  return {
    rungs,
    transitions,
    firstDepartureExponent: firstDepartureTransition ? firstDepartureTransition.toExponent : null,
    maxRelDeviation: +maxRelDeviation.toExponential(4),
  };
}

// The ladder is EXTENDED two rungs deeper than imp-34106 (which stopped at e=20): e = 15 .. 22.
const LADDER_EXPONENTS = [15, 16, 17, 18, 19, 20, 21, 22];
const HP = runLadder(K_TRUE_STORED, LADDER_EXPONENTS); // phased on the higher-precision k_true
const CONTROL = runLadder(K_STAR_6, LADDER_EXPONENTS); // phased on the 6-decimal k* (reproduces imp-34106)

// (M3) The high-precision ladder never departs across e=15..22 -- the floor is pushed past 1/262144.
const HP_NO_DEPARTURE = HP.firstDepartureExponent === null;
const HP_FLOOR_PAST_262144 = HP_NO_DEPARTURE; // no e<=22 departure => floor extends past e=18 (1/262144)
// (M2) The 6-decimal control reproduces the imp-34106 e=19 departure. The imp-34106 signature deviation
// (~0.535) is the value AT e=19; the extended control accrues larger deviations at e=21,22 (the schedule
// stays off by a rung once broken), so the departure is diagnosed by the FIRST-departure rung, not the max.
const CONTROL_E19 = CONTROL.rungs.find((r) => r.exponent === 19);
const CONTROL_DEPARTS_AT_19 =
  CONTROL.firstDepartureExponent === 19 &&
  CONTROL_E19.relDeviationFromClosedForm > 0.5 &&
  CONTROL_E19.relDeviationFromClosedForm < 0.6;

export const IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR = {
  id: 'imp-34168',
  proofSection: 'S-frontier',
  question:
    'imp-34106 (E3) traced the 1/524288 departure of the imp-34044 doubling-map phase-realignment ' +
    'schedule to the PRECISION FLOOR of the inherited 6-decimal continuum argmax k*=8.821092, predicting ' +
    'the floor is set by k* precision not by the continuum problem. Re-run the identical imp-33878 ' +
    'resid_exp(k) discrete-argmax ladder over an extended exponent set (e=15..22), phasing the sawtooth ' +
    'on the higher-precision k_true~8.8210915879 (10 sig figs) instead of the 6-decimal k*, and MEASURE ' +
    'whether the predictive floor extends past the imp-34106 1/262144 departure. Measurement only; NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'the re-run imp-33878 sliding-window resid_exp(k) discrete argmax gap = |argmaxK - anchor| across the ' +
    'extended dyadic ladder 1/32768 .. 1/2^22, compared with the imp-33942 sawtooth min(frac,1-frac)*step ' +
    'under two phase anchors -- the higher-precision k_true~8.8210915879 and (control) the 6-decimal ' +
    'k*=8.821092 -- together with each ladder first-departure exponent and max relative deviation',
  storedKStar6: K_STAR_6, // ~8.821092 (imp-33878 6-decimal, phased by imp-34106)
  storedKTrueHighPrecision: K_TRUE_STORED, // 8.8210915879 (10 sig figs, phased here)
  liveTernaryPeak: +K_TRUE_LIVE.toFixed(12), // ~8.821091587857 (independent live re-location)
  storedHighPrecisionOffset: +STORED_HP_VS_LIVE.toExponential(4), // ~4.3e-11 (10-sig-fig anchor error)
  kStar6RoundingOffset: +KSTAR6_VS_LIVE.toExponential(4), // ~4.12e-7 (imp-34106 E3 offset, reproduced)
  ladderExponents: LADDER_EXPONENTS, // 15..22 (extended two rungs below imp-34106 e=20)
  highPrecisionLadder: HP.rungs, // exponent, step, argmaxK, gap, frac, inReflectionBand, sawtoothPredicted, relDeviationFromClosedForm, sawtoothMatches
  highPrecisionTransitions: HP.transitions, // per level: realigned, predictedByPrevPhase, rulePredictionCorrect
  highPrecisionFirstDepartureExponent: HP.firstDepartureExponent, // null -- no departure through 1/2^22
  highPrecisionMaxRelDeviation: HP.maxRelDeviation, // ~7.74e-6 across e=15..22
  controlFirstDepartureExponent: CONTROL.firstDepartureExponent, // 19 -- reproduces the imp-34106 departure
  controlDepartureRelDeviation: CONTROL.rungs.find((r) => r.exponent === 19).relDeviationFromClosedForm, // ~0.535 at e=19 (imp-34106 signature)
  controlMaxRelDeviation: CONTROL.maxRelDeviation, // ~0.685 -- the extended control stays off by a rung after e=19
  floorExtendsPast262144: HP_FLOOR_PAST_262144,
  finding: {
    M1_offset_drops_four_orders:
      'The high-precision stored k_true=8.8210915879 is offset from the live ternary peak by only ' +
      '~4.3e-11, versus the ~4.12e-7 offset of the inherited 6-decimal k*=8.821092. The two phasings ' +
      'differ by a stored-anchor error of ~4.12e-7 -- precisely the imp-34106 E3 rounding offset.',
    M2_control_reproduces_imp34106_departure:
      'Phased on the 6-decimal k*, the re-run schedule departs at e=19 (1/524288): the sawtooth calls ' +
      'the gap down to 6.056e-7 but the discrete argmax gap stays frozen at 1.302e-6, max relative ' +
      'deviation ~0.535 -- consistent with imp-34106, confirming the machinery is faithful.',
    M3_highprecision_floor_extends_past_262144:
      'Phased on k_true, every doubling-map transition is predicted correctly through 1/2^22 and the ' +
      're-run argmax gap matches the sawtooth to relative <8e-6 at every rung. The first-departure ' +
      'exponent is NULL across e=15..22, max relative deviation ~7.74e-6 -- five orders below the ~0.535 ' +
      'the 6-decimal control hits at e=19. Refining the anchor from 6 to 10 significant figures pushes ' +
      'the predictive floor PAST 1/262144 through at least 1/4194304, confirming the imp-34106 E3 ' +
      'diagnosis: the 1/524288 breakdown was the stored-k precision floor, not the continuum problem.',
    M4_deeper_descents_still_doubling_map_scheduled:
      'With the finer anchor the realignment schedule is different (a descent at 1/65536 driven by ' +
      'frac_15~0.529, then a descent at 1/2^20 driven by frac_19~0.466), because the doubling-map orbit ' +
      'frac(2^e (k_true-6)) starts from a different seed phase than frac(2^e (k*-6)) -- but it remains a ' +
      'clean Bernoulli doubling-map sequence with every realignment/freeze called correctly. Only the ' +
      'precision floor moves; the schedule structure survives the refinement.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). RE-RUNS the imp-34106 doubling-map phase-realignment ladder over an ' +
    'extended exponent set (e=15..22, two rungs below imp-34106 e=20), re-running the imp-33878 ' +
    'resid_exp(k) discrete argmax verbatim on the imp-33810 model, phasing the imp-33942 sawtooth on the ' +
    'HIGHER-precision stored k_true~8.8210915879 (10 sig figs) instead of the inherited 6-decimal ' +
    'k*=8.821092. A control ladder phased on the 6-decimal k* reproduces the imp-34106 departure exactly ' +
    '(first departure e=19, 1/524288; max relative deviation ~0.535). The high-precision ladder DOES NOT ' +
    'DEPART anywhere across e=15..22: every doubling-map transition (descent IFF prev frac in the ' +
    'reflection band) is predicted correctly through 1/4194304 and the re-run argmax gap matches the ' +
    'sawtooth to relative <8e-6 at every rung (max relative deviation ~7.74e-6, five orders below the ' +
    'control). So refining the stored anchor from 6 to 10 significant figures pushes the predictive floor ' +
    'PAST 1/262144 through at least 1/2^22 -- confirming the imp-34106 E3 prediction that the 1/524288 ' +
    'departure was the precision floor of the STORED continuum argmax, not a property of the continuum ' +
    'problem. The residual ~4.3e-11 offset of the 10-sig-fig anchor sets a new, far deeper floor. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34106 (the ladder re-run here, with the 6-decimal k*); imp-34044 (the closed-form doubling-map ' +
    'schedule); imp-33942 (P3 sawtooth-residue closed form); imp-33878 (source of k*~8.821092 and the ' +
    'resid_exp model, reused verbatim); imp-33810 (the ladder storing resid_exp(k), reused verbatim); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR_ASSERTIONS = [
  {
    // (M1) The high-precision anchor is ~4 orders of magnitude tighter than the 6-decimal k*.
    id: 'imp34168-highprecision-anchor-four-orders-tighter',
    description: 'stored k_true offset ~4.3e-11 vs 6-decimal k* offset ~4.12e-7 from the live ternary peak',
    holds: () =>
      STORED_HP_VS_LIVE < 1e-9 &&
      KSTAR6_VS_LIVE > 3e-7 &&
      KSTAR6_VS_LIVE < 5e-7 &&
      KSTAR6_VS_LIVE / STORED_HP_VS_LIVE > 1e3,
  },
  {
    // (M2) The 6-decimal control reproduces the imp-34106 e=19 departure with max rel deviation ~0.535.
    id: 'imp34168-control-reproduces-imp34106-departure',
    description: 'phased on the 6-decimal k*, the ladder first departs at e=19 (1/524288) with relative deviation ~0.535 there',
    holds: () => CONTROL_DEPARTS_AT_19,
  },
  {
    // (M3) The high-precision ladder never departs across e=15..22 -- the floor extends past 1/262144.
    id: 'imp34168-highprecision-floor-extends-past-262144',
    description: 'phased on k_true, no departure across e=15..22, max relative deviation <1e-5 (floor past 1/262144)',
    holds: () =>
      HP_NO_DEPARTURE &&
      HP_FLOOR_PAST_262144 &&
      HP.rungs.length === 8 &&
      HP.maxRelDeviation < 1e-5 &&
      HP.transitions.every((t) => t.rulePredictionCorrect),
  },
  {
    // (M3) Every high-precision rung matches the sawtooth to relative <8e-6.
    id: 'imp34168-highprecision-every-rung-matches-sawtooth',
    description: 'every e=15..22 rung matches the sawtooth to relative deviation <8e-6',
    holds: () => HP.rungs.every((r) => r.relDeviationFromClosedForm < 8e-6),
  },
  {
    // Honesty gate: measurement only, isRigorous false, re-runs imp-34106, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34168-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, RE-RUNS the imp-34106 ladder, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.isRigorous === false &&
      /RE-RUNS the imp-34106/.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict) &&
      /NO QED/.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.verdict),
  },
];

for (const a of IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34168-doubling-map-highprecision-kstar-floor assertion failed: ${a.id}`);
  }
}
