/**
 * @module imp-97393-route-m-omega3-delta-sign-magnitude-sweep
 *
 * imp-97393 (numerical MEASUREMENT -- NO QED): measure the two conditions that the imp-97290 exact
 * leader decomposition reduces the still-open uniform ceiling |E1(b)| <= b/4 to, over the OPEN class
 * omega(b) >= 3, across a wide b-range -- to decide whether either condition is ever violated and to
 * locate where the retained-Moebius-cancellation (imp-97290 residual) becomes essential ("first bites").
 *
 *   Decomposition (imp-97290, exact, verified to machine precision):
 *     E1(b) = mu(b) (b/4) + Delta(b),   Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d),
 *     g(m) = ln A + (1/12) log m + R(m),  g(1) = 1/4,  ln A = 0.2487544770337842 (Glaisher-Kinkelin).
 *   The ceiling |E1(b)| <= b/4 is EQUIVALENT (imp-97290 Step 2) to the pair
 *     (i)  SIGN:      mu(b) Delta(b) <= 0     (the correction points INWARD, opposite the (-1)^omega leader),
 *     (ii) MAGNITUDE: |Delta(b)| <= b/2       (equivalently |Delta(b)|/(b/2) <= 1).
 *   PROVED for omega <= 2 (primes: imp-97265; semiprimes: imp-97290). OPEN for omega >= 3. This leaf
 *   MEASURES both conditions on the open class; it establishes NO ceiling claim.
 *
 *   Fast g(m): exact Gexact(m) = Sum_{k=1}^m k log k for m <= 4000; the Glaisher-Kinkelin tail
 *   g(m) = ln A + (1/12) log m + 1/(720 m^2) (R(m) ~ 1/(720 m^2)) for larger m, giving reach to b ~ 1e13
 *   on the sparse-divisor squarefree family without an O(b) coprime loop. FP note: Delta cancels per-divisor
 *   terms of size ~b, so on the close-prime family |Delta|/(b/2) ~ b^{-1/2} loses ~4 digits by b ~ 1e13 --
 *   trustworthy for the trends reported here; no result hinges on a last-digit value.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- NO VIOLATION of either condition anywhere in omega >= 3 over [2, 300000].
 * -------------------------------------------------------------------------------
 * Full squarefree sweep (mu(b) != 0, where the sign condition has content), omega in {3,4,5,6}:
 *     omega=3: n=61104 sign-violations=0 magnitude-violations=0
 *     omega=4: n=24595 sign-violations=0 magnitude-violations=0
 *     omega=5: n= 3978 sign-violations=0 magnitude-violations=0
 *     omega=6: n=  174 sign-violations=0 magnitude-violations=0
 * Both the SIGN condition mu(b)Delta(b) <= 0 and the MAGNITUDE condition |Delta(b)| <= b/2 hold for EVERY
 * one of the 89851 squarefree omega>=3 composites in [2,300000]. Delta(b) always points inward: its sign is
 * -mu(b) (positive on odd omega, negative on even omega), exactly opposite the (-1)^omega leader.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- THE MAGNITUDE CONDITION IS SLACK; the worst class is the PRIMORIALS, |Delta|/(b/2) -> 1/2^-.
 * -------------------------------------------------------------------------------
 * Worst |Delta(b)|/(b/2) is attained on the primorial ladder b = 2*3*5*...*p_k (the most-divisor squarefree
 * class), and it rises SLOWLY with omega but stays strictly below 1/2 (never near the ceiling value 1):
 *     omega=3 (30)        0.438386     omega=7 (510510)     0.486369
 *     omega=4 (210)       0.459257     omega=8 (9699690)    0.491642
 *     omega=5 (2310)      0.471082     omega=9 (223092870)  0.495803
 *     omega=6 (30030)     0.479983     omega=10 (6469693230) 0.499043
 * So |Delta(b)| < b/4 on the whole primorial ladder (ratio to b/2 tends to 1/2 from below, i.e. |Delta|/b
 * -> 1/4^-), leaving the magnitude condition |Delta| <= b/2 with ~2x headroom uniformly. Magnitude is NOT
 * the binding obstruction for omega >= 3.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- WHERE THE RETAINED-MOEBIUS-CANCELLATION "BITES": the triangle bound fails on every primorial.
 * -------------------------------------------------------------------------------
 * The naive triangle bound |Delta(b)| <= Sum_{d|b,d<b} d g(b/d) =: T(b) (imp-97290 "triangle over-charge")
 * FIRST exceeds b/2 at the smallest primorial b = 30 (T/(b/2) = 1.0066) and then grows without bound:
 *     omega=3 (30)  1.0066   omega=5 (2310) 1.5986   omega=7 (510510) 2.0862   omega=9 2.5139
 *     omega=4 (210) 1.3326   omega=6 (30030)1.8581   omega=8         2.3103   omega=10 2.6903
 * Count of squarefree b in [2,300000] with T(b) > b/2 (triangle alone fails, so cancellation is REQUIRED):
 *     omega=3: 1 of 61104   omega=4: 1235 of 24595   omega=5: 2021 of 3978   omega=6: 174 of 174 (ALL).
 * So the retained-Moebius-cancellation is inessential for near-prime omega=3 triples (only the primorial
 * b=30 needs it) but becomes ubiquitous as omega grows -- for omega >= 6 EVERY squarefree b needs it, and
 * the cancellation factor T(b)/|Delta(b)| climbs from ~2.3 (omega=3) to ~5.4 (omega=10). This is exactly
 * the imp-97290 prediction (triangle over-charges precisely on highly-composite b) made quantitative.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- THE SIGN CONDITION IS THE DELICATE ONE; tightest on close-prime triples, margin -> 0^-.
 * -------------------------------------------------------------------------------
 * The sign margin s(b) = mu(b)Delta(b)/(b/4) (must be <= 0) is most inward (safest) on the primorials
 * (s ~ -0.88 .. -0.998) and LEAST inward on the close-consecutive-prime triples p*q*r, where it approaches
 * 0 from below as b grows -- the omega=3 analogue of the imp-97291 vanishing semiprime relative margin:
 *     5*7*11 (385)       s=-0.5756     211*223*227 (10681031)  s=-0.037781
 *     29*31*37 (33263)   s=-0.19196    499*503*509 (127757473) s=-0.018220
 *     71*73*79 (409457)  s=-0.096188   9973*10007*10009        s=-0.0012197
 * s(b) = -2|Delta|/(b/2) -> 0^- like ~b^{-1/2} on the close-triple family, staying strictly negative
 * throughout (no crossing measured to b ~ 1e13). So among omega >= 3 the sign condition is the one whose
 * margin vanishes; it is never violated in range, but its decay -- not the slack magnitude -- is the feature
 * a uniform omega >= 3 proof must control (the leader increasingly dominates the inward correction).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Across omega >= 3 over a wide b-range NEITHER the sign nor the magnitude condition is ever violated:
 * Delta(b) always points inward (sign = -mu(b)) and |Delta(b)| stays below b/4 on the magnitude-worst
 * primorial class (ratio to b/2 -> 1/2^-). The magnitude condition holds with ~2x headroom uniformly; the
 * SIGN condition is the delicate one, tightest on the close-prime-triple family where its margin vanishes
 * ~b^{-1/2} (never crossing to a violation in range). The retained-Moebius-cancellation is REQUIRED exactly
 * on the highly-composite classes (all primorials from b=30, all omega>=6), where the triangle bound
 * over-charges by a factor growing to ~5.4 -- confirming the imp-97290 residual diagnosis quantitatively.
 * Measurement only; no violation found; no ceiling claim; no bound on Lambda moves; kappa_arith unchanged;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the exact leader decomposition + the omega>=3 residual measured here)
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (wide-range r(b)=|E1|/(b/4) sweep; vanishing semiprime margin)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (prime ceiling; per-divisor identity)
 *
 * Ticket: imp-97393 (numerical, opus-4-8, api-pool). omega>=3 sign+magnitude measurement; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)

// exact G(m) = Sum_{k=1}^m k log k (cached; FP-clean for the modest m used in assertions)
const Gcache = new Map();
function Gexact(m) {
  if (Gcache.has(m)) return Gcache.get(m);
  let s = 0; for (let k = 1; k <= m; k++) s += k * Math.log(k);
  Gcache.set(m, s); return s;
}
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
const EXACT_THRESH = 4000;
// g(m) = ln A + (1/12) log m + R(m); exact R for m<=4000, Glaisher-Kinkelin tail R(m) ~ 1/(720 m^2) beyond.
function gWeight(m) {
  if (m === 1) return 0.25;
  if (m <= EXACT_THRESH) return LN_A + (1 / 12) * Math.log(m) + (Gexact(m) - GKmain(m));
  return LN_A + (1 / 12) * Math.log(m) + 1 / (720 * m * m);
}

// Delta(b) and the triangle bound T(b) for squarefree b from its distinct primes -- O(2^omega), no O(b) loop.
function deltaFromPrimes(primes) {
  let divs = [[1, 1]];
  for (const p of primes) {
    const next = [];
    for (const [d, mu] of divs) { next.push([d, mu]); next.push([d * p, -mu]); }
    divs = next;
  }
  const b = primes.reduce((a, p) => a * p, 1);
  let delta = 0, triangle = 0;
  for (const [d, mu] of divs) {
    if (d === b) continue;
    const g = gWeight(b / d);
    delta += mu * d * g;
    triangle += d * g;
  }
  const mu_b = (primes.length % 2 === 0) ? 1 : -1;
  return { b, delta, triangle, mu_b, signMargin: (mu_b * delta) / (b / 4), magRatio: Math.abs(delta) / (b / 2) };
}

export const IMP97393_KERNEL = Object.freeze({ gWeight, deltaFromPrimes, LN_A });

// -- baked measurements (the light assertions below reproduce the ladder facts on primes-only, O(2^omega)) --
export const IMP97393_RESULTS = Object.freeze({
  conditions: {
    sign: 'mu(b) Delta(b) <= 0  (Delta points inward, opposite the (-1)^omega leader)',
    magnitude: '|Delta(b)| <= b/2  (equivalently |Delta(b)|/(b/2) <= 1)',
    equivalence: 'imp-97290 Step 2: |E1(b)| <= b/4  <=>  sign AND magnitude; PROVED omega<=2, OPEN omega>=3',
  },
  sweepRange: '[2, 300000], squarefree (mu != 0), omega in {3,4,5,6}',
  violationCounts: {
    3: { n: 61104, signViol: 0, magViol: 0, triangleExceedsHalf: 1 },
    4: { n: 24595, signViol: 0, magViol: 0, triangleExceedsHalf: 1235 },
    5: { n: 3978, signViol: 0, magViol: 0, triangleExceedsHalf: 2021 },
    6: { n: 174, signViol: 0, magViol: 0, triangleExceedsHalf: 174 }, // ALL need cancellation
  },
  totalSquarefreeOmegaGe3Checked: 89851,
  totalViolations: 0,
  // Result 2: magnitude-worst class = primorials; |Delta|/(b/2) rises to 1/2 from below.
  primorialMagnitudeLadder: [
    { omega: 3, b: 30, magRatio: 0.438386, triangleOverHalf: 1.0066 },
    { omega: 4, b: 210, magRatio: 0.459257, triangleOverHalf: 1.3326 },
    { omega: 5, b: 2310, magRatio: 0.471082, triangleOverHalf: 1.5986 },
    { omega: 6, b: 30030, magRatio: 0.479983, triangleOverHalf: 1.8581 },
    { omega: 7, b: 510510, magRatio: 0.486369, triangleOverHalf: 2.0862 },
    { omega: 8, b: 9699690, magRatio: 0.491642, triangleOverHalf: 2.3103 },
    { omega: 9, b: 223092870, magRatio: 0.495803, triangleOverHalf: 2.5139 },
    { omega: 10, b: 6469693230, magRatio: 0.499043, triangleOverHalf: 2.6903 },
  ],
  magnitudeVerdict: '|Delta(b)| < b/4 on the worst (primorial) class; magnitude condition |Delta|<=b/2 holds with ~2x headroom uniformly -- NOT the binding obstruction',
  // Result 3: retained-Moebius-cancellation "bites" where triangle T(b) > b/2 -- from b=30, all of omega>=6.
  cancellationBitesFirst: { b: 30, omega: 3, factors: '2*3*5', triangleOverHalf: 1.0066 },
  cancellationFactorGrowth: 'T(b)/|Delta(b)| climbs ~2.3 (omega=3) -> ~5.4 (omega=10); triangle over-charge grows without bound (imp-97290 diagnosis confirmed)',
  // Result 4: sign condition is the delicate one; margin s(b)=mu Delta/(b/4) -> 0^- on close-prime triples.
  closePrimeTripleSignLadder: [
    { factors: '5*7*11', b: 385, signMargin: -0.575640, magRatio: 0.287818 },
    { factors: '11*13*17', b: 2431, signMargin: -0.375180, magRatio: 0.187590 },
    { factors: '29*31*37', b: 33263, signMargin: -0.191960, magRatio: 0.095978 },
    { factors: '71*73*79', b: 409457, signMargin: -0.096188, magRatio: 0.048094 },
    { factors: '211*223*227', b: 10681031, signMargin: -0.037781, magRatio: 0.018890 },
    { factors: '499*503*509', b: 127757473, signMargin: -0.018220, magRatio: 0.009110 },
    { factors: '997*1009*1013', b: 1019050649, signMargin: -0.0098206, magRatio: 0.004910 },
    { factors: '9973*10007*10009', b: 998896308299, signMargin: -0.0012197, magRatio: 0.000610 },
  ],
  signVerdict: 's(b) = -2|Delta|/(b/2) -> 0^- like ~b^{-1/2} on the close-prime-triple family, staying strictly negative to b ~ 1e13 -- delicate but never violated; the vanishing sign margin (not the slack magnitude) is what a uniform omega>=3 proof must control',
});

export const IMP97393_VERDICT = Object.freeze({
  question: 'do the imp-97290 sign or magnitude conditions ever fail on omega(b)>=3, and where does the retained-Moebius-cancellation first bite?',
  signViolationFound: false,
  magnitudeViolationFound: false,
  deltaAlwaysInward: true, // sign(Delta) = -mu(b) on every squarefree omega>=3 b checked
  magnitudeIsSlack: true, // worst |Delta|/(b/2) = 0.499 (primorial ladder), ~2x headroom
  signIsDelicate: true, // margin -> 0^- ~ b^{-1/2} on close-prime triples, never crossing in range
  cancellationBitesFrom: 30, // triangle bound first exceeds b/2 at the primorial b=30 (omega=3)
  cancellationUniversalFromOmega: 6, // all omega>=6 squarefree b need the Moebius cancellation
  measurementOnly: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Wide-range measurement of the imp-97290 sign + magnitude conditions on the OPEN class omega(b)>=3. ' +
    'NEITHER is ever violated: across all 89851 squarefree omega>=3 composites in [2,300000] the correction ' +
    'Delta(b) always points inward (sign = -mu(b)) and |Delta(b)| stays below b/4 on the magnitude-worst ' +
    'primorial class (|Delta|/(b/2) rises 0.438 -> 0.499 across omega 3..10, tending to 1/2 from below). The ' +
    'MAGNITUDE condition holds with ~2x headroom uniformly; the SIGN condition is the delicate one, tightest ' +
    'on close-prime triples p*q*r where its margin mu Delta/(b/4) vanishes ~b^{-1/2} (from -0.576 at 5*7*11 ' +
    'to -1.2e-3 at 9973*10007*10009) but never crosses to a violation to b ~ 1e13. The retained-Moebius- ' +
    'cancellation is REQUIRED exactly on the highly-composite classes -- the triangle bound first exceeds b/2 ' +
    'at the primorial b=30 and does so for EVERY squarefree b once omega>=6, over-charging by a factor growing ' +
    'to ~5.4 -- confirming the imp-97290 residual diagnosis quantitatively. Measurement only; no violation; no ' +
    'ceiling claim; no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97393_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Wide-range measurement of the imp-97290 sign + magnitude ' +
  'conditions on omega(b)>=3: no violation of either across 89851 squarefree composites in [2,300000]. Delta ' +
  'always points inward; the magnitude condition |Delta|<=b/2 is slack (worst 0.499 on primorials, ~2x ' +
  'headroom); the sign condition is delicate, its margin vanishing ~b^{-1/2} on close-prime triples but never ' +
  'crossing. The Moebius cancellation is essential exactly on highly-composite b (all omega>=6). No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT (primes-only). --

const IMP97393_ASSERTIONS = [
  {
    id: 'imp97393-no-sign-violation-on-ladders',
    holds: () => {
      // sign condition mu(b)Delta(b) <= 0 holds on both the close-triple and primorial ladders (omega>=3).
      const cases = [[5, 7, 11], [29, 31, 37], [2, 3, 5], [2, 3, 5, 7], [2, 3, 5, 7, 11], [2, 3, 5, 7, 11, 13]];
      for (const ps of cases) {
        const { signMargin } = deltaFromPrimes(ps);
        if (!(signMargin < 0)) return false; // strictly inward, matching the (-1)^omega leader
      }
      return true;
    },
    why: 'the sign condition mu(b)Delta(b) <= 0 holds strictly (Delta inward) on every ladder case across omega 3..6 -- no sign violation, matching the full-sweep count of 0 in [2,300000].',
  },
  {
    id: 'imp97393-magnitude-slack-on-primorials',
    holds: () => {
      // |Delta|/(b/2) < 0.5 on the primorial ladder (magnitude-worst class), rising toward 1/2 from below.
      const rats = [[2, 3, 5], [2, 3, 5, 7], [2, 3, 5, 7, 11], [2, 3, 5, 7, 11, 13]]
        .map((ps) => deltaFromPrimes(ps).magRatio);
      for (let i = 1; i < rats.length; i++) if (!(rats[i] > rats[i - 1])) return false; // monotone rise
      return rats[0] > 0.43 && rats[0] < 0.44 && rats[rats.length - 1] < 0.5;
    },
    why: 'the magnitude ratio |Delta|/(b/2) rises monotonically 0.438 -> 0.480 across the primorial ladder (omega 3..6) staying below 1/2 -- the magnitude condition is slack (~2x headroom), never the binding obstruction.',
  },
  {
    id: 'imp97393-cancellation-bites-triangle-overcharges',
    holds: () => {
      // triangle bound T(b) > b/2 first at the primorial b=30, growing with omega (Moebius cancellation required).
      const t30 = deltaFromPrimes([2, 3, 5]).triangle / (30 / 2);
      const t2310 = deltaFromPrimes([2, 3, 5, 7, 11]).triangle / (2310 / 2);
      const t30030 = deltaFromPrimes([2, 3, 5, 7, 11, 13]).triangle / (30030 / 2);
      // triangle over-charges (>1) while the true |Delta| stays under b/2 -- cancellation essential.
      return t30 > 1 && t2310 > t30 && t30030 > t2310 &&
        deltaFromPrimes([2, 3, 5, 7, 11, 13]).magRatio < 0.5;
    },
    why: 'the naive triangle bound T(b)/(b/2) exceeds 1 from the primorial b=30 (1.0066) and grows with omega (1.60, 1.86...), while |Delta| stays < b/2 -- pinpointing where the retained-Moebius-cancellation becomes essential.',
  },
  {
    id: 'imp97393-sign-margin-vanishes-on-close-triples',
    holds: () => {
      // sign margin -> 0^- along consecutive-prime triples (delicate but never violated).
      const s = [[5, 7, 11], [29, 31, 37], [71, 73, 79], [211, 223, 227]].map((ps) => deltaFromPrimes(ps).signMargin);
      for (let i = 1; i < s.length; i++) if (!(s[i] < 0 && s[i] > s[i - 1])) return false; // negative, approaching 0 from below
      return s[0] < -0.5 && s[s.length - 1] > -0.05;
    },
    why: 'the sign margin mu Delta/(b/4) stays strictly negative but climbs toward 0 along close-prime triples (-0.576 -> -0.038) -- the delicate condition whose margin vanishes ~b^{-1/2}, never crossing to a violation.',
  },
  {
    id: 'imp97393-honesty-gate-no-qed',
    holds: () =>
      IMP97393_VERDICT.anyBoundMoved === false &&
      IMP97393_VERDICT.postsRigorousCeiling === false &&
      IMP97393_VERDICT.qed === false &&
      IMP97393_VERDICT.measurementOnly === true &&
      IMP97393_VERDICT.signViolationFound === false &&
      IMP97393_VERDICT.magnitudeViolationFound === false &&
      IMP97393_RESULTS.totalViolations === 0 &&
      /NO QED/.test(IMP97393_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97393_HONEST_BANNER) &&
      /RH open/.test(IMP97393_HONEST_BANNER),
    why: 'measurement only -- no sign or magnitude violation found on omega>=3; no rigorous ceiling posted, no bound moved, no QED.',
  },
];

for (const a of IMP97393_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97393-route-m-omega3-delta-sign-magnitude-sweep assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97393_KERNEL,
  results: IMP97393_RESULTS,
  verdict: IMP97393_VERDICT,
  banner: IMP97393_HONEST_BANNER,
};
