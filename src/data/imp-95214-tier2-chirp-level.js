/**
 * imp-95214 — frequency-bin/chirp SECOND LEVEL for the tier-P/B/S
 * window-1 certifier (the identified 10-100x lever on the level-1
 * per-panel O(N) Arb pass, which was 97.4% of the imp-95213 cost).
 * BUILD + DERIVATION + VALIDATION + PRICE. The full-window run remains a
 * SEPARATE decision and was NOT launched.
 *
 * WHAT WAS BUILT (native/gate2-interval/tier_cert2.c, includes
 * tier_cert.c, mode `tiercert2`): the G4 "batch the remaining integer
 * indices by certified curvature/chirp recurrences" step, concretely:
 *
 *  DERIVATION. Each class-sum series is S_c(x) = sum_n amp_n e^{i nu_n x}
 *  (P_n/Q_n amplitude variants give ScR_c/ScI_c), nu_n = ln(n)/2. Split
 *  the frequency axis into B = 64 bins with exact-double centers nu*_b;
 *  per (class, bin) the DEROTATED ENVELOPE E_cb(x) = sum amp_n e^{i d_n x}
 *  (d_n = nu_n - nu*_b, |d_n| <= delta_b <= 0.049868) makes the class sum
 *  a sum of chirps: carrier e^{i nu*_b x} times a slowly varying envelope.
 *  This is exactly how every level-1 Taylor coefficient varies with the
 *  panel center. The empirical scan (mode scan2) MEASURED it before the
 *  span was chosen: raw level-1 coefficients move at phase scale (rel
 *  rates 1.05-1.31 per x-unit at k = 1/5/40), the envelopes at 0.0130
 *  abs/x-unit, sitting at 0.9973 of the rigorous delta_b*mass rate bound
 *  — an ~85x smoothness separation, no hidden fast variation. ONE O(N)
 *  Arb super-pass builds degree-E = 33 Taylor models of all 920 nonempty
 *  (class,bin) envelopes with the EXACT Lagrange remainder from the same
 *  per-class mass sums (sum |amp| delta^{E+1}) Hx^{E+1}/(E+1)!; the
 *  rigorous mass solve at budget 5e-15 gives super half-width
 *  Hx = 97.32 x-units = 31 level-1 panels per O(N) pass (vs 1). Per
 *  panel the level-1 degree-80 coefficient arrays are reconstructed by
 *  exact ball Taylor SHIFT of the envelope polys to the panel center,
 *  the rotation q~_j = (-i)^j q_j, a plain REAL convolution with the
 *  carrier table nu*^m/m! (_arb_poly_mullow), and the i^k carrier
 *  rotation — the single-term identity telescopes the binomial
 *  (nu*+d)^k, so the reconstruction equals the level-1 coefficients
 *  exactly up to two CERTIFIED remainders frozen per class:
 *    (1) envelope Lagrange, total 4.585e-15;
 *    (2) the degree-80 k-tail of carrier x shifted envelope
 *        (|q_j| <= M delta^j/j! e^{delta Hx} + geometric exp-tail
 *        majorant), total 2.722e-12 — the level-1 Lagrange analog.
 *  Reconstructed panels are consumed by the UNCHANGED tpanel_eval: same
 *  cell criterion, same alias/E97 Lipschitz ledgers, same eq-(13)
 *  telescope gate at EVERY evaluation, same Tier-P direct O(N) fallback,
 *  same fail-closed records. Containment preserved by construction.
 *
 * VALIDATION (all green):
 *  - selfcheck2: reconstructed vs direct level-1 panels (far off-center
 *    super placement): max coefficient midpoint deviation 1.084e-19;
 *    per-class-series model agreement within summed radii; 6/6
 *    direct-Arb-ball containment.
 *  - panels2 (50 random panels, random sides/super placements, seed
 *    95214): 0 failures; max coefficient midpoint deviation 1.7e-18
 *    (the reconstruction IS the level-1 panel model up to ball
 *    rounding); max class-series deviation / summed-radius 1.1e-6.
 *  - validate2 (30 seeded points, seed 95214, panel AND super
 *    off-center): 30/30 containment of the direct O(N) Arb ball in all
 *    54 components; midpoint devs below print granularity; max model
 *    radius 3.997e-12 (= the tier-2 remainder scale), max telescope
 *    radius 9.467e-12.
 *  - dd cross-validation (tier2_validate_dd.py, SAME 30 points as the
 *    level-1 suite): 0 failures; max dev 8.7e-16 on |E97|, 3.4e-14 on
 *    the pilot, 2.3e-14 per defect — numerically IDENTICAL to the
 *    level-1 suite's deviations (the dd lane's own error profile):
 *    reconstructed midpoints agree with level 1 far below dd error.
 *  - VERDICT MATCH (the 100-u re-certification of the hardest stretch,
 *    u in [73572.5, 73672.5], both charts, both metrics): tier-2
 *    certifies with 0 failed cells / 0 Tier-P / 0 unprocessed, and its
 *    certified sups match level 1 on the identical range:
 *      pilot side 0: 0.27968708789086277 vs level-1 0.27968708788799457
 *      pilot side 1: 0.27968814485571281 vs level-1 0.2796881448530544
 *      E97   side 0: 0.27968814373464052 vs level-1 0.2796881437309319
 *      E97   side 1: 0.27968737188875004 vs level-1 0.2796873718867673
 *    — max deviation 3.71e-12 (= the tier-2 remainder-ball thickness),
 *    with IDENTICAL per-side cell counts (423840 / 423857): the
 *    reconstructed models drive the same adaptive partition; and the
 *    level-1 E97 sups reproduce the frozen imp-95213 E97-only literals
 *    exactly. Same certified verdict, same gates, both levels.
 *
 * PRICE (measured on the hardest stretch — same protocol as imp-95213;
 * 400-u certified slice, 26 super-panels/side, thread-CPU accounting):
 *    0.0525 CPU-s/x-unit (0.0170 super-pass + 0.0161 reconstruction +
 *    0.0194 cells) vs level 1's 0.9408 => FULL WINDOW (3.473e7 x-units,
 *    both charts): 21.1 CPU-days vs 378 — a measured 17.9x speedup
 *    (17.5x vs the same-day level-1 rerun rate 0.9198), 7770x below the
 *    direct baseline. 1.5 wall-days at 14 threads / 3.0 at 7. The
 *    identified "10-100x lever" lands INSIDE its band at ~18x; the O(N)
 *    panel pass is now amortized 31x and is no longer dominant (32% of
 *    cost); cells (37%) + reconstruction (31%) are the new floor, which
 *    is why the analytic ball-op count 1.55e14 (6.5x below level 1's
 *    1.0e15) still sits 14x ABOVE the 1.1e13 two-level design estimate:
 *    that estimate priced only ~1e3 ball-ops/cell and no reconstruction;
 *    the remaining gap is cell/reconstruction-dominated, honestly out of
 *    reach of further panel-pass batching.
 *
 * Grade: BUILD rigorous + VALIDATED; measured price + extrapolation; the
 * 100-u re-certification is a CERTIFICATE (sub-range, continuum, both
 * charts). Promotes nothing; NO QED.
 */

// ── frozen program constants (shared with imp-95213) ─────────────────────────
export const REX_EXACT = 0.2796881955526244146123;
export const EQ20_THRESHOLD = 0.27968819555261474;
export const W1_N = 690988;
export const WINDOW_WIDTH_U = 2 * W1_N + 1;
export const LEVEL1_CPU_S_PER_X = 0.9408; // imp-95213 measured
export const LEVEL1_FULL_WINDOW_CPU_DAYS = 378.2;

// ── build record ─────────────────────────────────────────────────────────────
export const TIER2_BUILD = Object.freeze({
  ticket: 'imp-95214-tier2-chirp-level',
  date: '2026-09-10',
  binary: 'native/gate2-interval/tier_cert2.c (includes tier_cert.c; reconstructed panels consumed by the unchanged tpanel_eval/eval_from_class_sums)',
  validationDriver: 'native/gate2-interval/tier2_validate_dd.py',
  degree: 80,
  bins: 64,
  envelopeDegree: 33,
  prec: 128,
  phasePrec: 192,
  envRemainderBudget: 5e-15,
  compile: 'clang -O2, zero warnings, FLINT/Arb 3.x',
});

// ── the rigorous second-level ledger (Arb, both charts) ──────────────────────
export const TIER2_LEDGER = Object.freeze({
  HXsolved: 97.5636,        // x-units, mass-solved at the 5e-15 env budget
  HXused: 97.3156,          // realized (= ub(2 pi K wu)), <= HXsolved
  panelsPerSuper: 31,       // K: level-1 O(N) passes amortized per super-pass
  superWidthU: Object.freeze([15.488255, 15.488253]),
  deltaMax: 0.049868,       // max derotated bandwidth over bins
  pairsNonempty: 920,       // of 26*64 (class,bin) pairs
  rEnvTotal: 4.585e-15,     // envelope Lagrange remainder, total per chart
  kTailTotal: 2.722e-12,    // degree-80 k-tail remainder, total per chart
  maxClassRem2: 1.364e-12,  // max per-class tier-2 remainder ball
  level1RemTarget: 1e-14,   // level-1's Lagrange target (for scale)
  panelHalfWidthX: 3.13921211, // UNCHANGED level-1 panel geometry
  panelWidthU: 0.499621125,
});

// ── the empirical smoothness scan that sized the span (mode scan2) ───────────
export const TIER2_SCAN = Object.freeze({
  rawCoefficientRelRatePerX: Object.freeze([
    Object.freeze({ k: 0, rate: 0.0221 }),
    Object.freeze({ k: 1, rate: 1.3122 }),
    Object.freeze({ k: 5, rate: 1.0573 }),
    Object.freeze({ k: 40, rate: 1.0675 }),
  ]), // level-1 Taylor coefficients vary at PHASE scale across panel centers
  envelopeMaxAbsRatePerX: 0.012972, // derotated bin envelopes: ~85x smoother
  envelopeRateOverRigorousBound: 0.9973, // measured/(delta_b * mass) <= 1
  verdict:
    'chirp decomposition confirmed: raw coefficient variation is phase-scale, the derotated ' +
    'envelope variation sits at the delta_b scale exactly as the derivation requires; the ' +
    'super-panel span is frozen from the rigorous envelope Lagrange masses, not the scan',
});

// ── validation record ────────────────────────────────────────────────────────
export const TIER2_VALIDATION = Object.freeze({
  selfcheck: Object.freeze({
    maxCoefficientMidDev: 1.084e-19,
    containment: '6/6',
    pass: true,
  }),
  panels: Object.freeze({
    // 50 random panels, random super placement; criterion: per-coefficient
    // |dMid| <= 1e-15, per-class-series |dMid(eval)| <= summed radii,
    // 3-offset direct-Arb-ball containment (all 54 components)
    panels: 50,
    seed: 95214,
    failures: 0,
    maxCoefficientMidDev: 1.735e-18,
    maxClassSeriesDevOverRadSum: 1.119e-6,
  }),
  internal30: Object.freeze({
    points: 30,
    seed: 95214,
    containmentFailures: 0,
    maxMidDevPilot: 0.0, // below print granularity
    maxMidDevE97: 0.0,
    maxModelRad: 3.997e-12,
    maxTelescopeRad: 9.467e-12,
  }),
  ddCross: Object.freeze({
    // tier2_validate_dd.py, the SAME 30 seeded points as the level-1 suite
    points: 30,
    failures: 0,
    maxDevAbsE97: 8.723490679818369e-16, // identical to the level-1 suite:
    maxDevPilot: 3.447242491461111e-14,  // midpoints agree with level 1 far
    maxDevDefect: 2.310651670001107e-14, // below the dd lane's own error
    maxTier2Rad: 4.266e-12,
    ddTol: 1e-12,
  }),
});

// ── the 100-u re-certification + verdict match vs level 1 ────────────────────
export const TIER2_VERDICT_MATCH = Object.freeze({
  uLo: 73572.5,
  uHi: 73672.5, // inside the imp-95213 certified 800-u hardest stretch
  sides: 2,
  metric: 'both',
  tier2: Object.freeze({
    output: 'native/gate2-interval/tier2-slice-verdict-95214.json',
    perSide: Object.freeze([
      Object.freeze({ side: 0, supers: 7, panels: 201, cellsTaylor: 423840, tierP: 0, failPilot: 0, failE97: 0, unprocessedPanels: 0, certifiedSupUbPilot: 0.27968708789086277, certifiedSupUbE97: 0.27968814373464052, maxBallRad: 5.823e-12, maxTelescopeRad: 1.105e-11 }),
      Object.freeze({ side: 1, supers: 7, panels: 201, cellsTaylor: 423857, tierP: 0, failPilot: 0, failE97: 0, unprocessedPanels: 0, certifiedSupUbPilot: 0.27968814485571281, certifiedSupUbE97: 0.27968737188875004, maxBallRad: 5.823e-12, maxTelescopeRad: 1.105e-11 }),
    ]),
    certified: true,
  }),
  level1: Object.freeze({
    output: 'native/gate2-interval/tier1-slice-verdict-95214.json',
    perSide: Object.freeze([
      Object.freeze({ side: 0, panels: 201, cellsTaylor: 423840, certifiedSupUbPilot: 0.27968708788799457, certifiedSupUbE97: 0.2796881437309319, failPilot: 0, failE97: 0, unprocessedPanels: 0 }),
      Object.freeze({ side: 1, panels: 201, cellsTaylor: 423857, certifiedSupUbPilot: 0.2796881448530544, certifiedSupUbE97: 0.2796873718867673, failPilot: 0, failE97: 0, unprocessedPanels: 0 }),
    ]),
    cpuSecondsPerXUnit: 0.9198, // this run's measured level-1 rate
    certified: true,
  }),
  frozenLevel1E97Only: Object.freeze([
    // the imp-95213 E97-only slice certified the SAME 100-u range; this
    // run's level-1 E97 sups reproduce those literals EXACTLY (identical
    // cell partition), pinning the comparison chain
    0.2796881437309319, 0.2796873718867673,
  ]),
  // identical cell counts per side (423840 / 423857): the tier-2 panel
  // models drive the SAME adaptive partition; sup deviations are pure
  // remainder-ball thickness
  maxSupDeviation: 3.71e-12,
  verdictsMatch: true,
});

// ── side-by-side verdict-match table (imp-95243) ─────────────────────────────
// Flattens TIER2_VERDICT_MATCH into per-(side, metric) rows so the level-1 vs
// level-2 100-u hardest-stretch re-certification is legible without cross-
// referencing two parallel perSide arrays by hand. Pure re-derivation of the
// frozen literals above; no new computation.
export const TIER2_VERDICT_MATCH_TABLE = Object.freeze(
  TIER2_VERDICT_MATCH.tier2.perSide.flatMap((t2side, i) => {
    const t1side = TIER2_VERDICT_MATCH.level1.perSide[i];
    return ['pilot', 'e97'].map((metric) => {
      const level1Sup = metric === 'pilot' ? t1side.certifiedSupUbPilot : t1side.certifiedSupUbE97;
      const level2Sup = metric === 'pilot' ? t2side.certifiedSupUbPilot : t2side.certifiedSupUbE97;
      return Object.freeze({
        side: t2side.side,
        metric,
        level1SupUb: level1Sup,
        level2SupUb: level2Sup,
        deviation: Math.abs(level2Sup - level1Sup),
        level1Cells: t1side.cellsTaylor,
        level2Cells: t2side.cellsTaylor,
        cellsMatch: t1side.cellsTaylor === t2side.cellsTaylor,
        eq20Threshold: EQ20_THRESHOLD,
        rexExact: REX_EXACT,
      });
    });
  })
);

// ── measured price + full-window extrapolation ───────────────────────────────
export const TIER2_PRICE = Object.freeze({
  measured: Object.freeze({
    output: 'native/gate2-interval/tier2-slice-price-95214.json',
    uLo: 73222.5,
    uHi: 73622.5, // 400 u on the hardest stretch, inside the certified 800 u
    sides: 2,
    metric: 'both',
    certified: true, // 3.37e6 cells, 0 failures, 0 Tier-P, 0 unprocessed
    supersPerSide: 26,
    panelsPerSide: 801,
    sliceXUnits: 10053.1,
    cpuSeconds: 527.8,
    cpuSecondsPerXUnit: 0.0525,
    superSecondsPerXUnit: 0.017, // the amortized O(N) pass: was 0.9159 at level 1
    reconSecondsPerXUnit: 0.0161,
    cellSecondsPerXUnit: 0.0194,
    cellsPerXUnit: 335.2, // unchanged cell density (same ledgers/criterion)
    ballOpsPerXUnit: 4.4501e6, // level 1: 2.904e7
    maxBallRad: 6.169e-12,
    maxTelescopeRad: 1.172e-11,
    wallSeconds: 120.4, // at 5 threads
    smallSliceRate100u: 0.0718, // the 100-u verdict slice (more edge truncation)
  }),
  fullWindow: Object.freeze({
    xUnitsBothSides: 34732870.325,
    cpuDays: 21.1,
    superPlusReconFloorCpuDays: 13.3,
    wallDaysAt14Threads: 1.51,
    wallDaysAt7Threads: 3.01,
    ballOpsAtSliceRate: 1.5456e14,
  }),
  baselines: Object.freeze({
    level1CpuSecondsPerXUnit: LEVEL1_CPU_S_PER_X,
    level1SameDayRerunCpuSecondsPerXUnit: 0.9198, // tier1 verdict run, same box
    level1FullWindowCpuDays: LEVEL1_FULL_WINDOW_CPU_DAYS,
    level1BallOpsFullWindow: 1.0086e15,
    directCertifierCpuDays: 1.64e5,
    designTierBudgetBallOps: 1.1e13,
    speedupVsLevel1: 17.92, // 17.5 vs the same-day level-1 rerun rate
    speedupVsDirect: 7770,
    ballOpsVsLevel1: 6.53, // 1.0086e15 / 1.5456e14
    ballOpsRatioVsDesign: 14.05, // still ABOVE the 1.1e13 design budget
  }),
  honestNotes: Object.freeze([
    'hardest-stretch slice (same protocol as the level-1 price): cell density above window mean; cells are now a comparable share of cost, so the extrapolation is mildly conservative',
    'ball-op counts are analytic arb-op estimates at the measured mix, not the design normalization',
    'the residual gap to the 1.1e13 design ball-op budget is now cell- and reconstruction-dominated, not panel-pass-dominated: the panel O(N) lever is spent',
    'price scales linearly in verified precision replays (160/192-bit G5 replays multiply the price)',
  ]),
});

export const IMP95214_TIER2_CHIRP = Object.freeze({
  ticket: 'imp-95214-tier2-chirp-level',
  lane: 'W1-CERT tier-P/B/S second level (archive-free Gate lane, window 1 only)',
  parent: 'imp-95213-tier-certifier-build (level-1 tier certifier; named this frequency-bin second level as the residual 10-100x lever)',
  buildComplete: true,
  validationGreen: true,
  verdictMatchGreen: true,
  fullWindowRunLaunched: false,
  promotesBound: false,
  cpuHoursSpent: 2.1, // ledger/scan/selfcheck + validations + slices
  verdict:
    'TIER-2 CHIRP LEVEL BUILT + VALIDATED + PRICED: the class-sum series decompose into ' +
    '64-bin chirps (carrier e^{i nu* x} x derotated envelope, bandwidth <= 0.0499; scan-' +
    'confirmed at 0.997 of the rigorous rate bound), so ONE O(N) Arb super-pass (degree-33 ' +
    'envelope models, exact per-(class,bin) Lagrange masses, budget 5e-15) certifies 97.3 ' +
    'x-units = 31 level-1 panels, and each level-1 degree-80 panel model is reconstructed by ' +
    'exact ball Taylor shift + (-i)^j rotation + real carrier convolution + i^k rotation with ' +
    'certified remainders <= 1.4e-12/class, feeding the UNCHANGED tpanel_eval (same cell ' +
    'criterion, alias/E97 ledgers, telescope gate, Tier-P fallback: containment preserved). ' +
    'Validation: 50-panel reconstruction comparison (max coefficient dev 1.7e-18, 0 failures) ' +
    '+ 30/30 direct-Arb-ball containment + 30/30 dd cross-validation (deviations identical to ' +
    'the level-1 suite) + the 100-u hardest-stretch RE-CERTIFICATION matching level 1 verdict-' +
    'for-verdict: identical cell counts, all four certified sups agree to <= 3.71e-12 (the ' +
    'remainder-ball thickness), level-1 E97 sups reproduce the frozen imp-95213 literals ' +
    'exactly. Measured price (400-u certified slice): 0.0525 CPU-s/x-unit => full window 21.1 ' +
    'CPU-days vs level 1\'s 378 = 17.9x speedup (the identified 10-100x lever lands at ~18x), ' +
    '1.5 wall-days at 14 threads; ball-ops 1.55e14 = 6.5x below level 1 but honestly still ' +
    '14x above the 1.1e13 design estimate (cells + reconstruction now dominate; the panel-' +
    'pass lever is spent). Sub-range certificates only; promotion flag false; full-window run ' +
    'NOT launched (separate decision). Changes no bound; NO QED; no refereed bound is changed' +
    '.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95214_TIER2_ASSERTIONS = [
  {
    id: 'imp95214-super-panel-geometry-consistent',
    description:
      'the second-level geometry recomputes: HXused = 2pi * K * wu with the UNCHANGED level-1 panel width, K = 31 panels amortized per O(N) super-pass, HXused <= the mass-solved HXsolved, and the bin bandwidth deltaMax equals the analytic half-binwidth (6.7231-0.34)/(2*64)',
    holds: () => {
      const twoPiWu = 2 * Math.PI * TIER2_LEDGER.panelWidthU;
      return (
        Math.abs(twoPiWu * TIER2_LEDGER.panelsPerSuper - TIER2_LEDGER.HXused) < 0.01 &&
        TIER2_LEDGER.HXused <= TIER2_LEDGER.HXsolved &&
        TIER2_LEDGER.panelsPerSuper === 31 &&
        Math.abs(TIER2_LEDGER.deltaMax - (6.7231 - 0.34) / (2 * TIER2_BUILD.bins)) < 2e-5 &&
        Math.abs(2 * TIER2_LEDGER.panelHalfWidthX / (4 * Math.PI) - TIER2_LEDGER.panelWidthU) < 1e-6
      );
    },
  },
  {
    id: 'imp95214-remainder-budget-honest',
    description:
      'the envelope Lagrange total sits inside the 5e-15 budget, the k-tail dominates the tier-2 remainder (~1.4e-12/class), the measured max ball radius on the certified slices stays at that scale (< 1e-10), and the smallest certification margin (threshold - max certified sup) exceeds the max ball radius by > 1000x',
    holds: () => {
      const sups = [
        ...TIER2_VERDICT_MATCH.tier2.perSide.map((s) => s.certifiedSupUbE97),
        ...TIER2_VERDICT_MATCH.tier2.perSide.map((s) => s.certifiedSupUbPilot),
      ];
      const minMargin = Math.min(...sups.map((v) => EQ20_THRESHOLD - v));
      return (
        TIER2_LEDGER.rEnvTotal <= TIER2_BUILD.envRemainderBudget * 1.0001 &&
        TIER2_LEDGER.kTailTotal > TIER2_LEDGER.rEnvTotal &&
        TIER2_LEDGER.maxClassRem2 < 2e-12 &&
        TIER2_PRICE.measured.maxBallRad < 1e-10 &&
        minMargin > 0 &&
        minMargin / TIER2_PRICE.measured.maxBallRad > 1000
      );
    },
  },
  {
    id: 'imp95214-chirp-scan-confirms-derotation',
    description:
      'the empirical scan that preceded the span choice is coherent: raw level-1 coefficient variation is phase-scale (order-1 relative per x-unit for k >= 1) while the derotated envelope rate sits at <= 1.0001x of the rigorous delta*mass bound, and the bandwidth reduction delta/nu_typ exceeds 25x',
    holds: () =>
      TIER2_SCAN.rawCoefficientRelRatePerX
        .filter((r) => r.k >= 1)
        .every((r) => r.rate > 0.5 && r.rate < 3) &&
      TIER2_SCAN.envelopeRateOverRigorousBound <= 1.0001 &&
      TIER2_SCAN.rawCoefficientRelRatePerX[1].rate / TIER2_LEDGER.deltaMax > 25 &&
      TIER2_SCAN.envelopeMaxAbsRatePerX < 0.02,
  },
  {
    id: 'imp95214-validation-gates-green',
    description:
      'all four validation legs report zero failures: 50-panel reconstruction comparison (coefficient midpoint deviation < 1e-15, class-series deviation within summed radii), 30-point direct-ball containment, dd cross-validation within the dd tolerance, model radii at the tier-2 remainder scale',
    holds: () =>
      TIER2_VALIDATION.panels.panels === 50 &&
      TIER2_VALIDATION.panels.failures === 0 &&
      TIER2_VALIDATION.panels.maxCoefficientMidDev < 1e-15 &&
      TIER2_VALIDATION.panels.maxClassSeriesDevOverRadSum < 1 &&
      TIER2_VALIDATION.internal30.points === 30 &&
      TIER2_VALIDATION.internal30.containmentFailures === 0 &&
      TIER2_VALIDATION.internal30.maxModelRad < 1e-11 &&
      TIER2_VALIDATION.ddCross.points === 30 &&
      TIER2_VALIDATION.ddCross.failures === 0 &&
      TIER2_VALIDATION.ddCross.maxDevPilot < TIER2_VALIDATION.ddCross.ddTol &&
      TIER2_VALIDATION.ddCross.maxDevAbsE97 < 1e-15 &&
      TIER2_VALIDATION.ddCross.maxTier2Rad < 1e-11 &&
      TIER2_VALIDATION.selfcheck.pass === true,
  },
  {
    id: 'imp95214-verdict-matches-level1',
    description:
      'the 100-u hardest-stretch re-certification matches level 1 verdict-for-verdict: both certify with zero failed/unprocessed cells and zero Tier-P escalations, per-side cell counts are IDENTICAL, all four certified sup ubounds agree within 1e-11 (recorded max 3.71e-12), the level-1 E97 sups equal the frozen imp-95213 E97-only literals exactly, and every sup is strictly below the eq-20 threshold which is below Rex',
    holds: () => {
      const t2 = TIER2_VERDICT_MATCH.tier2.perSide;
      const t1 = TIER2_VERDICT_MATCH.level1.perSide;
      let maxDev = 0;
      for (let s = 0; s < 2; s++) {
        maxDev = Math.max(
          maxDev,
          Math.abs(t2[s].certifiedSupUbPilot - t1[s].certifiedSupUbPilot),
          Math.abs(t2[s].certifiedSupUbE97 - t1[s].certifiedSupUbE97)
        );
      }
      return (
        t2.every((s) => s.failPilot === 0 && s.failE97 === 0 && s.tierP === 0 && s.unprocessedPanels === 0) &&
        t1.every((s) => s.failPilot === 0 && s.failE97 === 0) &&
        t2[0].cellsTaylor === t1[0].cellsTaylor &&
        t2[1].cellsTaylor === t1[1].cellsTaylor &&
        maxDev < 1e-11 &&
        Math.abs(maxDev - TIER2_VERDICT_MATCH.maxSupDeviation) < 1e-13 &&
        t1[0].certifiedSupUbE97 === TIER2_VERDICT_MATCH.frozenLevel1E97Only[0] &&
        t1[1].certifiedSupUbE97 === TIER2_VERDICT_MATCH.frozenLevel1E97Only[1] &&
        t2.every(
          (s) => s.certifiedSupUbPilot < EQ20_THRESHOLD && s.certifiedSupUbE97 < EQ20_THRESHOLD
        ) &&
        EQ20_THRESHOLD < REX_EXACT &&
        TIER2_VERDICT_MATCH.verdictsMatch === true
      );
    },
  },
  {
    id: 'imp95214-price-arithmetic-recomputes',
    description:
      'the price recomputes: component rates sum to the total (0.017+0.0161+0.0194 = 0.0525), cpuDays = rate * 2*4pi*(2N+1)/86400, speedup vs the frozen level-1 rate 0.9408 is 17.9x (>= 10x: the identified 10-100x lever lands inside its band), wall-days at 14 threads = cpuDays/14, and the price slice itself is a certified sub-range',
    holds: () => {
      const m = TIER2_PRICE.measured;
      const fullX = 2 * 4 * Math.PI * WINDOW_WIDTH_U;
      const days = (m.cpuSecondsPerXUnit * fullX) / 86400;
      const speed = LEVEL1_CPU_S_PER_X / m.cpuSecondsPerXUnit;
      return (
        Math.abs(m.superSecondsPerXUnit + m.reconSecondsPerXUnit + m.cellSecondsPerXUnit -
          m.cpuSecondsPerXUnit) < 1e-3 &&
        Math.abs(fullX - TIER2_PRICE.fullWindow.xUnitsBothSides) / fullX < 1e-6 &&
        Math.abs(days - TIER2_PRICE.fullWindow.cpuDays) / days < 5e-3 &&
        Math.abs(speed - TIER2_PRICE.baselines.speedupVsLevel1) / speed < 5e-3 &&
        speed >= 10 &&
        Math.abs(TIER2_PRICE.fullWindow.cpuDays / 14 - TIER2_PRICE.fullWindow.wallDaysAt14Threads) < 0.02 &&
        TIER2_PRICE.fullWindow.superPlusReconFloorCpuDays < TIER2_PRICE.fullWindow.cpuDays &&
        Math.abs(TIER2_PRICE.baselines.directCertifierCpuDays / days -
          TIER2_PRICE.baselines.speedupVsDirect) / TIER2_PRICE.baselines.speedupVsDirect < 5e-3 &&
        m.certified === true
      );
    },
  },
  {
    id: 'imp95214-ballops-honesty-vs-design',
    description:
      'honest ball-op accounting: tier 2 cuts the analytic ball-op count 6.5x below level 1 but the full-window count 1.55e14 still sits ~14x ABOVE the 1.1e13 two-level design estimate — the residual is cell/reconstruction-dominated and is named, not hidden',
    holds: () =>
      Math.abs(
        TIER2_PRICE.fullWindow.ballOpsAtSliceRate / TIER2_PRICE.baselines.designTierBudgetBallOps -
          TIER2_PRICE.baselines.ballOpsRatioVsDesign
      ) < 0.2 &&
      TIER2_PRICE.baselines.ballOpsRatioVsDesign > 1 &&
      Math.abs(
        TIER2_PRICE.baselines.level1BallOpsFullWindow / TIER2_PRICE.fullWindow.ballOpsAtSliceRate -
          TIER2_PRICE.baselines.ballOpsVsLevel1
      ) < 0.1 &&
      TIER2_PRICE.honestNotes.some((n) => /reconstruction-dominated|panel O\(N\) lever is spent/.test(n)),
  },
  {
    id: 'imp95214-honesty-gate-scope-and-no-qed',
    description:
      'fail-closed honesty: sub-range certificates only, the full-window run was NOT launched, no bound is promoted, the verdict states the residual design-budget gap, NO QED and no-refereed-bound-change stated',
    holds: () =>
      IMP95214_TIER2_CHIRP.fullWindowRunLaunched === false &&
      IMP95214_TIER2_CHIRP.promotesBound === false &&
      /still\s+14x above the 1.1e13 design/.test(IMP95214_TIER2_CHIRP.verdict) &&
      /NO QED/.test(IMP95214_TIER2_CHIRP.verdict) &&
      /refereed bound is changed/i.test(IMP95214_TIER2_CHIRP.verdict) &&
      (TIER2_VERDICT_MATCH.uHi - TIER2_VERDICT_MATCH.uLo) / WINDOW_WIDTH_U < 1e-3,
  },
  {
    id: 'imp95214-verdict-match-table-consistent',
    description:
      'the imp-95243 flattened verdict-match table has one row per (side, metric) reproducing TIER2_VERDICT_MATCH exactly: 4 rows, every deviation <= the recorded maxSupDeviation, every side reports identical level-1/level-2 cell counts, and every row is strictly below eq-20 which is strictly below Rex',
    holds: () =>
      TIER2_VERDICT_MATCH_TABLE.length === 4 &&
      TIER2_VERDICT_MATCH_TABLE.every(
        (r) =>
          r.deviation <= TIER2_VERDICT_MATCH.maxSupDeviation * 1.0001 &&
          r.cellsMatch === true &&
          r.level1SupUb < r.eq20Threshold &&
          r.level2SupUb < r.eq20Threshold &&
          r.eq20Threshold < r.rexExact
      ),
  },
];

for (const a of IMP95214_TIER2_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95214-tier2-chirp-level assertion failed: ${a.id}`);
  }
}

export default IMP95214_TIER2_CHIRP;
