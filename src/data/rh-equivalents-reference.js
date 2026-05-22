/**
 * @module rh-equivalents-reference
 * @fileoverview Curated catalog of known statements equivalent to the Riemann
 * Hypothesis. Each entry pins a named criterion, its precise statement, the
 * direction of equivalence (RH => S, S => RH, or both), the principal
 * reference, and project tickets in this repo that touch the equivalent.
 *
 * **What this file exports**
 * - `RH_EQUIVALENTS` — array of 12 frozen RH-equivalent statement records.
 * - `RH_EQUIVALENTS_ASSERTIONS` — array of build-time tripwires (>= 5)
 *   verifying citation completeness, equivalence-direction validity,
 *   structural integrity.
 * - `findByName(name)` — helper to look up an equivalent by name substring.
 *
 * **Scope distinction**
 * This file lists EQUIVALENTS — statements provably equivalent to RH (in
 * either direction or both). It is reference material, not a derivation of
 * the equivalences. The references point to the papers where each
 * equivalence was first or most cleanly established.
 *
 * **Tickets**: imp-1119 (created this file, haiku-4-5 bucket).
 */

/**
 * Curated catalog of 12 RH-equivalent statements. Equivalence direction:
 *   'RH=>S'   — RH implies S (S is a known consequence of RH; the converse
 *               is open, so S is necessary-but-not-clearly-sufficient).
 *   'S=>RH'   — S implies RH (S is a known sufficient condition; the
 *               converse may or may not be known).
 *   'both'    — Provably equivalent in both directions.
 *
 * @type {Array<{name: string, statement: string, direction: string,
 *               reference: string, year: number, ourRelation: string,
 *               relatedTickets: string[]}>}
 */
export const RH_EQUIVALENTS = [
  {
    name: 'Robin criterion',
    statement:
      'For every integer n > 5040, sigma(n) < e^gamma * n * log log n, where ' +
      'sigma is the sum-of-divisors function and gamma is the Euler-Mascheroni ' +
      'constant. Equivalence: this inequality holds for all n > 5040 iff RH holds.',
    direction: 'both',
    reference:
      'Robin, G. (1984). Grandes valeurs de la fonction somme des diviseurs et ' +
      'hypothese de Riemann. J. Math. Pures Appl. 63(2): 187-213.',
    year: 1984,
    ourRelation:
      'Pure arithmetic criterion. No active ticket — listed for completeness.',
    relatedTickets: [],
  },
  {
    name: 'Lagarias criterion',
    statement:
      'For every n >= 1, sigma(n) <= H_n + exp(H_n) * log(H_n), where ' +
      'H_n = sum_{k=1..n} 1/k is the n-th harmonic number. This inequality ' +
      'is equivalent to RH.',
    direction: 'both',
    reference:
      'Lagarias, J.C. (2002). An elementary problem equivalent to the Riemann ' +
      'Hypothesis. Amer. Math. Monthly 109(6): 534-543.',
    year: 2002,
    ourRelation:
      'Elementary restatement of Robin. No active ticket — pure arithmetic.',
    relatedTickets: [],
  },
  {
    name: 'de Bruijn-Newman constant Lambda = 0',
    statement:
      'The de Bruijn-Newman constant Lambda equals 0. Defined as the infimum ' +
      'of t such that the heat-flow-deformed xi function xi_t has only real ' +
      'zeros. Lambda <= 0 is equivalent to RH; combined with Rodgers-Tao 2020 ' +
      '(Lambda >= 0), Lambda = 0 is equivalent to RH.',
    direction: 'both',
    reference:
      'de Bruijn, N.G. (1950). The roots of trigonometric integrals. Duke ' +
      'Math. J. 17(3): 197-226. Rodgers, B. & Tao, T. (2020). The de Bruijn-' +
      'Newman constant is non-negative. Forum Math. Pi 8: e6.',
    year: 1950,
    ourRelation:
      'PRIMARY project target. The entire mathexplorer Lambda-attack chain ' +
      'targets Lambda <= 0 unconditionally via Routes A/B/C.',
    relatedTickets: [
      'imp-348',
      'imp-353',
      'imp-356',
      'imp-440',
      'imp-1083',
      'imp-1120',
    ],
  },
  {
    name: 'Li criterion (Bombieri-Lagarias)',
    statement:
      'The Li coefficients lambda_n = (1/(n-1)!) * d^n/ds^n [s^{n-1} log xi(s)] ' +
      'at s = 1 are all positive (lambda_n > 0 for all n >= 1). Equivalent to RH.',
    direction: 'both',
    reference:
      'Li, X.-J. (1997). The positivity of a sequence of numbers and the ' +
      'Riemann hypothesis. J. Number Theory 65(2): 325-333. Bombieri, E. & ' +
      'Lagarias, J.C. (1999). Complements to Li\'s criterion for the Riemann ' +
      'hypothesis. J. Number Theory 77(2): 274-287.',
    year: 1997,
    ourRelation:
      'Positivity-of-a-sequence criterion. Companion to the Jensen-polynomial ' +
      'positivity used in Rodgers-Tao 2020 Lambda >= 0.',
    relatedTickets: [],
  },
  {
    name: 'Nyman-Beurling criterion',
    statement:
      'The constant function 1 lies in the L^2((0,1), dx/x) closure of the ' +
      'linear span of the fractional-part functions { rho(theta/x) : 0 < ' +
      'theta < 1 } where rho(x) = x - floor(x). Equivalent to RH.',
    direction: 'both',
    reference:
      'Nyman, B. (1950). On some groups and semigroups of translations. PhD ' +
      'thesis, Uppsala. Beurling, A. (1955). A closure problem related to the ' +
      'Riemann zeta-function. Proc. Nat. Acad. Sci. USA 41: 312-314.',
    year: 1950,
    ourRelation:
      'Function-space criterion. Connects RH to approximation theory in ' +
      'L^2 spaces of fractional parts.',
    relatedTickets: [],
  },
  {
    name: 'Hilbert-Polya conjecture (spectral interpretation)',
    statement:
      'There exists a self-adjoint operator H on some Hilbert space whose ' +
      'eigenvalues are exactly the imaginary parts gamma_n of the non-trivial ' +
      'zeta zeros. Implies RH (eigenvalues of self-adjoint operators are real); ' +
      'the converse direction is conjectural.',
    direction: 'S=>RH',
    reference:
      'Polya, G. & Hilbert, D. (early 1900s, never published in writing). ' +
      'Modern formulation: Berry, M.V. & Keating, J.P. (1999). The Riemann ' +
      'zeros and eigenvalue asymptotics. SIAM Rev. 41(2): 236-266.',
    year: 1999,
    ourRelation:
      'Berry-Keating xp Hamiltonian (imp-1101), Connes adelic spectral ' +
      'interpretation (imp-1109), Selberg trace formula analog (imp-1104).',
    relatedTickets: ['imp-1101', 'imp-1104', 'imp-1109'],
  },
  {
    name: 'Strong pair correlation conjecture (Montgomery)',
    statement:
      'The normalized differences of consecutive non-trivial zeta zeros ' +
      '(gamma_{n+1} - gamma_n) * log(gamma_n) / (2 pi) follow the GUE pair ' +
      'correlation distribution 1 - (sin(pi u)/(pi u))^2. The strong (uniform) ' +
      'version implies RH; the unconditional Montgomery 1973 partial result ' +
      'is conditional on RH.',
    direction: 'S=>RH',
    reference:
      'Montgomery, H.L. (1973). The pair correlation of zeros of the zeta ' +
      'function. Proc. Sympos. Pure Math. 24: 181-193. Goldston, D.A. & ' +
      'Montgomery, H.L. (1987). Pair correlation of zeros and primes in short ' +
      'intervals. Progress in Math. 70: 183-203.',
    year: 1973,
    ourRelation:
      'Montgomery pair correlation numerical exploration (imp-1098); ' +
      'GUE Wigner-surmise vs first 10000 zeros (imp-1099).',
    relatedTickets: ['imp-1098', 'imp-1099'],
  },
  {
    name: 'Mertens function bound M(n) = O(n^{1/2 + epsilon})',
    statement:
      'The Mertens function M(n) = sum_{k=1..n} mu(k) (mu = Mobius function) ' +
      'satisfies M(n) = O(n^{1/2 + epsilon}) for every epsilon > 0. Equivalent ' +
      'to RH. (The stronger Mertens conjecture M(n) = O(n^{1/2}) was DISPROVED ' +
      'by Odlyzko-te Riele 1985.)',
    direction: 'both',
    reference:
      'Titchmarsh, E.C. (1986). The Theory of the Riemann Zeta-Function ' +
      '(2nd ed., revised by D.R. Heath-Brown). Oxford University Press, ' +
      'Chapter 14. Odlyzko, A.M. & te Riele, H.J.J. (1985). Disproof of the ' +
      'Mertens conjecture. J. Reine Angew. Math. 357: 138-160.',
    year: 1986,
    ourRelation:
      'Multiplicative-function criterion via Mobius. No active ticket — ' +
      'classical statement.',
    relatedTickets: [],
  },
  {
    name: 'Riesz function bound',
    statement:
      'The Riesz function R(x) = sum_{k=1..oo} (-1)^{k+1} x^k / ((k-1)! * ' +
      'zeta(2k)) satisfies R(x) = O(x^{1/4 + epsilon}) as x -> infinity for ' +
      'every epsilon > 0. Equivalent to RH.',
    direction: 'both',
    reference:
      'Riesz, M. (1916). Sur l\'hypothese de Riemann. Acta Math. 40: 185-190. ' +
      'Hardy, G.H. & Littlewood, J.E. (1918). Contributions to the theory of ' +
      'the Riemann zeta-function and the theory of the distribution of primes. ' +
      'Acta Math. 41: 119-196.',
    year: 1916,
    ourRelation:
      'Power-series-tail criterion. No active ticket — classical.',
    relatedTickets: [],
  },
  {
    name: 'Polya-Jensen polynomial hyperbolicity',
    statement:
      'The Jensen polynomials J_{d,n}(X) = sum_{j=0..d} binom(d,j) * ' +
      'gamma(n+j) * X^j associated to the Taylor coefficients gamma(n) of the ' +
      'Riemann xi function are hyperbolic (have only real roots) for all ' +
      'd >= 1 and all sufficiently large n. Equivalent to RH.',
    direction: 'both',
    reference:
      'Polya, G. (1927). Uber trigonometrische Integrale mit nur reellen ' +
      'Nullstellen. J. Reine Angew. Math. 158: 6-18. Griffin, M., Ono, K., ' +
      'Rolen, L. & Zagier, D. (2019). Jensen polynomials for the Riemann ' +
      'zeta function and other sequences. Proc. Natl. Acad. Sci. USA ' +
      '116(23): 11103-11110.',
    year: 1927,
    ourRelation:
      'Hyperbolicity criterion underlying Rodgers-Tao 2020 Lambda >= 0. The ' +
      'GORZ 2019 paper proved hyperbolicity at d = 3 unconditionally.',
    relatedTickets: ['imp-353', 'imp-1083'],
  },
  {
    name: 'Volchkov criterion (zero-free integral)',
    statement:
      'The double integral (1/pi) * integral_0^oo integral_{1/2}^oo ' +
      '(1 - 12 t^2) / (1 + 4 t^2)^3 * log|zeta(sigma + i t)| d sigma dt = ' +
      '(3 - gamma) / 32 holds. Equivalent to RH (Volchkov 1995).',
    direction: 'both',
    reference:
      'Volchkov, V.V. (1995). On an equality equivalent to the Riemann ' +
      'hypothesis. Ukrainian Math. J. 47: 491-493.',
    year: 1995,
    ourRelation:
      'Integral-identity criterion. Cleanly stateable closed-form integral.',
    relatedTickets: [],
  },
  {
    name: 'Speiser criterion (zeros of zeta-prime)',
    statement:
      'The Riemann hypothesis is equivalent to the statement that the ' +
      'derivative zeta\'(s) has no non-trivial zeros in the strip ' +
      '0 < Re(s) < 1/2. (Speiser 1934; Levinson-Montgomery 1974 gave the ' +
      'modern proof that the equivalence holds.)',
    direction: 'both',
    reference:
      'Speiser, A. (1934). Geometrisches zur Riemannschen Zetafunktion. ' +
      'Math. Ann. 110: 514-521. Levinson, N. & Montgomery, H.L. (1974). Zeros ' +
      'of the derivatives of the Riemann zeta-function. Acta Math. 133: ' +
      '49-65.',
    year: 1934,
    ourRelation:
      'Derivative-zero criterion. No active ticket — classical.',
    relatedTickets: [],
  },
];

/**
 * Look up an equivalent by name substring (case-insensitive).
 * Returns the first match or null.
 * @param {string} name
 */
export function findByName(name) {
  const lower = name.toLowerCase();
  return (
    RH_EQUIVALENTS.find((e) => e.name.toLowerCase().includes(lower)) ?? null
  );
}

export default RH_EQUIVALENTS;

// ── Build-time tripwires ───────────────────────────────────────────────────

export const RH_EQUIVALENTS_ASSERTIONS = [
  {
    id: 'imp1119-min-10-equivalents',
    holds: () => RH_EQUIVALENTS.length >= 10,
    why:
      'The ticket spec asks for 10-15 equivalents. Fewer than 10 fails the ' +
      'minimum coverage of the RH-equivalents landscape.',
  },
  {
    id: 'imp1119-all-have-direction',
    holds: () =>
      RH_EQUIVALENTS.every((e) =>
        ['RH=>S', 'S=>RH', 'both'].includes(e.direction)
      ),
    why:
      'Every entry must declare its equivalence direction as one of ' +
      '{"RH=>S", "S=>RH", "both"}. An empty or mistyped direction breaks the ' +
      'equivalence-class semantic.',
  },
  {
    id: 'imp1119-all-have-citation',
    holds: () =>
      RH_EQUIVALENTS.every(
        (e) =>
          typeof e.reference === 'string' &&
          e.reference.length >= 50 &&
          typeof e.year === 'number' &&
          e.year >= 1900 &&
          e.year <= 2030
      ),
    why:
      'Every entry must have a non-empty (>= 50 char) reference string and ' +
      'a sane publication year. Reference doc is useless without proper ' +
      'attributions.',
  },
  {
    id: 'imp1119-lambda-equivalent-present',
    holds: () =>
      RH_EQUIVALENTS.some(
        (e) =>
          e.name.includes('Lambda') &&
          e.direction === 'both' &&
          e.relatedTickets.includes('imp-440')
      ),
    why:
      'The Lambda = 0 equivalent (de Bruijn-Newman) MUST be present with ' +
      'direction "both" and linked to imp-440 (the project SOTA chain). ' +
      'This is the project anchor equivalent.',
  },
  {
    id: 'imp1119-robin-and-lagarias-present',
    holds: () => {
      const names = RH_EQUIVALENTS.map((e) => e.name);
      return (
        names.some((n) => n.includes('Robin')) &&
        names.some((n) => n.includes('Lagarias'))
      );
    },
    why:
      'Both Robin 1984 and Lagarias 2002 (the canonical elementary ' +
      'arithmetic equivalents) must appear. They are the most commonly cited ' +
      'concrete RH-equivalents in the elementary number-theory literature.',
  },
  {
    id: 'imp1119-li-criterion-present',
    holds: () =>
      RH_EQUIVALENTS.some(
        (e) => e.name.includes('Li') && e.direction === 'both'
      ),
    why:
      'The Li / Bombieri-Lagarias positivity criterion must be cataloged. ' +
      'It is the prototype positivity-of-sequence criterion underlying the ' +
      'Jensen-polynomial / Rodgers-Tao route.',
  },
  {
    id: 'imp1119-nyman-beurling-present',
    holds: () =>
      RH_EQUIVALENTS.some((e) => e.name.includes('Nyman-Beurling')),
    why:
      'The Nyman-Beurling functional-analysis criterion must appear. It is ' +
      'the canonical function-space-theoretic equivalent and connects RH to ' +
      'L^2 approximation theory.',
  },
  {
    id: 'imp1119-related-tickets-are-imp-ids',
    holds: () =>
      RH_EQUIVALENTS.every((e) =>
        Array.isArray(e.relatedTickets) &&
        e.relatedTickets.every(
          (t) => typeof t === 'string' && /^imp-\d+$/.test(t)
        )
      ),
    why:
      'All relatedTickets entries must be syntactically valid imp-NNNN ids. ' +
      'A typo (e.g. "imp_440" or "440") would break the project-relevance ' +
      'cross-reference.',
  },
  {
    id: 'imp1119-find-by-name-works',
    holds: () => {
      const hit = findByName('robin');
      return hit && hit.name === 'Robin criterion' && findByName('XXXNOSUCH') === null;
    },
    why:
      'The findByName(name) helper must locate "Robin" by case-insensitive ' +
      'substring and return null for unknown names. A broken lookup breaks ' +
      'downstream consumers.',
  },
];
