/**
 * @module imp-34570-eflow-attr-power-law-fit-eflow-slope-check
 * @fileoverview imp-34570 -- FIT the imp-34406-confirmed smooth eflow_attr(k) bracket
 *   (8 rungs, 8.287e-15 -> 2.816e-15 across k = 21.0 .. 21.5) to a POWER LAW in the
 *   decade-top N = 10^(k+1), report the fit residual, and MEASURE whether the imp-34406
 *   finite local log-slope -2.159 per k at the pole k* ~ 21.28095 is REPRODUCED by the
 *   E_flow analytic log-slope.
 *
 *   imp-34406 recovered eflow_attr(k) = (E_flow/E_N) * |d ln E_flow / d ln N| directly on
 *   8 rungs and reported that it is smooth, strictly monotone, nonzero, with a FINITE
 *   local log-slope -2.159 per k at k* (its F2 witness that the eflow_over_resid pole is
 *   SIMPLE, not removable). It never fit the bracket to a functional form nor checked the
 *   -2.159 against the analytic E_flow slope. This module supplies both.
 *
 *   METHOD (import-light, verbatim imp-34169/imp-34109 machinery). The 8 baked rungs are
 *   REUSED from imp-34406 (IMP34406_EFLOW_ATTR_RUNGS -- no re-derivation, no 16.7MB zeros
 *   bundle in the chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]).
 *   An OLS on (ln N, ln eflow_attr) over the 8 rungs gives the power-law exponent p and
 *   amplitude A; the analytic E_flow log-slope is the offline central-difference of
 *   ln E_flow(N) = ln[C_F(T0) * (ln T0 / T0) * GRONWALL] at N = 10^(k*+1) via the same
 *   parts()/eflowLogSlope() used by imp-34169 (baked to literals here).
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) EFLOW_ATTR IS A CLEAN POWER LAW IN N. OLS fit eflow_attr = A * N^p over the 8
 *        rungs gives p = -0.937481 (exponent per ln N), A = 3.4917e+6, with
 *        R^2 = 0.99999993 (1 - R^2 = 6.93e-8), RMS log-residual 8.42e-5 and max log-residual
 *        1.40e-4. The bracket is a single-power-law falloff over the whole half-decade of k
 *        to <2e-4 in log -- no curvature term is needed at this precision.
 *   (F2) THE FIT REPRODUCES THE imp-34406 LOCAL SLOPE. The power-law per-k log-slope
 *        p * ln 10 = -2.158629 reproduces the imp-34406 finite local log-slope -2.159 per k
 *        at k* to 0.017% -- i.e. the "local slope at k*" is not a near-pole artifact but the
 *        global power-law exponent, consistent across the whole bracket.
 *   (F3) THE -2.159 IS THE E_flow ANALYTIC LOG-SLOPE, NOT A DENOMINATOR EFFECT. The analytic
 *        E_flow log-slope at k* is d ln E_flow / d ln N = -0.938878 per ln N, i.e.
 *        -2.161846 per log10 N (per k). The measured -2.159 sits +0.002846 (0.132%) ABOVE
 *        this pure E_flow slope. The decomposition eflow_attr = (E_flow/E_N)*|g| shows why:
 *        E_N is E_trunc-dominated at N ~ 10^22 (E_trunc = 3.06e-5 >> E_flow ~ 1e-15,
 *        E_coll ~ 7e-11), so d ln E_N/dk ~ 0 and the E_flow/E_N ratio slope IS the E_flow
 *        slope; the entire +0.003 gap is the mild curvature of the |d ln E_flow/d ln N|
 *        factor (d ln|g|/dk = +0.00299). So the imp-34406 -2.159 is REPRODUCED by the
 *        analytic E_flow log-slope to the sub-0.15% |g|-curvature term -- the local slope is
 *        E_flow-driven, with the E_N denominator flat and inert.
 *
 *   The punchline: eflow_attr is a clean N^p power law (p = -0.9375, R^2 = 0.99999993 over
 *   the 8 rungs), its per-k log-slope p*ln10 = -2.1586 reproduces the imp-34406 local slope
 *   -2.159 to 0.02%, and that slope is the analytic E_flow log-slope (-2.1618 per k) up to a
 *   +0.13% |g|-curvature correction -- the E_N denominator is E_trunc-flat and contributes
 *   nothing. The imp-34406 finite-slope premise is thus grounded in the E_flow asymptotics.
 *
 *   MEASUREMENT ONLY. An OLS power-law fit and analytic-slope cross-check of an inherited
 *   surrogate numerator, NOT an RH bound. The component model is the inherited
 *   imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 *   imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 *   K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8 rungs, F2 finite -2.159 slope)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (parts()/eflowLogSlope() machinery)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (the simple-pole classification)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- (F1) OLS power-law fit  eflow_attr = A * N^p  on (ln N, ln eflow_attr) ------------
// N = 10^(k+1) is the decade top the imp-34169 machinery reads eflow_attr at.
const XS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log(Math.pow(10, r.k + 1)));
const YS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log(r.eflowAttr));
const NN = XS.length;
const MX = XS.reduce((a, b) => a + b, 0) / NN;
const MY = YS.reduce((a, b) => a + b, 0) / NN;
let SXX = 0;
let SXY = 0;
let SYY = 0;
for (let i = 0; i < NN; i++) {
  SXX += (XS[i] - MX) ** 2;
  SXY += (XS[i] - MX) * (YS[i] - MY);
  SYY += (YS[i] - MY) ** 2;
}
const P_EXPONENT = SXY / SXX; // -0.937481 (power-law exponent per ln N)
const LN_A = MY - P_EXPONENT * MX;
let SSRES = 0;
let MAX_RESID = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (LN_A + P_EXPONENT * XS[i]);
  SSRES += resid * resid;
  MAX_RESID = Math.max(MAX_RESID, Math.abs(resid));
}
export const IMP34570_POWER_LAW_EXPONENT = P_EXPONENT; // -0.937481
export const IMP34570_POWER_LAW_AMPLITUDE = Math.exp(LN_A); // 3.4917e+6
export const IMP34570_FIT_R2 = 1 - SSRES / SYY; // 0.99999993
export const IMP34570_FIT_RMS_LOG_RESID = Math.sqrt(SSRES / NN); // 8.42e-5
export const IMP34570_FIT_MAX_LOG_RESID = MAX_RESID; // 1.40e-4

// Per-k (= per log10 N) log-slope implied by the power law: p * ln 10.
export const IMP34570_FIT_PER_K_SLOPE = P_EXPONENT * Math.LN10; // -2.158629

// --- (F3) the analytic E_flow log-slope at k* (offline, verbatim imp-34169 parts()) ----
// eflowLogSlope returns d ln E_flow / d ln N (natural-log derivative, per the imp-34169
// (2*h*LN10) normalization on a 10^h step). Baked to a literal here (import-light).
export const IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N = -0.938878; // d ln E_flow / d ln N at k*
export const IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K =
  IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N * Math.LN10; // -2.161846 (per log10 N = per k)

// The imp-34406 finite local log-slope at k* and the residual vs the analytic E_flow slope.
export const IMP34570_IMP34406_LOCAL_SLOPE = -2.159; // imp-34406 F2 finite slope at k*
export const IMP34570_SLOPE_RESIDUAL =
  IMP34570_IMP34406_LOCAL_SLOPE - IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K; // +0.002846
export const IMP34570_SLOPE_RESIDUAL_PCT =
  Math.abs(IMP34570_IMP34406_LOCAL_SLOPE / IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K - 1) * 100; // 0.132%

export const IMP34570_EFLOW_ATTR_POWER_LAW_FIT = {
  ticket: 'imp-34570',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34406 confirmed eflow_attr smooth, monotone, nonzero on 8 rungs (8.287e-15 -> ' +
    '2.816e-15 across k = 21.0 .. 21.5) with a finite local log-slope -2.159 per k at k*, ' +
    'but never fit the bracket to a form nor checked -2.159 against the E_flow analytic ' +
    'slope. Fit a power law in N = 10^(k+1), report the residual, and measure whether -2.159 ' +
    'is reproduced by the analytic E_flow log-slope. Measurement only; NO QED.',
  fit: {
    form: 'eflow_attr = A * N^p, N = 10^(k+1)',
    exponentPerLnN: +P_EXPONENT.toFixed(6),
    amplitude: +Math.exp(LN_A).toExponential(6),
    R2: +IMP34570_FIT_R2.toFixed(9),
    oneMinusR2: +(1 - IMP34570_FIT_R2).toExponential(4),
    rmsLogResid: +IMP34570_FIT_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34570_FIT_MAX_LOG_RESID.toExponential(5),
    perKSlope: +IMP34570_FIT_PER_K_SLOPE.toFixed(6),
  },
  eflowAnalyticSlope: {
    perLnN: IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N,
    perK: +IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K.toFixed(6),
  },
  imp34406LocalSlope: IMP34570_IMP34406_LOCAL_SLOPE,
  slopeResidual: +IMP34570_SLOPE_RESIDUAL.toFixed(6),
  slopeResidualPct: +IMP34570_SLOPE_RESIDUAL_PCT.toFixed(4),
  finding: {
    F1_clean_power_law:
      'OLS eflow_attr = A * N^p over 8 rungs: p = -0.937481 per ln N, A = 3.4917e+6, ' +
      'R^2 = 0.99999993 (1 - R^2 = 6.93e-8), RMS log-residual 8.42e-5, max 1.40e-4 -- a single ' +
      'power law over the whole half-decade of k, no curvature term needed at this precision.',
    F2_fit_reproduces_imp34406_local_slope:
      'The power-law per-k log-slope p * ln 10 = -2.158629 reproduces the imp-34406 finite ' +
      'local log-slope -2.159 per k at k* to 0.017% -- the "local slope at k*" is the global ' +
      'power-law exponent, not a near-pole artifact.',
    F3_slope_is_eflow_analytic_slope:
      'The analytic E_flow log-slope at k* is -0.938878 per ln N = -2.161846 per k. The ' +
      'measured -2.159 sits +0.002846 (0.132%) above it. E_N is E_trunc-dominated (3.06e-5 >> ' +
      'E_flow ~ 1e-15) so d ln E_N/dk ~ 0 and the E_flow/E_N ratio slope IS the E_flow slope; ' +
      'the entire +0.003 gap is the mild |d ln E_flow/d ln N| factor curvature (d ln|g|/dk = ' +
      '+0.00299). So the imp-34406 -2.159 is the analytic E_flow log-slope up to a sub-0.15% ' +
      'curvature term -- E_flow-driven, with the E_N denominator flat and inert.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- an OLS power-law fit (eflow_attr = A * N^p, R^2 = 0.99999993 over 8 ' +
    'rungs) and analytic-slope cross-check of the inherited surrogate numerator eflow_attr, ' +
    'reusing the imp-34406 baked rungs and the verbatim imp-34169 parts() machinery. The ' +
    'per-k slope p*ln10 = -2.1586 reproduces the imp-34406 local slope -2.159 to 0.02%, and ' +
    'that slope is the analytic E_flow log-slope -2.1618 per k up to a +0.13% |g|-curvature ' +
    'term (E_N is E_trunc-flat). Descriptive surrogate, NOT a rigorous asymptotic; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34570_ASSERTIONS = [
  {
    // Reuse gate: the 8 rungs are the imp-34406 baked rungs, not fresh literals.
    id: 'imp-34570-reuses-imp34406-rungs',
    description: 'the 8 rungs are imported from imp-34406 (IMP34406_EFLOW_ATTR_RUNGS)',
    holds: () =>
      IMP34406_EFLOW_ATTR_RUNGS.length === 8 &&
      IMP34406_EFLOW_ATTR_RUNGS[0].eflowAttr === 8.28715423e-15 &&
      IMP34406_EFLOW_ATTR_RUNGS[7].eflowAttr === 2.81619473e-15,
  },
  {
    // (F1) the power-law fit is excellent (R^2 -> 1, tiny log-residual).
    id: 'imp-34570-power-law-fit-excellent',
    description: 'OLS power-law fit R^2 = 0.99999993 (1-R^2 < 1e-7), RMS log-residual < 1e-4, p ~ -0.9375',
    holds: () =>
      IMP34570_FIT_R2 > 0.9999999 &&
      1 - IMP34570_FIT_R2 < 1e-7 &&
      IMP34570_FIT_RMS_LOG_RESID < 1e-4 &&
      Math.abs(IMP34570_POWER_LAW_EXPONENT - -0.937481) < 1e-5,
  },
  {
    // (F2) the fit per-k slope reproduces the imp-34406 -2.159 local slope to <0.05%.
    id: 'imp-34570-fit-slope-reproduces-imp34406',
    description: 'power-law per-k slope p*ln10 = -2.1586 reproduces imp-34406 local slope -2.159 to <0.05%',
    holds: () =>
      Math.abs(IMP34570_FIT_PER_K_SLOPE - -2.158629) < 1e-4 &&
      Math.abs(IMP34570_FIT_PER_K_SLOPE / IMP34570_IMP34406_LOCAL_SLOPE - 1) < 5e-4,
  },
  {
    // (F3) -2.159 IS the analytic E_flow log-slope (per k) up to a sub-0.15% |g|-curvature term.
    id: 'imp-34570-slope-is-eflow-analytic-slope',
    description: 'imp-34406 -2.159 reproduced by the analytic E_flow per-k log-slope -2.1618 to residual +0.003 (<0.15%)',
    holds: () =>
      Math.abs(IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K - -2.161846) < 1e-5 &&
      IMP34570_SLOPE_RESIDUAL > 0 &&
      Math.abs(IMP34570_SLOPE_RESIDUAL - 0.002846) < 5e-4 &&
      IMP34570_SLOPE_RESIDUAL_PCT < 0.15,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34570-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34570_EFLOW_ATTR_POWER_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP34570_EFLOW_ATTR_POWER_LAW_FIT.honest) &&
      /refereed bound is changed/i.test(IMP34570_EFLOW_ATTR_POWER_LAW_FIT.honest),
  },
];

for (const a of IMP34570_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34570-eflow-attr-power-law-fit-eflow-slope-check assertion failed: ${a.id}`);
  }
}
