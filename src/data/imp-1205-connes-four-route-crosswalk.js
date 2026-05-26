/**
 * @module imp-1205-connes-four-route-crosswalk
 * @fileoverview Cross-walk: Connes 2025-2026 spectral triple framework vs paper
 * para 16 four-route equivalence. Maps each of the four closure routes
 * (A: Schur, B: de Branges, C: hidden-square, D: Weil/twin-ladder) to its
 * closest Connes adelic equivalent (or NOT-IDENTIFIED where no natural
 * correspondence exists). Includes 6 build-time tripwires.
 *
 * Para 16 of the paper establishes four equivalent routes to prove
 * Delta = 0 (zero bridge-thickness = RH). Connes' spectral triple
 * framework attacks RH via the Weil positivity criterion on the adele
 * class space C_Q = A_Q^{asterisk} / Q^{asterisk}. This file makes the
 * correspondence explicit so that readers already familiar with the Connes
 * framework can locate themselves in the four-route picture.
 *
 * SCOPE NOTE: "Connes 2025-2026" refers to the spectral-triple and
 * Weil-positivity line of work descending from the 1999 Selecta Math paper
 * (Connes, "Trace formula in noncommutative geometry and the zeros of the
 * Riemann zeta function"). The crosswalk is mathematically motivated, not
 * a line-by-line citation of a specific 2025-2026 preprint.
 *
 * Source tickets: imp-1205 (this file), imp-1197 (four-route reference doc),
 *                 imp-1109 (Connes adelic numerical check).
 * Paper reference: research-inputs/twin_ladder_consolidated_v52.pdf, para 16.
 */

/**
 * Match-strength vocabulary (ordered from most to least direct):
 *
 *   'DIRECT'         -- Route IS the Connes object, up to coordinate change.
 *   'STRONG'         -- Route and Connes object are two formulations of the
 *                       same RH-equivalent positivity condition; shared
 *                       bottleneck is clearly identical.
 *   'PARTIAL'        -- Structural analogy exists, but the Connes framework
 *                       does not phrase RH in these terms and the Connes
 *                       object is at best a weak correspondent.
 *   'NOT-IDENTIFIED' -- No natural Connes analog found; the route operates
 *                       in language that the adelic spectral-triple framework
 *                       does not organise.
 *
 * @type {Readonly<object>}
 */
export const CONNES_FOUR_ROUTE_CROSSWALK = Object.freeze({
  ticketId: 'imp-1205',
  paperRef: 'research-inputs/twin_ladder_consolidated_v52.pdf, para 16, pages 16-22',
  connesRef: 'Connes, A. (1999). Trace formula in noncommutative geometry and the zeros ' +
    'of the Riemann zeta function. Selecta Math. 5, 29-106. Extended 2025-2026 ' +
    'spectral-triple framework for RH.',
  title: 'Cross-walk: Connes 2025-2026 vs para 16 Four-Route Equivalence',

  summary:
    'Route D (Weil/twin-ladder) is the DIRECT Connes realisation: the twin-ladder ' +
    'quadratic form is the prime-side of the Connes/Weil trace formula on C_Q ' +
    'rewritten in log-prime delay coordinates. Route B (de Branges positivity) is a ' +
    'STRONG match: both are operator-kernel positivity conditions that are ' +
    'RH-equivalent by the same shared bottleneck. Routes A and C are PARTIAL: ' +
    'structural analogies exist but the Connes framework does not natively phrase ' +
    'RH as a Schur ratio or as a non-circular kernel factorization.',

  strongestMatchRoute: 'D',

  crosswalk: Object.freeze([
    Object.freeze({
      routeLetter: 'A',
      routeName: 'Schur contractivity / horizontal monotonicity',
      sectionRef: 'para 16.2',
      connesMatchStrength: 'PARTIAL',
      connesObject:
        'Operator-norm contractivity of the scaling action on L^2(C_Q). ' +
        'In Connes 1999 the scaling group R_+ acts on the adele class space and ' +
        'the spectral triple encodes its L^2 representation. The condition that the ' +
        'scattering matrix of this representation is contractive on appropriate ' +
        'sub-spaces is the closest Connes analog of Route A.',
      identification:
        'Route A requires |Theta_a(z)| < 1 for z in C_+, where ' +
        'Theta_a = E_a^{#} / E_a is the shifted bridge ratio. In the Connes picture ' +
        'the analogous object would be the scattering operator S_a associated to the ' +
        'spectral triple -- if S_a has operator norm less than 1 on the positive-' +
        'frequency L^2(C_Q) subspace then a contractivity condition holds. However, ' +
        'the Connes framework is not organised around the shift parameter a or around ' +
        'the specific function-theoretic ratio Theta_a, so the identification is ' +
        'structural but not canonical.',
      openGap:
        'The Connes scattering operator is not constructed from the completed xi-' +
        'kernel in the same way that Theta_a is. Without a canonical identification ' +
        'of a in terms of Connes spectral-triple data, Route A cannot be read off ' +
        'directly from the Connes framework. The shift parameter a does not have a ' +
        'distinguished adelic meaning.',
      connesLimitingPrinciple:
        'Principle 16.2 (Schur contractivity is circular) has no direct Connes ' +
        'counterpart because the adelic framework does not separate a shift-a ' +
        'regime from a full a > 0 regime; the Weil positivity criterion is ' +
        'uniform over all admissible test functions h.',
    }),

    Object.freeze({
      routeLetter: 'B',
      routeName: 'de Branges positivity',
      sectionRef: 'para 16.3',
      connesMatchStrength: 'STRONG',
      connesObject:
        'Weil positivity criterion: the Weil distribution W is non-negative on ' +
        'every admissible positive test function h. Equivalently, the spectral ' +
        'measure of the Connes scaling action on L^2(C_Q) is positive semidefinite.',
      identification:
        'Route B states: K_a >= 0 (de Branges kernel positive semidefinite) for ' +
        'every a > 0, i.e. |E_a(z)| > |E_a^{#}(z)| for z in C_+. The Connes ' +
        'Weil positivity criterion states: sum_gamma h(gamma) >= 0 for every ' +
        'admissible positive h -- equivalently the spectral measure of the adele ' +
        'class space scaling action is a positive Borel measure on the imaginary axis. ' +
        'Both are operator-positivity conditions on the same underlying object ' +
        '(the spectral kernel of the RH-encoding Hilbert space), and both are ' +
        'equivalent to RH by the same argument: an off-critical zero with ' +
        'Re(lambda) = delta > 0 manufactures an internal violation (upper-half-plane ' +
        'zero of E_a or a negative term in the zero-side sum). The shared bottleneck ' +
        'is identical: prove K_a >= 0 (or equivalently W_h >= 0) without assuming ' +
        'the zero-free region that makes the condition obvious.',
      openGap:
        'The Connes Weil positivity criterion is a global condition over all ' +
        'admissible h; Route B is a shift-parametrised condition at each a > 0. ' +
        'The exact relationship between the shift parameter a and the Fourier ' +
        'support of h is not pinned in either framework, so there is a translation ' +
        'step between "K_a >= 0 for all a > 0" and "W_h >= 0 for all h" that ' +
        'requires matching the Fourier-side data more carefully.',
      connesLimitingPrinciple:
        'Principle 16.3 (extending the de Branges construction to every positive ' +
        'shift is equivalent to RH) mirrors the Connes non-commutative-geometry ' +
        'challenge: extending the positive spectral measure from a truncated adele ' +
        'class space to the full C_Q is also equivalent to RH.',
    }),

    Object.freeze({
      routeLetter: 'C',
      routeName: 'Hidden-square kernel factorization',
      sectionRef: 'para 16.4',
      connesMatchStrength: 'PARTIAL',
      connesObject:
        'Gram representation of the Connes spectral kernel: the goal of realising ' +
        'the Weil distribution as an inner product W_h = ||Pi h||^2 in a natural ' +
        'Hilbert space Pi built from number-theoretic data without using the zeros.',
      identification:
        'Route C asks for a non-circular Gram factorization K_a(zeta,z) = ' +
        '<B_a(z), B_a(zeta)>_{H_a} built directly from the completed Riemann kernel ' +
        'and not from the zero set. The analogous Connes challenge is: construct ' +
        'the L^2(C_Q) inner product (Connes spectral triple) from the number-' +
        'theoretic data alone without deriving it from the zeros. Both seek a ' +
        'non-circular square root of the positivity condition. The canonical-system ' +
        'conjecture (Conjecture 16.6) -- build Theta_a as the transfer function of ' +
        'a passive canonical system from Phi -- is the closest analog of Connes ' +
        'spectral triple construction via a passive Dirac operator.',
      openGap:
        'The Connes spectral triple construction is organised around the adele class ' +
        'space, not around the cosh-representation X(w) = integral Phi(u) cosh(wu) du ' +
        'and the associated completed kernel. The specific non-local factorization ' +
        'required by Conjecture 16.4 (a Wronskian-type kernel with sign-indefinite ' +
        'cross-terms) has no direct Connes precedent. Route C and the Connes ' +
        'hidden-square goal are algebraically parallel but not canonically identified.',
      connesLimitingPrinciple:
        'Conjecture 16.4 (shift-bridge square) and Conjecture 16.6 (canonical-system ' +
        'closure) represent the most operator-theoretic of the four routes and therefore ' +
        'sit closest to the Connes spirit, but the specific completed-kernel construction ' +
        'required is more rigid than the abstract L^2(C_Q) framework of Connes.',
    }),

    Object.freeze({
      routeLetter: 'D',
      routeName: 'Weil / twin-ladder norm square',
      sectionRef: 'para 16.5',
      connesMatchStrength: 'DIRECT',
      connesObject:
        'Prime-side of the Connes / Weil trace formula on C_Q = A_Q^{asterisk} / Q^{asterisk}. ' +
        'The Weil explicit formula sum_gamma h(gamma) = W_inf(h) + sum_p W_p(h) ' +
        '(plus trivial-zero terms), with finite-prime local term ' +
        'W_p(h) = log(p) * sum_{k>=1} p^{-k/2} [g(k log p) + g(-k log p)], ' +
        'is the Connes trace formula for the scaling action on C_Q.',
      identification:
        'The twin-ladder quadratic form from Route D is ' +
        'Q_TL[h] = A_inf[h] - 2 sum_p sum_{m>=1} (log p) p^{-m/2} Re C_h(m log p), ' +
        'where A_inf[h] is the archimedean term and C_h(m log p) is the auto- ' +
        'correlation at rung m log p. This is EXACTLY the Weil explicit formula ' +
        'written in log-prime delay coordinates: the rung delay is tau_{p,m} = m log p ' +
        'and the rung amplitude is p^{-m/2}, recovering W_p(h) = log(p) sum_{k>=1} ' +
        'p^{-k/2} [g(k log p) + g(-k log p)] up to the symmetric real-part ' +
        'convention. The condition Q_TL[h] >= 0 for every admissible h is equivalent ' +
        'to the Weil positivity criterion W_h >= 0, which Connes (1999 Thm 3) proves ' +
        'is equivalent to RH. Route D IS the Connes route, in prime-delay arithmetic ' +
        'coordinates rather than in the adelic-class-space language.',
      openGap:
        'The twin-ladder form makes the prime-delay arithmetic fully explicit (each ' +
        'rung is a named p-adic delay), whereas the Connes framework organises the ' +
        'same data as a trace on L^2(C_Q). The remaining gap is identical in both ' +
        'languages: prove that the archimedean / kernel contribution A_inf[h] ' +
        'dominates every coherent prime-delay autocorrelation sum without using the ' +
        'zero-free hypothesis as input. No new obstruction is exposed by the ' +
        'Connes-vs-ladder dictionary; the open problem is the same bottleneck.',
      connesLimitingPrinciple:
        'Principle 16.5 (archimedean domination) is the direct adelic-language ' +
        'statement of the Weil positivity challenge. The obstacle that the Connes ' +
        'framework and Route D share is: construct the bridge operator B from the ' +
        'archimedean side alone, proving Q_TL[h] = ||Bh||^2 without circular ' +
        'reference to the zero set. Under RH the zero side supplies B abstractly; ' +
        'the non-circular construction is the open problem.',
    }),
  ]),

  connesFrameworkSummary: Object.freeze({
    coreObject: 'Adele class space C_Q = A_Q^{asterisk} / Q^{asterisk} with the ' +
      'canonical scaling action of R_+. Zeros of zeta appear as the absorption ' +
      'spectrum of the L^2(C_Q) representation of the scaling action (Connes 1999).',
    traceFormula:
      'sum_gamma h(gamma) = h(i/2) + h(-i/2) + W_inf(h) + sum_p W_p(h), ' +
      'with W_p(h) = log(p) sum_{k>=1} p^{-k/2} [g(k log p) + g(-k log p)]. ' +
      'Positivity of this formula for every admissible positive h is equivalent to RH.',
    positivityCriterion:
      'RH iff the Weil distribution W is non-negative on positive test functions. ' +
      'Equivalently, RH iff the spectral measure of the C_Q scaling action is a ' +
      'positive Borel measure on the imaginary axis.',
    relation_to_Route_D:
      'Route D is the twin-ladder arithmetic transcription of the Connes trace formula. ' +
      'The Weil explicit formula on C_Q and the twin-ladder form Q_TL[h] carry ' +
      'identical information; they differ only in coordinate language.',
    relation_to_Route_B:
      'Route B (K_a >= 0) is the shift-parametrised Hilbert-kernel form of the ' +
      'Connes Weil positivity criterion. Both are RH-equivalent positivity conditions ' +
      'on a spectral kernel; the translation between them involves matching the ' +
      'shift parameter a to the Fourier support of the test function h.',
  }),

  citations: Object.freeze([
    'Connes, A. (1999). "Trace formula in noncommutative geometry and the zeros ' +
      'of the Riemann zeta function". Selecta Math. 5, 29-106.',
    'Weil, A. (1952). "Sur les formules explicites de la theorie des nombres ' +
      'premiers". Comm. Sem. Math. Univ. Lund.',
    'de Branges, L. (1992). "The convergence of Euler products". J. Funct. Anal. 107, 122-210.',
    'Connes, A. and Consani, C. (2016). "Geometry and the quantum". Contemp. Math. 668.',
    'Li, X.-J. (1997). "The positivity of a sequence of numbers and the Riemann ' +
      'hypothesis". J. Number Theory 65, 325-333.',
  ]),
});

/**
 * Helper: look up a crosswalk entry by route letter (case-insensitive).
 * Returns the frozen entry or null.
 *
 * @param {string} letter - 'A', 'B', 'C', or 'D' (case-insensitive)
 * @returns {object|null}
 */
export function findCrosswalkEntry(letter) {
  if (typeof letter !== 'string' || letter.length !== 1) return null;
  const upper = letter.toUpperCase();
  const hit = CONNES_FOUR_ROUTE_CROSSWALK.crosswalk.find((e) => e.routeLetter === upper);
  return hit || null;
}

// ── Build-time tripwires (>= 5) ───────────────────────────────────────────────

export const CONNES_FOUR_ROUTE_CROSSWALK_ASSERTIONS = [
  {
    id: 'imp1205-four-crosswalk-entries-present',
    holds: () =>
      Array.isArray(CONNES_FOUR_ROUTE_CROSSWALK.crosswalk) &&
      CONNES_FOUR_ROUTE_CROSSWALK.crosswalk.length === 4 &&
      CONNES_FOUR_ROUTE_CROSSWALK.crosswalk.every(
        (e) => e && typeof e.routeLetter === 'string' && /^[A-D]$/.test(e.routeLetter)
      ),
    why:
      'The crosswalk must cover exactly four routes (A, B, C, D) matching para 16. ' +
      'A drift to three or five entries would silently misrepresent the four-route ' +
      'equivalence theorem and break the companion ClosureRoutesPage layout.',
  },
  {
    id: 'imp1205-route-D-is-DIRECT-match',
    holds: () => {
      const d = findCrosswalkEntry('D');
      return d !== null && d.connesMatchStrength === 'DIRECT';
    },
    why:
      'Route D (Weil/twin-ladder) must be identified as a DIRECT Connes realization ' +
      'because the twin-ladder form is the Weil explicit formula in log-prime delay ' +
      'coordinates, and the Weil formula IS the Connes trace formula on C_Q. ' +
      'Downgrading this to STRONG or PARTIAL would misrepresent the exact ' +
      'mathematical equivalence between Q_TL[h] and the Connes prime-side W_p(h) sum.',
  },
  {
    id: 'imp1205-route-B-is-STRONG-match',
    holds: () => {
      const b = findCrosswalkEntry('B');
      return b !== null && b.connesMatchStrength === 'STRONG';
    },
    why:
      'Route B (de Branges positivity K_a >= 0) must be identified as STRONG because ' +
      'the de Branges kernel positivity and the Weil/Connes positivity criterion are two ' +
      'formulations of the same RH-equivalent operator-positivity condition. Downgrading ' +
      'to PARTIAL would hide the tight connection to the Connes framework.',
  },
  {
    id: 'imp1205-strongest-match-is-D',
    holds: () => CONNES_FOUR_ROUTE_CROSSWALK.strongestMatchRoute === 'D',
    why:
      'The strongestMatchRoute field must record D. Route D achieves a DIRECT match ' +
      'because it is the same formula as the Connes Weil trace formula, making it ' +
      'strictly closer than any of the other three routes. A drift to another letter ' +
      'would misrepresent the pedagogical conclusion of the crosswalk.',
  },
  {
    id: 'imp1205-every-entry-has-required-fields',
    holds: () =>
      CONNES_FOUR_ROUTE_CROSSWALK.crosswalk.every(
        (e) =>
          typeof e.routeLetter === 'string' && e.routeLetter.length === 1 &&
          typeof e.routeName === 'string' && e.routeName.length >= 10 &&
          typeof e.connesMatchStrength === 'string' &&
          ['DIRECT', 'STRONG', 'PARTIAL', 'NOT-IDENTIFIED'].includes(e.connesMatchStrength) &&
          typeof e.connesObject === 'string' && e.connesObject.length >= 60 &&
          typeof e.identification === 'string' && e.identification.length >= 100 &&
          typeof e.openGap === 'string' && e.openGap.length >= 60
      ),
    why:
      'Each crosswalk entry must carry the required fields with substantive content. ' +
      'A thin identification or openGap description would leave the reader unable to ' +
      'locate themselves in the Connes framework, defeating the pedagogical purpose.',
  },
  {
    id: 'imp1205-route-D-identification-mentions-weil-formula',
    holds: () => {
      const d = findCrosswalkEntry('D');
      return (
        d !== null &&
        /Weil|trace formula|W_p|explicit formula/i.test(d.identification)
      );
    },
    why:
      'The Route D identification must mention the Weil explicit formula or the ' +
      'trace formula on C_Q. Omitting this would make the DIRECT match claim ' +
      'unsubstantiated and prevent the reader from verifying the coordinate ' +
      'change between Q_TL[h] and sum_p W_p(h).',
  },
  {
    id: 'imp1205-find-crosswalk-helper-works',
    holds: () => {
      const a = findCrosswalkEntry('a');
      const d = findCrosswalkEntry('D');
      const bogus = findCrosswalkEntry('Z');
      return (
        a !== null && a.routeLetter === 'A' &&
        d !== null && d.routeLetter === 'D' &&
        bogus === null &&
        findCrosswalkEntry('') === null &&
        findCrosswalkEntry(null) === null
      );
    },
    why:
      'findCrosswalkEntry must be case-insensitive for A-D, return null for any ' +
      'other letter, and handle empty / non-string inputs gracefully. Regressions ' +
      'in this helper would break any page component that looks up route data.',
  },
];
