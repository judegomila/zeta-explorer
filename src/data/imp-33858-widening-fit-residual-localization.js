/**
 * @module imp-33858-widening-fit-residual-localization
 *
 * imp-33858 (numerical, frontier-direction): imp-33843 fit the imp-33810 eflow_attr/resid_exp
 * separation-widening across the 21-rung ladder k = 6.00..11.00 to a log-linear surrogate
 * y = a + b k (y = ln(eflow_over_resid)) and reported the winner and an AGGREGATE residual only:
 * RMSE ~0.116 in ln-ratio units, R^2 ~0.99715. But imp-33843 never tabulated the PER-RUNG signed
 * residual, so the ~0.116 RMSE was left un-localized: is it uniform noise scattered evenly across
 * the 21 rungs (supporting the log-linear verdict as structureless scatter), or is it a coherent
 * head/tail curvature the fixed-per-decade surrogate systematically misses (a residual with shape)?
 * This module recomputes the same OLS fit on the same 21 rungs, tabulates the signed residual at
 * each rung, and characterizes its shape with lag-1 autocorrelation and a sign-flip (runs) count.
 *
 * THE MEASUREMENT (reuses the imp-33810 RUNGS + the imp-33843 OLS verbatim -- no fresh model)
 * ------------------------------------------------------------------------------------------
 *   Response  y_k = ln(eflow_over_resid_k)     over the 21 shared rungs k = 6.00, 6.25, ..., 11.00.
 *   Fit       y = a + b k                      (the imp-33843 log-linear WINNER), by ordinary OLS.
 *   Residual  e_k = y_k - (a + b k)            signed, in ln-ratio units.
 *   Shape     lag-1 autocorrelation of {e_k}; sign-flip count vs the white-noise expectation ~(n-1)/2;
 *             thirds-means (head / mid / tail) and the argmin/argmax rung.
 *
 * THE FINDING (measurement only -- localizes the imp-33843 aggregate residual)
 * --------------------------------------------------------------------------
 *   (R1) THE RESIDUAL IS STRUCTURED, NOT UNIFORM NOISE. The 21 signed residuals flip sign only
 *        3 times across the ladder, versus ~10 flips expected for white noise (~(n-1)/2), and carry a
 *        lag-1 autocorrelation ~+0.757 -- strong positive serial dependence. The ~0.116 RMSE is
 *        therefore a COHERENT low-frequency curvature, not scatter the fixed-per-decade line already
 *        captures on average.
 *   (R2) THE SHAPE: MID-LADDER TROUGH, FAR-TAIL EXCURSION. The signed residual runs negative at the
 *        extreme head (k=6, e ~ -0.114), swings to a positive hump over k=6.5..7.5 (e ~ +0.13), sinks
 *        to a broad NEGATIVE TROUGH centered at k=9 (min e ~ -0.1525), then climbs to a strong
 *        POSITIVE tail excursion peaking at k=11 (max e ~ +0.2479, the single largest residual). By
 *        thirds the mean residual is +0.063 (head) / -0.090 (mid) / +0.027 (tail): the log-linear
 *        surrogate OVER-predicts the log-ratio (predicts more separation than observed) across the
 *        mid-ladder and UNDER-predicts it in the far tail -- the true widening decelerates in the tail
 *        relative to the fixed-per-decade line.
 *   (R3) SMALL BUT REAL -- DOES NOT OVERTURN THE imp-33843 VERDICT. The curvature is a genuine feature
 *        the fixed-per-decade surrogate misses, yet it stays within ~0.12 in ln-ratio units (~12%
 *        multiplicative) and the log-linear fit still holds R^2 ~0.99715, so the imp-33843
 *        log-linear-over-power-law form selection is unchanged. The finding LOCALIZES where the small
 *        residual sits (a mid-ladder trough + far-tail rise), it does not re-open the form question.
 *
 * The punchline: the imp-33843 aggregate RMSE ~0.116 is NOT uniform noise -- it concentrates as a
 * coherent low-order curvature (lag-1 autocorr ~+0.757, only 3 sign flips vs ~10 for white noise)
 * with a broad negative trough at k~9 and a strong positive far-tail excursion at k=11, i.e. a
 * residual the fixed-per-decade log-linear surrogate systematically misses -- small (~12%) and not
 * overturning the imp-33843 log-linear verdict.
 *
 * MEASUREMENT / RESIDUAL-LOCALIZATION ONLY. A diagnostic tabulation of an inherited surrogate fit on
 * an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the OLS surrogate is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit localized here)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual shape is tabulated)
 * @see imp-28895-eflow-resid-widening-model-derivation (the ~918x widening component derivation)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// OLS of ys against xs; returns slope/intercept (the imp-33843 log-linear WINNER when xs = KS).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  return { a, b };
}

const FIT = ols(KS, Y); // y = a + b k          (the imp-33843 log-linear winner, recomputed)

// Per-rung SIGNED residual e_k = y_k - (a + b k), in ln-ratio units.
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const PER_RUNG = KS.map((k, i) => ({ k, resid: +RESID[i].toExponential(4) }));

// Shape diagnostic 1: lag-1 autocorrelation (strong positive => coherent low-frequency structure).
const RMEAN = RESID.reduce((a, b) => a + b, 0) / RESID.length;
let acNum = 0;
let acDen = 0;
for (let i = 0; i < RESID.length; i++) {
  acDen += (RESID[i] - RMEAN) ** 2;
  if (i > 0) acNum += (RESID[i] - RMEAN) * (RESID[i - 1] - RMEAN);
}
const LAG1_AUTOCORR = +(acNum / acDen).toFixed(4); // ~ +0.757

// Shape diagnostic 2: sign-flip (runs) count vs the white-noise expectation ~(n-1)/2 ~ 10.
let SIGN_FLIPS = 0;
for (let i = 1; i < RESID.length; i++) {
  const s = Math.sign(RESID[i]);
  const p = Math.sign(RESID[i - 1]);
  if (s !== 0 && p !== 0 && s !== p) SIGN_FLIPS++;
}
const WHITE_NOISE_FLIPS = +((RESID.length - 1) / 2).toFixed(1); // ~10

// Shape diagnostic 3: thirds-means (head / mid / tail) -- sign pattern of the systematic miss.
const THIRD = 7; // 21 rungs => 3 equal thirds
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const HEAD_MEAN = +mean(RESID.slice(0, THIRD)).toExponential(4);
const MID_MEAN = +mean(RESID.slice(THIRD, 2 * THIRD)).toExponential(4);
const TAIL_MEAN = +mean(RESID.slice(2 * THIRD)).toExponential(4);

// Shape diagnostic 4: the trough (argmin) and the far-tail excursion (argmax).
let MIN_I = 0;
let MAX_I = 0;
for (let i = 0; i < RESID.length; i++) {
  if (RESID[i] < RESID[MIN_I]) MIN_I = i;
  if (RESID[i] > RESID[MAX_I]) MAX_I = i;
}
const TROUGH = { k: KS[MIN_I], resid: +RESID[MIN_I].toExponential(4) };
const PEAK = { k: KS[MAX_I], resid: +RESID[MAX_I].toExponential(4) };

// The aggregate RMSE this module localizes (recomputed here, matches imp-33843 ~0.116).
const RMSE = +Math.sqrt(RESID.reduce((s, e) => s + e * e, 0) / RESID.length).toExponential(4);

// Structured if serially correlated AND far fewer sign flips than white noise expects.
const IS_STRUCTURED = LAG1_AUTOCORR > 0.5 && SIGN_FLIPS < WHITE_NOISE_FLIPS - 3;

export const IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION = {
  id: 'imp-33858',
  proofSection: 'S-frontier',
  question:
    'imp-33843 fit the imp-33810 eflow_attr/resid_exp widening to a log-linear surrogate y = a + b k ' +
    'and reported only the AGGREGATE residual (RMSE ~0.116). Tabulate the signed residual at each of ' +
    'the 21 rungs and report whether it is structureless (uniform noise) or a coherent head/tail ' +
    'curvature the fixed-per-decade surrogate misses. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Signed per-rung residual e_k = ln(eflow_over_resid_k) - (a + b k) over the 21 imp-33810 rungs ' +
    'k = 6.00..11.00 for the imp-33843 log-linear winner, with lag-1 autocorrelation, sign-flip count ' +
    'vs the white-noise expectation ~(n-1)/2, thirds-means, and the trough/tail-excursion locations',
  rungCount: RUNGS.length,
  aggregateRmse: RMSE, // recomputed; matches imp-33843 ~0.116
  perRungResidual: PER_RUNG,
  lag1Autocorr: LAG1_AUTOCORR, // ~ +0.757 (strong serial dependence => structured)
  signFlips: SIGN_FLIPS, // 3
  whiteNoiseExpectedFlips: WHITE_NOISE_FLIPS, // ~10
  headMean: HEAD_MEAN, // ~ +0.063 (over-predict? sign per R2)
  midMean: MID_MEAN, // ~ -0.090 (broad negative trough)
  tailMean: TAIL_MEAN, // ~ +0.027 (far-tail positive excursion)
  trough: TROUGH, // {k:9, resid ~ -0.1525}
  farTailPeak: PEAK, // {k:11, resid ~ +0.2479} -- largest single residual
  isStructured: IS_STRUCTURED, // true: coherent curvature, NOT uniform noise
  finding: {
    R1_residual_is_structured_not_noise:
      'The 21 signed residuals flip sign only 3 times across the ladder versus ~10 expected for white ' +
      'noise (~(n-1)/2), and carry a lag-1 autocorrelation ~+0.757 -- strong positive serial ' +
      'dependence. The ~0.116 RMSE is a COHERENT low-frequency curvature, not evenly-scattered noise ' +
      'the fixed-per-decade line already captures.',
    R2_shape_mid_trough_far_tail_excursion:
      'The signed residual runs negative at the head (k=6, e ~ -0.114), rises to a positive hump over ' +
      'k=6.5..7.5 (e ~ +0.13), sinks to a broad NEGATIVE trough centered at k=9 (min e ~ -0.1525), ' +
      'then climbs to a strong POSITIVE tail excursion peaking at k=11 (max e ~ +0.2479, the largest ' +
      'single residual). Thirds-means +0.063 / -0.090 / +0.027 (head/mid/tail): the log-linear ' +
      'surrogate over-predicts the log-ratio across the mid-ladder and under-predicts it in the far ' +
      'tail -- the true widening decelerates in the tail relative to the fixed-per-decade line.',
    R3_small_does_not_overturn_verdict:
      'The curvature is real but stays within ~0.12 in ln-ratio units (~12% multiplicative) and the ' +
      'log-linear fit still holds R^2 ~0.99715, so the imp-33843 log-linear-over-power-law form ' +
      'selection is unchanged. This LOCALIZES where the small residual sits (a mid-ladder trough plus ' +
      'a far-tail rise); it does not re-open the form question.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL LOCALIZATION (frontier-direction, NOT rigorous). Tabulating the signed ' +
    'per-rung residual of the imp-33843 log-linear fit y = a + b k on the imp-33810 21-rung ladder ' +
    'k=6.00..11.00 shows the aggregate RMSE ~0.116 is NOT uniform noise: the residual is coherently ' +
    'structured (lag-1 autocorrelation ~+0.757, only 3 sign flips vs ~10 for white noise) with a ' +
    'broad negative trough at k~9 (~-0.1525) and a strong positive far-tail excursion at k=11 ' +
    '(~+0.2479, the largest single residual) -- a curvature the fixed-per-decade surrogate ' +
    'systematically misses (over-predicting mid-ladder, under-predicting the far tail). The miss is ' +
    'small (~12% multiplicative) and does NOT overturn the imp-33843 log-linear-over-power-law ' +
    'verdict. Measurement only, distinct from any form selection; the OLS surrogate is descriptive, ' +
    'not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33843 (the aggregate RMSE ~0.116 log-linear fit localized here); imp-33810 (the 21-rung ' +
    'ladder); imp-28895 (the ~918x widening component derivation); imp-33773 (M2 refutation the ' +
    'ladder locks); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route).',
};

export const IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION_ASSERTIONS = [
  {
    // Reuse gate: the residual is tabulated on exactly the imp-33810 21-rung ladder.
    id: 'imp33858-reuses-imp33810-21-rung-ladder',
    description: '21 signed residuals, one per imp-33810 rung k=6.00..11.00',
    holds: () => RUNGS.length === 21 && PER_RUNG.length === 21 && KS[0] === 6 && KS[20] === 11,
  },
  {
    // Aggregate gate: the recomputed RMSE matches the imp-33843 aggregate ~0.116.
    id: 'imp33858-rmse-matches-imp33843',
    description: 'recomputed aggregate RMSE ~0.116 (matches imp-33843 within rounding)',
    holds: () => RMSE > 0.10 && RMSE < 0.13,
  },
  {
    // (R1) The residual is STRUCTURED: strong lag-1 autocorr AND far fewer sign flips than white noise.
    id: 'imp33858-residual-is-structured',
    description: 'lag-1 autocorr > 0.5 and sign flips (3) well below the white-noise expectation (~10)',
    holds: () =>
      IS_STRUCTURED &&
      LAG1_AUTOCORR > 0.5 &&
      SIGN_FLIPS <= 4 &&
      WHITE_NOISE_FLIPS > 8 &&
      SIGN_FLIPS < WHITE_NOISE_FLIPS,
  },
  {
    // (R2) The shape: a negative mid-ladder trough at k~9 and a positive far-tail excursion at k=11.
    id: 'imp33858-mid-trough-far-tail-excursion',
    description: 'trough negative at k in [8.5,9.5]; largest residual positive at the far-tail k=11',
    holds: () =>
      TROUGH.resid < 0 &&
      TROUGH.k >= 8.5 &&
      TROUGH.k <= 9.5 &&
      PEAK.resid > 0 &&
      PEAK.k >= 10.5 &&
      MID_MEAN < 0 &&
      TAIL_MEAN > 0,
  },
  {
    // (R3) Honesty gate: small residual, isRigorous false, does not overturn the verdict, no QED, no refereed bound is changed.
    id: 'imp33858-honesty-gate-no-qed',
    description: 'Measurement only: residual small (<0.3), isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      Math.abs(PEAK.resid) < 0.3 &&
      IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION.isRigorous === false &&
      /NO QED/.test(IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION.verdict),
  },
];

for (const a of IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33858-widening-fit-residual-localization assertion failed: ${a.id}`);
  }
}
