/**
 * @fileoverview imp-95539 — numeric verification of the perm-arch Theorem U
 * alias-energy-in-algebra fraction 1/phi(q) across several aliases a | P, with
 * the complementary energy leaking OUTSIDE the sieve algebra tabulated.
 * (2026-09-22, opus-4-8, api-pool.) Import-light: literals only; the genuine
 * numeric projection (build each Ramanujan-sum vector c_q over a full period
 * and project e_a onto S = span{c_q : q|P}) lives in
 * tmp/imp-95539-alias-energy-in-algebra-check.mjs, all rows matching 1/phi(q)
 * to < 1e-9. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * Theorem U (perm-arch-sieve-universality-no-go, line 44): a single alias
 * e_a(n) = e(a n / P) has energy fraction 1/phi(q) INSIDE the sieve algebra S,
 * with q = P/gcd(a,P). Here P = 30030 = 2*3*5*7*11*13 and the inner product is
 * <f,g> = (1/P) sum_n f conj(g), so ||e_a||^2 = 1 and ||c_q||^2 = phi(q). The
 * projection energy sum_{q|P} |<e_a,c_q>|^2 / phi(q) collapses to the single
 * q0 = P/gcd(a,P) term (all other overlaps vanish), giving exactly 1/phi(q0).
 * The remaining 1 - 1/phi(q0) is character content the algebra cannot see.
 */

export const IMP_95539_ALIAS_ENERGY_IN_ALGEBRA = Object.freeze({
  id: 'imp-95539-alias-energy-in-algebra-table',
  date: '2026-09-22',
  route: '/permutation-architecture',
  P: 30030, // 2*3*5*7*11*13
  phiP: 5760,
  claim: 'a single alias e(a n / P) has energy fraction 1/phi(q) inside the sieve algebra S = span{c_q : q|P}, q = P/gcd(a,P); the rest (1 - 1/phi(q)) leaks outside',
  method:
    'genuine numeric projection: c_q built as a length-P vector via the exact '
    + 'Ramanujan closed form, e_a projected onto span{c_q : q|P}; every row '
    + 'matches 1/phi(q) to < 1e-9 (tmp/imp-95539-alias-energy-in-algebra-check.mjs).',

  // Each row: a (alias), g = gcd(a,P), q = P/g, phi(q), inEnergy = 1/phi(q)
  // (verified numerically), leakOutside = 1 - 1/phi(q).
  table: [
    { a: 1, g: 1, q: 30030, phiQ: 5760, inEnergy: 1.736111e-4, leakOutside: 9.998264e-1 },
    { a: 3, g: 3, q: 10010, phiQ: 2880, inEnergy: 3.472222e-4, leakOutside: 9.996528e-1 },
    { a: 5, g: 5, q: 6006, phiQ: 1440, inEnergy: 6.944444e-4, leakOutside: 9.993056e-1 },
    { a: 30, g: 30, q: 1001, phiQ: 720, inEnergy: 1.388889e-3, leakOutside: 9.986111e-1 },
    { a: 210, g: 210, q: 143, phiQ: 120, inEnergy: 8.333333e-3, leakOutside: 9.916667e-1 },
    { a: 2310, g: 2310, q: 13, phiQ: 12, inEnergy: 8.333333e-2, leakOutside: 9.166667e-1 },
    { a: 10010, g: 10010, q: 3, phiQ: 2, inEnergy: 5.000000e-1, leakOutside: 5.000000e-1 },
    { a: 15015, g: 15015, q: 2, phiQ: 1, inEnergy: 1.000000e+0, leakOutside: 0.000000e+0 },
  ],

  reading:
    'The universality reading holds: as gcd(a,P) grows (alias approaches a '
    + 'small-modulus character), q shrinks and the in-algebra fraction 1/phi(q) '
    + 'rises from 1.736e-4 (a coprime to P, q=30030) to 1.0 (q=2, the alias '
    + 'e(n/2)=(-1)^n IS in the algebra as c_2). For a generic (coprime) alias '
    + 'over 99.98% of the energy leaks OUTSIDE the sieve algebra — the '
    + 'cancellation-bearing character content the freeze calculus cannot reach '
    + 'in-algebra. This confirms line 44 of perm-arch-sieve-universality-no-go '
    + 'numerically across gcd(a,P) from 1 to 15015. Not a bound; NO QED.',
});

export const IMP_95539_ALIAS_ENERGY_ASSERTIONS = Object.freeze([
  {
    name: 'every alias in-energy equals 1/phi(q) (Theorem U)',
    holds: () => IMP_95539_ALIAS_ENERGY_IN_ALGEBRA.table.every(
      (r) => Math.abs(r.inEnergy - 1 / r.phiQ) < 1e-6,
    ),
  },
  {
    name: 'in-energy + leakOutside sum to 1 for every alias',
    holds: () => IMP_95539_ALIAS_ENERGY_IN_ALGEBRA.table.every(
      (r) => Math.abs(r.inEnergy + r.leakOutside - 1) < 1e-6,
    ),
  },
  {
    name: 'q = P/gcd(a,P) for every alias, P = 30030',
    holds: () => IMP_95539_ALIAS_ENERGY_IN_ALGEBRA.table.every(
      (r) => r.q === 30030 / r.g,
    ),
  },
  {
    name: 'coprime alias a=1 reproduces the recorded 1.736e-4 = 1/phi(30030)',
    holds: () => {
      const r = IMP_95539_ALIAS_ENERGY_IN_ALGEBRA.table.find((x) => x.a === 1);
      return Math.abs(r.inEnergy - 1 / 5760) < 1e-9;
    },
  },
]);

export default IMP_95539_ALIAS_ENERGY_IN_ALGEBRA;
