/**
 * @module imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction
 *
 * imp-97392 (proof -- HONEST PARTIAL, NO QED): assess whether the imp-97290 sign + magnitude conditions
 * for the b/4 ceiling |E1(b)| <= b/4 extend past the semiprime class omega(b) = 2 to omega(b) >= 3, and
 * pin the precise structure that blocks a uniform proof.
 *
 *   Notation exactly as imp-97290: E1(b) = mu(b)(b/4) + Delta(b), Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d),
 *   g(m) = ln A + (1/12) log m + R(m), g(1) = 1/4, g positive strictly increasing, g(m)/m strictly
 *   decreasing with max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097 (attained at m = 2). imp-97290 proved the
 *   ceiling reduction |E1(b)| <= b/4  <=>  (i) mu(b) Delta(b) <= 0 (SIGN, correction points inward) AND
 *   (ii) |Delta(b)| <= b/2 (MAGNITUDE), and closed omega <= 2. This leaf assesses omega >= 3.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- omega = 3 MAGNITUDE (ii) IS PROVED (a genuine extension past the semiprime class).
 * -------------------------------------------------------------------------------
 * For squarefree b = pqr (distinct primes p < q < r, mu(b) = -1) the proper divisors split by Moebius sign:
 *   positive-mu:  d = 1 (the leader-free remainder g(pqr)) and the three biprimes pq, pr, qr;
 *   negative-mu:  the three primes p, q, r.
 * So Delta(pqr) = [g(pqr) + pq g(r) + pr g(q) + qr g(p)]  -  [p g(qr) + q g(pr) + r g(pq)]  =: A - B, with
 * A, B > 0. PEEL the tiny d = 1 term g(pqr) = O(log b) out of A. Every OTHER proper-divisor term obeys the
 * uniform per-term bound d g(b/d) = b (g(b/d)/(b/d)) <= b g(2)/2 (since b/d >= 2 and g(m)/m <= g(2)/2). A
 * carries 3 such biprime terms, B carries 3 such prime terms, so with Delta = A - B a difference of two
 * positives, |Delta| <= max(A, B) <= g(pqr) + 3 * (b g(2)/2) = g(pqr) + (3/2) g(2) b. Since (3/2) g(2) =
 * 0.4602792 < 1/2 and g(pqr) = O(log b) is negligible against the linear gap, |Delta(pqr)| < b/2 for every
 * omega = 3 squarefree b. VERIFIED: no violation and min slack (b/2 - [g(b) + 1.5 g(2) b]) = 0.6594 at the
 * smallest case b = 30, positive throughout to b = 200000. This closes MAGNITUDE (ii) on the whole omega = 3
 * squarefree class -- the first class where BOTH the per-term over-charge is tame AND the leader has odd parity.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- omega = 3 SIGN (i) reduces to a pairing surplus (measured >= 0; NOT cleanly closed = residual).
 * -------------------------------------------------------------------------------
 * mu(pqr) = -1, so SIGN demands mu(b) Delta(b) <= 0, i.e. Delta(pqr) >= 0. Pair each prime x's negative
 * term x g(b/x) with its complementary biprime term (b/x) g(x):
 *     Delta(pqr) = g(pqr) + Sum_{x in {p,q,r}} [ (b/x) g(x) - x g(b/x) ],
 *     (b/x) g(x) - x g(b/x) = b [ g(x)/x - g(b/x)/(b/x) ]  >= 0   iff   x <= b/x  iff  x^2 <= b.
 * The p-pair and q-pair are ALWAYS >= 0 (p^2 <= pqr since p <= qr; q^2 <= pqr since q <= pr). The r-pair is
 * >= 0 iff r <= pq, which FAILS whenever the top prime exceeds the product of the two smaller (e.g. b = 2*3*7,
 * pq = 6 < 7 = r) -- measured negative in 15634 of 19919 omega = 3 cases to b = 100000. The overall sign then
 * rests on the surplus g(pqr) + (p-pair) + (q-pair) covering the r-pair deficit b[g(pq)/(pq) - g(r)/r]. This
 * surplus dominates (the p-pair alone scales like b g(p)/p with p small, hence large), and Delta(pqr) stays
 * strictly positive (measured min 6.576 to b = 100000). But there is no clean per-term proof: SIGN for omega = 3
 * is MEASURED, not established. This is the named sub-gap of this leaf.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- THE PRECISE OBSTRUCTION for omega >= 4 (why the per-term bound stops working).
 * -------------------------------------------------------------------------------
 * The Result-1 proof works because max(#pos-nontrivial, #neg) = max(3, 3) = 3 and 3 * g(2)/2 = 0.4603 < 1/2.
 * The uniform per-term bound |Delta| <= (max signed-group size) * b g(2)/2 (plus the peeled g(b)) needs the
 * group size < 1/g(2) = 3.258891. Counting squarefree proper divisors by parity (positive-mu = even # of
 * primes, negative-mu = odd), peeling d = 1:
 *     omega = 2: max group 2  -> const 0.3069  (OK, imp-97290)
 *     omega = 3: max group 3  -> const 0.4603  (OK, Result 1)
 *     omega = 4: max group 8  -> const 1.2274  (OVER-CHARGE: 8 = C(4,1)+C(4,3) neg-mu divisors)
 *     omega = 5: max group 15 -> const 2.3014  (OVER-CHARGE)
 *     omega = 6: max group 32 -> const 4.9096  (OVER-CHARGE)
 * At omega = 4 the largest signed group already carries 6 biprimes / 8 (primes + triprimes), and the per-term
 * bound charges each the full b g(2)/2 -- ignoring that within a signed group the terms have wildly different
 * sizes and that the positive-mu and negative-mu groups NEARLY CANCEL. That cancellation is exactly what the
 * per-term (triangle-on-groups) bound discards, so no per-term constant can prove MAGNITUDE for omega >= 4.
 * The extremal family is the PRIMORIALS b_k = 2*3*...*p_k: measured |Delta|/(b/2) rises monotonically
 * 0.307, 0.401, 0.438, 0.459, 0.471, 0.480, 0.486, 0.492, 0.496, 0.499, 0.502 (omega = 1..11), crossing 1/2
 * at omega = 11 yet staying well below the MAGNITUDE ceiling 1 -- so BOTH conditions still hold (SIGN with
 * large room, |E1|/(b/4) tiny), but only via genuine Moebius cancellation between the two signed groups, not
 * any per-term charge. (Large-omega primorial ratios use the g(m) ~ ln A + (1/12) log m tail form, R -> 0, so
 * their trailing digits are approximate; the monotone rise-through-1/2-below-1 picture is robust.)
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Honest PARTIAL. PROVED: MAGNITUDE (ii) |Delta(b)| < b/2 on the ENTIRE omega = 3 squarefree class (peeled
 * per-term bound, const 1.5 g(2) = 0.4603 < 1/2). STRUCTURED: SIGN (i) for omega = 3 reduces to a pairing
 * surplus (two pairs provably >= 0, the r-pair covered by surplus -- measured, not closed). OBSTRUCTION pinned
 * for omega >= 4: the per-term group-count bound over-charges (max group C(k,.) exceeds 1/g(2) = 3.259 from
 * k = 4), so the uniform ceiling there requires the retained Moebius cancellation, exactly as imp-97290
 * flagged; the extremal family is the primorials. kappa_arith unchanged; the cotangent first moment
 * (imp-97097) stays a separate open leaf; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the omega <= 2 proof + reduction this extends)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (prime ceiling; the original residual)
 * @see imp-97323-route-m-e1-quarter-ceiling-cohort-index.js (cohort index: ceiling PROVED omega<=2, OPEN omega>=3)
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (per-class |E1|/(b/4); highly-composite -> 0)
 *
 * Ticket: imp-97392 (proof, opus-4-8, api-pool). omega=3 magnitude proved; sign structured; omega>=4 obstruction pinned; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)

// -- self-contained arithmetic kernel (mirrors imp-97290; import-light, no heavy deps) --
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
// Divisors generated from the prime factorisation, then sorted ascending -- the same list (and
// therefore the same floating-point summation order in Delta) as the original O(b) trial scan,
// which made the import-time assertion sweeps (every omega=3 b <= 2e5) take minutes and hung the
// /viz-imp97426 page that imports this module.
function divisors(b) {
  let ds = [1];
  let n = b;
  for (let p = 2; p * p <= n; p++) {
    if (n % p !== 0) continue;
    let e = 0;
    while (n % p === 0) { n /= p; e++; }
    const next = [];
    for (const d of ds) { let pk = 1; for (let i = 0; i <= e; i++) { next.push(d * pk); pk *= p; } }
    ds = next;
  }
  if (n > 1) ds = ds.concat(ds.map((d) => d * n));
  return ds.sort((x, y) => x - y);
}

// Exact G(m) = Sum_{k=1}^m k log k; Glaisher-Kinkelin main part; exact remainder R(m); weight g(m).
// Memoised running prefix sum: G_PREFIX[m] is accumulated in exactly the same order as the
// original per-call loop (s += k log k for k = 1..m), so values are bit-identical, but each
// gWeight call is O(1) amortised instead of O(m).
const G_PREFIX = [0];
function Gexact(m) {
  for (let k = G_PREFIX.length; k <= m; k++) G_PREFIX.push(G_PREFIX[k - 1] + k * Math.log(k));
  return G_PREFIX[m];
}
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
function Rrem(m) { return Gexact(m) - GKmain(m); }
function gWeight(m) { return LN_A + (1 / 12) * Math.log(m) + Rrem(m); }

// Direct E1(b) and the exact leader + inward-correction split (imp-97290).
function measureE1(b) {
  let phi = 0, L1 = 0;
  for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); }
  return L1 - phi * b * (0.5 * Math.log(b) - 0.25);
}
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

const G2 = gWeight(2); // 0.3068528194400547; g(2)/2 = 0.1534264097 = max_{m>=2} g(m)/m
const PER_TERM = G2 / 2; // uniform per-proper-divisor charge d g(b/d) <= b * PER_TERM
const INV_G2 = 1 / G2; // 3.258891353; group size must be strictly below this for the per-term bound to work

// omega=3 peeled per-term magnitude bound: |Delta(pqr)| <= g(pqr) + (3/2) g(2) b.
function omega3MagnitudeBound(b) { return gWeight(b) + 1.5 * G2 * b; }

// omega=3 sign pairing: Delta = g(pqr) + Sum_x [ (b/x)g(x) - x g(b/x) ]; per-pair sign = (x^2 <= b).
function signPairing(b) {
  const [p, q, r] = primeFactors(b);
  const pairP = b * (gWeight(p) / p - gWeight(q * r) / (q * r));
  const pairQ = b * (gWeight(q) / q - gWeight(p * r) / (p * r));
  const pairR = b * (gWeight(r) / r - gWeight(p * q) / (p * q));
  return { pairP, pairQ, pairR, reconstructed: gWeight(b) + pairP + pairQ + pairR };
}

// Signed-group sizes (positive-mu vs negative-mu proper divisors), peeling d=1 from the positive group.
function binom(n, k) { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return Math.round(r); }
function groupCounts(k) {
  let pos = 0, neg = 0;
  for (let j = 0; j < k; j++) { if (j % 2 === 0) pos += binom(k, j); else neg += binom(k, j); }
  const maxGroup = Math.max(pos - 1, neg); // peel d=1 from the positive group
  return { pos, neg, posNontrivial: pos - 1, maxGroup, perTermConst: maxGroup * PER_TERM };
}

export const IMP97392_KERNEL = Object.freeze({
  measureE1, Delta, gWeight, omega, mobius, divisors, isSquarefree,
  omega3MagnitudeBound, signPairing, groupCounts, G2, PER_TERM, INV_G2, LN_A,
});

export const IMP97392_RESULTS = Object.freeze({
  question: 'do the imp-97290 SIGN (mu(b)Delta(b)<=0) + MAGNITUDE (|Delta(b)|<=b/2) conditions for |E1(b)|<=b/4 extend to omega(b)>=3?',
  omega3Magnitude: {
    statement: '|Delta(b)| < b/2 for every omega(b)=3 squarefree b -- PROVED',
    method: 'peel the O(log b) d=1 term g(pqr); the 3 biprime (pos-mu) and 3 prime (neg-mu) proper divisors each obey d g(b/d) <= b g(2)/2; Delta = A - B (both positive) => |Delta| <= max(A,B) <= g(b) + (3/2) g(2) b',
    constant: 1.5 * G2, // 0.4602792 < 1/2
    minSlackAtSmallest: 0.6594, // b/2 - [g(b)+1.5 g(2) b] at b=30 (smallest omega=3), positive throughout to 2e5
    conclusion: '(3/2) g(2) = 0.4602792 < 1/2 with g(b)=O(log b) negligible => MAGNITUDE holds on the whole omega=3 squarefree class',
  },
  omega3Sign: {
    statement: 'mu(pqr)Delta(pqr) <= 0 i.e. Delta(pqr) >= 0 -- MEASURED (>=0), reduced to a pairing surplus, NOT cleanly closed',
    pairingIdentity: 'Delta(pqr) = g(pqr) + Sum_{x in {p,q,r}} [ (b/x) g(x) - x g(b/x) ], each pair >= 0 iff x^2 <= b',
    alwaysNonneg: 'the p-pair and q-pair are always >= 0 (p^2<=pqr, q^2<=pqr)',
    conditionalPair: 'the r-pair is >= 0 iff r <= pq; it goes negative when the top prime exceeds the two smaller (e.g. 2*3*7), measured negative in 15634 / 19919 cases to b=1e5',
    residual: 'SIGN rests on the surplus g(pqr)+(p-pair)+(q-pair) covering the r-pair deficit; measured min Delta = 6.576 (>0) but no clean per-term proof',
  },
  omega4Obstruction: {
    statement: 'the per-term (triangle-on-groups) bound over-charges from omega=4; a uniform proof there needs the retained Moebius cancellation',
    rule: 'per-term bound works iff max signed-group size < 1/g(2) = 3.258891',
    groupTable: [
      { omega: 2, maxGroup: 2, perTermConst: 2 * (G2 / 2), ok: true },
      { omega: 3, maxGroup: 3, perTermConst: 3 * (G2 / 2), ok: true },
      { omega: 4, maxGroup: 8, perTermConst: 8 * (G2 / 2), ok: false },
      { omega: 5, maxGroup: 15, perTermConst: 15 * (G2 / 2), ok: false },
      { omega: 6, maxGroup: 32, perTermConst: 32 * (G2 / 2), ok: false },
    ],
    extremalFamily: 'primorials b_k = 2*3*...*p_k: |Delta|/(b/2) rises monotonically 0.307,0.401,0.438,0.459,0.471,0.480,0.486,0.492,0.496,0.499,0.502 (omega=1..11), crossing 1/2 at omega=11 yet staying well below the ceiling 1 -- both conditions hold, but only via genuine pos/neg Moebius cancellation, not any per-term charge',
    note: 'large-omega primorial ratios use the g(m) ~ ln A + (1/12) log m tail form (R->0); trailing digits approximate, the monotone rise-through-1/2-below-1 shape is robust',
  },
});

export const IMP97392_VERDICT = Object.freeze({
  question: 'assess whether the imp-97290 sign + magnitude conditions extend to omega>=3, or exhibit the precise obstruction',
  omega3MagnitudeProved: true, // |Delta| < b/2 on the whole omega=3 squarefree class (peeled per-term bound)
  omega3SignProved: false, // reduced to a pairing surplus, measured >=0, not cleanly closed
  omega4ObstructionPinned: true, // per-term group-count > 1/g(2) from omega=4; extremal = primorials
  uniformCeilingProved: false, // omega>=4 SIGN + MAGNITUDE stay OPEN (need retained Moebius cancellation)
  advancesImp97290: 'extends MAGNITUDE (ii) from omega<=2 to the whole omega=3 squarefree class; supplies the sign pairing identity and pins the omega>=4 over-charge threshold at 1/g(2)=3.259',
  residual: 'omega=3 SIGN (pairing surplus) + omega>=4 SIGN & MAGNITUDE via retained Moebius cancellation between the positive-mu and negative-mu signed groups',
  cotangentLeafSeparate: true, // imp-97097
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL on whether the imp-97290 ceiling conditions extend to omega>=3. PROVED: MAGNITUDE (ii) ' +
    '|Delta(b)| < b/2 on the ENTIRE omega=3 squarefree class -- peel the O(log b) d=1 term g(pqr), bound the ' +
    '3 biprime and 3 prime proper-divisor terms each by b g(2)/2, and use Delta = A - B (both positive) to get ' +
    '|Delta| <= g(b) + (3/2) g(2) b with (3/2) g(2) = 0.4603 < 1/2. STRUCTURED: SIGN (i) for omega=3 reduces to ' +
    'the pairing identity Delta = g(pqr) + Sum_x [(b/x)g(x) - x g(b/x)] whose p- and q-pairs are always >= 0 ' +
    'and whose r-pair (>=0 iff r<=pq) is covered by the surplus -- measured Delta>=0 but not cleanly closed. ' +
    'OBSTRUCTION pinned for omega>=4: the per-term group-count bound over-charges once the largest signed group ' +
    'C(k,.) exceeds 1/g(2)=3.259 (from omega=4: 8 neg-mu divisors, const 1.227), so the uniform ceiling there ' +
    'requires the retained Moebius cancellation; the extremal family is the primorials, |Delta|/(b/2) rising ' +
    'monotonically through 1/2 toward a limit below 1. kappa_arith unchanged; the cotangent first moment ' +
    '(imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97392_SUBGAP = Object.freeze({
  id: 'imp-97392-quarter-ceiling-omega-ge-3-sign-and-omega-ge-4-cancellation',
  statement:
    'With E1(b) = mu(b)(b/4) + Delta(b), Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d), the ceiling |E1(b)| <= b/4 ' +
    'reduces (imp-97290) to (i) mu(b)Delta(b) <= 0 and (ii) |Delta(b)| <= b/2. This leaf PROVES (ii) on the ' +
    'whole omega=3 squarefree class (peeled per-term bound, const (3/2)g(2)=0.4603<1/2) and reduces (i) at ' +
    'omega=3 to a pairing surplus (measured >=0). OPEN: omega=3 SIGN as a clean statement, and BOTH conditions ' +
    'for omega>=4, where the per-term group-count bound over-charges (max signed group C(k,.) > 1/g(2)=3.259 ' +
    'from omega=4) and the retained Moebius cancellation between the positive-mu and negative-mu groups is ' +
    'required. Extremal family: the primorials.',
  supersedesFraming: 'imp-97290-uniform-quarter-ceiling-omega-ge-3 (omega=3 magnitude now closed; omega>=4 over-charge threshold pinned at 1/g(2))',
});

export const IMP97392_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment of whether the imp-97290 b/4-ceiling conditions ' +
  'extend to omega>=3: PROVES MAGNITUDE |Delta(b)| < b/2 on the whole omega=3 squarefree class (peeled per-term ' +
  'bound, (3/2)g(2)=0.4603<1/2), reduces the omega=3 SIGN to a measured pairing surplus, and pins the omega>=4 ' +
  'obstruction (per-term group-count exceeds 1/g(2)=3.259, forcing the retained Moebius cancellation; extremal ' +
  'family = primorials). The cotangent first moment (imp-97097) stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97392_ASSERTIONS = [
  {
    id: 'imp97392-decomp-reproduces-e1-omega3',
    holds: () => {
      // E1(b) = mu(b) b/4 + Delta(b) to machine precision on omega=3 squarefree ladder.
      for (const b of [30, 42, 66, 105, 231, 385, 1001, 2431, 12673]) {
        if (omega(b) !== 3 || !isSquarefree(b)) return false;
        const a = measureE1(b), c = (mobius(b) * b) / 4 + Delta(b);
        if (Math.abs(a - c) > 1e-6 * (Math.abs(a) + 1)) return false;
      }
      return true;
    },
    why: 'the imp-97290 leader + inward-correction identity E1(b)=mu(b)(b/4)+Delta(b) reproduces the direct coprime sum on the omega=3 class, so the ceiling reduction to SIGN + MAGNITUDE applies verbatim.',
  },
  {
    id: 'imp97392-omega3-magnitude-proved',
    holds: () => {
      // MAGNITUDE (ii): |Delta| <= g(b) + 1.5 g(2) b < b/2 on the whole omega=3 squarefree class to 2e5.
      if (!(1.5 * G2 < 0.5)) return false; // the constant is strictly below 1/2
      let minSlack = Infinity;
      for (let b = 2; b <= 200000; b++) {
        if (omega(b) !== 3 || !isSquarefree(b)) continue;
        const bound = omega3MagnitudeBound(b);
        if (!(Math.abs(Delta(b)) <= bound)) return false; // per-term bound holds
        if (!(bound < b / 2)) return false; // bound below the ceiling
        const slack = b / 2 - bound;
        if (slack < minSlack) minSlack = slack;
      }
      return minSlack > 0.5 && minSlack < 1; // ~0.6594 at b=30
    },
    why: 'peeling the O(log b) d=1 term and charging the 3 biprime + 3 prime proper divisors each by b g(2)/2 gives |Delta| <= g(b) + (3/2) g(2) b with (3/2) g(2) = 0.4603 < 1/2 -- MAGNITUDE (ii) holds on the entire omega=3 squarefree class (min slack 0.6594 at b=30).',
  },
  {
    id: 'imp97392-omega3-sign-pairing-structure',
    holds: () => {
      // SIGN (i): pairing identity exact; p- and q-pairs always >=0; r-pair can be <0; overall Delta>=0 (measured).
      let idOK = true, rNeg = 0, pqNeg = 0, minDelta = Infinity, n = 0;
      for (let b = 2; b <= 100000; b++) {
        if (omega(b) !== 3 || !isSquarefree(b)) continue;
        n++;
        const s = signPairing(b), D = Delta(b);
        if (Math.abs(s.reconstructed - D) > 1e-6 * (Math.abs(D) + 1)) idOK = false;
        if (s.pairP < -1e-9 || s.pairQ < -1e-9) pqNeg++;
        if (s.pairR < 0) rNeg++;
        if (D < minDelta) minDelta = D;
      }
      // pairing exact; the two small-prime pairs never negative; the r-pair frequently negative; Delta>=0 throughout.
      return idOK && pqNeg === 0 && rNeg > 0 && minDelta > 0 && n > 1000;
    },
    why: 'the sign pairing Delta = g(pqr) + Sum_x[(b/x)g(x) - x g(b/x)] is exact; the p- and q-pairs are always >=0 (x^2<=b), the r-pair goes negative when r>pq, and the surplus keeps Delta>0 throughout -- SIGN (i) is reduced to a measured surplus, not cleanly closed.',
  },
  {
    id: 'imp97392-omega4-overcharge-threshold',
    holds: () => {
      // The per-term group-count bound works for omega=2,3 and over-charges from omega=4 (max group > 1/g(2)).
      if (!(INV_G2 > 3.25 && INV_G2 < 3.26)) return false; // 1/g(2) = 3.258891
      const g2 = groupCounts(2), g3 = groupCounts(3), g4 = groupCounts(4), g5 = groupCounts(5);
      if (!(g2.maxGroup === 2 && g2.perTermConst < 0.5)) return false;
      if (!(g3.maxGroup === 3 && g3.perTermConst < 0.5)) return false; // 0.4603
      if (!(g4.maxGroup === 8 && g4.perTermConst > 1)) return false; // 1.2274 over-charge
      if (!(g5.maxGroup === 15 && g5.perTermConst > 2)) return false; // 2.3014 over-charge
      // and the threshold is exactly maxGroup < 1/g(2): omega=3 passes (3<3.259), omega=4 fails (8>3.259).
      return g3.maxGroup < INV_G2 && g4.maxGroup > INV_G2;
    },
    why: 'the per-term (triangle-on-groups) bound proves MAGNITUDE iff the largest signed group is < 1/g(2)=3.259; that holds for omega<=3 (max group 3) and fails from omega=4 (max group 8, const 1.227) -- the precise obstruction, forcing the retained Moebius cancellation.',
  },
  {
    id: 'imp97392-primorial-extremal-both-conditions-hold',
    holds: () => {
      // On the extremal primorial family both conditions still hold: mu Delta <=0 and |Delta| < b/2, |E1| tiny vs b/4.
      const primes = [2, 3, 5, 7, 11, 13, 17];
      let b = 1;
      for (let k = 1; k <= primes.length; k++) {
        b *= primes[k - 1];
        const D = Delta(b), mu = mobius(b);
        if (!(mu * D <= 0)) return false; // SIGN
        if (!(Math.abs(D) < b / 2)) return false; // MAGNITUDE
        if (!(Math.abs(measureE1(b)) < b / 4)) return false; // the actual ceiling holds with room
      }
      return true;
    },
    why: 'the primorials are the extremal family for MAGNITUDE (|Delta|/(b/2) rising toward ~1/2), yet both conditions hold with room and the ceiling |E1|<b/4 is safe -- the difficulty is a uniform PROOF for omega>=4, not a failure of the conditions.',
  },
  {
    id: 'imp97392-honesty-gate-no-qed',
    holds: () =>
      IMP97392_VERDICT.anyBoundMoved === false &&
      IMP97392_VERDICT.postsRigorousCeiling === false &&
      IMP97392_VERDICT.qed === false &&
      IMP97392_VERDICT.omega3MagnitudeProved === true &&
      IMP97392_VERDICT.omega3SignProved === false &&
      IMP97392_VERDICT.omega4ObstructionPinned === true &&
      IMP97392_VERDICT.uniformCeilingProved === false &&
      /omega-ge-4/.test(IMP97392_SUBGAP.id) &&
      /NO QED/.test(IMP97392_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97392_HONEST_BANNER) &&
      /RH open/.test(IMP97392_HONEST_BANNER),
    why: 'proof / honest partial -- proves omega=3 magnitude, structures omega=3 sign, pins the omega>=4 obstruction; no bound moved, no rigorous full ceiling posted, no QED.',
  },
];

for (const a of IMP97392_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction assertion failed: ${a.id}`,
    );
  }
}

export default {
  kernel: IMP97392_KERNEL,
  results: IMP97392_RESULTS,
  verdict: IMP97392_VERDICT,
  subGap: IMP97392_SUBGAP,
  banner: IMP97392_HONEST_BANNER,
};
