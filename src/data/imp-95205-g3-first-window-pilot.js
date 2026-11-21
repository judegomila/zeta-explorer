/**
 * imp-95205 — Archive-free Gate lane, G3 first-window pilot: the complete
 * N = 690988 window measured against the stronger pilot sum_j |D_j| < Rex.
 *
 * PROGRAM (paper section 12.1, research-inputs/
 * gomila-zeta-twin-ladder-permutation-architecture-revised.pdf p.24): the
 * paper's own stop/go program does not need the unreplayable anchor literal
 * 0.2141254901198318 (its producing archive, the reference-[19]
 * strict_sub014_extension_v1 replay, was never downloaded — see
 * native/gate2-lane-a/README.md and imp-95013b). G1 asks for a
 * source-closed evaluator of the 25 terms of eq. (13) verified against the
 * direct cocycle; G3 says "prove the complete N = 690988 window first" and
 * tests the stronger pilot sum_j |D_j| < Rex, where "failure of the
 * stronger pilot is a stop signal for independent defect radii, not a
 * disproof of the recombined cocycle gate".
 *
 * WHAT WAS RUN (native/gate2-lane-a, modes pilotg3 + point, 2026-09-09):
 * the locked-convention Lane-A evaluator (bnHasT0, bnOnBoth, frozenChart,
 * real gamma_at — the delivered-audit convention of imp-95013b) on a
 * 300001-point grid over the complete window x = 4pi(N^2 - t0/16 +
 * w(2N+1)), w in [0,1] (w=1 is the seam x_{N+1}), evaluated in BOTH
 * one-sided seam charts (chart 690988 and chart 690989), plus a 3-level
 * zoom refinement (12,288 extra evaluations) around the top-16 grid maxima
 * of each metric down to ~0.057 x-resolution (below the ~0.47 fastest
 * oscillation scale). 612,290 dd evaluations, 714.3 s wall on 10 threads.
 *
 * G1 RE-VERIFICATION (telescope + high-precision spot audit):
 *  - the eq-(13) 25-defect telescope identity sum_j D_j = E97 held to
 *    8.02e-14 (max over all 612,290 dd evaluations);
 *  - mpmath replay at 166 / 199 / 265 bits (dps 50/60/80; the paper's G1
 *    asks 160/192/256) at three representative points (w=0 own chart,
 *    w=1/2 own chart, w=1 seam in the cross chart 690989): the mp telescope
 *    identity closes to 8e-49 / 1e-59 / 8e-79, and the dd lane agrees with
 *    mp to <= 1.3e-16 absolute on |E97|, <= 1.7e-14 on the pilot, and
 *    <= 1.3e-14 on every individual defect D_j; double-rounding of the
 *    chart constants contributes only ~4e-18.
 *
 * RESULT — verdict (a) ON SAMPLED POINTS: the stronger pilot CLEARS.
 *  sup(sampled) sum_j |D_j| = 0.2437541384450471  <  Rex = 0.2796881955526244
 *    (margin 0.0359, 12.8% of Rex; at w = 0.5245, chart 690988,
 *     x - x_N = 9,108,174.78)
 *  sup(sampled) |E97|       = 0.1934424506064475  <  Rex
 *    (margin 0.0862, 30.8% of Rex; at w = 0.0533, chart 690989,
 *     x - x_N = 925,167.77)
 * On every sampled point of window 1 the independent defect radii suffice:
 * no recombination is needed at any sampled x. The two seam charts agree to
 * ~5e-7 at equal x (the cross chart adds one term of amplitude ~1.3e-6).
 *
 * HONEST SCOPE (why this is a measurement, NOT the G3 proof):
 *  - SAMPLED sup only: the fastest ladder phase (x/2) ln N turns ~62 times
 *    per grid step (~1.48e6 turns across the window), so the grid is an
 *    equidistributed sample of the phase torus, not a continuum cover. The
 *    zoom refinement raised the grid sup by 2.2% (0.23852 -> 0.24375),
 *    which is direct evidence that the continuum sup exceeds any sampled
 *    sup; the open extrapolation question is whether it stays below Rex.
 *    Certifying sup_{x in W_N} needs the interval lane (Arb/ball
 *    enclosures over x-cells — the paper's G4/G5 batching), not more
 *    samples.
 *  - dd precision, double accumulation with Kahan: total numeric error
 *    ~1e-14 (measured against mpmath) — nine orders below the margins, so
 *    the verdict is not numerical noise, but it is not interval-rigorous.
 *  - CONVENTION scope: this is the G1-satisfying source-closed evaluator's
 *    locked convention, which does NOT reproduce the paper's anchor
 *    literal (imp-95013b: best convention within 49%). The measured window
 *    sup |E97| = 0.1934 sits BELOW that anchor literal 0.2141, consistent
 *    with the earlier 25,200-point hunt (max 0.18603 near X). If the [19]
 *    replay convention differs materially, its window sups could differ.
 *  - Window 1 only: the open family is 690988 <= N <= 54799999; nothing
 *    here covers N > 690988.
 * Grade: MEASUREMENT (dd, sampled). Changes no bound; closes no gap;
 * NO QED. No refereed bound is changed.
 */

// ── frozen program constants (paper eqs (13), (19); imp-95012) ───────────────
export const REX_EXACT = 0.2796881955526244146123; // eq (19)
export const UNREPLAYABLE_ANCHOR_LITERAL = 0.2141254901198318; // NOT used as a gate here
export const G3_WINDOW_N = 690988;

// ── the measured run (frozen; native/gate2-lane-a ./gate2 pilotg3 300001 10) ─
export const G3_PILOT_RUN = Object.freeze({
  date: '2026-09-09',
  binary: 'native/gate2-lane-a/main.c (modes pilotg3, point)',
  convention: 'locked delivered-audit convention: b_n = exp((t0/4)ln^2 n) on both ladders, frozen chart constants, real gamma_at (imp-95013b)',
  grid: Object.freeze({
    npts: 300001,
    seamSides: 2, // chart 690988 (own) and chart 690989 (cross), same x
    gridEvaluations: 600002,
    zoomEvaluations: 12288, // top-16 per metric, 3 levels x 128 pts
    totalEvaluations: 612290,
    gridStepX: 57.888117,
    fastestPhaseTurnsPerStep: 61.94, // (gridStepX/2)*ln(690988) / (2*pi)
    zoomFinalResX: 0.057425, // below the ~0.47 fastest-oscillation scale
  }),
  wallSeconds: 714.3,
  threads: 10,
});

// sampled suprema over the complete window, both seam charts (16-digit dd)
export const G3_SUPS = Object.freeze({
  supPilot: Object.freeze({
    value: 0.2437541384450471, // sup(sampled) sum_j |D_j|  — the G3 pilot quantity
    w: 0.52447003038,
    side: 0, // chart 690988
    xMinusXN: 9108174.77728,
  }),
  supE97: Object.freeze({
    value: 0.1934424506064475, // sup(sampled) |E97| — the (H4)-relevant recombined cocycle
    w: 0.053273326334,
    side: 1, // chart 690989 (cross); own chart gives 0.1910870 at the same w
    xMinusXN: 925167.767677,
  }),
  gridOnlySupPilot: 0.2385166894862974, // before zoom refinement (+2.2% from zoom)
  gridOnlySupE97: 0.1910870321380843,
  seamChartPairAgreement: 5e-7, // |value(chart N) - value(chart N+1)| at equal x, top records
});

// ── G1 re-verification: telescope identity + high-precision spot audit ───────
export const G1_TELESCOPE_VERIFICATION = Object.freeze({
  ddMaxTelescopeErr: 8.018967e-14, // max |sum_j D_j - E97| over all 612,290 evaluations
  atW: 0.73001,
  atSide: 0,
  // mpmath replay at three representative points (dps 50/60/80 = 166/199/265
  // bits; the paper's G1 asks 160/192/256). Two variants: ddmatch (chart
  // constants rounded to the C doubles) and exact (full-precision constants).
  mpAudit: Object.freeze([
    Object.freeze({
      point: 'w=0 (x = x_N), chart 690988',
      ddAbsE97: 9.16579142228319058e-3,
      ddPilot: 0.142332892659016691,
      mpAbsE97: 9.16579142228306638e-3, // dps 50/60/80 identical to 20 digits
      mpPilot: 0.14233289265901437,
      mpTelescopeErr: 8.18e-49, // and 1.16e-59 at dps 60, 8.01e-79 at dps 80
      ddVsMpAbsE97: 1.24e-16,
      ddVsMpPilot: 2.32e-15,
      ddVsMpMaxDefect: 4.93e-15,
    }),
    Object.freeze({
      point: 'w=1/2 (window center), chart 690988',
      ddAbsE97: 4.62556696710627047e-2,
      ddPilot: 0.138575914857897442,
      mpAbsE97: 4.62556696710626008e-2,
      mpPilot: 0.138575914857901873,
      mpTelescopeErr: 4.74e-49,
      ddVsMpAbsE97: 1.04e-16,
      ddVsMpPilot: 4.43e-15,
      ddVsMpMaxDefect: 6.16e-15,
    }),
    Object.freeze({
      point: 'w=1 (seam x_{N+1}), cross chart 690989',
      ddAbsE97: 7.32158861470641742e-2,
      ddPilot: 0.110697564393809122,
      mpAbsE97: 7.32158861470642395e-2,
      mpPilot: 0.110697564393825861,
      mpTelescopeErr: 3.6e-49,
      ddVsMpAbsE97: 6.53e-17,
      ddVsMpPilot: 1.67e-14,
      ddVsMpMaxDefect: 1.23e-14,
    }),
  ]),
  chartConstantDoubleRoundingEffect: 4e-18, // ddmatch vs exact variants on |E97|
  fastPathCrossValidation: 'eval_fast vs eval_E97 agree to <= 1e-11 at 8 scattered points (binary aborts otherwise)',
});

// top sampled pilot records (both seam charts at each w; pilot >= |E97| pointwise)
export const G3_TOP_BY_PILOT = Object.freeze([
  Object.freeze({ w: 0.860403333333, side: 0, pilot: 0.2385166894862974, absE97: 0.1719214473439036 }),
  Object.freeze({ w: 0.860403333333, side: 1, pilot: 0.2385149406780994, absE97: 0.1719219493888117 }),
  Object.freeze({ w: 0.82553, side: 0, pilot: 0.2342261097822044, absE97: 0.1896995086343191 }),
  Object.freeze({ w: 0.82553, side: 1, pilot: 0.2342259339433596, absE97: 0.1896995668685979 }),
  Object.freeze({ w: 0.5865, side: 0, pilot: 0.2321760180103867, absE97: 0.1540259257770509 }),
  Object.freeze({ w: 0.030043333333, side: 0, pilot: 0.2313143842188016, absE97: 0.0681784984066611 }),
]);

// ── verdict ───────────────────────────────────────────────────────────────────
export const IMP95205_G3_FIRST_WINDOW_PILOT = Object.freeze({
  ticket: 'imp-95205',
  parentTickets: ['imp-95012', 'imp-95013b', 'imp-95011'],
  source:
    'native/gate2-lane-a pilotg3/point (built this ticket); paper section 12.1 (G1/G3) of ' +
    'research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf; mpmath 1.4.1 spot audit',
  lane: 'archive-free G3 (no anchor-literal gate: the section 12.1 program does not need the unreplayable 0.2141254901198318)',
  verdictCategory: 'a-sampled',
  pilotVerdict: 'PASS on all 612,290 sampled points: sup(sampled) sum_j |D_j| = 0.2437541384450471 < Rex = 0.2796881955526244 (margin 12.8% of Rex) — independent defect radii suffice at every sampled x of window 1',
  e97Verdict: 'CLEARS: sup(sampled) |E97| = 0.1934424506064475 < Rex (margin 30.8% of Rex); no red flag for the recombined cocycle contract on window 1',
  marginPilot: 0.0359340571075773, // Rex - supPilot
  marginE97: 0.0862457449461769, // Rex - supE97
  extrapolationQuestion:
    'open: (i) does the CONTINUUM sup of the pilot on window 1 stay below Rex? The zoom refinement raised the ' +
    'sampled sup 2.2% (0.23852 -> 0.24375), so the sampled sup is a strict underestimate; the 12.8% margin must ' +
    'absorb the sampling gap of a ~1.48e6-oscillation window sampled at 6.1e5 points. (ii) how do the window sups ' +
    'scale over the open family 690988 <= N <= 54799999 (the imp-95011 probe question)? Certification of (i) needs ' +
    'the interval lane (Arb ball enclosures over x-cells, paper G4/G5 batching), not more dd samples.',
  isRigorous: false,
  isCertificate: false,
  grade: 'measurement (dd precision, sampled sup)',
  promotesBound: false,
  verdict:
    'G3 first-window pilot EXECUTED archive-free (verdict (a) on sampled points): on a 300001-point grid over the ' +
    'complete N = 690988 window (both one-sided seam charts) plus sub-oscillation zoom refinement — 612,290 dd ' +
    'evaluations, 714 s — the stronger pilot sum_j |D_j| never reaches Rex: sampled sup 0.2437541384450471 vs ' +
    'Rex 0.2796881955526244 (12.8% margin), and the recombined |E97| tops out at 0.1934424506064475 (30.8% margin). ' +
    'G1 re-verified: the eq-(13) telescope identity held to 8.02e-14 in every dd evaluation and closed to 8e-49 / ' +
    '1e-59 / 8e-79 in mpmath replays at 166/199/265 bits, with dd-vs-mp agreement <= 1.3e-16 on |E97| and ' +
    '<= 1.7e-14 on the pilot at three representative points. SAMPLED sup only (the fastest phase turns ~62x per ' +
    'grid step, and refinement provably raised the sup), under OUR locked convention (which does not reproduce the ' +
    'paper anchor literal); the continuum-sup statement and the 54,109,011 remaining windows stay open, and ' +
    'certification needs the interval lane. Measurement only; changes no bound; NO QED; no refereed bound is changed' +
    '.',
});

// ── assertions (self-executing; import-light; throw on violation) ─────────────
export const IMP95205_ASSERTIONS = [
  {
    id: 'imp95205-pilot-clears-rex-with-recomputed-margin',
    description:
      'the sampled sup of the stronger pilot sits below Rex, and the frozen margin literals recompute exactly from the frozen sups (double arithmetic, 1e-15 tolerance on O(0.1) quantities)',
    holds: () =>
      G3_SUPS.supPilot.value < REX_EXACT &&
      G3_SUPS.supE97.value < REX_EXACT &&
      Math.abs(REX_EXACT - G3_SUPS.supPilot.value - IMP95205_G3_FIRST_WINDOW_PILOT.marginPilot) < 1e-15 &&
      Math.abs(REX_EXACT - G3_SUPS.supE97.value - IMP95205_G3_FIRST_WINDOW_PILOT.marginE97) < 1e-15,
  },
  {
    id: 'imp95205-pilot-dominates-e97',
    description:
      'triangle-inequality sanity: sum_j |D_j| >= |sum_j D_j| = |E97|, so the pilot sup dominates the E97 sup and every frozen top record has pilot > absE97',
    holds: () =>
      G3_SUPS.supPilot.value > G3_SUPS.supE97.value &&
      G3_TOP_BY_PILOT.every((r) => r.pilot > r.absE97),
  },
  {
    id: 'imp95205-zoom-raised-grid-sup',
    description:
      'the zoom refinement raised both sampled sups above their grid-only values (the sampled sup is a strict underestimate of the continuum sup — the honesty basis of the extrapolation question)',
    holds: () =>
      G3_SUPS.supPilot.value > G3_SUPS.gridOnlySupPilot &&
      G3_SUPS.supE97.value > G3_SUPS.gridOnlySupE97 &&
      (G3_SUPS.supPilot.value - G3_SUPS.gridOnlySupPilot) / G3_SUPS.gridOnlySupPilot < 0.05,
  },
  {
    id: 'imp95205-telescope-error-budget',
    description:
      'G1 telescope re-verification: dd max error 8.02e-14 and mp telescope closure <= 1e-48 both sit >= 11 orders below the pilot margin, so the verdict is not numerical noise',
    holds: () =>
      G1_TELESCOPE_VERIFICATION.ddMaxTelescopeErr < 1e-12 &&
      G1_TELESCOPE_VERIFICATION.mpAudit.every((p) => p.mpTelescopeErr < 1e-48) &&
      G1_TELESCOPE_VERIFICATION.ddMaxTelescopeErr <
        IMP95205_G3_FIRST_WINDOW_PILOT.marginPilot * 1e-11,
  },
  {
    id: 'imp95205-dd-vs-mp-agreement',
    description:
      'the dd lane agrees with the 166/199/265-bit mpmath replay to <= 1.3e-16 on |E97|, <= 1.7e-14 on the pilot, and <= 1.3e-14 per defect at all three representative points (and dd vs mp literals here match to storage precision 5e-15)',
    holds: () =>
      G1_TELESCOPE_VERIFICATION.mpAudit.every(
        (p) =>
          p.ddVsMpAbsE97 < 2e-16 &&
          p.ddVsMpPilot < 2e-14 &&
          p.ddVsMpMaxDefect < 2e-14 &&
          Math.abs(p.ddAbsE97 - p.mpAbsE97) < 5e-15 &&
          Math.abs(p.ddPilot - p.mpPilot) < 5e-14
      ),
  },
  {
    id: 'imp95205-sampling-honesty-flags',
    description:
      'the grid undersamples the fastest oscillation by ~62x and the record says so: grade is a sampled-sup measurement, not a certificate, promotes no bound',
    holds: () =>
      G3_PILOT_RUN.grid.fastestPhaseTurnsPerStep > 50 &&
      G3_PILOT_RUN.grid.zoomFinalResX < 0.47 &&
      IMP95205_G3_FIRST_WINDOW_PILOT.isCertificate === false &&
      IMP95205_G3_FIRST_WINDOW_PILOT.isRigorous === false &&
      IMP95205_G3_FIRST_WINDOW_PILOT.promotesBound === false &&
      /sampled/i.test(IMP95205_G3_FIRST_WINDOW_PILOT.grade),
  },
  {
    id: 'imp95205-grid-step-recomputation',
    description:
      'the frozen grid geometry recomputes: gridStepX = 4*pi*(2N+1)/(npts-1) and the fastest-phase turns per step = gridStepX*ln(N)/(4*pi) match the frozen literals (storage precision 1e-2 on 6-7-sig-fig fields)',
    holds: () => {
      const step = (4 * Math.PI * (2 * G3_WINDOW_N + 1)) / (G3_PILOT_RUN.grid.npts - 1);
      const turns = (step * Math.log(G3_WINDOW_N)) / (4 * Math.PI);
      return (
        Math.abs(step - G3_PILOT_RUN.grid.gridStepX) < 1e-4 &&
        Math.abs(turns - G3_PILOT_RUN.grid.fastestPhaseTurnsPerStep) < 1e-2 &&
        G3_PILOT_RUN.grid.totalEvaluations ===
          G3_PILOT_RUN.grid.gridEvaluations + G3_PILOT_RUN.grid.zoomEvaluations
      );
    },
  },
  {
    id: 'imp95205-anchor-context-not-a-gate',
    description:
      'convention-scope honesty: the unreplayable anchor literal is carried for context only (window sup |E97| under OUR convention sits below it, consistent with the imp-95013b convention gap), and this lane is declared anchor-free',
    holds: () =>
      G3_SUPS.supE97.value < UNREPLAYABLE_ANCHOR_LITERAL &&
      UNREPLAYABLE_ANCHOR_LITERAL < REX_EXACT &&
      /archive-free/.test(IMP95205_G3_FIRST_WINDOW_PILOT.lane) &&
      /does not reproduce the paper anchor literal/.test(IMP95205_G3_FIRST_WINDOW_PILOT.verdict),
  },
  {
    id: 'imp95205-honesty-gate-no-qed',
    description: 'NO QED, no refereed bound is changed, verdict category is (a) restricted to sampled points, extrapolation question named',
    holds: () =>
      IMP95205_G3_FIRST_WINDOW_PILOT.verdictCategory === 'a-sampled' &&
      /NO QED/.test(IMP95205_G3_FIRST_WINDOW_PILOT.verdict) &&
      /refereed bound is changed/i.test(IMP95205_G3_FIRST_WINDOW_PILOT.verdict) &&
      /interval lane/.test(IMP95205_G3_FIRST_WINDOW_PILOT.extrapolationQuestion),
  },
];

for (const a of IMP95205_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95205-g3-first-window-pilot assertion failed: ${a.id}`);
  }
}

export default IMP95205_G3_FIRST_WINDOW_PILOT;
