/**
 * Exact continuum repair and arithmetic-block diagnostics for the shifted
 * de Branges kernel.  The algebraic identities are theorem-level.  The
 * floating-point functions are diagnostics only; no browser calculation in
 * this module is an interval certificate or an RH result.
 */

const { PI, exp, log, cos, sin, cosh, sinh, abs } = Math;

export function divisors(n) {
  const out = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d !== 0) continue;
    out.push(d);
    if (d * d !== n) out.push(n / d);
  }
  return out.sort((a, b) => a - b);
}

export function primeFactorization(n) {
  const factors = [];
  let q = n;
  for (let p = 2; p * p <= q; p += p === 2 ? 1 : 2) {
    if (q % p !== 0) continue;
    let k = 0;
    while (q % p === 0) { q /= p; k += 1; }
    factors.push([p, k]);
  }
  if (q > 1) factors.push([q, 1]);
  return factors;
}

// D_N(xi) = sum_{d|N} exp(i xi log(d/sqrt(N))/2).  Divisor pairing makes it real.
export function divisorPhase(N, xi) {
  return divisors(N).reduce(
    (sum, d) => sum + cos(0.5 * xi * log(d / Math.sqrt(N))),
    0,
  );
}

export function divisorProductPhase(N, xi) {
  if (abs(xi) < 1e-10) return divisors(N).length;
  let product = 1;
  for (const [p, k] of primeFactorization(N)) {
    const x = xi * log(p) / 4;
    const den = sin(x);
    if (abs(den) < 1e-10) return divisorPhase(N, xi);
    product *= sin((k + 1) * x) / den;
  }
  return product;
}

// Standard de Bruijn-Newman theta profile term.
export function thetaProfileTerm(n, u) {
  const n2 = n * n;
  return (
    (2 * PI * PI * n2 * n2 * exp(9 * u) - 3 * PI * n2 * exp(5 * u)) *
    exp(-PI * n2 * exp(4 * u))
  );
}

// Exact ridge for phi_n(r+s) phi_m(r-s), with N=nm and
// delta=(1/4)log(n/m).
export function thetaRidgeTerm(n, m, r, s) {
  const N = n * m;
  const delta = 0.25 * log(n / m);
  const c = PI * N * exp(4 * r);
  const q = s + delta;
  return (
    exp(2 * r) * c * c *
    (4 * c * c - 12 * c * cosh(4 * q) + 9) *
    exp(-2 * c * cosh(4 * q))
  );
}

// Original C_a integrand and its exact s<->-s pairing under
// u=r-s, v=r+s. Arguments wb,z are real in this finite identity check.
export function commutatorIntegrand(a, wb, z, u, v) {
  return (
    cosh(a * u) * sinh(a * v) * cos(z * u) * sin(wb * v) -
    sinh(a * u) * cosh(a * v) * sin(z * u) * cos(wb * v)
  );
}

export function pairedCommutatorIntegrand(a, wb, z, r, s) {
  const delta = wb - z;
  const sigma = wb + z;
  return (
    sinh(2 * a * r) * sin(delta * r) * cos(sigma * s) +
    sinh(2 * a * s) * sin(delta * s) * cos(sigma * r)
  );
}

export function finiteGramTailVerdict(lambdaMin, dimension, entrywiseTailBound) {
  const spectralTailBound = dimension * entrywiseTailBound;
  if (lambdaMin - spectralTailBound > 0) {
    return Object.freeze({ status: 'CERTIFIED-POSITIVE-FINITE-GRAM', spectralTailBound });
  }
  if (lambdaMin + spectralTailBound < 0) {
    return Object.freeze({ status: 'CERTIFIED-NEGATIVE-WITNESS', spectralTailBound });
  }
  return Object.freeze({ status: 'INCONCLUSIVE', spectralTailBound });
}

export const SHEAR_KERNEL_REPAIR = Object.freeze({
  id: 'shear-kernel-repair-2026-08-28',
  updatedAt: '2026-08-28',
  grade: 'EXACT-IDENTITIES + NON-CERTIFIED-DIAGNOSTIC',
  claimComplete: false,
  rhSolved: false,
  exactKernel: Object.freeze({
    normalization: 'Xi(z)=int_0^inf psi(u) cos(zu) du; E_a(z)=Xi(z+ia)',
    coordinates: 'r=(u+v)/2, s=(v-u)/2, M(r,s)=psi(r-s)psi(r+s)',
    formula:
      'K_a(w,z)=(2/pi) int_{r>=0} int_0^r M(r,s)[' +
      'sinh(2ar) sin((wb-z)r)/(wb-z) cos((wb+z)s) + ' +
      'sinh(2as) sin((wb-z)s)/(wb-z) cos((wb+z)r)] ds dr',
  }),
  measureAudit: Object.freeze({
    theorem: 'The set u=v has two-dimensional Lebesgue measure zero.',
    consequence:
      'The non-zero 1D positive expression obtained from C_a(u,u) is a comparison kernel, ' +
      'not a literal summand of the original double integral.',
    repair:
      'Use the exact paired r,s formula. If a positive core is useful, insert it by an explicit add-subtract identity and bound the complete remainder.',
  }),
  rawShearAudit: Object.freeze({
    identity: 'Phi(u)Phi(v)sinh(a(v-u))=p(u)q(v)-q(u)p(v)',
    rank: 'at most 2',
    inertia: 'i times the raw shear has eigenvalues +mu and -mu unless mu=0',
    conclusion: 'Raw shear magnitude is diagnostic; raw shear positivity is impossible except in the zero case.',
  }),
  arithmeticBlocks: Object.freeze({
    source: 'Jacobi-theta/de Bruijn profile, not literally the Euler prime-power ladder',
    grouping: 'Group ordered pairs (n,m) by N=nm.',
    phase:
      'D_N(xi)=N^(-i xi/4) sigma_(i xi/2)(N)=product_{p^k||N} sin((k+1)xi log p/4)/sin(xi log p/4)',
    noTermwisePositivity:
      'D_p(xi)=2cos(xi log p/4) changes sign. The N=1 diagonal kernel block also changes sign at large frequency.',
    survivingMechanism:
      'Only grouped cross-N cancellations that restore theta modular identities can support positivity.',
  }),
  finiteCertificate: Object.freeze({
    target:
      'For a truncated exact Gram G_M and entrywise tail epsilon_M, use Weyl: ' +
      'lambda_min(G_M)-J epsilon_M>0 certifies that one finite Gram.',
    limitation:
      'A finite collection of certified Grams is not RH. RH requires all finite node sets and every a>0.',
    intervalBackend: 'OPEN: Arb/ball quadrature plus an analytic incomplete-gamma theta tail.',
  }),
});

export const SHEAR_KERNEL_REPAIR_ASSERTIONS = [
  {
    id: 'paired-commutator-identity',
    holds: () => [
      [0.7, 2.1, 0.4, 1.3, 0.3],
      [1.1, 0.3, 1.9, 1.4, 0.6],
      [0.5, 1.4, 0.7, 2.0, 0.1],
    ].every(([a, wb, z, r, s]) => {
      const lhs = commutatorIntegrand(a, wb, z, r - s, r + s) +
        commutatorIntegrand(a, wb, z, r + s, r - s);
      return abs(lhs - pairedCommutatorIntegrand(a, wb, z, r, s)) < 1e-10;
    }),
  },
  {
    id: 'theta-ridge-identity',
    holds: () => [
      [1, 1, 0.02, 0.01],
      [1, 2, 0.08, 0.03],
      [2, 3, 0.12, -0.04],
    ].every(([n, m, r, s]) => {
      const lhs = thetaProfileTerm(n, r + s) * thetaProfileTerm(m, r - s);
      const rhs = thetaRidgeTerm(n, m, r, s);
      return abs(lhs - rhs) <= 2e-10 * Math.max(1, abs(lhs), abs(rhs));
    }),
  },
  {
    id: 'divisor-phase-factorization',
    holds: () => [6, 12, 30, 72].every((N) => [0.7, 2.3, 5.1].every((xi) =>
      abs(divisorPhase(N, xi) - divisorProductPhase(N, xi)) < 1e-10)),
  },
  {
    id: 'finite-tail-verdict-three-way',
    holds: () =>
      finiteGramTailVerdict(0.2, 4, 0.01).status === 'CERTIFIED-POSITIVE-FINITE-GRAM' &&
      finiteGramTailVerdict(-0.2, 4, 0.01).status === 'CERTIFIED-NEGATIVE-WITNESS' &&
      finiteGramTailVerdict(0.02, 4, 0.01).status === 'INCONCLUSIVE',
  },
  {
    id: 'honesty-claim-open',
    holds: () => SHEAR_KERNEL_REPAIR.claimComplete === false && SHEAR_KERNEL_REPAIR.rhSolved === false,
  },
];

for (const assertion of SHEAR_KERNEL_REPAIR_ASSERTIONS) {
  if (!assertion.holds()) throw new Error(`shear-kernel-repair assertion failed: ${assertion.id}`);
}
