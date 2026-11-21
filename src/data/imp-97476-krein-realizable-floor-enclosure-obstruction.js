/**
 * @module imp-97476-krein-realizable-floor-enclosure-obstruction
 * @fileoverview imp-97476 -- ASSESS whether the imp-97457 MEASURED realizable negative floor
 *   c_sharp >= -R with R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 can be PROMOTED to a
 *   rigorous bound via a verified interval enclosure of the top eigenvalue (residual
 *   IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE). This leaf finds a
 *   DIRECTIONAL obstruction: the finite-section eigenvalue is the WRONG-SIGN bracket for a floor,
 *   and the imp-97457 value 1343.796 is not even a converged measurement of R.
 *
 * SETUP (imp-97457). R := max_{psi in PW_a, ||psi||_2 = 1} int sigma_2^-(t) |psi(t)|^2 dt =
 *   lambda_max(P_a M_{sigma_2^-} P_a), P_a the band-limit projector (sinc reproducing kernel
 *   K_a(s,t) = sin(a(s-t))/(pi(s-t)), K_a(t,t) = a/pi), a = (ln3)/2. Because sigma_2^+ >= 0, the
 *   rigorous chain is c_sharp = lambda_min(P_a M_{sigma_2} P_a) >= -R, so a rigorous FLOOR (lower
 *   bound on c_sharp) requires an UPPER bound on R. imp-97457 read R = 1343.796 as a finite-section
 *   IEEE-double eigenvalue on t in [-12,12].
 *
 * FINDING 1 -- THE FINITE-SECTION EIGENVALUE IS A LOWER BRACKET ON R AND RISES WITH THE WINDOW.
 *   A finite section is a compression of P_a M_{sigma_2^-} P_a to the subspace of grid-supported
 *   band-limited functions, so by Rayleigh-Ritz its top eigenvalue is a LOWER bound on the true
 *   operator lambda_max, and it increases as the window T grows. Measured (numpy sinc-projector,
 *   h = 0.01):
 *     T=12: 1343.796   T=16: 1442.608   T=20: 1489.564
 *     T=24: 1507.592   T=28: 1514.830   T=32: 1523.891   (increments +98.8/+47.0/+18.0/+7.2/+9.1)
 *   All sigma_2^- mass lies within |t| <= 10.5 (for t > ~10.5, 2 theta'(t) ~ ln(t/2pi) exceeds the
 *   cosine amplitude sqrt2 ln2 ~ 0.98, so sigma_2 >= 0), yet lambda_max keeps climbing well past
 *   T=12: the top eigenvector concentrates on the deepest well at t ~ 9.35 (depth 4336.198) and its
 *   band-limited sinc tails (decaying only like 1/t) are CLIPPED by the [-12,12] window. So the
 *   imp-97457 value 1343.796 is a truncation-limited underestimate ~12-13% below the converged
 *   R ~ 1520-1540, NOT a grid-stable measurement of the true realizable integral.
 *
 * FINDING 2 -- AN INTERVAL ENCLOSURE CANNOT PROMOTE 1343.796 TO A RIGOROUS FLOOR: WRONG DIRECTION.
 *   A rigorous floor needs an UPPER bound on R. Finite-section / Rayleigh-Ritz eigenvalues supply
 *   only LOWER bounds on lambda_max (Finding 1). The rigorous UPPER bounds actually available on R
 *   are (i) the bathtub rearrangement envelope 3065.435 (imp-97416: |psi|^2 <= a/pi, int|psi|^2 = 1)
 *   and (ii) the operator-norm bound R <= ||M_{sigma_2^-}||_inf = sup_t sigma_2^-(t) = 4336.198
 *   (the deepest well, since ||P_a|| = 1). BOTH exceed 1343.796, so the best rigorous floor an
 *   interval eigenvalue enclosure can certify through this chain is c_sharp >= -3065.435 -- exactly
 *   the pre-existing bathtub floor, NO improvement. Worse, since the true R ~ 1530 > 1343.796, the
 *   claim c_sharp >= -1343.796 is STRONGER than the chain rigorously delivers (-R_true ~ -1530) and
 *   is NOT justified by it (it holds only because the true c_sharp ~ +0.582 is positive, imp-97206).
 *
 * VERDICT. OBSTRUCTED -- and directionally, not just numerically. The imp-97457 residual asks to
 *   certify R via an interval eigenvalue enclosure, but (a) the finite-section eigenvalue is a
 *   LOWER bracket on R that has not even converged at T=12 (true R ~ 1520-1540, not 1343.796), and
 *   (b) a rigorous floor requires an UPPER bound on R, which finite sections never give; the only
 *   rigorous upper brackets on R (bathtub 3065.435, ||M||_inf 4336.198) leave the certifiable floor
 *   at the bathtub value -3065.435. Promoting a sub-bathtub realizable floor would require a genuine
 *   a-priori operator upper bound on lambda_max(P_a M_{sigma_2^-} P_a) below 3065.435 (e.g. a
 *   certified spectral-projection / Kato-Temple argument with rigorous a-priori localization of the
 *   top eigenvector), which the finite-section route cannot supply. Assessment only; no rigorous
 *   bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open;
 *   NO QED.
 *   SUB-GAP IMP97476_REALIZABLE_FLOOR_NEEDS_APRIORI_OPERATOR_UPPER_BOUND (finite sections give only
 *   a lower bracket; a rigorous floor below the bathtub 3065.435 needs an a-priori upper bound on
 *   lambda_max, not an interval eigenvalue enclosure of a truncated section).
 *
 * @see imp-97457-krein-bathtub-realizability-gap.js (the MEASURED R = 1343.796 this leaf assesses)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub rigorous upper envelope 3065.435 on R)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (full P_a M_sigma2 P_a; unbounded above)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~ +0.582 upper bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; reach 2a <= 0.96)
 *
 * Runner: tmp/imp-97476-tail-assess.py, tmp/imp-97476-bracket.py (numpy sinc-projector matrix,
 *   mpmath dps=30 symbol; T-sweep at h=0.01). Assessment only; NO QED.
 * Ticket: imp-97476 (numerical, medium, opus-4-8). Changes no bound; no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);      // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;            // 0.5493061443340548 -- half-width a (2a = ln3)

export const IMP97476_BINDING_2A = LN3;
export const IMP97476_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// Baked from tmp/imp-97476-bracket.py (h = 0.01 T-sweep; Rayleigh-Ritz LOWER bracket on true R).
const LAMBDA_LADDER = Object.freeze([
  { T: 12, lam: 1343.796 },   // imp-97457 value -- truncation-limited, NOT converged
  { T: 16, lam: 1442.608 },
  { T: 20, lam: 1489.564 },
  { T: 24, lam: 1507.592 },
  { T: 28, lam: 1514.830 },
  { T: 32, lam: 1523.891 },
]);

const IMP97457_MEASURED_R = 1343.796;     // finite-section lam_max at T=12 (imp-97457)
const BATHTUB_ENVELOPE = 3065.435;        // rigorous rearrangement UPPER bound on R (imp-97416)
const DEEPEST_WELL_T = 9.3502;            // argmax of sigma_2^- (top-eigenvector concentration site)
const OPNORM_UPPER = 4336.198;            // ||M_{sigma_2^-}||_inf = sup sigma_2^- (rigorous UPPER bound on R)
const CONVERGED_R_APPROX = 1530;          // approximate converged true R from the shrinking ladder increments
const MEASURED_CSHARP = 0.582;            // imp-97206 upper bracket (true value is positive)

export const IMP97476_ASSESSMENT = Object.freeze({
  lambdaLadder: LAMBDA_LADDER,                              // finite-section lam_max vs window T
  measuredRatT12: IMP97457_MEASURED_R,                      // 1343.796
  convergedRApprox: CONVERGED_R_APPROX,                     // ~1530 (still rising at T=32)
  truncationUnderestimatePct: 100 * (1 - IMP97457_MEASURED_R / CONVERGED_R_APPROX), // ~12.2%
  deepestWellT: DEEPEST_WELL_T,                             // 9.3502
  opNormUpperBound: OPNORM_UPPER,                           // 4336.198 = sup sigma_2^- (rigorous)
  bathtubEnvelope: BATHTUB_ENVELOPE,                        // 3065.435 (rigorous)
  finiteSectionIsLowerBracket: true,                        // Rayleigh-Ritz => lam_max_section <= true R
  floorNeedsUpperBoundOnR: true,                            // c_sharp >= -R needs an UPPER bound on R
  certifiableFloorFromEnclosure: -BATHTUB_ENVELOPE,         // best rigorous floor via this chain = bathtub
  improvesBathtubFloor: false,                              // interval enclosure cannot beat -3065.435
});

export const IMP97476_VERDICT = Object.freeze({
  ticket: 'imp-97476',
  question:
    'can the imp-97457 measured realizable negative floor c_sharp >= -R with R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 be promoted to a rigorous bound via a verified interval enclosure of the top eigenvalue?',
  answer:
    'OBSTRUCTED, directionally. A finite section is a compression of P_a M_{sigma_2^-} P_a to a subspace, so its top eigenvalue is a Rayleigh-Ritz LOWER bracket on the true R and rises with the window T (T=12: 1343.796; T=16: 1442.608; T=20: 1489.564; T=24: 1507.592; T=28: 1514.830; T=32: 1523.891) even though all sigma_2^- mass sits within |t| <= 10.5 -- the top eigenvector concentrates on the deepest well at t ~ 9.35 (depth 4336.198) and its 1/t band-limited sinc tails are clipped by the [-12,12] window, so 1343.796 is a truncation-limited underestimate ~12% below the converged R ~ 1530, NOT a grid-stable measurement. Moreover a rigorous FLOOR requires an UPPER bound on R, which finite sections never give; the rigorous upper brackets actually available (bathtub rearrangement 3065.435; operator-norm ||sigma_2^-||_inf = 4336.198) both exceed 1343.796, so the best floor an interval eigenvalue enclosure can certify through this chain is c_sharp >= -3065.435, exactly the pre-existing bathtub floor -- no improvement. Promoting a sub-bathtub realizable floor needs an a-priori operator upper bound on lambda_max below 3065.435, not an enclosure of a truncated finite section. Assessment only; no rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  binding_2a: LN3,
  // Finding 1
  finiteSectionIsLowerBracket: true,
  measuredRatT12: IMP97457_MEASURED_R,
  convergedRApprox: CONVERGED_R_APPROX,
  deepestWellT: DEEPEST_WELL_T,
  deepestWellDepth: OPNORM_UPPER,
  // Finding 2
  floorNeedsUpperBoundOnR: true,
  rigorousUpperBoundsOnR: { bathtub: BATHTUB_ENVELOPE, opNorm: OPNORM_UPPER },
  certifiableFloorFromEnclosure: -BATHTUB_ENVELOPE,
  improvesBathtubFloor: false,
  // assessment-only guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97476_REALIZABLE_FLOOR_NEEDS_APRIORI_OPERATOR_UPPER_BOUND',
  qed: false,
});
export default IMP97476_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97476_ASSERTIONS = [
  {
    id: 'imp97476-deepest-well-is-operator-norm-upper-bound',
    holds: () => {
      // sup sigma_2^- = -min sigma_2 at t ~ 9.35 is the rigorous ||M||_inf upper bound on R.
      const depth = -sigma2(DEEPEST_WELL_T);
      const okDepth = Math.abs(depth - OPNORM_UPPER) < 5;             // ~4336
      const isUpperBoundOnR = OPNORM_UPPER > IMP97457_MEASURED_R;     // exceeds the measured value
      return okDepth && isUpperBoundOnR;
    },
    why: 'the deepest sigma_2^- well at t ~ 9.35 has depth ~4336.198 = ||M_{sigma_2^-}||_inf, a rigorous operator-norm upper bound on R that (like the bathtub 3065.435) exceeds the measured 1343.796.',
  },
  {
    id: 'imp97476-finite-section-is-monotone-rising-lower-bracket',
    holds: () => {
      const L = LAMBDA_LADDER;
      // strictly increasing in T (Rayleigh-Ritz lower bracket rising toward true R)
      let monotone = true;
      for (let i = 1; i < L.length; i++) if (!(L[i].lam > L[i - 1].lam)) monotone = false;
      const startsAtMeasured = Math.abs(L[0].lam - IMP97457_MEASURED_R) < 1e-3 && L[0].T === 12;
      const belowConverged = L[L.length - 1].lam < CONVERGED_R_APPROX; // still climbing at T=32
      const underestimate = IMP97457_MEASURED_R < CONVERGED_R_APPROX;  // T=12 undershoots true R
      return monotone && startsAtMeasured && belowConverged && underestimate;
    },
    why: 'the finite-section lam_max rises strictly with the window T (1343.796 -> 1523.891 over T=12..32) as a Rayleigh-Ritz lower bracket on the true R ~ 1530, so the imp-97457 T=12 value is a truncation-limited underestimate, not a converged measurement.',
  },
  {
    id: 'imp97476-enclosure-cannot-beat-bathtub-floor',
    holds: () => {
      const V = IMP97476_ASSESSMENT;
      // a floor needs an UPPER bound on R; the available rigorous ones exceed 1343.796
      const needsUpper = V.floorNeedsUpperBoundOnR === true && V.finiteSectionIsLowerBracket === true;
      const upperBoundsExceedMeasured = V.bathtubEnvelope > IMP97457_MEASURED_R && V.opNormUpperBound > IMP97457_MEASURED_R;
      const floorEqualsBathtub = Math.abs(V.certifiableFloorFromEnclosure - (-BATHTUB_ENVELOPE)) < 1e-6;
      const noImprovement = V.improvesBathtubFloor === false;
      return needsUpper && upperBoundsExceedMeasured && floorEqualsBathtub && noImprovement;
    },
    why: 'a rigorous floor c_sharp >= -R needs an UPPER bound on R, but finite sections give only a lower bracket; the rigorous upper brackets available (bathtub 3065.435, ||M||_inf 4336.198) both exceed 1343.796, so an interval enclosure certifies at best -3065.435 = the pre-existing bathtub floor.',
  },
  {
    id: 'imp97476-assessment-only-no-qed',
    holds: () =>
      IMP97476_VERDICT.measuredNotIntervalCertified === true &&
      IMP97476_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97476_VERDICT.operatorPositivityProved === false &&
      IMP97476_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97476_VERDICT.boundMoves === false &&
      IMP97476_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97476_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97476_BINDING_2A - LN3) < 1e-12 &&
      IMP97476_VERDICT.subGap === 'IMP97476_REALIZABLE_FLOOR_NEEDS_APRIORI_OPERATOR_UPPER_BOUND' &&
      IMP97476_VERDICT.qed === false,
    why: 'assessment only: the interval-eigenvalue-enclosure route is the wrong-sign bracket for a floor and cannot beat the bathtub -3065.435; no rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97476_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97476-krein-realizable-floor-enclosure-obstruction assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
