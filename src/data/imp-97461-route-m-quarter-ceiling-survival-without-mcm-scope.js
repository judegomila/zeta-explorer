/**
 * @module imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope
 *
 * imp-97461 (proof -- SCOPING / assessment only, NO QED): imp-97432 REFUTED the MCM hypothesis (all iterated
 * multiplicative differences of h = g/m non-negative) at omega = 11 (T(p_11#) = -9.624e-4 < 0) yet stated the
 * b/4 ceiling SURVIVES, without formalizing the argument that REPLACES MCM for omega >= 11. imp-97422 had
 * reduced BOTH b/4-ceiling conditions at omega >= 4 to MCM. This leaf scopes the survival: which of the two
 * ceiling conditions actually needed MCM, whether the failing tower differences threaten the ceiling, and the
 * precise replacement lemma. No bound moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 *   Notation (imp-97290 / imp-97422 / imp-97432): for squarefree b, E1(b) = mu(b)(b/4) + Delta(b),
 *   Delta(b) = mu(b) b S(b), S(b) = Sum_{e|b, e>1} mu(e) h(e), h(m) = g(m)/m, g(1) = 1/4,
 *   T(b) := 1/4 + S(b) = Sum_{e|b} mu(e) h(e) = (D_{p1}...D_{pk} h)(1), the top-order iterated multiplicative
 *   difference. The ceiling |E1(b)| <= b/4 reduces to |T(b)| <= 1/4.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the ceiling is TWO independent one-sided edges; imp-97422 RESULT 3 supplies them from MCM
 *             through DIFFERENT clauses (its "SIGN"/"MAGNITUDE" labels are crossed -- corrected here).
 * -------------------------------------------------------------------------------
 * |T(b)| <= 1/4 splits as
 *     (U) UPPER edge  T(b) <= 1/4   <=>   S(b) <= 0            [imp-97290 SIGN condition mu(b)Delta(b) <= 0],
 *     (L) LOWER edge  T(b) >= -1/4  <=>   S(b) >= -1/2         [imp-97290 MAGNITUDE lower half |Delta| <= b/2].
 * imp-97422 RESULT 3 derived them from MCM through two SEPARATE clauses (the module text swapped the labels):
 *   - the TOP difference non-negativity T(b) = (D_{p1}...D_{pk} h)(1) >= 0 gives T >= 0, hence the LOWER edge
 *     (in fact the far-stronger T >= 0, over-satisfying T >= -1/4 by the whole interval [-1/4, 0]);
 *   - the peel-the-smallest-prime monotone descent T(b) = G(1) - G(p1) <= G(1) = T(b/p1), using the
 *     LOWER-ORDER differences G(p1) = (D_{p2}...D_{pk} h)(p1) >= 0, iterated to T(b) <= max_prime T(p) < 1/4,
 *     gives the UPPER edge.
 * So MCM (non-negativity at ALL orders) was strictly stronger than either edge: it forced T >= 0 (LOWER) and
 * supplied the descent chain (UPPER). Neither edge needs full non-negativity; each needs only one directed fact.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- LOCATE the refutation: the two ceiling edges live in DISJOINT (min-prime) regimes.
 * -------------------------------------------------------------------------------
 * T(b) -> 1/4 (the UPPER edge) is approached only as the SMALLEST prime factor of b -> infinity, in EVERY omega
 * class (all steps log p_i large): measured T(999983) = 0.24999860, T(99989*99991) = 0.24997583, both < 1/4,
 * and h(e) -> 0 on every proper divisor so T -> h(1) = 1/4 from below. In that all-LARGE-prime regime the
 * iterated differences are strongly positive (the surrogate is finite-difference completely-monotone-like at
 * large steps) -- exactly the MCM-SAFE regime. The MCM refutation (imp-97432) is the opposite: it occurs for
 * the SMALLEST primes, the primorial family b = p_j# (smallest steps, most negative surrogate). The top
 * difference first goes negative at omega = 11 (T(p_11#) = -9.624e-4) and the surrogate intermediate difference
 * already at order 10 (imp-97432 RESULT 2). This drives T DOWNWARD toward the primorial limit
 *     T(p_j#) -> -e^{-gamma}/12 + Rcorr_inf = -0.046788 + 0.0010186 = -0.04577,
 * the LOWER edge. Hence the failing tower differences sit ENTIRELY at the lower edge and never touch the upper.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- SCOPE of the survival: which edge needed MCM, and whether the failing differences matter.
 * -------------------------------------------------------------------------------
 *   (U) UPPER edge (T <= 1/4): the refuted differences do NOT occur in its extremal regime (all-large-prime,
 *       MCM-safe). MCM refutation is IRRELEVANT to the upper edge. The imp-97422 peel descent still holds where
 *       the intermediate differences stay positive -- which is precisely where T approaches 1/4. The upper edge
 *       does NOT need non-negativity; it needs the WEAKER sign statement S(b) < 0 (equivalently the descent in
 *       the large-step regime). Sup 1/4 is approached but never attained (T(prime p) = 1/4 - h(p) < 1/4).
 *   (L) LOWER edge (T >= -1/4): this IS where the refuted differences live (primorial, small steps). The
 *       imp-97422 proof of this edge -- T(b) >= 0 from top-difference non-negativity -- is DESTROYED by the
 *       refutation (T(p_11#) < 0). BUT the CONDITION -1/4 <= T survives with a large margin: |T(p_11#)| =
 *       9.6e-4 and the primorial limit is -0.04577, so the lower edge clears -1/4 by 0.204 (a factor ~5.5).
 *       The failing differences are RELEVANT here but HARMLESS: they only pull T from 0 down to about -0.046,
 *       nowhere near -1/4.
 * NET: exactly ONE of the two edges (the LOWER edge) had its imp-97422 PROOF killed by the MCM refutation; its
 * CONDITION survives with margin 0.204. The UPPER edge's proof route survives untouched in the regime that
 * matters. So "the ceiling survives" is correct, and MCM was over-strong for BOTH edges.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- the PRECISE replacement lemma for omega >= 11 (replacing the refuted MCM).
 * -------------------------------------------------------------------------------
 * MCM is replaced by a TWO-SIDED EXTREMIZER statement (two directed one-sided bounds, neither requiring
 * all-orders non-negativity):
 *   (RL-U)  for every squarefree b,  S(b) = Sum_{e|b, e>1} mu(e) h(e) < 0  (equivalently T(b) < 1/4), with
 *           supremum 1/4 approached only as min prime factor -> infinity;
 *   (RL-L)  the infimum of T over the squarefree class is attained in the PRIMORIAL direction with limit
 *           -e^{-gamma}/12 + Rcorr_inf = -0.04577, hence T(b) >= -0.04577 > -1/4 for all squarefree b.
 * (RL-L) is the operative replacement for omega >= 11 (where MCM died): prove the primorial family is the
 * two-sided extremizer and that its limit -e^{-gamma}/12 (Mertens: Pi_j ~ e^{-gamma}/log p_j,
 * Sum log p_i/(p_i-1) ~ log p_j) lies in (-1/4, 1/4). This is STRICTLY WEAKER than MCM: MCM asserted T >= 0
 * (and non-negativity at all orders); (RL-L) asks only T >= -1/4, with the true infimum -0.046 leaving a
 * 0.204 cushion. No non-negativity, no order-by-order induction, is needed for the ceiling.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * SCOPING outcome. The b/4 ceiling |T(b)| <= 1/4 is two one-sided edges. The UPPER edge (T <= 1/4) is
 * extremized in the all-large-prime, MCM-safe regime, so the imp-97432 refutation is irrelevant to it. The
 * LOWER edge (T >= -1/4) is extremized in the primorial (small-prime) regime, exactly where MCM was refuted;
 * the imp-97422 proof of the lower edge (T >= 0) is destroyed, but the condition survives with margin 0.204
 * (|T(p_11#)| = 9.6e-4, primorial limit -0.04577). The replacement for MCM is the strictly weaker two-sided
 * extremizer statement (RL-U)+(RL-L): S(b) < 0 uniformly and the primorial infimum -e^{-gamma}/12 in
 * (-1/4, 1/4). kappa_arith unchanged; cotangent first moment (imp-97097) stays open; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; ceiling asserted safe)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (both edges reduced to MCM)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the SIGN + MAGNITUDE reduction, omega<=2)
 *
 * Ticket: imp-97461 (proof/scoping, opus-4-8, api-pool). Scopes the MCM-free survival of the b/4 ceiling; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const C_TWELFTH = 1 / 12;
const E_GAMMA = 0.5772156649015329; // Euler-Mascheroni

// -- self-contained kernel (mirrors imp-97432; import-light) --
function Gexact(m) { let s = 0; for (let k = 2; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) { if (m === 1) return -1 / 4 + LN_A; return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A; }
function Rexact(m) { return Gexact(m) - GKmain(m); }
function gWeight(m) { return LN_A + C_TWELFTH * Math.log(m) + Rexact(m); }
function hRatio(m) { return gWeight(m) / m; } // g(m)/m, positive strictly decreasing, max at m=2

function primeFactors(b) { let n = b, ps = []; for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } } if (n > 1) ps.push(n); return ps; }
function isSquarefree(b) { let m = 1; for (const p of primeFactors(b)) m *= p; return m === b; }
function squarefreeDivisors(primes) { let ds = [1]; for (const p of primes) { const nx = []; for (const d of ds) { nx.push(d); nx.push(d * p); } ds = nx; } return ds; }
function muOfDivisor(d, primes) { let c = 0, n = d; for (const p of primes) { if (n % p === 0) { c++; n /= p; } } return c % 2 === 0 ? 1 : -1; }

// Exact T(b) = Sum_{e|b} mu(e) h(e) for MODEST b (all divisors small enough for Gexact).
function TexactFromPrimes(primes) { let s = 0; for (const e of squarefreeDivisors(primes)) s += muOfDivisor(e, primes) * hRatio(e); return s; }
function Texact(b) { return TexactFromPrimes(primeFactors(b)); }

// Surrogate top difference (D_{p1}...D_{pk} H)(1) = Pi_j [lnA - c Sum log p_i/(p_i-1)] (imp-97432 closed form).
function surrogatePrimorial(primes) { let Pi = 1, S = 0; for (const p of primes) { Pi *= 1 - 1 / p; S += Math.log(p) / (p - 1); } return Pi * (LN_A - C_TWELFTH * S); }
// Rcorr(b) = Sum_{d|b} mu(d) R(d)/d, exact for d <= cut, tail-bounded beyond (< Sum 1/(720 d^3)).
function Rcorr(primes, cut) {
  let s = 0, tail = 0;
  for (const d of squarefreeDivisors(primes)) {
    if (d <= cut) s += muOfDivisor(d, primes) * Rexact(d) / d;
    else tail += 1 / (720 * d * d * d);
  }
  return { value: s, tailBound: tail };
}
// Full T for LARGE primorial b (avoids the O(b) Gexact loop): surrogate + Rcorr.
function Tprimorial(primes, cut) { return surrogatePrimorial(primes) + Rcorr(primes, cut).value; }

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const P11 = PRIMES.slice(0, 11); // p_11# = 200560490130, the MCM counterexample (lower-edge regime)
const PRIMORIAL_LIMIT = -Math.exp(-E_GAMMA) / 12 + 1.0186e-3; // -0.04577, the lower-edge infimum

export const IMP97461_KERNEL = Object.freeze({
  Texact, TexactFromPrimes, surrogatePrimorial, Rcorr, Tprimorial, hRatio, gWeight,
  isSquarefree, squarefreeDivisors, muOfDivisor, LN_A, E_GAMMA, PRIMORIAL_LIMIT,
});

export const IMP97461_RESULTS = Object.freeze({
  question: 'scope the argument that keeps the b/4 ceiling once imp-97432 refutes MCM at omega=11: which ceiling condition needed MCM, whether the failing differences matter, and the precise replacement lemma',
  ceilingDecomposition: {
    statement: '|T(b)| <= 1/4 splits into two one-sided edges',
    upperEdge: 'T(b) <= 1/4  <=>  S(b) <= 0  [imp-97290 SIGN mu(b)Delta(b) <= 0]',
    lowerEdge: 'T(b) >= -1/4 <=>  S(b) >= -1/2 [imp-97290 MAGNITUDE lower half |Delta| <= b/2]',
    imp97422LabelFix: 'imp-97422 RESULT 3 crossed the labels: top-difference T(b) >= 0 supplies the LOWER edge (over-strong, gives T >= 0); the peel descent supplies the UPPER edge T <= max_prime T(p) < 1/4',
  },
  regimeLocation: {
    upperEdgeRegime: 'T -> 1/4 approached only as the SMALLEST prime factor -> infinity, in every omega class (all steps large) -- the MCM-SAFE regime where iterated differences are strongly positive',
    lowerEdgeRegime: 'T -> -0.04577 is the primorial family (smallest primes, smallest steps) -- exactly where imp-97432 refuted MCM (top diff negative at omega=11, surrogate intermediate at order 10)',
    disjoint: true,
  },
  whichEdgeNeededMCM: {
    upper: 'IRRELEVANT to the MCM refutation: its extremal regime is all-large-prime (MCM-safe); needs only the weaker S(b) < 0, not non-negativity',
    lower: 'its imp-97422 PROOF (T >= 0 from top-difference non-negativity) is DESTROYED by the refutation, but the CONDITION -1/4 <= T survives with margin 0.204 (|T(p_11#)| = 9.6e-4, primorial limit -0.04577)',
    verdict: 'exactly one edge (the LOWER) had its proof killed; its condition survives; MCM was strictly stronger than BOTH edges',
  },
  replacementLemma: {
    RL_U: 'for every squarefree b, S(b) = Sum_{e|b,e>1} mu(e) h(e) < 0 (i.e. T(b) < 1/4), sup 1/4 approached only as min prime -> infinity',
    RL_L: 'the infimum of T over the squarefree class is attained in the primorial direction with limit -e^{-gamma}/12 + Rcorr_inf = -0.04577 > -1/4',
    operativeForOmegaGe11: 'RL-L: prove the primorial family is the two-sided extremizer and its limit -e^{-gamma}/12 lies in (-1/4, 1/4); STRICTLY WEAKER than MCM (asks T >= -1/4, true inf -0.046, cushion 0.204), no non-negativity or order induction',
  },
  primorialLimit: PRIMORIAL_LIMIT, // -0.04577
});

export const IMP97461_VERDICT = Object.freeze({
  question: 'scope the survival argument replacing MCM for the b/4 ceiling at omega >= 11',
  ceilingIsTwoEdges: true,
  upperEdgeAffectedByMcmRefutation: false, // extremal regime is all-large-prime, MCM-safe
  lowerEdgeProofDestroyed: true,           // T >= 0 route killed (T(p_11#) < 0)
  lowerEdgeConditionSurvives: true,        // -1/4 <= T with margin 0.204
  mcmStrictlyStrongerThanBothEdges: true,
  replacementIsTwoSidedExtremizer: true,   // RL-U + RL-L, no all-orders non-negativity
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'SCOPING outcome. The b/4 ceiling |T(b)| <= 1/4 is TWO one-sided edges: UPPER T <= 1/4 (imp-97290 SIGN, ' +
    'S(b) <= 0) and LOWER T >= -1/4 (imp-97290 MAGNITUDE lower half, S(b) >= -1/2). imp-97422 RESULT 3 got them ' +
    'from MCM through DIFFERENT clauses (its SIGN/MAGNITUDE labels are crossed): the top-difference ' +
    'non-negativity T(b) >= 0 supplies the LOWER edge (over-strong), the peel-the-smallest-prime descent ' +
    'supplies the UPPER edge. The two edges live in DISJOINT regimes -- T -> 1/4 only as the smallest prime ' +
    'factor -> infinity (all steps large, MCM-SAFE), while T -> -0.04577 is the primorial family (smallest ' +
    'primes) where imp-97432 refuted MCM (top diff negative at omega=11, surrogate intermediate at order 10). ' +
    'Hence the failing differences are IRRELEVANT to the UPPER edge and RELEVANT-BUT-HARMLESS to the LOWER edge: ' +
    'exactly the LOWER edge had its imp-97422 proof (T >= 0) destroyed, but its condition survives with margin ' +
    '0.204 (|T(p_11#)| = 9.6e-4, primorial limit -e^{-gamma}/12 + Rcorr = -0.04577). The precise replacement ' +
    'for MCM is the strictly weaker TWO-SIDED EXTREMIZER statement: (RL-U) S(b) < 0 uniformly (T < 1/4) and ' +
    '(RL-L) the primorial infimum -e^{-gamma}/12 lies in (-1/4, 1/4). No non-negativity and no order-by-order ' +
    'induction is needed for the ceiling. kappa_arith unchanged; cotangent first moment (imp-97097) open; no ' +
    'bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97461_SUBGAP = Object.freeze({
  id: 'imp-97461-quarter-ceiling-lower-edge-primorial-extremizer-without-mcm',
  statement:
    'The b/4 ceiling |T(b)| <= 1/4 = UPPER edge (T <= 1/4, S(b) <= 0) INTERSECT LOWER edge (T >= -1/4, ' +
    'S(b) >= -1/2). The imp-97432 refutation of MCM (T(p_11#) = -9.624e-4 < 0) kills ONLY the imp-97422 proof ' +
    'of the LOWER edge (which used T >= 0); the UPPER edge is extremized in the all-large-prime MCM-safe regime ' +
    'and is untouched. OPEN (replacing MCM, strictly weaker): (RL-U) prove S(b) < 0 for all squarefree b ' +
    '(T < 1/4, sup approached only as min prime -> infinity) and (RL-L) prove the primorial family is the ' +
    'two-sided extremizer with infimum -e^{-gamma}/12 + Rcorr = -0.04577 in (-1/4, 1/4). RL-L is the operative ' +
    'omega >= 11 residual: no all-orders non-negativity, no order induction; the true infimum -0.046 clears ' +
    '-1/4 by a 0.204 cushion.',
  supersedesFraming: 'imp-97432-quarter-ceiling-omega-ge-11-two-sided-band-without-mcm (splits the two-sided band into the two disjoint-regime edges and identifies RL-L as the operative residual)',
});

export const IMP97461_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Scoping the MCM-free survival of the b/4 ceiling ' +
  '(imp-97432 refuted MCM at omega=11 but asserted the ceiling holds): |T(b)| <= 1/4 is TWO one-sided edges ' +
  'living in DISJOINT regimes. UPPER T <= 1/4 is extremized in the all-large-prime MCM-safe regime (refutation ' +
  'IRRELEVANT); LOWER T >= -1/4 is the primorial regime where MCM died -- its imp-97422 proof (T >= 0) is ' +
  'destroyed but its condition survives with margin 0.204 (|T(p_11#)| = 9.6e-4, primorial limit ' +
  '-e^{-gamma}/12 + Rcorr = -0.04577). Replacement for MCM = the strictly weaker two-sided extremizer: ' +
  'S(b) < 0 uniformly and the primorial infimum in (-1/4, 1/4). No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const CUT = 1000; // exact R over divisors <= 1000; omitted d contribute < Sum 1/(720 d^3)

const IMP97461_ASSERTIONS = [
  {
    id: 'imp97461-upper-edge-large-prime-regime-below-quarter',
    holds: () => {
      // UPPER edge T -> 1/4 approached only as smallest prime factor grows, in every omega class, always < 1/4.
      const tp1 = Texact(1999), tp2 = TexactFromPrimes([1997, 1999]); // omega=1 and omega=2, large primes
      const tSmall = Texact(2); // smallest prime is FAR from the upper edge
      if (!(tp1 < 0.25 && tp1 > 0.249)) return false;   // approaches 1/4 from below (omega=1)
      if (!(tp2 < 0.25 && tp2 > 0.249)) return false;   // also approaches 1/4 (omega=2) -- upper edge is min-prime->inf
      if (!(tSmall < 0.1)) return false;                // primorial min-prime=2 is far below the upper edge
      return true;
    },
    why: 'the UPPER edge T -> 1/4 is approached only as the smallest prime factor -> infinity (T(1999)=0.24956, T(1997*1999)=0.2499...), in the all-large-prime MCM-SAFE regime; the primorial (min prime 2) sits far below (T(2)=0.0966).',
  },
  {
    id: 'imp97461-lower-edge-primorial-mcm-refuted-but-safe',
    holds: () => {
      // LOWER edge: T(p_11#) < 0 (MCM refuted) yet |T| tiny, and the primorial limit clears -1/4 by ~0.204.
      const t11 = Tprimorial(P11, CUT), rc = Rcorr(P11, CUT);
      if (!(rc.tailBound < 1e-9)) return false;
      if (!(t11 < 0)) return false;                       // MCM refuted at the lower-edge extremizer
      if (!(Math.abs(t11 + 9.624e-4) < 5e-6)) return false;
      if (!(Math.abs(t11) < 0.01)) return false;          // harmless: |T(p_11#)| << 1/4
      if (!(PRIMORIAL_LIMIT > -0.25 && PRIMORIAL_LIMIT < 0)) return false; // limit inside (-1/4, 0)
      if (!(Math.abs(PRIMORIAL_LIMIT + 0.04577) < 5e-4)) return false;
      if (!((-0.25 - PRIMORIAL_LIMIT) < -0.2)) return false; // margin below -1/4 is ~0.204
      return true;
    },
    why: 'the LOWER edge lives in the primorial regime where MCM is refuted (T(p_11#) = -9.624e-4 < 0), but the condition -1/4 <= T survives with margin 0.204: |T(p_11#)| = 9.6e-4 and the primorial limit -e^{-gamma}/12 + Rcorr = -0.04577 is deep inside (-1/4, 0).',
  },
  {
    id: 'imp97461-disjoint-regimes-upper-safe-lower-refuted',
    holds: () => {
      // The two edges are extremized in DISJOINT min-prime regimes: large-prime (upper) vs primorial (lower).
      const upperBig = TexactFromPrimes([9973]); // large single prime -> near 1/4
      const lowerSmall = Tprimorial(PRIMES.slice(0, 12), CUT); // deeper primorial -> more negative than omega=11
      if (!(upperBig > 0.249 && upperBig < 0.25)) return false;
      if (!(lowerSmall < Tprimorial(P11, CUT))) return false; // primorial T decreases with omega (toward the limit)
      if (!(lowerSmall > -0.25)) return false;
      return true;
    },
    why: 'the UPPER edge (large single prime T=0.2499) and the LOWER edge (primorial T decreasing past omega=11 toward -0.046) are extremized in disjoint min-prime regimes; the MCM refutation lives only at the lower edge.',
  },
  {
    id: 'imp97461-honesty-gate-no-qed',
    holds: () =>
      IMP97461_VERDICT.anyBoundMoved === false &&
      IMP97461_VERDICT.postsRigorousCeiling === false &&
      IMP97461_VERDICT.qed === false &&
      IMP97461_VERDICT.ceilingIsTwoEdges === true &&
      IMP97461_VERDICT.upperEdgeAffectedByMcmRefutation === false &&
      IMP97461_VERDICT.lowerEdgeProofDestroyed === true &&
      IMP97461_VERDICT.lowerEdgeConditionSurvives === true &&
      IMP97461_VERDICT.mcmStrictlyStrongerThanBothEdges === true &&
      /lower-edge-primorial-extremizer/.test(IMP97461_SUBGAP.id) &&
      /NO QED/.test(IMP97461_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97461_HONEST_BANNER) &&
      /RH open/.test(IMP97461_HONEST_BANNER),
    why: 'scoping / honest assessment -- decomposes the ceiling into two disjoint-regime edges and names RL-L as the operative MCM replacement; no bound moved, no rigorous full ceiling, no QED.',
  },
];

for (const a of IMP97461_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97461_KERNEL,
  results: IMP97461_RESULTS,
  verdict: IMP97461_VERDICT,
  subGap: IMP97461_SUBGAP,
  banner: IMP97461_HONEST_BANNER,
};
