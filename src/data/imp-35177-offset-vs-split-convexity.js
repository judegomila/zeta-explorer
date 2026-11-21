/**
 * @module imp-35177-offset-vs-split-convexity
 * @fileoverview imp-35177 -- Test whether the imp-35042 sigmoid-inflection knee
 *   OFFSET (N_star displaced above the halving landmark by the running-rate margin
 *   2 g_prime/g^3, g_prime > 0) and the imp-35132 ~0.064 between-landmark far-tail
 *   decay-exponent SPLIT are two readings of the SAME running-rate convexity, or two
 *   DIFFERENT functionals of it. imp-35042 concluded the sigmoid-inflection offset is
 *   STRUCTURAL, set by the running of the logistic rate g_prime; imp-35132 concluded
 *   the ~0.064 ramp-vs-sigmoid split is NOT running-g (common to both landmarks,
 *   imp-35028) but the ramp-vs-sigmoid DEFINITIONAL curvature-operator difference (C3).
 *   Taken naively these two attributions look like they might be pointing at the same
 *   thing (both invoke curvature of the ramp); this module decides it on the surrogate.
 *
 *   THE SETUP (surrogate IDENTICAL to imp-35132 / imp-34948 / imp-35028)
 *   -------------------------------------------------------------------
 *     sigma = E_coll/(E_trunc + E_coll),  E_coll = C_C sqrt(L/N), L = log T0(N),
 *     E_flow == 0 (imp-34948 E_flow-negligible balance: halving = crossover).
 *   Logistic variable u = ln(E_coll/E_trunc) makes sigma = 1/(1+e^{-u}) EXACTLY; the
 *   running rate g = -du/dt and its running g_prime = -u_dbl (t = ln N) are the
 *   imp-35042 objects. On the same five far-tail rungs N_half in {1e14..1e18} that
 *   imp-35132 uses, this module locates BOTH landmarks with their verbatim operators --
 *   the sigmoid inflection (d2 sigma/dt2 = 0) and the ramp knee (d2 p/dt2 = 0,
 *   p = -d ln sigma/dt) -- and measures each offset from halving against g_prime/g^3.
 *
 *   THE MEASUREMENT
 *   ---------------
 *   (M1) BOTH offsets are g_prime/g^3 displacements. Writing conv = g_prime/g^3, the
 *        sigmoid offset off_sig = nInflSigmoid/nHalf - 1 satisfies off_sig/conv ~ 2.005
 *        across all five rungs -- i.e. off_sig = 2 g_prime/g^3, reproducing the imp-35042
 *        closed margin to the third digit. The ramp offset off_ramp/conv ~ 5.6, a
 *        DIFFERENT but equally near-constant definitional coefficient. So the ramp knee
 *        is ALSO a running-rate-convexity displacement -- same g_prime/g^3 factor, larger
 *        coefficient. Running-rate convexity is the COMMON magnitude driver of BOTH
 *        operators displacements.
 *   (M2) THE SPLIT IS WHERE g_prime CANCELS. The imp-35132 split is the log-log slope of
 *        the offset RATIO off_ramp/off_sig = coef_ramp/coef_sig ~ 2.78. Since both offsets
 *        carry the SAME conv = g_prime/g^3, that factor CANCELS in the ratio: across the
 *        band g_prime falls ~1.62x (4.74e-4 -> 2.93e-4) while the ratio drifts only ~1.63%
 *        (2.7734 -> 2.8186). The residual ~0.064 split (0.06431, matching imp-35132) is
 *        the slow drift of the DEFINITIONAL coefficient ratio, NOT a reading of g_prime.
 *
 *   THE VERDICT (derivation + measurement)
 *   --------------------------------------
 *   The offset and the split are NOT two readings of the same running-rate convexity;
 *   they are COMPLEMENTARY functionals of it. The imp-35042 OFFSET is the part that
 *   CARRIES g_prime -- its magnitude is 2 g_prime/g^3 (sigmoid) or ~5.6 g_prime/g^3
 *   (ramp), each scaling directly with the running-rate convexity. The imp-35132 SPLIT is
 *   the part where g_prime DROPS OUT -- a ratio of two g_prime-proportional offsets,
 *   leaving only the definitional coefficient ratio (2.78) and its ~1.6% drift. This
 *   RECONCILES the two prior findings with NO contradiction: g_prime > 0 is the common
 *   magnitude driver behind BOTH the sigmoid and ramp displacements (extending imp-35042's
 *   structural verdict to the ramp knee), and it cancels in the ratio that DEFINES the
 *   split -- which is exactly why imp-35132 correctly ruled the split as definitional
 *   (C3), NOT running-g. The offset reads g_prime; the split is g_prime-independent.
 *
 *   DERIVATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Reuses
 *   the imp-35132 / imp-34948 locators verbatim. Changes NO bound; recomputes no landmark
 *   used in any bound; C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 *   (imp-3463); no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35042-inflection-crossover-offset-structural (N_star offset = 2 g_prime/g^3, structural)
 * @see imp-35132-split-attribution (the ~0.064 split; C3 definitional attribution, running-g ruled out)
 * @see imp-35028-running-g-ramp-vs-sigmoid-split (both landmarks on the same running-g to ~1.45e-5)
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the far-tail split; locators reused verbatim)
 * @see imp-33808-oneovert2-inflection-separation-derivation (sigma_I = 1/2 - g_prime/(2 g^2))
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- surrogate sub-terms (IDENTICAL to imp-34948 / imp-35028 / imp-35132) ------
// sigmaNoFlow carries NO E_flow (Gronwall) term -- E_flow-negligible balance.
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// Logistic variable u (exact, E_flow == 0): sigma = 1/(1+exp(-u)), g = -du/dt, g_prime = -u_dbl.
function uOf(N, eTrunc) {
  return Math.log(eColl(N) / eTrunc);
}
function gAt(N, eTrunc, h = 1e-2) {
  const t = Math.log(N);
  return -((uOf(Math.exp(t + h), eTrunc) - uOf(Math.exp(t - h), eTrunc)) / (2 * h));
}
function gPrimeAt(N, eTrunc, h = 1e-2) {
  const t = Math.log(N);
  return -((uOf(Math.exp(t + h), eTrunc) - 2 * uOf(N, eTrunc) + uOf(Math.exp(t - h), eTrunc)) / (h * h));
}

// finite-difference curvature diagnostics in t = ln N (IDENTICAL to imp-34948 / imp-35132)
function d2SigmaDt2(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sigmaNoFlow(Math.exp(tt), eTrunc);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}
function localExponentP(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const ls = (tt) => Math.log(sigmaNoFlow(Math.exp(tt), eTrunc));
  return -((ls(t + h) - ls(t - h)) / (2 * h));
}
function d2PDt2(N, eTrunc) {
  const t = Math.log(N);
  const h = 2e-3;
  return (
    (localExponentP(Math.exp(t + h), eTrunc) -
      2 * localExponentP(Math.exp(t), eTrunc) +
      localExponentP(Math.exp(t - h), eTrunc)) /
    (h * h)
  );
}

// --- root finders (IDENTICAL to imp-34948 / imp-35132) ------------------------
function findHalfN(eTrunc) {
  let lo = Math.log(1e2);
  let hi = Math.log(1e20);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaNoFlow(Math.exp(mid), eTrunc) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function findInflectionN(diag, center) {
  let lo = Math.log(center / 1e3);
  let hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// --- the far-tail ladder (imp-35132 / imp-34948 TARGET_SCALES verbatim) --------
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const g = gAt(nHalf, eTrunc);
  const gPrime = gPrimeAt(nHalf, eTrunc);
  const conv = gPrime / (g * g * g); // the g_prime/g^3 running-rate-convexity factor
  const nInflSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const offsetSigmoid = nInflSigmoid / nHalf - 1;
  const offsetRamp = nInflRamp / nHalf - 1;
  return {
    targetScale: target,
    t: +Math.log(nHalf).toFixed(4),
    gPrime,
    conv,
    // (M1) each offset divided by g_prime/g^3 is a near-constant DEFINITIONAL coefficient
    coefSigmoid: offsetSigmoid / conv, // ~ 2.005 -> reproduces imp-35042 margin 2 g_prime/g^3
    coefRamp: offsetRamp / conv, // ~ 5.6  -> the ramp knee is ALSO a g_prime/g^3 displacement
    offsetRatioRampOverSigmoid: offsetRamp / offsetSigmoid, // = coefRamp/coefSigmoid ~ 2.78
    _offsetSigmoid: offsetSigmoid,
    _offsetRamp: offsetRamp,
  };
});

const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const lnTspan = Math.log(HI.t / LO.t);

// (M1) definitional coefficients: sigmoid ~ 2 (imp-35042), ramp ~ 5.6, each near-constant band-wide
const coefSigmoidMean = LADDER.reduce((s, r) => s + r.coefSigmoid, 0) / LADDER.length;
const coefRampMean = LADDER.reduce((s, r) => s + r.coefRamp, 0) / LADDER.length;
const coefSigmoidSpreadFrac =
  (Math.max(...LADDER.map((r) => r.coefSigmoid)) - Math.min(...LADDER.map((r) => r.coefSigmoid))) / coefSigmoidMean;
const coefRampSpreadFrac =
  (Math.max(...LADDER.map((r) => r.coefRamp)) - Math.min(...LADDER.map((r) => r.coefRamp))) / coefRampMean;

// (M2) the split == log-log slope of the offset ratio, and g_prime CANCELS in that ratio
const decayExpSigmoid = Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / lnTspan; // ~ -2.013
const decayExpRamp = Math.log(HI._offsetRamp / LO._offsetRamp) / lnTspan; // ~ -1.949
const exponentSplit = Math.abs(decayExpSigmoid - decayExpRamp); // ~ 0.0643 (imp-35132)
const ratioLo = LO.offsetRatioRampOverSigmoid;
const ratioHi = HI.offsetRatioRampOverSigmoid;
const ratioBandDriftPct = (ratioHi / ratioLo - 1) * 100; // ~ 1.63%
const gPrimeBandDropFactor = LO.gPrime / HI.gPrime; // ~ 1.62x -- g_prime moves a LOT ...
// ... while the ratio drifts only ~1.6%, so g_prime cancels: the split is NOT a g_prime reading.
const gPrimeCancelsInRatio = gPrimeBandDropFactor > 1.3 && Math.abs(ratioBandDriftPct) < 3;

export const IMP35177_OFFSET_VS_SPLIT_CONVEXITY = {
  id: 'imp-35177',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35042 sigmoid-inflection knee OFFSET (N_star displaced above halving by the running-rate margin ' +
    '2 g_prime/g^3, g_prime > 0) and the imp-35132 ~0.064 ramp-vs-sigmoid far-tail decay-exponent SPLIT two ' +
    'readings of the SAME running-rate convexity, or two DIFFERENT functionals of it? Derive both offsets on the ' +
    'identical surrogate and cross-check the derived margin against the split. Derivation/measurement only; NO QED.',
  measuredQuantity:
    'on the five far-tail rungs N_half in {1e14..1e18} (imp-35132 locators verbatim): each landmark offset from ' +
    'halving divided by the running-rate-convexity factor g_prime/g^3 (the definitional coefficient); the offset ' +
    'ratio and its band-wide drift; and the band-wide fall of g_prime relative to that drift.',
  ladder: LADDER.map(({ _offsetSigmoid, _offsetRamp, gPrime, conv, ...row }) => ({
    ...row,
    gPrime: +gPrime.toExponential(4),
    coefSigmoid: +row.coefSigmoid.toFixed(4),
    coefRamp: +row.coefRamp.toFixed(4),
    offsetRatioRampOverSigmoid: +row.offsetRatioRampOverSigmoid.toFixed(5),
  })),
  // (M1) both offsets are g_prime/g^3 displacements with near-constant definitional coefficients
  coefSigmoidMean: +coefSigmoidMean.toFixed(4), // ~ 2.005 -> off_sig = 2 g_prime/g^3 (imp-35042)
  coefRampMean: +coefRampMean.toFixed(4), // ~ 5.6   -> off_ramp ~ 5.6 g_prime/g^3
  coefSigmoidSpreadFrac: +coefSigmoidSpreadFrac.toExponential(3), // < 1% band-wide
  coefRampSpreadFrac: +coefRampSpreadFrac.toExponential(3), // < 2% band-wide
  // (M2) the split lives in the coefficient RATIO, where g_prime cancels
  decayExponentSigmoid: +decayExpSigmoid.toFixed(4),
  decayExponentRamp: +decayExpRamp.toFixed(4),
  exponentSplit: +exponentSplit.toFixed(4), // ~ 0.0643 (matches imp-35132)
  offsetRatioLo: +ratioLo.toFixed(5),
  offsetRatioHi: +ratioHi.toFixed(5),
  offsetRatioBandDriftPct: +ratioBandDriftPct.toFixed(3), // ~ 1.63%
  gPrimeBandDropFactor: +gPrimeBandDropFactor.toFixed(4), // ~ 1.62x
  gPrimeCancelsInRatio,
  finding: {
    M1_both_offsets_are_gprime_over_gcubed_displacements:
      'Dividing each landmark offset from halving by conv = g_prime/g^3 gives a near-constant DEFINITIONAL ' +
      'coefficient: sigmoid ~ 2.005 (reproducing the imp-35042 closed margin 2 g_prime/g^3 to the third digit) ' +
      'and ramp ~ 5.6. Each coefficient varies < 2% across the 1e14..1e18 band. So the ramp knee is ALSO a ' +
      'running-rate-convexity displacement -- same g_prime/g^3 factor, larger coefficient. Running-rate ' +
      'convexity g_prime > 0 is the COMMON magnitude driver behind BOTH operators displacements.',
    M2_split_is_where_gprime_cancels:
      'The imp-35132 split is the log-log slope of the offset ratio off_ramp/off_sig = coef_ramp/coef_sig ~ 2.78. ' +
      'Because both offsets carry the SAME g_prime/g^3 factor, g_prime CANCELS in that ratio: across the band ' +
      'g_prime falls ~1.62x while the ratio drifts only ~1.63%. The residual ~0.0643 split (matching imp-35132) ' +
      'is the slow drift of the definitional coefficient ratio, NOT a reading of g_prime.',
    M3_offset_and_split_are_complementary_not_the_same_reading:
      'The offset and the split are NOT two readings of the same running-rate convexity -- they are ' +
      'COMPLEMENTARY functionals. The imp-35042 OFFSET is the part that CARRIES g_prime (magnitude ' +
      '2 g_prime/g^3 or ~5.6 g_prime/g^3); the imp-35132 SPLIT is the part where g_prime DROPS OUT (a ratio of ' +
      'two g_prime-proportional offsets, leaving the definitional coefficient ratio and its drift). This ' +
      'reconciles the two prior findings with NO contradiction: g_prime drives both displacements (extending ' +
      'imp-35042 structural to the ramp knee) and cancels in the ratio that defines the split -- exactly why ' +
      'imp-35132 ruled the split definitional (C3), NOT running-g.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). Cross-checking the imp-35042 sigmoid-inflection ' +
    'offset margin 2 g_prime/g^3 against the imp-35132 ~0.064 ramp-vs-sigmoid split on the identical surrogate: ' +
    'BOTH landmark offsets from halving are g_prime/g^3 displacements -- off_sig/(g_prime/g^3) ~ 2.005 (reproducing ' +
    'imp-35042 to the third digit) and off_ramp/(g_prime/g^3) ~ 5.6, each near-constant (< 2%) band-wide -- so the ' +
    'ramp knee is ALSO a running-rate-convexity displacement, extending imp-35042 structural to the ramp operator. ' +
    'The imp-35132 split is the log-log slope of the offset ratio off_ramp/off_sig ~ 2.78, in which the common ' +
    'g_prime/g^3 factor CANCELS: g_prime falls ~1.62x band-wide while the ratio drifts only ~1.63%, and the split ' +
    'reproduces to 0.0643. So the OFFSET and the SPLIT are NOT two readings of the same running-rate convexity ' +
    'but COMPLEMENTARY functionals -- the offset carries g_prime, the split is where g_prime drops out, leaving ' +
    'the definitional coefficient ratio. This reconciles imp-35042 (offset g_prime-driven) with imp-35132 (split ' +
    'definitional, running-g ruled out) with no contradiction. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'RECONCILES imp-35042 (N_star offset = 2 g_prime/g^3, running-rate-convexity driven) with imp-35132 (~0.064 ' +
    'split = definitional, running-g ruled out): g_prime is the common magnitude driver of BOTH the sigmoid and ' +
    'ramp displacements and cancels in the offset ratio that defines the split. What remains OPEN (deferred, not ' +
    'attempted here): (i) a closed form for the ramp coefficient ~5.6 (only the sigmoid coefficient 2 is derived, ' +
    'imp-33808) and hence a closed 2.78 ratio; (ii) the NEXT-order term governing the ~1.6% ratio drift that IS ' +
    'the split (a definitional convexity, not g_prime); and (iii) a rigorous PIN of C_mb below the GUE bound of 1 ' +
    '(imp-486), which the structural measurement does not discharge.',
  farTailExponent: 0.5, // imp-3463 asymptote
  citation:
    'imp-35042 (N_star offset = 2 g_prime/g^3, structural); imp-35132 (~0.064 split, C3 definitional, running-g ' +
    'ruled out); imp-35028 (both landmarks on the same running-g to ~1.45e-5); imp-34948 (far-tail split, ' +
    'locators reused verbatim); imp-33808 (closed sigma_I = 1/2 - g_prime/(2 g^2)); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35177_OFFSET_VS_SPLIT_CONVEXITY_ASSERTIONS = [
  {
    // Reuse gate: five far-tail rungs land, reproducing the imp-35132 exponents and ~0.064 split.
    id: 'imp35177-reproduces-imp35132-exponent-split',
    description: 'the far-tail exponents match imp-35132 (sigmoid near -2.013, ramp near -1.949, split ~0.0643)',
    holds: () =>
      LADDER.length === 5 &&
      Math.abs(decayExpSigmoid - -2.013) < 0.01 &&
      Math.abs(decayExpRamp - -1.949) < 0.01 &&
      Math.abs(exponentSplit - 0.0643) < 0.01,
  },
  {
    // (M1): the sigmoid offset reproduces the imp-35042 closed margin 2 g_prime/g^3.
    id: 'imp35177-sigmoid-coef-reproduces-imp35042-margin',
    description: 'off_sig/(g_prime/g^3) ~ 2 (imp-35042 closed margin 2 g_prime/g^3), near-constant (< 2%) band-wide',
    holds: () => Math.abs(coefSigmoidMean - 2) < 0.05 && coefSigmoidSpreadFrac < 0.02,
  },
  {
    // (M1): the ramp knee is ALSO a g_prime/g^3 displacement, larger near-constant definitional coefficient.
    id: 'imp35177-ramp-is-also-gprime-displacement',
    description: 'off_ramp/(g_prime/g^3) is a near-constant coefficient (~5.6) well above the sigmoid coefficient',
    holds: () =>
      coefRampMean > 5 && coefRampMean < 6.2 && coefRampSpreadFrac < 0.02 && coefRampMean > 2 * coefSigmoidMean,
  },
  {
    // (M2): the offset ratio = coefRamp/coefSigmoid ~ 2.78, matching the imp-35132 offset ratio.
    id: 'imp35177-offset-ratio-matches-imp35132',
    description: 'off_ramp/off_sig ~ 2.78 (matches imp-35132) and equals coefRamp/coefSigmoid',
    holds: () =>
      Math.abs(ratioLo - 2.78) < 0.1 &&
      Math.abs(ratioHi - 2.78) < 0.1 &&
      Math.abs(ratioLo - coefRampMean / coefSigmoidMean) < 0.05,
  },
  {
    // (M2 decisive): g_prime falls a LOT band-wide (~1.62x) while the ratio drifts a little (~1.6%) -- g_prime cancels.
    id: 'imp35177-gprime-cancels-in-the-split',
    description: 'g_prime falls > 1.3x band-wide while the offset ratio drifts < 3%: g_prime cancels in the split',
    holds: () =>
      gPrimeBandDropFactor > 1.3 &&
      ratioBandDriftPct > 0 &&
      ratioBandDriftPct < 3 &&
      gPrimeCancelsInRatio === true,
  },
  {
    // Honesty gate: derivation/measurement only, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp35177-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP35177_OFFSET_VS_SPLIT_CONVEXITY.isRigorous === false &&
      IMP35177_OFFSET_VS_SPLIT_CONVEXITY.farTailExponent === 0.5 &&
      typeof IMP35177_OFFSET_VS_SPLIT_CONVEXITY.subGap === 'string' &&
      /imp-486/.test(IMP35177_OFFSET_VS_SPLIT_CONVEXITY.subGap) &&
      /NO QED/.test(IMP35177_OFFSET_VS_SPLIT_CONVEXITY.verdict) &&
      /refereed bound is changed/i.test(IMP35177_OFFSET_VS_SPLIT_CONVEXITY.verdict),
  },
];

for (const a of IMP35177_OFFSET_VS_SPLIT_CONVEXITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35177-offset-vs-split-convexity assertion failed: ${a.id}`);
  }
}
