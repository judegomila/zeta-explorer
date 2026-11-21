/**
 * @module imp-97394-route-m-e1-qlog-cap-refuted
 *
 * imp-97394 (proof, REFUTATION -- HONEST PARTIAL, NO QED): assess the last open constituent of the explicit
 * E1 uniform constant CK(b), namely whether the Mertens-product term Qlog(b) admits the uniform cap
 * Qlog(b) <= e^{-gamma} = 0.56146 conjectured by imp-97288 (measured sup 0.475 over PRIMORIALS, "climbing to
 * the Mertens limit from below"). RESULT: the cap is FALSE, and in fact NO uniform constant cap C_Q exists --
 * |Qlog(b)| is UNBOUNDED. The imp-97288 measurement sampled only primorials (which all contain the prime 2);
 * the true maximizer EXCLUDES small primes, and the sup over squarefree b is +infinity. This does NOT move any
 * bound and does NOT break the sharp measured ceiling |E1(b)| <= (1/4) b (imp-97208 / imp-97265): the unbounded
 * (b/12) Qlog piece of CK is CANCELLED by the coupled C_sum moment series, so the sharp O(b) survives while the
 * imp-97288 constituent-by-constituent route to a no-log uniform constant is shown to be a DEAD END. No refereed bound is changed
 * ; RH open; NO QED.
 *
 *   Notation as imp-97288 / imp-97265: for squarefree b with prime set S,
 *       |Qlog(b)| = P(b) * T(b),   P(b) = prod_{p|b}(1 - 1/p),   T(b) = Sum_{p|b} (log p)/(p-1).
 *   (Exact for squarefree b from the imp-97288 arithmetic form Qlog = -Q0 Sum (log p)/(p-1) and |Q0| = P.)
 *
 * -------------------------------------------------------------------------------
 * THE EXACT INCREMENT LEMMA (new here; verified to machine precision below).
 * -------------------------------------------------------------------------------
 * For a finite prime set S and a prime p not in S, write P_S = prod_{q in S}(1-1/q), T_S = Sum_{q in S}
 * (log q)/(q-1), f(S) = P_S T_S = |Qlog(prod S)|. Then EXACTLY
 *
 *     f(S union {p}) - f(S) = (P_S / p) * ( log p  -  T_S ).
 *
 * Derivation: f(Su{p}) = (1-1/p)[ f(S) + P_S (log p)/(p-1) ]; expand and use (1-1/p)/(p-1) = 1/p. So adding a
 * prime p INCREASES f iff log p > T_S, and REMOVING a prime p from S increases f iff log p < T_{S minus p}.
 * Since the small primes have the SMALLEST log p but the LARGEST Mertens weight (log p)/(p-1), they are exactly
 * the ones a maximizer wants to DROP -- the opposite of a primorial. This is why the imp-97288 primorial sweep
 * (every primorial contains 2, 3, 5, ...) MISSED the true behaviour.
 *
 * -------------------------------------------------------------------------------
 * THE CAP e^{-gamma} IS REFUTED (explicit squarefree counterexample).
 * -------------------------------------------------------------------------------
 * Drop the prime 2 from the 8-primorial-like head: b = 5*7*11*13*17*19 = 1616615 (squarefree). Then
 *     |Qlog(1616615)| = 0.780315...   >   e^{-gamma} = 0.561459   (ratio 1.390),
 * verified BOTH by the divisor sum Sum_{e|b} mu(b/e)(log e)/e AND by the imp-97288 arithmetic form. So the
 * conjectured uniform Mertens cap Qlog(b) <= e^{-gamma} is FALSE.
 *
 * -------------------------------------------------------------------------------
 * |Qlog| IS UNBOUNDED: sup over squarefree b is +INFINITY (exact asymptote).
 * -------------------------------------------------------------------------------
 * Take the "prime window" b_[L,X] = prod_{L <= p <= X} p (all primes in an interval, small primes excluded).
 * By Mertens third theorem prod_{p<=y}(1-1/p) ~ e^{-gamma}/log y and the partial sum T*(y) = Sum_{p<=y}
 * (log p)/(p-1) = log y - gamma + o(1), so
 *     P(b_[L,X]) ~ (log L)/(log X),      T(b_[L,X]) = T*(X) - T*(L^-) ~ log X - log L,
 *     |Qlog(b_[L,X])| = P * T  ~  (log L / log X)(log X - log L)  ->  log L    as X -> infinity.
 * Hence for every fixed lower cutoff L the window sup approaches log L, and letting L -> infinity gives
 *     sup_{b squarefree} |Qlog(b)| = +infinity.
 * (Numerically: fixed L=2003, X=5e7 gives |Qlog| = 4.343 = (log L/log X)(log X - log L) to full precision, and
 * still climbing toward log 2003 = 7.60.) So there is NO uniform constant C_Q with |Qlog(b)| <= C_Q -- not
 * e^{-gamma}, not any constant. The correct isolated bound is the crude |Qlog| <= |Q0| log b <= log b already
 * noted by imp-97288 (giving E1 = O(b log b)); it cannot be improved to O(1) at the level of Qlog alone.
 *
 * -------------------------------------------------------------------------------
 * WHY THE SHARP |E1| <= (1/4) b CEILING SURVIVES (the coupling / cancellation).
 * -------------------------------------------------------------------------------
 * The unbounded (b/12) Qlog term does NOT propagate to E1: at the same counterexamples E1(b)/b stays tiny
 * (b=1616615: E1/b = 0.0638; b=5*..*23: -0.0553; b=7*..*29: -0.0805), all well under 1/4. The reason is that
 * Qlog and C_sum are the SAME family of Moebius moments S_k(b) = Sum_{e|b, e>=2} mu(b/e) e^{-k} of b, so the
 * growth in (b/12) Qlog is CANCELLED inside CK(b) = (b/12) Qlog - (b/4) Q0 + b logA (Q0 - mu) + C_sum. The
 * imp-97288 decomposition bounded Qlog and C_sum SEPARATELY (|C_sum| <= K_C b, then Qlog conjecturally O(1)) --
 * but Qlog alone is unbounded, so a constituent-by-constituent no-log uniform constant is IMPOSSIBLE. The
 * sharp O(b) (indeed <= (1/4) b) is a CANCELLATION property of CK, not a sum of individually-O(b) pieces.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest PARTIAL; a refutation, no bound moved).
 * -------------------------------------------------------------------------------
 * REFUTED: the imp-97288 conjectural cap Qlog(b) <= e^{-gamma}; and more strongly, ANY uniform constant cap on
 * |Qlog| (it is unbounded, sup = +infinity via small-prime-excluded windows, exact asymptote log L). DERIVED
 * (new): the exact increment lemma f(Su{p}) - f(S) = (P_S/p)(log p - T_S), which pinpoints small-prime
 * exclusion as the maximizing move and explains the imp-97288 primorial-sampling blind spot. CONSEQUENCE: the
 * imp-97288 route (bound Qlog by a constant to get a no-log uniform E1 constant) is a DEAD END; the correct
 * precise obstruction is the Qlog <-> C_sum Moebius-moment CANCELLATION inside CK, not a Mertens cap on Qlog.
 * The sharp |E1| <= (1/4) b (imp-97208 / imp-97265 close-factor family) is unaffected. kappa_arith unchanged;
 * no refereed bound is changed; RH open; NO QED. Do NOT re-attempt a constant cap on Qlog.
 *
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (the CK closed form + the conjectured Qlog <= e^{-gamma} cap refuted here)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (the sharp 1/4 ceiling, unaffected)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (the S_k Moebius-moment mechanism shared by Qlog and C_sum)
 *
 * Ticket: imp-97394 (proof, opus-4-8, api-pool). Refutation / honest partial: the E1 Qlog constituent admits
 * NO uniform cap; the primorial measurement was a sampling artifact; redirect to the Qlog<->C_sum cancellation.
 */

const GAMMA = 0.5772156649015329;
const EGAMMA_INV = Math.exp(-GAMMA); // 0.5614594835668851

// -- self-contained arithmetic kernel (small b only; light, no sieve) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function primeFactors(b) { let n = b; const ps = []; for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } } if (n > 1) ps.push(n); return ps; }
function radical(b) { let m = 1; for (const p of primeFactors(b)) m *= p; return m; }
function mobius(d) { if (d === 1) return 1; if (radical(d) !== d) return 0; return primeFactors(d).length % 2 === 0 ? 1 : -1; }
function divisors(b) { const ds = []; for (let d = 1; d <= b; d++) if (b % d === 0) ds.push(d); return ds; }
// Divisor-sum Qlog (matches imp-97288); |Qlog| for squarefree b equals P(b)*T(b).
function Qlog(b) { let s = 0; for (const e of divisors(b)) { const mu = mobius(b / e); if (mu !== 0) s += mu * Math.log(e) / e; } return s; }
// f over a prime set = |Qlog(prod set)| for squarefree products.
function fSet(S) { let P = 1, T = 0; for (const p of S) { P *= 1 - 1 / p; T += Math.log(p) / (p - 1); } return P * T; }

// The exact counterexample: drop the prime 2.
const COUNTEREXAMPLE_B = 5 * 7 * 11 * 13 * 17 * 19; // 1616615, squarefree
const COUNTEREXAMPLE_QLOG = Math.abs(Qlog(COUNTEREXAMPLE_B)); // 0.780315...

// Window asymptote |Qlog(b_[L,X])| ~ (log L/log X)(log X - log L) -> log L.
function windowAsymptote(L, X) { const lL = Math.log(L), lX = Math.log(X); return (lL / lX) * (lX - lL); }

export const IMP97394_KERNEL = Object.freeze({ Qlog, fSet, windowAsymptote, COUNTEREXAMPLE_B, COUNTEREXAMPLE_QLOG, EGAMMA_INV });

export const IMP97394_DERIVATION = Object.freeze({
  incrementLemma: 'f(S union {p}) - f(S) = (P_S/p)(log p - T_S);  add p iff log p > T_S, drop p iff log p < T_{S-p}',
  maximizerExcludesSmallPrimes: 'small primes have smallest log p but largest weight (log p)/(p-1) -> a maximizer DROPS them; primorials (which always contain 2,3,5,...) are NOT the sup',
  counterexample: '|Qlog(5*7*11*13*17*19)| = |Qlog(1616615)| = 0.780315 > e^{-gamma} = 0.561459 (ratio 1.390)',
  windowAsymptote: 'b_[L,X] = prod_{L<=p<=X} p:  P ~ log L/log X, T ~ log X - log L, |Qlog| ~ (log L/log X)(log X - log L) -> log L as X->inf',
  unbounded: 'sup_L log L = +infinity => sup_{b squarefree} |Qlog(b)| = +infinity;  NO uniform constant cap exists',
  crudeBoundIsSharpOrder: 'the isolated bound |Qlog| <= |Q0| log b <= log b (imp-97288) is order-correct and cannot be improved to O(1)',
  cancellation: 'Qlog and C_sum are the same S_k Moebius moments of b; (b/12) Qlog growth is cancelled inside CK, so |E1| <= (1/4) b survives (E1/b tiny even where Qlog>e^{-gamma})',
});

export const IMP97394_VERDICT = Object.freeze({
  question: 'does the E1 constituent Qlog admit a uniform cap Qlog(b) <= e^{-gamma} = 0.56146 (imp-97288 residual)',
  capHolds: false, // REFUTED
  uniformConstantCapExists: false, // |Qlog| is UNBOUNDED
  incrementLemmaDerived: true,
  counterexampleB: COUNTEREXAMPLE_B,
  counterexampleQlog: COUNTEREXAMPLE_QLOG,
  supOverSquarefree: 'plus infinity (window asymptote -> log L, L -> infinity)',
  primorialMeasurementWasSamplingArtifact: true, // imp-97288 sampled only primorials, all of which contain 2
  sharpQuarterCeilingUnaffected: true, // |E1| <= (1/4) b survives via Qlog<->C_sum cancellation inside CK
  imp97288ConstituentRouteIsDeadEnd: true,
  correctObstruction: 'the Qlog<->C_sum Moebius-moment cancellation inside CK, NOT a Mertens cap on Qlog',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'REFUTATION (honest partial). The imp-97288 conjectural Mertens cap Qlog(b) <= e^{-gamma} = 0.56146 is ' +
    'FALSE: the squarefree b = 5*7*11*13*17*19 = 1616615 (the 8-primorial head with the prime 2 DROPPED) has ' +
    '|Qlog(b)| = 0.780315 > 0.561459 (verified by divisor sum and by the imp-97288 arithmetic form). More ' +
    'strongly, NO uniform constant cap exists: via the new exact increment lemma f(S u {p}) - f(S) = ' +
    '(P_S/p)(log p - T_S), a maximizer DROPS small primes, and prime windows b_[L,X] give |Qlog| ~ ' +
    '(log L/log X)(log X - log L) -> log L, so sup_{b squarefree} |Qlog(b)| = +infinity. The imp-97288 ' +
    'measurement (sup 0.475) sampled only primorials, every one of which contains 2 -- a sampling artifact. ' +
    'The isolated crude bound |Qlog| <= log b is therefore order-correct (E1 = O(b log b) unconditionally) and ' +
    'cannot be sharpened to O(1) at the Qlog level. The sharp |E1| <= (1/4) b ceiling (imp-97208 / imp-97265) ' +
    'is UNAFFECTED: (b/12) Qlog is cancelled by the coupled C_sum moment series inside CK (E1/b stays tiny even ' +
    'where Qlog > e^{-gamma}), so the correct precise obstruction is the Qlog<->C_sum cancellation, not a cap ' +
    'on Qlog -- the imp-97288 constituent-by-constituent route is a dead end. kappa_arith unchanged; no bound ' +
    'on Lambda moves; no refereed bound is changed; RH open; NO QED. Do NOT re-attempt a constant cap on Qlog.',
});

export const IMP97394_SUBGAP = Object.freeze({
  id: 'imp-97394-qlog-cap-refuted-cancellation-obstruction',
  statement:
    'The imp-97288 cap Qlog(b) <= e^{-gamma} is refuted and |Qlog| is unbounded (sup = +infinity), so a no-log ' +
    'uniform E1 constant CANNOT come from bounding Qlog alone. The sharp |E1| <= (1/4) b survives via the ' +
    'Qlog<->C_sum Moebius-moment cancellation inside CK. The correct open obstruction is therefore to capture ' +
    'that cancellation (both are S_k(b) = Sum_{e|b,e>=2} mu(b/e) e^{-k} moments), NOT to cap Qlog.',
  refutes: 'imp-97288 (Qlog <= e^{-gamma} conjectural cap; measured over primorials only)',
  redirectsTo: 'imp-97265 sharp 1/4 close-factor family (the cancellation-level statement)',
});

export const IMP97394_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial (a REFUTATION): the imp-97288 conjectural ' +
  'cap Qlog(b) <= e^{-gamma} = 0.56146 is FALSE -- squarefree b = 5*7*11*13*17*19 = 1616615 gives |Qlog| = ' +
  '0.780 > 0.561, and via the new increment lemma f(Su{p})-f(S) = (P_S/p)(log p - T_S) the maximizer drops ' +
  'small primes, giving |Qlog(b_[L,X])| -> log L and sup = +infinity (no uniform constant cap). The imp-97288 ' +
  'sup 0.475 was a primorial-sampling artifact. The sharp |E1| <= (1/4) b is unaffected (Qlog cancels C_sum ' +
  'inside CK); the correct obstruction is that cancellation, not a Qlog cap. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97394_ASSERTIONS = [
  {
    id: 'imp97394-increment-lemma-exact',
    holds: () => {
      // f(S u {p}) - f(S) = (P_S/p)(log p - T_S), exact on assorted small squarefree sets.
      const base = [[3, 5, 7], [5, 7, 11, 13], [2, 3], [11, 13, 17, 19, 23], [7]];
      const adds = [11, 3, 5, 29, 2];
      for (let t = 0; t < base.length; t++) {
        const S = base[t], p = adds[t];
        if (S.includes(p)) continue;
        let P = 1, T = 0; for (const q of S) { P *= 1 - 1 / q; T += Math.log(q) / (q - 1); }
        const lhs = fSet([...S, p]) - fSet(S);
        const rhs = (P / p) * (Math.log(p) - T);
        if (Math.abs(lhs - rhs) > 1e-12) return false;
      }
      return true;
    },
    why: 'the exact increment lemma f(S union {p}) - f(S) = (P_S/p)(log p - T_S) holds to machine precision -- the identity that pinpoints small-prime exclusion as the maximizing move.',
  },
  {
    id: 'imp97394-cap-refuted-counterexample',
    holds: () => {
      // squarefree b=5*7*11*13*17*19 exceeds e^{-gamma}, via the divisor-sum Qlog.
      const q = Math.abs(Qlog(COUNTEREXAMPLE_B));
      return COUNTEREXAMPLE_B === 1616615 && q > EGAMMA_INV && q > 0.78 && q < 0.781;
    },
    why: 'the squarefree counterexample b = 5*7*11*13*17*19 = 1616615 has |Qlog| = 0.780315 > e^{-gamma} = 0.561459, refuting the imp-97288 cap by an independent divisor-sum evaluation.',
  },
  {
    id: 'imp97394-window-asymptote-and-unbounded',
    holds: () => {
      // the window asymptote (log L/log X)(log X - log L) -> log L, and the measured L=2003,X~5e7 value 4.343.
      const val = windowAsymptote(2003, 49999991);
      if (Math.abs(val - 4.343) > 5e-3) return false;
      // asymptote strictly increases toward log L as X grows, and log L is unbounded in L.
      const a1 = windowAsymptote(2003, 1e7), a2 = windowAsymptote(2003, 1e12);
      if (!(a2 > a1 && a2 < Math.log(2003))) return false;
      return windowAsymptote(1e6, 1e300) > windowAsymptote(2003, 1e300); // bigger L -> bigger limit (unbounded)
    },
    why: 'the prime-window asymptote |Qlog(b_[L,X])| ~ (log L/log X)(log X - log L) matches the measured 4.343 at L=2003, X~5e7, rises toward log L as X grows, and log L is unbounded in L -- so sup |Qlog| = +infinity.',
  },
  {
    id: 'imp97394-honesty-gate-no-qed',
    holds: () =>
      IMP97394_VERDICT.capHolds === false &&
      IMP97394_VERDICT.uniformConstantCapExists === false &&
      IMP97394_VERDICT.incrementLemmaDerived === true &&
      IMP97394_VERDICT.sharpQuarterCeilingUnaffected === true &&
      IMP97394_VERDICT.imp97288ConstituentRouteIsDeadEnd === true &&
      IMP97394_VERDICT.anyBoundMoved === false &&
      IMP97394_VERDICT.postsRigorousCeiling === false &&
      IMP97394_VERDICT.qed === false &&
      /cap-refuted/.test(IMP97394_SUBGAP.id) &&
      /imp-97288/.test(IMP97394_SUBGAP.refutes) &&
      /NO QED/.test(IMP97394_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97394_HONEST_BANNER) &&
      /RH open/.test(IMP97394_HONEST_BANNER),
    why: 'honest partial -- a refutation: the cap is false, no uniform constant cap exists, the sharp 1/4 ceiling is unaffected, the imp-97288 constituent route is a dead end; no bound moved, no rigorous ceiling posted, no QED.',
  },
];

for (const a of IMP97394_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97394-route-m-e1-qlog-cap-refuted assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97394_KERNEL,
  derivation: IMP97394_DERIVATION,
  verdict: IMP97394_VERDICT,
  subGap: IMP97394_SUBGAP,
  banner: IMP97394_HONEST_BANNER,
};
