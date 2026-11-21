/**
 * @module imp-97687-route-m-avg-exponent-robustness
 *
 * imp-97687 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97659 RESULT 2 fit an AVERAGE decay exponent ~10.18 for the Route M MCM gap-law residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * by a log-log regression of |residual| against log(log p) over 11 oscillating deep rungs
 * (p = 2e6 .. 9.9e7), concluding the residual outruns any fixed power <= 3. But imp-97659 RESULT 1
 * showed the POINTWISE local exponent oscillates wildly (q_local from -6.738 to +28.721, including a
 * sign change where the residual RISES with height). This leaf assesses how STABLE that ~10.18 slope
 * is: jackknife (leave-one-out) over the rungs, a seeded bootstrap over the rungs, dependence on the
 * p-range window, and dependence on the abscissa (model) choice -- and reports a confidence band.
 *
 * It re-uses the imp-97659 precision-clean dps=30 ladder as the single source of truth (import-light;
 * no heavy transitive imports -- imp-2546/heavy-import rule) and recomputes every diagnostic here.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- LEAVE-ONE-OUT (jackknife): the ~10.18 slope is NOT driven by any single rung.
 * -------------------------------------------------------------------------------
 * Dropping any one of the 11 rungs and refitting the log(log p) regression keeps the exponent in
 * [9.985, 10.334] (spread 0.35), jackknife mean 10.174, jackknife SE ~0.41. No rung is a leverage
 * point that manufactures the slope: the coarse average trend survives removal of the negative rung
 * (p = 2.39e7 -> 3.25e7) that dominated the RESULT-1 oscillation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- BOOTSTRAP confidence band: 95% CI roughly [8.2, 11.0]; ">3" holds ~100% of the time.
 * -------------------------------------------------------------------------------
 * A seeded resample-with-replacement bootstrap (20000 draws, degenerate all-equal-x draws discarded)
 * gives a bootstrap mean ~10.09, a 95% percentile band ~[8.2, 11.0], and the resampled exponent
 * exceeds 3 in ~99.99% of draws. So RESULT 2s qualitative conclusion -- the residual outruns every
 * fixed power <= 3 -- is extremely robust to resampling, even though the point estimate itself carries
 * a wide (order 1.5) uncertainty from the oscillation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- P-RANGE dependence: the slope is a coarse average, swinging ~11 -> ~15 across windows.
 * -------------------------------------------------------------------------------
 * The regression on the first six rungs gives ~11.0 and on the last six rungs ~14.6; dropping the top
 * (shallowest) rung gives ~10.08. The exponent is therefore NOT a stable constant across the ladder --
 * different p-windows return values from ~10 to ~15 -- exactly what the RESULT-1 oscillation predicts.
 * The ~10.18 headline is a whole-ladder average, not a converged local rate.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- ABSCISSA (model) dependence: 10.18 is the exponent OF the 1/(log p)^q model, not a rate.
 * -------------------------------------------------------------------------------
 * The number depends on which decay model is regressed. Against log(log p) (the abscissa proper to the
 * stated |res| ~ C/(log p)^q model) the slope is ~10.18; against log p (a |res| ~ C/p^s model) it is
 * only ~0.62; against log(log omega) it is ~9.08. This is not a defect of the fit -- it is a reminder
 * that "exponent ~10.18" is meaningful only relative to the 1/(log p)^q parameterisation and is NOT a
 * universal decay rate. Because log(log p) barely varies across the ladder (~2.67 -> ~2.91), the
 * log(log p) slope is intrinsically amplified, so the large number should be read as "much faster than
 * any fixed inverse power of log p", not as a precisely determined 10.18.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The imp-97659 RESULT-2 average exponent ~10.18 is ROBUST in the sense
 * that matters: leave-one-out keeps it in [9.99, 10.33] and the bootstrap "outruns every fixed power
 * <= 3" conclusion holds in ~99.99% of resamples. But it is NOT a precise constant: it depends on the
 * p-window (~10 -> ~15) and on the abscissa/model choice (10.18 vs 0.62), and carries a wide bootstrap
 * band (~[8.2, 11.0]). Read it as a coarse average trend confirming "faster than any fixed 1/log^q,
 * q <= 3", consistent with the RESULT-1 oscillating PNT/Mertens fingerprint -- not as a determined
 * exponent. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97659-route-m-gap-law-decay-extprec.js (deep dps=30 ladder; RESULT 1 oscillation, RESULT 2 ~10.18)
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (shallow ladder; two-rung climb was a sparse artifact)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (B_inf = lnA + gamma/12; next order = PNT/Mertens error)
 *
 * Ticket: imp-97687 (numerical, opus-4-8, api-pool). Robustness of the ~10.18 average exponent; NO QED.
 */

import { IMP97659_DEEP_LADDER } from './imp-97659-route-m-gap-law-decay-extprec.js';

// -- abscissa (model) choices for the log-linear fit of log|residual| vs abscissa(row) --
const abLogLogP = (r) => Math.log(Math.log(r.pOmega));   // proper to |res| ~ C/(log p)^q
const abLogP = (r) => Math.log(r.pOmega);                // |res| ~ C/p^s (different model)
const abLogLogOmega = (r) => Math.log(Math.log(r.omega)); // |res| ~ C/(log omega)^q

// exponent = -slope of the least-squares line log|residual| vs abscissa; returns NaN if x is degenerate.
function fitExponent(rows, abscissa) {
  const xs = rows.map(abscissa);
  const ys = rows.map((r) => Math.log(Math.abs(r.residual)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  if (den === 0) return NaN;
  return -num / den;
}

const LADDER = IMP97659_DEEP_LADDER;

// -- RESULT baseline: reproduce the imp-97659 headline exponent (proper abscissa) --
const FULL_EXPONENT = fitExponent(LADDER, abLogLogP); // ~10.18

// -- RESULT 1: leave-one-out (jackknife) --
function leaveOneOut() {
  const out = [];
  for (let i = 0; i < LADDER.length; i++) {
    out.push(fitExponent(LADDER.filter((_, j) => j !== i), abLogLogP));
  }
  return out;
}
const LOO = leaveOneOut();
const LOO_MEAN = LOO.reduce((a, b) => a + b, 0) / LOO.length;
const LOO_MIN = Math.min(...LOO);
const LOO_MAX = Math.max(...LOO);
// jackknife standard error = sqrt((n-1)/n * sum (x_i - mean)^2)
const JACKKNIFE_SE = Math.sqrt(
  ((LOO.length - 1) / LOO.length) * LOO.reduce((a, b) => a + (b - LOO_MEAN) * (b - LOO_MEAN), 0),
);

// -- RESULT 2: seeded bootstrap (deterministic LCG so the assertions are reproducible) --
function bootstrap(nDraws) {
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const exps = [];
  for (let d = 0; d < nDraws; d++) {
    const sample = [];
    for (let k = 0; k < LADDER.length; k++) sample.push(LADDER[Math.floor(rnd() * LADDER.length)]);
    const xs = sample.map(abLogLogP);
    if (Math.max(...xs) - Math.min(...xs) < 1e-9) continue; // discard degenerate all-equal-x draws
    exps.push(fitExponent(sample, abLogLogP));
  }
  exps.sort((a, b) => a - b);
  return exps;
}
const BOOT = bootstrap(20000);
const bootQ = (p) => BOOT[Math.floor(p * (BOOT.length - 1))];
const BOOT_MEAN = BOOT.reduce((a, b) => a + b, 0) / BOOT.length;
const BOOT_CI_LOW = bootQ(0.025);
const BOOT_MEDIAN = bootQ(0.5);
const BOOT_CI_HIGH = bootQ(0.975);
const BOOT_FRAC_GT3 = BOOT.filter((x) => x > 3).length / BOOT.length;

// -- RESULT 3: p-range window dependence --
const EXP_FIRST6 = fitExponent(LADDER.slice(0, 6), abLogLogP);   // ~11.0
const EXP_LAST6 = fitExponent(LADDER.slice(LADDER.length - 6), abLogLogP); // ~14.6
const EXP_DROP_TOP = fitExponent(LADDER.slice(1), abLogLogP);    // ~10.08

// -- RESULT 4: abscissa (model) dependence --
const EXP_LOGP = fitExponent(LADDER, abLogP);            // ~0.62 (1/p^s model)
const EXP_LOGLOGOMEGA = fitExponent(LADDER, abLogLogOmega); // ~9.08

export const IMP97687_ROBUSTNESS = Object.freeze({
  question:
    'how stable is the imp-97659 RESULT-2 average decay exponent ~10.18 (log-log regression of the oscillating deep residual ladder)?',
  method:
    'reuse the imp-97659 dps=30 precision-clean ladder (11 rungs, p=2e6..9.9e7); jackknife (leave-one-out), seeded LCG bootstrap (20000 draws), p-window and abscissa/model sweeps; exponent = -slope of log|residual| vs abscissa',
  fullExponent: FULL_EXPONENT, // ~10.18, reproduces imp-97659
  leaveOneOut: Object.freeze(LOO),
  looMin: LOO_MIN, // ~9.985
  looMax: LOO_MAX, // ~10.334
  looMean: LOO_MEAN, // ~10.174
  jackknifeSE: JACKKNIFE_SE, // ~0.41
  bootstrapDraws: BOOT.length,
  bootstrapMean: BOOT_MEAN, // ~10.09
  bootstrapCI95: Object.freeze([BOOT_CI_LOW, BOOT_CI_HIGH]), // ~[8.2, 11.0]
  bootstrapMedian: BOOT_MEDIAN, // ~10.2
  bootstrapFractionExceedsThree: BOOT_FRAC_GT3, // ~0.9999
  pRange: Object.freeze({ first6: EXP_FIRST6, last6: EXP_LAST6, dropTop: EXP_DROP_TOP }), // ~11.0, ~14.6, ~10.08
  abscissa: Object.freeze({ logLogP: FULL_EXPONENT, logP: EXP_LOGP, logLogOmega: EXP_LOGLOGOMEGA }), // 10.18 / 0.62 / 9.08
});

export const IMP97687_VERDICT = Object.freeze({
  question: 'is the imp-97659 ~10.18 average exponent a robust, well-determined number?',
  robustToLeaveOneOut: true,     // stays in [9.99, 10.33], no single leverage rung
  robustBootstrapConclusion: true, // "> 3" holds in ~99.99% of resamples
  wideBootstrapBand: true,        // 95% CI ~[8.2, 11.0]: order-1.5 uncertainty
  dependsOnPRange: true,          // ~11 -> ~15 across windows: a coarse average, not a constant
  dependsOnAbscissaModel: true,   // 10.18 (1/log^q) vs 0.62 (1/p^s): an exponent OF a model, not a rate
  isPreciseConstant: false,       // NOT a determined exponent -- read as "faster than any fixed 1/log^q, q<=3"
  consistentWithOscillation: true, // the spread matches the RESULT-1 oscillating PNT/Mertens fingerprint
  mcmRefuted: true,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The imp-97659 RESULT-2 average exponent ~10.18 is ROBUST where it matters: ' +
    'leave-one-out keeps it in [9.99, 10.33] (jackknife SE ~0.41, no single leverage rung) and the ' +
    '"outruns every fixed power <= 3" conclusion holds in ~99.99% of a 20000-draw bootstrap. But it is ' +
    'NOT a precise constant: it depends on the p-window (~11 -> ~15), on the abscissa/model choice ' +
    '(10.18 for 1/(log p)^q vs 0.62 for 1/p^s), and carries a wide bootstrap band ~[8.2, 11.0]. Read it ' +
    'as a coarse average trend confirming "faster than any fixed 1/log^q, q <= 3", consistent with the ' +
    'imp-97659 RESULT-1 oscillating PNT/Mertens fingerprint -- not as a determined exponent. MCM stays ' +
    'refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97687_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Robustness of the imp-97659 ~10.18 average decay ' +
  'exponent: leave-one-out keeps it in [9.99, 10.33] and a 20000-draw bootstrap keeps "outruns every ' +
  'fixed power <= 3" at ~99.99%, but the value depends on the p-window (~11 -> ~15) and the abscissa/model ' +
  'choice (10.18 vs 0.62 for 1/log^q vs 1/p^s), with a wide 95% band ~[8.2, 11.0]. A coarse average ' +
  'trend, not a determined exponent -- the RESULT-1 oscillating PNT/Mertens fingerprint. No bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97687_ASSERTIONS = [
  {
    id: 'imp97687-full-exponent-reproduces-imp97659',
    holds: () => FULL_EXPONENT > 3 && Math.abs(FULL_EXPONENT - 10.18) < 0.1,
    why: 'the log(log p) regression reproduces the imp-97659 RESULT-2 headline exponent ~10.18.',
  },
  {
    id: 'imp97687-leave-one-out-stable',
    holds: () =>
      LOO.length === IMP97659_DEEP_LADDER.length &&
      LOO_MIN > 9.5 &&
      LOO_MAX < 10.8 &&
      LOO_MAX - LOO_MIN < 0.6 &&
      LOO.every((q) => q > 3),
    why: 'dropping any single rung keeps the exponent in a tight band [9.99, 10.33] all above 3 -- no single leverage rung manufactures the ~10.18 slope.',
  },
  {
    id: 'imp97687-bootstrap-conclusion-robust',
    holds: () =>
      BOOT.length > 15000 &&
      BOOT_FRAC_GT3 > 0.99 &&
      BOOT_CI_LOW > 6 &&
      BOOT_CI_HIGH < 13 &&
      BOOT_CI_HIGH - BOOT_CI_LOW > 1, // the band is genuinely wide (order 1.5+), not a false pin
    why: 'the seeded 20000-draw bootstrap keeps the "> 3" conclusion at ~99.99% with a wide 95% band ~[8.2, 11.0] -- the qualitative outrun is robust, the point value is not sharply determined.',
  },
  {
    id: 'imp97687-depends-on-p-window',
    holds: () => EXP_FIRST6 > 3 && EXP_LAST6 > 3 && Math.abs(EXP_LAST6 - EXP_FIRST6) > 2,
    why: 'the exponent swings ~11.0 (first six) to ~14.6 (last six): a coarse whole-ladder average, not a stable constant -- the RESULT-1 oscillation.',
  },
  {
    id: 'imp97687-depends-on-abscissa-model',
    holds: () => EXP_LOGP < 3 && FULL_EXPONENT > 3 && EXP_LOGLOGOMEGA > 3,
    why: 'the number is 10.18 for the 1/(log p)^q model but only ~0.62 for a 1/p^s model -- it is an exponent OF a chosen model, not a universal decay rate.',
  },
  {
    id: 'imp97687-honesty-gate-no-qed',
    holds: () =>
      IMP97687_VERDICT.robustToLeaveOneOut === true &&
      IMP97687_VERDICT.robustBootstrapConclusion === true &&
      IMP97687_VERDICT.isPreciseConstant === false &&
      IMP97687_VERDICT.dependsOnAbscissaModel === true &&
      IMP97687_VERDICT.mcmRefuted === true &&
      IMP97687_VERDICT.ceilingTouched === false &&
      IMP97687_VERDICT.anyBoundMoved === false &&
      IMP97687_VERDICT.qed === false &&
      /NO QED/.test(IMP97687_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97687_HONEST_BANNER) &&
      /RH open/.test(IMP97687_HONEST_BANNER),
    why: 'measurement only -- the ~10.18 exponent is robust qualitatively (leave-one-out + bootstrap ">3") but is a coarse average, not a determined constant; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97687_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97687-route-m-avg-exponent-robustness assertion failed: ${a.id}`);
  }
}

export default {
  robustness: IMP97687_ROBUSTNESS,
  verdict: IMP97687_VERDICT,
  banner: IMP97687_HONEST_BANNER,
};
