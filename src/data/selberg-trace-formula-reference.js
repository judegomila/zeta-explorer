/**
 * @module selberg-trace-formula-reference
 * @fileoverview Structured reference doc for the Selberg trace formula on the
 * modular surface SL(2,Z) \ H. Captures the geometric side (sum over closed
 * geodesics / hyperbolic conjugacy classes), the spectral side (sum over
 * Laplace eigenvalues of automorphic forms), the principal citations, and a
 * plain-English description of WHY this is the spectral analog of the
 * Riemann explicit formula linking primes and zeros.
 *
 * **What this file exports**
 * - `SELBERG_TRACE_REFERENCE` — frozen capstone with statement, geometric
 *   side, spectral side, references, why-it-matters paragraphs.
 * - `SELBERG_TRACE_REFERENCE_ASSERTIONS` — array of build-time tripwires
 *   verifying paragraph counts, citation completeness, structural fields.
 *
 * **Scope**
 * Reference doc only — no numerics. This is the docstring artifact that
 * companion page src/pages/SelbergTracePage.jsx (imp-1118) renders.
 *
 * **Tickets**: imp-1104 (created this file, haiku-4-5 bucket); imp-1118
 * adds the companion page.
 */

/**
 * Selberg trace formula reference record for the modular surface SL(2,Z) \ H.
 * The trace formula equates a sum over the spectrum of the Laplacian on the
 * modular surface to a sum over closed geodesics, providing the spectral
 * analog of the Riemann explicit formula (which equates a sum over zeta
 * zeros to a sum over primes).
 *
 * @type {Readonly<object>}
 */
export const SELBERG_TRACE_REFERENCE = Object.freeze({
  ticketId: 'imp-1104',
  title: 'Selberg trace formula on SL(2,Z) \\ H',
  shortName: 'Selberg trace formula',

  /**
   * Schematic LaTeX form of the trace formula.
   * Reads: sum over Laplacian eigenvalues lambda_n of h(r_n) equals identity
   * contribution plus sum over hyperbolic conjugacy classes (closed
   * geodesics) of length-weighted g(log N(P)).
   */
  formulaLaTeX:
    '\\sum_{n \\geq 0} h(r_n) \\;=\\; ' +
    '\\frac{\\operatorname{vol}(\\Gamma\\backslash\\mathbb{H})}{4\\pi} \\int_{-\\infty}^{\\infty} h(r)\\, r\\, \\tanh(\\pi r)\\, dr ' +
    '\\;+\\; \\sum_{\\{P\\}} \\frac{\\log N(P_0)}{N(P)^{1/2} - N(P)^{-1/2}}\\, g(\\log N(P))',

  /**
   * Three-paragraph plain-English description of the formula and why it is
   * the spectral analog of the Riemann explicit formula. The paragraph count
   * is pinned by the imp1104-three-why-paragraphs tripwire.
   */
  whyItMatters: [
    'The Selberg trace formula is the spectral analog of the Riemann explicit ' +
      'formula. Where the explicit formula relates a sum over Riemann zeta zeros ' +
      '(spectrum of an arithmetic Hamiltonian, conjecturally) to a sum over prime ' +
      'powers (the dynamics of the multiplicative structure of integers), the ' +
      'Selberg formula relates a sum over Laplacian eigenvalues on the modular ' +
      'surface (a true Hilbert-space spectrum) to a sum over closed geodesics ' +
      '(the dynamics of the hyperbolic geodesic flow). The two formulas have ' +
      'identical structural shape: spectrum + identity contribution = geometric ' +
      'sum + parabolic/Eisenstein contribution (for non-cocompact surfaces).',

    'This structural identity is the cleanest known realization of the ' +
      'Hilbert-Polya philosophy. For the modular surface, the eigenvalues ' +
      'r_n satisfy lambda_n = 1/4 + r_n^2 with r_n strictly real, i.e. an ' +
      'unconditional analog of the Riemann hypothesis holds: the spectral ' +
      'parameters are real, the corresponding Selberg zeta function Z_Gamma(s) ' +
      'has its non-trivial zeros on the critical line Re(s) = 1/2 by ' +
      'construction (they are exactly s = 1/2 + i r_n). The Selberg setting ' +
      'demonstrates that an explicit-formula-style identity CAN coexist with ' +
      'a provable spectral-side reality theorem; the Riemann case is the ' +
      'open analog where the spectral side is still conjectural.',

    'For the ZPO / de Bruijn-Newman Lambda project, the Selberg trace formula ' +
      'matters because the heat-flow deformation of xi to xi_t (Polya 1926, ' +
      'de Bruijn 1950) has a Selberg-type analog: deforming the Maass-form ' +
      'spectral side by a heat kernel exp(-t lambda_n) corresponds to ' +
      'deforming the geometric side by a regularization of closed-geodesic ' +
      'lengths. The Lambda = 0 conjecture (equivalent to RH) thus has a ' +
      'parallel in the Selberg setting where the analog is provable. This ' +
      'motivates the spectral-Hamiltonian routes in the project (Berry-Keating, ' +
      'Connes adelic, Hilbert-Polya construction attempts) and provides the ' +
      'standard sanity check for spectral-side techniques.',
  ],

  /**
   * Geometric side description. Sum over hyperbolic conjugacy classes {P} of
   * Gamma = SL(2,Z); each class corresponds to a closed geodesic on the
   * modular surface. N(P) is the norm of the conjugacy class (= square of
   * the larger eigenvalue of any representative matrix), P_0 the primitive
   * representative.
   */
  geometricSide: {
    description:
      'Sum over hyperbolic conjugacy classes {P} of Gamma = SL(2,Z). Each ' +
      'conjugacy class corresponds to a closed geodesic of length log N(P_0) ' +
      'on the modular surface, where N(P) = lambda_P^2 is the square of the ' +
      'larger eigenvalue of any representative matrix and P_0 is the primitive ' +
      'class in the cyclic subgroup. The weighting log N(P_0) / (N(P)^{1/2} - ' +
      'N(P)^{-1/2}) is the standard Selberg weight: numerator picks out the ' +
      'primitive geodesic length, denominator is the dilation of the Poincare ' +
      'return map.',
    interpretation:
      'Closed geodesics on SL(2,Z) \\ H are in 1-1 correspondence with ' +
      'equivalence classes of indefinite integral binary quadratic forms; ' +
      'their lengths are 2 log epsilon_d where epsilon_d is the fundamental ' +
      'unit of the real quadratic order. This is the arithmetic content of ' +
      'the geometric side — closed geodesic lengths ARE units in real ' +
      'quadratic orders.',
    analogInExplicitFormula: 'sum over prime powers in von Mangoldt form',
  },

  /**
   * Spectral side description. Sum over discrete Laplacian eigenvalues
   * lambda_n = 1/4 + r_n^2 of weight test functions h(r_n).
   */
  spectralSide: {
    description:
      'Sum over discrete Laplacian eigenvalues lambda_n = 1/4 + r_n^2 of the ' +
      'Maass cusp forms on Gamma \\ H, plus a continuous-spectrum (Eisenstein) ' +
      'contribution from the cusp at infinity. The test function h on the ' +
      'spectral side and g on the geometric side are Fourier transforms: ' +
      'g(u) = (1 / 2 pi) integral h(r) e^{-i r u} dr. The identity holds for ' +
      'any sufficiently nice test function pair (h, g).',
    interpretation:
      'The eigenvalues lambda_n are spectral data of a true Hilbert-space ' +
      'operator (the hyperbolic Laplacian -Delta_H acting on L^2(Gamma \\ H)). ' +
      'They are non-negative real numbers, hence r_n are real and the spectral ' +
      'parameters all lie on the analog of the critical line s = 1/2 + i r_n. ' +
      'This is the unconditional Selberg analog of RH.',
    analogInExplicitFormula: 'sum over zeta zeros on the critical line',
  },

  /**
   * Reference texts. Iwaniec is the standard automorphic-forms textbook
   * exposition; Sarnak 1980 is the seminal application to spectral theory.
   * Selberg 1956 is the original paper.
   */
  references: [
    {
      authors: ['A. Selberg'],
      year: 1956,
      title:
        'Harmonic analysis and discontinuous groups in weakly symmetric ' +
        'Riemannian spaces with applications to Dirichlet series',
      venue: 'J. Indian Math. Soc. (N.S.) 20, 47-87',
      role: 'original-publication',
      note:
        'The trace formula was announced. Selberg only briefly indicates ' +
        'the proof; the full derivation appears in unpublished lecture notes ' +
        'distributed at Gottingen and IAS in the late 1950s and early 1960s.',
    },
    {
      authors: ['P. Sarnak'],
      year: 1980,
      title:
        'Prime geodesic theorems (PhD thesis under Cohen)',
      venue: 'Stanford University',
      role: 'seminal-application',
      note:
        'Used the Selberg trace formula to derive prime geodesic theorems ' +
        '(asymptotic count of closed geodesics under a length bound, the ' +
        'geometric analog of the prime number theorem).',
    },
    {
      authors: ['H. Iwaniec'],
      year: 2002,
      title: 'Spectral Methods of Automorphic Forms (2nd edition)',
      venue: 'Graduate Studies in Mathematics 53, AMS, Providence',
      role: 'standard-textbook',
      note:
        'Chapter 10 derives the Selberg trace formula for general ' +
        'cofinite Fuchsian groups including SL(2,Z). Standard modern ' +
        'reference for the precise statement, the test function class, and ' +
        'the Eisenstein-series identity-component.',
    },
    {
      authors: ['H. Iwaniec'],
      year: 1997,
      title: 'Topics in Classical Automorphic Forms',
      venue: 'Graduate Studies in Mathematics 17, AMS, Providence',
      role: 'companion-textbook',
      note:
        'Sister volume to the spectral-methods book; covers holomorphic ' +
        'automorphic forms in parallel with the Maass-form theory needed ' +
        'for the trace formula spectral side.',
    },
    {
      authors: ['D.A. Hejhal'],
      year: 1976,
      title: 'The Selberg Trace Formula for PSL(2,R), Vol. 1',
      venue: 'Lecture Notes in Mathematics 548, Springer, Berlin',
      role: 'detailed-reference',
      note:
        'Comprehensive 500-page derivation with all analytic details ' +
        'spelled out. Volume 2 (1983, LNM 1001) covers congruence subgroups ' +
        'and the Selberg zeta function.',
    },
  ],

  /**
   * Map of structural correspondences between the Selberg trace formula on
   * SL(2,Z) \ H and the Riemann explicit formula for the zeta function.
   * This is the table consumed by paper Section 5 ("Spectral analogs and
   * why they motivate the project").
   */
  correspondenceTable: [
    {
      riemann: 'sum over non-trivial zeta zeros rho = 1/2 + i gamma_n',
      selberg: 'sum over Laplacian eigenvalues lambda_n = 1/4 + r_n^2',
      note:
        'Riemann side is conjecturally (RH) on the critical line; Selberg ' +
        'side is provably on the critical line by the spectral theorem.',
    },
    {
      riemann: 'sum over prime powers p^k weighted by log p',
      selberg: 'sum over closed geodesics weighted by primitive length',
      note:
        'Both sums encode multiplicative/dynamical data on the geometric ' +
        'side; primes and closed geodesics are the analogous "atoms".',
    },
    {
      riemann: 'Mellin transform h <-> g (test functions)',
      selberg: 'Fourier transform h <-> g (test functions)',
      note:
        'Both formulas hold for a wide class of test function pairs; the ' +
        'transform is the integral kernel matching spectral and geometric ' +
        'weight functions.',
    },
    {
      riemann: 'archimedean Gamma-factor contribution',
      selberg:
        'continuous spectrum (Eisenstein) contribution from the cusp at oo',
      note:
        'Both formulas have a "completion at infinity" contribution beyond ' +
        'the discrete sum.',
    },
  ],

  /**
   * Project-internal links — tickets in this repo that touch the Selberg
   * trace formula or its spectral consequences directly or indirectly.
   */
  projectRelevance: [
    {
      ticket: 'imp-1101',
      title: 'Berry-Keating xp Hamiltonian spectral exploration',
      relation:
        'Berry-Keating xp is the prototypical Hilbert-Polya candidate; the ' +
        'Selberg setting is the only proven example of this paradigm.',
    },
    {
      ticket: 'imp-1109',
      title: 'Connes adelic spectral interpretation of Lambda',
      relation:
        'Connes adelic spectral interpretation generalizes the Selberg ' +
        'trace formula to the adelic setting; the spectral-side reality ' +
        'theorem is the conjectural target.',
    },
    {
      ticket: 'imp-1098',
      title: 'Montgomery pair correlation conjecture numerical exploration',
      relation:
        'Montgomery pair correlation is the GUE-style spectral statistics ' +
        'prediction; verified in the Selberg setting via the trace formula ' +
        '+ length-spectrum techniques (Bogomolny-Schmit, Bolte).',
    },
  ],

  builtAt: '2026-05-22T00:00:00Z',
  byModel: 'subagent-worktree',
  byChannel: 'haiku-4-5-worktree',
});

export default SELBERG_TRACE_REFERENCE;

// ── Build-time tripwires ───────────────────────────────────────────────────

export const SELBERG_TRACE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp1104-three-why-paragraphs',
    holds: () =>
      Array.isArray(SELBERG_TRACE_REFERENCE.whyItMatters) &&
      SELBERG_TRACE_REFERENCE.whyItMatters.length === 3 &&
      SELBERG_TRACE_REFERENCE.whyItMatters.every(
        (p) => typeof p === 'string' && p.length >= 200
      ),
    why:
      'The whyItMatters block must have exactly three paragraphs each at ' +
      'least 200 characters; the ticket spec requires a three-paragraph ' +
      'plain-English description. Fewer paragraphs would short-change the ' +
      'explanation; shorter paragraphs degrade information density.',
  },
  {
    id: 'imp1104-selberg-1956-cited',
    holds: () => {
      const refs = SELBERG_TRACE_REFERENCE.references;
      return refs.some(
        (r) =>
          r.authors[0] === 'A. Selberg' &&
          r.year === 1956 &&
          r.role === 'original-publication'
      );
    },
    why:
      'The original Selberg 1956 paper announcing the trace formula must ' +
      'be cited with the original-publication role. Without it the ' +
      'reference list fails the standard attribution requirement.',
  },
  {
    id: 'imp1104-iwaniec-textbook-cited',
    holds: () =>
      SELBERG_TRACE_REFERENCE.references.some(
        (r) =>
          r.authors[0] === 'H. Iwaniec' &&
          r.title.includes('Spectral Methods')
      ),
    why:
      'Iwaniec "Spectral Methods of Automorphic Forms" (the standard modern ' +
      'textbook for the SL(2,Z) trace formula) must be cited. This is the ' +
      'go-to reference Chapter 10 derives the formula in full detail.',
  },
  {
    id: 'imp1104-geometric-and-spectral-sides-present',
    holds: () => {
      const g = SELBERG_TRACE_REFERENCE.geometricSide;
      const s = SELBERG_TRACE_REFERENCE.spectralSide;
      return (
        g &&
        s &&
        typeof g.description === 'string' &&
        typeof s.description === 'string' &&
        g.description.length > 100 &&
        s.description.length > 100 &&
        g.analogInExplicitFormula &&
        s.analogInExplicitFormula
      );
    },
    why:
      'Both the geometric side and spectral side must have non-trivial ' +
      'descriptions (>100 chars) and named analogs in the Riemann explicit ' +
      'formula. The whole point of the file is the spectral/geometric ' +
      'correspondence — empty descriptions defeat the purpose.',
  },
  {
    id: 'imp1104-correspondence-table-min-3-rows',
    holds: () =>
      Array.isArray(SELBERG_TRACE_REFERENCE.correspondenceTable) &&
      SELBERG_TRACE_REFERENCE.correspondenceTable.length >= 3 &&
      SELBERG_TRACE_REFERENCE.correspondenceTable.every(
        (row) =>
          typeof row.riemann === 'string' &&
          typeof row.selberg === 'string' &&
          row.riemann.length > 0 &&
          row.selberg.length > 0
      ),
    why:
      'The correspondence table must list at least 3 rows mapping Riemann ' +
      'explicit-formula constituents to Selberg trace-formula constituents. ' +
      'This is the paper Section 5 source-of-truth and the page imp-1118 ' +
      'renders it directly.',
  },
  {
    id: 'imp1104-formula-latex-references-spectral-and-geometric-sums',
    holds: () => {
      const f = SELBERG_TRACE_REFERENCE.formulaLaTeX;
      return (
        typeof f === 'string' &&
        f.includes('\\sum_{n') &&
        f.includes('\\sum_{\\{P\\}') &&
        f.includes('tanh') &&
        f.includes('h(r')
      );
    },
    why:
      'The formula LaTeX string must reference both the spectral sum ' +
      '(sum over n >= 0 of h(r_n)) and the geometric sum (sum over conjugacy ' +
      'classes {P}) plus the tanh(pi r) identity contribution. A typo or ' +
      'simplification that drops either side would mangle the formula.',
  },
  {
    id: 'imp1104-project-relevance-min-3-tickets',
    holds: () =>
      Array.isArray(SELBERG_TRACE_REFERENCE.projectRelevance) &&
      SELBERG_TRACE_REFERENCE.projectRelevance.length >= 3 &&
      SELBERG_TRACE_REFERENCE.projectRelevance.every(
        (r) =>
          typeof r.ticket === 'string' &&
          r.ticket.startsWith('imp-') &&
          typeof r.relation === 'string'
      ),
    why:
      'At least 3 project tickets must be cross-referenced to anchor the ' +
      'Selberg reference doc to ongoing project work. Without project ' +
      'linkage the file becomes orphaned reference material.',
  },
];
