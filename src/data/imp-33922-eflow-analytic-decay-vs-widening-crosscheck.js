/**
 * @module imp-33922-eflow-analytic-decay-vs-widening-crosscheck
 *
 * imp-33922 (accuracy, frontier-direction): imp-33885 confirmed the analytic closed form
 *   E_flow = G L (L0^2 - 1)/(4 pi^2 N)  ~  (log N)^3 / N
 * tracks the direct E_flow to machine precision at every one of the 21 imp-33810 quarter-decade rungs
 * (the raw-decay law), and imp-33843/imp-33884 pinned the head-to-tail widening of the ATTRIBUTED ratio
 * roe(k) = resid_exp(k)/eflow_attr(k) at 903.538 exact (imp-33810 reported ~917.9, a toFixed(1)
 * artifact). The two results are LINKED -- the widening is driven by the E_flow decay -- but the
 * analytic decay factor was never compared head to head against the measured widening. This module
 * supplies that cross-check: it asks whether the (log N)^3/N law, evaluated at the imp-33810 endpoints,
 * REPRODUCES the empirical 903.538 widening, and by how much it misses if taken alone.
 *
 * WHAT IS CROSS-CHECKED (same inherited imp-3406/imp-33810 sub-terms as imp-33884/imp-33885)
 * -----------------------------------------------------------------------------------------
 *   The exact widening decomposes (imp-28895/imp-33884) into four multiplicative endpoint factors:
 *     widening = roe(11)/roe(6) = F1 * F2 * F3 * F4,     with
 *       F1 = E_flow(6)/E_flow(11)   -- the RAW E_flow head-to-tail decay (the (log N)^3/N law)
 *       F2 = E_N(11)/E_N(6)         -- the normaliser collapse (E_N -> E_trunc as N grows)
 *       F3 = sflow(6)/sflow(11)     -- the E_flow log-slope ratio
 *       F4 = resid(11)/resid(6)     -- the imp-33773 M2 sub-leading residual ratio
 *   ONLY F1 is what the analytic (log N)^3/N decay law predicts. We evaluate F1 in BOTH the direct form
 *   E_flow = C_F (L/T0) G and the closed form G L (L0^2-1)/(4 pi^2 N), confirm they agree, and measure
 *   the residual of "F1 alone predicts the widening" against the imp-33884 exact 903.538. We then
 *   re-insert the closed-form F1 into the full four-factor product to confirm the exact reconstruction.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE ANALYTIC DECAY LAW REPRODUCES THE RAW E_flow FACTOR F1 EXACTLY. The closed-form F1 (from
 *        the (log N)^3/N law) and the direct-form F1 both equal 17992.16, agreeing to rel ~2e-16 -- the
 *        analytic law nails the RAW head-to-tail E_flow decay to machine precision (imp-33885 confirmed
 *        per-rung; this is the endpoint slice).
 *   (R2) BUT THE RAW DECAY LAW ALONE DOES NOT REPRODUCE THE WIDENING -- IT OVER-PREDICTS BY ~19.9x. The
 *        empirical widening is 903.538, while the analytic raw decay F1 is 17992.16: F1/widening =
 *        19.913, a relative residual of ~1891% (18.91). The (log N)^3/N law captures the DRIVER of the
 *        widening but not its MAGNITUDE, because the attributed ratio roe divides E_flow by the
 *        normaliser E_N and multiplies by the slope and residual ratios.
 *   (R3) THE ~19.9x GAP IS THE ATTRIBUTION ATTENUATION F2*F3*F4 = 0.05022, DOMINATED BY THE NORMALISER
 *        F2. Re-inserting the CLOSED-FORM F1 into the full product F1*F2*F3*F4 reproduces the exact
 *        903.538 to rel ~2.5e-16. On a log scale the raw decay OVER-explains the widening by 144%
 *        (ln F1 / ln widening = 1.4395); the attenuation ln(F2*F3*F4) = -2.99 removes the 44% excess,
 *        and 92% of that attenuation is the normaliser collapse F2 (ln F2 = -2.76) vs the slope
 *        (ln F3 = -0.098) and residual (ln F4 = -0.134) factors.
 *
 * The punchline: the analytic (log N)^3/N decay law reproduces the RAW E_flow head-to-tail decay factor
 * (F1 = 17992.16) to machine precision but NOT the empirical widening (903.538) -- taken alone it
 * over-predicts by a factor of ~19.9 (+1891%). The widening is that raw decay attenuated by the
 * attribution factors F2*F3*F4 = 0.05022, which the analytic decay does not touch; the attenuation is
 * 92%-dominated (log scale) by the E_N normaliser collapse F2, not the slope or residual ratios.
 * Re-inserting the closed-form F1 into the four-factor product recovers 903.538 exactly (rel 2.5e-16),
 * confirming the (log N)^3/N law is exactly ONE of the four multiplicative drivers -- the dominant one
 * on a log scale (144% of ln-widening), offset by the normaliser.
 *
 * ACCURACY / MEASUREMENT ONLY. Cross-check / reconciliation diagnostic, NOT an RH bound. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the closed-form E_flow scaling is
 * exact WITHIN that model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33885-eflow-closedform-per-rung-crossvalidation (the (log N)^3/N per-rung machine-floor match)
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (the exact 903.538 widening + F1..F4 factors)
 * @see imp-33843-eflow-resid-widening-form-fit (the ~918x widening form fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33885 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33884 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33810 helper defns (verbatim), needed for the resid_exp endpoints.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810 endpoint rungs (k=6 head, k=11 tail) at full precision -- the roe = resid/eflow ratio.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow };
}
const HEAD = rung(6);
const TAIL = rung(11);

// The four component-model endpoint factors (exact identity; imp-28895/imp-33884).
const F1 = HEAD.E_flow / TAIL.E_flow; // raw E_flow head-to-tail decay -- the (log N)^3/N law: ~17992
const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse: ~0.06332
const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio: ~0.90709
const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio: ~0.87432
const WIDENING = TAIL.roe / HEAD.roe; // the imp-33884 exact 903.538

// The analytic (log N)^3/N CLOSED FORM (imp-28895 R1 / imp-33885), evaluated at the endpoints.
function eflowClosed(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  return (GRONWALL * L * (L0 * L0 - 1)) / (FOUR_PI2 * N); // G L (L0^2-1)/(4 pi^2 N)
}
const F1_CLOSED = eflowClosed(1e7) / eflowClosed(1e12); // closed-form raw decay F1
const F1_FORMS_REL = Math.abs(F1 - F1_CLOSED) / F1; // direct vs closed form (~2e-16)

// R2: does the analytic raw decay ALONE reproduce the widening? (No -- over-predicts.)
const OVERPREDICTION_FACTOR = F1 / WIDENING; // ~19.913
const RAW_DECAY_VS_WIDENING_REL = Math.abs(F1 - WIDENING) / WIDENING; // ~18.913 (+1891%)

// R3: the ~19.9x gap IS the attribution attenuation F2*F3*F4; re-inserting closed-form F1 rebuilds exact.
const ATTENUATION = F2 * F3 * F4; // ~0.05022
const CLOSEDFORM_WIDENING = F1_CLOSED * F2 * F3 * F4; // ~903.538 (identity via F1_closed=F1_direct)
const CLOSEDFORM_WIDENING_REL = Math.abs(CLOSEDFORM_WIDENING - WIDENING) / WIDENING; // ~2.5e-16

// Log-scale split: how much of ln(widening) the raw (log N)^3/N decay explains, and the F2 dominance.
const LN_WIDENING = Math.log(WIDENING);
const LN_F1 = Math.log(F1);
const LN_F2 = Math.log(F2);
const LN_F3 = Math.log(F3);
const LN_F4 = Math.log(F4);
const RAW_DECAY_LOG_SHARE = LN_F1 / LN_WIDENING; // ~1.4395 (over-explains by 44%)
const F2_ATTENUATION_SHARE = LN_F2 / (LN_F2 + LN_F3 + LN_F4); // ~0.922 (F2 dominates the offset)

export const IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK = {
  id: 'imp-33922',
  proofSection: 'S-frontier',
  question:
    'imp-33885 confirmed the analytic closed form E_flow = G L (L0^2-1)/(4 pi^2 N) ~ (log N)^3/N tracks ' +
    'the direct E_flow to machine precision (the raw-decay law), and imp-33843/imp-33884 pinned the ' +
    'head-to-tail widening of the attributed ratio roe = resid/eflow at 903.538 exact (~917.9 reported, ' +
    'a toFixed(1) artifact). Cross-check the analytic decay factor against the empirical widening: does ' +
    'the (log N)^3/N law, evaluated at the imp-33810 endpoints, reproduce the 903.538 widening, and by ' +
    'how much does it miss if taken alone? Accuracy/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'F1 = E_flow(6)/E_flow(11) in the direct form C_F (L/T0) G and the closed form G L (L0^2-1)/(4 pi^2 N); ' +
    'the widening roe(11)/roe(6) = F1*F2*F3*F4; the residual of "F1 alone predicts the widening"; and the ' +
    'exact reconstruction F1_closed*F2*F3*F4, with F2=E_N(11)/E_N(6), F3=sflow(6)/sflow(11), F4=resid(11)/resid(6)',
  factors: {
    F1_raw_eflow_decay_direct: +F1.toFixed(4), // 17992.1557 (the (log N)^3/N law, direct form)
    F1_raw_eflow_decay_closed: +F1_CLOSED.toFixed(4), // 17992.1557 (closed form -- agrees)
    F1_forms_rel_residual: +F1_FORMS_REL.toExponential(3), // ~2.0e-16 (machine floor)
    F2_normaliser_collapse: +F2.toFixed(6), // 0.063320
    F3_eflow_slope_ratio: +F3.toFixed(6), // 0.907093
    F4_resid_ratio: +F4.toFixed(6), // 0.874320
    attenuation_F2F3F4: +ATTENUATION.toExponential(5), // ~5.02184e-2
  },
  widening: {
    empirical_exact: +WIDENING.toFixed(5), // 903.53792 (imp-33884)
    analytic_raw_decay_alone_F1: +F1.toFixed(4), // 17992.1557 (F1 by itself)
    overprediction_factor: +OVERPREDICTION_FACTOR.toFixed(5), // 19.91301 (F1 / widening)
    closedform_reconstruction: +CLOSEDFORM_WIDENING.toFixed(5), // 903.53792 (F1_closed*F2*F3*F4)
  },
  residuals: {
    raw_decay_alone_vs_widening: +RAW_DECAY_VS_WIDENING_REL.toFixed(5), // 18.91301 (~1891% over-prediction)
    closedform_reconstruction_vs_widening: +CLOSEDFORM_WIDENING_REL.toExponential(3), // ~2.5e-16 (exact)
    raw_decay_log_share: +RAW_DECAY_LOG_SHARE.toFixed(5), // 1.43950 (over-explains ln-widening by 44%)
    F2_attenuation_log_share: +F2_ATTENUATION_SHARE.toFixed(4), // 0.9222 (F2 dominates the offset)
  },
  logDecomposition: {
    ln_widening: +LN_WIDENING.toFixed(5), // 6.80632
    ln_F1_raw_decay: +LN_F1.toFixed(5), // 9.79769
    ln_F2_normaliser: +LN_F2.toFixed(5), // -2.75955
    ln_F3_slope: +LN_F3.toFixed(5), // -0.09751
    ln_F4_resid: +LN_F4.toFixed(5), // -0.13431
  },
  finding: {
    R1_analytic_decay_reproduces_raw_F1:
      'The closed-form F1 from the (log N)^3/N law and the direct-form F1 both equal 17992.16, agreeing ' +
      'to rel ~2e-16: the analytic decay law nails the RAW head-to-tail E_flow decay to machine ' +
      'precision (imp-33885 per-rung; this is the endpoint slice).',
    R2_raw_decay_alone_overpredicts_widening_20x:
      'The empirical widening is 903.538 while the analytic raw decay F1 is 17992.16: F1/widening = ' +
      '19.913, a relative residual of ~1891% (18.913). The (log N)^3/N law captures the DRIVER of the ' +
      'widening but NOT its magnitude -- taken alone it over-predicts by ~19.9x -- because the ' +
      'attributed ratio roe divides E_flow by the normaliser E_N and multiplies by the slope and ' +
      'residual ratios, which the raw decay does not touch.',
    R3_gap_is_attribution_attenuation_dominated_by_F2:
      'The ~19.9x gap IS the attribution attenuation F2*F3*F4 = 0.05022. Re-inserting the closed-form ' +
      'F1 into the full product F1*F2*F3*F4 reproduces the exact 903.538 to rel ~2.5e-16. On a log ' +
      'scale the raw decay over-explains the widening by 144% (ln F1 / ln widening = 1.4395); the ' +
      'attenuation ln(F2*F3*F4) = -2.99 removes the 44% excess, and 92% of that attenuation is the E_N ' +
      'normaliser collapse F2 (ln F2 = -2.76) vs the slope (ln F3 = -0.098) and residual (ln F4 = -0.134).',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-CHECK (frontier-direction, NOT rigorous). The analytic (log N)^3/N decay law ' +
    'reproduces the RAW E_flow head-to-tail decay factor F1 = 17992.16 to machine precision (direct and ' +
    'closed forms agree to rel ~2e-16, imp-33885) but does NOT by itself reproduce the empirical ' +
    'widening 903.538 -- taken alone the raw decay over-predicts by a factor of 19.913 (relative ' +
    'residual ~1891%). The widening is that raw decay attenuated by the attribution factors ' +
    'F2*F3*F4 = 0.05022, which the analytic decay does not touch; re-inserting the closed-form F1 into ' +
    'the four-factor product recovers 903.538 exactly (rel ~2.5e-16). On a log scale the (log N)^3/N law ' +
    'over-explains ln-widening by 144% (ln F1 / ln widening = 1.4395), and 92% of the offsetting ' +
    'attenuation is the E_N normaliser collapse F2 (ln F2 = -2.76), not the slope or residual ratios. So ' +
    'the analytic decay is exactly ONE of the four multiplicative drivers of the widening -- the ' +
    'dominant one on a log scale -- but the empirical widening rate is set jointly by the normaliser ' +
    'collapse, not by the raw decay alone. The inherited imp-3220/imp-3406 component model is NOT a ' +
    'rigorous asymptotic; the closed-form scaling is exact WITHIN the model only; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33885 (the (log N)^3/N per-rung machine-floor match, raw decay F1); imp-33884 (exact 903.538 ' +
    'widening + F1..F4 factor decomposition); imp-33843 (the ~918x widening form fit); imp-33810 (the ' +
    '21 quarter-decade rungs); imp-28895 (the four-factor decomposition); lambda-rh-height-mapping (RvM ' +
    'height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK_ASSERTIONS = [
  {
    // (R1) The analytic (log N)^3/N closed form reproduces the raw E_flow decay F1 to machine precision.
    id: 'imp33922-analytic-decay-reproduces-raw-F1',
    description: 'closed-form F1 equals direct-form F1 ~17992 (rel < 1e-9), the raw (log N)^3/N decay',
    holds: () =>
      F1_FORMS_REL < 1e-9 && Math.abs(F1 - 17992.16) < 1 && Math.abs(F1_CLOSED - 17992.16) < 1,
  },
  {
    // (R2) The analytic raw decay ALONE over-predicts the empirical widening by ~19.9x (~1891%).
    id: 'imp33922-raw-decay-alone-overpredicts-widening',
    description: 'F1/widening in (19, 21) and rel residual (F1 vs 903.538) in (18, 20) -- big over-prediction',
    holds: () =>
      OVERPREDICTION_FACTOR > 19 &&
      OVERPREDICTION_FACTOR < 21 &&
      RAW_DECAY_VS_WIDENING_REL > 18 &&
      RAW_DECAY_VS_WIDENING_REL < 20,
  },
  {
    // (R3) Re-inserting the closed-form F1 into F1*F2*F3*F4 recovers the exact 903.538 to machine floor.
    id: 'imp33922-closedform-reconstructs-widening-exact',
    description: 'F1_closed*F2*F3*F4 equals the exact widening 903.538 to rel < 1e-12',
    holds: () =>
      CLOSEDFORM_WIDENING_REL < 1e-12 &&
      Math.abs(WIDENING - 903.53792) < 1e-3 &&
      Math.abs(CLOSEDFORM_WIDENING - 903.53792) < 1e-3,
  },
  {
    // (R3) The attenuation is dominated (log scale) by the E_N normaliser collapse F2, not slope/residual.
    id: 'imp33922-attenuation-dominated-by-normaliser-F2',
    description: 'raw-decay log share ~1.44 (over-explains) and F2 supplies >90% of the log attenuation',
    holds: () =>
      RAW_DECAY_LOG_SHARE > 1.4 &&
      RAW_DECAY_LOG_SHARE < 1.5 &&
      F2_ATTENUATION_SHARE > 0.9 &&
      ATTENUATION > 0.04 &&
      ATTENUATION < 0.06,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp33922-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK.verdict) &&
      /remains SOTA/.test(IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK.verdict),
  },
];

for (const a of IMP33922_EFLOW_ANALYTIC_DECAY_VS_WIDENING_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33922-eflow-analytic-decay-vs-widening-crosscheck assertion failed: ${a.id}`);
  }
}
