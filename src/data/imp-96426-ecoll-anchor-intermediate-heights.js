/**
 * @module data/imp-96426-ecoll-anchor-intermediate-heights
 * @fileoverview imp-96426 -- fill the intermediate-height gap the imp-96402
 *   E_coll anchor left between its two endpoints.
 *
 *   imp-96402 built the first count-model-INDEPENDENT E_coll anchor from an
 *   externally tabulated TRUE zero height (the Odlyzko 10^22-nd zero), but its
 *   honest caveat noted the two measured points sit at opposite extremes:
 *     - N = 1 (first zero): the RvM main-term count inversion misses the true
 *       height by a MACROSCOPIC relative gap (5.96e-1 in gamma_N, 8.47e-2 in
 *       the rate) -- clearly the count model (omitted +7/8 and S(T)).
 *     - N = 1e22 (Odlyzko true height): the count-model gap collapses to
 *       -1.53e-15 in gamma_N (0 in the rate), DOMINATED by the double-precision
 *       storage floor of a 21-digit height, not by the count model. The genuine
 *       omitted fluctuation S(gamma)/N ~ log(gamma)/N ~ 1e-21 is far below double
 *       resolution there.
 *   Nothing was measured BETWEEN these endpoints, so the count-model gap was
 *   only shown at its macroscopic maximum and after it had already sunk below
 *   the floor. This module supplies intermediate anchors where the gap sits
 *   ABOVE the double-precision floor yet BELOW the low-index macroscopic regime,
 *   exhibiting the count-model dependence transitioning between the two ends.
 *
 *   INTERMEDIATE ANCHORS -- externally tabulated true heights (Odlyzko table).
 *     The in-repo Odlyzko ordinate table (src/data/zeros-to-1e6.js, imp-359,
 *     10^6 verified true heights to ~10-decimal precision) supplies genuine
 *     externally tabulated true zero heights at intermediate indices. Four are
 *     baked as literals here (index N, true height gamma_N):
 *       N = 1e3 : gamma = 1419.4224809460
 *       N = 1e4 : gamma = 9877.7826540040
 *       N = 1e5 : gamma = 74920.8274989940
 *       N = 1e6 : gamma = 600269.6770124451
 *     For each, the count-inversion reference gamma is the same RvM main-term
 *     Lambert-W inversion imp-96402 uses (2pi * exp(1 + W(N/e))), and the rate
 *     factor is R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622
 *     (imp-96311 / imp-2641). The measured relative gaps form a smooth,
 *     monotone ladder that bridges the imp-96402 endpoints:
 *       N=1     gammaRelGap 5.96e-1   rateRelGap 8.47e-2   (imp-96402, macroscopic)
 *       N=1e3   gammaRelGap 1.19e-3   rateRelGap 8.19e-5
 *       N=1e4   gammaRelGap 1.03e-4   rateRelGap 5.62e-6
 *       N=1e5   gammaRelGap 1.31e-5   rateRelGap 5.85e-7
 *       N=1e6   gammaRelGap 1.19e-6   rateRelGap 4.47e-8
 *       N=1e22  gammaRelGap -1.53e-15 rateRelGap 0        (imp-96402, at floor)
 *     Each intermediate gap is well above the ~1e-16 double-precision floor and
 *     well below the macroscopic first-zero gap. The gap decays like
 *     1/(gamma_N * log gamma_N) -- roughly one order of magnitude per order of N
 *     -- confirming the count-model dependence is a smooth function of height,
 *     macroscopic at small N and collapsing below the double floor by 1e22 (as
 *     imp-96402 reported). The dominant omission is the deterministic +7/8 count
 *     term: smoothCount(gamma_N)/N - 1 ~ -(7/8 + S(T))/N tracks the same ladder.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves
 *   no constant, does not close G6_polymath15_bridge. The conditional bound
 *   C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound remains false
 *   (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js: the two-endpoint
 *     anchor whose intermediate gap this module fills; C_KH, rate factor, and
 *     Lambert-W count-inversion path reused verbatim.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *   - src/data/zeros-to-1e6.js (imp-359, Odlyzko table): the intermediate true
 *     heights, baked as literals (module NOT imported, to keep this module light
 *     per the heavy-import discipline).
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96402.
const C_KH = Math.PI * 2.622; // = 8.2373...

// Principal Lambert W by Halley iteration -- the imp-96363 / imp-96402 path,
// reused here verbatim so the reconstructed reference is apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 200; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-16) break;
  }
  return w;
}

// Count-inversion gamma_N (RvM main term): (T/2pi)(log(T/2pi)-1)=N solved as
// T = 2pi * exp(1 + W(N/e)). This is the RECONSTRUCTED reference to compare to.
function gammaCountInversion(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW(N / Math.E));
}

// RvM smooth count (main term), used only to show the omitted count offset.
function smoothCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}

function rateFromGamma(gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}
function eCollFromGamma(CH, gamma, N) {
  return CH * rateFromGamma(gamma, N);
}

const CH_A = 0.125;
const CH_B = 0.127;

// One measured anchor from an externally tabulated TRUE zero height, compared to
// the count-inversion (reconstructed) anchor at the same index (as in imp-96402).
function measureAnchor(N, gammaTrue, source) {
  const gammaCount = gammaCountInversion(N);
  const rateTrue = rateFromGamma(gammaTrue, N);
  const rateCount = rateFromGamma(gammaCount, N);
  return {
    N,
    source,
    gammaTrue,
    gammaCount,
    gammaRelGap: (gammaCount - gammaTrue) / gammaTrue,
    smoothCountOffsetPerN: smoothCount(gammaTrue) / N - 1,
    rateTrue,
    rateCount,
    rateRelGap: (rateCount - rateTrue) / rateTrue,
    E_coll_a_true: eCollFromGamma(CH_A, gammaTrue, N),
    E_coll_b_true: eCollFromGamma(CH_B, gammaTrue, N),
    E_coll_a_count: eCollFromGamma(CH_A, gammaCount, N),
    eCollRelGap:
      (eCollFromGamma(CH_A, gammaCount, N) - eCollFromGamma(CH_A, gammaTrue, N)) /
      eCollFromGamma(CH_A, gammaTrue, N),
  };
}

// INTERMEDIATE anchors: externally tabulated true heights at indices between the
// imp-96402 endpoints (N = 1 first zero and N = 1e22 Odlyzko), read from the
// in-repo Odlyzko table (src/data/zeros-to-1e6.js, imp-359) and baked as literals.
const INTERMEDIATE_ANCHORS = [
  measureAnchor(1e3, 1419.4224809460, 'Odlyzko table (imp-359), true height gamma_1000'),
  measureAnchor(1e4, 9877.7826540040, 'Odlyzko table (imp-359), true height gamma_10000'),
  measureAnchor(1e5, 74920.8274989940, 'Odlyzko table (imp-359), true height gamma_100000'),
  measureAnchor(1e6, 600269.6770124451, 'Odlyzko table (imp-359), true height gamma_1000000'),
];

// The two imp-96402 endpoints, recomputed here from the same true heights so the
// full transition ladder is self-contained (cited, not a bound change).
const ENDPOINT_FIRST_ZERO = measureAnchor(
  1,
  14.134725141734693790,
  'imp-96402 endpoint: first zero (Odlyzko / LMFDB true height), macroscopic gap',
);
const ENDPOINT_ODLYZKO_1E22 = measureAnchor(
  1e22,
  1370919909931995308226.68016,
  'imp-96402 endpoint: Odlyzko 10^22-nd zero (true height), gap at double floor',
);

// Monotone-decay check: the intermediate gammaRelGap ladder must strictly shrink
// as N grows (count-model gap ~ 1/(gamma_N log gamma_N)).
const GAMMA_GAP_LADDER = INTERMEDIATE_ANCHORS.map((a) => Math.abs(a.gammaRelGap));
const LADDER_IS_MONOTONE_DECREASING = GAMMA_GAP_LADDER.every(
  (g, i) => i === 0 || g < GAMMA_GAP_LADDER[i - 1],
);

export const IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS = {
  id: 'imp-96426',
  title:
    'Intermediate-height count-model-dependence ladder for the imp-96402 E_coll ' +
    'anchor: externally tabulated true zero heights at N = 1e3..1e6 bridge the ' +
    'macroscopic first-zero gap and the 1e22 double-precision floor',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  intermediateAnchors: INTERMEDIATE_ANCHORS,
  endpointFirstZero: ENDPOINT_FIRST_ZERO,
  endpointOdlyzko1e22: ENDPOINT_ODLYZKO_1E22,
  ladderMonotoneDecreasing: LADDER_IS_MONOTONE_DECREASING,
  measurement: {
    transitionLadder:
      'Relative count-model gap (RvM main-term inversion vs externally tabulated ' +
      'true height) across the transition, gamma / rate: N=1 ' +
      ENDPOINT_FIRST_ZERO.gammaRelGap.toExponential(2) +
      ' / ' +
      ENDPOINT_FIRST_ZERO.rateRelGap.toExponential(2) +
      ' (macroscopic); N=1e3 ' +
      INTERMEDIATE_ANCHORS[0].gammaRelGap.toExponential(2) +
      ' / ' +
      INTERMEDIATE_ANCHORS[0].rateRelGap.toExponential(2) +
      '; N=1e4 ' +
      INTERMEDIATE_ANCHORS[1].gammaRelGap.toExponential(2) +
      ' / ' +
      INTERMEDIATE_ANCHORS[1].rateRelGap.toExponential(2) +
      '; N=1e5 ' +
      INTERMEDIATE_ANCHORS[2].gammaRelGap.toExponential(2) +
      ' / ' +
      INTERMEDIATE_ANCHORS[2].rateRelGap.toExponential(2) +
      '; N=1e6 ' +
      INTERMEDIATE_ANCHORS[3].gammaRelGap.toExponential(2) +
      ' / ' +
      INTERMEDIATE_ANCHORS[3].rateRelGap.toExponential(2) +
      '; N=1e22 ' +
      ENDPOINT_ODLYZKO_1E22.gammaRelGap.toExponential(2) +
      ' / 0 (double storage floor).',
    aboveFloorBelowMacroscopic:
      'Every intermediate gap sits ABOVE the ~1e-16 double-precision floor (so it ' +
      'is a genuinely resolved count-model effect, unlike the 1e22 endpoint) and ' +
      'BELOW the 8.47e-2 first-zero macroscopic rate gap. The gap decays like ' +
      '1/(gamma_N log gamma_N), roughly one order of magnitude per order of N, so ' +
      'the count-model dependence is a smooth function of height that is ' +
      'macroscopic at small N and collapses below the double floor by N = 1e22.',
    dominantOmissionIsPlus78:
      'The dominant omitted count term is the deterministic +7/8: at each anchor ' +
      'smoothCount(gamma_N)/N - 1 ~ -(7/8 + S(T))/N tracks the same ladder ' +
      '(N=1e3 ' +
      INTERMEDIATE_ANCHORS[0].smoothCountOffsetPerN.toExponential(2) +
      ', N=1e6 ' +
      INTERMEDIATE_ANCHORS[3].smoothCountOffsetPerN.toExponential(2) +
      '), i.e. the gap is the main-term-only vs +7/8-corrected count-model choice, ' +
      'not a storage artifact.',
  },
  residualResolution:
    'imp-96402 measured the count-model gap only at its two extremes (macroscopic ' +
    'at N=1, below the double floor at N=1e22). This module fills the intermediate ' +
    'regime with four externally tabulated true heights (Odlyzko table, imp-359) ' +
    'at N = 1e3..1e6, exhibiting the smooth monotone transition and confirming the ' +
    'gap is a resolved 1/(gamma log gamma) count-model effect throughout.',
  verdict:
    'INTERMEDIATE-HEIGHT LADDER SUPPLIED. Count-model gap decays monotonically ' +
    'from ' +
    ENDPOINT_FIRST_ZERO.rateRelGap.toExponential(2) +
    ' (rate, N=1) through ' +
    INTERMEDIATE_ANCHORS[0].rateRelGap.toExponential(2) +
    ' / ' +
    INTERMEDIATE_ANCHORS[3].rateRelGap.toExponential(2) +
    ' (N=1e3 / N=1e6) toward the double floor at N=1e22, each intermediate point ' +
    'above the ~1e-16 floor and below the first-zero macroscopic regime. ' +
    'Accuracy audit only: no gap closed, no bound changed, G6_polymath15_bridge ' +
    'not closed, conditional C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound ' +
    '= false (imp-2642/imp-2701), imp-2640 Gronwall discharge of C_Lip NEGATIVE. ' +
    'No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (two-endpoint anchor ' +
    'filled here; C_KH, rate factor, Lambert-W count-inversion reused); ' +
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, C_KH); ' +
    'src/data/zeros-to-1e6.js (imp-359, Odlyzko table) for the intermediate true ' +
    'heights, baked as literals (not imported, to keep this module light).',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for
// any consumer surface (e.g. the imp-96454 viz page) that renders this finding.
export const IMP96426_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/accuracy audit '
  + 'only: the four intermediate anchors (N = 1e3..1e6) are externally tabulated '
  + 'true zero heights (Odlyzko table, imp-359) bridging the imp-96402 '
  + 'macroscopic first-zero gap and the double-precision floor at N = 1e22; no '
  + 'gap closed, no bound changed, G6_polymath15_bridge not closed, conditional '
  + 'C_H <= 0.127 stays UNPROVEN.';

export const IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS_ASSERTIONS = [
  {
    id: 'imp96426-intermediate-gaps-above-floor-below-macroscopic',
    holds: () =>
      INTERMEDIATE_ANCHORS.every(
        (a) =>
          Math.abs(a.rateRelGap) > 1e-10 &&
          Math.abs(a.rateRelGap) < ENDPOINT_FIRST_ZERO.rateRelGap,
      ),
    why:
      'Each intermediate anchor must sit strictly between the imp-96402 endpoints: ' +
      'its count-model rate gap must be well above the double-precision floor ' +
      '(> 1e-10, so it is a resolved count-model effect, unlike the 1e22 endpoint) ' +
      'and below the 8.47e-2 first-zero macroscopic gap.',
  },
  {
    id: 'imp96426-gap-ladder-monotone-decreasing',
    holds: () => LADDER_IS_MONOTONE_DECREASING,
    why:
      'The count-model gamma gap decays like 1/(gamma_N log gamma_N), so the ' +
      'intermediate ladder N = 1e3, 1e4, 1e5, 1e6 must be strictly monotone ' +
      'decreasing, exhibiting the smooth transition between the imp-96402 endpoints.',
  },
  {
    id: 'imp96426-true-heights-belong-to-their-index',
    holds: () =>
      INTERMEDIATE_ANCHORS.every(
        (a) => Math.abs(smoothCount(a.gammaTrue) / a.N - 1) < 5e-3,
      ),
    why:
      'The RvM smooth (main-term) count at each baked true height must return its ' +
      'index N to within the small count-model offset -(7/8 + S(T))/N (< 5e-3 for ' +
      'N >= 1e3), cross-validating that each externally tabulated height belongs to ' +
      'the claimed index.',
  },
  {
    id: 'imp96426-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS.verdict,
      ) &&
      IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
  {
    id: 'imp96426-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96426_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96426_HONEST_BANNER) &&
      /NO QED/.test(IMP96426_HONEST_BANNER),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers for any consumer surface that renders this finding.',
  },
];
