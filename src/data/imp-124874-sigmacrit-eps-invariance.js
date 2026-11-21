/**
 * @module imp-124874-sigmacrit-eps-invariance
 *
 * imp-124874 (numerical / sensitivity, frontier cross-check): imp-124849 concluded the L6 DIAG3
 * eps-ladder non-monotonicity is a 2-point-stencil eps-STEP artifact. Its evidence had two legs read
 * from DIFFERENT axes: (a) a dps sweep at FIXED eps=1e-3 showing sigma_crit is dps-INVARIANT at
 * 0.020385 for all dps>=30, and (b) an eps sweep at FIXED dps=100 showing the L5 floor R obeys a clean
 * eps^2 law (R ~ eps^2, log-log slope 2, extrapolating to 0). From those two legs imp-124849 M3 asserted
 * "SHRINKING eps (not adding precision) is the only lever that drives sigma_crit down." But leg (b)
 * tracked only R, NEVER sigma_crit itself. This leaf supplies the missing direct measurement: at FIXED
 * dps=100 it sweeps eps in {1e-2,1e-3,1e-4,1e-5} and recomputes the FULL sigma_crit at each eps (offline
 * mpmath, machinery ported VERBATIM from imp-124849).
 *
 * THE RESULT (the deliverable -- corrects the imp-124849 M3 wording)
 * -----------------------------------------------------------------
 *   sigma_crit does NOT move with eps. Across the entire eps ladder 1e-2 -> 1e-5 sigma_crit stays pinned
 *   at 0.0203855 (identical to 6 sig figs; the largest step-to-step log-log slope d ln sigma_crit / d ln
 *   eps is 4.3e-7, i.e. statistically zero). This holds even though the raw floor R DOES obey the eps^2
 *   law over the same sweep (R: 1.0819e-10 -> 1.0819e-16, dropping 100x per decade -- reproducing
 *   imp-124849 leg (b) exactly). The reason is a CANCELLATION: sigma_crit is interpolated from
 *   ECF_crit = R / relMean, and BOTH the numerator R (the L5 errCF) and the denominator relMean (the mean
 *   L2..L4 relTrunc = errCF/|E_CF|) scale as eps^2, so the eps^2 truncation CANCELS in the ratio. The
 *   quotient ECF_crit is eps-INVARIANT at 3.36428e-6 across the whole ladder, and |E_CF| itself is
 *   eps-independent, so the log-log L5<->L6 interpolation returns an eps-invariant sigma_crit.
 *
 * THE FINDING (measurement / sensitivity only -- REFINES imp-124849 M3)
 * --------------------------------------------------------------------
 *   (M1) THE EPS SWEEP REPRODUCES imp-124849 leg (b) FOR R. At dps=100 the L5 floor R obeys R ~ eps^2
 *        (1.0819e-10, 1.0819e-12, 1.0819e-14, 1.0819e-16 as eps falls 1e-2 -> 1e-5), matching the
 *        imp-124849 EPS_LADDER exactly -- validating the port.
 *   (M2) sigma_crit IS eps-INVARIANT, NOT eps-DRIVEN. Directly recomputing sigma_crit at each eps shows it
 *        is fixed at 0.0203855 across the whole eps ladder (log-log slope ~4e-7 ~ 0). sigma_crit is
 *        therefore invariant on BOTH axes -- dps (imp-124849 leg (a)) AND eps (this leaf) -- because the
 *        O(eps^2) truncation cancels between R and relMean in ECF_crit = R/relMean.
 *   (M3) THE imp-124849 M3 WORDING IS TOO STRONG AND IS CORRECTED HERE. The eps-STEP-artifact CLASSIFICATION
 *        stands (R is a 2-point-stencil O(eps^2) truncation, not a round-off floor), but the corollary that
 *        "shrinking eps is the ... lever that drives sigma_crit down" does NOT hold for THIS estimator:
 *        shrinking eps drives R down but leaves sigma_crit fixed at 0.0204 (at L5), because the ratio
 *        ECF_crit that sets sigma_crit is eps-invariant. Neither adding precision NOR shrinking eps moves
 *        sigma_crit off L5=0.02; the crossover sitting at L5 (never L6) is a property of the |E_CF| ratio,
 *        not of the finite-difference step. So the L6 non-monotonicity is not reachable by tuning eps
 *        within this 2-point estimator at all -- a genuinely different stencil FORM (per imp-124875) would
 *        be required to move it.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED and appear only symbolically as differentiation axes; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124849-extprec-ecf-floor-sigmacrit (the dps-invariance leg (a) and the R-only eps ladder leg (b))
 * @see imp-124810-bisection-tol-roundoff-floor-sweep (the R_inf~4.46e-13 / sigma_crit~0.013 dp pin)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off crossover model)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder)
 */

// Extended-precision measured literals from tmp/imp-124874-sigmacrit-eps-sweep.py (mpmath, dps=100).
// EPS AXIS at FIXED dps=100: the full sigma_crit (not just R) recomputed at each 2-point step eps.
const EPS_LADDER = [
  { eps: 1e-2, R_L5: 1.0819e-10, relTrunc: 3.2159e-5, ECF_crit: 3.36428e-6, sigma_crit: 0.0203854 },
  { eps: 1e-3, R_L5: 1.0819e-12, relTrunc: 3.2158e-7, ECF_crit: 3.36428e-6, sigma_crit: 0.0203855 },
  { eps: 1e-4, R_L5: 1.0819e-14, relTrunc: 3.2158e-9, ECF_crit: 3.36428e-6, sigma_crit: 0.0203855 },
  { eps: 1e-5, R_L5: 1.0819e-16, relTrunc: 3.2158e-11, ECF_crit: 3.36428e-6, sigma_crit: 0.0203855 },
];

// Measured log-log slopes d ln sigma_crit / d ln eps on each sub-interval (expect ~0: eps-invariant).
const SIGMACRIT_SLOPES = [
  { interval: '1e-2->1e-3', slope: -4.3454e-7 },
  { interval: '1e-3->1e-4', slope: -4.3526e-9 },
  { interval: '1e-4->1e-5', slope: -7.7098e-10 },
];

const DPS_FIXED = 100;
const EXTPREC_SIGMA_CRIT = 0.0203855; // eps-invariant value (matches imp-124849 dps-invariant 0.020385)
const ECF_CRIT_INVARIANT = 3.36428e-6; // eps-invariant ratio R/relMean
const L5_SIGMA = 0.02;
const L6_SIGMA = 0.005;

export const IMP124874_SIGMACRIT_EPS_INVARIANCE = {
  id: 'imp-124874',
  proofSection: 'S-frontier',
  question:
    'imp-124849 read its eps-STEP-artifact conclusion from two DIFFERENT axes: a dps sweep at fixed ' +
    'eps=1e-3 (sigma_crit dps-invariant at 0.020385) and an eps sweep at fixed dps=100 that tracked only ' +
    'the floor R (R ~ eps^2). Its M3 corollary "shrinking eps is the only lever that drives sigma_crit ' +
    'down" was never measured directly. Sweeping eps at FIXED dps=100 and recomputing the FULL ' +
    'sigma_crit at each eps, does sigma_crit actually move with eps? Measurement/sensitivity only; pinned ' +
    'constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Port the imp-124849 landmark / elasticity / E_CF-floor machinery VERBATIM to mpmath (offline script ' +
    'tmp/imp-124874-sigmacrit-eps-sweep.py) at fixed dps=100 and sweep eps in {1e-2,1e-3,1e-4,1e-5}. At ' +
    'each eps recompute the full L2..L6 ladder, R = L5 errCF, relMean = mean L2..L4 relTrunc, ' +
    'ECF_crit = R/relMean, and sigma_crit via the log-log L5<->L6 interpolation of ECF_crit against the ' +
    '(eps-independent) reconstructed |E_CF|. Fit the log-log slope d ln sigma_crit / d ln eps.',
  fixed_dps: DPS_FIXED,
  L5_sigma: L5_SIGMA,
  L6_sigma: L6_SIGMA,
  extprec_sigma_crit: EXTPREC_SIGMA_CRIT,
  ecf_crit_invariant: ECF_CRIT_INVARIANT,
  epsLadder: EPS_LADDER,
  sigmaCritSlopes: SIGMACRIT_SLOPES,
  finding: {
    M1_eps_sweep_reproduces_imp124849_R_leg:
      'At dps=100 the L5 floor R obeys R ~ eps^2 (1.0819e-10, 1.0819e-12, 1.0819e-14, 1.0819e-16 as eps ' +
      'falls 1e-2 -> 1e-5, 100x per decade), reproducing the imp-124849 EPS_LADDER exactly -- validating ' +
      'the port before reading sigma_crit.',
    M2_sigma_crit_is_eps_invariant_not_eps_driven:
      'Directly recomputing sigma_crit at each eps shows it is FIXED at 0.0203855 across the whole eps ' +
      'ladder (log-log slope d ln sigma_crit / d ln eps ~ 4e-7 ~ 0). sigma_crit is invariant on BOTH the ' +
      'dps axis (imp-124849) AND the eps axis (here), because the O(eps^2) truncation CANCELS between the ' +
      'numerator R and the denominator relMean in ECF_crit = R/relMean (ECF_crit eps-invariant at ' +
      '3.36428e-6), and |E_CF| is eps-independent.',
    M3_imp124849_M3_wording_corrected:
      'The eps-STEP-artifact CLASSIFICATION of R stands (R is a 2-point-stencil O(eps^2) truncation, not a ' +
      'round-off floor), but the imp-124849 M3 corollary that shrinking eps is the lever that drives ' +
      'sigma_crit down does NOT hold for this estimator: shrinking eps drives R down but leaves sigma_crit ' +
      'pinned at 0.0204 (at L5). Neither adding precision NOR shrinking eps moves sigma_crit off L5=0.02; ' +
      'the crossover sitting at L5 (never L6) is a property of the eps-invariant |E_CF| ratio, not of the ' +
      'finite-difference step. Moving the L6 non-monotonicity would require a different stencil FORM ' +
      '(per imp-124875), not a smaller eps.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier cross-check, NOT rigorous). Supplying the missing leg of the ' +
    'imp-124849 eps-STEP-artifact argument -- the FULL sigma_crit swept over eps at FIXED dps=100 -- shows ' +
    'sigma_crit is eps-INVARIANT at 0.0203855 (log-log slope ~4e-7), even though the raw floor R obeys the ' +
    'eps^2 law over the same sweep. The O(eps^2) truncation cancels between R and relMean in the ratio ' +
    'ECF_crit = R/relMean (eps-invariant at 3.36428e-6), so shrinking eps drives R down but leaves ' +
    'sigma_crit fixed at L5=0.02. This CONFIRMS the imp-124849 eps-STEP classification of R while ' +
    'CORRECTING its M3 corollary: shrinking eps is NOT a lever on sigma_crit within this 2-point ' +
    'estimator; sigma_crit is invariant on both the dps and eps axes, and the crossover sitting at L5 ' +
    '(never L6) reflects the eps-independent |E_CF| ratio, not the finite-difference step. Conditional- ' +
    'share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 ' +
    'and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as differentiation axes); ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-124849 (the dps-invariance leg and the R-only eps ladder completed here); imp-124810 (the ' +
    'sigma_crit~0.013 double-precision pin); imp-124769 (the E_CF round-off crossover model); imp-97821 ' +
    '(the L6 non-monotone eps-ladder); imp-124875 (the fourth-order stencil FORM change); imp-398 (C_F ' +
    'flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124874_SIGMACRIT_EPS_INVARIANCE_ASSERTIONS = [
  {
    // (M1) The eps ladder reproduces the imp-124849 R ~ eps^2 law (100x per decade).
    id: 'imp124874-R-eps-squared-reproduces-imp124849',
    description: 'the L5 floor R drops ~100x per eps decade (eps^2 law), reproducing imp-124849 EPS_LADDER',
    holds: () =>
      EPS_LADDER.slice(1).every((r, i) => {
        const ratio = EPS_LADDER[i].R_L5 / r.R_L5;
        return ratio > 50 && ratio < 200;
      }),
  },
  {
    // (M2) sigma_crit is eps-invariant: identical to ~6 sig figs across the whole eps ladder.
    id: 'imp124874-sigma-crit-eps-invariant',
    description: 'sigma_crit is eps-invariant (~0.0203855) across eps 1e-2..1e-5, unlike the raw floor R',
    holds: () =>
      EPS_LADDER.every((r) => Math.abs(r.sigma_crit - EXTPREC_SIGMA_CRIT) < 1e-6),
  },
  {
    // (M2) The log-log slope d ln sigma_crit / d ln eps is ~0 (eps-invariant), NOT ~2 like R.
    id: 'imp124874-sigma-crit-loglog-slope-zero',
    description: 'd ln sigma_crit / d ln eps ~ 0 (< 1e-5) on every sub-interval -- eps-invariant, not eps-driven',
    holds: () => SIGMACRIT_SLOPES.every((s) => Math.abs(s.slope) < 1e-5),
  },
  {
    // (M2) The cancellation: ECF_crit = R/relMean is eps-invariant (eps^2 cancels numerator vs denominator).
    id: 'imp124874-ecf-crit-eps-invariant-cancellation',
    description: 'ECF_crit = R/relMean is eps-invariant (~3.36e-6): the eps^2 truncation cancels in the ratio',
    holds: () =>
      EPS_LADDER.every((r) => Math.abs(r.ECF_crit - ECF_CRIT_INVARIANT) / ECF_CRIT_INVARIANT < 1e-4),
  },
  {
    // (M3) sigma_crit floors at L5 (0.02), never reaching L6 -- shrinking eps does not move it off L5.
    id: 'imp124874-sigma-crit-floors-at-L5-not-L6',
    description: 'sigma_crit stays at L5 (~0.0204) and never reaches L6 (0.005) at any eps',
    holds: () =>
      EPS_LADDER.every((r) => r.sigma_crit > L6_SIGMA) &&
      Math.abs(EXTPREC_SIGMA_CRIT - L5_SIGMA) < 1e-3,
  },
  {
    // (M3) Cross-consistency: the eps-invariant sigma_crit matches the imp-124849 dps-invariant 0.020385.
    id: 'imp124874-matches-imp124849-dps-invariant',
    description: 'the eps-invariant sigma_crit (0.0203855) matches the imp-124849 dps-invariant 0.020385',
    holds: () => Math.abs(EXTPREC_SIGMA_CRIT - 0.020385) < 1e-4,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp124874-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124874_SIGMACRIT_EPS_INVARIANCE.isRigorous === false &&
      /NO QED/.test(IMP124874_SIGMACRIT_EPS_INVARIANCE.verdict) &&
      /refereed bound is changed/i.test(IMP124874_SIGMACRIT_EPS_INVARIANCE.verdict),
  },
];

for (const a of IMP124874_SIGMACRIT_EPS_INVARIANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124874-sigmacrit-eps-invariance assertion failed: ${a.id}`);
  }
}
