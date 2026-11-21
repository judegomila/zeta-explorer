/**
 * imp-95013b - Gate-2 Lane-A native evaluator BUILT + real-probe attempt:
 * the mandatory anchor gate does NOT reproduce, so the verdict is
 * BLOCKED-ON-CONVENTION (specifically: blocked on the anchor cell's x*).
 * NO scan was run against the unanchored evaluator; NO surrogate was
 * substituted; probeVerdict was NOT fed. Measurement infrastructure only;
 * changes no bound; NO QED; no refereed bound is changed.
 *
 * WHAT WAS BUILT (the imp-95072 unlock item (5), now written, not found):
 * native/gate2-lane-a/{main.c, Makefile, README.md} - a standalone C
 * (clang -O3, pthreads) evaluator of the residual cocycle E97(x) =
 * L(MA(x)c(x)) (imp-95012 frozen spec, paper eqs (10)-(11)) with:
 *   - double-double phase pipeline: theta_n = (x/2) ln n mod 2pi via an
 *     exact-two_prod frac reduction (fl(Y.hi*L.hi) >= 2^52 is an integer,
 *     so the fractional part lives in the exact fma tail + cross terms);
 *     worst-case phase error ~1e-13 rad at x ~ 3.77e16 where naive double
 *     has ulp ~ 74 rad; cross-checked against mpmath (60 dps) to ~6e-16;
 *   - SPF sieve to 5.48e7 -> dd ln n table (primes via range-reduced atanh
 *     series, composites by exact factor splitting), coprime-to-97 mask,
 *     and the 25-class table for the eq-(13) defect telescope;
 *   - the delivered audit conventions (research-inputs/gate2-evaluator-inputs/):
 *     site grid x_N = 4pi(N^2 - t0/16) == 4piN^2 - pi t0/4 (CAUTION #1
 *     resolved: identical spellings), landmark N(x,t) = floor(sqrt(x/4pi +
 *     t/16)) (compute_exact_N), gamma_at = exp(0.02y - (y/2)ln(x_N/4pi)),
 *     sigma_B = (1+y)/2 + (t0/4)ln(x_N/4pi) - t0*h/(2x_N^2), sigma_A =
 *     sigma_B - y, b_n = exp((t0/4)ln^2 n) (the t0 factor per paper eq (10)
 *     and every delivered bt_eval; imp-95072's transcription correction of
 *     imp-95012 CONFIRMED numerically: without t0, |E97| ~ 2.1e13),
 *     half-open windows W_N = [x_N, x_{N+1}) with both one-sided seam
 *     charts (verify_window_freeze.py);
 *   - the exact directed Polymath-15 gamma ratio derived in closed form:
 *     lambda(x,y,t) = (x/4pi)^{-y/2} exp(i[pi/4 + x/2 - (x/2 + t pi/8)
 *     ln(x/4pi)]) (the s(s-1) prefactors of M0(sA), M0(sB) cancel exactly;
 *     dropped corrections O(1/x) ~ 1e-13), and the Theorem-1.3 ladder
 *     phases theta_n/2pi = frac((x/(4pi) + t/16) ln n) - the SAME radicand
 *     as compute_exact_N, confirming imp-95013's note that the landmark
 *     map fixes "sieve, phases, and window";
 *   - the eq-(13) 25-defect telescope D_j = A_{<j} R_{>j}(q_{p_j}I -
 *     T_{p_j})F_N, validated: sum_j D_j = E97 to ~1e-14 in every
 *     evaluation (exact identity - strong internal algebra check), plus
 *     the stronger pilot sum_j |D_j| (paper gate G3);
 *   - the full imp-95011 probe scanner (log-spaced N, 5 window parameters,
 *     2 seam sides, (N,N+1)/(N,N+2) pairs, decoupled-mass ratios, JSON
 *     output, pthreads) - hard-gated: scan REFUSES to run until the anchor
 *     gate passes (exit 3, "BLOCKED-ON-CONVENTION").
 *
 * WHY THE ANCHOR GATE FAILS (the honest diagnosis, not a work-around):
 * the anchor cell is |x - x*| <= 1/40000000000 at N = 690988 with
 * |E97(x)| < 0.2141254901198318, but x* is NOT transcribed in the paper
 * ("the accompanying replay closes one positive-width cell", Section 4.6,
 * replay = private project workspace [18]), nor in the delivered evaluator
 * inputs, nor in the public sealed audit repo
 * (judegomila/dbn-lambda-01787854-candidate-audit - checked file-by-file),
 * nor anywhere in this repository (grep). |E97(x)| oscillates on a
 * Delta-x ~ 0.1 scale, so a 16-digit literal is unmatchable without the
 * exact x*: the gate is under-determined by the delivered inputs - a
 * missing-input problem, not an implementation bug. The systematic search
 * (2 b_n laws x 2 carrier brackets x {real gamma_at, 4 chi-phase variants,
 * same-phase, exact directed Polymath-15 lambda} x frozen/at-x charts x
 * 2 t-rows x 9+ x* candidates x {|E97|, pilot sum|D_j|}) never comes
 * within 15 percent of the target; a 25,200-point dense hunt over
 * x in [X-54, X+450] tops out at 0.1860276 and never crosses the target.
 *
 * REV 2 (same day, coordinator unlock attempt): x* RESOLVED, gate still
 * fails, diagnosis sharpened one layer. The anchor cell center is the
 * window-freeze criterion start x* := X + sqrt(1 - y0^2)
 * (~/dbn-lambda-audit-review/WINDOW_FREEZE_THEOREM.md). VALIDATED: the
 * native evaluator reproduces that theorem's 400-bit certified window
 * margins digit-for-digit under the audit-row parameterization
 * (t = 129/800, y0^2 = 87677/2500000): x* - x_690988 = 5377393.98785643
 * (certified > 5377393.9878), x_690989 - x* = 11989041.1746638
 * (certified > 11989041.1746) -- site grid, landmark map, dd machinery,
 * and x* are beyond doubt. |E97| AT the exact x* still misses the target
 * by 49-96 percent under every convention combination and under BOTH row
 * parameterizations (best: samePhase bb=1 at the Gate-2 row,
 * 0.1081646523386882). Row check (coordinator step 3): the anchor cell
 * GEOMETRY is audit-row (margins match t = 129/800 exactly), but the
 * VALUE reproduces under neither row. The residual gap is therefore
 * isolated to the E97 evaluation convention (ladder normalization / gamma
 * weighting / exponent spelling) of the paper's reference [19] replay
 * (strict_sub014_extension_v1/, companion source archive), which is NOT
 * on this machine: Spotlight + targeted greps of ~/dbn-lambda-audit-review,
 * ~/dbn-lambda-sweep-clean, ~/dbn-lambda-01758354-candidate,
 * ~/Downloads/twin_ladder_rh_repo and the candidate zips find the anchor
 * literal only in the paper PDF and this repo's own modules (the audit
 * workspaces contain NO E97 code; their '0.2141' grep hits are
 * digit-substring coincidences inside prism logs).
 *
 * THE PRECISE UNLOCK (sharpened; x* is no longer the blocker): commit the
 * [19] strict_sub014_extension_v1 replay or, at minimum, its E97
 * evaluator conventions (ladder normalization, directed-gamma weighting,
 * exact sA/sB spellings, and the (t, y) row the anchor was computed
 * under). The scan binary now tests the resolved x* by default and
 * unlocks the ~30-40 min probe on a genuine pass; probeVerdict(L,
 * sampledSup) is then fed verbatim.
 */

// ── the frozen gate (carried literals; no recomputation drift) ───────────────
export const ANCHOR_GATE_TARGET = 0.2141254901198318; // imp-95012 anchor E97Peak
export const REX_EXACT = 0.2796881955526244146123; // paper eq (19)
export const RESERVE_DOCUMENTED = 0.0655627054327926; // paper Section 4.6
export const ANCHOR_MATCH_TOLERANCE_REL = 1e-9; // task-mandated gate tolerance

// ── the measured convention-search witnesses (native run 2026-09-02) ─────────
// |E97| at N=690988 under representative (x*, convention) combinations;
// 7-sig-fig storage, tolerance in assertions is 1e-6 (storage precision).
export const CONVENTION_SEARCH_WITNESSES = Object.freeze([
  // x* = X+1 = 6000000185828 (x0, the open-edge start), delivered-real-gamma
  { xStar: 'X+1', convention: 'gamma_at real, phases (x/2)ln n', absE97: 0.03378028, pilot: 0.08081772 },
  // x* = X+1, exact Polymath-15 directed lambda + Theorem-1.3 phases
  { xStar: 'X+1', convention: 'directed lambda, phases (x/2 + t*pi/8)ln n', absE97: 0.08365600, pilot: 0.10982908 },
  // the closest of all combinations tested (still 26 percent off)
  { xStar: 'X+t0+sqrt(1-y0^2)', convention: 'directed lambda, Theorem-1.3 phases', absE97: 0.15759524, pilot: 0.18127194 },
  // the b_n-without-t0 refutation (imp-95012 transcription): 14 orders off
  { xStar: 'X+1', convention: 'b_n = exp(ln^2 n / 4), no t0 factor', absE97: 20866978580564.32, pilot: null },
]);
export const HUNT_MAX = Object.freeze({
  strip: 'x in [X-54, X+450], step 0.02 (25,200 evaluations)',
  maxAbsE97: 0.18602763,
  atXminusX: -0.22,
  targetCrossed: false,
});

// ── rev 2: the resolved anchor-cell center and its geometric validation ──────
export const XSTAR_RESOLUTION = Object.freeze({
  definition: 'x* := X + sqrt(1 - y0^2), X = 6000000185827 (window-freeze criterion start, ~/dbn-lambda-audit-review/WINDOW_FREEZE_THEOREM.md)',
  auditRow: { t: '129/800', y0sq: '87677/2500000', xStarOffset: 0.9823080983072470 },
  gate2Row: { t: '24727519/200000000', y0: '1809/10000', xStarOffset: 0.9835014946607860 },
  // native dd evaluation reproduces the theorem's 400-bit certified margins:
  marginLeft: 5377393.98785643, // x* - x_690988, certified > 5377393.9878
  marginRight: 11989041.1746638, // x_690989 - x*, certified > 11989041.1746
  marginRowNote: 'the certified margins match the t = 129/800 site grid exactly (at the Gate-2 t0 the left margin would be 5377393.95950911), so the anchor cell GEOMETRY is audit-row',
});

// |E97| AT the exact x* (16 digits, native run 2026-09-02 rev 2); the gate
// target is missed by 49-96 percent under every combination.
export const EXACT_XSTAR_WITNESSES = Object.freeze([
  { row: 'gate2', convention: 'gamma_at real', absE97: 0.0321779141165190 },
  { row: 'gate2', convention: 'directed lambda (polymath, at x)', absE97: 0.0705459658528420 },
  { row: 'gate2', convention: 'samePhase (closest of all)', absE97: 0.1081646523386882 },
  { row: 'audit', convention: 'gamma_at real', absE97: 0.0285675189118675 },
  { row: 'audit', convention: 'directed lambda (polymath, at x)', absE97: 0.0758802543680923 },
  { row: 'audit', convention: 'chi(+,-pi/4) (closest audit-row)', absE97: 0.0783242949997991 },
]);

// ── internal validations of the built evaluator ──────────────────────────────
export const EVALUATOR_VALIDATIONS = Object.freeze({
  telescopeIdentityMaxErr: 5e-14, // |sum_j D_j - E97| across all evaluations (eq (13) exact)
  phaseCrossCheckVsMpmath: 6e-16, // frac((x/2)ln n / 2pi) at x=3.77e16, n=54799999
  landmarkConsistency: 'N(x_N) == N at 690988, 3840000, 54799999',
  chartConstantsVsMpmath: 'x_N, sigma_B, sigma_A, gamma_at match 50-digit references to full double precision',
  selftest: 'native/gate2-lane-a: ./gate2 selftest ALL PASS',
});

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95013B_GATE2_LANE_A_REAL_PROBE = Object.freeze({
  ticket: 'imp-95013b',
  parentTickets: ['imp-95013', 'imp-95072', 'imp-95015'],
  source:
    'native/gate2-lane-a (built this ticket); research-inputs/gate2-evaluator-inputs/ (delivered audit conventions); ' +
    'research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf Section 4.6; ' +
    'public audit repo judegomila/dbn-lambda-01787854-candidate-audit (checked for x*, absent)',
  status: 'BLOCKED-ON-CONVENTION',
  blockedOn:
    'rev 2: x* RESOLVED (= X + sqrt(1 - y0^2), geometry validated against the 400-bit certified margins); ' +
    'the residual blocker is the E97 evaluation convention of the paper reference-[19] replay ' +
    '(strict_sub014_extension_v1, absent from this machine): |E97| at the exact x* misses the target by ' +
    '49-96 percent under every tested convention and both row parameterizations',
  evaluatorBuilt: true,
  evaluatorPath: 'native/gate2-lane-a/main.c (+ Makefile, README.md)',
  anchorGate: {
    target: ANCHOR_GATE_TARGET,
    toleranceRel: ANCHOR_MATCH_TOLERANCE_REL,
    reproduced: false,
    closestValue: 0.15759524, // pre-rev-2 candidate scan: X+t0+sqrt(1-y0^2), directed lambda
    closestAtExactXstar: 0.10816465, // rev 2: samePhase bb=1, Gate-2 row, still 49 percent off
    xStarResolution: XSTAR_RESOLUTION,
    exactXstarWitnesses: EXACT_XSTAR_WITNESSES,
    scanRefusedByBinary: true, // scan mode exits 3 until the gate passes (now testing the resolved x*)
  },
  conventionDecisions: {
    caution1_tSpelling: '4pi(N^2 - t0/16) == 4piN^2 - pi*t0/4 identically; used the first with t0 as exact dd rational',
    caution2_normalization: 'leading-B normalization: direct-ladder n=1 term is exactly 1; gamma enters as the cross-chart ratio',
    bnT0Factor: 'CONFIRMED required (paper eq (10) + every delivered bt_eval); without it |E97| ~ 2.1e13',
    gammaDirected: 'delivered gamma_at is the modulus majorant; the directed complex lambda was derived in closed form and tested; neither reproduces the anchor at any natural x*',
    phases: 'theta_n/2pi = frac((x/(4pi) + t/16) ln n) - the compute_exact_N radicand; both (x/2)ln n and Theorem-1.3 (x/2 + t*pi/8)ln n spellings tested',
  },
  ranScan: false,
  emittedProbeMeasurement: false,
  surrogateSubstitution: false,
  probeVerdictFed: false, // no measured L / sampledSup exist; nothing fabricated
  namedSubGap: 'imp-95013b-sub-replay-convention',
  subGapStatement:
    'rev 2 (x* resolved, no longer the blocker): commit the paper reference-[19] replay ' +
    '(strict_sub014_extension_v1 from the companion source archive) or its E97 evaluator conventions ' +
    '(ladder normalization, directed-gamma weighting, exact sA/sB spellings, and the (t, y) row the anchor ' +
    'was computed under); the scan binary already tests the resolved x* = X + sqrt(1 - y0^2) by default and ' +
    'unlocks the ~30-40 min probe on a genuine anchor pass, feeding probeVerdict(L, sampledSup) verbatim',
  isRigorous: false,
  promotesBound: false,
  verdict:
    'BLOCKED-ON-CONVENTION (rev 2, sharpened): the Lane-A E97/C_E,17 scanner EXISTS (dd phase pipeline ' +
    'validated vs mpmath to ~6e-16, eq-(13) telescope exact to ~1e-14, SPF sieve to 5.48e7, pthreads probe ' +
    'scanner with hard anchor gate), and the anchor cell center is now RESOLVED as the window-freeze ' +
    'criterion start x* = X + sqrt(1 - y0^2), with the evaluator reproducing the 400-bit certified window ' +
    'margins (5377393.98785643 / 11989041.1746638) digit-for-digit. The mandatory anchor ' +
    '|E97|(690988) = 0.2141254901198318 still does NOT reproduce AT the exact x* under any tested ' +
    'convention combination or either row parameterization (best 0.1081646523386882, 49 percent off), so ' +
    'the residual gap is isolated to the E97 evaluation convention of the paper reference-[19] replay ' +
    '(strict_sub014_extension_v1), which is absent from this machine - a missing input, not an ' +
    'implementation bug. NO scan was run; NO surrogate was substituted; probeVerdict was NOT fed. The REAL ' +
    'oscillation probe (L, sampledSup) remains unmeasured, one committed replay-convention away from ' +
    'decidable. Changes no bound; closes no gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ─────────────
export const IMP95013B_ASSERTIONS = [
  {
    id: 'imp95013b-anchor-literal-consistency',
    description:
      'the carried anchor literal is internally consistent with the paper: Rex - anchor = documented reserve (to 1e-14) and anchor < eq-(20) target < Rex',
    holds: () =>
      Math.abs(REX_EXACT - ANCHOR_GATE_TARGET - RESERVE_DOCUMENTED) < 1e-14 &&
      ANCHOR_GATE_TARGET < 0.27968819555261474 &&
      0.27968819555261474 < REX_EXACT,
  },
  {
    id: 'imp95013b-gate-failed-honestly',
    description: 'every measured witness misses the anchor target by >= 15 percent relative (no near-match was suppressed), and the hunt never crossed it',
    holds: () =>
      CONVENTION_SEARCH_WITNESSES.every(
        (w) => Math.abs(w.absE97 - ANCHOR_GATE_TARGET) / ANCHOR_GATE_TARGET > 0.15
      ) &&
      HUNT_MAX.targetCrossed === false &&
      HUNT_MAX.maxAbsE97 < ANCHOR_GATE_TARGET,
  },
  {
    id: 'imp95013b-bn-t0-decision',
    description: 'the b_n t0-factor decision is decisive: dropping t0 inflates |E97| by ~14 orders of magnitude (imp-95072 transcription correction confirmed)',
    holds: () => {
      const noT0 = CONVENTION_SEARCH_WITNESSES.find((w) => w.convention.includes('no t0'));
      return noT0.absE97 > 1e13 && noT0.absE97 / ANCHOR_GATE_TARGET > 1e13;
    },
  },
  {
    id: 'imp95013b-witness-storage-precision',
    description: 'closest-value literal matches the witness table to storage precision (1e-6 tolerance for 7-sig-fig fields)',
    holds: () => {
      const closest = Math.max(
        ...CONVENTION_SEARCH_WITNESSES.filter((w) => w.absE97 < 1).map((w) => w.absE97)
      );
      return Math.abs(closest - IMP95013B_GATE2_LANE_A_REAL_PROBE.anchorGate.closestValue) < 1e-6;
    },
  },
  {
    id: 'imp95013b-validations-below-gate-tolerance',
    description: 'the evaluator internal error budget (telescope identity, phase cross-check) sits far below the 1e-9-relative anchor tolerance, so the gate failure is not numerical noise',
    holds: () =>
      EVALUATOR_VALIDATIONS.telescopeIdentityMaxErr < 1e-10 &&
      EVALUATOR_VALIDATIONS.phaseCrossCheckVsMpmath < 1e-12 &&
      EVALUATOR_VALIDATIONS.telescopeIdentityMaxErr <
        ANCHOR_MATCH_TOLERANCE_REL * ANCHOR_GATE_TARGET,
  },
  {
    id: 'imp95013b-no-scan-no-surrogate-no-fed-verdict',
    description: 'ticket protocol honored: no scan run against the unanchored evaluator, no surrogate substituted, probeVerdict not fed, and the binary itself refuses to scan',
    holds: () =>
      IMP95013B_GATE2_LANE_A_REAL_PROBE.ranScan === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.emittedProbeMeasurement === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.surrogateSubstitution === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.probeVerdictFed === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.anchorGate.scanRefusedByBinary === true &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.status === 'BLOCKED-ON-CONVENTION',
  },
  {
    id: 'imp95013b-honesty-gate-no-qed',
    description: 'promotes no bound, names the sharpened sub-gap (the [19] replay convention), NO QED, no refereed bound is changed',
    holds: () =>
      IMP95013B_GATE2_LANE_A_REAL_PROBE.promotesBound === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.isRigorous === false &&
      IMP95013B_GATE2_LANE_A_REAL_PROBE.namedSubGap === 'imp-95013b-sub-replay-convention' &&
      /NO QED/.test(IMP95013B_GATE2_LANE_A_REAL_PROBE.verdict) &&
      /refereed bound is changed/i.test(IMP95013B_GATE2_LANE_A_REAL_PROBE.verdict),
  },
  {
    id: 'imp95013b-rev2-xstar-margin-recomputation',
    description:
      'rev 2: the resolved x* geometry is recomputable in-module: X + sqrt(1 - 87677/2500000) - 4*pi*(690988^2 - (129/800)/16) reproduces the stored certified left margin to double precision (~1e-2 at 6e12 magnitude), and the two margins sum to the exact window width 4*pi*(2*690988+1)',
    holds: () => {
      const X = 6000000185827;
      const xStar = X + Math.sqrt(1 - 87677 / 2500000);
      const t = 129 / 800;
      const xN = 4 * Math.PI * (690988 * 690988 - t / 16);
      const left = xStar - xN;
      const width = 4 * Math.PI * (2 * 690988 + 1);
      return (
        // xStar/xN are ~6e12, double ulp ~1e-3: honest tolerance 1e-2
        Math.abs(left - XSTAR_RESOLUTION.marginLeft) < 1e-2 &&
        Math.abs(XSTAR_RESOLUTION.marginLeft + XSTAR_RESOLUTION.marginRight - width) < 1e-2 &&
        // the offset itself is O(1): compare the sqrt directly at ~1e-15
        Math.abs(Math.sqrt(1 - 87677 / 2500000) - XSTAR_RESOLUTION.auditRow.xStarOffset) < 1e-15 &&
        Math.abs(Math.sqrt(1 - 3272481 / 100000000) - XSTAR_RESOLUTION.gate2Row.xStarOffset) < 1e-15
      );
    },
  },
  {
    id: 'imp95013b-rev2-exact-xstar-still-misses',
    description:
      'rev 2: every |E97| witness AT the exact resolved x*, under both rows and all conventions, misses the anchor target by >= 45 percent relative (the gate failure is convention-level, not geometric)',
    holds: () =>
      EXACT_XSTAR_WITNESSES.every(
        (w) => Math.abs(w.absE97 - ANCHOR_GATE_TARGET) / ANCHOR_GATE_TARGET > 0.45
      ) &&
      Math.abs(
        Math.max(...EXACT_XSTAR_WITNESSES.map((w) => w.absE97)) -
          IMP95013B_GATE2_LANE_A_REAL_PROBE.anchorGate.closestAtExactXstar
      ) < 1e-6,
  },
];

for (const a of IMP95013B_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95013b-gate2-lane-a-real-probe assertion failed: ${a.id}`);
  }
}

export default IMP95013B_GATE2_LANE_A_REAL_PROBE;
