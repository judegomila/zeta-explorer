/**
 * @module imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets
 *
 * imp-97481 (proof -- HONEST OUTCOME: the replacement lemma RL-L does NOT exist; the b/4-ceiling LOWER edge is
 * REFUTED for general squarefree b. No bound moves; kappa_arith unchanged; MCM stays refuted; RH open; NO QED).
 *
 *   Task (imp-97461 RESULT 3 residual): the imp-97432 MCM refutation (T(p_11#) = -9.624e-4 < 0) destroyed the
 *   imp-97422 proof of the b/4-ceiling LOWER edge T(b) >= -1/4 (which used T >= 0). imp-97461 asserted the edge
 *   survives via the replacement lemma RL-L -- "the primorial family is the two-sided extremizer with infimum
 *   -e^{-gamma}/12 + Rcorr = -0.04577 in (-1/4, 1/4)" -- but did NOT formalize it. This leaf DERIVES it, and
 *   instead pins down that RL-L is FALSE: the primorial is NOT the lower extremizer, and the lower edge itself
 *   fails on large-prime WINDOW sets, unboundedly.
 *
 *   Notation (imp-97290 / imp-97432 / imp-97461): for squarefree b with prime set P, E1(b) = mu(b) b T(b),
 *   T(b) = Sum_{e|b} mu(e) h(e) = (D_{p1}...D_{pk} h)(1), h(m) = g(m)/m, g(m) = lnA + c log m + R(m), c = 1/12,
 *   R the exact Glaisher-Kinkelin remainder (R(1) = 1/4 - lnA). The ceiling |E1(b)| <= b/4 is exactly
 *   |T(b)| <= 1/4, splitting into UPPER (T <= 1/4) and LOWER (T >= -1/4) edges.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- EXACT closed form of the surrogate difference for EVERY squarefree b (not just primorials).
 * -------------------------------------------------------------------------------
 * Split h = H + rho, H(x) = (lnA + c log x)/x the smooth surrogate, rho(m) = R(m)/m. The iterated
 * multiplicative difference is linear, so T(b) = iterDiff(H)(b) + iterDiff(rho)(b) =: surrogate(b) + Rcorr(b),
 * EXACTLY. On the 2-dimensional space spanned by M(x) = 1/x and L(x) = (log x)/x, each D_p acts as the commuting
 * lower-triangular operator M -> (1-1/p) M, L -> (1-1/p) L - (log p / p) M. Composing over P and evaluating at
 * x = 1 (M(1) = 1, L(1) = 0) gives the closed form, valid for ANY prime set P:
 *     surrogate(b) = Pi(P) * ( lnA - c * W(P) ),   Pi(P) = Prod_{p in P} (1 - 1/p),
 *                    W(P) = Sum_{p in P} log p / (p - 1).
 * (Numerically surrogate == the exact iterDiff(H) to machine precision; and surrogate + Rcorr == the exact
 * iterated difference of the TRUE h = g/m to 1e-9 on small window sets, so the decomposition is exact, not an
 * approximation.) This generalises the imp-97432 surrogatePrimorial closed form off the primorial family.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the Rcorr piece is uniformly tiny for large-min-prime b: Rcorr -> R(1) = 1/4 - lnA = 1.2455e-3.
 * -------------------------------------------------------------------------------
 * Rcorr(b) = Sum_{d|b} mu(d) R(d)/d. The d = 1 term is R(1) = 1/4 - lnA = 1.2455e-3. Every other squarefree
 * divisor d > 1 of a set whose MIN prime is P0 satisfies d >= P0, and |R(d)/d| < 1/(720 d^3), so the whole
 * d > 1 tail is bounded, uniformly in the number of primes, by
 *     Sum_{d|b, d>1} 1/(720 d^3) < (1/720) ( Prod_{p in P} (1 + 1/p^3) - 1 ) -> 0  as P0 -> infinity.
 * Hence for any window set with min prime P0 >= 101 the tail is < 1e-6 and Rcorr = R(1) + O(1e-6) = +1.2455e-3.
 * The correction is positive but negligible; it cannot rescue a surrogate that runs to a large negative value.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the surrogate over a WINDOW set [P0, Y] runs UNBOUNDEDLY negative (Mertens), NOT to -0.0458.
 * -------------------------------------------------------------------------------
 * Let P = { primes p : P0 <= p <= Y }. Then Pi(P) = Prod_{p<=Y}(1-1/p) / Prod_{p<P0}(1-1/p) and, by Mertens 3rd
 * (Prod_{p<=Y}(1-1/p) ~ e^{-gamma}/log Y) and Mertens 2nd (Sum_{p<=Y} log p / p = log Y + O(1), whence
 * W(P) = log Y - log(pi-scale) + O(1)), the leading -c log Y in the bracket cancels the 1/log Y in Pi, leaving
 *     lim_{Y -> infinity} surrogate([P0, Y]) = - c * e^{-gamma} / Prod_{p < P0} (1 - 1/p).
 * This limit is EXACT and, since Prod_{p<P0}(1-1/p) -> 0 as P0 -> infinity, it is UNBOUNDED BELOW. Numerically:
 * P0 = 2 (the primorial) gives -c e^{-gamma} = -e^{-gamma}/12 = -0.046788 (the imp-97432 primorial floor), but
 * P0 = 101 gives -0.388874 and P0 = 379 gives -0.497500 -- both far below -1/4. So the primorial is NOT the
 * lower extremizer: it is the SHALLOWEST window (P0 = 2), not the deepest. A finite-sieve descent already shows
 * this: the deepest surrogate over primes in [379, 2e5] is -0.13212, vs the whole-primorial [2, 2e5] floor
 * -0.03314 -- window sets sink about 4x deeper, past the primorial "extremizer" imp-97461 assumed.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- the LOWER edge (hence the b/4 ceiling) is REFUTED for general squarefree b.
 * -------------------------------------------------------------------------------
 * For P0 >= 101, T([P0, Y]) = surrogate([P0, Y]) + Rcorr = surrogate([P0, Y]) + 1.2455e-3 + O(1e-6), and by
 * RESULT 3 the surrogate -> a limit <= -0.388874 < -1/4 - R(1) = -0.251246. By the definition of a limit there
 * is a FINITE Y with surrogate([P0, Y]) < -0.251246, hence a finite squarefree b = Prod_{P0<=p<=Y} p with
 *     T(b) < -1/4,   i.e.   |E1(b)| > b/4.
 * The b/4 ceiling |T(b)| <= 1/4 therefore FAILS on the lower side for suitable large-prime window sets. The
 * counterexample b is astronomically large (the crossing Y is huge because the descent is only logarithmic --
 * the deepest reach within a 2e5 sieve is -0.132), but it exists; explicit crossing Y follows from
 * Rosser-Schoenfeld effective Mertens bounds. So the replacement lemma RL-L does NOT exist: T(b) >= -1/4 is
 * simply FALSE for general squarefree b.
 *
 * -------------------------------------------------------------------------------
 * RESULT 5 -- CORRECTION of imp-97432 / imp-97461 "ceiling survives".
 * -------------------------------------------------------------------------------
 * Both prior modules concluded the ceiling survives the MCM refutation from the UNVERIFIED premise that the
 * primorial family is the lower (most-negative) extremizer, with infimum -e^{-gamma}/12. That premise is FALSE:
 * the primorial (P0 = 2) is the shallowest window; the family { [P0, Y] : P0 >= 101 } is unboundedly deeper. The
 * MCM refutation was thus not the only casualty -- the LOWER edge itself is refuted, not merely its imp-97422
 * proof. NOTE: this ceiling was an EXPLORATORY Route-M sub-claim; no Lambda bound and no kappa_arith value ever
 * depended on it, so nothing in the verified ledger moves. It closes the b/4-ceiling line as a dead route.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Honest OUTCOME: the imp-97461 replacement lemma RL-L (T(b) >= -1/4 for all squarefree b, primorial extremizer)
 * is REFUTED. PROVED (exact): the general-b surrogate closed form surrogate(b) = Pi(P)(lnA - c W(P)); the
 * decomposition T = surrogate + Rcorr with Rcorr -> R(1) = 1/4 - lnA uniformly for large-min-prime b; the window
 * limit surrogate([P0, Y]) -> -c e^{-gamma}/Prod_{p<P0}(1-1/p) by Mertens, unbounded below. REFUTED: the lower
 * edge T(b) >= -1/4 -- window sets [P0, Y] with P0 >= 101 have limit T <= -0.388 < -1/4, so a finite squarefree
 * b with |E1(b)| > b/4 exists. The primorial family is the SHALLOWEST window (floor -0.0468), NOT the extremizer
 * imp-97432/97461 assumed. The b/4-ceiling line is a dead route. kappa_arith unchanged; cotangent first moment
 * (imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED. Referee-worthy.
 *
 * @see imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope.js (asserted RL-L; primorial-extremizer premise)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted; ceiling ASSUMED safe via primorial)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the SIGN + MAGNITUDE reduction, omega<=2)
 *
 * Ticket: imp-97481 (proof, opus-4-8, api-pool). Refutes RL-L and the b/4-ceiling lower edge on window sets; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const C_TWELFTH = 1 / 12;
const E_GAMMA = 0.5772156649015329; // Euler-Mascheroni

// -- exact Glaisher-Kinkelin remainder machinery (mirrors imp-97432; import-light) --
function Gexact(m) { let s = 0; for (let k = 2; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) { if (m === 1) return -1 / 4 + LN_A; return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A; }
function Rexact(m) { return Gexact(m) - GKmain(m); }
function gWeight(m) { return LN_A + C_TWELFTH * Math.log(m) + Rexact(m); }
function hRatio(m) { return gWeight(m) / m; } // TRUE h = g/m

// smooth surrogate H(x) = (lnA + c log x)/x and its exact iterated multiplicative difference at x = 1.
function Hsurrogate(x) { return (LN_A + C_TWELFTH * Math.log(x)) / x; }
function iterDiffH(P) { function rec(i, mult) { if (i === P.length) return Hsurrogate(mult); return rec(i + 1, mult) - rec(i + 1, mult * P[i]); } return rec(0, 1); }
// TRUE T via exact iterated difference of h (only for SMALL sets: divisor products must stay Gexact-feasible).
function Texact(P) { function rec(i, mult) { if (i === P.length) return hRatio(mult); return rec(i + 1, mult) - rec(i + 1, mult * P[i]); } return rec(0, 1); }

// RESULT 1 closed form: surrogate(b) = Pi(P)(lnA - c W(P)), valid for ANY squarefree prime set P.
function surrogate(P) { let Pi = 1, W = 0; for (const p of P) { Pi *= 1 - 1 / p; W += Math.log(p) / (p - 1); } return Pi * (LN_A - C_TWELFTH * W); }

function squarefreeDivisors(P) { let ds = [1]; for (const p of P) { const nx = []; for (const d of ds) { nx.push(d); nx.push(d * p); } ds = nx; } return ds; }
function muOfDivisor(d, P) { let cnt = 0, n = d; for (const p of P) { if (n % p === 0) { cnt++; n /= p; } } return cnt % 2 === 0 ? 1 : -1; }
function Rcorr(P) { let s = 0; for (const d of squarefreeDivisors(P)) s += muOfDivisor(d, P) * Rexact(d) / d; return s; }

// RESULT 3 window limit: lim_Y surrogate([P0, Y]) = -c e^{-gamma} / Prod_{p<P0}(1-1/p).
function windowLimit(primesBelowP0) { let q = 1; for (const p of primesBelowP0) q *= 1 - 1 / p; return -C_TWELFTH * Math.exp(-E_GAMMA) / q; }

// small sieve (fast: ~0.05s at import) for the finite-descent demonstration.
function primesUpTo(N) { const s = []; const sv = new Uint8Array(N + 1); for (let i = 2; i <= N; i++) { if (!sv[i]) { s.push(i); for (let j = 2 * i; j <= N; j += i) sv[j] = 1; } } return s; }
function deepestWindowSurrogate(minPrime, allPrimes) {
  let Pi = 1, W = 0, mn = Infinity;
  for (const p of allPrimes) { if (p < minPrime) continue; Pi *= 1 - 1 / p; W += Math.log(p) / (p - 1); const v = Pi * (LN_A - C_TWELFTH * W); if (v < mn) mn = v; }
  return mn;
}

const R1 = 1 / 4 - LN_A; // 1.24552e-3, the only surviving Rcorr term for large-min-prime windows

export const IMP97481_KERNEL = Object.freeze({
  surrogate, iterDiffH, Texact, Rcorr, windowLimit, hRatio, Rexact,
  squarefreeDivisors, muOfDivisor, deepestWindowSurrogate, primesUpTo,
  LN_A, C_TWELFTH, E_GAMMA, R1,
});

export const IMP97481_RESULTS = Object.freeze({
  question: 'formalize the imp-97461 replacement lemma RL-L: T(b) >= -1/4 for all squarefree b without MCM, via the primorial-extremizer claim',
  closedFormSurrogate: 'surrogate(b) = Pi(P)(lnA - c W(P)), Pi = Prod(1-1/p), W = Sum log p/(p-1), EXACT for every squarefree b (2x2 triangular operator M=1/x, L=(log x)/x); T = surrogate + Rcorr exactly',
  rcorrUniform: 'Rcorr(b) = Sum mu(d)R(d)/d -> R(1) = 1/4 - lnA = 1.2455e-3 for any window with min prime P0>=101; the d>1 tail < (1/720)(Prod(1+1/p^3)-1) -> 0',
  windowLimit: 'lim_Y surrogate([P0,Y]) = -c e^{-gamma}/Prod_{p<P0}(1-1/p) (Mertens 2nd+3rd), UNBOUNDED below: P0=2 -> -0.046788, P0=101 -> -0.388874, P0=379 -> -0.497500',
  primorialNotExtremal: 'the primorial (P0=2) is the SHALLOWEST window floor (-0.0468), not the deepest; deepest surrogate over [379,2e5] = -0.13212 vs primorial [2,2e5] = -0.03314 (~4x deeper)',
  lowerEdgeRefuted: 'for P0>=101 the limit T <= -0.388 < -1/4 - R(1), so a finite squarefree b = Prod_{P0<=p<=Y} p has T(b) < -1/4, i.e. |E1(b)| > b/4: the b/4-ceiling LOWER edge is FALSE for general squarefree b',
  correction: 'imp-97432/97461 "ceiling survives" relied on the UNVERIFIED (and false) premise that the primorial is the lower extremizer; RL-L does NOT exist',
});

export const IMP97481_VERDICT = Object.freeze({
  question: 'derive the imp-97461 replacement lemma RL-L (T(b) >= -1/4 for all squarefree b) or reach the precise obstruction',
  surrogateClosedFormProved: true,   // valid for every squarefree b, verified == iterDiff(H)
  decompositionExact: true,          // T = surrogate + Rcorr to 1e-9 on small windows
  rcorrUniformlyTiny: true,          // -> R(1) = 1.2455e-3 for large-min-prime windows
  windowLimitUnboundedBelow: true,   // -c e^{-gamma}/Prod_{p<P0}(1-1/p) by Mertens
  primorialIsExtremizer: false,      // FALSE -- it is the shallowest window
  replacementLemmaExists: false,     // RL-L is refuted
  lowerEdgeHolds: false,             // T(b) >= -1/4 FALSE on window sets P0>=101
  ceilingRefuted: true,              // the b/4 ceiling fails on the lower side for general squarefree b
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest OUTCOME: the imp-97461 replacement lemma RL-L is REFUTED. PROVED (exact): the general-b surrogate ' +
    'closed form surrogate(b) = Pi(P)(lnA - c W(P)) (2x2 triangular operator on {1/x, (log x)/x}); the exact ' +
    'decomposition T = surrogate + Rcorr with Rcorr -> R(1) = 1/4 - lnA = 1.2455e-3 uniformly for min-prime ' +
    'P0>=101 (tail < (1/720)(Prod(1+1/p^3)-1)); and the window limit surrogate([P0,Y]) -> ' +
    '-c e^{-gamma}/Prod_{p<P0}(1-1/p) by Mertens, UNBOUNDED below (P0=2 -> -0.0468, P0=101 -> -0.3889, ' +
    'P0=379 -> -0.4975). REFUTED: the lower edge T(b) >= -1/4 -- for P0>=101 the limit T <= -0.388 < -1/4, so a ' +
    'finite (astronomically large) squarefree b = Prod_{P0<=p<=Y} p has T(b) < -1/4, i.e. |E1(b)| > b/4. The ' +
    'primorial family is the SHALLOWEST window (floor -0.0468), NOT the extremizer imp-97432/97461 assumed; RL-L ' +
    'does not exist and the b/4-ceiling line is a dead route. This ceiling was exploratory: no Lambda bound and ' +
    'no kappa_arith value depended on it. kappa_arith unchanged; cotangent first moment (imp-97097) open; no ' +
    'bound on Lambda moves; no refereed bound is changed; RH open; NO QED. Referee-worthy.',
});

export const IMP97481_SUBGAP = Object.freeze({
  id: 'imp-97481-quarter-ceiling-lower-edge-false-window-sets-no-replacement-lemma',
  statement:
    'The imp-97461 replacement lemma RL-L (T(b) >= -1/4 for all squarefree b, primorial extremizer, infimum ' +
    '-e^{-gamma}/12) is FALSE. The surrogate obeys the exact closed form surrogate(b) = Pi(P)(lnA - c W(P)) and ' +
    'T = surrogate + Rcorr with Rcorr -> R(1) = 1.2455e-3 for min prime P0>=101. Over a window [P0,Y] the ' +
    'surrogate limit is -c e^{-gamma}/Prod_{p<P0}(1-1/p) (Mertens), unbounded below: P0=101 gives -0.389, ' +
    'P0=379 gives -0.498, both < -1/4. Hence a finite squarefree b with T(b) < -1/4 (|E1(b)| > b/4) exists; the ' +
    'b/4-ceiling LOWER edge is refuted and the primorial is the SHALLOWEST, not the extremal, window. RESIDUAL ' +
    '(bookkeeping only): the explicit crossing Y via Rosser-Schoenfeld effective Mertens bounds; the ceiling was ' +
    'exploratory Route-M and load-bearing for nothing, so the b/4-ceiling line is closed as a dead route.',
  supersedesFraming: 'imp-97461-quarter-ceiling-lower-edge-primorial-extremizer-without-mcm (the primorial-extremizer premise is false; there is no replacement lemma, the lower edge itself fails)',
});

export const IMP97481_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Attempt to formalize the imp-97461 replacement lemma RL-L ' +
  '(T(b) >= -1/4 for all squarefree b via the primorial extremizer): RL-L is REFUTED. The general-b surrogate ' +
  'closed form surrogate(b) = Pi(P)(lnA - c W(P)) plus the exact T = surrogate + Rcorr (Rcorr -> R(1) = ' +
  '1.2455e-3 for min prime >= 101) and the Mertens window limit surrogate([P0,Y]) -> ' +
  '-c e^{-gamma}/Prod_{p<P0}(1-1/p) (unbounded below: -0.389 at P0=101, -0.498 at P0=379) give a finite ' +
  'squarefree b with T(b) < -1/4, i.e. |E1(b)| > b/4. The b/4-ceiling LOWER edge is FALSE for general b; the ' +
  'primorial is the SHALLOWEST window (floor -0.0468), not the extremizer imp-97432/97461 assumed. Exploratory ' +
  'ceiling, load-bearing for nothing: no bound moved, the b/4-ceiling line is a dead route.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97481_ASSERTIONS = [
  {
    id: 'imp97481-surrogate-closed-form-equals-iterdiff-H',
    holds: () => {
      // RESULT 1: closed form == exact iterated difference of the smooth surrogate H, for window sets.
      const sets = [[11, 13, 17, 19], [101, 103, 107, 109], [379, 383, 389, 397, 401]];
      for (const P of sets) { if (Math.abs(surrogate(P) - iterDiffH(P)) > 1e-12) return false; }
      return true;
    },
    why: 'the general-b closed form surrogate(b) = Pi(P)(lnA - c W(P)) reproduces the exact iterated multiplicative difference of H to machine precision on window sets (the 2x2 triangular operator derivation).',
  },
  {
    id: 'imp97481-decomposition-T-equals-surrogate-plus-Rcorr',
    holds: () => {
      // RESULT 1/2: T = surrogate + Rcorr EXACTLY on small window sets (fully computable true h).
      const sets = [[11, 13, 17, 19], [11, 13, 17, 19, 23], [101, 103, 107, 109], [379, 383, 389]];
      for (const P of sets) { if (Math.abs(Texact(P) - (surrogate(P) + Rcorr(P))) > 1e-9) return false; }
      // Rcorr for a large-min-prime window is essentially R(1): the d>1 tail is tiny.
      const rc = Rcorr([101, 103, 107, 109]);
      return Math.abs(R1 - (1 / 4 - LN_A)) < 1e-15 && Math.abs(rc - R1) < 1e-4;
    },
    why: 'T = surrogate + Rcorr is exact (linearity of the iterated difference); for large-min-prime windows Rcorr collapses to the single d=1 term R(1) = 1/4 - lnA = 1.2455e-3.',
  },
  {
    id: 'imp97481-window-limit-unbounded-below-primorial-shallowest',
    holds: () => {
      // RESULT 3: Mertens window limit -c e^{-gamma}/Prod_{p<P0}(1-1/p); primorial (P0=2, empty product) is the
      // SHALLOWEST (-e^{-gamma}/12), P0=101 and P0=379 are far deeper -- unbounded below.
      const limPrimorial = windowLimit([]); // P0 = 2: no primes below, Q = 1
      const lim101 = windowLimit(primesUpTo(100));
      const lim379 = windowLimit(primesUpTo(378));
      if (Math.abs(limPrimorial + Math.exp(-E_GAMMA) / 12) > 1e-9) return false; // -0.046788
      if (!(lim101 < -0.38 && lim101 > -0.40)) return false;                     // -0.388874
      if (!(lim379 < -0.49 && lim379 > -0.50)) return false;                     // -0.497500
      // deeper P0 => deeper limit (monotone descent, unbounded)
      return lim379 < lim101 && lim101 < limPrimorial;
    },
    why: 'the window limit -c e^{-gamma}/Prod_{p<P0}(1-1/p) is unbounded below as P0 grows; the primorial (P0=2) is the SHALLOWEST window (-e^{-gamma}/12 = -0.0468), refuting the imp-97461 primorial-extremizer premise.',
  },
  {
    id: 'imp97481-lower-edge-refuted-limit-below-quarter',
    holds: () => {
      // RESULT 4: for P0>=101 the limit T = surrogate-limit + R(1) is below -1/4, so a finite b breaches it.
      const T101 = windowLimit(primesUpTo(100)) + R1;
      const T379 = windowLimit(primesUpTo(378)) + R1;
      if (!(T101 < -0.25)) return false;   // -0.3876 < -1/4
      if (!(T379 < -0.25)) return false;   // -0.4963 < -1/4
      // finite-sieve descent: window [379, 2e5] already sinks ~4x below the primorial floor.
      const all = primesUpTo(200000);
      const winDeep = deepestWindowSurrogate(379, all);
      const priDeep = deepestWindowSurrogate(2, all);
      if (!(winDeep < -0.13 && winDeep > -0.14)) return false;  // -0.13212
      if (!(priDeep < -0.03 && priDeep > -0.04)) return false;  // -0.03314
      return winDeep < priDeep - 0.09; // window sinks well past the primorial "extremizer"
    },
    why: 'for P0>=101 the window T-limit (-0.388 at 101, -0.496 at 379) is below -1/4, so a finite squarefree b has T(b) < -1/4, i.e. |E1(b)| > b/4; the finite-sieve descent [379,2e5] = -0.132 already passes the primorial floor -0.033 the prior modules assumed extremal.',
  },
  {
    id: 'imp97481-honesty-gate-no-qed',
    holds: () =>
      IMP97481_VERDICT.anyBoundMoved === false &&
      IMP97481_VERDICT.postsRigorousCeiling === false &&
      IMP97481_VERDICT.qed === false &&
      IMP97481_VERDICT.surrogateClosedFormProved === true &&
      IMP97481_VERDICT.replacementLemmaExists === false &&
      IMP97481_VERDICT.primorialIsExtremizer === false &&
      IMP97481_VERDICT.lowerEdgeHolds === false &&
      IMP97481_VERDICT.ceilingRefuted === true &&
      /lower-edge-false-window-sets/.test(IMP97481_SUBGAP.id) &&
      /NO QED/.test(IMP97481_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97481_HONEST_BANNER) &&
      /RH open/.test(IMP97481_HONEST_BANNER),
    why: 'proof attempt with an honest negative outcome -- RL-L refuted, the b/4-ceiling lower edge is false on window sets; the ceiling was exploratory (load-bearing for nothing), no bound moved, no QED.',
  },
];

for (const a of IMP97481_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97481_KERNEL,
  results: IMP97481_RESULTS,
  verdict: IMP97481_VERDICT,
  subGap: IMP97481_SUBGAP,
  banner: IMP97481_HONEST_BANNER,
};
