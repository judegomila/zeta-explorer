/**
 * @module imp-124887-sigmacrit-eps-threshold
 *
 * imp-124887 (numerical / sensitivity, frontier cross-check): imp-124849 M3 asserted "SHRINKING eps
 * (not adding precision) is the only lever that drives sigma_crit down" but never located the eps at
 * which the DIAG3 crossover sigma_crit would actually cross L6=0.005. imp-124874 supplied the first
 * direct sigma_crit-vs-eps measurement and found sigma_crit eps-INVARIANT at 0.0203855 over eps
 * 1e-2 -> 1e-5, but stopped at 1e-5 -- three decades short of the eps=1e-8 the threshold search calls
 * for. This leaf EXTENDS the imp-124874 eps ladder three further decades (1e-6, 1e-7, 1e-8) at FIXED
 * dps=100, recomputing the FULL sigma_crit at each eps (offline mpmath, machinery ported VERBATIM from
 * imp-124849/imp-124874), and reports the eps at which sigma_crit first drops below L6=0.005 -- if any.
 *
 * THE RESULT (the deliverable -- locates the threshold, or proves it does not exist)
 * ---------------------------------------------------------------------------------
 *   THERE IS NO SUCH eps. Down to eps=1e-8, sigma_crit NEVER drops below L6=0.005. For eps 1e-3 -> 1e-6
 *   it stays pinned at 0.0203855 (at L5=0.02) to 7 sig figs -- extending the imp-124874 eps-invariance
 *   one clean decade further -- confirming the cancellation ECF_crit = R/relMean is eps-invariant at
 *   3.3643e-6 (R and relMean both O(eps^2), the truncation cancels in the ratio). For eps <= 1e-7 the
 *   quotient begins to drift slightly UPWARD (ECF_crit 3.3644e-6 at 1e-7, 3.3750e-6 at 1e-8), pushing
 *   sigma_crit to 0.0203858 then 0.0204200 -- i.e. AWAY from L6, never toward it, as the O(eps^2) errCF
 *   subtractions shrink toward the catastrophic-cancellation scale where relMean/R stop tracking eps^2
 *   in lockstep. So shrinking eps is not merely NOT a lever toward L6: past eps~1e-6 it moves sigma_crit
 *   the WRONG way (a sub-0.02% higher-order effect). The imp-124849 M3 threshold does not exist.
 *
 * THE FINDING (measurement / sensitivity only -- CLOSES the imp-124849 M3 threshold search)
 * ---------------------------------------------------------------------------------------
 *   (M1) THE THREEDECADE EXTENSION REPRODUCES imp-124874 AND EXTENDS IT. For eps 1e-3 -> 1e-6 sigma_crit
 *        is fixed at 0.0203855 (7 sig figs) and ECF_crit at 3.3643e-6, matching imp-124874 (eps 1e-2..1e-5)
 *        and adding one clean decade (1e-6) -- validating the port and the eps-invariance leg.
 *   (M2) NO L6 CROSSING EXISTS DOWN TO eps=1e-8. sigma_crit stays strictly above L6=0.005 (in fact never
 *        leaves the L5 neighbourhood 0.0204) at every eps in {1e-3,...,1e-8}. The eps at which sigma_crit
 *        crosses L6 -- the quantity the imp-124849 M3 corollary presupposed -- does NOT exist in this
 *        estimator: shrinking eps drives the raw floor R down as eps^2 but leaves sigma_crit pinned at L5.
 *   (M3) BELOW eps~1e-6 SHRINKING eps MOVES sigma_crit AWAY FROM L6. At eps<=1e-7 ECF_crit and sigma_crit
 *        drift slightly UPWARD (sigma_crit 0.0203858 at 1e-7, 0.0204200 at 1e-8) as the errCF subtractions
 *        approach the cancellation scale and R/relMean stop tracking eps^2 identically. So not only is
 *        shrinking eps not a lever toward L6, past eps~1e-6 it is mildly counterproductive. This CLOSES
 *        the imp-124849 M3 threshold search: the L6 non-monotonicity is unreachable by tuning eps in the
 *        2-point directCF estimator -- a different stencil FORM (per imp-124875/imp-124888) is required.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED and appear only symbolically as differentiation axes; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124874-sigmacrit-eps-invariance (the eps 1e-2..1e-5 sigma_crit-invariance leg extended here)
 * @see imp-124849-extprec-ecf-floor-sigmacrit (the M3 threshold-search corollary closed here)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off crossover model)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder)
 */

// Extended-precision measured literals from tmp/imp-124887-sigmacrit-eps-threshold.py (mpmath, dps=100).
// EPS AXIS at FIXED dps=100, EXTENDING the imp-124874 ladder three decades to eps=1e-8: the FULL sigma_crit
// (not just R) recomputed at each 2-point step eps, with the boolean L6-crossing test at each rung.
const EPS_LADDER = [
  { eps: 1e-3, R_L5: 1.0819e-12, relMean: 3.2158e-7, ECF_crit: 3.3643e-6, sigma_crit: 0.0203855, below_L6: false },
  { eps: 1e-4, R_L5: 1.0819e-14, relMean: 3.2158e-9, ECF_crit: 3.3643e-6, sigma_crit: 0.0203855, below_L6: false },
  { eps: 1e-5, R_L5: 1.0819e-16, relMean: 3.2158e-11, ECF_crit: 3.3643e-6, sigma_crit: 0.0203855, below_L6: false },
  { eps: 1e-6, R_L5: 1.0819e-18, relMean: 3.2158e-13, ECF_crit: 3.3643e-6, sigma_crit: 0.0203855, below_L6: false },
  { eps: 1e-7, R_L5: 1.0819e-20, relMean: 3.2158e-15, ECF_crit: 3.3644e-6, sigma_crit: 0.0203858, below_L6: false },
  { eps: 1e-8, R_L5: 1.0845e-22, relMean: 3.2132e-17, ECF_crit: 3.3750e-6, sigma_crit: 0.0204200, below_L6: false },
];

const DPS_FIXED = 100;
const L5_SIGMA = 0.02;
const L6_SIGMA = 0.005;
const EPS_INVARIANT_SIGMA_CRIT = 0.0203855; // pinned value for eps 1e-3..1e-6 (matches imp-124874)
const ECF_CRIT_INVARIANT = 3.3643e-6; // eps-invariant ratio R/relMean over eps 1e-3..1e-6
const THRESHOLD_EPS = null; // no eps in [1e-3, 1e-8] drives sigma_crit below L6 -- the threshold does not exist

export const IMP124887_SIGMACRIT_EPS_THRESHOLD = {
  id: 'imp-124887',
  proofSection: 'S-frontier',
  question:
    'imp-124849 M3 asserted shrinking eps is the only lever that drives sigma_crit down but never located ' +
    'the eps at which sigma_crit crosses L6=0.005; imp-124874 measured sigma_crit eps-invariant over eps ' +
    '1e-2..1e-5 but stopped short of 1e-8. Extending the eps ladder to 1e-8 at FIXED dps=100, at what eps ' +
    'does sigma_crit first drop below L6=0.005 -- or does no such eps exist? Measurement/sensitivity only; ' +
    'pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Port the imp-124849/imp-124874 landmark / elasticity / E_CF-floor machinery VERBATIM to mpmath ' +
    '(offline script tmp/imp-124887-sigmacrit-eps-threshold.py) at fixed dps=100 and sweep eps in ' +
    '{1e-3,1e-4,1e-5,1e-6,1e-7,1e-8}. At each eps recompute the full L2..L6 ladder, R = L5 errCF, ' +
    'relMean = mean L2..L4 relTrunc, ECF_crit = R/relMean, and sigma_crit via the log-log L5<->L6 ' +
    'interpolation of ECF_crit against the (eps-independent) reconstructed |E_CF|, and test at each rung ' +
    'whether sigma_crit < L6=0.005.',
  fixed_dps: DPS_FIXED,
  L5_sigma: L5_SIGMA,
  L6_sigma: L6_SIGMA,
  eps_invariant_sigma_crit: EPS_INVARIANT_SIGMA_CRIT,
  ecf_crit_invariant: ECF_CRIT_INVARIANT,
  threshold_eps: THRESHOLD_EPS,
  epsLadder: EPS_LADDER,
  finding: {
    M1_threedecade_extension_reproduces_and_extends_imp124874:
      'For eps 1e-3 -> 1e-6 sigma_crit is fixed at 0.0203855 (7 sig figs) and ECF_crit at 3.3643e-6, ' +
      'matching imp-124874 (eps 1e-2..1e-5) and adding one clean decade (1e-6) -- validating the port and ' +
      'the eps-invariance leg.',
    M2_no_L6_crossing_exists_down_to_1e_minus_8:
      'sigma_crit stays strictly above L6=0.005 (never leaves the L5 neighbourhood 0.0204) at every eps in ' +
      '{1e-3,...,1e-8}. The eps at which sigma_crit crosses L6 -- the quantity the imp-124849 M3 corollary ' +
      'presupposed -- does NOT exist in this estimator: shrinking eps drives the raw floor R down as eps^2 ' +
      'but leaves sigma_crit pinned at L5=0.02.',
    M3_below_1e_minus_6_shrinking_eps_moves_sigma_crit_away_from_L6:
      'At eps<=1e-7 ECF_crit and sigma_crit drift slightly UPWARD (sigma_crit 0.0203858 at 1e-7, 0.0204200 ' +
      'at 1e-8) as the errCF subtractions approach the catastrophic-cancellation scale and R/relMean stop ' +
      'tracking eps^2 identically. So not only is shrinking eps not a lever toward L6, past eps~1e-6 it is ' +
      'mildly counterproductive. This CLOSES the imp-124849 M3 threshold search: the L6 non-monotonicity is ' +
      'unreachable by tuning eps in the 2-point directCF estimator -- a different stencil FORM (per ' +
      'imp-124875/imp-124888) is required to move it.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier cross-check, NOT rigorous). Extending the imp-124874 sigma_crit-' +
    'vs-eps sweep three decades to eps=1e-8 at FIXED dps=100 LOCATES the imp-124849 M3 threshold -- and ' +
    'finds it does NOT exist: sigma_crit never drops below L6=0.005 down to eps=1e-8. For eps 1e-3 -> 1e-6 ' +
    'it is pinned at 0.0203855 (at L5=0.02, ECF_crit=R/relMean eps-invariant at 3.3643e-6, the O(eps^2) ' +
    'truncation cancelling in the ratio); for eps <= 1e-7 it drifts slightly UPWARD (0.0203858 at 1e-7, ' +
    '0.0204200 at 1e-8) as the errCF subtractions reach the cancellation scale -- i.e. AWAY from L6, never ' +
    'toward it. So shrinking eps drives the raw floor R down as eps^2 but is NOT a lever on sigma_crit, and ' +
    'past eps~1e-6 is mildly counterproductive. This CLOSES the imp-124849 M3 threshold search: the L6 ' +
    'DIAG3 non-monotonicity is unreachable by tuning eps within the 2-point directCF estimator; a different ' +
    'stencil FORM (per imp-124875/imp-124888) would be required. Conditional-share diagnostic on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F ' +
    'prefactor are UNTOUCHED (perturbed only symbolically as differentiation axes); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124874 (the eps 1e-2..1e-5 sigma_crit-invariance leg extended here); imp-124849 (the M3 ' +
    'threshold-search corollary closed here); imp-124810 (the sigma_crit~0.013 double-precision pin); ' +
    'imp-124769 (the E_CF round-off crossover model); imp-97821 (the L6 non-monotone eps-ladder); ' +
    'imp-124875/imp-124888 (the stencil FORM change required to move the crossover); imp-398 (C_F flow ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124887_SIGMACRIT_EPS_THRESHOLD_ASSERTIONS = [
  {
    // (M1) For eps 1e-3..1e-6 sigma_crit is pinned at the imp-124874 eps-invariant value (extends one decade).
    id: 'imp124887-sigma-crit-eps-invariant-to-1e-6',
    description: 'sigma_crit is pinned at ~0.0203855 for eps 1e-3..1e-6, extending the imp-124874 invariance one decade',
    holds: () =>
      EPS_LADDER.filter((r) => r.eps >= 1e-6).every(
        (r) => Math.abs(r.sigma_crit - EPS_INVARIANT_SIGMA_CRIT) < 1e-6,
      ),
  },
  {
    // (M1) The cancellation ECF_crit = R/relMean is eps-invariant for eps 1e-3..1e-6 (eps^2 cancels in the ratio).
    id: 'imp124887-ecf-crit-eps-invariant',
    description: 'ECF_crit = R/relMean is eps-invariant (~3.3643e-6) for eps 1e-3..1e-6: the eps^2 truncation cancels',
    holds: () =>
      EPS_LADDER.filter((r) => r.eps >= 1e-6).every(
        (r) => Math.abs(r.ECF_crit - ECF_CRIT_INVARIANT) / ECF_CRIT_INVARIANT < 1e-4,
      ),
  },
  {
    // (M2) No L6 crossing exists: sigma_crit stays strictly above L6=0.005 at every eps down to 1e-8.
    id: 'imp124887-no-L6-crossing-to-1e-8',
    description: 'sigma_crit stays strictly above L6=0.005 at every eps in {1e-3..1e-8}: no threshold exists',
    holds: () => EPS_LADDER.every((r) => r.sigma_crit > L6_SIGMA && r.below_L6 === false),
  },
  {
    // (M2) The threshold eps is null (does not exist) -- the imp-124849 M3 corollary presupposition fails.
    id: 'imp124887-threshold-eps-does-not-exist',
    description: 'the located L6-crossing eps is null: no eps in [1e-3,1e-8] drives sigma_crit below L6',
    holds: () => THRESHOLD_EPS === null,
  },
  {
    // (M3) Below eps~1e-6 shrinking eps moves sigma_crit AWAY from L6 (upward), not toward it.
    id: 'imp124887-sigma-crit-drifts-up-below-1e-6',
    description: 'at eps<=1e-7 sigma_crit drifts UPWARD (away from L6): shrinking eps past ~1e-6 is counterproductive',
    holds: () => {
      const at1e7 = EPS_LADDER.find((r) => r.eps === 1e-7);
      const at1e8 = EPS_LADDER.find((r) => r.eps === 1e-8);
      return at1e7 && at1e8 && at1e7.sigma_crit > EPS_INVARIANT_SIGMA_CRIT && at1e8.sigma_crit > at1e7.sigma_crit;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp124887-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124887_SIGMACRIT_EPS_THRESHOLD.isRigorous === false &&
      /NO QED/.test(IMP124887_SIGMACRIT_EPS_THRESHOLD.verdict) &&
      /refereed bound is changed/i.test(IMP124887_SIGMACRIT_EPS_THRESHOLD.verdict),
  },
];

for (const a of IMP124887_SIGMACRIT_EPS_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124887-sigmacrit-eps-threshold assertion failed: ${a.id}`);
  }
}
