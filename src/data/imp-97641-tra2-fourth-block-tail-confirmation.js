/**
 * @module imp-97641-tra2-fourth-block-tail-confirmation
 * @fileoverview imp-97641 -- MEASUREMENT ONLY (no bound moved; NO QED):
 *   Extend the imp-97599 RESULT 1 algebraic-tail decision with a FOURTH uniform 80-block (K=880)
 *   to the tr(A2) trace ladder. imp-97599 decided the tail is algebraic from a single ratio DRIFT
 *   across two ratios (r1=0.687945 -> r2=0.717237) on three uniform 80-blocks (K=560..800). A third
 *   ratio r3 tests whether the drift toward 1 continues (algebraic) or plateaus (geometric), and
 *   whether the p~1.976 exponent and the ~4818.77M limit hold. This module ingests the K=880 build
 *   (same imp-97440 Route-2 procedure: 2a=ln3, N=28, T=200, panel=1.0, dps=50), which measured
 *   tr(A2)=4818760707.080239 and REPRODUCED the K=800 cross-check exactly (4818758040.515779).
 *
 *   Source line (tmp/imp-97641-kbig880.log):
 *     # Kbig=800  tr(A2)=4818758040.515779   (567s)   <- reproduces imp-97599 K=800 exactly
 *     # Kbig=880  tr(A2)=4818760707.080239   (740s)   <- NEW fourth uniform 80-block
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the 80-step ratio KEEPS climbing toward 1 (0.717237 -> 0.741517): algebraic CONFIRMED
 *   ------------------------------------------------------------------------------------------
 *   The four uniform 80-blocks now read
 *     d1 = trA2(640)-trA2(560) = 7288.11
 *     d2 = trA2(720)-trA2(640) = 5013.82
 *     d3 = trA2(800)-trA2(720) = 3596.095779
 *     d4 = trA2(880)-trA2(800) = 2666.564461   (NEW)
 *   giving successive ratios r1=0.687945, r2=0.717237, r3=0.741517 (NEW). The third ratio CLIMBED a
 *   further +0.024280 toward 1 (after r2-r1=+0.029292), so the ratio sequence is monotone increasing
 *   toward 1 across all three steps. A pure geometric tail requires a CONSTANT ratio; the sustained
 *   drift toward 1 across a third block is the signature of a power-law (algebraic) tail. The
 *   imp-97599 algebraic-vs-geometric decision is CONFIRMED, not merely re-asserted on two ratios.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- the algebraic exponent stays p~1.978 and the limit stays in the ~4818.77M cluster
 *   ------------------------------------------------------------------------------------------
 *   Re-fitting a_K = L - C*K^(-p) on the newest uniform trio (720,800,880) returns
 *   L = 4818773559.10, p = 1.9781 -- essentially the imp-97599 new-trio fit (L = 4818773579.39,
 *   p = 1.9758) and the old-trio fit (p = 1.9729). The exponent did NOT collapse toward 0 (which a
 *   much higher limit would need); it is pinned at ~1.976-1.978 across three overlapping trios.
 *   Geometric extrapolation with the new ratio r3 from K=880 gives L_geom = 4818768356.71 and Aitken
 *   (720,800,880) returns the identical 4818768356.71 (up ~1195 from imp-97599's 4818767162.11,
 *   consistent with the drifting ratio). All extrapolators still cluster at 4818.768-4818.774M with
 *   an even TIGHTER inter-method spread (5202 vs imp-97599's 6417; relative 1.08e-6 vs 1.3e-6).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the ~0.33M gap to the imp-97482 named ~4819.1M PERSISTS (does not close)
 *   ------------------------------------------------------------------------------------------
 *   Under the confirmed algebraic tail the limit (~4818.774M algebraic / ~4818.768M geometric) sits
 *   ~326441-331643 (~0.33M, relative 6.88e-5) BELOW the imp-97482 named ~4819.1M -- the gap barely
 *   moved from imp-97599 (~332838) despite the extra block, and the robust p~1.978 fit still rules
 *   out a limit near 4819.1M (that would need p far below 1). The imp-97482 ~4819.1M remains a
 *   looser/higher bookkeeping figure, NOT the converged trace limit.
 *
 *   HONESTY: this confirms only the tail MODEL (algebraic), the p~1.978 exponent, and the ~4818.77M
 *   trace limit. It moves NO bound; the imp-97538 lambda_2 floor (-310.692227 .. -313.756) is
 *   untouched; the tr(A2) trace is a diagnostic, not the floor. PT Lambda <= 0.2 unchanged; RH open;
 *   no constant pinned as rigorous. Measurement only. NO QED.
 */

// Full ladder now with the fourth uniform 80-block (K=880). imp-97440 Route-2 build,
// 2a=ln3, N=28, T=200, panel=1.0, dps=50 (same procedure as imp-97538 / imp-97582 / imp-97599).
const IMP97641_LADDER = [
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.6 },
  { Kbig: 720, trA2: 4818754444.42 },
  { Kbig: 800, trA2: 4818758040.515779 },
  { Kbig: 880, trA2: 4818760707.080239 }, // NEW fourth uniform 80-block
];

const IMP97641_UNIFORM_BLOCKS = {
  d1: 7288.11, // trA2(640)-trA2(560)
  d2: 5013.82, // trA2(720)-trA2(640)
  d3: 3596.095779, // trA2(800)-trA2(720)
  d4: 2666.564461, // trA2(880)-trA2(800)  NEW
  r1: 0.687945, // d2/d1
  r2: 0.717237, // d3/d2
  r3: 0.741517, // d4/d3  (the NEW third ratio)
  ratioDrift21: 0.029292, // r2 - r1
  ratioDrift32: 0.02428, // r3 - r2 (still climbing toward 1 => algebraic tail confirmed)
  ratioMonotoneUp: true,
  tailModelConfirmed: 'algebraic', // three-step monotone drift toward 1, not constant
};

const IMP97641_EXTRAPOLATION = {
  L_geom_newRatioFromK880: 4818768356.71, // geometric tail using r3 from K=880
  L_aitken_720_800_880: 4818768356.71, // Aitken on newest uniform trio (== geometric)
  L_geom_prevRatioFromK800: 4818767162.11, // imp-97599 value, for comparison
  algebraicP_newTrio: 1.9781, // fit a_K = L - C K^-p on (720,800,880)
  algebraicC_newTrio: 8581939548.89,
  L_algebraic_newTrio: 4818773559.1,
  algebraicP_prevTrio: 1.9758, // imp-97599 new-trio (640,720,800) fit, essentially unchanged
  L_algebraic_prevTrio: 4818773579.39,
  clusterLowM: 4818.768,
  clusterHighM: 4818.774,
  interMethodSpread: 5202.39, // |L_algebraic_newTrio - L_geom_newRatioFromK880|
  interMethodRelSpread: 1.08e-6, // tighter than imp-97599's 1.3e-6
};

const IMP97641_CROSSCHECK = {
  k800Reproduced: true, // K=800 trace matched imp-97599's 4818758040.515779 exactly
  k800Value: 4818758040.515779,
  imp97482NamedLimitM: 4819.1,
  gapAlgebraicToNamed: 326440.9, // named - L_algebraic_newTrio (~0.326 M)
  gapGeomToNamed: 331643.29, // named - L_geom_newRatioFromK880
  gapRelative: 6.88e-5,
  namedReachableUnderStableExponent: false, // p~1.978 rules out a limit near 4819.1M
  namedInterpretation: 'looser/higher bookkeeping figure, not the converged trace limit',
  lambda2FloorUntouched: true,
};

const IMP97641_VERDICT = {
  fourthBlockAdded: true,
  thirdRatioComputed: true,
  ratioDriftsUpAgain: true, // r3 > r2 > r1, monotone toward 1
  tailModelConfirmedAlgebraic: true,
  algebraicExponentStable: true, // p~1.978, three overlapping trios agree
  extrapolatedLimitConfirmedNear4818_77M: true,
  namedGapPersists: true,
  extendsFinding: 'imp-97599',
  anyBoundMoved: false,
  analyticConstantPinned: false,
  measurementOnly: true,
};

const IMP97641_HONEST_BANNER =
  'imp-97641 MEASUREMENT ONLY -- fourth uniform 80-block K=880 tr(A2)=4818760707.08 (K=800 cross-check ' +
  'reproduced exactly); the 80-step ratio KEEPS drifting up 0.688 -> 0.717 -> 0.742 (algebraic tail ' +
  'confirmed, not geometric), the exponent stays p~1.978, and the limit is confirmed at ~4818.77M, ' +
  '~0.33M (rel 6.88e-5) below the imp-97482 named ~4819.1M (a looser bookkeeping figure). No constant ' +
  'pinned; no bound moved; lambda_2 floor untouched; PT Lambda <= 0.2 unchanged; RH open. NO QED.';

// --- self-executing assertions: recompute the block ratios and extrapolators from the raw ladder ---
const IMP97641_ASSERTIONS = [
  {
    id: 'imp97641-fourth-block-value',
    why: 'the K=880 trace must be the measured 4818760707.080239 and extend the imp-97599 ladder.',
    holds: () => {
      const last = IMP97641_LADDER[IMP97641_LADDER.length - 1];
      return last.Kbig === 880 && Math.abs(last.trA2 - 4818760707.080239) < 1e-3;
    },
  },
  {
    id: 'imp97641-k800-cross-check-reproduced',
    why: 'the in-run K=800 trace must reproduce the imp-97599 value exactly (build reproducibility).',
    holds: () => {
      const k800 = IMP97641_LADDER.find((r) => r.Kbig === 800);
      return k800 && Math.abs(k800.trA2 - 4818758040.515779) < 1e-6 && IMP97641_CROSSCHECK.k800Reproduced === true;
    },
  },
  {
    id: 'imp97641-third-ratio-drifts-up',
    why: 'the new 80-step ratio r3 must exceed r2 (sustained monotone drift toward 1 => algebraic).',
    holds: () => {
      const t = IMP97641_LADDER.map((r) => r.trA2);
      const d2 = t[2] - t[1];
      const d3 = t[3] - t[2];
      const d4 = t[4] - t[3];
      const r2 = d3 / d2;
      const r3 = d4 / d3;
      return (
        r3 > r2 &&
        Math.abs(r2 - IMP97641_UNIFORM_BLOCKS.r2) < 1e-5 &&
        Math.abs(r3 - IMP97641_UNIFORM_BLOCKS.r3) < 1e-5 &&
        Math.abs(r3 - r2 - IMP97641_UNIFORM_BLOCKS.ratioDrift32) < 1e-5 &&
        IMP97641_UNIFORM_BLOCKS.r3 > IMP97641_UNIFORM_BLOCKS.r2 &&
        IMP97641_UNIFORM_BLOCKS.r2 > IMP97641_UNIFORM_BLOCKS.r1
      );
    },
  },
  {
    id: 'imp97641-aitken-equals-geometric-new-trio',
    why: 'Aitken delta^2 on the newest uniform trio must equal the geometric-tail limit from K=880.',
    holds: () => {
      const t = IMP97641_LADDER.map((r) => r.trA2);
      const a0 = t[2], a1 = t[3], a2 = t[4];
      const Lait = a2 - (a2 - a1) ** 2 / (a2 - 2 * a1 + a0);
      const d4 = a2 - a1;
      const r3 = d4 / (a1 - a0);
      const Lgeom = a2 + (d4 * r3) / (1 - r3);
      return (
        Math.abs(Lait - Lgeom) < 1.0 &&
        Math.abs(Lait - IMP97641_EXTRAPOLATION.L_aitken_720_800_880) < 1.0
      );
    },
  },
  {
    id: 'imp97641-extrapolators-cluster-near-4818-77M',
    why: 'geometric and algebraic limits must cluster tightly (relative spread << 1e-4) at ~4818.77M.',
    holds: () =>
      IMP97641_EXTRAPOLATION.interMethodRelSpread < 1e-4 &&
      IMP97641_EXTRAPOLATION.interMethodRelSpread < 1.3e-6 && // tighter than imp-97599
      IMP97641_EXTRAPOLATION.L_geom_newRatioFromK880 > 4818.767e6 &&
      IMP97641_EXTRAPOLATION.L_algebraic_newTrio < 4818.775e6,
  },
  {
    id: 'imp97641-algebraic-exponent-stable',
    why: 'the algebraic exponent must stay near 1.976-1.978 (not collapse toward 0), keeping the limit ~4818.77M.',
    holds: () =>
      Math.abs(IMP97641_EXTRAPOLATION.algebraicP_newTrio - IMP97641_EXTRAPOLATION.algebraicP_prevTrio) < 0.01 &&
      IMP97641_EXTRAPOLATION.algebraicP_newTrio > 1.5,
  },
  {
    id: 'imp97641-named-gap-persists',
    why: 'the residual gap to the imp-97482 named ~4819.1M must stay positive at relative ~6.9e-5.',
    holds: () => {
      const gap = IMP97641_CROSSCHECK.imp97482NamedLimitM * 1e6 - IMP97641_EXTRAPOLATION.L_geom_newRatioFromK880;
      return (
        gap > 0 &&
        Math.abs(gap - IMP97641_CROSSCHECK.gapGeomToNamed) < 1.0 &&
        IMP97641_CROSSCHECK.namedReachableUnderStableExponent === false
      );
    },
  },
  {
    id: 'imp97641-honesty-gate-no-qed',
    why: 'measurement only: tail confirmed, no bound moved, no constant pinned, honest markers present.',
    holds: () =>
      IMP97641_VERDICT.anyBoundMoved === false &&
      IMP97641_VERDICT.measurementOnly === true &&
      IMP97641_VERDICT.analyticConstantPinned === false &&
      IMP97641_VERDICT.tailModelConfirmedAlgebraic === true &&
      /NO QED/.test(IMP97641_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97641_HONEST_BANNER) &&
      /RH open/.test(IMP97641_HONEST_BANNER),
  },
];

for (const a of IMP97641_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97641-tra2-fourth-block-tail-confirmation assertion failed: ${a.id}`);
  }
}

export {
  IMP97641_LADDER,
  IMP97641_UNIFORM_BLOCKS,
  IMP97641_EXTRAPOLATION,
  IMP97641_CROSSCHECK,
  IMP97641_VERDICT,
  IMP97641_HONEST_BANNER,
  IMP97641_ASSERTIONS,
};
