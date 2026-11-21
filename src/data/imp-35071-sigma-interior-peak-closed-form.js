/**
 * @module imp-35071-sigma-interior-peak-closed-form
 *
 * imp-35071 (numerical, frontier-direction): currentStatus reports the true interior peak of
 * the n-shaped conditional-share sigma(N) = E_coll/E sits at N ~ 9.22e5 (sigma_max ~ 0.9494),
 * with 10^6 landing ~2.1e-5 below it on the downslope -- but this peak has only ever been
 * LOCATED numerically by sampling. This module DERIVES the closed-form peak condition
 * dsigma/dN = 0 on the inherited imp-33601 component model (analogous to the imp-33723 Banach
 * fixed point for the E_coll = E_trunc crossover) and pins the numeric N ~ 9.22e5 to its root.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33601 / imp-3406; no re-derivation)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse)
 *
 * THE CLOSED-FORM PEAK CONDITION (the derivation the ticket asks for)
 * ------------------------------------------------------------------
 * Write E = E_trunc + E_flow + E_coll and prime for d/dN (E_trunc is constant, so its
 * derivative is 0). Then
 *
 *     dsigma/dN = (E_coll_prime * E - E_coll * E_prime) / E^2,   E_prime = E_flow_prime + E_coll_prime.
 *
 * Setting the numerator to 0 and cancelling the shared E_coll * E_coll_prime cross term:
 *
 *     E_coll_prime * (E_trunc + E_flow) = E_coll * E_flow_prime.                (PEAK CONDITION)
 *
 * Because E_coll / (E_trunc + E_flow) = sigma / (1 - sigma), this is equivalently the
 * fixed-point / root characterization
 *
 *     (1 - sigma) / sigma = E_flow_prime / E_coll_prime.                        (PEAK FIXED POINT)
 *
 * Passing to logarithmic slopes a = d log E_coll / d log N and b = d log E_flow / d log N
 * (so E_coll_prime = E_coll a / N and E_flow_prime = E_flow b / N) the N and E_coll factors
 * cancel and the condition collapses to a pure two-slope balance:
 *
 *     a * E_trunc = (b - a) * E_flow,   i.e.   E_flow / E_trunc = a / (b - a).  (PEAK, SLOPE FORM)
 *
 * with, from the model, a = (1/2)(g/L) - 1/2 and b = g(1/M + 1/L - 1), where g = d log T0 /
 * d log N, L = log T0 and M = log(T0/2pi) + 1.
 *
 * THE PUNCHLINE: THE INTERIOR PEAK IS ENTIRELY THE E_flow TERM
 * -----------------------------------------------------------
 * The (PEAK CONDITION) has no root when E_flow = 0: dropping E_flow gives
 * sigma = 1/(1 + E_trunc/E_coll), which is strictly DECREASING in N (E_coll falls like
 * sqrt(L/N)), i.e. a pure decreasing sigmoid with NO interior maximum -- exactly the
 * downslope regime imp-35055 / imp-35042 analyse. The rising branch, and hence the interior
 * peak at N ~ 9.22e5, exists ONLY because the Gronwall flow term E_flow decreases faster
 * than E_coll there (b < a < 0), pulling the non-collision mass down and lifting sigma until
 * the slopes balance. This is the SAME E_flow term imp-33601 identified as the sigma = 1/2
 * vs E_coll = E_trunc offset -- but here it is not a ~0.4% perturbation: at the peak
 * E_flow / E_trunc ~ 1.53 (E_flow is comparable to E_trunc), so the peak is a genuine
 * E_flow-dominated feature, not a small correction.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) THE CLOSED FORM REPRODUCES THE NUMERIC PEAK TO ~4e-10. Root-finding the (PEAK, SLOPE
 *        FORM) residual a E_trunc - (b - a) E_flow = 0 gives N_star ~ 9.218633e5, matching an
 *        independent direct numeric peak-finder (bisection on the sign of d log sigma / d log N)
 *        to relative ~4e-10 -- the closed-form condition and the sampled peak are the same point.
 *   (D2) PEAK HEIGHT AND DOWNSLOPE MATCH currentStatus. sigma(N_star) ~ 0.949429 (~0.9494) and
 *        sigma(1e6) sits ~2.14e-5 BELOW it (1e6 is just past the peak on the downslope), both
 *        reproducing the cited landmark.
 *   (D3) THE PEAK IS E_flow-DRIVEN. At N_star, E_flow / E_trunc ~ 1.53 and the two slopes are
 *        a ~ -0.4655, b ~ -0.7697 (b < a, E_flow falling faster). Setting E_flow = 0 removes the
 *        interior maximum entirely (sigma becomes monotone decreasing), so the peak is a feature
 *        of the Gronwall flow term, not of E_coll or E_trunc alone.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX located numerically; component model source)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (E_flow offset identity; same component model)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form Banach crossover this mirrors)
 * @see imp-35055-inflection-crossover-algebraic-tie (downslope sigma is a decreasing logistic)
 * @see imp-eflow-constant-discharge (E_flow Gronwall flow term, imp-398 prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33601)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601 exactly

// EXACT imp-3406/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Analytic logarithmic slopes a = dlogE_coll/dlogN, b = dlogE_flow/dlogN.
// g = dlogT0/dlogN is the one structural slope of the numerical height inverse; a small
// central finite difference of log T0 vs log N supplies it (T0 is a smooth Newton inverse).
function gLocal(N) {
  const h = 1e-5;
  const Tp = effectiveHeightForN(N * Math.exp(h));
  const Tm = effectiveHeightForN(N * Math.exp(-h));
  return (Math.log(Tp) - Math.log(Tm)) / (2 * h);
}
function slopes(N) {
  const { T0, L, E_flow } = parts(N);
  const g = gLocal(N);
  const M = Math.log(T0 / TWO_PI) + 1;
  const a = 0.5 * (g / L) - 0.5; // dlogE_coll/dlogN
  const b = g * (1 / M + 1 / L - 1); // dlogE_flow/dlogN
  return { a, b, g, L, M, E_flow };
}

// (PEAK, SLOPE FORM) residual: a*E_trunc - (b - a)*E_flow. Zero at the interior peak.
function peakResidual(N) {
  const { a, b, E_flow } = slopes(N);
  return a * E_TRUNC_PT - (b - a) * E_flow;
}

// Root of the closed-form peak condition, bisected in log N (residual is + below, - above).
function rootLogN(f, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Independent DIRECT numeric peak-finder: bisect the sign of d log sigma / d log N (central diff).
function dLogSigma(N) {
  const h = 1e-4;
  return (Math.log(sigma(N * Math.exp(h))) - Math.log(sigma(N * Math.exp(-h)))) / (2 * h);
}

const N_PEAK_CLOSED = rootLogN(peakResidual, 1e3, 1e8); // ~9.218633e5 from the closed form
const N_PEAK_NUMERIC = rootLogN(dLogSigma, 1e3, 1e8); // ~9.218633e5 from direct sampling
const REL_DIFF = Math.abs(N_PEAK_CLOSED - N_PEAK_NUMERIC) / N_PEAK_NUMERIC; // ~4e-10

const P_PEAK = parts(N_PEAK_CLOSED);
const S_PEAK = slopes(N_PEAK_CLOSED);
const SIGMA_MAX = P_PEAK.sigma; // ~0.949429
const SIGMA_1E6 = sigma(1e6); // ~0.949408 (downslope)
const DOWNSLOPE_DROP = SIGMA_1E6 - SIGMA_MAX; // ~ -2.14e-5 (below the peak)
const R_FLOW_TRUNC_PEAK = P_PEAK.E_flow / E_TRUNC_PT; // ~1.53 (E_flow comparable to E_trunc)

// Slope-form self-consistency: E_flow/E_trunc should equal a/(b - a) at the peak.
const SLOPE_FORM_LHS = R_FLOW_TRUNC_PEAK; // E_flow/E_trunc
const SLOPE_FORM_RHS = S_PEAK.a / (S_PEAK.b - S_PEAK.a); // a/(b - a)
const SLOPE_FORM_RESIDUAL = Math.abs(SLOPE_FORM_LHS - SLOPE_FORM_RHS) / SLOPE_FORM_RHS;

// (D3) With E_flow forced to 0 the share is monotone decreasing -> no interior maximum.
function sigmaNoFlow(N) {
  const p = parts(N);
  return p.E_coll / (E_TRUNC_PT + p.E_coll);
}
const NOFLOW_MONOTONE_DECREASING =
  sigmaNoFlow(1e4) > sigmaNoFlow(1e5) &&
  sigmaNoFlow(1e5) > sigmaNoFlow(1e6) &&
  sigmaNoFlow(1e6) > sigmaNoFlow(1e7);

export const IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM = {
  id: 'imp-35071',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-3406 interior sigma-peak (N ~ 9.22e5, sigma_max ~ 0.9494) in closed form on ' +
    'the imp-33601 component model sigma = E_coll/(E_trunc+E_flow+E_coll): set dsigma/dN = 0, ' +
    'obtain a fixed-point/root characterization of the peak (analogous to the imp-33723 crossover ' +
    'Banach form), and confirm it against the numerically-located N ~ 9.22e5. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  peakCondition: 'dsigma/dN = 0  <=>  E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime',
  fixedPointForm: '(1 - sigma)/sigma = E_flow_prime / E_coll_prime',
  slopeForm: 'E_flow/E_trunc = a/(b - a),  a = dlogE_coll/dlogN, b = dlogE_flow/dlogN',
  landmarks: {
    N_peak_closed_form: +N_PEAK_CLOSED.toExponential(6), // ~9.218633e5
    N_peak_numeric: +N_PEAK_NUMERIC.toExponential(6), // ~9.218633e5
    closed_vs_numeric_rel_diff: +REL_DIFF.toExponential(3), // ~4e-10
    sigma_max: +SIGMA_MAX.toFixed(6), // ~0.949429
    sigma_at_1e6: +SIGMA_1E6.toFixed(8), // ~0.94940758 (downslope)
    downslope_drop_1e6_minus_peak: +DOWNSLOPE_DROP.toExponential(3), // ~ -2.14e-5
  },
  slopeCheck: {
    a_dlogEcoll_dlogN: +S_PEAK.a.toExponential(4), // ~ -4.6553e-1
    b_dlogEflow_dlogN: +S_PEAK.b.toExponential(4), // ~ -7.6967e-1
    g_dlogT0_dlogN: +S_PEAK.g.toFixed(6), // ~0.912227
    E_flow_over_E_trunc_at_peak: +R_FLOW_TRUNC_PEAK.toExponential(4), // ~1.53e0
    slope_form_relative_residual: +SLOPE_FORM_RESIDUAL.toExponential(3), // ~floating-point zero
  },
  finding: {
    D1_closed_form_reproduces_numeric_peak:
      'Root-finding the closed-form peak residual a E_trunc - (b - a) E_flow = 0 gives ' +
      'N_star ~ 9.218633e5, matching an independent direct peak-finder (bisection on the sign of ' +
      'd log sigma / d log N) to relative ~4e-10. The closed-form condition and the sampled peak ' +
      'are the same point.',
    D2_peak_height_and_downslope_match_currentStatus:
      'sigma(N_star) ~ 0.949429 (~0.9494) and sigma(1e6) sits ~2.14e-5 BELOW it, so 1e6 is just ' +
      'past the peak on the downslope -- reproducing the cited currentStatus landmark.',
    D3_peak_is_E_flow_driven:
      'At N_star, E_flow/E_trunc ~ 1.53 (E_flow comparable to E_trunc, NOT the ~1.9e-3 of the far ' +
      'crossover), with slopes a ~ -0.4655, b ~ -0.7697 (b < a, E_flow falling faster). Forcing ' +
      'E_flow = 0 makes sigma = 1/(1 + E_trunc/E_coll) strictly decreasing -- the interior maximum ' +
      'vanishes. The peak is therefore ENTIRELY a Gronwall-flow-term feature, the same E_flow term ' +
      'imp-33601 named for the sigma = 1/2 offset.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-3406 interior sigma-peak, previously ' +
    'only LOCATED by sampling, is now characterized in CLOSED FORM: dsigma/dN = 0 is exactly ' +
    'E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime, equivalently the fixed point ' +
    '(1 - sigma)/sigma = E_flow_prime/E_coll_prime, equivalently the two-slope balance ' +
    'E_flow/E_trunc = a/(b - a). Its root N_star ~ 9.218633e5 matches the direct numeric peak to ' +
    '~4e-10, with sigma_max ~ 0.949429 and 1e6 sitting ~2.14e-5 below on the downslope, ' +
    'reproducing the currentStatus landmark. The peak is E_flow-driven: at N_star ' +
    'E_flow/E_trunc ~ 1.53 and setting E_flow = 0 removes the interior maximum entirely (sigma ' +
    'becomes monotone decreasing), so the rising branch is the same Gronwall flow term imp-33601 ' +
    'identified. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz ' +
    '(imp-2642) UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-3406 (interior MAX located numerically, component model source); imp-33601 (E_flow ' +
    'offset identity, same model); imp-33723 (closed-form Banach crossover mirrored here); ' +
    'imp-35055 (downslope sigma is a decreasing logistic); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3406 interior-peak landmark (N ~ 9.22e5, sigma_max ~ 0.9494),
    // proving the identical inherited component model is in use.
    id: 'imp35071-reproduces-imp3406-interior-peak',
    description: 'closed-form peak N ~ 9.22e5 and sigma_max ~ 0.9494 (imp-3406 landmark)',
    holds: () =>
      Math.abs(N_PEAK_CLOSED / 9.22e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.9494) < 5e-4,
  },
  {
    // (D1): the closed-form peak condition root equals the direct numeric peak to ~machine floor.
    id: 'imp35071-closed-form-matches-numeric-peak',
    description: 'closed-form peak = direct numeric peak to relative < 1e-6',
    holds: () => REL_DIFF < 1e-6,
  },
  {
    // (D2): 1e6 lands ~2.1e-5 below the peak on the downslope (currentStatus landmark).
    id: 'imp35071-downslope-drop-at-1e6',
    description: 'sigma(1e6) is ~2.1e-5 below sigma_max (1e6 just past the peak)',
    holds: () => DOWNSLOPE_DROP < 0 && Math.abs(DOWNSLOPE_DROP + 2.14e-5) < 3e-6,
  },
  {
    // Slope-form self-consistency: E_flow/E_trunc = a/(b - a) at the located peak.
    id: 'imp35071-slope-form-consistent',
    description: 'at the peak E_flow/E_trunc = a/(b - a) to floating point (residual < 1e-6)',
    holds: () => SLOPE_FORM_RESIDUAL < 1e-6,
  },
  {
    // (D3): the peak is E_flow-driven -- E_flow comparable to E_trunc at the peak, and removing
    // E_flow makes the share monotone decreasing (no interior maximum).
    id: 'imp35071-peak-is-eflow-driven',
    description: 'E_flow/E_trunc ~1.5 at peak, and E_flow=0 makes sigma monotone decreasing',
    holds: () => R_FLOW_TRUNC_PEAK > 1.0 && NOFLOW_MONOTONE_DECREASING,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp35071-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35071_SIGMA_INTERIOR_PEAK_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35071-sigma-interior-peak-closed-form assertion failed: ${a.id}`);
  }
}
