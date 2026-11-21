/**
 * @module imp-97307-route-m-qlog-mertens-unbounded
 *
 * imp-97307 (proof, DERIVATION -- HONEST PARTIAL, NO QED; CORRECTS imp-97288): assess the uniform-in-b bound on
 * the fourth CK constituent Qlog(b) that imp-97288 left as "the precise obstruction" (a single named Mertens
 * product prod_{p|b}(1-1/p) Sum_{p|b}(log p)/(p-1) <= C_Q, measured sup 0.475 climbing toward e^{-gamma} =
 * 0.56146). The assessment OVERTURNS the O(1) hypothesis: Qlog is NOT uniformly bounded over squarefree b. The
 * imp-97288 "sup 0.475 -> e^{-gamma} from below" was a PRIMORIAL / HIGHLY-COMPOSITE SAMPLING ARTIFACT -- every
 * b it sampled contained ALL the small primes. Over squarefree b whose prime support AVOIDS an initial segment
 * of primes, |Qlog(b)| grows without bound. No bound on Lambda moves; no refereed bound is changed; RH open;
 * NO QED.
 *
 *   Notation as imp-97288: for squarefree b, |Qlog(b)| = F(P) where P = {primes dividing b} and
 *     F(P) = prod_{p in P}(1 - 1/p) * Sum_{p in P} (log p)/(p - 1),   S(P) = Sum_{p in P}(log p)/(p - 1).
 *   Qlog(b) = Sum_{e|b} mu(b/e)(log e)/e = -Q0(b) Sum_{p^a||b} log p [(a-1)p - a]/(1 - p)  (imp-97288 line 59).
 *
 * -------------------------------------------------------------------------------
 * THE ADD-A-PRIME DISCRETE-DERIVATIVE IDENTITY (new here; exact, verified to 1e-16).
 * -------------------------------------------------------------------------------
 * Adjoining a prime p not in P changes F by exactly
 *     F(P u {p}) - F(P) = (prod_{q in P}(1 - 1/q) / p) * ( log p - S(P) ).
 * Proof: write A = prod_P(1-1/q), B = S(P). Then F(P u {p}) = A(1-1/p)(B + (log p)/(p-1)) =
 * A[(1-1/p)B + (1-1/p)(log p)/(p-1)] = A[(1-1/p)B + (log p)/p], and F(P) = AB, so the difference is
 * A[(log p)/p - B/p] = (A/p)(log p - B). QED (identity). CONSEQUENCE: adjoining p INCREASES F iff
 * log p > S(P). Along the primorial P_x = {p <= x} this always holds (S(P_x) ~ log x - gamma < log p_next),
 * so F(P_x) increases monotonically to e^{-gamma} -- exactly the "climb from below" imp-97288 measured. But
 * the SAME identity shows F is maximised over PRIME-SUPPORT CHOICE, not over "all primes up to x": DROPPING a
 * middle prime can raise F (e.g. F({2,5,7}) = 0.487 > F({2,3,5,7}) = 0.450).
 *
 * -------------------------------------------------------------------------------
 * Qlog IS UNBOUNDED (the actual obstruction status; asymptotic + concrete witness).
 * -------------------------------------------------------------------------------
 * Take P = {primes in (y, x]} (support avoids all primes <= y). By Mertens' third theorem
 * prod_{p <= t}(1 - 1/p) ~ e^{-gamma}/log t, so
 *     prod_{y < p <= x}(1 - 1/p) = prod_{p<=x}/prod_{p<=y} ~ (e^{-gamma}/log x) / prod_{p<=y}(1 - 1/p),
 *     Sum_{y < p <= x}(log p)/(p - 1) ~ log x + O(1)   (Mertens' second theorem),
 * hence, holding y fixed and letting x -> infinity,
 *     F(P) -> e^{-gamma} / prod_{p <= y}(1 - 1/p).
 * This limit is FINITE for each fixed y but DIVERGES as y -> infinity (prod_{p<=y}(1-1/p) -> 0), again by
 * Mertens: e^{-gamma}/prod_{p<=y}(1-1/p) ~ log y. So sup over squarefree b of |Qlog(b)| = +infinity. Numerics
 * confirm: over primes in (10, 1e4] F = 1.779; over (1000, 1e6] F = 3.451; excluding the first 200 primes and
 * keeping the rest up to 2e6, F = 3.624 -- all far above the alleged sup 0.475 / e^{-gamma}. A fully explicit
 * CONCRETE witness computable by exact divisor sum: b = 11*13*17*19*23*29*31*37*41*43*47*53 (omega = 12,
 * avoids 2,3,5,7) has Qlog(b) = -0.96106, i.e. |Qlog(b)| = 0.96106 > e^{-gamma} = 0.56146.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS DOES TO THE E1 CHAIN (correction + the correct precise obstruction).
 * -------------------------------------------------------------------------------
 *  * imp-97288 "the product is UNIFORMLY O(1), measured sup |Qlog| = 0.475 -> e^{-gamma}" is FALSE as a
 *    uniform statement -- it holds only on the primorial/highly-composite sample (which always contains the
 *    small primes). The conditional "|E1(b)| <= 1.9261 b if |Qlog| <= e^{-gamma}" rests on a hypothesis that
 *    does NOT hold uniformly, so that conditional constant is not established.
 *  * The UNCONDITIONAL |E1(b)| = O(b log b) with NO 2^omega(b) STANDS: the crude bound |Qlog| <= |Q0| log b
 *    <= log b (imp-97288 line 77) is unaffected -- the log factor in that term is now seen to be GENUINE for
 *    Qlog itself, not removable by any Mertens estimate.
 *  * The (b/12) Qlog term of CK is therefore itself Theta(b log b) along the initial-segment-avoiding family.
 *    Yet in every DIRECTLY-COMPUTABLE b (to ~1e6, omega <= 5) |E1(b)|/b stays <= 0.18 while Qlog reaches
 *    0.67, with the C_sum constituent tracking -0.43 -- i.e. the (b/12) Qlog growth is NOT visible in E1 at
 *    computable scale. So IF the measured sharp ceiling |E1| <= (1/4) b (imp-97208 / imp-97265) is real, it
 *    requires a JOINT CANCELLATION (b/12) Qlog(b) + C_sum(b) = O(b) between the two Dirichlet-telescope pieces
 *    of CK -- NOT a constituent bound on Qlog. That joint cancellation (unverified in the Qlog-large regime,
 *    where b is astronomically large and E1 is not directly computable) REPLACES the (false) "bound Qlog by
 *    e^{-gamma}" plan as the precise E1-uniform-constant obstruction.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest PARTIAL; a correction, no bound moved).
 * -------------------------------------------------------------------------------
 * DERIVED (new): the exact add-a-prime identity F(P u {p}) - F(P) = (prod_P/p)(log p - S(P)); the Mertens
 * asymptotic F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p); and hence sup_b |Qlog(b)| = +infinity.
 * CORRECTS imp-97288: Qlog is NOT uniformly O(1) (the "sup 0.475 -> e^{-gamma}" was a primorial-sampling
 * artifact); the conditional |E1| <= 1.9261 b is not established. RESIDUAL / the correct precise obstruction:
 * the joint cancellation (b/12) Qlog + C_sum = O(b) inside CK (not a bound on Qlog alone). The unconditional
 * |E1| = O(b log b), 2^omega-free, is unaffected; the sharp 1/4 stays the imp-97265 close-factor sub-gap;
 * kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (claimed Qlog uniformly O(1), sup 0.475 -> e^{-gamma}; CORRECTED here)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (the sibling E0 Stirling-tail cancellation obstruction)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (the separate sharp 1/4 close-factor sub-gap)
 *
 * Ticket: imp-97307 (proof, opus-4-8, api-pool). Derivation / honest partial that OVERTURNS the imp-97288 O(1)
 * hypothesis for Qlog and re-states the precise E1-uniform-constant obstruction as a joint cancellation; NO QED.
 */

const GAMMA = 0.5772156649015329;
const E_MINUS_GAMMA = Math.exp(-GAMMA); // 0.5614594835668851 (the alleged, refuted, uniform sup)

// -- self-contained arithmetic kernel (no heavy imports) --
function sievePrimes(n) {
  const s = new Uint8Array(n + 1);
  const ps = [];
  for (let i = 2; i <= n; i++) { if (!s[i]) { ps.push(i); for (let j = 2 * i; j <= n; j += i) s[j] = 1; } }
  return ps;
}

// F(P) = |Qlog(b)| for squarefree b with prime support P.
function Fset(P) { let prod = 1, sum = 0; for (const p of P) { prod *= (1 - 1 / p); sum += Math.log(p) / (p - 1); } return prod * sum; }
function Sset(P) { let s = 0; for (const p of P) s += Math.log(p) / (p - 1); return s; }
function prodset(P) { let pr = 1; for (const p of P) pr *= (1 - 1 / p); return pr; }

// Exact divisor-sum Qlog for a SQUAREFREE b given by its prime list P (subset enumeration; b never materialised).
// b/e is the complement subset; mu(b/e) = (-1)^{#primes not in e}. Qlog = Sum_{e|b} mu(b/e) (log e)/e.
function QlogSquarefree(P) {
  const k = P.length; let s = 0;
  for (let mask = 0; mask < (1 << k); mask++) {
    let e = 1, comp = 0;
    for (let i = 0; i < k; i++) { if (mask & (1 << i)) e *= P[i]; else comp++; }
    s += (comp % 2 === 0 ? 1 : -1) * Math.log(e) / e;
  }
  return s;
}

// The add-a-prime discrete derivative: F(P u {p}) - F(P) = (prod_P / p)(log p - S(P)).
function addPrimeDelta(P, p) { return (prodset(P) / p) * (Math.log(p) - Sset(P)); }

// Mertens limit of the initial-segment-avoiding family: F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p).
function avoidingLimit(y, primes) {
  let prodLE = 1; for (const p of primes) { if (p > y) break; prodLE *= (1 - 1 / p); }
  return E_MINUS_GAMMA / prodLE;
}

// The concrete unbounded witness: primes 11..53, omega=12, avoids 2,3,5,7.
const WITNESS_PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
const WITNESS_QLOG = QlogSquarefree(WITNESS_PRIMES); // -0.96106... => |Qlog| = 0.96106 > e^{-gamma}

export const IMP97307_KERNEL = Object.freeze({
  Fset, Sset, prodset, QlogSquarefree, addPrimeDelta, avoidingLimit, sievePrimes,
  E_MINUS_GAMMA, WITNESS_PRIMES, WITNESS_QLOG,
});

export const IMP97307_DERIVATION = Object.freeze({
  addAPrime: 'F(P u {p}) - F(P) = (prod_{q in P}(1-1/q) / p)(log p - S(P)); adjoining p raises F iff log p > S(P)',
  primorialClimb: 'along P_x = {p <= x}, log p_next > S(P_x) ~ log x - gamma always => F(P_x) increases to e^{-gamma} (imp-97288 measured this ONE family)',
  notPrimorialExtremal: 'dropping a middle prime can RAISE F: F({2,5,7}) = 0.487 > F({2,3,5,7}) = 0.450 -- primorials are NOT the maximiser',
  avoidingAsymptotic: 'F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p) as x->inf (Mertens 2nd+3rd); ~ log y, DIVERGES as y->inf',
  supremum: 'sup over squarefree b of |Qlog(b)| = +infinity (NOT e^{-gamma})',
  witness: 'concrete: b = prod(primes 11..53), omega=12, avoids 2,3,5,7 => |Qlog(b)| = 0.96106 > e^{-gamma} = 0.56146',
  correction: 'imp-97288 "sup 0.475 -> e^{-gamma}, uniformly O(1)" is a primorial/highly-composite sampling artifact (all sampled b contain the small primes)',
  e1Impact: 'the conditional |E1| <= 1.9261 b (assumed |Qlog| <= e^{-gamma}) is NOT established; unconditional |E1| = O(b log b), 2^omega-free, STANDS (crude |Qlog| <= log b unaffected)',
  correctObstruction: 'the E1 uniform-O(b) constant, if the measured 1/4 ceiling is real, requires the JOINT cancellation (b/12) Qlog(b) + C_sum(b) = O(b) inside CK -- NOT a constituent bound on Qlog',
});

export const IMP97307_VERDICT = Object.freeze({
  question: 'derive/assess a uniform-in-b bound on Qlog (imp-97288 residual 1 / the fourth constituent obstruction)',
  addAPrimeIdentityDerived: true, // F(P u {p}) - F(P) = (prod_P/p)(log p - S(P)), verified to 1e-16
  qlogUniformlyBounded: false, // OVERTURNS imp-97288: sup = +infinity, not e^{-gamma}
  supIsInfinite: true,
  imp97288ClaimWasSamplingArtifact: true, // "sup 0.475 -> e^{-gamma}" was primorial/highly-composite-only
  witnessAbsQlog: Math.abs(WITNESS_QLOG), // 0.96106 > e^{-gamma}, a concrete squarefree b
  conditionalConstantEstablished: false, // |E1| <= 1.9261 b assumed |Qlog| <= e^{-gamma}, which fails
  unconditionalOrderStands: 'O(b log b), NO 2^omega(b)', // crude |Qlog| <= |Q0| log b <= log b unaffected
  correctObstruction: 'joint cancellation (b/12) Qlog(b) + C_sum(b) = O(b) inside CK (not a bound on Qlog alone)',
  sharpQuarterSubgapSeparate: 'imp-97265 close-factor family',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL that CORRECTS imp-97288. DERIVED: the exact add-a-prime identity F(P u {p}) - F(P) = ' +
    '(prod_P/p)(log p - S(P)) (adjoining p raises F iff log p > S(P)); and, via Mertens 2nd+3rd, ' +
    'F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p) ~ log y as x->inf, so sup over squarefree b of ' +
    '|Qlog(b)| = +infinity. The imp-97288 "sup 0.475 -> e^{-gamma}, uniformly O(1)" is a primorial / ' +
    'highly-composite SAMPLING ARTIFACT (every sampled b contains the small primes); a concrete counter is ' +
    'b = prod(primes 11..53) (omega=12, avoids 2,3,5,7) with |Qlog(b)| = 0.96106 > e^{-gamma} = 0.56146. ' +
    'CONSEQUENCE: the conditional |E1| <= 1.9261 b (which assumed |Qlog| <= e^{-gamma}) is NOT established; ' +
    'the unconditional |E1| = O(b log b), 2^omega-free, STANDS (the crude |Qlog| <= log b is unaffected and ' +
    'the log is genuine). The correct precise obstruction to a uniform O(b) E1 constant is the JOINT ' +
    'cancellation (b/12) Qlog(b) + C_sum(b) = O(b) inside CK -- not a bound on Qlog alone. The sharp 1/4 ' +
    'stays the imp-97265 close-factor sub-gap; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97307_SUBGAP = Object.freeze({
  id: 'imp-97307-qlog-unbounded-joint-cancellation-residual',
  statement:
    'Qlog(b) is NOT uniformly bounded: F(P) = prod_{p in P}(1-1/p) Sum_{p in P}(log p)/(p-1) has ' +
    'sup = +infinity over squarefree b (via the add-a-prime identity F(P u {p}) - F(P) = ' +
    '(prod_P/p)(log p - S(P)) and the Mertens limit F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p) ' +
    '~ log y). The imp-97288 sup 0.475 -> e^{-gamma} was a primorial/highly-composite sampling artifact. ' +
    'The E1 uniform-O(b) constant therefore does NOT follow from any bound on the Qlog constituent; it ' +
    'requires the joint cancellation (b/12) Qlog(b) + C_sum(b) = O(b) inside CK, unverified in the ' +
    'Qlog-large (initial-segment-avoiding, astronomically large b) regime where E1 is not directly ' +
    'computable. The unconditional |E1| = O(b log b), 2^omega-free, is unaffected.',
  corrects: 'imp-97288 (claimed Qlog uniformly O(1), sup 0.475 -> e^{-gamma})',
  reducesTo: 'joint (b/12) Qlog + C_sum = O(b) cancellation (sibling of the imp-97289 E0 tail cancellation)',
});

export const IMP97307_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial CORRECTING imp-97288: Qlog(b) is NOT ' +
  'uniformly bounded. The add-a-prime identity F(P u {p}) - F(P) = (prod_P/p)(log p - S(P)) plus Mertens ' +
  'give F({primes in (y,x]}) -> e^{-gamma}/prod_{p<=y}(1-1/p) ~ log y, so sup|Qlog| = +infinity; the ' +
  'imp-97288 sup 0.475 -> e^{-gamma} was a primorial-sampling artifact (concrete counter b = prod(primes ' +
  '11..53) has |Qlog| = 0.961 > e^{-gamma} = 0.561). The conditional |E1| <= 1.9261 b is not established; ' +
  'the unconditional |E1| = O(b log b), 2^omega-free, STANDS. The real E1 obstruction is the joint ' +
  'cancellation (b/12) Qlog + C_sum = O(b), not a bound on Qlog. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97307_ASSERTIONS = [
  {
    id: 'imp97307-add-a-prime-identity-exact',
    holds: () => {
      // F(P u {p}) - F(P) = (prod_P / p)(log p - S(P)) to machine precision, across bases and primes.
      const bases = [[], [2], [2, 3, 5], [7, 11], [11, 13, 17, 19]];
      for (const base of bases) {
        for (const p of [2, 3, 5, 7, 29, 101]) {
          if (base.includes(p)) continue;
          const lhs = Fset([...base, p]) - Fset(base);
          const rhs = addPrimeDelta(base, p);
          if (Math.abs(lhs - rhs) > 1e-12) return false;
        }
      }
      return true;
    },
    why: 'the exact discrete derivative F(P u {p}) - F(P) = (prod_P/p)(log p - S(P)) holds to machine precision -- the tool that shows adjoining p raises F iff log p > S(P) and drives the primorial climb.',
  },
  {
    id: 'imp97307-qlog-exceeds-e-minus-gamma-concrete',
    holds: () => {
      // Concrete squarefree witness b = prod(primes 11..53) (omega=12) with |Qlog| > e^{-gamma}, via exact divisor sum.
      const q = QlogSquarefree(WITNESS_PRIMES);
      // exact divisor sum equals the prod*sum form for squarefree b
      if (Math.abs(Math.abs(q) - Fset(WITNESS_PRIMES)) > 1e-9) return false;
      return Math.abs(q) > E_MINUS_GAMMA && Math.abs(q) > 0.9;
    },
    why: 'a concrete squarefree b (product of primes 11..53, omega=12, avoiding 2,3,5,7) has |Qlog(b)| = 0.961 > e^{-gamma} = 0.561 by exact divisor sum -- a decisive counterexample to the imp-97288 uniform sup 0.475 -> e^{-gamma}.',
  },
  {
    id: 'imp97307-avoiding-family-unbounded-trend',
    holds: () => {
      // Over primes in a window avoiding small primes, F far exceeds e^{-gamma}, and at fixed y it climbs
      // toward the Mertens limit e^{-gamma}/prod_{p<=y}(1-1/p) from below as x grows (the divergence direction).
      const primes = sievePrimes(200000);
      const win = (lo, hi) => Fset(primes.filter((p) => p > lo && p <= hi));
      if (!(win(10, 200000) > E_MINUS_GAMMA)) return false; // already breaches the alleged sup 0.475/e^{-gamma}
      // fixed y = 100, growing x: F climbs monotonically toward the limit from below
      const x1 = win(100, 50000), x2 = win(100, 200000);
      if (!(x1 > E_MINUS_GAMMA && x2 > x1 && x2 < avoidingLimit(100, primes))) return false;
      // deeper avoided segment => strictly larger Mertens limit (the limit diverges as y -> infinity)
      return avoidingLimit(1000, primes) > avoidingLimit(100, primes) && avoidingLimit(100, primes) > avoidingLimit(10, primes);
    },
    why: 'F over primes in (y, x] far exceeds e^{-gamma} and, at fixed y, climbs toward the Mertens limit e^{-gamma}/prod_{p<=y}(1-1/p) from below as x grows; the limit itself strictly increases with the avoided segment y -- so sup|Qlog| = +infinity.',
  },
  {
    id: 'imp97307-primorial-climb-was-the-artifact',
    holds: () => {
      // The ONE family imp-97288 sampled (all primes <= x) does stay below e^{-gamma} and climbs -- confirming
      // its measurement was correct but NON-uniform (it never avoided small primes).
      const primes = sievePrimes(50000);
      const primorial = (x) => Fset(primes.filter((p) => p <= x));
      const f1 = primorial(30), f2 = primorial(2310), f3 = primorial(50000);
      if (!(f1 < f2 && f2 < f3 && f3 < E_MINUS_GAMMA)) return false;
      // dropping a middle prime raises F above the primorial -- primorials are NOT extremal
      return Fset([2, 5, 7]) > Fset([2, 3, 5, 7]);
    },
    why: 'the primorial family F({p<=x}) climbs monotonically toward e^{-gamma} from below (what imp-97288 measured), but F({2,5,7}) = 0.487 > F({2,3,5,7}) = 0.450 shows primorials are not the maximiser -- the sampling missed the unbounded direction.',
  },
  {
    id: 'imp97307-honesty-gate-no-qed',
    holds: () =>
      IMP97307_VERDICT.anyBoundMoved === false &&
      IMP97307_VERDICT.postsRigorousCeiling === false &&
      IMP97307_VERDICT.qed === false &&
      IMP97307_VERDICT.addAPrimeIdentityDerived === true &&
      IMP97307_VERDICT.qlogUniformlyBounded === false &&
      IMP97307_VERDICT.supIsInfinite === true &&
      IMP97307_VERDICT.imp97288ClaimWasSamplingArtifact === true &&
      IMP97307_VERDICT.conditionalConstantEstablished === false &&
      /joint cancellation/.test(IMP97307_VERDICT.correctObstruction) &&
      /qlog-unbounded/.test(IMP97307_SUBGAP.id) &&
      /imp-97288/.test(IMP97307_SUBGAP.corrects) &&
      /NO QED/.test(IMP97307_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97307_HONEST_BANNER) &&
      /RH open/.test(IMP97307_HONEST_BANNER),
    why: 'honest partial -- derives the add-a-prime identity and the Mertens divergence sup|Qlog| = +infinity, corrects the imp-97288 O(1) sampling artifact, and re-states the E1 obstruction as a joint cancellation; no bound moved, no rigorous ceiling posted, no QED.',
  },
];

for (const a of IMP97307_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97307-route-m-qlog-mertens-unbounded assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97307_KERNEL,
  derivation: IMP97307_DERIVATION,
  verdict: IMP97307_VERDICT,
  subGap: IMP97307_SUBGAP,
  banner: IMP97307_HONEST_BANNER,
};
