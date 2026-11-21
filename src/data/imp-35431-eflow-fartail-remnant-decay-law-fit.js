/**
 * @module imp-35431-eflow-fartail-remnant-decay-law-fit
 *
 * imp-35431 (numerical, frontier-direction): imp-35371 extended the imp-35280 E_flow
 * far-tail fd-vs-analytic (closed-form/prefactor) remnant -- the gap
 * |analytic - fd-surrogate| between the imp-35198 analytic leading exponent
 * (-1 + 3/log N) and the finite-difference exponent read on the CLOSED surrogate height
 * map T0 = 2 pi N / log N -- to N = 1e20 (0.0014) and N = 1e24 (0.0011), and established
 * the remnant decays MONOTONICALLY past its ~1e9 peak (0.0031 -> 0.0011 over twelve
 * decades) rather than flooring at a nonzero asymptote. imp-35371 never fit that decay
 * to a functional form. This module FITS the decay-rate law.
 *
 * THE MEASUREMENT (surrogate channel only -- no height-map swap, so no heavy import)
 * ---------------------------------------------------------------------------------
 * Same isolated surrogate channel as imp-35280/imp-35371: the fd-vs-analytic remnant
 * holds the height map FIXED at the closed surrogate T0 = 2 pi N / log N, so both the
 * fd-surrogate exponent and the analytic exponent -1 + 3/log N live on that closed
 * inverse and the remnant never touches effectiveHeightForN (pure Math, no heavy import).
 * This module reproduces the remnant on a DENSER half-decade rung ladder from N = 1e9
 * (the peak) to N = 1e24, measures the local decay exponent d(log remnant)/d(log N)
 * across the whole span, and fits the post-peak (e >= 12) span to the two candidate
 * closed forms.
 *
 * THE FINDING -- the decay is a CROSSOVER, not a pure power law nor a pure inverse-log
 * -------------------------------------------------------------------------------------
 *  (1) The LOCAL log-log decay exponent d(log remnant)/d(log N) is NON-MONOTONE: its
 *      magnitude RISES from ~0.0256 at e = 9.5 to an interior peak ~0.0343 near e ~ 13,
 *      then FALLS back to ~0.0258 by e = 23.5. A pure power law would hold a CONSTANT
 *      local exponent; a pure inverse-log-power (log N)^-q would give a monotone-declining
 *      local exponent -q/log N. The measured rise-then-fall matches NEITHER pure form --
 *      it is a crossover with an interior effective-exponent peak.
 *  (2) Both global fits over e in [12, 24] are near-tied and excellent:
 *        power-law   log rem = a - p log N       => p = 0.03064,  R^2 = 0.99795
 *        inverse-log log rem = b - q log(log N)   => q = 1.23314,  R^2 = 0.99766
 *      Neither pure form dominates (R^2 differ by < 3e-4), consistent with (1): on any
 *      single finite window both forms fit, so a decade-limited window cannot discriminate.
 *  (3) The two forms EXTRAPOLATE differently, and the true (bisected) crossing lands
 *      between them -- the decisive crossover signature:
 *        remnant < 1e-3:  power log10 N ~ 24.98,  inverse-log log10 N ~ 26.29
 *                         TRUE (imp-35413 bisection on the actual remnant) = 25.6205
 *                         => 24.98 < 25.62 < 26.29 : power UNDERshoots, inverse-log
 *                            OVERshoots, the true decay sits strictly between the two
 *                            pure forms -- a crossover, exactly as (1)/(2) predict.
 *        remnant < 1e-4:  power log10 N ~ 57.6,   inverse-log log10 N ~ 170.1
 *                         => the two forms DIVERGE by ~3x that deep, so the 1e-4 threshold
 *                            is model-sensitive and can only be BRACKETED to ~[58, 170]
 *                            decades, NOT pinned; whereas the 1e-3 threshold is robust
 *                            (both forms and the true crossing agree to ~1.3 decades).
 *
 * So the honest reading: the decay-rate law is a CROSSOVER between a very slow power law
 * (local exponent ~0.03) and an inverse-log-power (q ~ 1.23) -- neither pure form is
 * correct, the local exponent peaks in the interior, and the two extrapolations bracket
 * the imp-35413 bisected sub-1e-3 crossing. The near-term (1e-3) threshold is robust; the
 * deep (1e-4) threshold is model-sensitive and only bracketable.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. Far-tail exponent stays 1/2 per imp-3463; imp-3066
 * K_a >= 0 untouched; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the deep ladder this fits, endpoint 1e24)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the bisected true crossing log10 N ~ 25.6205)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on a given height map (imp-35236 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// THE fd-vs-analytic remnant at log10 N = e (the imp-35280/imp-35371 quantity, surrogate channel).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const an = analyticSurrogateExponent(x);
  return Math.abs(an - fd);
}

// Dense half-decade ladder from the N = 1e9 peak to N = 1e24 (imp-35371 endpoint).
const LADDER_EXPS = [];
for (let e = 9; e <= 24 + 1e-9; e += 0.5) LADDER_EXPS.push(+e.toFixed(1));

const LADDER = LADDER_EXPS.map((e) => ({
  log10N: e,
  logN: +Math.log(Math.pow(10, e)).toFixed(4),
  remnant: +remnantAtLog10(e).toExponential(6),
}));

// Local decay exponent d(log remnant)/d(log N) by a symmetric half-decade difference on the ladder.
function localDecayExponentAt(i) {
  const lr = Math.log(LADDER[i + 1].remnant) - Math.log(LADDER[i - 1].remnant);
  const ln = LADDER[i + 1].logN - LADDER[i - 1].logN;
  return lr / ln;
}
const LOCAL_DECAY = LADDER.map((r, i) =>
  i === 0 || i === LADDER.length - 1
    ? { log10N: r.log10N, localDecayExponent: null }
    : { log10N: r.log10N, localDecayExponent: +localDecayExponentAt(i).toFixed(5) },
);

// Ordinary least-squares slope/intercept plus R^2 (self-contained, no dependency).
function linfit(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const icpt = (sy - slope * sx) / n;
  const ybar = sy / n;
  const ss = ys.reduce((a, y, i) => a + (y - (icpt + slope * xs[i])) ** 2, 0);
  const tot = ys.reduce((a, y) => a + (y - ybar) ** 2, 0);
  return { slope, icpt, r2: 1 - ss / tot };
}

// Fit the post-peak span (e >= 12) to the two candidate closed forms.
const FIT = LADDER.filter((r) => r.log10N >= 12);
const LN_N = FIT.map((r) => r.logN);
const LN_REM = FIT.map((r) => Math.log(r.remnant));
const LN_LN_N = FIT.map((r) => Math.log(r.logN));

const POWER_FIT = linfit(LN_N, LN_REM); // log rem = icpt + slope * log N ; p = -slope
const INVLOG_FIT = linfit(LN_LN_N, LN_REM); // log rem = icpt + slope * log log N ; q = -slope

const POWER_P = +(-POWER_FIT.slope).toFixed(5);
const INVLOG_Q = +(-INVLOG_FIT.slope).toFixed(5);

// Extrapolated log10 N at which each fitted form falls below a target remnant.
function powerLog10NForTarget(target) {
  // rem = exp(icpt) * N^slope  =>  log N = (log target - icpt)/slope  =>  log10 N = that / ln 10
  const lnN = (Math.log(target) - POWER_FIT.icpt) / POWER_FIT.slope;
  return +(lnN / Math.log(10)).toFixed(3);
}
function invlogLog10NForTarget(target) {
  // rem = exp(icpt) * (log N)^slope  =>  log N = exp((log target - icpt)/slope)
  const lnN = Math.exp((Math.log(target) - INVLOG_FIT.icpt) / INVLOG_FIT.slope);
  return +(lnN / Math.log(10)).toFixed(3);
}

const THRESHOLD_EXTRAPOLATION = {
  target_1e_3: {
    powerLog10N: powerLog10NForTarget(1e-3),
    invlogLog10N: invlogLog10NForTarget(1e-3),
    trueBisectedLog10N: 25.6205, // imp-35413 bisection on the ACTUAL remnant
  },
  target_1e_4: {
    powerLog10N: powerLog10NForTarget(1e-4),
    invlogLog10N: invlogLog10NForTarget(1e-4),
  },
};

export const IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT = {
  id: 'imp-35431',
  proofSection: 'S-frontier',
  question:
    'Fit a decay-rate law to the imp-35371 E_flow far-tail fd-vs-analytic remnant (0.0026 ' +
    'at N = 1e9 falling to 0.0011 by N = 1e24): is the twelve-decade slow decay power-law ' +
    'N^-p, inverse-log-power 1/(log N)^q, or a crossover between the two?',
  method:
    'Reproduce the imp-35280/imp-35371 fd-vs-analytic remnant |analytic - fd-surrogate| live on ' +
    'the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import) on a DENSER half-decade ladder from N = 1e9 to ' +
    'N = 1e24; measure the local decay exponent d(log remnant)/d(log N) across the span; and OLS-fit ' +
    'the post-peak (e >= 12) span to log rem = a - p log N and log rem = b - q log(log N).',
  ladder: LADDER,
  localDecayExponent: LOCAL_DECAY,
  powerFit: { p: POWER_P, r2: +POWER_FIT.r2.toFixed(6) },
  inverseLogFit: { q: INVLOG_Q, r2: +INVLOG_FIT.r2.toFixed(6) },
  thresholdExtrapolation: THRESHOLD_EXTRAPOLATION,
  finding: {
    F1_local_exponent_non_monotone:
      'The local log-log decay exponent d(log remnant)/d(log N) is NON-MONOTONE: its magnitude ' +
      'rises from ~0.0256 at log10 N = 9.5 to an interior peak ~0.0343 near log10 N ~ 13, then ' +
      'falls back to ~0.0258 by log10 N = 23.5. A pure power law would hold a CONSTANT local ' +
      'exponent and a pure inverse-log-power a MONOTONE-declining one; the measured rise-then-fall ' +
      'matches neither -- the signature of a crossover with an interior effective-exponent peak.',
    F2_global_fits_near_tied:
      'Over the post-peak span e in [12, 24] both global fits are excellent and near-tied: power-law ' +
      'p = ' + POWER_P + ' (R^2 = ' + POWER_FIT.r2.toFixed(5) + ') and inverse-log q = ' + INVLOG_Q +
      ' (R^2 = ' + INVLOG_FIT.r2.toFixed(5) + '), differing by < 3e-4 in R^2. On any single finite ' +
      'window both closed forms fit, so a decade-limited window alone cannot discriminate them.',
    F3_crossover_bracket:
      'The decisive test is extrapolation: for remnant < 1e-3 the power-law gives log10 N ~ ' +
      THRESHOLD_EXTRAPOLATION.target_1e_3.powerLog10N + ' and the inverse-log ~ ' +
      THRESHOLD_EXTRAPOLATION.target_1e_3.invlogLog10N + ', while the imp-35413 bisection on the ' +
      'ACTUAL remnant gives 25.6205 -- strictly BETWEEN the two (power undershoots, inverse-log ' +
      'overshoots). The true decay sits between the two pure forms: a CROSSOVER, as F1/F2 predict.',
    F4_deep_threshold_model_sensitive:
      'For remnant < 1e-4 the two forms give log10 N ~ ' + THRESHOLD_EXTRAPOLATION.target_1e_4.powerLog10N +
      ' (power) vs ~ ' + THRESHOLD_EXTRAPOLATION.target_1e_4.invlogLog10N + ' (inverse-log) -- a ~3x ' +
      'divergence -- so the 1e-4 threshold is model-sensitive and can only be BRACKETED to roughly ' +
      '[58, 170] decades, whereas the 1e-3 threshold is robust (both forms and the true crossing agree ' +
      'to ~1.3 decades). The deeper the extrapolation, the more the crossover ambiguity dominates.',
  },
  isRigorous: false,
  honestStatus:
    'Fitting the imp-35371 far-tail remnant on a dense half-decade ladder (N = 1e9..1e24) shows the ' +
    'decay is a CROSSOVER, not a pure form: the local exponent d(log remnant)/d(log N) is non-monotone ' +
    '(magnitude peaks ~0.0343 near log10 N ~ 13, falling to ~0.0258 by log10 N = 23.5), both a power ' +
    'law (p = ' + POWER_P + ') and an inverse-log-power (q = ' + INVLOG_Q + ') fit the post-peak span to ' +
    'R^2 ~ 0.998 without either dominating, and their extrapolations BRACKET the imp-35413 bisected ' +
    'sub-1e-3 crossing (power ' + THRESHOLD_EXTRAPOLATION.target_1e_3.powerLog10N + ' < true 25.6205 < ' +
    'inverse-log ' + THRESHOLD_EXTRAPOLATION.target_1e_3.invlogLog10N + '). The remnant would fall below ' +
    '1e-3 near log10 N ~ 25.6 (robust) and below 1e-4 somewhere in ~[58, 170] decades (model-sensitive). ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; far-tail exponent stays 1/2 per ' +
    'imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-35371 E_flow far-tail fd-vs-analytic ' +
    'remnant decays as a CROSSOVER between a very slow power law (p = ' + POWER_P + ') and an inverse-log-' +
    'power (q = ' + INVLOG_Q + '), not as either pure form: the local log-log exponent is non-monotone ' +
    '(interior magnitude peak ~0.0343 near log10 N ~ 13), both fits tie at R^2 ~ 0.998, and their sub-1e-3 ' +
    'extrapolations (' + THRESHOLD_EXTRAPOLATION.target_1e_3.powerLog10N + ' and ' +
    THRESHOLD_EXTRAPOLATION.target_1e_3.invlogLog10N + ') bracket the imp-35413 bisected true crossing ' +
    '25.6205. The remnant crosses 1e-3 near log10 N ~ 25.6 (robust) and 1e-4 somewhere in ~[58, 170] ' +
    'decades (model-sensitive). Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; E_flow > 0 ' +
    'strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35371 (deep remnant ladder, endpoint 1e24, fit here); imp-35413 (bisected sub-1e-3 crossing ' +
    'log10 N ~ 25.6205); imp-35280 (four-rung remnant origin); imp-35198 (analytic -1 + 3/log N); ' +
    'imp-35135 (far-tail E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT_ASSERTIONS = [
  {
    // Reproduces the imp-35371 deep endpoints on the dense ladder (surrogate channel is faithful).
    id: 'imp35431-reproduces-imp35371-deep-endpoints',
    description: 'dense-ladder remnant matches imp-35371 at N = 1e20 (~0.0014) and N = 1e24 (~0.0011)',
    holds: () => {
      const byE = Object.fromEntries(LADDER.map((r) => [r.log10N, r.remnant]));
      return Math.abs(byE[20] - 0.0014) < 5e-4 && Math.abs(byE[24] - 0.0011) < 5e-4;
    },
  },
  {
    // The local decay exponent is non-monotone: its magnitude peaks in the interior (crossover signature).
    id: 'imp35431-local-exponent-non-monotone',
    description: 'the local decay exponent magnitude peaks in the interior, exceeding both ladder ends',
    holds: () => {
      const mags = LOCAL_DECAY.filter((d) => d.localDecayExponent !== null).map((d) => ({
        e: d.log10N,
        m: Math.abs(d.localDecayExponent),
      }));
      const first = mags[0];
      const last = mags[mags.length - 1];
      const peak = mags.reduce((a, b) => (b.m > a.m ? b : a));
      // interior peak strictly above both ends, and located strictly inside the span
      return peak.m > first.m && peak.m > last.m && peak.e > first.e && peak.e < last.e;
    },
  },
  {
    // Both closed forms fit the post-peak span excellently and near-tied -- neither pure form dominates.
    id: 'imp35431-both-fits-near-tied',
    description: 'power-law and inverse-log fits both give R^2 > 0.99 and differ by < 0.01 in R^2',
    holds: () =>
      POWER_FIT.r2 > 0.99 &&
      INVLOG_FIT.r2 > 0.99 &&
      Math.abs(POWER_FIT.r2 - INVLOG_FIT.r2) < 0.01,
  },
  {
    // Crossover bracket: the imp-35413 bisected true sub-1e-3 crossing lies strictly between the two fits.
    id: 'imp35431-crossover-brackets-true-crossing',
    description: 'power sub-1e-3 extrapolation < imp-35413 true crossing 25.6205 < inverse-log extrapolation',
    holds: () => {
      const t = THRESHOLD_EXTRAPOLATION.target_1e_3;
      return t.powerLog10N < t.trueBisectedLog10N && t.trueBisectedLog10N < t.invlogLog10N;
    },
  },
  {
    // Deep threshold is model-sensitive: the two 1e-4 extrapolations diverge by more than 2x.
    id: 'imp35431-deep-threshold-model-sensitive',
    description: 'the inverse-log 1e-4 extrapolation exceeds the power-law one by more than a factor 2',
    holds: () => {
      const t = THRESHOLD_EXTRAPOLATION.target_1e_4;
      return t.invlogLog10N > 2 * t.powerLog10N;
    },
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35431-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT.verdict),
  },
];

for (const a of IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35431-eflow-fartail-remnant-decay-law-fit assertion failed: ${a.id}`,
    );
  }
}

export default IMP35431_EFLOW_FARTAIL_REMNANT_DECAY_LAW_FIT;
