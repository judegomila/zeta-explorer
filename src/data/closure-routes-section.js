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

  // imp-2362 -- numerical contractivity sweep for Route A.
  // Source: scripts/compute-imp-2362-route-a-schur.mjs (run 2026-06-03).
  // Tests |xi(s-a)| < |xi(s+a)| for Re(s) > 1/2, a > 0 over a grid; this is
  // numerical EVIDENCE for Conjecture 16.4 / 16.6, not a proof.
  routeANumericalEvidence: Object.freeze({
    ticketId: 'imp-2362',
    claim: '|xi(s-a)| < |xi(s+a)| for Re(s) > 1/2 and a > 0 (Route A Schur contractivity)',
    grid: Object.freeze({
      sigmaGrid: Object.freeze([0.51, 0.55, 0.6, 0.75, 1.0, 1.5, 2.0, 3.0]),
      aGrid: Object.freeze([0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0]),
      tRange: Object.freeze([0.0, 50.0]),
      tStep: 0.5,
      gridPoints: 5656,
    }),
    xiEvaluator:
      'log-modulus xi = 0.5 s(s-1) pi^{-s/2} Gamma(s/2) zeta(s); zeta via ' +
      'Borwein/Knopp-Hasse n=50 (matches src/math/zeta.js zetaCriticalStrip), ' +
      'logGamma via Lanczos g=7, folded to Re>=1/2 by xi(s)=xi(1-s). The ' +
      'eta-representation denominator (1 - 2^{1-s}) vanishes at s = 1 + 2pi i k / ln2 ' +
      '(true pole s=1 for k=0, removable spurious zeros otherwise); xi is entire ' +
      'there, so those evaluations are regularized by a 1e-6 imaginary nudge.',
    contractivityHolds: true,
    maxRatioObserved: 0.99990759,
    maxRatioAt: Object.freeze({ sigma: 0.51, a: 0.1, t: 0 }),
    failureCount: 0,
    supMonotoneDecreasingInSigma: true,
    perSigmaMaxRatio: Object.freeze([
      Object.freeze({ sigma: 0.51, maxRatio: 0.99990759 }),
      Object.freeze({ sigma: 0.55, maxRatio: 0.99953802 }),
      Object.freeze({ sigma: 0.6, maxRatio: 0.99907626 }),
      Object.freeze({ sigma: 0.75, maxRatio: 0.99769244 }),
      Object.freeze({ sigma: 1.0, maxRatio: 0.99539158 }),
      Object.freeze({ sigma: 1.5, maxRatio: 0.9908154 }),
      Object.freeze({ sigma: 2.0, maxRatio: 0.98628193 }),
      Object.freeze({ sigma: 3.0, maxRatio: 0.97738192 }),
    ]),
    interpretation:
      'Contractivity held at all 5656 grid points with no failures. The ' +
      'supremum of the ratio is largest near the critical line (0.99991 at ' +
      'sigma=0.51) and shrinks monotonically as sigma grows (0.97738 at ' +
      'sigma=3.0); within each sigma slice the maximum is attained at the ' +
      'smallest shift a=0.1 and t=0. This matches the analytic picture: the ' +
      'boundary modulus |Theta_a| = 1 on Re(s) = 1/2, with strict contraction ' +
      'in the open half-plane that deepens with both a and distance from the line.',
    caveat:
      'This SUPPORTS but does not prove Conjecture 16.4 / 16.6. The sweep ' +
      'samples a region that is empirically zero-free (RH holds far past these ' +
      'heights), so it confirms the behaviour expected under RH; it cannot probe ' +
      'the hypothetical 0 < a < Delta regime, which is exactly the circular ' +
      'dependency flagged in Principle 16.2. A contractivity sweep can falsify ' +
      'the conjecture but cannot close the non-circular gap.',
  }),

  // imp-2423: deposition of the Phragmen-Lindelof / maximum-modulus proof
  // ATTEMPT for Route A Schur contractivity |Theta_a| < 1 on the right
  // half-plane. This is an HONEST PARTIAL: a complete argument on a > Delta
  // plus a single, sharply-named remaining gap. No fabricated QED.
  routeAMaximumPrincipleAttempt: Object.freeze({
    ticketId: 'imp-2423',
    target: 'Conjecture 16.4 / 16.6 (Route A): |R_a(w)| < 1 for Re(w) > 0, a > 0, where R_a(w) = X(w-a)/X(w+a) and Theta_a is the same ratio in z-coordinates.',
    candidateArgument: Object.freeze({
      step1_boundaryIsUnimodular:
        'On the imaginary axis w = it the ratio is unimodular: |R_a(it)| = 1. ' +
        'Proof: X(w) = xi(1/2 + w) is EVEN (X(-w) = X(w), from the functional ' +
        'equation xi(s) = xi(1-s)) and REAL on the real axis (X(conj w) = ' +
        'conj X(w)). Hence X(it - a) = X(a - it) by evenness, and ' +
        'X(a - it) = conj X(a + it) by reality, so |X(it - a)| = |X(it + a)| ' +
        'and |R_a(it)| = 1 exactly. The boundary modulus equals 1 with no ' +
        'assumptions -- this is the natural input to a maximum-modulus argument.',
      step2_decayAlongRealAxis:
        'Along the positive real axis w -> +infinity the ratio DECAYS: ' +
        'R_a(w) = xi(1/2 + w - a) / xi(1/2 + w + a) -> 0, because xi grows ' +
        'super-exponentially (Gamma(s/2) factor) so the larger argument in the ' +
        'denominator dominates. So R_a is strictly contractive in the interior ' +
        'of at least one direction, consistent with the target sup = 1 attained ' +
        'only on the boundary.',
      step3_maximumModulus:
        'IF R_a is holomorphic AND of bounded type (Nevanlinna class) in the ' +
        'open right half-plane, then by the Phragmen-Lindelof form of the ' +
        'maximum-modulus principle for a half-plane, |R_a| <= sup on the ' +
        'boundary = 1 throughout, with strict inequality in the interior unless ' +
        'R_a is a unimodular constant (excluded by step 2). This would CLOSE ' +
        'Route A and hence give RH.',
    }),
    // The valuable part: pinning down exactly what is missing, and ruling out
    // a tempting false obstruction.
    completeOn: 'a > Delta. When the right half-plane {Re w > a} is zero-free past horizontal displacement a, E_a(z) = X(a - iz) is a Hermite-Biehler structure function, R_a / Theta_a is holomorphic and an inner (Schur) function of bounded type automatically, and steps 1-3 go through unconditionally. This reproduces the known unconditional result; it is RH-vacuous because a > Delta presupposes the zero-free region.',
    remainingGap:
      'SINGLE GAP (circular, Principle 16.2): for arbitrarily small a > 0 both ' +
      'hypotheses of step 3 -- holomorphy of R_a and its bounded type in the ' +
      'open right half-plane -- require X(w + a) =/= 0 for Re(w) > 0, i.e. no ' +
      'zero of X with real part > a, i.e. Delta < a. For a -> 0 that is exactly ' +
      'Delta = 0, the statement (RH) one is trying to prove. The maximum ' +
      'principle supplies no independent zero-free region, so the argument is ' +
      'circular without an external input.',
    growthObstructionRuledOut:
      'A natural worry is that Phragmen-Lindelof on the UNBOUNDED half-plane ' +
      'fails for a second, independent reason -- an a priori growth bound on ' +
      'R_a along rays into the interior (X = xi(1/2 + .) has order 1, so the ' +
      'ratio is only meromorphic of order <= 1). This deposition records that ' +
      'the growth condition is NOT an independent obstruction: in ANY zero-free ' +
      'right half-plane the Hermite-Biehler / de Branges structure makes ' +
      'Theta_a inner and therefore bounded type with modulus <= 1 for free, so ' +
      'the Phragmen-Lindelof growth hypothesis is supplied by the same zero-free ' +
      'region that supplies holomorphy. The obstruction is purely the zeros ' +
      '(Delta), not unbounded growth. This sharpens the Route A blocker by ' +
      'eliminating a candidate second gap.',
    deliversProof: false,
    consistentWithNumerics:
      'The imp-2362 sweep (routeANumericalEvidence) is exactly the boundary ' +
      'picture predicted here: max ratio approaches 1 at the critical-line ' +
      'corner (sigma -> 1/2, a -> 0, t -> 0) where |Theta_a| -> 1, and strict ' +
      'contraction deepens with both a and distance from the line.',
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
  {
    id: 'imp2362-route-a-numerical-evidence-coherent',
    holds: () => {
      const e = CLOSURE_ROUTES.routeANumericalEvidence;
      if (!e || e.ticketId !== 'imp-2362') return false;
      // Contractivity must hold with no failures and a max ratio strictly
      // below 1 but close to it (boundary modulus -> 1), and the per-sigma
      // maxima must decrease monotonically as sigma moves off the line.
      if (e.contractivityHolds !== true || e.failureCount !== 0) return false;
      if (!(e.maxRatioObserved < 1) || !(e.maxRatioObserved > 0.99)) return false;
      const ps = e.perSigmaMaxRatio;
      if (!Array.isArray(ps) || ps.length < 2) return false;
      return ps.every(
        (p, i) =>
          typeof p.maxRatio === 'number' &&
          p.maxRatio < 1 &&
          (i === 0 || p.maxRatio <= ps[i - 1].maxRatio + 1e-9)
      );
    },
    why:
      'The imp-2362 Route A contractivity sweep must report no failures, a ' +
      'max ratio strictly below 1 yet within 0.01 of it (boundary modulus = 1 ' +
      'at Re(s)=1/2), and per-sigma maxima that decrease monotonically away ' +
      'from the critical line. A regression here would silently misstate the ' +
      'numerical evidence for Conjecture 16.4 / 16.6.',
  },
  {
    id: 'imp2423-route-a-max-principle-honest-partial',
    holds: () => {
      const m = CLOSURE_ROUTES.routeAMaximumPrincipleAttempt;
      if (!m || m.ticketId !== 'imp-2423') return false;
      // Must NOT claim a proof, must name the single circular gap, and must
      // record that the Phragmen-Lindelof growth condition is not a second,
      // independent obstruction (it is supplied by the zero-free region).
      if (m.deliversProof !== false) return false;
      if (typeof m.remainingGap !== 'string' || m.remainingGap.length < 80) {
        return false;
      }
      if (!/circular|Principle 16\.2|Delta/i.test(m.remainingGap)) return false;
      if (
        typeof m.growthObstructionRuledOut !== 'string' ||
        !/bounded type|inner/i.test(m.growthObstructionRuledOut)
      ) {
        return false;
      }
      const a = m.candidateArgument;
      return (
        a &&
        typeof a.step1_boundaryIsUnimodular === 'string' &&
        /unimodular|= 1/i.test(a.step1_boundaryIsUnimodular)
      );
    },
    why:
      'The imp-2423 maximum-principle deposition must stay an HONEST PARTIAL: ' +
      'deliversProof=false, a boundary-unimodularity step, a single circular ' +
      'remaining gap (Principle 16.2 / Delta), and the explicit note that the ' +
      'Phragmen-Lindelof growth condition is supplied by the zero-free region ' +
      '(bounded type / inner) rather than being a second obstruction. A ' +
      'regression that flipped deliversProof or dropped the gap would fabricate ' +
      'a false closure of Route A / RH.',
  },
];
