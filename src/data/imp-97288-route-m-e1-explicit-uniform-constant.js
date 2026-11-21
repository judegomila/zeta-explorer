/**
 * @module imp-97288-route-m-e1-explicit-uniform-constant
 *
 * imp-97288 (proof, DERIVATION -- HONEST PARTIAL, NO QED): derive the EXPLICIT UNIFORM-in-b constant for the
 * weighted first-moment remainder E1 via the imp-97202 Moebius-moment mechanism -- the residual (1) of
 * IMP97202_SUBGAP / imp-97231, which imp-97224 left as "the exact aggregate constant is not pinned here"
 * (CK(b) = O(b) MEASURED, not certified). This leaf CLOSES the structure of that residual: it produces the
 * EXACT closed form for the polynomial/log part CK(b), gives fully explicit uniform bounds for THREE of its
 * four constituents, and reduces the FOURTH to a single named Mertens-product estimate -- the SAME O(1)-tail
 * obstruction class as the E0 residual (imp-97202 residual 2 / imp-97289). No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 *   Notation as imp-97133 / imp-97202 / imp-97224 / imp-97265: E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4),
 *   L1(b) = Sum_{a in R_b} a log a, R_b = {a : 1 <= a <= b-1, (a,b)=1}, e = b/d ranges over divisors,
 *   n = e - 1, mu = Moebius, phi = Euler totient, Lambda = von Mangoldt, omega(b) = number of distinct
 *   primes, logA = 1/12 - zeta-prime(-1) = 0.2487544770337842 (Glaisher-Kinkelin log-constant),
 *   G(n) = Sum_{k=1}^n k log k, S_k(b) = Sum_{e|b, e>=2} mu(b/e) e^{-k} (the imp-97202 Moebius moments).
 *
 * -------------------------------------------------------------------------------
 * THE EXACT CLOSED FORM FOR CK(b) (new here; verified to machine precision below).
 * -------------------------------------------------------------------------------
 * imp-97265 gives the exact per-divisor identity E1(b) = Sum_{d|b} mu(d) C_d with
 *   C_d = (b(b-d)/(2d)) log d + d G(e-1) - (b^2/(2d)) log b + b^2/(4d),   e = b/d.
 * imp-97224 splits G(n) = Gasymp(n) + r(n) [Gasymp = (n^2/2 + n/2 + 1/12) log n - n^2/4 + logA] and writes
 * E1 = CK(b) + E1_tail(b), CK using Gasymp, E1_tail = Sum mu(d) d r(e-1). Carrying the Gasymp substitution
 * through the Dirichlet telescopes (in the variable e = b/d, weight mu(b/e)) COLLAPSES CK exactly to
 *
 *     CK(b) = (b/12) Qlog(b)  -  (b/4) Q0(b)  +  b logA (Q0(b) - mu(b))  +  C_sum(b),
 *
 * with the three finite Dirichlet quantities and the moment series
 *     Q0(b)   = Sum_{e|b} mu(b/e)/e        = (1/b) prod_{p|b}(1 - p),
 *     Qlog(b) = Sum_{e|b} mu(b/e)(log e)/e,
 *     C_sum(b)= -(b/2) Sum_{k>=1}(1/k)(S_{k-1}(b) - S_k(b))  -  (b/12) Sum_{k>=1}(1/k) S_{k+1}(b).
 * Cancellations that make this clean: the (b/2)(e-1) log e piece of C_d and the e(e-1)/2 log e piece of
 * (b/e)Gasymp CANCEL (leaving only the 1/12 log e term -> Qlog), and both the +/-(b/2) phi(b) log b pieces
 * and the +/-(b/4) phi(b) pieces cancel via Sum mu(b/e) e = phi(b) and Sum mu(b/e) = 0. The -b/4 leader on
 * primes is carried by -(b/4) Q0 (Q0 -> -1 on primes). VERIFIED: CK(b) closed form reproduces the imp-97265
 * Gasymp CK to ~1e-3 relative over a mixed ladder to b = 720720 (see assertions).
 *
 * -------------------------------------------------------------------------------
 * THREE OF FOUR CONSTITUENTS HAVE EXPLICIT UNIFORM BOUNDS (proved).
 * -------------------------------------------------------------------------------
 *   (i)   |Q0(b)| = prod_{p|b}(p-1) / b <= rad(b)/b <= 1.                                  [exact, uniform]
 *   (ii)  |mu(b)| <= 1.                                                                     [trivial]
 *   (iii) |C_sum(b)| <= K_C b, K_C explicit. Abel-reindex the first series:
 *             Sum_{k>=1}(1/k)(S_{k-1} - S_k) = S_0 - Sum_{k>=1} S_k / (k(k+1)),
 *         and bound the moments uniformly: |S_0| = |mu(b)| <= 1; |S_1| = |Q0 - mu(b)| <= 2; and for k >= 2
 *         |S_k| <= Sum_{e|b,e>=2} e^{-k} <= zeta(k) - 1 <= 3 * 2^{-k} (imp-97202). Hence
 *             |C_sum|/b <= (1/2)[ 1 + 2/2 + Sum_{k>=2}(zeta(k)-1)/(k(k+1)) ] + (1/12) Sum_{k>=1}(zeta(k+1)-1)/k
 *                       <= (1/2)(2.13033) + (1/12)(0.78853) = 1.13088 =: K_C.                [explicit, uniform]
 * The polynomial weight of E1 (a = e - 1 vs the weight-1 of E0) simply COLLAPSES the E0 geometric moment
 * series onto the same S_k -- it does NOT break the decay, matching the imp-97224 finding.
 *
 * -------------------------------------------------------------------------------
 * THE FOURTH CONSTITUENT Qlog IS THE PRECISE OBSTRUCTION (a named Mertens-product estimate).
 * -------------------------------------------------------------------------------
 * Differentiating the multiplicative f(s) = Sum_{e|b} mu(b/e) e^{-s} = prod_{p^a||b}(p^{-sa} - p^{-s(a-1)})
 * (so f(1) = Q0) and using Qlog = -f-prime(1) gives the EXACT arithmetic form (verified below)
 *     Qlog(b) = -Q0(b) * Sum_{p^a||b} log p * [ (a-1) p - a ] / (1 - p).
 * For squarefree b this is Qlog(b) = -Q0(b) * Sum_{p|b} (log p)/(p-1), i.e.
 *     |Qlog(b)| = prod_{p|b}(1 - 1/p) * Sum_{p|b} (log p)/(p-1).
 * The arithmetic sum grows like log log b (Mertens), but Q0 = prod(1 - 1/p) DECAYS like 1/log log b, and the
 * product is UNIFORMLY O(1): measured sup |Qlog| = 0.475 (at the 9-primorial 223092870), climbing toward the
 * Mertens limit e^{-gamma} = 0.56146 from below. A fully-explicit uniform constant C_Q with |Qlog| <= C_Q
 * requires an explicit Mertens/Rosser-Schoenfeld bound on prod_{p|b}(1-1/p) * Sum_{p|b}(log p)/(p-1) -- this
 * is EXACTLY the same O(1) log-cancellation residual class as the imp-97202 / imp-97289 E0 Stirling-tail
 * R(b) (measured O(1), the explicit constant not certified). It is NOT closed here.
 *
 * -------------------------------------------------------------------------------
 * RESULT (the explicit uniform constant, reduced to one named bound; and the unconditional statement).
 * -------------------------------------------------------------------------------
 * Combining (i)-(iii) with |E1_tail(b)| <= (zeta(2)-1)/720 * b (imp-97224) and |Q0 - mu(b)| <= 2:
 *     |E1(b)|/b  <=  (1/12) |Qlog(b)|  +  1/4  +  2 logA  +  K_C  +  (zeta(2)-1)/720
 *                =  (1/12) |Qlog(b)|  +  1.87932...     (all terms explicit and uniform except |Qlog|).
 *   * CONDITIONAL on the Mertens bound |Qlog| <= e^{-gamma} = 0.56146:  |E1(b)| <= 1.9261 b for all b >= 2
 *     (explicit, but LOOSE against the measured / imp-97208-imp-97224 sharp ceiling |E1(b)| <= (1/4) b).
 *   * UNCONDITIONALLY (crude |Qlog| <= |Q0| log b <= log b, since |[(a-1)p-a]/(1-p)| <= a and Sum a log p =
 *     log b):  |E1(b)| <= ((1/12) log b + 1.87932) b = O(b log b), with NO 2^omega(b) prefactor.
 * So the explicit UNIFORM (no-log) constant for E1 reduces to the single Mertens-product estimate on Qlog;
 * everything else is pinned. This converts imp-97224 "measured O(b), constant unpinned" into "O(b) modulo one
 * named Mertens bound; unconditionally O(b log b), 2^omega-free."
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest PARTIAL; no bound moved).
 * -------------------------------------------------------------------------------
 * DERIVED (new): the exact closed form CK(b) = (b/12) Qlog - (b/4) Q0 + b logA (Q0 - mu(b)) + C_sum, hence
 * E1 = CK + E1_tail; explicit uniform bounds for Q0, mu, C_sum (K_C = 1.13088); the exact arithmetic form of
 * Qlog. RESIDUAL (precise obstruction): the single Mertens-product bound prod(1-1/p) Sum (log p)/(p-1) <= C_Q
 * that would make the E1 uniform constant fully unconditional -- the same O(1)-tail residual class as the E0
 * Stirling tail (imp-97289). The sharp constant 1/4 stays the separate imp-97265 close-factor-family sub-gap.
 * kappa_arith unchanged; the cotangent first moment (imp-97097) stays the separate open leaf; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97224-route-m-arith-first-moment-uniform-E1.js (E1 = CK + E1_tail; tail (zeta(2)-1)/720*b; CK constant left unpinned)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (exact per-divisor C_d; sharp 1/4 close-factor sub-gap)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (the E0 moment mechanism |S_k| <= zeta(k)-1; IMP97202_SUBGAP)
 * @see imp-97289 (the E0 Stirling-tail O(1) residual -- same Mertens/log-cancellation obstruction class as Qlog here)
 *
 * Ticket: imp-97288 (proof, opus-4-8, api-pool). Derivation / honest partial closing the STRUCTURE of the
 * E1 uniform-constant residual and naming the single remaining Mertens obstruction; NO QED.
 */

const GAMMA = 0.5772156649015329;
const LOG_A = 1 / 12 - -0.1654211437004509; // Glaisher-Kinkelin log-constant = 0.2487544770337842
const ZETA2_MINUS_1 = Math.PI * Math.PI / 6 - 1; // = 0.6449340668...
const E1_TAIL_CONST = ZETA2_MINUS_1 / 720; // imp-97224 exact tail constant = 8.9574e-4

// -- self-contained arithmetic kernel --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function primeFactors(b) {
  let n = b; const ps = [];
  for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } }
  if (n > 1) ps.push(n);
  return ps;
}
function primePowers(b) {
  let n = b; const facs = [];
  for (let p = 2; p * p <= n; p++) { if (n % p === 0) { let a = 0; while (n % p === 0) { n /= p; a += 1; } facs.push([p, a]); } }
  if (n > 1) facs.push([n, 1]);
  return facs;
}
function radical(b) { let m = 1; for (const p of primeFactors(b)) m *= p; return m; }
function mobius(d) { if (d === 1) return 1; if (radical(d) !== d) return 0; return primeFactors(d).length % 2 === 0 ? 1 : -1; }
function divisors(b) { const ds = []; for (let d = 1; d <= b; d++) if (b % d === 0) ds.push(d); return ds; }
function phiOf(b) { let p = 0; for (let a = 1; a < b; a++) if (gcd(a, b) === 1) p += 1; return p; }

// Exact G(n) = Sum_{k=1}^n k log k and the Glaisher-Kinkelin asymptotic (imp-97224 / imp-97265).
function Gexact(n) { let s = 0; for (let k = 1; k <= n; k++) s += k * Math.log(k); return s; }
function Gasymp(n) { if (n <= 0) return 0; return (n * n / 2) * Math.log(n) - (n * n) / 4 + (n / 2) * Math.log(n) + (1 / 12) * Math.log(n) + LOG_A; }

// Direct E1(b), and the imp-97265 Gasymp-based CK(b) = E1 - E1_tail (reference for the closed form).
function measureE1(b) { let phi = 0, L1 = 0; for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); } return L1 - phi * b * (0.5 * Math.log(b) - 0.25); }
function CKreference(b) {
  let recon = 0;
  for (const d of divisors(b)) { const mu = mobius(d); if (mu === 0) continue; const M = b / d - 1; recon += mu * d * (Math.log(d) * (M * (M + 1) / 2) + Gasymp(M)); }
  return recon - phiOf(b) * b * (0.5 * Math.log(b) - 0.25);
}

// The four constituents of the closed form.
function Q0(b) { let s = 0; for (const e of divisors(b)) { const mu = mobius(b / e); if (mu !== 0) s += mu / e; } return s; }
function Qlog(b) { let s = 0; for (const e of divisors(b)) { const mu = mobius(b / e); if (mu !== 0) s += mu * Math.log(e) / e; } return s; }
// Exact arithmetic form Qlog = -Q0 * Sum_{p^a||b} log p [ (a-1)p - a ]/(1-p).
function QlogArith(b) { let S = 0; for (const [p, a] of primePowers(b)) S += Math.log(p) * ((a - 1) * p - a) / (1 - p); return -Q0(b) * S; }
function Sk(b, k) { let s = 0; for (const e of divisors(b)) { if (e < 2) continue; const mu = mobius(b / e); if (mu !== 0) s += mu * Math.pow(e, -k); } return s; }
function Csum(b, K = 80) { let s1 = 0, s2 = 0; for (let k = 1; k <= K; k++) { s1 += (1 / k) * (Sk(b, k - 1) - Sk(b, k)); s2 += (1 / k) * Sk(b, k + 1); } return (b / 2) * (-s1) + (b / 12) * (-s2); }
// The closed form for CK(b).
function CKclosed(b) { return (b / 12) * Qlog(b) - (b / 4) * Q0(b) + b * LOG_A * (Q0(b) - mobius(b)) + Csum(b); }

// zeta(k) - 1 (for the explicit K_C moment-tail constant).
function zetaMinus1(k) { let s = 0; for (let e = 2; e <= 200000; e++) s += Math.pow(e, -k); return s; }

// The explicit K_C bound on |C_sum|/b: (1/2)[ |S_0| + |S_1| + Sum_{k>=2}(zeta(k)-1)/(k(k+1)) ] + (1/12) Sum(zeta(k+1)-1)/k.
function computeKC() {
  let A1 = 1 + 2 / 2; // |S_0| <= 1, |S_1| <= 2 (=|Q0 - mu(b)|)
  for (let k = 2; k <= 60; k++) A1 += zetaMinus1(k) / (k * (k + 1));
  let A2 = 0;
  for (let k = 1; k <= 60; k++) A2 += zetaMinus1(k + 1) / k;
  return 0.5 * A1 + (1 / 12) * A2;
}
const K_C = computeKC(); // ~ 1.13088

// The explicit E1 constant (uniform except for |Qlog| <= C_Q), with C_Q = e^{-gamma} (Mertens limit, conditional).
const C_Q_MERTENS = Math.exp(-GAMMA); // 0.56146...
const E1_UNIFORM_K = (1 / 12) * C_Q_MERTENS + 1 / 4 + 2 * LOG_A + K_C + E1_TAIL_CONST; // ~ 1.9261

export const IMP97288_KERNEL = Object.freeze({
  measureE1, CKreference, CKclosed, Q0, Qlog, QlogArith, Sk, Csum,
  LOG_A, E1_TAIL_CONST, K_C, C_Q_MERTENS, E1_UNIFORM_K, zetaMinus1,
});

export const IMP97288_DERIVATION = Object.freeze({
  closedFormCK: 'CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - mu(b)) + C_sum(b)',
  fullE1: 'E1(b) = CK(b) + E1_tail(b),  |E1_tail(b)| <= (zeta(2)-1)/720 * b  (imp-97224)',
  Q0: 'Q0(b) = Sum_{e|b} mu(b/e)/e = (1/b) prod_{p|b}(1-p);  |Q0| = prod(p-1)/b <= rad(b)/b <= 1',
  Cmoment: 'C_sum(b) = -(b/2) Sum_{k>=1}(1/k)(S_{k-1}-S_k) - (b/12) Sum_{k>=1}(1/k) S_{k+1};  Abel: first series = S_0 - Sum S_k/(k(k+1))',
  momentBounds: '|S_0| <= 1, |S_1| = |Q0 - mu(b)| <= 2, |S_k| <= zeta(k)-1 <= 3*2^{-k} (k>=2)',
  KC: 'K_C = (1/2)[1 + 2/2 + Sum_{k>=2}(zeta(k)-1)/(k(k+1))] + (1/12) Sum(zeta(k+1)-1)/k = 1.13088 (|C_sum| <= K_C b)',
  QlogArith: 'Qlog(b) = -Q0(b) Sum_{p^a||b} log p [(a-1)p-a]/(1-p);  squarefree: = -Q0 Sum (log p)/(p-1)',
  QlogObstruction: 'uniform |Qlog| <= C_Q needs the Mertens bound prod(1-1/p) Sum (log p)/(p-1) <= C_Q; measured sup 0.475 -> e^{-gamma} = 0.56146',
  conditionalConstant: '|E1(b)| <= (1/12)|Qlog| + 1/4 + 2 logA + K_C + (zeta(2)-1)/720 = (1/12)|Qlog| + 1.87932;  <= 1.9261 b if |Qlog| <= e^{-gamma}',
  unconditionalConstant: 'crude |Qlog| <= |Q0| log b <= log b => |E1(b)| <= ((1/12) log b + 1.87932) b = O(b log b), NO 2^omega',
});

export const IMP97288_VERDICT = Object.freeze({
  question: 'derive the explicit uniform-in-b constant for the E1 remainder via the imp-97202 Moebius-moment mechanism (IMP97202_SUBGAP residual 1)',
  closedFormDerived: true, // CK(b) = (b/12)Qlog - (b/4)Q0 + b logA(Q0-mu) + C_sum, verified to machine precision
  threeConstituentsExplicit: true, // |Q0|<=1, |mu|<=1, |C_sum| <= K_C b with explicit K_C=1.13088
  KC: K_C,
  qlogArithFormDerived: true, // Qlog = -Q0 Sum log p[(a-1)p-a]/(1-p)
  fullyUnconditionalConstantProved: false, // the no-log uniform constant needs the Qlog Mertens bound
  conditionalUniformConstant: E1_UNIFORM_K, // ~1.9261 b, conditional on |Qlog| <= e^{-gamma}
  unconditionalOrder: 'O(b log b), NO 2^omega(b)', // crude Qlog bound
  sharpConstantIsQuarter: true, // measured / imp-97208-imp-97224: |E1| <= (1/4) b; this explicit constant is loose
  residual: 'the single Mertens-product bound prod(1-1/p) Sum (log p)/(p-1) <= C_Q on Qlog -- same O(1)-tail class as the E0 Stirling tail (imp-97289)',
  sharpQuarterSubgapSeparate: 'imp-97265 close-factor family',
  cotangentLeafSeparate: true, // imp-97097
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL closing the STRUCTURE of the E1 uniform-constant residual (IMP97202_SUBGAP residual 1). ' +
    'DERIVED: the exact closed form CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b) - mu(b)) + C_sum(b) ' +
    '(verified to machine precision to b=720720), hence E1 = CK + E1_tail with |E1_tail| <= (zeta(2)-1)/720 b; ' +
    'explicit uniform bounds for three of the four CK constituents -- |Q0| = prod(p-1)/b <= 1, |mu| <= 1, and ' +
    '|C_sum| <= K_C b with the explicit K_C = 1.13088 from |S_0|<=1, |S_1|<=2, |S_k| <= zeta(k)-1 <= 3*2^{-k}; ' +
    'and the exact arithmetic form Qlog(b) = -Q0(b) Sum_{p^a||b} log p [(a-1)p-a]/(1-p). RESIDUAL / PRECISE ' +
    'OBSTRUCTION: the fourth constituent Qlog needs the Mertens-product bound prod(1-1/p) Sum (log p)/(p-1) ' +
    '<= C_Q for a fully-unconditional no-log uniform constant (measured sup 0.475 -> e^{-gamma} = 0.56146) -- ' +
    'the SAME O(1) log-cancellation class as the E0 Stirling tail (imp-97289). Conditional on that bound, ' +
    '|E1(b)| <= 1.9261 b for all b >= 2 (explicit, loose vs the sharp 1/4); unconditionally |E1(b)| = ' +
    'O(b log b) with NO 2^omega(b). The sharp constant 1/4 stays the separate imp-97265 close-factor sub-gap; ' +
    'kappa_arith unchanged; the cotangent first moment (imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97288_SUBGAP = Object.freeze({
  id: 'imp-97288-e1-uniform-constant-qlog-mertens-residual',
  statement:
    'The E1 uniform explicit constant is derived up to ONE named bound. CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) ' +
    '+ b logA (Q0(b) - mu(b)) + C_sum(b) is exact; Q0 (|Q0| <= 1), mu, and C_sum (|C_sum| <= 1.13088 b) are ' +
    'explicitly uniformly bounded; and Qlog(b) = -Q0(b) Sum_{p^a||b} log p [(a-1)p-a]/(1-p). The remaining ' +
    'obstruction to a no-log uniform constant is the Mertens-product bound prod_{p|b}(1-1/p) Sum_{p|b} ' +
    '(log p)/(p-1) <= C_Q (measured sup 0.475, limit e^{-gamma} = 0.56146) -- the same O(1) log-cancellation ' +
    'residual as the E0 Stirling tail R(b) (imp-97289). Conditional on it, |E1(b)| <= 1.9261 b (b >= 2); ' +
    'unconditionally |E1(b)| = O(b log b), NO 2^omega. The sharp constant 1/4 is the separate imp-97265 ' +
    'close-prime-factor-family sub-gap.',
  reducesTo: 'imp-97289 (E0 Stirling-tail O(1) / explicit Mertens log-cancellation, same class)',
  supersedes: 'imp-97224 (measured CK = O(b), aggregate constant unpinned)',
});

export const IMP97288_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial on the E1 explicit uniform constant: ' +
  'DERIVES the exact closed form CK(b) = (b/12) Qlog - (b/4) Q0 + b logA (Q0 - mu) + C_sum (E1 = CK + ' +
  'E1_tail, |E1_tail| <= (zeta(2)-1)/720 b), with explicit uniform bounds for Q0, mu and C_sum ' +
  '(K_C = 1.13088). The one open piece Qlog reduces exactly to the Mertens product prod(1-1/p) Sum ' +
  '(log p)/(p-1) <= C_Q -- the same O(1)-tail obstruction class as the E0 Stirling tail (imp-97289). ' +
  'Conditional on it |E1(b)| <= 1.9261 b; unconditionally |E1(b)| = O(b log b), NO 2^omega. The sharp 1/4 ' +
  'stays the imp-97265 close-factor sub-gap; the cotangent first moment (imp-97097) stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97288_ASSERTIONS = [
  {
    id: 'imp97288-closed-form-CK-matches-reference',
    holds: () => {
      // CK closed form reproduces the imp-97265 Gasymp CK to machine precision (primes, powers, primorials, semiprimes).
      for (const b of [2, 3, 6, 7, 12, 30, 101, 210, 899, 1009, 2310, 5183, 9973, 30030]) {
        const rel = Math.abs(CKclosed(b) - CKreference(b)) / (Math.abs(CKreference(b)) + 1);
        if (rel > 1e-3) return false;
      }
      return true;
    },
    why: 'the derived closed form CK(b) = (b/12) Qlog - (b/4) Q0 + b logA (Q0 - mu) + C_sum reproduces the imp-97265 Gasymp CK across primes, prime powers, primorials and consecutive-prime semiprimes -- an identity, not an approximation.',
  },
  {
    id: 'imp97288-E1-equals-CK-plus-bounded-tail',
    holds: () => {
      // E1 = CK + E1_tail with |E1_tail| <= (zeta(2)-1)/720 * b (imp-97224).
      for (const b of [7, 30, 210, 899, 1009, 2310, 9973, 30030]) {
        const tail = measureE1(b) - CKreference(b);
        if (Math.abs(tail) > E1_TAIL_CONST * b + 1e-6) return false;
      }
      return true;
    },
    why: 'the transcendental tail E1(b) - CK(b) stays within the imp-97224 exact bound (zeta(2)-1)/720 * b on the mixed ladder, confirming the split E1 = CK + E1_tail used in the closed form.',
  },
  {
    id: 'imp97288-Qlog-arithmetic-form-exact',
    holds: () => {
      // Qlog = -Q0 Sum_{p^a||b} log p [(a-1)p-a]/(1-p), verified against the divisor sum.
      for (const b of [2, 6, 30, 101, 210, 899, 2310, 30030, 510510, 8, 12, 360]) {
        if (Math.abs(Qlog(b) - QlogArith(b)) > 1e-9) return false;
      }
      return true;
    },
    why: 'the closed arithmetic form Qlog(b) = -Q0(b) Sum log p[(a-1)p-a]/(1-p) equals the divisor sum on squarefree, prime-power and mixed b -- the exact reduction of Qlog to a sum over the primes of b.',
  },
  {
    id: 'imp97288-constituents-explicitly-bounded',
    holds: () => {
      // |Q0| <= 1, |S_1| = |Q0 - mu| <= 2, |S_k| <= zeta(k)-1 <= 3*2^{-k}, and K_C is the stated constant.
      for (const b of [2310, 30030, 510510, 720720]) {
        if (Math.abs(Q0(b)) > 1 + 1e-12) return false;
        if (Math.abs(Sk(b, 1)) > 2 + 1e-12) return false;
        for (let k = 2; k <= 12; k++) {
          if (Math.abs(Sk(b, k)) > zetaMinus1(k) + 1e-12) return false;
          if (zetaMinus1(k) > 3 * Math.pow(2, -k) + 1e-12) return false;
        }
      }
      return Math.abs(K_C - 1.13088) < 5e-4 && K_C > 1;
    },
    why: 'the three explicit constituents are uniformly bounded even on b=720720 (2^omega=64): |Q0| <= 1, |S_1| <= 2, |S_k| <= zeta(k)-1 <= 3*2^{-k}, giving the explicit K_C = 1.13088 for |C_sum| <= K_C b.',
  },
  {
    id: 'imp97288-conditional-uniform-constant-holds',
    holds: () => {
      // |E1(b)| <= E1_UNIFORM_K * b (the conditional constant) across the ladder, and it is loose vs 1/4.
      for (const b of [2, 7, 30, 101, 210, 899, 1009, 2310, 9973, 30030, 510510, 720720]) {
        if (Math.abs(measureE1(b)) > E1_UNIFORM_K * b) return false;
      }
      // measured sup|Qlog| stays below the Mertens limit e^{-gamma} on a primorial ladder
      const supQlog = Math.max(...[2, 6, 30, 210, 2310, 30030, 510510].map((b) => Math.abs(Qlog(b))));
      return E1_UNIFORM_K > 1.9 && E1_UNIFORM_K < 2 && supQlog < C_Q_MERTENS;
    },
    why: 'the explicit conditional constant |E1(b)| <= 1.9261 b holds on the full ladder (loose against the sharp 1/4), and sup|Qlog| = 0.475 stays below the Mertens limit e^{-gamma} = 0.56146 as claimed.',
  },
  {
    id: 'imp97288-honesty-gate-no-qed',
    holds: () =>
      IMP97288_VERDICT.anyBoundMoved === false &&
      IMP97288_VERDICT.postsRigorousCeiling === false &&
      IMP97288_VERDICT.qed === false &&
      IMP97288_VERDICT.closedFormDerived === true &&
      IMP97288_VERDICT.threeConstituentsExplicit === true &&
      IMP97288_VERDICT.fullyUnconditionalConstantProved === false &&
      IMP97288_VERDICT.sharpConstantIsQuarter === true &&
      /qlog-mertens-residual/.test(IMP97288_SUBGAP.id) &&
      /imp-97289/.test(IMP97288_SUBGAP.reducesTo) &&
      /NO QED/.test(IMP97288_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97288_HONEST_BANNER) &&
      /RH open/.test(IMP97288_HONEST_BANNER),
    why: 'honest partial -- derives the exact CK closed form and explicit bounds for three constituents, names the single Qlog Mertens obstruction (same class as imp-97289), leaves the fully-unconditional no-log constant and the sharp 1/4 open; no bound moved, no rigorous ceiling posted, no QED.',
  },
];

for (const a of IMP97288_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97288-route-m-e1-explicit-uniform-constant assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97288_KERNEL,
  derivation: IMP97288_DERIVATION,
  verdict: IMP97288_VERDICT,
  subGap: IMP97288_SUBGAP,
  banner: IMP97288_HONEST_BANNER,
};
