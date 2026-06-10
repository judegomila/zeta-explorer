/**
 * @module imp-336-sub-monotonicity-trajectory
 * @fileoverview imp-2516: resolution of the named open sub-gap
 * imp-336-sub-monotonicity-on-trajectory — by REFUTATION at small N.
 *
 * The sub-gap (declared in imp-336-post-ladder-update.js, imp-997) asked to
 * extend the monotonicity conjecture
 *
 *     (M)  |t_c(N+1)| <= |t_c(N)|   for all N >= 2
 *
 * from the tau = 0 anchor (closed by imp-369 Cauchy interlacing) to the whole
 * backward Calogero-Moser trajectory, i.e. to prove the pointwise domination
 *
 *     (M-traj)  B_{N+1}(tau) <= B_N(tau)   for all tau >= 0,
 *
 * where B_N(tau) is the minimum gap of the first N zero ordinates evolved
 * under the backward flow dg_k/dt = -2 sum_{j != k} 1 / (g_k - g_j)
 * (imp-362 convention, positive dt = backward).
 *
 * RESULT (honest, negative): both (M-traj) and the universally quantified
 * (M) itself are FALSE at small N, at the same evidentiary standard as the
 * measured Dyson ladder (the imp-362 emulated-directed-rounding interval
 * RK4 integrator and the imp-409 CERT-VIOL criterion t_c_lo(N+1) > t_c_hi(N)).
 *
 * Mechanism (rigorous, closed form)
 * ---------------------------------
 * Append zero z_{N+1} to the right of the first N ordinates. Under the
 * attractive backward flow the new rightmost particle pulls every existing
 * particle toward it, and pulls the nearer member of each gap harder than
 * the farther member. Hence at tau = 0+ EVERY existing gap g_k strictly
 * opens relative to the N-particle system:
 *
 *     d/dtau [ g_k^{(N+1)} - g_k^{(N)} ](0+)
 *         = 2 * ( 1/(z_{N+1} - z_{k+1}) - 1/(z_{N+1} - z_k) ) > 0.
 *
 * (Shared interaction terms cancel exactly because positions coincide at
 * tau = 0; only the z_{N+1} terms survive. Factor 2 from the imp-362 drift.)
 * Whenever the appended zero does NOT relocate the argmin — i.e. the new
 * edge gap z_{N+1} - z_N is not the new minimum, so B_{N+1}(0) = B_N(0)
 * with a shared interior argmin k* — this gives B_{N+1}(tau) > B_N(tau)
 * for small tau > 0: (M-traj) fails IMMEDIATELY, and the retardation of the
 * critical pair persists numerically all the way to collision, so the
 * (N+1)-system collides strictly LATER and (M) fails too.
 *
 * Certified consecutive-pair scan, N in [2, 20]
 * ---------------------------------------------
 * Offline scan with backwardCollisionInterval (dt = 1e-4, identical dt for
 * both members of each pair; step-size stable at dt in {5e-4, 1e-4, 2e-5}):
 * 12 of 18 consecutive pairs are CERTIFIED violations of (M), and the
 * violation pairs are EXACTLY the pairs whose collision argmin k* is
 * unchanged — a perfect match with the mechanism above. Violation margins
 * t_c_lo(N+1) - t_c_hi(N) decay from 0.2501 (N=3 to 4) to 0.0008 (N=18 to
 * 19), consistent with the differential pull falling off like
 * g_{k*} / dist^2; this explains why the sparse measured ladder
 * (N = 50, 100, 200, ...) never witnessed a violation: across sparse jumps
 * a new smaller gap always enters and dominates the tiny retardation.
 *
 * What survives / consequences for Route A
 * ----------------------------------------
 *   1. imp-369 G2 at tau = 0 is untouched (interlacing is correct;
 *      B_{N+1}(0) <= B_N(0) always — the failure is strictly at tau > 0).
 *   2. The measured-ladder checks in imp-409 stay green: they test sparse
 *      measured pairs (N >= 50), where argmin relocation dominates.
 *   3. The imp-336 drift-sign sketch is UNSOUND as stated: the appended
 *      particle drift has the WRONG sign (it opens gaps, it does not close
 *      them). No rigorisation of the sketch can succeed without excluding
 *      the shared-argmin case, which is the generic case.
 *   4. Route A must replace (M) with a restatement that is both true and
 *      still sufficient for the imp-328 intercept upgrade. That restatement
 *      is the NEW named open sub-gap below (harvestable).
 *
 * Band-reduction lemma (what a positive proof would have needed)
 * --------------------------------------------------------------
 * Recorded because it sharpens the sketch even in refuted form. Let
 * D = B_{N+1} - B_N (locally Lipschitz: min of finitely many C1 gap
 * functions). If D(0) <= 0 and the upper Dini derivative satisfies
 * D^+ D(tau) <= 0 WHENEVER D(tau) >= 0 (a band condition), then D <= 0 for
 * all tau. Proof: if D(tau1) > 0, let tau0 = sup of tau <= tau1 with
 * D(tau) <= 0; then D(tau0) = 0, D >= 0 on [tau0, tau1], so D^+ D <= 0
 * there, so D is non-increasing on [tau0, tau1], so D(tau1) <= 0 —
 * contradiction. NOTE: the weaker hypothesis used implicitly by the imp-336
 * sketch — drift-sign control ONLY at exact crossings D = 0 — is
 * insufficient even in principle: D(tau) = tau^2 has D(0) = 0 and
 * D-prime = 0 at its only crossing yet is positive after. The closed-form
 * obstruction above violates the band condition at tau = 0, which is how
 * the refutation was found.
 *
 * Caveats (honest scope)
 * ----------------------
 *   - Certification is at the imp-362 standard: 1-ULP outward inflation per
 *     operation emulating directed rounding (strictly weaker than Arb), and
 *     the collision bracket is the step interval at first nonpositive
 *     minGapLo (RK4 overshoot inflates the bracket, not the ordering —
 *     margins here are 8x to 2500x the bracket width).
 *   - This refutes (M) for the raw-ordinate truncated N-body flow, the
 *     convention in which (M) is stated (lambda-intercept-monotonicity.js).
 *     It does not refute the sparse-ladder/asymptotic monotonicity that
 *     Path C numerics actually rest on, and says nothing about Lambda.
 *
 * Created by imp-2516 (api-pool, opus-4-8). Consumed by
 * imp-336-post-ladder-update.js (status flip + assertion re-export).
 */

import { backwardCollisionInterval } from '../math/interval-dyson-integrator.mjs';

// First 20 verified zero ordinates, identical to the ZEROS_EXTENDED prefix
// (Odlyzko table, 10 dp). Hardcoded so this module does NOT pull the
// 16.7MB zeros bundle into any page graph.
const Z20 = [
  14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588,
  37.586178159, 40.918719012, 43.327073281, 48.005150881, 49.773832478,
  52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048,
  67.079810529, 69.546401711, 72.067157674, 75.704690699, 77.144840069,
];

// ── Closed-form tau = 0+ obstruction at the headline pair N = 8 -> 9 ─────────
// Shared argmin k* = 7 (1-based; gap z8 - z7 = 2.4084 is the minimum of both
// the 8-zero and 9-zero configurations since z9 - z8 = 4.678 > 2.408).
// d/dtau [B_9 - B_8](0+) = 2 * ( 1/(z9 - z8) - 1/(z9 - z7) ).

const DERIVATIVE_OBSTRUCTION = {
  pair: 'N = 8 -> 9',
  sharedArgminGap: +(Z20[7] - Z20[6]).toFixed(9),
  newEdgeGap: +(Z20[8] - Z20[7]).toFixed(9),
  argminShared: Z20[8] - Z20[7] > Z20[7] - Z20[6],
  dDdtau0: 2 * (1 / (Z20[8] - Z20[7]) - 1 / (Z20[8] - Z20[6])),
  sign: 'strictly positive — B_{N+1} exceeds B_N immediately after tau = 0',
  rkFiniteDifferenceCheck:
    'independent float RK4 finite difference reproduced the slope to 4 ' +
    'significant figures (0.0726, in the dt = -1 convention, i.e. half of ' +
    'the imp-362 dt = -2 value 0.1453)',
};

// ── Offline certified scan (dt = 1e-4, backwardCollisionInterval) ────────────
// Each row: consecutive pair N -> N+1 with certified brackets, collision
// argmin indices (0-based gap index), and the CERT-VIOL flag
// t_c_lo(N+1) > t_c_hi(N). Step-size stability spot-checked at N in {8, 9}
// with dt in {5e-4, 1e-4, 2e-5} (brackets nest, ordering unchanged).

const SCAN_ROWS = [
  { N: 2, lo: 5.9293, hi: 5.9294, kStar: 0 },
  { N: 3, lo: 2.1172, hi: 2.1173, kStar: 1 },
  { N: 4, lo: 2.3674, hi: 2.3675, kStar: 1 },
  { N: 5, lo: 0.8376, hi: 0.8377, kStar: 3 },
  { N: 6, lo: 0.888, hi: 0.8881, kStar: 3 },
  { N: 7, lo: 0.9079, hi: 0.908, kStar: 3 },
  { N: 8, lo: 0.8358, hi: 0.8359, kStar: 6 },
  { N: 9, lo: 0.8864, hi: 0.8865, kStar: 6 },
  { N: 10, lo: 0.4138, hi: 0.4139, kStar: 8 },
  { N: 11, lo: 0.4399, hi: 0.44, kStar: 8 },
  { N: 12, lo: 0.4468, hi: 0.4469, kStar: 8 },
  { N: 13, lo: 0.4508, hi: 0.4509, kStar: 8 },
  { N: 14, lo: 0.2979, hi: 0.298, kStar: 12 },
  { N: 15, lo: 0.3058, hi: 0.3059, kStar: 12 },
  { N: 16, lo: 0.3098, hi: 0.3099, kStar: 12 },
  { N: 17, lo: 0.3122, hi: 0.3123, kStar: 12 },
  { N: 18, lo: 0.3133, hi: 0.3134, kStar: 12 },
  { N: 19, lo: 0.3142, hi: 0.3143, kStar: 12 },
  { N: 20, lo: 0.2761, hi: 0.2762, kStar: 18 },
];

const SCAN_PAIRS = [];
for (let i = 1; i < SCAN_ROWS.length; i++) {
  const prev = SCAN_ROWS[i - 1];
  const curr = SCAN_ROWS[i];
  SCAN_PAIRS.push({
    N_from: prev.N,
    N_to: curr.N,
    certifiedViolation: curr.lo > prev.hi,
    margin: +(curr.lo - prev.hi).toFixed(5),
    argminUnchanged: curr.kStar === prev.kStar,
  });
}

const N_VIOLATIONS = SCAN_PAIRS.filter((p) => p.certifiedViolation).length;

// ── Live build-time recheck of the headline pair (cheap: dt = 5e-4) ─────────
// Re-runs the imp-362 integrator at build time so the refutation cannot
// silently rot if the integrator or the zero prefix changes. dt = 5e-4 keeps
// the cost to ~2k interval RK4 steps per system; the certified margin at
// this dt is 0.0505 with bracket width 5e-4.

const LIVE_8 = backwardCollisionInterval(Z20.slice(0, 8), 5e-4, 4000);
const LIVE_9 = backwardCollisionInterval(Z20.slice(0, 9), 5e-4, 4000);

const LIVE_RECHECK = {
  dt: 5e-4,
  tc8: { lo: LIVE_8.t_c_lo, hi: LIVE_8.t_c_hi, kStar: LIVE_8.collisionIndex, reason: LIVE_8.reason },
  tc9: { lo: LIVE_9.t_c_lo, hi: LIVE_9.t_c_hi, kStar: LIVE_9.collisionIndex, reason: LIVE_9.reason },
  certifiedViolation: LIVE_9.t_c_lo > LIVE_8.t_c_hi,
  margin: LIVE_9.t_c_lo - LIVE_8.t_c_hi,
};

// ── The record ────────────────────────────────────────────────────────────────

export const IMP336_TRAJECTORY_REFUTATION = {
  id: 'imp-2516',
  resolves: 'imp-336-sub-monotonicity-on-trajectory',
  resolution: 'REFUTED at small N (certified at imp-362 evidentiary standard)',
  headline:
    'Both (M-traj) pointwise trajectory domination AND the universally ' +
    'quantified monotonicity conjecture (M) |t_c(N+1)| <= |t_c(N)| for all ' +
    'N >= 2 are FALSE: 12 of 18 consecutive pairs in N in [2, 20] are ' +
    'certified violations (t_c_lo(N+1) > t_c_hi(N), both finite), found by ' +
    'the same interval integrator and CERT-VIOL criterion the measured ' +
    'ladder uses. Violations occur exactly when the appended zero does not ' +
    'relocate the collision argmin; the closed-form tau = 0+ drift of the ' +
    'appended rightmost particle OPENS every existing gap, retarding the ' +
    'collision. The imp-336 drift-sign sketch is unsound as stated.',
  derivativeObstruction: DERIVATIVE_OBSTRUCTION,
  scan: {
    dt: 1e-4,
    rows: SCAN_ROWS,
    pairs: SCAN_PAIRS,
    nPairs: SCAN_PAIRS.length,
    nCertifiedViolations: N_VIOLATIONS,
    mechanismMatch:
      'certifiedViolation === argminUnchanged on every one of the 18 pairs',
    marginDecay:
      'violation margins decay 0.2501 (N=3->4) to 0.0008 (N=18->19), so the ' +
      'effect vanishes across the sparse measured-ladder jumps where new ' +
      'smaller gaps dominate',
  },
  liveRecheck: LIVE_RECHECK,
  whatSurvives: [
    'imp-369 G2 interlacing at tau = 0 (B_{N+1}(0) <= B_N(0)) is correct and untouched.',
    'imp-409 measured-ladder checks (sparse N >= 50) remain green; no measured pair violates.',
    'Path C numerics rest on the sparse ladder, not on per-N (M); the Lambda chain is unaffected.',
  ],
  brokenByThisResult: [
    'imp-336 HYPOTHESIS (M) as universally quantified over all N >= 2 — refuted.',
    'imp-336 drift-sign analytic sketch — the appended-particle drift has the wrong sign.',
    'Any Route A chain step that consumes per-N (M) rather than a sparse or eventual restatement.',
  ],
  openSubGap: {
    id: 'imp-336-sub-monotonicity-restatement',
    statement:
      'Find and prove the weakest monotonicity-type statement (M-restated) ' +
      'that is (a) consistent with the certified small-N violations recorded ' +
      'here and (b) still sufficient for the imp-328 conditional intercept ' +
      'upgrade. Candidates: eventual monotonicity |t_c(N+1)| <= |t_c(N)| for ' +
      'all N >= N0 with explicit N0; monotonicity along the argmin-relocation ' +
      'subsequence (the pairs where a new global-minimum gap enters, which is ' +
      'where all certified decreases happen); or the envelope form ' +
      'min_{M <= N} |t_c(M)| non-increasing, which IS unconditionally true and ' +
      'may already suffice for the Path C intercept argument.',
    status:
      'closed — RESOLVED-POSITIVE by imp-2530 ' +
      '(imp-2530-monotonicity-restatement.js): (M-restated) = the envelope ' +
      'form E(N) = min over M <= N of |t_c(M)| non-increasing, proved as an ' +
      'unconditional elementary theorem. Consumer audit: the imp-328 ' +
      'conclusion splits into the inf-bound (discharged by the envelope ' +
      'theorem alone) and limit existence (discharged by the imp-341 ' +
      'unconditional lim sup = 0 record, since |t_c| >= 0 forces ' +
      'lim = 0 = inf). Consistency: the envelope brackets certify FLAT ' +
      'exactly at the 12 CERT-VIOL pairs above and DROP exactly at the 6 ' +
      'argmin-relocation pairs — full certified trichotomy, the envelope ' +
      'is blind to the refutation.',
    resolvedBy: 'imp-2530',
    closureNoteImp2530:
      'Per-N (M) was never load-bearing for the imp-328 intercept upgrade; ' +
      'the residual per-N rate question is the pre-existing imp-344 ' +
      'rate-upgrade gap (imp-342 G3_density or a psi_N rate), tracked ' +
      'there and deliberately not re-declared as a new sub-gap here.',
  },
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP336_TRAJECTORY_REFUTATION_ASSERTIONS = [
  {
    id: 'imp2516-derivative-obstruction-positive',
    holds: () =>
      DERIVATIVE_OBSTRUCTION.argminShared &&
      DERIVATIVE_OBSTRUCTION.dDdtau0 > 0.14 &&
      DERIVATIVE_OBSTRUCTION.dDdtau0 < 0.16,
    why:
      'The closed-form tau = 0+ drift 2 * (1/(z9 - z8) - 1/(z9 - z7)) must be ' +
      'strictly positive (about 0.1453) and the N = 8 and N = 9 ' +
      'configurations must share the interior argmin. If this fails the zero ' +
      'prefix has changed and the refutation mechanism no longer applies at ' +
      'the headline pair.',
  },
  {
    id: 'imp2516-live-interval-violation-N8-N9',
    holds: () =>
      LIVE_RECHECK.certifiedViolation &&
      LIVE_RECHECK.margin > 0.04 &&
      LIVE_RECHECK.tc8.reason === 'gap-lower-bound-nonpositive' &&
      LIVE_RECHECK.tc9.reason === 'gap-lower-bound-nonpositive',
    why:
      'Live build-time rerun of the imp-362 interval integrator must certify ' +
      't_c_lo(9) > t_c_hi(8) with margin > 0.04 (measured: 0.0505 at ' +
      'dt = 5e-4). This is the CERT-VIOL criterion from imp-409 applied at ' +
      'N = 8 -> 9: a certified counterexample to (M). If it stops holding, ' +
      'the integrator convention has changed and the refutation record must ' +
      'be re-audited.',
  },
  {
    id: 'imp2516-scan-mechanism-biconditional',
    holds: () =>
      SCAN_PAIRS.length === 18 &&
      N_VIOLATIONS === 12 &&
      SCAN_PAIRS.every((p) => p.certifiedViolation === p.argminUnchanged),
    why:
      'On all 18 consecutive pairs in N in [2, 20], certified violation of ' +
      '(M) occurs IF AND ONLY IF the collision argmin is unchanged by the ' +
      'appended zero — the exact signature of the appended-particle ' +
      'gap-opening mechanism. A mismatch means the hardcoded scan table was ' +
      'edited inconsistently.',
  },
  {
    id: 'imp2516-margins-decay-with-N',
    holds: () => {
      const v = SCAN_PAIRS.filter((p) => p.certifiedViolation);
      const first = v[0];
      const tail = v.filter((p) => p.N_from >= 14);
      return first.margin > 0.2 && tail.length >= 4 && tail.every((p) => p.margin < 0.01);
    },
    why:
      'Violation margins must decay with N (0.2501 at the first violating ' +
      'pair, below 0.01 for all pairs with N >= 14). This is the quantitative ' +
      'basis for the claim that the sparse measured ladder is unaffected.',
  },
  {
    id: 'imp2516-successor-subgap-coordinated-flip',
    holds: () =>
      IMP336_TRAJECTORY_REFUTATION.openSubGap.id ===
        'imp-336-sub-monotonicity-restatement' &&
      IMP336_TRAJECTORY_REFUTATION.openSubGap.status.startsWith('closed') &&
      IMP336_TRAJECTORY_REFUTATION.openSubGap.resolvedBy === 'imp-2530',
    why:
      'The successor sub-gap was closed by imp-2530 with the coordinated ' +
      'flip the original stay-open tripwire demanded: (M-restated) = ' +
      'envelope form, proved unconditionally in ' +
      'imp-2530-monotonicity-restatement.js, with the sufficiency audit ' +
      'and the certified flat-iff-violation consistency check pinned by ' +
      'the imp2530-* assertions there. The id must stay pinned and the ' +
      'status must remain closed-by-imp-2530; a silent reopen or re-id ' +
      'breaks the audit chain.',
  },
];
