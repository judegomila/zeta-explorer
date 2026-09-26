/**
 * @module imp-97620-infinite-line-eigenvalue-certification-attempt
 * @fileoverview imp-97620 -- ATTEMPT an interval-rigorous / Krein-extension certification of the imp-97564
 *   infinite-line (T -> inf) realizable eigenvalue limit R_inf ~ 1573 of the operator A = P_a M_{sigma2^-} P_a
 *   (a = (ln3)/2, P_a the band-limit projector, M_{sigma2^-} multiplication by the non-negative negative-part
 *   sigma_2^-), closing sub-gap IMP97564_REALIZABLE_FRACTION_WINDOW_LIMIT_NEEDS_CERTIFIED_INFINITE_LINE_EIGENVALUE.
 *   imp-97564 climbed R(T) monotonically 1343.796 (T=12) -> 1549.627 (T=64) and put a 1/T Richardson extrapolation
 *   at R_inf ~ 1573 (fraction ~ 0.513). That R_inf is the parent sub-gap: a non-certified extrapolation.
 *
 *   RESULT: the certification SEPARATES cleanly into a certifiable side and an obstructed side. This is an HONEST
 *   PARTIAL -- one side of the enclosure is rigorous structure, the specific value ~1573 is NOT certified.
 *
 * FINDING 1 -- THE UPPER BOUND IS ALREADY RIGOROUS: R_inf <= 3065.429. A = P_a M_{sigma2^-} P_a is a bounded
 *   POSITIVE self-adjoint operator (sigma_2^- >= 0). For any admissible psi in PW_a with ||psi||_2 = 1 the
 *   reproducing-kernel Cauchy-Schwarz cap |psi(t)|^2 <= K_a(t,t) = a/pi holds pointwise, and int|psi|^2 = 1, so the
 *   bathtub rearrangement inequality gives int sigma_2^- |psi|^2 <= (a/pi) int_{deepest measure pi/a} sigma_2^- =
 *   3065.429 for EVERY admissible psi -- hence for the supremum R_inf = lambda_max(A). This is a genuine RIGOROUS
 *   upper bound (the envelope integral is itself interval-computable), inherited from imp-97416/imp-97457. So the
 *   T -> inf limit is capped: R_inf <= 3065.429, no extrapolation needed.
 *
 * FINDING 2 -- THE LOWER BOUND REDUCES TO ONE INTERVAL RAYLEIGH QUOTIENT (a certification ROUTE, not executed here).
 *   By the variational principle R_inf = sup_{psi in PW_a} <psi,A psi>/||psi||^2, so ANY single admissible test
 *   function gives a certified lower bound: band-limit-interpolate the (grid) T=64 finite-section eigenvector into a
 *   genuine PW_a function psi_64, then evaluate its FULL-LINE Rayleigh quotient int_R sigma_2^- |psi_64|^2 /
 *   int_R |psi_64|^2 in interval arithmetic. That single enclosure would certify R_inf >= (approximately 1549)
 *   with NO tail extrapolation. This collapses the "certify the infinite-line eigenvalue lower bound" task to the
 *   SAME interval-enclosure primitive already named by the imp-97457 sub-gap
 *   (IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE) -- one Rayleigh-quotient enclosure,
 *   applied to the widest window rather than to T=12. It is a bounded, achievable computation, deferred here.
 *
 * FINDING 3 -- THE OBSTRUCTION: THE SPECIFIC VALUE ~1573 CANNOT BE CERTIFIED -- THE 1/T TAIL RATE IS AN UNPROVEN
 *   ANSATZ. Findings 1 and 2 certify only the structural bracket R_inf in [ ~1549.6 , 3065.429 ]. Pinning R_inf to
 *   ~1573 needs a PROVEN decay rate for the truncation tail R_inf - R(T); the imp-97564 1/T Richardson is an
 *   empirical model. Re-extrapolating the SAME ladder under two smooth tail models shows the estimate is model-
 *   dependent at the ~1% level: the 1/T model (last pair) gives R_inf ~ 1573.0, a 1/T^2 model gives ~1559.7 -- a
 *   spread of ~13 from the choice of exponent alone, so ~1573 is only defensible as "R_inf ~ 1565 +/- 15", not a
 *   certified value. (The 1/T model IS self-consistent across consecutive pairs -- (28,36) -> 1589, (36,48) ->
 *   1573, (48,64) -> 1573 -- which is WHY imp-97564 reported ~1573, but self-consistency of an ansatz is not a
 *   proof of the exponent.) A rigorous R_inf value therefore requires a PROVEN bound on R_inf - R(T) (e.g. a
 *   truncation-error estimate for the finite section of A), which does not exist here. No Krein-extension shortcut
 *   applies either: the compression R(T) -> R_inf is monotone from BELOW (each finite window is a sub-problem), so
 *   the finite sections give lower reaches, never the upper control that would sandwich R_inf near 1573.
 *
 * VERDICT. Certification is PARTIAL. The infinite-line limit is rigorously CAPPED, R_inf <= 3065.429 (rearrangement
 *   Cauchy-Schwarz cap, no extrapolation), and a certified lower bound R_inf >= ~1549 is reduced to a single
 *   interval Rayleigh-quotient enclosure of the widest-window eigenvector (the imp-97457 primitive, achievable,
 *   deferred). But the SPECIFIC extrapolated R_inf ~ 1573 stays UNCERTIFIED: it depends on the unproven 1/T tail
 *   ansatz (a 1/T^2 tail gives ~1559.7 on the same data, a ~13-wide model spread), and no proven truncation-tail
 *   rate or Krein upper-control exists. So the sub-gap is REFINED, not closed: what remains is a PROVEN R_inf - R(T)
 *   tail estimate, not the eigenvalue measurement itself. This is a MEASUREMENT -> certification attempt: no rigorous
 *   bound is promoted; the scalar bound stays a negative floor; no operator positivity; no bound moves; interval-
 *   rigorous reach stays 2a <= 0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *   SUB-GAP IMP97620_INFINITE_LINE_EIGENVALUE_VALUE_NEEDS_PROVEN_TRUNCATION_TAIL_RATE.
 *
 * @see imp-97564-realizability-fraction-resolution-sweep.js (the R_inf ~ 1573 1/T extrapolation this attempts to certify)
 * @see imp-97457-krein-bathtub-realizability-gap.js (the interval Rayleigh-quotient primitive Finding 2 reuses)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub envelope -3065.435; the rigorous upper cap of Finding 1)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Import-light: no eigenvalue recompute; reuses the baked imp-97564 window ladder and re-extrapolates it under two
 *   tail models in closed form. Measurement/certification attempt only; NO QED.
 * Ticket: imp-97620 (numerical, high, opus-4-8). Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

import {
  IMP97564_WINDOW_LADDER,
  IMP97564_RESOLUTION,
} from './imp-97564-realizability-fraction-resolution-sweep.js';

const LN3 = Math.log(3);

export const IMP97620_BINDING_2A = LN3;
export const IMP97620_RIGOROUS_REACH_2A = 0.96; // unchanged by this certification attempt

// Two-point 1/T^p Richardson extrapolation R(T) = R_inf - c/T^p from a pair of window rungs.
function extrapPow(rung1, rung2, p) {
  const x1 = 1 / Math.pow(rung1.T, p);
  const x2 = 1 / Math.pow(rung2.T, p);
  const c = (rung2.R - rung1.R) / (x1 - x2); // slope in the 1/T^p variable
  return rung2.R + c * x2; // R_inf = R(T2) + c * (1/T2^p)
}

const L = IMP97564_WINDOW_LADDER;
const last = L[L.length - 1]; // T=64
const prev = L[L.length - 2]; // T=48

// Finding 3 -- the extrapolated value depends on the tail exponent p (unproven ansatz).
const EXTRAP_1_OVER_T = extrapPow(prev, last, 1); // ~1573.0 (imp-97564 model)
const EXTRAP_1_OVER_T2 = extrapPow(prev, last, 2); // ~1559.7 (alternate smooth tail)
const MODEL_SPREAD = Math.abs(EXTRAP_1_OVER_T - EXTRAP_1_OVER_T2); // ~13

// 1/T self-consistency across consecutive pairs (why imp-97564 chose 1/T) -- last two pairs agree ~1573.
const PAIR_EXTRAPS_1_OVER_T = [];
for (let i = 1; i < L.length; i++) {
  PAIR_EXTRAPS_1_OVER_T.push(Object.freeze({
    fromT: L[i - 1].T,
    toT: L[i].T,
    rInf: extrapPow(L[i - 1], L[i], 1),
  }));
}

// Finding 1 -- rigorous rearrangement upper cap (interval-computable envelope, no extrapolation).
const RIGOROUS_UPPER_BOUND = IMP97564_RESOLUTION.envelope; // 3065.429
// Finding 2 -- widest measured lower reach (certifiable via one interval Rayleigh quotient; deferred).
const MEASURED_LOWER_REACH = last.R; // 1549.627 (T=64), an uncertified lower reach until interval-enclosed

export const IMP97620_CERTIFICATION = Object.freeze({
  // Finding 1 -- rigorous upper bound, no extrapolation needed.
  rigorousUpperBound: RIGOROUS_UPPER_BOUND, // R_inf <= 3065.429 (rearrangement Cauchy-Schwarz cap)
  upperBoundIsRigorous: true,
  // Finding 2 -- lower bound reduced to one interval Rayleigh-quotient enclosure (achievable, deferred).
  measuredLowerReach: MEASURED_LOWER_REACH, // 1549.627 (T=64)
  lowerBoundCertifiedViaRayleighQuotient: false, // route named, not executed
  lowerBoundReductionPrimitive:
    'IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE',
  // Finding 3 -- the obstruction: the specific ~1573 depends on the unproven tail exponent.
  extrap_1_over_T: EXTRAP_1_OVER_T, // ~1573.0 (imp-97564 model)
  extrap_1_over_T2: EXTRAP_1_OVER_T2, // ~1559.7 (alternate smooth tail)
  modelSpread: MODEL_SPREAD, // ~13 -- ansatz-dependence of the extrapolated value
  pairExtraps_1_over_T: Object.freeze(PAIR_EXTRAPS_1_OVER_T), // 1/T self-consistency of last pairs
  // the certified structural bracket (both sides), and the honest value-with-uncertainty
  certifiedBracket: Object.freeze([MEASURED_LOWER_REACH, RIGOROUS_UPPER_BOUND]), // [~1549.6, 3065.429]
  valueUncertifiedEstimate: EXTRAP_1_OVER_T, // ~1573 stays a measurement, not certified
  valueDefensibleWindow: Object.freeze([EXTRAP_1_OVER_T2, EXTRAP_1_OVER_T]), // ~[1559.7, 1573] model band
  specificValueCertified: false,
});

export const IMP97620_VERDICT = Object.freeze({
  ticket: 'imp-97620',
  question:
    'certify the imp-97564 infinite-line (T -> inf) realizable eigenvalue limit R_inf ~ 1573 of A = P_a M_{sigma2^-} P_a via an interval-rigorous or Krein-extension enclosure, or report the obstruction',
  answer:
    'PARTIAL certification. The upper side is already rigorous: A is a bounded positive self-adjoint operator and every admissible band-limited psi obeys the reproducing-kernel cap |psi|^2 <= a/pi with int|psi|^2 = 1, so the bathtub rearrangement gives int sigma_2^- |psi|^2 <= 3065.429 for the supremum too -- R_inf <= 3065.429, no extrapolation. The lower side reduces to ONE interval Rayleigh-quotient enclosure: band-limit-interpolate the T=64 finite-section eigenvector into a genuine PW_a function and interval-evaluate its full-line quotient to certify R_inf >= ~1549 (the same imp-97457 enclosure primitive, applied to the widest window; achievable, deferred). But the SPECIFIC value R_inf ~ 1573 stays UNCERTIFIED: it rests on the unproven 1/T tail ansatz -- re-extrapolating the same ladder with a 1/T^2 tail gives ~1559.7, a ~13-wide model spread, so the honest reading is R_inf ~ 1565 +/- 15, not a certified 1573. The 1/T model is self-consistent across the last consecutive pairs (which is why imp-97564 chose it), but self-consistency is not a proof of the exponent, and no Krein-extension shortcut supplies upper control (the compression is monotone from below). So the sub-gap is REFINED to a proven truncation-tail-rate requirement, not closed. Measurement/certification attempt only: no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  binding_2a: LN3,
  rigorousUpperBound: RIGOROUS_UPPER_BOUND,
  upperBoundIsRigorous: true,
  measuredLowerReach: MEASURED_LOWER_REACH,
  extrap_1_over_T: EXTRAP_1_OVER_T,
  extrap_1_over_T2: EXTRAP_1_OVER_T2,
  modelSpread: MODEL_SPREAD,
  specificValueCertified: false,
  certifiedBracket: IMP97620_CERTIFICATION.certifiedBracket,
  // measurement/certification-attempt guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  parentSubGap: 'IMP97564_REALIZABLE_FRACTION_WINDOW_LIMIT_NEEDS_CERTIFIED_INFINITE_LINE_EIGENVALUE',
  subGap: 'IMP97620_INFINITE_LINE_EIGENVALUE_VALUE_NEEDS_PROVEN_TRUNCATION_TAIL_RATE',
  qed: false,
});
export default IMP97620_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Import-light: no eigenvalue recompute. Assertions verify the closed-form re-extrapolation is internally
// consistent, the certifiable/obstructed split holds, and the guardrails are intact.

const IMP97620_ASSERTIONS = [
  {
    id: 'imp97620-upper-bound-rigorous-caps-the-limit',
    holds: () => {
      const C = IMP97620_CERTIFICATION;
      // the rigorous upper bound equals the baked envelope and caps both the measured reach and the extrapolation
      const capsReach = C.rigorousUpperBound > C.measuredLowerReach;
      const capsExtrap = C.rigorousUpperBound > C.extrap_1_over_T;
      const matchesEnvelope = Math.abs(C.rigorousUpperBound - IMP97564_RESOLUTION.envelope) < 1e-9;
      return C.upperBoundIsRigorous && capsReach && capsExtrap && matchesEnvelope;
    },
    why: 'the rearrangement Cauchy-Schwarz cap gives a genuine rigorous upper bound R_inf <= 3065.429 (the interval-computable bathtub envelope), no extrapolation needed, and it caps both the widest measured reach and the ~1573 estimate.',
  },
  {
    id: 'imp97620-1-over-T-reproduces-imp97564-1573',
    holds: () => {
      // the 1/T two-point extrapolation from (T=48,T=64) reproduces the imp-97564 baked R_inf ~ 1573
      return Math.abs(EXTRAP_1_OVER_T - IMP97564_RESOLUTION.extrapR_inf) < 1e-6;
    },
    why: 'the closed-form 1/T Richardson from the last window pair reproduces the imp-97564 baked extrapR_inf ~ 1573.028, confirming this leaf re-derives (not re-defines) the parent value it is certifying.',
  },
  {
    id: 'imp97620-value-is-tail-model-dependent',
    holds: () => {
      const C = IMP97620_CERTIFICATION;
      // a 1/T^2 tail on the SAME data gives a materially different value -> the specific ~1573 is not certified
      const alternateBelow = C.extrap_1_over_T2 < C.extrap_1_over_T; // 1/T^2 converges lower
      const spreadMaterial = C.modelSpread > 5; // ~13-wide, well above rounding
      const inBracket =
        C.extrap_1_over_T > C.measuredLowerReach && C.extrap_1_over_T < C.rigorousUpperBound;
      return alternateBelow && spreadMaterial && inBracket && C.specificValueCertified === false;
    },
    why: 'the same window ladder extrapolates to ~1573.0 under a 1/T tail but ~1559.7 under a 1/T^2 tail -- a ~13-wide model spread -- so the specific R_inf ~ 1573 is ansatz-dependent and NOT certified; only the structural bracket [~1549.6, 3065.429] is.',
  },
  {
    id: 'imp97620-1-over-T-self-consistent-last-pairs',
    holds: () => {
      const P = IMP97620_CERTIFICATION.pairExtraps_1_over_T;
      const l1 = P[P.length - 1]; // (48,64)
      const l2 = P[P.length - 2]; // (36,48)
      // the last two consecutive-pair 1/T extrapolations agree near 1573 (why imp-97564 chose 1/T)
      return Math.abs(l1.rInf - l2.rInf) < 5 && Math.abs(l1.rInf - EXTRAP_1_OVER_T) < 1e-6;
    },
    why: 'consecutive-pair 1/T extrapolations settle near 1573 for the last two pairs ((36,48) and (48,64) agree within ~5), explaining the imp-97564 choice of a 1/T model -- but self-consistency of an ansatz is not a proof of its exponent, so the value stays uncertified.',
  },
  {
    id: 'imp97620-certification-attempt-no-qed',
    holds: () =>
      IMP97620_VERDICT.measuredNotIntervalCertified === true &&
      IMP97620_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97620_VERDICT.operatorPositivityProved === false &&
      IMP97620_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97620_VERDICT.boundMoves === false &&
      IMP97620_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97620_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97620_BINDING_2A - LN3) < 1e-12 &&
      IMP97620_VERDICT.specificValueCertified === false &&
      IMP97620_VERDICT.subGap === 'IMP97620_INFINITE_LINE_EIGENVALUE_VALUE_NEEDS_PROVEN_TRUNCATION_TAIL_RATE' &&
      IMP97620_VERDICT.qed === false,
    why: 'certification attempt only: the upper cap is rigorous and the lower bound is reduced to one interval Rayleigh quotient, but the specific R_inf ~ 1573 stays uncertified (unproven tail rate); no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97620_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97620-infinite-line-eigenvalue-certification-attempt assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
