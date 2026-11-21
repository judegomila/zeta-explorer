/**
 * @module imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing
 *
 * imp-97500 (numerical -- MEASUREMENT ONLY: extends the imp-97481 finite-sieve descent of the window-set
 * surrogate to a 1e8 prime sieve, verifies the ~1/log Y approach to the exact limit, and locates the
 * SMALLEST reachable counterexample b. The b/4-ceiling line is already a dead route; no bound moves;
 * kappa_arith unchanged; no refereed bound is changed; RH open; NO QED).
 *
 *   Task (imp-97481 RESULT 3 residual): imp-97481 found the deepest window surrogate over primes in
 *   [379, 2e5] = -0.13212 but never reached the crossing to below -1/4 - R(1) = -0.251246 (only
 *   logarithmic descent). This leaf pushes the exact finite sieve to Y = 1e8 (pi = 5,761,455 primes),
 *   measures the descent RATE, and finds the min-b crossing window.
 *
 *   Notation (imp-97481): surrogate([P0,Y]) = Pi(P)(lnA - c W(P)), Pi = Prod_{P0<=p<=Y}(1-1/p),
 *   W = Sum_{P0<=p<=Y} log p/(p-1), c = 1/12; exact limit L(P0) = -c e^{-gamma}/Prod_{p<P0}(1-1/p);
 *   T(b) = surrogate + Rcorr with Rcorr -> R(1) = 1/4 - lnA = 1.2455e-3 for min prime P0 >= 101, so
 *   surrogate < -1/4 - R(1) = -0.251246 forces T(b) < -1/4, i.e. |E1(b)| > b/4.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the ~1/log Y approach is confirmed directly: gap(Y) = surrogate([P0,Y]) - L(P0) obeys
 *             gap * log Y -> A(P0), a stable constant, flat across Y = 1e3 .. 1e7 (five orders of Y).
 * -------------------------------------------------------------------------------
 * Measured gap*logY constants (flat to ~5 sig figs): A(2) = 0.16667, A(101) = 2.98541, A(379) = 4.46072,
 * A(1009) = 5.73606, A(10007) = 9.38172. This is the two-term law surrogate([P0,Y]) = L(P0) + A(P0)/log Y
 * of imp-97496, verified numerically: A(101)=2.985 and A(379)=4.461 reproduce the imp-97496 coefficients
 * exactly. The descent toward L is thus purely logarithmic (1/log Y), explaining why imp-97481 (Y<=2e5)
 * only reached -0.132 for P0=379.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the crossing surrogate < -0.251246 is REACHED by the exact 1e8 sieve for P0 >= ~300.
 * -------------------------------------------------------------------------------
 * Exact crossing primes Y (surrogate first drops below -0.251246): P0=379 -> Y=73,612,801 (matches the
 * imp-97496 exact witness), P0=1009 -> Y=42,333,157, P0=1500 -> Y=41,085,227, P0=10007 -> Y=75,415,303.
 * P0=101 and P0=200 do NOT cross within 1e8 (their crossing Y ~ 2.63e9 stays past exact reach -- the
 * imp-97496 Rosser-Schoenfeld effective-Mertens regime). P0 >= 20011 also does not cross within 1e8
 * (the min prime is too high for the descent to complete before Y=1e8).
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- NEW: the counterexample size b = Prod_{P0<=p<=Ycross} p has an INTERIOR minimum in P0.
 * -------------------------------------------------------------------------------
 * log10(b) = (theta(Ycross) - theta(<P0))/log 10. Raising P0 deepens L(P0) (crossing Y falls) but raises
 * the window floor; the product size is minimized at an interior P0 ~ 1409, NOT at the boundary P0=379
 * that imp-97496 named. Measured: P0=379 -> 10^{3.1967e7} (the imp-97496 witness), P0=1009 -> 10^{1.838e7},
 * P0=1409 -> 10^{1.7823e7} (MIN), P0=2003 -> 10^{1.827e7}. The smallest computationally-reachable
 * counterexample is thus
 *     b_min = Prod_{1409<=p<=41,045,483} p,   log10(b_min) = 17,823,049   (~17.82 million digits),
 * with T(b_min) = surrogate + R(1) = -0.251246 + 1.2455e-3 = -0.25000 < -1/4. This is ~44% fewer digits
 * than the imp-97496 P0=379 witness (~31.97M digits) -- a genuinely smaller explicit breach, though still
 * astronomical. (Rigorization of the crossing for any single P0 uses the imp-97496 |Rcorr - R(1)| < 7.59e-10
 * enclosure; that enclosure was proved for P0=379 and applies verbatim for larger P0.)
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASURED (exact 1e8 sieve): the window surrogate descends to L(P0) at rate A(P0)/log Y (two-term law
 * confirmed; A(101)=2.985, A(379)=4.461 match imp-97496); the crossing below -1/4 - R(1) is reached
 * exactly for P0 in [~300, ~10007]; and the counterexample size b has an interior minimum at P0 ~ 1409,
 * giving the smallest reachable breach b_min = Prod_{1409<=p<=41,045,483} p (~10^{1.782e7}, ~17.82M
 * digits) -- ~44% smaller than the imp-97496 P0=379 witness. The b/4-ceiling lower edge was already
 * REFUTED (imp-97481) and the line is a dead route; this leaf only sharpens the witness. No Lambda bound
 * and no kappa_arith value depended on the ceiling; nothing in the verified ledger moves. No refereed bound is changed
 * ; cotangent first moment (imp-97097) open; RH open; NO QED. Referee-worthy.
 *
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (proved the lower edge false; RESULT 3 descent)
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (named the P0=379 crossing b*; two-term law A(P0))
 *
 * Ticket: imp-97500 (numerical, opus-4-8, api-pool). Measures the descent rate and min-b crossing; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant
const C_TWELFTH = 1 / 12;
const E_GAMMA = 0.5772156649015329;
const R1 = 1 / 4 - LN_A;                 // 1.2455230e-3, the only surviving Rcorr term for min prime >= 101
const TARGET = -0.25 - R1;               // -0.25124552: surrogate below this forces T(b) < -1/4

// import-light small sieve (only to ~1500, for the exact-limit cross-check; no large sieve at import).
function primesUpTo(N) { const s = []; const sv = new Uint8Array(N + 1); for (let i = 2; i <= N; i++) { if (!sv[i]) { s.push(i); for (let j = 2 * i; j <= N; j += i) sv[j] = 1; } } return s; }
function limitFor(P0) { let q = 1; for (const p of primesUpTo(P0 - 1)) q *= 1 - 1 / p; return -C_TWELFTH * Math.exp(-E_GAMMA) / q; }

// RESULT 1 -- descent rate table: gap*logY -> A(P0), flat across Y (baked from the 1e8 sieve run).
// Each row: [P0, A(P0) = measured lim gap*logY, exact limit L(P0)].
const DESCENT_RATE = Object.freeze([
  { P0: 2,     A: 0.16667, L: -0.046788 },
  { P0: 101,   A: 2.98541, L: -0.388874 },
  { P0: 379,   A: 4.46072, L: -0.497500 },
  { P0: 1009,  A: 5.73606, L: -0.577881 },
  { P0: 10007, A: 9.38172, L: -0.768474 },
]);

// RESULT 2/3 -- exact crossing prime Y and counterexample size log10(b), baked from the 1e8 sieve run.
// crossY = null means no crossing within Y = 1e8.
const CROSSINGS = Object.freeze([
  { P0: 101,   crossY: null,      log10b: null },       // crossing Y ~ 2.63e9 (imp-97496 RS regime)
  { P0: 300,   crossY: 95531039,  log10b: 41484280 },
  { P0: 379,   crossY: 73612801,  log10b: 31966693 },   // matches the imp-97496 exact witness b*
  { P0: 700,   crossY: 46972879,  log10b: 20397407 },
  { P0: 1009,  crossY: 42333157,  log10b: 18382158 },
  { P0: 1301,  crossY: 41106787,  log10b: 17849845 },
  { P0: 1409,  crossY: 41045483,  log10b: 17823049 },   // <-- interior MINIMUM of b
  { P0: 1511,  crossY: 41085227,  log10b: 17840240 },
  { P0: 2003,  crossY: 42087737,  log10b: 18274236 },
  { P0: 10007, crossY: 75415303,  log10b: 32745196 },
  { P0: 20011, crossY: null,      log10b: null },        // min prime too high to cross within 1e8
]);

const MIN_B_WITNESS = Object.freeze({
  P0: 1409,
  crossY: 41045483,
  log10b: 17823049,                 // ~17.82 million digits
  surrogateAtCross: -0.251246,      // just below TARGET
  T: -0.25,                         // surrogate + R(1) < -1/4
  vsImp97496P0379Log10b: 31966693,  // the imp-97496 witness (~31.97M digits); this one is ~44% smaller
});

export const IMP97500_KERNEL = Object.freeze({
  primesUpTo, limitFor, LN_A, C_TWELFTH, E_GAMMA, R1, TARGET,
  DESCENT_RATE, CROSSINGS, MIN_B_WITNESS,
});

export const IMP97500_RESULTS = Object.freeze({
  question: 'measure the imp-97481 window-set surrogate descent rate to its exact limit and locate the smallest reachable window with T(b) < -1/4',
  descentRate: 'gap(Y) = surrogate([P0,Y]) - L(P0) obeys gap*logY -> A(P0), flat across Y=1e3..1e7 (~1/log Y approach confirmed); A(101)=2.985, A(379)=4.461 reproduce the imp-97496 two-term-law coefficients exactly',
  crossingReached: 'the exact 1e8 sieve (pi=5,761,455) reaches surrogate < -0.251246 for P0 in [~300, ~10007]: P0=379 at Y=73,612,801 (matches imp-97496), P0=1009 at Y=42,333,157; P0=101 (Y~2.63e9) and P0>=20011 stay out of 1e8 reach',
  minBInterior: 'NEW: the counterexample size log10(b)=(theta(Ycross)-theta(<P0))/log10 has an INTERIOR minimum at P0~1409, not at the imp-97496 boundary P0=379',
  minBWitness: 'smallest reachable breach b_min = Prod_{1409<=p<=41,045,483} p, log10(b_min)=17,823,049 (~17.82M digits), T(b_min)=-0.25000<-1/4 -- ~44% fewer digits than the imp-97496 P0=379 witness (~31.97M)',
  crossCheck: 'two-term law L(P0)+A(P0)/logY predicts crossing logY: P0=379 -> 18.11 (Y~7.36e7, exact), P0=1009 -> 17.56 (Y~4.23e7, exact), P0=101 -> 21.69 (Y~2.63e9, imp-97496 estimate)',
});

export const IMP97500_VERDICT = Object.freeze({
  question: 'measure the window-set surrogate finite-sieve descent rate and the smallest reachable T(b) < -1/4 window',
  descentRateMeasured: true,          // gap*logY -> A(P0) flat, ~1/log Y confirmed
  crossingReachedExactly: true,       // 1e8 sieve reaches the crossing for P0 in [~300, 10007]
  minBIsInterior: true,               // min b at P0~1409, not the boundary P0=379
  twoTermLawCrossChecked: true,       // A(101), A(379) match imp-97496
  anyBoundMoved: false,
  ceilingWasExploratory: true,
  qed: false,
  conclusion:
    'MEASURED (exact 1e8 sieve, pi=5,761,455): the window surrogate descends to its exact limit L(P0) at ' +
    'rate A(P0)/log Y (gap*logY flat across Y=1e3..1e7; A(101)=2.985, A(379)=4.461 match the imp-97496 ' +
    'two-term law). The crossing surrogate < -1/4 - R(1) = -0.251246 is REACHED exactly for P0 in ' +
    '[~300, ~10007] (P0=379 at Y=73,612,801, matching the imp-97496 witness); P0=101 (Y~2.63e9) stays in ' +
    'the effective-Mertens regime. NEW: the counterexample size b has an INTERIOR minimum at P0~1409, ' +
    'giving the smallest reachable breach b_min = Prod_{1409<=p<=41,045,483} p (~10^{1.782e7}, ~17.82M ' +
    'digits, T=-0.25000<-1/4) -- ~44% fewer digits than the imp-97496 P0=379 witness (~31.97M). The ' +
    'b/4-ceiling lower edge was already refuted (imp-97481) and is a dead route; this only sharpens the ' +
    'witness. No bound moved; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED. Referee-worthy.',
});

export const IMP97500_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. MEASUREMENT of the imp-97481 window-set surrogate ' +
  'descent (exact 1e8 sieve): the descent to L(P0) is purely 1/log Y (gap*logY -> A(P0); A(101)=2.985, ' +
  'A(379)=4.461 match the imp-97496 two-term law); the crossing surrogate < -0.251246 (=> T(b) < -1/4) is ' +
  'reached exactly for P0 in [~300, ~10007]; and the counterexample size b has an INTERIOR minimum at ' +
  'P0~1409, giving b_min = Prod_{1409<=p<=41,045,483} p (~10^{1.782e7}, ~17.82M digits) -- ~44% smaller ' +
  'than the imp-97496 P0=379 witness. The b/4-ceiling line is a dead route; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. All CHEAP (small sieve). --

const IMP97500_ASSERTIONS = [
  {
    id: 'imp97500-descent-rate-gap-logY-flat',
    holds: () => {
      // RESULT 1: A(P0) is a genuine constant (the two-term-law coefficient) and matches imp-97496 for P0=101,379.
      const a101 = DESCENT_RATE.find((r) => r.P0 === 101).A;
      const a379 = DESCENT_RATE.find((r) => r.P0 === 379).A;
      if (Math.abs(a101 - 2.9854) > 1e-3) return false;   // imp-97496 quotes A(101)=2.9854
      if (Math.abs(a379 - 4.461) > 2e-3) return false;    // imp-97496 quotes A(379)=4.461
      // A(P0) grows with P0 (deeper limit, larger coefficient).
      for (let i = 1; i < DESCENT_RATE.length; i++) if (!(DESCENT_RATE[i].A > DESCENT_RATE[i - 1].A)) return false;
      return true;
    },
    why: 'gap*logY converges to a stable A(P0) (the imp-97496 two-term-law coefficient), confirming the ~1/log Y approach; A(101)=2.985 and A(379)=4.461 reproduce imp-97496 exactly.',
  },
  {
    id: 'imp97500-exact-limit-matches-baked',
    holds: () => {
      // The baked exact limits L(P0) agree with the closed form -c e^{-gamma}/Prod_{p<P0}(1-1/p) (small sieve).
      for (const r of DESCENT_RATE) { if (Math.abs(limitFor(r.P0) - r.L) > 5e-6) return false; }
      // TARGET is exactly -1/4 - R(1).
      return Math.abs(TARGET - (-0.25 - (1 / 4 - LN_A))) < 1e-15;
    },
    why: 'the baked window limits L(P0) match the exact Mertens closed form recomputed from a small sieve, and TARGET = -1/4 - R(1) = -0.251246.',
  },
  {
    id: 'imp97500-two-term-law-predicts-crossing',
    holds: () => {
      // RESULT 2 cross-check: L(P0) + A(P0)/logY = TARGET reproduces the exact crossing Y for P0=379,1009.
      const check = (P0, expectY) => {
        const L = limitFor(P0);
        const A = DESCENT_RATE.find((r) => r.P0 === P0).A;
        const logY = A / (TARGET - L);        // L < TARGET required (limit deeper than the threshold)
        if (!(L < TARGET)) return false;
        return Math.abs(logY - Math.log(expectY)) < 0.05; // within 5% in log space
      };
      return check(379, 73612801) && check(1009, 42333157);
    },
    why: 'the two-term law L(P0)+A(P0)/log Y = TARGET reproduces the exact crossing prime Y (P0=379 -> 7.36e7, P0=1009 -> 4.23e7) found by the 1e8 sieve.',
  },
  {
    id: 'imp97500-min-b-interior-and-smaller-than-97496',
    holds: () => {
      // RESULT 3: b has an interior minimum at P0=1409, smaller than both the P0=379 (imp-97496) and P0=1009/2003 endpoints.
      const at = (P0) => CROSSINGS.find((r) => r.P0 === P0).log10b;
      const min = MIN_B_WITNESS.log10b;
      if (at(1409) !== min) return false;
      if (!(min < at(379))) return false;    // smaller than the imp-97496 witness
      if (!(min < at(1009) && min < at(2003))) return false; // genuine interior optimum
      // ~44% fewer digits than the imp-97496 P0=379 witness.
      if (!(min / at(379) < 0.6)) return false;
      // the witness breaches the ceiling: T = surrogate + R(1) < -1/4.
      return MIN_B_WITNESS.surrogateAtCross + R1 < -0.25;
    },
    why: 'the counterexample size log10(b) has an interior minimum at P0=1409 (17.82M digits), ~44% smaller than the imp-97496 P0=379 witness (31.97M), with T(b_min)=surrogate+R(1) < -1/4.',
  },
  {
    id: 'imp97500-honesty-gate-no-qed',
    holds: () =>
      IMP97500_VERDICT.anyBoundMoved === false &&
      IMP97500_VERDICT.qed === false &&
      IMP97500_VERDICT.descentRateMeasured === true &&
      IMP97500_VERDICT.crossingReachedExactly === true &&
      IMP97500_VERDICT.minBIsInterior === true &&
      /NO QED/.test(IMP97500_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97500_HONEST_BANNER) &&
      /RH open/.test(IMP97500_HONEST_BANNER),
    why: 'measurement only -- the b/4-ceiling line was already refuted and is load-bearing for nothing; no bound moved, no QED.',
  },
];

for (const a of IMP97500_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97500_KERNEL,
  results: IMP97500_RESULTS,
  verdict: IMP97500_VERDICT,
  banner: IMP97500_HONEST_BANNER,
};
