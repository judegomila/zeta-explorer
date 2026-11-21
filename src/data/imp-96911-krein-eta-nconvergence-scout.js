/**
 * @fileoverview imp-96911 -- SCOUT (numerical): measure the N-convergence RATE of the imp-96889
 * Finding 3a top Ritz eta of the compressed shift-invert resolvent R_N = P_N (K+m)^{-1} P_N at
 * 2a=ln3, fit the drift toward its Nbig->inf value, and size the out-of-space leakage BIAS it puts
 * into the Ritz floor lam1_ritz = 1/eta - m. imp-96889 Finding 3a reported eta DRIFTS UP with the
 * evaluation space (0.622238 @ Nbig=24 -> 0.660250 @ Nbig=120 at fixed N=20) -- unconverged -- but
 * never fit the drift. Driver tmp/imp-96911-eta-nconv-scout.py, /tmp/rhvenv scipy 1.18.
 * Measurement only; the Ritz value is an UPPER bound on lambda_1(T), so this floor is an upper
 * estimate NOT a certified lower bound. NO QED.
 *
 * SETUP. Reuses the imp-96889/imp-96768 pole-free Gegenbauer Galerkin build (exactly-diagonal L^2
 * Gram B=scaleB*I; operator matrix K = A/scaleB; shift m=1; bounded resolvent R=(K+m)^{-1}). eta is
 * the top eigenvalue of the compression R_N=R[:N,:N] built inside a nested Nbig-dim evaluation space
 * at fixed integration cutoff T=800. Nbig ladder 24..240 at N in {12,16,20}.
 *
 * FINDING 1 -- THE DRIFT IS AN EVALUATION-SPACE (Nbig) EFFECT, NOT AN N EFFECT. eta(Nbig) is
 * IDENTICAL to 7 digits across N=12, 16, 20 at every rung: the top Ritz eigenvector of R_N is fully
 * captured by the first ~12 Gegenbauer modes, so enlarging N does not move eta. The imp-96889
 * "N-drift at fixed N=20" is therefore a Nbig (nesting / out-of-space evaluation) drift; N>=12
 * already saturates the trial. So the leakage bias must be sized in Nbig, not N.
 *
 * FINDING 2 -- eta DOES NOT CONVERGE ALGEBRAICALLY IN Nbig AT FIXED T; THE POWER FIT IS POOR. A
 * grid-search fit eta(Nbig) = eta_inf - c*Nbig^(-p) over Nbig=24..240 (T=800) pins the exponent at
 * the search FLOOR p=0.300 with rms 5.47e-3 and a runaway eta_inf=0.7334 -- i.e. the drift is
 * sub-algebraic / not well modelled by a single power over this range. A model-free Aitken delta^2
 * on the tail gives eta_inf~0.67772, essentially the top measured rung (0.677688 @ Nbig=240),
 * because the ladder appears to FLATTEN at Nbig=200-240 -- but Finding 3 shows that flattening is
 * spurious. Either way NO clean convergence rate is extractable at fixed T.
 *
 * FINDING 3 -- THE APPARENT Nbig=200-240 PLATEAU IS A T=800 TRUNCATION CEILING, NOT AN Nbig LIMIT.
 * Varying T at fixed N=16 reopens the drift: at Nbig=240, eta = 0.677688 (T=800) -> 0.661893
 * (T=1600) -> 0.641151 (T=3200); at Nbig=200, 0.677356 -> 0.654115 -> 0.638343. So eta rises with
 * Nbig at fixed T but FALLS with T at fixed Nbig -- the two truncations push in OPPOSITE directions
 * and neither is converged at the top of its ladder. The fixed-T plateau is the resolution hitting
 * the T=800 integration cutoff, exactly the imp-96889 Finding 3b / imp-96827 T-ladder behaviour.
 *
 * FINDING 4 -- THE INDUCED FLOOR BIAS IS LARGE AND CANNOT BE FROZEN BY Nbig ALONE. The Ritz floor
 * lam1_ritz = 1/eta - m drifts DOWN 0.607102 (Nbig=24) -> 0.475606 (Nbig=240) at T=800 -- a
 * ~0.1315 swing over the ladder -- and the projected Nbig needed for the floor to settle within
 * 1e-3 / 1e-4 of any fixed-T limit is UNREACHABLE (the power fit gives none within Nbig<=2e5, and
 * the fixed-T limit is itself a T-artifact per Finding 3). So the out-of-space leakage bias is
 * INSEPARABLE from the T-truncation: it is exactly the coupled (N,T) resolvent-truncation wall of
 * imp-96889/imp-96827, and no finite Nbig at fixed T stops the floor moving.
 *
 * VERDICT. The imp-96889 Finding 3a eta drift is (a) purely an evaluation-space Nbig effect (eta is
 * N-independent for N>=12), (b) not convergent under a single power law over Nbig=24..240 at fixed
 * T=800 (fit pins p at the search floor, rms 5e-3), and (c) its apparent Nbig-plateau at ~0.678 is a
 * T=800 truncation ceiling that a larger T reopens. The leakage bias it puts into the Ritz floor is
 * ~0.13 over the ladder and cannot be sized as a standalone Nbig rate: Nbig and T are coupled and
 * push the floor in opposite directions, so the bias is exactly the open (N,T) wall -- this CONFIRMS
 * and SHARPENS imp-96889 SUB-GAP IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE rather than resolving it
 * into a clean rate. SUB-GAP IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE.
 * Ritz value is an UPPER bound (this floor is an upper estimate, not a certified LB); interval-
 * rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (Finding 3a eta drift measured at two Nbig points; this leaf fits it)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open t-truncation (N,T) rate the floor here couples to)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96911_RIGOROUS_REACH_2A = 0.96;
export const IMP96911_SHIFT_M = 1.0;
export const IMP96911_T_CUTOFF = 800.0;

// FINDING 1+2: eta(Nbig) at T=800 -- IDENTICAL across N=12,16,20 (N-independent for N>=12), so the
// imp-96889 "N-drift" is a Nbig evaluation-space drift. floor = 1/eta - m drifts DOWN with Nbig.
export const IMP96911_ETA_NBIG_T800 = Object.freeze([
  Object.freeze({ Nbig: 24, eta: 0.6222380, floor: 0.6071020 }),
  Object.freeze({ Nbig: 28, eta: 0.6257271, floor: 0.5981408 }),
  Object.freeze({ Nbig: 32, eta: 0.6279391, floor: 0.5925111 }),
  Object.freeze({ Nbig: 40, eta: 0.6306628, floor: 0.5856334 }),
  Object.freeze({ Nbig: 48, eta: 0.6327793, floor: 0.5803298 }),
  Object.freeze({ Nbig: 56, eta: 0.6354313, floor: 0.5737343 }),
  Object.freeze({ Nbig: 64, eta: 0.6379345, floor: 0.5675591 }),
  Object.freeze({ Nbig: 80, eta: 0.6438065, floor: 0.5532618 }),
  Object.freeze({ Nbig: 96, eta: 0.6501889, floor: 0.5380147 }),
  Object.freeze({ Nbig: 120, eta: 0.6602504, floor: 0.5145769 }),
  Object.freeze({ Nbig: 160, eta: 0.6736681, floor: 0.4844106 }),
  Object.freeze({ Nbig: 200, eta: 0.6773559, floor: 0.4763288 }),
  Object.freeze({ Nbig: 240, eta: 0.6776879, floor: 0.4756055 }),
]);

// FINDING 2: single-power fit eta = eta_inf - c*Nbig^-p over Nbig=24..240 at T=800 -- POOR: exponent
// pinned at the search floor, rms ~5e-3, runaway eta_inf. Aitken tail gives ~top rung (spurious, see F3).
export const IMP96911_POWER_FIT_T800 = Object.freeze({
  eta_inf: 0.7333834, p: 0.300, c: 0.30659, rms: 5.47e-3, pExponentPinnedAtSearchFloor: true,
  aitken_eta_inf: 0.6777208,
});

// FINDING 3: the Nbig=200-240 plateau is a T=800 ceiling -- raising T at fixed N=16 reopens the drift.
export const IMP96911_T_SENSITIVITY = Object.freeze([
  Object.freeze({ Nbig: 120, eta_T800: 0.660250, eta_T1600: 0.639490, eta_T3200: 0.634064 }),
  Object.freeze({ Nbig: 200, eta_T800: 0.677356, eta_T1600: 0.654115, eta_T3200: 0.638343 }),
  Object.freeze({ Nbig: 240, eta_T800: 0.677688, eta_T1600: 0.661893, eta_T3200: 0.641151 }),
]);

export const IMP96911_VERDICT = Object.freeze({
  ticket: 'imp-96911',
  question: 'what is the N-convergence rate of the imp-96889 top Ritz eta, and how large a bias does the out-of-space leakage put into the Ritz floor lam1 = 1/eta - m ?',
  shift_m: 1.0,
  T_cutoff: 800.0,
  // Finding 1: the drift is a Nbig evaluation-space effect, not an N effect
  etaIsNindependentForNge12: true,   // eta identical to 7 digits across N=12,16,20
  driftIsEvaluationSpaceNbig: true,
  // Finding 2: no clean algebraic convergence in Nbig at fixed T
  singlePowerFitPoor: true,          // p pinned at search floor 0.300, rms 5.47e-3
  cleanConvergenceRateExtractable: false,
  // Finding 3: the apparent plateau is a T-truncation ceiling
  nbigPlateauIsTceiling: true,       // eta @Nbig=240 falls 0.6777 -> 0.6412 as T 800 -> 3200
  etaRisesWithNbigFallsWithT: true,  // the two truncations push in opposite directions
  // Finding 4: the floor bias cannot be frozen by Nbig alone
  floorBiasOverLadder: 0.1314965,    // 0.6071020 (Nbig=24) -> 0.4756055 (Nbig=240) at T=800
  nbigToFreezeFloorAtFixedT: null,   // unreachable within Nbig<=2e5 (and the fixed-T limit is a T-artifact)
  leakageBiasSeparableFromT: false,  // inseparable: the coupled (N,T) wall
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_STANDALONE_NBIG_RATE -- the imp-96889 Finding 3a top-Ritz eta drift of the compressed shift-invert resolvent at 2a=ln3 is (a) a pure evaluation-space Nbig effect (eta N-independent to 7 digits for N>=12, so N>=12 saturates the trial), (b) NOT convergent under a single power law eta_inf - c*Nbig^-p over Nbig=24..240 at fixed T=800 (fit pins p at the search floor 0.300, rms 5.47e-3, runaway eta_inf), and (c) its apparent Nbig=200-240 plateau at ~0.678 is a T=800 integration-cutoff ceiling that a larger T reopens (eta @Nbig=240 falls 0.6777 -> 0.6619 -> 0.6412 as T 800 -> 1600 -> 3200). The induced Ritz-floor bias lam1=1/eta-m swings ~0.131 over the Nbig ladder and cannot be frozen by Nbig alone: Nbig raises eta / lowers the floor while T lowers eta / raises the floor, so the out-of-space leakage bias is INSEPARABLE from the T-truncation and is exactly the open coupled (N,T) resolvent-truncation wall -- confirming and sharpening imp-96889 IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE rather than yielding a standalone Nbig rate. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB',
  qed: false,
});
export default IMP96911_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96911_ASSERTIONS = [
  {
    id: 'imp96911-eta-drifts-up-and-floor-drifts-down-with-nbig',
    holds: () => {
      const g = IMP96911_ETA_NBIG_T800;
      let etaMono = true, floorMono = true;
      for (let i = 1; i < g.length; i++) {
        if (!(g[i].eta > g[i - 1].eta)) etaMono = false;
        if (!(g[i].floor < g[i - 1].floor)) floorMono = false;
      }
      // each row is internally consistent: floor == 1/eta - m
      const consistent = g.every((r) => Math.abs(r.floor - (1.0 / r.eta - IMP96911_SHIFT_M)) < 1e-6);
      return etaMono && floorMono && consistent &&
        (g[0].floor - g[g.length - 1].floor) > 0.13; // ~0.131 swing over the ladder
    },
    why: 'at T=800 the top Ritz eta rises monotonically with Nbig (24..240) so the Ritz floor 1/eta-m falls monotonically, a ~0.131 swing -- the out-of-space leakage bias is large.',
  },
  {
    id: 'imp96911-single-power-fit-is-poor',
    holds: () =>
      IMP96911_POWER_FIT_T800.pExponentPinnedAtSearchFloor === true &&
      IMP96911_POWER_FIT_T800.rms > 1e-3 &&           // poor fit: rms ~5e-3
      IMP96911_POWER_FIT_T800.p <= 0.301 &&            // pinned at the search floor 0.300
      IMP96911_VERDICT.singlePowerFitPoor === true &&
      IMP96911_VERDICT.cleanConvergenceRateExtractable === false,
    why: 'the single-power fit eta = eta_inf - c*Nbig^-p pins the exponent at the search floor 0.300 with rms ~5e-3, so no clean algebraic Nbig convergence rate is extractable at fixed T=800.',
  },
  {
    id: 'imp96911-nbig-plateau-is-a-T-ceiling',
    holds: () => {
      const g = IMP96911_T_SENSITIVITY;
      // at each Nbig eta FALLS as T grows (the plateau is a T-truncation ceiling, not an Nbig limit)
      const fallsWithT = g.every((r) => r.eta_T800 > r.eta_T1600 && r.eta_T1600 > r.eta_T3200);
      // and the top-Nbig T=800 value drops materially by T=3200 (>0.03), reopening the drift
      const reopens = (g[2].eta_T800 - g[2].eta_T3200) > 0.03;
      return fallsWithT && reopens &&
        IMP96911_VERDICT.nbigPlateauIsTceiling === true &&
        IMP96911_VERDICT.leakageBiasSeparableFromT === false;
    },
    why: 'at fixed Nbig the eta falls as T grows (0.677688 -> 0.641151 at Nbig=240 over T=800..3200), so the apparent Nbig=200-240 plateau is a T=800 ceiling the larger T reopens: the leakage bias is coupled to T, not a standalone Nbig rate.',
  },
  {
    id: 'imp96911-eta-N-independent-and-no-qed',
    holds: () =>
      IMP96911_VERDICT.etaIsNindependentForNge12 === true &&
      IMP96911_VERDICT.driftIsEvaluationSpaceNbig === true &&
      IMP96911_VERDICT.operatorPositivityProved === false &&
      IMP96911_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96911_RIGOROUS_REACH_2A === 0.96 &&
      IMP96911_VERDICT.qed === false,
    why: 'the eta drift is a pure Nbig evaluation-space effect (N-independent for N>=12); no operator positivity is established and the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96911_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96911 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
