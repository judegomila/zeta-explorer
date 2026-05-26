/**
 * @module closure-routes-section
 * @fileoverview Structured reference doc for §16 of the user paper
 * `research-inputs/twin_ladder_consolidated_v52.pdf` (pages 16-22) titled
 * "Four Equivalent Closure Routes for the Zero-Bridge-Thickness Problem".
 *
 * The shifted-bridge threshold theorem of §15 reduces RH to the gap statement
 *
 *   Delta = 0   iff   K_a positive semidefinite for every a > 0.
 *
 * Section 16 records four natural ways to attempt this closure, proves their
 * equivalence (Theorem 16.1), identifies the shared bottleneck, and isolates
 * Conjecture 16.4 (shift-bridge square) and Conjecture 16.6 (canonical-system
 * closure) as the most concrete next targets.
 *
 * **What this file exports**
 * - `CLOSURE_ROUTES` — frozen record holding the four routes (A/B/C/D),
 *   the shared bottleneck, the two conjectures, and meta fields.
 * - `CLOSURE_ROUTES_ASSERTIONS` — build-time tripwires (>= 6) guarding
 *   the four-route presence, equivalence flag, conjecture naming, and
 *   non-empty shared bottleneck.
 * - `findRoute(letter)` — helper to look up a route by its single-letter
 *   identifier (A/B/C/D).
 *
 * **Scope distinction**
 * This file is a reference doc, not a proof. It pins the precise statement of
 * each route, the *current status* of the corresponding closure attempt
 * (essentially "RH-equivalent, open for arbitrarily small a > 0"), and the
 * structural blocker that prevents each route from closing non-circularly.
 *
 * **Tickets**: imp-1197 (this file + companion page).
 */

/**
 * Frozen capstone record for §16. Field semantics:
 *
 * - `routes`           — four-entry array, ordered A, B, C, D. Every entry has
 *                        `letter`, `name`, `statement` (plain English),
 *                        `equivalentStatement` (LaTeX), `currentStatus`,
 *                        `blocker`, and `principle` (the canonically named
 *                        obstruction principle from the paper).
 * - `sharedBottleneck` — the single statement that all four routes reduce to.
 * - `equivalenceFlag`  — boolean: true means the four routes are mathematically
 *                        the same final problem (Theorem 16.1). Pinned true.
 * - `conjecture16_4`   — shift-bridge square conjecture (hidden-square existence
 *                        for every a > 0, built from the completed kernel).
 * - `conjecture16_6`   — canonical-system closure conjecture (the strengthened
 *                        Route C target: Theta_a is the transfer function of a
 *                        passive canonical system).
 *
 * @type {Readonly<object>}
 */
export const CLOSURE_ROUTES = Object.freeze({
  ticketId: 'imp-1197',
  paperRef: 'research-inputs/twin_ladder_consolidated_v52.pdf, §16, pages 16-22',
  title: 'Four Equivalent Closure Routes for the Zero-Bridge-Thickness Problem',

  // Setup variables shared by all four routes.
  setup: Object.freeze({
    centeredCompletedLaTeX: 'X(w) := \\xi\\!\\left(\\tfrac{1}{2} + w\\right)',
    bridgeThicknessLaTeX: '\\Delta \\;:=\\; \\sup_{X(\\lambda)=0} |\\Re\\lambda|',
    shiftedBridgeLaTeX:
      'E_a(z) := X(a - iz), \\quad ' +
      'E_a^{\\#}(z) := \\overline{E_a(\\bar z)} = X(-a - iz), \\quad ' +
      '\\Theta_a(z) := \\frac{E_a^{\\#}(z)}{E_a(z)}',
    bridgeKernelLaTeX:
      'K_a(\\zeta, z) \\;:=\\; ' +
      '\\frac{\\overline{E_a(z)} E_a(\\zeta) - \\overline{E_a^{\\#}(z)} E_a^{\\#}(\\zeta)}{2\\pi i (\\bar\\zeta - z)}',
    thresholdTheoremLaTeX:
      '\\Delta = 0 \\;\\iff\\; K_a \\succeq 0 \\text{ for every } a > 0',
  }),

  // Theorem 16.1 -- the four routes are mathematically the same final problem.
  // Pinned true so a regression that breaks this claim trips the tripwire.
  equivalenceFlag: true,
  equivalenceTheoremName: 'Theorem 16.1 (Equivalent closure routes)',
  equivalenceProofSketch:
    'Route A iff Route B: shift-bridge threshold theorem (§15). Route B iff ' +
    'Route C: Hermite-Biehler / de Branges criterion -- Theta_a is Schur in ' +
    'the upper half-plane iff K_a is positive definite. Route C iff Route D: ' +
    'Kolmogorov factorization for positive kernels (kernel is positive ' +
    'definite iff it is a Gram kernel of vectors in a Hilbert space). ' +
    'Route A iff Route E (Weil): Weil positivity criterion in log-coordinate ' +
    'coherent-shell variables -- a delay r = m log p is a rung of the ' +
    'prime-delay ladder, so the twin-ladder quadratic form is the Weil ' +
    'explicit formula in ladder coordinates.',

  routes: Object.freeze([
    Object.freeze({
      letter: 'A',
      name: 'Schur contractivity / horizontal monotonicity',
      sectionRef: '§16.2',
      statement:
        'For every a > 0 and every w with Re(w) > 0, the shifted ratio ' +
        'X(w-a) / X(w+a) has modulus strictly less than 1. Equivalently, ' +
        '|xi(s-a)| < |xi(s+a)| for Re(s) > 1/2 and a > 0 (finite-shift ' +
        'horizontal monotonicity).',
      equivalentStatement:
        '\\left|\\frac{X(w - a)}{X(w + a)}\\right| < 1, \\quad ' +
        '\\Re w > 0, \\quad a > 0',
      currentStatus:
        'RH-equivalent and open for arbitrarily small a > 0. Proven by the ' +
        'maximum principle when a > Delta (i.e. when the right-half-plane is ' +
        'already known zero-free past horizontal displacement a), which is ' +
        'unconditional only for a sufficiently large.',
      blocker:
        'The candidate proof is a maximum-principle argument on R_a(w) = ' +
        'X(w-a)/X(w+a). The boundary modulus is unitary (|R_a| = 1 on Re(w)=0 ' +
        'by evenness + real-symmetry of X), so the maximum principle would ' +
        'close the route -- but only after one knows R_a is analytic in the ' +
        'right half-plane, which requires X(w+a) =/= 0 there, i.e. a > Delta. ' +
        'For arbitrarily small a > 0 this is exactly what one is trying to ' +
        'prove. Route A is therefore circular without an independent zero-free ' +
        'region.',
      principle:
        'Principle 16.2: Schur contractivity follows from a zero-free right ' +
        'half-plane. To turn it into a proof of RH one must obtain ' +
        'contractivity without first assuming the zero-free region that ' +
        'contractivity would imply.',
    }),
    Object.freeze({
      letter: 'B',
      name: 'de Branges positivity',
      sectionRef: '§16.3',
      statement:
        'For every a > 0, the shifted bridge kernel K_a is positive definite ' +
        'on the upper half-plane C_+. Equivalently, E_a(z) = X(a - iz) is a ' +
        'Hermite-Biehler / de Branges structure function for every a > 0, ' +
        'i.e. |E_a(z)| > |E_a^#(z)| for z in C_+.',
      equivalentStatement:
        '|E_a(z)| > |E_a^{\\#}(z)| \\;\\text{for}\\; z \\in \\mathbb{C}_+ \\;\\iff\\; K_a \\succeq 0',
      currentStatus:
        'RH-equivalent and open. Proven for a > Delta (exact threshold ' +
        'route): if X has a zero lambda = delta + i*gamma with delta > a, then ' +
        'E_a vanishes at z = -gamma + i(delta - a) in C_+, destroying the ' +
        'Hermite-Biehler property. So K_a positive iff there is no zero of X ' +
        'with delta > a. Hence K_a > 0 holds for a > Delta and fails for ' +
        'a < Delta.',
      blocker:
        'A shifted de Branges space exists unconditionally outside the ' +
        'critical strip, but extending the construction to every positive ' +
        'shift is exactly RH. The route does not produce any closure mechanism ' +
        'beyond "no zero with horizontal displacement > a" -- that is the ' +
        'statement Delta = 0 itself.',
      principle:
        'Principle 16.3: A shifted de Branges space exists unconditionally ' +
        'outside the critical strip, but extending the construction to every ' +
        'positive shift is equivalent to RH.',
    }),
    Object.freeze({
      letter: 'C',
      name: 'Hidden-square kernel factorization',
      sectionRef: '§16.4',
      statement:
        'For every a > 0 there exists a Hilbert space H_a and a map B_a such ' +
        'that the shifted bridge kernel admits the Gram factorization K_a(zeta, z) ' +
        '= <B_a(z), B_a(zeta)>_{H_a}. The hidden-square route asks for this ' +
        'factorization non-circularly, i.e. with B_a built directly from the ' +
        'completed kernel Phi and not from the zero set.',
      equivalentStatement:
        'K_a(\\zeta, z) = \\langle B_a(z), B_a(\\zeta)\\rangle_{\\mathcal{H}_a}',
      currentStatus:
        'RH-equivalent and open. RH supplies such a square abstractly through ' +
        'de Branges theory; the open problem is to construct it non-circularly ' +
        'from the completed kernel.',
      blocker:
        'Using the cosh-representation X(w) = int_0^infty Phi(u) cosh(wu) du, ' +
        'expanding cosh((a - iz)u) = cosh(au) cos(zu) - i sinh(au) sin(zu), ' +
        'and writing E_a = A_a - iB_a yields a Wronskian-type kernel ' +
        'K_a = (A_a(z) B_a(zeta) - B_a(z) A_a(zeta)) / (pi(bar(zeta) - z)). ' +
        'A pointwise sine-cosine identity would produce a positive square, but ' +
        'the actual representation contains independent kernel variables u, v, ' +
        'and the cross-terms are sign-indefinite. The factorization must ' +
        'therefore be NON-LOCAL -- a canonical-system, total-positivity, or ' +
        'operator-theoretic transform that reorganizes the completed kernel ' +
        'globally. No such transform has been constructed non-circularly.',
      principle:
        'Conjecture 16.4 (Shift-bridge square): The hidden square exists and ' +
        'is built directly from the completed Riemann kernel.',
    }),
    Object.freeze({
      letter: 'D',
      name: 'Weil / twin-ladder norm square',
      sectionRef: '§16.5',
      statement:
        'For every admissible coherent shell h, the completed twin-ladder ' +
        'quadratic form Q_TL[h] = A_infty[h] - 2 sum_p sum_{m>=1} (log p) ' +
        'p^{-m/2} Re C_h(m log p) is nonnegative. Equivalently, there exists ' +
        'a bridge operator B such that Q_TL[h] = ||Bh||^2 for every admissible ' +
        'h, constructed without using RH.',
      equivalentStatement:
        'Q_{TL}[h] \\;=\\; A_\\infty[h] - 2\\sum_{p}\\sum_{m\\geq 1} ' +
        '(\\log p)\\, p^{-m/2}\\, \\Re C_h(m\\log p) \\;\\geq\\; 0',
      currentStatus:
        'RH-equivalent and open. This is the Weil explicit formula rewritten ' +
        'in log-prime delay coordinates: tau_p = log p, E_{p,m} = m log p, ' +
        'amplitude p^{-m/2}. Under RH the zero side is a square ' +
        'Q_TL[h] = sum_gamma |hat h(gamma)|^2; if RH fails, off-critical zeros ' +
        'introduce cross-pairings (negative-norm "ghost states").',
      blocker:
        'The twin-ladder Weil form already contains the exact prime-delay ' +
        'arithmetic. The missing step is not identifying the rungs; it is ' +
        'proving that the completed archimedean / kernel contribution ' +
        'A_infty[h] dominates EVERY coherent prime-delay autocorrelation ' +
        'sum_p sum_m (log p) p^{-m/2} Re C_h(m log p) -- equivalently, ' +
        'producing the bridge operator B from the archimedean side alone.',
      principle:
        'Principle 16.5: The twin-ladder Weil form already contains the exact ' +
        'prime-delay arithmetic. The missing step is proving that the ' +
        'completed archimedean / kernel contribution dominates every coherent ' +
        'prime-delay autocorrelation.',
    }),
  ]),

  sharedBottleneck: Object.freeze({
    title: 'The shared bottleneck (§16.6)',
    statement:
      'Prove zero bridge-thickness non-circularly. Equivalently, prove any ' +
      'one of: |X(w-a)/X(w+a)| < 1, or K_a positive definite, or K_a = B_a* B_a, ' +
      'or Q_TL[h] >= 0 -- without using any of the others as an input.',
    godelianWitnessPrinciple:
      'If an off-critical zero rho = 1/2 + delta + i*gamma exists with ' +
      'delta > 0, and 0 < a < delta, then z_rho(a) := -gamma + i(delta - a) ' +
      'lies in the upper half-plane and satisfies E_a(z_rho(a)) = 0. The ' +
      'forbidden zero therefore creates a bridge-internal certificate (an ' +
      'upper-half-plane zero of E_a) that certifies failure of the Schur / ' +
      'de Branges condition. This is the "internal witness" structural ' +
      'pattern: off-critical zero implies internal certificate of failed ' +
      'positivity. The word "Godelian" is used analogically -- no logical ' +
      'incompleteness is imported.',
    why:
      'The four routes are equivalent (Theorem 16.1), so any successful proof ' +
      'must establish one of them WITHOUT using another RH-equivalent ' +
      'statement as input. Each route has its own characteristic ' +
      'obstruction (Principles 16.2 / 16.3 / Conj 16.4 / Principle 16.5), but ' +
      'all four reduce to the same single bottleneck: a non-circular proof of ' +
      'Delta = 0.',
  }),

  conjecture16_4: Object.freeze({
    label: 'Conjecture 16.4',
    name: 'Shift-bridge square conjecture',
    sectionRef: '§16.4',
    statement:
      'For every a > 0 there exists a Hilbert space H_a and a transform B_a, ' +
      'built directly from the completed Riemann kernel and NOT from the ' +
      'zero set, such that K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a}.',
    equivalentStatement:
      'K_a(\\zeta, z) = \\langle B_a(z), B_a(\\zeta)\\rangle_{\\mathcal{H}_a} \\quad \\forall\\, a > 0',
    impliesRH: true,
    note:
      'By Theorem 16.1, Conjecture 16.4 implies RH. Conversely, RH supplies ' +
      'such a square abstractly through de Branges theory. The open problem ' +
      'is to construct it non-circularly from the completed kernel Phi.',
  }),

  conjecture16_6: Object.freeze({
    label: 'Conjecture 16.6',
    name: 'Canonical-system closure conjecture',
    sectionRef: '§16.7',
    statement:
      'For every a > 0, the shifted bridge ratio Theta_a(z) = E_a^#(z) / E_a(z) ' +
      'is the transfer function of a passive canonical system constructed ' +
      'directly from the completed Riemann kernel. Equivalently, Theta_a is ' +
      'Schur in C_+ for every a > 0.',
    equivalentStatement:
      '\\Theta_a(z) = \\frac{E_a^{\\#}(z)}{E_a(z)} \\;\\text{is the transfer function of a passive canonical system}',
    impliesRH: true,
    note:
      'Conjecture 16.6 is the strengthened form of Route C suggested as the ' +
      '"most promising non-circular closure" in §16.7. If the canonical-system ' +
      'transform is contractive by construction, then Theta_a is Schur, K_a is ' +
      'positive, the hidden square exists, and RH follows. This is an ' +
      'operator-theoretic target: build the passive system from the kernel ' +
      'without using the zero set.',
  }),

  routeLetters: Object.freeze(['A', 'B', 'C', 'D']),
});

/**
 * Helper: find a route by its single-letter identifier (case-insensitive).
 * Returns the frozen route entry, or null if the letter is not A/B/C/D.
 *
 * @param {string} letter - one of 'A', 'B', 'C', 'D' (case-insensitive)
 * @returns {object|null}
 */
export function findRoute(letter) {
  if (typeof letter !== 'string' || letter.length !== 1) return null;
  const upper = letter.toUpperCase();
  const hit = CLOSURE_ROUTES.routes.find((r) => r.letter === upper);
  return hit || null;
}

// ── Build-time tripwires (>= 6) ───────────────────────────────────────────────
//
// These guard the structural invariants of CLOSURE_ROUTES. The
// run-assertions.mjs harness invokes every .holds() and fails the build if any
// returns false. The .why string is the human-readable failure reason.

export const CLOSURE_ROUTES_ASSERTIONS = [
  {
    id: 'imp1197-four-routes-present',
    holds: () =>
      Array.isArray(CLOSURE_ROUTES.routes) &&
      CLOSURE_ROUTES.routes.length === 4 &&
      CLOSURE_ROUTES.routes.every(
        (r) => r && typeof r.letter === 'string' && /^[A-D]$/.test(r.letter)
      ),
    why:
      'CLOSURE_ROUTES.routes must contain exactly 4 entries with letter ' +
      'identifiers A, B, C, D. Any other count or letter mis-tagging breaks ' +
      'the four-route equivalence framing of §16.',
  },
  {
    id: 'imp1197-routes-ordered-ABCD',
    holds: () =>
      CLOSURE_ROUTES.routes.map((r) => r.letter).join('') === 'ABCD',
    why:
      'Routes must appear in the canonical paper order A, B, C, D. Out-of-' +
      'order routes break the lettering used everywhere else in §16 and in ' +
      'the companion page.',
  },
  {
    id: 'imp1197-all-routes-equivalent-flag-true',
    holds: () => CLOSURE_ROUTES.equivalenceFlag === true,
    why:
      'CLOSURE_ROUTES.equivalenceFlag must be true. Theorem 16.1 states the ' +
      'four routes are mathematically the same final problem. Flipping the ' +
      'flag would silently misrepresent the paper.',
  },
  {
    id: 'imp1197-shared-bottleneck-non-empty',
    holds: () => {
      const sb = CLOSURE_ROUTES.sharedBottleneck;
      return (
        sb &&
        typeof sb.statement === 'string' &&
        sb.statement.length >= 80 &&
        typeof sb.godelianWitnessPrinciple === 'string' &&
        sb.godelianWitnessPrinciple.length >= 80
      );
    },
    why:
      'The shared-bottleneck statement and the Godelian-witness principle ' +
      'both must be present and substantive (>= 80 chars). The bottleneck ' +
      'narrative is §16.6 and is the central pedagogical point of the section.',
  },
  {
    id: 'imp1197-conjecture-16-4-named-and-implies-rh',
    holds: () => {
      const c = CLOSURE_ROUTES.conjecture16_4;
      return (
        c &&
        c.label === 'Conjecture 16.4' &&
        typeof c.name === 'string' &&
        c.name.toLowerCase().includes('shift-bridge square') &&
        c.impliesRH === true &&
        typeof c.statement === 'string' &&
        c.statement.length >= 100
      );
    },
    why:
      'Conjecture 16.4 (shift-bridge square) must be present, correctly ' +
      'labeled, flagged impliesRH=true, and have a substantive statement. ' +
      'This is the Route C hidden-square conjecture.',
  },
  {
    id: 'imp1197-conjecture-16-6-named-and-implies-rh',
    holds: () => {
      const c = CLOSURE_ROUTES.conjecture16_6;
      return (
        c &&
        c.label === 'Conjecture 16.6' &&
        typeof c.name === 'string' &&
        c.name.toLowerCase().includes('canonical-system') &&
        c.impliesRH === true &&
        typeof c.statement === 'string' &&
        c.statement.length >= 100
      );
    },
    why:
      'Conjecture 16.6 (canonical-system closure) must be present, correctly ' +
      'labeled, flagged impliesRH=true, and have a substantive statement. ' +
      'This is the strengthened Route C target named in §16.7.',
  },
  {
    id: 'imp1197-every-route-has-required-fields',
    holds: () =>
      CLOSURE_ROUTES.routes.every(
        (r) =>
          typeof r.name === 'string' &&
          r.name.length >= 10 &&
          typeof r.statement === 'string' &&
          r.statement.length >= 80 &&
          typeof r.equivalentStatement === 'string' &&
          r.equivalentStatement.length >= 10 &&
          typeof r.currentStatus === 'string' &&
          r.currentStatus.length >= 40 &&
          typeof r.blocker === 'string' &&
          r.blocker.length >= 80
      ),
    why:
      'Every route record must carry a non-empty (and substantive) name, ' +
      'plain-English statement, LaTeX-equivalent statement, currentStatus, ' +
      'and blocker. A route with a thin blocker description breaks the ' +
      '"why is this open" reading of §16.2-§16.5.',
  },
  {
    id: 'imp1197-find-route-helper-works',
    holds: () => {
      const a = findRoute('a');
      const d = findRoute('D');
      const bogus = findRoute('Z');
      return (
        a &&
        a.letter === 'A' &&
        d &&
        d.letter === 'D' &&
        bogus === null &&
        findRoute('') === null &&
        findRoute(null) === null
      );
    },
    why:
      'findRoute(letter) must be case-insensitive for A-D, return null for ' +
      'any other letter, and gracefully handle empty / non-string inputs.',
  },
  {
    id: 'imp1197-route-c-blocker-mentions-non-local',
    holds: () => {
      const c = findRoute('C');
      return (
        c &&
        /non-?local/i.test(c.blocker) &&
        /(Wronskian|sine-cosine|cross-term)/i.test(c.blocker)
      );
    },
    why:
      'Route C blocker must record that the obstruction is the non-locality ' +
      'of the desired factorization (Wronskian-type kernel, sign-indefinite ' +
      'cross-terms). This is the central technical point of §16.4 and the ' +
      'reason Conjecture 16.4 is non-trivial.',
  },
  {
    id: 'imp1197-routes-D-blocker-mentions-archimedean',
    holds: () => {
      const d = findRoute('D');
      return (
        d &&
        /archimedean|kernel contribution|A_?infty|A_\\infty/i.test(d.blocker)
      );
    },
    why:
      'Route D blocker must mention the archimedean / kernel contribution ' +
      '(A_infty). The Weil-route obstacle is exactly that the archimedean ' +
      'side must dominate every coherent prime-delay autocorrelation -- ' +
      'see Principle 16.5.',
  },
];
