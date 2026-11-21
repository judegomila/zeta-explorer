/**
 * @module imp-97227-krein-interval-annihilation-certificate
 *
 * imp-97227 (proof): ATTEMPT the imp-97100 / imp-97205 HARD factor -- explicit INTERVAL annihilation of the
 * t^-1, t^-2, t^-3 spherical-Bessel leading coefficients of the Krein ground-state combination
 * g(t) = v0 . Phih(t) = a^7 sum_k d_k j_k(a t), for a FIXED RATIONAL trial, to certify g(t) = O(t^-4).
 * Targets SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL (the HARD factor IMP97100_PHASE_CANCELLATION_TRIAL of the
 * imp-97205 Route B tail majorant, whose EASY factor -- the closed-form sigma_2 majorant -- imp-97205 closed).
 *
 * WHAT THIS LEAF DELIVERS (the "certify the three-coefficient annihilation in interval arithmetic" half).
 * imp-97134 verified the annihilation in plain INTEGER arithmetic; this leaf re-runs it inside an explicit
 * two-sided INTERVAL type and shows the certificate is DEGENERATE-EXACT. Both inputs to each of the six
 * imp-97113 leading carrier functionals are EXACT INTEGERS:
 *   - the per-degree carrier weights are integers: cosHalf in {1,0,-1}, tri = k(k+1)/2, and
 *     quad = (k-1)k(k+1)(k+2)/8 are integer-valued at every degree k = 0..7 (Hankel P/Q reduction);
 *   - the trial coefficients are exact integers: even {0,2,4,6} -> (33,55,27,5), odd {1,3,5,7} -> (143,273,165,35).
 * Evaluating each functional as an interval sum of interval products of point-intervals [n,n] (all magnitudes
 * well under 2^53, so double arithmetic is exact) yields SIX DEGENERATE ZERO-WIDTH intervals [0,0]. This is the
 * tightest possible interval enclosure: the t^-1, t^-2, t^-3 asymptotic coefficients of g are enclosed in the
 * exact singleton {0}, i.e. the three leading orders are annihilated with CERTIFIED (zero-width) interval
 * bounds, not merely to floating tolerance. So the "explicit interval annihilation of the three coefficients"
 * that the ticket names is ACHIEVED at the degree level -- and it is achievable in interval arithmetic ONLY
 * because both the weights and the trial are exact integers (no special-function evaluation enters the three
 * leading orders).
 *
 * WHY THIS DOES NOT YET CERTIFY g(t) = O(t^-4) FOR A FIXED RATIONAL v0 (the precise obstruction reached).
 * Certifying the O(t^-4) statement -- as opposed to the vanishing of the three leading coefficients -- needs
 * TWO further ingredients, and BOTH require the interval special-function evaluation that is not available:
 *   OBSTRUCTION A (the z^-4 REMAINDER bound). Annihilating the t^-1..t^-3 coefficients leaves the O(z^-4)
 *     asymptotic remainder of each j_k(z); the O(t^-4) CONSTANT is set by sum_k d_k R_k(z), R_k the z^-4
 *     spherical-Bessel remainder. A rigorous two-sided majorant of that constant, UNIFORM in z >= a T, needs a
 *     rigorous interval enclosure of the Bessel remainder R_k(z) -- i.e. interval spherical-Bessel evaluation.
 *   OBSTRUCTION B (the degree-to-v0 map). The three-coefficient annihilation lives at the DEGREE level {d_k};
 *     mapping it to a certified rational v0 via d = C^T v0 (imp-97164) needs interval control of the overlap
 *     entries c_{jk} (spherical-Bessel / Gegenbauer overlaps). imp-97164 already reported this inversion is
 *     over-determined for the exact 8-sparse trial and, in the correct 6-functional relaxation, blocked by the
 *     absent interval overlaps.
 * Both A and B reduce to the SAME missing primitive: interval spherical-Bessel / Gegenbauer evaluation
 * (mpmath.iv exposes no interval Bessel; Arb / python-flint not installed) -- the committed imp-97015
 * IMP97015_ARB_INTERVAL_BESSEL sub-gap. So the interval annihilation of the three LEADING coefficients is
 * certified here, but the full g(t) = O(t^-4) enclosure for a fixed rational v0 does NOT close, and the
 * precise, single-named obstruction is IMP97015_ARB_INTERVAL_BESSEL (surfacing now on the z^-4 remainder as
 * well as on the C-inversion).
 *
 * NET. This leaf EXECUTES the certify-in-interval-arithmetic half the ticket names (the three leading carrier
 * coefficients are enclosed in the exact singleton [0,0], a degenerate-exact interval certificate), and reaches
 * the precise obstruction to the remaining O(t^-4) BOUND (the z^-4 remainder majorant and the v0 overlap map,
 * both needing IMP97015_ARB_INTERVAL_BESSEL). Attempt / execution only: produces NO interval tail majorant;
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes no operator positivity; changes NO
 * bound; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (integer-arithmetic annihilation this leaf lifts to intervals)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (the six leading carrier functionals / integer weights)
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B: the C-inversion blocked by IMP97015_ARB_INTERVAL_BESSEL)
 * @see imp-97205-krein-routeb-sigma2-majorant-execution.js (EASY factor closed; HARD factor IMP97100_PHASE_CANCELLATION_TRIAL left open)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL)
 *
 * Ticket: imp-97227 (proof, opus-4-8, medium). Attempt / execution only, RH-free; changes no bound; NO QED.
 *
 * Import-light: two light literal imports (imp-97113 functionals, imp-97134 trials), no zeros bundle.
 */

import { IMP97113_FUNCTIONALS } from './imp-97113-krein-bessel-asymptotic-annihilation-scope.js';
import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

// -- minimal two-sided interval arithmetic (point intervals of exact integers stay zero-width) ----------------
const iPoint = (n) => Object.freeze({ lo: n, hi: n });
const iAdd = (x, y) => ({ lo: x.lo + y.lo, hi: x.hi + y.hi });
const iMul = (x, y) => {
  const p = [x.lo * y.lo, x.lo * y.hi, x.hi * y.lo, x.hi * y.hi];
  return { lo: Math.min(...p), hi: Math.max(...p) };
};
const iWidth = (x) => x.hi - x.lo;
const isExactZero = (x) => x.lo === 0 && x.hi === 0;

// Evaluate one of the six imp-97113 leading carrier functionals on a degree-coefficient map, in interval
// arithmetic. rowIndex 0..2 selects [L1sin,L2cos,L3sin] (even parity) or [L1cos,L2sin,L3cos] (odd parity).
function functionalInterval(dmap, parity, rowIndex) {
  const rowFn = parity === 'even' ? IMP97113_FUNCTIONALS.evenRow : IMP97113_FUNCTIONALS.oddRow;
  let acc = iPoint(0);
  for (const kStr of Object.keys(dmap)) {
    const k = +kStr;
    if ((k % 2 === 0) !== (parity === 'even')) continue; // wrong parity contributes 0 to this block
    const weight = iPoint(rowFn(k)[rowIndex]); // exact integer weight -> point interval
    const coeff = iPoint(dmap[kStr]); // exact integer trial coefficient -> point interval
    acc = iAdd(acc, iMul(weight, coeff));
  }
  return acc;
}

// The six leading carrier functionals, each enclosed in interval arithmetic for the annihilating trials.
// evenTrial kills the even block {L1sin,L2cos,L3sin}; oddTrial kills the odd block {L1cos,L2sin,L3cos}.
export const IMP97227_INTERVAL_FUNCTIONALS = Object.freeze({
  even: Object.freeze(
    [0, 1, 2].map((i) => {
      const iv = functionalInterval(IMP97134_TRIALS.even, 'even', i);
      return Object.freeze({ name: IMP97113_FUNCTIONALS.evenBlock[i], lo: iv.lo, hi: iv.hi, width: iWidth(iv) });
    }),
  ),
  odd: Object.freeze(
    [0, 1, 2].map((i) => {
      const iv = functionalInterval(IMP97134_TRIALS.odd, 'odd', i);
      return Object.freeze({ name: IMP97113_FUNCTIONALS.oddBlock[i], lo: iv.lo, hi: iv.hi, width: iWidth(iv) });
    }),
  ),
});

// Every weight and every trial coefficient is an exact integer -- record it so the degenerate-exact interval
// certificate is auditable (no special-function value enters the three leading orders).
const ALL_WEIGHTS_INTEGER = [0, 1, 2, 3, 4, 5, 6, 7].every((k) => {
  const row = k % 2 === 0 ? IMP97113_FUNCTIONALS.evenRow(k) : IMP97113_FUNCTIONALS.oddRow(k);
  return row.every((w) => Number.isInteger(w));
});
const ALL_TRIALS_INTEGER =
  Object.values(IMP97134_TRIALS.even).every((d) => Number.isInteger(d)) &&
  Object.values(IMP97134_TRIALS.odd).every((d) => Number.isInteger(d));

export const IMP97227_VERDICT = Object.freeze({
  ticket: 'imp-97227',
  question:
    'attempt the imp-97100 / imp-97205 HARD factor: explicit INTERVAL annihilation of the t^-1, t^-2, t^-3 spherical-Bessel leading coefficients for a FIXED RATIONAL Krein trial v0 to certify g(t) = O(t^-4) (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL); construct such a v0 and certify the three-coefficient annihilation in interval arithmetic, or reach the precise obstruction.',
  answer:
    'the three-coefficient annihilation IS certified in interval arithmetic -- but only at the DEGREE level, and it does NOT extend to a certified g(t) = O(t^-4) for a fixed rational v0. Both inputs to the six imp-97113 leading carrier functionals are exact integers (weights cosHalf/tri=k(k+1)/2/quad=(k-1)k(k+1)(k+2)/8 and trials (33,55,27,5)/(143,273,165,35)), so evaluating each functional in a two-sided interval type gives six DEGENERATE ZERO-WIDTH intervals [0,0]: the t^-1, t^-2, t^-3 asymptotic coefficients of g are enclosed in the exact singleton {0}, the tightest possible interval certificate. This lifts the imp-97134 integer-arithmetic annihilation to an explicit interval certificate. The remaining O(t^-4) BOUND needs two more ingredients that BOTH reduce to the same missing primitive: (A) a rigorous uniform-in-z majorant of the z^-4 spherical-Bessel remainder sum_k d_k R_k(z), and (B) the degree-to-v0 overlap inversion d = C^T v0 (imp-97164). Both need interval spherical-Bessel / Gegenbauer evaluation, which is unavailable (mpmath.iv lacks it, Arb / python-flint not installed) -- the imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap. So no fixed rational v0 with a certified interval g(t) = O(t^-4) enclosure is produced and the Route B tail majorant does not close; the precise obstruction is IMP97015_ARB_INTERVAL_BESSEL.',
  // What IS certified (the deliverable half).
  threeCoefficientAnnihilationCertifiedInIntervals: true, // six functionals enclosed in [0,0]
  allWeightsInteger: ALL_WEIGHTS_INTEGER, // exact-integer carrier weights (Hankel P/Q reduction)
  allTrialsInteger: ALL_TRIALS_INTEGER, // exact-integer annihilating trials
  functionalIntervalsAreExactZero:
    IMP97227_INTERVAL_FUNCTIONALS.even.every((f) => f.lo === 0 && f.hi === 0) &&
    IMP97227_INTERVAL_FUNCTIONALS.odd.every((f) => f.lo === 0 && f.hi === 0),
  maxFunctionalIntervalWidth: Math.max(
    ...IMP97227_INTERVAL_FUNCTIONALS.even.map((f) => f.width),
    ...IMP97227_INTERVAL_FUNCTIONALS.odd.map((f) => f.width),
  ), // 0 -- degenerate-exact enclosure
  certificateIsDegenerateExact: true, // zero-width, not floating tolerance
  // What is NOT certified (the precise obstruction reached).
  z4RemainderMajorantProduced: false, // Obstruction A: uniform z^-4 Bessel remainder needs interval Bessel
  v0OverlapMapCertified: false, // Obstruction B: d = C^T v0 blocked (imp-97164)
  intervalObstruction: 'IMP97015_ARB_INTERVAL_BESSEL', // single named blocker for both A and B
  fixedRationalV0OrderFourCertified: false, // full g(t) = O(t^-4) for a rational v0 NOT certified
  intervalMajorantProduced: false, // no interval tail majorant
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL stays open -- this leaf CERTIFIES the three-coefficient annihilation in interval arithmetic (the six imp-97113 leading carrier functionals evaluate to degenerate zero-width intervals [0,0] because both the per-degree weights and the imp-97134 trials are exact integers, so the t^-1, t^-2, t^-3 coefficients of g are enclosed in the exact singleton {0}), but does NOT certify g(t) = O(t^-4) for a fixed rational v0: the O(t^-4) constant needs (A) a rigorous uniform-in-z majorant of the z^-4 spherical-Bessel remainder and (B) the degree-to-v0 overlap inversion d = C^T v0, and both need interval spherical-Bessel / Gegenbauer evaluation, unavailable (mpmath.iv lacks it, Arb / python-flint not installed) -- the imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap. No interval tail majorant is produced and Route B does not close.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97227_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97227_ASSERTIONS = [
  {
    id: 'imp97227-inputs-are-exact-integers',
    holds: () => ALL_WEIGHTS_INTEGER === true && ALL_TRIALS_INTEGER === true,
    why: 'the interval certificate is degenerate-exact ONLY because both the per-degree carrier weights (cosHalf, tri = k(k+1)/2, quad = (k-1)k(k+1)(k+2)/8) and the imp-97134 trial coefficients (33,55,27,5)/(143,273,165,35) are exact integers, so no special-function value enters the three leading orders.',
  },
  {
    id: 'imp97227-six-functionals-enclosed-in-exact-zero',
    holds: () =>
      IMP97227_INTERVAL_FUNCTIONALS.even.length === 3 &&
      IMP97227_INTERVAL_FUNCTIONALS.odd.length === 3 &&
      IMP97227_INTERVAL_FUNCTIONALS.even.every((f) => f.lo === 0 && f.hi === 0 && f.width === 0) &&
      IMP97227_INTERVAL_FUNCTIONALS.odd.every((f) => f.lo === 0 && f.hi === 0 && f.width === 0) &&
      IMP97227_VERDICT.functionalIntervalsAreExactZero === true &&
      IMP97227_VERDICT.maxFunctionalIntervalWidth === 0,
    why: 'evaluating each of the six imp-97113 leading carrier functionals on the annihilating trials in a two-sided interval type yields degenerate zero-width intervals [0,0], so the t^-1, t^-2, t^-3 asymptotic coefficients of g are enclosed in the exact singleton {0} -- the tightest possible interval annihilation, not a floating tolerance.',
  },
  {
    id: 'imp97227-interval-mul-is-genuine',
    holds: () => {
      // the interval multiply must be a real min/max-of-endpoint-products routine (not a point shortcut):
      // a non-degenerate product widens, while an exact-integer point product stays zero-width.
      const wide = iMul({ lo: -1, hi: 2 }, { lo: -3, hi: 1 });
      const pt = iMul(iPoint(27), iPoint(-45));
      return wide.lo === -6 && wide.hi === 3 && pt.lo === -1215 && pt.hi === -1215;
    },
    why: 'the interval multiply is a genuine two-sided routine (min/max over the four endpoint products): it widens a non-degenerate product [-1,2]*[-3,1] to [-6,3] yet keeps an exact-integer point product [27]*[-45] at the zero-width singleton [-1215], so the [0,0] enclosures above are a real interval certificate.',
  },
  {
    id: 'imp97227-order-four-bound-not-certified-precise-obstruction',
    holds: () =>
      IMP97227_VERDICT.threeCoefficientAnnihilationCertifiedInIntervals === true &&
      IMP97227_VERDICT.z4RemainderMajorantProduced === false &&
      IMP97227_VERDICT.v0OverlapMapCertified === false &&
      IMP97227_VERDICT.fixedRationalV0OrderFourCertified === false &&
      IMP97227_VERDICT.intervalObstruction === 'IMP97015_ARB_INTERVAL_BESSEL',
    why: 'the three-coefficient annihilation is certified in intervals, but the full g(t) = O(t^-4) bound for a fixed rational v0 needs the uniform z^-4 Bessel remainder majorant (Obstruction A) and the degree-to-v0 overlap inversion (Obstruction B, imp-97164), both blocked by the same missing interval spherical-Bessel / Gegenbauer evaluation IMP97015_ARB_INTERVAL_BESSEL.',
  },
  {
    id: 'imp97227-attempt-only-no-qed',
    holds: () =>
      IMP97227_VERDICT.intervalMajorantProduced === false &&
      IMP97227_VERDICT.operatorPositivityProved === false &&
      IMP97227_VERDICT.boundChanged === false &&
      IMP97227_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97227_VERDICT.qed === false &&
      typeof IMP97227_VERDICT.subGap === 'string' &&
      IMP97227_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97227_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'the certify-in-intervals half is executed (degenerate-exact annihilation) and the precise obstruction reached, but no interval tail majorant is produced, no operator positivity, no bound change, both sub-gaps carried, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97227_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97227-krein-interval-annihilation-certificate assertion failed: ${a.id}`);
  }
}
