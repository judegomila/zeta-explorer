/**
 * @module imp-34228-doubling-map-double-precision-anchor-floor
 *
 * imp-34228 (numerical): EXTEND the imp-34168 high-precision doubling-map floor test to a FULL
 * DOUBLE-PRECISION live k_true anchor (beyond the imp-34168 10-significant-figure stored value) and
 * MEASURE whether the predictive floor extends past 1/2^22 -- and where, if anywhere, the double-precision
 * anchor itself finally departs. imp-34168 refined the stored doubling-map anchor from 6 to 10 significant
 * figures (k_true ~ 8.8210915879, offset ~4.3e-11 from the live ternary peak) and showed the imp-34044
 * phase-realignment ladder DOES NOT depart anywhere across e = 15..22 (through 1/2^22), confirming the
 * imp-34106 E3 stored-precision-floor diagnosis. This module takes the NEXT step: it re-runs the identical
 * imp-33878 resid_exp(k) discrete-argmax machinery over a ladder EXTENDED to e = 15..28, phasing the
 * imp-33942 sawtooth on the FULL DOUBLE-PRECISION live ternary peak k_true ~ 8.8210915878573530
 * (offset from the continuum peak at machine level, ~4.3e-11 below the imp-34168 stored 10-sig-fig anchor),
 * and locates the first-departure rung of the double-precision anchor itself.
 *
 * THE EXTENSION (the imp-33878 resid_exp(k) argmax re-run verbatim; only the anchor and depth change)
 * ---------------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma over the sliding window [10^k, 10^(k+1)] -- the EXACT
 *   imp-33878/imp-33810/imp-34106/imp-34168 quantity, re-implemented here identically (E_trunc = 3.06e-5
 *   fixed strip, E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN).
 *   TWO changes from imp-34168: (i) the phase anchor is the FULL DOUBLE-PRECISION live ternary peak
 *   K_TRUE_LIVE (imp-34168 stored a 10-sig-fig literal, offset ~4.3e-11); (ii) the ladder runs two rungs
 *   deeper, e = 15..28 (1/32768 .. 1/2^28). Because resid_exp is a UNIMODAL hump, the imp-34168
 *   full-window [8.6, 9.05] discrete argmax equals a bounded-neighborhood argmax around the peak; this
 *   module uses the neighborhood scan (radius 512 grid points) so the ladder can reach deep e without the
 *   0.45*2^e full-window blowup, and cross-checks it against the imp-34168 full-window argmax at e = 18, 20,
 *   22 (reproduced BIT-FOR-BIT). Both the LIVE double-precision ladder and a CONTROL ladder phased on the
 *   imp-34168 stored 10-sig-fig anchor are tabulated on the same extended exponent set.
 *
 * THE FINDING (measurement only -- the floor extends exactly ONE rung past 1/2^22, then hits a NEW floor)
 * ------------------------------------------------------------------------------------------------------
 *   (M1) THE LIVE ANCHOR IS MACHINE-LEVEL EXACT. The full double-precision live ternary peak
 *        K_TRUE_LIVE ~ 8.8210915878573530 sits ~4.3e-11 below the imp-34168 stored 10-sig-fig literal
 *        k_true = 8.8210915879 and reproduces the continuum peak to relative machine epsilon. So the
 *        stored-anchor error that set the imp-34168 residual ~4.3e-11 floor is now eliminated.
 *   (M2) THE NEIGHBORHOOD SCAN REPRODUCES THE imp-34168 FULL-WINDOW ARGMAX. At e = 18, 20, 22 the bounded
 *        neighborhood argmax equals the imp-34168 full-window [8.6, 9.05] argmax to < 1e-13 -- so the
 *        deep-ladder extension machinery is FAITHFUL to imp-34168, not a new model.
 *   (M3) THE PREDICTIVE FLOOR EXTENDS EXACTLY ONE RUNG PAST 1/2^22, THEN DEPARTS AT 1/2^23. Phased on the
 *        live anchor, every doubling-map transition is called correctly through e = 22 (max relative
 *        deviation ~7.74e-6, matching imp-34168), and the ladder FIRST DEPARTS at e = 23 (1/8388608): the
 *        sawtooth calls the gap down to 5.515e-8 but the discrete argmax gap stays FROZEN at 6.406e-8
 *        (relative deviation ~0.139). So refining the anchor to full double precision buys exactly ONE more
 *        rung of predictive reach beyond the imp-34168 1/2^22 stopping point -- not an unbounded extension.
 *   (M4) THE 1/2^23 DEPARTURE IS A resid_exp RESOLUTION FLOOR, NOT AN ANCHOR-PRECISION FLOOR. The imp-34168
 *        stored 10-sig-fig anchor (offset ~4.3e-11) departs at the IDENTICAL rung e = 23 -- despite
 *        differing from the live anchor by 4.3e-11. Two anchors that disagree by 4.3e-11 cannot share an
 *        anchor-precision floor; they share a resid_exp EVALUATION-NOISE floor. The smallest gap the
 *        discrete argmax ever RESOLVES is ~4.5e-9: below a gap of ~1e-8 the floating-point resid_exp
 *        differences between adjacent near-peak grid points fall below evaluation noise, so the argmax can
 *        no longer track the truly-nearest grid point and the gap plateaus. Beyond e = 23 the ladder
 *        FLICKERS (realigns at e = 24 to gap ~4.5e-9, departs again at e = 25) around this floor. So even a
 *        machine-exact anchor cannot push the doubling-map schedule below the ~1e-8 resid_exp resolution
 *        floor: the imp-34168 stored-anchor floor has been REPLACED, not removed, by the deeper resid_exp
 *        evaluation-noise floor -- a NEW named sub-gap (SUB-GAP-imp-34228-residexp-resolution-floor).
 *
 * THE TABULATED LIVE DOUBLE-PRECISION DEEP LADDER (gap = |argmaxK - k_true|, k_true ~ 8.8210915878573530)
 * -----------------------------------------------------------------------------------------------------
 *   e=20 1/1048576  argmax 8.821091651917  gap 6.406e-8  saw 6.406e-8  relDev 7.74e-6  match
 *   e=21 1/2097152  argmax 8.821091651917  gap 6.406e-8  saw 6.406e-8  relDev 7.74e-6  match
 *   e=22 1/4194304  argmax 8.821091651917  gap 6.406e-8  saw 6.406e-8  relDev 7.74e-6  match   <- imp-34168 floor
 *   e=23 1/8388608  argmax 8.821091651917  gap 6.406e-8  saw 5.515e-8  relDev 1.39e-1  DEPART  <- new floor
 *   e=24 1/16777216 argmax 8.821091592312  gap 4.455e-9  saw 4.455e-9  relDev 3.15e-5  realign (flicker)
 *   e=25 1/33554432 argmax 8.821091622114  gap 3.426e-8  saw 4.455e-9  relDev 8.70e-1  DEPART  (flicker)
 *
 * The punchline: substituting the FULL DOUBLE-PRECISION live k_true ~ 8.8210915878573530 for the imp-34168
 * 10-sig-fig stored anchor pushes the predictive floor exactly ONE rung past 1/2^22 -- the schedule matches
 * through e = 22 and first departs at e = 23 (1/8388608). But the departure is no longer the STORED-ANCHOR
 * precision floor (both fine anchors, differing by 4.3e-11, depart at the identical rung): it is the
 * resid_exp EVALUATION-NOISE resolution floor, a ~1e-8 gap plateau below which the floating-point
 * discrete argmax can no longer resolve the truly-nearest grid point. The imp-34106 E3 diagnosis stands and
 * is sharpened: refining the anchor moves the floor but a deeper, anchor-independent resid_exp resolution
 * floor takes over at 1/2^23.
 *
 * MEASUREMENT ONLY. A closed-form-vs-measurement comparison on an inherited surrogate argmax gap, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34168-doubling-map-highprecision-kstar-floor (the 10-sig-fig floor test EXTENDED here)
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the E3 stored-precision-floor diagnosis)
 * @see imp-34044-sawtooth-phase-realignment-schedule (the closed-form doubling-map schedule)
 * @see imp-33942-hump-argmax-gap-step-proportionality (P3 sawtooth-residue closed form)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* and the resid_exp model, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (sibling cohort member: SUB-GAP-imp-34287-asymptotic-class-undecidable, the same resid_exp quantity's pole-proximity growth class)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (sibling cohort member: SUB-GAP-imp-34268-convex-branch-form, the same resid_exp quantity's convex re-accel branch)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (sibling cohort member: SUB-GAP-imp-34169-surrogate-domain-edge, the resid_exp(k) zero-crossing this evaluation-noise floor sits near)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (sibling cohort member: the fixed-band-peak sub-window refinement sharing the same resid_exp(k) argmax machinery)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR } from './imp-34168-doubling-map-highprecision-kstar-floor.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34168/imp-34106/imp-34044/imp-33878 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-34168 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}

// p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade (imp-33582/imp-33730, verbatim).
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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

// imp-34168 FULL-window discrete argmax (faithful reference; only usable up to ~e=24 before the
// 0.45*2^e loop blows up). Kept here purely to CROSS-CHECK the neighborhood scan below.
function argmaxGridWindowedFull(step) {
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

// Bounded-neighborhood discrete argmax about the peak. For the UNIMODAL resid_exp hump this equals the
// imp-34168 full-window argmax (cross-checked below), and lets the ladder reach deep e (the per-rung cost
// is O(radius), independent of e). anchor pins the neighborhood center.
function argmaxGridNeighborhood(step, anchor, radius = 512) {
  const j0 = Math.round((anchor - GRID_ORIGIN) / step);
  const jLo = Math.max(j0 - radius, Math.ceil((WIN_LO - GRID_ORIGIN) / step));
  const jHi = Math.min(j0 + radius, Math.floor((WIN_HI - GRID_ORIGIN) / step));
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

// Independent ternary search on the SAME resid_exp -- the live full-double-precision continuum peak.
function ternaryArgmax(lo, hi, iters = 300) {
  for (let i = 0; i < iters; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}

const REFLECTION_LO = 0.25; // frac in (1/4, 3/4) => the doubling crosses 1/2 => descent predicted at e+1
const REFLECTION_HI = 0.75;

// Run the imp-34168 ladder machinery over exponents, phasing the sawtooth on `anchor` and measuring the
// discrete (neighborhood) argmax gap = |argmaxK - anchor|. Returns rungs + transitions + first departure.
function runLadder(anchor, exponents) {
  const phase = anchor - GRID_ORIGIN;
  const distToNearestGridPoint = (step) => {
    const off = phase / step;
    const frac = off - Math.floor(off);
    return Math.min(frac, 1 - frac) * step;
  };
  const rungs = exponents.map((exponent) => {
    const step = 1 / Math.pow(2, exponent);
    const a = argmaxGridNeighborhood(step, anchor);
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
      gapRaw: gap,
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
    const realigned = cur.gapRaw < prev.gapRaw - 1e-18;
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

// The two fine phase anchors: the imp-34168 stored 10-sig-fig literal (control) and the full
// double-precision live ternary peak (this ticket). They differ by ~4.3e-11.
const K_TRUE_STORED = IMP34168_DOUBLING_MAP_HIGHPRECISION_KSTAR_FLOOR.storedKTrueHighPrecision; // 8.8210915879
const K_TRUE_LIVE = ternaryArgmax(8.0, 9.5); // ~8.8210915878573530 (full double precision)
const LIVE_VS_STORED = Math.abs(K_TRUE_LIVE - K_TRUE_STORED); // ~4.3e-11

// (M2) Cross-check: the neighborhood argmax reproduces the imp-34168 full-window argmax at the deep end.
const XCHECK_EXPONENTS = [18, 20, 22];
const XCHECK = XCHECK_EXPONENTS.map((e) => {
  const step = 1 / Math.pow(2, e);
  const full = argmaxGridWindowedFull(step).k;
  const nbr = argmaxGridNeighborhood(step, K_TRUE_STORED).k;
  return { exponent: e, full: +full.toFixed(12), neighborhood: +nbr.toFixed(12), agree: Math.abs(full - nbr) < 1e-13 };
});
const XCHECK_ALL_AGREE = XCHECK.every((x) => x.agree);

// The ladder is EXTENDED two rungs deeper than imp-34168 (which stopped at e=22): e = 15..28.
const LADDER_EXPONENTS = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const LIVE = runLadder(K_TRUE_LIVE, LADDER_EXPONENTS); // phased on the full-double-precision live peak
const STORED = runLadder(K_TRUE_STORED, LADDER_EXPONENTS); // phased on the imp-34168 10-sig-fig anchor

// (M3) The live ladder matches through e=22 (imp-34168 floor) and first departs at e=23 (1/8388608).
const LIVE_FIRST_DEPARTURE = LIVE.firstDepartureExponent; // 23
const LIVE_MATCHES_THROUGH_22 = LIVE.rungs
  .filter((r) => r.exponent <= 22)
  .every((r) => r.relDeviationFromClosedForm < 1e-5);
const LIVE_E23 = LIVE.rungs.find((r) => r.exponent === 23);

// (M4) The 10-sig-fig anchor departs at the IDENTICAL rung => the floor is resid_exp resolution, not anchor.
const STORED_FIRST_DEPARTURE = STORED.firstDepartureExponent; // 23
const SAME_DEPARTURE_RUNG = LIVE_FIRST_DEPARTURE === STORED_FIRST_DEPARTURE;
// The smallest gap the discrete argmax ever RESOLVES (matches sawtooth) -- the resolution-floor scale.
const MIN_RESOLVED_GAP = Math.min(
  ...LIVE.rungs.filter((r) => r.relDeviationFromClosedForm < 1e-3).map((r) => r.gapRaw)
); // ~4.5e-9

export const IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR = {
  id: 'imp-34228',
  proofSection: 'S-frontier',
  question:
    'imp-34168 refined the stored doubling-map anchor from 6 to 10 significant figures (k_true ~ ' +
    '8.8210915879, offset ~4.3e-11) and showed the imp-34044 phase-realignment ladder does NOT depart ' +
    'across e = 15..22 (through 1/2^22). Extend the identical imp-33878 resid_exp(k) discrete-argmax ' +
    'ladder to a FULL double-precision live ternary anchor (beyond 10 sig figs) over an extended e-set ' +
    'and MEASURE whether the predictive floor extends past 1/2^22, and where (if anywhere) the ' +
    'double-precision anchor itself finally departs. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the re-run imp-33878 sliding-window resid_exp(k) discrete argmax gap = |argmaxK - anchor| across the ' +
    'extended dyadic ladder 1/32768 .. 1/2^28, compared with the imp-33942 sawtooth min(frac,1-frac)*step ' +
    'under the full double-precision live ternary anchor k_true~8.8210915878573530 and (control) the ' +
    'imp-34168 stored 10-sig-fig anchor, together with each ladder first-departure exponent and the ' +
    'smallest gap the discrete argmax resolves',
  storedKTrue10sigfig: K_TRUE_STORED, // 8.8210915879 (imp-34168 stored 10-sig-fig anchor)
  liveDoublePrecisionAnchor: +K_TRUE_LIVE.toFixed(16), // ~8.8210915878573530 (full double precision)
  liveVsStoredOffset: +LIVE_VS_STORED.toExponential(4), // ~4.3e-11 (the imp-34168 residual anchor floor)
  neighborhoodCrossCheck: XCHECK, // e=18,20,22: full-window argmax == neighborhood argmax to <1e-13
  neighborhoodCrossCheckAllAgree: XCHECK_ALL_AGREE,
  ladderExponents: LADDER_EXPONENTS, // 15..28 (two rungs below imp-34168 e=22)
  liveLadder: LIVE.rungs, // exponent, step, argmaxK, gap, frac, inReflectionBand, sawtoothPredicted, relDeviationFromClosedForm, sawtoothMatches
  liveTransitions: LIVE.transitions, // per level: realigned, predictedByPrevPhase, rulePredictionCorrect
  liveFirstDepartureExponent: LIVE_FIRST_DEPARTURE, // 23 -- one rung past the imp-34168 1/2^22 floor
  liveMatchesThrough22: LIVE_MATCHES_THROUGH_22, // true -- reproduces the imp-34168 no-departure ladder
  storedFirstDepartureExponent: STORED_FIRST_DEPARTURE, // 23 -- the 10-sig-fig anchor departs at the SAME rung
  sameDepartureRung: SAME_DEPARTURE_RUNG, // true -- proves the floor is resid_exp resolution, not anchor precision
  e23SawtoothPredicted: LIVE_E23.sawtoothPredicted, // ~5.515e-8 (the sawtooth calls the gap down here)
  e23FrozenGap: LIVE_E23.gap, // ~6.406e-8 (the discrete argmax gap stays frozen -> departure)
  e23RelDeviation: LIVE_E23.relDeviationFromClosedForm, // ~0.139
  minResolvedArgmaxGap: +MIN_RESOLVED_GAP.toExponential(4), // ~4.5e-9 (the resid_exp resolution-floor scale)
  subGap: 'SUB-GAP-imp-34228-residexp-resolution-floor',
  finding: {
    M1_live_anchor_machine_level_exact:
      'The full double-precision live ternary peak k_true~8.8210915878573530 sits ~4.3e-11 below the ' +
      'imp-34168 stored 10-sig-fig literal 8.8210915879 and reproduces the continuum peak to relative ' +
      'machine epsilon, eliminating the stored-anchor error that set the imp-34168 residual floor.',
    M2_neighborhood_reproduces_imp34168_fullwindow:
      'At e=18,20,22 the bounded-neighborhood argmax equals the imp-34168 full-window [8.6,9.05] argmax ' +
      'to <1e-13, so the deep-ladder extension machinery is faithful to imp-34168, not a new model.',
    M3_floor_extends_exactly_one_rung_past_2p22:
      'Phased on the live anchor, every doubling-map transition is called correctly through e=22 (max ' +
      'relative deviation ~7.74e-6, matching imp-34168) and the ladder FIRST DEPARTS at e=23 (1/8388608): ' +
      'the sawtooth calls the gap down to ~5.515e-8 but the discrete argmax gap stays frozen at ~6.406e-8 ' +
      '(relative deviation ~0.139). Full double precision buys exactly ONE more rung past the imp-34168 ' +
      '1/2^22 stopping point -- not an unbounded extension.',
    M4_departure_is_residexp_resolution_floor_not_anchor:
      'The imp-34168 stored 10-sig-fig anchor (offset ~4.3e-11) departs at the IDENTICAL rung e=23. Two ' +
      'anchors differing by 4.3e-11 cannot share an anchor-precision floor; they share a resid_exp ' +
      'EVALUATION-NOISE floor. The smallest gap the discrete argmax ever resolves is ~4.5e-9: below a gap ' +
      'of ~1e-8 the floating-point resid_exp differences between adjacent near-peak grid points fall below ' +
      'evaluation noise, the argmax can no longer track the truly-nearest grid point, and the gap plateaus ' +
      '(the ladder flickers -- realign at e=24, depart again at e=25). Even a machine-exact anchor cannot ' +
      'push the schedule below the ~1e-8 resid_exp resolution floor: imp-34168 stored-anchor floor is ' +
      'REPLACED, not removed, by the deeper resid_exp evaluation-noise floor ' +
      '(SUB-GAP-imp-34228-residexp-resolution-floor).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). EXTENDS the imp-34168 high-precision doubling-map floor test to the FULL ' +
    'double-precision live ternary anchor k_true~8.8210915878573530 (~4.3e-11 below the imp-34168 stored ' +
    '10-sig-fig literal) over an extended ladder e=15..28, re-running the imp-33878 resid_exp(k) discrete ' +
    'argmax verbatim on the imp-33810 model via a neighborhood argmax cross-checked BIT-FOR-BIT against the ' +
    'imp-34168 full-window argmax at e=18,20,22. The live ladder matches the sawtooth through e=22 (max ' +
    'relative deviation ~7.74e-6, reproducing imp-34168) and FIRST DEPARTS at e=23 (1/8388608): the ' +
    'sawtooth calls the gap to ~5.515e-8 but the argmax gap stays frozen at ~6.406e-8 (relative deviation ' +
    '~0.139). So the predictive floor extends EXACTLY ONE rung past 1/2^22. The departure is NOT the ' +
    'stored-anchor precision floor: the imp-34168 10-sig-fig anchor (differing by 4.3e-11) departs at the ' +
    'IDENTICAL rung e=23, so the floor is the resid_exp EVALUATION-NOISE resolution floor -- the discrete ' +
    'argmax resolves gaps no smaller than ~4.5e-9 and plateaus once adjacent near-peak resid_exp ' +
    'differences fall below floating-point noise. The imp-34106 E3 diagnosis stands and is sharpened: ' +
    'refining the anchor moves the floor but a deeper, anchor-independent resid_exp resolution floor takes ' +
    'over at 1/2^23 (SUB-GAP-imp-34228-residexp-resolution-floor). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, ' +
    'not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34168 (the 10-sig-fig floor test extended here); imp-34106 (the E3 stored-precision-floor ' +
    'diagnosis); imp-34044 (the closed-form doubling-map schedule); imp-33942 (P3 sawtooth-residue closed ' +
    'form); imp-33878 (source of k*~8.821092 and the resid_exp model, reused verbatim); imp-33810 (the ' +
    'ladder storing resid_exp(k), reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C ' +
    '1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR_ASSERTIONS = [
  {
    // (M1) The live anchor sits ~4.3e-11 below the imp-34168 stored 10-sig-fig literal.
    id: 'imp34228-live-anchor-below-stored-10sigfig',
    description: 'full double-precision live ternary peak offset ~4.3e-11 below the imp-34168 stored 8.8210915879',
    holds: () => LIVE_VS_STORED > 1e-11 && LIVE_VS_STORED < 1e-10 && K_TRUE_LIVE < K_TRUE_STORED,
  },
  {
    // (M2) The neighborhood argmax reproduces the imp-34168 full-window argmax at the deep end.
    id: 'imp34228-neighborhood-reproduces-imp34168-fullwindow',
    description: 'neighborhood argmax == imp-34168 full-window argmax to <1e-13 at e=18,20,22',
    holds: () => XCHECK_ALL_AGREE && XCHECK.length === 3,
  },
  {
    // (M3) The live ladder matches through e=22 and first departs at e=23 (one rung past 1/2^22).
    id: 'imp34228-floor-extends-exactly-one-rung-past-2p22',
    description: 'live ladder matches the sawtooth through e=22 and first departs at e=23 (1/8388608)',
    holds: () =>
      LIVE_MATCHES_THROUGH_22 &&
      LIVE_FIRST_DEPARTURE === 23 &&
      LIVE_E23.relDeviationFromClosedForm > 0.1 &&
      LIVE_E23.relDeviationFromClosedForm < 0.2,
  },
  {
    // (M4) The 10-sig-fig anchor departs at the IDENTICAL rung => resid_exp resolution floor, not anchor.
    id: 'imp34228-departure-is-residexp-resolution-floor',
    description: 'the imp-34168 10-sig-fig anchor (offset 4.3e-11) departs at the same rung e=23; min resolved gap ~4.5e-9',
    holds: () =>
      SAME_DEPARTURE_RUNG &&
      STORED_FIRST_DEPARTURE === 23 &&
      MIN_RESOLVED_GAP > 1e-9 &&
      MIN_RESOLVED_GAP < 1e-8,
  },
  {
    // Honesty gate: measurement only, isRigorous false, extends imp-34168, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34228-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, EXTENDS the imp-34168 floor test, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.isRigorous === false &&
      /EXTENDS the imp-34168/.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict) &&
      /NO QED/.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR.verdict),
  },
];

for (const a of IMP34228_DOUBLING_MAP_DOUBLE_PRECISION_ANCHOR_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34228-doubling-map-double-precision-anchor-floor assertion failed: ${a.id}`);
  }
}
