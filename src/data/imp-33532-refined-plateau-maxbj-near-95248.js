/**
 * @module imp-33532-refined-plateau-maxbj-near-95248
 * @fileoverview imp-33532 (numerical, MEASUREMENT, HONEST): refine the grid
 * around the imp-33309 global-max rung to sharpen whether the 6.4537 realised-
 * elasticity peak (max_j B_j = max_j P_j/D_j, the imp-33250 residual dg2) at
 * plateau 5 (endN ~ 95248) is a TRUE interior maximum or a coarse-plateau
 * sampling artifact.
 *
 * WHY THIS MEASUREMENT
 * --------------------
 * imp-33309 fit the growth law of max_j B_j across the 10 imp-3725 plateaus of
 * [1e4,1e6] on a COARSE grid (one max-B_j sample per plateau) and found the
 * global maximum 6.4537 at plateau 5 (endN ~ 95248), but the residual scatter
 * dwarfed the trend so it could not distinguish a slow unbounded drift from a
 * bounded lattice fluctuation -- the dg2 obstruction stayed OPEN both ways. A
 * one-sample-per-plateau grid cannot say WHERE inside plateau 5 the 6.4537 is
 * attained, hence cannot say whether refining endN would raise, hold, or
 * dissolve it.
 *
 * THE REFINEMENT (baked from scripts/imp-33532-refined-plateau-maxbj-near-95248.mjs,
 * itself replaying the imp-33290 sweep on plateau 5s fixed (a, H, T))
 * -----------------------------------------------------------------------------
 * With plateau 5s anchor a=87760, running-min H=1.948463e-2 and T=H^2/(8*0.99)=
 * 4.793570e-5 held fixed, three probes:
 *   1. ARGMAX LOCATION. The 6.4537 peak sits on the LEFT sweep, at gapIndex
 *      87758 -- only 2 terms from the anchor (a few-term near-anchor spike, where
 *      the two shrunk gaps adjacent to the running-min make P_j/D_j spike before
 *      accumulation averages it down). The RIGHT sweep (the branch that grows
 *      with the endN cutoff) maxes at only 2.8574. So the peak is ANCHOR-anchored
 *      and endN-INDEPENDENT: a finer endN grid cannot move it.
 *   2. FINE endN SUB-GRID. Across a 24-point ladder of endN cutoffs from the
 *      anchor out to 95248 the right-sweep running max is flat at 2.8574 (locked
 *      in by endN~87907, ~92.3% before the cutoff) -- never approaching 6.4537.
 *   3. BOUNDED WINDOW EXTENSION. Extending the SAME-T right sweep past 95248 up
 *      to the plateau-6 end (endN=354769, skipping 5 degenerate v=g^2-8T<=0 terms
 *      forced by the smaller plateau-6 min gap, first at endN~95249) reaches at
 *      most 3.1898 -- it does NOT exceed 6.4537.
 *
 * THE DECISIVE FACT: GENUINE INTERIOR MAXIMUM, NOT A SAMPLING ARTIFACT
 * -------------------------------------------------------------------
 * 6.4537 is a genuine interior maximum of plateau 5s realised-elasticity kernel:
 * it is attained 2 terms from the anchor (endN-independent) and extending the
 * window past the cutoff never exceeds it. The coarse one-per-plateau grid did
 * NOT under-resolve a rising boundary value -- a finer endN grid RE-CONFIRMS the
 * peak rather than dissolving it. The peak is an anchor-local spike, not a drift.
 *
 * WHAT IT DOES *NOT* CLOSE
 * ------------------------
 * This pins WHERE the plateau-5 window max sits; it is NOT an N-uniform bound on
 * sup_{N,j} B_j across ALL plateaus. The imp-33309 cross-plateau non-monotonicity
 * (peak at plateau 5, endpoint plateau 9 dips to 4.9938) is untouched, so the
 * imp-33250 dg2 obstruction stays OPEN both ways. Sharpening WHERE a single
 * plateaus peak lives does not certify sup_{N,j} B_j bounded.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT on plateau 5 of [1e4,1e6]. All figures baked from the offline
 *    script (esbuild + node over the zeros bundle); derived flags recomputed LIVE.
 *  - No new Lambda bound. imp-3910 C <= 54.56 stands; imp-3066 K_a >= 0
 *    UNTOUCHED; no refereed bound is changed; NO QED.
 *
 * @see imp-33309-max-bj-growth-fit.js (coarse one-per-plateau growth fit; found the 6.4537 global max, dg2 OPEN both ways)
 * @see imp-33290-far-term-tighter-majorant-assessment.js (defines B_j=P_j/D_j; proved the swap valid + relocated the obstruction to sup B_j)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (residual dg2 that sup_{N,j} B_j equals)
 */

// plateau 5 (endN ~ 95248) fixed kernel parameters, baked from the imp-33532
// offline script (2026-07-04). Literals only -- no zeros-bundle import.
const PLATEAU5 = Object.freeze({
  plateauIndex: 5,
  anchorGapIndex: 87760, // a: the running-min gap index of plateau 5
  H: 1.948463e-2,        // running-min gap
  T: 4.793570e-5,        // H^2/(8*thetaBar), thetaBar=0.99
  endN: 95248,           // plateau-5 running-min end
  reproMaxBj: 6.4537,    // reproduces the imp-33290/imp-33309 baked global max
});

// Probe 1: argmax location -- which sweep carries the peak, and how far from the anchor.
const ARGMAX = Object.freeze({
  peakSweep: 'left',          // the anchor-anchored, endN-INDEPENDENT branch
  leftMaxBj: 6.4537,          // == the global plateau max
  leftArgGapIndex: 87758,
  leftTermsFromAnchor: 2,     // a few-term near-anchor spike
  rightMaxBj: 2.8574,         // the endN-growing branch peaks far below 6.4537
  rightArgGapIndex: 87906,
  rightArgEndN: 87907,
});

// Probe 2: fine endN sub-grid -- the right-sweep running max is flat at 2.8574
// and locks in ~92.3% of the way to the cutoff, never nearing 6.4537.
const SUBGRID = Object.freeze({
  gridPoints: 24,
  runMaxBjFlatAt: 2.8574,
  earliestReachEndN: 87907,   // where the right-sweep running max reaches its plateau
  earliestReachFrac: 0.923,   // fraction of the [start, 95248] window
});

// Probe 3: bounded window extension past 95248 with the SAME plateau-5 T.
const EXTENSION = Object.freeze({
  extEndN: 354769,            // swept to the plateau-6 end
  skippedDegenerate: 5,       // v=g^2-8T<=0 terms forced by the smaller plateau-6 min gap
  firstDegenerateEndN: 95249,
  maxBjBeyondCut: 3.1898,     // max B_j strictly beyond endN=95248
  argBeyondEndN: 354762,
  exceededPeak: false,        // the extension NEVER exceeds 6.4537
});

// Derived flags (recomputed LIVE from the baked probes).
const PEAK_IS_ENDN_INDEPENDENT = ARGMAX.peakSweep === 'left';
const PEAK_IS_INTERIOR = PEAK_IS_ENDN_INDEPENDENT || ARGMAX.rightArgEndN < PLATEAU5.endN * 0.999;
const RIGHT_BELOW_PEAK = ARGMAX.rightMaxBj < PLATEAU5.reproMaxBj;
const EXTENSION_CONFIRMS = !EXTENSION.exceededPeak;
const GENUINE_INTERIOR_MAX = PEAK_IS_INTERIOR && RIGHT_BELOW_PEAK && EXTENSION_CONFIRMS;

export const IMP_33532_REFINED_PLATEAU_MAXBJ_NEAR_95248 = Object.freeze({
  id: 'imp-33532',
  title:
    'Refined-grid measurement of max_j B_j at the imp-33309 global-max rung (plateau 5, endN ~ 95248): ' +
    'the 6.4537 realised-elasticity peak is a GENUINE INTERIOR maximum -- an anchor-local few-term spike ' +
    '(left sweep, 2 terms from the anchor, endN-INDEPENDENT), the endN-growing right sweep maxes at 2.8574, ' +
    'and extending the same-T window past 95248 reaches only 3.1898 -- so it is NOT a coarse-sampling artifact',
  status: 'measurement',
  rhFree: true,
  window: 'plateau 5 (endN ~ 95248) of the 10 imp-3725 plateaus (thetaBar=0.99) of [1e4,1e6]',
  plateau5: PLATEAU5,
  argmax: ARGMAX,
  subGrid: SUBGRID,
  extension: EXTENSION,
  peakIsEndNIndependent: PEAK_IS_ENDN_INDEPENDENT, // true (peak on the left/anchor sweep)
  peakIsInterior: PEAK_IS_INTERIOR,                // true
  extensionConfirmsPeak: EXTENSION_CONFIRMS,       // true (past-cutoff max 3.1898 < 6.4537)
  genuineInteriorMax: GENUINE_INTERIOR_MAX,        // true -- the decisive fact
  verdict: Object.freeze({
    sampledArtifact: false,
    genuineInteriorMax: true,
    obstructionStatus: 'OPEN both ways (imp-33250 dg2 unchanged)',
    summary:
      'Refining the endN grid around the imp-33309 global-max rung RE-CONFIRMS the 6.4537 peak rather than ' +
      'dissolving it: the peak is an anchor-local few-term spike on the left sweep (2 terms from the running-min, ' +
      'endN-independent), the endN-growing right sweep peaks far below at 2.8574, and extending the same-T kernel ' +
      'past endN=95248 tops out at 3.1898 without exceeding 6.4537. So 6.4537 is a GENUINE interior maximum of ' +
      'plateau 5s realised-elasticity kernel, not a coarse-plateau sampling artifact. This pins WHERE the ' +
      'window max sits but is NOT an N-uniform bound: the imp-33309 cross-plateau non-monotonicity is untouched, ' +
      'so sup_{N,j} B_j (= the imp-33250 dg2) stays OPEN both ways -- neither certified bounded nor shown unbounded.',
  }),
  scope:
    'Measurement on plateau 5 of [1e4,1e6]; figures baked from the imp-33532 offline script (esbuild+node over ' +
    'the zeros bundle), derived flags recomputed LIVE. No new Lambda bound; imp-3910 C<=54.56 stands; imp-3066 ' +
    'UNTOUCHED; no refereed bound is changed; NO QED.',
});

export const IMP_33532_REFINED_PLATEAU_MAXBJ_NEAR_95248_ASSERTIONS = [
  {
    name: 'imp-33532: the 6.4537 peak is on the LEFT (anchor-anchored, endN-independent) sweep',
    check: () => ARGMAX.peakSweep === 'left' && Math.abs(ARGMAX.leftMaxBj - 6.4537) < 1e-4,
  },
  {
    name: 'imp-33532: the peak is a few-term near-anchor spike (<= 3 terms from the anchor)',
    check: () => ARGMAX.leftTermsFromAnchor <= 3 && ARGMAX.leftTermsFromAnchor >= 1,
  },
  {
    name: 'imp-33532: the endN-growing right sweep peaks far below the plateau max (< 3.5)',
    check: () => ARGMAX.rightMaxBj < 3.5 && SUBGRID.runMaxBjFlatAt < 3.5,
  },
  {
    name: 'imp-33532: extending the same-T window past endN=95248 does NOT exceed 6.4537',
    check: () => EXTENSION.exceededPeak === false && EXTENSION.maxBjBeyondCut < 6.4537,
  },
  {
    name: 'imp-33532: 6.4537 is a GENUINE interior maximum, not a coarse-sampling artifact',
    check: () =>
      GENUINE_INTERIOR_MAX === true &&
      IMP_33532_REFINED_PLATEAU_MAXBJ_NEAR_95248.verdict.sampledArtifact === false,
  },
  {
    name: 'imp-33532: it does NOT close the dg2 obstruction (stays OPEN both ways)',
    check: () =>
      IMP_33532_REFINED_PLATEAU_MAXBJ_NEAR_95248.verdict.obstructionStatus.startsWith('OPEN'),
  },
];
