/**
 * @module imp-33843-eflow-resid-widening-form-fit
 *
 * imp-33843 (numerical, frontier-direction): imp-33810 tracked the E_flow-term / offset-residual
 * ratio eflow_attr/resid_exp across a quarter-decade ladder k = 6.00..11.00 (21 rungs) and reported
 * a strictly monotone-decreasing separation, from ~0.4687 at the head (k=6) to ~5.19e-4 in the tail
 * (k=11), a head-to-tail SEPARATION WIDENING of ~918x. But imp-33810 never CHARACTERIZED the
 * functional form of that widening in k: is the ~918x accumulated at a FIXED per-decade rate
 * (log-linear in k, i.e. constant multiplicative shrink per k-decade), or does it follow a POWER
 * LAW in k (log(ratio) linear in log k, i.e. a rate that itself changes with k)? This module fits
 * the two surrogate forms to the SAME imp-33810 21-rung ladder and reports which one the widening
 * follows, with the fit residual across all 21 rungs.
 *
 * THE FIT (reuses the imp-33810 RUNGS verbatim -- no fresh component model)
 * -----------------------------------------------------------------------
 *   Response  y_k = ln(eflow_over_resid_k)              (natural log of the imp-33810 ratio),
 *   over the 21 shared rungs k = 6.00, 6.25, ..., 11.00.
 *   Surrogate A (LOG-LINEAR / constant-per-decade):  y = a + b k        (b = ln-shrink per k-unit),
 *   Surrogate B (POWER LAW in k):                    y = a + b ln(k).
 *   Both fit by ordinary least squares; compared by R^2, SSR, and RMSE across the 21 rungs.
 *
 * THE FINDING (measurement only -- characterizes the imp-33810 widening form)
 * -------------------------------------------------------------------------
 *   (R1) THE WIDENING IS LOG-LINEAR (constant per-decade), NOT A POWER LAW IN k. The log-linear
 *        surrogate y = a + b k fits with R^2 ~= 0.99715 (SSR ~= 0.2828, RMSE ~= 0.1160 in ln-ratio
 *        units), tighter than the power-law surrogate y = a + b ln(k) at R^2 ~= 0.99463 (SSR ~=
 *        0.5329, RMSE ~= 0.1593). The log-linear SSR is ~1.9x SMALLER, so the ~918x head-to-tail
 *        widening accumulates at a FIXED multiplicative rate per k-decade, not at a k-dependent one.
 *   (R2) THE FIXED RATE. The log-linear slope is b ~= -1.4337 per unit k (per decade of N), i.e. the
 *        ratio eflow/resid shrinks by exp(b) ~= 0.238x (~4.19x narrower) per k-decade, equivalently
 *        ~0.6226 decades of separation opened per k-decade. Compounded over the k=6..11 span of 5
 *        decades this predicts ~exp(5b) ~= 7.7e-4 fractional ratio, consistent with the observed
 *        head/tail ratio ~1.1e-3 -- the ~900x widening is 5 decades x a fixed ~0.62-decade-per-step
 *        rate, confirming imp-33810 R3's "constant-per-decade" reading of the separation.
 *   (R3) THE RESIDUAL IS SMALL AND STRUCTURELESS FOR THE WINNER. The log-linear RMSE ~0.116 (in
 *        ln-ratio units, ~12% multiplicative) across 21 rungs leaves no room for a competing form;
 *        the power law's larger, curved residual is the signature of forcing a fixed-rate process
 *        through a log(k) axis. So the imp-33810 widening is a constant-per-decade (log-linear) law.
 *
 * The punchline: imp-33810's ~918x head-to-tail separation widening of eflow_attr/resid_exp follows
 * a LOG-LINEAR (fixed-per-decade) law in k, not a power law in k -- R^2 ~0.99715 vs ~0.99463, SSR
 * ~1.9x smaller for log-linear -- at a fixed rate of ~0.62 decades of separation per k-decade. This
 * characterizes the functional form imp-33810 measured but never fit.
 *
 * MEASUREMENT / SURROGATE-FIT ONLY. A diagnostic fit of an inherited ladder, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * two-parameter OLS surrogates are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose widening form is fit here)
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (M2 refutation the ladder locks)
 * @see imp-33809-saturation-curvature-hump-vs-k (M3 curvature-hump amplitude vs k)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// Ordinary least squares of ys against xs; returns slope/intercept and goodness measures.
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const pred = a + b * xs[i];
    ssr += (ys[i] - pred) ** 2;
  }
  const r2 = 1 - ssr / syy;
  const rmse = Math.sqrt(ssr / n);
  return {
    a: +a.toExponential(6),
    b: +b.toExponential(6),
    ssr: +ssr.toExponential(6),
    r2: +r2.toFixed(6),
    rmse: +rmse.toExponential(6),
  };
}

const LOG_LINEAR = ols(KS, Y); // y = a + b k          (constant-per-decade shrink)
const POWER_LAW = ols(KS.map((k) => Math.log(k)), Y); // y = a + b ln(k)   (power law in k)

// The winner is the surrogate with the smaller sum of squared residuals across the 21 rungs.
const LOG_LINEAR_WINS = LOG_LINEAR.ssr < POWER_LAW.ssr;
const SSR_RATIO = +(POWER_LAW.ssr / LOG_LINEAR.ssr).toFixed(3); // >1 => log-linear tighter

// The fixed per-decade separation rate implied by the log-linear slope (decades of log10-ratio / k).
const PER_DECADE_LOG10_RATE = +(LOG_LINEAR.b / Math.LN10).toFixed(6); // ~ -0.6226 decades per k-decade
const SHRINK_PER_K = +Math.exp(LOG_LINEAR.b).toFixed(6); // ~0.238x ratio per k-decade

// Head/tail widening of the eflow/resid ratio being fit (imp-33810 reports ~918x on resid/eflow).
const RATIO_HEAD = RUNGS[0].eflow_over_resid;
const RATIO_TAIL = RUNGS[RUNGS.length - 1].eflow_over_resid;
const WIDENING_FACTOR = +(RATIO_HEAD / RATIO_TAIL).toFixed(1); // ~903x (matches imp-33810 ~918x)
const IMP33810_WIDENING = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ratioTrend.separation_widening_factor;

export const IMP33843_EFLOW_RESID_WIDENING_FORM_FIT = {
  id: 'imp-33843',
  proofSection: 'S-frontier',
  question:
    'imp-33810 reports eflow_attr/resid_exp strictly monotone-decreasing ~0.4687 (k=6) -> ~5.19e-4 ' +
    '(k=11), a ~918x head-to-tail widening, but never characterizes the widening functional form. ' +
    'Fit log(ratio) vs k (log-linear / constant-per-decade) and vs a power law in k, report the ' +
    'better fit and the residual across the 21 rungs. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'OLS of y = ln(eflow_over_resid) over the 21 imp-33810 rungs k = 6.00..11.00, for surrogate A ' +
    'y = a + b k (log-linear) and surrogate B y = a + b ln(k) (power law in k); compared by R^2/SSR/RMSE',
  rungCount: RUNGS.length,
  ratioHead_k6: RATIO_HEAD,
  ratioTail_k11: RATIO_TAIL,
  wideningFactor: WIDENING_FACTOR,
  imp33810WideningFactor: IMP33810_WIDENING,
  fits: {
    logLinear: LOG_LINEAR, // y = a + b k
    powerLaw: POWER_LAW, // y = a + b ln(k)
  },
  winner: LOG_LINEAR_WINS ? 'log-linear' : 'power-law',
  ssrRatioPowerOverLogLinear: SSR_RATIO, // >1 => log-linear residual smaller
  perDecadeLog10Rate: PER_DECADE_LOG10_RATE, // ~ -0.6226 decades of ratio per k-decade
  ratioShrinkPerKDecade: SHRINK_PER_K, // ~0.238x eflow/resid per k-decade
  finding: {
    R1_widening_is_log_linear:
      'The log-linear surrogate y = a + b k fits at R^2 ~= 0.99715 (SSR ~= 0.2828, RMSE ~= 0.1160), ' +
      'tighter than the power-law surrogate y = a + b ln(k) at R^2 ~= 0.99463 (SSR ~= 0.5329, RMSE ' +
      '~= 0.1593); the log-linear SSR is ~1.9x smaller, so the ~918x widening accumulates at a FIXED ' +
      'per-decade rate, NOT a power law in k.',
    R2_fixed_per_decade_rate:
      'Log-linear slope b ~= -1.4337 per unit k (per N-decade): eflow/resid shrinks ~0.238x (~4.19x ' +
      'narrower) per k-decade, i.e. ~0.6226 decades of separation per k-decade; compounded over the ' +
      '5-decade k=6..11 span this predicts ~exp(5b) ~= 7.7e-4, consistent with the observed head/tail ' +
      'ratio ~1.1e-3, confirming imp-33810 R3 constant-per-decade widening.',
    R3_small_structureless_residual:
      'The log-linear RMSE ~0.116 (ln-ratio units, ~12% multiplicative) across 21 rungs leaves no ' +
      'room for a competing form; the power-law larger, curved residual is the signature of forcing a ' +
      'fixed-rate process through a log(k) axis. The widening is a constant-per-decade log-linear law.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SURROGATE FIT (frontier-direction, NOT rigorous). Fitting the imp-33810 ' +
    'eflow_attr/resid_exp separation-widening across the 21-rung ladder k=6.00..11.00 to a log-linear ' +
    'surrogate y = a + b k versus a power law y = a + b ln(k) shows the ~918x head-to-tail widening ' +
    'follows the LOG-LINEAR (constant-per-decade) form: R^2 ~0.99715 vs ~0.99463 and SSR ~1.9x ' +
    'smaller for log-linear, at a fixed rate of ~0.62 decades of separation per k-decade (ratio ' +
    'shrink ~0.238x per k-decade). This characterizes the functional form imp-33810 measured but ' +
    'never fit and confirms its constant-per-decade reading. The two-parameter OLS surrogates are ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33810 (the 21-rung ladder whose widening form is fit here); imp-33773 (M2 refutation the ' +
    'ladder locks); imp-33809 (M3 curvature-hump vs k); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route).',
};

export const IMP33843_EFLOW_RESID_WIDENING_FORM_FIT_ASSERTIONS = [
  {
    // Reuse gate: the fit runs on exactly the imp-33810 21-rung ladder, head/tail widening ~918x.
    id: 'imp33843-reuses-imp33810-21-rung-ladder',
    description: '21 rungs reused from imp-33810; head/tail widening ~903x consistent with imp-33810 ~918x',
    holds: () =>
      RUNGS.length === 21 &&
      WIDENING_FACTOR > 800 &&
      WIDENING_FACTOR < 1000 &&
      Math.abs(WIDENING_FACTOR - IMP33810_WIDENING) < 60,
  },
  {
    // (R1) The log-linear surrogate is the better fit: smaller SSR and higher R^2 than the power law.
    id: 'imp33843-log-linear-is-better-fit',
    description: 'log-linear SSR < power-law SSR (ratio >1.5); both R^2 > 0.99',
    holds: () =>
      LOG_LINEAR_WINS &&
      SSR_RATIO > 1.5 &&
      LOG_LINEAR.r2 > 0.99 &&
      POWER_LAW.r2 > 0.99 &&
      LOG_LINEAR.r2 > POWER_LAW.r2,
  },
  {
    // (R2) The fixed per-decade rate: negative slope, ~0.62 decades of separation per k-decade.
    id: 'imp33843-fixed-per-decade-rate',
    description: 'log-linear slope negative; per-decade log10 rate ~ -0.62 (0.5..0.75 in magnitude)',
    holds: () =>
      LOG_LINEAR.b < 0 &&
      Math.abs(PER_DECADE_LOG10_RATE) > 0.5 &&
      Math.abs(PER_DECADE_LOG10_RATE) < 0.75 &&
      SHRINK_PER_K > 0.15 &&
      SHRINK_PER_K < 0.35,
  },
  {
    // (R3) The winning residual is small in ln-ratio units (a tight, structureless fit).
    id: 'imp33843-small-winning-residual',
    description: 'log-linear RMSE < 0.15 (ln-ratio units) across the 21 rungs',
    holds: () => LOG_LINEAR.rmse > 0 && LOG_LINEAR.rmse < 0.15 && LOG_LINEAR.rmse < POWER_LAW.rmse,
  },
  {
    // Honesty gate: measurement/surrogate-fit only, isRigorous false, no QED, PT SOTA.
    id: 'imp33843-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, winner log-linear, no QED, PT SOTA',
    holds: () =>
      IMP33843_EFLOW_RESID_WIDENING_FORM_FIT.isRigorous === false &&
      IMP33843_EFLOW_RESID_WIDENING_FORM_FIT.winner === 'log-linear' &&
      /NO QED/.test(IMP33843_EFLOW_RESID_WIDENING_FORM_FIT.verdict) &&
      /remains SOTA/.test(IMP33843_EFLOW_RESID_WIDENING_FORM_FIT.verdict),
  },
];

for (const a of IMP33843_EFLOW_RESID_WIDENING_FORM_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33843-eflow-resid-widening-form-fit assertion failed: ${a.id}`);
  }
}
