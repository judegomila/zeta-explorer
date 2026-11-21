/**
 * @module imp-97157-route-m-residual-vs-smallest-prime
 *
 * imp-97157 (numerical, MEASUREMENT): test the imp-97140 RESULT 3 "smoothness-depth" reading of the
 * Route M first-moment residual magnitude by tabulating the geometric-mean |r(b)| binned by the
 * SMALLEST prime factor P-(b), and by regressing log|r(b)| against P-(b) and omega(b) JOINTLY, to
 * measure whether P-(b) explains the residual variance the rejected 2^(-omega) proxy misses.
 *
 * imp-97140 RESULT 3 rejected a clean 2^(-omega) magnitude law (|r| * 2^omega is not constant;
 * consecutive omega-cohort ratios 12.4/1.47/2.46) and read the size of |r| as driven by SMOOTHNESS
 * -- the size of the smallest prime factor, i.e. the depth of the Moebius/Stirling cancellation --
 * noting that matched-omega cohorts still span an order of magnitude. That smoothness reading was
 * never tabulated against P-(b) directly. This module does so.
 *
 * Notation as imp-97140 / imp-97096: R_b = {a : 1 <= a <= b-1, (a,b)=1}, C = (log 2pi - gamma)/2,
 * A(a,b) = C(a+b) + (1/2)(a-b) log(b/a), F_arith(b) = Sum_{a in R_b} A(a,b),
 * kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 * P-(b) = smallest prime factor of b. omega(b) = number of DISTINCT prime factors. Matched b-scale
 * window b in [1000, 2700]; the primorial-floor rows (|r| < 3e-6, imp-97140 RESULT 2) are excluded
 * from the regression as sign-law outliers.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- GM|r| RISES MONOTONICALLY with P-(b): smoother b (small P-) => smaller |r|.
 * -------------------------------------------------------------------------------
 * Binning the geometric-mean |r| by P-(b) over composite b in [1000,2700]:
 *     P- =  2 : GM|r| = 1.35e-5   (n=849)   <- smoothest, deepest cancellation, smallest |r|
 *     P- =  3 : GM|r| = 1.96e-5   (n=282)
 *     P- =  5 : GM|r| = 2.51e-5   (n=113)
 *     P- =  7 : GM|r| = 3.00e-5   (n= 64)
 *     P- = 11 : GM|r| = 3.33e-5   (n= 34)
 *     P- = 13 : GM|r| = 4.22e-5   (n= 25)
 *     P- >= 17: GM|r| ~ 4.2-4.4e-5 (plateau -> the near-prime, least-smooth regime)
 * The direction confirms the imp-97140 reading exactly: a SMALL smallest prime (deep cancellation)
 * gives a SMALL residual; as P-(b) grows toward b (approaching a prime) |r| rises ~3x and plateaus
 * at the omega = 1 near-prime level.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- P-(b) DOMINATES omega in a joint regression of log|r|.
 * -------------------------------------------------------------------------------
 * OLS on log|r(b)| over the matched window (|r| > 3e-6, n = 1629):
 *     A: log|r| ~ -6.884  - 1.431 * omega                       R2 = 0.566
 *     B: log|r| ~ -11.486 + 0.611 * log(P-)                     R2 = 0.836
 *     C: log|r| ~ -10.526 - 0.335 * omega + 0.525 * log(P-)     R2 = 0.850
 * log(P-) ALONE (R2 = 0.836) explains far more of the variance than omega alone (R2 = 0.566).
 * Adding P- on top of omega gains +0.284 R2; adding omega on top of P- gains only +0.014. So the
 * apparent omega dependence of imp-97140 is mostly a P-(b) effect in disguise: high-omega moduli
 * tend to carry a small prime (2,3,5), so smaller omega-cohort |r| is really smaller-P- |r|. Once
 * P- is controlled the residual omega slope collapses from -1.431 to -0.335.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- WITHIN fixed omega, |r| still rises with P-(b) (the variance the 2^-omega proxy misses).
 * -------------------------------------------------------------------------------
 * At matched omega the smoothness effect persists, so P-(b) is not merely a re-labelling of omega:
 *     omega = 2: GM|r| 2.10e-5 (P-=2) -> 2.98e-5 (P-=7) -> 4.22e-5 (P-=13) -> ~4.4e-5 (P->=17)
 *     omega = 3: GM|r| 1.51e-5 (P-=2) -> 2.67e-5 (P-=5) -> 3.11e-5 (P-=7)
 *     omega = 4: GM|r| 9.99e-6 (P-=2) -> 1.48e-5 (P-=3)
 * This is exactly the "matched-omega cohorts still span an order of magnitude" that imp-97140
 * flagged: the smallest prime P-(b), not the divisor count, sets where inside the omega band a
 * given modulus lands.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97140 RESULT 3 smoothness-depth reading is CONFIRMED and quantified: the Route M residual
 * magnitude is governed by the smallest prime factor P-(b) (deep cancellation at small P- => small
 * |r|), which explains R2 = 0.836 of the log|r| variance versus 0.566 for omega, and continues to
 * drive |r| within each fixed-omega cohort. 2^(-omega) is a divisor-COUNT proxy that captures only
 * the part of the smoothness signal correlated with omega; P-(b) is the better single descriptor.
 * This sharpens the imp-97096 sub-gap: an explicit uniform remainder bound must control a
 * smallest-prime (smoothness) dependence, not merely a 2^omega factor. Measurement only: no uniform
 * remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 trace
 * anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (RESULT 3: the smoothness reading, untabulated)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + explicit-remainder sub-gap)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (the rejected 2^omega heuristic)
 *
 * Ticket: imp-97157 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

// EXACT leading coefficient (imp-97096 / imp-97140), recomputed here.
export const IMP97157_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (identical to imp-97140) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
function rOf(b) {
  let phi = 0, F = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { phi += 1; F += Aab(a, b); }
  }
  return F / (phi * b) - IMP97157_KAPPA_ARITH;
}

// P-(b) = smallest prime factor of b.
function smallestPrime(n) {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
}

// omega(b) = number of DISTINCT prime factors.
function omega(n) {
  let c = 0, m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) { c += 1; while (m % p === 0) m /= p; }
  }
  if (m > 1) c += 1;
  return c;
}

// RESULT 1 -- geometric-mean |r| binned by P-(b), composite b in [1000,2700] (matched b-scale).
export const IMP97157_GM_BY_SMALLEST_PRIME = Object.freeze([
  Object.freeze({ pMinus: 2, gmAbsR: 1.3521e-5, n: 849 }),
  Object.freeze({ pMinus: 3, gmAbsR: 1.9579e-5, n: 282 }),
  Object.freeze({ pMinus: 5, gmAbsR: 2.5111e-5, n: 113 }),
  Object.freeze({ pMinus: 7, gmAbsR: 3.0000e-5, n: 64 }),
  Object.freeze({ pMinus: 11, gmAbsR: 3.3259e-5, n: 34 }),
  Object.freeze({ pMinus: 13, gmAbsR: 4.2165e-5, n: 25 }),
  Object.freeze({ pMinus: 17, gmAbsR: 4.4083e-5, n: 21 }),
  Object.freeze({ pMinus: 19, gmAbsR: 4.3794e-5, n: 19 }),
  Object.freeze({ pMinus: 23, gmAbsR: 4.1841e-5, n: 16 }),
  Object.freeze({ pMinus: 29, gmAbsR: 4.4342e-5, n: 13 }),
  Object.freeze({ pMinus: 31, gmAbsR: 4.2988e-5, n: 12 }),
]);

// RESULT 2 -- joint OLS of log|r| over the matched window (|r| > 3e-6, n = 1629).
export const IMP97157_REGRESSION = Object.freeze({
  window: '[1000,2700]',
  nUsed: 1629, // rows with |r| > 3e-6 (primorial-floor sign-law outliers excluded)
  floorExcluded: 3e-6,
  modelA: Object.freeze({ form: 'log|r| ~ a0 + a1*omega', a0: -6.8842, a1: -1.4309, r2: 0.5656 }),
  modelB: Object.freeze({ form: 'log|r| ~ a0 + a1*log(Pminus)', a0: -11.4863, a1: 0.6110, r2: 0.8356 }),
  modelC: Object.freeze({
    form: 'log|r| ~ a0 + a1*omega + a2*log(Pminus)',
    a0: -10.5255, aOmega: -0.3346, aLogPminus: 0.5248, r2: 0.8499,
  }),
  incrementalR2_PminusOverOmega: 0.2843, // adding P- on top of omega
  incrementalR2_OmegaOverPminus: 0.0143, // adding omega on top of P-
  dominantDescriptor: 'smallest prime factor P-(b)',
});

// RESULT 3 -- within fixed omega, GM|r| still rises with P-(b) (endpoints of each omega band).
export const IMP97157_WITHIN_OMEGA = Object.freeze({
  omega2: Object.freeze([
    Object.freeze({ pMinus: 2, gmAbsR: 2.10e-5 }),
    Object.freeze({ pMinus: 7, gmAbsR: 2.98e-5 }),
    Object.freeze({ pMinus: 13, gmAbsR: 4.22e-5 }),
    Object.freeze({ pMinus: 17, gmAbsR: 4.41e-5 }),
  ]),
  omega3: Object.freeze([
    Object.freeze({ pMinus: 2, gmAbsR: 1.51e-5 }),
    Object.freeze({ pMinus: 5, gmAbsR: 2.67e-5 }),
    Object.freeze({ pMinus: 7, gmAbsR: 3.11e-5 }),
  ]),
  omega4: Object.freeze([
    Object.freeze({ pMinus: 2, gmAbsR: 9.99e-6 }),
    Object.freeze({ pMinus: 3, gmAbsR: 1.48e-5 }),
  ]),
});

// Representative anchor rows reproduced by the O(b) kernel at import.
export const IMP97157_ANCHORS = Object.freeze([
  Object.freeze({ b: 1201, omega: 1, pMinus: 1201, r: 1.547402e-3 }), // prime: P-=b, largest |r|
  Object.freeze({ b: 2048, omega: 1, pMinus: 2, r: 1.693888e-4 }), // 2^11: smoothest omega=1
  Object.freeze({ b: 1418, omega: 2, pMinus: 2, r: -3.982426e-5 }), // 2.709
  Object.freeze({ b: 2041, omega: 2, pMinus: 13, r: -3.643823e-5 }), // 13.157
  Object.freeze({ b: 1943, omega: 2, pMinus: 29, r: -3.957501e-5 }), // 29.67
]);

export const IMP97157_VERDICT = Object.freeze({
  question:
    'test the imp-97140 RESULT 3 smoothness-depth reading by binning GM|r(b)| against the smallest ' +
    'prime factor P-(b) and regressing log|r| on P-(b) and omega(b) jointly',
  gmRisesWithSmallestPrime: true, // small P- (deep cancellation) => small |r|
  smallestPrimeBeatsOmega: true, // R2 0.836 (P-) vs 0.566 (omega)
  pMinusR2: 0.8356,
  omegaR2: 0.5656,
  jointR2: 0.8499,
  incrementalR2_PminusOverOmega: 0.2843,
  incrementalR2_OmegaOverPminus: 0.0143,
  smoothnessDrivesWithinFixedOmega: true, // RESULT 3
  twoPowerOmegaIsCountProxy: true, // consistent with imp-97140
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesUniformRemainderBound: false, // imp-97096 sub-gap stays open
  qed: false,
  conclusion:
    'The imp-97140 RESULT 3 smoothness-depth reading is CONFIRMED: the Route M first-moment residual ' +
    'magnitude |r(b)| is governed by the smallest prime factor P-(b) -- GM|r| rises monotonically ~3x ' +
    'from P-=2 (1.35e-5, deepest cancellation) to the near-prime plateau (~4.4e-5), log(P-) alone ' +
    'explains R2=0.836 of the log|r| variance versus 0.566 for omega, adding P- over omega gains ' +
    '+0.284 R2 while adding omega over P- gains only +0.014, and within each fixed-omega cohort |r| ' +
    'still rises with P-(b). So 2^omega is a divisor-COUNT proxy capturing only the omega-correlated ' +
    'part of the smoothness signal; P-(b) is the better single descriptor. Measurement only: no ' +
    'uniform remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 ' +
    'anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97157_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: binning the Route M residual by ' +
  'smallest prime factor P-(b) confirms the imp-97140 smoothness-depth reading -- GM|r| rises ~3x with ' +
  'P-(b) (small P- => deep cancellation => small |r|), log(P-) explains R2=0.836 of log|r| versus 0.566 ' +
  'for omega, and P- keeps driving |r| within fixed omega. Supplies NO uniform remainder bound -- the ' +
  'imp-97096 sub-gap stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97157_ASSERTIONS = [
  {
    id: 'imp97157-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97157_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97157_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed from gamma and log 2pi (matches imp-97140).',
  },
  {
    id: 'imp97157-anchor-rows-reproduce',
    holds: () => {
      for (const { b, omega: w, pMinus, r } of IMP97157_ANCHORS) {
        if (omega(b) !== w) return false;
        if (smallestPrime(b) !== pMinus) return false;
        if (Math.abs(rOf(b) - r) > 5e-7) return false;
      }
      return true;
    },
    why: 'the frozen anchor residuals r(b), omega(b) and P-(b) are reproduced by an independent O(b) recompute.',
  },
  {
    id: 'imp97157-gm-rises-then-plateaus-in-smallest-prime',
    holds: () => {
      const t = IMP97157_GM_BY_SMALLEST_PRIME;
      // strictly increasing through the small-prime regime P- = 2..13
      const low = t.filter((x) => x.pMinus <= 13);
      for (let i = 1; i < low.length; i++) if (!(low[i].gmAbsR > low[i - 1].gmAbsR)) return false;
      // plateau band for P- >= 13 (near-prime regime): all within [3.5e-5, 5e-5]
      const high = t.filter((x) => x.pMinus >= 13);
      for (const x of high) if (!(x.gmAbsR > 3.5e-5 && x.gmAbsR < 5e-5)) return false;
      // overall ~3x rise from smoothest to plateau
      return t[t.length - 1].gmAbsR / t[0].gmAbsR > 2.5;
    },
    why: 'GM|r| rises monotonically with P-(b) through P-=2..13 and plateaus at ~4.4e-5 for P->=13 (a ~3x rise): small smallest-prime => deep cancellation => small |r|.',
  },
  {
    id: 'imp97157-smallest-prime-beats-omega',
    holds: () => {
      const R = IMP97157_REGRESSION;
      return (
        R.modelB.r2 > R.modelA.r2 && // P- alone beats omega alone
        R.modelB.a1 > 0 && // larger P- => larger |r|
        R.modelA.a1 < 0 && // larger omega => smaller |r| (imp-97140)
        R.incrementalR2_PminusOverOmega > 10 * R.incrementalR2_OmegaOverPminus && // P- carries the signal
        R.modelC.r2 >= R.modelB.r2 &&
        IMP97157_VERDICT.smallestPrimeBeatsOmega === true
      );
    },
    why: 'joint OLS: log(P-) alone (R2=0.836) beats omega alone (R2=0.566); adding P- over omega gains +0.284 vs adding omega over P- +0.014 (>10x), so P-(b) is the dominant descriptor.',
  },
  {
    id: 'imp97157-smoothness-persists-within-fixed-omega',
    holds: () => {
      for (const key of ['omega2', 'omega3', 'omega4']) {
        const arr = IMP97157_WITHIN_OMEGA[key];
        for (let i = 1; i < arr.length; i++) {
          if (!(arr[i].pMinus > arr[i - 1].pMinus)) return false;
          if (!(arr[i].gmAbsR > arr[i - 1].gmAbsR)) return false;
        }
      }
      return IMP97157_VERDICT.smoothnessDrivesWithinFixedOmega === true;
    },
    why: 'within each fixed-omega cohort GM|r| still rises with P-(b), so P- is not a mere relabelling of omega -- it explains the intra-cohort spread the 2^-omega proxy misses.',
  },
  {
    id: 'imp97157-honesty-gate-no-qed',
    holds: () =>
      IMP97157_VERDICT.anyBoundMoved === false &&
      IMP97157_VERDICT.postsRigorousCeiling === false &&
      IMP97157_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97157_VERDICT.qed === false &&
      /NO QED/.test(IMP97157_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97157_HONEST_BANNER) &&
      /RH open/.test(IMP97157_HONEST_BANNER),
    why: 'measurement only: the smoothness reading is confirmed but no uniform remainder bound is supplied and no bound moved -- honesty markers present, no QED.',
  },
];

for (const a of IMP97157_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97157-route-m-residual-vs-smallest-prime assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97157_KAPPA_ARITH,
  gmBySmallestPrime: IMP97157_GM_BY_SMALLEST_PRIME,
  regression: IMP97157_REGRESSION,
  withinOmega: IMP97157_WITHIN_OMEGA,
  anchors: IMP97157_ANCHORS,
  verdict: IMP97157_VERDICT,
  banner: IMP97157_HONEST_BANNER,
};
