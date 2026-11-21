/**
 * @module imp-97120-krein-t-only-eta-rate-not-stable
 * @fileoverview imp-97120 -- MEASUREMENT (numerical): is the imp-97058 joint T-exponent q~0.354 a
 *   STABLE genuine algebraic convergence rate in the integration cutoff T, or itself an artifact,
 *   once the T direction is measured IN ISOLATION at fixed large Nbig and DECOUPLED from the failed
 *   Nbig side? imp-97058 fit the coupled additive-bias surface eta = eta_inf - a*Nbig^-p + c*T^-q and
 *   found the Nbig exponent p PINNED at the search floor with a runaway eta_inf=1.081 (unphysical,
 *   eta<1) -- no genuine coupled rate -- but its T-exponent returned q=0.3542, NOT pinned, so the
 *   question of whether the T side carries a real rate on its own was left as a compromise-artifact
 *   claim (imp-97058 Finding 2) rather than a decoupled closed-form measurement. This leaf performs
 *   that decoupled measurement.
 *
 *   Measurement only. The Ritz value is an UPPER bound on lambda_1(T), so eta_T,inf / the floor is an
 *   upper estimate, NOT a certified lower bound. No bound moves; interval-rigorous reach stays
 *   2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * DATA. Reused verbatim from imp-96911-krein-eta-nconvergence-scout.js IMP96911_T_SENSITIVITY: the
 *   T-sensitivity rungs at Nbig in {120,200,240}, T in {800,1600,3200} (a geometric T ladder, ratio 2).
 *
 * METHOD (closed form, no optimizer). Per Nbig slice fit the single-parameter power
 *     eta(T) = eta_T,inf - c*T^-q,   c,q > 0 for algebraic convergence.
 *   On a geometric T ladder T in {T0, 2 T0, 4 T0} the first differences
 *     d1 = eta(T0) - eta(2 T0) = c*T0^-q (1 - 2^-q),
 *     d2 = eta(2 T0) - eta(4 T0) = c*T0^-q * 2^-q (1 - 2^-q),
 *   so d2/d1 = 2^-q and the exponent is EXACTLY q = log2(d1/d2). A genuine algebraic rate needs
 *   0 < d2 < d1 (differences shrinking geometrically) with an Nbig-stable q. This closed form
 *   reproduces the imp-97058 exactly-determined per-Nbig optimizer fits (q=1.9358, 0.5593) as a
 *   cross-check, and diagnoses the third slice sharply.
 *
 * FINDING 1 -- THE T-ONLY EXPONENT q IS NOT Nbig-STABLE: 1.936 / 0.559 / degenerate. The decoupled
 *   per-slice closed form gives q=1.9358 (Nbig=120), q=0.5593 (Nbig=200), and DEGENERATE at Nbig=240.
 *   The three values do not settle toward the joint q=0.354 as Nbig grows; they FALL from ~1.94 then
 *   break down. The joint q=0.354 is a compromise sitting between the two well-defined slices, NOT a
 *   limit any slice approaches -- confirming it is a surface-fit averaging artifact, not a stable
 *   T-rate.
 *
 * FINDING 2 -- AT THE LARGEST Nbig=240 THE T-LADDER IS STILL PRE-ASYMPTOTIC (ACCELERATING). At
 *   Nbig=240 the second difference EXCEEDS the first: d1=0.015795, d2=0.020742, so d2/d1=1.3132 > 1
 *   and q = log2(d1/d2) = -0.393 < 0. A negative exponent means NO decaying power fits -- eta is
 *   accelerating downward in T, not converging. imp-97058's bounded optimizer expressed the same
 *   degeneracy as q~0.0002 pinned at its floor with a runaway eta_lim=-174. Crucially this breakdown
 *   happens at the LARGEST Nbig, exactly where a genuine T-rate would most need to be clean: the T
 *   truncation has not entered its asymptotic regime by T=3200 at Nbig=240, so there is no T-rate to
 *   measure there at all.
 *
 * VERDICT. Measured in isolation and decoupled from the failed Nbig side, the imp-97058 T-exponent
 *   q~0.354 is NOT a stable genuine algebraic convergence rate in T: the per-Nbig T-only exponents are
 *   1.936 / 0.559 / degenerate (a monotone fall then breakdown, not a settling toward 0.354), and at
 *   the largest Nbig=240 the T ladder is still accelerating (second difference exceeds first, so no
 *   decaying power exists). q=0.354 is a coupled-surface averaging artifact. This CONFIRMS and
 *   SHARPENS imp-97058 IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE and imp-96911
 *   IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE: neither truncation direction carries a
 *   standalone rate; the T direction degenerates precisely at the largest evaluation space.
 *   SUB-GAP IMP97120_T_ONLY_ETA_RATE_NOT_STABLE_ACROSS_NBIG. Ritz value is an UPPER bound so the floor
 *   is an upper estimate, not a certified LB; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (IMP96911_T_SENSITIVITY -- the T-ladder data reused here)
 * @see imp-97058-krein-coupled-nt-surface-fit-no-rate.js (the joint surface fit whose q=0.354 this leaf isolates)
 * @see imp-96969-coupled-nt-truncation-wall-cohort-index.js (the closed-lever cohort this measurement sits in)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97120_RIGOROUS_REACH_2A = 0.96;
export const IMP97120_BINDING_2A = LN3;
export const IMP97120_T_LADDER = Object.freeze([800, 1600, 3200]); // geometric, ratio 2
export const IMP97120_JOINT_Q_FROM_IMP97058 = 0.3542; // the coupled-surface T-exponent under test

// Decoupled per-Nbig T-only closed-form fit eta(T) = eta_T,inf - c*T^-q on the ratio-2 ladder:
//   q = log2(d1/d2), d1 = eta(800)-eta(1600), d2 = eta(1600)-eta(3200).
// Genuine algebraic convergence requires 0 < d2 < d1 (i.e. d2/d1 < 1, q > 0). Nbig=240 fails this.
export const IMP97120_T_ONLY_FIT = Object.freeze([
  Object.freeze({ Nbig: 120, d1: 0.020760, d2: 0.005426, d2_over_d1: 0.261368, q: 1.935798, converging: true }),
  Object.freeze({ Nbig: 200, d1: 0.023241, d2: 0.015772, d2_over_d1: 0.678628, q: 0.559313, converging: true }),
  // Nbig=240: d2 > d1 -> accelerating (pre-asymptotic), q < 0, NO decaying power exists.
  Object.freeze({ Nbig: 240, d1: 0.015795, d2: 0.020742, d2_over_d1: 1.313200, q: -0.393115, converging: false }),
]);

export const IMP97120_VERDICT = Object.freeze({
  ticket: 'imp-97120',
  question: 'is the imp-97058 joint T-exponent q~0.354 a stable genuine algebraic convergence rate in T, measured in isolation at fixed Nbig and decoupled from the failed Nbig side?',
  binding_2a: LN3,
  method: 'closed-form per-Nbig T-only fit q = log2(d1/d2) on the geometric T ladder {800,1600,3200}',
  // Finding 1: the T-only exponent is not Nbig-stable and does not settle toward 0.354
  perNbigTexponents: [1.935798, 0.559313, -0.393115], // 120 / 200 / 240
  tExponentNbigStable: false,
  settlesTowardJointQ: false, // 1.936 -> 0.559 -> degenerate; joint 0.354 is a between-slices artifact
  jointQisArtifact: true,
  // Finding 2: the largest-Nbig slice is pre-asymptotic (accelerating), so no T-rate exists there
  largestNbigLadderAccelerating: true, // d2 > d1 at Nbig=240 (0.020742 > 0.015795)
  largestNbigQnegative: true,          // q = -0.393 < 0, no decaying power fits
  reproducesImp97058Optimizer: true,   // q=1.9358 / 0.5593 match the exactly-determined per-Nbig fits
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97120_T_ONLY_ETA_RATE_NOT_STABLE_ACROSS_NBIG -- measured in isolation and decoupled from the failed Nbig side, the imp-97058 joint T-exponent q~0.354 is NOT a stable genuine algebraic convergence rate in the integration cutoff T. The decoupled per-Nbig closed-form fit eta(T) = eta_T,inf - c*T^-q on the geometric ladder {800,1600,3200} (q = log2(d1/d2) exactly) gives q=1.9358 (Nbig=120), q=0.5593 (Nbig=200) -- reproducing the imp-97058 exactly-determined per-Nbig optimizer -- and DEGENERATE at Nbig=240 where the second difference exceeds the first (d1=0.015795 < d2=0.020742, d2/d1=1.3132 > 1, q=-0.393 < 0): the T ladder is still accelerating / pre-asymptotic at the largest evaluation space, so no decaying power exists to fit. The three per-slice q values fall (1.936 -> 0.559 -> breakdown), they do NOT settle toward the joint q=0.354 as Nbig grows, so q=0.354 is a coupled-surface averaging artifact sitting between the two well-defined slices, not a limit any slice approaches. This CONFIRMS and SHARPENS imp-97058 IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE and imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE: neither the Nbig nor the T truncation direction carries a standalone algebraic rate, and the T direction degenerates precisely at the largest Nbig where a clean rate would most be needed. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB; measurement only, no bound moves',
  qed: false,
});
export default IMP97120_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97120_ASSERTIONS = [
  {
    id: 'imp97120-closed-form-q-matches-differences',
    holds: () => {
      // q = log2(d1/d2) must be reproduced from the stored differences to 4 decimals for each slice,
      // and d2/d1 must equal the stored ratio.
      return IMP97120_T_ONLY_FIT.every((r) => {
        const q = Math.log(r.d1 / r.d2) / Math.log(2);
        const ratio = r.d2 / r.d1;
        return Math.abs(q - r.q) < 1e-4 && Math.abs(ratio - r.d2_over_d1) < 1e-4;
      });
    },
    why: 'the stored per-Nbig T-only exponent q must equal the closed-form log2(d1/d2) from the geometric T ladder, and d2/d1 must match the stored ratio.',
  },
  {
    id: 'imp97120-t-exponent-not-nbig-stable',
    holds: () => {
      const q = IMP97120_VERDICT.perNbigTexponents;
      // the three T-only exponents are inconsistent by more than an order of magnitude and are not
      // clustered around the joint q=0.354; none of the well-defined slices sits near it.
      const spread = Math.max(...q) - Math.min(...q);
      const near354 = q.filter((v) => Math.abs(v - IMP97120_JOINT_Q_FROM_IMP97058) < 0.1).length;
      return spread > 2.0 && near354 === 0 &&
        IMP97120_VERDICT.tExponentNbigStable === false &&
        IMP97120_VERDICT.settlesTowardJointQ === false &&
        IMP97120_VERDICT.jointQisArtifact === true;
    },
    why: 'the decoupled per-Nbig T-only exponents span 1.936 / 0.559 / -0.393 (spread > 2), none within 0.1 of the joint q=0.354, so q=0.354 is a coupled-surface averaging artifact not a stable T-rate.',
  },
  {
    id: 'imp97120-largest-nbig-is-preasymptotic',
    holds: () => {
      const top = IMP97120_T_ONLY_FIT.find((r) => r.Nbig === 240);
      // at the largest Nbig the second difference exceeds the first (accelerating) -> negative q,
      // no decaying power exists to fit: the T ladder has not entered its asymptotic regime.
      return top && top.d2 > top.d1 && top.d2_over_d1 > 1.0 && top.q < 0 && top.converging === false &&
        IMP97120_VERDICT.largestNbigLadderAccelerating === true &&
        IMP97120_VERDICT.largestNbigQnegative === true;
    },
    why: 'at Nbig=240 (the largest evaluation space) the second difference exceeds the first (0.020742 > 0.015795), so q<0 and no decaying power fits -- the T truncation is still accelerating / pre-asymptotic at T=3200.',
  },
  {
    id: 'imp97120-measurement-only-no-qed',
    holds: () =>
      IMP97120_VERDICT.operatorPositivityProved === false &&
      IMP97120_VERDICT.boundMoves === false &&
      IMP97120_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97120_RIGOROUS_REACH_2A === 0.96 &&
      IMP97120_VERDICT.qed === false,
    why: 'measurement only: no operator positivity is established, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97120_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97120 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
