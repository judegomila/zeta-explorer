/**
 * @module imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction
 *
 * imp-97422 (proof -- HONEST PARTIAL, NO QED): assess a CANCELLATION-AWARE magnitude bound for the b/4 ceiling
 * at omega(b) >= 4, where the imp-97392 per-term (triangle-on-groups) bound over-charges. imp-97392 RESULT 3
 * pinned the obstruction: the uniform per-term charge |Delta| <= (max signed-group size) x b g(2)/2 needs the
 * group size < 1/g(2) = 3.258891, which fails at omega = 4 (largest signed group has 8 divisors, const 1.2274).
 * The per-term bound charges each of the 8 negative-mu proper divisors the full b g(2)/2 and DISCARDS the
 * near-cancellation between the positive-mu and negative-mu signed groups. This leaf builds the pairing that
 * RETAINS that cancellation and reports how far it re-establishes MAGNITUDE for omega = 4.
 *
 *   Notation exactly as imp-97290 / imp-97392: E1(b) = mu(b)(b/4) + Delta(b),
 *   Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d), g(m) = ln A + (1/12) log m + R(m), g(1) = 1/4, g > 0 strictly
 *   increasing, h(m) := g(m)/m strictly decreasing with max_{m>=2} h(m) = h(2) = g(2)/2 = 0.1534264097.
 *   imp-97290 reduced |E1(b)| <= b/4 to (i) mu(b) Delta(b) <= 0 (SIGN) AND (ii) |Delta(b)| <= b/2 (MAGNITUDE).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- EXACT REFORMULATION: both ceiling conditions collapse to a single divisor sum in h = g/m.
 * -------------------------------------------------------------------------------
 * Substitute the complementary divisor e = b/d in Delta. As d ranges over proper divisors (d < b), e ranges
 * over divisors e > 1, and for squarefree b, mu(b/e) = mu(b) mu(e). Hence
 *     Delta(b) = mu(b) * b * S(b),   S(b) := Sum_{e|b, e>1} mu(e) g(e)/e = Sum_{e|b, e>1} mu(e) h(e).
 * (Verified to rel err 7e-16 on every squarefree b <= 1e5.) Therefore, with mu(b)^2 = 1:
 *     SIGN (i) mu(b) Delta(b) <= 0   <=>   S(b) <= 0,
 *     MAGNITUDE (ii) |Delta(b)| <= b/2   <=>   |S(b)| <= 1/2.
 * Adjoining the e = 1 term (mu(1) h(1) = g(1) = 1/4) gives the closed divisor sum
 *     T(b) := Sum_{e|b} mu(e) h(e) = 1/4 + S(b),
 * so BOTH conditions together are exactly  -1/4 <= T(b) <= 1/4, i.e. |T(b)| <= 1/4. Measured on the whole
 * squarefree class to 1e5: T(b) in [0.0100, 0.24999], so in fact 0 < T(b) <= 1/4 (both conditions hold with
 * SIGN strict). This is the same h = g/m quantity imp-97421 used to close the omega = 3 sign.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- THE CANCELLATION-AWARE PAIRING = the iterated MULTIPLICATIVE DIFFERENCE of h.
 * -------------------------------------------------------------------------------
 * T(b) is a k-th order multiplicative finite difference of h. Define the multiplicative difference operator
 *     (D_p f)(x) := f(x) - f(px).
 * Then for squarefree b = p1 p2 ... pk (any prime order),
 *     T(b) = (D_{p1} D_{p2} ... D_{pk} h)(1).
 * ONE peel of the smallest prime p = p1 (m = b/p) gives the identity
 *     T(b) = Sum_{d|m} mu(d) [ h(d) - h(pd) ] = Sum_{d|m} mu(d) c(d),   c(d) := h(d) - h(pd) > 0,
 * where c(d) > 0 because h is strictly decreasing and pd > d (verified: 0 neg among all c(d), squarefree
 * b <= 1e5). This is precisely the pos-mu / neg-mu near-cancellation the per-term bound discarded: the prime
 * divisor d = p (charged fully in imp-97392) is now paired with the biprime pd inside a single small positive
 * difference c. For omega = 4 the raw signed group of 8 negative-mu proper divisors is replaced by the 4-term
 * alternating sum over the divisors of m = qrs (pos-mu {1, qr, qs, rs}, neg-mu {q, r, s, qrs}) -- the max
 * signed-group size drops 8 -> 4 after one peel, 4 -> 2 after two peels, 2 -> 1 after three. Each peel is a
 * further multiplicative difference: c2(d) = c(d) - c(qd), c3(d) = c2(d) - c2(rd), etc.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- CONDITIONAL RE-ESTABLISHMENT of BOTH conditions at omega = 4 (and every omega).
 * -------------------------------------------------------------------------------
 * Reduction (fully rigorous given the hypothesis below): suppose h = g/m satisfies
 *     (MCM)  for every finite prime set {p1,...,pj} and every x >= 1,  (D_{p1} ... D_{pj} h)(x) >= 0
 * (all iterated multiplicative differences non-negative -- the finite-difference form of complete monotonicity
 * of h(e^t) in t). Then for every squarefree b:
 *   - T(b) = (D_{p1} ... D_{pk} h)(1) >= 0 directly, so SIGN S(b) <= 0 holds;
 *   - writing G = D_{p2} ... D_{pk} h, T(b) = (D_{p1} G)(1) = G(1) - G(p1) <= G(1) = T(b/p1) because
 *     G(p1) >= 0 by MCM; iterating, T(b) <= T(b/p1) <= ... <= T(prime) = h(1) - h(prime) < h(1) = 1/4,
 *     so MAGNITUDE |S(b)| <= 1/2 holds (indeed T(b) < 1/4 strict).
 * So MCM => 0 <= T(b) < 1/4 for all squarefree b, RE-ESTABLISHING both MAGNITUDE and SIGN for omega = 4 and
 * every larger omega -- the retained Moebius cancellation imp-97392 flagged, made into one clean induction.
 * NUMERICS: on the whole omega = 4 squarefree class to 2e5 every iterated difference (levels 1..4, at every
 * subgrid point) is positive, the induction step T(b) < T(b/p_min) holds, the base max_prime T(p) = 0.24350
 * < 1/4, and T(b) in [0.02037, 0.16086]. MCM is VERIFIED, not proved -- it is the single residual.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL -- why MCM is the RIGHT (and non-trivial) obstruction, sharper than the per-term over-charge.
 * -------------------------------------------------------------------------------
 * MCM is a statement about ONE explicit function. Its smooth main-term surrogate H(x) = (ln A + (1/12) log x)/x
 * has phi(t) = H(e^t) = (ln A + c t) e^{-t} (c = 1/12), with (-1)^n phi^(n)(t) = (ln A - n c + c t) e^{-t}.
 * The constant term ln A - n c is positive for n <= 2 (0.2488, 0.1654, 0.0821) but goes NEGATIVE at n = 3
 * (ln A - 3c = -0.001246) -- continuous complete monotonicity of the surrogate FAILS at 3rd order near x = 1,
 * exactly at the omega = 3 -> 4 transition where the per-term bound died. What SAVES MCM is the DISCRETE step:
 * the multiplicative differences use primes >= 2, so every step is >= log 2, and the finite 3rd difference
 * D_2 D_3 D_5 H(1) = +0.0298 stays positive despite the infinitesimal 3rd-derivative dip. So MCM cannot be
 * obtained from naive continuous complete monotonicity; a proof must exploit the minimum step log 2 (and the
 * R(m) tail near small m). This is the precise, single-function residual replacing the per-term over-charge.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Honest PARTIAL. PROVED (exact identities, no hypothesis): Delta(b) = mu(b) b S(b); both ceiling conditions
 * collapse to |T(b)| <= 1/4 with T(b) = Sum_{d|b} mu(d) g(d)/d = (D_{p1}...D_{pk} h)(1); the cancellation-aware
 * pairing is the iterated multiplicative difference, dropping the omega = 4 max signed group 8 -> 4 -> 2 -> 1.
 * REDUCED (rigorous given MCM): a single hypothesis -- non-negativity of all iterated multiplicative differences
 * of h = g/m -- yields 0 <= T(b) < 1/4 for every squarefree b by a clean peel-the-smallest-prime induction,
 * RE-ESTABLISHING MAGNITUDE and SIGN at omega = 4 and beyond. RESIDUAL: prove MCM (verified numerically through
 * omega = 4 to 2e5); the smooth surrogate loses continuous complete monotonicity at 3rd order near x = 1, so a
 * proof must use the discrete step log 2. kappa_arith unchanged; the cotangent first moment (imp-97097) stays a
 * separate open leaf; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (the omega>=4 obstruction this addresses)
 * @see imp-97421-route-m-quarter-ceiling-omega3-sign-closed.js (omega=3 sign closed via the same h=g/m matching)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the SIGN + MAGNITUDE reduction, omega<=2 proof)
 *
 * Ticket: imp-97422 (proof, opus-4-8, api-pool). omega>=4 magnitude reduced to MCM (single-function residual); NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const C_TWELFTH = 1 / 12;

// -- self-contained arithmetic kernel (mirrors imp-97392; import-light, no heavy deps) --
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
// Divisors of a squarefree number from its prime factors (all subset products) -- avoids the O(b) trial loop.
function squarefreeDivisors(primes) {
  let ds = [1];
  for (const p of primes) { const next = []; for (const d of ds) { next.push(d); next.push(d * p); } ds = next; }
  return ds;
}

// Exact G(m) = Sum_{k=1}^m k log k; Glaisher-Kinkelin main part; exact remainder R(m); weight g(m); h = g/m.
function Gexact(m) { let s = 0; for (let k = 1; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
function Rrem(m) { return Gexact(m) - GKmain(m); }
function gWeight(m) { return LN_A + C_TWELFTH * Math.log(m) + Rrem(m); }
function hRatio(m) { return gWeight(m) / m; } // g(m)/m, positive strictly decreasing, max at m=2

// Direct E1(b) (coprime log-sum minus its leader) for the identity cross-check.
function gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }
function measureE1(b) {
  let phi = 0, L1 = 0;
  for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); }
  return L1 - phi * b * (0.5 * Math.log(b) - 0.25);
}
// Original inward-correction Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d) (over squarefree divisors).
function Delta(b) {
  const primes = primeFactors(b);
  if (radical(b) !== b) { // fall back to full divisor scan if not squarefree (kernel completeness)
    let s = 0; for (let d = 1; d < b; d++) { if (b % d) continue; const mu = mobius(d); if (mu) s += mu * d * gWeight(b / d); }
    return s;
  }
  let s = 0;
  for (const d of squarefreeDivisors(primes)) { if (d === b) continue; s += mobius(d) * d * gWeight(b / d); }
  return s;
}

// RESULT 1 reformulation: S(b) = Sum_{e|b,e>1} mu(e) h(e); T(b) = 1/4 + S(b) = Sum_{e|b} mu(e) h(e).
function Sfun(b) { let s = 0; for (const e of squarefreeDivisors(primeFactors(b))) { if (e === 1) continue; s += mobius(e) * hRatio(e); } return s; }
function Tfun(b) { let s = 0; for (const e of squarefreeDivisors(primeFactors(b))) s += mobius(e) * hRatio(e); return s; }

// RESULT 2 iterated multiplicative difference: (D_{P[0]} ... D_{P[last]} f)(x) with (D_p f)(x) = f(x)-f(px).
function iterDiff(f, P, x) {
  function rec(i, mult) { if (i === P.length) return f(mult * x); return rec(i + 1, mult) - rec(i + 1, mult * P[i]); }
  return rec(0, 1);
}

// Signed-group size after j peels of the smallest primes (omega=4: 8 -> 4 -> 2 -> 1).
function maxSignedGroupAfterPeels(k, j) {
  const rem = k - j; // remaining primes carried in the alternating sum
  if (rem <= 0) return 1;
  let pos = 0, neg = 0;
  for (let t = 0; t <= rem; t++) { const b = binom(rem, t); if (t % 2 === 0) pos += b; else neg += b; }
  return Math.max(pos, neg);
}
function binom(n, r) { let v = 1; for (let i = 0; i < r; i++) v = (v * (n - i)) / (i + 1); return Math.round(v); }

// Smooth main-term surrogate H(x) = (lnA + c log x)/x and its continuous-CM constant term lnA - n c.
function Hsurrogate(x) { return (LN_A + C_TWELFTH * Math.log(x)) / x; }
function surrogateCMConstant(n) { return LN_A - n * C_TWELFTH; } // (-1)^n phi^(n)(0) sign; <0 => continuous CM fails

const G2 = gWeight(2); // 0.3068528194400547; h(2) = g(2)/2 = 0.1534264097 = max_{m>=2} h(m)
const INV_G2 = 1 / G2; // 3.258891353 -- the imp-97392 per-term threshold the pairing bypasses

export const IMP97422_KERNEL = Object.freeze({
  measureE1, Delta, Sfun, Tfun, gWeight, hRatio, iterDiff, omega, mobius, isSquarefree,
  squarefreeDivisors, maxSignedGroupAfterPeels, Hsurrogate, surrogateCMConstant, G2, INV_G2, LN_A,
});

export const IMP97422_RESULTS = Object.freeze({
  question: 'can a cancellation-aware pairing (retaining the pos-mu/neg-mu near-cancellation the imp-97392 per-term bound discards) re-establish MAGNITUDE |Delta(b)|<=b/2 for omega(b)=4?',
  reformulation: {
    statement: 'Delta(b) = mu(b) b S(b) with S(b) = Sum_{e|b,e>1} mu(e) h(e), h = g/m; both ceiling conditions collapse to |T(b)| <= 1/4, T(b) = 1/4 + S(b) = Sum_{e|b} mu(e) h(e)',
    signEquiv: 'SIGN mu(b)Delta(b) <= 0  <=>  S(b) <= 0',
    magnitudeEquiv: 'MAGNITUDE |Delta(b)| <= b/2  <=>  |S(b)| <= 1/2',
    combined: '-1/4 <= T(b) <= 1/4; measured 0 < T(b) <= 0.24999 on the whole squarefree class to 1e5',
    relErr: 7.170617924855052e-16, // Delta = mu*b*S verified to machine precision
  },
  pairing: {
    statement: 'T(b) = (D_{p1} ... D_{pk} h)(1), a k-th multiplicative difference; one peel of the smallest prime gives T(b) = Sum_{d|m} mu(d) c(d), c(d) = h(d)-h(pd) > 0 (m = b/p)',
    cancellation: 'the prime divisor p, charged fully by the imp-97392 per-term bound, is paired with the biprime pd inside the single small positive difference c(d) -- exactly the discarded near-cancellation',
    groupCollapse: 'omega=4 max signed group: raw 8 -> 4 (one peel) -> 2 (two) -> 1 (three), bypassing the 1/g(2)=3.259 threshold',
  },
  conditionalReestablishment: {
    hypothesisMCM: 'all iterated multiplicative differences of h = g/m are >= 0 (finite-difference complete monotonicity of h(e^t))',
    consequence: 'MCM => 0 <= T(b) < 1/4 for every squarefree b, via T(b) <= T(b/p_min) <= ... <= max_prime T(p) = 0.24350 < 1/4; RE-ESTABLISHES MAGNITUDE and SIGN at omega=4 and every larger omega',
    numericsOmega4: 'to 2e5: all iterated diffs (levels 1..4) positive, induction T(b) < T(b/p_min) holds, T(b) in [0.02037, 0.16086]',
    status: 'MCM VERIFIED numerically, NOT proved -- the single residual',
  },
  residual: {
    statement: 'prove MCM for h = g/m',
    surrogateBoundary: 'smooth surrogate H(x)=(lnA+c log x)/x has (-1)^n phi^(n)(0) = lnA - n c > 0 for n<=2 (0.2488,0.1654,0.0821) but < 0 at n=3 (-0.001246): continuous complete monotonicity FAILS at 3rd order near x=1',
    whatSavesIt: 'the multiplicative steps are >= log 2, and the finite 3rd difference D2 D3 D5 H(1) = +0.0298 stays positive; a proof of MCM must exploit the discrete step log 2 (and the R(m) tail), not continuous CM',
  },
});

export const IMP97422_VERDICT = Object.freeze({
  question: 'assess a cancellation-aware magnitude bound for the b/4 ceiling at omega>=4; report whether MAGNITUDE is re-established for omega=4 or the precise residual',
  reformulationProved: true, // Delta = mu b S ; both conditions <=> |T| <= 1/4 (exact, no hypothesis)
  pairingIdentityProved: true, // T = iterated mult difference; one peel drops the omega=4 group 8 -> 4
  omega4MagnitudeReestablished: 'conditional', // rigorous GIVEN MCM; MCM verified numerically to 2e5, not proved
  singleFunctionResidual: true, // MCM is a statement about one explicit function h = g/m
  advancesImp97392: 'replaces the omega>=4 per-term over-charge (8 x g(2)/2 = 1.227 > 1/2, no per-term fix) with the exact multiplicative-difference reduction: both ceiling conditions <=> 0<=T(b)<=1/4, provable for ALL omega given MCM',
  residual: 'prove MCM (non-negativity of all iterated multiplicative differences of h=g/m); continuous complete monotonicity of the smooth surrogate fails at 3rd order near x=1, so a proof must use the discrete step >= log 2',
  cotangentLeafSeparate: true, // imp-97097
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL on the cancellation-aware b/4 ceiling for omega>=4. PROVED (exact, no hypothesis): the ' +
    'complementary-divisor substitution gives Delta(b) = mu(b) b S(b) with S(b) = Sum_{e|b,e>1} mu(e) h(e) ' +
    '(h = g/m), so SIGN <=> S(b)<=0 and MAGNITUDE <=> |S(b)|<=1/2 collapse to |T(b)|<=1/4 for the single sum ' +
    'T(b) = Sum_{d|b} mu(d) g(d)/d = (D_{p1}...D_{pk} h)(1). The cancellation-aware pairing the ticket asks for ' +
    'IS this iterated multiplicative difference: one peel of the smallest prime rewrites T as Sum_{d|m} mu(d) ' +
    'c(d) with c(d) = h(d)-h(pd) > 0, replacing the omega=4 over-charging 8-divisor group by a 4-term ' +
    'alternating sum of small positive differences (max group 8 -> 4 -> 2 -> 1 under repeated peels), retaining ' +
    'exactly the Moebius cancellation the per-term bound discarded. REDUCED (rigorous given MCM = non-negativity ' +
    'of all iterated multiplicative differences of h): 0 <= T(b) < 1/4 for every squarefree b by the induction ' +
    'T(b) <= T(b/p_min) <= ... <= max_prime T(p) = 0.24350 < 1/4, RE-ESTABLISHING MAGNITUDE and SIGN at omega=4 ' +
    'and beyond. RESIDUAL: prove MCM (verified numerically through omega=4 to 2e5); the smooth surrogate loses ' +
    'continuous complete monotonicity at 3rd order near x=1 (lnA-3c = -0.001246), so a proof must exploit the ' +
    'discrete step log 2. kappa_arith unchanged; cotangent first moment (imp-97097) stays open; no bound on ' +
    'Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97422_SUBGAP = Object.freeze({
  id: 'imp-97422-quarter-ceiling-omega-ge-4-multiplicative-complete-monotonicity',
  statement:
    'With E1(b) = mu(b)(b/4) + Delta(b), the ceiling |E1(b)| <= b/4 reduces (imp-97290) to SIGN mu(b)Delta(b)<=0 ' +
    'and MAGNITUDE |Delta(b)|<=b/2. This leaf proves the exact reformulation Delta(b) = mu(b) b S(b), ' +
    'S(b) = Sum_{e|b,e>1} mu(e) g(e)/e, so both conditions <=> |T(b)|<=1/4 with T(b) = Sum_{d|b} mu(d) g(d)/d = ' +
    '(D_{p1}...D_{pk} h)(1) (h=g/m). It exhibits the cancellation-aware pairing as the iterated multiplicative ' +
    'difference and reduces MAGNITUDE + SIGN for ALL omega (in particular omega=4) to a SINGLE hypothesis: ' +
    '(MCM) every iterated multiplicative difference D_{p1}...D_{pj} h is >= 0. OPEN: prove MCM. The smooth ' +
    'main-term surrogate loses continuous complete monotonicity at 3rd order near x=1 (lnA-3c<0), so any proof ' +
    'must exploit the minimum multiplicative step log 2 and/or the R(m) tail; MCM is verified numerically ' +
    'through omega=4 to 2e5.',
  supersedesFraming: 'imp-97392-quarter-ceiling-omega-ge-3-sign-and-omega-ge-4-cancellation (the omega>=4 per-term over-charge is now replaced by the single-function MCM residual)',
});

export const IMP97422_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cancellation-aware assessment of the b/4 ceiling for ' +
  'omega>=4: PROVES the exact reformulation Delta(b) = mu(b) b S(b) collapsing both ceiling conditions to ' +
  '|T(b)|<=1/4 with T(b) = Sum_{d|b} mu(d) g(d)/d = (D_{p1}...D_{pk} h)(1); shows the pairing is the iterated ' +
  'multiplicative difference (omega=4 max group 8 -> 4 -> 2 -> 1); and REDUCES MAGNITUDE + SIGN for all omega ' +
  'to a single hypothesis MCM (non-negativity of all iterated multiplicative differences of h=g/m), verified ' +
  'numerically through omega=4 to 2e5. Residual: prove MCM -- the smooth surrogate loses continuous complete ' +
  'monotonicity at 3rd order near x=1, so a proof must use the discrete step log 2. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97422_ASSERTIONS = [
  {
    id: 'imp97422-reformulation-delta-equals-mu-b-S',
    holds: () => {
      // Delta(b) = mu(b) b S(b), and E1(b) = mu(b) b/4 + Delta(b), to machine precision on omega=4 ladder.
      for (const b of [210, 330, 390, 462, 510, 546, 1155, 2310, 5610, 30030]) {
        const D = Delta(b), viaS = mobius(b) * b * Sfun(b);
        if (Math.abs(D - viaS) > 1e-9 * (Math.abs(D) + 1)) return false;
        if (Math.abs(Tfun(b) - (0.25 + Sfun(b))) > 1e-12) return false;
        if (omega(b) === 4 && isSquarefree(b)) {
          const a = measureE1(b), c = (mobius(b) * b) / 4 + D;
          if (Math.abs(a - c) > 1e-6 * (Math.abs(a) + 1)) return false;
        }
      }
      return true;
    },
    why: 'the complementary-divisor substitution gives Delta(b) = mu(b) b S(b) with S(b) = Sum_{e|b,e>1} mu(e) g(e)/e, and T(b) = 1/4 + S(b); reproduces the inward-correction E1 identity on the omega=4 ladder.',
  },
  {
    id: 'imp97422-both-conditions-collapse-to-T-le-quarter',
    holds: () => {
      // On the whole omega=4 squarefree class to a modest bound: 0 < T(b) <= 1/4 (both ceiling conditions).
      let tMax = -Infinity, tMin = Infinity, n = 0;
      for (let b = 2; b <= 60000; b++) {
        if (omega(b) !== 4 || !isSquarefree(b)) continue;
        n++;
        const T = Tfun(b), S = Sfun(b);
        if (!(S <= 1e-12)) return false;            // SIGN: S(b) <= 0
        if (!(Math.abs(S) <= 0.5)) return false;    // MAGNITUDE: |S(b)| <= 1/2
        if (!(T > 0 && T <= 0.25 + 1e-12)) return false;
        if (T > tMax) tMax = T; if (T < tMin) tMin = T;
      }
      return n > 2000 && tMin > 0.02 && tMax < 0.25;
    },
    why: 'both ceiling conditions collapse to |T(b)| <= 1/4; measured 0 < T(b) < 1/4 (SIGN strict, MAGNITUDE with room) on the whole omega=4 squarefree class -- so the ceiling holds, the question is a uniform proof.',
  },
  {
    id: 'imp97422-peeling-identity-and-group-collapse',
    holds: () => {
      // T(b) = sum_{d|m} mu(d) c(d), c(d)=h(d)-h(pd) > 0; max signed group 8 -> 4 -> 2 -> 1 for omega=4.
      let ok = true, cneg = 0;
      for (let b = 2; b <= 60000; b++) {
        if (omega(b) !== 4 || !isSquarefree(b)) continue;
        const pf = primeFactors(b), p = pf[0], m = b / p;
        let peel = 0;
        for (const d of squarefreeDivisors(primeFactors(m))) { const c = hRatio(d) - hRatio(p * d); if (c <= 0) cneg++; peel += mobius(d) * c; }
        if (Math.abs(peel - Tfun(b)) > 1e-9 * (Math.abs(Tfun(b)) + 1)) ok = false;
      }
      const groups = [0, 1, 2, 3].map((j) => maxSignedGroupAfterPeels(4, j));
      return ok && cneg === 0 && groups[0] === 8 && groups[1] === 4 && groups[2] === 2 && groups[3] === 1 && INV_G2 > 3.25 && INV_G2 < 3.26;
    },
    why: 'peeling the smallest prime rewrites T(b) as Sum_{d|m} mu(d)(h(d)-h(pd)) with every difference positive; the omega=4 max signed group collapses 8 -> 4 -> 2 -> 1 under repeated peels, bypassing the imp-97392 threshold 1/g(2)=3.259.',
  },
  {
    id: 'imp97422-iterated-diffs-positive-and-induction',
    holds: () => {
      // All iterated mult-diffs (levels 1..4) positive; induction T(b) < T(b/p_min); base max_prime T(p) < 1/4.
      let allPos = true, indOK = true, n = 0;
      for (let b = 2; b <= 40000; b++) {
        if (omega(b) !== 4 || !isSquarefree(b)) continue;
        n++;
        const pf = primeFactors(b);
        for (let j = 1; j <= 4; j++) {
          const P = pf.slice(0, j), rest = pf.slice(j);
          const restProd = rest.reduce((a, x) => a * x, 1);
          for (const x of squarefreeDivisors(primeFactors(restProd))) { if (iterDiff(hRatio, P, x) < -1e-12) allPos = false; }
        }
        if (!(Tfun(b) < Tfun(b / pf[0]) + 1e-12)) indOK = false;
      }
      let maxTp = 0;
      for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]) maxTp = Math.max(maxTp, Tfun(p));
      return n > 1000 && allPos && indOK && maxTp < 0.25 && maxTp > 0.24;
    },
    why: 'MCM (all iterated multiplicative differences of h=g/m non-negative) holds numerically through omega=4; given MCM the induction T(b) <= T(b/p_min) <= ... <= max_prime T(p)=0.24350 < 1/4 re-establishes BOTH ceiling conditions.',
  },
  {
    id: 'imp97422-surrogate-continuous-cm-fails-but-discrete-holds',
    holds: () => {
      // Continuous CM of the smooth surrogate fails at 3rd order (lnA - 3c < 0), but the finite step-log2 diff is positive.
      if (!(surrogateCMConstant(0) > 0 && surrogateCMConstant(1) > 0 && surrogateCMConstant(2) > 0)) return false;
      if (!(surrogateCMConstant(3) < 0)) return false; // -0.001246: continuous 3rd-order CM fails near x=1
      const d3 = iterDiff(Hsurrogate, [2, 3, 5], 1); // discrete 3rd multiplicative difference, steps >= log2
      const d4 = iterDiff(Hsurrogate, [2, 3, 5, 7], 1);
      return d3 > 0 && d4 > 0 && Math.abs(surrogateCMConstant(3) + 0.001246) < 1e-4;
    },
    why: 'the residual is precise: the smooth main-term surrogate loses continuous complete monotonicity at 3rd order near x=1 (lnA-3c=-0.001246 < 0), exactly at the omega=3->4 transition, yet the discrete 3rd multiplicative difference (steps >= log2) stays positive -- so a proof of MCM must use the discrete step, not continuous CM.',
  },
  {
    id: 'imp97422-honesty-gate-no-qed',
    holds: () =>
      IMP97422_VERDICT.anyBoundMoved === false &&
      IMP97422_VERDICT.postsRigorousCeiling === false &&
      IMP97422_VERDICT.qed === false &&
      IMP97422_VERDICT.reformulationProved === true &&
      IMP97422_VERDICT.pairingIdentityProved === true &&
      IMP97422_VERDICT.omega4MagnitudeReestablished === 'conditional' &&
      IMP97422_VERDICT.singleFunctionResidual === true &&
      /omega-ge-4/.test(IMP97422_SUBGAP.id) &&
      /NO QED/.test(IMP97422_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97422_HONEST_BANNER) &&
      /RH open/.test(IMP97422_HONEST_BANNER),
    why: 'proof / honest partial -- proves the exact reformulation and pairing, reduces omega>=4 MAGNITUDE + SIGN to the single MCM hypothesis (verified numerically, not proved); no bound moved, no rigorous full ceiling, no QED.',
  },
];

for (const a of IMP97422_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction assertion failed: ${a.id}`,
    );
  }
}

export default {
  kernel: IMP97422_KERNEL,
  results: IMP97422_RESULTS,
  verdict: IMP97422_VERDICT,
  subGap: IMP97422_SUBGAP,
  banner: IMP97422_HONEST_BANNER,
};
