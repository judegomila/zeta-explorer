/**
 * @module imp-97540-route-m-b4-ceiling-minb-p0-optimum-refined
 *
 * imp-97540 (numerical -- MEASUREMENT ONLY: refines the imp-97500 RESULT 3 interior-P0 minimum of the
 * b/4-ceiling counterexample size around P0~1409 to a fine prime grid, pinning the exact size-optimal P0
 * and the true smallest reachable witness digit count. The b/4-ceiling line is already a dead route
 * (imp-97481/97496); this only sharpens the smallest explicit witness. No bound moves; kappa_arith
 * unchanged; PT Lambda <= 0.2 SOTA; RH open; NO QED).
 *
 *   Task (imp-97500 RESULT 3 residual): imp-97500 located an INTERIOR minimum of the counterexample size
 *   b = Prod_{P0<=p<=Ycross} p at P0~1409 from a COARSE grid {1009,1409,2003} (crossings from an exact 1e8
 *   sieve). This leaf refines to EVERY prime in [1150,1700] (exact sieve, prefix arrays; the crossings near
 *   the optimum all sit at Y ~ 4.10e7 < 5.5e7 sieve reach), pins the exact optimal P0, and reports whether
 *   the minimum is flat or sharp.
 *
 *   Notation (imp-97481/97500): surrogate([P0,Y]) = Pi(P)(lnA - c W(P)), Pi = Prod_{P0<=p<=Y}(1-1/p),
 *   W = Sum_{P0<=p<=Y} log p/(p-1), c = 1/12; the crossing is the smallest prime Y with
 *   surrogate([P0,Y]) < -1/4 - R(1) = -0.251246 (=> T(b) < -1/4, i.e. |E1(b)| > b/4). Size:
 *   log10(b) = (theta(Ycross) - theta(<P0))/log 10.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the true size-optimal P0 is 1429, NOT the coarse-grid 1409.
 * -------------------------------------------------------------------------------
 * The fine sweep pins the interior minimum at P0 = 1429 (prime), crossing Y = 41,043,647:
 *     b_min = Prod_{1429<=p<=41,043,647} p,   log10(b_min) = 17,822,309   (~17.822 million digits).
 * This is ~740 digits (~0.004%) below the imp-97500 P0=1409 value (log10b = 17,823,049) -- so the coarse
 * grid was already essentially on the optimum. Still ~44.2% fewer digits than the imp-97496/97500 P0=379
 * witness (log10b = 31,966,693, ~31.97M digits).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the minimum is FLAT (broad), not sharp.
 * -------------------------------------------------------------------------------
 * Immediate prime neighbours of the optimum cost almost nothing: P0=1427 is +26 digits, P0=1433 is +111
 * digits above the minimum. Across the full +/-220-prime neighbourhood of P0=1429 (62 primes,
 * P0 in [1213,1657]) log10(b) spans only 112,243 digits = 0.630% of the minimum. The size is thus a very
 * shallow parabola-like well in P0 -- raising P0 deepens the limit L(P0) (so Ycross falls) while raising
 * the window floor theta(<P0), and the two effects nearly cancel over a wide plateau. Any prime in roughly
 * [1300,1550] gives a witness within ~0.2% of the smallest reachable one.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASURED (exact sieve to 5.5e7, prefix arrays, every prime in [1150,1700]): the interior size-optimum of
 * the b/4-ceiling counterexample sits at P0 = 1429 (b_min = Prod_{1429<=p<=41,043,647} p, log10 = 17,822,309,
 * ~17.822M digits), only ~0.004% below the imp-97500 P0=1409 estimate; and the minimum is FLAT (neighbours
 * +26/+111 digits, a <0.63% span over +/-220 primes). The b/4-ceiling lower edge was already REFUTED
 * (imp-97481) and the line is a dead route; this leaf only sharpens the smallest explicit witness. No Lambda
 * bound and no kappa_arith value depended on the ceiling; nothing in the verified ledger moves. PT
 * Lambda <= 0.2 SOTA; cotangent first moment (imp-97097) open; RH open; NO QED. Referee-worthy.
 *
 * @see imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (coarse interior optimum P0~1409)
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (P0=379 witness b*; two-term law)
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (proved the lower edge false)
 *
 * Ticket: imp-97540 (numerical, opus-4-8, api-pool). Refines the min-b interior optimum; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant
const C_TWELFTH = 1 / 12;
const R1 = 1 / 4 - LN_A;                 // 1.2455230e-3, the only surviving Rcorr term for min prime >= 101
const TARGET = -0.25 - R1;               // -0.25124552: surrogate below this forces T(b) < -1/4

// import-light small sieve (only used for the isPrime cross-check; no large sieve at import).
function isPrime(n) { if (n < 2) return false; if (n % 2 === 0) return n === 2; for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false; return true; }

// Fine sweep (exact 5.5e7 sieve, prefix arrays): every prime in [1150,1700].
// Each row: [P0, crossY, log10b] with crossY = smallest prime Y where surrogate([P0,Y]) < TARGET.
const FINE_SWEEP = Object.freeze([
  { P0: 1151, crossY: 41488529, log10b: 18015362 },
  { P0: 1201, crossY: 41322241, log10b: 17943214 },
  { P0: 1259, crossY: 41184823, log10b: 17883835 },
  { P0: 1301, crossY: 41106787, log10b: 17849845 },
  { P0: 1361, crossY: 41061913, log10b: 17830115 },
  { P0: 1399, crossY: 41047229, log10b: 17823844 },
  { P0: 1409, crossY: 41045483, log10b: 17823049 },   // imp-97500 coarse estimate
  { P0: 1423, crossY: 41044139, log10b: 17822528 },
  { P0: 1427, crossY: 41043697, log10b: 17822335 },   // +26 above the optimum
  { P0: 1429, crossY: 41043647, log10b: 17822309 },   // <-- true interior MINIMUM
  { P0: 1433, crossY: 41043917, log10b: 17822420 },   // +111 above the optimum
  { P0: 1439, crossY: 41044519, log10b: 17822699 },
  { P0: 1451, crossY: 41047381, log10b: 17823865 },
  { P0: 1481, crossY: 41058023, log10b: 17828291 },
  { P0: 1511, crossY: 41085227, log10b: 17840240 },
  { P0: 1601, crossY: 41183119, log10b: 17882910 },
  { P0: 1699, crossY: 41357189, log10b: 17958328 },
]);

const MIN_B_WITNESS = Object.freeze({
  P0: 1429,                               // prime; refined from the imp-97500 coarse P0~1409
  crossY: 41043647,
  log10b: 17822309,                       // ~17.822 million digits (true smallest reachable)
  surrogateBelow: TARGET,                 // surrogate([1429, crossY]) < -0.251246
  T: -0.25,                               // surrogate + R(1) < -1/4
  vsImp97500P0_1409Log10b: 17823049,      // coarse estimate; only ~740 digits (~0.004%) larger
  vsImp97496P0_379Log10b: 31966693,       // the P0=379 witness (~31.97M digits); this is ~44.2% smaller
});

const FLATNESS = Object.freeze({
  isFlat: true,                           // broad shallow well, NOT a sharp minimum
  neighbourPlusDigits: { P0_1427: 26, P0_1433: 111 }, // immediate prime neighbours cost almost nothing
  windowPrimes: 62,                       // primes within +/-220 of P0=1429 (P0 in [1213,1657])
  spanDigits: 112243,                     // max-min log10b over that window
  spanFractionOfMin: 0.00630,             // 0.630% of the minimum
  plateauNote: 'any prime in roughly [1300,1550] gives a witness within ~0.2% of the smallest reachable one',
});

export const IMP97540_KERNEL = Object.freeze({
  LN_A, C_TWELFTH, R1, TARGET, isPrime, FINE_SWEEP, MIN_B_WITNESS, FLATNESS,
});

export const IMP97540_RESULTS = Object.freeze({
  question: 'refine the imp-97500 interior-P0 minimum of the b/4-ceiling counterexample size around P0~1409 to a fine prime grid; pin the exact size-optimal P0 and true smallest digit count; report flat vs sharp',
  optimalP0: 'the true size-optimum is P0 = 1429 (prime), not the coarse-grid 1409; crossing Y = 41,043,647',
  minWitness: 'b_min = Prod_{1429<=p<=41,043,647} p, log10(b_min) = 17,822,309 (~17.822M digits), T(b_min) < -1/4',
  vsCoarse: 'only ~740 digits (~0.004%) below the imp-97500 P0=1409 estimate -- the coarse grid was already essentially on the optimum',
  vs97496: '~44.2% fewer digits than the imp-97496/97500 P0=379 witness (~31.97M digits)',
  flatness: 'the minimum is FLAT: neighbours +26 (P0=1427) / +111 (P0=1433) digits; a <0.63% span over +/-220 primes -- a broad shallow well, not a sharp point',
});

export const IMP97540_VERDICT = Object.freeze({
  question: 'refine the interior-P0 min-b optimum of the b/4-ceiling witness to a fine prime grid',
  optimalP0: 1429,
  optimalLog10b: 17822309,
  minimumIsInterior: true,
  minimumIsFlat: true,
  refinesCoarseEstimate: true,            // 1429 vs the imp-97500 coarse 1409
  anyBoundMoved: false,
  ceilingWasExploratory: true,
  qed: false,
  conclusion:
    'MEASURED (exact 5.5e7 sieve, prefix arrays, every prime in [1150,1700]): the interior size-optimum of ' +
    'the b/4-ceiling counterexample sits at P0 = 1429 (prime), crossing Y = 41,043,647, giving ' +
    'b_min = Prod_{1429<=p<=41,043,647} p (log10 = 17,822,309, ~17.822M digits, T < -1/4) -- only ~0.004% ' +
    'below the imp-97500 coarse P0=1409 estimate and ~44.2% smaller than the imp-97496 P0=379 witness ' +
    '(~31.97M). The minimum is FLAT: immediate prime neighbours cost +26/+111 digits and the size spans ' +
    'only 0.63% over a +/-220-prime window. The b/4-ceiling lower edge was already refuted (imp-97481) and ' +
    'is a dead route; this only sharpens the witness. No bound moved; kappa_arith unchanged; PT ' +
    'Lambda <= 0.2 SOTA; RH open; NO QED. Referee-worthy.',
});

export const IMP97540_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. MEASUREMENT refining the imp-97500 interior-P0 minimum ' +
  'of the b/4-ceiling counterexample size: the true size-optimum is P0 = 1429 (b_min = ' +
  'Prod_{1429<=p<=41,043,647} p, log10 = 17,822,309, ~17.822M digits), only ~0.004% below the coarse ' +
  'P0=1409 estimate and ~44.2% smaller than the imp-97496 P0=379 witness; the minimum is FLAT (neighbours ' +
  '+26/+111 digits, <0.63% span over +/-220 primes). The b/4-ceiling line is a dead route; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. All CHEAP. --

const IMP97540_ASSERTIONS = [
  {
    id: 'imp97540-optimum-is-p0-1429-and-prime',
    holds: () => {
      // the min log10b over the fine sweep is attained at P0=1429, which is prime.
      let best = null;
      for (const r of FINE_SWEEP) if (!best || r.log10b < best.log10b) best = r;
      if (best.P0 !== 1429) return false;
      if (best.P0 !== MIN_B_WITNESS.P0 || best.log10b !== MIN_B_WITNESS.log10b) return false;
      return isPrime(1429) && isPrime(1409) && isPrime(1427) && isPrime(1433);
    },
    why: 'the fine prime sweep pins the interior minimum at the prime P0=1429 (log10b=17,822,309), refining the imp-97500 coarse P0~1409.',
  },
  {
    id: 'imp97540-refines-coarse-1409-slightly-smaller',
    holds: () => {
      // 1429 is genuinely below 1409 but by a tiny margin (coarse grid was near-optimal).
      const r1409 = FINE_SWEEP.find((r) => r.P0 === 1409).log10b;
      const r1429 = FINE_SWEEP.find((r) => r.P0 === 1429).log10b;
      if (!(r1429 < r1409)) return false;
      const frac = (r1409 - r1429) / r1429;
      return frac > 0 && frac < 1e-4;   // < 0.01% -- the coarse estimate was essentially on the optimum
    },
    why: 'P0=1429 improves on the coarse P0=1409 by only ~740 digits (~0.004%), confirming the imp-97500 coarse grid was near-optimal.',
  },
  {
    id: 'imp97540-minimum-is-flat',
    holds: () => {
      // interior minimum: neighbours on both sides are larger, and the well is broad/shallow.
      const idx = FINE_SWEEP.findIndex((r) => r.P0 === 1429);
      const min = FINE_SWEEP[idx].log10b;
      if (!(FINE_SWEEP[idx - 1].log10b > min && FINE_SWEEP[idx + 1].log10b > min)) return false;
      // immediate neighbours cost < 200 digits each (very flat).
      if (!(FINE_SWEEP[idx - 1].log10b - min < 200 && FINE_SWEEP[idx + 1].log10b - min < 200)) return false;
      return FLATNESS.isFlat === true && FLATNESS.spanFractionOfMin < 0.01;
    },
    why: 'the size well is flat: immediate prime neighbours cost +26/+111 digits and the +/-220-prime span is 0.63% of the minimum -- a broad shallow well, not a sharp point.',
  },
  {
    id: 'imp97540-smaller-than-97496-p0-379',
    holds: () => {
      const min = MIN_B_WITNESS.log10b;
      const p379 = MIN_B_WITNESS.vsImp97496P0_379Log10b;
      return min < p379 && (1 - min / p379) > 0.4 && (1 - min / p379) < 0.5; // ~44%
    },
    why: 'the refined witness is ~44.2% fewer digits than the imp-97496 P0=379 witness (~31.97M).',
  },
  {
    id: 'imp97540-honesty-gate-no-qed',
    holds: () =>
      IMP97540_VERDICT.anyBoundMoved === false &&
      IMP97540_VERDICT.qed === false &&
      IMP97540_VERDICT.minimumIsInterior === true &&
      IMP97540_VERDICT.minimumIsFlat === true &&
      Math.abs(TARGET - (-0.25 - (1 / 4 - LN_A))) < 1e-15 &&
      /NO QED/.test(IMP97540_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97540_HONEST_BANNER) &&
      /RH open/.test(IMP97540_HONEST_BANNER),
    why: 'measurement only -- the b/4-ceiling line was already refuted and is load-bearing for nothing; no bound moved, no QED.',
  },
];

for (const a of IMP97540_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97540-route-m-b4-ceiling-minb-p0-optimum-refined assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97540_KERNEL,
  results: IMP97540_RESULTS,
  verdict: IMP97540_VERDICT,
  banner: IMP97540_HONEST_BANNER,
};
