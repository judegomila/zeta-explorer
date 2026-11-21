/**
 * @module imp-34398-eflow-resid-pole-residue-channel-reconciliation
 * @fileoverview imp-34398 -- RECONCILE the two residue readings of the SAME resid_exp
 *   simple pole at k* ~ 21.28095:
 *     - imp-34310 (raw-ratio channel): eflow_over_resid = eflow_attr / resid_exp has a SIMPLE
 *       pole with leading Laurent residue R ~ -1.979e-8.
 *     - imp-34247 (log-derivative channel): dy/dk = d/dk ln(eflow_over_resid) has a simple pole
 *       with residue EXACTLY +1 (in k* - k units).
 *   Both modules read the SAME pole as simple, but report residues that differ by ~8 orders of
 *   magnitude AND by sign. This module DERIVES the transformation relating the two via the
 *   resid_exp local slope m and confirms they are MUTUALLY CONSISTENT -- they are the
 *   COEFFICIENT and the EXPONENT of a single leading Laurent monomial, not two estimates of one
 *   number, so they neither should nor can be equal. Measurement / derivation only; NO QED.
 *
 *   Import-light per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]: this
 *   module imports NOTHING (no lambda-rh-height-mapping / polymath15-constant-C-C chain, no zeros
 *   bundle). The imp-34310 slope m, eflow_attr(k*) = E_star and residue R, and the imp-34247
 *   near-pole residue landmark +1.013, are carried as baked REFERENCE literals; the reconciling
 *   identity is re-derived on the self-contained leading monomial, not by re-running either pipeline.
 *
 *   THE TRANSFORMATION (the two residues are coefficient vs exponent of ONE monomial).
 *   --------------------------------------------------------------------------------
 *   resid_exp has a simple (order-1) zero at k*: resid_exp(k) = m (k - k*) + O((k-k*)^2), m < 0
 *   (imp-34310 F1, m ~ -2.3156e-7). eflow_attr(k) is smooth and nonzero at k* (E_star ~ 4.583e-15,
 *   imp-34310 F2). Hence near k* the ratio collapses to a single leading Laurent monomial
 *       g(k) = eflow_over_resid(k) = E_star / (m (k - k*)) + O(1) = R (k - k*)^p ,
 *   with EXPONENT p = -1 (simple pole) and COEFFICIENT (Laurent residue) R = E_star / m.
 *
 *     (T1) RAW-RATIO CHANNEL (imp-34310) reads the COEFFICIENT R = E_star / m ~ -1.979e-8.
 *          This carries the amplitude E_star and the slope m; it has the units of the ratio g and
 *          its sign is sign(E_star)/sign(m) = (+)/(-) = negative.
 *     (T2) LOG-DERIVATIVE CHANNEL (imp-34247) reads the EXPONENT. Since ln g = ln|R| + p ln(k-k*),
 *              dy/dk = d/dk ln g = p / (k - k*)  =>  residue in (k - k*) is p = -1,
 *          i.e. +1 in the imp-34247 (k* - k) convention. The COEFFICIENT R CANCELS in the ratio
 *          g_prime / g -- which is exactly why the log channel reads a clean, dimensionless +1
 *          regardless of how small or what sign R is. (This is the imp-34333 argument-principle
 *          fact residue(f_prime/f) = order, viewed here as the exponent of the SAME monomial that
 *          imp-34310 read the coefficient of.)
 *
 *   THE CONSISTENCY VERDICT.
 *   -----------------------
 *   The two residues are NOT in tension: they are orthogonal features of one Laurent monomial
 *   g ~ R (k - k*)^p. imp-34310 measures R (coefficient, units of g, sign from E_star/m);
 *   imp-34247 measures -p (exponent = pole order, dimensionless, always +1 for a simple pole of
 *   ANY nonzero R). Neither determines the other: from +1 alone the amplitude R is unrecoverable
 *   (it cancels); from R alone the order is unrecoverable (need a second flank / the log channel).
 *   The single quantity the two channels SHARE is the resid_exp local slope m: it sets the
 *   coefficient (R = E_star / m) and its non-vanishing (m != 0) is what makes the zero order-1,
 *   fixing the exponent p = -1. So m is the bridge; the two residues are the amplitude-and-order
 *   pair of the one monomial m drives. Mutually consistent, non-redundant.
 *
 *   NUMERIC DEMONSTRATION (this module, on the leading monomial g(k) = R / (k - k*)).
 *   ------------------------------------------------------------------------------
 *     (D1) COEFFICIENT recovery: (k - k*) g(k) = R exactly -> reproduces imp-34310 R ~ -1.979e-8.
 *     (D2) EXPONENT recovery: (k* - k) d/dk ln|g| -> +1 (central difference lands 1.0034 at h=gap/10)
 *          -> reproduces imp-34247 residue +1, and it is INDEPENDENT of R (D3).
 *     (D3) COEFFICIENT-INDEPENDENCE of the exponent: rescaling R by ~5e7 (to -1.0) leaves the
 *          log-derivative residue unchanged to < 1e-6 -- the coefficient cancels in g_prime/g.
 *     (D4) SINGLE-MONOMIAL cross-check: the SAME g reproduces the imp-34310 near-flank ratio
 *          g(21.25) ~ +6.39e-7 (imp-34310 F3 measured +5.9e-7, ~8% high) AND the imp-34247
 *          near-pole residue landmark +1.013 -- one monomial, both channel readings.
 *
 *   VERDICT: the imp-34310 residue R ~ -1.979e-8 (raw-ratio channel) and the imp-34247 residue
 *   +1 (log-derivative channel) are MUTUALLY CONSISTENT -- the COEFFICIENT and the EXPONENT of the
 *   single leading Laurent monomial g(k) ~ R (k - k*)^{-1} of the same simple pole, bridged by the
 *   resid_exp local slope m via R = E_star / m and (m != 0) => order-1 => exponent -1 => log-residue
 *   +1. They differ by ~8 orders and by sign precisely because they are a coefficient and a
 *   dimensionless order, not two readings of one quantity. DERIVATION / MEASUREMENT on a
 *   self-contained leading monomial, NOT the inherited pipeline; the component model is the
 *   inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per
 *   imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (raw-ratio channel residue R ~ -1.979e-8)
 *   @see imp-34247-widening-slope-pole-divergence.js (log-derivative channel residue EXACTLY +1)
 *   @see imp-34333-residue-plus-one-estimator-invariance.js (residue of log-derivative = zero order; amplitude cancels)
 *   @see imp-34246-widening-slope-limit-analytic-derivation.js (the widening-slope background scale)
 */

// --- baked reference literals (imp-34310 raw-ratio channel) --------------------
const KSTAR = 21.28095; // canonical bisected resid_exp zero (imp-34023 / imp-34237 / imp-34310)
const M_SLOPE = -2.3156e-7; // imp-34310 F1 local slope dg_resid/dk at the zero
const E_STAR = 4.582753e-15; // imp-34310 F2 eflow_attr interpolated to k* (smooth, nonzero)
const IMP34310_RESIDUE = -1.97909e-8; // imp-34310 F3 raw-ratio leading Laurent residue R = E_star/m

// --- baked reference literal (imp-34247 log-derivative channel) -----------------
const IMP34247_RESIDUE_NEAR_POLE = 1.013; // imp-34247 R1 (k*-k) dy/dk at k=21.275 -> +1
const IMP34310_NEAR_FLANK_RATIO = 5.9e-7; // imp-34310 measured eflow_over_resid at k=21.25

// --- the leading Laurent monomial g(k) = R (k - k*)^{-1} = E_star/(m (k - k*)) --
// COEFFICIENT R = E_star / m (the imp-34310 raw-ratio residue), EXPONENT p = -1 (simple pole).
export const IMP34398_COEFFICIENT_R = E_STAR / M_SLOPE; // -> -1.97909e-8, reproduces imp-34310
function gLead(k, R) {
  return R / (k - KSTAR);
}

// (D1) COEFFICIENT recovery: (k - k*) g(k) = R exactly, at any k.
export const IMP34398_COEFFICIENT_RECOVERED =
  (21.25 - KSTAR) * gLead(21.25, IMP34398_COEFFICIENT_R); // === R

// (D2/D3) EXPONENT recovery: (k* - k) d/dk ln|g| -> +1, independent of R.
// symmetric central difference of ln|g| at k = k* - gap (strictly below the pole).
function logDerivResidue(k, R) {
  const gap = KSTAR - k;
  const h = gap / 10; // step below the pole; O(h^2) error only
  const dydk =
    (Math.log(Math.abs(gLead(k + h, R))) - Math.log(Math.abs(gLead(k - h, R)))) / (2 * h);
  return gap * dydk; // (k* - k) dy/dk -> exponent magnitude -p = +1
}
export const IMP34398_EXPONENT_FROM_CANONICAL_R = logDerivResidue(21.275, IMP34398_COEFFICIENT_R); // ~1.0034
const R_RESCALED = -1.0; // coefficient rescaled by ~5e7 (invariance stress)
export const IMP34398_EXPONENT_FROM_RESCALED_R = logDerivResidue(21.275, R_RESCALED); // ~1.0034, matches

// (D4) single-monomial cross-check: the SAME g reproduces the imp-34310 near-flank ratio.
export const IMP34398_NEAR_FLANK_PREDICTED = gLead(21.25, IMP34398_COEFFICIENT_R); // ~+6.39e-7

export const IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION = {
  ticket: 'imp-34398',
  proofSection: 'S-frontier',
  question:
    'Reconcile the imp-34310 eflow_over_resid simple-pole residue R ~ -1.979e-8 (raw-ratio channel) ' +
    'against the imp-34247 residue-EXACTLY-+1 reading of the SAME k* ~ 21.28095 pole (log-derivative ' +
    'channel). Derive the transformation relating the two residues via the resid_exp local slope and ' +
    'assess whether they are mutually consistent. Measurement only; NO QED.',
  kStar: KSTAR,
  residSlope: M_SLOPE, // m, the shared bridge quantity
  eflowAttrAtKStar: E_STAR, // E_star
  transformation:
    'Near k* the ratio collapses to a single leading Laurent monomial g(k) = eflow_over_resid(k) = ' +
    'E_star / (m (k - k*)) + O(1) = R (k - k*)^p with COEFFICIENT R = E_star/m (imp-34310) and EXPONENT ' +
    'p = -1 (simple pole). imp-34310 reads the COEFFICIENT R ~ -1.979e-8 (units of g, sign E_star/m < 0); ' +
    'imp-34247 reads -p = +1 via dy/dk = d/dk ln g = p/(k - k*), in which R CANCELS (dimensionless order). ' +
    'The two are the coefficient and exponent of ONE monomial, bridged by m: R = E_star/m sets the ' +
    'coefficient, m != 0 makes the zero order-1 and fixes the exponent p = -1 => log-residue +1.',
  imp34310RawRatioResidue: IMP34310_RESIDUE, // R ~ -1.979e-8 (coefficient)
  imp34247LogDerivResidue: 1, // +1 (exponent / order)
  imp34247NearPoleLandmark: IMP34247_RESIDUE_NEAR_POLE, // 1.013 baked reference
  coefficientR: IMP34398_COEFFICIENT_R, // E_star/m, reproduces imp-34310
  coefficientRecovered: IMP34398_COEFFICIENT_RECOVERED, // (k-k*) g = R exactly
  exponentFromCanonicalR: IMP34398_EXPONENT_FROM_CANONICAL_R, // (k*-k) dy/dk ~ 1.003
  exponentFromRescaledR: IMP34398_EXPONENT_FROM_RESCALED_R, // ~1.003, coefficient-independent
  nearFlankPredicted: IMP34398_NEAR_FLANK_PREDICTED, // ~+6.39e-7 (imp-34310 measured +5.9e-7)
  finding: {
    T1_raw_ratio_reads_coefficient:
      'The imp-34310 raw-ratio residue R = E_star/m ~ -1.979e-8 is the COEFFICIENT of the leading ' +
      'Laurent monomial g ~ R (k - k*)^{-1}; it carries the amplitude E_star and slope m, has units of ' +
      'the ratio g, and is negative because E_star > 0 and m < 0.',
    T2_log_deriv_reads_exponent:
      'The imp-34247 residue +1 is minus the EXPONENT p = -1 of the same monomial: dy/dk = d/dk ln g = ' +
      'p/(k - k*), so the coefficient R cancels and the log channel reads the dimensionless order +1 for ' +
      'ANY nonzero R -- confirmed numerically, unchanged to < 1e-6 when R is rescaled by ~5e7.',
    T3_bridge_is_the_local_slope:
      'The single quantity both channels share is the resid_exp local slope m: R = E_star/m (coefficient) ' +
      'and m != 0 => order-1 zero => exponent -1 => log-residue +1. m is the bridge; the two residues are ' +
      'the amplitude-and-order pair of the one monomial m drives.',
    T4_single_monomial_cross_check:
      'The SAME g reproduces BOTH channel readings: the imp-34310 near-flank ratio g(21.25) ~ +6.39e-7 ' +
      '(measured +5.9e-7, ~8% high per imp-34310 F3) AND the imp-34247 near-pole residue landmark +1.013.',
    verdict_consistent:
      'MUTUALLY CONSISTENT and NON-REDUNDANT: coefficient vs exponent of one Laurent monomial, differing ' +
      'by ~8 orders and by sign precisely because one is an amplitude (units of g) and the other a ' +
      'dimensionless order -- not two readings of a single number.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / RECONCILIATION. The imp-34310 residue R ~ -1.979e-8 (raw-ratio channel) and the ' +
    'imp-34247 residue +1 (log-derivative channel) of the SAME resid_exp simple pole at k* ~ 21.28095 ' +
    'are MUTUALLY CONSISTENT: they are the COEFFICIENT R = E_star/m and (minus) the EXPONENT p = -1 of ' +
    'the single leading Laurent monomial g(k) = eflow_over_resid(k) ~ R (k - k*)^{-1}. imp-34310 reads ' +
    'the coefficient (amplitude E_star and slope m, units of g, sign E_star/m < 0); imp-34247 reads the ' +
    'exponent via dy/dk = p/(k - k*), in which R cancels, giving the dimensionless order +1 for ANY ' +
    'nonzero R (numerically unchanged to < 1e-6 under a ~5e7 rescale of R). The resid_exp local slope m ' +
    'is the bridge: R = E_star/m and m != 0 => order-1 => exponent -1 => log-residue +1. The two residues ' +
    'differ by ~8 orders and by sign precisely because they are an amplitude and a dimensionless order, ' +
    'not two estimates of one quantity, and neither determines the other. DERIVATION / MEASUREMENT on a ' +
    'self-contained leading monomial, NOT the inherited pipeline; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.',
  citation:
    'imp-34310 (raw-ratio residue R ~ -1.979e-8, slope m, E_star); imp-34247 (log-derivative residue ' +
    '+1); imp-34333 (residue of log-derivative = zero order, amplitude cancels); imp-34246 (widening ' +
    'background scale); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0).',
};

export const IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION_ASSERTIONS = [
  {
    // (T1) coefficient channel reproduces the imp-34310 raw-ratio residue R = E_star/m exactly.
    id: 'imp34398-coefficient-reproduces-imp34310',
    description: 'R = E_star/m reproduces the imp-34310 raw-ratio residue ~-1.979e-8 (negative, E_star/m sign)',
    holds: () =>
      IMP34398_COEFFICIENT_R < 0 &&
      Math.abs(IMP34398_COEFFICIENT_R - IMP34310_RESIDUE) < 1e-12 &&
      Math.abs(IMP34398_COEFFICIENT_RECOVERED - IMP34398_COEFFICIENT_R) < 1e-24,
  },
  {
    // (T2) exponent channel reproduces the imp-34247 residue +1 from the same monomial.
    id: 'imp34398-exponent-reproduces-imp34247',
    description: '(k*-k) d/dk ln|g| -> +1, reproducing the imp-34247 residue and near-pole landmark +1.013',
    holds: () =>
      Math.abs(IMP34398_EXPONENT_FROM_CANONICAL_R - 1) < 0.01 &&
      Math.abs(IMP34398_EXPONENT_FROM_CANONICAL_R - IMP34247_RESIDUE_NEAR_POLE) < 0.02,
  },
  {
    // (T3) the exponent is coefficient-independent: rescaling R by ~5e7 leaves the log-residue unchanged.
    id: 'imp34398-exponent-coefficient-independent',
    description: 'rescaling R by ~5e7 (to -1.0) leaves the log-derivative residue unchanged to < 1e-6',
    holds: () =>
      Math.abs(R_RESCALED / IMP34398_COEFFICIENT_R) > 1e7 &&
      Math.abs(IMP34398_EXPONENT_FROM_RESCALED_R - IMP34398_EXPONENT_FROM_CANONICAL_R) < 1e-6,
  },
  {
    // (T4) the residues differ by ~8 orders and by sign -- coefficient vs dimensionless order, not equal.
    id: 'imp34398-residues-differ-by-orders-and-sign',
    description: 'the two residues differ by ~8 orders of magnitude AND by sign (coefficient vs exponent)',
    holds: () => {
      const ratio = Math.abs(1 / IMP34398_COEFFICIENT_R); // |+1| / |R|
      return ratio > 1e7 && ratio < 1e9 && IMP34398_COEFFICIENT_R < 0;
    },
  },
  {
    // (T4b) single-monomial cross-check: same g predicts the imp-34310 near-flank ratio within ~15%.
    id: 'imp34398-single-monomial-near-flank',
    description: 'the same g predicts the imp-34310 near-flank ratio g(21.25) ~ +6.39e-7 (measured +5.9e-7) to ~15%',
    holds: () =>
      IMP34398_NEAR_FLANK_PREDICTED > 0 &&
      Math.abs(IMP34398_NEAR_FLANK_PREDICTED / IMP34310_NEAR_FLANK_RATIO - 1) < 0.15,
  },
  {
    // Honesty gate: measurement/derivation only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34398-honesty-gate-no-qed',
    description: 'measurement/derivation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION.verdict),
  },
];

for (const a of IMP34398_EFLOW_RESID_POLE_RESIDUE_CHANNEL_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34398-eflow-resid-pole-residue-channel-reconciliation assertion failed: ${a.id}`,
    );
  }
}
