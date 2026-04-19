/**
 * imp-863: PATH 2 escape hatch B3 — matched asymptotic expansion near
 * the first collision.
 *
 * SCOPE
 * -----
 * This is the third of three escape hatches imp-834 named for Route C
 * dynamical. imp-861 ruled out the static-non-negative-weights variant;
 * imp-862 ruled out the literal H_CM-conservation variant (H_CM is not
 * conserved along gradient flow). This file scopes the remaining
 * candidate: a MATCHED ASYMPTOTIC EXPANSION near the first collision
 * time tau_c, using the self-similar Burgers-shock coordinate introduced
 * by Polymath15 Lemma 5.2 (imp-366 port).
 *
 * KEY QUESTION
 * ------------
 * Near tau_c, the product S_{k*}(tau)*B(tau)^2 may have a DIFFERENT
 * limit in a blow-up coordinate than the instantaneous value at tau = 0.
 * Specifically, write the blow-up variable s = tau_c - tau and the
 * rescaled gap B_tilde(s) = B(tau)/s^{1/2} (motivated by the Polymath15
 * Holder-1/2 modulus: B(tau) ~ C_H * s^{1/2} near collision). Does
 *
 *   Q(s) := S_{k*}(tau) * B(tau)^2  =  (S_{k*}(tau) * s) * B_tilde(s)^2
 *
 * converge to a finite positive limit as s -> 0^+?  If yes, and if that
 * limit exceeds 2, Route C closes via the blow-up limit even though the
 * instantaneous value is < 2 at every finite tau.
 *
 * PRELIMINARY ANALYSIS (this file)
 * --------------------------------
 * Under the Polymath15 shock-Holder hypothesis B(tau) ~ C_H * sqrt(s),
 *   B(tau)^2 ~ C_H^2 * s  -> 0.
 * The Cauchy sum S_{k*}(tau) has LEADING contribution from the TWO
 * NEAREST-NEIGHBOUR zeros of the argmin pair (second-order neighbours).
 * If those neighbours have gaps B_left, B_right of order 1 (not
 * shrinking as s -> 0), then
 *   S_{k*}(tau) ~ (1/B_left^2 + 1/B_right^2 + O(1)) = constant = S_inf.
 * So Q(s) = S_{k*}(tau) * B(tau)^2 ~ S_inf * C_H^2 * s -> 0 as s -> 0.
 *
 * PRELIMINARY VERDICT
 * -------------------
 * Under the Polymath15 Holder-1/2 hypothesis, the product Q(s) vanishes
 * like s -> 0 near the collision time. The blow-up limit is ZERO,
 * not a finite positive number exceeding 2. The matched-asymptotic
 * variant of Route C does NOT close via this scaling.
 *
 * ESCAPE HATCH REMAINS IF
 * -----------------------
 * The Holder-1/2 hypothesis is an UPPER bound; a genuine SHARPER singular
 * behaviour B(tau) ~ C_H * s^alpha with alpha < 1/2 is not ruled out in
 * principle (though unlikely for the Riemann zero process specifically).
 * The case alpha = 1/2 - epsilon for small epsilon gives
 *   B^2 * S ~ s^{2*(1/2 - eps)} * S_inf ~ s^{1 - 2*eps} -> 0 still.
 * Only if alpha = 0 (discontinuous gap jump at collision — a logical
 * possibility but not observed in any numerical case) would Q(s) have a
 * non-zero limit. Numerical evidence from imp-834 at N up to 10^5 is
 * consistent with alpha = 1/2 (Holder-1/2 saturates empirically).
 *
 * CONCLUSION
 * ----------
 * All three PATH 2 escape hatches imp-861 / imp-862 / imp-863 yield
 * preliminary-negative results under the available evidence. The Route C
 * dynamical approach has been mapped in its entirety without producing
 * an unconditional finite-N closure. The lone surviving path toward
 * unconditional N <= 10^6 closure is imp-857 interval-arithmetic
 * certification, reaffirming the imp-874 / imp-875 conclusion.
 *
 * OPEN SUB-GAPS
 * -------------
 * imp-863-sub-alpha-below-half: establish rigorously that B(tau) ~
 *   s^alpha with alpha >= 1/2 for the Riemann-zero Dyson flow (the
 *   Polymath15 Holder-1/2 hypothesis is currently numerical).
 * imp-863-sub-higher-order-blowup: if Q(s) -> 0, the NEXT-leading
 *   correction Q'(s) := Q(s)/s might have a non-zero limit; worth
 *   checking whether Q'(s) contains a Route C c(N)>2 signature.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc text.
 */

// ── Numerical sanity check: Q(s) at the imp-834 sample N values ────────────
//
// We don't actually run the backward ODE here (that's imp-857 / imp-862
// territory). We check the LEADING-ORDER Q-value at tau = 0 as a proxy:
// the static S*B^2, which is the s -> tau_c limit of Q(s) / C_H^2 modulo
// a constant. If Q(s = tau_c - 0) = S*B^2 is strictly below 2 at every
// sampled N (which imp-834 already showed), then a matched-asymptotic
// limit less than the static ceiling is doubly consistent with the
// preliminary-negative verdict.

import { ROUTE_C_DYNAMICAL_ANALYSIS } from './route-c-dynamical-analysis.js';

const staticSB2AtSamples = ROUTE_C_DYNAMICAL_ANALYSIS.numericalEvidence.samples.map(
  (s) => ({ N: s.N, SB2: s.SB2 }),
);
const staticSB2Max = Math.max(...staticSB2AtSamples.map((s) => s.SB2));

// Polymath15 shock constant: C_H = 1/8 from imp-395.
const C_H = 1 / 8;

export const ROUTE_C_MATCHED_ASYMPTOTIC = {
  id: 'imp-863',
  title: 'PATH 2 escape hatch B3 — matched asymptotic expansion near first collision',
  status: 'partial',
  closureLevel: 'preliminary-negative',

  selfSimilarVariable: 's = tau_c - tau (time-to-collision)',
  rescaledGap:         'B_tilde(s) = B(tau) / s^{1/2}  (motivated by Polymath15 Lemma 5.2 Holder-1/2)',
  shockConstant_CH:    C_H,

  question:
    'Does the blow-up limit lim_{s -> 0^+} S_{k_star}(tau) * B(tau)^2 ' +
    'exceed 2, enabling Route C closure in the matched-asymptotic ' +
    'coordinate even though the static (tau=0) value is < 2?',

  preliminaryDerivation:
    'Under Polymath15 Lemma 5.2 (Holder-1/2 upper bound), B(tau) ~ C_H ' +
    '* sqrt(s) so B(tau)^2 ~ C_H^2 * s. The leading Cauchy-sum ' +
    'contribution comes from the TWO neighbours of the collapsing pair, ' +
    'whose gaps B_left, B_right = O(1) do not shrink; so S_{k_star}(tau) ' +
    '-> S_inf < infinity as tau -> tau_c. Therefore Q(s) = S_{k_star} * ' +
    'B^2 ~ S_inf * C_H^2 * s -> 0 as s -> 0.',

  preliminaryVerdict:
    'UNDER HOLDER-1/2: Q(s) -> 0 at the collision. The matched-asymptotic ' +
    'variant of Route C does NOT close. Combined with imp-861 ' +
    '(weighted-S variant, preliminary-negative on static non-negative ' +
    'weights) and imp-862 (H_CM-conservation variant, literally refuted), ' +
    'all three PATH 2 escape hatches are closed preliminary-negatively. ' +
    'imp-857 interval-arithmetic cert remains the only surviving path.',

  numericalEvidence: {
    staticSB2AtSamples,
    staticSB2Max,
    note:
      'At every sampled N in {50, 100, ..., 100000}, the static S*B^2 is ' +
      'strictly below 2 (max observed ' + staticSB2Max + '). The blow-up ' +
      'limit Q(s) -> 0 under Holder-1/2 is strictly more favourable than ' +
      'the static bound, so any matched-asymptotic escape would require ' +
      'violating the Polymath15 Holder hypothesis — empirically not observed.',
  },

  escapeConditions:
    'Blow-up limit exceeds 2 only if B(tau) ~ s^alpha with alpha < 1/2. ' +
    'alpha = 1/2 - epsilon still gives Q(s) ~ s^{1 - 2*epsilon} -> 0. ' +
    'Only alpha = 0 (jump discontinuity — not observed numerically) gives ' +
    'a non-zero limit. imp-863-sub-alpha-below-half is an open research ' +
    'sub-gap to make the "Polymath15 Holder-1/2 saturates" claim rigorous.',

  openSubGaps: [
    {
      id: 'imp-863-sub-alpha-below-half',
      description:
        'Rigorously establish that B(tau) ~ s^alpha with alpha >= 1/2 for ' +
        'the Riemann-zero Dyson flow. The Polymath15 Holder-1/2 hypothesis ' +
        'currently rests on numerical evidence (imp-366 port); a proof-grade ' +
        'sharpness result would lock in the preliminary-negative verdict here.',
    },
    {
      id: 'imp-863-sub-higher-order-blowup',
      description:
        'Given Q(s) -> 0, check whether Q(s)/s has a non-zero limit with ' +
        'a Route C c(N) > 2 signature in its asymptotic constant. This is ' +
        'a genuinely finer analysis; may or may not be signalling-useful.',
    },
  ],

  conclusion:
    'PRELIMINARY-NEGATIVE on the literal matched-asymptotic escape hatch ' +
    'under Polymath15 Holder-1/2. All three PATH 2 escape hatches are now ' +
    'mapped (weighted-S / CM-Hamiltonian / matched-asymptotic), all three ' +
    'preliminary-negative. Route C dynamical has been exhausted as a ' +
    'candidate for unconditional finite-height closure. imp-857 interval-' +
    'arithmetic certification remains the lone surviving path.',
};

export const ROUTE_C_MATCHED_ASYMPTOTIC_ASSERTIONS = [
  {
    id: 'imp863-static-SB2-below-2-at-samples',
    holds: () => ROUTE_C_MATCHED_ASYMPTOTIC.numericalEvidence.staticSB2Max < 2,
    why:
      'The static S*B^2 must remain strictly below 2 at every sampled N, ' +
      'matching the imp-507 equidistant ceiling. Violation would invalidate ' +
      'this file\'s preliminary-negative reasoning.',
  },
  {
    id: 'imp863-status-partial',
    holds: () => ROUTE_C_MATCHED_ASYMPTOTIC.status === 'partial',
    why:
      'This is a preliminary-negative scoping result under the Polymath15 ' +
      'Holder-1/2 hypothesis, not a proof. The partial status must persist ' +
      'until imp-863-sub-alpha-below-half is formally closed.',
  },
  {
    id: 'imp863-shock-constant-matches-imp395',
    holds: () => ROUTE_C_MATCHED_ASYMPTOTIC.shockConstant_CH === 1 / 8,
    why:
      'The Polymath15 shock constant C_H = 1/8 is pinned by imp-395 ' +
      '(quadratic-tangency regularization). Changing this number without ' +
      'updating imp-395 is a silent inconsistency.',
  },
];
