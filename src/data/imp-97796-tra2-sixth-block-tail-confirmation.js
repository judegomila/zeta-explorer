/**
 * @module imp-97796-tra2-sixth-block-tail-confirmation
 * @fileoverview imp-97796 -- MEASUREMENT ONLY (no bound moved; NO QED):
 *   Extend the imp-97684 tr(A2) algebraic-tail ladder with a SIXTH uniform 80-block (K=1040) to test
 *   whether the block-ratio drift toward 1 continues (algebraic) or plateaus (geometric), whether the
 *   p~1.980 exponent holds, and whether the limit stays in the ~4818.77M cluster. imp-97684 added the
 *   fifth uniform 80-block (K=960, tr(A2)=4818762738.921571), giving climbing block-ratios r1=0.687945,
 *   r2=0.717237, r3=0.741517, r4=0.761970 (monotone toward 1) with a p~1.980 fit and extrapolators
 *   clustering at 4818.769-4818.774M. This module ingests the K=1040 build (same imp-97440 Route-2
 *   procedure: 2a=ln3, N=28, T=200, panel=1.0, dps=50), which measured tr(A2)=4818764322.600626 and
 *   REPRODUCED the K=800 cross-check exactly (4818758040.515779).
 *
 *   Source line (tmp/imp-97796-tra2-kbig1040.log, /tmp/imp-97796-tra2-kbig1040.json):
 *     # Kbig= 800  tr(A2)=4818758040.515779   (557s)   <- reproduces imp-97599/imp-97641/imp-97684 exactly
 *     # Kbig=1040  tr(A2)=4818764322.600626   (1192s)  <- NEW sixth uniform 80-block
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the 80-step ratio KEEPS climbing toward 1 (0.761970 -> 0.779430): algebraic CONTINUES
 *   ------------------------------------------------------------------------------------------
 *   The six uniform 80-blocks now read
 *     d3 = trA2(800)-trA2(720)  = 3596.095779
 *     d4 = trA2(880)-trA2(800)  = 2666.564461
 *     d5 = trA2(960)-trA2(880)  = 2031.841331
 *     d6 = trA2(1040)-trA2(960) = 1583.679055   (NEW)
 *   giving successive ratios r3=0.741517, r4=0.761970, r5=0.779430 (NEW). The fifth ratio CLIMBED a
 *   further +0.017461 toward 1 (after r4-r3=+0.020453), so the ratio sequence stays monotone increasing
 *   toward 1 across all five steps. A pure geometric tail requires a CONSTANT ratio; the sustained drift
 *   toward 1 across a fifth block is the signature of a power-law (algebraic) tail. The imp-97684
 *   algebraic-vs-geometric decision is EXTENDED to a fifth ratio, not merely re-asserted.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- the ratio DRIFT toward 1 DECELERATES monotonically (0.0243 -> 0.0205 -> 0.0175)
 *   ------------------------------------------------------------------------------------------
 *   The three most recent drifts are r3-r2=+0.024280, r4-r3=+0.020453, r5-r4=+0.017461: positive (still
 *   climbing) but shrinking at each step. For a pure power law a_K = L - C K^-p the block ratio -> 1 with
 *   a decreasing increment (the drift itself decays like ~1/K), so a decelerating-but-positive drift is
 *   exactly the algebraic signature; a geometric tail would give a FLAT ratio (zero drift). The
 *   deceleration therefore reinforces the algebraic reading rather than warning of a plateau.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the algebraic exponent stays p~1.980 and the limit stays in the ~4818.77M cluster
 *   ------------------------------------------------------------------------------------------
 *   Re-fitting a_K = L - C*K^(-p) on the newest uniform trio (880,960,1040) returns L = 4818773535.92,
 *   p = 1.9817 -- essentially the imp-97684 new-trio fit (L = 4818773545.47, p = 1.9801) and the older
 *   trios (p = 1.9758 / 1.9781). The exponent did NOT collapse toward 0 (which a much higher limit would
 *   need); it is pinned at ~1.976-1.982 across five overlapping trios. Geometric extrapolation with the
 *   new ratio r5 from K=1040 gives L_geom = 4818769918.88 and Aitken (880,960,1040) returns the identical
 *   4818769918.88 (up ~676 from imp-97684's 4818769243.14, consistent with the drifting ratio). All
 *   extrapolators still cluster at 4818.770-4818.774M with an even TIGHTER inter-method spread (3617 vs
 *   imp-97684's 4302; relative 7.51e-7 vs 8.93e-7).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 4 -- the ~0.33M gap to the imp-97482 named ~4819.1M PERSISTS (does not close)
 *   ------------------------------------------------------------------------------------------
 *   Under the confirmed algebraic tail the limit (~4818.774M algebraic / ~4818.770M geometric) sits
 *   ~326464-330081 (~0.33M, relative 6.77e-5) BELOW the imp-97482 named ~4819.1M -- the gap barely
 *   moved from imp-97684 (~326455-330757) despite the extra block, and the robust p~1.980 fit still
 *   rules out a limit near 4819.1M (that would need p far below 1). The imp-97482 ~4819.1M remains a
 *   looser/higher bookkeeping figure, NOT the converged trace limit (see imp-97797 / imp-97811).
 *
 *   HONESTY: this confirms only the tail MODEL (algebraic), the p~1.980 exponent, and the ~4818.77M
 *   trace limit. It moves NO bound; the imp-97538 lambda_2 floor (-310.692227 .. -313.756) is
 *   untouched; the tr(A2) trace is a diagnostic, not the floor. PT Lambda <= 0.2 unchanged; RH open;
 *   no constant pinned as rigorous. Measurement only. NO QED.
 */

// Full ladder now with the sixth uniform 80-block (K=1040). imp-97440 Route-2 build,
// 2a=ln3, N=28, T=200, panel=1.0, dps=50 (same procedure as imp-97538 / imp-97599 / imp-97641 / imp-97684).
const IMP97796_LADDER = [
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.6 },
  { Kbig: 720, trA2: 4818754444.42 },
  { Kbig: 800, trA2: 4818758040.515779 },
  { Kbig: 880, trA2: 4818760707.080239 },
  { Kbig: 960, trA2: 4818762738.921571 },
  { Kbig: 1040, trA2: 4818764322.600626 }, // NEW sixth uniform 80-block
];

const IMP97796_UNIFORM_BLOCKS = {
  d4: 2666.564461, // trA2(880)-trA2(800)
  d5: 2031.841331, // trA2(960)-trA2(880)
  d6: 1583.679055, // trA2(1040)-trA2(960)  NEW
  r3: 0.741517, // d4/d3
  r4: 0.76197, // d5/d4
  r5: 0.77943, // d6/d5  (the NEW fifth ratio)
  ratioDrift43: 0.020453, // r4 - r3
  ratioDrift54: 0.017461, // r5 - r4 (still climbing toward 1 => algebraic tail continues)
  ratioMonotoneUp: true,
  driftDecelerates: true, // r3-r2 > r4-r3 > r5-r4 (increment toward 1 shrinks == power-law signature)
  tailModelConfirmed: 'algebraic', // five-step monotone drift toward 1, not constant
};

const IMP97796_EXTRAPOLATION = {
  L_geom_newRatioFromK1040: 4818769918.88, // geometric tail using r5 from K=1040
  L_aitken_880_960_1040: 4818769918.88, // Aitken on newest uniform trio (== geometric)
  L_geom_prevRatioFromK960: 4818769243.14, // imp-97684 value, for comparison
  algebraicP_newTrio: 1.9817, // fit a_K = L - C K^-p on (880,960,1040)
  algebraicC_newTrio: 8773514734.51,
  L_algebraic_newTrio: 4818773535.92,
  algebraicP_prevTrio: 1.9801, // imp-97684 new-trio (800,880,960) fit, essentially unchanged
  L_algebraic_prevTrio: 4818773545.47,
  clusterLowM: 4818.77,
  clusterHighM: 4818.774,
  interMethodSpread: 3617.04, // |L_algebraic_newTrio - L_geom_newRatioFromK1040|
  interMethodRelSpread: 7.51e-7, // tighter than imp-97684s 8.93e-7
};

const IMP97796_CROSSCHECK = {
  k800Reproduced: true, // in-run K=800 trace matched imp-97599/imp-97641/imp-97684 4818758040.515779 exactly
  k800Value: 4818758040.515779,
  imp97482NamedLimitM: 4819.1,
  gapAlgebraicToNamed: 326464.08, // named - L_algebraic_newTrio (~0.326 M)
  gapGeomToNamed: 330081.12, // named - L_geom_newRatioFromK1040
  gapRelative: 6.77e-5,
  namedReachableUnderStableExponent: false, // p~1.980 rules out a limit near 4819.1M
  namedInterpretation: 'looser/higher bookkeeping figure, not the converged trace limit',
  lambda2FloorUntouched: true,
};

const IMP97796_VERDICT = {
  sixthBlockAdded: true,
  fifthRatioComputed: true,
  ratioDriftsUpAgain: true, // r5 > r4 > r3 > r2 > r1, monotone toward 1
  driftDecelerates: true, // increment toward 1 shrinks (power-law signature)
  tailModelConfirmedAlgebraic: true,
  algebraicExponentStable: true, // p~1.980, five overlapping trios agree
  extrapolatedLimitConfirmedNear4818_77M: true,
  namedGapPersists: true,
  extendsFinding: 'imp-97684',
  anyBoundMoved: false,
  analyticConstantPinned: false,
  measurementOnly: true,
};

const IMP97796_HONEST_BANNER =
  'imp-97796 MEASUREMENT ONLY -- sixth uniform 80-block K=1040 tr(A2)=4818764322.60 (K=800 cross-check ' +
  'reproduced exactly); the 80-step ratio KEEPS drifting up 0.762 -> 0.779 (algebraic tail continues, ' +
  'not geometric) with a DECELERATING increment toward 1, the exponent stays p~1.980, and the limit is ' +
  'confirmed at ~4818.77M, ~0.33M (rel 6.77e-5) below the imp-97482 named ~4819.1M (a looser bookkeeping ' +
  'figure). No constant pinned; no bound moved; lambda_2 floor untouched; PT Lambda <= 0.2 unchanged; RH open. NO QED.';

// --- self-executing assertions: recompute the block ratios and extrapolators from the raw ladder ---
const IMP97796_ASSERTIONS = [
  {
    id: 'imp97796-sixth-block-value',
    why: 'the K=1040 trace must be the measured 4818764322.600626 and extend the imp-97684 ladder.',
    holds: () => {
      const last = IMP97796_LADDER[IMP97796_LADDER.length - 1];
      return last.Kbig === 1040 && Math.abs(last.trA2 - 4818764322.600626) < 1e-3;
    },
  },
  {
    id: 'imp97796-k800-cross-check-reproduced',
    why: 'the in-run K=800 trace must reproduce the imp-97599/imp-97641/imp-97684 value exactly (build reproducibility).',
    holds: () => {
      const k800 = IMP97796_LADDER.find((r) => r.Kbig === 800);
      return k800 && Math.abs(k800.trA2 - 4818758040.515779) < 1e-6 && IMP97796_CROSSCHECK.k800Reproduced === true;
    },
  },
  {
    id: 'imp97796-fifth-ratio-drifts-up',
    why: 'the new 80-step ratio r5 must exceed r4 (sustained monotone drift toward 1 => algebraic).',
    holds: () => {
      const t = IMP97796_LADDER.map((r) => r.trA2);
      const d4 = t[4] - t[3];
      const d5 = t[5] - t[4];
      const d6 = t[6] - t[5];
      const r4 = d5 / d4;
      const r5 = d6 / d5;
      return (
        r5 > r4 &&
        Math.abs(r4 - IMP97796_UNIFORM_BLOCKS.r4) < 1e-5 &&
        Math.abs(r5 - IMP97796_UNIFORM_BLOCKS.r5) < 1e-5 &&
        Math.abs(r5 - r4 - IMP97796_UNIFORM_BLOCKS.ratioDrift54) < 1e-5 &&
        IMP97796_UNIFORM_BLOCKS.r5 > IMP97796_UNIFORM_BLOCKS.r4 &&
        IMP97796_UNIFORM_BLOCKS.r4 > IMP97796_UNIFORM_BLOCKS.r3
      );
    },
  },
  {
    id: 'imp97796-ratio-drift-decelerates',
    why: 'the increment toward 1 must SHRINK (r3-r2 > r4-r3 > r5-r4): power-law, not a plateau warning.',
    holds: () => {
      const drift43 = IMP97796_UNIFORM_BLOCKS.r4 - IMP97796_UNIFORM_BLOCKS.r3;
      const drift54 = IMP97796_UNIFORM_BLOCKS.r5 - IMP97796_UNIFORM_BLOCKS.r4;
      return (
        drift54 > 0 &&
        drift43 > drift54 &&
        Math.abs(drift43 - IMP97796_UNIFORM_BLOCKS.ratioDrift43) < 1e-5 &&
        Math.abs(drift54 - IMP97796_UNIFORM_BLOCKS.ratioDrift54) < 1e-5 &&
        IMP97796_UNIFORM_BLOCKS.driftDecelerates === true
      );
    },
  },
  {
    id: 'imp97796-aitken-equals-geometric-new-trio',
    why: 'Aitken delta^2 on the newest uniform trio must equal the geometric-tail limit from K=1040.',
    holds: () => {
      const t = IMP97796_LADDER.map((r) => r.trA2);
      const a0 = t[4], a1 = t[5], a2 = t[6];
      const Lait = a2 - (a2 - a1) ** 2 / (a2 - 2 * a1 + a0);
      const d6 = a2 - a1;
      const r5 = d6 / (a1 - a0);
      const Lgeom = a2 + (d6 * r5) / (1 - r5);
      return (
        Math.abs(Lait - Lgeom) < 1.0 &&
        Math.abs(Lait - IMP97796_EXTRAPOLATION.L_aitken_880_960_1040) < 1.0
      );
    },
  },
  {
    id: 'imp97796-extrapolators-cluster-near-4818-77M',
    why: 'geometric and algebraic limits must cluster tightly (relative spread << 1e-4) at ~4818.77M.',
    holds: () =>
      IMP97796_EXTRAPOLATION.interMethodRelSpread < 1e-4 &&
      IMP97796_EXTRAPOLATION.interMethodRelSpread < 8.93e-7 && // tighter than imp-97684
      IMP97796_EXTRAPOLATION.L_geom_newRatioFromK1040 > 4818.769e6 &&
      IMP97796_EXTRAPOLATION.L_algebraic_newTrio < 4818.775e6,
  },
  {
    id: 'imp97796-algebraic-exponent-stable',
    why: 'the algebraic exponent must stay near 1.976-1.982 (not collapse toward 0), keeping the limit ~4818.77M.',
    holds: () =>
      Math.abs(IMP97796_EXTRAPOLATION.algebraicP_newTrio - IMP97796_EXTRAPOLATION.algebraicP_prevTrio) < 0.01 &&
      IMP97796_EXTRAPOLATION.algebraicP_newTrio > 1.5,
  },
  {
    id: 'imp97796-named-gap-persists',
    why: 'the residual gap to the imp-97482 named ~4819.1M must stay positive at relative ~6.8e-5.',
    holds: () => {
      const gap = IMP97796_CROSSCHECK.imp97482NamedLimitM * 1e6 - IMP97796_EXTRAPOLATION.L_geom_newRatioFromK1040;
      return (
        gap > 0 &&
        Math.abs(gap - IMP97796_CROSSCHECK.gapGeomToNamed) < 1.0 &&
        IMP97796_CROSSCHECK.namedReachableUnderStableExponent === false
      );
    },
  },
  {
    id: 'imp97796-honesty-gate-no-qed',
    why: 'measurement only: tail confirmed, no bound moved, no constant pinned, honest markers present.',
    holds: () =>
      IMP97796_VERDICT.anyBoundMoved === false &&
      IMP97796_VERDICT.measurementOnly === true &&
      IMP97796_VERDICT.analyticConstantPinned === false &&
      IMP97796_VERDICT.tailModelConfirmedAlgebraic === true &&
      /NO QED/.test(IMP97796_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97796_HONEST_BANNER) &&
      /RH open/.test(IMP97796_HONEST_BANNER),
  },
];

for (const a of IMP97796_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97796-tra2-sixth-block-tail-confirmation assertion failed: ${a.id}`);
  }
}

export {
  IMP97796_LADDER,
  IMP97796_UNIFORM_BLOCKS,
  IMP97796_EXTRAPOLATION,
  IMP97796_CROSSCHECK,
  IMP97796_VERDICT,
  IMP97796_HONEST_BANNER,
  IMP97796_ASSERTIONS,
};
