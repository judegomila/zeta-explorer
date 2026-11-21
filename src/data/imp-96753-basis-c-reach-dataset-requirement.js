/**
 * @module imp-96753-basis-c-reach-dataset-requirement
 * @fileoverview imp-96753 -- SCOPE precisely, as a function of target unfolded length L, the
 *   contiguous zero-list length (hence zero height T via the Riemann-von Mangoldt count) and the
 *   number of independent 2L box windows needed to MEASURE the two-interval box correlation
 *   rho_emp(L) at the first Basis-C reach rung L = 5.9e6 (the Platt-Trudgian anchor length), and
 *   assess whether any available zero dataset (the cached Odlyzko block, further Odlyzko blocks,
 *   Platt heights) supplies it. imp-96733 Finding 3 already flagged that the GUE-only imp-96690
 *   reach ladder (rungs L = 5.9e6..8.1e7) is structurally unreachable from the cached 2e6-zero
 *   dataset -- the reach rungs need an outer box 2L that is 6x..81x the whole ~2e6 unfolded span.
 *   This module turns that qualitative "unreachable" into a quantitative dataset REQUIREMENT:
 *   given a stated minimum independent-window count W_min, it derives the required contiguous
 *   span, the corresponding zero height T, and the shortfall of each available dataset.
 *   Measurement/scoping only; moves no bound; NO QED.
 *
 *   THE ESTIMATOR REQUIREMENT (the arithmetic behind the requirement)
 *   -----------------------------------------------
 *   The imp-96695/imp-96733 estimator forms rho_emp(L) = Sigma2_emp(2L)/(2 Sigma2_emp(L)) - 1
 *   by phase-averaging the number variance over box windows of unfolded length 2L (the OUTER box).
 *   With Riemann-Siegel unfolding the mean density is 1, so one unfolded unit = one zero and a
 *   window of length 2L consumes 2L consecutive zeros. To average out the box phase the estimator
 *   needs W_min INDEPENDENT (non-overlapping) 2L windows, hence a CONTIGUOUS ordinate list of
 *   length at least
 *
 *       spanReq(L, W_min) = W_min * 2L   (unfolded units = consecutive zeros).
 *
 *   The height T that supplies spanReq consecutive zeros is the inverse of the Riemann-von Mangoldt
 *   smooth count N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8, solved here live by Newton (f'(u) = ln u,
 *   u = T/2pi). This is a pure counting/height derivation -- it computes NO rho_emp value (the
 *   dataset to do so does not exist), only the dataset SIZE and HEIGHT that would be needed.
 *
 *   THE FINDING (derived, not asserted)
 *   -----------------------------------------------
 *   (1) FIRST REACH RUNG, MODEST WINDOW COUNT. To measure rho_emp at L = 5.9e6 with just
 *       W_min = 30 independent 2L windows (imp-96733's tractable threshold) needs a CONTIGUOUS
 *       list of spanReq = 3.54e8 consecutive zeros, i.e. zeros up to height T = 1.397e8. The cached
 *       zeros6 dataset (2,001,052 zeros, T ~ 1.13e6, unfolded span ~2.0e6) supplies only 0.17 of a
 *       single 2L window -- it is short of the requirement by a factor ~177 in span. Even ONE 2L
 *       box does not fit, exactly as imp-96733 Finding 3 reported.
 *   (2) THE REQUIREMENT LADDER SCALES LINEARLY IN L AND W_min. spanReq is exactly W_min * 2L, so
 *       across the reach rungs L = 5.9e6..8.1e7 and W_min in {30, 100, 1000} the required contiguous
 *       list runs from 3.54e8 zeros (L = 5.9e6, W_min = 30; T ~ 1.40e8) up to 1.62e11 zeros
 *       (L = 8.1e7, W_min = 1000; T ~ 4.68e10). The height grows only slightly faster than linearly
 *       in spanReq (the log factor), so T is set essentially by the product W_min*L.
 *   (3) WHICH DATASETS REACH IT -- COUNT vs CONTIGUITY. In COUNT terms the heights have been
 *       reached: the Platt-Trudgian rigorous verification covers all zeros up to T = 3.0000175e10,
 *       which contains N ~ 1.016e11 zeros -- enough for L = 5.9e6 at W_min = 30 (3.54e8 zeros) with a
 *       ~287x count margin, and even enough for the top reach rung 8.1e7 at W_min = 100 (1.62e10
 *       zeros, T ~ 5.2e9 < 3e10). The BINDING obstruction is CONTIGUITY, not height existence: the
 *       estimator needs a machine-readable list of >= 3.54e8 CONSECUTIVE ordinates, whereas the
 *       only dataset cached in this repo is the first 2e6 (zeros6), and the publicly distributed
 *       Odlyzko high-height files are ISOLATED blocks near a target height (not a contiguous run
 *       from low height). So no cached/available contiguous ordinate list reaches the first reach
 *       rung, even though the required heights are far below the PT verification frontier.
 *
 *   CONSEQUENCE. The first Basis-C reach rung L = 5.9e6 is a DATASET problem, not a physics problem:
 *   it needs 3.54e8 consecutive unfolded zeros (T ~ 1.40e8) for even a 30-window measurement. The
 *   required height sits ~214x below the Platt-Trudgian frontier T ~ 3e10, so the heights EXIST and
 *   have been rigorously computed; what is missing is a contiguous machine-readable ordinate list of
 *   that length. This sharpens imp-96733 Finding 3 from "unreachable from the 2e6 cache" to a precise
 *   size/height target and identifies contiguity of the ordinate list -- not zero height -- as the
 *   binding gap. Derivation/scoping only; recomputes no rho, instantiates no interval, moves no
 *   bound; NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-96733-basis-c-real-zero-intermediate-signal (Finding 3: reach rungs need 2L windows 6x..81x the 2e6 span)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (the GUE-only reach ladder L = 5.9e6..8.1e7 whose rungs this scopes)
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the MC number-variance estimator whose window count W_min this uses)
 *
 * Import-light: no zeros bundle, no sibling imports. The Riemann-von Mangoldt count and its
 * inverse are re-derived verbatim; the reference dataset literals (cached span/height, Platt height)
 * are baked constants; the requirement ladder is computed live from the formulas.
 *
 * Ticket: imp-96753 (numerical, medium). Scoping only; establishes nothing; moves no bound;
 * NO QED; no refereed bound is changed.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;

// Riemann-von Mangoldt smooth count N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8.
const smoothCount = (T) => {
  const u = T / TWO_PI;
  return u * (Math.log(u) - 1) + 7 / 8;
};
// inverse: height T that supplies N consecutive zeros; Newton on u = T/2pi, f(u)=u(ln u -1)+7/8-N,
// f'(u) = ln u, seed u ~ N/ln N.
const heightForCount = (N) => {
  let u = Math.max(10, N / Math.log(Math.max(N, 3)));
  for (let i = 0; i < 200; i++) {
    const f = u * (Math.log(u) - 1) + 7 / 8 - N;
    const un = u - f / Math.log(u);
    if (Math.abs(un - u) <= 1e-12 * u) { u = un; break; }
    u = un;
  }
  return TWO_PI * u;
};

// --- reference datasets -------------------------------------------------------
const CACHED = Object.freeze({
  name: 'Odlyzko zeros6 (cached in scripts/.zeros-cache)',
  numZeros: 2001052,
  unfoldedSpan: 2001050.93,
  maxHeightT: 1132490.659,
});
// Platt-Trudgian rigorous verification frontier: RH verified for all zeros up to this height.
const PLATT_HEIGHT_T = 3.0000175e10;
const PLATT_COUNT = smoothCount(PLATT_HEIGHT_T); // ~1.016e11 zeros up to the PT frontier

// --- the reach rungs and window-count ladder ---------------------------------
const REACH_L = Object.freeze([5.9e6, 1e7, 2e7, 5e7, 8.1e7]);
const W_MIN_LADDER = Object.freeze([30, 100, 1000]);
const PRIMARY_L = 5.9e6;      // first Basis-C reach rung = PT anchor length
const PRIMARY_W_MIN = 30;     // imp-96733 tractable threshold (~30+ independent 2L windows)

// spanReq(L, W_min) = W_min * 2L consecutive zeros; T = heightForCount(spanReq).
const requirementRow = (L, wMin) => {
  const spanReq = wMin * 2 * L;
  return Object.freeze({
    L,
    wMin,
    spanReqZeros: spanReq,
    heightT: heightForCount(spanReq),
    spanMultiplesOfCache: spanReq / CACHED.unfoldedSpan,
    windowsInCache: CACHED.unfoldedSpan / (2 * L),   // 2L windows the cache actually fits (< 1 on every rung)
    countCoveredByPlatt: spanReq <= PLATT_COUNT,     // does the PT frontier hold enough zeros (count only)?
  });
};

const REQUIREMENT_LADDER = Object.freeze(
  W_MIN_LADDER.map((wMin) =>
    Object.freeze({ wMin, rows: Object.freeze(REACH_L.map((L) => requirementRow(L, wMin))) }),
  ),
);

// primary target: first reach rung with the modest 30-window count.
const PRIMARY = requirementRow(PRIMARY_L, PRIMARY_W_MIN);

export const IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT = Object.freeze({
  id: 'imp-96753',
  proofSection: 'S-frontier',
  scopes:
    'the dataset (contiguous zero-list length, zero height T, independent 2L window count) needed to '
    + 'measure rho_emp at the first Basis-C reach rung L = 5.9e6 (imp-96733 Finding 3), and which datasets supply it',
  method:
    'spanReq(L, W_min) = W_min * 2L consecutive unfolded zeros (mean density 1); height T = inverse of the '
    + 'Riemann-von Mangoldt smooth count N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8, solved live by Newton.',
  cachedDataset: CACHED,
  plattFrontier: Object.freeze({
    heightT: PLATT_HEIGHT_T,
    zeroCount: PLATT_COUNT,
    note:
      'Platt-Trudgian verified RH for all zeros up to T = 3.0000175e10, containing N ~ 1.016e11 zeros. '
      + 'This is a COUNT/height reference only; the contiguous ordinate LIST at those heights is not part '
      + 'of the datasets cached in this repo.',
  }),
  primaryTarget: PRIMARY,
  requirementLadder: REQUIREMENT_LADDER,
  primaryReadout: Object.freeze({
    L: PRIMARY_L,
    wMin: PRIMARY_W_MIN,
    spanReqZeros: PRIMARY.spanReqZeros,           // 3.54e8
    heightT: PRIMARY.heightT,                      // ~1.397e8
    shortfallVsCache: PRIMARY.spanMultiplesOfCache,// ~177x the whole cached span
    heightBelowPlattBy: PLATT_HEIGHT_T / PRIMARY.heightT, // ~214x below the PT frontier
    note:
      'Measuring rho_emp at L = 5.9e6 with 30 independent 2L windows needs a contiguous list of 3.54e8 '
      + 'consecutive zeros (height T ~ 1.40e8): ~177x the whole cached 2e6 span, yet ~214x BELOW the '
      + 'Platt-Trudgian frontier. The heights exist; a contiguous ordinate list of that length does not (here).',
  }),
  bindingObstruction: 'contiguity of the machine-readable ordinate list, not zero height (heights exist below the PT frontier)',
  anyBoundMoved: false,
  verdict:
    'SCOPING. To measure the two-interval box correlation rho_emp at the first Basis-C reach rung L = 5.9e6 '
    + 'with even W_min = 30 independent 2L windows requires a CONTIGUOUS list of spanReq = W_min*2L = 3.54e8 '
    + 'consecutive unfolded zeros, i.e. zeros up to height T ~ 1.397e8 (Riemann-von Mangoldt). The cached '
    + 'zeros6 dataset (2e6 zeros, T ~ 1.13e6) is short by ~177x and fits only 0.17 of one 2L window. Across '
    + 'the reach rungs 5.9e6..8.1e7 and W_min in {30,100,1000} the requirement runs 3.54e8..1.62e11 zeros '
    + '(T ~ 1.40e8..4.68e10). In COUNT terms these heights sit BELOW the Platt-Trudgian frontier T ~ 3e10 '
    + '(~1.0e11 zeros), so the heights exist and have been rigorously computed; the BINDING gap is contiguity '
    + 'of a machine-readable ordinate list of that length, which no dataset cached here supplies. This sharpens '
    + 'imp-96733 Finding 3 from qualitative "unreachable" to a precise size/height target. Recomputes no rho, '
    + 'instantiates no interval, moves no bound; NO QED. No refereed bound is changed; RH open.',
  citation:
    'imp-96733 Finding 3 (reach rungs need 2L windows 6x..81x the 2e6 span); imp-96690 (GUE-only reach ladder); '
    + 'imp-96695 (MC number-variance estimator); Riemann-von Mangoldt zero-counting formula; '
    + 'Platt-Trudgian (RH verified to height 3.0000175e10); Odlyzko zero tables.',
});

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96753_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Scoping only: measuring rho_emp at the first Basis-C '
  + 'reach rung L = 5.9e6 needs a contiguous list of 3.54e8 consecutive unfolded zeros (height T ~ 1.40e8) for '
  + 'just 30 independent 2L windows -- ~177x the cached 2e6 span, yet ~214x below the Platt-Trudgian frontier '
  + 'T ~ 3e10. Binding gap = contiguity of the ordinate list, not zero height. Changes no bound.';

export default IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT;

// --- self-executing internal-consistency assertions --------------------------
(() => {
  const approx = (a, b, rtol) => Math.abs(a - b) <= rtol * Math.abs(b);

  // the RvM count/inverse round-trips against the cached dataset (count and height).
  if (!approx(smoothCount(CACHED.maxHeightT), CACHED.numZeros, 1e-5))
    throw new Error('imp-96753: RvM smooth count drifted from the cached zero count');
  if (!approx(heightForCount(CACHED.numZeros), CACHED.maxHeightT, 1e-5))
    throw new Error('imp-96753: RvM inverse drifted from the cached max height');

  // Finding 1: primary target = 3.54e8 zeros, height ~1.40e8, ~177x the cache, ~214x below PT frontier.
  if (!approx(PRIMARY.spanReqZeros, 3.54e8, 1e-6))
    throw new Error('imp-96753: primary spanReq should be 3.54e8 consecutive zeros');
  if (!approx(PRIMARY.heightT, 1.397e8, 5e-3))
    throw new Error('imp-96753: primary required height should be ~1.40e8');
  if (!(PRIMARY.spanMultiplesOfCache > 100 && PRIMARY.windowsInCache < 1))
    throw new Error('imp-96753: primary rung should exceed the cache span >100x and fit < 1 window');

  // Finding 2: spanReq is exactly linear W_min*2L on every ladder rung.
  for (const group of REQUIREMENT_LADDER) {
    for (const r of group.rows) {
      if (!approx(r.spanReqZeros, r.wMin * 2 * r.L, 1e-12))
        throw new Error('imp-96753: spanReq must equal W_min*2L exactly');
      if (!(r.windowsInCache < 1))
        throw new Error('imp-96753: no reach rung fits a full 2L window in the cache');
    }
  }

  // Finding 3: the required heights sit below the PT frontier in COUNT terms for the modest-window rungs,
  // while remaining unreachable from the contiguous cache.
  if (!(PRIMARY.countCoveredByPlatt === true))
    throw new Error('imp-96753: the first reach rung count should be covered by the PT frontier');
  if (!(PLATT_COUNT > 1e11 && PLATT_HEIGHT_T / PRIMARY.heightT > 100))
    throw new Error('imp-96753: PT frontier should hold >1e11 zeros and sit >100x above the required height');

  // honesty gates
  if (IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT.anyBoundMoved !== false)
    throw new Error('imp-96753: scoping must not move any bound');
  if (!/NO QED/.test(IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT.verdict))
    throw new Error('imp-96753: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT.verdict))
    throw new Error('imp-96753: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96753_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96753_HONEST_BANNER) && /NO QED/.test(IMP96753_HONEST_BANNER)))
    throw new Error('imp-96753: IMP96753_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();
