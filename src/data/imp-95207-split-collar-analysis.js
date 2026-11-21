/**
 * imp-95207 — SPLIT-COLLAR analysis for the Prop-4.3 lever (0.14 -> 0.139981915)
 * against the delivered true per-shard L12 minima.
 *
 * GRADE: ASSESSMENT + SHADOW MEASUREMENT. Derives no bound, certifies no
 * collar, closes no gap; NO QED. No refereed bound is changed.
 * Shadow runs are UNCERTIFIED: local clang/FLINT 3.6.0 compile of the
 * delivered producer at prec 128, our arguments, not the sealed toolchain.
 *
 * INPUTS:
 *  - research-inputs/gate2-evaluator-inputs/L12_SHARD_MINIMA.txt (sealed
 *    audit sweep, 15 shards, 3,149,013 rows, global min 7.91366e-7 at
 *    N = 690988; TBOX 161250000/1e9..161250001/1e9; WEIGHT TRIANGLE).
 *  - research-inputs/gate2-evaluator-inputs/lemma_sweep_p235711.c (the
 *    producer; L12 logging semantics traced below).
 *  - ~/dbn-lambda-audit-review/NATIVE_BINDING.md (the audit repo's own
 *    binding theorem: stored floor -> normalized |f_t|), logs/
 *    finite_and_binding.log (E_max), logs/triangle_y_dini_256.log (the
 *    sweep's y-anchor), WINDOW_FREEZE_THEOREM.md (per-window freeze).
 *  - src/data/imp-95202-prop43-effective-collar-feasibility.js (prior
 *    assessment; its conditional m-floor is resolved/retired here).
 *
 * ────────────────────────────────────────────────────────────────────────
 * 1. SEMANTICS RESOLUTION (what L12 is; this gates everything)
 *
 *  Producer trace (lemma_sweep_p235711.c): each row logs
 *    L12 = floor-truncated LOWER Arb-ball endpoint of
 *          lbound(N) = (1 - modgamma - Ssum)/modmoll - corr,
 *  the improved-triangle-inequality lemma lower bound; with the stored
 *  shards' compile switch (WEIGHT TRIANGLE header) the summand is the
 *  cancellation-free |b| + gamma(Nref)|a0| weight, frozen per activation
 *  step (domination theorem in the file header). Both modes log the lower
 *  endpoint only (two-sided F12 impossible at nonzero t-box width).
 *
 *  Binding (NATIVE_BINDING.md, audit repo): the stored floor T_N <= L_N,
 *  and L_N > 0 implies |f_t(x+iy)| >= L_N throughout window W_N — already
 *  in the NORMALIZED ADDITIVE-ERROR UNITS of Theorem 1.3's
 *    H_t/B_t = f_t + O_<=(e_A + e_B + e_C0).
 *  No Euler-factor conversion. So L12 is NOT min|G| itself: it is a
 *  certified per-window LOWER BOUND for normalized |f_t| (usable as the
 *  collar's m, conservatively), and the sealed certificate's own margin
 *  channel is T_N - E_max with E_max = 2.33494905212337849e-7
 *  (finite_and_binding.log: binding_floor = 5.57871094787e-7 at T_min).
 *
 *  ANCHOR (the third, decisive layer): the sweep's row parameters are
 *    t-box = [129/800, 129/800 + 1e-9]  (final time of the 0.1787854 row),
 *    y     = sqrt(350708/1e7) = 0.187271994702891
 *  (triangle_y_dini_256.log header), with certified y-monotonicity of the
 *  triangle mass covering y in [0.187272, 0.823104] ONLY. The Prop-4.3
 *  lever's edge (y0 = 0.1809 -> 0.1808) lies 64.7 collar-widths BELOW the
 *  y-anchor, and the 0.14-row's own final time t0 = 24727519/2e8
 *  = 0.123637595 lies far below the t-box. The delivered minima therefore
 *  live on the 0.1787854 candidate's face, not on the 0.14-row contour.
 *
 *  DISCREPANCY RESOLVED (L12 min 7.91e-7 vs imp-95202's m >= 8.935e-4):
 *   (a) not units — the native binding removes that possibility;
 *   (b) the imp-95202 floor was CONDITIONAL on "producer certifies the
 *       normalized main term >= winding allowance 0.00125 pointwise along
 *       the contour". The sealed sweep makes no such statement: it closes
 *       T_N > E_max = 2.335e-7, and near the left edge T_N = 7.9e-7
 *       << 1.25e-3 falsifies the condition. The 8.935e-4 floor is DEAD;
 *   (c) worse, the anchor mismatch above means even the true floors do not
 *       transfer to the lever's contour without new displaced-face runs.
 *
 * ────────────────────────────────────────────────────────────────────────
 * 2. SPLIT PARTITION (executed as posed, correct units m = T - E_max)
 *
 *  THIN stretch (a): N in [690988, 697000], 6013 rows (1.909e-3 of the
 *  sweep), floors 7.91e-7 .. 2.15e-4. THICK region (b): floor nominally
 *  >= 2.498e-3 (shard min at 697001) — but the family seams PUNCTURE it:
 *  left-edge minima 3.151e-4 (729000, p2357), 3.058e-4 (819000, p235),
 *  3.093e-4 (1028000, p23), 8.894e-4 (1030001). Thick-region collar needs:
 *    as posed  m_b = 2.498055e-3 - E_max = 2.497822e-3
 *              -> sup|dG/dy| <= 24.978; termwise majorant 4793.74
 *              -> a directed dy-sweep must beat termwise by 191.9x;
 *    seam-honest m_b = 3.05789e-4 - E_max = 3.05555e-4
 *              -> sup|dG/dy| <= 3.056, 1568.9x — BELOW the measured true
 *                 slope band (3.6-3.8, below), so the seam left edges can
 *                 NEVER ride the collar; they must be excised into the
 *                 direct-recert set regardless of the dy-sweep outcome.
 *
 * ────────────────────────────────────────────────────────────────────────
 * 3. SHADOW MEASUREMENTS (grade: SHADOW; local compile of the delivered
 *    producer, prec 128, K=8, hw=1e-5; Arb midpoints, radii <= 5.4e-6)
 *
 *  Validation at the sealed anchor (t-box 129/800, y^2 = 350708/1e7):
 *  all five probed sealed values reproduce — left edge 690988 midpoint
 *  ball [8e-7 +/- 6.8e-8] contains the sealed 7.91366e-7; naive per-point
 *  values at 729000/819000/1028000/1100001/1300001 (family mtypes 5/4/3)
 *  land 3.0e-8..3.4e-8 ABOVE the sealed frozen-weight floors, exactly the
 *  conservativity direction the domination theorem requires.
 *
 *  Displaced face (t-box 129/800, y = 0.1808), TRIANGLE weight:
 *    N=690988: -0.023643   N=697001: -0.0210689  N=729000: -0.0235280
 *    N=819000: -0.0238886  N=1028000: -0.0243143 N=1100001: -0.0037384
 *    N=1300001: +0.0446712 (first positive probe)
 *  -> the thin stretch does not lose margin, it REVERSES SIGN (-0.0236 vs
 *  floor 7.9e-7, >4 orders past zero); the triangle-failure stretch runs
 *  to N* ~ 1.12e6 (interpolated), i.e. 4.1e5..6.1e5 rows — 68x..101x the
 *  posed 6013. At y = 0.1809 (undisplaced row edge): -0.0232690 — the
 *  0.14-row edge itself is already deep-negative on this face.
 *
 *  Measured true y-slope of the floor (displacement cost / 0.006472):
 *  3.653 (690988), 3.641 (697001), 3.684 (729000), 3.738 (819000),
 *  3.804 (1028000), 3.705 (1100001), 3.468 (1300001); local slope at the
 *  left edge between y=0.1809 and 0.1808: 3.740. This is ~1300x below the
 *  termwise majorant 4793.74 (cancellation is real) and 6.7x below the
 *  as-posed thick-region target 24.98 — the directed dy-sweep target is
 *  plausible where the floor is >= 2.5e-3 — but ABOVE the seam-honest
 *  target 3.056. (Heuristic: the slope of a lower bound is not itself a
 *  certified bound on sup|dy f_t|.)
 *
 *  SHARP (vecmax three-branch sawtooth) weight on the same displaced face:
 *    anchor 690988: +0.0769953; y=0.1808: +0.0627256 (690988),
 *    +0.0648072 (697001), +0.0643018 (729000), +0.0666836 (819000),
 *    +0.0702011 (1028000)
 *  -> the 7.9e-7 sealed floor is a TRIANGLE-WEIGHT ARTIFACT; the sharp
 *  floor at the same point is 0.077 (97,000x larger), and the entire
 *  triangle-collapsed stretch stays sharp-positive at y = 0.1808 with
 *  ~0.063 margin. Measured throughput (600-row sharp mode-t run, prec
 *  128, mtype 6): 217.2 s = 59 s patch build + ~0.264 s/row; a sharp
 *  re-sweep of 690988..1300001 across the four families is ~12 CPU-hr at
 *  prec 128 (~1-2 CPU-days at sealed-grade 256; shardable).
 *
 *  THE ELIMINATE SHOT — the row's own final time: the lever's endpoint
 *  0.139981915 = t* + 0.1808^2/2 requires the finite tail at final time
 *  t* = t0 = 0.123637595 (heat flow is forward: a zero-free face at
 *  t = 129/800 yields only Lambda <= 0.16125 + y^2/2 >= 0.16125, never
 *  0.1399…). At (t* = 24727519/2e8 box, y = 0.1808) the lemma bound is
 *  O(1) NEGATIVE for BOTH weights:
 *    triangle 690988: -1.55724;  sharp 690988: -1.23464;
 *    sharp 697001: -1.23011;     sharp 1028000 (mtype 3): -1.38154.
 *  No re-weighting rescues the t* face at N ~ 7e5: closure needs the
 *  campaign's N1*(t*, y*) minimal-cutoff re-derivation. Crude sigma/gamma
 *  matching (t* ln N1*^2 ~ t ln N1^2) puts ln N1* ~ 1.304 x 13.446 = 17.5,
 *  N1* ~ 4e7 before the lower-y penalty — a 60x..150x larger finite range
 *  plus relocation of the barrier/winding piece to the new cutoff: the
 *  full-recertification cost the collar lever was conceived to avoid.
 *
 * ────────────────────────────────────────────────────────────────────────
 * 4. VERDICT — SPLIT NOT VIABLE; 0.139981915 NOT plausibly days-scale.
 *
 *  The thin stretch eliminates the split twice over: (i) on the only face the
 *  delivered minima certify (t = 129/800), the displaced-y triangle margin
 *  does not shrink — it reverses sign, and the failure stretch is ~4-6e5
 *  rows, not 6e3; (ii) on the face the endpoint actually requires
 *  (t* = 0.123637595), the lemma machinery fails by O(1) for both weights
 *  at every probed N, so neither the thin-stretch recert nor the
 *  thick-region collar addresses the real obstruction. The blocking
 *  quantity is not the 192x dy-sweep gap; it is the missing
 *  final-time-t* tail (N1* cutoff re-derivation, weeks-months class).
 *
 *  SALVAGE (what the shadow DOES support at days-scale, on the delivered
 *  face): a sharp-weight re-sweep at y = 0.1808, t = 129/800 measured
 *  positive (>= 0.0627) across the entire triangle-collapsed stretch,
 *  seams included. If the slab/prism, Dini/y-monotonicity and winding
 *  pieces re-derive at the 0.1808 bottom edge, and a sharp-weight
 *  native-binding note (analogue of NATIVE_BINDING.md, using the repo's
 *  own sawtooth lemma) is written, the candidate row sharpens on the
 *  0.16125 face: 0.16125 + 0.1808^2/2 = 0.17759432 (vs 0.1787854, a
 *  1.19e-3 conditional-candidate improvement) — theorem-note work plus
 *  ~1-2 CPU-days of sweep, all SHADOW-grade until run under the sealed
 *  pipeline. That, not the 0.13998 endpoint, is what these artifacts
 *  reach. Changes no bound; NO QED.
 */

import {
  COLLAR_DISPLACEMENT,
  CERT_BOX,
  derivativeMajorants,
} from './imp-95202-prop43-effective-collar-feasibility.js';

// ── sealed literals (L12_SHARD_MINIMA.txt + finite_and_binding.log) ────────
export const SEALED = {
  tBox: { num: [161250000, 161250001], den: 1000000000, mid: 129 / 800 },
  yAnchorSquared: { num: 350708, den: 10000000 }, // = 87677/2500000
  yAnchor: Math.sqrt(350708 / 10000000), // 0.187271994702891 (dini log)
  yMonotonicityCover: [0.187271994702891, 0.823103881657717],
  rows: 3149013,
  nRange: [690988, 3840000],
  Tmin: 7.91366e-7, // at N = 690988
  Emax: 2.33494905212337849e-7,
  bindingFloor: 5.57871094787e-7, // Tmin - Emax (log literal)
  shardMinima: {
    690988: 7.91366e-7, // p235711 (mtype 6)
    690996: 4.185565e-6,
    691501: 2.14840069e-4,
    697001: 2.498055377e-3,
    729000: 3.15112459e-4, // p2357 (mtype 5) family seam
    819000: 3.05788807e-4, // p235  (mtype 4) family seam
    1028000: 3.09285478e-4, // p23  (mtype 3) family seam
    1030001: 8.89356157e-4,
    1050001: 6.602095978e-3,
    1100001: 2.0238110009e-2,
    1300001: 6.7117380094e-2,
  },
};

// ── the split partition as posed, in T - Emax units ────────────────────────
const collarWidth = 1e-4; // |delta_y| of the lever
export const SPLIT_PARTITION = {
  thin: {
    range: [690988, 697000],
    rows: 697000 - 690988 + 1, // 6013
    fractionOfSweep: (697000 - 690988 + 1) / 3149013, // 1.9095e-3
    floorRange: [7.91366e-7, 2.14840069e-4],
  },
  thickAsPosed: {
    mB: 2.498055377e-3 - 2.33494905212337849e-7, // 2.497822e-3
    MyNeeded: (2.498055377e-3 - 2.33494905212337849e-7) / collarWidth, // 24.978
    MyTermwise: 4793.742053323, // imp-95202, recomputed in assertions
    gapFactor: 4793.742053323 / ((2.498055377e-3 - 2.33494905212337849e-7) / collarWidth), // 191.9
  },
  thickSeamHonest: {
    seamFloors: { 729000: 3.15112459e-4, 819000: 3.05788807e-4, 1028000: 3.09285478e-4, 1030001: 8.89356157e-4 },
    mB: 3.05788807e-4 - 2.33494905212337849e-7, // 3.0556e-4
    MyNeeded: (3.05788807e-4 - 2.33494905212337849e-7) / collarWidth, // 3.056
    gapFactor: 4793.742053323 / ((3.05788807e-4 - 2.33494905212337849e-7) / collarWidth), // 1568.9
    consequence:
      'the seam left edges sit below every plausible certified |dG/dy| (measured slope band 3.6-3.8 already exceeds 3.056): they cannot ride the collar and must join the direct-recert set',
  },
  anchorMismatch: {
    dyAnchorToLeverEdge: Math.sqrt(350708 / 10000000) - 0.1808, // 6.472e-3
    collarWidths: (Math.sqrt(350708 / 10000000) - 0.1808) / collarWidth, // 64.72
    tAnchor: 129 / 800,
    tRowFinalTime: 24727519 / 200000000, // 0.123637595
  },
};

// ── shadow measurements (baked; SHADOW grade, prec 128 local compile) ──────
export const SHADOW = {
  provenance:
    'lemma_sweep_p235711.c compiled locally (clang, FLINT 3.6.0 with merged Arb, macOS arm64), ' +
    'prec 128, K=8, hw=1e-5, TBOX per header; -DTRIANGLE_WEIGHT for triangle rows, plain compile for sharp; ' +
    'NOT the sealed toolchain, NOT certified — Arb ball midpoints reported, radii <= 5.4e-6',
  validationAnchor: {
    // ours (naive mode n / mode-t first row) vs sealed frozen-weight floors
    leftEdgeBall: { mid: 8e-7, rad: 6.75e-8, sealedInside: 7.91366e-7 },
    naiveMinusSealed: {
      729000: 0.000315145955 - 3.15112459e-4, // +3.35e-8
      819000: 0.000305822459 - 3.05788807e-4,
      1028000: 0.000309319017 - 3.09285478e-4,
      1100001: 0.020238142576 - 2.0238110009e-2,
      1300001: 0.067117410246 - 6.7117380094e-2,
    },
    direction: 'naive per-point >= sealed frozen-weight floor at every probe (domination-theorem conservativity)',
  },
  displacedTriangle_t16125_y1808: {
    690988: -0.023643,
    697001: -0.0210689,
    729000: -0.023528,
    819000: -0.0238886,
    1028000: -0.0243143,
    1100001: -0.0037384,
    1300001: 0.0446712,
  },
  displacedTriangle_t16125_y1809_at690988: -0.023269,
  measuredSlopeBand: [3.468, 3.804], // (anchor - displaced)/0.006472 across probes
  leftEdgeLocalSlope: 3.74, // (lbound(0.1809) - lbound(0.1808))/1e-4 at 690988
  triangleCrossover: { bracket: [1100001, 1300001], interpolated: 1115447, failedRows: [409014, 609014] },
  sharp_t16125: {
    anchor690988: 0.0769953,
    y1808: { 690988: 0.0627256, 697001: 0.0648072, 729000: 0.0643018, 819000: 0.0666836, 1028000: 0.0702011 },
  },
  rowFinalTime_t0: {
    // t-box [24727519/2e8, 2472752e-8+5e-9], y = 0.1808 — the face 0.139981915 needs
    triangle690988: -1.55724,
    sharp690988: -1.23464,
    sharp697001: -1.23011,
    sharp1028000: -1.38154,
  },
  throughput: {
    sharp600RowRun: { seconds: 217.178, rows: 600, patchBuildSeconds: 59, perRowSeconds: 0.264 },
    resweepTo1300001CpuHoursPrec128: 12.4, // family-weighted estimate
  },
};

export const IMP_95207_VERDICT = {
  splitAsPosed: 'NOT-VIABLE',
  endpoint0139981915: 'NOT plausibly days-scale',
  reasons: [
    'thin stretch at the displaced y is a SIGN REVERSAL (-0.0236 vs floor 7.9e-7), not a margin reduction, and extends to N* ~ 1.12e6 (~4-6e5 rows, 68-101x the posed 6013)',
    'the delivered minima are anchored at (t=129/800, y=0.187272) — 64.7 collar-widths above the lever edge in y; they are not the m of the 0.1809 contour',
    'the face the endpoint actually requires (final time t* = 0.123637595, since Lambda <= t + y^2/2 forces the tail at t*) fails by O(1) for BOTH weights: triangle -1.557, sharp -1.235 at the left edge — the true blocker is the N1*(t*,y*) cutoff re-derivation (N1* ~ 4e7+, full-recertification class), not the 192x dy-sweep gap',
    'thick-region collar as posed (target sup|dG/dy| <= 24.98) is measured-plausible (true slope band 3.5-3.8, 1300x below the termwise 4793.7) but is mooted by (iii); the seam-honest target 3.056 is below the measured slope and fails regardless',
  ],
  salvage:
    'sharp-weight re-sweep on the DELIVERED face (t=129/800) at y=0.1808 measured positive (>= 0.0627) across the whole triangle-collapsed stretch, seams included, at ~1-2 CPU-days: with a sharp-weight native-binding note + slab/Dini/winding re-derivation at the 0.1808 edge this supports the conditional-candidate sharpening 0.1787854 -> 0.16125 + 0.1808^2/2 = 0.17759432, NOT the 0.13998 endpoint',
  grade: 'assessment + shadow (uncertified)',
  changesBound: false,
  qed: false,
};

export const IMP_95207_SPLIT_COLLAR = {
  id: 'imp-95207',
  title: 'Split-collar analysis for the Prop-4.3 lever against the true L12 shard minima',
  sealed: SEALED,
  partition: SPLIT_PARTITION,
  shadow: SHADOW,
  verdict: IMP_95207_VERDICT,
};

// ── assertions (import-light; the one 6.9e5-term loop runs in ms) ──────────
export const IMP_95207_ASSERTIONS = [
  {
    id: 'imp-95207-binding-floor-arithmetic',
    holds: () =>
      Math.abs(SEALED.Tmin - SEALED.Emax - 5.578710947876621e-7) < 1e-15 &&
      SEALED.Tmin - SEALED.Emax > 0 &&
      Math.abs(SEALED.bindingFloor - (SEALED.Tmin - SEALED.Emax)) < 1e-12,
    why: 'The sealed certificate closes T_min - E_max = 7.91366e-7 - 2.33495e-7 = 5.5787e-7 > 0 (finite_and_binding.log literal reproduced): the finite piece binds against E_max = 2.335e-7 in normalized additive-error units, NOT against the 0.00125 winding allowance imp-95202 conditioned on.',
  },
  {
    id: 'imp-95207-conditional-floor-falsified',
    holds: () => SEALED.Tmin < 8.935e-4 / 1000 && 8.934769883980193e-4 / SEALED.Tmin > 1100,
    why: 'The true global floor 7.91366e-7 sits ~1129x below imp-95202\'s conditional floor 8.935e-4; the condition (main term >= 0.00125 pointwise) is falsified by the sealed sweep near its left edge, so the conditional floor is retired — not a units mismatch (NATIVE_BINDING.md: stored floors already bound normalized |f_t|, no Euler-factor conversion).',
  },
  {
    id: 'imp-95207-anchor-mismatch',
    holds: () =>
      Math.abs(SPLIT_PARTITION.anchorMismatch.collarWidths - 64.72) < 0.01 &&
      SEALED.yAnchor > CERT_BOX.yRange[0] &&
      CERT_BOX.displacedYmin < CERT_BOX.yRange[0] &&
      SPLIT_PARTITION.anchorMismatch.tRowFinalTime < SEALED.tBox.mid,
    why: 'The delivered minima are anchored at y = sqrt(350708/1e7) = 0.187272 — 64.7 collar-widths above the displaced edge 0.1808 — and at t = 129/800, above the 0.14-row final time 0.123637595: both anchors of the lever contour are outside the certified face.',
  },
  {
    id: 'imp-95207-thin-stretch-as-posed',
    holds: () =>
      SPLIT_PARTITION.thin.rows === 6013 &&
      SPLIT_PARTITION.thin.fractionOfSweep < 2e-3 &&
      SEALED.shardMinima[697001] > 2.49e-3,
    why: 'As posed the thin stretch is 6013 rows (0.19% of the sweep) with floors below 2.15e-4, and the next shard floor is 2.498e-3 — the partition arithmetic is as the delivery stated.',
  },
  {
    id: 'imp-95207-thick-region-gap',
    holds: () => {
      const My = derivativeMajorants(0.1808).My;
      const need1 = SPLIT_PARTITION.thickAsPosed.MyNeeded;
      const need2 = SPLIT_PARTITION.thickSeamHonest.MyNeeded;
      return (
        Math.abs(My - 4793.742053323) < 1e-6 &&
        Math.abs(need1 - 24.9782) < 1e-3 &&
        Math.abs(My / need1 - 191.92) < 0.05 &&
        Math.abs(need2 - 3.0556) < 1e-3 &&
        Math.abs(My / need2 - 1568.86) < 0.5
      );
    },
    why: 'Thick-region collar targets in T - E_max units: as posed sup|dG/dy| <= 24.978 (191.9x below the termwise majorant 4793.74, recomputed here from imp-95202); seam-honest (family left edges 3.06e-4) sup|dG/dy| <= 3.056 (1568.9x), which the measured slope band 3.5-3.8 already exceeds — seams cannot ride the collar.',
  },
  {
    id: 'imp-95207-shadow-validates-sealed',
    holds: () => {
      const d = SHADOW.validationAnchor.naiveMinusSealed;
      const leftEdge = SHADOW.validationAnchor.leftEdgeBall;
      return (
        Object.values(d).every((v) => v > 0 && v < 4e-8) &&
        Math.abs(leftEdge.mid - leftEdge.sealedInside) <= leftEdge.rad
      );
    },
    why: 'Shadow fidelity: all five sealed probes reproduce — naive per-point values land 3.0e-8..3.4e-8 above the sealed frozen-weight floors (the conservativity direction the domination theorem requires), and the left-edge ball [8e-7 +/- 6.8e-8] contains the sealed 7.91366e-7.',
  },
  {
    id: 'imp-95207-displaced-face-sign-reversal',
    holds: () => {
      const t = SHADOW.displacedTriangle_t16125_y1808;
      return (
        t[690988] < -0.02 &&
        t[1100001] < 0 &&
        t[1300001] > 0 &&
        Math.abs(t[690988]) / SEALED.Tmin > 2.9e4 &&
        SHADOW.displacedTriangle_t16125_y1809_at690988 < -0.02
      );
    },
    why: 'At the displaced y = 0.1808 (and already at 0.1809) the triangle floor reverses sign at the left edge (-0.0236, 4+ orders past zero relative to the 7.9e-7 anchor floor) and stays negative through N = 1100001; first positive probe at 1300001 — the true triangle-failure stretch is ~4-6e5 rows, 68-101x the posed thin stretch.',
  },
  {
    id: 'imp-95207-measured-slope-vs-targets',
    holds: () =>
      SHADOW.measuredSlopeBand[0] > 3.4 &&
      SHADOW.measuredSlopeBand[1] < 3.9 &&
      SHADOW.measuredSlopeBand[1] < SPLIT_PARTITION.thickAsPosed.MyNeeded &&
      SHADOW.leftEdgeLocalSlope > SPLIT_PARTITION.thickSeamHonest.MyNeeded,
    why: 'The measured true y-slope of the floor (3.47-3.80, ~1300x below the termwise majorant — the cancellation imp-95202 predicted) sits 6.6x below the as-posed thick target 24.98 (directed dy-sweep plausible there) but ABOVE the seam-honest target 3.056 (seam left edges fail the collar regardless). Heuristic: slope of a lower bound, not a certified |dy f_t| bound.',
  },
  {
    id: 'imp-95207-sharp-weight-artifact',
    holds: () => {
      const s = SHADOW.sharp_t16125;
      return (
        s.anchor690988 / SEALED.Tmin > 9e4 &&
        Object.values(s.y1808).every((v) => v > 0.06) &&
        s.y1808[690988] > 0 &&
        SHADOW.displacedTriangle_t16125_y1808[690988] < 0
      );
    },
    why: 'The 7.9e-7 sealed floor is a triangle-weight artifact: the sharp (vecmax three-branch sawtooth) floor at the same point is 0.0770 (~97,000x larger), and the whole triangle-collapsed stretch stays sharp-positive (>= 0.0627) at y = 0.1808 on the delivered t = 129/800 face — the shadow basis of the salvage route.',
  },
  {
    id: 'imp-95207-row-final-time-kill',
    holds: () => {
      const k = SHADOW.rowFinalTime_t0;
      const endpointNeedsT0 =
        Math.abs(24727519 / 200000000 + 0.1808 ** 2 / 2 - COLLAR_DISPLACEMENT.publishedEndpoint) < 1e-12 &&
        129 / 800 > COLLAR_DISPLACEMENT.publishedEndpoint;
      return endpointNeedsT0 && k.triangle690988 < -1 && k.sharp690988 < -1 && k.sharp697001 < -1 && k.sharp1028000 < -1;
    },
    why: 'The endpoint 0.139981915 = t* + 0.1808^2/2 requires the finite tail at final time t* = 0.123637595 (Lambda <= t + y^2/2 at the tail\'s final time; the delivered 0.16125 face can never yield less than 0.16125). At t* the lemma bound is O(1) negative for BOTH weights (triangle -1.557, sharp -1.235 at 690988) — no re-weighting rescues it; the true blocker is the N1*(t*,y*) cutoff re-derivation, the full-recertification cost the collar was conceived to avoid.',
  },
  {
    id: 'imp-95207-salvage-row-arithmetic',
    holds: () =>
      Math.abs(129 / 800 + 0.1808 ** 2 / 2 - 0.17759432) < 1e-12 &&
      0.17759432 < 0.1787854 &&
      SHADOW.throughput.resweepTo1300001CpuHoursPrec128 < 24,
    why: 'What the shadow actually supports at days-scale: the delivered-face y-thaw 0.1787854 -> 0.16125 + 0.1808^2/2 = 0.17759432 (a 1.19e-3 conditional-candidate sharpening), via a sharp-weight re-sweep measured at ~12 CPU-hr (prec 128) plus theorem-note work (sharp native binding, slab/Dini/winding at the 0.1808 edge). SHADOW grade; changes no bound today.',
  },
];

for (const a of IMP_95207_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95207-split-collar-analysis assertion failed: ${a.id}`);
  }
}

export default IMP_95207_SPLIT_COLLAR;
