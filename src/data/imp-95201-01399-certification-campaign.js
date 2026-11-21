/**
 * imp-95201 - Certification-campaign DESIGN for the unparked 0.1399 stack
 * (Theorem 4.5 / Lemma 4.4, Section 4.10 of the twin-ladder permutation paper).
 * HONEST STATUS: DESIGN ONLY (grade: contract/conditional-design). This module
 * derives no bound, runs no certificate, and closes no gap. NO QED.
 * No refereed bound is changed. Per the no-gain rule and the
 * flow-blindness no-go, nothing here moves the rigorous bound; the campaign
 * below can only reduce the CONDITIONAL frontier (0.1399 stays conditional
 * until BOTH new hypotheses carry sealed certificates).
 *
 * WHAT IS BEING DESIGNED. imp-95012 ROW_01399_DECISION unparked the 0.1399 row
 * as an independent conditional target (it does NOT presuppose the open Gate-2
 * family 690988 <= N <= 54799999). Theorem 4.5: y* = 33/200, t* = 10103/80000,
 * t* + y*^2/2 = 1399/10000 = 0.1399, from two new hypotheses:
 *   (a) rectangular slab (Lemma 4.4): H_tau(u+iv) != 0 on
 *       [X, X+1] x [y*, 1] x [0, t*]   (slab lane, imp-95046), and
 *   (b) directed final-time tail: H_{t*}(x+iv) != 0 for x >= X+1,
 *       y* <= v <= sqrt(1 - 2 t*)      (tail lane, imp-95047).
 * This module designs the certification campaign: the transfer ledger from the
 * existing 0.1787854/0.1758354 machinery, the genuinely new work, per-task
 * compute-scale estimates, failure criteria, and a ranked first computation.
 *
 * THE REFERENCE CLOSURE (how the 0.1787854 v3 package closed ITS final-time
 * half-strip -- the template the 0.1399 tail must re-parametrize). The v3
 * package (review-01787854-v3, commit 2e9976c4) certified
 *   H_{129/800}(x+iy) != 0  for x >= x0 = 4*pi*(690988^2 - 129/12800),
 *   sqrt(87677/2500000) <= y <= sqrt(271/400)
 * by a THREE-PIECE decomposition:
 *   piece 1 - compact slab: 883-prism Arb barrier on [X,X+1] x [0.1809,1] x
 *             [0, 129/800], fail-closed strict comparisons, whole-prism time
 *             control, t=0 endpoint argument, min strict margin 0.5198...;
 *   piece 2 - finite lane: 3,149,013 rows, N = 690988..3840000, no gaps, exact
 *             window landmark map xN = 4*pi*N^2 - pi*t/4 (lemma_sweep_p235711.c
 *             producer), full GH-Actions replay against the sealed image;
 *   piece 3 - all-N tail: verify_tail_arb.c endpoint-cap / exact-convolution
 *             certificate for ALL N >= N1 = 3840000 (36/36 strict Arb gates at
 *             256 and 512 bits), contraction 0.9997209... < 1 with slack only
 *             1.735e-4 -- the semi-infinite x-range is closed by finitely many
 *             checks because the bound is monotone in N.
 * The 0.1758354 four-gate package reused the same conventions and extended its
 * finite lane to N* = 6e6 to close its tail gate D < 1.
 *
 * WHY THE 0.1399 TAIL IS GENUINELY NEW (not a replay). Every constant moves
 * the wrong way relative to the reference closure: t* = 0.1262875 < 129/800 =
 * 0.16125 (less heat mollification, so the endpoint-cap contraction weakens --
 * and the v3 slack was already only 1.735e-4); band bottom y* = 0.165 sits
 * BELOW both certified bottoms (0.1809 slab edge, 0.187272 half-strip edge);
 * band top sqrt(1-2t*) = 0.864537 sits ABOVE the v3 top sqrt(271/400) =
 * 0.823103. The band is new territory at both ends and the whole certificate
 * must be re-derived, not transferred. That is why the ranked FIRST computation
 * is the cheap tail-repricing probe: it prices the dominant cost (the finite
 * transition lane row count N1*(t*, y*) - 690988) and tests the two hardest
 * failure criteria before any heavy spend.
 *
 * GRADES. Everything below is contract/conditional-design; the only
 * measurements are exact rational/float arithmetic derived from frozen
 * literals (asserted). No task output is claimed. NO QED.
  *
 * T-P1 OUTCOME (2026-09-09, imp-95206, Arb 320/512-bit fail-closed): K1 CLEAR
 * (the endpoint-cap contraction closes at t* - the architecture is analytically
 * alive; D monotone 11.89@690989 -> 0.149@1e10) but K2 FIRES decisively:
 * N1* = 220,495,706 - 4.01x the ~5.5e7 economic cutoff line, T2b = 219,804,718
 * rows = 69.8x the v3 replay. The VERBATIM 0.1399 lane is economically dead;
 * T2a/T2b PARK. Unpriced residual outs: mollifier re-optimization at t*
 * (Mmax*AB = 0.4976 and TR = 0.3310 dominate D at N1*), a genuinely new tail
 * estimate, or a later-t* row.
 */

import { ROW_01399_DECISION, GATE2_ROW } from './imp-95012-gate2-frozen-spec.js';

// ── frozen coordinates and derived arithmetic ────────────────────────────────
const T_STAR = ROW_01399_DECISION.tStar.value; // 10103/80000 = 0.1262875
const Y_STAR = ROW_01399_DECISION.yStar.value; // 33/200 = 0.165
const X = GATE2_ROW.X; // 6000000185827
const BETA_STAR = Math.sqrt(1 - 2 * T_STAR); // 0.864537449...

export const COORDS_01399 = Object.freeze({
  X,
  tStar: T_STAR,
  yStar: Y_STAR,
  betaStar: BETA_STAR,
  target: T_STAR + (Y_STAR * Y_STAR) / 2, // 1399/10000
  // Lemma 4.4 admissibility: y*^2 + 2 t* < 1 (equals 2 * target = 0.2798)
  lemma44Constraint: Y_STAR * Y_STAR + 2 * T_STAR,
  // Lemma 4.4 short final join: the slab supplies the final-time segment from
  // X + sqrt(1 - y*^2) through X + 1; its length is the seam budget.
  joinSegmentStartOffset: Math.sqrt(1 - Y_STAR * Y_STAR), // 0.9862935...
  joinSegmentLength: 1 - Math.sqrt(1 - Y_STAR * Y_STAR), // 0.0137065...
  // window landmark map (lemma_sweep_p235711.c): xN = 4*pi*N^2 - pi*t/4, so
  // the seam x = X+1 sits at landmark index N ~ 690988 (the v3 anchor).
  landmarkNAtX: 690988,
  initialRatio: (1 + Y_STAR) / 2, // 233/400 = 0.5825
  verifiedHeightTPT: 3000175332800, // X/2 = 3000000092913.5 <= TPT (free input)
});

// ── the reference closure: 0.1787854 v3 final-time half-strip (frozen) ───────
export const REFERENCE_CLOSURE_01787854 = Object.freeze({
  packageTag: 'review-01787854-v3 @ 2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
  t0: { num: 129, den: 800, value: 129 / 800 }, // 0.16125
  y0Squared: { num: 87677, den: 2500000, value: 87677 / 2500000 },
  y0: Math.sqrt(87677 / 2500000), // 0.187272 (half-strip bottom)
  yMax: Math.sqrt(271 / 400), // 0.823103 = sqrt(1 - 2*129/800) (half-strip top)
  lambdaIdentity: 129 / 800 + 87677 / 5000000, // = 0.1787854 exactly
  pieces: Object.freeze([
    Object.freeze({
      key: 'compact_slab',
      what: '883-prism Arb barrier on [X,X+1] x [1809/10000, 1] x [0, 129/800]',
      literals: { prismCount: 883, minStrictMargin: 0.519849894613872, slabYMin: 0.1809 },
    }),
    Object.freeze({
      key: 'finite_lane',
      what: '3,149,013 rows N = 690988..3840000, exact landmark map, GH-Actions sealed replay',
      literals: { firstN: 690988, lastN: 3840000, rowCount: 3149013 },
    }),
    Object.freeze({
      key: 'all_N_tail',
      what: 'verify_tail_arb.c endpoint-cap/exact-convolution certificate for ALL N >= 3840000; 36/36 strict Arb gates at 256+512 bits; semi-infinite x closed by monotonicity in N',
      literals: {
        N1: 3840000,
        gates: 36,
        contractionUpperBound: 0.9997209093887508,
        slackLowerBound: 0.0001735209373337,
      },
    }),
  ]),
  fourGatePackageNote:
    'the 0.1758354 four-gate package reused these conventions and extended its finite lane to N* = 6e6 to close its tail gate D < 1 (linear row-count cost in the tail cutoff)',
});

// ── transfer ledger: what the existing packages hand the 0.1399 campaign ─────
// Assets live in research-inputs/gate2-evaluator-inputs/ (files-only copy of
// the sealed audit repo, commit a74738de) plus the v3 conventions.
export const TRANSFER_LEDGER = Object.freeze([
  Object.freeze({
    asset: 'verify_tail_arb.c',
    transfers:
      'the all-N endpoint-cap / exact-convolution tail architecture: exact rational inputs, ladder exponents sigma1/sigma2 (s_A, s_B), cap/window kernels, fail-closed Arb strict comparisons, >= 256-bit refusal; the semi-infinite -> finite reduction via monotonicity in N',
    reparametrize: '(t, y0^2) = (129/800, 87677/2500000) -> (10103/80000, 1089/40000); re-derive the minimal cutoff N1*(t*, y*)',
  }),
  Object.freeze({
    asset: 'lemma_sweep_p235711.c (+_triangle_stored)',
    transfers:
      'the finite-lane row producer: exact window landmark map xN = 4*pi*N^2 - pi*t/4, explicit gamma_at gamma(x) = exp(0.02y - (y/2) ln(xN/4pi)), shard/seam conventions, bound_constants (sig, modK, modgamma)',
    reparametrize: 'fixed final time t* and band [y*, beta*]; gamma_at and bound_constants must be re-derived at t* (they are t-dependent)',
  }),
  Object.freeze({
    asset: 'verify_uniform_error_01787854.c',
    transfers: 'the G1-confirmed uniform Theorem-1.3 error-evaluation conventions and the conservative 10.50 = 3.58 + 6.92 error coefficient discipline',
    reparametrize: 'error constants re-evaluated on the wider band and earlier t*',
  }),
  Object.freeze({
    asset: 'verify_window_freeze.py',
    transfers: 'half-open window coverage / seam conventions behind the cutoff tensor (no double-count, no gap at shard boundaries)',
    reparametrize: 'same conventions verbatim; note v3 flagged C6/C7 as documentary gates -- the freeze directions still need direct proof review here too',
  }),
  Object.freeze({
    asset: 'v3 compact-slab barrier architecture',
    transfers: '883-prism subdivision scheme, whole-prism time control, analytic quadrature callbacks, t=0 endpoint argument, sealed-replay packaging (SHA256 seal + GH-Actions row replay + container image)',
    reparametrize: 'box lower edge drops 0.1809 -> 0.165 and time top drops 129/800 -> 10103/80000; prism count re-estimated (margin shrinks at the new bottom edge)',
  }),
  Object.freeze({
    asset: 'published zeta-zero height verification',
    transfers: 'the initial condition is FREE: (1+y*)/2 = 233/400 = 0.5825 > 1/2 and X/2 = 3000000092913.5 <= TPT = 3000175332800 -- the same verified height covers the 0.1399 row (imp-95048)',
    reparametrize: 'none',
  }),
  Object.freeze({
    asset: 'Prop 4.3 effective collar + Lean interfaces',
    transfers: 'the collar test M_t|dt| + M_y|dy| < m for endpoint robustness, and formalization/lean-aristotle verified-interface conventions for the criterion-weld reduction (in the four-gate package the y-transfer reduction and Lemma B3 were Lean-checked)',
    reparametrize: 'collar constants (m, M_t, M_y) measured on the new box',
  }),
]);

// ── genuinely new work (not discharged by any existing certificate) ──────────
export const GENUINELY_NEW = Object.freeze([
  Object.freeze({
    key: 'earlier_final_time_tail',
    what: 'the all-N tail at t* = 0.1262875 < 0.16125: less heat mollification weakens the endpoint-cap contraction, whose v3 slack was only 1.735e-4; the minimal cutoff N1*(t*, y*) is unknown and may not exist in this architecture',
  }),
  Object.freeze({
    key: 'band_bottom_below_all_certificates',
    what: 'y* = 0.165 sits below the v3 slab edge 0.1809 and the v3 half-strip bottom 0.187272 -- nonvanishing control in [0.165, 0.1809] is new territory at every x and every tau',
  }),
  Object.freeze({
    key: 'band_top_above_reference',
    what: 'beta* = sqrt(1-2t*) = 0.864537 > v3 top sqrt(271/400) = 0.823103; the top-edge regime (where 1-2tau degenerates) needs its own directed/winding control',
  }),
  Object.freeze({
    key: 'lemma44_quantitative_hypotheses',
    what: 'only the wedge+join CONCLUSION of Lemma 4.4 is transcribed (imp-95012/95046); the quantitative inheritance hypotheses and the seam-join width budget (segment length 1 - sqrt(1-y*^2) ~ 0.01371) must be written and checked',
  }),
  Object.freeze({
    key: 'larger_slab_provenance',
    what: 'the external [20] 492-rectangle FLINT/Arb larger-slab march is an audit target only (explicitly NOT an antecedent); the slab must be independently rebuilt -- no transfer of trust',
  }),
]);

// ── the campaign: tasks, compute scale, failure-criteria wiring ──────────────────────────
// computeScale entries are ESTIMATES keyed to observed v3/four-gate package
// scales (883 prisms; 3,149,013 rows ~ one GH-Actions full-replay campaign;
// 36-gate Arb runs are minutes). Grades: every task is conditional-design.
export const CAMPAIGN_TASKS = Object.freeze([
  Object.freeze({
    id: 'T-P1',
    lane: 'tail (imp-95047)',
    title: 'Tail repricing probe: re-run verify_tail_arb.c at (t*, y*^2) = (10103/80000, 1089/40000)',
    what: 'substitute the exact rationals, re-derive the t-dependent constants, and binary-search the minimal N1* with all 36 gates strict-PASS; each candidate N1 is one 36-gate Arb run',
    transfers: ['verify_tail_arb.c architecture verbatim', 'exact-rational input discipline'],
    genuinelyNew: ['contraction behavior at the earlier t* (v3 slack was 1.735e-4)', 'wider band [0.165, 0.864537]'],
    computeScale: 'minutes per candidate N1 at 320-bit; ~25-step binary search => < 1 core-day; analytic prep (re-derived lambda/kernel constants) dominates at ~1-2 weeks',
    tests: ['K1', 'K2'],
    grade: 'conditional-design',
  }),
  Object.freeze({
    id: 'T1',
    lane: 'slab (imp-95046)',
    title: 'Rectangular-slab Arb march on [X, X+1] x [0.165, 1] x [0, 10103/80000]',
    what: 'independent rebuild (NOT an import of [20]): adaptive prism/rectangle barrier with fail-closed strict comparisons, whole-prism time control, t=0 endpoint argument; bottom-edge margin probe first (single row at v = 0.165) before the full march',
    transfers: ['v3 883-prism conventions', 'verify_uniform_error_01787854.c error discipline', '[20] as a cross-check target only'],
    genuinelyNew: ['bottom edge 0.165 (below every certified margin; v3 min margin 0.5198 was at 0.1809)', 'independent provenance for the [20]-class 492-rectangle march'],
    computeScale: 'reference points: 883 prisms (v3), 492 rectangles ([20]); expect 1e3-1e4 prisms after bottom-edge margin shrink; ~50-500 core-hours at 256-bit',
    tests: ['K3'],
    grade: 'conditional-design',
  }),
  Object.freeze({
    id: 'T2a',
    lane: 'tail (imp-95047)',
    title: 'All-N asymptotic tail certificate at t* (semi-infinite piece)',
    what: 'the monotone-in-N endpoint-cap bound for all N >= N1*, written as a lemma with the Arb run from T-P1 as its finite check; discharges the large_x_asymptotic_certificate requirement of imp-95047',
    transfers: ['verify_tail_arb.c', 'monotonicity-in-N lemma pattern from the v3 tail theorem'],
    genuinelyNew: ['the lemma statement at (t*, y*, beta*)'],
    computeScale: 'analytic, ~2-4 weeks; Arb component already paid by T-P1 (minutes)',
    tests: ['K1'],
    grade: 'conditional-design',
  }),
  Object.freeze({
    id: 'T2b',
    lane: 'tail (imp-95047)',
    title: 'Finite transition lane N = 690989..N1* at fixed t* over [y*, beta*]',
    what: 'the finite piece between the seam x = X+1 and the all-N regime, produced by the lemma_sweep landmark-row machinery at fixed final time with gamma_at/bound_constants re-derived at t*; full sealed replay',
    transfers: ['lemma_sweep_p235711.c producer', 'verify_window_freeze.py seam conventions', 'GH-Actions sealed-replay packaging'],
    genuinelyNew: ['rows at fixed t* over a band wider at both ends than any certified lane', 'row count unknown until T-P1 prices N1*'],
    computeScale: 'linear in N1*: at N1* = 3840000 it is exactly 3,149,012 rows (v3 full-replay class, ~1e3 core-hours); at the four-gate N* = 6e6 it is ~5.3e6 rows; K2 eliminates above the Gate-2-scale line',
    tests: ['K2'],
    grade: 'conditional-design',
  }),
  Object.freeze({
    id: 'T3',
    lane: 'seam (Lemma 4.4)',
    title: 'Quantitative Lemma 4.4 write-up + seam weld at u = X+1',
    what: 'write the inheritance hypotheses (only the conclusion is transcribed), verify the wedge inclusions, and match the short-final-join segment [X + sqrt(1-y*^2), X+1] (length ~0.0137) against the T2b band with half-open no-gap/no-overlap conventions',
    transfers: ['verify_window_freeze.py half-open coverage', 'lemma_sweep shard/seam conventions'],
    genuinelyNew: ['the quantitative join-width budget'],
    computeScale: 'analytic + O(1e2) interval checks; days',
    tests: ['K4'],
    grade: 'conditional-design',
  }),
  Object.freeze({
    id: 'T4',
    lane: 'assembly',
    title: 'Criterion weld + collar + Lean interface + seal',
    what: 'exact Polymath-criterion substitution (Theorem 4.5 assembly), Prop 4.3 collar constants (m, M_t, M_y) on the new box for endpoint robustness, Lean-checked reduction via formalization/lean-aristotle, SHA256-sealed replay package',
    transfers: ['v3 three-hypothesis weld conventions', 'four-gate pattern (y-transfer reduction and Lemma B3 Lean-checked)', 'Prop 4.3 collar'],
    genuinelyNew: ['nothing mathematical; packaging and formal interface only'],
    computeScale: 'no heavy compute; ~2-4 weeks',
    tests: ['K4', 'K5'],
    grade: 'conditional-design',
  }),
]);

// ── failure criteria (fail-closed; each names the lane it eliminates) ────────────────
export const KILL_CRITERIA = Object.freeze([
  Object.freeze({
    id: 'K1',
    statement: 'ARCHITECTURE FAILURE: the endpoint-cap contraction at t* stays >= 1 for every feasible N1 (no N1* exists). The v3 slack was only 1.735e-4 at t = 0.16125, and t* is 0.0349625 earlier, so this is a live risk, not a formality. Eliminates the tail lane in this architecture; the 0.1399 row parks pending a genuinely new tail estimate.',
    kills: 'T2a/T2b',
  }),
  Object.freeze({
    id: 'K2',
    statement: 'ECONOMIC FAILURE: N1*(t*, y*) > ~5.5e7, i.e. the finite transition lane exceeds the Gate-2-family scale (54799999 - 690988 + 1 ~ 5.41e7 rows, >17x the v3 replay). The whole point of Theorem 4.5 is trading the cocycle weld for two delimited tasks; if the tail transition regrows to open-family size the trade loses its advantage.',
    kills: 'T2b',
  }),
  Object.freeze({
    id: 'K3',
    statement: 'MARGIN FAILURE: the slab bottom-edge probe at v = 0.165 shows the strict margin collapsing (adaptive subdivision trending past ~1e6 prisms with no margin floor). The box lower edge is then not certifiable at feasible depth; fallback is raising y* (which raises the target above 0.1399) or retreating to the 0.14 row.',
    kills: 'T1',
  }),
  Object.freeze({
    id: 'K4',
    statement: 'SEAM FAILURE: the quantitative Lemma 4.4 join width (~0.0137 in x, plus the Prop 4.3 collar budget M_t|dt| + M_y|dy| < m) cannot be met by the T1/T2b endpoint enclosures. A gap or overlap at u = X+1 voids the assembly even with both lanes individually green.',
    kills: 'T3/T4',
  }),
  Object.freeze({
    id: 'K5',
    statement: 'HONESTY ELIMINATE (standing): any dependence on the external [20] 492-rectangle march without a full independent rebuild leaves the result an audit target, not a project certificate; and even with all tasks green the outcome is a sealed UNREVIEWED CONDITIONAL-frontier candidate -- it does not move the rigorous Lambda <= 0.2, which binds on verified height (PT-floor audit).',
    kills: 'promotion of any claim',
  }),
]);

// ── ranked first computation ─────────────────────────────────────────────────
export const FIRST_COMPUTATION_RANKING = Object.freeze([
  Object.freeze({
    rank: 1,
    task: 'T-P1',
    why: 'cheapest (< 1 core-day of Arb time) and most informative: one re-parametrized verify_tail_arb.c binary search simultaneously (i) tests the architecture eliminate K1 at the earlier t*, (ii) prices the dominant campaign cost -- T2b rows = N1* - 690988, exactly 3,149,012 at unchanged N1 = 3840000 -- against the economic eliminate K2, and (iii) commits no heavy spend before the two hardest eliminates are checked',
    spec: 'inputs: t in [10103/80000, 10103/80000] (point interval), y*^2 = 1089/40000, band top sqrt(59794/80000); re-derive the t-dependent lambda/kernel constants; binary-search minimal N1* in [690989, 5.5e7] with all 36 gates strict-PASS at >= 320 bits',
  }),
  Object.freeze({
    rank: 2,
    task: 'T1 (bottom-edge probe only)',
    why: 'single-row prism-margin evaluation at v = 0.165 across [X, X+1] x [0, t*] prices the full slab march and tests K3 for ~1 core-hour',
    spec: 'evaluate the v3 barrier integrand margin on a coarse one-row prism sweep at the new bottom edge before committing to the adaptive march',
  }),
  Object.freeze({
    rank: 3,
    task: 'T3 (seam arithmetic note)',
    why: 'free analytic check: write the Lemma 4.4 wedge inclusions and the join-segment budget so T-P1/T1 endpoint conventions are fixed before either heavy run',
    spec: 'exact rational verification of the inclusions in the Lemma 4.4 proof at (y*, t*) plus the half-open seam convention at u = X+1',
  }),
]);

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95201_CAMPAIGN = Object.freeze({
  ticket: 'imp-95201',
  title: '0.1399 stack certification-campaign design (slab + tail lanes)',
  proofSection: 'S-frontier / Theorem 4.5 campaign design',
  source:
    'imp-95012 ROW_01399_DECISION (UNPARK-INDEPENDENT); imp-95046/95047 lane assessments; research-inputs/gate2-evaluator-inputs/ (sealed-audit copy, commit a74738de); newman-lambda-01787854-candidate v3 literals; four-gate 0.1758354 package conventions',
  grade: 'contract/conditional-design',
  coords: COORDS_01399,
  referenceClosure: REFERENCE_CLOSURE_01787854,
  transferLedger: TRANSFER_LEDGER,
  genuinelyNew: GENUINELY_NEW,
  tasks: CAMPAIGN_TASKS,
  killCriteria: KILL_CRITERIA,
  firstComputation: FIRST_COMPUTATION_RANKING,
  provesBound: false,
  isRigorous: false,
  movesRigorousBound: false,
  reducesConditionalFrontierOnly: true,
  verdict:
    'DESIGN ONLY: a certification campaign for the unparked 0.1399 stack. Six ' +
    'transfer-ledger assets (all-N tail architecture, finite-lane producer, uniform-error ' +
    'and window-freeze conventions, slab barrier architecture, free height verification, ' +
    'collar + Lean interfaces) carry over from the 0.1787854/0.1758354 packages; five ' +
    'items are genuinely new (earlier-t* tail, band bottom 0.165, band top 0.8645, ' +
    'quantitative Lemma 4.4, independent slab provenance). Ranked first computation: the ' +
    'tail repricing probe T-P1, which tests failure criteria K1/K2 for under a core-day ' +
    'before any heavy spend. No certificate is run here; derives no bound; closes no ' +
    'gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ────────────
export const IMP95201_CAMPAIGN_ASSERTIONS = [
  {
    id: 'imp95201-target-and-lemma44-admissibility',
    description: 't* + y*^2/2 = 0.1399 and the Lemma 4.4 constraint y*^2 + 2t* = 2*0.1399 = 0.2798 < 1',
    holds: () =>
      Math.abs(COORDS_01399.target - 0.1399) < 1e-12 &&
      Math.abs(COORDS_01399.lemma44Constraint - 0.2798) < 1e-12 &&
      COORDS_01399.lemma44Constraint < 1,
  },
  {
    id: 'imp95201-join-segment-budget',
    description: 'the Lemma 4.4 short final join has length 1 - sqrt(1 - y*^2) in (0.0137, 0.01371)',
    holds: () =>
      COORDS_01399.joinSegmentLength > 0.0137 &&
      COORDS_01399.joinSegmentLength < 0.01371 &&
      Math.abs(COORDS_01399.joinSegmentStartOffset + COORDS_01399.joinSegmentLength - 1) < 1e-15,
  },
  {
    id: 'imp95201-landmark-map-anchors-690988',
    description: 'the seam x = X+1 sits at landmark N = 690988: |4*pi*N^2 - X| < one landmark spacing 8*pi*N',
    holds: () =>
      Math.abs(4 * Math.PI * 690988 ** 2 - X) < 8 * Math.PI * 690988,
  },
  {
    id: 'imp95201-v3-halfstrip-identities',
    description: 'v3 reference: 129/800 + 87677/5000000 = 0.1787854 exactly, and its half-strip top sqrt(271/400) equals sqrt(1 - 2*129/800)',
    holds: () =>
      Math.abs(REFERENCE_CLOSURE_01787854.lambdaIdentity - 0.1787854) < 1e-15 &&
      Math.abs(Math.sqrt(271 / 400) - Math.sqrt(1 - 2 * (129 / 800))) < 1e-15,
  },
  {
    id: 'imp95201-transition-rows-equal-v3-replay',
    description: 'at unchanged N1 = 3840000 the transition lane is 3840000 - 690988 + 1 = 3,149,013 rows -- exactly the v3 finite-replay count (the pricing anchor for T2b)',
    holds: () => 3840000 - 690988 + 1 === 3149013,
  },
  {
    id: 'imp95201-new-territory-at-both-band-ends',
    description: 'y* = 0.165 below both v3 bottoms (0.1809 slab, 0.187272 half-strip); beta* = 0.864537 above the v3 top 0.823103; earlier final time t* < 129/800',
    holds: () =>
      Y_STAR < 0.1809 &&
      Y_STAR < REFERENCE_CLOSURE_01787854.y0 &&
      BETA_STAR > REFERENCE_CLOSURE_01787854.yMax &&
      T_STAR < REFERENCE_CLOSURE_01787854.t0.value &&
      Math.abs(REFERENCE_CLOSURE_01787854.t0.value - T_STAR - 0.0349625) < 1e-12,
  },
  {
    id: 'imp95201-k1-is-live-slack-was-tiny',
    description: 'the v3 tail contraction slack 1.735e-4 is small, so K1 (contraction >= 1 at the earlier t*) is a live eliminate, not a formality',
    holds: () => {
      const tail = REFERENCE_CLOSURE_01787854.pieces[2].literals;
      return (
        tail.contractionUpperBound < 1 &&
        tail.slackLowerBound > 0 &&
        tail.slackLowerBound < 2e-4 &&
        tail.gates === 36
      );
    },
  },
  {
    id: 'imp95201-height-input-free',
    description: 'the initial condition is free: (1+y*)/2 = 233/400 > 1/2 and X/2 <= TPT = 3000175332800',
    holds: () =>
      Math.abs(COORDS_01399.initialRatio - 233 / 400) < 1e-15 &&
      COORDS_01399.initialRatio > 0.5 &&
      X / 2 <= COORDS_01399.verifiedHeightTPT,
  },
  {
    id: 'imp95201-k2-killline-pricing',
    description: 'the K2 economic cutoff line (Gate-2-family scale) is > 17x the v3 replay row count',
    holds: () => (54799999 - 690988 + 1) / 3149013 > 17,
  },
  {
    id: 'imp95201-campaign-hygiene',
    description: 'every task is conditional-design with failure-criteria wiring; rank-1 first computation is the tail repricing probe T-P1; verdict carries NO QED and no-refereed-bound-change; no rigorous-bound claim',
    holds: () =>
      CAMPAIGN_TASKS.length === 6 &&
      CAMPAIGN_TASKS.every((t) => t.grade === 'conditional-design' && t.tests.length > 0) &&
      CAMPAIGN_TASKS.every((t) => t.tests.every((k) => KILL_CRITERIA.some((kc) => kc.id === k))) &&
      KILL_CRITERIA.length === 5 &&
      FIRST_COMPUTATION_RANKING[0].rank === 1 &&
      FIRST_COMPUTATION_RANKING[0].task === 'T-P1' &&
      IMP95201_CAMPAIGN.provesBound === false &&
      IMP95201_CAMPAIGN.movesRigorousBound === false &&
      /NO QED/.test(IMP95201_CAMPAIGN.verdict) &&
      /refereed bound is changed/i.test(IMP95201_CAMPAIGN.verdict),
  },
];

for (const a of IMP95201_CAMPAIGN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95201-01399-certification-campaign assertion failed: ${a.id}`);
  }
}

export default IMP95201_CAMPAIGN;
