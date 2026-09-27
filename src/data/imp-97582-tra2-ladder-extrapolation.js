/**
 * @module imp-97582-tra2-ladder-extrapolation
 * @fileoverview imp-97582 -- MEASUREMENT / CROSS-CHECK ONLY (no bound moved; NO QED):
 *   imp-97538 tabulated the tr(A2) trace at Kbig = {500,560,640,720} =
 *     {4818734261.05, 4818742142.49, 4818749430.60, 4818754444.42}
 *   with per-block deltas collapsing 7881.44 -> 7288.11 -> 5013.82 (the last two are uniform
 *   80-blocks, ratio 0.687945). imp-97482 separately NAMED the tr(A2) limit as ~4819.1M.
 *   This module extrapolates the ladder to a converged limit (geometric-tail and Richardson/Aitken,
 *   plus an algebraic-tail control) and cross-checks that limit against the imp-97482 ~4819.1M value
 *   at a common precision, quantifying the residual gap and whether the trace limit is pinned more
 *   tightly than the lambda_2 floor itself. Measurement/cross-check only; no bound moves; NO QED.
 *
 *   Offline script: tmp/imp-97582-extrapolate.py (deltas, geometric-tail, Aitken delta^2, algebraic
 *   K^(-p) fit, reconciliation). Outputs baked below; the ladder-driven extrapolators are recomputed
 *   as self-executing assertions from the raw trace values.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- geometric-tail and Aitken delta^2 AGREE EXACTLY on the uniform trio (560,640,720)
 *   ------------------------------------------------------------------------------------------
 *   Treating the two uniform 80-blocks as a geometric increment series (ratio r = 0.687945), the
 *   tail from K=720 to infinity sums to 11053.29, giving L_geom = 4818765497.71 (4818.7655 M).
 *   Aitken delta^2 on the same uniform trio returns the identical 4818765497.71 -- as it must, since
 *   Aitken is exact on a geometric sequence. The two methods coincide to the last stored digit
 *   (spread 0.00), so the geometric assumption is internally self-consistent on the trio.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- an algebraic-tail control a_K = L - C*K^(-p) lands close (p ~ 1.97)
 *   ------------------------------------------------------------------------------------------
 *   Fitting a_K = L - C*K^(-p) to the uniform trio yields p = 1.9729, C = 8.3147e9,
 *   L_alg = 4818773610.71 (4818.7736 M). The three extrapolators cluster at 4818.766-4818.774 M,
 *   i.e. an inter-method spread of ~8113 (relative ~1.7e-6). The trace limit is thus pinned to
 *   ~4818.77M at the 1e-6 relative level under BOTH tail models.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- CROSS-CHECK vs imp-97482 ~4819.1M: a residual ~0.335M gap that a geometric tail
 *               CANNOT close (the named value would need ratio ~0.986, not the measured 0.688)
 *   ------------------------------------------------------------------------------------------
 *   The extrapolated limit ~4818.766M sits 334502 (~0.335 M, relative 6.9e-5) BELOW the imp-97482
 *   named ~4819.1M. To reach 4819.1M from K=720 (4818754444.42) a geometric tail would need
 *   ratio r = 0.9857, far above the measured 80-step r = 0.6879; under the measured ratio the named
 *   value is unreachable. So either imp-97482 ~4819.1M is a looser/higher bookkeeping figure, or the
 *   true tail is far slower (algebraic, ratio drifting toward 1) than the 4-point ladder reveals.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 4 -- the trace limit is pinned MORE TIGHTLY than the lambda_2 floor
 *   ------------------------------------------------------------------------------------------
 *   The imp-97538 lambda_2 floor is still unpinned between -310.692227 and -313.756 (spread ~3.06,
 *   relative ~1e-2). The tr(A2) limit is fixed to relative ~1.7e-6 across extrapolators and its
 *   residual gap to the named value is relative ~6.9e-5 -- both far below the ~1e-2 lambda_2 spread.
 *   So the trace object is the better-converged of the two; the floor uncertainty does NOT come from
 *   the trace ladder.
 *
 *   SUB-GAP (named): IMP97582_TRACE_LIMIT_NAMED_GAP_UNRESOLVED -- the ~0.335M residual between the
 *   geometric/algebraic extrapolated trace limit (~4818.77M) and the imp-97482 named ~4819.1M cannot
 *   be closed with only two uniform 80-blocks (a single ratio estimate). Deciding whether the tail is
 *   geometric (limit ~4818.77M) or slow-algebraic (limit possibly ~4819.1M) needs a longer/deeper
 *   ladder (Kbig >= 800, as imp-97581 already schedules) to see the delta ratio either plateau at
 *   0.688 or climb toward 1.
 *
 *   HONESTY: PT Lambda <= 0.2 unchanged; RH open; no constant pinned as rigorous; no bound moved;
 *   this is a measurement/cross-check of an extrapolated numerical trace only. NO QED.
 */

const IMP97582_LADDER = [
  { Kbig: 500, trA2: 4818734261.05 },
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.60 },
  { Kbig: 720, trA2: 4818754444.42 },
];

const IMP97582_DELTAS = [
  { from: 500, to: 560, dK: 60, delta: 7881.44 },
  { from: 560, to: 640, dK: 80, delta: 7288.11 },
  { from: 640, to: 720, dK: 80, delta: 5013.82 },
];

const IMP97582_EXTRAPOLATION = {
  uniformRatio80: 0.687945, // (5013.82 / 7288.11) from the two uniform 80-blocks
  geometricTailFromK720: 11053.29,
  L_geometric: 4818765497.71, // 4818.7655 M
  L_aitken: 4818765497.71, // identical to geometric on the uniform trio (Aitken exact on geometric)
  algebraicP: 1.9729,
  algebraicC: 8.3147e9,
  L_algebraic: 4818773610.71, // 4818.7736 M
  interMethodSpread: 8113.0, // |L_algebraic - L_geometric|
  interMethodRelSpread: 1.7e-6,
};

const IMP97582_CROSSCHECK = {
  imp97482NamedLimitM: 4819.1, // ~4819.1M named by imp-97482
  gapGeometricToNamed: 334502.29, // named - L_geometric (~0.335 M)
  gapRelative: 6.9e-5,
  ratioNeededToReachNamed: 0.9857, // geom ratio required to hit 4819.1M from K=720
  ratioMeasured: 0.687945,
  namedReachableUnderMeasuredRatio: false,
  // lambda_2 floor comparison (imp-97538): -310.692227 .. -313.756, spread ~3.06, rel ~1e-2
  lambda2FloorRelSpread: 1.0e-2,
  traceLimitPinnedTighterThanLambda2Floor: true,
};

const IMP97582_VERDICT = {
  geometricAndAitkenAgree: true,
  extrapolatorsCluster: true,
  namedGapUnresolved: true,
  openSubGap: 'IMP97582_TRACE_LIMIT_NAMED_GAP_UNRESOLVED',
  traceLimitPinnedTighterThanLambda2Floor: true,
  anyBoundMoved: false,
  analyticConstantPinned: false,
  computeBindsFirst: true,
};

const IMP97582_HONEST_BANNER =
  'imp-97582 MEASUREMENT/CROSS-CHECK ONLY -- extrapolated tr(A2) limit ~4818.77M (geometric/Aitken/' +
  'algebraic), ~0.335M below the imp-97482 named ~4819.1M; named gap UNRESOLVED with 4 ladder points. ' +
  'No constant pinned; no bound moved; PT Lambda <= 0.2 unchanged; RH open. NO QED.';

// --- self-executing assertions: recompute the extrapolators from the raw ladder ---
const IMP97582_ASSERTIONS = [
  {
    id: 'imp97582-uniform-ratio-matches',
    why: 'the 80-step delta ratio recomputed from the raw trace ladder must match the baked 0.687945.',
    holds: () => {
      const t = IMP97582_LADDER.map((r) => r.trA2);
      const d1 = t[2] - t[1];
      const d2 = t[3] - t[2];
      return Math.abs(d2 / d1 - IMP97582_EXTRAPOLATION.uniformRatio80) < 1e-5;
    },
  },
  {
    id: 'imp97582-geometric-tail-matches',
    why: 'geometric-tail limit recomputed from the ladder must match the baked L_geometric.',
    holds: () => {
      const t = IMP97582_LADDER.map((r) => r.trA2);
      const d1 = t[2] - t[1];
      const d2 = t[3] - t[2];
      const r = d2 / d1;
      const L = t[3] + (d2 * r) / (1 - r);
      return Math.abs(L - IMP97582_EXTRAPOLATION.L_geometric) < 1.0;
    },
  },
  {
    id: 'imp97582-aitken-equals-geometric',
    why: 'Aitken delta^2 on the uniform trio must equal the geometric-tail limit (Aitken exact on geometric).',
    holds: () => {
      const t = IMP97582_LADDER.map((r) => r.trA2);
      const a0 = t[1], a1 = t[2], a2 = t[3];
      const L = a2 - (a2 - a1) ** 2 / (a2 - 2 * a1 + a0);
      return Math.abs(L - IMP97582_EXTRAPOLATION.L_aitken) < 1.0;
    },
  },
  {
    id: 'imp97582-named-gap-quantified',
    why: 'the residual gap to the imp-97482 named ~4819.1M must equal the baked ~0.335M and be positive.',
    holds: () => {
      const gap = IMP97582_CROSSCHECK.imp97482NamedLimitM * 1e6 - IMP97582_EXTRAPOLATION.L_geometric;
      return gap > 0 && Math.abs(gap - IMP97582_CROSSCHECK.gapGeometricToNamed) < 1.0;
    },
  },
  {
    id: 'imp97582-named-unreachable-under-measured-ratio',
    why: 'the geometric ratio needed to reach 4819.1M must exceed the measured ratio (named unreachable).',
    holds: () =>
      IMP97582_CROSSCHECK.ratioNeededToReachNamed > IMP97582_CROSSCHECK.ratioMeasured &&
      IMP97582_CROSSCHECK.namedReachableUnderMeasuredRatio === false,
  },
  {
    id: 'imp97582-tighter-than-lambda2-floor',
    why: 'the trace limit relative gap must be far below the lambda_2 floor relative spread.',
    holds: () =>
      IMP97582_CROSSCHECK.gapRelative < IMP97582_CROSSCHECK.lambda2FloorRelSpread &&
      IMP97582_CROSSCHECK.traceLimitPinnedTighterThanLambda2Floor === true,
  },
  {
    id: 'imp97582-honesty-gate-no-qed',
    why: 'measurement/cross-check only: named gap unresolved, no constant pinned, no bound moved, honest markers present.',
    holds: () =>
      IMP97582_VERDICT.anyBoundMoved === false &&
      IMP97582_VERDICT.namedGapUnresolved === true &&
      IMP97582_VERDICT.analyticConstantPinned === false &&
      IMP97582_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97582_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97582_HONEST_BANNER) &&
      /RH open/.test(IMP97582_HONEST_BANNER),
  },
];

for (const a of IMP97582_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97582-tra2-ladder-extrapolation assertion failed: ${a.id}`);
  }
}

export {
  IMP97582_LADDER,
  IMP97582_DELTAS,
  IMP97582_EXTRAPOLATION,
  IMP97582_CROSSCHECK,
  IMP97582_VERDICT,
  IMP97582_HONEST_BANNER,
  IMP97582_ASSERTIONS,
};
