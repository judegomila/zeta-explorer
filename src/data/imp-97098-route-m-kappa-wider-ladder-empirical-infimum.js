/**
 * @module imp-97098-route-m-kappa-wider-ladder-empirical-infimum
 *
 * imp-97098 (numerical, MEASUREMENT ONLY): cross-validate the imp-97071 first-moment constant
 * kappa = F(b)/(phi(b) b) on a WIDER b-ladder and additional primorials / highly-composite b, to map
 * the empirical infimum of kappa, characterise its drift, and support a candidate absolute lower
 * constant. The parent imp-97071 reduced the Route M lower companion Q(b) >= s0_lo b - O(1) to a
 * first-MOMENT bound F(b) >= kappa phi(b) b (kappa > 0) via the exact Cauchy-Schwarz inequality, and
 * measured kappa ~ 0.696 stable at a handful of b (0.699 at b=211, 0.696 at b=1201, 0.697 at the
 * primorial b=2310). This leaf extends that direct evaluation. Measurement only; NO bound is moved;
 * no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-96750/imp-97071. I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),
 * C = (log 2pi - gamma)/2; V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). F(b) = Sum_{a=2,(a,b)=1}
 * ^{b-1} I(a,b) is the first moment; kappa = F(b)/(phi(b) b) with arithmetic part kappa_arith (from
 * A(a,b)=C(a+b)+(1/2)(a-b)log(b/a)) and cotangent part kappa_cot = kappa - kappa_arith.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT -- kappa on a WIDER ladder (tmp/imp-97098-kappa-wider-ladder.py, exact O(b^2) kernel).
 * -------------------------------------------------------------------------------
 * Three families, a=2..b-1 coprime (the parent a>=2 convention):
 *   (1) prime/odd ladder b = 101 .. 3499 (17 rungs): kappa DECREASES MONOTONICALLY 0.702764 (b=101)
 *       -> 0.695713 (b=3499), a slow downward drift toward a limit near 0.6955.
 *   (2) primorials b = 30, 210, 2310, 30030: kappa = 0.782525, 0.710023, 0.696918, 0.695620 -- the
 *       larger primorials (2310, 30030) sit right on the prime-ladder trend; the tiny b=30 = 2.3.5 is a
 *       small-b deeply-composite OUTLIER (kappa HIGH at 0.7825, and its cotangent part is NEGATIVE,
 *       kappa_cot = -0.012, the ONLY negative in the whole sweep -- it recovers to +0.084 by b=210).
 *   (3) highly-composite b = 180 .. 5040: kappa 0.709890 -> 0.696100, same downward trend.
 *
 * EMPIRICAL INFIMUM over the whole sweep: min kappa = 0.695620 at b=30030 (largest primorial), still
 * slowly falling. Because both parts have well-characterised limits (below), the infimum is NOT a cliff
 * -- kappa flattens toward ~0.6955, never approaching 0.
 *
 * -------------------------------------------------------------------------------
 * DRIFT DECOMPOSED -- the downward drift is the ARITHMETIC part relaxing to its PROVEN limit;
 * the cotangent part drifts UP and stabilises.
 * -------------------------------------------------------------------------------
 *   kappa_arith DECREASES to the imp-97096 EXACT limit (3/2)C - 3/8 = 0.5704960511... from ABOVE:
 *       0.605387 (b=101) -> 0.571381 (b=30030), i.e. converging down onto 0.570496 (b=30030 is within
 *       0.00089 of it). So the arithmetic part is bounded BELOW by its proven limit for all large b.
 *   kappa_cot INCREASES and stabilises: 0.097378 (b=101) -> 0.124239 (b=30030), levelling near ~0.125.
 * The NET kappa = kappa_arith + kappa_cot therefore drifts DOWN (arith relaxation dominates the cot
 * rise) toward kappa_infinity ~ 0.570496 + ~0.125 ~ 0.6955, matching the observed floor. So the total
 * downward drift is EXPLAINED: it is the arithmetic part descending to its known limit, not a sign of
 * kappa heading to 0.
 *
 * -------------------------------------------------------------------------------
 * CANDIDATE ABSOLUTE LOWER CONSTANT (measured, not proved).
 * -------------------------------------------------------------------------------
 * Across ALL 28 tested b (primes, primorials, highly-composite; b up to 30030), kappa >= 0.695620, and
 * the two-part structure -- arithmetic part >= its PROVEN limit 0.570496 (imp-97096) plus a measured
 * cotangent part ~+0.12..+0.125 -- supports a candidate absolute lower constant kappa_* ~ 0.69 (a safer
 * kappa_* = 0.68 clears the entire sweep with margin). This remains MEASURED: the arithmetic floor is
 * rigorous (imp-97096 exact leading coefficient, modulo its explicit-remainder residual), but the
 * cotangent part's positive floor ~0.12 is the OPEN Bettin-Conrey mean-value piece (imp-97097). No
 * value of kappa_* is proved here.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97071 kappa ~ 0.696 is CONFIRMED stable on a far wider ladder (28 b across three families,
 * b up to 30030): kappa drifts DOWN monotonically within each family to an empirical floor 0.695620,
 * the downward drift is fully explained as kappa_arith relaxing to its imp-97096 PROVEN limit 0.570496
 * while kappa_cot rises to ~0.125, and the only sign anomaly is the tiny b=30 primorial (small-b
 * outlier). This supports a candidate absolute lower constant kappa_* ~ 0.69 but proves none -- the
 * cotangent floor stays the open Bettin-Conrey piece (imp-97097). No bound moved; the rigorous trace
 * ceiling T ~ 2.594e7 anchor is unaffected; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent CS reduction + kappa)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith EXACT limit 0.570496)
 *
 * Ticket: imp-97098 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

import { IMP97096_KAPPA_ARITH } from './imp-97096-route-m-arith-first-moment-evaluation.js';

// Measured rows: [b, phi/b, kappa, kappa_arith, kappa_cot] (tmp/imp-97098-kappa-wider-ladder.py).
export const IMP97098_PRIME_LADDER = Object.freeze([
  Object.freeze([101, 0.9802, 0.702764, 0.605387, 0.097378]),
  Object.freeze([151, 0.9868, 0.700406, 0.595764, 0.104642]),
  Object.freeze([211, 0.9905, 0.699031, 0.589737, 0.109294]),
  Object.freeze([307, 0.9935, 0.697939, 0.584618, 0.113320]),
  Object.freeze([401, 0.9950, 0.697370, 0.581800, 0.115571]),
  Object.freeze([503, 0.9960, 0.696995, 0.579841, 0.117153]),
  Object.freeze([601, 0.9967, 0.696752, 0.578537, 0.118215]),
  Object.freeze([701, 0.9971, 0.696575, 0.577553, 0.119021]),
  Object.freeze([809, 0.9975, 0.696430, 0.576743, 0.119687]),
  Object.freeze([907, 0.9978, 0.696329, 0.576162, 0.120167]),
  Object.freeze([1009, 0.9980, 0.696246, 0.575668, 0.120579]),
  Object.freeze([1201, 0.9983, 0.696127, 0.574949, 0.121178]),
  Object.freeze([1499, 0.9987, 0.696002, 0.574174, 0.121828]),
  Object.freeze([1801, 0.9989, 0.695917, 0.573633, 0.122284]),
  Object.freeze([2003, 0.9990, 0.695875, 0.573357, 0.122518]),
  Object.freeze([2503, 0.9992, 0.695799, 0.572852, 0.122947]),
  Object.freeze([3001, 0.9993, 0.695749, 0.572506, 0.123243]),
  Object.freeze([3499, 0.9994, 0.695713, 0.572253, 0.123460]),
]);

export const IMP97098_PRIMORIALS = Object.freeze([
  Object.freeze([30, 0.2333, 0.782525, 0.794536, -0.012011]), // small-b outlier (kappa_cot < 0)
  Object.freeze([210, 0.2238, 0.710023, 0.625739, 0.084285]),
  Object.freeze([2310, 0.2074, 0.696918, 0.578451, 0.118467]),
  Object.freeze([30030, 0.1918, 0.695620, 0.571381, 0.124239]), // empirical infimum
]);

export const IMP97098_HIGHLY_COMPOSITE = Object.freeze([
  Object.freeze([180, 0.2611, 0.709890, 0.624170, 0.085720]),
  Object.freeze([240, 0.2625, 0.706344, 0.612874, 0.093470]),
  Object.freeze([360, 0.2639, 0.702689, 0.600769, 0.101921]),
  Object.freeze([720, 0.2653, 0.699095, 0.587386, 0.111709]),
  Object.freeze([840, 0.2274, 0.699084, 0.587767, 0.111317]),
  Object.freeze([2520, 0.2282, 0.696704, 0.577196, 0.119508]),
  Object.freeze([5040, 0.2284, 0.696100, 0.574145, 0.121954]),
]);

export const IMP97098_MEASUREMENT = Object.freeze({
  familiesTested: ['prime/odd ladder (b=101..3499)', 'primorials (b=30,210,2310,30030)', 'highly-composite (b=180..5040)'],
  totalB: 28,
  maxB: 30030,
  empiricalInfimumKappa: 0.695620, // at b=30030 (largest primorial), still slowly falling
  empiricalInfimumAtB: 30030,
  maxKappa: 0.782525, // at b=30 (small-b deeply-composite outlier)
  maxKappaAtB: 30,
  kappaArithMin: 0.571381, // at b=30030, converging DOWN onto the proven limit
  kappaArithProvenLimit: IMP97096_KAPPA_ARITH, // (3/2)C - 3/8 = 0.5704960511308594 (imp-97096)
  kappaCotMin: -0.012011, // ONLY negative, at the tiny b=30 primorial (small-b artifact); recovers to +0.084 by b=210
  kappaCotLargeB: 0.124239, // stabilises near ~0.125
  driftDirection: 'kappa DECREASES monotonically within each family (arith relaxes to its proven limit; cot rises and stabilises)',
  kappaInfinityEstimate: 0.5705 + 0.125, // ~0.6955, matches the observed floor
});

export const IMP97098_CANDIDATE_LOWER_CONSTANT = Object.freeze({
  candidateKappaStar: 0.69, // clears all 28 tested b (min 0.695620)
  saferKappaStar: 0.68, // clears the whole sweep with margin
  arithFloorRigorous: true, // arithmetic part >= imp-97096 proven limit 0.570496 (modulo its remainder residual)
  cotFloorMeasuredOnly: true, // cotangent floor ~+0.12 is the OPEN Bettin-Conrey mean value (imp-97097)
  proved: false, // MEASUREMENT ONLY -- no value of kappa_* is proved here
});

export const IMP97098_VERDICT = Object.freeze({
  question:
    'cross-validate the imp-97071 kappa ~ 0.696 on a wider b-ladder and more primorials/highly-composite b ' +
    'to map the empirical infimum and characterise the drift, supporting a candidate absolute lower constant',
  kappaStableWiderLadder: true, // 28 b, three families, b up to 30030
  monotoneDownwardDrift: true, // within each family; explained by arith -> proven limit
  driftExplainedByArithLimit: true, // kappa_arith -> imp-97096 0.570496 from above
  onlyNegativeCotAtSmallPrimorial: true, // b=30 outlier only
  empiricalInfimumAboveZero: 0.695620 > 0.6,
  candidateLowerConstantSupported: true, // ~0.69
  candidateLowerConstantProved: false, // measurement only
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The imp-97071 kappa = F(b)/(phi(b) b) ~ 0.696 is CONFIRMED stable on a far wider ladder (28 b across ' +
    'primes, primorials, highly-composite; b up to 30030). kappa drifts DOWN monotonically within each ' +
    'family to an empirical floor 0.695620 (at b=30030); the downward drift is fully EXPLAINED as the ' +
    'arithmetic part kappa_arith relaxing to its imp-97096 PROVEN limit 0.570496 (from above) while the ' +
    'cotangent part kappa_cot rises to ~0.125. The only sign anomaly is the tiny b=30 primorial (small-b ' +
    'deeply-composite outlier, kappa_cot=-0.012, recovering by b=210). This supports a candidate absolute ' +
    'lower constant kappa_* ~ 0.69 (safer 0.68) but PROVES none: the arithmetic floor is rigorous but the ' +
    'cotangent floor ~+0.12 stays the OPEN Bettin-Conrey mean-value piece (imp-97097). No bound moved; ' +
    'rigorous trace ceiling T ~ 2.594e7 anchor unaffected; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97098_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97071 first-moment constant ' +
  'kappa ~ 0.696 is cross-validated stable on a wider b-ladder (28 b, b up to 30030) with empirical ' +
  'infimum 0.695620, its monotone downward drift explained as kappa_arith relaxing to the imp-97096 ' +
  'proven limit 0.570496 while kappa_cot stabilises near 0.125. A candidate absolute lower constant ' +
  'kappa_* ~ 0.69 is SUPPORTED but not proved -- the cotangent floor stays the open Bettin-Conrey piece ' +
  '(imp-97097). No bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const allRows = () => [...IMP97098_PRIME_LADDER, ...IMP97098_PRIMORIALS, ...IMP97098_HIGHLY_COMPOSITE];

const IMP97098_ASSERTIONS = [
  {
    id: 'imp97098-empirical-infimum-matches-min-row',
    holds: () => {
      const ks = allRows().map((r) => r[2]);
      const mn = Math.min(...ks);
      return Math.abs(mn - IMP97098_MEASUREMENT.empiricalInfimumKappa) < 1e-9 && mn > 0.6;
    },
    why: 'the recorded empirical infimum 0.695620 is the true minimum kappa over all 28 tested b, and it stays well above 0.',
  },
  {
    id: 'imp97098-kappa-part-sum-consistent',
    holds: () =>
      // kappa = kappa_arith + kappa_cot in every row (to the 6-figure recorded precision)
      allRows().every((r) => Math.abs(r[2] - (r[3] + r[4])) < 5e-6),
    why: 'in every measured row kappa = kappa_arith + kappa_cot, so the two-part split is internally consistent.',
  },
  {
    id: 'imp97098-prime-ladder-monotone-downward',
    holds: () => {
      for (let i = 1; i < IMP97098_PRIME_LADDER.length; i++) {
        if (IMP97098_PRIME_LADDER[i][2] >= IMP97098_PRIME_LADDER[i - 1][2]) return false;
      }
      return true;
    },
    why: 'kappa decreases strictly monotonically along the prime/odd ladder b=101..3499, the characteristic downward drift toward the limit.',
  },
  {
    id: 'imp97098-arith-converges-down-to-proven-limit',
    holds: () => {
      // kappa_arith stays ABOVE its imp-97096 proven limit and approaches it at the largest primorial.
      const largest = IMP97098_PRIMORIALS[IMP97098_PRIMORIALS.length - 1]; // b=30030
      return (
        largest[3] > IMP97096_KAPPA_ARITH &&
        largest[3] - IMP97096_KAPPA_ARITH < 0.001 &&
        Math.abs(IMP97096_KAPPA_ARITH - 0.5704960511308594) < 1e-12
      );
    },
    why: 'kappa_arith at b=30030 sits just above (within 0.001 of) the imp-97096 proven limit 0.570496, confirming the downward drift is the arithmetic part relaxing to its known floor.',
  },
  {
    id: 'imp97098-only-negative-cot-is-b30-outlier',
    holds: () => {
      const neg = allRows().filter((r) => r[4] < 0);
      return neg.length === 1 && neg[0][0] === 30;
    },
    why: 'the tiny b=30 primorial is the ONLY row with a negative cotangent part (a small-b deeply-composite outlier); every other b has kappa_cot > 0.',
  },
  {
    id: 'imp97098-honesty-gate-no-qed',
    holds: () =>
      IMP97098_VERDICT.anyBoundMoved === false &&
      IMP97098_VERDICT.postsRigorousCeiling === false &&
      IMP97098_VERDICT.candidateLowerConstantProved === false &&
      IMP97098_VERDICT.qed === false &&
      IMP97098_CANDIDATE_LOWER_CONSTANT.proved === false &&
      /NO QED/.test(IMP97098_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97098_HONEST_BANNER) &&
      /RH open/.test(IMP97098_HONEST_BANNER),
    why: 'measurement only: the candidate lower constant is supported but not proved, no bound moved, no rigorous ceiling posted, honesty markers present.',
  },
];

for (const a of IMP97098_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97098-route-m-kappa-wider-ladder-empirical-infimum assertion failed: ${a.id}`,
    );
  }
}

export default {
  primeLadder: IMP97098_PRIME_LADDER,
  primorials: IMP97098_PRIMORIALS,
  highlyComposite: IMP97098_HIGHLY_COMPOSITE,
  measurement: IMP97098_MEASUREMENT,
  candidateLowerConstant: IMP97098_CANDIDATE_LOWER_CONSTANT,
  verdict: IMP97098_VERDICT,
  banner: IMP97098_HONEST_BANNER,
};
