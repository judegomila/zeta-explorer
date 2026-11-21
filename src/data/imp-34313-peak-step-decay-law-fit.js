/**
 * @module imp-34313-peak-step-decay-law-fit
 *
 * imp-34313 (numerical, frontier-direction): imp-34234 reported that the endpoint-locked peak per-step
 * increment (the imp-33843 log-linear OLS argmax residual step) decays smoothly and strictly monotonically
 * 0.01592 -> 0.00568 across the tenth-decade receding-endpoint grid kEnd = 11.00..13.00, while the interior
 * trough step holds near-steady -- which is what drives the imp-34153/imp-34085 trough-overtakes-peak
 * crossover. imp-34234 characterised the trough-gains-on-peak GAP growth (R4) but NEVER fit the peak-step
 * decay itself: it is stated only as "smooth strictly-monotone 0.01592 -> 0.00568" with no form, rate, or
 * extrapolated asymptote.
 *
 * This module FITS that peak-step decay sequence (20 tenth-decade window-steps, midpoints 11.05..12.95) to
 * the three candidate decay forms named in the ticket -- GEOMETRIC (constant successive ratio, i.e.
 * exponential ln y = a + b*kEnd), POWER-LAW (ln y = a + b*ln kEnd, y ~ kEnd^-p), and LOG-LINEAR (y = a +
 * b*ln kEnd) -- plus a plain LINEAR baseline (y = a + b*kEnd), reports the best form by R^2, and extrapolates
 * its implied asymptote. It consumes the ALREADY-COMPUTED imp-34234 peakStepIncrements / stepMidpoints arrays
 * verbatim (no re-run of the effectiveHeightForN/C_C_PINNED ladder), so it inherits the identical surrogate.
 *
 * THE FIT (imp-34234 peak-step sequence reused verbatim; four candidate forms, OLS)
 * --------------------------------------------------------------------------------
 *   Data       y_i = peakStepIncrements[i] (0.01592 -> 0.00568), x_i = stepMidpoints[i] (11.05 -> 12.95),
 *              20 window-steps, all endpoint-locked argmax (imp-34234 allEndpointLocked = true).
 *   Ratios     r_i = y_i / y_{i-1}; a PURE geometric decay holds r_i constant.
 *   (A) geo    ln y = a + b*x  -> per-unit-kEnd ratio e^b, per-tenth-decade-step ratio e^{0.1 b}.
 *   (B) power  ln y = a + b*ln x -> y ~ x^b, exponent p = -b.
 *   (C) loglin y = a + b*ln x.
 *   (D) linear y = a + b*x (baseline; its root -a/b is the local kEnd at which the ramp hits zero).
 *
 * THE FINDING (form selection + asymptote; descriptive fit only)
 * -------------------------------------------------------------
 *   (F1) THE DECAY IS SUB-GEOMETRIC: THE SUCCESSIVE RATIO IS NOT CONSTANT, IT DECLINES. r_i falls from
 *        ~0.9698 (first step) to ~0.9251 (last step), mean ~0.9473 -- a pure geometric law would hold r_i
 *        flat. The ratio itself shrinking means the peak step decelerates FASTER than any single exponential:
 *        geometric is rejected as the generating form even though its overall R^2 is high.
 *   (F2) POWER-LAW IS THE WORST OF THE FOUR AND ITS EXPONENT IS SPURIOUS. Over the narrow band kEnd 11..13
 *        (< 0.1 decade of ln x span) the power fit gives R^2 ~ 0.9785 (lowest) and a huge exponent p ~ 6.47 --
 *        an artifact of forcing a power law onto a near-exponential ramp over a tiny ln-x window, not a real
 *        heavy-tail exponent.
 *   (F3) THE BEST DESCRIPTION IS A LINEAR / LOG-LINEAR RAMP-DOWN. y is very nearly linear in kEnd
 *        (R^2 ~ 0.99942), with log-linear a near-tie (R^2 ~ 0.99927); over this narrow band ln(kEnd) is itself
 *        nearly linear in kEnd so the two are numerically indistinguishable and BOTH far exceed geometric
 *        (0.98423) and power (0.97845). Ranking: linear >= log-linear >> geometric > power.
 *   (F4) THE IMPLIED ASYMPTOTE IS A LOCAL FINITE ZERO, NOT A DECAY-TO-ZERO AT INFINITY. The linear ramp
 *        extrapolates to peakStep = 0 at kEnd ~ 13.95 -- i.e. within the band the endpoint-locked peak step
 *        heads to zero at a FINITE receding endpoint, not asymptotically as kEnd -> infinity. This is a LOCAL
 *        band feature: imp-34308 already showed the argmax DE-PINS near kEnd ~ 15.4 (structural break, peak
 *        step reverses sign toward the surrogate pole k* ~ 21.281), so the linear-to-zero extrapolation is a
 *        descriptive tangent confined to the endpoint-locked band ~11..13(..~14), NOT a genuine kEnd->inf
 *        asymptote. The peak step does head to ~0 at the top of the band, but by a bounded linear ramp, not a
 *        geometric or power tail.
 *
 * RELATION TO imp-33843 (the widening form). The underlying eflow_over_resid ladder was fit LOG-LINEAR by
 * imp-33843; that this peak-step decay is itself best-fit linear/log-linear (and NOT power-law) is consistent
 * with the imp-33843 log-linear widening verdict -- the argmax residual step inherits the same log-linear
 * character of the parent ladder rather than a power-law tail. The imp-33843 verdict is untouched.
 *
 * The punchline: the imp-34234 peak-step decay 0.01592 -> 0.00568 is NOT geometric (its successive ratio
 * declines 0.970 -> 0.925, sub-geometric) and NOT power-law (worst R^2, spurious p ~ 6.47); it is best
 * described as a LINEAR / LOG-LINEAR ramp-down (R^2 ~ 0.9994 / 0.9993) whose implied asymptote is a LOCAL
 * finite zero at kEnd ~ 13.95 -- a bounded ramp within the endpoint-locked band, consistent with the imp-34308
 * de-pin break at kEnd ~ 15.4 and NOT a true kEnd -> infinity decay-to-zero.
 *
 * DESCRIPTIVE FIT ONLY. A form-selection / asymptote characterisation of the imp-34234 peak-step sequence on
 * the inherited imp-3220/imp-3406 surrogate ladder, NOT an RH bound. The OLS forms are descriptive, not
 * derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the imp-33843 log-linear widening verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34234-trough-peak-perstep-crossover-tenth-decade (source of the peak-step sequence fit here)
 * @see imp-34308-trough-peak-perstep-slope-extended-to-pole (argmax de-pins at kEnd ~15.4; why the linear-to-zero is local)
 * @see imp-33843-eflow-resid-widening-form-fit (the parent log-linear widening verdict this is consistent with)
 * @see imp-34153-trough-peak-perstep-crossover-locate (the quarter-decade crossover the peak-step decay drives)
 */

import { IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE } from './imp-34234-trough-peak-perstep-crossover-tenth-decade.js';

const SRC = IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE;
const Y = SRC.peakStepIncrements.slice(); // 0.01592 -> 0.00568, 20 endpoint-locked window-steps
const X = SRC.stepMidpoints.slice(); // 11.05 -> 12.95

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
  return { a: my - b * mx, b };
}
function rSquared(xs, ys, fit) {
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    const pred = fit.a + fit.b * xs[i];
    ssTot += (ys[i] - my) ** 2;
    ssRes += (ys[i] - pred) ** 2;
  }
  return 1 - ssRes / ssTot;
}

// (F1) successive-ratio (geometric) diagnostic: a pure geometric law holds r_i constant.
const ratios = [];
for (let i = 1; i < Y.length; i++) ratios.push(Y[i] / Y[i - 1]);
const ratioFirst = +ratios[0].toFixed(5); // ~0.96985
const ratioLast = +ratios[ratios.length - 1].toFixed(5); // ~0.92514
const ratioMean = +(ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(5); // ~0.94731
const ratioDeclines = ratioFirst > ratioLast; // true -- sub-geometric

const lnY = Y.map((v) => Math.log(v));
const lnX = X.map((v) => Math.log(v));

// (A) geometric / exponential: ln y = a + b*kEnd
const fitGeo = ols(X, lnY);
const r2Geo = +rSquared(X, lnY, fitGeo).toFixed(5); // ~0.98423
const perUnitRatio = +Math.exp(fitGeo.b).toFixed(5); // e^b ~ 0.58174
const perStepRatio = +Math.exp(fitGeo.b * 0.1).toFixed(5); // e^{0.1 b} ~ 0.94727 (matches ratioMean)

// (B) power-law: ln y = a + b*ln kEnd, exponent p = -b
const fitPow = ols(lnX, lnY);
const r2Pow = +rSquared(lnX, lnY, fitPow).toFixed(5); // ~0.97845
const powerExponent = +(-fitPow.b).toFixed(4); // ~6.4712 (spurious over the narrow ln-x band)

// (C) log-linear: y = a + b*ln kEnd
const fitLogLin = ols(lnX, Y);
const r2LogLin = +rSquared(lnX, Y, fitLogLin).toFixed(5); // ~0.99927

// (D) linear baseline: y = a + b*kEnd; local root -a/b is where the ramp hits zero
const fitLin = ols(X, Y);
const r2Lin = +rSquared(X, Y, fitLin).toFixed(5); // ~0.99942
const linearRootKEnd = +(-fitLin.a / fitLin.b).toFixed(4); // ~13.9472

// Best form by R^2 (linear >= log-linear >> geometric > power).
const RANKED = [
  { form: 'linear', r2: r2Lin },
  { form: 'log-linear', r2: r2LogLin },
  { form: 'geometric', r2: r2Geo },
  { form: 'power-law', r2: r2Pow },
].sort((p, q) => q.r2 - p.r2);
const bestForm = RANKED[0].form;
const powerIsWorst = RANKED[RANKED.length - 1].form === 'power-law';

export const IMP34313_PEAK_STEP_DECAY_LAW_FIT = {
  id: 'imp-34313',
  proofSection: 'S-frontier',
  question:
    'imp-34234 reported the endpoint-locked peak per-step increment decays smoothly strictly-monotonically ' +
    '0.01592 -> 0.00568 across kEnd 11..13 but never fit its decay LAW or asymptote. Fit that sequence to ' +
    'geometric (constant ratio / exponential), power-law, and log-linear forms, report the best form and its ' +
    'extrapolated asymptote, and relate it to the imp-33843 widening form. Descriptive fit; inherited ' +
    'surrogate; no bound changes; NO QED.',
  source: 'imp-34234 peakStepIncrements (reused verbatim; no ladder re-run)',
  nSteps: Y.length, // 20
  peakStepFirst: Y[0], // 0.01592
  peakStepLast: Y[Y.length - 1], // 0.00568
  // (F1) geometric diagnostic
  successiveRatioFirst: ratioFirst, // ~0.96985
  successiveRatioLast: ratioLast, // ~0.92514
  successiveRatioMean: ratioMean, // ~0.94731
  ratioDeclines, // true -- sub-geometric (a pure geometric holds the ratio constant)
  // fits
  geometricFit: { form: 'ln y = a + b*kEnd', a: +fitGeo.a.toFixed(5), b: +fitGeo.b.toFixed(5), r2: r2Geo, perUnitRatio, perStepRatio },
  powerFit: { form: 'ln y = a + b*ln kEnd', a: +fitPow.a.toFixed(5), b: +fitPow.b.toFixed(5), r2: r2Pow, exponent: powerExponent },
  logLinearFit: { form: 'y = a + b*ln kEnd', a: +fitLogLin.a.toFixed(6), b: +fitLogLin.b.toFixed(6), r2: r2LogLin },
  linearFit: { form: 'y = a + b*kEnd', a: +fitLin.a.toFixed(6), b: +fitLin.b.toFixed(6), r2: r2Lin, rootKEnd: linearRootKEnd },
  r2Ranking: RANKED,
  bestForm, // 'linear'
  powerIsWorst, // true
  impliedAsymptote:
    'LOCAL finite zero at kEnd ~ ' + linearRootKEnd + ' (linear ramp), NOT a kEnd -> infinity decay-to-zero; ' +
    'the endpoint-locked band ends at the imp-34308 argmax de-pin break kEnd ~ 15.4, so the linear-to-zero is ' +
    'a band-confined tangent, not a true asymptote.',
  finding: {
    F1_sub_geometric_ratio_declines:
      'The successive peak-step ratio is NOT constant: it declines from ~0.9698 (first step) to ~0.9251 ' +
      '(last step), mean ~0.9473. A pure geometric decay holds the ratio flat, so the peak step decelerates ' +
      'FASTER than any single exponential -- geometric is rejected as the generating form despite a high ' +
      'overall R^2 (0.98423).',
    F2_power_law_worst_and_spurious:
      'Power-law is the worst of the four (R^2 ~ 0.97845) and yields a huge exponent p ~ 6.47 -- an artifact ' +
      'of forcing a power law onto a near-exponential ramp over a < 0.1-decade ln-kEnd span, not a real tail ' +
      'exponent.',
    F3_best_is_linear_log_linear:
      'The peak step is very nearly linear in kEnd (R^2 ~ 0.99942), with log-linear a near-tie (R^2 ~ ' +
      '0.99927); over the narrow band ln(kEnd) is itself nearly linear in kEnd so the two are ' +
      'indistinguishable and both far exceed geometric and power. Ranking: linear >= log-linear >> geometric ' +
      '> power.',
    F4_asymptote_is_local_finite_zero:
      'The linear ramp extrapolates to peakStep = 0 at kEnd ~ 13.95 -- a LOCAL finite zero, not a kEnd -> ' +
      'infinity decay. imp-34308 shows the argmax de-pins near kEnd ~ 15.4 (structural break toward the ' +
      'surrogate pole k* ~ 21.281), so the linear-to-zero extrapolation is a band-confined descriptive ' +
      'tangent, NOT a genuine asymptote. The peak step does head to ~0 at the top of the endpoint-locked ' +
      'band, but by a bounded linear/log-linear ramp, not a geometric or power tail.',
    relation_to_imp33843:
      'The parent eflow_over_resid ladder was fit LOG-LINEAR by imp-33843; that this argmax peak-step decay ' +
      'is itself best-fit linear/log-linear (and NOT power-law) is consistent with the imp-33843 log-linear ' +
      'widening verdict -- the argmax residual step inherits the log-linear character of the parent ladder. ' +
      'The imp-33843 verdict is untouched.',
  },
  isRigorous: false,
  verdict:
    'DESCRIPTIVE FORM-SELECTION FIT (frontier-direction, NOT rigorous). Fitting the imp-34234 endpoint-locked ' +
    'peak per-step decay (0.01592 -> 0.00568, 20 tenth-decade window-steps, reused verbatim) to the three ' +
    'ticket forms plus a linear baseline shows the decay is NOT geometric (its successive ratio DECLINES ' +
    '~0.9698 -> ~0.9251, sub-geometric -- a pure geometric holds the ratio flat) and NOT power-law (worst ' +
    'R^2 ~ 0.97845, spurious exponent p ~ 6.47 over a < 0.1-decade ln-kEnd span). The best description is a ' +
    'LINEAR / LOG-LINEAR ramp-down (R^2 ~ 0.99942 / 0.99927, a near-tie over the narrow band), whose implied ' +
    'asymptote is a LOCAL finite zero at kEnd ~ 13.95 rather than a kEnd -> infinity decay-to-zero: because ' +
    'imp-34308 shows the argmax de-pins near kEnd ~ 15.4 (structural break toward the surrogate pole k* ~ ' +
    '21.281), the linear-to-zero extrapolation is a band-confined tangent, not a genuine asymptote. That the ' +
    'peak-step decay is best-fit linear/log-linear (not power-law) is consistent with the imp-33843 ' +
    'log-linear widening verdict (which is untouched). The OLS forms are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34234 (the peak-step sequence fit here); imp-34308 (argmax de-pin break at kEnd ~ 15.4 making the ' +
    'linear-to-zero local); imp-33843 (the parent log-linear widening verdict); imp-34153 (the crossover the ' +
    'peak-step decay drives); imp-486 (C_mb GUE-conditional).',
};

export const IMP34313_PEAK_STEP_DECAY_LAW_FIT_ASSERTIONS = [
  {
    // Source shape: 20 endpoint-locked window-steps, sequence 0.01592 -> 0.00568 reused verbatim.
    id: 'imp34313-source-shape',
    description: 'peak-step sequence has 20 window-steps, endpoints 0.01592 -> 0.00568, all endpoint-locked',
    holds: () =>
      Y.length === 20 &&
      X.length === 20 &&
      Math.abs(Y[0] - 0.01592) < 1e-9 &&
      Math.abs(Y[Y.length - 1] - 0.00568) < 1e-9 &&
      SRC.allEndpointLocked === true,
  },
  {
    // (F1) The successive ratio DECLINES (sub-geometric): first ~0.9698 > last ~0.9251, mean ~0.9473.
    id: 'imp34313-sub-geometric-ratio-declines',
    description: 'successive peak-step ratio declines 0.9698 -> 0.9251 (mean 0.9473); geometric rejected',
    holds: () =>
      ratioDeclines === true &&
      Math.abs(ratioFirst - 0.96985) < 1e-4 &&
      Math.abs(ratioLast - 0.92514) < 1e-4 &&
      Math.abs(ratioMean - 0.94731) < 1e-4 &&
      ratioFirst > ratioLast,
  },
  {
    // (F2) Power-law is the worst fit and its exponent is spurious (~6.47).
    id: 'imp34313-power-law-worst-and-spurious',
    description: 'power-law R^2 ~0.97845 is the lowest of the four; exponent p ~6.47 (spurious over narrow ln-x)',
    holds: () =>
      powerIsWorst === true &&
      Math.abs(r2Pow - 0.97845) < 5e-4 &&
      Math.abs(powerExponent - 6.4712) < 0.05,
  },
  {
    // (F3) Best form is linear/log-linear; ranking linear >= log-linear >> geometric > power.
    id: 'imp34313-best-form-linear-log-linear',
    description: 'linear (R^2 ~0.99942) >= log-linear (~0.99927) >> geometric (~0.98423) > power (~0.97845)',
    holds: () =>
      bestForm === 'linear' &&
      Math.abs(r2Lin - 0.99942) < 5e-4 &&
      Math.abs(r2LogLin - 0.99927) < 5e-4 &&
      r2Lin >= r2LogLin &&
      r2LogLin > r2Geo &&
      r2Geo > r2Pow &&
      Math.abs(r2Geo - 0.98423) < 5e-4,
  },
  {
    // (F4) Implied asymptote is a LOCAL finite zero at kEnd ~13.95 (linear root), NOT infinite decay;
    // geometric per-step ratio ~0.9473 matches the mean successive ratio.
    id: 'imp34313-asymptote-local-finite-zero',
    description: 'linear ramp root ~13.95 (local zero, not kEnd->inf); geometric per-step ratio ~0.9473 matches mean ratio',
    holds: () =>
      Math.abs(linearRootKEnd - 13.9472) < 0.05 &&
      linearRootKEnd < 15.4 && // inside the imp-34308 de-pin break, so it is a band-local zero
      Math.abs(perStepRatio - ratioMean) < 5e-3 &&
      Math.abs(perUnitRatio - 0.58174) < 5e-3,
  },
  {
    // Honesty gate: descriptive fit only -- isRigorous false, imp-33843 verdict untouched, no QED, no refereed bound is changed,
    // imp-3066 K_a >= 0 untouched, C_mb GUE-conditional per imp-486 untouched.
    id: 'imp34313-honesty-gate-no-qed',
    description: 'Descriptive fit only: isRigorous false, imp-33843 untouched, no QED, no refereed bound is changed, imp-3066 & C_mb untouched',
    holds: () =>
      IMP34313_PEAK_STEP_DECAY_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP34313_PEAK_STEP_DECAY_LAW_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34313_PEAK_STEP_DECAY_LAW_FIT.verdict) &&
      /imp-33843 log-linear widening verdict \(which is untouched\)/.test(IMP34313_PEAK_STEP_DECAY_LAW_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34313_PEAK_STEP_DECAY_LAW_FIT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34313_PEAK_STEP_DECAY_LAW_FIT.verdict),
  },
];

for (const a of IMP34313_PEAK_STEP_DECAY_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34313-peak-step-decay-law-fit assertion failed: ${a.id}`);
  }
}
