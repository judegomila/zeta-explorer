/**
 * imp-96754 -- Reach frontier and data-acquisition requirement for extending the imp-96629 /
 * imp-96734 disjoint dyadic block-minima gap ladder past N ~ 2e6. Measurement/scoping only;
 * conditional on GUE; NO QED. No refereed bound is changed.
 *
 * TICKET (imp-96734 REACH). imp-96734 found the imp-96616 running-min normalized-gap exponent
 * -0.3953 (vs GUE cube-root -1/3) is PERSISTENT, not a finite-N / plateau artifact, across the
 * measured range -- but its REACH note records the measurement stops at N_center ~ 1.48e6 because
 * only scripts/.zeros-cache/zeros6 (2,001,052 ordinates) is cached; no further Odlyzko blocks were
 * available to extend the dyadic ladder past N ~ 2e6. The ticket asks to acquire/cache the next
 * Odlyzko zero block(s) and extend the k>20 ladder.
 *
 * OUTCOME (HONEST PARTIAL, blocked on data acquisition). Extending the ladder past N ~ 2e6 requires
 * consecutive zeta ordinates BEYOND index 2,001,052; none are cached and none can be fetched inside
 * the API pool. The measurement cannot be advanced without that acquisition. What CAN be done from the
 * existing cache -- and is done here -- is to pin the reach frontier exactly, specify the precise
 * acquisition requirement, and correct one honest N-reach caveat in the existing top rung.
 *
 * METHOD (arithmetic on the cached zero COUNT only -- no zeros bundle imported, no gaps recomputed).
 * zeros6 is the first N_max = 2,001,052 consecutive Riemann zeros (verified line count; last ordinate
 * gamma ~ 1,132,490.66). The imp-96629 estimator uses DISJOINT dyadic index blocks [2^k, 2^{k+1}) with
 * N_center = 2^{k+0.5}. A block is COMPLETE only if its upper index 2^{k+1} <= N_max.
 *
 * FINDING 1 (the top rung is a PARTIAL dyadic block -- honest N-reach caveat).
 *   - Last COMPLETE dyadic block is k=19 = [524288, 1048576), N_center = 741,455.2 (2^19.5).
 *   - The imp-96629 / imp-96734 top rung k=20 = [1048576, 2097152) is TRUNCATED: only
 *     N_max - 2^20 = 952,476 of the 1,048,576 indices in the block are present (fraction 0.90835).
 *     Its plotted N_center = 2^20.5 = 1,482,910.4 assumes a complete block; the geometric center of
 *     the actually-available portion is sqrt(2^20 * N_max) = 1,448,535.5. So the imp-96629 "full"
 *     -0.3983 fit's final point rests on a ~91%-filled block, a minor optimism in stated N-reach
 *     (the block minimum itself is safe -- its argmin index 1,115,577 lies inside the available part).
 *
 * FINDING 2 (exact acquisition requirement to add the next rungs).
 *   - Completing the current k=20 block needs 2^21 - N_max = 96,100 more consecutive ordinates.
 *   - Adding the next rung k=21 = [2097152, 4194304), N_center = 2^21.5 = 2,965,821, needs the
 *     ordinate list to reach index 2^22 = 4,194,304, i.e. 2,193,252 MORE consecutive zeros than the
 *     cache holds (more than doubling it). Each further rung k doubles the requirement (index 2^{k+1}).
 *   - By Riemann-von Mangoldt N(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8, index 4.19e6 corresponds to a
 *     zero height T ~ 2.1e6 -- far below the Platt-Trudgian rigorous frontier T = 3.0000175e10, so the
 *     ordinates EXIST and are rigorously computed; the binding obstruction is a CONTIGUOUS
 *     machine-readable ordinate list of that length, not zero height (same binding gap as imp-96753).
 *
 * SUB-GAP imp-96754-next-contiguous-odlyzko-block-not-cached: the k>=21 ladder rungs cannot be
 * measured until a contiguous zero list extending past index 2,001,052 (>= 4,194,304 to add k=21) is
 * acquired and cached. Until then the imp-96734 verdict (deviation from -1/3 PERSISTENT over the
 * measured range, no finite-N escape hatch) stands as the reach limit; whether the exponent turns
 * toward -1/3 at N far beyond 2e6 remains neither confirmed nor excluded (imp-96734 LIMITATION).
 *
 * VERDICT. The ticket's core measurement is BLOCKED on data acquisition. This module converts the
 * vague REACH note into an exact acquisition spec (>= 2,193,252 more consecutive ordinates for k=21)
 * and records that the existing top rung k=20 is a 90.835%-filled dyadic block. No new zeros read; no
 * gap recomputed; no bound moved; no operator positivity. Measurement/scoping only; conditional on
 * GUE; NO QED. No refereed bound is changed; RH open.
 */

const N_MAX = 2001052; // verified line count of scripts/.zeros-cache/zeros6 (first consecutive zeros)
const LAST_GAMMA = 1132490.658714411; // last ordinate in the cache

// Largest k with a COMPLETE dyadic block [2^k, 2^{k+1}) inside the cache (2^{k+1} <= N_MAX).
function lastCompleteK(nMax) {
  let k = 0;
  while (2 ** (k + 2) <= nMax) k += 1;
  return k; // 2^{k+1} <= nMax < 2^{k+2}
}

const K_LAST_COMPLETE = lastCompleteK(N_MAX); // 19
const K_TOP_RUNG = K_LAST_COMPLETE + 1; // 20 -- the imp-96629 / imp-96734 top (partial) rung
const K_NEXT = K_TOP_RUNG + 1; // 21 -- first rung requiring new data

const topRungLo = 2 ** K_TOP_RUNG; // 1048576
const topRungHi = 2 ** (K_TOP_RUNG + 1); // 2097152
const topRungAvail = N_MAX - topRungLo; // 952476 ordinates present in the k=20 block
const topRungFrac = topRungAvail / (topRungHi - topRungLo); // 0.90835

export const GMIN_LADDER_REACH_FRONTIER = {
  id: 'imp-96754',
  source: {
    zerosFile: 'scripts/.zeros-cache/zeros6',
    zerosCount: N_MAX,
    lastGamma: LAST_GAMMA,
    ladderFrom: 'imp-96629 disjoint dyadic block minima (k=6..20); imp-96734 finite-N trend refit',
    note: 'Arithmetic on the cached zero COUNT only; no zeros bundle imported; no gaps recomputed.',
    estimator: 'disjoint dyadic index blocks [2^k, 2^{k+1}); block-min of unfolded d_n; N_center = 2^{k+0.5}',
  },
  // FINDING 1 -- the imp-96629 / imp-96734 top rung is a partial dyadic block.
  topRung: {
    lastCompleteK: K_LAST_COMPLETE, // 19
    lastCompleteNcenter: 2 ** (K_LAST_COMPLETE + 0.5), // 741455.2
    topRungK: K_TOP_RUNG, // 20
    topRungBlock: [topRungLo, topRungHi], // [1048576, 2097152)
    topRungPlottedNcenter: 2 ** (K_TOP_RUNG + 0.5), // 1482910.4 (assumes a complete block)
    topRungAvailableOrdinates: topRungAvail, // 952476
    topRungFillFraction: topRungFrac, // 0.90835
    topRungAvailableGeoCenter: Math.sqrt(topRungLo * N_MAX), // 1448535.5 (center of the filled part)
    topRungArgminIdx: 1115577, // imp-96629 -- inside the available part, so the block min is safe
    caveat:
      'The imp-96629 "full" -0.3983 fit final point k=20 rests on a ~91%-filled dyadic block; its ' +
      'plotted N_center=2^20.5 slightly overstates the true reach (filled-portion center ~1.448e6). ' +
      'The block minimum is valid (argmin inside the available range); only the stated N-reach is optimistic.',
  },
  // FINDING 2 -- exact acquisition requirement to extend the ladder.
  acquisition: {
    completeTopRungNeeds: topRungHi - N_MAX, // 96100 more consecutive ordinates to finish k=20
    nextRungK: K_NEXT, // 21
    nextRungBlock: [2 ** K_NEXT, 2 ** (K_NEXT + 1)], // [2097152, 4194304)
    nextRungNcenter: 2 ** (K_NEXT + 0.5), // 2965821 (2^21.5)
    nextRungIndexNeeded: 2 ** (K_NEXT + 1), // 4194304
    nextRungExtraOrdinates: 2 ** (K_NEXT + 1) - N_MAX, // 2193252 more consecutive zeros than cached
    heightForNextRungIndexApprox: 2.1e6, // Riemann-von Mangoldt inverse of index ~4.19e6, in gamma units
    plattTrudgianFrontierT: 3.0000175e10, // ordinates for k=21 exist far below this; binding gap is contiguity
    perRungRule: 'each further rung k doubles the required ordinate-list length (upper index 2^{k+1})',
  },
  subGap:
    'imp-96754-next-contiguous-odlyzko-block-not-cached: adding the k>=21 rungs needs a contiguous ' +
    'zero list past index 2,001,052 (>= 4,194,304 ordinates for k=21, i.e. >= 2,193,252 more than ' +
    'cached). Not available in-pool; the ordinates exist below the PT frontier but no machine-readable ' +
    'contiguous list of that length is cached (same binding gap as imp-96753).',
  verdict:
    'Core measurement BLOCKED on data acquisition. Exact spec: >= 2,193,252 more consecutive ordinates ' +
    '(index >= 4,194,304) to add rung k=21 at N_center ~ 2.97e6. Existing top rung k=20 is a ' +
    '90.835%-filled dyadic block (last COMPLETE block is k=19, N_center 741,455). imp-96734 reach ' +
    'verdict (deviation from -1/3 persistent, no finite-N escape hatch over N <= ~2e6) stands. ' +
    'Measurement/scoping only; conditional on GUE; NO QED. No refereed bound is changed; RH open.',
};

export default GMIN_LADDER_REACH_FRONTIER;

// --- Self-executing assertions (locked against silent drift) ---------------------------------------
(() => {
  const F = GMIN_LADDER_REACH_FRONTIER;
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // 1. Last complete dyadic block is k=19, top (partial) rung is k=20.
  if (F.topRung.lastCompleteK !== 19 || F.topRung.topRungK !== 20) {
    throw new Error('imp-96754: expected last-complete k=19 and top rung k=20');
  }
  // 2. Top rung is genuinely partial: fill fraction ~0.90835, strictly below 1.
  if (!(F.topRung.topRungFillFraction < 1) || !approx(F.topRung.topRungFillFraction, 0.90835, 1e-4)) {
    throw new Error('imp-96754: top-rung fill fraction must be ~0.90835 (< 1)');
  }
  // 3. Available ordinates in k=20 = N_max - 2^20.
  if (F.topRung.topRungAvailableOrdinates !== N_MAX - 2 ** 20) {
    throw new Error('imp-96754: top-rung available ordinate count mismatch');
  }
  // 4. Acquisition: k=21 needs index 2^22 and 2^22 - N_max more ordinates.
  if (F.acquisition.nextRungIndexNeeded !== 2 ** 22 || F.acquisition.nextRungExtraOrdinates !== 2 ** 22 - N_MAX) {
    throw new Error('imp-96754: k=21 acquisition requirement mismatch');
  }
  // 5. The extra ordinates needed for k=21 exceed the entire current cache (more than doubling).
  if (!(F.acquisition.nextRungExtraOrdinates > N_MAX)) {
    throw new Error('imp-96754: k=21 must require more than the full current cache');
  }
})();
