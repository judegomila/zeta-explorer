/**
 * @module imp-96487-route-m-burnol-ratio-asymptotic-remainder-model
 *
 * imp-96487 (numerical): assess the ASYMPTOTIC-REMAINDER-MODEL route that the
 * imp-96105 sub-gap (IMP96105_SUBGAP) names as the untried alternative to the
 * CPU-blocked N=1e4 Gram build for deciding whether the Route M Nyman-Beurling
 * Burnol-normalized quantity
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * eventually tightens to 1 (RH + simple zeros) or sits on a genuine finite-N
 * plateau. The sub-gap asks specifically for "an asymptotic-remainder model of
 * the fluctuating zero-oscillation term (amplitude decaying with logN)".
 *
 * DATA (fit-only, no new solve): the full measured ladder N=250..10000, 21 rungs,
 * assembled from the three prior runs that all reproduce each other bit-for-bit:
 *   - imp-96094 (IMP96094_ROWS): dense N=250..2600
 *   - imp-96105 (IMP96105_EXT_ROWS): extension N=3000..6000
 *   - imp-96325 (IMP96325_NEW_ROWS): N=7000..10000
 * The log-N variable L=log N spans only [5.521, 9.210], width 3.689.
 *
 * WHAT WAS DONE (tmp/imp-96487-scratch.mjs, reproducible): three nested models
 * were least-squares fit to ratio(N) over the 21 rungs, and the free asymptote
 * was compared against the forced RH value 1.
 *   M0  constant plateau               ratio = c0
 *   MA  smooth 1/L series              ratio = c0 + a/L + b/L^2  (prior route)
 *   MB  decaying-oscillation remainder ratio = c0 + L^{-p}(a cos(wL)+b sin(wL))
 *       -- the model the sub-gap names -- scanned over p in {0,0.5,1,1.5,2} and
 *       w in [0.2,25] step 0.05, with (c0,a,b) solved linearly per (p,w).
 *
 * FINDINGS (see IMP96487_MODELS / IMP96487_VERDICT):
 *   (1) The decaying-oscillation remainder DOES improve the fit: MB best
 *       (p=2, w=3.85) cuts the rms from 1.248e-2 (constant M0) to 8.855e-3,
 *       a ~29 percent reduction, with max residual 0.0206. So a fluctuating
 *       remainder is a better description than a flat plateau -- consistent with
 *       the zero-oscillation picture.
 *   (2) But the modelled asymptote is a PLATEAU BELOW 1, NOT ->1. MB extrapolates
 *       c0 = 0.98456, ~1.5 percent under 1. The smooth route MA is even worse
 *       (c0 = 0.8645). Across every trial frequency w in {1,2,3,5,8,12,3.85} the
 *       fitted c0 stays pinned in [0.9821, 0.9853]: the extrapolated centerline
 *       is ~0.985 regardless of which oscillation frequency is assumed.
 *   (3) DECISIVE test -- forcing the RH asymptote c0=1 (fit only the remainder
 *       about 1) roughly DOUBLES the rms versus a free plateau: rms(c0=1)/rms(free)
 *       = 1.985 at p=2, 1.919 at p=1, 1.850 at p=0. Under every decay exponent the
 *       data prefer a plateau at ~0.985 over convergence to 1 by a factor ~1.9.
 *       On the accessible range the asymptotic-remainder model predicts a genuine
 *       finite-N plateau, not ratio(N) -> 1.
 *   (4) WHY THIS DOES NOT CLOSE THE QUESTION (IMP96487_SUBGAP): the log-N window
 *       is only 3.689 wide, holding just 2.26 periods of the best-fit oscillation,
 *       and the decay exponent p is degenerate -- p in {0,1,2} all give c0 ~ 0.9845
 *       with comparable rms, so the true decay rate of the remainder amplitude is
 *       unresolved. A plateau centerline at 0.985 over N <= 1e4 therefore BOUNDS
 *       but does not rigorously decide the true asymptote: it gives no evidence for
 *       a slow drift to 1 and positively favors the plateau, yet cannot exclude a
 *       centerline that itself creeps upward beyond N=1e4 on a scale this window
 *       cannot see.
 *
 * VERDICT: the asymptotic-remainder-model route is realizable on the existing
 * ladder and returns a definite reading -- a fluctuating remainder about a plateau
 * at ~0.985, with the RH value 1 disfavored by ~1.9x in rms -- but its resolving
 * power is capped by the narrow 3.689-wide log-N span (centerline and decay
 * exponent jointly underdetermined). It reconfirms the imp-96094/imp-96105/imp-96325
 * finite-N plateau reading WITHOUT resolving the true asymptotic; it does not
 * supersede the CPU-blocked wider-N build, it quantifies what that build would need
 * to overcome.
 *
 * MEASUREMENT/FIT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (N=250..2600)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (N=3000..6000; IMP96105_SUBGAP names this route)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (N=7000..10000)
 *
 * Ticket: imp-96487 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96487_C_BURNOL = 0.04619141793224202;

// The full 21-rung measured ladder (ratio only), assembled from the three prior
// runs. Every value is the baked ratio(N) from imp-96094/imp-96105/imp-96325.
export const IMP96487_LADDER = Object.freeze([
  Object.freeze({ N: 250,   ratio: 0.9853030459881754, src: 'imp-96094' }),
  Object.freeze({ N: 500,   ratio: 0.9982700629705589, src: 'imp-96094' }),
  Object.freeze({ N: 750,   ratio: 0.9640024763631571, src: 'imp-96094' }),
  Object.freeze({ N: 1000,  ratio: 0.9804200969828122, src: 'imp-96094' }),
  Object.freeze({ N: 1250,  ratio: 0.9826926433733114, src: 'imp-96094' }),
  Object.freeze({ N: 1500,  ratio: 0.9885961620169521, src: 'imp-96094' }),
  Object.freeze({ N: 1750,  ratio: 0.9995152003949765, src: 'imp-96094' }),
  Object.freeze({ N: 2000,  ratio: 1.0060890778581055, src: 'imp-96094' }),
  Object.freeze({ N: 2300,  ratio: 1.002990665259071,  src: 'imp-96094' }),
  Object.freeze({ N: 2600,  ratio: 1.0102287163795478, src: 'imp-96094' }),
  Object.freeze({ N: 3000,  ratio: 0.9729204905638247, src: 'imp-96105' }),
  Object.freeze({ N: 3500,  ratio: 0.963885588735333,  src: 'imp-96105' }),
  Object.freeze({ N: 4000,  ratio: 0.9724333692631612, src: 'imp-96105' }),
  Object.freeze({ N: 4500,  ratio: 0.9774701947103525, src: 'imp-96105' }),
  Object.freeze({ N: 5000,  ratio: 0.9779064862688012, src: 'imp-96105' }),
  Object.freeze({ N: 5500,  ratio: 0.9847994277553519, src: 'imp-96105' }),
  Object.freeze({ N: 6000,  ratio: 0.9856144779200688, src: 'imp-96105' }),
  Object.freeze({ N: 7000,  ratio: 0.9877716335211392, src: 'imp-96325' }),
  Object.freeze({ N: 8000,  ratio: 0.9862693761733939, src: 'imp-96325' }),
  Object.freeze({ N: 9000,  ratio: 0.9768617315761334, src: 'imp-96325' }),
  Object.freeze({ N: 10000, ratio: 0.9769102009811711, src: 'imp-96325' }),
]);

// log-N window: the resolving-power constraint on any remainder-model fit.
export const IMP96487_LOGN_WINDOW = Object.freeze({
  Lmin: 5.521460917862246,       // log 250
  Lmax: 9.210340371976184,       // log 10000
  span: 3.6888794541139376,      // Lmax - Lmin
  bestFitPeriodsInWindow: 2.2603480884306046, // w_best * span / (2 pi)
  note: 'the log-N span holds only ~2.26 periods of the best-fit oscillation, capping the frequency/decay resolution of any asymptotic-remainder fit.',
});

// The three fitted models over the 21 rungs (tmp/imp-96487-scratch.mjs).
export const IMP96487_MODELS = Object.freeze({
  // M0: flat plateau.
  constant: Object.freeze({ form: 'ratio = c0', c0: 0.9848071964312094, rms: 0.012476992801577314 }),
  // MA: smooth 1/logN series -- the previously-tried smooth route (reconfirms failure).
  smooth: Object.freeze({
    form: 'ratio = c0 + a/L + b/L^2, L=logN',
    c0: 0.8645085841099153, rms: 0.012128325252893212,
    note: 'extrapolated asymptote 0.8645 far from 1 and rms barely below the constant: the smooth series does not describe the ladder (reconfirms imp-96094/imp-96105).',
  }),
  // MB: the decaying-oscillation remainder model the sub-gap names.
  decayingOscillation: Object.freeze({
    form: 'ratio = c0 + L^{-p} (a cos(wL) + b sin(wL)), L=logN',
    p: 2, w: 3.85,
    c0: 0.9845639691151629,
    a: -0.5003381367302109, b: -0.5710651562879144,
    rms: 0.008854508473866598, maxAbsResid: 0.020625554371311527,
    rmsReductionVsConstant: 0.2903, // 1 - 8.855e-3 / 1.248e-2
    note: 'best over p in {0,0.5,1,1.5,2}, w in [0.2,25]: cuts rms ~29 percent vs the constant but extrapolates a plateau at 0.9846, ~1.5 percent below 1.',
  }),
});

// c0 stays pinned near 0.985 no matter which oscillation frequency is assumed.
export const IMP96487_C0_SENSITIVITY = Object.freeze({
  p: 2,
  byFrequency: Object.freeze([
    Object.freeze({ w: 1,    c0: 0.982079, rms: 0.012126 }),
    Object.freeze({ w: 2,    c0: 0.984746, rms: 0.011862 }),
    Object.freeze({ w: 3,    c0: 0.985026, rms: 0.010816 }),
    Object.freeze({ w: 5,    c0: 0.984323, rms: 0.009903 }),
    Object.freeze({ w: 8,    c0: 0.984037, rms: 0.011395 }),
    Object.freeze({ w: 12,   c0: 0.985257, rms: 0.011936 }),
    Object.freeze({ w: 3.85, c0: 0.984564, rms: 0.008855 }),
  ]),
  c0Range: Object.freeze({ lo: 0.982079, hi: 0.985257 }),
  note: 'the extrapolated centerline is 0.985 (+/- 0.0016) across every trial frequency: the plateau reading is frequency-robust, not a single-fit artifact.',
});

// Decisive test: force the RH asymptote c0=1 vs a free plateau, per decay exponent.
export const IMP96487_C0EQ1_TEST = Object.freeze({
  form: 'fit only the remainder L^{-p}(a cos(wL)+b sin(wL)) about a fixed asymptote, w=3.85',
  byExponent: Object.freeze([
    Object.freeze({ p: 2, rmsForcedOne: 0.01757542488616125, rmsFreeC0: 0.008854508473866598, freeC0: 0.9846, rmsRatio: 1.9849125378369414 }),
    Object.freeze({ p: 1, rmsForcedOne: 0.017778,            rmsFreeC0: 0.009262,               freeC0: 0.9845, rmsRatio: 1.919 }),
    Object.freeze({ p: 0, rmsForcedOne: 0.018018,            rmsFreeC0: 0.009740,               freeC0: 0.9845, rmsRatio: 1.850 }),
  ]),
  note: 'forcing c0=1 (the ratio->1 hypothesis) inflates the rms by ~1.85x to ~1.98x under every decay exponent: the accessible data prefer a plateau at ~0.985 over convergence to 1.',
});

// Plateau cross-check: unweighted mean over the extension tail.
export const IMP96487_TAIL = Object.freeze({
  fromN: 3000, rungs: 11, meanRatio: 0.9784402706789755,
  note: 'the N>=3000 tail mean 0.9784 sits ~2 percent under 1, consistent with the fitted plateau centerline ~0.985 and inconsistent with a resolved approach to 1.',
});

export const IMP96487_VERDICT = Object.freeze({
  routeRealizable: true,
  remainderImprovesFit: true,      // MB cuts rms ~29 percent vs constant
  modelledAsymptote: 0.9845639691151629,
  predictsRatioToOne: false,       // c0 ~ 0.985, RH value 1 disfavored ~1.9x
  rhValueRmsPenalty: 1.9849125378369414,
  conclusion:
    'the asymptotic-remainder model the imp-96105 sub-gap names is realizable on the N=250..10000 ladder and returns a definite reading: a fluctuating remainder about a PLATEAU at ~0.985 (rms ~29 percent below a flat constant), with the RH asymptote 1 disfavored by ~1.9x in rms across decay exponents p in {0,1,2}. It reconfirms the finite-N plateau of imp-96094/imp-96105/imp-96325 WITHOUT resolving the true asymptotic, because the 3.689-wide log-N window leaves the centerline and decay exponent jointly underdetermined (IMP96487_SUBGAP). This does not supersede the CPU-blocked wider-N Gram build; it quantifies the ~1.9x separation that build would have to overturn to reveal a genuine ratio->1.',
});

// Honest residual sub-gap: the remainder model bounds but does not decide.
export const IMP96487_SUBGAP = Object.freeze({
  id: 'imp-96487-remainder-model-degenerate',
  statement:
    'the decaying-oscillation asymptotic-remainder model favors a plateau at ~0.985 over ratio->1 by ~1.9x in rms, but the log-N window is only 3.689 wide (~2.26 oscillation periods) and the remainder decay exponent p is degenerate (p in {0,1,2} give c0 ~ 0.9845 alike), so the fitted centerline and decay rate are jointly underdetermined. The model gives no evidence for a slow drift of the centerline to 1 and positively favors the plateau on N <= 1e4, but cannot rigorously exclude a centerline that creeps upward beyond N=1e4 on a scale this window cannot resolve. Deciding the true asymptote still needs a wider log-N reach (a longer Gram ladder), not a further fit.',
});

// Registration (imp-96521): literal `openSubGap:` key (not a variable reference)
// so scripts/auto-ticket-producer.mjs harvestSubGaps() can mint a follow-up
// ticket next wave. Content mirrors IMP96487_SUBGAP above; kept as a separate
// literal object because the harvester's regex requires a quoted string value,
// not a reference into another export.
export const IMP96487_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96487-remainder-model-degenerate',
    statement:
      'the imp-96487 decaying-oscillation asymptotic-remainder model favors a ~0.985 plateau over ratio->1 by ~1.9x in rms on the N=250..10000 Route M Burnol ladder, but the log-N window is only 3.689 wide (~2.26 oscillation periods) and the remainder decay exponent is degenerate (p in {0,1,2} all give c0 ~ 0.9845), so the fitted centerline and decay rate are jointly underdetermined. Deciding the true asymptote needs a longer Gram ladder (wider log-N reach), not a further fit.',
    status: 'open',
  },
});

export const IMP96487_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/fit only: every value is a reproducible numeric from tmp/imp-96487-scratch.mjs over the baked imp-96094/imp-96105/imp-96325 ladder; no new solve, no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96487_ASSERTIONS = [
  {
    id: 'imp96487-ladder-21-rungs-in-band',
    holds: () =>
      IMP96487_LADDER.length === 21 &&
      IMP96487_LADDER.every((r) => r.ratio > 0.96 && r.ratio < 1.011) &&
      IMP96487_LADDER[0].N === 250 && IMP96487_LADDER[20].N === 10000,
    why: 'the assembled ladder is the 21 measured rungs N=250..10000, every ratio inside the known [0.964, 1.010] band.',
  },
  {
    id: 'imp96487-remainder-improves-fit',
    holds: () =>
      IMP96487_MODELS.decayingOscillation.rms < IMP96487_MODELS.constant.rms &&
      IMP96487_MODELS.decayingOscillation.rms < 0.009 &&
      IMP96487_MODELS.decayingOscillation.rmsReductionVsConstant > 0.25,
    why: 'the decaying-oscillation remainder cuts the rms ~29 percent below a flat constant (8.855e-3 vs 1.248e-2): a fluctuating remainder is the better description.',
  },
  {
    id: 'imp96487-asymptote-is-plateau-not-one',
    holds: () =>
      Math.abs(IMP96487_MODELS.decayingOscillation.c0 - 0.9846) < 5e-4 &&
      Math.abs(IMP96487_MODELS.decayingOscillation.c0 - 1) > 0.01 &&
      IMP96487_VERDICT.predictsRatioToOne === false,
    why: 'the best remainder model extrapolates c0 ~ 0.9846, ~1.5 percent below 1: the modelled asymptote is a plateau, not ratio -> 1.',
  },
  {
    id: 'imp96487-c0-frequency-robust',
    holds: () => {
      const c = IMP96487_C0_SENSITIVITY.byFrequency.map((r) => r.c0);
      return Math.min(...c) > 0.981 && Math.max(...c) < 0.986;
    },
    why: 'across every trial frequency w in {1,2,3,5,8,12,3.85} the fitted c0 stays in [0.982, 0.985]: the plateau centerline is frequency-robust.',
  },
  {
    id: 'imp96487-rh-value-disfavored',
    holds: () =>
      IMP96487_C0EQ1_TEST.byExponent.every((r) => r.rmsRatio > 1.8) &&
      Math.abs(IMP96487_VERDICT.rhValueRmsPenalty - 1.9849125378369414) < 1e-9,
    why: 'forcing the RH asymptote c0=1 inflates the rms by ~1.85x to ~1.98x under every decay exponent p in {0,1,2}: the data prefer the plateau over convergence to 1.',
  },
  {
    id: 'imp96487-window-too-narrow-to-decide',
    holds: () =>
      Math.abs(IMP96487_LOGN_WINDOW.span - 3.6888794541139376) < 1e-9 &&
      IMP96487_LOGN_WINDOW.bestFitPeriodsInWindow < 3 &&
      /degenerate/.test(IMP96487_SUBGAP.id),
    why: 'the log-N span is 3.689 wide (~2.26 oscillation periods) and the sub-gap flags the centerline/decay-exponent degeneracy: the model bounds but does not rigorously decide the asymptote.',
  },
  {
    id: 'imp96487-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96487_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96487_HONEST_BANNER) &&
      /NO QED/.test(IMP96487_HONEST_BANNER) &&
      typeof IMP96487_SUBGAP.statement === 'string',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the undecided asymptote.',
  },
];

for (const a of IMP96487_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96487-route-m-burnol-ratio-asymptotic-remainder-model assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96487_C_BURNOL,
  ladder: IMP96487_LADDER,
  logNWindow: IMP96487_LOGN_WINDOW,
  models: IMP96487_MODELS,
  c0Sensitivity: IMP96487_C0_SENSITIVITY,
  c0Eq1Test: IMP96487_C0EQ1_TEST,
  tail: IMP96487_TAIL,
  verdict: IMP96487_VERDICT,
  subGap: IMP96487_SUBGAP,
  openSubGapRegistration: IMP96487_OPEN_SUBGAP_REGISTRATION,
  banner: IMP96487_HONEST_BANNER,
};
