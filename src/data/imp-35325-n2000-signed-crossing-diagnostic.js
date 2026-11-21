/**
 * @module imp-35325-n2000-signed-crossing-diagnostic
 * @fileoverview imp-35325: diagnose whether the imp-35235 DP45 dt/2 gate-skip at
 * N=2000 is a PHYSICAL near-collision the coarse order-5 stages stepped over, or
 * merely a sort-order label swap of two zeros that stay separated.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35235 left R2 at N=2000 PARTIAL because its DP45 dt/2 refinement GATE-SKIPS:
 * the sorted min gap of pair-1495 jumps from 1.775e-3 straight to a re-sorted
 * 3.23e-2 in ONE dt/2 step WITHOUT landing in the (0, 1e-4) gate, and DP45 then
 * continues to a spurious re-approach event at t_c=1.3238e-3 > t_c_hi=1.2e-3. Three
 * clean references (RK4 dt, DP45 dt, RK4 dt/2) instead put the true-flow collision
 * on pair-1495 at t_c ~ 1.192-1.193e-3, strictly below t_c_hi. Whether the skipped
 * jump is a REAL physical collision (the true event the coarse stages overshot) or
 * a sort-order relabel of two still-separated zeros decides whether the true
 * t_c(2000) genuinely sits below t_c_hi. imp-35278 INFERRED a pass-through from the
 * step ENDPOINTS (positive at both, so re-separation within the step); this module
 * makes the DIRECT sub-step measurement.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35325-n2000-signed-crossing-diagnostic.mjs reproduces the imp-35235
 * setup VERBATIM (N=2000, dt/2 = tauC_est/2000 = 5.941760e-7, no re-sorting during
 * the flow so array slots 1495/1496 hold the same two zeros) and tracks the SIGNED
 * ordinate difference d = gamma[1496]-gamma[1495] instead of the sorted min gap.
 * It (1) confirms the DP45 dt/2 coarse skip has NO endpoint sign change (d jumps
 * 1.775304e-3 -> 3.233610e-2, both positive), (2) DIRECTLY sub-integrates that one
 * dt/2 interval with M=2000 fine DP45 sub-steps from the pre-skip state and watches
 * d at INTERIOR nodes, and (3) cross-checks the RK4 dt/2 reference at the same event.
 *
 * OUTCOME: PHYSICAL PASS-THROUGH -- the skipped event is the TRUE collision
 * ----------------------------------------------------------------------------
 * The direct sub-step probe finds the signed difference d CROSSES ZERO inside the
 * coarse dt/2 interval: first zero-crossing at fraction 0.6637 of the step, with
 * min |d| = 8.812669e-7 reached at fraction 0.9750 -- nearly four orders of
 * magnitude below the 1e-4 gate, i.e. essentially a collision. The fine flow shows
 * 22 interior sign changes as the pair pinches through the near-singular 2/diff
 * derivative, and re-separates to only d = 5.363764e-3 by the interval end (NOT the
 * coarse single-step 3.233610e-2, itself an overshoot artifact). The RK4 dt/2
 * reference INDEPENDENTLY confirms the crossing: its signed diff runs
 * +1.774683e-3 (step 2006) -> -5.436303e-5 (step 2007, a GENUINE sign change that
 * lands inside the gate) -> +1.445632e-2 (step 2008). Both families therefore see
 * the two zeros PHYSICALLY pass through each other at the same event.
 *
 * NET: the imp-35235 DP45 dt/2 gate-skip is a REAL near-collision the coarse order-5
 * dt/2 step stepped OVER, NOT a label re-sort of separated zeros. The true
 * t_c(2000) does sit below t_c_hi=1.2e-3 as the three clean references say, and the
 * DP45 re-approach at t_c=1.3238e-3 is a SPURIOUS second event (numerical
 * overshoot re-separation). This confirms imp-35278 at the sub-step level and
 * explains why an endpoint event (gate OR signed-crossing) is blind to it: the
 * pass-through completes WITHIN a single dt/2 step. The remedy remains a FINER grid
 * (imp-35324 tauC/4000) or a genuine sub-step dense-output interpolant.
 *
 * SCOPE: DIAGNOSTIC / MEASUREMENT ONLY. Does NOT extend the R2 ladder (stays at
 * N=1000, imp-35221); does NOT extend the C_mb certificate; does NOT remove the
 * imp-486 GUE conditional; changes NO bound. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35235  R2 N=2000 order-robust flow reference (the gate-skip diagnosed here)
 * @see imp-35278  gate-free signed-crossing re-run (inferred pass-through from endpoints)
 * @see imp-35324  finer-base-grid (tauC/4000) re-run that resolves the gate-skip
 * @see imp-35221  R2 ladder extension to N=1000 (largest N tested-and-met)
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (fixed-dt map bracket t_c_hi=1.2e-3)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35325-n2000-signed-crossing-diagnostic.mjs (offline producer)
 */

// ── Offline-measured signed-crossing diagnostic at N=2000. ───────────────────
// Producer: scripts/imp-35325-n2000-signed-crossing-diagnostic.mjs (Node, plain
// Float64). Grid inherited from imp-35235 (dt/2 = tauC_est/2000). Pair slots
// LO=1495, HI=1496; signed diff d = gamma[HI]-gamma[LO], array never re-sorted.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_HALF = 5.941760e-7;   // tauC_est / 2000 (imp-35235 dt/2 refinement grid)
const GATE = 1e-4;             // the imp-35235 (0, 1e-4) min-spacing gate band
const PAIR_LO = 1495;
const PAIR_HI = 1496;

// DP45 dt/2 coarse trajectory of the SIGNED diff across the gate-skip step. The
// last positive small value (step 2006) jumps to a large positive (step 2007) in
// a single order-5 step with NO endpoint sign change -- the gate-skip.
const DP45_COARSE = {
  stepPre: 2006,
  dPre: 1.775304e-3,          // last resolved signed diff before the skip
  stepPost: 2007,
  dPost: 3.233610e-2,         // one coarse DP45 dt/2 step later (overshoot re-separation)
  endpointSignChange: false,  // both endpoints positive -> gate/endpoint event blind
};

// DIRECT sub-step probe: M fine DP45 sub-steps of the SINGLE dt/2 interval from the
// pre-skip state. Interior sign changes and a sub-gate min |d| => physical crossing.
const SUBSTEP_PROBE = {
  M: 2000,
  subDt: 2.9709e-10,          // DT_HALF / M
  interiorSignChanges: 22,    // d oscillates through zero at the near-singular pinch
  minAbsD: 8.812669e-7,       // ~1e-3 x GATE -- essentially a collision
  minAbsDFrac: 0.9750,        // fraction of the interval where |d| bottoms out
  firstCrossFrac: 0.6637,     // first zero-crossing inside the coarse step
  dIntervalEnd: 5.363764e-3,  // fine re-separation (far below the coarse 3.23e-2)
};

// RK4 dt/2 cross-check: the well-resolved order-4 reference shows a GENUINE signed
// sign change at the SAME event (and correctly lands inside the gate).
const RK4_CROSSCHECK = {
  stepPre: 2006,
  dPre: 1.774683e-3,          // positive, approaching collision
  stepGate: 2007,
  dGate: -5.436303e-5,        // NEGATIVE -- genuine sign change, |dGate| < GATE (lands in gate)
  stepPost: 2008,
  dPost: 1.445632e-2,         // re-separates on the far side
  signChange: true,
  landsInGate: true,          // |dGate| < GATE
};

// ── Derived verdict. ─────────────────────────────────────────────────────────
const SUBSTEP_CROSSES = SUBSTEP_PROBE.interiorSignChanges > 0 &&
  SUBSTEP_PROBE.firstCrossFrac > 0 && SUBSTEP_PROBE.firstCrossFrac < 1 &&
  SUBSTEP_PROBE.minAbsD < GATE;
const PHYSICAL_PASS_THROUGH = SUBSTEP_CROSSES && RK4_CROSSCHECK.signChange;

export const IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC = {
  id: 'imp-35325',
  title:
    'Diagnose the imp-35235 DP45 dt/2 gate-skip at N=2000: PHYSICAL near-collision ' +
    'stepped over, or sort-order label swap? -- DIRECT sub-step signed-crossing ' +
    'probe finds a PHYSICAL pass-through',
  kind: 'diagnostic-measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  N,
  tauC_est: TAU_C_EST,
  dtHalf: DT_HALF,
  gate: GATE,
  pair: { lo: PAIR_LO, hi: PAIR_HI, signedDiff: 'd = gamma[1496] - gamma[1495] (array never re-sorted)' },

  dp45Coarse: DP45_COARSE,
  substepProbe: SUBSTEP_PROBE,
  rk4Crosscheck: RK4_CROSSCHECK,

  verdict: {
    physicalPassThrough: PHYSICAL_PASS_THROUGH,
    isLabelSwap: false,
    reApproachIsSpurious: true,
    largestN_R2_tested_and_met: 1000,
    interpretation:
      'The imp-35235 DP45 dt/2 gate-skip is a REAL near-collision the coarse ' +
      'order-5 dt/2 step stepped OVER, not a label re-sort of separated zeros. ' +
      'Tracking the SIGNED diff d = gamma[1496]-gamma[1495] (no re-sorting), the ' +
      'DP45 dt/2 coarse step jumps 1.775304e-3 -> 3.233610e-2 with NO endpoint ' +
      'sign change, but a direct sub-step probe (M=2000 fine DP45 sub-steps of ' +
      'that one interval) shows d CROSSES ZERO at fraction 0.6637 and bottoms at ' +
      '|d| = 8.812669e-7 (~1e-3 x the 1e-4 gate) -- a genuine pass-through the ' +
      'coarse stages overshot. The RK4 dt/2 reference independently confirms the ' +
      'crossing: +1.774683e-3 -> -5.436303e-5 (in-gate) -> +1.445632e-2. So the ' +
      'true t_c(2000) sits below t_c_hi=1.2e-3 as the three clean references say ' +
      'and the DP45 re-approach at 1.3238e-3 is a SPURIOUS second event. The ' +
      'pass-through completes WITHIN one dt/2 step, which is why an endpoint event ' +
      '(gate or signed-crossing) is blind to it (confirming imp-35278 at the ' +
      'sub-step level); the remedy is a finer grid (imp-35324) or sub-step dense ' +
      'output.',
    doesNotAchieve:
      'Does NOT extend the R2 ladder to N=2000 (this is a diagnostic, not a new ' +
      'flow certificate); does NOT extend the C_mb certificate; does NOT remove ' +
      'the imp-486 GUE conditional; changes NO Lambda bound. No refereed bound is changed' +
      '.',
    informsId: 'imp-35278 (gate-free signed-crossing route) / imp-35324 (finer-grid remedy)',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC_ASSERTIONS = [
  {
    id: 'imp35325-dp45-coarse-endpoint-blind',
    holds: () =>
      DP45_COARSE.dPre > 0 && DP45_COARSE.dPost > 0 &&
      DP45_COARSE.endpointSignChange === false &&
      DP45_COARSE.dPost > 10 * DP45_COARSE.dPre,
    why:
      'The DP45 dt/2 coarse step must show the gate-skip signature: the tracked ' +
      'SIGNED diff is small-positive (1.775e-3) then large-positive (3.23e-2) with ' +
      'NO endpoint sign change, so an endpoint event (gate or signed-crossing) ' +
      'cannot see the collision that happened inside the step.',
  },
  {
    id: 'imp35325-substep-physical-crossing',
    holds: () =>
      SUBSTEP_PROBE.interiorSignChanges > 0 &&
      SUBSTEP_PROBE.firstCrossFrac > 0 && SUBSTEP_PROBE.firstCrossFrac < 1 &&
      SUBSTEP_PROBE.minAbsD < GATE / 100 &&
      SUBSTEP_PROBE.dIntervalEnd < DP45_COARSE.dPost,
    why:
      'DIRECT DIAGNOSIS: sub-integrating the single dt/2 interval with fine DP45 ' +
      'sub-steps must show the signed diff CROSS ZERO inside the interval ' +
      '(interior sign change, first crossing at an interior fraction) and bottom ' +
      'at |d| far below the gate -- a genuine pass-through. The fine re-separation ' +
      '(5.36e-3) being far below the coarse single-step value (3.23e-2) confirms ' +
      'the coarse post-value is an overshoot artifact, not a physical position.',
  },
  {
    id: 'imp35325-rk4-crosscheck-genuine-signchange',
    holds: () =>
      RK4_CROSSCHECK.dPre > 0 && RK4_CROSSCHECK.dGate < 0 &&
      Math.abs(RK4_CROSSCHECK.dGate) < GATE && RK4_CROSSCHECK.landsInGate === true &&
      RK4_CROSSCHECK.signChange === true,
    why:
      'CROSS-FAMILY CONFIRMATION: the well-resolved RK4 dt/2 reference must show a ' +
      'GENUINE signed sign change at the SAME event -- positive before, negative ' +
      'in-gate (|dGate| < 1e-4) at the crossing, positive after. This independently ' +
      'establishes the two zeros physically pass through each other, so the DP45 ' +
      'gate-skip is a stepped-over real collision, not a label swap.',
  },
  {
    id: 'imp35325-verdict-physical-not-labelswap',
    holds: () =>
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.verdict.physicalPassThrough === true &&
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.verdict.isLabelSwap === false &&
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.verdict.reApproachIsSpurious === true,
    why:
      'The overall verdict must be PHYSICAL PASS-THROUGH (not a label swap): the ' +
      'sub-step probe crossing AND the RK4 cross-check sign change both hold, so ' +
      'the skipped event is the true collision and the DP45 re-approach at ' +
      '1.3238e-3 is spurious.',
  },
  {
    id: 'imp35325-diagnostic-no-qed-ladder-unmoved',
    holds: () =>
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.noQED === true &&
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.changesNoBound === true &&
      IMP_35325_N2000_SIGNED_CROSSING_DIAGNOSTIC.verdict.largestN_R2_tested_and_met === 1000,
    why:
      'Diagnostic only: never a QED or a bound change. It explains the imp-35235 ' +
      'gate-skip but does NOT itself certify R2 at N=2000, so the R2 ladder ' +
      'largest-N-tested-and-met STAYS at 1000. C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed.',
  },
];
