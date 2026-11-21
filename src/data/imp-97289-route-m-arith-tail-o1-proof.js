/**
 * @module imp-97289-route-m-arith-tail-o1-proof
 *
 * imp-97289 (proof, HONEST PARTIAL -- certifies the tail half of IMP97202_SUBGAP on two of the three
 * omega-class families, and reduces the binding third to a single named cancellation inequality):
 * attack the imp-97266-measured claim that the Stirling tail
 *     R(b) = Sum_{d|b, d<b} mu(d) rho_{b/d - 1},      0 < rho_n < 1/(12 n),
 * is O(1) (bounded by L ~ 0.127) via the Moebius-sign cancellation. imp-97266 MEASURED the O(1)
 * behaviour but did not certify the mechanism; imp-97218 named this as one of the two open halves of
 * IMP97202_SUBGAP. This module supplies the exact positive-kernel mechanism, PROVES a uniform O(1)
 * (indeed o(1)) bound on the prime and prime-power families, shows the naive triangle bound reproduces
 * exactly the proved O(log log b) envelope of imp-97202, and isolates what remains.
 *
 * -------------------------------------------------------------------------------
 * MECHANISM (exact, rigorous). The Binet positive-kernel integral representation.
 * -------------------------------------------------------------------------------
 * Robbins rho_n is exactly the Binet function J(n): from log Gamma(z) = (z - 1/2) log z - z +
 * (1/2) log 2pi + J(z) and log(n!) = log n + log Gamma(n) one gets
 *     rho_n = log(n!) - (n log n - n + (1/2) log(2 pi n)) = J(n),
 * and Binet first formula gives, for n >= 1,
 *     rho_n = J(n) = Integral_0^infinity g(t) e^{-n t} dt,   g(t) = ( 1/2 - 1/t + 1/(e^t - 1) ) / t.
 * The kernel is POSITIVE: 1/(e^t - 1) - 1/t + 1/2 = 2 t Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2), so
 *     g(t) = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0     for all t > 0,
 * with g(0+) = 2 Sum 1/(4 pi^2 k^2) = 1/12 and g(t) ~ 1/(2 t) as t -> infinity. Swapping the finite
 * divisor sum with the integral (legitimate, finite sum) gives the EXACT representation
 *     R(b) = Integral_0^infinity g(t) S_b(t) dt,
 *     S_b(t) = Sum_{d|b, d<b, d squarefree} mu(d) e^{-(b/d - 1) t}.
 * Every surviving argument obeys b/d - 1 >= p_min - 1 >= 1, so each term is a genuine Binet value; the
 * ENTIRE cancellation asserted by imp-97266 lives in the alternating Moebius sum S_b(t). Its endpoint
 * values are bounded independently of b:
 *     S_b(0+) = Sum_{d|b, d<b, sqfree} mu(d) = -(b squarefree ? mu(b) : 0)  in {-1, 0, +1},
 * (since Sum_{d|b, sqfree} mu(d) = Prod_{p|b}(1 - 1) = 0 for b >= 2), and S_b(t) -> 0 as t -> infinity.
 * So R(b) is a Binet-kernel-weighted integral of a bounded alternating sum that starts and ends O(1).
 *
 * -------------------------------------------------------------------------------
 * PROVED: uniform O(1) (in fact o(1)) on the prime and prime-power families.
 * -------------------------------------------------------------------------------
 * Using only 0 < rho_n = J(n) < 1/(12 n) and that J is strictly DECREASING (its density g is positive):
 *   PRIMES b = p:   only d = 1 survives (d = p = b is excluded), so
 *       R(p) = rho_{p-1} = J(p-1),   hence   0 < R(p) < 1/(12(p-1)) <= 1/12.
 *   PRIME POWERS b = p^a, a >= 2:  only the two squarefree divisors d = 1, p survive, so
 *       R(p^a) = J(p^a - 1) - J(p^{a-1} - 1) < 0   (J decreasing),   and
 *       |R(p^a)| = J(p^{a-1} - 1) - J(p^a - 1) < J(p^{a-1} - 1) < 1/(12(p^{a-1} - 1)) <= 1/12.
 * Hence for EVERY prime power b (primes included) the tail obeys the uniform bound
 *     |R(b)| < 1/12 = 0.083333...,     and     R(b) -> 0     as b -> infinity along these families.
 * This is a rigorous uniform O(1) bound -- decisively NOT O(log log b) -- on these two families, and it
 * matches the imp-97266 measurement (the tail VANISHES like 1/(12 b) on primes and prime powers).
 *
 * -------------------------------------------------------------------------------
 * REDUCTION: the naive triangle bound reproduces exactly the imp-97202 O(log log b) envelope.
 * -------------------------------------------------------------------------------
 * Bounding |S_b(t)| by the triangle inequality (discarding the Moebius signs) and using g > 0:
 *     |R(b)| <= Integral_0^infinity g(t) Sum_{d<b, sqfree} e^{-(b/d-1)t} dt
 *            =  Sum_{d|b, d<b, sqfree} J(b/d - 1)  <  Sum_{d|b, d<b} 1/(12(b/d - 1)).
 * With b/d - 1 >= (b/d)/2 for b/d >= 2 this is < Sum_{d|b} d/(6 b) = sigma(b)/(6 b), i.e.
 *     |R(b)| < (1/6) sigma(b)/b < (1/6)(e^gamma log log b + O(1))     (Robin, unconditional),
 * exactly the proved O(log log b) envelope of imp-97202. So the entire gap between the PROVED
 * O(log log b) and the MEASURED O(1) is the alternating-sign cancellation in S_b(t) that the triangle
 * step throws away -- the divisor-count factor 2^omega(b) enters ONLY through discarding those signs.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap; the binding maximal-omega primorial class stays uncertified).
 * -------------------------------------------------------------------------------
 * For FIXED omega the tail is a bounded alternating sum, so O(1) is trivial per class; the difficulty is
 * UNIFORMITY as omega -> infinity along the primorials b = 2*3*5*...*p_k (the imp-97266 binding class,
 * where sigma(b)/b diverges but |R| stays ~ 0.127). The uniform O(1) bound on that class is EXACTLY
 *     IMP97289_TAIL_O1_SUBGAP:   sup_b | Integral_0^infinity g(t) S_b(t) dt | <= L   (measured L ~ 0.127),
 * i.e. a uniform-in-omega bound on the Binet-weighted alternating Moebius sum. This is left OPEN here:
 * the positive kernel g and the endpoint control S_b(0+), S_b(infinity) = O(1) are established, but the
 * cancellation of S_b(t) on the interior 0 < t < infinity is not bounded uniformly in omega. No bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97266-route-m-arith-tail-o1-measurement.js (the measurement this partially certifies)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (the O(log log b) envelope reproduced here)
 * @see imp-97218-route-m-first-moment-two-open-halves-banner.js (IMP97202_SUBGAP two open halves)
 *
 * Ticket: imp-97289 (proof, opus-4-8, api-pool). Honest partial: proved O(1) on primes+prime powers,
 * reduced the binding primorial class to IMP97289_TAIL_O1_SUBGAP. NO bound moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7); Stirling remainder series for large n. Both cancellation-free at their range. --
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];
function lgamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = LANCZOS[0];
  for (let i = 1; i < 9; i++) x += LANCZOS[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * LOG2PI + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
// rho_n = J(n) = log(n!) - (n log n - n + (1/2) log(2 pi n)),  n >= 1.  0 < rho_n < 1/(12 n).
function rho(n) {
  if (n <= 64) return lgamma(n + 1) - (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n));
  const n2 = n * n;
  return 1 / (12 * n) - 1 / (360 * n * n2) + 1 / (1260 * n * n2 * n2) - 1 / (1680 * n * n2 * n2 * n2);
}

// -- the Binet positive kernel g(t) = (1/2 - 1/t + 1/(e^t - 1))/t, cancellation-free near t=0 via series. --
function gKernel(t) {
  if (t < 0.125) {
    // g(t) = 1/12 - t^2/720 + t^4/30240 - t^6/1209600 + ... (from psi(t) = t/12 - t^3/720 + ...)
    const t2 = t * t;
    return 1 / 12 - t2 / 720 + (t2 * t2) / 30240 - (t2 * t2 * t2) / 1209600;
  }
  const psi = 1 / (Math.exp(t) - 1) - 1 / t + 0.5;
  return psi / t;
}
// Integral_0^infinity g(t) e^{-n t} dt via composite Simpson (g smooth, e^{-nt} tames the 1/(2t) tail).
function binetIntegral(n) {
  const T = 60 / Math.max(n, 1) + 40; // enough decay for n >= 1
  const M = 20000; // even
  const h = T / M;
  let s = gKernel(1e-12) * 1 + gKernel(T) * Math.exp(-n * T);
  for (let i = 1; i < M; i++) {
    const t = i * h;
    s += (i % 2 === 1 ? 4 : 2) * gKernel(t) * Math.exp(-n * t);
  }
  return (h / 3) * s;
}

// -- self-contained arithmetic (mirrors imp-97266) --
function factorize(b) {
  let n = b;
  const f = [];
  for (let p = 2; p * p <= n; p++) if (n % p === 0) { let a = 0; while (n % p === 0) { n /= p; a += 1; } f.push([p, a]); }
  if (n > 1) f.push([n, 1]);
  return f;
}
function mobius(d) { if (d === 1) return 1; const f = factorize(d); for (const pa of f) if (pa[1] >= 2) return 0; return f.length % 2 === 0 ? 1 : -1; }
// Squarefree proper divisors d<b with mu(d); non-squarefree divisors have mu=0 and are skipped.
function properDivisorsMu(f, b) {
  let divs = [{ d: 1, mu: 1 }];
  for (const pa of f) {
    const p = pa[0];
    const next = [];
    for (const it of divs) { next.push({ d: it.d, mu: it.mu }); next.push({ d: it.d * p, mu: -it.mu }); }
    divs = next;
  }
  return divs.filter((x) => x.d < b);
}
function sigmaOverB(f) { let s = 1; for (const pa of f) s *= (Math.pow(pa[0], pa[1] + 1) - 1) / ((pa[0] - 1) * Math.pow(pa[0], pa[1])); return s; }
function tailR(f, b) { let R = 0; for (const it of properDivisorsMu(f, b)) R += it.mu * rho(b / it.d - 1); return R; }
// The naive triangle bound Sum J(b/d-1) that reproduces the imp-97202 sigma/6b envelope (no cancellation).
function triangleBound(f, b) { let T = 0; for (const it of properDivisorsMu(f, b)) T += rho(b / it.d - 1); return T; }

// -- ladders: primes, prime powers, primorials (the imp-97266 binding class) --
function nextPrime(n) { let m = n + 1; for (;;) { let ok = true; for (let p = 2; p * p <= m; p += 1) if (m % p === 0) { ok = false; break; } if (ok) return m; m += 1; } }
const PRIME_TARGETS = [1e2, 1e3, 1e4, 1e5, 1e6];
const primesLadder = PRIME_TARGETS.map((t) => { const b = nextPrime(t); const f = factorize(b); return { b, R: tailR(f, b), provedBound: 1 / (12 * (b - 1)) }; });
const primePowerLadder = [4, 8, 9, 16, 27, 32, 64, 128, 256, 1024, 4096, 6561, 65536].map((b) => {
  const f = factorize(b); const p = f[0][0]; const a = f[0][1]; return { b, R: tailR(f, b), provedBound: 1 / (12 * (Math.pow(p, a - 1) - 1 || 1)) };
});
const FIRST_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
const primorialLadder = [];
{
  let b = 1; const f = [];
  for (const p of FIRST_PRIMES) { b *= p; f.push([p, 1]); const ff = f.slice(); primorialLadder.push({ b, omega: ff.length, R: tailR(ff, b), absR: Math.abs(tailR(ff, b)), sigmaOver6b: sigmaOverB(ff) / 6, triangle: triangleBound(ff, b) }); }
}

export const IMP97289_BINET_KERNEL = Object.freeze({
  rhoIsBinet: 'rho_n = J(n), log Gamma(z) = (z-1/2)log z - z + (1/2)log 2pi + J(z)',
  representation: 'rho_n = Integral_0^inf g(t) e^{-n t} dt,  g(t) = (1/2 - 1/t + 1/(e^t-1))/t',
  kernelPositive: 'g(t) = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0,  g(0+) = 1/12,  g(t) ~ 1/(2t)',
  tailRepresentation: 'R(b) = Integral_0^inf g(t) S_b(t) dt,  S_b(t) = Sum_{d|b,d<b,sqfree} mu(d) e^{-(b/d-1)t}',
  endpoints: 'S_b(0+) in {-1,0,+1} (= -mu(b) if b squarefree, else 0);  S_b(t) -> 0 as t -> inf',
});

export const IMP97289_PROVED = Object.freeze({
  primes: '0 < R(p) = J(p-1) < 1/(12(p-1)) <= 1/12',
  primePowers: '|R(p^a)| = J(p^{a-1}-1) - J(p^a-1) < J(p^{a-1}-1) < 1/(12(p^{a-1}-1)) <= 1/12',
  uniformBound: 1 / 12, // |R(b)| < 1/12 for every prime power b (primes included)
  behaviour: 'uniform O(1); in fact o(1): R(b) -> 0 along primes and prime powers',
  usesOnly: '0 < rho_n = J(n) < 1/(12 n) and J strictly decreasing (g > 0)',
});

export const IMP97289_REDUCTION = Object.freeze({
  triangleStep: '|R(b)| <= Sum_{d<b,sqfree} J(b/d-1) < Sum_{d|b,d<b} 1/(12(b/d-1)) < sigma(b)/(6 b)',
  reproducesEnvelope: 'this is exactly the imp-97202 |R| < (1/6) sigma(b)/b = O(log log b) (Robin)',
  gapIsCancellation: 'the whole O(log log b) -> O(1) gap is the alternating Moebius cancellation in S_b(t) discarded by the triangle step; the 2^omega factor enters ONLY there',
});

export const IMP97289_TAIL_O1_SUBGAP = Object.freeze({
  name: 'IMP97289_TAIL_O1_SUBGAP',
  statement: 'sup_b | Integral_0^inf g(t) S_b(t) dt | <= L, uniformly in omega(b) (binding: primorials)',
  measuredL: 0.127,
  established: 'positive kernel g; endpoint control S_b(0+), S_b(inf) = O(1); primes + prime powers proved < 1/12',
  open: 'uniform-in-omega bound on the interior cancellation of S_b(t) on the primorial class',
  certifiesHalfOf: 'IMP97202_SUBGAP (tail half named by imp-97218)',
});

export const IMP97289_VERDICT = Object.freeze({
  question: 'prove R(b) = Sum_{d|b,d<b} mu(d) rho_{b/d-1} is O(1) (~ 0.127) via the Moebius-sign cancellation',
  binetMechanismExact: true,        // R = Integral g S_b with g > 0 -- rigorous
  provedPrimeUniform: true,         // |R(p)| < 1/12
  provedPrimePowerUniform: true,    // |R(p^a)| < 1/12
  provedUniformBound: 1 / 12,       // on primes + prime powers
  triangleReproducesLogLogB: true,  // |R| < sigma/6b = imp-97202 envelope
  gapIsMoebiusCancellation: true,
  provesFullO1Bound: false,         // the binding primorial class remains uncertified
  residualSubgap: 'IMP97289_TAIL_O1_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL closing the tail half of IMP97202_SUBGAP on two of three omega-class families. The ' +
    'Binet positive-kernel representation R(b) = Integral g(t) S_b(t) dt is exact (g > 0, endpoints O(1)); ' +
    'from 0 < rho_n < 1/(12 n) and J decreasing the tail obeys the UNIFORM bound |R(b)| < 1/12 on every ' +
    'prime and prime power (in fact R -> 0 there), a rigorous O(1) matching the imp-97266 measurement. The ' +
    'naive triangle bound reproduces exactly the imp-97202 |R| < (1/6) sigma(b)/b = O(log log b) envelope, ' +
    'so the entire O(log log b) -> O(1) gap is the alternating Moebius cancellation in S_b(t). The binding ' +
    'maximal-omega primorial class (where sigma/b diverges but |R| ~ 0.127) remains uncertified: the ' +
    'uniform-in-omega interior cancellation of S_b(t) is IMP97289_TAIL_O1_SUBGAP. No bound on Lambda ' +
    'moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97289_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97266 Stirling tail R(b) is ' +
  'PROVED O(1) -- in fact |R(b)| < 1/12 uniformly and R -> 0 -- on every prime and prime power, via the ' +
  'Binet positive-kernel representation R = Integral g(t) S_b(t) dt (g > 0). The triangle bound reproduces ' +
  'exactly the imp-97202 O(log log b) envelope, so the residual is purely the Moebius cancellation in ' +
  'S_b(t); the binding primorial class stays uncertified as IMP97289_TAIL_O1_SUBGAP. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97289_ASSERTIONS = [
  {
    id: 'imp97289-binet-integral-matches-rho',
    holds: () => {
      for (const n of [1, 2, 3, 5, 10, 20]) {
        if (Math.abs(binetIntegral(n) - rho(n)) > 1e-4) return false;
      }
      return true;
    },
    why: 'the positive-kernel Binet integral Integral_0^inf g(t) e^{-nt} dt reproduces rho_n = J(n) to < 1e-4 for n = 1..20, confirming the exact representation R(b) = Integral g(t) S_b(t) dt with g > 0.',
  },
  {
    id: 'imp97289-kernel-positive',
    holds: () => {
      for (let i = 0; i <= 200; i++) { const t = 0.001 + i * 0.3; if (!(gKernel(t) > 0)) return false; }
      return Math.abs(gKernel(1e-9) - 1 / 12) < 1e-6;
    },
    why: 'g(t) = 2 Sum 1/(t^2 + 4 pi^2 k^2) > 0 on a wide t-grid and g(0+) = 1/12 -- the Binet kernel is positive, so ALL cancellation in R(b) lives in the alternating Moebius sum S_b(t).',
  },
  {
    id: 'imp97289-proved-prime-bound-under-one-twelfth',
    holds: () => primesLadder.every((r) => Math.abs(r.R) < 1 / 12 && Math.abs(r.R) < r.provedBound + 1e-15 && r.R > 0),
    why: 'on primes R(p) = J(p-1) is positive and < 1/(12(p-1)) <= 1/12 -- the proved uniform O(1) (in fact o(1)) bound holds numerically on the prime ladder.',
  },
  {
    id: 'imp97289-proved-prime-power-bound-under-one-twelfth',
    holds: () => primePowerLadder.every((r) => Math.abs(r.R) < 1 / 12 && Math.abs(r.R) < r.provedBound + 1e-12),
    why: 'on prime powers |R(p^a)| = J(p^{a-1}-1) - J(p^a-1) < J(p^{a-1}-1) < 1/(12(p^{a-1}-1)) <= 1/12 -- the proved uniform bound holds numerically on the prime-power ladder.',
  },
  {
    id: 'imp97289-triangle-reproduces-sigma-over-6b',
    holds: () => {
      for (const r of primorialLadder) {
        if (!(Math.abs(r.R) <= r.triangle + 1e-12)) return false;        // |R| <= triangle bound
        if (!(r.triangle <= r.sigmaOver6b + 1e-9)) return false;         // triangle <= sigma/6b
      }
      return true;
    },
    why: 'the triangle bound Sum J(b/d-1) dominates |R(b)| and is itself < sigma(b)/(6b) -- reproducing exactly the imp-97202 O(log log b) envelope; the gap to the measured O(1) is the discarded Moebius cancellation.',
  },
  {
    id: 'imp97289-envelope-loose-on-primorials',
    holds: () => {
      const q = primorialLadder;
      for (const r of q) if (!(r.absR < 0.13)) return false;                          // measured O(1)
      for (let i = 1; i < q.length; i += 1) if (!(q[i].sigmaOver6b > q[i - 1].sigmaOver6b)) return false; // envelope diverges
      const ratioFirst = q[1].absR / q[1].sigmaOver6b;
      const ratioLast = q[q.length - 1].absR / q[q.length - 1].sigmaOver6b;
      return ratioLast < ratioFirst; // proved envelope strictly loosens as omega grows
    },
    why: 'on the binding primorial class |R| < 0.13 (measured O(1)) while the proved sigma/6b envelope diverges, so |R|/(sigma/6b) strictly decreases -- the uniform-in-omega bound on this class is the open IMP97289_TAIL_O1_SUBGAP.',
  },
  {
    id: 'imp97289-honesty-gate-no-qed',
    holds: () =>
      IMP97289_VERDICT.anyBoundMoved === false &&
      IMP97289_VERDICT.postsRigorousCeiling === false &&
      IMP97289_VERDICT.qed === false &&
      IMP97289_VERDICT.provesFullO1Bound === false &&
      IMP97289_VERDICT.binetMechanismExact === true &&
      IMP97289_VERDICT.provedPrimeUniform === true &&
      IMP97289_VERDICT.provedPrimePowerUniform === true &&
      IMP97289_VERDICT.residualSubgap === 'IMP97289_TAIL_O1_SUBGAP' &&
      /IMP97202_SUBGAP/.test(IMP97289_TAIL_O1_SUBGAP.certifiesHalfOf) &&
      /NO QED/.test(IMP97289_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97289_HONEST_BANNER) &&
      /RH open/.test(IMP97289_HONEST_BANNER),
    why: 'honest partial: proved uniform O(1) on primes + prime powers and reduced the binding primorial class to IMP97289_TAIL_O1_SUBGAP -- no full O(1) bound, no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97289_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97289-route-m-arith-tail-o1-proof assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97289_BINET_KERNEL,
  proved: IMP97289_PROVED,
  reduction: IMP97289_REDUCTION,
  subgap: IMP97289_TAIL_O1_SUBGAP,
  verdict: IMP97289_VERDICT,
  banner: IMP97289_HONEST_BANNER,
};
