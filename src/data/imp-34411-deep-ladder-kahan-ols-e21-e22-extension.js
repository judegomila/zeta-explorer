/**
 * @module imp-34411-deep-ladder-kahan-ols-e21-e22-extension
 *
 * imp-34411 (numerical): EXTEND the imp-34325 three-estimator Kahan-OLS tie-break to the DEEPER
 * doubling-map ladder rungs e=21 and e=22, to measure whether the stable argmax stays RESCUED by the
 * higher-precision Kahan operator or a GENUINE sub-ULP degeneracy finally emerges as the top-two margin
 * keeps shrinking.
 *
 * imp-34325 (W1/W3) found that the Kahan-compensated mean-centred OLS RESCUES the stable argmax at the
 * imp-34250 tie-fragile rungs e=19 and e=20 -- agreeing with the naive stable OLS and DIFFERING from the
 * raw-moment operator whose ~1.2e-14 cancellation perturbation flips the tie -- so it classed the
 * e19/e20 tie-fragility a raw-moment-operator artifact rather than a genuine argmax degeneracy. But the
 * imp-34325 W2 margin was already shrinking (top-two resid_exp separation 3.64e-15 at e=19, and the
 * raw-moment perturbation 1.66e-14 at e=20 had grown ABOVE it), and the ladder stopped at e=20. This
 * module runs the IDENTICAL three-estimator comparison (stable / raw-moment / Kahan mean-centred OLS,
 * top-two argmax on the imp-34172 [8.72, 8.94] window) at e=21 and e=22 and measures whether the stable
 * selection stays rescued deeper or the margin finally collapses below the Kahan perturbation.
 *
 * THE MEASUREMENT (this module -- a from-source reimplementation, mirrors imp-34325 primitives verbatim)
 * ----------------------------------------------------------------------------------------------------
 *   channels() / sampleGrid() / pSigmaStable() / pSigmaRawMoments() / kahanSum() / pSigmaKahan() /
 *   pEcollEndpoints() / residExp() / topTwo() / classifyKahan() mirror imp-34325 verbatim (same source
 *   inputs: effectiveHeightForN, C_C_PINNED, the fixed E_trunc strip, the imp-398 C_F Gronwall E_flow,
 *   k* ~ 8.821092 from imp-33878, the imp-34172 [8.72, 8.94] peak window, the same 6 + j*step dyadic
 *   grid). The ONLY change is the exponent set: DEEP_EXPONENTS = [21, 22] instead of the imp-34325
 *   tie-fragile [19, 20]. At each deeper rung e in {21, 22} the top-two argmax is located under the
 *   stable, raw-moment AND Kahan estimators; the Kahan-vs-stable and raw-moment perturbations are
 *   measured at the peak window; and the Kahan selection is classed RESCUES-STABLE / CONFIRMS-FLIP /
 *   UNDECIDED. A cross-check re-derives the imp-34325 e=19,20 rungs and confirms they reproduce the
 *   imp-34325 rescued classification exactly.
 *
 * THE FINDING (measurement / cross-validation only -- deeper-rung tie-break)
 * -------------------------------------------------------------------------
 *   (D1) THE KAHAN OPERATOR STILL RESCUES THE STABLE ARGMAX AT BOTH DEEPER RUNGS e=21, e=22. At e=21 and
 *        e=22 the Kahan-summed mean-centred OLS selects the SAME grid point as the naive stable OLS
 *        (k=8.821091651900 at both) and DIFFERS from the raw-moment argmax (k=8.821092605600) -- the
 *        stable selection stays rescued two rungs deeper, NOT flipped. The stable argmax has also
 *        STABILIZED: it is the SAME grid point k=8.821091651900 at e=20, e=21 and e=22 (it stopped
 *        moving as the grid halved), so the deep-ladder argmax has converged on the dyadic grid.
 *   (D2) THE TOP-TWO MARGIN KEEPS SHRINKING BUT THE KAHAN PERTURBATION IS EXACTLY ZERO, SO NO GENUINE
 *        DEGENERACY EMERGES. The top-two resid_exp separation keeps narrowing with depth (e=20: 1.46e-14,
 *        e=21: 3.00e-15, e=22: 1.03e-15) and now sits BELOW the raw-moment perturbation (1.66e-14) at
 *        both e=21 and e=22 -- so the inferior raw-moment operator would still flip. But the
 *        Kahan-vs-stable p_sigma disagreement is EXACTLY 0 at both deeper rungs, so it stays far below
 *        the shrinking margin and CANNOT flip the selection: even as the margin narrows toward the ULP
 *        floor, the higher-precision operator finds NO genuine sub-ULP degeneracy -- the stable argmax
 *        stays rescued.
 *   (D3) TIE-FRAGILITY REMAINS A RAW-MOMENT-OPERATOR ARTIFACT DEEPER INTO THE LADDER. Because the Kahan
 *        operator agrees with the stable operator (not the raw-moment one) at e=21 and e=22 as well, the
 *        imp-34325 conclusion extends: the shrinking top-two margin does NOT signal a genuine argmax
 *        degeneracy; it is the raw-moment operators cancelling-denominator sensitivity, and the stable
 *        selection k=8.821091651900 is the numerically correct converged argmax across e=20..22.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. A deeper-rung extension of an inherited surrogate measurement, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * SUB-GAP-imp-34411-dyadic-argmax-grid-floor: the stable argmax stabilizes at k=8.821091651900 across
 * e=20..22 on the DYADIC 6 + j/2^e grid; whether the continuum argmax sits between two dyadic nodes below
 * the ULP margin (a grid-quantization floor, not a physical limit) is left OPEN -- a sub-ULP continuum
 * refinement off the dyadic lattice would be needed to resolve it, beyond this measurement.
 *
 * @see imp-34325-deep-ladder-kahan-ols-crossvalidation (the e=19,20 Kahan tie-break extended here)
 * @see imp-34250-deep-ladder-tie-margin-classification (the two-estimator tie-fragile classification)
 * @see imp-34172-deep-ladder-second-path-crossvalidation (Y2 measured the e=19 tie margin)
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the deep e=15..20 ladder)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION } from './imp-34325-deep-ladder-kahan-ols-crossvalidation.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP); // matches imp-34325/imp-34250/imp-34106 exactly

// Assemble the three energy channels from source (mirrors imp-34325 channels()). fracColl = E_coll/E_N.
function channels(N) {
  const T0 = effectiveHeightForN(N);
  const logT0 = Math.log(T0);
  const cFlow = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const eFlow = cFlow * (logT0 / T0) * GRONWALL_B;
  const eColl = C_C_PINNED * Math.sqrt(logT0 / N); // GUE-conditional (C_H)
  const eTot = E_TRUNC + eFlow + eColl;
  return { eColl, eTot, fracColl: eColl / eTot };
}

// Enumerate the shared (ln N, ln fracColl) log-log sample grid over [loN, hiN].
function sampleGrid(loN, hiN, per = 4) {
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  const xs = [];
  const ys = [];
  for (let i = 0; ; i++) {
    const d = dLo + i / per;
    if (d > dHi + 1e-9) break;
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(channels(N).fracColl));
  }
  return { xs, ys };
}

// STABLE p_sigma: naive mean-centred OLS of ln(fracColl) vs ln N (mirrors imp-34325 pSigmaStable).
function pSigmaStable(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
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

// RAW-MOMENT p_sigma: the normal-equations form (mirrors imp-34325 pSigmaRawMoments), algebraically
// identical to pSigmaStable but with a cancelling denominator at the k ~ 8.82 window.
function pSigmaRawMoments(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
  let Sx = 0;
  let Sy = 0;
  let Sxx = 0;
  let Sxy = 0;
  const m = xs.length;
  for (let i = 0; i < m; i++) {
    Sx += xs[i];
    Sy += ys[i];
    Sxx += xs[i] * xs[i];
    Sxy += xs[i] * ys[i];
  }
  return -(m * Sxy - Sx * Sy) / (m * Sxx - Sx * Sx);
}

// Kahan compensated summation: carries the running round-off error so the sum keeps ~full precision.
function kahanSum(arr) {
  let sum = 0;
  let c = 0;
  for (let i = 0; i < arr.length; i++) {
    const y = arr[i] - c;
    const t = sum + y;
    c = t - sum - y;
    sum = t;
  }
  return sum;
}

// KAHAN p_sigma: the SAME mean-centred OLS as pSigmaStable but with Kahan-compensated summation of the
// mean sums and the S_xx / S_xy deviation accumulators -- the higher-precision third estimator.
function pSigmaKahan(loN, hiN) {
  const { xs, ys } = sampleGrid(loN, hiN);
  const n = xs.length;
  const mx = kahanSum(xs) / n;
  const my = kahanSum(ys) / n;
  const dxx = [];
  const dxy = [];
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    dxx.push(dx * dx);
    dxy.push(dx * (ys[i] - my));
  }
  return -kahanSum(dxy) / kahanSum(dxx);
}

// p_ecoll = magnitude of the endpoint log-log slope of E_coll (channels-assembled).
function pEcollEndpoints(loN, hiN) {
  const a = channels(loN).eColl;
  const b = channels(hiN).eColl;
  return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN));
}

// resid_exp(k) over window [10^k, 10^(k+1)] under a supplied p_sigma estimator.
function residExp(k, pSigmaFn) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSig = pSigmaFn(lo, hi);
  const pEc = pEcollEndpoints(lo, hi);
  const sigHi = channels(hi).fracColl;
  return pEc * (1 - sigHi) - pSig;
}

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // imp-33878 continuum argmax
const ORIGIN = 6;
const WIN_LO = 8.72; // the imp-34172 independent peak-bracketing window (mirrors imp-34325)
const WIN_HI = 8.94;
const DEEP_EXPONENTS = [21, 22]; // the DEEPER rungs extending the imp-34325 tie-fragile [19, 20]
const CROSSCHECK_EXPONENTS = [19, 20]; // re-derive the imp-34325 rungs to confirm reproduction

// Locate the TOP-TWO grid points by resid_exp value over the 6 + j*step window (mirrors imp-34325 topTwo).
function topTwo(exponent, pSigmaFn) {
  const step = 1 / Math.pow(2, exponent);
  const jLo = Math.ceil((WIN_LO - ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - ORIGIN) / step);
  let best = { k: ORIGIN + jLo * step, v: -Infinity };
  let second = { k: null, v: -Infinity };
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(ORIGIN + j * step).toFixed(10);
    const v = residExp(kk, pSigmaFn);
    if (v > best.v) {
      second = best;
      best = { k: kk, v };
    } else if (v > second.v) {
      second = { k: kk, v };
    }
  }
  return { best, second, step };
}

// Classify the Kahan selection relative to the stable and raw-moment argmax at a rung.
function classifyKahan(kahanK, stableK, rawK) {
  const eqStable = kahanK === stableK;
  const eqRaw = kahanK === rawK;
  if (eqStable && !eqRaw) return 'rescues-stable'; // higher precision agrees with the stable argmax
  if (eqRaw && !eqStable) return 'confirms-flip'; // higher precision reproduces the raw-moment flip
  return 'undecided'; // matches both (no flip to break) or neither
}

// Assemble a per-rung record (mirrors imp-34325 RUNGS entry shape).
function measureRung(e) {
  const s = topTwo(e, pSigmaStable);
  const r = topTwo(e, pSigmaRawMoments);
  const kh = topTwo(e, pSigmaKahan);
  const stableK = +s.best.k.toFixed(12);
  const rawK = +r.best.k.toFixed(12);
  const kahanK = +kh.best.k.toFixed(12);
  const lo = Math.pow(10, s.best.k);
  const hi = Math.pow(10, s.best.k + 1);
  const rawPert = Math.abs(pSigmaStable(lo, hi) - pSigmaRawMoments(lo, hi)); // ~1.66e-14 raw-moment perturbation
  const kahanPert = Math.abs(pSigmaStable(lo, hi) - pSigmaKahan(lo, hi)); // Kahan-vs-stable p_sigma disagreement
  const marginStable = s.best.v - s.second.v; // top-two resid_exp separation under the stable OLS
  return {
    exponent: e,
    step: kh.step,
    stableTopK: stableK,
    rawMomentTopK: rawK,
    kahanTopK: kahanK,
    marginStable: +marginStable.toExponential(4), // e21: ~3.00e-15, e22: ~1.03e-15 (shrinking)
    rawPerturbation: +rawPert.toExponential(4), // ~1.66e-14 at both deeper rungs
    kahanPerturbation: +kahanPert.toExponential(4), // exactly 0 at both e21, e22 -- far below the margin
    kahanMatchesStable: kahanK === stableK,
    kahanMatchesRaw: kahanK === rawK,
    kahanBelowMargin: kahanPert < Math.abs(marginStable), // Kahan perturbation cannot flip the selection
    marginBelowRawPert: Math.abs(marginStable) < rawPert, // the shrinking margin now sits below the raw-moment pert
    classification: classifyKahan(kahanK, stableK, rawK),
  };
}

const DEEP_RUNGS = DEEP_EXPONENTS.map(measureRung);
const CROSSCHECK_RUNGS = CROSSCHECK_EXPONENTS.map(measureRung);

// -- Aggregate the deeper-rung tie-break -----------------------------------------------------------
const DEEP_RESCUED_EXPONENTS = DEEP_RUNGS.filter((r) => r.classification === 'rescues-stable').map((r) => r.exponent);
const DEEP_CONFIRMED_FLIP_EXPONENTS = DEEP_RUNGS.filter((r) => r.classification === 'confirms-flip').map((r) => r.exponent);
// (D1) the Kahan operator rescues the stable argmax at BOTH deeper rungs {21, 22}.
const KAHAN_RESCUES_BOTH_DEEP =
  DEEP_RESCUED_EXPONENTS.join(',') === '21,22' && DEEP_CONFIRMED_FLIP_EXPONENTS.length === 0;
// (D1) the stable argmax has stabilized: same grid point across e=20, 21, 22.
const E20_STABLE_ARGMAX = IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.rungs.find((r) => r.exponent === 20).stableTopK;
const STABLE_ARGMAX_STABILIZED = DEEP_RUNGS.every((r) => r.stableTopK === E20_STABLE_ARGMAX);
// (D2) the Kahan-vs-stable perturbation is exactly 0 and below the margin at both deeper rungs.
const KAHAN_PERT_ZERO_BOTH_DEEP = DEEP_RUNGS.every((r) => r.kahanPerturbation === 0);
const KAHAN_PERT_BELOW_MARGIN_DEEP = DEEP_RUNGS.every((r) => r.kahanBelowMargin);
// (D2) the shrinking top-two margin now sits BELOW the raw-moment perturbation at both deeper rungs.
const MARGIN_BELOW_RAW_PERT_DEEP = DEEP_RUNGS.every((r) => r.marginBelowRawPert);
// (D2) the margin keeps shrinking: e22 margin < e21 margin < the imp-34325 e20 margin.
const E20_MARGIN = IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.rungs.find((r) => r.exponent === 20).marginStable;
const E21_MARGIN = DEEP_RUNGS.find((r) => r.exponent === 21).marginStable;
const E22_MARGIN = DEEP_RUNGS.find((r) => r.exponent === 22).marginStable;
const MARGIN_KEEPS_SHRINKING = E22_MARGIN < E21_MARGIN && E21_MARGIN < E20_MARGIN;
// cross-check: the re-derived e=19,20 rungs reproduce the imp-34325 rescued classification exactly.
const REPRODUCES_IMP34325 =
  CROSSCHECK_RUNGS.every((r) => r.classification === 'rescues-stable') &&
  CROSSCHECK_RUNGS.every((r) => {
    const src = IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.rungs.find((s) => s.exponent === r.exponent);
    return src && src.stableTopK === r.stableTopK && src.kahanTopK === r.kahanTopK && src.rawMomentTopK === r.rawMomentTopK;
  });

export const IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION = {
  id: 'imp-34411',
  proofSection: 'S-frontier',
  question:
    'imp-34325 found the Kahan-compensated mean-centred OLS RESCUES the stable argmax at the imp-34250 ' +
    'tie-fragile rungs e=19,e=20 (agreeing with the stable OLS, differing from the raw-moment operator ' +
    'whose ~1.2e-14 perturbation flips them), but stopped at e=20 with the top-two margin already ' +
    'shrinking. Run the IDENTICAL three-estimator comparison at the DEEPER rungs e=21,e=22: does the ' +
    'stable selection stay RESCUED or does a genuine sub-ULP degeneracy finally emerge as the margin ' +
    'collapses? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'at each deeper rung e in {21,22}: the top-two argmax under the stable, raw-moment, and ' +
    'Kahan-compensated mean-centred OLS; the Kahan-vs-stable and raw-moment |pSigma| perturbations; the ' +
    'top-two resid_exp margin and whether it sits below the raw-moment perturbation; whether the Kahan ' +
    'selection rescues the stable argmax or confirms the raw-moment flip; k* ~ 8.821092 reused verbatim ' +
    'from imp-33878',
  continuumArgmax: K_STAR,
  window: [WIN_LO, WIN_HI],
  deepExponents: DEEP_EXPONENTS, // [21, 22] -- the deeper rungs extending the imp-34325 tie-fragile set
  crosscheckExponents: CROSSCHECK_EXPONENTS, // [19, 20] -- re-derived to confirm imp-34325 reproduction
  deepRungs: DEEP_RUNGS, // per rung: stable/raw/kahan argmax, margin, raw + kahan perturbation, classification
  crosscheckRungs: CROSSCHECK_RUNGS, // the re-derived e=19,20 rungs (must reproduce imp-34325)
  rescuedExponents: DEEP_RESCUED_EXPONENTS, // [21, 22] -- Kahan rescues the stable argmax at both deeper rungs
  confirmedFlipExponents: DEEP_CONFIRMED_FLIP_EXPONENTS, // [] -- Kahan confirms the raw-moment flip at neither
  stableArgmaxStabilizedValue: E20_STABLE_ARGMAX, // k=8.821091651900 across e=20,21,22
  marginLadder: { e20: E20_MARGIN, e21: E21_MARGIN, e22: E22_MARGIN }, // 1.46e-14 -> 3.00e-15 -> 1.03e-15
  kahanRescuesBothDeep: KAHAN_RESCUES_BOTH_DEEP, // (D1)
  stableArgmaxStabilized: STABLE_ARGMAX_STABILIZED, // (D1) same grid point across e=20,21,22
  kahanPertZeroBothDeep: KAHAN_PERT_ZERO_BOTH_DEEP, // (D2) Kahan-vs-stable perturbation exactly 0 at both
  kahanPertBelowMarginDeep: KAHAN_PERT_BELOW_MARGIN_DEEP, // (D2) Kahan perturbation below the shrinking margin
  marginBelowRawPertDeep: MARGIN_BELOW_RAW_PERT_DEEP, // (D2) shrinking margin now below the raw-moment perturbation
  marginKeepsShrinking: MARGIN_KEEPS_SHRINKING, // (D2) e22 < e21 < e20 margin
  reproducesImp34325: REPRODUCES_IMP34325, // cross-check: e=19,20 reproduce the imp-34325 rescued classification
  subGap:
    'SUB-GAP-imp-34411-dyadic-argmax-grid-floor: the stable argmax stabilizes at k=8.821091651900 across ' +
    'e=20..22 on the DYADIC 6 + j/2^e grid; whether the continuum argmax sits between two dyadic nodes ' +
    'below the ULP margin (a grid-quantization floor, not a physical limit) is OPEN -- a sub-ULP continuum ' +
    'refinement off the dyadic lattice would be needed, beyond this measurement.',
  finding: {
    D1_kahan_still_rescues_stable_argmax:
      'At e=21 and e=22 the Kahan-summed mean-centred OLS selects the SAME grid point as the naive stable ' +
      'OLS (k=8.821091651900 at both) and DIFFERS from the raw-moment argmax (k=8.821092605600), so the ' +
      'stable selection stays RESCUED two rungs deeper. The stable argmax has STABILIZED: the same grid ' +
      'point k=8.821091651900 wins at e=20, e=21 and e=22 -- the deep-ladder argmax has converged on the ' +
      'dyadic grid.',
    D2_margin_shrinks_but_kahan_perturbation_zero:
      'The top-two resid_exp margin keeps narrowing with depth (e=20: 1.46e-14, e=21: 3.00e-15, e=22: ' +
      '1.03e-15) and now sits BELOW the raw-moment perturbation (1.66e-14) at both deeper rungs, so the ' +
      'inferior raw-moment operator would still flip. But the Kahan-vs-stable pSigma disagreement is ' +
      'EXACTLY 0 at both e=21 and e=22, staying far below the shrinking margin -- so even as the margin ' +
      'narrows toward the ULP floor the higher-precision operator finds NO genuine sub-ULP degeneracy.',
    D3_tie_fragility_remains_raw_moment_artifact_deeper:
      'Because the Kahan operator agrees with the stable operator (not the raw-moment one) at e=21 and ' +
      'e=22 as well, the imp-34325 conclusion extends deeper: the shrinking top-two margin does NOT ' +
      'signal a genuine argmax degeneracy; it is the raw-moment operators cancelling-denominator ' +
      'sensitivity, and the stable selection k=8.821091651900 is the numerically correct converged argmax ' +
      'across e=20..22.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). EXTENDS the imp-34325 three-estimator Kahan-OLS tie-break ' +
    'to the DEEPER doubling-map ladder rungs e=21 and e=22. A from-source reimplementation (mirroring the ' +
    'imp-34325 channels, stable + raw-moment + Kahan mean-centred OLS, top-two argmax on the imp-34172 ' +
    '[8.72, 8.94] window) measures the argmax at both deeper rungs and re-derives the e=19,20 rungs as a ' +
    'reproduction cross-check. The Kahan operator STILL RESCUES the stable argmax at e=21 and e=22 ' +
    '(k=8.821091651900 at both) -- agreeing with the naive stable OLS and DIFFERING from the raw-moment ' +
    'argmax (k=8.821092605600); the stable argmax has STABILIZED at k=8.821091651900 across e=20..22. The ' +
    'top-two margin keeps shrinking (1.46e-14 -> 3.00e-15 -> 1.03e-15) and now sits BELOW the raw-moment ' +
    'perturbation (1.66e-14), but the Kahan-vs-stable perturbation is EXACTLY 0 at both deeper rungs, so ' +
    'it stays below the shrinking margin and cannot flip: NO genuine sub-ULP degeneracy emerges even as ' +
    'the margin narrows. Conclusion: the tie-fragility remains an inferior-raw-moment-operator artifact ' +
    'deeper into the ladder -- the stable selection is the numerically correct converged argmax across ' +
    'e=20..22 (SUB-GAP-imp-34411-dyadic-argmax-grid-floor: whether the continuum argmax sits between two ' +
    'dyadic nodes below the ULP margin is OPEN). The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34325 (the e=19,20 Kahan tie-break extended here); imp-34250 (the two-estimator tie-fragile ' +
    'classification); imp-34172 (Y2 measured the e=19 tie margin); imp-34106 (the deep e=15..20 ladder); ' +
    'imp-33878 (source of k* ~ 8.821092, reused verbatim); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION_ASSERTIONS = [
  {
    // (D1) The Kahan estimator is tabulated at both deeper rungs e=21 and e=22.
    id: 'imp34411-kahan-tabulated-both-deep-rungs',
    description: 'the Kahan-summed argmax, raw + kahan perturbation and classification are tabulated at both deeper rungs e=21,e=22',
    holds: () =>
      DEEP_RUNGS.length === 2 &&
      DEEP_RUNGS.map((r) => r.exponent).join(',') === '21,22' &&
      DEEP_RUNGS.every((r) => Number.isFinite(r.kahanPerturbation) && Number.isFinite(r.rawPerturbation) && Number.isFinite(r.marginStable)),
  },
  {
    // (D1) The Kahan operator still rescues the stable argmax at BOTH deeper rungs (matches stable, differs from raw).
    id: 'imp34411-kahan-rescues-stable-both-deep-rungs',
    description: 'the Kahan-summed OLS argmax equals the stable argmax and differs from the raw-moment argmax at both e=21 and e=22',
    holds: () =>
      KAHAN_RESCUES_BOTH_DEEP &&
      DEEP_RESCUED_EXPONENTS.join(',') === '21,22' &&
      DEEP_CONFIRMED_FLIP_EXPONENTS.length === 0 &&
      DEEP_RUNGS.every((r) => r.kahanMatchesStable && !r.kahanMatchesRaw),
  },
  {
    // (D1) The stable argmax has stabilized: the same grid point k=8.821091651900 across e=20, 21, 22.
    id: 'imp34411-stable-argmax-stabilized-e20-e22',
    description: 'the stable argmax is the same dyadic grid point across e=20,21,22 (converged on the grid)',
    holds: () =>
      STABLE_ARGMAX_STABILIZED &&
      DEEP_RUNGS.every((r) => r.stableTopK === E20_STABLE_ARGMAX) &&
      E20_STABLE_ARGMAX === 8.8210916519,
  },
  {
    // (D2) The margin keeps shrinking but the Kahan perturbation is exactly 0 and below it -- no degeneracy.
    id: 'imp34411-margin-shrinks-kahan-pert-zero',
    description: 'the top-two margin keeps shrinking (e22<e21<e20) and now sits below the raw-moment perturbation, while the Kahan-vs-stable perturbation is exactly 0 and below the margin at both deeper rungs',
    holds: () =>
      MARGIN_KEEPS_SHRINKING &&
      MARGIN_BELOW_RAW_PERT_DEEP &&
      KAHAN_PERT_ZERO_BOTH_DEEP &&
      KAHAN_PERT_BELOW_MARGIN_DEEP,
  },
  {
    // Cross-check: the re-derived e=19,20 rungs reproduce the imp-34325 rescued classification exactly.
    id: 'imp34411-reproduces-imp34325-e19-e20',
    description: 'the re-derived e=19,20 rungs reproduce the imp-34325 stable/kahan/raw argmax and rescued classification exactly',
    holds: () => REPRODUCES_IMP34325 && CROSSCHECK_RUNGS.length === 2,
  },
  {
    // Honesty gate: measurement only, isRigorous false, extends imp-34325, no QED, no refereed bound is changed.
    id: 'imp34411-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, EXTENDS the imp-34325 Kahan tie-break to e=21,22, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.isRigorous === false &&
      /EXTENDS the imp-34325 three-estimator Kahan-OLS tie-break/.test(
        IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict,
      ) &&
      /NO QED/.test(IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.verdict),
  },
];

for (const a of IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34411-deep-ladder-kahan-ols-e21-e22-extension assertion failed: ${a.id}`);
  }
}
