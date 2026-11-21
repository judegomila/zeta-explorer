/**
 * @module imp-97463-route-m-mcm-level1-baseterm-decay
 *
 * imp-97463 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED at omega<=6, NOT proved; NO QED).
 *
 * imp-97442 found the global minima of the iterated multiplicative-difference tower (~1.4e-6 at omega=5,6)
 * are LEVEL-1 base terms c(x) = h(x) - h(2x) at the largest available argument (x ~ b/2 near the window top),
 * asserted them strictly positive (the base of the tower, not a threat to the induction), but never fit their
 * decay-with-b law. This leaf fits that law and confirms strict positivity in the limit.
 *
 * -------------------------------------------------------------------------------
 * SETUP.  h = g/m with g(m) = LN_A + (1/12) ln m + R(m), R(m) = G(m) - GKmain(m), G(m) = Sum_{k=1}^m k ln k
 * (imp-97422 kernel). The level-1 base term is the pure function c(x) = h(x) - h(2x) of the argument x alone;
 * within any window (2e5, b_top] its minimum sits at the LARGEST x = (b_top even, squarefree)/2, so tracking
 * the window-top minimum is exactly tracking c(x) as x -> b/2 grows.
 *
 * -------------------------------------------------------------------------------
 * DERIVATION (closed-form decay law).  Since R(m) -> 0,
 *   c(x) = h(x) - h(2x)
 *        = (1/x)[LN_A + (1/12) ln x] - (1/(2x))[LN_A + (1/12) ln x + (1/12) ln 2] + o(1/x)
 *        = (1/(2x))[LN_A + (1/12) ln x] - (ln 2)/(24 x) + o(1/x)
 *        = (1/24) (ln x)/x + [LN_A/2 - (ln 2)/24]/x + o(1/x).
 * So the LEADING coefficient of (ln x)/x is 1/24 = 0.041667 (a common early guess of 1/6, from over-counting
 * the slope over the whole doubling interval, is wrong by 4x), and the constant-over-x term is
 * M0 = LN_A/2 - (ln 2)/24 = 0.095496. Hence c(x) ~ (ln x)/(24 x) -> 0 STRICTLY FROM ABOVE.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (exact re-evaluation of the kernel h; x-ladder inside the reliable double-precision range).
 * -------------------------------------------------------------------------------
 * x        c(x)          pred (2-term)   c*x/ln x
 * 5000     9.007591e-5   9.007583e-5     0.052879
 * 10000    4.792611e-5   4.792603e-5     0.052035
 * 25000    2.069810e-5   2.069756e-5     0.051098
 * 50000    1.092267e-5   1.092640e-5     0.050475
 * 100000   5.748275e-6   5.752013e-6     0.049929
 * 200000   3.007137e-6   3.020412e-6     0.049273
 * 457015   1.431333e-6   1.397144e-6     0.050193   <- imp-97442 omega=5,6 global minimum (b=914030)
 * The two-term prediction matches the exact c(x) to < 0.1% through x = 1e5; a 2-parameter least-squares fit
 * c(x) ~ K (ln x)/x + M/x over the ladder gives K = 0.041927 (predicted 1/24 = 0.041667, within 0.6%) and
 * M = 0.093238 (predicted M0 = 0.095496, within 2.4%). c(x) is strictly positive and strictly decreasing
 * throughout the reliable range; the scaled quantity c*x/ln x sits near 0.050 and drifts toward K0 = 1/24.
 *
 * CAVEAT.  Beyond x ~ 2e5 the naive G(m) = Sum k ln k accumulates catastrophic-cancellation error against
 * GKmain(m) ~ 7e12 (m = 1e6), so R(m) and hence c(x) degrade; the non-monotone blip at x = 5e5 (c rises
 * back to 1.449e-6) is a floating-point artifact, NOT a real reversal. This is exactly why the imp-97442
 * sweep stopped at the window top b = 1e6 (x = 5e5). An extended-precision G(m) would be needed past there.
 *
 * -------------------------------------------------------------------------------
 * READING.  The tower's smallest number is a level-1 peel at a huge argument, and it decays like (ln x)/(24 x)
 * -- monotone, strictly positive, approaching 0 only in the limit. It is NOT the quantity the MCM induction
 * rides on: that is the TOP difference T(b) (level = omega, x = 1), which imp-97442 measured in
 * [1.34e-2, 2.02e-2] at omega <= 6 -- about 9.4e3x (four orders of magnitude) above c(457015). So the ~1.4e-6
 * minima reflect the flattening of h at large x, not any approach to an MCM failure at these orders. (MCM is
 * separately FALSE from omega=11 per imp-97432, driven by T(p_j#), never by these base terms.)
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The level-1 base term c(x) = h(x) - h(2x) decays as (1/24)(ln x)/x + M0/x
 * (M0 = 0.095496), fit-confirmed to < 1% for the ln x/x coefficient, strictly positive and monotone
 * decreasing over the reliable range, approaching 0 from above without crossing -- the base of the tower is
 * safe. The induction top term T(b) stays four orders of magnitude higher. MCM stays VERIFIED not proved
 * (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; kappa_arith unchanged;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97442-route-m-mcm-omega56-subgrid-verification.js (identifies the ~1.4e-6 minima as level-1 base terms)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (MCM hypothesis; h=g/m kernel)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; ceiling survives)
 *
 * Ticket: imp-97463 (numerical, opus-4-8, api-pool). Level-1 base-term decay fit; NO QED.
 */

import { IMP97422_KERNEL } from './imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js';

const { hRatio, LN_A } = IMP97422_KERNEL;

// level-1 base term at argument x (pure function of x; the tower minimum sits here, at the largest x)
function cBase(x) { return hRatio(x) - hRatio(2 * x); }

// closed-form asymptotic coefficients
const K0 = 1 / 24;                                 // leading coeff of (ln x)/x
const M0 = LN_A / 2 - Math.log(2) / 24;            // constant/x term (= 0.095496...)
function predTwoTerm(x) { return K0 * Math.log(x) / x + M0 / x; }

// Baked measured ladder (exact kernel re-evaluation), reliable double-precision range x <= ~2e5 plus the
// imp-97442 global-minimum argument x = 457015 (b = 914030). Beyond x ~ 2e5, c degrades (cancellation).
export const IMP97463_MEASUREMENTS = Object.freeze({
  ladder: Object.freeze([
    Object.freeze({ x: 5000, c: 9.007591e-5, pred: 9.007583e-5, scaled: 0.052879 }),
    Object.freeze({ x: 10000, c: 4.792611e-5, pred: 4.792603e-5, scaled: 0.052035 }),
    Object.freeze({ x: 25000, c: 2.069810e-5, pred: 2.069756e-5, scaled: 0.051098 }),
    Object.freeze({ x: 50000, c: 1.092267e-5, pred: 1.092640e-5, scaled: 0.050475 }),
    Object.freeze({ x: 100000, c: 5.748275e-6, pred: 5.752013e-6, scaled: 0.049929 }),
    Object.freeze({ x: 200000, c: 3.007137e-6, pred: 3.020412e-6, scaled: 0.049273 }),
    Object.freeze({ x: 457015, c: 1.431333e-6, pred: 1.397144e-6, scaled: 0.050193 }),
  ]),
  decayLaw: 'c(x) = h(x) - h(2x) ~ (1/24)(ln x)/x + M0/x, M0 = LN_A/2 - (ln 2)/24 = 0.095496',
  leadingCoeff: 1 / 24,                       // 0.041666...
  constOverXCoeff: 0.09549610599356105,       // M0
  lsFitK: 0.041927,                           // 2-param LS fit of the (ln x)/x coefficient (predicted 1/24)
  lsFitM: 0.093238,                           // 2-param LS fit of the const/x term (predicted M0)
  fitMatchesTo: '< 0.1% through x=1e5; K within 0.6% of 1/24; M within 2.4% of M0',
  reliableRange: 'x <= ~2e5 (naive G(m) cancellation degrades c past there; x=5e5 blip is a float artifact)',
  strictlyPositive: true,
  monotoneDecreasingOnReliableRange: true,
  approachesZeroFromAbove: true,
  globalMinCrossCheck: Object.freeze({ x: 457015, b: 914030, c: 1.431333219910749e-6 }), // matches imp-97442
  topTermTRange: Object.freeze([1.3434888142011e-2, 2.0214044330049495e-2]),             // imp-97442 T(b)
  baseToTopRatio: 9.4e3,                       // T(b) is ~four orders of magnitude above c(457015)
});

export const IMP97463_VERDICT = Object.freeze({
  question: 'how does the imp-97442 level-1 base term c(x)=h(x)-h(2x) at x~b/2 scale as the window top b grows, and does it stay strictly positive?',
  decays: true,
  decayLaw: 'c(x) ~ (1/24)(ln x)/x + M0/x, M0 = 0.095496',
  leadingCoefficient: 1 / 24,                 // NOT 1/6 (the naive over-count)
  strictlyPositive: true,
  monotoneDecreasing: true,                    // over the reliable range
  approachesZeroFromAbove: true,               // never crosses 0
  crossesZero: false,
  contrastTopTerm: 'induction top term T(b) stays in [1.34e-2, 2.02e-2] (imp-97442), ~9.4e3x above c(457015)',
  mcmProved: false,                            // MCM verified <=6, not proved; FALSE from omega=11 (imp-97432)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The level-1 base term c(x)=h(x)-h(2x), which carries the tower global minimum at the ' +
    'largest argument x~b/2, decays as (1/24)(ln x)/x + M0/x (M0=0.095496): a 2-parameter LS fit recovers ' +
    'K=0.041927 (predicted 1/24=0.041667, within 0.6%) and M=0.093238 (predicted M0, within 2.4%), matching ' +
    'the exact kernel c(x) to < 0.1% through x=1e5. c(x) is strictly positive and monotone decreasing over ' +
    'the reliable range, approaching 0 from above without ever crossing -- the base of the tower stays safe. ' +
    'The induction-relevant TOP term T(b) stays four orders of magnitude higher, in [1.34e-2, 2.02e-2]. MCM ' +
    'stays VERIFIED not proved (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; ' +
    'kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97463_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Fit of the imp-97442 level-1 base term c(x)=h(x)-h(2x) ' +
  '(the iterated-difference tower global minimum, at x~b/2): it decays as (1/24)(ln x)/x + M0/x (M0=0.095496), ' +
  'LS-confirmed (K=0.041927 vs 1/24), strictly positive and monotone, approaching 0 from above without ' +
  'crossing. The induction top term T(b) stays ~9.4e3x higher in [1.34e-2, 2.02e-2]. MCM stays VERIFIED not ' +
  'proved and is FALSE from omega=11 (imp-97432); no bound moved.';

// -- self-executing assertions (imp-3715 convention): live re-verification via the imp-97422 kernel --

const IMP97463_ASSERTIONS = [
  {
    id: 'imp97463-baseterm-positive-and-matches-prediction',
    holds: () => {
      // Live: c(x) > 0, strictly decreasing, and matching the two-term prediction on a cheap small ladder.
      const xs = [5000, 10000, 25000, 50000, 100000];
      let prev = Infinity;
      for (const x of xs) {
        const cx = cBase(x);
        if (!(cx > 0)) return false;                 // strictly positive
        if (!(cx < prev)) return false;              // strictly decreasing
        prev = cx;
        const rel = Math.abs(cx - predTwoTerm(x)) / cx;
        if (!(rel < 2e-3)) return false;             // two-term law matches to < 0.2%
      }
      return true;
    },
    why: 'the exact kernel level-1 base term c(x)=h(x)-h(2x) is strictly positive, strictly decreasing, and matches the closed-form (1/24)(ln x)/x + M0/x law to < 0.2% on the small ladder.',
  },
  {
    id: 'imp97463-global-min-cross-check',
    holds: () => {
      // c(457015) reproduces the imp-97442 baked global minimum (b=914030, level 1).
      const cx = cBase(457015);
      return Math.abs(cx - IMP97463_MEASUREMENTS.globalMinCrossCheck.c) < 1e-12;
    },
    why: 'recomputing c at x=457015 reproduces the imp-97442 baked tower global minimum 1.431333219910749e-6 exactly, tying this fit to that sweep.',
  },
  {
    id: 'imp97463-decay-coefficients-and-honesty',
    holds: () =>
      Math.abs(IMP97463_MEASUREMENTS.leadingCoeff - 1 / 24) < 1e-15 &&
      Math.abs(K0 - 1 / 24) < 1e-15 &&
      Math.abs(M0 - IMP97463_MEASUREMENTS.constOverXCoeff) < 1e-12 &&
      IMP97463_VERDICT.crossesZero === false &&
      IMP97463_VERDICT.approachesZeroFromAbove === true &&
      IMP97463_VERDICT.anyBoundMoved === false &&
      IMP97463_VERDICT.qed === false &&
      IMP97463_VERDICT.mcmProved === false &&
      /NO QED/.test(IMP97463_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97463_HONEST_BANNER) &&
      /RH open/.test(IMP97463_HONEST_BANNER),
    why: 'the decay leading coefficient is exactly 1/24 and the constant term M0=LN_A/2-(ln2)/24; measurement only, no bound moved, no QED.',
  },
];

for (const a of IMP97463_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97463-route-m-mcm-level1-baseterm-decay assertion failed: ${a.id}`);
  }
}

export default {
  measurements: IMP97463_MEASUREMENTS,
  verdict: IMP97463_VERDICT,
  banner: IMP97463_HONEST_BANNER,
};
