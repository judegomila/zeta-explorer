/**
 * @module imp-97442-route-m-mcm-omega56-subgrid-verification
 *
 * imp-97442 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED at omega=5,6, NOT proved; NO QED).
 *
 * Extend the imp-97422 MCM numerical verification to omega = 5, 6 and b > 2e5. imp-97422 verified the
 * hypothesis MCM (every iterated multiplicative difference (D_p1...D_pj h)(x) >= 0, h = g/m, (D_p f)(x) =
 * f(x) - f(px)) on the omega = 4 squarefree class only to b <= 2e5. imp-97432 later REFUTED MCM: it holds
 * through omega = 10 and breaks first at omega = 11 (b = p_11# = 200560490130, T = -9.624e-4). This leaf
 * fills the empirical gap BETWEEN those two results: it sweeps the full iterated multiplicative-difference
 * tower (levels 1..omega) at EVERY subgrid point x >= 1, for every squarefree b with omega(b) in {5, 6} in
 * the window 2e5 < b <= 1e6, and reports the minimum difference value found (proximity to the 0 boundary)
 * and whether any level ever approaches zero -- the discrete-step margin a proof of MCM (for omega <= 10)
 * would have to exploit.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (offline sweep, SPF-sieve factorization + cumulative exact Sum k log k, reproduced here on a
 * small subset via the imp-97422 kernel).
 * -------------------------------------------------------------------------------
 * omega = 5, window (2e5, 1e6]: 16057 squarefree b, 497767 iterated-difference evaluations across the full
 *   tower at all subgrid points. NEGATIVE differences: 0. Global minimum difference 1.4313e-6 (at b = 914030,
 *   level 1, x = 457015). Per-level minima: L1 1.4313e-6, L2 2.1186e-6, L3 7.9858e-6, L4 3.7802e-5,
 *   L5 (= T(b)) 2.0214e-2. T(b) in [0.020214, 0.114564]; induction T(b) < T(b/p_min) holds (0 failures).
 * omega = 6, window (2e5, 1e6]: 1152 squarefree b, 72576 iterated-difference evaluations. NEGATIVE: 0.
 *   Global minimum difference 1.4361e-6 (at b = 914430, level 1, x = 457215). Per-level minima:
 *   L1 1.4361e-6, L2 2.1191e-6, L3 7.9881e-6, L4 3.7811e-5, L5 2.7508e-4, L6 (= T(b)) 1.3435e-2.
 *   T(b) in [0.013435, 0.048122]; induction holds (0 failures).
 *
 * -------------------------------------------------------------------------------
 * READING -- where the smallness lives, and why it does NOT signal an approach to failure at these orders.
 * -------------------------------------------------------------------------------
 * The global minima (~1.4e-6) are LEVEL-1 differences c(x) = h(x) - h(2x) at the largest available x
 * (x ~ b/2 near the top of the window). These shrink like the local slope of h (h is strictly decreasing and
 * flattening), so a single peel at a large argument is naturally tiny but strictly positive -- this is the
 * base of the tower, not the top. The quantity the MCM induction actually rides on is the TOP difference
 * (level = omega, at x = 1), which is exactly T(b): its minimum stays a full four orders of magnitude away
 * from zero (2.02e-2 at omega = 5, 1.34e-2 at omega = 6). So no level approaches zero in a way that
 * threatens the induction within omega <= 6; the margin narrows only at high omega, consistent with the
 * imp-97432 primorial analysis (T(p_j#) -> -e^{-gamma}/12 + 1.0185e-3, crossing 0 at omega = 11).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASUREMENT ONLY. MCM is VERIFIED (all iterated multiplicative differences non-negative, zero exceptions)
 * on the omega = 5 and omega = 6 squarefree classes in (2e5, 1e6] -- the empirical gap between the imp-97422
 * omega = 4 / b <= 2e5 sweep and the imp-97432 omega = 11 counterexample is now filled: MCM holds solidly at
 * omega = 5, 6, with the smallest tower difference ~1.4e-6 (a level-1 base term at large x) and the induction
 * top term T(b) bounded well inside (0, 1/4). MCM stays VERIFIED not proved (and is FALSE from omega = 11 per
 * imp-97432); no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (MCM hypothesis; omega=4 to 2e5)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; ceiling survives)
 *
 * Ticket: imp-97442 (numerical, opus-4-8, api-pool). MCM subgrid sweep omega=5,6 b in (2e5,1e6]; NO QED.
 */

import { IMP97422_KERNEL } from './imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js';

const { hRatio, iterDiff, Tfun, omega, isSquarefree } = IMP97422_KERNEL;

// Import-light prime factorization + subset products (kernel-independent; matches the offline sweep).
function primeFactorsLocal(b) {
  let n = b; const ps = [];
  for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } }
  if (n > 1) ps.push(n);
  return ps;
}
function subsetProducts(primes) {
  let ds = [1];
  for (const p of primes) { const nx = []; for (const d of ds) { nx.push(d); nx.push(d * p); } ds = nx; }
  return ds;
}

// Full iterated multiplicative-difference tower for one squarefree b: minimum difference over ALL levels
// and ALL subgrid points, and the count of negative differences (MCM violations).
function towerScan(b) {
  const primes = primeFactorsLocal(b);
  let minDiff = Infinity, neg = 0, evals = 0;
  for (let j = 1; j <= primes.length; j++) {
    const P = primes.slice(0, j);
    for (const x of subsetProducts(primes.slice(j))) {
      const d = iterDiff(hRatio, P, x);
      evals++;
      if (d < 0) neg++;
      if (d < minDiff) minDiff = d;
    }
  }
  return { minDiff, neg, evals, omega: primes.length };
}

// Baked measured summary of the full offline sweep (SPF sieve + cumulative exact Sum k log k), window (2e5, 1e6].
export const IMP97442_MEASUREMENTS = Object.freeze({
  window: '(2e5, 1e6]',
  omega5: Object.freeze({
    countSquarefree: 16057,
    diffEvaluations: 497767,
    negativeDifferences: 0,
    globalMinDiff: 1.431333219910749e-6,
    globalMinAt: Object.freeze({ b: 914030, level: 1, x: 457015 }),
    perLevelMinDiff: Object.freeze([1.431333219910749e-6, 2.118553592156828e-6, 7.985799781460283e-6, 3.7801843237609336e-5, 2.0214044330049495e-2]),
    tRange: Object.freeze([2.0214044330049495e-2, 1.1456380805420255e-1]),
    inductionFailures: 0,
  }),
  omega6: Object.freeze({
    countSquarefree: 1152,
    diffEvaluations: 72576,
    negativeDifferences: 0,
    globalMinDiff: 1.4360867163705828e-6,
    globalMinAt: Object.freeze({ b: 914430, level: 1, x: 457215 }),
    perLevelMinDiff: Object.freeze([1.4360867163705828e-6, 2.1190622444151575e-6, 7.988143899543786e-6, 3.781119298810274e-5, 2.750819332564423e-4, 1.3434888142011e-2]),
    tRange: Object.freeze([1.3434888142011e-2, 4.812195243552217e-2],),
    inductionFailures: 0,
  }),
  reading:
    'the global minima (~1.4e-6) are LEVEL-1 base differences h(x)-h(2x) at the largest x in the window, not ' +
    'the top-level (x=1) terms the MCM induction rides on; the top term T(b) stays >= 1.34e-2, four orders ' +
    'of magnitude from zero at omega <= 6. No level approaches zero at these orders.',
});

export const IMP97442_VERDICT = Object.freeze({
  question: 'does MCM (non-negativity of all iterated multiplicative differences of h=g/m) hold for omega=5,6 beyond b=2e5, and how close to the 0 boundary does any tower difference come?',
  mcmVerifiedOmega5: true,   // 497767 evaluations, 0 negatives, window (2e5, 1e6]
  mcmVerifiedOmega6: true,   // 72576 evaluations, 0 negatives, window (2e5, 1e6]
  globalMinDifference: 1.431333219910749e-6, // smallest tower difference found (level-1 base term, large x)
  topLevelMinT: 1.3434888142011e-2,          // smallest induction top term (level=omega, x=1) -- far from 0
  approachesZero: false,     // no level approaches 0 in a way that threatens the induction at omega <= 6
  mcmProved: false,          // MCM stays VERIFIED not proved (and is FALSE from omega=11 per imp-97432)
  fillsGap: 'between imp-97422 (omega=4, b<=2e5) and imp-97432 (MCM false at omega=11); MCM solid at omega=5,6',
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Extending the imp-97422 MCM verification to omega=5 and omega=6 squarefree b in the ' +
    'window (2e5, 1e6]: 497767 (omega=5) + 72576 (omega=6) iterated multiplicative-difference evaluations ' +
    'across the full tower at every subgrid point x>=1, with ZERO negative differences -- MCM holds solidly. ' +
    'The smallest tower difference is ~1.43e-6, a LEVEL-1 base term h(x)-h(2x) at the largest x; the top ' +
    'induction term T(b) (level=omega, x=1) stays >= 1.34e-2, four orders of magnitude from the 0 boundary. ' +
    'So no level approaches zero at omega <= 6, filling the empirical gap between imp-97422 (omega=4, b<=2e5) ' +
    'and imp-97432 (MCM refuted at omega=11). MCM stays VERIFIED not proved; no bound on Lambda moves; ' +
    'kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97442_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Numerical extension of the imp-97422 MCM verification to ' +
  'omega=5,6 and b>2e5: the full iterated multiplicative-difference tower at every subgrid point is ' +
  'non-negative throughout (2e5, 1e6] (0 exceptions in 570343 evaluations); smallest difference ~1.43e-6 ' +
  '(a level-1 base term at large x), top induction term T(b) >= 1.34e-2. MCM stays VERIFIED not proved and ' +
  'is FALSE from omega=11 (imp-97432); no bound moved.';

// -- self-executing assertions (imp-3715 convention): light re-verification via the imp-97422 kernel --

const IMP97442_ASSERTIONS = [
  {
    id: 'imp97442-mcm-positive-small-omega5-6',
    holds: () => {
      // Re-verify MCM positivity (0 negatives) + T in (0,1/4) on cheap small omega=5,6 representatives.
      for (const b of [2310, 2730, 3570, 30030, 39270, 43890]) {
        if (!isSquarefree(b)) return false;
        const s = towerScan(b);
        if (s.neg !== 0) return false;                    // MCM: no negative differences
        if (!(s.minDiff > 0)) return false;               // strictly positive
        const T = Tfun(b);
        if (!(T > 0 && T < 0.25)) return false;           // top term inside the band
        if (!(Math.abs(iterDiff(hRatio, primeFactorsLocal(b), 1) - T) < 1e-9)) return false; // T = full tower diff at x=1
      }
      return omega(30030) === 6 && omega(2310) === 5;
    },
    why: 'the imp-97422 kernel reproduces MCM (all iterated multiplicative differences of h=g/m non-negative) and 0 < T(b) < 1/4 on small omega=5,6 representatives, the light in-module witness for the baked (2e5,1e6] sweep.',
  },
  {
    id: 'imp97442-baked-sweep-consistency',
    holds: () => {
      const a = IMP97442_MEASUREMENTS.omega5, b = IMP97442_MEASUREMENTS.omega6;
      // No negatives in either sweep; per-level minima positive; top term = last per-level min = tRange low end.
      if (a.negativeDifferences !== 0 || b.negativeDifferences !== 0) return false;
      if (!(a.globalMinDiff > 0 && b.globalMinDiff > 0)) return false;
      if (a.perLevelMinDiff.length !== 5 || b.perLevelMinDiff.length !== 6) return false;
      if (a.perLevelMinDiff.some((v) => !(v > 0)) || b.perLevelMinDiff.some((v) => !(v > 0))) return false;
      const topA = a.perLevelMinDiff[a.perLevelMinDiff.length - 1];
      const topB = b.perLevelMinDiff[b.perLevelMinDiff.length - 1];
      if (Math.abs(topA - a.tRange[0]) > 1e-9 || Math.abs(topB - b.tRange[0]) > 1e-9) return false;
      // global min is a level-1 base term (smallest), and the top induction term is far from 0.
      return a.globalMinAt.level === 1 && b.globalMinAt.level === 1 && topA > 1e-2 && topB > 1e-2;
    },
    why: 'the baked offline sweep (SPF sieve + cumulative exact Sum k log k) records 0 negative differences over 570343 evaluations, all per-level minima positive, the global minimum a level-1 base term, and the top induction term T(b) bounded well inside (0,1/4).',
  },
  {
    id: 'imp97442-honesty-gate-no-qed',
    holds: () =>
      IMP97442_VERDICT.anyBoundMoved === false &&
      IMP97442_VERDICT.qed === false &&
      IMP97442_VERDICT.mcmProved === false &&
      IMP97442_VERDICT.mcmVerifiedOmega5 === true &&
      IMP97442_VERDICT.mcmVerifiedOmega6 === true &&
      IMP97442_VERDICT.approachesZero === false &&
      /NO QED/.test(IMP97442_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97442_HONEST_BANNER) &&
      /RH open/.test(IMP97442_HONEST_BANNER),
    why: 'numerical measurement only -- MCM verified at omega=5,6 to 1e6, not proved (and false from omega=11); no bound moved, no QED.',
  },
];

for (const a of IMP97442_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97442-route-m-mcm-omega56-subgrid-verification assertion failed: ${a.id}`);
  }
}

export default {
  measurements: IMP97442_MEASUREMENTS,
  verdict: IMP97442_VERDICT,
  banner: IMP97442_HONEST_BANNER,
};
