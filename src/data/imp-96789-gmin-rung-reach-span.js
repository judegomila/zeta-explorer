/**
 * imp-96789 -- Minimum contiguous zero-ordinate span to land the FIRST new imp-96629 / imp-96734
 * small-gap exponent rung past the cached N ~ 2e6, and its margin below the Platt-Trudgian rigorous
 * frontier T = 3.0000175e10. Measurement / scoping only; conditional on GUE; NO QED. No refereed bound is changed
 * ; RH open.
 *
 * TICKET (imp-96789). imp-96754 pinned the reach frontier of the imp-96629 / imp-96734 disjoint dyadic
 * block-minima gap-exponent ladder: the top rung k=20 is a ~91%-filled block and the next rung k=21
 * needs the contiguous list to reach index 2^22. This module derives, using the imp-96753
 * Riemann-von Mangoldt height arithmetic, the EXACT zero height that supplies that contiguous list and
 * quantifies how far below the Platt-Trudgian frontier it sits -- confirming the ordinates exist and the
 * binding obstruction is list contiguity, not zero height. It also contrasts the ladder's window cost
 * (ONE block per rung) with the imp-96753 two-interval box estimator (W_min ~ 30 independent 2L
 * windows per rung), showing the gap-exponent ladder is far cheaper to extend by data.
 *
 * METHOD (arithmetic on the cached zero COUNT and the RvM count only -- no zeros bundle imported, no
 * gaps recomputed). The imp-96629 estimator takes ONE block-minimum of the unfolded gap d_n over each
 * disjoint dyadic index block [2^k, 2^{k+1}); each block is one independent extreme (one "window"), so
 * adding a rung means acquiring exactly one further complete block contiguous with the cache. The last
 * COMPLETE cached block is k=19; the top (partial) rung is k=20 (imp-96754). The first NEW rung is
 * therefore k=21 = [2^21, 2^22) = [2097152, 4194304), which is landed only once the contiguous ordinate
 * list reaches index 2^22 = 4,194,304. The zero height T supplying N consecutive zeros is the inverse of
 * the Riemann-von Mangoldt smooth count N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8, solved live by Newton
 * (f prime of u = ln u, u = T/2pi), re-derived verbatim from imp-96753. Import-light; no sibling imports.
 *
 * FINDING 1 (minimum contiguous span for the first new rung).
 *   - Landing rung k=21 needs a contiguous machine-readable list of index 2^22 = 4,194,304 zeros,
 *     i.e. 2^22 - N_MAX = 2,193,252 MORE consecutive ordinates than the cached 2,001,052 (more than
 *     doubling the cache). This is ONE dyadic block (width 2^21 = 2,097,152) beyond the last complete
 *     rung -- one estimator window, not the ~30 windows the imp-96753 box correlation needs.
 *
 * FINDING 2 (the required height, exact -- refines imp-96754's ~2.1e6 approximation).
 *   - Index 2^22 corresponds to zero height T_k21 = 2,236,650.24 (RvM inverse), the height at which the
 *     rung completes; the plotted rung center N_center = 2^21.5 = 2,965,821 sits at T ~ 1.63e6. imp-96754
 *     quoted the block-top height loosely as ~2.1e6; the exact RvM inverse is 2.237e6.
 *
 * FINDING 3 (margin below the PT frontier -- ordinates exist, contiguity binds).
 *   - The PT rigorous verification frontier T = 3.0000175e10 sits 13,413x ABOVE T_k21 in height and
 *     holds ~1.016e11 zeros -- a ~24,232x COUNT margin over the 4.19e6 index needed. So the ordinates
 *     for rung k=21 have been rigorously computed and lie far below the PT frontier; the binding
 *     obstruction is a CONTIGUOUS machine-readable list of that length, not zero height (same binding
 *     gap as imp-96753 / imp-96754), and it is not available in-pool.
 *
 * SUB-GAP imp-96789-first-rung-contiguous-list-not-cached: rung k=21 cannot be measured until a
 * contiguous ordinate list past index 2,001,052 (>= 4,194,304, i.e. >= 2,193,252 more zeros) is acquired
 * and cached; the imp-96734 reach verdict (deviation from -1/3 persistent over N <= ~2e6, no finite-N
 * escape hatch) stands until then.
 *
 * VERDICT. The first NEW gap-exponent rung needs a contiguous list to index 2^22 = 4,194,304 (2,193,252
 * more than cached), reaching height T_k21 = 2.237e6 -- 13,413x below the Platt-Trudgian frontier
 * T ~ 3e10. The heights exist and are rigorously computed; the binding obstruction is list contiguity,
 * not zero height. Unlike the imp-96753 box estimator (~30 independent 2L windows per rung) the ladder
 * needs just ONE block per rung, so it is the cheapest reach ladder to extend by data. Measurement /
 * scoping only; conditional on GUE; NO QED. No refereed bound is changed; RH open.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;

// Riemann-von Mangoldt smooth count N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8 (re-derived verbatim, imp-96753).
const smoothCount = (T) => {
  const u = T / TWO_PI;
  return u * (Math.log(u) - 1) + 7 / 8;
};
// inverse: height T supplying N consecutive zeros; Newton on u = T/2pi, derivative of f is ln u.
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

const N_MAX = 2001052;            // cached consecutive ordinates (scripts/.zeros-cache/zeros6)
const K_TOP_RUNG = 20;            // imp-96754 top (partial) rung
const K_NEXT = K_TOP_RUNG + 1;    // 21 -- first NEW rung requiring data past the cache
const nextRungLo = 2 ** K_NEXT;   // 2097152
const nextRungHi = 2 ** (K_NEXT + 1); // 4194304 -- contiguous index needed to land the rung
const blockWidth = nextRungHi - nextRungLo; // 2^21 = 2097152 (one estimator window)
const spanReqZeros = nextRungHi;  // full contiguous list length needed
const extraOrdinates = nextRungHi - N_MAX; // 2193252 more than cached
const T_k21 = heightForCount(nextRungHi);   // exact height at index 2^22
const T_center = heightForCount(2 ** (K_NEXT + 0.5)); // height at plotted N_center = 2^21.5
const PLATT_HEIGHT_T = 3.0000175e10;
const PLATT_COUNT = smoothCount(PLATT_HEIGHT_T);

export const GMIN_RUNG_REACH_SPAN = {
  id: 'imp-96789',
  proofSection: 'S-frontier',
  source: {
    zerosFile: 'scripts/.zeros-cache/zeros6',
    zerosCount: N_MAX,
    ladderFrom: 'imp-96629 disjoint dyadic block minima (k=6..20); imp-96734 finite-N trend; imp-96754 reach frontier',
    heightArithmetic: 'imp-96753 Riemann-von Mangoldt smooth count and its Newton inverse (re-derived verbatim)',
    note: 'Arithmetic on the cached zero COUNT and the RvM count only; no zeros bundle imported; no gaps recomputed.',
    estimatorWindow: 'ONE disjoint dyadic block [2^k, 2^{k+1}) per rung (block-minimum extreme); one block = one window',
  },
  // FINDING 1 -- minimum contiguous span for the first new rung k=21.
  span: {
    firstNewRungK: K_NEXT,                 // 21
    firstNewRungBlock: [nextRungLo, nextRungHi], // [2097152, 4194304)
    blockWidth,                             // 2097152 (one estimator window)
    contiguousIndexNeeded: spanReqZeros,    // 4194304
    extraOrdinatesBeyondCache: extraOrdinates, // 2193252
    extraMultiplesOfCache: extraOrdinates / N_MAX, // ~1.096 (more than doubling)
    windowsPerRung: 1,                      // block-minima estimator uses ONE block per rung
    contrastWithBoxEstimator:
      'the imp-96753 two-interval box estimator needs W_min ~ 30 independent 2L windows per rung ' +
      '(3.54e8 contiguous zeros at its first reach rung); this gap-exponent ladder needs ONE block ' +
      '(2.19e6 extra ordinates), so it is by far the cheapest reach ladder to extend by data.',
  },
  // FINDING 2 -- exact required height (refines imp-96754 ~2.1e6).
  height: {
    T_atContiguousIndex: T_k21,   // 2236650.24 -- height where the rung completes
    T_atRungCenter: T_center,     // ~1.63e6 at N_center = 2^21.5
    imp96754ApproxHeight: 2.1e6,  // imp-96754 loose block-top height quote
    note: 'RvM inverse of index 2^22 = 4,194,304 gives T = 2.237e6, refining the imp-96754 ~2.1e6 estimate.',
  },
  // FINDING 3 -- margin below the Platt-Trudgian frontier (heights exist; contiguity binds).
  plattFrontier: {
    heightT: PLATT_HEIGHT_T,               // 3.0000175e10
    zeroCount: PLATT_COUNT,                 // ~1.016e11
    heightMarginBelowPT: PLATT_HEIGHT_T / T_k21, // ~13413x below the PT frontier in height
    countMarginBelowPT: PLATT_COUNT / spanReqZeros, // ~24232x more zeros than the index needed
    bindingObstruction: 'contiguity of the machine-readable ordinate list, not zero height (heights exist below PT)',
  },
  subGap:
    'imp-96789-first-rung-contiguous-list-not-cached: rung k=21 needs a contiguous list past index ' +
    '2,001,052 (>= 4,194,304, i.e. >= 2,193,252 more zeros). Not available in-pool; the ordinates exist ' +
    'far below the PT frontier but no machine-readable contiguous list of that length is cached.',
  anyBoundMoved: false,
  verdict:
    'SCOPING. The first NEW imp-96629 / imp-96734 gap-exponent rung (k=21) needs a contiguous ordinate ' +
    'list to index 2^22 = 4,194,304 -- 2,193,252 more than the cached 2,001,052 (one dyadic block, one ' +
    'estimator window) -- reaching zero height T = 2.237e6 (RvM inverse), 13,413x below the ' +
    'Platt-Trudgian frontier T = 3.0000175e10 (a ~24,232x count margin). The ordinates exist and are ' +
    'rigorously computed; the binding obstruction is list contiguity, not zero height (same gap as ' +
    'imp-96753 / imp-96754). Unlike the box estimator (~30 independent 2L windows per rung) this ladder ' +
    'needs one block per rung. Measurement / scoping only; conditional on GUE; NO QED. No refereed bound is changed' +
    '; RH open.',
  citation:
    'imp-96629 (per-window dyadic block-minima gap exponent); imp-96734 (finite-N trend); imp-96754 ' +
    '(reach frontier); imp-96753 (RvM height arithmetic); Platt-Trudgian (RH verified to T = 3.0000175e10).',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96789_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Scoping only: the first new imp-96629 gap-exponent ' +
  'rung (k=21) needs a contiguous list to index 4,194,304 (2,193,252 more zeros than cached), height ' +
  'T = 2.237e6 -- 13,413x below the Platt-Trudgian frontier T ~ 3e10. Binding gap = list contiguity, ' +
  'not zero height. Changes no bound.';

export default GMIN_RUNG_REACH_SPAN;

// --- Self-executing internal-consistency assertions (locked against silent drift) ------------------
(() => {
  const F = GMIN_RUNG_REACH_SPAN;
  const approx = (a, b, rtol) => Math.abs(a - b) <= rtol * Math.abs(b);

  // RvM count/inverse round-trips against the cached dataset.
  if (!approx(heightForCount(N_MAX), 1132490.98, 1e-5))
    throw new Error('imp-96789: RvM inverse drifted from the cached max height');

  // FINDING 1: first new rung is k=21, contiguous index 2^22, extra = 2^22 - N_MAX (> cache).
  if (F.span.firstNewRungK !== 21 || F.span.contiguousIndexNeeded !== 2 ** 22)
    throw new Error('imp-96789: first new rung k=21 must need contiguous index 2^22');
  if (F.span.extraOrdinatesBeyondCache !== 2 ** 22 - N_MAX || !(F.span.extraOrdinatesBeyondCache > N_MAX))
    throw new Error('imp-96789: extra ordinates must equal 2^22 - N_MAX and exceed the full cache');
  if (F.span.windowsPerRung !== 1)
    throw new Error('imp-96789: block-minima ladder must need one window per rung');

  // FINDING 2: exact height at index 2^22 ~ 2.237e6 (refines imp-96754 ~2.1e6).
  if (!approx(F.height.T_atContiguousIndex, 2236650.24, 1e-5))
    throw new Error('imp-96789: contiguous-index height should be ~2.237e6');

  // FINDING 3: heights sit far below the PT frontier (height and count margins), contiguity binds.
  if (!approx(F.plattFrontier.heightMarginBelowPT, 13413, 1e-3))
    throw new Error('imp-96789: PT height margin should be ~13413x');
  if (!(F.plattFrontier.countMarginBelowPT > 1e4))
    throw new Error('imp-96789: PT count margin should exceed 1e4x');

  // honesty gates
  if (F.anyBoundMoved !== false)
    throw new Error('imp-96789: scoping must not move any bound');
  if (!/NO QED/.test(F.verdict))
    throw new Error('imp-96789: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(F.verdict))
    throw new Error('imp-96789: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96789_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96789_HONEST_BANNER) && /NO QED/.test(IMP96789_HONEST_BANNER)))
    throw new Error('imp-96789: IMP96789_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();
