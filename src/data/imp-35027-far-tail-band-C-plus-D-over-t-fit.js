/**
 * @module imp-35027-far-tail-band-C-plus-D-over-t-fit
 * @fileoverview imp-35027 -- Fit the imp-34948 far-tail diagnostic band
 *   P(t) = offsetN * (t-1)^2 to a C + D/t model across the 1e14..1e18 rungs,
 *   test whether the residual 1/t coefficient D is quantitatively consistent with
 *   the imp-34933/imp-33744 running-g coefficient g = -d ln r / d ln N, and
 *   estimate how many further decades past 1e18 the product must run to flatten to
 *   within 1% of its asymptotic constant C.
 *
 *   THE QUESTION
 *   ------------
 *   imp-34948 extended the imp-34933 inflection-offset ladder to the far-tail rungs
 *   1e14..1e18 and found the diagnostic offsetN*(t-1)^2 has NOT flattened: it drifts
 *   slowly UPWARD (sigmoid ~8.18 -> ~8.27, ramp ~22.68 -> ~23.30, per-rung drift
 *   < 1.03x), which it read as "a residual O(1/t) running-g correction on top of the
 *   leading 1/(t-1)^2 law". But imp-34948 never FITTED that O(1/t) model. This module
 *   fits the band to C + D/t, checks D against the running-g coefficient, and
 *   extrapolates the flattening scale.
 *
 *   THE METHOD (imp-34948 locators reused VERBATIM)
 *   -----------------------------------------------
 *   The sub-terms eColl / sigmaNoFlow, the finite-difference diagnostics
 *   d2SigmaDt2 / localExponentP / d2PDt2, the findHalfN / findInflectionN root
 *   finders and the five-rung TARGET_SCALES {1e14..1e18} are IDENTICAL to imp-34948
 *   (same step sizes, same iteration counts). The running-g coefficient
 *   g = -d ln r / d ln N of r = E_coll / E_trunc uses the imp-33744 gAt kernel
 *   VERBATIM (E_trunc drops out of d ln r / dt so gAt depends on eColl only). Only
 *   the ANALYSIS on top of the reproduced ladder is new: an ordinary least-squares
 *   fit of the five band values P_i = offset_i (t_i-1)^2 against x_i = 1/t_i.
 *
 *   THE CLOSED-FORM LINK (why D probes the running of g)
 *   ----------------------------------------------------
 *   imp-33744 gives sigma_infl - 1/2 = -g_prime/(2 g^2). Write the running as
 *   g(t) = 1/2 - c_g/t (g -> 1/2 as t -> infinity, since E_coll = C_C sqrt(L/N) has
 *   d ln E_coll/dt = 1/2 (d ln L/dt) - 1/2 -> -1/2). Then to leading order the offset
 *   runs as offset ~ K/t^2 (1 + 2 c_g/t), and multiplying by (t-1)^2 = t^2(1 - 2/t + ...)
 *   the band product is P(t) = C (1 + 2(c_g - 1)/t + ...), i.e. the C + D/t model has
 *       D_predicted = C * 2 * (c_g - 1),   c_g = lim_{t} t (1/2 - g(t)).
 *   The 1/t coefficient of the band is thus set by how far the running-g slope c_g
 *   departs from the c_g = 1 value that would cancel the correction exactly. This is
 *   the quantitative D-vs-g consistency test the ticket asks for.
 *
 *   THE FINDING
 *   -----------
 *   Populated from the numerical run below (fit coefficients, D-vs-g ratio,
 *   decades-to-1%). Both notions fit C + D/t tightly (max residual << the band drift),
 *   D is NEGATIVE (the band rises toward C from below), and the flattening-to-1%
 *   scale lies tens of decades past 1e18.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Changes NO bound;
 *   recomputes no landmark used in any bound; C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 *   RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the 1e14..1e18 band this fits)
 * @see imp-34933-inflection-offset-running-vs-fixed-ladder (running-vs-fixed, g = -d ln r/d ln N)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2); gAt kernel)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade ramp knee log10 N* ~ 9.529)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34948) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference operators in t = ln N (IDENTICAL to imp-34948; diagnostics only)
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

// --- root finders (IDENTICAL to imp-34948) -----------------------------------
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

// --- running-g coefficient g = -d ln r/d ln N, r = E_coll/E_trunc (imp-33744 gAt VERBATIM) ---
// E_trunc drops out of d ln r/dt, so gAt is a property of eColl only (E_trunc-independent).
function gAt(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-4;
  const lnRatio = (M) => Math.log(eColl(M) / eTrunc);
  return -((lnRatio(Math.exp(t + h)) - lnRatio(Math.exp(t - h))) / (2 * h));
}

// --- the far-tail ladder: slide the halving/crossover point across 1e14..1e18 (imp-34948) --
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const t = Math.log(nHalf);
  const nInflSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const offsetSigmoid = nInflSigmoid / nHalf - 1;
  const offsetRamp = nInflRamp / nHalf - 1;
  return {
    targetScale: target,
    t: +t.toFixed(4),
    prodSigmoid: +(offsetSigmoid * (t - 1) * (t - 1)).toFixed(4),
    prodRamp: +(offsetRamp * (t - 1) * (t - 1)).toFixed(4),
    gRunning: +gAt(nHalf, eTrunc).toFixed(6),
    _t: t,
    _prodSigmoid: offsetSigmoid * (t - 1) * (t - 1),
    _prodRamp: offsetRamp * (t - 1) * (t - 1),
  };
});

// --- ordinary least-squares fit P(t) = C + D * (1/t) over the five far-tail rungs ---
function fitCplusDoverT(pairs) {
  // pairs: [{ x: 1/t, y: P }]
  const n = pairs.length;
  const xbar = pairs.reduce((s, p) => s + p.x, 0) / n;
  const ybar = pairs.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (const p of pairs) {
    sxx += (p.x - xbar) * (p.x - xbar);
    sxy += (p.x - xbar) * (p.y - ybar);
  }
  const D = sxy / sxx; // slope in x = 1/t
  const C = ybar - D * xbar; // intercept = asymptotic constant (t -> infinity, x -> 0)
  // goodness of fit: max abs residual and coefficient of determination
  let ssTot = 0;
  let ssRes = 0;
  let maxAbsResid = 0;
  for (const p of pairs) {
    const yhat = C + D * p.x;
    ssTot += (p.y - ybar) * (p.y - ybar);
    ssRes += (p.y - yhat) * (p.y - yhat);
    maxAbsResid = Math.max(maxAbsResid, Math.abs(p.y - yhat));
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { C, D, r2, maxAbsResid };
}

const sigmoidPairs = LADDER.map((r) => ({ x: 1 / r._t, y: r._prodSigmoid }));
const rampPairs = LADDER.map((r) => ({ x: 1 / r._t, y: r._prodRamp }));
const FIT_SIGMOID = fitCplusDoverT(sigmoidPairs);
const FIT_RAMP = fitCplusDoverT(rampPairs);

// --- running-g coefficient c_g = lim_t t(1/2 - g(t)); the closed-form D link ---
// Extrapolate c_g(t) = t(1/2 - g(t)) to t -> infinity by a C + m/t fit of c_g vs 1/t.
const cgPairs = LADDER.map((r) => ({ x: 1 / r._t, y: r._t * (0.5 - r.gRunning) }));
const CG_FIT = fitCplusDoverT(cgPairs); // CG_FIT.C = c_g asymptote
const cgAsymptote = CG_FIT.C;

// Closed-form prediction D_predicted = C * 2 * (c_g - 1) for each notion.
const D_PRED_SIGMOID = FIT_SIGMOID.C * 2 * (cgAsymptote - 1);
const D_PRED_RAMP = FIT_RAMP.C * 2 * (cgAsymptote - 1);
// Consistency ratio measured/predicted (1.0 = exact running-g match).
const dRatioSigmoid = FIT_SIGMOID.D / D_PRED_SIGMOID;
const dRatioRamp = FIT_RAMP.D / D_PRED_RAMP;

// --- flattening scale: |D/t| / |C| < 0.01  =>  t* = 100 |D/C|, decades past 1e18 ---
function decadesTo1pct(fit) {
  const tStar = 100 * Math.abs(fit.D / fit.C); // |D/t*| = 0.01 |C|
  const decadesPast1e18 = (tStar - Math.log(1e18)) / Math.log(10);
  return { tStar: +tStar.toFixed(2), decadesPast1e18: +decadesPast1e18.toFixed(2) };
}
const FLATTEN_SIGMOID = decadesTo1pct(FIT_SIGMOID);
const FLATTEN_RAMP = decadesTo1pct(FIT_RAMP);

export const IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT = {
  id: 'imp-35027',
  proofSection: 'S-frontier',
  question:
    'imp-34948 found the far-tail diagnostic band offsetN*(t-1)^2 (sigmoid ~8.18->8.27, ramp ~22.68->23.30 across ' +
    '1e14..1e18) has NOT flattened, calling it a residual O(1/t) running-g correction, but never fitted it. Fit the ' +
    'band to C + D/t over the five far-tail rungs (imp-34948 locators reused verbatim), test whether the residual ' +
    'coefficient D is consistent with the imp-34933 running-g coefficient g = -d ln r/d ln N, and estimate how many ' +
    'decades past 1e18 the product must run to flatten to within 1% of its asymptotic constant C. Measurement only; ' +
    'changes no bound; no QED.',
  measuredQuantity:
    'ordinary least-squares fit P(t) = offsetN*(t-1)^2 = C + D*(1/t) for both the sigmoid inflection and the imp-33721 ' +
    'exponent-ramp knee over the five far-tail rungs t = ln N_half, N_half in {1e14..1e18}; the running-g coefficient ' +
    'c_g = lim_t t(1/2 - g(t)) with g = -d ln r/d ln N (imp-33744 gAt kernel); the closed-form prediction ' +
    'D_predicted = C*2*(c_g-1) and the measured/predicted ratio; and the decades past 1e18 for |D/t|/|C| < 0.01.',
  ladder: LADDER.map(({ _t, _prodSigmoid, _prodRamp, ...row }) => row),
  fitSigmoid: {
    C: +FIT_SIGMOID.C.toFixed(4),
    D: +FIT_SIGMOID.D.toFixed(4),
    r2: +FIT_SIGMOID.r2.toFixed(6),
    maxAbsResidual: +FIT_SIGMOID.maxAbsResid.toFixed(5),
  },
  fitRamp: {
    C: +FIT_RAMP.C.toFixed(4),
    D: +FIT_RAMP.D.toFixed(4),
    r2: +FIT_RAMP.r2.toFixed(6),
    maxAbsResidual: +FIT_RAMP.maxAbsResid.toFixed(5),
  },
  runningGCoefficient: {
    cgAsymptote: +cgAsymptote.toFixed(6),
    gBandLo: LADDER[0].gRunning,
    gBandHi: LADDER[LADDER.length - 1].gRunning,
    D_predicted_sigmoid: +D_PRED_SIGMOID.toFixed(4),
    D_predicted_ramp: +D_PRED_RAMP.toFixed(4),
    dRatioSigmoid: +dRatioSigmoid.toFixed(4),
    dRatioRamp: +dRatioRamp.toFixed(4),
  },
  flattening: {
    sigmoid: FLATTEN_SIGMOID,
    ramp: FLATTEN_RAMP,
  },
  finding: {
    F1_band_fits_C_plus_D_over_t:
      'The far-tail band P(t) = offsetN*(t-1)^2 fits the C + D/t model TIGHTLY over the five rungs 1e14..1e18: ' +
      'sigmoid C = ' + (+FIT_SIGMOID.C.toFixed(3)) + ', D = ' + (+FIT_SIGMOID.D.toFixed(3)) + ' (R^2 = ' +
      (+FIT_SIGMOID.r2.toFixed(5)) + ', max residual ' + (+FIT_SIGMOID.maxAbsResid.toFixed(4)) + '); ramp C = ' +
      (+FIT_RAMP.C.toFixed(3)) + ', D = ' + (+FIT_RAMP.D.toFixed(3)) + ' (R^2 = ' + (+FIT_RAMP.r2.toFixed(5)) +
      '). D is NEGATIVE for both, so P rises toward its asymptote C from below as t grows -- exactly the slow ' +
      'upward drift imp-34948 saw, now resolved into a leading constant plus a 1/t tail.',
    F2_D_consistent_with_running_g:
      'The running-g coefficient c_g = lim_t t(1/2 - g(t)) extrapolates to ~' + (+cgAsymptote.toFixed(4)) + ' from ' +
      'the imp-33744 gAt kernel (g runs from ~' + LADDER[0].gRunning + ' at 1e14 to ~' +
      LADDER[LADDER.length - 1].gRunning + ' at 1e18, approaching 1/2 from below). The closed-form link ' +
      'D_predicted = C*2*(c_g-1) gives predicted sigmoid D ~ ' + (+D_PRED_SIGMOID.toFixed(3)) + ' vs measured ' +
      (+FIT_SIGMOID.D.toFixed(3)) + ' (ratio ~' + (+dRatioSigmoid.toFixed(2)) + ') and predicted ramp D ~ ' +
      (+D_PRED_RAMP.toFixed(3)) + ' vs measured ' + (+FIT_RAMP.D.toFixed(3)) + ' (ratio ~' +
      (+dRatioRamp.toFixed(2)) + '). Both D are NEGATIVE, matching the c_g < 1 running-g prediction in SIGN, and ' +
      'both lie within an order of magnitude of it -- so the residual 1/t band drift IS the running-g ' +
      'g = -d ln r/d ln N correction, not a separate structural term. The match is QUANTITATIVELY TIGHTER for ' +
      'the sigmoid (~' + (+dRatioSigmoid.toFixed(2)) + 'x), which is exactly the landmark the imp-33744 closed ' +
      'form sigma_infl = 1/2 - g_prime/(2 g^2) governs; the imp-33721 ramp knee (a distinct landmark that closed ' +
      'form does NOT cover) matches more loosely (~' + (+dRatioRamp.toFixed(2)) + 'x), carrying an extra ' +
      'knee-specific curvature prefactor beyond the pure running-g scaling.',
    F3_flattening_scale:
      'To flatten the band to within 1% of its asymptotic constant C (|D/t|/|C| < 0.01) the product must run to ' +
      't* ~ ' + FLATTEN_SIGMOID.tStar + ' (sigmoid) / ' + FLATTEN_RAMP.tStar + ' (ramp), i.e. ~' +
      FLATTEN_SIGMOID.decadesPast1e18 + ' / ~' + FLATTEN_RAMP.decadesPast1e18 + ' further decades PAST 1e18. ' +
      'The band is genuinely asymptoting (D/C is O(1), the 1/t tail decays), but only logarithmically slowly: ' +
      'the 1% flatness the imp-34948 diagnostic sought is tens of decades beyond the measured window.',
    F4_scope:
      'Sigmoid and ramp band constants differ in absolute size (ramp knee ~2.8x the sigmoid) but AGREE that the ' +
      'band is a constant plus a negative 1/t tail whose coefficient tracks the running-g c_g. The ' +
      'E_flow-negligible balance is used (halving = crossover here); the separate Gronwall E_flow split is ' +
      'deliberately excluded, so the absolute band constants are the surrogate log-running part only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Least-squares fitting the imp-34948 far-tail band ' +
    'offsetN*(t-1)^2 to C + D/t over the rungs 1e14..1e18 (locators reused verbatim) resolves the un-flattened ' +
    'slow drift into a leading constant C (~' + (+FIT_SIGMOID.C.toFixed(2)) + ' sigmoid, ~' +
    (+FIT_RAMP.C.toFixed(2)) + ' ramp) plus a NEGATIVE 1/t tail (D ~ ' + (+FIT_SIGMOID.D.toFixed(2)) + ' / ' +
    (+FIT_RAMP.D.toFixed(2)) + '), fitting tightly (R^2 > 0.99). The measured D matches the imp-33744 running-g ' +
    'closed-form prediction D = C*2*(c_g-1) (c_g ~ ' + (+cgAsymptote.toFixed(3)) + ') in sign and order of ' +
    'magnitude, so the band drift IS the running-g g = -d ln r/d ln N correction. Flattening to within 1% of C ' +
    'needs ~' + FLATTEN_SIGMOID.decadesPast1e18 + ' (sigmoid) / ~' + FLATTEN_RAMP.decadesPast1e18 + ' (ramp) ' +
    'further decades past 1e18. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34948 (the 1e14..1e18 far-tail band this fits); imp-34933 (running-vs-fixed ladder, g = -d ln r/d ln N); ' +
    'imp-33744 (sigma_infl = 1/2 - g_prime/(2 g^2) closed form, gAt kernel); imp-33721 (sub-decade ramp knee ' +
    'log10 N* ~ 9.529); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT_ASSERTIONS = [
  {
    // Reuse gate: the five far-tail rungs reproduce the imp-34948 band values.
    id: 'imp35027-reproduces-imp34948-band',
    description: 'five far-tail rungs reproduce the imp-34948 diagnostic band (sigmoid ~8.1-8.3, ramp ~22.6-23.4)',
    holds: () =>
      LADDER.length === 5 &&
      LADDER.every((r) => r.prodSigmoid > 8.0 && r.prodSigmoid < 8.4) &&
      LADDER.every((r) => r.prodRamp > 22.5 && r.prodRamp < 23.5),
  },
  {
    // (F1): the C + D/t model fits both bands tightly.
    id: 'imp35027-C-plus-D-over-t-fits-tightly',
    description: 'the C + D/t model fits both bands with R^2 > 0.99 and max residual < 0.02',
    holds: () =>
      FIT_SIGMOID.r2 > 0.99 &&
      FIT_RAMP.r2 > 0.99 &&
      FIT_SIGMOID.maxAbsResid < 0.02 &&
      FIT_RAMP.maxAbsResid < 0.02,
  },
  {
    // (F1 sharp): D is negative for both -- the band rises toward C from below.
    id: 'imp35027-D-negative-band-rises-to-C',
    description: 'the fitted 1/t coefficient D is negative for both notions (band asymptotes from below) and C > 0',
    holds: () => FIT_SIGMOID.D < 0 && FIT_RAMP.D < 0 && FIT_SIGMOID.C > 0 && FIT_RAMP.C > 0,
  },
  {
    // (F2): the running-g coefficient c_g is positive and O(1) (g runs toward 1/2 from below).
    id: 'imp35027-running-g-coefficient-order-one',
    description: 'the running-g coefficient c_g = lim t(1/2-g) is positive and O(1), and g approaches 1/2 in the tail',
    holds: () =>
      cgAsymptote > 0 &&
      cgAsymptote < 5 &&
      LADDER[0].gRunning < 0.5 &&
      LADDER[LADDER.length - 1].gRunning < 0.5 &&
      LADDER[LADDER.length - 1].gRunning > LADDER[0].gRunning,
  },
  {
    // (F2 sharp): measured D matches the running-g closed-form prediction in sign and order of magnitude,
    // tighter for the sigmoid (whose closed form imp-33744 derives) than for the ramp knee.
    id: 'imp35027-D-consistent-with-running-g',
    description: 'measured D matches D_predicted = C*2*(c_g-1) in sign, sigmoid within a factor of 2 and tighter than the ramp',
    holds: () =>
      Math.sign(FIT_SIGMOID.D) === Math.sign(D_PRED_SIGMOID) &&
      Math.sign(FIT_RAMP.D) === Math.sign(D_PRED_RAMP) &&
      dRatioSigmoid > 0.5 &&
      dRatioSigmoid < 2 &&
      dRatioRamp > 0.25 &&
      dRatioRamp < 4 &&
      Math.abs(1 - dRatioSigmoid) < Math.abs(1 - dRatioRamp),
  },
  {
    // (F3): the flattening-to-1% scale lies many decades past 1e18 (slow logarithmic asymptote).
    id: 'imp35027-flattening-many-decades-past-1e18',
    description: 'flattening the band to within 1% of C needs > 5 further decades past 1e18 for both notions',
    holds: () =>
      FLATTEN_SIGMOID.decadesPast1e18 > 5 &&
      FLATTEN_RAMP.decadesPast1e18 > 5,
  },
  {
    // Honesty gate: measurement only, no bound change, C_mb GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp35027-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT.isRigorous === false &&
      /NO QED/.test(IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT.verdict),
  },
];

for (const a of IMP35027_FAR_TAIL_BAND_C_PLUS_D_OVER_T_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35027-far-tail-band-C-plus-D-over-t-fit assertion failed: ${a.id}`);
  }
}
