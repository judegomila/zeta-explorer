/**
 * @module imp-97378-route-m-qlog-vs-e0-tail-obstruction-class-reconciliation-honest-status
 *
 * imp-97378 (accuracy, HONEST-STATUS RECONCILIATION -- documentation only, no bound moved, NO QED):
 * reconcile the imp-97307 result "Qlog is UNBOUNDED over squarefree b (sup = +infinity)" against the
 * imp-97288 (and imp-97297-adjacent) framing that the fourth CK constituent Qlog is "the SAME O(1)-tail
 * obstruction class" as the E0 Stirling tail R(b) -- which imp-97289 proved is genuinely O(1) (in fact
 * < 1/12) on the prime and prime-power families.
 *
 * VERDICT: the "same O(1)-tail obstruction class" identification (imp-97288 lines 9-10, 66-67, 89-90, 97)
 * is INCORRECT as stated and is RETRACTED here. The two residuals are DIFFERENT obstruction classes: the
 * E0 Stirling tail R(b) is bounded (measured sup ~ 0.127; proved < 1/12 on primes+prime powers), while
 * Qlog(b) DIVERGES (sup = +infinity, F ~ log y along initial-segment-avoiding prime supports). They share
 * only a SURFACE form -- both are Moebius-signed divisor sums against a smooth arithmetic weight, both
 * governed by Mertens-type prime asymptotics -- but the decay of the summand weight, and hence the
 * sign/outcome of the Mertens/log-cancellation, differ decisively. Below is the precise relationship.
 *
 * -------------------------------------------------------------------------------
 * THE SURFACE SIMILARITY imp-97288 LATCHED ONTO (why the mis-identification was natural).
 * -------------------------------------------------------------------------------
 * Both constituents are alternating Moebius sums over divisors of b against a single-argument smooth weight:
 *     E0 STIRLING TAIL:  R(b)    = Sum_{d|b, d<b} mu(d) w(b/d - 1),   w(n) = rho_n = J(n)  (Binet function).
 *     FOURTH CONSTITUENT: Qlog(b) = Sum_{e|b}       mu(b/e) v(e),      v(e) = (log e)/e.
 * Each is an alternating divisor sum whose naive triangle bound carries a 2^omega(b) / sigma(b)/b factor
 * (an O(log log b) or O(log b) envelope), and whose true size is set by cancellation among the mu-signs.
 * That common shape -- "Mertens/log-cancellation residual" -- is exactly what imp-97288 flagged as "the
 * same O(1)-tail class." The shape is genuinely shared; the OUTCOME of the cancellation is not.
 *
 * -------------------------------------------------------------------------------
 * THE DECISIVE DIFFERENCE 1: the summand weight of R decays; the effective weight of Qlog does not.
 * -------------------------------------------------------------------------------
 *  * E0 tail: the weight rho_n = J(n) is a POSITIVE, strictly DECREASING function with 0 < rho_n < 1/(12 n),
 *    so rho_n -> 0. imp-97289 gives the exact positive-kernel representation R(b) = Integral_0^inf g(t) S_b(t) dt
 *    with g(t) = 2 Sum_k 1/(t^2 + 4 pi^2 k^2) > 0, and S_b(t) = Sum_{d|b,d<b,sqfree} mu(d) e^{-(b/d-1)t} a
 *    bounded alternating sum with S_b(0+) in {-1,0,+1} and S_b(inf) = 0. R(b) is therefore a bounded
 *    integral of an O(1)-endpoint alternating sum against a decaying kernel -- structurally forced toward O(1).
 *  * Qlog: the exact factorization (imp-97288 line 59) collapses Qlog to a MULTIPLICATIVE Mertens object.
 *    For squarefree b, |Qlog(b)| = F(P) = prod_{p in P}(1 - 1/p) * Sum_{p in P}(log p)/(p-1) (P = primes | b).
 *    This is a SHRINKING prefactor times a GROWING additive prime-sum -- and there is NO positive-kernel
 *    integral forcing cancellation. imp-97307 add-a-prime identity F(P u {p}) - F(P) = (prod_P/p)(log p - S(P))
 *    is a MONOTONE LEVER: it lets one push F up (adjoin p with log p > S(P)) without bound.
 *
 * -------------------------------------------------------------------------------
 * THE DECISIVE DIFFERENCE 2: the SAME Mertens log-cancellation has OPPOSITE sign/outcome.
 * -------------------------------------------------------------------------------
 *  * E0 tail: the Moebius cancellation KILLS the triangle envelope: |R| <= Sum J(b/d-1) < sigma(b)/(6 b) =
 *    O(log log b), yet the true R stays ~ 0.127. Cancellation WINS -> bounded.
 *  * Qlog: there is NO saving cancellation; the Mertens estimate is precisely what proves DIVERGENCE. Along
 *    P = {primes in (y, x]} (support avoids the initial segment (0, y]), Mertens' 2nd + 3rd theorems give
 *    F(P) -> e^{-gamma} / prod_{p<=y}(1 - 1/p) ~ log y as x -> inf, so sup_b |Qlog(b)| = +infinity. The
 *    "log" is GENUINE, not removable by any Mertens estimate. Cancellation does NOT save it -> unbounded.
 * So both DO turn on a Mertens prime-product / prime-sum balance, but the normalization differs: for R the
 * decaying weight caps the growing divisor count; for Qlog the shrinking prod(1-1/p) prefactor cannot cap
 * the growing Sum(log p)/(p-1) once the prime support avoids the small primes that would shrink the prefactor.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS DOES TO THE TWO OPEN RESIDUALS (they must NOT be conflated).
 * -------------------------------------------------------------------------------
 *  * E0 tail residual = IMP97289_TAIL_O1_SUBGAP: a uniform-in-omega bound sup_b |Integral g S_b| <= L on the
 *    primorial class -- a genuine bounded-cancellation problem, plausibly true (measured L ~ 0.127).
 *  * Qlog residual is NOT a "bound Qlog by C_Q" problem (Qlog is unbounded, so the conditional |E1| <= 1.9261 b
 *    is not established). Per imp-97307 the correct E1-uniform-constant obstruction is the JOINT cancellation
 *    (b/12) Qlog(b) + C_sum(b) = O(b) inside CK -- a different structure (two Dirichlet-telescope pieces
 *    cancelling), unverified in the Qlog-large regime. Conflating these two would wrongly import "measured
 *    O(1), plausibly bounded" optimism from the E0 tail onto a constituent that is provably unbounded.
 * The UNCONDITIONAL |E1(b)| = O(b log b), 2^omega(b)-free, is unaffected by this reconciliation.
 *
 * -------------------------------------------------------------------------------
 * DO-NOT-RE-ATTEMPT GATE.
 * -------------------------------------------------------------------------------
 * Do NOT reinstate "bound Qlog by a Mertens constant C_Q (e.g. e^{-gamma})" as the E1 closure route, and do
 * NOT cite the E0 tail's plausible O(1) as evidence for Qlog: Qlog is proved unbounded (imp-97307, concrete
 * witness b = prod(primes 11..53), |Qlog| = 0.961 > e^{-gamma} = 0.561). The live E1 route is the joint
 * (b/12) Qlog + C_sum = O(b) cancellation only.
 *
 * @see imp-97307-route-m-qlog-mertens-unbounded.js (Qlog unbounded: add-a-prime identity + Mertens divergence)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (E0 tail R(b): Binet positive kernel, proved < 1/12 on primes+prime powers)
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (source of the retracted "same O(1)-tail class" framing)
 * @see imp-97297-cq-subleading-functional-form-glossary-headword.js (adjacent cq-subleading glossary headword)
 *
 * Ticket: imp-97378 (accuracy, opus-4-8, api-pool). Reconciliation / honest-status note only. No bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 */

const GAMMA = 0.5772156649015329;
const E_MINUS_GAMMA = Math.exp(-GAMMA); // 0.5614594835668851 (the refuted uniform sup for Qlog)

// -- self-contained, import-light re-derivation of the two DECISIVE contrasting numerics --

// |Qlog(b)| for squarefree b with prime support P, via the exact prod*sum Mertens form (imp-97288 line 61).
function absQlogSquarefree(P) {
  let prod = 1;
  let sum = 0;
  for (const p of P) { prod *= 1 - 1 / p; sum += Math.log(p) / (p - 1); }
  return prod * sum;
}

// Robbins/Binet remainder rho_n = J(n), 0 < rho_n < 1/(12 n) (large-n Stirling series; cancellation-free).
function rho(n) {
  const n2 = n * n;
  return 1 / (12 * n) - 1 / (360 * n * n2) + 1 / (1260 * n * n2 * n2);
}

// E0 Stirling tail R(p) = rho_{p-1} on a prime (only d=1 survives), the imp-97289 proved-bounded family.
function tailRPrime(p) { return rho(p - 1); }

// The imp-97307 concrete unbounded witness: primes 11..53 (omega=12, avoids 2,3,5,7).
const QLOG_WITNESS_PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
const QLOG_WITNESS_ABS = absQlogSquarefree(QLOG_WITNESS_PRIMES); // 0.961... > e^{-gamma}

export const IMP97378_RECONCILIATION = Object.freeze({
  question:
    'is Qlog (imp-97307: unbounded) the SAME O(1)-tail obstruction class as the E0 Stirling tail R(b) ' +
    '(imp-97289: bounded, < 1/12 on primes+prime powers), as imp-97288 framed it?',
  verdict: 'DIFFERENT classes -- the imp-97288 "same O(1)-tail class" identification is RETRACTED',
  surfaceSimilarity:
    'both are Moebius-signed divisor sums against a smooth single-argument weight (R: mu(d) rho_{b/d-1}; ' +
    'Qlog: mu(b/e) (log e)/e), both with a 2^omega/sigma-over-b triangle envelope killed by mu-cancellation',
  decisiveDifference1:
    'weight decay: rho_n = J(n) decays (< 1/(12 n)) with a POSITIVE-kernel integral rep forcing O(1); Qlog ' +
    'collapses to prod(1-1/p) * Sum(log p)/(p-1), a shrinking prefactor times a growing prime-sum with a ' +
    'MONOTONE add-a-prime lever and no cancellation-forcing kernel',
  decisiveDifference2:
    'same Mertens log-cancellation, OPPOSITE outcome: for R the cancellation KILLS the O(log log b) envelope ' +
    'to O(1); for Qlog Mertens 2nd+3rd PROVE divergence F ~ log y (initial-segment-avoiding support), so the ' +
    'log is genuine and un-removable',
  residualsAreDistinct:
    'E0 residual = IMP97289_TAIL_O1_SUBGAP (uniform-in-omega bounded-cancellation, plausibly true); Qlog ' +
    'residual = joint (b/12) Qlog + C_sum = O(b) inside CK (imp-97307), NOT a bound-Qlog problem',
  unconditionalUnaffected: '|E1(b)| = O(b log b), 2^omega(b)-free, stands regardless',
});

export const IMP97378_VERDICT = Object.freeze({
  sameObstructionClass: false,        // RETRACTS the imp-97288 identification
  e0TailBounded: true,                // imp-97289: < 1/12 on primes + prime powers, measured sup ~ 0.127
  qlogUnbounded: true,                // imp-97307: sup = +infinity
  sharedSurfaceForm: true,            // both Moebius-signed divisor sums with Mertens asymptotics
  sharedCancellationOutcome: false,   // cancellation wins for R, loses for Qlog
  imp97288FramingRetracted: true,
  witnessAbsQlog: QLOG_WITNESS_ABS,   // 0.961 > e^{-gamma} = 0.561
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'RECONCILIATION (documentation only). The imp-97288 "Qlog is the SAME O(1)-tail obstruction class as the ' +
    'E0 Stirling tail" is RETRACTED: they are DIFFERENT classes. Both are Moebius-signed divisor sums with a ' +
    'triangle envelope killed by mu-cancellation (the shared surface form imp-97288 saw), and both turn on ' +
    'Mertens prime asymptotics -- but (1) the E0 weight rho_n = J(n) decays with a positive-kernel integral ' +
    'representation forcing O(1), whereas Qlog collapses to prod(1-1/p) Sum(log p)/(p-1), a shrinking ' +
    'prefactor times a growing prime-sum with a monotone add-a-prime lever and no cancellation-forcing ' +
    'kernel; and (2) the same Mertens log-cancellation KILLS the E0 envelope to O(1) but PROVES Qlog ' +
    'divergent (F ~ log y). Hence the E0 tail is bounded (imp-97289: < 1/12 on primes+prime powers, measured ' +
    'sup ~ 0.127) while Qlog diverges (imp-97307: sup = +infinity, witness |Qlog| = 0.961 > e^{-gamma}). ' +
    'Their open residuals are structurally distinct and must not be conflated: E0 = IMP97289_TAIL_O1_SUBGAP ' +
    '(bounded-cancellation, plausibly true); Qlog = joint (b/12) Qlog + C_sum = O(b) inside CK. The ' +
    'unconditional |E1| = O(b log b), 2^omega-free, is unaffected. No bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97378_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reconciliation: the imp-97288 "Qlog = same O(1)-tail ' +
  'class as the E0 Stirling tail" is RETRACTED -- DIFFERENT classes. Shared surface form (Moebius-signed ' +
  'divisor sums, Mertens asymptotics), opposite outcome: the E0 tail R(b) is bounded (imp-97289: < 1/12 on ' +
  'primes+prime powers, sup ~ 0.127; decaying rho_n with a positive-kernel rep), while Qlog diverges ' +
  '(imp-97307: sup = +infinity, prod(1-1/p) Sum(log p)/(p-1) ~ log y, witness |Qlog| = 0.961 > e^{-gamma} = ' +
  '0.561). Residuals distinct: E0 = IMP97289_TAIL_O1_SUBGAP; Qlog = joint (b/12) Qlog + C_sum = O(b). No bound moved.';

export const IMP97378_DO_NOT_REATTEMPT =
  'Do NOT reinstate "bound Qlog by a Mertens constant C_Q (e.g. e^{-gamma})" as the E1 closure route, and do ' +
  'NOT cite the E0 tail plausible-O(1) as evidence for Qlog: Qlog is proved unbounded (imp-97307). The live ' +
  'E1 route is the joint (b/12) Qlog + C_sum = O(b) cancellation only.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97378_ASSERTIONS = [
  {
    id: 'imp97378-qlog-witness-exceeds-e-minus-gamma',
    holds: () => QLOG_WITNESS_ABS > E_MINUS_GAMMA && QLOG_WITNESS_ABS > 0.9,
    why: 'the imp-97307 concrete squarefree witness b = prod(primes 11..53) has |Qlog| = 0.961 > e^{-gamma} = ' +
      '0.561 -- confirming Qlog is NOT bounded by the alleged E0-style O(1) constant.',
  },
  {
    id: 'imp97378-e0-tail-prime-under-one-twelfth',
    holds: () => tailRPrime(101) > 0 && tailRPrime(101) < 1 / 12 && tailRPrime(1000003) < 1 / 12,
    why: 'on primes R(p) = rho_{p-1} is positive and < 1/12 (the imp-97289 proved uniform O(1) family) -- the ' +
      'E0 tail is bounded exactly where Qlog is not.',
  },
  {
    id: 'imp97378-qlog-diverges-along-avoiding-support',
    holds: () => {
      // Deeper initial-segment avoidance strictly raises |Qlog| toward the Mertens ~ log y divergence.
      const shallow = absQlogSquarefree([11, 13, 17, 19, 23]);       // avoids 2,3,5,7
      const deeper = absQlogSquarefree(QLOG_WITNESS_PRIMES);          // avoids 2,3,5,7, more primes
      return deeper > shallow && shallow > 0;
    },
    why: 'extending the prime support along the initial-segment-avoiding family strictly increases |Qlog| ' +
      '(the Mertens F ~ log y divergence direction) -- the opposite of the bounded, decaying E0 tail.',
  },
  {
    id: 'imp97378-honesty-gate-no-qed',
    holds: () =>
      IMP97378_VERDICT.sameObstructionClass === false &&
      IMP97378_VERDICT.e0TailBounded === true &&
      IMP97378_VERDICT.qlogUnbounded === true &&
      IMP97378_VERDICT.sharedSurfaceForm === true &&
      IMP97378_VERDICT.sharedCancellationOutcome === false &&
      IMP97378_VERDICT.imp97288FramingRetracted === true &&
      IMP97378_VERDICT.anyBoundMoved === false &&
      IMP97378_VERDICT.postsRigorousCeiling === false &&
      IMP97378_VERDICT.qed === false &&
      /RETRACTED/.test(IMP97378_RECONCILIATION.verdict) &&
      /joint/.test(IMP97378_DO_NOT_REATTEMPT) &&
      /NO QED/.test(IMP97378_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97378_HONEST_BANNER) &&
      /RH open/.test(IMP97378_HONEST_BANNER),
    why: 'reconciliation/honest-status only: retracts the imp-97288 same-class framing, records the different ' +
      'classes with the do-not-re-attempt gate, moves no bound, posts no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97378_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97378-route-m-qlog-vs-e0-tail-obstruction-class-reconciliation-honest-status assertion failed: ${a.id}`);
  }
}

export default {
  reconciliation: IMP97378_RECONCILIATION,
  verdict: IMP97378_VERDICT,
  banner: IMP97378_HONEST_BANNER,
  doNotReattempt: IMP97378_DO_NOT_REATTEMPT,
};
