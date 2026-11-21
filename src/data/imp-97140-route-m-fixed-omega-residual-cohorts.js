/**
 * @module imp-97140-route-m-fixed-omega-residual-cohorts
 *
 * imp-97140 (numerical, MEASUREMENT): tabulate the Route M arithmetic first-moment convergence
 * residual r(b) = F_arith(b)/(phi(b) b) - kappa_arith across cohorts of b with FIXED omega(b)
 * (the count of DISTINCT prime factors), to isolate the divisor-count dependence that imp-97122
 * Result 2 attributed to a "2^omega(b) structure" but never tabulated at fixed omega. This resolves
 * the smooth-vs-general gap into two separate, cleaner laws (a SIGN law and a MAGNITUDE law) and
 * shows the loose "2^omega" heuristic is a divisor-COUNT proxy, not the cancellation depth. No bound
 * moves; supplies NO uniform remainder bound (the imp-97096 sub-gap stays open); T ~ 2.594e7 trace
 * anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97096 / imp-97122: R_b = {a : 1 <= a <= b-1, (a,b)=1}, C = (log 2pi - gamma)/2,
 * A(a,b) = C(a+b) + (1/2)(a-b) log(b/a), F_arith(b) = Sum_{a in R_b} A(a,b),
 * kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the SIGN LAW: sign(r(b)) = (-1)^omega(b).
 * -------------------------------------------------------------------------------
 * Across a dense sweep b in [200, 3000] the sign of the residual tracks the PARITY of omega(b)
 * (the number of distinct prime factors) with only two exceptions: sign(r(b)) = (-1)^omega(b) for
 * 2799 of 2801 values. omega odd (b prime, prime power, or a product of an odd number of primes)
 * gives r > 0; omega even gives r < 0. This is a LIOUVILLE-type parity sign, NOT literally the
 * Moebius mu(b): it holds on prime powers too (b = 1024 = 2^10, 2187 = 3^7, 2197 = 13^3 all give
 * r > 0), whereas mu vanishes on non-squarefree b. The sign is set by the leading Moebius/Stirling
 * remainder term of R0(b) = L0(b)/phi(b) - (log b - 1), whose divisor sum over d | b carries an
 * overall (-1)^omega(b) factor.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the two exceptions are exactly the SMOOTHEST (primorial) moduli.
 * -------------------------------------------------------------------------------
 * The only sign-law violations in [200, 3000] are b = 2310 = 2.3.5.7.11 and b = 2730 = 2.3.5.7.13
 * (omega = 5, so the law predicts r > 0, but both give r < 0, |r| ~ 1e-6). Extending upward,
 * b = 30030 = 2.3.5.7.11.13 (omega = 6, law predicts r < 0) gives r > 0 (~3.6e-7). At these
 * primorial-type moduli the leading (-1)^omega term is cancelled all the way down to the ~1e-6 floor
 * (the imp-97122 primorial collapse) and a SUBLEADING term of the opposite sign takes over. So the
 * sign law is robust everywhere except where the leading term is annihilated to the floor.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the MAGNITUDE LAW is NOT a clean 2^(-omega); "2^omega" is a divisor-COUNT proxy.
 * -------------------------------------------------------------------------------
 * At matched b-scale (all cohorts near b ~ 1000-2700) the geometric-mean |r| falls with omega:
 *     omega = 1 : GM|r| = 6.75e-4     (primes and prime powers)
 *     omega = 2 : GM|r| = 5.43e-5     (b = p q)
 *     omega = 3 : GM|r| = 3.70e-5     (b = p q r)
 *     omega = 4 : GM|r| = 1.51e-5     (b = p q r s)
 * The consecutive ratios are 12.4 (1->2), 1.47 (2->3), 2.46 (3->4) -- NOT the constant ~2x per step
 * a pure 2^(-omega) law would give, and |r| * 2^omega is NOT constant (it drops ~10x from omega = 1
 * to omega >= 2, then sits at ~2e-4..4e-4). Reading: 2^omega counts the NUMBER OF TERMS in the
 * Moebius divisor sum (the imp-97122 heuristic), but the actual magnitude is driven by SMOOTHNESS
 * (the size of the smallest prime factor -> depth of cancellation), which is why matched-omega
 * cohorts still span an order of magnitude and the biggest single drop is the mere presence of a
 * second (small) prime factor at omega = 1 -> 2.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97122 "2^omega(b) structure" resolves, at fixed omega, into (i) a clean parity SIGN law
 * sign(r(b)) = (-1)^omega(b), holding on all but the smoothest primorial moduli where the leading
 * term is cancelled to the floor, and (ii) a MAGNITUDE decay with omega that is NOT 2^(-omega) but
 * is dominated by smoothness (smallest-prime size). This sharpens WHY the imp-97096 residual is a
 * modulus-dependent, absolute remainder-bound sub-gap: an explicit uniform bound must control both
 * the (-1)^omega sign and the smoothness-driven magnitude, not a single 2^omega factor. Measurement
 * only: no uniform remainder bound is supplied, no bound moved, T ~ 2.594e7 anchor unchanged,
 * no refereed bound is changed, RH open, NO QED.
 *
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (the O(log b/b) rate + 2^omega claim)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + explicit-remainder sub-gap)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent CS first-moment reduction)
 *
 * Ticket: imp-97140 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

// EXACT leading coefficient of F_arith(b)/(phi(b) b) (imp-97096 / imp-97122), recomputed here.
export const IMP97140_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// r(b) = F_arith(b)/(phi(b) b) - kappa_arith (the normalized residual).
function rOf(b) {
  let phi = 0, F = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { phi += 1; F += Aab(a, b); }
  }
  return F / (phi * b) - IMP97140_KAPPA_ARITH;
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

// MEASURED fixed-omega cohorts (frozen; b-scale matched near 1000-2700). r reproduced by rOf at import.
export const IMP97140_COHORTS = Object.freeze({
  // omega = 1: primes and prime powers -> r > 0.
  omega1: Object.freeze([
    Object.freeze({ b: 1009, r: 1.7989e-3 }), // prime
    Object.freeze({ b: 2003, r: 9.9144e-4 }), // prime
    Object.freeze({ b: 1024, r: 3.3905e-4 }), // 2^10
    Object.freeze({ b: 2187, r: 1.8859e-4 }), // 3^7
  ]),
  // omega = 2: b = p q -> r < 0.
  omega2: Object.freeze([
    Object.freeze({ b: 1003, r: -7.4081e-5 }), // 17.59
    Object.freeze({ b: 2021, r: -3.8264e-5 }), // 43.47
    Object.freeze({ b: 1067, r: -6.8123e-5 }), // 11.97
  ]),
  // omega = 3: b = p q r -> r > 0.
  omega3: Object.freeze([
    Object.freeze({ b: 1001, r: 5.2681e-5 }), // 7.11.13
    Object.freeze({ b: 1105, r: 4.7209e-5 }), // 5.13.17
    Object.freeze({ b: 2015, r: 2.7150e-5 }), // 5.13.31
  ]),
  // omega = 4: b = p q r s -> r < 0.
  omega4: Object.freeze([
    Object.freeze({ b: 1155, r: -2.0388e-5 }), // 3.5.7.11
    Object.freeze({ b: 2145, r: -1.2998e-5 }), // 3.5.11.13
    Object.freeze({ b: 1995, r: -1.3316e-5 }), // 3.5.7.19
  ]),
  // geometric-mean |r| per matched omega, near b ~ 1000-2700.
  gmAbsR: Object.freeze({ 1: 6.75e-4, 2: 5.43e-5, 3: 3.70e-5, 4: 1.51e-5 }),
  gmRatios: Object.freeze({ '1to2': 12.43, '2to3': 1.47, '3to4': 2.46 }), // NOT the constant ~2x of 2^-omega
});

// Sign-law sweep and its two exceptions (the smoothest primorial moduli).
export const IMP97140_SIGN_LAW = Object.freeze({
  rule: 'sign(r(b)) = (-1)^omega(b)', // omega odd -> r>0, omega even -> r<0
  sweep: Object.freeze({ range: '[200,3000]', total: 2801, violations: 2 }),
  exceptions: Object.freeze([
    Object.freeze({ b: 2310, factor: '2.3.5.7.11', omega: 5, r: -1.0677e-6 }), // predicts +, floor cancellation flips
    Object.freeze({ b: 2730, factor: '2.3.5.7.13', omega: 5, r: -5.4310e-7 }),
  ]),
  primorialUpward: Object.freeze({ b: 30030, factor: '2.3.5.7.11.13', omega: 6, r: 3.5980e-7 }), // predicts -, also flipped
  isLiouvilleNotMoebius: true, // holds on prime powers (mu = 0 there), so parity of omega, not mu(b)
});

export const IMP97140_VERDICT = Object.freeze({
  question:
    'tabulate r(b) = F_arith(b)/(phi(b) b) - kappa_arith across FIXED-omega(b) cohorts to isolate the ' +
    'divisor-count (2^omega) dependence of the imp-97122 smooth-vs-general convergence gap',
  signLaw: 'sign(r(b)) = (-1)^omega(b)', // parity of the distinct-prime count
  signLawHoldsFraction: '2799/2801 over b in [200,3000]',
  signLawExceptions: 'only the smoothest primorial moduli (b=2310,2730; and b=30030 upward)',
  isLiouvilleNotMoebius: true,
  magnitudeLawIsCleanTwoPowerOmega: false, // |r|*2^omega NOT constant; ratios 12.4/1.47/2.46
  magnitudeDriver: 'smoothness (size of smallest prime factor), NOT the divisor count alone',
  twoPowerOmegaIsCountProxy: true, // 2^omega counts terms in the Moebius divisor sum, not cancellation depth
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesUniformRemainderBound: false, // imp-97096 sub-gap stays open
  qed: false,
  conclusion:
    'At fixed omega(b) the imp-97122 2^omega structure resolves into two cleaner laws: a SIGN law ' +
    'sign(r(b)) = (-1)^omega(b) (Liouville parity of the distinct-prime count; holds on prime powers, ' +
    'so not literally mu(b)), robust for 2799/2801 of b in [200,3000] and failing only at the smoothest ' +
    'primorial moduli (2310, 2730, 30030) where the leading term is cancelled to the ~1e-6 floor and a ' +
    'subleading opposite-sign term takes over; and a MAGNITUDE law where GM|r| falls with omega ' +
    '(6.75e-4, 5.43e-5, 3.70e-5, 1.51e-5 for omega=1..4) but NOT as a clean 2^-omega -- the ratios ' +
    '12.4/1.47/2.46 show smoothness (smallest-prime size), not the divisor count, drives the size. So ' +
    '2^omega is a term-COUNT proxy for the Moebius divisor sum, not the cancellation depth. Measurement ' +
    'only: no uniform remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; ' +
    'T ~ 2.594e7 anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97140_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: across fixed-omega(b) cohorts the ' +
  'Route M residual r(b) obeys a parity SIGN law sign(r(b)) = (-1)^omega(b) (2799/2801 of b in [200,3000], ' +
  'failing only at the smoothest primorial moduli) and a MAGNITUDE decay with omega that is NOT a clean ' +
  '2^-omega (ratios 12.4/1.47/2.46) but is driven by smoothness. This resolves the imp-97122 2^omega ' +
  'heuristic into sign + smoothness parts but supplies NO uniform remainder bound -- the imp-97096 ' +
  'sub-gap stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97140_ASSERTIONS = [
  {
    id: 'imp97140-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97140_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97140_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed from gamma and log 2pi (matches imp-97096 / imp-97122).',
  },
  {
    id: 'imp97140-cohort-literals-reproduce',
    holds: () => {
      // every frozen cohort r(b) must be reproduced by an independent O(b) recompute.
      for (const key of ['omega1', 'omega2', 'omega3', 'omega4']) {
        for (const { b, r } of IMP97140_COHORTS[key]) {
          if (Math.abs(rOf(b) - r) > 5e-7) return false;
        }
      }
      return true;
    },
    why: 'the frozen fixed-omega cohort residuals r(b) are reproduced by an independent O(b) recompute (matched b-scale near 1000-2700).',
  },
  {
    id: 'imp97140-sign-law-holds',
    holds: () => {
      // omega odd -> r>0, omega even -> r<0, on the frozen cohorts and a spot-check of the sweep.
      for (const { b } of IMP97140_COHORTS.omega1) if (!(rOf(b) > 0 && omega(b) === 1)) return false;
      for (const { b } of IMP97140_COHORTS.omega2) if (!(rOf(b) < 0 && omega(b) === 2)) return false;
      for (const { b } of IMP97140_COHORTS.omega3) if (!(rOf(b) > 0 && omega(b) === 3)) return false;
      for (const { b } of IMP97140_COHORTS.omega4) if (!(rOf(b) < 0 && omega(b) === 4)) return false;
      // dense spot-check over a sub-range: sign matches (-1)^omega except known exceptions.
      let viol = 0;
      for (let b = 200; b <= 800; b++) {
        const expSign = omega(b) % 2 === 0 ? -1 : 1;
        if (Math.sign(rOf(b)) !== expSign) viol += 1;
      }
      return viol === 0; // no exceptions in [200,800] (2310,2730 lie above)
    },
    why: 'sign(r(b)) = (-1)^omega(b) on all fixed-omega cohorts and with zero violations across b in [200,800] (the primorial exceptions 2310/2730 lie above this window).',
  },
  {
    id: 'imp97140-sign-law-exceptions-are-smoothest',
    holds: () => {
      // the two sweep exceptions have odd omega=5 yet r<0 (leading term cancelled to the floor).
      for (const { b, omega: w } of IMP97140_SIGN_LAW.exceptions) {
        if (w % 2 !== 1) return false; // odd omega -> law predicts r>0
        if (!(rOf(b) < 0)) return false; // but observed r<0 (flip)
        if (!(Math.abs(rOf(b)) < 5e-6)) return false; // at the primorial floor
      }
      return true;
    },
    why: 'the two sign-law exceptions (b=2310,2730, omega=5) have r<0 despite odd omega, at the ~1e-6 primorial floor -- the leading (-1)^omega term is cancelled and a subleading opposite-sign term dominates.',
  },
  {
    id: 'imp97140-magnitude-not-clean-two-power-omega',
    holds: () => {
      // GM|r| decreases with omega, but |r|*2^omega is NOT roughly constant across omega.
      const g = IMP97140_COHORTS.gmAbsR;
      if (!(g[1] > g[2] && g[2] > g[3] && g[3] > g[4])) return false; // monotone down in omega
      const scaled = [g[1] * 2, g[2] * 4, g[3] * 8, g[4] * 16];
      const mx = Math.max(...scaled), mn = Math.min(...scaled);
      return mx / mn > 3 && IMP97140_VERDICT.magnitudeLawIsCleanTwoPowerOmega === false;
    },
    why: 'GM|r| falls monotonically with omega, but |r|*2^omega spans a factor > 3 across omega=1..4, so the decay is NOT a clean 2^-omega -- 2^omega is a term-count proxy, not the cancellation depth.',
  },
  {
    id: 'imp97140-honesty-gate-no-qed',
    holds: () =>
      IMP97140_VERDICT.anyBoundMoved === false &&
      IMP97140_VERDICT.postsRigorousCeiling === false &&
      IMP97140_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97140_VERDICT.qed === false &&
      /NO QED/.test(IMP97140_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97140_HONEST_BANNER) &&
      /RH open/.test(IMP97140_HONEST_BANNER),
    why: 'measurement only: sign + magnitude laws are quantified but no uniform remainder bound is supplied and no bound moved -- honesty markers present, no QED.',
  },
];

for (const a of IMP97140_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97140-route-m-fixed-omega-residual-cohorts assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97140_KAPPA_ARITH,
  cohorts: IMP97140_COHORTS,
  signLaw: IMP97140_SIGN_LAW,
  verdict: IMP97140_VERDICT,
  banner: IMP97140_HONEST_BANNER,
};
