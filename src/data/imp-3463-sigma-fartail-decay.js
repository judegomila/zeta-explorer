/**
 * @module imp-3463-sigma-fartail-decay
 *
 * imp-3463 (numerical, frontier-direction): imp-3444 bisected the imp-3406 sigma(N)
 * N-shape landmark ladder to machine precision and confirmed the right (decreasing)
 * arm decays MONOTONELY to 0 past the E_coll = E_trunc crossover at N ~ 3.280e9, but
 * the RATE of that decay toward 0 was never quantified. This module derives the leading
 * far-tail asymptotic form of sigma(N) for N far above the crossover and CERTIFIES it
 * against direct evaluation of the exact imp-3220 / imp-3406 / imp-3444 sub-term formulas
 * on a decade ladder N in {1e10, 1e11, 1e12, 1e13}.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3444)
 * ---------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *              = x / (1 + x + f),   x = E_coll/E_trunc,  f = E_flow/E_trunc,
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE DERIVATION (far tail, N >> N_cross ~ 3.28e9)
 * ------------------------------------------------
 * Far above the crossover both x = E_coll/E_trunc -> 0 (algebraically, ~ sqrt(logT0/N))
 * AND f = E_flow/E_trunc -> 0 (super-polynomially, ~ (logT0/T0)). The denominator
 * 1 + x + f -> 1, so the LEADING far-tail form is simply the collision-over-truncation
 * ratio:
 *     sigma(N) ~ x = E_coll / E_trunc = (C_C_PINNED / E_trunc) * sqrt(log T0 / N)   (LEAD)
 * i.e. the vanishing GUE-conditional collision term measured against the constant
 * truncation floor. Because E_flow is negligible on the far tail, the leading RELATIVE
 * error of (LEAD) is set by the neglected +x+f in the denominator:
 *     (x - sigma)/sigma = x + f  ~  x = sigma_asymp   (the leading form overshoots by
 *                                                      exactly its own magnitude),
 * so the leading form is accurate to O(sqrt(logT0/N)) and its fractional error itself
 * decays to 0 at the same algebraic rate. The geometric next term (still dropping the
 * super-poly f) gives the two-term refinement
 *     sigma(N) ~ x - x^2   (2-TERM),
 * whose fractional error is O(x^2) -- a decade-squared improvement over (LEAD).
 *
 * THE CERTIFICATION (decade ladder, exact sub-terms)
 * --------------------------------------------------
 *   N=1e10  sigma=0.36974198  LEAD=0.58707979  relerr_lead=+5.878e-1  f=7.30e-4  relerr_2term=-3.44e-1
 *   N=1e11  sigma=0.16297122  LEAD=0.19472129  relerr_lead=+1.948e-1  f=9.88e-5  relerr_2term=-3.78e-2
 *   N=1e12  sigma=0.06044044  LEAD=0.06432933  relerr_lead=+6.434e-2  f=1.30e-5  relerr_2term=-4.13e-3
 *   N=1e13  sigma=0.02074136  LEAD=0.02118071  relerr_lead=+2.118e-2  f=1.68e-6  relerr_2term=-4.47e-4
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) The leading form sigma ~ (C_C_PINNED/E_trunc) sqrt(logT0/N) reproduces the exact
 *        sigma(N) with a fractional error that decreases MONOTONELY across the ladder
 *        (0.588 -> 0.195 -> 0.064 -> 0.021), confirming sigma(N) -> 0 at the algebraic
 *        rate sqrt(logT0/N) on the far right arm.
 *   (F2) The leading fractional error tracks the asymptotic value itself: relerr_lead / x
 *        -> 1 down the ladder (the +x+f denominator overshoot equals x + f, and f is
 *        negligible), pinning the mechanism -- (LEAD) overshoots by exactly its own size.
 *   (F3) E_flow is super-polynomially negligible on the far tail: f = E_flow/E_trunc drops
 *        7.30e-4 -> 1.68e-6 down the ladder, dwarfed by x at every rung, so the geometric
 *        two-term refinement sigma ~ x - x^2 matches the exact value to O(x^2) (fractional
 *        error 0.344 -> 0.038 -> 0.0041 -> 0.00045, a clean decade-squared contraction).
 *
 * The punchline: past the E_coll = E_trunc crossover the imp-3444 "monotone decay to 0"
 * right arm is, to leading order, sigma(N) ~ (C_C_PINNED/E_trunc) sqrt(log T0 / N) -- the
 * shrinking GUE-conditional collision term over the constant truncation floor -- with a
 * fractional error that itself vanishes at the same algebraic rate, and E_flow contributes
 * nothing beyond a super-polynomially small correction.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, decay-to-0 right arm)
 * @see imp-3406-sigma-highN-extrapolation (N-shape, coarse right-arm landmarks)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, exact sub-terms)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3444)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3444 exactly

// EXACT imp-3444 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The derived far-tail leading form: sigma ~ x = (C_C_PINNED/E_trunc) sqrt(logT0/N).
function sigmaLead(N) {
  const T0 = effectiveHeightForN(N);
  return (C_C_PINNED / E_TRUNC_PT) * Math.sqrt(Math.log(T0) / N);
}

// The E_coll = E_trunc crossover, above which the far-tail regime applies (imp-3444 L5).
const N_CROSS = 3.280294352e9;

// The decade ladder above the crossover, certified against the exact sub-terms.
const LADDER_N = [1e10, 1e11, 1e12, 1e13];
const DECAY_LADDER = LADDER_N.map((N) => {
  const p = parts(N);
  const x = p.E_coll / E_TRUNC_PT; // leading asymptotic (== sigmaLead)
  const f = p.E_flow / E_TRUNC_PT; // super-poly negligible far-tail flow share
  const twoTerm = x - x * x; // geometric next-order refinement (drops f)
  return {
    N: +N.toExponential(0),
    T0: +p.T0.toExponential(4),
    sigma_exact: +p.sigma.toFixed(9),
    sigma_lead: +x.toFixed(9),
    relerr_lead: +((x - p.sigma) / p.sigma).toExponential(4),
    E_flow_over_E_trunc: +f.toExponential(3),
    sigma_2term: +twoTerm.toFixed(9),
    relerr_2term: +((twoTerm - p.sigma) / p.sigma).toExponential(4),
  };
});

// Monotone contraction of the leading fractional error down the ladder.
const RELERR_LEAD_ABS = DECAY_LADDER.map((r) => Math.abs(r.relerr_lead));
const RELERR_2TERM_ABS = DECAY_LADDER.map((r) => Math.abs(r.relerr_2term));

export const IMP3463_SIGMA_FARTAIL_DECAY = {
  id: 'imp-3463',
  proofSection: 'S-frontier',
  question:
    'Quantify the far-tail decay rate of the imp-3444 sigma(N) right arm beyond the ' +
    'E_coll = E_trunc crossover (N ~ 3.28e9). Derive the leading asymptotic sigma(N) ~ ' +
    'E_coll/E_trunc = (C_C_PINNED/E_trunc) sqrt(logT0/N) (E_flow super-poly negligible ' +
    'there) and certify it against the exact imp-3220 sub-terms at N in {1e10..1e13}. ' +
    'Derivation/measurement only, no RH verdict, no QED.',
  leadingForm: 'sigma(N) ~ (C_C_PINNED / E_trunc) * sqrt(log T0 / N),  T0 = effectiveHeightForN(N)',
  twoTermForm: 'sigma(N) ~ x - x^2,  x = (C_C_PINNED / E_trunc) sqrt(log T0 / N)',
  N_crossover: +N_CROSS.toExponential(6), // 3.280294e9 (imp-3444 L5), above which the far-tail regime holds
  decayLadder: DECAY_LADDER,
  finding: {
    F1_leading_relerr_contracts: RELERR_LEAD_ABS.map((v) => +v.toExponential(3)), // 5.878e-1 -> 2.118e-2
    F2_relerr_tracks_asymptote: DECAY_LADDER.map(
      (r) => +(Math.abs(r.relerr_lead) / r.sigma_lead).toFixed(4)
    ), // -> 1 (overshoot == x + f, f negligible)
    F3_E_flow_negligible: DECAY_LADDER.map((r) => r.E_flow_over_E_trunc), // 7.30e-4 -> 1.68e-6
    F3_twoterm_relerr_contracts: RELERR_2TERM_ABS.map((v) => +v.toExponential(3)), // 3.44e-1 -> 4.47e-4
    note:
      'The leading form sigma ~ (C_C_PINNED/E_trunc) sqrt(logT0/N) reproduces the exact ' +
      'sigma(N) with a fractional error that itself decays to 0 at the same algebraic rate ' +
      '(relerr_lead / x -> 1: the +x+f denominator overshoot equals x + f, and f is ' +
      'super-poly negligible). The geometric two-term refinement x - x^2 matches to O(x^2), ' +
      'a decade-squared contraction, confirming E_flow contributes nothing beyond a ' +
      'super-polynomially small correction on the far right arm.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + CERTIFICATION (frontier-direction, NOT rigorous). Beyond the imp-3444 ' +
    'E_coll = E_trunc crossover (N ~ 3.280e9) the sigma(N) right arm decays to 0 as the ' +
    'leading far-tail form sigma(N) ~ (C_C_PINNED/E_trunc) sqrt(log T0 / N) -- the ' +
    'shrinking GUE-conditional collision term over the constant truncation floor. Certified ' +
    'against the exact imp-3220/imp-3406/imp-3444 sub-terms on the decade ladder N in ' +
    '{1e10,1e11,1e12,1e13}: the leading fractional error contracts monotonely (0.588 -> ' +
    '0.195 -> 0.064 -> 0.021) and tracks the asymptotic value itself (relerr/x -> 1, the ' +
    'denominator overshoot is x + f with f negligible), while E_flow/E_trunc is super-poly ' +
    'negligible (7.30e-4 -> 1.68e-6) so the geometric two-term refinement x - x^2 matches ' +
    'to O(x^2) (0.344 -> 0.038 -> 0.0041 -> 0.00045). No positivity, no bridge closure, no ' +
    'RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9, monotone decay-to-0 right arm); ' +
    'imp-3406 (N-shape extrapolation); imp-3220 (U-shaped sigma(N) decade ladder, exact ' +
    'sub-terms); imp-2642 (C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3463_SIGMA_FARTAIL_DECAY_ASSERTIONS = [
  {
    // Reuse gate: the exact sub-terms reproduce the imp-3444 landmark values -- sigma(N)
    // is monotone decreasing on the ladder and passes through the imp-3444 0.5 crossing.
    id: 'imp3463-reuses-imp3444-subterms',
    description: 'exact sigma(N) is strictly decreasing across the decade ladder above the crossover',
    holds: () =>
      DECAY_LADDER[0].sigma_exact > DECAY_LADDER[1].sigma_exact &&
      DECAY_LADDER[1].sigma_exact > DECAY_LADDER[2].sigma_exact &&
      DECAY_LADDER[2].sigma_exact > DECAY_LADDER[3].sigma_exact &&
      DECAY_LADDER.every((r) => r.sigma_exact > 0 && r.sigma_exact < 0.5),
  },
  {
    // The derived leading form sigmaLead == E_coll/E_trunc identically (definition gate).
    id: 'imp3463-leading-form-equals-Ecoll-over-Etrunc',
    description: 'sigmaLead(N) = (C_C_PINNED/E_trunc) sqrt(logT0/N) equals E_coll/E_trunc',
    holds: () =>
      LADDER_N.every((N) => {
        const p = parts(N);
        return Math.abs(sigmaLead(N) - p.E_coll / E_TRUNC_PT) < 1e-12;
      }),
  },
  {
    // (F1): the leading fractional error is strictly monotone decreasing down the ladder,
    // confirming sigma -> 0 at the leading rate sqrt(logT0/N).
    id: 'imp3463-leading-relerr-contracts',
    description: 'leading fractional error decreases monotonely (0.588 -> 0.021) down the ladder',
    holds: () =>
      RELERR_LEAD_ABS[0] > RELERR_LEAD_ABS[1] &&
      RELERR_LEAD_ABS[1] > RELERR_LEAD_ABS[2] &&
      RELERR_LEAD_ABS[2] > RELERR_LEAD_ABS[3] &&
      Math.abs(RELERR_LEAD_ABS[0] - 0.5878) < 5e-3 &&
      Math.abs(RELERR_LEAD_ABS[3] - 0.02118) < 5e-4,
  },
  {
    // (F2): the leading fractional error tracks the asymptotic value itself (overshoot
    // equals x + f, f negligible), so relerr_lead / x -> 1 down the ladder.
    id: 'imp3463-relerr-tracks-asymptote',
    description: 'leading fractional error / sigma_lead -> 1 (denominator overshoot is x + f)',
    holds: () => {
      const ratio = DECAY_LADDER.map((r) => Math.abs(r.relerr_lead) / r.sigma_lead);
      return ratio.every((v) => v > 0.99 && v < 1.03) && ratio[3] < ratio[0];
    },
  },
  {
    // (F3): E_flow is super-poly negligible on the far tail, and the two-term refinement
    // x - x^2 matches the exact value to O(x^2) -- a decade-squared contraction.
    id: 'imp3463-Eflow-negligible-and-2term-Ox2',
    description: 'E_flow/E_trunc < 1e-3 on the ladder and two-term relerr contracts ~ x^2 (0.344 -> 4.5e-4)',
    holds: () =>
      DECAY_LADDER.every((r) => r.E_flow_over_E_trunc < 1e-3) &&
      RELERR_2TERM_ABS[0] > RELERR_2TERM_ABS[1] &&
      RELERR_2TERM_ABS[1] > RELERR_2TERM_ABS[2] &&
      RELERR_2TERM_ABS[2] > RELERR_2TERM_ABS[3] &&
      RELERR_2TERM_ABS[3] < 1e-3 &&
      // O(x^2): two-term error is far smaller than leading error at every rung.
      DECAY_LADDER.every((r) => Math.abs(r.relerr_2term) < Math.abs(r.relerr_lead)),
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp3463-honesty-gate-no-qed',
    description: 'Derivation/measurement only: no QED, PT stays SOTA',
    holds: () =>
      IMP3463_SIGMA_FARTAIL_DECAY.isRigorous === false &&
      /NO QED/.test(IMP3463_SIGMA_FARTAIL_DECAY.verdict) &&
      /remains SOTA/.test(IMP3463_SIGMA_FARTAIL_DECAY.verdict),
  },
];

for (const a of IMP3463_SIGMA_FARTAIL_DECAY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3463-sigma-fartail-decay assertion failed: ${a.id}`);
  }
}
