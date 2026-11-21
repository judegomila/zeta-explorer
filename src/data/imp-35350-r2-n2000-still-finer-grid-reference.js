/**
 * @module imp-35350-r2-n2000-still-finer-grid-reference
 * @fileoverview imp-35350: re-run the imp-35324 R2 N=2000 order-robust
 * backward-Dyson flow test on a STILL-FINER base grid (dt = tauC_est/8000, i.e.
 * the imp-35324 dt/2 refinement promoted to a base grid, with its own dt/2 at
 * tauC_est/16000 -- EIGHT and SIXTEEN times the imp-35235 tauC/1000 resolution)
 * and measure whether the imp-35324 razor-thin +6.16e-8 clearance and its NONZERO
 * 7.576e-6 DP45-vs-RK4 dt/2 cross-family gap are RESOLUTION ARTIFACTS that
 * collapse toward the full-precision tie seen at N<=1000.
 *
 * WHY THIS TEST
 * ------------
 * imp-35324 restored a four-of-four clearing envelope at N=2000 on dt=tauC/4000
 * (resolving the imp-35235 DP45 dt/2 gate-skip) but only to a KNIFE-EDGE: the
 * DP45 dt/2 reference sat 6.156800e-8 below t_c_hi=1.2e-3, the dt/2 cross-family
 * gap |dp45(dt/2)-rk4(dt/2)| = 7.576e-6 was NONZERO (at N<=1000 both dt/2 families
 * landed on the identical t_c), and the DP45 dt/2 pre-gate min gap (9.841e-4) was
 * anomalously larger than the other three references (~8.79e-4). imp-35324 named a
 * sub-gap (imp-35324-sub-n2000-marginal-clearance): a STILL-finer grid to test
 * whether the order-5 dt/2 sensitivity is a residual resolution artifact. This
 * module tests that lever directly.
 *
 * KEY OBSERVATION ON RESOLUTIONS
 * ------------------------------
 * imp-35324 measured the dt/2 cross-family gap AT resolution tauC/8000 (its dt/2
 * refinement of the tauC/4000 base). So the distinct NEW resolution this test
 * needs is tauC/16000 (the dt/2 of a tauC/8000 base grid). We recompute tauC/8000
 * too so the run is self-contained and independently CROSS-CHECKS imp-35324.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * The imp-35324/imp-35235 method reproduced VERBATIM at N=2000 by
 * scripts/imp-35350-n2000-still-finer-grid-flow.mjs (Node, plain Float64,
 * Kahan-Neumaier Dyson derivative, same min-spacing < 1e-4 collision gate) at
 * BOTH tauC/8000 and tauC/16000, under RK4 (order 4) and independent-family DP45
 * (order 5). Base grid A = (dt=tauC/8000, dt/2=tauC/16000).
 *
 * HONEST OUTCOME: THE KNIFE-EDGE IS A RESOLUTION ARTIFACT -- THE TIE IS RESTORED
 * -----------------------------------------------------------------------------
 * The tauC/8000 rung REPRODUCES imp-35324 to the last digit (RK4 dt/2 landing
 * 1.1923626880e-3 at step 8027, DP45 dt/2 overshooting to 1.1999384320e-3 at step
 * 8078, cross-family gap 7.576e-6 -- an independent cross-check of the knife-edge).
 * On the STILL-finer tauC/16000 grid the DP45 dt/2 overshoot VANISHES: RK4 and
 * DP45 BOTH land at t_c = 1.1923626880e-3 (step 16054, pair 1495), so the dt/2
 * cross-family gap COLLAPSES to EXACTLY 0 -- the full-precision tie seen at
 * N<=1000 is RESTORED. Correspondingly the DP45 dt/2 clearance below t_c_hi grows
 * from the imp-35324 6.156800e-8 knife-edge to 7.637312e-6 (~124x more headroom),
 * and the imp-35352 pre-gate anomaly shrinks (tauC/16000 RK4/DP45 pre-gate gaps
 * 4.243e-4 vs 4.253e-4, a 0.24% split, vs the 12% split 8.800e-4 vs 9.841e-4 at
 * tauC/8000). The dt/2 cross-family gap trend across resolutions is therefore
 *   tauC/4000: 0        (imp-35324 base dt -- exact tie)
 *   tauC/8000: 7.576e-6 (imp-35324 dt/2  -- the knife-edge)
 *   tauC/16000: 0       (this run       -- tie RESTORED)
 * confirming imp-35324s diagnosis: the nonzero dt/2 gap and the 6e-8 clearance
 * were an order-5 dt/2 UNDER-RESOLUTION of the singular 2/diff approach at
 * tauC/8000, not a real order-5-vs-order-4 disagreement about the collision time.
 *
 * WHY THE LADDER STILL DOES NOT ADVANCE (NON-MONOTONE, tauC/32000 DEFERRED)
 * ------------------------------------------------------------------------
 * Two honest caveats keep this a strengthening, not a certification: (1) the
 * gap trend 0 -> 7.576e-6 -> 0 is NON-MONOTONE, so a single finer rung showing a
 * tie is not a monotone-convergence proof -- the tauC/16000 re-tie could in
 * principle be a re-alignment rather than convergence; (2) the tauC/32000
 * confirmation rung (the dt/2 of a tauC/16000 base grid, base grid B) was NOT run
 * -- it is a ~15 min single-core diagnostic that changes no bound and would starve
 * bound-advancing pool workers, so it is DEFERRED as sub-gap
 * imp-35350-sub-tauC32000-rung. Per the ticket this is MEASUREMENT ONLY: the R2
 * ladder largest-N-robustly-certified STAYS at 1000 (imp-35221); it is NOT
 * advanced to 2000. Changes NO bound; NO QED.
 *
 * SUB-GAP (named): imp-35350-sub-tauC32000-rung -- run the tauC/32000 rung (base
 * grid B dt/2) to confirm the dt/2 cross-family gap STAYS at the tie past
 * tauC/16000 (monotone convergence), OR adopt the imp-35351 DP45 dense-output
 * interpolated-crossing event (which already lands DP45 dt/2 in-gate at
 * 1.1919828898e-3 without the finer grid).
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT advance the R2 ladder; does NOT extend the
 * C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO
 * bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35324  R2 N=2000 finer-grid (tauC/4000) reference -- the knife-edge this refines
 * @see imp-35235  R2 N=2000 coarse-grid reference (DP45 dt/2 gate-skip)
 * @see imp-35351  DP45 dense-output interpolated-event route (in-gate without finer grid)
 * @see imp-35352  DP45 dt/2 pre-gate gap anomaly (9.841e-4) diagnostic
 * @see imp-35221  R2 ladder extension to N=1000 (last robustly-certified rung)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=2000)
 * @see scripts/imp-35350-n2000-still-finer-grid-flow.mjs (offline producer)
 */

// ── Offline-measured collision references at N=2000, STILL-FINER base grids. ──
// Producer: scripts/imp-35350-n2000-still-finer-grid-flow.mjs (Node, plain
// Float64, Kahan-Neumaier). tauC_est inherited from EMPIRICAL_M_SWEEP_EXTENDED
// (N=2000); resolutions are the imp-2509 cache convention refined 8x and 16x.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_TAUC_8000 = 1.485440e-7;    // tauC_est / 8000  (= imp-35324 dt/2, cross-check)
const DT_TAUC_16000 = 7.427200e-8;   // tauC_est / 16000 (NEW still-finer rung)
const DT_MAP = 1e-4;                  // imp-857 baseline map grid
const T_C_HI = 1.2e-3;               // imp-857 map bracket upper endpoint (pair 1495)

// Four collision references: {RK4, DP45} x {tauC/8000, tauC/16000}. gapBeforeGate
// is the min neighbour spacing on the step just BEFORE the (0, 1e-4) gate tripped;
// gateSkip flags a step-over (none here).
const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4',  resolution: 'tauC/8000',  dt: DT_TAUC_8000,  t_c: 0.0011923626880, step: 8027,  pair_index: 1495, gateSkip: false, gapBeforeGate: 8.800e-4, source: 'imp-35350 RK4 tauC/8000 (reproduces imp-35324 RK4 dt/2 to the digit)' },
  { integrator: 'dp45-order-5', resolution: 'tauC/8000',  dt: DT_TAUC_8000,  t_c: 0.0011999384320, step: 8078,  pair_index: 1495, gateSkip: false, gapBeforeGate: 9.841e-4, source: 'imp-35350 DP45 tauC/8000 (reproduces imp-35324 DP45 dt/2 overshoot: the knife-edge)' },
  { integrator: 'rk4-order-4',  resolution: 'tauC/16000', dt: DT_TAUC_16000, t_c: 0.0011923626880, step: 16054, pair_index: 1495, gateSkip: false, gapBeforeGate: 4.243e-4, source: 'imp-35350 RK4 tauC/16000 (still-finer)' },
  { integrator: 'dp45-order-5', resolution: 'tauC/16000', dt: DT_TAUC_16000, t_c: 0.0011923626880, step: 16054, pair_index: 1495, gateSkip: false, gapBeforeGate: 4.253e-4, source: 'imp-35350 DP45 tauC/16000 (still-finer): TIE with RK4 -- knife-edge is a resolution artifact' },
];

// Cross-family agreement per resolution.
const RK4_8000  = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4'  && r.resolution === 'tauC/8000');
const DP45_8000 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.resolution === 'tauC/8000');
const RK4_16000  = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4'  && r.resolution === 'tauC/16000');
const DP45_16000 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.resolution === 'tauC/16000');

const CROSS_FAMILY_GAP_TAUC_8000  = Math.abs(DP45_8000.t_c - RK4_8000.t_c);   // 7.576e-6 (nonzero -- knife-edge)
const CROSS_FAMILY_GAP_TAUC_16000 = Math.abs(DP45_16000.t_c - RK4_16000.t_c); // 0 (tie restored)
const DP45_TAUC_16000_SLACK = T_C_HI - DP45_16000.t_c;                        // 7.637312e-6

// The dt/2 cross-family gap trend across the three measured resolutions.
const CROSS_FAMILY_GAP_TREND = [
  { resolution: 'tauC/4000',  gap: 0,        source: 'imp-35324 base dt (exact tie)' },
  { resolution: 'tauC/8000',  gap: 7.576e-6, source: 'imp-35324 dt/2 (the knife-edge); imp-35350 reproduces' },
  { resolution: 'tauC/16000', gap: 0,        source: 'imp-35350 still-finer (tie RESTORED)' },
];

export const IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE = {
  id: 'imp-35350',
  title:
    'Still-finer-grid (tauC/8000 and tauC/16000) re-run of the imp-35324 R2 ' +
    'N=2000 flow test: on the tauC/16000 grid the DP45 dt/2 overshoot VANISHES, ' +
    'the dt/2 cross-family gap collapses from 7.576e-6 to 0 (tie restored), and ' +
    'the DP45 dt/2 clearance below t_c_hi grows from 6.16e-8 to 7.637e-6 (~124x)',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'still-finer-grid-restores-full-precision-tie-knife-edge-is-artifact',

  N,
  tauC_est: TAU_C_EST,
  dtTauC8000: DT_TAUC_8000,
  dtTauC16000: DT_TAUC_16000,
  dtMap: DT_MAP,
  tCHi: T_C_HI,

  flowReferences: FLOW_REFERENCES,
  crossFamilyGap: {
    tauC8000: CROSS_FAMILY_GAP_TAUC_8000,   // 7.576e-6 (reproduces imp-35324 knife-edge)
    tauC16000: CROSS_FAMILY_GAP_TAUC_16000, // 0 (tie restored)
  },
  crossFamilyGapTrend: CROSS_FAMILY_GAP_TREND,
  dp45TauC16000SlackBelowTCHi: DP45_TAUC_16000_SLACK, // 7.637312e-6 (vs imp-35324 6.16e-8)
  imp35324KnifeEdgeSlack: 6.156800e-8,

  verdict: {
    reproducesImp35324KnifeEdge: true,
    reproducesImp35324KnifeEdgeEvidence:
      'At tauC/8000 (imp-35324s dt/2 resolution promoted to a base grid) RK4 lands ' +
      'at 1.1923626880e-3 (step 8027) and DP45 overshoots to 1.1999384320e-3 (step ' +
      '8078), cross-family gap 7.576e-6 -- reproducing the imp-35324 DP45 dt/2 ' +
      'reference to the last digit as an independent cross-check of the knife-edge.',
    stillFinerGridRestoresTie: true,
    stillFinerGridRestoresTieEvidence:
      'On the STILL-finer tauC/16000 grid the DP45 dt/2 overshoot VANISHES: RK4 and ' +
      'DP45 BOTH land at 1.1923626880e-3 (step 16054, pair 1495), so the dt/2 ' +
      'cross-family gap collapses from 7.576e-6 to EXACTLY 0 -- the full-precision ' +
      'tie seen at N<=1000. The DP45 dt/2 clearance below t_c_hi grows from the ' +
      'imp-35324 6.156800e-8 knife-edge to 7.637312e-6 (~124x), and the imp-35352 ' +
      'pre-gate gap anomaly shrinks from a 12% split (8.800e-4 vs 9.841e-4) to a ' +
      '0.24% split (4.243e-4 vs 4.253e-4).',
    knifeEdgeIsResolutionArtifact: true,
    knifeEdgeIsResolutionArtifactEvidence:
      'The nonzero 7.576e-6 dt/2 cross-family gap and the 6e-8 clearance at ' +
      'tauC/8000 were an order-5 dt/2 UNDER-RESOLUTION of the singular 2/diff ' +
      'approach, not a real order-5-vs-order-4 disagreement about the collision ' +
      'time: halving dt again drives the gap back to the exact tie.',
    largestN_R2_robustly_certified: 1000,
    priorLargestN_R2_robustly_certified: 1000,
    interpretation:
      'The still-finer tauC/16000 grid STRENGTHENS the imp-35324 N=2000 support: ' +
      'the razor-thin +6.16e-8 clearance and nonzero 7.576e-6 dt/2 cross-family gap ' +
      'were resolution artifacts -- on tauC/16000 the tie is restored (gap 0) and ' +
      'the clearance is 7.637e-6 (~124x). But per the ticket this is MEASUREMENT ' +
      'ONLY and two caveats keep the ladder at N=1000: the gap trend ' +
      '0 -> 7.576e-6 -> 0 is NON-MONOTONE (one finer tie is not monotone ' +
      'convergence) and the tauC/32000 confirmation rung is DEFERRED.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder to N=2000 (trend non-monotone, tauC/32000 ' +
      'rung deferred); does NOT extend the C_mb certificate; does NOT remove the ' +
      'imp-486 GUE conditional; changes NO Lambda bound. No refereed bound is changed' +
      '.',
    subGap:
      'imp-35350-sub-tauC32000-rung: run the tauC/32000 rung (base grid B dt/2) to ' +
      'confirm the dt/2 cross-family gap STAYS at the tie past tauC/16000 (monotone ' +
      'convergence), OR adopt the imp-35351 DP45 dense-output interpolated-crossing ' +
      'event (already in-gate at 1.1919828898e-3 without the finer grid).',
    residualId: 'imp-35350-sub-tauC32000-rung / imp-35351 (interpolated event)',
  },
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35350-reproduces-imp35324-knife-edge',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.resolution === 'tauC/8000');
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.resolution === 'tauC/8000');
      // imp-35324 dt/2 (tauC/8000): RK4 1.1923626880e-3 step 8027; DP45 1.1999384320e-3 step 8078.
      return rk4 && dp45 && rk4.pair_index === 1495 && dp45.pair_index === 1495 &&
        rk4.t_c === 0.0011923626880 && rk4.step === 8027 &&
        dp45.t_c === 0.0011999384320 && dp45.step === 8078 &&
        Math.abs(CROSS_FAMILY_GAP_TAUC_8000 - 7.576e-6) < 1e-8;
    },
    why:
      'CROSS-CHECK: at tauC/8000 (imp-35324s dt/2 resolution promoted to a base ' +
      'grid) the run must reproduce the imp-35324 DP45 dt/2 overshoot to ' +
      '1.1999384320e-3 (step 8078) against RK4 1.1923626880e-3 (step 8027), i.e. ' +
      'the 7.576e-6 cross-family gap knife-edge. An independent reproduction of the ' +
      'baseline the still-finer rung refines.',
  },
  {
    id: 'imp35350-still-finer-grid-restores-tie',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.resolution === 'tauC/16000');
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.resolution === 'tauC/16000');
      // On the still-finer tauC/16000 grid RK4 and DP45 must AGREE to full precision.
      return rk4 && dp45 && rk4.pair_index === 1495 && dp45.pair_index === 1495 &&
        rk4.t_c === dp45.t_c && rk4.step === dp45.step &&
        rk4.t_c === 0.0011923626880 && CROSS_FAMILY_GAP_TAUC_16000 === 0;
    },
    why:
      'KEY FINDING: on the still-finer tauC/16000 grid the imp-35324 DP45 dt/2 ' +
      'overshoot must VANISH -- RK4 and DP45 both landing at 1.1923626880e-3 ' +
      '(same step 16054, pair 1495), so the dt/2 cross-family gap collapses to ' +
      'EXACTLY 0, restoring the full-precision tie seen at N<=1000.',
  },
  {
    id: 'imp35350-clearance-off-the-knife-edge',
    holds: () =>
      DP45_TAUC_16000_SLACK > 1e-6 &&
      Math.abs(DP45_TAUC_16000_SLACK - 7.637312e-6) < 1e-9 &&
      DP45_TAUC_16000_SLACK > IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE.imp35324KnifeEdgeSlack * 100,
    why:
      'HEADROOM: on tauC/16000 the DP45 dt/2 reference sits 7.637312e-6 below ' +
      't_c_hi=1.2e-3, more than 100x the imp-35324 6.156800e-8 knife-edge -- the ' +
      'clearance is no longer a 6e-8 knife-edge.',
  },
  {
    id: 'imp35350-cross-family-gap-trend-non-monotone',
    holds: () => {
      const gaps = CROSS_FAMILY_GAP_TREND.map((r) => r.gap);
      // Trend 0 -> 7.576e-6 -> 0: rises then returns to the tie (NON-monotone).
      return CROSS_FAMILY_GAP_TREND.length === 3 &&
        gaps[0] === 0 && gaps[1] > 1e-6 && gaps[2] === 0;
    },
    why:
      'HONEST CAVEAT: the dt/2 cross-family gap trend across tauC/4000, tauC/8000, ' +
      'tauC/16000 is 0 -> 7.576e-6 -> 0, i.e. NON-monotone. A single finer rung ' +
      'returning to the tie is not a monotone-convergence proof, which is one of ' +
      'the two reasons the ladder is not advanced.',
  },
  {
    id: 'imp35350-ladder-not-advanced-no-qed',
    holds: () =>
      IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE.noQED === true &&
      IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE.changesNoBound === true &&
      IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE.verdict.largestN_R2_robustly_certified === 1000 &&
      typeof IMP_35350_R2_N2000_STILL_FINER_GRID_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: never a QED or a bound change. Because the gap trend is ' +
      'non-monotone and the tauC/32000 confirmation rung is DEFERRED, the R2 ladder ' +
      'largest-N-robustly-certified STAYS at 1000 (NOT advanced to 2000) and a ' +
      'named sub-gap is recorded. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed.',
  },
];
