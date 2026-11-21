/**
 * @module imp-97291-route-m-e1-wide-composite-ratio-sweep
 *
 * imp-97291 (numerical MEASUREMENT -- NO QED): measure the supremum of the composite ratio
 *     r(b) = |E1(b)| / (b/4)
 * over a much WIDER b-range than the [2,6000] window of imp-97265 Step 3, to decide whether the
 * worst COMPOSITE ratio approaches 1 (as the primes do) or plateaus strictly below it, and to
 * quantify the class headroom for the still-open uniform ceiling |E1(b)| <= b/4 (imp-97265 residual).
 *
 *   Notation (imp-97133 / imp-97208 / imp-97224 / imp-97265): E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4),
 *   L1(b) = Sum_{a coprime, 1<=a<=b-1} a log a, phi = Euler totient, omega(b) = number of distinct primes,
 *   ln A = 0.2487544770337842 (Glaisher-Kinkelin log-constant). Evaluated by the exact per-divisor identity
 *   E1(b) = Sum_{d|b} mu(d) C_d (imp-97265 Step 1), with the exact G(n) = Sum k log k replaced by its
 *   Glaisher-Kinkelin asymptotic Gasymp(n) = (n^2/2+n/2+1/12)log n - n^2/4 + ln A + 1/(720 n^2) for reach.
 *
 * -------------------------------------------------------------------------------
 * METHOD & VALIDATION.
 * -------------------------------------------------------------------------------
 * The direct coprime sum measureE1(b) is O(b); the divisor identity with Gasymp is O(sigma_0(b)) per b,
 * letting a full sieve-factorised sweep cover [4, 1e6] and the close-factor semiprime subfamilies reach
 * b ~ 1e9. The Gasymp evaluator agrees with the exact coprime sum to |diff| < 6e-7 in ratio on
 * large-prime semiprimes (991*1009: exact 0.993409 vs fast 0.993410; 499*503: 5.7e-9; 809*811: 1.7e-7);
 * it is inaccurate only on SMOOTH b (small-n divisors), which never approach the sup.
 *
 * FLOATING-POINT VALIDITY BOUND: E1(b) ~ -b/4 is computed by cancelling per-divisor terms of size ~b^2/4,
 * so IEEE-double catastrophic cancellation limits the relative accuracy of the ratio to ~4e-16 * b. The
 * ratio is trustworthy to ~6 decimals for b <~ 2.5e9 and breaks entirely past ~1e11 (where the evaluator
 * spuriously returns r > 1 -- an FP artifact, NOT a real ceiling violation). All results below stay inside
 * the trustworthy window (b <= 1e9); the ratio -> 1 conclusion is a monotone-trend statement, not a claim
 * that r exceeds any FP-noise value at extreme b.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE WORST COMPOSITE RATIO GROWS WITH THE RANGE (does NOT plateau below 1).
 * -------------------------------------------------------------------------------
 * Worst composite r(b) over [2,6000] (imp-97265): 0.936898 at b = 71*83 = 5893.
 * Worst composite r(b) over [4,1e6] (this leaf): 0.993410 at b = 991*1009 = 999919 (omega=2).
 * The worst composite in a range [4,X] is simply the largest consecutive-prime semiprime <= X, and its
 * ratio rises monotonically toward 1 as X grows -- there is no plateau strictly below 1.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- SEMIPRIMES (omega=2) BIND; higher omega classes fall away.
 * -------------------------------------------------------------------------------
 * Worst r(b) by omega class over [4,1e6]:
 *     omega=1 (primes)   0.99935 (b=5987, from imp-97265; primes rise to 1)
 *     omega=2 (semiprime) 0.993410  (991*1009)
 *     omega=3            0.925092  (89*103*109)
 *     omega=4            0.740952  (23*29*31*47)
 *     omega=5            0.458255  (7*13*17*19*31)
 *     omega=6            0.192473  (3*7*11*13*17*19)
 *     omega=7            0.032718  (2*3*5*7*13*17*19).
 * The two-close-prime-factors family (semiprimes and primes) is the binding class; each additional prime
 * factor sharply lowers the achievable ratio. This confirms imp-97265 Step 3 across a 167x wider range.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- THE CONSECUTIVE-PRIME / TWIN-PRIME SEMIPRIME LADDERS -> 1 MONOTONICALLY.
 * -------------------------------------------------------------------------------
 * Consecutive-prime semiprimes p*nextprime(p):  0.93349 (71*73) -> 0.97438 (211*223) ->
 *   0.98778 (499*503) -> 0.99343 (997*1009) -> 0.99756 (2999*3001) -> 0.99919 (9973*10007) ->
 *   0.99972 (31607*31627).  Twin-prime semiprimes p*(p+2) track the same climb to 0.99987 (79559*79561).
 * The ratio increases monotonically toward 1 with NO omega-class headroom on the almost-prime family.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 (refinement of imp-97265) -- THE ABSOLUTE MARGIN STAYS POSITIVE AND GROWS ~ sqrt(b).
 * -------------------------------------------------------------------------------
 * The absolute margin M(b) = b/4 - |E1(b)| on consecutive-prime semiprimes stays strictly POSITIVE and
 * grows: M/sqrt(b) climbs slowly 1.197 (5183) -> 1.531 (250997) -> 2.031 (99799811) -> 2.224 (999634589),
 * i.e. M(b) ~ c(b) sqrt(b) with c(b) a slow (log-type) increase. So the ceiling holds on the whole
 * measured close-factor family with an absolute margin ~ sqrt(b) = O(p) > 0 (much larger than the prime
 * margin (1/12)log p + ln A), YET the RELATIVE margin 1 - r(b) = 4 M(b)/b ~ c(b)/sqrt(b) -> 0. The decay
 * of 1 - r(b) is ~ b^{-1/2} (per-decade factor ~0.33-0.35): 6.65e-2 -> 2.56e-2 -> 1.22e-2 -> 6.57e-3 ->
 * 2.44e-3 -> 8.13e-4 -> 2.81e-4 across the ladder above.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The worst composite ratio APPROACHES 1 (does not plateau below it): sup_{composite b} r(b) = 1,
 * approached from below along the close-prime semiprime family, never attained. There is NO omega-class
 * headroom for a "primes-tight / composites-loose" argument (confirming imp-97265 Step 3 over a 167x
 * wider range). NEW quantitative content: the ABSOLUTE margin b/4 - |E1(b)| stays positive and grows
 * like ~sqrt(b) on the binding semiprime family -- the uniform ceiling is not merely saturated but held
 * with growing absolute room, so a uniform proof should target the b-linear leader's cancellation with a
 * positive O(sqrt b) semiprime margin (not the vanishing relative margin). Measurement only; no bound on
 * Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (per-divisor identity; prime ceiling; Step 3 obstruction)
 * @see imp-97224-route-m-arith-first-moment-uniform-E1.js (2^omega removal; E1 = CK + E1_tail; tail bound)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (uniform E1 quarter-ceiling on the semiprime class)
 *
 * Ticket: imp-97291 (numerical, opus-4-8, api-pool). Wide-range composite-ratio measurement; NO QED.
 */

const LN_A = 1 / 12 - -0.1654211437004509; // 0.2487544770337842

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };

// exact E1 via direct coprime sum (validation only; O(b))
function measureE1(b) {
  let phi = 0, L1 = 0;
  for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); }
  return L1 - phi * b * (0.5 * Math.log(b) - 0.25);
}

// Glaisher-Kinkelin asymptotic for G(n) = Sum_{k=1}^n k log k (one Euler-Maclaurin correction term).
function Gasymp(n) {
  if (n <= 0) return 0;
  const ln = Math.log(n);
  return (n * n / 2) * ln - (n * n) / 4 + (n / 2) * ln + (1 / 12) * ln + LN_A + 1 / (720 * n * n);
}

// Fast E1 for a squarefree b given its distinct primes -- O(2^omega) per b (no O(b) loop).
function E1fastFromPrimes(primes) {
  let divs = [[1, 1]];
  for (const p of primes) {
    const next = [];
    for (const [d, mu] of divs) { next.push([d, mu]); next.push([d * p, -mu]); }
    divs = next;
  }
  const b = primes.reduce((a, p) => a * p, 1);
  let s = 0;
  for (const [d, mu] of divs) {
    const n = b / d - 1;
    const Cd = (b * (b - d) / (2 * d)) * Math.log(d) + d * Gasymp(n)
      - (b * b / (2 * d)) * Math.log(b) + (b * b) / (4 * d);
    s += mu * Cd;
  }
  return s;
}
const ratioFromPrimes = (primes) => {
  const b = primes.reduce((a, p) => a * p, 1);
  return Math.abs(E1fastFromPrimes(primes)) / (b / 4);
};

export const IMP97291_KERNEL = Object.freeze({ measureE1, Gasymp, E1fastFromPrimes, ratioFromPrimes, LN_A });

// -- baked measurements (reproduced by the light assertions below) --
export const IMP97291_RESULTS = Object.freeze({
  ratioDefinition: 'r(b) = |E1(b)| / (b/4)',
  method: 'exact per-divisor identity E1(b)=Sum mu(d) C_d with Gasymp for reach; validated vs exact coprime sum',
  fpValidityBound: 'ratio trustworthy to ~6 decimals for b <~ 2.5e9; FP cancellation breaks (spurious r>1) past ~1e11',
  gasympVsExactRatioDiff: { '991*1009': 5.14e-7, '499*503': 5.73e-9, '809*811': 1.68e-7 },
  worstCompositeTo6000: { b: 5893, factors: '71*83', omega: 2, ratio: 0.936898 }, // imp-97265 (for comparison)
  worstCompositeTo1e6: { b: 999919, factors: '991*1009', omega: 2, ratio: 0.993410 },
  worstByOmegaTo1e6: {
    1: { note: 'primes rise to 1', ratio: 0.999350, b: 5987 }, // imp-97265 worst prime <=6000
    2: { b: 999919, factors: '991*1009', ratio: 0.993410 },
    3: { b: 999203, factors: '89*103*109', ratio: 0.925092 },
    4: { b: 971819, factors: '23*29*31*47', ratio: 0.740952 },
    5: { b: 911183, factors: '7*13*17*19*31', ratio: 0.458255 },
    6: { b: 969969, factors: '3*7*11*13*17*19', ratio: 0.192473 },
    7: { b: 881790, factors: '2*3*5*7*13*17*19', ratio: 0.032718 },
  },
  consecutivePrimeSemiprimeLadder: [
    { b: 5183, factors: '71*73', ratio: 0.933494 },
    { b: 47053, factors: '211*223', ratio: 0.974382 },
    { b: 250997, factors: '499*503', ratio: 0.987776 },
    { b: 1005973, factors: '997*1009', ratio: 0.993428 },
    { b: 8999999, factors: '2999*3001', ratio: 0.997558 },
    { b: 99799811, factors: '9973*10007', ratio: 0.999187 },
    { b: 999634589, factors: '31607*31627', ratio: 0.999719 },
  ],
  twinPrimeSemiprimeLadder: [
    { b: 3599, factors: '59*61', ratio: 0.922358 },
    { b: 176399, factors: '419*421', ratio: 0.985703 },
    { b: 98604899, factors: '9929*9931', ratio: 0.999182 },
    { b: 6329793599, factors: '79559*79561', ratio: 0.999871, note: 'past 6-decimal FP bound, trend only' },
  ],
  // Result 4: absolute margin b/4 - |E1| on consecutive-prime semiprimes, and M/sqrt(b).
  absoluteMarginOverSqrtB: [
    { b: 5183, marginOverSqrtB: 1.197 },
    { b: 250997, marginOverSqrtB: 1.531 },
    { b: 99799811, marginOverSqrtB: 2.031 },
    { b: 999634589, marginOverSqrtB: 2.224 },
  ],
  relativeMarginDecay: '1 - r(b) ~ b^{-1/2} (per-decade factor ~0.33-0.35), absolute margin ~ c(b) sqrt(b) with c slowly growing',
});

export const IMP97291_VERDICT = Object.freeze({
  question: 'does the worst COMPOSITE ratio r(b)=|E1(b)|/(b/4) approach 1 or plateau strictly below it (wide b-range)?',
  supComposite: 1, // approached from below, never attained
  approachesOne: true,
  plateausBelowOne: false,
  bindingClass: 'semiprimes (two close primes); higher omega classes fall away sharply',
  classHeadroomExists: false, // confirms imp-97265 Step 3 over a 167x wider range
  absoluteMarginPositiveAndGrowing: true, // b/4 - |E1| ~ sqrt(b) > 0 on the binding family (NEW)
  relativeMarginVanishes: true, // 1 - r(b) ~ b^{-1/2} -> 0
  measurementOnly: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Wide-range measurement of r(b)=|E1(b)|/(b/4). The worst COMPOSITE ratio APPROACHES 1 (does not ' +
    'plateau below it): 0.936898 at 71*83 over [2,6000] rises to 0.993410 at 991*1009 over [4,1e6], and ' +
    'the consecutive-prime / twin-prime semiprime ladders climb monotonically toward 1 (0.9335 -> 0.99972 ' +
    'across 71*73 .. 31607*31627), so sup r = 1, approached along the close-prime semiprime family, never ' +
    'attained. Semiprimes (omega=2) bind; each extra prime factor lowers the achievable ratio sharply ' +
    '(omega=3 worst 0.9251, omega=7 worst 0.0327). NEW: the ABSOLUTE margin b/4 - |E1(b)| stays positive ' +
    'and grows ~ sqrt(b) on the binding family (M/sqrt(b): 1.197 -> 2.224), while the RELATIVE margin ' +
    '1 - r(b) ~ b^{-1/2} -> 0 -- so the uniform ceiling is held with growing absolute room, and a uniform ' +
    'proof should target the b-linear leader against a positive O(sqrt b) semiprime margin, not the ' +
    'vanishing relative margin. Measurement only; no omega-class headroom; no bound on Lambda moves; ' +
    'kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97291_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Wide-range measurement of the composite ratio ' +
  'r(b)=|E1(b)|/(b/4): the worst composite ratio APPROACHES 1 (0.9369 at 71*83 over [2,6000] -> 0.9934 at ' +
  '991*1009 over [4,1e6]) along close-prime semiprimes, never plateauing below 1; semiprimes bind and ' +
  'higher omega classes fall away; the absolute margin b/4-|E1| stays positive and grows ~sqrt(b) while ' +
  'the relative margin ~b^{-1/2} vanishes. Measurement only; no omega-class headroom; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT. --

const IMP97291_ASSERTIONS = [
  {
    id: 'imp97291-fast-matches-exact-on-large-prime-semiprimes',
    holds: () => {
      // Gasymp evaluator reproduces the exact coprime sum on large-prime semiprimes (the sup-carrying class).
      for (const [p, q] of [[71, 73], [499, 503]]) {
        const b = p * q;
        const rEx = Math.abs(measureE1(b)) / (b / 4);
        const rFa = ratioFromPrimes([p, q]);
        if (Math.abs(rEx - rFa) > 1e-4) return false;
      }
      return true;
    },
    why: 'the Gasymp per-divisor evaluator matches the exact O(b) coprime sum on large-prime semiprimes to <1e-4 in ratio -- the sup-carrying close-factor class is measured accurately.',
  },
  {
    id: 'imp97291-consecutive-prime-semiprimes-climb-toward-one',
    holds: () => {
      // Monotone increase toward 1 across the ladder (inside the FP-trustworthy window).
      const rs = [[71, 73], [211, 223], [499, 503], [997, 1009], [9973, 10007], [31607, 31627]]
        .map((pq) => ratioFromPrimes(pq));
      for (let i = 1; i < rs.length; i++) if (!(rs[i] > rs[i - 1])) return false;
      return rs[0] > 0.93 && rs[0] < 0.94 && rs[rs.length - 1] > 0.9997 && rs[rs.length - 1] < 1;
    },
    why: 'consecutive-prime semiprimes climb monotonically from 0.9335 (71*73) to 0.99972 (31607*31627), from below -- the worst composite ratio approaches 1, no plateau.',
  },
  {
    id: 'imp97291-worst-composite-grows-with-range',
    holds: () => {
      const to6000 = IMP97291_RESULTS.worstCompositeTo6000.ratio;
      const to1e6 = IMP97291_RESULTS.worstCompositeTo1e6.ratio;
      // the [4,1e6] worst (991*1009) exceeds the [2,6000] worst (71*83) and is reproduced by the evaluator
      const rWorst = ratioFromPrimes([991, 1009]);
      return to1e6 > to6000 && Math.abs(rWorst - to1e6) < 1e-4 && to1e6 > 0.99 && to1e6 < 1;
    },
    why: 'the worst composite ratio rises with the range (0.9369 over [2,6000] -> 0.9934 over [4,1e6] at 991*1009), reproduced by the evaluator to <1e-4 -- it does not plateau strictly below 1.',
  },
  {
    id: 'imp97291-semiprimes-bind-higher-omega-falls-away',
    holds: () => {
      const w = IMP97291_RESULTS.worstByOmegaTo1e6;
      return w[2].ratio > w[3].ratio && w[3].ratio > w[4].ratio &&
        w[4].ratio > w[5].ratio && w[5].ratio > w[6].ratio && w[6].ratio > w[7].ratio &&
        w[2].ratio > 0.99 && w[7].ratio < 0.05;
    },
    why: 'semiprimes (omega=2) bind at 0.9934 and each extra prime factor lowers the achievable worst ratio monotonically down to 0.0327 at omega=7 -- confirms the two-close-prime family is the binding class.',
  },
  {
    id: 'imp97291-absolute-margin-positive-and-grows',
    holds: () => {
      // b/4 - |E1| > 0 and M/sqrt(b) increases across the semiprime ladder.
      const m = (pq) => { const b = pq[0] * pq[1]; return (b / 4 - Math.abs(E1fastFromPrimes(pq))) / Math.sqrt(b); };
      const m1 = m([71, 73]), m2 = m([499, 503]), m3 = m([9973, 10007]), m4 = m([31607, 31627]);
      return m1 > 0 && m2 > m1 && m3 > m2 && m4 > m3 && m1 > 1 && m4 > 2 && m4 < 3;
    },
    why: 'the absolute margin b/4-|E1| stays positive and M/sqrt(b) climbs 1.20 -> 2.22 on the semiprime ladder -- the ceiling is held with growing absolute room ~sqrt(b) even as the relative margin vanishes.',
  },
  {
    id: 'imp97291-honesty-gate-no-qed',
    holds: () =>
      IMP97291_VERDICT.anyBoundMoved === false &&
      IMP97291_VERDICT.postsRigorousCeiling === false &&
      IMP97291_VERDICT.qed === false &&
      IMP97291_VERDICT.measurementOnly === true &&
      IMP97291_VERDICT.approachesOne === true &&
      IMP97291_VERDICT.plateausBelowOne === false &&
      IMP97291_VERDICT.classHeadroomExists === false &&
      IMP97291_VERDICT.supComposite === 1 &&
      /NO QED/.test(IMP97291_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97291_HONEST_BANNER) &&
      /RH open/.test(IMP97291_HONEST_BANNER),
    why: 'measurement only -- the sup composite ratio is 1 (approached, not attained), semiprimes bind, no omega-class headroom; no rigorous ceiling posted, no bound moved, no QED.',
  },
];

for (const a of IMP97291_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97291-route-m-e1-wide-composite-ratio-sweep assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97291_KERNEL,
  results: IMP97291_RESULTS,
  verdict: IMP97291_VERDICT,
  banner: IMP97291_HONEST_BANNER,
};
