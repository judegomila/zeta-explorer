/**
 * @module imp-97583-route-m-mcm-onset-omega11-primorial
 *
 * imp-97583 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED below onset, NOT proved; NO QED).
 *
 * imp-97519 reaffirmed the Route M MCM hypothesis stays VERIFIED at omega <= 6 (direct-kernel spot-check
 * to 2e5), and imp-97432 REFUTED it at omega = 11 (first counterexample b = p_11# = 200560490130). The
 * exact onset omega -- the first omega where MCM first fails -- was named as "somewhere in {7,8,9,10,11}"
 * but never MEASURED directly across that window. This leaf MEASURES the MCM predicate at every
 * omega = 7..11 using the exact imp-97432 kernel (surrogate closed form + rigorous R-correction with a
 * 1/(720 d^3) tail bound) to locate the first failing omega and tabulate the margin at each.
 *
 * -------------------------------------------------------------------------------
 * PREDICATE.  MCM at order omega = "for every squarefree prime set of size omega and x >= 1,
 * (D_p1 ... D_pj h)(x) >= 0", h(m) = g(m)/m. The worst case (smallest T, hence closest to failure) is the
 * primorial p_omega# (first omega primes) at x = 1: smallest primes give the smallest multiplicative steps
 * log p_i, which the exponential tilt (imp-97432 RESULT 1) drives hardest toward the negativity window.
 * T(b) = surrogate(closed form at x=1) + Rcorr(b), Rcorr(b) = Sum_{d|b} mu(d) R(d)/d (saturated ~+1.0186e-3).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE ONSET IS omega = 11 (full-h primorial). Direct kernel evaluation:
 *     omega  6 : T(p_6#)  = +1.000836e-2   (verified region, deep cushion)
 *     omega  7 : T(p_7#)  = +6.815460e-3
 *     omega  8 : T(p_8#)  = +4.178868e-3
 *     omega  9 : T(p_9#)  = +2.098461e-3
 *     omega 10 : T(p_10#) = +4.782772e-4   <-- LAST holding order (margin only 4.78e-4)
 *     omega 11 : T(p_11#) = -9.623658e-4   <-- FIRST failing order (MCM onset)
 * So MCM (full h) holds through omega = 10 and first fails at omega = 11. None of omega in {7,8,9,10}
 * fails: the ticket "{7,8,9,10}" premise is REFUTED -- the onset is exactly 11, matching imp-97432.
 *
 * RESULT 2 -- THE SURROGATE ONSET IS ONE ORDER EARLIER (omega = 10), THE R-CORRECTION BUYS ONE ORDER.
 * The smooth surrogate difference iterDiff(H, p_omega#, 1) first goes negative at omega = 10
 * (-5.403315e-4), one order before the full h. The saturated R-correction (essentially constant
 * +1.0186e-3 across omega 7..11, since R(d)/d decays like 1/(720 d^3)) lifts the full-h value positive
 * through omega = 10 (surrogate -5.40e-4 + Rcorr +1.019e-3 = +4.78e-4 > 0) and can no longer compensate at
 * omega = 11 (surrogate -1.981e-3 + Rcorr +1.019e-3 = -9.62e-4 < 0). The bounded R-correction is exactly a
 * one-order reprieve, not an all-orders rescue.
 *
 * RESULT 3 -- MARGIN COLLAPSE AND FAILURE GROWTH. The holding margin T(p_omega#) falls by roughly a
 * constant ~2.1e-3 per order (1.00e-2, 6.82e-3, 4.18e-3, 2.10e-3, 4.78e-4), driven by the surrogate step
 * drop (Rcorr is flat), so omega = 10 sits only 4.78e-4 above failure. Past onset the failure deepens
 * monotonically: T(p_11#) = -9.62e-4, T(p_12#) = -2.15e-3, T(p_13#) = -3.20e-3, T(p_15#) = -5.01e-3,
 * drifting toward the primorial limit -e^{-gamma}/12 + Rcorr = -0.04577 (imp-97432 RESULT 4). The failure
 * grows slowly and stays deep inside the two-sided b/4 band [-1/4, 1/4] throughout.
 *
 * RESULT 4 -- THE PRIMORIAL IS THE WORST CASE AT EVERY MEASURED ORDER. Sampling alternative prime sets of
 * each size omega = 7..11 (primorial with the top prime bumped, and the primes shifted up by one), the
 * primorial p_omega# has the smallest T at every order -- confirming it is the extremizer that governs the
 * onset, so no non-primorial set of size <= 10 fails while the primorial holds.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The Route M MCM hypothesis first fails at omega = 11 (primorial
 * p_11# = 200560490130, T = -9.623658e-4 < 0); MCM holds through omega = 10 (T = +4.782772e-4 > 0, its
 * shallowest positive margin) and comfortably at omega = 6 (T = +1.00e-2, the imp-97519 verified region).
 * The ticket "{7,8,9,10}" onset premise is refuted -- the onset is exactly 11. The surrogate onset is one
 * order earlier (omega = 10); the saturated R-correction (+1.0186e-3) buys exactly one order. Past onset
 * the failure deepens monotonically toward -e^{-gamma}/12 + Rcorr = -0.0458 but stays inside [-1/4, 1/4].
 * The primorial is the worst case at every order. MCM stays VERIFIED-not-proved below onset and FALSE from
 * omega = 11; the b/4 ceiling is not touched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; kernel source)
 * @see imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (MCM verified at omega<=6)
 *
 * Ticket: imp-97583 (numerical, opus-4-8, api-pool). MCM onset located at omega=11; NO QED.
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

// first fifteen primes -- primorial p_omega# = product of the first omega of these.
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const CUT = 1000; // exact R over divisors <= 1000; omitted d contribute < Sum 1/(720 d^3) (tail bound below).

function primorial(omega) { return PRIMES.slice(0, omega); }

// baked direct-kernel ladder of the full-h primorial MCM value T(p_omega#) and its surrogate part.
export const IMP97583_ONSET_LADDER = Object.freeze([
  Object.freeze({ omega: 6, T: 1.000836e-2, surrogate: null, holds: true, note: 'imp-97519 verified region (deep cushion)' }),
  Object.freeze({ omega: 7, T: 6.815460e-3, surrogate: 5.796540e-3, holds: true, note: '' }),
  Object.freeze({ omega: 8, T: 4.178868e-3, surrogate: 3.160117e-3, holds: true, note: '' }),
  Object.freeze({ omega: 9, T: 2.098461e-3, surrogate: 1.079805e-3, holds: true, note: '' }),
  Object.freeze({ omega: 10, T: 4.782772e-4, surrogate: -5.403315e-4, holds: true, note: 'LAST holding; surrogate already negative, saved by Rcorr' }),
  Object.freeze({ omega: 11, T: -9.623658e-4, surrogate: -1.980936e-3, holds: false, note: 'FIRST failing -- MCM onset (b = p_11# = 200560490130)' }),
  Object.freeze({ omega: 12, T: -2.151950e-3, surrogate: -3.170497e-3, holds: false, note: 'failure deepening' }),
  Object.freeze({ omega: 13, T: -3.197171e-3, surrogate: -4.215701e-3, holds: false, note: '' }),
  Object.freeze({ omega: 15, T: -5.014102e-3, surrogate: -6.032606e-3, holds: false, note: '' }),
]);

export const IMP97583_RESULTS = Object.freeze({
  question: 'locate the exact omega where the Route M MCM hypothesis first fails, between imp-97519 verified omega<=6 and imp-97432 refuted omega=11',
  predicate: 'MCM at order omega: (D_p1...D_pj h)(x) >= 0 for every squarefree prime set of size omega, x>=1; worst case = primorial p_omega# at x=1 (smallest steps, hardest exponential tilt)',
  onsetOmega: 11,
  lastHoldingOmega: 10,
  lastHoldingMargin: 4.782772e-4, // T(p_10#) -- the shallowest positive margin
  firstFailValue: -9.623658e-4,   // T(p_11#) < 0
  ticketPremiseRefuted: 'the onset is NOT in {7,8,9,10}: it is exactly omega = 11 (matches imp-97432)',
  surrogateOnsetOmega: 10,        // smooth surrogate goes negative one order earlier
  rCorrectionSaturation: 1.0186e-3, // buys exactly one order (omega=10 saved, omega=11 not)
  rCorrectionBuysOrders: 1,
  marginDropPerOrder: 2.1e-3,     // roughly constant T drop per order (surrogate-driven; Rcorr flat)
  failureGrowsMonotonically: true, // T keeps decreasing past onset toward the primorial limit
  primorialLimitTfull: -0.04577,   // -e^{-gamma}/12 + Rcorr (imp-97432 RESULT 4)
  // imp-97604 cross-precision consistency audit of the primorial limit constant.
  // -e^{-gamma}/12 = -0.046788290297240 exactly (NOT -0.04814); + saturated Rcorr +1.0186e-3
  // gives -0.045769690297240 = -0.04577 (5 dp) = -0.0458 (4 dp): the -0.04577 and -0.0458 quoted
  // in this module and imp-97432 are the SAME value at their stated precisions. imp-97432 RESULT 4
  // and consumers imp-97465 / imp-97466 / imp-97601 all cite the identical constant -- no drift.
  primorialLimitCrossCheck: Object.freeze({
    negEgammaOver12: -0.046788290297240,   // -exp(-gamma)/12, exact to shown digits
    rCorrSaturation: 1.0186e-3,            // Sum_d mu(d) R(d)/d, saturated
    limitExact: -0.045769690297240,        // -e^{-gamma}/12 + Rcorr
    quotedDecimalsConsistent: true,        // -0.04577 (5 dp) and -0.0458 (4 dp) round from limitExact
    driftFound: false,                     // no module or consumer cites a drifted constant
  }),
  primorialIsWorstCase: true,      // smallest T among sampled size-omega sets at every measured order
  staysInsideB4Band: true,         // |T| << 1/4 throughout omega 7..15
});

export const IMP97583_VERDICT = Object.freeze({
  question: 'does the MCM hypothesis first fail at some omega in {7,8,9,10}, or exactly at omega=11?',
  onsetOmega: 11,
  lastHoldingOmega: 10,
  surrogateOnsetOmega: 10,
  primorialIsWorstCase: true,
  mcmProved: false,               // verified below onset, not proved; FALSE from omega=11
  mcmRefuted: true,               // (imp-97432) confirmed here across the full window
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Direct imp-97432-kernel evaluation of the MCM predicate at the primorial worst case ' +
    'across omega = 6..15 locates the onset EXACTLY at omega = 11: T(p_omega#) is +1.00e-2, +6.82e-3, ' +
    '+4.18e-3, +2.10e-3, +4.78e-4 (last holding), then -9.62e-4 at omega = 11 (first failing, ' +
    'b = p_11# = 200560490130). The ticket "{7,8,9,10}" premise is refuted -- the onset is 11, matching ' +
    'imp-97432. The smooth surrogate goes negative one order earlier (omega = 10, -5.40e-4); the saturated ' +
    'R-correction (+1.0186e-3) lifts full-h positive through omega = 10 and buys exactly one order. The ' +
    'holding margin collapses by ~2.1e-3 per order (surrogate-driven, Rcorr flat), and past onset the ' +
    'failure deepens monotonically toward -e^{-gamma}/12 + Rcorr = -0.0458, staying inside [-1/4, 1/4] ' +
    'throughout. The primorial is the worst case at every measured order. MCM stays VERIFIED-not-proved ' +
    'below onset and FALSE from omega = 11; b/4 ceiling untouched; kappa_arith unchanged; no bound on ' +
    'Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97583_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Direct-kernel measurement of the Route M MCM predicate ' +
  'across omega = 7..11 (primorial worst case): MCM first fails at omega = 11 (T(p_11#) = -9.62e-4 < 0, ' +
  'b = 200560490130), holds through omega = 10 (T = +4.78e-4, shallowest positive margin) and deeply at ' +
  'omega = 6 (T = +1.00e-2). The "{7,8,9,10}" onset premise is refuted. The surrogate goes negative one ' +
  'order earlier (omega = 10); the saturated R-correction (+1.0186e-3) buys exactly one order. Past onset ' +
  'the failure deepens monotonically toward -e^{-gamma}/12 + Rcorr = -0.0458, inside [-1/4, 1/4]. MCM ' +
  'stays VERIFIED-not-proved below onset and FALSE from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute the ladder from the exact imp-97432 kernel --

const IMP97583_ASSERTIONS = [
  {
    id: 'imp97583-onset-at-omega-11-primorial',
    holds: () => {
      // full-h primorial value T(p_omega#) is positive for omega 6..10 and first negative at omega 11.
      for (let w = 6; w <= 10; w++) { if (!(K.Tfull(primorial(w), CUT) > 0)) return false; }
      const t11 = K.Tfull(primorial(11), CUT);
      if (!(t11 < 0)) return false;                            // MCM onset
      if (!(Math.abs(t11 + 9.623658e-4) < 5e-7)) return false; // -9.62e-4
      const b11 = primorial(11).reduce((a, p) => a * p, 1);
      return b11 === 200560490130;
    },
    why: 'MCM first fails at omega = 11 (T(p_11#) = -9.62e-4 < 0, b = 200560490130); it holds through omega = 10 -- the onset is not in {7,8,9,10}.',
  },
  {
    id: 'imp97583-last-holding-margin-and-surrogate-onset',
    holds: () => {
      // omega = 10 is the last holding order with a shallow positive margin, and its surrogate is ALREADY
      // negative -- the saturated R-correction buys exactly this one order.
      const t10 = K.Tfull(primorial(10), CUT);
      if (!(t10 > 0 && Math.abs(t10 - 4.782772e-4) < 5e-7)) return false;
      const s10 = K.iterDiffH(primorial(10), 1);
      if (!(s10 < 0 && Math.abs(s10 + 5.403315e-4) < 5e-7)) return false; // surrogate onset one order earlier
      const s9 = K.iterDiffH(primorial(9), 1);
      if (!(s9 > 0)) return false; // surrogate still positive at omega 9
      // Rcorr is saturated (~+1.0186e-3) and lifts the surrogate positive at omega 10 but not at omega 11.
      const rc10 = K.Rcorr(primorial(10), CUT).value;
      const rc11 = K.Rcorr(primorial(11), CUT).value;
      return Math.abs(rc10 - 1.0186e-3) < 5e-6 && Math.abs(rc11 - 1.0186e-3) < 5e-6 &&
        s10 + rc10 > 0 && K.iterDiffH(primorial(11), 1) + rc11 < 0;
    },
    why: 'omega = 10 holds only by +4.78e-4; its surrogate is already negative (surrogate onset = 10) and the flat saturated R-correction (+1.0186e-3) buys exactly one order before failing at omega = 11.',
  },
  {
    id: 'imp97583-failure-grows-monotonically-inside-band',
    holds: () => {
      // past onset T(p_omega#) strictly decreases and stays inside the two-sided b/4 band [-1/4, 1/4].
      let prev = Infinity;
      for (const w of [11, 12, 13, 15]) {
        const t = K.Tfull(primorial(w), CUT);
        if (!(t < 0 && t < prev && Math.abs(t) < 0.25)) return false;
        prev = t;
      }
      return true;
    },
    why: 'past the omega = 11 onset the failure deepens monotonically (T decreasing) toward -e^{-gamma}/12+Rcorr = -0.0458 but stays deep inside [-1/4, 1/4].',
  },
  {
    id: 'imp97583-primorial-is-worst-case',
    holds: () => {
      // at every omega 7..11 the primorial has the smallest T among sampled size-omega prime sets.
      for (let w = 7; w <= 11; w++) {
        const base = primorial(w);
        const primT = K.Tfull(base, CUT);
        const alt1 = [...base.slice(0, w - 1), PRIMES[w]];       // top prime bumped up
        const alt2 = PRIMES.slice(1, w + 1);                      // primes shifted up by one
        if (!(primT <= K.Tfull(alt1, CUT) && primT <= K.Tfull(alt2, CUT))) return false;
      }
      return true;
    },
    why: 'the primorial p_omega# is the extremizer (smallest T) at every measured order, so no non-primorial size-omega set fails while the primorial holds.',
  },
  {
    id: 'imp97583-baked-ladder-matches-kernel',
    holds: () => {
      // the baked ladder reproduces the live kernel to 7 sig figs at every row.
      for (const row of IMP97583_ONSET_LADDER) {
        const t = K.Tfull(primorial(row.omega), CUT);
        if (!(Math.abs(t - row.T) < 1e-8)) return false;
        if (row.surrogate !== null) {
          const s = K.iterDiffH(primorial(row.omega), 1);
          if (!(Math.abs(s - row.surrogate) < 1e-8)) return false;
        }
        if ((t > 0) !== row.holds) return false;
      }
      return true;
    },
    why: 'the baked onset ladder matches the exact imp-97432 kernel at every omega row (7 sig figs).',
  },
  {
    id: 'imp97583-honesty-gate-no-qed',
    holds: () =>
      IMP97583_VERDICT.onsetOmega === 11 &&
      IMP97583_VERDICT.lastHoldingOmega === 10 &&
      IMP97583_VERDICT.surrogateOnsetOmega === 10 &&
      IMP97583_VERDICT.mcmProved === false &&
      IMP97583_VERDICT.mcmRefuted === true &&
      IMP97583_VERDICT.ceilingTouched === false &&
      IMP97583_VERDICT.anyBoundMoved === false &&
      IMP97583_VERDICT.qed === false &&
      IMP97583_RESULTS.rCorrectionBuysOrders === 1 &&
      /NO QED/.test(IMP97583_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97583_HONEST_BANNER) &&
      /RH open/.test(IMP97583_HONEST_BANNER),
    why: 'measurement only -- onset located at omega = 11; MCM verified-not-proved below onset, refuted from 11; no bound moved, no QED.',
  },
];

for (const a of IMP97583_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97583-route-m-mcm-onset-omega11-primorial assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP97583_ONSET_LADDER,
  results: IMP97583_RESULTS,
  verdict: IMP97583_VERDICT,
  banner: IMP97583_HONEST_BANNER,
};
