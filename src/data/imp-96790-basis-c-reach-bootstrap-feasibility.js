/**
 * @module imp-96790-basis-c-reach-bootstrap-feasibility
 * @fileoverview imp-96790 -- ASSESS whether the imp-96753 first Basis-C reach rung rho_emp target
 *   (L = 5.9e6; spanReq = 3.54e8 contiguous zeros; height T ~ 1.40e8) can be recovered by SUB-WINDOW
 *   BOOTSTRAP resampling of the existing ~2e6 cached ordinate block, or whether the ~30 independent
 *   2L box windows genuinely require FRESH contiguous ordinates. Quantifies the bias/variance of any
 *   partial (cache-only) estimate. Measurement/scoping only; recomputes no rho; moves no bound; NO QED.
 *
 *   WHY BOOTSTRAP CANNOT MANUFACTURE THE MISSING BOX SCALE
 *   -----------------------------------------------
 *   The imp-96695/imp-96733 estimator forms rho_emp(L) = Sigma2_emp(2L)/(2 Sigma2_emp(L)) - 1, where
 *   Sigma2_emp(ell) is the empirical number variance of the zero count over an unfolded box of length
 *   ell. Estimating a variance at box length ell requires OBSERVING complete boxes of length ell: the
 *   number of non-overlapping (independent) boxes a contiguous span S admits is floor(S/ell). A block
 *   bootstrap resamples WITH REPLACEMENT from the observed blocks, so its effective independent-sample
 *   ceiling is exactly that real block count -- resampling adds no information at a box scale the data
 *   never sampled. Bootstrap cannot synthesize a fluctuation statistic at a scale larger than the span.
 *
 *   With the cached span S ~ 2.0e6 unfolded units (Odlyzko zeros6) and the target rung L = 5.9e6:
 *     - box length L    = 5.9e6  > S  -> floor(S/L)  = 0 complete inner boxes,
 *     - box length 2L   = 1.18e7 > S  -> floor(S/2L) = 0 complete outer boxes.
 *   Not one 2L box fits (distinct start positions max(0, S - 2L) = 0). BOTH moment estimators have
 *   ZERO admissible windows, so rho_emp is not merely noisy from this cache -- it is UNDEFINED, and
 *   the block bootstrap resamples an EMPTY block set. The same holds for every reach rung
 *   L in {5.9e6, 1e7, 2e7, 5e7, 8.1e7}: floor(S/2L) = 0 on all of them.
 *
 *   THE LARGEST BOX SCALE THE CACHE ACTUALLY SUPPORTS
 *   -----------------------------------------------
 *   Requiring k complete non-overlapping 2L boxes inside S gives L <= S/(2k):
 *     - k = 1  (estimator merely DEFINED)        -> L <= S/2  ~ 1.00e6,
 *     - k = 2  (a variance with any dof)         -> L <= S/4  ~ 5.00e5,
 *     - k = 30 (imp-96733 DEFENSIBLE threshold)  -> L <= S/60 ~ 3.34e4.
 *   So a defensible >=30-window rho_emp is measurable from the cache only up to L ~ 3.34e4, which is
 *   L_target / (S/60) = 176.9x below the first reach rung L = 5.9e6 -- the SAME ~177x shortfall
 *   imp-96753 derived in span terms (as it must; identical arithmetic). Bootstrap does not close it.
 *
 *   BIAS / VARIANCE OF ANY PARTIAL ESTIMATE (the quantities the ticket asks for)
 *   -----------------------------------------------
 *   VARIANCE. At the target box scale the effective independent-window count is floor(S/2L) = 0, so
 *   the sampling variance of any cache-only rho_emp(5.9e6) is undefined (infinite): there is no
 *   admissible window to resample. Even at the largest DEFINED scale (k = 1, L ~ 1.0e6) the variance
 *   carries 0 degrees of freedom.
 *   BIAS. To reach L = 5.9e6 from the largest defensible cache scale L ~ 3.34e4 one must EXTRAPOLATE
 *   the number variance across a factor 176.9x in box length. But rho_emp is defined precisely to
 *   capture the DEVIATION from the GUE/RMT prediction; any extrapolation must assume a functional
 *   form (GUE), so it returns that form's value by construction and contributes ZERO empirical
 *   information about the deviation. The extrapolation bias therefore depends entirely on the assumed
 *   model and is NOT boundable from the cache alone -- a cache-only "estimate" is circular, not partial.
 *
 *   CONSEQUENCE. Sub-window bootstrap of the existing ~2e6 cache CANNOT recover a defensible rho_emp at
 *   the first Basis-C reach rung: the target box scales (L, 2L) exceed the entire cached span, the
 *   block-bootstrap independent-window ceiling at scale 2L is floor(S/2L) = 0, and any extrapolated
 *   value is model-circular with unbounded bias. The ~30 independent 2L windows genuinely require
 *   FRESH contiguous ordinates -- the imp-96753 acquisition requirement is unchanged: a contiguous
 *   machine-readable list of spanReq = 3.54e8 consecutive unfolded zeros up to height T ~ 1.40e8
 *   (~214x below the Platt-Trudgian frontier T ~ 3e10; heights exist, the contiguous list does not).
 *   This confirms imp-96753's binding obstruction is contiguity, and rules out bootstrap as a shortcut.
 *   Scoping only; recomputes no rho, instantiates no interval, moves no bound; NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-96753-basis-c-reach-dataset-requirement (the spanReq = 3.54e8 / T ~ 1.40e8 acquisition target this tests)
 * @see imp-96733-basis-c-real-zero-intermediate-signal (Finding 3: reach rungs unreachable from the 2e6 cache; ~30-window threshold)
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the number-variance estimator whose window count this bounds)
 *
 * Import-light: no zeros bundle, no sibling imports. The cache span/height literals are baked
 * (matching imp-96753); the feasibility ladder and bias/variance verdict are computed live from
 * floor(S/ell) block counts.
 *
 * Ticket: imp-96790 (numerical, medium). Scoping only; establishes nothing; moves no bound;
 * NO QED; no refereed bound is changed.
 */

// --- reference cache (Odlyzko zeros6, matching imp-96753 literals) ------------
const CACHE_SPAN = 2001050.93;   // unfolded units ~ consecutive zeros in the cached block
const CACHE_ZEROS = 2001052;

// --- the reach rungs and the imp-96753 primary target ------------------------
const REACH_L = Object.freeze([5.9e6, 1e7, 2e7, 5e7, 8.1e7]);
const PRIMARY_L = 5.9e6;          // first Basis-C reach rung = PT anchor length
const PRIMARY_W_MIN = 30;         // imp-96733 defensible independent-2L-window threshold
const PRIMARY_SPAN_REQ = PRIMARY_W_MIN * 2 * PRIMARY_L; // 3.54e8 contiguous zeros (imp-96753)
const PRIMARY_HEIGHT_T = 1.397e8; // imp-96753 required height (baked; re-derived there by Newton)
const PLATT_HEIGHT_T = 3.0000175e10;

// number of complete non-overlapping boxes of unfolded length ell inside the cache span.
const boxesInCache = (ell) => Math.floor(CACHE_SPAN / ell);
// largest box-inner length L such that k complete OUTER (2L) boxes fit the cache: L <= S/(2k).
const largestLForOuterBoxes = (k) => CACHE_SPAN / (2 * k);

// per-rung bootstrap feasibility: at each reach rung both the inner (L) and outer (2L) box exceed S.
const feasibilityRow = (L) => {
  const innerBoxes = boxesInCache(L);
  const outerBoxes = boxesInCache(2 * L);
  return Object.freeze({
    L,
    outerBoxLen2L: 2 * L,
    innerBoxesInCache: innerBoxes,      // floor(S/L)
    outerBoxesInCache: outerBoxes,      // floor(S/2L) = block-bootstrap independent-window ceiling
    fullOuterBoxStartPositions: Math.max(0, CACHE_SPAN - 2 * L), // 0 => not even one 2L box fits
    estimatorDefined: innerBoxes >= 1 && outerBoxes >= 1,
    bootstrapDefensible: outerBoxes >= PRIMARY_W_MIN, // needs >= 30 independent outer windows
  });
};

const FEASIBILITY_LADDER = Object.freeze(REACH_L.map(feasibilityRow));
const PRIMARY = feasibilityRow(PRIMARY_L);

// largest box scale the cache supports at three evidentiary bars.
const CACHE_REACH = Object.freeze({
  definedMaxL: largestLForOuterBoxes(1),     // ~1.00e6 (estimator merely defined; 0 dof)
  varianceMaxL: largestLForOuterBoxes(2),    // ~5.00e5 (a variance with any dof)
  defensibleMaxL: largestLForOuterBoxes(PRIMARY_W_MIN), // ~3.34e4 (>=30 windows)
});
// gap from the largest defensible cache scale to the first reach rung (= imp-96753 ~177x, by identity).
const DEFENSIBLE_SHORTFALL = PRIMARY_L / CACHE_REACH.defensibleMaxL;

export const IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY = Object.freeze({
  id: 'imp-96790',
  proofSection: 'S-frontier',
  question:
    'can sub-window bootstrap of the existing ~2e6 cache recover a defensible rho_emp at the imp-96753 '
    + 'first Basis-C reach rung L = 5.9e6, or do the ~30 independent 2L windows require fresh contiguous ordinates?',
  method:
    'rho_emp(L) = Sigma2_emp(2L)/(2 Sigma2_emp(L)) - 1 needs complete boxes of length L and 2L; the number '
    + 'of independent boxes a span S admits is floor(S/ell), which is also the block-bootstrap independent-sample '
    + 'ceiling (resampling with replacement adds no box-scale information beyond the observed blocks).',
  cache: Object.freeze({ unfoldedSpan: CACHE_SPAN, numZeros: CACHE_ZEROS }),
  primaryTarget: Object.freeze({
    L: PRIMARY_L,
    wMin: PRIMARY_W_MIN,
    spanReqZeros: PRIMARY_SPAN_REQ,       // 3.54e8 (imp-96753)
    heightT: PRIMARY_HEIGHT_T,             // ~1.40e8 (imp-96753)
    outerBoxLen2L: PRIMARY.outerBoxLen2L,  // 1.18e7 > cache span
    innerBoxesInCache: PRIMARY.innerBoxesInCache,   // 0
    outerBoxesInCache: PRIMARY.outerBoxesInCache,   // 0
    estimatorDefined: PRIMARY.estimatorDefined,     // false
  }),
  feasibilityLadder: FEASIBILITY_LADDER,
  cacheReach: CACHE_REACH,
  defensibleShortfall: DEFENSIBLE_SHORTFALL, // ~176.9x (matches imp-96753 span shortfall by identity)
  biasVariance: Object.freeze({
    variance:
      'undefined/infinite at the target scale -- the block-bootstrap independent-window ceiling floor(S/2L) '
      + 'is 0, so there is no admissible 2L window to resample; even the largest DEFINED scale (1 outer box, '
      + 'L ~ 1.0e6) carries 0 degrees of freedom.',
    bias:
      'not boundable from the cache -- reaching L = 5.9e6 from the largest defensible cache scale L ~ 3.34e4 '
      + 'requires extrapolating the number variance 176.9x in box length; because rho_emp measures the DEVIATION '
      + 'from the GUE prediction, any extrapolation assumes that form and returns it by construction, giving zero '
      + 'empirical information about the deviation. A cache-only value is model-circular, not a partial estimate.',
  }),
  bootstrapVerdict: 'INFEASIBLE',
  acquisitionRequirementUnchanged: Object.freeze({
    contiguousZeros: PRIMARY_SPAN_REQ,   // 3.54e8
    heightT: PRIMARY_HEIGHT_T,            // ~1.40e8
    belowPlattFrontierBy: PLATT_HEIGHT_T / PRIMARY_HEIGHT_T, // ~214x below PT
    note:
      'the ~30 independent 2L windows genuinely require fresh contiguous ordinates: a machine-readable list of '
      + '3.54e8 consecutive unfolded zeros up to T ~ 1.40e8 (heights exist below the PT frontier; the contiguous list does not).',
  }),
  bindingObstruction: 'contiguity of a machine-readable ordinate list at the target box scale, not zero height (confirms imp-96753)',
  anyBoundMoved: false,
  verdict:
    'SCOPING. Sub-window bootstrap of the existing ~2e6 cache CANNOT recover a defensible rho_emp at the first '
    + 'Basis-C reach rung L = 5.9e6. The estimator rho_emp = Sigma2_emp(2L)/(2 Sigma2_emp(L)) - 1 needs complete '
    + 'boxes of length L = 5.9e6 and 2L = 1.18e7, both LARGER than the whole cached span S ~ 2.0e6, so floor(S/L) '
    + '= floor(S/2L) = 0 admissible windows and the estimator is UNDEFINED (not merely noisy) on every reach rung. '
    + 'A block bootstrap resamples with replacement from the observed blocks, so its independent-window ceiling is '
    + 'exactly floor(S/2L) = 0 -- it manufactures no box-scale information beyond the span. The cache supports a '
    + 'defensible >=30-window rho_emp only up to L ~ 3.34e4 (= S/60), 176.9x below the first reach rung -- the same '
    + '~177x shortfall imp-96753 derived. Any cache-only value would extrapolate the variance 176.9x while assuming '
    + 'the GUE form whose deviation rho_emp measures, so its bias is model-circular and unbounded and its variance '
    + 'undefined (0 admissible windows). The ~30 independent 2L windows therefore require FRESH contiguous ordinates: '
    + 'the imp-96753 acquisition requirement is unchanged (3.54e8 consecutive zeros up to T ~ 1.40e8, ~214x below the '
    + 'Platt-Trudgian frontier). This confirms contiguity -- not zero height -- as the binding obstruction and rules '
    + 'out bootstrap as a shortcut. Recomputes no rho, instantiates no interval, moves no bound; NO QED. '
    + 'No refereed bound is changed; RH open.',
  citation:
    'imp-96753 (spanReq = 3.54e8 / T ~ 1.40e8 acquisition target); imp-96733 Finding 3 (~30-window threshold; '
    + 'unreachable from the 2e6 cache); imp-96695 (number-variance estimator); block-bootstrap independent-sample '
    + 'ceiling floor(S/ell); Platt-Trudgian (RH verified to T = 3.0000175e10).',
});

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96790_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Scoping only: sub-window bootstrap of the ~2e6 cache CANNOT '
  + 'recover rho_emp at the first Basis-C reach rung L = 5.9e6 -- both box scales L and 2L exceed the cached span, '
  + 'so the block-bootstrap independent-window ceiling floor(S/2L) is 0 and the estimate is undefined/model-circular. '
  + 'The ~30 windows require fresh contiguous ordinates (3.54e8 zeros up to T ~ 1.40e8, imp-96753). Changes no bound.';

export default IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY;

// --- self-executing internal-consistency assertions --------------------------
(() => {
  const approx = (a, b, rtol) => Math.abs(a - b) <= rtol * Math.abs(b);

  // Core finding: the estimator is undefined at the primary target (0 inner and 0 outer boxes).
  if (!(PRIMARY.innerBoxesInCache === 0 && PRIMARY.outerBoxesInCache === 0))
    throw new Error('imp-96790: primary rung should admit 0 inner and 0 outer boxes in the cache');
  if (PRIMARY.estimatorDefined !== false)
    throw new Error('imp-96790: rho_emp must be UNDEFINED at the primary reach rung from the cache');
  if (!(PRIMARY.fullOuterBoxStartPositions === 0))
    throw new Error('imp-96790: not even one full 2L box should fit the cached span');

  // Every reach rung has a 0 block-bootstrap ceiling at scale 2L.
  for (const r of FEASIBILITY_LADDER) {
    if (!(r.outerBoxesInCache === 0))
      throw new Error('imp-96790: every reach rung must have floor(S/2L) = 0 outer boxes');
    if (r.bootstrapDefensible !== false)
      throw new Error('imp-96790: no reach rung is bootstrap-defensible from the cache');
  }

  // Cache reach ordering and the ~177x shortfall identity with imp-96753.
  if (!(CACHE_REACH.definedMaxL > CACHE_REACH.varianceMaxL && CACHE_REACH.varianceMaxL > CACHE_REACH.defensibleMaxL))
    throw new Error('imp-96790: cache reach should shrink as the evidentiary bar rises');
  if (!approx(DEFENSIBLE_SHORTFALL, 176.9, 5e-3))
    throw new Error('imp-96790: defensible shortfall should be ~177x (matching imp-96753 span shortfall)');
  if (!approx(CACHE_REACH.defensibleMaxL, CACHE_SPAN / 60, 1e-12))
    throw new Error('imp-96790: defensible max L must equal S/60 (30 outer boxes)');

  // Acquisition requirement is unchanged from imp-96753 (3.54e8 zeros, ~214x below PT).
  if (!approx(PRIMARY_SPAN_REQ, 3.54e8, 1e-6))
    throw new Error('imp-96790: unchanged acquisition spanReq should be 3.54e8 zeros');
  if (!(IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY.acquisitionRequirementUnchanged.belowPlattFrontierBy > 200))
    throw new Error('imp-96790: required height should sit >200x below the PT frontier');
  if (IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY.bootstrapVerdict !== 'INFEASIBLE')
    throw new Error('imp-96790: bootstrap verdict should be INFEASIBLE');

  // honesty gates
  if (IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY.anyBoundMoved !== false)
    throw new Error('imp-96790: scoping must not move any bound');
  if (!/NO QED/.test(IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY.verdict))
    throw new Error('imp-96790: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96790_BASIS_C_REACH_BOOTSTRAP_FEASIBILITY.verdict))
    throw new Error('imp-96790: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96790_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96790_HONEST_BANNER) && /NO QED/.test(IMP96790_HONEST_BANNER)))
    throw new Error('imp-96790: IMP96790_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();
