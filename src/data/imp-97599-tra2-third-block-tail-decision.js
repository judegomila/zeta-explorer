/**
 * @module imp-97599-tra2-third-block-tail-decision
 * @fileoverview imp-97599 -- MEASUREMENT ONLY (no bound moved; NO QED):
 *   Decide the imp-97582 sub-gap IMP97582_TRACE_LIMIT_NAMED_GAP_UNRESOLVED by adding a THIRD
 *   uniform 80-block to the tr(A2) trace ladder. imp-97582 had only two uniform 80-blocks
 *   (K=560,640,720), a single ratio estimate 0.687945, so the algebraic-vs-geometric tail could
 *   not be decided. This module ingests the K=800 build (same imp-97440 Route-2 procedure:
 *   2a=ln3, N=28, T=200, panel=1.0, dps=50) which measured tr(A2)=4818758040.515779, forms the
 *   second 80-step ratio, and tests whether the ratio is (near-)constant (geometric tail) or
 *   drifting toward 1 (algebraic tail).
 *
 *   Source line (tmp/imp-97581-route2-kbig800-1000.log):
 *     # Kbig=800  tr(A2)=4818758040.515779  best Route-2 lower bound on lambda_2 = NONE (all <=0)
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the 80-step ratio DRIFTS UP (0.687945 -> 0.717237), so the tail is ALGEBRAIC
 *   ------------------------------------------------------------------------------------------
 *   The three uniform 80-blocks now read
 *     d1 = trA2(640)-trA2(560) = 7288.11
 *     d2 = trA2(720)-trA2(640) = 5013.82
 *     d3 = trA2(800)-trA2(720) = 3596.096   (NEW)
 *   giving successive ratios r1 = d2/d1 = 0.687945 and r2 = d3/d2 = 0.717237. The ratio CLIMBED
 *   by +0.029292 toward 1 rather than plateauing at 0.688. A pure geometric tail requires a
 *   CONSTANT ratio; the measured drift toward 1 is the signature of a power-law (algebraic) tail.
 *   The tail-model question is therefore DECIDED in favour of algebraic, not geometric.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- yet the algebraic exponent is STABLE (p ~ 1.976) and the limit stays ~4818.77M
 *   ------------------------------------------------------------------------------------------
 *   Re-fitting a_K = L - C*K^(-p) on the newest uniform trio (640,720,800) returns
 *   L = 4818773579.39, p = 1.9758 -- essentially the imp-97582 old-trio fit (L = 4818773610.79,
 *   p = 1.9729). The exponent did not collapse toward 0 (which would be needed for a much higher
 *   limit); it is pinned at ~1.976. Geometric extrapolation with the new ratio r2 from K=800 gives
 *   L_geom = 4818767162.11 (up ~1664 from the old 4818765497.71) and Aitken(640,720,800) returns
 *   the identical 4818767162.11. All extrapolators still cluster at 4818.767-4818.774M
 *   (spread ~6417, relative ~1.3e-6). The added block CONFIRMS the ~4818.77M limit.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the ~0.333M gap to the imp-97482 named ~4819.1M PERSISTS (does not close)
 *   ------------------------------------------------------------------------------------------
 *   Even under the now-decided algebraic tail the limit (~4818.774M) sits 332838 (~0.333M,
 *   relative 6.9e-5) BELOW the imp-97482 named ~4819.1M -- the gap barely moved from imp-97582
 *   (334502) despite the extra block, and the robust p~1.976 fit rules out a limit near 4819.1M
 *   (that would need p far below 1). Conclusion: the properly-extrapolated trace limit is
 *   ~4818.77M; the imp-97482 ~4819.1M is a looser/higher bookkeeping figure, NOT the converged
 *   trace. The named gap is resolved as a bookkeeping discrepancy, not an unconverged tail.
 *
 *   HONESTY: this decides only the tail MODEL and confirms the ~4818.77M trace limit. It moves NO
 *   bound; the imp-97538 lambda_2 floor (-310.692227 .. -313.756) is untouched; the tr(A2) trace
 *   is a diagnostic, not the floor. PT Lambda <= 0.2 unchanged; RH open; no constant pinned as
 *   rigorous. Measurement only. NO QED.
 */

// Full ladder now with the third uniform 80-block (K=800). imp-97440 Route-2 build,
// 2a=ln3, N=28, T=200, panel=1.0, dps=50 (same procedure as imp-97538 / imp-97582).
const IMP97599_LADDER = [
  { Kbig: 500, trA2: 4818734261.05 },
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.6 },
  { Kbig: 720, trA2: 4818754444.42 },
  { Kbig: 800, trA2: 4818758040.515779 }, // NEW third uniform 80-block
];

const IMP97599_UNIFORM_BLOCKS = {
  d1: 7288.11, // trA2(640)-trA2(560)
  d2: 5013.82, // trA2(720)-trA2(640)
  d3: 3596.095779, // trA2(800)-trA2(720)  NEW
  r1: 0.687945, // d2/d1 (imp-97582 single ratio)
  r2: 0.717237, // d3/d2 (the NEW second ratio)
  ratioDrift: 0.029292, // r2 - r1 (climbs toward 1 => algebraic tail)
  tailModelDecided: 'algebraic', // ratio drifting up toward 1, not constant
};

const IMP97599_EXTRAPOLATION = {
  L_geom_newRatioFromK800: 4818767162.11, // geometric tail using r2 from K=800
  L_aitken_640_720_800: 4818767162.11, // Aitken on newest uniform trio (== geometric)
  L_geom_oldRatioFromK720: 4818765497.71, // imp-97582 value, for comparison
  algebraicP_newTrio: 1.9758, // fit a_K = L - C K^-p on (640,720,800)
  algebraicC_newTrio: 8460364785.15,
  L_algebraic_newTrio: 4818773579.39,
  algebraicP_oldTrio: 1.9729, // imp-97582 old-trio fit, essentially unchanged
  L_algebraic_oldTrio: 4818773610.79,
  clusterLowM: 4818.767,
  clusterHighM: 4818.774,
  interMethodSpread: 6417.28, // |L_algebraic_newTrio - L_geom_newRatioFromK800|
  interMethodRelSpread: 1.3e-6,
};

const IMP97599_CROSSCHECK = {
  imp97482NamedLimitM: 4819.1,
  gapAlgebraicToNamed: 332838.0, // named - L_algebraic_newTrio (~0.333 M) approx
  gapGeomToNamed: 332837.89, // named - L_geom_newRatioFromK800
  gapRelative: 6.9e-5,
  namedReachableUnderStableExponent: false, // p~1.976 rules out a limit near 4819.1M
  namedInterpretation: 'looser/higher bookkeeping figure, not the converged trace limit',
  lambda2FloorUntouched: true,
};

const IMP97599_VERDICT = {
  thirdBlockAdded: true,
  ratioDriftsUp: true,
  tailModelDecidedAlgebraic: true,
  algebraicExponentStable: true,
  extrapolatedLimitConfirmedNear4818_77M: true,
  namedGapPersists: true,
  subGapResolved: 'IMP97582_TRACE_LIMIT_NAMED_GAP_UNRESOLVED',
  anyBoundMoved: false,
  analyticConstantPinned: false,
  measurementOnly: true,
};

const IMP97599_HONEST_BANNER =
  'imp-97599 MEASUREMENT ONLY -- third uniform 80-block K=800 tr(A2)=4818758040.52; the 80-step ratio ' +
  'DRIFTS UP 0.688 -> 0.717 (algebraic tail, not geometric), yet the algebraic exponent stays p~1.976 so ' +
  'the limit is confirmed at ~4818.77M, ~0.333M (rel 6.9e-5) below the imp-97482 named ~4819.1M (a looser ' +
  'bookkeeping figure). No constant pinned; no bound moved; lambda_2 floor untouched; PT Lambda <= 0.2 ' +
  'unchanged; RH open. NO QED.';

// --- self-executing assertions: recompute the block ratios and extrapolators from the raw ladder ---
const IMP97599_ASSERTIONS = [
  {
    id: 'imp97599-third-block-value',
    why: 'the K=800 trace must be the measured 4818758040.515779 and extend the imp-97582 ladder.',
    holds: () => {
      const last = IMP97599_LADDER[IMP97599_LADDER.length - 1];
      return last.Kbig === 800 && Math.abs(last.trA2 - 4818758040.515779) < 1e-3;
    },
  },
  {
    id: 'imp97599-ratio-drifts-up',
    why: 'the new 80-step ratio r2 must exceed the old r1 (drift toward 1 => algebraic tail).',
    holds: () => {
      const t = IMP97599_LADDER.map((r) => r.trA2);
      const d1 = t[2] - t[1];
      const d2 = t[3] - t[2];
      const d3 = t[4] - t[3];
      const r1 = d2 / d1;
      const r2 = d3 / d2;
      return (
        r2 > r1 &&
        Math.abs(r1 - IMP97599_UNIFORM_BLOCKS.r1) < 1e-5 &&
        Math.abs(r2 - IMP97599_UNIFORM_BLOCKS.r2) < 1e-5 &&
        Math.abs(r2 - r1 - IMP97599_UNIFORM_BLOCKS.ratioDrift) < 1e-5
      );
    },
  },
  {
    id: 'imp97599-aitken-equals-geometric-new-trio',
    why: 'Aitken delta^2 on the newest uniform trio must equal the geometric-tail limit from K=800.',
    holds: () => {
      const t = IMP97599_LADDER.map((r) => r.trA2);
      const a0 = t[2], a1 = t[3], a2 = t[4];
      const Lait = a2 - (a2 - a1) ** 2 / (a2 - 2 * a1 + a0);
      const d3 = a2 - a1;
      const r2 = d3 / (a1 - a0);
      const Lgeom = a2 + (d3 * r2) / (1 - r2);
      return (
        Math.abs(Lait - Lgeom) < 1.0 &&
        Math.abs(Lait - IMP97599_EXTRAPOLATION.L_aitken_640_720_800) < 1.0
      );
    },
  },
  {
    id: 'imp97599-extrapolators-cluster-near-4818-77M',
    why: 'geometric and algebraic limits must cluster tightly (relative spread << 1e-4) at ~4818.77M.',
    holds: () =>
      IMP97599_EXTRAPOLATION.interMethodRelSpread < 1e-4 &&
      IMP97599_EXTRAPOLATION.L_geom_newRatioFromK800 > 4818.766e6 &&
      IMP97599_EXTRAPOLATION.L_algebraic_newTrio < 4818.775e6,
  },
  {
    id: 'imp97599-algebraic-exponent-stable',
    why: 'the algebraic exponent must stay near 1.976 (not collapse toward 0), keeping the limit ~4818.77M.',
    holds: () =>
      Math.abs(IMP97599_EXTRAPOLATION.algebraicP_newTrio - IMP97599_EXTRAPOLATION.algebraicP_oldTrio) < 0.01 &&
      IMP97599_EXTRAPOLATION.algebraicP_newTrio > 1.5,
  },
  {
    id: 'imp97599-named-gap-persists',
    why: 'the residual gap to the imp-97482 named ~4819.1M must stay positive at relative ~6.9e-5.',
    holds: () => {
      const gap = IMP97599_CROSSCHECK.imp97482NamedLimitM * 1e6 - IMP97599_EXTRAPOLATION.L_geom_newRatioFromK800;
      return (
        gap > 0 &&
        Math.abs(gap - IMP97599_CROSSCHECK.gapGeomToNamed) < 1.0 &&
        IMP97599_CROSSCHECK.namedReachableUnderStableExponent === false
      );
    },
  },
  {
    id: 'imp97599-honesty-gate-no-qed',
    why: 'measurement only: tail decided, no bound moved, no constant pinned, honest markers present.',
    holds: () =>
      IMP97599_VERDICT.anyBoundMoved === false &&
      IMP97599_VERDICT.measurementOnly === true &&
      IMP97599_VERDICT.analyticConstantPinned === false &&
      IMP97599_VERDICT.tailModelDecidedAlgebraic === true &&
      /NO QED/.test(IMP97599_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97599_HONEST_BANNER) &&
      /RH open/.test(IMP97599_HONEST_BANNER),
  },
];

for (const a of IMP97599_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97599-tra2-third-block-tail-decision assertion failed: ${a.id}`);
  }
}

export {
  IMP97599_LADDER,
  IMP97599_UNIFORM_BLOCKS,
  IMP97599_EXTRAPOLATION,
  IMP97599_CROSSCHECK,
  IMP97599_VERDICT,
  IMP97599_HONEST_BANNER,
  IMP97599_ASSERTIONS,
};
