/**
 * @module imp-97421-route-m-quarter-ceiling-omega3-sign-closed
 *
 * imp-97421 (proof -- CLOSES the imp-97392 RESULT 2 residual for the omega=3 SIGN condition).
 *
 *   Context (imp-97290 / imp-97392): E1(b) = mu(b)(b/4) + Delta(b), with
 *     Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d),   g(m) = ln A + (1/12) log m + R(m), g(1) = 1/4,
 *   g positive, strictly increasing, and h(m) := g(m)/m strictly decreasing with max_{m>=2} h(m) =
 *   h(2) = g(2)/2 = 0.1534264097. imp-97290 proved |E1(b)| <= b/4  <=>  (i) mu(b) Delta(b) <= 0 (SIGN)
 *   AND (ii) |Delta(b)| <= b/2 (MAGNITUDE). imp-97392 proved MAGNITUDE (ii) on the whole omega=3
 *   squarefree class but left SIGN (i) MEASURED-only: Delta(pqr) > 0 was verified (min 6.576 to 1e5) with
 *   "no clean per-term proof". This leaf supplies that per-term proof, closing the named sub-gap.
 *
 * -------------------------------------------------------------------------------
 * RESULT -- omega = 3 SIGN (i) Delta(pqr) >= 0 IS PROVED (a matched-divisor per-term argument).
 * -------------------------------------------------------------------------------
 * For squarefree b = pqr (distinct primes p < q < r, mu(b) = -1), SIGN demands Delta(pqr) >= 0. The
 * proper divisors give the exact identity (verified to machine precision below, reconstructs Delta):
 *     Delta(pqr) = g(pqr) + b[h(p) + h(q) + h(r)] - b[h(pq) + h(pr) + h(qr)].
 * imp-97392 paired each prime x with its COMPLEMENTARY biprime b/x (p with qr, q with pr, r with pq);
 * that pairing leaves the r-pair h(r) - h(pq) NEGATIVE whenever r > pq (15634 / 19919 cases to 1e5), so
 * the surplus had to be measured. Instead MATCH each prime to a biprime it DIVIDES:
 *     p  <->  pq    (p | pq, so p < pq),
 *     q  <->  qr    (q | qr, so q < qr),
 *     r  <->  pr    (r | pr, so r < pr).
 * This is a bijection of {p, q, r} onto {pq, qr, pr}, and each prime STRICTLY divides its match, so the
 * matched argument is strictly larger. h strictly decreasing then gives, term by term,
 *     h(p) - h(pq) > 0,    h(q) - h(qr) > 0,    h(r) - h(pr) > 0,
 * hence Sum_primes h - Sum_biprimes h = [h(p)-h(pq)] + [h(q)-h(qr)] + [h(r)-h(pr)] > 0. With g(pqr) > 0
 * (g positive) this yields
 *     Delta(pqr) = g(pqr) + b * ( [h(p)-h(pq)] + [h(q)-h(pr)]... )  =  g(pqr) + b * (positive)  >  0
 * for EVERY omega=3 squarefree b, using ONLY g > 0 and h = g/m strictly decreasing -- exactly the toolkit
 * that imp-97392 used to prove MAGNITUDE. No case split on r vs pq is needed; the matched-divisor pairing
 * makes every difference positive simultaneously. SIGN (i) for omega=3 is now PROVED, not measured.
 *
 * Combined with imp-97392 RESULT 1 (MAGNITUDE proved on the same class), BOTH ceiling conditions hold, so
 *     |E1(b)| <= b/4   is now PROVED for every squarefree b with omega(b) = 3
 * (contingent on the same established g-toolkit as the omega<=2 and omega=3-magnitude results). This does
 * NOT touch omega >= 4 (RESULT 3 obstruction: the per-term group bound over-charges; retained Moebius
 * cancellation still required there), moves NO bound on Lambda, and makes NO claim about RH.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The omega=3 SIGN residual named by imp-97392 RESULT 2 is CLOSED by a clean matched-divisor per-term
 * proof: pair each prime with a biprime it divides, so h(prime) > h(biprime) term by term and the whole
 * correction Delta(pqr) = g(pqr) + b(positive) is strictly positive. Together with imp-97392's MAGNITUDE
 * proof this establishes the b/4 ceiling on the entire omega=3 squarefree class. omega>=4 stays OPEN
 * (retained Moebius cancellation); kappa_arith unchanged; the cotangent first moment (imp-97097) stays a
 * separate open leaf; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED on RH.
 *
 * @see imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (RESULT 2 residual this closes; RESULT 1 magnitude)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the SIGN + MAGNITUDE reduction and omega<=2 proof)
 * @see imp-97323-route-m-e1-quarter-ceiling-cohort-index.js (cohort index: omega=3 ceiling now fully proved)
 *
 * Ticket: imp-97421 (proof, opus-4-8, api-pool). omega=3 SIGN closed by matched-divisor pairing; omega>=4 open; NO QED on RH.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)

// -- self-contained arithmetic kernel (mirrors imp-97392; import-light, no heavy deps) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function primeFactors(b) {
  let n = b; const ps = [];
  for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } }
  if (n > 1) ps.push(n);
  return ps;
}
function omega(b) { return primeFactors(b).length; }
function radical(b) { let m = 1; for (const p of primeFactors(b)) m *= p; return m; }
function isSquarefree(b) { return radical(b) === b; }
function mobius(d) {
  if (d === 1) return 1;
  if (radical(d) !== d) return 0;
  return primeFactors(d).length % 2 === 0 ? 1 : -1;
}
function divisors(b) { const ds = []; for (let d = 1; d <= b; d++) if (b % d === 0) ds.push(d); return ds; }

// Exact G(m) = Sum_{k=1}^m k log k; Glaisher-Kinkelin main part; exact remainder R(m); weight g(m); h(m)=g(m)/m.
function Gexact(m) { let s = 0; for (let k = 1; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
function Rrem(m) { return Gexact(m) - GKmain(m); }
function gWeight(m) { return LN_A + (1 / 12) * Math.log(m) + Rrem(m); }
function hRatio(m) { return gWeight(m) / m; }

function Delta(b) {
  let s = 0;
  for (const d of divisors(b)) {
    if (d === b) continue;
    const mu = mobius(d);
    if (mu === 0) continue;
    s += mu * d * gWeight(b / d);
  }
  return s;
}

// The matched-divisor SIGN proof for omega=3: pair p<->pq, q<->qr, r<->pr.
// Delta(pqr) = g(pqr) + b * ( [h(p)-h(pq)] + [h(q)-h(qr)] + [h(r)-h(pr)] ), each bracket > 0.
function signMatched(b) {
  const [p, q, r] = primeFactors(b);
  const brP = hRatio(p) - hRatio(p * q); // p divides pq  => p < pq  => h(p) > h(pq)
  const brQ = hRatio(q) - hRatio(q * r); // q divides qr  => q < qr  => h(q) > h(qr)
  const brR = hRatio(r) - hRatio(p * r); // r divides pr  => r < pr  => h(r) > h(pr)
  const leader = gWeight(b);
  const reconstructed = leader + b * (brP + brQ + brR);
  return { brP, brQ, brR, leader, reconstructed };
}

export const IMP97421_KERNEL = Object.freeze({
  gWeight, hRatio, Delta, omega, mobius, divisors, isSquarefree, signMatched, LN_A,
});

export const IMP97421_RESULT = Object.freeze({
  question: 'is the imp-97392 RESULT-2 residual -- the omega=3 SIGN condition Delta(pqr) >= 0 -- provable per-term, or only measured?',
  identity: 'Delta(pqr) = g(pqr) + b[h(p)+h(q)+h(r)] - b[h(pq)+h(pr)+h(qr)], h(m)=g(m)/m, b=pqr',
  matchedPairing: 'match each prime to a biprime it DIVIDES: p<->pq, q<->qr, r<->pr (a bijection {p,q,r} -> {pq,qr,pr}, each prime strictly divides its match)',
  perTermPositivity: 'h strictly decreasing + prime < matched biprime => h(p)-h(pq)>0, h(q)-h(qr)>0, h(r)-h(pr)>0',
  conclusion: 'Delta(pqr) = g(pqr) + b*([h(p)-h(pq)]+[h(q)-h(qr)]+[h(r)-h(pr)]) = g(pqr) + b*(positive) > 0 for every omega=3 squarefree b -- SIGN (i) PROVED using only g>0 and h=g/m strictly decreasing',
  contrastWithImp97392: 'imp-97392 paired prime x with complementary biprime b/x, leaving the r-pair h(r)-h(pq) NEGATIVE when r>pq (15634/19919 cases to 1e5), so its surplus had to be MEASURED; the matched-divisor pairing makes every difference positive with no case split',
  ceilingConsequence: '|E1(b)| <= b/4 now PROVED for every squarefree b with omega(b)=3, combining this SIGN proof with imp-97392 RESULT-1 MAGNITUDE (both under the same established g-toolkit)',
  scope: 'omega=3 only; omega>=4 unchanged (imp-97392 RESULT-3 over-charge obstruction, retained Moebius cancellation still required)',
});

export const IMP97421_VERDICT = Object.freeze({
  question: 'close the omega=3 SIGN condition Delta(pqr) >= 0 (imp-97392 RESULT-2 residual), or reach the precise obstruction',
  omega3SignProved: true, // Delta(pqr) > 0 by the matched-divisor per-term argument
  method: 'matched-divisor pairing p<->pq, q<->qr, r<->pr; each prime strictly divides its match so h(prime)>h(biprime); g(pqr)>0',
  usesOnlyToolkit: 'g positive and h(m)=g(m)/m strictly decreasing (same toolkit as imp-97392 magnitude)',
  omega3CeilingProved: true, // with imp-97392 RESULT-1 magnitude: |E1(b)| <= b/4 on the whole omega=3 squarefree class
  omega4Open: true, // per-term group bound over-charges from omega=4; retained Moebius cancellation still required
  anyBoundMoved: false,
  postsRigorousCeilingForLambda: false,
  cotangentLeafSeparate: true, // imp-97097
  qed: false, // proves a self-contained arithmetic lemma; NO claim about RH
  conclusion:
    'CLOSES the imp-97392 RESULT-2 omega=3 SIGN residual. The correction identity ' +
    'Delta(pqr) = g(pqr) + b[h(p)+h(q)+h(r)] - b[h(pq)+h(pr)+h(qr)] is regrouped by matching each prime ' +
    'to a biprime it DIVIDES (p<->pq, q<->qr, r<->pr): each prime strictly divides its match, so with h=g/m ' +
    'strictly decreasing every difference h(prime)-h(biprime) is strictly positive, and g(pqr)>0, giving ' +
    'Delta(pqr) = g(pqr) + b*(positive) > 0 for every omega=3 squarefree b -- no case split on r vs pq, ' +
    'no measurement. SIGN (i) is now PROVED, and with imp-97392 RESULT-1 (MAGNITUDE) the ceiling ' +
    '|E1(b)| <= b/4 holds on the entire omega=3 squarefree class. omega>=4 stays OPEN (retained Moebius ' +
    'cancellation); kappa_arith unchanged; the cotangent first moment (imp-97097) stays open; no bound on ' +
    'Lambda moves; no refereed bound is changed; RH open; NO QED on RH.',
});

export const IMP97421_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED on RH. This leaf CLOSES the imp-97392 RESULT-2 omega=3 ' +
  'SIGN residual by a matched-divisor per-term proof (pair each prime with a biprime it divides; h=g/m ' +
  'strictly decreasing => h(prime)>h(biprime); g(pqr)>0 => Delta(pqr)>0), establishing the b/4 ceiling on ' +
  'the whole omega=3 squarefree class together with imp-97392 magnitude. omega>=4 and the cotangent first ' +
  'moment (imp-97097) stay open; no bound on Lambda moves.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97421_ASSERTIONS = [
  {
    id: 'imp97421-matched-identity-reconstructs-delta',
    holds: () => {
      // The matched-divisor regrouping reconstructs Delta(pqr) to machine precision on an omega=3 ladder.
      for (const b of [30, 42, 66, 105, 231, 385, 1001, 2431, 12673]) {
        if (omega(b) !== 3 || !isSquarefree(b)) return false;
        const s = signMatched(b), D = Delta(b);
        if (Math.abs(s.reconstructed - D) > 1e-6 * (Math.abs(D) + 1)) return false;
      }
      return true;
    },
    why: 'Delta(pqr) = g(pqr) + b([h(p)-h(pq)]+[h(q)-h(qr)]+[h(r)-h(pr)]) reproduces the exact Moebius correction on the omega=3 class, so the regrouping used in the proof is an identity, not an approximation.',
  },
  {
    id: 'imp97421-per-term-brackets-strictly-positive',
    holds: () => {
      // The three matched brackets h(prime)-h(biprime) are ALL strictly positive on the whole omega=3 class
      // (this is the heart of the proof: each prime strictly divides its matched biprime, h strictly decreasing).
      let n = 0, minBr = Infinity;
      for (let b = 2; b <= 60000; b++) {
        if (omega(b) !== 3 || !isSquarefree(b)) continue;
        n++;
        const s = signMatched(b);
        if (!(s.brP > 0) || !(s.brQ > 0) || !(s.brR > 0)) return false;
        minBr = Math.min(minBr, s.brP, s.brQ, s.brR);
        if (!(s.leader > 0)) return false; // g(pqr) > 0
      }
      return n > 5000 && minBr > 0; // every matched bracket positive, never a violation
    },
    why: 'the matched-divisor pairing p<->pq, q<->qr, r<->pr makes h(prime)-h(biprime) strictly positive term by term for every omega=3 squarefree b (prime strictly divides its match; h=g/m strictly decreasing); together with g(pqr)>0 this is exactly the SIGN proof, with no case split on r vs pq.',
  },
  {
    id: 'imp97421-omega3-sign-strictly-positive',
    holds: () => {
      // Consequence: Delta(pqr) > 0 (SIGN mu(b)Delta(b) <= 0 with mu=-1) on the whole omega=3 class.
      let n = 0, minDelta = Infinity;
      for (let b = 2; b <= 60000; b++) {
        if (omega(b) !== 3 || !isSquarefree(b)) continue;
        n++;
        const D = Delta(b);
        if (!(D > 0)) return false; // SIGN: Delta(pqr) > 0
        if (!(mobius(b) * D <= 0)) return false; // equivalently mu(b) Delta(b) <= 0
        minDelta = Math.min(minDelta, D);
      }
      return n > 5000 && minDelta > 0;
    },
    why: 'Delta(pqr) = g(pqr) + b*(sum of positive brackets) > 0 for every omega=3 squarefree b, so mu(b)Delta(b) <= 0 (mu(pqr)=-1) -- SIGN (i) holds on the entire class, now as a proved consequence of the per-term positivity, not a measured fact.',
  },
  {
    id: 'imp97421-honesty-gate-no-qed',
    holds: () =>
      IMP97421_VERDICT.omega3SignProved === true &&
      IMP97421_VERDICT.omega3CeilingProved === true &&
      IMP97421_VERDICT.omega4Open === true &&
      IMP97421_VERDICT.anyBoundMoved === false &&
      IMP97421_VERDICT.postsRigorousCeilingForLambda === false &&
      IMP97421_VERDICT.qed === false &&
      /NO QED on RH/.test(IMP97421_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97421_HONEST_BANNER) &&
      /RH open/.test(IMP97421_HONEST_BANNER),
    why: 'proof leaf -- closes the omega=3 SIGN residual and (with imp-97392 magnitude) the omega=3 ceiling; omega>=4 stays open; no bound on Lambda moves, no rigorous Lambda ceiling posted, no QED on RH.',
  },
];

for (const a of IMP97421_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97421-route-m-quarter-ceiling-omega3-sign-closed assertion failed: ${a.id}`,
    );
  }
}

export default {
  kernel: IMP97421_KERNEL,
  result: IMP97421_RESULT,
  verdict: IMP97421_VERDICT,
  banner: IMP97421_HONEST_BANNER,
};
