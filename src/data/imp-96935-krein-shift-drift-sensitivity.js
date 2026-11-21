/**
 * @fileoverview imp-96935 -- SCOUT (numerical): measure the SHIFT-m sensitivity of the imp-96911
 * bounded-resolvent Ritz floor DRIFT at 2a=ln3. imp-96911 fixed the shift m=1 and found the top
 * Ritz eta of the compressed resolvent R_N = P_N (K+m)^{-1} P_N drifts UP with the evaluation space
 * Nbig (0.6222 at Nbig=24 -> 0.6777 at Nbig=240, T=800), so the Ritz floor lam1_ritz = 1/eta - m
 * drifts DOWN ~0.131 -- the open coupled (N,T) truncation wall (imp-96904 flagged the bounded
 * resolvent as the only live Route C-direct path to a positive lam1). imp-96910 swept m only at a
 * single (N,Nbig,T) checking the Kato-Temple margin. HERE the sweep runs m ACROSS the whole Nbig
 * ladder to decide whether a larger shift COMPRESSES the drift (floor stabilizes) or whether the
 * (N,T) wall is SHIFT-INVARIANT. Driver tmp/imp-96935-shift-drift-sensitivity.py, /tmp/rhvenv scipy
 * 1.18. Reuses the imp-96911/imp-96889/imp-96768 pole-free Gegenbauer Galerkin build (exactly-
 * diagonal L^2 Gram; operator matrix K = A/scaleB). Ritz value is an UPPER bound so this floor is an
 * upper estimate, NOT a certified lower bound. Measurement only. NO QED.
 *
 * SETUP. Fixed N=16 (imp-96911 Finding 1: eta is N-independent to 7 digits for N>=12), T=800,
 * Nbig ladder 24..240; shift sweep m in {0.25,0.5,1,2,4,8,16,32} (K is positive so R is bounded for
 * every m>0). K is prebuilt once per Nbig; the shift is a cheap re-inversion.
 *
 * FINDING 1 -- THE FLOOR IS SHIFT-INVARIANT AT EACH Nbig RUNG. At every rung the recovered floor
 * lam1_ritz = 1/eta - m is the SAME across the whole m sweep to ~3-4 digits (Nbig=24: 0.6071020 for
 * every m in {0.25..32}). This is structural: eta(m) ~ 1/(m + mu) where mu is the Ritz estimate of
 * lam_min(K) inside the big space, so 1/eta - m recovers mu independently of the shift. The shift
 * relabels eta, it does not change the eigenvalue it encodes.
 *
 * FINDING 2 -- A LARGER SHIFT COMPRESSES THE eta DRIFT BUT THAT IS A SCALE ILLUSION, NOT
 * CONDITIONING. The raw eta drift over the ladder collapses with m -- 0.2124 (m=0.25) -> 0.0554
 * (m=1) -> 0.00637 (m=4) -> 0.000122 (m=32) -- because the eta scale itself shrinks like ~1/m
 * (eta ~ 1/(m+mu)). Reading "smaller eta drift" as "better-conditioned floor" is a mistake: the
 * 1/eta map amplifies the compressed eta drift back to the same floor swing (Finding 3).
 *
 * FINDING 3 -- THE FLOOR DRIFT IS SHIFT-INVARIANT: THE (N,T) WALL DOES NOT CARE ABOUT m. The floor
 * drift floor(Nbig=24) - floor(Nbig=240) is 0.13201 (m=0.25) -> 0.13150 (m=1) -> 0.12932 (m=32): a
 * relative spread of only 2.06% over a 128x change in the shift, log-log slope d(log|drift|)/d(log m)
 * = -0.0042 ~ 0. The tiny 2% decrease at large m runs the WRONG way for stabilization -- it comes
 * from the top-rung floor drifting UP with m (Nbig=240: 0.4750903 at m=0.25 -> 0.4777803 at m=32),
 * i.e. precision LOSS in the near-singular high-Nbig inversion at large shift, not convergence.
 *
 * FINDING 4 -- THE T-ARM IS ALSO SHIFT-INVARIANT. Raising T 800 -> 1600 at Nbig=240 lifts the floor
 * essentially identically for m=1 (0.475605 -> 0.510817) and m=8 (0.476738 -> 0.510820) -- the two
 * agree to 4 digits at T=1600. The opposite-direction (N,T) push documented in imp-96911 is
 * reproduced at both shifts, so the shift buys no separation of the Nbig and T truncations.
 *
 * VERDICT. Varying the shift m over {0.25..32} at 2a=ln3 does NOT stabilize the bounded-resolvent
 * Ritz floor: the floor value at each Nbig rung is shift-invariant (eta ~ 1/(m+mu) so 1/eta-m
 * recovers mu), the raw eta drift compresses only because the eta scale shrinks ~1/m (a scale
 * illusion), and the actual floor drift over the ladder stays ~0.13 with a 2% spread and a ~0 slope
 * in log m -- and the 2% it does move goes the wrong way (large-m precision loss at high Nbig). The
 * T-arm reopens the drift identically at m=1 and m=8. The coupled (N,T) resolvent-truncation wall is
 * therefore SHIFT-INVARIANT: a well-conditioned resolvent is NOT reachable by shift alone -- this
 * closes the shift lever left open by imp-96911 (m=1 fixed) and confirms the wall is the (N,T)
 * truncation of imp-96889/imp-96827, not a conditioning artifact removable by m. Ritz value is an
 * UPPER bound (floor is an upper estimate, not a certified LB); interval-rigorous certificate reach
 * stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 * SUB-GAP IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (fixed m=1; measured the Nbig/T floor drift this leaf sweeps m across)
 * @see imp-96910-krein-shiftinvert-shift-sweep.js (swept m at a single N,Nbig,T for the Kato-Temple margin; this leaf sweeps m across the Nbig ladder)
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (the bounded shift-invert reformulation and the open (N,T) rate)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96935_RIGOROUS_REACH_2A = 0.96;
export const IMP96935_N_TRIAL = 16;   // eta N-independent for N>=12 (imp-96911 Finding 1)
export const IMP96935_T_CUTOFF = 800.0;

// FINDING 1+3: per-shift floor drift over the Nbig=24..240 ladder at T=800. floor_top = floor(Nbig=24),
// floor_bot = floor(Nbig=240), drift = floor_top - floor_bot. eta_drift = eta(Nbig=240) - eta(Nbig=24).
// The floor drift is ~0.13 for EVERY m (2% spread); the raw eta drift collapses ~1/m (scale illusion).
export const IMP96935_SHIFT_SWEEP_T800 = Object.freeze([
  Object.freeze({ m: 0.25, floor_top: 0.6071020, floor_bot: 0.4750903, floor_drift: 0.1320117, eta_drift: 0.2124163 }),
  Object.freeze({ m: 0.5,  floor_top: 0.6071020, floor_bot: 0.4753435, floor_drift: 0.1317585, eta_drift: 0.1220207 }),
  Object.freeze({ m: 1.0,  floor_top: 0.6071020, floor_bot: 0.4756055, floor_drift: 0.1314966, eta_drift: 0.0554499 }),
  Object.freeze({ m: 2.0,  floor_top: 0.6071020, floor_bot: 0.4759114, floor_drift: 0.1311906, eta_drift: 0.0203240 }),
  Object.freeze({ m: 4.0,  floor_top: 0.6071020, floor_bot: 0.4762903, floor_drift: 0.1308117, eta_drift: 0.0063431 }),
  Object.freeze({ m: 8.0,  floor_top: 0.6071020, floor_bot: 0.4767382, floor_drift: 0.1303638, eta_drift: 0.0017868 }),
  Object.freeze({ m: 16.0, floor_top: 0.6071021, floor_bot: 0.4772353, floor_drift: 0.1298667, eta_drift: 0.0004746 }),
  Object.freeze({ m: 32.0, floor_top: 0.6071021, floor_bot: 0.4777803, floor_drift: 0.1293218, eta_drift: 0.0001221 }),
]);

// FINDING 3 summary: the floor drift is shift-invariant across a 128x change in m.
export const IMP96935_DRIFT_SHIFT_TREND = Object.freeze({
  drift_min: 0.1293218, drift_min_m: 32.0,     // large-m precision loss at high Nbig pushes it DOWN slightly
  drift_max: 0.1320117, drift_max_m: 0.25,
  rel_spread: 0.0205572,                        // 2.06% over m in {0.25..32}
  loglog_slope_vs_m: -0.0042124,                // ~0 => shift-invariant wall
});

// FINDING 4: T-arm cross-check at Nbig=240 -- raising T reopens the floor drift IDENTICALLY at m=1 and m=8.
export const IMP96935_T_ARM_CHECK = Object.freeze([
  Object.freeze({ m: 1.0, Nbig: 240, floor_T800: 0.4756055, floor_T1600: 0.5108173 }),
  Object.freeze({ m: 8.0, Nbig: 240, floor_T800: 0.4767382, floor_T1600: 0.5108203 }),
]);

export const IMP96935_VERDICT = Object.freeze({
  ticket: 'imp-96935',
  question: 'does varying the shift m compress the coupled (N,T) drift of the imp-96911 bounded-resolvent Ritz floor at 2a=ln3, or is the wall shift-invariant?',
  a2_binding: LN3,
  N_trial: 16,
  T_cutoff: 800.0,
  shift_sweep: [0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0],
  // Finding 1: the floor at each rung is shift-invariant (eta ~ 1/(m+mu), so 1/eta-m recovers mu)
  floorInvariantAtEachRung: true,
  // Finding 2: the raw eta drift compresses ~1/m -- a scale illusion, not conditioning
  etaDriftCompressesWithM: true,
  etaDriftIsScaleIllusion: true,
  // Finding 3: the floor drift itself is shift-invariant (2% spread, ~0 slope in log m)
  floorDriftRelSpread: 0.0205572,
  floorDriftLoglogSlopeVsM: -0.0042124,
  floorDriftShiftInvariant: true,
  largeMDegradesTopRungFloor: true,   // the 2% it moves runs the WRONG way (precision loss)
  // Finding 4: the T-arm reopens the drift identically at m=1 and m=8
  tArmShiftInvariant: true,
  // conclusions
  largerShiftStabilizesFloor: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT -- sweeping the shift m over {0.25..32} at 2a=ln3 does NOT stabilize the imp-96911 bounded-resolvent Ritz floor. At each Nbig rung the recovered floor lam1_ritz = 1/eta - m is shift-invariant to 3-4 digits (eta ~ 1/(m+mu) so 1/eta-m recovers the underlying Ritz lam_min estimate mu), the raw eta drift over the ladder collapses ~1/m (0.212 at m=0.25 -> 0.00012 at m=32) only because the eta scale shrinks like 1/m -- a scale illusion, not improved conditioning -- and the actual floor drift stays ~0.13 with a 2.06% spread and log-log slope -0.0042 ~ 0 across a 128x change in m; the 2% it does move runs the WRONG way (top-rung floor rises 0.47509 -> 0.47778 as m 0.25 -> 32 from precision loss in the near-singular high-Nbig inversion). The T-arm reopens the floor drift identically at m=1 (0.47561 -> 0.51082 as T 800 -> 1600, Nbig=240) and m=8 (0.47674 -> 0.51082). The coupled (N,T) resolvent-truncation wall is therefore SHIFT-INVARIANT: a well-conditioned resolvent is not reachable by shift alone, closing the shift lever left open by imp-96911 (m=1 fixed) and confirming the wall is the (N,T) truncation of imp-96889/imp-96827. Ritz value is an UPPER bound so this floor is an upper estimate, not a certified LB',
  qed: false,
});
export default IMP96935_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96935_ASSERTIONS = [
  {
    id: 'imp96935-floor-invariant-at-each-rung',
    holds: () => {
      const s = IMP96935_SHIFT_SWEEP_T800;
      // floor(Nbig=24) is identical across the whole m sweep to ~1e-6 (shift-invariant per rung)
      const topSame = s.every((r) => Math.abs(r.floor_top - s[0].floor_top) < 1e-6);
      // and the top-rung floor spread is far larger than 1e-6 (there IS a real Nbig drift to invert)
      const bots = s.map((r) => r.floor_bot);
      const botSpread = Math.max(...bots) - Math.min(...bots);
      return topSame && botSpread < 3e-3 && botSpread > 1e-4 &&
        IMP96935_VERDICT.floorInvariantAtEachRung === true;
    },
    why: 'at each Nbig rung the recovered floor 1/eta-m is shift-invariant (floor(Nbig=24) identical to 1e-6 across m in {0.25..32}); eta ~ 1/(m+mu) so the shift relabels eta but not the eigenvalue it encodes.',
  },
  {
    id: 'imp96935-eta-drift-compresses-but-floor-drift-does-not',
    holds: () => {
      const s = IMP96935_SHIFT_SWEEP_T800;
      // eta drift collapses strongly with m (m=0.25 >> m=32, factor > 100)
      const etaCollapse = s[0].eta_drift / s[s.length - 1].eta_drift > 100;
      // but the floor drift is ~invariant: 2% spread, all rows near 0.13
      const drifts = s.map((r) => r.floor_drift);
      const relSpread = (Math.max(...drifts) - Math.min(...drifts)) / (drifts.reduce((x, y) => x + y, 0) / drifts.length);
      const allNear = drifts.every((d) => Math.abs(d - 0.13) < 0.01);
      return etaCollapse && allNear && relSpread < 0.05 &&
        IMP96935_VERDICT.etaDriftIsScaleIllusion === true &&
        IMP96935_VERDICT.floorDriftShiftInvariant === true;
    },
    why: 'the raw eta drift compresses > 100x over the m sweep (scale ~ 1/m) while the floor drift stays ~0.13 with a < 5% spread -- the eta compression is a scale illusion, the floor drift is shift-invariant.',
  },
  {
    id: 'imp96935-floor-drift-slope-in-logm-is-near-zero',
    holds: () =>
      Math.abs(IMP96935_DRIFT_SHIFT_TREND.loglog_slope_vs_m) < 0.05 &&
      IMP96935_DRIFT_SHIFT_TREND.rel_spread < 0.05 &&
      // the 2% it moves runs the WRONG way for stabilization: drift is MIN at the LARGEST m
      IMP96935_DRIFT_SHIFT_TREND.drift_min_m === 32.0 &&
      IMP96935_VERDICT.largeMDegradesTopRungFloor === true &&
      IMP96935_VERDICT.largerShiftStabilizesFloor === false,
    why: 'd(log floor-drift)/d(log m) = -0.0042 ~ 0 with a 2% spread; the slight decrease is at the largest m and comes from precision loss in the near-singular high-Nbig inversion -- a larger shift does NOT stabilize the floor.',
  },
  {
    id: 'imp96935-t-arm-shift-invariant-and-no-qed',
    holds: () => {
      const t = IMP96935_T_ARM_CHECK;
      // raising T lifts the floor at both shifts, and the T=1600 values agree to 4 digits across m
      const bothRise = t.every((r) => r.floor_T1600 > r.floor_T800);
      const agree = Math.abs(t[0].floor_T1600 - t[1].floor_T1600) < 1e-4;
      return bothRise && agree &&
        IMP96935_VERDICT.tArmShiftInvariant === true &&
        IMP96935_VERDICT.operatorPositivityProved === false &&
        IMP96935_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
        IMP96935_RIGOROUS_REACH_2A === 0.96 &&
        IMP96935_VERDICT.qed === false;
    },
    why: 'raising T 800 -> 1600 at Nbig=240 lifts the floor identically at m=1 and m=8 (agree to 4 digits), so the T-arm is shift-invariant too; no operator positivity is established and the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96935_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96935 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
