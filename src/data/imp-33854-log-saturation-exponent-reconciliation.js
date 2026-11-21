/**
 * @module imp-33854-log-saturation-exponent-reconciliation
 *
 * imp-33854 (numerical, frontier-direction): TWO independently-derived slow-approach
 * rates were reported for the same post-peak component model but never reconciled:
 *   - imp-33816 found the sigma(N) post-peak LOCAL decay exponent p(N) = -d ln sigma / d ln N
 *     approaches the imp-3463 far-tail +1/2 asymptote FROM BELOW with a shortfall
 *         gap_sigma(N) = 1/2 - p(N) ~ 1 / (2 log T0),
 *     validated as ratio -> 1 across N = 1e44..1e200.
 *   - imp-33620 found the SEPARATED E_coll local exponent q(N) = d ln E_coll / d ln N
 *     approaches -1/2 MONOTONELY FROM ABOVE with no overshoot, residual
 *         gap_ecoll(N) = q(N) + 1/2 ~ 0.0152 at N = 1e15 (still positive) as log T0 saturates.
 * Both read like ONE mechanism -- log T0(N) saturation -- surfacing in two quantities. This
 * module evaluates BOTH shortfalls on the SAME grid under the identical inherited
 * imp-3220/imp-3406/imp-33582/imp-33602 sub-terms, DERIVES the exact closed-form identity that
 * unifies them, and REPORTS the residual between the two.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33816 / imp-33620 / imp-33602)
 * -----------------------------------------------------------------------------
 *     sigma(N) = E_coll / D,   D = E_trunc + E_flow + E_coll,
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * No re-derivation, no fresh model.
 *
 * THE CLOSED-FORM RECONCILIATION (exact, finite-N -- not merely asymptotic)
 * ------------------------------------------------------------------------
 * Write log T0 for the natural log of T0, and define the FUNDAMENTAL log-saturation object
 *     g(N) := (1/2) * d ln(log T0) / d ln N.
 * Because ln E_coll = const + (1/2) ln(log T0) - (1/2) ln N, differentiating in ln N gives the
 * EXACT pointwise identity (no approximation):
 *     (I1)  gap_ecoll(N) = q(N) + 1/2 = g(N).
 * For sigma = E_coll / D we have p = -d ln sigma / d ln N = -q + d ln D / d ln N, and since
 * E_trunc is constant and E_flow is negligible, d ln D / d ln N = (q E_coll)/D + O(E_flow) =
 * q * sigma + O(E_flow), so
 *     (I2)  gap_sigma(N) = 1/2 - p(N) = g(N) - d ln D / d ln N = g(N) + |q(N)| * sigma(N) + O(E_flow).
 * Together (I1)+(I2) say: BOTH shortfalls are the SAME object g(N), differing only by the
 * finite-N denominator-share term |q| * sigma, which -> 0 as sigma -> 0 in the E_trunc-dominated
 * deep tail. Finally, by Riemann-von Mangoldt d ln T0 / d ln N -> 1, so
 *     (I3)  g(N) -> 1 / (2 log T0)      as N -> infinity,
 * which is exactly the imp-33816 ~1/(2 log T0) law. So the imp-33816 sigma-exponent shortfall and
 * the imp-33620 monotone-from-above E_coll residual are ONE log-saturation mechanism: the single
 * object g(N) = (1/2) d ln(log T0)/d ln N.
 *
 * THE MEASUREMENT (confirms the algebra numerically on the shared grid)
 * --------------------------------------------------------------------
 *   d=log10 N   gap_sigma=1/2-p   gap_ecoll=q+1/2   g=(1/2)dln(logT0)/dlnN   1/(2 log T0)   sigma
 *   12          4.7355e-2         1.8226e-2         1.8226e-2                 1.9002e-2      6.04e-2
 *   15          1.5780e-2         1.4678e-2         1.4678e-2                 1.5165e-2      2.27e-3
 *   18          1.2307e-2         1.2268e-2         1.2268e-2                 1.2601e-2      7.90e-5
 *   44          5.0191e-3         5.0191e-3         5.0191e-3                 5.0715e-3      1.24e-17
 *  200          1.0935e-3         1.0935e-3         1.0935e-3                 1.0959e-3      2.68e-95
 * Reading the columns: (I1) gap_ecoll = g holds to machine precision at EVERY rung (identical
 * digits); (I2) gap_sigma exceeds gap_ecoll by exactly |q| * sigma near the peak (2.91e-2 residual
 * at 1e12 where sigma=0.060) and that residual collapses with sigma -- the two become identical to
 * double precision by N ~ 1e44 (sigma ~ 1e-17); (I3) g and 1/(2 log T0) converge as N grows
 * (ratio 0.998 at 1e200). The discrete imp-33620 E_coll exponent over [1e14,1e15] reproduces
 * -0.4848 (residual 0.0152) and the pointwise imp-33816 gap_sigma(1e15) reproduces 0.01578.
 *
 * THE FINDINGS (measurement / derivation only)
 * --------------------------------------------
 *   (R1) SAME MECHANISM. gap_ecoll(N) = q + 1/2 EQUALS g(N) = (1/2) d ln(log T0)/d ln N exactly at
 *        every grid point (identity I1), and gap_sigma = g + |q| sigma (identity I2). The imp-33816
 *        and imp-33620 slow-approach laws are one object g(N) -- the log T0 saturation rate.
 *   (R2) THE RESIDUAL BETWEEN THE TWO IS |q| sigma AND VANISHES IN THE TAIL. gap_sigma - gap_ecoll
 *        = |q(N)| sigma(N): 2.91e-2 at 1e12, 1.10e-3 at the imp-33620 1e15 landmark, 3.85e-5 at
 *        1e18, and 0 (to double precision) by N ~ 1e44. The two exponent-shortfalls coincide once
 *        sigma has decayed, because there sigma ~ E_coll/E_trunc so p = -q exactly.
 *   (R3) COMMON ASYMPTOTE. Both g and gap_sigma converge to 1/(2 log T0) (identity I3, ratio -> 1),
 *        so the "monotone-from-above -1/2" residual and the "~1/(2 log T0) shortfall" are two
 *        descriptions of the SAME logarithmically-slow saturation.
 *
 * MEASUREMENT / DERIVATION ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (gap_sigma ~ 1/(2 log T0), ratio -> 1)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (E_coll exponent -> -1/2 from above, resid 0.0152 at 1e15)
 * @see imp-33865-sigma-exponent-asymptote-approach-rate-viz-data (baked gap_sigma curve; gap_sigma(1e15)=0.01578)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33582/imp-33602)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33816/imp-33620 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (+1/2 for sigma, -1/2 for E_coll)

// EXACT imp-33816/imp-33620 sub-terms, in log-N space so the far tail stays evaluable at large N.
function parts(lnN) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const D = E_TRUNC_PT + E_flow + E_coll;
  return { N, T0, L, E_trunc: E_TRUNC_PT, E_flow, E_coll, D, sigma: E_coll / D };
}

const DL = 1e-4; // central-difference step in ln N
const lnSigmaAt = (lnN) => Math.log(parts(lnN).sigma);
const lnEcollAt = (lnN) => Math.log(parts(lnN).E_coll);
const lnLogT0At = (lnN) => Math.log(parts(lnN).L);

// imp-33816 sigma exponent p(N) = -d ln sigma / d ln N; shortfall gap_sigma = 1/2 - p.
function gapSigmaAtLog10(d) {
  const lnN = d * Math.LN10;
  const p = -(lnSigmaAt(lnN + DL) - lnSigmaAt(lnN - DL)) / (2 * DL);
  return HALF - p;
}
// imp-33620 E_coll exponent q(N) = d ln E_coll / d ln N; residual gap_ecoll = q + 1/2.
function gapEcollAtLog10(d) {
  const lnN = d * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  return q + HALF;
}
// FUNDAMENTAL log-saturation object g(N) = (1/2) d ln(log T0) / d ln N.
function gFundAtLog10(d) {
  const lnN = d * Math.LN10;
  return 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
}

// Shared grid: the imp-33620 landmark decades (1e12..1e18) + the imp-33816 far tail (1e44..1e200).
const SHARED_GRID = [12, 13, 14, 15, 18, 20, 30, 44, 100, 200].map((d) => {
  const p = parts(d * Math.LN10);
  const gapSigma = gapSigmaAtLog10(d);
  const gapEcoll = gapEcollAtLog10(d);
  const g = gFundAtLog10(d);
  const law = 0.5 / p.L; // 1/(2 log T0)
  return {
    N_log10: d,
    logT0: +p.L.toFixed(3),
    sigma: +p.sigma.toExponential(3),
    gapSigma: +gapSigma.toExponential(4), // imp-33816 shortfall 1/2 - p
    gapEcoll: +gapEcoll.toExponential(4), // imp-33620 residual q + 1/2
    gFundamental: +g.toExponential(4), // (1/2) d ln(log T0)/d ln N
    lawEstimate: +law.toExponential(4), // 1/(2 log T0)
    residualBetween: +(gapSigma - gapEcoll).toExponential(3), // = |q| sigma, -> 0 in the tail
    predictedResidual: +(Math.abs(HALF - gapEcoll) * p.sigma).toExponential(3), // |q| sigma
    gToLawRatio: +(g / law).toFixed(4), // -> 1 by Riemann-von Mangoldt
  };
});

// (I1) EXACT identity check gap_ecoll = g at every grid point (to machine precision).
const MAX_I1_DEV = Math.max(...SHARED_GRID.map((r) => Math.abs(r.gapEcoll - r.gFundamental)));
// (I2) residual gap_sigma - gap_ecoll matches the |q| sigma prediction at every grid point.
const MAX_I2_DEV = Math.max(...SHARED_GRID.map((r) => Math.abs(r.residualBetween - r.predictedResidual)));
// Deep-tail coincidence: the two shortfalls are identical to double precision by N ~ 1e44.
const TAIL = SHARED_GRID.filter((r) => r.N_log10 >= 44);
const MAX_TAIL_RESIDUAL = Math.max(...TAIL.map((r) => Math.abs(r.residualBetween)));

// Reuse gates: reproduce the two source landmarks under the identical model.
const GAP_SIGMA_1E15 = +gapSigmaAtLog10(15).toFixed(5); // imp-33816/imp-33865: 0.01578 (pointwise)
// imp-33620 reports the DISCRETE E_coll exponent over [1e14,1e15]; reproduce -0.4848 / residual 0.0152.
const P14 = parts(14 * Math.LN10);
const P15 = parts(15 * Math.LN10);
const ECOLL_DISCRETE_EXP_1E15 = +(Math.log(P15.E_coll / P14.E_coll) / Math.log(P15.N / P14.N)).toFixed(4); // -0.4848
const ECOLL_DISCRETE_RESID_1E15 = +(ECOLL_DISCRETE_EXP_1E15 + 0.5).toFixed(4); // 0.0152

export const IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION = {
  id: 'imp-33854',
  proofSection: 'S-frontier',
  question:
    'Assess whether the imp-33816 sigma-exponent shortfall gap_sigma = 1/2 - p ~ 1/(2 log T0) and ' +
    'the imp-33620 monotone-from-above E_coll local-exponent residual gap_ecoll = q + 1/2 (~0.0152 ' +
    'at N=1e15) are the SAME log-saturation mechanism expressed as one closed-form statement, and ' +
    'report the residual between the two independently-derived slow-approach rates. ' +
    'Measurement/derivation only; C_mb GUE-conditional per imp-486; no QED.',
  fundamentalObject:
    'g(N) := (1/2) d ln(log T0) / d ln N -- the log T0(N) saturation rate. Both shortfalls reduce ' +
    'to g(N): gap_ecoll = q + 1/2 = g EXACTLY (differentiate ln E_coll = const + (1/2) ln(log T0) - ' +
    '(1/2) ln N); gap_sigma = 1/2 - p = g + |q| sigma (finite-N denominator-share term).',
  closedFormIdentities: {
    I1_ecoll_equals_g: 'gap_ecoll(N) = q(N) + 1/2 = g(N)  [exact, pointwise]',
    I2_sigma_equals_g_plus_share: 'gap_sigma(N) = 1/2 - p(N) = g(N) + |q(N)| sigma(N) + O(E_flow)',
    I3_common_asymptote: 'g(N) -> 1 / (2 log T0)  as d ln T0 / d ln N -> 1 (Riemann-von Mangoldt)',
  },
  sharedGrid: SHARED_GRID,
  reuseGates: {
    imp33816_gap_sigma_at_1e15: GAP_SIGMA_1E15, // 0.01578 (matches imp-33865 baked curve)
    imp33620_ecoll_discrete_exponent_at_1e15: ECOLL_DISCRETE_EXP_1E15, // -0.4848
    imp33620_ecoll_discrete_residual_at_1e15: ECOLL_DISCRETE_RESID_1E15, // 0.0152
  },
  diagnostics: {
    max_I1_deviation_gapEcoll_minus_g: +MAX_I1_DEV.toExponential(2), // ~0 (machine precision)
    max_I2_deviation_residual_minus_qSigma: +MAX_I2_DEV.toExponential(2), // ~0 (finite-N share term exact)
    max_tail_residual_from_1e44: +MAX_TAIL_RESIDUAL.toExponential(2), // ~0 (shortfalls coincide in tail)
  },
  findings: {
    R1_same_mechanism:
      'gap_ecoll = q + 1/2 EQUALS g(N) = (1/2) d ln(log T0)/d ln N exactly at every grid point (I1), ' +
      'and gap_sigma = g + |q| sigma (I2). The imp-33816 and imp-33620 slow-approach laws are ONE ' +
      'object g(N) -- the log T0(N) saturation rate.',
    R2_residual_is_qSigma_vanishing:
      'The residual between the two, gap_sigma - gap_ecoll = |q(N)| sigma(N), is 2.91e-2 at 1e12, ' +
      '1.10e-3 at the imp-33620 1e15 landmark, 3.85e-5 at 1e18, and 0 (to double precision) by ' +
      'N ~ 1e44. The two coincide once sigma has decayed, because there sigma ~ E_coll/E_trunc so ' +
      'p = -q exactly.',
    R3_common_asymptote:
      'Both g and gap_sigma converge to 1/(2 log T0) (I3, ratio -> 1 by 1e200), so the ' +
      'monotone-from-above -1/2 residual and the ~1/(2 log T0) shortfall are two descriptions of ' +
      'the SAME logarithmically-slow saturation.',
  },
  isRigorous: false,
  verdict:
    'RECONCILIATION (derivation + measurement, NOT rigorous). The imp-33816 sigma-exponent shortfall ' +
    'gap_sigma = 1/2 - p and the imp-33620 monotone-from-above E_coll residual gap_ecoll = q + 1/2 ' +
    'are the SAME log-saturation mechanism: both reduce to the single object g(N) = ' +
    '(1/2) d ln(log T0)/d ln N. Exactly (pointwise, finite-N): gap_ecoll = q + 1/2 = g (I1, ' +
    'reproduced to machine precision at every grid rung), and gap_sigma = g + |q| sigma (I2), so the ' +
    'residual between the two is |q| sigma -- 2.91e-2 near the sigma=0.06 peak at 1e12, 1.10e-3 at ' +
    'the imp-33620 1e15 landmark, and 0 to double precision by N ~ 1e44 as sigma -> 0. Both then ' +
    'share the common asymptote g -> 1/(2 log T0) (I3, Riemann-von Mangoldt). Reuse gates reproduce ' +
    'the imp-33816 pointwise gap_sigma(1e15) = 0.01578 and the imp-33620 discrete E_coll exponent ' +
    '-0.4848 (residual 0.0152) under the identical inherited imp-3220/imp-3406 model. The component ' +
    'model is that extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33816 (gap_sigma ~ 1/(2 log T0), ratio -> 1); imp-33620 (E_coll exponent -> -1/2 from ' +
    'above, residual 0.0152 at 1e15); imp-33865 (baked gap_sigma curve, gap_sigma(1e15)=0.01578); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION_ASSERTIONS = [
  {
    // (I1) EXACT identity: the imp-33620 residual q + 1/2 equals the fundamental object g at every
    // grid point, to machine precision -- proving they are one quantity, not merely similar.
    id: 'imp33854-ecoll-residual-equals-g-exactly',
    description: 'gap_ecoll = q + 1/2 equals g = (1/2) d ln(log T0)/d ln N to machine precision on the shared grid',
    holds: () => MAX_I1_DEV < 1e-6,
  },
  {
    // (I2) The residual between the two shortfalls is exactly the |q| sigma denominator-share term.
    id: 'imp33854-residual-is-q-sigma-share',
    description: 'gap_sigma - gap_ecoll equals |q| sigma at every grid point (finite-N denominator share)',
    holds: () => MAX_I2_DEV < 5e-4,
  },
  {
    // (R2) The two shortfalls coincide in the deep tail: residual -> 0 (double precision) by 1e44.
    id: 'imp33854-shortfalls-coincide-in-tail',
    description: 'gap_sigma and gap_ecoll are identical to double precision for N >= 1e44 (residual ~ 0)',
    holds: () => MAX_TAIL_RESIDUAL < 1e-6,
  },
  {
    // (R3) Common asymptote: g -> 1/(2 log T0), ratio within 1% by N = 1e200.
    id: 'imp33854-common-asymptote-g-to-law',
    description: 'g / (1/(2 log T0)) converges to 1 (within 1% at N = 1e200)',
    holds: () => {
      const deep = SHARED_GRID.find((r) => r.N_log10 === 200);
      return deep.gToLawRatio > 0.99 && deep.gToLawRatio < 1.01;
    },
  },
  {
    // Reuse gate: reproduce BOTH source landmarks under the identical inherited model.
    id: 'imp33854-reproduces-both-source-landmarks',
    description: 'reproduces imp-33816 gap_sigma(1e15)=0.01578 and imp-33620 E_coll exponent -0.4848 (residual 0.0152)',
    holds: () =>
      Math.abs(GAP_SIGMA_1E15 - 0.01578) < 5e-5 &&
      Math.abs(ECOLL_DISCRETE_EXP_1E15 - -0.4848) < 5e-4 &&
      Math.abs(ECOLL_DISCRETE_RESID_1E15 - 0.0152) < 5e-4,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp33854-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION.verdict),
  },
];

for (const a of IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33854-log-saturation-exponent-reconciliation assertion failed: ${a.id}`);
  }
}
