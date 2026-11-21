/**
 * imp-95210 — W1-CERT envelope pivot: can the window-1 pilot certification
 * move from phase-resolving to ENVELOPE-SCALE subdivision?
 *
 * ANSWER (measured, refutation-grade): NO. The pivot is REFUTED by two
 * independent obstructions, one at the SLACK level and one at the RIGOR
 * level. This module is the honest infeasibility record (the task's
 * fallback deliverable), NOT a certificate. No 'pilotcert' certification
 * run was launched, because the measurements below prove it could not
 * pass regardless of cell count.
 *
 * CONTEXT. The direct interval certifier (native/gate2-interval/
 * cert_window.c, 128-bit Arb centered form with the rigorous x-uniform
 * Lipschitz ledger Lip(pilot) <= 84.769080) needs ~1.115e10 cells at
 * ~1.27 CPU-s per O(N) ball evaluation: ~1.6e5 CPU-days for window 1
 * alone — excluded. The pivot hypothesis: the certified target can be the
 * pilot sup_x sum_j |D_j| < Rex (which |E97| <= sum_j |D_j| makes
 * (H4)-relevant), and the MODULI |D_j| might vary at a slow alias-beat /
 * envelope scale even though the phases turn ~1.86e7 times across the
 * window — allowing 1e4-1e6x fewer, envelope-sized cells.
 *
 * WHAT WAS MEASURED (native/gate2-interval/envprobe.c, built on the
 * validated gate2-lane-a dd evaluator; 49,152 evaluations on 16 fine
 * scans x 1536 points x 0.004 q-unit spacing x both seam charts,
 * anchored at the imp-95205 witnesses + 12 seeded-uniform anchors;
 * cross-validated against eval_fast to 2.9e-14 on every |D_j|, eq-(13)
 * telescope closed to 3.0e-15, 0 containment violations on the exact
 * decomposition below).
 *
 * EXACT STRUCTURE USED (ln-additivity theta_{pn} = theta_p + theta_n):
 *   D_j = A_{<j}(q_p G_j - H_j),  q_p G_j - H_j = o_j + mm_j + rr_j with
 *   o_j  = alias/overhang sum over n in Gset_j, p*n > M
 *          (NARROWBAND: frequency band [ln M, ln pM]/2, width (ln p)/2),
 *   mm_j = amplitude-mismatch chirp over p*n <= M (BROADBAND),
 *   rr_j = q_p RefG_j - RefH_j, the reflected-ladder residual, which does
 *          NOT telescope (BROADBAND).
 *
 * FINDING 1 — SLACK OBSTRUCTION (eliminates every envelope decomposition):
 * the finest modulus-triangle envelope U3 = sum_j |A_{<j}|(|o_j| +
 * |mm_j| + |rr_j|) — which any envelope-scale certificate must bound —
 * has sampled sup 0.3441713029308129 > Rex = 0.2796881955526244, and
 * exceeds Rex on 73 of 24,576 sampled points per chart (0.30%, both
 * charts). The pilot itself passes (sampled sup 0.2437626739528982,
 * 0 exceedances) ONLY through the joint phase cancellation between mm_j
 * and rr_j inside |dr_j + rr_j|. A sampled exceedance is a definitive
 * counterexample: no subdivision of any fineness can certify a bound
 * whose true sup exceeds the target. Coarser triangles are worse
 * (sum U2 = 0.5828 with 14.5% exceedance; static masses sum to 8.043 =
 * 28.8x over Rex). The one sub-Rex split — keeping the broadband pieces
 * JOINT as |o_j| + |mm_j + rr_j| (<= pilot + 2 sum|A||o| ~ 0.266) —
 * does not rescue the pivot: the joint piece varies at phase scale
 * (Finding 2). So every certified target that could live at envelope
 * scale is above Rex, and every sub-Rex target varies at phase scale.
 *
 * FINDING 2 — SCALE/RIGOR OBSTRUCTION (eliminates envelope-sized cells for
 * the undecomposed pilot): the moduli are NOT slow. Measured max
 * |d(sum_j|D_j|)/du| = 2.9466 per q-unit (u; dx = 4*pi*du): the pilot
 * changes by 1% of Rex within 9.49e-4 q-units, which is 78x FINER than
 * one turn of the fastest ladder phase (1/ln M = 0.0744 q-units). |D_25|
 * (p=2) alone moves 74.9% of Rex within a single fastest-phase turn. The
 * broadband pieces drive this: max d|rr_25|/du = 2.889, d|mm_25|/du =
 * 1.264. Only the narrowband alias piece behaves as the envelope
 * hypothesis predicted: |o_j| <= 3.0e-3 with d|o_j|/du <= 0.0029 — but it
 * is the SMALL piece. Large-prime defects are envelope-ish (|D_1|, p=97:
 * 1.1% of Rex per fastest turn) yet contribute little mass; the pilot is
 * dominated by p in {2,3,5,7}, which oscillate at ladder-phase scale.
 *
 * RIGOROUS LEDGER LANDSCAPE (per x-unit, chart 690988; Arb re-derivation
 * pending but double-precision sums here are exact to ~1e-12 relative):
 *   - existing certifier ledger:            84.769080
 *   - alias-decomposed ledger (this work):  44.476493  (1.906x better;
 *     replaces the direct-ladder bulk with overhang+mismatch masses —
 *     genuinely adoptable by the next-phase tiered certifier)
 *   - TRUE measured max derivative:          0.234494  (= 2.9467/(4*pi))
 * The 190x gap between the alias ledger and the true derivative is the
 * sqrt-cancellation of ~7e5-term derivative sums, which NO triangle
 * ledger can capture; and Finding 1 forbids the modulus-decomposition
 * (block-derotation) route that could rigorously see envelopes.
 *
 * FEASIBILITY ARITHMETIC (first-order, from the frozen dry-run
 * 5.573e9 cells/side at ledger 84.769080 and 1.27 CPU-s per O(N) eval):
 *   ledger 84.769  -> 1.115e10 cells, 1.64e5 CPU-days
 *   ledger 44.476  -> 5.85e9  cells,  8.60e4 CPU-days
 *   true 0.2345 (NOT certifiable) -> 3.08e7 cells, 453 CPU-days
 * Even the non-certifiable dream ledger misses the ~2e7-cell / ~2-CPU-day
 * feasibility line (per-cell O(N) ball evaluation at 1.27 s is itself
 * 150x too expensive at that count). Envelope-scale subdivision is
 * therefore infeasible on BOTH axes; the pivot is closed.
 *
 * RESIDUAL OPTIONS (unchanged, now sharpened):
 *  1. Tier-P/B/S batching (the W1-CERT design next phase): keeps the
 *     phase-resolving ~1.1e10 cells but amortizes per-cell cost to ~1e3
 *     ball-ops (~1.1e13 total, inside the design's 1-4e13 budget, below
 *     the 8e13 stop-gate) — the only live path to the window-1
 *     certificate; it can adopt the 44.476 alias ledger for a free 1.9x.
 *  2. G4 chirp-recurrence / supercell Taylor models — same family.
 *  3. Per-packet analytic sup via calculus on amplitude formulas: dead
 *     for the same reason as Finding 1 (any per-packet modulus bound is
 *     an envelope decomposition; its sum already exceeds Rex).
 *  4. Certifying only C2 (|E97|, 30.8% margin): same broadband/rigor
 *     obstruction (ledger 91.49 vs comparable true scales); no shortcut.
 *
 * BYPRODUCT: the fine scan found pilot = 0.2437626739528982 at the
 * imp-95205 witness neighborhood — ABOVE the frozen zoomed sampled sup
 * 0.2437541384450471 (+3.5e-5), further direct evidence that sampled
 * sups underestimate the continuum sup (margin erosion is real but tiny
 * vs the 0.0359 margin).
 *
 * Grade: MEASUREMENT + INFEASIBILITY RECORD (dd, sampled; refutation
 * witnessed at sampled points, which suffices for the negative verdict).
 * Changes no bound; certifies nothing; closes the envelope-pivot lane.
 * NO QED. No refereed bound is changed.
 */

// ── frozen program constants ─────────────────────────────────────────────────
export const REX_EXACT = 0.2796881955526244146123; // paper eq (19)
export const EQ20_THRESHOLD = 0.27968819555261474; // eq (20) downward-rounded
export const W1_N = 690988;
export const WINDOW_WIDTH_U = 2 * W1_N + 1; // 1381977 q-units
export const FASTEST_PHASE_TURN_U = 0.074373; // 1/ln(690988) q-units per turn

// ── the probe run (frozen; native/gate2-interval ./envprobe scan 16 1536 0.004 8 95210) ─
export const ENVELOPE_PROBE_RUN = Object.freeze({
  date: '2026-09-10',
  binary: 'native/gate2-interval/envprobe.c (includes gate2-lane-a/main.c dd evaluator)',
  anchors: 16, // 4 imp-95205 witnesses + 12 seeded-uniform (seed 95210)
  pointsPerAnchor: 1536,
  deltaU: 0.004,
  spanUPerAnchor: 6.14,
  seamSides: 2,
  evaluations: 49152,
  wallSeconds: 123.4,
  threads: 8,
  crossValidationMaxDjDiff: 2.85e-14, // vs eval_fast at 6 points
  maxTelescopeErr: 2.999e-15, // eq-(13) sum_j D_j = E97 closure
  containmentViolations: 0, // |D_j| <= U3_j, U2_j, U2h_j at every point
  lagsU: Object.freeze([0.004, 0.064, 1.024]), // finite-difference scales
});

// ── Finding 1: slack obstruction (sampled, both charts agree to ~3e-6) ───────
export const SLACK_OBSTRUCTION = Object.freeze({
  supPilotSampled: 0.2437626739528982, // sum_j |D_j| — passes Rex
  supSumU3Sampled: 0.3441713029308129, // finest envelope sum_j |A|(|o|+|mm|+|rr|) — EXCEEDS Rex
  supSumU2Sampled: 0.5827654354410845, // coarser envelope — exceeds Rex worse
  supSumU2hSampled: 7.1771069777652743, // static-mass envelope
  sumU1Static: 8.043381602, // fully static triangle bound (28.8x over Rex)
  pointsPerChart: 24576,
  exceedU3PerChart: 73, // sumU3 >= Rex — the refutation witnesses (0.297%)
  exceedU2PerChart: 3576, // 14.5%
  exceedPilotPerChart: 0, // the pilot itself never exceeded Rex (consistent with imp-95205)
  meanPilot: 0.141952,
  meanSumU3: 0.164956,
  verdict:
    'REFUTED at the slack level: every modulus-triangle envelope that separates the broadband pieces ' +
    '(the only splits whose factors could be slowly varying) has sup > Rex at sampled points ' +
    '(witnessed 73/24576 per chart); the pilot passes only through the joint mm+rr phase ' +
    'cancellation, and any sub-Rex split must keep mm+rr joint, which varies at phase scale',
});

// ── Finding 2: measured variation scales (max over both charts) ──────────────
export const MEASURED_SCALES = Object.freeze({
  maxDPilotPerU: Object.freeze([2.946742, 1.531565, 0.1490844]), // at lags 0.004/0.064/1.024 u
  maxDSumU3PerU: Object.freeze([2.921142, 2.356419, 0.2281663]),
  pilotOnePctRexDistanceU: 9.49e-4, // 0.01*Rex / 2.9466
  fastestPhaseTurnU: 0.074373,
  phaseTurnOverEnvelopeRatio: 78.4, // moduli change 1% of Rex 78x FINER than one phase turn
  d25ChangePerFastestTurnFracRex: 0.749, // |D_25| moves 74.9% of Rex within one turn
  d1ChangePerFastestTurnFracRex: 0.0114, // |D_1| (p=97) is the only envelope-ish defect family
  trueMaxDPilotPerX: 0.234494, // 2.9466/(4*pi) — NOT rigorously certifiable
});

// per-defect table (chart 690988; d*PerU at lag 0.004 u, dAbsDperU_1u at lag 1.024 u)
export const PER_DEFECT_SCALES = Object.freeze([
  Object.freeze({ j: 1, p: 97, maxAbsD: 1.072727e-3, dAbsDperU: 0.0429, dAbsDperU_1u: 0.0008, maxO: 1.099e-5, dOperU: 0.0001, maxMm: 3.543e-4, dMmPerU: 0.002, maxRr: 1.105e-3, dRrPerU: 0.0243 }),
  Object.freeze({ j: 2, p: 89, maxAbsD: 1.088109e-3, dAbsDperU: 0.042, dAbsDperU_1u: 0.0008, maxO: 1.257e-5, dOperU: 0.0001, maxMm: 3.639e-4, dMmPerU: 0.0021, maxRr: 1.125e-3, dRrPerU: 0.0246 }),
  Object.freeze({ j: 3, p: 83, maxAbsD: 1.176004e-3, dAbsDperU: 0.0468, dAbsDperU_1u: 0.0008, maxO: 1.539e-5, dOperU: 0.0001, maxMm: 3.708e-4, dMmPerU: 0.0029, maxRr: 1.217e-3, dRrPerU: 0.0259 }),
  Object.freeze({ j: 4, p: 79, maxAbsD: 1.259832e-3, dAbsDperU: 0.0508, dAbsDperU_1u: 0.0008, maxO: 1.796e-5, dOperU: 0.0001, maxMm: 3.889e-4, dMmPerU: 0.0032, maxRr: 1.292e-3, dRrPerU: 0.0276 }),
  Object.freeze({ j: 5, p: 73, maxAbsD: 1.363178e-3, dAbsDperU: 0.0521, dAbsDperU_1u: 0.0011, maxO: 1.972e-5, dOperU: 0.0001, maxMm: 4.275e-4, dMmPerU: 0.0032, maxRr: 1.398e-3, dRrPerU: 0.0288 }),
  Object.freeze({ j: 6, p: 71, maxAbsD: 1.41686e-3, dAbsDperU: 0.0503, dAbsDperU_1u: 0.0011, maxO: 2.102e-5, dOperU: 0.0001, maxMm: 4.664e-4, dMmPerU: 0.0039, maxRr: 1.427e-3, dRrPerU: 0.0299 }),
  Object.freeze({ j: 7, p: 67, maxAbsD: 1.490235e-3, dAbsDperU: 0.0544, dAbsDperU_1u: 0.0012, maxO: 2.316e-5, dOperU: 0.0001, maxMm: 5.351e-4, dMmPerU: 0.0046, maxRr: 1.528e-3, dRrPerU: 0.0308 }),
  Object.freeze({ j: 8, p: 61, maxAbsD: 1.709374e-3, dAbsDperU: 0.0577, dAbsDperU_1u: 0.0015, maxO: 2.75e-5, dOperU: 0.0001, maxMm: 6.331e-4, dMmPerU: 0.0057, maxRr: 1.746e-3, dRrPerU: 0.0356 }),
  Object.freeze({ j: 9, p: 59, maxAbsD: 1.712136e-3, dAbsDperU: 0.0631, dAbsDperU_1u: 0.0014, maxO: 2.831e-5, dOperU: 0.0001, maxMm: 6.116e-4, dMmPerU: 0.0054, maxRr: 1.769e-3, dRrPerU: 0.0356 }),
  Object.freeze({ j: 10, p: 53, maxAbsD: 1.9412e-3, dAbsDperU: 0.073, dAbsDperU_1u: 0.0016, maxO: 3.156e-5, dOperU: 0.0001, maxMm: 7.185e-4, dMmPerU: 0.0069, maxRr: 1.987e-3, dRrPerU: 0.0396 }),
  Object.freeze({ j: 11, p: 47, maxAbsD: 2.141196e-3, dAbsDperU: 0.0749, dAbsDperU_1u: 0.0014, maxO: 3.62e-5, dOperU: 0.0001, maxMm: 7.697e-4, dMmPerU: 0.0082, maxRr: 2.361e-3, dRrPerU: 0.0458 }),
  Object.freeze({ j: 12, p: 43, maxAbsD: 2.379007e-3, dAbsDperU: 0.0788, dAbsDperU_1u: 0.0019, maxO: 4.218e-5, dOperU: 0.0002, maxMm: 9.409e-4, dMmPerU: 0.0083, maxRr: 2.495e-3, dRrPerU: 0.0485 }),
  Object.freeze({ j: 13, p: 41, maxAbsD: 2.552611e-3, dAbsDperU: 0.0844, dAbsDperU_1u: 0.0022, maxO: 4.596e-5, dOperU: 0.0002, maxMm: 1.119e-3, dMmPerU: 0.0077, maxRr: 2.586e-3, dRrPerU: 0.0507 }),
  Object.freeze({ j: 14, p: 37, maxAbsD: 3.064252e-3, dAbsDperU: 0.1121, dAbsDperU_1u: 0.0024, maxO: 5.151e-5, dOperU: 0.0002, maxMm: 1.294e-3, dMmPerU: 0.0099, maxRr: 3.19e-3, dRrPerU: 0.0616 }),
  Object.freeze({ j: 15, p: 31, maxAbsD: 3.47244e-3, dAbsDperU: 0.117, dAbsDperU_1u: 0.0022, maxO: 6.273e-5, dOperU: 0.0002, maxMm: 1.336e-3, dMmPerU: 0.0123, maxRr: 3.764e-3, dRrPerU: 0.0711 }),
  Object.freeze({ j: 16, p: 29, maxAbsD: 3.817074e-3, dAbsDperU: 0.1356, dAbsDperU_1u: 0.0027, maxO: 6.288e-5, dOperU: 0.0003, maxMm: 1.633e-3, dMmPerU: 0.0137, maxRr: 3.975e-3, dRrPerU: 0.0742 }),
  Object.freeze({ j: 17, p: 23, maxAbsD: 4.800461e-3, dAbsDperU: 0.1457, dAbsDperU_1u: 0.0042, maxO: 6.351e-5, dOperU: 0.0003, maxMm: 1.809e-3, dMmPerU: 0.0168, maxRr: 5.104e-3, dRrPerU: 0.0951 }),
  Object.freeze({ j: 18, p: 19, maxAbsD: 5.893143e-3, dAbsDperU: 0.1716, dAbsDperU_1u: 0.0032, maxO: 7.357e-5, dOperU: 0.0003, maxMm: 2.349e-3, dMmPerU: 0.0219, maxRr: 6.278e-3, dRrPerU: 0.1166 }),
  Object.freeze({ j: 19, p: 17, maxAbsD: 6.782201e-3, dAbsDperU: 0.2032, dAbsDperU_1u: 0.0048, maxO: 8.536e-5, dOperU: 0.0004, maxMm: 2.958e-3, dMmPerU: 0.0251, maxRr: 7.596e-3, dRrPerU: 0.1343 }),
  Object.freeze({ j: 20, p: 13, maxAbsD: 9.331139e-3, dAbsDperU: 0.2571, dAbsDperU_1u: 0.0064, maxO: 9.593e-5, dOperU: 0.0004, maxMm: 4.14e-3, dMmPerU: 0.0363, maxRr: 1.008e-2, dRrPerU: 0.1694 }),
  Object.freeze({ j: 21, p: 11, maxAbsD: 1.130953e-2, dAbsDperU: 0.3471, dAbsDperU_1u: 0.0084, maxO: 1.609e-4, dOperU: 0.0005, maxMm: 6.041e-3, dMmPerU: 0.0551, maxRr: 1.279e-2, dRrPerU: 0.1882 }),
  Object.freeze({ j: 22, p: 7, maxAbsD: 1.913336e-2, dAbsDperU: 0.6166, dAbsDperU_1u: 0.0129, maxO: 3.122e-4, dOperU: 0.0008, maxMm: 1.178e-2, dMmPerU: 0.1133, maxRr: 2.211e-2, dRrPerU: 0.3123 }),
  Object.freeze({ j: 23, p: 5, maxAbsD: 2.951657e-2, dAbsDperU: 0.9491, dAbsDperU_1u: 0.0231, maxO: 4.966e-4, dOperU: 0.0011, maxMm: 2.172e-2, dMmPerU: 0.2268, maxRr: 3.568e-2, dRrPerU: 0.5875 }),
  Object.freeze({ j: 24, p: 3, maxAbsD: 5.972448e-2, dAbsDperU: 2.167, dAbsDperU_1u: 0.0413, maxO: 1.331e-3, dOperU: 0.0021, maxMm: 5.14e-2, dMmPerU: 0.5927, maxRr: 7.236e-2, dRrPerU: 0.8518 }),
  Object.freeze({ j: 25, p: 2, maxAbsD: 1.19357e-1, dAbsDperU: 2.8172, dAbsDperU_1u: 0.0997, maxO: 2.966e-3, dOperU: 0.0029, maxMm: 1.051e-1, dMmPerU: 1.2641, maxRr: 1.844e-1, dRrPerU: 2.8893 }),
]);

// ── rigorous ledger landscape + feasibility arithmetic ───────────────────────
export const LEDGERS_PER_X = Object.freeze({
  existingCertifier: 84.76908, // cert_window.c 128-bit Arb ledger (frozen)
  aliasDecomposed: 44.476493, // this work: overhang+mismatch replace the direct bulk (rigorous, adoptable)
  trueMeasuredMax: 0.234494, // NOT certifiable — the 190x gap is derivative sqrt-cancellation
});

export const FEASIBILITY = Object.freeze({
  dryRunCellsPerSideAtOldLedger: 5.573e9, // frozen cert_window dry-run (128 bits)
  perCellCpuSeconds: 1.27, // direct O(N) arb evaluation
  feasibilityLineCells: 2e7, // ~2 CPU-days at ~8.6 ms/cell (task budget)
  scenarios: Object.freeze([
    Object.freeze({ ledger: 84.76908, cellsTotal: 1.115e10, cpuDays: 1.64e5, certifiable: true }),
    Object.freeze({ ledger: 44.476493, cellsTotal: 5.848e9, cpuDays: 8.6e4, certifiable: true }),
    Object.freeze({ ledger: 0.234494, cellsTotal: 3.084e7, cpuDays: 453, certifiable: false }),
  ]),
  verdict:
    'INFEASIBLE on both axes: the only rigorous ledgers give 5.8e9-1.1e10 cells (8.6e4-1.6e5 CPU-days); ' +
    'even the non-certifiable true-derivative dream gives 3.1e7 cells = 453 CPU-days at O(N) per cell, ' +
    '226x over the ~2-CPU-day budget; and Finding 1 independently blocks every envelope-decomposed target',
});

export const RESIDUAL_OPTIONS = Object.freeze([
  'tier-P/B/S batching (W1-CERT design next phase): ~1.1e10 phase-resolving cells at ~1e3 ball-ops/cell ' +
    '= ~1.1e13 ball-ops, inside the 1-4e13 design budget and below the 8e13 stop-gate; can adopt the ' +
    '44.476 alias ledger for a free 1.9x cell reduction — the only live path',
  'G4 chirp-recurrence / supercell Taylor models (same family as tier-P/B/S)',
  'per-packet analytic sup: DEAD (any per-packet modulus bound is an envelope decomposition; Finding 1)',
  'C2-only (|E97|, 30.8% margin): same broadband obstruction (ledger 91.49), no shortcut',
]);

export const IMP95210_W1_PILOT_CERTIFICATE = Object.freeze({
  ticket: 'imp-95210-window1-pilot-certificate',
  lane: 'W1-CERT envelope pivot (archive-free Gate lane, window 1 only)',
  pivotRefuted: true,
  certificateProduced: false,
  pilotcertModeImplemented: false, // deliberately: the mode provably could not pass (Finding 1)
  certificationRunLaunched: false,
  cpuHoursSpentOnInfeasibility: 0.7, // 2x 49,152 dd evals + masses, well under the 2 CPU-h cap
  newSampledPilotSup: 0.2437626739528982, // > imp-95205's 0.2437541384450471 (+3.5e-5, zoom-underestimate evidence)
  imp95205SampledPilotSup: 0.2437541384450471,
  verdict:
    'ENVELOPE PIVOT REFUTED: (1) slack obstruction — every modulus-triangle envelope that separates ' +
    'the broadband pieces exceeds Rex at sampled points (sup sumU3 = 0.34417 > Rex, 73/24576 ' +
    'witnesses per chart), so the certified target must keep mm+rr joint; (2) scale obstruction — ' +
    'every sub-Rex target (the pilot itself, or the o | mm+rr split) varies at phase scale: the pilot ' +
    'modulus changes 1% of Rex within 9.5e-4 q-units, 78x finer than one fastest-phase turn, driven by ' +
    'the broadband mismatch and reflected-residual pieces; only the narrowband alias/overhang piece ' +
    '(|o_j| <= 3e-3, d/du <= 0.003) is envelope-scale, and it is the small one. Byproduct kept: the ' +
    'rigorous alias-decomposed Lipschitz ledger 44.476/x (vs 84.769) for the tiered certifier. ' +
    'Measurement + infeasibility record only; certifies nothing; changes no bound; NO QED; ' +
    'no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95210_W1CERT_ASSERTIONS = [
  {
    id: 'imp95210w1-slack-obstruction-witnessed',
    description:
      'the refutation is witnessed: the finest envelope sum U3 exceeds Rex at sampled points while the pilot itself stays below Rex (containment held at every point, so U3 >= pilot pointwise makes the ordering coherent)',
    holds: () =>
      SLACK_OBSTRUCTION.supSumU3Sampled > REX_EXACT &&
      SLACK_OBSTRUCTION.supPilotSampled < REX_EXACT &&
      SLACK_OBSTRUCTION.exceedU3PerChart > 0 &&
      SLACK_OBSTRUCTION.exceedPilotPerChart === 0 &&
      ENVELOPE_PROBE_RUN.containmentViolations === 0 &&
      SLACK_OBSTRUCTION.supSumU3Sampled > SLACK_OBSTRUCTION.supPilotSampled &&
      SLACK_OBSTRUCTION.supSumU2Sampled > SLACK_OBSTRUCTION.supSumU3Sampled &&
      SLACK_OBSTRUCTION.supSumU2hSampled > SLACK_OBSTRUCTION.supSumU2Sampled &&
      SLACK_OBSTRUCTION.sumU1Static > SLACK_OBSTRUCTION.supSumU2hSampled,
  },
  {
    id: 'imp95210w1-envelope-scale-arithmetic',
    description:
      'the 1%-of-Rex distance and phase-turn comparison recompute from the frozen derivative and ln(690988): the moduli vary ~78x FINER than one fastest-phase turn (envelope hypothesis fails), and |D_25| moves ~75% of Rex per turn',
    holds: () => {
      const turnU = 1 / Math.log(W1_N);
      const distU = (0.01 * REX_EXACT) / MEASURED_SCALES.maxDPilotPerU[0];
      const ratio = turnU / distU;
      const d25 = PER_DEFECT_SCALES[24].dAbsDperU * turnU;
      return (
        Math.abs(turnU - MEASURED_SCALES.fastestPhaseTurnU) < 1e-6 &&
        Math.abs(distU - MEASURED_SCALES.pilotOnePctRexDistanceU) < 1e-6 &&
        Math.abs(ratio - MEASURED_SCALES.phaseTurnOverEnvelopeRatio) < 0.1 &&
        ratio > 50 &&
        Math.abs(d25 / REX_EXACT - MEASURED_SCALES.d25ChangePerFastestTurnFracRex) < 1e-3 &&
        PER_DEFECT_SCALES[0].dAbsDperU * turnU / REX_EXACT < 0.02
      );
    },
  },
  {
    id: 'imp95210w1-narrowband-piece-is-the-small-one',
    description:
      'the alias/overhang piece is genuinely envelope-scale (slow AND small) at every j: |o_j| and d|o_j|/du are at least an order below the broadband |rr_j| and d|rr_j|/du',
    holds: () =>
      PER_DEFECT_SCALES.length === 25 &&
      PER_DEFECT_SCALES.every(
        (r) => r.maxO < 0.05 * r.maxRr + 1e-12 && r.dOperU < 0.05 * r.dRrPerU + 1e-12
      ) &&
      PER_DEFECT_SCALES.every((r) => r.dOperU <= 0.003),
  },
  {
    id: 'imp95210w1-feasibility-arithmetic',
    description:
      'the cell/CPU scenarios recompute first-order from the frozen dry-run (cells scale with the ledger; CPU-days = cells * 1.27 s / 86400), and even the non-certifiable true-derivative scenario misses the 2e7-cell feasibility line',
    holds: () => {
      const base = FEASIBILITY.dryRunCellsPerSideAtOldLedger;
      const l0 = LEDGERS_PER_X.existingCertifier;
      return FEASIBILITY.scenarios.every((s) => {
        const cells = 2 * base * (s.ledger / l0);
        const days = (cells * FEASIBILITY.perCellCpuSeconds) / 86400;
        return (
          Math.abs(cells - s.cellsTotal) / s.cellsTotal < 5e-3 &&
          Math.abs(days - s.cpuDays) / s.cpuDays < 5e-3 &&
          s.cellsTotal > FEASIBILITY.feasibilityLineCells
        );
      });
    },
  },
  {
    id: 'imp95210w1-alias-ledger-real-but-insufficient',
    description:
      'the alias-decomposed ledger is a real rigorous improvement (44.476 < 84.769, a 1.906x cell reduction) yet stays 150x+ above the measured true derivative 0.2345 = 2.9466/(4 pi)',
    holds: () =>
      LEDGERS_PER_X.aliasDecomposed < LEDGERS_PER_X.existingCertifier &&
      Math.abs(LEDGERS_PER_X.existingCertifier / LEDGERS_PER_X.aliasDecomposed - 1.906) < 5e-3 &&
      Math.abs(MEASURED_SCALES.maxDPilotPerU[0] / (4 * Math.PI) - LEDGERS_PER_X.trueMeasuredMax) < 1e-5 &&
      LEDGERS_PER_X.aliasDecomposed / LEDGERS_PER_X.trueMeasuredMax > 150,
  },
  {
    id: 'imp95210w1-sampled-sup-erosion-byproduct',
    description:
      'the fine scan found a pilot value above the imp-95205 zoomed sampled sup (sampled sups underestimate the continuum sup), and both stay below Rex',
    holds: () =>
      IMP95210_W1_PILOT_CERTIFICATE.newSampledPilotSup >
        IMP95210_W1_PILOT_CERTIFICATE.imp95205SampledPilotSup &&
      IMP95210_W1_PILOT_CERTIFICATE.newSampledPilotSup < REX_EXACT &&
      IMP95210_W1_PILOT_CERTIFICATE.newSampledPilotSup -
        IMP95210_W1_PILOT_CERTIFICATE.imp95205SampledPilotSup < 1e-4,
  },
  {
    id: 'imp95210w1-honesty-gate-no-certificate-no-qed',
    description:
      'fail-closed honesty: pivotRefuted, no certificate produced, no pilotcert run launched, under the 2 CPU-hour infeasibility cap, NO QED and no-refereed-bound-change stated',
    holds: () =>
      IMP95210_W1_PILOT_CERTIFICATE.pivotRefuted === true &&
      IMP95210_W1_PILOT_CERTIFICATE.certificateProduced === false &&
      IMP95210_W1_PILOT_CERTIFICATE.certificationRunLaunched === false &&
      IMP95210_W1_PILOT_CERTIFICATE.cpuHoursSpentOnInfeasibility < 2 &&
      /NO QED/.test(IMP95210_W1_PILOT_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(IMP95210_W1_PILOT_CERTIFICATE.verdict) &&
      RESIDUAL_OPTIONS.length === 4 &&
      /only live path/.test(RESIDUAL_OPTIONS[0]),
  },
];

for (const a of IMP95210_W1CERT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95210-window1-pilot-certificate assertion failed: ${a.id}`);
  }
}

export default IMP95210_W1_PILOT_CERTIFICATE;
