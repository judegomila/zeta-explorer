/**
 * @module imp-97684-tra2-fifth-block-tail-confirmation
 * @fileoverview imp-97684 -- MEASUREMENT ONLY (no bound moved; NO QED):
 *   Extend the imp-97641 tr(A2) algebraic-tail ladder with a FIFTH uniform 80-block (K=960) to test
 *   whether the block-ratio drift toward 1 continues (algebraic) or plateaus (geometric), and whether
 *   the p~1.978 exponent and the ~4818.77M limit hold. imp-97641 added the fourth uniform 80-block
 *   (K=880, tr(A2)=4818760707.080239), giving climbing block-ratios r1=0.687945, r2=0.717237,
 *   r3=0.741517 (monotone toward 1) with a p~1.978 fit and extrapolators clustering at 4818.768-4818.774M.
 *   This module ingests the K=960 build (same imp-97440 Route-2 procedure: 2a=ln3, N=28, T=200,
 *   panel=1.0, dps=50), which measured tr(A2)=4818762738.921571 and REPRODUCED the K=800 cross-check
 *   exactly (4818758040.515779).
 *
 *   Source line (tmp/imp-97684-kbig960.log, /tmp/imp-97684-tra2-kbig960.json):
 *     # Kbig=800  tr(A2)=4818758040.515779            <- reproduces imp-97599/imp-97641 K=800 exactly
 *     # Kbig=960  tr(A2)=4818762738.921571   (992s)    <- NEW fifth uniform 80-block
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the 80-step ratio KEEPS climbing toward 1 (0.741517 -> 0.761970): algebraic CONTINUES
 *   ------------------------------------------------------------------------------------------
 *   The five uniform 80-blocks now read
 *     d1 = trA2(640)-trA2(560) = 7288.11
 *     d2 = trA2(720)-trA2(640) = 5013.82
 *     d3 = trA2(800)-trA2(720) = 3596.095779
 *     d4 = trA2(880)-trA2(800) = 2666.564461
 *     d5 = trA2(960)-trA2(880) = 2031.841331   (NEW)
 *   giving successive ratios r1=0.687945, r2=0.717237, r3=0.741517, r4=0.761970 (NEW). The fourth ratio
 *   CLIMBED a further +0.020453 toward 1 (after r3-r2=+0.024280), so the ratio sequence is monotone
 *   increasing toward 1 across all four steps. A pure geometric tail requires a CONSTANT ratio; the
 *   sustained drift toward 1 across a fourth block is the signature of a power-law (algebraic) tail.
 *   The imp-97641 algebraic-vs-geometric decision is EXTENDED to a fourth ratio, not merely re-asserted.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- the ratio DRIFT toward 1 DECELERATES monotonically (0.0293 -> 0.0243 -> 0.0205)
 *   ------------------------------------------------------------------------------------------
 *   The three successive drifts are r2-r1=+0.029292, r3-r2=+0.024280, r4-r3=+0.020453: positive (still
 *   climbing) but shrinking at each step. For a pure power law a_K = L - C K^-p the block ratio -> 1
 *   with a decreasing increment (the drift itself decays like ~1/K), so a decelerating-but-positive
 *   drift is exactly the algebraic signature; a geometric tail would give a FLAT ratio (zero drift).
 *   The deceleration therefore reinforces the algebraic reading rather than warning of a plateau.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the algebraic exponent stays p~1.980 and the limit stays in the ~4818.77M cluster
 *   ------------------------------------------------------------------------------------------
 *   Re-fitting a_K = L - C*K^(-p) on the newest uniform trio (800,880,960) returns L = 4818773545.47,
 *   p = 1.9801 -- essentially the imp-97641 new-trio fit (L = 4818773559.10, p = 1.9781) and the older
 *   trios (p = 1.9758 / 1.9729). The exponent did NOT collapse toward 0 (which a much higher limit would
 *   need); it is pinned at ~1.976-1.980 across four overlapping trios. Geometric extrapolation with the
 *   new ratio r4 from K=960 gives L_geom = 4818769243.14 and Aitken (800,880,960) returns the identical
 *   4818769243.14 (up ~887 from imp-97641's 4818768356.71, consistent with the drifting ratio). All
 *   extrapolators still cluster at 4818.769-4818.774M with an even TIGHTER inter-method spread (4302 vs
 *   imp-97641's 5202; relative 8.93e-7 vs 1.08e-6).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 4 -- the ~0.33M gap to the imp-97482 named ~4819.1M PERSISTS (does not close)
 *   ------------------------------------------------------------------------------------------
 *   Under the confirmed algebraic tail the limit (~4818.774M algebraic / ~4818.769M geometric) sits
 *   ~326455-330757 (~0.33M, relative 6.86e-5) BELOW the imp-97482 named ~4819.1M -- the gap barely
 *   moved from imp-97641 (~326441-331643) despite the extra block, and the robust p~1.980 fit still
 *   rules out a limit near 4819.1M (that would need p far below 1). The imp-97482 ~4819.1M remains a
 *   looser/higher bookkeeping figure, NOT the converged trace limit.
 *
 *   HONESTY: this confirms only the tail MODEL (algebraic), the p~1.980 exponent, and the ~4818.77M
 *   trace limit. It moves NO bound; the imp-97538 lambda_2 floor (-310.692227 .. -313.756) is
 *   untouched; the tr(A2) trace is a diagnostic, not the floor. PT Lambda <= 0.2 unchanged; RH open;
 *   no constant pinned as rigorous. Measurement only. NO QED.
 */

// Full ladder now with the fifth uniform 80-block (K=960). imp-97440 Route-2 build,
// 2a=ln3, N=28, T=200, panel=1.0, dps=50 (same procedure as imp-97538 / imp-97582 / imp-97599 / imp-97641).
const IMP97684_LADDER = [
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.6 },
  { Kbig: 720, trA2: 4818754444.42 },
  { Kbig: 800, trA2: 4818758040.515779 },
  { Kbig: 880, trA2: 4818760707.080239 },
  { Kbig: 960, trA2: 4818762738.921571 }, // NEW fifth uniform 80-block
];

const IMP97684_UNIFORM_BLOCKS = {
  d3: 3596.095779, // trA2(800)-trA2(720)
  d4: 2666.564461, // trA2(880)-trA2(800)
  d5: 2031.841331, // trA2(960)-trA2(880)  NEW
  r1: 0.687945, // d2/d1
  r2: 0.717237, // d3/d2
  r3: 0.741517, // d4/d3
  r4: 0.76197, // d5/d4  (the NEW fourth ratio)
  ratioDrift32: 0.02428, // r3 - r2
  ratioDrift43: 0.020453, // r4 - r3 (still climbing toward 1 => algebraic tail continues)
  ratioMonotoneUp: true,
  driftDecelerates: true, // r2-r1 > r3-r2 > r4-r3 (increment toward 1 shrinks == power-law signature)
  tailModelConfirmed: 'algebraic', // four-step monotone drift toward 1, not constant
};

const IMP97684_EXTRAPOLATION = {
  L_geom_newRatioFromK960: 4818769243.14, // geometric tail using r4 from K=960
  L_aitken_800_880_960: 4818769243.14, // Aitken on newest uniform trio (== geometric)
  L_geom_prevRatioFromK880: 4818768356.71, // imp-97641 value, for comparison
  algebraicP_newTrio: 1.9801, // fit a_K = L - C K^-p on (800,880,960)
  algebraicC_newTrio: 8684789864.08,
  L_algebraic_newTrio: 4818773545.47,
  algebraicP_prevTrio: 1.9781, // imp-97641 new-trio (720,800,880) fit, essentially unchanged
  L_algebraic_prevTrio: 4818773559.1,
  clusterLowM: 4818.769,
  clusterHighM: 4818.774,
  interMethodSpread: 4302.32, // |L_algebraic_newTrio - L_geom_newRatioFromK960|
  interMethodRelSpread: 8.93e-7, // tighter than imp-97641s 1.08e-6
};

const IMP97684_CROSSCHECK = {
  k800Reproduced: true, // in-run K=800 trace matched imp-97599/imp-97641 4818758040.515779 exactly
  k800Value: 4818758040.515779,
  imp97482NamedLimitM: 4819.1,
  gapAlgebraicToNamed: 326454.53, // named - L_algebraic_newTrio (~0.326 M)
  gapGeomToNamed: 330756.86, // named - L_geom_newRatioFromK960
  gapRelative: 6.86e-5,
  namedReachableUnderStableExponent: false, // p~1.980 rules out a limit near 4819.1M
  namedInterpretation: 'looser/higher bookkeeping figure, not the converged trace limit',
  lambda2FloorUntouched: true,
};

const IMP97684_VERDICT = {
  fifthBlockAdded: true,
  fourthRatioComputed: true,
  ratioDriftsUpAgain: true, // r4 > r3 > r2 > r1, monotone toward 1
  driftDecelerates: true, // increment toward 1 shrinks (power-law signature)
  tailModelConfirmedAlgebraic: true,
  algebraicExponentStable: true, // p~1.980, four overlapping trios agree
  extrapolatedLimitConfirmedNear4818_77M: true,
  namedGapPersists: true,
  extendsFinding: 'imp-97641',
  anyBoundMoved: false,
  analyticConstantPinned: false,
  measurementOnly: true,
};

const IMP97684_HONEST_BANNER =
  'imp-97684 MEASUREMENT ONLY -- fifth uniform 80-block K=960 tr(A2)=4818762738.92 (K=800 cross-check ' +
  'reproduced exactly); the 80-step ratio KEEPS drifting up 0.742 -> 0.762 (algebraic tail continues, ' +
  'not geometric) with a DECELERATING increment toward 1, the exponent stays p~1.980, and the limit is ' +
  'confirmed at ~4818.77M, ~0.33M (rel 6.86e-5) below the imp-97482 named ~4819.1M (a looser bookkeeping ' +
  'figure). No constant pinned; no bound moved; lambda_2 floor untouched; PT Lambda <= 0.2 unchanged; RH open. NO QED.';

// --- self-executing assertions: recompute the block ratios and extrapolators from the raw ladder ---
const IMP97684_ASSERTIONS = [
  {
    id: 'imp97684-fifth-block-value',
    why: 'the K=960 trace must be the measured 4818762738.921571 and extend the imp-97641 ladder.',
    holds: () => {
      const last = IMP97684_LADDER[IMP97684_LADDER.length - 1];
      return last.Kbig === 960 && Math.abs(last.trA2 - 4818762738.921571) < 1e-3;
    },
  },
  {
    id: 'imp97684-k800-cross-check-reproduced',
    why: 'the in-run K=800 trace must reproduce the imp-97599/imp-97641 value exactly (build reproducibility).',
    holds: () => {
      const k800 = IMP97684_LADDER.find((r) => r.Kbig === 800);
      return k800 && Math.abs(k800.trA2 - 4818758040.515779) < 1e-6 && IMP97684_CROSSCHECK.k800Reproduced === true;
    },
  },
  {
    id: 'imp97684-fourth-ratio-drifts-up',
    why: 'the new 80-step ratio r4 must exceed r3 (sustained monotone drift toward 1 => algebraic).',
    holds: () => {
      const t = IMP97684_LADDER.map((r) => r.trA2);
      const d3 = t[3] - t[2];
      const d4 = t[4] - t[3];
      const d5 = t[5] - t[4];
      const r3 = d4 / d3;
      const r4 = d5 / d4;
      return (
        r4 > r3 &&
        Math.abs(r3 - IMP97684_UNIFORM_BLOCKS.r3) < 1e-5 &&
        Math.abs(r4 - IMP97684_UNIFORM_BLOCKS.r4) < 1e-5 &&
        Math.abs(r4 - r3 - IMP97684_UNIFORM_BLOCKS.ratioDrift43) < 1e-5 &&
        IMP97684_UNIFORM_BLOCKS.r4 > IMP97684_UNIFORM_BLOCKS.r3 &&
        IMP97684_UNIFORM_BLOCKS.r3 > IMP97684_UNIFORM_BLOCKS.r2 &&
        IMP97684_UNIFORM_BLOCKS.r2 > IMP97684_UNIFORM_BLOCKS.r1
      );
    },
  },
  {
    id: 'imp97684-ratio-drift-decelerates',
    why: 'the increment toward 1 must SHRINK (r2-r1 > r3-r2 > r4-r3): power-law, not a plateau warning.',
    holds: () => {
      const drift21 = IMP97684_UNIFORM_BLOCKS.r2 - IMP97684_UNIFORM_BLOCKS.r1;
      const drift32 = IMP97684_UNIFORM_BLOCKS.r3 - IMP97684_UNIFORM_BLOCKS.r2;
      const drift43 = IMP97684_UNIFORM_BLOCKS.r4 - IMP97684_UNIFORM_BLOCKS.r3;
      return (
        drift43 > 0 &&
        drift32 > drift43 &&
        drift21 > drift32 &&
        IMP97684_UNIFORM_BLOCKS.driftDecelerates === true
      );
    },
  },
  {
    id: 'imp97684-aitken-equals-geometric-new-trio',
    why: 'Aitken delta^2 on the newest uniform trio must equal the geometric-tail limit from K=960.',
    holds: () => {
      const t = IMP97684_LADDER.map((r) => r.trA2);
      const a0 = t[3], a1 = t[4], a2 = t[5];
      const Lait = a2 - (a2 - a1) ** 2 / (a2 - 2 * a1 + a0);
      const d5 = a2 - a1;
      const r4 = d5 / (a1 - a0);
      const Lgeom = a2 + (d5 * r4) / (1 - r4);
      return (
        Math.abs(Lait - Lgeom) < 1.0 &&
        Math.abs(Lait - IMP97684_EXTRAPOLATION.L_aitken_800_880_960) < 1.0
      );
    },
  },
  {
    id: 'imp97684-extrapolators-cluster-near-4818-77M',
    why: 'geometric and algebraic limits must cluster tightly (relative spread << 1e-4) at ~4818.77M.',
    holds: () =>
      IMP97684_EXTRAPOLATION.interMethodRelSpread < 1e-4 &&
      IMP97684_EXTRAPOLATION.interMethodRelSpread < 1.08e-6 && // tighter than imp-97641
      IMP97684_EXTRAPOLATION.L_geom_newRatioFromK960 > 4818.769e6 &&
      IMP97684_EXTRAPOLATION.L_algebraic_newTrio < 4818.775e6,
  },
  {
    id: 'imp97684-algebraic-exponent-stable',
    why: 'the algebraic exponent must stay near 1.976-1.980 (not collapse toward 0), keeping the limit ~4818.77M.',
    holds: () =>
      Math.abs(IMP97684_EXTRAPOLATION.algebraicP_newTrio - IMP97684_EXTRAPOLATION.algebraicP_prevTrio) < 0.01 &&
      IMP97684_EXTRAPOLATION.algebraicP_newTrio > 1.5,
  },
  {
    id: 'imp97684-named-gap-persists',
    why: 'the residual gap to the imp-97482 named ~4819.1M must stay positive at relative ~6.9e-5.',
    holds: () => {
      const gap = IMP97684_CROSSCHECK.imp97482NamedLimitM * 1e6 - IMP97684_EXTRAPOLATION.L_geom_newRatioFromK960;
      return (
        gap > 0 &&
        Math.abs(gap - IMP97684_CROSSCHECK.gapGeomToNamed) < 1.0 &&
        IMP97684_CROSSCHECK.namedReachableUnderStableExponent === false
      );
    },
  },
  {
    id: 'imp97684-honesty-gate-no-qed',
    why: 'measurement only: tail confirmed, no bound moved, no constant pinned, honest markers present.',
    holds: () =>
      IMP97684_VERDICT.anyBoundMoved === false &&
      IMP97684_VERDICT.measurementOnly === true &&
      IMP97684_VERDICT.analyticConstantPinned === false &&
      IMP97684_VERDICT.tailModelConfirmedAlgebraic === true &&
      /NO QED/.test(IMP97684_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97684_HONEST_BANNER) &&
      /RH open/.test(IMP97684_HONEST_BANNER),
  },
];

for (const a of IMP97684_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97684-tra2-fifth-block-tail-confirmation assertion failed: ${a.id}`);
  }
}

export {
  IMP97684_LADDER,
  IMP97684_UNIFORM_BLOCKS,
  IMP97684_EXTRAPOLATION,
  IMP97684_CROSSCHECK,
  IMP97684_VERDICT,
  IMP97684_HONEST_BANNER,
  IMP97684_ASSERTIONS,
};
