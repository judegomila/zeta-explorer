/**
 * imp-95213 — tier-P/B/S window-1 certifier: BUILD + PRICE + SMALL-SLICE
 * VALIDATION (the ONE live certification path for the Gate-2 first window
 * after the imp-95210 envelope-pivot refutation). The full-window run is a
 * SEPARATE decision and was NOT launched.
 *
 * WHAT WAS BUILT (native/gate2-interval/tier_cert.c, includes
 * cert_window.c whose eval_point was split so the shared assembly stage
 * eval_from_class_sums — prime phasors, A97 product, E97, eq-(13)
 * telescope + per-eval gate — is reused verbatim by the tiered path):
 *
 *  Tier B (ball/ledger, cheap, most of the window): rigorous degree-D
 *    TAYLOR PANEL MODELS. One O(N) Arb pass per panel computes degree-80
 *    Taylor coefficients of all 52 class-sum series ScR_c = sum P_n
 *    cos(nu_n x), ScI_c = sum Q_n sin(nu_n x) at the panel center, with
 *    the exact Lagrange remainder |R_c| <= (sum_c |amp| nu^{D+1})
 *    h^{D+1}/(D+1)! from per-class masses computed once per chart in Arb
 *    (total remainder target 1e-14 sizes the half-width h = 3.1392
 *    x-units at D = 80). Cells then cost ~4.3e3 ball-ops (arb_dot Horner
 *    + 25 prime arb_sin_cos + assembly) instead of ~7e5 arb_sin_cos.
 *    Cell criterion: ub(f(center)) + ub(L)*ub(halfwidth_x) < lb(eq-20
 *    threshold), with L = the ADOPTED alias-decomposed pilot ledger
 *    (re-derived rigorously in Arb: 44.476493/x side 0, matches the
 *    imp-95210 envprobe doubles to 1e-8; 1.906x below the direct 84.769)
 *    and the existing Lip(E97) <= 91.492. Adaptive bisection on failure.
 *  Tier P (phase-resolving, near-sup safety net): at max depth/min width
 *    a cell gets ONE direct O(N) eval_point ball evaluation, and the
 *    certified target falls back to |E97| < threshold DIRECT (sum|D_j|
 *    was only ever a sufficient pilot; G3 semantics: a pilot cell failure
 *    is a stop signal, not disproof of the recombined gate). Tier P
 *    NEVER FIRED on the validated slices.
 *  Tier S (seam/special): the closed range is certified on BOTH seam
 *    charts M in {690988, 690989} (structural), and the o_j narrowband
 *    derotated-Lipschitz machinery the probe validated is carried as the
 *    Arb lip2Derot ledger. MEASURED TIER-S VERDICT: derotation buys only
 *    44.476/39.812 = 1.117x on cells while the split-value static
 *    overhang penalty 2*0.6765 = 1.353 EXCEEDS Rex, and panels (not
 *    cells) are 97% of the cost — the per-cell o_j split is priced OFF
 *    the critical path (consistent with imp-95210 Finding 1).
 *
 * VALIDATION (all gates green):
 *  - 30 seeded points (seed 95213; pilot witness + |E97| witness + seam
 *    + 27 random, deliberately OFF-CENTER panels so Horner + remainder
 *    are exercised): the Taylor ball CONTAINED the direct Arb ball
 *    (radius ~1e-33) in all 54 components per point (pilot, |E97|,
 *    E97 re/im, 50 defect components) — 30/30, 0 failures.
 *  - dd cross-validation (tier_validate_dd.py vs gate2-lane-a `point`):
 *    30/30 within ball + 1e-12 dd allowance; max deviation 8.7e-16 on
 *    |E97|, 3.4e-14 on the pilot, 2.3e-14 per defect — the dd lane's own
 *    documented error profile.
 *  - eq-(13) telescope gate checked at EVERY evaluation (abort on
 *    violation): max telescope radius 4.0e-14 across all 7.5e6 slice
 *    evaluations; max ball radius 2.1e-14 (= the panel remainder budget).
 *
 * SLICE RESULT — the program's FIRST CONTINUUM-CERTIFIED statement:
 *    for EVERY u in [73222.5, 74022.5] (closed; 800 q-units on the
 *    hardest stretch, containing the |E97| sup witness w = 0.053273,
 *    inside the task's w in [0.05, 0.06]) and BOTH seam charts:
 *      sum_j |D_j(x(u))| < 0.27968819555261474  and
 *      |E97(x(u))|       < 0.27968819555261474  (both < Rex),
 *    certified by outward-rounded balls + rigorous x-uniform ledgers:
 *    6,704,304 Taylor cells, 0 failures, 0 Tier-P escalations, 0
 *    unprocessed. Scope honesty: 800 of 1,381,977 q-units = 0.058% of
 *    window 1; 54,109,011 windows beyond window 1 untouched.
 *
 * PRICE (measured on the hardest stretch, panel-dominated so robust):
 *    0.9408 CPU-s/x-unit (pilot+E97) / 0.9328 (|E97|-only) at degree 80,
 *    128 bits => FULL WINDOW (3.473e7 x-units, both charts):
 *      pilot + |E97| target: 378 CPU-days  (433.6x below the 1.64e5
 *        CPU-day direct baseline — the required ~100x beat is exceeded)
 *      |E97|-only target:    375 CPU-days  (437.3x)
 *      panel-only floor:     368 CPU-days  (97.4% of cost is the
 *        per-panel O(N) pass; cell count is nearly free)
 *    ~47 wall-days at 8 threads. Ball-ops at the measured mix: 1.01e15
 *    for the full window — ~92x ABOVE the two-level W1-CERT design
 *    estimate of 1.1e13 (the frequency-bin/chirp second level that
 *    amortizes the panel pass is the identified residual 10-100x lever,
 *    NOT built here). Honest note: the slice sits at the |E97| sup, so
 *    its cell density is above the window mean; since cells are 2.6% of
 *    cost, the extrapolation error from this is < 3%.
 *
 * Grade: BUILD rigorous + VALIDATED; slice = CERTIFICATE (sub-range,
 * continuum, both charts); price = MEASUREMENT + extrapolation. A
 * sub-range run can never set the window promotion flag (G5). Changes no
 * bound; promotes nothing; NO QED. No refereed bound is changed.
 */

// ── frozen program constants ─────────────────────────────────────────────────
export const REX_EXACT = 0.2796881955526244146123; // paper eq (19)
export const EQ20_THRESHOLD = 0.27968819555261474; // eq (20) downward-rounded
export const W1_N = 690988;
export const WINDOW_WIDTH_U = 2 * W1_N + 1; // 1381977 q-units
export const FULL_WINDOW_X_BOTH_SIDES = 34732870.325; // 2 * 4pi * (2N+1)

// ── build record ─────────────────────────────────────────────────────────────
export const TIER_BUILD = Object.freeze({
  ticket: 'imp-95213-tier-certifier-build',
  date: '2026-09-10',
  binary: 'native/gate2-interval/tier_cert.c (includes cert_window.c; new shared eval_from_class_sums assembly stage)',
  validationDriver: 'native/gate2-interval/tier_validate_dd.py',
  degree: 80,
  prec: 128,
  phasePrec: 192,
  remainderTarget: 1e-14,
  panelHalfWidthX: Object.freeze([3.13921211, 3.139211792]), // per side, degree 80
  panelWidthU: Object.freeze([0.499621125, 0.499621074]),
  panelBuildSeconds: 4.98, // one O(N) Arb pass (~6.9e5 arb_sin_cos + 3D madds/n)
  cellEvalSecondsMeasured: 7.45e-5, // 249.9 s / 3.35e6 cells (arb_dot Horner)
  tierPImplemented: true,
  tierPFiredOnSlices: 0,
  compile: 'clang -O2, zero warnings, FLINT/Arb 3.x',
});

// ── the adopted rigorous ledger (Arb upper bounds, per x-unit) ───────────────
export const TIER_LEDGER = Object.freeze({
  // alias-decomposed Lip(pilot) — imp-95210 byproduct, re-derived in Arb
  lipAliasArb: Object.freeze([44.476492698, 44.476477312]),
  lipAliasFrozenDoubles: Object.freeze([44.476493, 44.476477]), // envprobe masses
  lipPilotOld: Object.freeze([84.76908, 84.769033]), // direct-ladder ledger
  lipE97: Object.freeze([91.492276, 91.492222]), // unchanged (C2 metric)
  cellReductionVsOld: 1.9059, // 84.769080 / 44.476492698
  // Tier-S diagnostics (measured verdict: OFF the critical path)
  lip2DerotArb: Object.freeze([39.811544553, 39.811524713]),
  staticOverhangArb: Object.freeze([0.676493918, 0.676494499]),
  tierSVerdict:
    'derotated overhang ledger buys only 44.476/39.812 = 1.117x on cell count while the ' +
    'split-target static penalty 2*0.6765 = 1.353 exceeds Rex, and panels are 97% of the ' +
    'measured cost: the per-cell o_j split is priced off the critical path; Tier S stays as ' +
    'both-seam-chart certification + this frozen record',
});

// ── validation record ────────────────────────────────────────────────────────
export const TIER_VALIDATION = Object.freeze({
  internal: Object.freeze({
    points: 30,
    seed: 95213,
    containmentFailures: 0, // Taylor ball contains direct Arb ball, 54 components/point
    maxMidDevPilot: 0.0, // Taylor and direct midpoints agree below print granularity
    maxTaylorRad: 1.27e-14,
    maxTelescopeRad: 3.205e-14,
  }),
  ddCross: Object.freeze({
    points: 30,
    failures: 0,
    maxDevAbsE97: 8.723490679818369e-16,
    maxDevPilot: 3.447242491461111e-14,
    maxDevDefect: 2.310651670001107e-14,
    maxTaylorRad: 1.445e-14,
    ddTol: 1e-12, // the dd lane's documented error allowance
  }),
  degreeSensitivity: Object.freeze([
    Object.freeze({ degree: 40, hX: 1.109860926, cpuSecPerXUnit: 1.4272, fullWindowCpuDays: 573.7 }),
    Object.freeze({ degree: 80, hX: 3.13921211, cpuSecPerXUnit: 1.0017, fullWindowCpuDays: 402.7 }),
    Object.freeze({ degree: 112, hX: 4.847917888, cpuSecPerXUnit: 0.9686, fullWindowCpuDays: 389.4 }),
  ]), // micro-slice measurements; degree 80 kept (headroom + within 4% of best)
});

// ── the certified slice (metric = both, the hardest stretch) ─────────────────
export const CERTIFIED_SLICE = Object.freeze({
  output: 'native/gate2-interval/tier-slice-main-95213.json',
  uLo: 73222.5,
  uHi: 74022.5, // closed cover, 800 q-units
  wLo: 0.052983877445138376,
  wHi: 0.05356275828034765, // inside the task's [0.05, 0.06]
  containsE97SupWitness: true, // u = 73622.5117 (w = 0.053273326334, chart 690989)
  sides: 2, // BOTH seam charts (Tier S structural)
  metric: 'both',
  threads: 7,
  degree: 80,
  prec: 128,
  perSide: Object.freeze([
    Object.freeze({
      side: 0, chartM: 690988, panels: 1602, cellsTaylor: 3352149, cellsTierP: 0,
      tierB0: 1877689, tierBsub: 981867, tierP: 0,
      failPilot: 0, failE97: 0, pilotGapCells: 0, unprocessedPanels: 0,
      certifiedSupUbPilot: 0.2796880929624877,
      certifiedSupUbE97: 0.2796881861835746,
      maxBallRad: 2.09e-14, maxTelescopeRad: 3.97e-14,
      panelCpuSeconds: 9187.0, cellCpuSeconds: 249.9,
    }),
    Object.freeze({
      side: 1, chartM: 690989, panels: 1602, cellsTaylor: 3352155, cellsTierP: 0,
      tierB0: 1877677, tierBsub: 981879, tierP: 0,
      failPilot: 0, failE97: 0, pilotGapCells: 0, unprocessedPanels: 0,
      certifiedSupUbPilot: 0.2796880884153554,
      certifiedSupUbE97: 0.27968806511169375,
      maxBallRad: 2.09e-14, maxTelescopeRad: 3.97e-14,
      panelCpuSeconds: 9227.8, cellCpuSeconds: 251.1,
    }),
  ]),
  wallSeconds: 3537.7,
  certifiedStatement:
    'CERTIFIED (continuum, outward-rounded balls + rigorous x-uniform ledgers, locked ' +
    'convention): for every u in [73222.5, 74022.5] and both seam charts M in {690988, 690989}, ' +
    'sum_j |D_j(x(u))| < 0.27968819555261474 and |E97(x(u))| < 0.27968819555261474, hence both ' +
    '< Rex = 0.2796881955526244 — the first continuum-certified statement of the Gate-2 window ' +
    'program, on the hardest stretch (contains the |E97| sup witness). Sub-range only: 0.058% ' +
    'of window 1; sets no promotion flag; changes no bound',
});

// |E97|-only target price point (same architecture, C2 metric alone)
export const E97_ONLY_SLICE = Object.freeze({
  output: 'native/gate2-interval/tier-slice-e97only-95213.json',
  uLo: 73572.5,
  uHi: 73672.5,
  sides: 2,
  metric: 'e97',
  perSide: Object.freeze([
    Object.freeze({ side: 0, panels: 201, cellsTaylor: 412277, tierB0: 228621, tierBsub: 122230, tierP: 0, failE97: 0, certifiedSupUbE97: 0.2796881437309319 }),
    Object.freeze({ side: 1, panels: 201, cellsTaylor: 412281, tierB0: 228619, tierBsub: 122234, tierP: 0, failE97: 0, certifiedSupUbE97: 0.2796873718867673 }),
  ]),
  certified: true,
  cpuSecondsPerXUnit: 0.9328,
  cellsPerXUnit: 328.08,
  fullWindowCpuDays: 375.0,
  wallSeconds: 414.4,
});

// ── measured price + full-window extrapolation ───────────────────────────────
export const TIER_PRICE = Object.freeze({
  measured: Object.freeze({
    sliceXUnits: 20106.19,
    cpuSeconds: 18915.7,
    cpuSecondsPerXUnit: 0.9408,
    panelSecondsPerXUnit: 0.9159, // 97.4% of cost: panel-dominated
    cellSecondsPerXUnit: 0.0249,
    cellsPerXUnit: 333.44,
    ballOpsPerXUnit: 2.904e7,
    secondsPerBallOp: 3.24e-8,
  }),
  fullWindow: Object.freeze({
    xUnitsBothSides: 34732870.325,
    cpuDaysBothMetrics: 378.2,
    cpuDaysE97Only: 375.0,
    panelOnlyFloorCpuDays: 368.2,
    wallDaysAt8Threads: 47.3,
    ballOpsAtSliceRate: 1.0086e15,
  }),
  baselines: Object.freeze({
    directCertifierCpuDays: 1.64e5, // cert_window O(N)-per-cell (frozen dry-run)
    directWithAliasLedgerCpuDays: 8.6e4, // imp-95210 scenario
    designTierBudgetBallOps: 1.1e13, // two-level W1-CERT design estimate
    speedupVsDirect: 433.6,
    speedupVsAliasDirect: 227.4,
    requiredBeat: 100, // the task's ~100x line: EXCEEDED
    ballOpsRatioVsDesign: 91.7, // single-level Taylor is ~92x the two-level budget
  }),
  residualLever:
    'frequency-bin second level (panel chirp recurrence + Lemma-A derotated bin remainders + ' +
    'Lemma-B subpanel collapse) amortizes the per-panel O(N) pass — the identified remaining ' +
    '10-100x between the measured 1.0e15 ball-ops and the 1.1e13 design budget; NOT built here; ' +
    'the full-window run (378 CPU-days as built) is a separate decision',
  honestNotes: Object.freeze([
    'slice = hardest stretch (contains the |E97| sup witness): cell density above window mean, but cells are 2.6% of cost, so extrapolation error < 3%',
    'ball-op counts are analytic arb-op estimates at the measured mix, not the design normalization',
    'price scales linearly in verified precision replays (160/192-bit G5 replays multiply the price)',
  ]),
});

export const IMP95213_TIER_CERTIFIER = Object.freeze({
  ticket: 'imp-95213-tier-certifier-build',
  lane: 'W1-CERT tier-P/B/S (archive-free Gate lane, window 1 only)',
  parent: 'imp-95210-window1-pilot-certificate (envelope pivot refuted; tier batching = only live path)',
  buildComplete: true,
  validationGreen: true,
  sliceCertified: true, // first continuum-certified statement (sub-range)
  fullWindowRunLaunched: false, // separate decision, NOT taken here
  promotesBound: false,
  cpuHoursSpent: 6.3, // all slices + validation + micro-benchmarks
  verdict:
    'TIER-P/B/S CERTIFIER BUILT + VALIDATED + PRICED: rigorous degree-80 Taylor panel models ' +
    '(exact Lagrange remainder <= 1e-14) amortize the O(N) Arb evaluation to ~4.3e3 ball-ops ' +
    'per cell, with the adopted Arb alias ledger 44.476/x and fail-closed Tier-P/E97-direct ' +
    'fallback (never fired). Validation 30/30 direct-ball containment + 30/30 dd containment; ' +
    'telescope gate <= 4e-14 over 7.5e6 evaluations. SLICE CERTIFIED (continuum, both charts, ' +
    'both metrics): sup pilot and sup |E97| < eq-20 threshold < Rex for all u in ' +
    '[73222.5, 74022.5] — the hardest stretch, 6.7e6 cells, 0 failures. Measured price ' +
    '0.9408 CPU-s/x-unit => full window 378 CPU-days (pilot+E97) / 375 (E97-only) = 434x/437x ' +
    'below the 1.64e5 CPU-day direct baseline (required ~100x beat EXCEEDED); 97% of cost is ' +
    'the per-panel O(N) pass, and the measured 1.0e15 ball-ops sit ~92x above the two-level ' +
    'design budget 1.1e13 (frequency-bin second level = residual lever). Sub-range only ' +
    '(0.058% of window 1); promotion flag false; full run a separate decision. Changes no ' +
    'bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95213_TIER_ASSERTIONS = [
  {
    id: 'imp95213-alias-ledger-adopted-and-rigorous',
    description:
      'the Arb alias ledger matches the frozen envprobe doubles to 1e-6 relative on both charts, sits below the old direct ledger with the recorded 1.906x reduction, and the Tier-S diagnostics reproduce: derotation gain < 1.2x while the static split penalty 2*staticOverhang exceeds Rex',
    holds: () =>
      [0, 1].every(
        (s) =>
          Math.abs(TIER_LEDGER.lipAliasArb[s] - TIER_LEDGER.lipAliasFrozenDoubles[s]) /
            TIER_LEDGER.lipAliasFrozenDoubles[s] < 1e-6 &&
          TIER_LEDGER.lipAliasArb[s] < TIER_LEDGER.lipPilotOld[s] &&
          TIER_LEDGER.lipAliasArb[s] / TIER_LEDGER.lip2DerotArb[s] < 1.2 &&
          2 * TIER_LEDGER.staticOverhangArb[s] > REX_EXACT
      ) &&
      Math.abs(
        TIER_LEDGER.lipPilotOld[0] / TIER_LEDGER.lipAliasArb[0] - TIER_LEDGER.cellReductionVsOld
      ) < 1e-4,
  },
  {
    id: 'imp95213-validation-gates-green',
    description:
      'both validation legs report zero containment failures at 30 points each; Taylor radii sit at the 1e-14 remainder scale (rigorous, far below every slack) and dd deviations sit inside the dd lane error profile (<= ddTol)',
    holds: () =>
      TIER_VALIDATION.internal.points === 30 &&
      TIER_VALIDATION.internal.containmentFailures === 0 &&
      TIER_VALIDATION.ddCross.points === 30 &&
      TIER_VALIDATION.ddCross.failures === 0 &&
      TIER_VALIDATION.internal.maxTaylorRad < 5e-14 &&
      TIER_VALIDATION.ddCross.maxTaylorRad < 5e-14 &&
      TIER_VALIDATION.ddCross.maxDevPilot < TIER_VALIDATION.ddCross.ddTol &&
      TIER_VALIDATION.ddCross.maxDevAbsE97 < 1e-15 &&
      TIER_VALIDATION.internal.maxTelescopeRad < 1e-12,
  },
  {
    id: 'imp95213-slice-certified-first-continuum-statement',
    description:
      'the slice is fully certified: both charts, both metrics, zero failed/unprocessed cells, zero Tier-P escalations, every certified sup ubound strictly below the eq-20 threshold which is strictly below Rex; the covered range contains the |E97| sup witness and sits inside w in [0.05, 0.06]',
    holds: () => {
      const wit = 0.053273326334 * WINDOW_WIDTH_U;
      return (
        CERTIFIED_SLICE.perSide.every(
          (s) =>
            s.failPilot === 0 &&
            s.failE97 === 0 &&
            s.pilotGapCells === 0 &&
            s.unprocessedPanels === 0 &&
            s.tierP === 0 &&
            s.certifiedSupUbPilot < EQ20_THRESHOLD &&
            s.certifiedSupUbE97 < EQ20_THRESHOLD &&
            s.tierB0 + s.tierBsub <= s.cellsTaylor &&
            s.tierB0 > s.tierBsub
        ) &&
        EQ20_THRESHOLD < REX_EXACT &&
        CERTIFIED_SLICE.uLo < wit &&
        wit < CERTIFIED_SLICE.uHi &&
        CERTIFIED_SLICE.wLo > 0.05 &&
        CERTIFIED_SLICE.wHi < 0.06 &&
        Math.abs(CERTIFIED_SLICE.wLo * WINDOW_WIDTH_U - CERTIFIED_SLICE.uLo) < 1e-6 &&
        Math.abs(CERTIFIED_SLICE.wHi * WINDOW_WIDTH_U - CERTIFIED_SLICE.uHi) < 1e-6 &&
        E97_ONLY_SLICE.certified &&
        E97_ONLY_SLICE.perSide.every((s) => s.failE97 === 0 && s.tierP === 0)
      );
    },
  },
  {
    id: 'imp95213-price-arithmetic-recomputes',
    description:
      'the full-window price recomputes from the measured rate (cpuDays = secPerX * 2*4pi*(2N+1) / 86400), the panel share is > 95% of cost, and the required ~100x beat over the 1.64e5 CPU-day direct baseline is exceeded (433.6x)',
    holds: () => {
      const fullX = 2 * 4 * Math.PI * WINDOW_WIDTH_U;
      const days = (TIER_PRICE.measured.cpuSecondsPerXUnit * fullX) / 86400;
      const speed = TIER_PRICE.baselines.directCertifierCpuDays / days;
      return (
        Math.abs(fullX - TIER_PRICE.fullWindow.xUnitsBothSides) / fullX < 1e-6 &&
        Math.abs(days - TIER_PRICE.fullWindow.cpuDaysBothMetrics) / days < 2e-3 &&
        Math.abs(speed - TIER_PRICE.baselines.speedupVsDirect) / speed < 2e-3 &&
        speed > TIER_PRICE.baselines.requiredBeat &&
        TIER_PRICE.measured.panelSecondsPerXUnit / TIER_PRICE.measured.cpuSecondsPerXUnit > 0.95 &&
        TIER_PRICE.fullWindow.panelOnlyFloorCpuDays < TIER_PRICE.fullWindow.cpuDaysBothMetrics &&
        Math.abs(
          TIER_PRICE.fullWindow.cpuDaysBothMetrics / 8 - TIER_PRICE.fullWindow.wallDaysAt8Threads
        ) < 0.1 &&
        E97_ONLY_SLICE.fullWindowCpuDays < TIER_PRICE.fullWindow.cpuDaysBothMetrics
      );
    },
  },
  {
    id: 'imp95213-ballops-honesty-vs-design',
    description:
      'the single-level Taylor realization is honestly recorded as ~92x ABOVE the two-level design ball-op budget 1.1e13 even though it beats the CPU baseline by 434x: the ratio recomputes and the residual lever is named',
    holds: () =>
      Math.abs(
        TIER_PRICE.fullWindow.ballOpsAtSliceRate / TIER_PRICE.baselines.designTierBudgetBallOps -
          TIER_PRICE.baselines.ballOpsRatioVsDesign
      ) < 0.5 &&
      TIER_PRICE.baselines.ballOpsRatioVsDesign > 1 &&
      /frequency-bin/.test(TIER_PRICE.residualLever) &&
      /NOT built/.test(TIER_PRICE.residualLever),
  },
  {
    id: 'imp95213-degree-sensitivity-coherent',
    description:
      'the degree ladder is coherent: panel half-width grows with degree, the degree-80 rate improves on degree-40 by > 1.3x, and the chosen degree is within 5% of the best measured rate',
    holds: () => {
      const d = TIER_VALIDATION.degreeSensitivity;
      const best = Math.min(...d.map((r) => r.cpuSecPerXUnit));
      return (
        d[0].hX < d[1].hX &&
        d[1].hX < d[2].hX &&
        d[0].cpuSecPerXUnit / d[1].cpuSecPerXUnit > 1.3 &&
        d[1].cpuSecPerXUnit / best < 1.05 &&
        TIER_BUILD.degree === 80
      );
    },
  },
  {
    id: 'imp95213-honesty-gate-scope-and-no-qed',
    description:
      'fail-closed honesty: the slice is a sub-range certificate (0.058% of window 1), the full-window run was NOT launched, no bound is promoted, Tier P never fired but is implemented, NO QED and no-refereed-bound-change stated',
    holds: () =>
      IMP95213_TIER_CERTIFIER.fullWindowRunLaunched === false &&
      IMP95213_TIER_CERTIFIER.promotesBound === false &&
      IMP95213_TIER_CERTIFIER.sliceCertified === true &&
      TIER_BUILD.tierPImplemented === true &&
      TIER_BUILD.tierPFiredOnSlices === 0 &&
      (CERTIFIED_SLICE.uHi - CERTIFIED_SLICE.uLo) / WINDOW_WIDTH_U < 1e-3 &&
      /Sub-range only/.test(CERTIFIED_SLICE.certifiedStatement) &&
      /sets no promotion flag/.test(CERTIFIED_SLICE.certifiedStatement) &&
      /NO QED/.test(IMP95213_TIER_CERTIFIER.verdict) &&
      /refereed bound is changed/i.test(IMP95213_TIER_CERTIFIER.verdict),
  },
];

for (const a of IMP95213_TIER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95213-tier-certifier-build assertion failed: ${a.id}`);
  }
}

export default IMP95213_TIER_CERTIFIER;
