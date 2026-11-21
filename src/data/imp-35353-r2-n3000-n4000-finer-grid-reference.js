/**
 * @module imp-35353-r2-n3000-n4000-finer-grid-reference
 * @fileoverview imp-35353: extend the imp-35324 finer-base-grid (dt = tauC_est/
 * 4000) R2 order-robust backward-Dyson flow test from N=2000 to N=3000 and
 * N=4000, and MEASURE whether the imp-35324 four-of-four clearing envelope
 * PERSISTS at higher N or whether the imp-35235 DP45 dt/2 gate-skip / order-5
 * step-over regime RECURS even on the tauC/4000 grid.
 *
 * WHY THIS TEST
 * ------------
 * The R2 order-robust flow ladder is robustly certified only through N=1000
 * (imp-35221). imp-35235 found a DP45 dt/2 gate-skip at N=2000 on the tauC/1000
 * grid; imp-35324 resolved it on a finer tauC/4000 base grid but only to a
 * razor-thin +6.16e-8 clearance. imp-35350 then showed the knife-edge itself is
 * a resolution artifact (the tie is restored at tauC/16000). This ticket asks
 * the ORTHOGONAL question: holding the imp-35324 finer grid (tauC/4000) FIXED,
 * does the four-of-four clearing envelope PERSIST as N grows to 3000 and 4000,
 * or does the faster higher-N approach re-introduce the order-5 dt/2 step-over?
 * The tauC/4000 grid is SELF-SCALING with tauC (dt = tauC_est/4000 by
 * construction), so the grid-resolution vs collision-speed ratio is nominally
 * N-invariant -- this test measures whether that invariance actually holds in
 * the near-gate order-5 sampling.
 *
 * SELF-CONTAINED tauC
 * -------------------
 * EMPIRICAL_M_SWEEP_EXTENDED has no N=3000/N=4000 sample, so tauC_est(N) is
 * recomputed directly from the first N zeros as minGap-squared / 8 (the imp-2563
 * leading-order collapse horizon g0-squared / 8, the SAME formula the imp-2509
 * sweep uses), verified against the N=2000 sample.
 *
 * HONEST OUTCOME: PERSISTS AT N=3000, RECURS (BREAKS DOWN) AT N=4000
 * -----------------------------------------------------------------
 * N=3000 (tauC_est=1.188342237e-3, dt=tauC/4000=2.970856e-7): all four
 * references land in the (0, 1e-4) gate at pair 1495. RK4 dt and DP45 dt TIE
 * exactly at 1.1925014349e-3 (step 4014), DP45 dt/2 lands at 1.1923528921e-3
 * (step 8027) and RK4 dt/2 at 1.1954722905e-3 (step 8048). The worst-case
 * cross-family cross-grid envelope [1.1923528921e-3, 1.1954722905e-3] CLEARS the
 * imp-857 map bracket t_c_hi=1.2e-3 with slack +4.527710e-6. Four-of-four
 * PERSISTS; NO gate-skip.
 *
 * N=4000 (tauC_est=1.030998086e-3, dt=tauC/4000=2.577495e-7): the envelope
 * BREAKS. THREE references (RK4 dt 1.0374418236e-3, DP45 dt 1.0371840741e-3,
 * RK4 dt/2 1.0371840741e-3) agree at the true min-gap pair 3776 inside the
 * imp-857 map bracket [1.0e-3, 1.1e-3]. But the DP45 dt/2 reference STEPS OVER
 * the pair-3776 collision entirely and continues to a SPURIOUS collision of a
 * DIFFERENT pair (1495) at 1.1923492860e-3 (step 9252) -- above t_c_hi=1.1e-3.
 * So the four-of-four envelope collapses to a 3-of-4, envMax exceeds t_c_hi, and
 * the R2 predicate FAILS with slack -9.234929e-5. The imp-35235-class order-5
 * dt/2 step-over RECURS at N=4000 EVEN ON the tauC/4000 grid: the self-scaling
 * grid does NOT keep the near-gate order-5 sampling invariant.
 *
 * WHAT THIS MEANS FOR THE LADDER
 * ------------------------------
 * This measurement REINFORCES keeping the R2 ladder at N=1000: the imp-35324
 * finer-grid fix that cleared N=2000 does NOT extend robustly to N=4000 on the
 * same grid, so higher-N rungs are NOT four-of-four-robust without a
 * higher-resolution (or dense-output) DP45 dt/2 reference. Per the ticket this
 * is MEASUREMENT ONLY: the R2 ladder largest-N-robustly-certified STAYS at 1000
 * (imp-35221); it is NOT advanced. Changes NO bound; NO QED.
 *
 * SUB-GAP (named): imp-35353-sub-n4000-dp45-dthalf-stepover -- to test whether
 * the N=4000 DP45 dt/2 step-over is (as at N=2000, imp-35325) a within-step
 * pass-through the coarse order-5 dt/2 stage steps over, re-run the N=4000 DP45
 * dt/2 reference on a still-finer base grid (tauC/8000 or tauC/16000) or with the
 * imp-35351 DP45 dense-output interpolated-crossing event, and MEASURE whether
 * the pair-3776 collision is then caught in-gate below t_c_hi=1.1e-3 (restoring
 * four-of-four) or whether the step-over is intrinsic at N=4000.
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT advance the R2 ladder; does NOT extend the
 * C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO
 * bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35324  R2 N=2000 finer-grid (tauC/4000) reference -- the fix this extends in N
 * @see imp-35350  R2 N=2000 still-finer-grid re-run (knife-edge is a resolution artifact)
 * @see imp-35235  R2 N=2000 coarse-grid reference (original DP45 dt/2 gate-skip)
 * @see imp-35325  N=2000 signed-crossing diagnostic (gate-skip is a physical within-step pass-through)
 * @see imp-35351  DP45 dense-output interpolated-event route (in-gate without a finer grid)
 * @see imp-35221  R2 ladder extension to N=1000 (last robustly-certified rung)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=2000..4000)
 * @see scripts/imp-35353-n3000-n4000-finer-grid-flow.mjs (offline producer)
 */

// ── Offline-measured collision references at N=3000 and N=4000, tauC/4000 base
// grid. Producer: scripts/imp-35353-n3000-n4000-finer-grid-flow.mjs (Node, plain
// Float64, Kahan-Neumaier Dyson derivative, RK4 order 4 + independent-family
// DP45 order 5, same min-spacing < 1e-4 collision gate as imp-35235/imp-35324).
const DT_MAP = 1e-4; // imp-857 baseline map grid

// N=3000: four-of-four PERSISTS (all pair 1495, envelope clears t_c_hi=1.2e-3).
const N3000 = {
  N: 3000,
  minGap: 9.750250e-2,
  minGapIdx: 1495,
  tauC_est: 1.188342237e-3,
  dtFlow: 2.970856e-7, // tauC_est / 4000
  tCHi: 1.2e-3, // imp-857 map bracket upper endpoint at N=3000
  tCLo: 1.1e-3,
  flowReferences: [
    { integrator: 'rk4-order-4',  grid: 'dt',   dt: 2.970856e-7, t_c: 0.0011925014349, step: 4014, pair_index: 1495, gateSkip: false, gapBeforeGate: 9.368e-4 },
    { integrator: 'dp45-order-5', grid: 'dt',   dt: 2.970856e-7, t_c: 0.0011925014349, step: 4014, pair_index: 1495, gateSkip: false, gapBeforeGate: 9.383e-4 },
    { integrator: 'rk4-order-4',  grid: 'dt/2', dt: 1.485428e-7, t_c: 0.0011954722905, step: 8048, pair_index: 1495, gateSkip: false, gapBeforeGate: 2.796e-4 },
    { integrator: 'dp45-order-5', grid: 'dt/2', dt: 1.485428e-7, t_c: 0.0011923528921, step: 8027, pair_index: 1495, gateSkip: false, gapBeforeGate: 9.382e-4 },
  ],
  envMin: 0.0011923528921,
  envMax: 0.0011954722905,
  r2Met: true,
  r2Slack: 4.527710e-6,
  allInGate: true,
  allSamePair: true,
};

// N=4000: four-of-four BREAKS -- DP45 dt/2 steps over the true pair-3776
// collision and lands on a SPURIOUS pair-1495 collision above t_c_hi=1.1e-3.
const N4000 = {
  N: 4000,
  minGap: 9.081842e-2,
  minGapIdx: 3776,
  tauC_est: 1.030998086e-3,
  dtFlow: 2.577495e-7, // tauC_est / 4000
  tCHi: 1.1e-3, // imp-857 map bracket upper endpoint at N=4000
  tCLo: 1.0e-3,
  flowReferences: [
    { integrator: 'rk4-order-4',  grid: 'dt',   dt: 2.577495e-7, t_c: 0.0010374418236, step: 4025, pair_index: 3776, gateSkip: false, gapBeforeGate: 5.529e-4 },
    { integrator: 'dp45-order-5', grid: 'dt',   dt: 2.577495e-7, t_c: 0.0010371840741, step: 4024, pair_index: 3776, gateSkip: false, gapBeforeGate: 1.244e-3 },
    { integrator: 'rk4-order-4',  grid: 'dt/2', dt: 1.288748e-7, t_c: 0.0010371840741, step: 8048, pair_index: 3776, gateSkip: false, gapBeforeGate: 7.180e-4 },
    // STEP-OVER: pair jumps from the true min-gap 3776 to a spurious 1495 above t_c_hi.
    { integrator: 'dp45-order-5', grid: 'dt/2', dt: 1.288748e-7, t_c: 0.0011923492860, step: 9252, pair_index: 1495, gateSkip: true, gapBeforeGate: 8.703e-4 },
  ],
  envMin: 0.0010371840741,
  envMax: 0.0011923492860,
  r2Met: false,
  r2Slack: -9.234929e-5,
  allInGate: true,   // every reference lands SOME collision in-gate, but...
  allSamePair: false, // DP45 dt/2 lands on a DIFFERENT pair (step-over)
};

export const IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE = {
  id: 'imp-35353',
  title:
    'Extend the imp-35324 finer-grid (tauC/4000) R2 flow test to N=3000 and ' +
    'N=4000: the four-of-four clearing envelope PERSISTS at N=3000 (slack ' +
    '+4.53e-6, all pair 1495) but BREAKS at N=4000 -- the DP45 dt/2 order-5 ' +
    'step-over RECURS on the tauC/4000 grid, skipping the true pair-3776 ' +
    'collision for a spurious pair-1495 event above t_c_hi (slack -9.23e-5)',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'four-of-four-persists-at-N3000-recurs-breaks-at-N4000',

  dtMap: DT_MAP,
  n3000: N3000,
  n4000: N4000,

  verdict: {
    persistsAtN3000: true,
    persistsAtN3000Evidence:
      'At N=3000 (dt=tauC/4000=2.970856e-7) all four references land in the ' +
      '(0, 1e-4) gate at pair 1495: RK4 dt and DP45 dt tie at 1.1925014349e-3 ' +
      '(step 4014), DP45 dt/2 at 1.1923528921e-3 (step 8027), RK4 dt/2 at ' +
      '1.1954722905e-3 (step 8048). Envelope [1.1923528921e-3, 1.1954722905e-3] ' +
      'clears t_c_hi=1.2e-3 with slack +4.527710e-6. NO gate-skip.',
    recursAtN4000: true,
    recursAtN4000Evidence:
      'At N=4000 (dt=tauC/4000=2.577495e-7) three references (RK4 dt ' +
      '1.0374418236e-3, DP45 dt 1.0371840741e-3, RK4 dt/2 1.0371840741e-3) ' +
      'agree at the true min-gap pair 3776 inside the map bracket ' +
      '[1.0e-3, 1.1e-3], but DP45 dt/2 STEPS OVER pair 3776 and continues to a ' +
      'SPURIOUS pair-1495 collision at 1.1923492860e-3 (step 9252), above ' +
      't_c_hi=1.1e-3. Envelope max 1.1923492860e-3 exceeds t_c_hi so the R2 ' +
      'predicate FAILS with slack -9.234929e-5. The imp-35235-class order-5 ' +
      'dt/2 step-over RECURS at N=4000 even on the self-scaling tauC/4000 grid.',
    selfScalingGridNotSufficientAtN4000: true,
    largestN_R2_robustly_certified: 1000,
    priorLargestN_R2_robustly_certified: 1000,
    interpretation:
      'The imp-35324 finer-grid four-of-four clearing is N-fragile: it PERSISTS ' +
      'at N=3000 but the DP45 dt/2 order-5 step-over RECURS at N=4000 on the ' +
      'same tauC/4000 grid. The tauC/4000 grid is self-scaling with tauC by ' +
      'construction, yet the near-gate order-5 sampling invariance does NOT ' +
      'hold at N=4000 -- so higher-N rungs are NOT four-of-four-robust without a ' +
      'higher-resolution or dense-output DP45 dt/2 reference. This REINFORCES ' +
      'keeping the R2 ladder at N=1000.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder past N=1000; does NOT extend the C_mb ' +
      'certificate; does NOT remove the imp-486 GUE conditional; changes NO ' +
      'Lambda bound. No refereed bound is changed.',
    subGap:
      'imp-35353-sub-n4000-dp45-dthalf-stepover: re-run the N=4000 DP45 dt/2 ' +
      'reference on a still-finer base grid (tauC/8000 or tauC/16000) or with ' +
      'the imp-35351 DP45 dense-output interpolated-crossing event to MEASURE ' +
      'whether the pair-3776 collision is then caught in-gate below t_c_hi=1.1e-3 ' +
      '(a within-step pass-through, as at N=2000 per imp-35325) or whether the ' +
      'step-over is intrinsic at N=4000.',
    residualId: 'imp-35353-sub-n4000-dp45-dthalf-stepover',
  },
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35353-n3000-four-of-four-persists',
    holds: () => {
      const refs = N3000.flowReferences;
      const allPair1495 = refs.every((r) => r.pair_index === 1495 && !r.gateSkip);
      const rk4dt = refs.find((r) => r.integrator === 'rk4-order-4' && r.grid === 'dt');
      const dp45dt = refs.find((r) => r.integrator === 'dp45-order-5' && r.grid === 'dt');
      return allPair1495 && rk4dt.t_c === dp45dt.t_c && rk4dt.t_c === 0.0011925014349 &&
        N3000.r2Met === true && N3000.envMax <= N3000.tCHi &&
        Math.abs(N3000.r2Slack - 4.527710e-6) < 1e-11;
    },
    why:
      'PERSISTS: at N=3000 all four references (RK4/DP45 x dt,dt/2) land in the ' +
      '(0, 1e-4) gate at pair 1495 with RK4 dt = DP45 dt tied at 1.1925014349e-3, ' +
      'and the worst-case envelope max clears t_c_hi=1.2e-3 with slack +4.53e-6.',
  },
  {
    id: 'imp35353-n4000-dp45-dthalf-stepover-recurs',
    holds: () => {
      const refs = N4000.flowReferences;
      const clean = refs.filter((r) => !(r.integrator === 'dp45-order-5' && r.grid === 'dt/2'));
      const dp45half = refs.find((r) => r.integrator === 'dp45-order-5' && r.grid === 'dt/2');
      // Three clean references land at the TRUE min-gap pair 3776; DP45 dt/2 steps over to a spurious pair 1495.
      const cleanAt3776 = clean.every((r) => r.pair_index === 3776);
      return cleanAt3776 && dp45half.gateSkip === true && dp45half.pair_index === 1495 &&
        dp45half.t_c === 0.0011923492860 && dp45half.pair_index !== N4000.minGapIdx;
    },
    why:
      'RECURS: at N=4000 the three clean references land at the true min-gap ' +
      'pair 3776, but the DP45 dt/2 reference steps OVER pair 3776 and lands on a ' +
      'SPURIOUS pair-1495 collision at 1.1923492860e-3 -- the imp-35235-class ' +
      'order-5 dt/2 step-over recurring even on the tauC/4000 grid.',
  },
  {
    id: 'imp35353-n4000-envelope-fails-t-c-hi',
    holds: () =>
      N4000.r2Met === false && N4000.envMax > N4000.tCHi &&
      N4000.r2Slack < 0 && Math.abs(N4000.r2Slack - -9.234929e-5) < 1e-10 &&
      N4000.envMax === 0.0011923492860 && N4000.tCHi === 1.1e-3,
    why:
      'BREAKS: because DP45 dt/2 steps over to the spurious pair-1495 event at ' +
      '1.1923492860e-3, the envelope max exceeds the imp-857 map bracket upper ' +
      'endpoint t_c_hi=1.1e-3, so the one-sided R2 predicate FAILS with slack ' +
      '-9.234929e-5 -- the four-of-four clearing does NOT survive to N=4000.',
  },
  {
    id: 'imp35353-n-fragility-contrast',
    holds: () =>
      N3000.r2Met === true && N4000.r2Met === false &&
      N3000.allSamePair === true && N4000.allSamePair === false,
    why:
      'N-FRAGILITY: the imp-35324 finer-grid four-of-four clearing PERSISTS at ' +
      'N=3000 (all references same pair, predicate met) but BREAKS at N=4000 ' +
      '(DP45 dt/2 on a different pair, predicate failed) -- the self-scaling ' +
      'tauC/4000 grid does NOT keep the near-gate order-5 sampling invariant.',
  },
  {
    id: 'imp35353-ladder-not-advanced-no-qed',
    holds: () =>
      IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE.noQED === true &&
      IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE.changesNoBound === true &&
      IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE.verdict.largestN_R2_robustly_certified === 1000 &&
      typeof IMP_35353_R2_N3000_N4000_FINER_GRID_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: never a QED or a bound change. The N=4000 step-over ' +
      'REINFORCES keeping the R2 ladder largest-N-robustly-certified at 1000 ' +
      '(NOT advanced); a named sub-gap is recorded. C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed.',
  },
];
