/**
 * @module imp-34325-deep-ladder-kahan-ols-crossvalidation
 *
 * imp-34325 (numerical): CROSS-VALIDATE the imp-34250 tie-fragile {e=19, e=20} deep-ladder
 * classification against a THIRD, higher-precision compensated (Kahan-summed) OLS estimator.
 * imp-34250 classified the imp-34106 deep doubling-map ladder rungs e=15..20 as robustly-decidable
 * (e15..18) vs tie-fragile (e19, e20) using only TWO argmax estimators: the numerically stable
 * mean-centred OLS and the algebraically-equivalent raw-moment OLS whose ~1.2e-14 cancellation
 * perturbation FLIPS the e19/e20 selection off the stable argmax. But two estimators cannot decide
 * whether that flip reflects a GENUINE sub-ULP degeneracy of the argmax (in which case a more precise
 * operator should also land near or across the tie) or is merely an artifact of the inferior
 * raw-moment operator (in which case a more precise operator should reproduce the stable selection).
 * This module adds a THIRD estimator -- the SAME mean-centred OLS but with Kahan-compensated summation
 * of the mean and of the S_xx / S_xy accumulators -- and measures its argmax at e=19 and e=20.
 *
 * THE MEASUREMENT (this module -- a from-source reimplementation, mirrors imp-34250 primitives)
 * --------------------------------------------------------------------------------------------
 *   channels() / pSigmaStable() / pSigmaRawMoments() / residExp() / topTwo() mirror imp-34250 verbatim
 *   (same source inputs: effectiveHeightForN, C_C_PINNED, the fixed E_trunc strip, the imp-398 C_F
 *   Gronwall E_flow, k* ~ 8.821092 from imp-33878, the imp-34172 [8.72, 8.94] peak window, the same
 *   6 + j*step dyadic grid). The added third estimator pSigmaKahan() is the SAME mean-centred OLS as
 *   pSigmaStable but accumulates the mean sums and the S_xx / S_xy deviation sums with Kahan
 *   compensated summation (running error carry), which removes the naive-summation round-off. At each
 *   tie-fragile rung e in {19, 20}:
 *     (a) the top-two argmax is located under the stable, the raw-moment, AND the Kahan estimator;
 *     (b) kahanVsStablePert(e) = |pSigmaStable - pSigmaKahan| at the peak window is the Kahan operators
 *         p_sigma disagreement with the stable operator (the analogue of the ~1.2e-14 raw-moment
 *         perturbation, but for the higher-precision operator);
 *     (c) the Kahan selection is classed CONFIRMS-FLIP (Kahan argmax == raw argmax != stable),
 *         RESCUES-STABLE (Kahan argmax == stable argmax != raw), or UNDECIDED (Kahan argmax matches
 *         neither / disagrees with both).
 *
 * THE FINDING (measurement / cross-validation only -- a third-estimator tie-break)
 * ------------------------------------------------------------------------------
 *   (W1) THE KAHAN OPERATOR RESCUES THE STABLE ARGMAX AT BOTH TIE-FRAGILE RUNGS. At e=19 and e=20 the
 *        Kahan-summed mean-centred OLS selects the SAME grid point as the naive stable OLS
 *        (e19: k=8.821090698200; e20: k=8.821091651900) and DIFFERS from the raw-moment argmax
 *        (k=8.821092605600), i.e. it does NOT reproduce the raw-moment flip. So the higher-precision
 *        operator RESCUES the stable selection at both rungs rather than confirming the raw-moment
 *        descent.
 *   (W2) THE KAHAN OPERATORS PERTURBATION IS ~450x SMALLER THAN THE RAW-MOMENT ONE AND STAYS BELOW
 *        THE MARGIN. The Kahan-vs-stable p_sigma disagreement is ~2.78e-17 at e=19 and exactly 0 at
 *        e=20 -- versus the raw-moment ~1.23e-14 (e=19) / ~1.66e-14 (e=20) perturbation that flips the
 *        tie. The Kahan perturbation sits BELOW the top-two resid_exp margin (3.64e-15 at e=19,
 *        1.46e-14 at e=20), so it cannot flip the selection -- exactly why the stable argmax survives
 *        under the more precise operator.
 *   (W3) TIE-FRAGILITY IS A RAW-MOMENT-OPERATOR ARTIFACT, NOT A GENUINE SUB-ULP DEGENERACY. Because the
 *        higher-precision operator agrees with the stable operator (not the raw-moment one), the
 *        e19/e20 flip is an artifact of the raw-moment operators cancelling denominator, not a genuine
 *        degeneracy of the argmax. The stable selection is the numerically correct one at both rungs;
 *        the tie-fragile label marks operator sensitivity, NOT an undecidable argmax.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. A third-estimator tie-break of an inherited surrogate measurement,
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34250-deep-ladder-tie-margin-classification (the two-estimator classification cross-validated here)
 * @see imp-34172-deep-ladder-second-path-crossvalidation (Y2 measured the e=19 tie margin)
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the deep e=15..20 ladder)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION } from './imp-34250-deep-ladder-tie-margin-classification.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP); // matches imp-34250/imp-34172/imp-34106 exactly

// Assemble the three energy channels from source (mirrors imp-34250 channels()). fracColl = E_coll/E_N.
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

// STABLE p_sigma: naive mean-centred OLS of ln(fracColl) vs ln N (mirrors imp-34250 pSigmaStable).
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

// RAW-MOMENT p_sigma: the normal-equations form (mirrors imp-34250 pSigmaRawMoments), algebraically
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
const WIN_LO = 8.72; // the imp-34172 independent peak-bracketing window (mirrors imp-34250)
const WIN_HI = 8.94;
const TIE_FRAGILE_EXPONENTS = [19, 20]; // the imp-34250 tie-fragile deep rungs cross-validated here

// Locate the TOP-TWO grid points by resid_exp value over the 6 + j*step window (mirrors imp-34250 topTwo).
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

// Classify the Kahan selection relative to the stable and raw-moment argmax at a tie-fragile rung.
function classifyKahan(kahanK, stableK, rawK) {
  const eqStable = kahanK === stableK;
  const eqRaw = kahanK === rawK;
  if (eqStable && !eqRaw) return 'rescues-stable'; // higher precision agrees with the stable argmax
  if (eqRaw && !eqStable) return 'confirms-flip'; // higher precision reproduces the raw-moment flip
  return 'undecided'; // matches both (no flip to break) or neither
}

const RUNGS = TIE_FRAGILE_EXPONENTS.map((e) => {
  const s = topTwo(e, pSigmaStable);
  const r = topTwo(e, pSigmaRawMoments);
  const kh = topTwo(e, pSigmaKahan);
  const stableK = +s.best.k.toFixed(12);
  const rawK = +r.best.k.toFixed(12);
  const kahanK = +kh.best.k.toFixed(12);
  const lo = Math.pow(10, s.best.k);
  const hi = Math.pow(10, s.best.k + 1);
  const rawPert = Math.abs(pSigmaStable(lo, hi) - pSigmaRawMoments(lo, hi)); // ~1.2e-14 raw-moment perturbation
  const kahanPert = Math.abs(pSigmaStable(lo, hi) - pSigmaKahan(lo, hi)); // Kahan-vs-stable p_sigma disagreement
  const marginStable = s.best.v - s.second.v; // top-two resid_exp separation under the stable OLS
  return {
    exponent: e,
    step: kh.step,
    stableTopK: stableK,
    rawMomentTopK: rawK,
    kahanTopK: kahanK,
    marginStable: +marginStable.toExponential(4), // ~3.64e-15 (e19), ~1.46e-14 (e20)
    rawPerturbation: +rawPert.toExponential(4), // ~1.23e-14 (e19), ~1.66e-14 (e20)
    kahanPerturbation: +kahanPert.toExponential(4), // ~2.78e-17 (e19), 0 (e20) -- far below the margin
    kahanMatchesStable: kahanK === stableK,
    kahanMatchesRaw: kahanK === rawK,
    kahanBelowMargin: kahanPert < Math.abs(marginStable), // Kahan perturbation cannot flip the selection
    classification: classifyKahan(kahanK, stableK, rawK),
  };
});

// -- Aggregate the third-estimator tie-break -------------------------------------------------------
const RESCUED_EXPONENTS = RUNGS.filter((r) => r.classification === 'rescues-stable').map((r) => r.exponent);
const CONFIRMED_FLIP_EXPONENTS = RUNGS.filter((r) => r.classification === 'confirms-flip').map((r) => r.exponent);
// (W1) the Kahan operator rescues the stable argmax at BOTH tie-fragile rungs {19, 20}.
const KAHAN_RESCUES_BOTH =
  RESCUED_EXPONENTS.join(',') === '19,20' && CONFIRMED_FLIP_EXPONENTS.length === 0;
// (W2) the Kahan-vs-stable perturbation is far below the raw-moment one AND below the margin at both rungs.
const KAHAN_PERT_BELOW_RAW = RUNGS.every((r) => r.kahanPerturbation < r.rawPerturbation);
const KAHAN_PERT_BELOW_MARGIN = RUNGS.every((r) => r.kahanBelowMargin);
// cross-check: the imp-34250 fragile set is exactly the set this module cross-validates.
const IMP34250_FRAGILE = IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.fragileExponents;
const COVERS_IMP34250_FRAGILE_SET =
  IMP34250_FRAGILE.join(',') === TIE_FRAGILE_EXPONENTS.join(',');

export const IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION = {
  id: 'imp-34325',
  proofSection: 'S-frontier',
  question:
    'imp-34250 classified the imp-34106 deep-ladder rungs e=19,e=20 as tie-fragile using only TWO argmax ' +
    'estimators (stable mean-centred OLS and the algebraically-equivalent raw-moment OLS whose ~1.2e-14 ' +
    'perturbation flips them). Does a THIRD, higher-precision compensated (Kahan-summed) OLS CONFIRM the ' +
    'raw-moment flip, RESCUE the stable argmax, or land undecided -- i.e. is tie-fragility a genuine ' +
    'sub-ULP degeneracy or an inferior-raw-moment-operator artifact? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'at each tie-fragile rung e in {19,20}: the top-two argmax under the stable, raw-moment, and ' +
    'Kahan-compensated mean-centred OLS; the Kahan-vs-stable |pSigma| disagreement vs the raw-moment ' +
    'perturbation; whether the Kahan selection rescues the stable argmax or confirms the raw-moment flip; ' +
    'k* ~ 8.821092 reused verbatim from imp-33878',
  continuumArgmax: K_STAR,
  window: [WIN_LO, WIN_HI],
  tieFragileExponents: TIE_FRAGILE_EXPONENTS, // [19, 20] -- the imp-34250 tie-fragile set
  rungs: RUNGS, // per rung: stable/raw/kahan argmax, margin, raw + kahan perturbation, classification
  rescuedExponents: RESCUED_EXPONENTS, // [19, 20] -- Kahan rescues the stable argmax at both
  confirmedFlipExponents: CONFIRMED_FLIP_EXPONENTS, // [] -- Kahan confirms the raw-moment flip at neither
  kahanRescuesBoth: KAHAN_RESCUES_BOTH, // (W1)
  kahanPertBelowRaw: KAHAN_PERT_BELOW_RAW, // (W2) Kahan perturbation << raw-moment perturbation
  kahanPertBelowMargin: KAHAN_PERT_BELOW_MARGIN, // (W2) Kahan perturbation below the top-two margin
  coversImp34250FragileSet: COVERS_IMP34250_FRAGILE_SET, // this module cross-validates exactly {19,20}
  finding: {
    W1_kahan_rescues_stable_argmax:
      'At e=19 and e=20 the Kahan-summed mean-centred OLS selects the SAME grid point as the naive stable ' +
      'OLS (e19: k=8.821090698200; e20: k=8.821091651900) and DIFFERS from the raw-moment argmax ' +
      '(k=8.821092605600), so the higher-precision operator RESCUES the stable selection at both ' +
      'tie-fragile rungs rather than reproducing the raw-moment flip.',
    W2_kahan_perturbation_far_below_raw_and_margin:
      'The Kahan-vs-stable pSigma disagreement is ~2.78e-17 (e=19) and exactly 0 (e=20) -- versus the ' +
      'raw-moment ~1.23e-14 (e=19) / ~1.66e-14 (e=20) perturbation that flips the tie -- and sits BELOW ' +
      'the top-two resid_exp margin (3.64e-15 at e=19, 1.46e-14 at e=20), so it cannot flip the selection.',
    W3_tie_fragility_is_raw_moment_artifact:
      'Because the higher-precision operator agrees with the stable operator (not the raw-moment one), the ' +
      'e19/e20 flip is an artifact of the raw-moment operators cancelling denominator, NOT a genuine ' +
      'sub-ULP degeneracy of the argmax: the stable selection is the numerically correct one at both rungs, ' +
      'and the tie-fragile label marks operator sensitivity, not an undecidable argmax.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). CROSS-VALIDATES the imp-34250 tie-fragile {e=19, e=20} ' +
    'deep-ladder classification against a THIRD, higher-precision compensated (Kahan-summed) OLS ' +
    'estimator. A from-source reimplementation (mirroring imp-34250 channels, stable + raw-moment OLS, ' +
    'top-two argmax on the imp-34172 [8.72, 8.94] window) adds a Kahan-compensated mean-centred OLS and ' +
    'measures its argmax at both tie-fragile rungs. The Kahan operator RESCUES the stable argmax at e=19 ' +
    '(k=8.821090698200) and e=20 (k=8.821091651900) -- agreeing with the naive stable OLS and DIFFERING ' +
    'from the raw-moment argmax (k=8.821092605600), so it does NOT reproduce the raw-moment flip. Its ' +
    'pSigma disagreement with the stable operator (~2.78e-17 at e=19, exactly 0 at e=20) is ~450x smaller ' +
    'than the raw-moment ~1.2e-14 perturbation and sits below the top-two margin (3.64e-15, 1.46e-14), so ' +
    'it cannot flip the tie. Conclusion: the e19/e20 tie-fragility is an artifact of the inferior ' +
    'raw-moment operators cancelling denominator, NOT a genuine sub-ULP degeneracy -- the stable selection ' +
    'is the numerically correct argmax at both rungs. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34250 (the two-estimator tie-fragile classification cross-validated here); imp-34172 (Y2 measured ' +
    'the e=19 tie margin); imp-34106 (the deep e=15..20 ladder); imp-33878 (source of k* ~ 8.821092, ' +
    'reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION_ASSERTIONS = [
  {
    // (W1) The Kahan estimator is tabulated at both imp-34250 tie-fragile rungs e=19 and e=20.
    id: 'imp34325-kahan-tabulated-both-fragile-rungs',
    description: 'the Kahan-summed argmax, raw + kahan perturbation and classification are tabulated at both tie-fragile rungs e=19,e=20',
    holds: () =>
      RUNGS.length === 2 &&
      RUNGS.map((r) => r.exponent).join(',') === '19,20' &&
      RUNGS.every((r) => Number.isFinite(r.kahanPerturbation) && Number.isFinite(r.rawPerturbation)) &&
      COVERS_IMP34250_FRAGILE_SET,
  },
  {
    // (W1) The Kahan operator rescues the stable argmax at BOTH rungs (matches stable, differs from raw).
    id: 'imp34325-kahan-rescues-stable-both-rungs',
    description: 'the Kahan-summed OLS argmax equals the stable argmax and differs from the raw-moment argmax at both e=19 and e=20',
    holds: () =>
      KAHAN_RESCUES_BOTH &&
      RESCUED_EXPONENTS.join(',') === '19,20' &&
      CONFIRMED_FLIP_EXPONENTS.length === 0 &&
      RUNGS.every((r) => r.kahanMatchesStable && !r.kahanMatchesRaw),
  },
  {
    // (W2) The Kahan-vs-stable perturbation is far below the raw-moment perturbation at both rungs.
    id: 'imp34325-kahan-perturbation-below-raw-moment',
    description: 'the Kahan-vs-stable pSigma disagreement is strictly smaller than the ~1.2e-14 raw-moment perturbation at both rungs',
    holds: () =>
      KAHAN_PERT_BELOW_RAW &&
      RUNGS.every((r) => r.kahanPerturbation < r.rawPerturbation && r.rawPerturbation > 1e-15),
  },
  {
    // (W2/W3) The Kahan perturbation stays below the top-two margin, so it cannot flip the selection.
    id: 'imp34325-kahan-perturbation-below-margin',
    description: 'the Kahan perturbation sits below the top-two resid_exp margin at both rungs, so it cannot flip the stable selection',
    holds: () => KAHAN_PERT_BELOW_MARGIN && RUNGS.every((r) => r.kahanBelowMargin),
  },
  {
    // Honesty gate: measurement only, isRigorous false, cross-validates imp-34250, no QED, no refereed bound is changed.
    id: 'imp34325-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, CROSS-VALIDATES the imp-34250 tie-fragile classification with a Kahan OLS, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.isRigorous === false &&
      /CROSS-VALIDATES the imp-34250 tie-fragile \{e=19, e=20\}/.test(
        IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict,
      ) &&
      /NO QED/.test(IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34325_DEEP_LADDER_KAHAN_OLS_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34325-deep-ladder-kahan-ols-crossvalidation assertion failed: ${a.id}`);
  }
}
