/**
 * @fileoverview imp-96927 -- SCOUT (numerical): measure the JOINT (Nbig,T) DIAGONAL double-
 * extrapolation of the imp-96911 shift-invert top-Ritz eta of R_N = P_N (K+m)^{-1} P_N at 2a=ln3.
 * imp-96911 found eta RISES with the evaluation space Nbig at fixed T but FALLS with T at fixed Nbig
 * (eta @Nbig=240 = 0.677688/0.661893/0.641151 at T=800/1600/3200), so neither truncation is
 * converged and the Ritz floor lam1 = 1/eta - m swings ~0.13 over the Nbig ladder. Because the two
 * drifts push in OPPOSITE directions, a matched diagonal path Nbig = round(c*T) might cancel them.
 * Driver tmp/imp-96927-diagonal-nt-scout.py, /tmp/rhvenv scipy 1.18, reuses the imp-96911/imp-96768
 * pole-free Gegenbauer build verbatim (sigma_2=(t^2+1/4)^2 w_1, m=3 trial space, shift m=1, N=20).
 * Measurement only; the Ritz value is an UPPER bound so this floor is an upper estimate NOT a
 * certified lower bound. NO QED.
 *
 * SETUP. eta is the top eigenvalue of the compression R_N = R[:N,:N] of the bounded resolvent
 * R=(K+m)^{-1} built inside a nested Nbig-dim evaluation space at integration cutoff T; the floor
 * lam1_ritz = 1/eta - m is an upper estimate on lambda_1(T_a[sigma_2]). We walk diagonal paths
 * Nbig = round(c*T) for slopes c in {0.08,0.12,0.16,0.20} along T in {300,600,1200,2400}, seeking a
 * slope c* on which eta is stationary in T (the two truncations cancel), then Richardson/Aitken-
 * extrapolate floor(T) -> T->inf along c*.
 *
 * FINDING 1 -- THE TWO DRIFTS CONFIRM OPPOSITE SIGNS ON A GRID. On the eta(Nbig,T) grid eta rises
 * monotonically DOWN each column (Nbig 96->160->240 at fixed T) and falls monotonically ACROSS each
 * row (T 400->800->1600->3200 at fixed Nbig): e.g. at Nbig=240, eta = 0.683313/0.677688/0.661893/
 * 0.641151 across T=400..3200; at T=3200, eta = 0.633166/0.635955/0.641151 across Nbig=96/160/240.
 * The signs are genuinely opposed, so a diagonal cancellation is plausible.
 *
 * FINDING 2 -- A MATCHED DIAGONAL EXISTS AND CUTS THE eta DRIFT ~7x, BUT IT IS ONLY LOCAL IN T. The
 * eta drift across the diagonal (max-min over T=300..2400) is U-shaped in the slope c: 0.014714
 * (c=0.08) -> 0.009076 (c=0.12) -> 0.005262 (c=0.16, MINIMUM) -> 0.012146 (c=0.20). The matched
 * slope c*=0.16 cuts the drift ~7x versus the raw fixed-Nbig=240 T-drift (0.0365 over T=800..3200).
 * BUT along c*=0.16 eta is NON-MONOTONE: 0.659047/0.662486/0.664309/0.660214 -- it rises through
 * T=1200 then REVERSES at T=2400. The reversal shows the balancing slope itself DRIFTS DOWN with T
 * (at T=2400 the still-rising c=0.12 and the already-falling c=0.20 bracket the balance between
 * 0.12 and 0.16), so no single fixed slope stays matched as T grows.
 *
 * FINDING 3 -- THE DIAGONAL DOES NOT STABILIZE lam1_ritz; THE DOUBLE-EXTRAPOLATION DOES NOT CONVERGE
 * CLEANLY. Along c*=0.16 the floor lam1 = 1/eta - m is 0.517342/0.509467/0.505324/0.514660 across
 * T=300..2400 -- it DIPS then reverses UP, a drift of 0.012018 that exceeds the 1e-2 stabilization
 * tolerance. A non-monotone sequence has no reliable Richardson/Aitken limit (the Aitken tail reads
 * 0.508193, but the reversal makes it untrustworthy). The best diagonal narrows the wall but does
 * not remove it.
 *
 * VERDICT. The matched-diagonal cancellation is REAL but INCOMPLETE: slope c*=0.16 cuts the eta drift
 * ~7x, yet (a) the balancing slope drifts down with T so no fixed c stays matched, (b) the floor
 * along c* is non-monotone (dip-then-reverse) with residual drift ~0.012 > 1e-2, and (c) the double-
 * extrapolation therefore does not converge to a stable lam1_ritz. The coupled (Nbig,T) resolvent-
 * truncation wall PERSISTS under a fixed-slope diagonal; it would need a T-adaptive slope schedule,
 * not a constant c -- confirming and sharpening imp-96911 IMP96911_ETA_DRIFT_IS_COUPLED_NT_NOT_A_
 * STANDALONE_NBIG_RATE. SUB-GAP IMP96927_DIAGONAL_CANCELLATION_IS_LOCAL_NOT_A_FIXED_SLOPE.
 * Ritz value is an UPPER bound (this floor is an upper estimate, not a certified LB); interval-
 * rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (the coupled (N,T) eta drift this leaf tries to cancel diagonally)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open t-truncation (N,T) rate the floor couples to)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96927_RIGOROUS_REACH_2A = 0.96;
export const IMP96927_SHIFT_M = 1.0;
export const IMP96927_TRIAL_N = 20;
export const IMP96927_STAB_TOL = 1e-2;

// FINDING 1: eta(Nbig,T) grid -- eta rises DOWN columns (Nbig up) and falls ACROSS rows (T up).
export const IMP96927_ETA_GRID = Object.freeze([
  Object.freeze({ Nbig: 96, eta_T400: 0.678572, eta_T800: 0.650189, eta_T1600: 0.636076, eta_T3200: 0.633166 }),
  Object.freeze({ Nbig: 160, eta_T400: 0.681677, eta_T800: 0.673668, eta_T1600: 0.646441, eta_T3200: 0.635955 }),
  Object.freeze({ Nbig: 240, eta_T400: 0.683313, eta_T800: 0.677688, eta_T1600: 0.661893, eta_T3200: 0.641151 }),
]);

// FINDING 2: diagonal walks Nbig=round(c*T) along T={300,600,1200,2400}. eta drift is U-shaped in c,
// minimized at c*=0.16. floor = 1/eta - m.
export const IMP96927_DIAGONALS = Object.freeze([
  Object.freeze({ slope: 0.08, Nbig: [24, 48, 96, 192], etas: [0.627128, 0.635771, 0.639728, 0.641842], floors: [0.594571, 0.572892, 0.563163, 0.558016], eta_span: 0.014714, floor_span: 0.036555 }),
  Object.freeze({ slope: 0.12, Nbig: [36, 72, 144, 288], etas: [0.644271, 0.648631, 0.651719, 0.653347], floors: [0.552143, 0.541710, 0.534404, 0.530581], eta_span: 0.009076, floor_span: 0.021561 }),
  Object.freeze({ slope: 0.16, Nbig: [48, 96, 192, 384], etas: [0.659047, 0.662486, 0.664309, 0.660214], floors: [0.517342, 0.509467, 0.505324, 0.514660], eta_span: 0.005262, floor_span: 0.012018 }),
  Object.freeze({ slope: 0.20, Nbig: [60, 120, 240, 480], etas: [0.672669, 0.673301, 0.671875, 0.661155], floors: [0.486614, 0.485220, 0.488373, 0.512506], eta_span: 0.012146, floor_span: 0.027286 }),
]);
export const IMP96927_T_LADDER = Object.freeze([300, 600, 1200, 2400]);

// the matched diagonal (smallest eta drift) and its (unreliable, non-monotone) Aitken extrapolation
export const IMP96927_MATCHED = Object.freeze({
  slope: 0.16,
  eta_span: 0.005262,
  floor_span: 0.012018,     // > STAB_TOL 1e-2 => does not stabilize
  floors_nonmonotone: true, // 0.517342 -> 0.509467 -> 0.505324 -> 0.514660 (dip then reverse)
  floor_aitken_inf: 0.508193, // untrustworthy on a non-monotone sequence
  etaDriftCutVsRawTdrift: 0.0365 / 0.005262, // ~6.9x cut vs the raw fixed-Nbig=240 T-drift
});

export const IMP96927_VERDICT = Object.freeze({
  ticket: 'imp-96927',
  question: 'does a matched diagonal path Nbig=round(c*T) cancel the opposing (Nbig,T) drifts and let a Richardson double-extrapolation stabilize lam1_ritz at 2a=ln3, or does the coupled wall persist?',
  shift_m: 1.0,
  trial_N: 20,
  // Finding 1: opposing signs confirmed on a grid
  etaRisesWithNbigFallsWithT: true,
  // Finding 2: a matched diagonal exists but is only local in T
  matchedSlopeExists: true,           // c*=0.16 minimizes the eta drift (U-shaped in c)
  matchedSlopeCutsEtaDrift: true,     // ~7x vs the raw fixed-Nbig T-drift
  balancingSlopeIsFixed: false,       // the slope drifts down with T (non-monotone eta along c*)
  // Finding 3: the floor does not stabilize; the double-extrapolation does not converge cleanly
  matchedFloorSpan: 0.012018,         // > STAB_TOL
  floorStabilizes: false,
  doubleExtrapolationConverges: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96927_DIAGONAL_CANCELLATION_IS_LOCAL_NOT_A_FIXED_SLOPE -- the imp-96911 opposing (Nbig,T) drifts of the shift-invert top-Ritz eta at 2a=ln3 DO admit a matched diagonal Nbig=round(c*T): the eta drift across T=300..2400 is U-shaped in the slope c and minimized at c*=0.16 (drift 0.005262, a ~7x cut versus the raw fixed-Nbig=240 T-drift 0.0365 over T=800..3200). BUT the cancellation is only LOCAL in T: along c*=0.16 eta is non-monotone (0.659047/0.662486/0.664309/0.660214, rising then reversing at T=2400), so the balancing slope itself drifts down with T and no fixed c stays matched. Consequently the Ritz floor lam1=1/eta-m along c*=0.16 (0.517342/0.509467/0.505324/0.514660) DIPS then reverses UP with residual drift 0.012018 > 1e-2 and has no reliable Richardson/Aitken limit -- the double-extrapolation does not converge to a stable lam1_ritz. A fixed-slope diagonal narrows the coupled (Nbig,T) resolvent-truncation wall ~7x but does not remove it; a T-adaptive slope schedule would be required. Ritz value is an UPPER bound so the floor is an upper estimate, not a certified LB; interval-rigorous reach stays 2a<=0.96; RH open; NO QED',
  qed: false,
});
export default IMP96927_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96927_ASSERTIONS = [
  {
    id: 'imp96927-grid-opposing-signs',
    holds: () => {
      const g = IMP96927_ETA_GRID;
      // eta rises DOWN columns (Nbig up) at each fixed T
      let colUp = true;
      for (let i = 1; i < g.length; i++) {
        if (!(g[i].eta_T400 > g[i - 1].eta_T400 && g[i].eta_T800 > g[i - 1].eta_T800 &&
              g[i].eta_T1600 > g[i - 1].eta_T1600 && g[i].eta_T3200 > g[i - 1].eta_T3200)) colUp = false;
      }
      // eta falls ACROSS rows (T up) at each fixed Nbig
      const rowDown = g.every((r) => r.eta_T400 > r.eta_T800 && r.eta_T800 > r.eta_T1600 && r.eta_T1600 > r.eta_T3200);
      return colUp && rowDown && IMP96927_VERDICT.etaRisesWithNbigFallsWithT === true;
    },
    why: 'the eta(Nbig,T) grid rises down columns (Nbig up) and falls across rows (T up), confirming the two truncations push in opposite directions.',
  },
  {
    id: 'imp96927-matched-diagonal-minimizes-eta-drift',
    holds: () => {
      const d = IMP96927_DIAGONALS;
      // the eta drift is U-shaped in c with its minimum at c=0.16
      const minRow = d.reduce((a, b) => (b.eta_span < a.eta_span ? b : a));
      // internal consistency: floor == 1/eta - m for every point
      const consistent = d.every((row) => row.etas.every((e, k) => Math.abs(row.floors[k] - (1.0 / e - IMP96927_SHIFT_M)) < 1e-5));
      return minRow.slope === 0.16 && consistent &&
        minRow.eta_span < 0.006 &&                       // matched drift ~0.0053
        IMP96927_MATCHED.etaDriftCutVsRawTdrift > 5 &&    // ~7x cut vs raw T-drift
        IMP96927_VERDICT.matchedSlopeExists === true;
    },
    why: 'the diagonal eta drift is U-shaped in the slope c and minimized at c*=0.16 (drift ~0.0053, a ~7x cut versus the raw fixed-Nbig T-drift), so a matched diagonal exists.',
  },
  {
    id: 'imp96927-matched-floor-nonmonotone-and-unstable',
    holds: () => {
      const m = IMP96927_DIAGONALS.find((r) => r.slope === 0.16);
      // the floor along c* DIPS then reverses UP (non-monotone): fl[2] < fl[1] < fl[0] but fl[3] > fl[2]
      const dips = m.floors[1] < m.floors[0] && m.floors[2] < m.floors[1];
      const reverses = m.floors[3] > m.floors[2];
      return dips && reverses &&
        m.floor_span > IMP96927_STAB_TOL &&               // residual drift exceeds tolerance
        IMP96927_MATCHED.floors_nonmonotone === true &&
        IMP96927_VERDICT.balancingSlopeIsFixed === false;
    },
    why: 'along the matched diagonal c*=0.16 the floor dips then reverses up (non-monotone) with drift 0.012 > 1e-2, so the balancing slope drifts with T and no fixed slope stays matched.',
  },
  {
    id: 'imp96927-double-extrapolation-does-not-converge-and-no-qed',
    holds: () =>
      IMP96927_VERDICT.floorStabilizes === false &&
      IMP96927_VERDICT.doubleExtrapolationConverges === false &&
      IMP96927_VERDICT.operatorPositivityProved === false &&
      IMP96927_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96927_RIGOROUS_REACH_2A === 0.96 &&
      IMP96927_VERDICT.qed === false,
    why: 'the fixed-slope diagonal does not stabilize lam1_ritz, so the double-extrapolation does not converge; no operator positivity is established and the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96927_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96927 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
