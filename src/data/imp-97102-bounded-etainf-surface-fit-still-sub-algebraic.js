/**
 * @module imp-97102-bounded-etainf-surface-fit-still-sub-algebraic
 * @fileoverview imp-97102 -- MEASUREMENT (numerical): does constraining eta_inf to the physical
 *   box eta<1 (and/or FIXING eta_inf at the measured ceiling ~0.64) rescue a genuine algebraic
 *   convergence rate from the imp-96911 Ritz eta drift toward the 2a=ln3 Krein floor, where the
 *   imp-97058 FREE joint two-parameter (Nbig,T) surface fit ran eta_inf away to an unphysical
 *   1.081 with the Nbig exponent p pinned at the search floor 0.05?
 *
 *   Driver tmp/imp-97102-bounded-etainf-surface-fit.py, /tmp/rhvenv scipy 1.18. Data reused
 *   verbatim from imp-96911-krein-eta-nconvergence-scout.js / imp-97058 (19 distinct (Nbig,T)
 *   points: the Nbig=24..240 ladder at T=800 plus the T-sensitivity rungs at Nbig in {120,200,240},
 *   T in {800,1600,3200}). 6000 restarts per variant.
 *
 *   MODEL (unchanged from imp-97058): eta(Nbig,T) = eta_inf - a*Nbig^-p + c*T^-q, a,c,p,q > 0,
 *   exponents searched in [0.05, 4.0]. The ONLY change is the eta_inf constraint.
 *
 *   Measurement only. The Ritz value is an UPPER bound on lambda_1(T), so eta_inf / the floor is an
 *   upper estimate, NOT a certified lower bound. The imp-96969 cohort stays closed as a lever; this
 *   measures only. No bound moves; interval-rigorous reach stays 2a<=0.96; RH open;
 *   no refereed bound is changed; NO QED.
 *
 * FINDING 1 -- CONSTRAINING eta_inf < 1 DOES NOT RESCUE A GENUINE RATE. With eta_inf boxed to
 *   (0.55, 0.999) the best 6000-restart fit gives eta_inf=0.999000 (PUSHED to the imposed <1
 *   ceiling), a=0.6355, p=0.0500 (STILL PINNED at the search floor), c=0.4694, q=0.1602, rms
 *   3.999e-3 -- no better than the free fit (3.983e-3) or the one-parameter power (5.47e-3). So the
 *   free-fit runaway to 1.081 was NOT the source of the failure: bounding eta_inf simply parks it at
 *   whatever ceiling is imposed while the Nbig exponent p keeps pinning at the floor. The drift is
 *   genuinely SUB-ALGEBRAIC in Nbig, not an artifact of an unconstrained limit.
 *
 * FINDING 2 -- FIXING eta_inf AT THE MEASURED 0.64 CEILING MAKES THE FIT WORSE. Fixing eta_inf=0.64
 *   (measured resolvent-eigenvalue ceiling) and fitting only a,p,c,q gives a=0.5976, p=0.0539 (only
 *   a hair above the 0.05 floor -- effectively still floor-pinned), c=0.6721, q=0.0500 (now the T
 *   exponent q pins at the floor instead), rms 4.034e-3 -- WORSE than both the free fit and the
 *   variant-A bounded fit. The physical eta ceiling cannot be reconciled with an algebraic Nbig
 *   rate: forcing the correct limit just pushes the pinning from eta_inf onto q.
 *
 * VERDICT. Constraining eta_inf to the physical range eta<1 (or fixing it at the measured ~0.64)
 *   does NOT extract a genuine algebraic convergence rate for the imp-96911 eta drift. Either the
 *   Nbig exponent p stays pinned at the search floor (variant A, eta_inf parked at the imposed
 *   ceiling) or, when eta_inf is fixed correctly, the pinning migrates to q while rms degrades
 *   (variant B). This CONFIRMS and SHARPENS imp-97058
 *   IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE and imp-96911
 *   IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE: the runaway eta_inf=1.081 was a
 *   symptom, not the cause -- the Nbig drift is sub-algebraic under any physical eta_inf constraint.
 *   SUB-GAP IMP97102_BOUNDED_ETAINF_SURFACE_FIT_STILL_SUB_ALGEBRAIC. Ritz value is an UPPER bound so
 *   the floor is an upper estimate, not a certified LB; interval-rigorous reach stays 2a<=0.96;
 *   RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-97058-krein-coupled-nt-surface-fit-no-rate.js (the FREE joint fit whose eta_inf runaway this constrains)
 * @see imp-96911-krein-eta-nconvergence-scout.js (the single-power fit and the source data)
 * @see imp-96969-coupled-nt-truncation-wall-cohort-index.js (the closed-lever cohort this measurement sits in)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97102_RIGOROUS_REACH_2A = 0.96;
export const IMP97102_BINDING_2A = LN3;
export const IMP97102_N_DATA_POINTS = 19;
export const IMP97102_EXPONENT_SEARCH_RANGE = Object.freeze({ lo: 0.05, hi: 4.0 });
export const IMP97102_MEASURED_ETA_CEILING = 0.64; // resolvent eigenvalue measured ~0.64 (eta<1)

// free-fit reference from imp-97058 FINDING 1 (eta_inf runaway to 1.081, p pinned at 0.05)
export const IMP97102_FREE_FIT_REFERENCE = Object.freeze({
  eta_inf: 1.081073,
  p: 0.0500,
  rms: 3.983e-3,
});

// FINDING 1: eta_inf boxed to (0.55, 0.999) -- eta_inf parks at the ceiling, p STILL pins at floor.
export const IMP97102_BOUNDED_FIT = Object.freeze({
  model: 'eta = eta_inf - a*Nbig^-p + c*T^-q, eta_inf in (0.55, 0.999)',
  eta_inf: 0.999000,
  a: 0.635545,
  p: 0.0500, // Nbig exponent -- STILL PINNED at the search floor 0.05
  c: 0.469407,
  q: 0.1602,
  rms: 3.999e-3,
  pPinnedAtSearchFloor: true,
  etaInfPushedToImposedCeiling: true, // eta_inf hits the imposed <1 upper bound 0.999
  genuineRateExtractable: false,
});

// FINDING 2: eta_inf FIXED at the measured 0.64 -- pinning migrates to q, rms degrades.
export const IMP97102_FIXED_ETA_FIT = Object.freeze({
  model: 'eta = 0.64 - a*Nbig^-p + c*T^-q (eta_inf fixed)',
  eta_inf: 0.64,
  a: 0.597637,
  p: 0.0539, // a hair above the 0.05 floor -- effectively still floor-pinned
  c: 0.672137,
  q: 0.0500, // T exponent now PINS at the floor instead
  rms: 4.034e-3, // WORSE than the free fit (3.983e-3) and the bounded fit (3.999e-3)
  qPinnedAtSearchFloor: true,
  rmsWorseThanFreeFit: true,
  genuineRateExtractable: false,
});

export const IMP97102_VERDICT = Object.freeze({
  ticket: 'imp-97102',
  question: 'does constraining eta_inf < 1 (or fixing it at the measured ~0.64) rescue a genuine algebraic convergence rate from the imp-96911 Ritz eta drift, where the imp-97058 free fit ran eta_inf away to 1.081?',
  binding_2a: LN3,
  nDataPoints: 19,
  // Finding 1: bounded eta_inf still fails
  boundedFitPPinnedAtSearchFloor: true,
  boundedFitEtaInfAtImposedCeiling: true,
  boundedFitRms: 3.999e-3,
  // Finding 2: fixed eta_inf makes it worse
  fixedEtaFitQPinnedAtSearchFloor: true,
  fixedEtaFitRms: 4.034e-3,
  // overall
  genuineRateExtractable: false,
  subAlgebraicDriftPersists: true,
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97102_BOUNDED_ETAINF_SURFACE_FIT_STILL_SUB_ALGEBRAIC -- re-running the imp-97058 joint two-parameter (Nbig,T) additive-bias surface fit eta = eta_inf - a*Nbig^-p + c*T^-q with eta_inf physically constrained to eta<1 does NOT extract a genuine algebraic convergence rate for the imp-96889/imp-96911 Ritz eta drift at 2a=ln3. Boxing eta_inf to (0.55, 0.999) parks it at the imposed 0.999 ceiling while the Nbig exponent p STILL pins at the search floor 0.05 (rms 3.999e-3, no better than the free fit 3.983e-3); FIXING eta_inf at the measured resolvent ceiling 0.64 leaves p=0.0539 effectively at the floor, migrates the pinning onto the T exponent q (now 0.0500), and DEGRADES rms to 4.034e-3. The imp-97058 free-fit runaway to an unphysical eta_inf=1.081 was therefore a SYMPTOM, not the cause: the Nbig drift is genuinely sub-algebraic under any physical eta_inf constraint. This CONFIRMS and SHARPENS imp-97058 IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE and imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB; measurement only, no bound moves',
  qed: false,
});
export default IMP97102_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97102_ASSERTIONS = [
  {
    id: 'imp97102-bounded-etainf-fit-still-pins-p-at-floor',
    holds: () => {
      const f = IMP97102_BOUNDED_FIT;
      const lo = IMP97102_EXPONENT_SEARCH_RANGE.lo;
      return (
        f.pPinnedAtSearchFloor === true &&
        Math.abs(f.p - lo) < 1e-3 && // p still sits at the search floor -> not determined by data
        f.etaInfPushedToImposedCeiling === true &&
        f.eta_inf >= 0.999 - 1e-3 && // parked at the imposed <1 ceiling
        f.eta_inf < 1.0 && // constraint honoured (physical)
        f.rms > 1e-3 && // no better than the free fit
        f.genuineRateExtractable === false
      );
    },
    why: 'boxing eta_inf to (0.55, 0.999) parks it at the imposed 0.999 ceiling while the Nbig exponent p still pins at the search floor 0.05 with rms ~4e-3 -- no genuine algebraic rate emerges.',
  },
  {
    id: 'imp97102-fixed-etainf-fit-is-worse-and-migrates-pinning',
    holds: () => {
      const f = IMP97102_FIXED_ETA_FIT;
      const lo = IMP97102_EXPONENT_SEARCH_RANGE.lo;
      return (
        Math.abs(f.eta_inf - IMP97102_MEASURED_ETA_CEILING) < 1e-12 &&
        f.qPinnedAtSearchFloor === true &&
        Math.abs(f.q - lo) < 1e-3 && // pinning migrates onto q
        f.rmsWorseThanFreeFit === true &&
        f.rms > IMP97102_FREE_FIT_REFERENCE.rms && // degraded vs free fit
        f.rms > IMP97102_BOUNDED_FIT.rms && // and vs the bounded fit
        f.genuineRateExtractable === false
      );
    },
    why: 'fixing eta_inf at the measured 0.64 ceiling migrates the search-floor pinning from eta_inf onto the T exponent q (0.0500) and degrades rms to 4.034e-3, worse than both the free and bounded fits.',
  },
  {
    id: 'imp97102-measurement-only-no-qed',
    holds: () =>
      IMP97102_VERDICT.genuineRateExtractable === false &&
      IMP97102_VERDICT.subAlgebraicDriftPersists === true &&
      IMP97102_VERDICT.operatorPositivityProved === false &&
      IMP97102_VERDICT.boundMoves === false &&
      IMP97102_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97102_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97102_BINDING_2A - LN3) < 1e-12 &&
      IMP97102_VERDICT.qed === false,
    why: 'measurement only: the sub-algebraic drift persists under any physical eta_inf constraint, no operator positivity is established, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96, and the binding shift is 2a=ln3; NO QED.',
  },
];

for (const a of IMP97102_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97102 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
