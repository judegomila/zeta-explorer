/**
 * @module imp-97058-krein-coupled-nt-surface-fit-no-rate
 * @fileoverview imp-97058 -- MEASUREMENT (numerical): does a JOINT two-parameter (Nbig,T) surface
 *   fit extract a genuine algebraic convergence rate for the imp-96911 Ritz eta drift toward the
 *   2a=ln3 Krein floor, where the single-parameter power law failed? imp-96911 found the shift-
 *   invert Ritz eta drift is NOT an N effect (eta N-independent for N>=12) but a coupled (Nbig,T)
 *   effect with NO algebraic rate extractable (single-power fit eta=eta_inf-c*Nbig^-p at fixed
 *   T=800 pins the exponent at the search floor p=0.300, rms 5.47e-3, runaway eta_inf). This leaf
 *   fits the two truncations TOGETHER on the combined dataset. Driver
 *   tmp/imp-97058-coupled-nt-surface-fit.py, /tmp/rhvenv scipy 1.18.
 *
 *   Measurement only. The Ritz value is an UPPER bound on lambda_1(T), so eta_inf / the floor is
 *   an upper estimate, NOT a certified lower bound. The imp-96969 cohort was closed as a lever;
 *   this measures only. No bound moves; interval-rigorous reach stays 2a<=0.96; RH open;
 *   no refereed bound is changed; NO QED.
 *
 * DATA. Reused verbatim from imp-96911-krein-eta-nconvergence-scout.js: the full Nbig=24..240
 *   ladder at T=800 (eta N-independent for N>=12) plus the T-sensitivity rungs at Nbig in
 *   {120,200,240}, T in {800,1600,3200}. 19 distinct (Nbig,T) points.
 *
 * MODEL. eta rises with Nbig (toward a fixed-T ceiling from below) and FALLS with T. The additive-
 *   bias surface separating the two truncations is
 *     eta(Nbig,T) = eta_inf - a*Nbig^(-p) + c*T^(-q),   a,c,p,q > 0,
 *   so the Nbig bias (-a*Nbig^-p) vanishes from below as Nbig->inf and the T bias (+c*T^-q)
 *   vanishes from above as T->inf; eta_inf is the joint Nbig->inf, T->inf limit. A GENUINE coupled
 *   rate would show well-determined (p,q) NOT pinned at the search bounds, small rms, and a
 *   non-runaway eta_inf. Search exponents in [0.05, 4.0] (WIDER than imp-96911's 0.300 floor).
 *
 * FINDING 1 -- THE JOINT SURFACE FIT STILL DOES NOT EXTRACT A GENUINE RATE. The best 4000-restart
 *   fit gives eta_inf=1.0811, a=0.6396, p=0.0500 (PINNED at the search FLOOR), c=0.8761, q=0.3542,
 *   rms 3.98e-3. The Nbig exponent p pins at the lower bound and eta_inf runs away to 1.081 --
 *   unphysical, since eta is a resolvent eigenvalue with eta<1 measured ~0.64. Widening the search
 *   floor below imp-96911's 0.300 lets p run even lower (to 0.05), CONFIRMING the Nbig drift is
 *   sub-algebraic: the single-power exponent was pinned by the search floor, not determined by the
 *   data. rms stays ~4e-3, no better than the one-parameter fit.
 *
 * FINDING 2 -- THE T-DIRECTION RATE IS NOT STABLE ACROSS Nbig EITHER. The joint q=0.3542 is not
 *   pinned, but it is a compromise artifact: exactly-determined per-row power fits eta=eta_lim+
 *   c*T^-q (3 T points, 3 params) give WILDLY inconsistent T-exponents q=1.936 (Nbig=120),
 *   q=0.559 (Nbig=200), q=0.0002 (Nbig=240) with eta_lim=0.632, 0.605, -174.1 respectively -- one
 *   row runs away to eta_lim=-174. So the T-truncation has no Nbig-stable rate; the coupling
 *   between the two truncations is genuine, not separable into two clean powers.
 *
 * VERDICT. A joint two-parameter (Nbig,T) surface fit does NOT extract a genuine algebraic
 *   convergence rate for the imp-96911 eta drift: the Nbig exponent pins at the search floor, the
 *   joint limit eta_inf runs away to an unphysical >1, the rms stays ~4e-3, and the per-Nbig
 *   T-exponents are inconsistent by four orders of magnitude with a runaway eta_lim. This CONFIRMS
 *   and SHARPENS imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE: the coupled
 *   (N,T) resolvent-truncation rate is not extractable even as a two-parameter surface -- the two
 *   truncations push eta in opposite directions and their coupling admits no clean joint power law.
 *   SUB-GAP IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE. Ritz value is an UPPER bound so
 *   the floor is an upper estimate, not a certified LB; interval-rigorous reach stays 2a<=0.96;
 *   RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (the single-power fit this leaf extends to a joint surface)
 * @see imp-96969-coupled-nt-truncation-wall-cohort-index.js (the closed-lever cohort this measurement sits in)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open direct t-truncation (N,T) rate)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97058_RIGOROUS_REACH_2A = 0.96;
export const IMP97058_BINDING_2A = LN3;
export const IMP97058_N_DATA_POINTS = 19;
export const IMP97058_EXPONENT_SEARCH_RANGE = Object.freeze({ lo: 0.05, hi: 4.0 });

// FINDING 1: best joint surface fit eta(Nbig,T) = eta_inf - a*Nbig^-p + c*T^-q (4000 restarts).
// p PINNED at the search floor, eta_inf runaway (>1, unphysical), rms ~4e-3 -- NO genuine rate.
export const IMP97058_JOINT_SURFACE_FIT = Object.freeze({
  model: 'eta = eta_inf - a*Nbig^-p + c*T^-q',
  eta_inf: 1.081073,
  a: 0.639553,
  p: 0.0500, // Nbig exponent -- PINNED at the search floor 0.05
  c: 0.876117,
  q: 0.3542, // T exponent -- not pinned but a compromise artifact (see Finding 2)
  rms: 3.983e-3,
  pPinnedAtSearchFloor: true,
  etaInfRunaway: true, // eta_inf=1.081 > 1; eta is a resolvent eigenvalue measured ~0.64
  genuineCoupledRateExtractable: false,
});

// FINDING 2: exactly-determined per-Nbig T-direction power fits eta = eta_lim + c*T^-q
// (3 T points, 3 params). q inconsistent by 4 orders of magnitude; one eta_lim runs away.
export const IMP97058_PER_NBIG_T_FIT = Object.freeze([
  Object.freeze({ Nbig: 120, eta_lim: 0.63214, q: 1.9358 }),
  Object.freeze({ Nbig: 200, eta_lim: 0.60504, q: 0.5593 }),
  Object.freeze({ Nbig: 240, eta_lim: -174.13387, q: 0.0002 }), // runaway -- no stable T-rate
]);

export const IMP97058_VERDICT = Object.freeze({
  ticket: 'imp-97058',
  question: 'does a joint two-parameter (Nbig,T) surface fit extract a genuine algebraic convergence rate for the imp-96911 Ritz eta drift toward the 2a=ln3 Krein floor?',
  binding_2a: LN3,
  nDataPoints: 19,
  // Finding 1: the joint surface fit still fails
  jointFitPPinnedAtSearchFloor: true,
  jointFitEtaInfRunaway: true,
  jointFitRms: 3.983e-3,
  genuineCoupledRateExtractable: false,
  // Finding 2: the T-direction rate is not Nbig-stable
  perNbigTexponentSpread: 'q=1.936 / 0.559 / 0.0002 across Nbig=120/200/240 (four orders of magnitude), one eta_lim=-174 runaway',
  tDirectionRateNbigStable: false,
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97058_COUPLED_NT_SURFACE_FIT_YIELDS_NO_GENUINE_RATE -- a joint two-parameter (Nbig,T) additive-bias surface fit eta = eta_inf - a*Nbig^-p + c*T^-q, over the combined imp-96911 dataset (19 distinct (Nbig,T) points: the Nbig=24..240 ladder at T=800 plus the T-sensitivity rungs at Nbig in {120,200,240}, T in {800,1600,3200}), does NOT extract a genuine algebraic convergence rate for the imp-96889/imp-96911 Ritz eta drift at 2a=ln3. The best 4000-restart fit pins the Nbig exponent p at the search floor 0.05 (widening below imp-96911 0.300 lets it run lower still: sub-algebraic), runs eta_inf away to an unphysical 1.081 (eta is a resolvent eigenvalue measured ~0.64), and holds rms ~3.98e-3, no better than the one-parameter fit. The joint T-exponent q=0.354 is a compromise artifact: exactly-determined per-Nbig T-power fits give wildly inconsistent q=1.936/0.559/0.0002 with a runaway eta_lim=-174. This CONFIRMS and SHARPENS imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE: the coupled (N,T) resolvent-truncation rate is not extractable even as a two-parameter surface, the two truncations push eta in opposite directions and their coupling admits no clean joint power law. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB; measurement only, no bound moves',
  qed: false,
});
export default IMP97058_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97058_ASSERTIONS = [
  {
    id: 'imp97058-joint-surface-fit-does-not-yield-a-genuine-rate',
    holds: () => {
      const f = IMP97058_JOINT_SURFACE_FIT;
      const lo = IMP97058_EXPONENT_SEARCH_RANGE.lo;
      return (
        f.pPinnedAtSearchFloor === true &&
        Math.abs(f.p - lo) < 1e-3 && // p sits at the search floor -> not determined by data
        f.etaInfRunaway === true &&
        f.eta_inf > 1.0 && // unphysical for a resolvent eigenvalue eta<1 (measured ~0.64)
        f.rms > 1e-3 && // poor fit, no better than the one-parameter power
        f.genuineCoupledRateExtractable === false &&
        IMP97058_VERDICT.genuineCoupledRateExtractable === false
      );
    },
    why: 'the joint (Nbig,T) surface fit pins the Nbig exponent p at the search floor 0.05, runs eta_inf away to an unphysical 1.081 (eta<1 measured ~0.64), and holds rms ~4e-3 -- no genuine coupled algebraic rate is extractable.',
  },
  {
    id: 'imp97058-t-direction-rate-not-nbig-stable',
    holds: () => {
      const rows = IMP97058_PER_NBIG_T_FIT;
      const qs = rows.map((r) => r.q);
      const qMax = Math.max(...qs), qMin = Math.min(...qs);
      const spread4orders = qMax / qMin > 1e3; // 1.936 / 0.0002 spans four orders of magnitude
      const hasRunawayEtaLim = rows.some((r) => r.eta_lim < 0); // Nbig=240 eta_lim=-174
      return (
        spread4orders &&
        hasRunawayEtaLim &&
        IMP97058_VERDICT.tDirectionRateNbigStable === false
      );
    },
    why: 'exactly-determined per-Nbig T-power fits give T-exponents q spanning four orders of magnitude (1.936 / 0.559 / 0.0002) with a runaway eta_lim=-174, so the T-direction rate is not Nbig-stable and the coupling admits no clean separable power.',
  },
  {
    id: 'imp97058-measurement-only-no-qed',
    holds: () =>
      IMP97058_VERDICT.operatorPositivityProved === false &&
      IMP97058_VERDICT.boundMoves === false &&
      IMP97058_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97058_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97058_BINDING_2A - LN3) < 1e-12 &&
      IMP97058_VERDICT.qed === false,
    why: 'measurement only: no operator positivity is established, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96, and the binding shift is 2a=ln3; NO QED.',
  },
];

for (const a of IMP97058_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97058 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
